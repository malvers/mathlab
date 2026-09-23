#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 13 / KW 48 (LB 1): Anwendungen linearer
Gleichungssysteme - Mischung, Kalkulation, Bewegung, Technik.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=13, slug='lgs-anwendungen', thema='Anwendungen linearer Gleichungssysteme', lb='LB 1',
          blurb='Ansatz aus dem Text, Mischung, Kalkulation, Bewegung, Technik',
          comment='Blocks: Ansatz finden (1-5), Mischung und Kalkulation (6-12), Bewegung (13-16), Technik und Alltag (17-20).')

# ----------------------------------------------------------- Ansatz finden ----
Q.q(r'Die Summe zweier Zahlen ist $34$, ihre Differenz $8$. Wie lauten die Zahlen?',
    [r'$21$ und $13$', r'$20$ und $14$', r'$26$ und $8$', r'$17$ und $17$'],
    [r'Ansatz: $x + y = 34$ und $x - y = 8$.',
     r'Addieren: $2x = 42$, also $x = 21$ und $y = 13$.',
     r'Probe: $21 + 13 = 34$ und $21 - 13 = 8$.'])

Q.q(r'Was ist beim Aufstellen eines Gleichungssystems aus einem Text der erste Schritt?',
    [r'festlegen, wofür die beiden Variablen stehen, samt Einheit',
     r'die Gleichungen sofort addieren',
     r'die Lösung schätzen',
     r'den Text in eine Zeichnung übersetzen'],
    [r'Ohne klare Bedeutung der Variablen lässt sich keine Gleichung sauber aufstellen.',
     r'Man schreibt also zuerst auf: $x$ ist die Anzahl von …, $y$ ist der Preis von … in Euro.',
     r'Erst danach wird jede Aussage des Textes in eine Gleichung übersetzt.'])

Q.q(r'Ein Vater ist dreimal so alt wie sein Sohn, zusammen sind sie $48$ Jahre alt. Wie alt sind beide?',
    [r'Vater $36$, Sohn $12$', r'Vater $32$, Sohn $16$', r'Vater $36$, Sohn $16$', r'Vater $24$, Sohn $8$'],
    [r'Ansatz: $v = 3s$ und $v + s = 48$.',
     r'Einsetzen: $3s + s = 48$, also $4s = 48$ und $s = 12$.',
     r'$v = 36$. Probe: $36 = 3 \cdot 12$ und $36 + 12 = 48$.'])

Q.q(r'Eine Zahl ist doppelt so groß wie die andere, zusammen ergeben sie $27$. Wie lauten sie?',
    [r'$18$ und $9$', r'$17$ und $10$', r'$20$ und $7$', r'$13{,}5$ und $13{,}5$'],
    [r'Ansatz: $x = 2y$ und $x + y = 27$.',
     r'$2y + y = 27$, also $3y = 27$ und $y = 9$.',
     r'$x = 18$. Probe: $18 = 2 \cdot 9$ und $18 + 9 = 27$.'])

Q.q(r'Zum Satz „Zwei Hefte und drei Stifte kosten zusammen $8$ €“ gehört welche Gleichung, wenn $h$ der Heftpreis und $s$ der Stiftpreis ist?',
    [r'$2h + 3s = 8$', r'$h + s = 8$', r'$2h \cdot 3s = 8$', r'$3h + 2s = 8$'],
    [r'Die Anzahl steht als Faktor vor dem Preis.',
     r'Zwei Hefte kosten $2h$, drei Stifte kosten $3s$.',
     r'Zusammen: $2h + 3s = 8$. Die Zuordnung der Zahlen zu den Variablen darf nicht verrutschen.'])

# --------------------------------------------- Mischung und Kalkulation ----
Q.q(r'Aus zwei Sorten zu $2$ € und $3$ € je Liter sollen $30$ Liter zu $2{,}40$ € je Liter gemischt werden. Wie viel Liter der billigen Sorte braucht man?',
    [r'$18$ Liter', r'$12$ Liter', r'$15$ Liter', r'$20$ Liter'],
    [r'Ansatz: $a + b = 30$ und $2a + 3b = 30 \cdot 2{,}40 = 72$.',
     r'Einsetzen von $b = 30 - a$: $2a + 90 - 3a = 72$, also $a = 18$.',
     r'$18$ Liter der billigen und $12$ Liter der teuren Sorte. Probe: $36 + 36 = 72$ €.'])

