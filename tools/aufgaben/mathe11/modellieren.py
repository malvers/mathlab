#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 9: Modellieren - vom Sachtext zum Term und zurueck (Abschluss LB 3).
Deck: tools/pptx/build_modellieren_mathe11.py - Quiz: HTML/mathetest11-modellieren.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-modellieren", "Modellieren", kw=9)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Handwerkerrechnung", 1,
       r"Ein Elektrobetrieb berechnet je Einsatz eine **Anfahrtspauschale von $40$ €** und einen **Arbeitslohn von $56$ € je Stunde**, angefangene Stunden anteilig. Die Arbeitszeit heißt $t$ (in Stunden), die Kosten $K$ (in Euro).",
       [r"Stelle den Term $K(t)$ auf und begründe den Funktionstyp. Was kostet ein Einsatz von $2{,}5$ Stunden?",
        r"Eine Rechnung lautet auf $264$ €. Wie lange hat die Elektrikerin gearbeitet?",
        r"Was bedeuten Achsenabschnitt und Anstieg des Graphen im Sachzusammenhang? Gib die Einheit des Anstiegs an.",
        r"Ein Konkurrenzbetrieb verlangt keine Anfahrtspauschale, aber $66$ € je Stunde. Ab welcher Einsatzdauer ist der erste Betrieb günstiger?"],
       solution=[
        r"Fester Sockel plus feste Rate je Stunde, das ist **linear**: $K(t) = 40 + 56\,t$. Für $t = 2{,}5$: $K(2{,}5) = 40 + 56 \cdot 2{,}5 = 40 + 140 = 180$ €.",
        r"$40 + 56\,t = 264$, also $56\,t = 224$ und $t = \dfrac{224}{56} = 4$. Sie hat $4$ Stunden gearbeitet. Probe: $40 + 56 \cdot 4 = 264$.",
        r"Der Achsenabschnitt $40$ ist der Betrag, der schon bei $t = 0$ anfällt: die Anfahrt. Der Anstieg $56$ ist die Änderungsrate, jede weitere Stunde kostet $56$ € mehr. Einheit: Euro je Stunde, also €/h.",
        r"Konkurrenz: $K_2(t) = 66\,t$. Der erste Betrieb ist günstiger, wenn $40 + 56\,t < 66\,t$, also $40 < 10\,t$ und $t > 4$. Ab mehr als $4$ Stunden lohnt sich die Pauschale, bei genau $4$ Stunden kosten beide $264$ €. Probe: $66 \cdot 4 = 264$."],
       falle=r"Falle in b): wer $264$ direkt durch $56$ teilt, erhält $4{,}7$ Stunden und hat die Anfahrt mitbezahlt. Erst den Sockel abziehen, dann durch die Rate teilen.")

