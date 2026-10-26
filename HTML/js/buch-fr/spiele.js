/* js/buch-fr/spiele.js — French for the widgets of js/buch-spiele.js.
 * Loaded by the French editions right after js/buch-spiele.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/spiele.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('spiele', {
    word: {
        // book fr-6 mathegy10-fr:
        // verteilung (the random variables RV are helpers of the module, reported for every page that loads it)
        'Differenz': 'Écart', 'Anzahl Sechsen': 'Nombre de six',
        'Die 36 Ergebnisse zweier Würfel mit dem Wert der Zufallsgröße': 'Les 36 issues de deux dés avec la valeur de la variable aléatoire',
        '2. Würfel →': '2e dé →',
        // spielstreuung (GAMES: helpers of the module)
        'Münzwette': 'Pari sur une pièce', 'Los': 'Billet de loterie', 'Spiel': 'Jeu', 'Noch einmal spielen': 'Rejouer',
        'Einsatz 1 €. Wappen: 2 € zurück, Zahl: nichts.': 'Mise 1 €. Face : on récupère 2 €, pile : rien.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{10}$ gibt es 10 € zurück, sonst nichts.': 'Mise 1 €. Avec la probabilité $\\tfrac{1}{10}$, on récupère 10 €, sinon rien.',
        'Einsatz 1 €. Mit Wahrscheinlichkeit $\\tfrac{1}{100}$ gibt es 100 € zurück, sonst nichts.': 'Mise 1 €. Avec la probabilité $\\tfrac{1}{100}$, on récupère 100 €, sinon rien.',
        'Runde': 'Partie', 'Kontostand in €': 'Solde en €', 'Kontostände von acht Spielern über hundert Runden': 'Soldes de huit joueurs sur cent parties',
        // fairesspiel ("Ergebnis" as in js/buch-fr/zahlen.js: one French per German word)
        'Beim Schulfest wirft man zwei Würfel. Ein <b>Pasch</b> (zwei gleiche Augenzahlen) bringt den ersten Preis, die <b>Augensumme 7</b> den zweiten, alles andere nichts. Der Einsatz ist in jedem Fall weg.':
            'À la fête de l’école, on lance deux dés. Un <b>double</b> (deux numéros identiques) rapporte le premier prix, la <b>somme 7</b> le deuxième, tout le reste rien. La mise est perdue dans tous les cas.',
        'Einsatz $e$': 'Mise $e$', 'Auszahlung bei Pasch': 'Somme versée pour un double', 'Auszahlung bei Summe 7': 'Somme versée pour la somme 7',
        'Fairen Einsatz einstellen': 'Régler la mise équitable', '1000 Spiele': '1000 parties',
        'Ergebnis': 'Résultat', 'Pasch': 'Double', 'Summe 7': 'Somme 7', 'sonst': 'autre', 'Gewinn $x_i$ in €': 'Gain $x_i$ en €',
        'Lass das Spiel 1000-mal laufen und vergleiche den mittleren Gewinn mit dem Erwartungswert.': 'Fais tourner le jeu 1000 fois et compare le gain moyen à l’espérance.',
        // book fr-15 mathegy8-fr:
    },
    phrase: [
        // book fr-6 mathegy10-fr:
        // verteilung: "$X$ = die Summe der beiden Augenzahlen. Tippe auf ein Feld oder einen Wert."
        ['die Summe der beiden Augenzahlen', 'la somme des deux numéros'],
        ['der Abstand der beiden Augenzahlen, die größere minus die kleinere', 'l’écart entre les deux numéros, le plus grand moins le plus petit'],
        ['die größere der beiden Augenzahlen', 'le plus grand des deux numéros'], ['wie viele der beiden Würfel eine Sechs zeigen', 'le nombre de dés qui montrent un six'],
        ['. Tippe auf ein Feld oder einen Wert.', '. Touche une case ou une valeur.'],
        [' der 36 gleich wahrscheinlichen Ergebnisse gehören dazu. Alle Wahrscheinlichkeiten zusammen ergeben $1$.', ' des 36 issues équiprobables y correspondent. Toutes les probabilités ensemble ont pour somme $1$.'],
        // spielstreuung
        ['Gewinn $X$ pro Spiel: $', 'Gain $X$ par partie : $'], ['$ € mit $', '$ € avec $'], [' = 0$: Das Spiel ist <b>fair</b>.', ' = 0$ : le jeu est <b>équitable</b>.'],
        ['Standardabweichung $\\sigma = \\sqrt{V(X)} \\approx ', 'Écart type $\\sigma = \\sqrt{V(X)} \\approx '],
        ['$ € · gestrichelt: $\\pm\\sigma\\sqrt{n}$, nach 100 Runden $\\pm ', '$ € · en pointillés : $\\pm\\sigma\\sqrt{n}$, après 100 parties $\\pm '],
        ['Kontostände nach 100 Runden: ', 'Soldes après 100 parties : '],
        [' €. Gleicher Erwartungswert, aber je größer $\\sigma$, desto weiter liegen Gewinner und Verlierer auseinander: <b>$\\sigma$ misst das Risiko.</b>',
            ' €. Même espérance, mais plus $\\sigma$ est grand, plus les gagnants et les perdants sont éloignés : <b>$\\sigma$ mesure le risque.</b>'],
        // fairesspiel
        ['Das Spiel ist <b>fair</b>.', 'Le jeu est <b>équitable</b>.'],
        ['Für die Spielerin oder den Spieler <b>ungünstig</b>: Die Klasse verdient im Mittel ', 'Pour la joueuse ou le joueur, le jeu est <b>défavorable</b> : la classe gagne en moyenne '],
        ['Für die Spielerin oder den Spieler <b>günstig</b>: Die Klasse verliert im Mittel ', 'Pour la joueuse ou le joueur, le jeu est <b>favorable</b> : la classe perd en moyenne '],
        [' € pro Spiel.', ' € par partie.'], [' Fair wäre der Einsatz $e = \\tfrac{', ' La mise équitable serait $e = \\tfrac{'],
        ['Gespielt: ', 'Parties jouées : '], [' Spiele, mittlerer Gewinn <b>', ', gain moyen <b>'], [' €</b> pro Spiel (Erwartungswert ', ' €</b> par partie (espérance '],
        // book fr-15 mathegy8-fr:
    ],
    rule: [
        // book fr-6 mathegy10-fr:
        // book fr-15 mathegy8-fr:
    ]
});
