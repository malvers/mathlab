"""DocMitschrift pages on Doc's Mac: a day, the lessons of a week, and the trash for single sections.

Doc, 06.11.2026: "Wir machen das Notizen als Button. Und wenn man Notizen klickt für die jeweilige
Unterrichtsstunde, öffnet sich in einem neuen Tab die Mitschriftenseite." Doc, 07.11.2026: "dass man die
einzelnen löschen und einklappen kann" - every section (a lesson, a talk, "Außerhalb der Stunden") folds
away and can go into the trash. The trash never deletes anything: it is a log next to the day's data,
daten/<tag>.papierkorb.jsonl, the last word per section counts ("weg" or "zurueck"), and every page, the
"Notizen" button and the class pages of mitschrift.py leave a section out while it lies there - also
after the day is written down again. The text is school data and stays on this Mac: it is read from
~/Documents/mitschrift (written by mitschrift.py), the pages are built per call and nothing goes into
the repo. serve.py hands the requests over, only to its own pages (local_caller), and reloads this file
on every call.

    GET  /__mitschrift/tag?d=2026-11-07[&wortlaut=1]  one day (no d: the newest), ‹ › to the days around it
    GET  /__mitschrift/woche?s=20261106-0950-9a,...    the lessons the plan's "Notizen" button names
    GET  /__mitschrift/woche?w=20261102&k=9a&f=Inf     the lessons of classes k (subjects f) in the week of w
    GET  /__mitschrift/stunden.json                    every written-down lesson: date, start, end, classes
    POST /__mitschrift/papierkorb  {tag, id, aktion}   a section into the trash ("weg") or back ("zurueck")
    POST /__mitschrift/zusammenfassung {tag, id, gliederung}   Doc's own outline of a section (null: the page's)

The button (HTML/svp/svp-plan-mitschrift.js) knows a week's lessons from WebUntis (date, start, class);
a lesson belongs to a written-down block when the date and a class match and its start lies inside the
block (mitschrift.py joins a double lesson into one block). From there the page walks week by week
through the same classes and subjects (Doc, 07.11.2026: "diese Woche" und "letzte Woche", variant 2:
one button, "‹ Woche 45 · 02.–08.11. ›" on the page, never past the current week).
"""
import datetime as dt
import html
import json
import os
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit

ROOT = Path.home() / "Documents" / "mitschrift"
CSS = Path(__file__).with_name("lesen.css")
JS = Path(__file__).with_name("lesen.js")
# serve.py runs under launchd with a short PATH, so pandoc is also looked for where Homebrew puts it
PANDOC = shutil.which("pandoc") or next((p for p in ("/opt/homebrew/bin/pandoc", "/usr/local/bin/pandoc")
                                         if Path(p).exists()), "pandoc")
KEY = re.compile(r"^(\d{8})-(\d{2})(\d{2})-([A-Za-z0-9.+_-]{1,40})$")   # date-HHMM-class, coupled classes joined by +
DAY = re.compile(r"^\d{4}-\d\d-\d\d$")
HEAD = re.compile(r"^(\d\d):(\d\d)–(\d\d):(\d\d) · (.*)$")           # "09:50–10:35 · Inf · 9a · S218"
SID = re.compile(r"^[a-z0-9-]{1,60}$")
CUT = "<!-- docnote-abschnitt -->"                                     # between the parts of one pandoc run
# written out on the page (Doc, 07.11.2026: "Schreib bitte oben die Wochentage aus ... Platz haben wir ja genug")
WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

# Icons from Lucide (ISC licence, lucide.dev): chevron-down, chevron-left, chevron-right, trash-2
SVG = '<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' \
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{d}</svg>'
ICON = {
    "down": '<path d="m6 9 6 6 6-6"/>',
    "left": '<path d="m15 18-6-6 6-6"/>',
    "right": '<path d="m9 18 6-6-6-6"/>',
    "trash": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>'
             '<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/>'
             '<line x1="14" x2="14" y1="11" y2="17"/>',
}


def icon(name, cls="ico"):
    return SVG.format(cls=cls, d=ICON[name])


def german(day):
    return f"{WEEKDAYS[day.weekday()]}, {day:%d.%m.%Y}"


# ---------------------------------------------------------------- sections and the trash

