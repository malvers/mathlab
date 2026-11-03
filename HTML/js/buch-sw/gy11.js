/* js/buch-sw/gy11.js — Swahili for the widgets of js/buch-gy11.js.
 * Loaded by the Swahili editions right after js/buch-gy11.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy11', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // kettenregel ("−0,5x" with the Kenyan decimal point)
        'Äußere Funktion u(z)': 'Fanksheni ya nje u(z)', 'Innere Funktion v(x)': 'Fanksheni ya ndani v(x)', '−0,5x': '−0.5x',
        'Verkettete Funktion mit Tangente an einem verschiebbaren Punkt': 'Fanksheni changamano pamoja na tanjenti kwenye nukta inayoweza kusogezwa',
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // kettenregel (the number rule of js/buch-sw.js has already made 0{,}0001 into 0.0001)
        ['$ &nbsp;·&nbsp; außen $u(z) = ', '$ &nbsp;·&nbsp; ya nje $u(z) = '], ['$, innen $v(x) = ', '$, ya ndani $v(x) = '],
        ['An der Stelle $x_0 = ', 'Kwenye nukta $x_0 = '], ['$ ist $v(x_0) = ', '$, $v(x_0) = '],
        ['$: Dort ist $f$ nicht definiert oder nicht differenzierbar. Zieh den Punkt weiter.', '$: Hapo $f$ haijafafanuliwa au hainyambuliki. Buruta nukta mbali zaidi.'],
        ['$, also $f\'(x_0) \\approx ', '$, kwa hiyo $f\'(x_0) \\approx '],
        ['$. Kontrolle mit dem Differenzenquotienten ($h = 0.0001$): $', '$. Ukaguzi kwa uwiano wa tofauti ($h = 0.0001$): $'],
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
    ],
    rule: [
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
    ]
});
