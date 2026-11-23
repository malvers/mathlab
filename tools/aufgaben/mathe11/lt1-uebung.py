# Builds HTML/svp/mathe/mathe11-lt1-uebung.json (30 practice items for Leistungstest 1, Mathe 11 BGY, Mo 23.11.2026).
#   python3 -I tools/aufgaben/mathe11/lt1-uebung.py HTML/svp/mathe/mathe11-lt1-uebung.json
# Then the PDF behind "Download PDF" (tools/aufgaben/red-list-pdf.mjs builds every list of every plan).
# The test itself (picked from this pool) lives outside the repo: OneDrive MATH BGY 11/Leistungstest 1.
# Copied from ka1-uebung.py (same JSON shape, same text helpers), content replaced.
import json, re, sys
from fractions import Fraction as F

import sympy as sp

COMMENT = ("Leistungstest 1 Mathe 11 BGY, Mo 23.11.2026, 30 min (Doc, 16.11.2026: '30 Aufgaben, ungefaehr basierend auf dem Deck "
           "quadratische Gleichungen ... so viel dran, dass der Test etwa eine halbe Stunde geht'). Decks mathe11-quadratische-gleichungen "
           "and mathe11-pq-herleitung, KW 47. Tools (Doc, 16.11.2026): Formelsammlung yes, calculator no - 'macht die Aufgaben bitte so, "
           "dass man sie locker so rechnen kann' (checked below, hand_check). The pq formula itself never stands in a task text. "
           "AFB I/II/III = 15/9/6 = 50/30/20 %, key of the head of maths. Every solution ends with the Loesungsmenge L = {...}. "
           "Read by the orange button (row.redBtn.src) of row nr 13 (KW 48) in mathe11.html.")

I, II, III = 'AFB I', 'AFB II', 'AFB III'
T = []
def t(afb, q, *lines): T.append({'q': '(' + afb + ') ' + q, 'a': '\n'.join(lines)})

PQ = r'$x_{1,2} = -\dfrac{p}{2} \pm \sqrt{\left(\dfrac{p}{2}\right)^2 - q}$'

# --- without the formula: factor out, square root, a square on the left (deck chapter 01) ---------------
t(I, r'Löse ohne pq-Formel und gib die Lösungsmenge an: a) $x^2 - 9x = 0$ b) $3x^2 - 48 = 0$',
  r'a) Kein absolutes Glied, also $x$ ausklammern: $x(x - 9) = 0$.',
  r'Ein Produkt ist null, wenn ein Faktor null ist: $x = 0$ oder $x - 9 = 0$, also $x = 9$. $L = \{0;\ 9\}$.',
  r'b) Kein $x$-Glied, also nach $x^2$ auflösen: $3x^2 - 48 = 0 \quad | +48$',
  r'$3x^2 = 48 \quad | :3$',
  r'$x^2 = 16$. Die Wurzel hat zwei Vorzeichen: $x = 4$ oder $x = -4$. $L = \{-4;\ 4\}$.')
t(I, r'Löse ohne pq-Formel und gib die Lösungsmenge an: a) $4x^2 + 20x = 0$ b) $x^2 + 25 = 0$',
  r'a) Kein absolutes Glied, also $4x$ ausklammern: $4x(x + 5) = 0$.',
  r'$4x = 0$, also $x = 0$, oder $x + 5 = 0$, also $x = -5$. $L = \{-5;\ 0\}$.',
  r'b) $x^2 + 25 = 0 \quad | -25$',
  r'$x^2 = -25$. Kein Quadrat einer reellen Zahl ist negativ, es gibt also keine Lösung: $L = \{\}$.')
t(I, r'Löse $(x + 3)^2 = 16$, ohne auszumultiplizieren, und gib die Lösungsmenge an.',
  r'Das Quadrat der Klammer ist $16$, also steht in der Klammer $4$ oder $-4$:',
  r'$x + 3 = 4 \quad | -3$ oder $x + 3 = -4 \quad | -3$',
  r'$x = 1$ oder $x = -7$.',
  r'Probe: $(1 + 3)^2 = 4^2 = 16$ ✓ und $(-7 + 3)^2 = (-4)^2 = 16$ ✓',
  r'$L = \{-7;\ 1\}$')
t(I, r'Löse $x^2 = 5x$ und gib die Lösungsmenge an. Warum darf man hier nicht einfach durch $x$ teilen?',
  r'Erst alles auf eine Seite: $x^2 = 5x \quad | -5x$',
  r'$x^2 - 5x = 0$. Ausklammern: $x(x - 5) = 0$, also $x = 0$ oder $x = 5$. $L = \{0;\ 5\}$.',
  r'Wer durch $x$ teilt, bekommt nur $x = 5$: Die Lösung $x = 0$ geht verloren. Für $x = 0$ wäre das Teilen durch $x$ auch gar nicht erlaubt.')

# --- the pq formula (deck chapter 02, mathe11-pq-herleitung) -------------------------------------------
t(I, r'Löse mit der pq-Formel und gib die Lösungsmenge an: $x^2 - 6x + 8 = 0$',
  r'Normalform liegt vor: $p = -6$, $q = 8$.',
  PQ,
  r'$x_{1,2} = -\dfrac{-6}{2} \pm \sqrt{\left(\dfrac{-6}{2}\right)^2 - 8} = 3 \pm \sqrt{9 - 8} = 3 \pm \sqrt{1} = 3 \pm 1$',
  r'$x_1 = 3 + 1 = 4$, $x_2 = 3 - 1 = 2$',
  r'Probe mit Vieta: $4 + 2 = 6 = -p$ ✓ und $4 \cdot 2 = 8 = q$ ✓',
  r'$L = \{2;\ 4\}$')
