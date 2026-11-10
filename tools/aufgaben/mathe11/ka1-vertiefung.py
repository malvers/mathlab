#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 46: Vertiefung zur Klassenarbeit 1 (Doc, 10.11.2026).
Fraction equation in context with domain, check and percent direction (KA tasks 7, 2c),
a dice duel with tree, path rule and the fairness proof (6a-c), mental arithmetic with
the binomial formulas and a general reason (9).
Quiz of the same week: tools/aufgaben/mathe11-quiz/ka1-vertiefung.py"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from fractions import Fraction as F
from textaufgaben import Sheet
from baum import zweistufig, spiel, paare, faces
import svgfig as SV

s = Sheet("mathe11-ka1-vertiefung", "Vertiefung zur Klassenarbeit 1", kw=46)

SPIELER, BANK = [3, 3, 6, 6, 6, 6], [2, 2, 4, 4, 9, 9]
FAIR, REMIS = [2, 4, 4, 4, 9, 9], [2, 3, 4, 4, 9, 9]

# ---------------------------------------------------------------- AFB I ----
s.task("Rad gegen Mofa", 1,
       r"Ein Rad und ein Mofa starten gleichzeitig. In derselben Zeit schafft das Rad $30$ km, das Mofa $45$ km. Das Mofa fährt im Schnitt $10$ km/h schneller als das Rad. Ist $v$ die Geschwindigkeit des Rads in km/h, so gilt $\dfrac{30}{v} = \dfrac{45}{v+10}$.",
       [r"Erkläre, warum diese Gleichung die Situation beschreibt. Was bedeuten die beiden Brüche?",
        r"Gib den Definitionsbereich der Gleichung an und begründe ihn.",
        r"Löse die Gleichung. Prüfe, ob die Lösung in $D$ liegt, und gib die Lösungsmenge an.",
        r"Wie lange sind beide unterwegs? Um wie viel Prozent ist das Mofa schneller als das Rad? Um wie viel Prozent ist das Rad langsamer als das Mofa?"],
       solution=[
        r"Zeit ist Weg durch Geschwindigkeit. $\dfrac{30}{v}$ ist die Fahrzeit des Rads, $\dfrac{45}{v+10}$ die des Mofas, das $10$ km/h schneller fährt. Beide sind gleich lange unterwegs, also sind die beiden Brüche gleich.",
        r"Kein Nenner darf $0$ werden: $v \neq 0$ und $v + 10 \neq 0$, also $D = \mathbb{R} \setminus \{-10;\ 0\}$. Im Sachzusammenhang ist ohnehin nur $v > 0$ sinnvoll.",
        r"Mit beiden Nennern multiplizieren: $30(v + 10) = 45v$, also $30v + 300 = 45v$, $300 = 15v$ und $v = 20$. $20 \in D$, also $L = \{20\}$: Das Rad fährt $20$ km/h, das Mofa $30$ km/h. Probe: $\dfrac{30}{20} = 1{,}5$ und $\dfrac{45}{30} = 1{,}5$.",
        r"Fahrzeit $\dfrac{30}{20} = 1{,}5$ h, also $1$ h $30$ min. Mofa durch Rad: $\dfrac{30}{20} = 1{,}5 = 1 + 0{,}5$, das Mofa ist um $50\,\%$ schneller. Rad durch Mofa: $\dfrac{20}{30} \approx 0{,}667 = 1 - 0{,}333$, das Rad ist um rund $33{,}3\,\%$ langsamer. Die Prozentzahlen sind verschieden, weil sie sich auf verschiedene Grundwerte beziehen ($20$ km/h bzw. $30$ km/h)."],
       falle=r"Falle in c): $30(v + 10) = 30v + 10$. Die $30$ gehört an beide Glieder der Klammer. Und in d): Prozent immer mit Richtung (schneller oder langsamer, Zunahme oder Abnahme) und mit dem passenden Grundwert.")

