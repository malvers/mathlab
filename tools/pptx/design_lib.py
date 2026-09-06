#!/usr/bin/env python3
"""Shared design system for Doc Alvers' Informatik decks.

Everything visual lives in the slide master and its layouts - never on single slides.
Headers: Orbitron. Body: Raleway. Code: Menlo.
"""
import html
from PIL import Image, ImageDraw

# ---------------------------------------------------------------- palette ----
BG_TL   = (255, 255, 255)  # paper white, top left
BG_BR   = (176, 196, 226)  # cool light blue, bottom right
INK     = "0E244E"         # headings - dark blue, never black
BODY    = "2C3C60"
MUTED   = "6E7E9F"
STROKE  = "0E244E"         # hairlines and outlines on the light ground
CARD    = "FFFFFF"
CODE_BG = "0E244E"         # code stays dark on the light page
GREET_BG = "000028"        # Auftaktfolie: dunkler als der Code-Grund, rgb(0,0,40)
CODE_INK = "E6ECF8"
CODE_MUTED = "7E8FB5"
ORANGE  = "F5C242"         # lambda
RED     = "B02418"         # ypsilon
GREEN   = "799E31"         # phi
PANEL   = "FFFFFF"

FONT_H, FONT_B, FONT_M = "Orbitron", "Raleway", "Menlo"
FONT_B_LIGHT = "Raleway Light"     # eigene Schnitte - PowerPoint fuehrt sie als
FONT_B_MEDIUM = "Raleway Medium"   # eigenstaendige Schriften, nicht als b="1"

# Identity of this design. Every deck built from it carries these two values as
# an invisible custom property (stamp.py), which is how restyle.py finds the
# decks again later. Bump TEMPLATE_VERSION whenever the master changes.
TEMPLATE_ID = "informatik-hell"
TEMPLATE_VERSION = 4
BU_FONT, BU_CHAR = "Wingdings", "n"   # measured: the only square PowerPoint really draws

# ------------------------------------------------------------- geometry (pt) -
W, H     = 960.0, 540.0
MARGIN   = 72.0
CONTENT_W = W - 2 * MARGIN          # 816
TITLE_Y  = 56.0
RULE_Y   = 116.0
BODY_Y   = 146.0
BODY_H   = 330.0
FOOT_Y   = 504.0

FOOTER_TEXT = "Nicht verzagen, Doc Alvers fragen!"


def emu(pt):
    return int(round(pt * 12700))


# ------------------------------------------------------------- background ----
def make_background(path, w=1920, h=1080):
    """Diagonal navy gradient + two soft accent glows + a faint dot grid."""
    sw, sh = 96, 54
    base = Image.new("RGB", (sw, sh))
    px = base.load()
    for y in range(sh):
        for x in range(sw):
            t = 0.62 * (x / (sw - 1)) + 0.38 * (y / (sh - 1))
            px[x, y] = tuple(int(BG_TL[i] + (BG_BR[i] - BG_TL[i]) * t) for i in range(3))
    img = base.resize((w, h), Image.BICUBIC).convert("RGBA")

    def glow(cx, cy, radius, rgb, strength):
        gw, gh = 128, 72
        m = Image.new("L", (gw, gh), 0)
        mp = m.load()
        for y in range(gh):
            for x in range(gw):
                dx = (x / gw - cx) * (gw / gh)
                dy = y / gh - cy
                d = (dx * dx + dy * dy) ** 0.5 / radius
                mp[x, y] = 0 if d >= 1 else int(strength * 255 * (1 - d) ** 2)
        m = m.resize((w, h), Image.BICUBIC)
        img.paste(Image.new("RGBA", (w, h), rgb + (255,)), (0, 0), m)

    glow(0.84, 0.10, 0.62, (245, 194, 66), 0.16)
    glow(0.04, 0.96, 0.55, (121, 158, 49), 0.10)

    dots = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    d = ImageDraw.Draw(dots)
    step = 48
    for y in range(step, h, step):
        for x in range(step, w, step):
            d.rectangle([x, y, x + 1, y + 1], fill=(14, 36, 78, 26))
    img = Image.alpha_composite(img, dots)
    img.convert("RGB").save(path, "PNG")
    return path


# -------------------------------------------------------------- XML helpers --
NS = ('xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
      'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"')


def fill(color, alpha=None):
    a = f'<a:alpha val="{int(alpha * 1000)}"/>' if alpha is not None else ""
    return f'<a:solidFill><a:srgbClr val="{color}">{a}</a:srgbClr></a:solidFill>'


def line(color, width_pt, alpha=None):
    return f'<a:ln w="{emu(width_pt)}">{fill(color, alpha)}</a:ln>'


