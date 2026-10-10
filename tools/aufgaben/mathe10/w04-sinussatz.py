#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 4 / KW 37 (LB 1): der Sinussatz.
Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=4, slug='sinussatz', thema='Der Sinussatz', lb='LB 1',
         blurb='Sinussatz aufstellen und umstellen, Seiten und Winkel in beliebigen Dreiecken, Entfernungen',
         comment='Blocks: the law (1-4), sides (5-9), angles (10-14), context and number of solutions (15-20). Results rounded to one decimal.')

# ----------------------------------------------------------------- Der Satz ----
Q.q(r'Wie lautet der Sinussatz für ein Dreieck mit den Seiten $a$, $b$, $c$ und den gegenüberliegenden Winkeln $\alpha$, $\beta$, $\gamma$?',
    [r'$\dfrac{a}{\sin \alpha} = \dfrac{b}{\sin \beta} = \dfrac{c}{\sin \gamma}$', r'$\dfrac{a}{\sin \beta} = \dfrac{b}{\sin \alpha}$',
     r'$a \cdot \sin \alpha = b \cdot \sin \beta = c \cdot \sin \gamma$', r'$a^2 = b^2 + c^2 - 2bc \cdot \sin \alpha$'],
    [r'Jede Seite gehört zu dem Winkel, der ihr gegenüberliegt.',
     r'Das Verhältnis Seite durch Sinus des Gegenwinkels ist in jedem Dreieck für alle drei Paare gleich.'])

Q.q(r'Wann hilft der Sinussatz weiter?',
    [r'wenn zwei Winkel und eine Seite bekannt sind', r'wenn nur die drei Seiten bekannt sind',
     r'wenn zwei Seiten und der eingeschlossene Winkel bekannt sind', r'wenn nur die drei Winkel bekannt sind'],
    [r'Der Sinussatz braucht ein vollständiges Paar aus Seite und Gegenwinkel.',
     r'Bei zwei Winkeln kennt man auch den dritten, damit ist zu jeder bekannten Seite der Gegenwinkel bekannt.',
     r'Für drei Seiten oder für zwei Seiten mit eingeschlossenem Winkel braucht man den Kosinussatz.'])

Q.q(r'Stelle $\dfrac{a}{\sin \alpha} = \dfrac{b}{\sin \beta}$ nach $b$ um.',
    [r'$b = \dfrac{a \cdot \sin \beta}{\sin \alpha}$', r'$b = \dfrac{a \cdot \sin \alpha}{\sin \beta}$',
     r'$b = \dfrac{\sin \beta}{a \cdot \sin \alpha}$', r'$b = a \cdot \sin \alpha \cdot \sin \beta$'],
    [r'Beide Seiten mit $\sin \beta$ multiplizieren.',
     r'$b = \dfrac{a}{\sin \alpha} \cdot \sin \beta = \dfrac{a \cdot \sin \beta}{\sin \alpha}$'])

Q.q(r'Was liefert der Sinussatz in einem rechtwinkligen Dreieck mit $\gamma = 90^\circ$?',
    [r'$a = c \cdot \sin \alpha$', r'$a = c \cdot \cos \alpha$', r'$a = \dfrac{c}{\sin \alpha}$', r'$a = \dfrac{\sin \alpha}{c}$'],
    [r'$\sin 90^\circ = 1$, also $\dfrac{a}{\sin \alpha} = \dfrac{c}{1}$.',
     r'Daraus $a = c \cdot \sin \alpha$ – genau die bekannte Sinus-Beziehung im rechtwinkligen Dreieck.'])

# ------------------------------------------------------------------ Seiten ----
Q.q(r'Gegeben: $a = 8$ cm, $\alpha = 40^\circ$, $\beta = 60^\circ$. Berechne $b$ (gerundet).',
    [r'10,8 cm', r'5,9 cm', r'12 cm', r'12,3 cm'],
    [r'$b = \dfrac{a \cdot \sin \beta}{\sin \alpha} = \dfrac{8 \cdot \sin 60^\circ}{\sin 40^\circ}$',
     r'$b \approx \dfrac{8 \cdot 0{,}866}{0{,}643} \approx 10{,}8$ cm',
     r'Achtung: Seiten verhalten sich nicht wie die Winkel selbst – $8 \cdot \dfrac{60}{40} = 12$ ist falsch.'])

