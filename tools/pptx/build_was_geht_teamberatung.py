#!/usr/bin/env python3
"""Was geht?! - the 20-minute version for the Teamberatung BGY on Wed 25.11.2026, 10:30, room KES217 (~25 colleagues).

Doc, 24.11.2026 ~17:35 ("ja" to the plan): a short "Was geht?!" where everything runs LIVE - the deck is only the
frame, every scene has one button that opens the real page - plus the colleague quiz with all smartphones ("Die Klasse im
Blick" with the staff as the class), a wall of numbers and the closing line. Scenes and wording come from the script
HTML/drehbuch/was-geht.html (scenes 4-16, 21, 23, 24 and its "Leitplanken"). Not built yet and left out: intro film,
Doc figure, A380, fireworks button.
Doc, 18:00 ("ein Anfang, wir müssen dran arbeiten"): the quiz OPENS the talk, then its evaluation, then the show.
Doc, 18:05: the central buzzer slide right after the title and the central survey at the very end, as in every deck.
Doc, 18:08: every live slide with a screenshot of the real page on the right, fading out; a smaller, cooler button;
both as classes of the new central HTML/decks/deck-live.css. Doc, 18:12: Namen ziehen out (no demo class). 18:17: DocBib in.
18:20: Frag Solita on the KI-Wasserzeichen deck (slide 20). 18:23-18:25: screenshots taller, smaller, higher, the fade
ends before the edge; variant B .karte (no fade) for dark pictures. 18:28: Jacquard right after Atomorbitale.
18:32: DocPad embedded live in its slide (the central .labframe.bare, as in mathe11-linear) and "Zählen in
Papua-Neuguinea" with Maya and Babylon as side links. 18:35: the gratitude book (Ada's /tagebuch/) after DocBib - its
button opens a birthday view (an empty page with a card).
Order: greeting, title, buzzer, quiz (+ Mission Control), evaluation, bridge, plan, Frag Solita, book, DocBib, DocPad, Vorrechnen,
Atomorbitale, Jacquard, Zählen in Papua-Neuguinea, numbers, "First HMTL", Tagebuch (19:22: the finale), survey.
Every live scene since 19:05 is two slides: the poster, then the page itself as a live module.

LOCAL ONLY, like the script: this file, HTML/decks/was-geht-teamberatung.html, HTML/decks/deck-live.css and
HTML/decks/img/was-geht/ stand in .git/info/exclude.
Careful: the deck editor's green cloud ("Änderungen speichern und live stellen") commits through its own index and is
NOT stopped by that exclude - an edited deck would go public with one click (with the screenshots, without deck-live.css).

Screenshots (HTML/decks/img/was-geht/, WebP 1000 px wide, from 2x captures): plan, wasserzeichen, buch, vorrechnen,
orbitals, jacquard, zaehlen from a fresh headless browser (no profile, no logins, no classes, the local server's red frame taken
off); auswertung from Doc's Chrome in its empty state (0 of 29, no names); tagebuch from Doc's Chrome in the SAFE view
(?geb=25.11&tag=2026-11-25: empty pages, sparklers, no entry, no name; the mouse pointer painted over). DocBib reuses img/docbibo/05-ausgeliehen.webp
(demo data only). deck.webp (the old Wurf slide) is no longer used.

Numbers (counted 24.11.2026 on origin/main b09662428, the state docalvers.de runs):
    234 days        05.04.2026 (first commit "First HMTL") -> 25.11.2026
    5,314           git rev-list --count origin/main  (on the slide: "gespeicherte Arbeitsstände")
    ~1.5 million    update_loc.py run as a copy that wrote only to a scratchpad: 1,548,401 lines (repo alone 1,347,178;
                    the live intro page shows 1,497,889)
    103             labs-config.js: 136 tiles - 24 books - 7 tours - 1 outside link - 1 "Bücher" tile; 9 languages
    24 / 131        HTML/buch/ folders: 23 class books + the Abitur book, 131 editions (as in buch-gruss.js)
    4,567           class="b-task" in the German editions (druck.html left out)
    229 / 4,463     HTML/decks/*.html with <section class="slide"> (tafel.html, palliativversorgung.html have none)
    821 / 42        js/vorrechnen-aufgaben*.js run in page order in a node vm: AUFGABEN.length, BLOECKE.length
    11,655 / 647    window.QUIZ.questions in HTML/*test*.html (coordinatensystemtester.html left out)

Every slide carries a hidden speaker cue (an HTML comment) with its target time; the total is 20:00, the survey may run
after it.

    python3 tools/pptx/html_deck.py build_was_geht_teamberatung.py
"""
import html
import os
import re
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
import segno

LOCAL = "http://localhost:8765/"
QUIZ_URL = "https://docalvers.de/quiz-dienstberatung.html?klasse=KOLLEGIUM"
MC_URL = LOCAL + "svp/leistungstest.html?ziel=quiz-dienstberatung.html%3Fklasse%3DKOLLEGIUM"
SHOTS = "img/was-geht/"
ARIAL = "Arial,Helvetica,sans-serif"

# a picture of its own for the greeting, so the shared morning/zuordnung.json is not written (coffee - it is 10:30)
d = MathDeck("was-geht-teamberatung.pptx", greet_image="morning/morning-038f4b571b96.jpg")

# the deck links the central live-slide stylesheet after deck.css (the shared page template knows only deck.css)
_render = d.render


def render_with_live_css():
    page = _render()
    link = '<link rel="stylesheet" href="deck.css">'
    assert page.count(link) == 1, "deck.css link moved in html_deck.PAGE"
    return page.replace(link, link + '\n<link rel="stylesheet" href="deck-live.css">', 1)


