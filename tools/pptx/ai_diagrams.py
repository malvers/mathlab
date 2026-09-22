#!/usr/bin/env python3
"""Own diagrams for the KI-Begriffe deck - same palette as the slide design.

    python3 tools/pptx/ai_diagrams.py        # -> tools/pptx/img/aibegriffe-*.png

Everything here is drawn, not fetched: no licence line to carry, and the shapes say exactly
what the slide talks about. The .pptx embeds them; for the web twin html_deck.asset()
copies them into HTML/decks/img, so both show the same figure.
"""
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import ORANGE, RED, GREEN

NAVY = (14, 36, 78)
BODY = (44, 60, 96)
MUTED = (110, 126, 159)
WHITE = (255, 255, 255)
PAPER = (244, 247, 252)


def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


ORA, RD, GRN = hexrgb(ORANGE), hexrgb(RED), hexrgb(GREEN)

# Orbitron sits in /Library/Fonts on this Mac, Raleway in ~/Library/Fonts - look in both
# instead of hard-coding one folder (diagrams.py pins ~/Library/Fonts and misses Orbitron).
FONT_DIRS = [os.path.expanduser("~/Library/Fonts"), "/Library/Fonts", "/System/Library/Fonts"]


def font(name, size):
    for d in FONT_DIRS:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    raise FileNotFoundError(name + " not found in " + ", ".join(FONT_DIRS))


def font_sym(size):
    """A font that actually carries Greek maths - neither Raleway nor Orbitron has a Sigma,
    and a missing glyph draws nothing at all (no tofu box to warn you)."""
    return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Unicode.ttf", size)


def wrapped(d, text, cx, cy, fnt, max_w, fill=NAVY, lh=1.35):
    """Centred text broken to fit max_w - a one-line footer silently ran off the canvas."""
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        l, _, r, _ = d.textbbox((0, 0), trial, font=fnt)
        if r - l > max_w and cur:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    if cur:
        lines.append(cur)
    step = fnt.size * lh
    y = cy - step * (len(lines) - 1) / 2
    for line in lines:
        centered(d, line, cx, y, fnt, fill)
        y += step
    return len(lines)


def save(img, path, pad=18):
    """Trim the transparent border and save - the canvas is scratch space, the slide
    scales what is left, so leftover margin only makes the drawing smaller."""
    bb = img.getbbox()
    if bb:
        img = img.crop((max(bb[0] - pad, 0), max(bb[1] - pad, 0),
                        min(bb[2] + pad, img.width), min(bb[3] + pad, img.height)))
    img.save(path)
    return path


def box(d, xy, fill=WHITE, outline=NAVY, w=3, r=18):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=w)


def centered(d, text, cx, cy, fnt, fill=NAVY):
    l, t, r, b = d.textbbox((0, 0), text, font=fnt)
    d.text((cx - (r - l) / 2 - l, cy - (b - t) / 2 - t), text, font=fnt, fill=fill)


def arrow(d, p1, p2, color=NAVY, w=5, head=22):
    d.line([p1, p2], fill=color, width=w)
    ang = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
    for s in (0.4, -0.4):
        d.line([p2, (p2[0] - head * math.cos(ang - s), p2[1] - head * math.sin(ang - s))],
               fill=color, width=w)


def dot(d, cx, cy, r, fill=WHITE, outline=NAVY, w=4):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill, outline=outline, width=w)


