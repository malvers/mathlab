#!/usr/bin/env python3
"""Sayings for the diary (HTML/tagebuch/): text, author and source of every sheet in blaetter.json.

    python3 tools/gdw/sprueche.py        -> HTML/tagebuch/sprueche.json

blaetter.json stays the only source; run this again after a new sheet. Red words (<b>) become <em> - the diary
colours <em> in the red of the sheets; line breaks (<br>) stay. Sheets without a text are left out."""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'blaetter.json')
DST = os.path.join(HERE, '..', '..', 'HTML', 'tagebuch', 'sprueche.json')


def clean(text):
    text = re.sub(r'<b>(.*?)</b>', r'<em>\1</em>', text, flags=re.S)
    text = re.sub(r'<br\s*/?>', '<br>', text)
    return re.sub(r'<(?!/?em>|br>)[^>]*>', '', text).strip()


def main():
    out = []
    for b in json.load(open(SRC, encoding='utf-8')):
        if not (b.get('text') or '').strip():
            continue
        out.append({'nr': b['nr'], 'text': clean(b['text']), 'wer': (b.get('wer') or '').strip(), 'rolle': (b.get('rolle') or '').strip()})
    out.sort(key=lambda x: x['nr'])
    with open(DST, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('%d Sprüche -> %s' % (len(out), os.path.normpath(DST)))


if __name__ == '__main__':
    main()
