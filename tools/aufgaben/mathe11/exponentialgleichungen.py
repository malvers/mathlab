#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 3: Exponentialgleichungen a^x = b - im Kopf und mit Logarithmus.
Deck: tools/pptx/build_exponentialgleichungen_mathe11.py - Quiz: HTML/mathetest11-exponentialgleichungen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-exponentialgleichungen", "Exponentialgleichungen", kw=3)

# ---------------------------------------------------------------- AFB I ----
s.task("Das gefaltete Blatt", 1,
       r"Ein Blatt Papier ist $0{,}1$ mm dick. Bei jeder Faltung verdoppelt sich die Dicke, nach $n$ Faltungen beträgt sie $d(n) = 0{,}1 \cdot 2^n$ Millimeter.",
       [r"Wie dick ist der Stapel nach $10$ Faltungen?",
        r"Löse im Kopf: nach wie vielen Faltungen ist die Dicke auf $3{,}2$ mm gewachsen? Bringe beide Seiten auf dieselbe Basis.",
        r"Nach wie vielen Faltungen ist der Stapel erstmals über einen Meter dick?",
        r"Der Mond ist rund $384\,000$ km entfernt. Nach wie vielen Faltungen wäre der Stapel so hoch? Rechne mit dem Logarithmus."],
       solution=[
        r"$d(10) = 0{,}1 \cdot 2^{10} = 0{,}1 \cdot 1\,024 = 102{,}4$ mm, also gut $10$ Zentimeter.",
        r"$0{,}1 \cdot 2^n = 3{,}2$ ergibt $2^n = 32$. Rechts steht $2^5$, also sind beide Seiten Potenzen zur Basis $2$ — bei gleicher Basis dürfen die Exponenten verglichen werden: $n = 5$. Probe: $0{,}1 \cdot 32 = 3{,}2$.",
        r"Ein Meter sind $1\,000$ mm: $0{,}1 \cdot 2^n = 1\,000$ ergibt $2^n = 10\,000$. Das ist keine glatte Zweierpotenz. Wegen $2^{13} = 8\,192$ und $2^{14} = 16\,384$ ist erst nach **$14$ Faltungen** der Meter überschritten: $d(13) = 819{,}2$ mm, $d(14) = 1\,638{,}4$ mm.",
        r"$384\,000$ km sind $3{,}84 \cdot 10^{11}$ mm. Aus $0{,}1 \cdot 2^n = 3{,}84 \cdot 10^{11}$ folgt $2^n = 3{,}84 \cdot 10^{12}$, also $n = \log_2\left(3{,}84 \cdot 10^{12}\right) = \dfrac{\lg\left(3{,}84 \cdot 10^{12}\right)}{\lg 2} \approx \dfrac{12{,}584}{0{,}301} \approx 41{,}8$. Nach **$42$ Faltungen** wäre der Stapel beim Mond."],
       falle=r"Vor dem Vergleich der Exponenten muss die Potenz **allein** stehen. Wer bei $0{,}1 \cdot 2^n = 3{,}2$ sofort $2^n = 3{,}2$ setzt, vergisst den Vorfaktor und landet bei einer krummen Zahl statt bei $5$.")

# --------------------------------------------------------------- AFB II ----
s.task("Wie alt ist der Fund?", 2,
       r"Lebendes Gewebe enthält einen festen Anteil des radioaktiven Kohlenstoffs C-14. Nach dem Tod zerfällt er mit einer Halbwertszeit von $5\,730$ Jahren: $A(t) = A_0 \cdot 0{,}5^{\frac{t}{5730}}$.",
       [r"Nach wie vielen Jahren sind noch $25\,\%$ des C-14 vorhanden? Begründe ohne Rechner.",
        r"Stelle die Gleichung für „noch $10\,\%$ vorhanden“ auf und löse sie mit dem Logarithmus.",
        r"Ein Fundstück enthält noch $40\,\%$ des ursprünglichen C-14. Wie alt ist es?",
        r"Ein Kapital von $5\,000$ € wird mit $3\,\%$ verzinst. Nach wie vielen Jahren hat es sich verdoppelt? Vergleiche mit der Faustregel $\dfrac{70}{p}$."],
       solution=[
        r"$25\,\%$ ist die Hälfte der Hälfte, also sind genau **zwei** Halbwertszeiten vergangen: $2 \cdot 5\,730 = 11\,460$ Jahre. Probe: $0{,}5^2 = 0{,}25$.",
        r"$0{,}5^{\frac{t}{5730}} = 0{,}1$. Beide Seiten logarithmieren: $\dfrac{t}{5\,730} \cdot \lg 0{,}5 = \lg 0{,}1$, also $\dfrac{t}{5\,730} = \dfrac{\lg 0{,}1}{\lg 0{,}5} = \dfrac{-1}{-0{,}30103} \approx 3{,}322$. Damit $t \approx 3{,}322 \cdot 5\,730 \approx 19\,035$ Jahre.",
        r"$0{,}5^{\frac{t}{5730}} = 0{,}4$ ergibt $\dfrac{t}{5\,730} = \dfrac{\lg 0{,}4}{\lg 0{,}5} = \dfrac{-0{,}39794}{-0{,}30103} \approx 1{,}322$. Also $t \approx 1{,}322 \cdot 5\,730 \approx 7\,575$ Jahre. Das Fundstück ist rund $7\,600$ Jahre alt.",
        r"$5\,000 \cdot 1{,}03^t = 10\,000$ ergibt $1{,}03^t = 2$, also $t = \dfrac{\lg 2}{\lg 1{,}03} = \dfrac{0{,}30103}{0{,}012837} \approx 23{,}45$ Jahre. Die Faustregel liefert $\dfrac{70}{3} \approx 23{,}3$ Jahre — eine sehr gute Näherung, und der Startbetrag spielt dabei keine Rolle."],
       falle=r"Der Startwert kürzt sich bei Verdopplungs- und Halbierungsfragen immer heraus. Wer die $5\,000$ € oder $A_0$ mitschleppt, rechnet unnötig — und wer sie durch $2$ statt in $1{,}03^t = 2$ einbaut, rechnet falsch.")

