#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 26: Ausklang - Denkfallen, das Unerwartete, Zaehlen und Kombinieren.
Deck: tools/pptx/build_ausklang_mathe11.py - Quiz: HTML/mathetest11-ausklang.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-ausklang", "Denkfallen und Knobeleien", kw=26)

# ---------------------------------------------------------------- AFB I ----
s.task("Drei Fragen, drei schnelle Antworten", 1,
       r"Erst schätzen, dann rechnen. **(1)** Ein Schläger und ein Ball kosten zusammen $1{,}10$ €, der Schläger kostet $1$ € **mehr** als der Ball. **(2)** $5$ Maschinen brauchen $5$ Minuten für $5$ Teile. **(3)** Seerosen auf einem See verdoppeln ihre Fläche täglich; nach $48$ Tagen ist der See voll bedeckt.",
       [r"Was kostet der Ball? Stelle eine Gleichung auf.",
        r"Wie lange brauchen $100$ Maschinen für $100$ Teile?",
        r"Nach wie vielen Tagen ist der See zur Hälfte bedeckt?",
        r"Was haben die drei Fehlschlüsse gemeinsam?"],
       solution=[
        r"Ball $x$, Schläger $x + 1$. Gleichung: $x + (x + 1) = 1{,}10$, also $2x = 0{,}10$ und $x = 0{,}05$. Der Ball kostet **$5$ Cent**, der Schläger $1{,}05$ €. Probe: Summe $1{,}10$ €, Differenz genau $1$ €. Die schnelle Antwort $10$ Cent ergäbe eine Differenz von nur $90$ Cent.",
        r"Eine Maschine braucht für **ein** Teil $5$ Minuten — die $5$ Maschinen arbeiten ja gleichzeitig. Also brauchen $100$ Maschinen für $100$ Teile ebenfalls **$5$ Minuten**. Nicht die Anzahl entscheidet, sondern das Verhältnis von Maschinen zu Teilen.",
        r"Weil sich die Fläche täglich **verdoppelt**, war sie am Vortag halb so groß. Der See ist also nach **$47$ Tagen** zur Hälfte bedeckt — nicht nach $24$. Bis Tag $47$ sieht es lange harmlos aus, und am letzten Tag kippt alles.",
        r"Alle drei verführen zu einer Antwort, die durch einfaches Teilen oder Halbieren entsteht: $1{,}10$ zerlegt in $1$ und $0{,}10$; $100$ Maschinen als das $20$-fache von $5$; $48$ Tage halbiert zu $24$. In Wahrheit steckt in (1) eine **Differenz**bedingung, in (2) eine **Proportionalität** in zwei Größen zugleich und in (3) **exponentielles** Wachstum. Das Bauchgefühl rechnet immer linear."],
       falle=r"Der Fehler entsteht nicht beim Rechnen, sondern beim **Aufstellen**. Wer die Bedingung als Gleichung hinschreibt, statt sie zu überfliegen, fällt auf keine dieser Fallen herein.")

# --------------------------------------------------------------- AFB II ----
s.task("Zählen und Kombinieren", 2,
       r"Beim Abschlussfest sind $12$ Personen anwesend.",
       [r"Jede begrüßt jede andere mit einem Handschlag. Wie viele Handschläge gibt es?",
        r"Aus den $12$ soll ein Team aus $2$ Personen gebildet werden. Wie viele Möglichkeiten gibt es, und wie hängt das mit a) zusammen?",
        r"Auf wie viele verschiedene Arten können sich $5$ Personen in einer Reihe aufstellen?",
        r"Wie groß ist die Wahrscheinlichkeit, dass unter $23$ zufällig gewählten Personen mindestens zwei am selben Tag Geburtstag haben? Beschreibe den Rechenweg und beurteile das Ergebnis."],
       solution=[
        r"Jede der $12$ Personen schüttelt $11$ Hände, das ergibt $12 \cdot 11 = 132$ — dabei ist jeder Handschlag von beiden Seiten gezählt. Also gibt es $\dfrac{132}{2} = 66$ Handschläge.",
        r"Genau $66$ — dieselbe Zahl. Ein Handschlag ist nichts anderes als die Auswahl von zwei Personen aus zwölf, und auf die Reihenfolge kommt es in beiden Fällen nicht an. Allgemein gibt es $\dfrac{n(n - 1)}{2}$ Möglichkeiten.",
        r"Für den ersten Platz gibt es $5$ Möglichkeiten, für den zweiten noch $4$, dann $3$, $2$ und $1$. Zusammen $5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$ Reihenfolgen. Hier zählt die Reihenfolge — anders als in b).",
        r"Man rechnet über das Gegenereignis „alle haben an verschiedenen Tagen Geburtstag“: die zweite Person hat $\dfrac{364}{365}$ freie Tage, die dritte $\dfrac{363}{365}$ und so weiter bis $\dfrac{343}{365}$. Das Produkt ergibt rund $0{,}4927$, also ist $P(\text{mindestens zwei gleich}) \approx 1 - 0{,}4927 = 0{,}5073$ — gut **$50\,\%$**. Das überrascht, weil man an die eigenen $22$ Vergleiche denkt; tatsächlich gibt es aber $\dfrac{23 \cdot 22}{2} = 253$ **Paare**, die alle zusammenpassen könnten."],
       falle=r"„Auswahl“ und „Reihenfolge“ sind zwei verschiedene Fragen. Bei $5$ Personen gibt es $10$ Zweiergruppen, aber $120$ Aufstellungen — wer beides verwechselt, liegt um den Faktor $12$ daneben.")

