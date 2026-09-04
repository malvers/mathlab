#!/usr/bin/env python3
"""Fetch the Wikimedia Commons pictures the Webstuhl deck uses into img/.

The pictures are not in the repo (binaries, and CC BY-SA wants its credit line
where it is shown, not in a git tree) - they are pulled on demand. Licences and
credits are listed in README.md and printed under every picture in the deck.
"""
import json
import os
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "img")
API = "https://commons.wikimedia.org/w/api.php"
# Commons rejects the default urllib agent, and it wants a way to reach us.
UA = {"User-Agent": "DocAlvers-Unterrichtsmaterial/1.0 (Schulunterricht; docalvers.de)"}

FILES = {
    "File:A Jacquard loom showing information punchcards, National Museum of Scotland.jpg": "loom.jpg",
    "File:Jacquard loom cards.jpg": "cards.jpg",
    "File:A la mémoire de J.M. Jacquard.jpg": "portrait.jpg",
    "File:Blue-punch-card-front-horiz.png": "punchcard.png",
    "File:Ada Lovelace portrait.jpg": "ada.jpg",
}


def main():
    os.makedirs(IMG, exist_ok=True)
    query = (f"{API}?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata"
             f"&iiurlwidth=1600&titles=" + urllib.parse.quote("|".join(FILES)))
    data = json.load(urllib.request.urlopen(urllib.request.Request(query, headers=UA), timeout=30))
    for page in data["query"]["pages"].values():
        name = FILES.get(page.get("title"))
        if not name or "imageinfo" not in page:
            print("fehlt:", page.get("title"))
            continue
        info = page["imageinfo"][0]
        # always take the URL the API hands back - Commons refuses invented thumb sizes
        url = info["thumburl"].split("?")[0]
        dst = os.path.join(IMG, name)
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
            open(dst, "wb").write(r.read())
        licence = info.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "?")
        print(f"{name:14s} {os.path.getsize(dst) // 1024:5d} KB  {licence}")


if __name__ == "__main__":
    main()
