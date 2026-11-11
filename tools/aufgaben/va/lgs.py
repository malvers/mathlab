#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 (Sachsen) - Lineare Gleichungssysteme
(Teil B, mit MMS).

    python3 tools/aufgaben/va/lgs.py

B3 of the Vergleichsarbeit regularly starts with a 2x2 system read from a text (two kinds
of tickets, number and takings). Lernbereich 4 adds the Gauss method for 3x3 systems and
the question when a system is solvable at all. Wording, numbers and every figure are our
own.
"""
import os
import sys
from fractions import Fraction as Fr

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ---------------------------------------------------- Aufgabe 1: Raddampfer ----
GAESTE, P_ERW, P_KIND, KASSE = 312, 18, 9, 4914
ERW, KIND = 234, 78
ABEND_GAESTE, ABEND_KASSE = 250, 3960
P_KIND_ABEND = P_KIND * Fr(4, 5)                 # 20 % off
ABEND_ERW, ABEND_KIND = 200, 50

# ------------------------------------------------- Aufgabe 2: Futtermischung ---
# rows: Eiweiss, Fett, Ballaststoffe (g per kg); columns: Sorte A, B, C
NAEHR = [[200, 100, 300],
         [50, 100, 50],
         [100, 200, 50]]
BEDARF = [1900, 550, 950]
PREIS_KG = [Fr(12, 5), Fr(9, 5), Fr(3)]          # 2,40 / 1,80 / 3,00 Euro per kg
MISCHUNG = (4, 2, 3)
BEDARF_NEU = [1900, 550, 1100]
MISCHUNG_NEU = (9, 1, 0)

# --------------------------------------------------- Aufgabe 3: Fahrradverleih --
RAEDER, P_CITY, P_EBIKE, P_LAST, UMSATZ, PLAETZE = 60, 12, 30, 40, 1440, 78
FLOTTEN = [(25, 26, 9), (30, 12, 18)]            # all three kinds present


def gauss(rows):
    """Exact Gauss-Jordan on an augmented matrix; returns the unique solution or None."""
    m = [[Fr(v) for v in r] for r in rows]
    n = len(m)
    for c in range(n):
        piv = next((r for r in range(c, n) if m[r][c] != 0), None)
        if piv is None:
            return None
        m[c], m[piv] = m[piv], m[c]
        m[c] = [v / m[c][c] for v in m[c]]
        for r in range(n):
            if r != c and m[r][c] != 0:
                m[r] = [a - m[r][c] * b for a, b in zip(m[r], m[c])]
    return tuple(r[-1] for r in m)


def futter(bedarf):
    return gauss([NAEHR[i] + [bedarf[i]] for i in range(3)])


# ----------------------------------------------------------------- figures ---
def fig_geraden():
    p = S.Plot((-28, 345), (-55, 610), w=460, h=380, pad=(44, 26, 18, 34))
    p.grid(25, 50)
    p.axes(50, 100, xlabel="e", ylabel="k", defer_labels=True)
    p.curve(lambda e: GAESTE - e, -28, 345, S.GREEN, 2.0)
    p.curve(lambda e: (KASSE - P_ERW * e) / P_KIND, -28, 345, S.RED, 2.0)
    p.dashto(ERW, KIND)
    p.draw_labels()
    p.point(ERW, KIND, "L(234 | 78)", "above-right", color=S.INK, size=3.6)
    p.text(p.X(30), p.Y(318), "e + k = 312", 12, S.GREEN, "start", halo=S.PAPER)
    p.text(p.X(84), p.Y(470), "18e + 9k = 4914", 12, S.RED, "start", halo=S.PAPER)
    return p.svg("Die beiden Geraden des Gleichungssystems schneiden sich im Punkt (234|78): "
                 "234 Erwachsene und 78 Kinder")


def fig_tabelle():
    """Drawn cell by cell: the first column is wider, so the type can stay large
    enough to read when the table shrinks to a 390 px phone."""
    cells = [["je kg", "Sorte A", "Sorte B", "Sorte C", "Bedarf"],
             ["Eiweiß"] + [str(v) for v in NAEHR[0]] + [str(BEDARF[0])],
             ["Fett"] + [str(v) for v in NAEHR[1]] + [str(BEDARF[1])],
             ["Ballaststoffe"] + [str(v) for v in NAEHR[2]] + [str(BEDARF[2])]]
    widths, ch, x0, y0 = [118, 74, 74, 74, 74], 36, 8, 8
    d = S.Diagram(sum(widths) + 2 * x0, 4 * ch + y0 + 30)
    for r, row in enumerate(cells):
        x = x0
        for c, text in enumerate(row):
            head = r == 0 or c == 0
            d.rect(x, y0 + r * ch, widths[c], ch, fill="#EEF2F8" if head else S.PAPER,
                   stroke=S.INK, width=1.0)
            d.text(x + widths[c] / 2.0, y0 + r * ch + ch / 2.0, text, 15,
                   S.INK if head else S.BODY, italic=head, baseline="middle",
                   tex=not head)
            x += widths[c]
    d.text(d.w / 2.0, d.h - 8, "Angaben in Gramm, Bedarf je Tag", 12.5, S.MUTED)
    return d.svg("Tabelle: Eiweiss, Fett und Ballaststoffe in Gramm je Kilogramm der Sorten "
                 "A, B und C und der Tagesbedarf der Tiergruppe")


def fig_flotte():
    p = S.Plot((-2.5, 31), (-6, 47), w=470, h=290, pad=(44, 58, 18, 34))
    p.grid(3, 2)
    p.axes(3, 10, xlabel="z", ylabel="y", defer_labels=True)
    p.curve(lambda z: 40 - 14 * z / 9.0, -2.5, 31, S.MUTED, 1.6)
    p.draw_labels()
    for z, y, x in ((0, 40, 20), (9, 26, 25), (18, 12, 30)):
        p.point(z, y, None, color=S.RED if z else S.MUTED, size=4.4 if z else 3.6)
    p.text(p.X(9) + 9, p.Y(26) - 4, "(25 | 26 | 9)", 12, S.INK, "start", halo=S.PAPER)
    p.text(p.X(18) - 9, p.Y(12) + 4, "(30 | 12 | 18)", 12, S.INK, "end", halo=S.PAPER)
    p.text(p.X(0) + 9, p.Y(40) - 4, "(20 | 40 | 0)  ohne Lastenräder", 11.5, S.MUTED,
           "start", halo=S.PAPER)
    p.text(p.X(21.5), p.Y(9.5), "9y + 14z = 360", 12, S.MUTED, "start", halo=S.PAPER)
    return p.svg("Alle Loesungen liegen auf der Geraden 9y + 14z = 360; nur drei Punkte haben "
                 "ganzzahlige, nicht negative Koordinaten, zwei davon mit Lastenraedern")


# ------------------------------------------------------------------- sheet ---
s = Sheet("va-bgy11-lgs", "Lineare Gleichungssysteme",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil B · "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Vergleichsarbeit-Training Mathematik, Berufliches Gymnasium Klasse 11: "
               "Fahrkarten für den Raddampfer als 2×2-System, eine Futtermischung im Zoo "
               "Leipzig mit dem Gauß-Verfahren, ein Fahrradverleih mit Parameter und "
               "Lösbarkeit, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Mit dem Raddampfer nach Pillnitz", 1,
    r"Bei einer Nachmittagsfahrt eines Raddampfers von Dresden nach Pillnitz waren $312$ "
    r"Fahrgäste an Bord. Eine Fahrkarte kostet für Erwachsene $18$ €, für Kinder $9$ €. "
    r"Insgesamt wurden $4\,914$ € eingenommen.",
    [
        r"Stellen Sie ein lineares Gleichungssystem auf, mit dem sich die Anzahl der "
        r"Erwachsenen und die Anzahl der Kinder bestimmen lassen.",
        r"Lösen Sie das Gleichungssystem und führen Sie eine Probe durch.",
        r"Berechnen Sie, wie viel Prozent der Fahrgäste Kinder waren und wie viel Prozent "
        r"der Einnahmen auf Kinderkarten entfielen.",
        r"Auf der Abendfahrt ist der Kinderpreis um $20\ \%$ ermäßigt. Bei $250$ Fahrgästen "
        r"werden $3\,960$ € eingenommen. Bestimmen Sie die Anzahl der Kinder auf der "
        r"Abendfahrt.",
    ],
    [
        r"Mit $e$ für die Anzahl der Erwachsenen und $k$ für die Anzahl der Kinder: "
        r"Anzahl $e + k = 312$, Einnahmen in Euro $18e + 9k = 4\,914$.",

        r"Aus der ersten Gleichung folgt $k = 312 - e$. Eingesetzt: "
        r"$18e + 9 \cdot (312 - e) = 4\,914$, also $9e + 2\,808 = 4\,914$, $9e = 2\,106$ "
        r"und $e = 234$. Dann ist $k = 312 - 234 = 78$. Probe: $234 + 78 = 312$ und "
        r"$18 \cdot 234 + 9 \cdot 78 = 4\,212 + 702 = 4\,914$. An Bord waren $234$ "
        r"Erwachsene und $78$ Kinder.",

        r"Anteil der Kinder an den Fahrgästen: $\frac{78}{312} = 0{,}25 = 25\ \%$. "
        r"Kinderkarten brachten $78 \cdot 9 = 702$ €, das sind "
        r"$\frac{702}{4\,914} = \frac{1}{7} \approx 14{,}3\ \%$ der Einnahmen. Ein Viertel "
        r"der Fahrgäste bringt nur ein Siebtel der Einnahmen, weil Kinder den halben Preis "
        r"zahlen.",

        r"Ermäßigter Kinderpreis: $9 \cdot 0{,}8 = 7{,}20$ €. Das System lautet "
        r"$e + k = 250$ und $18e + 7{,}2k = 3\,960$. Mit $e = 250 - k$ folgt "
        r"$4\,500 - 18k + 7{,}2k = 3\,960$, also $10{,}8k = 540$ und $k = 50$. Auf der "
        r"Abendfahrt waren $50$ Kinder und $200$ Erwachsene. Probe: "
        r"$18 \cdot 200 + 7{,}2 \cdot 50 = 3\,600 + 360 = 3\,960$.",
    ],
    falle=r"Ein um $20\ \%$ ermäßigter Preis ist $80\ \%$ des alten Preises, also "
          r"$7{,}20$ € und nicht $1{,}80$ €. In der Einnahmengleichung stehen die Preise "
          r"als Faktoren vor den Anzahlen.",
    solfigs=[(fig_geraden(),
              "Zu b): Jede Gleichung ist eine Gerade, die Lösung ist ihr Schnittpunkt.")],
)

s.task(
    "Futter im Zoo Leipzig", 2,
    r"In der Futterküche des Zoos Leipzig wird für eine Tiergruppe täglich eine Mischung "
    r"aus drei Futtersorten $A$, $B$ und $C$ zusammengestellt. Die Tabelle gibt an, wie "
    r"viel Gramm Eiweiß, Fett und Ballaststoffe ein Kilogramm jeder Sorte enthält und wie "
    r"viel die Gruppe davon pro Tag bekommen soll.",
    [
        r"Stellen Sie ein lineares Gleichungssystem für die Mengen $x$, $y$ und $z$ (in kg) "
        r"der Sorten $A$, $B$ und $C$ auf.",
        r"Lösen Sie das Gleichungssystem mit dem Gauß-Verfahren.",
        r"Ein Kilogramm von Sorte $A$ kostet $2{,}40$ €, von Sorte $B$ kostet es "
        r"$1{,}80$ € und von Sorte $C$ kostet es $3{,}00$ €. Berechnen Sie die Futterkosten "
        r"pro Tag und für ein Jahr mit $365$ Tagen.",
        r"Die Tierärztin empfiehlt bei gleichem Eiweiß- und Fettgehalt $1\,100$ g "
        r"Ballaststoffe pro Tag. Ermitteln Sie die neue Mischung und deuten Sie das "
        r"Ergebnis.",
    ],
    [
        r"Jede Spalte der Tabelle gehört zu einer Sorte, jede Zeile zu einem Nährstoff. "
        r"Eiweiß: $200x + 100y + 300z = 1\,900$, Fett: $50x + 100y + 50z = 550$, "
        r"Ballaststoffe: $100x + 200y + 50z = 950$.",

        r"Die Eiweißgleichung durch $100$ teilen, die beiden anderen durch $50$, und die "
        r"Fettgleichung nach oben stellen: I: $x + 2y + z = 11$, II: $2x + 4y + z = 19$, "
        r"III: $2x + y + 3z = 19$. Zeile II minus $2 \cdot$ Zeile I und Zeile III minus "
        r"$2 \cdot$ Zeile I, danach II und III tauschen, ergibt die Dreiecksform "
        r"$\left(\begin{array}{ccc|c} 1 & 2 & 1 & 11 \\ 0 & -3 & 1 & -3 \\ 0 & 0 & -1 & -3 "
        r"\end{array}\right)$. Rückwärts eingesetzt: $z = 3$, aus $-3y + 3 = -3$ folgt "
        r"$y = 2$, aus $x + 4 + 3 = 11$ folgt $x = 4$. Die Mischung besteht aus $4$ kg von "
        r"$A$, $2$ kg von $B$ und $3$ kg von $C$. Probe Eiweiß: "
        r"$800 + 200 + 900 = 1\,900$.",

        r"$4 \cdot 2{,}40 + 2 \cdot 1{,}80 + 3 \cdot 3{,}00 = 9{,}60 + 3{,}60 + 9{,}00 = "
        r"22{,}20$. Das Futter kostet $22{,}20$ € pro Tag und "
        r"$22{,}20 \cdot 365 = 8\,103$ € im Jahr.",

        r"Nur die rechte Seite der Ballaststoffgleichung ändert sich: "
        r"$1\,100 : 50 = 22$. Dieselben Schritte liefern jetzt $-z = 0$, also $z = 0$, "
        r"dann $-3y = -3$, also $y = 1$, und $x = 11 - 2 = 9$. Neue Mischung: $9$ kg von "
        r"$A$ und $1$ kg von $B$, Sorte $C$ fällt weg. Probe: $1\,800 + 100 = 1\,900$ g "
        r"Eiweiß, $450 + 100 = 550$ g Fett, $900 + 200 = 1\,100$ g Ballaststoffe. Sorte "
        r"$C$ ist eiweißreich, aber arm an Ballaststoffen und wird durch $A$ ersetzt. Mehr "
        r"als $1\,100$ g Ballaststoffe sind mit diesen drei Sorten bei gleichem Eiweiß und "
        r"Fett nicht möglich, denn dann müsste $z$ negativ werden.",
    ],
    falle=r"Die Tabelle wird **spaltenweise** in die Gleichungen übertragen: Die Spalte von "
          r"Sorte $A$ liefert die Koeffizienten von $x$. Wer die Zeilen als Koeffizienten "
          r"einer Variablen liest, rechnet mit der falschen Matrix.",
    figs=[(fig_tabelle(),
           "Nährstoffe je Kilogramm Futter und Tagesbedarf der Tiergruppe.")],
)

s.task(
    "Der Fahrradverleih", 3,
    r"Ein Fahrradverleih in Dresden besitzt $60$ Räder: Cityräder, E-Bikes und "
    r"Lastenräder. Ein Cityrad kostet $12$ € pro Tag, ein E-Bike $30$ € und ein Lastenrad "
    r"$40$ €. An einem sonnigen Samstag waren alle Räder einen Tag lang ausgeliehen, die "
    r"Einnahmen betrugen $1\,440$ €. Die Anzahlen der Cityräder, E-Bikes und Lastenräder "
    r"werden mit $x$, $y$ und $z$ bezeichnet.",
    [
        r"Stellen Sie ein lineares Gleichungssystem auf und zeigen Sie, dass die Angaben die "
        r"Anzahlen nicht eindeutig festlegen. Geben Sie die Lösungsmenge in Abhängigkeit "
        r"von $z$ an.",
        r"Der Verleih hat Räder aller drei Arten. Ermitteln Sie alle Zusammensetzungen der "
        r"Flotte, die im Sachzusammenhang möglich sind.",
        r"Cityräder und E-Bikes brauchen je einen Stellplatz, ein Lastenrad braucht $k$ "
        r"Stellplätze mit $k > 0$. Insgesamt belegen die Räder $78$ Stellplätze. "
        r"Untersuchen Sie mit dem Gauß-Verfahren, für welche Werte von $k$ das erweiterte "
        r"Gleichungssystem keine, genau eine oder unendlich viele Lösungen hat.",
        r"Der Inhaber sagt: „Mit der Zahl der Stellplätze ist meine Flotte eindeutig "
        r"bestimmt.“ Beurteilen Sie diese Aussage.",
    ],
    [
        r"Anzahl: $x + y + z = 60$, Einnahmen: $12x + 30y + 40z = 1\,440$. Zieht man "
        r"die erste Gleichung, mit $12$ multipliziert, von der zweiten ab, bleibt "
        r"$18y + 28z = 720$, also "
        r"$9y + 14z = 360$. Zwei Gleichungen für drei Unbekannte: Eine Variable bleibt frei. "
        r"Mit $z = t$ ist $y = 40 - \frac{14}{9}t$ und $x = 60 - y - z = 20 + \frac{5}{9}t$, "
        r"also "
        r"$L = \left\{\left(20 + \frac{5}{9}t;\ 40 - \frac{14}{9}t;\ t\right) \mid "
        r"t \in \mathbb{R}\right\}$.",

        r"Anzahlen sind natürliche Zahlen. $y = 40 - \frac{14}{9}t$ ist nur ganzzahlig, wenn "
        r"$t$ durch $9$ teilbar ist. Für $t = 9$ ist $y = 26$ und $x = 25$, für $t = 18$ ist "
        r"$y = 12$ und $x = 30$; für $t = 27$ wäre $y = -2$. Mögliche Flotten: $25$ "
        r"Cityräder, $26$ E-Bikes und $9$ Lastenräder oder $30$ Cityräder, $12$ E-Bikes und "
        r"$18$ Lastenräder. Probe für die erste: "
        r"$25 \cdot 12 + 26 \cdot 30 + 9 \cdot 40 = 300 + 780 + 360 = 1\,440$.",

        r"Die dritte Gleichung ist $x + y + kz = 78$. Mit Zeile II minus $12 \cdot$ Zeile I "
        r"und Zeile III minus Zeile I wird die erweiterte Koeffizientenmatrix zu "
        r"$\left(\begin{array}{ccc|c} 1 & 1 & 1 & 60 \\ 0 & 18 & 28 & 720 \\ "
        r"0 & 0 & k - 1 & 18 \end{array}\right)$. Die letzte Zeile bedeutet "
        r"$(k - 1) \cdot z = 18$. Für $k = 1$ steht dort $0 = 18$: keine Lösung, denn dann "
        r"müssten es $78$ Räder sein und nicht $60$. Für $k \neq 1$ ist "
        r"$z = \frac{18}{k - 1}$, das System hat genau eine Lösung. Unendlich viele Lösungen "
        r"gibt es für kein $k$, weil die rechte Seite $18$ nicht null ist.",

        r"Rechnerisch gibt es für jedes $k \neq 1$ genau eine Lösung. Sie muss aber auch zu "
        r"b) passen, also muss $z = \frac{18}{k - 1}$ gleich $9$ oder $18$ sein. Für $k = 2$ "
        r"ist $z = 18$: $30$ Cityräder, $12$ E-Bikes und $18$ Lastenräder. Für $k = 3$ ist "
        r"$z = 9$: $25$ Cityräder, $26$ E-Bikes und $9$ Lastenräder. Jedes andere $k$ führt "
        r"auf keine mögliche Flotte. Die Aussage stimmt also nur, wenn bekannt ist, wie "
        r"viele Stellplätze ein Lastenrad braucht. Realistisch ist $k = 2$, denn ein "
        r"Lastenrad ist etwa doppelt so lang wie ein normales Rad.",
    ],
    falle=r"Ein System mit zwei Gleichungen und drei Unbekannten ist **nicht** unlösbar, es "
          r"hat unendlich viele Lösungen. Erst der Sachzusammenhang mit ganzen, nicht "
          r"negativen Anzahlen macht daraus wenige mögliche Flotten.",
    solfigs=[(fig_flotte(),
              "Zu b): Alle Lösungen liegen auf einer Geraden. Nur die roten Punkte sind "
              "Flotten mit allen drei Radarten, angegeben als (x | y | z).")],
)


def check():
    """Every number in the solutions, recomputed exactly."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert ERW + KIND == GAESTE and P_ERW * ERW + P_KIND * KIND == KASSE
    assert gauss([[1, 1, GAESTE], [P_ERW, P_KIND, KASSE]]) == (ERW, KIND)
    assert P_KIND * GAESTE == 2808 and KASSE - 2808 == 2106 and 2106 / 9 == ERW
    assert P_ERW * ERW == 4212 and P_KIND * KIND == 702 and 4212 + 702 == KASSE
    assert Fr(KIND, GAESTE) == Fr(1, 4)
    assert Fr(702, KASSE) == Fr(1, 7) and round(100 / 7, 1) == 14.3
    assert P_KIND_ABEND == Fr(36, 5)                           # 7,20 Euro
    assert gauss([[1, 1, ABEND_GAESTE], [P_ERW, P_KIND_ABEND, ABEND_KASSE]]) == \
        (ABEND_ERW, ABEND_KIND)
    assert P_ERW * ABEND_GAESTE == 4500 and P_ERW - P_KIND_ABEND == Fr(54, 5)  # 10,8
    assert 4500 - ABEND_KASSE == 540 and Fr(540) / Fr(54, 5) == ABEND_KIND
    assert P_ERW * 200 == 3600 and P_KIND_ABEND * 50 == 360 and 3600 + 360 == ABEND_KASSE
    assert P_KIND - P_KIND_ABEND == Fr(9, 5)                   # die Falle: nicht 1,80
    # the figure: both lines through (234 | 78)
    assert GAESTE - ERW == KIND and Fr(KASSE - P_ERW * ERW, P_KIND) == KIND
    # --- Aufgabe 2 -----------------------------------------------------------------
    assert futter(BEDARF) == MISCHUNG
    x, y, z = MISCHUNG
    assert [sum(NAEHR[i][j] * MISCHUNG[j] for j in range(3)) for i in range(3)] == BEDARF
    # the scaled rows (Fett, Ballaststoffe, Eiweiss) and the two elimination steps
    I = [Fr(v, 50) for v in NAEHR[1] + [BEDARF[1]]]
    II = [Fr(v, 50) for v in NAEHR[2] + [BEDARF[2]]]
    III = [Fr(v, 100) for v in NAEHR[0] + [BEDARF[0]]]
    assert I == [1, 2, 1, 11] and II == [2, 4, 1, 19] and III == [2, 1, 3, 19]
    assert [a - 2 * b for a, b in zip(II, I)] == [0, 0, -1, -3]
    assert [a - 2 * b for a, b in zip(III, I)] == [0, -3, 1, -3]
    assert z == 3 and -3 * y + z == -3 and x + 2 * y + z == 11 and 2 * y == 4
    assert 200 * x == 800 and 100 * y == 200 and 300 * z == 900
    kosten = sum(p * m for p, m in zip(PREIS_KG, MISCHUNG))
    assert kosten == Fr(111, 5)                                # 22,20 Euro
    assert [p * m for p, m in zip(PREIS_KG, MISCHUNG)] == [Fr(48, 5), Fr(18, 5), 9]
    assert kosten * 365 == 8103
    assert futter(BEDARF_NEU) == MISCHUNG_NEU and Fr(1100, 50) == 22
    xn, yn, zn = MISCHUNG_NEU
    assert 22 - 2 * 11 == 0 and 19 - 2 * 11 == -3 and xn == 11 - 2 * yn - zn
    assert (200 * xn, 100 * yn) == (1800, 100) and (50 * xn, 100 * yn) == (450, 100)
    assert (100 * xn, 200 * yn) == (900, 200)
    # more fibre than 1100 g: z turns negative, between 950 g and 1100 g all is fine
    for extra in range(0, 400, 10):
        sol = futter([1900, 550, 950 + extra])
        assert (min(sol) >= 0) == (extra <= 150), (extra, sol)
    # die Falle: the transposed matrix gives another (wrong) mixture
    trans = [[NAEHR[j][i] for j in range(3)] + [BEDARF[i]] for i in range(3)]
    assert gauss(trans) != MISCHUNG
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert P_EBIKE - 12 * 1 == 18 and P_LAST - 12 == 28 and UMSATZ - 12 * RAEDER == 720
    assert (18, 28, 720) == (9 * 2, 14 * 2, 360 * 2)
    for t in range(0, 30):
        tt = Fr(t)
        yy, xx = 40 - Fr(14, 9) * tt, 20 + Fr(5, 9) * tt
        assert xx + yy + tt == RAEDER and 12 * xx + 30 * yy + 40 * tt == UMSATZ
    fleets = [(x, y, z) for z in range(1, RAEDER + 1) for y in range(0, RAEDER + 1)
              for x in [RAEDER - y - z] if x >= 0 and y >= 1 and x >= 1
              and P_CITY * x + P_EBIKE * y + P_LAST * z == UMSATZ]
    assert fleets == FLOTTEN, fleets
    assert 40 - Fr(14, 9) * 27 == -2
    assert 20 + 40 + 0 == RAEDER and 12 * 20 + 30 * 40 == UMSATZ     # t = 0
    assert 25 * 12 == 300 and 26 * 30 == 780 and 9 * 40 == 360 and 300 + 780 + 360 == 1440
    # the third equation with k
    for k in [Fr(n, 4) for n in range(1, 41)]:
        rows = [[1, 1, 1, RAEDER], [P_CITY, P_EBIKE, P_LAST, UMSATZ], [1, 1, k, PLAETZE]]
        sol = gauss(rows)
        if k == 1:
            assert sol is None                               # 0 = 18
        else:
            assert sol is not None and sol[2] == Fr(18) / (k - 1)
            xs, ys, zs = sol
            assert xs + ys + k * zs == PLAETZE
    assert PLAETZE - RAEDER == 18
    real = [k for k in range(2, 100)
            if any(Fr(18, k - 1) == f[2] for f in FLOTTEN)]
    assert real == [2, 3]
    assert gauss([[1, 1, 1, 60], [12, 30, 40, 1440], [1, 1, 2, 78]]) == (30, 12, 18)
    assert gauss([[1, 1, 1, 60], [12, 30, 40, 1440], [1, 1, 3, 78]]) == (25, 26, 9)


s.verify(check)
s.save()
