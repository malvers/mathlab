#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 38 / KW 24 (WB 2 Mathematische Spiele): strategy and chance
games - Tower of Hanoi (Lucas 1883), Nim (Bouton 1901), dice sums, roulette, Mastermind
(Meirowitz 1970), designing a fair game. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from functools import lru_cache
from quiz import os6

Q = os6(nr=38, slug='strategiespiele', thema='Strategie- und Zufallsspiele', lb='WB 2',
        blurb='Turm von Hanoi, Nim-Spiele, Würfelspiele, faire und unfaire Spiele',
        comment='Blocks: Tower of Hanoi (1-5), Nim (6-8), dice and roulette (9-15), Mastermind (16-17), strategy, chance and fairness (18-20). Sources in the texts.')

# --------------------------------------------------------------- Tower of Hanoi ----
Q.q(r'Beim Turm von Hanoi soll ein Turm aus 3 Scheiben auf einen anderen Stab umgesetzt werden. Wie viele Züge braucht man mindestens?',
    [r'7', r'3', r'6', r'9'],
    [r'Erst die oberen 2 Scheiben weg: 3 Züge.',
     r'Dann die größte Scheibe: 1 Zug. Dann die 2 Scheiben wieder darauf: 3 Züge.',
     r'$3 + 1 + 3 = 7$ Züge.'])

Q.q(r'Wie viele Züge braucht man beim Turm von Hanoi mit 4 Scheiben mindestens?',
    [r'15', r'8', r'16', r'12'],
    [r'Die oberen 3 Scheiben brauchen 7 Züge, dann die größte 1 Zug, dann wieder 7.',
     r'$7 + 1 + 7 = 15$',
     r'Mit jeder Scheibe mehr verdoppelt sich die Zugzahl ungefähr.'])

Q.q(r'Welche Regel gilt beim Turm von Hanoi?',
    [r'Man bewegt immer nur eine Scheibe und legt nie eine größere auf eine kleinere.',
     r'Man darf zwei Scheiben gleichzeitig bewegen.', r'Große Scheiben müssen oben liegen.',
     r'Man darf eine Scheibe neben die Stäbe legen.'],
    [r'Es gibt drei Stäbe.',
     r'In jedem Zug wird die oberste Scheibe eines Stabes bewegt.',
     r'Eine größere Scheibe darf nie auf einer kleineren liegen.'])

Q.q(r'Wer hat das Spiel „Turm von Hanoi“ 1883 erfunden?',
    [r'der französische Mathematiker Édouard Lucas', r'Carl Friedrich Gauß', r'Piet Hein', r'Charles Bouton'],
    [r'Édouard Lucas veröffentlichte es 1883 unter dem Fantasienamen „N. Claus de Siam“.',
     r'Dazu erfand er eine Legende von Mönchen, die einen Turm aus 64 goldenen Scheiben umsetzen.',
     r'Die Legende ist also selbst Teil der Erfindung.'])

Q.q(r'Nach der Legende von Lucas setzen Mönche einen Turm aus 64 Scheiben um. Wie viele Züge sind das mindestens?',
    [r'$2^{64} - 1$', r'$64 \cdot 2$', r'$64^2$', r'$2 \cdot 64 - 1$'],
    [r'1 Scheibe: 1 Zug, 2 Scheiben: 3, 3 Scheiben: 7, 4 Scheiben: 15.',
     r'Das ist immer eins weniger als eine Zweierpotenz: $2^n - 1$.',
     r'Bei 64 Scheiben: $2^{64} - 1$, über 18 Trillionen Züge – mehr als 500 Milliarden Jahre bei einem Zug pro Sekunde.'])

# ------------------------------------------------------------------------- Nim ----
Q.q(r'Nim-Spiel: Auf dem Tisch liegen 21 Hölzchen. Abwechselnd nimmt man 1, 2 oder 3 weg; wer das letzte nimmt, gewinnt. Du beginnst. Wie viele nimmst du?',
    [r'1', r'2', r'3', r'Es ist egal.'],
    [r'Lass deinem Gegner immer ein Vielfaches von 4 übrig.',
     r'21 − 1 = 20. Nimmt er dann $x$, nimmst du $4 - x$: Es bleiben 16, 12, 8, 4, 0.',
     r'So nimmst du immer das letzte Hölzchen.'])