def section_id(heading):
    """The name of a section of a day, the same after every rebuild: its start and its kind. Lessons never
    share a start, talks recorded by hand are joined by mitschrift.py when they follow each other."""
    m = HEAD.match(heading)
    if m:
        kind = "gespraech" if m.group(5).strip() == "Gespräch" else "stunde"
        return f"{m.group(1)}{m.group(2)}-{kind}"
    if heading.startswith("Außerhalb"):
        return "ausserhalb"
    return re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")[:60] or "abschnitt"


def lesson_id(start):
    """section_id of a lesson from its start as stunden.json keeps it ("2026-11-06T09:50")."""
    return start[-5:].replace(":", "") + "-stunde"


def trash_file(root, day):
    return Path(root) / "daten" / f"{day}.papierkorb.jsonl"


def deleted(root, day):
    """id -> log entry of every section of that day that lies in the trash now (the last word counts).
    Also used by mitschrift.py for the class pages."""
    out = {}
    try:
        lines = trash_file(root, day).read_text().splitlines()
    except OSError:
        return out
    for line in lines:
        try:
            e = json.loads(line)
        except ValueError:
            continue
        if e.get("aktion") == "weg":
            out[e.get("id")] = e
        elif e.get("aktion") == "zurueck":
            out.pop(e.get("id"), None)
    return out


def day_parts(day):
    """(notes, sections) of tage/<day>.md: the lines under its title and per '## ' part its id, heading
    and body. None when the day has no page."""
    page = ROOT / "tage" / f"{day}.md"
    if not page.exists():
        return None
    chunks = re.split(r"(?m)^(?=## )", page.read_text())
    first = chunks[0]
    notes = first.split("\n", 1)[1] if first.startswith("# ") and "\n" in first else \
        ("" if first.startswith("# ") else first)       # the "# Mitschrift · ..." line gives way to the page's title
    sections = []
    for c in chunks[1:]:
        heading, _, body = c.partition("\n")
        heading = heading[3:].strip()
        sections.append({"id": section_id(heading), "heading": heading, "body": body})
    return notes.strip(), sections


def head_parts(heading):
    """('09:50–10:35', 'Inf · 9a · S218') - parts the timetable left empty ("None") are dropped. A heading
    without a time ("Außerhalb der Stunden") stands where the time stands, in its colour (Doc, 07.11.2026:
    "alignen und auch gelb ... dann ist es, wenn du so willst, eine Zeitangabe")."""
    m = HEAD.match(heading)
    if not m:
        return heading, ""
    kind = " · ".join(p.strip() for p in m.group(5).split(" · ") if p.strip() and p.strip() != "None")
    return f"{m.group(1)}:{m.group(2)}–{m.group(3)}:{m.group(4)}", kind


PART = re.compile(r"^\*\*([^*]+)\*\*\s*$")                            # "**Stoff**" alone on its line
WORDING = re.compile(r"^<details><summary>Wortlaut(?: · (.*?))?</summary>\s*$")
# what the page calls the parts (Doc, 07.11.2026: "Stoff auf Zusammenfassung. Im Unterricht bitte im Gespräch.
# Und Wortlaut Transkript. Englisch."); the day pages keep their words, the remembered state its keys
SHOWN = {"Stoff": "Zusammenfassung", "Im Unterricht": "Im Gespräch"}
TRANSCRIPT = "Transcript"


# ---- Zusammenfassung and Im Gespräch as one outline (Doc, 07.11.2026: "fasst die beiden mal bitte zusammen ...
# dass man die Überschrift hat, Sensoren in Handys, und dann so ein bisschen genauer noch drunter aus dem im
# Gespräch"). The model gives two flat lists - topics (Stoff) and what was said, in spoken order (Im Unterricht).
# Here, on the page only, each point said goes under the topic it shares the most words with; a point that
# shares none but speaks of "sie", "es" ... continues the point before; any other stands on its own. Topics are
# ordered as they came up; a topic that only repeats another one (or a point under it) is dropped.
STOP = set("""aber alle allem allen aller alles also auch beim dabei damit dann darauf daran davon dazu dass deine
deinem deinen deiner dem den denen der deren des dessen die dies diese diesem diesen dieser dieses durch eine einem
einen einer eines euch euer eure eurem euren eurer für hier ihre ihrem ihren ihrer ihres immer ist jede jedem jeden
jeder jedes kann keine mehr mit nach nicht noch oder sehr sich sind über unser unsere unserem unseren unter viel
vom von vor war warum was weil welche welchem welchen welcher welches wenn werden wie wird wir zum zur zwei""".split())
REFER = {"sie", "ihr", "ihre", "ihren", "ihrem", "ihn", "ihm", "es", "er", "dies", "diese", "dieser", "dieses",
         "dabei", "dazu", "damit", "davon", "darauf", "daran", "dadurch", "deren", "dessen"}


