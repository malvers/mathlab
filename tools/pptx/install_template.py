#!/usr/bin/env python3
"""Install the design as a real PowerPoint template (.potx) in Office's gallery.

    python3 install_template.py [out/informatik-vorlage.pptx] [Informatik]

A .potx is not just a renamed .pptx: the content type of ppt/presentation.xml has
to say "template", otherwise PowerPoint opens the file itself instead of a copy.
"""
import os
import shutil
import sys
import zipfile

PPTX_CT = "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"
POTX_CT = "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"
GALLERY = os.path.expanduser(
    "~/Library/Group Containers/UBF8T346G9.Office/User Content.localized/Templates.localized")


def to_potx(src, dst):
    with zipfile.ZipFile(src) as z:
        items = [(i, z.read(i.filename)) for i in z.infolist()]
    with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as out:
        for info, blob in items:
            if info.filename == "[Content_Types].xml":
                blob = blob.decode().replace(PPTX_CT, POTX_CT).encode()
            out.writestr(info, blob)
    return dst


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "out", "informatik-vorlage.pptx")
    name = sys.argv[2] if len(sys.argv) > 2 else "Informatik"
    if not os.path.isdir(GALLERY):
        raise SystemExit(f"Office-Vorlagenordner nicht gefunden:\n  {GALLERY}")
    tmp = os.path.join(here, "out", name + ".potx")
    to_potx(src, tmp)
    dst = os.path.join(GALLERY, name + ".potx")
    shutil.copy2(tmp, dst)
    print(f"installiert: {dst}")
    print("PowerPoint -> Ablage -> Neu aus Vorlage; einmal neu starten, falls sie fehlt.")


if __name__ == "__main__":
    main()
