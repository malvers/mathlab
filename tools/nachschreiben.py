#!/usr/bin/env python3
"""Nachschreibetermine BGY: from the school's Word file onto the SVP page nachschreiben.html.

The school keeps the make-up exam dates as a Word table (Datum | Tag | Zeit | Lehrkraft, the
room in the page head) in a colleague's OneDrive - not synced to this Mac, so the file comes
from the browser's download ("?download=1" on the sharing link lands it in ~/Downloads).
This script reads the table, drops the template rows without a date, checks every date
against the Saxon calendar (SMK holidays and public holidays from tools/schuljahr.py) and
upserts the result into Supabase: table svp_untis, row "_nachschreiben" - only Doc's account
may read it (RLS on his uid), written through the Management API exactly like schuljahr.py.
Nothing of the table goes into the repo (colleagues' names, the sharing link).

    python3 tools/nachschreiben.py                 # newest ~/Downloads/Nachschreibetermine*.docx
    python3 tools/nachschreiben.py FILE.docx       # a given file
    python3 tools/nachschreiben.py --link URL      # keep the Teams link for the page's footer
    python3 tools/nachschreiben.py --dry           # print the result, push nothing
"""
import datetime as dt
import glob
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import schuljahr as sj   # noqa: E402  calendar (SMK_FERIEN, feiertage), clean(), Supabase helpers

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# plandaten/ is gitignored (school planning data never goes into the public repo)
CACHE = os.path.join(REPO, "HTML", "svp", "plandaten", "nachschreiben.json")
ROW = "_nachschreiben"   # svp_untis row; its data has no "weeks", so the Untis readers skip it
ICH = "Alvers"           # Doc's own dates get marked on the page
W = sj.W
DCT = "{http://purl.org/dc/terms/}"

TAGNAME = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
DATE = re.compile(r"(\d{1,2})\.(\d{1,2})\.(\d{2,4})")
ZEIT = re.compile(r"(\d{1,2})[:.](\d{2})\s*[-–]\s*(\d{1,2})[:.](\d{2})")


def find_source():
    files = [f for f in glob.glob(os.path.expanduser("~/Downloads/Nachschreibetermine*.docx"))
             if not os.path.basename(f).startswith("~$")]
    if not files:
        raise RuntimeError("keine Datei „Nachschreibetermine*.docx“ in ~/Downloads")
    return max(files, key=os.path.getmtime)


def text(el):
    return sj.clean(" ".join("".join(t.text or "" for t in p.iter(W + "t")) for p in el.iter(W + "p")))


def read_docx(path):
    """Head line(s), the table rows as lists of cell texts, and the file's own save time."""
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
        head = [n for n in z.namelist() if re.match(r"word/header\d*\.xml$", n)]
        lines = []
        for n in sorted(head):
            for p in ET.fromstring(z.read(n)).iter(W + "p"):
                s = sj.clean("".join(t.text or "" for t in p.iter(W + "t")))
                if s and s not in lines:
                    lines.append(s)
        saved = None
        if "docProps/core.xml" in z.namelist():
            m = ET.fromstring(z.read("docProps/core.xml")).find(DCT + "modified")
            saved = m.text if m is not None else None
    table = root.find(W + "body").find(W + "tbl")
    if table is None:
        raise RuntimeError("keine Tabelle in der Datei")
    rows = []
    for tr in table.findall(W + "tr"):
        cells = []
        for tc in tr.findall(W + "tc"):
            pr = tc.find(W + "tcPr")
            gs = pr.find(W + "gridSpan") if pr is not None else None
            cells.append((text(tc), int(gs.get(W + "val", "1")) if gs is not None else 1))
        rows.append(cells)
    return lines, rows, saved


def zeit(s):
    m = ZEIT.search(s)
    return f"{int(m[1]):02d}:{m[2]}–{int(m[3]):02d}:{m[4]} Uhr" if m else s