# --------------------------------------------------------------------- ANN ---
def neuron(path, W=1400, H=760):
    """One artificial neuron: inputs, weights, sum, activation, output."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_txt = font("Raleway-Medium.ttf", 30)
    f_small = font("Raleway-Regular.ttf", 25)
    f_math = font("Raleway-Medium.ttf", 34)

    cx, cy, r = 760, 350, 150
    ins = [("x₁", "Helligkeit", 150), ("x₂", "Kantenanteil", 350), ("x₃", "Rundung", 550)]
    ws = ["w₁", "w₂", "w₃"]

    # inputs on the left, each arrow carrying its weight
    for (lab, sub, y), w in zip(ins, ws):
        dot(d, 170, y, 52, fill=PAPER)
        centered(d, lab, 170, y, f_math, NAVY)
        centered(d, sub, 170, y + 84, f_small, MUTED)
        arrow(d, (228, y), (cx - r - 16, cy + (y - cy) * 0.30), ORA, 5)
        mx, my = (228 + cx - r - 16) / 2, (y + cy + (y - cy) * 0.30) / 2
        d.rounded_rectangle((mx - 38, my - 26, mx + 38, my + 26), radius=9, fill=WHITE,
                            outline=ORA, width=3)
        centered(d, w, mx, my, f_txt, NAVY)

    # the neuron itself
    dot(d, cx, cy, r, fill=WHITE, w=5)
    centered(d, "Σ", cx, cy - 56, font_sym(72), NAVY)
    centered(d, "x₁w₁ + x₂w₂ + x₃w₃ + b", cx, cy + 20, f_small, BODY)
    d.line([(cx - 118, cy + 54), (cx + 118, cy + 54)], fill=MUTED, width=2)
    centered(d, "Aktivierung", cx, cy + 88, f_small, MUTED)

    # output
    arrow(d, (cx + r + 16, cy), (W - 240, cy), GRN, 5)
    dot(d, W - 170, cy, 62, fill=PAPER, outline=GRN, w=5)
    centered(d, "y", W - 170, cy, f_math, NAVY)
    centered(d, "Ausgabe", W - 170, cy + 96, f_small, MUTED)

    wrapped(d, "Jeder Eingang wird mit seinem Gewicht multipliziert, alles wird addiert — "
               "und die Aktivierung entscheidet, was hinten herauskommt.",
            W / 2, H - 60, f_small, W - 160, MUTED)
    return save(img, path)


def netz(path, W=1400, H=860):
    """A small feed-forward network: input layer, two hidden layers, output layer."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_lab = font("Raleway-Medium.ttf", 26)
    f_small = font("Raleway-Regular.ttf", 24)

    layers = [4, 5, 5, 2]
    xs = [260, 570, 880, 1190]
    # one fixed spacing for every layer, each column centred on `mid` - spreading n neurons
    # over a fixed band puts the 2 output ones at the extreme edges and looks accidental
    step, mid = 108, 460
    pts = [[(x, mid + (i - (n - 1) / 2) * step) for i in range(n)]
           for n, x in zip(layers, xs)]

    # edges first, so the neurons sit on top of them
    for a, b in zip(pts, pts[1:]):
        for p in a:
            for q in b:
                d.line([p, q], fill=(203, 214, 234), width=2)
    # a few highlighted edges = "these weights count more"
    for p, q, col in ((pts[0][1], pts[1][2], ORA), (pts[1][2], pts[2][1], ORA),
                      (pts[2][1], pts[3][0], GRN)):
        d.line([p, q], fill=col, width=6)

    names = [("EINGABE", "was hineingeht"), ("VERDECKT", "Merkmale"),
             ("VERDECKT", "Merkmale"), ("AUSGABE", "die Antwort")]
    for col, x, (head, sub) in zip(pts, xs, names):
        for (px, py) in col:
            dot(d, px, py, 30, fill=WHITE, w=4)
        centered(d, head, x, 142, f_lab, NAVY)
        centered(d, sub, x, 180, f_small, MUTED)

    centered(d, "Jede Linie ist ein Gewicht — eine Zahl. Lernen heißt: diese Zahlen verstellen.",
             W / 2, H - 92, f_lab, BODY)
    centered(d, "Ein Sprachmodell hat davon Milliarden.", W / 2, H - 46, f_small, MUTED)
    return save(img, path)


