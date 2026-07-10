#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent / "packages_src"

for path in ROOT.glob("*/frontend/index.tsx"):
    t = path.read_text(encoding="utf-8")
    o = t
    t = re.sub(r"import \{ useOutletContext \} from 'react-router-dom';\n", "", t)
    t = re.sub(r"import \{useOutletContext\} from 'react-router-dom';\n", "", t)
    t = re.sub(
        r"import \{useOutletContext,\s*([^}]+)\} from 'react-router-dom';\n",
        r"import {\1} from 'react-router-dom';\n",
        t,
    )
    t = re.sub(
        r"import \{([^,]+),\s*useOutletContext\} from 'react-router-dom';\n",
        r"import {\1} from 'react-router-dom';\n",
        t,
    )
    t = t.replace(
        "const { theme } = useOutletContext<{ theme: 'dark' | 'light'; language: 'en' | 'vi' }>();",
        "const { theme } = useAppShellContext();",
    )
    if t != o:
        path.write_text(t, encoding="utf-8")
        print("fixed", path.parent.parent.name)
