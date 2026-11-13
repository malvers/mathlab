#!/usr/bin/env python3
"""Potenzen - Mathe 11 (BGY): from adding to the six laws of exponents.

Doc, 13.11.2026: his Potenzen.pptx (OneDrive IBB/UNTERRICHT/MATH BGY 11, 39 slides) rebuilt as a deck in our
style - the same path (Addieren -> Multiplizieren -> Potenzieren, then each law with an example and its proof by
"n-mal", the cases n < m and n = m, 2^2,5 and the sixth law, a negative fractional exponent, his 20 exercises),
with his colours (first exponent green, second red) and his curly braces "n-mal" as KaTeX braces. Left out on
purpose: the brain stock photo (slide 6), the ChatGPT screenshot (slide 34, its content is now slide "Jetzt
geht's"), the photo of the formula book (slide 37, now the overview slide with the page number). The GeoGebra
screenshot (slide 35) is drawn with svgfig (mathe11_potenzen_svg.py). Corrected: slide 4 called light and sound
intensity (1/d)^2 "exponentiell" - it is a power law; "Beweis das" -> "Beweis des"; exercises 6, 12, 17 said
"als Potenz mit ... dem Exponenten 2" where a product was meant; the "Berechne" solutions now end in the number.
Only HTML:

    python3 tools/pptx/html_deck.py build_potenzen_mathe11.py

Initial only - after the first build HTML/decks/mathe11-potenzen.html is the source.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
from mathe11_potenzen_svg import potenz, zwei_hoch_x


def g(s):
    """Doc's first exponent colour (n, the left factor): phi green."""
    return "\\textcolor{#799E31}{%s}" % s


def r(s):
    """Doc's second exponent colour (m, the right factor): Upsilon red."""
    return "\\textcolor{#B02418}{%s}" % s


def big(lines):
    """Doc's slides carry big formulas: a line that is a formula (starts with $ or a marked $) in z6, a line of words
    with a formula in z5, sub-lines as they are."""
    out = []
    for text, level in lines:
        if level:
            out.append((text, level))
            continue
        z = "z6" if text.startswith("$") or text.startswith("<m1>") else "z5"
        out.append(("<%s>%s</%s>" % (z, text, z), level))
    return out


N, M = g("n"), r("m")

# ------------------------------------------------------------- the numbers ---
assert 456 * 789 == 359784 and (456 * 7, 456 * 8, 456 * 9) == (3192, 3648, 4104)
assert 319200 + 36480 + 4104 == 359784
assert 2 ** 6 == 64 and 6 * 2 == 12
assert 2 ** 3 * 2 ** 4 == 8 * 16 == 128 == 2 ** 7
assert 2 ** 4 / 2 ** 2 == 16 / 4 == 4
assert abs(2 ** 2.5 - math.sqrt(32)) < 1e-12 and round(math.sqrt(32), 3) == 5.657
assert 32 ** 2 == 1024 == 4 ** 5 and abs(32 ** (-2 / 5) - 0.25) < 1e-12
assert 2 ** 10 == 1024

# Doc's 20 exercises (slides 38/39) with their solutions, every value recomputed
assert 2 ** 4 * 2 ** 3 == 2 ** 7 == 128          # 1
assert 5 ** 2 // 5 ** 1 == 5                      # 2
assert 3 ** 5 == 3 ** 2 * 3 ** 3                  # 3
assert 4 ** 3 * 4 ** 0 == 64                      # 4
assert 2 ** (3 + 2) == 32                         # 7
assert 7 ** 2 * 7 ** 0 == 49                      # 8
assert 3 ** 4 // 3 ** 2 == 9                      # 10
assert (2 ** 3) ** 2 == 2 ** 6 == 64              # 11
assert 5 ** 3 * 5 ** 3 == 5 ** 6                  # 13
assert 4 ** 2 * 4 ** -1 == 4                      # 16
assert 6 ** 3 // 6 ** 3 == 1                      # 18
assert 2 ** (4 - 2) == 4                          # 19

d = MathDeck("mathe11-potenzen.pptx")


def B(title, lines):
    d.bullets(title, big(lines))

