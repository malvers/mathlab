/* js/buch-tr/gleichungen.js — Turkish for the widgets of js/buch-gleichungen.js.
 * Loaded by the Turkish editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the tr0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('gleichungen', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs gleichungen/*)
        // book tr-1 mathe11-tr:
        // waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'örn. −3 veya :4 veya −2x', 'Anwenden': 'Uygula', 'Neue Gleichung': 'Yeni denklem',
        'Länge $a$': 'Uzunluk $a$', 'Länge $b$': 'Uzunluk $b$', 'Quadrat mit Seitenlänge a + b': 'Kenar uzunluğu a + b olan kare',
        'Zylinder': 'Silindir', 'Kegel': 'Koni', 'Kugel': 'Küre', 'Körper': 'Cisim', 'Radius $r$ in cm': 'Yarıçap $r$ (cm)',
        'Höhe $h$ in cm': 'Yükseklik $h$ (cm)', 'Skizze des Körpers': 'Cismin taslak çizimi',
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs gleichungen/*)
        // book tr-1 mathe11-tr:
        // waage
        ['Gelöst: $x = ', 'Çözüldü: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Sağlamasını yap: Değeri ilk satırda yerine koy.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'İki taraf eşit: Her sayı bir çözümdür, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Çelişki: Çözüm yok, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', '<b>İki</b> tarafa da uygulamak istediğin dönüşümü yaz.'],
        ['Das verstehe ich nicht. Beispiele: ', 'Bunu anlamadım. Örnekler: '], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'İşlem işaretinden sonra bir sayı eksik.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', "$x$ ile çarpmak ya da $x$'e bölmek güvenli bir dönüşüm değildir, $x$ sıfır olabilir."],
        ['Durch $0$ darf man nicht teilen.', 'Sıfıra bölme yapılamaz.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Sıfırla çarpmak her denklemi $0 = 0$ yapar, bu sırada bilgi kaybolur.'],
        ['Bring alle $x$ auf eine Seite: ', '$x$ içeren bütün terimleri bir tarafa topla: '], ['Bring die Zahl auf die andere Seite: ', 'Sayıyı diğer tarafa geçir: '],
        ['Teile durch die Zahl vor dem $x$: ', "$x$'in katsayısına böl: "],
        // binom, koerper
        ['Der häufigste Fehler: ', 'En sık yapılan hata: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. O zaman şekilde iki mavi dikdörtgen eksik kalır, burada '],
        ['Mantellinie $s = ', 'Ana doğru $s = '],
    ],
    rule: [
        // tr0: notation of the module, for every book
        // tr0: the solution set is Ç (çözüm kümesi) in the Turkish books, also in the widget sentences: $L = \{…\}$, $L = \mathbb{R}$ → $\text{Ç} = …$
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, () => '$\\text{Ç} = '],
        // book tr-1 mathe11-tr:
        // koerper: total surface area A (tüm alan), lateral area A_y (yanal alan), as in the chapter text
        [/\$M = (?=2\\pi r h)/g, () => '$A_y = '], [/\$O = /g, () => '$A = '],
    ]
});
