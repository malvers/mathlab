#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 23: vermischte Uebungen quer durch alle vier Lernbereiche.
Deck: tools/pptx/build_vermischt_mathe11.py - Quiz: HTML/mathetest11-vermischt.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-vermischt", "Vermischte Übungen", kw=23)

# ---------------------------------------------------------------- AFB I ----
s.task("Der Ferienjob", 1,
       r"Für einen Ferienjob gibt es $11{,}50$ € je Stunde und zusätzlich eine feste Fahrtkostenpauschale von $25$ € je Woche. Der Wochenlohn für $h$ Stunden ist $L(h) = 11{,}50h + 25$.",
       [r"Was verdient man in einer Woche mit $40$ Stunden?",
        r"Wie viele Stunden muss man arbeiten, um auf $600$ € zu kommen?",
        r"Der Stundenlohn steigt um $8\,\%$. Wie hoch ist er dann?",
        r"Stelle $L = s \cdot h + p$ nach $h$ um und berechne damit die Stundenzahl für $600$ € beim neuen Stundenlohn."],
       solution=[
        r"$L(40) = 11{,}50 \cdot 40 + 25 = 460 + 25 = 485$ €.",
        r"$11{,}50h + 25 = 600$ ergibt $11{,}50h = 575$ und damit $h = 50$ Stunden. Probe: $11{,}50 \cdot 50 = 575$, plus $25$ sind $600$ €.",
        r"$11{,}50 \cdot 1{,}08 = 12{,}42$ €. Der Wachstumsfaktor $1{,}08$ ist schneller als der Umweg über $8\,\%$ von $11{,}50$ und anschließendes Addieren, führt aber zum selben Ergebnis: $0{,}92 + 11{,}50 = 12{,}42$.",
        r"$L - p = s \cdot h$, also $h = \dfrac{L - p}{s}$. Mit $L = 600$, $p = 25$ und $s = 12{,}42$: $h = \dfrac{575}{12{,}42} \approx 46{,}3$ Stunden. Durch die Lohnerhöhung spart man also knapp vier Stunden Arbeit für denselben Betrag."],
       falle=r"Die Pauschale gehört nicht in den Stundenlohn. Wer $\dfrac{600}{11{,}50} \approx 52{,}2$ rechnet, vergisst die $25$ € und arbeitet zwei Stunden zu viel.")

# --------------------------------------------------------------- AFB II ----
s.task("Vier Gleichungen, welches Werkzeug?", 2,
       r"Im Übungszirkel liegen vier Gleichungen nebeneinander: **(1)** $5x - 7 = 2x + 8$, **(2)** $x^2 - 6x + 5 = 0$, **(3)** $2^x = 64$ und **(4)** $x^2 = 5x$.",
       [r"Ordne jeder Gleichung das passende Werkzeug zu und begründe kurz.",
        r"Löse alle vier Gleichungen.",
        r"Was fällt an den Lösungen auf?",
        r"Bei welcher Gleichung passieren erfahrungsgemäß die meisten Fehler? Erkläre den typischen Fehler und wie man ihn vermeidet."],
       solution=[
        r"(1) **Äquivalenzumformung**: eine lineare Gleichung, sortieren und normieren genügt. (2) **pq-Formel oder Vieta**: Normalform mit absolutem Glied. (3) **gleiche Basis**: rechts steht eine Zweierpotenz, dann vergleicht man die Exponenten. (4) **Ausklammern**: kein absolutes Glied, also nicht die pq-Formel bemühen.",
        r"(1) $3x = 15$, also $x = 5$. (2) Über Vieta: gesucht sind zwei Zahlen mit Summe $6$ und Produkt $5$ — das sind $1$ und $5$. (3) $64 = 2^6$, also $x = 6$. (4) $x^2 - 5x = 0$, ausgeklammert $x(x - 5) = 0$, also $x = 0$ oder $x = 5$.",
        r"In drei von vier Gleichungen kommt die Lösung $5$ vor — die Aufgaben sind bewusst so gebaut. Das ist eine bequeme Kontrolle, aber kein Argument: geprüft wird durch **Einsetzen**, nicht durch Wiedererkennen.",
        r"Bei (4). Der typische Fehler ist, beide Seiten durch $x$ zu teilen: dann bleibt $x = 5$ übrig, und die Lösung $x = 0$ geht verloren. Vermeiden lässt sich das mit einer festen Regel: **zuerst alles auf eine Seite bringen, sodass rechts null steht**, und dann ausklammern statt teilen. Ein Produkt ist genau dann null, wenn ein Faktor null ist — so bleiben beide Lösungen erhalten."],
       falle=r"Die pq-Formel ist nicht der Universalschlüssel. Bei (3) ist sie gar nicht anwendbar, bei (4) unnötig, und bei (1) wäre sie ein Umweg — das Werkzeug wählt man **vor** dem Rechnen.")

