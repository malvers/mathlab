#!/usr/bin/env python3
"""DocMitschrift on the Mac: fetch the day's recordings from the Pixel, write them down, sort them by
Doc's timetable and keep one page per day and one per class.

    python3 docmitschrift-app/mitschrift.py            fetch (if the Pixel hangs on USB), transcribe, sort
    python3 docmitschrift-app/mitschrift.py --behalten  same, but the audio stays in eingang/ (for tests)
    python3 docmitschrift-app/mitschrift.py --nur-seiten --tag 2026-11-05   only rebuild that day's pages

Solita's calls (her voice from the Mac or the Pixel, picked up in class) are left out of the pages and
the summaries; the recognised sentences themselves stay in daten/. Homework and dates are only kept
with the words they rest on, and only when those words really stand in the lesson (since 05.11.2026).

Everything stays on this Mac, outside the repo (pupils' lessons are school data):

    ~/Documents/mitschrift/eingang/              pieces from the phone, waiting to be written down
    ~/Documents/mitschrift/daten/<tag>.jsonl     every recognised sentence with its clock time
    ~/Documents/mitschrift/daten/<tag>.stunden.json   the lessons of the day with their summaries
    ~/Documents/mitschrift/tage/<tag>.md         the day: per lesson the summary and the full wording
    ~/Documents/mitschrift/klassen/<klasse>.md   per class: what was said there, newest first
    ~/Documents/mitschrift/daten/<tag>.papierkorb.jsonl   sections Doc hid on the reading page (never deleted)

The reading page is served by serve.py: http://localhost:8765/__mitschrift/tag?d=<tag> (mitschrift_seite.py).

A written-down piece goes to the Trash on the Mac and is deleted on the phone; only the text stays.
Speech recognition and summaries run on this Mac (Apple SpeechAnalyzer and Apple Intelligence).
"""

import argparse
import datetime as dt
import difflib
import hashlib
import json
import math
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

from mitschrift_seite import deleted as in_trash, lesson_id   # the reading page's trash (Doc, 07.11.2026)
try:                                    # who is speaking, Doc or someone else (Alan, 07.11.2026) - optional:
    import sprecher                     # without it (or without its venv/profile) the transcript is written as before
except Exception:                       # noqa: BLE001
    sprecher = None

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
SWIFT = HERE / "mac" / "build" / "mitschrift-mac"
PLAN = REPO / "HTML" / "svp" / "plandaten"
ADB = Path.home() / "Library" / "Android" / "sdk" / "platform-tools" / "adb"
PIXEL = "43211JEKB10668"
PKG = "de.docalvers.docmitschrift"
REMOTE = "files/aufnahmen"
NAME = re.compile(r"^(\d{8})-(\d{6})(-hand)?\.m4a$")   # -hand: Doc tapped Start himself, no lesson (07.11.2026)
TALK_GAP = dt.timedelta(minutes=11)  # recorded by hand: pieces start every 5 min, one silent piece may lie between

EARLY = dt.timedelta(minutes=5)      # sentences this close before or after a lesson still belong to it
MERGE_GAP = 20                       # minutes: the same class again after a short break is one block
WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]


def say(text):
    print(text, flush=True)


# ---------------------------------------------------------------- fetch from the phone

def adb(*args, binary=False):
    r = subprocess.run([str(ADB), "-s", PIXEL, *args], capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode(errors="replace").strip() or "adb failed")
    return r.stdout if binary else r.stdout.decode(errors="replace")


def pixel_there():
    if not ADB.exists():
        return False
    r = subprocess.run([str(ADB), "devices"], capture_output=True, text=True)
    return any(line.split()[:2] == [PIXEL, "device"] for line in r.stdout.splitlines())


