#!/usr/bin/env python3
"""Sets the countdown length of the focus-timer slide.

WARNING: only safe on a deck WITHOUT the countdown numerals. Those are baked per duration -
this changes the wheel alone and would leave the numbers lying. For a normal deck, rebuild
with build.sh instead.

    python3 set_timer.py ~/Desktop/focus-timer.pptx 25

PowerPoint's Duration box on the Animations tab stops at 59 seconds, so the ring's length
cannot be changed in the UI. It is a plain number in the slide XML, which is what this edits:
the wheel animation's duration, and the delay of the <p:set> that hides the ring at the end.
"""
import shutil, sys, zipfile
from pathlib import Path
from lxml import etree

P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
q = lambda tag: '{%s}%s' % (P, tag)


def set_minutes(pptx_path, minutes):
    ms = int(round(minutes * 60_000))
    src = Path(pptx_path)
    with zipfile.ZipFile(src) as zin:
        parts = {i.filename: zin.read(i.filename) for i in zin.infolist()}
    root = etree.fromstring(parts['ppt/slides/slide1.xml'])

    eff = root.find('.//' + q('animEffect'))
    if eff is None or 'wheel' not in (eff.get('filter') or ''):
        raise SystemExit('no wheel animation found - is this the focus-timer slide?')
    ctn = eff.find('.//' + q('cTn'))
    was = ctn.get('dur')
    ctn.set('dur', str(ms))

    # the paired <p:set> hides the ring one millisecond before the sweep ends
    for cond in root.iter(q('cond')):
        if cond.get('delay') not in (None, 'indefinite') and cond.get('delay') == str(int(was) - 1):
            cond.set('delay', str(ms - 1))

    parts['ppt/slides/slide1.xml'] = etree.tostring(root, xml_declaration=True,
                                                    encoding='UTF-8', standalone=True)
    tmp = src.with_suffix('.tmp.pptx')
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for name, blob in parts.items():
            zout.writestr(name, blob)
    shutil.move(tmp, src)
    return int(was) / 60000, minutes


if __name__ == '__main__':
    old, new = set_minutes(sys.argv[1], float(sys.argv[2]))
    print('timer: %g min -> %g min' % (old, new))
