/* js/buch-pt/gy11lk.js — Portuguese for the widgets of js/buch-gy11lk.js.
 * Loaded by the Portuguese editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package pt2-prep (08.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('gy11lk', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk/*)
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // verflechtung (wp2-2): the chocolate factory; its helpers (GZ, outside the widget) here, as the pt0 part of gy11lk belongs to
        // book pt-4; ME (Mengeneinheiten) = u.q. (unidades de quantidade) by the phrase in bgy13lk.js
        'Kakao': 'Cacau', 'Zucker': 'Açúcar', 'Milch': 'Leite', 'Zartbitter': 'Negro', 'Vollmilch': 'De leite', 'Classic': 'Classic', 'Mix': 'Mix',
        'Tafeln „Classic“ $e_1$': 'Tabletes «Classic» $e_1$', 'Boxen „Mix“ $e_2$': 'Caixas «Mix» $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Gozintograma: três matérias-primas, dois produtos intermédios, dois produtos finais; nas setas, as quantidades necessárias',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk/*)
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // verflechtung
        ['Zwischenprodukte: $\\vec{z} = B \\cdot \\vec{e} = ', 'Produtos intermédios: $\\vec{z} = B \\cdot \\vec{e} = '], ['Rohstoffe: $\\vec{r} = A \\cdot \\vec{z} = ', 'matérias-primas: $\\vec{r} = A \\cdot \\vec{z} = '],
        ['In einem Schritt: $C = A \\cdot B = ', 'Num só passo: $C = A \\cdot B = '],
        ['$ gibt den Rohstoffbedarf je Endprodukt an, und $C \\cdot \\vec{e} = ', '$ dá as necessidades de matérias-primas por produto final, e $C \\cdot \\vec{e} = '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // verflechtung: "Für 10 Tafeln und 5 Boxen braucht man <b>… ME Kakao, … ME Zucker und … ME Milch</b>."
        [/Für (\d+) Tafeln und (\d+) Boxen braucht man <b>(\d+) ME Kakao, (\d+) ME Zucker und (\d+) ME Milch<\/b>\./g,
            'Para $1 tabletes e $2 caixas são precisas <b>$3 u.q. de cacau, $4 u.q. de açúcar e $5 u.q. de leite</b>.'],
    ]
});
