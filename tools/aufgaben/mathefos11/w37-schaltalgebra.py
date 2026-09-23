#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 37 / KW 23: Exkurs Schaltalgebra (Wahlbereich 3) -
Aussagen, Verknuepfungen, Wahrheitstafeln, Vereinfachen, Schaltungen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=37, slug='schaltalgebra', thema='Exkurs: Schaltalgebra', lb='WB 3',
          blurb='Aussagen, UND, ODER, NICHT, Wahrheitstafeln, Vereinfachen, Schaltungen',
          comment='Blocks: Aussagen und Verknuepfungen (1-6), Wahrheitstafeln (7-12), Rechengesetze und Vereinfachen (13-17), Schaltungen (18-20).')

# ------------------------------------------------- Aussagen und Verknüpfungen ----
Q.q(r'Was ist in der Aussagenlogik eine Aussage?',
    [r'ein Satz, dem sich eindeutig wahr oder falsch zuordnen lässt',
     r'jede Frage', r'jeder Satz mit einem Verb', r'eine Rechenanweisung'],
    [r'Entscheidend ist die Zweiwertigkeit: wahr oder falsch, nichts dazwischen.',
     r'„Berlin liegt in Deutschland“ ist eine Aussage.',
     r'„Wie spät ist es?“ dagegen nicht — eine Frage ist weder wahr noch falsch.'])

Q.q(r'Welche Werte verwendet die Schaltalgebra?',
    [r'nur $0$ und $1$, gedeutet als falsch und wahr', r'alle reellen Zahlen',
     r'die ganzen Zahlen', r'die Werte $-1$, $0$ und $1$'],
    [r'Die Schaltalgebra ist zweiwertig.',
     r'$1$ steht für wahr oder „Strom fließt“, $0$ für falsch oder „Strom fließt nicht“.',
     r'Deshalb passt sie so gut zu elektrischen Schaltungen und zur Informatik.'])

Q.q(r'Wann ist die Konjunktion $a \land b$ wahr?',
    [r'nur wenn $a$ und $b$ beide wahr sind', r'wenn mindestens eine wahr ist',
     r'wenn genau eine wahr ist', r'wenn beide falsch sind'],
    [r'$\land$ ist das logische UND.',
     r'Nur die Kombination $1 \land 1$ ergibt $1$.',
     r'In allen drei anderen Fällen ist das Ergebnis $0$.'])

Q.q(r'Wann ist die Disjunktion $a \lor b$ falsch?',
    [r'nur wenn $a$ und $b$ beide falsch sind', r'wenn mindestens eine falsch ist',
     r'wenn genau eine wahr ist', r'wenn beide wahr sind'],
    [r'$\lor$ ist das logische ODER, und zwar nicht ausschließend.',
     r'Nur $0 \lor 0$ ergibt $0$.',
     r'Sind beide wahr, ist das Ergebnis ebenfalls wahr.'])

Q.q(r'Was bewirkt die Negation $\overline{a}$?',
    [r'Sie kehrt den Wahrheitswert um: aus $0$ wird $1$ und umgekehrt.',
     r'Sie macht jede Aussage falsch.',
     r'Sie verknüpft zwei Aussagen.',
     r'Sie lässt den Wert unverändert.'],
    [r'Die Negation ist die einzige einstellige Verknüpfung.',
     r'$\overline{0} = 1$ und $\overline{1} = 0$.',
     r'Zweimal negiert ergibt wieder den Ausgangswert: $\overline{\overline{a}} = a$.'])

Q.q(r'Welcher Schaltung entspricht die Konjunktion $a \land b$?',
    [r'der Reihenschaltung zweier Schalter', r'der Parallelschaltung zweier Schalter',
     r'einem einzelnen Schalter', r'einem Wechselschalter'],
    [r'In Reihe muss der Strom beide Schalter passieren.',
     r'Er fließt nur, wenn beide geschlossen sind.',
     r'Die Parallelschaltung entspricht dagegen dem ODER.'])

# ------------------------------------------------------------- Wahrheitstafeln ----
Q.q(r'Wie viele Zeilen hat die Wahrheitstafel einer Verknüpfung mit zwei Variablen?',
    [r'vier', r'zwei', r'drei', r'acht'],
    [r'Jede Variable kann $0$ oder $1$ sein.',
     r'$2 \cdot 2 = 4$ Kombinationen.',
     r'Das sind $00$, $01$, $10$ und $11$.'])

