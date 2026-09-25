#!/usr/bin/env python3
"""Pipeline for the "Gedanke der Woche" sheets (GdW) of the Stoffverteilungsplan.

One source of truth: tools/gdw/blaetter.json - per sheet the sentence (<b> = red words), who said it,
a role line and the picture (Wikimedia Commons title, licence, author). Everything else is rebuilt from it.
Working files (pictures, PDF, PNG, WebP) live in tools/gdw/arbeit/, which git ignores.

    python3 tools/gdw/gdw.py status                       what exists where, and which week shows it
    python3 tools/gdw/gdw.py suche 100 "deep field" ...   three free candidates per term -> contact sheet
    python3 tools/gdw/gdw.py waehle 100 2                 candidate 2 becomes the picture of sheet 100
    python3 tools/gdw/gdw.py hole [nr ...]                fetch missing pictures again by their Commons title
    python3 tools/gdw/gdw.py baue [nr ...]                HTML -> PDF + PNG -> WebP (gross 1200 px, thumb 200 px)
    python3 tools/gdw/gdw.py einbau nr ...                thumbs into HTML/svp/gdw/, big ones to R2 (bucket "gdw")
    python3 tools/gdw/gdw.py aus-pdf <datei.pdf> <nr>     Doc's own PowerPoint sheets: page 1 becomes <nr>, ...

Which week shows which sheet stays a hand edit in HTML/svp/gdw.json (or gdw-<satz>.json).
"""
import glob, io, json, os, re, shutil, subprocess, sys, urllib.parse, urllib.request

HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HIER))
ARBEIT = os.path.join(HIER, 'arbeit')
BILDER = os.path.join(ARBEIT, 'bilder')
KAND = os.path.join(ARBEIT, 'kandidaten')
OUT = os.path.join(ARBEIT, 'out')
DATEN = os.path.join(HIER, 'blaetter.json')
THUMBS = os.path.join(REPO, 'HTML', 'svp', 'gdw')
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'DocAlvers-Matheelabor/1.0 (Unterrichtsmaterial; michael.r.alvers@gmail.com)'


def lade():
    return json.load(open(DATEN, encoding='utf-8'))


def speichere(bl):
    bl.sort(key=lambda b: b['nr'])
    io.open(DATEN, 'w', encoding='utf-8').write(
        '[\n' + ',\n'.join(' ' + json.dumps(b, ensure_ascii=False) for b in bl) + '\n]\n')


def auswahl(bl, args):
    if not args:
        return bl
    want = {int(a) for a in args}
    sel = [b for b in bl if b['nr'] in want]
    missing = want - {b['nr'] for b in sel}
    if missing:
        sys.exit('nicht in blaetter.json: ' + ', '.join(map(str, sorted(missing))))
    return sel


def nn(nr):
    return '%02d' % nr


# ---------------------------------------------------------------- Wikimedia Commons

