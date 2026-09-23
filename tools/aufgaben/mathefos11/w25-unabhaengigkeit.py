#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 25 / KW 10 (LB 2): Multiplikationsregel und
stochastische Unabhaengigkeit zweier Ereignisse.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=25, slug='unabhaengigkeit', thema='Multiplikationsregel und Unabhängigkeit', lb='LB 2',
          blurb='Multiplikationsregel, Nachweis der stochastischen Unabhängigkeit, Abgrenzung zu unvereinbar',
          comment='Blocks: Multiplikationsregel (1-6), Unabhaengigkeit nachweisen (7-13), Abgrenzung unvereinbar gegen unabhaengig (14-16), Anwendungen (17-20).')

# ------------------------------------------------------- Multiplikationsregel ----
Q.q(r'Wie lautet die Multiplikationsregel für zwei unabhängige Ereignisse?',
    [r'$P(A \cap B) = P(A) \cdot P(B)$', r'$P(A \cap B) = P(A) + P(B)$',
     r'$P(A \cap B) = P(A) - P(B)$', r'$P(A \cap B) = \dfrac{P(A)}{P(B)}$'],
    [r'Unabhängig heißt: das Eintreten des einen ändert die Wahrscheinlichkeit des anderen nicht.',
     r'Dann multiplizieren sich die Wahrscheinlichkeiten.',
     r'Addiert wird dagegen bei der Vereinigung, nicht beim Durchschnitt.'])

Q.q(r'Zwei Münzen werden geworfen. Wie groß ist die Wahrscheinlichkeit, dass beide Kopf zeigen?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'$1$'],
    [r'Die Würfe sind unabhängig, jeder hat $P(\text{Kopf}) = \dfrac{1}{2}$.',
     r'$P = \dfrac{1}{2} \cdot \dfrac{1}{2} = \dfrac{1}{4}$',
     r'Probe durch Abzählen: von den vier Ergebnissen KK, KZ, ZK, ZZ ist eines günstig.'])

Q.q(r'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für zweimal Sechs?',
    [r'$\dfrac{1}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{6}$'],
    [r'$P = \dfrac{1}{6} \cdot \dfrac{1}{6}$',
     r'$= \dfrac{1}{36}$',
     r'$\dfrac{1}{12}$ wäre das Ergebnis der falschen Addition $\dfrac{1}{6} + \dfrac{1}{6}$ geteilt durch zwei.'])

Q.q(r'Ein Würfel und eine Münze werden geworfen. Wie groß ist die Wahrscheinlichkeit für „Sechs und Kopf“?',
    [r'$\dfrac{1}{12}$', r'$\dfrac{1}{8}$', r'$\dfrac{2}{3}$', r'$\dfrac{1}{6}$'],
    [r'Die beiden Versuche beeinflussen sich nicht.',
     r'$P = \dfrac{1}{6} \cdot \dfrac{1}{2} = \dfrac{1}{12}$',
     r'Probe: der Gesamtversuch hat $6 \cdot 2 = 12$ gleich wahrscheinliche Ergebnisse, eines davon ist günstig.'])

Q.q(r'Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für dreimal Kopf?',
    [r'$\dfrac{1}{8}$', r'$\dfrac{1}{6}$', r'$\dfrac{3}{8}$', r'$\dfrac{1}{2}$'],
    [r'Drei unabhängige Würfe: $\left(\dfrac{1}{2}\right)^3$.',
     r'$= \dfrac{1}{8}$',
     r'Von den $2^3 = 8$ möglichen Folgen ist genau eine KKK.'])

Q.q(r'Aus einer Urne mit $3$ roten und $5$ blauen Kugeln wird zweimal MIT Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zweimal Rot?',
    [r'$\dfrac{9}{64}$', r'$\dfrac{3}{32}$', r'$\dfrac{6}{16}$', r'$\dfrac{3}{8}$'],
    [r'Durch das Zurücklegen sind die Züge unabhängig, beide Male ist $P(\text{rot}) = \dfrac{3}{8}$.',
     r'$P = \dfrac{3}{8} \cdot \dfrac{3}{8} = \dfrac{9}{64}$',
     r'Ohne Zurücklegen wäre es $\dfrac{3}{8} \cdot \dfrac{2}{7} = \dfrac{6}{56} = \dfrac{3}{28}$.'])

