#!/usr/bin/env python3
"""Builds informatik-design.pptx - the master/layout design system plus demo slides."""
import os, re, sys, uuid
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import *          # noqa
from stamp import write_stamp
from pptx import Presentation
from pptx.util import Pt
from pptx.oxml import parse_xml
from pptx.oxml.ns import qn
from pptx.opc.constants import RELATIONSHIP_TYPE as RT

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "out")
os.makedirs(OUT_DIR, exist_ok=True)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(OUT_DIR, "informatik-vorlage.pptx")
BG = os.path.join(OUT_DIR, "bg-informatik.png")

prs = Presentation()
prs.slide_width, prs.slide_height = emu(W), emu(H)
master = prs.slide_masters[0]

# ------------------------------------------------------------------ theme ----
theme = master.part.part_related_by(RT.THEME)
tx = theme.blob.decode("utf-8")
tx = re.sub(r'(<a:majorFont>\s*<a:latin typeface=")[^"]*"',
            r'\g<1>%s"' % FONT_H, tx)
tx = re.sub(r'(<a:minorFont>\s*<a:latin typeface=")[^"]*"',
            r'\g<1>%s"' % FONT_B, tx)
for tag, col in (("dk1", "0E244E"), ("dk2", "2C3C60"), ("lt1", "FFFFFF"), ("lt2", "EEF1F7"),
                 ("accent1", ORANGE), ("accent2", GREEN), ("accent3", RED),
                 ("accent4", "3A63A8"), ("accent5", "6E7E9F"), ("accent6", "0E244E"),
                 ("hlink", ORANGE), ("folHlink", GREEN)):
    tx = re.sub(r'<a:%s>.*?</a:%s>' % (tag, tag),
                '<a:%s><a:srgbClr val="%s"/></a:%s>' % (tag, col, tag), tx, flags=re.S)
theme._blob = tx.encode("utf-8")

# ----------------------------------------------------------------- master ----
make_background(BG)
_, rId = master.part.get_or_add_image_part(BG)
cSld = master._element.find(qn("p:cSld"))
for old_bg in cSld.findall(qn("p:bg")):     # template ships its own bg - only one is allowed
    cSld.remove(old_bg)
bg = parse_xml(f'<p:bg {NS}><p:bgPr><a:blipFill rotWithShape="1"><a:blip r:embed="{rId}"/>'
               f'<a:stretch><a:fillRect/></a:stretch></a:blipFill><a:effectLst/></p:bgPr></p:bg>')
cSld.insert(0, bg)

mtree = master.shapes._spTree
for el in list(mtree):
    if el.tag in (qn("p:sp"), qn("p:pic")):
        mtree.remove(el)

fld = ('<a:p><a:pPr algn="r"><a:buNone/></a:pPr>'
       f'<a:fld id="{{{str(uuid.uuid4()).upper()}}}" type="slidenum">'
       f'<a:rPr lang="de-DE" sz="1100" b="1" spc="100">{fill(MUTED)}'
       f'<a:latin typeface="{FONT_H}"/></a:rPr><a:t>2</a:t></a:fld></a:p>')

for xml in (
    # brand marker, flush to the top edge
    shape(90, "mark-orange", MARGIN, 0, 96, 5, fill(ORANGE)),
    shape(91, "mark-green", MARGIN + 102, 0, 26, 5, fill(GREEN)),
    # footer rule + footer text + slide number
    shape(92, "footer-rule", MARGIN, FOOT_Y, CONTENT_W, 0.75, fill(STROKE, 16)),
    shape(93, "footer-text", MARGIN, FOOT_Y + 8, 480, 18, body=para(
        run(FOOTER_TEXT, FONT_B, 10, MUTED, spc=1.2)),
        body_pr='<a:bodyPr wrap="none" anchor="t" lIns="0" tIns="0" rIns="0" bIns="0"/>'),
    shape(94, "slide-number", W - MARGIN - 120, FOOT_Y + 6, 120, 20, body=fld,
          body_pr='<a:bodyPr anchor="t" lIns="0" tIns="0" rIns="0" bIns="0"/>'),
):
    mtree.append(parse_xml(xml))

