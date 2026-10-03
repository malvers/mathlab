// Vorrechnen - what Solita says in the live tour HTML/tours/vorrechnen.html (Drehbuch HTML/drehbuch/vorrechnen.html).
// Own file so the text can be re-synthesised (run1.mjs) without touching the Drehbuch.
//
// Doc, 03.10.2026: "Da muss die Stimme sofort dabei sein. Wir haben bei Google genug Budget" - no silent first run.
// Stage 1: scenes 1-4 and 6-8; stage 2: 9-13 and 15. Scene 5 (drawing a name) needs a demo class on the device and
// scene 14 (the board in the plan) Doc's login - both emergency brakes in the Drehbuch, open.
//
// SUBTITLES AND SYNC: every <break> ends a subtitle line (js/cyber-tour.js), and tours/vorrechnen.js lands its taps on
// those lines (t.line(k)). Breaks of 400 ms are Solita's breath; the long ones (1200 ms and more) are the room in which
// the tour does something on the stage - their length is that action's, so a change here wants a look at the tour.
//
// WORDS: Studio voices refuse <lang> and ignore <phoneme>, so English is avoided (as in mission-control/narration.mjs):
// no "Buzzer", "Mission Control", "Beamer", "Handy" - "der Knopf", "dein Laptop", "vorne an der Wand", "das Fon".
// To check by ear: "Fon", "QR-Code", "Doktorhut".
// PEOPLE: never "Kind"/"Kinder" - "Schülerinnen und Schüler", "die Klasse", "jemand".
// GUARDRAILS (Drehbuch, section C): say who sees a thing - "die Klasse" / "nur du"; "anonym" is true here (a tap writes
// the code and the time, nothing else); numbers only when the picture shows them.
const b = (ms = 400) => `<break time="${ms}ms"/>`;
const ch = (s) => `<say-as interpret-as="characters">${s}</say-as>`;
const speak = (s) => `<speak>${s}</speak>`;

