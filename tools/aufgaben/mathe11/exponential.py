#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 44: exponentielles Wachstum und Zerfall, Wachstumsfaktor.
Ohne Logarithmus - der kommt erst in KW 2. Halbwertszeiten werden eingegrenzt, nicht geloggt.
Deck: tools/pptx/build_exponential_mathe11.py - Quiz: HTML/mathetest11-exponential.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-exponential", "Exponentielles Wachstum und Zerfall", kw=44)

# ---------------------------------------------------------------- AFB I ----
s.task("Das Sparbuch der Patentante", 1,
       r"Zur Geburt legt eine Patentante $2\,000$ € an. Das Konto wird mit $4\,\%$ im Jahr verzinst, die Zinsen bleiben auf dem Konto.",
       [r"Gib den Wachstumsfaktor $q$ an und stelle die Funktionsgleichung $K(t)$ auf.",
        r"Berechne den Kontostand nach einem und nach zwei Jahren. Woher kommen die Cent-Beträge im zweiten Jahr?",
        r"Wie viel Geld liegt nach $10$ Jahren auf dem Konto?",
        r"Ein Mitschüler rechnet: „$10$ Jahre mal $4\,\%$ sind $40\,\%$, also $2\,800$ €.“ Vergleiche mit deinem Ergebnis und erkläre die Differenz."],
       solution=[
        r"$q = 1 + \dfrac{4}{100} = 1{,}04$. Damit $K(t) = 2\,000 \cdot 1{,}04^t$ mit $t$ in Jahren.",
        r"$K(1) = 2\,000 \cdot 1{,}04 = 2\,080$ €. $K(2) = 2\,000 \cdot 1{,}04^2 = 2\,163{,}20$ €. Im zweiten Jahr werden nicht nur die $2\,000$ € verzinst, sondern auch die $80$ € Zinsen aus dem ersten Jahr: $80 \cdot 0{,}04 = 3{,}20$ €. Genau diese **Zinsen auf die Zinsen** ergeben den Cent-Betrag.",
        r"$K(10) = 2\,000 \cdot 1{,}04^{10} \approx 2\,000 \cdot 1{,}480244 \approx 2\,960{,}49$ €.",
        r"Sein Ergebnis wäre $2\,800$ €, das sind rund $160{,}49$ € zu wenig. Er hat **linear** gerechnet, also jedes Jahr $80$ € auf den Ursprungsbetrag. Tatsächlich wächst die Verzinsungsbasis jedes Jahr mit, deshalb wird der Zuwachs von Jahr zu Jahr größer: im ersten Jahr $80$ €, im zehnten schon rund $113{,}86$ €."],
       falle=r"Prozente über mehrere Jahre werden **multipliziert**, nicht addiert. Aus $4\,\%$ über zehn Jahre werden nicht $40\,\%$, sondern rund $48{,}02\,\%$.")

# --------------------------------------------------------------- AFB II ----
s.task("Der Lieferwagen verliert an Wert", 2,
       r"Ein Lieferwagen kostet neu $24\,000$ €. Er verliert jedes Jahr $25\,\%$ seines jeweils aktuellen Werts. Ein Taschenrechner ist erlaubt, Logarithmen sind noch nicht im Werkzeugkasten.",
       [r"Gib den Abnahmefaktor an und stelle die Funktionsgleichung $W(t)$ auf.",
        r"Wie viel ist der Wagen nach $3$ Jahren noch wert?",
        r"Nach welcher Zeit ist der Wagen nur noch die Hälfte wert? Grenze durch Probieren auf eine Nachkommastelle ein.",
        r"Ab wann ist der Wagen weniger als $3\,000$ € wert? Kann sein Wert rechnerisch auf null sinken? Begründe an der Funktionsgleichung."],
       solution=[
        r"Abnahme um $25\,\%$ heißt: es bleiben $75\,\%$, also $q = 0{,}75$ — **nicht** $-0{,}25$. Damit $W(t) = 24\,000 \cdot 0{,}75^t$ mit $t$ in Jahren.",
        r"$W(3) = 24\,000 \cdot 0{,}75^3 = 24\,000 \cdot 0{,}421875 = 10\,125$ €.",
        r"Gesucht ist $t$ mit $0{,}75^t = 0{,}5$. Probieren: $0{,}75^2 = 0{,}5625$, also noch über der Hälfte; $0{,}75^3 \approx 0{,}4219$, also schon darunter. Feiner: $0{,}75^{2{,}4} \approx 0{,}5014$ und $0{,}75^{2{,}5} \approx 0{,}4871$. Der halbe Wert ist also nach etwa $2{,}4$ Jahren erreicht, gut zwei Jahre und fünf Monate.",
        r"$W(7) = 24\,000 \cdot 0{,}75^7 \approx 3\,203{,}61$ €, $W(8) \approx 2\,402{,}71$ €. Ab dem **achten Jahr** liegt der Wert unter $3\,000$ €. Rechnerisch auf null sinken kann er nie: $0{,}75^t$ ist für jedes $t$ echt größer als null, ein Produkt aus positiven Zahlen wird nicht null. Der Wert wird beliebig klein, erreicht die Null aber nicht — die Funktion hat keine Nullstelle."],
       falle=r"$25\,\%$ Wertverlust je Jahr heißt nicht, dass der Wagen nach vier Jahren nichts mehr wert ist. Die $25\,\%$ beziehen sich jedes Mal auf den **Restwert**, nicht auf den Neupreis: nach vier Jahren sind es noch $7\,593{,}75$ €.")