t(I, r'Löse mit der pq-Formel und gib die Lösungsmenge an: $x^2 + 4x - 12 = 0$',
  r'Normalform liegt vor: $p = 4$, $q = -12$.',
  PQ,
  r'$x_{1,2} = -\dfrac{4}{2} \pm \sqrt{\left(\dfrac{4}{2}\right)^2 - (-12)} = -2 \pm \sqrt{4 + 12} = -2 \pm \sqrt{16} = -2 \pm 4$',
  r'$x_1 = -2 + 4 = 2$, $x_2 = -2 - 4 = -6$',
  r'Probe mit Vieta: $2 + (-6) = -4 = -p$ ✓ und $2 \cdot (-6) = -12 = q$ ✓',
  r'$L = \{-6;\ 2\}$')
t(I, r'Löse mit der pq-Formel und gib die Lösungsmenge an: $x^2 - 2x - 15 = 0$',
  r'Normalform liegt vor: $p = -2$, $q = -15$.',
  PQ,
  r'$x_{1,2} = -\dfrac{-2}{2} \pm \sqrt{\left(\dfrac{-2}{2}\right)^2 - (-15)} = 1 \pm \sqrt{1 + 15} = 1 \pm \sqrt{16} = 1 \pm 4$',
  r'$x_1 = 1 + 4 = 5$, $x_2 = 1 - 4 = -3$',
  r'Probe mit Vieta: $5 + (-3) = 2 = -p$ ✓ und $5 \cdot (-3) = -15 = q$ ✓',
  r'$L = \{-3;\ 5\}$')
t(I, r'Bringe die Gleichung zuerst auf Normalform und löse sie dann mit der pq-Formel. Gib die Lösungsmenge an: $3x^2 + 6x - 24 = 0$',
  r'Vor $x^2$ steht $3$, die pq-Formel braucht aber $1$: $3x^2 + 6x - 24 = 0 \quad | :3$',
  r'$x^2 + 2x - 8 = 0$, also $p = 2$, $q = -8$.',
  r'$x_{1,2} = -\dfrac{2}{2} \pm \sqrt{\left(\dfrac{2}{2}\right)^2 - (-8)} = -1 \pm \sqrt{1 + 8} = -1 \pm \sqrt{9} = -1 \pm 3$',
  r'$x_1 = -1 + 3 = 2$, $x_2 = -1 - 3 = -4$',
  r'Probe in der Ausgangsgleichung: $3 \cdot 2^2 + 6 \cdot 2 - 24 = 12 + 12 - 24 = 0$ ✓ und $3 \cdot (-4)^2 + 6 \cdot (-4) - 24 = 48 - 24 - 24 = 0$ ✓',
  r'$L = \{-4;\ 2\}$')
t(I, r'Löse die Gleichung und gib die Lösungsmenge an: $x^2 + 3x = 10$',
  r'Erst alles auf eine Seite, rechts muss $0$ stehen: $x^2 + 3x = 10 \quad | -10$',
  r'$x^2 + 3x - 10 = 0$, also $p = 3$, $q = -10$.',
  r'$x_{1,2} = -\dfrac{3}{2} \pm \sqrt{\left(\dfrac{3}{2}\right)^2 - (-10)} = -\dfrac{3}{2} \pm \sqrt{\dfrac{9}{4} + \dfrac{40}{4}} = -\dfrac{3}{2} \pm \sqrt{\dfrac{49}{4}} = -\dfrac{3}{2} \pm \dfrac{7}{2}$',
  r'$x_1 = -\dfrac{3}{2} + \dfrac{7}{2} = \dfrac{4}{2} = 2$, $x_2 = -\dfrac{3}{2} - \dfrac{7}{2} = -\dfrac{10}{2} = -5$',
  r'Probe: $2^2 + 3 \cdot 2 = 4 + 6 = 10$ ✓ und $(-5)^2 + 3 \cdot (-5) = 25 - 15 = 10$ ✓',
  r'$L = \{-5;\ 2\}$')
t(I, r'Löse und gib die Lösungsmenge an: $x^2 - 10x + 25 = 0$',
  r'$p = -10$, $q = 25$: $x_{1,2} = -\dfrac{-10}{2} \pm \sqrt{\left(\dfrac{-10}{2}\right)^2 - 25} = 5 \pm \sqrt{25 - 25} = 5 \pm 0 = 5$',
  r'Unter der Wurzel steht $0$, es gibt nur eine Lösung.',
  r'Schneller mit der zweiten binomischen Formel: $x^2 - 10x + 25 = (x - 5)^2 = 0$, also $x - 5 = 0$ und $x = 5$.',
  r'$L = \{5\}$')
t(I, r'Löse und gib die Lösungsmenge an: $x^2 + 2x + 10 = 0$',
  r'$p = 2$, $q = 10$: $x_{1,2} = -\dfrac{2}{2} \pm \sqrt{\left(\dfrac{2}{2}\right)^2 - 10} = -1 \pm \sqrt{1 - 10} = -1 \pm \sqrt{-9}$',
  r'Unter der Wurzel steht eine negative Zahl. Keine reelle Zahl hat ein negatives Quadrat, also gibt es keine Lösung.',
  r'$L = \{\}$')
t(I, r'Bestimme mit der Diskriminante, wie viele Lösungen die Gleichung hat, ohne sie zu lösen: a) $x^2 - 6x + 5 = 0$ b) $x^2 + 8x + 16 = 0$ c) $x^2 - 4x + 7 = 0$',
  r'Die Diskriminante ist der Term unter der Wurzel der pq-Formel: $D = \left(\dfrac{p}{2}\right)^2 - q$.',
  r'a) $p = -6$, $q = 5$: $D = (-3)^2 - 5 = 9 - 5 = 4 > 0$, also zwei Lösungen.',
  r'b) $p = 8$, $q = 16$: $D = 4^2 - 16 = 16 - 16 = 0$, also genau eine Lösung.',
  r'c) $p = -4$, $q = 7$: $D = (-2)^2 - 7 = 4 - 7 = -3 < 0$, also keine Lösung.')
