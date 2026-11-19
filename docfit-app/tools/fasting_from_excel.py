#!/usr/bin/env python3
"""Reads Doc's health workbook and writes the data of the "Fasting" tab (Doc, 19.11.2026: "eine Website aus meinem
Excel ... Ich habe ja mehrere Male gefastet und dort eingetragen" - "DocFit ... eine extra Rubrik ... Fasting").

    python3 tools/fasting_from_excel.py            # workbook path from web/fasting/private/fasts.json
    python3 tools/fasting_from_excel.py BOOK.xlsx

Input:  web/fasting/private/fasts.json - written by hand, private: the workbook path, the layout of its sheets, the
        fasting periods (start, last fasting day, colour, where in the workbook they are marked) and a few dated events.
Output: web/fasting/private/fasting-data.js - `window.FASTING_DATA = {...}`, loaded by web/fasting/index.html as a plain
        script (works from file://, from the APK's assets and over http without fetch()).

Both files hold health data and stay in the gitignored private/ folder - nothing of it in this script.

The workbook is only read: it is opened as a zip archive in read mode, the cached cell values are parsed with the
standard library (no openpyxl needed), nothing is ever written back. Every value keeps its sheet and cell, so each
number on the page can be checked against the workbook.

The sheet layout ("sheets" in fasts.json, read in this order): one entry per sheet - its name, the year its first row
belongs to, which column holds which measure, the column with the "dd.mm." date text (the weekday stands in the column
before it) and the comment column (null if none). Rows are days. Measures: weight, fat, belly, water, organFat,
bodyAge, sys, dia, pulse, sugar, ketones, kcal. Made-up example:

    "sheets": [
      {"name": "Diary", "year": 2000, "date": "B", "comment": "M",
       "columns": {"weight": "C", "fat": "D", "sys": "E", "dia": "F", "pulse": "G"}}
    ]
"""
import datetime as dt
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent / 'web' / 'fasting' / 'private'
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'rel': 'http://schemas.openxmlformats.org/package/2006/relationships'}

# Plausible ranges - anything outside is a typo or a placeholder (the sheets write 0 for "not measured").
# Blood sugar is always read from the mg/dl column: in some sheets that column is headed "mmol/l" although it holds
# mg/dl values, in others it is typed or computed from a typed mmol/l column (x 18.0182).
RANGES = {'weight': (50, 100), 'fat': (5, 40), 'belly': (70, 120), 'water': (40, 70), 'organFat': (1, 20),
          'bodyAge': (15, 80), 'sys': (80, 200), 'dia': (40, 130), 'pulse': (35, 130), 'sugar': (40, 200),
          'ketones': (0, 8), 'kcal': (1, 3000)}
ZERO_OK = {'ketones'}   # a ketone reading of 0.0 is a real measurement
DAYS_BEFORE, DAYS_AFTER = 7, 92   # the window kept around each fast (the page shows up to "+3 Monate")


def col_row(ref):
    m = re.match(r'([A-Z]+)(\d+)$', ref)
    return m.group(1), int(m.group(2))


def load_sheets(config, config_path):
    """The sheet layout from fasts.json as (name, year, columns, date column, comment column) tuples."""
    raw = config.get('sheets')
    if not raw:
        sys.exit(f'{config_path}: no "sheets" - the layout of the workbook\'s sheets is missing '
                 '(see the docstring of tools/fasting_from_excel.py for the expected shape)')
    sheets = []
    for i, s in enumerate(raw):
        missing = [k for k in ('name', 'year', 'columns', 'date') if k not in s]
        unknown = [k for k in s.get('columns', {}) if k not in RANGES]
        if missing or unknown:
            sys.exit(f'{config_path}: sheets[{i}]: ' + '; '.join(
                ([f'missing {", ".join(missing)}'] if missing else []) +
                ([f'unknown measure {", ".join(unknown)}'] if unknown else [])))
        sheets.append((s['name'], int(s['year']), dict(s['columns']), s['date'], s.get('comment')))
    return sheets


