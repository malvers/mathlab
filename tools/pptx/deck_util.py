#!/usr/bin/env python3
"""Helpers for building a deck on top of the Informatik design template."""
import os, re, sys, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import emu, NS, TEMPLATE_ID, TEMPLATE_VERSION
from stamp import write_stamp
from pptx.util import Pt, Emu
from pptx.oxml import parse_xml
from pptx.oxml.ns import qn
from PIL import Image


def fill_ph(slide, idx, lines):
    """lines: [(text, level), ...] - level 0 is a click, deeper levels ride along.
    **word** inside text renders bold."""
    ph = slide.placeholders[idx]
    tf = ph.text_frame
    tf.word_wrap = True
    for i, (text, level) in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        set_runs(p, text)
        p.level = level
    return ph


def set_runs(p, text):
    """Replace the runs of paragraph p by `text`; **word** becomes a bold run,
    $...$ becomes a real (editable) PowerPoint formula - see omml.py."""
    if "$" in text:
        from omml import set_runs_math
        return set_runs_math(p, text)
    for r in list(p.runs):
        p._p.remove(r._r)
    for part in re.split(r"(\*\*[^*]+\*\*)", text):
        if not part:
            continue
        r = p.add_run()
        if part.startswith("**") and part.endswith("**"):
            r.text = part[2:-2]
            r.font.bold = True
        else:
            r.text = part


def drop_ph(slide, idx):
    """Remove an unused placeholder so no empty prompt box is left on the slide."""
    for shape in list(slide.placeholders):
        if shape.placeholder_format.idx == idx:
            shape._element.getparent().remove(shape._element)
            return


def fill_picture(slide, idx, path):
    """Put the picture INTO the layout frame (crops to fill) - good for photos."""
    return slide.placeholders[idx].insert_picture(path)


def fit_picture(slide, idx, path):
    """Scale the picture to fit INSIDE the frame without cropping - good for artwork."""
    ph = slide.placeholders[idx]
    fx, fy, fw, fh = ph.left, ph.top, ph.width, ph.height
    drop_ph(slide, idx)
    iw, ih = Image.open(path).size
    scale = min(fw / iw, fh / ih)
    w, h = int(iw * scale), int(ih * scale)
    return slide.shapes.add_picture(path, int(fx + (fw - w) / 2), int(fy + (fh - h) / 2), w, h)


def click_groups(lines):
    """One click per level-0 line; deeper lines join the group above them."""
    groups = []
    for i, (_, level) in enumerate(lines):
        if level == 0 or not groups:
            groups.append([i])
        else:
            groups[-1].append(i)
    return groups


def _effect(cid, spid, para, first):
    node = "clickEffect" if first else "withEffect"
    tgt = (f'<p:tgtEl><p:spTgt spid="{spid}"><p:txEl>'
           f'<p:pRg st="{para}" end="{para}"/></p:txEl></p:spTgt></p:tgtEl>')
    return (f'<p:par><p:cTn id="{next(cid)}" presetID="10" presetClass="entr" presetSubtype="0" '
            f'fill="hold" grpId="0" nodeType="{node}">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
            f'<p:set><p:cBhvr><p:cTn id="{next(cid)}" dur="1" fill="hold">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>{tgt}'
            f'<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="visible"/></p:to></p:set>'
            f'<p:animEffect transition="in" filter="fade">'
            f'<p:cBhvr><p:cTn id="{next(cid)}" dur="400"/>{tgt}</p:cBhvr></p:animEffect>'
            f'</p:childTnLst></p:cTn></p:par>')


def add_click_build(slide, entries):
    """entries: [(shape, lines)] - native fade, one click per level-0 line."""
    entries = [(sh, ls) for sh, ls in entries if ls]
    if not entries:
        return
    cid = itertools.count(3)
    clicks, blds = [], []
    for shape, lines in entries:
        spid = shape.shape_id
        blds.append(f'<p:bldP spid="{spid}" grpId="0" build="p"/>')
        for group in click_groups(lines):
            eff = "".join(_effect(cid, spid, p, j == 0) for j, p in enumerate(group))
            clicks.append(
                f'<p:par><p:cTn id="{next(cid)}" fill="hold">'
                f'<p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
                f'<p:par><p:cTn id="{next(cid)}" fill="hold">'
                f'<p:stCondLst><p:cond delay="0"/></p:stCondLst>'
                f'<p:childTnLst>{eff}</p:childTnLst></p:cTn></p:par>'
                f'</p:childTnLst></p:cTn></p:par>')
    xml = (f'<p:timing {NS}><p:tnLst><p:par>'
           f'<p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
           f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq">'
           f'<p:childTnLst>{"".join(clicks)}</p:childTnLst></p:cTn>'
           f'<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
           f'<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>'
           f'</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>'
           f'<p:bldLst>{"".join(blds)}</p:bldLst></p:timing>')
    for old in slide._element.findall(qn("p:timing")):
        slide._element.remove(old)
    slide._element.append(parse_xml(xml))


def save_deck(prs, path):
    """Save and re-apply the design stamp - python-pptx drops the custom part."""
    import datetime
    prs.save(path)
    write_stamp(path, TEMPLATE_ID, TEMPLATE_VERSION, datetime.date.today().isoformat())
    return path
