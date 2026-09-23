#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 20 (LB 2): Extremalaufgaben - Zielfunktion und
Nebenbedingung aus Text und Skizze, Flächen und Umfänge, Verpackungen (Quader,
Zylinder, offene Schachteln), Abstand Punkt-Graph, Gewinn- und Kostenoptimierung.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=20, slug='extremalaufgaben', thema='Extremalaufgaben', lb='LB 2',
          blurb='Zielfunktion und Nebenbedingung, Verpackungen, Flächen und Körper',
          comment='Blocks: Zielfunktion und Nebenbedingung (1-5), Flächen und Abstände (6-11), Verpackungen und Körper (12-16), Anwendungen (17-20). Alles ohne CAS.')


# ----------------------------------------------------------------- figures ----
def fig_zaun():
    """Rectangular pasture at a river: only three sides carry a fence."""
    c = S.Canvas(460, 250)
    c.rect(30, 20, 400, 28, fill="#DCE4F0")
    c.text(230, 39, "Fluss", 13, S.MUTED)
    c.rect(90, 48, 280, 152, fill=S.GREEN, opacity=0.14)
    c.line(90, 48, 90, 200, S.GREEN, 3.6)
    c.line(370, 48, 370, 200, S.GREEN, 3.6)
    c.line(90, 200, 370, 200, S.GREEN, 3.6)
    c.text(78, 130, "x", 15, S.INK, "end", italic=True)
    c.text(382, 130, "x", 15, S.INK, "start", italic=True)
    c.text(230, 224, "y", 15, S.INK, italic=True)
    c.text(230, 130, "Weide", 13, S.MUTED)
    return c.svg("Rechteckige Weide am Fluss: nur die beiden Seiten x und die Seite y sind eingezaeunt")


def fig_karton():
    """Square sheet of cardboard, 12 cm, with four corner squares of side x cut out."""
    c = S.Canvas(330, 300)
    x0, y0, a, k = 55, 34, 216, 36
    c.rect(x0, y0, a, a, fill=S.ORANGE, opacity=0.18, stroke=S.INK, width=1.6)
    for dx in (0, a - k):
        for dy in (0, a - k):
            c.rect(x0 + dx, y0 + dy, k, k, fill=S.RED, opacity=0.28, stroke=S.RED, width=1.4)
    for d in (k, a - k):
        c.line(x0 + d, y0, x0 + d, y0 + a, S.MUTED, 1.1, dash="4 4")
        c.line(x0, y0 + d, x0 + a, y0 + d, S.MUTED, 1.1, dash="4 4")
    c.text(x0 + a / 2.0, y0 + a + 28, "12 cm", 13, S.MUTED)
    c.text(x0 + k / 2.0, y0 + k / 2.0 + 5, "x", 13, S.RED, italic=True)
    c.text(x0 + a / 2.0, y0 + a / 2.0 + 5, "Boden", 13, S.MUTED)
    return c.svg("Quadratischer Karton mit 12 cm Kantenlaenge, an den vier Ecken ist je ein Quadrat der Seite x ausgeschnitten")


def fig_dreieck():
    """Right triangle (legs 6 cm and 4 cm) with the inscribed rectangle of largest area."""
    c = S.Canvas(400, 260)
    ox, oy, sx, sy = 52, 208, 48, 38
    c.poly([(ox, oy), (ox + 6 * sx, oy), (ox, oy - 4 * sy)], stroke=S.INK, width=1.9)
    c.rect(ox, oy - 2 * sy, 3 * sx, 2 * sy, fill=S.GREEN, opacity=0.26, stroke=S.GREEN, width=1.7)
    c.text(ox + 3 * sx, oy + 26, "6 cm", 12, S.MUTED)
    c.text(ox - 12, oy - 2 * sy + 4, "4 cm", 12, S.MUTED, "end")
    c.text(ox + 1.5 * sx, oy - 10, "x", 14, S.INK, italic=True)
    c.text(ox + 14, oy - 1 * sy, "y", 14, S.INK, "start", italic=True)
    return c.svg("Rechtwinkliges Dreieck mit den Katheten 6 cm und 4 cm und einem einbeschriebenen Rechteck mit den Seiten x und y")


FIG_ZAUN = fig_zaun()
FIG_KARTON = fig_karton()
FIG_DREIECK = fig_dreieck()