d.render = render_with_live_css

CHEVRON = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" '
           'stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>')


CUES = []                  # [target, text] per cue; the running sums are filled in at the end, in slide order


def cue(target, text):
    """The hidden speaker cue of a slide: target time and what to click - a placeholder until number_cues()."""
    CUES.append([target, text.replace("--", "-")])
    return "<!--CUE%d-->" % (len(CUES) - 1)


def secs(t):
    m, s_ = t.split(":")
    return int(m) * 60 + int(s_)


def mmss(n):
    return "%d:%02d" % (n // 60, n % 60)


def number_cues():
    """Walk the slides in order and write each cue with its target time and the running sum."""
    total = 0
    for i, sl in enumerate(d.slides):
        def one(m):
            nonlocal total
            target, text = CUES[int(m.group(1))]
            total += secs(target)
            return "<!-- Spickzettel: Ziel %s, bis hier %s. %s -->" % (target, mmss(total), text)
        d.slides[i] = re.sub(r"<!--CUE(\d+)-->", one, sl)
    return total


def button(jump, label):
    """The LIVE key (deck-live.css .live-knopf): the next slide is the page itself, live in the deck. A click on it
    turns on exactly as the arrow does (decks/deck.js, Doc 20:02) - in a show from either window, the other follows.
    Not a link: a new tab would drop the beamer's fullscreen and end the show, and a #n link clicked in the presenter
    view moved the presenter alone (measured with two windows, 24.11.2026). jump: the module's slide number."""
    return ('<span class="live-knopf" data-modul="{n}" title="Klick oder Pfeil rechts: live in der Folie" role="button">'
            '<span class="live-punkt">LIVE</span><span>{lab}</span>{c}</span>'.format(n=jump, lab=html.escape(label), c=CHEVRON))


def modul(src, title, cue_html, w=1280, h=720):
    """The live module: the real page in the deck's own lab frame (deck.js: in a show the presenter's copy is live and
    every input in it is played again in the beamer's copy), 16:9 over almost the whole slide, the page laid out at
    w x h and scaled in. The central lab bar's "Seite in neuem Tab öffnen" is the small fallback (hidden in a show)."""
    top, height = 30.0, 474.0
    k = height / h
    width = round(w * k, 1)
    left = round((960 - width) / 2, 1)
    src = html.escape(src, quote=True)
    d._slide("content lab live-modul",
             '%s<p class="labnote live-modul-titel">%s</p>'
             '<div class="labframe" style="top:%gpx;left:%gpx;width:%gpx;height:%gpx">'
             '<iframe src="../%s" title="%s" style="width:%dpx;height:%dpx;transform:scale(%g)"></iframe></div>'
             '<div class="labbar"><a href="../%s" target="_blank" rel="noopener">Öffne die Seite in neuem Tab</a></div>'
             % (cue_html, html.escape(title), top, left, width, height, src, html.escape(title, quote=True), w, h,
                round(k, 5), src))


def live(title, text, url, label, what, shot, alt, cue_html, kind="", extra=""):
    """A live scene in two slides: the poster (headline, one line, the LIVE key, a quiet note, the screenshot of the page
    on the right) and right after it the page itself as a live module (Doc, 19:05: everything in the deck, as DocPad).
    url is the page under HTML/ (LOCAL in front is dropped). The scene's time goes 0:10 to the poster, the rest to the
    module."""
    k = int(re.search(r"CUE(\d+)", cue_html).group(1))
    target, text_cue = CUES[k]
    CUES[k] = ["0:10", "Poster. LIVE-Taste klicken oder Pfeil rechts (Klicker): die Seite live in der Folie."]
    jump = len(d.slides) + 2                       # the deck's slide numbers count from 1, the module comes next
    d._slide("content live-folie",
             '%s<h3>%s</h3><div class="rules"></div><p class="labnote live-text">%s</p>%s'
             '<p class="labnote live-note">%s</p>%s<figure class="live-shot%s"><img src="%s" alt="%s"></figure>'
             % (cue_html, html.escape(title), text, button(jump, label), what, extra,
                " " + kind if kind else "", html.escape(shot, quote=True), html.escape(alt, quote=True)))
    modul(url.replace(LOCAL, ""), title, cue(mmss(secs(target) - 10), text_cue +
          " Zurück zum Deck: einmal neben die Seite klicken, dann Pfeil."))


# --------------------------------------------------- what the book cost: 49 Cent ---
# Doc, 25.11.2026 06:30: the "Ein ganzes Lehrbuch ... für 49 Cent" slide of decks/mathe11-lehrbuch.html (the Making-of),
# taken from that deck's HTML at every build (it is the master, Doc saved it in the browser), with its coins, the drum
# roll and the parody credit line - not the slide with the single expenses (private). Solita's words of that deck stay
# there (this deck has no recorded voice).
def neunundvierzig_cent():
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "HTML", "decks",
                            "mathe11-lehrbuch.html"), encoding="utf-8").read()
    m = re.search(r'<section class="slide merksatz"><div class="quote-bar"[^>]*></div><p class="satz"[^>]*>Ein ganzes '
                  r'Lehrbuch.*?</section>', src, re.S)
    assert m and 'euro-49cent-parodie' in m.group(0), "the 49-cent slide moved in mathe11-lehrbuch.html"
    sec = m.group(0)
    body = sec[len('<section class="slide merksatz">'):sec.index('<p class="foot">')]
    # the credit line stays, as plain text here: a link would open a new tab and end the show (that deck keeps its link)
    body, n = re.subn(r'<a class="fig-source([^"]*)"([^>]*?) href="[^"]*" target="_blank" rel="noopener"([^>]*)>(.*?)</a>',
                      r'<p class="fig-source\1"\2\3>\4</p>', body, flags=re.S)
    assert n == 1, "the credit line of the 49-cent slide changed in mathe11-lehrbuch.html"
    return body


