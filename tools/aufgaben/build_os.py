#!/usr/bin/env python3
"""Build every Oberschule Mathe sheet of one class and hook each into its plan row.

    python3 tools/aufgaben/build_os.py 7            # build + wire into HTML/svp/mathe/mathe7.html
    python3 tools/aufgaben/build_os.py 7 --check    # build only, touch no plan
    python3 tools/aufgaben/build_os.py 7 --index    # ... and rebuild the plan search index too

The specs live in tools/aufgaben/mathe<k>/wNN-<slug>.py; each builds
HTML/mathetestos<k>-<slug>.html via quiz.py (os6 … os10). The row number and slug are
read from its os<k>(nr=…, slug='…') call, so a sheet is wired into the row it declares -
the file name is not trusted. The search index (plan-suchindex.json) is a shared file:
while several classes are built in parallel, only the coordinator passes --index.
"""
import glob
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
QUIZ = os.path.join(HERE, 'quiz.py')

args = [a for a in sys.argv[1:] if not a.startswith('-')]
if not args or not args[0].isdigit():
    raise SystemExit(__doc__)
klasse = int(args[0])
check_only = '--check' in sys.argv
folder = os.path.join(HERE, 'mathe%d' % klasse)
specs = sorted(glob.glob(os.path.join(folder, 'w[0-9][0-9]-*.py')))
built, failed = [], []
for spec in specs:
    src = open(spec, encoding='utf-8').read()
    m = re.search(r"os%d\(\s*nr=(\d+),\s*slug='([^']+)'" % klasse, src)
    if not m:
        failed.append((spec, 'kein os%d(nr=…, slug=…) gefunden' % klasse))
        continue
    nr, slug = int(m.group(1)), m.group(2)
    r = subprocess.run([sys.executable, '-W', 'error::SyntaxWarning', spec],
                       capture_output=True, text=True, cwd=ROOT)
    if r.returncode != 0 or not r.stdout.startswith('OK'):
        failed.append((spec, (r.stderr or r.stdout).strip()[-600:]))
        continue
    print(r.stdout.strip())
    built.append((nr, slug))

if failed:
    print('\n%d Satz/Sätze scheitern:' % len(failed))
    for spec, msg in failed:
        print('--', os.path.basename(spec)); print(msg)
    sys.exit(1)

if not check_only:
    for nr, slug in sorted(built):
        subprocess.run([sys.executable, QUIZ, 'wire', 'HTML/svp/mathe/mathe%d.html' % klasse, str(nr),
                        '../../mathetestos%d-%s.html' % (klasse, slug)], check=True, cwd=ROOT)
    if '--index' in sys.argv:
        subprocess.run(['node', 'tools/build-plan-suchindex.mjs'], check=True, cwd=ROOT)
print('\n%d Sätze gebaut%s' % (len(built), '' if check_only else ', verdrahtet'))
