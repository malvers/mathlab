/* buch-fotos.js — the photos of the textbooks: one list for every book and every language (loaded by js/buch.js)
 * Doc, 24.10.2026, with the KDP proof in hand: "Wir haben in den Büchern praktisch überhaupt keine Bilder aus der
 * Lebensrealität … Das wünsche ich mir wirklich sehr." 25.10.: one list, so the translations get the photos as well.
 *
 *   fotos:  name → the photo in buch/fotos/<name>.jpg (2000 px on the long side, re-saved without metadata),
 *           who took it, its licence and its page on Wikimedia Commons. Only free licences, never "NC" (the books
 *           are sold through KDP). alt: what it shows, per language (missing languages fall back to German).
 *   books:  book (without -en/-es/-it/-fr) → chapter file → where each photo goes:
 *           at     a selector inside the chapter (ids as in the chapter file, also in the print edition)
 *           put    'after' (a wide photo below the element) or 'in' (floated right at the start of the element)
 *           wide   true: across the whole column, cropped to a banner
 *           w      width of a floated photo in % of its box (default 40); floated photos are cut to 3 : 2
 *           pos    which part of the photo stays in the cut (CSS object-position, default the middle)
 */
window.BUCH_FOTOS = {
    fotos: {
        'wuerfel-spieltisch': { artist: 'Donald Olszewski', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Backgammon_Board,_Close-up.jpg',
            alt: { de: 'Weiße und rote Würfel auf einem grünen Spielbrett', en: 'White and red dice on a green game board' } },
        'gluecksrad-kind': { artist: 'Bernd Schwabe in Hannover', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:2024-04-13_Aufhof_Transplant-Kid_e.V..jpg',
            alt: { de: 'Ein Kind vor einem bunten Glücksrad', en: 'A child in front of a colourful prize wheel' } },
        'fahrraeder-schule': { artist: 'WrS.tm.pl', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Bicycle_parking_at_the_school_and_kindergarten_complex_in_the_village_of_Smardzewice._Gmina_Tomasz%C3%B3w_Mazowiecki,_Tomaszowski_Poviat,_%C5%81%C3%B3d%C5%BA_Voivodeship,_Poland.jpg',
            alt: { de: 'Fahrräder vor einem Schulgebäude', en: 'Bicycles in front of a school building' } },
        'schnelltest': { artist: 'Burkhard Mücke', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Antigen-Schnelltest_1.jpg',
            alt: { de: 'Ein Antigen-Schnelltest', en: 'A rapid antigen test' } },
        'zwei-rote-wuerfel': { artist: 'srgpicker from Spain', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Two_red_dice_(2513762373).jpg',
            alt: { de: 'Zwei rote Würfel', en: 'Two red dice' } },
        'zicklein': { artist: 'Béria Lima de Rodríguez', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Baby_Goat_in_Margarita_Island,_Venezuela.jpg',
            alt: { de: 'Ein junges Zicklein im Profil', en: 'A young goat in profile' } }
    },
    books: {
        mathe11: {
            'lb1.html': [
                { foto: 'wuerfel-spieltisch', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'gluecksrad-kind', at: '#le1 .b-einstieg', put: 'in', w: 32, pos: '50% 28%' },
                { foto: 'fahrraeder-schule', at: '#le2 .b-einstieg', put: 'in', w: 36 },
                { foto: 'schnelltest', at: '#erkundungen .b-erk:last-child > .b-text', put: 'in', w: 40 },     // "Positiv – und trotzdem gesund?"
                { foto: 'zwei-rote-wuerfel', at: '#le3 .b-einstieg', put: 'in', w: 32 },
                { foto: 'zicklein', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ]
        }
    }
};