t(I, r'Berechne die Nullstellen der Funktion $f(x) = x^2 - 4x - 21$.',
  r'Nullstellen: $f(x) = 0$, also $x^2 - 4x - 21 = 0$ mit $p = -4$, $q = -21$.',
  r'$x_{1,2} = -\dfrac{-4}{2} \pm \sqrt{\left(\dfrac{-4}{2}\right)^2 - (-21)} = 2 \pm \sqrt{4 + 21} = 2 \pm \sqrt{25} = 2 \pm 5$',
  r'$x_1 = 2 + 5 = 7$, $x_2 = 2 - 5 = -3$, $L = \{-3;\ 7\}$.',
  r'Die Nullstellen sind $x = -3$ und $x = 7$, die Parabel schneidet die $x$-Achse in $N_1(-3 \mid 0)$ und $N_2(7 \mid 0)$.')

# --- Vieta (deck chapter 03) -----------------------------------------------------------------------------
t(I, r'Prüfe mit dem Satz von Vieta, ob $3$ und $-7$ die Lösungen der Gleichung $x^2 + 4x - 21 = 0$ sind.',
  r'Vieta: $x_1 + x_2 = -p$ und $x_1 \cdot x_2 = q$. Hier ist $p = 4$ und $q = -21$.',
  r'Summe: $3 + (-7) = -4 = -p$ ✓',
  r'Produkt: $3 \cdot (-7) = -21 = q$ ✓',
  r'Beides stimmt, also sind $3$ und $-7$ die Lösungen: $L = \{-7;\ 3\}$.')
t(I, r'Stelle eine quadratische Gleichung in Normalform auf, die genau die Lösungen $2$ und $-5$ hat.',
  r'Vieta rückwärts: $p = -(x_1 + x_2) = -(2 + (-5)) = -(-3) = 3$ und $q = x_1 \cdot x_2 = 2 \cdot (-5) = -10$.',
  r'Die Gleichung lautet $x^2 + 3x - 10 = 0$.',
  r'Kontrolle: $(x - 2)(x + 5) = x^2 + 5x - 2x - 10 = x^2 + 3x - 10$ ✓')

# --- AFB II: parameters, normal form first, quadratic completion, word problems ----------------------
t(II, r'Für welchen Wert von $c$ hat die Gleichung $x^2 - 8x + c = 0$ genau eine Lösung? Gib diese Lösung und die Lösungsmenge an.',
  r'Genau eine Lösung heißt: Die Diskriminante ist $0$. Mit $p = -8$ und $q = c$:',
  r'$D = \left(\dfrac{-8}{2}\right)^2 - c = 16 - c$',
  r'$16 - c = 0 \quad | +c$',
  r'$c = 16$',
  r'Die Gleichung heißt dann $x^2 - 8x + 16 = 0$, nach der zweiten binomischen Formel $(x - 4)^2 = 0$, also $x = 4$.',
  r'$L = \{4\}$')
t(II, r'Für welche Werte von $c$ hat die Gleichung $x^2 - 10x + c = 0$ zwei Lösungen, genau eine Lösung oder keine Lösung?',
  r'Mit $p = -10$ und $q = c$: $D = \left(\dfrac{-10}{2}\right)^2 - c = 25 - c$.',
  r'Zwei Lösungen: $D > 0$, also $25 - c > 0$, das heißt $c < 25$.',
  r'Genau eine Lösung: $D = 0$, also $c = 25$. Dann ist $x^2 - 10x + 25 = (x - 5)^2 = 0$ und $L = \{5\}$.',
  r'Keine Lösung: $D < 0$, also $25 - c < 0$, das heißt $c > 25$. Dann ist $L = \{\}$.')
t(II, r'Die Gleichung $x^2 + px - 18 = 0$ hat die Lösung $x_1 = 3$. Bestimme mit dem Satz von Vieta die zweite Lösung und $p$. Gib die Gleichung und ihre Lösungsmenge an.',
  r'Produkt: $x_1 \cdot x_2 = q$, also $3 \cdot x_2 = -18 \quad | :3$',
  r'$x_2 = -6$',
  r'Summe: $x_1 + x_2 = -p$, also $3 + (-6) = -3 = -p$ und damit $p = 3$.',
  r'Die Gleichung heißt $x^2 + 3x - 18 = 0$, $L = \{-6;\ 3\}$.',
  r'Probe: $3^2 + 3 \cdot 3 - 18 = 9 + 9 - 18 = 0$ ✓ und $(-6)^2 + 3 \cdot (-6) - 18 = 36 - 18 - 18 = 0$ ✓')
t(II, r'Berechne die Nullstellen der Funktion $f(x) = -x^2 + 6x - 5$ und ihren Schnittpunkt mit der $y$-Achse.',
  r'Nullstellen: $f(x) = 0$. Vor $x^2$ steht $-1$, die pq-Formel braucht aber $1$: $-x^2 + 6x - 5 = 0 \quad | \cdot (-1)$',
  r'$x^2 - 6x + 5 = 0$, also $p = -6$, $q = 5$.',
  r'$x_{1,2} = -\dfrac{-6}{2} \pm \sqrt{\left(\dfrac{-6}{2}\right)^2 - 5} = 3 \pm \sqrt{9 - 5} = 3 \pm \sqrt{4} = 3 \pm 2$',
  r'$x_1 = 3 + 2 = 5$, $x_2 = 3 - 2 = 1$, $L = \{1;\ 5\}$. Die Nullstellen sind $x = 1$ und $x = 5$.',
  r'$y$-Achse: $f(0) = -0^2 + 6 \cdot 0 - 5 = -5$, also $S_y(0 \mid -5)$.')
