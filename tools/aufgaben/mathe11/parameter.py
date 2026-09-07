#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 8: Einfluss von Parametern - c*f(x), f(x)+c, f(c*x), f(x+c).
Deck: tools/pptx/build_parameter_mathe11.py - Quiz: HTML/mathetest11-parameter.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-parameter", "Strecken, Stauchen, Verschieben", kw=8)

# ---------------------------------------------------------------- AFB I ----
s.task("Am Mischpult", 1,
       r"Ein reiner Ton wird im Tonstudio durch die Schwingung $f(t) = \sin t$ beschrieben: $t$ ist die Zeit, $f(t)$ die Auslenkung der Membran. Am Mischpult gibt es vier Regler, und jeder verändert den Term auf seine Weise.",
       [r"Der **Lautstärkeregler** verdreifacht jede Auslenkung. Gib den neuen Term $g(t)$ an, den Wertebereich und die Amplitude. Was passiert mit den Nullstellen?",
        r"Der Ton wird **eine Oktave höher** gespielt: die Schwingung läuft doppelt so schnell ab. Gib den Term $h(t)$ an. Wie groß sind jetzt Periode und Amplitude?",
        r"Der **Verzögerungsregler** lässt den Ton um eine Viertelperiode, also um $\dfrac{\pi}{2}$, später beginnen. Gib den Term $k(t)$ an und beschreibe, was mit dem Graphen passiert.",
        r"Ein **Gleichspannungsanteil** hebt das ganze Signal um $0{,}5$ an. Gib den Term $m(t)$ und den Wertebereich an. Wie viele Nullstellen hat $m$ auf einer Periode, wie viele hatte $f$?"],
       solution=[
        r"Außen mal drei: $g(t) = 3 \sin t$. Jeder Funktionswert wird verdreifacht, also Wertebereich $-3 \le y \le 3$ und Amplitude $3$. Die Nullstellen bleiben, wo sie sind, denn $3 \cdot 0 = 0$: Streckung in $y$-Richtung, die Nulldurchgänge sind unverändert.",
        r"Innen mal zwei: $h(t) = \sin(2t)$. Was bei $f$ nach der Zeit $2\pi$ geschehen ist, ist bei $h$ schon nach $\pi$ geschehen. Periode $\dfrac{2\pi}{2} = \pi$. Die Amplitude bleibt $1$, denn die $2$ steht innen und wirkt nur waagerecht.",
        r"Später beginnen heißt: der Graph wandert nach **rechts**. Innen ist alles verkehrt herum, also Minus: $k(t) = \sin(t - \tfrac{\pi}{2})$. Probe: $k(\tfrac{\pi}{2}) = \sin 0 = 0$, der Nulldurchgang, der bei $f$ bei $t = 0$ lag, liegt jetzt bei $t = \tfrac{\pi}{2}$.",
        r"Außen plus: $m(t) = \sin t + 0{,}5$. Wertebereich $-0{,}5 \le y \le 1{,}5$. Nullstellen: $\sin t = -0{,}5$ hat auf einer Periode zwei Lösungen, genau wie $\sin t = 0$, also weiterhin zwei, aber an **anderen Stellen**. Eine Verschiebung nach oben verändert Nullstellen, ein Faktor außen nicht."],
       falle=r"Falle in b): $\sin(2t)$ hat die Amplitude $1$, nicht $2$. Der Faktor innen betrifft nur die Periode, nie die Höhe; $2 \sin t$ wäre der doppelt so laute Ton.")