Q.q(r'Zwei Kaffeesorten kosten $9$ € und $15$ € je Kilogramm. Wie viel der teuren Sorte steckt in $10\,\mathrm{kg}$ Mischung zu $11$ € je Kilogramm?',
    [r'$\dfrac{10}{3} \approx 3{,}33\,\mathrm{kg}$', r'$5\,\mathrm{kg}$', r'$2\,\mathrm{kg}$', r'$6{,}67\,\mathrm{kg}$'],
    [r'Ansatz: $a + b = 10$ und $9a + 15b = 110$.',
     r'$9\,(10 - b) + 15b = 110$, also $90 + 6b = 110$ und $b = \dfrac{10}{3}$.',
     r'Rund $3{,}33\,\mathrm{kg}$ der teuren Sorte. Weil der Mischpreis näher bei $9$ € liegt, muss die billige Sorte überwiegen.'])

Q.q(r'Bei $100$ Stück betragen die Gesamtkosten $700$ €, bei $200$ Stück $1200$ €. Wie hoch sind die variablen Kosten je Stück?',
    [r'$5$ €', r'$7$ €', r'$6$ €', r'$2$ €'],
    [r'Ansatz $K(x) = kx + f$: $100k + f = 700$ und $200k + f = 1200$.',
     r'Subtrahieren: $100k = 500$, also $k = 5$ €.',
     r'Probe: mit $f = 200$ € ergibt sich $K(100) = 700$ €.'])

Q.q(r'Wie hoch sind in der vorigen Aufgabe die Fixkosten?',
    [r'$200$ €', r'$500$ €', r'$700$ €', r'$100$ €'],
    [r'Aus $100 \cdot 5 + f = 700$ folgt $f = 200$ €.',
     r'Die Kostenfunktion lautet $K(x) = 5x + 200$.',
     r'Die Fixkosten sind der Funktionswert bei $x = 0$, sie fallen auch ohne Produktion an.'])

Q.q(r'Drei Hefte und zwei Stifte kosten $11$ €, zwei Hefte und vier Stifte kosten $14$ €. Was kostet ein Heft?',
    [r'$2$ €', r'$2{,}50$ €', r'$3$ €', r'$1{,}50$ €'],
    [r'Ansatz: $3h + 2s = 11$ und $2h + 4s = 14$.',
     r'Die erste Gleichung mit $2$ multiplizieren: $6h + 4s = 22$; davon die zweite abziehen: $4h = 8$.',
     r'$h = 2$ € und damit $s = 2{,}50$ €. Probe: $6 + 5 = 11$ und $4 + 10 = 14$.'])

Q.q(r'Zwei Handytarife: A kostet $10$ € Grundgebühr und $0{,}10$ € je Minute, B kostet $4$ € und $0{,}25$ € je Minute. Ab welcher Gesprächszeit ist A günstiger?',
    [r'ab mehr als $40$ Minuten', r'ab mehr als $24$ Minuten',
     r'ab mehr als $60$ Minuten', r'A ist nie günstiger'],
    [r'Gleichsetzen: $0{,}10x + 10 = 0{,}25x + 4$.',
     r'$6 = 0{,}15x$, also $x = 40$.',
     r'Bei $40$ Minuten kosten beide $14$ €; darüber ist A günstiger, weil der Minutenpreis niedriger ist.'])

Q.q(r'Ein Betrieb verkauft Ware zu $9$ € je Stück bei Kosten $K(x) = 5x + 240$. Ab welcher Stückzahl arbeitet er mit Gewinn?',
    [r'ab mehr als $60$ Stück', r'ab mehr als $48$ Stück',
     r'ab mehr als $30$ Stück', r'ab mehr als $27$ Stück'],
    [r'Erlös: $E(x) = 9x$. Gewinnschwelle bei $E(x) = K(x)$.',
     r'$9x = 5x + 240$, also $4x = 240$ und $x = 60$.',
     r'Bei $60$ Stück ist der Gewinn null, darüber positiv. Probe: $540 = 300 + 240$.'])

# ------------------------------------------------------------- Bewegung ----
Q.q(r'Ein Boot fährt $24\,\mathrm{km}$ flussabwärts in $2$ Stunden und dieselbe Strecke flussaufwärts in $3$ Stunden. Wie schnell ist das Boot im stehenden Wasser?',
    [r'$10\,\mathrm{km/h}$', r'$12\,\mathrm{km/h}$', r'$8\,\mathrm{km/h}$', r'$2\,\mathrm{km/h}$'],
    [r'Ansatz: $(b + s) \cdot 2 = 24$ und $(b - s) \cdot 3 = 24$, also $b + s = 12$ und $b - s = 8$.',
     r'Addieren: $2b = 20$, also $b = 10\,\mathrm{km/h}$.',
     r'Probe: mit $s = 2$ ergibt sich $12 \cdot 2 = 24$ und $8 \cdot 3 = 24$.'])