t(II, r'Löse die Gleichung $x^2 + 8x + 7 = 0$ mit der quadratischen Ergänzung (ohne pq-Formel) und gib die Lösungsmenge an.',
  r'Die Zahl vor $x$ halbieren und quadrieren: $8 : 2 = 4$ und $4^2 = 16$.',
  r'Geschickte Null, dazu und gleich wieder weg: $x^2 + 8x + 16 - 16 + 7 = 0$',
  r'Die ersten drei Terme sind ein Quadrat: $(x + 4)^2 - 16 + 7 = 0$, also $(x + 4)^2 - 9 = 0 \quad | +9$',
  r'$(x + 4)^2 = 9$. Die Wurzel hat zwei Vorzeichen: $x + 4 = 3 \quad | -4$ oder $x + 4 = -3 \quad | -4$',
  r'$x = -1$ oder $x = -7$',
  r'Probe mit Vieta: $-1 + (-7) = -8 = -p$ ✓ und $(-1) \cdot (-7) = 7 = q$ ✓',
  r'$L = \{-7;\ -1\}$')
t(II, r'Löse die Gleichung $(x - 2)(x + 3) = 14$ und gib die Lösungsmenge an.',
  r'Rechts steht nicht $0$, also hilft das Nullprodukt hier nicht. Erst ausmultiplizieren:',
  r'$x^2 + 3x - 2x - 6 = 14$, also $x^2 + x - 6 = 14 \quad | -14$',
  r'$x^2 + x - 20 = 0$, also $p = 1$, $q = -20$.',
  r'$x_{1,2} = -\dfrac{1}{2} \pm \sqrt{\left(\dfrac{1}{2}\right)^2 - (-20)} = -\dfrac{1}{2} \pm \sqrt{\dfrac{1}{4} + \dfrac{80}{4}} = -\dfrac{1}{2} \pm \sqrt{\dfrac{81}{4}} = -\dfrac{1}{2} \pm \dfrac{9}{2}$',
  r'$x_1 = -\dfrac{1}{2} + \dfrac{9}{2} = \dfrac{8}{2} = 4$, $x_2 = -\dfrac{1}{2} - \dfrac{9}{2} = -\dfrac{10}{2} = -5$',
  r'Probe: $(4 - 2)(4 + 3) = 2 \cdot 7 = 14$ ✓ und $(-5 - 2)(-5 + 3) = (-7) \cdot (-2) = 14$ ✓',
  r'$L = \{-5;\ 4\}$',
  r'Typischer Fehler: „$x - 2 = 14$ oder $x + 3 = 14$“. Das geht nur, wenn rechts $0$ steht.')
t(II, r'Löse die Gleichung $(x + 1)^2 = 2x + 10$ und gib die Lösungsmenge an.',
  r'Links die erste binomische Formel: $x^2 + 2x + 1 = 2x + 10 \quad | -2x$',
  r'$x^2 + 1 = 10 \quad | -1$',
  r'$x^2 = 9$, also $x = 3$ oder $x = -3$.',
  r'Probe: $(3 + 1)^2 = 16$ und $2 \cdot 3 + 10 = 16$ ✓, $(-3 + 1)^2 = 4$ und $2 \cdot (-3) + 10 = 4$ ✓',
  r'$L = \{-3;\ 3\}$')
t(II, r'Ein Rechteck hat den Umfang $26$ cm und den Flächeninhalt $40\ \mathrm{cm^2}$. Berechne die Seitenlängen.',
  r'Seiten $a$ und $b$. Umfang: $2a + 2b = 26 \quad | :2$',
  r'$a + b = 13$, also $b = 13 - a$.',
  r'Fläche: $a \cdot (13 - a) = 40$, also $13a - a^2 = 40 \quad | +a^2 - 13a$',
  r'$0 = a^2 - 13a + 40$, also $a^2 - 13a + 40 = 0$ mit $p = -13$, $q = 40$.',
  r'$a_{1,2} = -\dfrac{-13}{2} \pm \sqrt{\left(\dfrac{-13}{2}\right)^2 - 40} = \dfrac{13}{2} \pm \sqrt{\dfrac{169}{4} - \dfrac{160}{4}} = \dfrac{13}{2} \pm \sqrt{\dfrac{9}{4}} = \dfrac{13}{2} \pm \dfrac{3}{2}$',
  r'$a_1 = \dfrac{16}{2} = 8$, $a_2 = \dfrac{10}{2} = 5$, $L = \{5;\ 8\}$.',
  r'Für $a = 8$ ist $b = 13 - 8 = 5$, für $a = 5$ ist $b = 8$: Die Seiten sind 8 cm und 5 cm lang.',
  r'Probe: $2 \cdot 8 + 2 \cdot 5 = 26$ ✓ und $8 \cdot 5 = 40$ ✓',
  r'Schneller mit Vieta: zwei Zahlen mit der Summe $13$ und dem Produkt $40$, das sind $5$ und $8$.')
t(II, r'Ein Ball wird vom Balkon geworfen. Seine Höhe über dem Boden ist $h(t) = -5t^2 + 10t + 15$ ($t$ in Sekunden, $h$ in Metern). a) Nach wie vielen Sekunden trifft der Ball auf den Boden? b) Wann ist der Ball wieder auf der Abwurfhöhe von 15 m?',
  r'a) Boden heißt $h(t) = 0$: $-5t^2 + 10t + 15 = 0 \quad | :(-5)$',
  r'$t^2 - 2t - 3 = 0$, also $p = -2$, $q = -3$.',
  r'$t_{1,2} = -\dfrac{-2}{2} \pm \sqrt{\left(\dfrac{-2}{2}\right)^2 - (-3)} = 1 \pm \sqrt{1 + 3} = 1 \pm \sqrt{4} = 1 \pm 2$',
  r'$t_1 = 1 + 2 = 3$, $t_2 = 1 - 2 = -1$, $L = \{-1;\ 3\}$.',
  r'Eine negative Zeit liegt vor dem Wurf, also trifft der Ball nach 3 Sekunden auf. Probe: $-5 \cdot 9 + 10 \cdot 3 + 15 = -45 + 30 + 15 = 0$ ✓',
  r'b) $h(t) = 15$: $-5t^2 + 10t + 15 = 15 \quad | -15$',
  r'$-5t^2 + 10t = 0$. Kein absolutes Glied, also ausklammern: $-5t(t - 2) = 0$',
  r'$t = 0$ oder $t = 2$, $L = \{0;\ 2\}$. Bei $t = 0$ wird geworfen, nach 2 Sekunden ist der Ball wieder auf 15 m.')

