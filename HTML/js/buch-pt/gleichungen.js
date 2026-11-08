/* js/buch-pt/gleichungen.js — Portuguese for the widgets of js/buch-gleichungen.js.
 * Loaded by the Portuguese editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the pt0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('gleichungen', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gleichungen/*)
        // book pt-1 mathe11-pt:
        // waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'p. ex. −3 ou :4 ou −2x', 'Anwenden': 'Aplicar', 'Neue Gleichung': 'Nova equação',
        'Länge $a$': 'Comprimento $a$', 'Länge $b$': 'Comprimento $b$', 'Quadrat mit Seitenlänge a + b': 'Quadrado de lado a + b',
        'Zylinder': 'Cilindro', 'Kegel': 'Cone', 'Kugel': 'Esfera', 'Körper': 'Sólido', 'Radius $r$ in cm': 'Raio $r$ em cm',
        'Höhe $h$ in cm': 'Altura $h$ em cm', 'Skizze des Körpers': 'Esboço do sólido',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gleichungen/*)
        // book pt-1 mathe11-pt:
        // waage
        ['Gelöst: $x = ', 'Resolvida: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Verifica: substitui $x$ por este valor na primeira linha.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Os dois membros são iguais: qualquer número é solução, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Contradição: não há nenhuma solução, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Escreve a operação que queres aplicar aos <b>dois</b> membros.'],
        ['Das verstehe ich nicht. Beispiele: ', 'Não percebo. Exemplos: '], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'Falta um número depois do sinal de operação.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Multiplicar ou dividir por $x$ não é uma operação segura: $x$ pode ser $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'Não se pode dividir por $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Multiplicar por $0$ transforma qualquer equação em $0 = 0$, e perde-se a informação.'],
        ['Bring alle $x$ auf eine Seite: ', 'Passa todos os $x$ para o mesmo membro: '], ['Bring die Zahl auf die andere Seite: ', 'Passa o número para o outro membro: '],
        ['Teile durch die Zahl vor dem $x$: ', 'Divide pelo número que está antes do $x$: '],
        // binom, koerper (the letters of lb2: A_L, A_T, the slant height g - the rules below)
        ['Der häufigste Fehler: ', 'O erro mais frequente: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. Na figura faltam então os dois retângulos azuis, aqui '],
        ['Mantellinie $s = ', 'Geratriz $g = '],
    ],
    rule: [
        // pt0: the solution set is C.S. (conjunto-solução) in Portuguese schools, also in the widget sentences:
        // $L = \{…\}$, $L = \mathbb{R}$ → $\text{C.S.} = …$
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$\\text{C.S.} = '],
        // book pt-1 mathe11-pt:
        // koerper: lateral and total surface A_L, A_T, the slant height g (geratriz), as Portuguese schools and lb2 write them
        [/\$M = 2\\pi r h/g, '$A_L = 2\\pi r h'], [/\$O = /g, '$A_T = '], [/\\pi r s \\approx/g, '\\pi r g \\approx'],
    ]
});
