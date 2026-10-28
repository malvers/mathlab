#!/usr/bin/env python3
"""Telefonliste IBB: from the school's Excel file onto the SVP page telefonliste.html.

The school keeps its staff directory as an Excel workbook on the SharePoint site "Personal"
(MA_Telefonliste.xlsx) - not synced to this Mac, so the file comes from the browser's download
("?download=1" on the sharing link lands it in ~/Downloads). This script reads the sheet
"Telefonliste_aktuell" (Anrede | Name | Vorname | Kürzel | E-Mail | Tel. | Raum | Standort | Schule)
and the sheet "Unternehmendaten" (the sites: address, phone/fax, mail, house), fixes the few
obvious typos (each one is listed on the page) and upserts the result into Supabase: table
svp_untis, row "_telefonliste" - only Doc's account may read it (RLS on his uid), written
through the Management API exactly like schuljahr.py. Nothing of the list goes into the repo
(colleagues' names, numbers and mail addresses, the sharing link).

    python3 tools/telefonliste.py                 # newest ~/Downloads/MA_Telefonliste*.xlsx
    python3 tools/telefonliste.py FILE.xlsx       # a given file
    python3 tools/telefonliste.py --link URL      # keep the SharePoint link for the page's footer
    python3 tools/telefonliste.py --dry           # print the result, push nothing
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
import schuljahr as sj   # noqa: E402  clean(), Supabase helpers

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# plandaten/ is gitignored (school data never goes into the public repo)
CACHE = os.path.join(REPO, "HTML", "svp", "plandaten", "telefonliste.json")
ROW = "_telefonliste"   # svp_untis row; its data has no "weeks", so the Untis readers skip it
ICH = ("Alvers", "Michael")   # Doc's own row gets marked on the page
SHEET = "Telefonliste_aktuell"
SITES = "Unternehmendaten"
M = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
DCT = "{http://purl.org/dc/terms/}"

# the schools in the order of the filter pills; anything else found in the file goes behind them
SCHULEN = ["BGY", "FOS", "FSE", "BSW", "SAR", "POD", "OS/GY", "GS", "VW", "IT"]
# typos in the file - fixed here, listed on the page
FIX_ANREDE = {"Fraz": "Frau"}
FIX_TEXT = [("Beruliche", "Berufliche"), ("Genztags", "Ganztags")]
VORWAHL = "0351"   # the sites' numbers are Dresden numbers without the area code


def find_source():
    files = [f for f in glob.glob(os.path.expanduser("~/Downloads/MA_Telefonliste*.xlsx"))
             if not os.path.basename(f).startswith("~$")]
    if not files:
        raise RuntimeError("keine Datei „MA_Telefonliste*.xlsx“ in ~/Downloads")
    return max(files, key=os.path.getmtime)


def col(ref):
    """'E37' -> 4 (0-based column)."""
    n = 0
    for ch in re.match(r"[A-Z]+", ref)[0]:
        n = n * 26 + ord(ch) - 64
    return n - 1


def read_xlsx(path):
    """{sheet name: [[cell text, ...] per row, row 0 = sheet row 1]} and the file's own save time."""
    with zipfile.ZipFile(path) as z:
        shared = []
        if "xl/sharedStrings.xml" in z.namelist():
            for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall(M + "si"):
                shared.append("".join(t.text or "" for t in si.iter(M + "t")))
        rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
        sheets = {}
        for s in ET.fromstring(z.read("xl/workbook.xml")).find(M + "sheets"):
            target = rels[s.get(R + "id")].lstrip("/")
            root = ET.fromstring(z.read(target if target.startswith("xl/") else "xl/" + target))
            rows = []
            for row in root.find(M + "sheetData"):
                n = int(row.get("r")) - 1
                while len(rows) <= n:
                    rows.append([])
                cells = rows[n]
                for c in row.findall(M + "c"):
                    v, inl = c.find(M + "v"), c.find(M + "is")
                    if c.get("t") == "s" and v is not None:
                        val = shared[int(v.text)]
                    elif c.get("t") == "inlineStr" and inl is not None:
                        val = "".join(t.text or "" for t in inl.iter(M + "t"))
                    else:
                        val = v.text if v is not None else ""
                    i = col(c.get("r"))
                    while len(cells) <= i:
                        cells.append("")
                    cells[i] = val or ""
            sheets[s.get("name")] = rows
        saved = None
        if "docProps/core.xml" in z.namelist():
            m = ET.fromstring(z.read("docProps/core.xml")).find(DCT + "modified")
            saved = m.text if m is not None else None
    return sheets, saved


def lines(s):
    """A cell's lines ('702/\\n642' -> ['702', '642']), empty ones dropped."""
    return [x for x in (sj.clean(p) for p in re.split(r"\s*/\s*\n\s*|\n", s or "")) if x]


def raum(s):
    s = re.sub(r"^([A-Za-zÄÖÜäöü]+)(\d)", r"\1 \2", s)   # "B202" -> "B 202"
    return re.sub(r"^Kö\b", "KÖ", s)                      # "Kö 414" -> "KÖ 414" like the rest


def nummer(s):
    return s.replace("\u2013", "-")   # clean() turns 49449-530 into a range dash - a number keeps its hyphen


def schulen(s):
    s = sj.clean(s.replace("\n", "/")).upper()
    s = re.sub(r"OS\s*/\s*GY", "OS-GY", s)
    out = []
    for x in re.split(r"\s*/\s*|\s+", s):
        x = x.replace("OS-GY", "OS/GY")
        if x and x not in out:
            out.append(x)
    return out


