/* kapitel.js — the chapters of the Swahili edition (Kenya) of "Mathematik · Berufliches Gymnasium 12 · Leistungskurs"
 * (buch/mathe12lk/), in the order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026,
 * Leistungskurs: LB 1 → LB 2 → LB 6 in Jahrgangsstufe 12). Book sw-4 (03.11.2026), the sibling of mathe12-sw. Terms as in
 * tools/buch-sw/istilahi.md. Single source for the table of contents (index.html) and the previous/next cards at the end
 * of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Hisabati · Berufliches Gymnasium 12 · Leistungskurs',
    short: 'Hisabati 12 LK',
    lang: 'sw',
    druck: false,
    description: 'Kitabu shirikishi cha kiada cha hisabati kwa Berufliches Gymnasium (shule ya sekondari ya juu nchini Ujerumani yenye mwelekeo wa kitaaluma), darasa la 12, Leistungskurs (kozi ya kina), Saksonia: vigeu vya nasibu diskreti pamoja na fanksheni ya mgawanyo limbikizi na mgawanyo wa binomia, unyambuaji kuanzia vikomo na mwendelezo, kupitia kanuni ya zao na kanuni ya mnyororo hadi regresheni na matatizo ya upeo, na jiometri ya vekta katika nafasi, pamoja na uthibitisho, maabara, michoro ya 3D na majaribio ya kujipima yanayotoa jibu papo hapo.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Eneo la kujifunza 1', k: '1.1', title: 'Uwezekano wenye sharti',
          sub: 'Michoro ya mti, majedwali ya visanduku vinne, nadharia ya Bayes, matukio huru', when: 'Agosti · Septemba', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Eneo la kujifunza 1', k: '1.2', title: 'Vigeu vya nasibu',
          sub: 'Fanksheni ya uwezekano na fanksheni ya mgawanyo limbikizi, thamani tarajiwa, variansi', when: 'Septemba · Oktoba', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Eneo la kujifunza 1', k: '1.3', title: 'Mgawanyo wa binomia',
          sub: 'Mfululizo wa Bernoulli, alama ya jumla, kutafuta n na p, vipimo vya mgawanyo', when: 'Oktoba · Novemba', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Eneo la kujifunza 2', k: '2.1', title: 'Vikomo na mwendelezo',
          sub: 'Mwenendo kuelekea infiniti, kikomo kwenye nukta, nukta za kutoendelea', when: 'Novemba · Desemba', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Eneo la kujifunza 2', k: '2.2', title: 'Kinyambuo',
          sub: 'Viwango vya mabadiliko, kinyambuo kama kikomo, ukadiriaji wa mstari', when: 'Desemba · Januari', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Eneo la kujifunza 2', k: '2.3', title: 'Kanuni za unyambuaji',
          sub: 'Kanuni ya kipeo, ya kizidishi na ya jumla, eˣ, ln x, sin x, cos x', when: 'Januari', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Eneo la kujifunza 2', k: '2.4', title: 'Kanuni ya zao na kanuni ya mnyororo',
          sub: 'Kunyambua mazao na fanksheni changamano, vipeuo na fanksheni za e', when: 'Februari', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Eneo la kujifunza 2', k: '2.5', title: 'Kuongezeka na kupungua, nukta za kugeuka, nukta za mgeuko',
          sub: 'Masharti ya lazima na yanayotosha, maupeo ya jumla', when: 'Februari · Machi', ustd: 14 },
        { file: 'lb2-6.html', lb: 'Eneo la kujifunza 2', k: '2.6', title: 'Kuchunguza grafu',
          sub: 'Ulinganifu, asimptoti, tanjenti na normali, matatizo katika muktadha', when: 'Machi · Aprili', ustd: 14 },
        { file: 'lb2-7.html', lb: 'Eneo la kujifunza 2', k: '2.7', title: 'Fanksheni kutokana na masharti, na regresheni',
          sub: 'Kuunda fanksheni kutokana na masharti, modeli za regresheni kwa zana za kidijitali', when: 'Aprili', ustd: 9 },
        { file: 'lb2-8.html', lb: 'Eneo la kujifunza 2', k: '2.8', title: 'Matatizo ya upeo',
          sub: 'Kuunda modeli, maupeo ya mpakani, kuchambua hali mbalimbali', when: 'Mei', ustd: 12 },
        { file: 'lb6-1.html', lb: 'Eneo la kujifunza 6', k: '6.1', title: 'Vekta katika nafasi',
          sub: 'Vekta za mahali na vekta za kuunganisha, mchanganyiko wa mstari, sentroidi', when: 'Mei · Juni', ustd: 12 },
        { file: 'lb6-2.html', lb: 'Eneo la kujifunza 6', k: '6.2', title: 'Zao la skala na pembe',
          sub: 'Vekta zilizo wima, pembe, uthibitisho kwa vekta', when: 'Juni · Julai', ustd: 8 }
    ]
};
