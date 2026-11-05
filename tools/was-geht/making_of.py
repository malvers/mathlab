#!/usr/bin/env python3
"""Build HTML/drehbuch/was-geht-making-of.html from the Claude Code transcript.

Doc wants the whole genesis of the talk "Was geht?!" to be transparent: every
message between Doc, Alan (this agent), Albert (the peer agent) and Solita's
loudspeaker calls, in order, with the time. Tool calls are not shown, only
counted per step, so the page stays readable.

Usage:
    python3 tools/was-geht/making_of.py [transcript.jsonl ...]

Without arguments it reads the transcript of the session that started the
talk planning on 27.10.2026. Run it again after every round; it rewrites the
page from scratch.
"""
import html
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'HTML' / 'drehbuch' / 'was-geht-making-of.html'
HEAD_FROM = ROOT / 'HTML' / 'drehbuch' / 'was-geht.html'
DEFAULT = [Path.home() / '.claude/projects/-Users-malvers-IdeaProjects-forloop'
           / 'ab565913-5f1e-47fb-9d5d-2c2dbd9c9b67.jsonl']
BERLIN = ZoneInfo('Europe/Berlin')

# Lines that must never go online. A whole line that matches is replaced.
REDACT = [
    re.compile(r'§\s*11'),            # Doc's employment contract
    re.compile(r'fixkosten', re.I),   # path of Doc's private finance book
]
REDACTED = '[privat – für die Veröffentlichung entfernt]'

KNOWN = {'Doc', 'Alan', 'Albert', 'Solita'}
SOLITA_CALL = re.compile(r'solita-ruf\.mjs\s+"([^"]+)"')


def when(ts):
    t = datetime.fromisoformat(ts.replace('Z', '+00:00')).astimezone(BERLIN)
    return t


def text_of(content):
    if isinstance(content, str):
        return content
    return '\n'.join(b.get('text', '') for b in content
                     if isinstance(b, dict) and b.get('type') == 'text')


def peer(name):
    """Short first name of a peer agent, e.g. 'Albert Einstein (Erste Geige) [409a6c]' -> 'Albert'."""
    return (name or 'Kollegin').split()[0]


def collect(paths):
    """Return the visible conversation as a list of dicts in time order."""
    items, seen, steps = [], set(), 0

    def add(ts, who, txt, to=None):
        nonlocal steps
        txt = (txt or '').strip()
        key = (who, txt)
        if not txt or key in seen:
            return
        seen.add(key)
        items.append({'t': when(ts), 'who': who, 'to': to, 'txt': txt,
                      'steps': steps if who == 'Alan' else 0})
        if who == 'Alan':
            steps = 0

    for path in paths:
        for line in open(path, encoding='utf-8'):
            try:
                d = json.loads(line)
            except ValueError:
                continue
            kind, ts = d.get('type'), d.get('timestamp')
            if not ts:
                continue
            if kind == 'user':
                o = d.get('origin') or {}
                if o.get('kind') == 'human':
                    add(ts, 'Doc', text_of(d['message'].get('content')))
                elif o.get('kind') == 'peer':
                    add(ts, peer(o.get('name')), o.get('body'), to='Alan')
            elif kind == 'attachment' and d['attachment'].get('type') == 'queued_command':
                a = d['attachment']
                o = a.get('origin') or {}
                if o.get('kind') == 'human':
                    add(ts, 'Doc', text_of(a.get('prompt') or []))
                elif o.get('kind') == 'peer':
                    add(ts, peer(o.get('name')), o.get('body'), to='Alan')
            elif kind == 'assistant':
                for b in d['message'].get('content') or []:
                    if not isinstance(b, dict):
                        continue
                    if b.get('type') == 'text':
                        add(ts, 'Alan', b.get('text'))
                    elif b.get('type') == 'tool_use':
                        inp = b.get('input') or {}
                        if b.get('name') == 'SendMessage':
                            add(ts, 'Alan', inp.get('message'), to=peer(inp.get('to')))
                        elif b.get('name') == 'Bash' and 'solita-ruf.mjs' in inp.get('command', ''):
                            m = SOLITA_CALL.search(inp['command'])
                            if m:
                                add(ts, 'Solita', m.group(1))
                        else:
                            steps += 1
    items.sort(key=lambda x: x['t'])
    return items


def redact(txt):
    return '\n'.join(REDACTED if any(r.search(l) for r in REDACT) else l
                     for l in txt.split('\n'))


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'(?<!href=")(https?://[^\s<)]+)', r'<a href="\1">\1</a>', s)
    return s


def markdown(txt):
    """Tiny Markdown subset: paragraphs, bullet and numbered lists, bold, code, links."""
    out, para, lst = [], [], None

    def flush():
        nonlocal para, lst
        if para:
            out.append('<p>' + '<br>'.join(inline(l) for l in para) + '</p>')
            para = []
        if lst:
            tag, rows = lst
            out.append(f'<{tag}>' + ''.join(f'<li>{inline(r)}</li>' for r in rows) + f'</{tag}>')
            lst = None

    for raw in txt.split('\n'):
        l = raw.rstrip()
        bullet = re.match(r'^\s*[-*]\s+(.*)', l)
        number = re.match(r'^\s*\d+\.\s+(.*)', l)
        if not l.strip():
            flush()
        elif bullet or number:
            tag = 'ul' if bullet else 'ol'
            if para:
                flush()
            if lst and lst[0] != tag:
                flush()
            lst = lst or (tag, [])
            lst[1].append((bullet or number).group(1))
        else:
            if lst:
                flush()
            para.append(re.sub(r'^#+\s*', '', l))
    flush()
    return '\n'.join(out)