styles = master._element.find(qn("p:txStyles"))
new_styles = parse_xml(
    f'<p:txStyles {NS}>'
    f'<p:titleStyle>{lvl(1, 28, FONT_H, INK, bold=True, line_spacing=1.1, spc=-0.2)}</p:titleStyle>'
    f'<p:bodyStyle>'
    f'{lvl(1, 20, FONT_B, BODY, bullet=(BU_CHAR, RED), marL=20, indent=-20, space_before=12, line_spacing=1.25)}'
    f'{lvl(2, 17, FONT_B, MUTED, bullet=(BU_CHAR, GREEN), marL=44, indent=-20, space_before=6, line_spacing=1.2)}'
    f'{lvl(3, 15, FONT_B, MUTED, bullet=(BU_CHAR, "4A79C9"), marL=68, indent=-20, space_before=4, line_spacing=1.2)}'
    f'{lvl(4, 14, FONT_B, MUTED, bullet=(BU_CHAR, MUTED), marL=92, indent=-20, space_before=4)}'
    f'{lvl(5, 14, FONT_B, MUTED, bullet=(BU_CHAR, MUTED), marL=116, indent=-20, space_before=4)}'
    f'</p:bodyStyle>'
    f'<p:otherStyle>{lvl(1, 16, FONT_B, BODY)}</p:otherStyle>'
    f'</p:txStyles>')
master._element.replace(styles, new_styles)

# ---------------------------------------------------------------- layouts ----
def rebuild(layout, name, shapes_xml):
    layout.name = name
    tree = layout.shapes._spTree
    for el in list(tree):
        if el.tag in (qn("p:sp"), qn("p:pic"), qn("p:graphicFrame"), qn("p:cxnSp")):
            tree.remove(el)
    for xml in shapes_xml:
        tree.append(parse_xml(xml))
    return layout


TITLE_PH = '<p:ph type="title"/>'
def body_ph(idx):
    return f'<p:ph type="body" idx="{idx}"/>'

HEAD_BLOCK = [  # title + accent rule, shared by all content layouts
    placeholder(10, "Titel", TITLE_PH, MARGIN, TITLE_Y, CONTENT_W, 46,
                lst_style=lvl(1, 28, FONT_H, INK, bold=True, line_spacing=1.05, spc=-0.2),
                prompt="Folientitel"),
    shape(11, "rule-orange", MARGIN, RULE_Y, 44, 3, fill(ORANGE)),
    shape(12, "rule-green", MARGIN + 50, RULE_Y, 14, 3, fill(GREEN)),
]

L = list(prs.slide_layouts)

# 0 - Titel
rebuild(L[0], "Titel", [
    shape(20, "ring", 690, 96, 340, 340, "", line(STROKE, 1, 14), geom="ellipse"),
    shape(21, "ring-inner", 762, 168, 196, 196, "", line(ORANGE, 1.5, 70), geom="ellipse"),
    shape(22, "orbit-dot", 848, 158, 20, 20, fill(ORANGE), geom="ellipse"),
    shape(23, "title-bar", MARGIN, 214, 64, 4, fill(ORANGE)),
    placeholder(24, "Kicker", body_ph(10), MARGIN, 232, 520, 20,
                lst_style=lvl(1, 12, FONT_H, RED, bold=True, spc=3.0, caps=True),
                prompt="Informatik"),
    placeholder(25, "Titel", '<p:ph type="ctrTitle"/>', MARGIN, 262, 600, 118,
                lst_style=lvl(1, 44, FONT_H, INK, bold=True, line_spacing=1.08, spc=-0.5),
                prompt="Thema der Stunde"),
    placeholder(26, "Untertitel", '<p:ph type="subTitle" idx="1"/>', MARGIN, 392, 600, 56,
                lst_style=lvl(1, 19, FONT_B, MUTED, line_spacing=1.3),
                prompt="Untertitel / Leitfrage"),
])

# 1 - Inhalt
rebuild(L[1], "Inhalt", HEAD_BLOCK + [
    placeholder(13, "Inhalt", body_ph(1), MARGIN, BODY_Y, CONTENT_W, BODY_H,
                prompt="Inhalt"),
])

# 2 - Kapitel
rebuild(L[2], "Kapitel", [
    shape(30, "chapter-bar", MARGIN, 188, 4, 128, fill(ORANGE)),
    shape(31, "hair", MARGIN, 356, CONTENT_W, 0.75, fill(STROKE, 14)),
    placeholder(32, "Kapitelnummer", body_ph(10), MARGIN + 28, 188, 520, 22,
                lst_style=lvl(1, 12, FONT_H, RED, bold=True, spc=3.0, caps=True),
                prompt="Kapitel 01"),
    placeholder(33, "Titel", TITLE_PH, MARGIN + 28, 216, 700, 86,
                lst_style=lvl(1, 34, FONT_H, INK, bold=True, line_spacing=1.1, spc=-0.3),
                prompt="Abschnittstitel"),
    placeholder(34, "Beschreibung", body_ph(1), MARGIN + 28, 312, 640, 40,
                lst_style=lvl(1, 17, FONT_B, MUTED, line_spacing=1.3),
                prompt="Worum es hier geht"),
])

