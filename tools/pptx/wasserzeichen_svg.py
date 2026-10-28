#!/usr/bin/env python3
"""The watermark deck's figures as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/wasserzeichen_svg.py glocke     # prints the <svg> markup

Same contract as ai_svg.py (Doc, 23.09.2026: drawn figures in HTML, never a PNG): each figure returns
(svg, labels) - shapes, arrows and numbers as SVG, every word as an HTML label <p class="fl"> the deck
editor can change. The canvas is the picture box of a content slide, 816 x 330 design pixels.

The principle drawn here is the green/red list of Kirchenbauer et al. (ICML 2023); turnier() shows the
tournament sampling of Google DeepMind's SynthID-Text (Nature 2024), which Claude's watermark follows.
Every number on a figure is computed in this file, none is typed in.
"""
import math
import os
import random
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S
from ai_svg import text_width

W, H = 816, 330
GREEN_BG = "#EEF4E2"      # S.GREEN on paper at ~12 % - the fill of a green chip
RED_BG = "#F6E4E2"        # S.RED on paper at ~12 %

# the next-word candidates after "Heute ist das Wetter ..." and which list the key puts them on
CANDS = [("schön", 0.24, False), ("sonnig", 0.21, True), ("herrlich", 0.14, True),
         ("warm", 0.12, False), ("gut", 0.09, False), ("mild", 0.06, True)]
REST = 0.14               # all other words together; half of them green, half red
DELTA = 2.0               # the green bonus on the logits, Kirchenbauer's usual value


def css(size, color=S.INK, extra=""):
    return "font-size:%gpx;color:%s%s" % (size, color, ";" + extra if extra else "")


def with_bonus():
    """The candidates' chances after the green bonus: green x e^DELTA, then back to 100 %."""
    k = math.exp(DELTA)
    raw = [(w, p * k if g else p, g) for w, p, g in CANDS]
    total = sum(p for _, p, _ in raw) + REST / 2 * k + REST / 2
    return [(w, p / total, g) for w, p, g in raw]


def word_chip(c, labels, x, y, word, green, size=17, h=44, pad=11):
    """A word in a coloured box; returns the box width."""
    bw = max(30, text_width(word, size) + 2 * pad)
    c.rect(x, y, bw, h, fill=GREEN_BG if green else RED_BG,
           stroke=S.GREEN if green else S.RED, width=2.6, rx=8)
    labels.append((x + bw / 2, y + h / 2, bw - 4, word, css(size)))
    return bw


def spielraum():
    """Next-word chances after "Heute ist das Wetter ..." - several words fit almost equally well."""
    c = S.Canvas(W, H)
    labels = [(W / 2, 22, 700, "„Heute ist das Wetter …“ — welches Wort kommt als Nächstes?",
               css(17, extra="font-weight:600"))]
    x0, top, rh, bh, scale = 250, 54, 33, 22, 1500.0
    rows = [(w, p) for w, p, _ in CANDS] + [("alle anderen", REST)]
    for i, (word, p) in enumerate(rows):
        y = top + i * rh
        c.rect(x0, y, p * scale, bh, fill=S.MUTED if word == "alle anderen" else S.ORANGE, rx=5)
        c.text(x0 + p * scale + 10, y + bh / 2 + 5, "%d %%" % round(p * 100), 14, S.INK, "start")
        labels.append((x0 - 80, y + bh / 2, 140, word, css(16, extra="text-align:right")))
    labels.append((W / 2, 302, W, "Mehrere Wörter passen fast gleich gut — in diesem Spielraum "
                                  "versteckt sich das Wasserzeichen.", css(15, S.BODY)))
    return c.svg("Wahrscheinlichkeiten für das nächste Wort nach „Heute ist das Wetter“: "
                 "schön 24 %, sonnig 21 %, herrlich 14 %, warm 12 %, gut 9 %, mild 6 %"), labels


def key_icon(c, x, y, color=S.ORANGE):
    """A plain key: ring, shaft, two teeth."""
    c.circle(x, y, 12, fill=S.PAPER, stroke=color, width=4)
    c.line(x + 12, y, x + 58, y, color, 4)
    c.line(x + 44, y, x + 44, y + 11, color, 4)
    c.line(x + 54, y, x + 54, y + 9, color, 4)


