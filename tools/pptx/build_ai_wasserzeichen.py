#!/usr/bin/env python3
"""Unsichtbare Wasserzeichen in KI-Texten - how a language model hides a mark in its word choice and
how the mark is proven with a z-test.

Doc, 28.10.2026: Anthropic's mail "Text watermarking begins November 3, 2026" - "ein Slide Deck, was das
Prinzip von Watermarking erklärt", for class the same day. The principle is the green/red list of
Kirchenbauer et al. (ICML 2023); Claude's own method follows Google DeepMind's SynthID-Text (Nature 2024),
whose tournament gets one simplified slide. Anthropic has not published its exact method - the deck says so.

HTML only: the figures are inline SVG (wasserzeichen_svg.py), which the .pptx backend cannot place, and the
side pictures and the Wortvorhersage lab are written as raw slides (d._slide). Second round the same morning (Doc):
the training lab from the ai-begriffe deck, photos of real watermarks at the start, and three examples "so viel
Prozent DeepSeek, Anthropic, OpenAI - geht das überhaupt?" (chapter 4: Bayes over the three keys, honest answer).

    python3 tools/pptx/html_deck.py build_ai_wasserzeichen.py
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
from tables import TINT_RED, TINT_GREEN
import wasserzeichen_svg as WZ
from html_deck import bullet_list
from deck_markup import markup

KIRCHENBAUER = ("Prinzip nach J. Kirchenbauer u. a.: A Watermark for Large Language Models, ICML 2023",
                "https://arxiv.org/abs/2301.10226")
SYNTHID = ("Vereinfacht nach S. Dathathri u. a.: Scalable watermarking for identifying large language "
           "model outputs, Nature 634 (2024) - SynthID-Text", "https://www.nature.com/articles/s41586-024-08025-4")

d = MathDeck("ai-wasserzeichen.pptx")


def side_bullets(title, lines, img, alt, caption, url):
    """Bullets with a square photo on the right - the has-side layout of mathe11-exponential (deck.css .side-pic)."""
    fig = ('<figure class="side-pic"><img src="%s" alt="%s"></figure><a class="side-credit" href="%s" target="_blank" '
           'rel="noopener">%s</a>' % (img, alt, url, caption))
    d._slide("content has-side", '<h3>%s</h3><div class="rules"></div><div class="body">%s</div>%s'
             % (markup(title), bullet_list(lines)[0], fig))


def wortvorhersage_lab():
    """The training lab, exactly as it sits in ai-begriffe.html (Doc, 28.10.2026: "unbedingt auch in dieses Deck")."""
    d._slide("content lab", """
      <h3>Wortvorhersage — so lernt ein Sprachmodell</h3><div class="rules"></div>
      <div class="labframe" style="top:110px;height:386px">
        <iframe src="../wortvorhersage.html?widget&amp;vorgabe=60&amp;korpus=0&amp;tempo=280" title="Wortvorhersage" style="width:1133.33px;height:536.11px;transform:scale(0.72)"></iframe>
      </div>
      <div class="labbar">
        <a href="../wortvorhersage.html" target="_blank" rel="noopener">Öffne das Lab in neuem Tab</a>
      </div>""")


d.title("Informatik — Künstliche Intelligenz", "Unsichtbare Wasserzeichen",
        "Wie Claude, Gemini & Co. ihre Texte markieren — und wie man es nachweist")
d.summary("Titel: Unsichtbare Wasserzeichen in KI-Texten - wie Sprachmodelle ihre Texte markieren und wie man es nachweist.")

# ------------------------------------------------------------- Kapitel 01 ---
d.chapter(1, "Das Prinzip", "Ein Zeichen, das man nicht sieht", image="img/wasserzeichen-buetten.jpg",
          credit="Wasserzeichen im Büttenpapier von Hahnemühle: unsichtbar, bis Licht hindurchfällt — "
                 "Foto: Hahnemühle PR, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Hahnem%C3%BChle_Watermark_in_mould-made_paper.jpg")

side_bullets("Wasserzeichen — eine alte Idee", [
    ("Im **Geldschein**: gegen das Licht gehalten, erscheint ein Bild", 0),
    ("Auf **Fotos**: ein halbdurchsichtiges Logo über dem Bild", 0),
    ("Gemeinsam: **unauffällig** für alle, **eindeutig** für den Prüfer", 0),
    ("Ein KI-Text hat kein Papier und kein Bild — **nur Wörter**", 0),
    ("Wie versteckt man ein Zeichen in Wörtern, **ohne den Text zu verderben**?", 0),
], "img/wasserzeichen-euro.jpg", "50-Euro-Schein gegen das Licht gehalten, mit Wasserzeichen",
   "Gegen das Licht gehalten: das Wasserzeichen im 50-Euro-Schein, Renaissance-Fenster und Wertzahl — "
   "Foto: gemeinfrei, Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:50_euro_watermark.jpg")
d.summary("Wasserzeichen alt: Geldschein gegen das Licht, Logo auf Fotos - unauffällig, aber für Prüfer eindeutig. "
          "Ein KI-Text hat nur Wörter: wie versteckt man darin ein Zeichen?")

side_bullets("So entsteht ein Wasserzeichen im Papier", [
    ("Beim Schöpfen liegt ein **Drahtbild** auf dem Sieb", 0),
    ("Dort bleibt **weniger Papierbrei** hängen — das Papier wird dünner", 0),
    ("Gegen das Licht scheint die dünne Stelle **heller**", 0),
    ("Das Zeichen ist **Teil des Papiers**, nicht aufgedruckt", 0),
    ("Beim KI-Text genauso: das Zeichen entsteht **beim Schreiben**, nicht danach", 0),
], "img/wasserzeichen-sieb.jpg", "Schöpfsieb mit einem Porträt von Queen Victoria aus Draht",
   "Schöpfsieb mit Drahtbild von Queen Victoria (F. Burgess, Maidstone, spätes 19. Jh.): wo der Draht liegt, "
   "wird das Papier dünner — Foto: Yamaplos, CC BY-SA 4.0, Wikimedia Commons",
   "https://commons.wikimedia.org/wiki/File:QueenVictoriaWatermark.jpg")
d.summary("Papier-Wasserzeichen: Drahtbild auf dem Schöpfsieb, dort weniger Papierbrei, Papier dünner, gegen das Licht heller; "
          "Teil des Papiers, nicht aufgedruckt. Beim KI-Text entsteht das Zeichen ebenso beim Schreiben.")

d.bullets("Motivation für Wasserzeichen in KI-erstellten Texten", [
    ("KI-erstellte Texte sind **schwer zu identifizieren**", 0),
    ("Daher benötigt man ein **Verfahren**, um KI-generierte von nicht-KI-generierten Texten zu unterscheiden", 0),
])
d.summary("Motivation: KI-erstellte Texte sind schwer zu identifizieren - man braucht ein Verfahren, "
          "das KI-generierte von nicht-KI-generierten Texten unterscheidet.")

d.bullets("Wasserzeichen in KI-erstellten Texten", [
    ("Ab **3. November 2026** markiert Anthropic auch ältere KI-Modelle mit Wasserzeichen", 0),
    ("Neuere Modelle wie Claude Opus 5.5 tragen das Zeichen **schon heute**", 0),
    ("Das Zeichen ist ein **unmerkliches Muster in der Wortwahl**", 0),
    ("Kein **zusätzliches** Schriftzeichen, kein **zusätzliches** Wort", 0),
    ("Die Aussagen und die linguistische Qualität des Textes bleiben **gleich**", 0),
    ("Das Wasserzeichen verrät **nichts** darüber, welcher Nutzer den Text in Auftrag gegeben hat", 0),
    ("Es kann nur erkannt werden, dass der Text **von einer künstlichen Intelligenz** erstellt wurde", 0),
])
d.summary("Anlass: Mail von Anthropic vom 28.10.2026 - ab 3. November 2026 auch ältere Claude-Modelle mit Wasserzeichen, "
          "neuere wie Opus 5.5 schon jetzt; unmerkliches Muster in der Wortwahl, keine zusätzlichen Zeichen oder Token, "
          "keine Information über Nutzer.")

d.bullets("Erinnerung: Wie ein Sprachmodell schreibt", [
    ("Es sagt immer nur das **nächste Wort** voraus (genauer: das nächste Token)", 0),
    ("Dazu liefert es für jedes mögliche Wort eine **Wahrscheinlichkeit**", 0),
    ("Dann wird **gewürfelt** — deshalb gibt es auf dieselbe Frage andere Antworten", 0),
    ("Oft passen **mehrere Wörter fast gleich gut**", 0),
    ("Genau dieser **Spielraum** ist der Platz für das Wasserzeichen", 0),
])
d.summary("Sprachmodell: sagt das nächste Token voraus, Wahrscheinlichkeit je Wort, dann gewürfelt. "
          "Oft passen mehrere Wörter fast gleich gut - dieser Spielraum trägt das Wasserzeichen.")

wortvorhersage_lab()
d.summary("Lab Wortvorhersage: ein kleines Sprachmodell lernt aus einem Textkorpus, welches Wort als Nächstes kommt, "
          "und zeigt die Wahrscheinlichkeiten der Kandidaten.")

d.figure("Wo der Spielraum liegt", *WZ.spielraum())
d.summary("Bild: nach 'Heute ist das Wetter' - schön 24 %, sonnig 21 %, herrlich 14 %, warm 12 %, gut 9 %, mild 6 %, "
          "alle anderen 14 %. Mehrere Wörter passen fast gleich gut.")

d.bullets("Der Trick: grüne und rote Wörter", [
    ("Ein **geheimer Schlüssel** und das **vorige Wort** ergeben eine Zufallszahl", 0),
    ("Sie teilt den ganzen Wortschatz in **zwei Hälften**: grün und rot", 0),
    ("Beim Würfeln bekommen **grüne Wörter einen Bonus**", 0),
    ("Unter den passenden Wörtern ist fast immer ein grünes — der Text bleibt **gut**", 0),
    ("Nach jedem Wort wird **neu geteilt** — ohne Schlüssel sieht das aus wie Zufall", 0),
])
d.summary("Trick (Kirchenbauer 2023): geheimer Schlüssel + vorheriges Wort ergeben eine Zufallszahl, die den Wortschatz "
          "in grüne und rote Hälfte teilt; grüne Wörter bekommen beim Würfeln einen Bonus; nach jedem Wort neu geteilt.")

d.figure("Wer grün ist, entscheidet der Schlüssel", *WZ.schluessel(), source=KIRCHENBAUER)
d.summary("Bild: vorheriges Wort 'ist' + geheimer Schlüssel -> Zufallsgenerator -> grüne Liste (sonnig, herrlich, mild) "
          "und rote Liste (schön, warm, gut). Für jedes Wort neu.")

d.figure("Grün bekommt einen Bonus", *WZ.bonus(), source=KIRCHENBAUER)
d.summary("Bild: Bonus delta = 2 (grüne Chance mal e^2, etwa 7,4, dann wieder auf 100 %): sonnig 21 -> 38 %, herrlich 14 -> 25 %, "
          "mild 6 -> 11 %, schön 24 -> 6 %, warm 12 -> 3 %, gut 9 -> 2 %. Die Rangfolge kippt zu Grün.")

d.figure("Zwei Sätze, mit dem Schlüssel gelesen", *WZ.satz())
d.summary("Bild: Satz eines Menschen 5 von 10 Wörtern grün (wie Münzwurf), KI-Satz mit Wasserzeichen 9 von 10 grün. "
          "Beide lesen sich normal, die Farben sieht nur, wer den Schlüssel hat.")

# ------------------------------------------------------------- Kapitel 02 ---
d.chapter(2, "Der Nachweis", "Grüne Wörter zählen")

d.bullets("Wer prüft, zählt", [
    ("Der Prüfer hat den **Schlüssel** und färbt jedes Wort nach: grün oder rot", 0),
    ("Text von einem Menschen: ungefähr **die Hälfte** grün — wie beim Münzwurf", 0),
    ("KI-Text mit Wasserzeichen: **deutlich mehr** als die Hälfte", 0),
    ("Aber auch ein Mensch kann **zufällig** viele grüne Wörter erwischen", 0),
    ("Die Frage ist also: **Wie unwahrscheinlich** ist das Ergebnis? → Statistik", 0),
])
d.summary("Nachweis: Prüfer mit Schlüssel färbt jedes Wort nach; Mensch etwa die Hälfte grün, KI deutlich mehr; "
          "auch Zufall kann viele grüne liefern, darum Statistik: wie unwahrscheinlich ist das Ergebnis?")

d.figure("Zufall oder Wasserzeichen?", *WZ.glocke(), source=KIRCHENBAUER)
d.summary("Bild: Glockenkurve für 200 Wörter, Menschen um 100 grüne (meist 86 bis 114), Schwelle z = 4 bei etwa 128, "
          "KI-Text mit 150 grünen bei z etwa 7,1 weit rechts.")

d.bullets("Die Rechnung: der z-Wert", [
    ("$T = 200$ Wörter, ohne Zeichen ist jedes mit $\\gamma = 0{,}5$ grün — gezählt: $G = 150$", 0),
    ("Erwartet: $\\gamma T = 100$ grüne, Streuung $\\sqrt{T\\gamma(1-\\gamma)} = \\sqrt{50} \\approx 7{,}1$", 0),
    ("$z = \\dfrac{G - \\gamma T}{\\sqrt{T\\gamma(1-\\gamma)}} = \\dfrac{150 - 100}{7{,}1} \\approx 7{,}1$", 0),
    ("Ab $z > 4$ heißt es **Wasserzeichen** — Zufall nur in **1 von 31 600** Fällen", 0),
    ("Bei $z \\approx 7{,}1$: Zufall in **1 von 1,3 Billionen** Fällen", 0),
])
d.summary("Rechnung: T = 200 Wörter, gamma = 0,5, G = 150 grün; erwartet 100, Streuung Wurzel(50) etwa 7,1; "
          "z = (G - gamma T) / Wurzel(T gamma (1 - gamma)) = 50 / 7,1 etwa 7,1. Ab z > 4 Wasserzeichen, Zufall 1 von 31 600; "
          "bei z 7,1 Zufall 1 von 1,3 Billionen (Normalverteilung als Näherung).")

d.table_top("Je länger der Text, desto sicherer", [
    ["Wörter", "davon grün (75 %)", "z-Wert", "so oft wäre es Zufall"],
    ["20", "15", "2,2", "1 von 80"],
    ["40", "30", "3,2", "1 von 1 300"],
    ["100", "75", "5,0", "1 von 3,5 Millionen"],
    ["200", "150", "7,1", "1 von 1,3 Billionen"],
    ["400", "300", "10,0", "1 von $10^{23}$"],
], [150, 230, 130, 306], [
    ("Ein Satz oder eine kurze Antwort ist **nicht sicher** prüfbar", 0),
    ("Ab etwa 100 Wörtern wird es **eindeutig** — der z-Wert wächst mit $\\sqrt{T}$", 0),
], font_size=14, bold_cols=(0,), marks={(1, 3): TINT_RED, (4, 3): TINT_GREEN})
d.summary("Tabelle bei 75 % grün: 20 Wörter z 2,2 (Zufall 1 von 80), 40 Wörter z 3,2 (1 von 1 300), 100 Wörter z 5,0 "
          "(1 von 3,5 Mio.), 200 Wörter z 7,1 (1 von 1,3 Billionen), 400 Wörter z 10 (1 von 10^23). "
          "Kurze Texte nicht sicher prüfbar; z wächst mit Wurzel T.")

# ------------------------------------------------------------- Kapitel 03 ---
d.chapter(3, "In der Praxis", "Claude, Gemini und das Gesetz")

d.bullets("Was Claude macht", [
    ("Verfahren nach dem Vorbild von **SynthID-Text** (Google DeepMind, 2024)", 0),
    ("Eingebaut **im Modell** — gilt in jeder App und auf jeder Cloud", 0),
    ("Das Zeichen **reist mit**: Kopieren und Einfügen ändert nichts", 0),
    ("Bilder und Dateien bekommen stattdessen signierte **Herkunftsdaten (C2PA)**", 0),
    ("Das genaue Verfahren ist **geheim** — ein Prüfwerkzeug gibt es erst im Test", 0),
])
d.summary("Claude: Verfahren nach dem Vorbild von Googles SynthID-Text, im Modell eingebaut, auf allen Plattformen, "
          "übersteht Kopieren; Bilder und Dateien bekommen C2PA-Herkunftsdaten; genaues Verfahren nicht veröffentlicht, "
          "Detection-API nur in privater Vorschau.")

d.figure("Claudes Vorbild: ein Turnier (vereinfacht)", *WZ.turnier(), source=SYNTHID)
d.summary("Bild SynthID-Text vereinfacht: 4 Vorschläge (sonnig, schön, herrlich, warm), Geheimtest g aus Schlüssel und Kontext; "
          "wer g = 1 hat, gewinnt die Runde, Gleichstand Münzwurf; Sieger sonnig kommt in den Text. "
          "Im Text stecken auffällig viele Wörter mit g = 1.")

d.bullets("Was das Zeichen schwächt", [
    ("**Umschreiben** — von Hand oder von einer anderen KI", 0),
    ("**Übersetzen** in eine andere Sprache", 0),
    ("**Kurze Texte**: zu wenige Wörter zum Zählen", 0),
    ("**Feste Antworten** ohne Spielraum: „Die Hauptstadt Frankreichs ist Paris.“", 0),
    ("Bei älteren Claude-Modellen: **geänderte Würfel-Einstellungen** (temperature, top_p, top_k)", 0),
])
d.summary("Schwächen: Umschreiben, Übersetzen, kurze Texte, feste Antworten ohne Spielraum; bei älteren Claude-Modellen "
          "(Opus 4.6, Sonnet 4.6) nur mit Standardwerten von temperature, top_p, top_k. Anthropic: nicht vollständig beweiskräftig.")

d.two_cols("Wasserzeichen oder KI-Detektor?", [
    ("**Wasserzeichen**", 0),
    ("beim Schreiben **absichtlich** gesetzt", 1),
    ("geprüft mit dem **Schlüssel**", 1),
    ("Ergebnis mit berechneter Wahrscheinlichkeit", 1),
    ("prüfen kann nur, wer den Schlüssel hat", 1),
], [
    ("**KI-Detektor**", 0),
    ("rät **nachträglich** aus dem Stil", 1),
    ("kein Schlüssel — nur eine Vermutung", 1),
    ("viele **Fehlalarme**", 1),
    ("trifft besonders oft Nicht-Muttersprachler", 1),
])
d.summary("Vergleich: Wasserzeichen absichtlich beim Schreiben gesetzt, mit Schlüssel geprüft, berechnete Wahrscheinlichkeit, "
          "nur der Schlüsselinhaber prüft. KI-Detektor rät nachträglich aus dem Stil, keine Gewissheit, viele Fehlalarme, "
          "besonders bei Nicht-Muttersprachlern (Liang u. a. 2023).")

d.bullets("Warum jetzt? Der EU AI Act", [
    ("**Artikel 50**: KI-Inhalte müssen **maschinenlesbar** gekennzeichnet sein", 0),
    ("Stichtag **2. August 2026**: alle seither erschienenen Claude-Modelle sind markiert", 0),
    ("Ältere Modelle folgen bis zur Frist am **2. Dezember 2026**", 0),
    ("Ziel: **Desinformation und Deepfakes** erkennbar machen", 0),
    ("Das Zeichen sagt nur **„von einer KI“** — nicht, **wer** gefragt hat", 0),
])
d.summary("EU AI Act Artikel 50: KI-Inhalte maschinenlesbar kennzeichnen; alle Claude-Modelle seit 2. August 2026 markiert, "
          "ältere bis zur Frist am 2. Dezember 2026; Ziel Desinformation und Deepfakes erkennen; Zeichen sagt nur 'KI', nicht wer.")

# ------------------------------------------------------------- Kapitel 04 ---
d.chapter(4, "Wer war's?", "DeepSeek, Claude oder ChatGPT — geht das überhaupt?")

d.table_top("Wer markiert wie? (Stand Oktober 2026)", [
    ["Anbieter", "Verfahren", "seit", "wer kann prüfen?"],
    ["Anthropic (Claude)", "Wortwahl-Muster nach SynthID-Text", "Aug. 2026, ältere ab 3. Nov.", "Anthropic, Test-API für wenige"],
    ["OpenAI (ChatGPT)", "„textGrain“, Wortwahl-Muster", "Okt. 2026, nur in der EU", "nur zugelassene Forschende"],
    ["Google (Gemini)", "SynthID-Text", "2024", "Verfahren offen (Open Source)"],
    ["DeepSeek", "Kennzeichnungspflicht in China", "Sept. 2025", "Verfahren nicht öffentlich"],
], [160, 250, 176, 230], [
    ("Jeder Anbieter hat seinen **eigenen Schlüssel** — prüfen kann er nur seine eigenen Texte", 0),
    ("Ein gemeinsames Prüfwerkzeug für alle gibt es **nicht**", 0),
], font_size=13, bold_cols=(0,))
d.summary("Wer markiert wie (Oktober 2026): Anthropic Wortwahl-Muster nach SynthID-Text seit Aug. 2026, ältere Modelle ab 3. Nov., "
          "Test-API für wenige; OpenAI 'textGrain' seit Okt. 2026 nur in der EU, Prüfung nur für zugelassene Forschende; "
          "Google SynthID-Text seit 2024, Open Source; DeepSeek: Kennzeichnungspflicht in China seit Sept. 2025, Verfahren "
          "nicht öffentlich. Jeder hat seinen eigenen Schlüssel, kein gemeinsames Prüfwerkzeug.")

d.bullets("Wie aus drei Zählungen Prozente werden", [
    ("Gedankenexperiment: **alle drei Anbieter** prüfen den Text mit ihrem Schlüssel", 0),
    ("Je Anbieter ein Faktor: Wie viel besser passt die Zählung zu „markiert“ als zu „Zufall“?", 0),
    ("$L = \\dfrac{0{,}75^{G}\\cdot 0{,}25^{T-G}}{0{,}5^{T}} = 1{,}5^{G}\\cdot 0{,}5^{T-G}$", 1),
    ("„Keiner der drei“ (ein Mensch oder ein anderes Modell) bekommt den Faktor $1$", 0),
    ("Prozent = eigener Faktor ÷ Summe aller Faktoren — der **Satz von Bayes**", 0),
    ("Annahme: vorher sind alle vier **gleich wahrscheinlich**", 0),
])
d.summary("Bayes: alle drei Anbieter prüfen mit ihrem Schlüssel; Faktor L = 0,75^G * 0,25^(T-G) / 0,5^T = 1,5^G * 0,5^(T-G); "
          "keiner der drei (Mensch oder anderes Modell) Faktor 1; Prozent = eigener Faktor / Summe aller Faktoren; vorher alle vier gleich wahrscheinlich.")

d.figure("Beispiel 1: ein Aufsatz", *WZ.wer_wars("Ein Aufsatz mit 200 Wörtern, so abgegeben, wie die KI ihn schrieb",
                                                200, (148, 103, 96), "Klar: Claude von Anthropic."),
         source=KIRCHENBAUER)
d.summary("Beispiel 1: Aufsatz 200 Wörter; Anthropic-Schlüssel 148 grün (z 6,8), OpenAI 103 (z 0,4), DeepSeek 96 (z -0,6) "
          "-> Anthropic über 99,9 %, alle anderen etwa 0 %. Klar Claude.")

d.figure("Beispiel 2: ein Absatz", *WZ.wer_wars("Ein Absatz mit 80 Wörtern",
                                               80, (42, 47, 53), "Ziemlich sicher DeepSeek — aber nicht ganz."),
         source=KIRCHENBAUER)
d.summary("Beispiel 2: Absatz 80 Wörter; Anthropic 42 grün (z 0,4), OpenAI 47 (z 1,6), DeepSeek 53 (z 2,9) -> DeepSeek 94 %, "
          "keiner der drei 6 %, OpenAI 0,1 %, Anthropic etwa 0 %.")

d.figure("Beispiel 3: eine kurze Nachricht", *WZ.wer_wars("Eine Nachricht mit 40 Wörtern",
                                                         40, (26, 25, 20), "Nur eine Tendenz — kein Beweis."),
         source=KIRCHENBAUER)
d.summary("Beispiel 3: Nachricht 40 Wörter; Anthropic 26 grün (z 1,9), OpenAI 25 (z 1,6), DeepSeek 20 (z 0) -> Anthropic 57 %, "
          "keiner der drei 24 %, OpenAI 19 %, DeepSeek 0,1 %. Kurzer Text: nur Tendenz.")

d.bullets("Geht das überhaupt? Die ehrliche Antwort", [
    ("**Im Prinzip ja**: jeder Schlüssel liefert eine Zählung, Bayes macht daraus Prozente", 0),
    ("**Heute nein**: die Schlüssel bleiben bei den Anbietern, es gibt kein gemeinsames Prüfwerkzeug", 0),
    ("Lange, unveränderte Texte: **eindeutig** — kurze oder umgeschriebene: nur eine **Tendenz**", 0),
    ("25 % der Wörter durch Synonyme ersetzt: OpenAI erkennt nur noch **17 %** der Texte", 0),
    ("Ganz ohne Wasserzeichen verrät der **Stil** das Modell: 97 % Treffer bei fünf Modellen", 0),
])
d.summary("Ehrliche Antwort: im Prinzip ja (Zählung je Schlüssel, Bayes), heute nein (Schlüssel bleiben bei den Anbietern). "
          "Lange unveränderte Texte eindeutig, kurze/umgeschriebene nur Tendenz. OpenAI: 25 % Synonyme -> nur noch 17 % erkannt "
          "(10 % -> 66 %). Ohne Wasserzeichen: Stil-Klassifikator erkennt ChatGPT, Claude, Grok, Gemini, DeepSeek zu 97,1 % "
          "(Sun u. a., ICML 2025) - eine Schätzung, kein Beweis.")

d.bullets("Zum Diskutieren", [
    ("Ist es fair, dass **nur der Anbieter** prüfen kann?", 0),
    ("Sollte eine Schule KI-Texte prüfen **dürfen**?", 0),
    ("Wer einen KI-Text umschreibt: **wessen Text** ist das dann?", 0),
    ("Warum ist **offen angeben** besser als verstecken?", 0),
    ("Brauchen bald auch **Menschen-Texte** ein Echtheitszeichen?", 0),
])
d.summary("Diskussionsfragen: nur Anbieter kann prüfen - fair? Darf die Schule prüfen? Umgeschriebener KI-Text - wessen Text? "
          "Offen angeben statt verstecken? Echtheitszeichen für Menschen-Texte?")

d.bullets("Quellen: das Verfahren", [
    ("Anthropic: Mail „Text watermarking begins November 3, 2026“ (28.10.2026) und Hilfeseite „How Claude marks AI-generated content“", 0),
    ("J. Kirchenbauer u. a.: <i>A Watermark for Large Language Models</i>, ICML 2023 (arXiv 2301.10226)", 0),
    ("S. Dathathri u. a.: <i>Scalable watermarking for identifying large language model outputs</i>, Nature 634, 2024", 0),
    ("W. Liang u. a.: <i>GPT detectors are biased against non-native English writers</i>, Patterns 4, 2023", 0),
    ("M. Sun u. a.: <i>Idiosyncrasies in Large Language Models</i>, ICML 2025 (arXiv 2502.12150)", 0),
])
d.summary("Quellen Verfahren: Anthropic-Mail 28.10.2026 und Hilfeseite; Kirchenbauer u. a. ICML 2023; Dathathri u. a. Nature 2024 "
          "(SynthID-Text); Liang u. a. Patterns 2023; Sun u. a. ICML 2025.")

d.bullets("Quellen: Anbieter und Recht", [
    ("OpenAI: Ankündigung „textGrain“ für ChatGPT und Codex in der EU, 5.10.2026 (nach Presseberichten)", 0),
    ("China: Maßnahmen zur Kennzeichnung KI-erzeugter Inhalte und Norm GB 45438-2025, gültig seit 1.9.2025", 0),
    ("Verordnung (EU) 2024/1689 (AI Act), Artikel 50", 0),
    ("Fotos: Wikimedia Commons — 50-Euro-Schein (gemeinfrei), Schöpfsieb (Yamaplos, CC BY-SA 4.0), Büttenpapier (Hahnemühle PR, CC BY-SA 3.0)", 0),
])
d.summary("Quellen Anbieter und Recht: OpenAI textGrain 5.10.2026; Fotos Wikimedia Commons; China Kennzeichnungsmaßnahmen "
          "GB 45438-2025 seit 1.9.2025; EU AI Act Artikel 50.")

d.merksatz("Ein Wasserzeichen im KI-Text ist keine Markierung, sondern Statistik: Die KI wählt ein bisschen zu oft "
           "die „grünen“ Wörter — und nur wer den Schlüssel hat, kann nachzählen.")
d.summary("Merksatz: Wasserzeichen im KI-Text ist Statistik - die KI wählt etwas zu oft die grünen Wörter, "
          "nur wer den Schlüssel hat, kann nachzählen.")

d.save()
