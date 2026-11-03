/* js/buch-sw/gy11lk-stoch.js — Swahili for the widgets of js/buch-gy11lk-stoch.js.
 * Loaded by the Swahili editions right after js/buch-gy11lk-stoch.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy11lk-stoch', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // umkehrbaum ("Beispiel", "Darstellung", "Wahrscheinlichkeiten", "krank", "gesund": js/buch-sw.js and stochastik.js)
        'Schnelltest': 'Kipimo cha haraka', 'Spamfilter': 'Kichujio cha barua taka', 'Zwei Maschinen': 'Mashine mbili', 'von 10 000': 'kati ya 10,000',
        'Baumdiagramm: erst A, dann B': 'Mchoro wa mti: kwanza A, kisha B', 'Umgekehrtes Baumdiagramm: erst B, dann A': 'Mchoro wa mti uliogeuzwa: kwanza B, kisha A',
        'Dieses Bild braucht js/buch-stochastik.js.': 'Picha hii inahitaji js/buch-stochastik.js.',
        // galton
        'Nagelreihen $n$': 'Safu za misumari $n$', 'nach rechts mit $p$': 'kulia kwa uwezekano $p$', 'Leeren': 'Ondoa yote',
        'Relative Häufigkeiten der Fächer im Vergleich mit der Binomialverteilung': 'Marudio ya uwiano ya vyumba ikilinganishwa na mgawanyo wa binomia',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // umkehrbaum
        ['Der erste Baum liefert Zähler und Nenner, der umgekehrte Baum zeigt das Ergebnis an seinem oberen Ast hinter $B$.',
            'Mti wa kwanza unatoa kiasi na kiasili, mti uliogeuzwa unaonyesha jibu kwenye tawi lake la juu baada ya $B$.'],
        ['$: Unter der Bedingung $B$ lässt sich nichts ausrechnen.', '$: Kwa sharti $B$ hakuna kinachoweza kuhesabiwa.'],
        // galton
        ['Mittleres Fach $', 'Chumba cha wastani $'], ['$, Erwartungswert $n \\cdot p = ', '$, thamani tarajiwa $n \\cdot p = '],
        ['Lass Kugeln fallen: Jede trifft $n$ Nägel und springt jedes Mal mit $p$ nach rechts.', 'Achia mipira: kila mmoja unagonga misumari $n$ na kila mara unaruka kulia kwa uwezekano $p$.'],
        // the pieces of the sentences that a rule below translates as a whole (so check.mjs sees them translated, too)
        ['kein Spam', 'si barua taka'], ['enthält „Gratis“', 'lina neno “Bure”'], ['ohne „Gratis“', 'bila neno “Bure”'], ['Maschine 1', 'mashine ya 1'], ['Maschine 2', 'mashine ya 2'], ['in Ordnung', 'nzima'],
        ['In Zahlen: Von ', 'Kwa idadi: kati ya '], [' Fällen mit „', ' zenye “'], ['“ sind ', '”, '],
        ['Galtonbrett mit ', 'Ubao wa Galton wenye safu '], [' Nagelreihen', ' za misumari'],
        [' Kugeln. Balken: relative Häufigkeit je Fach, Punkte: $P(X = k)$ für $X \\sim B(', ' mipira. Vipau: marudio ya uwiano kwa kila chumba, nukta: $P(X = k)$ kwa $X \\sim B('],
    ],
    rule: [
        // book sw-4 mathe12lk-sw:
        // umkehrbaum: the legend "$A$: krank, $\overline{A}$: gesund, $B$: positiv, $\overline{B}$: negativ." with the names of the three examples
        [/\$A\$: (.+?), \$\\overline\{A\}\$: (.+?), \$B\$: (.+?), \$\\overline\{B\}\$: (.+?)\.$/, (m, a, na, b, nb) => {
            const T = { 'krank': 'mgonjwa', 'gesund': 'mzima', 'positiv': 'chanya', 'negativ': 'hasi', 'Spam': 'barua taka', 'kein Spam': 'si barua taka',
                'enthält „Gratis“': 'ina neno “Bure”', 'ohne „Gratis“': 'bila neno “Bure”', 'Maschine 1': 'mashine ya 1', 'Maschine 2': 'mashine ya 2',
                'defekt': 'kina kasoro', 'in Ordnung': 'kizima' }, t = s => T[s] || s;
            return '$A$: ' + t(a) + ', $\\overline{A}$: ' + t(na) + ', $B$: ' + t(b) + ', $\\overline{B}$: ' + t(nb) + '.';
        }],
        // umkehrbaum: "In Zahlen: Von 680 Fällen mit „positiv“ sind 190 „krank“." - a Swahili sentence for each of the three examples
        [/In Zahlen: Von (\d[\d,]*) Fällen mit „(.+?)“ sind (\d[\d,]*) „(.+?)“\./g, (m, all, b, hit, a) => {
            const T = { 'positiv': ['watu ' + all + ' wenye kipimo chanya', hit + ' ni wagonjwa'],
                'enthält „Gratis“': ['barua pepe ' + all + ' zenye neno “Bure”', hit + ' ni barua taka'],
                'defekt': ['vipuri ' + all + ' vyenye kasoro', hit + ' vimetoka kwa mashine ya 1'] }[b];
            return T ? 'Kwa idadi: kati ya ' + T[0] + ', ' + T[1] + '.' : 'Kwa idadi: kati ya hali ' + all + ' zenye “' + b + '”, ' + hit + ' ni “' + a + '”.';
        }],
        // galton: the board in the aria label and the count of balls ("safu" and "mpira/mipira" by number)
        [/Galtonbrett mit (\d+) Nagelreihen/g, (m, n) => 'Ubao wa Galton wenye safu ' + n + (n === '1' ? ' ya misumari' : ' za misumari')],
        [/(\d[\d,]*) Kugeln\. Balken: relative Häufigkeit je Fach, Punkte: \$P\(X = k\)\$ für \$/g, (m, k) => (k === '1' ? 'Mpira 1' : 'Mipira ' + k) + '. Vipau: marudio ya uwiano kwa kila chumba, nukta: $P(X = k)$ kwa $'],
        // galton: B(n;\,p) the Kenyan way, B(12, 0.5)
        [/(\\sim B\()(\d+);\\,/g, '$1$2, '],
    ]
});
