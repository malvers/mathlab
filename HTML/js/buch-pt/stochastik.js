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
        // book pt-2 mathe12-pt:
        // unabhaengig (lb1-1): unabhängig = independentes, unvereinbar = incompatíveis (as pt0), abhängig = dependentes
        'Unabhängig machen': 'Tornar independentes', 'Unvereinbar machen': 'Tornar incompatíveis',
        'Einheitsquadrat: Anteil von A in B und in nicht B': 'Quadrado unitário: parte de A em B e em não B',
        // histo-hero, zufallsgroesse (lb1-2): Zufallsgröße = variável aleatória, Erwartungswert = valor médio, Varianz = variância,
        // Standardabweichung = desvio padrão, Einsatz = aposta, Auszahlung = prémio, Gewinn = ganho, fair = equitativo; the die button is a rule
        'Histogramm einer Wahrscheinlichkeitsverteilung': 'Histograma de uma distribuição de probabilidades', 'Histogramm einer Binomialverteilung': 'Histograma de uma distribuição binomial',
        'Drei Münzen': 'Três moedas', 'Augensumme': 'Soma das pintas', 'Glücksrad': 'Roleta', 'Zufallsgröße': 'Variável aleatória', 'Einsatz': 'Aposta',
        'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Distribuição de probabilidades num diagrama de barras', 'Spielen:': 'Jogar:',
        'SPIELE n': 'JOGOS n', 'MITTELWERT': 'MÉDIA', 'ERWARTUNGSWERT': 'VALOR MÉDIO', 'LETZTE': 'ÚLTIMOS',
        // bernoulli-baum, binomial (lb1-3): Bernoulli-Kette = sequência de provas de Bernoulli, Treffer / Niete = sucesso / insucesso
        // (the tree letters T/N → S/I, rule below)
        'Stufen $n$:': 'Etapas $n$:', 'Anzahl der Stufen': 'Número de etapas', 'Trefferwahrscheinlichkeit $p$': 'Probabilidade de sucesso $p$',
        'Genau $k$ Treffer:': 'Exatamente $k$ sucessos:', 'Anzahl der Treffer': 'Número de sucessos',
        'Baumdiagramm einer Bernoulli-Kette': 'Diagrama em árvore de uma sequência de provas de Bernoulli',
        'Anzahl der Versuche $n$': 'Número de provas $n$', 'Was wird berechnet?': 'O que se calcula?', 'Histogramm der Binomialverteilung': 'Histograma da distribuição binomial',
        // book pt-3 mathe13-pt:
        // stichprobe (lb4-1): Grundgesamtheit = população, Stichprobe = amostra, Umfang = dimensão, relative Häufigkeit = frequência relativa
        'Anteil in der Grundgesamtheit $p$': 'Proporção na população $p$', 'Stichprobenumfang $n$': 'Dimensão da amostra $n$',
        'Stichproben ziehen:': 'Extrair amostras:', 'Noch keine Stichprobe gezogen.': 'Ainda não foi extraída nenhuma amostra.',
        'Verteilung der relativen Häufigkeiten vieler Stichproben': 'Distribuição das frequências relativas de muitas amostras',
        // signifikanztest (lb4-2): Signifikanztest = teste de hipóteses, Nullhypothese = hipótese nula, Signifikanzniveau = nível de significância,
        // Ablehnungsbereich = região de rejeição, Fehler 1./2. Art = erro de tipo I / II
        'Nullhypothese $p_0$': 'Hipótese nula $p_0$', 'Test:': 'Teste:', 'Art des Tests': 'Tipo de teste',
        'linksseitig': 'unilateral à esquerda', 'rechtsseitig': 'unilateral à direita', 'zweiseitig': 'bilateral',
        'Signifikanzniveau $\\alpha$:': 'Nível de significância $\\alpha$:', 'Signifikanzniveau': 'Nível de significância',
        'Beobachtete Trefferzahl $k$': 'Número de sucessos observado $k$',
        'Binomialverteilung unter der Nullhypothese mit Ablehnungsbereich': 'Distribuição binomial sob a hipótese nula com a região de rejeição',
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
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
        // book pt-2 mathe12-pt:
        // unabhaengig
        ['$ und $', '$ e $'],
        ['<b>Unabhängig:</b> Ob $B$ eintritt oder nicht, der Anteil von $A$ bleibt gleich. Im Quadrat liegt die Grenze in beiden Spalten auf gleicher Höhe.',
            '<b>Independentes:</b> quer $B$ aconteça quer não, a parte de $A$ mantém-se igual. No quadrado, a fronteira está à mesma altura nas duas colunas.'],
        ['<b>Unvereinbar</b> ($A \\cap B = \\emptyset$) und damit <b>abhängig</b>: Wenn $B$ eintritt, kann $A$ nicht mehr eintreten.',
            '<b>Incompatíveis</b> ($A \\cap B = \\emptyset$) e, portanto, <b>dependentes</b>: se $B$ acontecer, $A$ já não pode acontecer.'],
        // zufallsgroesse: the help "$X$ = …." and the results
        ['Augensumme zweier Würfel', 'soma das pintas de dois dados'], ['Augenzahl', 'número de pintas'], ['Anzahl Wappen', 'número de faces nacionais'],
        ['Gewinn = Auszahlung − Einsatz', 'ganho = prémio − aposta'], ['Gewinn bei 1 € Einsatz', 'ganho com uma aposta de 1 €'],
        [' Auszahlungen 0 €, 1 €, 2 €, 10 € mit den Wahrscheinlichkeiten ', ' Prémios de 0 €, 1 €, 2 €, 10 € com as probabilidades '],
        [' Du setzt 1 € auf eine Zahl, dann werden drei Würfel geworfen. Für jeden Würfel mit deiner Zahl bekommst du 1 € Gewinn, sonst ist der Einsatz weg.',
            ' Apostas 1 € num número e depois lançam-se três dados. Por cada dado com o teu número ganhas 1 €; caso contrário, perdes a aposta.'],
        ['Erwartungswert: ', 'Valor médio: '], ['Varianz: ', 'Variância: '], [' · Standardabweichung: ', ' · Desvio padrão: '],
        [' · Das Spiel ist <b>fair</b>.', ' · O jogo é <b>equitativo</b>.'],
        // bernoulli-baum, binomial
        ['$ · jeder hat die Wahrscheinlichkeit $', '$ · cada um tem a probabilidade $'], ['Formel von Bernoulli: $', 'Fórmula de Bernoulli: $'],
        ['$X$ ist binomialverteilt mit $n = ', '$X$ segue uma distribuição binomial com $n = '],
        ['Erwartungswert $\\mu', 'Valor médio $\\mu'], [' · Standardabweichung $\\sigma', ' · Desvio padrão $\\sigma'],
        // book pt-3 mathe13-pt:
        // stichprobe
        [' Stichproben vom Umfang ', ' amostras de dimensão '], [' Stichprobe vom Umfang ', ' amostra de dimensão '],
        [' · letzte: $h = ', ' · última: $h = '], ['$ (gold)', '$ (a dourado)'], ['Mittelwert der $h$: $', 'Média dos $h$: $'],
        ['$ · Standardabweichung der $h$: $', '$ · desvio padrão dos $h$: $'], ['Theorie: $', 'Teoria: $'],
        ['$. Viermal so großes $n$ halbiert die Streuung.', '$. Com um $n$ quatro vezes maior, a dispersão reduz-se a metade.'],
        // signifikanztest
        [' Fehler 2. Art zeigen: wahres $p$ =', ' Mostrar o erro de tipo II: verdadeiro $p$ ='], ['$ gegen $H_1\\colon ', '$ contra $H_1\\colon '],
        ['Ablehnungsbereich (rot): $', 'Região de rejeição (a vermelho): $'],
        ['$ · tatsächliche Irrtumswahrscheinlichkeit $\\approx ', '$ · probabilidade de erro efetiva $\\approx '], ['Beobachtet $k = ', 'Observado $k = '],
        ['<b>$H_0$ wird abgelehnt.</b> Das Ergebnis ist signifikant.', '<b>$H_0$ é rejeitada.</b> O resultado é significativo.'],
        ['<b>$H_0$ wird nicht abgelehnt.</b> Das beweist aber nicht, dass $H_0$ stimmt.', '<b>$H_0$ não é rejeitada.</b> Mas isso não prova que $H_0$ seja verdadeira.'],
        ['Ist in Wahrheit $p = ', 'Se, na realidade, $p = '], ['$ (violett), wird $H_0$ mit $\\beta \\approx ', '$ (a violeta), $H_0$ é mantida erradamente com $\\beta \\approx '],
        ['$ fälschlich beibehalten (Fehler 2. Art).', '$ (erro de tipo II).'],
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
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
        // book pt-2 mathe12-pt:
        // unabhaengig: "B verändert die Wahrscheinlichkeit von A nach oben" → "B aumenta a probabilidade de A"
        [/<b>Abhängig:<\/b> \$B\$ verändert die Wahrscheinlichkeit von \$A\$ nach (oben|unten)\./g,
            (m, d) => '<b>Dependentes:</b> $B$ ' + (d === 'oben' ? 'aumenta' : 'diminui') + ' a probabilidade de $A$.'],
        // unabhaengig: the German conditional probability P_B(A) is P(A|B) in Portuguese schools (with a bar, never \mid)
        [/P_B\(A\)/g, 'P(A|B)'], [/P_\{\\overline\{B\}\}\(A\)/g, 'P(A|\\overline{B})'],
        // zufallsgroesse: the die button ("Würfel" has two meanings, so no global word, as the simulator of pt-1)
        [/(data-v="wuerfel">)Würfel</g, '$1Dado<'],
        [/ · Auf lange Sicht <b>(verlierst|gewinnst)<\/b> du im Mittel (\$[^$]*\$) € pro Spiel\./g,
            (m, w, x) => ' · A longo prazo, ' + (w === 'verlierst' ? '<b>perdes</b>' : '<b>ganhas</b>') + ' em média ' + x + ' € por jogo.'],
        // bernoulli-baum: "Pfade mit genau 2 Treffern: …" → "Caminhos com exatamente 2 sucessos: …"
        [/Pfade mit genau (\d+) Treffern: /g, (m, k) => 'Caminhos com exatamente ' + k + (k === '1' ? ' sucesso: ' : ' sucessos: ')],
        // bernoulli-baum: the letters of the tree T/N (Treffer/Niete) → S/I (sucesso/insucesso), only inside this tree
        [/^(<svg class="st-tree"[^>]*aria-label="Baumdiagramm einer Bernoulli-Kette">)([\s\S]*)$/, (m, head, body) => head + body
            .replace(/(font-weight:700">)([TN])(<\/text>)/g, (x, a, l, b) => a + (l === 'T' ? 'S' : 'I') + b)
            .replace(/(<text x="10" y="20">)([TN]+)(<\/text>)/g, (x, a, k, b) => a + k.replace(/[TN]/g, l => (l === 'T' ? 'S' : 'I')) + b)],
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
    ]
});
