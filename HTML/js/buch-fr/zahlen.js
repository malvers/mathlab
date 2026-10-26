/* js/buch-fr/zahlen.js — French for the widgets of js/buch-zahlen.js.
 * Loaded by the French editions right after js/buch-zahlen.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, which have already turned
 *           every \mid into \,;\, - before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Package FR0 (22.10.2026) put in only the cover of the start page and the block comments. Five books are translated at
 * the same time, each has its own comment line in word, phrase and rule - write only right below your book's line,
 * every entry ending with a comma, so the books merge without a conflict. The Italian file js/buch-it/zahlen.js shows
 * which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('zahlen', {
    word: {
        // fr0: the cover of the start page (FOS 11 mathefos11)
        'Titelbild: zwei Geraden mit Schnittpunkt, eine Parabel, eine Funktion dritten Grades mit drei Nullstellen und ein Säulendiagramm':
            'Couverture : deux droites et leur point d’intersection, une parabole, une fonction du troisième degré à trois zéros et un diagramme en colonnes',
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // zahlenbereiche
        'Kleinster Bereich:': 'Plus petit ensemble :',
        'Nächste Zahl': 'Nombre suivant',
        'DIE ZAHL': 'LE NOMBRE',
        'Richtig!': 'Correct !',
        'In welchen <b>kleinsten</b> Zahlenbereich gehört sie? Tippe auf einen Knopf oder ins Bild.': 'Dans quel <b>plus petit</b> ensemble de nombres se trouve-t-il ? Touche un bouton ou la figure.',
        'Zahlenbereiche als ineinander liegende Mengen: N in Z in Q in R': 'Ensembles de nombres emboîtés : N dans Z dans Q dans R',
        // komplex
        'Rechenart': 'Opération',
        'Gaußsche Zahlenebene mit zwei komplexen Zahlen als Pfeile': 'Plan complexe avec deux nombres complexes représentés par des flèches',
        'Ergebnis': 'Résultat',
        // schaltung (the circuits are helpers of the module: CIRCUITS)
        'Reihe (UND)': 'Série (ET)',
        'Parallel (ODER)': 'Parallèle (OU)',
        'Wechselschaltung': 'Va-et-vient',
        'Schaltung': 'Circuit',
        'Schalter $a$ umlegen': 'Basculer l’interrupteur $a$',
        'Schalter $b$ umlegen': 'Basculer l’interrupteur $b$',
        'Schalter a': 'Interrupteur a',
        'Schalter b': 'Interrupteur b',
        'Quelle': 'Source',
        'Stromkreis mit zwei Schaltern und einer Lampe': 'Circuit électrique avec deux interrupteurs et une lampe',
        'Die Lampe leuchtet nur, wenn <b>beide</b> Schalter geschlossen sind.': 'La lampe ne s’allume que si <b>les deux</b> interrupteurs sont fermés.',
        'Die Lampe leuchtet, wenn <b>mindestens einer</b> der Schalter geschlossen ist.': 'La lampe s’allume si <b>au moins un</b> des interrupteurs est fermé.',
        'Treppenhaus: Jeder der beiden Schalter kann die Lampe ein- und ausschalten. Sie leuchtet, wenn beide Schalter <b>gleich</b> stehen.': 'Cage d’escalier : chacun des deux interrupteurs peut allumer et éteindre la lampe. Elle s’allume quand les deux interrupteurs sont dans la <b>même</b> position.',
        // book fr-5 mathefos12-fr:
        // book fr-6 mathegy10-fr:
        // book fr-16 mathegy9-fr:
    },
    phrase: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // zahlenbereiche: why a number belongs to its set (helpers NUMS, SET_NAME) - "le nombre" is masculine
        ['eine natürliche Zahl', 'un entier naturel'],
        ['eine negative ganze Zahl', 'un entier relatif négatif'],
        ['ein Bruch, der keine ganze Zahl ist', 'une fraction qui n’est pas un nombre entier'],
        ['periodisch: ', 'périodique : '],
        ['$ ist irrational: nicht abbrechend und nicht periodisch', '$ est irrationnel : son écriture décimale n’est ni finie ni périodique'],
        ['$ ist irrational', '$ est irrationnel'],
        [' ist irrational', ' est irrationnel'],
        ['nicht abbrechend und nicht periodisch, also irrational', 'écriture décimale ni finie ni périodique, donc irrationnel'],
        ['$5$ ist keine Quadratzahl, also ist $\\sqrt{5}$ irrational', '$5$ n’est pas un carré parfait, donc $\\sqrt{5}$ est irrationnel'],
        ['der Betrag: ', 'la valeur absolue : '],
        ['natürliche Zahlen', 'entiers naturels'],
        ['ganze Zahlen', 'entiers relatifs'],
        ['rationale Zahlen', 'nombres rationnels'],
        ['reelle Zahlen', 'nombres réels'],
        // zahlenbereiche: the answers
        ['$ liegt in $', '$ appartient à $'],
        ['. Damit liegt sie auch in jedem größeren Bereich.', '. Il appartient donc aussi à tout ensemble plus grand.'],
        ['Sie liegt zwar in $', 'Il appartient bien à $'],
        ['$, aber es gibt einen <b>kleineren</b> Bereich.', '$, mais il existe un ensemble <b>plus petit</b>.'],
        ['Nein, $', 'Non, $'],
        ['$ gehört nicht zu den ', '$ n’appartient pas à l’ensemble des '],
        ['. Tipp: ', '. Indice : '],
        [' · Richtig: ', ' · bonnes réponses : '],
        ['Richtig: ', 'Bonnes réponses : '],
        ['Lässt sie sich als Bruch schreiben?', 'Peut-il s’écrire sous forme de fraction ?'],
        ['Rechne sie zuerst aus.', 'Calcule-le d’abord.'],
        // komplex
        ['\\text{(an der reellen Achse gespiegelt)}', '\\text{(symétrique par rapport à l’axe réel)}'],
        [' · Betrag $', ' · module $'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird aus dem letzten Summanden eine reelle Zahl. Die Beträge multiplizieren sich, die Winkel addieren sich.', 'Comme $\\mathrm{i}^2 = -1$, le dernier terme devient un nombre réel. Les modules se multiplient, les angles s’additionnent.'],
        // schaltung: L is the lamp
        ['Term: $L = ', 'Expression : $L = '],
        ['$ · jetzt: $a = ', '$ · maintenant : $a = '],
        ['$ → Lampe <b>', '$ → lampe <b>'],
        // book fr-5 mathefos12-fr:
        // book fr-6 mathegy10-fr:
        // book fr-16 mathegy9-fr:
    ],
    rule: [
        // book fr-1 mathe11-fr:
        // book fr-2 mathe12-fr:
        // book fr-3 mathe13-fr:
        // book fr-4 mathefos11-fr:
        // zahlenbereiche: "Richtig: 3 von 5"; the colon after the set gets its no-break space
        [/Richtig: (\d+) von (\d+)/g, 'Bonnes réponses : $1 sur $2'],
        [/(\$\\mathbb\{[NZQR]\}\$): /g, '$1 : '],
        // schaltung: "Lampe <b>an</b>" / "<b>aus</b>" (the rules run before the pieces)
        [/Lampe <b>an<\/b>/g, 'Lampe <b>allumée</b>'], [/Lampe <b>aus<\/b>/g, 'Lampe <b>éteinte</b>'],
        // book fr-5 mathefos12-fr:
        // book fr-6 mathegy10-fr:
        // book fr-16 mathegy9-fr:
    ]
});
