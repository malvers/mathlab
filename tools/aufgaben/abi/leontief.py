#!/usr/bin/env python3
"""Abitur-Training BGY - Leontief-Modell und Matrizen mit Parameter (Wahlpflicht 2, LK).

    python3 tools/aufgaben/abi/leontief.py

Wahlpflicht 2 the way the Saxon originals ask it: an input-output table that has to be
turned into a technology matrix, the Leontief inverse for a changed final demand, and a
parametrised matrix whose determinant decides how many solutions the system has.
Context, numbers, wording and figures are our own; every number is recomputed in check()
with exact fractions.
"""
import math
import os
import sys
from fractions import Fraction as F

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

SEKTOR = ("S₁", "S₂", "S₃")

# Aufgabe 1/2: the input-output table. Row i = deliveries of sector i, column j = what
# sector j receives; then the consumption column and the total production.
TABLE = [[0, 60, 200],
         [60, 20, 40],
         [120, 80, 80]]
KONSUM = [40, 80, 120]
GESAMT = [300, 200, 400]

# technology matrix: every column divided by the total production of the sector that
# heads the column (the receiving one) - a_ij = x_ij / x_j
A = [[F(TABLE[i][j], GESAMT[j]) for j in range(3)] for i in range(3)]
E = [[F(1) if i == j else F(0) for j in range(3)] for i in range(3)]
EA = [[E[i][j] - A[i][j] for j in range(3)] for i in range(3)]

# Aufgabe 2: the changed final demand - every sector asks for 20 ME more
NACHFRAGE2 = [60, 100, 140]
PRODUKTION2 = [380, 250, 490]

# Aufgabe 3: the parametrised matrix, det(A_k) = k^3 - 4k = k(k-2)(k+2)
BVEK = [2, 1, 2]
KRIT = (-2, 0, 2)


# ------------------------------------------------------------- exact matrix helpers ---
def mat(M, N):
    return [[sum(M[i][k] * N[k][j] for k in range(len(N))) for j in range(len(N[0]))]
            for i in range(len(M))]


def mv(M, v):
    return [sum(M[i][k] * v[k] for k in range(len(v))) for i in range(len(M))]


def det3(M):
    return (M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1])
            - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
            + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]))


def inv3(M):
    """Gauss-Jordan with fractions - no float ever touches these numbers."""
    n = 3
    W = [[F(x) for x in M[i]] + [F(1) if i == j else F(0) for j in range(n)] for i in range(n)]
    for c in range(n):
        p = next((r for r in range(c, n) if W[r][c] != 0), None)
        if p is None:
            return None
        W[c], W[p] = W[p], W[c]
        piv = W[c][c]
        W[c] = [v / piv for v in W[c]]
        for r in range(n):
            if r != c and W[r][c] != 0:
                f = W[r][c]
                W[r] = [a - f * b for a, b in zip(W[r], W[c])]
    return [row[n:] for row in W]


LEO = inv3(EA)                       # the Leontief inverse (E - A)^-1
ZEILEN = [sum(row) for row in LEO]   # row sums - the answer to part 2d


def Ak(k):
    return [[F(k), F(2), F(0)], [F(1), F(k), F(1)], [F(0), F(2), F(k)]]


# ------------------------------------------------------------------------- figures ---
def fig_tabelle():
    """The input-output table as a drawn table - scales with the page and prints sharp."""
    d = S.Diagram(576, 200)
    d.text(288, 20, "Alle Angaben in Mengeneinheiten (ME)", 12, S.MUTED)
    head = ["von / an"] + list(SEKTOR) + ["Konsum", "Gesamt"]
    rows = [[SEKTOR[i]] + [str(v) for v in TABLE[i]] + [str(KONSUM[i]), str(GESAMT[i])]
            for i in range(3)]
    d.table(9, 34, 6, 4, 93, 39, [head] + rows)
    return d.svg("Input-Output-Tabelle mit den Lieferungen zwischen drei Sektoren, "
                 "dem Konsum und der Gesamtproduktion")