# ---------------------------------------------- Zielfunktion und Nebenbedingung ----
Q.q(r'Ein Rechteck mit dem Umfang $40\,\mathrm{m}$ soll möglichst großen Flächeninhalt haben. Welche Rolle spielen die Gleichungen $A = x \cdot y$ und $2x + 2y = 40$?',
    [r'$A = x \cdot y$ ist die Zielfunktion, $2x + 2y = 40$ die Nebenbedingung.',
     r'$A = x \cdot y$ ist die Nebenbedingung, $2x + 2y = 40$ die Zielfunktion.',
     r'Beide sind Nebenbedingungen; die Zielfunktion entsteht erst durch Ableiten.',
     r'$2x + 2y = 40$ ist die Zielfunktion, weil darin die gegebene Zahl steht.'],
    [r'Zielfunktion ist immer die Größe, die extremal werden soll - hier der Flächeninhalt $A$.',
     r'Die Nebenbedingung ist die zusätzliche Gleichung, mit der eine der beiden Variablen ersetzt wird.',
     r'Vorgehen: Nebenbedingung nach $y$ auflösen, in die Zielfunktion einsetzen, dann ableiten.'])

Q.q(r'Ein Rechteck hat den Umfang $40\,\mathrm{m}$. Stelle den Flächeninhalt als Funktion der Seitenlänge $x$ dar.',
    [r'$A(x) = 20x - x^2$', r'$A(x) = 40x - x^2$', r'$A(x) = x^2 - 20x$', r'$A(x) = 40 - 2x$'],
    [r'Nebenbedingung: $2x + 2y = 40 \Leftrightarrow y = 20 - x$',
     r'Einsetzen in $A = x \cdot y$: $A(x) = x\,(20 - x) = 20x - x^2$',
     r'Falle: $y = 40 - x$ - der Umfang enthält jede Seite zweimal.'])

Q.q(r'Ein Rechteck hat den Flächeninhalt $36\,\mathrm{m}^2$. Wie lautet die Zielfunktion für den Umfang in Abhängigkeit von der Seitenlänge $x$?',
    [r'$U(x) = 2x + \dfrac{72}{x}$', r'$U(x) = 2x + \dfrac{36}{x}$', r'$U(x) = x + \dfrac{36}{x}$', r'$U(x) = 2x + 72x$'],
    [r'Nebenbedingung: $x \cdot y = 36 \Leftrightarrow y = \dfrac{36}{x}$',
     r'Zielfunktion: $U = 2x + 2y = 2x + 2 \cdot \dfrac{36}{x} = 2x + \dfrac{72}{x}$',
     r'Falle: den Faktor $2$ vor $y$ vergessen.'])

Q.q(r'Eine rechteckige Weide am geraden Flussufer soll mit $60\,\mathrm{m}$ Zaun eingefasst werden; am Fluss ist kein Zaun nötig. Wie lautet die Zielfunktion für den Flächeninhalt in Abhängigkeit von $x$?',
    [r'$A(x) = 60x - 2x^2$', r'$A(x) = 60x - x^2$', r'$A(x) = 30x - 2x^2$', r'$A(x) = 120x - 2x^2$'],
    [r'Nebenbedingung: Nur drei Seiten werden eingezäunt, also $2x + y = 60 \Leftrightarrow y = 60 - 2x$.',
     r'Zielfunktion: $A(x) = x \cdot y = x\,(60 - 2x) = 60x - 2x^2$',
     r'Falle: $y = 60 - x$ rechnet mit nur einer Seite $x$.'],
    fig=FIG_ZAUN, figcap='Weide am Fluss: eingezäunt werden nur die beiden Seiten x und die Seite y')

Q.q(r'Welcher Definitionsbereich ist für die Zielfunktion $A(x) = x\,(60 - 2x)$ der Weide am Fluss sinnvoll?',
    [r'$0 < x < 30$', r'$0 < x < 60$', r'$0 \leq x \leq 60$', r'alle reellen Zahlen'],
    [r'Beide Seiten müssen positiv sein: $x > 0$ und $y = 60 - 2x > 0$.',
     r'$60 - 2x > 0 \Leftrightarrow x < 30$, also $0 < x < 30$.',
     r'Für $x = 30$ wäre $y = 0$ - dann gibt es gar kein Rechteck mehr. Randwerte immer mitdenken.'])

