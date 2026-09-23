#!/usr/bin/env python3
"""The KI-Begriffe deck's figures as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/ai_svg.py neuron      # prints the <svg> markup

Doc, 23.09.2026: "kannst Du solche Bilder bitte immer im HTML malen? Das sieht pixlig aus und ich
kann nicht editieren" - so no more PNG for a drawn diagram. Each figure returns (svg, labels): the
shapes, arrows and maths as SVG (sharp on any beamer), the words as HTML labels laid over it -
<p class="fl"> in the deck file, which the deck editor (E) changes like any bullet line ("HTML
besser?" - for editing, yes). ai_diagrams.py keeps the PNG twins for the .pptx only.
The canvas is the picture box of a content slide, 816 x 330 design pixels (deck.css .pic); the
labels are placed in the same coordinates, so the SVG must fill that box exactly.
"""
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330
SYM = "Helvetica Neue, Arial, sans-serif"   # Raleway has no Sigma - the glyph would fall back per browser anyway


def sub(base, idx):
    """x with a real subscript - a tspan, not a Unicode digit Raleway may lack."""
    return '%s<tspan baseline-shift="-22%%" font-size="72%%">%s</tspan>' % (base, idx)   # "sub" drops Raleway too far


def label(c, x, y, markup, size=14, color=S.INK, family=S.SANS, weight=None):
    """A centred label whose content is ready markup (subscripts)."""
    c.raw('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s" text-anchor="middle"'
          ' dominant-baseline="central"%s>%s</text>'
          % (S.fmt(x), S.fmt(y), family, size, color,
             ' font-weight="%s"' % weight if weight else "", markup))


def neuron():
    """One artificial neuron: inputs, weights, sum, activation, output. Returns (svg, labels),
    a label being (centre x, centre y, width, text)."""
    c = S.Canvas(W, H)
    labels = []
    cx, cy, r = 430, 150, 88
    ins = [("Helligkeit", 52), ("Kantenanteil", 150), ("Rundung", 248)]
    for i, (name, y) in enumerate(ins, 1):
        c.circle(62, y, 26, fill="#F4F7FC", stroke=S.INK, width=2.4)
        label(c, 62, y, sub("x", i), 16)
        labels.append((62, y + 46, 120, name))
        # the arrow carries its weight in a small box at its middle
        x1, y1 = 94, y
        x2, y2 = cx - r - 10, cy + (y - cy) * 0.3
        c.arrow(x1, y1, x2, y2, color=S.ORANGE, width=2.6)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        c.rect(mx - 22, my - 15, 44, 30, fill=S.PAPER, stroke=S.ORANGE, width=2, rx=6)
        label(c, mx, my, sub("w", i), 14)
    # the neuron itself
    c.circle(cx, cy, r, fill=S.PAPER, stroke=S.INK, width=3)
    label(c, cx, cy - 34, "Σ", 46, family=SYM)
    label(c, cx, cy + 12, " + ".join(sub("x", i) + sub("w", i) for i in (1, 2, 3)) + " + b", 13, color=S.BODY)
    c.line(cx - 66, cy + 32, cx + 66, cy + 32, color=S.MUTED, width=1.2)
    labels.append((cx, cy + 52, 140, "Aktivierung"))
    # output
    c.arrow(cx + r + 10, cy, 696, cy, color=S.GREEN, width=2.6)
    c.circle(740, cy, 32, fill="#F4F7FC", stroke=S.GREEN, width=3)
    label(c, 740, cy, "y", 18)
    labels.append((740, cy + 54, 120, "Ausgabe"))
    labels.append((W / 2, 312, W, "Jeder Eingang wird mit seinem Gewicht multipliziert, alles wird addiert — "
                                  "und die Aktivierung entscheidet, was hinten herauskommt."))
    return c.svg("Ein künstliches Neuron: drei Eingänge mit Gewichten, Summe, Aktivierung, Ausgabe"), labels


def text_width(s, size):
    """Rough advance width of a Raleway string - svgfig carries no font metrics, and a box
    around a word has to hug it. Wide enough beats exact: the word is an HTML label on top."""
    thin, wide = "ijltfrI.,;:!|'", "mwMW"
    return size * sum(0.30 if ch in thin else 0.82 if ch in wide else
                      0.68 if ch.isupper() else 0.55 for ch in s)