def training(path, W=1420, H=650):
    """The training loop: predict, compare, adjust the weights backwards."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_box = font("Orbitron-Bold.ttf", 25)
    f_txt = font("Raleway-Medium.ttf", 25)
    f_small = font("Raleway-Regular.ttf", 22)

    bw, bh, y = 270, 180, 170
    gap = (W - 80 - 4 * bw) / 3
    cols = [("BEISPIEL", "ein Bild mit Lösung", NAVY),
            ("VORHERSAGE", "das Netz rät", ORA),
            ("FEHLER", "wie weit daneben?", RD),
            ("GEWICHTE", "ein Stück nachjustiert", GRN)]
    xs = [40 + i * (bw + gap) for i in range(4)]
    for x, (head, sub, col) in zip(xs, cols):
        box(d, (x, y, x + bw, y + bh))
        d.rounded_rectangle((x, y, x + 14, y + bh), radius=7, fill=col)
        centered(d, head, x + bw / 2 + 7, y + 68, f_box, NAVY)
        centered(d, sub, x + bw / 2 + 7, y + 122, f_small, MUTED)
    for i in range(3):
        arrow(d, (xs[i] + bw + 18, y + bh / 2), (xs[i + 1] - 18, y + bh / 2))

    # the way back: from the weights to the prediction again
    by = y + bh + 120
    d.line([(xs[3] + bw / 2, y + bh + 16), (xs[3] + bw / 2, by)], fill=GRN, width=5)
    d.line([(xs[3] + bw / 2, by), (xs[1] + bw / 2, by)], fill=GRN, width=5)
    arrow(d, (xs[1] + bw / 2, by), (xs[1] + bw / 2, y + bh + 16), GRN, 5)
    centered(d, "und noch einmal — millionenfach", (xs[1] + xs[3]) / 2 + bw / 2, by + 44,
             f_txt, GRN)

    centered(d, "Niemand programmiert die Gewichte. Sie werden aus Beispielen zurechtgerückt, "
                "bis der Fehler klein ist.", W / 2, H - 46, f_small, MUTED)
    return save(img, path)


# ------------------------------------------------------------------ Modell ---
def token(path, W=1420, H=480):
    """A sentence cut into tokens - the pieces a model actually computes with."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_tok = font("Raleway-Medium.ttf", 34)
    f_small = font("Raleway-Regular.ttf", 23)
    f_num = font("Raleway-Regular.ttf", 21)

    toks = [("Das", NAVY), ("Kon", ORA), ("text", ORA), ("fenster", ORA),
            ("ist", NAVY), ("voll", NAVY), (".", MUTED)]
    ids = ["1094", "4417", "1613", "8022", "689", "2941", "13"]

    pad, gap, y = 26, 14, 220
    widths = []
    for t, _ in toks:
        l, _, r, _ = d.textbbox((0, 0), t, font=f_tok)
        widths.append(r - l + 2 * pad)
    total = sum(widths) + gap * (len(toks) - 1)
    x = (W - total) / 2
    for (t, col), w, i in zip(toks, widths, ids):
        d.rounded_rectangle((x, y, x + w, y + 84), radius=12, fill=WHITE, outline=col, width=4)
        centered(d, t, x + w / 2, y + 42, f_tok, NAVY)
        centered(d, i, x + w / 2, y + 122, f_num, MUTED)
        x += w + gap

    centered(d, "„Das Kontextfenster ist voll.“", W / 2, 140, f_small, MUTED)
    centered(d, "7 Token — ein langes Wort zerfällt in mehrere, jedes wird zu einer Zahl.",
             W / 2, 380, font("Raleway-Medium.ttf", 27), BODY)
    centered(d, "Genau diese Stücke werden gezählt, bezahlt und begrenzt.",
             W / 2, 430, f_small, MUTED)
    return save(img, path)


def fenster(path, W=1360, H=860):
    """What sits inside the context window - and what falls out when it is full."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_head = font("Orbitron-Bold.ttf", 28)
    f_lab = font("Raleway-Medium.ttf", 27)
    f_small = font("Raleway-Regular.ttf", 23)

    # wide and flat on purpose: the slide box is 816x330, so a tall drawing would be
    # scaled down to a narrow strip
    x0, y0, x1 = 130, 150, 1230
    parts = [("System-Anweisung", "Rolle und Regeln", NAVY, 84),
             ("Verlauf", "alles bisher Gesagte", ORA, 128),
             ("Anhänge", "Dateien, Fundstellen", GRN, 96),
             ("Antwort", "muss auch hineinpassen", RD, 84)]
    y = y0
    for head, sub, col, h in parts:
        d.rounded_rectangle((x0, y, x1, y + h), radius=12, fill=WHITE, outline=NAVY, width=3)
        d.rounded_rectangle((x0, y, x0 + 14, y + h), radius=7, fill=col)
        centered(d, head, (x0 + x1) / 2 + 7, y + h / 2 - 16, f_lab, NAVY)
        centered(d, sub, (x0 + x1) / 2 + 7, y + h / 2 + 22, f_small, MUTED)
        y += h + 12

    # the frame around it = the window, and what drops out below
    d.rounded_rectangle((x0 - 26, y0 - 34, x1 + 26, y + 10), radius=20, outline=NAVY, width=5)
    centered(d, "KONTEXTFENSTER", (x0 + x1) / 2, y0 - 66, f_head, NAVY)

    dy = y + 110
    for i, t in enumerate(("… die ersten Sätze des Gesprächs", "… die Datei von vorhin")):
        centered(d, t, (x0 + x1) / 2, dy + i * 40, f_small, (176, 186, 206))
    arrow(d, ((x0 + x1) / 2, y + 24), ((x0 + x1) / 2, dy - 34), (176, 186, 206), 4, head=16)
    centered(d, "Ist es voll, fällt das Älteste heraus — das Modell vergisst.",
             W / 2, H - 42, f_lab, BODY)
    return save(img, path)


# --------------------------------------------------------------------- RAG ---
def rag(path, W=1440, H=660):
    """Retrieval-augmented generation: search first, then answer from what was found."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_box = font("Orbitron-Bold.ttf", 24)
    f_small = font("Raleway-Regular.ttf", 22)
    f_txt = font("Raleway-Medium.ttf", 24)

    bw, bh, y = 290, 170, 190
    gap = (W - 80 - 4 * bw) / 3
    xs = [40 + i * (bw + gap) for i in range(4)]
    cols = [("FRAGE", "was du wissen willst", NAVY),
            ("SUCHE", "im eigenen Bestand", ORA),
            ("FUNDSTELLEN", "wandern in den Prompt", GRN),
            ("ANTWORT", "aus dem Gelesenen", NAVY)]
    for x, (head, sub, col) in zip(xs, cols):
        box(d, (x, y, x + bw, y + bh))
        d.rounded_rectangle((x, y, x + 14, y + bh), radius=7, fill=col)
        centered(d, head, x + bw / 2 + 7, y + 66, f_box, NAVY)
        centered(d, sub, x + bw / 2 + 7, y + 116, f_small, MUTED)
    for i in range(3):
        arrow(d, (xs[i] + bw + 16, y + bh / 2), (xs[i + 1] - 16, y + bh / 2))

    # the store the search reaches into
    sy = y + bh + 96
    d.rounded_rectangle((xs[1], sy, xs[1] + bw, sy + 96), radius=12, fill=PAPER,
                        outline=MUTED, width=3)
    centered(d, "Dokumente · Skripte · Netz", xs[1] + bw / 2, sy + 48, f_small, BODY)
    arrow(d, (xs[1] + bw / 2, sy - 8), (xs[1] + bw / 2, y + bh + 14), MUTED, 3)

    centered(d, "Die Antwort steht nicht im Gedächtnis des Modells, sondern im mitgelieferten Text "
                "— darum ist sie aktuell und belegbar.", W / 2, H - 44, f_txt, BODY)
    return save(img, path)