def read_workbook(path, wanted):
    """{sheet name: {cell ref: value}} with the cached values of the wanted sheets; errors (#N/A, #VALUE!) are left
    out."""
    with zipfile.ZipFile(path, 'r') as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS):
                shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
        book = ET.fromstring(z.read('xl/workbook.xml'))
        rels = {r.get('Id'): r.get('Target') for r in
                ET.fromstring(z.read('xl/_rels/workbook.xml.rels')).findall('rel:Relationship', NS)}
        out = {}
        for s in book.find('m:sheets', NS):
            name = s.get('name')
            if name not in wanted:
                continue
            target = rels[s.get('{%s}id' % NS['r'])].lstrip('/')
            target = target if target.startswith('xl/') else 'xl/' + target
            cells = {}
            for c in ET.fromstring(z.read(target)).iter('{%s}c' % NS['m']):
                t, v = c.get('t'), c.find('m:v', NS)
                if t == 'inlineStr':
                    val = ''.join(x.text or '' for x in c.iter('{%s}t' % NS['m']))
                elif v is None or t == 'e':
                    continue
                elif t == 's':
                    val = shared[int(v.text)]
                elif t in ('str', 'b'):
                    val = v.text
                else:
                    val = float(v.text)
                cells[c.get('r')] = val
            out[name] = cells
        return out


def number(v):
    if isinstance(v, float):
        return v
    if isinstance(v, str) and re.fullmatch(r'\s*\d+([.,]\d+)?\s*', v):
        return float(v.replace(',', '.'))
    return None


WEEKDAYS = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag']


def sheet_days(name, year, cols, date_col, comment_col, cells, log):
    """Yields (date, row, values, sources, comment) for every row with a readable date.

    The date column holds typed "dd.mm." text, which may have typos (a wrong month, a day too early); the weekday in
    the column before decides: a date that does not fit its weekday or runs backwards is replaced by the day after the
    previous row when that one fits. Gaps (holidays) are fine.
    """
    weekday_col = chr(ord(date_col) - 1)
    rows = sorted({col_row(r)[1] for r in cells})
    prev = None
    for row in rows:
        text = cells.get(f'{date_col}{row}')
        m = re.fullmatch(r'\s*(\d{1,2})\.(\d{1,2})\.?\s*', text) if isinstance(text, str) else None
        if not m:
            continue
        day, month = int(m.group(1)), int(m.group(2))
        y = prev.year if prev else year
        if prev and prev.month == 12 and month == 1:
            y += 1   # a sheet that runs into the next year
        try:
            date = dt.date(y, month, day)
        except ValueError:
            date = None
        wd = str(cells.get(f'{weekday_col}{row}', '')).strip().lower()
        wd = WEEKDAYS.index(wd) if wd in WEEKDAYS else None
        forward = date is not None and (prev is None or 0 < (date - prev).days <= 60)
        fits = date is not None and (wd is None or date.weekday() == wd)
        if prev is not None and not (forward and fits):
            nxt = prev + dt.timedelta(days=1)
            if wd is None or nxt.weekday() == wd or not forward:
                log.append(f'{name}!{date_col}{row}: date text {text!r} -> {nxt:%d.%m.%Y} (weekday / row order)')
                date = nxt
        prev = date
        values, sources = {}, {}
        for key, col in cols.items():
            v = number(cells.get(f'{col}{row}'))
            if v is None:
                continue
            lo, hi = RANGES[key]
            if v == 0 and key not in ZERO_OK:
                continue
            if not lo <= v <= hi:
                log.append(f'{name}!{col}{row}: {key} {v} outside {lo}-{hi}, left out')
                continue
            values[key] = round(v, 2)
            sources[key] = f'{col}{row}'
        comment = cells.get(f'{comment_col}{row}') if comment_col else None
        comment = comment.strip() if isinstance(comment, str) else None
        if comment and (comment in ('-', '') or re.match(r'^\S+\s+=\s', comment) or 'Legende' in comment):
            comment = None   # "-" and the legend rows some sheets have are no comments
        if comment:
            # older sheets may keep body age and organ fat in the comment ("BAT: <n> OF: <n>") instead of columns
            for key, pat in (('bodyAge', r'\bBAT\)?:\s*(\d+)'), ('organFat', r'\bOF:\s*(\d+)')):
                mm = re.search(pat, comment)
                if mm and key not in values:
                    values[key] = float(mm.group(1))
                    sources[key] = f'{comment_col}{row} (Kommentar)'
        yield date, row, values, sources, comment


