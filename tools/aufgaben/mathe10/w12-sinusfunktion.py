#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 12 / KW 47 (LB 2): die Sinusfunktion – Grad- und
Bogenmaß, Einheitskreis, Periodizität. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=12, slug='sinusfunktion', thema='Die Sinusfunktion', lb='LB 2',
         blurb='Grad- und Bogenmaß, Einheitskreis, Nullstellen, Extrema, Periode',
         comment='Blocks: radian measure (1-4, 16, 19), the unit circle (11-12, 9), properties of y = sin x (5-8, 10, 17, 20), context and calculator (13-15, 18).')

Q.q(r'Wie viel sind $180^\circ$ im Bogenmaß?',
    [r'$\pi$', r'$2\pi$', r'$\dfrac{\pi}{2}$', r'180'],
    [r'Der Vollkreis $360^\circ$ hat am Einheitskreis den Umfang $2\pi$.', r'Der halbe Kreis ist also $\pi$.'])

Q.q(r'Wie viel sind $90^\circ$ im Bogenmaß?',
    [r'$\dfrac{\pi}{2}$', r'$\pi$', r'$\dfrac{\pi}{4}$', r'$2\pi$'],
    [r'$90^\circ$ ist ein Viertel des Vollkreises: $\dfrac{2\pi}{4} = \dfrac{\pi}{2}$.'])

Q.q(r'Welchem Winkel in Grad entspricht $\dfrac{\pi}{3}$?',
    [r'$60^\circ$', r'$30^\circ$', r'$120^\circ$', r'$90^\circ$'],
    [r'$\pi$ entspricht $180^\circ$.', r'$\dfrac{180^\circ}{3} = 60^\circ$'])

Q.q(r'Etwa wie viel Grad sind 1 im Bogenmaß?',
    [r'$57{,}3^\circ$', r'$1^\circ$', r'$3{,}14^\circ$', r'$90^\circ$'],
    [r'$1 = \dfrac{180^\circ}{\pi} \approx 57{,}3^\circ$', r'Ein Bogen so lang wie der Radius gehört zu diesem Winkel.'])

Q.q(r'Welche Periode hat $y = \sin x$ (im Bogenmaß)?',
    [r'$2\pi$', r'$\pi$', r'1', r'360'],
    [r'Nach einer vollen Umdrehung am Einheitskreis wiederholen sich alle Werte.', r'Im Bogenmaß ist das $2\pi \approx 6{,}28$.'])

Q.q(r'Welche Nullstellen hat $y = \sin x$ im Intervall $0 \leq x \leq 2\pi$?',
    [r'$0$, $\pi$ und $2\pi$', r'nur $0$', r'$\dfrac{\pi}{2}$ und $\dfrac{3\pi}{2}$', r'$0$ und $2\pi$'],
    [r'Der Sinus ist die y-Koordinate am Einheitskreis.', r'Sie ist null bei $0^\circ$, $180^\circ$ und $360^\circ$, also bei $0$, $\pi$, $2\pi$.'])

Q.q(r'Wo hat $y = \sin x$ im Intervall $0 \leq x \leq 2\pi$ ihren größten Wert?',
    [r'bei $x = \dfrac{\pi}{2}$ mit $y = 1$', r'bei $x = \pi$ mit $y = 1$', r'bei $x = 2\pi$ mit $y = 2\pi$', r'bei $x = \dfrac{3\pi}{2}$ mit $y = 1$'],
    [r'Am Einheitskreis ist der Punkt bei $90^\circ$ ganz oben: y-Koordinate 1.', r'$90^\circ = \dfrac{\pi}{2}$'])

Q.q(r'Welche Werte nimmt $y = \sin x$ an?',
    [r'alle Zahlen von $-1$ bis 1', r'alle Zahlen von 0 bis 1', r'alle Zahlen', r'nur $-1$, 0 und 1'],
    [r'Die y-Koordinate eines Punktes auf dem Einheitskreis liegt zwischen $-1$ und 1.'])

Q.q(r'Welchen Wert hat $\sin 270^\circ$?',
    [r'$-1$', r'1', r'0', r'$0{,}5$'],
    [r'Bei $270^\circ$ ist der Punkt am Einheitskreis ganz unten: $(0 \mid -1)$.'])

Q.q(r'Welche Gleichung drückt aus, dass die Sinusfunktion periodisch ist?',
    [r'$\sin(x + 2\pi) = \sin x$', r'$\sin(2x) = 2 \sin x$', r'$\sin(x + \pi) = \sin x$', r'$\sin(-x) = \sin x$'],
    [r'Nach einer vollen Umdrehung landet man am selben Punkt des Einheitskreises.',
     r'$\sin(x + \pi) = \sin x$ stimmt nicht: eine halbe Umdrehung wechselt das Vorzeichen.'])