def token():
    """A sentence cut into tokens - the pieces a model actually computes with. Returns
    (svg, labels): the boxes and the vocabulary numbers are SVG, the token words are HTML
    labels, so every piece can be renamed in the editor.

    GPT-4 (cl100k_base), not GPT-4o: Doc, 23.09.2026 "mach bitte zwei draus" - GPT-4o holds the
    whole "Kontext" in its vocabulary (one token), GPT-4 splits it into Kont|ext, which shows
    better what a tokenizer does. Split and ids measured against OpenAI's public vocabulary file,
    never invented: GPT-4o would make 7 of the same sentence (Das|Kontext|fen|ster|ist|voll|.).
    """
    c = S.Canvas(W, H)
    labels = []
    toks = [("Das", S.INK, "33717"), ("Kont", S.ORANGE, "37966"), ("ext", S.ORANGE, "428"),
            ("fen", S.ORANGE, "31453"), ("ster", S.ORANGE, "3751"), ("ist", S.INK, "6127"),
            ("voll", S.INK, "57454"), (".", S.MUTED, "13")]
    size, pad, gap, top, h = 22, 20, 11, 64, 66
    widths = [max(44, text_width(t, size) + 2 * pad) for t, _, _ in toks]
    x = (W - sum(widths) - gap * (len(toks) - 1)) / 2
    for (word, color, num), bw in zip(toks, widths):
        c.rect(x, top, bw, h, fill=S.PAPER, stroke=color, width=3, rx=10)
        labels.append((x + bw / 2, top + h / 2, bw - 10, word,
                       "font-size:%gpx;font-weight:500;color:%s" % (size, S.INK)))
        c.text(x + bw / 2, 152, num, 12.5, S.MUTED)
        x += bw + gap
    labels.append((W / 2, 30, 520, "„Das Kontextfenster ist voll.“"))
    labels.append((W / 2, 206, W, "8 Token bei GPT-4 — ein langes Wort zerfällt, jedes Stück wird zu einer Zahl.",
                   "font-size:16px;font-weight:500;color:%s" % S.BODY))
    labels.append((W / 2, 246, W, "Genau diese Stücke werden gezählt, bezahlt und begrenzt."))
    # how many pieces there could be at all - Doc, 23.09.2026: "wenn ich einer zweier dreier und
    # vierertoken habe, wieviele es dann gibt". 100 256 is the size of GPT-4's vocabulary, counted.
    labels.append((W / 2, 292, W, "Aus 26 Buchstaben gäbe es $26+26^2+26^3+26^4=475\\,254$ Stücke "
                                  "mit bis zu vier Zeichen — GPT-4 kennt 100.256.",
                   "font-size:13.5px;color:%s" % S.BODY))
    return c.svg("Der Satz „Das Kontextfenster ist voll.“ in acht Token zerlegt, "
                 "jedes Stück mit seiner Nummer im Vokabular"), labels