def schluessel():
    """Previous word + secret key -> random generator -> the vocabulary split into green and red."""
    c = S.Canvas(W, H)
    labels = []
    # inputs
    c.rect(30, 40, 220, 80, fill=S.PAPER, stroke=S.INK, width=2.4, rx=10)
    labels.append((140, 58, 200, "vorheriges Wort", css(14, S.MUTED)))
    c.rect(100, 74, 80, 34, fill="#F4F7FC", stroke=S.INK, width=2, rx=7)
    labels.append((140, 91, 76, "ist", css(18)))
    c.rect(30, 150, 220, 80, fill=S.PAPER, stroke=S.INK, width=2.4, rx=10)
    key_icon(c, 58, 190)
    labels.append((180, 190, 110, "geheimer Schlüssel", css(15)))
    # generator
    c.rect(310, 95, 180, 90, fill="#F4F7FC", stroke=S.INK, width=2.6, rx=12)
    labels.append((400, 128, 170, "Zufallsgenerator", css(16, extra="font-weight:600")))
    labels.append((400, 156, 170, "aus Wort + Schlüssel", css(13, S.MUTED)))
    c.arrow(250, 80, 304, 122, S.INK, 2.2)
    c.arrow(250, 190, 304, 160, S.INK, 2.2)
    # the two halves
    for y, green, head, words, sub in ((25, True, "grüne Liste", "sonnig · herrlich · mild · …",
                                        "eine Hälfte aller Wörter"),
                                       (165, False, "rote Liste", "schön · warm · gut · …",
                                        "die andere Hälfte")):
        color = S.GREEN if green else S.RED
        c.rect(560, y, 230, 110, fill=GREEN_BG if green else RED_BG, stroke=color, width=3, rx=12)
        labels.append((675, y + 24, 210, head, css(16, color, "font-weight:600")))
        labels.append((675, y + 60, 220, words, css(16)))
        labels.append((675, y + 88, 210, sub, css(12.5, S.MUTED)))
    c.arrow(490, 125, 554, 82, S.GREEN, 2.6)
    c.arrow(490, 160, 554, 210, S.RED, 2.6)
    labels.append((W / 2, 306, W, "Für jedes neue Wort wird neu geteilt. Ohne Schlüssel sieht die Teilung "
                                  "aus wie reiner Zufall.", css(15, S.BODY)))
    return c.svg("Das vorherige Wort und ein geheimer Schlüssel steuern einen Zufallsgenerator, "
                 "der den Wortschatz in eine grüne und eine rote Liste teilt"), labels


def bonus():
    """The same candidates before and after the green bonus - the ranking tips towards green."""
    c = S.Canvas(W, H)
    labels = []
    base, scale, bw, step = 236, 450.0, 40, 58
    panels = ((210, [(w, p, g) for w, p, g in CANDS], "ohne Wasserzeichen"),
              (606, with_bonus(), "mit Wasserzeichen: Grün bekommt einen Bonus"))
    for cx, rows, head in panels:
        labels.append((cx, 22, 380, head, css(16, extra="font-weight:600")))
        x = cx - step * len(rows) / 2
        c.line(x - 6, base, x + step * len(rows) + 6, base, S.MUTED, 1.4)
        for word, p, green in rows:
            mid = x + step / 2
            c.rect(mid - bw / 2, base - p * scale, bw, p * scale, fill=S.GREEN if green else S.RED, rx=4)
            c.text(mid, base - p * scale - 8, "%d %%" % round(p * 100), 13, S.INK)
            labels.append((mid, base + 18, step, word, css(13.5)))
            x += step
    c.arrow(392, 150, 420, 150, S.INK, 2.4)
    labels.append((W / 2, 302, W, "Die Rangfolge kippt: Rote Wörter werden selten, grüne häufig — "
                                  "und jedes davon passt in den Satz.", css(15, S.BODY)))
    return c.svg("Balken der Wortwahrscheinlichkeiten vor und nach dem Bonus für grüne Wörter: "
                 "sonnig steigt von 21 auf 38 Prozent, schön fällt von 24 auf 6 Prozent"), labels


HUMAN = [("Am", True), ("Wochenende", False), ("fahren", False), ("wir", True), ("mit", True),
         ("dem", False), ("Fahrrad", True), ("an", False), ("den", False), ("See.", True)]
MACHINE = [("Bei", True), ("sonnigem", True), ("Wetter", True), ("lohnt", False), ("sich", True),
           ("ein", True), ("Ausflug", True), ("zum", True), ("nahen", True), ("Badesee.", True)]


