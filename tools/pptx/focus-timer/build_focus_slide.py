#!/usr/bin/env python3
"""Builds the focus-timer deck: one slide per duration, each with the looping lake video,
the soundtrack, a translucent Pac-Man pie and a countdown numeral in the middle.

    python3 build_focus_slide.py out.pptx 1 2 3 5 10 25

Geometry and colours are kept in step with HTML/fokus.html so both look the same.
python-pptx cannot do audio or animation, so two more steps follow this one:
finish.applescript adds the playback settings and the wheel, post_fix.py repairs what
PowerPoint drops and times the countdown numerals."""
import json, math, shutil, sys, zipfile
from pathlib import Path
from lxml import etree
from pptx import Presentation
from pptx.util import Emu, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

HERE = Path(__file__).parent
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
q = lambda t: '{%s}%s' % (NS[t.split(':')[0]], t.split(':')[1])

EMU_IN = 914400
SLIDE_W, SLIDE_H = Emu(12192000), Emu(6858000)      # 16:9
LAMBDA_ORANGE = 'F5C242'

# same proportions as the web lab: radius 0.29 of the short side, numeral 0.30 of the radius
PIE_R = 0.29 * (SLIDE_H / EMU_IN)                   # 2.175 in
PIE_D = Emu(int(2 * PIE_R * EMU_IN))
NUM_PT = int(round(PIE_R * 0.30 * 72))              # 47 pt
RIM_ADJ = 0.022
PIE_ALPHA, RIM_ALPHA = 88.0, 60.0


STEP_OVERRIDE = None          # seconds; forces one interval for every slide
LONG_STEP = 10                # seconds per numeral above 10 minutes (measured: costs
                              # 0.2 MB and 0.02 s when paging, so it is the default)


def parse_duration(token):
    """Minutes by default, seconds with an s suffix: 90s is a minute and a half."""
    token = token.strip()
    if token.endswith('s'):
        return float(token[:-1]) / 60.0
    return float(token)


def step_for(minutes):
    if STEP_OVERRIDE:
        return STEP_OVERRIDE
    """How finely the numeral can count. Every step is a separate text box with two animations,
    so a full deck of second-by-second slides would run to thousands of effects."""
    # Up to 10 minutes every second: those slides carry at most 600 numerals and stay nimble.
    # Above that every LONG_STEP seconds. Per-second numerals on the long slides gave slide 25
    # over 5000 shapes and paging to it in a running presentation crawled (Doc, 06.09.2026);
    # 545 shapes a slide is not noticeable.
    return 1 if minutes <= 10 else LONG_STEP


def translucent(shape, rgb_hex, alpha_pct):
    """Solid fill with an alpha channel - python-pptx exposes no transparency API."""
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor.from_string(rgb_hex)
    clr = shape.fill._xPr.find(q('a:solidFill')).find(q('a:srgbClr'))
    etree.SubElement(clr, q('a:alpha')).set('val', str(int(alpha_pct * 1000)))
    shape.line.fill.background()
    shape.shadow.inherit = False


def shadow(run):
    """Soft dark halo so white numerals read over the pie and over the bare photo alike."""
    eff = etree.SubElement(run._r.get_or_add_rPr(), q('a:effectLst'))
    sh = etree.SubElement(eff, q('a:outerShdw'), blurRad='60000', dist='0', dir='0',
                          algn='ctr', rotWithShape='0')
    clr = etree.SubElement(sh, q('a:srgbClr'), val='07142B')
    etree.SubElement(clr, q('a:alpha')).set('val', '78000')


