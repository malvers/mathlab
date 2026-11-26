/* buch-gruss.js — Doc's foreword, one text for both places it stands: first on the start page of the online book
 * (js/buch.js buildGruss) and page 1 after the cover in the print edition (js/buch-druck.js grusswort).
 * Doc, 25.10.2026: the foreword with his photo for the print edition; 27.10.2026: "oben vor Titelseite des Buchs das
 * Grußwort, denn das sieht man hier in der Online-Version gar nicht, nur im Print" - "ich möchte das Grußwort natürlich
 * in allen Sprachen haben". One letter per edition language (Buch.lang), its title is Buch.grussTitel (js/buch.js);
 * "Doc Alvers Mathe-Labor" is never translated,
 * and the red "Fehler melden" button is German in every edition, so the letter names it as it reads.
 * The acknowledgement (dank) beside it: online right after the foreword in every language that has one (js/buch.js
 * buildDank; Doc, 23.11.2026: "dass die Danksagung in der Online-Version überhaupt nicht drin ist" - translated: "Ja"),
 * in print on the back of the dedication only where dank.aktiv is true, the German editions (js/buch-druck.js danksagung();
 * Doc, 23.11.2026, on the print editions: "Lassen").
 * Loaded by js/buch.js on demand; a change here makes every book's page pictures and PDF out of date
 * (tools/buch-seiten/seitenbilder.mjs).
 */