def satz():
    """Two sentences coloured with the key: a person's about half green, the watermarked one far more."""
    c = S.Canvas(W, H)
    labels = []
    gap = 7
    for y, head, words, verdict in ((44, "Ein Mensch schreibt:", HUMAN, "wie beim Münzwurf"),
                                    (172, "Die KI mit Wasserzeichen schreibt:", MACHINE, "auffällig viele")):
        labels.append((W / 2, y - 20, 500, head, css(15, S.MUTED)))
        widths = [max(30, text_width(w, 17) + 22) for w, _ in words]
        x = (W - sum(widths) - gap * (len(words) - 1)) / 2
        for (word, green), bw in zip(words, widths):
            word_chip(c, labels, x, y, word, green)
            x += bw + gap
        n = sum(1 for _, g in words if g)
        labels.append((W / 2, y + 66, 600, "%d von %d Wörtern grün — %s" % (n, len(words), verdict),
                       css(16, extra="font-weight:600")))
    labels.append((W / 2, 300, W, "Beide Sätze lesen sich ganz normal. Die Farben sieht nur, "
                                  "wer den Schlüssel hat.", css(15, S.BODY)))
    return c.svg("Zwei Sätze, jedes Wort grün oder rot gefärbt: beim Menschen 5 von 10 grün, "
                 "beim KI-Text mit Wasserzeichen 9 von 10"), labels


T_WORDS, GAMMA, G_MACHINE, Z_LIMIT = 200, 0.5, 150, 4


def glocke():
    """How many green words a person's 200-word text has - a bell around 100 - and where a
    watermarked text lands. Normal approximation of the binomial distribution."""
    mu = T_WORDS * GAMMA
    sigma = math.sqrt(T_WORDS * GAMMA * (1 - GAMMA))
    p = S.Plot((55, 165), (0, 0.064), w=W, h=H, pad=(30, 30, 46, 58))
    labels = []

    def f(x):
        return math.exp(-((x - mu) / sigma) ** 2 / 2) / (sigma * math.sqrt(2 * math.pi))

    p.area(f, mu - 2 * sigma, mu + 2 * sigma, fill=S.GREEN, opacity=0.25)
    p.curve(f, 55, 165, color=S.INK, width=2.4)
    # x axis by hand - Plot.axes would put the y axis at x = 0, far left of this window
    y0 = p.Y(0)
    p.arrow(p.X(55), y0, p.X(165), y0, S.INK, 1.3)
    for u in range(60, 161, 10):
        p.line(p.X(u), y0 - 3.5, p.X(u), y0 + 3.5, S.INK, 1.1)
        p.text(p.X(u), y0 + 18, str(u), 12, S.MUTED)
    # threshold z = 4 and the watermarked text
    limit = mu + Z_LIMIT * sigma
    p.line(p.X(limit), y0, p.X(limit), p.Y(0.05), S.ORANGE, 2.4, dash="6 5")
    labels.append((p.X(limit), p.Y(0.05) - 14, 160, "Schwelle z = %d" % Z_LIMIT, css(14, S.BODY)))
    z = (G_MACHINE - mu) / sigma
    p.line(p.X(G_MACHINE), y0, p.X(G_MACHINE), p.Y(0.035), S.RED, 3)
    p.circle(p.X(G_MACHINE), p.Y(0.035), 6, fill=S.RED)
    labels.append((p.X(G_MACHINE), p.Y(0.035) - 44, 220, "KI-Text mit Wasserzeichen",
                   css(15, S.RED, "font-weight:600")))
    labels.append((p.X(G_MACHINE), p.Y(0.035) - 22, 220,
                   ("%d grüne → z ≈ %.1f" % (G_MACHINE, z)).replace(".", ","), css(15)))
    labels.append((p.X(mu), 24, 300, "Texte von Menschen: um %d grüne" % mu, css(15, extra="font-weight:600")))
    labels.append((p.X(mu), p.Y(0.012), 120, "%d bis %d" % (round(mu - 2 * sigma), round(mu + 2 * sigma)),
                   css(13, S.BODY)))
    labels.append((W / 2, 314, W, "Anzahl grüner Wörter in einem Text mit %d Wörtern" % T_WORDS, css(14, S.MUTED)))
    return p.svg("Glockenkurve um 100 grüne Wörter für Texte von Menschen, Schwelle bei z gleich 4, "
                 "der KI-Text mit 150 grünen Wörtern liegt weit rechts außerhalb"), labels