# ------------------------------------------------------------------ title ---
d.title("Teamberatung BGY · Mi 25.11.2026", "Was geht?!",
        "Was eine einzelne Lehrkraft mit KI heute bauen kann")
d.slides[-2] = d.slides[-2].replace(
    '<section class="slide title">', '<section class="slide title">' + cue(
        "0:30", "Show immer mit Esc beenden, nie das Präsenterfenster zumachen. Kurz halten: Bevor ich etwas "
                "zeige, seid ihr dran."), 1)
# and on the greeting, the very first slide, the same rule (0:00 - it stands while people sit down)
d.slides[0] = d.slides[0].replace('<section class="slide greet">', '<section class="slide greet">' + cue(
    "0:00", "Show immer mit Esc beenden, nie das Präsenterfenster zumachen."), 1)
# d.summary() would land on the buzzer stub title() appended after the title slide - so straight onto the title
d.summaries[len(d.slides) - 2] = ("Titel: Was geht?! Was eine einzelne Lehrkraft mit KI heute bauen kann - Kurzfassung "
                                  "für die Teamberatung BGY am 25.11.2026; erst ein Quiz mit dem Kollegium, dann wird alles "
                                  "live gezeigt, die Folien sind nur der Rahmen.")

# ------------------------------------------------- the buzzer ("Verstanden?") ---
# the central buzzer slide every lesson deck has right after its title (vorspann/buzzer.html, filled by deck.js) -
# Doc, 24.11.2026 18:05: "wie wir das immer gemacht haben"; html_deck.title() put the stub in, it only gets its cue
STUB = '<section class="slide" data-aus="vorspann/buzzer.html#1"></section>'
assert d.slides[-1] == STUB, "the buzzer stub moved in html_deck.title()"
d.slides[-1] = STUB.replace("></section>", ">%s</section>" % cue(
    "0:30", "Das Werkzeug aus jeder Stunde: QR scannen, dann jederzeit 'Hab ich nicht verstanden', "
                    "'zu langsam', 'zu schnell' oder anonymes Feedback. Während des Quiz nicht zum Buzzer wechseln: "
                    "Sperrschirm."), 1)

# ------------------------------------------- the quiz: Die Klasse im Blick ---
qr = segno.make(QUIZ_URL, error="m", micro=False).svg_inline(border=0, omitsize=True, dark="#000050")
qr = qr.replace("<svg ", '<svg role="img" aria-label="QR-Code zum Quiz" ', 1)
QUIZ_JUMP = len(d.slides) + 2
d._slide("content", '%s<h3>Die Klasse im Blick</h3><div class="rules"></div>'
         '<p class="labnote live-text">Heute seid ihr die Klasse: den QR auf eurem Zettel scannen – oder diesen hier.</p>'
         '%s<p class="labnote live-note">Mission Control: wer wo steht, wer gerade raus ist</p>'
         '<div class="live-qr" title="%s">%s</div>'
         '<p class="labnote live-qr-unter">docalvers.de/quiz-dienstberatung</p>' % (
             cue("1:00", "Alle Smartphones: QR auf dem eigenen Zettel (bringt den Code mit) oder diesen hier und "
                         "den Code vom Zettel eintippen. Vollbild-Wächter ist an: App gewechselt = roter Sperrschirm. "
                         "Dann Pfeil rechts: Mission Control live."),
             button(QUIZ_JUMP, "Mission Control"), html.escape(QUIZ_URL, quote=True), qr))
modul(MC_URL.replace(LOCAL, ""), "Mission Control", cue(
    "3:55", "ZUERST in Mission Control 'Namen verbergen' klicken - sonst stehen die Namen der Kollegen an den Kacheln "
            "auf dem Beamer. Dann "
            "laufen lassen: jede Kachel ein Smartphone, wer raus ist, wird rot. Zurück zum Deck: neben die Seite "
            "klicken, dann Pfeil."))
d.summary("Die Klasse im Blick: das Kollegium macht das Quiz der Dienstberatung (10 Fragen) am Smartphone, QR auf dem "
          "eigenen Zettel oder auf der Folie, Code vom Zettel; vorne zeigt Mission Control live jede Kachel, Fortschritt "
          "und wer die App gewechselt hat (roter Sperrschirm).")

# ------------------------------------------------------------ evaluation ---
live("Die Auswertung",
     "Wie hat das Kollegium abgeschnitten? Frage für Frage, live.",
     LOCAL + "quiz-dienstberatung.html?klasse=KOLLEGIUM&auswertung", "Auswertung öffnen",
     "Ergebnisse nur unter Zettel-Codes, ohne Namen",
     SHOTS + "auswertung.webp", "Live-Auswertung des Quiz: Einzelleistungen und Gruppenleistung pro Frage",
     cue("1:00", "Wenn alle abgegeben haben (oben: x von 29 Abgaben, aktualisiert alle 5 s). Die Seite zeigt keine "
                 "Namen, nur Zettel-Codes und die Gruppenleistung pro Frage (weiter unten). Die schwerste Frage "
                 "auflösen."),
     kind="breit")
d.summary("Die Auswertung des Quiz: Einzelleistungen unter den Zettel-Codes (ohne Namen) und die Gruppenleistung pro "
          "Frage, live, alle 5 Sekunden aktualisiert.")

