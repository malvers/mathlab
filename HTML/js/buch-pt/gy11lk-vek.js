/* js/buch-pt/gy11lk-vek.js — Portuguese for the widgets of js/buch-gy11lk-vek.js.
 * Loaded by the Portuguese editions right after js/buch-gy11lk-vek.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('gy11lk-vek', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk-vek/*)
        // eqRow: the aria labels of the four number fields "E₁, Koeffizient von x" (phrases below)
        'Koeffizient von x': 'coeficiente de x', 'Koeffizient von y': 'coeficiente de y', 'Koeffizient von z': 'coeficiente de z', 'rechte Seite': 'segundo membro',
        // book pt-5 mathe13lk-pt:
        // ebenenlage (wp1-2): Schnittgerade = reta de interseção, Spurgerade = traço; the preset "parallel" by the rule in vektoren.js
        'Dach': 'Telhado', 'Spurgerade': 'Traço', 'Zwei Ebenen im Raum und ihre Schnittgerade': 'Dois planos no espaço e a sua reta de interseção',
        'Mindestens ein Koeffizient von $x$, $y$, $z$ muss ungleich null sein, sonst ist es keine Ebene.': 'Pelo menos um coeficiente de $x$, $y$, $z$ tem de ser diferente de zero; caso contrário, não é um plano.',
        // book pt-22 mathegy11lk-pt:
        // koordsys3d (lb3-1): Zylinder-/Kugelkoordinaten = coordenadas cilíndricas / esféricas, Länge / Breite = longitude / latitude, Höhe = cota
        'Welches Koordinatensystem?': 'Que sistema de coordenadas?',
        'Ein Punkt im Raum mit seinen Zylinder- oder Kugelkoordinaten': 'Um ponto no espaço com as suas coordenadas cilíndricas ou esféricas',
        'Abstand $r$ zur $z$-Achse': 'Distância $r$ ao eixo $Oz$', 'Winkel $\\varphi$': 'Ângulo $\\varphi$', 'Höhe $z$': 'Cota $z$',
        'Abstand $r$ zum Ursprung': 'Distância $r$ à origem', 'Länge $\\varphi$': 'Longitude $\\varphi$', 'Breite $\\vartheta$': 'Latitude $\\vartheta$',
        // linabh3d (lb3-2): linear (un)abhängig = linearmente (in)dependentes, komplanar / kollinear = complanares / colineares
        'unabhängig': 'independentes', 'komplanar': 'complanares', 'zwei parallel': 'dois colineares',
        'Drei Vektoren vom Ursprung aus und die Ebene, die zwei von ihnen aufspannen': 'Três vetores a partir da origem e o plano definido por dois deles',
        // varignon3d (lb3-2): Mittenviereck = quadrilátero dos pontos médios
        'eben': 'plano', 'räumlich': 'no espaço', 'nicht konvex': 'não convexo',
        'Ein Viereck im Raum mit dem Parallelogramm seiner Seitenmitten': 'Um quadrilátero no espaço com o paralelogramo dos pontos médios dos seus lados',
        // ebenelim (lb3-3): Koordinatenform = equação cartesiana, Spurdreieck = triângulo dos pontos de interseção com os eixos, Durchstoßpunkt = ponto de interseção
        'Koordinatenform': 'Equação cartesiana', 'Gerade und Ebene': 'Reta e plano',
        'Eine Ebene im Raum mit ihrem Spurdreieck': 'Um plano no espaço com o triângulo dos seus pontos de interseção com os eixos',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy11lk-vek/*)
        // eqRow
        [', Koeffizient von ', ', coeficiente de '], [', rechte Seite', ', segundo membro'],
        // book pt-5 mathe13lk-pt:
        // ebenenlage
        ['Die linke Seite von $E_2$ ist das ', 'O primeiro membro de $E_2$ é '], ['-Fache der linken Seite von $E_1$. Rechts: $', ' vezes o primeiro membro de $E_1$. À direita: $'],
        ['Beide Gleichungen sind gleichwertig: <b>identisch</b>.', 'As duas equações são equivalentes: planos <b>coincidentes</b>.'],
        ['Das System hat keine Lösung: <b>parallel</b> und verschieden.', 'O sistema é impossível: planos <b>estritamente paralelos</b>.'],
        ['Die linken Seiten sind keine Vielfachen: Die Ebenen <b>schneiden</b> sich in einer Geraden. Freie Variable $',
            'Os primeiros membros não são múltiplos: os planos <b>intersetam-se</b> numa reta. Variável livre $'],
        [' = t$, übrig bleibt für $', ' = t$; resta, para $'], ['$ und $', '$ e $'], ['Gelöst: $', 'Resolvido: $'], ['Schnittgerade: <b>$g', 'Reta de interseção: <b>$g'],
        ['. Ganzzahliger Richtungsvektor: $', '. Vetor diretor de coordenadas inteiras: $'],
        // book pt-22 mathegy11lk-pt:
        // koordsys3d
        ['Zylinderkoordinaten', 'Coordenadas cilíndricas'], ['Kugelkoordinaten', 'Coordenadas esféricas'], ['Kartesisch: $P(', 'Cartesianas: $P('],
        [')$. Alle Punkte mit demselben $r$ liegen auf einem Zylindermantel um die $z$-Achse.', ')$. Todos os pontos com o mesmo $r$ estão numa superfície cilíndrica em torno do eixo $Oz$.'],
        ['^\\circ)$ mit der Länge $\\varphi$ und der Breite $\\vartheta$', '^\\circ)$, com a longitude $\\varphi$ e a latitude $\\vartheta$'],
        [')$. Alle Punkte mit demselben $r$ liegen auf einer Kugel um den Ursprung; auf der Erde sind $\\varphi$ und $\\vartheta$ die geografische Länge und Breite.',
            ')$. Todos os pontos com o mesmo $r$ estão numa superfície esférica de centro na origem; na Terra, $\\varphi$ e $\\vartheta$ são a longitude e a latitude geográficas.'],
        // linabh3d (the zero vector is written $\vec{0}$ in Portuguese)
        ['$r\\vec{a} + s\\vec{b} + t\\vec{c} = \\vec{o}$ als Gleichungssystem: $', '$r\\vec{a} + s\\vec{b} + t\\vec{c} = \\vec{0}$ como sistema de equações: $'],
        ['Das Gauß-Verfahren führt auf die Einheitsmatrix: Nur $r = s = t = 0$ löst das System. Die Vektoren sind <b>linear unabhängig</b>, sie liegen nicht in einer Ebene.',
            'O método de Gauss leva à matriz identidade: só $r = s = t = 0$ resolve o sistema. Os vetores são <b>linearmente independentes</b>, não estão num mesmo plano.'],
        ['Das System hat auch Lösungen mit Zahlen, die nicht alle null sind', 'O sistema também tem soluções com números que não são todos nulos'],
        ['. Die Vektoren sind <b>linear abhängig</b>: ', '. Os vetores são <b>linearmente dependentes</b>: '],
        ['$\\vec{c}$ liegt in der Ebene von $\\vec{a}$ und $\\vec{b}$ (komplanar).', '$\\vec{c}$ está no plano de $\\vec{a}$ e $\\vec{b}$ (complanares).'],
        ['$\\vec{a}$ und $\\vec{b}$ sind parallel (kollinear).', '$\\vec{a}$ e $\\vec{b}$ são colineares.'],
        // varignon3d
        ['Gleiche Vektoren: Zwei Gegenseiten des Mittenvierecks sind parallel und gleich lang, beide halb so lang wie die Diagonale $AC$. Ebenso $',
            'Vetores iguais: dois lados opostos do quadrilátero dos pontos médios são paralelos e têm o mesmo comprimento, ambos metade da diagonal $[AC]$. Do mesmo modo, $'],
        ['Die Ecken $A$, $B$, $C$, $D$ liegen in einer Ebene.', 'Os vértices $A$, $B$, $C$, $D$ estão num mesmo plano.'],
        ['Die Ecken liegen <b>nicht</b> in einer Ebene: ein räumliches Viereck.', 'Os vértices <b>não</b> estão num mesmo plano: um quadrilátero no espaço.'],
        [' Das Mittenviereck ist trotzdem immer ein ebenes <b>Parallelogramm</b>.', ' Mesmo assim, o quadrilátero dos pontos médios é sempre um <b>paralelogramo</b> plano.'],
        // ebenelim
        ['$\\vec{u}$ und $\\vec{v}$ sind linear abhängig. Sie spannen keine Ebene auf.', '$\\vec{u}$ e $\\vec{v}$ são linearmente dependentes. Não definem um plano.'],
        ['Die Zeilen mit ', 'Multiplicar as linhas por '],
        [' multiplizieren und addieren. Dann fallen die Parameter weg: $r$-Glieder $', ' e somar. Então os parâmetros desaparecem: termos em $r$: $'], ['$s$-Glieder $', 'termos em $s$: $'],
        ['Koordinatenweise: $', 'Coordenada a coordenada: $'], ['Koordinatenform: <b>$', 'Equação cartesiana: <b>$'], ['Koordinatenform $', 'Equação cartesiana $'],
        ['$. Einsetzen von $Q(', '$. Substituindo $Q('], ['$: <b>$Q$ liegt nicht in $E$</b>.', '$: <b>$Q$ não pertence a $E$</b>.'], ['$: <b>$Q$ liegt in $E$</b>.', '$: <b>$Q$ pertence a $E$</b>.'],
        ['In der Parameterform gehört $Q$ zu $r = ', 'Na equação vetorial, $Q$ corresponde a $r = '],
        ['$ einsetzen: $', '$, substituindo: $'],
        ['Der Richtungsvektor $\\vec{w}$ darf nicht der Nullvektor sein.', 'O vetor diretor $\\vec{w}$ não pode ser o vetor nulo.'],
        ['Immer wahr: <b>$g$ liegt in $E$</b>.', 'Sempre verdadeiro: <b>$g$ está contida em $E$</b>.'],
        ['Ein Widerspruch: <b>$g$ ist parallel zu $E$</b> und hat keinen Punkt mit ihr gemeinsam.', 'Uma contradição: <b>$g$ é paralela a $E$</b> e não tem nenhum ponto em comum com ele.'],
        ['Genau eine Lösung $t = ', 'Exatamente uma solução $t = '], ['$: <b>Durchstoßpunkt $S(', '$: <b>ponto de interseção $S('],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-5 mathe13lk-pt:
        // book pt-22 mathegy11lk-pt:
        // ebenelim: "Spurpunkte: keine" (a plane through the origin parallel to two axes) - "keine" alone is "não tem" in funktionen.js
        [/(Spurpunkte: )keine(?=<\/p>)/g, '$1nenhum'],
        // ebenelim: "Die Zeilen mit 3, 4 und 6 multiplizieren" - the "und" between the factors
        [/(Die Zeilen mit [^<$]*?) und /g, '$1 e '],
    ]
});
