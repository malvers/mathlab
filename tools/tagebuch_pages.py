#!/usr/bin/env python3
"""Publish the diary book (HTML/tagebuch/) as its own installable app: https://doc-tagebuch.pages.dev/

Why: like the other Doc apps (tools/grateful_pages.py, kalender_pages.py, todo_pages.py) the book gets an address of its
own on Cloudflare Pages (project doc-tagebuch), so Chrome on the Pixel installs it as a real app (WebAPK) that opens in
full screen instead of a browser tab. The source stays in forloop: HTML/tagebuch/ and the shared SVP files (login, colour
tokens, thought of the week); this script only copies, rewrites the relative paths, checks and uploads.

    python3 tools/tagebuch_pages.py               # mirror into a temp folder, check it and deploy to Cloudflare Pages
    python3 tools/tagebuch_pages.py --dry         # mirror into a temp folder and check it - no upload
    python3 tools/tagebuch_pages.py --dir PATH    # mirror only (local test: python3 -m http.server -d PATH)

Once, before the very first deploy:  npx -y wrangler@3 pages project create doc-tagebuch --production-branch main

The app's manifest is written here (APP_MANIFEST), not copied: HTML/tagebuch/ may carry a manifest of its own for
docalvers.de/tagebuch/, the app on its own address has its own name and display mode. In the mirror the page's
<link rel="manifest"> is pointed at it (and added, with theme colour and touch icon, when the page has none).
Every local file the page refers to must be in the mirror - otherwise the script stops before uploading.

wrangler@3 on purpose: wrangler 4 now turns "pages deploy" into a Workers deploy that first wants a workers.dev
subdomain for the account. No diary text is ever copied - it lives in Supabase (tables grateful and grateful_buch,
Doc's account only).
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'HTML'))
PROJECT = 'doc-tagebuch'

# forloop path (relative to HTML/) -> path in the mirror
FILES = {
    'tagebuch/index.html': 'index.html',
    'tagebuch/sprueche.json': 'sprueche.json',            # thought of the day, the sheets with an author
    'tagebuch/sprueche-tag.json': 'sprueche-tag.json',    # thought of the day, one for every day of the year
    'tagebuch/sondertage.js': 'sondertage.js',            # the fixed special days (Oct 31, Dec 31), imported only then
    'tagebuch/buehne.js': 'buehne.js',                    # Christmas Day: the theatre round the oratorio's finale, imported only then
    'tagebuch/persoenlichkeiten.json': 'persoenlichkeiten.json',   # the personalities of the days
    'svp/svp-auth.js': 'svp/svp-auth.js',
    'svp/svp-gate.js': 'svp/svp-gate.js',
    'svp/svp-tokens.css': 'svp/svp-tokens.css',          # the colours of Hell and Grau
    'svp/gdw.json': 'svp/gdw.json',                      # thought of the week (school weeks)
    'svp/gdw-weisheiten.json': 'svp/gdw-weisheiten.json',
    'js/natur-bild.js': 'js/natur-bild.js',              # svp-gate.js loads it from ../js/
    'js/solita-listen.js': 'js/solita-listen.js',        # dictation
}

# whole folders (relative to HTML/) -> folder in the mirror; hidden files are skipped
DIRS = {
    'tagebuch/img': 'img',            # desk, Böcklin painting
    'tagebuch/icons': 'icons',        # the app's own icon (book with ribbon), see tagebuch/icons/icon.svg
    'tagebuch/sondertage': 'sondertage',   # the scenes of the special days, one small module each (sondertage.js loads them)
    'tagebuch/audio': 'audio',        # music boxes (birthday, farewell lullaby)
    'svp/gdw': 'svp/gdw',             # thumbnails of the thought of the week - fallback when R2 does not answer
}

# the page sits one level deeper in forloop (HTML/tagebuch/) than in the mirror (its root);
# (old, new, required): a required pair that no longer matches stops the script
REWRITE = {
    'index.html': [('../svp/', 'svp/', True), ('../js/', 'js/', True),
                   ('../resources/favicon.svg', 'icons/favicon.svg', False)],   # the house lambda -> the app's own tab icon
}

THEME = '#08142a'      # --bg of svp/svp-tokens.css, like the other Doc apps
APP_MANIFEST = {
    'id': '/tagebuch/',
    'name': 'DocTagebuch',
    'short_name': 'DocTagebuch',
    'description': 'Das 3-Minuten-Tagebuch – morgens danken, abends zurückblicken.',
    'lang': 'de',
    'start_url': './',
    'scope': './',
    'display': 'fullscreen',          # Doc, 24.11.2026: full screen like an app (falls back to standalone by itself)
    'background_color': '#1c0b05',    # the desk behind the book, so the splash runs into the page without a flash
    'theme_color': THEME,
    'icons': [
        {'src': 'icons/app-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
        {'src': 'icons/app-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'},
        {'src': 'icons/app-512-maskable.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
    ],
}

README = """# DocTagebuch

Doc Alvers' diary book ("Grateful - das 3-Minuten-Tagebuch") as an installable app: https://doc-tagebuch.pages.dev/

