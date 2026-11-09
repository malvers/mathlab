/* js/buch-tr/numerik.js — Turkish for the widgets of js/buch-numerik.js.
 * Loaded by the Turkish editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the tr0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('numerik', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs numerik/*)
        // book tr-1 mathe11-tr:
        // bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'İkiye bölme yöntemi', 'Intervall halbieren': 'Aralığı ikiye böl', '5 Schritte': '5 adım',
        'Schritt': 'Adım', 'Mitte $m$': 'Orta nokta $m$', 'Breite': 'Genişlik',
        'x² auf [0; 2]': '[0, 2] aralığında x²', '√x auf [0; 4]': '[0, 4] aralığında √x', 'sin x auf [0; π]': '[0, π] aralığında sin x',
        'Rechtecke links': 'Sol dikdörtgenler', 'Rechtecke Mitte': 'Orta nokta dikdörtgenleri', 'Trapeze': 'Yamuklar', 'Verfahren': 'Yöntem',
        'Anzahl der Streifen $n$': 'Şerit sayısı $n$', 'Flächeninhalt mit Streifen angenähert': 'Şeritlerle yaklaşık hesaplanan alan',
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Dikdörtgende rastgele noktalar, parabolün altındaki isabetler',
        // book tr-3 mathe13-tr:
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs numerik/*)
        // book tr-1 mathe11-tr:
        // bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · başlangıç aralığı $'], ['$ mit $f(', '$; $f('], ['$ und $f(', '$ ve $f('],
        [' · genauer Wert $', ' · kesin değer $'], [' · Fehler $', ' · hata $'],
        ['$ · genauer Wert $', '$ · kesin değer $'], ['$ · Fehler $', '$ · hata $'],
        ['Schätzwert: $A', 'Tahmin: $A'], [' · genau: $', ' · kesin: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Dikdörtgene rastgele noktalar at: '],
        ['. Der Anteil der Treffer unter ', '. '], [' schätzt den Anteil der Fläche.', ' eğrisinin altındaki isabetlerin oranı, alanın oranını tahmin eder.'],
        // book tr-3 mathe13-tr:
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-1 mathe11-tr:
        // flaeche: "Näherung mit $n = 8$: $A \approx …$" → "$n = 8$ ile yaklaşık değer: $A \approx …$"
        [/Näherung mit \$n = (\d+)\$: /g, (m, n) => '$n = ' + n + '$ ile yaklaşık değer: '],
        // the buttons "+1 000 Punkte" (a narrow space as the widget writes it) → "+1.000 nokta" (the Turkish thousands dot)
        [/\+(\d[\d\s\u00a0\u202f]*) Punkte(?=<|$)/g, (m, n) => '+' + n.replace(/[\s\u00a0\u202f]/g, '.') + ' nokta'],
        // mc-flaeche "Von $500$ Punkten liegen $160$ unter der Parabel. Rechteck: …" → "$500$ noktadan $160$ tanesi parabolün altında. Dikdörtgen: …"
        [/Von \$(\d+)\$ Punkten liegen \$(\d+)\$ unter der Parabel\. Rechteck: /g, (m, n, k) => '$' + n + '$ noktadan $' + k + '$ tanesi parabolün altında. Dikdörtgen: '],
        // book tr-3 mathe13-tr:
    ]
});
