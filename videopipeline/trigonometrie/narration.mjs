// Trigonometrie — what Solita says in the live tour HTML/tours/trigonometrie.html. Own file so the text can be
// re-synthesised (run1.mjs) without touching the Drehbuch.
//
// Doc, 26.09.2026: "überleg dir eine coole Tour, mach Sound dazu, mit Solitas Stimme ... gegebenenfalls auch mit
// meiner Stimme, wechselbar, aber erstmal so". One scene per chapter of the lab (HTML/trigonometrie.html), plus an
// opening and a close: the way from the right triangle to the wave, every chapter showing the one thing it is for.
//
// SUBTITLES AND SYNC: every <break> ends a subtitle line (js/cyber-tour.js), and the Drehbuch lands its taps and drags
// on those lines (t.line(k)). The short breaks (400 ms) are Solita's breath between sentences - Doc 16./17.09.: slow,
// with pauses. The long ones are the room in which the tour does something on the stage; their length is the length
// of that action, so a change here wants a look at tours/trigonometrie.js.
//
// PRONUNCIATION: single letters go through say-as (the corner B, the point P, the parameters a to d), numbers are
// written as words. No "Lab" (Studio-C says "Laab") - the page is "das Labor". "Kathete" is spelled "Katehte": Studio-C
// said "Kathäte" (Doc, 26.09.2026, tour s1 0:20), and of three spellings (Katéte, Kateete, Katehte) Doc picked the
// third by ear. tours/trigonometrie.js writes it back for the subtitles (spelled).
//
// CHECKED AGAINST THE LAB (26.09.2026): B (4|3) -> (8|6) keeps sin 0.6, cos 0.8; 1 rad = 57.3°; sin x = 1/2 at 30° and
// 150°; cos x = sin(x + 90°); the puzzle 1.5·sin(x − π/2) − 1 is hit with a = 1.5, c = π/2, d = −1; Dresden: longest
// day 21.06. (day 172), shortest 21.12. (day 355); SSW α = 30°, b = 6: two triangles for 3 < a < 6, one at a = 3.
const b = (ms = 400) => `<break time="${ms}ms"/>`;
const ch = (s) => `<say-as interpret-as="characters">${s}</say-as>`;
const speak = (s) => `<speak>${s}</speak>`;