d.title("Mathematik · Berufliches Gymnasium 11",
        "Potenzen",
        "Vom Malnehmen zu den Potenzgesetzen")

d.bullets("Warum sind Potenzen wichtig?", [
    ("Geld: **Zinseszins** — $K_n = K_0 \\cdot 1{,}05^n$", 0),
    ("Physik: **radioaktiver Zerfall** — $N = N_0 \\cdot 0{,}5^{\\,t/T}$", 0),
    ("Licht und Schall: doppelter Abstand, ein Viertel so hell — $I \\sim \\left(\\dfrac{1}{d}\\right)^2$", 0),
    ("Computer: Speicher zählt in Zweierpotenzen — $2^{10} = 1024$", 0),
    ("Riesige und winzige Zahlen: Licht schafft $3 \\cdot 10^8$ Meter pro Sekunde", 0),
])

# ------------------------------------------------------- Ruminations ---
d.chapter(0, "Vom Addieren zum Potenzieren", "Wiederkäuen, was wir schon wissen")

B("Addition", [
    ("$\\overbrace{2 + 2 + 2 + 2 + 2 + 2}^{%s} = 12$" % g("6\\text{-mal}"), 0),
    ("Die Abkürzung: **Multiplizieren**", 0),
    ("$%s \\cdot 2 = 12$" % g("6"), 0),
])

B("Warum ist Multiplizieren besser als Addieren?", [
    ("$456 \\cdot 789$ als Addition: $\\underbrace{456 + 456 + 456 + \\dots + 456}_{789\\text{-mal}}$", 0),
    ("Schriftlich: $\\begin{array}{r} 456 \\cdot \\textcolor{#D4960F}{7}\\textcolor{#2A6FB0}{8}"
     "\\textcolor{#799E31}{9} \\\\ \\hline \\textcolor{#D4960F}{3192}\\phantom{00} \\\\ "
     "+\\;\\textcolor{#2A6FB0}{3648}\\phantom{0} \\\\ +\\;\\textcolor{#799E31}{4104} \\\\ \\hline 359784"
     "\\end{array}$", 0),
    ("Drei kleine Produkte statt $788$ Additionen", 0),
])

B("Multiplikation allgemein", [
    ("$\\overbrace{a + a + a + \\dots + a}^{%s} = %s \\cdot a$" % (g("x\\text{-mal}"), g("x")), 0),
    ("**Multiplizieren** ist abgekürztes Addieren", 0),
])

B("Multiplikation", [
    ("$\\overbrace{2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2}^{%s} = 64$" % g("6\\text{-mal}"), 0),
    ("Die Abkürzung: **Potenzieren**", 0),
    ("$2^{%s} = 64$" % g("6"), 0),
])

svg, labels = potenz()
d.figure("Die Potenz ✏️", svg, labels)

B("Potenzen allgemein ✏️", [
    ("$\\overbrace{a \\cdot a \\cdot a \\cdot \\dots \\cdot a}^{%s} = a^{%s}$" % (g("x\\text{-mal}"), g("x")), 0),
    ("**Potenzieren** ist abgekürztes Multiplizieren", 0),
])

# ------------------------------------------------------------ the laws ---
d.chapter(1, "Die Potenzgesetze", "Sechs Regeln — und warum sie stimmen")

# 1st law
B("Das 1. Potenzgesetz ✏️", [
    ("<m1>$a^{%s} \\cdot a^{%s} = a^{%s + %s}$</m1>" % (N, M, N, M), 0),
    ("**gleiche Basis**: die Exponenten werden addiert", 0),
])

B("Beispiel und Beweis des 1. Potenzgesetzes", [
    ("$2^{%s} \\cdot 2^{%s} = 8 \\cdot 16 = 128$" % (g(3), r(4)), 0),
    ("$2^{%s} \\cdot 2^{%s} = \\underbrace{\\underbrace{%s}_{%s} \\cdot \\underbrace{%s}_{%s}}_{7\\text{-mal}}$"
     % (g(3), r(4), g("2 \\cdot 2 \\cdot 2"), g("3\\text{-mal}"),
        r("2 \\cdot 2 \\cdot 2 \\cdot 2"), r("4\\text{-mal}")), 0),
    ("$2^{%s} \\cdot 2^{%s} = 2^{%s + %s} = 2^7 = 128$ — QED 😎" % (g(3), r(4), g(3), r(4)), 0),
])