# --- AFB III ----------------------------------------------------------------------------------------------
t(III, r'Für welche Werte von $p$ hat die Gleichung $x^2 + px + 9 = 0$ genau eine Lösung? Gib für jeden dieser Werte die Gleichung und ihre Lösungsmenge an.',
  r'Genau eine Lösung heißt $D = 0$: $D = \left(\dfrac{p}{2}\right)^2 - 9 = \dfrac{p^2}{4} - 9$',
  r'$\dfrac{p^2}{4} - 9 = 0 \quad | +9$',
  r'$\dfrac{p^2}{4} = 9 \quad | \cdot 4$',
  r'$p^2 = 36$, also $p = 6$ oder $p = -6$ (zwei Vorzeichen!).',
  r'$p = 6$: $x^2 + 6x + 9 = (x + 3)^2 = 0$, also $x = -3$ und $L = \{-3\}$.',
  r'$p = -6$: $x^2 - 6x + 9 = (x - 3)^2 = 0$, also $x = 3$ und $L = \{3\}$.')
t(III, r'Tim löst $2x^2 + 8x - 10 = 0$ mit der pq-Formel und setzt $p = 8$ und $q = -10$ ein. Erkläre seinen Fehler, löse die Gleichung richtig und mache die Probe.',
  r'Der Fehler: Die pq-Formel gilt nur für die Normalform $x^2 + px + q = 0$, vor $x^2$ muss $1$ stehen. Hier steht $2$.',
  r'Richtig: $2x^2 + 8x - 10 = 0 \quad | :2$',
  r'$x^2 + 4x - 5 = 0$, also $p = 4$, $q = -5$.',
  r'$x_{1,2} = -\dfrac{4}{2} \pm \sqrt{\left(\dfrac{4}{2}\right)^2 - (-5)} = -2 \pm \sqrt{4 + 5} = -2 \pm \sqrt{9} = -2 \pm 3$',
  r'$x_1 = -2 + 3 = 1$, $x_2 = -2 - 3 = -5$, $L = \{-5;\ 1\}$.',
  r'Probe in der Ausgangsgleichung: $2 \cdot 1^2 + 8 \cdot 1 - 10 = 0$ ✓ und $2 \cdot (-5)^2 + 8 \cdot (-5) - 10 = 50 - 40 - 10 = 0$ ✓',
  r'Vieta zeigt Tims Fehler auch: Seine beiden Ergebnisse hätten die Summe $-8$, richtig ist $-p = -4$.')
t(III, r'Begründe mit der Diskriminante: Wenn $q < 0$ ist, hat $x^2 + px + q = 0$ immer zwei Lösungen, egal wie groß $p$ ist. Gilt auch die Umkehrung, hat die Gleichung also für $q > 0$ nie zwei Lösungen?',
  r'$D = \left(\dfrac{p}{2}\right)^2 - q$. Ein Quadrat ist nie negativ: $\left(\dfrac{p}{2}\right)^2 \geq 0$.',
  r'Ist $q < 0$, dann ist $-q > 0$. Also ist $D = \left(\dfrac{p}{2}\right)^2 + (-q) > 0$: immer zwei Lösungen.',
  r'Die Umkehrung gilt nicht. Gegenbeispiel: $x^2 - 6x + 8 = 0$ hat $q = 8 > 0$, aber $D = 9 - 8 = 1 > 0$ und zwei Lösungen, $L = \{2;\ 4\}$.')
t(III, r'Verlängert man eine Seite eines Quadrats um 3 cm und verkürzt die andere um 2 cm, entsteht ein Rechteck mit dem Flächeninhalt $36\ \mathrm{cm^2}$. Wie lang ist die Seite des Quadrats?',
  r'Quadratseite $a$. Das Rechteck hat die Seiten $a + 3$ und $a - 2$: $(a + 3)(a - 2) = 36$',
  r'Ausmultiplizieren: $a^2 - 2a + 3a - 6 = 36$, also $a^2 + a - 6 = 36 \quad | -36$',
  r'$a^2 + a - 42 = 0$, also $p = 1$, $q = -42$.',
  r'$a_{1,2} = -\dfrac{1}{2} \pm \sqrt{\left(\dfrac{1}{2}\right)^2 - (-42)} = -\dfrac{1}{2} \pm \sqrt{\dfrac{1}{4} + 42} = -\dfrac{1}{2} \pm \sqrt{\dfrac{1}{4} + \dfrac{168}{4}} = -\dfrac{1}{2} \pm \sqrt{\dfrac{169}{4}} = -\dfrac{1}{2} \pm \dfrac{13}{2}$',
  r'$a_1 = \dfrac{12}{2} = 6$, $a_2 = -\dfrac{14}{2} = -7$, $L = \{-7;\ 6\}$.',
  r'Eine Länge ist positiv, also ist die Quadratseite 6 cm lang. Probe: $(6 + 3) \cdot (6 - 2) = 9 \cdot 4 = 36$ ✓')