# --------------------------------------------------------------- bridge ---
d._slide("merksatz", '%s<div class="quote-bar"></div>'
         '<p class="label" style="top:150px">Das war: Die Klasse im Blick</p>'
         '<p class="satz" style="top:186px;font:44px/1.2 %s">Und jetzt: Was geht?!</p>'
         '<p class="satz" style="top:270px;font:24px/1.35 %s;color:var(--body)">Ein ganz normaler Schultag – '
         'alles live, kein Screenshot.</p>' % (cue("0:15", "Überleitung: Das habt ihr eben erlebt. Jetzt "
                                                                    "zeige ich, was sonst noch geht."), ARIAL, ARIAL))
d.summary("Überleitung: Nach dem Quiz (Die Klasse im Blick) beginnt die Show Was geht?! - ein ganz normaler Schultag, "
          "alles live gezeigt.")

# ------------------------------------------------------------- the plan ---
live("Ein Schuljahr auf einer Seite",
     "Jahr → Woche → Stunde – und an jeder Stunde hängt das ganze Material.",
     LOCAL + "svp/mathe/mathe11.html", "Plan öffnen", "Stoffverteilungsplan Mathematik BGY 11",
     SHOTS + "plan.webp", "Stoffverteilungsplan Mathematik BGY 11 mit den Wochen des Schuljahrs",
     cue("1:30", "Ganzes Jahr zeigen (Ferien eingeklappt), dann KW 48 aufklappen: Material-Pillen, "
                          "Lehrbuch und Formelsammlung im Kopf."))
d.summary("Der Stoffverteilungsplan Mathematik BGY 11: das ganze Schuljahr auf einer Seite, Woche für Woche, jede "
          "Stunde mit ihrem Material (Decks, Vorrechnen, Aufgaben, Videos), Lehrbuch und Formelsammlung im Kopf.")

# ------------------------------------------------------- deck + Solita ---
live("Frag Solita",
     "Jede Folie hat ihre eigene Nachhilfe – auch abends um zehn.",
     LOCAL + "decks/ai-wasserzeichen.html#20", "Deck öffnen",
     "Unsichtbare Wasserzeichen in KI-Texten · Folie 20",
     SHOTS + "wasserzeichen.webp", "Folie Grün bekommt einen Bonus aus dem Deck Unsichtbare Wasserzeichen",
     cue("1:30", "Öffnet direkt Folie 20 (Grün bekommt einen Bonus). Solita in der Fußzeile fragen, z. B. "
                          "'Warum steigt sonnig auf 38 Prozent?' - Antwort in Docs Stimme. Solita braucht Netz und "
                          "ihr Passwort in diesem Browser."),
     kind="karte")
d.summary("Frag Solita im Deck Unsichtbare Wasserzeichen in KI-Texten, Folie 20 (Grün bekommt einen Bonus: grüne "
          "Wörter werden häufiger, rote seltener): jede Folie hat ihre eigene Nachhilfe, Solita antwortet zur Folie, "
          "auf Wunsch in Docs Stimme.")

# --------------------------------------------------------------- book ---
live("Ach ja, das Buch",
     "Interaktiv, als PDF kostenlos – und gedruckt mit ISBN. 24 Lehrbücher in 5 Sprachen.",
     LOCAL + "buch/mathe11/lb1.html", "Buch öffnen", "Mathematik · Berufliches Gymnasium 11",
     SHOTS + "buch.webp", "Lehrbuch Mathematik 11, Kapitel 1 mit Baumdiagramm",
     cue("1:00", "Ganz beiläufig. Ein Widget bewegen, auf 'Als PDF drucken' zeigen. "
                          "Gedruckt bei Amazon, ISBN 979-8161192665."))
d.summary("Das interaktive Lehrbuch Mathematik BGY 11 mit Widgets und Aufgaben, als PDF kostenlos, gedruckt mit ISBN "
          "979-8161192665; insgesamt 24 Lehrbücher in 131 Ausgaben, 5 Sprachen (manche in 9).")
d._slide("merksatz", cue("0:20", "Vier Klicks: Kapitel, Zeit, 'für ...', dann der Trommelwirbel mit den Münzen und der "
                                 "49-Cent-Münze (Parodie). Erklärung der 49 Cent: O drücken, versteckte Folie anklicken.") + neunundvierzig_cent())
d.summary("Was das Buch gekostet hat: ein ganzes Lehrbuch - 11 Kapitel, 179 Aufgaben, 24 Widgets, 183 Seiten - in 1:28 h "
          "für 49 Cent (Herstellung, Anteil an der Claude-Pauschale).")

# the two slides that explain the 49 cents (Doc, 06:45) - HIDDEN (the deck's own "skip"), 0:00 in the time plan: O and
# a click on the tile opens one anyway, the arrow goes on to the next shown slide. Read from the Making-of's HTML like
# the coins, without Solita's words and without links (a new tab would end the show).
def aus_lehrbuch(titel):
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "HTML", "decks",
                            "mathe11-lehrbuch.html"), encoding="utf-8").read()
    m = re.search(r'<section class="slide ([^"]*)"><h3>' + re.escape(titel) + r'</h3>.*?</section>', src, re.S)
    assert m, "slide '%s' not found in mathe11-lehrbuch.html" % titel
    sec = m.group(0)
    body = sec[sec.index('>') + 1:sec.index('<p class="foot">')]
    body = re.sub(r'<a ([^>]*?)href="[^"]*"([^>]*)>(.*?)</a>', r'<span \1\2>\3</span>', body, flags=re.S)
    body = re.sub(r'<div class="anthropic-clawd[^"]*"[^>]*><img[^>]*></div>', '', body)   # Clawd only on "Danke, Claude!"
    return m.group(1), body


