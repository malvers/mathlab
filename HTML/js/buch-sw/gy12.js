/* js/buch-sw/gy12.js — Swahili for the widgets of js/buch-gy12.js.
 * Loaded by the Swahili editions right after js/buch-gy12.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy12', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // summen (3.2): the words of js/buch-sw/numerik.js (widget flaeche), which this page does not load
        'Rechtecke links': 'Mistatili ya kushoto', 'Rechtecke rechts': 'Mistatili ya kulia', 'Rechtecke Mitte': 'Mistatili ya katikati', 'Trapeze': 'Trapeza',
        'Verfahren': 'Mbinu', 'Anzahl der Streifen $n$': 'Idadi ya vipande $n$', 'Streifen unter einem Funktionsgraphen': 'Vipande chini ya grafu ya fanksheni',
        'Hier ist das Verfahren schon exakt.': 'Hapa mbinu tayari ni sahihi kabisa.',
        // schaetzen (5.1): 'Stichprobenumfang $n$' is in js/buch-sw/stochastik.js
        'Neue Stichprobe': 'Sampuli mpya', '+1000 Stichproben': '+1000 sampuli', 'Anzahl': 'Idadi', 'Sollwert': 'thamani lengwa',
        'Füllmengen der Stichprobe als Punktdiagramm mit ihrem Mittelwert und dem Sollwert': 'Vipimo vya ujazo vya sampuli kama mchoro wa nukta, pamoja na wastani wake na thamani lengwa',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // summen: lower and upper sum (jumla ya chini / ya juu); the letters U_n and O_n stay as in the chapter text
        ['Untersumme (grün) $U_{', 'Jumla ya chini (kijani) $U_{'], ['$ · Obersumme (rot, darüber) $O_{', '$ · jumla ya juu (nyekundu, juu yake) $O_{'],
        ['$ · Unterschied $', '$ · tofauti $'], ['Dazwischen liegt immer $', 'Katikati yao daima kuna $'],
        ['$. Je mehr Streifen, desto näher rücken $U_n$ und $O_n$ zusammen; ihr gemeinsamer Grenzwert ist das Integral.',
            '$. Kadiri vipande vinavyoongezeka, ndivyo $U_n$ na $O_n$ vinavyokaribiana; kikomo chao cha pamoja ni kiunganishi.'],
        ['Rechtecke links mit $n = ', 'Mistatili ya kushoto kwa $n = '], ['Rechtecke rechts mit $n = ', 'Mistatili ya kulia kwa $n = '],
        ['Rechtecke Mitte mit $n = ', 'Mistatili ya katikati kwa $n = '], ['Trapeze mit $n = ', 'Trapeza kwa $n = '],
        [' (ohne Stammfunktion, nur numerisch)', ' (bila fanksheni asili, kwa kinamba tu)'],
        // schaetzen ("Im Mittel über … Stichproben" and "(… Werte)" are rules: the number moves)
        ['Stichprobe: ', 'Sampuli: '], ['(wahr: ', '(halisi: '],
        ['$s^2$ mit $\\tfrac{1}{n-1}$: $', '$s^2$ yenye $\\tfrac{1}{n-1}$: $'], ['$, mit $\\tfrac1n$: $', '$, yenye $\\tfrac1n$: $'],
        ['Die Division durch $n$ liegt im Mittel um den Faktor $\\tfrac{n-1}{n} = ', 'Kwa wastani, kugawanya kwa $n$ kunatoa thamani ndogo mno, mara $\\tfrac{n-1}{n} = '],
        ['$ zu tief.', '$ ya thamani halisi.'],
        ['Die Anlage füllt im Mittel $\\mu = ', 'Kwa wastani mashine inajaza $\\mu = '], ['$ ml mit der Standardabweichung $\\sigma = ', '$ ml kwa mkengeuko sanifu $\\sigma = '],
        ['$ ml ab. Das weiß die Prüferin aber nicht: Sie schätzt beides aus der Stichprobe.', '$ ml. Lakini mkaguzi hajui hilo: anakadiria vyote viwili kutokana na sampuli.'],
    ],
    rule: [
        // book sw-5 mathe13lk-sw:
        // summen: the exact value is "thamani sahihi" (a rule, because js/buch-sw/numerik.js has the phrase with "thamani kamili");
        // the factor of the error; the head of the error table (no bare word 'Fehler': the header button "Fehler<br>melden")
        [/\$ · genauer Wert \$/g, '$ · thamani sahihi $'],
        [/Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor \$([^$]*)\$ kleiner\./g, (m, k) => 'Vipande mara mbili zaidi: kosa linakuwa dogo takriban mara $' + k + '$.'],
        [/<th>Näherung<\/th><th>Fehler<\/th>/g, '<th>Makadirio</th><th>Kosa</th>'],
        // schaetzen: "Im Mittel über 1000 Stichproben: $" and "(12 Werte)", the number after its noun
        [/Im Mittel über (\d+) Stichproben: \$/g, (m, n) => 'Kwa wastani katika sampuli ' + n + ': $'], [/\((\d+) Werte\)/g, '(thamani $1)'],
    ]
});