# --------------------------------------------------------------- AFB II ----
s.task("Wirkstoff im Blut", 2,
       r"Nach einer Tablette befinden sich $200$ mg eines Wirkstoffs im Körper. Der Körper baut **stündlich $20\,\%$ der jeweils vorhandenen Menge** ab. Die Menge heißt $m(t)$ in mg, $t$ in Stunden nach der Einnahme.",
       [r"Begründe, warum hier ein exponentielles und kein lineares Modell passt, und stelle $m(t)$ auf.",
        r"Ein Patient rechnet: „$20\,\%$ pro Stunde, nach $5$ Stunden ist alles weg.“ Berechne $m(3)$ und $m(5)$ und nimm Stellung.",
        r"Die Tablette wirkt, solange mindestens $50$ mg im Körper sind. Nach wie vielen Stunden muss die nächste genommen werden?",
        r"Im Beipackzettel steht: „Halbwertszeit etwa $3$ Stunden.“ Passt das zum Modell? Nenne außerdem zwei Annahmen des Modells, die in Wirklichkeit nur näherungsweise gelten."],
       solution=[
        r"Es wird nicht jede Stunde eine **feste Menge** abgebaut, sondern ein **fester Prozentsatz** der vorhandenen Menge. Fester Prozentsatz heißt fester Faktor: $m(t) = 200 \cdot 0{,}8^t$.",
        r"$m(3) = 200 \cdot 0{,}8^3 = 200 \cdot 0{,}512 = 102{,}4$ mg. $m(5) = 200 \cdot 0{,}8^5 = 200 \cdot 0{,}32768 \approx 65{,}5$ mg. Nach $5$ Stunden ist also noch fast ein Drittel da. Der Patient rechnet linear ($5 \cdot 20\,\% = 100\,\%$), aber die $20\,\%$ beziehen sich jede Stunde auf eine kleinere Menge. Exponentieller Abbau erreicht die Null nie.",
        r"$200 \cdot 0{,}8^t = 50$, also $0{,}8^t = 0{,}25$ und $t = \dfrac{\lg 0{,}25}{\lg 0{,}8} \approx 6{,}2$. Nach gut $6$ Stunden ist die Grenze erreicht, die nächste Tablette also **nach $6$ Stunden**, denn bei $6{,}5$ Stunden wäre man schon darunter. Probe: $200 \cdot 0{,}8^6 \approx 52{,}4$ mg, das reicht noch; $200 \cdot 0{,}8^7 \approx 41{,}9$ mg, das nicht.",
        r"Halbwertszeit: $0{,}8^t = 0{,}5$, also $t = \dfrac{\lg 0{,}5}{\lg 0{,}8} \approx 3{,}1$ Stunden. Das passt zu „etwa $3$ Stunden“. Annahmen: die ganzen $200$ mg sind sofort bei $t = 0$ im Blut (tatsächlich braucht die Aufnahme Zeit), und der Abbau ist Stunde für Stunde exakt $20\,\%$ (tatsächlich hängt er von Leber, Alter, Gewicht ab). Das Modell gilt außerdem nur für $t \ge 0$."],
       falle=r"Falle in c): „$50$ mg von $200$ mg sind $25\,\%$, also $75\,\%$ abgebaut, also $3{,}75$ Stunden“ rechnet wieder linear. Der Weg führt über $0{,}8^t = 0{,}25$ und den Logarithmus.")