Q.q(r'Wie viele Zeilen hat die Wahrheitstafel bei drei Variablen?',
    [r'acht', r'sechs', r'vier', r'neun'],
    [r'$2^3 = 8$',
     r'Allgemein sind es $2^n$ Zeilen bei $n$ Variablen.',
     r'Die Tafel wächst also exponentiell mit der Zahl der Eingänge.'])

Q.q(r'Welchen Wert hat $1 \land 0$?',
    [r'$0$', r'$1$', r'beides möglich', r'nicht definiert'],
    [r'Die Konjunktion ist nur wahr, wenn beide Werte wahr sind.',
     r'Hier ist einer $0$.',
     r'Also $1 \land 0 = 0$.'])

Q.q(r'Welchen Wert hat $0 \lor 1$?',
    [r'$1$', r'$0$', r'beides möglich', r'nicht definiert'],
    [r'Die Disjunktion ist wahr, sobald mindestens ein Wert wahr ist.',
     r'Hier ist einer $1$.',
     r'Also $0 \lor 1 = 1$.'])

Q.q(r'Welchen Wert hat $\overline{1 \land 1}$?',
    [r'$0$', r'$1$', r'beides möglich', r'nicht definiert'],
    [r'Zuerst die Klammer: $1 \land 1 = 1$.',
     r'Dann negieren: $\overline{1} = 0$.',
     r'Diese Verknüpfung heißt NAND und ist in der Technik besonders wichtig.'])

Q.q(r'Für welche Belegung ist $a \land \overline{b}$ wahr?',
    [r'für $a = 1$ und $b = 0$', r'für $a = 1$ und $b = 1$',
     r'für $a = 0$ und $b = 0$', r'für $a = 0$ und $b = 1$'],
    [r'Die Konjunktion verlangt, dass beide Teile wahr sind.',
     r'$a$ muss $1$ sein, und $\overline{b}$ muss $1$ sein, also $b = 0$.',
     r'Nur die Belegung $a = 1$, $b = 0$ erfüllt beides.'])

# ------------------------------------------ Rechengesetze und Vereinfachen ----
Q.q(r'Wie lässt sich $a \land 1$ vereinfachen?',
    [r'zu $a$', r'zu $1$', r'zu $0$', r'zu $\overline{a}$'],
    [r'Ist der zweite Wert stets wahr, hängt das Ergebnis nur noch von $a$ ab.',
     r'$a \land 1 = a$',
     r'In der Schaltung: ein dauerhaft geschlossener Schalter in Reihe ändert nichts.'])

Q.q(r'Wie lässt sich $a \lor 0$ vereinfachen?',
    [r'zu $a$', r'zu $0$', r'zu $1$', r'zu $\overline{a}$'],
    [r'Ist der zweite Wert stets falsch, entscheidet nur noch $a$.',
     r'$a \lor 0 = a$',
     r'In der Schaltung: ein dauerhaft offener Schalter parallel ändert nichts.'])

Q.q(r'Wie lässt sich $a \land 0$ vereinfachen?',
    [r'zu $0$', r'zu $a$', r'zu $1$', r'zu $\overline{a}$'],
    [r'Die Konjunktion verlangt beide Werte wahr.',
     r'Einer ist aber fest $0$.',
     r'Also ist das Ergebnis immer $0$ — in Reihe mit einer Unterbrechung fließt nie Strom.'])

Q.q(r'Welchen Wert hat $a \land \overline{a}$?',
    [r'$0$, unabhängig von $a$', r'$1$, unabhängig von $a$', r'$a$', r'$\overline{a}$'],
    [r'Eine Aussage und ihre Verneinung sind nie gleichzeitig wahr.',
     r'Ist $a = 1$, so ist $\overline{a} = 0$, und umgekehrt.',
     r'Das Ergebnis ist stets $0$; entsprechend gilt $a \lor \overline{a} = 1$.'])

