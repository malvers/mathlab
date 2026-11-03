/* js/buch-sw/bgy13lk.js — Swahili for the widgets of js/buch-bgy13lk.js.
 * Loaded by the Swahili editions right after js/buch-bgy13lk.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('bgy13lk', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // titelbildbgy13lk
        'Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer':
            'Picha ya jalada: trapeza chini ya mkunjo, mkunjo wa kengele wenye eneo jekundu la kukataa, mzunguko wa yai, buu na mende',
        // biquadratisch (7.1)
        'Koeffizient $p$': 'Kigawo $p$', 'Koeffizient $q$': 'Kigawo $q$', 'Keine Lösung': 'Hakuna suluhisho', 'Eine Lösung': 'Suluhisho moja',
        'Die Parabel h(z) = z² + p·z + q mit ihren Nullstellen': 'Parabola h(z) = z² + p·z + q pamoja na sifuri zake',
        'Der Graph von f(x) = x⁴ + p·x² + q mit seinen Nullstellen': 'Grafu ya f(x) = x⁴ + p·x² + q pamoja na sifuri zake',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // biquadratisch ("<b>4 Lösungen</b>" is a rule)
        [' liefert $x = \\pm', ' inatoa $x = \\pm'], [' liefert $x = 0$', ' inatoa $x = 0$'], [' liefert nichts, denn $x^2$ ist nie negativ', ' haitoi chochote, kwa sababu $x^2$ si hasi kamwe'],
        ['keine Lösung $z$, die Diskriminante ist negativ', 'hakuna suluhisho $z$, kibainishi ni hasi'],
        ['$ wird mit $z = x^2$ zu $z^2', '$ inakuwa, kwa $z = x^2$, $z^2'], [' = 0$, Diskriminante $\\tfrac{p^2}{4} - q = ', ' = 0$, kibainishi $\\tfrac{p^2}{4} - q = '],
    ],
    rule: [
        // book sw-5 mathe13lk-sw:
        // biquadratisch: "<b>4 Lösungen</b>" → "<b>masuluhisho 4</b>"; the solution set {−2;\ −1;\ 1;\ 2} with commas
        [/<b>(\d) Lösungen<\/b>/g, '<b>masuluhisho $1</b>'],
        [/(x \\in \\\{)([\s\S]*?)(\\\})/g, (m, a, b, c) => a + b.replace(/;\\ /g, ',\\ ') + c],
    ]
});
