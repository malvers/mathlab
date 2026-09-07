#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 45: Wiederholung vor Klassenarbeit 1 - LB 2 und Start LB 3.
Deck: tools/pptx/build_ka1_mathe11.py - Quiz: HTML/mathetest11-ka1.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-ka1", "Wiederholung vor Klassenarbeit 1", kw=45)

# ---------------------------------------------------------------- AFB I ----
s.task("Das Beet am Zaun", 1,
       r"Ein rechteckiges Beet soll eingefasst werden. Die Einfassung ist $36$ m lang, und das Beet soll **dreimal so lang wie breit** werden. Die Breite heißt $b$.",
       [r"Stelle eine Gleichung für $b$ auf und löse sie ohne Taschenrechner.",
        r"Berechne die Fläche des Beetes.",
        r"Stelle $A = a \cdot b$ nach $b$ um und prüfe damit dein Ergebnis aus a).",
        r"Ein quadratisches Beet mit derselben Einfassung: Wie lang ist seine Seite, wie groß seine Fläche? Vergleiche."],
       solution=[
        r"Bei Breite $b$ ist die Länge $3b$. Umfang: $2(3b + b) = 36$, also $2 \cdot 4b = 36$ und $8b = 36$. Damit $b = 4{,}5$ m und $a = 13{,}5$ m. Probe: $2(13{,}5 + 4{,}5) = 2 \cdot 18 = 36$ m.",
        r"$A = 13{,}5 \cdot 4{,}5 = 60{,}75\ \mathrm{m^2}$.",
        r"Aus $A = a \cdot b$ folgt durch Teilen durch $a$: $b = \dfrac{A}{a}$. Einsetzen: $b = \dfrac{60{,}75}{13{,}5} = 4{,}5$ m — das bestätigt a).",
        r"Beim Quadrat sind alle vier Seiten gleich: $4s = 36$, also $s = 9$ m und $A = 81\ \mathrm{m^2}$. Mit **derselben** Einfassung sind das $20{,}25\ \mathrm{m^2}$ mehr Beet. Bei festem Umfang liefert das Quadrat die größte Rechteckfläche."],
       falle=r"„Dreimal so lang wie breit“ heißt $a = 3b$, nicht $b = 3a$. Wer es vertauscht, erhält $b = 13{,}5$ m und ein Beet, das breiter als lang ist.")

# --------------------------------------------------------------- AFB II ----
s.task("Zwei Vereine werben Mitglieder", 2,
       r"Der Sportverein hat heute $240$ Mitglieder und gewinnt jedes Jahr $15$ dazu. Der neu gegründete Kletterverein hat $180$ Mitglieder und wächst jedes Jahr um $8\,\%$.",
       [r"Stelle für beide Vereine die Funktionsgleichung auf und benenne die Art des Wachstums.",
        r"Berechne die Mitgliederzahlen nach $5$ Jahren.",
        r"In welchem Jahr überholt der Kletterverein den Sportverein? Grenze durch Probieren ein.",
        r"Die Formel liefert für den Kletterverein Werte wie $264{,}48$. Erkläre, was daran unpassend ist, und wie man damit umgeht."],
       solution=[
        r"Sportverein: $S(t) = 240 + 15t$ — **lineares** Wachstum, jedes Jahr derselbe Zuwachs. Kletterverein: $K(t) = 180 \cdot 1{,}08^t$ — **exponentielles** Wachstum, jedes Jahr derselbe Faktor.",
        r"$S(5) = 240 + 75 = 315$ Mitglieder. $K(5) = 180 \cdot 1{,}08^5 \approx 180 \cdot 1{,}46933 \approx 264{,}5$, also rund $264$ Mitglieder.",
        r"Nach $10$ Jahren: $S(10) = 390$ und $K(10) \approx 388{,}6$ — der Sportverein liegt noch knapp vorn. Nach $11$ Jahren: $S(11) = 405$ und $K(11) \approx 419{,}7$. Im **elften Jahr** zieht der Kletterverein vorbei.",
        r"Mitglieder sind ganze Menschen, das Modell rechnet aber mit reellen Zahlen. Der Wert $264{,}48$ ist eine **Prognose**, kein Bestand; man rundet ihn für die Antwort auf $264$ und rechnet trotzdem mit dem ungerundeten Wert weiter, damit sich Rundungsfehler nicht aufschaukeln. Der Definitionsbereich des Modells ist sachlich $t \geq 0$, und auch dort gilt es nur so lange, wie die Werbung so weiterläuft."],
       falle=r"$8\,\%$ Wachstum sind nicht $8$ Mitglieder im Jahr. Im ersten Jahr sind es $14{,}4$, im zehnten schon rund $28{,}8$ — der Zuwachs wächst mit.")

