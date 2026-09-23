#!/usr/bin/env python3
"""Build every FO Mathe sheet in a folder (default: this one), hook each into its plan row
and rebuild the plan search index.

    python3 tools/aufgaben/mathefos12/build_all.py [<ordner>]   # build + wire + index
    python3 tools/aufgaben/mathefos12/build_all.py --check  # build only, touch nothing else

Each wNN-<slug>.py builds HTML/mathetestfos12-<slug>.html via tools/aufgaben/quiz.py;
the row number and slug are read from its fos12(nr=…, slug='…') call, so a
sheet is wired into the row it declares - the file name is not trusted.
"""
import glob
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
QUIZ = os.path.join(ROOT, 'tools', 'aufgaben', 'quiz.py')

check_only = '--check' in sys.argv
args = [a for a in sys.argv[1:] if not a.startswith('-')]
folder = os.path.abspath(args[0]) if args else HERE
specs = sorted(glob.glob(os.path.join(folder, 'w[0-9][0-9]-*.py')))
built, failed = [], []
for spec in specs:
    src = open(spec, encoding='utf-8').read()
    m = re.search(r"fos(11|12)\(\s*nr=(\d+),\s*slug='([^']+)'", src)
    if not m:
        failed.append((spec, 'kein fos11/fos12(nr=…, slug=…) gefunden'))
        continue
    klasse, nr, slug = int(m.group(1)), int(m.group(2)), m.group(3)
    r = subprocess.run([sys.executable, '-W', 'error::SyntaxWarning', spec],
                       capture_output=True, text=True, cwd=ROOT)
    if r.returncode != 0 or not r.stdout.startswith('OK'):
        failed.append((spec, (r.stderr or r.stdout).strip()[-600:]))
        continue
    print(r.stdout.strip())
    built.append((klasse, nr, slug))

if failed:
    print('\n%d Satz/Sätze scheitern:' % len(failed))
    for spec, msg in failed:
        print('--', os.path.basename(spec)); print(msg)
    sys.exit(1)

if not check_only:
    for klasse, nr, slug in sorted(built):
        subprocess.run([sys.executable, QUIZ, 'wire',
                        'HTML/svp/mathe/mathefos%d.html' % klasse, str(nr),
                        '../../mathetestfos%d-%s.html' % (klasse, slug)], check=True, cwd=ROOT)
    subprocess.run(['node', 'tools/build-plan-suchindex.mjs'], check=True, cwd=ROOT)
print('\n%d Sätze gebaut%s' % (len(built), '' if check_only else ', verdrahtet, Suchindex neu'))
