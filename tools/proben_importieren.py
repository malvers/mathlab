#!/usr/bin/env python3
"""Import handwriting probes into the corpus (HTML/morpheus/handschrift-proben/).

The live site has no /__proben/ endpoint, so vorrechnen.html falls back to a
download there: probe-<slug>-<timestamp>.json in the tablet's Download folder.
Doc then zips that folder into OneDrive, or the tablet is plugged in. Either
way, this is the one place the files are turned into corpus entries.

  python3 tools/proben_importieren.py <zip | folder> [...]

Only probe-*.json is taken - a zipped Download folder carries everything else
Doc ever downloaded. Files are numbered after the last probe in the corpus, in
the order they were recorded. A probe whose strokes are identical to one already
imported (ERKENNEN pressed twice) is skipped, so is one already in the corpus.
"""
import hashlib
import json
import os
import re
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.normpath(os.path.join(HERE, '..', 'HTML', 'morpheus', 'handschrift-proben'))
NAME = re.compile(r'(^|/)probe-[^/]*\.json$')


def einlesen(quelle):
    """Yield (name, dict) for every probe in a zip or a folder."""
    if zipfile.is_zipfile(quelle):
        with zipfile.ZipFile(quelle) as z:
            for n in z.namelist():
                if NAME.search(n):
                    try:
                        yield os.path.basename(n), json.loads(z.read(n).decode('utf-8'))
                    except Exception as e:
                        print('  überspringe %s - %s' % (n, e))
    else:
        for n in sorted(os.listdir(quelle)):
            if NAME.search(n):
                try:
                    yield n, json.load(open(os.path.join(quelle, n), encoding='utf-8'))
                except Exception as e:
                    print('  überspringe %s - %s' % (n, e))


def strich_hash(d):
    """Identity of a probe = its ink. Rounded, so a re-save does not count as new."""
    s = [[(round(p['x'], 1), round(p['y'], 1)) for p in st.get('points', [])] for st in d.get('strokes', [])]
    return hashlib.sha1(json.dumps(s).encode()).hexdigest()


def main(quellen):
    os.makedirs(ZIEL, exist_ok=True)
    vorhanden = {}
    nrs = []
    for f in os.listdir(ZIEL):
        m = re.match(r'probe-(\d+)-', f)
        if not m:
            continue
        nrs.append(int(m.group(1)))
        try:
            vorhanden[strich_hash(json.load(open(os.path.join(ZIEL, f), encoding='utf-8')))] = f
        except Exception:
            pass
    nr = max(nrs) + 1 if nrs else 1

    proben = []
    for q in quellen:
        for name, d in einlesen(q):
            if not isinstance(d.get('strokes'), list) or not d['strokes']:
                print('  überspringe %s - keine Striche' % name)
                continue
            proben.append((d.get('created', ''), name, d))
    proben.sort(key=lambda p: (p[0], p[1]))

    neu = 0
    for created, name, d in proben:
        h = strich_hash(d)
        if h in vorhanden:
            print('  %-44s gleiche Striche wie %s - übersprungen' % (name, vorhanden[h]))
            continue
        slug = ((d.get('vorlage') or {}).get('slug')
                or re.sub(r'^probe-|-\d{4}-\d\d-\d\d.*$|\.json$', '', name) or 'probe')
        ziel = 'probe-%02d-%s.json' % (nr, slug)
        with open(os.path.join(ZIEL, ziel), 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, indent=1)
        vorhanden[h] = ziel
        print('  %-28s %3d Striche  %s' % (ziel, len(d['strokes']), (d.get('latex') or '–')[:50]))
        nr += 1
        neu += 1
    print('%d neu importiert, Korpus jetzt %d Proben' % (
        neu, len([f for f in os.listdir(ZIEL) if re.match(r'probe-\d+-', f)])))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