# --------------------------------------------------------------- AFB II ----
s.task("Der Tunnelbogen", 2,
       r"Ein Straßentunnel hat als Querschnitt eine nach unten geöffnete Parabel: **$8$ m breit, in der Mitte $4$ m hoch**. Die Ingenieurin baut den Bogen aus der Normalparabel $f(x) = x^2$ zusammen. Der linke Fußpunkt liegt bei $x = 0$, Höhen in Metern.",
       [r"Welche Eingriffe machen aus der Normalparabel den Bogen $h(x)$? Bestimme den Term. Tipp: Scheitelpunkt zuerst, dann den Faktor aus einem Fußpunkt.",
        r"Ein Lkw ist $2{,}40$ m breit und $3{,}60$ m hoch und fährt genau in der Mitte. Passt er durch? Rechne mit der Höhe des Bogens an der Lkw-Kante.",
        r"Für eine zweigleisige Bahnstrecke soll ein zweiter Tunnel **doppelt so breit**, aber genauso hoch werden. Welcher Parameter erledigt das? Gib den Term $h_2(x)$ an und prüfe Scheitel und Fußpunkte.",
        r"Ein Praktikant schlägt für den breiten Tunnel $2 \cdot h(x)$ vor. Was würde dieser Bogen tatsächlich beschreiben?"],
       solution=[
        r"Scheitel in der Mitte bei $(4 \mid 4)$: Verschiebung um $4$ nach rechts und $4$ nach oben, Spiegelung an der $x$-Achse (nach unten geöffnet) und Stauchung mit einem Faktor $a$: $h(x) = a(x - 4)^2 + 4$. Fußpunkt $h(0) = 0$: $16a + 4 = 0$, also $a = -\dfrac{1}{4}$. Ergebnis $h(x) = -\dfrac{1}{4}(x - 4)^2 + 4$. Probe: $h(8) = -\dfrac{1}{4} \cdot 16 + 4 = 0$.",
        r"Der Lkw reicht von $x = 2{,}8$ bis $x = 5{,}2$. Höhe des Bogens an der Kante: $h(5{,}2) = -\dfrac{1}{4} \cdot 1{,}2^2 + 4 = -0{,}36 + 4 = 3{,}64$ m. Das sind $3{,}64 - 3{,}60 = 0{,}04$ m, also $4$ cm Luft: er passt, knapp. Wegen der Symmetrie gilt links dasselbe.",
        r"Breiter in $x$-Richtung heißt innen, verkehrt herum: $h_2(x) = h(\tfrac{1}{2}x)$. Einsetzen: $h_2(x) = -\dfrac{1}{4}(\tfrac{1}{2}x - 4)^2 + 4 = -\dfrac{1}{16}(x - 8)^2 + 4$. Scheitel $(8 \mid 4)$, Fußpunkte $h_2(0) = -\dfrac{64}{16} + 4 = 0$ und $h_2(16) = 0$: $16$ m breit, $4$ m hoch.",
        r"$2 \cdot h(x)$ verdoppelt jeden Funktionswert: der Bogen wäre $8$ m hoch, aber immer noch $8$ m breit, denn die Nullstellen $0$ und $8$ bleiben bei einem Faktor außen erhalten. Breite steuert man innen, Höhe außen."],
       falle=r"Falle in c): $h(2x)$ macht den Tunnel halb so breit, nicht doppelt. Innen bewirkt der Faktor $\tfrac{1}{2}$ die Verdopplung.")