def _pair(d, p, q, lab_pq, lab_qp, half=(48, 28), sep=9.0, lift=13.0):
    """Both delivery directions between two sector boxes, drawn side by side.

    Diagram.link would put the two arrows on top of each other, so both are shifted
    along the normal of the connecting line; the labels go one step further out."""
    (x1, y1), (x2, y2) = p, q
    dx, dy = x2 - x1, y2 - y1
    ln = math.hypot(dx, dy)
    ux, uy = dx / ln, dy / ln
    nx, ny = -uy, ux
    hw, hh = half
    # where the line leaves the box, plus a small gap
    exit_ = min(hw / max(abs(ux), 1e-9), hh / max(abs(uy), 1e-9)) + 9
    for sgn, lab, src, dst in ((1, lab_pq, p, q), (-1, lab_qp, q, p)):
        a = (src[0] + sgn * nx * sep, src[1] + sgn * ny * sep)
        b = (dst[0] + sgn * nx * sep, dst[1] + sgn * ny * sep)
        d.link(a, b, lab, S.MUTED, 1.2, size=11.5,
               off=(sgn * nx * lift, sgn * ny * lift + 4), shorten=exit_)


def _loop(d, cx, cy, half, label, side="right"):
    """Self consumption: a short arc that leaves the box and comes back into it."""
    hw, hh = half
    mid = d.arrowhead(S.MUTED)
    if side == "right":
        x0 = cx + hw
        path = "M %.1f %.1f C %.1f %.1f, %.1f %.1f, %.1f %.1f" % (
            x0, cy - 13, x0 + 48, cy - 32, x0 + 48, cy + 32, x0 + 2, cy + 13)
        lx, ly = x0 + 56, cy + 4
    else:                                              # below the box
        y0 = cy + hh
        path = "M %.1f %.1f C %.1f %.1f, %.1f %.1f, %.1f %.1f" % (
            cx - 13, y0, cx - 34, y0 + 44, cx + 34, y0 + 44, cx + 13, y0 + 2)
        lx, ly = cx, y0 + 60
    d.raw('<path d="%s" fill="none" stroke="%s" stroke-width="1.2"'
          ' marker-end="url(#%s)"/>' % (path, S.MUTED, mid))
    d.text(lx, ly, label, 11.5, S.BODY, halo=S.PAPER)


def fig_verflechtung():
    """Three sector boxes, the deliveries in both directions, the self consumption and
    the arrows that leave the model into consumption."""
    d = S.Diagram(620, 398)
    half = (48, 28)
    P = [(165, 108), (455, 108), (300, 285)]
    fills = ("#EEF2F8", "#FCF3D8", "#EAF1DC")
    for i in range(3):
        d.box(P[i][0], P[i][1], 2 * half[0], 2 * half[1], SEKTOR[i], fill=fills[i],
              sub="%d ME" % GESAMT[i])
    _pair(d, P[0], P[1], str(TABLE[0][1]), str(TABLE[1][0]), half)
    _pair(d, P[0], P[2], str(TABLE[0][2]), str(TABLE[2][0]), half)
    _pair(d, P[1], P[2], str(TABLE[1][2]), str(TABLE[2][1]), half)
    _loop(d, P[1][0], P[1][1], half, str(TABLE[1][1]), "right")
    _loop(d, P[2][0], P[2][1], half, str(TABLE[2][2]), "below")
    # consumption leaves the three sectors
    for i in (0, 1):
        x, y = P[i]
        d.arrow(x, y - half[1] - 4, x, y - half[1] - 44, S.RED, 1.3)
        d.text(x + 13, y - half[1] - 24, str(KONSUM[i]), 11.5, S.RED, "start")
        d.text(x, y - half[1] - 54, "Konsum", 12, S.BODY)
    x, y = P[2]
    d.arrow(x + half[0] + 4, y, x + half[0] + 92, y, S.RED, 1.3)
    d.text(x + half[0] + 48, y - 9, str(KONSUM[2]), 11.5, S.RED)
    d.text(x + half[0] + 100, y + 4, "Konsum", 12, S.BODY, "start")
    d.text(8, 388, "Zahlen an den Pfeilen: Lieferungen in ME", 11.5, S.MUTED, "start")
    return d.svg("Verflechtungsdiagramm der drei Sektoren mit Lieferungen, "
                 "Eigenverbrauch und Konsum")


