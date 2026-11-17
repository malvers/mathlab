#!/usr/bin/env python3
"""DocBibo - Ausleihen in 30 Sekunden: a mini deck that explains the lending app of the school library
(textbooks, KES 205) to the colleague in charge and to other teachers - how to lend, how to take a book back,
the overview, how the app gets onto a smartphone, and what comes next.

Doc, 17.11.2026, about the nine screenshots from the Pixel (invented demo data only): "Dann macht daraus bitte ein
kleines Mini-Deck. Was das alles erklärt." Background: the talk in the library on 17.11. (DocMitschrift 12:15-12:19:
note the number, look up the pupil, type the six digits - and the wish that pupils extend their books themselves).

HTML only: the screenshots sit in the central smartphone frame (deck.css .smartphone), upright here so the screens
stay readable, and the QR is a static inline SVG (segno) - the decks have no central QR for an arbitrary link.
The pictures are WebP copies (540 px wide) in HTML/decks/img/docbibo/. Like every deck script: only for the first
build - afterwards HTML/decks/docbibo.html is the source.

    python3 tools/pptx/html_deck.py build_docbibo.py
"""
import html
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
from deck_markup import markup
import segno

d = MathDeck("docbibo.pptx")
d.umfrage = False          # a talk to colleagues, not a lesson: no survey at the end

IMG = "img/docbibo/"
URL = "https://docalvers.de/bibo/"
PHONE_W = 200.0            # the frame: 6 px rim around a 188 px screen of 1080 x 2400 -> 429.8 px high
PHONE_TOP = 62.0           # beside the short title, down to 492 - clear of the footer line at 504
PHONE_X = (472.0, 688.0)   # two phones side by side, the right one flush with the right margin (888)


def phone(src, alt, x, g=None, top=PHONE_TOP, w=PHONE_W):
    """One screenshot in the central smartphone frame, upright (the frame's turn is for a single phone beside a QR);
    with g it comes on that click."""
    cls, data = "smartphone", ""
    if g is not None:
        cls, data = "smartphone step kommt", ' data-g="%d"' % g
    return ('<div class="%s"%s style="left:%gpx;top:%gpx;width:%gpx;transform:none"><img src="%s%s" alt="%s"></div>'
            % (cls, data, x, top, w, IMG, src, html.escape(alt, quote=True)))


def bullets(lines):
    """[(text, level)] -> the deck's bullet lines, one click per level-0 line (as html_deck.bullet_list)."""
    out, g = [], -1
    for text, level in lines:
        g += level == 0
        out.append('<p class="line l%d step" data-g="%d">%s</p>' % (level, max(g, 0), markup(text)))
    return "\n".join(out)


def phone_slide(title, unter, lines, phones, body_w=372):
    """Bullets on the left, one or two phones on the right; `unter` is the quiet line beside the rules."""
    d._slide("content", '<h3>%s</h3><div class="rules"></div><p class="h3-unter">%s</p>'
             '<div class="body" style="width:%gpx">%s</div>%s'
             % (markup(title), markup(unter), body_w, bullets(lines), "".join(phones)))


# ------------------------------------------------------------------ title ---
d.title("Schulbibliothek · KES 205", "DocBibo – Ausleihen in 30 Sekunden",
        "Scannen, Namen sagen, fertig: die Ausleih-App für unsere Lehrbücher")
if 'vorspann/buzzer.html' in d.slides[-1]:
    d.slides.pop()         # the buzzer is for a class, not for colleagues
d.summary("Titel: DocBibo, die Ausleih-App für die Lehrbücher der Schulbibliothek (Raum KES 205, Kesselsdorfer "
          "Straße): Buch scannen, Namen sagen, fertig - Ausleihen in rund 30 Sekunden.")

# -------------------------------------------------------- before / after ---
d.two_cols("Bisher – und mit DocBibo", [
    ("Bisher", 0),
    ("Buchnummer auf einen Zettel **notieren**", 1),
    ("Im Programm den **Schüler suchen**", 1),
    ("Sechsstellige Nummer **eintippen**", 1),
    ("Viele Fenster, Felder mit unpassenden Vorgaben", 1),
], [
    ("Mit DocBibo", 0),
    ("Barcode mit dem Smartphone **scannen**", 1),
    ("Namen **sagen** oder tippen", 1),
    ("**Ausleihen** tippen – fertig", 1),
    ("Die Frist steht schon da: 4 Wochen", 1),
])
d.summary("Bisher: Buchnummer notieren, im Bibliotheksprogramm den Schüler suchen, die sechsstellige Nummer "
          "eintippen, viele Fenster und unpassende Voreinstellungen. Mit DocBibo: Barcode mit dem Smartphone "
          "scannen, Namen sagen oder tippen, Ausleihen tippen, fertig; die Frist von 4 Wochen ist schon "
          "vorgeschlagen.")