# 3 - Zwei Spalten  (lvl 1 = Spaltenkopf, lvl 2 = Punkte)
COL_W, GAP = 396.0, 24.0
COL_X2 = MARGIN + COL_W + GAP
col_style = (lvl(1, 15, FONT_H, INK, bold=True, spc=2.0, caps=True, space_before=0) +
             lvl(2, 17, FONT_B, BODY, bullet=(BU_CHAR, RED), marL=20, indent=-20,
                 space_before=10, line_spacing=1.25))
col_style_r = (lvl(1, 15, FONT_H, INK, bold=True, spc=2.0, caps=True, space_before=0) +
               lvl(2, 17, FONT_B, BODY, bullet=(BU_CHAR, GREEN), marL=20, indent=-20,
                   space_before=10, line_spacing=1.25))
rebuild(L[3], "Zwei Spalten", HEAD_BLOCK + [
    shape(40, "panel-l", MARGIN, BODY_Y, COL_W, 304, fill(CARD), line(STROKE, 0.75, 12)),
    shape(41, "panel-l-top", MARGIN, BODY_Y, COL_W, 3, fill(ORANGE)),
    shape(42, "panel-r", COL_X2, BODY_Y, COL_W, 304, fill(CARD), line(STROKE, 0.75, 12)),
    shape(43, "panel-r-top", COL_X2, BODY_Y, COL_W, 3, fill(GREEN)),
    placeholder(44, "Spalte links", body_ph(1), MARGIN + 26, BODY_Y + 26, COL_W - 52, 254,
                lst_style=col_style, prompt="Spalte links"),
    placeholder(45, "Spalte rechts", body_ph(2), COL_X2 + 26, BODY_Y + 26, COL_W - 52, 254,
                lst_style=col_style_r, prompt="Spalte rechts"),
])

# 4 - Code
rebuild(L[4], "Code", HEAD_BLOCK + [
    shape(50, "code-panel", MARGIN, BODY_Y, CONTENT_W, 300, fill(CODE_BG)),
    shape(51, "code-bar", MARGIN, BODY_Y, 3, 300, fill(GREEN)),
    shape(52, "code-label", W - MARGIN - 160, BODY_Y + 12, 148, 18, body=para(
        run("// code", FONT_M, 10, CODE_MUTED, spc=1.0), align="r")),
    placeholder(53, "Code", body_ph(1), MARGIN + 28, BODY_Y + 40, CONTENT_W - 56, 240,
                lst_style=lvl(1, 13.5, FONT_M, CODE_INK, line_spacing=1.3, space_before=0),
                prompt="Quelltext"),
])

# 5 - Merksatz
rebuild(L[5], "Merksatz", [
    shape(60, "quote-bar", MARGIN, 190, 4, 150, fill(ORANGE)),
    placeholder(61, "Merksatz", body_ph(1), MARGIN + 32, 186, 760, 160,
                lst_style=lvl(1, 30, FONT_B, INK, bold=True, line_spacing=1.28),
                prompt="Merksatz"),
    placeholder(62, "Quelle", body_ph(2), MARGIN + 32, 362, 600, 24,
                lst_style=lvl(1, 12, FONT_H, RED, bold=True, spc=2.4, caps=True),
                prompt="Merksatz"),
])

# 6 - Frei (nur Master)
rebuild(L[6], "Frei", [])

# 7 - Bild rechts (Querformat)
rebuild(L[7], "Bild rechts", HEAD_BLOCK + [
    placeholder(70, "Inhalt", body_ph(1), MARGIN, BODY_Y, 404, 300,
                lst_style=lvl(1, 18, FONT_B, BODY, bullet=(BU_CHAR, RED), marL=20, indent=-20,
                              space_before=11, line_spacing=1.25) +
                          lvl(2, 15, FONT_B, MUTED, bullet=(BU_CHAR, GREEN), marL=44, indent=-20,
                              space_before=5, line_spacing=1.2),
                prompt="Inhalt"),
    shape(71, "bild-rahmen", 506, BODY_Y - 3, 386, 296, "", line(STROKE, 0.75, 14)),
    placeholder(72, "Bild", '<p:ph type="pic" idx="2"/>', 509, BODY_Y, 380, 290),
    placeholder(73, "Quelle", body_ph(11), 509, BODY_Y + 298, 380, 14,
                lst_style=lvl(1, 8, FONT_B, MUTED, line_spacing=1.0), prompt="Quelle"),
])

