/* kapitel.js — the chapters of the Swahili edition (Kenya) of "Mathematik · Berufliches Gymnasium 13 · Leistungskurs"
 * (buch/mathe13lk/), in the order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, version 2026,
 * Leistungskurs Jahrgangsstufe 13: LB 3 → LB 4 → LB 5 → Wahlpflicht 1 or Wahlpflicht 2 → LB 7 → Abiturvorbereitung).
 * Doc, 03.11.2026: "übersetz mal bitte BGY11 in Suaheli (Kenia)", round 3 (block sw-5). Terms as in tools/buch-sw/istilahi.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * The electives are "Eneo la hiari 1/2" with the chapter numbers H1.1 … H2.3 (H = hiari), as in mathe13-sw.
 * No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Hisabati · Berufliches Gymnasium 13 · Leistungskurs',
    short: 'Hisabati 13 LK',
    lang: 'sw',
    druck: false,
    description: 'Kitabu shirikishi cha kiada cha hisabati kwa Berufliches Gymnasium (shule ya sekondari ya juu nchini Ujerumani yenye mwelekeo wa kitaaluma), darasa la 13, Leistungskurs (kozi ya kiwango cha juu), Saksonia: kalkulasi ya kiunganishi pamoja na nadharia kuu na magimba ya mzunguko, vigeu vya nasibu vyenye mgawanyo wa kawaida, takwimu za kukisia, maeneo yote mawili ya hiari – mistari na mabapa katika nafasi au matriki pamoja na modeli ya Leontief na modeli za idadi ya viumbe –, matumizi zaidi na sura ya kujiandaa kwa Abitur, pamoja na maabara, uigaji, michoro ya 3D na majaribio ya kujipima yanayotoa jibu papo hapo.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Eneo la kujifunza 3', k: '3.1', title: 'Fanksheni asili',
          sub: 'Kunyambua kinyume, uthibitisho, kanuni za uunganishaji, 1/x na ln|x|, CAS', when: 'Agosti · Septemba', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Eneo la kujifunza 3', k: '3.2', title: 'Kiunganishi dhahiri na nadharia kuu',
          sub: 'Kiasi kilichoundwa upya, sifa, fanksheni ya kiunganishi, nadharia kuu pamoja na uthibitisho', when: 'Septemba', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Eneo la kujifunza 3', k: '3.3', title: 'Maeneo',
          sub: 'Kati ya grafu na mhimili wa x, kati ya grafu mbili, maeneo yenye kigezo', when: 'Oktoba', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Eneo la kujifunza 3', k: '3.4', title: 'Uunganishaji wa kinamba na magimba ya mzunguko',
          sub: 'Mbinu ya mistatili na kanuni ya trapeza, ujazo wa mzunguko kuzunguka mhimili wa x', when: 'Oktoba · Novemba', ustd: 10 },
        { file: 'lb4.html', lb: 'Eneo la kujifunza 4', k: '4', title: 'Vigeu vya nasibu vyenye mgawanyo wa kawaida',
          sub: 'Mkunjo wa kengele, fanksheni ya msongamano na fanksheni ya mgawanyo limbikizi, thamani tarajiwa, mkengeuko sanifu, kanuni za σ', when: 'Novemba', ustd: 12 },
        { file: 'lb5-1.html', lb: 'Eneo la kujifunza 5', k: '5.1', title: 'Kundi zima na sampuli',
          sub: 'Kukadiria na kupima, wastani na variansi ya sampuli', when: 'Desemba', ustd: 5 },
        { file: 'lb5-2.html', lb: 'Eneo la kujifunza 5', k: '5.2', title: 'Majaribio ya umuhimu',
          sub: 'Majaribio ya upande mmoja na ya pande mbili, eneo la kukataa, makosa ya aina ya I na ya II, uhakika wa kitakwimu', when: 'Desemba · Januari', ustd: 10 },
        { file: 'wp1-1.html', lb: 'Eneo la hiari 1', k: 'H1.1', title: 'Mistari na mabapa',
          sub: 'Milinganyo ya vigezo, zao la vekta, mlinganyo wa kartesia, umbo la normali la Hesse', when: 'Januari', ustd: 9 },
        { file: 'wp1-2.html', lb: 'Eneo la hiari 1', k: 'H1.2', title: 'Mikao na pembe za makutano',
          sub: 'Nukta, mstari, bapa: makutano, nukta za kukata, mistari ya kukata, pembe za makutano', when: 'Januari · Februari', ustd: 9 },
        { file: 'wp1-3.html', lb: 'Eneo la hiari 1', k: 'H1.3', title: 'Umbali, prizimu na piramidi',
          sub: 'Umbali nukta–bapa, mstari–bapa, bapa–bapa, eneo la uso na ujazo', when: 'Februari', ustd: 7 },
        { file: 'wp2-1.html', lb: 'Eneo la hiari 2', k: 'H2.1', title: 'Kuzidisha matriki na kupata kinyume chake',
          sub: 'Zao la matriki, matriki ya utambulisho, matriki kinyume, mifumo ya milinganyo kwa matriki kinyume', when: 'Januari', ustd: 8 },
        { file: 'wp2-2.html', lb: 'Eneo la hiari 2', k: 'H2.2', title: 'Mitandao ya uzalishaji na modeli ya Leontief',
          sub: 'Grafu za Gozinto, uzalishaji wa hatua nyingi, hesabu ya gharama, uchanganuzi wa pembejeo na matokeo', when: 'Januari · Februari', ustd: 9 },
        { file: 'wp2-3.html', lb: 'Eneo la hiari 2', k: 'H2.3', title: 'Modeli za idadi ya viumbe',
          sub: 'Matriki za mpito, vipeo vya matriki, matriki ya kikomo na vekta tuli, mwenendo wa mzunguko', when: 'Februari', ustd: 8 },
        { file: 'lb7-1.html', lb: 'Eneo la kujifunza 7', k: '7.1', title: 'Milinganyo bikwadratiki na familia za fanksheni',
          sub: 'Kuweka badala, familia za fanksheni, vigezo na idadi ya masuluhisho, njia za nukta', when: 'Februari · Machi', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Eneo la kujifunza 7', k: '7.2', title: 'Vigezo na maupeo katika nafasi na uchumi',
          sub: 'Mifumo ya milinganyo yenye kigezo, matriki za mzunguko, umbali mfupi zaidi, gharama, mapato na faida', when: 'Machi', ustd: 7 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Tayari kwa Abitur',
          sub: 'Orodha za ukaguzi, mitego ya makosa na maswali ya muundo wa Abitur wa Leistungskurs kutoka darasa la 11, 12 na 13', when: 'Machi · Aprili', ustd: 0 }
    ]
};