def fetch(inbox):
    """Copies every finished piece from the phone, checks its size, then deletes it there."""
    if not pixel_there():
        say("Pixel nicht per USB da – ich nehme, was schon im Eingang liegt.")
        return 0
    try:
        names = adb("exec-out", "run-as", PKG, "ls", REMOTE).split()
    except RuntimeError as e:
        say(f"Pixel ist da, aber DocMitschrift antwortet nicht ({e}).")
        return 0
    got = 0
    for name in sorted(n for n in names if NAME.match(n)):
        remote = f"{REMOTE}/{name}"
        size = int(adb("exec-out", "run-as", PKG, "stat", "-c", "%s", remote).strip())
        data = adb("exec-out", "run-as", PKG, "cat", remote, binary=True)
        if len(data) != size:
            say(f"  {name}: unvollständig ({len(data)} von {size} Bytes), bleibt auf dem Pixel")
            continue
        tmp = inbox / (name + ".tmp")
        tmp.write_bytes(data)
        tmp.rename(inbox / name)
        adb("exec-out", "run-as", PKG, "rm", remote)
        got += 1
    if got:
        say(f"Vom Pixel geholt: {got} Stück(e).")
    return got


# ---------------------------------------------------------------- write down

def transcribe(audio):
    r = subprocess.run([str(SWIFT), "transcribe", str(audio)], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return [json.loads(line) for line in r.stdout.splitlines() if line.strip()]


def to_trash(path):
    trash = Path.home() / ".Trash"
    target = trash / path.name
    if target.exists():
        target = trash / f"{path.stem}-{dt.datetime.now():%H%M%S}{path.suffix}"
    shutil.move(str(path), str(target))


def voices(audio, sentences):
    """Doc or someone else per sentence (sprecher.py), or None - the transcript never fails because of it."""
    if not (sprecher and sentences):
        return None
    try:
        return sprecher.erkenne(audio, sentences)
    except Exception as e:                      # noqa: BLE001
        say(f"    Sprecher: {e}")
        return None


def audio_for(root, name):
    """A piece by its name: still in the inbox, or in the Trash (to_trash adds -HHMMSS when the name is taken)."""
    trash = Path.home() / ".Trash"
    stem, suffix = os.path.splitext(name)
    for p in [root / "eingang" / name, trash / name, *sorted(trash.glob(f"{stem}-{'[0-9]' * 6}{suffix}"))]:
        if p.exists():
            return p
    return None


def relabel(root, day):
    """Who spoke, afterwards, for a day already written down (Doc, 07.11.2026: "das heute mal anwenden auf den
    Vortrag von heute"). The text stays exactly as it is; the audio is only read where it lies (inbox or Trash)
    and stays there. Pieces without audio keep what they had."""
    store = root / "daten" / f"{day}.jsonl"
    if not store.exists():
        say(f"  Sprecher {day}: nichts mitgeschrieben")
        return
    rows = [json.loads(l) for l in store.read_text().splitlines() if l.strip()]
    pieces = {}
    for r in rows:
        pieces.setdefault(r["quelle"], []).append(r)
    done, without = 0, []
    for name, group in sorted(pieces.items()):
        m, audio = NAME.match(name), audio_for(root, name)
        labels = None
        if m and audio:
            begin = dt.datetime.strptime(m.group(1) + m.group(2), "%Y%m%d%H%M%S")
            sentences = [{"start": (dt.datetime.fromisoformat(r["t"]) - begin).total_seconds(),
                          "end": (dt.datetime.fromisoformat(r["bis"]) - begin).total_seconds()} for r in group]
            labels = voices(audio, sentences)
        if labels is None:
            without.append(name)
            continue
        for r, label in zip(group, labels):
            r.pop("sprecher", None)
            r.pop("aehnlich", None)
            for key in ("sprecher", "aehnlich"):            # only these two fields, nothing else from the module
                if label and label.get(key) is not None:
                    r[key] = label[key]
        done += 1
    store.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows))
    say(f"  Sprecher {day}: {done} von {len(pieces)} Stück(en) erkannt"
        + (f", ohne Audio oder Erkennung: {', '.join(without)}" if without else ""))


