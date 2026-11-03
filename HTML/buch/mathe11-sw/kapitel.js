/* kapitel.js — the chapters of the Swahili edition (Kenya) of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/), in
 * the order of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Doc, 03.11.2026: "übersetz mal bitte BGY11 in Suaheli (Kenia)" (package SW0: start page, this file, the engine; the
 * chapters: sw-1). Terms as in tools/buch-sw/istilahi.md. Single source for the table of contents (index.html) and the
 * previous/next cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Hisabati · Berufliches Gymnasium 11',
    short: 'Hisabati 11',
    lang: 'sw',
    druck: false,
    description: 'Kitabu shirikishi cha kiada cha hisabati kwa Berufliches Gymnasium (shule ya sekondari ya juu nchini Ujerumani yenye mwelekeo wa kitaaluma), darasa la 11, Saksonia: milinganyo, fanksheni, mifumo ya milinganyo, uwezekano na mbinu za kinamba, pamoja na maabara, uigaji na majaribio ya kujipima yanayotoa jibu papo hapo.',
    chapters: [
        { file: 'lb2.html', lb: 'Eneo la kujifunza 2', k: '2', title: 'Milinganyo, fomula, maumbo',
          sub: 'Kutatua matatizo kwa kikokotoo na bila kikokotoo', when: 'Septemba', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Eneo la kujifunza 3', k: '3.1', title: 'Fanksheni na sifa zake',
          sub: 'Kikoa, sifuri, kuongezeka na kupungua, ulinganifu', when: 'Mwisho wa Septemba', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Eneo la kujifunza 3', k: '3.2', title: 'Ukuaji na upungufu',
          sub: 'Fanksheni za mstari na fanksheni za kipeo', when: 'Oktoba · Novemba', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Eneo la kujifunza 3', k: '3.3', title: 'Fanksheni na milinganyo ya kipeo cha pili',
          sub: 'Mwendo wenye mchapuko usiobadilika', when: 'Novemba', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Eneo la kujifunza 3', k: '3.4', title: 'Matukio yanayojirudia',
          sub: 'Fanksheni za sine', when: 'Desemba', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Eneo la kujifunza 3', k: '3.5', title: 'Regresheni',
          sub: 'Kuchanganua mfululizo wa vipimo kwa zana za kidijitali', when: 'Desemba', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Eneo la kujifunza 3', k: '3.6', title: 'Fanksheni kinyume na logariti',
          sub: 'Fanksheni ya kipeuo cha pili, logariti, milinganyo ya kipeo', when: 'Januari', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Eneo la kujifunza 3', k: '3.7', title: 'Grafu na vigezo',
          sub: 'Fanksheni za msingi bila kikokotoo, kunyoosha na kuhamisha', when: 'Februari · Machi', ustd: 15 },
        { file: 'lb4.html', lb: 'Eneo la kujifunza 4', k: '4', title: 'Mifumo ya milinganyo ya mstari na matriki',
          sub: 'Mbinu ya Gauss, seti za masuluhisho, hesabu za matriki', when: 'Machi · Aprili', ustd: 20 },
        { file: 'lb1.html', lb: 'Eneo la kujifunza 1', k: '1', title: 'Uwezekano katika majaribio ya nasibu ya hatua nyingi',
          sub: 'Michoro ya mti, majedwali ya visanduku vinne, uigaji', when: 'Aprili', ustd: 15 },
        { file: 'wb3.html', lb: 'Eneo la hiari 3', k: 'H', title: 'Mbinu za kinamba na uigaji',
          sub: 'Mbinu ya kugawanya nusu, kukadiria maeneo, mbinu ya Monte Carlo', when: 'Mei · Juni', ustd: 10 }
    ]
};
