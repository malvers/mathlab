#!/usr/bin/env python3
"""Build every Leistungskurs-12 sheet in this folder, hook each into svp/mathe/mathegy12lk.html and rebuild the
plan search index. The builder is shared with Leistungskurs 11 (tools/aufgaben/mathegy11lk/build_all.py);
this file only hands it this folder.

    python3 tools/aufgaben/mathegy12lk/build_all.py           # build + wire + index
    python3 tools/aufgaben/mathegy12lk/build_all.py --check   # build only, touch nothing else
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.exit(subprocess.call([sys.executable, os.path.join(HERE, '..', 'mathegy11lk', 'build_all.py'), HERE] + sys.argv[1:]))