Q.q(r'Gegeben: $c = 12$ cm, $\alpha = 50^\circ$, $\gamma = 85^\circ$. Berechne $a$ (gerundet).',
    [r'9,2 cm', r'15,6 cm', r'7,1 cm', r'8,5 cm'],
    [r'$a = \dfrac{c \cdot \sin \alpha}{\sin \gamma} = \dfrac{12 \cdot \sin 50^\circ}{\sin 85^\circ}$',
     r'$a \approx \dfrac{12 \cdot 0{,}766}{0{,}996} \approx 9{,}2$ cm'])

Q.q(r'Im selben Dreieck ($c = 12$ cm, $\alpha = 50^\circ$, $\gamma = 85^\circ$): Berechne $b$ (gerundet).',
    [r'8,5 cm', r'9,2 cm', r'12 cm', r'6,4 cm'],
    [r'Zuerst den dritten Winkel: $\beta = 180^\circ - 50^\circ - 85^\circ = 45^\circ$.',
     r'$b = \dfrac{12 \cdot \sin 45^\circ}{\sin 85^\circ} \approx \dfrac{12 \cdot 0{,}707}{0{,}996} \approx 8{,}5$ cm'])

Q.q(r'Ein Dreieck hat die Seite $c = 10$ cm mit den anliegenden Winkeln $\alpha = 45^\circ$ und $\beta = 75^\circ$. Wie lang ist $a$ (gerundet)?',
    [r'8,2 cm', r'11,2 cm', r'12,2 cm', r'7,5 cm'],
    [r'Gegenwinkel von $c$: $\gamma = 180^\circ - 45^\circ - 75^\circ = 60^\circ$.',
     r'$a = \dfrac{10 \cdot \sin 45^\circ}{\sin 60^\circ} \approx \dfrac{7{,}07}{0{,}866} \approx 8{,}2$ cm'])

Q.q(r'In einem Dreieck ist $\alpha = 30^\circ$ und $\beta = 90^\circ$. In welchem Verhältnis stehen $a$ und $b$?',
    [r'$a : b = 1 : 2$', r'$a : b = 1 : 3$', r'$a : b = 2 : 1$', r'$a : b = 3 : 1$'],
    [r'$\dfrac{a}{b} = \dfrac{\sin 30^\circ}{\sin 90^\circ} = \dfrac{0{,}5}{1}$',
     r'Also ist $a$ halb so lang wie $b$.'])

# ------------------------------------------------------------------ Winkel ----
Q.q(r'Gegeben: $a = 7$ cm, $b = 5$ cm, $\alpha = 70^\circ$. Berechne $\beta$ (gerundet).',
    [r'$42{,}2^\circ$', r'$137{,}8^\circ$', r'$50{,}0^\circ$', r'$47{,}8^\circ$'],
    [r'$\sin \beta = \dfrac{b \cdot \sin \alpha}{a} = \dfrac{5 \cdot \sin 70^\circ}{7} \approx 0{,}671$',
     r'$\beta \approx 42{,}2^\circ$. Die zweite Lösung $137{,}8^\circ$ ist unmöglich: mit $70^\circ$ wäre die Summe über $180^\circ$.'])

Q.q(r'Im selben Dreieck ($\alpha = 70^\circ$, $\beta \approx 42{,}2^\circ$): Wie groß ist $\gamma$?',
    [r'$67{,}8^\circ$', r'$22{,}2^\circ$', r'$112{,}2^\circ$', r'$42{,}2^\circ$'],
    [r'Winkelsumme: $\gamma = 180^\circ - 70^\circ - 42{,}2^\circ = 67{,}8^\circ$'])