NOLINE = '<a:ln><a:noFill/></a:ln>'


def run(text, font=FONT_B, size=18, color=BODY, bold=False, spc=0, caps=False):
    cap = ' cap="all"' if caps else ""
    text = html.escape(text, quote=False)
    return (f'<a:r><a:rPr lang="de-DE" sz="{int(size * 100)}" b="{1 if bold else 0}" '
            f'spc="{int(spc * 100)}"{cap} dirty="0">{fill(color)}'
            f'<a:latin typeface="{font}"/><a:cs typeface="{font}"/></a:rPr>'
            f'<a:t>{text}</a:t></a:r>')


def para(runs_xml, align="l", space_before=0, line_spacing=None, marL=0, indent=0, bullet=None):
    ln = f'<a:lnSpc><a:spcPct val="{int(line_spacing * 100000)}"/></a:lnSpc>' if line_spacing else ""
    sb = f'<a:spcBef><a:spcPts val="{int(space_before * 100)}"/></a:spcBef>' if space_before else ""
    bu = ('<a:buNone/>' if bullet is None else
          f'<a:buClr><a:srgbClr val="{bullet[1]}"/></a:buClr>'
          f'<a:buSzPct val="55000"/><a:buFont typeface="{BU_FONT}"/><a:buChar char="{BU_CHAR}"/>')
    return (f'<a:p><a:pPr algn="{align}" marL="{emu(marL)}" indent="{emu(indent)}">'
            f'{ln}{sb}{bu}</a:pPr>{runs_xml}</a:p>')


def shape(sid, name, x, y, w, h, fill_xml="", line_xml=NOLINE, geom="rect",
          body="", body_pr='<a:bodyPr/>'):
    return (f'<p:sp {NS}><p:nvSpPr><p:cNvPr id="{sid}" name="{name}"/>'
            f'<p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>'
            f'<a:xfrm><a:off x="{emu(x)}" y="{emu(y)}"/><a:ext cx="{emu(w)}" cy="{emu(h)}"/></a:xfrm>'
            f'<a:prstGeom prst="{geom}"><a:avLst/></a:prstGeom>{fill_xml or "<a:noFill/>"}{line_xml}'
            f'</p:spPr><p:txBody>{body_pr}<a:lstStyle/>{body or "<a:p/>"}</p:txBody></p:sp>')


def placeholder(sid, name, ph_xml, x, y, w, h, lst_style="", anchor="t", prompt="",
                wrap="square", autofit='<a:normAutofit/>'):
    body_pr = (f'<a:bodyPr wrap="{wrap}" anchor="{anchor}" lIns="0" tIns="0" rIns="0" bIns="0">'
               f'{autofit}</a:bodyPr>')
    txt = para(run(prompt), align="l") if prompt else "<a:p/>"
    return (f'<p:sp {NS}><p:nvSpPr><p:cNvPr id="{sid}" name="{name}"/>'
            f'<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr>{ph_xml}</p:nvPr></p:nvSpPr>'
            f'<p:spPr><a:xfrm><a:off x="{emu(x)}" y="{emu(y)}"/>'
            f'<a:ext cx="{emu(w)}" cy="{emu(h)}"/></a:xfrm>'
            f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>'
            f'<p:txBody>{body_pr}<a:lstStyle>{lst_style}</a:lstStyle>{txt}</p:txBody></p:sp>')


def lvl(n, size, font=FONT_B, color=BODY, bold=False, bullet=None, marL=0, indent=0,
        space_before=0, line_spacing=None, spc=0, caps=False, align="l"):
    ln = f'<a:lnSpc><a:spcPct val="{int(line_spacing * 100000)}"/></a:lnSpc>' if line_spacing else ""
    sb = f'<a:spcBef><a:spcPts val="{int(space_before * 100)}"/></a:spcBef>'
    bu = ('<a:buNone/>' if bullet is None else
          f'<a:buClr><a:srgbClr val="{bullet[1]}"/></a:buClr><a:buSzPct val="55000"/>'
          f'<a:buFont typeface="{BU_FONT}"/><a:buChar char="{BU_CHAR}"/>')
    cap = ' cap="all"' if caps else ""
    return (f'<a:lvl{n}pPr marL="{emu(marL)}" indent="{emu(indent)}" algn="{align}">{ln}{sb}{bu}'
            f'<a:defRPr sz="{int(size * 100)}" b="{1 if bold else 0}" spc="{int(spc * 100)}"{cap}>'
            f'{fill(color)}<a:latin typeface="{font}"/><a:cs typeface="{font}"/></a:defRPr>'
            f'</a:lvl{n}pPr>')
