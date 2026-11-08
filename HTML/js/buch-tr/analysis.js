/* js/buch-tr/analysis.js — Turkish for the widgets of js/buch-analysis.js.
 * Loaded by the Turkish editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package tr2-prep (08.11.2026): the module's helpers (outside every widget) go below the tr0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('analysis', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // the pictures of the optimisation problems (optimieren): box, tin, pen at a wall
        'Karton mit ausgeschnittenen Ecken': 'Köşeleri kesilmiş karton', 'Zylindrische Dose': 'Silindir biçimli konserve kutusu',
        'Gehege an einer Mauer': 'Bir duvarın kenarında çevrili alan', 'Mauer': 'Duvar',
        // book tr-2 mathe12-tr:
        // the cover of the start page (BGY 12)
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Kapak resmi: büküm noktasındaki teğetiyle bir eğri ve türevi, bir binom dağılımı ve uzayda bir vektör',
        // grenzwert (lb2-1): Grenzwert = limit, waagerechte / senkrechte Asymptote = yatay / düşey asimptot, Loch = delik
        'Annäherung, Schritt $k$': 'Yaklaşma, adım $k$', 'Graph mit Annäherung an einen Grenzwert': 'Bir limite yaklaşan grafik',
        'Annäherung:': 'Yaklaşma:', 'Richtung': 'Yön',
        // sekante, ableitungsgraph (lb2-2): Sekante = kesen, Tangente = teğet, Steigung = eğim, f′ = "f üssü"
        'Abstand $h$ von $P$ zu $Q$': '$P$ ile $Q$ arasındaki uzaklık $h$', 'Tangente zeigen': 'Teğeti göster', 'Tangente ausblenden': 'Teğeti gizle',
        'Sekante durch P und Q nähert sich der Tangente': 'P ve Q noktalarından geçen kesen teğete yaklaşıyor',
        'Ganzen Graphen von f′ zeigen': 'f′ grafiğinin tamamını göster', 'Spur löschen': 'İzi sil',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.':
            'Üstte: teğetiyle birlikte f. P noktasını sürükle. Altta: Her teğet eğimi, f′ grafiğinin bir noktası olur.',
        'Graph von f mit Tangente': 'Teğetiyle birlikte f grafiği', 'Graph der Ableitung f Strich': 'Türev fonksiyonu f üssünün grafiği',
        // ableiten (lb2-3): ableiten = türevini almak ("Türevini al"), Potenzen = kuvvetler, Wurzeln = kökler, Produkte = çarpımlar
        'Potenzen': 'Kuvvetler', 'Summen': 'Toplamlar', 'Wurzeln und Brüche': 'Kökler ve kesirler', 'eˣ und sin x': 'eˣ ve sin x', 'Produkte': 'Çarpımlar',
        'Gemischt': 'Karışık', 'Aufgabenart': 'Alıştırma türü', 'z. B. 6x^2 - 2 oder cos x': 'örn. 6x^2 - 2 ya da cos x', 'Lösung': 'Çözüm',
        'Neue Aufgabe': 'Yeni alıştırma',
        // kurve (lb2-4): Hochpunkt / Tiefpunkt / Wendepunkt / Sattelpunkt = yerel maksimum noktası T (tepe) / yerel minimum noktası D (dip) /
        // büküm noktası B / eyer noktası; the letters on the canvas by the rule below
        '$a$ (vor $x^3$)': '$a$ ($x^3$\'ün katsayısı)', '$b$ (vor $x^2$)': '$b$ ($x^2$\'nin katsayısı)', '$c$ (vor $x$)': '$c$ ($x$\'in katsayısı)', 'Zeige auch:': 'Ayrıca göster:',
        'nur f': 'yalnızca f', 'f′ und f″': 'f′ ve f″', 'Ableitungen zeigen': 'Türevleri göster',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Ekstremum ve büküm noktalarıyla üçüncü dereceden bir fonksiyonun grafiği',
        'Intervall': 'Aralık', 'konstant': 'sabit', 'steigt ↗': 'artar ↗', 'fällt ↘': 'azalır ↘',
        // tangente (lb2-5): Normale = normal doğrusu, Berührpunkt = değme noktası
        'Tangente und Normale an einen Graphen': 'Bir grafiğe teğet ve normal',
        // steckbrief, optimieren (lb2-6): Steckbrief = koşullardan fonksiyon, Ansatz = başlangıç, Zielfunktion = amaç fonksiyonu,
        // Nebenbedingung = kısıt ("Zaun an der Mauer" and "Probe" are in funktionen, tr-1); the surface of the tin is A (tr-1: yüzey alanı A), not O (rule below)
        'Parabel durch 3 Punkte': '3 noktadan geçen parabol', 'Kubisch: Extrempunkt + 2 Punkte': 'Üçüncü derece: ekstremum noktası + 2 nokta',
        'Kubisch: Wendepunkt mit Tangente + Punkt': 'Üçüncü derece: teğetiyle büküm noktası + nokta', 'Bedingungen': 'Koşullar',
        'Steigung im Wendepunkt $m$': 'Büküm noktasındaki eğim $m$', 'Funktion aus Bedingungen': 'Koşullardan fonksiyon',
        'Schachtel': 'Kutu', 'Dose': 'Konserve kutusu', 'Problem': 'Problem', 'Zielfunktion': 'Amaç fonksiyonu',
        'Lösung mit der Ableitung': 'Türevle çözüm', 'x in cm': 'x (cm)', 'V in cm³': 'V (cm³)', 'r in cm': 'r (cm)',
        'O in cm²': 'A (cm²)', 'x in m': 'x (m)', 'A in m²': 'A (m²)',
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // the derivative tasks (TASKS of ableiten): Potenz-/Summen-/Faktor-/Produktregel = kuvvet / toplam / sabitle çarpım / çarpım kuralı
        ['$ und $', '$ ve $'], ['$, und $', '$ ve $'], [', also $', ', yani $'],
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Kuvvet kuralı $(x^n)\' = n\\,x^{n-1}$ ve sabitle çarpım kuralı: Çarpan olduğu gibi kalır.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Toplam kuralı: Her terimin türevi ayrı ayrı alınır. Sabit bir terim düşer.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: ', 'Kuvvet kuralı rasyonel üsler için de geçerlidir: '],
        ['Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.', 'Toplam kuralı; $\\mathrm{e}^x$\'in türevi yine $\\mathrm{e}^x$\'tir.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit ', 'Çarpım kuralı $(u \\cdot v)\' = u\'v + uv\'$; burada '], ['Produktregel mit $u = ', 'Çarpım kuralı: $u = '],
        // the antiderivative tasks (TASKS of integrieren): Stammfunktion = ilkel fonksiyon (belirsiz integral), integrieren = integralini almak
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, ', 'Kuvvet kuralı tersinden: Üssü 1 artır, yeni üsse böl, '],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.',
            'Toplam ve sabitle çarpım kuralı: Her terimin integrali ayrı ayrı alınır, çarpan olduğu gibi kalır. Bir $a$ sabitinin ilkel fonksiyonu $ax$\'tir.'],
        ['$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$: üs $\\tfrac12 + 1 = \\tfrac32$; $\\tfrac32$\'ye bölmek $\\tfrac23$ ile çarpmak demektir.'],
        ['$: Exponent $-1$, durch $-1$ teilen, also $', '$: üs $-1$, $-1$\'e böl, yani $'],
        ['$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$: üs $\\tfrac12$; $\\tfrac12$\'ye bölmek iki katına çıkarmak demektir.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: ', 'Kuvvet kuralı her $r \\neq -1$ üssü için geçerlidir: '],
        ['$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$ kendi türevidir, dolayısıyla kendi ilkel fonksiyonudur da.'],
        ['Die Lücke der Potenzregel: ', 'Kuvvet kuralının boşluğu: '], ['. Für $x > 0$ reicht $\\ln x$.', '. $x > 0$ için $\\ln x$ yeterlidir.'],
        ['Lineare Verkettung: ', 'Doğrusal iç fonksiyon: '],
        ['. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', '. Kontrol: Zincir kuralı $a$ çarpanını verir, $\\tfrac1a$ onu yok eder.'],
        ['$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$: önce $\\sin$\'in ilkel fonksiyonu, sonra iç türev $a$\'ya böl.'],
        ['$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$: parantez için kuvvet kuralı, sonra iç türeve böl.'],
        // book tr-2 mathe12-tr:
        // grenzwert
        ['$x$ links', '$x$ (soldan)'], ['$x$ rechts', '$x$ (sağdan)'],
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$',
            'soldan $-\\infty$\'a, sağdan $+\\infty$\'a gider: limit yok, düşey asimptot $x = 1$'],
        ['wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert', 'sınırsız büyür: $f(x) \\to \\infty$, limit yok'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $',
            '$x = 1$ noktasında $f$ tanımsızdır, grafiğin orada bir deliği vardır. Limit yine de vardır: Sadeleştirince $'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', '$x = 0$\'da $f$ tanımsızdır. Değerler yine de 1\'e istenildiği kadar yaklaşır.'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'Grafik $x$ ekseni etrafında salınır, salınımlar giderek küçülür.'],
        ['Waagerechte Asymptote: $y = ', 'Yatay asimptot: $y = '],
        // sekante, ableitungsgraph
        ['$ mit $h = ', '$; $h = '], ['Sekantensteigung (Differenzenquotient): $', 'Kesenin eğimi (fark oranı): $'],
        ['Tangentensteigung: $f', 'Teğetin eğimi: $f'], ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· $h \\to 0$ için kesen teğete dönüşür.'],
        ['· Mach $h$ kleiner.', '· $h$\'yi küçült.'],
        // ableiten
        ['Leite ab: $f(x) = ', 'Türevini al: $f(x) = '], ['Das kann ich nicht lesen. Schreibe zum Beispiel ', 'Bunu okuyamıyorum. Örneğin şöyle yaz: '],
        ['<b>Richtig!</b>', '<b>Doğru!</b>'], ['Noch nicht. Tipp: ', 'Henüz değil. İpucu: '],
        // kurve
        ['Hochpunkt $H', 'Yerel maksimum noktası $T'], ['Tiefpunkt $T', 'Yerel minimum noktası $D'], ['keine Extrempunkte', 'ekstremum noktası yok'],
        [' · Sattelpunkt bei $x = ', ' · eyer noktası: $x = '], ['Wendepunkt $W', 'Büküm noktası $B'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am kleinsten.', '$: Orada $f\'\'(x) = 0$\'dır ve eğim en küçüktür.'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am größten.', '$: Orada $f\'\'(x) = 0$\'dır ve eğim en büyüktür.'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', '$a = 0$ için $f$, büküm noktası olmayan bir paraboldür (ya da doğrudur).'],
        // tangente
        ['$ · Berührpunkt $P', '$ · değme noktası $P'], ['Tangente: $', 'Teğet: $'],
        ['Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $', 'Normal (teğete dik, $m_n = -\\tfrac{1}{m_t}$): $'],
        // steckbrief
        ['Lösung: $f(x) = ', 'Çözüm: $f(x) = '], ['Ansatz: $f(x) = ', 'Başlangıç: $f(x) = '],
        ['Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.', 'Dikkat: $E$\'de $f\'\'(x) = 0$\'dır; bu bir eyer noktasıdır, ekstremum noktası değil.'],
        ['< 0$, also ein Hochpunkt.', '< 0$, yani bir yerel maksimum noktası.'], ['> 0$, also ein Tiefpunkt.', '> 0$, yani bir yerel minimum noktası.'],
        ['Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?',
            'Bu koşullarla denklem sisteminin tek bir çözümü yok. Aynı $x$\'e sahip iki nokta mı var?'],
        // optimieren
        ['Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?',
            '30 cm × 20 cm\'lik bir kartonun köşelerinden kenarı $x$ olan kareler kesiliyor ve kenarlar yukarı katlanıyor. Üstü açık kutunun hacmi hangi $x$ için en büyük olur?'],
        ['Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?',
            'Silindir biçimli bir konserve kutusu 1 litre almalı ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Hangi $r$ yarıçapında en az teneke gerekir?'],
        ['Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?',
            '60 m çitle bir duvarın kenarında dikdörtgen bir alan çevrilecek. Duvar bir kenarı oluşturuyor. Alan en çok ne kadar olur?'],
        ['$ ergibt $', '$ ise $'], ['$ mit $', '$, $'], ['(Maximum)', '(maksimum)'], ['(Minimum)', '(minimum)'],
        [' Die zweite Lösung $x \\approx ', ' İkinci çözüm $x \\approx '], ['$ liegt außerhalb von $0 < x < 10$.', '$, $0 < x < 10$ aralığının dışındadır.'],
        [' Dann ist $h = ', ' O zaman $h = '], ['\\,\\text{cm} = 2r$: Die beste Dose ist so hoch wie breit.', '\\,\\text{cm} = 2r$ olur: En iyi kutunun yüksekliği genişliğine eşittir.'],
        [' Die Seite parallel zur Mauer ist dann $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.', ' Duvara paralel kenar o zaman $60 - 2 \\cdot 15 = 30\\,\\text{m}$ uzunluğundadır.'],
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-2 mathe12-tr:
        // grenzwert: "$f(x) = …$ für $x \to 1$" → "$x \to 1$ için $f(x) = …$"
        [/(<p style="margin:0 0 8px">)(\$[^$]*\$) für (\$[^$]*\$)(<\/p>)/g, '$1$3 için $2$4'],
        // ableitungsgraph: "· Steigung in $P(1 | 2)$: …" → "· $P(1, 2)$ noktasındaki eğim: …"
        [/\$ · Steigung in \$P([^$]*)\$: /g, '$ · $P$1$ noktasındaki eğim: '],
        // ableiten: "· 3 von 5 gelöst" → "· 5 alıştırmadan 3'ü çözüldü"
        [/ · (\d+) von (\d+) gelöst/g, (m, a, b) => ' · ' + b + ' alıştırmadan ' + a + ' tanesi çözüldü'],
        // kurve, schar, steckbrief: the letters drawn alone on the canvas, H/T/W (Hochpunkt, Tiefpunkt, Wendepunkt) → T/D/B (tepe, dip,
        // büküm), in one pass so that the new T is not turned into D; only a string that is nothing but the letter
        [/^([HTW])$/, (m, l) => ({ H: 'T', T: 'D', W: 'B' }[l])],
        // optimieren: "Bei $x = 2 cm$: $V ≈ …$" → "$x = 2 cm$ için: $V ≈ …$"
        [/>Bei (\$[^$]*\$): /g, '>$1 için: '],
        // optimieren: the surface of the tin is A in Turkish schools (German O): "$O(r)", "$O'(r)", "$O \approx"
        [/(^|\$)O('?\(r\)| \\approx)/g, '$1A$2'],
    ]
});
