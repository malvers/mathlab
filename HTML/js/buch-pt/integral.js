/* js/buch-pt/integral.js — Portuguese for the widgets of js/buch-integral.js.
 * Loaded by the Portuguese editions right after js/buch-integral.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('integral', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs integral/*)
        // the cover of the start page (BGY 13): Ablehnungsbereich = região de rejeição, Normalenvektor = vetor normal
        'Titelbild: Glockenkurve über dem Histogramm eines Tests mit Ablehnungsbereich, eine Ebene im Raum mit Normalenvektor und Gerade':
            'Imagem da capa: curva em sino sobre o histograma de um teste com a região de rejeição, um plano no espaço com o vetor normal e uma reta',
        // book pt-3 mathe13-pt:
        // stammfunktion (lb3-1): Stammfunktion = primitiva, Schar = família
        'Konstante $C$': 'Constante $C$',
        'Oben: Stammfunktionen F + C (die gewählte hell). Ziehe den Punkt. Unten: f. Die Steigung von F im Punkt ist genau der Funktionswert f(x₀).':
            'Em cima: primitivas F + C (a escolhida a claro). Arrasta o ponto. Em baixo: f. O declive de F no ponto é exatamente o valor da função f(x₀).',
        'Schar von Stammfunktionen': 'Família de primitivas', 'Die Funktion f': 'A função f',
        // bestand (lb3-2): Bestand = quantidade, Zuflussrate = caudal (taxa de entrada), Änderungsrate = taxa de variação
        'Wassertank': 'Depósito de água', 'Zuflussrate in l/min': 'Caudal em l/min', 'Wasser in l': 'Água em l',
        'Bis $t = 6$ fließt Wasser zu, danach läuft es ab (negative Änderungsrate). Der Bestand ist bei $t = 6$ am größten.':
            'Até $t = 6$ entra água; depois a água escoa-se (taxa de variação negativa). A quantidade é máxima em $t = 6$.',
        'Autofahrt': 'Viagem de carro', 'v in m/s': 'v em m/s', 's in m': 's em m',
        'Die Fläche unter dem Geschwindigkeitsgraphen ist der zurückgelegte Weg.': 'A área sob o gráfico da velocidade é a distância percorrida.',
        'Änderungsrate mit Fläche': 'Taxa de variação com a área', 'Rekonstruierter Bestand': 'Quantidade reconstituída', 'Zeit $t$': 'Tempo $t$',
        // integral, zwischenflaeche (lb3-2, lb3-3): bestimmtes Integral = integral definido, Grenzen = limites de integração, Schnittstelle = abcissa do ponto de interseção
        'Bestimmtes Integral zwischen zwei Grenzen': 'Integral definido entre dois limites',
        'Parabel und Gerade': 'Parábola e reta', 'Kubik und Parabel': 'Cúbica e parábola', 'Sinus und Kosinus': 'Seno e cosseno', 'Funktionen': 'Funções',
        'Fläche zwischen zwei Graphen': 'Área entre dois gráficos', 'Zu wenige Schnittstellen im Bild.': 'Há poucos pontos de interseção na imagem.',
        // book pt-5 mathe13lk-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs integral/*)
        // book pt-3 mathe13-pt:
        // stammfunktion
        ['$ · Stammfunktionen $F(x) = ', '$ · primitivas $F(x) = '], [' + C$, denn $F\'(x) = f(x)$.', ' + C$, porque $F\'(x) = f(x)$.'],
        ['Bei $x_0 = ', 'Em $x_0 = '], ['$: Steigung von $F$ $= f(', '$: declive de $F$ $= f('], ['$, egal welches $C$.', '$, seja qual for $C$.'],
        // bestand
        ['$ · Anfangsbestand $', '$ · quantidade inicial $'], ['Bestand nach $t = ', 'Quantidade ao fim de $t = '],
        // integral
        ['Teilstücke zwischen den Nullstellen: ', 'Partes entre os zeros: '],
        ['Flächeninhalt zwischen Graph und $x$-Achse: $A \\approx ', 'Área entre o gráfico e o eixo $Ox$: $A \\approx '],
        [' · Das Integral ist kleiner, weil Flächen unter der Achse (rot) negativ zählen.', ' · O integral é menor, porque as áreas abaixo do eixo (a vermelho) contam como negativas.'],
        [' · Achtung: $a > b$ dreht das Vorzeichen.', ' · Atenção: $a > b$ troca o sinal.'],
        // zwischenflaeche
        ['$ · Schnittstellen: ', '$ · abcissas dos pontos de interseção: '],
        // book pt-5 mathe13lk-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-3 mathe13-pt:
        // zwischenflaeche: a list of intersections with a decimal comma ("0,785, 3,927") is separated by semicolons, as in A(1,5; 2)
        [/(Schnittstellen: [^<]*)/g, m => (/\{,\}/.test(m) ? m.replace(/\$, \$/g, '$; $') : m)],
        // book pt-5 mathe13lk-pt:
    ]
});
