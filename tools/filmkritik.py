#!/usr/bin/env python3
"""Film review server: plays a cut, records Doc's spoken remarks, writes them next to it.

    python3 tools/filmkritik.py                  # wuerfelspiel, 127.0.0.1:8766
    python3 tools/filmkritik.py <film.mp4>       # any other cut
    python3 tools/filmkritik.py <film.mp4> 8767  # other port

Why its own server instead of serve.py: a review needs to JUMP inside the film, and
http.server answers every request with the whole file - no Range, no seeking, and a
43 MB master would be re-sent on every scrub. This one speaks Range, serves the film
from ~/Movies (never from the repo - films are not in git) and takes POSTs, which
serve.py refuses on purpose ("read-only server").

Where the review lands (next to the film's working directory):

    ~/Movies/videopipeline/<film>/kritik/kritik.json    one entry per remark
    ~/Movies/videopipeline/<film>/kritik/k001_0342.webm the spoken remark itself

kritik.json is the file the agent reads afterwards: it carries the film time, the
duration, Chrome's live transcript and the audio file name, so a remark can be checked
by ear when the transcript looks garbled.
"""
import http.server
import importlib
import json
import os
import re
import sys
import base64
import datetime

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.dirname(os.path.abspath(__file__))
for _p in (REPO, TOOLS):
    if _p not in sys.path:
        sys.path.insert(0, _p)
# Live reload, the LOCAL badge and the red tab icon come from serve.py, exactly as on :8765 -
# one implementation, every local server (Doc, 18.09.2026: "bitte immer überall").
from serve import inject, LIVE_RELOAD, local_icon  # noqa: E402
import live_reload  # noqa: E402
HTML_DIR = os.path.join(REPO, 'HTML')
DEFAULT_FILM = os.path.expanduser('~/Movies/videopipeline/wuerfelspiel/wuerfelspiel-voice-1440p.mp4')

FILM = os.path.abspath(os.path.expanduser(sys.argv[1])) if len(sys.argv) > 1 else DEFAULT_FILM
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8766
STORE = os.path.join(os.path.dirname(FILM), 'kritik')
INDEX = os.path.join(STORE, 'kritik.json')