# -------------------------------------------------------------- AFB III ----
s.task("Fünf Prozent oder fünf Stück?", 3,
       r"Ein Mitschüler meint: **„Bei einem Startwert von $100$ ist es doch fast egal, ob etwas um $5\,\%$ im Jahr wächst oder um $5$ Einheiten im Jahr — das sind ja beide Male $5$.“**",
       [r"Vergleiche beide Modelle nach $1$, $5$ und $20$ Jahren in einer Tabelle.",
        r"Ab welchem Jahr liegt das exponentielle Modell um mehr als $10\,\%$ über dem linearen? Grenze durch Probieren ein.",
        r"Wie lange dauert es in jedem Modell, bis sich der Anfangswert verdoppelt hat?",
        r"Beurteile die Aussage. Erkläre, warum die Faustregel „Verdopplungszeit $\approx \dfrac{70}{p}$“ hier so gut passt."],
       solution=[
        r"Linear $L(t) = 100 + 5t$, exponentiell $E(t) = 100 \cdot 1{,}05^t$. Nach $1$ Jahr: $105$ und $105$. Nach $5$ Jahren: $125$ und $127{,}63$. Nach $20$ Jahren: $200$ und $265{,}33$. Im ersten Jahr stimmen beide überein, danach zieht das exponentielle Modell davon.",
        r"Der Quotient $\dfrac{E(t)}{L(t)}$ wächst: bei $t = 10$ ist er $\dfrac{162{,}89}{150} \approx 1{,}086$, bei $t = 11$ ist er $\dfrac{171{,}03}{155} \approx 1{,}103$. Ab dem **elften Jahr** liegt das exponentielle Modell um mehr als $10\,\%$ höher.",
        r"Linear: $100 + 5t = 200$ ergibt $t = 20$ Jahre. Exponentiell durch Probieren: $1{,}05^{14} \approx 1{,}980$ und $1{,}05^{15} \approx 2{,}079$ — die Verdopplung liegt zwischen $14$ und $15$ Jahren, rund $14{,}2$ Jahre.",
        r"Die Aussage stimmt nur für das erste Jahr, in dem beide Modelle zufällig denselben Zuwachs haben. Danach ist der Unterschied grundsätzlich: linear kommt jedes Jahr derselbe Betrag dazu, exponentiell wächst der Zuwachs mit dem Bestand. Die Faustregel liefert $\dfrac{70}{5} = 14$ Jahre und trifft die berechneten $14{,}2$ Jahre fast genau; sie gilt für kleine Prozentsätze und macht die Verdopplungszeit ohne Rechner abschätzbar."],
       falle=r"Der Vergleich „$5\,\%$ gegen $5$ Einheiten“ funktioniert nur beim Startwert. Schon im zweiten Jahr sind es $5{,}25$ statt $5$ — und dieser Vorsprung verzinst sich selbst weiter.")


# ---------------------------------------------------------- numbers check ----
def check():
    K = lambda t: 2000 * 1.04 ** t
    assert abs(K(1) - 2080) < 1e-9 and abs(K(2) - 2163.20) < 1e-9
    assert abs(80 * 0.04 - 3.20) < 1e-9
    assert abs(1.04 ** 10 - 1.4802442849) < 1e-9 and abs(K(10) - 2960.4885698) < 1e-6
    assert abs(round(K(10), 2) - 2960.49) < 1e-9 and abs(K(10) - 2800 - 160.4885) < 1e-3
    assert abs(K(10) - K(9) - 113.8649) < 1e-3 and abs(1.04 ** 10 - 1 - 0.48024) < 1e-4
    W = lambda t: 24000 * 0.75 ** t
    assert abs(0.75 ** 3 - 0.421875) < 1e-12 and abs(W(3) - 10125) < 1e-9
    assert 0.75 ** 2 > 0.5 > 0.75 ** 3
    assert abs(0.75 ** 2.4 - 0.501358) < 1e-5 and abs(0.75 ** 2.5 - 0.48714) < 1e-4
    assert 0.75 ** 2.4 > 0.5 > 0.75 ** 2.5
    assert abs(W(7) - 3203.61) < 0.01 and abs(W(8) - 2402.71) < 0.01 and W(7) > 3000 > W(8)
    assert abs(W(4) - 7593.75) < 1e-6 and W(100) > 0
    L = lambda t: 100 + 5 * t
    E = lambda t: 100 * 1.05 ** t
    assert L(1) == 105 and abs(E(1) - 105) < 1e-12
    assert L(5) == 125 and abs(E(5) - 127.62815625) < 1e-8
    assert L(20) == 200 and abs(E(20) - 265.3297705) < 1e-6
    assert abs(E(10) / L(10) - 1.08593) < 1e-4 and abs(E(11) / L(11) - 1.10344) < 1e-4
    assert E(10) / L(10) < 1.10 < E(11) / L(11)
    assert abs(1.05 ** 14 - 1.979932) < 1e-5 and abs(1.05 ** 15 - 2.078928) < 1e-5
    assert 1.05 ** 14 < 2 < 1.05 ** 15 and abs(70 / 5 - 14) < 1e-12
    assert abs(100 * 1.05 ** 2 - 100 * 1.05 - 5.25) < 1e-9


s.verify(check)
s.save()