t(III, r'Die Gleichung $x^2 - 9x + q = 0$ hat zwei Lösungen, und eine ist doppelt so groß wie die andere. Bestimme beide Lösungen und $q$.',
  r'Die Lösungen heißen $x_1$ und $x_2 = 2x_1$. Vieta mit $p = -9$: $x_1 + x_2 = -p = 9$',
  r'$x_1 + 2x_1 = 9$, also $3x_1 = 9 \quad | :3$',
  r'$x_1 = 3$ und $x_2 = 2 \cdot 3 = 6$',
  r'Produkt: $q = x_1 \cdot x_2 = 3 \cdot 6 = 18$. Die Gleichung heißt $x^2 - 9x + 18 = 0$, $L = \{3;\ 6\}$.',
  r'Probe mit der pq-Formel: $x_{1,2} = \dfrac{9}{2} \pm \sqrt{\dfrac{81}{4} - \dfrac{72}{4}} = \dfrac{9}{2} \pm \dfrac{3}{2}$, also $6$ und $3$ ✓')
t(III, r'Berechne die gemeinsamen Punkte der Parabel $f(x) = x^2 - 2x - 3$ und der Geraden $g(x) = x + 1$.',
  r'Gemeinsame Punkte: $f(x) = g(x)$, also $x^2 - 2x - 3 = x + 1 \quad | -x - 1$',
  r'$x^2 - 3x - 4 = 0$, also $p = -3$, $q = -4$.',
  r'$x_{1,2} = -\dfrac{-3}{2} \pm \sqrt{\left(\dfrac{-3}{2}\right)^2 - (-4)} = \dfrac{3}{2} \pm \sqrt{\dfrac{9}{4} + 4} = \dfrac{3}{2} \pm \sqrt{\dfrac{9}{4} + \dfrac{16}{4}} = \dfrac{3}{2} \pm \sqrt{\dfrac{25}{4}} = \dfrac{3}{2} \pm \dfrac{5}{2}$',
  r'$x_1 = \dfrac{8}{2} = 4$, $x_2 = -\dfrac{2}{2} = -1$, $L = \{-1;\ 4\}$.',
  r'$y$-Werte aus der Geraden: $g(4) = 4 + 1 = 5$ und $g(-1) = -1 + 1 = 0$.',
  r'Die gemeinsamen Punkte sind $P_1(-1 \mid 0)$ und $P_2(4 \mid 5)$. Probe in $f$: $f(4) = 16 - 8 - 3 = 5$ ✓ und $f(-1) = 1 + 2 - 3 = 0$ ✓')


# ---------------------------------------------------------- numbers check ----
# Every equation, every pq step, every Vieta and every Probe recomputed (Doc: no step may be wrong).
x, c, p, a, tt = sp.symbols('x c p a t')
S = lambda e, v=x: sorted(sp.solve(e, v))
def pq(P, Q):
    """(-p/2, D) with exact fractions."""
    return F(-P, 2), F(P, 2) ** 2 - Q
