/* js/buch-sw/bgy12lk.js — Swahili for the widgets of js/buch-bgy12lk.js.
 * Loaded by the Swahili editions right after js/buch-bgy12lk.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('bgy12lk', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // titelbildbgy12lk
        'Titelbild: eine Verteilungsfunktion als Treppe über ihren Stäben, eine Kurve mit der Tangente, die sie im Berührpunkt ersetzt, und eine dreiseitige Pyramide mit ihrem Schwerpunkt':
            'Jalada: fanksheni ya mgawanyo limbikizi kama ngazi juu ya vipau vyake, mkunjo pamoja na tanjenti inayochukua nafasi yake kwenye nukta ya mguso, na piramidi ya pembetatu pamoja na sentroidi yake',
        // verteilungsfunktion ("Drei Münzen", "Würfel", "Glücksrad", "Zufallsgröße": stochastik.js, which lb1-2 loads, too)
        'Gesuchte Wahrscheinlichkeit': 'Uwezekano unaotafutwa',
        'Wahrscheinlichkeitsfunktion als Stabdiagramm': 'Fanksheni ya uwezekano kama mchoro wa vipau',
        'Verteilungsfunktion als Treppenfunktion': 'Fanksheni ya mgawanyo limbikizi kama fanksheni ngazi',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // verteilungsfunktion: "$X$ = <what>. Oben die Wahrscheinlichkeitsfunktion …, unten die Verteilungsfunktion …."
        ['Anzahl Wappen bei drei Münzwürfen', 'idadi ya vichwa katika mirusho mitatu ya sarafu'],
        ['Augenzahl eines Würfels', 'alama inayotokea kwenye dadu'],
        ['Gewinn in € (Auszahlung minus 2 € Einsatz)', 'faida kwa € (malipo toa dau la €2)'],
        ['. Oben die Wahrscheinlichkeitsfunktion', '. Juu: fanksheni ya uwezekano'],
        [', unten die Verteilungsfunktion', ', chini: fanksheni ya mgawanyo limbikizi'],
    ],
    rule: [
        // book sw-4 mathe12lk-sw:
    ]
});
