#!/usr/bin/env python3
"""Klassenarbeiten und Klausuren BGY: from the school's Teams plans onto the SVP page klassenarbeiten.html.

The school keeps the dates of all written tests per year group in Teams
(BGY - Documents/02 Schuljahresplanung/<yyyy_yyyy>/Klausuren und Klassenarbeiten/BGY24|25|26/),
synced to this Mac by OneDrive - each folder holds an Excel sheet (week, date, course, teacher,
supervision, room) and a Word table (week, subject/teacher), filled in by hand and not always
the same. This script reads all of them, gives every entry a week and - where the files say
so - a day, puts the Excel and the Word entry of the same test together, checks the dates
against the Saxon calendar and the rule of BGySO § 17 (4) / § 18 (3) - a pupil should write
no more than one Klassenarbeit a day and no more than three a week - and upserts the result
into Supabase: table svp_untis, row "_klassenarbeiten", which only Doc's account may read
(RLS on his uid), written through the Management API exactly like schuljahr.py.
Nothing of the plans goes into the repo (colleagues' names, rooms).

    python3 tools/klassenarbeiten.py           # read, push when something changed
    python3 tools/klassenarbeiten.py --dry     # print the result, push nothing
    python3 tools/klassenarbeiten.py --force   # push even when nothing changed
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
CACHE = os.path.join(REPO, "HTML", "svp", "plandaten", "klassenarbeiten.json")
ROW = "_klassenarbeiten"   # svp_untis row; its data has no "weeks", so the Untis readers skip it
ICH = "Alvers"             # Doc's own tests get marked on the page
W = sj.W
X = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
DCT = "{http://purl.org/dc/terms/}"
WOCHENTAG = sj.WOCHENTAG

DATE = re.compile(r"(?<![\d.:])(\d{1,2})\.\s?(\d{1,2})(?:\.(?:\s?(\d{4}|\d{2})(?![\d.:]))?|(?=[)\s]))")
KW_LABEL = re.compile(r"KW\s*(\d{1,2})\s*/\s*(\d{2})")
# a class group named in the text: "26-1,2", "BGY26-5&6", "26-3/4" (clean() turns the hyphen into "–")
GRUPPE = re.compile(r"(\d{2})\s*[-–]\s*(\d)\s*[,/&+]\s*(\d)")
# a weekday in brackets behind a date: "(Mi)", "(F)"
TAG_KLAMMER = re.compile(r"\(\s*(Mo|Di|Mi|Do|Fr|F|Sa|So)\s*\)")
TAG_INDEX = {"Mo": 0, "Di": 1, "Mi": 2, "Do": 3, "Fr": 4, "F": 4, "Sa": 5, "So": 6}
# a weekday written out, without a date: "Donnerstag 8-9:30 Uhr", "(Mittwoch 11.11.)"
TAG_LANG = re.compile(r"\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag)\b")
# what the school writes beside a date: the phase of the half-year, "Unterricht" = in the lesson
ZUSATZ = re.compile(r"\(?\s*\b(Testphase|Testslot|Inputzeit|Inputphase|TP|Unterricht)\b\s*\)?", re.I)
ZEIT = re.compile(r"(?:von\s*)?(\d{1,2})(?:[.:](\d{2}))?\s*(?:Uhr)?\s*(?:bis|[-–])\s*(\d{1,2})[.:](\d{2})\s*(?:Uhr)?", re.I)
KOMPLEX = re.compile(r"kompl(exe|\.)\s*l(eistung)?\.?|\(KL\)", re.I)
FUELL = re.compile(r"\bKlassenarbeit\b|\bKlausur\b|\bKA\b|[_:]", re.I)
RAUM = re.compile(r"^(K[EÖ]S?\s?\d{3}|\d{3}|Campus)$")
UNKLAR = {"?", "offen", "-", "–"}


def glatt(s):
    """A text without empty brackets and the commas or dashes left at its ends."""
    s = re.sub(r"\(\s*\)", "", s or "")
    return sj.clean(s).strip(" ,;:-–_/")

# subject words, so the Excel and the Word line of the same test find each other
FAECHER = [("spanisch", r"spa(nisch|nich)?"), ("englisch", r"eng(lisch)?"), ("deutsch", r"deu(tsch)?"),
           ("mathe", r"ma(the(matik)?)?(lk|gk)?"), ("gegk", r"ge\s*/?\s*gk"), ("geso", r"geso"),
           ("vbwl", r"vbwl"), ("bio", r"bio(logie)?"), ("wr", r"wr|wire"), ("insy", r"insy"),
           ("ethik", r"ethik"), ("physik", r"phy(sik)?"), ("gus", r"gus"), ("musik", r"musik"),
           ("elch", r"elch"), ("informatik", r"inf(o|ormatik)?")]


def daten(text):
    """The dd.mm. matches of a text that can be a date ("14.30 bis 16.15 Uhr" cannot)."""
    return [m for m in DATE.finditer(text or "") if 1 <= int(m[2]) <= 12 and 1 <= int(m[1]) <= 31]


def faecher(s):
    low = s.lower()
    return {name for name, rx in FAECHER if re.search(r"(?<![a-zäöü])(%s)(?![a-zäöü])" % rx, low)}


def schuljahr_ordner(today):
    """The Klausuren folder of the school year running today (else the newest one)."""
    found = []
    for folder in glob.glob(os.path.join(sj.ROOT, "[0-9][0-9][0-9][0-9]_[0-9][0-9][0-9][0-9]")):
        sub = [d for d in glob.glob(os.path.join(folder, "Klaus*")) if os.path.isdir(d)]
        if sub:
            found.append((int(os.path.basename(folder)[:4]), sub[0]))
    if not found:
        raise RuntimeError("kein Ordner „Klausuren …“ unter " + sj.ROOT)
    found.sort()
    running = [f for f in found if dt.date(f[0], 8, 1) <= today < dt.date(f[0] + 1, 8, 1)]
    return (running or found)[-1]


def monday(d):
    return d - dt.timedelta(days=d.weekday())


def guess_year(day, month, y1):
    return y1 if month >= 8 else y1 + 1


def parse_date(m, y1, hint_year=None):
    """A dd.mm.(yy) match as a date; without a year the school year (or the row's KW) decides."""
    day, month, year = int(m[1]), int(m[2]), m[3]
    if year:
        y = int(year) + (2000 if len(year) == 2 else 0)
    else:
        y = hint_year if hint_year else guess_year(day, month, y1)
    try:
        return dt.date(y, month, day)
    except ValueError:
        return None


def excel_date(v):
    try:
        n = float(v)
    except (TypeError, ValueError):
        return None
    if 40000 < n < 60000:
        return dt.date(1899, 12, 30) + dt.timedelta(days=int(n))
    return None


def saved_at(z):
    if "docProps/core.xml" in z.namelist():
        m = ET.fromstring(z.read("docProps/core.xml")).find(DCT + "modified")
        return m.text if m is not None else None
    return None


# ---------- reading the files ----------

def read_xlsx(path):
    """{(row, col letter): text} of the first sheet, numbers as text."""
    with zipfile.ZipFile(path) as z:
        ss = []
        if "xl/sharedStrings.xml" in z.namelist():
            for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall(X + "si"):
                ss.append("".join(t.text or "" for t in si.iter(X + "t")))
        sheets = sorted(n for n in z.namelist() if re.match(r"xl/worksheets/sheet\d+\.xml$", n))
        root = ET.fromstring(z.read(sheets[0]))
        saved = saved_at(z)
    cells = {}
    for row in root.iter(X + "row"):
        for c in row.findall(X + "c"):
            ref = c.get("r")
            v, t = c.find(X + "v"), c.get("t")
            if v is not None:
                val = ss[int(v.text)] if t == "s" else v.text
            else:
                isx = c.find(X + "is")
                val = "".join(x.text or "" for x in isx.iter(X + "t")) if isx is not None else None
            if val is not None and sj.clean(val):
                m = re.match(r"([A-Z]+)(\d+)", ref)
                cells[(int(m[2]), m[1])] = sj.clean(val.replace("\n", " "))
    return cells, saved


def col_letters(n):
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def cell_lines(tc):
    """The lines of a Word cell: one per paragraph, breaks and double spaces split too."""
    out = []
    for p in tc.iter(W + "p"):
        raw = ""
        for el in p.iter():
            if el.tag == W + "t":
                raw += el.text or ""
            elif el.tag in (W + "br", W + "tab", W + "cr"):
                raw += "  "
        out += [sj.clean(x) for x in re.split(r"\s{2,}", raw) if sj.clean(x)]
    return out


def read_docx(path):
    """The first table as rows of (column index, lines)."""
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
        saved = saved_at(z)
    table = root.find(W + "body").find(W + "tbl")
    if table is None:
        raise RuntimeError("keine Tabelle in " + os.path.basename(path))
    rows = []
    for tr in table.findall(W + "tr"):
        cells, col = [], 0
        for tc in tr.findall(W + "tc"):
            pr = tc.find(W + "tcPr")
            gs = pr.find(W + "gridSpan") if pr is not None else None
            cells.append((col, cell_lines(tc)))
            col += int(gs.get(W + "val", "1")) if gs is not None else 1
        rows.append(cells)
    return rows, saved


# ---------- the entries ----------

class Jahr:
    """What all files of one school year share: the year, the teachers' names, the notes."""

    def __init__(self, y1):
        self.y1 = y1
        self.namen = set()
        self.notes = []

    def note(self, text, d=None, j=None):
        n = {"text": text}
        if d:
            n["d"] = d.isoformat() if isinstance(d, dt.date) else d
        if j:
            n["j"] = j
        if n not in self.notes:
            self.notes.append(n)

    def lerne_namen(self, s):
        for part in re.split(r"[/+,&]| und ", s or ""):
            w = re.sub(r"\d+", "", part).strip()
            if re.fullmatch(r"[A-ZÄÖÜ][a-zäöüßéèá]{2,}(-[A-ZÄÖÜ][a-zäöüß]+)?", w) and w not in ("Aufsichten", "Testphase", "Raum"):
                self.namen.add(w)

    def wer_in(self, s):
        hits = [n for n in self.namen if re.search(r"(?<![A-Za-zÄÖÜäöüß])%s(?![a-zäöüß])" % re.escape(n), s)]
        return sorted(hits, key=lambda n: s.find(n))


def datum_aus(text, jahr, kw_mo, j):
    """The day a text names, the text without it, and how sure the file is about it.
    "ab 26.10." is no day at all, "18.11.26 ?20.11" a day with a question mark."""
    ms = daten(text)
    if not ms:
        return None, text, None
    m = ms[0]
    vor, nach = text[:m.start()], text[m.end():]
    unsicher = None
    if re.search(r"\bab\s*$", vor, re.I):
        vor = re.sub(r"\bab\s*$", "", vor, flags=re.I)
        unsicher = "ab"
    m2 = re.match(r"\s*\?\s*(\d{1,2}\.\d{1,2}\.?(\d{2,4})?)", nach)
    if m2:
        unsicher = m[0].strip() + " ?" + m2[1]
        nach = nach[m2.end():]
    hint = kw_mo.year if kw_mo and not m[3] and abs(kw_mo.month - int(m[2])) <= 1 else None
    d = parse_date(m, jahr.y1, hint)
    if d is None:
        return None, text, None
    rest = vor + " " + nach
    tk = TAG_KLAMMER.search(rest)
    if tk:
        rest = rest[:tk.start()] + rest[tk.end():]
        if TAG_INDEX[tk[1]] != d.weekday():
            jahr.note(f"{sj.ddmm(d, True)} ist ein {WOCHENTAG[d.weekday()]}, in der Datei steht „{tk[1]}“.", d, j)
    # a wrong year in the date: the day and month fit the week the row stands in
    if kw_mo and monday(d) != kw_mo:
        for y in (kw_mo.year, kw_mo.year + 1, kw_mo.year - 1):
            try:
                alt = d.replace(year=y)
            except ValueError:
                continue
            if monday(alt) == kw_mo:
                jahr.note(f"„{m[0].strip()}“ steht in der KW {kw_mo.isocalendar()[1]} – bei uns {sj.ddmm(alt, True)}.", alt, j)
                d = alt
                break
    return d, sj.clean(rest), unsicher


def eintrag(jahr, j, g, kw_mo, texte, quelle, zeile):
    """One test from the cells of a block (Excel) or a piece of a cell (Word)."""
    texte = list(texte)
    d = unsicher = None
    for i, t in enumerate(texte):
        if t and daten(t):
            d, rest, unsicher = datum_aus(t, jahr, kw_mo, j)
            if d:
                # only beside the date: "(Testphase)", "Unterricht" - elsewhere it is a word of the text
                zusatz = []
                for m in ZUSATZ.finditer(rest):
                    z = {"tp": "Testphase"}.get(m[1].lower(), m[1][:1].upper() + m[1][1:].lower())
                    if z not in zusatz:
                        zusatz.append(z)
                texte[i] = glatt(ZUSATZ.sub(" ", rest))
                break
    else:
        zusatz = []
    if d is None:
        zusatz = []
    if d is None and kw_mo:
        for i, t in enumerate(texte):
            m = TAG_LANG.search(t or "")
            if m:
                d = kw_mo + dt.timedelta(days=["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].index(m[1]))
                texte[i] = glatt(t[:m.start()] + " " + t[m.end():])
                break
    texte = [glatt(TAG_LANG.sub(" ", t or "")) for t in texte]
    if d and not kw_mo:
        kw_mo = monday(d)
    if d and kw_mo and monday(d) != kw_mo:
        jahr.note(f"{sj.tag(d)} steht in der Zeile der Woche ab {sj.ddmm(kw_mo, True)} ({quelle}).", d, j)
        kw_mo = monday(d)
    if unsicher == "ab":
        d, unsicher = None, "ab " + sj.ddmm(d)
    zeit = None
    for i, t in enumerate(texte):
        m = ZEIT.search(t or "")
        if m:
            zeit = f"{int(m[1]):02d}:{m[2]}–{int(m[3]):02d}:{m[4]}"
            texte[i] = glatt(t[:m.start()] + " " + t[m.end():])
    art = "Komplexe Leistung" if any(KOMPLEX.search(t or "") for t in texte) else None
    texte = [glatt(KOMPLEX.sub(" ", t or "")) for t in texte]
    gm = next((GRUPPE.search(t) for t in texte if GRUPPE.search(t)), None)
    if gm and g and gm[1] == j[-2:] and f"{gm[2]},{gm[3]}" != g:
        jahr.note(f"„{' · '.join(x for x in texte if x)}“ steht in der Spalte {j}-{g}, "
                  f"gemeint ist {j}-{gm[2]},{gm[3]}.", d, j)
        g = f"{gm[2]},{gm[3]}"
    if gm:
        texte = [glatt(re.sub(r"\bBGY\s?", "", GRUPPE.sub(" ", t))) for t in texte]
    texte = [glatt(re.sub(r"\bBGY\s?\d{2}\b", " ", t)) for t in texte]
    return {"j": j, "g": g, "mo": kw_mo, "d": d, "unsicher": unsicher, "texte": texte, "zeit": zeit,
            "art": art, "zusatz": zusatz, "quelle": quelle, "zeile": zeile}


def aus_excel(jahr, j, path):
    cells, saved = read_xlsx(path)
    rows = sorted({r for r, _ in cells})
    # the blocks: a "Kurs" in the second head row starts one, up to the next
    head2 = {c: v for (r, c), v in cells.items() if r == 2}
    starts = sorted((c for c, v in head2.items() if v.lower() == "kurs"), key=lambda c: (len(c), c))
    blocks = []
    for c in starts:
        label = cells.get((1, c), "")
        gm = GRUPPE.search(label)
        cols, n = [], sum((ord(ch) - 64) * 26 ** i for i, ch in enumerate(reversed(c)))
        for k in range(4):
            cols.append(col_letters(n + k))
        blocks.append((f"{gm[2]},{gm[3]}" if gm else None, cols))
    for r in rows:
        for _, cols in blocks:
            jahr.lerne_namen(cells.get((r, cols[1]), ""))
            jahr.lerne_namen(cells.get((r, cols[2]), ""))
    out, kw_mo = [], None
    for r in rows:
        if r <= 2:
            continue
        m = KW_LABEL.search(cells.get((r, "A"), ""))
        if m:
            kw_mo = dt.date.fromisocalendar(2000 + int(m[2]), int(m[1]), 1)
        b = cells.get((r, "B"), "")
        row_d = excel_date(b)
        row_text = sj.ddmm(row_d, True) if row_d else b
        for g, cols in blocks:
            vals = [cells.get((r, c), "") for c in cols]
            if not any(vals):
                continue
            texte = list(vals)
            if row_text and not any(daten(v) for v in vals):
                texte[0] = (row_text + " " + texte[0]).strip()
            e = eintrag(jahr, j, g, kw_mo, texte, "Excel", r)
            # a date alone in the course cell pushed the rest one cell to the right
            kurs, lehrer, aufsicht, raum = (e["texte"] + ["", "", "", ""])[:4]
            if not kurs and lehrer:
                kurs, lehrer, aufsicht, raum = lehrer, aufsicht, raum, ""
            if not raum and RAUM.match(aufsicht):
                aufsicht, raum = "", aufsicht
            if not lehrer and jahr.wer_in(aufsicht):
                lehrer = aufsicht
            # a name typed into the course cell: "LK WiRe-GKMuster"
            for nm in jahr.wer_in(kurs):
                if nm in lehrer or not lehrer:
                    lehrer = lehrer or nm
                    kurs = glatt(kurs.replace(nm, " "))
            e.update(fach=kurs, wer=lehrer, aufsicht=aufsicht if aufsicht not in UNKLAR else "",
                     raum=raum if raum not in UNKLAR else "")
            if not (e["fach"] or e["wer"]):
                continue
            out.append(e)
    return out, saved


WOCHE = re.compile(r"^(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?\s*[-–]\s*(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?")


def aus_word(jahr, j, path):
    rows, saved = read_docx(path)
    gruppen, kurs_spalten = {}, False
    for cells in rows[:2]:
        for col, lines in cells:
            t = " ".join(lines)
            gm = GRUPPE.search(t)
            if gm:
                gruppen[col] = f"{gm[2]},{gm[3]}"
            if t.lower().startswith("kurs"):
                kurs_spalten = True
    for cells in rows:
        for col, lines in cells:
            if kurs_spalten and col >= 2:
                for line in lines:
                    jahr.lerne_namen(line)
    out, marken, kw_mo = [], [], None
    for n, cells in enumerate(rows):
        first = " ".join(cells[0][1]) if cells else ""
        m = WOCHE.match(first)
        if m:
            y = m[3] or m[6]
            y = int(y) + (2000 if y and len(y) == 2 else 0) if y else guess_year(int(m[1]), int(m[2]), jahr.y1)
            if not m[3] and m[6] and int(m[2]) > int(m[5]):
                y -= 1            # a week across the new year
            kw_mo = monday(dt.date(y, int(m[2]), int(m[1])))
        elif first and DATE.search(first):
            # a line of its own with a date: "22.01.2027 Notenstopp 11"
            md = DATE.search(first)
            d = parse_date(md, jahr.y1)
            text = sj.clean(first[:md.start()] + first[md.end():])
            if d and text:
                marken.append({"d": d.isoformat(), "j": j, "text": text})
            continue
        elif first:
            continue
        if kw_mo is None:
            continue
        if kurs_spalten:
            # one course per row; a second date in the cell starts a second course
            kurs = sj.clean(" ".join(next((ls for c, ls in cells if c == 1), [])))
            wer = sj.clean(" ".join(next((ls for c, ls in cells if c == 2), [])))
            ms = daten(kurs)
            if len(ms) > 1 and ms[0].start() > 0:
                cuts = [m.end() for m in ms[:-1]]
            else:
                cuts = [m.start() for m in ms][1:]
            if not kurs:
                continue
            for teil in [kurs[a:b] for a, b in zip([0] + cuts, cuts + [len(kurs)])]:
                e = eintrag(jahr, j, None, kw_mo, [teil, wer], "Word", n)
                e.update(fach=e["texte"][0], wer=e["texte"][1], aufsicht="", raum="")
                if e["fach"] or e["wer"]:
                    out.append(e)
            continue
        for col, lines in cells[1:]:
            g = gruppen.get(col)
            for teil in stuecke(" ".join(lines), jahr):
                e = eintrag(jahr, j, g, kw_mo, [teil], "Word", n)
                text = e["texte"][0]
                namen = jahr.wer_in(text)
                wer = namen[0] if namen else ""
                fach = text
                for nm in namen:
                    fach = re.sub(r"%s(\s?\d(?![\d.]))?" % re.escape(nm), " ", fach)
                fach = glatt(re.sub(r"\(\s*([^)]*)\)", r"\1", FUELL.sub(" ", fach)))
                if not (fach or wer):
                    continue
                e.update(fach=fach, wer=wer, aufsicht="", raum="")
                out.append(e)
    return out, marken, saved


def stuecke(text, jahr):
    """A Word cell holds one test or several in a row ("KA (ENG)_Muster Komplexe Leistung GeSo Beispiel"):
    every teacher's name ends one; what follows a name without a subject of its own
    ("… Muster1 Klassenarbeit") still belongs to it."""
    text = sj.clean(re.sub(r"(?<=[a-zäöü])(?=(Klassenarbeit|Klausur|Komplexe|KA\b))", " ", text))
    if not text:
        return []
    ends = []
    for nm in jahr.namen:
        for m in re.finditer(r"(?<![A-Za-zÄÖÜäöüß])%s(\s?\d(?![\d.]))?(?![a-zäöüß])(\s*,\s*\d{1,2}\.\d{1,2}\.(\d{2,4})?)?" % re.escape(nm), text):
            ends.append(m.end())
    ends = sorted(set(ends))
    parts, a = [], 0
    for b in ends + [len(text)]:
        if b > a:
            parts.append(text[a:b])
            a = b
    out = []
    for p in parts:
        p = sj.clean(p)
        bare = glatt(FUELL.sub(" ", re.sub(r"\d", " ", p)))
        if out and not faecher(p) and not jahr.wer_in(p) and not DATE.search(p) and len(bare) < 4:
            out[-1] = out[-1] + " " + p
        elif p:
            out.append(p)
    return out


# ---------- putting Excel and Word together ----------

def passt(a, b, jahr):
    """How well two entries of the same group and week describe the same test (0 = not at all)."""
    s = 0
    wa = set(jahr.wer_in(" ".join([a["wer"], a["aufsicht"]]))) or ({a["wer"]} if a["wer"] else set())
    wb = set(jahr.wer_in(" ".join([b["wer"], b["fach"]]))) or ({b["wer"]} if b["wer"] else set())
    if wa & wb:
        s += 2
    fa, fb = faecher(a["fach"]), faecher(b["fach"])
    if fa & fb:
        s += 1
    elif fa and fb:
        s -= 2
    if a["d"] and b["d"]:
        s += 2 if a["d"] == b["d"] else -1
    return s


def zusammen(excel, word, jahr):
    out, used = [], set()
    for b in word:
        best, score = None, 0
        for i, a in enumerate(excel):
            if i in used or a["j"] != b["j"] or a["g"] != b["g"] or a["mo"] != b["mo"]:
                continue
            s = passt(a, b, jahr)
            if s > score:
                best, score = i, s
        if best is None:
            out.append(dict(b, quellen=["Word"]))
            continue
        used.add(best)
        a = excel[best]
        e = dict(a, quellen=["Excel", "Word"])
        if not e["d"] and b["d"]:
            e["d"] = b["d"]
        elif a["d"] and b["d"] and a["d"] != b["d"]:
            jahr.note(f"{a['fach'] or b['fach']} ({b['wer'] or a['wer']}): Excel sagt {sj.tag(a['d'])}, "
                      f"Word sagt {sj.tag(b['d'])}.", a["d"], a["j"])
        e["art"] = a["art"] or b["art"]
        e["unsicher"] = a["unsicher"] or b["unsicher"]
        e["zusatz"] = a["zusatz"] + [z for z in b["zusatz"] if z not in a["zusatz"]]
        if not e["wer"]:
            e["wer"] = b["wer"]
        out.append(e)
    out += [dict(a, quellen=["Excel"]) for i, a in enumerate(excel) if i not in used]
    # the same test a week apart in the two files
    nur = [e for e in out if len(e["quellen"]) == 1]
    wochen = {}
    for a in nur:
        if a["quellen"] != ["Excel"]:
            continue
        for b in nur:
            if (b["quellen"] == ["Word"] and a["j"] == b["j"] and a["g"] == b["g"]
                    and abs((a["mo"] - b["mo"]).days) == 7 and passt(a, b, jahr) >= 1):
                key = (a["j"], frozenset(faecher(a["fach"])) or a["fach"], a["mo"], b["mo"])
                wochen.setdefault(key, [a["fach"] or b["fach"], []])[1].append(a["g"])
    for (j, _, ma, mb), (fach, gs) in sorted(wochen.items(), key=lambda x: (min(x[0][2], x[0][3]), x[0][0])):
        gs = sorted(g for g in gs if g)
        gr = f"{j}-{gs[0]}" if len(gs) == 1 else (f"{j} ({', '.join(gs)})" if gs else j)
        jahr.note(f"{fach} {gr}: Excel in der KW {ma.isocalendar()[1]}, Word in der KW {mb.isocalendar()[1]} "
                  "– welche Woche stimmt?", min(ma, mb), j)
    return out


# ---------- the rule and the calendar ----------

def pruefe(eintraege, jahr, stufe_von):
    """BGySO § 17 (4): no more than one a day, no more than three a week - per class in 11.
    In 12 and 13 the courses mix the classes, so two subjects on one day are only worth a look
    (parallel courses of one subject - GK Ge 1 to 4 - are no clash). A Komplexe Leistung is no
    Klassenarbeit and does not count."""
    verstoesse = []
    def gruppe(e):
        return (e["j"], e["g"]) if e["g"] else None
    tage, wochen = {}, {}
    for i, e in enumerate(eintraege):
        if e["art"] == "Komplexe Leistung":
            continue
        if stufe_von[e["j"]] == 11 and gruppe(e):
            wochen.setdefault((gruppe(e), e["mo"]), []).append(i)
            if e["d"]:
                tage.setdefault((gruppe(e), e["d"]), []).append(i)
        elif e["d"]:
            tage.setdefault(((e["j"], None), e["d"]), []).append(i)
    for ((j, g), d), idx in sorted(tage.items(), key=lambda x: (x[0][1], x[0][0][0], x[0][0][1] or "")):
        if len(idx) < 2:
            continue
        if not g:
            arten = [frozenset(faecher(eintraege[i]["fach"])) or re.sub(r"[\d\s]", "", eintraege[i]["fach"].lower())
                     for i in idx]
            if len(set(arten)) < 2:
                continue
        was = ", ".join(eintraege[i]["fach"] or eintraege[i]["wer"] for i in idx)
        if g:
            verstoesse.append({"art": "tag", "j": j, "g": g, "d": d.isoformat(), "idx": idx,
                               "text": f"{j}-{g}: {len(idx)} am {sj.tag(d)} ({was}) – höchstens eine pro Tag."})
        else:
            verstoesse.append({"art": "pruefen", "j": j, "d": d.isoformat(), "idx": idx,
                               "text": f"{j}: {len(idx)} Klausuren am {sj.tag(d)} ({was}) – nur ein Problem, "
                                       "wenn jemand beide Kurse hat."})
    for ((j, g), mo), idx in sorted(wochen.items(), key=lambda x: (x[0][1], x[0][0])):
        if len(idx) > 3:
            was = ", ".join(eintraege[i]["fach"] or eintraege[i]["wer"] for i in idx)
            verstoesse.append({"art": "woche", "j": j, "g": g, "mo": mo.isoformat(), "idx": idx,
                               "text": f"{j}-{g}: {len(idx)} in der KW {mo.isocalendar()[1]} ({was}) – "
                                       "höchstens drei pro Woche."})
    return verstoesse


def kalender(eintraege, jahr):
    key = f"{jahr.y1}_{jahr.y1 + 1}"
    ferien = [(n, dt.date.fromisoformat(a), dt.date.fromisoformat(b)) for n, a, b in sj.SMK_FERIEN.get(key, [])]
    if not ferien:
        jahr.note(f"Ferientermine {jahr.y1}/{str(jahr.y1 + 1)[2:]} fehlen in tools/schuljahr.py (SMK_FERIEN) "
                  "- die Termine sind nicht gegen die Ferien geprüft.")
    hol = {**sj.feiertage(jahr.y1), **sj.feiertage(jahr.y1 + 1)}
    for e in eintraege:
        d = e["d"]
        if not d:
            continue
        f = next(((n, a, b) for n, a, b in ferien if a <= d <= b), None)
        if f:
            e["frei"] = f[0]
            jahr.note(f"{e['fach']} ({e['j']}) am {sj.tag(d)} liegt in den {f[0]}.", d, e["j"])
        elif d in hol:
            e["frei"] = hol[d][0]
            jahr.note(f"{e['fach']} ({e['j']}) am {sj.tag(d)}: Feiertag ({hol[d][0]}).", d, e["j"])
        elif d.weekday() > 4:
            jahr.note(f"{e['fach']} ({e['j']}): {sj.tag(d)} ist ein Wochenende.", d, e["j"])
    return ferien


def build(today):
    y1, folder = schuljahr_ordner(today)
    jahr = Jahr(y1)
    jahrgaenge, quellen, eintraege, marken = [], [], [], []
    stufe_von, ordner = {}, []
    for sub in sorted(glob.glob(os.path.join(folder, "BGY[0-9][0-9]")), reverse=True):
        j = os.path.basename(sub)
        stufe = 11 + (y1 % 100) - int(j[3:])
        if 11 <= stufe <= 13:
            stufe_von[j] = stufe
            ordner.append((j, sub,
                           [f for f in glob.glob(os.path.join(sub, "*.xlsx")) if not os.path.basename(f).startswith("~$")],
                           [f for f in glob.glob(os.path.join(sub, "*.docx")) if not os.path.basename(f).startswith("~$")]))
    # a first round only learns the teachers' names (Excel columns, the Word course tables) -
    # the Word lines of every year group are read with all of them
    for j, sub, xs, ws in ordner:
        for f in xs:
            aus_excel(jahr, j, f)
        for f in ws:
            aus_word(jahr, j, f)
    jahr.notes = []
    for j, sub, xs, ws in ordner:
        excel, word = [], []
        for f in xs:
            e, saved = aus_excel(jahr, j, f)
            excel += e
            quellen.append({"j": j, "datei": os.path.basename(f), "geaendert": saved,
                            "mtime": dt.datetime.fromtimestamp(os.path.getmtime(f)).astimezone().isoformat(timespec="minutes")})
        for f in ws:
            e, mk, saved = aus_word(jahr, j, f)
            word += e
            marken += mk
            quellen.append({"j": j, "datei": os.path.basename(f), "geaendert": saved,
                            "mtime": dt.datetime.fromtimestamp(os.path.getmtime(f)).astimezone().isoformat(timespec="minutes")})
        gruppen = sorted({e["g"] for e in excel + word if e["g"]})
        jahrgaenge.append({"j": j, "stufe": stufe_von[j], "gruppen": gruppen})
        eintraege += zusammen(excel, word, jahr)
    if not eintraege:
        raise RuntimeError("keine Einträge in " + folder)

    eintraege = [e for e in eintraege if e["mo"]]
    eintraege.sort(key=lambda e: (e["mo"], e["d"] or e["mo"] + dt.timedelta(days=7), e["j"], e["g"] or "", e["fach"]))
    ferien = kalender(eintraege, jahr)
    verstoesse = pruefe(eintraege, jahr, stufe_von)
    for v in verstoesse:
        for i in v.pop("idx"):
            eintraege[i].setdefault("verstoss", "pruefen" if v["art"] == "pruefen" else "regel")
            if v["art"] != "pruefen":
                eintraege[i]["verstoss"] = "regel"

    out = []
    for e in eintraege:
        o = {"j": e["j"], "mo": e["mo"].isoformat(), "kw": e["mo"].isocalendar()[1],
             "fach": e["fach"], "wer": e["wer"], "quellen": e["quellen"]}
        if e["g"]:
            o["g"] = e["g"]
        if e["d"]:
            o["d"] = e["d"].isoformat()
        for k in ("unsicher", "art", "frei", "verstoss"):
            if e.get(k):
                o[k] = e[k]
        if e["zusatz"]:
            o["zusatz"] = e["zusatz"]
        if e["aufsicht"] and e["aufsicht"] != e["wer"]:
            o["aufsicht"] = e["aufsicht"]
        if e["raum"]:
            o["raum"] = e["raum"]
        if ICH in (e["wer"] + " " + e["aufsicht"]):
            o["meins"] = True
        out.append(o)

    first = min(dt.date.fromisoformat(o["mo"]) for o in out)
    last = max(dt.date.fromisoformat(o["mo"]) for o in out) + dt.timedelta(days=6)
    return {
        "schuljahr": f"{y1}/{str(y1 + 1)[2:]}",
        "jahrgaenge": jahrgaenge,
        "eintraege": out,
        "marken": sorted(marken, key=lambda m: m["d"]),
        "ferien": [{"name": n, "von": a.isoformat(), "bis": b.isoformat()} for n, a, b in ferien
                   if a <= last and b >= first],
        "verstoesse": verstoesse,
        "korrekturen": sorted(jahr.notes, key=lambda n: n.get("d", "9999")),
        "quelle": {"ordner": os.path.relpath(folder, os.path.dirname(sj.ROOT)), "dateien": quellen},
    }


def push(data):
    body = json.dumps(data, ensure_ascii=False)
    back = sj.sql("insert into public.svp_untis (page, data, generated) values "
                  f"({sj.q(ROW)}, {sj.q(body)}::jsonb, now()) on conflict (page) do update "
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
        data = build(now.date())
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
    print(stamp, f"gepusht: {len(data['eintraege'])} Einträge, {len(data['verstoesse'])} Regelhinweise, "
                 f"{len(data['korrekturen'])} Korrekturen")


if __name__ == "__main__":
    main()