def fig_produktion():
    """Total production before and after the rise in final demand."""
    p = S.Plot((-0.9, 3.4), (0, 640), w=470, h=290, pad=(52, 22, 24, 40))
    p.axes(1, 100, xlabel="", ylabel="ME", xticks=False, ydec=0)
    for i in range(3):
        u = i + 0.5
        for k, (val, col) in enumerate(((GESAMT[i], S.MUTED), (PRODUKTION2[i], S.GREEN))):
            x1, x2 = p.X(u - 0.34 + k * 0.34), p.X(u - 0.34 + (k + 1) * 0.34)
            p.rect(x1, p.Y(val), x2 - x1, p.Y(0) - p.Y(val), fill=col,
                   stroke=S.PAPER, width=1, opacity=0.75 if k == 0 else 1)
            p.text((x1 + x2) / 2.0, p.Y(val) - 6, str(val), 11.5, S.INK)
        p.text(p.X(u), p.Y(0) + 18, SEKTOR[i], 13, S.INK, italic=True)
    # legend above the bars, well inside the frame - to the right it would run out of
    # the SVG and land on the 490 label (seen in the first render)
    p.rect(p.X(0.15), p.Y(620), 14, 12, fill=S.MUTED, opacity=0.75)
    p.text(p.X(0.15) + 20, p.Y(620) + 11, "bisher", 11.5, S.BODY, "start")
    p.rect(p.X(0.15), p.Y(555), 14, 12, fill=S.GREEN)
    p.text(p.X(0.15) + 20, p.Y(555) + 11, "bei der neuen Nachfrage", 11.5, S.BODY, "start")
    return p.svg("Balkenvergleich der Gesamtproduktion vor und nach der Erhoehung "
                 "der Nachfrage")


def fig_determinante():
    """det(A_k) over k. The window holds x=0 and y=0, so Plot.axes really draws both
    axes inside the frame."""
    p = S.Plot((-3.4, 3.4), (-17, 17), w=520, h=340, pad=(44, 26, 22, 34))
    p.grid(1, 4)
    p.axes(1, 4, xlabel="k", ylabel="d(k)", origin="")
    p.curve(lambda k: k ** 3 - 4 * k, -3.3, 3.3)
    for k in KRIT:
        p.point(k, 0, color=S.GREEN, size=4.4)
    p.text(p.X(-3.15), p.Y(13.2), "Nullstellen: k = -2, k = 0, k = 2", 12.5,
           S.BODY, "start")
    return p.svg("Graph der Determinante in Abhaengigkeit vom Parameter k mit "
                 "den drei markierten Nullstellen")


