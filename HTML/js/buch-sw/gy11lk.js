/* js/buch-sw/gy11lk.js — Swahili for the widgets of js/buch-gy11lk.js.
 * Loaded by the Swahili editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy11lk', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // stetigkeit
        'zwei Parabel- und Geradenstücke': 'Vipande vya parabola na vya mstari', 'Parameter $a$': 'Kigezo $a$', 'Gerade und Wurzel': 'Mstari na kipeuo', 'Lücke füllen': 'Kujaza pengo',
        'Funktionswert $b$ an der Stelle 1': 'Thamani ya fanksheni $b$ kwenye nukta 1',
        'Abschnittsweise definierte Funktion mit Übergangsstelle': 'Fanksheni iliyofafanuliwa kwa vipande pamoja na nukta ya muunganiko',
        // linapprox
        'eˣ bei 0': 'eˣ kwenye 0', 'sin x bei 0': 'sin x kwenye 0', 'ln x bei 1': 'ln x kwenye 1', '√x bei 4': '√x kwenye 4', 'x² bei 1': 'x² kwenye 1',
        'Ausschnitt: halbe Breite $r$': 'Dirisha: nusu ya upana $r$',
        'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt': 'Grafu ya fanksheni na tanjenti katika dirisha linaloweza kupunguzwa',
        // produktregel
        'Zuwachs $h$ von $x$': 'Ongezeko $h$ la $x$',
        'Rechteck mit den Seiten u und v und seinem Zuwachs aus zwei Streifen und einer Ecke': 'Mstatili wenye pande u na v, na ongezeko lake la vipande viwili na pembe moja',
        // randextrema
        'Funktionsgraph mit einem Intervall, seinen lokalen und globalen Extrema': 'Grafu ya fanksheni kwenye muda, pamoja na maupeo yake ya ndani na ya jumla',
        'linker Rand $a$': 'mpaka wa kushoto $a$', 'rechter Rand $b$': 'mpaka wa kulia $b$',
        'lokales Maximum': 'upeo wa juu wa ndani', 'lokales Minimum': 'upeo wa chini wa ndani', 'Rand': 'mpaka', 'Art': 'Aina',
        'Globales Maximum': 'Upeo wa juu wa jumla', 'globales Minimum': 'upeo wa chini wa jumla',
        // rettung
        'Tempo im Sand $v_1$ (m/s)': 'Kasi mchangani $v_1$ (m/s)', 'Tempo im Wasser $v_2$ (m/s)': 'Kasi majini $v_2$ (m/s)', 'Sand': 'Mchanga', 'Wasser': 'Maji',
        'T in s': 'T kwa s',
        'Strand und Wasser: der Weg der Rettungsschwimmerin von A über den Punkt P an der Wasserlinie zum Schwimmer B':
            'Ufuo na maji: njia ya mwokoaji kutoka A kupitia nukta P kwenye ukingo wa maji hadi kwa mwogeleaji B',
        'Die Zeit T in Abhängigkeit vom Punkt x, an dem sie ins Wasser geht': 'Muda T kulingana na nukta x ambapo anaingia majini',
        // helpers of the module that check.mjs reads on every page loading gy11lk (epsdelta, verflechtung: not in LK 12)
        'Sprung bei 0': 'Mruko kwenye 0', 'Zucker': 'Sukari', 'Milch': 'Maziwa', 'Zartbitter': 'Chokoleti chungu', 'Vollmilch': 'Chokoleti ya maziwa',
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // verflechtung (H2.2; the product names Zucker, Milch, Zartbitter, Vollmilch are in the sw-4 block above, ME = vizio)
        'Tafeln „Classic“ $e_1$': 'Vipande vya chokoleti “Classic” $e_1$', 'Boxen „Mix“ $e_2$': 'Masanduku “Mix” $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Grafu ya Gozinto: malighafi tatu, bidhaa mbili za kati, bidhaa mbili za mwisho, kwenye mishale viasi vinavyohitajika',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-4 mathe12lk-sw:
        // stetigkeit (the rule below turns "Stetig an der Stelle 1:" first; the piece is for tools/buch-en/check.mjs)
        ['Stetig an der Stelle ', 'Endelevu kwenye nukta '],
        ['linksseitiger Grenzwert, rechtsseitiger Grenzwert und Funktionswert stimmen überein. Der Graph lässt sich ohne Absetzen zeichnen.',
            'kikomo cha upande wa kushoto, kikomo cha upande wa kulia na thamani ya fanksheni ni sawa. Grafu inaweza kuchorwa bila kuinua kalamu.'],
        ['Sprungstelle:</b> Die einseitigen Grenzwerte sind verschieden, der Graph springt um ', 'Nukta ya mruko:</b> Vikomo vya upande mmoja ni tofauti, grafu inaruka kwa '],
        ['. Stetig wird $f$ nur für $', '. $f$ inakuwa endelevu tu kwa $'],
        ['Hebbare Unstetigkeit:</b> Der Grenzwert ', 'Kutoendelea kunakoondolewa:</b> Kikomo '], [' existiert, aber der Funktionswert ist ', ' kipo, lakini thamani ya fanksheni ni '],
        ['. Mit $b = ', '. Kwa $b = '], ['$ wird die Lücke geschlossen.', '$ pengo linazibwa.'],
        // linapprox
        ['$, Tangente in $x_0 = ', '$, tanjenti kwenye $x_0 = '], ['$, also $f(x_0 + h) \\approx ', '$, kwa hiyo $f(x_0 + h) \\approx '],
        ['Am Rand des Ausschnitts ($h = \\pm', 'Kwenye ukingo wa dirisha ($h = \\pm'], ['$) weicht die Tangente höchstens um ', '$) tanjenti inatofautiana na mkunjo kwa si zaidi ya '],
        [' ab, das sind ', ', yaani '],
        [' pro Einheit von $h$. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.',
            ' kwa kila kizio cha $h$. Punguza $r$: kosa linapungua haraka kuliko $h$; ukiangalia karibu sana, mkunjo unafanana na tanjenti yake.'],
        // produktregel (the number rule of js/buch-sw.js has already made 1{,}5 into 1.5)
        ['$ bei $x = 1.5$. Wächst $x$ um $h$, wächst die Fläche $u \\cdot v$ um zwei Streifen und eine Ecke:', '$ kwenye $x = 1.5$. $x$ ikiongezeka kwa $h$, eneo $u \\cdot v$ linaongezeka kwa vipande viwili na pembe moja:'],
        ['Für $h \\to 0$ geht die Ecke $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ gegen $0 \\cdot v\'$, übrig bleibt $', 'Kwa $h \\to 0$, pembe $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ inaelekea $0 \\cdot v\'$, na kinachobaki ni $'],
        ['$: die <b>Produktregel</b>.', '$: <b>kanuni ya zao</b>.'],
        // randextrema (the interval: rule below)
        ['$ auf $[', '$ kwenye $['],
        [']$. Kandidaten: die Stellen mit $f\'(x) = 0$ und Vorzeichenwechsel im Inneren, dazu die beiden Ränder.', ']$. Nukta zinazowezekana: nukta za ndani zenye $f\'(x) = 0$ na mabadiliko ya ishara, pamoja na mipaka miwili.'],
        [' auf dem Intervall. ', ' kwenye muda huu. '],
        ['Ein globales Extremum liegt am <b>Rand</b>: Dort ist $f\'$ nicht null.', 'Upeo mmoja wa jumla uko <b>mpakani</b>: Hapo $f\'$ si sifuri.'],
        ['Hier liegen beide globalen Extrema im Inneren.', 'Hapa maupeo yote mawili ya jumla yako ndani ya muda.'],
        // rettung
        ['Bei $x = ', 'Kwa $x = '], ['$ m braucht sie ', '$ m anahitaji '], [' s, am schnellsten ist sie bei ', ' s; anakuwa wa haraka zaidi kwa '],
        ['$ m</b> mit ', '$ m</b>, kwa '], [' s (grün).', ' s (kijani).'],
        ['Winkel zum Lot: im Sand $\\alpha = ', 'Pembe na normali: mchangani $\\alpha = '], ['$, im Wasser $\\beta = ', '$, majini $\\beta = '],
        ['$. Im Optimum ist $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: ', '$. Kwenye hali bora kabisa $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: '],
        ['$ und $\\dfrac{\\sin ', '$ na $\\dfrac{\\sin '], ['$, das Brechungsgesetz.', '$: sheria ya Snell ya mnyumbuliko wa mwanga.'],
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // verflechtung
        ['Zwischenprodukte: $\\vec{z} = B', 'Bidhaa za kati: $\\vec{z} = B'], ['Rohstoffe: $\\vec{r} = A', 'Malighafi: $\\vec{r} = A'],
        ['In einem Schritt: $C = A', 'Kwa hatua moja: $C = A'], ['$ gibt den Rohstoffbedarf je Endprodukt an, und $C', '$ inatoa mahitaji ya malighafi kwa kila bidhaa ya mwisho, na $C'],
    ],
    rule: [
        // book sw-4 mathe12lk-sw:
        // stetigkeit: "<b>Stetig an der Stelle 1:</b>"
        [/<b>Stetig an der Stelle ([^:<]+):<\/b>/g, '<b>Endelevu kwenye nukta $1:</b>'],
        // randextrema: the interval "[-2;\, 3]" (a space after \,, which the interval rule of js/buch-sw.js does not read) → "[-2, 3]"
        [/\[([-−]?\d+(?:\.\d+)?);\\, ([-−]?\d+(?:\.\d+)?)\]/g, '[$1, $2]'],
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
        // verflechtung: the quantities in the graph ">12 ME<" → ">vizio 12<", the sentence with the raw materials
        [/>(\d+) ME</g, '>vizio $1<'],
        [/Für (\d+) Tafeln und (\d+) Boxen braucht man <b>(\d+) ME Kakao, (\d+) ME Zucker und (\d+) ME Milch<\/b>\./g,
            (m, a, b, c, d, e) => 'Kwa vipande ' + a + ' vya chokoleti na masanduku ' + b + ' unahitaji <b>vizio ' + c + ' vya kakao, vizio ' + d + ' vya sukari na vizio ' + e + ' vya maziwa</b>.'],
    ]
});
