#!/usr/bin/env python3
"""Native PowerPoint tables in the Informatik design - editable text, no images.

add_table(slide, rows, x, y, col_w, ...) draws a table whose look is set cell by
cell (fills, hairlines, fonts), so PowerPoint's own table styles never kick in.
Coordinates and widths are in points, like everywhere else in this toolkit.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import emu, INK, BODY, MUTED, STROKE, ORANGE, RED, GREEN, FONT_H, FONT_B, FONT_M
from pptx.util import Pt
from pptx.dml.color import RGBColor
from pptx.oxml import parse_xml
from pptx.oxml.ns import qn
from PIL import ImageFont

# soft tints of the palette for highlighted cells (hex, no #)
TINT_ORANGE = "FBEBBF"
TINT_RED = "F2CFCB"
TINT_GREEN = "DDE8C6"
TINT_BLUE = "E6ECF8"

_FONT_DIR = os.path.expanduser("~/Library/Fonts/")
_FONT_FILES = {FONT_H: "Orbitron-Bold.ttf", FONT_B: "Raleway-Regular.ttf",
               FONT_B + "-Bold": "Raleway-Bold.ttf"}


def text_width_pt(text, font=FONT_B, size=12, bold=False):
    """Real rendered width in points (PIL at 4x for sub-pixel accuracy)."""
    key = font + ("-Bold" if bold and font == FONT_B else "")
    path = _FONT_DIR + _FONT_FILES.get(key, "Raleway-Regular.ttf")
    if font == FONT_M:
        path = "/System/Library/Fonts/Menlo.ttc"
    f = ImageFont.truetype(path, int(size * 4))
    return f.getlength(text) / 4


def _line_xml(tag, color, w_pt):
    return (f'<a:{tag} xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
            f'w="{emu(w_pt)}" cap="flat" cmpd="sng" algn="ctr"><a:solidFill>'
            f'<a:srgbClr val="{color}"/></a:solidFill><a:prstDash val="solid"/></a:{tag}>')


def _set_borders(cell, color=STROKE, w_pt=0.75):
    tcPr = cell._tc.get_or_add_tcPr()
    for tag in ("a:lnL", "a:lnR", "a:lnT", "a:lnB"):
        for old in tcPr.findall(qn(tag)):
            tcPr.remove(old)
    # schema order: lnL, lnR, lnT, lnB come before fill - insert at the front
    for i, tag in enumerate(("lnL", "lnR", "lnT", "lnB")):
        tcPr.insert(i, parse_xml(_line_xml(tag, color, w_pt)))


def add_table(slide, rows, x, y, col_w, font_size=12, row_h=None, head=True,
              marks=None, bold_cols=(), mono_cols=(), align=None, name="Tabelle"):
    """rows: list of row lists (strings). Row 0 is the header when head=True.
    col_w: list of column widths in pt. marks: {(row, col): tint_hex} or
    {row: tint_hex} for whole rows. Returns the graphic frame."""
    marks = marks or {}
    n_rows, n_cols = len(rows), len(rows[0])
    row_h = row_h or font_size * 1.9
    frame = slide.shapes.add_table(n_rows, n_cols, emu(x), emu(y),
                                   emu(sum(col_w)), emu(row_h * n_rows))
    frame.name = name
    tbl = frame.table
    # kill PowerPoint's built-in table style so only our formatting shows
    tblPr = tbl._tbl.tblPr
    for old in tblPr.findall(qn("a:tableStyleId")):
        tblPr.remove(old)
    for attr in ("firstRow", "bandRow", "firstCol", "lastRow", "lastCol", "bandCol"):
        if tblPr.get(attr) is not None:
            del tblPr.attrib[attr]
    for c, w in enumerate(col_w):
        tbl.columns[c].width = emu(w)
    for r in range(n_rows):
        tbl.rows[r].height = emu(row_h)
    for r, row in enumerate(rows):
        is_head = head and r == 0
        for c, text in enumerate(row):
            cell = tbl.cell(r, c)
            cell.margin_left = cell.margin_right = Pt(6)
            cell.margin_top = cell.margin_bottom = Pt(2)
            cell.vertical_anchor = 1  # middle
            tint = marks.get((r, c), marks.get(r))
            cell.fill.solid()
            if is_head:
                cell.fill.fore_color.rgb = RGBColor.from_string(INK)
            elif tint:
                cell.fill.fore_color.rgb = RGBColor.from_string(tint)
            else:
                cell.fill.fore_color.rgb = RGBColor.from_string("FFFFFF")
            _set_borders(cell, STROKE if not is_head else INK, 0.75)
            tf = cell.text_frame
            tf.word_wrap = False
            p = tf.paragraphs[0]
            if align and align[c]:
                p.alignment = {"l": 1, "c": 2, "r": 3}[align[c]]
            run = p.add_run()
            run.text = str(text)
            if is_head:
                run.font.name = FONT_H
                run.font.size = Pt(max(font_size - 3, 8))
                run.font.bold = True
                run.font.color.rgb = RGBColor.from_string("FFFFFF")
            else:
                run.font.name = FONT_M if c in mono_cols else FONT_B
                run.font.size = Pt(font_size)
                run.font.bold = c in bold_cols
                run.font.color.rgb = RGBColor.from_string(INK if c in bold_cols else BODY)
    return frame


def check_fit(rows, col_w, font_size=12, bold_cols=(), mono_cols=(), pad=12):
    """Measure every cell - returns a list of (row, col, width, avail) overflows."""
    bad = []
    for r, row in enumerate(rows):
        for c, text in enumerate(row):
            if r == 0:
                w = text_width_pt(str(text), FONT_H, max(font_size - 3, 8), True)
            else:
                w = text_width_pt(str(text), FONT_M if c in mono_cols else FONT_B,
                                  font_size, c in bold_cols)
            if w + pad > col_w[c]:
                bad.append((r, c, round(w + pad, 1), col_w[c]))
    return bad
