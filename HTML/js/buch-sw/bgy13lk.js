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
        // matrixinverse (H2.1; 'Nächster Schritt' is in js/buch-sw/lgs.js, which the same page loads)
        'nicht invertierbar': 'haina kinyume', 'Beispielmatrix': 'Matriki ya mfano', 'Alle Schritte': 'Hatua zote', 'Von vorn': 'Anza upya',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // biquadratisch ("<b>4 Lösungen</b>" is a rule)
        [' liefert $x = \\pm', ' inatoa $x = \\pm'], [' liefert $x = 0$', ' inatoa $x = 0$'], [' liefert nichts, denn $x^2$ ist nie negativ', ' haitoi chochote, kwa sababu $x^2$ si hasi kamwe'],
        ['keine Lösung $z$, die Diskriminante ist negativ', 'hakuna suluhisho $z$, kibainishi ni hasi'],
        ['$ wird mit $z = x^2$ zu $z^2', '$ inakuwa, kwa $z = x^2$, $z^2'], [' = 0$, Diskriminante $\\tfrac{p^2}{4} - q = ', ' = 0$, kibainishi $\\tfrac{p^2}{4} - q = '],
        // matrixinverse: the identity matrix is I in Kenya (German E)
        ['Neben $A$ steht die Einheitsmatrix $E$. Ziel: links $E$ erzeugen, mit denselben Zeilenumformungen wie rechts.',
            'Kando ya $A$ kuna matriki ya utambulisho $I$. Lengo: kuunda $I$ upande wa kushoto, kwa hatua zile zile za safu mlalo kama upande wa kulia.'],
        ['Links lässt sich keine Einheitsmatrix mehr erzeugen: Eine Zeile wird links ganz null, oder in einer Spalte gibt es keine Zahl $\\neq 0$ mehr. <b>$A$ ist nicht invertierbar.</b>',
            'Upande wa kushoto haiwezekani tena kuunda matriki ya utambulisho: safu mlalo moja upande wa kushoto inakuwa sifuri yote, au katika safu wima moja hakuna tena namba $\\neq 0$. <b>$A$ haina kinyume.</b>'],
        ['Links steht $E$, rechts steht $A^{-1}$.', 'Kushoto kuna $I$, kulia kuna $A^{-1}$.'],
        ['. Probe: $A \\cdot A^{-1} = E$, zum Beispiel erste Zeile mal erste Spalte: $', '. Ukaguzi: $A \\cdot A^{-1} = I$, kwa mfano safu mlalo ya kwanza mara safu wima ya kwanza: $'],
        ['Das Gleichungssystem $A \\cdot \\vec{x} = ', 'Mfumo wa milinganyo $A \\cdot \\vec{x} = '], ['$ hat die Lösung $\\vec{x} = A^{-1} \\cdot \\vec{b} = ', '$ una suluhisho $\\vec{x} = A^{-1} \\cdot \\vec{b} = '],
        ['Die dritte Zeile von $A$ ist die Summe der ersten beiden. Dann hat $A \\cdot \\vec{x} = \\vec{b}$ entweder keine oder unendlich viele Lösungen, nie genau eine.',
            'Safu mlalo ya tatu ya $A$ ni jumla ya zile mbili za kwanza. Basi $A \\cdot \\vec{x} = \\vec{b}$ ama haina suluhisho ama ina mengi bila kikomo, kamwe si moja tu.'],
        ['Weiter mit „Nächster Schritt“.', 'Endelea kwa “Hatua inayofuata”.'],
    ],
    rule: [
        // book sw-5 mathe13lk-sw:
        // biquadratisch: "<b>4 Lösungen</b>" → "<b>masuluhisho 4</b>"; the solution set {−2;\ −1;\ 1;\ 2} with commas
        [/<b>(\d) Lösungen<\/b>/g, '<b>masuluhisho $1</b>'],
        [/(x \\in \\\{)([\s\S]*?)(\\\})/g, (m, a, b, c) => a + b.replace(/;\\ /g, ',\\ ') + c],
        // matrixinverse: "Schritt 2 von 6: ", the row swap, the pivot and the zeros of a column (row numbers I, II, III stay)
        [/Schritt (\d+) von (\d+): /g, 'Hatua $1 kati ya $2: '],
        [/Zeilen (I{1,3}) und (I{1,3}) tauschen, damit in Spalte (\d) oben keine Null steht\./g, (m, a, b, c) => 'Badilishana safu mlalo ' + a + ' na ' + b + ', ili juu katika safu wima ' + c + ' kusiwe na sifuri.'],
        [/Zeile (I{1,3}) durch \$([^$]*)\$ teilen: Das Pivotelement wird 1\./g, (m, r, p) => 'Gawanya safu mlalo ' + r + ' kwa $' + p + '$: kipengele egemeo (pivot) kinakuwa 1.'],
        [/In Spalte (\d) Nullen erzeugen: \$/g, (m, c) => 'Unda sifuri katika safu wima ' + c + ': $'],
    ]
});
