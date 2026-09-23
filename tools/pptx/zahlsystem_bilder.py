#!/usr/bin/env python3
"""Fetches the photographs for the two number-system decks from Wikimedia Commons.

    python3 tools/pptx/zahlsystem_bilder.py        # -> tools/pptx/img/zs-*.jpg + credits

Why not the pictures from Doc's .pptx files: those are Google Maps screenshots, stock photos
and a book scan - the repo is public, so none of them may go in. Every file here carries a
licence and a named author from Commons, and the deck prints that line under the picture.
Run once; the images are then tracked in HTML/decks/img via html_deck.asset().
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request

from PIL import Image

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "forloop-deck-builder/1.0 (https://docalvers.de)"}
IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "img")
MAXW = 1400          # wider than any deck slot; keeps the repo small

# key -> Commons file. The deck refers to a picture by its key, never by a URL.
BILDER = {
    "maya-castillo": "File:El Castillo Stitch 2008 Edit 2.jpg",
    "maya-codex": "File:Dresden codex, page 2.jpg",
    "maya-codex-detail": "File:Detalle del Códice Maya de Dresden.jpg",
    "maya-stele": "File:Los Alacranes Stela 1 Maya glyphs.jpg",
    "bab-ischtar": "File:Pergamon museum Ishtar Gate.jpg",
    "bab-plimpton": "File:Plimpton 322.jpg",
    "bab-ybc": "File:Ybc7289-bw.jpg",
    "bab-ruinen": "File:Ruins of the ancient city of Babylon, Iraq, 6th century BC.jpg",
}


def _api(params):
    params["format"] = "json"
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=60))


def _plain(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()


def hole():
    """Downloads every picture, scales it and writes tools/pptx/img/zs-credits.json."""
    os.makedirs(IMG, exist_ok=True)
    titel = list(BILDER.values())
    r = _api({"action": "query", "titles": "|".join(titel), "prop": "imageinfo",
              "iiprop": "url|extmetadata", "iiurlwidth": MAXW})
    by_title = {}
    for page in r["query"]["pages"].values():
        ii = page.get("imageinfo", [{}])[0]
        m = ii.get("extmetadata", {})
        by_title[page["title"]] = {
            "url": ii.get("thumburl") or ii.get("url"),
            "seite": ii.get("descriptionurl", ""),
            "lizenz": _plain(m.get("LicenseShortName", {}).get("value", "")),
            "urheber": _plain(m.get("Artist", {}).get("value", "")),
        }
    credits = {}
    for key, title in BILDER.items():
        meta = by_title.get(title)
        if not meta or not meta["url"]:
            print("FEHLT:", title, file=sys.stderr)
            continue
        ziel = os.path.join(IMG, "zs-%s.jpg" % key)
        req = urllib.request.Request(meta["url"], headers=UA)
        roh = ziel + ".raw"
        with open(roh, "wb") as f:
            f.write(urllib.request.urlopen(req, timeout=120).read())
        im = Image.open(roh).convert("RGB")
        if im.width > MAXW:
            im = im.resize((MAXW, round(im.height * MAXW / im.width)), Image.LANCZOS)
        im.save(ziel, "JPEG", quality=84, optimize=True)
        os.remove(roh)
        credits[key] = {"datei": os.path.basename(ziel), "commons": title, **meta}
        del credits[key]["url"]
        print("%-18s %5d x %4d  %s" % (key, im.width, im.height, meta["lizenz"]))
    with open(os.path.join(IMG, "zs-credits.json"), "w", encoding="utf-8") as f:
        json.dump(credits, f, indent=1, ensure_ascii=False)
        f.write("\n")
    return credits


_CACHE = None


def _urheber(roh):
    """Commons' Artist field is free text: for old works it often holds a Wikidata date
    statement ("circa 1200date QS:P,+1200-...") instead of a name. Such a string is worse than
    none, so it is dropped - a public domain work needs no attribution anyway."""
    if not roh or "QS:P" in roh or len(roh) > 70:
        return ""
    if roh.strip().lower() in ("photo author unknown", "unknown", "unknown author", "anonymous"):
        return ""     # a placeholder in English reads like a name on a German slide
    return roh


def credit(key):
    """The one line a slide prints under a picture: author, licence, source."""
    global _CACHE
    if _CACHE is None:
        with open(os.path.join(IMG, "zs-credits.json"), encoding="utf-8") as f:
            _CACHE = json.load(f)
    c = _CACHE[key]
    wer = _urheber(c["urheber"])
    return "Bild: %s%s · Wikimedia Commons" % (wer + " · " if wer else "", c["lizenz"])


def quelle(key):
    """(licence line, Commons page) - what chapter(credit=, credit_url=) wants."""
    credit(key)                                   # fills the cache
    return credit(key), _CACHE[key]["seite"]


def pfad(key):
    return os.path.join(IMG, "zs-%s.jpg" % key)


if __name__ == "__main__":
    hole()