Q.q(r'Wie schnell fließt der Fluss in der vorigen Aufgabe?',
    [r'$2\,\mathrm{km/h}$', r'$4\,\mathrm{km/h}$', r'$1\,\mathrm{km/h}$', r'$10\,\mathrm{km/h}$'],
    [r'Aus $b + s = 12$ und $b = 10$ folgt $s = 2\,\mathrm{km/h}$.',
     r'Flussabwärts addieren sich die Geschwindigkeiten, flussaufwärts subtrahieren sie sich.',
     r'Probe: $10 - 2 = 8$ und $8 \cdot 3 = 24\,\mathrm{km}$.'])

Q.q(r'Zwei Orte liegen $180\,\mathrm{km}$ auseinander. Zwei Fahrzeuge starten gleichzeitig aufeinander zu, eines mit $80\,\mathrm{km/h}$, das andere mit $100\,\mathrm{km/h}$. Nach welcher Zeit treffen sie sich?',
    [r'nach $1$ Stunde', r'nach $1{,}5$ Stunden', r'nach $2$ Stunden', r'nach $0{,}9$ Stunden'],
    [r'Die Annäherungsgeschwindigkeit ist die Summe: $180\,\mathrm{km/h}$.',
     r'$t = \dfrac{180}{180} = 1$ Stunde.',
     r'Probe: $80 + 100 = 180\,\mathrm{km}$ in einer Stunde, genau die Entfernung.'])

Q.q(r'Ein Radfahrer startet mit $15\,\mathrm{km/h}$. Zwei Stunden später startet ein Auto mit $75\,\mathrm{km/h}$ vom selben Ort. Nach welcher Fahrzeit des Autos hat es den Radfahrer eingeholt?',
    [r'nach $0{,}5$ Stunden', r'nach $2$ Stunden', r'nach $1$ Stunde', r'nach $1{,}5$ Stunden'],
    [r'Vorsprung des Radfahrers: $2 \cdot 15 = 30\,\mathrm{km}$.',
     r'Ansatz: $75t = 15t + 30$, also $60t = 30$.',
     r'$t = 0{,}5$ Stunden. Probe: das Auto fährt $37{,}5\,\mathrm{km}$, der Radfahrer ist dann $30 + 7{,}5 = 37{,}5\,\mathrm{km}$ weit.'])

# --------------------------------------------------- Technik und Alltag ----
Q.q(r'Aus zwei Legierungen mit $40\,\%$ und $70\,\%$ Kupferanteil sollen $60\,\mathrm{kg}$ mit $50\,\%$ Kupfer entstehen. Wie viel der ersten Legierung wird gebraucht?',
    [r'$40\,\mathrm{kg}$', r'$20\,\mathrm{kg}$', r'$30\,\mathrm{kg}$', r'$45\,\mathrm{kg}$'],
    [r'Ansatz: $a + b = 60$ und $0{,}40a + 0{,}70b = 0{,}50 \cdot 60 = 30$.',
     r'$0{,}40a + 0{,}70\,(60 - a) = 30$ ergibt $42 - 0{,}30a = 30$, also $a = 40$.',
     r'$40\,\mathrm{kg}$ der ersten und $20\,\mathrm{kg}$ der zweiten Legierung.'])

Q.q(r'Ein Rechteck hat den Umfang $26\,\mathrm{cm}$, die Länge ist um $3\,\mathrm{cm}$ größer als die Breite. Wie lauten die Seiten?',
    [r'$8\,\mathrm{cm}$ und $5\,\mathrm{cm}$', r'$10\,\mathrm{cm}$ und $3\,\mathrm{cm}$',
     r'$9\,\mathrm{cm}$ und $6\,\mathrm{cm}$', r'$7\,\mathrm{cm}$ und $4\,\mathrm{cm}$'],
    [r'Ansatz: $2\,(l + b) = 26$ und $l = b + 3$.',
     r'$l + b = 13$, eingesetzt: $b + 3 + b = 13$, also $b = 5$.',
     r'$l = 8$. Probe: $2 \cdot 13 = 26\,\mathrm{cm}$.'])

Q.q(r'Auf einem Hof leben Hühner und Kaninchen: $20$ Köpfe und $56$ Beine. Wie viele Kaninchen sind es?',
    [r'$8$ Kaninchen', r'$12$ Kaninchen', r'$10$ Kaninchen', r'$6$ Kaninchen'],
    [r'Ansatz: $h + k = 20$ und $2h + 4k = 56$.',
     r'$2\,(20 - k) + 4k = 56$ ergibt $40 + 2k = 56$, also $k = 8$.',
     r'$8$ Kaninchen und $12$ Hühner. Probe: $24 + 32 = 56$ Beine.'])