Q.q(r'Wie lautet die erste Regel von de Morgan in der Schaltalgebra?',
    [r'$\overline{a \lor b} = \overline{a} \land \overline{b}$',
     r'$\overline{a \lor b} = \overline{a} \lor \overline{b}$',
     r'$\overline{a \land b} = \overline{a} \land \overline{b}$',
     r'$\overline{a \lor b} = a \land b$'],
    [r'Beim Negieren einer Verknüpfung wechselt $\lor$ zu $\land$.',
     r'Zugleich wird jeder einzelne Teil negiert.',
     r'Probe mit $a = 1$, $b = 0$: links $\overline{1} = 0$, rechts $0 \land 1 = 0$.'])

# ------------------------------------------------------------------ Schaltungen ----
Q.q(r'Eine Lampe soll leuchten, wenn mindestens einer von zwei Schaltern geschlossen ist. Welcher Term beschreibt das?',
    [r'$a \lor b$', r'$a \land b$', r'$\overline{a} \land \overline{b}$', r'$\overline{a \lor b}$'],
    [r'Mindestens einer bedeutet die Disjunktion.',
     r'$a \lor b$',
     r'Technisch ist das die Parallelschaltung beider Schalter.'])

Q.q(r'Eine Maschine darf nur anlaufen, wenn die Schutztür geschlossen ist UND der Startknopf gedrückt wird UND kein Notaus ausgelöst ist. Welcher Term beschreibt das?',
    [r'$t \land s \land \overline{n}$', r'$t \lor s \lor n$', r'$t \land s \land n$', r'$\overline{t \land s}$'],
    [r'Alle drei Bedingungen müssen zugleich erfüllt sein, also Konjunktionen.',
     r'Der Notaus darf gerade NICHT ausgelöst sein, deshalb $\overline{n}$.',
     r'$t \land s \land \overline{n}$ — eine typische Freigabeschaltung.'])

Q.q(r'Was leistet die Schaltalgebra für die Technik?',
    [r'Sie erlaubt es, Schaltungen als Terme zu schreiben und vor dem Bau zu vereinfachen.',
     r'Sie berechnet die Stromstärke in einer Schaltung.',
     r'Sie ersetzt die Wahrheitstafel.',
     r'Sie gilt nur für theoretische Überlegungen.'],
    [r'Jede Schaltung lässt sich als Term aus UND, ODER und NICHT darstellen.',
     r'Mit den Rechengesetzen wird der Term vereinfacht.',
     r'Ein kürzerer Term bedeutet weniger Bauteile — das spart Geld und senkt die Fehlerquote.'])


def check():
    from itertools import product
    UND = lambda a, b: a and b
    ODER = lambda a, b: a or b
    NICHT = lambda a: 1 - a
    assert 2 * 2 == 4 and 2 ** 3 == 8
    assert UND(1, 1) == 1 and UND(1, 0) == 0 and UND(0, 1) == 0 and UND(0, 0) == 0
    assert ODER(0, 0) == 0 and ODER(0, 1) == 1 and ODER(1, 0) == 1 and ODER(1, 1) == 1
    assert NICHT(0) == 1 and NICHT(1) == 0 and NICHT(NICHT(1)) == 1
    assert NICHT(UND(1, 1)) == 0
    # a UND NICHT b
    treffer = [(a, b) for a, b in product((0, 1), repeat=2) if UND(a, NICHT(b))]
    assert treffer == [(1, 0)]
    # Rechengesetze fuer alle Belegungen
    for a in (0, 1):
        assert UND(a, 1) == a and ODER(a, 0) == a
        assert UND(a, 0) == 0 and ODER(a, 1) == 1
        assert UND(a, NICHT(a)) == 0 and ODER(a, NICHT(a)) == 1
    # de Morgan
    for a, b in product((0, 1), repeat=2):
        assert NICHT(ODER(a, b)) == UND(NICHT(a), NICHT(b))
        assert NICHT(UND(a, b)) == ODER(NICHT(a), NICHT(b))
    assert NICHT(ODER(1, 0)) == 0 and UND(NICHT(1), NICHT(0)) == 0
    # Freigabeschaltung
    frei = lambda t, s, n: UND(UND(t, s), NICHT(n))
    assert frei(1, 1, 0) == 1 and frei(1, 1, 1) == 0 and frei(0, 1, 0) == 0


Q.verify(check)
Q.save()