def words(text):
    return [w for w in re.findall(r"[a-zäöüß]+", text.lower()) if len(w) >= 4 and w not in STOP]


def same_word(a, b):
    """Handy ~ Handys, neuronale ~ neuronalen, Netz ~ Netze: equal, or one begins the other (4+ letters)."""
    return a == b or (min(len(a), len(b)) >= 4 and (a.startswith(b) or b.startswith(a))) or \
        len(os.path.commonprefix([a, b])) >= 6


def covered(ws, others):
    return bool(ws) and all(any(same_word(w, o) for o in others) for w in ws)


def outline(topics, said):
    """[(title, [points said under it])] from the two flat lists."""
    kept = []                                           # [title, words]
    for t in topics:
        ws = words(t)
        hit = next((k for k in kept if covered(ws, k[1])), None)
        if hit:
            continue                                    # "Sensoren" after "Sensoren in Handys, ..."
        wider = next((k for k in kept if covered(k[1], ws)), None)
        if wider:                                       # "Neuronale Netze", then "Künstliches neuronales Netz"
            wider[0], wider[1] = t, ws
            continue
        kept.append([t, ws])
    groups, order, last = {}, [], None
    for p in said:
        ws = words(p)
        score = [sum(any(same_word(w, o) for o in k[1]) for w in ws) for k in kept]
        best = max(range(len(kept)), key=lambda i: (score[i], -i)) if kept else None
        if best is not None and score[best] > 0:
            key = ("t", best)
        elif last is not None and REFER & set(re.findall(r"[a-zäöüß]+", p.lower())):
            key = last                                   # "Wie sie funktionieren ..." goes on with the point before
        else:
            key = ("p", p)                               # a point of its own
        if key not in groups:
            groups[key] = []
            order.append(key)
        if key[0] == "t" and covered(ws, kept[key[1]][1]):
            pass                                         # "Wasserzeichen" under "Wasserzeichen" says nothing new
        elif key[0] == "t" or (key == last and key[0] == "p" and p != key[1]):
            groups[key].append(p)
        last = key
    out = [(kept[k[1]][0] if k[0] == "t" else k[1], groups[k]) for k in order]
    said_words = [w for p in said for w in words(p)]
    for i, (t, ws) in enumerate(kept):                  # topics nobody spoke to: kept unless they repeat a point
        if ("t", i) not in groups and not covered(ws, said_words):
            out.append((t, []))
    return out


def outline_html(items, by_hand=False):
    """The outline as a list (lesen.js makes it editable in place); when Doc rewrote it, a quiet note and the
    way back to the page's own outline under it."""
    lis = []
    for title, under in items:
        sub = "".join(f"<li>{html.escape(u)}</li>" for u in under)
        lis.append(f"<li>{html.escape(title)}" + (f"<ul>{sub}</ul>" if sub else "") + "</li>")
    return (f'<ul class="themen"{" data-von-hand" if by_hand else ""}>{"".join(lis)}</ul>'
            + ('<div class="bearbeiten"><span class="von-hand">von Hand</span><button type="button" '
               'class="knopf klein" data-automatisch>Automatische Fassung</button></div>' if by_hand else ""))


def summary_spans(body):
    """lines, {part name: (first line, end)} of a section body; a part ends at the next one or the wording."""
    lines = body.split("\n")
    marks = [(i, m.group(1).strip()) for i, l in enumerate(lines) if (m := PART.match(l))]
    span = {}
    for n, (i, name) in enumerate(marks):
        end = marks[n + 1][0] if n + 1 < len(marks) else len(lines)
        end = next((j for j in range(i + 1, end) if lines[j].startswith("<details")), end)
        span[name] = (i, end)
    return lines, span


def auto_outline(body):
    """The outline the page builds by itself from the model's two lists, or None without a Stoff list."""
    lines, span = summary_spans(body)
    if "Stoff" not in span:
        return None
    items = lambda name: [l[2:].strip() for l in lines[span[name][0] + 1:span[name][1]] if l.startswith("- ")] \
        if name in span else []
    return outline(items("Stoff"), items("Im Unterricht"))


