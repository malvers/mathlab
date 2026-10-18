/* js/buch-it/lgs.js — Italian for the widgets of js/buch-lgs.js.
 * Loaded by the Italian editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the block comments; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/lgs.js shows which German
 * strings the widgets write.
 */
window.BuchIT && BuchIT.add('lgs', {
    word: {
        // book it-1 mathe11-it:
        // gauss, geraden, matrizen, pagerank
        'Ausführen': 'Applica', 'Nächster Schritt': 'Passo successivo', 'Neues LGS': 'Nuovo sistema',
        'Zeile + k · Zeile': 'riga + k · riga', 'Zeile · k': 'riga · k', 'tauschen': 'scambia', 'Zielzeile': 'Riga di destinazione', 'zweite Zeile': 'Seconda riga', 'Faktor k': 'Fattore k',
        'Ziel I': 'destinazione I', 'Ziel II': 'destinazione II', 'Ziel III': 'destinazione III', 'mit I': 'con I', 'mit II': 'con II', 'mit III': 'con III',
        'eine Lösung': 'una soluzione', 'keine Lösung': 'nessuna soluzione', 'unendlich viele': 'infinite', 'Zwei Geraden': 'Due rette',
        'mit $r =$': 'con $r =$', 'Neue Matrizen': 'Nuove matrici', 'Wähle eine Rechnung.': 'Scegli un’operazione.',
        '1 Schritt': '1 passo', '10 Schritte': '10 passi', 'Vier Webseiten und ihre Links': 'Quattro pagine web e i loro link',
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Fatto: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Forma a scala raggiunta. Ora puoi sostituire dal basso verso l’alto o continuare a trasformare con «Passo successivo» (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Scegli una trasformazione e applicala, oppure fatti aiutare da «Passo successivo».'],
        ['Wähle zwei verschiedene Zeilen.', 'Scegli due righe diverse.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Inserisci un numero per $k$, per es. -2 o 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Moltiplicare per $0$ non è una trasformazione equivalente.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Sommare una riga a se stessa cambia l’insieme delle soluzioni. Scegli un’altra riga.'],
        ['Gleichung I ist fest: ', 'L’equazione I è fissa: '], ['. Verändere Gleichung II: ', '. Modifica l’equazione II: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'L’equazione II dice $0 = 0$: non impone nessuna condizione.'], ['Gleichung II lautet $0 = ', 'L’equazione II dice $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$: una contraddizione, nessuna soluzione.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Esattamente una soluzione</b>: le rette si intersecano in $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Infinite soluzioni</b>: le due equazioni descrivono la stessa retta.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Nessuna soluzione</b>: le rette sono parallele e distinte.'],
        ['Gleiche Stellen werden addiert.', 'Si sommano gli elementi nella stessa posizione.'], ['Gleiche Stellen werden subtrahiert.', 'Si sottraggono gli elementi nella stessa posizione.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Ogni elemento viene moltiplicato per $r$.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Le righe diventano colonne: una matrice $2 \\times 3$ diventa una $3 \\times 2$.'],
        ['Summe: $', 'Somma: $'],
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'Nella colonna $1 non c’è più un pivot: il sistema non ha soluzioni oppure ne ha infinite.'],
        [/Schritt (\d+):/g, 'Passo $1:'],
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
    ]
});