# the cover wall (Doc, 25.11.2026 07:08: "unbedingt"): the 24 German books with the hub's own covers
# (resources/og/buch-<book>-cover.jpg, as index.html#buecher shows them), loaded only when the slide shows (lazy)
BUECHER = ["mathe5", "mathe6", "mathe7", "mathe8", "mathe9", "mathe10",
           "mathegy5", "mathegy6", "mathegy7", "mathegy8", "mathegy9", "mathegy10", "mathegy11", "mathegy11lk",
           "mathegy12", "mathegy12lk", "mathe11", "mathe12", "mathe12lk", "mathe13", "mathe13lk",
           "mathefos11", "mathefos12", "pruefung"]
covers = "".join('<img src="../resources/og/buch-%s-cover.jpg" alt="" loading="lazy" decoding="async">' % b for b in BUECHER)
d._slide("content", '%s<h3>24 Bücher in 5 Sprachen – and counting</h3><div class="rules"></div>'
         '<div class="cover-wand trommel-folge step kommt" data-g="0">%s</div>'
         '<p class="labnote cover-wand-unter">131 Ausgaben – kostenlos online, als PDF, gedruckt mit ISBN</p>'
         % (cue("0:20", "Ein Klick: Trommelwirbel, die 24 Einbände fallen herein. 131 Ausgaben, 5 Sprachen, manche in 9."),
            covers))
d.summary("24 Lehrbücher in 5 Sprachen (131 Ausgaben, manche in 9 Sprachen) - and counting: Oberschule 5-10, Gymnasium "
          "5-12 mit Leistungskurs, Berufliches Gymnasium 11-13, Fachoberschule 11/12 und ein Prüfungsbuch.")

for titel, was in (("Was haben wir dafür bezahlt?", "107 € im Monat, : 4,33 = 24,71 € pro Woche, davon 2 % = 0,49 € für "
                                                      "ein ganzes Lehrbuch."),
                   ("Einordnung", "Anteil an der Pauschale, keine Zusatzkosten; 24 Bücher ≈ 12 €, Übersetzungen ≈ 45 €, "
                                  "zusammen ≈ 57 € gegen ≈ 3,7 Mio. € - Faktor 65.000.")):
    cls, body = aus_lehrbuch(titel)
    d._slide(cls + " skip", cue("0:00", "VERSTECKT (nur über O): " + was + " Pfeil rechts geht danach normal weiter.") + body)
    d.summary("Versteckte Erklärung zu den 49 Cent: " + was)


# ------------------------------------------------------------- DocBib ---
live("DocBib",
     "Ausleihen in 30 Sekunden: Buch scannen, Namen sagen, fertig – für unsere Schulbibliothek.",
     LOCAL + "bib/", "DocBib öffnen", "Schulbibliothek KES 205 · Prototyp mit Demo-Daten",
     "img/docbibo/05-ausgeliehen.webp", "DocBib auf dem Smartphone: Buch an Mia Beispiel ausgeliehen (Demo-Daten)",
     cue("0:45", "Für die Lehrbücher in KES 205 gebaut: scannen, Namen sagen, ausleihen. Prototyp mit "
                          "erfundenen Demo-Daten, aufs Smartphone über docalvers.de/bib."),
     kind="hoch")
d.summary("DocBib, die Ausleih-App für die Lehrbücher der Schulbibliothek (KES 205): Buch scannen, Namen sagen, "
          "ausleihen - in rund 30 Sekunden; Prototyp mit erfundenen Demo-Daten, läuft auf Android, iPhone und am Rechner.")

# ------------------------------------------------------------- DocPad ---
# embedded, not a link-out (Doc, 18:32: "direkt als Modul in dem Ding drin") - the deck engine's own lab frame, bare,
# where mathe11-linear has it (deck.js: bareLab widens it, labFullscreenOnSlide keeps its full screen on the slide).
# A click into the frame gives it the keys; the deck's arrows do not fire while it has them (key events stay in the
# frame). The central lab bar puts "DocPad in neuem Tab öffnen" small above the frame's right corner.
d._slide("content lab", '%s<h3>DocPad</h3><div class="rules"></div>'
         '<p class="labnote live-text schmal">Der ClassPad im Browser – rechnen, zeichnen, Gleichungen lösen, alles live.</p>'
         '<p class="labnote live-note schmal" style="top:300px">Live in der Folie: hineinklicken und rechnen. '
         'Zurück zum Deck: auf die Überschrift klicken.</p>'
         # compact as DocPad always opens (Doc, 20:14: not pulled wide) - .kompakt stops the deck's own widening.
         # The frame runs from right of the narrow text column (216 px from 72) to the right content edge: DocPad
         # centres the case in it, so the case stands well to the right, and pulled wide it grows symmetrically up to
         # the frame's width - never over the text or past the slide. Raised and centred between the top and the
         # footer rule (Doc, 25.11.2026: "deutlich weiter nach rechts ... trotzdem noch reinpasst, wenn ich es groß
         # ziehe. Und weiter nach oben. Das sieht nach unten geklatscht aus")
         '<div class="labframe bare kompakt" style="top:56px;height:400px;left:312px;width:576px">'
         '<iframe src="../docpad/" title="DocPad" style="width:576px;height:400px"></iframe></div>'
         '<div class="labbar"><a href="../docpad/" target="_blank" rel="noopener">Öffne DocPad in neuem Tab</a></div>'
         % cue("1:15", "DocPad öffnet kompakt wie immer - für die Tastatur-Show selbst breit ziehen. In den Rechner "
                         "klicken, eine Aufgabe aus dem Saal eintippen, rechnen oder zeichnen. Solita "
                         "antwortet im Rechner in der Folie NICHT (sie läuft nur, wenn DocPad allein offen ist). Danach "
                         "einmal auf die Überschrift (links oben) klicken, dann gehen die Pfeiltasten wieder ans Deck - "
                         "der Rahmen reicht vom Text bis an den rechten Rand."))
