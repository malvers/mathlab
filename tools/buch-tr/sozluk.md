# Sözlük · Begriffe der türkischen Ausgaben (Türkei)

The terms BGY 11 (`mathe11-tr`, block tr-1, 08.11.2026) decided on. The notation of section 1 is also in the RULE of
`js/buch-tr.js` (points, intervals, percent) and in the rules of `js/buch-tr/<module>.js` (the letters the widgets draw).

Standard Turkish as schools in Turkey (lise, MEB) write it. The pupil is addressed with **sen** (imperative singular:
"Çöz", "Hesapla", "Çiz", "Göster", "Bul"; group tasks in the explorations with **siz** plural imperative: "Tablo
oluşturun", "Çizin", "Bulun"). Real characters always: ç ğ ı İ ö ş ü. Upper-case Turkish correctly: i → İ, ı → I
("BİLGİ", "ETKİLEŞİMLİ", "ÖĞRENME ALANI", never "BILGI").

## 1 Notation (local, lise)

| What | German book | Turkish edition |
|---|---|---|
| decimal | `0{,}5`, 1,5 | the same: `0{,}5`, 1,5 (decimal comma) |
| thousands | 10.000 / 10\,000 | 10.000 (dot) |
| percent | 30 %, `30\,\%` | **%30**, `\%30`; with a suffix: %30'u, %5'lik |
| point | `P(2 \mid 5)` | `P(2, 5)`; with a decimal comma inside: `P(1{,}5;\ 2)` |
| vertex | `S(d \mid e)`, $f(x) = a(x-d)^2 + e$ | tepe noktası `T(r, k)`, $f(x) = a(x - r)^2 + k$ |
| set / list | `\{2;\ 3\}` | `\{2, 3\}`; with a decimal comma inside keep `;` : `\{2;\ 3{,}5\}` |
| solution set | `L = \{…\}`, `L = \{\,\}` | `\text{Ç} = \{…\}`, `\text{Ç} = \varnothing` or `\{\,\}` (çözüm kümesi) – always `\text{Ç}`, never a bare Ç in math |
| interval | `[a; b]`, `]a; b[`, `[a; b[` | `[a, b]`, `(a, b)`, `[a, b)`, `(a, b]` (Turkish: open interval with round brackets) |
| domain / range | $D$ / $W$ | tanım kümesi $T$ / görüntü kümesi $G$ |
| line | $y = mx + n$ | $y = mx + n$ (eğim $m$) – unchanged |
| quadratic formula | p-q formula, $D = (\tfrac p2)^2 - q$ | **diskriminant** $\Delta = b^2 - 4ac$, $x_{1,2} = \dfrac{-b \mp \sqrt{\Delta}}{2a}$ (write `\pm`); rewrite the solution steps with $a, b, c$ (the Swahili edition did the same rewrite with $D$: use it as a check, write $\Delta$) |
| Vieta | $x_1 + x_2 = -p$, $x_1 x_2 = q$ | Vieta formülleri: $x_1 + x_2 = -\tfrac{b}{a}$, $x_1 \cdot x_2 = \tfrac{c}{a}$ |
| common log | `\lg` | `\log` (base 10), `\ln` stays |
| complement | `\overline{A}` | $A'$ (tümleyen olay) |
| conditional probability | $P_A(B)$ | $P(B \,|\, A)$ – a plain bar `|`, **never `\mid`** (the engine turns every `\mid` inside round brackets into a comma) |
| product | `\cdot` | `\cdot` (unchanged) |
| money | 2 €, 1,50 € | 2 €, 1,50 € (avro; symbol after the number, as with TL) |
| units | km/h, m, s, h | SI as German (km/h, m, s, h, °C) |
| angle measure | Bogenmaß | radyan |
| identity matrix | $E$ | birim matris $I$ |
| transposed | $A^T$ | $A^T$ (devrik matris) |

`data-ans` keep their values exactly. A `data-ph` placeholder is translated ("Zahl" → "Sayı"), letter placeholders
follow the notation ("q =" → "c =" where the Turkish text uses $c$).

## 2 Letters from Turkish words

| German | Turkish |
|---|---|
| rote / blaue Kugel R/B | kırmızı **K** / mavi **M** |
| krank / gesund K / G | hasta **H** / sağlıklı **S** |
| Test positiv/negativ $T^+$/$T^-$ | $T^+$ / $T^-$ (test pozitif/negatif) – unchanged |
| Wappen / Zahl W / Z | tura **T** / yazı **Y** (Wappen = emblem side = tura) |
| Treffer / Niete | başarı **B** / başarısızlık **B'** |
| Mädchen / Junge M / J | kız **K** / erkek **E** |

Other event letters: take the first letter of the Turkish word, avoid clashes inside one task.

## 3 Structure of the book

| German | Turkish |
|---|---|
| Kapitel | bölüm ("BÖLÜM 3.1") |
| Lernbereich / Wahlbereich | öğrenme alanı / seçmeli alan ("ÖĞRENME ALANI 3", "SEÇMELİ ALAN 3") |
| USTD. (Unterrichtsstunden) | DERS SAATİ ("5 DERS SAATİ") |
| Lerneinheit(en) | konu ("KONU 1", chip "2 KONU", "→ Konu 1", "→ Konu 1 ve 2") |
| LABS | LAB ("2 LAB") |
| INTERAKTIV | ETKİLEŞİMLİ |
| Auftakt (toc-k A) | Giriş (toc-k **G**) |
| Erkundungen (E) · zum Einstieg · in Gruppen | Keşifler (**K**) · BAŞLANGIÇ İÇİN · GRUPÇA |
| Das lernst du in diesem Kapitel | BU BÖLÜMDE ÖĞRENECEKLERİN |
| Check-in: Das kannst du schon? | ÖN KONTROL: BUNLARI BİLİYOR MUSUN? |
| Merke · … | AKILDA TUT · … |
| Beispiel 1 · … | ÖRNEK 1 · … |
| Methode · Ausblick · Projekt | YÖNTEM · İLERİ BAKIŞ · PROJE |
| Aufgaben | ALIŞTIRMALAR |
| Teste dich! | KENDİNİ DENE! |
| Wiederholen · Vertiefen · Vernetzen (W, short "Üben") | TEKRAR ET · DERİNLEŞTİR · İLİŞKİLENDİR (toc-k **A**, short "Alıştırma") |
| Vernetzen mit Kapitel 2 | 2. bölümle ilişkilendir |
| Exkursion (X) · zum Weiterdenken | GEZİNTİ (toc-k **X**) · DÜŞÜNMEYİ SÜRDÜR |
| Rückblick (R) · das Wichtigste auf einen Blick | ÖZET (toc-k **Ö**) · EN ÖNEMLİLER BİR BAKIŞTA |
| Test (T) · zwei Runden · Rückmeldung sofort | TEST (**T**) · İKİ TUR · ANINDA GERİ BİLDİRİM |
| Runde 1 | TUR 1 |
| ohne Hilfsmittel / mit Hilfsmitteln | HESAP MAKİNESİZ / DİJİTAL ARAÇLARLA |
| Mehr üben online | ÇEVRİMİÇİ DAHA FAZLA ALIŞTIRMA (ALMANCA) |
| 20 Aufgaben mit Rückmeldung | geri bildirimli 20 alıştırma |
| Informatische Bildung | BİLİŞİM EĞİTİMİ |
| ja / nein | evet / hayır |
| Zahl, Anzahl, Euro, Meter, Stunden, Sekunden, Jahre (data-ph) | Sayı, Adet, Avro, Metre, Saat, Saniye, Yıl |
| months | Eylül, Ekim, Kasım, Aralık, Ocak, Şubat, Mart, Nisan, Mayıs, Haziran; "Ende September" = "Eylül sonu" |

Footer: "Doc Alvers Mathe-Labor · Matematik, Berufliches Gymnasium 11. sınıf · Saksonya Berufliches Gymnasium matematik
öğretim programına göre öğrenme alanı 3." / "Tüm metinler, alıştırmalar ve şekiller özgün içeriktir."
"Doc Alvers Mathe-Labor" is never translated; Solita stays German. Lab names (`b-lab-name`) are translated as titles,
the labs themselves stay German.

## 4 Terms

| German | Turkish |
|---|---|
| Gleichung · Lösung · lösen | denklem · çözüm · çözmek |
| Äquivalenzumformung | denk dönüşüm |
| Variable · Term · Formel | değişken · ifade (cebirsel ifade) · formül |
| ausklammern · ausmultiplizieren | ortak paranteze almak · çarpımı açmak (dağıtmak) |
| binomische Formeln | özdeşlikler (tam kare özdeşlikleri) |
| Bruch · Nenner · Zähler | kesir · payda · pay |
| Potenz · Basis · Hochzahl (Exponent) | üslü ifade (kuvvet) · taban · üs |
| Wurzel | karekök |
| Figur · Körper · Umfang · Flächeninhalt · Volumen | şekil · cisim · çevre · alan · hacim |
| Funktion · Funktionswert · Funktionsgleichung | fonksiyon · fonksiyon değeri · fonksiyon denklemi |
| Wertetabelle · Wortvorschrift · Term · Graph | değer tablosu · sözel kural · ifade · grafik |
| Senkrechtentest | dikey doğru testi |
| Definitionsbereich $D$ · Wertebereich $W$ | tanım kümesi $T$ · görüntü kümesi $G$ |
| Nullstelle | kök (fonksiyonun kökü / sıfırı); "Nullstellen bestimmen" = kökleri bulmak |
| Monotonie · steigend · fallend | monotonluk · artan · azalan |
| achsensymmetrisch zur $y$-Achse · punktsymmetrisch zum Ursprung | $y$ eksenine göre simetrik · orijine göre simetrik (çift / tek fonksiyon) |
| Periode · periodisch | periyot · periyodik |
| Asymptote (waagerecht, senkrecht) | asimptot (yatay, düşey) |
| Gerade · Steigung · $y$-Achsenabschnitt | doğru · eğim · $y$ eksenini kestiği nokta ($n$) |
| lineare Funktion · Exponentialfunktion | doğrusal fonksiyon · üstel fonksiyon |
| Wachstum · Zerfall · Wachstumsfaktor | büyüme · azalma (bozunma) · büyüme çarpanı |
| Halbwertszeit · Verdopplungszeit | yarı ömür · ikiye katlanma süresi |
| Zinsen · Zinseszins · Kapital | faiz · bileşik faiz · anapara |
| quadratische Funktion · Parabel · Normalparabel | ikinci dereceden fonksiyon · parabol · temel parabol ($y = x^2$) |
| Scheitel(punkt) · Scheitelpunktform · Normalform | tepe noktası $T$ · tepe noktası biçimi · genel biçim |
| nach oben / unten geöffnet | kolları yukarı / aşağı doğru |
| quadratische Ergänzung | tam kareye tamamlama |
| Lösungsformel · Diskriminante | kök formülü · diskriminant $\Delta$ |
| Satz von Vieta | Vieta formülleri |
| gleichmäßig beschleunigte Bewegung | düzgün hızlanan hareket |
| periodische Vorgänge · Sinusfunktion | periyodik olaylar · sinüs fonksiyonu |
| Einheitskreis · Bogenmaß · Gradmaß | birim çember · radyan · derece |
| Amplitude · Mittellinie · Phasenverschiebung | genlik · orta doğru (denge doğrusu) · faz kayması |
| Regression · Ausgleichsgerade · Bestimmtheitsmaß | regresyon · regresyon doğrusu · belirlilik katsayısı $R^2$ |
| Messreihe · Messwert | ölçüm dizisi · ölçüm değeri |
| Inter- / Extrapolation | ara değer kestirimi / dış değer kestirimi |
| Umkehrfunktion · umkehrbar | ters fonksiyon $f^{-1}$ · tersi alınabilir (bire bir) |
| Wurzelfunktion | karekök fonksiyonu |
| Logarithmus · Exponentialgleichung | logaritma · üstel denklem |
| Grundfunktion · Parameter | temel fonksiyon · parametre |
| strecken · stauchen · spiegeln · verschieben | uzatmak (genişletmek) · daraltmak · yansıtmak · ötelemek |
| lineares Gleichungssystem (LGS) | doğrusal denklem sistemi |
| Matrix · Koeffizientenmatrix · erweiterte | matris · katsayılar matrisi · genişletilmiş katsayılar matrisi |
| Zeile · Spalte | satır · sütun |
| Gauß-Verfahren · Stufenform (Dreiecksform) | Gauss eleme yöntemi · basamak biçimi (üçgen biçim) |
| Einheitsmatrix · Nullmatrix | birim matris $I$ · sıfır matrisi |
| Matrizenmultiplikation · transponieren | matris çarpımı · devriğini almak |
| Wahrscheinlichkeit | olasılık |
| (mehrstufiger) Zufallsversuch | (çok aşamalı) deney / rastgele deney |
| Ergebnis · Ergebnismenge · Ereignis · Gegenereignis | çıktı · örnek uzay · olay · tümleyen olay $A'$ |
| Baumdiagramm · Pfad · Pfadregeln (Produkt-, Summenregel) | ağaç diyagramı · dal · dal kuralları (çarpma kuralı, toplama kuralı) |
| mit / ohne Zurücklegen | geri koyarak / geri koymadan |
| Urne · ziehen | torba · çekmek |
| Vierfeldertafel | dört gözlü tablo |
| bedingte Wahrscheinlichkeit · (stochastisch) unabhängig | koşullu olasılık · bağımsız |
| relative / absolute Häufigkeit | göreli sıklık / mutlak sıklık |
| Gesetz der großen Zahlen | büyük sayılar yasası |
| Simulation · Zufallszahl | simülasyon · rastgele sayı |
| Würfel · Augenzahl · Münze | zar · zarın üst yüzündeki sayı · madeni para (yazı / tura) |
| Bisektionsverfahren · Intervallhalbierung | ikiye bölme yöntemi |
| numerisch · Näherung | sayısal · yaklaşık değer |
| Rechteck · Trapez · Streifen | dikdörtgen · yamuk · şerit |
| Monte-Carlo-Methode | Monte Carlo yöntemi |
| Tabellenkalkulation | elektronik tablo |
| Ober- / Untersumme | üst toplam / alt toplam |

## 5 People

German first names become Turkish ones: Elif, Mehmet, Ayşe, Can, Zeynep, Emre, Deniz, Ahmet, Selin, Burak, Ece, Kerem,
Mert, Defne, Yusuf, Nehir (keep the gender). Historical persons (Gauß, Galilei, Fibonacci, Benford, Hilbert, Anscombe,
Diophantos) stay. German places with real data stay (Dresden, Sachsen).

## 6 Decided on the way (tr-1)

| What | Turkish edition |
|---|---|
| intersection point $S$, $S_1$, $S_2$ (Schnittpunkt) | $K$, $K_1$, $K_2$ (kesişim noktası), also in the widget `geraden` |
| perimeter $u$ · surface area $O$ · lateral area $M$ | $\text{Ç}$ (çevre) · $A$ (yüzey alanı) · $A_y$ (yanal alan), also in the widget `koerper` |
| triangle area $\tfrac12 g h$ | $\tfrac12 a\,h_a$ |
| time of the vertex $t_S$ (wurf) | $t_T$ |
| empty set | $\text{Ç} = \varnothing$ |
| thousands | a dot also in maths ($48.000$); four-digit numbers in formulas stay plain |
| GeoGebra commands | English names (`Solve`, `NSolve`, `Root`, `FitLine`, `FitPoly`, `FitExp`, `Sequence`, `If`): they work in every language version |
| spreadsheet functions | Turkish Excel with `;`: `RASTGELEARADA`, `EĞERSAY`, `EĞER` |
| raw materials R1–R3 · drinks c, s, w | H1–H3 (hammadde) · k, m, s (kola, meyve suyu, su) |
| elective chapter letter W | S (seçmeli) |
| widget months | Oca, Şub, Mar, Nis, May, Haz, Tem, Ağu, Eyl, Eki, Kas, Ara |
| German school name in capitals | BERUFLICHES GYMNASIUM (German capitals, not the Turkish İ) |

## mathe12-tr (BGY 12, block tr-2)

Terms BGY 12 (`mathe12-tr`, block tr-2, 08.11.2026) added; the widgets use the same words.

| German | Turkish |
|---|---|
| bedingte Wahrscheinlichkeit $P_B(A)$ | koşullu olasılık $P(A \,\|\, B)$ (plain bar), also in the widgets (rule in `js/buch-tr/stochastik.js`) |
| Multiplikationssatz · stochastisch unabhängig · unvereinbar | çarpma kuralı · bağımsız · ayrık |
| Bus / verspätet $B$/$V$ · Brille / liest $B$/$L$ · fehlerhaft $F$ · Informatik / Theater $I$/$T$ | otobüs / geç kaldı $O$/$G$ · gözlük / okur $Z$/$K$ · kusurlu $K$ · bilişim / tiyatro $B$/$T$ |
| Zufallsgröße · Wahrscheinlichkeitsverteilung · Stabdiagramm | rastgele değişken · olasılık dağılımı · çubuk grafik |
| Erwartungswert · Varianz · Standardabweichung | beklenen değer $E(X) = \mu$ · varyans $V(X)$ · standart sapma $\sigma$ |
| Einsatz · Auszahlung · Gewinn · faires Spiel · Glücksrad | oyun bedeli · ödeme · kazanç · adil oyun · çarkıfelek |
| Bernoulli-Experiment / -Kette · Treffer / Niete | Bernoulli deneyi / dizisi · başarı / başarısızlık (tree letters B / B') |
| Binomialkoeffizient · Fakultät · binomialverteilt · kumuliert | binom katsayısı · faktöriyel · binom dağılımlı · birikimli |
| Grenzwert · Verhalten im Unendlichen · waagerechte / senkrechte Asymptote | limit · sonsuzdaki davranış · yatay / düşey asimptot |
| Polstelle (mit / ohne Vorzeichenwechsel) · Lücke · stetig · stetige Ergänzung | kutup noktası (işaret değişimli / değişimsiz) · delik · sürekli · sürekli genişletme |
| ganzrationale / gebrochenrationale Funktion · Zähler- / Nennergrad | polinom / rasyonel fonksiyon · payın / paydanın derecesi |
| mittlere / lokale Änderungsrate · Differenzenquotient · Momentangeschwindigkeit | ortalama / anlık değişim hızı · fark oranı · anlık hız |
| Sekante · Tangente · Normale · Berührpunkt · Wendetangente | kesen · teğet · normal (doğrusu) · değme noktası · büküm teğeti |
| Ableitung $f'$ (gelesen „f Strich“) · differenzierbar · Knick | türev $f'$ (“f üssü”) · türevlenebilir · kırık noktası |
| Potenz- / Faktor- / Summen- / Produkt- / Kettenregel | kuvvet / sabitle çarpım / toplam / çarpım / zincir kuralı |
| Stammfunktion | ilkel fonksiyon (integral tasks of the analysis module) |
| streng monoton steigend / fallend · Monotoniesatz · Vorzeichentabelle | kesin artan / azalan · monotonluk teoremi · işaret tablosu |
| notwendige / hinreichende Bedingung · lokal / global · Randwerte | gerek / yeter koşul · yerel / mutlak · uç değerler |
| Hochpunkt $H$ · Tiefpunkt $T$ · Wendepunkt $W$ · Sattelpunkt $S$ | yerel maksimum noktası $T$ (tepe) · yerel minimum noktası $D$ (dip) · büküm noktası $B$ · eyer noktası (no letter); canvas letters by one rule H/T/W → T/D/B in `js/buch-tr/analysis.js` |
| Linkskurve (linksgekrümmt) · Rechtskurve | yukarı bükey (sola kıvrılır) · aşağı bükey (sağa kıvrılır) |
| achsensymmetrisch · punktsymmetrisch | $y$ eksenine göre simetrik (çift fonksiyon) · orijine göre simetrik (tek fonksiyon) |
| Steckbriefaufgabe · Ansatz · Probe | koşullardan fonksiyon problemi · başlangıç · sağlama (as in tr-1) |
| Extremwertproblem · Zielfunktion · Nebenbedingung · Randextremum | optimizasyon problemi · amaç fonksiyonu · kısıt · uçta ekstremum |
| Oberfläche der Dose $O$ | $A$ (tr-1), also in the widget `optimieren` |
| Ortsvektor · Verbindungsvektor („Spitze minus Fuß“) · Gegenvektor · Nullvektor | konum vektörü · birleştiren vektör (“bitiş eksi başlangıç”) · ters vektör · sıfır vektörü |
| Betrag · Einheitsvektor · Linearkombination · kollinear | uzunluk (norm) · birim vektör · doğrusal bileşim · doğrusal (paralel) |
| Mittelpunkt $M$ · Schwerpunkt $S$ | orta nokta $M$ · ağırlık merkezi $G$ |
| Quader · Raumdiagonale · Kante | dikdörtgenler prizması · cisim köşegeni · ayrıt |
| Skalarprodukt $\vec a \circ \vec b$ · orthogonal · spitz / stumpf | iç çarpım (skaler çarpım) $\vec a \cdot \vec b$ (rule ` \circ ` → ` \cdot ` in `js/buch-tr/vektoren.js`) · dik · dar / geniş |
| Parallelogramm · Rechteck · Raute · Quadrat · Trapez · Viereck | paralelkenar · dikdörtgen · eşkenar dörtgen · kare · yamuk · dörtgen |
| First · Traufe · Sparren | mahya $M_1$, $M_2$ · saçak $S$ · mertek |
| Grundkurs / Leistungskurs | Grundkurs (temel düzey ders) / Leistungskurs (ileri düzey ders), explained once on the start page |
