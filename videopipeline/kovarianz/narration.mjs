// Kovarianz — the spoken script. Kept in its own file so the text can be
// re-synthesised (run1) without touching the recording (run2) or the cut (run3).
//
// Follows the guard rails from HTML/drehbuch/kovarianz.html:
//   - never a formula before its picture
//   - one new term per scene
//   - read the numbers out loud when they jump
//   - claim nothing the picture does not show (s11 and s13 exist for that)
// Forbidden without a picture: Erwartungswert, Zufallsvektor, positiv
// semidefinit, Spektralsatz. Earned by the picture: Varianz, Eigenvektor,
// singulär.
//
// Every scene is wrapped in <speak>: lib/tts.mjs only treats a string as SSML
// when it STARTS with <speak>, so a stray tag in a bare string would be read out
// as literal text.
//
// NO <emphasis>: Studio voices reject it with HTTP 400. Stress is carried by a
// short <break> in front of the word instead - which the voice turns into the
// same lift, and which reads as a stage direction in the drehbuch page.
//
// Sigma, Rho and Lambda are spelled out as words - the Studio voice says the
// Greek letter names, which is exactly what a listener needs here.
export const NARRATION = {

    // 30 s — the motivation. Nothing on screen but the cloud.
    s1: '<speak>Das hier sind viertausend Messungen. Irgendetwas gegen irgendetwas — ' +
        'Größe und Gewicht, Temperatur und Druck, such dir etwas aus. ' +
        'Wo diese Wolke liegt, dafür haben wir ein Wort: Mittelwert. ' +
        'Aber sieh sie dir an.<break time="400ms"/> Sie liegt nicht nur irgendwo. ' +
        'Sie hat eine Form. Und für diese Form gibt es auch ein Wort. ' +
        'Es heißt Kovarianz, es klingt nach Formelsammlung, und am Ende sind es vier Zahlen. ' +
        'Vier Zahlen, die eine Ellipse sind.</speak>',

    // 25 s — the zero point. Panel fades in.
    s2: '<speak>Da stehen sie, rechts. Sigma x x und Sigma y y sind fast gleich groß. ' +
        'Sigma x y ist null. Und das Labor schreibt selbst dazu, was das bedeutet: ' +
        'unkorreliert. Genau das heißt rund. ' +
        'Der weiße Kreis und die blaue Ellipse liegen exakt aufeinander, ' +
        'weil noch nichts passiert ist. ' +
        'Das ist unser Nullpunkt. Von hier aus messen wir alles Weitere.</speak>',

    // 30 s — stretch. The squared surprise.
    s3: '<speak>Ich fasse eine einzige Zahl an: die linke obere. Von eins auf zwei. ' +
        'Nur x, nur breiter.<break time="1300ms"/> ' +
        'Und jetzt pass auf, was rechts passiert.<break time="900ms"/> ' +
        'Sigma x x wird nicht doppelt so groß. Es wird ' +
        '<break time="250ms"/>viermal so groß. Sigma y y rührt sich nicht. ' +
        'Doppelte Länge, vierfache Varianz — weil Varianz ein Quadrat ist. ' +
        'Das ist die erste Einsicht, und sie kostet nichts.</speak>',

    // 35 s — tilt. What the off-diagonal actually is.
    s4: '<speak>Jetzt die andere Ecke der Matrix, die Nebendiagonale. ' +
        'Die Wolke legt sich schräg.<break time="1100ms"/> ' +
        'Und Sigma x y, das die ganze Zeit auf null stand, ' +
        'wird lebendig.<break time="400ms"/> ' +
        'Hier steigen die meisten aus: Was soll dieses vierte Ding? ' +
        'Die Antwort ist: Es ist gar kein viertes Ding. ' +
        'Sigma x y<break time="200ms"/> ist die Schräglage. Sonst nichts. ' +
        'Kippt die Wolke nach rechts oben, ist es positiv. Nach links oben, negativ. ' +
        'Steht sie gerade, ist es null.</speak>',

    // 30 s — rho. The same tilt, without units.
    s5: '<speak>Ein Problem hat Sigma x y noch: Es hängt an den Einheiten. ' +
        'Messe ich in Metern statt in Zentimetern, ändert sich die Zahl — ' +
        'obwohl die Wolke genauso aussieht wie vorher. ' +
        'Deshalb steht Rho darunter. Rho ist dieselbe Schräglage, nur sauber normiert: ' +
        'Es liegt immer zwischen minus eins und plus eins. ' +
        'Ich kippe weiter.<break time="900ms"/> Null Komma neun. Und zurück auf null. ' +
        'Merk dir den Fall Rho gleich eins. Darauf kommen wir zurück.</speak>',

    // 40 s — the core scene. Dragging the ellipse shapes A.
    s6: '<speak>Und jetzt der wichtigste Moment. ' +
        'Der weiße Kreis ist die Wolke,<break time="200ms"/> bevor ' +
        'A sie anfasst. Die blaue Ellipse ist ihr Bild danach. ' +
        'Und ich kann diese Ellipse direkt anfassen — ich ziehe an ihr, ' +
        'und die Matrix rechnet sich selbst dazu aus.<break time="2600ms"/> ' +
        'Oben steht, was dabei passiert: Sigma gleich A mal Sigma null mal A transponiert. ' +
        'Das A steht zweimal da, und das ist kein Schönheitsfehler. ' +
        'Varianz ist immer ein Produkt aus zwei Abweichungen. ' +
        'Zweimal Abweichung, also zweimal A.</speak>',

    // 40 s — the principal axes, and the name they carry in the wild.
    s7: '<speak>Ich schalte noch etwas ein. Zwei Achsen erscheinen, ' +
        'eine orange und eine grüne.<break time="900ms"/> Und sieh, wo sie liegen: ' +
        'nicht auf x und nicht auf y. ' +
        'Sie liegen in der Wolke drin, entlang ihrer eigenen Richtungen. ' +
        'Die orange zeigt dorthin, wo die Wolke am weitesten streut. ' +
        'Die grüne steht senkrecht darauf. ' +
        'Diese beiden Richtungen heißen Eigenvektoren, und ihre Längen stehen rechts: ' +
        'Wurzel Lambda eins und Wurzel Lambda zwei.<break time="600ms"/> ' +
        'Wer schon einmal von Hauptkomponentenanalyse gehört hat, von ' +
        '<say-as interpret-as="characters">PCA</say-as>: ' +
        'Das ist sie. Genau das. Mehr ist es nicht.</speak>',

    // 30 s — rotation. The strongest moment of the film.
    s8: '<speak>Und jetzt wird es schön. Ich drehe die Wolke, sonst ändere ich nichts. ' +
        'Sieh dir die Zahlen an:<break time="800ms"/> Sigma x x, Sigma y y und Sigma x y ' +
        'tanzen wild durcheinander. Und zwei Zeilen darunter, ' +
        'Wurzel Lambda eins und Wurzel Lambda zwei: ' +
        '<break time="300ms"/>unbewegt.<break time="600ms"/> ' +
        'Die oberen drei Zahlen hängen davon ab, wie ich mein Lineal halte. ' +
        'Die unteren beiden nicht. ' +
        'Deshalb sind die Eigenwerte die Wahrheit über die Form. ' +
        'Die Einträge sind nur der Blickwinkel.</speak>',

    // 35 s — det A = 0. Now we start breaking things.
    s9: '<speak>Ab hier machen wir etwas kaputt. ' +
        'Ich mache die zweite Zeile der Matrix zu einem Vielfachen der ersten. ' +
        'Die Determinante geht gegen null. Und die Ellipse<break time="500ms"/> stirbt. ' +
        'Sie fällt auf eine Strecke zusammen. Die kleine Achse ist weg, ' +
        'Wurzel Lambda zwei ist null — und Rho ist plus eins, wie angekündigt. ' +
        'Die Wolke hat noch zwei Koordinaten, aber nur noch eine Information. ' +
        'Genau das meint das Wort singulär. ' +
        'In echten Daten heißt derselbe Effekt Kollinearität, und er ist gefürchtet.</speak>',

    // 25 s — translation invariance. Makes the (x minus x bar) visible.
    s10: '<speak>Etwas Beruhigendes zwischendurch. ' +
         'Ich schiebe die ganze Wolke über die Bühne, weit weg vom Ursprung. ' +
         'Und das Panel rechts?<break time="1200ms"/> Steht still. Ziffer für Ziffer. ' +
         'Der Kovarianz ist völlig gleichgültig, wo die Wolke liegt. ' +
         'Sie schaut nur auf die Abweichungen vom Mittelwert. ' +
         'Genau deshalb steht in der Formel x minus x quer.</speak>',

    // 25 s — the honesty scene.
    s11: '<speak>Und jetzt etwas, das meistens verschwiegen wird. ' +
         'Ich tausche die Verteilung aus: Aus der Gauß-Wolke wird eine ' +
         'gleichmäßig gefüllte Fläche. ' +
         'Ein Parallelogramm statt einer Wolke — ein völlig anderes Bild. ' +
         'Und Sigma?<break time="400ms"/> Bleibt fast stehen. ' +
         'Die Kovarianz ist eine Zusammenfassung, kein Foto. ' +
         'Zwei ganz verschiedene Daten können dieselben vier Zahlen haben.</speak>',

    // 25 s — what "linear" means, to the eye.
    s12: '<speak>Ein Wort fehlt noch, und es ist das entscheidende. ' +
         'Ich blende vier Geraden ein und verbiege A, wie ich will.<break time="2000ms"/> ' +
         'Die Geraden bleiben Geraden. Parallelen bleiben parallel. ' +
         'Das — und nichts anderes — heißt linear. ' +
         'Es ist die stille Voraussetzung unter allem, was wir bisher gemacht haben.</speak>',

    // 35 s — where the model stops being true. The most honest scene.
    s13: '<speak>Und deshalb zum Schluss die ehrlichste Szene von allen. ' +
         'Ich verbiege den Raum selbst.<break time="1200ms"/> Die Geraden werden Wellen, ' +
         'die Wolke bekommt eine Beule. ' +
         'Und die Ellipse?<break time="700ms"/> Sie ist immer noch da. ' +
         'Sie ist sogar immer noch die bestmögliche Ellipse. ' +
         'Sie ist trotzdem falsch. ' +
         'Die Kovarianz ist eine lineare Brille. In einer krummen Welt sieht sie ' +
         'zuverlässig das Falsche — nicht weil sie kaputt wäre, ' +
         'sondern weil sie auf jede Frage eine Ellipse antwortet. ' +
         'Und genau dafür gibt es die nichtlinearen Verfahren.</speak>',

    // 20 s — callback to scene 1.
    s14: '<speak>Zurück auf Anfang.<break time="600ms"/> Zufallsmatrix.<break time="900ms"/> ' +
         'Noch eine.<break time="900ms"/> Und noch eine.<break time="900ms"/> ' +
         'Die Ellipse tanzt, die Zahlen fliegen mit.<break time="900ms"/> ' +
         'Vier Zahlen, eine Form. Jetzt nimm sie selbst in die Hand.</speak>'
};

// Target seconds per scene, straight from the plot. run1 compares the
// synthesised durations against these so a drifting scene shows up before
// the recording is made.
export const TARGET = {
    s1: 30, s2: 25, s3: 30, s4: 35, s5: 30, s6: 40, s7: 40,
    s8: 30, s9: 35, s10: 25, s11: 25, s12: 25, s13: 35, s14: 20
};