B("Beweis des 1. Potenzgesetzes", [
    ("$a^{%s} \\cdot a^{%s} = \\underbrace{\\underbrace{%s}_{%s} \\cdot \\underbrace{%s}_{%s}}_{(%s + %s)\\text{-mal}}$"
     % (N, M, g("a \\cdot \\ldots \\cdot a"), g("n\\text{-mal}"), r("a \\cdot \\ldots \\cdot a"), r("m\\text{-mal}"),
        N, M), 0),
    ("$a^{%s} \\cdot a^{%s} = a^{%s + %s}$ ∎" % (N, M, N, M), 0),
])

# 2nd law
B("Das 2. Potenzgesetz ✏️", [
    ("<m1>$\\dfrac{a^{%s}}{a^{%s}} = a^{%s - %s}$</m1>" % (N, M, N, M), 0),
    ("**gleiche Basis**: die Exponenten werden subtrahiert", 0),
])

B("Beispiel und Beweis am Beispiel", [
    ("$\\dfrac{2^{%s}}{2^{%s}} = \\dfrac{16}{4} = 4$" % (g(4), r(2)), 0),
    ("$\\dfrac{2^{%s}}{2^{%s}} = \\dfrac{2 \\cdot 2 \\cdot \\cancel{2} \\cdot \\cancel{2}}{\\cancel{2} \\cdot \\cancel{2}}"
     " = 2 \\cdot 2 = 4$" % (g(4), r(2)), 0),
    ("$\\dfrac{2^{%s}}{2^{%s}} = 2^{%s - %s} = 2^2 = 4$ ✓" % (g(4), r(2), g(4), r(2)), 0),
])

B("Beweis des 2. Potenzgesetzes", [
    ("$\\dfrac{a^{%s}}{a^{%s}} = \\dfrac{\\overbrace{a \\cdot a \\cdot \\ldots \\cdot a}^{%s}}"
     "{\\underbrace{a \\cdot \\ldots \\cdot a}_{%s}}$ — für $%s > %s$" % (N, M, g("n\\text{-mal}"), r("m\\text{-mal}"), N, M), 0),
    ("Kürzen: $%s$ Faktoren fallen weg, $%s - %s$ bleiben stehen" % (M, N, M), 0),
    ("$\\dfrac{a^{%s}}{a^{%s}} = a^{%s - %s}$ ∎" % (N, M, N, M), 0),
])

B("Zwei wichtige Fälle", [
    ("$\\dfrac{a^{%s}}{a^{%s}} = a^{%s - %s}$ — bisher mit $%s > %s$" % (N, M, N, M, N, M), 0),
    ("Was passiert bei $%s < %s$?" % (N, M), 0),
    ("Und bei $%s = %s$?" % (N, M), 0),
])

B("Der Fall $%s < %s$" % (N, M), [
    ("$\\dfrac{a^{%s}}{a^{%s}} = a^{%s - %s} = a^{-2}$" % (g(2), r(4), g(2), r(4)), 0),
    ("$\\dfrac{a^{%s}}{a^{%s}} = \\dfrac{\\cancel{a} \\cdot \\cancel{a}}{\\cancel{a} \\cdot \\cancel{a} \\cdot a \\cdot a}"
     " = \\dfrac{1}{a \\cdot a} = \\dfrac{1}{a^2}$" % (g(2), r(4)), 0),
    ("Also ist $a^{-2} = \\dfrac{1}{a^2}$", 0),
    ("<m1>$a^{-n} = \\dfrac{1}{a^{n}}$</m1> — für $a \\neq 0$", 0),
])

B("Der Fall $%s = %s$" % (N, M), [
    ("$\\dfrac{a^{%s}}{a^{%s}} = a^{%s - %s} = a^0$" % (N, N, N, N), 0),
    ("$\\dfrac{a^3}{a^3} = \\dfrac{\\cancel{a} \\cdot \\cancel{a} \\cdot \\cancel{a}}"
     "{\\cancel{a} \\cdot \\cancel{a} \\cdot \\cancel{a}} = 1$", 0),
    ("<m1>$a^0 = 1$</m1> — für $a \\neq 0$", 0),
])

