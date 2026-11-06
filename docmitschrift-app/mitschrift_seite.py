"""DocMitschrift for the plans: the "Notizen" button of a week opens what Doc said in its lessons.

Doc, 06.11.2026: "Wir machen das Notizen als Button. Und wenn man Notizen klickt für die jeweilige
Unterrichtsstunde, öffnet sich in einem neuen Tab die Mitschriftenseite." The text is school data and
stays on this Mac: it is read from ~/Documents/mitschrift (written by mitschrift.py) and the page is
built per call. Nothing is stored and nothing goes into the repo. serve.py hands the requests over,
only to its own pages (local_caller), and reloads this file on every call.

    GET /__mitschrift/stunden.json                    every written-down lesson: date, start, end, classes
    GET /__mitschrift/woche?s=20261106-0950-9a,...    those lessons on one page (summary + wording)

The button (HTML/svp/svp-plan-mitschrift.js) knows a week's lessons from WebUntis (date, start, class);
a lesson belongs to a written-down block when the date and a class match and its start lies inside the
block (mitschrift.py joins a double lesson into one block).
"""
import datetime as dt
import html
import json
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path.home() / "Documents" / "mitschrift"
CSS = Path(__file__).with_name("lesen.css")
FONT = "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap"
# serve.py runs under launchd with a short PATH, so pandoc is also looked for where Homebrew puts it
PANDOC = shutil.which("pandoc") or next((p for p in ("/opt/homebrew/bin/pandoc", "/usr/local/bin/pandoc")
                                         if Path(p).exists()), "pandoc")
KEY = re.compile(r"^(\d{8})-(\d{2})(\d{2})-([A-Za-z0-9.+_-]{1,40})$")   # date-HHMM-class, coupled classes joined by +


def blocks():
    """The written-down lessons of every day, as mitschrift.py saved them in daten/<tag>.stunden.json."""
    out = []
    for f in sorted((ROOT / "daten").glob("*.stunden.json")):
        try:
            rows = json.loads(f.read_text())
        except (OSError, ValueError):
            continue
        for b in rows:
            if not b.get("classes"):            # a slot without a class (break duty) is no lesson
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


def section(day_md, start):
    """The '## HH:MM–...' part of a day page whose lesson begins at `start`."""
    for part in re.split(r"(?m)^(?=## )", day_md)[1:]:
        if part.startswith(f"## {start}–"):
            return part
    return None


def pandoc(md):
    r = subprocess.run([PANDOC, "-f", "markdown", "-t", "html"], input=md, text=True,
                       capture_output=True, timeout=30)
    if r.returncode:
        raise RuntimeError(r.stderr.strip() or "pandoc failed")
    return r.stdout


def week_page(query):
    found = []
    all_blocks = blocks()
    for date, start, classes in wanted(query):
        for b in all_blocks:
            if b["date"] == date and set(classes) & set(b["classes"]) and b["start"] <= start < b["end"]:
                if b not in found:
                    found.append(b)
    found.sort(key=lambda b: (b["date"], b["start"]))
    names = sorted({c for b in found for c in b["classes"]}) or sorted({c for _, _, cs in wanted(query) for c in cs})
    title = "Mitschrift" + (" · " + ", ".join(names) if names else "")

    parts = []
    for b in found:
        day = dt.datetime.strptime(b["date"], "%Y%m%d").date()
        page = ROOT / "tage" / f"{day}.md"
        if not page.exists():
            continue
        text = page.read_text()
        sec = section(text, b["start"])
        if not sec:
            continue
        first = text.splitlines()[0] if text else ""
        label = first.split("·", 1)[1].strip() if "·" in first else f"{day:%d.%m.%Y}"
        parts.append(sec.replace("## ", f"## {label} · ", 1))
    body = pandoc("\n\n".join(parts)) if parts else \
        '<p class="leer">Für diese Woche gibt es noch keine Mitschrift.</p>'

    css = CSS.read_text() if CSS.exists() else ""
    page = ("<!doctype html>\n<html lang=\"de\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
            f"<title>{html.escape(title)}</title>\n"
            "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n"
            "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n"
            f"<link rel=\"stylesheet\" href=\"{FONT}\">\n<style>\n{css}</style>\n</head>\n<body>\n"
            f"<h1>{html.escape(title)}</h1>\n{body}\n</body>\n</html>\n")
    return page.encode("utf-8")


def handle(path):
    """(status, content type, body) for a GET under /__mitschrift/."""
    url = urlsplit(path)
    if url.path == "/__mitschrift/stunden.json":
        return 200, "application/json; charset=utf-8", json.dumps(blocks(), ensure_ascii=False).encode("utf-8")
    if url.path == "/__mitschrift/woche":
        return 200, "text/html; charset=utf-8", week_page(url.query)
    return 404, "text/plain; charset=utf-8", b"not found"