# -------------------------------------------------------------- AFB III ----
s.task("Soll ich wechseln?", 3,
       r"In einer Spielshow stehen drei Türen. Hinter einer steht ein Auto, hinter den beiden anderen je eine Ziege. Der Kandidat wählt eine Tür. Der Moderator, der **weiß**, wo das Auto steht, öffnet daraufhin eine der beiden übrigen Türen — immer eine mit einer Ziege — und fragt: „Wollen Sie wechseln?“ Ein Mitschüler sagt: **„Jetzt sind noch zwei Türen übrig, also fifty-fifty. Wechseln bringt nichts.“**",
       [r"Mit welcher Wahrscheinlichkeit steht das Auto hinter der zuerst gewählten Tür?",
        r"Berechne die Gewinnwahrscheinlichkeit beim Wechseln. Begründe über die beiden Fälle „zuerst richtig gewählt“ und „zuerst falsch gewählt“.",
        r"Eine Simulation über $300$ Spiele ergibt beim Bleiben $104$ und beim Wechseln $196$ Gewinne. Passt das zu deiner Rechnung?",
        r"Beurteile die Aussage. Welche Rolle spielt es, dass der Moderator weiß, wo das Auto steht?"],
       solution=[
        r"Vor dem Öffnen sind alle drei Türen gleichwertig, also $P = \dfrac{1}{3}$. Diese Wahrscheinlichkeit ändert sich nicht dadurch, dass der Moderator anschließend eine Ziegentür öffnet — er hätte immer eine öffnen können.",
        r"Fall 1: Der Kandidat hat zuerst das **Auto** gewählt, Wahrscheinlichkeit $\dfrac{1}{3}$. Dann führt Wechseln zur Ziege. Fall 2: Er hat zuerst eine **Ziege** gewählt, Wahrscheinlichkeit $\dfrac{2}{3}$. Dann steht hinter der einen verbleibenden Tür zwangsläufig das Auto, denn der Moderator hat die andere Ziege gezeigt — Wechseln gewinnt. Also $P(\text{Gewinn beim Wechseln}) = \dfrac{2}{3} \approx 0{,}667$, gegenüber $\dfrac{1}{3}$ beim Bleiben.",
        r"Erwartet werden beim Bleiben $\dfrac{300}{3} = 100$ und beim Wechseln $\dfrac{2 \cdot 300}{3} = 200$ Gewinne. Beobachtet sind $104$ und $196$ — die Abweichung liegt bei $4$ Spielen und damit gut im Rahmen der Zufallsschwankung, die bei $300$ Versuchen etwa $\pm 300 \cdot \dfrac{1}{\sqrt{300}} \approx 17$ Spiele beträgt. Die Simulation bestätigt die Rechnung.",
        r"Die Aussage ist falsch. Zwei übrig gebliebene Möglichkeiten heißen nicht, dass beide gleich wahrscheinlich sind — die Wahrscheinlichkeiten stammen aus der **ersten** Wahl und bleiben an ihr hängen. Entscheidend ist das Wissen des Moderators: weil er nie das Auto zeigt, überträgt er die gesamte Wahrscheinlichkeit von $\dfrac{2}{3}$ auf die eine verbleibende Tür. Öffnete er dagegen zufällig und träfe manchmal das Auto, wäre es in den verbleibenden Fällen tatsächlich fifty-fifty. Sein Wissen ist die zusätzliche Information, die das Wechseln lohnend macht."],
       falle=r"„Zwei Möglichkeiten“ heißt nie automatisch „je $50\,\%$“. Gleiche Wahrscheinlichkeiten müssen begründet werden — hier durch die Frage, wie die Situation überhaupt zustande kam.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    # bat and ball
    x = F(10, 200)
    assert x == F(1, 20) and x + (x + 1) == F(110, 100) and (x + 1) - x == 1
    assert F(10, 100) + F(110, 100) - F(10, 100) != 0
    schnell = F(10, 100)
    assert (F(110, 100) - schnell) - schnell == F(90, 100)     # the 10-cent answer is off
    # machines: 5 machines / 5 minutes / 5 parts -> one machine needs 5 minutes per part
    assert 5 / 5 == 1 and 100 / 100 == 1
    # water lilies
    assert 48 - 1 == 47 and 2 ** 1 == 2
    # handshakes and teams
    assert 12 * 11 // 2 == 66 and math.comb(12, 2) == 66
    assert math.factorial(5) == 120 and math.comb(5, 2) == 10 and 120 // 10 == 12
    assert 23 * 22 // 2 == 253 and math.comb(23, 2) == 253
    p_verschieden = 1.0
    for k in range(23):
        p_verschieden *= (365 - k) / 365
    assert abs(p_verschieden - 0.4927) < 1e-4 and abs(1 - p_verschieden - 0.5073) < 1e-4
    assert 1 - p_verschieden > 0.5
    # Monty Hall
    assert F(1, 3) + F(2, 3) == 1 and abs(float(F(2, 3)) - 0.6667) < 1e-4
    assert 300 // 3 == 100 and 2 * 300 // 3 == 200
    assert abs(104 - 100) == 4 and abs(196 - 200) == 4
    assert abs(300 / math.sqrt(300) - 17.32) < 0.01 and 4 < 17.32
    assert 104 + 196 == 300


s.verify(check)
s.save()