# --------------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-leontief", "Leontief-Modell und Matrizen mit Parameter",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Wahlpflicht 2 · Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Wahlpflicht 2: Leontief-Modell mit drei "
               "Sektoren, Technologiematrix, Leontief-Inverse und eine Matrix mit "
               "Parameter — mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Drei Sektoren, eine Tabelle", 1,
    r"Eine Modellregion wird durch die drei Sektoren $S_1$ (Rohstoffe), $S_2$ (Energie) "
    r"und $S_3$ (Fertigung) beschrieben. Die Tabelle zeigt, wie viele Mengeneinheiten "
    r"(ME) jeder Sektor an die anderen liefert, wie viel in den Konsum geht und wie groß "
    r"die Gesamtproduktion ist. Eine **Zeile** gehört zum liefernden Sektor, eine "
    r"**Spalte** zum empfangenden.",
    [
        r"Bestimmen Sie die Technologiematrix $A$ (Inputmatrix) des Modells.",
        r"Die letzte Spalte der Tabelle ist der Produktionsvektor $\vec{x}$. Bestätigen "
        r"Sie mit $\vec{y} = (E - A) \cdot \vec{x}$, dass sich daraus genau die "
        r"Konsumspalte der Tabelle ergibt.",
        r"Deuten Sie das Element $a_{13} = 0{,}5$ im Sachzusammenhang.",
    ],
    [
        r"Jede **Spalte** der Tabelle wird durch die Gesamtproduktion des Sektors "
        r"geteilt, der über dieser Spalte steht: die Spalte $S_1$ durch $300$, die "
        r"Spalte $S_2$ durch $200$, die Spalte $S_3$ durch $400$. Damit ist "
        r"$A = \begin{pmatrix}0 & 0{,}3 & 0{,}5\\0{,}2 & 0{,}1 & 0{,}1\\"
        r"0{,}4 & 0{,}4 & 0{,}2\end{pmatrix}$, "
        r"denn zum Beispiel $a_{21} = \tfrac{60}{300} = 0{,}2$, "
        r"$a_{32} = \tfrac{80}{200} = 0{,}4$ und $a_{13} = \tfrac{200}{400} = 0{,}5$.",
        r"Mit $\vec{x} = \begin{pmatrix}300\\200\\400\end{pmatrix}$ und "
        r"$E - A = \begin{pmatrix}1 & -0{,}3 & -0{,}5\\-0{,}2 & 0{,}9 & -0{,}1\\"
        r"-0{,}4 & -0{,}4 & 0{,}8\end{pmatrix}$ wird zeilenweise multipliziert: "
        r"$1 \cdot 300 - 0{,}3 \cdot 200 - 0{,}5 \cdot 400 = 300 - 60 - 200 = 40$, "
        r"$-0{,}2 \cdot 300 + 0{,}9 \cdot 200 - 0{,}1 \cdot 400 = -60 + 180 - 40 = 80$ "
        r"und $-0{,}4 \cdot 300 - 0{,}4 \cdot 200 + 0{,}8 \cdot 400 = "
        r"-120 - 80 + 320 = 120$. Das ist genau die Konsumspalte der Tabelle.",
        r"Für **eine** ME Gesamtproduktion des Sektors $S_3$ werden $0{,}5$ ME aus "
        r"$S_1$ als Vorleistung gebraucht. In der Tabelle steht das als $200$ ME "
        r"Lieferung bei einer Gesamtproduktion von $400$ ME: $S_3$ ist der Sektor, der "
        r"am stärksten von den Rohstoffen abhängt.",
    ],
    falle=r"Geteilt wird **spaltenweise**, also durch die Gesamtproduktion des Sektors, "
          r"der die Lieferung **erhält**: $a_{12} = \tfrac{60}{200} = 0{,}3$ und nicht "
          r"$\tfrac{60}{300} = 0{,}2$. Wer zeilenweise teilt, bekommt die Outputmatrix "
          r"— eine ganz andere Matrix. Mit ihr liefert $(E - A) \cdot \vec{x}$ in der "
          r"ersten Zeile $-6\tfrac{2}{3}$ statt der $40$ ME Konsum.",
    figs=[(fig_tabelle(),
           "Input-Output-Tabelle der drei Sektoren. Die Zeilensumme aus Lieferungen und "
           "Konsum ergibt jeweils die Gesamtproduktion."),
          (fig_verflechtung(),
           "Dasselbe Modell als Verflechtungsdiagramm. Die Schleifen an S₂ und S₃ sind "
           "der Eigenverbrauch, die roten Pfeile führen aus dem Modell heraus in den "
           "Konsum.")],
)