def edge_value(days, keys, metric, first):
    """Value at day 1 (first=True) or at the last fasting day, else the nearest one within 3 days inside the fast."""
    seq = keys[:4] if first else keys[::-1][:4]
    for i, k in enumerate(seq):
        d = days.get(k)
        if d and metric in d['v']:
            return {'date': k, 'value': d['v'][metric], 'cell': f"{d['sheet']}!{d['c'][metric]}", 'offset': i}
    return None


def main():
    config_path = HERE / 'fasts.json'
    if not config_path.exists():
        sys.exit(f'{config_path} missing - the private config (workbook, sheets, fasts) is written by hand')
    config = json.loads(config_path.read_text(encoding='utf-8'))
    sheets = load_sheets(config, config_path)
    book = sys.argv[1] if len(sys.argv) > 1 else config['workbook']
    cells = read_workbook(book, {s[0] for s in sheets})
    log, all_days = [], {}
    for name, year, cols, date_col, comment_col in sheets:
        if name not in cells:
            log.append(f'sheet {name!r} missing')
            continue
        for date, row, values, sources, comment in sheet_days(name, year, cols, date_col, comment_col,
                                                              cells[name], log):
            key = date.isoformat()
            if key in all_days and len(all_days[key]['v']) >= len(values):
                if values:
                    log.append(f'{key} twice ({all_days[key]["sheet"]} and {name}), kept {all_days[key]["sheet"]}')
                continue
            rec = {'sheet': name, 'row': row, 'v': values, 'c': sources}
            if comment:
                rec['note'] = comment
            all_days[key] = rec

    keep, fasts = set(), []
    for f in config['fasts']:
        start, end = dt.date.fromisoformat(f['start']), dt.date.fromisoformat(f['end'])
        n = (end - start).days + 1
        inside = [(start + dt.timedelta(days=i)).isoformat() for i in range(n)]
        for i in range(-DAYS_BEFORE, n + DAYS_AFTER):
            keep.add((start + dt.timedelta(days=i)).isoformat())
        summary, coverage = {}, {}
        for metric in RANGES:
            have = [k for k in inside if k in all_days and metric in all_days[k]['v']]
            if not have:
                continue
            coverage[metric] = {'days': len(have), 'first': have[0]}
            a, b = edge_value(all_days, inside, metric, True), edge_value(all_days, inside, metric, False)
            entry = {'start': a, 'end': b}
            if metric == 'ketones':
                best = max(have, key=lambda k: all_days[k]['v'][metric])
                d = all_days[best]
                entry['max'] = {'date': best, 'value': d['v'][metric], 'cell': f"{d['sheet']}!{d['c'][metric]}"}
            summary[metric] = entry
        fasts.append({k: f[k] for k in f if k not in ('evidence',)} | {
            'days': n, 'summary': summary, 'coverage': coverage, 'evidence': f.get('evidence', '')})

    days = {k: all_days[k] for k in sorted(keep) if k in all_days}
    out = {'generated': dt.datetime.now().isoformat(timespec='seconds'), 'workbook': Path(book).name,
           'fasts': fasts, 'events': config.get('events', []), 'days': days, 'log': log}
    target = HERE / 'fasting-data.js'
    target.write_text('// PRIVATE - generated by tools/fasting_from_excel.py, never commit\nwindow.FASTING_DATA = '
                      + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    print(f'{target} ({target.stat().st_size // 1024} KB): {len(fasts)} fasts, {len(days)} days')
    for line in log:
        print('  note:', line)


if __name__ == '__main__':
    main()
