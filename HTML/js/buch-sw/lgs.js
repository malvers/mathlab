/* js/buch-sw/lgs.js — Swahili for the widgets of js/buch-lgs.js.
 * Loaded by the Swahili editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * A line of the system (German "Zeile") is "mstari" (I, II, III), as in the chapter text lb4; in a matrix the rows and
 * columns are "safu mlalo" and "safu wima".
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 */
window.BuchSW && BuchSW.add('lgs', {
    word: {
        // book sw-1 mathe11-sw:
        // gauss, geraden, matrizen, pagerank
        'Ausführen': 'Tekeleza', 'Nächster Schritt': 'Hatua inayofuata', 'Neues LGS': 'Mfumo mpya',
        'Zeile + k · Zeile': 'mstari + k · mstari', 'Zeile · k': 'mstari · k', 'tauschen': 'badilishana', 'Zielzeile': 'Mstari lengwa', 'zweite Zeile': 'Mstari wa pili', 'Faktor k': 'Kizidishi k',
        'Ziel I': 'lengo I', 'Ziel II': 'lengo II', 'Ziel III': 'lengo III', 'mit I': 'na I', 'mit II': 'na II', 'mit III': 'na III',
        'eine Lösung': 'suluhisho moja', 'keine Lösung': 'hakuna suluhisho', 'unendlich viele': 'mengi bila kikomo', 'Zwei Geraden': 'Mistari miwili',
        'mit $r =$': 'kwa $r =$', 'Neue Matrizen': 'Matriki mpya', 'Wähle eine Rechnung.': 'Chagua hesabu.',
        '1 Schritt': 'Hatua 1', '10 Schritte': 'Hatua 10', 'Vier Webseiten und ihre Links': 'Kurasa nne za wavuti na viungo vyake',
    },
    phrase: [
        // book sw-1 mathe11-sw:
        // gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Imekamilika: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Umbo la ngazi limefikiwa. Sasa unaweza kuweka thamani kuanzia chini kwenda juu, au kuendelea kubadilisha kwa “Hatua inayofuata” (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Chagua hatua ya kubadilisha na uitekeleze, au usaidiwe na “Hatua inayofuata”.'],
        ['Wähle zwei verschiedene Zeilen.', 'Chagua mistari miwili tofauti.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Andika namba ya $k$, k.m. -2 au 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Kuzidisha kwa $0$ si hatua inayohifadhi masuluhisho.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Kujumlisha mstari kwenye mstari huo huo kunabadilisha seti ya masuluhisho. Chagua mstari mwingine.'],
        ['Gleichung I ist fest: ', 'Mlinganyo I haubadiliki: '], ['. Verändere Gleichung II: ', '. Badilisha mlinganyo II: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'Mlinganyo II ni $0 = 0$, haubani chochote.'], ['Gleichung II lautet $0 = ', 'Mlinganyo II ni $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$: mgongano, hakuna suluhisho.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Suluhisho moja tu</b>: mistari inakatana kwenye $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Masuluhisho mengi bila kikomo</b>: milinganyo yote miwili inaeleza mstari ule ule.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Hakuna suluhisho</b>: mistari ni sambamba na tofauti.'],
        ['Gleiche Stellen werden addiert.', 'Elementi zilizo katika nafasi moja zinajumlishwa.'], ['Gleiche Stellen werden subtrahiert.', 'Elementi zilizo katika nafasi moja zinatolewa.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Kila elementi inazidishwa kwa $r$.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Safu mlalo zinakuwa safu wima: matriki ya $2 \\times 3$ inakuwa matriki ya $3 \\times 2$.'],
        ['Summe: $', 'Jumla: $'],
    ],
    rule: [
        // book sw-1 mathe11-sw:
        // gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'Katika safu wima ya $1 hakuna pivoti tena: mfumo hauna suluhisho, au una masuluhisho mengi bila kikomo.'],
        [/Schritt (\d+):/g, 'Hatua ya $1:'],
    ]
});