s.task(
    "Wenn die Nachfrage steigt", 2,
    r"Die Region rechnet mit einer neuen Endnachfrage "
    r"$\vec{y}_2 = \begin{pmatrix}60\\100\\140\end{pmatrix}$, also mit je $20$ ME mehr "
    r"in jedem Sektor. Gesucht ist die Gesamtproduktion, die diese Nachfrage möglich "
    r"macht. Aus $\vec{x} = A \cdot \vec{x} + \vec{y}$ folgt "
    r"$(E - A) \cdot \vec{x} = \vec{y}$ und daraus "
    r"$\vec{x} = (E - A)^{-1} \cdot \vec{y}$. Die Matrix $(E - A)^{-1}$ heißt "
    r"**Leontief-Inverse**; ihre Einträge werden mit $l_{ij}$ bezeichnet.",
    [
        r"Zeigen Sie, dass $E - A$ invertierbar ist, und geben Sie die Leontief-Inverse "
        r"an.",
        r"Berechnen Sie die Gesamtproduktion $\vec{x}_2$ zur Nachfrage $\vec{y}_2$.",
        r"Deuten Sie das Element $l_{13} = 1{,}2$ im Sachzusammenhang.",
        r"Erklären Sie, warum sich die Mehrproduktion gegenüber Aufgabe 1 allein aus den "
        r"Zeilensummen von $(E - A)^{-1}$ ablesen lässt, und geben Sie sie an.",
    ],
    [
        r"Entwicklung nach der ersten Zeile: "
        r"$\det(E - A) = 1 \cdot \big(0{,}9 \cdot 0{,}8 - (-0{,}1) \cdot (-0{,}4)\big) "
        r"- (-0{,}3) \cdot \big((-0{,}2) \cdot 0{,}8 - (-0{,}1) \cdot (-0{,}4)\big) "
        r"+ (-0{,}5) \cdot \big((-0{,}2) \cdot (-0{,}4) - 0{,}9 \cdot (-0{,}4)\big) "
        r"= 1 \cdot 0{,}68 - (-0{,}3) \cdot (-0{,}2) + (-0{,}5) \cdot 0{,}44 "
        r"= 0{,}68 - 0{,}06 - 0{,}22 = 0{,}4$. "
        r"Wegen $0{,}4 \neq 0$ existiert die Inverse. Der Gauß-Jordan-Algorithmus mit "
        r"dem Schema $(E - A \mid E)$ liefert "
        r"$(E - A)^{-1} = \begin{pmatrix}1{,}7 & 1{,}1 & 1{,}2\\0{,}5 & 1{,}5 & 0{,}5\\"
        r"1{,}1 & 1{,}3 & 2{,}1\end{pmatrix}$. "
        r"Probe mit der ersten Zeile von $E - A$: "
        r"$1 \cdot 1{,}7 - 0{,}3 \cdot 0{,}5 - 0{,}5 \cdot 1{,}1 = 1$ und "
        r"$1 \cdot 1{,}1 - 0{,}3 \cdot 1{,}5 - 0{,}5 \cdot 1{,}3 = 0$.",
        r"$\vec{x}_2 = (E - A)^{-1} \cdot \vec{y}_2$: "
        r"$1{,}7 \cdot 60 + 1{,}1 \cdot 100 + 1{,}2 \cdot 140 = 102 + 110 + 168 = 380$, "
        r"$0{,}5 \cdot 60 + 1{,}5 \cdot 100 + 0{,}5 \cdot 140 = 30 + 150 + 70 = 250$ und "
        r"$1{,}1 \cdot 60 + 1{,}3 \cdot 100 + 2{,}1 \cdot 140 = 66 + 130 + 294 = 490$. "
        r"Also $\vec{x}_2 = \begin{pmatrix}380\\250\\490\end{pmatrix}$ ME.",
        r"Steigt die Endnachfrage nach dem Gut des Sektors $S_3$ um **eine** ME, so muss "
        r"$S_1$ insgesamt $1{,}2$ ME mehr produzieren. Darin stecken die direkte "
        r"Lieferung an $S_3$ und alle indirekten Wege, auf denen $S_1$ über $S_2$ und "
        r"$S_3$ noch einmal gebraucht wird — deshalb ist $l_{13} = 1{,}2$ größer als "
        r"$a_{13} = 0{,}5$.",
        r"Die Abbildung $\vec{y} \mapsto (E - A)^{-1} \cdot \vec{y}$ ist linear, also ist "
        r"$\Delta\vec{x} = (E - A)^{-1} \cdot \Delta\vec{y}$. Mit "
        r"$\Delta\vec{y} = \begin{pmatrix}20\\20\\20\end{pmatrix}$ wird jede Zeile der "
        r"Inversen einfach aufsummiert und mit $20$ multipliziert. Die Zeilensummen sind "
        r"$1{,}7 + 1{,}1 + 1{,}2 = 4$, $\;0{,}5 + 1{,}5 + 0{,}5 = 2{,}5$ und "
        r"$1{,}1 + 1{,}3 + 2{,}1 = 4{,}5$, also "
        r"$\Delta\vec{x} = \begin{pmatrix}80\\50\\90\end{pmatrix}$ ME. Das passt zu b): "
        r"$380 - 300 = 80$, $\;250 - 200 = 50$, $\;490 - 400 = 90$.",
    ],
    falle=r"Invertiert wird $E - A$, **nicht** $A$ — und die Inverse steht **links** vom "
          r"Vektor: $\vec{x} = (E - A)^{-1} \cdot \vec{y}$. Das Produkt "
          r"$\vec{y} \cdot (E - A)^{-1}$ wäre für einen Spaltenvektor gar nicht "
          r"definiert.",
    solfigs=[(fig_produktion(),
              "Gesamtproduktion vorher und bei der neuen Nachfrage. Je 20 ME mehr Konsum "
              "verlangen 80, 50 und 90 ME mehr Produktion.")],
)