export const NARRATION = {
    // 1 · the title card: the problem in one picture
    s1: speak(`Vorrechnen an der Tafel. ${b()} Vorne wächst die Rechnung, Zeile für Zeile. ${b()} ` +
        `Und hinten sitzen Schülerinnen und Schüler, die bei der dritten Zeile ausgestiegen sind, ${b(300)} ` +
        `und keiner traut sich, es zu sagen. ${b()} Diese Tour zeigt, wie sie es trotzdem sagen können: ${b(300)} ` +
        `anonym, ${b(300)} mit einem Tipp auf dem Fon.`),

    // 2 · two screens: the class sees the sum, you see the tools and the grey step
    s2: speak(`Zwei Bildschirme. ${b()} Links siehst du, was die Klasse vorne an der Wand sieht: ${b(300)} nur die Aufgabe. ${b()} ` +
        `Rechts ist dein Laptop, ${b(300)} mit allem, was du zum Vorrechnen brauchst: ${b()} die Werkzeuge am Rand, ${b(1200)} ` +
        `und unten, in Grau, schon der nächste Schritt. ${b()} Den siehst nur du. ${b(300)} ` +
        `Ein Spickzettel, den die Klasse nie zu Gesicht bekommt.`),

    // 3 · the code on the board: the QR, the phone scans, one big button
    s3: speak(`Ein Tipp am rechten Rand, ${b(1500)} und vorne erscheint ein ${ch('QR')}-Code. ${b()} ` +
        `Wer ihn mit dem Fon scannt, ${b(2200)} bekommt einen einzigen großen Knopf: ${b(300)} Hab ich nicht verstanden. ${b()} ` +
        `Kein Name, ${b(300)} keine Anmeldung, ${b(300)} keine App. ${b()} Der Code gilt nur heute.`),

    // 4 · the phone up close: the button, the tempo, the text
    s4: speak(`Schauen wir uns das Fon genauer an. ${b(1500)} Oben der Knopf: ${b(300)} Hab ich nicht verstanden. ${b()} ` +
        `Darunter zwei kleinere: ${b(300)} Die Erklärungen sind zu schnell, ${b(300)} oder zu langsam. ${b()} ` +
        `Und ganz unten ein Feld für ein paar eigene Worte. ${b()} Drei Wege zu sagen, wie es läuft, ${b(300)} ` +
        `und keiner verrät, wer es war.`),

    // 6 · warming up: the arrow sends the grey step up, the beamer gets it too
    s6: speak(`Zum Aufwärmen: ${b(300)} eins mal eins. ${b()} Für so etwas reicht ein Tipp auf den Pfeil: ${b(1500)} ` +
        `Der graue Schritt fliegt hoch, ${b(300)} als wäre er geschrieben, ${b()} und vorne landet er genauso. ${b()} ` +
        `Eins plus eins. ${b(2600)} Eins durch eins. ${b(2600)}`),

    // 7 · one divided by zero: the phones press, the count stands behind the task, here and in front
    s7: speak(`Und jetzt: ${b(300)} eins durch null. ${b(1500)} Unten links tippt jemand auf den Knopf. ${b(1500)} ` +
        `Kurz grün: ${b(300)} angekommen. ${b()} Und noch jemand, ${b(300)} und noch jemand. ${b(1500)} ` +
        `Rechts, hinter der Aufgabe, steht jetzt eine Zahl, ${b(300)} und vorne auch. ${b()} ` +
        `Du siehst sofort, wo es hakt: ${b(300)} an dieser Aufgabe. ${b(300)} Nicht, bei wem.`),

    // 8 · explaining again: the mortarboard, the box pushed over the line, "verstanden", the count goes down
    s8: speak(`Also nochmal erklären. ${b()} Der Doktorhut holt die Erklärung zu dieser Aufgabe, ${b(1500)} ` +
        `erst einmal nur für dich. ${b()} Zieh sie über die Linie, ${b(2000)} dann steht sie auch vorne. ${b()} ` +
        `Der Knopf auf dem Fon ist inzwischen rot: ${b(300)} Drücken, wenn verstanden. ${b(1500)} ` +
        `Und die Zahl geht wieder runter. ${b(1500)} Wenn sie runtergeht, ${b(300)} war die Erklärung hilfreich.`),

    // 9 · the rectangle: the task panel, then five steps sent up by the arrow
    s9: speak(`Jetzt eine echte Aufgabe. ${b()} Unter Aufgaben liegen alle Blöcke des Schuljahres, ${b(300)} ` +
        `geordnet bis zu den nächsten Ferien. ${b(2600)} Ein Rechteck mit Umfang zwanzig und Fläche einundzwanzig. ${b()} ` +
        `Die Gleichung steht schon da. ${b(1200)} Ausmultiplizieren, ${b(1400)} umstellen, ${b(1400)} die ${ch('pq')}-Formel, ${b(1400)} ` +
        `Wurzel ziehen, ${b(1400)} und die beiden Seiten sind sieben und drei. ${b()} ` +
        `Die Gleichheitszeichen stehen untereinander, ${b(300)} und rechts daneben, in Grau, die nächste Umformung.`),

    // 10 · too fast: the runner counts, a comment comes - only on the laptop
    s10: speak(`Bei der ${ch('pq')}-Formel war es manchen zu schnell. ${b(1500)} Auf deinem Laptop färbt sich der Läufer ${b(300)} ` +
        `und zählt mit. ${b()} Daneben die Sprechblase: ${b(300)} Ein Kommentar ist gekommen. ${b(1500)} Ein Tipp, ${b(1500)} ` +
        `und da steht er: ${b(300)} Woher kommt die Fünf? ${b()} Das alles siehst nur du. ${b(300)} ` +
        `Vorne an der Wand ist davon nichts zu sehen.`),

    // 11 · by hand: Doc's own strokes (recorded on the HP, tours/vorrechnen-handschrift.json), the flight, two presses.
    // The long break is the writing of the first line (about 8 s at the tour's pace).
    s11: speak(`Und jetzt mit der Hand. ${b()} Zwei hoch zehn mal fünf hoch zehn, durch zehn hoch neun, ${b(300)} ` +
        `ohne Taschenrechner. ${b()} Das ist eine echte Handschrift, ${b(300)} aufgenommen mit dem Stift. ${b(8600)} ` +
        `Ein Wisch nach oben, ${b(900)} und die Tinte fliegt hoch, ${b(300)} wird blau ${b(300)} ` +
        `und verwandelt sich im Flug in eine saubere Formel. ${b()} Vorne fliegt sie genauso. ${b(1200)} ` +
        `Und bei dieser Zeile drücken zwei.`),

    // 12 · ask Solita: she sits at the board herself, so she speaks of herself. Her answer is word for word the one the
    // tour shows in her box (tours/vorrechnen.js: ANTWORT) - the box stays silent, this voice reads it.
    // The long breaks at the end are lines two and three in Doc's hand.
    s12: speak(`Für genau so etwas sitze ich unten links an der Tafel. ${b(1500)} Jemand fragt: ${b(300)} ` +
        `Warum darf ich zwei hoch zehn mal fünf hoch zehn zusammenfassen? ${b(1800)} Und ich antworte, ${b(300)} für alle sichtbar. ${b(1200)} ` +
        `Weil beide Potenzen denselben Exponenten haben: die Zehn. ${b()} ` +
        `Zehn Zweien mal zehn Fünfen kannst du zu zehn Paaren ordnen, ${b(300)} jedes Paar zwei mal fünf, ${b(300)} also zehn. ${b()} ` +
        `Allgemein gilt: ${b(300)} ${ch('a')} hoch ${ch('n')} mal ${ch('b')} hoch ${ch('n')} ist ${ch('a')} mal ${ch('b')}, hoch ${ch('n')}. ${b()} ` +
        `Mit verschiedenen Exponenten ginge das nicht. ${b()} Ich kenne die Aufgabe, die Zeilen an der Tafel und die Lösung. ${b(1500)} ` +
        `Die Zahl geht auf null, ${b(300)} und es geht weiter. ${b(6200)} Zehn hoch zehn durch zehn hoch neun ${b(2400)} ist zehn.`),

    // 13 · the review: the tab Wiederholung, the hardest on top, the cross takes one off
    s13: speak(`Was heute nicht verstanden wurde, ${b(300)} geht nicht verloren. ${b()} Unter Aufgaben gibt es den Reiter Wiederholung: ${b(1800)} ` +
        `alle Aufgaben, bei denen jemand gedrückt hat, ${b(300)} geordnet danach, wie gut sie am Ende verstanden waren. ${b(1200)} ` +
        `Was erledigt ist, nimmt das Kreuz von der Liste. ${b(1500)} Den Rest übst du in einer der nächsten Stunden.`),

    // 15 · the end card
    s15: speak(`Kein Name, ${b(300)} nur ein Code. ${b()} Die Klasse sagt, wo es hakt, ${b(300)} und niemand muss sich dafür melden. ${b()} ` +
        `Vorrechnen, ${b(300)} im Doc Alvers Mathe-Labor, ${b(300)} auf doc alvers punkt ${ch('de')}.`),
};