# 3rd law
B("Das 3. Potenzgesetz ✏️", [
    ("<m1>$%s^{n} \\cdot %s^{n} = (%s \\cdot %s)^{n}$</m1>" % (r("a"), g("b"), r("a"), g("b")), 0),
    ("**gleicher Exponent**: die Basen werden multipliziert", 0),
])

B("Beweis des 3. Potenzgesetzes", [
    ("$%s^{n} \\cdot %s^{n} = \\underbrace{%s}_{n\\text{-mal Faktor } %s} \\cdot "
     "\\underbrace{%s}_{n\\text{-mal Faktor } %s}$"
     % (r("a"), g("b"), r("a \\cdot a \\cdot \\ldots \\cdot a"), r("a"),
        g("b \\cdot b \\cdot \\ldots \\cdot b"), g("b")), 0),
    ("$\\phantom{%s^{n} \\cdot %s^{n}} = \\underbrace{(%s \\cdot %s) \\cdot (%s \\cdot %s) \\cdot \\ldots \\cdot (%s \\cdot %s)}"
     "_{n\\text{-mal Faktor } (%s \\cdot %s)}$" % ((r("a"), g("b")) * 5), 0),
    ("$%s^{n} \\cdot %s^{n} = (%s \\cdot %s)^{n}$ ∎" % (r("a"), g("b"), r("a"), g("b")), 0),
])

# 4th law
B("Das 4. Potenzgesetz ✏️", [
    ("<m1>$\\dfrac{%s^{n}}{%s^{n}} = \\left(\\dfrac{%s}{%s}\\right)^{n}$</m1> — für $b \\neq 0$"
     % (r("a"), g("b"), r("a"), g("b")), 0),
    ("**gleicher Exponent**: die Basen werden dividiert", 0),
])

B("Beweis des 4. Potenzgesetzes", [
    ("$\\dfrac{%s^{n}}{%s^{n}} = \\dfrac{\\overbrace{%s}^{n\\text{-mal}}}{%s}$"
     % (r("a"), g("b"), r("a \\cdot a \\cdot \\ldots \\cdot a"), g("b \\cdot b \\cdot \\ldots \\cdot b")), 0),
    ("$\\phantom{\\dfrac{a^n}{b^n}} = \\underbrace{\\dfrac{%s}{%s} \\cdot \\dfrac{%s}{%s} \\cdot \\ldots \\cdot "
     "\\dfrac{%s}{%s}}_{n\\text{-mal Faktor } \\frac{a}{b}}$" % ((r("a"), g("b")) * 3), 0),
    ("$\\dfrac{%s^{n}}{%s^{n}} = \\left(\\dfrac{%s}{%s}\\right)^{n}$ ∎" % (r("a"), g("b"), r("a"), g("b")), 0),
])

# 5th law
B("Das 5. Potenzgesetz — Potenz einer Potenz ✏️", [
    ("<m1>$\\left(a^{%s}\\right)^{%s} = a^{%s \\cdot %s}$</m1>" % (M, N, M, N), 0),
    ("**Potenzieren**: die Exponenten werden multipliziert", 0),
])

B("Beweis des 5. Potenzgesetzes", [
    ("$\\left(a^{%s}\\right)^{%s} = \\underbrace{a^{%s} \\cdot a^{%s} \\cdot \\ldots \\cdot a^{%s}}"
     "_{%s\\text{-mal der Faktor } a^{m}}$" % (M, N, M, M, M, N), 0),
    ("Mit dem 1. Gesetz: $= a^{%s + %s + \\ldots + %s}$ — $%s$ Summanden $%s$" % (M, M, M, N, M), 0),
    ("$\\left(a^{%s}\\right)^{%s} = a^{%s \\cdot %s}$ ∎" % (M, N, M, N), 0),
])