s.task(
    "Eine Matrix mit Parameter", 3,
    r"Ob sich ein Verflechtungsmodell überhaupt umkehren lässt, entscheidet die "
    r"Determinante. Für jede reelle Zahl $k$ sei "
    r"$A_k = \begin{pmatrix}k & 2 & 0\\1 & k & 1\\0 & 2 & k\end{pmatrix}$ und "
    r"$\vec{b} = \begin{pmatrix}2\\1\\2\end{pmatrix}$.",
    [
        r"Berechnen Sie $\det(A_k)$ in Abhängigkeit von $k$ und bestimmen Sie alle $k$, "
        r"für die $A_k$ keine Inverse besitzt.",
        r"Bestimmen Sie für $k = 1$ die Lösung des Gleichungssystems "
        r"$A_k \cdot \vec{x} = \vec{b}$.",
        r"Untersuchen Sie für die in a) gefundenen Werte von $k$, ob "
        r"$A_k \cdot \vec{x} = \vec{b}$ keine oder unendlich viele Lösungen hat. Geben "
        r"Sie die Lösungsmenge an, wo es unendlich viele sind.",
        r"Beurteilen Sie die Aussage: „Eine Matrix, deren Einträge alle positiv sind, "
        r"ist immer invertierbar.“",
    ],
    [
        r"Entwicklung nach der ersten Spalte: "
        r"$\det(A_k) = k \cdot \begin{vmatrix}k & 1\\2 & k\end{vmatrix} "
        r"- 1 \cdot \begin{vmatrix}2 & 0\\2 & k\end{vmatrix} "
        r"= k \cdot (k^2 - 2) - 2k = k^3 - 4k = k \cdot (k - 2) \cdot (k + 2)$. "
        r"Die Determinante ist genau für $k = -2$, $k = 0$ und $k = 2$ null; für diese "
        r"drei Werte existiert $A_k^{-1}$ nicht, für alle anderen $k$ schon.",
        r"Für $k = 1$ ist $\det(A_1) = 1 - 4 = -3 \neq 0$, es gibt also genau eine "
        r"Lösung. Das System lautet $x_1 + 2x_2 = 2$, $\;x_1 + x_2 + x_3 = 1$, "
        r"$\;2x_2 + x_3 = 2$. Aus der ersten Gleichung folgt $x_1 = 2 - 2x_2$, aus der "
        r"dritten $x_3 = 2 - 2x_2$. Eingesetzt in die zweite: "
        r"$(2 - 2x_2) + x_2 + (2 - 2x_2) = 4 - 3x_2 = 1$, also $x_2 = 1$ und damit "
        r"$x_1 = 0$, $x_3 = 0$. Lösung: "
        r"$\vec{x} = \begin{pmatrix}0\\1\\0\end{pmatrix}$.",
        r"**$k = 0$:** Das System lautet $2x_2 = 2$, $\;x_1 + x_3 = 1$, $\;2x_2 = 2$. "
        r"Die erste und die dritte Gleichung sind gleich, es bleiben zwei unabhängige "
        r"Gleichungen für drei Unbekannte: $x_2 = 1$ und $x_1 + x_3 = 1$. Es gibt "
        r"**unendlich viele** Lösungen, "
        r"$L = \left\{\begin{pmatrix}t\\1\\1-t\end{pmatrix} \Big| \; t \in \mathbb{R}"
        r"\right\}$. "
        r"**$k = 2$:** Aus $2x_1 + 2x_2 = 2$ folgt $x_1 = 1 - x_2$, aus "
        r"$2x_2 + 2x_3 = 2$ folgt $x_3 = 1 - x_2$; die mittlere Gleichung wird zu "
        r"$(1 - x_2) + 2x_2 + (1 - x_2) = 2$, verlangt ist aber $1$ — **keine** Lösung. "
        r"**$k = -2$:** Aus $-2x_1 + 2x_2 = 2$ folgt $x_2 = x_1 + 1$, aus "
        r"$2x_2 - 2x_3 = 2$ folgt $x_3 = x_1$; die mittlere Gleichung wird zu "
        r"$x_1 - 2(x_1 + 1) + x_1 = -2 \neq 1$ — ebenfalls **keine** Lösung.",
        r"Die Aussage ist **falsch**. Gegenbeispiel: "
        r"$\begin{pmatrix}2 & 3\\4 & 6\end{pmatrix}$ hat lauter positive Einträge, aber "
        r"$\det = 2 \cdot 6 - 3 \cdot 4 = 0$ — die zweite Zeile ist das Doppelte der "
        r"ersten. Über die Invertierbarkeit entscheidet allein, ob die Determinante null "
        r"ist, nicht das Vorzeichen der Einträge. Die Gegenrichtung zeigt Aufgabe 2: "
        r"$E - A$ hat mehrere negative Einträge und ist wegen $\det = 0{,}4 \neq 0$ "
        r"trotzdem invertierbar.",
    ],
    falle=r"$\det(A_k) = 0$ heißt nur **nicht eindeutig lösbar**. Ob dann gar keine oder "
          r"unendlich viele Lösungen herauskommen, entscheidet erst die rechte Seite "
          r"$\vec{b}$: bei $k = 0$ passt sie zu den Gleichungen, bei $k = \pm 2$ nicht.",
    solfigs=[(fig_determinante(),
              "Die Determinante als Funktion von k. Zwischen den Nullstellen wechselt "
              "sie das Vorzeichen — genau dort bricht die Eindeutigkeit weg.")],
)