# ---------------------------------------------------------------- lending ---
phone_slide("Buch scannen", "Ausleihen · Schritt 1 von 3", [
    ("**Scannen** tippen und die Kamera auf den Barcode halten", 0),
    ("Oder die sechsstellige Nummer tippen", 1),
    ("Das Buch erscheint sofort: Titel, Fach, Klasse", 0),
    ("Mit Stand: **im Regal** oder schon ausgeliehen", 1),
], [phone("01-start.webp", "DocBibo: Start mit dem Knopf Scannen", PHONE_X[0], 0),
    phone("02-buch.webp", "DocBibo: Buch 980370 Zahlenwerk 11 erkannt, im Regal", PHONE_X[1], 1)])
d.summary("Schritt 1 Buch scannen: Scannen tippen, Kamera auf den Barcode der Bibliothek (sechsstellige Nummer, "
          "Code 128) halten, oder die Nummer tippen; das Buch erscheint mit Titel, Fach, Klasse und Stand (im Regal "
          "oder ausgeliehen). Beispiel: Nr. 980370, Zahlenwerk 11 - Analysis, im Regal.")

phone_slide("Namen sagen", "Ausleihen · Schritt 2 von 3", [
    ("**Namen sagen** oder die ersten Buchstaben tippen", 0),
    ("DocBibo zeigt die drei besten Treffer", 1),
    ("Treffer antippen – die Frist steht schon: **4 Wochen**", 0),
    ("Grüner Knopf: **Ausleihen bis 15.12.**", 1),
], [phone("03-name-suche.webp", "DocBibo: Mia getippt, drei Treffer", PHONE_X[0], 0),
    phone("04-ausleihen-bis.webp", "DocBibo: Mia Beispiel gewählt, Ausleihen bis 15.12.", PHONE_X[1], 1)])
d.summary("Schritt 2 Namen sagen: den Namen sprechen (Spracherkennung) oder die ersten Buchstaben tippen; DocBibo "
          "zeigt die drei besten Treffer, auch wenn die Spracherkennung den Namen anders schreibt; Treffer antippen; "
          "die Rückgabe ist mit 4 Wochen schon vorgeschlagen, der grüne Knopf heißt dann z. B. Ausleihen bis 15.12. "
          "Beispiel mit erfundenem Namen: Mia Beispiel (Demo 11).")

phone_slide("Frist und fertig", "Ausleihen · Schritt 3 von 3", [
    ("Andere Frist: **2, 4 oder 8 Wochen**", 0),
    ("Oder tageweise mit − und +", 1),
    ("Ein Tipp auf **Ausleihen** – die grüne Meldung sagt was, an wen, bis wann", 0),
    ("Vertippt? **Rückgängig**", 1),
    ("Der Nächste: **Nächstes Buch scannen**", 1),
], [phone("06-frist-2-wochen.webp", "DocBibo: Frist 2 Wochen, Ausleihen bis 01.12.", PHONE_X[0], 0),
    phone("05-ausgeliehen.webp", "DocBibo: grüne Meldung Ausgeliehen an Mia Beispiel bis 15.12.2026",
          PHONE_X[1], 1)])
d.summary("Schritt 3: die Frist mit 2, 4 oder 8 Wochen wählen oder mit Minus und Plus tageweise verschieben; ein Tipp "
          "auf Ausleihen, dann bestätigt eine grüne Meldung Buch, Schüler und Rückgabedatum (Beispiel: Zahlenwerk 11, "
          "Nr. 980370, an Mia Beispiel bis Di., 15.12.2026); Rückgängig nimmt es zurück, Nächstes Buch scannen macht "
          "weiter.")

# ----------------------------------------------------------------- return ---
phone_slide("Zurückgeben", "Rückgabe", [
    ("Das Buch scannen – DocBibo zeigt, **an wen** es ausgeliehen ist und bis wann", 0),
    ("**Zurückgeben** tippen – das Buch steht wieder **im Regal**", 0),
    ("Auch hier geht **Rückgängig**", 1),
], [phone("08-rueckgabe.webp", "DocBibo: ausgeliehen an Mia Beispiel, Knopf Zurückgeben", PHONE_X[0], 0),
    phone("09-zurueckgegeben.webp", "DocBibo: grüne Meldung Zurückgegeben, steht wieder im Regal", PHONE_X[1], 1)])
