#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 38: exakt oder numerisch, CAS/GTR, Werkzeugebenen.
Deck: tools/pptx/build_werkzeuge_mathe11.py - Quiz: HTML/mathetest11-werkzeuge.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-werkzeuge", "Exakt oder numerisch", kw=38)

# ---------------------------------------------------------------- AFB I ----
s.task("Das quadratische Grundstück", 1,
       r"Ein quadratisches Grundstück hat eine Fläche von $50\ \mathrm{m^2}$. Gesucht ist die Seitenlänge $x$.",
       [r"Stelle die Gleichung auf und gib die **exakte** Lösung an. Warum kommt nur eine der beiden rechnerischen Lösungen in Frage?",
        r"Gib die Seitenlänge **numerisch** auf zwei Nachkommastellen an.",
        r"Berechne den Umfang exakt und numerisch. Wie viele volle Meter Zaun muss man kaufen?",
        r"Jemand rundet die Seitenlänge zuerst auf $7{,}1$ m und rechnet dann den Umfang aus. Um wie viel weicht das Ergebnis ab? Was folgt daraus für die Reihenfolge von Rechnen und Runden?"],
       solution=[
        r"$x^2 = 50$, also $x = \sqrt{50}$ oder $x = -\sqrt{50}$. Exakt vereinfacht: $\sqrt{50} = \sqrt{25 \cdot 2} = 5\sqrt{2}$ m. Eine Seitenlänge kann nicht negativ sein, deshalb bleibt nur $x = 5\sqrt{2}$ m.",
        r"$5\sqrt{2} \approx 7{,}0711$, gerundet $x \approx 7{,}07$ m. Das ist eine **Näherung**: quadriert ergibt $7{,}07$ genau $49{,}9849$, nicht $50$.",
        r"Exakt: $U = 4x = 20\sqrt{2}$ m. Numerisch: $U \approx 28{,}28$ m. Zaun wird nicht angeschnitten geliefert, also **$29$ volle Meter** — hier muss aufgerundet werden, nicht kaufmännisch gerundet.",
        r"Mit $7{,}1$ m: $U = 4 \cdot 7{,}1 = 28{,}4$ m statt $28{,}28$ m, also rund $12$ cm zu viel. Der Rundungsfehler der Seitenlänge wird mit $4$ multipliziert. Regel: **erst rechnen, am Ende runden** — jede Zwischenrundung geht in alle folgenden Schritte ein."],
       falle=r"$\sqrt{50}$ ist nicht $\sqrt{25} + \sqrt{25} = 10$. Unter der Wurzel darf man **Faktoren** herausziehen ($\sqrt{25 \cdot 2}$), niemals Summanden.")

# --------------------------------------------------------------- AFB II ----
s.task("Der Regenwassertank", 2,
       r"Ein zylindrischer Regenwassertank soll $2\,000$ Liter fassen, also $2\ \mathrm{m^3}$. Die Höhe steht mit $1{,}6$ m fest, gesucht ist der Radius. Es gilt $V = \pi r^2 h$.",
       [r"Stelle die Formel $V = \pi r^2 h$ nach $r$ um.",
        r"Berechne den Radius exakt und als Näherung in Zentimetern.",
        r"Der Tank muss durch eine Tür mit $1{,}20$ m lichter Breite. Passt er?",
        r"Ein Mitschüler rundet den Radius auf $0{,}6$ m ab und rechnet damit das Volumen zurück. Wie viele Liter fehlen? Beurteile, ob eine Rundung um $5\,\%$ hier harmlos ist."],
       solution=[
        r"Durch $\pi h$ teilen: $r^2 = \dfrac{V}{\pi h}$. Beide Seiten wurzeln, negativer Radius entfällt: $r = \sqrt{\dfrac{V}{\pi h}}$.",
        r"$\dfrac{V}{h} = \dfrac{2}{1{,}6} = \dfrac{5}{4}$, also exakt $r = \sqrt{\dfrac{5}{4\pi}} = \dfrac{1}{2}\sqrt{\dfrac{5}{\pi}}$ m. Numerisch: $\dfrac{5}{4\pi} \approx 0{,}3979$ und $r \approx 0{,}6308$ m, also rund $63{,}1$ cm.",
        r"Der Durchmesser ist $2r \approx 1{,}2616$ m, also gut $126$ cm. Die Tür ist $120$ cm breit — der Tank passt **nicht** hindurch, es fehlen rund $6$ cm.",
        r"Mit $r = 0{,}6$ m: $V = \pi \cdot 0{,}36 \cdot 1{,}6 \approx 1{,}8096\ \mathrm{m^3}$, also rund $1\,810$ Liter. Es fehlen etwa $190$ Liter. Eine Rundung des Radius um knapp $5\,\%$ kostet fast $10\,\%$ des Volumens, weil der Radius **quadriert** wird. Bei Formeln mit Quadraten ist Runden nie harmlos."],
       falle=r"Die Umkehrung von $r^2$ ist die Wurzel, nicht das Halbieren. Wer $r = \dfrac{V}{\pi h}$ rechnet, erhält $0{,}3979$ m und einen Tank mit nur $796$ Litern.")

