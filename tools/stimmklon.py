#!/usr/bin/env python3
"""Voice-clone recording booth: reads Doc a script, records each line, writes clean WAVs.

    python3 tools/stimmklon.py          # 127.0.0.1:8767
    python3 tools/stimmklon.py 8768     # other port

Why this exists: every cloning service (ElevenLabs, Fish Audio, Google's Instant Custom
Voice once we are allow-listed) wants the same thing first - a few minutes of ONE speaker,
clean, no music, no second voice. Chrome hands us audio/webm;codecs=opus, which none of
them love, so ffmpeg converts every take to mono 24 kHz WAV right here. Whatever we pick
later, the material is ready and never has to be recorded twice.

Where the takes land - deliberately OUTSIDE the repo, which is public (rule 18/21):

    ~/Movies/stimmklon/roh/s03.webm     what Chrome recorded
    ~/Movies/stimmklon/s03.wav          mono 24 kHz, what a service gets
    ~/Movies/stimmklon/aufnahmen.json   one entry per line: text, duration, file

The consent line is recorded separately as einwilligung.wav because Google requires the
speaker to say a fixed sentence; the services that do not ask for it simply ignore it.
"""
import base64
import datetime
import http.server
import importlib
import json
import os
import re
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.dirname(os.path.abspath(__file__))
for _p in (REPO, TOOLS):
    if _p not in sys.path:
        sys.path.insert(0, _p)
# Live reload, the LOCAL badge and the red tab icon come from serve.py, exactly as on :8765 -
# one implementation, every local server (Doc, 18.09.2026: "bitte immer überall").
from serve import inject, LIVE_RELOAD, local_icon  # noqa: E402
import live_reload  # noqa: E402

DEFAULT_PORT = 8771
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 0   # 0 = look for a free one, see free_port()
STORE = os.path.expanduser('~/Movies/stimmklon')
RAW = os.path.join(STORE, 'roh')
INDEX = os.path.join(STORE, 'aufnahmen.json')


def free_port(start=DEFAULT_PORT, tries=12):
    """Doc usually has several filmkritik servers up (8766, 8767, 8768 ...) and they all serve
    HTML/, so a collision hands back THIS page from a foreign server - looks fine, but /__stimme/*
    is missing. Picking a free port ourselves makes that impossible."""
    import socket
    for p in range(start, start + tries):
        with socket.socket() as s:
            if s.connect_ex(('127.0.0.1', p)):
                return p
    sys.exit('kein freier Port zwischen %d und %d' % (start, start + tries))


