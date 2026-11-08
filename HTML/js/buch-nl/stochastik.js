/* js/buch-nl/stochastik.js — Dutch for the widgets of js/buch-stochastik.js.
 * Loaded by the Dutch editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the nl0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('stochastik', {
    word: {
        // nl0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        'Baumdiagramm': 'Kansboom',
        'gerade · Vielfaches von 3': 'even · veelvoud van 3',
        'Primzahl · größer als 6': 'priemgetal · groter dan 6',
        'unvereinbar': 'disjunct',
        // book nl-1 mathe11-nl:
        // baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen
        'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Kansboom: twee knikkers zonder terugleggen',
        'Rot': 'Rood', 'eine rote Kugel weniger': 'één rode knikker minder', 'eine rote Kugel mehr': 'één rode knikker meer',
        'eine blaue Kugel weniger': 'één blauwe knikker minder', 'eine blaue Kugel mehr': 'één blauwe knikker meer',
        'Anzahl der Züge': 'Aantal trekkingen', '2 Züge': '2 trekkingen', '3 Züge': '3 trekkingen', 'Ziehen': 'Trekken',
        'ohne Zurücklegen': 'zonder terugleggen', 'mit Zurücklegen': 'met terugleggen', 'Urne:': 'Vaas:',
        'Ereignis wählen:': 'Kies een gebeurtenis:', 'Ereignis': 'Gebeurtenis', 'Baumdiagramm der Urne': 'Kansboom van de vaas', 'unmöglich': 'onmogelijk',
        'beide Rot': 'beide rood', 'alle Rot': 'alle rood', 'genau einmal Rot': 'precies één keer rood', 'mindestens einmal Rot': 'minstens één keer rood',
        'keinmal Rot': 'geen enkele keer rood', 'beide gleich': 'beide gelijk', 'alle gleich': 'alle gelijk', 'leeren': 'wissen',
        'Anteil der Erkrankten': 'Aandeel zieken', 'Test erkennt Kranke (Sensitivität)': 'Test herkent zieken (sensitiviteit)',
        'Test erkennt Gesunde (Spezifität)': 'Test herkent gezonden (specificiteit)', 'Darstellung': 'Weergave',
        'Anzahlen (von 10 000)': 'Aantallen (van 10.000)', 'Wahrscheinlichkeiten': 'Kansen', 'Anzahlen': 'Aantallen',
        'positiv $T^+$': 'positief $T^+$', 'negativ $T^-$': 'negatief $T^-$', 'krank $K$': 'ziek $Z$', 'gesund $\\overline{K}$': 'gezond $\\overline{Z}$',
        'krank': 'ziek', 'gesund': 'gezond', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Kansboom: ziek of gezond, dan de testuitslag',
        'Neue Tafel': 'Nieuwe tabel', 'A und B': 'A en B', 'A und nicht B': 'A en niet B', 'nicht A und B': 'niet A en B', 'nicht A und nicht B': 'niet A en niet B',
        'A gesamt': 'totaal A', 'nicht A gesamt': 'totaal niet A', 'B gesamt': 'totaal B', 'nicht B gesamt': 'totaal niet B', 'gesamt': 'totaal',
        'Münze': 'Munt', 'Würfel': 'Dobbelsteen', 'Zwei Würfel': 'Twee dobbelstenen', 'Urne': 'Vaas', 'Wappen': 'kop', 'Sechs': 'zes', 'Augensumme 7': 'som van de ogen 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'beide rood (3 rood, 2 blauw, zonder terugleggen)',
        'mindestens eine Sechs in vier Würfen': 'minstens één zes in vier worpen', 'Zufallsversuch': 'Kansexperiment', 'Durchführen:': 'Uitvoeren:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Relatieve frequentie afhankelijk van het aantal herhalingen',
        'VERSUCHE n': 'HERHALINGEN n', 'TREFFER': 'TREFFERS', 'REL. HÄUFIGKEIT': 'REL. FREQUENTIE', 'WAHRSCHEINLICHKEIT': 'KANS',
        'Noch kein Versuch – starte mit +1 oder +10.': 'Nog geen herhaling – begin met +1 of +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.':
            'Achter één deur staat een auto, achter de twee andere elk een geit. Kies een deur.',
        'Neues Spiel': 'Nieuw spel', '1000 Spiele vom Rechner spielen lassen': 'De computer 1000 spellen laten spelen',
        'Strategie': 'Strategie', 'Spiele': 'Spellen', 'Autos': 'Auto\u2019s', 'Gewinnquote': 'Winstpercentage',
        'du: bleiben': 'jij: blijven', 'du: wechseln': 'jij: wisselen', 'Rechner: bleiben': 'computer: blijven', 'Rechner: wechseln': 'computer: wisselen',
        // book nl-2 mathe12-nl:
    },
    phrase: [
        // nl0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        // venn: what the operation says, inside the sentence "$A \cup B$ (…) $= …$"
        ['$A$ oder $B$ (oder beide)', '$A$ of $B$ (of allebei)'],
        ['$A$ und $B$', '$A$ en $B$'],
        ['nicht $A$', 'niet $A$'],
        ['weder $A$ noch $B$', 'noch $A$ noch $B$'],
        ['nicht $A$ und nicht $B$', 'niet $A$ en niet $B$'],
        ['nicht beide', 'niet allebei'],
        ['nicht $A$ oder nicht $B$', 'niet $A$ of niet $B$'],
        // book nl-1 mathe11-nl:
        // baum, schnelltest, vierfeld-trainer, simulation, ziegen
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Klik op de eindpunten van de routes (rechts in de boom) of kies hierboven een gebeurtenis. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'Het boek rekent de productregel en de somregel voor je voor.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>Productregel</b> (vermenigvuldigen langs de route):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>Somregel</b> (routes optellen):'],
        ['aber nur <b>', 'maar slechts <b>'], ['</b> davon sind wirklich krank.', '</b> daarvan zijn echt ziek.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Aandeel zieken onder de positief geteste mensen: '],
        [' alles richtig', ' alles goed'], ['Ereignis: <b>', 'Gebeurtenis: <b>'], ['Zuletzt: ', 'Laatste: '],
        ['TÜR', 'DEUR'], ['Tür', 'Deur'], ['Gewonnen – das Auto! ', 'Gewonnen – de auto! '], ['Leider eine Ziege. ', 'Helaas een geit. '],
        ['Du hast gewechselt.', 'Je hebt gewisseld.'], ['Du bist geblieben.', 'Je bent gebleven.'],
        // book nl-2 mathe12-nl:
    ],
    rule: [
        // nl0: notation of the module, for every book
        // book nl-1 mathe11-nl:
        // the letters in the trees: R/B (rood/blauw) stay; K/G (krank/gesund) → Z/G (ziek/gezond)
        [/(font-weight:700">)K(<\/text>)/g, '$1Z$2'],
        // simulator: coin W/Z (Wappen/Zahl) → K/M (kop/munt)
        [/(margin-right:10px">)W</g, '$1K<'], [/(margin-right:10px">)Z</g, '$1M<'],
        // four-field trainer: "3 von 5 richtig" → "3 van 5 goed"
        [/(\d+) von (\d+) richtig/g, '$1 van $2 goed'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10[.\u00a0\u202f ]000 Personen – /g, (m, n) => 'Positief getest worden <b>' + n + '</b> van 10.000 mensen – '],
        // goats (before the header rule "^Zu " of js/buch-nl.js)
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'De presentator weet waar de auto staat, en opent deur $1: een geit. Blijf je of wissel je?'],
        [/Bei Tür (\d) bleiben/g, 'Bij deur $1 blijven'], [/Zu Tür (\d) wechseln/g, 'Naar deur $1 wisselen'],
        // book nl-2 mathe12-nl:
    ]
});
