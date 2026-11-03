/* kapitel.js — the chapters of the Swahili edition (Kenya) of "Mathematik · Berufliches Gymnasium 13" (buch/mathe13/), in
 * the order of the school year (Stoffverteilungsplan svp/mathe/mathe13.html: LB 3 → LB 4 → Wahlpflicht 1 → LB 6 →
 * Abiturvorbereitung). Doc, 03.11.2026: "übersetz mal bitte BGY11 in Suaheli (Kenia)", round 2 (block sw-3).
 * Terms as in tools/buch-sw/istilahi.md. Single source for the table of contents (index.html) and the previous/next
 * cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Hisabati · Berufliches Gymnasium 13',
    short: 'Hisabati 13',
    lang: 'sw',
    druck: false,
    description: 'Kitabu shirikishi cha kiada cha hisabati kwa Berufliches Gymnasium (shule ya sekondari ya juu nchini Ujerumani yenye mwelekeo wa kitaaluma), darasa la 13, Saksonia: kalkulasi ya kiunganishi, takwimu za kukisia zenye majaribio ya umuhimu, jiometri ya mistari na mabapa katika 3D, matumizi zaidi na sura ya kujiandaa kwa Abitur, pamoja na maabara, uigaji na majaribio ya kujipima yanayotoa jibu papo hapo.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Eneo la kujifunza 3', k: '3.1', title: 'Fanksheni asili',
          sub: 'Kunyambua kinyume, kiunganishi kisicho dhahiri, kanuni za uunganishaji', when: 'Agosti · Septemba', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Eneo la kujifunza 3', k: '3.2', title: 'Kiunganishi dhahiri',
          sub: 'Kiasi kilichoundwa upya, sifa, nadharia kuu', when: 'Septemba', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Eneo la kujifunza 3', k: '3.3', title: 'Maeneo',
          sub: 'Kati ya grafu na mhimili wa x, kati ya grafu mbili', when: 'Mwisho wa Septemba · Oktoba', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Eneo la kujifunza 3', k: '3.4', title: 'Uunganishaji wa kinamba na matumizi',
          sub: 'Mbinu ya mistatili na kanuni ya trapeza, matatizo mchanganyiko', when: 'Oktoba · Novemba', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Eneo la kujifunza 4', k: '4.1', title: 'Kundi zima na sampuli',
          sub: 'Kukadiria na kupima, wastani na variansi ya sampuli', when: 'Novemba', ustd: 4 },
        { file: 'lb4-2.html', lb: 'Eneo la kujifunza 4', k: '4.2', title: 'Majaribio ya umuhimu',
          sub: 'Nadharia tete, eneo la kukataa, makosa ya aina ya I na ya II', when: 'Novemba · Desemba', ustd: 8 },
        { file: 'wp1-1.html', lb: 'Eneo la hiari 1', k: 'H.1', title: 'Mistari na mabapa',
          sub: 'Milinganyo ya vigezo, vekta ya normali kwa zao la vekta', when: 'Desemba', ustd: 8 },
        { file: 'wp1-2.html', lb: 'Eneo la hiari 1', k: 'H.2', title: 'Mlinganyo wa kartesia na mikao',
          sub: 'Nukta, mstari, bapa: mikao, nukta za mkato, nukta za kukata mihimili', when: 'Januari', ustd: 8 },
        { file: 'wp1-3.html', lb: 'Eneo la hiari 1', k: 'H.3', title: 'Pembe za mkato, prizimu na piramidi',
          sub: 'Pembe kati ya mistari na mabapa, eneo la uso na ujazo', when: 'Januari', ustd: 4 },
        { file: 'lb6.html', lb: 'Eneo la kujifunza 6', k: '6', title: 'Matumizi zaidi',
          sub: 'Familia za fanksheni, vigezo katika mifumo ya milinganyo, gharama na faida, umbali', when: 'Mwisho wa Januari · Februari', ustd: 8 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Tayari kwa Abitur',
          sub: 'Orodha za ukaguzi na mazoezi ya muundo wa Abitur kutoka miaka yote mitatu', when: 'Februari · Aprili', ustd: 0 }
    ]
};