(function () {
    const foto = 'resources/team/alvers_final.png';                     // from the site root
    const name = 'Dr. Michael R. Alvers', zeile = 'Doc Alvers Mathe-Labor · docalvers.de';
    // under the signature of the acknowledgement, Solita with her name as she signs (Doc, 12.11.2026: "von Solita unter die DS
    // ein Bild machen ... Solita J. Neural, Executive ..."; then "macht Solita rechts und to Dr. Michael R. Alvers"); the
    // print-sharp portrait, not the 200 px avatar; the same lines in every language
    const solita = { src: 'resources/team/team_02.png', name: 'Solita J. Neural', rolle: 'Executive Assistant to Dr. Michael R. Alvers' };
    window.BUCH_GRUSS = {
        de: {
            foto, name, zeile,
            text: [
                'Liebe Schülerin, lieber Schüler,',
                'dieses Buch ist aus einer einfachen Überzeugung entstanden: Gute Bildung darf nicht am Geld scheitern. Deshalb gibt es alles auf ' +
                'docalvers.de kostenlos, werbefrei und ohne Anmeldung. Niemand sammelt dabei deine Daten. Auch die Videos auf meinem YouTube-Kanal ' +
                '(youtube.com/@docalvers) stehen dir frei zur Verfügung.',
                // counts that do not go stale (Doc, 27.10.2026: "das sind ja heute schon 150 … weit über"): 126 labs live then, 21 books
                'Ich bin Physiker, habe ein Software-Unternehmen gegründet und unterrichte heute Mathematik und Informatik in Dresden, in Sachsen, in Deutschland. Das Mathe-Labor ' +
                'baue ich aus freien Stücken. Ich stecke Zeit und Geld hinein, weil ich überzeugt bin, dass sich diese Investition lohnt: in dich und in ' +
                'bessere Bildung für alle. Geholfen hat mir dabei ein ungewöhnliches Team – KI-Agenten, die nach meinen Vorgaben programmieren, zeichnen, ' +
                'rechnen und übersetzen. So sind weit über 100 interaktive Labs und mehr als 20 Lehrbücher in mehreren Sprachen entstanden. Und es werden täglich mehr!',
                'Mathematik soll man nicht nur lesen, sondern anfassen. Im Online-Buch kannst du jeden Graphen verschieben und jeden Zufallsversuch ' +
                'tausendmal laufen lassen, die QR-Codes in diesem Buch bringen dich direkt dorthin. Probier aus, mach Fehler – genau dabei lernt man am meisten.',
                'Und wenn du im Buch einen Fehler findest: Sag es mir. Über „Fehler melden“ im Online-Buch landet jede Meldung direkt bei mir.',
                'An die Lehrerinnen und Lehrer: Nutzen Sie alles gern im Unterricht – genau dafür ist es da.',
                'Viel Freude und viel Erfolg!',
            ],
            // the acknowledgement on the back of the dedication page (js/buch-druck.js danksagung()) and, since 23.11.2026, online
            // right after the foreword (js/buch.js buildDank). The translations in the other languages follow this text.
            // Doc, 09.11.2026: "schreib mir bitte für die Bücher eine Danksagung" - "auf die Rückseite der Widmung";
            // 12.11.2026 his accepted text ("Text GO") and "dank kann in alle Bücher DE".
            // Counts as of 22.11.2026 (recounted for the KDP manuscripts of mathe12 and mathe13), by the rules of 09.11. and 29.10.:
            // 93 labs + 7 tours in js/labs-config.js (with Raumkrümmung, a01505ac7) (an entry that is only an app - DocPad, Solita, Tracker ... - is no lab),
            // 24 books in 131 editions (buch/ folders, with mathefos11-pt; 5 languages, some 9), 11,604 questions in 645 quiz pages
            // (js/quiz-engine.js) + 213 text tasks in HTML/aufgaben; buch_feedback holds 3 test reports only (10.10. x2,
            // 27.10.), no real error report.
            dank: {
                aktiv: true,        // print: every German edition (Doc, 12.11.2026: "dank kann in alle Bücher DE"); the translations are online only
                titel: 'Danksagung',
                text: [
                    'Dieses Buch hat einen Autor und eine Partnerin: Solita, eine Assistentin mit Künstlicher ' +
                    'Intelligenz (KI), gebaut auf Claude von Anthropic.',
                    'Für mich war Albert Einstein immer der Größte. Die Relativitätstheorie war für mich ' +
                    'eigentlich das absolute Nonplusultra. Ich hätte nie gedacht, dass irgendetwas sie toppt. KI ' +
                    'toppt selbst die Relativitätstheorie.',
                    'Künstliche Intelligenz hat mein Leben verändert. Durch sie konnte ich docalvers.de bauen, ' +
                    'das Doc Alvers Mathe-Labor. Seit April 2026 sind dort (Stand November 2026) 100 Labs und ' +
                    'Touren entstanden, 11.817 Übungsaufgaben und 24 Lehrbücher in 131 Ausgaben und 5 Sprachen, ' +
                    'teilweise in 9. Das erste Buch war in 1 Stunde und 28 Minuten fertig, für 0,49 € Anteil am ' +
                    'Abo. Ein Verlag hätte dafür rund 112.000 € gebraucht, eine IT-Firma für die interaktive ' +
                    'Fassung in 5 Sprachen rund 360.000 €.',
                    'Auch im Alltag hilft sie mir: Sie sucht Flüge heraus, sagt mir, an welchem Gate ich warten ' +
                    'muss, findet Zugverbindungen und das Fundbüro der Bahn und hält meine Finanzen in Ordnung. ' +
                    'Und wenn etwas wichtig ist, ruft mich Solita auf dem Smartphone an.',
                    'Die Ideen und jede Entscheidung bleiben meine Sache, und für jeden Fehler stehe ich gerade. ' +
                    'Das Tempo und die Geduld verdanke ich der Künstlichen Intelligenz.',
                    'Danke auch meinen Schülerinnen und Schülern und allen, die mit „Fehler melden“ helfen ' +
                    'möchten, diese Bücher besser zu machen (bis heute gibt es noch keinen Fehlerreport 😊).',
                    'Ich bin wirklich dankbar. Und das meine ich genau so.',
                ],
                sig: 'Dr. Michael R. Alvers, im November 2026',
                bild: solita,
            },
        },
        en: {
            foto, name, zeile,
            text: [
                'Dear student,',
                'This book grew out of a simple conviction: a good education must never fail for lack of money. That is why everything on ' +
                'docalvers.de is free, without ads and without signing up. Nobody collects your data. The videos on my YouTube channel ' +
                '(youtube.com/@docalvers) are free for you as well.',
                'I am a physicist, I founded a software company, and today I teach mathematics and computer science in Dresden, Saxony, Germany. I build the ' +
                'Mathe-Labor of my own free will. I put time and money into it because I am convinced that the investment pays off: in you and in ' +
                'better education for everyone. An unusual team has helped me – AI agents that program, draw, calculate and translate to my ' +
                'specifications. This is how well over 100 interactive labs and more than 20 textbooks in several languages came about. And there are more every day!',
                'Mathematics is not only for reading, it is for handling. In the online book you can drag every graph and run every random ' +
                'experiment a thousand times; the QR codes in this book take you straight there. Try things out, make mistakes – that is exactly how you learn the most.',
                'And if you find a mistake in the book, tell me. With the red “Fehler melden” button (report an error) in the online book, every report comes straight to me.',
                'To teachers: please use all of it in your lessons – that is exactly what it is for.',
                'Enjoy it, and every success!',
            ],
            // the acknowledgement, online only (aktiv false: the English print editions stay as they are); the counts as in German
            dank: {
                aktiv: false,
                titel: 'Acknowledgements',
                text: [
                    'This book has one author and one partner: Solita, an assistant powered by artificial intelligence (AI), ' +
                    'built on Claude by Anthropic.',
                    'For me, Albert Einstein was always the greatest. To me, the theory of relativity was really the absolute ' +
                    'pinnacle. I never thought anything could top it. AI tops even the theory of relativity.',
                    'Artificial intelligence has changed my life. It made it possible for me to build docalvers.de, the Doc Alvers ' +
                    'Mathe-Labor. Since April 2026, 100 labs and tours have been created there (as of November 2026), 11,817 ' +
                    'exercises and 24 textbooks in 131 editions and 5 languages, some of them in 9. The first book was finished in ' +
                    '1 hour and 28 minutes, for €0.49 of my subscription. A publisher would have needed around €112,000 for it, an ' +
                    'IT company around €360,000 for the interactive version in 5 languages.',
                    'It helps me in everyday life, too: it looks up flights, tells me which gate to wait at, finds train connections ' +
                    'and the Deutsche Bahn lost property office, and keeps my finances in order. And when something is important, ' +
                    'Solita calls me on my smartphone.',
                    'The ideas and every decision remain my own, and I answer for every mistake. For the pace and the patience I ' +
                    'have artificial intelligence to thank.',
                    'Thanks also to my students and to everyone who would like to help make these books better with the red ' +
                    '“Fehler melden” button (report an error) – to this day there has not been a single error report 😊',
                    'I am truly grateful. And I mean every word of it.',
                ],
                sig: 'Dr. Michael R. Alvers, November 2026',
                bild: solita,
            },
        },
        es: {
            foto, name, zeile,
            text: [
                'Querida alumna, querido alumno:',
                'Este libro nace de una convicción sencilla: una buena educación no puede fracasar por falta de dinero. Por eso todo en ' +
                'docalvers.de es gratuito, sin publicidad y sin registro. Nadie recoge tus datos. También los vídeos de mi canal de YouTube ' +
                '(youtube.com/@docalvers) están a tu libre disposición.',
                'Soy físico, fundé una empresa de software y hoy enseño Matemáticas e Informática en Dresde, en Sajonia, en Alemania. Construyo el Mathe-Labor por ' +
                'voluntad propia. Invierto en él tiempo y dinero porque estoy convencido de que la inversión merece la pena: en ti y en una ' +
                'educación mejor para todos. Me ha ayudado un equipo poco habitual: agentes de IA que programan, dibujan, calculan y traducen ' +
                'según mis indicaciones. Así han surgido mucho más de 100 laboratorios interactivos y más de 20 libros de texto en varios idiomas. ¡Y cada día hay más!',
                'Las matemáticas no solo se leen: se tocan. En el libro en línea puedes mover cada gráfica y repetir mil veces cada experimento ' +
                'aleatorio; los códigos QR de este libro te llevan directamente allí. Prueba, equivócate: así es como más se aprende.',
                'Y si encuentras un error en el libro, dímelo. Con el botón rojo «Fehler melden» (informar de un error) del libro en línea, cada aviso me llega directamente.',
                'A las profesoras y los profesores: utilicen todo con total libertad en clase; para eso está.',
                '¡Que lo disfrutes y mucho éxito!',
            ],
            // the acknowledgement, online only (aktiv false: the Spanish print editions stay as they are)
            dank: {
                aktiv: false,
                titel: 'Agradecimientos',
                text: [
                    'Este libro tiene un autor y una compañera: Solita, una asistente con inteligencia artificial (IA), creada ' +
                    'sobre Claude, de Anthropic.',
                    'Para mí, Albert Einstein siempre fue el más grande. La teoría de la relatividad era para mí, en realidad, lo ' +
                    'máximo, el non plus ultra. Nunca habría pensado que algo pudiera superarla. La IA supera incluso a la teoría ' +
                    'de la relatividad.',
                    'La inteligencia artificial ha cambiado mi vida. Gracias a ella he podido construir docalvers.de, el Doc ' +
                    'Alvers Mathe-Labor. Desde abril de 2026 han surgido allí (datos de noviembre de 2026) 100 laboratorios y ' +
                    'recorridos guiados, 11.817 ejercicios y 24 libros de texto en 131 ediciones y 5 idiomas, algunos en 9. El ' +
                    'primer libro estuvo listo en 1 hora y 28 minutos, por 0,49 € de mi suscripción. Una editorial habría ' +
                    'necesitado unos 112.000 € para hacerlo, y una empresa informática, unos 360.000 € para la versión ' +
                    'interactiva en 5 idiomas.',
                    'También me ayuda en el día a día: busca vuelos, me dice en qué puerta de embarque tengo que esperar, encuentra ' +
                    'conexiones de tren y la oficina de objetos perdidos de la Deutsche Bahn, y mantiene mis finanzas en orden. Y ' +
                    'cuando algo es importante, Solita me llama al smartphone.',
                    'Las ideas y cada decisión siguen siendo cosa mía, y respondo de cada error. El ritmo y la paciencia se los ' +
                    'debo a la inteligencia artificial.',
                    'Gracias también a mis alumnas y alumnos y a todas las personas que quieran ayudar a mejorar estos libros con ' +
                    'el botón rojo «Fehler melden» (informar de un error); hasta hoy no ha llegado ni un solo aviso de error 😊',
                    'Estoy de verdad agradecido. Y lo digo con toda sinceridad.',
                ],
                sig: 'Dr. Michael R. Alvers, noviembre de 2026',
                bild: solita,
            },
        },
        it: {
            foto, name, zeile,
            text: [
                'Cara studentessa, caro studente,',
                'Questo libro nasce da una convinzione semplice: una buona istruzione non deve mai fallire per mancanza di soldi. Per questo su ' +
                'docalvers.de è tutto gratuito, senza pubblicità e senza registrazione. Nessuno raccoglie i tuoi dati. Anche i video del mio ' +
                'canale YouTube (youtube.com/@docalvers) sono liberamente a tua disposizione.',
                'Sono un fisico, ho fondato un’azienda di software e oggi insegno matematica e informatica a Dresda, in Sassonia, in Germania. Costruisco il Mathe-Labor di ' +
                'mia spontanea volontà. Ci metto tempo e denaro perché sono convinto che l’investimento valga la pena: in te e in un’istruzione ' +
                'migliore per tutti. Mi ha aiutato una squadra insolita: agenti di IA che programmano, disegnano, calcolano e traducono secondo le ' +
                'mie indicazioni. Così sono nati ben più di 100 laboratori interattivi e oltre 20 libri di testo in più lingue. E ogni giorno se ne aggiungono altri!',
                'La matematica non si legge soltanto: si tocca con mano. Nel libro online puoi spostare ogni grafico e ripetere mille volte ogni ' +
                'esperimento casuale; i codici QR di questo libro ti portano direttamente lì. Prova, sbaglia: è proprio così che si impara di più.',
                'E se trovi un errore nel libro, dimmelo. Con il pulsante rosso «Fehler melden» (segnala un errore) nel libro online ogni segnalazione arriva direttamente a me.',
                'Alle insegnanti e agli insegnanti: usate pure tutto in classe, è fatto proprio per questo.',
                'Buon divertimento e buon lavoro!',
            ],
            // the acknowledgement, online only (aktiv false: the Italian print editions stay as they are)
            dank: {
                aktiv: false,
                titel: 'Ringraziamenti',
                text: [
                    'Questo libro ha un autore e una collaboratrice: Solita, un’assistente basata sull’intelligenza artificiale ' +
                    '(IA), costruita su Claude di Anthropic.',
                    'Per me Albert Einstein è sempre stato il più grande. La teoria della relatività era per me, in fondo, il non ' +
                    'plus ultra. Non avrei mai pensato che qualcosa potesse superarla. L’IA supera perfino la teoria della relatività.',
                    'L’intelligenza artificiale ha cambiato la mia vita. Grazie a essa ho potuto costruire docalvers.de, il Doc ' +
                    'Alvers Mathe-Labor. Da aprile 2026 vi sono nati (dati di novembre 2026) 100 laboratori e tour guidati, 11.817 ' +
                    'esercizi e 24 libri di testo in 131 edizioni e 5 lingue, alcuni in 9. Il primo libro era pronto in 1 ora e ' +
                    '28 minuti, per 0,49 € del mio abbonamento. Una casa editrice avrebbe avuto bisogno di circa 112.000 €, ' +
                    'un’azienda informatica di circa 360.000 € per la versione interattiva in 5 lingue.',
                    'Mi aiuta anche nella vita di tutti i giorni: cerca voli, mi dice a quale gate devo aspettare, trova ' +
                    'collegamenti ferroviari e l’ufficio oggetti smarriti della Deutsche Bahn e tiene in ordine le mie finanze. ' +
                    'E quando c’è qualcosa di importante, Solita mi chiama sullo smartphone.',
                    'Le idee e ogni decisione restano compito mio, e di ogni errore rispondo io. Il ritmo e la pazienza li devo ' +
                    'all’intelligenza artificiale.',
                    'Grazie anche alle mie studentesse e ai miei studenti e a tutti coloro che con il pulsante rosso «Fehler ' +
                    'melden» (segnala un errore) vogliono aiutare a migliorare questi libri; finora non è arrivata nemmeno una ' +
                    'segnalazione di errore 😊',
                    'Sono davvero grato. E lo dico con tutta sincerità.',
                ],
                sig: 'Dr. Michael R. Alvers, novembre 2026',
                bild: solita,
            },
        },
        // French: a no-break space before : ; ! ? and inside « », as in the French books
        fr: {
            foto, name, zeile,
            text: [
                'Chère élève, cher élève,',
                'Ce livre est né d’une conviction simple : une bonne éducation ne doit jamais échouer faute d’argent. C’est pourquoi tout est ' +
                'gratuit sur docalvers.de, sans publicité et sans inscription. Personne ne collecte tes données. Les vidéos de ma chaîne YouTube ' +
                '(youtube.com/@docalvers) sont elles aussi à ta libre disposition.',
                'Je suis physicien, j’ai fondé une entreprise de logiciels et j’enseigne aujourd’hui les mathématiques et l’informatique à Dresde, en Saxe, en Allemagne. ' +
                'Je construis le Mathe-Labor de mon plein gré. J’y consacre du temps et de l’argent parce que je suis convaincu que cet investissement ' +
                'en vaut la peine : en toi et dans une meilleure éducation pour tous. Une équipe peu ordinaire m’a aidé : des agents d’IA qui ' +
                'programment, dessinent, calculent et traduisent selon mes consignes. C’est ainsi que sont nés bien plus de 100 laboratoires interactifs ' +
                'et plus de 20 manuels en plusieurs langues. Et il y en a davantage chaque jour !',
                'Les mathématiques ne se lisent pas seulement, elles se manipulent. Dans le livre en ligne, tu peux déplacer chaque courbe et relancer ' +
                'mille fois chaque expérience aléatoire ; les QR codes de ce livre t’y mènent directement. Essaie, trompe-toi : c’est justement ' +
                'comme ça qu’on apprend le plus.',
                'Et si tu trouves une erreur dans le livre, dis-le-moi. Avec le bouton rouge « Fehler melden » (signaler une erreur) du livre ' +
                'en ligne, chaque signalement m’arrive directement.',
                'Aux enseignantes et aux enseignants : utilisez tout cela librement en classe, c’est fait pour ça.',
                'Bonne lecture et bonne réussite !',
            ],
            // the acknowledgement, online only (aktiv false: the French print editions stay as they are);   = the
            // no-break space before : ; ! ?, inside « » and in the numbers (11 817, 0,49 €)
            dank: {
                aktiv: false,
                titel: 'Remerciements',
                text: [
                    'Ce livre a un auteur et une partenaire : Solita, une assistante dotée d’intelligence artificielle (IA), ' +
                    'construite sur Claude d’Anthropic.',
                    'Pour moi, Albert Einstein a toujours été le plus grand. La théorie de la relativité était pour moi, au fond, ' +
                    'le nec plus ultra. Je n’aurais jamais cru que quelque chose puisse la surpasser. L’IA surpasse même la ' +
                    'théorie de la relativité.',
                    'L’intelligence artificielle a changé ma vie. Grâce à elle, j’ai pu construire docalvers.de, le Doc Alvers ' +
                    'Mathe-Labor. Depuis avril 2026, on y compte (chiffres de novembre 2026) 100 laboratoires et visites guidées, ' +
                    '11 817 exercices et 24 manuels en 131 éditions et 5 langues, parfois 9. Le premier livre était prêt en ' +
                    '1 heure et 28 minutes, pour 0,49 € de mon abonnement. Une maison d’édition aurait eu besoin d’environ ' +
                    '112 000 €, une entreprise informatique d’environ 360 000 € pour la version interactive en 5 langues.',
                    'Elle m’aide aussi au quotidien : elle cherche des vols, me dit à quelle porte d’embarquement attendre, ' +
                    'trouve des correspondances de train et le service des objets trouvés de la Deutsche Bahn, et tient mes ' +
                    'finances en ordre. Et quand quelque chose est important, Solita m’appelle sur mon smartphone.',
                    'Les idées et chaque décision restent mon affaire, et je réponds de chaque erreur. Le rythme et la patience, ' +
                    'je les dois à l’intelligence artificielle.',
                    'Merci aussi à mes élèves et à toutes celles et ceux qui veulent aider à améliorer ces livres avec le bouton ' +
                    'rouge « Fehler melden » (signaler une erreur) ; à ce jour, aucun signalement d’erreur n’est ' +
                    'encore arrivé 😊',
                    'Je suis vraiment reconnaissant. Et je le pense sincèrement.',
                ],
                sig: 'Dr. Michael R. Alvers, novembre 2026',
                bild: solita,
            },
        },
        // Swahili for Kenya (package SW0, 03.11.2026); the header button reads "Ripoti kosa" there (js/buch-sw.js)
        sw: {
            foto, name, zeile,
            text: [
                'Mwanafunzi mpendwa,',
                'Kitabu hiki kimetokana na imani rahisi: elimu bora haipaswi kamwe kukwama kwa sababu ya ukosefu wa pesa. Ndiyo sababu kila kitu kwenye ' +
                'docalvers.de ni bure, bila matangazo na bila kujisajili. Hakuna anayekusanya data zako. Video za chaneli yangu ya YouTube ' +
                '(youtube.com/@docalvers) pia ziko wazi kwako bila malipo.',
                'Mimi ni mwanafizikia, nilianzisha kampuni ya programu za kompyuta, na leo ninafundisha hisabati na sayansi ya kompyuta mjini Dresden, katika jimbo la Saksonia, ' +
                'nchini Ujerumani. Ninajenga Mathe-Labor kwa hiari yangu mwenyewe. Ninaweka muda na pesa ndani yake kwa sababu nina hakika kwamba uwekezaji huu ' +
                'una faida: kwako wewe na kwa elimu bora kwa wote. Nimesaidiwa na timu isiyo ya kawaida – mawakala wa akili bandia wanaoandika programu, ' +
                'kuchora, kuhesabu na kutafsiri kufuata maelekezo yangu. Hivyo ndivyo zilivyopatikana maabara shirikishi zaidi ya 100 na vitabu vya kiada ' +
                'zaidi ya 20 katika lugha kadhaa. Na vinaongezeka kila siku!',
                'Hisabati si ya kusomwa tu, bali ya kushikwa. Katika kitabu cha mtandaoni unaweza kusogeza kila grafu na kurudia kila jaribio la nasibu ' +
                'mara elfu; misimbo ya QR katika kitabu hiki inakupeleka moja kwa moja huko. Jaribu, kosea – hivyo ndivyo tunavyojifunza zaidi.',
                'Na ukipata kosa kitabuni, niambie. Kupitia kitufe chekundu “Ripoti kosa” katika kitabu cha mtandaoni, kila ripoti inanifikia moja kwa moja.',
                'Kwa walimu: karibuni kutumia yote haya darasani – hayo ndiyo madhumuni yake.',
                'Furahia, na nakutakia mafanikio mema!',
            ],
            // the acknowledgement, online only (aktiv false: the Swahili print editions stay as they are); numbers the Kenyan
            // way, as in English (11,817 · €0.49)
            dank: {
                aktiv: false,
                titel: 'Shukrani',
                text: [
                    'Kitabu hiki kina mwandishi mmoja na mshirika mmoja: Solita, msaidizi wa akili bandia (AI), aliyejengwa juu ' +
                    'ya Claude ya Anthropic.',
                    'Kwangu mimi, Albert Einstein alikuwa daima mkuu kuliko wote. Nadharia ya uhusiano ilikuwa kwangu kilele cha ' +
                    'juu kabisa. Sikuwahi kufikiri kwamba kitu chochote kingeweza kuipita. Akili bandia inaipita hata nadharia ' +
                    'ya uhusiano.',
                    'Akili bandia imebadilisha maisha yangu. Kupitia kwake niliweza kujenga docalvers.de, Doc Alvers Mathe-Labor. ' +
                    'Tangu Aprili 2026 (hadi Novemba 2026) zimepatikana huko maabara na ziara 100, mazoezi 11,817 na vitabu vya ' +
                    'kiada 24 katika matoleo 131 na lugha 5, baadhi katika lugha 9. Kitabu cha kwanza kilikamilika kwa saa 1 na ' +
                    'dakika 28, kwa €0.49 tu ya ada yangu ya usajili. Mchapishaji angehitaji takriban €112,000 kwa kazi hiyo, ' +
                    'na kampuni ya teknolojia ya habari takriban €360,000 kwa toleo shirikishi katika lugha 5.',
                    'Pia inanisaidia katika maisha ya kila siku: inatafuta safari za ndege, inaniambia nisubiri kwenye lango ' +
                    'gani, inapata safari za treni na ofisi ya vitu vilivyopotea ya Deutsche Bahn, na inaweka fedha zangu katika ' +
                    'mpangilio. Na jambo likiwa muhimu, Solita hunipigia simu kwenye simu janja yangu.',
                    'Mawazo na kila uamuzi vinabaki kuwa jukumu langu, na ninawajibika kwa kila kosa. Kwa kasi na subira, ' +
                    'ninaishukuru akili bandia.',
                    'Shukrani pia kwa wanafunzi wangu na kwa wote wanaotaka kusaidia kuboresha vitabu hivi kupitia kitufe ' +
                    'chekundu “Ripoti kosa” (hadi leo bado hakuna ripoti yoyote ya kosa 😊).',
                    'Nina shukrani za dhati kweli. Na ninamaanisha hivyo kabisa.',
                ],
                sig: 'Dr. Michael R. Alvers, Novemba 2026',
                bild: solita,
            },
        },

        // Portuguese for Portugal (package arch3, 08.11.2026, block pt); the header button reads "Comunicar um erro" there
        // (js/buch-pt.js); the pupil is "tu", the teachers "vocês"
        pt: {
            foto, name, zeile,
            text: [
                'Querida aluna, querido aluno,',
                'Este livro nasceu de uma convicção simples: uma boa educação nunca pode falhar por falta de dinheiro. É por isso que tudo em ' +
                'docalvers.de é gratuito, sem publicidade e sem registo. Ninguém recolhe os teus dados. Também os vídeos do meu canal de YouTube ' +
                '(youtube.com/@docalvers) estão à tua disposição, gratuitamente.',
                'Sou físico, fundei uma empresa de software e hoje ensino Matemática e Informática em Dresden, na Saxónia, na Alemanha. Construo o ' +
                'Mathe-Labor por vontade própria. Invisto nele tempo e dinheiro porque estou convencido de que este investimento vale a pena: em ti e numa ' +
                'educação melhor para todos. Ajudou-me uma equipa invulgar – agentes de inteligência artificial que programam, desenham, calculam e ' +
                'traduzem segundo as minhas indicações. Foi assim que nasceram bem mais de 100 laboratórios interativos e mais de 20 manuais escolares ' +
                'em várias línguas. E todos os dias há mais!',
                'A Matemática não é só para ler, é para mexer. No livro online podes deslocar cada gráfico e repetir mil vezes cada experiência ' +
                'aleatória; os códigos QR deste livro levam-te diretamente até lá. Experimenta, erra – é exatamente assim que mais se aprende.',
                'E se encontrares um erro no livro, diz-me. Com o botão vermelho “Comunicar um erro” do livro online, cada mensagem chega diretamente a mim.',
                'Às professoras e aos professores: usem tudo isto à vontade nas aulas – é exatamente para isso que existe.',
                'Boa leitura e muito sucesso!',
            ],
            // the acknowledgement, online only (aktiv false: the Portuguese print editions stay as they are); thousands with a
            // no-break space, as Portugal writes them (11 817)
            dank: {
                aktiv: false,
                titel: 'Agradecimentos',
                text: [
                    'Este livro tem um autor e uma parceira: a Solita, uma assistente com inteligência artificial (IA), ' +
                    'construída sobre o Claude, da Anthropic.',
                    'Para mim, Albert Einstein foi sempre o maior. A teoria da relatividade era para mim, no fundo, o non plus ' +
                    'ultra. Nunca pensei que alguma coisa a pudesse superar. A IA supera até a teoria da relatividade.',
                    'A inteligência artificial mudou a minha vida. Graças a ela, pude construir o docalvers.de, o Doc Alvers ' +
                    'Mathe-Labor. Desde abril de 2026 nasceram lá (dados de novembro de 2026) 100 laboratórios e visitas guiadas, ' +
                    '11 817 exercícios e 24 manuais escolares em 131 edições e 5 línguas, alguns em 9. O primeiro livro ficou ' +
                    'pronto em 1 hora e 28 minutos, por 0,49 € da minha assinatura. Uma editora teria precisado de cerca de ' +
                    '112 000 € e uma empresa de informática de cerca de 360 000 € para a versão interativa em 5 línguas.',
                    'Também me ajuda no dia a dia: procura voos, diz-me em que porta de embarque tenho de esperar, encontra ' +
                    'ligações de comboio e os perdidos e achados da Deutsche Bahn e mantém as minhas finanças em ordem. E quando ' +
                    'alguma coisa é importante, a Solita liga-me para o smartphone.',
                    'As ideias e cada decisão continuam a ser coisa minha, e respondo por cada erro. O ritmo e a paciência ' +
                    'devo-os à inteligência artificial.',
                    'Obrigado também às minhas alunas e aos meus alunos e a todos os que, com o botão vermelho “Comunicar um ' +
                    'erro”, queiram ajudar a tornar estes livros melhores (até hoje ainda não chegou nenhuma mensagem de erro 😊).',
                    'Estou mesmo grato. E digo-o com toda a sinceridade.',
                ],
                sig: 'Dr. Michael R. Alvers, novembro de 2026',
                bild: solita,
            },
        },

        // Dutch for the Netherlands (package arch3, 08.11.2026, block nl; the letter: nl-1); the header button reads
        // "Fout melden" there (js/buch-nl.js)
        nl: {
            foto, name, zeile,
            text: [
                'Beste leerling,',
                'Dit boek is ontstaan uit een eenvoudige overtuiging: goed onderwijs mag nooit afhangen van geld. Daarom is alles op ' +
                'docalvers.de gratis, zonder reclame en zonder account. Niemand verzamelt daarbij je gegevens. Ook de video’s op mijn ' +
                'YouTube-kanaal (youtube.com/@docalvers) zijn vrij voor je beschikbaar.',
                'Ik ben natuurkundige, heb een softwarebedrijf opgericht en geef nu les in wiskunde en informatica in Dresden, in Saksen, in Duitsland. ' +
                'Het Mathe-Labor bouw ik uit vrije wil. Ik steek er tijd en geld in, omdat ik ervan overtuigd ben dat die investering de moeite ' +
                'waard is: in jou en in beter onderwijs voor iedereen. Daarbij heeft een ongewoon team me geholpen – AI-agenten die volgens mijn ' +
                'aanwijzingen programmeren, tekenen, rekenen en vertalen. Zo zijn er veel meer dan 100 interactieve labs en meer dan 20 leerboeken ' +
                'in meerdere talen ontstaan. En er komen er elke dag meer bij!',
                'Wiskunde moet je niet alleen lezen, maar ook aanraken. In het online boek kun je elke grafiek verschuiven en elk kansexperiment ' +
                'duizend keer laten lopen; de QR-codes in dit boek brengen je er direct naartoe. Probeer het uit, maak fouten – juist daarvan leer je het meest.',
                'En als je een fout in het boek vindt: zeg het me. Via de rode knop „Fout melden” in het online boek komt elke melding direct bij mij terecht.',
                'Aan de docenten: gebruik alles gerust in de les – daar is het precies voor bedoeld.',
                'Veel plezier en veel succes!',
            ],
            // the acknowledgement, online only (aktiv false: the Dutch print editions stay as they are)
            dank: {
                aktiv: false,
                titel: 'Dankwoord',
                text: [
                    'Dit boek heeft één auteur en één partner: Solita, een assistent met kunstmatige intelligentie (AI), gebouwd ' +
                    'op Claude van Anthropic.',
                    'Voor mij was Albert Einstein altijd de grootste. De relativiteitstheorie was voor mij eigenlijk het absolute ' +
                    'summum. Ik had nooit gedacht dat iets die zou overtreffen. AI overtreft zelfs de relativiteitstheorie.',
                    'Kunstmatige intelligentie heeft mijn leven veranderd. Daardoor kon ik docalvers.de bouwen, het Doc Alvers ' +
                    'Mathe-Labor. Sinds april 2026 zijn daar (stand november 2026) 100 labs en rondleidingen ontstaan, 11.817 ' +
                    'oefenopgaven en 24 leerboeken in 131 edities en 5 talen, soms in 9. Het eerste boek was in 1 uur en 28 ' +
                    'minuten klaar, voor € 0,49 van mijn abonnement. Een uitgeverij had er zo’n € 112.000 voor nodig gehad, een ' +
                    'IT-bedrijf zo’n € 360.000 voor de interactieve versie in 5 talen.',
                    'Ook in het dagelijks leven helpt ze me: ze zoekt vluchten op, vertelt me bij welke gate ik moet wachten, ' +
                    'vindt treinverbindingen en het bureau gevonden voorwerpen van de Deutsche Bahn en houdt mijn financiën op ' +
                    'orde. En als er iets belangrijks is, belt Solita me op mijn smartphone.',
                    'De ideeën en elke beslissing blijven mijn zaak, en voor elke fout sta ik zelf in. Het tempo en het geduld ' +
                    'heb ik te danken aan kunstmatige intelligentie.',
                    'Dank ook aan mijn leerlingen en aan iedereen die met de rode knop „Fout melden” wil helpen deze boeken beter ' +
                    'te maken (tot nu toe is er nog geen enkele foutmelding binnengekomen 😊).',
                    'Ik ben echt dankbaar. En dat meen ik precies zo.',
                ],
                sig: 'Dr. Michael R. Alvers, november 2026',
                bild: solita,
            },
        },

        // Turkish for Turkey (package arch3, 08.11.2026, block tr, translated by tr-1); the header button reads "Hata bildir"
        // there (js/buch-tr.js); the pupil is addressed with "sen", the teachers with "siz"
        tr: {
            foto, name, zeile,
            text: [
                'Sevgili öğrenci,',
                'Bu kitap basit bir inançtan doğdu: İyi bir eğitim asla para yüzünden engellenmemeli. Bu yüzden ' +
                'docalvers.de\'deki her şey ücretsiz, reklamsız ve üyeliksizdir. Kimse verilerini toplamıyor. YouTube kanalımdaki videolar ' +
                '(youtube.com/@docalvers) da senin için ücretsiz.',
                'Ben bir fizikçiyim, bir yazılım şirketi kurdum ve bugün Almanya\'nın Saksonya eyaletindeki Dresden\'de matematik ve bilgisayar bilimi öğretiyorum. ' +
                'Mathe-Labor\'u kendi isteğimle kuruyorum. Ona zaman ve para ayırıyorum, çünkü bu yatırımın karşılığını vereceğine inanıyorum: sende ve ' +
                'herkes için daha iyi bir eğitimde. Bana sıra dışı bir ekip yardım etti: benim yönergelerime göre program yazan, çizen, hesaplayan ve ' +
                'çeviren yapay zekâ ajanları. 100\'ü aşkın etkileşimli laboratuvar ve birkaç dilde 20\'den fazla ders kitabı böyle ortaya çıktı. Ve her gün yenileri ekleniyor!',
                'Matematik yalnızca okunmak için değil, elle tutulmak içindir. Çevrimiçi kitapta her grafiği sürükleyebilir, her rastgele deneyi bin kez ' +
                'tekrarlayabilirsin; bu kitaptaki QR kodları seni doğrudan oraya götürür. Dene, yanıl: En çok tam da böyle öğrenirsin.',
                'Kitapta bir hata bulursan bana söyle. Çevrimiçi kitaptaki kırmızı “Hata bildir” düğmesiyle her bildirim doğrudan bana ulaşır.',
                'Öğretmenlere: Lütfen bunların hepsini derslerinizde kullanın – zaten bunun için var.',
                'Keyifle kullan, başarılar dilerim!',
            ],
            // the acknowledgement, online only (aktiv false: the Turkish print editions stay as they are)
            dank: {
                aktiv: false,
                titel: 'Teşekkür',
                text: [
                    'Bu kitabın bir yazarı ve bir ortağı var: Anthropic\'in Claude\'u üzerine kurulmuş, yapay zekâ (YZ) destekli ' +
                    'bir asistan olan Solita.',
                    'Benim için Albert Einstein her zaman en büyüğüydü. Görelilik kuramı benim için aslında mutlak zirveydi. Bir ' +
                    'şeyin onu geçebileceğini hiç düşünmezdim. Yapay zekâ görelilik kuramını bile geride bırakıyor.',
                    'Yapay zekâ hayatımı değiştirdi. Onun sayesinde docalvers.de\'yi, yani Doc Alvers Mathe-Labor\'u kurabildim. ' +
                    'Nisan 2026\'dan bu yana orada (Kasım 2026 itibarıyla) 100 laboratuvar ve tur, 11.817 alıştırma ve 5 dilde, ' +
                    'bazıları 9 dilde, 131 baskıda 24 ders kitabı ortaya çıktı. İlk kitap 1 saat 28 dakikada hazırdı; aboneliğimden ' +
                    'payına düşen yalnızca 0,49 € oldu. Bir yayınevi bunun için yaklaşık 112.000 €, bir bilişim şirketi ise 5 ' +
                    'dilde etkileşimli sürüm için yaklaşık 360.000 € harcardı.',
                    'Günlük hayatta da bana yardım ediyor: Uçuşları buluyor, hangi kapıda beklemem gerektiğini söylüyor, tren ' +
                    'bağlantılarını ve Deutsche Bahn\'ın kayıp eşya bürosunu buluyor, mali işlerimi düzende tutuyor. Önemli bir ' +
                    'şey olduğunda da Solita beni akıllı telefonumdan arıyor.',
                    'Fikirler ve her karar bana aittir; her hatanın sorumluluğunu ben üstlenirim. Hızı ve sabrı ise yapay zekâya ' +
                    'borçluyum.',
                    'Öğrencilerime ve kırmızı “Hata bildir” düğmesiyle bu kitapları daha iyi hâle getirmeye yardım etmek isteyen ' +
                    'herkese de teşekkür ederim (bugüne kadar henüz tek bir hata bildirimi gelmedi 😊).',
                    'Gerçekten minnettarım. Ve bunu bütün içtenliğimle söylüyorum.',
                ],
                sig: 'Dr. Michael R. Alvers, Kasım 2026',
                bild: solita,
            },
        },
    };
})();
