/* kapitel.js — the chapters of the Turkish edition (Turkey) of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/), in
 * the order of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Package arch3 (08.11.2026): the architecture for pt, nl and tr; the book: tr-1 (start page, this file, the chapters).
 * Terms as in tools/buch-tr/sozluk.md. Single source for the table of contents (index.html) and the previous/next cards at
 * the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Matematik · Berufliches Gymnasium 11',
    short: 'Matematik 11',
    lang: 'tr',
    druck: false,
    description: "Berufliches Gymnasium (Almanya'da mesleki ağırlıklı bir lise türü) 11. sınıf için etkileşimli matematik ders kitabı, Saksonya: denklemler, fonksiyonlar, denklem sistemleri, olasılık ve sayısal yöntemler; laboratuvarlar, simülasyonlar ve anında geri bildirim veren öz değerlendirmelerle.",
    chapters: [
        { file: 'lb2.html', lb: 'Öğrenme alanı 2', k: '2', title: 'Denklemler, formüller, şekiller',
          sub: 'Problemleri hesap makinesiyle ve hesap makinesi olmadan çözmek', when: 'Eylül', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Öğrenme alanı 3', k: '3.1', title: 'Fonksiyonlar ve özellikleri',
          sub: 'Tanım kümesi, kökler, monotonluk, simetri', when: 'Eylül sonu', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Öğrenme alanı 3', k: '3.2', title: 'Büyüme ve azalma',
          sub: 'Doğrusal fonksiyonlar ve üstel fonksiyonlar', when: 'Ekim · Kasım', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Öğrenme alanı 3', k: '3.3', title: 'İkinci dereceden fonksiyonlar ve denklemler',
          sub: 'Düzgün hızlanan hareketler', when: 'Kasım', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Öğrenme alanı 3', k: '3.4', title: 'Periyodik olaylar',
          sub: 'Sinüs fonksiyonları', when: 'Aralık', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Öğrenme alanı 3', k: '3.5', title: 'Regresyon',
          sub: 'Ölçüm dizilerini dijital araçlarla değerlendirmek', when: 'Aralık', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Öğrenme alanı 3', k: '3.6', title: 'Ters fonksiyonlar ve logaritma',
          sub: 'Karekök fonksiyonu, logaritma, üstel denklemler', when: 'Ocak', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Öğrenme alanı 3', k: '3.7', title: 'Grafikler ve parametreler',
          sub: 'Hesap makinesi olmadan temel fonksiyonlar, uzatma ve öteleme', when: 'Şubat · Mart', ustd: 15 },
        { file: 'lb4.html', lb: 'Öğrenme alanı 4', k: '4', title: 'Doğrusal denklem sistemleri ve matrisler',
          sub: 'Gauss yöntemi, çözüm kümeleri, matris işlemleri', when: 'Mart · Nisan', ustd: 20 },
        { file: 'lb1.html', lb: 'Öğrenme alanı 1', k: '1', title: 'Çok aşamalı rastgele deneylerde olasılık',
          sub: 'Ağaç diyagramları, dört gözlü tablolar, simülasyon', when: 'Nisan', ustd: 15 },
        { file: 'wb3.html', lb: 'Seçmeli alan 3', k: 'S', title: 'Sayısal yöntemler ve simülasyonlar',
          sub: 'İkiye bölme yöntemi, yaklaşık alan hesabı, Monte Carlo yöntemi', when: 'Mayıs · Haziran', ustd: 10 }
    ]
};