def page(items):
    head = HEAD_FROM.read_text(encoding='utf-8')
    head = head[:head.index('</head>')]
    head = re.sub(r'<title>.*?</title>', '<title>Was geht?! Making-of</title>', head, count=1)
    style = '''<style>
/* conversation log: time | speaker | message */
.log { display: grid; gap: 0.9rem; margin-top: 1.6rem; }
.msg {
    display: grid;
    grid-template-columns: 4.2rem minmax(0, 1fr);
    gap: 0 1.1rem;
    padding: 1rem 1.2rem 1.1rem;
    background: var(--surface);
    border: 1px solid var(--line-soft);
    border-left: 2px solid var(--who);
    border-radius: 2px;
}
.msg .tm { font-family: 'Orbitron', sans-serif; font-size: 0.8rem; color: var(--ink-faint);
           font-variant-numeric: tabular-nums; padding-top: 0.2rem; }
.msg .who { font-family: 'Orbitron', sans-serif; font-size: 0.78rem; font-weight: 700;
            letter-spacing: 0.12em; text-transform: uppercase; color: var(--who); }
.msg .who small { font-weight: 400; color: var(--ink-faint); letter-spacing: 0.06em; }
.msg .tx { min-width: 0; overflow-wrap: anywhere; }
.msg .tx p, .msg .tx ul, .msg .tx ol { margin: 0.45rem 0 0; max-width: 74ch; }
.msg .tx ul, .msg .tx ol { padding-left: 1.2rem; }
.msg .tx a { color: var(--cyan); }
.msg .steps { margin-top: 0.5rem; font-size: 0.85rem; color: var(--ink-faint); }
.msg.doc    { --who: var(--lambda); }
.msg.alan   { --who: var(--cyan); }
.msg.albert { --who: var(--phi); }
.msg.solita { --who: var(--violet); }
.msg.peer   { --who: var(--ink-dim); }
@media (max-width: 560px) { .msg { grid-template-columns: 1fr; } .msg .tm { padding: 0 0 0.3rem; } }
</style>
'''
    labels = {'Doc': 'Doc', 'Alan': 'Alan · KI', 'Albert': 'Albert · KI', 'Solita': 'Solita · Lautsprecher'}
    for x in items:
        labels.setdefault(x['who'], x['who'] + ' · KI')
    rows = []
    for x in items:
        to = f' <small>→ {x["to"]}</small>' if x['to'] else ''
        steps = (f'<div class="steps">davor {x["steps"]} Arbeitsschritte '
                 f'(Dateien lesen, zählen, bauen, prüfen)</div>') if x['steps'] else ''
        rows.append(
            f'<article class="msg {x["who"].lower() if x["who"] in KNOWN else "peer"}">'
            f'<div class="tm">{x["t"]:%H:%M}</div>'
            f'<div class="tx"><div class="who">{labels[x["who"]]}{to}</div>'
            f'{steps}{markdown(redact(x["txt"]))}</div></article>')
    first, last = items[0]['t'], items[-1]['t']
    count = {k: sum(1 for x in items if x['who'] == k) for k in labels}
    body = f'''</head>
<body>
<div class="wrap">
<header>
    <p class="eyebrow">Doc Alvers Mathe-Labor · Vortrag „Was geht?!“</p>
    <h1>Wie dieser Vortrag entstand</h1>
    <p class="lede">Das vollständige Gespräch, aus dem der Vortrag „Was geht?!“ entstanden ist. Doc beauftragt
        zwei KI-Agentinnen wie seine besten Mitarbeiter mit dem, was er gerne hätte – Alan mit der Dramaturgie,
        Albert mit den Zahlen. Alles Weitere entsteht in gemeinsamer Kollaboration. Docs Sätze stehen so da, wie
        die Spracherkennung sie aufgeschrieben hat – die Tippfehler sind von ihm.</p>
    <p class="status">Stand {last:%d.%m.%Y, %H:%M} Uhr · Sammelphase: alles bleibt drin, ausgedünnt wird am Ende</p>
    <dl class="meta">
        <div><dt>Zeitraum</dt><dd>{first:%d.%m.%Y} · {first:%H:%M}–{last:%H:%M}</dd></div>
        <div><dt>Doc</dt><dd>{count["Doc"]} Nachrichten</dd></div>
        <div><dt>Alan</dt><dd>{count["Alan"]} Nachrichten</dd></div>
        <div><dt>Albert</dt><dd>{count["Albert"]} Nachrichten</dd></div>
        <div><dt>Solita</dt><dd>{count["Solita"]} Rufe</dd></div>
    </dl>
</header>
<section>
    <div class="head"><span class="n">↗</span><h2>Ergebnis</h2></div>
    <div class="prose"><p><a href="was-geht.html">Das Drehbuch „Was geht?!“</a> ·
        <a href="was-geht-firmenrechnung.html">Alberts Firmen-Rechnung mit allen Quellen</a></p>
        <p>Nicht abgebildet sind die einzelnen Werkzeug-Aufrufe der Agentinnen (Dateien lesen, zählen, Seiten bauen,
        prüfen). Sie sind nur gezählt. Eine Zeile mit privaten Vertragsdaten ist entfernt.</p></div>
</section>
<section>
    <div class="head"><span class="n">↓</span><h2>Das Gespräch</h2></div>
    <div class="log">
{chr(10).join(rows)}
    </div>
</section>
<footer><p class="eyebrow sig">Doc Alvers Mathe-Labor</p></footer>
</div>
</body>
</html>
'''
    return head + style + body


def main():
    paths = [Path(p) for p in sys.argv[1:]] or DEFAULT
    items = collect(paths)
    OUT.write_text(page(items), encoding='utf-8')
    print(f'{OUT.relative_to(ROOT)}: {len(items)} entries')


if __name__ == '__main__':
    main()