# ------------------------------------------------- Unabhängigkeit nachweisen ----
Q.q(r'Wie weist man nach, dass zwei Ereignisse stochastisch unabhängig sind?',
    [r'Man prüft, ob $P(A \cap B) = P(A) \cdot P(B)$ gilt.',
     r'Man prüft, ob $A \cap B = \{\}$ gilt.',
     r'Man prüft, ob $P(A) = P(B)$ gilt.',
     r'Man prüft, ob $P(A) + P(B) = 1$ gilt.'],
    [r'Die Multiplikationsregel ist nicht nur Folge, sondern Definition der Unabhängigkeit.',
     r'Stimmen beide Seiten überein, sind die Ereignisse unabhängig, sonst abhängig.',
     r'Alle drei Größen müssen dafür bekannt sein.'])

Q.q(r'Gegeben sind $P(A) = 0{,}5$, $P(B) = 0{,}4$ und $P(A \cap B) = 0{,}2$. Sind $A$ und $B$ unabhängig?',
    [r'Ja, denn $0{,}5 \cdot 0{,}4 = 0{,}2$.', r'Nein, denn $0{,}5 + 0{,}4 \neq 0{,}2$.',
     r'Nein, denn $P(A) \neq P(B)$.', r'Das lässt sich nicht entscheiden.'],
    [r'Produkt berechnen: $0{,}5 \cdot 0{,}4 = 0{,}2$.',
     r'Das stimmt mit $P(A \cap B)$ überein.',
     r'Die Ereignisse sind also stochastisch unabhängig.'])

Q.q(r'Gegeben sind $P(A) = 0{,}5$, $P(B) = 0{,}4$ und $P(A \cap B) = 0{,}3$. Sind $A$ und $B$ unabhängig?',
    [r'Nein, denn $0{,}5 \cdot 0{,}4 = 0{,}2 \neq 0{,}3$.', r'Ja, denn $0{,}3 < 0{,}4$.',
     r'Ja, denn beide Wahrscheinlichkeiten sind positiv.', r'Das lässt sich nicht entscheiden.'],
    [r'Das Produkt wäre $0{,}2$.',
     r'Tatsächlich ist der Durchschnitt mit $0{,}3$ größer.',
     r'Die Ereignisse treten häufiger gemeinsam ein als bei Unabhängigkeit zu erwarten — sie sind abhängig.'])

Q.q(r'Beim Würfel sei $A$ = „gerade Augenzahl“ und $B$ = „Augenzahl größer als $4$“. Sind sie unabhängig?',
    [r'Ja, denn $\dfrac{1}{2} \cdot \dfrac{1}{3} = \dfrac{1}{6} = P(A \cap B)$.',
     r'Nein, denn sie haben die $6$ gemeinsam.',
     r'Ja, denn sie sind unvereinbar.',
     r'Nein, denn $P(A) \neq P(B)$.'],
    [r'$P(A) = \dfrac{3}{6} = \dfrac{1}{2}$ und $P(B) = \dfrac{2}{6} = \dfrac{1}{3}$.',
     r'$A \cap B = \{6\}$, also $P(A \cap B) = \dfrac{1}{6}$.',
     r'Das Produkt ist ebenfalls $\dfrac{1}{6}$ — die Ereignisse sind unabhängig, obwohl sie sich überschneiden.'])

Q.q(r'Beim Würfel sei $A$ = „gerade Augenzahl“ und $C = \{1;\,2;\,3\}$. Sind $A$ und $C$ unabhängig?',
    [r'Nein, denn $P(A \cap C) = \dfrac{1}{6}$, aber $P(A) \cdot P(C) = \dfrac{1}{4}$.',
     r'Ja, denn beide haben die Wahrscheinlichkeit $\dfrac{1}{2}$.',
     r'Ja, denn $A \cap C = \{2\}$ ist nicht leer.',
     r'Nein, denn sie sind unvereinbar.'],
    [r'$P(A) = P(C) = \dfrac{1}{2}$, das Produkt ist $\dfrac{1}{4}$.',
     r'$A \cap C = \{2\}$, also $P(A \cap C) = \dfrac{1}{6}$.',
     r'$\dfrac{1}{6} \neq \dfrac{1}{4}$, die Ereignisse sind abhängig.'])

