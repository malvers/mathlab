/* js/buch-pt/stochastik.js — Portuguese for the widgets of js/buch-stochastik.js.
 * Loaded by the Portuguese editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the pt0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('stochastik', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        'Baumdiagramm': 'Diagrama em árvore',
        'gerade · Vielfaches von 3': 'par · múltiplo de 3',
        'Primzahl · größer als 6': 'primo · maior do que 6',
        'unvereinbar': 'incompatíveis',
        // book pt-1 mathe11-pt:
        // baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen (the letters of lb1: V/A vermelho/azul, D/S doente/saudável,
        // N/E face nacional/face europeia - the rules below)
        'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Diagrama em árvore: duas bolas sem reposição',
        'Rot': 'Vermelha', 'eine rote Kugel weniger': 'menos uma bola vermelha', 'eine rote Kugel mehr': 'mais uma bola vermelha',
        'eine blaue Kugel weniger': 'menos uma bola azul', 'eine blaue Kugel mehr': 'mais uma bola azul',
        'Anzahl der Züge': 'Número de extrações', '2 Züge': '2 extrações', '3 Züge': '3 extrações', 'Ziehen': 'Extração',
        'ohne Zurücklegen': 'sem reposição', 'mit Zurücklegen': 'com reposição', 'Urne:': 'Urna:',
        'Ereignis wählen:': 'Escolhe um acontecimento:', 'Ereignis': 'Acontecimento', 'Baumdiagramm der Urne': 'Diagrama em árvore da urna', 'unmöglich': 'impossível',
        'beide Rot': 'ambas vermelhas', 'alle Rot': 'todas vermelhas', 'genau einmal Rot': 'exatamente uma vez vermelha', 'mindestens einmal Rot': 'pelo menos uma vez vermelha',
        'keinmal Rot': 'nenhuma vez vermelha', 'beide gleich': 'ambas da mesma cor', 'alle gleich': 'todas da mesma cor', 'leeren': 'limpar',
        'Anteil der Erkrankten': 'Proporção de doentes', 'Test erkennt Kranke (Sensitivität)': 'O teste deteta os doentes (sensibilidade)',
        'Test erkennt Gesunde (Spezifität)': 'O teste deteta os saudáveis (especificidade)', 'Darstellung': 'Representação',
        'Anzahlen (von 10 000)': 'Números absolutos (em 10 000)', 'Wahrscheinlichkeiten': 'Probabilidades', 'Anzahlen': 'Números absolutos',
        'positiv $T^+$': 'positivo $T^+$', 'negativ $T^-$': 'negativo $T^-$', 'krank $K$': 'doente $D$', 'gesund $\\overline{K}$': 'saudável $\\overline{D}$',
        'krank': 'doente', 'gesund': 'saudável', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Diagrama em árvore: doente ou saudável, depois o resultado do teste',
        'Neue Tafel': 'Nova tabela', 'A und B': 'A e B', 'A und nicht B': 'A e não B', 'nicht A und B': 'não A e B', 'nicht A und nicht B': 'não A e não B',
        'A gesamt': 'total de A', 'nicht A gesamt': 'total de não A', 'B gesamt': 'total de B', 'nicht B gesamt': 'total de não B', 'gesamt': 'total',
        // "Würfel" (dado / cubo) is never a global word: the simulator's button is a rule below
        'Münze': 'Moeda', 'Zwei Würfel': 'Dois dados', 'Urne': 'Urna', 'Wappen': 'face nacional', 'Sechs': 'seis', 'Augensumme 7': 'soma das pintas 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'ambas vermelhas (3 vermelhas, 2 azuis, sem reposição)',
        'mindestens eine Sechs in vier Würfen': 'pelo menos um seis em quatro lançamentos', 'Zufallsversuch': 'Experiência aleatória', 'Durchführen:': 'Realizar:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Frequência relativa em função do número de repetições',
        'VERSUCHE n': 'REPETIÇÕES n', 'TREFFER': 'SUCESSOS', 'REL. HÄUFIGKEIT': 'FREQ. RELATIVA', 'WAHRSCHEINLICHKEIT': 'PROBABILIDADE',
        'Noch kein Versuch – starte mit +1 oder +10.': 'Ainda nenhuma repetição – começa com +1 ou +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.':
            'Atrás de uma porta está um carro e atrás de cada uma das outras duas uma cabra. Escolhe uma porta.',
        'Neues Spiel': 'Novo jogo', '1000 Spiele vom Rechner spielen lassen': 'Deixar o computador jogar 1000 jogos',
        'Strategie': 'Estratégia', 'Spiele': 'Jogos', 'Autos': 'Carros', 'Gewinnquote': 'Taxa de vitórias',
        'du: bleiben': 'tu: manter', 'du: wechseln': 'tu: trocar', 'Rechner: bleiben': 'computador: manter', 'Rechner: wechseln': 'computador: trocar',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        // venn: what the operation says, inside the sentence "$A \cup B$ (…) $= …$"
        ['$A$ oder $B$ (oder beide)', '$A$ ou $B$ (ou ambos)'],
        ['$A$ und $B$', '$A$ e $B$'],
        ['nicht $A$', 'não $A$'],
        ['weder $A$ noch $B$', 'nem $A$ nem $B$'],
        ['nicht $A$ und nicht $B$', 'não $A$ e não $B$'],
        ['nicht beide', 'não ambos'],
        ['nicht $A$ oder nicht $B$', 'não $A$ ou não $B$'],
        // book pt-1 mathe11-pt:
        // baum, schnelltest, vierfeld-trainer, simulation, ziegen
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Clica nas extremidades dos caminhos (à direita na árvore) ou escolhe um acontecimento em cima. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'O livro mostra-te o cálculo com as regras dos caminhos.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>1.ª regra</b> (regra do produto: multiplicar ao longo do caminho):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>2.ª regra</b> (regra da soma: somar os caminhos):'],
        ['aber nur <b>', 'mas só <b>'], ['</b> davon sind wirklich krank.', '</b> estão realmente doentes.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Proporção de doentes entre os que tiveram teste positivo: '],
        [' alles richtig', ' tudo certo'], ['Ereignis: <b>', 'Acontecimento: <b>'], ['Zuletzt: ', 'Últimos: '],
        ['TÜR', 'PORTA'], ['Tür', 'Porta'], ['Gewonnen – das Auto! ', 'Ganhaste – o carro! '], ['Leider eine Ziege. ', 'Azar, uma cabra. '],
        ['Du hast gewechselt.', 'Trocaste de porta.'], ['Du bist geblieben.', 'Mantiveste a porta.'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-1 mathe11-pt:
        // letters in the trees and in the simulator, from Portuguese words as in lb1: balls R/B (rot/blau) → V/A (vermelho/azul),
        // K/G (krank/gesund) → D/S (doente/saudável), coin W/Z (Wappen/Zahl) → N/E (face nacional/face europeia)
        [/(font-weight:700">)R(<\/text>|<\/tspan>)/g, '$1V$2'], [/(font-weight:700">)B(<\/text>|<\/tspan>)/g, '$1A$2'],
        [/(font-weight:700">)K(<\/text>)/g, '$1D$2'], [/(font-weight:700">)G(<\/text>)/g, '$1S$2'],
        [/(margin-right:10px">)W</g, '$1N<'], [/(margin-right:10px">)Z</g, '$1E<'],
        [/(margin-right:10px">)([RB]{2})</g, (m, a, k) => a + k.replace(/R/g, 'V').replace(/B/g, 'A') + '<'],
        // baum-hero: the outcomes at the ends of the paths, "RR" … "BB"
        [/(<text x="10" y="20">)([RB]{2})(<\/text>)/g, (m, a, k, b) => a + k.replace(/R/g, 'V').replace(/B/g, 'A') + b],
        // simulator: the dice button ("Würfel" has two meanings, so no global word)
        [/(data-x="wuerfel">)Würfel</g, '$1Dado<'],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 de $2 certas'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'Em 10 000 pessoas, <b>' + n + '</b> têm teste positivo, '],
        // goats (before the header rule "^Zu " of js/buch-pt.js)
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'O apresentador sabe onde está o carro e abre a porta $1: uma cabra. Manténs a tua porta ou trocas?'],
        [/Bei Tür (\d) bleiben/g, 'Manter a porta $1'], [/Zu Tür (\d) wechseln/g, 'Trocar para a porta $1'],
    ]
});