def fix(s, notes, wo):
    for a, b in FIX_TEXT:
        if a in s:
            s = s.replace(a, b)
            notes.append({"text": f"{wo}: „{a}“ → „{b}“."})
    return s


def header_index(rows):
    for i, r in enumerate(rows):
        low = [sj.clean(c).lower() for c in r]
        if "kürzel" in low and any(c.startswith("e-mail") for c in low):
            return i, low
    raise RuntimeError(f"keine Kopfzeile (Kürzel, E-Mail) im Blatt {SHEET}")


def leute(rows, notes):
    h, low = header_index(rows)

    def at(name):
        return next((i for i, c in enumerate(low) if c.startswith(name)), None)
    ix = {k: at(k) for k in ("anrede", "name", "vorname", "kürzel", "e-mail", "tel", "raum", "schule")}
    out = []
    for n, r in enumerate(rows[h + 1:], start=h + 2):
        def get(k):
            i = ix[k]
            return r[i] if i is not None and i < len(r) else ""
        name, vorname = sj.clean(get("name")), sj.clean(get("vorname"))
        if not name:
            continue
        anrede = sj.clean(get("anrede"))
        if anrede in FIX_ANREDE:
            notes.append({"text": f"Zeile {n} ({name}): Anrede „{anrede}“ → „{FIX_ANREDE[anrede]}“."})
            anrede = FIX_ANREDE[anrede]
        titel = ""
        m = re.match(r"(.*?),\s*((?:Prof\.\s*)?Dr\.(?:\s*[\w.-]+\.)?)$", vorname)
        if m:
            vorname, titel = m[1], m[2]
        tel, rm = [nummer(x) for x in lines(get("tel"))], [raum(x) for x in lines(get("raum"))]
        p = {"anrede": anrede, "name": name, "vorname": vorname, "kuerzel": sj.clean(get("kürzel")),
             "mail": sj.clean(get("e-mail")).lower(), "tel": tel, "raum": rm,
             "schulen": schulen(get("schule"))}
        if titel:
            p["titel"] = titel
        if (name, vorname.split()[0] if vorname else "") == ICH:
            p["ich"] = True
        out.append({k: v for k, v in p.items() if v})
    if not out:
        raise RuntimeError(f"keine Einträge im Blatt {SHEET}")
    out.sort(key=lambda p: (p["name"].casefold(), p.get("vorname", "").casefold()))
    return out


def tel_link(nr):
    digits = re.sub(r"\D", "", nr)
    return ("+49" + VORWAHL[1:] + digits) if digits else ""


def standorte(rows, notes):
    h = next((i for i, r in enumerate(rows) if r and any(sj.clean(c).lower() == "name" for c in r)), None)
    if h is None:
        return []
    low = [sj.clean(c).lower() for c in rows[h]]

    def at(name):
        return next((i for i, c in enumerate(low) if c.startswith(name)), None)
    i_name, i_tel, i_mail, i_haus = at("name"), at("tel"), at("e-mail"), at("haus")
    out = []
    for r in rows[h + 1:]:
        cell = lambda i: r[i] if i is not None and i < len(r) else ""   # noqa: E731
        ls = lines(cell(i_name))
        if len(ls) < 3:
            continue
        ls = [fix(x, notes, "Standorte") for x in ls]
        strasse, ort = ls[-2], ls[-1]
        kopf = ls[:-2]
        s = {}
        if kopf[0].endswith(":"):                       # "Mittelstufe:" / "Oberstufe:"
            s["stufe"] = kopf.pop(0).rstrip(":").strip()
        zusatz = [x for x in kopf if x.startswith("(")]
        s["name"] = " ".join(x for x in kopf if not x.startswith("("))
        if zusatz:
            s["zusatz"] = " ".join(zusatz).strip("()")
        s.update({"strasse": strasse, "ort": ort})
        nrs = [nummer(x) for x in lines(cell(i_tel))]
        if nrs:
            s["tel"] = nrs[0]
            s["tel_link"] = tel_link(nrs[0])
        if len(nrs) > 1:
            s["fax"] = nrs[1]
        if sj.clean(cell(i_mail)):
            s["mail"] = sj.clean(cell(i_mail)).lower()
        if sj.clean(cell(i_haus)):
            s["haus"] = sj.clean(cell(i_haus))
        out.append(s)
    return out


def build(path, link):
    sheets, saved = read_xlsx(path)
    if SHEET not in sheets:
        raise RuntimeError(f"kein Blatt „{SHEET}“ in der Datei")
    notes = []
    ps = leute(sheets[SHEET], notes)
    known = [s for s in SCHULEN if any(s in p.get("schulen", []) for p in ps)]
    rest = sorted({s for p in ps for s in p.get("schulen", [])} - set(SCHULEN))
    return {
        "titel": "Telefonliste IBB",
        "quelle": {"datei": os.path.basename(path), "geaendert": saved, "link": link},
        "schulen": known + rest,
        "leute": ps,
        "standorte": standorte(sheets.get(SITES, []), notes),
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
    print(f"gepusht: {len(data['leute'])} Einträge, {len(data['standorte'])} Standorte, "
          f"{len(data['korrekturen'])} Hinweise ({data['quelle']['datei']})")


if __name__ == "__main__":
    main()