d.summary("DocPad, der nachgebaute ClassPad (Grafik- und CAS-Rechner) im Browser, live in der Folie: exakt rechnen, "
          "Gleichungen lösen, Funktionen zeichnen.")

# ---------------------------------------------------------- Vorrechnen ---
live("Vorrechnen",
     "Die Tafel, die nie müde wird: 821 Aufgaben, jeder Schritt erklärt.",
     LOCAL + "vorrechnen.html", "Vorrechnen öffnen", "Aufgaben der Woche, Schritt für Schritt wie an der Tafel",
     SHOTS + "vorrechnen.webp", "Vorrechnen: 3x + 5 = 17, Schritt für Schritt bis x = 4",
     cue("1:00", "Eine Aufgabe der Woche durchklicken (Pfeil nach oben): Umformung hinter der Zeile, "
                          "Variable gelb."))
d.summary("Vorrechnen: die Aufgaben der Woche Schritt für Schritt wie an der Tafel, die Umformung steht hinter der "
          "Zeile, die gesuchte Variable leuchtet; 821 Aufgaben in 42 Blöcken.")

# ---------------------------------------------------------------- lab ---
ALT = ('<p class="labnote live-note live-oder">Joker für Fragen: Vektoren – mit FOS-Schülern gebaut · '
       'Trigonometrie – für ein Mädchen gebaut</p>')
live("Atomorbitale",
     "Physik, durch die man spazieren kann – eins von über 100 Laboren, in 9 Sprachen.",
     LOCAL + "orbitals.html", "Lab öffnen", "Atomorbitale in 3D, frei drehbar",
     SHOTS + "orbitals.webp", "Atomorbitale-Lab: ein d-Orbital in 3D",
     cue("1:00", "Der optische Knall. Ersatz darunter: Vektoren (die FOS-Schüler haben zugeschaut, wie ihr "
                          "Werkzeug entsteht) oder Trigonometrie (für ein Kind gebaut, jetzt für alle)."),
     kind="karte", extra=ALT)
d.summary("Ein Labor: Atomorbitale in 3D zum Drehen - eins von über 100 Laboren und Werkzeugen in 9 Sprachen; "
          "daneben das Vektoren-Lab (im Unterricht mit FOS-Schülern gebaut) und das Trigonometrie-Lab.")

# ------------------------------------------------------------- Jacquard ---
live("Jacquard",
     "Ein Webstuhl von 1805 in 3D: Lochkarten steuern jeden Faden – die erste Maschine mit Programm.",
     LOCAL + "jacquard.html", "Lab öffnen", "Vom Webstuhl zum Algorithmus · Muster aus Lochkarten",
     SHOTS + "jacquard.webp", "Jacquard-Lab: der Webstuhl in 3D und das gewebte Muster",
     cue("0:45", "Schritt drücken: Karte für Karte hebt der Webstuhl die Fäden, rechts wächst das Muster. "
                          "Loch = Faden oben - eine Lochkarte ist ein Programm."),
     kind="karte")
d.summary("Das Jacquard-Lab: ein Webstuhl von 1805 in 3D, Lochkarten steuern jeden Kettfaden einzeln - wo ein Loch ist, "
          "wird der Faden gehoben; so entsteht ein Bild nach Vorlage, die erste Maschine mit Programm.")

# ------------------------------------------------- Zählen in Papua-Neuguinea ---
ZAEHLEN_ALT = '<p class="labnote live-note live-oder">Joker für Fragen: Maya-Zahlen · Babylonische Zahlen</p>'
live("Zählen in Papua-Neuguinea",
     "Vom Daumen den Arm hinauf bis zur Nase: Die Oksapmin zählen mit dem ganzen Körper.",
     LOCAL + "koerperzaehlen.html", "Lab öffnen", "Zahlen ohne Ziffern · ein Zahlensystem am Körper",
     SHOTS + "zaehlen.webp", "Lab Zählen in Papua-Neuguinea mit Würfel und Foto (KI-generiertes Bild)",
     cue("0:45", "Ein paar Schritte zählen lassen: Daumen, Finger, Arm, bis zur Nase = 14. Daneben Maya "
                          "(Zwanzigersystem) und Babylon (Sechzigersystem) als Joker."),
     kind="karte", extra=ZAEHLEN_ALT)
d.summary("Das Lab Zählen in Papua-Neuguinea: die Oksapmin zählen über den Körper, vom Daumen über die Finger und den "
          "Arm bis zur Nase (14) und auf der anderen Seite zurück; daneben Maya-Zahlen und Babylonische Zahlen.")

# --------------------------------------------- prepared, not built: "Und so weiter …" ---
# Doc, 18:28: more labs may come. The idea for then: ONE fast slide "Und so weiter …" (~30 s) - a wall of 8-12 small lab
# screenshots (taken like the others, img/was-geht/), each a link, dropping in with the drum roll like the numbers
# (.trommel-folge), e.g. Würfelspiel, Dreiecks-Billard, BB84, Fraktale, Fourier, Maya-Zahlen, Neuronen, Wortvorhersage.
# Its grid would become a class of deck-live.css too. Not added until Doc says so.