# 8 - Bild links (Hochformat)
rebuild(L[8], "Bild links", HEAD_BLOCK + [
    shape(80, "bild-rahmen", MARGIN - 3, BODY_Y - 3, 246, 306, "", line(STROKE, 0.75, 14)),
    placeholder(81, "Bild", '<p:ph type="pic" idx="2"/>', MARGIN, BODY_Y, 240, 300),
    placeholder(82, "Quelle", body_ph(11), MARGIN, BODY_Y + 308, 240, 14,
                lst_style=lvl(1, 8, FONT_B, MUTED, line_spacing=1.0), prompt="Quelle"),
    placeholder(83, "Inhalt", body_ph(1), 348, BODY_Y, 540, 300,
                lst_style=lvl(1, 18, FONT_B, BODY, bullet=(BU_CHAR, RED), marL=20, indent=-20,
                              space_before=11, line_spacing=1.25) +
                          lvl(2, 15, FONT_B, MUTED, bullet=(BU_CHAR, GREEN), marL=44, indent=-20,
                              space_before=5, line_spacing=1.2),
                prompt="Inhalt"),
])

# 9 - Begruessung (dunkle Auftaktfolie: Bild randlos links, Gruss und Zitat rechts)
GREET_IMG_W = 312.0
GREET_X = GREET_IMG_W + 24            # 336 - linke Kante des Textbereichs
GREET_W = W - GREET_X - MARGIN        # bis zum rechten Satzspiegel
greet_fld = ('<a:p><a:pPr algn="r"><a:buNone/></a:pPr>'
             f'<a:fld id="{{{str(uuid.uuid4()).upper()}}}" type="slidenum">'
             f'<a:rPr lang="de-DE" sz="1100" b="1" spc="100">{fill(CODE_MUTED)}'
             f'<a:latin typeface="{FONT_H}"/></a:rPr><a:t>1</a:t></a:fld></a:p>')
rebuild(L[9], "Begrüßung", [
    shape(100, "greet-ground", 0, 0, W, H, fill(GREET_BG)),
    placeholder(102, "Bild", '<p:ph type="pic" idx="2"/>', 0, 0, GREET_IMG_W, H),
    # Gruss linksbuendig, Zitat mittig, Urheber rechts - eine Diagonale nach unten rechts
    placeholder(105, "Gruß", TITLE_PH, GREET_X + 57, 168, GREET_W - 57, 76,
                lst_style=lvl(1, 46, FONT_B_LIGHT, ORANGE, line_spacing=1.05,
                              spc=-0.5, align="l"),
                prompt="Good morning!"),
    placeholder(106, "Zitat", body_ph(1), GREET_X + 110, 368, GREET_W - 110, 32,
                lst_style=lvl(1, 17, FONT_B_LIGHT, ORANGE, line_spacing=1.2,
                              align="ctr"),
                prompt="Zitat"),
    # Urheber sitzt rechts unter dem Zitatende, nicht mittig darunter
    placeholder(107, "Urheber", body_ph(3), GREET_X + 220, 404, GREET_W - 220, 20,
                lst_style=lvl(1, 11, FONT_B, CODE_MUTED, line_spacing=1.0, align="ctr"),
                prompt="Urheber"),
    # unser Footer, nur hell statt dunkel - der Master ist auf dieser Folie ausgeblendet
    shape(108, "footer-rule", GREET_X, FOOT_Y, GREET_W, 0.75, fill(CODE_INK, 20)),
    shape(109, "footer-text", GREET_X, FOOT_Y + 8, 480, 18, body=para(
        run(FOOTER_TEXT, FONT_B, 10, CODE_MUTED, spc=1.2)),
        body_pr='<a:bodyPr wrap="none" anchor="t" lIns="0" tIns="0" rIns="0" bIns="0"/>'),
    shape(110, "slide-number", W - MARGIN - 120, FOOT_Y + 6, 120, 20, body=greet_fld,
          body_pr='<a:bodyPr anchor="t" lIns="0" tIns="0" rIns="0" bIns="0"/>'),
])
L[9]._element.set("showMasterSp", "0")   # heller Master-Footer wuerde auf Dunkel verschwinden

for extra in L[10:]:
    prs.slide_layouts.remove(extra)

prs.save(OUT)
write_stamp(OUT, TEMPLATE_ID, TEMPLATE_VERSION, __import__("datetime").date.today().isoformat())
print("written:", OUT, os.path.getsize(OUT), "bytes")
print("layouts:", [l.name for l in prs.slide_layouts])