Q.q(r'Warum sind zwei Züge aus einer Urne OHNE Zurücklegen abhängig?',
    [r'Weil sich der Urneninhalt und damit die Wahrscheinlichkeit für den zweiten Zug ändert.',
     r'Weil beide Züge dieselbe Wahrscheinlichkeit haben.',
     r'Weil die Reihenfolge keine Rolle spielt.',
     r'Weil die Urne leer wird.'],
    [r'Nach dem ersten Zug fehlt eine Kugel.',
     r'Bei $3$ roten von $8$ Kugeln ist $P(\text{rot})$ im zweiten Zug $\dfrac{2}{7}$ oder $\dfrac{3}{7}$, je nach erstem Zug.',
     r'Das Ergebnis des ersten Zuges beeinflusst also den zweiten.'])

Q.q(r'Warum sind zwei Züge MIT Zurücklegen unabhängig?',
    [r'Weil die Urne vor jedem Zug denselben Inhalt hat.',
     r'Weil die Kugeln gleich aussehen.',
     r'Weil zweimal gezogen wird.',
     r'Weil die Wahrscheinlichkeiten addiert werden.'],
    [r'Die gezogene Kugel wandert zurück, bevor erneut gezogen wird.',
     r'Die Ausgangslage ist für jeden Zug identisch.',
     r'Deshalb gilt die Multiplikationsregel mit gleichbleibenden Wahrscheinlichkeiten.'])

# -------------------------- Abgrenzung unvereinbar gegen unabhängig ----
Q.q(r'Was ist der Unterschied zwischen „unvereinbar“ und „unabhängig“?',
    [r'Unvereinbar heißt $A \cap B = \{\}$, unabhängig heißt $P(A \cap B) = P(A) \cdot P(B)$.',
     r'Die beiden Begriffe bedeuten dasselbe.',
     r'Unvereinbar bezieht sich auf Wahrscheinlichkeiten, unabhängig auf Mengen.',
     r'Unabhängig heißt, dass die Ereignisse nie zusammen eintreten.'],
    [r'Unvereinbarkeit ist eine Aussage über die Mengen: sie überschneiden sich nicht.',
     r'Unabhängigkeit ist eine Aussage über die Wahrscheinlichkeiten.',
     r'Die Begriffe werden oft verwechselt, sie haben aber nichts miteinander zu tun.'])

Q.q(r'$A$ und $B$ seien unvereinbar mit $P(A) = 0{,}3$ und $P(B) = 0{,}4$. Sind sie unabhängig?',
    [r'Nein, denn $P(A \cap B) = 0$, aber $P(A) \cdot P(B) = 0{,}12$.',
     r'Ja, denn sie beeinflussen sich nicht.',
     r'Ja, denn $0{,}3 + 0{,}4 < 1$.',
     r'Das lässt sich nicht entscheiden.'],
    [r'Unvereinbar bedeutet $A \cap B = \{\}$, also $P(A \cap B) = 0$.',
     r'Das Produkt ist dagegen $0{,}12 \neq 0$.',
     r'Zwei unvereinbare Ereignisse mit positiver Wahrscheinlichkeit sind immer abhängig — tritt das eine ein, ist das andere ausgeschlossen.'])

Q.q(r'Können zwei Ereignisse gleichzeitig unvereinbar und unabhängig sein?',
    [r'Nur wenn mindestens eines die Wahrscheinlichkeit $0$ hat.',
     r'Ja, das ist der Normalfall.',
     r'Nein, niemals.',
     r'Ja, wenn beide dieselbe Wahrscheinlichkeit haben.'],
    [r'Unvereinbar erzwingt $P(A \cap B) = 0$.',
     r'Unabhängig verlangt $P(A) \cdot P(B) = 0$.',
     r'Ein Produkt ist nur null, wenn ein Faktor null ist — der Fall ist also möglich, aber ohne praktischen Wert.'])

