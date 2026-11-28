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
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-5 mathe13lk-pt:
        // book pt-22 mathegy11lk-pt:
    ]
});
