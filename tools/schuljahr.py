#!/usr/bin/env python3
"""Schuljahresablauf BGY: from the school's Teams storage onto the SVP page schuljahr.html.

The school keeps its year plan as a Word table in the BGY team
(02 Schuljahresplanung/<yyyy_yyyy>/Schuljahresablauf <yyyy_yyyy>.docx, synced to this Mac by
OneDrive). Its rows are not in date order, and the table misses some days the state calendar
knows. This script reads the table, sorts it into one row per school week, fills in Saxon
public holidays and the SMK school holidays, lists every correction it made, and upserts the
result into Supabase: table svp_untis, row "_schuljahr" - the table only Doc's account may read
(RLS on his uid), written through the Management API with the CLI token, exactly like
tools/webuntis.js. Nothing of the plan goes into the repo (names, internal dates).

    python3 tools/schuljahr.py           # push when the result differs from the last push
    python3 tools/schuljahr.py --force   # push anyway
    python3 tools/schuljahr.py --dry     # print the result, push nothing

Runs every 10 minutes from the LaunchAgent ~/Library/LaunchAgents/de.docalvers.schuljahr.plist
(log: ~/Library/Logs/schuljahr.log). Parsing is cheap; Supabase is only called on a change.
If the file cannot be read, the last good plan stays online with a warning on the page.
"""
import datetime as dt
import glob
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

ROOT = os.path.expanduser("~/Library/CloudStorage/OneDrive-PrivateSchuleIBBgGmbHDresden/"
                          "BGY - Documents/02 Schuljahresplanung")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# plandaten/ is gitignored (school planning data never goes into the public repo)
CACHE = os.path.join(REPO, "HTML", "svp", "plandaten", "schuljahr.json")
PROJECT = "fyfhxzyymmurlaenmzse"
ROW = "_schuljahr"   # svp_untis row; its data has no "weeks", so the Untis readers skip it
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
      "(KHTML, like Gecko) Version/17.0 Safari/605.1.15")
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

# Saxon school holidays (SMK, smk.sachsen.de). Add the next school year when the school's new
# folder appears - until then the page says the check against the state calendar is missing.
SMK_FERIEN = {
    "2026_2027": [
        ("Herbstferien", "2026-10-12", "2026-10-24"),
        ("Weihnachtsferien", "2026-12-23", "2027-01-02"),
        ("Winterferien", "2027-02-08", "2027-02-19"),
        ("Osterferien", "2027-03-26", "2027-04-02"),
        ("Pfingstferien", "2027-05-07", "2027-05-07"),
        ("Pfingstferien", "2027-05-15", "2027-05-18"),
        ("Sommerferien", "2027-07-10", "2027-08-20"),
    ],
}

# Words in a cell that make the day free of lessons although it is no holiday
FREI_WORDS = re.compile(r"betriebsruhe|ferientag|unterrichtsfrei|schulfrei|brückentag", re.I)

WOCHENTAG = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]


def easter(y):
    """Gregorian Easter Sunday (anonymous Gregorian algorithm)."""
    a, b, c = y % 19, y // 100, y % 100
    d, e = b // 4, b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = c // 4, c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = (h + l - 7 * m + 114) % 31 + 1
    return dt.date(y, month, day)


def feiertage(y):
    """Public holidays in Saxony: date -> (name, word that marks it in the school's table)."""
    e = easter(y)
    bbt = dt.date(y, 11, 22)
    while bbt.weekday() != 2:          # Buss- und Bettag: the Wednesday before 23 November
        bbt -= dt.timedelta(days=1)
    return {
        dt.date(y, 1, 1): ("Neujahr", "neujahr"),
        e - dt.timedelta(days=2): ("Karfreitag", "karfreitag"),
        e + dt.timedelta(days=1): ("Ostermontag", "ostermontag"),
        dt.date(y, 5, 1): ("Tag der Arbeit", "1. mai"),
        e + dt.timedelta(days=39): ("Christi Himmelfahrt", "himmelfahrt"),
        e + dt.timedelta(days=50): ("Pfingstmontag", "pfingstmontag"),
        dt.date(y, 10, 3): ("Tag der Deutschen Einheit", "einheit"),
        dt.date(y, 10, 31): ("Reformationstag", "reformation"),
        bbt: ("Buß- und Bettag", "bettag"),
        dt.date(y, 12, 25): ("1. Weihnachtsfeiertag", "weihnacht"),
        dt.date(y, 12, 26): ("2. Weihnachtsfeiertag", "weihnacht"),
    }


