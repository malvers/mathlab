/* kapitel.js — the chapters of the Turkish edition (Turkey) of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/), in
 * the order of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5; Grundkurs, Kurshalbjahre
 * 12/I and 12/II). Book tr-2 (08.11.2026), the sibling of mathe11-tr. Terms as in tools/buch-tr/sozluk.md. Single source
 * for the table of contents (index.html) and the previous/next cards at the end of every chapter. No print edition yet
 * (druck: false).
 */
window.BUCH = {
    title: 'Matematik · Berufliches Gymnasium 12',
    short: 'Matematik 12',
    lang: 'tr',
    druck: false,
    description: "Berufliches Gymnasium (Almanya'da mesleki ağırlıklı bir lise türü) 12. sınıf için etkileşimli matematik ders kitabı, Saksonya: kesikli rastgele değişkenler ve binom dağılımı, limitten optimizasyon problemlerine türev ve uzayda vektörler; laboratuvarlar, simülasyonlar, 3B grafikler ve anında geri bildirim veren öz değerlendirmelerle.",
    chapters: [
        { file: 'lb1-1.html', lb: 'Öğrenme alanı 1', k: '1.1', title: 'Koşullu olasılık',
          sub: 'Ağaç diyagramları, dört gözlü tablolar, bağımsız olaylar', when: 'Ağustos · Eylül', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Öğrenme alanı 1', k: '1.2', title: 'Rastgele değişkenler',
          sub: 'Olasılık dağılımı, beklenen değer, varyans, adil oyunlar', when: 'Eylül', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Öğrenme alanı 1', k: '1.3', title: 'Binom dağılımı',
          sub: 'Bernoulli dizileri, binom katsayısı, birikimli olasılıklar', when: 'Ekim · Kasım', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Öğrenme alanı 2', k: '2.1', title: 'Limitler',
          sub: 'Sonsuzdaki davranış, asimptotlar, süreklilik', when: 'Kasım · Aralık', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Öğrenme alanı 2', k: '2.2', title: 'Türev',
          sub: 'Değişim hızları, kesenden teğete, grafikten türev çizmek', when: 'Aralık', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Öğrenme alanı 2', k: '2.3', title: 'Türev kuralları',
          sub: 'Kuvvet, toplam ve sabitle çarpım kuralı, eˣ ve sin x, basit çarpımlar', when: 'Ocak', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Öğrenme alanı 2', k: '2.4', title: 'Monotonluk, ekstremumlar, büküm noktaları',
          sub: 'f′ ve f″ grafik hakkında neler söyler', when: 'Ocak · Mart', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Öğrenme alanı 2', k: '2.5', title: 'Grafikleri incelemek',
          sub: 'Simetri, asimptotlar, teğetler ve normaller, bağlam içinde fonksiyonlar', when: 'Mart', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Öğrenme alanı 2', k: '2.6', title: 'Koşullardan fonksiyonlar ve optimizasyon problemleri',
          sub: 'Koşullardan fonksiyon kurmak, en iyisini bulmak', when: 'Nisan · Mayıs', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Öğrenme alanı 5', k: '5.1', title: 'Uzayda vektörler',
          sub: 'Noktalar ve vektörler, vektörlerle işlemler, uzunluk, orta nokta', when: 'Mayıs · Haziran', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Öğrenme alanı 5', k: '5.2', title: 'İç çarpım ve açılar',
          sub: 'Diklik, vektörler arasındaki açı, dörtgenlerde ispatlar', when: 'Haziran · Temmuz', ustd: 8 }
    ]
};
