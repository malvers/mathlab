#!/usr/bin/env python3
"""Tour review server: a LIVE tour through the labs, paused and commented like a film.

    python3 tools/tourkritik.py mission-control          # 127.0.0.1:8769
    python3 tools/tourkritik.py mission-control 8770     # other port

    then open  http://127.0.0.1:8769/tours/mission-control.html

Doc, 19.09.2026: "eine (umfangreichere) Tour direkt im Lab, die ich genau wie im filmkritik anhalten und
kommentieren kann ... mach es bitte allgemein, sodass wir es immer wieder nutzen können". A film has to be
rendered again after every remark; a tour is the choreography itself, running in the real pages - a fix is
a file edit, live reload, and the scene plays again.

What this server does, and why it is its own:
  - serves HTML/ like filmkritik.py (live reload + LOCAL badge from serve.py), so the tour page and every lab
    it drives share ONE origin - the tour reaches into its iframes (same origin) instead of Playwright
  - /__tour/audio/<file>   Solita's voice per scene, from the tour's working directory
                           ~/Movies/videopipeline/<tour>/ (never from the repo - audio is not in git)
  - /__kritik/*            the review store of filmkritik.py, reused as it is: remarks land in
                           ~/Movies/videopipeline/<tour>/tour-kritik/kritik.json (+ kNNN_<sec>.webm);
                           a tour remark carries its scene and the second inside it
  - /__tour/hook/<name>    what a page must not do itself (server data, the Supabase management token):
                           videopipeline/<tour>/tour_hooks.py, reloaded on every call. setup() arms,
                           teardown() disarms - an armed tour is torn down when the page has not been seen
                           for IDLE seconds (tab closed) and when this server stops.
  - /__tour/alive          the page's pulse (every 5 s, with its state), answers whether the hooks are armed
  - /__tour/text           the subtitles: texts.json of the tour's folder (what run1 really synthesised)

serve.py stays read-only on purpose; filmkritik.py stays the film tool. This file only adds what a tour needs.
"""
import atexit
import datetime
import importlib.util
import json
import os
import re
import signal
import sys
import threading
import time

TOOLS = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(TOOLS)
if TOOLS not in sys.path:
    sys.path.insert(0, TOOLS)

TOUR = sys.argv[1] if len(sys.argv) > 1 else ''
if not re.match(r'^[a-z0-9][a-z0-9-]*$', TOUR):
    sys.exit('Aufruf: python3 tools/tourkritik.py <tour-id> [port]   (z. B. mission-control)')
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8769
WORK = os.path.expanduser('~/Movies/videopipeline/' + TOUR)
HOOKS = os.path.join(REPO, 'videopipeline', TOUR, 'tour_hooks.py')
IDLE = 180                     # seconds without a pulse before an armed tour is torn down

# The review store IS filmkritik.py's: same files, same safety (nothing is ever destroyed, only moved).
# Its module-level paths point at a film; here they point at the tour's own folder.
sys.argv = [sys.argv[0]]       # filmkritik reads its film from argv at import time
import filmkritik as fk        # noqa: E402

fk.FILM = os.path.join(WORK, 'tour-' + TOUR)          # only its name is used (kritik.md, fertig.json)
fk.STORE = os.path.join(WORK, 'tour-kritik')
fk.INDEX = os.path.join(fk.STORE, 'kritik.json')

STATE = {'armed': False, 'seen': 0.0}
LOCK = threading.Lock()


def load_hooks():
    if not os.path.isfile(HOOKS):
        return None
    spec = importlib.util.spec_from_file_location('tour_hooks_' + TOUR.replace('-', '_'), HOOKS)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def run_hook(name, args):
    mod = load_hooks()
    fn = getattr(mod, name, None) if mod else None
    if not callable(fn) or name.startswith('_'):
        raise LookupError('kein Hook: ' + name)
    with LOCK:
        out = fn(args or {})
        if name == 'setup':
            STATE['armed'] = True
        elif name == 'teardown':
            STATE['armed'] = False
    return out


def disarm(why):
    """Tear an armed tour down (tab gone, server stopping). Never raises - it runs from atexit and a thread."""
    if not STATE['armed']:
        return
    try:
        out = run_hook('teardown', {'why': why})
        print('TEARDOWN (%s): %s' % (why, json.dumps(out, ensure_ascii=False)[:200]))
    except Exception as err:                         # the next setup() cleans up what is left
        print('TEARDOWN (%s) FEHLGESCHLAGEN: %s' % (why, err))


def watchdog():
    while True:
        time.sleep(10)
        if STATE['armed'] and STATE['seen'] and time.time() - STATE['seen'] > IDLE:
            disarm('keine Seite mehr seit %d s' % IDLE)


