/* js/buch-sw/integral.js — Swahili for the widgets of js/buch-integral.js.
 * Loaded by the Swahili editions right after js/buch-integral.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw2-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('integral', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-3 mathe13-sw:
        // titelbild13 (the cover of the start page)
        'Titelbild: Glockenkurve über dem Histogramm eines Tests mit Ablehnungsbereich, eine Ebene im Raum mit Normalenvektor und Gerade':
            'Picha ya jalada: mkunjo wa kengele juu ya histogramu ya jaribio lenye eneo la kukataa, bapa katika nafasi lenye vekta ya normali, na mstari',
        // stammfunktion
        'Konstante $C$': 'Konstanti $C$', 'Schar von Stammfunktionen': 'Familia ya fanksheni asili', 'Die Funktion f': 'Fanksheni f',
        'Oben: Stammfunktionen F + C (die gewählte hell). Ziehe den Punkt. Unten: f. Die Steigung von F im Punkt ist genau der Funktionswert f(x₀).':
            'Juu: fanksheni asili F + C (uliyoichagua inang’aa). Buruta nukta. Chini: f. Mwinamo wa F kwenye nukta ni sawa kabisa na thamani ya fanksheni f(x₀).',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-3 mathe13-sw:
        // stammfunktion
        ['$ · Stammfunktionen $F(x) = ', '$ · fanksheni asili $F(x) = '], [' + C$, denn $F\'(x) = f(x)$.', ' + C$, kwa sababu $F\'(x) = f(x)$.'],
        ['Bei $x_0 = ', 'Kwenye $x_0 = '], ['$: Steigung von $F$ $= f(', '$: mwinamo wa $F$ $= f('], ['$, egal welches $C$.', '$, kwa $C$ yoyote ile.'],
    ],
    rule: [
        // book sw-3 mathe13-sw:
    ]
});
