#!/usr/bin/env python3
"""
Benennt PNG-Screenshots nach dem im oberen Bildstreifen erkannten *.html:
  egal/pfad/foo_bar.html → foo_bar.png  (nur Dateiname, kein Lab-Titel)

Voraussetzungen: Pillow, Tesseract (wie crop_lab_screenshot.py).

Beispiel:
  python rename_screenshots_html_basename.py
  python rename_screenshots_html_basename.py --dry-run
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from crop_lab_screenshot import extract_html_candidates  # noqa: E402


def ocr_top_strip(image_path: Path, ocr_height_ratio: float = 0.26) -> str:
    from PIL import Image

    im = Image.open(image_path).convert("RGB")
    w, h = im.size
    oh = max(120, int(h * ocr_height_ratio))
    strip = im.crop((0, 0, w, oh))
    tess = shutil.which("tesseract")
    if not tess:
        return ""

    import os

    fd, tmp_path = tempfile.mkstemp(suffix=".png")
    os.close(fd)
    try:
        strip.save(tmp_path, format="PNG")
        proc = subprocess.run(
            [tess, tmp_path, "stdout", "-l", "deu+eng"],
            capture_output=True,
            check=False,
            text=True,
        )
        return proc.stdout or ""
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def html_fragment_to_png_name(fragment: str) -> str | None:
    frag = fragment.strip().replace("\\", "/")
    if not frag.lower().endswith(".html"):
        return None
    base = frag.split("/")[-1]
    if not base.lower().endswith(".html"):
        return None
    stem = Path(base).stem
    if not stem:
        return None
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", stem):
        stem = re.sub(r"[^A-Za-z0-9_.-]+", "_", stem).strip("_")
    if not stem:
        return None
    return f"{stem}.png"


def pick_best_candidate(candidates: list[str]) -> str | None:
    if not candidates:
        return None
    return candidates[0]


def main() -> int:
    root = Path(__file__).resolve().parent.parent.parent
    default_dir = root / "HTML" / "resources" / "screenshots"

    ap = argparse.ArgumentParser(description="Screenshots nach HTML-Basisnamen umbenennen")
    ap.add_argument(
        "--dir",
        type=Path,
        default=default_dir,
        help=f"Ordner mit PNGs (Default: {default_dir})",
    )
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    shot_dir = args.dir.resolve()
    if not shot_dir.is_dir():
        sys.stderr.write(f"Ordner fehlt: {shot_dir}\n")
        return 1

    pngs = sorted(shot_dir.glob("*.png"))
    if not pngs:
        sys.stderr.write(f"Keine PNGs in {shot_dir}\n")
        return 0

    rows: list[tuple[Path, str]] = []
    failures: list[tuple[str, str]] = []

    for src in pngs:
        ocr = ocr_top_strip(src)
        frag = pick_best_candidate(extract_html_candidates(ocr))
        tn = html_fragment_to_png_name(frag) if frag else None
        if tn:
            rows.append((src, tn))
        else:
            failures.append((src.name, frag or "(kein .html in OCR)"))

    stem_counts: dict[str, int] = {}
    ops: list[tuple[Path, Path]] = []
    for src, tn in rows:
        stem = Path(tn).stem
        stem_counts[stem] = stem_counts.get(stem, 0) + 1
        n = stem_counts[stem]
        if n == 1:
            dst = shot_dir / tn
        else:
            dst = shot_dir / f"{stem}-{n}.png"
        ops.append((src, dst))

    for src, dst in ops:
        if src.resolve() == dst.resolve():
            continue
        prefix = "DRY: " if args.dry_run else ""
        print(f"{prefix}{src.name} -> {dst.name}")
        if not args.dry_run:
            if dst.exists() and dst.resolve() != src.resolve():
                dst.unlink()
            src.rename(dst)

    if failures:
        sys.stderr.write(f"\nOhne Zuordnung ({len(failures)}):\n")
        for name, reason in failures:
            sys.stderr.write(f"  {name}: {reason}\n")

    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