def ddmm(d, year=False):
    return d.strftime("%d.%m.%Y" if year else "%d.%m.")


def tag(d):
    return WOCHENTAG[d.weekday()] + " " + ddmm(d, True)


def clean(s):
    s = s.replace("\u00a0", " ")
    s = re.sub(r"(\d)\s*[-\u2013\u2014]\s*(\d)", "\\1\u2013\\2", s)   # 15-18 / 15—18 -> 15–18
    return re.sub(r"[ \t]+", " ", s).strip()


# ---------- reading the Word file ----------

def find_source(today):
    """The Schuljahresablauf of the school year running today (else the newest one)."""
    found = []
    for folder in glob.glob(os.path.join(ROOT, "[0-9][0-9][0-9][0-9]_[0-9][0-9][0-9][0-9]")):
        y1 = int(os.path.basename(folder)[:4])
        files = [f for f in glob.glob(os.path.join(folder, "*.docx"))
                 if os.path.basename(f).lower().startswith("schuljahresablauf")
                 and not os.path.basename(f).startswith("~$")]
        if files:
            found.append((y1, max(files, key=os.path.getmtime)))
    if not found:
        raise RuntimeError("keine Datei „Schuljahresablauf*.docx“ unter " + ROOT)
    found.sort()
    running = [f for f in found if dt.date(f[0], 8, 1) <= today < dt.date(f[0] + 1, 8, 1)]
    return (running or found)[-1]


def paragraphs(el):
    out = []
    for p in el.iter(W + "p"):
        raw = "".join(x.text or "" for x in p.iter(W + "t"))
        # two entries typed into one line ("BGY26 Prakt.  BGY24 Abi 2. LK")
        out += [clean(x) for x in re.split(r"\s{2,}", raw) if clean(x)]
    return out


def read_docx(path):
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    body = root.find(W + "body")
    title, table = [], None
    for el in body:
        if el.tag == W + "tbl":
            table = el
            break
        if el.tag == W + "p":
            title += paragraphs(el)
    if table is None:
        raise RuntimeError("keine Tabelle in der Datei")
    rows = []
    for tr in table.findall(W + "tr"):
        cells = []
        for tc in tr.findall(W + "tc"):
            pr = tc.find(W + "tcPr")
            span, fill = 1, None
            if pr is not None:
                gs = pr.find(W + "gridSpan")
                if gs is not None:
                    span = int(gs.get(W + "val", "1"))
                shd = pr.find(W + "shd")
                if shd is not None and shd.get(W + "fill") not in (None, "auto", "FFFFFF"):
                    fill = shd.get(W + "fill").upper()
            for _ in range(span):            # a merged cell stands for each column it covers
                cells.append({"lines": paragraphs(tc), "fill": fill})
        rows.append(cells)
    return " ".join(title), rows


# ---------- understanding the table ----------

DATE = re.compile(r"(\d{1,2})\.\s*(\d{1,2})\.(\d{2,4})?")


