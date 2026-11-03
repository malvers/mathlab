/* js/buch-sw/gy11lk-vek.js — Swahili for the widgets of js/buch-gy11lk-vek.js.
 * Loaded by the Swahili editions right after js/buch-gy11lk-vek.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy11lk-vek', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // ebenenlage (H1.2): the presets 'schneidend', 'parallel', 'identisch' are in js/buch-sw/vektoren.js
        'Dach': 'Paa', 'Spurgerade': 'Mstari wa kukata', 'Zwei Ebenen im Raum und ihre Schnittgerade': 'Mabapa mawili katika nafasi na mstari wao wa makutano',
        'Mindestens ein Koeffizient von $x$, $y$, $z$ muss ungleich null sein, sonst ist es keine Ebene.': 'Angalau kigawo kimoja cha $x$, $y$, $z$ lazima kisiwe sifuri, vinginevyo si bapa.',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // eqRow: the aria-labels of the coefficient inputs "E₁, Koeffizient von x", "E₁, rechte Seite"
        ['Koeffizient von ', 'kigawo cha '], ['rechte Seite', 'upande wa kulia'],
        // book sw-5 mathe13lk-sw:
        // ebenenlage ("übrig bleibt für $x$ und $y$" is a rule)
        ['Die linke Seite von $E_2$ ist das ', 'Upande wa kushoto wa $E_2$ ni mara '], ['-Fache der linken Seite von $E_1$. Rechts: $', ' ya upande wa kushoto wa $E_1$. Kulia: $'],
        ['Beide Gleichungen sind gleichwertig: <b>identisch</b>.', 'Milinganyo yote miwili ni sawa: mabapa <b>yanaambatana</b>.'],
        ['Das System hat keine Lösung: <b>parallel</b> und verschieden.', 'Mfumo hauna suluhisho: mabapa ni <b>sambamba</b> na tofauti.'],
        ['Die linken Seiten sind keine Vielfachen: Die Ebenen <b>schneiden</b> sich in einer Geraden. Freie Variable $', 'Pande za kushoto si vigawe: mabapa <b>yanakatana</b> kwenye mstari. Kigeu huru $'],
        ['Gelöst: $', 'Suluhisho: $'], ['Schnittgerade: <b>$g', 'Mstari wa makutano: <b>$g'], ['. Ganzzahliger Richtungsvektor: $', '. Vekta ya mwelekeo yenye namba kamili: $'],
    ],
    rule: [
        // book sw-5 mathe13lk-sw:
        // ebenenlage: "$, übrig bleibt für $x$ und $y$: " → "$, kwa $x$ na $y$ inabaki: "
        [/\$, übrig bleibt für \$([xyz])\$ und \$([xyz])\$: /g, (m, a, b) => '$, kwa $' + a + '$ na $' + b + '$ inabaki: '],
    ]
});
