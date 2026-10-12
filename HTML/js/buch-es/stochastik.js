/* js/buch-es/stochastik.js — Spanish for the widgets of js/buch-stochastik.js.
 * Loaded by the Spanish editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('stochastik', {
    word: {
        // book es-1 mathe11-es: baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen
        'Baumdiagramm': 'Diagrama de árbol', 'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Diagrama de árbol: dos bolas sin reemplazamiento',
        'Rot': 'Rojo', 'eine rote Kugel weniger': 'una bola roja menos', 'eine rote Kugel mehr': 'una bola roja más',
        'eine blaue Kugel weniger': 'una bola azul menos', 'eine blaue Kugel mehr': 'una bola azul más',
        'Anzahl der Züge': 'Número de extracciones', '2 Züge': '2 extracciones', '3 Züge': '3 extracciones', 'Ziehen': 'Extracción',
        'ohne Zurücklegen': 'sin reemplazamiento', 'mit Zurücklegen': 'con reemplazamiento', 'Urne:': 'Urna:',
        'Ereignis wählen:': 'Elige un suceso:', 'Ereignis': 'Suceso', 'Baumdiagramm der Urne': 'Diagrama de árbol de la urna', 'unmöglich': 'imposible',
        'beide Rot': 'las dos rojas', 'alle Rot': 'todas rojas', 'genau einmal Rot': 'exactamente una roja', 'mindestens einmal Rot': 'al menos una roja',
        'keinmal Rot': 'ninguna roja', 'beide gleich': 'las dos iguales', 'alle gleich': 'todas iguales', 'leeren': 'borrar',
        'Anteil der Erkrankten': 'Proporción de enfermos', 'Test erkennt Kranke (Sensitivität)': 'El test detecta a los enfermos (sensibilidad)',
        'Test erkennt Gesunde (Spezifität)': 'El test detecta a los sanos (especificidad)', 'Darstellung': 'Representación',
        'Anzahlen (von 10 000)': 'Cantidades (de 10 000)', 'Wahrscheinlichkeiten': 'Probabilidades', 'Anzahlen': 'Cantidades',
        'positiv $T^+$': 'positivo $T^+$', 'negativ $T^-$': 'negativo $T^-$', 'krank $K$': 'enfermo $E$', 'gesund $\\overline{K}$': 'sano $\\overline{E}$',
        'krank': 'enfermo', 'gesund': 'sano', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Diagrama de árbol: enfermo o sano, después el resultado del test',
        'Neue Tafel': 'Nueva tabla', 'A und B': 'A y B', 'A und nicht B': 'A y no B', 'nicht A und B': 'no A y B', 'nicht A und nicht B': 'no A y no B',
        'A gesamt': 'total de A', 'nicht A gesamt': 'total de no A', 'B gesamt': 'total de B', 'nicht B gesamt': 'total de no B', 'gesamt': 'total',
        // "Würfel" (dado / cubo) is never a global word: the simulator's button is a rule below
        'Münze': 'Moneda', 'Zwei Würfel': 'Dos dados', 'Urne': 'Urna', 'Wappen': 'cara', 'Sechs': 'seis', 'Augensumme 7': 'suma de puntos 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'las dos rojas (3 rojas, 2 azules, sin reemplazamiento)',
        'mindestens eine Sechs in vier Würfen': 'al menos un seis en cuatro lanzamientos', 'Zufallsversuch': 'Experimento aleatorio', 'Durchführen:': 'Realizar:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Frecuencia relativa en función del número de ensayos',
        'VERSUCHE n': 'ENSAYOS n', 'TREFFER': 'ÉXITOS', 'REL. HÄUFIGKEIT': 'FREC. RELATIVA', 'WAHRSCHEINLICHKEIT': 'PROBABILIDAD',
        'Noch kein Versuch – starte mit +1 oder +10.': 'Todavía no hay ningún ensayo – empieza con +1 o +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.':
            'Detrás de una puerta hay un coche y detrás de cada una de las otras dos, una cabra. Elige una puerta.',
        'Neues Spiel': 'Nueva partida', '1000 Spiele vom Rechner spielen lassen': 'Que el ordenador juegue 1000 partidas',
        'Strategie': 'Estrategia', 'Spiele': 'Partidas', 'Autos': 'Coches', 'Gewinnquote': 'Tasa de éxito',
        'du: bleiben': 'tú: te quedas', 'du: wechseln': 'tú: cambias', 'Rechner: bleiben': 'ordenador: se queda', 'Rechner: wechseln': 'ordenador: cambia',
    },
    phrase: [
        // book es-1 mathe11-es: baum, schnelltest, vierfeld-trainer, simulation, ziegen
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Haz clic en los extremos de las ramas (a la derecha del árbol) o elige arriba un suceso. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'El libro te calcula paso a paso las reglas de las ramas.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>1.ª regla de las ramas</b> (multiplicar a lo largo de la rama):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>2.ª regla de las ramas</b> (sumar las ramas):'],
        ['aber nur <b>', 'pero solo <b>'], ['</b> davon sind wirklich krank.', '</b> de ellas están realmente enfermas.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Proporción de enfermos entre los que dan positivo: '],
        [' alles richtig', ' todo correcto'], ['Ereignis: <b>', 'Suceso: <b>'], ['Zuletzt: ', 'Últimos: '],
        ['TÜR', 'PUERTA'], ['Tür', 'Puerta'], ['Gewonnen – das Auto! ', '¡Has ganado el coche! '], ['Leider eine Ziege. ', 'Lo siento, una cabra. '],
        ['Du hast gewechselt.', 'Has cambiado.'], ['Du bist geblieben.', 'Te has quedado.'],
    ],
    rule: [
        // book es-1 mathe11-es
        // letters in the trees and in the simulator: R/B (rot/blau) → R/A (rojo/azul), K/G (krank/gesund) → E/S (enfermo/sano),
        // coin W/Z (Wappen/Zahl) → C/X (cara/cruz); the chapter text lb1 uses the same letters
        [/(font-weight:700">)B(<\/t(?:ext|span)>)/g, '$1A$2'],
        [/(font-weight:700">)K(<\/text>)/g, '$1E$2'], [/(font-weight:700">)G(<\/text>)/g, '$1S$2'],
        [/(<text x="10" y="20">)([RB]{2,3})(<\/text>)/g, (m, a, k, b) => a + k.replace(/B/g, 'A') + b],
        [/\\text\{([RB]{2,3})\}/g, (m, k) => '\\text{' + k.replace(/B/g, 'A') + '}'],
        [/(margin-right:10px">)([RB]{2})</g, (m, a, k) => a + k.replace(/B/g, 'A') + '<'],
        [/(margin-right:10px">)W</g, '$1C<'], [/(margin-right:10px">)Z</g, '$1X<'],
        // simulator: the dice button ("Würfel" has two meanings, so no global word)
        [/(data-x="wuerfel">)Würfel</g, '$1Dado<'],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 de $2 correctas'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'De 10 000 personas, <b>' + n + '</b> dan positivo, '],
        // goats (before the header rule "^Zu " of js/buch-es.js)
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'El presentador sabe dónde está el coche y abre la puerta $1: una cabra. ¿Te quedas o cambias?'],
        [/Bei Tür (\d) bleiben/g, 'Quedarme con la puerta $1'], [/Zu Tür (\d) wechseln/g, 'Cambiar a la puerta $1'],
    ]
});
