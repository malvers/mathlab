/**
 * i18n extension for Index/Dashboard page — Kiswahili (sw).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-sw.js");
        return;
    }
    const t = (CyberI18n.translations.sw = CyberI18n.translations.sw || {});
    t.index = {
            admin_gate: {
                title: "ANGALIA IDHINI",
                pwd_placeholder: "Nenosiri",
                access: "INGIA",
                cancel: "GHAIRI"
            },
            ui: {
                coffee_title: "Nunua „Cyber-Coffee“",
                about_title: "Utangulizi wa sinema — Doc Alvers",
                qr_title: "Msimbo wa QR wa ukurasa huu",
                sound_title: "Sauti ya mandhari",
                search_placeholder: "ANZA UCHUNGUZI WA MAABARA...",
                mission_start: "Anza misheni",
                all_tools: "Zana zote",
                tools_subtitle_word: "Zana",
                tools_filter_hits: "MATOKEO YAMEPATIKANA",
                tools_no_results: "Hakuna matokeo ya \"{query}\"",
                tools_close_aria: "Funga muhtasari wa zana na urudi kwenye uchaguzi wa maabara",
                tools_footer_aria: "Sehemu ya chini",
                tools_universe_aria: "Fungua Universe · matunzio ya maabara angani",
                tools_doc_title: "Maabara ya Cyber | Mission Control",
                education: "ELIMU",
                games: "Michezo",
                lgs: "Mifumo ya milinganyo",
                pythagoras: "Mfano wa Pythagoras",
                triangles: "Pembetatu",
                arithmetic: "Operesheni za msingi",
                hot_stuff: "Mengine mengi",
                neu: "Mpya",
                apps: "Programu",
                fun: "Burudani",
                functions: "Vitendaji",
                highlights: "Vipaumbele",
                fraktale: "Fractal",
                university: "Chuo kikuu",
                themes_count: "Mada",
                themes_top5_title: "Top Labs",
                grade_title: "Daraja",
                grade_uni: "Chuo",
                grade_uni_tip: "Chuo kikuu · maabara magumu zaidi (uchambuzi, fizikia, fractal, …)",
                grade_back_tip: "Rudi kwenye uchaguzi wa mada",
                universe_tip: "Ulimwengu · matunzio ya maabara angani",
                credits: "SHUKRANI",
                impressum: "TAARIFA YA KISHERIA"
            },
            contact: {
                title: "Wasiliana",
                desc: "Je, una maswali, maoni au mawazo ya moduli mpya za maabara? Ninafurahi kwa kila ujumbe — iwe kuhusu hisabati, mbinu za kufundishia au ushirikiano wa kiufundi.",
                close: "FUNGA"
            },
            qr: {
                title: "Msimbo wa QR",
                desc: "Changanua kwa simu yako - chukua ukurasa huu nawe."
            },
            donate: {
                title: "Nunua Cyber-Coffee",
                desc: "Je, unapenda maabara zinazoingiliana na unataka kusaidia maendeleo zaidi ya Maabara ya Mtandao? Ninathamini kila kahawa pepe ambayo hunifanya niwe macho ninapoandika usiku! ☕️🚀",
                paypal: "CHANGIA SASA KWA PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "ULIMWENGU SHIRIKISHI WA HISABATI",
                author: "na Dk. Michael R. Alvers"
            },
            view: {
                back_title: "Nyuma",
                title: "MTAZAMO WA MAABARA"
            },
            admin: {
                active: "HALI YA UHARIRISHAJI INAENDELEA",
                export: "Hamisha mabadiliko",
                exit: "Toka"
            },
            labs: {
                "fourier": { title: "Mabadiliko ya Fourier", description: "Muziki wa hisabati. Kutenganisha maumbo changamano katika oscillations ya mduara wa harmonic." },
                "mandelbrot-deep": { title: "Fractals", description: "Mandelbrot na Julia wanaweka katika ndege changamano: mienendo ya wakati wa kutoroka ya z↦z²+c kupitia urudiaji wa kipande cha kishamiri cha GPU; uchunguzi wa parametric wa c na kina cha kurudia badilika kando ya mpaka wa fractal." },
                "atomorbitale": { title: "Obiti za Atomiki", description: "Ulinganifu wa spherical Y_ℓ^m katika 3D: mawingu ya uwezekano na nambari za quantum." },
                "galtonboard": { title: "Bodi ya Galton", description: "Uigaji mwingiliano wa usambazaji wa kawaida. Tazama curve ya kengele ikiibuka moja kwa moja." },
                "opti-lens": { title: "Uboreshaji wa Lenzi", description: "Uboreshaji wa lenzi ya mabadiliko (CMA-ES): uigaji wa miale ya wakati halisi na utafutaji wa umakini." },
                "addition": { title: "Nyongeza iliyoandikwa", description: "Jifunze kuongeza maandishi hatua kwa hatua. Inaonyesha muundo wa safu." },
                "subtraktion": { title: "Kutoa kwa maandishi", description: "Treni kutoa kwa maandishi kwa kukopa hatua kwa hatua." },
                "multiplikation": { title: "Kuzidisha kwa maandishi", description: "Huonyesha taswira ya kuzidisha maandishi hatua kwa hatua." },
                "dividieren": { title: "Idara iliyoandikwa", description: "Mgawanyiko mkuu wa maandishi na maabara shirikishi ya ULTRA." },
                "cmaes": { title: "Uboreshaji wa uso", description: "CMA-ES katika muda halisi: uboreshaji wa mageuzi ya poligoni zilizofungwa na mtaro wa fomu huria." },
                "transformationen": { title: "Ulinganifu", description: "Gundua mzunguko, tafsiri na kuongeza pembetatu kwa maingiliano." },
                "winkelsumme3d": { title: "Jumla ya Pembe ya 3D", description: "Furahia jumla ya pembe katika nafasi ya 3D. Taswira yenye nguvu." },
                "ausgleichsgerade": { title: "Mstari unaofaa zaidi", description: "Pata mstari bora kupitia wingu la uhakika. Kuelewa urejeshaji wa mstari." },
                "binomischeslabor": { title: "Mfumo wa 1 wa Binomial", description: "Tazama fomula za binomial kijiometri kupitia mtengano wa eneo." },
                "triangulierer": { title: "Delaunay", description: "Algorithms ya pembetatu. Tengeneza matundu ya pembetatu bora." },
                "differentiallabor": { title: "Maabara ya Tofauti", description: "Hesabu kuu ya kutofautisha. Uhusiano kati ya kazi na derivative." },
                "parabellabor": { title: "Parabolas", description: "Udanganyifu wa kazi za quadratic. Kuelewa ushawishi wa vigezo." },
                "potenzlabor": { title: "Maabara ya Nguvu", description: "Chunguza tabia ya nguvu na vitendaji vya mizizi kwa maingiliano." },
                "steigung": { title: "Maabara ya Mteremko", description: "Kuelewa mteremko wakati wowote kwenye curve. Msingi wa uchambuzi." },
                "winkellabor": { title: "Maabara ya pembe", description: "Uchunguzi shirikishi wa jumla ya pembe na aina za pembetatu." },
                "uhrzeitwinkel": { title: "Maabara ya Angle-Clock", description: "Chunguza pembe kati ya mikono ya saa wakati wowote wa siku." },
                "logikspiel": { title: "Puzzle ya Nambari", description: "Kuwa bwana wa matrix! Tatua gridi za nambari changamano." },
                "integralreaktor": { title: "Viunganishi", description: "Nishati ya eneo hilo. Taswira ya hesabu za Riemann na mbinu za kukadiria." },
                "lissajous": { title: "Lissajous", description: "Superposition ya oscillations mbili harmonic: frequency na awamu." },
                "cool-squares": { title: "Miraba ya kuvutia", description: "Uthibitisho wa kijiometri wa hali ya juu. Fuata mzunguko wa miraba." },
                "fibonacci": { title: "Maabara ya Fibonacci", description: "Gundua mzunguko wa dhahabu na mifumo ya ukuaji wa kikaboni." },
                "fermatpunkt": { title: "Sehemu ya Fermat", description: "Tafuta uhakika na jumla ndogo ya umbali hadi wima." },
                "gleichungssysteme": { title: "Maabara ya LSE", description: "Gundua Mifumo ya Milingano ya Milingano kwa macho kupitia mistari." },
                "pythagoras": { title: "Pythagoras", description: "Gundua nadharia ya Pythagorean kupitia ulinganisho wa eneo shirikishi." },
                "pythagorasbeweis": { title: "Uthibitisho wa Pythagoras", description: "Uthibitisho wa kijiometri wa nadharia ya Pythagorean kwa mtengano wa eneo." },
                "gleichschenkligesDreieck": { title: "Pembetatu ya Isosceles", description: "Kuhesabu pembetatu maalum na mali zao kwa maingiliano." },
                "eulergerade": { title: "Euler Feuerbach na Napoleon", description: "Jiometri ya kuvutia ya pembetatu: Mstari wa Euler na mduara wa Feuerbach." },
                "easyhard": { title: "Jiometri Puzzle", description: "Kitendawili cha kijiometri cha changamoto. Amua pembe inayokosekana." },
                "winkelsumme": { title: "Maabara ya Polygon", description: "Kokotoa jumla ya pembe katika n-gon yoyote." },
                "beweisinwinkellsumme": { title: "Uthibitisho wa Angle ya Ndani", description: "Kwa nini jumla ya pembe katika pembetatu daima ni 180 °? Ushahidi hatua kwa hatua." },
                "butterfly": { title: "Kipepeo Curve", description: "Mviringo wa kuvuka mipaka unaovutia unaofafanuliwa na viwianishi vya polar." },
                "heart3d": { title: "Uso wa Moyo wa 3D", description: "Taswira ya uso dhabiti wa 3D nyuma ya moyo wa hisabati." },
                "litchi3d": { title: "Maabara ya Litchi 3D", description: "Gundua hisabati changamano ya uso wa 3D kwa maingiliano." },
                "cinematic-intro": { title: "Utangulizi wa Sinema", description: "Furahia mwanzo mkubwa katika maabara ya Doc Alvers. ULTRA v5.3.8 Utambulisho Unaoonekana." },
                "stanford-portal": { title: "Chuo Kikuu cha Stanford", description: "Chuo kikuu cha utafiti wa wasomi huko Silicon Valley: utafiti wa juu, maoni wazi na utamaduni wa chuo kikuu." },
                "happy-birthday-ulf": { title: "Heri ya Siku ya Kuzaliwa Ulf!", description: "Mshangao wa hisabati kwa siku ya kuzaliwa. Sherehekea pamoja na Doc Alvers!" }
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Hesabu moja, viwango vinne chini: lugha ya juu, asemblia, baiti za mashine na kikusanyaji kamili kilichoundwa kwa geti za mantiki. Habari hiyo hiyo katika kila kiwango, ni uondoaji mmoja tu wa ndani zaidi." },
                "solita": { title: "Solita", description: "Solita — msaidizi wako wa sauti (Claude) katika Maabara ya Hisabati ya Doc Alvers. Zungumza, sikiliza usomaji, hifadhi muktadha." },
                "gameoflife": { title: "Game of Life", description: "Otomatiki ya seli ya Conway: kutoka kanuni tatu rahisi huzuka vitelezi, viondosho na ulimwengu mzima. Chora mchoro wa kuanzia na tazama utaratibu na vurugu vikipishana." },
                "burningship": { title: "Burning Ship", description: "Fractal dada mweusi wa seti ya Mandelbrot: thamani moja kamili katika fomula ya marudio huifanya meli zinazowaka zionekane upeo wa macho. Karibia muundo unaowaka." },
                "reaction-diffusion": { title: "Mwitikio-Usambaaji", description: "Michoro ya Turing moja kwa moja: kemikali mbili huitikia na kusambaa, na hutokea milia, madoa na matumbawe kama kwenye manyoya ya wanyama. Rekebisha ulishaji na uharibikaji na kuza michoro yako." },
                "gravitation": { title: "Uvutano", description: "Sheria ya uvutano ya Newton kwa mkono: weka uzito angani, wape mwendo wa kuanzia na tazama mizingo, unasaji na migongano katika mchezo wa miili mingi." },
                "glocken": { title: "Kengele za Baghdad", description: "Kengele zote hupigwa pamoja lini? Hadithi kutoka Baghdad inaelekeza kwenye kizidishi kidogo cha pamoja, na mkufunzi anayekusaidia hatua kwa hatua hadi KKP na sehuu." },
                "langley": { title: "Maabara ya Langley", description: "Kitendawili maarufu cha pembe cha Langley cha 1922: pembetatu ya miguu sawa, mistari miwili ya ndani, na pembe moja iliyoudhi ulimwengu kwa miaka mia moja. Pima, jaribu, thibitisha." },
                "batman": { title: "Mkunjo wa Batman", description: "Mlingano mmoja ambao grafu yake huchora alama ya Batman: thamani kamili, mizizi na utenganishaji wa hali kama hisabati ya mashujaa. Vunja fomula kipande kwa kipande." },
                "worldclock": { title: "Saa ya dunia", description: "Dunia kama saa: mikanda ya saa, mahali pa Jua na mstari wa mchana-usiku moja kwa moja kwenye ramani ya dunia. Tazama jua linapochomoza wakati hapa ni usiku wa manane." },
                "tracker": { title: "Doc Alvers Tracker", description: "Ufuatiliaji wa GPS kama programu ya wavuti: rekodi safari na wasifu wa mwinuko, alama za picha, sauti na maarifa, rada ya mvua na kushiriki moja kwa moja. Hufanya kazi kwenye kivinjari na kama programu ya Android." },
                "kaimbo": { title: "Kaimbo Studio", description: "Kujifunza lugha kwa orodha zako za kazi: panga, chuja na fanyia mazoezi msamiati na sentensi kama mfululizo wa kazi. Studio ya chombo cha lugha cha Doc, sasa kwenye kivinjari." },
                "pagode": { title: "Pagode (230 SL)", description: "Mercedes 230 SL ya 1964 inakutana na Bluetooth: washa injini kwa redio, jaribu njia, chunguza mchoro wa waya unaoshirikisha, na Solita anajifunza kuendesha. Umeme wa gari la kale na udhibiti wa mbali wa AI." },
                "voicerecorder": { title: "Kirekodi sauti", description: "Rekodi na andika moja kwa moja: sema, kinasikiliza, kinaandika na kinahifadhi. Kwenye kivinjari kwa Web Speech API, kama programu ya Android kwa utambuzi wa sauti wa asili." },
                "mathtrainer": { title: "MathTrainer", description: "Fanya mazoezi ya hisabati kwa mfululizo wa kazi: hesabu za kichwa na mazoezi ya shule, chagua mfululizo, ongeza kasi. School is cool: SchoolTrainer kama programu ya wavuti." },
                "pinkerfinder": { title: "PinkerFinder", description: "Finder ya macOS imejengwa upya 1:1 — pamoja na vipengele vya utafutaji: ukubwa wa folda kwenye orodha, nakala zinazofanana kwa maudhui, utafutaji wa vipengele kwenye Mac nzima, usasishaji wa moja kwa moja. Programu asilia ya Mac, upakuaji wa bure." },
                "imaginarynumbers": { title: "Namba za kuwazia", description: "Namba changamano katika uwanda wa Gauss: sehemu halisi, sehemu ya kuwazia na kipimo cha kuwazia — gundua kwa kushirikiana." },
                "kovarianz": { title: "Kovarianti", description: "Ramani ya mstari A hunyoosha, huzungusha na kupinda uwanda. Ikitumika kwa wingu la nukta duara, hugeuka kuwa duaradufu — na umbo lake hasa ndilo lililoandikwa katika matriki ya kovarianti: kutoka Σ₀ = σ²E hupatikana Σ = A Σ₀ Aᵀ. Weka matriki seli kwa seli au buruta duaradufu ya picha moja kwa moja kwa kishikio; Σ, uhusiano na vekta maalum kama shoka kuu hukokotolewa papo hapo kutoka nukta zilizochorwa. Ikiwa na mtawanyo wa kawaida na sare, viwianishi sare na mistari sambamba inayoonyesha ramani inavyotenda kwa mistari nyoofu." },
                "irisvis": { title: "Conway's Iris", description: "Katika kila pembe, ongeza pande zote mbili kwa urefu wa upande unaokabili — ncha sita hukaa kwenye duara linalozunguka kitovu cha duara la ndani, R = √(r²+(s+d)²). Tao sita kama vifuta-kioo hutengeneza kwazo mkunjo wa upana thabiti; mraba huufunika katika kila mzunguko, na CMA-ES hutafuta nafasi yake papo hapo. Pamoja na mionekano ya uthibitisho, ramani-joto ya eneo la utafutaji na pembetatu ya Reuleaux kwa kubonyeza kitufe." },
                "ascii": { title: "Sanaa ya ASCII", description: "Picha ni namba: gawa picha, mtiririko wa moja kwa moja wa kamera au mfano katika seli, kokotoa thamani ya kijivu, chagua herufi — kama herufi, kwa rangi, nusu-toni au breli, pamoja na dithering. Kubofya herufi kunaonyesha hesabu kamili ya seli hiyo hasa; katika ngazi ya 2 wanafunzi wenyewe huandika ramani thamani ya kijivu → herufi." },
                "neuroaddierer": { title: "Kijumlishi kilichojifunza", description: "Katika lab 1 + 1 = 2 vijumlishi kamili vimeunganishwa kwa waya — hapa hakuna waya hata mmoja. Mtandao mdogo sana wa neva wenye namba 32 huonyeshwa safu nane tu za jedwali la ukweli, na unapaswa kugundua kujumlisha wenyewe: kwa mageuko (CMA-ES), bila kutumia derivative. Kisha nakala nane za mtandao uliojifunza hukokotoa mfululizo kila jumla hadi 255 — na huona kwamba matokeo yake si 0 wala 1 kamili, bali 0,03 na 0,97." },
                "shell": { title: "Shell", description: "Muundo kwenye kome la baharini hutokeaje? Sura sita hujenga utaratibu kipande kimoja baada ya kingine: picha ni kumbukumbu — seli moja huwaka na kuandika herufi V — mawimbi mawili hujifuta na kukata ncha ya hema — chakula kilichotumika kinaeleza kwa nini. Juu kuna ukingo hai wa mdomo, chini kome hukua. Kwa kitufe cha hatua moja." },
                "conuslab": { title: "Conus", description: "Kwa nini konokono wa Conus huvaa zigizagi na mahema? Gamba hukua tu kwenye ukingo wa mdomo — safu moja tu ya seli huamua ‘rangi ndiyo/hapana’, na kila mstari wa ukuaji hubaki milele. Kwa hivyo muundo ni chati ya nafasi na wakati. Hapa unaendeshwa papo hapo: mawimbi ya rangi yanayosafiri, yanayofutana yanapogongana na hivyo kukata mahema — kando yake athari ile ile kama otomatiki ya seli (kanuni 30)." },
                "costablanca": { title: "Vivutio vya Costa Blanca", description: "Safari za Costa Blanca za kuweka alama: maeneo 22 yaliyochunguzwa kutoka Altea hadi Valencia yakiwa na picha, vidokezo vya wenyeji na upau wa maendeleo — kwa lugha nne (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Ubadilishanaji wa funguo kwa kanuni ya kwanta ya Bennett na Brassard: Alice hutuma fotoni moja moja, kila moja katika mojawapo ya besi mbili — + yenye hali — na |, au × yenye / na \\. Bob huchagua besi yake kwa nasibu: besi ile ile humaanisha jibu la uhakika, besi tofauti humaanisha bahati tupu. Kupitisha kishale juu ya safu hueleza fotoni hiyo hasa. Akiwepo msikilizaji Eve, kiwango cha makosa katika sehemu inayolinganishwa hadharani hupanda hadi robo — uwezekano wa kugunduliwa ni 1 − (3/4)^m, na mizunguko elfu kwa kubonyeza kitufe huonyesha kuwa ni kweli hivyo. Pamoja na hali ya kufundishia inayopitia kila kisa mara moja." },
                "jacquard": { title: "Jacquard", description: "Mtambo wa kufuma wa mwaka 1805, katika 3D — mashine ya kwanza inayotengeneza picha kwa kufuata mpango ulioandikwa. Kadi yenye matundu huongoza kila uzi wa tando peke yake: palipo na tundu sindano hupenya, kulabu hubaki na kisu huinua uzi; palipo na karatasi uzi hubaki chini na uzi wa buluu wa upande humfunika. Kadi baada ya kadi picha hukua kutoka kwenye mashine. Muundo na mashine ni vitu viwili tofauti: duara lile lile huwa duara zaidi likiwa na nyuzi nyingi, na pale mchoro ulipo laini kuliko nguo, mtambo hufuma muundo usiokuwepo kabisa kwenye asili." },
                "koerper": { title: "Miili", description: "Miili ya Plato, ya Archimedes na ya Catalan, mche, mche-pinduzi, piramidi na maumbo ya duara — inayozungushwa katika 3D, ikiwa na eneo la uso, ujazo, vipenyo-nusu vya tufe la nje, la ukingo na la ndani, pembe za nyuso mbili na fomula moja kwa moja kulingana na urefu wa ukingo. Kila mwili unaweza kukunjuliwa kuwa wavu wake kwa kitelezi; miili ya Catalan huzaliwa kama duo za ile ya Archimedes kwa upolaritee kwenye tufe la ukingo." },
                "brahmagupta": { title: "Nadharia ya Brahmagupta", description: "Pembenne yenye pembe zake nne kwenye duara, ambayo mishazari yake hukatana kwa pembe ya nyuzi 90 — na maelezo mawili juu yake, yote kutoka kwa Brahmagupta (karne ya 7, India). Nadharia: kutoka mahali mishazari inapokatana, yaani P, shusha mstari wima hadi upande mmoja kisha uendeleze zaidi ya P; utakutana na upande wa kinyume katikati yake hasa — kwa sababu P pamoja na ncha zile mbili hutengeneza pembetatu yenye pembe ya nyuzi 90, na mguu wa mstari huo ni kitovu cha duara lake la nje. Fomula: K = √((s−a)(s−b)(s−c)(s−d)) hutoa eneo, lakini tu wakati pembe zote nne zipo kwenye duara. Ukiziondoa hapo, K hutoka kubwa mno — Heron kwa pembenne, ikiwa na sharti." }
            }
    };
})();
