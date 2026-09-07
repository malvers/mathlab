#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 21: Wahlbereich Numerik - Bisektion und Flaechen in Streifen.
Deck: tools/pptx/build_numerik_mathe11.py - Quiz: HTML/mathetest11-numerik.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-numerik", "Numerische Verfahren", kw=21)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Kiste mit dem Wunschvolumen", 1,
       r"Eine würfelähnliche Kiste soll so gebaut werden, dass ihr Volumen um genau $5$ mehr beträgt als ihre Kantenlänge: $x^3 - x - 5 = 0$. Für diese Gleichung gibt es keine handliche Lösungsformel, also wird sie **numerisch** eingegrenzt.",
       [r"Zeige, dass zwischen $x = 1$ und $x = 2$ eine Lösung liegen muss.",
        r"Führe drei Schritte der Bisektion aus und gib nach jedem Schritt das neue Intervall an.",
        r"Wie lang ist das Intervall nach $n$ Halbierungen? Gib eine Formel an.",
        r"Wie viele Schritte braucht man, um die Lösung auf drei Nachkommastellen genau zu kennen?"],
       solution=[
        r"$f(1) = 1 - 1 - 5 = -5$ und $f(2) = 8 - 2 - 5 = 1$. Die Funktionswerte haben **verschiedene Vorzeichen**, und $f$ ist als Polynom ohne Sprünge. Also muss der Graph dazwischen die $x$-Achse schneiden — es gibt mindestens eine Lösung in $[1; 2]$.",
        r"Erster Schritt: $f(1{,}5) = 3{,}375 - 1{,}5 - 5 = -3{,}125 < 0$, also neues Intervall $[1{,}5; 2]$. Zweiter Schritt: $f(1{,}75) \approx -1{,}391 < 0$, also $[1{,}75; 2]$. Dritter Schritt: $f(1{,}875) \approx -0{,}283 < 0$, also $[1{,}875; 2]$. Die Lösung liegt danach zwischen $1{,}875$ und $2$.",
        r"Jeder Schritt halbiert das Intervall. Aus der Startlänge $1$ wird nach $n$ Schritten die Länge $\dfrac{1}{2^n}$. Nach drei Schritten sind das $0{,}125$, was zum Intervall aus b) passt.",
        r"Drei Nachkommastellen verlangen eine Intervalllänge unter $0{,}001$, also $2^n > 1\,000$. Wegen $2^9 = 512$ und $2^{10} = 1\,024$ genügen **$10$ Schritte**. Die Lösung ist dann auf $\pm 0{,}001$ bekannt; sie liegt bei rund $1{,}904$."],
       falle=r"Die Bisektion braucht zwingend einen **Vorzeichenwechsel** an den Rändern. Ohne ihn liefert das Verfahren keine Aussage, auch wenn im Intervall Nullstellen liegen.")

# --------------------------------------------------------------- AFB II ----
s.task("Die Fläche in Streifen", 2,
       r"Gesucht ist der Flächeninhalt unter der Parabel $f(x) = x^2$ zwischen $x = 0$ und $x = 1$. Statt einer Formel wird die Fläche durch Rechtecke angenähert.",
       [r"Teile das Intervall in $4$ gleiche Streifen und berechne Untersumme und Obersumme.",
        r"Zwischen welchen Werten liegt die gesuchte Fläche also? Wie groß ist die Unsicherheit?",
        r"Wiederhole die Rechnung mit $8$ Streifen und vergleiche die Unsicherheit.",
        r"Begründe allgemein, wie sich die Differenz von Ober- und Untersumme verhält, wenn man die Streifenzahl verdoppelt."],
       solution=[
        r"Streifenbreite $h = 0{,}25$. Die Funktion steigt, also liefert der **linke** Rand die Untersumme und der **rechte** die Obersumme. Untersumme: $(0 + 0{,}0625 + 0{,}25 + 0{,}5625) \cdot 0{,}25 = 0{,}875 \cdot 0{,}25 = 0{,}21875$. Obersumme: $(0{,}0625 + 0{,}25 + 0{,}5625 + 1) \cdot 0{,}25 = 1{,}875 \cdot 0{,}25 = 0{,}46875$.",
        r"Die Fläche liegt zwischen $0{,}21875$ und $0{,}46875$. Die Unsicherheit ist die Differenz $0{,}25$ — noch reichlich grob. Als bester Schätzwert bietet sich die Mitte an: $0{,}34375$.",
        r"Mit $h = 0{,}125$: Untersumme $\dfrac{0 + 1 + 4 + 9 + 16 + 25 + 36 + 49}{512} = \dfrac{140}{512} = 0{,}2734$, Obersumme $\dfrac{204}{512} = 0{,}3984$. Die Unsicherheit ist jetzt $0{,}125$, also genau **halb** so groß wie vorher. Der wahre Wert $\dfrac{1}{3} \approx 0{,}3333$ liegt in beiden Intervallen.",
        r"Bei einer monotonen Funktion unterscheiden sich Ober- und Untersumme nur um die Randstreifen: die Differenz beträgt $\left(f(1) - f(0)\right) \cdot h = 1 \cdot h$. Verdoppelt man die Streifenzahl, halbiert sich $h$ und damit auch die Differenz. Um die Unsicherheit zu zehnteln, braucht man also die zehnfache Streifenzahl — die Genauigkeit wächst hier deutlich schneller als bei einer Simulation mit Zufallszahlen."],
       falle=r"Ob der linke oder der rechte Rand die Untersumme liefert, hängt von der **Monotonie** ab. Bei einer fallenden Funktion ist es genau umgekehrt, und wer das ungeprüft übernimmt, vertauscht Ober- und Untersumme.")

