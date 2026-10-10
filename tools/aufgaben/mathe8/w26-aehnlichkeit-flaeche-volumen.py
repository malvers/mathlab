#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 26 / KW 11 (LB 4): Längen, Flächen und
Volumen bei Ähnlichkeit - k, k² und k³. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=26, slug='aehnlichkeit-flaeche-volumen', thema='Längen, Flächen und Volumen bei Ähnlichkeit', lb='LB 4',
        blurb='a’ = k · a, A’ = k² · A, V’ = k³ · V, Modelle, Pläne und Gulliver',
        comment='Blocks: rules k, k^2, k^3 (1-4, 8-9, 15-16, 18-20), scale drawings and models (5-7, 17), context (10-14). Problem 14 after Swift, Gulliver.')

# --------------------------------------------------------------- Regeln ----
Q.q(r'Eine Figur wird mit $k = 3$ vergrößert. Wie ändert sich ihr Flächeninhalt?',
    [r'Er wird 9-mal so groß.', r'Er wird 3-mal so groß.', r'Er wird 6-mal so groß.', r'Er wird 27-mal so groß.'],
    [r'Flächen wachsen mit dem Quadrat des Streckfaktors: $A’ = k^2 \cdot A$.',
     r'$3^2 = 9$'])

Q.q(r'Ein Körper wird mit $k = 2$ vergrößert. Wie ändert sich sein Volumen?',
    [r'Es wird 8-mal so groß.', r'Es wird 2-mal so groß.', r'Es wird 4-mal so groß.', r'Es wird 6-mal so groß.'],
    [r'Volumen wachsen mit der dritten Potenz: $V’ = k^3 \cdot V$.',
     r'$2^3 = 8$: In einen doppelt so großen Würfel passen 8 kleine.'])

Q.q(r'Ein Quadrat mit 4 cm² Flächeninhalt wird mit $k = 3$ gestreckt. Wie groß ist der neue Flächeninhalt?',
    [r'36 cm²', r'12 cm²', r'7 cm²', r'108 cm²'],
    [r'$A’ = k^2 \cdot A = 9 \cdot 4$',
     r'$A’ = 36$ cm²; Probe: Seite 2 cm wird 6 cm, $6^2 = 36$.'])

Q.q(r'Ein Würfel mit 5 cm³ Volumen wird mit $k = 2$ vergrößert. Wie groß ist das neue Volumen?',
    [r'40 cm³', r'10 cm³', r'20 cm³', r'125 cm³'],
    [r'$V’ = k^3 \cdot V = 8 \cdot 5 = 40$ cm³'])

# ------------------------------------------------------- Pläne und Modelle ----
Q.q(r'Ein Stadtplan hat den Maßstab 1 : 10 000. Ein Park bedeckt auf dem Plan 1 cm². Wie groß ist er in Wirklichkeit?',
    [r'10 000 m² (1 ha)', r'100 m²', r'10 000 cm²', r'1 km²'],
    [r'1 cm auf dem Plan sind 10 000 cm = 100 m.',
     r'1 cm² auf dem Plan sind $100 \text{ m} \cdot 100 \text{ m} = 10\,000$ m².',
     r'Flächenfaktor: $10\,000^2$, nicht 10 000.'])

Q.q(r'Ein Hausmodell im Maßstab 1 : 20 hat eine Wand mit 150 cm² Fläche. Wie groß ist die echte Wand?',
    [r'6 m²', r'0,3 m²', r'60 m²', r'3 m²'],
    [r'Flächenfaktor: $20^2 = 400$',
     r'$150 \cdot 400 = 60\,000$ cm² = 6 m²'])

Q.q(r'Ein Modell eines Tanks im Maßstab 1 : 10 fasst 2 Liter. Wie viel fasst der echte Tank?',
    [r'2000 l', r'20 l', r'200 l', r'20 000 l'],
    [r'Volumenfaktor: $10^3 = 1000$',
     r'$2 \cdot 1000 = 2000$ l'])

Q.q(r'Die Flächeninhalte zweier ähnlicher Figuren verhalten sich wie 1 : 4. Wie verhalten sich entsprechende Längen?',
    [r'1 : 2', r'1 : 4', r'1 : 16', r'1 : 8'],
    [r'$k^2 = 4$', r'$k = 2$, also Längen 1 : 2'])

Q.q(r'Ein ähnlicher Körper hat das 27-fache Volumen. Wie groß ist der Streckfaktor?',
    [r'$k = 3$', r'$k = 9$', r'$k = 27$', r'$k = 5{,}2$'],
    [r'$k^3 = 27$',
     r'$k = 3$, denn $3 \cdot 3 \cdot 3 = 27$.'])

# ---------------------------------------------------------------- Sachbezug ----
Q.q(r'Eine Pizza mit 15 cm Durchmesser kostet 4 €. Welcher Preis wäre für eine gleich dicke Pizza mit 30 cm Durchmesser fair?',
    [r'16 €', r'8 €', r'12 €', r'32 €'],
    [r'Doppelter Durchmesser: $k = 2$.',
     r'Die Fläche wird $2^2 = 4$-mal so groß.',
     r'$4 \cdot 4 = 16$ €'])

