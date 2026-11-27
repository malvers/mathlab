/* js/buch-pt/spiele.js — Portuguese for the widgets of js/buch-spiele.js.
 * Loaded by the Portuguese editions right after js/buch-spiele.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-11-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('spiele', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs spiele/*)
        // book pt-12 mathegy8-pt:
        // verteilung (chapter 2.1: two dice; 'Augensumme', 'Zufallsgröße' and the aria label of the bar chart are in js/buch-pt/stochastik.js)
        'Differenz': 'Diferença', 'Maximum': 'Máximo', 'Anzahl Sechsen': 'Número de seis',
        'Die 36 Ergebnisse zweier Würfel mit dem Wert der Zufallsgröße': 'Os 36 resultados de dois dados com o valor da variável aleatória',
        '2. Würfel →': '2.º dado →',
        // the games of spielstreuung (module helpers; GY 10 widget, not on a pt page yet)
        'Münzwette': 'Aposta na moeda', 'Glücksrad': 'Roleta', 'Los': 'Rifa',
        'Einsatz 1 €. Wappen: 2 € zurück, Zahl: nichts.': 'Aposta de 1 €. Face nacional: recebes 2 €, face europeia: nada.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{10}$ gibt es 10 € zurück, sonst nichts.': 'Aposta de 1 €. Com probabilidade $\\tfrac{1}{10}$ recebes 10 €, senão nada.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{100}$ gibt es 100 € zurück, sonst nichts.': 'Aposta de 1 €. Com probabilidade $\\tfrac{1}{100}$ recebes 100 €, senão nada.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs spiele/*)
        // book pt-12 mathegy8-pt:
        // verteilung: "$X$ = die Summe der beiden Augenzahlen. Tippe auf ein Feld oder einen Wert."
        ['die Summe der beiden Augenzahlen', 'a soma das pintas dos dois dados'],
        ['der Abstand der beiden Augenzahlen, die größere minus die kleinere', 'a distância entre os números de pintas dos dois dados, o maior menos o menor'],
        ['die größere der beiden Augenzahlen', 'o maior dos dois números de pintas'], ['wie viele der beiden Würfel eine Sechs zeigen', 'quantos dos dois dados mostram um seis'],
        ['. Tippe auf ein Feld oder einen Wert.', '. Toca numa casa ou num valor.'],
        [' der 36 gleich wahrscheinlichen Ergebnisse gehören dazu. Alle Wahrscheinlichkeiten zusammen ergeben $1$.', ' dos 36 resultados equiprováveis dão este valor. Todas as probabilidades juntas somam $1$.'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-12 mathegy8-pt:
    ]
});
