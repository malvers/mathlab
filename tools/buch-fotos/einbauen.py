# tools/buch-fotos/einbauen.py - photos for a book in one go: download from Commons (resized), upload to R2, write the entries into js/buch-fotos.js.
#   add_fotos.py <book> <spec.json>
# spec: {"plan": {file: [[name, selector, "in"|"after"], ...]},
#        "src": {name: ["<dir>", "<tile>"] | "reuse"},
#        "alt": {name: ["de", "en"]}, "w": {name: [width%, "object-position" | null]}}
import json, os, re, subprocess, sys, urllib.parse, urllib.request
from PIL import Image
book, spec = sys.argv[1], json.load(open(sys.argv[2]))
WT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
UA = {'User-Agent': 'DocAlversMatheLabor/1.0 (info@docalvers.de) textbook photos'}
os.makedirs('dl', exist_ok=True); os.makedirs('out', exist_ok=True)
meta = {}
for d in {v[0] for v in spec['src'].values() if v != 'reuse'}:
    for j in os.listdir(d):
        if j.endswith('.json'):
            for r in json.load(open(os.path.join(d, j))):
                if r.get('file'): meta[(d, os.path.basename(r['file'])[:-4])] = r
banners = {n for f in spec['plan'].values() for n, s, p in f if p == 'after'}
credits = {}
for name, key in spec['src'].items():
    if key == 'reuse': continue
    r = meta[tuple(key)]; src = f'dl/{name}.src'
    if not os.path.exists(src):
        q = {'action': 'query', 'format': 'json', 'titles': r['title'], 'prop': 'imageinfo', 'iiprop': 'url', 'iiurlwidth': 2000}
        d = json.load(urllib.request.urlopen(urllib.request.Request('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(q), headers=UA), timeout=60))
        url = next(iter(d['query']['pages'].values()))['imageinfo'][0]['thumburl']
        open(src, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180).read())
    im = Image.open(src).convert('RGB'); side = 2000 if name in banners else 1200
    im.thumbnail((side, side), Image.LANCZOS)
    out = f'out/{name}.jpg'; q = 82
    while True:
        im.save(out, 'JPEG', quality=q, optimize=True, progressive=True)
        if os.path.getsize(out) <= (520 if name in banners else 320) * 1024 or q <= 70: break
        q -= 4
    up = subprocess.run(['node', WT + '/tools/media_publish.mjs', out, f'buch/fotos/{name}.jpg'], capture_output=True, text=True)
    ok = 'r2.dev/buch/fotos/' in up.stdout + up.stderr
    lic = 'public domain' if r['license'].lower() == 'public domain' else r['license']
    credits[name] = {'artist': r['artist'], 'license': lic, 'page': r['page']}
    print(f"{name:18} {im.size[0]}x{im.size[1]} {os.path.getsize(out)//1024:4} KB q{q} R2:{'ok' if ok else 'FAIL'} | {r['artist'][:30]} | {lic}")
    if not ok: print(up.stdout[-300:], up.stderr[-300:]); sys.exit(1)
# entries
qs = lambda s: "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
p = WT + '/HTML/js/buch-fotos.js'; s = open(p, encoding='utf-8').read()
fot = ''.join(f"        {qs(n)}: {{ artist: {qs(c['artist'])}, license: {qs(c['license'])}, page: {qs(c['page'])},\n            alt: {{ de: {qs(spec['alt'][n][0])}, en: {qs(spec['alt'][n][1])} }} }},\n"
              for n, c in credits.items() if f"'{n}':" not in s)
i = s.index('\n    },\n    books: {')
s = s[:i] + ',\n        // ' + book + ' (' + __import__('datetime').date.today().isoformat() + ')\n' + fot.rstrip(',\n') + s[i:]
rows = []
for f, spots in spec['plan'].items():
    r = []
    for n, sel, put in spots:
        if put == 'after': r.append(f"                {{ foto: {qs(n)}, at: {qs(sel)}, put: 'after', wide: true }}")
        else:
            w, pos = spec['w'].get(n, [34, None])
            r.append(f"                {{ foto: {qs(n)}, at: {qs(sel)}, put: 'in', w: {w}" + (f", pos: {qs(pos)}" if pos else '') + " }")
    rows.append(f"            {qs(f)}: [\n" + ',\n'.join(r) + "\n            ]")
blk = f"        {book}: {{\n" + ',\n'.join(rows) + "\n        }"
j = s.rindex('\n    }\n};')
s = s[:j] + ',\n' + blk + s[j:]
open(p, 'w', encoding='utf-8').write(s)
print('entries written:', len(credits), 'photos,', sum(len(v) for v in spec['plan'].values()), 'places')