def merge_parts(body, edited=None):
    """The body with **Stoff** and **Im Unterricht** turned into one **Stoff** part holding the outline -
    Doc's own version of it when he rewrote it."""
    lines, span = summary_spans(body)
    if "Stoff" not in span:
        return body
    tree = edited if edited is not None else auto_outline(body)
    merged = ["**Stoff**", "", outline_html(tree, edited is not None), ""]
    cut = sorted(v for k, v in span.items() if k in ("Stoff", "Im Unterricht"))
    out, at = [], 0
    for n, (a, b) in enumerate(cut):
        out += lines[at:a] + (merged if n == 0 else [])
        at = b
    return "\n".join(out + lines[at:])


# ---- Doc rewrites a Zusammenfassung (Doc, 07.11.2026: "lass mich die Zusammenfassung dann bitte editieren ...
# Gravitationswellen, das war nur aus der Vorrede"). Kept like the trash, as a log next to the day's data -
# daten/<tag>.bearbeitet.jsonl, the last line per section counts, null brings back the page's own outline -
# so every earlier version stays.

def edits_file(root, day):
    return Path(root) / "daten" / f"{day}.bearbeitet.jsonl"


def edits(root, day):
    """section id -> Doc's outline [[topic, [points]], ...] for the sections he rewrote."""
    out = {}
    try:
        lines = edits_file(root, day).read_text().splitlines()
    except OSError:
        return out
    for line in lines:
        try:
            e = json.loads(line)
        except ValueError:
            continue
        if e.get("gliederung") is None:
            out.pop(e.get("id"), None)
        else:
            out[e.get("id")] = e["gliederung"]
    return out


def clean_tree(tree):
    """[[topic, [points]]] from what the browser sent, or None when it is something else."""
    if not isinstance(tree, list) or len(tree) > 200:
        return None
    out = []
    for item in tree:
        if not (isinstance(item, list) and len(item) == 2 and isinstance(item[0], str) and isinstance(item[1], list)):
            return None
        title = item[0].strip()[:500]
        under = [u.strip()[:500] for u in item[1][:200] if isinstance(u, str) and u.strip()]
        if title:
            out.append([title, under])
        elif under:                                     # points without a topic: each one stands on its own
            out += [[u, []] for u in under]
    return out


def summary_post(body):
    """POST /__mitschrift/zusammenfassung {tag, id, gliederung}: Doc's outline (or null) as one line more."""
    try:
        req = json.loads(body or b"{}")
    except ValueError:
        return 400, {"ok": False, "fehler": "kein JSON"}
    if not isinstance(req, dict):
        return 400, {"ok": False, "fehler": "kein Objekt"}
    day, sid = str(req.get("tag", "")), str(req.get("id", ""))
    if not DAY.match(day) or not SID.match(sid):
        return 400, {"ok": False, "fehler": "tag oder id fehlt"}
    parts = day_parts(day)
    hit = next((x for x in parts[1] if x["id"] == sid), None) if parts else None
    if not hit or auto_outline(hit["body"]) is None:
        return 404, {"ok": False, "fehler": "Zusammenfassung nicht gefunden"}
    tree = None
    if req.get("gliederung") is not None:
        tree = clean_tree(req.get("gliederung"))
        if tree is None:
            return 400, {"ok": False, "fehler": "Gliederung unlesbar"}
    entry = {"um": dt.datetime.now().isoformat(timespec="seconds"), "id": sid, "gliederung": tree}
    with edits_file(ROOT, day).open("a") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return 200, {"ok": True, "von_hand": tree is not None,
                 "gliederung": tree if tree is not None else auto_outline(hit["body"])}


