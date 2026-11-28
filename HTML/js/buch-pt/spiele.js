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
        // book pt-15 mathe6-pt:
        // book pt-19 mathe10-pt:
        // spielstreuung (chapter 3, unit 3): the games are the helpers above
        'Spiel': 'Jogo', 'Noch einmal spielen': 'Jogar outra vez', 'Runde': 'Ronda', 'Kontostand in €': 'Saldo em €',
        'Kontostände von acht Spielern über hundert Runden': 'Saldos de oito jogadores ao longo de cem rondas',
        // fairesspiel (chapter 3, unit 2): Pasch = duplo (two equal numbers), Einsatz = aposta, Auszahlung = prémio, Gewinn = ganho, fair = equitativo
        'Einsatz $e$': 'Aposta $e$', 'Auszahlung bei Pasch': 'Prémio com duplo', 'Auszahlung bei Summe 7': 'Prémio com soma 7',
        'Fairen Einsatz einstellen': 'Pôr a aposta equitativa', '1000 Spiele': '1000 jogos',
        'Ergebnis': 'Resultado', 'Pasch': 'Duplo', 'Summe 7': 'Soma 7', 'sonst': 'outros', 'Gewinn $x_i$ in €': 'Ganho $x_i$ em €',
        // book pt-20 mathegy10-pt:
        // spielstreuung, fairesspiel: pt-19's above (merge 27.11.2026, one Portuguese per German string); a Pasch is «duplo», as the older
        // books say «duplo seis» (the GY 10 page says it the same way)
        // book pt-24 pruefung-pt:
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
        // book pt-15 mathe6-pt:
        // book pt-19 mathe10-pt:
        // fairesspiel
        ['Beim Schulfest wirft man zwei Würfel. Ein <b>Pasch</b> (zwei gleiche Augenzahlen) bringt den ersten Preis, die <b>Augensumme 7</b> den zweiten, alles andere nichts. Der Einsatz ist in jedem Fall weg.',
            'Na festa da escola lançam-se dois dados. Um <b>duplo</b> (dois números iguais) dá o primeiro prémio, a <b>soma 7</b> dá o segundo e tudo o resto não dá nada. A aposta perde-se sempre.'],
        ['Das Spiel ist <b>fair</b>.', 'O jogo é <b>equitativo</b>.'],
        ['Für die Spielerin oder den Spieler <b>ungünstig</b>: Die Klasse verdient im Mittel ', '<b>Desfavorável</b> para quem joga: a turma ganha, em média, '],
        ['Für die Spielerin oder den Spieler <b>günstig</b>: Die Klasse verliert im Mittel ', '<b>Favorável</b> para quem joga: a turma perde, em média, '],
        [' € pro Spiel.', ' € por jogo.'], [' Fair wäre der Einsatz $e = \\tfrac{', ' Equitativa seria a aposta $e = \\tfrac{'],
        ['Gespielt: ', 'Jogados: '], [' Spiele, mittlerer Gewinn <b>', ' jogos, ganho médio <b>'], [' €</b> pro Spiel (Erwartungswert ', ' €</b> por jogo (valor médio '],
        ['Lass das Spiel 1000-mal laufen und vergleiche den mittleren Gewinn mit dem Erwartungswert.', 'Faz o jogo correr 1000 vezes e compara o ganho médio com o valor médio.'],
        // spielstreuung
        ['Gewinn $X$ pro Spiel: $', 'Ganho $X$ por jogo: $'], ['$ € mit $', '$ € com probabilidade $'], [' = 0$: Das Spiel ist <b>fair</b>.', ' = 0$: o jogo é <b>equitativo</b>.'],
        ['$ € · gestrichelt: $\\pm\\sigma\\sqrt{n}$, nach 100 Runden $\\pm ', '$ € · a tracejado: $\\pm\\sigma\\sqrt{n}$; ao fim de 100 rondas, $\\pm '],
        ['Kontostände nach 100 Runden: ', 'Saldos ao fim de 100 rondas: '],
        [' €. Gleicher Erwartungswert, aber je größer $\\sigma$, desto weiter liegen Gewinner und Verlierer auseinander: <b>$\\sigma$ misst das Risiko.</b>',
            ' €. O mesmo valor médio, mas quanto maior for $\\sigma$, mais afastados ficam vencedores e vencidos: <b>$\\sigma$ mede o risco.</b>'],
        // book pt-20 mathegy10-pt:
        // spielstreuung: the standard deviation (the rest of spielstreuung and fairesspiel is pt-19's above)
        ['Standardabweichung $\\sigma = \\sqrt{V(X)} \\approx ', 'Desvio padrão $\\sigma = \\sqrt{V(X)} \\approx '],
        // book pt-24 pruefung-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-12 mathegy8-pt:
        // book pt-15 mathe6-pt:
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
        // book pt-24 pruefung-pt:
    ]
});
