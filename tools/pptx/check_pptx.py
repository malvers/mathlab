#!/usr/bin/env python3
"""Package check for a .pptx - catches the breakages PowerPoint only answers with
"can't read this file" or a repair dialog.

    python3 check_pptx.py deck.pptx [more.pptx ...]

Checks: XML well-formedness, every relationship target exists, every part has a
content type, and at most one <p:bg> per slide/master (a second one is exactly
what triggers PowerPoint's repair prompt).
"""
import posixpath
import re
import sys
import zipfile

from lxml import etree

P_NS = "{http://schemas.openxmlformats.org/presentationml/2006/main}"


def check(path):
    problems = []
    with zipfile.ZipFile(path) as z:
        names = set(z.namelist())

        for name in sorted(names):
            if not name.endswith((".xml", ".rels")):
                continue
            try:
                root = etree.fromstring(z.read(name))
            except Exception as exc:
                problems.append(f"XML kaputt: {name} - {str(exc)[:90]}")
                continue
            for c_sld in root.iter(P_NS + "cSld"):
                if len(c_sld.findall(P_NS + "bg")) > 1:
                    problems.append(f"zwei <p:bg>: {name}")

        for name in sorted(n for n in names if n.endswith(".rels")):
            base = posixpath.dirname(posixpath.dirname(name))
            blob = z.read(name).decode("utf-8", "replace")
            for target, mode in re.findall(
                    r'Target="([^"]+)"(?:\s+TargetMode="([^"]*)")?', blob):
                if mode == "External" or target.startswith(("http", "mailto:")):
                    continue
                resolved = posixpath.normpath(posixpath.join(base, target))
                if resolved not in names:
                    problems.append(f"Beziehung ins Leere: {name} -> {target}")

        types = z.read("[Content_Types].xml").decode()
        defaults = set(re.findall(r'Default Extension="([^"]+)"', types))
        overrides = set(re.findall(r'Override PartName="/([^"]+)"', types))
        for name in sorted(names):
            if name == "[Content_Types].xml" or name.endswith(".rels"):
                continue
            if name not in overrides and name.rsplit(".", 1)[-1].lower() not in defaults:
                problems.append(f"ohne Content-Type: {name}")

    return problems


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    worst = 0
    for path in sys.argv[1:]:
        problems = check(path)
        if problems:
            worst = 1
            print(f"✗ {path}")
            for p in problems[:12]:
                print("   ", p)
            if len(problems) > 12:
                print(f"    ... und {len(problems) - 12} weitere")
        else:
            print(f"✓ {path}")
    return worst


if __name__ == "__main__":
    sys.exit(main())