Q.q(r'Im selben Dreieck ($a = 7$ cm, $\alpha = 70^\circ$, $\gamma \approx 67{,}8^\circ$): Wie lang ist $c$ (gerundet)?',
    [r'6,9 cm', r'7,1 cm', r'5,0 cm', r'8,6 cm'],
    [r'$c = \dfrac{a \cdot \sin \gamma}{\sin \alpha} = \dfrac{7 \cdot \sin 67{,}8^\circ}{\sin 70^\circ}$',
     r'$c \approx \dfrac{7 \cdot 0{,}926}{0{,}940} \approx 6{,}9$ cm'])

Q.q(r'Im Dreieck gilt $\sin \beta = 0{,}5$. Welche Winkel kommen für $\beta$ in Frage?',
    [r'$30^\circ$ oder $150^\circ$', r'$30^\circ$ oder $60^\circ$', r'nur $30^\circ$', r'$30^\circ$ oder $330^\circ$'],
    [r'Der Sinus ist für Winkel zwischen $0^\circ$ und $180^\circ$ positiv und symmetrisch zu $90^\circ$: $\sin(180^\circ - \beta) = \sin \beta$.',
     r'Also $30^\circ$ oder $150^\circ$. Welcher passt, entscheidet die Winkelsumme im konkreten Dreieck.'])

Q.q(r'Gegeben: $a = 9$ cm, $b = 6$ cm und $\alpha = 50^\circ$. Wie viele Dreiecke passen dazu?',
    [r'genau eins', r'genau zwei', r'keins', r'unendlich viele'],
    [r'Der bekannte Winkel liegt der größeren Seite gegenüber (Kongruenzsatz SsW).',
     r'Dann ist $\beta$ kleiner als $\alpha$, die stumpfe zweite Lösung scheidet aus: es gibt genau ein Dreieck.'])

# --------------------------------------------------------------- Sachbezug ----
Q.q(r'In einem Dreieck ist $\alpha = 40^\circ$, $\beta = 75^\circ$ und $\gamma = 65^\circ$. Welche Seite ist am längsten?',
    [r'$b$', r'$a$', r'$c$', r'Alle drei sind gleich lang.'],
    [r'Nach dem Sinussatz liegt der größten Seite der größte Winkel gegenüber.',
     r'Der größte Winkel ist $\beta = 75^\circ$, also ist $b$ am längsten.'])

Q.q(r'Was folgt aus dem Sinussatz, wenn in einem Dreieck zwei Winkel gleich groß sind?',
    [r'Die gegenüberliegenden Seiten sind gleich lang.', r'Das Dreieck ist rechtwinklig.',
     r'Alle drei Seiten sind gleich lang.', r'Die dritte Seite ist doppelt so lang.'],
    [r'Aus $\alpha = \beta$ folgt $\sin \alpha = \sin \beta$ und mit dem Sinussatz $a = b$.',
     r'Das Dreieck ist gleichschenklig.'])

Q.q(r'Ein Punkt C liegt jenseits eines Flusses. Von A und B aus (Abstand 100 m) misst man $\angle CAB = 65^\circ$ und $\angle ABC = 70^\circ$. Wie weit ist C von A entfernt (gerundet)?',
    [r'132,9 m', r'128,2 m', r'70,7 m', r'100 m'],
    [r'Winkel bei C: $180^\circ - 65^\circ - 70^\circ = 45^\circ$; er liegt der Basis AB gegenüber.',
     r'Die Strecke AC liegt dem Winkel bei B gegenüber: $AC = \dfrac{100 \cdot \sin 70^\circ}{\sin 45^\circ} \approx 132{,}9$ m.'])

Q.q(r'Zwei Personen stehen 60 m voneinander entfernt in A und B. Einen Baum C sehen sie unter $\angle CAB = 48^\circ$ und $\angle ABC = 72^\circ$. Wie weit ist der Baum von A entfernt (gerundet)?',
    [r'65,9 m', r'51,5 m', r'54,6 m', r'60 m'],
    [r'Winkel beim Baum: $180^\circ - 48^\circ - 72^\circ = 60^\circ$.',
     r'$AC = \dfrac{60 \cdot \sin 72^\circ}{\sin 60^\circ} \approx \dfrac{57{,}06}{0{,}866} \approx 65{,}9$ m'])