# --------------------------------------------------------------- AFB II ----
s.task("Würfelduell gegen die Bank", 2,
       r"Am Stand der Klasse 11 tritt man gegen die Bank an. Zuerst würfelt der Spieler mit einem Würfel, auf dem $3, 3, 6, 6, 6, 6$ steht, danach die Bank mit einem Würfel mit $2, 2, 4, 4, 9, 9$. Wer die größere Zahl hat, gewinnt.",
       [r"Zeichne ein Baumdiagramm. Schreibe an jeden Ast die Wahrscheinlichkeit und ans Ende jedes Pfades die Pfadwahrscheinlichkeit.",
        r"Ermittle die Wahrscheinlichkeit dafür, dass der Spieler gewinnt.",
        r"Die Bank darf genau eine Fläche ihres Würfels neu beschriften. Wie muss sie das tun, damit das Spiel fair ist, also beide mit der Wahrscheinlichkeit $\dfrac{1}{2}$ gewinnen? Weise mit einem neuen Baumdiagramm nach, dass dein Vorschlag fair ist.",
        r"Jemand schlägt vor, eine $2$ der Bank in eine $3$ umzuschreiben. Beurteile, ob das Spiel dann fair ist."],
       solution=[
        r"Spieler: $P(3) = \dfrac{2}{6} = \dfrac{1}{3}$, $P(6) = \dfrac{4}{6} = \dfrac{2}{3}$. Bank: $P(2) = P(4) = P(9) = \dfrac{2}{6} = \dfrac{1}{3}$. Pfadregel: Die Pfade mit Spieler $3$ haben je $\dfrac{1}{3} \cdot \dfrac{1}{3} = \dfrac{1}{9}$, die mit Spieler $6$ je $\dfrac{2}{3} \cdot \dfrac{1}{3} = \dfrac{2}{9}$. Kontrolle: $3 \cdot \dfrac{1}{9} + 3 \cdot \dfrac{2}{9} = 1$. Baum: erste Abbildung.",
        r"Der Spieler gewinnt auf den Pfaden $(3 \mid 2)$, $(6 \mid 2)$ und $(6 \mid 4)$. Summenregel: $\dfrac{1}{9} + \dfrac{2}{9} + \dfrac{2}{9} = \dfrac{5}{9} \approx 55{,}6\,\%$. Die Bank gewinnt mit $\dfrac{4}{9}$.",
        r"Von den $36$ gleich wahrscheinlichen Flächenpaaren gewinnt der Spieler $20$, die Bank $16$. Fair heißt $18 : 18$, die Bank braucht also $2$ Paare mehr. Eine $2$ der Bank schlägt nichts, als $4$ schlägt sie die beiden $3$en: Die Bank würfelt mit $2, 4, 4, 4, 9, 9$, also $P(2) = \dfrac{1}{6}$, $P(4) = \dfrac{1}{2}$, $P(9) = \dfrac{1}{3}$ (zweite Abbildung). Der Spieler gewinnt auf $(3 \mid 2)$ mit $\dfrac{1}{3} \cdot \dfrac{1}{6} = \dfrac{1}{18}$, auf $(6 \mid 2)$ mit $\dfrac{2}{3} \cdot \dfrac{1}{6} = \dfrac{2}{18}$ und auf $(6 \mid 4)$ mit $\dfrac{2}{3} \cdot \dfrac{1}{2} = \dfrac{6}{18}$, zusammen $\dfrac{9}{18} = \dfrac{1}{2}$. Keine Zahl steht auf beiden Würfeln, es gibt kein Unentschieden, also gewinnt auch die Bank mit $\dfrac{1}{2}$: fair. Eine $5$ statt der $4$ geht genauso, jede Zahl größer als $3$ und kleiner als $6$.",
        r"Mit $2, 3, 4, 4, 9, 9$ steht die $3$ auf beiden Würfeln. Der Pfad $(3 \mid 3)$ mit $\dfrac{1}{3} \cdot \dfrac{1}{6} = \dfrac{1}{18}$ ist unentschieden. Der Spieler gewinnt auf $(3 \mid 2)$, $(6 \mid 2)$, $(6 \mid 3)$ und $(6 \mid 4)$: $\dfrac{1}{18} + \dfrac{2}{18} + \dfrac{2}{18} + \dfrac{4}{18} = \dfrac{1}{2}$. Die Bank gewinnt nur auf $(3 \mid 4)$, $(3 \mid 9)$ und $(6 \mid 9)$: $\dfrac{2}{18} + \dfrac{2}{18} + \dfrac{4}{18} = \dfrac{4}{9}$. Nicht fair: Die Bank gewinnt seltener als der Spieler, und in $\dfrac{1}{18}$ der Spiele gewinnt niemand."],
       falle=r"Falle in c): nur behaupten, dass es fair ist. Der Nachweis braucht den neuen Baum mit den neuen Wahrscheinlichkeiten und die Rechnung $P = \dfrac{1}{2}$ für beide. Und eine Zahl, die auf beiden Würfeln steht, erzeugt Unentschieden.",
       solfigs=[
        (zweistufig(SPIELER, BANK, "Spieler", "Bank", col_a=SV.GREEN, col_b=SV.INK,
                    label="Baumdiagramm: erst Spieler mit 3, 3, 6, 6, 6, 6, dann Bank mit 2, 2, 4, 4, 9, 9"),
         "Teil a) und b): erst Spieler, dann Bank"),
        (zweistufig(SPIELER, FAIR, "Spieler", "Bank", col_a=SV.GREEN, col_b=SV.INK,
                    label="Baumdiagramm: erst Spieler, dann Bank mit 2, 4, 4, 4, 9, 9"),
         "Teil c): eine 2 der Bank wird zur 4, jeder gewinnt mit 9/18 = 1/2")])

