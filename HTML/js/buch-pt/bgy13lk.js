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
        // book pt-5 mathe13lk-pt:
        // the cover of the start page (titelbildbgy13lk)
        'Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer':
            'Imagem da capa: trapézios sob uma curva, uma curva de Gauss com a região de rejeição a vermelho, um ciclo ovo, larva, escaravelho',
        // matrixinverse (wp2-1): Einheitsmatrix E = matriz identidade I (Portuguese schools; the rules turn the E of this module's widgets into I),
        // invertierbar = invertível, Zeilenumformung = operação sobre as linhas, Pivotelement = pivô
        'nicht invertierbar': 'não invertível', 'Beispielmatrix': 'Matriz de exemplo', 'Nächster Schritt': 'Próximo passo', 'Alle Schritte': 'Todos os passos', 'Von vorn': 'Do início',
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
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-5 mathe13lk-pt:
        // matrixinverse: "Schritt 2 von 6: ", the row operations with Roman row numbers
        [/Schritt (\d+) von (\d+): /g, 'Passo $1 de $2: '],
        [/Zeilen (I{1,3}) und (I{1,3}) tauschen, damit in Spalte (\d) oben keine Null steht\./g, 'Trocar as linhas $1 e $2, para que na coluna $3 não fique um zero em cima.'],
        [/Zeile (I{1,3}) durch \$/g, 'Dividir a linha $1 por $$'], [/In Spalte (\d) Nullen erzeugen: /g, 'Anular os outros elementos da coluna $1: '],
    ]
});