def parts_md(body, wording_open=False, edited=None):
    """Stoff, Im Unterricht, Hausaufgabe, Termine and the wording as parts of equal rank, each folding on
    its own (Doc, 07.11.2026: "macht die alle gleich groß und auch einklappbar"): the lists open, the
    wording closed with its numbers small behind its name. The day pages themselves stay as they are."""
    out, part, in_wording = [], False, False
    close = ["", "</details>", ""]
    for line in merge_parts(body, edited).split("\n"):
        if in_wording:
            out.append(line)
            in_wording = line.strip() != "</details>"
            continue
        m = WORDING.match(line)
        if m:
            if part:
                out += close
                part = False
            mass = f'<span class="mass">{html.escape(m.group(1))}</span>' if m.group(1) else ""
            out += [f'<details class="teil" data-teil="wortlaut"{" open data-fest" if wording_open else ""}>'
                    f'<summary><span class="teil-name">{TRANSCRIPT}</span>{mass}</summary>', ""]
            in_wording = True
            continue
        m = PART.match(line)
        if m:
            if part:
                out += close
            name = m.group(1).strip()
            key = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "teil"
            out += [f'<details class="teil" data-teil="{key}" open>'
                    f'<summary><span class="teil-name">{html.escape(SHOWN.get(name, name))}</span></summary>', ""]
            part = True
            continue
        out.append(line)
    if part:
        out += close
    return "\n".join(out)


def trash_post(body):
    """POST /__mitschrift/papierkorb: one line more in the day's trash log, nothing is ever removed."""
    try:
        req = json.loads(body or b"{}")
    except ValueError:
        return 400, {"ok": False, "fehler": "kein JSON"}
    if not isinstance(req, dict):
        return 400, {"ok": False, "fehler": "kein Objekt"}
    day, sid, aktion = str(req.get("tag", "")), str(req.get("id", "")), req.get("aktion")
    if not DAY.match(day) or not SID.match(sid) or aktion not in ("weg", "zurueck"):
        return 400, {"ok": False, "fehler": "tag, id oder aktion fehlt"}
    parts = day_parts(day)
    hit = next((s for s in parts[1] if s["id"] == sid), None) if parts else None
    if not hit:
        return 404, {"ok": False, "fehler": "Abschnitt nicht gefunden"}
    entry = {"um": dt.datetime.now().isoformat(timespec="seconds"), "aktion": aktion, "id": sid}
    if aktion == "weg":
        entry["titel"] = hit["heading"]                 # from the page itself, not from the browser
    with trash_file(ROOT, day).open("a") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return 200, {"ok": True, "papierkorb": sorted(deleted(ROOT, day))}


# ---------------------------------------------------------------- the written-down lessons

def blocks(with_trash=False):
    """The written-down lessons of every day, as mitschrift.py saved them in daten/<tag>.stunden.json -
    without the ones in the trash, unless asked for."""
    out = []
    for f in sorted((ROOT / "daten").glob("*.stunden.json")):
        try:
            rows = json.loads(f.read_text())
        except (OSError, ValueError):
            continue
        gone = {} if with_trash else deleted(ROOT, f.name.split(".")[0])
        for b in rows:
            if not b.get("classes"):            # a slot without a class (break duty) is no lesson
                continue
            if lesson_id(b["start"]) in gone:
                continue
            s, e = dt.datetime.fromisoformat(b["start"]), dt.datetime.fromisoformat(b["end"])
            out.append({"date": f"{s:%Y%m%d}", "start": f"{s:%H:%M}", "end": f"{e:%H:%M}",
                        "classes": list(b["classes"]), "subject": b.get("subject") or ""})
    return out


def wanted(query):
    """The lessons the button asked for: (date, 'HH:MM', [classes])."""
    keys = []
    for part in ",".join(parse_qs(query).get("s", [])).split(","):
        m = KEY.match(part.strip())
        if m:
            keys.append((m.group(1), f"{m.group(2)}:{m.group(3)}", m.group(4).split("+")))
    return keys


# ---------------------------------------------------------------- building a page

def pandoc(md):
    r = subprocess.run([PANDOC, "-f", "markdown", "-t", "html", "--wrap=none"], input=md, text=True,
                       capture_output=True, timeout=30)
    if r.returncode:
        raise RuntimeError(r.stderr.strip() or "pandoc failed")
    return r.stdout


def render(chunks):
    """Markdown parts -> HTML parts with one pandoc run (a day has a handful of sections)."""
    if not chunks:
        return []
    parts = pandoc(f"\n\n{CUT}\n\n".join(chunks)).split(CUT)
    if len(parts) != len(chunks):               # a part swallowed the mark - one run each then
        parts = [pandoc(c) for c in chunks]
    return [p.strip() for p in parts]


# ---- which microphone recorded a part (Doc, 08.11.2026: "unter die Zeit schreiben, welches Mic da eigentlich
# jetzt gerade wirklich dran war"). DocNote reports per piece what Android really routed (and silence),
# bruecke.mjs keeps it in daten/mikro.json; a part's pieces come from its sentences' "quelle".
_cache = {}


