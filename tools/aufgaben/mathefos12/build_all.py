#!/usr/bin/env python3
"""Build every FO-12 Mathe sheet in this folder, hook each into its plan row
and rebuild the plan search index.

    python3 tools/aufgaben/mathefos12/build_all.py          # build + wire + index
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
PLAN = 'HTML/svp/mathe/mathefos12.html'
QUIZ = os.path.join(ROOT, 'tools', 'aufgaben', 'quiz.py')

check_only = '--check' in sys.argv
specs = sorted(glob.glob(os.path.join(HERE, 'w[0-9][0-9]-*.py')))
built, failed = [], []
for spec in specs:
    src = open(spec, encoding='utf-8').read()
    m = re.search(r"fos12\(\s*nr=(\d+),\s*slug='([^']+)'", src)
    if not m:
        failed.append((spec, 'kein fos12(nr=…, slug=…) gefunden'))
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
        subprocess.run([sys.executable, QUIZ, 'wire', PLAN, str(nr),
                        '../../mathetestfos12-%s.html' % slug], check=True, cwd=ROOT)
    subprocess.run(['node', 'tools/build-plan-suchindex.mjs'], check=True, cwd=ROOT)
print('\n%d Sätze gebaut%s' % (len(built), '' if check_only else ', verdrahtet, Suchindex neu'))
