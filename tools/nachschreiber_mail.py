"""Mail drafts to the pupils who missed a test (Mission Control, svp/leistungstest.html, Doc 05.11.2026).

serve.py routes /__mail/ here and reloads this module per call, so a change needs no server restart.
Only Doc's Mac serves this route (docalvers.de has none), only for our own pages (serve.py checks Origin
and Host) and only with the header X-Mission-Control: 1.

The addresses never come from the browser. They are the pupils' school mails out of the class's Teams
team, kept on this Mac in klassenlisten/mail-<GRUPPE>.csv (gitignored, written by
tools/teams_mails_export.ps1, same columns as the coaching list: "Name";"E-Mail";"Rolle"). The browser
sends name + code, this module finds the address itself - by the full name, else by first name + initial
of the last name when that fits exactly one pupil. Only @ibb-schulen.de addresses count.

It NEVER sends. "oeffnen" opens one visible Outlook draft per pupil; Doc reads and presses Send.
Nothing is logged: no names, no addresses, no texts.

  POST /__mail/nachschreiber  {"aktion": "pruefen", "gruppe": "BGY25",
                               "kinder": [{"code": "Y6D6", "name": "Vorname Nachname"}, ...]}
      -> {"ok": true, "liste": "mail-BGY25.csv" | null,
          "kinder": [{"code": "Y6D6", "adresse": "...@ibb-schulen.de" | null,
                      "grund": "" | "keine Liste" | "nicht in der Liste" | "mehrdeutig"}]}
  POST /__mail/nachschreiber  {"aktion": "oeffnen", "gruppe": "BGY25", "betreff": "...",
                               "kinder": [{"code": ..., "name": ..., "text": "..."}]}
      -> {"ok": true, "geoeffnet": n, "kinder": [{"code": ..., "ok": true | false, "grund": ...}]}
  POST /__mail/nachschreiber  {"aktion": "bcc", "gruppe": "BGY25", "betreff": "...", "text": "...",
                               "kinder": [{"code": ..., "name": ...}]}
      -> ONE draft for the whole group, every found address in BCC (Doc, 06.11.2026)
      -> {"ok": true, "geoeffnet": 1, "bcc": n, "kinder": [{"code": ..., "ok": true | false, "grund": ...}]}
"""
import csv
import html
import io
import json
import os
import re
import subprocess
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
LISTS = os.path.normpath(os.path.join(HERE, '..', 'klassenlisten'))
DOMAIN = '@ibb-schulen.de'
MAX_KIDS = 40
MAX_TEXT = 4000

APPLESCRIPT = '''
on run argv
	set toAddr to item 1 of argv
	set subj to item 2 of argv
	set body to item 3 of argv
	tell application "Microsoft Outlook"
		activate
		set m to make new outgoing message with properties {subject:subj, content:body}
		make new to recipient at m with properties {email address:{address:toAddr}}
		open m
	end tell
	return "ok"
end run
'''


# one draft for a whole group, every pupil in BCC (Doc, 06.11.2026: "mit einer E-Mail ... im BCC");
# argv: subject, body, then the addresses
APPLESCRIPT_BCC = '''
on run argv
	set subj to item 1 of argv
	set body to item 2 of argv
	tell application "Microsoft Outlook"
		activate
		set m to make new outgoing message with properties {subject:subj, content:body}
		repeat with i from 3 to count of argv
			make new bcc recipient at m with properties {email address:{address:(item i of argv)}}
		end repeat
		open m
	end tell
	return "ok"
end run
'''


def _norm(s):
    """lower case, no brackets ("(BGY25)" in a Teams name), single spaces; umlauts kept"""
    s = unicodedata.normalize('NFC', str(s or ''))
    s = re.sub(r'\([^)]*\)', ' ', s)
    return re.sub(r'\s+', ' ', s).strip().casefold()


def _full(name):
    """'Nachname, Vorname' -> 'vorname nachname'"""
    n = _norm(name)
    if ',' in n:
        last, _, first = n.partition(',')
        n = (first.strip() + ' ' + last.strip()).strip()
    return n


def _short(name):
    """first given name + initial of the last name - the key Mission Control matches WebUntis by"""
    parts = _full(name).replace('.', ' ').split()
    return parts[0] + ' ' + parts[-1][0] if len(parts) > 1 else ''


def _book(gruppe):
    path = os.path.join(LISTS, 'mail-%s.csv' % gruppe)
    try:
        with open(path, encoding='utf-8-sig') as f:
            text = f.read()
    except OSError:
        return None, []
    rows = []
    for r in csv.reader(io.StringIO(text), delimiter=';'):
        if len(r) < 2 or r[0].strip().lower() == 'name':
            continue
        mail = r[1].strip().lower()
        role = (r[2].strip().lower() if len(r) > 2 else 'member')
        if role in ('owner', 'besitzer') or not mail.endswith(DOMAIN) or not re.fullmatch(r'[a-z0-9._%+-]+@[a-z0-9.-]+', mail):
            continue
        rows.append((_full(r[0]), _short(r[0]), mail))
    return os.path.basename(path), rows


def _find(rows, name):
    full, short = _full(name), _short(name)
    hit = {m for f, _, m in rows if f and f == full}
    if not hit and short:
        hit = {m for _, s, m in rows if s and s == short}
    if len(hit) == 1:
        return hit.pop(), ''
    return None, 'mehrdeutig' if hit else 'nicht in der Liste'


