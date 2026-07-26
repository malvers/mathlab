#!/usr/bin/env python3
# Runs the full VSB pipeline: master SVG -> print files, wood STLs, stitch DST,
# derived assets. Called by serve-8765.py after every save (or manually).
# Writes progress to VSB_TMP/build.log and a lock file while running.
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
PY = os.path.join(HERE, '.venv', 'bin', 'python')
TMP = os.environ.setdefault('VSB_TMP', '/tmp/vsb-pipeline')
os.makedirs(TMP, exist_ok=True)
LOCK = os.path.join(TMP, 'build.lock')
LOG = os.path.join(TMP, 'build.log')

STEPS = [
    ('raster', 'vsb_pipeline.py'),
    ('holz', 'vsb_stl.py'),
    ('stick', 'vsb_stick.py'),
    ('assets', 'vsb_assets.py'),
]

if os.path.exists(LOCK):
    # a run is already active; the server prevents this, but be safe
    print('locked')
    sys.exit(1)

open(LOCK, 'w').write(str(os.getpid()))
log = open(LOG, 'w')
try:
    t0 = time.time()
    for name, script in STEPS:
        log.write(f'== {name} ==\n'); log.flush()
        r = subprocess.run([PY, os.path.join(HERE, script)],
                           stdout=log, stderr=subprocess.STDOUT, env=os.environ)
        if r.returncode != 0:
            log.write(f'FEHLER in {name} (exit {r.returncode})\n'); log.flush()
            sys.exit(r.returncode)
    log.write(f'FERTIG in {time.time() - t0:.0f}s\n'); log.flush()
finally:
    log.close()
    os.remove(LOCK)
