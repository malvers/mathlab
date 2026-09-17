#!/usr/bin/env python3
"""OneDrive link files for the public HTML decks (Doc, 16.09.2026: "wir stellen eh um ... von PPT weg").

The decks are not copied to OneDrive - a copy goes stale and breaks when the deck shell changes.
Every class folder gets a tiny HTML file per deck that opens the live deck on docalvers.de:
always current, with Solita, the 3D dice and "Frag Solita".
Private deck variants (e.g. the Würfelspiel with the test numbers) are NOT links - they are
single-file builds (html_deck.py --inline) and are left alone here.

    python3 tools/pptx/onedrive_links.py            # dry run: shows what would be written
    python3 tools/pptx/onedrive_links.py --write    # writes the link files

Never deletes anything (the old .pptx stay). Writes a file only when its content changed.
"""
import glob
import html
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DECKS = os.path.normpath(os.path.join(HERE, "..", "..", "HTML", "decks"))
ONEDRIVE = os.path.expanduser("~/Library/CloudStorage/OneDrive-PrivateSchuleIBBgGmbHDresden/UNTERRICHT")
SITE = "https://docalvers.de/decks/"

# deck file name -> class folder on OneDrive (first match wins)
FOLDERS = [
    (r"^mathe11-", "MATH BGY 11"),
    (r"^inf11-", "INFO BGY 11"),
    (r"^fos12-", "INFO FO 12"),
    (r"^info9-", "INFO OS 09"),
    (r"^(modellbildung-|informatik-als-medium)", "INFO BGY 12"),
]

PAGE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta http-equiv="refresh" content="0; url={url}">
<style>
  body {{ margin: 0; min-height: 100vh; display: grid; place-items: center; background: #EEF2F8;
         font: 18px/1.5 Raleway, Arial, sans-serif; color: #0E244E; }}
  a {{ color: #B02418; font-weight: 700; }}
</style>
</head>
<body>
<!-- link file written by tools/pptx/onedrive_links.py - the deck itself lives on docalvers.de -->
<p>Die Präsentation <b>{title}</b> öffnet sich auf docalvers.de.<br>
Falls nicht: <a href="{url}">{url}</a></p>
<script>location.replace({url_js});</script>
</body>
</html>
"""


def deck_title(path):
    with open(path, encoding="utf-8") as f:
        m = re.search(r"<title>([^<]*)</title>", f.read(20000))
    return html.unescape(m.group(1)).strip() if m else os.path.splitext(os.path.basename(path))[0]


def file_name(title, slug):
    # readable name first, the deck code in [ ] so it can still be found (Doc's naming rule)
    safe = re.sub(r'[\\/:*?"<>|]+', " - ", title)
    safe = re.sub(r"\s+", " ", safe).strip(" .-")
    return "%s [%s].html" % (safe, slug)


def main():
    write = "--write" in sys.argv
    if subprocess.run(["pgrep", "-x", "OneDrive"], capture_output=True).returncode != 0:
        print("OneDrive läuft nicht - erst starten, sonst synchronisiert nichts.")
        if write:
            sys.exit(1)
    plan, skipped = [], []
    for path in sorted(glob.glob(os.path.join(DECKS, "*.html"))):
        slug = os.path.splitext(os.path.basename(path))[0]
        folder = next((f for rx, f in FOLDERS if re.search(rx, slug)), None)
        if not folder:
            skipped.append(slug)
            continue
        title = deck_title(path)
        url = SITE + slug + ".html"
        target = os.path.join(ONEDRIVE, folder, file_name(title, slug))
        body = PAGE.format(title=html.escape(title), url=html.escape(url, quote=True),
                           url_js='"%s"' % url)
        plan.append((target, body))

    new = changed = same = 0
    for target, body in plan:
        old = None
        if os.path.exists(target):
            with open(target, encoding="utf-8") as f:
                old = f.read()
        if old == body:
            same += 1
            continue
        if old is None:
            new += 1
        else:
            changed += 1
        print(("SCHREIBE " if write else "würde schreiben ") + os.path.relpath(target, ONEDRIVE))
        if write:
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, "w", encoding="utf-8") as f:
                f.write(body)
    print("%d Decks: %d neu, %d geändert, %d unverändert%s"
          % (len(plan), new, changed, same, "" if write else "  (Probelauf, --write schreibt)"))
    if skipped:
        print("ohne Klassenordner, nicht verlinkt: " + ", ".join(skipped))


if __name__ == "__main__":
    main()