def turnier():
    """SynthID-Text's tournament, cut down to four candidates and two rounds: the word whose secret
    test g gives 1 wins its match, so the finished text holds conspicuously many words with g = 1."""
    c = S.Canvas(W, H)
    labels = []
    cw, ch = 124, 38
    col1 = [("sonnig", 62, 1), ("schön", 128, 0), ("herrlich", 194, 0), ("warm", 260, 1)]   # g1
    col2 = [("sonnig", 95, 1), ("warm", 227, 0)]                                              # g2
    win = ("sonnig", 161)
    x1, x2, x3 = 110, 420, 700

    def chip(cx, cy, word, color=S.INK, thick=2.2, fill=S.PAPER):
        c.rect(cx - cw / 2, cy - ch / 2, cw, ch, fill=fill, stroke=color, width=thick, rx=8)
        labels.append((cx, cy, cw - 6, word, css(16)))

    def badge(cx, cy, g):
        c.circle(cx, cy, 13, fill=S.PAPER, stroke=S.GREEN if g else S.RED, width=2.6)
        c.text(cx, cy + 5, str(g), 14, S.INK, weight="600")

    def bracket(a, b, xa, xb, winner_y):
        mid = (xa + xb) / 2
        for y in (a, b):
            won = y == winner_y
            c.line(xa, y, mid, y, S.INK if won else S.MUTED, 2.6 if won else 1.4)
        c.line(mid, a, mid, b, S.MUTED, 1.4)
        c.line(mid, (a + b) / 2, xb, (a + b) / 2, S.INK, 2.6)

    bracket(62, 128, x1 + cw / 2 + 16, x2 - cw / 2, 62)
    bracket(194, 260, x1 + cw / 2 + 16, x2 - cw / 2, 260)
    bracket(95, 227, x2 + cw / 2 + 16, x3 - cw / 2, 95)
    for word, y, g in col1:
        chip(x1, y, word)
        badge(x1 + cw / 2 + 2, y, g)
    for word, y, g in col2:
        chip(x2, y, word)
        badge(x2 + cw / 2 + 2, y, g)
    chip(x3, win[1], win[0], S.GREEN, 3.4, GREEN_BG)
    labels.append((x1, 22, 230, "4 Vorschläge des Modells", css(14, S.MUTED)))
    labels.append((x2, 22, 200, "Runde 1 gewonnen", css(14, S.MUTED)))
    labels.append((x3, 22, 200, "Runde 2: Sieger", css(14, S.MUTED)))
    labels.append((x3, win[1] + 40, 220, "kommt in den Text", css(14, S.GREEN, "font-weight:600")))
    labels.append((W / 2, 304, W, "Die Zahl am Rand ist ein Geheimtest g aus Schlüssel und Kontext: "
                                  "wer eine 1 hat, gewinnt (Gleichstand: Münzwurf). "
                                  "Im fertigen Text stecken darum auffällig viele Wörter mit g = 1.",
                   css(14, S.BODY)))
    return c.svg("Turnier zwischen vier Wortvorschlägen in zwei Runden; in jeder Runde gewinnt das Wort, "
                 "dessen Geheimtest eine 1 ergibt; Sieger ist sonnig"), labels



PROVIDERS = ("Anthropic", "OpenAI", "DeepSeek")
P_MARKED = 0.75           # share of green words in a marked text - the strength assumed for every provider


def attribution(T, counts):
    """Bayes over four options - Anthropic, OpenAI, DeepSeek, none of them (a person or another model) - all equally likely
    beforehand. A provider's factor is P(G | marked) / P(G | chance) = (2p)^G * (2(1-p))^(T-G); the last option
    gets 1. Returns [(name, probability)] and the z value of every count."""
    lf = [G * math.log(2 * P_MARKED) + (T - G) * math.log(2 * (1 - P_MARKED)) for G in counts]
    top = max(lf + [0.0])
    w = [math.exp(v - top) for v in lf] + [math.exp(-top)]
    total = sum(w)
    names = list(PROVIDERS) + ["keiner der drei"]
    z = [(G - T * GAMMA) / math.sqrt(T * GAMMA * (1 - GAMMA)) for G in counts]
    return [(n, x / total) for n, x in zip(names, w)], z


def pct(p):
    """A probability as the slide shows it: no false precision, no 0 % that is not zero."""
    q = 100 * p
    if q > 99.9:
        return "> 99,9 %"
    if q < 0.05:
        return "≈ 0 %"
    if q < 1:
        return ("%.1f %%" % q).replace(".", ",")
    return "%d %%" % round(q)


