# -*- coding: utf-8 -*-
"""Generate Tracker-Ideen.pdf straight from HTML/tracker/tracker-ideen.md.
Keeps the PDF in sync with the notes: edit the .md, re-run this. Pure reportlab (no system deps).
Usage: python3 tools/ideen_pdf.py [output.pdf]"""
import re, html, sys, os

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                HRFlowable, KeepTogether)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MD   = os.path.join(ROOT, 'HTML', 'tracker', 'tracker-ideen.md')
OUT  = sys.argv[1] if len(sys.argv) > 1 else '/tmp/Tracker-Ideen.pdf'

INK   = colors.HexColor('#14223b'); ORANGE= colors.HexColor('#f5c242')
RED   = colors.HexColor('#b02418'); GREEN = colors.HexColor('#799e31')
GREY  = colors.HexColor('#6b7280'); BLUE  = colors.HexColor('#3b6fb0')
CARD  = colors.HexColor('#fbfaf6'); BOX   = colors.HexColor('#f6f3ea')

def inline(s):
    """Markdown inline -> reportlab mini-HTML."""
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', r'<i>\1</i>', s)
    s = re.sub(r'`(.+?)`', r'<font face="Courier">\1</font>', s)
    return s

raw = open(MD, encoding='utf-8').read().splitlines()

# --- title + meta (blockquote) ---
title = next((l[2:].strip() for l in raw if l.startswith('# ')), 'Tracker — Ideen-Sammlung')
meta  = ' · '.join(re.sub(r'\*\*|\*', '', l[1:].strip()) for l in raw if l.startswith('>'))

# --- split into sketch block and idea lines ---
first_idea = next(i for i, l in enumerate(raw) if re.match(r'^\d+\.\s', l))
sketch_lines = []
in_sketch = False
for l in raw[:first_idea]:
    if l.startswith('## Prioritäts'):
        in_sketch = True; continue
    if in_sketch and l.strip():
        sketch_lines.append(l)

# map idea-number -> colour, parsed from the sketch tiers
prio_color = {}
TIER = [('prio 1', RED), ('prio 2', ORANGE), ('prio 3', GREEN), ('prio 4', GREY), ('enabler', BLUE)]
cur_col = None
for l in sketch_lines:
    low = l.lower()
    hit = next((c for key, c in TIER if key in low), None)
    if hit and l.lstrip().startswith('-'):
        cur_col = hit
    if cur_col:
        for seg in re.split(r'·', l):
            m = re.match(r'\s*(\d+)\s+\S', seg)
            if m:
                prio_color.setdefault(int(m.group(1)), cur_col)

# --- parse ideas (continuation lines join the current bullet, or the main text) ---
ideas, cur = [], None
for l in raw[first_idea:]:
    m = re.match(r'^(\d+)\.\s+(.*)', l)
    if m:
        if cur: ideas.append(cur)
        cur = {'num': int(m.group(1)), 'main': m.group(2), 'bullets': []}
    elif re.match(r'^\s*-\s+', l):
        cur['bullets'].append(re.sub(r'^\s*-\s+', '', l).strip())
    elif l.strip() == '':
        continue
    elif cur:
        if cur['bullets']:
            cur['bullets'][-1] += ' ' + l.strip()
        else:
            cur['main'] += ' ' + l.strip()
if cur: ideas.append(cur)

styles = getSampleStyleSheet()
H1   = ParagraphStyle('H1', parent=styles['Title'], textColor=INK, fontSize=22, leading=25, alignment=0, spaceAfter=1)
SUB  = ParagraphStyle('SUB', parent=styles['Normal'], textColor=RED, fontSize=13, leading=15, fontName='Helvetica-Bold', spaceAfter=1)
META = ParagraphStyle('META', parent=styles['Normal'], textColor=colors.HexColor('#555555'), fontSize=8.5, leading=11, spaceAfter=2)
H2   = ParagraphStyle('H2', parent=styles['Normal'], textColor=GREEN, fontSize=13, leading=15, fontName='Helvetica-Bold', spaceBefore=10, spaceAfter=5)
BODY = ParagraphStyle('BODY', parent=styles['Normal'], textColor=INK, fontSize=10, leading=13.5)
SUBB = ParagraphStyle('SUBB', parent=styles['Normal'], textColor=colors.HexColor('#2a3a55'), fontSize=9, leading=12, leftIndent=8)
PBOX = ParagraphStyle('PBOX', parent=styles['Normal'], textColor=INK, fontSize=9.5, leading=13)

def card(num, main, bullets):
    col = prio_color.get(num, GREY)
    parts = [Paragraph('<font color="#b02418"><b>%d.</b></font> %s' % (num, inline(main)), BODY)]
    for b in bullets:
        parts.append(Paragraph('• ' + inline(b), SUBB))
    t = Table([[parts]], colWidths=[170*mm])
    t.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),
                           ('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),
                           ('BACKGROUND',(0,0),(-1,-1),CARD),('LINEBEFORE',(0,0),(0,-1),3,col)]))
    return KeepTogether([t, Spacer(1, 5)])

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=16*mm, rightMargin=16*mm,
                        topMargin=14*mm, bottomMargin=14*mm, title=title, author='Doc Alvers Mathe-Labor')
story = [Paragraph('Doc Alvers Mathe-Labor', H1),
         Paragraph('Tracker — Ideen-Sammlung', SUB),
         Paragraph(inline(meta), META),
         HRFlowable(width='100%', thickness=2, color=ORANGE, spaceBefore=4, spaceAfter=10)]

# priority sketch box
sk_html = []
for l in sketch_lines:
    txt = inline(l.strip())
    if l.lstrip().startswith('-'):
        sk_html.append('<br/>' + re.sub(r'^-\s*', '<b>•</b> ', txt))
    elif l.lstrip().startswith('- ') is False and l.startswith('  '):
        sk_html.append(' ' + txt)  # wrapped sub-line
    else:
        sk_html.append(txt)
story.append(Paragraph('Prioritäts-Skizze', H2))
pb = Table([[Paragraph(''.join(sk_html), PBOX)]], colWidths=[178*mm])
pb.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),BOX),('BOX',(0,0),(-1,-1),0.5,colors.HexColor('#e0d9c2')),
                        ('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),
                        ('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
story += [pb, Spacer(1, 8), Paragraph('Die Ideen im Detail', H2)]
for it in ideas:
    story.append(card(it['num'], it['main'], it['bullets']))

doc.build(story)
print('PDF -> %s (%d Ideen)' % (OUT, len(ideas)))
