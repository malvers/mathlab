#!/usr/bin/env python3
"""Publish Doc's Kontakt app (HTML/kontakt/) as its own installable app: https://doc-kontakt.pages.dev/

Why: Chrome on Android installs only one app per address (origin) - docalvers.de already has Fahrplan + VGP,
so Chrome answers "already installed" for docalvers.de/kontakt/ (seen again 29.10.2026 on the Pixel). Same way
out as tools/grateful_pages.py: an address of its own on Cloudflare Pages (project doc-kontakt). The source stays
in forloop: HTML/kontakt/ and the shared Kontakt files in svp/ (style, core, login, crypto); this script only
copies, rewrites the relative paths and uploads. docalvers.de/kontakt/ stays as it is (the Mac, VGP's row).

    python3 tools/kontakt_pages.py               # mirror into a temp folder and deploy to Cloudflare Pages
    python3 tools/kontakt_pages.py --dir PATH    # mirror only (e.g. to test locally)

Not updated by a git push: after a change to the Kontakt files run this script once more.
wrangler@3 on purpose: wrangler 4 now turns "pages deploy" into a Workers deploy that first wants a workers.dev
subdomain for the account. No messages are ever copied - they live in Supabase, sealed end-to-end.
"""
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'HTML'))
PROJECT = 'doc-kontakt'

# forloop path (relative to HTML/) -> path in the mirror
FILES = {
    'kontakt/index.html': 'index.html',
    'kontakt/sw.js': 'sw.js',
    'kontakt/manifest.json': 'manifest.json',
    'kontakt/icon-192.png': 'icon-192.png',
    'kontakt/icon-512.png': 'icon-512.png',
    'kontakt/apple-touch-icon.png': 'apple-touch-icon.png',
    'kontakt/badge-96.png': 'badge-96.png',
    'kontakt/kontakt-k.mp3': 'kontakt-k.mp3',          # notification sound: Morse K ("bitte kommen"), Doc sets it on the phone
    'svp/sprechstunde.css': 'svp/sprechstunde.css',
    'svp/sprechstunde-bg.svg': 'svp/sprechstunde-bg.svg',    # sprechstunde.css loads it next to itself
    'svp/sprechstunde-core.js': 'svp/sprechstunde-core.js',
    'svp/svp-auth.js': 'svp/svp-auth.js',
    'svp/svp-crypto.js': 'svp/svp-crypto.js',
}

# the page sits one level deeper in forloop (HTML/kontakt/) than in the mirror (its root)
REWRITE = {
    'index.html': [('../svp/', 'svp/')],
}

README = """# Kontakt

Doc Alvers' Kontakt app (answers to the red telephone on meinplan) as an installable app: https://doc-kontakt.pages.dev/

Generated - do not edit here. Source: `HTML/kontakt/` in the forloop repo, mirrored by
`tools/kontakt_pages.py`. The messages live in Supabase, sealed end-to-end, never in this folder.
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
