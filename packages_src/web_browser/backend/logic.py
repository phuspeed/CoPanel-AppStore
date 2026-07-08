"""
Web Browser logic — singleton Playwright headless Chromium with CDP screencast.

One shared session for all superadmin connections. Idle timeout stops Chromium
to reclaim ~300MB RAM.
"""
from __future__ import annotations

import asyncio
import logging
import os
import subprocess
import sys
import time
import uuid
from pathlib import Path
from typing import Any, Awaitable, Callable, Dict, Optional
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

IS_WINDOWS = os.name == "nt"
IDLE_TIMEOUT_SEC = 600
DEFAULT_WIDTH = 1280
DEFAULT_HEIGHT = 720
SCREENCAST_QUALITY = 60

FrameCallback = Callable[[Dict[str, Any]], Awaitable[None]]


def is_playwright_installed() -> bool:
    try:
        import playwright  # noqa: F401

        return True
    except ImportError:
        return False


def is_chromium_installed() -> bool:
    if not is_playwright_installed():
        return False
    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as pw:
            exe = pw.chromium.executable_path
            return bool(exe and Path(exe).is_file())
    except Exception:
        return False


def get_status() -> Dict[str, Any]:
    return {
        "playwright_installed": is_playwright_installed(),
        "chromium_installed": is_chromium_installed(),
        "running": session.is_running(),
        "current_url": session.current_url(),
        "viewport": {"width": session.width, "height": session.height},
        "connected": session.active_connection is not None,
    }