def _cached(path, read):
    try:
        key = (path, path.stat().st_mtime)
    except OSError:
        return None
    if key not in _cache:
        _cache[key] = read(path)
    return _cache[key]


def mic_kind(mic):
    """The colour, as in the app: no sound red, receiver/USB green, Bluetooth orange, the phone's own cyan."""
    if "kein Ton" in mic:
        return "stumm"
    last = mic.split(" → ")[-1]                 # changed within a piece: the colour of where it ended
    if last.startswith(("DJI Adapter", "USB")):
        return "adapter"
    if last.startswith(("DJI Mic BT", "BT")):
        return "bt"
    if last.startswith("Telefon Mic"):
        return "telefon"
    return "offen"


def mics_html(day, zeit):
    """'<p class="mikro">' with the microphones of the part from..to, each with its own time when there are
    several. The pieces come from daten/mikro.json itself, by the start in their names, so a silent piece
    (no sentence at all) shows too. Empty when nothing is known (before 08.11.2026, or over the cable)."""
    m = re.match(r"(\d\d):(\d\d)–(\d\d):(\d\d)", zeit or "")
    if not m:
        return ""
    a, b = int(m.group(1)) * 60 + int(m.group(2)), int(m.group(3)) * 60 + int(m.group(4))
    mics = _cached(ROOT / "daten" / "mikro.json", lambda p: json.loads(p.read_text())) or {}
    stamp = day.replace("-", "")
    runs = []                                   # [mic, from, to] in minutes of the day, in time order
    for piece in sorted(mics):
        if not piece.startswith(stamp + "-"):
            continue
        von = int(piece[9:11]) * 60 + int(piece[11:13])
        bis = von + 5                           # a piece is five minutes at most
        if bis <= a or von > b:
            continue
        von, bis = max(von, a), min(bis, b)
        if runs and runs[-1][0] == mics[piece] and von <= runs[-1][2] + 1:
            runs[-1][2] = max(runs[-1][2], bis)
        else:
            runs.append([mics[piece], von, bis])
    if not runs:
        return ""
    hm = lambda x: f"{x // 60:02d}:{x % 60:02d}"
    many = len(runs) > 1
    spans = [f'<span class="m-{mic_kind(mic)}">{html.escape(mic)}</span>'
             + (f' <span class="m-zeit">{hm(v)}–{hm(t)}</span>' if many else "") for mic, v, t in runs]
    return f'<p class="mikro">{" · ".join(spans)}</p>\n'


def section_html(day, s, body, gone, date_label=""):
    """One section: a header that folds it (time, kind) and the trash button, then its content."""
    zeit, kind = head_parts(s["heading"])
    title = " · ".join(p for p in (date_label, zeit, kind) if p)
    anchor = f"a-{day}-{s['id']}"
    date = f'<span class="datum">{html.escape(date_label)}</span>' if date_label else ""
    return (f'<section class="abschnitt" id="{anchor}" data-tag="{day}" data-id="{s["id"]}" '
            f'data-titel="{html.escape(title)}"{" hidden" if s["id"] in gone else ""}>\n'
            f'<div class="kopf"><h2><button type="button" class="klapp" aria-expanded="true" '
            f'aria-controls="{anchor}-i">{icon("down", "pfeil")}{date}'
            + (f'<span class="zeit">{html.escape(zeit)}</span>' if zeit else "")
            + (f'<span class="art">{html.escape(kind)}</span>' if kind else "") +
            f'</button></h2>'
            f'<button type="button" class="weg" title="In den Papierkorb" '
            f'aria-label="{html.escape(title)} in den Papierkorb">{icon("trash")}</button></div>\n'
            + mics_html(day, zeit) +
            f'<div class="inhalt" id="{anchor}-i">\n{body}\n</div>\n</section>')


