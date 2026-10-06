#!/usr/bin/env python3
"""Eine unendliche Summe - drei Beweise für 1/2 + 1/4 + 1/8 + ... = 1. Mathe 11 (BGY), an excursion that fits the
week "Das unendlich Große" (KW 24/2027, its deck mathe11-unendlich only states the sum).

Doc, 06.10.2026, with a picture from the net - three proofs signed Albert Einstein (telescoping), Carl F. Gauss
(2S - S) and Srinivasa Ramanujan (the halved square): "mach hierzu ein Deck mit den Beweisen bitte". The three proofs
in our style; the picture itself stays out (a stranger's watermark on a public page), its names are named and called
what they are: no source ties any of the three to these proofs (searched 06.10.2026). Instead the history that holds:
Zeno's dichotomy (Aristotle, Physics VI 9, 239b), Archimedes' 1 + 1/4 + 1/16 + ... = 4/3 (Quadrature of the Parabola,
Prop. 23), and Ramanujan's real line on such sums, 1 + 2 + 3 + ... = -1/12 "under my theory" (second letter to Hardy,
27.02.1913). The 2S - S proof is done with n terms first - and why: the same trick without n "proves" 1 + 2 + 4 + ...
= -1. Figures in mathe11_unendliche_summe_svg.py. Only HTML:

    python3 tools/pptx/html_deck.py build_unendliche_summe_mathe11.py

Initial only - after the first build HTML/decks/mathe11-unendliche-summe.html is the source.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
from mathe11_unendliche_summe_svg import (zenon, verdoppeln, quadrat, leibniz, dreieckszahlen,
                                          teleskop_vorbereitung, teleskop_tafel, teilsummen,
                                          uebung, verdoppeln_tafel, falle_tafel, quadrat_tafel)

d = MathDeck("mathe11-unendliche-summe.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · Exkurs",
        "Eine unendliche Summe",
        "Drei Beweise, dass Halbe, Viertel, Achtel und so weiter zusammen genau 1 ergeben")

d.bullets("Der Fahrplan dieser Stunde", [
    ("**Übung**: Brüche addieren", 0),
    ("Die Behauptung — und was „$=1$“ bei **unendlich vielen** Summanden heißt", 0),
    ("Beweis 1: das **Teleskop** — fast alles hebt sich weg", 0),
    ("Beweis 2: **verdoppeln** — die Summe steckt in sich selbst, samt einer Falle", 0),
    ("Beweis 3: das **Quadrat** — ein Beweis ohne Worte", 0),
    ("Ein Highlight: **Leibniz** und die Kehrwerte der Dreieckszahlen", 0),
])

# Doc, 06.10.2026: "ganz oben ... Übung ... eine Folie, wo genau diese Bruchrechendinger geübt werden"
svg, labels = uebung()
d.figure("Übung: Brüche addieren", svg, labels)

# ---------------------------------------------------------- the claim ---
d.bullets("Die Behauptung", [
    ("Drei Beweise für $\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\frac{1}{16}+\\ldots=1$", 0),
    ("Unendlich viele Summanden — und trotzdem genau $1$, nicht mehr?", 0),
])

# Doc, 06.10.2026, on the two bullets that were here (S_1 = 1/2, ..., S_n = 1 - 1/2^n): "nie wirklich zu verstehen ...
# warum S3 = 7/8? Wo kommt die Teilsumme her?" - now a board of their own
svg, labels = teilsummen()
d.figure("Die Teilsummen", svg, labels)

svg, labels = zenon()
d.figure("Erst die Hälfte, dann die Hälfte vom Rest", svg, labels)

# ------------------------------------------------------- 1 Teleskop ---
d.chapter(1, "Das Teleskop", "Jeder Summand ist eine Differenz")

# Doc, 06.10.2026: proof 1 rebuilt in his way - "Schritt für Schritt ... mit schönen Animationen", like his Leibniz
# slides (108 Vorbereitung, 110 the board). The three bullet slides before it stay in the deck HTML, hidden (class skip).
svg, labels = teleskop_vorbereitung()
d.figure("Vorbereitung", svg, labels)

svg, labels = teleskop_tafel()
# the name and its oldest known statement, with a link (Doc, 06.10.2026: "Torricelli - den sollte man dann bitte unbedingt
# zitieren. Und auch einen Link mit dazu"): Wikipedia "Telescoping series" after A. Weil, Prehistory of the zeta-function
# (1989), doi:10.1016/B978-0-12-067570-8.50009-3
d.figure("Beweis 1: das Teleskop", svg, labels,
         source=("Der Name: wie ein ausziehbares Fernrohr. Früh schon bei Evangelista Torricelli, De dimensione "
                 "parabolae (1644) – nach André Weil (1989)", "https://en.wikipedia.org/wiki/Telescoping_series"))

# ------------------------------------------------------- 2 Verdoppeln ---
d.chapter(2, "Verdoppeln", "Die Summe steckt in sich selbst")

# Doc, 06.10.2026, on the slide with 2S_n over S_n ("verstehe ich ehrlich gesagt überhaupt nicht") and the trap in bullets:
# "du kennst jetzt den Stil, mach alle Beweise so" - both as boards; the old slides stay in the deck HTML, hidden (skip)
svg, labels = verdoppeln_tafel()
d.figure("Beweis 2: verdoppeln", svg, labels)

svg, labels = falle_tafel()
d.figure("Die Falle", svg, labels)

d.bullets("Die Falle: erst mit $n$ rechnen", [
    ("Ohne $n$ geht es scheinbar schneller: $2S=1+\\frac{1}{2}+\\frac{1}{4}+\\ldots=1+S$, also $S=1$", 0),
    ("Derselbe Trick mit $T=1+2+4+8+\\ldots$: $2T=2+4+8+\\ldots=T-1$", 0),
    ("Also $T=-1$ — lauter positive Zahlen, und die Summe ist negativ?", 0),
    ("Der Fehler: $T$ **gibt es nicht** — die Teilsummen $T_n=2^n-1$ wachsen über jede Grenze. Mit einer Summe "
     "rechnen darf man erst, wenn es sie gibt — darum zuerst $S_n$", 0),
])

# ---------------------------------------------------------- 3 Quadrat ---
d.chapter(3, "Das Quadrat", "Ein Beweis ohne Worte")

svg, labels = quadrat_tafel()
d.figure("Beweis 3: das Quadrat", svg, labels)

# ----------------------------------------------------------- 4 Leibniz ---
# Doc, 06.10.2026: his slides 106-112 of Gebrochene Zahlen.pptx (2025), "speziell die 110 und die 111 bitte nachbauen in
# unserem Stil, genauso wie sie da sind", "natürlich animierend", "in das gleiche Deck"
d.chapter(4, "Ein Highlight", "Die Summe der Kehrwerte der Dreieckszahlen", image="img/leibniz-francke.jpg",
          credit="Gottfried Wilhelm Leibniz, Christoph Bernhard Francke, vor 1729 – gemeinfrei",
          credit_url="https://commons.wikimedia.org/wiki/File:Gottfried_Wilhelm_Leibniz,_Bernhard_Christoph_Francke.jpg")

# Doc's slide 109 first (the same day: "sonst weiß ja keiner, was Dreieckszahlen sind")
svg, labels = dreieckszahlen()
d.figure("Die Dreieckszahlen", svg, labels)

svg, labels = leibniz(1)
d.figure("Leibniz: die Kehrwerte der Dreieckszahlen", svg, labels)

svg, labels = leibniz(2)
d.figure("Dasselbe mit 2 im Zähler", svg, labels)

# ------------------------------------------------------------ history ---
d.bullets("Wer hat's bewiesen?", [
    ("Das Bild aus dem Netz nennt **Einstein**, **Gauß** und **Ramanujan** — belegt ist keiner der drei Beweise "
     "bei ihnen", 0),
    ("Die Idee ist rund 2400 Jahre alt: **Zenon von Elea** (um 450 v. Chr.), überliefert von Aristoteles", 0),
    ("**Archimedes** (um 250 v. Chr.): $1+\\frac{1}{4}+\\frac{1}{16}+\\ldots=\\frac{4}{3}$ — für die Fläche eines "
     "Parabelstücks (Quadratur der Parabel)", 0),
    ("Und Ramanujan? Er schrieb 1913 an Hardy: $1+2+3+4+\\ldots=-\\frac{1}{12}$ „nach meiner Theorie“ — einer Summe "
     "ohne Grenzwert ordnete er nach eigenen Regeln eine Zahl zu", 0),
])

d.merksatz("Eine unendliche Summe hat einen Wert, wenn ihre Teilsummen einer Zahl beliebig nahe kommen — ihrem "
           "Grenzwert. Für $\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\ldots$ ist $S_n=1-\\frac{1}{2^n}$, "
           "der Grenzwert ist $1$.")

d.bullets("Jetzt ihr", [
    ("Berechnet $\\frac{1}{3}+\\frac{1}{9}+\\frac{1}{27}+\\ldots$ mit dem Trick aus Beweis 2 — diesmal mal $3$", 0),
    ("Zeichnet einen Beweis ohne Worte für $\\frac{1}{4}+\\frac{1}{16}+\\frac{1}{64}+\\ldots=\\frac{1}{3}$", 0),
    ("Schreibt $0{,}999\\ldots$ als Summe und zeigt mit einem der Tricks: $0{,}999\\ldots=1$", 0),
    ("Warum geht der Trick bei $1+2+4+8+\\ldots$ schief — und bei $\\frac{1}{2}+\\frac{1}{4}+\\ldots$ nicht?", 0),
])

d.bullets("Lösungen", [
    ("$3S_n=1+\\frac{1}{3}+\\ldots+\\frac{1}{3^{n-1}}$, also $3S_n-S_n=1-\\frac{1}{3^n}$ und "
     "$S_n=\\frac{1}{2}\\left(1-\\frac{1}{3^n}\\right)$ — der Grenzwert ist $\\frac{1}{2}$", 0),
    ("Quadrat vierteln, von den drei äußeren Vierteln eins färben, das Eck-Viertel wieder vierteln und so weiter — gefärbt ist "
     "immer eins von drei gleich großen Stücken: $\\frac{1}{3}$", 0),
    ("$0{,}999\\ldots=\\frac{9}{10}+\\frac{9}{100}+\\ldots$ und $\\frac{9}{10^k}=\\frac{1}{10^{k-1}}-\\frac{1}{10^k}$ — "
     "Teleskop: $S_n=1-\\frac{1}{10^n}$, der Grenzwert ist $1$", 0),
    ("Bei $\\frac{1}{2}+\\frac{1}{4}+\\ldots$ wird der Rest $\\frac{1}{2^n}$ beliebig klein, bei $1+2+4+\\ldots$ "
     "wachsen die Teilsummen über jede Grenze — diese Summe gibt es nicht", 0),
])

d.save()