Q.q(r'Ein Betrieb fertigt zwei Gerätesorten. Für $5$ Geräte der Sorte A und $3$ der Sorte B werden $31$ Bauteile gebraucht, für $2$ Geräte A und $4$ der Sorte B $18$ Bauteile. Wie viele Bauteile stecken in einem Gerät A?',
    [r'$5$ Bauteile', r'$2$ Bauteile', r'$4$ Bauteile', r'$3$ Bauteile'],
    [r'Ansatz: $5a + 3b = 31$ und $2a + 4b = 18$.',
     r'Die zweite Gleichung durch $2$ teilen: $a + 2b = 9$, also $a = 9 - 2b$.',
     r'Einsetzen: $45 - 10b + 3b = 31$ ergibt $-7b = -14$, also $b = 2$ und $a = 5$. Probe: $25 + 6 = 31$ und $10 + 8 = 18$.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, y, t = sp.symbols('x y t')
    S = lambda eqs, vs: sp.solve(eqs, vs, dict=True)
    a, b = sp.symbols('a b')
    assert S([x + y - 34, x - y - 8], [x, y]) == [{x: 21, y: 13}]
    v, s_ = sp.symbols('v s_')
    assert S([v - 3 * s_, v + s_ - 48], [v, s_]) == [{v: 36, s_: 12}]
    assert S([x - 2 * y, x + y - 27], [x, y]) == [{x: 18, y: 9}]
    # Mischung und Kalkulation
    assert S([a + b - 30, 2 * a + 3 * b - 72], [a, b]) == [{a: 18, b: 12}]
    assert 30 * F(240, 100) == 72 and 2 * 18 + 3 * 12 == 72
    assert S([a + b - 10, 9 * a + 15 * b - 110], [a, b]) == [{a: F(20, 3), b: F(10, 3)}]
    assert abs(float(F(10, 3)) - 3.33) < 0.005 and abs(float(F(20, 3)) - 6.67) < 0.005
    k, f = sp.symbols('k f')
    assert S([100 * k + f - 700, 200 * k + f - 1200], [k, f]) == [{k: 5, f: 200}]
    h, sti = sp.symbols('h sti')
    assert S([3 * h + 2 * sti - 11, 2 * h + 4 * sti - 14], [h, sti]) == [{h: 2, sti: F(5, 2)}]
    assert 3 * 2 + 2 * F(5, 2) == 11 and 2 * 2 + 4 * F(5, 2) == 14
    assert sp.solve(sp.Eq(F(10, 100) * x + 10, F(25, 100) * x + 4), x) == [40]
    assert F(10, 100) * 40 + 10 == 14 == F(25, 100) * 40 + 4
    assert sp.solve(sp.Eq(9 * x, 5 * x + 240), x) == [60] and 9 * 60 == 540 == 5 * 60 + 240
    # Bewegung
    bo, st = sp.symbols('bo st')
    assert S([bo + st - 12, bo - st - 8], [bo, st]) == [{bo: 10, st: 2}]
    assert (10 + 2) * 2 == 24 and (10 - 2) * 3 == 24
    assert F(180, 80 + 100) == 1 and 80 + 100 == 180
    assert sp.solve(sp.Eq(75 * t, 15 * t + 30), t) == [F(1, 2)]
    assert 75 * F(1, 2) == F(75, 2) and 15 * F(1, 2) + 30 == F(75, 2)
    # Technik und Alltag
    assert S([a + b - 60, F(40, 100) * a + F(70, 100) * b - 30], [a, b]) == [{a: 40, b: 20}]
    assert F(50, 100) * 60 == 30
    l_, br = sp.symbols('l_ br')
    assert S([2 * (l_ + br) - 26, l_ - (br + 3)], [l_, br]) == [{l_: 8, br: 5}]
    hu, ka = sp.symbols('hu ka')
    assert S([hu + ka - 20, 2 * hu + 4 * ka - 56], [hu, ka]) == [{hu: 12, ka: 8}]
    assert 2 * 12 + 4 * 8 == 56
    assert S([5 * a + 3 * b - 31, 2 * a + 4 * b - 18], [a, b]) == [{a: 5, b: 2}]
    assert 5 * 5 + 3 * 2 == 31 and 2 * 5 + 4 * 2 == 18 and 45 - 10 * 2 + 3 * 2 == 31


Q.verify(check)
Q.save()
