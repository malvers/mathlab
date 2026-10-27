/* js/buch-fr/os8.js — French for the widgets of js/buch-os8.js.
 * Loaded by the French editions right after js/buch-os8.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language) - see js/buch-fr/gy5.js.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/os8.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('os8', {
    word: {
        // book fr-19 mathe8-fr:
        // titelbildos8
        'Titelbild: zwei sich schneidende Geraden, ein Kreiszylinder im Schrägbild, eine zentrische Streckung, ein Baumdiagramm und ein Kettenblatt':
            'Couverture : deux droites sécantes, un cylindre de révolution en perspective cavalière, une homothétie, un arbre pondéré et un plateau de pédalier',
        // termwertos8 (the sentences with "Für $x = …$" are rules below)
        'Termpaar': 'Paire d’expressions', 'Einsetzen: $x$': 'Valeur de $x$',
        // flaecheos8 ('Länge $b$' as in js/buch-fr/gleichungen.js, 'Darstellung' as in js/buch-fr/gy7.js: modules this page does not load)
        'Term': 'Expression', 'Darstellung': 'Représentation', 'mit Zahlen': 'avec des nombres', 'mit x': 'avec x',
        'Faktor $a$': 'Facteur $a$', 'Länge $b$': 'Longueur $b$', 'Länge $c$': 'Longueur $c$',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b plus c)': 'Rectangle de hauteur a partagé en deux parties : a fois (b plus c)',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b minus c)': 'Rectangle de hauteur a partagé en deux parties : a fois (b moins c)',
    },
    phrase: [
        // book fr-19 mathe8-fr:
        // termwertos8
        ['In allen Zeilen derselbe Wert. Die Tabelle beweist es nicht, aber eine Umformung zeigt: Die Terme sind <b>gleichwertig</b>.',
            'La même valeur sur toutes les lignes. Le tableau ne le démontre pas, mais une transformation le montre : les expressions sont <b>équivalentes</b>.'],
        // flaecheos8 (the products are \times already: the rule of js/buch-fr/geometrie.js runs before the pieces)
        ['Ausmultiplizieren: ', 'Développer : '], ['Ausklammern, von rechts nach links gelesen: $', 'Factoriser, en lisant de droite à gauche : $'],
        ['Vom ganzen Rechteck $a \\times b$ wird der schraffierte Streifen $a \\times c$ abgezogen.', 'Du rectangle entier $a \\times b$, on retire la bande hachurée $a \\times c$.'],
        ['Das ganze Rechteck ist so groß wie seine beiden Teile zusammen.', 'Le rectangle entier a la même aire que ses deux parties réunies.'],
        [' Jeder Summand in der Klammer wird mit dem Faktor $a$ multipliziert.', ' Chaque terme entre les parenthèses est multiplié par le facteur $a$.'],
    ],
    rule: [
        // book fr-19 mathe8-fr:
        // termwertos8: "Für $x = -2$ ist $3(x + 2) = …$" / "und $…$." on the second line, the verdict and "Dass sie in 3 Zeilen übereinstimmen, reicht nicht."
        [/Für \$x = ([^$]+)\$ ist \$/g, 'Pour $x = $1$ : $'],
        [/(<p style="margin:4px 0 0">)und \$/g, '$1et $'],
        [/Für \$x = ([^$]+)\$ sind die Werte verschieden: Die Terme sind <b>nicht gleichwertig<\/b>\./g, 'Pour $x = $1$, les valeurs sont différentes : les expressions <b>ne sont pas équivalentes</b>.'],
        [/ Dass sie in (\d+) Zeilen? übereinstimmen, reicht nicht\./g, (m, n) => ' Qu’elles coïncident sur ' + n + (n === '1' ? ' ligne' : ' lignes') + ' ne suffit pas.'],
        // flaecheos8: "Probe mit $x = 5$: $3 \times (5 + 2) = 21$ und $3 \times 5 + 6 = 21$."
        [/Probe mit \$x = ([^$]+)\$: (\$[^$]+\$) und (\$[^$]+\$)\./g, 'Vérification avec $x = $1$ : $2 et $3.'],
    ]
});
