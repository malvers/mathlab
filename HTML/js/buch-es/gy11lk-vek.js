/* js/buch-es/gy11lk-vek.js — Spanish for the widgets of js/buch-gy11lk-vek.js.
 * Loaded by the Spanish editions right after js/buch-gy11lk-vek.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy11lk-vek', {
    word: {
        // book es mathegy11lk-es (Turing)
        // koordsys3d
        'Zylinderkoordinaten': 'Coordenadas cilíndricas', 'Kugelkoordinaten': 'Coordenadas esféricas', 'Welches Koordinatensystem?': '¿Qué sistema de coordenadas?',
        'Ein Punkt im Raum mit seinen Zylinder- oder Kugelkoordinaten': 'Un punto del espacio con sus coordenadas cilíndricas o esféricas',
        'Abstand $r$ zur $z$-Achse': 'Distancia $r$ al eje $z$', 'Winkel $\\varphi$': 'Ángulo $\\varphi$', 'Höhe $z$': 'Altura $z$',
        'Abstand $r$ zum Ursprung': 'Distancia $r$ al origen', 'Länge $\\varphi$': 'Longitud $\\varphi$', 'Breite $\\vartheta$': 'Latitud $\\vartheta$',
        // linabh3d
        'unabhängig': 'independientes', 'komplanar': 'coplanarios', 'zwei parallel': 'dos paralelos',
        'Drei Vektoren vom Ursprung aus und die Ebene, die zwei von ihnen aufspannen': 'Tres vectores desde el origen y el plano que generan dos de ellos',
        // varignon3d
        'eben': 'plano', 'räumlich': 'alabeado', 'nicht konvex': 'no convexo',
        'Ein Viereck im Raum mit dem Parallelogramm seiner Seitenmitten': 'Un cuadrilátero en el espacio con el paralelogramo de los puntos medios de sus lados',
        // ebenelim
        'Koordinatenform': 'Ecuación general', 'Gerade und Ebene': 'Recta y plano',
        'Eine Ebene im Raum mit ihrem Spurdreieck': 'Un plano en el espacio con su triángulo de trazas',
        // ebenenlage
        'Dach': 'Tejado', 'Spurgerade': 'Recta de traza', 'Zwei Ebenen im Raum und ihre Schnittgerade': 'Dos planos en el espacio y su recta de intersección',

    },
    phrase: [
        // book es mathegy11lk-es (Turing)
        // koordsys3d
        ['Zylinderkoordinaten $(', 'Coordenadas cilíndricas $('], ['Kugelkoordinaten $(', 'Coordenadas esféricas $('], ['Kartesisch: $P(', 'Cartesianas: $P('],
        ['Alle Punkte mit demselben $r$ liegen auf einem Zylindermantel um die $z$-Achse.', 'Todos los puntos con el mismo $r$ están en una superficie cilíndrica alrededor del eje $z$.'],
        [' mit der Länge $\\varphi$ und der Breite $\\vartheta$', ', con la longitud $\\varphi$ y la latitud $\\vartheta$'],
        ['Alle Punkte mit demselben $r$ liegen auf einer Kugel um den Ursprung; auf der Erde sind $\\varphi$ und $\\vartheta$ die geografische Länge und Breite.',
            'Todos los puntos con el mismo $r$ están en una esfera de centro el origen; en la Tierra, $\\varphi$ y $\\vartheta$ son la longitud y la latitud geográficas.'],
        // linabh3d
        ['$ als Gleichungssystem: $', '$ como sistema de ecuaciones: $'],
        ['Das Gauß-Verfahren führt auf die Einheitsmatrix: Nur $r = s = t = 0$ löst das System. Die Vektoren sind <b>linear unabhängig</b>, sie liegen nicht in einer Ebene.',
            'El método de Gauss lleva a la matriz identidad: solo $r = s = t = 0$ resuelve el sistema. Los vectores son <b>linealmente independientes</b>; no están en un mismo plano.'],
        ['Das System hat auch Lösungen mit Zahlen, die nicht alle null sind', 'El sistema también tiene soluciones con números que no son todos cero'], [', denn $', ', porque $'],
        ['. Die Vektoren sind <b>linear abhängig</b>: ', '. Los vectores son <b>linealmente dependientes</b>: '],
        ['$\\vec{c}$ liegt in der Ebene von $\\vec{a}$ und $\\vec{b}$ (komplanar).', '$\\vec{c}$ está en el plano de $\\vec{a}$ y $\\vec{b}$ (coplanarios).'],
        ['$\\vec{a}$ und $\\vec{b}$ sind parallel (kollinear).', '$\\vec{a}$ y $\\vec{b}$ son paralelos (colineales).'],
        // varignon3d
        ['Gleiche Vektoren: Zwei Gegenseiten des Mittenvierecks sind parallel und gleich lang, beide halb so lang wie die Diagonale $AC$. Ebenso $',
            'Vectores iguales: dos lados opuestos del cuadrilátero de los puntos medios son paralelos y de igual longitud, ambos la mitad de la diagonal $AC$. Del mismo modo, $'],
        ['Die Ecken $A$, $B$, $C$, $D$ liegen in einer Ebene.', 'Los vértices $A$, $B$, $C$, $D$ están en un mismo plano.'],
        ['Die Ecken liegen <b>nicht</b> in einer Ebene: ein räumliches Viereck.', 'Los vértices <b>no</b> están en un mismo plano: un cuadrilátero alabeado.'],
        [' Das Mittenviereck ist trotzdem immer ein ebenes <b>Parallelogramm</b>.', ' Aun así, el cuadrilátero de los puntos medios es siempre un <b>paralelogramo</b> plano.'],
        // ebenelim
        ['$\\vec{u}$ und $\\vec{v}$ sind linear abhängig. Sie spannen keine Ebene auf.', '$\\vec{u}$ y $\\vec{v}$ son linealmente dependientes. No generan ningún plano.'],
        ['Koordinatenweise: $', 'Coordenada a coordenada: $'], ['Die Zeilen mit ', 'Multiplica las filas por '],
        [' multiplizieren und addieren. Dann fallen die Parameter weg: $r$-Glieder $', ' y súmalas. Así desaparecen los parámetros: términos en $r$: $'], ['$s$-Glieder $', 'términos en $s$: $'],
        ['Koordinatenform: ', 'Ecuación general: '], ['Koordinatenform $', 'Ecuación general $'], ['$. Einsetzen von $Q(', '$. Sustituyendo $Q('],
        ['$: <b>$Q$ liegt nicht in $E$</b>.', '$: <b>$Q$ no está en $E$</b>.'],
        ['In der Parameterform gehört $Q$ zu $r = ', 'En la forma paramétrica, a $Q$ le corresponden $r = '], ['$ und $s = ', '$ y $s = '],
        ['Der Richtungsvektor $\\vec{w}$ darf nicht der Nullvektor sein.', 'El vector director $\\vec{w}$ no puede ser el vector nulo.'],
        ['$, also $', '$, es decir, $'],
        ['Immer wahr: <b>$g$ liegt in $E$</b>.', 'Siempre se cumple: <b>$g$ está contenida en $E$</b>.'],
        ['Ein Widerspruch: <b>$g$ ist parallel zu $E$</b> und hat keinen Punkt mit ihr gemeinsam.', 'Una contradicción: <b>$g$ es paralela a $E$</b> y no tiene ningún punto en común con él.'],
        ['Genau eine Lösung $t = ', 'Exactamente una solución $t = '], ['$: <b>Durchstoßpunkt $S(', '$: <b>punto de intersección $S('],
        // ebenenlage, and the inputs of its rows "E₁: [a] x + [b] y + [c] z = [d]"
        ['Koeffizient von x', 'coeficiente de x'], ['Koeffizient von y', 'coeficiente de y'], ['Koeffizient von z', 'coeficiente de z'], ['rechte Seite', 'segundo miembro'],
        ['Mindestens ein Koeffizient von $x$, $y$, $z$ muss ungleich null sein, sonst ist es keine Ebene.', 'Al menos un coeficiente de $x$, $y$, $z$ tiene que ser distinto de cero; si no, no es un plano.'],
        ['Die linke Seite von $E_2$ ist das ', 'El primer miembro de $E_2$ es '], ['-Fache der linken Seite von $E_1$. Rechts: $', ' veces el primer miembro de $E_1$. A la derecha: $'],
        ['Beide Gleichungen sind gleichwertig: <b>identisch</b>.', 'Las dos ecuaciones son equivalentes: <b>coincidentes</b>.'],
        ['Das System hat keine Lösung: <b>parallel</b> und verschieden.', 'El sistema no tiene solución: <b>paralelos</b> y distintos.'],
        ['Die linken Seiten sind keine Vielfachen: Die Ebenen <b>schneiden</b> sich in einer Geraden. Freie Variable $',
            'Los primeros miembros no son múltiplos: los planos se <b>cortan</b> en una recta. Variable libre $'],
        [' = t$, übrig bleibt für $', ' = t$; queda para $'], ['Gelöst: $', 'Resuelto: $'], ['Schnittgerade: ', 'Recta de intersección: '],
        ['. Ganzzahliger Richtungsvektor: $', '. Vector director con números enteros: $'],

    ],
    rule: [
        // book es mathegy11lk-es (Turing)
        // koordsys3d: (r;\,\varphi;\,z) = (3;\,50^\circ;\,2{,}5) → (r, \varphi, z) = (3;\, 50^\circ;\, 2{,}5) - semicolons only with a decimal comma
        [/\(([^()$;]+);\\,([^()$;]+);\\,([^()$;]+)\)/g, (m, a, b, c) => /\{,\}/.test(a + b + c) ? '(' + a + ';\\, ' + b + ';\\, ' + c + ')' : '(' + a + ', ' + b + ', ' + c + ')'],
        // ebenelim: "Die Zeilen mit 1, 2 und 3 multiplizieren" (the pieces do the rest)
        [/(Die Zeilen mit [^<$]*?) und /g, '$1 y '],
        // ebenelim: "$g\colon \vec{x} = …$ in $x + y = 2$ einsetzen: " → "Sustituimos $g\colon …$ en $x + y = 2$: "
        [/(\$g\\colon \\vec\{x\} = [^$]*\$) in (\$[^$]*\$) einsetzen: /g, 'Sustituimos $1 en $2: '],
        // ebenenlage: "übrig bleibt für $x$ und $y$" → "x e y" (Spanish "e" before the sound i)
        [/(übrig bleibt für \$[xyz]\$) und \$([xyz])\$/g, (m, a, v) => a + (v === 'y' ? ' e $' : ' y $') + v + '$'],

    ]
});
