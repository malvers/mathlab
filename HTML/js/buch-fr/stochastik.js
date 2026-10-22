/* js/buch-fr/stochastik.js — French for the widgets of js/buch-stochastik.js.
 * Loaded by the French editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the helpers of the module (the strings outside every widget, which every book
 * that loads it meets) and the block comments. Five books are translated at the same time, each has its own comment
 * line in word, phrase and rule - write only right below your book's line, every entry ending with a comma, so the
 * books merge without a conflict. The Italian file js/buch-it/stochastik.js shows which German strings the widgets
 * write.
 */
window.BuchFR && BuchFR.add('stochastik', {
    word: {
        // fr0: the helpers of the module (outside every widget; check.mjs stochastik/*), shared by all five books
        'Baumdiagramm': 'Arbre pondéré',
        'gerade · Vielfaches von 3': 'pair · multiple de 3',
        'Primzahl · größer als 6': 'premier · supérieur à 6',
        'unvereinbar': 'incompatibles',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    },
    phrase: [
        // fr0: the helpers of the module (outside every widget; check.mjs stochastik/*), shared by all five books
        // venn: what the operation says, inside the sentence "$A \cup B$ (…) $= …$"
        ['$A$ oder $B$ (oder beide)', '$A$ ou $B$ (ou les deux)'],
        ['$A$ und $B$', '$A$ et $B$'],
        ['nicht $A$', 'non $A$'],
        ['weder $A$ noch $B$', 'ni $A$ ni $B$'],
        ['nicht $A$ und nicht $B$', 'non $A$ et non $B$'],
        ['nicht beide', 'pas les deux'],
        ['nicht $A$ oder nicht $B$', 'non $A$ ou non $B$'],
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // book fr-5 mathefos12-fr:
    ]
});