def wer_wars(desc, T, counts, verdict):
    """One attribution example: every provider counts green words with its own key (left), Bayes turns the three
    counts into percentages (right). counts = green words under the Anthropic, OpenAI, DeepSeek key."""
    c = S.Canvas(W, H)
    probs, z = attribution(T, counts)
    labels = [(W / 2, 20, W, desc, css(16, extra="font-weight:600"))]
    labels.append((205, 56, 360, "jeder zählt mit seinem eigenen Schlüssel", css(13.5, S.MUTED)))
    for i, (name, G) in enumerate(zip(PROVIDERS, counts)):
        y = 98 + i * 56
        key_icon(c, 34, y)
        labels.append((160, y, 110, name, css(16, extra="font-weight:600;text-align:left")))
        labels.append((310, y - 10, 150, "%d von %d grün" % (G, T), css(14)))
        labels.append((310, y + 11, 150, ("z = %.1f" % z[i]).replace(".", ",").replace("-", "−"), css(14, S.MUTED)))
    c.line(400, 50, 400, 244, S.MUTED, 1.2, dash="4 4")
    labels.append((610, 56, 380, "Wer war's?", css(13.5, S.MUTED)))
    best = max(p for _, p in probs)
    x0, maxw = 540, 190.0
    for i, (name, p) in enumerate(probs):
        y = 92 + i * 44
        human = i == len(probs) - 1
        color = S.MUTED if human else (S.GREEN if p == best and p > 0.9 else S.ORANGE)
        c.rect(x0, y - 12, max(2.0, p * maxw), 24, fill=color, rx=5)
        c.text(x0 + max(2.0, p * maxw) + 8, y + 5, pct(p), 14, S.INK, "start")
        labels.append((475, y, 120, name, css(14.5, extra="text-align:right")))
    labels.append((W / 2, 276, W, verdict, css(17, S.RED if best < 0.9 else S.INK, "font-weight:600")))
    labels.append((W / 2, 312, W, "Annahme: vorher alle vier gleich wahrscheinlich, markierter Text 75 % grün. "
                                  "Zählungen ausgedacht, Rechnung echt.",
                   css(12.5, S.MUTED)))
    return c.svg("Drei Zählungen mit den Schlüsseln von Anthropic, OpenAI und DeepSeek und die daraus berechneten "
                 "Wahrscheinlichkeiten: " + ", ".join("%s %s" % (n, pct(p)) for n, p in probs)), labels


# The essay of Beispiel 1 (Doc, 28.10.2026: "einen Text mit diesen 200 Wörtern, wo die nochmal markiert sind").
# Written for the slide, 200 words exactly; spliced into HTML/decks/ai-wasserzeichen.html as its own slide.
AUFSATZ = (
    "Soziale Medien prägen heute den Alltag vieler Jugendlicher. Schon morgens greifen viele zuerst zum Smartphone, "
    "um Nachrichten zu lesen und neue Beiträge zu entdecken. Plattformen wie Instagram, TikTok oder WhatsApp "
    "verbinden Freunde, auch wenn sie weit voneinander entfernt wohnen. Das hat klare Vorteile: Man bleibt in "
    "Kontakt, teilt Erlebnisse und findet schnell Gleichgesinnte. Gleichzeitig entstehen jedoch auch Probleme. "
    "Viele Nutzer verbringen täglich mehrere Stunden online und merken kaum, wie rasch die Zeit vergeht. Ständige "
    "Benachrichtigungen stören die Konzentration beim Lernen. Außerdem zeigen die Bilder im Netz meist nur die "
    "schönsten Momente. Wer sich dauernd mit makellosen Körpern und Traumurlauben vergleicht, fühlt sich schnell "
    "unzufrieden. Hinzu kommt die Frage, was mit den eigenen Daten geschieht. Jeder Klick wird gespeichert und "
    "ausgewertet, damit Werbung gezielter passt. Deshalb ist ein bewusster Umgang besonders wichtig. Jugendliche "
    "sollten feste Zeiten ohne Handy einplanen und Benachrichtigungen gezielt abschalten. Eltern und Schulen "
    "können dabei helfen, indem sie offen über Chancen und Risiken sprechen. Entscheidend ist, dass man die "
    "Plattformen nutzt, statt von ihnen genutzt zu werden. Wer kritisch bleibt und regelmäßig Pausen einlegt, kann "
    "die Vorteile genießen, ohne die Nachteile zu unterschätzen. Soziale Medien sind weder gut noch schlecht: Es "
    "kommt darauf an, wie wir sie verwenden.")
# small words with no real choice - here the watermark cannot push, they stay a coin toss
FILLER = set("der die das den dem des ein eine einen einem einer eines und oder zu zum im in mit von auf an am für "
             "ist sind wird es man sie wir wer was wie sich nur auch noch schon nicht um bei beim aus über ohne statt "
             "dass damit indem kann können sollten hat ihnen dabei weder darauf kommt".split())


def aufsatz(green_total=148, seed=7):
    """The essay coloured as the Anthropic key would show it. An illustration, not a real run: a word with room for
    choice is green with probability 0.93, a FILLER word only 0.5, then the total is nudged to green_total (the 148
    of Beispiel 1). Returns [(word, green)]."""
    words = AUFSATZ.split()
    assert len(words) == 200, len(words)
    rnd = random.Random(seed)
    core = [re.sub(r"[^\wäöüß]", "", w.lower()) for w in words]
    green = [rnd.random() < (0.5 if c in FILLER else 0.93) for c in core]
    while sum(green) < green_total:            # one more green: a red content word first
        pool = [i for i, g in enumerate(green) if not g and core[i] not in FILLER] or \
               [i for i, g in enumerate(green) if not g]
        green[rnd.choice(pool)] = True
    while sum(green) > green_total:            # one more red: a green filler word first
        pool = [i for i, g in enumerate(green) if g and core[i] in FILLER] or [i for i, g in enumerate(green) if g]
        green[rnd.choice(pool)] = False
    return list(zip(words, green))