# -------------------------------------------------------------- AFB III ----
s.task("Exakt ist immer besser?", 3,
       r"Ein Mitschüler sagt: **„Numerische Verfahren sind nur Notlösungen. Wenn man richtig rechnen kann, bekommt man immer eine exakte Lösung.“**",
       [r"Nenne zwei Gleichungen aus diesem Schuljahr, für die es keine allgemeine Lösungsformel gibt, und begründe kurz.",
        r"Untersuche $f(x) = x^2$ auf dem Intervall $[-1; 1]$ mit der Bisektion. Was passiert, und warum?",
        r"Nenne eine Situation, in der ein numerisches Ergebnis der exakten Lösung praktisch überlegen ist.",
        r"Beurteile die Aussage und formuliere, wann man exakt und wann numerisch arbeitet."],
       solution=[
        r"Erstens $x^3 - x - 5 = 0$ aus Aufgabe 1: für Gleichungen dritten Grades gibt es zwar eine Formel, sie ist aber unhandlich und liefert hier keinen brauchbaren Ausdruck. Zweitens gemischte Gleichungen wie $2^x = 3x$, in denen die Unbekannte gleichzeitig im Exponenten und in der Basis steht — dafür gibt es mit unseren Mitteln überhaupt kein Auflösungsverfahren. Beide lassen sich nur eingrenzen.",
        r"$f(-1) = 1$ und $f(1) = 1$ — **kein** Vorzeichenwechsel. Die Bisektion meldet, dass sie nichts finden kann, obwohl bei $x = 0$ eine Nullstelle liegt. Der Grund: die Parabel berührt die Achse nur, sie durchquert sie nicht. Das Verfahren findet nur Nullstellen mit Vorzeichenwechsel.",
        r"Wenn eine Zahl gebraucht wird und keine Formel: eine Kantenlänge von $1{,}904$ m lässt sich zuschneiden, ein exakter Wurzelausdruck nicht. Auch beim Vergleich zweier Größen und beim Zeichnen eines Graphen ist die Näherung die brauchbarere Antwort, solange man ihre Genauigkeit kennt.",
        r"Die Aussage ist falsch. Es gibt Gleichungen ohne Lösungsformel, und es gibt Aufgaben, in denen die exakte Form nicht weiterhilft. **Exakt** rechnet man, solange man weiterrechnen, umformen oder etwas beweisen will — Näherungen schleppen dabei Fehler mit. **Numerisch** rechnet man, wenn keine Formel existiert oder wenn ein konkreter Zahlenwert gebraucht wird. Entscheidend ist in beiden Fällen, die Genauigkeit anzugeben: eine Näherung ohne Fehlerschranke ist wertlos."],
       falle=r"„Numerisch“ heißt nicht „ungenau“. Ein Verfahren mit angegebener Fehlerschranke ist verlässlicher als eine exakte Rechnung, in der sich unbemerkt ein Vorzeichenfehler versteckt.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    f = lambda x: x ** 3 - x - 5
    assert f(1) == -5 and f(2) == 1 and f(1) * f(2) < 0
    lo, hi, schritte = F(1), F(2), []
    for _ in range(3):
        m = (lo + hi) / 2
        schritte.append(m)
        if f(m) < 0:
            lo = m
        else:
            hi = m
    assert schritte == [F(3, 2), F(7, 4), F(15, 8)]
    assert f(F(3, 2)) == F(-25, 8) and float(f(F(3, 2))) == -3.125
    assert abs(float(f(F(7, 4))) + 1.390625) < 1e-9
    assert abs(float(f(F(15, 8))) + 0.283203125) < 1e-9
    assert (lo, hi) == (F(15, 8), F(2)) and hi - lo == F(1, 8)
    assert 2 ** 9 == 512 and 2 ** 10 == 1024 and F(1, 1024) < F(1, 1000)
    assert abs(f(1.9042) ) < 0.001
    # rectangles under x^2
    def sums(n):
        h = F(1, n)
        u = sum(F(k, n) ** 2 for k in range(n)) * h
        o = sum(F(k, n) ** 2 for k in range(1, n + 1)) * h
        return u, o
    u4, o4 = sums(4)
    assert u4 == F(7, 32) and o4 == F(15, 32)
    assert float(u4) == 0.21875 and float(o4) == 0.46875 and o4 - u4 == F(1, 4)
    assert float((u4 + o4) / 2) == 0.34375
    u8, o8 = sums(8)
    assert u8 == F(140, 512) and o8 == F(204, 512) and o8 - u8 == F(1, 8)
    assert abs(float(u8) - 0.2734) < 1e-4 and abs(float(o8) - 0.3984) < 1e-4
    assert u4 < F(1, 3) < o4 and u8 < F(1, 3) < o8
    assert (o4 - u4) / (o8 - u8) == 2
    # x^2 has no sign change on [-1, 1]
    g = lambda x: x ** 2
    assert g(-1) == 1 and g(1) == 1 and g(-1) * g(1) > 0 and g(0) == 0


s.verify(check)
s.save()
