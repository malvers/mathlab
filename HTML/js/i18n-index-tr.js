/**
 * i18n extension for Index/Dashboard page — Türkçe (tr).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-tr.js");
        return;
    }
    const t = (CyberI18n.translations.tr = CyberI18n.translations.tr || {});
    t.index = {
            admin_gate: {
                title: "YETKİLENDİRMEYİ KONTROL EDİN",
                pwd_placeholder: "Şifre",
                access: "ERİŞİM",
                cancel: "İPTAL"
            },
            ui: {
                coffee_title: "Siber Kahve Satın Alın",
                about_title: "Sinematik Giriş — Doc Alvers",
                qr_title: "Bu sayfanın QR Kodu",
                sound_title: "Ortam Sesi",
                search_placeholder: "LABORATUVAR TARAMASINI BAŞLATIN...",
                mission_start: "Görevi Başlat",
                all_tools: "Tüm Araçlar",
                tools_subtitle_word: "Araçlar",
                tools_filter_hits: "EŞLEŞMELER BULUNDU",
                tools_no_results: "\"{query}\" için eşleşme yok",
                tools_close_aria: "Araçlara genel bakışı kapatın ve laboratuvar seçimine dönün",
                tools_footer_aria: "Altbilgi",
                tools_universe_aria: "Açık Evren · uzaydaki laboratuvar galerisi",
                tools_doc_title: "Siber Laboratuvar | Görev Kontrolü",
                education: "EĞİTİM",
                games: "Oyunlar",
                lgs: "Denklem Sistemleri",
                pythagoras: "Pisagor Teoremi",
                triangles: "Üçgenler",
                arithmetic: "Temel Aritmetik",
                hot_stuff: "Sıcak şeyler",
                neu: "Yeni",
                apps: "Uygulamalar",
                fun: "Eğlenceli",
                functions: "İşlevler",
                highlights: "Öne Çıkanlar",
                fraktale: "Fraktallar",
                university: "Üniversite",
                themes_count: "Temalar",
                themes_top5_title: "Top Labs",
                grade_title: "Sınıf",
                grade_uni: "Üni",
                grade_uni_tip: "Üniversite · özellikle karmaşık laboratuvarlar (Analiz, Fizik, Fraktallar, …)",
                grade_back_tip: "Tema seçimine geri dön",
                universe_tip: "Evren · Uzaydaki laboratuvar galerisi",
                credits: "KREDİLER",
                impressum: "KÜNYE"
            },
            contact: {
                title: "İletişim",
                desc: "Yeni laboratuvar modülleri için sorularınız, geri bildirimleriniz veya fikirleriniz mi var? İster matematikle, ister didaktik kavramlarla, ister teknik işbirliğiyle ilgili olsun, her mesajı sabırsızlıkla bekliyorum.",
                close: "KAPAT"
            },
            qr: {
                title: "QR Kodu",
                desc: "Telefonunuzla tarayın; bu sayfayı yanınıza alın."
            },
            donate: {
                title: "Siber Kahve Satın Alın",
                desc: "İnteraktif laboratuvarları beğeniyor musunuz ve Siber Laboratuvarın daha da geliştirilmesini desteklemek mi istiyorsunuz? Geceleri kod yazarken beni uyanık tutan her sanal kahveyi takdir ediyorum! ☕️🚀",
                paypal: "ŞİMDİ PayPal İLE BAĞIŞ YAPIN"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "ETKİLEŞİMLİ MATEMATİK EVRENİ",
                author: "Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Geri",
                title: "LABORATUVAR GÖRÜNÜMÜ"
            },
            admin: {
                active: "EDİTÖR MODU AKTİF",
                export: "Değişiklikleri Dışa Aktar",
                exit: "Çıkış"
            },
            labs: {
                "fourier": { title: "Fourier Dönüşümü", description: "Matematiğin müziği. Karmaşık şekilleri harmonik dairesel salınımlara ayrıştırın." },
                "mandelbrot-deep": { title: "Fraktallar", description: "Mandelbrot ve Julia karmaşık düzlemi ortaya koyuyor: GPU parça gölgelendirici yinelemesi aracılığıyla z↦z²+c'nin kaçış zamanı dinamikleri; Fraktal sınır boyunca uyarlanabilir yineleme derinliği ile c'nin parametrik keşfi." },
                "atomorbitale": { title: "Atomik Orbitaller", description: "3 boyutlu küresel harmonikler Y_ℓ^m: olasılık bulutları ve kuantum sayıları." },
                "galtonboard": { title: "Galton Kurulu", description: "Normal dağılımın etkileşimli simülasyonu. Çan eğrisinin ortaya çıkışını canlı izleyin." },
                "opti-lens": { title: "Mercek Optimizasyonu", description: "Evrimsel lens optimizasyonu (CMA-ES): gerçek zamanlı ışın simülasyonu ve odak arama." },
                "addition": { title: "Yazılı Ek", description: "Yazılı eklemeyi adım adım öğrenin. Sütun yapısını görselleştirir." },
                "subtraktion": { title: "Yazılı Çıkarma", description: "Adım adım ödünç alma ile yazılı çıkarma işlemini eğitin." },
                "multiplikation": { title: "Yazılı Çarpma", description: "Yazılı çarpma işlemini adım adım görselleştirir." },
                "dividieren": { title: "Yazılı Bölüm", description: "Etkileşimli ULTRA laboratuvarıyla yazılı bölümde ustalaşın." },
                "cmaes": { title: "Yüzey Optimizasyonu", description: "Gerçek zamanlı CMA-ES: kapalı çokgenlerin ve serbest biçimli konturların evrimsel gelişimi." },
                "transformationen": { title: "Uyumluluk", description: "Bir üçgenin dönüşünü, ötelenmesini ve ölçeklenmesini etkileşimli olarak keşfedin." },
                "winkelsumme3d": { title: "3D Açı Toplamı", description: "3 boyutlu uzayda açıların toplamını deneyimleyin. Dinamik görselleştirme." },
                "ausgleichsgerade": { title: "En Uygun Çizgi", description: "Bir nokta bulutu boyunca en iyi çizgiyi bulun. Doğrusal regresyonu anlayın." },
                "binomischeslabor": { title: "1. Binom Formülü", description: "Alan ayrıştırması yoluyla binom formüllerini geometrik olarak görselleştirin." },
                "triangulierer": { title: "Delaunay", description: "Üçgenleme algoritmaları. Optimum üçgen ağlar oluşturun." },
                "differentiallabor": { title: "Diferansiyel Laboratuvarı", description: "Ana diferansiyel hesabı. Fonksiyon ve türev arasındaki ilişki." },
                "parabellabor": { title: "Paraboller", description: "İkinci dereceden fonksiyonların manipülasyonu. Parametrelerin etkisini anlayın." },
                "potenzlabor": { title: "Güç Laboratuvarı", description: "Güç ve kök işlevlerinin davranışını etkileşimli olarak keşfedin." },
                "steigung": { title: "Şev Laboratuvarı", description: "Bir eğrinin herhangi bir noktasındaki eğimi anlayın. Analizin temeli." },
                "winkellabor": { title: "Açı Laboratuvarı", description: "Açı toplamları ve üçgen türlerinin etkileşimli incelenmesi." },
                "uhrzeitwinkel": { title: "Açı-Saat Laboratuvarı", description: "Günün herhangi bir saatinde saatin ibreleri arasındaki açıyı inceleyin." },
                "logikspiel": { title: "Sayı Bulmaca", description: "Matrisin ustası olun! Karmaşık sayı ızgaralarını çözün." },
                "integralreaktor": { title: "İntegraller", description: "Bölgenin enerjisi. Riemann toplamlarını ve yaklaşım yöntemlerini görselleştirin." },
                "lissajous": { title: "Lissajous", description: "İki harmonik salınımın süperpozisyonu: frekans ve faz." },
                "cool-squares": { title: "Soğuk Kareler", description: "Nihai geometrik kanıt. Karelerden oluşan spirali takip edin." },
                "fibonacci": { title: "Fibonacci Laboratuvarı", description: "Altın sarmalı ve organik büyüme modellerini keşfedin." },
                "fermatpunkt": { title: "Fermat Noktası", description: "Köşelere olan mesafelerin toplamı en az olan noktayı bulun." },
                "gleichungssysteme": { title: "LSE Laboratuvarı", description: "Doğrusal Denklem Sistemlerini çizgiler aracılığıyla görsel olarak keşfedin." },
                "pythagoras": { title: "Pisagor", description: "Etkileşimli alan karşılaştırmaları yoluyla Pisagor teoremini keşfedin." },
                "pythagorasbeweis": { title: "Pisagor Kanıtı", description: "Pisagor teoreminin alan ayrıştırmasıyla geometrik kanıtı." },
                "gleichschenkligesDreieck": { title: "İkizkenar Üçgen", description: "Özel üçgenleri ve özelliklerini etkileşimli olarak hesaplayın." },
                "eulergerade": { title: "Euler Feuerbach ve Napolyon", description: "Üçgenin büyüleyici geometrisi: Euler çizgisi ve Feuerbach çemberi." },
                "easyhard": { title: "Geometri Bulmacası", description: "Zorlu bir geometrik bilmece. Eksik açıyı belirleyin." },
                "winkelsumme": { title: "Poligon Laboratuvarı", description: "Herhangi bir n-gendeki açıların toplamını hesaplayın." },
                "beweisinwinkellsumme": { title: "İç Açı Kanıtı", description: "Bir üçgende açıların toplamı neden her zaman 180°'dir? Adım adım kanıt." },
                "butterfly": { title: "Kelebek Eğrisi", description: "Kutupsal koordinatlarla tanımlanan büyüleyici bir aşkın eğri." },
                "heart3d": { title: "3D Kalp Yüzeyi", description: "Matematiksel kalbin arkasında örtülü bir 3 boyutlu yüzeyin görselleştirilmesi." },
                "litchi3d": { title: "3D Litchi Laboratuvarı", description: "Karmaşık 3 boyutlu yüzey matematiğini etkileşimli olarak keşfedin." },
                "cinematic-intro": { title: "Sinematik Giriş", description: "Doc Alvers laboratuvarına anıtsal bir başlangıç ​​yapın. ULTRA v5.3.8 Görsel Kimlik." },
                "stanford-portal": { title: "Stanford Üniversitesi", description: "Silikon Vadisi'ndeki seçkin araştırma üniversitesi: üst düzeyde araştırma, açık fikirler ve kampüs kültürü." },
                "happy-birthday-ulf": { title: "Doğum günün kutlu olsun Ulf!", description: "Doğum günü için matematiksel bir sürpriz. Doc Alvers ile kutlayın!" }
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Tek bir işlem, dört katman aşağıda: yüksek seviyeli dil, assembler, makine baytları ve mantık kapılarından kurulu bir tam toplayıcı. Her katmanda aynı bilgi, yalnızca bir soyutlama daha derinde." },
                "solita": { title: "Solita", description: "Solita — Doc Alvers Matematik Laboratuvarı'ndaki kişisel sesli asistanın (Claude). Konuş, metinleri sesli dinle, bağlamı koru." },
                "gameoflife": { title: "Game of Life", description: "Conway'in hücresel özdevinimi: üç basit kuraldan planörler, salınıcılar ve koca dünyalar doğar. Bir başlangıç deseni çiz ve düzenle kaosun sırayla geldiğini izle." },
                "burningship": { title: "Burning Ship", description: "Mandelbrot kümesinin karanlık kardeş fraktalı: yineleme formülündeki tek bir mutlak değer, ufukta yanan gemiler belirmesine yol açar. Alevli yapıya yaklaş." },
                "reaction-diffusion": { title: "Tepkime-Yayınım", description: "Turing desenleri canlı: iki madde tepkimeye girip yayılır ve ortaya hayvan derilerindeki gibi şeritler, noktalar ve mercanlar çıkar. Besleme ile bozunmayı ayarla ve kendi desenlerini yetiştir." },
                "gravitation": { title: "Kütleçekimi", description: "Newton'un kütleçekim yasasına dokun: uzaya kütleler yerleştir, onlara başlangıç hızı ver ve çok cisimli dansta yörüngeleri, yakalanmaları ve çarpışmaları izle." },
                "glocken": { title: "Bağdat'ın çanları", description: "Bütün çanlar ne zaman aynı anda çalar? Bağdat'tan bir hikâye en küçük ortak kata götürür; bir öğretici seni adım adım EKOK'a ve kesirlere ulaştırır." },
                "langley": { title: "Langley Laboratuvarı", description: "Langley'in 1922'deki ünlü açı bilmecesi: bir ikizkenar üçgen, iki iç doğru ve yüz yıldır dünyayı uğraştıran bir açı. Ölç, dene, kanıtla." },
                "batman": { title: "Batman eğrisi", description: "Grafiği Batman logosunu çizen tek bir denklem: mutlak değerler, kökler ve durum ayrımları süper kahraman matematiği olarak. Formülü parça parça sök." },
                "worldclock": { title: "Dünya saati", description: "Saat olarak Dünya: zaman dilimleri, Güneş'in konumu ve gece-gündüz çizgisi dünya haritasında canlı. Burada gece yarısı olurken güneşin nerede doğduğunu gör." },
                "tracker": { title: "Doc Alvers Tracker", description: "Web uygulaması olarak GPS takibi: yükseklik profili, fotoğraf, ses ve bilgi ara noktaları, yağış radarı ve canlı paylaşımla turlar kaydet. Tarayıcıda ve Android uygulaması olarak çalışır." },
                "kaimbo": { title: "Kaimbo Studio", description: "Kendi görev listelerinle dil öğrenme: kelimeleri ve cümleleri görev serileri olarak düzenle, süz ve çalış. Doc'un dil öğrenme aracının stüdyosu, artık tarayıcıda." },
                "pagode": { title: "Pagode (230 SL)", description: "1964 model bir Mercedes 230 SL Bluetooth ile buluşuyor: motoru telsizle çalıştır, kanalları dene, etkileşimli devre şemasını incele ve Solita araba sürmeyi öğrensin. Yapay zekâ kumandalı klasik otomobil elektriği." },
                "voicerecorder": { title: "Ses kaydedici", description: "Kaydet ve anında yazıya çevir: sen konuş, o dinler, yazar ve saklar. Tarayıcıda Web Speech API ile, Android uygulamasında yerel konuşma tanımayla." },
                "mathtrainer": { title: "MathTrainer", description: "Alıştırma serileriyle matematik çalış: zihinden hesap ve okul alıştırmaları, bir seri seç, hızını artır. School is cool: web uygulaması olarak SchoolTrainer." },
                "pinkerfinder": { title: "PinkerFinder", description: "macOS Finder'ın birebir yeniden yapımı — artı arama yönleri: listede klasör boyutları, içeriğe göre kopyalar, tüm Mac'te yönlü arama, canlı güncelleme. Yerel Mac uygulaması, ücretsiz indirme." },
                "imaginarynumbers": { title: "Sanal sayılar", description: "Gauss düzleminde karmaşık sayılar: gerçek kısım, sanal kısım ve sanal birim — etkileşimli olarak keşfet." },
                "kovarianz": { title: "Kovaryans", description: "Doğrusal bir dönüşüm A düzlemi gerer, döndürür ve keser. Yuvarlak bir nokta bulutuna uygulandığında bir elipse dönüşür — ve tam da bu şeklin bilgisi kovaryans matrisindedir: Σ₀ = σ²E’den Σ = A Σ₀ Aᵀ olur. Matrisi hücre hücre ayarla ya da görüntü elipsini doğrudan tutamağından sürükle; Σ, korelasyon ve ana eksenler olarak özvektörler çizilen noktalardan canlı hesaplanır. Normal ve düzgün dağılım, homojen koordinatlar ve dönüşümün doğrulara ne yaptığını gösteren paralellerle." },
                "irisvis": { title: "Conway's Iris", description: "Her köşede iki kenarı da karşı kenarın uzunluğu kadar uzat — altı uç nokta, iç teğet çemberin merkezi etrafındaki bir çember üzerindedir: R = √(r²+(s+d)²). Altı silecek yayı bunlardan sabit genişlikte bir eğri oluşturur; bir kare onu her dönme konumunda çevreler ve CMA-ES konumunu canlı arar. Kanıt görünümleri, arama alanının ısı haritası ve tek tuşla Reuleaux üçgeni ile." },
                "ascii": { title: "ASCII sanatı", description: "Görüntüler sayıdır: fotoğrafı, canlı kamera görüntüsünü ya da bir örneği hücrelere böl, gri değeri hesapla, karakteri seç — karakter olarak, renkli, yarım ton ya da Braille, dithering ile. Bir karaktere tıklamak tam o hücrenin bütün hesabını gösterir; 2. düzeyde öğrenciler gri değer → karakter eşlemesini kendileri yazar." },
                "neuroaddierer": { title: "Öğrenilmiş toplayıcı", description: "1 + 1 = 2 laboratuvarında tam toplayıcılar sabit kablolanmıştır — burada hiçbir şey kablolu değil. 32 sayıdan oluşan minik bir yapay sinir ağı yalnızca doğruluk tablosunun sekiz satırını görür ve toplamayı kendi bulmalıdır: evrimle (CMA-ES), hiç türev kullanmadan. Ardından öğrenilmiş ağın sekiz kopyası seri hâlde 255’e kadar her toplamı hesaplar — ve çıkışlarının hiçbir zaman tam 0 ya da 1 olmadığı, 0,03 ve 0,97 olduğu görülür." },
                "shell": { title: "Shell", description: "Bir deniz kabuğundaki desen nasıl oluşur? Altı bölüm mekanizmayı tek tek kurar: görüntü bir kayıttır — bir hücre tutuşur ve bir V yazar — iki dalga birbirini yok eder ve çadırın ucunu keser — tükenen substrat nedenini açıklar. Üstte ağız kenarı yaşar, altında kabuk büyür. Tek adım düğmesiyle." },
                "conuslab": { title: "Conus", description: "Bir koni salyangozu neden zikzaklar ve çadırlar taşır? Kabuk yalnızca ağız kenarında büyür — tek bir hücre sırası ‘pigment var/yok’ kararını verir ve her büyüme çizgisi sonsuza dek yerinde kalır. Yani desen bir uzay-zaman diyagramıdır. Burada canlı işler: ilerleyen pigment dalgaları çarpıştıklarında birbirini yok eder ve böylece çadırları keser — yanında aynı etki hücresel otomat olarak (kural 30)." },
                "costablanca": { title: "Costa Blanca’nın öne çıkanları", description: "İşaretlenecek Costa Blanca gezileri: Altea’dan Valencia’ya 22 araştırılmış rota; fotoğraflar, yerel ipuçları ve ilerleme çubuğu ile — dört dilde (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Bennett ve Brassard’a göre kuantum anahtar değişimi: Alice tek tek fotonlar gönderir, her biri iki tabandan birinde — + tabanında — ve | durumlarıyla, ya da × tabanında / ve \\ ile. Bob tabanını rastgele seçer: aynı taban güvenilir sonuç, farklı taban saf rastlantı demektir. Bir sütunun üzerine gelmek tam o fotonu açıklar. Dinleyici Eve varken açıkça karşılaştırılan kısımdaki hata oranı dörtte bire çıkar — yakalanma olasılığı 1 − (3/4)^m’dir ve tek tuşla bin deneme bunun gerçekten böyle olduğunu gösterir. Ayrıca bütün durumları bir kez gezen bir öğretim modu." },
                "koerper": { title: "Cisimler", description: "Platonik, Arşimet ve Catalan cisimleri, prizmalar, antiprizmalar, piramitler ve yuvarlak biçimler — 3B’de döndürülebilir; yüzey alanı, hacim, çevrel, kenar ve iç küre yarıçapları, iki yüzlü açılar ve ayrıt uzunluğuna göre canlı formüllerle. Her cisim bir sürgüyle açınımına açılabilir; Catalan cisimleri, kenar küresine göre kutupsallıkla Arşimet cisimlerinin dualleri olarak ortaya çıkar." }
            }
    };
})();
