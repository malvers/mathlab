"""Probes for the handwriting corpus (vorrechnen.html).

serve.py routes /__proben/ here and reloads this module per call, so a change
needs no server restart. Every ERKENNEN on the tablet posts one probe: the
strokes, the template that was shown, what Gemini read, how the pairing went.
The server hands out the running number, so the page keeps no bookkeeping.

  GET  /__proben/          -> {"proben": [names], "dir": path}
  POST /__proben/<slug>    -> writes probe-NN-<slug>.json, next free NN
                              -> {"name": ..., "anzahl": ...}
"""
import json
import os
import re
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.normpath(os.path.join(HERE, '..', 'HTML', 'morpheus', 'handschrift-proben'))
MAX_BYTES = 4 * 1024 * 1024


def _names():
    return sorted(f for f in os.listdir(DIR) if re.match(r'probe-\d+-.*\.json$', f))


def _next_number():
    nrs = []
    for f in os.listdir(DIR):
        m = re.match(r'probe-(\d+)-', f)
        if m:
            nrs.append(int(m.group(1)))
    return max(nrs) + 1 if nrs else 1


def handle(command, path, headers, data):
    os.makedirs(DIR, exist_ok=True)
    rest = urllib.parse.unquote(path[len('/__proben/'):]).strip('/')
    if command == 'GET':
        return 200, {'proben': _names(), 'dir': DIR}
    if command != 'POST':
        return 405, {'error': 'GET or POST'}
    if len(data) > MAX_BYTES:
        return 413, {'error': 'too large'}
    slug = re.sub(r'[^a-z0-9]+', '-', rest.lower()).strip('-')[:32] or 'probe'
    try:
        probe = json.loads(data.decode('utf-8'))
    except Exception as err:
        return 400, {'error': 'kein JSON: %s' % err}
    if not isinstance(probe, dict) or not isinstance(probe.get('strokes'), list):
        return 400, {'error': 'strokes fehlen'}
    name = 'probe-%02d-%s.json' % (_next_number(), slug)
    with open(os.path.join(DIR, name), 'w', encoding='utf-8') as f:
        json.dump(probe, f, ensure_ascii=False, indent=1)
    return 200, {'name': name, 'anzahl': len(_names())}