# ------------------------------------------------------ Flächen und Abstände ----
Q.q(r'Welches Rechteck mit dem Umfang $40\,\mathrm{m}$ hat den größten Flächeninhalt?',
    [r'das Quadrat mit $x = 10\,\mathrm{m}$, $A_{\max} = 100\,\mathrm{m}^2$',
     r'$x = 20\,\mathrm{m}$, $A_{\max} = 200\,\mathrm{m}^2$',
     r'$x = 5\,\mathrm{m}$, $A_{\max} = 75\,\mathrm{m}^2$',
     r'$x = 10\,\mathrm{m}$, $A_{\max} = 200\,\mathrm{m}^2$'],
    [r'$A(x) = 20x - x^2$, also $A^{\prime}(x) = 20 - 2x$',
     r'$A^{\prime}(x) = 0 \Leftrightarrow x = 10$; wegen $A^{\prime\prime}(x) = -2 < 0$ ist das ein Maximum.',
     r'$y = 20 - 10 = 10$: Es ist ein Quadrat, $A_{\max} = 100\,\mathrm{m}^2$.'])

Q.q(r'Die Weide am Fluss ($2x + y = 60$) soll größtmöglich werden. Welche Maße hat sie?',
    [r'$x = 15\,\mathrm{m}$, $y = 30\,\mathrm{m}$, $A_{\max} = 450\,\mathrm{m}^2$',
     r'$x = 20\,\mathrm{m}$, $y = 20\,\mathrm{m}$, $A_{\max} = 400\,\mathrm{m}^2$',
     r'$x = 30\,\mathrm{m}$, $y = 0\,\mathrm{m}$, $A_{\max} = 900\,\mathrm{m}^2$',
     r'$x = 15\,\mathrm{m}$, $y = 15\,\mathrm{m}$, $A_{\max} = 225\,\mathrm{m}^2$'],
    [r'$A(x) = 60x - 2x^2$, also $A^{\prime}(x) = 60 - 4x$',
     r'$A^{\prime}(x) = 0 \Leftrightarrow x = 15$, $A^{\prime\prime}(x) = -4 < 0$: Maximum.',
     r'$y = 60 - 2 \cdot 15 = 30$, also $A_{\max} = 15 \cdot 30 = 450\,\mathrm{m}^2$.',
     r'Anders als beim Umfang ist hier kein Quadrat optimal: Die Seite am Fluss ist doppelt so lang.'])

Q.q(r'Welches Rechteck mit dem Flächeninhalt $36\,\mathrm{m}^2$ hat den kleinsten Umfang?',
    [r'$x = 6\,\mathrm{m}$, $U_{\min} = 24\,\mathrm{m}$', r'$x = 6\,\mathrm{m}$, $U_{\min} = 12\,\mathrm{m}$',
     r'$x = 4\,\mathrm{m}$, $U_{\min} = 26\,\mathrm{m}$', r'$x = 36\,\mathrm{m}$, $U_{\min} = 74\,\mathrm{m}$'],
    [r'$U(x) = 2x + \dfrac{72}{x} = 2x + 72x^{-1}$, also $U^{\prime}(x) = 2 - \dfrac{72}{x^2}$',
     r'$U^{\prime}(x) = 0 \Leftrightarrow x^2 = 36 \Leftrightarrow x = 6$ (nur $x > 0$ ist sinnvoll).',
     r'$y = \dfrac{36}{6} = 6$, also wieder ein Quadrat: $U_{\min} = 2 \cdot 6 + 2 \cdot 6 = 24\,\mathrm{m}$.',
     r'Probe mit $x = 4$: $U = 8 + 18 = 26 > 24$. Passt.'])

Q.q(r'Zwei positive Zahlen haben die Summe $10$. Für welche Zahlen ist die Summe ihrer Quadrate minimal?',
    [r'$5$ und $5$, die Summe der Quadrate ist $50$', r'$0$ und $10$, die Summe der Quadrate ist $100$',
     r'$5$ und $5$, die Summe der Quadrate ist $25$', r'$2$ und $8$, die Summe der Quadrate ist $68$'],
    [r'Nebenbedingung $x + y = 10$, Zielfunktion $S(x) = x^2 + (10 - x)^2$',
     r'$S^{\prime}(x) = 2x - 2\,(10 - x) = 4x - 20 = 0 \Leftrightarrow x = 5$, $S^{\prime\prime}(x) = 4 > 0$: Minimum.',
     r'$S(5) = 25 + 25 = 50$. Falle: nur ein Quadrat zählen ($25$).'])

