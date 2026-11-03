/* kapitel.js — the chapters of the Swahili edition (Kenya) of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/), in
 * the order of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5; Grundkurs, Kurshalbjahre
 * 12/I and 12/II). Book sw-2 (03.11.2026), the sibling of mathe11-sw. Terms as in tools/buch-sw/istilahi.md. Single source
 * for the table of contents (index.html) and the previous/next cards at the end of every chapter. No print edition yet
 * (druck: false).
 */
window.BUCH = {
    title: 'Hisabati · Berufliches Gymnasium 12',
    short: 'Hisabati 12',
    lang: 'sw',
    druck: false,
    description: 'Kitabu shirikishi cha kiada cha hisabati kwa Berufliches Gymnasium (shule ya sekondari ya juu nchini Ujerumani yenye mwelekeo wa kitaaluma), darasa la 12, Saksonia: vigeu vya nasibu na mgawanyo wa binomia, unyambuaji kuanzia vikomo hadi matatizo ya upeo, na vekta katika nafasi, pamoja na maabara, uigaji, michoro ya 3D na majaribio ya kujipima yanayotoa jibu papo hapo.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Eneo la kujifunza 1', k: '1.1', title: 'Uwezekano wenye sharti',
          sub: 'Michoro ya mti, majedwali ya visanduku vinne, matukio huru', when: 'Agosti · Septemba', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Eneo la kujifunza 1', k: '1.2', title: 'Vigeu vya nasibu',
          sub: 'Mgawanyo wa uwezekano, thamani tarajiwa, tofautiano, michezo ya haki', when: 'Septemba', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Eneo la kujifunza 1', k: '1.3', title: 'Mgawanyo wa binomia',
          sub: 'Mfululizo wa Bernoulli, koefisienti ya binomia, uwezekano limbikizi', when: 'Oktoba · Novemba', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Eneo la kujifunza 2', k: '2.1', title: 'Vikomo',
          sub: 'Mwenendo kuelekea infiniti, asimptoti, mwendelezo', when: 'Novemba · Desemba', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Eneo la kujifunza 2', k: '2.2', title: 'Kinyambuo',
          sub: 'Viwango vya mabadiliko, kutoka sekanti hadi tanjenti, kunyambua kwa grafu', when: 'Desemba', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Eneo la kujifunza 2', k: '2.3', title: 'Kanuni za unyambuaji',
          sub: 'Kanuni ya kipeo, ya jumla na ya kizidishi, eˣ na sin x, mazao rahisi', when: 'Januari', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Eneo la kujifunza 2', k: '2.4', title: 'Kuongezeka na kupungua, nukta za kugeuka, nukta za mgeuko',
          sub: 'Yale ambayo f′ na f″ yanasema kuhusu grafu', when: 'Januari · Machi', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Eneo la kujifunza 2', k: '2.5', title: 'Kuchunguza grafu',
          sub: 'Ulinganifu, asimptoti, tanjenti na normali, fanksheni katika muktadha', when: 'Machi', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Eneo la kujifunza 2', k: '2.6', title: 'Fanksheni kutokana na masharti, na matatizo ya upeo',
          sub: 'Kuunda fanksheni kutokana na masharti, kutafuta kilicho bora zaidi', when: 'Aprili · Mei', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Eneo la kujifunza 5', k: '5.1', title: 'Vekta katika nafasi',
          sub: 'Nukta na vekta, hesabu za vekta, urefu, nukta ya kati', when: 'Mei · Juni', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Eneo la kujifunza 5', k: '5.2', title: 'Zao la skala na pembe',
          sub: 'Vekta zilizo wima, pembe kati ya vekta, uthibitisho kwenye pembenne', when: 'Juni · Julai', ustd: 8 }
    ]
};