def api(params):
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(dict(params, format='json')),
                                 headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def laden(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def frei(meta):
    """Public domain / CC0 need no credit, CC BY(-SA) does; everything else is out -
    the big pictures are served publicly from R2, so a Pinterest find is not an option."""
    lic = (meta.get('LicenseShortName', {}).get('value') or '').strip()
    low = lic.lower()
    if 'public domain' in low or low.startswith('pd') or 'cc0' in low:
        return lic
    if re.match(r'cc by(-sa)?', low):
        return lic
    return None


def plain(html):
    return re.sub(r'<[^>]+>', '', html or '').strip()


def bildinfo(page):
    ii = (page.get('imageinfo') or [{}])[0]
    meta = ii.get('extmetadata') or {}
    return ii, meta, {
        'titel': page['title'], 'lizenz': frei(meta), 'credit': plain(meta.get('Artist', {}).get('value')),
        'seite': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(page['title'].replace(' ', '_')),
    }


def endung(roh):
    return '.png' if roh[:8] == b'\x89PNG\r\n\x1a\n' else '.jpg'


def cmd_suche(args):
    if len(args) < 2:
        sys.exit('Aufruf: suche <nr> "begriff" ["begriff" ...]')
    nr, terme = int(args[0]), args[1:]
    os.makedirs(KAND, exist_ok=True)
    for f in glob.glob(os.path.join(KAND, '%d_*' % nr)):
        os.remove(f)
    gef = []
    for t in terme:
        d = api({'action': 'query', 'generator': 'search', 'gsrsearch': t + ' filetype:bitmap', 'gsrnamespace': 6,
                 'gsrlimit': 12, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 1400})
        n = 0
        for s in sorted((d.get('query') or {}).get('pages', {}).values(), key=lambda p: p.get('index', 99)):
            if n >= 3:
                break
            ii, meta, info = bildinfo(s)
            if not info['lizenz'] or (ii.get('width') or 0) < 700:
                continue
            try:
                roh = laden(ii.get('thumburl') or ii['url'])
            except Exception as e:
                print('  Download fehlgeschlagen:', e)
                continue
            info['datei'] = '%d_%d%s' % (nr, len(gef), endung(roh))
            open(os.path.join(KAND, info['datei']), 'wb').write(roh)
            gef.append(info)
            n += 1
            print('%d  %-60s %s' % (len(gef) - 1, info['titel'][5:65], info['lizenz']))
    json.dump(gef, open(os.path.join(KAND, '%d.json' % nr), 'w'), ensure_ascii=False, indent=1)
    if gef:
        bogen(nr, gef)


def bogen(nr, gef):
    from PIL import Image, ImageDraw
    T, per = 300, 3
    rows = (len(gef) + per - 1) // per
    sheet = Image.new('RGB', (per * T, rows * (T + 22)), 'white')
    d = ImageDraw.Draw(sheet)
    for i, it in enumerate(gef):
        im = Image.open(os.path.join(KAND, it['datei'])).convert('RGB')
        im.thumbnail((T - 8, T - 8))
        x, y = (i % per) * T, (i // per) * (T + 22)
        sheet.paste(im, (x + 4 + (T - 8 - im.width) // 2, y + 4))
        d.text((x + 6, y + T + 2), '%d  %s' % (i, it['titel'][5:40]), fill='black')
    ziel = os.path.join(KAND, '%d-bogen.png' % nr)
    sheet.save(ziel)
    print('Kontaktbogen:', ziel)


def cmd_waehle(args):
    nr, k = int(args[0]), int(args[1])
    gef = json.load(open(os.path.join(KAND, '%d.json' % nr)))
    it = dict(gef[k])
    src = os.path.join(KAND, it['datei'])
    it['datei'] = str(nr) + os.path.splitext(src)[1]
    os.makedirs(BILDER, exist_ok=True)
    shutil.copy(src, os.path.join(BILDER, it['datei']))
    bl = lade()
    b = next((b for b in bl if b['nr'] == nr), None)
    if not b:
        sys.exit('Blatt %d steht noch nicht in blaetter.json - erst Text eintragen' % nr)
    b['bild'] = {key: it[key] for key in ('datei', 'titel', 'lizenz', 'credit', 'seite')}
    speichere(bl)
    print('Blatt %d: %s' % (nr, it['titel']))


def cmd_hole(args):
    os.makedirs(BILDER, exist_ok=True)
    for b in auswahl(lade(), args):
        bild = b.get('bild') or {}
        ziel = os.path.join(BILDER, bild.get('datei', ''))
        if not bild.get('titel') or os.path.exists(ziel):
            continue
        if bild.get('zugeschnitten'):
            # frame / passe-partout cut away by hand - a fresh download would bring the frame back
            print(b['nr'], 'von Hand zugeschnitten, nicht neu holbar:', bild['zugeschnitten'])
            continue
        d = api({'action': 'query', 'titles': bild['titel'], 'prop': 'imageinfo',
                 'iiprop': 'url', 'iiurlwidth': 1400})
        page = next(iter(d['query']['pages'].values()))
        ii = (page.get('imageinfo') or [{}])[0]
        if not ii:
            print(b['nr'], 'nicht mehr auf Commons:', bild['titel'])
            continue
        open(ziel, 'wb').write(laden(ii.get('thumburl') or ii['url']))
        print(b['nr'], 'geholt')


# ---------------------------------------------------------------- sheets

def groesse(b):
    if b.get('groesse'):
        return b['groesse']
    n = len(re.sub(r'<[^>]+>', ' ', b['text']))
    return 'kurz' if n < 46 else 'mittel' if n < 100 else 'lang'


def nachweis(bild):
    wer = (bild.get('credit') or '').replace('Unknown authorUnknown author', 'unbekannt').strip() or 'unbekannt'
    lic = bild.get('lizenz') or ''
    lic = 'gemeinfrei' if 'public domain' in lic.lower() else lic
    return 'Bild: %s · %s · Wikimedia Commons' % (wer, lic)


def html(bl):
    teile = []
    for b in bl:
        bild = b.get('bild') or {}
        teile.append('''
    <section class="blatt %s" data-nr="%s">
        <div class="spruch">%s</div>
        <div class="bild">%s</div>
        %s%s
        <div class="bildquelle">%s</div>
    </section>''' % (groesse(b), nn(b['nr']), b['text'],
                     '<img src="bilder/%s" alt="">' % bild['datei'] if bild.get('datei') else '',
                     '<div class="quelle">%s</div>' % b['wer'] if b.get('wer') else '',
                     '<div class="rolle">%s</div>' % b['rolle'] if b.get('rolle') else '',
                     nachweis(bild) if bild.get('titel') else ''))
    css = open(os.path.join(HIER, 'blatt.css'), encoding='utf-8').read()
    return '''<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Gedanke der Woche</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
<style>
%s</style>
</head>
<body>%s
</body>
</html>
''' % (css, ''.join(teile))


def webp(nrs):
    for nr in nrs:
        png = os.path.join(OUT, 'png', nn(nr) + '.png')
        for ordner, q, w in (('gross', 78, 1200), ('thumb', 72, 200)):
            os.makedirs(os.path.join(OUT, ordner), exist_ok=True)
            subprocess.run(['cwebp', '-quiet', '-q', str(q), '-resize', str(w), '0', png,
                            '-o', os.path.join(OUT, ordner, nn(nr) + '.webp')], check=True)


def cmd_baue(args):
    sel = auswahl(lade(), args)
    cmd_hole([str(b['nr']) for b in sel])
    fehlt = [b['nr'] for b in sel if (b.get('bild') or {}).get('datei')
             and not os.path.exists(os.path.join(BILDER, b['bild']['datei']))]
    if fehlt:
        sys.exit('Bild fehlt für: ' + ', '.join(map(str, fehlt)))
    datei = os.path.join(ARBEIT, 'blaetter.html')
    io.open(datei, 'w', encoding='utf-8').write(html(sel))
    for f in glob.glob(os.path.join(OUT, 'png', '*.png')):
        os.remove(f)
    r = subprocess.run(['node', os.path.join(HIER, 'render.mjs'), datei, OUT])
    if r.returncode:
        sys.exit('Render-Prüfung fehlgeschlagen (Schrift, Bild oder Satz läuft ins Bild) - siehe oben')
    webp([b['nr'] for b in sel])
    print('%d Blätter -> %s (PDF, png/, gross/, thumb/)' % (len(sel), OUT))


def cmd_aus_pdf(args):
    """Doc's own sheets come from his PowerPoint: export it as PDF first (PowerPoint may not write
    into a sandbox temp folder - export to the Desktop), then every page becomes one number."""
    pdf, erste = args[0], int(args[1])
    tmp = os.path.join(OUT, 'pdfseiten')
    shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(tmp)
    subprocess.run(['pdftoppm', '-png', '-r', '160', pdf, os.path.join(tmp, 'p')], check=True)
    os.makedirs(os.path.join(OUT, 'png'), exist_ok=True)
    nrs = []
    for i, f in enumerate(sorted(glob.glob(os.path.join(tmp, 'p-*.png')))):
        shutil.move(f, os.path.join(OUT, 'png', nn(erste + i) + '.png'))
        nrs.append(erste + i)
    webp(nrs)
    print('Seiten -> Nummern %s bis %s' % (nn(nrs[0]), nn(nrs[-1])))


def cmd_einbau(args):
    if not args:
        sys.exit('einbau braucht die Nummern ausdrücklich')
    nrs = [int(a) for a in args]
    ziel = os.path.join(OUT, 'r2')
    shutil.rmtree(ziel, ignore_errors=True)
    os.makedirs(ziel)
    for nr in nrs:
        for ordner in ('gross', 'thumb'):
            if not os.path.exists(os.path.join(OUT, ordner, nn(nr) + '.webp')):
                sys.exit('%s/%s.webp fehlt - erst baue %d' % (ordner, nn(nr), nr))
        shutil.copy(os.path.join(OUT, 'thumb', nn(nr) + '.webp'), THUMBS)
        shutil.copy(os.path.join(OUT, 'gross', nn(nr) + '.webp'), ziel)
    subprocess.run(['node', os.path.join(REPO, 'tools', 'gdw_publish.mjs'), ziel], check=True)
    print('Vorschau in HTML/svp/gdw/, groß in R2. Woche festlegen: HTML/svp/gdw.json ("bild": "%s")' % nn(nrs[0]))


def cmd_status(_):
    bl = {b['nr']: b for b in lade()}
    thumbs = {int(os.path.basename(f)[:-5]) for f in glob.glob(os.path.join(THUMBS, '*.webp'))}
    wochen = {}
    for f in glob.glob(os.path.join(REPO, 'HTML', 'svp', 'gdw*.json')):
        satz = os.path.basename(f)[:-5]
        for sw, e in json.load(open(f, encoding='utf-8')).items():
            wochen.setdefault(int(e['bild']), []).append('%s SW%s' % (satz, sw))
    for nr in sorted(set(bl) | thumbs):
        b = bl.get(nr)
        text = re.sub(r'<[^>]+>', ' ', b['text'])[:48] if b else '(PowerPoint)'
        print('%3s  %-48s  %-7s %s' % (nn(nr), text, 'Vorschau' if nr in thumbs else '-',
                                        ', '.join(wochen.get(nr, [])) or 'in keiner Woche'))


BEFEHLE = {'status': cmd_status, 'suche': cmd_suche, 'waehle': cmd_waehle, 'hole': cmd_hole,
           'baue': cmd_baue, 'einbau': cmd_einbau, 'aus-pdf': cmd_aus_pdf}

if __name__ == '__main__':
    sys.stdout.reconfigure(line_buffering=True)   # keep our lines in order with node's output
    if len(sys.argv) < 2 or sys.argv[1] not in BEFEHLE:
        sys.exit(__doc__)
    BEFEHLE[sys.argv[1]](sys.argv[2:])