def aufsatz_body(key="Anthropic"):
    """The slide's picture box: count line, the essay with every word on a green or red ground, the note."""
    rows = aufsatz()
    n = sum(1 for _, g in rows if g)
    red_filler = sum(1 for w, g in rows if not g and re.sub(r"[^\wäöüß]", "", w.lower()) in FILLER)
    ground = {True: "rgba(121,158,49,.42)", False: "rgba(176,36,24,.32)"}
    text = " ".join('<span style="background:%s;border-radius:3px;padding:0 2px">%s</span>'
                    % (ground[g], S.esc(w)) for w, g in rows)
    return ('<p class="fl" style="left:0px;top:0px;width:816px;font-size:16px;font-weight:600;color:%s">'
            'Mit dem %s-Schlüssel gelesen: %d von %d Wörtern grün, %d rot</p>'
            '<p class="fl" style="left:0px;top:30px;width:816px;font-size:12.5px;line-height:1.75;'
            'text-align:justify;color:%s">%s</p>'
            '<p class="fl" style="left:0px;top:306px;width:816px;font-size:13px;color:%s">Rot sind vor allem kleine '
            'Wörter ohne Spielraum („die“, „und“, „zu“: %d der %d roten). Färbung zur Veranschaulichung.</p>'
            % (S.INK, key, n, len(rows), len(rows) - n, S.INK, text, S.BODY, red_filler, len(rows) - n)), n


# ------------------------------------------------------------------ a net learns to add (before the lab) ---
# Doc, 28.10.2026: "am Perzeptron ... wie addiere ich fünf und zwei, so dass 7 rauskommt ... den Algorithmus aber
# nicht ausführen, sondern einfach nur zeigen, dass die Dinger dicker und dünner werden, bis irgendwann hinten 7
# rauskommt". Shown, not computed on the slide - but the numbers are real (gradient descent below).
ADD_DATA = [(5, 2), (3, 4), (1, 6), (6, 1), (2, 2), (4, 3)]   # one sum alone would only be learnt by heart
ADD_EPOCHS = [0, 1, 2, 4, 8, 12, 20, 40]                        # the passes the slide shows


def add_history(w0=(0.2, 1.6), eta=0.02, n=40):
    """Weights per pass: plain gradient descent on the squared error over ADD_DATA, no bias, linear output."""
    w, hist = list(w0), [tuple(w0)]
    for _ in range(n):
        g = [0.0, 0.0]
        for x1, x2 in ADD_DATA:
            e = w[0] * x1 + w[1] * x2 - (x1 + x2)
            g[0] += 2 * e * x1 / len(ADD_DATA)
            g[1] += 2 * e * x2 / len(ADD_DATA)
        w = [w[0] - eta * g[0], w[1] - eta * g[1]]
        hist.append(tuple(w))
    return hist


def de(v, dec=2):
    return ("%.*f" % (dec, v)).replace(".", ",")