Q.q(r'Beim Nim-Spiel „nimm 1, 2 oder 3, wer das letzte nimmt, gewinnt“: Welche Anzahl solltest du deinem Gegner immer übrig lassen?',
    [r'ein Vielfaches von 4', r'eine gerade Zahl', r'ein Vielfaches von 3', r'eine Primzahl'],
    [r'Bei 4 Hölzchen kann der Gegner nicht gewinnen: Er nimmt 1 bis 3, du nimmst den Rest.',
     r'Das gilt genauso bei 8, 12, 16, …',
     r'Also immer ein Vielfaches von 4 übrig lassen.'])

Q.q(r'Wer hat 1901 die vollständige Gewinnstrategie für Nim-Spiele aufgeschrieben und dem Spiel seinen Namen gegeben?',
    [r'der amerikanische Mathematiker Charles L. Bouton', r'Édouard Lucas', r'Adam Ries', r'Alkuin von York'],
    [r'Nim-Spiele sind sehr alt.',
     r'Charles L. Bouton beschrieb 1901 in einer Fachzeitschrift, wie man immer gewinnt.',
     r'Der Name „Nim“ stammt von ihm.'])

# ----------------------------------------------------------- dice and roulette ----
Q.q(r'Zwei Würfel werden geworfen und die Augenzahlen addiert. Welche Summe kommt am häufigsten vor?',
    [r'7', r'12', r'6', r'Alle Summen gleich oft.'],
    [r'Es gibt $6 \cdot 6 = 36$ gleich wahrscheinliche Würfelpaare.',
     r'Summe 7: (1|6), (2|5), (3|4), (4|3), (5|2), (6|1) – 6 Paare.',
     r'Keine andere Summe hat so viele Paare.'])

Q.q(r'Zwei Würfel: Wie viele der 36 Würfelpaare ergeben die Summe 2?',
    [r'1', r'2', r'6', r'0'],
    [r'Die Summe 2 gibt es nur mit zwei Einsen.',
     r'(1|1)',
     r'Also nur 1 Paar – darum ist die 2 so selten.'])

Q.q(r'Spiel mit einem Würfel: Anna gewinnt bei einer geraden Augenzahl, Ben bei einer ungeraden. Ist das Spiel fair?',
    [r'Ja, beide haben 3 von 6 Möglichkeiten.', r'Nein, Anna ist im Vorteil.', r'Nein, Ben ist im Vorteil.',
     r'Das kann man nicht sagen.'],
    [r'Gerade: 2, 4, 6. Ungerade: 1, 3, 5.',
     r'Beide haben 3 Ergebnisse.',
     r'Die Gewinnchancen sind gleich: Das Spiel ist fair.'])

Q.q(r'Spiel mit zwei Würfeln: Anna gewinnt bei der Summe 6, 7 oder 8, Ben bei jeder anderen Summe. Wer hat die besseren Chancen?',
    [r'Ben, mit 20 von 36 Paaren', r'Anna, mit 3 von 11 Summen', r'Anna, mit 20 von 36 Paaren', r'Beide gleich.'],
    [r'Summe 6: 5 Paare, Summe 7: 6 Paare, Summe 8: 5 Paare. Anna: 16 Paare.',
     r'Ben: $36 - 16 = 20$ Paare.',
     r'Ben ist etwas im Vorteil, obwohl Anna die häufigsten Summen hat.'])

Q.q(r'Ein europäisches Roulette hat die Zahlen 0 bis 36. Wie viele Felder sind das?',
    [r'37', r'36', r'38', r'35'],
    [r'Die Zahlen 1 bis 36: 36 Felder.',
     r'Dazu kommt die Null.',
     r'Zusammen 37 Felder.'])

Q.q(r'Beim Roulette sind 18 der 37 Felder rot. Welche Aussage über „Rot“ stimmt?',
    [r'Die Chance ist etwas kleiner als die Hälfte.', r'Die Chance ist genau die Hälfte.',
     r'Die Chance ist größer als die Hälfte.', r'Rot kommt nie.'],
    [r'Die Hälfte von 37 wäre 18,5.',
     r'18 ist etwas weniger.',
     r'Wegen der grünen Null ist die Chance knapp unter der Hälfte – davon lebt die Spielbank.'])

