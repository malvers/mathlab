#!/usr/bin/env python3
"""Two repairs to what PowerPoint leaves behind, applied after it has saved the file.

1. PowerPoint attaches a click-to-pause trigger to every media object. The background video
   covers the whole slide, so that trigger would swallow the click meant to start the timer.
2. Adding the animation effects makes PowerPoint rebuild the timing tree, and in doing so it
   drops the <p:audio> media node - the music would play once instead of looping, and the
   speaker icon would show. Setting the play options AFTER the effects fixes the audio but
   costs the wheel animation, so the node is written back here instead.
"""
import re, shutil, sys, zipfile
from pathlib import Path
from lxml import etree

P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
q = lambda tag: '{%s}%s' % (P, tag)
E = lambda tag, **a: etree.Element(q(tag), **a)


def audio_node(spid, ctn_id):
    node = E('audio')
    media = etree.SubElement(node, q('cMediaNode'), vol='80000', showWhenStopped='0')
    ctn = etree.SubElement(media, q('cTn'), id=str(ctn_id),
                           repeatCount='indefinite', fill='hold', display='0')
    etree.SubElement(etree.SubElement(ctn, q('stCondLst')), q('cond'), delay='indefinite')
    etree.SubElement(etree.SubElement(media, q('tgtEl')), q('spTgt'), spid=str(spid))
    return node


def visibility_effect(spid, delay_ms, visible, ctn_id, grp_id):
    """One Appear or Disappear step, as PowerPoint itself encodes it: a preset effect node
    whose only behaviour flips style.visibility at the given offset inside its group."""
    par = E('par')
    ctn = etree.SubElement(par, q('cTn'), id=str(ctn_id), presetID='1',
                           presetClass='entr' if visible else 'exit', presetSubtype='0',
                           fill='hold', grpId=str(grp_id), nodeType='withEffect')
    etree.SubElement(etree.SubElement(ctn, q('stCondLst')), q('cond'), delay=str(delay_ms))
    st = etree.SubElement(etree.SubElement(ctn, q('childTnLst')), q('set'))
    beh = etree.SubElement(st, q('cBhvr'))
    etree.SubElement(beh, q('cTn'), id=str(ctn_id + 1), dur='1', fill='hold')
    etree.SubElement(etree.SubElement(beh, q('tgtEl')), q('spTgt'), spid=str(spid))
    etree.SubElement(etree.SubElement(beh, q('attrNameLst')), q('attrName')).text = 'style.visibility'
    etree.SubElement(etree.SubElement(st, q('to')), q('strVal'),
                     val='visible' if visible else 'hidden')
    return par


def effect_host(group):
    """The innermost childTnLst of a main-sequence group - where the effect nodes live."""
    inner = group.find(q('cTn')).find(q('childTnLst'))[0]
    return inner.find(q('cTn')).find(q('childTnLst'))


def merge_groups(main, report, tag):
    """PowerPoint runs the main sequence's groups one after another: group 2 only begins once
    group 1 has ENDED. With the countdown numerals in group 1 that group lasts the whole timer,
    so the pie in group 2 sat there doing nothing until the very end. Everything therefore goes
    into a single group, where withEffect means "start together"."""
    groups = main.find(q('childTnLst'))
    if len(groups) < 2:
        return
    host = effect_host(groups[0])
    for g in list(groups)[1:]:
        for par in list(effect_host(g)):
            host.append(par)
        groups.remove(g)
    report.append('%s: effects merged into one group so they run together' % tag)


def add_countdown(root):
    """Give every CD_<from>_<to> text box an Appear and a Disappear at those milliseconds.
    The times ride in the shape name, so the builder and this script need not agree on anything
    else. AppleScript cannot express a trigger delay at all, hence the hand-written XML."""
    labels = []
    for cnv in root.iter(q('cNvPr')):
        name = cnv.get('name') or ''
        if name.startswith('CD_'):
            _, t0, t1 = name.split('_')
            labels.append((cnv.get('id'), int(t0), int(t1)))
    if not labels:
        return None
    labels.sort(key=lambda x: x[1])

    # the innermost effect list of the auto-start group is where PowerPoint keeps its own effects
    host = None
    for seq in root.iter(q('seq')):
        ctn = seq.find(q('cTn'))
        if ctn is None or ctn.get('nodeType') != 'mainSeq':
            continue
        first = ctn.find(q('childTnLst'))[0]
        host = first.find(q('cTn')).find(q('childTnLst'))[0].find(q('cTn')).find(q('childTnLst'))
    if host is None:
        raise SystemExit('no main sequence to hang the countdown on')

    next_id = max(int(c.get('id')) for c in root.iter(q('cTn')) if c.get('id')) + 1
    for spid, t0, t1 in labels:
        host.append(visibility_effect(spid, t0, True, next_id, 0)); next_id += 2
        host.append(visibility_effect(spid, t1, False, next_id, 1)); next_id += 2

    # shapes carrying an entrance stay hidden until it fires only if they are in the build list
    sld = root.find(q('cSld')).getparent()
    bld = sld.find(q('timing')).find(q('bldLst'))
    if bld is None:
        bld = etree.SubElement(sld.find(q('timing')), q('bldLst'))
    for spid, _, _ in labels:
        for grp in ('0', '1'):
            etree.SubElement(bld, q('bldP'), spid=str(spid), grpId=grp, animBg='1')
    return len(labels)


