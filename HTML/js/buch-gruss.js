/* buch-gruss.js — Doc's foreword, one text for both places it stands: first on the start page of the online book
 * (js/buch.js buildGruss) and page 1 after the cover in the print edition (js/buch-druck.js grusswort).
 * Doc, 25.10.2026: the foreword with his photo for the print edition; 27.10.2026: "oben vor Titelseite des Buchs das
 * Grußwort, denn das sieht man hier in der Online-Version gar nicht, nur im Print" - "ich möchte das Grußwort natürlich
 * in allen Sprachen haben". One letter per edition language (Buch.lang), its title is Buch.grussTitel (js/buch.js);
 * "Doc Alvers Mathe-Labor" is never translated,
 * and the red "Fehler melden" button is German in every edition, so the letter names it as it reads.
 * Loaded by js/buch.js on demand; a change here makes every book's page pictures and PDF out of date
 * (tools/buch-seiten/seitenbilder.mjs).
 */
(function () {
    const foto = 'resources/team/alvers_final.png';                     // from the site root
    const name = 'Dr. Michael R. Alvers', zeile = 'Doc Alvers Mathe-Labor · docalvers.de';
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
        },

        // Dutch (package arch3, 08.11.2026, block nl): still the English letter - TODO nl: translate this block only
        // (name the header button as js/buch-nl.js writes it)
        nl: {
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
        },
    };
})();