Q.q(r'Für eine Statue braucht man 2 Liter Farbe. Eine ähnliche Statue ist doppelt so hoch. Wie viel Farbe braucht sie?',
    [r'8 Liter', r'4 Liter', r'16 Liter', r'6 Liter'],
    [r'Farbe bedeckt die Oberfläche: Faktor $k^2 = 4$.',
     r'$2 \cdot 4 = 8$ Liter'])

Q.q(r'Ein massiver Schokoladenhase ist 10 cm hoch und wiegt 100 g. Wie schwer ist ein ähnlicher massiver Hase mit 20 cm Höhe?',
    [r'800 g', r'200 g', r'400 g', r'1000 g'],
    [r'Die Masse hängt vom Volumen ab: Faktor $k^3 = 8$.',
     r'$100 \cdot 8 = 800$ g'])

Q.q(r'Ein Foto im Format 10 cm × 15 cm wird ähnlich auf 20 cm × 30 cm vergrößert. Wie viel Mal so groß ist die Bildfläche?',
    [r'4-mal', r'2-mal', r'8-mal', r'3-mal'],
    [r'$k = 2$',
     r'Fläche: $150$ cm² wird $600$ cm², also $k^2 = 4$.'])

Q.q(r'In Swifts „Gullivers Reisen“ ist Gulliver 12-mal so groß wie die Liliputaner. Für wie viele Liliputaner muss er essen, wenn der Bedarf dem Körpervolumen entspricht?',
    [r'1728', r'144', r'12', r'36'],
    [r'Volumenfaktor: $12^3 = 12 \cdot 12 \cdot 12 = 1728$',
     r'Quelle: Jonathan Swift, Gullivers Reisen (1726); dort rechnen die Liliputaner genau mit 1728 Portionen.'])

Q.q(r'Ein Würfel wird mit $k = 2$ vergrößert. Was gilt für Oberfläche und Volumen?',
    [r'Oberfläche 4-mal, Volumen 8-mal so groß', r'Oberfläche und Volumen jeweils 2-mal so groß',
     r'Oberfläche 8-mal, Volumen 4-mal so groß', r'Oberfläche und Volumen jeweils 4-mal so groß'],
    [r'Oberfläche: $k^2 = 4$, Volumen: $k^3 = 8$.',
     r'Große Körper haben deshalb im Verhältnis zum Volumen weniger Oberfläche.'])

Q.q(r'Eine Figur hat 50 cm² Flächeninhalt, eine ähnliche Figur 450 cm². Wie groß ist der Streckfaktor?',
    [r'$k = 3$', r'$k = 9$', r'$k = 400$', r'$k = 4{,}5$'],
    [r'$k^2 = 450 : 50 = 9$',
     r'$k = 3$'])

Q.q(r'Ein Zimmer ist im Plan 1 : 100 genau 20 cm² groß. Wie groß ist es in Wirklichkeit?',
    [r'20 m²', r'2 m²', r'200 m²', r'0,2 m²'],
    [r'Flächenfaktor: $100^2 = 10\,000$',
     r'$20 \cdot 10\,000 = 200\,000$ cm² = 20 m²'])

Q.q(r'Der Radius eines Balls wird verdoppelt. Wie ändert sich das Volumen?',
    [r'Es wird 8-mal so groß.', r'Es wird 2-mal so groß.', r'Es wird 4-mal so groß.', r'Es wird 16-mal so groß.'],
    [r'Alle Kugeln sind ähnlich, $k = 2$.',
     r'$V’ = 2^3 \cdot V = 8V$'])

Q.q(r'Ein Würfel mit 2 cm Kantenlänge hat die Oberfläche 24 cm². Wie groß ist die Oberfläche eines Würfels mit 6 cm Kantenlänge?',
    [r'216 cm²', r'72 cm²', r'648 cm²', r'144 cm²'],
    [r'$k = 6 : 2 = 3$, Flächenfaktor $k^2 = 9$',
     r'$24 \cdot 9 = 216$ cm²; Probe: $6 \cdot 6^2 = 216$.'])

Q.q(r'Das Volumen eines Körpers wird bei einer ähnlichen Vergrößerung 64-mal so groß. Wie viel Mal so lang werden die Kanten?',
    [r'4-mal', r'8-mal', r'16-mal', r'32-mal'],
    [r'$k^3 = 64$',
     r'$k = 4$, denn $4^3 = 64$.'])


def check():
    assert 3 ** 2 == 9 and 2 ** 3 == 8
    assert 9 * 4 == 36 == 6 ** 2 and 8 * 5 == 40
    assert (10000 / 100) ** 2 == 10000
    assert 150 * 20 ** 2 == 60000 and 60000 / 10000 == 6
    assert 2 * 10 ** 3 == 2000
    assert 4 ** 0.5 == 2 and round(27 ** (1 / 3)) == 3
    assert 4 * 2 ** 2 == 16 and 2 * 2 ** 2 == 8 and 100 * 2 ** 3 == 800
    assert 10 * 15 * 4 == 20 * 30
    assert 12 ** 3 == 1728
    assert (450 / 50) ** 0.5 == 3
    assert 20 * 100 ** 2 / 10000 == 20
    assert 24 * 3 ** 2 == 216 == 6 * 6 ** 2
    assert 4 ** 3 == 64


Q.verify(check)
Q.save()
