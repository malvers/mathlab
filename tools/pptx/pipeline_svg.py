#!/usr/bin/env python3
"""The figures of the docalvers-pipeline deck as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/pipeline_svg.py architektur     # prints the <svg> markup and its labels

Same contract as ai_svg.py (Doc, 23.09.2026: drawn figures in HTML, never a PNG): each figure returns
(svg, labels) - cards, arrows and badges as SVG, every word as an HTML label <p class="fl"> the deck editor
can change. The canvas is the picture box of a content slide, 816 x 330 design pixels.

Doc, 05.11.2026: the PowerPoint "docalvers-pipeline-v2" (Lokal, Git, GitHub, IONOS) as a deck in our format,
plus one slide that shows where Supabase and R2 sit. The numbers on the figures were read on that day:
DNS of docalvers.de, the tables and Edge Functions of the Supabase project, the R2 links in HTML/.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330
BLUE, TEAL, VIOLET = "#2A6FB0", "#14807A", "#6B3FA0"     # deck.css --blue, --teal, --violet
LINE = "#8A99B8"                                          # arrows: a little darker than MUTED, still quiet
HEAD = "font-size:13px;font-weight:600;color:%s" % S.INK


def css(size, color=S.BODY, extra=""):
    return "font-size:%gpx;color:%s%s" % (size, color, ";" + extra if extra else "")


def block_label(x, top, w, lines, size, color=S.BODY, extra=""):
    """Several lines as ONE label whose first line starts at `top` (<nl> breaks the line, so the editor keeps
    them as one text). figure_label centres a single line on y - so y is the middle of the first line."""
    return (x, top + size * 1.28 / 2, w, "<nl>".join(lines), css(size, color, extra))


def framed(c, x, y, w, h, color, rx=9, spine=10, width=2.2):
    """A white box with a coloured spine that stays INSIDE the frame (Doc, 05.11.2026: "die dürfen da nicht drüber
    rausmalen"): white ground, then the spine as the left edge of the same rounded shape, then the frame on top."""
    c.rect(x, y, w, h, fill=S.PAPER, rx=rx)
    c.path("M %g %g H %g V %g H %g A %g %g 0 0 1 %g %g V %g A %g %g 0 0 1 %g %g Z"
           % (x + rx, y, x + spine, y + h, x + rx, rx, rx, x, y + h - rx, y + rx, rx, rx, x + rx, y),
           stroke="none", width=0, fill=color)
    c.rect(x, y, w, h, fill="none", stroke=S.INK, width=width, rx=rx)


def card(c, labels, x, y, w, h, head, lines, color, size=12):
    """A white card with a coloured spine: the heading in Orbitron, the lines right under it."""
    framed(c, x, y, w, h, color, rx=9, spine=10, width=2.2)
    labels.append((x + w / 2 + 4, y + 22, w - 20, "<f2>%s</f2>" % head, HEAD))
    if lines:
        labels.append(block_label(x + w / 2 + 4, y + 42, w - 20, lines, size))


def badge(c, x, y, n, color=S.INK):
    """A step number in a circle, sitting on an arrow or at the start of a line."""
    c.circle(x, y, 11, fill=color, stroke=S.PAPER, width=2)
    c.text(x, y + 4.6, str(n), 13, S.PAPER)


def both_ways(c, x1, y1, x2, y2, color=LINE, width=2.2):
    """An arrow with a head at both ends - reading and writing on the same line."""
    mid = c.arrowhead(color)
    c.raw('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="%s" marker-start="url(#%s)" '
          'marker-end="url(#%s)"/>' % (x1, y1, x2, y2, color, width, mid, mid))


def schreiben():
    """Writing: Mac -> local Git -> GitHub -> GitHub Pages, and pull/clone back to any computer."""
    c = S.Canvas(W, H)
    labels = []
    w, h, y, gap = 174, 138, 52, 38
    xs = [3 + i * (w + gap) for i in range(4)]
    cards = [("LOKAL · MAC", ["~/IdeaProjects/forloop", "bearbeiten: IDE, Claude", "testen: localhost:8765",
                              "→ noch nichts online"], S.GREEN),
             ("GIT · LOKAL", ["git add · git commit", "volle History, auch offline", "Branches · Rollback",
                              "→ immer noch nur bei dir"], S.ORANGE),
             ("GITHUB", ["Repo malvers/mathlab", "Branch main", "Backup, Teamarbeit",
                         "→ öffentlich lesbar"], S.INK),
             ("GITHUB PAGES", ["Action deploy-pages.yml", "packt den Ordner HTML/", "HTML/ = Wurzel der Seite",
                               "→ der echte Webserver"], BLUE)]
    for x, (head, lines, color) in zip(xs, cards):
        card(c, labels, x, y, w, h, head, lines, color)
    steps = ["git add · git commit", "git push", "Push startet den Build"]
    for i, text in enumerate(steps):
        x1, x2 = xs[i] + w + 5, xs[i + 1] - 5
        c.arrow(x1, y + h / 2, x2, y + h / 2, color=S.ORANGE, width=2.6)
        labels.append(((x1 + x2) / 2, 26, 160, "<b>%s</b>" % text, css(12.5, S.INK)))
    # back to any computer: from GitHub down, left, up into the Mac
    gx, mx, by = xs[2] + w / 2, xs[0] + w / 2, y + h + 30
    c.path("M %g %g L %g %g L %g %g" % (gx, y + h + 4, gx, by, mx, by), stroke=LINE, width=2)
    c.arrow(mx, by, mx, y + h + 7, color=LINE, width=2)
    labels.append(((gx + mx) / 2, by + 16, 420, "git pull · git clone — zurück auf jeden Rechner", css(12.5, S.MUTED)))
    labels.append((W / 2, 300, W, "Ein Push auf main — und nach ein bis zwei Minuten steht die Änderung "
                                  "auf docalvers.de.", css(15, S.BODY, "font-weight:500")))
    return c.svg("Vom Mac ins Netz: Lokal, Git, GitHub und GitHub Pages mit git commit, git push "
                 "und dem Build"), labels


def lesen():
    """Reading: the browser asks IONOS' DNS, then fetches the page from GitHub Pages."""
    c = S.Canvas(W, H)
    labels = []
    w, h, y = 200, 112, 14
    xb, xi, xp = 8, 308, 608
    card(c, labels, xb, y, w, h, "BROWSER", ["Besucher tippt", "docalvers.de", "weiß nichts von GitHub"], S.GREEN)
    card(c, labels, xi, y, w, h, "IONOS · DOMAIN", ["Registrar und DNS", "A → 185.199.108–111.153",
                                                    "liefert KEINE Dateien"], S.RED)
    card(c, labels, xp, y, w, h, "GITHUB PAGES", ["Server von GitHub", "liefert HTML · CSS · JS",
                                                  "für docalvers.de"], BLUE)
    # 1 and 2: question and answer between browser and IONOS
    c.arrow(xb + w + 6, y + 40, xi - 6, y + 40, color=S.RED, width=2.4)
    c.arrow(xi - 6, y + 76, xb + w + 6, y + 76, color=S.RED, width=2.4)
    badge(c, (xb + w + xi) / 2, y + 40, 1, S.RED)
    badge(c, (xb + w + xi) / 2, y + 76, 2, S.RED)
    # 3 and 4: request and page between browser and GitHub Pages, under the cards
    yb, y3, y4 = y + h, y + h + 20, y + h + 42
    c.path("M %g %g L %g %g L %g %g" % (126, yb + 4, 126, y3, 690, y3), stroke=BLUE, width=2.4)
    c.arrow(690, y3, 690, yb + 6, color=BLUE, width=2.4)
    c.path("M %g %g L %g %g L %g %g" % (736, yb + 4, 736, y4, 80, y4), stroke=BLUE, width=2.4)
    c.arrow(80, y4, 80, yb + 6, color=BLUE, width=2.4)
    badge(c, 408, y3, 3, BLUE)
    badge(c, 408, y4, 4, BLUE)
    # the four steps in words, each with its badge
    steps = [(S.RED, "Der Browser fragt das DNS: Wo liegt docalvers.de?"),
             (S.RED, "IONOS antwortet mit einer Adresse, z. B. 185.199.108.153 — ein Server von GitHub"),
             (BLUE, "Der Browser fragt diesen Server nach der Seite"),
             (BLUE, "GitHub Pages liefert HTML, CSS und JS — die Adresszeile zeigt weiter docalvers.de")]
    for i, (color, text) in enumerate(steps):
        ly = 208 + i * 30
        badge(c, 74, ly, i + 1, color)
        labels.append((96 + 330, ly, 660, text, css(14, S.BODY, "text-align:left")))
    return c.svg("Ein Besuch auf docalvers.de: der Browser fragt das DNS von IONOS, bekommt die Adresse von "
                 "GitHub Pages und holt dort HTML, CSS und JS"), labels


def architektur():
    """The whole architecture: the visitor reads from three services on the left, the Mac writes to them on the
    right - one row per service, so every arrow is straight and carries its own words."""
    c = S.Canvas(W, H)
    labels = []
    sx, sw, sh = 296, 236, 96
    ys = [6, 117, 228]
    bw = 166
    card(c, labels, 6, 6, bw, 318, "BROWSER", ["lädt die Seite —", "dann holt ihr JavaScript", "Daten und Medien nach",
                                              "", "<b>Beispiele</b>", "Testfragen: Pages", "Abgabe: Supabase",
                                              "Video der Startseite: R2"], S.GREEN)
    card(c, labels, W - bw - 6, 6, bw, 318, "LOKAL · MAC", ["hier wird gebaut", "und getestet:", "Doc und Claude Code",
                                                          "", "<b>Werkzeuge</b>", "git für Pages", "SQL für Supabase",
                                                          "wrangler für R2"], S.GREEN)
    card(c, labels, sx, ys[0], sw, sh, "GITHUB PAGES", ["der Code: HTML · CSS · JS", "für alle Besucher gleich"], BLUE)
    card(c, labels, sx, ys[1], sw, sh, "SUPABASE", ["Postgres-Datenbank, 59 Tabellen", "Login, Regeln je Zeile (RLS)",
                                                    "24 Edge Functions (Server-Code)"], TEAL)
    card(c, labels, sx, ys[2], sw, sh, "CLOUDFLARE R2", ["große Dateien: Videos, Apps", "Vorschaubilder für 1.758 Seiten"],
         VIOLET)
    left, right = 6 + bw, W - bw - 6
    rows = [(BLUE, "Seite laden", "git push"),
            (TEAL, "Daten lesen<nl>und speichern", "SQL und<nl>Functions"),
            (VIOLET, "Medien holen", "Upload mit<nl>wrangler")]
    for i, ((color, read, write), y) in enumerate(zip(rows, ys)):
        ay = y + sh / 2 + 16
        if color == TEAL:
            both_ways(c, left + 6, ay, sx - 6, ay, color=color, width=2.6)
        else:
            c.arrow(left + 6, ay, sx - 6, ay, color=color, width=2.6)
        c.arrow(right - 6, ay, sx + sw + 6, ay, color=color, width=2.2, dash="6 4")
        badge(c, left + 18, ay - 22, i + 1, color)
        labels.append((left + 34 + 45, ay - 22 - (7.7 if "<nl>" in read else 0), 90, "<b>%s</b>" % read,
                       css(12, color, "text-align:left")))
        labels.append(((right + sx + sw) / 2, ay - 22 - (7 if "<nl>" in write else 0), 100, write, css(12, color)))
    return c.svg("Die Architektur von docalvers.de: der Browser holt die Seite von GitHub Pages, liest und speichert "
                 "Daten bei Supabase und holt große Dateien aus Cloudflare R2; der Mac schreibt in alle drei"), labels


def ki():
    """Where the AI sits: you, Claude Code on the Mac, the model at Anthropic - and the chain below."""
    c = S.Canvas(W, H)
    labels = []
    w, h, y = 236, 124, 44
    xs = [8, 290, 572]
    cards = [("DU · MENSCH", ["sagst in Worten, was du willst", "prüfst, was herauskommt",
                              "gibst frei: commit · push", "→ du bleibst der Chef"], S.GREEN),
             ("CLAUDE CODE · MAC", ["Programm im Terminal, in der IDE", "liest und schreibt deine Dateien",
                                    "führt Befehle aus: Tests, git", "zeigt jede Änderung als Diff"], S.ORANGE),
             ("ANTHROPIC · CLOUD", ["dort läuft das Modell (Claude)", "sieht nur, was Claude Code schickt",
                                    "kein Zugriff auf deinen Mac", "→ rechnet, antwortet, fertig"], S.RED)]
    for x, (head, lines, color) in zip(xs, cards):
        card(c, labels, x, y, w, h, head, lines, color, size=11.5)
    talk = ["Auftrag in Worten<nl>Rückfrage · Diff", "Prompt und Dateiausschnitte<nl>Antwort und Änderungen"]
    for i, text in enumerate(talk):
        x1, x2 = xs[i] + w + 6, xs[i + 1] - 6
        both_ways(c, x1, y + h / 2, x2, y + h / 2, color=LINE, width=2.4)
        labels.append(block_label((x1 + x2) / 2, 6, 220, text.split("<nl>"), 11.5, S.MUTED))
    # the chain from the writing slide, small
    cw, cg, cy, ch = 132, 37, 236, 48
    chain = [("LOKAL · MAC", S.GREEN), ("GIT", S.ORANGE), ("GITHUB", S.INK), ("GITHUB PAGES", BLUE), ("BESUCHER", S.GREEN)]
    cxs = [4 + i * (cw + cg) for i in range(5)]
    for x, (head, color) in zip(cxs, chain):
        framed(c, x, cy, cw, ch, color, rx=7, spine=8, width=1.8)
        labels.append((x + cw / 2 + 3, cy + ch / 2, cw - 12, "<f2>%s</f2>" % head,
                       "font-size:11px;font-weight:600;color:%s" % S.INK))
    for i in range(4):
        c.arrow(cxs[i] + cw + 4, cy + ch / 2, cxs[i + 1] - 4, cy + ch / 2, color=S.ORANGE, width=2)
    # Claude Code writes into the files on the Mac
    ccx = xs[1] + w / 2
    c.path("M %g %g L %g %g L %g %g" % (ccx, y + h + 4, ccx, 206, cxs[0] + cw / 2, 206), stroke=S.ORANGE, width=2.2)
    c.arrow(cxs[0] + cw / 2, 206, cxs[0] + cw / 2, cy - 5, color=S.ORANGE, width=2.2)
    labels.append(((ccx + cxs[0] + cw / 2) / 2, 192, 280, "schreibt und testet in deinen Dateien", css(12, S.MUTED)))
    labels.append((W / 2, 310, W, "Anthropic steht nur ganz am Anfang der Kette — was online geht, entscheidest du.",
                   css(15, S.BODY, "font-weight:500")))
    return c.svg("Wo die KI sitzt: du gibst Aufträge, Claude Code arbeitet auf dem Mac, das Modell rechnet bei "
                 "Anthropic; darunter die Kette Mac, Git, GitHub, GitHub Pages, Besucher"), labels


FIGURES = {"schreiben": schreiben, "lesen": lesen, "architektur": architektur, "ki": ki}

if __name__ == "__main__":
    svg, labels = FIGURES[sys.argv[1]]()
    print(svg)
    for lab in labels:
        print("<!-- label %g %g %g: %s -->" % (lab[0], lab[1], lab[2], lab[3]))
