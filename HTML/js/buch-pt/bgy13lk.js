/* js/buch-pt/bgy13lk.js — Portuguese for the widgets of js/buch-bgy13lk.js.
 * Loaded by the Portuguese editions right after js/buch-bgy13lk.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('bgy13lk', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs bgy13lk/*)
        // book pt-5 mathe13lk-pt:
        // the cover of the start page (titelbildbgy13lk)
        'Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer':
            'Imagem da capa: trapézios sob uma curva, uma curva de Gauss com a região de rejeição a vermelho, um ciclo ovo, larva, escaravelho',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs bgy13lk/*)
        // book pt-5 mathe13lk-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-5 mathe13lk-pt:
    ]
});