# -------------------------------------------------------------- AFB III ----
s.task("Zwei Modelle, eine Stadt", 3,
       r"Eine Kleinstadt hatte $2010$ genau $40\,000$ Einwohner und $2020$ genau $48\,000$. Zwei Modelle beschreiben die Einwohnerzahl $E(t)$, $t$ in Jahren seit $2010$: Modell **A** ist linear, Modell **B** ist exponentiell. Ein Mitschüler behauptet: **„Beide Modelle treffen die Daten exakt, also sind beide gleich gut, und die Stadt hat $2050$ genau $72\,000$ Einwohner.“**",
       [r"Stelle beide Modelle auf und zeige, dass beide die Werte von $2010$ und $2020$ treffen.",
        r"Berechne die Prognose beider Modelle für $2050$. Wie weit liegen sie auseinander?",
        r"Beurteile die Behauptung. Berechne dazu auch, was beide Modelle für $2015$ liefern, und erkläre, warum zwei Datenpunkte nicht zwischen den Modellen entscheiden können.",
        r"Wende beide Modelle auf das Jahr $1960$ an und nenne für jedes Modell eine Grenze seines Gültigkeitsbereichs."],
       solution=[
        r"A: gleicher Zuwachs je Jahr, $\dfrac{48\,000 - 40\,000}{10} = 800$ Einwohner pro Jahr, also $E_A(t) = 40\,000 + 800\,t$. B: gleicher Faktor je Jahrzehnt, $\dfrac{48\,000}{40\,000} = 1{,}2$, also $E_B(t) = 40\,000 \cdot 1{,}2^{t/10}$. Probe: $E_A(0) = E_B(0) = 40\,000$; $E_A(10) = 48\,000$ und $E_B(10) = 40\,000 \cdot 1{,}2 = 48\,000$.",
        r"$t = 40$: $E_A(40) = 40\,000 + 32\,000 = 72\,000$. $E_B(40) = 40\,000 \cdot 1{,}2^4 = 40\,000 \cdot 2{,}0736 = 82\,944$. Unterschied $10\,944$ Einwohner, mehr als ein Viertel der heutigen Stadt.",
        r"Die Behauptung ist nicht haltbar. Zwei Datenpunkte legen bei **jedem** Modell mit zwei Parametern (Startwert und Rate bzw. Faktor) die Parameter fest, deshalb treffen beide exakt. Das sagt nichts darüber, welches Modell den Vorgang richtig beschreibt. Für $2015$ liefert A $44\,000$ und B $40\,000 \cdot \sqrt{1{,}2} \approx 43\,818$: ein Unterschied von $182$ Einwohnern, im Rauschen einer Stadt nicht zu sehen. Über kurze Zeiträume sind die Modelle kaum unterscheidbar, über $30$ Jahre laufen sie auseinander. Eine Prognose für $2050$ ist deshalb **unsicher**, und „genau $72\,000$“ täuscht eine Genauigkeit vor, die kein Modell hat. Ehrlich wäre eine Spanne von etwa $72\,000$ bis $83\,000$, mit Nennung der Annahme.",
        r"$t = -50$: $E_A(-50) = 40\,000 - 40\,000 = 0$ Einwohner, die Stadt hätte $1960$ nicht existiert. $E_B(-50) = 40\,000 \cdot 1{,}2^{-5} \approx 16\,075$, das ist wenigstens plausibel. Grenzen: A liefert für $t < -50$ negative Einwohnerzahlen und kann keine Stadt beschreiben, die je geschrumpft ist. B wächst ohne Ende, aber Wohnraum, Fläche und Arbeitsplätze setzen Grenzen; nach oben hin muss sich das Wachstum abflachen. Beide Modelle gelten nur für einen Zeitraum, in dem sich die Bedingungen nicht wesentlich ändern."],
       falle=r"Ein Modell, das die vorhandenen Daten exakt trifft, ist deshalb nicht richtig. Mit zwei Punkten trifft jedes Modell mit zwei Parametern exakt, die Entscheidung fällt erst mit weiteren Daten.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    # AFB I: K(t) = 40 + 56 t
    assert 40 + 56 * F(5, 2) == 180 and F(264 - 40, 56) == 4 and 40 + 56 * 4 == 264
    assert abs(264 / 56 - 4.7) < 0.02 and F(40, 10) == 4 and 66 * 4 == 264
    # AFB II: m(t) = 200 * 0.8^t
    m = lambda t: 200 * 0.8 ** t
    assert abs(0.8 ** 3 - 0.512) < 1e-12 and abs(m(3) - 102.4) < 1e-9
    assert abs(0.8 ** 5 - 0.32768) < 1e-12 and abs(m(5) - 65.5) < 0.05
    t50 = math.log(0.25) / math.log(0.8)
    assert abs(t50 - 6.2) < 0.05 and abs(m(t50) - 50) < 1e-9
    assert abs(m(6) - 52.4) < 0.05 and abs(m(7) - 41.9) < 0.05 and m(6) >= 50 > m(7) and m(6.5) < 50
    assert abs(math.log(0.5) / math.log(0.8) - 3.1) < 0.05
    assert F(50, 200) == F(1, 4) and abs(0.75 / 0.2 - 3.75) < 1e-12
    # AFB III: E_A = 40000 + 800 t, E_B = 40000 * 1.2^(t/10)
    EA = lambda t: 40000 + 800 * t
    EB = lambda t: 40000 * 1.2 ** (t / 10)
    assert F(48000 - 40000, 10) == 800 and F(48000, 40000) == F(6, 5)
    assert EA(0) == 40000 and EA(10) == 48000 and abs(EB(0) - 40000) < 1e-9 and abs(EB(10) - 48000) < 1e-9
    assert EA(40) == 72000 and abs(1.2 ** 4 - 2.0736) < 1e-12 and abs(EB(40) - 82944) < 1e-6
    assert 82944 - 72000 == 10944 and 10944 > 40000 / 4
    assert EA(5) == 44000 and abs(EB(5) - 43818) < 0.5 and abs(44000 - round(EB(5)) - 182) < 1
    assert EA(-50) == 0 and abs(EB(-50) - 16075) < 0.5


s.verify(check)
s.save()