def check():
    # 1-4
    assert S(x**2 - 9*x) == [0, 9] and S(3*x**2 - 48) == [-4, 4]
    assert S(4*x**2 + 20*x) == [-5, 0] and sp.solve(x**2 + 25, x) and all(not s.is_real for s in sp.solve(x**2 + 25, x))
    assert sp.expand(4*x*(x + 5)) == 4*x**2 + 20*x and sp.expand(x*(x - 9)) == x**2 - 9*x
    assert S((x + 3)**2 - 16) == [-7, 1] and (1 + 3)**2 == 16 and (-7 + 3)**2 == 16
    assert S(x**2 - 5*x) == [0, 5]
    # 5-7: plain pq
    for P, Q, sols, root in ((-6, 8, [2, 4], 1), (4, -12, [-6, 2], 4), (-2, -15, [-3, 5], 4)):
        m, D = pq(P, Q)
        assert D == root**2 and sorted([m + root, m - root]) == sols == S(x**2 + P*x + Q)
        assert sum(sols) == -P and sols[0] * sols[1] == Q
    assert pq(-6, 8) == (3, 1) and pq(4, -12) == (-2, 16) and pq(-2, -15) == (1, 16)
    # 8: normal form first
    assert S(3*x**2 + 6*x - 24) == [-4, 2] and pq(2, -8) == (-1, 9)
    assert 3*4 + 12 - 24 == 0 and 3*16 - 24 - 24 == 0
    # 9
    assert S(x**2 + 3*x - 10) == [-5, 2] and pq(3, -10) == (F(-3, 2), F(49, 4)) and F(9, 4) + F(40, 4) == F(49, 4)
    assert F(-3, 2) + F(7, 2) == 2 and F(-3, 2) - F(7, 2) == -5 and 4 + 6 == 10 and 25 - 15 == 10
    # 10-11
    assert S(x**2 - 10*x + 25) == [5] and pq(-10, 25) == (5, 0) and sp.expand((x - 5)**2) == x**2 - 10*x + 25
    assert pq(2, 10) == (-1, -9) and all(not s.is_real for s in sp.solve(x**2 + 2*x + 10, x))
    # 12: discriminants
    assert pq(-6, 5)[1] == 4 and pq(8, 16)[1] == 0 and pq(-4, 7)[1] == -3
    assert len(S(x**2 - 6*x + 5)) == 2 and len(S(x**2 + 8*x + 16)) == 1 and all(not s.is_real for s in sp.solve(x**2 - 4*x + 7, x))
    # 13
    assert S(x**2 - 4*x - 21) == [-3, 7] and pq(-4, -21) == (2, 25)
    # 14-15: Vieta
    assert S(x**2 + 4*x - 21) == [-7, 3] and 3 + (-7) == -4 and 3 * (-7) == -21
    assert -(2 + (-5)) == 3 and 2 * (-5) == -10 and sp.expand((x - 2)*(x + 5)) == x**2 + 3*x - 10
    # 16-17: parameter c
    assert sp.solve(F(-8, 2)**2 - c, c) == [16] and S(x**2 - 8*x + 16) == [4]
    assert pq(-10, 0)[1] == 25 and S(x**2 - 10*x + 25) == [5]
    assert len(S(x**2 - 10*x + 24)) == 2 and all(not s.is_real for s in sp.solve(x**2 - 10*x + 26, x))
    # 18
    assert -18 / 3 == -6 and -(3 + (-6)) == 3 and S(x**2 + 3*x - 18) == [-6, 3] and 9 + 9 - 18 == 0 and 36 - 18 - 18 == 0
    # 19
    assert S(-x**2 + 6*x - 5) == [1, 5] and pq(-6, 5) == (3, 4) and (-x**2 + 6*x - 5).subs(x, 0) == -5
    # 20: quadratic completion
    assert sp.expand((x + 4)**2 - 16 + 7) == x**2 + 8*x + 7 and S((x + 4)**2 - 9) == [-7, -1] == S(x**2 + 8*x + 7)
    # 21
    assert sp.expand((x - 2)*(x + 3)) == x**2 + x - 6 and S((x - 2)*(x + 3) - 14) == [-5, 4]
    assert pq(1, -20) == (F(-1, 2), F(81, 4)) and F(1, 4) + F(80, 4) == F(81, 4) and (4 - 2)*(4 + 3) == 14 and (-7)*(-2) == 14
    # 22
    assert S((x + 1)**2 - (2*x + 10)) == [-3, 3] and (3 + 1)**2 == 2*3 + 10 and (-3 + 1)**2 == 2*(-3) + 10
    # 23: rectangle
    assert S(a*(13 - a) - 40, a) == [5, 8] and pq(-13, 40) == (F(13, 2), F(9, 4)) and F(169, 4) - F(160, 4) == F(9, 4)
    assert 2*8 + 2*5 == 26 and 8*5 == 40
    # 24: ball
    h = -5*tt**2 + 10*tt + 15
    assert S(h, tt) == [-1, 3] and pq(-2, -3) == (1, 4) and h.subs(tt, 3) == 0 and -45 + 30 + 15 == 0
    assert S(h - 15, tt) == [0, 2] and sp.expand(-5*tt*(tt - 2)) == -5*tt**2 + 10*tt
    # 25: parameter p
    assert S(F(1, 4)*p**2 - 9, p) == [-6, 6] and S(x**2 + 6*x + 9) == [-3] and S(x**2 - 6*x + 9) == [3]
    # 26: Tim
    assert S(2*x**2 + 8*x - 10) == [-5, 1] and pq(4, -5) == (-2, 9) and 2 + 8 - 10 == 0 and 50 - 40 - 10 == 0
    assert sum(S(x**2 + 8*x - 10)) == -8
    # 27
    assert pq(-6, 8)[1] == 1 and S(x**2 - 6*x + 8) == [2, 4]
    # 28: square -> rectangle
    assert S((a + 3)*(a - 2) - 36, a) == [-7, 6] and pq(1, -42) == (F(-1, 2), F(169, 4)) and F(1, 4) + F(168, 4) == F(169, 4)
    assert (6 + 3)*(6 - 2) == 36
    # 29
    assert S(x**2 - 9*x + 18) == [3, 6] and F(81, 4) - F(72, 4) == F(9, 4)
    # 30: parabola and line
    f = x**2 - 2*x - 3
    assert S(f - (x + 1)) == [-1, 4] and pq(-3, -4) == (F(3, 2), F(25, 4)) and f.subs(x, 4) == 5 and f.subs(x, -1) == 0
check()

# ---------------------------------------------------------- by hand ----
# Doc, 16.11.2026: no calculator, 'so, dass man sie locker so rechnen kann'. Every quadratic that an item
# solves or examines (as written, before dividing), keyed by item number - all 30 items are listed.
# Rule: small integer coefficients, integer p and q after dividing, (p/2)^2 at most 400/4, the radicand a
# square of a simple number (or 0, or negative = no solution), roots integers or halves, nothing above 20.
HAND = {
    1: [x**2 - 9*x, 3*x**2 - 48], 2: [4*x**2 + 20*x, x**2 + 25], 3: [(x + 3)**2 - 16], 4: [x**2 - 5*x],
    5: [x**2 - 6*x + 8], 6: [x**2 + 4*x - 12], 7: [x**2 - 2*x - 15], 8: [3*x**2 + 6*x - 24], 9: [x**2 + 3*x - 10],
    10: [x**2 - 10*x + 25], 11: [x**2 + 2*x + 10], 12: [x**2 - 6*x + 5, x**2 + 8*x + 16, x**2 - 4*x + 7],
    13: [x**2 - 4*x - 21], 14: [x**2 + 4*x - 21], 15: [(x - 2)*(x + 5)], 16: [x**2 - 8*x + 16],
    17: [x**2 - 10*x + 24, x**2 - 10*x + 25, x**2 - 10*x + 26], 18: [x**2 + 3*x - 18], 19: [-x**2 + 6*x - 5],
    20: [x**2 + 8*x + 7], 21: [(x - 2)*(x + 3) - 14], 22: [(x + 1)**2 - (2*x + 10)], 23: [a*(13 - a) - 40],
    24: [-5*tt**2 + 10*tt + 15, -5*tt**2 + 10*tt], 25: [x**2 + 6*x + 9, x**2 - 6*x + 9], 26: [2*x**2 + 8*x - 10],
    27: [x**2 - 6*x + 8], 28: [(a + 3)*(a - 2) - 36], 29: [x**2 - 9*x + 18], 30: [x**2 - 2*x - 3 - (x + 1)],
}
def hand_check():
    assert sorted(HAND) == list(range(1, len(T) + 1)), sorted(HAND)
    for k, polys in HAND.items():
        for e in polys:
            v = (e.free_symbols or {x}).pop()
            P = sp.Poly(sp.expand(e), v)
            assert P.degree() == 2 and all(c.is_integer and abs(c) <= 50 for c in P.all_coeffs()), (k, e)
            lead, b, c0 = P.all_coeffs()
            p, q = sp.Rational(b, lead), sp.Rational(c0, lead)
            assert p.is_integer and q.is_integer and abs(p) <= 20 and abs(q) <= 50, (k, e, p, q)
            D = (p / 2)**2 - q
            assert ((p / 2)**2).p <= 400, (k, e)
            if D < 0:
                continue                                        # no solution, nothing to take the root of
            r = sp.sqrt(D)
            assert r.is_rational and r.q <= 2 and r.p <= 20, (k, e, D)
            for s in (-p / 2 + r, -p / 2 - r):
                assert s.q <= 2 and abs(s) <= 20 and P.eval(s) == 0, (k, e, s)