d.summary("Rückgabe: ein ausgeliehenes Buch scannen, DocBibo zeigt, an wen es seit wann ausgeliehen ist und wann es "
          "fällig ist; Zurückgeben tippen, die grüne Meldung sagt: steht wieder im Regal; Rückgängig geht auch hier.")

# --------------------------------------------------------------- overview ---
phone_slide("Die Übersicht", "Laufende Ausleihen", [
    ("Unter dem Scannen: alle **laufenden Ausleihen**, die frühesten Rückgaben zuerst", 0),
    ("<c2>**Rot**</c2>: überfällig", 1),
    ("<m1>**Gelb**</m1>: in den nächsten 3 Tagen fällig", 1),
    ("Mit Namen und Buchnummer – ein Blick genügt", 0),
], [phone("07-uebersicht.webp", "DocBibo: Liste der laufenden Ausleihen, 2 überfällig, 2 bald fällig", PHONE_X[1])],
    body_w=560)
d.summary("Die Übersicht: unter dem Scannen stehen alle laufenden Ausleihen, nach Rückgabedatum sortiert, die "
          "frühesten zuerst; rot markiert = überfällig, gelb = in den nächsten 3 Tagen fällig; jede Zeile mit Buch, "
          "Schüler, Klasse und Buchnummer. Beispiel: 8 laufende Ausleihen, 2 überfällig, 2 bald fällig.")

# ---------------------------------------------------------------- install ---
qr = segno.make(URL, error="m", micro=False).svg_inline(border=0, omitsize=True, dark="#000050")
qr = qr.replace("<svg ", '<svg role="img" aria-label="QR-Code zu %s" style="display:block;width:100%%;height:100%%" '
                % URL, 1)
d._slide("content", '<h3>So kommt DocBibo aufs Smartphone</h3><div class="rules"></div>'
         '<div class="body" style="width:520px">%s</div>'
         '<a href="%s" target="_blank" rel="noopener" title="DocBibo öffnen" style="position:absolute;left:660px;'
         'top:146px;width:228px;height:228px;padding:16px;border-radius:16px;background:#fff;'
         'box-shadow:0 6px 28px rgba(14,36,78,.18)">%s</a>'
         '<p class="labnote" style="left:660px;top:386px;width:228px;text-align:center">docalvers.de/bibo</p>'
         % (bullets([
             ("**docalvers.de/bibo** öffnen – oder den QR\u2011Code scannen", 0),
             ("**Android**: Chrome → Menü ⋮ → **App installieren**", 0),
             ("**iPhone**: Safari → Teilen → **Zum Home-Bildschirm**", 0),
             ("Danach startet DocBibo wie jede App vom Startbildschirm", 0),
             ("Kamera und Mikrofon einmal erlauben – fürs Scannen und den Namen", 1),
         ]), URL, qr))
d.summary("Installieren: docalvers.de/bibo öffnen oder den QR-Code scannen; Android: Chrome, Menü mit den drei "
          "Punkten, App installieren; iPhone: Safari, Teilen, Zum Home-Bildschirm; danach startet DocBibo wie eine "
          "App vom Startbildschirm; Kamera und Mikrofon einmal erlauben.")

# ------------------------------------------------------------------- next ---
d.two_cols("Stand heute – und wie es weitergeht", [
    ("Heute", 0),
    ("Ein **Prototyp** mit erfundenen Demo-Daten", 1),
    ("Jedes Gerät hat noch seinen **eigenen Stand**", 1),
    ("Läuft auf Android, iPhone und am Rechner", 1),
], [
    ("Als Nächstes", 0),
    ("**Meine Bücher**: Schüler sehen ihre Bücher und **verlängern selbst**", 1),
    ("**Erinnerung** vor der Frist, per Mail oder Teams", 1),
    ("**Übernahme** der Bücher und Schüler aus dem alten Programm", 1),
    ("**Datenschutz** klären – vor dem Echtbetrieb", 1),
])
d.summary("Stand heute: Prototyp mit erfundenen Demo-Daten, jedes Gerät speichert noch seinen eigenen Stand (kein "
          "gemeinsamer Bestand), läuft auf Android, iPhone und am Rechner. Als Nächstes: Meine Bücher - Schüler sehen "
          "ihre Bücher und verlängern selbst (Wunsch aus dem Gespräch in der Bibliothek); Erinnerung vor der Frist per "
          "Mail oder Teams; Übernahme von Büchern und Schülern aus dem alten Bibliotheksprogramm; Datenschutz klären, "
          "bevor echte Namen hineinkommen.")

d.save()