def shell(title, over, h1, nav, notes, sections, empty):
    css = CSS.read_text() if CSS.exists() else ""
    js = JS.read_text() if JS.exists() else ""
    return ("<!doctype html>\n<html lang=\"de\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
            f"<title>{html.escape(title)}</title>\n"
            f"<style>\n{css}</style>\n</head>\n<body>\n"
            f"<header class=\"seitenkopf\">\n<p class=\"ueber\">{html.escape(over)}</p>\n"
            f"<h1>{html.escape(h1)}</h1>\n"
            f"<div class=\"leiste\">{nav}<span class=\"werkzeug\">"
            "<button type=\"button\" class=\"knopf\" data-alle>Alle zuklappen</button>"
            "<button type=\"button\" class=\"knopf\" data-wortlaut>Transcript öffnen</button></span></div>\n"
            f"{notes}</header>\n<main>\n{sections}\n"
            f"<p class=\"leer\" data-leer{'' if empty else ' hidden'}>{html.escape(empty or 'Alles liegt im Papierkorb.')}</p>\n"
            "</main>\n"
            "<section class=\"korb\" hidden aria-labelledby=\"korb-h\"><h2 id=\"korb-h\">Papierkorb "
            "<span class=\"anzahl\"></span></h2>\n<p class=\"erkl\">Nur ausgeblendet, nichts ist gelöscht: "
            "Das Transcript bleibt erhalten, „Zurückholen“ stellt den Abschnitt wieder her.</p>\n<ul></ul></section>\n"
            "<div class=\"toast\" role=\"status\" aria-live=\"polite\"><span class=\"toast-text\"></span>"
            "<button type=\"button\" class=\"toast-zurueck\" hidden>Rückgängig</button></div>\n"
            "<dialog class=\"frage\" aria-labelledby=\"frage-text\"><p id=\"frage-text\"></p>"
            "<p class=\"frage-klein\">Du kannst es dort jederzeit zurückholen.</p><div class=\"frage-leiste\">"
            "<button type=\"button\" class=\"knopf\" data-frage=\"nein\">Abbrechen</button>"
            "<button type=\"button\" class=\"knopf stark\" data-frage=\"ja\">In den Papierkorb</button>"
            "</div></dialog>\n"
            f"<script>\n{js}</script>\n</body>\n</html>\n").encode("utf-8")


def nav_link(href, label, side, enabled=True, name=""):
    """A ‹ or › pill, with words or (name only for screen readers) just the arrow; a dead one stays in
    place so the row does not jump."""
    ico = icon("left" if side == "left" else "right")
    text = f"<span>{html.escape(label)}</span>" if label else ""
    inner = ico + text if side == "left" else text + ico
    cls = "knopf" + ("" if label else " rund")
    aria = f' aria-label="{html.escape(name)}"' if name else ""
    if not enabled:
        return f'<span class="{cls} tot" aria-disabled="true"{aria}>{inner}</span>'
    nav = "zurueck" if side == "left" else "vor"                    # lesen.js: the arrow keys follow these
    return f'<a class="{cls}" href="{html.escape(href)}" data-nav="{nav}"{aria}>{inner}</a>'


def day_page(query):
    q = parse_qs(query)
    days = sorted(p.stem for p in (ROOT / "tage").glob("*.md") if DAY.match(p.stem))
    d = (q.get("d") or [""])[0]
    if not DAY.match(d):
        d = days[-1] if days else dt.date.today().isoformat()
    day = dt.date.fromisoformat(d)
    wording_open = (q.get("wortlaut") or [""])[0] == "1"

    before = [x for x in days if x < d]
    after = [x for x in days if x > d]
    short = lambda x: f"{WEEKDAYS[dt.date.fromisoformat(x).weekday()]}, {dt.date.fromisoformat(x):%d.%m.}"
    nav = (f'<span class="blaettern">'
           + nav_link(f"?d={before[-1]}" if before else "", short(before[-1]) if before else "früher", "left", bool(before))
           + nav_link(f"?d={after[0]}" if after else "", short(after[0]) if after else "später", "right", bool(after))
           + "</span>")

    parts = day_parts(d)
    if parts is None:
        return shell(f"Mitschrift · {german(day)}", "Mitschrift", german(day), nav, "", "",
                     "Für diesen Tag gibt es keine Mitschrift.")
    notes, sections = parts
    mine = edits(ROOT, d)
    rendered = render([notes] + [parts_md(s["body"], wording_open, mine.get(s["id"])) for s in sections])
    notes_html = f'<div class="hinweis">{rendered[0]}</div>\n' if notes else ""
    gone = deleted(ROOT, d)
    body = "\n".join(section_html(d, s, h, gone) for s, h in zip(sections, rendered[1:]))
    return shell(f"Mitschrift · {german(day)}", "Mitschrift", german(day), nav, notes_html, body,
                 "" if sections else "An diesem Tag ist nichts mitgeschrieben.")


def monday_of(day):
    return day - dt.timedelta(days=day.weekday())