Q.q(r'Ein Schiff fährt geradeaus. In A sieht es einen Leuchtturm L unter $32^\circ$ zur Fahrtrichtung, 5 km weiter in B unter $58^\circ$. Wie weit ist das Schiff in B vom Leuchtturm entfernt (gerundet)?',
    [r'6,0 km', r'9,7 km', r'3,1 km', r'5,0 km'],
    [r'Im Dreieck ABL ist der Innenwinkel bei B: $180^\circ - 58^\circ = 122^\circ$, bei L also $180^\circ - 32^\circ - 122^\circ = 26^\circ$.',
     r'BL liegt dem Winkel bei A gegenüber: $BL = \dfrac{5 \cdot \sin 32^\circ}{\sin 26^\circ} \approx \dfrac{2{,}65}{0{,}438} \approx 6{,}0$ km.'])

Q.q(r'Gegeben: $b = 4$ cm, $c = 6$ cm und $\beta = 30^\circ$. Welche Werte kann $\gamma$ haben (gerundet)?',
    [r'$48{,}6^\circ$ oder $131{,}4^\circ$', r'nur $48{,}6^\circ$', r'nur $131{,}4^\circ$', r'$45^\circ$ oder $135^\circ$'],
    [r'$\sin \gamma = \dfrac{6 \cdot \sin 30^\circ}{4} = 0{,}75$, also $\gamma \approx 48{,}6^\circ$ oder $\gamma \approx 131{,}4^\circ$.',
     r'Beide sind möglich, denn $30^\circ + 131{,}4^\circ < 180^\circ$: der Winkel liegt der kleineren Seite gegenüber, es gibt zwei Dreiecke.'])


def check():
    from math import sin, asin, radians as r, degrees as d
    R = lambda x, n=1: round(x, n)
    s = lambda w: sin(r(w))
    assert R(8 * s(60) / s(40)) == 10.8 and R(8 * s(40) / s(60)) == 5.9 and 8 * 60 / 40 == 12 and R(8 * s(80) / s(40)) == 12.3
    assert R(12 * s(50) / s(85)) == 9.2 and R(12 * s(85) / s(50)) == 15.6 and R(12 * 50 / 85) == 7.1 and R(12 * s(45) / s(85)) == 8.5
    assert 180 - 50 - 85 == 45 and R(12 * s(45) / s(50)) == 11.1
    assert 180 - 45 - 75 == 60 and R(10 * s(45) / s(60)) == 8.2 and R(10 * s(75) / s(60)) == 11.2 and R(10 * s(60) / s(45)) == 12.2 and 10 * 45 / 60 == 7.5
    assert s(30) / s(90) == 0.5 or R(s(30) / s(90), 9) == 0.5
    beta = d(asin(5 * s(70) / 7))
    assert R(beta) == 42.2 and R(180 - beta) == 137.8 and R(70 * 5 / 7) == 50.0 and R(90 - beta) == 47.8
    gamma = 180 - 70 - beta
    assert R(gamma) == 67.8
    assert R(7 * s(gamma) / s(70)) == 6.9 and R(7 * s(67.8) / s(70)) == 6.9
    assert R(d(asin(0.5))) == 30
    assert 9 > 6
    assert max([(40, 'a'), (75, 'b'), (65, 'c')])[1] == 'b'
    assert R(100 * s(70) / s(45)) == 132.9 and R(100 * s(65) / s(45)) == 128.2 and R(100 * s(45)) == 70.7
    assert R(60 * s(72) / s(60)) == 65.9 and R(60 * s(48) / s(60)) == 51.5 and R(60 * s(60) / s(72)) == 54.6
    assert 180 - 32 - 122 == 26 and R(5 * s(32) / s(26)) == 6.0 and R(5 * s(122) / s(26)) == 9.7
    g = d(asin(6 * s(30) / 4))
    assert R(g) == 48.6 and R(180 - g) == 131.4 and 30 + 131.4 < 180


Q.verify(check)
Q.save()