def load():
    try:
        with open(INDEX, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return []


def save(items):
    os.makedirs(STORE, exist_ok=True)
    with open(INDEX, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)


def mmss(t):
    return '%d:%02d' % (int(t) // 60, int(t) % 60)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HTML_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()

    def log_message(self, fmt, *args):          # one line per remark is enough
        if '__kritik' in (args[0] if args else ''):
            super().log_message(fmt, *args)

    # ---------------------------------------------------------------- the film
    def send_film(self):
        """GET /film.mp4 with Range support, so the player can seek."""
        try:
            size = os.path.getsize(FILM)
        except OSError:
            return self.send_error(404, 'Film nicht gefunden: ' + FILM)
        start, end = 0, size - 1
        rng = self.headers.get('Range')
        m = re.match(r'bytes=(\d*)-(\d*)', rng or '')
        partial = bool(m and (m.group(1) or m.group(2)))
        if partial:
            if m.group(1):
                start = int(m.group(1))
                if m.group(2):
                    end = min(int(m.group(2)), size - 1)
            else:                                # suffix range: the last N bytes
                start = max(0, size - int(m.group(2)))
        if start > end or start >= size:
            self.send_response(416)
            self.send_header('Content-Range', 'bytes */%d' % size)
            self.end_headers()
            return
        length = end - start + 1
        self.send_response(206 if partial else 200)
        self.send_header('Content-Type', 'video/mp4')
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(length))
        if partial:
            self.send_header('Content-Range', 'bytes %d-%d/%d' % (start, end, size))
        self.end_headers()
        with open(FILM, 'rb') as f:
            f.seek(start)
            while length > 0:
                chunk = f.read(min(256 * 1024, length))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return                       # the player scrubbed away, that is normal
                length -= len(chunk)

    # ------------------------------------------------------------- the remarks
    def reply(self, status, obj):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def add_remark(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n > 40 * 1024 * 1024:
            return self.reply(413, {'error': 'zu groß'})
        try:
            data = json.loads(self.rfile.read(n) or b'{}')
        except ValueError as err:
            return self.reply(400, {'error': str(err)})
        items = load()
        # highest number + 1, not the count: after a deletion the count hands out a number that is still in use
        # (18.09.2026: two remarks "11"), and /__kritik/loeschen deletes by number - it would take both
        idx = max([x['n'] for x in items], default=0) + 1
        t = float(data.get('t') or 0)
        name = 'k%03d_%04d.webm' % (idx, int(t))
        audio = data.get('audio') or ''
        if audio:
            os.makedirs(STORE, exist_ok=True)
            with open(os.path.join(STORE, name), 'wb') as f:
                f.write(base64.b64decode(audio.split(',')[-1]))
        item = {
            'n': idx,
            't': round(t, 2),
            'zeit': mmss(t),
            'dauer': round(float(data.get('dauer') or 0), 1),
            'text': (data.get('text') or '').strip(),
            'datei': name if audio else '',
            'wann': datetime.datetime.now().isoformat(timespec='seconds'),
        }
        items.append(item)
        save(items)
        print('  %2d. %s  %s' % (idx, item['zeit'], item['text'][:70] or '(ohne Text)'))
        return self.reply(200, {'items': items})

    def drop_remark(self):
        n = int(self.headers.get('Content-Length') or 0)
        try:
            data = json.loads(self.rfile.read(n) or b'{}')
        except ValueError as err:
            return self.reply(400, {'error': str(err)})
        n = int(data.get('n') or -1)
        keep, gone = [], []
        for x in load():
            (gone if x['n'] == n else keep).append(x)
        # The ✕ does not destroy either (Doc, 18.09.2026: "heben wir mal auf"): entry and audio move into
        # kritik/geloescht-einzeln/ - that day two real remarks went with a test remark of the same number, for good.
        bin_dir = os.path.join(STORE, 'geloescht-einzeln')
        stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
        if gone:
            os.makedirs(bin_dir, exist_ok=True)
            log = os.path.join(bin_dir, 'kritik.json')
            try:
                with open(log, encoding='utf-8') as f:
                    old = json.load(f)
            except (OSError, ValueError):
                old = []
            for x in gone:
                moved = ''
                src = os.path.join(STORE, x.get('datei') or '')
                if x.get('datei') and os.path.isfile(src):
                    moved = stamp + '_' + x['datei']          # the stamp keeps a reused number from overwriting
                    os.replace(src, os.path.join(bin_dir, moved))
                old.append(dict(x, geloescht=stamp, datei=moved))
            with open(log, 'w', encoding='utf-8') as f:
                json.dump(old, f, ensure_ascii=False, indent=1)
        save(keep)
        return self.reply(200, {'items': keep})

    def clear_all(self):
        """KOMMENTARE LÖSCHEN: the list is empty afterwards, but nothing is destroyed - remarks, audio and the
        submit flag move into kritik/geloescht-<date>-<time>/. A review is spoken work; one wrong click must not
        cost it. abschicken.log stays where it is (it is never overwritten)."""
        n = int(self.headers.get('Content-Length') or 0)
        self.rfile.read(n)
        stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
        bin_dir = os.path.join(STORE, 'geloescht-' + stamp)
        moved = 0
        if os.path.isdir(STORE):
            for name in sorted(os.listdir(STORE)):
                path = os.path.join(STORE, name)
                if not os.path.isfile(path) or name == 'abschicken.log':
                    continue
                os.makedirs(bin_dir, exist_ok=True)
                os.replace(path, os.path.join(bin_dir, name))
                moved += 1
        print('KOMMENTARE GELÖSCHT um %s — %d Dateien → %s' % (stamp, moved, bin_dir))
        return self.reply(200, {'items': [], 'verschoben': moved, 'ordner': bin_dir if moved else ''})

    # NOT "finish": socketserver calls self.finish() after EVERY request (setup - handle - finish). Under that name
    # this method "submitted" on every GET and POST - since live reload polls once a second, every second, and on
    # 18.09.2026 in class right with each saved remark, which made Solita thank too early.
    def submit(self):
        """Doc pressed ABSCHICKEN. Two files land next to the recordings:

        fertig.json  the flag the agent's monitor watches - that is what makes "senden" arrive
        kritik.md    the same remarks as one readable page, newest run on top
        """
        # how the submit came about (click or key, pointer type, ms since the last saved remark): on 18.09.2026 two
        # submits arrived in the very second a remark was saved and nobody could say from where - now it is on file
        n = int(self.headers.get('Content-Length') or 0)
        try:
            how = json.loads(self.rfile.read(n) or b'{}')
        except ValueError:
            how = {}
        items = load()
        when = datetime.datetime.now().isoformat(timespec='seconds')
        os.makedirs(STORE, exist_ok=True)
        with open(os.path.join(STORE, 'fertig.json'), 'w', encoding='utf-8') as f:
            json.dump({'wann': when, 'anzahl': len(items), 'film': os.path.basename(FILM), 'ausgeloest': how}, f,
                      ensure_ascii=False, indent=1)
        with open(os.path.join(STORE, 'abschicken.log'), 'a', encoding='utf-8') as f:   # every submit, never overwritten
            f.write(json.dumps({'wann': when, 'anzahl': len(items), 'ausgeloest': how}, ensure_ascii=False) + '\n')
        lines = ['# Kritik zu %s' % os.path.basename(FILM), '',
                 'Abgeschickt %s — %d Kommentare' % (when.replace('T', ' '), len(items)), '']
        for x in items:
            lines.append('- **%s** %s%s' % (
                x['zeit'],
                x['text'] or '(nur Ton, %.1f s)' % x['dauer'],
                '  ·  `%s`' % x['datei'] if x['datei'] else ''))
        with open(os.path.join(STORE, 'kritik.md'), 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')
        print('KRITIK ABGESCHICKT um %s — %d Kommentare → %s' % (when, len(items), STORE))
        return self.reply(200, {'items': items, 'fertig': when})

    def do_POST(self):
        if self.path == '/__kritik/kommentar':
            return self.add_remark()
        if self.path == '/__kritik/loeschen':
            return self.drop_remark()
        if self.path == '/__kritik/fertig':
            return self.submit()
        if self.path == '/__kritik/leeren':
            return self.clear_all()
        if self.path == '/__kritik/weiter':
            return self.reopen()
        self.send_error(405, 'nur /__kritik/*')

    def reopen(self):
        """The review goes on after a submit (the film plays on, a new remark starts): that submit was not the end.
        Doc, 18.09.2026, pressed ABSCHICKEN after every remark and Solita thanked after the first one - so the flag
        goes away again and the watcher (tools/filmkritik_waechter.sh), which waits 20 s, stays quiet."""
        n = int(self.headers.get('Content-Length') or 0)
        self.rfile.read(n)
        when = datetime.datetime.now().isoformat(timespec='seconds')
        try:
            os.remove(os.path.join(STORE, 'fertig.json'))
            gone = True
        except OSError:
            gone = False
        with open(os.path.join(STORE, 'abschicken.log'), 'a', encoding='utf-8') as f:
            f.write(json.dumps({'wann': when, 'weiter': True, 'flagge_weg': gone}, ensure_ascii=False) + '\n')
        print('WEITER um %s - das Abschicken davor war nicht das Ende' % when)
        return self.reply(200, {'weiter': True})

    def live_api(self):
        """/__live/* - the same module serve.py uses, reloaded per call like there."""
        try:
            status, ctype, body = importlib.reload(live_reload).handle(self.path)
        except Exception as err:
            status, ctype, body = 500, 'application/json', json.dumps({'error': str(err)}).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split('?')[0] == '/film.mp4':
            return self.send_film()
        if self.path.startswith('/__kritik/liste'):
            return self.reply(200, {'items': load(), 'film': os.path.basename(FILM), 'ordner': STORE})
        if self.path.startswith('/__live/'):
            return self.live_api()
        self.path = local_icon(self.path) or self.path   # red lambda, like on :8765
        path = self.translate_path(self.path)
        if path.lower().endswith(('.html', '.htm')) and os.path.isfile(path):
            with open(path, 'rb') as f:
                body = inject(f.read(), LIVE_RELOAD)
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            return self.wfile.write(body)
        return super().do_GET()

    do_HEAD = do_GET


if __name__ == '__main__':
    if not os.path.isfile(FILM):
        sys.exit('Film nicht gefunden: ' + FILM)
    os.makedirs(STORE, exist_ok=True)
    print('Film   :', FILM)
    print('Kritik :', INDEX)
    print('Seite  : http://127.0.0.1:%d/filmkritik.html' % PORT)
    http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
