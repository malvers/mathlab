/* js/buch-tr/lgs.js — Turkish for the widgets of js/buch-lgs.js.
 * Loaded by the Turkish editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the tr0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('lgs', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs lgs/*)
        // book tr-1 mathe11-tr:
        // gauss, geraden, matrizen, pagerank
        'Ausführen': 'Uygula', 'Nächster Schritt': 'Sonraki adım', 'Neues LGS': 'Yeni sistem',
        'Zeile + k · Zeile': 'satır + k · satır', 'Zeile · k': 'satır · k', 'tauschen': 'yer değiştir', 'Zielzeile': 'Hedef satır', 'zweite Zeile': 'İkinci satır', 'Faktor k': 'Çarpan k',
        'Ziel I': 'hedef I', 'Ziel II': 'hedef II', 'Ziel III': 'hedef III', 'mit I': 'I ile', 'mit II': 'II ile', 'mit III': 'III ile',
        'eine Lösung': 'tek çözüm', 'keine Lösung': 'çözüm yok', 'unendlich viele': 'sonsuz çok', 'Zwei Geraden': 'İki doğru',
        'mit $r =$': '$r =$', 'Neue Matrizen': 'Yeni matrisler', 'Wähle eine Rechnung.': 'Bir işlem seç.',
        '1 Schritt': '1 adım', '10 Schritte': '10 adım', 'Vier Webseiten und ihre Links': 'Dört web sayfası ve bağlantıları',
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs lgs/*)
        // book tr-1 mathe11-tr:
        // gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Bitti: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Basamak biçimine ulaşıldı. Şimdi aşağıdan yukarıya doğru yerine koyabilir ya da “Sonraki adım” ile dönüştürmeye devam edebilirsin (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Bir dönüşüm seç ve uygula ya da “Sonraki adım” ile yardım al.'],
        ['Wähle zwei verschiedene Zeilen.', 'İki farklı satır seç.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', '$k$ için bir sayı gir, örn. -2 ya da 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Sıfırla çarpmak bir denk dönüşüm değildir.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Bir satırı kendisiyle toplamak çözüm kümesini değiştirir. Başka bir satır seç.'],
        ['Gleichung I ist fest: ', 'I. denklem sabit: '], ['. Verändere Gleichung II: ', '. II. denklemi değiştir: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'II. denklem $0 = 0$ oldu, hiçbir kısıtlama getirmiyor.'], ['Gleichung II lautet $0 = ', 'II. denklem $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$ oldu: çelişki, çözüm yok.'],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Sonsuz çok çözüm</b>: İki denklem de aynı doğruyu anlatır.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Çözüm yok</b>: Doğrular paralel ve farklıdır.'],
        ['Gleiche Stellen werden addiert.', 'Aynı konumdaki elemanlar toplanır.'], ['Gleiche Stellen werden subtrahiert.', 'Aynı konumdaki elemanlar çıkarılır.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Her eleman $r$ ile çarpılır.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Satırlar sütun olur: $2 \\times 3$ türünde bir matris $3 \\times 2$ türünde bir matrise dönüşür.'],
        ['Summe: $', 'Toplam: $'],
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-1 mathe11-tr:
        // geraden: "Die Geraden schneiden sich in $S(x, y)$." → "Doğrular $K(x, y)$ noktasında kesişir." (K = kesişim noktası)
        [/<b>Genau eine Lösung<\/b>: Die Geraden schneiden sich in \$S\(([^$]*)\)\$\./g, (m, p) => '<b>Tek çözüm</b>: Doğrular $K(' + p + ')$ noktasında kesişir.'],
        // gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            '$1. sütunda artık pivot yok: Sistemin ya hiç çözümü yok ya da sonsuz çok çözümü var.'],
        [/Schritt (\d+):/g, '$1. adım:'],
    ]
});