Q.q(r'Ein Punkt liegt auf dem Einheitskreis beim Winkel $\alpha$. Welche Koordinaten hat er?',
    [r'$(\cos \alpha \mid \sin \alpha)$', r'$(\sin \alpha \mid \cos \alpha)$', r'$(\alpha \mid \sin \alpha)$', r'$(1 \mid \alpha)$'],
    [r'Im rechtwinkligen Dreieck mit Hypotenuse 1 ist die waagerechte Kathete $\cos \alpha$, die senkrechte $\sin \alpha$.'])

Q.q(r'Welchen Wert hat $\sin 150^\circ$?',
    [r'0,5', r'$-0{,}5$', r'0,866', r'1,5'],
    [r'$150^\circ$ und $30^\circ$ liegen spiegelbildlich zur y-Achse am Einheitskreis: gleiche Höhe.', r'$\sin 150^\circ = \sin 30^\circ = 0{,}5$'])

Q.q(r'Ein Riesenrad hat einen Durchmesser von 36 m, seine Achse liegt 20 m über dem Boden. Wie hoch ist die höchste Gondel?',
    [r'38 m', r'56 m', r'36 m', r'2 m'],
    [r'Radius $36 : 2 = 18$ m.', r'Höchster Punkt: $20 + 18 = 38$ m.'])

Q.q(r'Wie hoch ist bei diesem Riesenrad (Achse 20 m, Durchmesser 36 m) die tiefste Gondel?',
    [r'2 m', r'0 m', r'18 m', r'20 m'],
    [r'Tiefster Punkt: $20 - 18 = 2$ m.', r'Die Höhe schwankt sinusförmig zwischen 2 m und 38 m.'])

Q.q(r'Die Tageslänge schwankt periodisch. Welche Periode hat sie?',
    [r'ein Jahr', r'ein Tag', r'ein Monat', r'zwölf Stunden'],
    [r'Längster Tag im Juni, kürzester im Dezember – im nächsten Jahr wiederholt sich der Verlauf.'])

Q.q(r'Wie lang ist am Einheitskreis der Bogen zu einem Winkel von $90^\circ$ (gerundet)?',
    [r'1,57', r'90', r'3,14', r'0,79'],
    [r'Bogenlänge $= \dfrac{90}{360} \cdot 2\pi = \dfrac{\pi}{2} \approx 1{,}57$'])

Q.q(r'Welche Symmetrie hat der Graph von $y = \sin x$?',
    [r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur y-Achse', r'achsensymmetrisch zur x-Achse', r'keine'],
    [r'$\sin(-x) = -\sin x$: ein Winkel im Uhrzeigersinn führt zum gespiegelten Punkt unterhalb der x-Achse.'])

Q.q(r'Der Taschenrechner zeigt $\sin 30 = -0{,}988$. Woran liegt das?',
    [r'Er rechnet im Bogenmaß (RAD).', r'Er ist kaputt.', r'Der Sinus von 30 ist wirklich negativ.', r'Man muss erst die Wurzel ziehen.'],
    [r'Im Bogenmaß bedeutet 30 einen Winkel von etwa $1719^\circ$.', r'Im Gradmaß (DEG) kommt $\sin 30^\circ = 0{,}5$ heraus.'])

Q.q(r'Wie viel Grad sind $2\pi$?',
    [r'$360^\circ$', r'$180^\circ$', r'$6{,}28^\circ$', r'$720^\circ$'],
    [r'$2\pi$ ist der Umfang des Einheitskreises – eine volle Umdrehung.'])

Q.q(r'In welchen Bereichen steigt $y = \sin x$ im Intervall $0 \leq x \leq 2\pi$?',
    [r'von 0 bis $\dfrac{\pi}{2}$ und von $\dfrac{3\pi}{2}$ bis $2\pi$', r'von 0 bis $\pi$',
     r'von $\dfrac{\pi}{2}$ bis $\dfrac{3\pi}{2}$', r'überall'],
    [r'Vom Tiefpunkt bei $\dfrac{3\pi}{2}$ zum Hochpunkt bei $\dfrac{\pi}{2}$ (der nächsten Periode) steigt der Sinus.',
     r'Im Intervall: von 0 bis $\dfrac{\pi}{2}$ und von $\dfrac{3\pi}{2}$ bis $2\pi$.'])


def check():
    from math import sin, pi, radians as r, degrees as d
    R = lambda x, n=3: round(x, n)
    assert R(r(180)) == R(pi) and R(r(90)) == R(pi / 2) and R(d(pi / 3)) == 60 and round(d(1), 1) == 57.3
    assert all(abs(sin(x)) < 1e-9 for x in (0, pi, 2 * pi))
    assert R(sin(pi / 2)) == 1 and R(sin(r(270))) == -1 and R(sin(r(150))) == 0.5
    assert all(R(sin(x + 2 * pi)) == R(sin(x)) for x in (0.3, 1.1, 2.5))
    assert 20 + 18 == 38 and 20 - 18 == 2
    assert round(pi / 2, 2) == 1.57
    assert R(sin(30)) == -0.988 and round(d(30)) == 1719
    assert sin(0.1) > sin(0) and sin(r(300)) > sin(r(280)) and sin(r(120)) < sin(r(100))


Q.verify(check)
Q.save()
