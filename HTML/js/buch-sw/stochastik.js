/* js/buch-sw/stochastik.js — Swahili for the widgets of js/buch-stochastik.js.
 * Loaded by the Swahili editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * The letters come from Swahili words, as in the chapter text lb1: balls N/B (nyekundu/bluu, German R/B), the rapid test
 * M/Z (mgonjwa/mzima, German K/G, the complement of M is M̄), the coin K/M (kichwa/mkia, heads/tails, German W/Z).
 * Dice are "dadu", one die "dadu" too; the urn is a bag, "mfuko", as in Kenyan exercises; drawing "kuchomoa".
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 */
window.BuchSW && BuchSW.add('stochastik', {
    word: {
        // sw0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        'Baumdiagramm': 'Mchoro wa mti',
        'gerade · Vielfaches von 3': 'shufwa · kigawe cha 3',
        'Primzahl · größer als 6': 'namba tasa · kubwa kuliko 6',
        'unvereinbar': 'hayawezi kutokea pamoja',
        // book sw-1 mathe11-sw:
        // baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen
        'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Mchoro wa mti: mipira miwili bila kurudisha',
        'Rot': 'Nyekundu', 'eine rote Kugel weniger': 'mpira mmoja mwekundu pungufu', 'eine rote Kugel mehr': 'mpira mmoja mwekundu zaidi',
        'eine blaue Kugel weniger': 'mpira mmoja wa bluu pungufu', 'eine blaue Kugel mehr': 'mpira mmoja wa bluu zaidi',
        'Anzahl der Züge': 'Idadi ya kuchomoa', '2 Züge': 'Mara 2', '3 Züge': 'Mara 3', 'Ziehen': 'Chomoa',
        'ohne Zurücklegen': 'bila kurudisha', 'mit Zurücklegen': 'kwa kurudisha', 'Urne:': 'Mfuko:',
        'Ereignis wählen:': 'Chagua tukio:', 'Ereignis': 'Tukio', 'Baumdiagramm der Urne': 'Mchoro wa mti wa mfuko', 'unmöglich': 'haiwezekani',
        'beide Rot': 'yote miwili myekundu', 'alle Rot': 'yote myekundu', 'genau einmal Rot': 'mwekundu mara moja tu', 'mindestens einmal Rot': 'mwekundu angalau mara moja',
        'keinmal Rot': 'hakuna mwekundu', 'beide gleich': 'yote miwili rangi moja', 'alle gleich': 'yote rangi moja', 'leeren': 'futa',
        'Anteil der Erkrankten': 'Sehemu ya wagonjwa', 'Test erkennt Kranke (Sensitivität)': 'Kipimo kinatambua wagonjwa (unyeti)',
        'Test erkennt Gesunde (Spezifität)': 'Kipimo kinatambua wazima (umahususi)', 'Darstellung': 'Uwakilishi',
        'Anzahlen (von 10 000)': 'Idadi (kati ya 10,000)', 'Wahrscheinlichkeiten': 'Uwezekano', 'Anzahlen': 'Idadi',
        'positiv $T^+$': 'chanya $T^+$', 'negativ $T^-$': 'hasi $T^-$', 'krank $K$': 'mgonjwa $M$', 'gesund $\\overline{K}$': 'mzima $\\overline{M}$',
        'krank': 'mgonjwa', 'gesund': 'mzima', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Mchoro wa mti: mgonjwa au mzima, kisha jibu la kipimo',
        'Neue Tafel': 'Jedwali jipya', 'A und B': 'A na B', 'A und nicht B': 'A na si B', 'nicht A und B': 'si A na B', 'nicht A und nicht B': 'si A na si B',
        'A gesamt': 'jumla ya A', 'nicht A gesamt': 'jumla ya si A', 'B gesamt': 'jumla ya B', 'nicht B gesamt': 'jumla ya si B', 'gesamt': 'jumla',
        'Münze': 'Sarafu', 'Würfel': 'Dadu', 'Zwei Würfel': 'Dadu mbili', 'Urne': 'Mfuko', 'Wappen': 'kichwa', 'Sechs': 'sita', 'Augensumme 7': 'jumla ya alama ni 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'yote miwili myekundu (3 myekundu, 2 ya bluu, bila kurudisha)',
        'mindestens eine Sechs in vier Würfen': 'angalau sita moja katika mirusho minne', 'Zufallsversuch': 'Jaribio la nasibu', 'Durchführen:': 'Fanya:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Marudio ya uwiano kulingana na idadi ya majaribio',
        'VERSUCHE n': 'MAJARIBIO n', 'TREFFER': 'MAFANIKIO', 'REL. HÄUFIGKEIT': 'MARUDIO YA UWIANO', 'WAHRSCHEINLICHKEIT': 'UWEZEKANO',
        'Noch kein Versuch – starte mit +1 oder +10.': 'Bado hakuna jaribio – anza na +1 au +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.':
            'Nyuma ya mlango mmoja kuna gari, nyuma ya kila mmoja wa ile miwili mingine kuna mbuzi. Chagua mlango.',
        'Neues Spiel': 'Mchezo mpya', '1000 Spiele vom Rechner spielen lassen': 'Acha kompyuta icheze michezo 1000',
        'Strategie': 'Mkakati', 'Spiele': 'Michezo', 'Autos': 'Magari', 'Gewinnquote': 'Kiwango cha ushindi',
        'du: bleiben': 'wewe: baki', 'du: wechseln': 'wewe: badili', 'Rechner: bleiben': 'kompyuta: baki', 'Rechner: wechseln': 'kompyuta: badili',
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // histo-hero (the picture at the top of lb4-1 and lb4-2)
        'Histogramm einer Binomialverteilung': 'Histogramu ya mgawanyo wa binomia',
        'Histogramm einer Wahrscheinlichkeitsverteilung': 'Histogramu ya mgawanyo wa uwezekano',
        // stichprobe
        'Anteil in der Grundgesamtheit $p$': 'Uwiano katika kundi zima $p$', 'Stichprobenumfang $n$': 'Ukubwa wa sampuli $n$',
        'Stichproben ziehen:': 'Chomoa sampuli:', 'Noch keine Stichprobe gezogen.': 'Bado hakuna sampuli iliyochomolewa.',
        'Verteilung der relativen Häufigkeiten vieler Stichproben': 'Mgawanyo wa marudio ya uwiano ya sampuli nyingi',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        // venn: what the operation says, inside the sentence "$A \cup B$ (…) $= …$"
        ['$A$ oder $B$ (oder beide)', '$A$ au $B$ (au yote mawili)'],
        ['$A$ und $B$', '$A$ na $B$'],
        ['nicht $A$', 'si $A$'],
        ['weder $A$ noch $B$', 'wala $A$ wala $B$'],
        ['nicht $A$ und nicht $B$', 'si $A$ na si $B$'],
        ['nicht beide', 'si yote mawili'],
        ['nicht $A$ oder nicht $B$', 'si $A$ au si $B$'],
        // book sw-1 mathe11-sw:
        // baum, schnelltest, vierfeld-trainer, simulation, ziegen
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Bofya ncha za njia (upande wa kulia wa mti) au chagua tukio hapo juu. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'Kitabu kitakuonyesha hesabu kwa kanuni za njia.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>Kanuni ya 1 ya njia</b> (zidisha kufuata njia):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>Kanuni ya 2 ya njia</b> (jumlisha njia):'],
        ['aber nur <b>', 'lakini <b>'], ['</b> davon sind wirklich krank.', '</b> tu kati yao ndio wagonjwa kweli.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Sehemu ya wagonjwa kati ya waliopimwa chanya: '],
        [' alles richtig', ' yote sahihi'], ['Ereignis: <b>', 'Tukio: <b>'], ['Zuletzt: ', 'Ya mwisho: '],
        ['TÜR', 'MLANGO'], ['Tür', 'Mlango'], ['Gewonnen – das Auto! ', 'Umeshinda – gari! '], ['Leider eine Ziege. ', 'Pole, ni mbuzi. '],
        ['Du hast gewechselt.', 'Ulibadili.'], ['Du bist geblieben.', 'Ulibaki.'],
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // stichprobe ("120 Stichproben vom Umfang 50" is a rule below)
        [' · letzte: $h = ', ' · ya mwisho: $h = '], ['$ (gold)', '$ (dhahabu)'],
        ['Mittelwert der $h$: $', 'Wastani wa $h$: $'], ['$ · Standardabweichung der $h$: $', '$ · mkengeuko sanifu wa $h$: $'],
        ['Theorie: $', 'Nadharia: $'], ['$. Viermal so großes $n$ halbiert die Streuung.', '$. $n$ mara nne zaidi inagawanya nusu mtawanyiko.'],
    ],
    rule: [
        // book sw-1 mathe11-sw:
        // the letters in the trees: R/B (rot/blau) → N/B (nyekundu/bluu), K/G (krank/gesund) → M/Z (mgonjwa/mzima)
        [/(font-weight:700">)R(<\/(?:text|tspan)>)/g, '$1N$2'], [/(font-weight:700">)K(<\/text>)/g, '$1M$2'], [/(font-weight:700">)G(<\/text>)/g, '$1Z$2'],
        // baum-hero: the ends of the paths, "RB" as plain text
        [/(<text x="10" y="20">)([RB]{2,3})(<\/text>)/g, (m, a, k, b) => a + k.replace(/R/g, 'N') + b],
        // the paths in the sentence "$P(\text{RB}) = …$"
        [/\\text\{([RB]+)\}/g, (m, k) => '\\text{' + k.replace(/R/g, 'N') + '}'],
        // simulator: coin W/Z → K/M (kichwa/mkia), the urn's results RB → NB
        [/(margin-right:10px">)W</g, '$1K<'], [/(margin-right:10px">)Z</g, '$1M<'],
        [/(margin-right:10px">)([RB]{2})</g, (m, a, k) => a + k.replace(/R/g, 'N') + '<'],
        // four-field trainer: "3 von 5 richtig" → "3 kati ya 5 sahihi"
        [/(\d+) von (\d+) richtig/g, '$1 kati ya $2 sahihi'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'Kati ya watu 10,000, <b>' + n + '</b> wanapimwa chanya – '],
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10,000 Personen – /g, (m, n) => 'Kati ya watu 10,000, <b>' + n + '</b> wanapimwa chanya – '],
        // goats (before the header rule "^Zu " of js/buch-sw.js)
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'Mwendeshaji anajua gari liko wapi, na anafungua mlango $1: mbuzi. Utabaki au utabadili?'],
        [/Bei Tür (\d) bleiben/g, 'Baki kwenye mlango $1'], [/Zu Tür (\d) wechseln/g, 'Hamia mlango $1'],
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // stichprobe: "120 Stichproben vom Umfang 50" → "Sampuli 120 zenye ukubwa 50" (the number goes behind the noun)
        [/(\d[\d,]*) (Stichproben?) vom Umfang (\d+)/g, (m, k, w, n) => 'Sampuli ' + k + (w === 'Stichprobe' ? ' yenye' : ' zenye') + ' ukubwa ' + n],
    ]
});