def hide_header(root, report, tag):
    """The slide-length caption is a working aid: it tells the 26 near-identical slides apart
    while editing. In the show it is noise, so it gets a Disappear at 0 s - visible on the
    thumbnail and the canvas, gone the instant the slide comes up."""
    spid = None
    for cnv in root.iter(q('cNvPr')):
        if cnv.get('name') == 'SLIDE_LENGTH':
            spid = cnv.get('id')
    if spid is None:
        return
    host = None
    for seq in root.iter(q('seq')):
        ctn = seq.find(q('cTn'))
        if ctn is not None and ctn.get('nodeType') == 'mainSeq':
            host = effect_host(ctn.find(q('childTnLst'))[0])
    if host is None:
        return
    next_id = max(int(c.get('id')) for c in root.iter(q('cTn')) if c.get('id')) + 1
    host.append(visibility_effect(spid, 0, False, next_id, 2))
    bld = root.find(q('timing')).find(q('bldLst'))
    if bld is None:
        bld = etree.SubElement(root.find(q('timing')), q('bldLst'))
    etree.SubElement(bld, q('bldP'), spid=str(spid), grpId='2', animBg='1')
    report.append('%s: length caption hidden once the show starts' % tag)


def audio_spid_of(root):
    """The audio shape's id, looked up by name so it survives shapes being added or removed."""
    A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
    for pic in root.iter(q('pic')):
        if pic.find('.//{%s}audioFile' % A) is not None:
            return pic.find('.//' + q('cNvPr')).get('id')
    raise SystemExit('no audio shape in this slide')


def fix_slide(root, report, name):
    tag = name.rsplit('/', 1)[1].replace('.xml', '')
    for seq in list(root.iter(q('seq'))):
        ctn = seq.find(q('cTn'))
        if ctn is not None and ctn.get('nodeType') == 'interactiveSeq':
            seq.getparent().remove(seq)
            report.append('%s: removed click-to-pause trigger' % tag)

    # PowerPoint writes every group as "wait for a click". For a focus timer that is wrong:
    # the slide should come up and simply run - picture, music and countdown together, no click.
    # Every group therefore starts at delay 0 and every clickEffect becomes a withEffect.
    main = None
    for seq in root.iter(q('seq')):
        ctn = seq.find(q('cTn'))
        if ctn is not None and ctn.get('nodeType') == 'mainSeq':
            main = ctn
    if main is not None:
        for group in main.find(q('childTnLst')):
            inner = group.find(q('cTn'))
            cond = inner.find(q('stCondLst')).find(q('cond'))
            if cond.get('delay') == 'indefinite':
                cond.set('delay', '0')
            for node in inner.iter(q('cTn')):
                if node.get('nodeType') == 'clickEffect':
                    node.set('nodeType', 'withEffect')
        report.append('%s: starts with the slide, no click needed' % tag)

    n = add_countdown(root)
    if n:
        report.append('%s: %d countdown numbers timed' % (tag, n))

    hide_header(root, report, tag)

    if main is not None:
        merge_groups(main, report, tag)

    has_audio = root.find('.//' + q('audio')) is not None
    if has_audio:
        report.append('%s: audio node already present' % tag)
    else:
        video = root.find('.//' + q('video'))
        if video is None:
            raise SystemExit('no <p:video> node to anchor the audio node next to')
        audio_spid = audio_spid_of(root)
        next_id = max(int(c.get('id')) for c in root.iter(q('cTn')) if c.get('id')) + 1
        video.addnext(audio_node(audio_spid, next_id))
        report.append('%s: re-added looping audio node' % tag)
    return


def fix(pptx_path):
    src = Path(pptx_path)
    with zipfile.ZipFile(src) as zin:
        parts = {i.filename: zin.read(i.filename) for i in zin.infolist()}

    report = []
    slides = sorted((n for n in parts if re.match(r'ppt/slides/slide\d+\.xml$', n)),
                    key=lambda n: int(re.search(r'slide(\d+)', n).group(1)))
    for name in slides:
        root = etree.fromstring(parts[name])
        fix_slide(root, report, name)
        parts[name] = etree.tostring(root, xml_declaration=True, encoding='UTF-8',
                                     standalone=True)

    tmp = src.with_suffix('.tmp.pptx')
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for name, blob in parts.items():
            zout.writestr(name, blob)
    shutil.move(tmp, src)
    return report


if __name__ == '__main__':
    for line in fix(sys.argv[1]):
        print(' -', line)