Q.q(r'Einem rechtwinkligen Dreieck mit den Katheten $6\,\mathrm{cm}$ und $4\,\mathrm{cm}$ wird ein Rechteck einbeschrieben (zwei Seiten liegen auf den Katheten). Wie groß kann sein Flächeninhalt höchstens werden?',
    [r'$A_{\max} = 6\,\mathrm{cm}^2$ bei $x = 3\,\mathrm{cm}$ und $y = 2\,\mathrm{cm}$',
     r'$A_{\max} = 12\,\mathrm{cm}^2$ bei $x = 6\,\mathrm{cm}$ und $y = 2\,\mathrm{cm}$',
     r'$A_{\max} = 24\,\mathrm{cm}^2$ bei $x = 6\,\mathrm{cm}$ und $y = 4\,\mathrm{cm}$',
     r'$A_{\max} = 4{,}5\,\mathrm{cm}^2$ bei $x = 1{,}5\,\mathrm{cm}$ und $y = 3\,\mathrm{cm}$'],
    [r'Die Hypotenuse ist der Graph von $y = 4 - \dfrac{2}{3}x$ - das ist die Nebenbedingung.',
     r'$A(x) = x\left(4 - \dfrac{2}{3}x\right) = 4x - \dfrac{2}{3}x^2$, also $A^{\prime}(x) = 4 - \dfrac{4}{3}x = 0 \Leftrightarrow x = 3$',
     r'$y = 4 - 2 = 2$, also $A_{\max} = 3 \cdot 2 = 6\,\mathrm{cm}^2$.',
     r'Schöne Kontrolle: Das größte einbeschriebene Rechteck hat immer den halben Flächeninhalt des Dreiecks ($\tfrac{1}{2} \cdot 12 = 6$).'],
    fig=FIG_DREIECK, figcap='Einbeschriebenes Rechteck mit den Seiten x und y im rechtwinkligen Dreieck')

Q.q(r'Welcher Punkt des Graphen von $f(x) = x^2$ hat vom Punkt $P(3|0)$ den kleinsten Abstand?',
    [r'$Q(1|1)$ mit $d = \sqrt{5} \approx 2{,}24$', r'$Q(2|4)$ mit $d = \sqrt{17} \approx 4{,}12$',
     r'$Q(0|0)$ mit $d = 3$', r'$Q(3|9)$ mit $d = 9$'],
    [r'Ein Punkt des Graphen hat die Form $Q(x|x^2)$; statt $d$ wird das Quadrat minimiert: $d^2(x) = (x - 3)^2 + x^4$.',
     r'$\left(d^2\right)^{\prime}(x) = 2\,(x - 3) + 4x^3 = 4x^3 + 2x - 6 = 2\,(x - 1)\left(2x^2 + 2x + 3\right)$',
     r'Die Klammer $2x^2 + 2x + 3$ hat keine Nullstelle ($D = 4 - 24 < 0$), also nur $x = 1$: $Q(1|1)$ und $d = \sqrt{4 + 1} = \sqrt{5}$.',
     r'Trick: $d$ und $d^2$ werden an derselben Stelle minimal - das spart die Wurzel beim Ableiten.'])

# ------------------------------------------------- Verpackungen und Körper ----
Q.q(r'Aus einem quadratischen Karton mit der Kantenlänge $12\,\mathrm{cm}$ wird an jeder Ecke ein Quadrat der Seite $x$ ausgeschnitten; die Ränder werden zu einer oben offenen Schachtel hochgeklappt. Für welches $x$ wird das Volumen maximal?',
    [r'$x = 2\,\mathrm{cm}$ mit $V_{\max} = 128\,\mathrm{cm}^3$', r'$x = 3\,\mathrm{cm}$ mit $V_{\max} = 108\,\mathrm{cm}^3$',
     r'$x = 6\,\mathrm{cm}$ mit $V_{\max} = 0\,\mathrm{cm}^3$', r'$x = 2\,\mathrm{cm}$ mit $V_{\max} = 64\,\mathrm{cm}^3$'],
    [r'Grundseite $12 - 2x$, Höhe $x$: $V(x) = x\,(12 - 2x)^2$ mit $0 < x < 6$.',
     r'$V^{\prime}(x) = (12 - 2x)^2 - 4x\,(12 - 2x) = (12 - 2x)(12 - 6x)$',
     r'$V^{\prime}(x) = 0$ für $x = 6$ (Randfall, $V = 0$) und $x = 2$: $V(2) = 2 \cdot 8^2 = 128\,\mathrm{cm}^3$.',
     r'Falle: $64$ ist nur die Grundfläche $8 \cdot 8$ - die Höhe $x$ gehört dazu.'],
    fig=FIG_KARTON, figcap='Karton mit 12 cm Kantenlänge: an jeder Ecke wird ein Quadrat der Seite x ausgeschnitten')