# ------------------------------------------------------------------ Agent ---
def agent(path, W=1240, H=860):
    """The agent loop: plan, act with a tool, read the result, check - until done."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_box = font("Orbitron-Bold.ttf", 25)
    f_small = font("Raleway-Regular.ttf", 22)
    f_txt = font("Raleway-Medium.ttf", 25)

    bw, bh = 400, 165
    pos = {"plan": (60, 150), "tool": (W - bw - 60, 150),
           "erg": (W - bw - 60, H - bh - 210), "pruef": (60, H - bh - 210)}
    nodes = [("plan", "PLANEN", "was ist der nächste Schritt?", NAVY),
             ("tool", "HANDELN", "ein Werkzeug aufrufen", ORA),
             ("erg", "ERGEBNIS", "zurück ins Kontextfenster", GRN),
             ("pruef", "PRÜFEN", "Ziel erreicht — oder weiter?", RD)]
    for key, head, sub, col in nodes:
        x, y = pos[key]
        box(d, (x, y, x + bw, y + bh))
        d.rounded_rectangle((x, y, x + 14, y + bh), radius=7, fill=col)
        centered(d, head, x + bw / 2 + 7, y + 62, f_box, NAVY)
        centered(d, sub, x + bw / 2 + 7, y + 112, f_small, MUTED)

    a = 24
    arrow(d, (pos["plan"][0] + bw + a, pos["plan"][1] + bh / 2),
          (pos["tool"][0] - a, pos["tool"][1] + bh / 2))
    arrow(d, (pos["tool"][0] + bw / 2, pos["tool"][1] + bh + a),
          (pos["erg"][0] + bw / 2, pos["erg"][1] - a))
    arrow(d, (pos["erg"][0] - a, pos["erg"][1] + bh / 2),
          (pos["pruef"][0] + bw + a, pos["pruef"][1] + bh / 2))
    arrow(d, (pos["pruef"][0] + bw / 2, pos["pruef"][1] - a),
          (pos["plan"][0] + bw / 2, pos["plan"][1] + bh + a))

    centered(d, "DIE SCHLEIFE", W / 2, H / 2 - 20, f_txt, MUTED)
    centered(d, "läuft ohne Rückfrage", W / 2, H / 2 + 18, f_small, MUTED)

    centered(d, "Der Mensch setzt Ziel und Grenzen — die Reihenfolge der Schritte "
                "bestimmt das Modell.", W / 2, H - 46, f_txt, BODY)
    return save(img, path)


DIAGRAMS = {
    "aibegriffe-neuron.png": neuron,
    "aibegriffe-netz.png": netz,
    "aibegriffe-training.png": training,
    "aibegriffe-token.png": token,
    "aibegriffe-fenster.png": fenster,
    "aibegriffe-rag.png": rag,
    "aibegriffe-agent.png": agent,
}

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    # tools/pptx/img is the generator's own folder (git-ignored); html_deck.asset()
    # copies whatever a deck uses from here into HTML/decks/img, which is served
    out = os.path.join(here, "img")
    os.makedirs(out, exist_ok=True)
    for name, fn in DIAGRAMS.items():
        p = fn(os.path.join(out, name))
        print(f"{name:26s} {os.path.getsize(p) // 1024:5d} KB")
