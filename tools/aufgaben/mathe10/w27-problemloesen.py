#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 27 / KW 12 (LB 4): komplexe Anwendungsaufgaben –
Schritte des Problemlösens, Basiswissen ohne Hilfsmittel. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=27, slug='problemloesen', thema='Komplexe Anwendungsaufgaben', lb='LB 4',
         blurb='Problemlösen in Schritten, Kopfrechnen, Überschlag, Einheiten, Aufgaben aus mehreren Gebieten',
         comment='Blocks: mental arithmetic and units without calculator (1-5, 10-12, 16), problem-solving steps and plausibility (6, 20), mixed context tasks (7-9, 13-15, 17-19).')

Q.q(r'Rechne im Kopf: 15 % von 80.',
    [r'12', r'15', r'8', r'1,2'],
    [r'$10\,\%$ von 80 sind 8, $5\,\%$ sind 4.', r'$8 + 4 = 12$'])

Q.q(r'Welcher Überschlag passt am besten zu $398 \cdot 21$?',
    [r'etwa 8000', r'etwa 800', r'etwa 80 000', r'etwa 4000'],
    [r'Runden: $400 \cdot 20 = 8000$', r'Genau: 8358 – der Überschlag schützt vor Kommafehlern.'])

Q.q(r'Wie viele cm² sind 2,5 m²?',
    [r'25 000 cm²', r'250 cm²', r'2500 cm²', r'250 000 cm²'],
    [r'$1$ m² $= 100 \cdot 100$ cm² $= 10\,000$ cm²', r'$2{,}5 \cdot 10\,000 = 25\,000$ cm²'])

Q.q(r'Wie viele cm³ sind 3,2 Liter?',
    [r'3200 cm³', r'320 cm³', r'32 000 cm³', r'32 cm³'],
    [r'$1$ l $= 1$ dm³ $= 1000$ cm³', r'$3{,}2 \cdot 1000 = 3200$ cm³'])

Q.q(r'Wie viele Minuten sind 0,75 Stunden?',
    [r'45 min', r'75 min', r'7,5 min', r'34 min'],
    [r'$0{,}75 \cdot 60 = 45$ – eine Dreiviertelstunde.'])

Q.q(r'In welcher Reihenfolge geht man beim Problemlösen sinnvoll vor?',
    [r'verstehen – planen – rechnen – prüfen – antworten', r'rechnen – verstehen – antworten – prüfen – planen',
     r'antworten – rechnen – prüfen – verstehen – planen', r'planen – antworten – verstehen – rechnen – prüfen'],
    [r'Erst klären, was gegeben und gesucht ist, dann einen Lösungsweg planen.', r'Zum Schluss das Ergebnis prüfen und in einem Antwortsatz notieren.'])

Q.q(r'Eine kreisförmige Rasenfläche hat den Radius 5 m. Pro m² braucht man 30 g Rasensamen. Wie viel Samen braucht man ungefähr (mit $\pi \approx 3{,}14$)?',
    [r'etwa 2,4 kg', r'etwa 0,9 kg', r'etwa 4,7 kg', r'etwa 24 kg'],
    [r'$A = \pi r^2 \approx 3{,}14 \cdot 25 = 78{,}5$ m²', r'$78{,}5 \cdot 30 = 2355$ g $\approx 2{,}4$ kg'])

Q.q(r'Ein Satteldach hat zwei rechteckige Dachflächen von je 10 m mal 6 m. Pro m² braucht man 15 Ziegel. Wie viele Ziegel sind nötig?',
    [r'1800', r'900', r'240', r'960'],
    [r'Dachfläche: $2 \cdot 10 \cdot 6 = 120$ m²', r'$120 \cdot 15 = 1800$ Ziegel'])

Q.q(r'Eine Rampe soll 0,5 m Höhe überwinden und höchstens 6 % Steigung haben. Wie lang muss sie waagerecht mindestens sein (gerundet)?',
    [r'8,33 m', r'3 m', r'0,03 m', r'12 m'],
    [r'6 % Steigung: 6 cm Höhe auf 100 cm waagerecht.', r'$\dfrac{0{,}5}{0{,}06} \approx 8{,}33$ m'])

Q.q(r'Rechne im Kopf: $0{,}2 \cdot 0{,}3$.',
    [r'0,06', r'0,6', r'0,006', r'6'],
    [r'$2 \cdot 3 = 6$, und zusammen zwei Nachkommastellen: $0{,}06$.'])

Q.q(r'Wie viel sind drei Viertel von 60?',
    [r'45', r'40', r'15', r'80'],
    [r'Ein Viertel: $60 : 4 = 15$.', r'Drei Viertel: $3 \cdot 15 = 45$'])

