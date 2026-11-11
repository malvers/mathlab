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
    """The same candidates before and after the green bonus - the ranking tips towards green. Laid out like
    spielraum() (Doc, 30.10.2026: "angleichen, auch im Design ... dass man sieht, das ist ja das Gleiche"):
    horizontal bars, the words right-aligned on the left, the share behind the bar; both panels on one scale."""
    c = S.Canvas(W, H)
    labels = []
    top, rh, bh, scale = 54, 33, 22, 640.0
    after = with_bonus()
    rest_after = 1 - sum(p for _, p, _ in after)
    # left the bars of spielraum() as they were - without a watermark green and red play no part (Doc, 30.10.2026:
    # "die Farben bei dem linken Diagramm ... gelb lassen. Denn das Rot-Grün kommt ja erst rechts rein")
    panels = ((0, [(w, p, "orange") for w, p, g in CANDS] + [("alle anderen", REST, None)], "Ohne Wasserzeichen"),
              (420, after + [("alle anderen", rest_after, None)], "Mit Wasserzeichen"))
    for ox, rows, head in panels:
        x0 = ox + 104
        labels.append((ox + 198, 8, 396, head, css(16, extra="font-weight:600")))   # a little above the bars
        for i, (word, p, green) in enumerate(rows):
            y = top + i * rh
            fill = S.MUTED if green is None else S.ORANGE if green == "orange" else S.GREEN if green else S.RED
            c.rect(x0, y, max(2, p * scale), bh, fill=fill, rx=5)
            c.text(x0 + p * scale + 8, y + bh / 2 + 5, "%d %%" % round(p * 100), 14, S.INK, "start")
            labels.append((x0 - 52, y + bh / 2, 96, word, css(15, extra="text-align:right")))
    # a drawn block arrow between the panels, green like the bonus it stands for, with a short word above it
    # (Doc, 30.10.2026: "einen schönen ordentlichen gezeichneten Pfeil ... irgendwas Sinnvolles, kompaktes")
    c.poly([(325, 143), (387, 143), (387, 132), (413, 150), (387, 168), (387, 157), (325, 157)],   # 3 px right: the tip makes it look left
           stroke=S.GREEN, width=1.5, fill=S.GREEN)
    labels.append((366, 118, 130, "Bonus für Grün", css(14, S.GREEN, "font-weight:700")))
    labels.append((W / 2, 314, W, "Die Rangfolge kippt: Rote Wörter werden selten, grüne häufig — "
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
# every pass shown, the counter counts on without gaps (Doc, 04.11.2026: "wir müssen doch mitzählen"; before: 0, 1, 2,
# 4, 8, 12, 20, 40 from (0.2, 1.6) at eta 0.02), and in 11 passes ("17 Runden sind ganz schön lang ... lieber elf"):
# start 0.5 and 0.6, eta 0.035 - searched for an error that halves pass by pass, 3.30 1.76 0.95 0.50 ... 0.004, never
# growing again
ADD_ETA, ADD_N, ADD_W0 = 0.035, 11, (0.5, 0.6)
ADD_EPOCHS = list(range(ADD_N + 1))


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
    """A perceptron learning to add 5 + 2. The SVG animates itself (SMIL, one run of T seconds; deck.js starts it
    from 0 when the slide comes up). Every pass: the error runs back along both connections as a red wave, the
    connections grow thicker or thinner with their weight, the numbers run forward again as a navy wave, and the
    output closes in on 7 while the red error bar shrinks. Backpropagation shown, not computed. Returns (svg, labels).
    First version had small red dots racing off the neuron - Doc, 28.10.2026: "rote Punkte dicht am Neuron, die sich
    irgendwie bewegen" - so: waves along the whole line, slower, and a legend for the two colours.
    It runs once and stands still once the error is 0 (fill="freeze"), and the error sits centred under the arrow from
    the output to the target, the gap between the two (Doc, 04.11.2026: "soll enden, wenn der Fehler 0 ist und nicht
    wieder von vorne anfangen" - "zentral unter den Pfeil", "die drei Neuronen ein bisschen weiter nach links")."""
    hist = add_history(w0=ADD_W0, eta=ADD_ETA, n=ADD_N)
    snaps = [hist[e] for e in ADD_EPOCHS]
    DX = -60                             # the net, its formula and the pass number moved left: room for a longer arrow
    # where the KaTeX part of the formula ends, and the baseline of the numbers - the whole line centred under the output
    # neuron at 500 + DX (measured in the deck: the KaTeX part 136 wide, the numbers 214, 8 between; Doc, 04.11.2026:
    # "die Formel unten zentral unter das Ausgabeneuron")
    FX, FY = 500 + DX - 43, 306          # with its box: 10 up, 6 down with w2, 6 more down (Doc)
    N = len(snaps)
    HOLD0, BACK, MORPH, FWD, REST, FADE = 2.0, 0.7, 0.6, 0.6, 0.3, 0.25
    STEP = BACK + MORPH + FWD + REST
    # the last pass's REST (the bar has shrunk to 0) and 2 more for the green ring to fade, then it stands
    T = HOLD0 + (N - 1) * STEP + 2.3
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
        return ('<animate attributeName="%s" dur="%gs" fill="freeze" calcMode="%s" keyTimes="%s" '
                'values="%s"/>' % (attr, T, mode, kt, vals))

    def shown(sw, k):
        """Opacity of snapshot k: on from its switch to the next one, the last one stays."""
        if k == 0:
            return anim("opacity", [(0, 1), (sw[1], 0)], "discrete")
        return anim("opacity", [(0, 0), (sw[k], 1)] + ([(sw[k + 1], 0)] if k + 1 < N else []), "discrete")

    def text(x, y, s, size, color=S.INK, anchor="middle", weight=None, extra="", on=True, family=S.SANS):
        return ('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s" text-anchor="%s" opacity="%d"%s>%s%s</text>'
                % (S.fmt(x), S.fmt(y), family, size, color, anchor, 1 if on else 0,
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
    # the inputs nearer the output and further apart: the two connections meet at about 31 degrees instead of 23
    # (Doc, 04.11.2026: "den Winkel zwischen 5 und 2 nicht ganz so spitz"), with no need for more room at the top
    # and the whole net 6 lower, off the Start / Stop buttons (Doc: "die Boxen ganz kleines bisschen nach unten")
    DY = -4               # then all of it but the formula box 10 up (Doc, 04.11.2026)
    ins = [(210 + DX, 80 + DY, "5"), (210 + DX, 240 + DY, "2")]
    LG = 20               # a label's middle above the top of its neuron or box - clear of the green ring at the end
    # the top line - the "Durchlauf" box and the legend - centred on the line of "Eingaben" (Doc, 04.11.2026: "Durchlauf
    # und Eingaben nicht Y synchron")
    ox, oy, ro, ri = 500 + DX, 160 + DY, 52, 34
    TY = ins[0][1] - ri - LG
    # the arrow from the output to the target, rim to rim (Doc, 04.11.2026: "von Box zu Box"): from the circle's outer
    # edge (stroke 3) to the box's (stroke 2.4), the head's tip on the box
    ax0, ax1 = ox + ro + 1.5, 650 - 1.2
    # the error under it, its bar's width - 6 left of the arrow's middle: between the round neuron and the square box
    # the true middle looks off to the right (Doc, 04.11.2026: "gefühlte 6 Pixel nach links")
    ex, ew = (ax0 + ax1) / 2 - 6, 100
    # "Durchlauf 40" centred on the weights' column, above w1 (Doc, 04.11.2026: "symmetrisch mit den Gewichten" -
    # "Durchlauf 0 insgesamt sind nicht symmetrisch"), the number as big as the word ("die 0 ist größer als das D")
    # and 6 after it ("der Abstand ... so groß"). The word is a fixed label, so the line is centred for a number between
    # one and two digits wide: 2 off either way, about what w1 and w2 move from pass to pass (measured in the deck)
    dlx = ox                                                       # now over the output (Doc: "zentriert über Ausgabe")
    width = lambda w: 3 + 9 * w                                    # the weight drawn as the line's thickness
    # each weight its own colour, its line and its label alike (Doc, 04.11.2026: "die Gewichte noch mit Farben
    # versehen"); the label on a chip of that colour - orange type would not read on the beamer
    WCOL = [S.ORANGE, S.GREEN]
    # every number of the figure in LaTeX's font, like the formula (Doc, 04.11.2026: "auch in der Grafik LaTeX
    # verwenden"); KaTeX's digits are smaller than Raleway's at one size (deck.css: size-adjust 121 %), hence the sizes
    TEXN = S.TEX
    # and in the decks' formula blue, the colour of the KaTeX sum beside them (deck.css --formel; Doc, 01.10.2026: "für
    # alle Zahlen, für alle Formeln") - the navy numbers stood out against the blue sum
    FORMEL = "#193482"
    back = [(t, t + BACK) for t in tau]
    fwd = [(0.4, 1.0)] + [(t + BACK + MORPH, t + BACK + MORPH + FWD) for t in tau]
    for i, (ix, iy, _) in enumerate(ins):
        dx, dy = ox - ix, oy - iy
        L = math.hypot(dx, dy)
        # the waves start just under the circles' rims; the connection itself runs centre to centre and the neurons,
        # drawn after it, cover its ends - it always reaches them (Doc, 04.11.2026: "geht nicht bis an die Neuronen ran")
        pin = (ix + dx / L * (ri - 3), iy + dy / L * (ri - 3))
        pout = (ox - dx / L * (ro - 3), oy - dy / L * (ro - 3))
        pts = [(0, width(snaps[0][i]))]
        for k, t in enumerate(tau, 1):
            pts += [(t + BACK, width(snaps[k - 1][i])), (t + BACK + MORPH, width(snaps[k][i]))]
        c.raw('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round" '
              'opacity=".85">%s</line>' % (ix, iy, ox, oy, WCOL[i], S.fmt(width(snaps[0][i])), anim("stroke-width", pts)))
        c.raw(wave(pin, pout, S.INK, fwd))                         # forward: the numbers flow to the output
        c.raw(wave(pout, pin, S.RED, back))                        # backward: the error flows to the weights
        # w2 6 lower than before: as far off its (thick) line as w1 off its own (Doc, 04.11.2026: "Gewicht 2 ist zu
        # dicht an der Verbindung")
        bx, by = (ix + ox) / 2, (iy + oy) / 2 + (-30 if i == 0 else 42)
        c.raw('<rect x="%s" y="%s" width="84" height="25" rx="7" fill="%s" fill-opacity=".28"/>'
              % (S.fmt(bx - 42), S.fmt(by - 18), WCOL[i]))
        for k, wk in enumerate(snaps):
            c.raw(text(bx, by, '<tspan font-family="KaTeX_Math" font-style="italic">w</tspan><tspan baseline-shift="-22%%" '
                               'font-size="72%%">%d</tspan> = %s' % (i + 1, de(wk[i])),
                       18, FORMEL, extra=shown(wsw, k), on=k == 0, family=TEXN))
    for ix, iy, v in ins:
        c.circle(ix, iy, ri, fill="#F4F7FC", stroke=S.INK, width=2.6)
        # each input in the colour of its connection and weight, so it can be found again in the formula (Doc,
        # 04.11.2026: "den Zahlen 5 und 2 ... als Zahl selbst ... Font-Color"); bold, orange type is pale
        c.raw(text(ix, iy + 11, v, 33, WCOL[ins.index((ix, iy, v))], "middle", "700", family=TEXN))
    # a plus between the two inputs: the net is to add them (Doc, 04.11.2026: "wir wollen ja da addieren")
    px, py = ins[0][0], (ins[0][1] + ins[1][1]) / 2               # drawn, the font's + is a small one
    c.line(px - 12, py, px + 12, py, FORMEL, 3.6)
    c.line(px, py - 12, px, py + 12, FORMEL, 3.6)
    # between the two weights, on the line of the plus, a box that says which way the net goes right now: "rechnen" in
    # the forward wave's navy while the numbers run forward, "Backpropagation" in red while the error runs back and the
    # weights change; one size for both, so it never moves (Doc, 04.11.2026: "eine abwechselnde Box, die allerdings in
    # X immer gleich bleibt", "wenn es vorwärts geht ... rechnen", "wenn es zurückgeht, also rot ist, Backpropagation").
    # The words change with the clock, so they are svg text, not editable labels.
    mx, bw = (ins[0][0] + ox) / 2 - 33, 120          # left: the two lines close in towards the output (Doc: twice "10")
    c.raw('<rect x="%s" y="%s" width="%d" height="26" rx="8" fill="%s" fill-opacity=".55" stroke="%s" '
          'stroke-width="1.1" stroke-opacity=".45"/>' % (S.fmt(mx - bw / 2), S.fmt(py - 13), bw, S.PAPER, S.INK))
    fw_on, bk_on = [(0, 1)], [(0, 0)]
    for t in tau:
        fw_on += [(t, 0), (t + BACK + MORPH, 1)]
        bk_on += [(t, 1), (t + BACK + MORPH, 0)]
    c.raw(text(mx, py + 5, "rechnen", 13, S.INK, weight="600", extra=anim("opacity", fw_on, "discrete")))
    c.raw(text(mx, py + 5, "Backpropagation", 13, S.RED, weight="600", extra=anim("opacity", bk_on, "discrete"),
               on=False))
    # output neuron with its value, the green ring at the end
    c.circle(ox, oy, ro, fill=S.PAPER, stroke=S.INK, width=3)
    c.raw('<circle cx="%d" cy="%d" r="%d" fill="none" stroke="%s" stroke-width="4" opacity="0">%s</circle>'
          % (ox, oy, ro + 8, S.GREEN,     # in quickly, a moment, then it fades out (Doc, 04.11.2026: "ausfaden")
             anim("opacity", [(0, 0), (osw[-1], 0), (osw[-1] + 0.3, 1), (osw[-1] + 1.1, 1), (osw[-1] + 2.6, 0)])))
    # the formula and its numbers in a quiet box, thin line, faint paper (Doc, 04.11.2026: "nicht so auffällig und nicht
    # so dicke Linien", "ein bisschen eingeboxt"); sizes as measured above, the sum's limits reach from FY - 30 to FY + 20
    # its ground less white than the other boxes (.3 instead of .55): the orange 5 stood pale on white (Doc, 04.11.2026:
    # "den Hintergrund der Box noch ein bisschen dunkler ... die 5 ist da nicht so doll zu sehen"; navy .10 and .05 were
    # "zu viel")
    c.raw('<rect x="%s" y="%d" width="382" height="61" rx="10" fill="%s" fill-opacity=".3" stroke="%s" '
          'stroke-width="1.1" stroke-opacity=".45"/>' % (S.fmt(FX - 136 - 12), FY - 36, S.PAPER, S.INK))
    # the two weights in the formula on chips of their colours, like w1 and w2 at their lines (Doc, 04.11.2026: "wenn
    # wir die bunt machen mit so unterlegen ... dann bitte auch in der Gleichung unten"); where they stand in the line
    # measured in the deck (getExtentOfChar, with the bold 5 and 2), the same in every pass - KaTeX's digits are all one
    # width
    for i, (a0, a1) in enumerate([(27.14, 62.71), (115.41, 150.98)]):
        c.raw('<rect x="%s" y="%d" width="%s" height="25" rx="6" fill="%s" fill-opacity=".28"/>'
              % (S.fmt(FX + 8 + a0 - 4), FY - 18, S.fmt(a1 - a0 + 8), WCOL[i]))
    # "Durchlauf 0" bigger, in the same quiet box (Doc, 04.11.2026: "die Schrift alles ein bisschen größer und auch so
    # eine Box drumherum wie unten"); the box centred on the output, room in it for two digits
    c.raw('<rect x="%s" y="%d" width="146" height="34" rx="10" fill="%s" fill-opacity=".55" stroke="%s" '
          'stroke-width="1.1" stroke-opacity=".45"/>' % (S.fmt(dlx - 73), TY - 17, S.PAPER, S.INK))
    # where deck.js puts Start / Stop: over the "Durchlauf" box, as wide as it (Doc, 04.11.2026: "Start-Stop über
    # Durchlauf oben, in Gruppe zentriert, so breit wie Durchlauf und einen Tick höher")
    errs = [abs(7 - (5 * a + 2 * b)) for a, b in snaps]
    for k, (a, b) in enumerate(snaps):
        c.raw(text(ox, oy + 11, de(5 * a + 2 * b), 32, FORMEL, extra=shown(osw, k), on=k == 0, family=TEXN))
        c.raw(text(ex, oy - 40, de(errs[k]), 19, S.RED if errs[k] > 0.05 else S.GREEN, "middle", "700", family=TEXN,
                   extra=shown(osw, k), on=k == 0))
        # "Durchlauf" and its number as one line, centred in the box for one digit and for two (Doc, 04.11.2026: "Das
        # muss in der Box immer zentriert stehen") - so the word is svg text now, no longer an editable label
        c.raw(text(dlx, TY + 6, 'Durchlauf<tspan dx="7" font-family="%s" font-size="19" font-weight="700" fill="%s">%d'
                                '</tspan>' % (TEXN, FORMEL, ADD_EPOCHS[k]), 17, S.MUTED, extra=shown(osw, k), on=k == 0))
        # what the neuron computes, this pass's numbers right of the KaTeX sum (Doc, 28.10.2026: "Bitte noch die
        # Formel" - "mit dem Summenzeichen")
        c.raw('<text x="%s" y="%d" font-family="KaTeX_Main, Cambria Math, serif" font-size="20" fill="%s" '
              'opacity="%d"><tspan fill="%s" font-weight="700">5</tspan> · %s + <tspan fill="%s" font-weight="700">2</tspan> · %s = '
              '<tspan font-weight="700">%s</tspan>%s</text>'
              % (S.fmt(FX + 8), FY, FORMEL, 1 if k == 0 else 0, WCOL[0], de(a), WCOL[1], de(b), de(5 * a + 2 * b),
                 shown(osw, k)))
    # the error as a bar that shrinks pass by pass
    bar = lambda e: ew * e / errs[0]
    bpts = [(0, S.fmt(bar(errs[0])))]
    for k in range(1, N):
        bpts += [(osw[k], S.fmt(bar(errs[k - 1]))), (osw[k] + 0.35, S.fmt(bar(errs[k])))]
    # the whole error over the arrow, the bar right above it and "Fehler" on the line of "Ausgabe" and "Trainingsdatum"
    # (Doc, 04.11.2026: "den Balken über den blauen Pfeil" - "natürlich das andere Zeug" too)
    c.rect(ex - ew / 2, oy - 26, ew, 12, fill="#F6E4E2", rx=4)
    c.raw('<rect x="%s" y="%d" width="%s" height="12" rx="4" fill="%s">%s</rect>'
          % (S.fmt(ex - ew / 2), oy - 26, S.fmt(bar(errs[0])), S.RED, anim("width", bpts)))
    # target
    c.arrow(ax0, oy, ax1, oy, S.INK, 2)
    # the box as tall as the output neuron, so "Ausgabe" and "Trainingsdatum" stand on one line, each as close to its
    # thing as "Eingaben" to the 5 (Doc, 04.11.2026: "Ausgabe und Trainingsdatum dichter an die Box ran")
    c.rect(650, oy - ro, 130, 2 * ro, fill=S.PAPER, stroke=S.INK, width=3, rx=12)   # framed like the neurons (Doc: "Rahmen wie Neurons")
    # no "Ziel" in the box any more, the 7 in its middle: KaTeX's digits stand 0.644 em high (Doc, 04.11.2026:
    # "das Wort Ziel aus der Box raus und machen die 7 y-zentriert")
    c.raw(text(715, oy + 0.644 * 39 / 2, "7", 39, FORMEL, family=TEXN))
    # the check at the end: LaTeX's \checkmark (KaTeX_AMS, U+2713), under the box and centred on it (Doc, 04.11.2026:
    # "ein schönes LaTeX-Checkmark und mach es außerhalb der Box. Zentriert auf die Box")
    # beside the box now, on its middle line (Doc, 04.11.2026: "check mark y"); KaTeX's check is 0.833 em wide and its
    # ink stands about 0.35 em above the baseline at its middle
    c.raw('<text x="%s" y="%s" font-family="KaTeX_AMS, %s" font-size="40" fill="%s" text-anchor="middle" '
          'opacity="0">\u2713%s</text>'
          % (S.fmt(780 + 14 + 0.833 * 40 / 2), S.fmt(oy + 0.35 * 40), S.TEX, S.GREEN,
             anim("opacity", [(0, 0), (osw[-1], 1)], "discrete")))
    # no legend for the two waves any more: the box between the weights names the direction as it happens (Doc,
    # 04.11.2026: "oben die Legende rechts noch weg")
    labels += [(ins[0][0], ins[0][1] - ri - LG, 160, "Eingaben", css(14, S.MUTED)),
               (ox, oy - ro - LG, 160, "Ausgabe", css(14, S.MUTED)),
               # where the 7 comes from, above the box on the line of "Ausgabe" (Doc, 04.11.2026: "das Ziel in der Box
               # lassen und über die Box schreiben, Trainingsdatum")
               (715, oy - ro - LG, 160, "Trainingsdatum", css(14, S.MUTED)),
               (ex, oy - ro - LG, 120, "Fehler", css(14, S.MUTED)),
               (FX - 110, FY - 18, 220, "$y = \\sum\\limits_{i=1}^{2} w_i \\cdot x_i =$",
                css(16.5, S.INK, "text-align:right")),
               (W / 2, 347, W, "Das Netz übt sechs Summen: 5 + 2, 3 + 4, 1 + 6, 6 + 1, 2 + 2, 4 + 3. Am Ende sind beide "
                               "Gewichte 1 — es kann addieren.", css(12.5, S.MUTED))]
    svg = c.svg("Animation: ein Perceptron mit den Eingaben 5 und 2 lernt addieren; der Fehler läuft rot zurück, die "
                "Verbindungen werden dicker und dünner, die Ausgabe nähert sich von %s bis 7,00, beide Gewichte "
                "enden bei 1" % de(5 * snaps[0][0] + 2 * snaps[0][1]))
    # the whole figure centred in the picture box (Doc, 04.11.2026: "die ganze Grafik-Bounding-Box x-zentriert"):
    # measured in the deck, it reached from 116 (the 5) to 799 (the legend's end), so all of it moved 50 to the left -
    # the drawing in one group, the words by their x; the place of Start / Stop (rect.ani-ort, read by deck.js as is)
    # stands outside the group with the shift added
    GX = -40              # without the legend the right end is the target box (780): 116 .. 780
    head, body = svg.split("</defs>", 1)
    # the formula box now reaches 1 past the picture box's bottom (330): the svg must not clip it
    head = head.replace("<svg ", '<svg overflow="visible" ', 1)
    body, tail = body.rsplit("</svg>", 1)
    svg = (head + '</defs><g transform="translate(%d 0)">' % GX + body + "</g>"
           + '<rect class="ani-ort" x="%s" y="%d" width="146" height="20" fill="none"/>' % (S.fmt(dlx - 73 + GX), TY - 50)
           + "</svg>" + tail)
    labels = [(l[0] + GX,) + tuple(l[1:]) if l[2] != W else l for l in labels]
    return svg, labels

if __name__ == "__main__":
    fn = globals().get(sys.argv[1] if len(sys.argv) > 1 else "")
    if not fn:
        sys.exit("usage: wasserzeichen_svg.py spielraum|schluessel|bonus|satz|glocke|turnier")
    print(fn()[0])
