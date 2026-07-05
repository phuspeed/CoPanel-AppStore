#!/usr/bin/env python3
"""CLI entrypoint for cron-triggered Cloudflare DDNS updates."""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKEND_ROOT = Path("/opt/copanel/backend")
if BACKEND_ROOT.is_dir() and str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from modules.cloudflare_ddns.logic import run_all_ddns, run_ddns_for_interval  # noqa: E402


def _ts() -> str:
    return datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M:%S %z")


def _log_line(message: str) -> None:
    print(f"[{_ts()}] {message}", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Cloudflare DDNS updates")
    parser.add_argument("--interval", type=int, default=0, help="Only profiles with this interval (minutes)")
    parser.add_argument("--all", action="store_true", help="Run all enabled profiles")
    args = parser.parse_args()

    exit_code = 0

    if args.all:
        _log_line("run_all_ddns start")
        results = run_all_ddns()
        for row in results:
            if row.get("ok"):
                _log_line(f"OK {row.get('name')}: {row.get('status', row)}")
            else:
                exit_code = 1
                _log_line(f"FAIL {row.get('name')}: {row.get('error')}")
        _log_line(f"run_all_ddns done ({len(results)} profile(s))")
        return exit_code

    if args.interval > 0:
        _log_line(f"run_ddns_for_interval start interval={args.interval}m")
        results = run_ddns_for_interval(args.interval)
        if not results:
            _log_line(f"no enabled profiles for interval={args.interval}m")
            return 0
        for row in results:
            if row.get("ok"):
                _log_line(
                    f"OK {row.get('name')}: status={row.get('status')} ip={row.get('ip', '?')}"
                )
            else:
                exit_code = 1
                _log_line(f"FAIL {row.get('name')}: {row.get('error')}")
        _log_line(f"run_ddns_for_interval done ({len(results)} profile(s))")
        return exit_code

    _log_line("run_all_ddns start (default)")
    results = run_all_ddns()
    for row in results:
        if not row.get("ok"):
            exit_code = 1
            _log_line(f"FAIL {row.get('name')}: {row.get('error')}")
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
