#!/usr/bin/env python3
"""
Crop „Chrome + Dock“ aus macOS-Vollbild-Screenshots von Cyber-Labs.

Workflow (DER Weg zum SS):
  1. Oberen Bildstreifen per OCR lesen → *.html aus der Browserzeile (file://-Pfad).
  2. Dateiname aus labs-config.js (title) auflösen.
  3. Lab-Viewport zuschneiden (wie manuell zuvor).

Voraussetzungen: Pillow (pip), Tesseract im PATH (brew install tesseract).

Beispiel:
  python crop_lab_screenshot.py ~/Desktop/Bildschirmfoto.png
  python crop_lab_screenshot.py *.png --out-dir ../../HTML/resources/screenshots
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def repo_root_from_here() -> Path:
    return Path(__file__).resolve().parent.parent.parent


def parse_labs_config(config_path: Path) -> dict[str, str]:
    """href -> title aus labs-config.js (kein JSON-Parser nötig)."""
    text = config_path.read_text(encoding="utf-8")
    href_to_title: dict[str, str] = {}
    for m in re.finditer(r'"href"\s*:\s*"([^"]+\.html)"', text):
        href = m.group(1)
        window = text[m.start() : m.start() + 2000]
        tm = re.search(r'"title"\s*:\s*"([^"]+)"', window)
        if tm:
            href_to_title[href.strip().lower()] = tm.group(1).strip()
    return href_to_title


def ocr_top_strip(image_path: Path, ocr_height_ratio: float = 0.26) -> str:
    """Nur oberer Streifen (Adresszeilen-Region) OCR-en."""
    from PIL import Image

    im = Image.open(image_path).convert("RGB")
    w, h = im.size
    oh = max(120, int(h * ocr_height_ratio))
    strip = im.crop((0, 0, w, oh))
    tess = shutil.which("tesseract")
    if not tess:
        sys.stderr.write(
            "tesseract nicht gefunden (PATH). z.B.: brew install tesseract\n"
        )
        return ""

    fd, tmp_path = tempfile.mkstemp(suffix=".png")
    os.close(fd)
    try:
        strip.save(tmp_path, format="PNG")
        proc = subprocess.run(
            [tess, tmp_path, "stdout"],
            capture_output=True,
            check=False,
        )
        if proc.returncode != 0:
            sys.stderr.write(proc.stderr.decode("utf-8", errors="replace"))
            return ""
        return proc.stdout.decode("utf-8", errors="replace")
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def extract_html_candidates(ocr_text: str) -> list[str]:
    """Sucht Pfade wie foo.html oder Pfad/bar.html in OCR-Müll."""
    raw = ocr_text.replace("\\", "/")
    found = set(re.findall(r"(?:[/\\]|^)([A-Za-z0-9_./-]+\.html)", raw, flags=re.I))
    # auch ohne Slash: "orbitals.html"
    found |= set(re.findall(r"\b([A-Za-z0-9_/-]+\.html)\b", raw, flags=re.I))
    # häufige OCR-Fehler: Leerzeichen vor .html
    raw2 = re.sub(r"\s*\.\s*html", ".html", raw, flags=re.I)
    found |= set(re.findall(r"\b([A-Za-z0-9_/-]+\.html)\b", raw2, flags=re.I))
    out = [f for f in found if ".html" in f.lower()]
    # Sort: kürzere Basenames zuerst bevorzugen? lieber längere Pfade zuerst für LensStandalone/...
    out.sort(key=lambda s: (-len(s), s.lower()))
    return out


def resolve_lab_title(
    href_to_title: dict[str, str], html_fragment: str
) -> str | None:
    key = html_fragment.strip().lower().lstrip("/")
    if key in href_to_title:
        return href_to_title[key]
    base = Path(key).name.lower()
    if base in href_to_title:
        return href_to_title[base]
    # Teilpfad Ende …/orbitals.html
    for hk, title in href_to_title.items():
        if hk.endswith(base) or hk.endswith("/" + base):
            return title
    return None


def sanitize_filename(title: str) -> str:
    s = title.strip()
    if s.lower().endswith(".png"):
        s = s[:-4]
    for a, b in [("/", "-"), (":", ""), ("*", ""), ("?", ""), ('"', ""), ("<", ""), (">", "")]:
        s = s.replace(a, b)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "Lab"


# --- Crop (gleiche Heuristik wie bei den batch crops) ---


def row_brightness(im, y: int) -> float:
    from PIL import Image

    pixels = im.load()
    w = im.width
    step = max(1, w // 120)
    s = n = 0
    for x in range(0, w, step):
        r, g, b = pixels[x, y]
        s += (r + g + b) / 3
        n += 1
    return s / n


def find_crop_top(im) -> int:
    w, h = im.size
    for y in range(240, min(520, h)):
        rb = row_brightness(im, y)
        rb_prev = row_brightness(im, y - 1) if y > 0 else 999
        if rb < 28 and rb_prev > 45:
            return y
        if y >= 300:
            if row_brightness(im, y) < 22 and row_brightness(im, y + 1) < 24:
                if row_brightness(im, y + 2) < 26 and row_brightness(im, y - 1) > 35:
                    return y
    return 320


def find_crop_bottom(im, top: int) -> int:
    h = im.height
    pixels = im.load()
    w = im.width
    step = max(1, w // 120)

    def row_avg(y: int) -> float:
        s = n = 0
        for x in range(0, w, step):
            r, g, b = pixels[x, y]
            s += (r + g + b) / 3
            n += 1
        return s / n

    for y in range(h - 1, top + 400, -1):
        avg = row_avg(y)
        if avg > 55:
            yy = y
            while yy > top + 100:
                yy -= 1
                if row_avg(yy) < 38:
                    return yy
            return min(h - 5, im.height - 3)
    return h - 120


def find_crop_horizontal(im, top: int, bottom: int) -> tuple[int, int]:
    pixels = im.load()
    w = im.width
    step_y = max(15, (bottom - top) // 80)

    def col_avg(x: int) -> float:
        s = n = 0
        for y in range(top, bottom, step_y):
            r, g, b = pixels[x, y]
            s += (r + g + b) / 3
            n += 1
        return s / n if n else 999

    left = 0
    for x in range(0, min(40, w)):
        if col_avg(x) < 40:
            left = x
            break
    for x in range(left, min(left + 24, w)):
        if col_avg(x) < 22:
            left = x
            break

    right = w - 1
    for x in range(w - 1, max(w - 40, 0), -1):
        if col_avg(x) < 40:
            right = x
            break
    for x in range(right, max(right - 24, left), -1):
        if col_avg(x) < 28:
            right = x
            break

    return left, min(right + 1, w)


def crop_lab_viewport(im):
    from PIL import Image

    top = find_crop_top(im)
    bottom = find_crop_bottom(im, top)
    left, right = find_crop_horizontal(im, top, bottom)
    bottom = min(bottom + 1, im.height)
    return im.crop((left, top, right, bottom))


def process_one(
    image_path: Path,
    out_dir: Path,
    config_path: Path,
    name_override: str | None,
    dry_run: bool,
) -> tuple[bool, str]:
    from PIL import Image

    href_to_title = parse_labs_config(config_path)

    ocr = ocr_top_strip(image_path)
    candidates = extract_html_candidates(ocr)

    title_guess: str | None = None
    matched_href: str | None = None
    if name_override:
        title_guess = name_override.strip()
    else:
        for cand in candidates:
            t = resolve_lab_title(href_to_title, cand)
            if t:
                title_guess = t
                matched_href = cand
                break
        if not title_guess and candidates:
            stem = Path(candidates[0]).stem.replace("-", " ").replace("_", " ")
            title_guess = stem or "Lab"
            sys.stderr.write(
                f"[{image_path.name}] Kein labs-config-Treffer für OCR ({candidates[:3]}); "
                f"nutze Dateiname: {title_guess}\n"
            )
        elif not title_guess:
            sys.stderr.write(
                f"[{image_path.name}] Keine *.html in der Browserzeile (OCR). "
                "Nutze --name \"…\" oder prüfe Schärfe/Ausschnitt.\n"
            )
            title_guess = image_path.stem

    base = sanitize_filename(title_guess)
    out_path = out_dir / f"{base}.png"

    if dry_run:
        print(
            f"Would write: {out_path}\n"
            f"  OCR html candidates: {candidates[:5]}\n"
            f"  matched href: {matched_href}\n"
            f"  title: {title_guess}"
        )
        return True, str(out_path)

    out_dir.mkdir(parents=True, exist_ok=True)
    im = Image.open(image_path).convert("RGB")
    cropped = crop_lab_viewport(im)
    cropped.save(out_path, optimize=True)
    print(out_path)
    return True, str(out_path)


def main() -> int:
    root = repo_root_from_here()
    default_config = root / "HTML" / "js" / "labs-config.js"
    default_out = root / "HTML" / "resources" / "screenshots"

    ap = argparse.ArgumentParser(
        description="Crop Lab-Screenshot: URL aus OCR → Dateiname aus labs-config."
    )
    ap.add_argument(
        "images",
        nargs="+",
        type=Path,
        help="PNG-Vollbildscreenshots (Chrome)",
    )
    ap.add_argument(
        "--out-dir",
        type=Path,
        default=default_out,
        help=f"Ausgabeordner (Default: {default_out})",
    )
    ap.add_argument(
        "--config",
        type=Path,
        default=default_config,
        help="Pfad zu labs-config.js",
    )
    ap.add_argument(
        "--name",
        help="Titel/Dateiname erzwingen (ohne .png); nur mit genau einer Bilddatei",
    )
    ap.add_argument(
        "--dry-run",
        action="store_true",
        help="Nur OCR + geplanten Pfad anzeigen",
    )
    args = ap.parse_args()

    if args.name and len(args.images) != 1:
        sys.stderr.write("--name ist nur erlaubt, wenn genau eine Bilddatei angegeben wird.\n")
        return 2

    if not args.config.is_file():
        sys.stderr.write(f"labs-config nicht gefunden: {args.config}\n")
        return 1

    ok = True
    for img in args.images:
        if not img.is_file():
            sys.stderr.write(f"fehlt: {img}\n")
            ok = False
            continue
        try:
            process_one(
                img.resolve(),
                args.out_dir.resolve(),
                args.config.resolve(),
                args.name,
                args.dry_run,
            )
        except Exception as e:
            sys.stderr.write(f"{img}: {e}\n")
            ok = False
    return 0 if ok else 2


if __name__ == "__main__":
    sys.exit(main())