Q.q(r'Eine zylindrische Dose mit gegebenem Volumen $V$ soll möglichst wenig Blech verbrauchen (Boden und Deckel zählen mit). Welcher Zusammenhang gilt dann zwischen Höhe $h$ und Radius $r$?',
    [r'$h = 2r$ - die Höhe ist so groß wie der Durchmesser.', r'$h = r$ - die Höhe ist so groß wie der Radius.',
     r'$h = \dfrac{r}{2}$ - die Dose ist doppelt so breit wie hoch.', r'$h = 4r$ - eine schlanke, hohe Dose.'],
    [r'Nebenbedingung $V = \pi r^2 h \Rightarrow h = \dfrac{V}{\pi r^2}$; Zielfunktion $O = 2\pi r^2 + 2\pi r h = 2\pi r^2 + \dfrac{2V}{r}$',
     r'$O^{\prime}(r) = 4\pi r - \dfrac{2V}{r^2} = 0 \Leftrightarrow r^3 = \dfrac{V}{2\pi}$, also $V = 2\pi r^3$.',
     r'Einsetzen: $h = \dfrac{2\pi r^3}{\pi r^2} = 2r$.',
     r'Materialsparend ist also die gedrungene Dose - viele Getränkedosen im Regal sind deutlich schlanker, weil sie gut in die Hand passen sollen.'])

Q.q(r'Eine Dose soll $1$ Liter $= 1000\,\mathrm{cm}^3$ fassen und dabei möglichst wenig Blech verbrauchen. Welche Maße hat sie (auf $0{,}1\,\mathrm{cm}$ gerundet)?',
    [r'$r \approx 5{,}4\,\mathrm{cm}$ und $h \approx 10{,}8\,\mathrm{cm}$', r'$r \approx 10{,}8\,\mathrm{cm}$ und $h \approx 5{,}4\,\mathrm{cm}$',
     r'$r \approx 6{,}2\,\mathrm{cm}$ und $h \approx 8{,}3\,\mathrm{cm}$', r'$r \approx 5{,}0\,\mathrm{cm}$ und $h \approx 12{,}7\,\mathrm{cm}$'],
    [r'Aus $r^3 = \dfrac{V}{2\pi}$ folgt $r = \sqrt[3]{\dfrac{1000}{2\pi}} = \sqrt[3]{159{,}15} \approx 5{,}42$',
     r'Höhe: $h = 2r \approx 10{,}84$, also $r \approx 5{,}4\,\mathrm{cm}$ und $h \approx 10{,}8\,\mathrm{cm}$.',
     r'Probe: $\pi \cdot 5{,}42^2 \cdot 10{,}84 \approx 1000$. Die anderen Dosen fassen zwar auch $1$ Liter, brauchen aber mehr Blech.'])

Q.q(r'Eine oben offene Schachtel mit quadratischer Grundfläche soll $32\,\mathrm{cm}^3$ fassen. Für welche Grundkante $x$ wird der Materialverbrauch minimal?',
    [r'$x = 4\,\mathrm{cm}$, $h = 2\,\mathrm{cm}$, $O_{\min} = 48\,\mathrm{cm}^2$',
     r'$x = 2\,\mathrm{cm}$, $h = 8\,\mathrm{cm}$, $O = 68\,\mathrm{cm}^2$',
     r'$x = 8\,\mathrm{cm}$, $h = 0{,}5\,\mathrm{cm}$, $O = 80\,\mathrm{cm}^2$',
     r'$x = 4\,\mathrm{cm}$, $h = 2\,\mathrm{cm}$, $O_{\min} = 64\,\mathrm{cm}^2$'],
    [r'Nebenbedingung $x^2 h = 32 \Rightarrow h = \dfrac{32}{x^2}$; ohne Deckel ist $O = x^2 + 4xh = x^2 + \dfrac{128}{x}$.',
     r'$O^{\prime}(x) = 2x - \dfrac{128}{x^2} = 0 \Leftrightarrow x^3 = 64 \Leftrightarrow x = 4$, $h = 2$.',
     r'$O_{\min} = 16 + 32 = 48\,\mathrm{cm}^2$. Falle: $64\,\mathrm{cm}^2$ rechnet den Deckel mit, den es hier nicht gibt.'])

