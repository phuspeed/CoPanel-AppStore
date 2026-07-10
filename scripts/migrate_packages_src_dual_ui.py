#!/usr/bin/env python3
"""Migrate packages_src frontend to dual-UI (Classic + Desktop)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "packages_src"

COMPAT_IMPORT = """import { useAppShellContext } from '../../core/hooks/useAppShellContext';
import ModuleViewport from '../../core/shell/ModuleViewport';
"""


def strip_outlet_import(text: str) -> str:
    text = re.sub(
        r"import \{useOutletContext\} from 'react-router-dom';\n",
        "",
        text,
    )
    text = re.sub(
        r"import \{useOutletContext,\s*([^}]+)\} from 'react-router-dom';",
        r"import {\1} from 'react-router-dom';",
        text,
    )
    text = re.sub(
        r"import \{([^,]+),\s*useOutletContext\} from 'react-router-dom';",
        r"import {\1} from 'react-router-dom';",
        text,
    )
    return text


def add_compat_import(text: str) -> str:
    if "useAppShellContext" in text:
        return text
    first = text.find("import ")
    if first < 0:
        return COMPAT_IMPORT + text
    line_end = text.find("\n", first)
    return text[: line_end + 1] + COMPAT_IMPORT + text[line_end + 1 :]


def replace_hooks(text: str) -> str:
    text = text.replace(
        "const { theme, language } = useOutletContext<{ theme: 'dark' | 'light'; language: 'en' | 'vi' }>();",
        "const { theme, language } = useAppShellContext();",
    )
    text = text.replace(
        "const { theme } = useOutletContext<{ theme: 'dark' | 'light' }>();",
        "const { theme } = useAppShellContext();",
    )
    text = re.sub(
        r"const context = useOutletContext<\{[^}]+\}\>\(\);",
        "const context = useAppShellContext();",
        text,
    )
    return text


def wrap_return(text: str) -> str:
    if "<ModuleViewport" in text:
        return text
    m = re.search(r"\n  return \(\n    <", text)
    if not m:
        return text
    insert_at = m.end() - 1
    text = text[:insert_at] + "<ModuleViewport constrained>\n    <" + text[insert_at + 1 :]
    # close before final );
    text = re.sub(
        r"\n  \);\n\}\s*$",
        "\n    </ModuleViewport>\n  );\n}\n",
        text,
        count=1,
    )
    return text


def migrate_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "useOutletContext" not in text and "useAppShellContext" in text:
        print(f"skip {path.parent.parent.name}: already migrated")
        return False
    orig = text
    text = strip_outlet_import(text)
    text = add_compat_import(text)
    text = replace_hooks(text)
    text = wrap_return(text)
    if text == orig:
        print(f"warn {path.parent.parent.name}: no changes")
        return False
    path.write_text(text, encoding="utf-8")
    print(f"ok {path.parent.parent.name}")
    return True


def main() -> None:
    n = 0
    for path in sorted(ROOT.glob("*/frontend/index.tsx")):
        if migrate_file(path):
            n += 1
    print(f"migrated {n} files")


if __name__ == "__main__":
    main()