def _kids(req, need_text):
    kids = req.get('kinder')
    if not isinstance(kids, list) or not 0 < len(kids) <= MAX_KIDS:
        return None
    out = []
    for k in kids:
        if not isinstance(k, dict):
            return None
        code, name = k.get('code'), k.get('name')
        if not isinstance(code, str) or not re.fullmatch(r'[A-Z0-9]{4}', code):
            return None
        if not isinstance(name, str) or not 0 < len(name) <= 80:
            return None
        text = k.get('text')
        if need_text and (not isinstance(text, str) or not 0 < len(text) <= MAX_TEXT):
            return None
        out.append({'code': code, 'name': name, 'text': text})
    return out


def _html(text):
    """plain text from the page -> the HTML Outlook wants; **...** is bold (the re-sit date, Doc
    06.11.2026: "das Freitag, 13.11. fett"). Lines as Outlook writes them itself - one <div> each, an
    empty <div><br></div> between paragraphs and none after the last: a <p> brings its own margin, which
    put an extra empty line between "Viele Grüße" and the signature (Doc: "noch eine Zeile raus")."""
    paras = [p for p in re.split(r'\n\s*\n', text.strip()) if p.strip()]
    def para(p):
        s = html.escape(p.strip()).replace('\n', '<br>')
        return '<div>' + re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s) + '</div>'
    return '<div><br></div>'.join(para(p) for p in paras)


def _outlook(addr, subject, body):
    try:
        subprocess.run(['open', '-a', 'Microsoft Outlook'], capture_output=True, timeout=20)
        r = subprocess.run(['osascript', '-e', APPLESCRIPT, addr, subject, body],
                           capture_output=True, text=True, timeout=60)
        return r.returncode == 0 and 'ok' in r.stdout
    except (OSError, subprocess.SubprocessError):
        return False


def _outlook_bcc(addrs, subject, body):
    try:
        subprocess.run(['open', '-a', 'Microsoft Outlook'], capture_output=True, timeout=20)
        r = subprocess.run(['osascript', '-e', APPLESCRIPT_BCC, subject, body] + list(addrs),
                           capture_output=True, text=True, timeout=60)
        return r.returncode == 0 and 'ok' in r.stdout
    except (OSError, subprocess.SubprocessError):
        return False


def handle(command, path, headers, data):
    if command != 'POST' or path.split('?', 1)[0].rstrip('/') != '/__mail/nachschreiber':
        return 405, {'ok': False, 'error': 'POST /__mail/nachschreiber'}
    if headers.get('X-Mission-Control') != '1':
        return 403, {'ok': False, 'error': 'nur Mission Control'}
    if len(data) > 256 * 1024:
        return 413, {'ok': False, 'error': 'zu groß'}
    try:
        req = json.loads(data.decode('utf-8'))
    except Exception:
        return 400, {'ok': False, 'error': 'kein JSON'}
    if not isinstance(req, dict):
        return 400, {'ok': False, 'error': 'kein Objekt'}
    gruppe = req.get('gruppe')
    if not isinstance(gruppe, str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,20}', gruppe):
        return 400, {'ok': False, 'error': 'Gruppe fehlt'}
    aktion = req.get('aktion')
    kids = _kids(req, aktion == 'oeffnen')
    if kids is None:
        return 400, {'ok': False, 'error': 'Kinder fehlen oder ungültig'}
    liste, rows = _book(gruppe)

    if aktion == 'pruefen':
        out = []
        for k in kids:
            if liste is None:
                out.append({'code': k['code'], 'adresse': None, 'grund': 'keine Liste'})
                continue
            addr, why = _find(rows, k['name'])
            out.append({'code': k['code'], 'adresse': addr, 'grund': why})
        return 200, {'ok': True, 'liste': liste, 'kinder': out}

    if aktion == 'oeffnen':
        subject = req.get('betreff')
        if not isinstance(subject, str) or not 0 < len(subject) <= 200:
            return 400, {'ok': False, 'error': 'Betreff fehlt'}
        if liste is None:
            return 200, {'ok': False, 'error': 'keine Adressliste für ' + gruppe}
        out, n = [], 0
        for k in kids:
            addr, why = _find(rows, k['name'])
            if not addr:
                out.append({'code': k['code'], 'ok': False, 'grund': why})
                continue
            ok = _outlook(addr, subject, _html(k['text']))
            n += ok
            out.append({'code': k['code'], 'ok': ok, 'grund': '' if ok else 'Outlook'})
        return 200, {'ok': True, 'geoeffnet': n, 'kinder': out}

    if aktion == 'bcc':
        subject, text = req.get('betreff'), req.get('text')
        if not isinstance(subject, str) or not 0 < len(subject) <= 200:
            return 400, {'ok': False, 'error': 'Betreff fehlt'}
        if not isinstance(text, str) or not 0 < len(text) <= MAX_TEXT:
            return 400, {'ok': False, 'error': 'Text fehlt'}
        if liste is None:
            return 200, {'ok': False, 'error': 'keine Adressliste für ' + gruppe}
        out, addrs = [], []
        for k in kids:
            addr, why = _find(rows, k['name'])
            out.append({'code': k['code'], 'ok': bool(addr), 'grund': why})
            if addr and addr not in addrs:
                addrs.append(addr)
        if not addrs:
            return 200, {'ok': False, 'error': 'keine Adresse gefunden'}
        if not _outlook_bcc(addrs, subject, _html(text)):
            return 200, {'ok': False, 'error': 'Outlook'}
        return 200, {'ok': True, 'geoeffnet': 1, 'bcc': len(addrs), 'kinder': out}

    return 400, {'ok': False, 'error': 'aktion: pruefen | oeffnen | bcc'}
