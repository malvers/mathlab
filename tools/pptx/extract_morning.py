#!/usr/bin/env python3
"""Holt die Begruessungs-Bilder aus Stift.pptx nach img/morning/.

Die Bilder sind fremdes Material (Pinterest u. a.) und gehoeren deshalb NICHT ins
oeffentliche Repo - img/ ist git-ignoriert. Dieses Skript stellt den Pool jederzeit
wieder her:

    python3 extract_morning.py [pfad/zu/Stift.pptx]

Genommen werden nur die randlosen Hochformat-Bilder der "Good morning!"-Folien.
"""
import hashlib
import os
import sys

from PIL import Image
from pptx import Presentation

HERE = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(HERE, "img", "morning")
SRC_DEFAULT = os.path.expanduser(
    "~/Library/Containers/com.microsoft.Powerpoint/Data/stift-export/Stift.pptx")
FALLBACK = os.path.expanduser(
    "~/Library/CloudStorage/OneDrive-PrivateSchuleIBBgGmbHDresden/MISC/RAHN/"
    "aus-OneDrive-Zip-2026-09-04/Alvers Backup/24_25/MISC/Stift.pptx")

TARGET_H = 1400          # genug fuer 540 pt Folienhoehe bei 2x Auflösung


def full_bleed(shape, slide_h):
    """Randloses Hochformat-Bild am linken Rand - das Begruessungs-Motiv."""
    if shape.shape_type != 13:
        return False
    return (shape.top <= slide_h * 0.02 and shape.height >= slide_h * 0.95
            and shape.width < shape.height)


def main(src):
    os.makedirs(DST, exist_ok=True)
    prs = Presentation(src)
    seen, n = set(), 0
    for i, slide in enumerate(prs.slides, 1):
        for sh in slide.shapes:
            if not full_bleed(sh, prs.slide_height):
                continue
            blob = sh.image.blob
            key = hashlib.sha1(blob).hexdigest()[:12]
            if key in seen:
                continue
            seen.add(key)
            tmp = os.path.join(DST, f"_{key}.bin")
            with open(tmp, "wb") as f:
                f.write(blob)
            im = Image.open(tmp).convert("RGB")
            if im.height > TARGET_H:
                im = im.resize((round(im.width * TARGET_H / im.height), TARGET_H),
                               Image.LANCZOS)
            out = os.path.join(DST, f"morning-{key}.jpg")
            im.save(out, "JPEG", quality=88, optimize=True)
            os.remove(tmp)
            n += 1
            print(f"  Folie {i:2d}  {im.width}x{im.height}  {os.path.basename(out)}")
    print(f"{n} Motive in {DST}")


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else SRC_DEFAULT
    if not os.path.exists(src):
        src = FALLBACK
    print("Quelle:", src)
    main(src)
