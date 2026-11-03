// Ein Lehrbuch für 49 Cent — what Solita says in the live tour HTML/tours/mathe11-lehrbuch.html. Own file so the text can
// be re-synthesised (run1.mjs) without touching the Drehbuch.
//
// Doc, 03.11.2026, after the deck decks/mathe11-lehrbuch.html: "bauen wir daraus eine Tour", then at the Würfelspiel tour:
// "So möchte ich das gerne haben" - a walk through the real book (HTML/buch/mathe11/), not the slides. The scene plan Doc
// approved ("passt gut!"): opening, contents, a chapter, a widget, a task, a self-test, the excursion, the labs, five
// languages, the print edition, the close.
//
// SUBTITLES AND SYNC: every <break> ends a subtitle line (js/cyber-tour.js), and the Drehbuch lands its taps, slides and
// page loads on those lines (t.line(k)). The short breaks are Solita's breath; the long ones are the room in which the
// tour does something on the stage, so a change here wants a look at tours/mathe11-lehrbuch.js.
//
// PRONUNCIATION: no "Lab" (Studio-C says "Laab") - "Labor"; letters through say-as; numbers as words; docalvers.de is
// spelled the way the deck says it (tools/pptx/deck_audio.mjs) and written back for the subtitles (spelled in the
// Drehbuch). "interaktiv" stays out until Doc has picked its spelling by ear (03.11.2026, Nachhör-Seite).
//
// CHECKED AGAINST THE BOOK (03.11.2026): 11 chapters, Wahrscheinlichkeit is chapter 1 and comes in April; 3.3 has
// Erkundungen, three Lerneinheiten, Üben (WVV), the excursion Galileis Fallrinne, Rückblick, Test; the check-in asks
// (−4)², "-16" gives "noch nicht", "16" gives "richtig"; 179 tasks, 192 self-tests, 24 widgets, 23 labs, 1.682 practice
// tasks online (the Making-of box on the title page); 183 print pages; editions de, en, es, it, fr.
const b = (ms = 400) => `<break time="${ms}ms"/>`;
const ch = (s) => `<say-as interpret-as="characters">${s}</say-as>`;
const speak = (s) => `<speak>${s}</speak>`;

