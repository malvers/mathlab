#!/usr/bin/env python3
"""Publish the grateful page (HTML/grateful/) as its own installable app: https://doc-grateful.pages.dev/

Why: Chrome on Android installs only one app per address (origin). docalvers.de already has Fahrplan + VGP,
malvers.github.io has DOCPAD - on both, Chrome answers "already installed" and then "app could not be opened"
(measured 04.10.2026 on the Pixel 8a: the same files on a fresh address offer "Install" at once). So the app
gets an address of its own on Cloudflare Pages (project doc-grateful). The source stays in forloop:
HTML/grateful/ and the shared SVP login (svp/svp-auth.js, svp/svp-gate.js); this script only copies, rewrites
the relative paths and uploads.

    python3 tools/grateful_pages.py               # mirror into a temp folder and deploy to Cloudflare Pages
    python3 tools/grateful_pages.py --dir PATH    # mirror only (e.g. ~/IdeaProjects/grateful-pages = malvers/grateful)

wrangler@3 on purpose: wrangler 4 now turns "pages deploy" into a Workers deploy that first wants a workers.dev
subdomain for the account. No journal data is ever copied - it lives in Supabase (table grateful, Doc's account only).
"""
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'HTML'))
PROJECT = 'doc-grateful'

# forloop path (relative to HTML/) -> path in the mirror
FILES = {
    'grateful/index.html': 'index.html',
    'grateful/manifest.webmanifest': 'manifest.webmanifest',
    'svp/svp-auth.js': 'svp/svp-auth.js',
    'svp/svp-gate.js': 'svp/svp-gate.js',
    'js/natur-bild.js': 'js/natur-bild.js',          # svp-gate.js loads it from ../js/
    'js/solita-listen.js': 'js/solita-listen.js',    # dictation
    'resources/favicon.svg': 'icons/favicon.svg',
    'resources/apple-touch-icon.png': 'icons/apple-touch-icon.png',
    'resources/app-192.png': 'icons/app-192.png',
    'resources/app-512.png': 'icons/app-512.png',
    'resources/app-512-maskable.png': 'icons/app-512-maskable.png',
}

# the page sits one level deeper in forloop (HTML/grateful/) than in the mirror (its root)
REWRITE = {
    'index.html': [('../svp/', 'svp/'), ('../js/', 'js/'), ('../resources/', 'icons/')],
    'manifest.webmanifest': [('../resources/', 'icons/')],
}

README = """# I'm grateful for

Doc Alvers' gratitude journal as an installable app: https://doc-grateful.pages.dev/

Generated - do not edit here. Source: `HTML/grateful/` in the forloop repo, mirrored by
`tools/grateful_pages.py`. The entries live in Supabase (only Doc's account may read them), never in this repo.
"""


def mirror(target):
    os.makedirs(target, exist_ok=True)
    for src, dst in FILES.items():
        s, d = os.path.join(ROOT, src), os.path.join(target, dst)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        if dst in REWRITE:
            text = open(s, encoding='utf-8').read()
            for old, new in REWRITE[dst]:
                if old not in text:
                    sys.exit(f'{src}: expected "{old}" - paths changed, update REWRITE')
                text = text.replace(old, new)
            open(d, 'w', encoding='utf-8').write(text)
        else:
            shutil.copyfile(s, d)
        print('  ', dst)
    open(os.path.join(target, '.nojekyll'), 'w').close()
    open(os.path.join(target, 'README.md'), 'w', encoding='utf-8').write(README)
    print('->', target)


def main():
    if len(sys.argv) > 2 and sys.argv[1] == '--dir':
        mirror(os.path.expanduser(sys.argv[2]))
        return
    with tempfile.TemporaryDirectory() as tmp:
        site = os.path.join(tmp, 'site')
        mirror(site)
        # run from tmp: wrangler must not pick up a wrangler config of the current folder
        subprocess.run(['npx', '-y', 'wrangler@3', 'pages', 'deploy', site, '--project-name', PROJECT,
                        '--branch', 'main', '--commit-dirty=true'], cwd=tmp, check=True)
    print(f'live: https://{PROJECT}.pages.dev/')


if __name__ == '__main__':
    main()