def write_down(root, keep):
    """Turns every piece in the inbox into sentences with clock times, filed by day."""
    inbox = root / "eingang"
    days = set()
    pieces = sorted(p for p in inbox.iterdir() if NAME.match(p.name))
    for i, audio in enumerate(pieces, 1):
        m = NAME.match(audio.name)
        begin = dt.datetime.strptime(m.group(1) + m.group(2), "%Y%m%d%H%M%S")
        say(f"  schreibe mit {i}/{len(pieces)}: {begin:%d.%m. %H:%M}")
        try:
            sentences = transcribe(audio)
        except RuntimeError as e:
            say(f"    übersprungen: {e}")
            continue
        labels = voices(audio, sentences)        # before the audio goes to the Trash - it is not kept for this
        day = begin.date()
        store = root / "daten" / f"{day}.jsonl"
        rows = [json.loads(l) for l in store.read_text().splitlines()] if store.exists() else []
        rows = [r for r in rows if r["quelle"] != audio.name]          # written down again: replace
        for n, s in enumerate(sentences):
            row = {
                "t": (begin + dt.timedelta(seconds=s["start"])).isoformat(timespec="seconds"),
                "bis": (begin + dt.timedelta(seconds=s["end"])).isoformat(timespec="seconds"),
                "text": s["text"],
                "quelle": audio.name,
            }
            if labels and labels[n]:             # only these two fields, nothing else from the module
                for key in ("sprecher", "aehnlich"):
                    if labels[n].get(key) is not None:
                        row[key] = labels[n][key]
            rows.append(row)
        rows.sort(key=lambda r: r["t"])
        store.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows))
        remember_audio_size(root, day, audio)
        days.add(day)
        if not keep:
            to_trash(audio)
    return days


# ---------------------------------------------------------------- the timetable