hand_check()

# Numbers in running text stay text, LaTeX only for real formulas (Doc, 09.10.2026) - same helpers as ka1-uebung.py.
SUP = {'2': '\u00b2', '3': '\u00b3'}
def unit(u): return re.sub(r'\^(\d)', lambda m: SUP[m.group(1)], u)
def num(n): return n.replace('{,}', ',').replace('-', '\u2212')
def plain(t):
    t = re.sub(r'\$(-?\d+(?:\{,\}\d+)?)\$', lambda m: num(m.group(1)), t)
    t = re.sub(r'\$(-?\d+(?:\{,\}\d+)?)\\,\\%\$', lambda m: num(m.group(1)) + '\u00a0%', t)
    t = re.sub(r'\$(-?\d+(?:\{,\}\d+)?)\\ \\mathrm\{([a-zA-Z]+(?:\^\d)?)\}\$', lambda m: num(m.group(1)) + '\u00a0' + unit(m.group(2)), t)
    return t
# A chain "a = b = c" is one unbreakable formula and sticks out on a phone: split it before
# every further relation into "$a = b$ $= c$" (the plan wraps between formulas).
def chains(t):
    def split(m):
        f = m.group(1)
        if '\\begin' in f: return m.group(0)
        cut, depth, rel = [], 0, 0
        for i, ch in enumerate(f):
            depth += (ch == '{') - (ch == '}')
            if depth: continue
            for r in (' = ', ' \\approx '):
                if f.startswith(r, i):
                    rel += 1
                    if rel > 1: cut.append(i)
        if not cut: return m.group(0)
        parts = [f[a:b].strip() for a, b in zip([0] + cut, cut + [len(f)])]
        return ' '.join('$' + p + '$' for p in parts)
    return re.sub(r'\$([^$]+)\$', split, t)
for it in T:
    it['q'], it['a'] = plain(it['q']), chains(plain(it['a']))

counts = {k: sum(1 for it in T if it['q'].startswith('(' + k + ')')) for k in (I, II, III)}
assert len(T) == 30 and counts == {I: 15, II: 9, III: 6}, (len(T), counts)
# every solution names its Loesungsmenge (Doc wants L = {...} repeated), except the pure counting,
# building and reasoning tasks 12, 15 and 27
for k, it in enumerate(T, 1):
    assert 'L = \\{' in it['a'] or k in (12, 15), (k, it['q'][:50])
# Time per task for a BGY 11 student who practised the topic, writing included, no calculator.
MIN = [2, 2, 2, 2,             # without the formula
       3, 3, 3, 3, 4, 2, 2, 3, 3,   # pq formula, discriminant, zeros
       2, 2,                   # Vieta
       4, 4, 3, 4, 4, 5, 4, 5, 6,   # AFB II
       4, 5, 5, 5, 5, 6]       # AFB III
assert len(MIN) == len(T)
for it, m in zip(T, MIN):
    it['q'] = re.sub(r'^\((AFB [I +]+)\) ', lambda g: '(' + g.group(1) + ' \u00b7 ca. %d\u00a0min) ' % m, it['q'], count=1)
    assert '\u00a0min) ' in it['q'], it['q'][:40]
tot = {k: sum(m for it, m in zip(T, MIN) if it['q'].startswith('(' + k + ' \u00b7')) for k in (I, II, III)}
print('minutes', sum(MIN), tot)
# Doc, 16.11.2026: "vor allen Dingen die Vorschau, was drankommen wird" - the line under the head says
# when, how long, with what, what it is about and where to practise.
# Doc, 23.11.2026: the test moved from Mon 23.11. 13:45 to Tue 24.11. 08:00 (Informatik double period, KES201).
INFO = ('Di 24.11., 08:00 in der Informatikstunde (KES201), verschoben vom Mo 23.11.; erst auf Papier, danach Teil A online eintippen. 30\u00a0min, Formelsammlung erlaubt, kein Taschenrechner. Etwa 7 bis 8 dieser Aufgaben kommen dran. '
        'Themen: ausklammern, Wurzel ziehen, pq-Formel (erst die Normalform!), quadratische Ergänzung, Diskriminante, Vieta, '
        'Nullstellen, Sachaufgaben, immer mit Lösungsmenge $L = \\{\\dots\\}$. Bonus: Wer die pq-Formel herleiten kann, bekommt 10\u00a0%% mehr Punkte. '
        'Üben: Decks „Quadratische Gleichungen“ und „Herleitung der pq-Formel“, Vorrechnen KW 47. '
        'Alle %d Aufgaben: ca. %d\u00a0min.' % (len(T), sum(MIN)))
with open(sys.argv[1], 'w', encoding='utf-8') as fh:
    json.dump({'_comment': COMMENT, 'pdf': 'mathe11-lt1-uebung.pdf', 'info': INFO, 'items': T}, fh, ensure_ascii=False, indent=2)
    fh.write('\n')
print(len(T), counts)