class Handler(fk.Handler):
    def log_message(self, fmt, *args):
        line = str(args[0]) if args else ''          # send_error logs an HTTPStatus here, not a request line
        if '__kritik' in line or '/__tour/hook' in line:
            super(fk.Handler, self).log_message(fmt, *args)

    def body(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n > 40 * 1024 * 1024:
            raise ValueError('zu groß')
        return json.loads(self.rfile.read(n) or b'{}')

    def same_origin(self):
        """Hooks touch server data: only this origin, and only with the header no plain form can send."""
        origin = self.headers.get('Origin')
        ok = {'http://127.0.0.1:%d' % PORT, 'http://localhost:%d' % PORT}
        return self.headers.get('X-Tour') == '1' and (origin is None or origin in ok)

    # ------------------------------------------------------------------ audio
    def send_audio(self, name):
        # the avatar's picture (and later its clips) come from the same working directory - not from the repo
        if not re.match(r'^[A-Za-z0-9_.-]+\.(mp3|wav|m4a|mp4|png|jpg)$', name):
            return self.send_error(404)
        path = os.path.join(WORK, name)
        if not os.path.isfile(path):
            return self.send_error(404, 'keine Tonspur: ' + name)
        ctype = {'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'm4a': 'audio/mp4', 'mp4': 'video/mp4',
                 'png': 'image/png', 'jpg': 'image/jpeg'}[name.rsplit('.', 1)[1]]
        with open(path, 'rb') as f:
            data = f.read()
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    # ---------------------------------------------------------------- remarks
    def add_remark(self):
        """As in filmkritik.py, plus where in the tour: scene id, number, title and the second inside it."""
        try:
            data = self.body()
        except ValueError as err:
            return self.reply(400, {'error': str(err)})
        items = fk.load()
        idx = max([x['n'] for x in items], default=0) + 1
        t = float(data.get('t') or 0)
        st = float(data.get('szene_t') or 0)
        name = 'k%03d_%04d.webm' % (idx, int(t))
        audio = data.get('audio') or ''
        if audio:
            import base64
            os.makedirs(fk.STORE, exist_ok=True)
            with open(os.path.join(fk.STORE, name), 'wb') as f:
                f.write(base64.b64decode(audio.split(',')[-1]))
        nr = str(data.get('szene_nr') or '')
        item = {
            'n': idx,
            't': round(t, 2),
            # "zeit" is what the lists show: scene and second, the place Doc means ("Szene 8, bei 0:12")
            'zeit': (nr + ' · ' if nr else '') + fk.mmss(st),
            'dauer': round(float(data.get('dauer') or 0), 1),
            'text': (data.get('text') or '').strip(),
            'datei': name if audio else '',
            'wann': datetime.datetime.now().isoformat(timespec='seconds'),
            'szene': data.get('szene') or '',
            'szene_nr': nr,
            'szene_titel': data.get('szene_titel') or '',
            'szene_t': round(st, 2),
            'sagt': (data.get('sagt') or '').strip(),        # Solita's line at that moment (the subtitle)
        }
        items.append(item)
        fk.save(items)
        print('  %2d. %s  %s' % (idx, item['zeit'], item['text'][:70] or '(ohne Text)'))
        return self.reply(200, {'items': items})

    # ------------------------------------------------------------------ hooks
    def hook(self, name):
        if not self.same_origin():
            return self.reply(403, {'error': 'nur von der Tour-Seite'})
        try:
            args = self.body()
        except ValueError as err:
            return self.reply(400, {'error': str(err)})
        STATE['seen'] = time.time()
        try:
            out = run_hook(name, args)
        except LookupError as err:
            return self.reply(404, {'error': str(err)})
        except Exception as err:
            print('HOOK %s FEHLER: %s' % (name, err))
            return self.reply(500, {'error': str(err)})
        return self.reply(200, {'ok': True, 'out': out, 'armed': STATE['armed']})

    def do_POST(self):
        path = self.path.split('?')[0]
        if path == '/__kritik/kommentar':
            return self.add_remark()
        if path.startswith('/__tour/hook/'):
            return self.hook(path[len('/__tour/hook/'):])
        if path == '/__tour/alive':
            try:
                data = self.body()
            except ValueError:
                data = {}
            # only a page whose tour is on (running, paused, spooling, at its end) keeps an armed tour alive - a page
            # that merely waits after a reload has nothing on stage, so the watchdog puts the data back (19.09.2026)
            if data.get('state', 'running') != 'idle':
                STATE['seen'] = time.time()
            return self.reply(200, {'armed': STATE['armed'], 'hooks': os.path.isfile(HOOKS)})
        return super().do_POST()

    def do_GET(self):
        path = self.path.split('?')[0]
        if path.startswith('/__tour/audio/'):
            return self.send_audio(path[len('/__tour/audio/'):])
        if path == '/__tour/text':
            # the subtitles: exactly what was synthesised (run1 keeps it in texts.json), not what narration.mjs says now
            try:
                with open(os.path.join(WORK, 'texts.json'), encoding='utf-8') as f:
                    return self.reply(200, json.load(f))
            except (OSError, ValueError):
                return self.reply(200, {})
        if path == '/__tour/info':
            return self.reply(200, {'tour': TOUR, 'ordner': fk.STORE, 'hooks': os.path.isfile(HOOKS),
                                    'armed': STATE['armed']})
        return super().do_GET()

    do_HEAD = do_GET


def stop(signum, frame):
    sys.exit(0)                                          # runs atexit -> disarm


if __name__ == '__main__':
    os.makedirs(fk.STORE, exist_ok=True)
    atexit.register(disarm, 'Server beendet')
    signal.signal(signal.SIGTERM, stop)
    threading.Thread(target=watchdog, daemon=True).start()
    print('Tour   :', TOUR)
    print('Ton    :', WORK)
    print('Hooks  :', HOOKS if os.path.isfile(HOOKS) else '(keine)')
    print('Kritik :', fk.INDEX)
    print('Seite  : http://127.0.0.1:%d/tours/%s.html' % (PORT, TOUR))
    try:
        fk.http.server.ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        pass