# -------------------------------------------------------------- AFB III ----
s.task("Der Rechner hat doch recht?", 3,
       r"Ein Mitschüler sagt: **„Wenn mein Rechner eine Zahl anzeigt, ist die Aufgabe gelöst. Genauer als das Gerät kann ich sowieso nicht sein.“**",
       [r"Der Rechner zeigt für $\sqrt{2}$ den Wert $1{,}414213562$. Quadriere diese angezeigte Zahl. Was fällt auf?",
        r"Auf vielen Geräten ergibt $0{,}1 + 0{,}2 - 0{,}3$ nicht null, sondern etwa $5 \cdot 10^{-17}$. Erkläre, warum das kein Defekt ist, und begründe mit einem Vergleich aus dem Zehnersystem.",
        r"Warum sollte man nach einer numerischen Rechnung nie auf **Gleichheit** prüfen? Formuliere, wie man es stattdessen macht.",
        r"Beurteile die Behauptung. Gib für jede der drei Werkzeugebenen — Kopf und Papier, GTR, CAS — an, wofür sie gebraucht wird."],
       solution=[
        r"$1{,}414213562^2 = 1{,}999999998944727\ldots$, also **nicht** genau $2$. Die angezeigte Zahl ist eine abgeschnittene Dezimaldarstellung; die exakte Lösung von $x^2 = 2$ ist $\sqrt{2}$ und lässt sich als Dezimalzahl gar nicht vollständig hinschreiben.",
        r"Der Rechner speichert Zahlen **binär**. Im Binärsystem ist $0{,}1$ eine periodische Zahl und wird abgeschnitten, genau wie $\dfrac{1}{3} = 0{,}333\ldots$ im Zehnersystem nach endlich vielen Stellen abbricht. Rechnet man mit den abgeschnittenen Werten weiter, bleibt ein winziger Rest übrig.",
        r"Weil zwei Zahlen, die mathematisch gleich sind, nach dem Runden verschieden gespeichert sein können — die Prüfung $a = b$ antwortet dann falsch. Stattdessen prüft man, ob der Abstand klein genug ist: $|a - b| < \varepsilon$ mit einer passenden Schranke, etwa $\varepsilon = 10^{-9}$.",
        r"Die Behauptung ist falsch: Das Gerät liefert eine Näherung, und ob die genügt, entscheidet die Aufgabe. **Kopf und Papier** für kleine Zahlen, für die Struktur und für die Kontrolle — nur hier sieht man, ob ein Ergebnis überhaupt plausibel ist. **GTR** für Zahlenwerte, Tabellen und Graphen, also für Sachaufgaben mit Näherungen. **CAS** für exakte Terme, Umformungen und Formeln mit Buchstaben, überall dort, wo weitergerechnet oder begründet wird."],
       falle=r"„Der Rechner zeigt $0{,}3333333$“ heißt nicht, dass $\dfrac{1}{3}$ diese Zahl ist. Wer die Anzeige abschreibt und weiterrechnet, schleppt den Fehler durch die ganze Aufgabe.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    # square plot
    assert 5 ** 2 * 2 == 50
    x = math.sqrt(50)
    assert abs(x - 5 * math.sqrt(2)) < 1e-12 and abs(round(x, 2) - 7.07) < 1e-12
    assert abs(7.07 ** 2 - 49.9849) < 1e-9
    assert abs(4 * x - 28.2842712474619) < 1e-9 and math.ceil(4 * x) == 29
    assert abs(4 * 7.1 - 28.4) < 1e-9 and abs(4 * 7.1 - 4 * x - 0.1157287525) < 1e-6
    # water tank
    V, h = 2.0, 1.6
    assert F(2, 1) / F(16, 10) == F(5, 4)
    r = math.sqrt(V / (math.pi * h))
    assert abs(V / (math.pi * h) - 0.39788735) < 1e-7
    assert abs(r - 0.630783) < 1e-5 and abs(2 * r - 1.261566) < 1e-5 and 2 * r > 1.20
    assert abs(2 * r - 1.20) - 0.0616 < 1e-3
    Vr = math.pi * 0.6 ** 2 * h
    assert abs(Vr - 1.80955737) < 1e-7 and abs(2000 - Vr * 1000 - 190.44) < 0.1
    assert abs((0.630783 - 0.6) / 0.630783 - 0.0488) < 0.001      # ~5 % on the radius
    assert abs(190.44 / 2000 - 0.0952) < 0.001                    # ~10 % on the volume
    assert abs(math.pi * (V / (math.pi * h)) ** 2 * h * 1000 - 795.9) < 1.0   # the wrong r
    # calculator traps
    assert abs(1.414213562 ** 2 - 1.999999998944727) < 1e-12
    assert 0.1 + 0.2 - 0.3 != 0 and abs(0.1 + 0.2 - 0.3) < 1e-16


s.verify(check)
s.save()
