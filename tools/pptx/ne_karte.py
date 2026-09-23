#!/usr/bin/env python3
"""Real maps for the decks: Natural Earth geometry, drawn as SVG.

    python3 tools/pptx/ne_karte.py --extrahiere <geojson-verzeichnis>   # once, writes karten/*.json
    python3 tools/pptx/ne_karte.py mesoamerika                          # prints the <svg>

Doc, 23.09.2026: "wir brauchen Karten von Mexico und Zweistromland ... geht Open Streetmap?"
OSM's rendered tiles would be a PNG again - blurry on the beamer and untouchable in the deck
editor. Natural Earth is public domain and comes as geometry, so the coastlines and the courses
of Euphrates and Tigris are the real ones while the map stays vector and its names stay editable.

The extracted regions live in tools/pptx/karten/*.json (a few dozen KB), so a build needs no
download. Source: naturalearthdata.com via github.com/nvkelso/natural-earth-vector, 1:50m.
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

HERE = os.path.dirname(os.path.abspath(__file__))
KARTEN = os.path.join(HERE, "karten")
W, H = 816, 330

# Each region: the window in degrees and the places the deck names.
# lon/lat of the sites are the usual published coordinates of the excavation areas.
REGIONEN = {
    "mesoamerika": {
        "box": (-106.0, 12.0, -83.0, 23.5),
        "orte": [
            ("Chichén Itzá", -88.57, 20.68, "ruine"),
            ("Tikal", -89.62, 17.22, "ruine"),
            ("Palenque", -91.98, 17.48, "ruine"),
            ("Copán", -89.14, 14.84, "ruine"),
            ("Mexiko-Stadt", -99.13, 19.43, "stadt"),
        ],
        "laender": ["Mexico", "Guatemala", "Belize", "Honduras", "El Salvador", "Nicaragua"],
        # the Maya area drawn as an outline over the real map - it never was a country
        "gebiet": [(-94.5, 18.6), (-92.6, 21.4), (-89.8, 21.7), (-86.8, 21.5), (-86.7, 20.2),
                   (-87.6, 18.1), (-88.2, 15.9), (-89.2, 13.9), (-90.6, 13.8), (-92.3, 14.6),
                   (-93.9, 16.3)],
    },
    "zweistromland": {
        "box": (34.0, 28.5, 54.0, 38.2),
        "orte": [
            ("Babylon", 44.42, 32.54, "ruine"),
            ("Ur", 46.10, 30.96, "ruine"),
            ("Uruk", 45.64, 31.32, "ruine"),
            ("Assur", 43.26, 35.46, "ruine"),
            ("Bagdad", 44.36, 33.31, "stadt"),
            ("Basra", 47.78, 30.51, "stadt"),
        ],
        "laender": ["Iraq", "Iran", "Syria", "Turkey", "Saudi Arabia", "Kuwait", "Jordan"],
    },
}


# ------------------------------------------------------------- extraction ---
def _ringe(geom):
    """Every ring of a (Multi)Polygon or line of a (Multi)LineString as a list of [lon, lat]."""
    t, c = geom["type"], geom["coordinates"]
    if t == "Polygon":
        return list(c)
    if t == "MultiPolygon":
        return [r for poly in c for r in poly]
    if t == "LineString":
        return [c]
    if t == "MultiLineString":
        return list(c)
    return []


def _beruehrt(ring, box):
    x0, y0, x1, y1 = box
    return any(x0 <= p[0] <= x1 and y0 <= p[1] <= y1 for p in ring)


def _duenne(ring, eps):
    """Drop points closer than eps degrees to the one kept before - the map is 816 px wide,
    finer detail only makes the file bigger."""
    out = [ring[0]]
    for p in ring[1:-1]:
        if abs(p[0] - out[-1][0]) > eps or abs(p[1] - out[-1][1]) > eps:
            out.append(p)
    if len(ring) > 1:
        out.append(ring[-1])
    return out


def extrahiere(quelle):
    """Cut both regions out of the Natural Earth files and store them next to this script."""
    os.makedirs(KARTEN, exist_ok=True)
    def lade(name):
        with open(os.path.join(quelle, name + ".geojson"), encoding="utf-8") as f:
            return json.load(f)["features"]
    laender = lade("ne_50m_admin_0_countries")
    fluesse = lade("ne_50m_rivers_lake_centerlines")
    seen = lade("ne_50m_lakes")
    for name, reg in REGIONEN.items():
        box = reg["box"]
        eps = (box[2] - box[0]) / 1600.0          # about half a pixel of the finished map
        daten = {"box": box, "laender": [], "fluesse": [], "seen": []}
        for f in laender:
            nm = f["properties"].get("NAME") or ""
            ringe = [_duenne(r, eps) for r in _ringe(f["geometry"]) if _beruehrt(r, box)]
            if ringe:
                daten["laender"].append({"name": nm, "ringe": ringe})
        for f in fluesse:
            nm = f["properties"].get("name") or ""
            for r in _ringe(f["geometry"]):
                if _beruehrt(r, box):
                    daten["fluesse"].append({"name": nm, "linie": _duenne(r, eps)})
        for f in seen:
            for r in _ringe(f["geometry"]):
                if _beruehrt(r, box):
                    daten["seen"].append({"ring": _duenne(r, eps)})
        ziel = os.path.join(KARTEN, name + ".json")
        with open(ziel, "w", encoding="utf-8") as fh:
            json.dump(daten, fh, separators=(",", ":"))
            fh.write("\n")
        print("%-16s %3d Länder, %3d Flüsse, %2d Seen  %6.0f KB"
              % (name, len(daten["laender"]), len(daten["fluesse"]), len(daten["seen"]),
                 os.path.getsize(ziel) / 1024))


# ---------------------------------------------------------------- drawing ---
class Projektion:
    """Mercator, fitted into the picture box - north is up and the shapes keep their look."""

    def __init__(self, box, w, h, pad=8, oy0=0.0):
        x0, y0, x1, y1 = box
        # both axes in radians - mixing degrees with the Mercator ordinate squashes the map flat
        self.mx0, self.mx1 = math.radians(x0), math.radians(x1)
        my = lambda lat: math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
        self.my0, self.my1 = my(y0), my(y1)
        self._my = my
        self.s = min((w - 2 * pad) / (self.mx1 - self.mx0),
                     (h - 2 * pad) / (self.my1 - self.my0))
        self.ox = (w - (self.mx1 - self.mx0) * self.s) / 2
        self.oy = oy0 + (h - (self.my1 - self.my0) * self.s) / 2

    def __call__(self, lon, lat):
        return (self.ox + (math.radians(lon) - self.mx0) * self.s,
                self.oy + (self.my1 - self._my(lat)) * self.s)


def _pfad(punkte, P, schliessen):
    d = []
    for i, (lon, lat) in enumerate(punkte):
        x, y = P(lon, lat)
        d.append("%s%s %s" % ("M " if i == 0 else "L ", S.fmt(x), S.fmt(y)))
    return " ".join(d) + (" Z" if schliessen else "")


LAND = "#F3F0E7"        # paper-like land, so the blue rivers carry the picture
LAND_HERV = "#F7E6BE"   # the country the slide is about
WASSER = "#DCE8F4"
KUESTE = "#9FB3CC"
FLUSS = "#5B8FC9"


def zeichne(name, hervor=(), w=W, h=H, pad=8, karte_h=None, top=0.0):
    """The region as SVG - land, borders, rivers, lakes. Returns (Canvas, projection).

    The canvas always keeps the full picture box (816 x 330), because the HTML labels are
    placed in those coordinates; `karte_h` and `top` only say how much of it the map itself
    fills, so a caption can sit underneath without lying on the map."""
    with open(os.path.join(KARTEN, name + ".json"), encoding="utf-8") as f:
        daten = json.load(f)
    c = S.Canvas(w, h)
    P = Projektion(daten["box"], w, karte_h or h, pad, top)
    cid = "kclip_" + c.uid
    x0, y0 = P(daten["box"][0], daten["box"][1])
    x1, y1 = P(daten["box"][2], daten["box"][3])
    c.defs.append('<clipPath id="%s"><rect x="%s" y="%s" width="%s" height="%s" rx="10"/></clipPath>'
                  % (cid, S.fmt(x1 if x1 < x0 else x0), S.fmt(y1 if y1 < y0 else y0),
                     S.fmt(abs(x1 - x0)), S.fmt(abs(y1 - y0))))
    c.raw('<g clip-path="url(#%s)">' % cid)
    c.rect(min(x0, x1), min(y0, y1), abs(x1 - x0), abs(y1 - y0), fill=WASSER)
    for land in daten["laender"]:
        fill = LAND_HERV if land["name"] in hervor else LAND
        for ring in land["ringe"]:
            c.path(_pfad(ring, P, True), stroke=KUESTE, width=1.1, fill=fill)
    for see in daten["seen"]:
        c.path(_pfad(see["ring"], P, True), stroke=KUESTE, width=0.9, fill=WASSER)
    for fl in daten["fluesse"]:
        c.path(_pfad(fl["linie"], P, False), stroke=FLUSS, width=2.0)
    c.raw("</g>")
    c.rect(min(x0, x1), min(y0, y1), abs(x1 - x0), abs(y1 - y0), fill="none",
           stroke=KUESTE, width=1.4, rx=10)
    # the frame in canvas coordinates - legende() anchors itself to it
    P.rahmen = (min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1))
    return c, P


def legende(c, P, ecke, zeilen, rand=18, pad=14, luft=5):
    """A caption plate in a corner of the map - same gap to the frame in x and y, and the same
    gap again around the words inside.

    Doc, 23.09.2026: "achte bitte auf die gaps x & y -> gleich", and on the Mexico map "nee" -
    there the plate sat 50 px from the left edge but 24 from the top. So it is no longer placed
    by hand: `ecke` is "ol", "or", "ul" or "ur", `rand` is its distance to the map frame on both
    axes, and the plate's own size comes from the measured text (textmass), with the empty part
    of the line box taken off top and bottom.

    `zeilen` is [(text, font size, css)]. Returns the labels - the words stay editable.
    """
    from textmass import breite, zeilenhoehe, LUFT
    def zeilenbreite(text, size, css):
        return breite(text.replace("**", ""), size, 600 if "600" in css or "**" in text else 400)
    hoehen = [zeilenhoehe(size) for _, size, _ in zeilen]
    block_w = max(zeilenbreite(*z) for z in zeilen)
    luft_o, luft_u = LUFT * zeilen[0][1], LUFT * zeilen[-1][1]
    sichtbar_h = sum(hoehen) + luft * (len(zeilen) - 1) - luft_o - luft_u
    pw, ph = block_w + 2 * pad, sichtbar_h + 2 * pad
    l, o, r, u = P.rahmen
    x = l + rand if ecke[-1] == "l" else r - rand - pw
    y = o + rand if ecke[0] == "o" else u - rand - ph
    c.rect(x, y, pw, ph, fill=S.PAPER, opacity=0.88, rx=8, stroke="#C8D2E2", width=1)
    labels, ty = [], y + pad - luft_o
    for (text, size, css), h in zip(zeilen, hoehen):
        labels.append((x + pw / 2, ty + h / 2, block_w + 4, text, css))
        ty += h + luft
    return labels


def ort(c, P, lon, lat, art="stadt"):
    """A place on the map - an excavation site is marked differently from a modern city."""
    x, y = P(lon, lat)
    if art == "ruine":
        c.raw('<path d="M %s %s l 6.5 11 h -13 Z" fill="%s" stroke="%s" stroke-width="1.2"/>'
              % (S.fmt(x), S.fmt(y - 6), S.RED, S.PAPER))
    else:
        c.circle(x, y, 3.6, fill=S.INK, stroke=S.PAPER, width=1.3)
    return x, y


if __name__ == "__main__":
    if sys.argv[1:2] == ["--extrahiere"]:
        extrahiere(sys.argv[2])
    else:
        c, P = zeichne(sys.argv[1])
        print(c.svg())