# -------------------------------------------------------------- AFB III ----
s.task("Kopfrechnen mit binomischen Formeln", 3,
       r"Manche Leute rechnen $59 \cdot 61$ oder $65^2$ im Kopf schneller aus als andere mit dem Taschenrechner. Dahinter stecken die binomischen Formeln.",
       [r"Berechne ohne Rechner $19 \cdot 21$, $29 \cdot 31$ und $59 \cdot 61$. Schreibe jeweils dazu, welche binomische Formel du nutzt.",
        r"Begründe allgemein: Das Produkt der beiden Zahlen, die um $1$ kleiner und um $1$ größer sind als $n$, ist immer um $1$ kleiner als $n^2$.",
        r"Übertrage den Trick auf zwei Zahlen, die sich um $6$ unterscheiden. Berechne $47 \cdot 53$ und $97 \cdot 103$ im Kopf und begründe allgemein.",
        r"Für Quadrate von Zahlen mit der Endziffer $5$ gibt es eine Regel: die Zehnerzahl $a$ mit ihrem Nachfolger $a + 1$ malnehmen und $25$ anhängen. Beispiel $35^2$: $3 \cdot 4 = 12$, also $1225$. Prüfe die Regel an $65^2$ und begründe sie allgemein mit $(10a + 5)^2$."],
       solution=[
        r"Dritte binomische Formel $(a+b)(a-b) = a^2 - b^2$: $19 \cdot 21 = (20 - 1)(20 + 1) = 400 - 1 = 399$, $29 \cdot 31 = 900 - 1 = 899$ und $59 \cdot 61 = 3600 - 1 = 3599$.",
        r"Die beiden Zahlen sind $n - 1$ und $n + 1$. Mit der dritten binomischen Formel: $(n - 1)(n + 1) = n^2 - 1^2 = n^2 - 1$. Das gilt für jedes $n$, also ist das Produkt immer um $1$ kleiner als $n^2$. Die Beispiele aus a) zeigen das nur für drei einzelne Fälle.",
        r"Die Zahlen liegen je $3$ unter und über ihrer Mitte $n$: $(n - 3)(n + 3) = n^2 - 3^2 = n^2 - 9$. Also $47 \cdot 53 = 50^2 - 9 = 2491$ und $97 \cdot 103 = 100^2 - 9 = 9991$. Allgemein gilt für den Abstand $2k$: $(n - k)(n + k) = n^2 - k^2$.",
        r"$65^2$: $6 \cdot 7 = 42$, also $4225$, und tatsächlich ist $65 \cdot 65 = 4225$. Allgemein mit der ersten binomischen Formel: $(10a + 5)^2 = 100a^2 + 2 \cdot 10a \cdot 5 + 25 = 100a^2 + 100a + 25 = 100 \cdot a(a + 1) + 25$. Das Produkt $a(a + 1)$ steht vor den Hundertern, dahinter die $25$."],
       falle=r"Falle: „Ich habe es an drei Zahlen ausprobiert, also stimmt es immer.“ Beispiele sind keine Begründung. Allgemein heißt: mit Variablen rechnen und die verwendete Formel nennen.")