# ------------------------------------------------------- wall of numbers ---
NUMBERS = [
    ("234", "Tage seit dem ersten Schritt am 05.04.2026"),
    ("5.314", "gespeicherte Arbeitsstände"),
    ("rund 1,5 Mio.", "Zeilen Code"),
    ("103", "Labore und Werkzeuge, in 9 Sprachen"),
    ("24", "Lehrbücher in 131 Ausgaben"),
    ("4.567", "Aufgaben in den Büchern"),
    ("229", "Decks mit 4.463 Folien"),
    ("821", "Vorrechnen-Aufgaben"),
    ("11.655", "Quizfragen"),
]
tiles = "".join('<div class="zahl"><b>%s</b><span>%s</span></div>' % (n, t) for n, t in NUMBERS)
d._slide("content", '%s<h3>Die Zahlenwand</h3><div class="rules"></div>'
         '<div class="zahlen-wand trommel-folge step kommt" data-g="0">%s</div>'
         '<p class="labnote zahlen-quelle">Gezählt am 24.11.2026 auf dem Stand, der auf docalvers.de läuft.</p>' % (
             cue("0:45", "Ein Klick: Trommelwirbel, die Zahlen fallen nacheinander herein."), tiles))
d.summary("Die Zahlenwand, gezählt am 24.11.2026: 234 Tage seit dem 05.04.2026, 5.314 gespeicherte Arbeitsstände, rund "
          "1,5 Millionen Zeilen Code, 103 Labore und Werkzeuge in 9 Sprachen, 24 Lehrbücher in 131 Ausgaben, 4.567 "
          "Buchaufgaben, 229 Decks mit 4.463 Folien, 821 Vorrechnen-Aufgaben, 11.655 Quizfragen.")

# ---------------------------------------------------- Drei Zahlen (Noten-Soll) ---
# Doc, 25.11.2026 06:25: "die, wo die steht ... und blende die da ein, dass ich eben diese 1600 Noten vergeben muss" -
# slide 3 of decks/noten-soll-2026-27.html, taken from that deck's HTML at every build (it is the master since Doc edited
# it in the browser; tools/pptx/noten_soll_svg.py drew it), so its figure, words and numbers stay exactly Doc's. Only
# totals, no names, no grades. Its words come in on clicks, the Noten column last.
def drei_zahlen():
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "HTML", "decks",
                            "noten-soll-2026-27.html"), encoding="utf-8").read()
    m = re.search(r'<section class="slide content"><h3>Drei Zahlen.*?</section>', src, re.S)
    assert m, "slide 'Drei Zahlen' not found in noten-soll-2026-27.html"
    sec = m.group(0)
    body = sec[len('<section class="slide content">'):sec.index('<p class="foot">')]
    assert re.search(r'1\.309.1\.633', body) and 'Noten' in body, "the Noten numbers changed in noten-soll-2026-27.html"
    def stufe(mm):                                   # left 24 = first column, 620 = third, 284 = the Noten (last)
        left = float(re.search(r'left:([\d.]+)px', mm.group(0)).group(1))
        g = 0 if left < 150 else 1 if left > 450 else 2
        return mm.group(0).replace('<p class="fl"', '<p class="fl step kommt" data-g="%d"' % g, 1)
    return re.sub(r'<p class="fl" style="[^"]*">', stufe, body)


d._slide("content", cue("0:30", "Drei Klicks: Leistungserhebungen, Notenempfänger, zuletzt die Noten: 1.309 bis 1.633 "
                                "Noten in diesem Schuljahr - so viele muss ich vergeben.") + drei_zahlen())
d.summary("Drei Zahlen für 12 Klassen (Mathe 11 und Info 11): 61 bis 77 Leistungserhebungen, 237 Notenempfänger, "
          "1.309 bis 1.633 Noten im Schuljahr.")

# -------------------------------------------------------------- the end ---
d._slide("merksatz", '%s<div class="quote-bar"></div>'
         # "Der Start" (Doc 07:00: the old headline out) - the first commit's story stays below it
         '<p class="label" style="top:150px">05.04.2026 · 17:50</p>'
         '<p class="satz" style="top:180px;font:700 48px/1.15 Orbitron,system-ui,sans-serif;color:var(--ink)">Der Start</p>'
         '<p class="satz" style="top:252px;width:400px;font:24px/1.3 %s;color:var(--body)">Der allererste Commit: „First '
         '<span class="c2">HMTL</span>“ – mit Tippfehler.</p>'
         '<p class="satz step kommt" data-g="0" style="top:345px;width:400px;font:26px/1.3 %s">Die Tippfehler sind von mir, '
         'der Rest ist Vibe-Coding.</p>'
         # a Falcon 9 lift-off (NASA, public domain: images.nasa.gov, KSC-20250115-MH-AJN01-0001-CLPS_Firefly_Blue_Ghost_
         # Mission_1_Isolated_Launch_Views-M11191, 00:45-00:54), silent and looping as a card on the right (Doc 07:00)
         '<figure class="live-shot karte" style="top:150px"><video src="img/was-geht/start-falcon9.mp4" muted autoplay loop '
         'playsinline preload="metadata" aria-label="Start einer Falcon-9-Rakete (NASA)"></video></figure>'
         '<p class="labnote live-credit" style="left:532px;top:356px;width:356px">Video: NASA</p>' % (cue("0:30", "Pause nach First HMTL, dann der Satz. Danach das "
                                                                  "Tagebuch als Finale."), ARIAL, ARIAL))
d.summary("Zum Schluss: der allererste Eintrag vom 05.04.2026 heißt First HMTL, mit Tippfehler. Die Tippfehler sind "
          "von Doc, der Rest ist Vibe-Coding.")