def build_slide(prs, video, audio, poster, credit, minutes):
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    # dark slide behind everything - a white one shows as a hairline at the edges
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = RGBColor.from_string('101C33')

    # the lake, bled past every edge so no sliver of slide can peek through
    bleed = Emu(int(0.04 * EMU_IN))
    vid = slide.shapes.add_movie(str(video), Emu(-bleed), Emu(-bleed),
                                 Emu(SLIDE_W + 2 * bleed), Emu(SLIDE_H + 2 * bleed),
                                 poster_frame_image=str(poster), mime_type='video/mp4')
    vid.name = 'LAKE_VIDEO'

    # the timer: a filled disc the Wheel exit eats clockwise, plus a thin rim that stays
    left, top = Emu(int(SLIDE_W / 2 - PIE_D / 2)), Emu(int(SLIDE_H / 2 - PIE_D / 2))
    pie = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, PIE_D, PIE_D)
    pie.name = 'TIMER_RING'
    translucent(pie, LAMBDA_ORANGE, PIE_ALPHA)
    rim = slide.shapes.add_shape(MSO_SHAPE.DONUT, left, top, PIE_D, PIE_D)
    rim.name = 'TIMER_TRACK'
    rim.adjustments[0] = RIM_ADJ
    translucent(rim, 'FFFFFF', RIM_ALPHA)

    # the slide's length, top centre. With 26 near-identical slides there is otherwise no way
    # to tell them apart before the countdown starts (Doc, 06.09.2026). Raleway on request.
    secs = int(round(minutes * 60))
    if secs % 60 == 0:
        label = '1 Minute' if secs == 60 else '%d Minuten' % (secs // 60)
    else:
        label = '%d Sekunden' % secs
    hbox = slide.shapes.add_textbox(0, Emu(int(0.30 * EMU_IN)), SLIDE_W, Emu(int(0.55 * EMU_IN)))
    hbox.name = 'SLIDE_LENGTH'
    hbox.text_frame.word_wrap = False
    hpara = hbox.text_frame.paragraphs[0]
    hpara.alignment = PP_ALIGN.CENTER
    hrun = hpara.add_run()
    hrun.text = label
    hrun.font.size = Pt(22)
    hrun.font.name = 'Raleway'
    hrun.font.color.rgb = RGBColor.from_string('FFFFFF')
    hclr = hrun.font.color._xFill.find(q('a:srgbClr'))
    etree.SubElement(hclr, q('a:alpha')).set('val', '62000')
    shadow(hrun)

    # the countdown numerals; post_fix.py reads the two times back out of the shape name
    total_ms = int(round(minutes * 60_000))
    step_ms = step_for(minutes) * 1000
    t = 0
    while t < total_ms:
        left_s = (total_ms - t) // 1000
        box = slide.shapes.add_textbox(Emu(int(SLIDE_W / 2 - 2.2 * EMU_IN)),
                                       Emu(int(SLIDE_H / 2 - 0.52 * EMU_IN)),
                                       Emu(int(4.4 * EMU_IN)), Emu(int(1.04 * EMU_IN)))
        box.name = 'CD_%d_%d' % (t, min(t + step_ms, total_ms))
        box.text_frame.word_wrap = False
        para = box.text_frame.paragraphs[0]
        para.alignment = PP_ALIGN.CENTER
        run = para.add_run()
        run.text = '%d:%02d' % (left_s // 60, left_s % 60)
        run.font.size = Pt(NUM_PT)
        run.font.bold = True
        run.font.name = 'Orbitron'
        run.font.color.rgb = RGBColor.from_string('FFFFFF')
        shadow(run)
        t += step_ms

    # photo credit - the background is CC BY, so the attribution travels with the slide
    cbox = slide.shapes.add_textbox(Emu(int(0.16 * EMU_IN)), Emu(int(7.03 * EMU_IN)),
                                    Emu(int(9.0 * EMU_IN)), Emu(int(0.30 * EMU_IN)))
    cbox.name = 'PHOTO_CREDIT'
    cbox.text_frame.word_wrap = False
    crun = cbox.text_frame.paragraphs[0].add_run()
    crun.text = credit
    crun.font.size = Pt(7)
    crun.font.name = 'Orbitron'
    crun.font.color.rgb = RGBColor.from_string('FFFFFF')
    clr = crun.font.color._xFill.find(q('a:srgbClr'))
    etree.SubElement(clr, q('a:alpha')).set('val', '20000')

    # the soundtrack, tucked into the corner behind a blank poster frame so no loudspeaker
    # icon sits on the slide while editing
    snd = slide.shapes.add_movie(str(audio), Emu(SLIDE_W - Emu(int(0.5 * EMU_IN))),
                                 Emu(SLIDE_H - Emu(int(0.5 * EMU_IN))),
                                 Emu(int(0.22 * EMU_IN)), Emu(int(0.22 * EMU_IN)),
                                 poster_frame_image=str(HERE / 'blank.png'),
                                 mime_type='audio/mp4')
    snd.name = 'FOCUS_AUDIO'
    return slide


def make_audio(pptx_path):
    """Rewrite every audio movie into a real audio object: <a:videoFile> -> <a:audioFile>, the
    slide relationship from .../video to .../audio, and its timing node <p:video> -> <p:audio>.
    python-pptx has no audio API, so the shape goes in as a movie and is corrected here."""
    src = Path(pptx_path)
    with zipfile.ZipFile(src) as zin:
        parts = {i.filename: zin.read(i.filename) for i in zin.infolist()}

    for name in [n for n in parts if n.startswith('ppt/slides/slide') and n.endswith('.xml')]:
        num = name.rsplit('slide', 1)[1].split('.')[0]
        rels_name = 'ppt/slides/_rels/slide%s.xml.rels' % num
        root = etree.fromstring(parts[name])
        rels = etree.fromstring(parts[rels_name])
        audio_ids, links = [], []
        for pic in root.iter(q('p:pic')):
            cnv = pic.find('.//' + q('p:cNvPr'))
            if cnv.get('name') != 'FOCUS_AUDIO':
                continue
            vf = pic.find('.//' + q('a:videoFile'))
            links.append(vf.get(q('r:link')))
            af = etree.Element(q('a:audioFile'))
            af.set(q('r:link'), vf.get(q('r:link')))
            vf.getparent().replace(vf, af)
            audio_ids.append(cnv.get('id'))
        if not audio_ids:
            continue
        for vid in root.iter(q('p:video')):
            tgt = vid.find('.//' + q('p:spTgt'))
            if tgt is not None and tgt.get('spid') in audio_ids:
                aud = etree.Element(q('p:audio'))
                for child in list(vid):
                    aud.append(child)
                vid.getparent().replace(vid, aud)
        for rel in rels:
            if rel.get('Id') in links:
                rel.set('Type', rel.get('Type').rsplit('/', 1)[0] + '/audio')
        parts[name] = etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
        parts[rels_name] = etree.tostring(rels, xml_declaration=True, encoding='UTF-8', standalone=True)

    tmp = src.with_suffix('.tmp.pptx')
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for n, b in parts.items():
            zout.writestr(n, b)
    shutil.move(tmp, src)


def main():
    global STEP_OVERRIDE, LONG_STEP
    args = sys.argv[1:]
    media = HERE
    while args and args[0].startswith('--'):
        opt = args.pop(0)
        if opt.startswith('--step='):
            STEP_OVERRIDE = int(opt.split('=', 1)[1])
        elif opt.startswith('--longstep='):
            LONG_STEP = int(opt.split('=', 1)[1])
        elif opt.startswith('--media='):
            # video and soundtrack are deliberately not in the repo - see README
            media = Path(opt.split('=', 1)[1]).expanduser()
        else:
            raise SystemExit('unknown option ' + opt)
    out = Path(args[0])
    durations = [parse_duration(x) for x in args[1:]] or [10.0]
    durations = sorted(set(durations))
    for need in ('lake_loop.mp4', 'focus_audio.m4a'):
        if not (media / need).exists():
            raise SystemExit('%s not found in %s - see README on how to make it' % (need, media))
    meta = json.loads((HERE / 'photo_meta.json').read_text())
    credit = 'Foto: %s - %s - %s - Wikimedia Commons' % (
        meta['author'], meta['title'].rsplit('.', 1)[0], meta['licence'])

    prs = Presentation()
    prs.slide_width, prs.slide_height = SLIDE_W, SLIDE_H
    for m in durations:
        build_slide(prs, media / 'lake_loop.mp4', media / 'focus_audio.m4a',
                    media / 'frames' / '0000.jpg', credit, m)
    prs.save(str(out))
    make_audio(out)
    secs = [round(d * 60) for d in durations]
    (out.parent / (out.stem + '.seconds.json')).write_text(json.dumps(secs))
    print('built %s - %d slides: %s' % (out, len(durations),
          ', '.join(('%ds' % x if x < 120 else '%gmin' % (x / 60)) for x in secs)))


if __name__ == '__main__':
    main()
