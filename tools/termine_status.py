""""War da" ticks for own appointments (Coaching) in stundenplan.html.

serve.py routes /__termine/ here and reloads this module per call, so a change needs no
server restart. The ticks live next to termine.json in HTML/svp/plandaten/ - gitignored,
because the keys carry students' names (Doc, 02.11.2026). The page reads the file directly.

  POST /__termine/da   {"key": "<date>|<title>|<who>", "da": true|false}
                       -> {"da": {key: time ticked, ...}}
"""
import fcntl
import json
import os
import time

HERE = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.normpath(os.path.join(HERE, '..', 'HTML', 'svp', 'plandaten'))
FILE = os.path.join(DIR, 'termine-status.json')
LOCK = os.path.join(DIR, 'termine-status.lock')


def _load():
    try:
        with open(FILE, encoding='utf-8') as f:
            return json.load(f).get('da', {})
    except (OSError, ValueError):
        return {}


def handle(command, path, headers, data):
    if command != 'POST' or path.split('?', 1)[0].rstrip('/') != '/__termine/da':
        return 405, {'error': 'POST /__termine/da'}
    if len(data) > 4096:
        return 413, {'error': 'too large'}
    try:
        req = json.loads(data.decode('utf-8'))
    except Exception as err:
        return 400, {'error': 'kein JSON: %s' % err}
    key = req.get('key') if isinstance(req, dict) else None
    if not isinstance(key, str) or not key or len(key) > 200:
        return 400, {'error': 'key fehlt'}
    os.makedirs(DIR, exist_ok=True)
    # two quick clicks arrive on two threads - read, change and write one after the other
    with open(LOCK, 'w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        da = _load()
        if req.get('da'):
            da[key] = time.strftime('%Y-%m-%d %H:%M')
        else:
            da.pop(key, None)
        tmp = FILE + '.tmp'
        with open(tmp, 'w', encoding='utf-8') as f:
            json.dump({'da': da}, f, ensure_ascii=False, indent=1, sort_keys=True)
        os.replace(tmp, FILE)
    return 200, {'da': da}
