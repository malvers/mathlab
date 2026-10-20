/* js/buch-it/gleichungen.js — Italian for the widgets of js/buch-gleichungen.js.
 * Loaded by the Italian editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the block comments; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/gleichungen.js shows which German
 * strings the widgets write.
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 */
window.BuchIT && BuchIT.add('gleichungen', {
    word: {
        // book it-1 mathe11-it:
        // waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'per es. −3 o :4 o −2x', 'Anwenden': 'Applica', 'Neue Gleichung': 'Nuova equazione',
        'Länge $a$': 'Lunghezza $a$', 'Länge $b$': 'Lunghezza $b$', 'Quadrat mit Seitenlänge a + b': 'Quadrato di lato a + b',
        'Zylinder': 'Cilindro', 'Kegel': 'Cono', 'Kugel': 'Sfera', 'Körper': 'Solido', 'Radius $r$ in cm': 'Raggio $r$ in cm',
        'Höhe $h$ in cm': 'Altezza $h$ in cm', 'Skizze des Körpers': 'Schizzo del solido',
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:
        // ungleichung
        'Relationszeichen': 'Segno di disuguaglianza', '$a$ (Zahl vor dem $x$)': '$a$ (numero davanti alla $x$)', '$c$ (rechte Seite)': '$c$ (secondo membro)',
        'durch eine negative Zahl: Das Zeichen dreht sich um!': 'per un numero negativo: il verso si inverte!',
        'Zahlenstrahl mit der Lösungsmenge': 'Retta dei numeri con l’insieme delle soluzioni', 'Probe': 'Prova', 'wahr': 'vera', 'falsch': 'falsa',

    },
    phrase: [
        // book it-1 mathe11-it:
        // waage
        ['Gelöst: $x = ', 'Risolta: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Fai la verifica: sostituisci il valore nella prima riga.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'I due lati sono uguali: ogni numero è soluzione, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Contraddizione: non c’è nessuna soluzione, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Scrivi la trasformazione che vuoi applicare a <b>entrambi</b> i lati.'],
        ['Das verstehe ich nicht. Beispiele: ', 'Non ho capito. Esempi: '], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'Dopo il segno di operazione manca un numero.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Moltiplicare per $x$ o dividere per $x$ non è una trasformazione sicura: $x$ potrebbe essere $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'Non si può dividere per $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Moltiplicare per $0$ trasforma ogni equazione in $0 = 0$ e si perde l’informazione.'],
        ['Bring alle $x$ auf eine Seite: ', 'Porta tutte le $x$ da un lato: '], ['Bring die Zahl auf die andere Seite: ', 'Porta il numero dall’altro lato: '],
        ['Teile durch die Zahl vor dem $x$: ', 'Dividi per il numero davanti alla $x$: '],
        // binom, koerper ($M$ and $O$ stay as in the chapter text of lb2)
        ['Der häufigste Fehler: ', 'L’errore più frequente: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. Nella figura mancano allora i due rettangoli blu, qui '],
        ['Mantellinie $s = ', 'Apotema $s = '],
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:
        // ungleichung
        ['heißt $', 'significa $'], ['Das stimmt für jede Zahl: ', 'È vera per ogni numero: '], ['Das stimmt für keine Zahl: ', 'Non è vera per nessun numero: '],
        ['Zieh die <b>Probe</b> über den Zahlenstrahl. $x = ', 'Trascina la <b>prova</b> lungo la retta dei numeri. $x = '], ['$ ist ', '$ è '],
        [': Die Zahl gehört zur Lösungsmenge.', ': il numero appartiene all’insieme delle soluzioni.'], [': Die Zahl gehört nicht dazu.', ': il numero non vi appartiene.'],

    ],
    rule: [
        // book it-1 mathe11-it:
        // the solution set is S in the Italian books (glossario, also in the widget sentences): $L = \{…\}$, $L = \mathbb{R}$ → $S = …$
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$S = '],
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:
    ]
});
