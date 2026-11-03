/* js/buch-sw/gy11lk.js — Swahili for the widgets of js/buch-gy11lk.js.
 * Loaded by the Swahili editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy11lk', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // verflechtung (H2.2; the product names Zucker, Milch, Zartbitter, Vollmilch are in the sw-4 block above, ME = vizio)
        'Tafeln „Classic“ $e_1$': 'Vipande vya chokoleti “Classic” $e_1$', 'Boxen „Mix“ $e_2$': 'Masanduku “Mix” $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Grafu ya Gozinto: malighafi tatu, bidhaa mbili za kati, bidhaa mbili za mwisho, kwenye mishale viasi vinavyohitajika',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // verflechtung
        ['Zwischenprodukte: $\\vec{z} = B', 'Bidhaa za kati: $\\vec{z} = B'], ['Rohstoffe: $\\vec{r} = A', 'Malighafi: $\\vec{r} = A'],
        ['In einem Schritt: $C = A', 'Kwa hatua moja: $C = A'], ['$ gibt den Rohstoffbedarf je Endprodukt an, und $C', '$ inatoa mahitaji ya malighafi kwa kila bidhaa ya mwisho, na $C'],
    ],
    rule: [
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // verflechtung: the quantities in the graph ">12 ME<" → ">vizio 12<", the sentence with the raw materials
        [/>(\d+) ME</g, '>vizio $1<'],
        [/Für (\d+) Tafeln und (\d+) Boxen braucht man <b>(\d+) ME Kakao, (\d+) ME Zucker und (\d+) ME Milch<\/b>\./g,
            (m, a, b, c, d, e) => 'Kwa vipande ' + a + ' vya chokoleti na masanduku ' + b + ' unahitaji <b>vizio ' + c + ' vya kakao, vizio ' + d + ' vya sukari na vizio ' + e + ' vya maziwa</b>.'],
    ]
});