# 2^2,5 and the 6th law
B("Und was ist $2^{2{,}5}$?", [
    ("$2^2 = \\overbrace{2 \\cdot 2}^{2\\text{-mal}} = 4$ 😎", 0),
    ("$2^3 = \\overbrace{2 \\cdot 2 \\cdot 2}^{3\\text{-mal}} = 8$", 0),
    ("$2^{2{,}5} = \\overbrace{2 \\cdot 2 \\cdot\\, ?}^{2{,}5\\text{-mal} ???}$ 🤔", 0),
    ("$2^{2{,}5} = 2^{\\frac{25}{10}} = 2^{\\frac{%s}{%s}} = \\; ?$" % (g(5), r(2)), 0),
])

B("Das 6. Potenzgesetz ✏️", [
    ("<m1>$a^{\\frac{%s}{%s}} = \\sqrt[%s]{a^{%s}}$</m1> — für $a \\geq 0$" % (M, N, N, M), 0),
    ("Der **Nenner** wird zur Wurzel, der **Zähler** bleibt Exponent", 0),
])

B("Beweis des 6. Potenzgesetzes", [
    ("Wir brauchen das 5. Gesetz: $\\left(a^{m}\\right)^{n} = a^{m \\cdot n}$", 0),
    ("$a^{\\frac{%s}{%s}} = \\sqrt[%s]{\\left(a^{\\frac{%s}{%s}}\\right)^{%s}}$" % (M, N, N, M, N, N), 0),
    ("$%s$-te Wurzel und $%s$-te Potenz heben sich auf (für $a \\geq 0$)" % (N, N), 1),
    ("$\\phantom{a^{\\frac{m}{n}}} = \\sqrt[%s]{a^{\\frac{%s}{\\cancel{%s}} \\cdot \\cancel{%s}}} = \\sqrt[%s]{a^{%s}}$ ∎"
     % (N, M, N, N, N, M), 0),
])

B("Jetzt geht’s: $2^{2{,}5}$", [
    ("$2^{2{,}5} = 2^{\\frac{%s}{%s}} = \\sqrt[%s]{2^{%s}}$" % (g(5), r(2), r(2), g(5)), 0),
    ("$\\phantom{2^{2{,}5}} = \\sqrt{32} \\approx 5{,}657$", 0),
    ("Liegt zwischen $2^2 = 4$ und $2^3 = 8$ ✓", 0),
    ("Probe: $5{,}657 \\cdot 5{,}657 \\approx 32$ ✓", 0),
])

svg, labels = zwei_hoch_x()
d.figure("Der Graph von $f(x) = 2^x$", svg, labels)

B("Negativer, gebrochener Exponent", [
    ("Wir brauchen: <m1>$a^{-n} = \\dfrac{1}{a^{n}}$</m1>", 0),
    ("$32^{-\\frac{%s}{%s}} = \\sqrt[%s]{32^{-%s}} = \\sqrt[%s]{\\dfrac{1}{32^{%s}}}$"
     % (g(2), r(5), r(5), g(2), r(5), g(2)), 0),
    ("$\\phantom{32^{-\\frac{2}{5}}} = \\dfrac{\\sqrt[5]{1}}{\\sqrt[5]{1024}} = \\dfrac{1}{4}$ — denn $4^5 = 1024$", 0),
])

d.bullets("Alle Gesetze auf einen Blick", [
    ("**Gleiche Basis**: $a^{n} \\cdot a^{m} = a^{n + m}$ und $\\dfrac{a^{n}}{a^{m}} = a^{n - m}$", 0),
    ("**Gleicher Exponent**: $a^{n} \\cdot b^{n} = (a \\cdot b)^{n}$ und "
     "$\\dfrac{a^{n}}{b^{n}} = \\left(\\dfrac{a}{b}\\right)^{n}$", 0),
    ("**Potenzieren**: $\\left(a^{m}\\right)^{n} = a^{m \\cdot n}$ und $a^{\\frac{m}{n}} = \\sqrt[n]{a^{m}}$", 0),
    ("**Sonderfälle**: $a^0 = 1$, $a^1 = a$, $a^{-n} = \\dfrac{1}{a^{n}}$", 0),
    ("Steht alles in der **Formelsammlung, Seite 16 links unten**", 0),
])

