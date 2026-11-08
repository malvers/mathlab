/* js/buch-tr/funktionen.js — Turkish for the widgets of js/buch-funktionen.js.
 * Loaded by the Turkish editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the tr0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('funktionen', {
    word: {
        // tr0: the cover of the start page (BGY 11 mathe11) and the helpers of the module (outside every widget; check.mjs funktionen/*)
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade': 'Kapak resmi: parabol, sinüs eğrisi, üstel fonksiyon ve doğru',
        'Parabel': 'Parabol', 'Liegende Spitze': 'Yatay sivri uç', 'Liegende Parabel': 'Yatay parabol', 'Wurzel': 'Karekök',
        'Hyperbel': 'Hiperbol', 'Betrag': 'Mutlak değer',
        'Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.':
            '$x = -1$ değerinin sağında her dikey doğru eğriyi iki kez keser: $x = 1$ değerine $y = 2$ ve $y = -2$ karşılık gelir.',
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.':
            '$x = 2$ değerine $y = 2$ ve $y = -2$ karşılık gelir. Oysa bir fonksiyon her $x$ değerine tam olarak bir $y$ değeri karşılık getirir.',
        'zwei Nullstellen $x = 1 \\pm \\sqrt{1 - a}$': 'iki kök: $x = 1 \\pm \\sqrt{1 - a}$',
        'eine (doppelte) Nullstelle $x = 1$': 'bir (çift katlı) kök: $x = 1$',
        'keine Nullstelle': 'kök yok',
        'Diskriminante: $x^2 - 2x + a = 0$ hat $D = 1 - a$.': 'Diskriminant: $x^2 - 2x + a = 0$ için $\\Delta = 4 - 4a$.',
        'zwei Nullstellen $x = 0$ und $x = -a$': 'iki kök: $x = 0$ ve $x = -a$',
        'eine doppelte Nullstelle $x = 0$': 'çift katlı bir kök: $x = 0$',
        'Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).':
            'Ortak paranteze al: $x^2 + ax = x(x + a) = 0$. Tepe noktaları $T\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ hep $y = -x^2$ parabolü (kesikli) üzerindedir.',
        'zwei Nullstellen $x = \\pm \\tfrac{2}{\\sqrt{k}}$': 'iki kök: $x = \\pm \\tfrac{2}{\\sqrt{k}}$',
        'keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle': 'parabol değil, $y = -4$ doğrusu: kök yok',
        'nach unten geöffnet mit dem Scheitel $(0 \\mid -4)$: keine Nullstelle': 'kolları aşağı doğru, tepe noktası $(0, -4)$: kök yok',
        '$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.':
            '$kx^2 = 4$ denkleminin yalnızca $k > 0$ için çözümü vardır. $k = 0$ durumu ayrıca incelenmelidir, çünkü o zaman $x^2$ terimi ortadan kalkar.',
        'Zaun an der Mauer': 'Duvar boyunca çit',
        'Rechteck mit Umfang 24 cm': 'Çevresi 24 cm olan dikdörtgen',
        // book tr-1 mathe11-tr:
        // detektiv: the answers are whole labels, so the Turkish word order ("$x \leq 0$ için azalan") needs no rule
        'Graph der gewählten Funktion': 'Seçilen fonksiyonun grafiği', 'Alle aufdecken': 'Hepsini aç', 'aufdecken': 'aç',
        'Definitionsbereich': 'Tanım kümesi', 'Wertebereich': 'Görüntü kümesi', 'Nullstellen': 'Kökler', 'Monotonie': 'Monotonluk',
        'Symmetrie': 'Simetri', 'Periodisch?': 'Periyodik mi?', 'Asymptoten': 'Asimptotlar', 'nein': 'hayır', 'keine': 'yok',
        '$x = 0$ (doppelt)': '$x = 0$ (çift katlı)', '$x = -2$ und $x = 2$': '$x = -2$ ve $x = 2$',
        '$x = k \\cdot \\pi$ mit $k \\in \\mathbb{Z}$': '$k \\in \\mathbb{Z}$ olmak üzere $x = k \\cdot \\pi$',
        'fallend für $x \\leq 0$, steigend für $x \\geq 0$': '$x \\leq 0$ için azalan, $x \\geq 0$ için artan',
        'überall steigend': 'her yerde artan', 'fallend auf $x < 0$ und fallend auf $x > 0$': '$x < 0$ için azalan, $x > 0$ için de azalan',
        'abwechselnd steigend und fallend': 'sırayla artan ve azalan',
        'achsensymmetrisch zur $y$-Achse': '$y$ eksenine göre simetrik', 'punktsymmetrisch zum Ursprung': 'orijine göre simetrik',
        'ja, Periode $2\\pi$': 'evet, periyot $2\\pi$',
        '$x = 0$ (senkrecht) und $y = 0$ (waagerecht)': '$x = 0$ (düşey) ve $y = 0$ (yatay)',
        '$y = 0$ für $x \\to -\\infty$': '$x \\to -\\infty$ için $y = 0$',
        // wachstum
        'Sparen': 'Birikim', 'Kernzerfall': 'Radyoaktif bozunma', 'Eigene Werte': 'Kendi değerlerin',
        'Lineares und exponentielles Wachstum': 'Doğrusal ve üstel büyüme', 'Startwert $a$': 'Başlangıç değeri $a$',
        'linear: Änderung $m$ pro Schritt': 'doğrusal: adım başına değişim $m$', 'exponentiell: Faktor $q$': 'üstel: çarpan $q$',
        'Zeitraum': 'Süre',
        // gerade, parabel, wurf
        'Gerade durch zwei verschiebbare Punkte': 'Sürüklenebilir iki noktadan geçen doğru',
        'Streckfaktor $a$': 'Uzatma çarpanı $a$', 'Verschiebung nach rechts $d$': 'Sağa öteleme $r$',
        'Verschiebung nach oben $e$': 'Yukarı öteleme $k$', 'Parabel mit verschiebbarem Scheitelpunkt': 'Tepe noktası sürüklenebilen parabol',
        'Abwurfhöhe $h_0$': 'Atış yüksekliği $h_0$', 'Abwurfgeschwindigkeit $v_0$': 'Atış hızı $v_0$',
        'Höhe beim senkrechten Wurf': 'Dikey atışta yükseklik', 't in s': 't (s)', 'h in m': 'h (m)',
        // einheitskreis, sinus, tageslaenge
        'Abspielen': 'Oynat', 'Anhalten': 'Durdur', 'Winkel $\\alpha$': 'Açı $\\alpha$', 'Einheitskreis und Sinuskurve': 'Birim çember ve sinüs eğrisi',
        'Amplitude $a$': 'Genlik $a$', 'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)': 'Çarpan $b$ (periyot $\\tfrac{2\\pi}{b}$)',
        'Verschiebung $c$ nach rechts': 'Sağa öteleme $c$', 'Verschiebung $d$ nach oben': 'Yukarı öteleme $d$',
        'Sinusfunktion mit Parametern': 'Parametreli sinüs fonksiyonu',
        'Tag des Jahres': 'Yılın günü', 't in Tagen': 't (gün)', 'Stunden': 'saat', 'Tageslänge in Dresden': "Dresden'de gün uzunluğu",
        // regression, anscombe
        'Kerze': 'Mum', 'Bremsweg': 'Fren mesafesi', 'Abkühlen': 'Soğuma', 'Weltbevölkerung': 'Dünya nüfusu',
        'Brenndauer in h': 'Yanma süresi (h)', 'Länge in cm': 'Uzunluk (cm)', 'Tempo in km/h': 'Hız (km/h)',
        'Bremsweg in m': 'Fren mesafesi (m)', 'Zeit in min': 'Zaman (dk)', 'ΔT in °C': 'ΔT (°C)', 'Jahr': 'Yıl', 'Mrd. Menschen': 'Milyar kişi',
        'Messreihe': 'Ölçüm dizisi',
        'Messpunkte und Regressionskurve': 'Ölçüm noktaları ve regresyon eğrisi', 'Messpunkte lassen sich verschieben': 'Ölçüm noktaları sürüklenebilir',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Üstel bir model için değerler pozitif olmalıdır.',
        'Datensatz': 'Veri kümesi', 'Anscombe-Quartett': 'Anscombe dörtlüsü',
        // umkehr, expgleichung, parameter, graphquiz
        'Funktion und Umkehrfunktion, gespiegelt an y = x': 'Fonksiyon ve ters fonksiyonu, y = x doğrusuna göre yansımış',
        'Basis $a$': 'Taban $a$', 'rechte Seite $b$': 'sağ taraf $b$', 'Lösen': 'Çöz',
        'Die Basis muss positiv und von 1 verschieden sein.': "Taban pozitif ve 1'den farklı olmalıdır.",
        'Grundfunktion': 'Temel fonksiyon', 'Grundfunktion und veränderte Funktion': 'Temel fonksiyon ve dönüştürülmüş fonksiyon',
        'Das ist die Grundfunktion selbst.': 'Bu, temel fonksiyonun kendisi.',
        'Graph, zu dem der Term gesucht ist': 'İfadesi aranan grafik', 'Nächster Graph': 'Sonraki grafik',
    },
    phrase: [
        // tr0: the cover of the start page (BGY 11 mathe11) and the helpers of the module (outside every widget; check.mjs funktionen/*)
        // book tr-1 mathe11-tr:
        // parameter: c = 0 in f(c·x)
        ['mit $c = 0$ ist $g(x) = f(0)$ konstant', '$c = 0$ için $g(x) = f(0)$ sabit'],
        // wachstum (the numbers of years, days and steps: rules below)
        ['einfache Zinsen (30 € pro Jahr)', 'basit faiz (yılda 30 €)'], ['Zinseszins (3 % pro Jahr)', 'bileşik faiz (yılda %3)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'doğrusal: her gün 6,25 yüzde puan daha az'],
        ['Jod-131: Halbwertszeit 8 Tage', 'İyot-131: yarı ömür 8 gün'],
        [' — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', ' — her adımda <b>aynı çarpanla</b> çarpılır'],
        [' — in jedem Schritt ', ' — her adımda '], ['geht <b>gleich viel</b> weg', '<b>aynı miktar</b> azalır'],
        ['kommt <b>gleich viel</b> hinzu.', '<b>aynı miktar</b> eklenir.'],
        ['linear', 'doğrusal'], ['exponentiell', 'üstel'],
        // gerade
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'İki nokta aynı dikey doğru üzerinde. $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ doğrusu bir fonksiyon grafiği <b>değildir</b>.'],
        ['Steigung $m = ', 'Eğim $m = '], ['Achsenabschnitt $n = ', '$y$ eksenini kestiği nokta $n = '], ['$ (weißer Punkt)', '$ (beyaz nokta)'],
        [' · Nullstelle $x_0 = ', ' · kök $x_0 = '], [' · waagerechte Gerade', ' · yatay doğru'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', '$a = 0$ için grafik bir parabol değil, bir doğrudur.'],
        ['eine (doppelte) Nullstelle: $x = ', 'bir (çift katlı) kök: $x = '], ['Nullstellen: $x_1 = ', 'Kökler: $x_1 = '],
        ['Scheitelpunktform: $f(x) = ', 'Tepe noktası biçimi: $f(x) = '], [' · Scheitel $S(', ' · tepe noktası $T('], ['Normalform: $f(x) = ', 'Genel biçim: $f(x) = '],
        // einheitskreis, sinus, tageslaenge
        ['$ im Bogenmaß · ', '$ (radyan) · '], ['Amplitude $|a| = ', 'Genlik $|a| = '], [' · Periode $p = ', ' · periyot $p = '],
        [' · Mittellinie $y = ', ' · orta doğru $y = '], [' · Wertebereich $', ' · görüntü kümesi $'], ['$ · am ', '$ · '],
        [' min</b> Tageslicht', ' min</b> gün ışığı'],
        // regression, anscombe
        ['Wann ist die Kerze abgebrannt?', 'Mum ne zaman tükenir?'], ['Bremsweg bei 150 km/h?', '150 km/h hızda fren mesafesi?'],
        ['Temperaturunterschied nach 45 min?', '45 dakika sonra sıcaklık farkı?'], ['Prognose für 2050?', '2050 için tahmin?'],
        ['Regressionsfunktion: $', 'Regresyon fonksiyonu: $'], [' &nbsp;mit $x$ = Jahre seit 1950', " &nbsp;($x$ = 1950'den bu yana geçen yıl)"],
        ['Bestimmtheitsmaß $R^2 = ', 'Belirlilik katsayısı $R^2 = '], ['(passt sehr gut)', '(çok iyi uyuyor)'], ['(passt gut)', '(iyi uyuyor)'],
        ['(passt mäßig)', '(orta düzeyde uyuyor)'], [' Das Modell sagt: $f(', ' Modelin öngörüsü: $f('], ['Regressionsgerade: $', 'Regresyon doğrusu: $'],
        ['Datensatz', 'Veri kümesi'],
        // umkehr, expgleichung (the points have their comma already: js/buch-tr.js)
        ['$ · Der Punkt $P(', '$ · $f$ üzerindeki $P('], ['$ auf $f$ wird zum Punkt $P', '$ noktası, $f^{-1}$ üzerinde $P'], ['$ auf $f^{-1}$.', '$ noktası olur.'],
        ['Keine Lösung: $', 'Çözüm yok: $'], ['Probe: $', 'Sağlama: $'],
        // parameter ("Der Graph ist …" → "Grafik …", every part a participle of its own: rules below)
        ['Der Graph ist ', 'Grafik '],
        // parameter: the slider labels "$c \cdot f(x)$: strecken in $y$-Richtung"
        [': strecken in $y$-Richtung', ': $y$ yönünde uzatma'], [': verschieben in $y$-Richtung', ': $y$ yönünde öteleme'],
        [': stauchen in $x$-Richtung', ': $x$ yönünde daraltma'], [': verschieben in $x$-Richtung', ': $x$ yönünde öteleme'],
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-1 mathe11-tr:
        // tageslaenge: "21. Jun" → "21 Haz" with the Turkish short months
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' ' + { Jan: 'Oca', Feb: 'Şub', 'Mär': 'Mar', Apr: 'Nis', Mai: 'May', Jun: 'Haz', Jul: 'Tem', Aug: 'Ağu', Sep: 'Eyl', Okt: 'Eki', Nov: 'Kas', Dez: 'Ara' }[mo]],
        // wachstum: "40 Jahre" → "40 yıl" (Turkish keeps the noun singular after a number)
        [/^(\d+) (Jahre|Tage|Schritte)$/, (m, n, u) => n + ' ' + ({ Jahre: 'yıl', Tage: 'gün', Schritte: 'adım' }[u])],
        [/\. Nach \$([^$]*)\$ (Jahren|Tagen|Schritten) wäre alles verbraucht\./g,
            (m, x, u) => '. $' + x + '$ ' + { Jahren: 'yıl', Tagen: 'gün', Schritten: 'adım' }[u] + ' sonra hepsi tükenmiş olurdu.'],
        [/, das sind ([+−])([\d.,]+) % pro Schritt\. /g, (m, s, p) => ', yani adım başına ' + s + '%' + p + '. '],
        [/(Verdopplungszeit|Halbwertszeit): \$([^$]*)\$ (Jahre|Tage|Schritte)\./g,
            (m, w, x, u) => (w === 'Verdopplungszeit' ? 'İkiye katlanma süresi' : 'Yarı ömür') + ': $' + x + '$ ' + { Jahre: 'yıl', Tage: 'gün', Schritte: 'adım' }[u] + '.'],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'kök yok: tepe noktası $x$ ekseninin ' + (a === 'über' ? 'üstünde' : 'altında') + ' ve parabolün kolları ' + (b === 'oben' ? 'yukarı' : 'aşağı') + ' doğru.'],
        // wurf: "Höchster Punkt nach $t_S = …\,\text{s}$ in $8,84\,\text{m}$ Höhe. Aufprall nach $…\,\text{s}$." (S = Scheitel → T = tepe)
        [/Höchster Punkt nach \$t_S = ([^$]*)\$ in \$([^$]*)\$ Höhe\. /g, (m, t, h) => 'En yüksek nokta $t_T = ' + t + '$ anında, $' + h + '$ yükseklikte. '],
        [/Aufprall nach \$([^$]*)\$\./g, (m, t) => '$' + t + '$ sonra yere çarpar.'],
        // expgleichung
        [/\^x\$ ist immer positiv, kann also nie \$([^$]*)\$ werden\./g, (m, b) => '^x$ her zaman pozitiftir, yani hiçbir zaman $' + b + '$ olamaz.'],
        // expgleichung, umkehr: the common logarithm is log in Turkish schools, not lg
        [/\\lg(?![a-z])/g, '\\log'],
        // parameter: the parts of "Der Graph ist …" as Turkish participles
        [/gespiegelt an der \$([xy])\$-Achse und mit \$([^$]+)\$ (gestreckt|gestaucht)/g,
            (m, ax, f, w) => '$' + ax + '$ eksenine göre yansıtılmış ve $' + f + '$ çarpanıyla ' + (w === 'gestreckt' ? 'uzatılmış' : 'daraltılmış')],
        [/gespiegelt an der \$([xy])\$-Achse, in \$x\$-Richtung mit Faktor (\$[^$]+\$)/g,
            (m, ax, f) => '$' + ax + '$ eksenine göre yansıtılmış, $x$ yönünde ' + f + ' çarpanıyla ölçeklenmiş'],
        [/gespiegelt an der \$([xy])\$-Achse/g, (m, ax) => '$' + ax + '$ eksenine göre yansıtılmış'],
        [/in \$([xy])\$-Richtung mit Faktor (\$[^$]+\$) (gestreckt|gestaucht)/g,
            (m, ax, f, w) => '$' + ax + '$ yönünde ' + f + ' çarpanıyla ' + (w === 'gestreckt' ? 'uzatılmış' : 'daraltılmış')],
        [/um \$([^$]+)\$ nach (links|rechts|oben|unten) verschoben/g,
            (m, c, d) => '$' + c + '$ birim ' + { links: 'sola', rechts: 'sağa', oben: 'yukarı', unten: 'aşağı' }[d] + ' ötelenmiş'],
        // graphquiz score: "3 richtig" → "3 doğru"
        [/^(\d+) richtig$/, '$1 doğru'],
    ]
});