# ---------------------------------------------------------- numbers check ----
def check():
    # AFB I: 30/v = 45/(v+10)
    v = F(300, 15)
    assert v == 20 and 30 * (v + 10) == 45 * v and F(30, 20) == F(45, 30) == F(3, 2)
    assert v + 10 == 30 and F(30, 20) == 1 + F(1, 2)
    assert abs(20 / 30 - 0.667) < 0.0005 and abs(1 - 20 / 30 - 0.333) < 0.0005
    # AFB II: dice duel
    sp, bk = dict(faces(SPIELER)), dict(faces(BANK))
    assert sp[3] == F(1, 3) and sp[6] == F(2, 3) and all(p == F(1, 3) for p in bk.values())
    assert sp[3] * bk[2] == F(1, 9) and sp[6] * bk[2] == F(2, 9) and 3 * F(1, 9) + 3 * F(2, 9) == 1
    assert spiel(SPIELER, BANK) == (F(5, 9), F(4, 9), 0) and abs(float(F(5, 9)) - 0.556) < 0.0005
    assert paare(SPIELER, BANK) == (20, 16, 0)
    fb = dict(faces(FAIR))
    assert fb[2] == F(1, 6) and fb[4] == F(1, 2) and fb[9] == F(1, 3)
    assert sp[3] * fb[2] == F(1, 18) and sp[6] * fb[2] == F(2, 18) and sp[6] * fb[4] == F(6, 18)
    assert spiel(SPIELER, FAIR) == (F(1, 2), F(1, 2), 0) and paare(SPIELER, FAIR) == (18, 18, 0)
    assert spiel(SPIELER, [2, 5, 4, 4, 9, 9]) == (F(1, 2), F(1, 2), 0)
    # every fair one-face change of the bank puts a 4 or 5 on a 2
    for i in range(6):
        for x in range(0, 13):
            d = BANK[:]; d[i] = x
            if spiel(SPIELER, d) == (F(1, 2), F(1, 2), 0):
                assert BANK[i] == 2 and x in (4, 5)
    rb = dict(faces(REMIS))
    assert sp[3] * rb[3] == F(1, 18)
    assert spiel(SPIELER, REMIS) == (F(1, 2), F(4, 9), F(1, 18))
    assert sp[3] * rb[2] == F(1, 18) and sp[6] * rb[2] == F(2, 18) and sp[6] * rb[3] == F(2, 18) and sp[6] * rb[4] == F(4, 18)
    assert sp[3] * rb[4] == F(2, 18) and sp[3] * rb[9] == F(2, 18) and sp[6] * rb[9] == F(4, 18)
    # AFB III: binomial formulas
    assert 19 * 21 == 399 and 29 * 31 == 899 and 59 * 61 == 3599 == 60**2 - 1
    assert 47 * 53 == 2491 == 50**2 - 9 and 97 * 103 == 9991 == 100**2 - 9
    assert 35**2 == 1225 and 65**2 == 4225 and 6 * 7 == 42
    assert all((10 * a + 5) ** 2 == 100 * a * (a + 1) + 25 for a in range(0, 30))
    assert all((n - 1) * (n + 1) == n * n - 1 for n in range(-30, 31))


s.verify(check)
s.save()