# -------------------------------------------------------------- AFB III ----
s.task("Die große Dose ist immer günstiger?", 3,
       r"Im Regal stehen zwei zylindrische Dosen. **Dose A**: Radius $4$ cm, Höhe $10$ cm, Preis $1{,}20$ €. **Dose B**: Radius $5$ cm, Höhe $12$ cm, Preis $2{,}40$ €. Ein Mitschüler sagt: **„Die große Dose ist immer die günstigere — Großpackungen lohnen sich ja bekanntlich.“**",
       [r"Berechne beide Volumen exakt als Vielfaches von $\pi$ und gerundet in $\mathrm{cm^3}$.",
        r"Berechne für beide Dosen den Preis je $100\ \mathrm{cm^3}$ und entscheide, welche günstiger ist.",
        r"Was dürfte Dose B höchstens kosten, damit sie gleich günstig ist wie A? Rechne exakt.",
        r"Beurteile die Behauptung. Welche Angabe im Laden beantwortet die Frage sofort, und warum wirkt die große Dose trotzdem oft günstiger?"],
       solution=[
        r"$V_A = \pi \cdot 4^2 \cdot 10 = 160\pi\ \mathrm{cm^3} \approx 502{,}7\ \mathrm{cm^3}$. $V_B = \pi \cdot 5^2 \cdot 12 = 300\pi\ \mathrm{cm^3} \approx 942{,}5\ \mathrm{cm^3}$. Dose B fasst also fast das Doppelte.",
        r"Dose A: $\dfrac{120\ \text{ct}}{502{,}7} \approx 0{,}2387$ ct je $\mathrm{cm^3}$, das sind rund $23{,}9$ ct je $100\ \mathrm{cm^3}$. Dose B: $\dfrac{240}{942{,}5} \approx 0{,}2546$ ct je $\mathrm{cm^3}$, also rund $25{,}5$ ct je $100\ \mathrm{cm^3}$. **Dose A ist günstiger**, obwohl sie kleiner ist.",
        r"Gleicher Grundpreis heißt $\dfrac{p_B}{300\pi} = \dfrac{120}{160\pi}$. Das $\pi$ kürzt sich heraus: $p_B = \dfrac{120 \cdot 300}{160} = 225$ ct, also **$2{,}25$ €**. Dose B ist mit $2{,}40$ € um $15$ Cent zu teuer.",
        r"Die Behauptung ist falsch — sie stimmt oft, aber eben nicht immer. Die Frage beantwortet der **Grundpreis** je Liter oder je $100$ Milliliter, der auf dem Preisschild stehen muss. Die große Dose wirkt günstiger, weil das Volumen mit $r^2 \cdot h$ stark wächst und man den Preisaufschlag daneben unterschätzt; nur der Quotient aus Preis und Volumen entscheidet."],
       falle=r"Die Radien zu vergleichen genügt nicht. Von A nach B wächst der Radius um $25\,\%$, das Volumen aber um $87{,}5\,\%$ — Preisvergleiche brauchen immer dieselbe Bezugsgröße.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    b = F(36, 8)
    assert b == F(9, 2) and 2 * (3 * b + b) == 36 and 3 * b == F(27, 2)
    A = 3 * b * b
    assert A == F(243, 4) and float(A) == 60.75 and A / (3 * b) == b
    assert F(36, 4) == 9 and 9 * 9 == 81 and 81 - float(A) == 20.25
    S = lambda t: 240 + 15 * t
    K = lambda t: 180 * 1.08 ** t
    assert S(5) == 315 and abs(1.08 ** 5 - 1.4693280768) < 1e-9 and abs(K(5) - 264.4790538) < 1e-6
    assert S(10) == 390 and abs(K(10) - 388.6063) < 1e-3 and K(10) < S(10)
    assert S(11) == 405 and abs(K(11) - 419.6948) < 1e-3 and K(11) > S(11)
    assert abs(K(1) - 180 - 14.4) < 1e-9 and abs(K(10) - K(9) - 28.7856) < 1e-3
    VA, VB = math.pi * 16 * 10, math.pi * 25 * 12
    assert abs(VA - 160 * math.pi) < 1e-12 and abs(VB - 300 * math.pi) < 1e-12
    assert abs(VA - 502.6548) < 1e-3 and abs(VB - 942.4778) < 1e-3
    assert abs(120 / VA - 0.238732) < 1e-6 and abs(240 / VB - 0.254648) < 1e-6
    assert 120 / VA < 240 / VB
    assert abs(100 * 120 / VA - 23.873) < 1e-2 and abs(100 * 240 / VB - 25.465) < 1e-2
    assert F(120 * 300, 160) == 225 and 240 - 225 == 15
    assert F(5 - 4, 4) == F(1, 4) and F(300 - 160, 160) == F(7, 8)


s.verify(check)
s.save()