export const NARRATION = {
    // title card, then the lab on chapter 1
    s0: speak(`Sinus, Kosinus, Tangens. ${b()} In der neunten Klasse beginnen sie in einem rechtwinkligen Dreieck, ${b()} ` +
        `am Ende beschreiben sie Wellen. ${b()} Diese Tour geht den ganzen Weg, ${b(300)} in elf Kapiteln.`),

    // 1 · the ratios stay when the triangle grows; hypotenuse 1 = the bridge to the circle
    s1: speak(`Ein rechtwinkliges Dreieck. ${b()} Oben links rechnet das Labor mit: ${b()} ` +
        `Gegenkatehte durch Hypotenuse ist der Sinus, ${b()} Ankatehte durch Hypotenuse der Kosinus. ${b()} ` +
        `Zieh die Ecke ${ch('B')} nach außen. ${b(1600)} Das Dreieck wird größer, ${b()} die Verhältnisse bleiben gleich. ${b()} ` +
        `Ist die Hypotenuse genau eins lang, ${b(1200)} sind Sinus und Kosinus einfach die beiden Katehten.`),

    // 2 · P(cos | sin), past 90°: the signs in the quadrants
    s2: speak(`Die Spitze liegt jetzt auf dem Einheitskreis. ${b()} Der Punkt ${ch('P')} hat die Koordinaten Kosinus und Sinus: ${b()} ` +
        `Kosinus nach rechts, Sinus nach oben. ${b()} Und jetzt darf der Winkel größer werden als neunzig Grad. ${b(1500)} ` +
        `Im zweiten Quadranten wird der Kosinus negativ, ${b(1500)} im dritten auch der Sinus.`),

    // 3 · the angle as a length: one radian, 2π all round
    s3: speak(`Einen Winkel kann man auch als Länge messen: ${b()} als grünen Bogen auf dem Einheitskreis. ${b()} ` +
        `Ist der Bogen genau so lang wie der Radius, ${b(1200)} gehört er zum Winkel eins, ${b()} knapp siebenundfünfzig Grad. ${b()} ` +
        `Gut sechs solche Stücke passen um den Kreis herum, ${b(2400)} genau zwei Pi.`),

    // 4 · the highlight: P once round, the arc rolled onto the x-axis, the height above it = the sine curve
    s4: speak(`Jetzt wird aus dem Kreis eine Funktion. ${b()} Den Bogen legen wir auf die x-Achse, ${b()} ` +
        `darüber tragen wir die Höhe von ${ch('P')} ab. ${b()} Einmal ganz herum. ${b(5600)} Das ist die Sinuskurve. ${b()} ` +
        `Nach zwei Pi beginnt alles von vorn: ${b(1400)} Die zweite Welle ist eine genaue Kopie der ersten.`),

    // 5 · cosine = the sine shifted by 90° to the left
    s5: speak(`Die blaue Kurve ist der Kosinus: ${b()} die x-Koordinate von ${ch('P')}, genauso abgetragen. ${b()} ` +
        `Sie sieht aus wie der Sinus, nur verschoben. ${b()} Schieben wir den Sinus um neunzig Grad nach links, ${b(2400)} ` +
        `liegen beide Kurven genau aufeinander.`),

    // 6 · sin x = 1/2: two solutions, the calculator knows one; above 1 none
    s6: speak(`Für welche Winkel ist der Sinus genau ein Halb? ${b()} Die waagerechte Linie schneidet den Kreis zweimal: ${b()} ` +
        `bei dreißig Grad ${b()} und bei hundertfünfzig Grad. ${b()} Der Taschenrechner nennt nur die erste Lösung, ${b()} ` +
        `die zweite findest du über die Symmetrie. ${b()} Liegt die Linie höher als eins, ${b(2200)} gibt es gar keine Lösung.`),

    // 7 · a, b, c, d one after the other, then the puzzle - solved on the stage
    s7: speak(`Mit vier Parametern formst du jede Sinuswelle. ${b()} ${ch('a')} streckt sie in die Höhe, ${b(1000)} ` +
        `${ch('b')} staucht sie zusammen, ${b(1000)} ${ch('c')} schiebt sie zur Seite, ${b(1000)} ${ch('d')} hebt sie an. ${b()} ` +
        `Jetzt ein Rätsel: ${b()} Bring die grüne Kurve auf die gestrichelte. ${b(3600)} Treffer!`),

    // 8 · day length in Dresden: high point to 21 June, low point to 21 December
    s8: speak(`Jetzt echte Daten: ${b()} die Tageslänge in Dresden, für jeden Monat berechnet. ${b()} ` +
        `Zieh den Hochpunkt auf den Sommeranfang, ${b(1600)} den Tiefpunkt auf den Winteranfang. ${b(1600)} ` +
        `Schon passt ein Sinus fast genau. ${b()} Amplitude, Periode und Mittellage stehen oben links.`),

    // 9 · tangent: T runs away as P nears 90°, at 90° there is none
    s9: speak(`Beim Tangens trifft der Strahl durch ${ch('P')} die senkrechte Tangente, ${b()} im Punkt ${ch('T')}. ${b()} ` +
        `Je näher ${ch('P')} an neunzig Grad kommt, ${b(2400)} desto weiter läuft ${ch('T')} nach oben davon. ${b()} ` +
        `Bei genau neunzig Grad trifft der Strahl nie, ${b()} der Tangens hat dort eine Polstelle.`),

    // 10 · law of sines and cosines, and the one case with two triangles (SSW)
    s10: speak(`Für beliebige Dreiecke gibt es Sinussatz und Kosinussatz. ${b()} Ein Fall ist knifflig: ${b()} ` +
        `zwei Seiten und ein Winkel, der nicht zwischen ihnen liegt. ${b(1800)} Der Kreis um ${ch('C')} trifft den Strahl zweimal, ${b()} ` +
        `also passen zwei verschiedene Dreiecke. ${b()} Wird ${ch('a')} kürzer, ${b(1600)} bleibt nur noch eins, ${b(1400)} und dann keins mehr.`),

    // 11 · outlook: the slopes of the sine curve trace the cosine - and the close: theory and exercises in every chapter
    // (one scene, so the tour's numbers are the lab's chapter numbers: 00 opening, 01 to 11)
    s11: speak(`Zum Schluss ein Blick in die Oberstufe. ${b()} Fahr die Sinuskurve entlang ${b()} ` +
        `und trag an jeder Stelle ihre Steigung ab. ${b(5200)} Die blauen Punkte ergeben ${b(700)} den Kosinus. ${b(1200)} ` +
        `Elf Kapitel, vom Dreieck bis zur Ableitung. ${b()} Rechts steht zu jedem Kapitel die Theorie, ${b()} ` +
        `darunter Aufgaben mit Lösungen. ${b()} Den Rest entdeckst du selbst.`),
};