# ------------------------------------------------------------- exercises ---
d.chapter(2, "Aufgaben", "Zwanzig Aufgaben mit Lösungen")

d.bullets("Aufgaben 1–10", [
    ("**1.** Vereinfache $2^4 \\cdot 2^3$.", 0),
    ("**2.** Berechne $5^2 : 5^1$.", 0),
    ("**3.** Schreibe $3^5$ als Produkt von $3^2$ und $3^3$.", 0),
    ("**4.** Berechne $4^3 \\cdot 4^0$.", 0),
    ("**5.** Vereinfache $a^3 \\cdot a^7$.", 0),
    ("**6.** Schreibe $b^4$ als Produkt zweier Potenzen mit dem Exponenten $2$.", 0),
    ("**7.** Berechne $2^{(3+2)}$.", 0),
    ("**8.** Berechne $7^2 \\cdot 7^0$.", 0),
    ("**9.** Schreibe $x^4$ als Produkt von $x^2$ und $x^2$.", 0),
    ("**10.** Vereinfache $3^4 : 3^2$.", 0),
])

d.bullets("Lösungen 1–10", [
    ("**1.** $2^4 \\cdot 2^3 = 2^{4+3} = 2^7 = 128$", 0),
    ("**2.** $5^2 : 5^1 = 5^{2-1} = 5^1 = 5$", 0),
    ("**3.** $3^5 = 3^2 \\cdot 3^3$", 0),
    ("**4.** $4^3 \\cdot 4^0 = 4^3 \\cdot 1 = 64$", 0),
    ("**5.** $a^3 \\cdot a^7 = a^{3+7} = a^{10}$", 0),
    ("**6.** $b^4 = b^2 \\cdot b^2$", 0),
    ("**7.** $2^{(3+2)} = 2^5 = 32$", 0),
    ("**8.** $7^2 \\cdot 7^0 = 7^2 \\cdot 1 = 49$", 0),
    ("**9.** $x^4 = x^2 \\cdot x^2$", 0),
    ("**10.** $3^4 : 3^2 = 3^{4-2} = 3^2 = 9$", 0),
])

d.bullets("Aufgaben 11–20", [
    ("**11.** Berechne $(2^3)^2$.", 0),
    ("**12.** Schreibe $y^5$ als Produkt von $y^1$ und einer zweiten Potenz von $y$.", 0),
    ("**13.** Vereinfache $5^3 \\cdot 5^3$.", 0),
    ("**14.** Vereinfache $a^5 : a^2$ für $a \\neq 0$.", 0),
    ("**15.** Schreibe $b^3$ als Produkt von $b^1$ und $b^2$.", 0),
    ("**16.** Berechne $4^2 \\cdot 4^{-1}$.", 0),
    ("**17.** Schreibe $x^6$ als Produkt zweier gleicher Potenzen mit dem Exponenten $3$.", 0),
    ("**18.** Vereinfache $6^3 : 6^3$.", 0),
    ("**19.** Berechne $2^{(4-2)}$.", 0),
    ("**20.** Schreibe $y^5$ als Produkt von $y^3$ und $y^2$.", 0),
])

d.bullets("Lösungen 11–20", [
    ("**11.** $(2^3)^2 = 2^{3 \\cdot 2} = 2^6 = 64$", 0),
    ("**12.** $y^5 = y^1 \\cdot y^4$", 0),
    ("**13.** $5^3 \\cdot 5^3 = 5^{3+3} = 5^6$", 0),
    ("**14.** $a^5 : a^2 = a^{5-2} = a^3$", 0),
    ("**15.** $b^3 = b^1 \\cdot b^2$", 0),
    ("**16.** $4^2 \\cdot 4^{-1} = 4^{2-1} = 4^1 = 4$", 0),
    ("**17.** $x^6 = x^3 \\cdot x^3$", 0),
    ("**18.** $6^3 : 6^3 = 6^{3-3} = 6^0 = 1$", 0),
    ("**19.** $2^{(4-2)} = 2^2 = 4$", 0),
    ("**20.** $y^5 = y^3 \\cdot y^2$", 0),
])

d.save()