def dates_in(label, y1, notes):
    """Dates of a row label; a month from August on belongs to the first year of the school year."""
    out = []
    for m in DATE.finditer(label):
        day, month, raw = int(m.group(1)), int(m.group(2)), m.group(3)
        year = y1 if month >= 8 else y1 + 1
        if raw:
            given = int(raw) + (2000 if len(raw) == 2 else 0)
            if given != year:
                notes.append({"text": f"In der Zeile „{label}“ steht die Jahreszahl „{raw}“ "
                                      f"– gemeint ist {year}."})
        out.append(dt.date(year, month, day))
    return out


def build(path, today):
    y1 = int(os.path.basename(os.path.dirname(path))[:4])
    sj_key = f"{y1}_{y1 + 1}"
    title, rows = read_docx(path)
    notes = []

    hol = {}
    for y in (y1, y1 + 1):
        hol.update(feiertage(y))
    smk = {}
    for name, von, bis in SMK_FERIEN.get(sj_key, []):
        d, end = dt.date.fromisoformat(von), dt.date.fromisoformat(bis)
        while d <= end:
            smk[d] = name
            d += dt.timedelta(days=1)
    if sj_key not in SMK_FERIEN:
        notes.append({"text": f"Für {y1}/{y1 + 1} fehlen die SMK-Ferien in tools/schuljahr.py – "
                              "der Abgleich mit dem Ferienkalender ist ausgesetzt."})

    # first pass: which fill colour marks holidays (the colour of the holiday rows)
    ferien_fills = {c["fill"] for r in rows if r and "ferien" in " ".join(r[0]["lines"]).lower()
                    for c in r if c["fill"]}

    weeks = {}          # Monday -> [5 day cells]
    doc_ferien = {}     # date -> holiday name from the school's holiday rows
    sommer = None
    order = []          # start date of each row in the order of the file
    header_at = None
    for i, r in enumerate(rows):
        if not r:
            continue
        label = " ".join(r[0]["lines"])
        low = label.lower()
        if "datum" in low and "woche" in low:
            header_at = i
            continue
        if "ferien" in low:
            name = re.sub(r"-\s*", "", re.split(r"\d", label)[0]).strip()
            ds = dates_in(label, y1, notes)
            if len(ds) >= 2:
                d = ds[0]
                while d <= ds[-1]:
                    doc_ferien[d] = name
                    d += dt.timedelta(days=1)
                order.append(ds[0])
            elif name.lower().startswith("sommer"):
                sommer = name
            continue
        ds = dates_in(label, y1, notes)
        if not ds:
            if label or any(c["lines"] for c in r[1:]):
                notes.append({"text": f"Zeile ohne lesbares Datum übersprungen: „{label}“ "
                                      + " · ".join(" ".join(c["lines"]) for c in r[1:] if c["lines"])})
            continue
        start, end = ds[0], ds[-1] if len(ds) > 1 else None
        order.append(start)
        mon = start - dt.timedelta(days=start.weekday()) if start.weekday() < 5 \
            else start + dt.timedelta(days=7 - start.weekday())
        days = []
        for k in range(5):
            c = r[1 + k] if 1 + k < len(r) else {"lines": [], "fill": None}
            days.append({"lines": list(c["lines"]), "shaded": c["fill"] in ferien_fills})
        if mon in weeks:
            notes.append({"d": mon.isoformat(),
                          "text": f"Die Woche ab {tag(mon)} steht zweimal in der Vorlage – zusammengeführt."})
            for k in range(5):
                weeks[mon][k]["lines"] += days[k]["lines"]
                weeks[mon][k]["shaded"] |= days[k]["shaded"]
        else:
            weeks[mon] = days
        # days of the week the label leaves out, although the calendar has lessons on them
        last = end or mon + dt.timedelta(days=4)
        for k in range(5):
            d = mon + dt.timedelta(days=k)
            if (d < start or d > last) and d not in hol and d not in smk and d not in doc_ferien \
                    and not weeks[mon][k]["shaded"] and not weeks[mon][k]["lines"]:
                notes.append({"d": d.isoformat(),
                              "text": f"Die Zeile „{label}“ lässt {tag(d)} aus – laut Kalender "
                                      f"ein Schultag, hier als normaler Tag geführt."})

    late = sum(1 for i, x in enumerate(order) if any(y > x for y in order[:i]))
    if late:
        notes.insert(0, {"text": "Die Zeilen der Vorlage stehen nicht in Datumsreihenfolge "
                                 "– hier nach Datum sortiert."})
    if header_at:
        notes.insert(1 if late else 0, {"text": "Die Kopfzeile „Datum / Woche“ steht mitten in "
                                                "der Tabelle – hier oben."})

    def ferien_name(d):
        return smk.get(d) or doc_ferien.get(d)

    def weekday_free(d):
        return d in hol or ferien_name(d) is not None

    # Holiday rows of the file against the SMK calendar (weekdays only)
    if sj_key in SMK_FERIEN:
        for d, name in sorted(doc_ferien.items()):
            if d.weekday() < 5 and d not in smk and d not in hol:
                notes.append({"d": d.isoformat(), "text": f"{tag(d)} steht in der Vorlage unter "
                                                          f"{name}, ist laut SMK aber kein Ferientag."})

    zeilen = []
    if not weeks:
        raise RuntimeError("keine einzige Woche in der Tabelle erkannt")
    mon, last_mon = min(weeks), max(weeks)
    block = None
    while mon <= last_mon:
        days5 = [mon + dt.timedelta(days=k) for k in range(5)]
        kw = mon.isocalendar()[1]
        if mon not in weeks and all(weekday_free(d) for d in days5):
            name = next((ferien_name(d) for d in days5 if ferien_name(d)), "Ferien")
            if block and block["name"] == name:
                block["bis_mo"] = mon.isoformat()
            else:
                block = {"art": "ferien", "name": name, "mo": mon.isoformat(), "bis_mo": mon.isoformat()}
                zeilen.append(block)
            mon += dt.timedelta(days=7)
            continue
        block = None
        cells = weeks.get(mon)
        if cells is None:
            notes.append({"d": mon.isoformat(), "text": f"Die Woche {ddmm(days5[0])}–{ddmm(days5[4], True)} "
                                                        "fehlt in der Vorlage – hier leer ergänzt."})
            cells = [{"lines": [], "shaded": False} for _ in range(5)]
        tage = []
        for d, c in zip(days5, cells):
            text = " ".join(c["lines"]).lower()
            t = {"d": d.isoformat(), "e": c["lines"]}
            if d in hol:
                name, word = hol[d]
                t["frei"], t["art"] = name, "feiertag"
                if not c["shaded"] and word not in text:
                    t["korr"] = f"{tag(d)} {name} fehlt in der Vorlage – ergänzt."
            elif ferien_name(d):
                t["frei"], t["art"] = ferien_name(d), "ferien"
                if d in smk and d not in doc_ferien and not c["shaded"] and not FREI_WORDS.search(text):
                    t["korr"] = f"{tag(d)} gehört laut SMK zu den {smk[d]} und fehlt in der Vorlage – ergänzt."
            elif FREI_WORDS.search(text):
                t["frei"] = next(l for l in c["lines"] if FREI_WORDS.search(l))
                t["art"] = "frei"
            elif c["shaded"]:
                t["frei"], t["art"] = "unterrichtsfrei", "frei"
            # the name is shown when the cell does not already say it ("Ferientag" says enough)
            if t.get("frei") and t["frei"].lower() not in text and not FREI_WORDS.search(text) and \
                    not (t.get("art") == "feiertag" and hol[d][1] in text):
                t["zusatz"] = t["frei"]
            if "korr" in t:
                notes.append({"d": d.isoformat(), "text": t["korr"]})
            tage.append(t)
        zeilen.append({"art": "woche", "kw": kw, "mo": mon.isoformat(), "tage": tage})
        mon += dt.timedelta(days=7)

    # the summer holidays close the year
    smk_sommer = [(n, v, b) for n, v, b in SMK_FERIEN.get(sj_key, []) if n.lower().startswith("sommer")]
    if sommer or smk_sommer:
        z = {"art": "ferien", "name": smk_sommer[0][0] if smk_sommer else sommer}
        if smk_sommer:
            z["von"], z["bis"] = smk_sommer[0][1], smk_sommer[0][2]
        zeilen.append(z)

    # date range of each holiday block: the holiday itself (SMK or the school's row), not the Mondays
    for z in zeilen:
        if z["art"] != "ferien" or "mo" not in z:
            continue
        mo = dt.date.fromisoformat(z.pop("mo"))
        bis = dt.date.fromisoformat(z.pop("bis_mo")) + dt.timedelta(days=4)
        a, b = mo, bis
        while ferien_name(a - dt.timedelta(days=1)) == z["name"]:
            a -= dt.timedelta(days=1)
        while ferien_name(b + dt.timedelta(days=1)) == z["name"]:
            b += dt.timedelta(days=1)
        z["von"], z["bis"] = a.isoformat(), b.isoformat()

    mtime = dt.datetime.fromtimestamp(os.path.getmtime(path)).astimezone()
    return {
        "titel": re.sub(r"\s*/\s*", "/", re.sub(r"\s+-\s+", " – ", title)).strip() or "Schuljahresplanung",
        "schuljahr": f"{y1}/{str(y1 + 1)[2:]}",
        "quelle": {"pfad": os.path.relpath(path, os.path.dirname(os.path.dirname(ROOT))),
                   "geaendert": mtime.isoformat(timespec="minutes")},
        "zeilen": zeilen,
        "korrekturen": notes,
    }


