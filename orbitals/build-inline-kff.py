#!/usr/bin/env python3
"""Rebuild the inline KFF block in ../orbitals.html from orbital-math.js + main.js."""
from __future__ import annotations

import re
from pathlib import Path

BASE = Path(__file__).resolve().parent
HTML = BASE.parent / "orbitals.html"

TAIL_MARKER = '    </script>\n    <script>\n        function toggleSidebar'


def build_fragment() -> str:
    math_lines = (BASE / "orbital-math.js").read_text(encoding="utf-8").splitlines()
    math = "\n".join(
        line[7:] if line.startswith("export ") else line for line in math_lines
    )

    main_lines = (BASE / "main.js").read_text(encoding="utf-8").splitlines()
    main_rest = main_lines[8:]

    start_idx = None
    for i, line in enumerate(main_rest):
        if line.strip() == "fillOrbitalSelect();":
            start_idx = i
            break
    if start_idx is None:
        raise SystemExit("fillOrbitalSelect not found in main.js")

    defs = "\n".join(main_rest[:start_idx])
    tail_lines = main_rest[start_idx:]

    header = """import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
"""

    err_html = (
        '"<strong>KFF konnte nicht starten.</strong><br>Prüfe die Netzwerkverbindung (Three.js) oder die Konsole."'
        ' + "<br><br><small style=\\"opacity:0.85\\">" + (e && e.message ? e.message : String(e)) + "</small>"'
    )
    tail_block = "\n".join(
        [
            "try {",
            *[f"  {l}" for l in tail_lines],
            '  window.dispatchEvent(new Event("resize"));',
            "} catch (e) {",
            '  const el = document.getElementById("kff-error");',
            "  if (el) {",
            "    el.hidden = false;",
            f"    el.innerHTML = {err_html};",
            "  }",
            "  console.error(e);",
            "}",
        ]
    )

    out = f"{header}\n{math}\n{defs}\n{tail_block}\n"

    if re.search(r"</script", out, re.I):
        out = re.sub(r"</script", r'"<" + "script"', out, flags=re.I)

    return out


def main() -> None:
    frag = build_fragment()
    indented = "\n".join("        " + line for line in frag.splitlines())

    text = HTML.read_text(encoding="utf-8")
    if "    <script type=\"module\">\n" not in text:
        raise SystemExit("orbitals.html: expected KFF module block")
    pre, post = text.split("    <script type=\"module\">\n", 1)
    if TAIL_MARKER not in post:
        raise SystemExit("orbitals.html: missing tail marker after KFF module")
    _old, tail = post.split(TAIL_MARKER, 1)

    new_text = (
        pre
        + "    <script type=\"module\">\n"
        + indented
        + "\n"
        + TAIL_MARKER
        + tail
    )
    HTML.write_text(new_text, encoding="utf-8")
    print("updated", HTML, "inline module chars", len(indented))


if __name__ == "__main__":
    main()