# -------------------------------------------------------------- AFB III ----
s.task("Ergebnis da, also fertig?", 3,
       r"Vier Schülerinnen und Schüler legen ihre Ergebnisse vor. **(1)** „Ein Rechteck mit Umfang $20$ m und Fläche $30\ \mathrm{m^2}$ hat die Seiten …“ **(2)** „Die Wahrscheinlichkeit beträgt $1{,}2$.“ **(3)** „Die Seitenlänge ist $-4$ cm.“ **(4)** „Der Verein hat nach dem Modell $2\,183{,}7$ Mitglieder.“",
       [r"Prüfe Aussage (1) rechnerisch. Stelle dazu eine quadratische Gleichung auf.",
        r"Bestimme, welche Fläche bei Umfang $20$ m höchstens möglich ist. Bestätigt das dein Ergebnis aus a)?",
        r"Ordne die vier Aussagen ein: Welche sind mathematisch unmöglich, welche nur sachlich unbrauchbar?",
        r"Formuliere eine kurze Prüfliste, die man nach jeder Rechnung durchgeht."],
       solution=[
        r"Bei Umfang $20$ m gilt $a + b = 10$, also $b = 10 - a$. Die Fläche: $a(10 - a) = 30$, umgestellt $a^2 - 10a + 30 = 0$. Diskriminante: $D = 25 - 30 = -5 < 0$ — es gibt **keine** reelle Lösung. Ein solches Rechteck existiert nicht.",
        r"Die Flächenfunktion $A(a) = -a^2 + 10a$ hat den Scheitel bei $a = 5$ mit $A(5) = 25\ \mathrm{m^2}$. Mehr als $25\ \mathrm{m^2}$ sind bei Umfang $20$ m nicht möglich, und das Maximum liefert das Quadrat mit $5$ m Seite. Die geforderten $30\ \mathrm{m^2}$ liegen darüber — das bestätigt a) auf zweitem Weg.",
        r"**Mathematisch unmöglich** sind (1) und (2): das Rechteck kann es nicht geben, und eine Wahrscheinlichkeit liegt immer zwischen $0$ und $1$. **Nur sachlich unbrauchbar** sind (3) und (4): $-4$ ist eine korrekte Lösung einer Gleichung, taugt aber nicht als Länge, und $2\,183{,}7$ ist als Modellwert richtig, nur eben keine Mitgliederzahl — hier rundet man auf $2\,184$ und sagt dazu, dass es eine Prognose ist.",
        r"Kurze Prüfliste: **Erstens** die Probe — eingesetzt, stimmt es? **Zweitens** der Bereich — ist die Zahl als Länge, Anzahl oder Wahrscheinlichkeit überhaupt zulässig? **Drittens** die Größenordnung — passt das Ergebnis zur Aufgabe, oder ist es tausendmal zu groß? **Viertens** die Einheit — steht am Ende $\mathrm{m}$, $\mathrm{m^2}$ oder $\mathrm{m^3}$? **Fünftens** die Frage — ist wirklich das beantwortet, was gefragt war?"],
       falle=r"Eine negative Diskriminante ist kein Rechenfehler, sondern ein **Ergebnis**: die Aufgabe hat keine Lösung. Wer trotzdem die Wurzel zieht, erfindet Zahlen.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    import sympy as sp
    L = lambda h: F(115, 10) * h + 25
    assert L(40) == 485 and L(50) == 600 and F(575, 1) / F(115, 10) == 50
    neu = F(115, 10) * F(108, 100)
    assert neu == F(1242, 100) and float(neu) == 12.42
    assert F(115, 10) * F(8, 100) == F(92, 100) and F(92, 100) + F(115, 10) == neu
    h_neu = F(575) / neu
    assert abs(float(h_neu) - 46.296) < 1e-3 and 50 - float(h_neu) > 3.7
    assert abs(600 / 11.5 - 52.17) < 0.01
    x = sp.symbols("x")
    assert sp.solve(5 * x - 7 - (2 * x + 8), x) == [5]
    assert sp.solve(x ** 2 - 6 * x + 5, x) == [1, 5] and 1 + 5 == 6 and 1 * 5 == 5
    assert 2 ** 6 == 64
    assert sp.solve(x ** 2 - 5 * x, x) == [0, 5]
    # the rectangle that cannot exist
    assert sp.solve(x ** 2 - 10 * x + 30, x) == [5 - sp.sqrt(5) * sp.I, 5 + sp.sqrt(5) * sp.I]
    assert F(100, 4) - 30 == -5
    A = lambda a: -a ** 2 + 10 * a
    assert A(5) == 25 and -10 / (2 * -1) == 5 and 25 < 30
    assert all(A(a) <= 25 for a in range(0, 11))


s.verify(check)
s.save()