export const NARRATION = {
    // the title page: cover, the Making-of box
    s0: speak(`Ein ganzes Lehrbuch Mathematik ${b()} für die elfte Klasse am Beruflichen Gymnasium. ${b()} ` +
        `Entstanden in knapp anderthalb Stunden, ${b()} für neunundvierzig Cent. ${b()} Wie das ging, ${b(300)} ` +
        `erzählt die Präsentation hier oben. ${b()} Ich zeige euch, was drinsteckt.`),

    // the contents: eleven chapters in the order of the curriculum, the odd one out, then 3.3 opens
    s1: speak(`Elf Kapitel, ${b()} in der Reihenfolge des Lehrplans. ${b()} Rechts steht, in welchem Monat ein Kapitel dran ist. ${b()} ` +
        `Eines fällt aus der Reihe: ${b(1600)} Die Wahrscheinlichkeit trägt die Nummer eins, ${b()} ` +
        `kommt im Schuljahr aber erst im April. ${b()} Ich öffne mal die quadratischen Funktionen.`),

    // a chapter: the opening, the way through it on the left, a Merke box and the worked examples
    s2: speak(`Jedes Kapitel beginnt mit einem Auftakt: ${b()} Wo stecken Parabeln im Alltag? ${b()} ` +
        `Links steht der Weg durch das Kapitel: ${b()} Erkundungen zum Einstieg, ${b(300)} drei Lerneinheiten, ${b(300)} Üben, ${b(300)} ` +
        `eine Exkursion, ${b(300)} Rückblick und Test. ${b()} In jeder Lerneinheit fasst ein Merke-Kasten das Wichtigste zusammen. ${b(1800)} ` +
        `Danach kommen durchgerechnete Beispiele.`),

    // a widget: the Parabel-Werkstatt - the stretch factor 0,5 -> 2,5, the vertex up to (0 | 2), then a = -1,5. The vertex
    // goes up first: from its default (1 | -2) the opened-down parabola fell out of the picture (Doc, 03.11.2026, tour 03 · 0:16:
    // "das kann man jetzt gar nicht sehen")
    s3: speak(`Und mittendrin: ${b(300)} Widgets zum Ausprobieren. ${b()} Das hier ist die Parabel-Werkstatt. ${b()} ` +
        `Ich ziehe mal am Streckfaktor. ${b(2200)} Die Parabel wird schmaler. ${b()} ` +
        `Mit den beiden anderen Reglern schiebe ich den Scheitel nach oben. ${b(2400)} Und jetzt ein negativer Streckfaktor: ${b(2200)} ` +
        `Die Parabel klappt nach unten. ${b()} Vierundzwanzig solche Widgets stecken im Buch.`),

    // a task: three levels, the tip, then the solution
    s4: speak(`Dann die Aufgaben, ${b()} hundertneunundsiebzig im ganzen Buch, ${b(300)} in drei Stufen. ${b()} ` +
        `Wer nicht weiterkommt, ${b(300)} holt sich erst einen Tipp. ${b(2000)} Und wer seine Rechnung prüfen will, ${b(300)} ` +
        `schaut in die Lösung.`),

    // a self-test: the check-in, a wrong answer, the right one
    s5: speak(`Noch schneller geht es mit den Selbsttests. ${b()} Gleich am Anfang fragt das Kapitel: ${b(300)} ` +
        `Was ist minus vier, in Klammern, zum Quadrat? ${b()} Tippe ich minus sechzehn, ${b(2600)} sagt das Buch sofort: noch nicht. ${b()} ` +
        `Mit sechzehn ${b(2400)} stimmt es. ${b()} Hundertzweiundneunzig solche Fragen hat das Buch, ${b(300)} ` +
        `und es merkt sich, was ihr schon gelöst habt.`),

    // the excursion: Galilei's inclined plane
    s6: speak(`Jedes Kapitel macht auch einen Ausflug, ${b(300)} eine Exkursion. ${b()} Hier ist es Galileis Fallrinne. ${b()} ` +
        `Der freie Fall war zu schnell für die Uhren seiner Zeit. ${b()} Also ließ Galilei Kugeln eine schräge Rinne hinunterrollen ${b(300)} ` +
        `und maß die Zeit mit Wasser. ${b()} Die Wege wachsen wie eins, drei, fünf, sieben, ${b()} ` +
        `zusammen ergeben sie Quadratzahlen: ${b(300)} wieder eine Parabel.`),

    // the labs: the Parabellabor card, the lab itself, the parabola moved
    s7: speak(`Das Buch ist mit dem Mathe-Labor verbunden. ${b()} Dreiundzwanzig Labore sind verlinkt, ${b(300)} hier das Parabellabor. ${b(1800)} ` +
        `Ein Klick, ${b(300)} und es läuft. ${b()} Ich verschiebe mal die Parabel. ${b(2600)} ` +
        `Dazu kommen über sechzehnhundert Übungsaufgaben online, ${b(300)} genug für das ganze Schuljahr.`),

    // five languages: the same chapter in en, es, it, fr
    s8: speak(`Und das ganze Buch gibt es in fünf Sprachen. ${b()} Dasselbe Kapitel auf Englisch, ${b(3000)} auf Spanisch, ${b(3000)} ` +
        `auf Italienisch ${b(3000)} und auf Französisch. ${b(2600)} Mit allen Widgets, Aufgaben und Selbsttests.`),

    // the print edition: the PDF button, all pages at a glance
    s9: speak(`Wer lieber auf Papier arbeitet: ${b()} Das Buch gibt es auch als ${ch('PDF')} zum Drucken. ${b()} ` +
        `Hundertdreiundachtzig Seiten, ${b(300)} hier alle auf einen Blick. ${b(2600)} ` +
        `Die ${ch('QR')}-Codes auf den Seiten führen direkt zurück ins Online-Buch.`),

    // the close: free, no login, no ads, no tracking - and the address
    s10: speak(`Das Buch ist kostenlos, ${b(300)} wie alle Bücher und Labore im Mathe-Labor: ${b()} ohne Anmeldung, ${b(300)} ` +
        `ohne Werbung ${b(300)} und ohne Tracking. ${b()} ` +
        `Ihr findet es auf Dock Alvers Punkt D E, Schrägstrich Buch, Schrägstrich Mathe elf. ${b()} Viel Spaß beim Ausprobieren!`),
};