# ------------------------------------------------------------- Anwendungen ----
Q.q(r'Zwei Maschinen fallen unabhängig voneinander mit je $10\,\%$ Wahrscheinlichkeit aus. Wie groß ist die Wahrscheinlichkeit, dass beide ausfallen?',
    [r'$1\,\%$', r'$20\,\%$', r'$10\,\%$', r'$19\,\%$'],
    [r'$P = 0{,}10 \cdot 0{,}10$',
     r'$= 0{,}01$, also $1\,\%$.',
     r'$20\,\%$ wäre die falsche Addition.'])

Q.q(r'Wie groß ist in der vorigen Aufgabe die Wahrscheinlichkeit, dass mindestens eine Maschine ausfällt?',
    [r'$19\,\%$', r'$20\,\%$', r'$1\,\%$', r'$81\,\%$'],
    [r'Über das Gegenereignis: keine fällt aus mit $0{,}9 \cdot 0{,}9 = 0{,}81$.',
     r'$1 - 0{,}81 = 0{,}19$, also $19\,\%$.',
     r'Der Weg über das Gegenereignis ist bei „mindestens eines“ fast immer der kürzere.'])

Q.q(r'Zwei Bauteile sind in Reihe geschaltet, die Anlage läuft nur, wenn beide funktionieren. Jedes funktioniert unabhängig mit $90\,\%$. Wie zuverlässig ist die Anlage?',
    [r'$81\,\%$', r'$90\,\%$', r'$99\,\%$', r'$180\,\%$'],
    [r'$P = 0{,}90 \cdot 0{,}90$',
     r'$= 0{,}81$, also $81\,\%$.',
     r'Eine Reihenschaltung ist immer unzuverlässiger als ihr schwächstes Bauteil.'])

Q.q(r'Bei einer Produktion ist jedes Stück unabhängig mit $10\,\%$ Wahrscheinlichkeit fehlerhaft. Wie groß ist die Wahrscheinlichkeit, dass drei geprüfte Stücke alle in Ordnung sind?',
    [r'$72{,}9\,\%$', r'$90\,\%$', r'$30\,\%$', r'$0{,}1\,\%$'],
    [r'Jedes Stück ist mit $0{,}9$ in Ordnung.',
     r'$P = 0{,}9^3 = 0{,}729$',
     r'Also rund $72{,}9\,\%$. Die Wahrscheinlichkeit für mindestens einen Fehler ist entsprechend $27{,}1\,\%$.'])


def check():
    from fractions import Fraction as F
    h, s = F(1, 2), F(1, 6)
    assert h * h == F(1, 4) and s * s == F(1, 36) and s * h == F(1, 12)
    assert h ** 3 == F(1, 8) and 2 ** 3 == 8 and 6 * 2 == 12
    assert F(3, 8) * F(3, 8) == F(9, 64)
    assert F(3, 8) * F(2, 7) == F(6, 56) == F(3, 28)
    # Unabhaengigkeit
    assert F(5, 10) * F(4, 10) == F(2, 10) and F(5, 10) * F(4, 10) != F(3, 10)
    assert F(3, 6) * F(2, 6) == F(1, 6)                 # gerade und groesser 4
    assert F(3, 6) * F(3, 6) == F(1, 4) and F(1, 4) != F(1, 6)   # gerade und {1,2,3}
    assert {2, 4, 6} & {5, 6} == {6} and {2, 4, 6} & {1, 2, 3} == {2}
    assert F(3, 7) != F(2, 7)                           # ohne Zuruecklegen aendert sich alles
    # unvereinbar gegen unabhaengig
    assert F(3, 10) * F(4, 10) == F(12, 100) and F(12, 100) != 0
    assert F(0, 1) * F(5, 10) == 0
    # Anwendungen
    assert F(1, 10) * F(1, 10) == F(1, 100)
    assert F(9, 10) * F(9, 10) == F(81, 100) and 1 - F(81, 100) == F(19, 100)
    assert F(9, 10) ** 3 == F(729, 1000) and 1 - F(729, 1000) == F(271, 1000)


Q.verify(check)
Q.save()
