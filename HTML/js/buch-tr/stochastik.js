/* js/buch-tr/stochastik.js — Turkish for the widgets of js/buch-stochastik.js.
 * Loaded by the Turkish editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the tr0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('stochastik', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        'Baumdiagramm': 'Ağaç diyagramı',
        'gerade · Vielfaches von 3': 'çift · 3’ün katı',
        'Primzahl · größer als 6': 'asal sayı · 6’dan büyük',
        'unvereinbar': 'ayrık',
        // book tr-1 mathe11-tr:
        // baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen
        'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Ağaç diyagramı: geri koymadan iki top',
        'Rot': 'Kırmızı', 'eine rote Kugel weniger': 'bir kırmızı top eksik', 'eine rote Kugel mehr': 'bir kırmızı top fazla',
        'eine blaue Kugel weniger': 'bir mavi top eksik', 'eine blaue Kugel mehr': 'bir mavi top fazla',
        'Anzahl der Züge': 'Çekiliş sayısı', '2 Züge': '2 çekiliş', '3 Züge': '3 çekiliş', 'Ziehen': 'Çek',
        'ohne Zurücklegen': 'geri koymadan', 'mit Zurücklegen': 'geri koyarak', 'Urne:': 'Torba:',
        'Ereignis wählen:': 'Olay seç:', 'Ereignis': 'Olay', 'Baumdiagramm der Urne': 'Torbanın ağaç diyagramı', 'unmöglich': 'imkânsız',
        'beide Rot': 'ikisi de kırmızı', 'alle Rot': 'hepsi kırmızı', 'genau einmal Rot': 'tam bir kez kırmızı', 'mindestens einmal Rot': 'en az bir kez kırmızı',
        'keinmal Rot': 'hiç kırmızı yok', 'beide gleich': 'ikisi aynı renk', 'alle gleich': 'hepsi aynı renk', 'leeren': 'temizle',
        'Anteil der Erkrankten': 'Hastaların oranı', 'Test erkennt Kranke (Sensitivität)': 'Testin hastaları tanıması (duyarlılık)',
        'Test erkennt Gesunde (Spezifität)': 'Testin sağlıklıları tanıması (özgüllük)', 'Darstellung': 'Gösterim',
        'Anzahlen (von 10 000)': 'Sayılar (10.000 kişide)', 'Wahrscheinlichkeiten': 'Olasılıklar', 'Anzahlen': 'Sayılar',
        'positiv $T^+$': 'pozitif $T^+$', 'negativ $T^-$': 'negatif $T^-$', 'krank $K$': "hasta $H$", 'gesund $\\overline{K}$': "sağlıklı $H'$",
        'krank': 'hasta', 'gesund': 'sağlıklı', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Ağaç diyagramı: hasta ya da sağlıklı, sonra test sonucu',
        'Neue Tafel': 'Yeni tablo', 'A und B': 'A ve B', 'A und nicht B': "A ve B'", 'nicht A und B': "A' ve B", 'nicht A und nicht B': "A' ve B'",
        'A gesamt': 'A toplam', 'nicht A gesamt': "A' toplam", 'B gesamt': 'B toplam', 'nicht B gesamt': "B' toplam", 'gesamt': 'toplam',
        'Münze': 'Madeni para', 'Würfel': 'Zar', 'Zwei Würfel': 'İki zar', 'Urne': 'Torba', 'Wappen': 'tura', 'Sechs': 'altı', 'Augensumme 7': 'toplam 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'ikisi de kırmızı (3 kırmızı, 2 mavi, geri koymadan)',
        'mindestens eine Sechs in vier Würfen': 'dört atışta en az bir altı', 'Zufallsversuch': 'Deney', 'Durchführen:': 'Uygula:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Deney sayısına göre göreli sıklık',
        'VERSUCHE n': 'DENEME n', 'TREFFER': 'İSABET', 'REL. HÄUFIGKEIT': 'GÖRELİ SIKLIK', 'WAHRSCHEINLICHKEIT': 'OLASILIK',
        'Noch kein Versuch – starte mit +1 oder +10.': 'Henüz deneme yok – +1 ya da +10 ile başla.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.':
            'Kapılardan birinin arkasında bir otomobil, diğer ikisinin arkasında birer keçi var. Bir kapı seç.',
        'Neues Spiel': 'Yeni oyun', '1000 Spiele vom Rechner spielen lassen': 'Bilgisayara 1000 oyun oynat',
        'Strategie': 'Strateji', 'Spiele': 'Oyun', 'Autos': 'Otomobil', 'Gewinnquote': 'Kazanma oranı',
        'du: bleiben': 'sen: kal', 'du: wechseln': 'sen: değiştir', 'Rechner: bleiben': 'bilgisayar: kal', 'Rechner: wechseln': 'bilgisayar: değiştir',
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs stochastik/*)
        // venn: what the operation says, inside the sentence "$A \cup B$ (…) $= …$"
        ['$A$ oder $B$ (oder beide)', '$A$ ya da $B$ (ya da ikisi)'],
        ['$A$ und $B$', '$A$ ve $B$'],
        ['nicht $A$', "$A$ değil"],
        ['weder $A$ noch $B$', 'ne $A$ ne $B$'],
        ['nicht $A$ und nicht $B$', '$A$ değil ve $B$ değil'],
        ['nicht beide', 'ikisi birden değil'],
        ['nicht $A$ oder nicht $B$', '$A$ değil ya da $B$ değil'],
        // book tr-1 mathe11-tr:
        // baum, schnelltest, vierfeld-trainer, simulation, ziegen
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Dalların uçlarına (ağacın sağında) tıkla ya da yukarıdan bir olay seç. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'Kitap dal kurallarıyla hesabı sana gösterir.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>1. dal kuralı</b> (dal boyunca çarp):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>2. dal kuralı</b> (dalları topla):'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Pozitif çıkanlar arasında hastaların oranı: '],
        [' alles richtig', ' hepsi doğru'], ['Ereignis: <b>', 'Olay: <b>'], ['Zuletzt: ', 'Son atışlar: '],
        ['TÜR', 'KAPI'], ['Tür', 'Kapı'], ['Gewonnen – das Auto! ', 'Kazandın – otomobil! '], ['Leider eine Ziege. ', 'Maalesef bir keçi. '],
        ['Du hast gewechselt.', 'Kapını değiştirdin.'], ['Du bist geblieben.', 'Kapında kaldın.'],
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-1 mathe11-tr:
        // the letters in the trees: R/B (rot/blau) → K/M (kırmızı/mavi), K/G (krank/gesund) → H/S (hasta/sağlıklı), in one pass
        [/(font-weight:700">)([RBKG])(<\/(?:text|tspan)>)/g, (m, a, l, b) => a + ({ R: 'K', B: 'M', K: 'H', G: 'S' }[l]) + b],
        // baum-hero: the ends of the paths, "RB" as plain text
        [/(<text x="10" y="20">)([RB]{2,3})(<\/text>)/g, (m, a, k, b) => a + k.replace(/[RB]/g, l => (l === 'R' ? 'K' : 'M')) + b],
        // the paths in the sentence "$P(\text{RB}) = …$"
        [/\\text\{([RB]+)\}/g, (m, k) => '\\text{' + k.replace(/[RB]/g, l => (l === 'R' ? 'K' : 'M')) + '}'],
        // simulator: coin W/Z → T/Y (tura/yazı), the urn's results RB → KM
        [/(margin-right:10px">)W</g, '$1T<'], [/(margin-right:10px">)Z</g, '$1Y<'],
        [/(margin-right:10px">)([RB]{2})</g, (m, a, k) => a + k.replace(/[RB]/g, l => (l === 'R' ? 'K' : 'M')) + '<'],
        // the complement the Turkish way: \overline{A} → A' (vierfeld-trainer, schnelltest)
        [/\\overline\{([A-Z])\}/g, "$1'"],
        // four-field trainer: "3 von 5 richtig" → "5 sorudan 3 doğru"
        [/(\d+) von (\d+) richtig/g, '$2 sorudan $1 doğru'],
        // rapid test: "Positiv getestet werden <b>680</b> von 10 000 Personen – aber nur <b>190</b> davon sind wirklich krank."
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10[\s  .]?000 Personen – aber nur <b>([^<]*)<\/b> davon sind wirklich krank\./g,
            (m, n, k) => '10.000 kişiden <b>' + n + '</b> kişinin testi pozitif çıkıyor – ama bunlardan yalnızca <b>' + k + '</b> kişi gerçekten hasta.'],
        // goats
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            (m, d) => 'Sunucu otomobilin nerede olduğunu biliyor ve ' + d + '. kapıyı açıyor: bir keçi. Kapında mı kalırsın, değiştirir misin?'],
        [/Bei Tür (\d) bleiben/g, (m, d) => d + '. kapıda kal'], [/Zu Tür (\d) wechseln/g, (m, d) => d + '. kapıya geç'],
    ]
});
