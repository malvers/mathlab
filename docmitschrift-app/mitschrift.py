#!/usr/bin/env python3
"""DocMitschrift on the Mac: fetch the day's recordings from the Pixel, write them down, sort them by
Doc's timetable and keep one page per day and one per class.

    python3 docmitschrift-app/mitschrift.py            fetch (if the Pixel hangs on USB), transcribe, sort
    python3 docmitschrift-app/mitschrift.py --behalten  same, but the audio stays in eingang/ (for tests)

Everything stays on this Mac, outside the repo (pupils' lessons are school data):

    ~/Documents/mitschrift/eingang/              pieces from the phone, waiting to be written down
    ~/Documents/mitschrift/daten/<tag>.jsonl     every recognised sentence with its clock time
    ~/Documents/mitschrift/daten/<tag>.stunden.json   the lessons of the day with their summaries
    ~/Documents/mitschrift/tage/<tag>.md         the day: per lesson the summary and the full wording
    ~/Documents/mitschrift/klassen/<klasse>.md   per class: what was said there, newest first

A written-down piece goes to the Trash on the Mac and is deleted on the phone; only the text stays.
Speech recognition and summaries run on this Mac (Apple SpeechAnalyzer and Apple Intelligence).
"""

import argparse
import datetime as dt
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

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
        day = begin.date()
        store = root / "daten" / f"{day}.jsonl"
        rows = [json.loads(l) for l in store.read_text().splitlines()] if store.exists() else []
        rows = [r for r in rows if r["quelle"] != audio.name]          # written down again: replace
        for s in sentences:
            rows.append({
                "t": (begin + dt.timedelta(seconds=s["start"])).isoformat(timespec="seconds"),
                "bis": (begin + dt.timedelta(seconds=s["end"])).isoformat(timespec="seconds"),
                "text": s["text"],
                "quelle": audio.name,
            })
        rows.sort(key=lambda r: r["t"])
        store.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows))
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


# ---------------------------------------------------------------- summaries

def summarize(text, cache):
    key = hashlib.sha1(text.encode()).hexdigest()
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
            out += [f"**{title}**", ""] + [f"- {p}" for p in s[key]] + [""]
    return out[:-1] if out else ["_Nichts Greifbares._"]


# ---------------------------------------------------------------- pages

def german(day):
    return f"{WEEKDAYS[day.weekday()]}, {day:%d.%m.%Y}"


def wording(rows):
    """The full text, one paragraph per recognised stretch (about a minute each) with its clock time."""
    return [f"**{dt.datetime.fromisoformat(r['t']):%H:%M}** {r['text']}" for r in rows]


def spoken(rows):
    s = sum((dt.datetime.fromisoformat(r["bis"]) - dt.datetime.fromisoformat(r["t"])).total_seconds() for r in rows)
    return f"{round(s / 60)} min" if s >= 60 else f"{round(s)} s"


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
    # recorded by hand ("Gespräch", Doc 07.11.2026: a talk on Monday at ten, while the timetable says
    # Inf) - never part of a lesson, its summary or a class page, but a section of its own on the day
    talks = [r for r in rows if NAME.match(r["quelle"]) and NAME.match(r["quelle"]).group(3)]
    rows = [r for r in rows if r not in talks]
    blocks = lessons(day)
    groups = {id(b): [] for b in blocks}
    outside = []
    for r in rows:
        b = lesson_of(dt.datetime.fromisoformat(r["t"]), blocks)
        (groups[id(b)] if b else outside).append(r)

    md = [f"# Mitschrift · {german(day)}", ""]
    done = []
    for b in blocks:
        g = groups[id(b)]
        if not g:
            continue
        text = " ".join(r["text"] for r in g)
        summary = summarize(text, cache) if with_summary else None
        words = len(text.split())
        head = f"{b['start']:%H:%M}–{b['end']:%H:%M} · {b['subject']} · {', '.join(b['classes'])}"
        if b["rooms"]:
            head += f" · {', '.join(b['rooms'])}"
        md += [f"## {head}", ""] + summary_md(summary) + [""]
        md += [f"<details><summary>Wortlaut · {spoken(g)} gesprochen · {words:,} Wörter</summary>".replace(",", "."), ""]
        md += [p + "\n" for p in wording(g)] + ["</details>", ""]
        done.append({"start": b["start"].isoformat(timespec="minutes"), "end": b["end"].isoformat(timespec="minutes"),
                     "subject": b["subject"], "classes": b["classes"], "summary": summary, "words": words})
    for g in by_talk(talks):
        text = " ".join(r["text"] for r in g)
        summary = summarize(text, cache) if with_summary else None
        start, end = dt.datetime.fromisoformat(g[0]["t"]), dt.datetime.fromisoformat(g[-1]["bis"])
        md += [f"## {start:%H:%M}–{end:%H:%M} · Gespräch", ""] + summary_md(summary) + [""]
        md += [f"<details><summary>Wortlaut · {spoken(g)} gesprochen · {len(text.split()):,} Wörter</summary>".replace(",", "."), ""]
        md += [p + "\n" for p in wording(g)] + ["</details>", ""]
    if outside:
        md += ["## Außerhalb der Stunden", "",
               f"<details><summary>Wortlaut · {spoken(outside)} gesprochen</summary>", ""]
        md += [p + "\n" for p in wording(outside)] + ["</details>", ""]
    if not blocks:
        md += ["_Für diesen Tag steht nichts im Stundenplan (plandaten fehlt oder schulfrei)._", ""]

    (root / "tage" / f"{day}.md").write_text("\n".join(md))
    (root / "daten" / f"{day}.stunden.json").write_text(json.dumps(done, ensure_ascii=False, indent=1))
    return len(done)


def build_classes(root):
    """One page per class from all days, newest first."""
    per_class = {}
    for f in sorted((root / "daten").glob("*.stunden.json"), reverse=True):
        day = dt.date.fromisoformat(f.name.split(".")[0])
        for l in json.loads(f.read_text()):
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
    a = ap.parse_args()

    if not SWIFT.exists():
        sys.exit(f"{SWIFT} fehlt – erst docmitschrift-app/build.sh mac laufen lassen.")
    root = Path(a.root).expanduser()
    for sub in ("eingang", "daten", "tage", "klassen"):
        (root / sub).mkdir(parents=True, exist_ok=True)

    if not a.nicht_holen:
        fetch(root / "eingang")
    days = write_down(root, a.behalten) | {dt.date.fromisoformat(t) for t in a.tag}

    cache_file = root / "daten" / "zusammenfassungen.json"
    cache = json.loads(cache_file.read_text()) if cache_file.exists() else {}
    for day in sorted(days):
        n = build_day(root, day, cache, not a.ohne_zusammenfassung)
        say(f"{german(day)}: {n} Stunde(n) → {root / 'tage' / f'{day}.md'}")
    cache_file.write_text(json.dumps(cache, ensure_ascii=False))
    if days:
        say(f"Klassenseiten: {build_classes(root)} → {root / 'klassen'}")
    else:
        say("Nichts Neues.")


if __name__ == "__main__":
    main()