Q.q(r'Welches Spiel ist ein reines Zufallsspiel?',
    [r'Roulette', r'Schach', r'Nim', r'Turm von Hanoi'],
    [r'Bei Schach, Nim und dem Turm von Hanoi entscheidet allein das Nachdenken.',
     r'Beim Roulette kann man gar nichts beeinflussen.',
     r'Roulette ist ein reines Zufallsspiel.'])

# ------------------------------------------------------------------ Mastermind ----
Q.q(r'Das Spiel „Mastermind“ wurde 1970 von Mordecai Meirowitz erfunden. Ein Geheimcode hat 4 Plätze und 6 Farben, Farben dürfen sich wiederholen. Wie viele verschiedene Codes gibt es?',
    [r'1296', r'24', r'360', r'10'],
    [r'Für jeden der 4 Plätze gibt es 6 Möglichkeiten.',
     r'$6 \cdot 6 \cdot 6 \cdot 6$',
     r'$= 1296$ Codes.'])

Q.q(r'Beim Mastermind dürfen sich die Farben jetzt NICHT wiederholen (4 Plätze, 6 Farben). Wie viele Codes gibt es?',
    [r'360', r'1296', r'24', r'720'],
    [r'Erster Platz: 6 Farben, zweiter: 5, dritter: 4, vierter: 3.',
     r'$6 \cdot 5 \cdot 4 \cdot 3$',
     r'$= 360$ Codes.'])

# ----------------------------------------------- strategy, chance and fairness ----
Q.q(r'Du gestaltest ein eigenes Würfelspiel für zwei Personen. Was ist für ein faires Spiel wichtig?',
    [r'Beide haben gleich große Gewinnchancen.', r'Wer anfängt, gewinnt immer.',
     r'Eine Person darf zweimal würfeln.', r'Die Regeln werden erst nach dem Spiel festgelegt.'],
    [r'Fair heißt: Niemand ist durch die Regeln im Vorteil.',
     r'Man zählt die günstigen Ergebnisse für beide.',
     r'Ein Testspiel mit vielen Runden zeigt, ob es passt.'])

Q.q(r'Mit 5 Scheiben beim Turm von Hanoi: Wie viele Züge braucht man mindestens?',
    [r'31', r'25', r'32', r'16'],
    [r'4 Scheiben brauchen 15 Züge.',
     r'5 Scheiben: $15 + 1 + 15 = 31$',
     r'Oder mit der Regel: $2^5 - 1 = 31$.'])

Q.q(r'Nim-Spiel mit 18 Hölzchen (nimm 1, 2 oder 3; wer das letzte nimmt, gewinnt). Du bist dran. Wie viele nimmst du?',
    [r'2', r'1', r'3', r'Du kannst nicht mehr sicher gewinnen.'],
    [r'Das nächste Vielfache von 4 unter 18 ist 16.',
     r'$18 - 16 = 2$',
     r'Nimm 2 – dann bleiben deinem Gegner 16.'])


def hanoi(n):
    return 0 if n == 0 else 2 * hanoi(n - 1) + 1


@lru_cache(None)
def wins(n):
    """True when the player to move can force taking the last stick (take 1 to 3)."""
    return any(k == n or (k < n and not wins(n - k)) for k in (1, 2, 3))


def check():
    assert [hanoi(n) for n in (3, 4, 5)] == [7, 15, 31] and hanoi(64) == 2 ** 64 - 1
    assert (2 ** 64 - 1) / (3600 * 24 * 365.25) > 5e11
    assert not any(wins(4 * k) for k in range(1, 10)) and all(wins(n) for n in range(1, 40) if n % 4)
    assert [k for k in (1, 2, 3) if not wins(21 - k)] == [1] and [k for k in (1, 2, 3) if not wins(18 - k)] == [2]
    pairs = [(a, b) for a in range(1, 7) for b in range(1, 7)]
    cnt = {s: sum(1 for a, b in pairs if a + b == s) for s in range(2, 13)}
    assert max(cnt, key=cnt.get) == 7 and cnt[7] == 6 and cnt[2] == 1
    anna = cnt[6] + cnt[7] + cnt[8]
    assert anna == 16 and 36 - anna == 20
    assert len([k for k in range(1, 7) if k % 2 == 0]) == 3
    assert len(range(0, 37)) == 37 and F(18, 37) < F(1, 2)
    assert 6 ** 4 == 1296 and 6 * 5 * 4 * 3 == 360


Q.verify(check)
Q.save()