class BrowserSession:
    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._playwright = None
        self._browser = None
        self._context = None
        self._page = None
        self._cdp = None
        self.width = DEFAULT_WIDTH
        self.height = DEFAULT_HEIGHT
        self._running = False
        self._idle_task: Optional[asyncio.Task] = None
        self._frame_callback: Optional[FrameCallback] = None
        self.active_connection: Optional[str] = None
        self._last_activity = 0.0
        self._install_job_id: Optional[str] = None

    def is_running(self) -> bool:
        return self._running and self._page is not None

    def current_url(self) -> str:
        if self._page:
            try:
                return self._page.url or ""
            except Exception:
                return ""
        return ""

    def set_install_job_id(self, job_id: Optional[str]) -> None:
        self._install_job_id = job_id

    def get_install_job_id(self) -> Optional[str]:
        return self._install_job_id

    def _touch_activity(self) -> None:
        self._last_activity = time.time()
        if self._idle_task and not self._idle_task.done():
            self._idle_task.cancel()
        self._idle_task = asyncio.create_task(self._idle_watchdog())

    async def _idle_watchdog(self) -> None:
        try:
            await asyncio.sleep(IDLE_TIMEOUT_SEC)
            if time.time() - self._last_activity >= IDLE_TIMEOUT_SEC:
                logger.info("Web browser idle timeout — stopping Chromium")
                await self.stop()
        except asyncio.CancelledError:
            pass

    async def ensure_started(self, width: int = DEFAULT_WIDTH, height: int = DEFAULT_HEIGHT) -> None:
        async with self._lock:
            self.width = max(320, min(int(width), 1920))
            self.height = max(240, min(int(height), 1080))
            if self._running:
                if self._page:
                    await self._page.set_viewport_size({"width": self.width, "height": self.height})
                await self._restart_screencast()
                self._touch_activity()
                return

            if not is_playwright_installed():
                raise RuntimeError("Playwright is not installed. Install the module from App Store first.")
            if not is_chromium_installed():
                raise RuntimeError("Chromium browser binary is not installed. Use Install Chromium in the module.")

            from playwright.async_api import async_playwright

            self._playwright = await async_playwright().start()
            self._browser = await self._playwright.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"],
            )
            self._context = await self._browser.new_context(
                viewport={"width": self.width, "height": self.height},
                ignore_https_errors=True,
            )
            self._page = await self._context.new_page()
            self._cdp = await self._context.new_cdp_session(self._page)

            self._page.on("framenavigated", lambda frame: asyncio.create_task(self._on_navigated(frame)))
            self._cdp.on(
                "Page.screencastFrame",
                lambda params: asyncio.create_task(self._on_screencast_frame(params)),
            )
            await self._start_screencast()
            self._running = True
            self._touch_activity()

    async def _on_navigated(self, frame) -> None:
        if not self._page or frame != self._page.main_frame:
            return
        url = self._page.url
        if self._frame_callback:
            await self._frame_callback({"type": "url", "url": url})

    async def _on_screencast_frame(self, params: Dict[str, Any]) -> None:
        data = params.get("data")
        session_id = params.get("sessionId")
        if self._frame_callback and data:
            await self._frame_callback({"type": "frame", "data": data})
        if self._cdp and session_id is not None:
            try:
                await self._cdp.send("Page.screencastFrameAck", {"sessionId": session_id})
            except Exception:
                pass

    async def _start_screencast(self) -> None:
        if not self._cdp:
            return
        await self._cdp.send(
            "Page.startScreencast",
            {
                "format": "jpeg",
                "quality": SCREENCAST_QUALITY,
                "maxWidth": self.width,
                "maxHeight": self.height,
                "everyNthFrame": 1,
            },
        )

    async def _restart_screencast(self) -> None:
        if not self._cdp:
            return
        try:
            await self._cdp.send("Page.stopScreencast")
        except Exception:
            pass
        await self._start_screencast()

    def set_frame_callback(self, callback: Optional[FrameCallback]) -> None:
        self._frame_callback = callback

    def claim_connection(self, conn_id: str) -> Optional[str]:
        """Take over the single WS slot; returns evicted connection id if any."""
        prev = self.active_connection
        self.active_connection = conn_id
        return prev if prev and prev != conn_id else None

    def release_connection(self, conn_id: str) -> None:
        if self.active_connection == conn_id:
            self.active_connection = None

    async def stop(self) -> None:
        async with self._lock:
            if self._idle_task and not self._idle_task.done():
                self._idle_task.cancel()
            self._frame_callback = None
            self.active_connection = None
            for closer in (self._cdp, self._context, self._browser):
                if closer:
                    try:
                        await closer.close()
                    except Exception:
                        pass
            if self._playwright:
                try:
                    await self._playwright.stop()
                except Exception:
                    pass
            self._cdp = None
            self._page = None
            self._context = None
            self._browser = None
            self._playwright = None
            self._running = False

    async def resize(self, width: int, height: int) -> None:
        self.width = max(320, min(int(width), 1920))
        self.height = max(240, min(int(height), 1080))
        if self._page:
            await self._page.set_viewport_size({"width": self.width, "height": self.height})
            await self._restart_screencast()
        self._touch_activity()

    @staticmethod
    def _normalize_url(url: str) -> str:
        raw = (url or "").strip()
        if not raw:
            raise ValueError("URL is required.")
        if "://" not in raw:
            raw = "http://" + raw
        parsed = urlparse(raw)
        if parsed.scheme not in ("http", "https"):
            raise ValueError("Only http and https URLs are allowed.")
        if not parsed.netloc:
            raise ValueError("Invalid URL.")
        return raw

    async def navigate(self, url: str) -> str:
        if not self._page:
            raise RuntimeError("Browser is not running.")
        target = self._normalize_url(url)
        await self._page.goto(target, wait_until="domcontentloaded", timeout=60000)
        self._touch_activity()
        return self._page.url

    async def click(self, x: float, y: float, button: str = "left") -> None:
        if not self._page:
            return
        btn = button if button in ("left", "right", "middle") else "left"
        await self._page.mouse.click(float(x), float(y), button=btn)
        self._touch_activity()

    async def mouse_move(self, x: float, y: float) -> None:
        if not self._page:
            return
        await self._page.mouse.move(float(x), float(y))
        self._touch_activity()

    async def wheel(self, x: float, y: float, delta_y: float) -> None:
        if not self._page:
            return
        await self._page.mouse.move(float(x), float(y))
        await self._page.mouse.wheel(0, float(delta_y))
        self._touch_activity()

    async def key_press(self, key: str) -> None:
        if not self._page:
            return
        await self._page.keyboard.press(key)
        self._touch_activity()

    async def type_text(self, text: str) -> None:
        if not self._page:
            return
        await self._page.keyboard.type(text)
        self._touch_activity()

    async def go_back(self) -> None:
        if self._page:
            await self._page.go_back(wait_until="domcontentloaded", timeout=30000)
            self._touch_activity()

    async def go_forward(self) -> None:
        if self._page:
            await self._page.go_forward(wait_until="domcontentloaded", timeout=30000)
            self._touch_activity()

    async def reload(self) -> None:
        if self._page:
            await self._page.reload(wait_until="domcontentloaded", timeout=30000)
            self._touch_activity()

    async def handle_input(self, msg: Dict[str, Any]) -> None:
        t = msg.get("type")
        if t == "navigate":
            await self.navigate(str(msg.get("url", "")))
        elif t == "click":
            await self.click(msg.get("x", 0), msg.get("y", 0), str(msg.get("button", "left")))
        elif t == "mousemove":
            await self.mouse_move(msg.get("x", 0), msg.get("y", 0))
        elif t == "wheel":
            await self.wheel(msg.get("x", 0), msg.get("y", 0), msg.get("deltaY", 0))
        elif t == "key":
            await self.key_press(str(msg.get("key", "")))
        elif t == "type":
            await self.type_text(str(msg.get("text", "")))
        elif t == "resize":
            await self.resize(int(msg.get("width", DEFAULT_WIDTH)), int(msg.get("height", DEFAULT_HEIGHT)))
        elif t == "back":
            await self.go_back()
        elif t == "forward":
            await self.go_forward()
        elif t == "reload":
            await self.reload()
        else:
            raise ValueError(f"Unknown message type: {t}")


session = BrowserSession()


async def install_chromium(job) -> Dict[str, Any]:
    """Background job: download Chromium + system deps via Playwright."""
    if IS_WINDOWS:
        job.log("Windows dev: skipping --with-deps; running playwright install chromium")
        cmd = [sys.executable, "-m", "playwright", "install", "chromium"]
    else:
        cmd = [sys.executable, "-m", "playwright", "install", "--with-deps", "chromium"]

    job.update(progress=5, message="Starting Chromium install…")
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
    )
    assert proc.stdout is not None
    line_no = 0
    async for raw in proc.stdout:
        line = raw.decode("utf-8", errors="ignore").rstrip()
        if line:
            job.log(line)
            line_no += 1
            job.update(progress=min(95, 5 + line_no), message=line[:120])
    code = await proc.wait()
    if code != 0:
        raise RuntimeError(f"playwright install exited with code {code}")
    job.update(progress=100, message="Chromium installed")
    return {"installed": is_chromium_installed()}


def sync_install_chromium_subprocess() -> subprocess.CompletedProcess:
    if IS_WINDOWS:
        cmd = [sys.executable, "-m", "playwright", "install", "chromium"]
    else:
        cmd = [sys.executable, "-m", "playwright", "install", "--with-deps", "chromium"]
    return subprocess.run(cmd, capture_output=True, text=True, timeout=1800)


def new_connection_id() -> str:
    return str(uuid.uuid4())