def build(path, link):
    lines, rows, saved = read_docx(path)
    titel = next((x for x in lines if "nachschreib" in x.lower()), "Nachschreibetermine BGY")
    raum = next((re.sub(r"^raum:?\s*", "", x, flags=re.I) for x in lines if x.lower().startswith("raum")), "")

    termine, notes = [], []
    for cells in rows[1:]:                       # row 0 is the head (Datum | Tag | Zeit | Lehrkraft)
        if len(cells) == 1:                      # a band across the table: the holidays
            continue                             # - they come from the SMK calendar below
        vals = [c for c, _ in cells if c]
        m = DATE.search(cells[0][0])
        if not m:
            continue                             # template row without a date
        y = int(m[3]) + (2000 if len(m[3]) == 2 else 0)
        d = dt.date(y, int(m[2]), int(m[1]))
        tag = cells[1][0] if len(cells) > 1 else ""
        uhr = next((zeit(v) for v in vals if ZEIT.search(v)), "")
        wer = cells[-1][0] if len(cells) > 2 and not ZEIT.search(cells[-1][0]) else ""
        t = {"d": d.isoformat(), "kw": d.isocalendar()[1], "zeit": uhr, "wer": wer}
        if wer and wer.split()[-1] == ICH:
            t["meins"] = True
        if tag and tag != TAGNAME[d.weekday()]:
            notes.append({"d": t["d"], "text": f"{sj.ddmm(d, True)} ist ein {TAGNAME[d.weekday()]}, "
                                                f"in der Datei steht „{tag}“."})
        termine.append(t)
    if not termine:
        raise RuntimeError("keine Termine mit Datum in der Tabelle")
    termine.sort(key=lambda t: t["d"])

    # the time all dates share goes into the head; a row keeps its own only when it differs
    zeiten = [t["zeit"] for t in termine if t["zeit"]]
    gemein = max(set(zeiten), key=zeiten.count) if zeiten else ""
    for t in termine:
        if t["zeit"] == gemein:
            del t["zeit"]

    # the school year the dates run in, and its holidays as bands between the dates
    first = dt.date.fromisoformat(termine[0]["d"])
    y1 = first.year if first.month >= 8 else first.year - 1
    key = f"{y1}_{y1 + 1}"
    ferien = [(n, dt.date.fromisoformat(a), dt.date.fromisoformat(b)) for n, a, b in sj.SMK_FERIEN.get(key, [])]
    if not ferien:
        notes.append({"text": f"Ferientermine {y1}/{str(y1 + 1)[2:]} fehlen in tools/schuljahr.py (SMK_FERIEN) "
                              "- die Termine sind nicht gegen die Ferien geprüft."})
    hol = {**sj.feiertage(y1), **sj.feiertage(y1 + 1)}
    for t in termine:
        d = dt.date.fromisoformat(t["d"])
        f = next(((n, a, b) for n, a, b in ferien if a <= d <= b), None)
        if f:
            t["frei"] = f[0]
            notes.append({"d": t["d"], "text": f"{sj.tag(d)} liegt in den {f[0]} "
                                                f"({sj.ddmm(f[1])}–{sj.ddmm(f[2], True)})."})
        elif d in hol:
            t["frei"] = hol[d][0]
            notes.append({"d": t["d"], "text": f"{sj.tag(d)} ist ein Feiertag ({hol[d][0]})."})

    last = dt.date.fromisoformat(termine[-1]["d"])
    zeilen = [dict(t, art="termin") for t in termine]
    for n, a, b in ferien:
        if first <= b and a <= last:
            zeilen.append({"art": "ferien", "name": n, "von": a.isoformat(), "bis": b.isoformat()})
    # a holiday band sorts before the dates inside it, so they read as "in the holidays"
    zeilen.sort(key=lambda z: (z.get("von") or z["d"], z["art"] != "ferien"))

    m = re.search(r"(\d{4})\s*[/_]\s*(\d{2,4})", titel)
    return {
        "titel": titel,
        "schuljahr": f"{m[1]}/{m[2][-2:]}" if m else f"{y1}/{str(y1 + 1)[2:]}",
        "raum": raum,
        "zeit": gemein,
        "quelle": {"datei": os.path.basename(path), "geaendert": saved, "link": link},
        "zeilen": zeilen,
        "korrekturen": notes,
    }


def push(data):
    body = json.dumps(data, ensure_ascii=False)
    back = sj.sql("insert into public.svp_untis (page, data, generated) values "
                  f"({sj.q(ROW)}, {sj.q(body)}::jsonb, now()) on conflict (page) do update "
                  "set data = excluded.data, generated = excluded.generated returning page")
    if not back:
        raise RuntimeError("Supabase hat nichts zurückgemeldet")


def main():
    args = sys.argv[1:]
    link = None
    if "--link" in args:
        i = args.index("--link")
        link = args[i + 1]
        del args[i:i + 2]
    dry = "--dry" in args
    files = [a for a in args if not a.startswith("--")]
    cache = None
    try:
        with open(CACHE, encoding="utf-8") as f:
            cache = json.load(f)
    except (OSError, ValueError):
        pass
    if link is None and cache:
        link = (cache.get("quelle") or {}).get("link")

    path = files[0] if files else find_source()
    data = build(path, link)
    if dry:
        print(json.dumps(data, ensure_ascii=False, indent=1))
        return
    data["abgeglichen"] = dt.datetime.now().astimezone().isoformat(timespec="minutes")
    push(data)
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    n = sum(1 for z in data["zeilen"] if z["art"] == "termin")
    print(f"gepusht: {n} Termine, {len(data['korrekturen'])} Hinweise ({data['quelle']['datei']})")


if __name__ == "__main__":
    main()
