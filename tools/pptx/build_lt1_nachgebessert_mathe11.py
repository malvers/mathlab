#!/usr/bin/env python3
"""Leistungstest 1: Papier und online - a short deck for BGY26 (Mathe 11) about the paper sheets changed after
submitting the online test on 23.11.2026, and what counts now.

Doc, 23.11.2026: the online result counts ("dann zählt das, was online ist. Das ist unfair."), "der Fehler liegt hier
ein bisschen bei uns" - the test page showed the solutions right after submitting, that display is switched off.
Later the same evening: "Das ist vollkommen anonym, das kann gerne ins Repo. Und ich will das sogar verlinken."
Anonymous: the sheets are called A, B, D, the pictures show only the answer rows (HTML/decks/img/lt1-nachgebessert/).

Not a lesson: no greeting with a quote, no buzzer, no survey, no "Üben & Nachlesen". The figures (rule 23) come from
mathe11_lt1_nachgebessert_svg.py. Only HTML, only for the first build - afterwards
HTML/decks/mathe11-lt1-nachgebessert.html is the source:

    python3 tools/pptx/html_deck.py build_lt1_nachgebessert_mathe11.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
from deck_markup import markup
import mathe11_lt1_nachgebessert_svg as F

d = MathDeck("mathe11-lt1-nachgebessert.pptx", greeting=False)
d.umfrage = False          # a clarification, not a lesson: no "Wie fandet ihr's?"
d.verweise = False         # and no exercises to point to

LEGENDE = "<c2>roter Rahmen</c2>: online gewählt, falsch  ·  <c3>grüner Rahmen</c3>: danach als richtig angezeigt"


def unter(text):
    """A quiet line beside the title strokes (deck.css .h3-unter) on the slide just added."""
    d.slides[-1] = d.slides[-1].replace('<div class="rules"></div>',
                                        '<div class="rules"></div><p class="h3-unter">%s</p>' % markup(text), 1)


def quelle(text):
    """A small line under the picture box (deck.css .fig-source) on the slide just added."""
    d.slides[-1] = d.slides[-1].replace('<p class="foot">', '<p class="fig-source">%s</p><p class="foot">'
                                        % markup(text), 1)


# ------------------------------------------------------------------ title ---
d.title("Mathematik · BGY26 · 23.11.2026", "Leistungstest 1: Papier und online",
        "Was passiert ist, was jetzt gilt und was wir geändert haben")
if 'vorspann/buzzer.html' in d.slides[-1]:
    d.slides.pop()         # the buzzer is for a lesson
d.summary("Titel: Leistungstest 1 Mathe BGY26 vom 23.11.2026, Papier und online - was passiert ist, was jetzt gilt "
          "und was geändert wurde.")

# ------------------------------------------------------------------- flow ---
svg, labels = F.ablauf()
d.figure("So lief der Test", svg, labels)
d.summary("Ablauf: 1 Teil A auf Papier angekreuzt, 2 online eingegeben und abgegeben, 3 die Testseite zeigte danach die "
          "richtige Antwort grün und die eigene falsche rot, 4 auf einigen Bögen wurden danach falsche Kreuze geschwärzt "
          "oder radiert und die angezeigte Lösung angekreuzt.")

# --------------------------------------------------------------- examples ---
svg, labels = F.beispiel(["a01", "a02", "a12", "a19"])
d.figure("Beispiel 1: falsche Kreuze geschwärzt", svg, labels)
unter(LEGENDE)
quelle("Bogen A · 4 der 7 geänderten Fragen · Ausschnitte der Antwortzeilen, anonym")
d.summary("Beispiel 1 (Bogen A): bei den Fragen 1, 2, 12 und 19 ist die online gewählte falsche Antwort auf dem Papier "
          "geschwärzt und die danach angezeigte richtige angekreuzt; insgesamt 7 Fragen so geändert.")

svg, labels = F.beispiel(["b09", "b11", "b15"], hinweis=(
    "Auffällig", "Radieren beim Ankreuzen ist normal. Auf diesem Bogen fehlen Kästchen aber **nur** bei den Fragen, "
                 "die <c2>**online falsch**</c2> waren."))
d.figure("Beispiel 2: Kästchen wegradiert", svg, labels)
unter(LEGENDE)
quelle("Bogen B · 3 der 4 geänderten Fragen · Ausschnitte der Antwortzeilen, anonym")
d.summary("Beispiel 2 (Bogen B): bei den Fragen 9, 11 und 15 ist das gedruckte Kästchen der online falschen Antwort "
          "wegradiert, angekreuzt ist die danach angezeigte Lösung. Kästchen fehlen nur bei Fragen, die online falsch "
          "waren.")

svg, labels = F.beispiel(["d05", "d13"], hinweis=(
    "Muster", "Geändert wurde **nur**, was <c2>**online falsch**</c2> war. Angekreuzt ist jedes Mal genau die Antwort, "
              "die die Testseite danach als <c3>**richtig**</c3> angezeigt hat."))
d.figure("Beispiel 3: immer dasselbe Muster", svg, labels)
unter(LEGENDE)
quelle("Bogen D · beide geänderten Fragen · Ausschnitte der Antwortzeilen, anonym")
d.summary("Beispiel 3 (Bogen D): Fragen 5 und 13. Das Muster: geändert wurde nur, was online falsch war, angekreuzt "
          "jedes Mal die Antwort, die die Testseite danach als richtig angezeigt hat.")

# ------------------------------------------------------------------- why ---
d.bullets("Warum das nicht geht", [
    ("Mit dem **Abgeben** ist der Test beendet.", 0),
    ("Wer danach auf dem Papier ändert, übernimmt die **angezeigte Lösung**. Das ist keine eigene Leistung.", 0),
    ("Das ist <c2>**unfair**</c2> gegenüber allen, die ihre Antworten so gelassen haben, wie sie waren.", 0),
    ("Ein Test soll zeigen, was **ihr** könnt. Nur dann hilft er euch weiter.", 0),
])
d.summary("Warum das nicht geht: mit dem Abgeben ist der Test beendet; wer danach ändert, übernimmt die angezeigte "
          "Lösung, das ist keine eigene Leistung und unfair gegenüber allen, die nichts geändert haben.")

# ------------------------------------------------------------ what counts ---
d.merksatz("Gewertet wird, was online abgegeben wurde. Änderungen auf dem Papier danach zählen nicht.",
           label="Was jetzt gilt · für alle")
d.summary("Was jetzt gilt: gewertet wird das Online-Ergebnis, Änderungen auf dem Papier nach dem Abgeben zählen nicht. "
          "Das gilt für alle.")

# ---------------------------------------------------------- what changed ---
svg, labels = F.neu()
d.figure("Was wir geändert haben", svg, labels)
d.summary("Geändert: nach dem Abgeben zeigt die Testseite keine Lösungen mehr an. Ein Teil des Fehlers lag bei uns - "
          "die Lösungen hätten nicht sichtbar sein dürfen, solange die Papierbögen noch auf dem Tisch lagen.")

# ---------------------------------------------------------- grade table ---
svg, labels = F.notenspiegel()
d.figure("Notenspiegel: online · Papier · final", svg, labels)
unter(F.notenspiegel_effekt())
quelle(F.notenspiegel_quelle())


def spiegel(counts):
    return ", ".join("Note %d: %d" % (g, k) for g, k in sorted(counts.items())) + \
        ", Schnitt %s, %d Tests" % (F.schnitt(counts)[0], sum(counts.values()))


d.summary("Notenspiegel. Ohne Nachbessern (online, Teil A, ohne Bonus, Stand %s): %s. Mit Nachbessern (Papier, zählt "
          "nicht): %s; %d Noten wären besser gewesen, %d schlechter. Final (online + Bonus): %s."
          % (F.STAND_ONLINE, spiegel(F.ONLINE), spiegel(F.PAPIER), F.BESSER, F.SCHLECHTER,
             spiegel(F.FINAL) if F.FINAL else "folgt " + F.FINAL_FOLGT))

# ------------------------------------------------------- where it paid off ---
svg, labels, pops = F.wirkung()
d.figure("Wo das Nachbessern die Note verändert hätte", svg, labels)
unter("So wäre es gewesen, wenn das Papier gezählt hätte – gewertet wird online.")
end = d.slides[-1].rindex("</section>")              # the ?-boxes sit at the end of their slide (deck.js data-pop)
d.slides[-1] = d.slides[-1][:end] + pops + d.slides[-1][end:]
d.summary("Wo das Nachbessern die Note verändert hätte (zählt nicht, gewertet wird online): "
          + "; ".join("Fall %d%s: online %d Punkte Note %d, Papier %d Punkte Note %d, %s"
                      % (i + 1, " (Bogen %s)" % b if b else "", o, F.note(o), p, F.note(p), was)
                      for i, (b, o, p, was) in enumerate(F.FAELLE))
          + ". Ohne Notenwirkung, aber mehr Punkte: %d Bögen (%s)."
          % (len(F.OHNE_WIRKUNG), ", ".join("%d nach %d" % x for x in F.OHNE_WIRKUNG)))

d.save()
