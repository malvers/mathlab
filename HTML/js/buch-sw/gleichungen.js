/* js/buch-sw/gleichungen.js — Swahili for the widgets of js/buch-gleichungen.js.
 * Loaded by the Swahili editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Kenyan school notation: the solution set is S (seti ya masuluhisho), division ÷ and multiplication × in the steps of the
 * balance, the surface area A and the curved surface A_P (eneo la pembeni) instead of the German O and M.
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 */
window.BuchSW && BuchSW.add('gleichungen', {
    word: {
        // book sw-1 mathe11-sw:
        // waage, binom, koerper (the input understands ÷ and × as well as : and ·)
        'z. B. −3 oder :4 oder −2x': 'k.m. −3 au ÷4 au −2x', 'Anwenden': 'Tumia', 'Neue Gleichung': 'Mlinganyo mpya',
        'Länge $a$': 'Urefu $a$', 'Länge $b$': 'Urefu $b$', 'Quadrat mit Seitenlänge a + b': 'Mraba wenye upande a + b',
        'Zylinder': 'Silinda', 'Kegel': 'Koni', 'Kugel': 'Tufe', 'Körper': 'Umbo', 'Radius $r$ in cm': 'Nusukipenyo $r$ kwa cm',
        'Höhe $h$ in cm': 'Kimo $h$ kwa cm', 'Skizze des Körpers': 'Mchoro wa umbo',
    },
    phrase: [
        // book sw-1 mathe11-sw:
        // waage
        ['Gelöst: $x = ', 'Imetatuliwa: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Thibitisha: weka thamani hii katika mstari wa kwanza.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Pande zote mbili ni sawa: kila namba ni suluhisho, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Mgongano: hakuna suluhisho, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Andika hatua unayotaka kuifanya kwa pande <b>zote mbili</b>.'],
        ['Das verstehe ich nicht. Beispiele: ', 'Sielewi hilo. Mifano: '], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'Namba inakosekana baada ya alama ya hesabu.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Kuzidisha kwa $x$ au kugawanya kwa $x$ si hatua salama, kwa sababu $x$ inaweza kuwa $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'Hatuwezi kugawanya kwa $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Kuzidisha kwa $0$ kunageuza kila mlinganyo kuwa $0 = 0$, na taarifa yote inapotea.'],
        ['Bring alle $x$ auf eine Seite: ', 'Peleka $x$ zote upande mmoja: '], ['Bring die Zahl auf die andere Seite: ', 'Peleka namba upande mwingine: '],
        ['Teile durch die Zahl vor dem $x$: ', 'Gawanya kwa namba iliyo mbele ya $x$: '],
        // binom, koerper
        ['Der häufigste Fehler: ', 'Kosa linalotokea mara nyingi zaidi: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. Hapo, kwenye mchoro mistatili miwili ya bluu inakosekana, hapa '],
        ['Mantellinie $s = ', 'Urefu wa mshazari $s = '],
    ],
    rule: [
        // sw0: the solution set is S in the Swahili books, also in the widget sentences: $L = \{…\}$, $L = \mathbb{R}$ → $S = …$
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$S = '],
        // book sw-1 mathe11-sw:
        // waage: the steps "| :4" and "| ·2" as Kenyan books write them, "| ÷ 4" and "| × 2"
        [/\\big\|\\; :\s?/g, '\\big|\\; \\div '], [/\\big\|\\; ·\s?/g, '\\big|\\; \\times '],
        // waage: the examples of the help text (a rule: the pieces never see inside <code>)
        [/<code>:4<\/code>/g, '<code>÷4</code>'], [/<code>·2<\/code>/g, '<code>×2</code>'],
        // koerper: surface area A, curved surface A_P (eneo la pembeni)
        [/\$M = (?=2\\pi r h)/g, '$A_P = '], [/\$O = /g, '$A = '],
    ]
});
