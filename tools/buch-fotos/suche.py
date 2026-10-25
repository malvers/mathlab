# tools/buch-fotos/suche.py - searches Wikimedia Commons for photos and stores metadata + 400 px thumbnails: commons_search.py <outdir> <tag> <query...>
import json, re, sys, urllib.parse, urllib.request, html, os
out, tag, q = sys.argv[1], sys.argv[2], ' '.join(sys.argv[3:])
UA = {'User-Agent': 'DocAlversMatheLabor/1.0 (info@docalvers.de) photo research'}
params = {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': 'filetype:bitmap ' + q, 'gsrnamespace': 6,
          'gsrlimit': 14, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 400}
url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))
res = []
for p in sorted((d.get('query') or {}).get('pages', {}).values(), key=lambda p: p.get('index', 0)):
    ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
    g = lambda k: re.sub(r'<[^>]+>', '', html.unescape(m.get(k, {}).get('value', ''))).strip()
    lic = g('LicenseShortName')
    if re.search(r'\bNC\b|non-?commercial|fair use', lic, re.I): continue
    if 'GFDL' in lic and 'CC' not in lic: continue          # GFDL alone wants its whole text printed
    r = {'tag': tag, 'title': p['title'], 'w': ii['width'], 'h': ii['height'], 'license': lic, 'artist': g('Artist')[:80],
         'page': ii['descriptionurl'], 'orig': ii['url'], 'thumb': ii.get('thumburl')}
    if r['w'] < 1800: continue
    res.append(r)
for i, r in enumerate(res[:8]):
    fn = os.path.join(out, f"{tag}-{i}.jpg")
    try:
        with urllib.request.urlopen(urllib.request.Request(r['thumb'], headers=UA), timeout=40) as f: open(fn, 'wb').write(f.read())
        r['file'] = fn
    except Exception as e: r['err'] = str(e)
json.dump(res[:8], open(os.path.join(out, tag + '.json'), 'w'), ensure_ascii=False, indent=1)
print(tag, len(res[:8]), [r['title'][5:45] for r in res[:8]])