# ---------- Supabase ----------

def sql(query):
    tok = open(os.path.expanduser("~/.supabase/access-token")).read().strip()
    req = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{PROJECT}/database/query",
        data=json.dumps({"query": query}).encode(),
        headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json",
                 "User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def q(s):
    return "'" + s.replace("'", "''") + "'"


def push(data):
    body = json.dumps(data, ensure_ascii=False)
    back = sql("insert into public.svp_untis (page, data, generated) values "
               f"({q(ROW)}, {q(body)}::jsonb, now()) on conflict (page) do update "
               "set data = excluded.data, generated = excluded.generated returning page")
    if not back:
        raise RuntimeError("Supabase hat nichts zurückgemeldet")


def load_cache():
    try:
        with open(CACHE, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def save_cache(data):
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


def main():
    args = set(sys.argv[1:])
    now = dt.datetime.now().astimezone()
    stamp = now.strftime("%Y-%m-%d %H:%M")
    cache = load_cache()
    try:
        _, path = find_source(now.date())
        data = build(path, now.date())
    except Exception as e:          # keep the last good plan online, with the reason beside it
        msg = f"{type(e).__name__}: {e}"
        print(stamp, "FEHLER", msg, file=sys.stderr)
        if cache and "--dry" not in args and (cache.get("fehler") or {}).get("text") != msg:
            cache["fehler"] = {"text": msg, "zeit": now.isoformat(timespec="minutes")}
            push(cache)
            save_cache(cache)
        sys.exit(1)

    if "--dry" in args:
        print(json.dumps(data, ensure_ascii=False, indent=1))
        return
    if cache and "--force" not in args:
        old = dict(cache)
        old.pop("fehler", None)
        old.pop("abgeglichen", None)
        if old == data:
            return                   # nothing changed - stay quiet in the log
    data["abgeglichen"] = now.isoformat(timespec="minutes")
    push(data)
    save_cache(data)
    print(stamp, f"gepusht: {len(data['zeilen'])} Zeilen, {len(data['korrekturen'])} Korrekturen "
                 f"({data['quelle']['pfad']}, Stand {data['quelle']['geaendert']})")


if __name__ == "__main__":
    main()
