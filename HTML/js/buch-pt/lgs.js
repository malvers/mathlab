/* js/buch-pt/lgs.js — Portuguese for the widgets of js/buch-lgs.js.
 * Loaded by the Portuguese editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the pt0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('lgs', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs lgs/*)
        // book pt-1 mathe11-pt:
        // gauss, geraden, matrizen, pagerank (the button names as lb4 writes them: «Executar», «Próximo passo», «Novo sistema», «1 passo»)
        'Ausführen': 'Executar', 'Nächster Schritt': 'Próximo passo', 'Neues LGS': 'Novo sistema',
        'Zeile + k · Zeile': 'linha + k · linha', 'Zeile · k': 'linha · k', 'tauschen': 'trocar', 'Zielzeile': 'Linha alvo', 'zweite Zeile': 'Segunda linha', 'Faktor k': 'Fator k',
        'Ziel I': 'alvo I', 'Ziel II': 'alvo II', 'Ziel III': 'alvo III', 'mit I': 'com I', 'mit II': 'com II', 'mit III': 'com III',
        'eine Lösung': 'uma solução', 'keine Lösung': 'nenhuma solução', 'unendlich viele': 'uma infinidade', 'Zwei Geraden': 'Duas retas',
        'mit $r =$': 'com $r =$', 'Neue Matrizen': 'Novas matrizes', 'Wähle eine Rechnung.': 'Escolhe um cálculo.',
        '1 Schritt': '1 passo', '10 Schritte': '10 passos', 'Vier Webseiten und ihre Links': 'Quatro páginas web e as suas ligações',
        // book pt-3 mathe13-pt:
        // book pt-5 mathe13lk-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs lgs/*)
        // book pt-1 mathe11-pt:
        // gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Concluído: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Forma escalonada obtida. Agora podes substituir de baixo para cima ou continuar a transformar com «Próximo passo» (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Escolhe uma operação e executa-a, ou pede ajuda com «Próximo passo».'],
        ['Wähle zwei verschiedene Zeilen.', 'Escolhe duas linhas diferentes.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Escreve um número para $k$, p. ex. -2 ou 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Multiplicar por $0$ não é uma operação de equivalência.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Somar uma linha a si própria altera o conjunto-solução. Escolhe outra linha.'],
        ['Gleichung I ist fest: ', 'A equação I está fixa: '], ['. Verändere Gleichung II: ', '. Altera a equação II: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'A equação II fica $0 = 0$: não impõe nenhuma condição.'], ['Gleichung II lautet $0 = ', 'A equação II fica $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$: uma contradição, nenhuma solução.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Exatamente uma solução</b>: as retas intersetam-se em $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Uma infinidade de soluções</b>: as duas equações descrevem a mesma reta.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Nenhuma solução</b>: as retas são paralelas e distintas.'],
        ['Gleiche Stellen werden addiert.', 'Somam-se os elementos na mesma posição.'], ['Gleiche Stellen werden subtrahiert.', 'Subtraem-se os elementos na mesma posição.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Cada elemento é multiplicado por $r$.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'As linhas passam a colunas: uma matriz $2 \\times 3$ passa a ser uma matriz $3 \\times 2$.'],
        ['Summe: $', 'Soma: $'],
        // book pt-3 mathe13-pt:
        // book pt-5 mathe13lk-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-1 mathe11-pt:
        // gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'Na coluna $1 já não há pivô: o sistema não tem nenhuma solução ou tem uma infinidade de soluções.'],
        [/Schritt (\d+):/g, 'Passo $1:'],
        // book pt-3 mathe13-pt:
        // book pt-5 mathe13lk-pt:
    ]
});
