#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 16: Vierfeldertafeln, bedingte Wahrscheinlichkeit, Unabhaengigkeit.
Deck: tools/pptx/build_vierfeldertafel_mathe11.py - Quiz: HTML/mathetest11-vierfeldertafel.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-vierfeldertafel", "Vierfeldertafeln", kw=16)

# ---------------------------------------------------------------- AFB I ----
s.task("Rad oder Bus", 1,
       r"An einer Schule wurden $200$ Jugendliche befragt. $120$ von ihnen fahren Rad, $80$ haben einen Bus-Pass, und $40$ haben beides.",
       [r"Fülle die Vierfeldertafel mit absoluten Zahlen aus. Wie viele haben weder Rad noch Bus-Pass?",
        r"Gib die Wahrscheinlichkeiten für „Rad“, „Bus-Pass“ und „beides“ an.",
        r"Berechne die Wahrscheinlichkeit, dass jemand einen Bus-Pass hat, **wenn** die Person Rad fährt.",
        r"Sind die beiden Merkmale unabhängig? Prüfe rechnerisch."],
       solution=[
        r"Innen: Rad und Bus $40$; Rad ohne Bus $120 - 40 = 80$; Bus ohne Rad $80 - 40 = 40$; weder noch $200 - 40 - 80 - 40 = 40$. Die Randsummen stimmen: $80 + 40 = 120$ Radfahrende, $40 + 40 = 80$ Bus-Pässe, insgesamt $200$. **$40$** Jugendliche haben weder Rad noch Bus-Pass.",
        r"$P(\text{Rad}) = \dfrac{120}{200} = 0{,}6$; $P(\text{Bus}) = \dfrac{80}{200} = 0{,}4$; $P(\text{beides}) = \dfrac{40}{200} = 0{,}2$.",
        r"Gefragt ist die bedingte Wahrscheinlichkeit $P(\text{Bus} \mid \text{Rad})$. Man rechnet nur noch innerhalb der Radfahrenden: von den $120$ haben $40$ einen Bus-Pass, also $\dfrac{40}{120} = \dfrac{1}{3} \approx 0{,}333$.",
        r"Unabhängig wären die Merkmale, wenn $P(\text{Rad}) \cdot P(\text{Bus}) = P(\text{beides})$ gälte. Hier ist $0{,}6 \cdot 0{,}4 = 0{,}24$, tatsächlich beobachtet sind aber $0{,}2$. Die Merkmale sind also **nicht unabhängig**: unter den Radfahrenden ist der Bus-Pass mit $33{,}3\,\%$ seltener als in der Gesamtgruppe mit $40\,\%$."],
       falle=r"$P(\text{Bus} \mid \text{Rad})$ und $P(\text{beides})$ sind verschiedene Dinge. Bei der bedingten Wahrscheinlichkeit steht im Nenner die **Bedingung**, hier die $120$ Radfahrenden, nicht die $200$ Befragten.")

# --------------------------------------------------------------- AFB II ----
s.task("Zwei Maschinen, ein Ausschussteil", 2,
       r"Ein Betrieb fertigt ein Bauteil auf zwei Maschinen. Maschine A liefert $60\,\%$ der Stücke, Maschine B die restlichen $40\,\%$. Bei A sind $2\,\%$ Ausschuss, bei B sind es $5\,\%$.",
       [r"Trage die vier Anteile in eine Vierfeldertafel ein. Rechne mit $10\,000$ gefertigten Stücken.",
        r"Wie hoch ist die Ausschussquote des Betriebs insgesamt?",
        r"Ein Prüfer greift ein Ausschussteil heraus. Mit welcher Wahrscheinlichkeit stammt es von Maschine A?",
        r"Vergleiche $P(A \mid \text{Ausschuss})$ mit $P(\text{Ausschuss} \mid A)$. Warum sind die Werte so verschieden?"],
       solution=[
        r"Maschine A fertigt $6\,000$ Stück, davon $2\,\%$ Ausschuss, also $120$ defekt und $5\,880$ in Ordnung. Maschine B fertigt $4\,000$ Stück, davon $5\,\%$, also $200$ defekt und $3\,800$ in Ordnung. Randsummen: $320$ Ausschussteile, $9\,680$ gute Teile, zusammen $10\,000$.",
        r"$\dfrac{320}{10\,000} = 0{,}032$, also **$3{,}2\,\%$**. Das liegt zwischen den $2\,\%$ und den $5\,\%$ der einzelnen Maschinen, näher an A, weil A den größeren Anteil fertigt.",
        r"$P(A \mid \text{Ausschuss}) = \dfrac{120}{320} = 0{,}375$, also **$37{,}5\,\%$**. Von den Ausschussteilen stammt die Mehrheit von der kleineren Maschine B.",
        r"$P(\text{Ausschuss} \mid A) = \dfrac{120}{6\,000} = 0{,}02$, also nur $2\,\%$ — gegenüber $37{,}5\,\%$ in c). Die beiden Fragen haben verschiedene **Bezugsgruppen**: einmal wird innerhalb der Produktion von A gerechnet, einmal innerhalb aller Ausschussteile. Die Nenner sind $6\,000$ und $320$, deshalb können die Werte weit auseinanderliegen. Die Reihenfolge in $P(X \mid Y)$ ist nicht vertauschbar."],
       falle=r"$2\,\%$ Ausschuss bei A heißt nicht, dass $2\,\%$ der Ausschussteile von A stammen. Wer die Bedingung vertauscht, verwechselt $37{,}5\,\%$ mit $2\,\%$ — Faktor $18$.")