Q.q(r'Eine geschlossene Schachtel mit quadratischer Grundfläche soll $1000\,\mathrm{cm}^3$ fassen und möglichst wenig Karton verbrauchen. Welche Form hat sie?',
    [r'ein Würfel mit der Kante $10\,\mathrm{cm}$, $O_{\min} = 600\,\mathrm{cm}^2$',
     r'$x = 5\,\mathrm{cm}$, $h = 40\,\mathrm{cm}$, $O_{\min} = 850\,\mathrm{cm}^2$',
     r'$x = 20\,\mathrm{cm}$, $h = 2{,}5\,\mathrm{cm}$, $O_{\min} = 1000\,\mathrm{cm}^2$',
     r'ein Würfel mit der Kante $10\,\mathrm{cm}$, $O_{\min} = 400\,\mathrm{cm}^2$'],
    [r'$h = \dfrac{1000}{x^2}$, Zielfunktion $O(x) = 2x^2 + 4xh = 2x^2 + \dfrac{4000}{x}$',
     r'$O^{\prime}(x) = 4x - \dfrac{4000}{x^2} = 0 \Leftrightarrow x^3 = 1000 \Leftrightarrow x = 10$, also $h = 10$: ein Würfel.',
     r'$O_{\min} = 2 \cdot 100 + 400 = 600\,\mathrm{cm}^2$; die flache Schachtel mit $x = 20$ braucht $1000\,\mathrm{cm}^2$, also zwei Drittel mehr Karton.',
     r'Weniger Material heißt weniger Rohstoff und weniger Abfall - deshalb rechnen Verpackungshersteller genau diese Aufgabe.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Ein Betrieb setzt $x$ Stück zum Preis $p(x) = 30 - 0{,}5x$ (in €) ab; die Kosten betragen $K(x) = 6x + 100$ (in €). Bei welcher Stückzahl ist der Gewinn maximal?',
    [r'$x = 24$ Stück mit $G_{\max} = 188$ €', r'$x = 30$ Stück mit $G_{\max} = 170$ €',
     r'$x = 12$ Stück mit $G_{\max} = 116$ €', r'$x = 48$ Stück mit $G_{\max} = -100$ €'],
    [r'Erlös: $E(x) = x \cdot p(x) = 30x - 0{,}5x^2$; Gewinn: $G(x) = E(x) - K(x) = -0{,}5x^2 + 24x - 100$',
     r'$G^{\prime}(x) = -x + 24 = 0 \Leftrightarrow x = 24$, $G^{\prime\prime}(x) = -1 < 0$: Maximum.',
     r'$G(24) = -288 + 576 - 100 = 188$ €.',
     r'Falle: $x = 30$ ist die Nullstelle von $p^{\prime}$-Überlegungen ohne Kosten; bei $x = 48$ ist der Erlös gerade so hoch wie die variablen Kosten.'])

Q.q(r'Eine oben offene Kiste mit quadratischer Grundfläche soll $8\,\mathrm{dm}^3$ fassen. Der Boden kostet $2$ € pro $\mathrm{dm}^2$, die Seitenwände $1$ € pro $\mathrm{dm}^2$. Welche Grundkante $x$ ist am günstigsten?',
    [r'$x = 2\,\mathrm{dm}$ mit Kosten von $24$ €', r'$x = 4\,\mathrm{dm}$ mit Kosten von $40$ €',
     r'$x = 1\,\mathrm{dm}$ mit Kosten von $34$ €', r'$x = 2\,\mathrm{dm}$ mit Kosten von $16$ €'],
    [r'$h = \dfrac{8}{x^2}$; Kosten: $K(x) = 2x^2 + 4xh = 2x^2 + \dfrac{32}{x}$',
     r'$K^{\prime}(x) = 4x - \dfrac{32}{x^2} = 0 \Leftrightarrow x^3 = 8 \Leftrightarrow x = 2$, also $h = 2$.',
     r'$K(2) = 8 + 16 = 24$ €. Falle: $16$ € sind nur die Wände, der teurere Boden fehlt.'])

Q.q(r'Ein rechteckiges Gehege wird mit $24\,\mathrm{m}$ Zaun eingefasst und durch einen Zaun parallel zur Seite $y$ in zwei gleich große Teile geteilt. Wie groß kann die Gesamtfläche höchstens werden?',
    [r'$A_{\max} = 24\,\mathrm{m}^2$ bei $x = 4\,\mathrm{m}$ und $y = 6\,\mathrm{m}$',
     r'$A_{\max} = 36\,\mathrm{m}^2$ bei $x = 6\,\mathrm{m}$ und $y = 6\,\mathrm{m}$',
     r'$A_{\max} = 22{,}5\,\mathrm{m}^2$ bei $x = 3\,\mathrm{m}$ und $y = 7{,}5\,\mathrm{m}$',
     r'$A_{\max} = 12\,\mathrm{m}^2$ bei $x = 4\,\mathrm{m}$ und $y = 3\,\mathrm{m}$'],
    [r'Der Trennzaun ist eine dritte Strecke der Länge $x$: $3x + 2y = 24 \Leftrightarrow y = 12 - 1{,}5x$',
     r'$A(x) = x\,(12 - 1{,}5x) = 12x - 1{,}5x^2$, also $A^{\prime}(x) = 12 - 3x = 0 \Leftrightarrow x = 4$, $y = 6$.',
     r'$A_{\max} = 4 \cdot 6 = 24\,\mathrm{m}^2$.',
     r'Falle: Das Quadrat $6 \times 6$ hätte $36\,\mathrm{m}^2$ - dafür bräuchte man mit Trennzaun aber $30\,\mathrm{m}$ Zaun.'])

Q.q(r'Für die Bestellmenge $x$ (in Paletten) gilt die Kostenfunktion $K(x) = \dfrac{1000}{x} + 10x$ (in €). Welche Bestellmenge ist am günstigsten?',
    [r'$x = 10$ Paletten mit $K_{\min} = 200$ €', r'$x = 5$ Paletten mit $K_{\min} = 250$ €',
     r'$x = 25$ Paletten mit $K_{\min} = 290$ €', r'$x = 100$ Paletten mit $K_{\min} = 1010$ €'],
    [r'$K(x) = 1000x^{-1} + 10x$, also $K^{\prime}(x) = -\dfrac{1000}{x^2} + 10$',
     r'$K^{\prime}(x) = 0 \Leftrightarrow x^2 = 100 \Leftrightarrow x = 10$ (nur $x > 0$ ist sinnvoll); $K^{\prime\prime}(x) = \dfrac{2000}{x^3} > 0$: Minimum.',
     r'$K(10) = 100 + 100 = 200$ €.',
     r'Im Optimum sind beide Kostenanteile gleich groß - das ist bei dieser Bauart der Kostenfunktion immer so.'])


def check():
    import math
    import sympy as sp
    x = sp.Symbol('x', positive=True)
    r = sp.Symbol('r', positive=True)
    V = sp.Symbol('V', positive=True)

    def crit(expr, var=x):
        return sorted(s for s in sp.solve(sp.diff(expr, var), var) if s.is_real)

    # 2, 6: rectangle with perimeter 40
    A = x * (20 - x)
    assert sp.expand(A) == 20 * x - x**2
    assert crit(A) == [10] and A.subs(x, 10) == 100 and 20 - 10 == 10
    assert A.subs(x, 5) == 75 and sp.diff(A, x, 2) == -2
    # 3, 8: rectangle with area 36
    U = 2 * x + 72 / x
    assert sp.simplify(U - (2 * x + 2 * (36 / x))) == 0
    assert crit(U) == [6] and U.subs(x, 6) == 24 and sp.Integer(36) / 6 == 6
    assert U.subs(x, 4) == 26 and U.subs(x, 36) == 74
    # 4, 5, 7: pasture at the river, 60 m of fence
    Az = x * (60 - 2 * x)
    assert sp.expand(Az) == 60 * x - 2 * x**2
    assert crit(Az) == [15] and Az.subs(x, 15) == 450 and 60 - 2 * 15 == 30
    assert Az.subs(x, 20) == 400 and 60 - 2 * 20 == 20 and 60 - 2 * 30 == 0
    assert sp.diff(Az, x, 2) == -4
    # 9: sum 10, sum of squares minimal
    Sq = x**2 + (10 - x)**2
    assert crit(Sq) == [5] and Sq.subs(x, 5) == 50 and sp.diff(Sq, x, 2) == 4
    assert Sq.subs(x, 0) == 100 and Sq.subs(x, 2) == 68 and 5**2 == 25
    # 10: rectangle inscribed in the right triangle (legs 6 and 4)
    y = 4 - sp.Rational(2, 3) * x
    Ad = x * y
    assert crit(Ad) == [3] and Ad.subs(x, 3) == 6 and y.subs(x, 3) == 2
    assert y.subs(x, sp.Rational(3, 2)) == 3 and Ad.subs(x, sp.Rational(3, 2)) == sp.Rational(9, 2)
    assert sp.Rational(1, 2) * 6 * 4 == 12 and 6 * 4 == 24
    # 11: shortest distance from P(3|0) to the parabola
    d2 = (x - 3)**2 + x**4
    assert sp.expand(sp.diff(d2, x)) == 4 * x**3 + 2 * x - 6
    assert sp.expand(2 * (x - 1) * (2 * x**2 + 2 * x + 3)) == 4 * x**3 + 2 * x - 6
    assert 2**2 - 4 * 2 * 3 < 0
    assert d2.subs(x, 1) == 5 and abs(math.sqrt(5) - 2.24) < 0.005
    assert d2.subs(x, 2) == 17 and abs(math.sqrt(17) - 4.12) < 0.005
    assert d2.subs(x, 0) == 9 and d2.subs(x, 3) == 81
    # 12: open box from a 12 cm square of cardboard
    Vb = x * (12 - 2 * x)**2
    assert crit(Vb) == [2, 6]
    assert sp.expand(sp.diff(Vb, x)) == sp.expand((12 - 2 * x) * (12 - 6 * x))
    assert Vb.subs(x, 2) == 128 and Vb.subs(x, 3) == 108 and Vb.subs(x, 6) == 0 and (12 - 2 * 2)**2 == 64
    # 13, 14: closed can of volume V
    O = 2 * sp.pi * r**2 + 2 * V / r
    assert sp.simplify(O - (2 * sp.pi * r**2 + 2 * sp.pi * r * (V / (sp.pi * r**2)))) == 0
    rstar = (V / (2 * sp.pi))**sp.Rational(1, 3)
    assert sp.simplify(sp.diff(O, r).subs(r, rstar)) == 0
    assert sp.simplify(V / (sp.pi * rstar**2) - 2 * rstar) == 0
    rn = float(rstar.subs(V, 1000))
    assert abs(rn - 5.42) < 0.005 and abs(2 * rn - 10.84) < 0.01
    assert abs(math.pi * rn**2 * 2 * rn - 1000) < 1e-6
    assert abs(1000 / (math.pi * 6.2**2) - 8.3) < 0.05 and abs(1000 / (math.pi * 5.0**2) - 12.7) < 0.05
    # 15: open box with square base, V = 32
    O1 = x**2 + 128 / x
    assert sp.simplify(O1 - (x**2 + 4 * x * (32 / x**2))) == 0
    assert crit(O1) == [4] and sp.Integer(32) / 4**2 == 2 and O1.subs(x, 4) == 48
    assert O1.subs(x, 2) == 68 and O1.subs(x, 8) == 80 and 2 * 4**2 + 4 * 4 * 2 == 64
    # 16: closed box with square base, V = 1000
    O2 = 2 * x**2 + 4000 / x
    assert sp.simplify(O2 - (2 * x**2 + 4 * x * (1000 / x**2))) == 0
    assert crit(O2) == [10] and sp.Integer(1000) / 10**2 == 10 and O2.subs(x, 10) == 600
    assert O2.subs(x, 5) == 850 and O2.subs(x, 20) == 1000 and 4 * 10 * 10 == 400
    # 17: maximal profit
    G = x * (30 - sp.Rational(1, 2) * x) - (6 * x + 100)
    assert sp.expand(G) == -sp.Rational(1, 2) * x**2 + 24 * x - 100
    assert crit(G) == [24] and G.subs(x, 24) == 188 and sp.diff(G, x, 2) == -1
    assert G.subs(x, 30) == 170 and G.subs(x, 12) == 116 and G.subs(x, 48) == -100
    # 18: open crate, expensive bottom
    Kc = 2 * x**2 + 32 / x
    assert sp.simplify(Kc - (2 * x**2 + 4 * x * (8 / x**2))) == 0
    assert crit(Kc) == [2] and sp.Integer(8) / 2**2 == 2 and Kc.subs(x, 2) == 24
    assert Kc.subs(x, 4) == 40 and Kc.subs(x, 1) == 34 and 4 * 2 * 2 == 16
    # 19: pen with a dividing fence
    Ap = x * (12 - sp.Rational(3, 2) * x)
    assert crit(Ap) == [4] and sp.Rational(24 - 3 * 4, 2) == 6 and Ap.subs(x, 4) == 24
    assert Ap.subs(x, 3) == sp.Rational(45, 2) and sp.Rational(24 - 3 * 3, 2) == sp.Rational(15, 2)
    assert 2 * 6 + 2 * 6 == 24 and 3 * 6 + 2 * 6 == 30 and 6 * 6 == 36 and 4 * 3 == 12
    # 20: cheapest order size
    Kb = 1000 / x + 10 * x
    assert crit(Kb) == [10] and Kb.subs(x, 10) == 200 and sp.diff(Kb, x, 2).subs(x, 10) > 0
    assert Kb.subs(x, 5) == 250 and Kb.subs(x, 25) == 290 and Kb.subs(x, 100) == 1010


Q.verify(check)
Q.save()