Q.q(r'Wie groß ist $\sqrt{144}$?',
    [r'12', r'14', r'72', r'1,2'],
    [r'$12 \cdot 12 = 144$'])

Q.q(r'Auf einer Karte im Maßstab 1 : 25 000 sind zwei Orte 4 cm voneinander entfernt. Wie weit ist das in Wirklichkeit?',
    [r'1 km', r'100 m', r'10 km', r'4 km'],
    [r'$4 \cdot 25\,000 = 100\,000$ cm', r'$100\,000$ cm $= 1000$ m $= 1$ km'])

Q.q(r'Ein Zug fährt 150 km in 1 h 30 min. Wie hoch ist seine Durchschnittsgeschwindigkeit?',
    [r'100 km/h', r'115 km/h', r'150 km/h', r'225 km/h'],
    [r'1 h 30 min $= 1{,}5$ h.', r'$150 : 1{,}5 = 100$ km/h'])

Q.q(r'Nach 25 % Rabatt kostet eine Jacke 60 €. Wie viel kostete sie vorher?',
    [r'80 €', r'75 €', r'85 €', r'45 €'],
    [r'60 € sind $75\,\%$ des alten Preises.', r'$60 : 0{,}75 = 80$ €. (Wer 25 % von 60 € aufschlägt, bekommt fälschlich 75 €.)'])

Q.q(r'Löse die Gleichung $3x - 7 = 11$.',
    [r'$x = 6$', r'$x = \dfrac{4}{3}$', r'$x = 18$', r'$x = 3$'],
    [r'$3x = 18$', r'$x = 6$. Probe: $18 - 7 = 11$.'])

Q.q(r'Ein Bildschirm ist 48 cm breit und 36 cm hoch. Wie lang ist seine Diagonale?',
    [r'60 cm', r'84 cm', r'42 cm', r'70 cm'],
    [r'$d = \sqrt{48^2 + 36^2} = \sqrt{2304 + 1296} = \sqrt{3600} = 60$ cm'])

Q.q(r'Eine Familie fährt 360 km mit dem Auto. Es braucht 6 l auf 100 km, ein Liter kostet 1,80 €. Wie hoch sind die Spritkosten?',
    [r'38,88 €', r'21,60 €', r'64,80 €', r'10,80 €'],
    [r'Verbrauch: $3{,}6 \cdot 6 = 21{,}6$ l.', r'Kosten: $21{,}6 \cdot 1{,}80 = 38{,}88$ €'])

Q.q(r'Ein Holzbalken ist 4 m lang, 10 cm breit und 20 cm hoch. Holz wiegt 0,6 t pro m³. Wie schwer ist der Balken?',
    [r'48 kg', r'480 kg', r'4,8 kg', r'80 kg'],
    [r'Alles in Meter: $V = 4 \cdot 0{,}1 \cdot 0{,}2 = 0{,}08$ m³.', r'$0{,}08 \cdot 600$ kg $= 48$ kg'])

Q.q(r'Eine Rechnung ergibt, dass eine Schülerin mit 45 km/h zur Schule geht. Was ist zu tun?',
    [r'Die Rechnung prüfen – das Ergebnis ist unrealistisch.', r'Das Ergebnis in den Antwortsatz schreiben.',
     r'Auf 50 km/h runden.', r'Nichts, Rechnungen stimmen immer.'],
    [r'Zu Fuß geht man etwa 4 bis 6 km/h.', r'Ein unplausibles Ergebnis deutet auf einen Fehler hin, zum Beispiel bei den Einheiten.'])


def check():
    from math import pi, sqrt
    R = lambda x, n=2: round(x, n)
    assert 0.15 * 80 == 12 and 398 * 21 == 8358 and 2.5 * 10000 == 25000 and 3.2 * 1000 == 3200 and 0.75 * 60 == 45
    assert R(3.14 * 25) == 78.5 and R(78.5 * 30) == 2355 and 2 * 10 * 6 * 15 == 1800 and R(0.5 / 0.06) == 8.33
    assert R(0.2 * 0.3) == 0.06 and 60 / 4 * 3 == 45 and sqrt(144) == 12 and 4 * 25000 == 100000
    assert 150 / 1.5 == 100 and R(60 / 0.75) == 80 and (11 + 7) / 3 == 6 and sqrt(48 ** 2 + 36 ** 2) == 60
    assert R(3.6 * 6 * 1.8) == 38.88 and R(4 * 0.1 * 0.2 * 600) == 48


Q.verify(check)
Q.save()
