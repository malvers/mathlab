/* js/buch-pt/bgy13lk.js — Portuguese for the widgets of js/buch-bgy13lk.js.
 * Loaded by the Portuguese editions right after js/buch-bgy13lk.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package pt2-prep (08.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('bgy13lk', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs bgy13lk/*)
        // LEO (leontief): the three sectors; the short letters L, I, D of the table stay and are explained by a phrase of pt-5
        'Landwirtschaft': 'Agricultura', 'Industrie': 'Indústria', 'Dienstleistung': 'Serviços',
        // UEB (uebergang): the stages of the beetle and the three providers
        'Eier': 'Ovos', 'Larven': 'Larvas', 'Käfer': 'Escaravelhos', 'Anbieter A': 'Fornecedor A', 'Anbieter B': 'Fornecedor B', 'Anbieter C': 'Fornecedor C',
        // book pt-5 mathe13lk-pt:
        // the cover of the start page (titelbildbgy13lk)
        'Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer':
            'Imagem da capa: trapézios sob uma curva, uma curva de Gauss com a região de rejeição a vermelho, um ciclo ovo, larva, escaravelho',
        // matrixinverse (wp2-1): Einheitsmatrix E = matriz identidade I (Portuguese schools; the rules turn the E of this module's widgets into I),
        // invertierbar = invertível, Zeilenumformung = operação sobre as linhas, Pivotelement = pivô
        'nicht invertierbar': 'não invertível', 'Beispielmatrix': 'Matriz de exemplo', 'Nächster Schritt': 'Próximo passo', 'Alle Schritte': 'Todos os passos', 'Von vorn': 'Do início',
        // leontief (wp2-2): Technologiematrix = matriz tecnológica, Endnachfrage = procura final, Leontief-Inverse = inversa de Leontief (I − A)⁻¹
        'Markt': 'Mercado',
        // uebergang (wp2-3): Übergangsmatrix = matriz de transição, Grenzmatrix = matriz limite, Fixvektor = vetor fixo, E = I
        'Käferpopulation': 'População de escaravelhos', 'Kundenwanderung': 'Mudança de clientes', 'Eier je Käfer $f$': 'Ovos por escaravelho $f$',
        'Verlauf der drei Klassen über die Schritte n': 'Evolução das três classes ao longo dos passos n', '1 Schritt': '1 passo', '10 Schritte': '10 passos',
        'Zurück auf Start': 'Voltar ao início',
        'Übergangsgraph mit drei Zuständen und den Übergangsanteilen an den Pfeilen': 'Grafo de transição com três estados e as proporções de transição nas setas',
        // biquadratisch (lb7-1): biquadratische Gleichung = equação biquadrada, Substitution = substituição
        'Koeffizient $p$': 'Coeficiente $p$', 'Koeffizient $q$': 'Coeficiente $q$', 'Keine Lösung': 'Nenhuma solução', 'Eine Lösung': 'Uma solução',
        'Die Parabel h(z) = z² + p·z + q mit ihren Nullstellen': 'A parábola h(z) = z² + p·z + q com os seus zeros',
        'Der Graph von f(x) = x⁴ + p·x² + q mit seinen Nullstellen': 'O gráfico de f(x) = x⁴ + p·x² + q com os seus zeros',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs bgy13lk/*)
        // book pt-5 mathe13lk-pt:
        // matrixinverse
        ['Neben $A$ steht die Einheitsmatrix $E$. Ziel: links $E$ erzeugen, mit denselben Zeilenumformungen wie rechts.',
            'Ao lado de $A$ está a matriz identidade $I$. Objetivo: obter $I$ à esquerda, com as mesmas operações sobre as linhas também à direita.'],
        ['$ teilen: Das Pivotelement wird 1.', '$: o pivô passa a ser 1.'],
        ['Links lässt sich keine Einheitsmatrix mehr erzeugen: Eine Zeile wird links ganz null, oder in einer Spalte gibt es keine Zahl $\\neq 0$ mehr. <b>$A$ ist nicht invertierbar.</b>',
            'À esquerda já não se consegue obter a matriz identidade: uma linha fica nula à esquerda, ou numa coluna já não há nenhum número $\\neq 0$. <b>$A$ não é invertível.</b>'],
        ['Links steht $E$, rechts steht $A^{-1}$.', 'À esquerda está $I$, à direita está $A^{-1}$.'],
        ['$. Probe: $A \\cdot A^{-1} = E$, zum Beispiel erste Zeile mal erste Spalte: $', '$. Verificação: $A \\cdot A^{-1} = I$, por exemplo, primeira linha vezes primeira coluna: $'],
        ['Das Gleichungssystem $A \\cdot \\vec{x} = ', 'O sistema de equações $A \\cdot \\vec{x} = '], ['$ hat die Lösung $\\vec{x} = A^{-1} \\cdot \\vec{b} = ', '$ tem a solução $\\vec{x} = A^{-1} \\cdot \\vec{b} = '],
        ['Die dritte Zeile von $A$ ist die Summe der ersten beiden. Dann hat $A \\cdot \\vec{x} = \\vec{b}$ entweder keine oder unendlich viele Lösungen, nie genau eine.',
            'A terceira linha de $A$ é a soma das duas primeiras. Então $A \\cdot \\vec{x} = \\vec{b}$ não tem solução ou tem uma infinidade de soluções, nunca exatamente uma.'],
        ['Weiter mit „Nächster Schritt“.', 'Continua com «Próximo passo».'],
        // ME (Mengeneinheiten) = u.q. (unidades de quantidade), also for verflechtung (gy11lk) on the same page
        [' ME', ' u.q.'],
        // leontief
        ['Zeile: liefernder Sektor, Spalte: empfangender Sektor. ', 'Linha: setor que fornece; coluna: setor que recebe. '],
        ['L = Landwirtschaft, I = Industrie, D = Dienstleistung', 'L = agricultura (Landwirtschaft), I = indústria, D = serviços (Dienstleistung)'],
        ['. Summe = Produktion, alle Angaben gerundet in ME.', '. Total = produção; todos os valores arredondados, em u.q.'],
        ['Technologiematrix $A = ', 'Matriz tecnológica $A = '], ['$, Leontief-Inverse $(E - A)^{-1} \\approx ', '$, inversa de Leontief $(I - A)^{-1} \\approx '],
        ['$\\vec{x} = (E - A)^{-1} \\cdot \\vec{y} \\approx ', '$\\vec{x} = (I - A)^{-1} \\cdot \\vec{y} \\approx '],
        ['$. Jede Zeile der Tabelle geht auf: Lieferungen an die drei Sektoren plus Endnachfrage ergeben die Produktion. ',
            '$. Cada linha da tabela bate certo: os fornecimentos aos três setores mais a procura final dão a produção. '],
        // uebergang: the names inside the sentences ("(Eier 800, Larven 200, Käfer 50)", "Anbieter A 42,1 %")
        ['(Eier ', '(ovos '], [', Larven ', ', larvas '], [', Käfer ', ', escaravelhos '], ['Anbieter ', 'fornecedor '],
        ['$U^3 = a \\cdot b \\cdot f \\cdot E = ', '$U^3 = a \\cdot b \\cdot f \\cdot I = '], [' \\cdot E$: Nach jeweils drei Schritten ist jede Klasse ', ' \\cdot I$: ao fim de cada três passos, cada classe '],
        ['<b>genau so groß wie vorher</b>, die Population schwankt zyklisch.', 'tem <b>exatamente o mesmo tamanho que antes</b>: a população oscila ciclicamente.'],
        ['$. Mit wachsendem $n$ werden die Spalten von $P^n$ gleich: Sie nähern sich der <b>Grenzmatrix</b>, deren Spalten alle der <b>Fixvektor</b> sind.',
            '$. Com $n$ a crescer, as colunas de $P^n$ ficam iguais: aproximam-se da <b>matriz limite</b>, cujas colunas são todas o <b>vetor fixo</b>.'],
        ['Fixvektor aus $P \\cdot \\vec{v} = \\vec{v}$ und $v_1 + v_2 + v_3 = 1$: $\\vec{v} \\approx ', 'Vetor fixo a partir de $P \\cdot \\vec{v} = \\vec{v}$ e $v_1 + v_2 + v_3 = 1$: $\\vec{v} \\approx '],
        ['$. Langfristig: ', '$. A longo prazo: '], [' der Kundschaft, egal wie es anfing.', ' da clientela, seja qual for o início.'],
        // biquadratisch (the widget computes the reduced discriminant p²/4 − q)
        [' = 0$ wird mit $z = x^2$ zu $z^2', ' = 0$ transforma-se, com $z = x^2$, em $z^2'], ['$, Diskriminante $\\tfrac{p^2}{4} - q = ', '$, discriminante reduzido $\\tfrac{p^2}{4} - q = '],
        [' liefert $x = \\pm', ' dá $x = \\pm'], [' liefert $x = 0$', ' dá $x = 0$'], [' liefert nichts, denn $x^2$ ist nie negativ', ' não dá nada, porque $x^2$ nunca é negativo'],
        ['keine Lösung $z$, die Diskriminante ist negativ', 'nenhuma solução $z$: o discriminante é negativo'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-5 mathe13lk-pt:
        // matrixinverse: "Schritt 2 von 6: ", the row operations with Roman row numbers
        [/Schritt (\d+) von (\d+): /g, 'Passo $1 de $2: '],
        [/Zeilen (I{1,3}) und (I{1,3}) tauschen, damit in Spalte (\d) oben keine Null steht\./g, 'Trocar as linhas $1 e $2, para que na coluna $3 não fique um zero em cima.'],
        [/Zeile (I{1,3}) durch \$/g, 'Dividir a linha $1 por $$'], [/In Spalte (\d) Nullen erzeugen: /g, 'Anular os outros elementos da coluna $1: '],
        // leontief: the slider labels "Endnachfrage Landwirtschaft $y_1$" and the last sentence with two rounded totals
        [/Endnachfrage (Landwirtschaft|Industrie|Dienstleistung) \$y_(\d)\$/g,
            (m, n, i) => 'Procura final ' + { Landwirtschaft: 'agricultura', Industrie: 'indústria', Dienstleistung: 'serviços' }[n] + ' $y_' + i + '$'],
        [/Insgesamt werden ([\d .  ]+) ME erzeugt, damit ([\d .  ]+) ME den Markt erreichen\./g, 'No total produzem-se $1 u.q. para que $2 u.q. cheguem ao mercado.'],
        // uebergang: "um den Faktor 1,25 <b>gewachsen</b>." / "auf das 0,8-Fache <b>geschrumpft</b>, …"
        [/um den Faktor ([\d,]+) <b>gewachsen<\/b>\./g, '<b>cresceu</b> pelo fator $1.'],
        [/auf das ([\d,]+)-Fache <b>geschrumpft<\/b>, die Population stirbt langfristig aus\./g, '<b>diminuiu</b> para $1 vezes o valor anterior: a população extingue-se a longo prazo.'],
        // biquadratisch: "<b>3 Lösungen</b>"
        [/<b>(\d) Lösungen<\/b>/g, '<b>$1 soluções</b>'],
        // biquadratisch: the solution set with whole numbers gets commas, with decimal commas it keeps the semicolons
        [/(x \\in \\\{)([^$]*?)(\\\})/g, (m, a, b, c) => a + (/\{,\}/.test(b) ? b : b.replace(/;\\ /g, ', ')) + c],
    ]
});