def hm(n):
    return dt.time(n // 100, n % 100)


def lessons(day):
    """Doc's lessons of that day from the local Untis copy, double lessons joined into one block."""
    monday = day - dt.timedelta(days=day.weekday())
    week = PLAN / f"w{monday:%Y%m%d}.json"
    if not week.exists():
        return []
    want = int(f"{day:%Y%m%d}")
    rows = [l for l in json.loads(week.read_text())["lessons"]
            if l["date"] == want and l.get("code") != "cancelled"]
    rows.sort(key=lambda l: l["startTime"])
    blocks = []
    for l in rows:
        start = dt.datetime.combine(day, hm(l["startTime"]))
        end = dt.datetime.combine(day, hm(l["endTime"]))
        key = (l["subject"], tuple(l["classes"]))
        last = blocks[-1] if blocks else None
        if last and last["key"] == key and (start - last["end"]).total_seconds() <= MERGE_GAP * 60:
            last["end"] = max(last["end"], end)
            continue
        blocks.append({"key": key, "start": start, "end": end, "subject": l["subject"],
                       "classes": list(l["classes"]), "rooms": list(l.get("rooms") or [])})
    return blocks


def lesson_of(t, blocks):
    inside = [b for b in blocks if b["start"] <= t < b["end"]]
    if inside:
        return inside[0]
    near = [b for b in blocks if b["start"] - EARLY <= t < b["end"] + EARLY]
    return min(near, key=lambda b: min(abs((t - b["start"]).total_seconds()), abs((t - b["end"]).total_seconds()))) if near else None


# ---------------------------------------------------------------- Solita's calls

# Solita calls from the Mac's speakers or from the Pixel itself (DocRuf app) - in class the phone hears
# her, and her words became part of the lesson and of its summary (05.11.2026). When and what she said is
# known: solita-ruf.log has the time of every call, the watcher moves the call's text and MP3 into the
# Trash after playing. Without those files a sentence still counts as hers when it names her with
# "hier ist", the opening of every call.
SOLITA_LOG = Path.home() / "Library" / "Logs" / "solita-ruf.log"
SOLITA_TRASH = Path.home() / ".Trash" / "solita-rufe"
LOUD_INTRO = "Du bist nicht hier, deshalb rufe ich Dich laut."   # solita-laut-ansage.mp3, before every call at 100
SOLITA = re.compile(r"\bs[ao]l[iíy]e?t?a\b", re.I)
MARGIN = dt.timedelta(seconds=3)


def tokens(s):
    return re.sub(r"[^a-zäöüß0-9 ]", " ", s.lower().replace("í", "i")).split()


def seconds_of(mp3):
    if not mp3.exists():
        return None
    r = subprocess.run(["afinfo", str(mp3)], capture_output=True, text=True)
    m = re.search(r"estimated duration: ([\d.]+)", r.stdout)
    return float(m.group(1)) if m else None


def solita_calls(day):
    """Solita's calls of that day as (start, end, her words)."""
    calls = []
    if not SOLITA_LOG.exists():
        return calls
    for line in SOLITA_LOG.read_text(errors="replace").splitlines():
        parts = line.split()
        if len(parts) < 4 or parts[0] != str(day):
            continue
        try:
            start = dt.datetime.fromisoformat(f"{parts[0]}T{parts[1]}")
        except ValueError:
            continue
        mode, name = parts[2], parts[3]
        note = SOLITA_TRASH / re.sub(r"\.mp3$", ".txt", name)
        text = note.read_text(errors="replace") if note.exists() else ""
        length = seconds_of(SOLITA_TRASH / name) or 15.0
        if mode == "vol=100":
            text, length = LOUD_INTRO + " " + text, length + 3.5
        calls.append((start, start + dt.timedelta(seconds=length), [w for w in tokens(text) if len(w) > 2]))
    return calls


def is_solita(row, calls):
    """A sentence heard while she was speaking that is mostly her words (or names her) is hers. Doc's own
    sentences around a call share hardly a word with it and stay (measured 05.11.: hers 55-92 %, his <= 25 %)."""
    t, bis = dt.datetime.fromisoformat(row["t"]), dt.datetime.fromisoformat(row["bis"])
    mine = [w for w in tokens(row["text"]) if len(w) > 2]
    for start, end, hers in calls:
        if bis < start - MARGIN or t > end + MARGIN:
            continue
        if SOLITA.search(row["text"]):
            return True
        if hers and mine:
            hit = sum(b.size for b in difflib.SequenceMatcher(None, mine, hers, autojunk=False).get_matching_blocks())
            if hit >= 2 and hit >= 0.4 * len(mine):
                return True
    return bool(SOLITA.search(row["text"]) and "hier ist" in row["text"].lower())


# ---------------------------------------------------------------- homework and dates: only with their words

HOMEWORK_CUE = re.compile(r"hausaufgabe|zu hause|nächste[nr]? (mal|stunde)|bis (morgen|montag|dienstag|mittwoch|donnerstag"
                          r"|freitag|nächste)|erledig|abgeben|hochlad|vorbereite|durchles|anschau|bearbeite", re.I)
DATE_CUE = re.compile(r"\b(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|übermorgen|heute|"
                      r"nächste[nr]? woche|\d{1,2}\.\s?\d{1,2}\.?|\d{1,2}\.? (januar|februar|märz|april|mai|juni|juli|"
                      r"august|september|oktober|november|dezember)|\d{1,2}(:\d\d)? ?uhr)\b", re.I)


def quote_found(quote, text_words):
    """True when about three quarters of the quote stand together, in order, in the lesson's words -
    the recogniser and the model may each change a word, the model may not make up a sentence."""
    q = tokens(quote)
    if len(q) < 3:
        return False
    need, span, qs = math.ceil(0.75 * len(q)), len(q) + 6, set(q)
    for i, w in enumerate(text_words):
        if w in qs:
            win = text_words[i:i + span]
            if sum(b.size for b in difflib.SequenceMatcher(None, win, q, autojunk=False).get_matching_blocks()) >= need:
                return True
    return False


def grounded(points, text_words, cue):
    """The points that rest on real words: the quote is in the lesson, it sounds like homework (or names a
    day or time), and every number of the point is in the quote. A point without a quote is dropped."""
    keep = []
    for p in points or []:
        if not isinstance(p, dict):
            continue
        punkt, zitat = p.get("punkt", "").strip(), p.get("zitat", "").strip()
        if not punkt or not cue.search(zitat) or not quote_found(zitat, text_words):
            continue
        if any(n not in re.findall(r"\d+", zitat) for n in re.findall(r"\d+", punkt)):
            continue
        keep.append({"punkt": punkt, "zitat": zitat})
    return keep


def homework_and_dates(summary, text_words):
    """Both lists checked against the lesson, and each point filed by its own words: the model put a
    Klassenarbeit with its date under homework in the test (05.11.2026) - homework is what sounds like
    homework, a date is what names a day or a time."""
    both = [p for p in (summary.get("hausaufgaben") or []) + (summary.get("termine") or []) if isinstance(p, dict)]
    homework = grounded(both, text_words, HOMEWORK_CUE)
    taken = {p["zitat"] for p in homework}
    dates = [p for p in grounded(both, text_words, DATE_CUE) if p["zitat"] not in taken]
    return dict(summary, hausaufgaben=homework, termine=dates)


# ---------------------------------------------------------------- summaries

SUMMARY_VERSION = "2"   # 2 = homework and dates with their quotes (05.11.2026); older cache entries are not reused


def summarize(text, cache):
    key = hashlib.sha1((SUMMARY_VERSION + "\n" + text).encode()).hexdigest()
    if key in cache:
        return cache[key]
    r = subprocess.run([str(SWIFT), "summarize"], input=text, capture_output=True, text=True)
    if r.returncode != 0:
        return {"fehler": r.stderr.strip() or "keine Zusammenfassung"}
    result = json.loads(r.stdout)
    cache[key] = result
    return result


SECTIONS = [("stoff", "Stoff"), ("unterricht", "Im Unterricht"), ("hausaufgaben", "Hausaufgabe"), ("termine", "Termine")]


def summary_md(s):
    if not s:
        return ["_Keine Zusammenfassung._"]
    if "fehler" in s:
        return [f"_Keine Zusammenfassung: {s['fehler']}_"]
    out = []
    for key, title in SECTIONS:
        if s.get(key):
            # homework and dates carry the words they rest on, so Doc can see they were really said
            out += [f"**{title}**", ""] + [f"- {p['punkt']} _(„{p['zitat']}“)_" if isinstance(p, dict) else f"- {p}"
                                           for p in s[key]] + [""]
    return out[:-1] if out else ["_Nichts Greifbares._"]


# ---------------------------------------------------------------- pages

def german(day):
    return f"{WEEKDAYS[day.weekday()]}, {day:%d.%m.%Y}"


def wording(rows):
    """The full text, one paragraph per recognised stretch (about a minute each) with its clock time.
    What someone other than Doc said is a span of class "andere", so the reading page can colour it."""
    out = []
    for r in rows:
        text = r["text"]
        if r.get("sprecher") == "andere":
            text = "[" + text.replace("[", "\\[").replace("]", "\\]") + "]{.andere}"
        out.append(f"**{dt.datetime.fromisoformat(r['t']):%H:%M}** {text}")
    return out


def spoken(rows):
    s = sum((dt.datetime.fromisoformat(r["bis"]) - dt.datetime.fromisoformat(r["t"])).total_seconds() for r in rows)
    return f"{round(s / 60)} min" if s >= 60 else f"{round(s)} s"


# Storage next to the word count (Doc, 07.11.2026: "schreib hinter die Wörter auch wie viel Speicher das ist ...
# auch vom mp3"). The audio goes to the Trash after writing down, so its size is kept per day in
# daten/<tag>.audio.json (piece name -> bytes); days written down before that show the text size only.

def audio_sizes_file(root, day):
    return root / "daten" / f"{day}.audio.json"


def remember_audio_size(root, day, audio):
    f = audio_sizes_file(root, day)
    sizes = json.loads(f.read_text()) if f.exists() else {}
    sizes[audio.name] = audio.stat().st_size
    f.write_text(json.dumps(sizes, indent=1, sort_keys=True))


def size_de(n):
    """1234 -> '1 KB', 16100000 -> '16,1 MB' (decimal units, German comma)."""
    if n < 1_000_000:
        return f"{max(1, round(n / 1000))} KB"
    return f"{n / 1_000_000:.1f} MB".replace(".", ",")


def seconds(r):
    return max(0.0, (dt.datetime.fromisoformat(r["bis"]) - dt.datetime.fromisoformat(r["t"])).total_seconds())


def storage(rows, sizes, piece_seconds):
    """' · Text 45 KB · Audio 16,1 MB' for a group of sentences; the audio part only when its pieces are known.
    A five-minute piece can reach into the next lesson, so each piece's bytes are shared out by the spoken
    seconds of its sentences in this group (piece_seconds: piece -> spoken seconds over the whole day)."""
    text = " ".join(r["text"] for r in rows)
    out = f" · Text {size_de(len(text.encode('utf-8')))}"
    pieces = {r["quelle"] for r in rows}
    if pieces and all(p in sizes for p in pieces):
        audio = 0.0
        for p in pieces:
            mine = sum(seconds(r) for r in rows if r["quelle"] == p)
            audio += sizes[p] * (mine / piece_seconds[p] if piece_seconds.get(p) else 1.0)
        out += f" · Audio {size_de(audio)}"
    return out


def by_talk(rows):
    """Sentences recorded by hand, one talk per recording: its pieces follow each other every five minutes."""
    talks, last = [], None
    for r in rows:
        m = NAME.match(r["quelle"])
        begin = dt.datetime.strptime(m.group(1) + m.group(2), "%Y%m%d%H%M%S")
        if talks and begin - last <= TALK_GAP:
            talks[-1].append(r)
        else:
            talks.append([r])
        last = begin
    return talks


def build_day(root, day, cache, with_summary):
    store = root / "daten" / f"{day}.jsonl"
    rows = [json.loads(l) for l in store.read_text().splitlines()] if store.exists() else []
    sizes_f = audio_sizes_file(root, day)
    sizes = json.loads(sizes_f.read_text()) if sizes_f.exists() else {}
    piece_seconds = {}
    for r in rows:
        piece_seconds[r["quelle"]] = piece_seconds.get(r["quelle"], 0.0) + seconds(r)
    calls = solita_calls(day)
    heard = len(rows)
    rows = [r for r in rows if not is_solita(r, calls)]
    # recorded by hand ("Gespräch", Doc 07.11.2026: a talk on Monday at ten, while the timetable says
    # Inf) - never part of a lesson, its summary or a class page, but a section of its own on the day
    kept = len(rows)
    talks = [r for r in rows if NAME.match(r["quelle"]) and NAME.match(r["quelle"]).group(3)]
    rows = [r for r in rows if r not in talks]
    blocks = lessons(day)
    groups = {id(b): [] for b in blocks}
    outside = []
    for r in rows:
        b = lesson_of(dt.datetime.fromisoformat(r["t"]), blocks)
        (groups[id(b)] if b else outside).append(r)

    md = [f"# Mitschrift · {german(day)}", ""]
    if heard > kept:
        n = heard - kept
        md += [f"_Solitas Rufe ausgeblendet: {n} {'Satz' if n == 1 else 'Sätze'}._", ""]
    if not blocks:      # a note on the whole day, under its title - not at the end of its last section
        md += ["_Für diesen Tag steht nichts im Stundenplan (plandaten fehlt oder schulfrei)._", ""]
    done = []
    for b in blocks:
        g = groups[id(b)]
        if not g:
            continue
        text = " ".join(r["text"] for r in g)
        summary = summarize(text, cache) if with_summary else None
        if summary and "fehler" not in summary:
            summary = homework_and_dates(summary, tokens(text))
        words = len(text.split())
        head = f"{b['start']:%H:%M}–{b['end']:%H:%M} · {b['subject']} · {', '.join(b['classes'])}"
        if b["rooms"]:
            head += f" · {', '.join(b['rooms'])}"
        md += [f"## {head}", ""] + summary_md(summary) + [""]
        md += [f"<details><summary>Wortlaut · {spoken(g)} gesprochen · {words:,} Wörter".replace(",", ".")
               + f"{storage(g, sizes, piece_seconds)}</summary>", ""]
        md += [p + "\n" for p in wording(g)] + ["</details>", ""]
        done.append({"start": b["start"].isoformat(timespec="minutes"), "end": b["end"].isoformat(timespec="minutes"),
                     "subject": b["subject"], "classes": b["classes"], "summary": summary, "words": words})
    for g in by_talk(talks):
        text = " ".join(r["text"] for r in g)
        summary = summarize(text, cache) if with_summary else None
        start, end = dt.datetime.fromisoformat(g[0]["t"]), dt.datetime.fromisoformat(g[-1]["bis"])
        md += [f"## {start:%H:%M}–{end:%H:%M} · Gespräch", ""] + summary_md(summary) + [""]
        md += [f"<details><summary>Wortlaut · {spoken(g)} gesprochen · {len(text.split()):,} Wörter".replace(",", ".")
               + f"{storage(g, sizes, piece_seconds)}</summary>", ""]
        md += [p + "\n" for p in wording(g)] + ["</details>", ""]
    if outside:
        md += ["## Außerhalb der Stunden", "",
               f"<details><summary>Wortlaut · {spoken(outside)} gesprochen{storage(outside, sizes, piece_seconds)}</summary>", ""]
        md += [p + "\n" for p in wording(outside)] + ["</details>", ""]

    (root / "tage" / f"{day}.md").write_text("\n".join(md))
    (root / "daten" / f"{day}.stunden.json").write_text(json.dumps(done, ensure_ascii=False, indent=1))
    return len(done)


def build_classes(root):
    """One page per class from all days, newest first - without the lessons Doc put into the trash on the
    reading page (daten/<tag>.papierkorb.jsonl; the day page keeps them, the reading page hides them)."""
    per_class = {}
    for f in sorted((root / "daten").glob("*.stunden.json"), reverse=True):
        day = dt.date.fromisoformat(f.name.split(".")[0])
        gone = in_trash(root, day)
        for l in json.loads(f.read_text()):
            if lesson_id(l["start"]) in gone:
                continue
            for c in l["classes"]:
                per_class.setdefault(c, []).append((day, l))
    for c, items in per_class.items():
        md = [f"# {c} · Was ich dort erzählt habe", ""]
        for day, l in items:
            start, end = l["start"][11:16], l["end"][11:16]
            md += [f"## {german(day)} · {start}–{end} · {l['subject']}", ""] + summary_md(l["summary"])
            md += ["", f"[Wortlaut](../tage/{day}.md)", ""]
        name = re.sub(r"[^a-z0-9-]+", "-", c.lower()).strip("-")
        (root / "klassen" / f"{name}.md").write_text("\n".join(md))
    return len(per_class)


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description="DocMitschrift: holen, mitschreiben, nach Stundenplan sortieren")
    ap.add_argument("--root", default=str(Path.home() / "Documents" / "mitschrift"), help="Datenordner (nicht im Repo)")
    ap.add_argument("--behalten", action="store_true", help="Audio nach dem Mitschreiben nicht in den Papierkorb legen")
    ap.add_argument("--ohne-zusammenfassung", action="store_true", help="nur Wortlaut, keine Zusammenfassungen")
    ap.add_argument("--nicht-holen", action="store_true", help="nicht beim Pixel nachsehen")
    ap.add_argument("--tag", action="append", default=[], help="diesen Tag (JJJJ-MM-TT) neu aufbauen")
    ap.add_argument("--nur-seiten", action="store_true", help="nichts holen, nichts mitschreiben, nur die Seiten der --tag-Tage neu bauen")
    ap.add_argument("--sprecher", action="store_true",
                    help="für die --tag-Tage nachträglich erkennen, wer spricht (Audio aus eingang/ oder dem Papierkorb), "
                         "dann ihre Seiten neu bauen; holt nichts und schreibt nichts neu mit")
    a = ap.parse_args()
    if a.sprecher and not a.tag:
        sys.exit("--sprecher braucht --tag JJJJ-MM-TT")

    if not SWIFT.exists():
        sys.exit(f"{SWIFT} fehlt – erst docmitschrift-app/build.sh mac laufen lassen.")
    root = Path(a.root).expanduser()
    for sub in ("eingang", "daten", "tage", "klassen"):
        (root / sub).mkdir(parents=True, exist_ok=True)

    only_pages = a.nur_seiten or a.sprecher
    if not a.nicht_holen and not only_pages:
        fetch(root / "eingang")
    days = set() if only_pages else write_down(root, a.behalten)
    days |= {dt.date.fromisoformat(t) for t in a.tag}
    if a.sprecher:
        for day in sorted(days):
            relabel(root, day)

    cache_file = root / "daten" / "zusammenfassungen.json"
    cache = json.loads(cache_file.read_text()) if cache_file.exists() else {}
    for day in sorted(days):
        n = build_day(root, day, cache, not a.ohne_zusammenfassung)
        say(f"{german(day)}: {n} Stunde(n) → {root / 'tage' / f'{day}.md'}")
        say(f"  lesen: http://localhost:8765/__mitschrift/tag?d={day}")
    cache_file.write_text(json.dumps(cache, ensure_ascii=False))
    if days:
        say(f"Klassenseiten: {build_classes(root)} → {root / 'klassen'}")
    else:
        say("Nichts Neues.")


if __name__ == "__main__":
    main()
