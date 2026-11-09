/* js/buch-nl/analysis.js — Dutch for the widgets of js/buch-analysis.js.
 * Loaded by the Dutch editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package nl2-prep (08.11.2026): the module's helpers (outside every widget) go below the nl0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('analysis', {
    word: {
        // nl0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // book nl-2 mathe12-nl:
        // the cover of the start page (BGY 12)
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Omslag: kromme met buigraaklijn en afgeleide, binomiale verdeling en een vector in de ruimte',
        // the pictures of the optimisation problems (optimieren): box, tin, pen at a wall
        'Karton mit ausgeschnittenen Ecken': 'Karton met uitgeknipte hoeken', 'Zylindrische Dose': 'Cilindervormig blik',
        'Gehege an einer Mauer': 'Ren langs een muur', 'Mauer': 'Muur',
        // grenzwert (lb2-1): Grenzwert = limiet, waagerechte / senkrechte Asymptote = horizontale / verticale asymptoot, Loch = gat (perforatie)
        'Annäherung, Schritt $k$': 'Nadering, stap $k$', 'Graph mit Annäherung an einen Grenzwert': 'Grafiek die een limiet nadert',
        'Annäherung:': 'Nadering:', 'Richtung': 'Richting',
        // sekante, ableitungsgraph (lb2-2): Sekante = koorde, Tangente = raaklijn, Steigung = helling, f′ = "f-accent"
        'Abstand $h$ von $P$ zu $Q$': 'Afstand $h$ van $P$ tot $Q$', 'Tangente zeigen': 'Raaklijn tonen', 'Tangente ausblenden': 'Raaklijn verbergen',
        'Sekante durch P und Q nähert sich der Tangente': 'Koorde door P en Q nadert de raaklijn',
        'Ganzen Graphen von f′ zeigen': 'Hele grafiek van f′ tonen', 'Spur löschen': 'Spoor wissen',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.':
            'Boven: f met raaklijn. Sleep het punt P. Onder: elke helling van de raaklijn wordt een punt van de grafiek van f′.',
        'Graph von f mit Tangente': 'Grafiek van f met raaklijn', 'Graph der Ableitung f Strich': 'Grafiek van de afgeleide f-accent',
        // ableiten (lb2-3): ableiten = differentiëren, Potenzen = machten, Wurzeln = wortels, Produkte = producten
        'Potenzen': 'Machten', 'Summen': 'Sommen', 'Wurzeln und Brüche': 'Wortels en breuken', 'eˣ und sin x': 'eˣ en sin x', 'Produkte': 'Producten',
        'Gemischt': 'Gemengd', 'Aufgabenart': 'Soort opgave', 'z. B. 6x^2 - 2 oder cos x': 'bijv. 6x^2 - 2 of cos x', 'Lösung': 'Oplossing',
        'Neue Aufgabe': 'Nieuwe opgave',
        // kurve (lb2-4): Hochpunkt / Tiefpunkt / Wendepunkt / Sattelpunkt = maximum H (hoogste punt) / minimum L (laagste punt) /
        // buigpunt B / zadelpunt; the letters on the canvas by the rule below
        '$a$ (vor $x^3$)': '$a$ (bij $x^3$)', '$b$ (vor $x^2$)': '$b$ (bij $x^2$)', '$c$ (vor $x$)': '$c$ (bij $x$)', 'Zeige auch:': 'Toon ook:',
        'nur f': 'alleen f', 'f′ und f″': 'f′ en f″', 'Ableitungen zeigen': 'Afgeleiden tonen',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Grafiek van een derdegraadsfunctie met toppen en buigpunt',
        'Intervall': 'Interval', 'konstant': 'constant', 'steigt ↗': 'stijgt ↗', 'fällt ↘': 'daalt ↘',
        // tangente (lb2-5): Normale = normaal, Berührpunkt = raakpunt
        'Tangente und Normale an einen Graphen': 'Raaklijn en normaal aan een grafiek',
        // steckbrief, optimieren (lb2-6): Steckbrief = functie uit voorwaarden, Ansatz = aanzet, Zielfunktion = doelfunctie,
        // Nebenbedingung = nevenvoorwaarde; the surface of the tin is O (oppervlakte) as in German
        'Parabel durch 3 Punkte': 'Parabool door 3 punten', 'Kubisch: Extrempunkt + 2 Punkte': 'Derdegraads: top + 2 punten',
        'Kubisch: Wendepunkt mit Tangente + Punkt': 'Derdegraads: buigpunt met raaklijn + punt', 'Bedingungen': 'Voorwaarden',
        'Steigung im Wendepunkt $m$': 'Helling in het buigpunt $m$', 'Funktion aus Bedingungen': 'Functie uit voorwaarden',
        'Schachtel': 'Doos', 'Dose': 'Blik', 'Problem': 'Probleem', 'Zielfunktion': 'Doelfunctie',
        'Lösung mit der Ableitung': 'Oplossing met de afgeleide',
        // book nl-3 mathe13-nl:
    },
    phrase: [
        // nl0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // book nl-2 mathe12-nl:
        // the derivative tasks (TASKS of ableiten): ableiten = differentiëren, die Ableitung = de afgeleide, Potenz-/Summen-/Faktor-/
        // Produktregel = machtsregel / somregel / regel van de constante factor / productregel, Kettenregel = kettingregel
        ['$ und $', '$ en $'], ['$, und $', '$, en $'], [', also $', ', dus $'],
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Machtsregel $(x^n)\' = n\\,x^{n-1}$ en regel van de constante factor: de factor blijft staan.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Somregel: elke term wordt apart gedifferentieerd. Een constante term valt weg.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: ', 'De machtsregel geldt ook voor rationale exponenten: '],
        ['Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.', 'Somregel; $\\mathrm{e}^x$ blijft bij het differentiëren $\\mathrm{e}^x$.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit ', 'Productregel $(u \\cdot v)\' = u\'v + uv\'$ met '], ['Produktregel mit $u = ', 'Productregel met $u = '],
        // the antiderivative tasks (TASKS of integrieren, class 13): Stammfunktion = primitieve, integrieren = primitiveren
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, ', 'Machtsregel omgekeerd: exponent met 1 verhogen, delen door de nieuwe exponent, '],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.',
            'Somregel en regel van de constante factor: elke term wordt apart geprimitiveerd, een factor blijft staan. Een constante $a$ heeft de primitieve $ax$.'],
        ['$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$: exponent $\\tfrac12 + 1 = \\tfrac32$, delen door $\\tfrac32$ betekent vermenigvuldigen met $\\tfrac23$.'],
        ['$: Exponent $-1$, durch $-1$ teilen, also $', '$: exponent $-1$, delen door $-1$, dus $'],
        ['$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$: exponent $\\tfrac12$, delen door $\\tfrac12$ betekent verdubbelen.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: ', 'De machtsregel geldt voor elke exponent $r \\neq -1$: '],
        ['$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$ is zijn eigen afgeleide, dus ook zijn eigen primitieve.'],
        ['Die Lücke der Potenzregel: ', 'Het gat in de machtsregel: '], ['. Für $x > 0$ reicht $\\ln x$.', '. Voor $x > 0$ is $\\ln x$ genoeg.'],
        ['Lineare Verkettung: ', 'Lineaire samenstelling: '], ['. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', '. Controle: de kettingregel levert de factor $a$, $\\tfrac1a$ heft die op.'],
        ['$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$: eerst de primitieve van $\\sin$, dan delen door de afgeleide $a$ van de binnenste functie.'],
        ['$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$: machtsregel voor de haakjes, dan delen door de afgeleide van de binnenste functie.'],
        // grenzwert (the pole sentences follow "$f(x)$ ")
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$',
            'gaat links naar $-\\infty$ en rechts naar $+\\infty$: geen limiet, verticale asymptoot $x = 1$'],
        ['wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert', 'groeit onbeperkt: $f(x) \\to \\infty$, geen limiet'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $',
            'Bij $x = 1$ is $f$ niet gedefinieerd, de grafiek heeft daar een gat. De limiet bestaat toch: vereenvoudigen geeft $'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', 'Bij $x = 0$ is $f$ niet gedefinieerd. De waarden komen toch willekeurig dicht bij 1.'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'De grafiek slingert om de $x$-as, de uitslagen worden steeds kleiner.'],
        ['$ für $', '$ voor $'], ['Waagerechte Asymptote: $y = ', 'Horizontale asymptoot: $y = '],
        // sekante, ableitungsgraph
        ['$ mit $h = ', '$ met $h = '], ['Sekantensteigung (Differenzenquotient): $', 'Helling van de koorde (differentiequotiënt): $'],
        ['Tangentensteigung: $f', 'Helling van de raaklijn: $f'], ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· Voor $h \\to 0$ wordt de koorde de raaklijn.'],
        ['· Mach $h$ kleiner.', '· Maak $h$ kleiner.'], ['$ · Steigung in $P', '$ · helling in $P'],
        // ableiten
        ['Leite ab: $f(x) = ', 'Differentieer: $f(x) = '], ['Das kann ich nicht lesen. Schreibe zum Beispiel ', 'Dat kan ik niet lezen. Schrijf bijvoorbeeld '],
        ['<b>Richtig!</b>', '<b>Goed!</b>'], ['Noch nicht. Tipp: ', 'Nog niet. Tip: '],
        // kurve
        ['Hochpunkt $H', 'Maximum $H'], ['Tiefpunkt $T', 'Minimum $L'], ['keine Extrempunkte', 'geen toppen'],
        [' · Sattelpunkt bei $x = ', ' · zadelpunt bij $x = '], ['Wendepunkt $W', 'Buigpunt $B'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am kleinsten.', '$: daar is $f\'\'(x) = 0$ en is de helling het kleinst.'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am größten.', '$: daar is $f\'\'(x) = 0$ en is de helling het grootst.'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', 'Voor $a = 0$ is $f$ een parabool (of een rechte lijn) zonder buigpunt.'],
        // tangente
        ['$ · Berührpunkt $P', '$ · raakpunt $P'], ['Tangente: $', 'Raaklijn: $'],
        ['Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $', 'Normaal (loodrecht op de raaklijn, $m_n = -\\tfrac{1}{m_t}$): $'],
        // steckbrief
        ['Lösung: $f(x) = ', 'Oplossing: $f(x) = '], ['Ansatz: $f(x) = ', 'Aanzet: $f(x) = '], ['Probe: $', 'Controle: $'],
        ['Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.', 'Let op: in $E$ is $f\'\'(x) = 0$, dat is een zadelpunt, geen top.'],
        ['< 0$, also ein Hochpunkt.', '< 0$, dus een maximum.'], ['> 0$, also ein Tiefpunkt.', '> 0$, dus een minimum.'],
        ['Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?',
            'Met deze voorwaarden heeft het stelsel vergelijkingen geen eenduidige oplossing. Twee punten met dezelfde $x$?'],
        // optimieren
        ['Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?',
            'Uit een stuk karton van 30 cm × 20 cm worden in de hoeken vierkanten met zijde $x$ geknipt en de randen worden omhooggevouwen. Voor welke $x$ is de inhoud van de open doos het grootst?'],
        ['Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?',
            'Een cilindervormig blik moet 1 liter bevatten ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Bij welke straal $r$ heb je het minste blik nodig?'],
        ['Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?',
            'Met 60 m hek wordt langs een muur een rechthoekige ren afgezet. De muur vormt één zijde. Hoe groot kan de oppervlakte hoogstens worden?'],
        ['Bei $', 'Bij $'], ['$ ergibt $', '$ geeft $'], ['$ mit $', '$ met $'], ['(Maximum)', '(maximum)'], ['(Minimum)', '(minimum)'],
        [' Die zweite Lösung $x \\approx ', ' De tweede oplossing $x \\approx '], ['$ liegt außerhalb von $0 < x < 10$.', '$ ligt buiten $0 < x < 10$.'],
        [' Dann ist $h = ', ' Dan is $h = '], ['\\,\\text{cm} = 2r$: Die beste Dose ist so hoch wie breit.', '\\,\\text{cm} = 2r$: het beste blik is even hoog als breed.'],
        [' Die Seite parallel zur Mauer ist dann $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.', ' De zijde evenwijdig aan de muur is dan $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.'],
        // book nl-3 mathe13-nl:
    ],
    rule: [
        // nl0: notation of the module, for every book
        // book nl-2 mathe12-nl:
        // ableiten: "· 3 von 5 gelöst" → "· 3 van 5 opgelost"
        [/ · (\d+) von (\d+) gelöst/g, ' · $1 van $2 opgelost'],
        // kurve, steckbrief: the letters drawn alone on the canvas, T/W (Tiefpunkt, Wendepunkt) → L/B (laagste punt, buigpunt); H
        // (hoogste punt) and E (extreem) stay; only a string that is nothing but the letter (no widget sentence is)
        [/^T$/, 'L'], [/^W$/, 'B'],
        // book nl-3 mathe13-nl:
    ]
});