Generated - do not edit here. Source: `HTML/tagebuch/` in the forloop repo, mirrored by
`tools/tagebuch_pages.py`. The entries live in Supabase (only Doc's account may read them), never in this repo.
"""


def app_head(text):
    """Point the page at the app's manifest; add theme colour and touch icon if the page has none."""
    tag = re.search(r'<link\b[^>]*\brel=["\']manifest["\'][^>]*>', text)
    if tag:
        new = re.sub(r'\bhref=["\'][^"\']*["\']', 'href="manifest.webmanifest"', tag.group(0))
        text = text[:tag.start()] + new + text[tag.end():]
        add = []
    else:
        add = ['<link rel="manifest" href="manifest.webmanifest">']
    if not re.search(r'<meta\b[^>]*\bname=["\']theme-color["\']', text):
        add.append(f'<meta name="theme-color" content="{THEME}">')
    if not re.search(r'<link\b[^>]*\brel=["\']apple-touch-icon["\']', text):
        add.append('<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">')
    if add:
        end = text.find('</title>')
        if end < 0:
            sys.exit('index.html: no </title> - cannot place the app tags')
        end += len('</title>')
        text = text[:end] + '\n<!-- app (tools/tagebuch_pages.py) -->\n' + '\n'.join(add) + text[end:]
    return text


# local files a page or style sheet refers to: attributes, url(...), and quoted paths in scripts
REF = re.compile(r'''(?:\b(?:src|href)=["']|url\(["']?|["'`])((?:\.{1,2}/|/)?[\w\-./]+\.(?:html|json|js|css|webmanifest|webp|png|jpe?g|svg|gif|mp3|woff2?))(?=["'`)?#])''')


def check(target):
    """Every local file the mirrored pages and style sheets name must exist in the mirror - no 404 in the app."""
    missing = []
    for dirpath, _, names in os.walk(target):
        for name in names:
            if not name.endswith(('.html', '.css')):
                continue
            path = os.path.join(dirpath, name)
            text = open(path, encoding='utf-8').read()
            for ref in sorted(set(REF.findall(text))):
                if '//' in ref:
                    continue
                base = target if ref.startswith('/') else dirpath
                full = os.path.normpath(os.path.join(base, ref.lstrip('/')))
                rel = os.path.relpath(path, target)
                if not full.startswith(os.path.normpath(target) + os.sep):
                    missing.append(f'{rel}: "{ref}" points outside the app')
                elif not os.path.isfile(full):
                    missing.append(f'{rel}: "{ref}" is not in the mirror')
    manifest = json.load(open(os.path.join(target, 'manifest.webmanifest'), encoding='utf-8'))
    for icon in manifest['icons']:
        if not os.path.isfile(os.path.join(target, icon['src'])):
            missing.append(f'manifest.webmanifest: "{icon["src"]}" is not in the mirror')
    if missing:
        sys.exit('mirror incomplete - add to FILES/DIRS or REWRITE:\n  ' + '\n  '.join(missing))
    print('check: every local file the page names is in the mirror')


def mirror(target):
    os.makedirs(target, exist_ok=True)
    for src, dst in FILES.items():
        s, d = os.path.join(ROOT, src), os.path.join(target, dst)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        if dst in REWRITE:
            text = open(s, encoding='utf-8').read()
            for old, new, required in REWRITE[dst]:
                if old not in text and required:
                    sys.exit(f'{src}: expected "{old}" - paths changed, update REWRITE')
                text = text.replace(old, new)
            if dst == 'index.html':
                text = app_head(text)
            open(d, 'w', encoding='utf-8').write(text)
        else:
            shutil.copyfile(s, d)
        print('  ', dst)
    for src, dst in DIRS.items():
        s = os.path.join(ROOT, src)
        names = sorted(n for n in os.listdir(s) if not n.startswith('.') and os.path.isfile(os.path.join(s, n)))
        os.makedirs(os.path.join(target, dst), exist_ok=True)
        for n in names:
            shutil.copyfile(os.path.join(s, n), os.path.join(target, dst, n))
        print('  ', dst + '/', f'({len(names)} files)')
    with open(os.path.join(target, 'manifest.webmanifest'), 'w', encoding='utf-8') as f:
        json.dump(APP_MANIFEST, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('   manifest.webmanifest (APP_MANIFEST)')
    open(os.path.join(target, '.nojekyll'), 'w').close()
    open(os.path.join(target, 'README.md'), 'w', encoding='utf-8').write(README)
    print('->', target)
    check(target)


def size(target):
    total = sum(os.path.getsize(os.path.join(d, n)) for d, _, ns in os.walk(target) for n in ns)
    count = sum(len(ns) for _, _, ns in os.walk(target))
    return f'{count} files, {total / 1e6:.1f} MB'


def main():
    if len(sys.argv) > 2 and sys.argv[1] == '--dir':
        target = os.path.expanduser(sys.argv[2])
        mirror(target)
        print(size(target))
        return
    with tempfile.TemporaryDirectory() as tmp:
        site = os.path.join(tmp, 'site')
        mirror(site)
        print(size(site))
        if '--dry' in sys.argv[1:]:
            print(f'dry run - nothing uploaded (would go to https://{PROJECT}.pages.dev/)')
            return
        # run from tmp: wrangler must not pick up a wrangler config of the current folder
        subprocess.run(['npx', '-y', 'wrangler@3', 'pages', 'deploy', site, '--project-name', PROJECT,
                        '--branch', 'main', '--commit-dirty=true'], cwd=tmp, check=True)
    print(f'live: https://{PROJECT}.pages.dev/')


if __name__ == '__main__':
    main()