def week_label(monday):
    sunday = monday + dt.timedelta(days=6)
    span = f"{monday:%d.}–{sunday:%d.%m.}" if monday.month == sunday.month else f"{monday:%d.%m.}–{sunday:%d.%m.}"
    return f"Woche {monday.isocalendar()[1]} · {span}"


def week_page(query):
    q = parse_qs(query)
    all_blocks = blocks(with_trash=True)        # a lesson in the trash stays on the page, hidden, to bring it back
    keys = wanted(query)
    if keys:
        # the plan's button: exactly the lessons it named; the walk goes on with their classes and subjects
        found = []
        for date, start, classes in keys:
            for b in all_blocks:
                if b["date"] == date and set(classes) & set(b["classes"]) and b["start"] <= start < b["end"]:
                    if b not in found:
                        found.append(b)
        classes = sorted({c for b in found for c in b["classes"]}) or sorted({c for _, _, cs in keys for c in cs})
        subjects = sorted({b["subject"] for b in found if b["subject"]})
        monday = monday_of(dt.datetime.strptime(min(k[0] for k in keys), "%Y%m%d").date())
    else:
        classes = [c for c in q.get("k", []) if c]
        subjects = [f for f in q.get("f", []) if f]
        try:
            monday = monday_of(dt.datetime.strptime((q.get("w") or [""])[0], "%Y%m%d").date())
        except ValueError:
            monday = monday_of(dt.date.today())
        sunday = monday + dt.timedelta(days=6)
        found = [b for b in all_blocks
                 if f"{monday:%Y%m%d}" <= b["date"] <= f"{sunday:%Y%m%d}"
                 and set(classes) & set(b["classes"]) and (not subjects or b["subject"] in subjects)]
    found.sort(key=lambda b: (b["date"], b["start"]))

    this_week = monday_of(dt.date.today())
    walk = lambda m: "?" + urlencode({"w": f"{m:%Y%m%d}", "k": classes, "f": subjects}, doseq=True)
    back, ahead = monday - dt.timedelta(days=7), monday + dt.timedelta(days=7)
    nav = (f'<span class="blaettern">'
           + nav_link(walk(back), "", "left", name="Woche davor")
           + f'<span class="woche">{html.escape(week_label(monday))}</span>'
           + nav_link(walk(ahead), "", "right", ahead <= this_week, name="Woche danach")
           + "</span>")

    cache, chosen = {}, []
    for b in found:
        day = dt.datetime.strptime(b["date"], "%Y%m%d").date().isoformat()
        if day not in cache:
            cache[day] = day_parts(day)
        parts = cache[day]
        hit = next((s for s in parts[1] if s["id"] == lesson_id(b["start"])), None) if parts else None
        if hit:
            chosen.append((day, hit))
    mine = {day: edits(ROOT, day) for day, _ in chosen}
    rendered = render([parts_md(s["body"], False, mine[day].get(s["id"])) for day, s in chosen])
    body = "\n".join(section_html(day, s, h, deleted(ROOT, day), german(dt.date.fromisoformat(day)))
                     for (day, s), h in zip(chosen, rendered))
    name = ", ".join(classes)
    return shell("Mitschrift" + (f" · {name}" if name else ""), "Mitschrift", name or "Mitschrift", nav, "", body,
                 "" if chosen else "In dieser Woche gibt es keine Mitschrift.")


def handle(path, method="GET", body=b""):
    """(status, content type, body) for a request under /__mitschrift/."""
    url = urlsplit(path)
    as_json = lambda obj: json.dumps(obj, ensure_ascii=False).encode("utf-8")
    if method == "POST":
        if url.path in ("/__mitschrift/papierkorb", "/__mitschrift/zusammenfassung"):
            status, obj = (trash_post if url.path.endswith("papierkorb") else summary_post)(body)
            return status, "application/json; charset=utf-8", as_json(obj)
        return 405, "text/plain; charset=utf-8", b"read-only"
    if url.path == "/__mitschrift/stunden.json":
        return 200, "application/json; charset=utf-8", as_json(blocks())
    if url.path == "/__mitschrift/woche":
        return 200, "text/html; charset=utf-8", week_page(url.query)
    if url.path == "/__mitschrift/tag":
        return 200, "text/html; charset=utf-8", day_page(url.query)
    return 404, "text/plain; charset=utf-8", b"not found"