# -------------------------------------------------------------- AFB III ----
s.task("Der Test ist zu 99 Prozent sicher", 3,
       r"Eine Krankheit tritt bei $1\,\%$ der Bevölkerung auf. Ein Test erkennt $99\,\%$ der Erkrankten richtig als krank. Bei Gesunden schlägt er in $2\,\%$ der Fälle fälschlich an. Ein Mitschüler sagt nach einem positiven Test: **„Der Test ist zu $99\,\%$ sicher, also bin ich mit $99\,\%$ Wahrscheinlichkeit krank.“**",
       [r"Erstelle die Vierfeldertafel für $10\,000$ Personen.",
        r"Wie viele Personen erhalten insgesamt ein positives Testergebnis?",
        r"Berechne die Wahrscheinlichkeit, tatsächlich krank zu sein, wenn der Test positiv ausfällt.",
        r"Beurteile die Aussage. Was müsste sich ändern, damit ein positiver Test aussagekräftiger wird?"],
       solution=[
        r"Von $10\,000$ Personen sind $1\,\%$ krank, also $100$; gesund sind $9\,900$. Von den $100$ Kranken werden $99\,\%$ erkannt: $99$ positiv, $1$ negativ. Von den $9\,900$ Gesunden schlägt der Test bei $2\,\%$ fälschlich an: $198$ positiv, $9\,702$ negativ.",
        r"Positiv sind $99 + 198 = 297$ Personen.",
        r"$P(\text{krank} \mid \text{positiv}) = \dfrac{99}{297} = \dfrac{1}{3} \approx 0{,}333$, also nur **$33{,}3\,\%$**. Zwei von drei positiv Getesteten sind in Wirklichkeit gesund.",
        r"Die Aussage ist falsch. Die $99\,\%$ beschreiben $P(\text{positiv} \mid \text{krank})$, gefragt ist aber $P(\text{krank} \mid \text{positiv})$ — die umgekehrte Richtung. Der Grund für den großen Unterschied ist die **Seltenheit** der Krankheit: es gibt so viel mehr Gesunde, dass selbst $2\,\%$ falsch Positive unter ihnen zahlenmäßig doppelt so viele sind wie alle richtig erkannten Kranken. Aussagekräftiger wird ein positiver Test, wenn die Rate der falsch Positiven sinkt oder wenn gezielt in einer Gruppe mit höherem Krankheitsanteil getestet wird — deshalb testet man nach Symptomen und nicht wahllos."],
       falle=r"Bei seltenen Ereignissen entscheidet nicht die Güte des Tests, sondern die **Grundrate**. Ein absolutes Zahlenbeispiel mit $10\,000$ Personen macht das sofort sichtbar, Prozentangaben allein verschleiern es.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    rad_bus, rad, bus, ges = 40, 120, 80, 200
    assert rad - rad_bus == 80 and bus - rad_bus == 40
    assert ges - rad_bus - (rad - rad_bus) - (bus - rad_bus) == 40
    assert (rad - rad_bus) + rad_bus == rad and (bus - rad_bus) + rad_bus == bus
    assert F(rad, ges) == F(3, 5) and F(bus, ges) == F(2, 5) and F(rad_bus, ges) == F(1, 5)
    assert F(rad_bus, rad) == F(1, 3)
    assert F(3, 5) * F(2, 5) == F(6, 25) and F(6, 25) != F(1, 5)
    assert float(F(6, 25)) == 0.24 and float(F(1, 5)) == 0.2
    # two machines
    nA, nB = 6000, 4000
    dA, dB = int(nA * 0.02), int(nB * 0.05)
    assert (nA, nB, dA, dB) == (6000, 4000, 120, 200) and nA + nB == 10000
    assert nA - dA == 5880 and nB - dB == 3800 and dA + dB == 320
    assert F(320, 10000) == F(4, 125) and abs(float(F(320, 10000)) - 0.032) < 1e-12
    assert 0.02 < 0.032 < 0.05
    assert F(dA, dA + dB) == F(3, 8) and float(F(3, 8)) == 0.375
    assert F(dA, nA) == F(1, 50) and float(F(1, 50)) == 0.02
    assert abs(0.375 / 0.02 - 18.75) < 1e-9
    # medical test
    krank, gesund = 100, 9900
    pos_k, pos_g = 99, 198
    assert krank + gesund == 10000 and int(krank * 0.99) == pos_k
    assert int(gesund * 0.02) == pos_g and krank - pos_k == 1 and gesund - pos_g == 9702
    assert pos_k + pos_g == 297 and F(pos_k, 297) == F(1, 3)
    assert abs(float(F(1, 3)) - 0.3333) < 1e-4 and pos_g == 2 * pos_k


s.verify(check)
s.save()