def load():
    try:
        with open(INDEX, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def save(takes):
    os.makedirs(STORE, exist_ok=True)
    with open(INDEX, 'w', encoding='utf-8') as f:
        json.dump(takes, f, ensure_ascii=False, indent=1)


def to_wav(src, dst):
    """Mono 24 kHz WAV - the format every cloning service accepts without complaining.

    24 kHz because that is what Google's Instant Custom Voice and ElevenLabs both work in;
    upsampling later invents nothing, so recording higher buys us nothing here either.
    """
    try:
        subprocess.run(
            ['ffmpeg', '-y', '-i', src, '-ac', '1', '-ar', '24000', '-c:a', 'pcm_s16le', dst],
            check=True, capture_output=True, timeout=120,
        )
        return True, ''
    except FileNotFoundError:
        return False, 'ffmpeg fehlt'
    except subprocess.CalledProcessError as err:
        return False, (err.stderr or b'')[-400:].decode('utf-8', 'replace')
    except subprocess.TimeoutExpired:
        return False, 'ffmpeg hing'


def wav_level(path):
    """Mean volume in dB. Speech recorded properly sits near -20 to -30 dB; below about -45 the
    file holds room noise and no voice. Doc's first run came back at -55 to -72 dB and he could
    hear nothing (22.09.2026) - so every take gets measured and a silent one says so."""
    try:
        out = subprocess.run(
            ['ffmpeg', '-i', path, '-af', 'volumedetect', '-f', 'null', '-'],
            check=True, capture_output=True, timeout=60,
        )
        m = re.search(r'mean_volume:\s*(-?[\d.]+) dB', (out.stderr or b'').decode('utf-8', 'replace'))
        return round(float(m.group(1)), 1) if m else None
    except Exception:
        return None


def wav_seconds(path):
    """Real duration from the file, not from the browser's timer - the browser counts the
    button press, ffprobe counts the audio. A service that wants '30 minutes' means the audio."""
    try:
        out = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
             '-of', 'default=nw=1:nk=1', path],
            check=True, capture_output=True, timeout=30,
        )
        return round(float(out.stdout.strip() or 0), 2)
    except Exception:
        return 0.0


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=os.path.join(REPO, 'HTML'), **kw)

    def log_message(self, *a):
        pass

    def reply(self, status, obj):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        # This page also gets served by serve.py (:8765) and by every filmkritik server, because they
        # all serve HTML/ - but only we answer /__stimme/*. There the page looked fine and saved nothing
        # (Doc, 22.09.2026: "das ist nix aufgenommen?"). So it may ask other local ports whether the booth
        # is there; localhost only, and the answer carries no data worth protecting.
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def add_take(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n > 60 * 1024 * 1024:
            return self.reply(413, {'error': 'zu groß'})
        try:
            data = json.loads(self.rfile.read(n) or b'{}')
        except ValueError as err:
            return self.reply(400, {'error': str(err)})

        key = str(data.get('id') or '').strip()
        audio = data.get('audio') or ''
        if not key or not audio:
            return self.reply(400, {'error': 'id oder audio fehlt'})
        # keep the id filename-safe: it becomes s07.wav / einwilligung.wav on disk
        if not all(c.isalnum() or c in '-_' for c in key):
            return self.reply(400, {'error': 'ungültige id'})

        os.makedirs(RAW, exist_ok=True)
        raw = os.path.join(RAW, key + '.webm')
        with open(raw, 'wb') as f:
            f.write(base64.b64decode(audio.split(',')[-1]))

        wav = os.path.join(STORE, key + '.wav')
        ok, err = to_wav(raw, wav)
        secs = wav_seconds(wav) if ok else 0.0
        pegel = wav_level(wav) if ok else None

        takes = load()
        takes[key] = {
            'text': (data.get('text') or '').strip(),
            'sekunden': secs,
            'pegel': pegel,
            'datei': (key + '.wav') if ok else '',
            'fehler': '' if ok else err,
            'wann': datetime.datetime.now().isoformat(timespec='seconds'),
        }
        save(takes)
        total = sum(t.get('sekunden') or 0 for t in takes.values())
        print('  %-14s %5.1f s  %6s dB  gesamt %4.1f min   %s'
              % (key, secs, ('%.1f' % pegel) if pegel is not None else '?', total / 60,
                 (takes[key]['text'] or '')[:40]))
        if pegel is not None and pegel < -45:
            print('     ZU LEISE - da ist keine Stimme drin')
        if not ok:
            print('     ffmpeg: ' + err[:200])
        return self.reply(200, {'takes': takes, 'gesamt': round(total, 1)})

    def drop_take(self):
        n = int(self.headers.get('Content-Length') or 0)
        try:
            data = json.loads(self.rfile.read(n) or b'{}')
        except ValueError as err:
            return self.reply(400, {'error': str(err)})
        key = str(data.get('id') or '')
        takes = load()
        if key in takes:
            # Doc, 21.09.2026: "mv -> bin" - a discarded take goes to the trash, never rm
            papier = os.path.expanduser('~/.Trash')
            stamp = datetime.datetime.now().strftime('%H%M%S')
            for p in (os.path.join(STORE, key + '.wav'), os.path.join(RAW, key + '.webm')):
                if os.path.isfile(p):
                    try:
                        os.rename(p, os.path.join(papier, 'stimmklon-%s-%s' % (stamp, os.path.basename(p))))
                    except OSError:
                        pass
            takes.pop(key)
            save(takes)
        total = sum(t.get('sekunden') or 0 for t in takes.values())
        return self.reply(200, {'takes': takes, 'gesamt': round(total, 1)})

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

    def do_POST(self):
        if self.path == '/__stimme/aufnahme':
            return self.add_take()
        if self.path == '/__stimme/loeschen':
            return self.drop_take()
        self.send_error(405, 'nur /__stimme/*')

    def do_GET(self):
        p = self.path.split('?')[0]
        if p == '/__stimme/liste':
            takes = load()
            total = sum(t.get('sekunden') or 0 for t in takes.values())
            return self.reply(200, {'takes': takes, 'gesamt': round(total, 1), 'ordner': STORE})
        if p.startswith('/__stimme/hoeren/'):
            return self.send_wav(p.rsplit('/', 1)[-1])
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

    def send_wav(self, name):
        """Play a take back. The WAVs live outside HTML/, so SimpleHTTPRequestHandler cannot reach them."""
        if not all(c.isalnum() or c in '-_' for c in name):
            return self.send_error(400, 'ungültig')
        path = os.path.join(STORE, name + '.wav')
        if not os.path.isfile(path):
            return self.send_error(404, 'keine Aufnahme')
        with open(path, 'rb') as f:
            body = f.read()
        self.send_response(200)
        self.send_header('Content-Type', 'audio/wav')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    os.makedirs(RAW, exist_ok=True)
    if not PORT:
        PORT = free_port()
    have = load()
    mins = sum(t.get('sekunden') or 0 for t in have.values()) / 60
    print('Aufnahmen :', STORE, '(%d Stück, %.1f min)' % (len(have), mins))
    print('Seite     : http://127.0.0.1:%d/stimmklon.html' % PORT)
    if subprocess.run(['which', 'ffmpeg'], capture_output=True).returncode:
        print('WARNUNG   : ffmpeg fehlt - die Aufnahmen bleiben webm, kein WAV')
    http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