# -------------------------------------------------------------- AFB III ----
s.task("Ein Jahr früher oder fünf Prozent mehr?", 3,
       r"Ein Sparvertrag wächst mit $K(t) = 1\,000 \cdot 1{,}05^t$, $t$ in Jahren, $K$ in Euro. Eine Bankberaterin behauptet: **„Ein Jahr früher anfangen bringt genau dasselbe wie $5\,\%$ mehr Startkapital.“** In der Sprache der Woche: die Verschiebung $K(t + 1)$ nach links soll dasselbe sein wie die Streckung $1{,}05 \cdot K(t)$.",
       [r"Prüfe die Behauptung für $t = 0$ und für $t = 10$.",
        r"Begründe mit einem Potenzgesetz, dass die beiden Eingriffe für **jedes** $t$ dasselbe ergeben. Verallgemeinere: welcher Streckfaktor gehört zu einer Verschiebung um $c$ Jahre nach links?",
        r"Gilt „Verschieben nach links ist dasselbe wie Strecken“ auch für die Normalparabel $f(x) = x^2$? Prüfe mit $f(x + 1)$ und einem Faktor $c \cdot f(x)$ an der Stelle $x = 0$.",
        r"Um wie viele Jahre müsste man früher anfangen, damit es einer **Verdopplung** des Startkapitals entspricht? Deute das Ergebnis."],
       solution=[
        r"$t = 0$: $K(1) = 1\,000 \cdot 1{,}05 = 1\,050$ und $1{,}05 \cdot K(0) = 1{,}05 \cdot 1\,000 = 1\,050$. $t = 10$: $K(11) = 1\,000 \cdot 1{,}05^{11} \approx 1\,710{,}34$ und $1{,}05 \cdot K(10) = 1{,}05 \cdot 1\,000 \cdot 1{,}05^{10}$, also derselbe Term, ebenfalls $\approx 1\,710{,}34$. An beiden Stellen stimmt es.",
        r"$K(t + 1) = 1\,000 \cdot 1{,}05^{t + 1} = 1\,000 \cdot 1{,}05^t \cdot 1{,}05 = 1{,}05 \cdot K(t)$ nach dem Potenzgesetz $a^{t + 1} = a^t \cdot a$. Das gilt für jedes $t$. Allgemein: $K(t + c) = 1{,}05^c \cdot K(t)$, eine Verschiebung um $c$ nach links ist bei dieser Funktion eine Streckung mit dem Faktor $1{,}05^c$. Für $c = 2$ also Faktor $1{,}05^2 = 1{,}1025$, das sind $10{,}25\,\%$ mehr, nicht $10\,\%$.",
        r"Nein. $f(0 + 1) = 1$, aber $c \cdot f(0) = c \cdot 0 = 0$ für jedes $c$. Kein Streckfaktor kann die verschobene Parabel erzeugen, schon die Nullstelle wandert von $0$ nach $-1$, und Strecken lässt Nullstellen unverändert. Die Gleichheit von Verschieben und Strecken ist eine **Besonderheit der Exponentialfunktionen**, keine allgemeine Regel.",
        r"Gesucht ist $c$ mit $1{,}05^c = 2$: $c = \dfrac{\lg 2}{\lg 1{,}05} \approx 14{,}2$. Rund $14$ Jahre früher anfangen wirkt wie das doppelte Startkapital. Deutung: bei prozentualem Wachstum ist **Zeit** gleichwertig mit **Kapital**, jedes Jahr Vorsprung ist ein fester Faktor. Das gilt aber nur, solange der Zinssatz die ganze Zeit $5\,\%$ bleibt."],
       falle=r"$2 \cdot 1{,}05^t$ und $1{,}05^{2t}$ sind verschiedene Dinge: das erste verdoppelt das Kapital, das zweite lässt die Zeit doppelt so schnell laufen, also $1{,}1025$ pro Jahr.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    # AFB I: sin(2t) period, k(pi/2) = 0, range of sin t + 0.5
    assert abs(2 * math.pi / 2 - math.pi) < 1e-12
    assert abs(math.sin(math.pi / 2 - math.pi / 2)) < 1e-12
    assert (-1 + 0.5, 1 + 0.5) == (-0.5, 1.5)
    # AFB II: tunnel h(x) = -1/4 (x-4)^2 + 4
    h = lambda x: -F(1, 4) * (F(x) - 4) ** 2 + 4
    assert 16 * F(-1, 4) + 4 == 0
    assert h(0) == 0 and h(8) == 0 and h(4) == 4
    assert h(F(52, 10)) == F(364, 100) and F(364, 100) - F(360, 100) == F(4, 100)
    assert 4 - F(24, 10) / 2 == F(28, 10) and 4 + F(24, 10) / 2 == F(52, 10)
    h2 = lambda x: h(F(x) / 2)
    for x in (0, 3, 8, 11, 16):
        assert h2(x) == -F(1, 16) * (F(x) - 8) ** 2 + 4
    assert h2(0) == 0 and h2(16) == 0 and h2(8) == 4 and 2 * h(4) == 8
    # AFB III: K(t) = 1000 * 1.05^t
    K = lambda t: 1000 * 1.05 ** t
    assert abs(K(1) - 1050) < 1e-9 and abs(1.05 * K(0) - 1050) < 1e-9
    assert abs(K(11) - 1.05 * K(10)) < 1e-9 and abs(K(11) - 1710.34) < 0.005
    assert abs(1.05 ** 2 - 1.1025) < 1e-12
    c = math.log(2) / math.log(1.05)
    assert abs(c - 14.2) < 0.05 and abs(1.05 ** c - 2) < 1e-9
    assert (0 + 1) ** 2 == 1 and 0 ** 2 == 0


s.verify(check)
s.save()
