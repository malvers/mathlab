/* js/buch-it/gy12.js — Italian for the widgets of js/buch-gy12.js.
 * Loaded by the Italian editions right after js/buch-gy12.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy12.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy12', {
    word: {
        // book it-8 mathegy12-it:
        // schaetzen ('Stichprobenumfang $n$' is in js/buch-it/stochastik.js)
        'Neue Stichprobe': 'Nuovo campione', '+1000 Stichproben': '+1000 campioni', 'Anzahl': 'Numero',
        'Füllmengen der Stichprobe als Punktdiagramm mit ihrem Mittelwert und dem Sollwert': 'Quantità di riempimento del campione come diagramma a punti, con la loro media e il valore nominale',
        'Sollwert': 'valore nominale',
        // summen: the same words as js/buch-it/numerik.js (widget flaeche), which the pages of LB 5 do not load
        'Rechtecke links': 'Rettangoli a sinistra', 'Rechtecke rechts': 'Rettangoli a destra', 'Rechtecke Mitte': 'Rettangoli punto medio', 'Trapeze': 'Trapezi',
        'Verfahren': 'Metodo', 'Anzahl der Streifen $n$': 'Numero di strisce $n$', 'Streifen unter einem Funktionsgraphen': 'Strisce sotto il grafico di una funzione',
        'Hier ist das Verfahren schon exakt.': 'Qui il metodo è già esatto.',

        // book it-9 mathegy12lk-it:

    },
    phrase: [
        // book it-8 mathegy12-it:
        // schaetzen
        [' Werte)', ' valori)'], ['Stichprobe: ', 'Campione: '], ['Im Mittel über ', 'In media su '], [' Stichproben: $', ' campioni: $'], ['(wahr: ', '(vero: '],
        ['$s^2$ mit $\\tfrac{1}{n-1}$: $', '$s^2$ con $\\tfrac{1}{n-1}$: $'], ['$, mit $\\tfrac1n$: $', '$, con $\\tfrac1n$: $'],
        ['Die Division durch $n$ liegt im Mittel um den Faktor $\\tfrac{n-1}{n} = ', 'Dividendo per $n$ si ottiene in media un valore troppo basso, di un fattore $\\tfrac{n-1}{n} = '],
        ['$ zu tief.', '$.'],
        ['Die Anlage füllt im Mittel $\\mu = ', 'L’impianto riempie in media $\\mu = '], ['$ ml mit der Standardabweichung $\\sigma = ', '$ ml con la deviazione standard $\\sigma = '],
        ['$ ml ab. Das weiß die Prüferin aber nicht: Sie schätzt beides aus der Stichprobe.', '$ ml. Ma l’ispettrice non lo sa: stima entrambi i valori dal campione.'],
        // summen: the letters U_n and O_n stay as in the German book
        ['Untersumme (grün) $U_{', 'Somma inferiore (verde) $U_{'], ['$ · Obersumme (rot, darüber) $O_{', '$ · somma superiore (rossa, sopra) $O_{'], ['$ · Unterschied $', '$ · differenza $'],
        ['Dazwischen liegt immer $', 'In mezzo sta sempre $'],
        ['$. Je mehr Streifen, desto näher rücken $U_n$ und $O_n$ zusammen; ihr gemeinsamer Grenzwert ist das Integral.',
            '$. Più strisce ci sono, più $U_n$ e $O_n$ si avvicinano; il loro limite comune è l’integrale.'],
        ['Rechtecke links mit $n = ', 'Rettangoli a sinistra con $n = '], ['Rechtecke rechts mit $n = ', 'Rettangoli a destra con $n = '],
        ['Rechtecke Mitte mit $n = ', 'Rettangoli punto medio con $n = '], ['Trapeze mit $n = ', 'Trapezi con $n = '], ['$ · genauer Wert $', '$ · valore esatto $'],
        [' (ohne Stammfunktion, nur numerisch)', ' (senza primitiva, solo numericamente)'],
        ['Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor $', 'Con il doppio delle strisce l’errore diventa circa $'], ['$ kleiner.', '$ volte più piccolo.'],

        // book it-9 mathegy12lk-it:

    ],
    rule: [
        // book it-8 mathegy12-it:
        // summen: the head of the error table; no global word 'Fehler' - it hangs the page through the header button "Fehler<br>melden"
        [/<th>Näherung<\/th><th>Fehler<\/th>/g, '<th>Approssimazione</th><th>Errore</th>'],

        // book it-9 mathegy12lk-it:

    ]
});