# -------------------------------------------------------------- AFB III ----
s.task("Drei Rechnungen, drei Fehler", 3,
       r"Aus drei Heften stammen diese Zeilen: **(1)** „Aus $2^x = 32$ folgt $x = \dfrac{32}{2} = 16$.“ **(2)** „Aus $5 \cdot 2^x = 40$ folgt $10^x = 40$.“ **(3)** „$2^x + 2^x = 2^{2x}$.“",
       [r"Prüfe Zeile (1) durch Einsetzen und gib die richtige Lösung an.",
        r"Finde den Fehler in Zeile (2) und löse die Gleichung richtig.",
        r"Prüfe Zeile (3) für $x = 3$ und gib die richtige Umformung an.",
        r"Beurteile die drei Zeilen gemeinsam. Formuliere eine Reihenfolge, in der man Exponentialgleichungen angeht."],
       solution=[
        r"Probe: $2^{16} = 65\,536$, das ist weit von $32$ entfernt — die Zeile ist falsch. Der Logarithmus fragt nach dem Exponenten, nicht nach einem Quotienten: $2^x = 32 = 2^5$, also $x = 5$.",
        r"Der Fehler: $5 \cdot 2^x$ ist **kein** $10^x$. Multipliziert werden dürfen nur Potenzen mit gleichem Exponenten, und die $5$ ist ein Vorfaktor, keine Basis. Richtig ist: erst durch $5$ teilen, dann $2^x = 8 = 2^3$, also $x = 3$. Probe: $5 \cdot 8 = 40$.",
        r"Für $x = 3$: links $2^3 + 2^3 = 8 + 8 = 16$, rechts $2^6 = 64$. Die Zeile ist falsch. Richtig ist $2^x + 2^x = 2 \cdot 2^x = 2^{x+1}$; für $x = 3$ gibt das $2^4 = 16$, wie die Probe zeigt. Beim **Addieren** gleicher Potenzen wird der Vorfaktor größer, nicht der Exponent verdoppelt.",
        r"Alle drei Fehler haben dieselbe Wurzel: Rechenregeln für Produkte werden auf Summen oder auf Vorfaktoren übertragen. Sinnvolle Reihenfolge: **erstens** die Potenz isolieren, also alle Vorfaktoren und Summanden auf die andere Seite bringen. **Zweitens** prüfen, ob sich beide Seiten auf dieselbe Basis bringen lassen — dann genügt der Vergleich der Exponenten und man braucht keinen Rechner. **Drittens**, falls nicht, beide Seiten logarithmieren und nach $x$ auflösen. **Viertens** immer die Probe machen."],
       falle=r"Ein Vorfaktor ist keine Basis. Aus $3 \cdot 2^x$ wird niemals $6^x$ — die Probe bei $x = 1$ liefert $6$ gegen $6$ und täuscht, bei $x = 2$ dagegen $12$ gegen $36$.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    d = lambda n: 0.1 * 2 ** n
    assert abs(d(10) - 102.4) < 1e-9 and 2 ** 10 == 1024
    assert abs(d(5) - 3.2) < 1e-9 and 2 ** 5 == 32
    assert 2 ** 13 == 8192 and 2 ** 14 == 16384
    assert abs(d(13) - 819.2) < 1e-9 and abs(d(14) - 1638.4) < 1e-9 and d(13) < 1000 < d(14)
    mond_mm = 384000 * 1e6
    assert abs(mond_mm - 3.84e11) < 1
    n = math.log(mond_mm / 0.1, 2)
    assert abs(math.log10(3.84e12) - 12.5843) < 1e-4 and abs(math.log10(2) - 0.30103) < 1e-5
    assert abs(n - 41.804) < 1e-3 and math.ceil(n) == 42
    assert 2 ** 16 == 65536
    # carbon dating
    A = lambda t: 0.5 ** (t / 5730)
    assert abs(A(11460) - 0.25) < 1e-12 and 2 * 5730 == 11460
    t10 = 5730 * math.log10(0.1) / math.log10(0.5)
    assert abs(math.log10(0.1) / math.log10(0.5) - 3.32193) < 1e-5 and abs(t10 - 19034.6) < 1
    t40 = 5730 * math.log10(0.4) / math.log10(0.5)
    assert abs(math.log10(0.4) - (-0.39794)) < 1e-5
    assert abs(math.log10(0.4) / math.log10(0.5) - 1.32193) < 1e-5 and abs(t40 - 7574.6) < 1
    # doubling the capital
    td = math.log10(2) / math.log10(1.03)
    assert abs(math.log10(1.03) - 0.0128372) < 1e-6 and abs(td - 23.4498) < 1e-3
    assert abs(70 / 3 - 23.333) < 1e-3 and abs(5000 * 1.03 ** td - 10000) < 1e-6
    # the three blunders
    assert 5 * 2 ** 3 == 40 and 2 ** 3 == 8
    assert 2 ** 3 + 2 ** 3 == 16 == 2 ** 4 and 2 ** 6 == 64
    assert 3 * 2 ** 1 == 6 == 6 ** 1 and 3 * 2 ** 2 == 12 and 6 ** 2 == 36


s.verify(check)
s.save()