def wortschatz():
    """How many words German has - next to the whole vocabulary of a model. Returns (svg, labels):
    bars and the dashed model line as SVG, every word as an HTML label.

    Doc, 23.09.2026: "muessen wir nicht alle Formen beruecksichtigen? gehen gegangen ... unter
    1 Mio erscheint mir viel zu wenig" - right, and that is the point of the figure: a dictionary
    counts base forms. Numbers: Duden 29th edition (2024) 151.000 headwords, the estimate of the
    whole vocabulary 300.000-500.000 base forms, GPT-4's vocabulary counted in the file itself.
    The bars are logarithmic - decades, not lengths, or the last one would not fit on any beamer."""
    c = S.Canvas(W, H)
    labels = []
    x0, top, bh, gap = 300, 46, 28, 18
    scale = 153.0                                   # pixels per decade above 10.000

    def bar_w(n):
        return scale * (math.log10(n) - 4)

    rows = [("Duden, Stichwörter", 151000, "151.000", S.INK),
            ("deutscher Wortschatz, geschätzt", 400000, "300.000–500.000", S.INK),
            ("mit allen gebeugten Formen", 3000000, "Millionen", S.INK),
            ("mit Zusammensetzungen", None, "unbegrenzt", S.GREEN)]
    for i, (name, n, value, color) in enumerate(rows):
        y = top + i * (bh + gap)
        w = bar_w(n) if n else 426
        c.rect(x0, y, w, bh, fill=color, rx=8)
        if not n:                                   # compounds never stop - the bar ends in a tip
            c.poly([(x0 + w - 4, y), (x0 + w + 38, y + bh / 2), (x0 + w - 4, y + bh)],
                   fill=color, stroke=color, width=1)
        labels.append((150, y + bh / 2, 270, name, "text-align:right;color:%s" % S.BODY))
        labels.append((x0 + w - 70, y + bh / 2, 120, value,
                       "text-align:right;color:%s;font-weight:500" % S.PAPER))
    # what the model has to get by with: one dashed line through all four bars
    mx = x0 + bar_w(100256)
    c.line(mx, 22, mx, top + 4 * (bh + gap) - gap + 8, color=S.ORANGE, width=2.2, dash="6 5")
    labels.append((mx, 14, 260, "GPT-4: 100.256 Token", "color:%s;font-weight:500" % S.ORANGE))

    labels.append((W / 2, 254, W, "Ein Wörterbuch zählt Grundformen: „gehen“ steht einmal drin — "
                                  "nicht gehe, gehst, ging, gegangen.",
                   "font-size:14px;font-weight:500;color:%s" % S.BODY))
    labels.append((W / 2, 286, W, "Mit allen Formen sind es Millionen — und zusammensetzen kann man "
                                  "endlos: Kontextfenstergröße …", "font-size:14px;color:%s" % S.BODY))
    labels.append((W / 2, 317, W, "Duden 29. Auflage 2024 · Balken logarithmisch, eine Dekade je Schritt"))
    return c.svg("Balkenvergleich: Duden 151.000 Stichwörter, geschätzter Wortschatz 300.000 bis "
                 "500.000, mit allen Formen Millionen, mit Zusammensetzungen unbegrenzt - "
                 "das Vokabular von GPT-4 mit 100.256 Token liegt unter allen"), labels


def chip(c, labels, x, y, w, h, head, sub, color):
    """A white card with a coloured spine - the shape four of these figures are built from.
    Heading in Orbitron like every other heading of the deck, both texts as HTML labels."""
    c.rect(x, y, w, h, fill=S.PAPER, stroke=S.INK, width=2.4, rx=9)
    c.rect(x, y, 8, h, fill=color, rx=4)
    labels.append((x + w / 2 + 4, y + h / 2 - 12, w - 22, "<f2>%s</f2>" % head,
                   "font-size:13px;font-weight:600;color:%s" % S.INK))
    labels.append((x + w / 2 + 4, y + h / 2 + 12, w - 22, sub))


def row(n, w, first=26, gap=28):
    """x of the n-th of four cards in a row across the box."""
    return first + n * (w + gap)


def netz():
    """A small feed-forward network: input layer, two hidden layers, output layer."""
    c = S.Canvas(W, H)
    labels = []
    layers, xs, step, mid = [4, 5, 5, 2], [120, 300, 480, 660], 40, 172
    pts = [[(x, mid + (i - (n - 1) / 2) * step) for i in range(n)]
           for n, x in zip(layers, xs)]
    for a, b in zip(pts, pts[1:]):                  # edges first, neurons on top of them
        for px, py in a:
            for qx, qy in b:
                c.line(px, py, qx, qy, color="#CBD6EA", width=1.1)
    for (p, q, col) in ((pts[0][1], pts[1][2], S.ORANGE), (pts[1][2], pts[2][1], S.ORANGE),
                        (pts[2][1], pts[3][0], S.GREEN)):
        c.line(p[0], p[1], q[0], q[1], color=col, width=3)
    names = [("EINGABE", "was hineingeht"), ("VERDECKT", "Merkmale"),
             ("VERDECKT", "Merkmale"), ("AUSGABE", "die Antwort")]
    for col, x, (head, sub) in zip(pts, xs, names):
        for px, py in col:
            c.circle(px, py, 13, fill=S.PAPER, stroke=S.INK, width=2.4)
        labels.append((x, 34, 170, "<f2>%s</f2>" % head,
                       "font-size:13px;font-weight:600;color:%s" % S.INK))
        labels.append((x, 54, 170, sub))
    labels.append((W / 2, 292, W, "Jede Linie ist ein Gewicht — eine Zahl. Lernen heißt: diese Zahlen verstellen.",
                   "font-size:15px;font-weight:500;color:%s" % S.BODY))
    labels.append((W / 2, 318, W, "Ein Sprachmodell hat davon Milliarden."))
    return c.svg("Ein neuronales Netz aus vier Schichten: Eingabeschicht, zwei verdeckte "
                 "Schichten, Ausgabeschicht, alle Neuronen miteinander verbunden"), labels