def netz_lernt():
    """A perceptron learning to add 5 + 2. The SVG animates itself (SMIL, one loop of T seconds; deck.js starts it
    from 0 when the slide comes up). Every pass: the error runs back along both connections as a red wave, the
    connections grow thicker or thinner with their weight, the numbers run forward again as a navy wave, and the
    output closes in on 7 while the red error bar shrinks. Backpropagation shown, not computed. Returns (svg, labels).
    First version had small red dots racing off the neuron - Doc, 28.10.2026: "rote Punkte dicht am Neuron, die sich
    irgendwie bewegen" - so: waves along the whole line, slower, and a legend for the two colours."""
    hist = add_history()
    snaps = [hist[e] for e in ADD_EPOCHS]
    FX, FY = 352, 304                    # where the KaTeX part of the formula ends, and the baseline of the numbers
    N = len(snaps)
    HOLD0, BACK, MORPH, FWD, REST, END, RESET, FADE = 2.0, 0.7, 0.6, 0.6, 0.3, 3.5, 0.8, 0.25
    STEP = BACK + MORPH + FWD + REST
    T = HOLD0 + (N - 1) * STEP + END + RESET
    tau = [HOLD0 + (k - 1) * STEP for k in range(1, N)]           # start of pass k (k = 1 .. N-1)
    wsw = [0.0] + [t + BACK + MORPH for t in tau]                  # the weights' numbers switch
    osw = [0.0] + [t + BACK + MORPH + FWD for t in tau]            # output, error and pass number switch

    def keyed(points):
        """(t, value) pairs -> keyTimes and values; equal times nudged apart so the list stays increasing."""
        out, last = [], -1.0
        for t, v in points:
            t = max(t, last + 0.001)
            out.append((t, v)); last = t
        return ";".join("%.4f" % min(1.0, t / T) for t, _ in out), ";".join(str(v) for _, v in out)

    def anim(attr, points, mode="linear"):
        if mode != "discrete" and points[-1][0] < T:             # a smooth one must end at the loop's end -
            points = points + [(T, points[-1][1])]               # otherwise the browser drops it altogether
        kt, vals = keyed(points)
        return ('<animate attributeName="%s" dur="%gs" repeatCount="indefinite" calcMode="%s" keyTimes="%s" '
                'values="%s"/>' % (attr, T, mode, kt, vals))

    def shown(sw, k):
        """Opacity of snapshot k: on from its switch to the next one, snapshot 0 again during the reset."""
        if k == 0:
            return anim("opacity", [(0, 1), (sw[1], 0), (T - RESET, 1)], "discrete")
        end = sw[k + 1] if k + 1 < N else T - RESET
        return anim("opacity", [(0, 0), (sw[k], 1), (end, 0)], "discrete")

    def text(x, y, s, size, color=S.INK, anchor="middle", weight=None, extra="", on=True):
        return ('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s" text-anchor="%s" opacity="%d"%s>%s%s</text>'
                % (S.fmt(x), S.fmt(y), S.SANS, size, color, anchor, 1 if on else 0,
                   ' font-weight="%s"' % weight if weight else "", s, extra))

    def wave(a, b, color, phases):
        """A line drawn from a to b during each (start, end) phase, then faded - the flow along a connection."""
        L = math.hypot(b[0] - a[0], b[1] - a[1])
        off, op = [(0, S.fmt(L))], [(0, 0)]
        for t0, t1 in phases:
            off += [(t0, S.fmt(L)), (t1, 0), (t1 + FADE, 0), (t1 + FADE + 0.001, S.fmt(L))]
            op += [(t0 - 0.001, 0), (t0, 1), (t1, 1), (t1 + FADE, 0)]
        return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="5" stroke-linecap="round" '
                'stroke-dasharray="%s %s" stroke-dashoffset="%s" opacity="0">%s%s</line>'
                % (S.fmt(a[0]), S.fmt(a[1]), S.fmt(b[0]), S.fmt(b[1]), color, S.fmt(L), S.fmt(L + 10), S.fmt(L),
                   anim("stroke-dashoffset", off), anim("opacity", op)))

    c = S.Canvas(W, H)
    labels = []
    ins = [(150, 95, "5"), (150, 235, "2")]
    ox, oy, ro, ri = 500, 160, 52, 34
    width = lambda w: 3 + 9 * w                                    # the weight drawn as the line's thickness
    back = [(t, t + BACK) for t in tau]
    fwd = [(0.4, 1.0)] + [(t + BACK + MORPH, t + BACK + MORPH + FWD) for t in tau]
    for i, (ix, iy, _) in enumerate(ins):
        dx, dy = ox - ix, oy - iy
        L = math.hypot(dx, dy)
        pin = (ix + dx / L * (ri + 4), iy + dy / L * (ri + 4))
        pout = (ox - dx / L * (ro + 4), oy - dy / L * (ro + 4))
        pts = [(0, width(snaps[0][i]))]
        for k, t in enumerate(tau, 1):
            pts += [(t + BACK, width(snaps[k - 1][i])), (t + BACK + MORPH, width(snaps[k][i]))]
        pts += [(T - RESET, width(snaps[-1][i])), (T, width(snaps[0][i]))]
        c.raw('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round" '
              'opacity=".85">%s</line>' % (S.fmt(pin[0]), S.fmt(pin[1]), S.fmt(pout[0]), S.fmt(pout[1]), S.ORANGE,
                                           S.fmt(width(snaps[0][i])), anim("stroke-width", pts)))
        c.raw(wave(pin, pout, S.INK, fwd))                         # forward: the numbers flow to the output
        c.raw(wave(pout, pin, S.RED, back))                        # backward: the error flows to the weights
        bx, by = (ix + ox) / 2, (iy + oy) / 2 + (-30 if i == 0 else 36)
        for k, wk in enumerate(snaps):
            c.raw(text(bx, by, 'w<tspan baseline-shift="-22%%" font-size="72%%">%d</tspan> = %s' % (i + 1, de(wk[i])),
                       15, S.BODY, extra=shown(wsw, k), on=k == 0))
    for ix, iy, v in ins:
        c.circle(ix, iy, ri, fill="#F4F7FC", stroke=S.INK, width=2.6)
        c.raw(text(ix, iy + 10, v, 28, S.INK, weight="600"))
    # output neuron with its value, the green ring at the end
    c.circle(ox, oy, ro, fill=S.PAPER, stroke=S.INK, width=3)
    c.raw('<circle cx="%d" cy="%d" r="%d" fill="none" stroke="%s" stroke-width="4" opacity="0">%s</circle>'
          % (ox, oy, ro + 8, S.GREEN, anim("opacity", [(0, 0), (osw[-1], 1), (T - RESET, 0)], "discrete")))
    errs = [abs(7 - (5 * a + 2 * b)) for a, b in snaps]
    for k, (a, b) in enumerate(snaps):
        c.raw(text(ox, oy + 10, de(5 * a + 2 * b), 28, S.INK, weight="600", extra=shown(osw, k), on=k == 0))
        c.raw(text(ox + 84, 254, de(errs[k]), 16, S.RED if errs[k] > 0.05 else S.GREEN, "start", "600",
                   extra=shown(osw, k), on=k == 0))
        c.raw(text(412, 28, str(ADD_EPOCHS[k]), 17, S.INK, "start", "600", extra=shown(osw, k), on=k == 0))
        # what the neuron computes, this pass's numbers right of the KaTeX sum (Doc, 28.10.2026: "Bitte noch die
        # Formel" - "mit dem Summenzeichen")
        c.raw('<text x="%s" y="%d" font-family="KaTeX_Main, Cambria Math, serif" font-size="20" fill="%s" '
              'opacity="%d">5 · %s + 2 · %s = <tspan font-weight="700">%s</tspan>%s</text>'
              % (S.fmt(FX + 8), FY, S.INK, 1 if k == 0 else 0, de(a), de(b), de(5 * a + 2 * b), shown(osw, k)))
    # the error as a bar that shrinks pass by pass
    bar = lambda e: 140 * e / errs[0]
    bpts = [(0, S.fmt(bar(errs[0])))]
    for k in range(1, N):
        bpts += [(osw[k], S.fmt(bar(errs[k - 1]))), (osw[k] + 0.35, S.fmt(bar(errs[k])))]
    bpts += [(T - RESET, S.fmt(bar(errs[-1]))), (T, S.fmt(bar(errs[0])))]
    c.rect(ox - 70, 242, 140, 14, fill="#F6E4E2", rx=4)
    c.raw('<rect x="%d" y="242" width="%s" height="14" rx="4" fill="%s">%s</rect>'
          % (ox - 70, S.fmt(bar(errs[0])), S.RED, anim("width", bpts)))
    # target
    c.arrow(ox + ro + 8, oy, 640, oy, S.INK, 2)
    c.rect(650, oy - 47, 130, 94, fill=S.PAPER, stroke=S.GREEN, width=2.4, rx=12)
    c.raw(text(715, oy + 21, "7", 34, S.INK, weight="600"))
    c.raw('<text x="756" y="%d" font-family="%s" font-size="26" fill="%s" opacity="0">✓%s</text>'
          % (oy + 21, S.SANS, S.GREEN, anim("opacity", [(0, 0), (osw[-1], 1), (T - RESET, 0)], "discrete")))
    # legend for the two waves
    c.line(588, 24, 624, 24, S.INK, 5)
    c.line(588, 50, 624, 50, S.RED, 5)
    labels += [(150, 42, 160, "Eingaben", css(14, S.MUTED)),
               (ox, 86, 160, "Ausgabe", css(14, S.MUTED)),
               (715, oy - 29, 110, "Ziel", css(13, S.MUTED)),
               (ox, 228, 120, "Fehler", css(13, S.MUTED)),
               (FX - 110, FY - 18, 220, "$y = \\sum\\limits_{i=1}^{2} w_i \\cdot x_i =$",
                css(16.5, S.INK, "text-align:right")),
               (355, 22, 100, "Durchlauf", css(14, S.MUTED, "text-align:right")),
               (722, 24, 180, "vorwärts: rechnen", css(13, S.BODY, "text-align:left")),
               (722, 50, 180, "rückwärts: Backpropagation", css(13, S.BODY, "text-align:left")),
               (W / 2, 343, W, "Geübt an sechs Summen: Am Ende sind beide Gewichte 1 — das Netz kann jetzt addieren, "
                               "nicht nur 5 + 2.", css(12.5, S.MUTED))]
    return c.svg("Animation: ein Perzeptron mit den Eingaben 5 und 2 lernt addieren; der Fehler läuft rot zurück, die "
                 "Verbindungen werden dicker und dünner, die Ausgabe nähert sich von 4,20 bis 7,00, beide Gewichte "
                 "enden bei 1"), labels

if __name__ == "__main__":
    fn = globals().get(sys.argv[1] if len(sys.argv) > 1 else "")
    if not fn:
        sys.exit("usage: wasserzeichen_svg.py spielraum|schluessel|bonus|satz|glocke|turnier")
    print(fn()[0])
