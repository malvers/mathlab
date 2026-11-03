/* js/buch-sw/analysis.js — Swahili for the widgets of js/buch-analysis.js.
 * Loaded by the Swahili editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw2-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('analysis', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // the pictures of the optimisation problems (optimieren): box, tin, pen at a wall ("Zaun an der Mauer" in funktionen: "kando ya ukuta")
        'Karton mit ausgeschnittenen Ecken': 'Boksi lenye pembe zilizokatwa', 'Zylindrische Dose': 'Mkebe wa silinda',
        'Gehege an einer Mauer': 'Zizi kando ya ukuta', 'Mauer': 'Ukuta',
        // book sw-2 mathe12-sw:
        // the cover of the start page (BGY 12)
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Picha ya jalada: mkunjo wenye tanjenti kwenye nukta ya mgeuko na kinyambuo chake, mgawanyo wa binomia na vekta katika nafasi',
        // grenzwert (lb2-1): Grenzwert = kikomo, waagerechte / senkrechte Asymptote = asimptoti mlalo / wima, Loch = tundu
        'Annäherung, Schritt $k$': 'Kukaribia, hatua $k$', 'Graph mit Annäherung an einen Grenzwert': 'Grafu inayokaribia kikomo',
        'Annäherung:': 'Kukaribia:', 'Richtung': 'Mwelekeo', '$x$ links': '$x$ kushoto', '$x$ rechts': '$x$ kulia',
        // sekante, ableitungsgraph (lb2-2): Sekante = sekanti, Tangente = tanjenti, Steigung = mwinamo, f′ = "f dashi"
        'Abstand $h$ von $P$ zu $Q$': 'Umbali $h$ kutoka $P$ hadi $Q$', 'Tangente zeigen': 'Onyesha tanjenti', 'Tangente ausblenden': 'Ficha tanjenti',
        'Sekante durch P und Q nähert sich der Tangente': 'Sekanti inayopita P na Q inakaribia tanjenti',
        'Ganzen Graphen von f′ zeigen': 'Onyesha grafu nzima ya f′', 'Spur löschen': 'Futa alama',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.':
            'Juu: f pamoja na tanjenti. Vuta nukta P. Chini: kila mwinamo wa tanjenti unakuwa nukta ya grafu ya f′.',
        'Graph von f mit Tangente': 'Grafu ya f pamoja na tanjenti', 'Graph der Ableitung f Strich': 'Grafu ya kinyambuo f dashi',
        // ableiten (lb2-3): ableiten = kunyambua ("Nyambua"), Potenzen = vipeo, Wurzeln = vipeuo, Produkte = mazao
        'Potenzen': 'Vipeo', 'Summen': 'Jumla', 'Wurzeln und Brüche': 'Vipeuo na sehemu', 'eˣ und sin x': 'eˣ na sin x', 'Produkte': 'Mazao',
        'Gemischt': 'Mchanganyiko', 'Aufgabenart': 'Aina ya zoezi', 'z. B. 6x^2 - 2 oder cos x': 'k.m. 6x^2 - 2 au cos x', 'Lösung': 'Suluhisho',
        'Neue Aufgabe': 'Zoezi jipya',
        // kurve (lb2-4): Hochpunkt / Tiefpunkt / Wendepunkt / Sattelpunkt = nukta ya juu J / nukta ya chini C / nukta ya mgeuko M /
        // nukta tandiko; the letters on the canvas by the rule below
        '$a$ (vor $x^3$)': '$a$ (ya $x^3$)', '$b$ (vor $x^2$)': '$b$ (ya $x^2$)', '$c$ (vor $x$)': '$c$ (ya $x$)', 'Zeige auch:': 'Onyesha pia:',
        'nur f': 'f peke yake', 'f′ und f″': 'f′ na f″', 'Ableitungen zeigen': 'Onyesha vinyambuo',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Grafu ya fanksheni ya daraja la tatu yenye nukta za kugeuka na nukta ya mgeuko',
        'Intervall': 'Muda', 'konstant': 'haibadiliki', 'steigt ↗': 'inaongezeka ↗', 'fällt ↘': 'inapungua ↘',
        // tangente (lb2-5): Normale = normali, Berührpunkt = nukta ya mguso
        'Tangente und Normale an einen Graphen': 'Tanjenti na normali ya grafu',
        // steckbrief, optimieren (lb2-6): Steckbrief = fanksheni kutokana na masharti, Ansatz = fanksheni ya kuanzia, Zielfunktion =
        // fanksheni lengwa, Nebenbedingung = sharti la ziada; the surface of the tin is A (Kenyan), not O (rule below)
        'Parabel durch 3 Punkte': 'Parabola kupitia nukta 3', 'Kubisch: Extrempunkt + 2 Punkte': 'Daraja la tatu: nukta ya kugeuka + nukta 2',
        'Kubisch: Wendepunkt mit Tangente + Punkt': 'Daraja la tatu: nukta ya mgeuko na tanjenti + nukta', 'Bedingungen': 'Masharti',
        'Steigung im Wendepunkt $m$': 'Mwinamo kwenye nukta ya mgeuko $m$', 'Funktion aus Bedingungen': 'Fanksheni kutokana na masharti',
        'Schachtel': 'Boksi', 'Dose': 'Mkebe', 'Zaun an der Mauer': 'Uzio kando ya ukuta', 'Problem': 'Tatizo', 'Zielfunktion': 'Fanksheni lengwa',
        'Lösung mit der Ableitung': 'Suluhisho kwa kinyambuo', 'x in cm': 'x kwa cm', 'V in cm³': 'V kwa cm³', 'r in cm': 'r kwa cm',
        'O in cm²': 'A kwa cm²', 'x in m': 'x kwa m', 'A in m²': 'A kwa m²',
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // the derivative tasks (TASKS of ableiten): ableiten = kunyambua, die Ableitung = kinyambuo, Potenz-/Summen-/Faktor-/Produktregel =
        // kanuni ya kipeo / ya jumla / ya kizidishi / ya zao, Kettenregel = kanuni ya mnyororo
        ['$ und $', '$ na $'], ['$, und $', '$, na $'], [', also $', ', kwa hiyo $'],
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Kanuni ya kipeo $(x^n)\' = n\\,x^{n-1}$ na kanuni ya kizidishi: kizidishi kinabaki kama kilivyo.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Kanuni ya jumla: kila kipengele kinanyambuliwa peke yake. Kipengele kisichobadilika kinatoweka.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: ', 'Kanuni ya kipeo inatumika pia kwa vipeo vya namba wiano: '],
        ['Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.', 'Kanuni ya jumla; $\\mathrm{e}^x$ inabaki $\\mathrm{e}^x$ inaponyambuliwa.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit ', 'Kanuni ya zao $(u \\cdot v)\' = u\'v + uv\'$ ambapo '], ['Produktregel mit $u = ', 'Kanuni ya zao ambapo $u = '],
        // the antiderivative tasks (TASKS of integrieren): Stammfunktion = fanksheni asili (antiderivative), integrieren = kuunganisha
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, ', 'Kanuni ya kipeo kinyume: ongeza kipeo kwa 1, kisha gawanya kwa kipeo kipya, '],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.',
            'Kanuni ya jumla na ya kizidishi: kila kipengele kinaunganishwa peke yake, kizidishi kinabaki kama kilivyo. Namba isiyobadilika $a$ ina fanksheni asili $ax$.'],
        ['$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$: kipeo $\\tfrac12 + 1 = \\tfrac32$, kugawanya kwa $\\tfrac32$ maana yake ni kuzidisha kwa $\\tfrac23$.'],
        ['$: Exponent $-1$, durch $-1$ teilen, also $', '$: kipeo $-1$, gawanya kwa $-1$, kwa hiyo $'],
        ['$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$: kipeo $\\tfrac12$, kugawanya kwa $\\tfrac12$ maana yake ni kuzidisha kwa 2.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: ', 'Kanuni ya kipeo inatumika kwa kila kipeo $r \\neq -1$: '],
        ['$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$ ni kinyambuo chake chenyewe, kwa hiyo pia ni fanksheni asili yake yenyewe.'],
        ['Die Lücke der Potenzregel: ', 'Pengo la kanuni ya kipeo: '], ['. Für $x > 0$ reicht $\\ln x$.', '. Kwa $x > 0$, $\\ln x$ inatosha.'],
        ['Lineare Verkettung: ', 'Fanksheni ya ndani ya mstari: '], ['. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', '. Uthibitisho: kanuni ya mnyororo inatoa kizidishi $a$, na $\\tfrac1a$ inakifuta.'],
        ['$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$: kwanza fanksheni asili ya $\\sin$, kisha gawanya kwa kinyambuo cha ndani $a$.'],
        ['$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$: kanuni ya kipeo kwa mabano, kisha gawanya kwa kinyambuo cha ndani.'],
        // book sw-2 mathe12-sw:
        // grenzwert
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$',
            'inaelekea $-\\infty$ upande wa kushoto na $+\\infty$ upande wa kulia: hakuna kikomo, asimptoti wima $x = 1$'],
        ['wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert', 'inakua bila kikomo: $f(x) \\to \\infty$, hakuna kikomo'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $',
            'Kwenye nukta $x = 1$, $f$ haijafasiliwa, na grafu ina tundu hapo. Hata hivyo kikomo kipo: kurahisisha kunatoa $'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', 'Kwenye $x = 0$, $f$ haijafasiliwa. Hata hivyo thamani zinakaribia 1 kadiri tunavyotaka.'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'Grafu inayumba kuzunguka mhimili wa $x$, na mayumbo yanazidi kuwa madogo.'],
        ['$ für $', '$ kwa $'], ['Waagerechte Asymptote: $y = ', 'Asimptoti mlalo: $y = '],
        // sekante, ableitungsgraph
        ['$ mit $h = ', '$ ambapo $h = '], ['Sekantensteigung (Differenzenquotient): $', 'Mwinamo wa sekanti (uwiano wa tofauti): $'],
        ['Tangentensteigung: $f', 'Mwinamo wa tanjenti: $f'], ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· Kwa $h \\to 0$ sekanti inakuwa tanjenti.'],
        ['· Mach $h$ kleiner.', '· Punguza $h$.'], ['$ · Steigung in $P', '$ · Mwinamo kwenye $P'],
        // ableiten
        ['Leite ab: $f(x) = ', 'Nyambua: $f(x) = '], ['Das kann ich nicht lesen. Schreibe zum Beispiel ', 'Siwezi kusoma hili. Andika kwa mfano '],
        ['<b>Richtig!</b>', '<b>Sahihi!</b>'], ['Noch nicht. Tipp: ', 'Bado. Dokezo: '],
        // kurve
        ['Hochpunkt $H', 'Nukta ya juu $J'], ['Tiefpunkt $T', 'Nukta ya chini $C'], ['keine Extrempunkte', 'Hakuna nukta za kugeuka'],
        [' · Sattelpunkt bei $x = ', ' · nukta tandiko kwenye $x = '], ['Wendepunkt $W', 'Nukta ya mgeuko $M'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am kleinsten.', '$: hapo $f\'\'(x) = 0$ na mwinamo ni mdogo kabisa.'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am größten.', '$: hapo $f\'\'(x) = 0$ na mwinamo ni mkubwa kabisa.'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', 'Kwa $a = 0$, $f$ ni parabola (au mstari) isiyo na nukta ya mgeuko.'],
        // tangente
        ['$ · Berührpunkt $P', '$ · nukta ya mguso $P'], ['Tangente: $', 'Tanjenti: $'],
        ['Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $', 'Normali (wima kwa tanjenti, $m_n = -\\tfrac{1}{m_t}$): $'],
        // steckbrief
        ['Lösung: $f(x) = ', 'Suluhisho: $f(x) = '], ['Ansatz: $f(x) = ', 'Fanksheni ya kuanzia: $f(x) = '], ['Probe: $', 'Uthibitisho: $'],
        ['Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.', 'Tahadhari: kwenye $K$, $f\'\'(x) = 0$; hiyo ni nukta tandiko, si nukta ya kugeuka.'],
        ['< 0$, also ein Hochpunkt.', '< 0$, kwa hiyo ni nukta ya juu.'], ['> 0$, also ein Tiefpunkt.', '> 0$, kwa hiyo ni nukta ya chini.'],
        ['Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?',
            'Kwa masharti haya mfumo wa milinganyo hauna suluhisho moja tu. Je, kuna nukta mbili zenye $x$ ile ile?'],
        // optimieren (the engine has already written "2 \times 15")
        ['Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?',
            'Kutoka kwenye karatasi ngumu ya cm 30 × cm 20, kwenye pembe zake miraba yenye upande $x$ inakatwa na kingo zinakunjwa juu. Kwa $x$ ipi ujazo wa boksi lisilo na mfuniko ni mkubwa kabisa?'],
        ['Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?',
            'Mkebe wa silinda unapaswa kubeba lita 1 ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Kwa nusukipenyo $r$ kipi unahitaji bati kidogo kabisa?'],
        ['Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?',
            'Kwa uzio wa m 60 zizi la mstatili linapaswa kuzungushiwa kando ya ukuta. Ukuta ni upande mmoja. Eneo linaweza kuwa kubwa kiasi gani kabisa?'],
        ['Bei $', 'Kwa $'], ['$ ergibt $', '$ inatoa $'], ['$ mit $', '$, ambapo $'], ['(Maximum)', '(upeo wa juu)'], ['(Minimum)', '(upeo wa chini)'],
        [' Die zweite Lösung $x \\approx ', ' Suluhisho la pili $x \\approx '], ['$ liegt außerhalb von $0 < x < 10$.', '$ liko nje ya $0 < x < 10$.'],
        [' Dann ist $h = ', ' Hapo $h = '], ['\\,\\text{cm} = 2r$: Die beste Dose ist so hoch wie breit.', '\\,\\text{cm} = 2r$: mkebe bora zaidi una kimo sawa na upana wake.'],
        [' Die Seite parallel zur Mauer ist dann $60 - 2 \\times 15 = 30\\,\\text{m}$ lang.', ' Hapo upande ulio sambamba na ukuta una urefu wa $60 - 2 \\times 15 = 30\\,\\text{m}$.'],
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
    ],
    rule: [
        // book sw-2 mathe12-sw:
        // ableiten: "· 3 von 5 gelöst" → "· umetatua 3 kati ya 5"
        [/ · (\d+) von (\d+) gelöst/g, ' · umetatua $1 kati ya $2'],
        // kurve, schar, steckbrief: the letters drawn alone on the canvas, H/T/W (Hochpunkt, Tiefpunkt, Wendepunkt) → J/C/M (juu,
        // chini, mgeuko); only a string that is nothing but the letter (no widget sentence is), the sentences have their phrases
        [/^H$/, 'J'], [/^T$/, 'C'], [/^W$/, 'M'],
        // steckbrief: the extreme point E on the canvas → K (nukta ya kugeuka), as H/T/W above
        [/^E$/, 'K'],
        // optimieren: the surface of the tin is A in Kenyan schools (German O): "$O(r)", "$O'(r)", "$O \approx"
        [/(^|\$)O('?\(r\)| \\approx)/g, '$1A$2'],
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
    ]
});
