#!/usr/bin/env python3
"""Abitur-Training BGY - Lineare Algebra (Wahlpflicht 2, Pflichtaufgabe 2).

    python3 tools/aufgaben/abi/matrizen.py

Materialverflechtung the way the originals do it: two production steps, a Gozinto graph,
cost and contribution-margin vectors, and a stock that does not add up. Wording, numbers
and figures are our own.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

# Rohstoff -> Zwischenprodukt -> Endprodukt
MRZ = [[2, 1], [3, 4], [1, 2]]        # R1..R3 je ME von Z1, Z2
MZE = [[2, 1], [1, 3]]                # Z1, Z2 je ME von E1, E2
KR, KZ, KE = [4, 2, 6], [12, 18], [25, 40]
PREIS = [180, 260]
PLAN = [20, 30]
FIX = 2500
LAGER = [250, 700, 300]


def mat(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))]
            for i in range(len(A))]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(len(v))) for i in range(len(A))]


def vm(v, A):
    return [sum(v[k] * A[k][j] for k in range(len(v))) for j in range(len(A[0]))]


MRE = mat(MRZ, MZE)
KV = [vm(KR, MRE)[j] + vm(KZ, MZE)[j] + KE[j] for j in range(2)]
DECK = [PREIS[j] - KV[j] for j in range(2)]


# ----------------------------------------------------------------- figures ---
def fig_gozinto():
    d = S.Diagram(560, 330)
    ys = (46, 165, 284)
    rx, zx, ex = 78, 280, 482
    R = [(rx, 46 + i * 100) for i in range(3)]
    Z = [(zx, 96), (zx, 216)]
    E = [(ex, 96), (ex, 216)]
    for (x, y), name in zip(R, ("R₁", "R₂", "R₃")):
        d.box(x, y, 58, 40, name, fill="#EEF2F8")
    for (x, y), name in zip(Z, ("Z₁", "Z₂")):
        d.box(x, y, 58, 40, name, fill="#FCF3D8")
    for (x, y), name in zip(E, ("E₁", "E₂")):
        d.box(x, y, 58, 40, name, fill="#EAF1DC")
    for i in range(3):
        for j in range(2):
            d.link(R[i], Z[j], str(MRZ[i][j]), S.MUTED, 1.1,
                   off=(0, -6 if j == 0 else 13), shorten=32, t=0.34 if j == 0 else 0.5)
    for i in range(2):
        for j in range(2):
            # the two crossing arrows carry their label at different heights
            d.link(Z[i], E[j], str(MZE[i][j]), S.MUTED, 1.1,
                   off=(0, -6 if i == j else 13), shorten=32,
                   t=0.5 if i == j else (0.3 if i == 0 else 0.7))
    d.text(rx, 18, "Rohstoffe", 12, S.INK)
    d.text(zx, 18, "Zwischenprodukte", 12, S.INK)
    d.text(ex, 18, "Endprodukte", 12, S.INK)
    d.text(zx, 318, "Zahlen an den Pfeilen: Bedarf in ME", 11.5, S.MUTED)
    assert ys                                             # keeps the layout numbers honest
    return d.svg("Verflechtungsdiagramm mit drei Rohstoffen, zwei Zwischen- und zwei Endprodukten")


def fig_lager():
    """Bedarf gegen Bestand - three pairs of bars, so the mismatch is visible before it is
    calculated."""
    p = S.Plot((-0.9, 3.4), (0, 900), w=470, h=280, pad=(52, 22, 24, 40))
    p.axes(1, 200, xlabel="", ylabel="ME", xticks=False, ydec=0)
    need = mv(MRE, [10, 40])
    for i in range(3):
        u = i + 0.5
        for k, (val, col) in enumerate(((LAGER[i], S.MUTED), (need[i], S.ORANGE))):
            x1, x2 = p.X(u - 0.34 + k * 0.34), p.X(u - 0.34 + (k + 1) * 0.34)
            p.rect(x1, p.Y(val), x2 - x1, p.Y(0) - p.Y(val), fill=col,
                   stroke=S.PAPER, width=1, opacity=0.75 if k == 0 else 1)
            p.text((x1 + x2) / 2.0, p.Y(val) - 6, str(val), 11.5, S.INK)
        p.text(p.X(u), p.Y(0) + 18, ("R₁", "R₂", "R₃")[i], 13, S.INK, italic=True)
    p.rect(p.X(1.9), p.Y(870), 14, 12, fill=S.MUTED, opacity=0.75)
    p.text(p.X(1.9) + 20, p.Y(870) + 11, "Lagerbestand", 11.5, S.BODY, "start")
    p.rect(p.X(1.9), p.Y(790), 14, 12, fill=S.ORANGE)
    p.text(p.X(1.9) + 20, p.Y(790) + 11, "Bedarf fuer 10 und 40 Stueck", 11.5, S.BODY, "start")
    return p.svg("Balkenvergleich von Lagerbestand und Bedarf fuer die drei Rohstoffe")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-matrizen", "Lineare Algebra",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Wahlpflicht 2 · Pflichtaufgabe 2 · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Lineare Algebra: Materialverflechtung, "
               "Kosten und Deckungsbeitrag, überbestimmtes LGS — mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

BETRIEB = (r"Ein Betrieb stellt aus den Rohstoffen $R_1$, $R_2$ und $R_3$ zunächst die "
           r"Zwischenprodukte $Z_1$ und $Z_2$ her und daraus die Endprodukte $E_1$ und "
           r"$E_2$. Der Bedarf in Mengeneinheiten (ME) steht im Verflechtungsdiagramm.")

s.task(
    "Vom Rohstoff zum Endprodukt", 1,
    BETRIEB,
    [
        r"Geben Sie die Matrizen $M_{RZ}$ und $M_{ZE}$ an.",
        r"Berechnen Sie die Gesamtproduktionsmatrix $M_{RE}$.",
        r"Der Betrieb plant $20$ Stück von $E_1$ und $30$ Stück von $E_2$. "
        r"Bestimmen Sie den Bedarf an Zwischenprodukten und an Rohstoffen.",
        r"Beschreiben Sie die Bedeutung des Elements $re_{22}$ von $M_{RE}$ im "
        r"Sachzusammenhang.",
    ],
    [
        r"Spalten sind die Zwischen- bzw. Endprodukte, Zeilen die Rohstoffe bzw. "
        r"Zwischenprodukte: "
        r"$M_{RZ} = \begin{pmatrix}2 & 1\\3 & 4\\1 & 2\end{pmatrix}$ und "
        r"$M_{ZE} = \begin{pmatrix}2 & 1\\1 & 3\end{pmatrix}$.",
        r"$M_{RE} = M_{RZ} \cdot M_{ZE} = "
        r"\begin{pmatrix}2 & 1\\3 & 4\\1 & 2\end{pmatrix} \cdot "
        r"\begin{pmatrix}2 & 1\\1 & 3\end{pmatrix} = "
        r"\begin{pmatrix}5 & 5\\10 & 15\\4 & 7\end{pmatrix}$. "
        r"Zeile 1 zum Beispiel: $2 \cdot 2 + 1 \cdot 1 = 5$ und $2 \cdot 1 + 1 \cdot 3 = 5$.",
        r"Mit $\vec{p} = \begin{pmatrix}20\\30\end{pmatrix}$ ist "
        r"$\vec{z} = M_{ZE} \cdot \vec{p} = \begin{pmatrix}70\\110\end{pmatrix}$ und "
        r"$\vec{r} = M_{RE} \cdot \vec{p} = \begin{pmatrix}250\\650\\290\end{pmatrix}$. "
        r"Probe über den Umweg: $M_{RZ} \cdot \vec{z}$ ergibt denselben Vektor.",
        r"Das Element hat den Wert $15$: Für **eine** Mengeneinheit des Endprodukts $E_2$ "
        r"werden insgesamt $15$ ME des Rohstoffs $R_2$ gebraucht — über beide "
        r"Produktionsschritte zusammen.",
    ],
    falle=r"Die Reihenfolge im Produkt ist nicht beliebig: $M_{RZ} \cdot M_{ZE}$ ist "
          r"definiert (Spaltenzahl $2$ trifft Zeilenzahl $2$), $M_{ZE} \cdot M_{RZ}$ dagegen "
          r"nicht. Wer die Faktoren vertauscht, merkt es an den Formaten.",
    figs=[(fig_gozinto(),
           "Verflechtungsdiagramm (Gozinto-Graph) der beiden Produktionsschritte.")],
)

s.task(
    "Was der Betrieb verdient", 2,
    r"Die Rohstoffe kosten $4$, $2$ und $6$ Euro je ME. Die Fertigung der Zwischenprodukte "
    r"kostet $12$ Euro ($Z_1$) beziehungsweise $18$ Euro ($Z_2$) je ME, die der Endprodukte "
    r"$25$ Euro ($E_1$) beziehungsweise $40$ Euro ($E_2$) je Stück. Verkauft werden $E_1$ "
    r"für $180$ Euro und $E_2$ für $260$ Euro. Die Fixkosten betragen $2\,500$ Euro.",
    [
        r"Bestimmen Sie den Vektor $\vec{k}_v$ der variablen Kosten je Stück.",
        r"Berechnen Sie den Deckungsbeitrag je Stück für beide Endprodukte.",
        r"Bestimmen Sie den Gewinn bei der Produktion von $20$ Stück $E_1$ und $30$ Stück "
        r"$E_2$.",
        r"Beurteilen Sie: „$E_2$ bringt je Stück den höheren Deckungsbeitrag, also sollte "
        r"der Betrieb nur noch $E_2$ herstellen.“",
    ],
    [
        r"$\vec{k}_v = \vec{k}_R \cdot M_{RE} + \vec{k}_Z \cdot M_{ZE} + \vec{k}_E$ "
        r"(alle drei als Zeilenvektoren). "
        r"$\vec{k}_R \cdot M_{RE} = (4\;\;2\;\;6) \cdot "
        r"\begin{pmatrix}5 & 5\\10 & 15\\4 & 7\end{pmatrix} = (64\;\;92)$, "
        r"$\vec{k}_Z \cdot M_{ZE} = (12\;\;18) \cdot "
        r"\begin{pmatrix}2 & 1\\1 & 3\end{pmatrix} = (42\;\;66)$. "
        r"Zusammen mit $\vec{k}_E = (25\;\;40)$: "
        r"$\vec{k}_v = (131\;\;198)$ Euro je Stück.",
        r"$\vec{d} = \vec{v} - \vec{k}_v = (180\;\;260) - (131\;\;198) = (49\;\;62)$. "
        r"$E_1$ trägt $49$ Euro bei, $E_2$ trägt $62$ Euro bei.",
        r"$D = \vec{d} \cdot \vec{p} = 49 \cdot 20 + 62 \cdot 30 = 980 + 1\,860 = 2\,840$ "
        r"Euro Deckungsbeitrag. Abzüglich der Fixkosten: "
        r"$G = 2\,840 - 2\,500 = 340$ Euro Gewinn.",
        r"So einfach ist es **nicht**. Der Deckungsbeitrag je Stück sagt nichts darüber, "
        r"wie viele Stücke sich verkaufen lassen und welche Rohstoffe dafür reichen. "
        r"$E_2$ verbraucht je Stück deutlich mehr $R_2$ ($15$ statt $10$ ME) — bei "
        r"knappem $R_2$ ist der Deckungsbeitrag **je ME des Engpassrohstoffs** "
        r"entscheidend, und der ist bei $E_1$ mit $\tfrac{49}{10} = 4{,}9$ höher als bei "
        r"$E_2$ mit $\tfrac{62}{15} \approx 4{,}13$.",
    ],
    falle=r"Die Rohstoffkosten dürfen **nicht** über $M_{RZ}$ allein laufen. Gebraucht wird "
          r"$M_{RE}$, sonst fehlt der zweite Produktionsschritt.",
)

s.task(
    "Das Lager geht nicht auf", 3,
    r"Im Lager liegen $250$ ME von $R_1$, $700$ ME von $R_2$ und $300$ ME von $R_3$. "
    r"Die Produktion soll so geplant werden, dass alle drei Bestände vollständig "
    r"aufgebraucht werden. Gesucht sind die Stückzahlen $x$ von $E_1$ und $y$ von $E_2$.",
    [
        r"Stellen Sie das zugehörige lineare Gleichungssystem auf.",
        r"Zeigen Sie, dass dieses Gleichungssystem keine Lösung besitzt.",
        r"Bestimmen Sie, welche Menge von $R_3$ im Lager liegen müsste, damit der Plan "
        r"aufgeht, und geben Sie die zugehörigen Stückzahlen an.",
        r"Beurteilen Sie die Aussage: „Ein lineares Gleichungssystem mit mehr Gleichungen "
        r"als Unbekannten hat nie eine Lösung.“",
    ],
    [
        r"$M_{RE} \cdot \begin{pmatrix}x\\y\end{pmatrix} = "
        r"\begin{pmatrix}250\\700\\300\end{pmatrix}$, ausgeschrieben "
        r"$5x + 5y = 250$, $\;10x + 15y = 700$, $\;4x + 7y = 300$.",
        r"Aus der ersten Gleichung folgt $x + y = 50$, aus der zweiten $2x + 3y = 140$. "
        r"Einsetzen von $x = 50 - y$ liefert $100 + y = 140$, also $y = 40$ und $x = 10$. "
        r"Die dritte Gleichung ist damit aber **nicht** erfüllt: "
        r"$4 \cdot 10 + 7 \cdot 40 = 320 \neq 300$. Das System ist überbestimmt und "
        r"widersprüchlich — es gibt keine Lösung.",
        r"Nötig wären $320$ ME von $R_3$. Dann ist $x = 10$ und $y = 40$ die Lösung aller "
        r"drei Gleichungen. Mit dem tatsächlichen Bestand von $300$ ME fehlen also "
        r"$20$ ME von $R_3$.",
        r"Die Aussage ist **falsch**. Mehr Gleichungen als Unbekannte heißt nur, dass das "
        r"System überbestimmt ist; ob es lösbar ist, hängt davon ab, ob die zusätzlichen "
        r"Gleichungen zum Rest passen. Genau das zeigt Teil c): mit $300$ auf der rechten "
        r"Seite gibt es keine Lösung, mit $320$ gibt es genau eine.",
    ],
    falle=r"Wer nur zwei der drei Gleichungen löst, bekommt $x = 10$ und $y = 40$ und hält "
          r"das für die Antwort. Bei einem überbestimmten System gehört die **Probe in der "
          r"übrigen Gleichung** zur Lösung dazu.",
    figs=[(fig_lager(),
           "Lagerbestand und tatsächlicher Bedarf für 10 Stück E₁ und 40 Stück E₂. "
           "Bei R₃ passt es nicht.")],
)


def check():
    assert MRE == [[5, 5], [10, 15], [4, 7]], MRE
    assert mv(MZE, PLAN) == [70, 110]
    assert mv(MRE, PLAN) == [250, 650, 290]
    assert mv(MRZ, mv(MZE, PLAN)) == mv(MRE, PLAN), "beide Wege muessen dasselbe liefern"
    assert MRE[1][1] == 15
    assert vm(KR, MRE) == [64, 92] and vm(KZ, MZE) == [42, 66]
    assert KV == [131, 198], KV
    assert DECK == [49, 62]
    assert sum(DECK[i] * PLAN[i] for i in range(2)) == 2840
    assert sum(DECK[i] * PLAN[i] for i in range(2)) - FIX == 340
    assert DECK[0] / float(MRE[1][0]) > DECK[1] / float(MRE[1][1]), "Engpassrechnung stimmt nicht"
    assert abs(DECK[0] / float(MRE[1][0]) - 4.9) < 1e-9
    assert abs(DECK[1] / float(MRE[1][1]) - 4.1333) < 1e-4
    # das ueberbestimmte System
    x, y = 10, 40
    assert 5 * x + 5 * y == LAGER[0] and 10 * x + 15 * y == LAGER[1]
    assert 4 * x + 7 * y == 320 != LAGER[2]
    assert mv(MRE, [x, y]) == [250, 700, 320]


s.verify(check)
s.save()