# ------------------------------------------------------------- Tagebuch ---
# the finale after the closing line (Doc, 19:22: "Folie 18 nach 29"): the sparklers, then the survey
# The module opens a birthday view of the book: an empty page with a card, the sparklers and the music box.
TAGEBUCH_ALT = ""
# Doc's chief's belated birthday (23.11.): Ada's safe view with the card "Nachträglich alles Gute, Dr. Hansen!" -
# an empty page, nothing from the real diary. A SURPRISE (Doc, 20:00): nothing about it on the poster - title, line
# and picture are the plain Tagebuch ones; the card only shows once the module is up.
# Ada's closed-book view (20:10): opens on the cover; the secret key H (or G) jumps to the card
HANSEN = "tagebuch/?seite=cover&geb=25.11&taste=h&gruss=Nachtr%C3%A4glich%20alles%20Gute%2C%7C_Dr.%20Hansen_!"
live("Dankbarkeits-Tagebuch",
     "Ein Dankbarkeits-Tagebuch als Buch im Browser – Leder, Goldschnitt, Büttenpapier, Siegellack, echte Seiten zum "
     "Umblättern.",
     LOCAL + HANSEN, "Tagebuch öffnen",
     "Und am Geburtstag tanzen Wunderkerzen über die Seite.",
     SHOTS + "tagebuch-cover.webp", "Das Tagebuch geschlossen: der Einband Grateful, das 3-Minuten-Tagebuch 2026",
     cue("0:45", "Öffnet GESCHLOSSEN und still. Pfeil rechts oder Klick auf Schließe/Einband: auf (innen 'Doc "
                 "Alvers', Titelseite); I oder Reiter Inhalt = Inhalt. GEHEIMTASTE H (auch G): von überall zur leeren "
                 "Seite 25.11. mit der Karte für Dr. Hansen, die Runde startet sofort, nach ca. 4 s Spieluhr Happy "
                 "Birthday. Nächster Klick: Wiegenlied + Abschied. X oder H: noch einmal. Nur die Geburtstagsseite zeigen. "
                 "Vorher einmal in das Buch klicken, damit die Tasten dort ankommen."),
     kind="karte gross", extra=TAGEBUCH_ALT)
d.summary("Ein Dankbarkeits-Tagebuch als Buch im Browser: Leder, Goldschnitt, Büttenpapier, Siegellack, echte Seiten zum "
          "Umblättern; morgens und abends je drei Fragen, am Geburtstag tanzen Wunderkerzen über die Seite.")

# ---------------------------------------------------------------- survey ---
# the deck's own survey stub, placed here, so html_deck.render() adds no second one at the end (Doc 07:07: before
# "Danke, Claude!"); data-jeopardy: the think music runs while it stands (deck.js, on Doc's Mac, once in a show)
d.slides.append('<section class="slide" data-aus="vorspann/umfrage.html#1" data-jeopardy>%s</section>' % cue(
    "0:00", "Umfrage: läuft, so lange sie braucht; dazu von selbst die Jeopardy-Musik (nur auf Docs Mac). Pfeil rechts: "
            "Danke, Claude! - die Musik hört auf."))

# ------------------------------------------------------------ Danke, Claude! ---
DIESES_DECK = "https://docalvers.de/decks/was-geht-teamberatung.html"   # this deck online (Doc 06:50), big in the middle
qr_deck = segno.make(DIESES_DECK, error="m", micro=False).svg_inline(border=0, omitsize=True, dark="#000050").replace(
    "<svg ", '<svg role="img" aria-label="QR-Code zu diesem Vortrag" ', 1)
# Doc, 20:05: "das kleine Claude-Männchen ... macht so einen Jump. Das müssen wir ganz am Ende einbauen" - the central
# asset resources/clawd.svg hops by itself (pure SVG + CSS, also as <img>); it comes in on a click as in
# decks/mathe11-lehrbuch.html (.anthropic-clawd, step kommt from deck.css) - nothing copied, no numbers
d._slide("merksatz", '%s<div class="quote-bar" style="top:64px;height:76px"></div>'
         '<p class="satz" style="top:60px;font:700 56px/1.15 Orbitron,system-ui,sans-serif;color:var(--ink)">Danke, Claude!</p>'
         # the children's cheer of the Making-of's last slide (data-ton, deck.js: on this click, beamer only) - Doc 07:05
         '<div class="anthropic-clawd step kommt" data-g="0" data-ton="../resources/kids-ausklang.wav" '
         'style="position:absolute;left:560px;top:326px;width:150px;'
         'height:123.3px"><img class="clawd" src="../resources/clawd.svg" alt="Clawd, das Maskottchen von Claude Code" '
         'style="position:absolute;left:0;bottom:0;width:150px;height:123.3px"></div>'
         '<div class="live-qr mitte" title="%s">%s</div>'
         % (cue("0:10", "Ein Klick: Clawd springt herein, dazu das Kindergejubel. Danke, Claude! Der QR führt zu diesem Vortrag online - "
                        "sag es dazu. Dann die Umfrage."), html.escape(DIESES_DECK, quote=True), qr_deck))
d.summary("Zum Schluss: Danke, Claude! - Clawd, das Maskottchen von Claude Code, springt vor Freude.")

# ---------------------------------------------------------------- survey ---
# no slide of its own here: html_deck.render() puts the central survey stub (vorspann/umfrage.html, deck-vote.js:
# "Wie fandet ihr „Was geht?!“?", QR to vote.html, live counter and bars) at the very end, as in every deck (d.umfrage
# stays on - Doc, 24.11.2026 18:05: the feedback tool at the end; it may run after the 20 minutes)

TOTAL = number_cues()
assert TOTAL == 20 * 60, "the talk is %s, not 20:00" % mmss(TOTAL)
d.save()