# ---------------------------------------------------------------------- nachrechnen ---
def check():
    # --- Aufgabe 1: table, technology matrix, consumption ---
    for i in range(3):
        assert sum(TABLE[i]) + KONSUM[i] == GESAMT[i], "Zeile %d geht nicht auf" % i
    assert A == [[F(0), F(3, 10), F(1, 2)],
                 [F(1, 5), F(1, 10), F(1, 10)],
                 [F(2, 5), F(2, 5), F(1, 5)]], A
    assert A[0][2] == F(1, 2) and A[0][1] == F(3, 10)
    assert A[1][0] == F(60, 300) and A[2][1] == F(80, 200)
    assert mv(EA, [F(v) for v in GESAMT]) == [F(v) for v in KONSUM]
    assert A[0][2] == max(A[0]), "S3 haengt am staerksten von S1 ab"
    # the row-wise mistake: that is the output matrix, and it is neither A nor A transposed
    B = [[F(TABLE[i][j], GESAMT[i]) for j in range(3)] for i in range(3)]
    assert B != A and B != [[A[j][i] for j in range(3)] for i in range(3)]
    EB = [[E[i][j] - B[i][j] for j in range(3)] for i in range(3)]
    assert mv(EB, [F(v) for v in GESAMT])[0] == F(-20, 3), mv(EB, [F(v) for v in GESAMT])
    assert F(60, 300) != F(60, 200)

    # --- Aufgabe 2: Leontief inverse ---
    assert det3(EA) == F(2, 5), det3(EA)
    assert LEO == [[F(17, 10), F(11, 10), F(6, 5)],
                   [F(1, 2), F(3, 2), F(1, 2)],
                   [F(11, 10), F(13, 10), F(21, 10)]], LEO
    assert mat(EA, LEO) == E, "Gegenprobe (E-A)(E-A)^-1 = E fehlgeschlagen"
    assert mat(LEO, EA) == E
    assert LEO[0][2] == F(6, 5)
    # the three numbers quoted in the determinant line of the solution
    assert F(9, 10) * F(8, 10) - F(1, 10) * F(4, 10) == F(68, 100)
    assert F(-2, 10) * F(8, 10) - F(1, 10) * F(4, 10) == F(-20, 100)
    assert F(2, 10) * F(4, 10) + F(9, 10) * F(4, 10) == F(44, 100)
    # the probe printed in the solution
    assert (F(1) * LEO[0][0] - F(3, 10) * LEO[1][0] - F(1, 2) * LEO[2][0]) == 1
    assert (F(1) * LEO[0][1] - F(3, 10) * LEO[1][1] - F(1, 2) * LEO[2][1]) == 0
    assert mv(LEO, [F(v) for v in NACHFRAGE2]) == [F(v) for v in PRODUKTION2]
    assert mv(EA, [F(v) for v in PRODUKTION2]) == [F(v) for v in NACHFRAGE2]
    assert ZEILEN == [F(4), F(5, 2), F(9, 2)], ZEILEN
    delta = [NACHFRAGE2[i] - KONSUM[i] for i in range(3)]
    assert delta == [20, 20, 20]
    assert [20 * z for z in ZEILEN] == [F(80), F(50), F(90)]
    assert [PRODUKTION2[i] - GESAMT[i] for i in range(3)] == [80, 50, 90]

    # --- Aufgabe 3: the parametrised matrix ---
    for k in (-3, -2, -1, 0, 1, 2, 3, 5, 7):
        assert det3(Ak(k)) == k ** 3 - 4 * k, k
        assert k ** 3 - 4 * k == k * (k - 2) * (k + 2)
    assert set(KRIT) == {-2, 0, 2}
    for k in KRIT:
        assert det3(Ak(k)) == 0 and inv3(Ak(k)) is None
    for k in (-3, -1, 1, 3, 4):
        assert det3(Ak(k)) != 0 and inv3(Ak(k)) is not None
    # b) the unique solution for k = 1
    assert det3(Ak(1)) == -3
    loes1 = [F(0), F(1), F(0)]
    assert mv(Ak(1), loes1) == [F(v) for v in BVEK]
    assert inv3(Ak(1)) is not None and mv(inv3(Ak(1)), [F(v) for v in BVEK]) == loes1
    # c) k = 0: a whole line of solutions
    for t in (-4, F(-1, 2), 0, 1, F(7, 3), 10):
        assert mv(Ak(0), [F(t), F(1), 1 - F(t)]) == [F(v) for v in BVEK]
    # c) k = +-2: no solution - a left null vector of A_k that b does not respect
    for k, w in ((2, [1, -2, 1]), (-2, [1, 2, 1])):
        M = Ak(k)
        assert [sum(w[i] * M[i][j] for i in range(3)) for j in range(3)] == [0, 0, 0]
        assert sum(w[i] * BVEK[i] for i in range(3)) != 0
    # d) the counterexample of the judgement task
    assert 2 * 6 - 3 * 4 == 0
    assert det3(EA) != 0 and any(v < 0 for row in EA for v in row)


s.verify(check)
s.save()