def training():
    """The training loop: predict, compare, adjust the weights - and again."""
    c = S.Canvas(W, H)
    labels = []
    bw, bh, y = 170, 84, 44
    cols = [("BEISPIEL", "ein Bild mit Lösung", S.INK),
            ("VORHERSAGE", "das Netz rät", S.ORANGE),
            ("FEHLER", "wie weit daneben?", S.RED),
            ("GEWICHTE", "nachjustiert", S.GREEN)]
    xs = [row(i, bw) for i in range(4)]
    for x, (head, sub, color) in zip(xs, cols):
        chip(c, labels, x, y, bw, bh, head, sub, color)
    for i in range(3):
        c.arrow(xs[i] + bw + 6, y + bh / 2, xs[i + 1] - 6, y + bh / 2, color=S.MUTED, width=2.2)
    # the way back: the corrected weights meet the next prediction
    by = y + bh + 56
    c.line(xs[3] + bw / 2, y + bh + 8, xs[3] + bw / 2, by, color=S.GREEN, width=2.6)
    c.line(xs[3] + bw / 2, by, xs[1] + bw / 2, by, color=S.GREEN, width=2.6)
    c.arrow(xs[1] + bw / 2, by, xs[1] + bw / 2, y + bh + 8, color=S.GREEN, width=2.6)
    labels.append(((xs[1] + xs[3]) / 2 + bw / 2, by + 22, 300, "und noch einmal — millionenfach",
                   "color:%s;font-weight:500" % S.GREEN))
    labels.append((W / 2, 262, W, "Niemand programmiert die Gewichte.",
                   "font-size:15px;font-weight:500;color:%s" % S.BODY))
    labels.append((W / 2, 292, W, "Sie werden aus Beispielen zurechtgerückt, bis der Fehler klein ist.",
                   "font-size:15px;color:%s" % S.BODY))
    return c.svg("Der Trainingskreislauf: Beispiel, Vorhersage, Fehler, Gewichte - und zurück "
                 "zur nächsten Vorhersage"), labels


def fenster():
    """What sits inside the context window - and what drops out when it is full."""
    c = S.Canvas(W, H)
    labels = []
    x0, x1 = 90, 726
    parts = [("System-Anweisung", "Rolle und Regeln", S.INK, 28),
             ("Verlauf", "alles bisher Gesagte", S.ORANGE, 40),
             ("Anhänge", "Dateien, Fundstellen", S.GREEN, 32),
             ("Antwort", "muss auch hineinpassen", S.RED, 28)]
    y = 40
    for head, sub, color, h in parts:
        c.rect(x0 + 10, y, x1 - x0 - 20, h, fill=S.PAPER, stroke=S.INK, width=2.2, rx=8)
        c.rect(x0 + 10, y, 8, h, fill=color, rx=4)
        labels.append((x0 + 150, y + h / 2, 230, head,
                       "text-align:left;font-weight:500;color:%s" % S.INK))
        labels.append((x1 - 150, y + h / 2, 240, sub, "text-align:right"))
        y += h + 7
    c.rect(x0, 28, x1 - x0, y - 28, fill="none", stroke=S.INK, width=3, rx=14)
    labels.append((W / 2, 14, 360, "<f2>KONTEXTFENSTER</f2>",
                   "font-size:14px;font-weight:600;color:%s" % S.INK))
    # what fell out sits under the window, the arrow says where it went
    c.arrow(W / 2, y + 10, W / 2, y + 36, color=S.MUTED, width=2.2)
    labels.append((W / 2, y + 54, W, "… die ersten Sätze des Gesprächs"))
    labels.append((W / 2, y + 76, W, "… die Datei von vorhin"))
    labels.append((W / 2, 310, W, "Ist es voll, fällt das Älteste heraus — das Modell vergisst.",
                   "font-size:15px;font-weight:500;color:%s" % S.BODY))
    return c.svg("Das Kontextfenster als Rahmen um System-Anweisung, Verlauf, Anhänge und "
                 "Antwort; was nicht mehr hineinpasst, fällt unten heraus"), labels


def rag():
    """Retrieval-augmented generation: search first, then answer from what was found."""
    c = S.Canvas(W, H)
    labels = []
    bw, bh, y = 170, 80, 40
    cols = [("FRAGE", "was du wissen willst", S.INK),
            ("SUCHE", "im eigenen Bestand", S.ORANGE),
            ("FUNDSTELLEN", "in den Prompt", S.GREEN),
            ("ANTWORT", "aus dem Gelesenen", S.INK)]
    xs = [row(i, bw) for i in range(4)]
    for x, (head, sub, color) in zip(xs, cols):
        chip(c, labels, x, y, bw, bh, head, sub, color)
    for i in range(3):
        c.arrow(xs[i] + bw + 6, y + bh / 2, xs[i + 1] - 6, y + bh / 2, color=S.MUTED, width=2.2)
    # the store the search reaches into
    sy = y + bh + 54
    c.rect(xs[1], sy, bw, 46, fill="#F4F7FC", stroke=S.MUTED, width=2, rx=9)
    labels.append((xs[1] + bw / 2, sy + 23, bw - 16, "Dokumente · Skripte · Netz",
                   "color:%s" % S.BODY))
    c.arrow(xs[1] + bw / 2, sy - 6, xs[1] + bw / 2, y + bh + 8, color=S.MUTED, width=2.2)
    labels.append((W / 2, 262, W, "Die Antwort steht nicht im Gedächtnis des Modells, "
                                  "sondern im mitgelieferten Text.",
                   "font-size:15px;font-weight:500;color:%s" % S.BODY))
    labels.append((W / 2, 292, W, "Darum ist sie aktuell — und man kann nachschlagen, woher sie kommt."))
    return c.svg("RAG in vier Schritten: Frage, Suche im eigenen Bestand, Fundstellen in den "
                 "Prompt, Antwort aus dem Gelesenen"), labels


def agenten_schleife():
    """The agent loop: plan, act with a tool, read the result, check - until the goal is reached."""
    c = S.Canvas(W, H)
    labels = []
    bw, bh = 230, 76
    pos = {"plan": (90, 26), "tool": (496, 26), "erg": (496, 172), "pruef": (90, 172)}
    nodes = [("plan", "PLANEN", "was ist der nächste Schritt?", S.INK),
             ("tool", "HANDELN", "ein Werkzeug aufrufen", S.ORANGE),
             ("erg", "ERGEBNIS", "zurück ins Kontextfenster", S.GREEN),
             ("pruef", "PRÜFEN", "Ziel erreicht — oder weiter?", S.RED)]
    for key, head, sub, color in nodes:
        x, y = pos[key]
        chip(c, labels, x, y, bw, bh, head, sub, color)
    a = 10
    c.arrow(pos["plan"][0] + bw + a, pos["plan"][1] + bh / 2,
            pos["tool"][0] - a, pos["tool"][1] + bh / 2, color=S.MUTED, width=2.2)
    c.arrow(pos["tool"][0] + bw / 2, pos["tool"][1] + bh + a,
            pos["erg"][0] + bw / 2, pos["erg"][1] - a, color=S.MUTED, width=2.2)
    c.arrow(pos["erg"][0] - a, pos["erg"][1] + bh / 2,
            pos["pruef"][0] + bw + a, pos["pruef"][1] + bh / 2, color=S.MUTED, width=2.2)
    c.arrow(pos["pruef"][0] + bw / 2, pos["pruef"][1] - a,
            pos["plan"][0] + bw / 2, pos["plan"][1] + bh + a, color=S.MUTED, width=2.2)
    labels.append((W / 2, 130, 300, "<f2>DIE SCHLEIFE</f2>",
                   "font-size:13px;font-weight:600;color:%s" % S.MUTED))
    labels.append((W / 2, 152, 300, "läuft ohne Rückfrage"))
    labels.append((W / 2, 292, W, "Der Mensch setzt Ziel und Grenzen — die Reihenfolge der "
                                  "Schritte bestimmt das Modell.",
                   "font-size:15px;font-weight:500;color:%s" % S.BODY))
    return c.svg("Die Schleife eines Agenten: planen, handeln, Ergebnis lesen, prüfen - "
                 "und wieder von vorn"), labels


FIGURES = {"neuron": neuron, "token": token, "wortschatz": wortschatz, "netz": netz,
           "training": training, "fenster": fenster, "rag": rag,
           "agent": agenten_schleife}

if __name__ == "__main__":
    svg, labels = FIGURES[sys.argv[1]]()
    print(svg)
    for lab in labels:
        print("<!-- label %g %g %g: %s -->" % (lab[0], lab[1], lab[2], lab[3]))
