/* buch-fotos.js — the photos of the textbooks: one list for every book and every language (loaded by js/buch.js)
 * Doc, 24.10.2026, with the KDP proof in hand: "Wir haben in den Büchern praktisch überhaupt keine Bilder aus der
 * Lebensrealität … Das wünsche ich mir wirklich sehr." 25.10.: one list, so the translations get the photos as well.
 *
 *   fotos:  name → the photo <name>.jpg in Cloudflare R2, bucket "media", folder buch/fotos/ (js/buch.js FOTO_DIR; never in git):
 *           1200 px on the long side for a photo in a box, 2000 px for a banner, JPEG q ~80 re-saved without metadata;
 *           upload with  node tools/media_publish.mjs <file> buch/fotos/<name>.jpg  (it reads the file back);
 *           who took it ('' when unknown - the credit line then names only licence and source), its licence and its page on Wikimedia Commons. Only free licences, never "NC" (the books
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
            alt: { de: 'Fahrräder vor einem Schulgebäude', en: 'Bicycles in front of a school building', es: 'Bicicletas delante de un colegio', it: 'Biciclette davanti a un edificio scolastico', fr: 'Des vélos devant un bâtiment scolaire' } },
        'schnelltest': { artist: 'Burkhard Mücke', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Antigen-Schnelltest_1.jpg',
            alt: { de: 'Ein Antigen-Schnelltest', en: 'A rapid antigen test' } },
        'zwei-rote-wuerfel': { artist: 'srgpicker from Spain', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Two_red_dice_(2513762373).jpg',
            alt: { de: 'Zwei rote Würfel', en: 'Two red dice', es: 'Dos dados rojos', it: 'Due dadi rossi', fr: 'Deux dés rouges' } },
        'zicklein': { artist: 'Béria Lima de Rodríguez', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Baby_Goat_in_Margarita_Island,_Venezuela.jpg',
            alt: { de: 'Ein junges Zicklein im Profil', en: 'A young goat in profile' } },
        // Mathe 11, chapters 2 … (25.10.2026)
        'taxi-koeln': { artist: 'CEphoto, Uwe Aranas', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Cologne_Germany_Taxi-waiting-at-Central_Station-01.jpg',
            alt: { de: 'Taxis in einer Reihe in Köln', en: 'Taxis in a row in Cologne' } },
        'diophantos': { artist: 'Leonid', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Diophantus_VI_338_339.jpg',
            alt: { de: 'Eine aufgeschlagene Ausgabe der „Arithmetica“ des Diophantos', en: 'An open edition of the Arithmetica of Diophantus' } },
        'thermometer': { artist: 'Abraham', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:20250827_thermometer_Panewniki_Franciscan_monastery.jpg',
            alt: { de: 'Ein Thermometer im Garten', en: 'A thermometer in a garden' } },
        'kerze': { artist: 'Donald Olszewski', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Burning_candle_marco.jpg',
            alt: { de: 'Eine brennende rote Kerze', en: 'A burning red candle', fr: 'Une bougie rouge allumée' } },
        'sparglas': { artist: 'stevepb', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Piggy-bank-968302.jpg',
            alt: { de: 'Ein Glas mit Münzen und einem Geldschein', en: 'A jar with coins and a banknote' } },
        'sonnenblume': { artist: 'Anna Benczur', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Fibonacci_spiral.jpg',
            alt: { de: 'Die Kerne einer Sonnenblume in Spiralen', en: 'The seeds of a sunflower in spirals' } },
        'muengstener-bruecke': { artist: 'InterCityImpress', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Solingen_--_M%C3%BCngstener_Br%C3%BCcke_(10403938084).jpg',
            alt: { de: 'Die Müngstener Brücke mit ihrem großen Bogen', en: 'The Müngsten Bridge with its great arch' } },
        'basketball-wurf': { artist: 'Jeff Egnaczyk', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Jason_Kapono_jump_shot_2006.jpg',
            alt: { de: 'Ein Basketball im Flug zum Korb', en: 'A basketball flying towards the hoop' } },
        'galilei-fallrinne': { artist: 'Zde', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Piano_inclinato,_Museo_Galileo,_Florence,_Inv._104,_224108.jpg',
            alt: { de: 'Galileis schiefe Ebene im Museo Galileo in Florenz', en: 'Galileo’s inclined plane in the Museo Galileo, Florence' } },
        'riesenrad-wien': { artist: 'Dietmar Rabich', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Wien,_Prater,_Riesenrad_--_2018_--_3161.jpg',
            alt: { de: 'Das Riesenrad im Wiener Prater', en: 'The giant Ferris wheel in the Vienna Prater' } },
        'stimmgabel-kurven': { artist: 'Klaus-Dieter Keller', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Tuning_fork_on_carbon_black.jpg',
            alt: { de: 'Aufgezeichnete Schwingungen von Stimmgabeln', en: 'Recorded vibrations of tuning forks' } },
        'tee': { artist: 'terri_bateman', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Tea_seemed_especially_steamy_this_morning_(23553842543).jpg',
            alt: { de: 'Eine dampfende Tasse Tee', en: 'A steaming cup of tea' } },
        'rechenschieber': { artist: 'Jacek Halicki', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:2023_Suwak_logarytmiczny_(1).jpg',
            alt: { de: 'Ein Rechenschieber', en: 'A slide rule' } },
        'fliesen': { artist: 'Sisters.seamless', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Grey_worn_speckled_seamless_square_tiled_floor_paving_texture.jpg',
            alt: { de: 'Quadratische Fliesen', en: 'Square tiles' } },
        'achterbahn': { artist: 'Jeremy Thompson', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Loop_Coaster_MOMOnGA_helix_-_Yomiuriland.jpg',
            alt: { de: 'Eine Achterbahn mit Looping', en: 'A roller coaster with a loop' } },
        'kinosaal': { artist: 'Joe Mabel', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Columbia_City_Cinema_main_hall.jpg',
            alt: { de: 'Ein Kinosaal mit roten Sitzen', en: 'A cinema with red seats', es: 'Una sala de cine con butacas rojas', it: 'Una sala cinematografica con poltrone rosse', fr: 'Une salle de cinéma aux fauteuils rouges' } },
        'fachwerkbruecke': { artist: 'Aliva Sahoo', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Steel_Truss_Bridge_at_Sambalpur.jpg',
            alt: { de: 'Eine Fachwerkbrücke aus Stahl', en: 'A steel truss bridge' } },
        'monte-carlo': { artist: 'sam garza from Los Angeles, USA', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Real_Monte_Carlo_Casino.jpg',
            alt: { de: 'Das Casino von Monte Carlo bei Nacht', en: 'The Casino of Monte Carlo at night' } },
        'hotelflur': { artist: 'Adrian Grycuk', license: 'CC BY-SA 3.0 pl', page: 'https://commons.wikimedia.org/wiki/File:Hotel_Grand_w_%C5%81odzi_012.JPG',
            alt: { de: 'Ein langer Hotelflur mit vielen Türen', en: 'A long hotel corridor with many doors' } },
        'wasserbogen': { artist: 'Pacific Southwest Region 5 (US Forest Service)', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:2016_water_fountain_(34210072876).jpg',
            alt: { de: 'Ein Wasserstrahl fliegt im Bogen durch die Luft', en: 'A water jet flying through the air in an arc' } },
        // mathe12 (2026-10-25)
        'schulbus': { artist: 'Simon_sees', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Stuttgart_school_bus_(15363613767).jpg',
            alt: { de: 'Ein Schulbus an der Haltestelle', en: 'A school bus at the stop' } },
        'justitia': { artist: 'Paul Colin Hennig firstdorsal.eu', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Fountain_of_Justice_(Gerechtigkeitsbrunnen)_on_the_Roemerberg,_Frankfurt_(2025).jpg',
            alt: { de: 'Die Justitia auf dem Gerechtigkeitsbrunnen in Frankfurt', en: 'Justitia on the Fountain of Justice in Frankfurt' } },
        'winterpalast': { artist: 'Matthias Süßen', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Winter_Palace-2025-09-msu---2707.jpg',
            alt: { de: 'Der Winterpalast in Sankt Petersburg', en: 'The Winter Palace in Saint Petersburg' } },
        'widerstaende': { artist: 'Evan-Amos', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Electronic-Axial-Lead-Resistors-Array.jpg',
            alt: { de: 'Elektrische Widerstände', en: 'Electrical resistors' } },
        'galtonbrett': { artist: 'Exhibit made by Estes Objethos Atelier, photo by Rodrigo Tetsuo Argenton', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Tabuleiros_de_Galton_(antes_e_depois).jpg',
            alt: { de: 'Zwei Galtonbretter vor und nach dem Durchlauf der Kugeln', en: 'Two Galton boards before and after the balls run through' } },
        'kaffee': { artist: 'Jon-Isac Lindberg', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:White_cup_of_black_coffee.jpg',
            alt: { de: 'Eine Tasse schwarzer Kaffee', en: 'A cup of black coffee' } },
        'schildkroete': { artist: 'Joshua Tree National Park', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Desert_tortoise_walking_in_the_Pinto_Basin_(29803471006).jpg',
            alt: { de: 'Eine Schildkröte', en: 'A tortoise' } },
        'tacho': { artist: 'Anibal Clavel', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:Speedometer_showing_0_km-h_(50376706).jpg',
            alt: { de: 'Ein Tachometer bei Nacht', en: 'A speedometer at night' } },
        'newton': { artist: 'Godfrey Kneller', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Sir_Isaac_Newton,_1689_(head_shot_crop).jpg',
            alt: { de: 'Isaac Newton, Gemälde von Godfrey Kneller (1689)', en: 'Isaac Newton, painted by Godfrey Kneller (1689)' } },
        'euler': { artist: 'Jakob Emanuel Handmann', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Leonhard_Euler_-_Jakob_Emanuel_Handmann_(Kunstmuseum_Basel).jpg',
            alt: { de: 'Leonhard Euler, Gemälde von Jakob Emanuel Handmann (1753)', en: 'Leonhard Euler, painted by Jakob Emanuel Handmann (1753)', fr: 'Leonhard Euler, portrait peint par Jakob Emanuel Handmann (1753)' } },
        'alpenpanorama': { artist: 'Bernie', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:AD2008July01_Oetztal_Alps_main_chain_-_Fineil_ridge_-_panoramic_view_from_north.jpg',
            alt: { de: 'Ein Alpenpanorama mit Gipfeln und Tälern', en: 'An Alpine panorama with peaks and valleys' } },
        'fermat': { artist: 'François de Poilly', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Pierre_de_Fermat_par_Fran%C3%A7ois_de_Poilly.png',
            alt: { de: 'Pierre de Fermat, Kupferstich', en: 'Pierre de Fermat, engraving' } },
        'rad-am-pass': { artist: 'will_cyclist', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Col_de_Champlaurent.jpg',
            alt: { de: 'Ein Fahrrad am Passschild auf dem Berg', en: 'A bicycle at a mountain pass sign' } },
        'karton': { artist: 'HireAHelper', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Open_Cardboard_Moving_Box_(32067347137).jpg',
            alt: { de: 'Ein offener Karton', en: 'An open cardboard box', fr: 'Un carton ouvert' } },
        'dido-karthago': { artist: 'J. M. W. Turner', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Turner_-_Dido.jpg',
            alt: { de: 'William Turner: Dido baut Karthago (1815)', en: 'William Turner: Dido building Carthage (1815)' } },
        'drohne': { artist: 'Josh Sorenson', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Quadcopter_camera_drone_in_flight.jpg',
            alt: { de: 'Eine Drohne im Flug', en: 'A drone in flight' } },
        'rechenzentrum': { artist: 'PiDatacenters', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Racks_Amravati_Data_Center.jpg',
            alt: { de: 'Serverschränke in einem Rechenzentrum', en: 'Server racks in a data centre' } },
        // mathe13 (2026-10-25)
        'leibniz': { artist: 'Christoph Bernhard Francke', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Gottfried_Wilhelm_Leibniz,_Bernhard_Christoph_Francke.jpg',
            alt: { de: 'Gottfried Wilhelm Leibniz, Gemälde von Christoph Bernhard Francke', en: 'Gottfried Wilhelm Leibniz, painted by Christoph Bernhard Francke' } },
        'barrow': { artist: '', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Unknown_man,_formerly_known_as_Isaac_Barrow_from_NPG.jpg',
            alt: { de: 'Isaac Barrow, Newtons Lehrer in Cambridge', en: 'Isaac Barrow, Newton’s teacher at Cambridge' } },
        'feldermosaik': { artist: 'Bhullargraphic', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_agricultural_fields_in_Punjab,_India.jpg',
            alt: { de: 'Felder von oben: ein Mosaik aus Flächen', en: 'Fields from above: a mosaic of areas' } },
        'archimedes-fetti': { artist: 'Dguendel', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Dresden,_Gem%C3%A4ldegalerie_Alte_Meister,_Domenico_Fetti,_Bildnis_eines_Gelehrten.jpg',
            alt: { de: 'Domenico Fetti: Archimedes (1620), Gemäldegalerie Alte Meister Dresden', en: 'Domenico Fetti: Archimedes (1620), Old Masters Picture Gallery, Dresden' } },
        'weinfaesser': { artist: 'Vyacheslav Argenberg', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Yerevan,_Brandy_barrels,_Armenia.jpg',
            alt: { de: 'Weinfässer im Keller', en: 'Wine barrels in a cellar' } },
        'wahlurne': { artist: 'W.carter', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ballot_dropped_into_ballot_box_2024_Swedish_EU_election_at_St%C3%A5ngen%C3%A4sskolan,_Brastad_2.jpg',
            alt: { de: 'Ein Stimmzettel fällt in die Wahlurne', en: 'A ballot paper goes into the ballot box' } },
        'verpackung': { artist: 'dean blackburn', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Ramen_Packets_(2023713571).jpg',
            alt: { de: 'Eine Verpackungsmaschine', en: 'A packaging machine' } },
        'muenzwurf': { artist: 'ICMA Photos', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Coin_Toss_(3635981474).jpg',
            alt: { de: 'Eine Münze wird mit dem Daumen hochgeworfen', en: 'A coin flipped with the thumb', fr: 'Une pièce lancée d’un coup de pouce' } },
        'milchtee': { artist: 'Billjones94', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Indian_Bengali_milk_tea_with_cream_biscuits.jpg',
            alt: { de: 'Eine Tasse Tee mit Milch', en: 'A cup of tea with milk' } },
        'glasfassade': { artist: 'Hands off my tags! Michael Gaida', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Modern_Skyscrapers_(or_Buildings)made_with_glass.jpg',
            alt: { de: 'Eine Glasfassade', en: 'A glass facade' } },
        'descartes': { artist: 'Frans Hals', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Frans_Hals,_Portrait_of_Ren%C3%A9_Descartes.jpg',
            alt: { de: 'René Descartes, Gemälde nach Frans Hals', en: 'René Descartes, after Frans Hals' } },
        'buntstifte': { artist: 'Dietmar Rabich', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Buntstifte_--_2021_--_9151.jpg',
            alt: { de: 'Buntstifte, die Spitzen zur Mitte', en: 'Coloured pencils, tips to the centre' } },
        'raytracing': { artist: 'Morn', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:DBW-Render_glass_scene,_recreated_in_POV-Ray.png',
            alt: { de: 'Ein am Computer berechnetes Bild mit Glaskugeln', en: 'A computer-rendered image with glass spheres' } },
        'louvre-pyramide': { artist: 'Benh LIEU SONG (Flickr)', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Louvre_Museum_Wikimedia_Commons.jpg',
            alt: { de: 'Die Glaspyramide des Louvre in Paris', en: 'The glass pyramid of the Louvre in Paris' } },
        'gizeh': { artist: 'kallerna', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Great_Pyramid_of_Giza.jpg',
            alt: { de: 'Die Cheops-Pyramide in Gizeh', en: 'The Great Pyramid of Giza' } },
        'autofabrik': { artist: 'Marek Ślusarczyk (Tupungato) Photo portfolio', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:001_Car_factory_assembly_line_-_Opel_factory_in_Gliwice,_Poland.jpg',
            alt: { de: 'Ein Fließband in einer Autofabrik', en: 'An assembly line in a car factory' } },
        // mathefos11 (2026-10-25)
        'fahrradhaendler': { artist: 'Tracy Anne Brooks', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:The_Bike_Shop.jpg',
            alt: { de: 'Neue Fahrräder in einer Reihe', en: 'New bicycles in a row' } },
        'fahrschule': { artist: 'WrS.tm.pl', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Training_car_of_one_of_the_driving_schools_in_Tomasz%C3%B3w_Mazowiecki,_Poland.jpg',
            alt: { de: 'Ein Fahrschulauto', en: 'A driving-school car' } },
        'chwarizmi-statue': { artist: 'DierkA', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Muhammad_ibn_Musa_al-Khwarizmi.jpg',
            alt: { de: 'Das Denkmal für al-Chwarizmi', en: 'The monument to al-Khwarizmi' } },
        'kaffeeroesterei': { artist: 'Dietmar Rabich', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Privatr%C3%B6sterei_Schr%C3%B6er,_Kaffeebeh%C3%A4lter_--_2018_--_0529.jpg',
            alt: { de: 'Kaffeebehälter in einer Rösterei', en: 'Coffee bins in a roastery' } },
        'huhn': { artist: 'USDAgov', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:20220520-FPAC-PJK-0247_TONED.jpg',
            alt: { de: 'Ein Huhn', en: 'A hen' } },
        'brennspiegel': { artist: 'Solarbroman', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Parabolic_Solar_Cooker.jpg',
            alt: { de: 'Ein Solarkocher: ein Hohlspiegel bündelt das Sonnenlicht', en: 'A solar cooker: a concave mirror focuses the sunlight' } },
        'cardano': { artist: '', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Hieronimus_Cardanus.jpg',
            alt: { de: 'Gerolamo Cardano, Kupferstich', en: 'Gerolamo Cardano, engraving' } },
        'reisszwecken': { artist: 'Langläufer22', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Rei%C3%9Fzwecken_4_Dtzd_(77).jpg',
            alt: { de: 'Eine Schachtel Reißzwecken', en: 'A box of drawing pins', fr: 'Une boîte de punaises' } },
        'pascal': { artist: '', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Blaise_Pascal_Versailles.JPG',
            alt: { de: 'Blaise Pascal, Gemälde', en: 'Blaise Pascal, painting' } },
        'bingokugeln': { artist: 'elizaIO', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Bingo_balls_in_bingo_drum.jpg',
            alt: { de: 'Nummerierte Kugeln in einer Trommel', en: 'Numbered balls in a drum' } },
        'kantine': { artist: 'RomanM82', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Yangzhou_-_Yangnong_Chemical,_canteen_lunch,_pic01.jpg',
            alt: { de: 'Ein Tablett mit Mittagessen in der Kantine', en: 'A lunch tray in a canteen' } },
        'siegerpodest': { artist: 'Charlyneros', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:2004_African_Championships_in_Athletics_25.jpg',
            alt: { de: 'Siegerehrung auf dem Podest', en: 'Medal ceremony on the podium' } },
        'tartaglia-dreieck': { artist: 'Dixy52', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Pascal_Triangle_14x14.jpg',
            alt: { de: 'Das Zahlendreieck, das in Italien Tartaglias Dreieck heißt', en: 'The number triangle that is called Tartaglia’s triangle in Italy' } },
        'jakob-bernoulli': { artist: 'Niklaus Bernoulli (1662-1716)', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Jakob_Bernoulli.jpg',
            alt: { de: 'Jakob Bernoulli, Gemälde', en: 'Jakob Bernoulli, painting' } },
        'lichtschalter': { artist: 'Santeri Viinamäki', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:White_light_switch.jpg',
            alt: { de: 'Ein Lichtschalter', en: 'A light switch' } },
        'boole': { artist: 'AIP Emilio Segrè Visual Archives', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Boole.jpg',
            alt: { de: 'George Boole, Kupferstich', en: 'George Boole, engraving' } },
        // mathefos12 (2026-10-25)
        'kran': { artist: 'Rubin Observatory/NSF/AURA', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Arrival_of_500_t_Crane_(rubin-500t).tiff',
            alt: { de: 'Ein Kran hebt eine schwere Last', en: 'A crane lifts a heavy load' } },
        'grassmann-ausdehnungslehre': { artist: 'Hermann Grassmann', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Grassmann-1.jpg',
            alt: { de: 'Titelblatt von Hermann Graßmanns „Ausdehnungslehre“ (1844)', en: 'Title page of Hermann Grassmann’s Ausdehnungslehre (1844)' } },
        'laserstrahlen': { artist: 'PANG KA KIT', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:RGB_Laser_Pointers.jpg',
            alt: { de: 'Drei Laserstrahlen in Rot, Grün und Blau', en: 'Three laser beams in red, green and blue' } },
        'kondensstreifen': { artist: 'Nestek', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Aircraft_Contrails_Closeup.jpg',
            alt: { de: 'Ein Flugzeug mit Kondensstreifen', en: 'An aeroplane with a contrail' } },
        'giebeldach': { artist: 'MOs810', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:MOs810_WG_41_2017_(Sulecin,_Osno,_Przewoz)_(Smogory,_house).jpg',
            alt: { de: 'Ein Haus mit Giebeldach', en: 'A house with a gable roof' } },
        'pyrit': { artist: 'Miguel Calvo', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Pyrite_Navajun_Screw_Growth.jpg',
            alt: { de: 'Ein Pyrit-Kristall: Würfelflächen in der Natur', en: 'A pyrite crystal: cube faces in nature' } },
        'solardach': { artist: 'Pujanak', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Solar_panels_on_a_roof.jpg',
            alt: { de: 'Solarmodule auf einem Dach', en: 'Solar panels on a roof' } },
        'gps-satellit': { artist: 'U.S. Air Force', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:GPS_Block_IIIA.jpg',
            alt: { de: 'Ein GPS-Satellit über der Erde', en: 'A GPS satellite above the Earth' } },
        'bienenwaben': { artist: 'Matthew T Rader', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Western_honey_bee_on_a_honeycomb.jpg',
            alt: { de: 'Bienenwaben mit einer Biene', en: 'Honeycomb with a bee', fr: 'Des rayons de ruche avec une abeille' } },
        'wasserhahn': { artist: '247homerescue', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:247_Home_Rescue_sink_tap_plumbing_water_running.jpg',
            alt: { de: 'Wasser fließt aus einem Wasserhahn', en: 'Water running from a tap' } },
        'oetzi': { artist: 'Mannivu', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ricostruzione_di_%C3%96tzi_-_Particolare_del_volto.jpg',
            alt: { de: 'Rekonstruktion von Ötzi im Südtiroler Archäologiemuseum', en: 'Reconstruction of Ötzi in the South Tyrol Museum of Archaeology' } },
        'duerer-zeichner': { artist: 'Rijksmuseum', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Tekenaar_tekent_een_luit,_RP-P-OB-1491.jpg',
            alt: { de: 'Albrecht Dürer: Der Zeichner der Laute (1525)', en: 'Albrecht Dürer: The draughtsman of the lute (1525)' } },
        // mathegy11 (2026-10-25)
        'zahnraeder': { artist: 'W.carter', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Cog_wheel_on_a_huge_crane_claw_-_1.jpg',
            alt: { de: 'Ineinandergreifende Zahnräder', en: 'Meshing gears' } },
        'tabletten': { artist: 'Pöllö', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:Tablets_pills_medicine_medical_waste.jpg',
            alt: { de: 'Tabletten', en: 'Tablets' } },
        'rechenstaebchen': { artist: 'Gary Todd from Xinzheng, China', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Western_Han_Lead_Counting_Rods_(9831915095).jpg',
            alt: { de: 'Chinesische Rechenstäbchen', en: 'Chinese counting rods' } },
        'rutsche': { artist: 'Selbymay', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Tadoussac_-_Playground_slide.jpg',
            alt: { de: 'Eine Rutsche auf dem Spielplatz', en: 'A slide in a playground' } },
        'hamilton-tafel': { artist: 'Brendan Ward', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Broombridge_Hamilton_Plaque.jpg',
            alt: { de: 'Die Gedenktafel für William Rowan Hamilton an der Broom Bridge in Dublin', en: 'The plaque for William Rowan Hamilton on Broom Bridge, Dublin' } },
        'hocker': { artist: '', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Sgabello_a_tre_gambe_MEG_8213.tif',
            alt: { de: 'Ein dreibeiniger Holzhocker', en: 'A three-legged wooden stool' } },
        'keimlinge': { artist: 'Cbarlow', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Maclura_pomifera_fruit_sprouting_seeds.jpg',
            alt: { de: 'Junge Keimlinge', en: 'Young seedlings' } },
        // mathegy12 (2026-10-25)
        'riemann': { artist: 'Smithsonian Institution', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Bernhard_Riemann_(1826-1866),_Mathematician_(2551069295).jpg',
            alt: { de: 'Bernhard Riemann', en: 'Bernhard Riemann' } },
        'gabriels-horn': { artist: 'RokerHRO', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:GabrielHorn.png',
            alt: { de: 'Gabriels Horn: unendlich lang, aber mit endlichem Volumen', en: 'Gabriel’s horn: infinitely long, yet of finite volume' } },
        'broetchen': { artist: 'Jeremy Keith from Brighton & Hove, United Kingdom', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Bread_rolls_(5959546878).jpg',
            alt: { de: 'Brötchen im Korb', en: 'Bread rolls in a basket' } },
        'schlitten': { artist: 'USFWSAlaska', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Traveling_across_Selawik_National_Wildlife_Refuge_with_a_snowmachine_and_basket_sled_(52828118849).jpg',
            alt: { de: 'Ein Holzschlitten im Schnee', en: 'A wooden sledge in the snow' } },
        'spiegel': { artist: 'Acabashi', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Kelvedon_Hall_mirror_in_the_garden_room_Kelvedon_Hatch_Essex_England.jpg',
            alt: { de: 'Ein Spiegel mit Spiegelbild', en: 'A mirror with a reflection', es: 'Un espejo con un reflejo', it: 'Uno specchio con un’immagine riflessa', fr: 'Un miroir et son reflet' } },
        // mathegy11lk (2026-10-25)
        'cauchy': { artist: '', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Augstin_Louis,_Baron_Cauchy._Lithograph_by_Z._Belliard_after_Wellcome_V0001035.jpg',
            alt: { de: 'Augustin-Louis Cauchy, Lithografie', en: 'Augustin-Louis Cauchy, lithograph' } },
        's-kurve': { artist: 'contri from Yonezawa-Shi, Yamagata, Japan', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Winding_road_in_Iide,_Yamagata,_Japan.jpg',
            alt: { de: 'Eine Straße mit S-Kurve', en: 'A road with an S-bend' } },
        'cayley': { artist: 'Engraved by Richard Taylor (1872–1901), drawn by Thomas Dewell Scott, after a ph', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Arthur_Cayley_Engraving.jpg',
            alt: { de: 'Arthur Cayley, Holzstich', en: 'Arthur Cayley, wood engraving' } },
        'rettungsturm': { artist: 'Radomianin', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Lifeguard_stand,_Miami_Beach.jpg',
            alt: { de: 'Ein Rettungsturm am Strand', en: 'A lifeguard tower on the beach' } },
        'bremsspuren': { artist: 'Pete Forsyth', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Tire_skid_marks_on_maritime_road.jpg',
            alt: { de: 'Bremsspuren auf dem Asphalt', en: 'Skid marks on the asphalt' } },
        'schottisches-cafe': { artist: 'Сергій', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:27_Prospekt_Shevchenka,_Lviv.jpg',
            alt: { de: 'Das Haus in Lwiw, in dem das Schottische Café war', en: 'The building in Lviv that housed the Scottish Café' } },
        'radar': { artist: 'Rodhullandemu', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Radar_antenna,_Liverpool_John_Lennon_Airport_3.jpg',
            alt: { de: 'Ein Radarturm am Flughafen', en: 'A radar tower at an airport' } },
        'gesteinsschichten': { artist: 'Simon Burchell', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Rock_strata_near_the_Monastery_of_Santo_Toribio_de_Liebana.jpg',
            alt: { de: 'Gefaltete Gesteinsschichten', en: 'Folded rock strata' } },
        'zahlenschloss': { artist: 'Steven-L-Johnson', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Common_Tokyo_bike_lock_(14271965075).jpg',
            alt: { de: 'Ein Zahlenschloss am Fahrrad', en: 'A combination lock on a bicycle' } },
        'ars-conjectandi': { artist: 'Jakob Bernoulli', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Arsconj.gif',
            alt: { de: 'Titelblatt der „Ars Conjectandi“ von Jakob Bernoulli (1713)', en: 'Title page of Jakob Bernoulli’s Ars Conjectandi (1713)' } },
        // mathegy12lk (2026-10-25)
        'abfuellanlage': { artist: 'Carol M. Highsmith', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Part_of_the_washing_and_bottling_line_at_the_Dublin_Bottling_Works_and_W.P._Kloster_Museum_in_Dublin,_Texas_LCCN2015630792.tif',
            alt: { de: 'Eine Abfüllanlage für Flaschen', en: 'A bottling line' } },
        'museumssaal': { artist: 'Nben54', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Galerie_2.jpg',
            alt: { de: 'Gemälde an der Wand eines Museums', en: 'Paintings on a museum wall' } },
        // mathegy10 (2026-10-25)
        'schachbrett': { artist: 'Paul Lloyd', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Empty_wooden_chessboard.jpg',
            alt: { de: 'Ein leeres Schachbrett aus Holz', en: 'An empty wooden chessboard', fr: 'Un échiquier en bois vide' } },
        'hafen-ebbe': { artist: 'Richard Humphrey', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Fishing_boats_at_low_tide_in_Brancaster_Staithe_harbour_-_geograph.org.uk_-_5176851.jpg',
            alt: { de: 'Fischerboote im Hafen bei Ebbe', en: 'Fishing boats in the harbour at low tide' } },
        'sonnenflecken': { artist: 'Juliebern', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Sunspots_on_June_7_2023.jpg',
            alt: { de: 'Die Sonne mit Sonnenflecken', en: 'The Sun with sunspots' } },
        'vermessungspfeiler': { artist: 'Rude Health', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Vanessa_Trig_Point_-_geograph.org.uk_-_4532080.jpg',
            alt: { de: 'Ein Vermessungspfeiler auf einem Berg', en: 'A triangulation pillar on a mountain' } },
        'kirchturm': { artist: 'Jan-Herm Janßen', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Gross_Leuthen_Dorfkirche_14_-_edited.jpg',
            alt: { de: 'Eine Dorfkirche mit Turm', en: 'A village church with its tower' } },
        'tipi': { artist: 'Jiří Sedláček', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Overview_of_teepee_in_exhibition_S_lili%C3%AD_i_bez_lilie_in_Muzeum_Vyso%C4%8Diny_T%C5%99eb%C3%AD%C4%8D_in_T%C5%99eb%C3%AD%C4%8D,_T%C5%99eb%C3%AD%C4%8D_District.jpg',
            alt: { de: 'Ein Tipi', en: 'A tipi' } },
        'napier-staebe': { artist: 'The wub', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Napier%27s_Bones_circa_1700,_Computer_History_Museum.jpg',
            alt: { de: 'Napiers Rechenstäbe in ihrem Kasten', en: 'Napier’s bones in their box' } },
        'seismograf': { artist: 'Z22', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Seismogram_at_Weston_Observatory.JPG',
            alt: { de: 'Ein Seismograf zeichnet Erschütterungen auf', en: 'A seismograph recording tremors' } },
        'streichhoelzer': { artist: 'Subhrajyoti07', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Closeup_of_match_stick_heads.jpg',
            alt: { de: 'Drei Streichholzköpfe', en: 'Three match heads' } },
        'pacioli': { artist: 'Jacopo de\' Barbari', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Jacopo_de%27_Barbari_(attributed_to)_Portrait_of_Luca_Pacioli_(1445_1517)_with_a_student_(Guidobaldo_da_Montefeltro)_(2).jpg',
            alt: { de: 'Luca Pacioli, Gemälde, Jacopo de’ Barbari zugeschrieben (1495)', en: 'Luca Pacioli, painting attributed to Jacopo de’ Barbari (1495)' } },
        // mathegy5 (2026-10-25)
        'erbsenteller': { artist: 'Kari Söderholm from Kaarina, Finland', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Plate_of_Peas_(4002891340).jpg',
            alt: { de: 'Eine Schale voller Erbsen', en: 'A bowl full of peas', fr: 'Un bol rempli de petits pois' } },
        'gauss': { artist: 'Christian Albrecht Jensen', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Carl_Friedrich_Gauss_1840_by_Jensen.jpg',
            alt: { de: 'Carl Friedrich Gauß, Gemälde von Christian Albrecht Jensen (1840)', en: 'Carl Friedrich Gauss, painted by Christian Albrecht Jensen (1840)', es: 'Carl Friedrich Gauss, retrato de Christian Albrecht Jensen (1840)', it: 'Carl Friedrich Gauss, ritratto di Christian Albrecht Jensen (1840)', fr: 'Carl Friedrich Gauss, tableau de Christian Albrecht Jensen (1840)' } },
        'schokolade': { artist: 'SKopp', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Cooking_chocolate_with_packaging.jpg',
            alt: { de: 'Eine Tafel Schokolade, in Stücke gebrochen', en: 'A chocolate bar broken into pieces', fr: 'Une tablette de chocolat cassée en morceaux' } },
        'stevin-thiende': { artist: '', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:De_Thiende.jpg',
            alt: { de: 'Titelblatt von Simon Stevins „De Thiende“ (1585)', en: 'Title page of Simon Stevin’s De Thiende (1585)', fr: 'Page de titre du « De Thiende » de Simon Stevin (1585)' } },
        'bonbons': { artist: 'gausanchennai', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Colored_sweets.jpg',
            alt: { de: 'Bunte Bonbons', en: 'Colourful sweets', fr: 'Des bonbons de toutes les couleurs' } },
        'murmeln': { artist: 'Conrad 7', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Several_marbles.jpg',
            alt: { de: 'Glasmurmeln', en: 'Glass marbles', fr: 'Des billes en verre' } },
        'stoppuhr': { artist: 'StefanPohl', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Stoppuhr_hanhart.jpg',
            alt: { de: 'Eine Stoppuhr', en: 'A stopwatch', es: 'Un cronómetro', it: 'Un cronometro', fr: 'Un chronomètre' } },
        'klecksbild': { artist: 'Hermann Rorschach', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Inkblot_6.tif',
            alt: { de: 'Ein Klecksbild, das an der Mittellinie gespiegelt ist', en: 'An inkblot mirrored at its centre line', fr: 'Une tache d’encre symétrique par rapport à sa ligne médiane' } },
        'alhambra-fliesen': { artist: 'Ashaio', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Granada-La_Alhambra-02-Palacio_de_Comares-Azulejos-20190419.jpg',
            alt: { de: 'Sternfliesen in der Alhambra in Granada', en: 'Star tiles in the Alhambra, Granada', fr: 'Des carreaux en étoile à l’Alhambra de Grenade' } },
        'fussballfeld': { artist: 'DiarmuidC15', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ferbane_GAA_Pitch.jpg',
            alt: { de: 'Ein Fußballfeld von oben', en: 'A football pitch from above', es: 'Un campo de fútbol visto desde arriba', it: 'Un campo da calcio visto dall’alto', fr: 'Un terrain de football vu d’en haut' } },
        'mars-climate-orbiter': { artist: 'NASA/JPL', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Mars_Climate_Orbiter_-_artist_depiction_-_climate-orbiter-browse.jpg',
            alt: { de: 'Der Mars Climate Orbiter (Zeichnung der NASA)', en: 'The Mars Climate Orbiter (NASA drawing)', fr: 'Le Mars Climate Orbiter (dessin de la NASA)' } },
        'roemische-uhr': { artist: 'Ales Krivec aleskrivec', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Roman_numerals_on_alarm_clock_(Unsplash).jpg',
            alt: { de: 'Ein Wecker mit römischen Ziffern', en: 'An alarm clock with Roman numerals', es: 'Un despertador con números romanos', it: 'Una sveglia con numeri romani', fr: 'Un réveil à chiffres romains' } },
        'maya-codex': { artist: '', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Dresden_Codex_f8461796.png',
            alt: { de: 'Eine Seite des Dresdner Maya-Codex', en: 'A page of the Dresden Maya Codex', fr: 'Une page du codex maya de Dresde' } },
        // mathegy6 (2026-10-25)
        'pizza': { artist: 'Afshin Darian', license: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:White_slice_and_supreme_slice.jpg',
            alt: { de: 'Pizzastücke im Karton', en: 'Pizza slices in a box', es: 'Trozos de pizza en la caja', it: 'Fette di pizza nel cartone', fr: 'Des parts de pizza dans leur carton' } },
        'taschenrechner': { artist: 'LoMit', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Citizen_SLD-100NR_calculator.jpg',
            alt: { de: 'Ein Taschenrechner', en: 'A pocket calculator', fr: 'Une calculatrice de poche' } },
        'kamele': { artist: 'Bernard Gagnon', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Camels_in_Gobi_Desert_02.jpg',
            alt: { de: 'Kamele in der Wüste', en: 'Camels in the desert', fr: 'Des chameaux dans le désert' } },
        'aepfel': { artist: 'USDAgov', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Farmers_Markets_(20141109-OC-LSC-0011).jpg',
            alt: { de: 'Äpfel in einer Kiste auf dem Markt', en: 'Apples in a crate at the market', fr: 'Des pommes dans une caisse au marché' } },
        'kuchen': { artist: 'Daria YakovlevaMinor edits made by Subsidiary account', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Piece_of_chocolate_cake_on_a_white_plate_decorated_with_chocolate_sauce.jpg',
            alt: { de: 'Ein Stück Kuchen', en: 'A piece of cake', es: 'Un trozo de tarta', it: 'Una fetta di torta', fr: 'Une part de gâteau' } },
        'blue-marble': { artist: 'NASA/Apollo 17 crew; taken by either Harrison Schmitt or Ron Evans', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg',
            alt: { de: 'Die Erde, fotografiert von Apollo 17 (1972)', en: 'The Earth photographed from Apollo 17 (1972)', fr: 'La Terre photographiée depuis Apollo 17 (1972)' } },
        'euklid-papyrus': { artist: 'University of Pennsylvania Museum of Archaeology and Anthropology', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:P.Penn._Museum_inv._E02748_Euclid%27s_Elements_2.5.jpg',
            alt: { de: 'Ein Papyrus mit einem Stück aus Euklids „Elementen“', en: 'A papyrus with a fragment of Euclid’s Elements', fr: 'Un papyrus avec un fragment des « Éléments » d’Euclide' } },
        'playfair-torte': { artist: 'William Playfair', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Playfair_piecharts.jpg',
            alt: { de: 'William Playfairs Tortendiagramme (1801)', en: 'William Playfair’s pie charts (1801)', fr: 'Les diagrammes circulaires de William Playfair (1801)' } },
        // mathe5 (2026-10-25)
        'dresden-elbe': { artist: 'Guido Radig', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:Dresden_-_Panorama_an_der_Elbe.JPG',
            alt: { de: 'Die Dresdner Altstadt an der Elbe', en: 'Dresden’s old town on the Elbe', es: 'El casco antiguo de Dresde a orillas del Elba', it: 'Il centro storico di Dresda sull’Elba', fr: 'La vieille ville de Dresde au bord de l’Elbe' } },
        'gummibaerchen': { artist: 'Jochen Spieker from Germany', license: 'CC BY-SA 2.0', page: 'https://commons.wikimedia.org/wiki/File:Gummy_Bears_(51279658803).jpg',
            alt: { de: 'Drei Gummibärchen', en: 'Three gummy bears', es: 'Tres ositos de goma', it: 'Tre orsetti gommosi', fr: 'Trois oursons en gélatine' } },
        'zikade': { artist: 'G. Edward Johnson', license: 'CC BY 4.0', page: 'https://commons.wikimedia.org/wiki/File:Cicada_with_extensive_abdomen_fungus_2021-05-31_093621_1_crop.jpg',
            alt: { de: 'Eine Periodische Zikade', en: 'A periodical cicada', es: 'Una cigarra periódica', it: 'Una cicala periodica', fr: 'Une cigale périodique' } },
        'weitsprung': { artist: 'Sgt. Barry St. Clair', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:U.S._Army_Spc._Darius_Pittman,_with_the_1st_Armored_Division,_lands_in_a_long_jump_sand_pit_during_the_German_armed_forces_military_proficiency_badge_competition_at_Fort_Bliss,_Texas,_Sept_120904-A-UK859-006.jpg',
            alt: { de: 'Landung in der Weitsprunggrube', en: 'Landing in the long-jump pit', es: 'Caída en el foso de salto de longitud', it: 'Atterraggio nella buca del salto in lungo', fr: 'Réception dans la fosse de saut en longueur' } },
        'elle': { artist: 'Dietmar Rabich', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Wien,_Stephansdom,_Elle_--_2018_--_3297.jpg',
            alt: { de: 'Eine eiserne Elle an der Mauer des Wiener Stephansdoms', en: 'An iron ell on the wall of St Stephen’s Cathedral, Vienna', es: 'Una vara de hierro en el muro de la catedral de San Esteban de Viena', it: 'Un braccio di ferro (antica misura di lunghezza) sul muro del duomo di Santo Stefano a Vienna', fr: 'Une aune en fer sur le mur de la cathédrale Saint-Étienne de Vienne' } },
        'geodreieck': { artist: 'Kmtextor', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Geodreieck_klar_gross.jpg',
            alt: { de: 'Ein Geodreieck', en: 'A set square with protractor (Geodreieck)', es: 'Una escuadra con transportador (Geodreieck)', it: 'Una squadra goniometrica (Geodreieck)', fr: 'Une équerre-rapporteur transparente (Geodreieck)' } },
        'wuerfelzucker': { artist: 'Dietmar Rabich', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:W%C3%BCrfelzucker_--_2018_--_3582.jpg',
            alt: { de: 'Würfelzucker', en: 'Sugar cubes', es: 'Terrones de azúcar', it: 'Zollette di zucchero', fr: 'Des morceaux de sucre' } },
        'kerbholz': { artist: '', license: 'CC BY 3.0', page: 'https://commons.wikimedia.org/wiki/File:SAM_PC_1_-_Tally_sticks_1_-_Item_01.jpg',
            alt: { de: 'Kerbhölzer', en: 'Tally sticks', es: 'Palos de tarja', it: 'Bastoni a tacche', fr: 'Des bâtons à encoches (tailles)' } },
        'keilschrift': { artist: '', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Cuneiform_Akkadian_clay_tablet_2.jpg',
            alt: { de: 'Eine Tontafel mit Keilschrift', en: 'A clay tablet with cuneiform writing', es: 'Una tablilla de arcilla con escritura cuneiforme', it: 'Una tavoletta d’argilla con scrittura cuneiforme', fr: 'Une tablette d’argile couverte d’écriture cunéiforme' } },
        'ries-rechenbuch': { artist: 'Adam Ries', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:De_Adam_Risen_Rechbuch_035.jpg',
            alt: { de: 'Eine Seite aus dem Rechenbuch von Adam Ries', en: 'A page of Adam Ries’ arithmetic book', es: 'Una página del libro de cálculo de Adam Ries', it: 'Una pagina del libro di aritmetica di Adam Ries', fr: 'Une page du livre de calcul d’Adam Ries' } },
        'ishango': { artist: 'JhowieNitnek', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Ishango_bone.jpg',
            alt: { de: 'Der Knochen von Ishango', en: 'The Ishango bone', es: 'El hueso de Ishango', it: 'L’osso di Ishango', fr: 'L’os d’Ishango' } },
        // mathegy7 (2026-10-27)
        'marktbrunnen': { artist: 'Funke', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Aigen-Schl%C3%A4gl_Marktplatz_Marktbrunnen_01.jpg',
            alt: { de: 'Ein Brunnen mitten auf einem Platz zwischen Häusern', en: 'A fountain in the middle of a square between houses', es: 'Una fuente en medio de una plaza entre casas', it: 'Una fontana in mezzo a una piazza tra le case', fr: 'Une fontaine au milieu d’une place entre des maisons' } },
        'milet-theater': { artist: 'Bernard Gagnon', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Miletus_-_Ancient_Greek_theatre_02.jpg',
            alt: { de: 'Das antike Theater von Milet', en: 'The ancient theatre of Miletus', es: 'El teatro antiguo de Mileto', it: 'Il teatro antico di Mileto', fr: 'Le théâtre antique de Milet' } },
        'ybc-7289': { artist: 'A. Urcia, Yale Peabody Museum', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:YBC-7289-OBV-labeled.jpg',
            alt: { de: 'Die Tontafel YBC 7289 mit einem Näherungswert für die Wurzel aus 2', en: 'The clay tablet YBC 7289 with an approximation of the square root of 2', es: 'La tablilla de arcilla YBC 7289 con una aproximación de la raíz cuadrada de 2', it: 'La tavoletta d’argilla YBC 7289 con un’approssimazione della radice quadrata di 2', fr: 'La tablette d’argile YBC 7289 avec une valeur approchée de la racine carrée de 2' } },
        'balkenwaage': { artist: 'W.carter', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Modern_collapsible_balance_scale_for_jewellers_2.jpg',
            alt: { de: 'Eine Balkenwaage mit Gewichten', en: 'A balance scale with weights', es: 'Una balanza de platillos con pesas', it: 'Una bilancia a due piatti con i pesi', fr: 'Une balance à plateaux avec des poids' } },
        'schlussverkauf': { artist: 'LIU', license: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:C%26ADRE.JPG',
            alt: { de: 'Ein Schaufenster im Schlussverkauf mit Prozentzeichen', en: 'A shop window during the sales with a percent sign', es: 'Un escaparate en rebajas con el signo de porcentaje', it: 'Una vetrina con i saldi e il segno di percentuale', fr: 'Une vitrine pendant les soldes avec le signe pour cent' } },
        'monge': { artist: 'André Dutertre', license: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Portrait_de_Gaspard_Monge,_G.20828-116.jpg',
            alt: { de: 'Bildnis von Gaspard Monge', en: 'Portrait of Gaspard Monge', es: 'Retrato de Gaspard Monge', it: 'Ritratto di Gaspard Monge', fr: 'Portrait de Gaspard Monge' } },
        'moskauer-papyrus': { artist: 'Bakha (d\'après Vasily Vasilievich Struve)', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Papyrus-Moscou-10.jpg',
            alt: { de: 'Eine Aufgabe des Moskauer Papyrus mit Umschrift in Hieroglyphen', en: 'A problem of the Moscow Papyrus with a transcription in hieroglyphs', es: 'Un problema del papiro de Moscú con su transcripción en jeroglíficos', it: 'Un problema del papiro di Mosca con la trascrizione in geroglifici', fr: 'Un problème du papyrus de Moscou avec sa transcription en hiéroglyphes' } },
        'platonische-modelle': { artist: 'Prateek Karandikar', license: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Models_of_four_platonic_solids.JPG',
            alt: { de: 'Modelle platonischer Körper aus Stäben und Kugeln', en: 'Models of Platonic solids made of rods and balls', es: 'Modelos de sólidos platónicos hechos de varillas y bolas', it: 'Modelli di solidi platonici fatti di bastoncini e sfere', fr: 'Des modèles de solides de Platon en tiges et en boules' } },
        'kepler-mysterium': { artist: 'Johannes Kepler', license: 'public domain', page: 'https://commons.wikimedia.org/wiki/File:Kepler_Platonic_Solids.tif',
            alt: { de: 'Keplers Modell des Sonnensystems aus dem Mysterium Cosmographicum (1596)', en: 'Kepler’s model of the solar system from the Mysterium Cosmographicum (1596)', es: 'El modelo del sistema solar de Kepler del Mysterium Cosmographicum (1596)', it: 'Il modello del sistema solare di Keplero dal Mysterium Cosmographicum (1596)', fr: 'Le modèle du système solaire de Kepler tiré du Mysterium Cosmographicum (1596)' } }
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
            ],
            'lb2.html': [
                { foto: 'taxi-koeln', at: '#le1 .b-einstieg', put: 'in', w: 28, pos: '50% 62%' },
                { foto: 'diophantos', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb3-1.html': [
                { foto: 'thermometer', at: '#le1 .b-einstieg', put: 'in', w: 26, pos: '50% 40%' }
            ],
            'lb3-2.html': [
                { foto: 'kerze', at: '#le1 .b-einstieg', put: 'in', w: 28, pos: '50% 45%' },
                { foto: 'sparglas', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'sonnenblume', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb3-3.html': [
                { foto: 'muengstener-bruecke', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'basketball-wurf', at: '#le3 .b-einstieg', put: 'in', w: 34 },
                { foto: 'galilei-fallrinne', at: '#exkursion .b-row > .b-text', put: 'in', w: 38 },
                // the chapter ended with three link cards and a white half page (KDP proof p. 54, Doc: "Foto, klar!")
                { foto: 'wasserbogen', at: '#test > .b-labs', put: 'after', wide: true }
            ],
            'lb3-4.html': [
                { foto: 'riesenrad-wien', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'stimmgabel-kurven', at: '#exkursion .b-row > .b-text', put: 'in', w: 38 }
            ],
            'lb3-5.html': [
                { foto: 'tee', at: '#le2 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb3-6.html': [
                { foto: 'rechenschieber', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'fliesen', at: '#le1 .b-einstieg', put: 'in', w: 26 }
            ],
            'lb3-7.html': [
                { foto: 'achterbahn', at: '#auftakt .b-hero', put: 'after', wide: true }
            ],
            'lb4.html': [
                { foto: 'kinosaal', at: '#le1 .b-einstieg', put: 'in', w: 34 },
                { foto: 'fachwerkbruecke', at: '#le4 .b-einstieg', put: 'in', w: 34 }
            ],
            'wb3.html': [
                { foto: 'monte-carlo', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'hotelflur', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ]
        },
        mathe12: {
            'lb1-1.html': [
                { foto: 'schulbus', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'justitia', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 18%' }
            ],
            'lb1-2.html': [
                { foto: 'gluecksrad-kind', at: '#le2 .b-einstieg', put: 'in', w: 32, pos: '50% 28%' },
                { foto: 'winterpalast', at: '#exkursion .b-row > .b-text', put: 'in', w: 38 }
            ],
            'lb1-3.html': [
                { foto: 'widerstaende', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'galtonbrett', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb2-1.html': [
                { foto: 'kaffee', at: '#le1 .b-einstieg', put: 'in', w: 26 },
                { foto: 'schildkroete', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb2-2.html': [
                { foto: 'tacho', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'newton', at: '#exkursion .b-row > .b-text', put: 'in', w: 32, pos: '50% 30%' }
            ],
            'lb2-3.html': [
                { foto: 'euler', at: '#exkursion .b-row > .b-text', put: 'in', w: 30, pos: '50% 25%' }
            ],
            'lb2-4.html': [
                { foto: 'alpenpanorama', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'fermat', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 22%' }
            ],
            'lb2-5.html': [
                { foto: 'rad-am-pass', at: '#le3 .b-einstieg', put: 'in', w: 34 }
            ],
            'lb2-6.html': [
                { foto: 'karton', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'dido-karthago', at: '#exkursion .b-row > .b-text', put: 'in', w: 38 }
            ],
            'lb5-1.html': [
                { foto: 'drohne', at: '#le2 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb5-2.html': [
                { foto: 'rechenzentrum', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ]
        },
        mathe13: {
            'lb3-1.html': [
                { foto: 'leibniz', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 25%' }
            ],
            'lb3-2.html': [
                { foto: 'tacho', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'barrow', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 30%' }
            ],
            'lb3-3.html': [
                { foto: 'feldermosaik', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'archimedes-fetti', at: '#exkursion .b-row > .b-text', put: 'in', w: 30, pos: '50% 30%' }
            ],
            'lb3-4.html': [
                { foto: 'thermometer', at: '#le2 .b-einstieg', put: 'in', w: 26, pos: '50% 40%' },
                { foto: 'weinfaesser', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb4-1.html': [
                { foto: 'wahlurne', at: '#le1 .b-einstieg', put: 'in', w: 34 },
                { foto: 'verpackung', at: '#le2 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb4-2.html': [
                { foto: 'muenzwurf', at: '#le1 .b-einstieg', put: 'in', w: 26, pos: '50% 30%' },
                { foto: 'zwei-rote-wuerfel', at: '#le2 .b-einstieg', put: 'in', w: 28 },
                { foto: 'milchtee', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'wp1-1.html': [
                { foto: 'drohne', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'glasfassade', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'descartes', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 25%' }
            ],
            'wp1-2.html': [
                { foto: 'buntstifte', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'raytracing', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'wp1-3.html': [
                { foto: 'louvre-pyramide', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'gizeh', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb6.html': [
                { foto: 'autofabrik', at: '#le4 .b-einstieg', put: 'in', w: 34 }
            ]
        },
        mathefos11: {
            'lb1-1.html': [
                { foto: 'fahrradhaendler', at: '#le3 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb1-2.html': [
                { foto: 'kerze', at: '#le1 .b-einstieg', put: 'in', w: 28, pos: '50% 45%' }
            ],
            'lb1-3.html': [
                { foto: 'fahrschule', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'chwarizmi-statue', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb1-4.html': [
                { foto: 'kinosaal', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'kaffeeroesterei', at: '#le3 .b-einstieg', put: 'in', w: 32 },
                { foto: 'huhn', at: '#exkursion .b-row > .b-text', put: 'in', w: 30 }
            ],
            'lb1-5.html': [
                { foto: 'brennspiegel', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb1-6.html': [
                { foto: 'wasserbogen', at: '#le1 .b-einstieg', put: 'in', w: 36 }
            ],
            'lb1-7.html': [
                { foto: 'karton', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'cardano', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 30%' }
            ],
            'lb2-1.html': [
                { foto: 'wuerfel-spieltisch', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'zwei-rote-wuerfel', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'reisszwecken', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'pascal', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 25%' }
            ],
            'lb2-2.html': [
                { foto: 'bingokugeln', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'zicklein', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb2-3.html': [
                { foto: 'kantine', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'siegerpodest', at: '#le2 .b-einstieg', put: 'in', w: 34 },
                { foto: 'tartaglia-dreieck', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'wb2.html': [
                { foto: 'sparglas', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'jakob-bernoulli', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 22%' }
            ],
            'exkurse.html': [
                { foto: 'lichtschalter', at: '#le2 .b-einstieg', put: 'in', w: 24 },
                { foto: 'boole', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ]
        },
        mathefos12: {
            'lb1-1.html': [
                { foto: 'drohne', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'kran', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'grassmann-ausdehnungslehre', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 30%' }
            ],
            'lb1-2.html': [
                { foto: 'laserstrahlen', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'kondensstreifen', at: '#le2 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb1-3.html': [
                { foto: 'giebeldach', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'pyrit', at: '#exkursion .b-row > .b-text', put: 'in', w: 28 }
            ],
            'lb1-4.html': [
                { foto: 'solardach', at: '#le2 .b-einstieg', put: 'in', w: 34 },
                { foto: 'gps-satellit', at: '#exkursion .b-row > .b-text', put: 'in', w: 30 }
            ],
            'lb2-1.html': [
                { foto: 'schildkroete', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb2-2.html': [
                { foto: 'leibniz', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 25%' }
            ],
            'lb2-3.html': [
                { foto: 'alpenpanorama', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'rad-am-pass', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'fermat', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 22%' }
            ],
            'lb2-4.html': [
                { foto: 'muengstener-bruecke', at: '#le2 .b-einstieg', put: 'in', w: 34 },
                { foto: 'karton', at: '#le3 .b-einstieg', put: 'in', w: 30 },
                { foto: 'bienenwaben', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb3.html': [
                { foto: 'feldermosaik', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'wasserhahn', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'archimedes-fetti', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 30%' }
            ],
            'lb4-2.html': [
                { foto: 'kaffee', at: '#le3 .b-einstieg', put: 'in', w: 26 },
                { foto: 'oetzi', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 22%' }
            ],
            'wb3.html': [
                { foto: 'widerstaende', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'kerze', at: '#le3 .b-einstieg', put: 'in', w: 26, pos: '50% 45%' },
                { foto: 'duerer-zeichner', at: '#exkursion .b-row > .b-text', put: 'in', w: 38 }
            ]
        },
        mathegy11: {
            'lb1-1.html': [
                { foto: 'tee', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'schildkroete', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb1-2.html': [
                { foto: 'newton', at: '#exkursion .b-row > .b-text', put: 'in', w: 30, pos: '50% 30%' }
            ],
            'lb1-3.html': [
                { foto: 'zahnraeder', at: '#le3 .b-einstieg', put: 'in', w: 30 }
            ],
            'lb1-4.html': [
                { foto: 'alpenpanorama', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'tabletten', at: '#le3 .b-einstieg', put: 'in', w: 30 },
                { foto: 'fermat', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 22%' }
            ],
            'lb2.html': [
                { foto: 'rechenstaebchen', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb1-5.html': [
                { foto: 'rutsche', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'karton', at: '#le2 .b-einstieg', put: 'in', w: 30 }
            ],
            'lb3-1.html': [
                { foto: 'kondensstreifen', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'hamilton-tafel', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb3-2.html': [
                { foto: 'buntstifte', at: '#le2 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb3-3.html': [
                { foto: 'hocker', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'raytracing', at: '#exkursion .b-row > .b-text', put: 'in', w: 36 }
            ],
            'lb4-1.html': [
                { foto: 'bingokugeln', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'zwei-rote-wuerfel', at: '#exkursion .b-row > .b-text', put: 'in', w: 28 }
            ],
            'lb4-2.html': [
                { foto: 'keimlinge', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'jakob-bernoulli', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 22%' }
            ]
        },
        mathegy12: {
            'lb5-1.html': [
                { foto: 'leibniz', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 25%' }
            ],
            'lb5-2.html': [
                { foto: 'wasserhahn', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'riemann', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb5-3.html': [
                { foto: 'feldermosaik', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'gabriels-horn', at: '#exkursion .b-row > .b-text', put: 'in', w: 38, pos: '8% 50%' }
            ],
            'wb5.html': [
                { foto: 'weinfaesser', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb6.html': [
                { foto: 'wahlurne', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'broetchen', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'muenzwurf', at: '#le3 .b-einstieg', put: 'in', w: 26, pos: '50% 30%' },
                { foto: 'milchtee', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb7-1.html': [
                { foto: 'schlitten', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'hamilton-tafel', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb7-2.html': [
                { foto: 'giebeldach', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'gizeh', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb7-3.html': [
                { foto: 'gps-satellit', at: '#exkursion .b-row > .b-text', put: 'in', w: 30 }
            ],
            'lb8-1.html': [
                { foto: 'spiegel', at: '#le2 .b-einstieg', put: 'in', w: 26 }
            ],
            'abi.html': [
                { foto: 'zicklein', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ]
        },
        mathegy11lk: {
            'lb1-1.html': [
                { foto: 'tee', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'taxi-koeln', at: '#le3 .b-einstieg', put: 'in', w: 26, pos: '50% 62%' },
                { foto: 'cauchy', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb1-2.html': [
                { foto: 'leibniz', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 25%' }
            ],
            'lb1-3.html': [
                { foto: 'euler', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb1-4.html': [
                { foto: 'alpenpanorama', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 's-kurve', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'weinfaesser', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb2.html': [
                { foto: 'cayley', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 30%' }
            ],
            'lb1-5.html': [
                { foto: 'rettungsturm', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'bremsspuren', at: '#le3 .b-einstieg', put: 'in', w: 30 }
            ],
            'wb2.html': [
                { foto: 'schottisches-cafe', at: '#exkursion .b-row > .b-text', put: 'in', w: 30 }
            ],
            'lb3-1.html': [
                { foto: 'radar', at: '#le2 .b-einstieg', put: 'in', w: 30 }
            ],
            'lb3-2.html': [
                { foto: 'kondensstreifen', at: '#le3 .b-einstieg', put: 'in', w: 30 },
                { foto: 'buntstifte', at: '#le4 .b-einstieg', put: 'in', w: 30 },
                { foto: 'grassmann-ausdehnungslehre', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 30%' }
            ],
            'lb3-3.html': [
                { foto: 'hocker', at: '#le1 .b-einstieg', put: 'in', w: 26 },
                { foto: 'giebeldach', at: '#le4 .b-einstieg', put: 'in', w: 30 },
                { foto: 'gesteinsschichten', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb4-1.html': [
                { foto: 'bingokugeln', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'zahlenschloss', at: '#le3 .b-einstieg', put: 'in', w: 28 },
                { foto: 'pascal', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb4-2.html': [
                { foto: 'schulbus', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'schnelltest', at: '#le2 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb4-3.html': [
                { foto: 'galtonbrett', at: '#le3 .b-einstieg', put: 'in', w: 30 },
                { foto: 'ars-conjectandi', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 20%' }
            ]
        },
        mathegy12lk: {
            'lb5-1.html': [
                { foto: 'leibniz', at: '#exkursion .b-row > .b-text', put: 'in', w: 28, pos: '50% 25%' }
            ],
            'lb5-2.html': [
                { foto: 'wasserhahn', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'riemann', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb5-3.html': [
                { foto: 'feldermosaik', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'gabriels-horn', at: '#exkursion .b-row > .b-text', put: 'in', w: 38, pos: '8% 50%' }
            ],
            'wb5.html': [
                { foto: 'weinfaesser', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb6.html': [
                { foto: 'abfuellanlage', at: '#le2 .b-einstieg', put: 'in', w: 32 }
            ],
            'lb7.html': [
                { foto: 'wahlurne', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'broetchen', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'muenzwurf', at: '#le3 .b-einstieg', put: 'in', w: 26, pos: '50% 30%' },
                { foto: 'milchtee', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb8-1.html': [
                { foto: 'schlitten', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'hamilton-tafel', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb8-2.html': [
                { foto: 'giebeldach', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'gizeh', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb8-3.html': [
                { foto: 'kondensstreifen', at: '#le3 .b-einstieg', put: 'in', w: 30 },
                { foto: 'gps-satellit', at: '#exkursion .b-row > .b-text', put: 'in', w: 30 }
            ],
            'lb9-1.html': [
                { foto: 'spiegel', at: '#le2 .b-einstieg', put: 'in', w: 26 },
                { foto: 'museumssaal', at: '#le3 .b-einstieg', put: 'in', w: 32 }
            ],
            'abi.html': [
                { foto: 'zicklein', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ]
        },
        mathegy10: {
            'lb1-1.html': [
                { foto: 'schachbrett', at: '#le2 .b-einstieg', put: 'in', w: 28 },
                { foto: 'tee', at: '#le3 .b-einstieg', put: 'in', w: 28 }
            ],
            'lb1-2.html': [
                { foto: 'riesenrad-wien', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'hafen-ebbe', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'sonnenflecken', at: '#exkursion .b-row > .b-text', put: 'in', w: 28 }
            ],
            'lb2-1.html': [
                { foto: 'zwei-rote-wuerfel', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'pascal', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb2-2.html': [
                { foto: 'wuerfel-spieltisch', at: '#le3 .b-einstieg', put: 'in', w: 32 },
                { foto: 'winterpalast', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb3-1.html': [
                { foto: 'vermessungspfeiler', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb3-2.html': [
                { foto: 'kirchturm', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'tipi', at: '#le2 .b-einstieg', put: 'in', w: 26, pos: '50% 40%' },
                { foto: 'gizeh', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb4-1.html': [
                { foto: 'thermometer', at: '#le1 .b-einstieg', put: 'in', w: 26, pos: '50% 40%' },
                { foto: 'napier-staebe', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb4-2.html': [
                { foto: 'sparglas', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'seismograf', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb4-4.html': [
                { foto: 'euler', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb4-5.html': [
                { foto: 'streichhoelzer', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'schildkroete', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb5.html': [
                { foto: 'pacioli', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'wb.html': [
                { foto: 'cardano', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 30%' }
            ]
        },
        mathegy5: {
            'lb1-1.html': [
                { foto: 'erbsenteller', at: '#le3 .b-einstieg', put: 'in', w: 28 }
            ],
            'lb1-2.html': [
                { foto: 'schachbrett', at: '#le2 .b-einstieg', put: 'in', w: 28 },
                { foto: 'gauss', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb2-1.html': [
                { foto: 'schokolade', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'fahrraeder-schule', at: '#le3 .b-einstieg', put: 'in', w: 30 }
            ],
            'lb2-2.html': [
                { foto: 'stevin-thiende', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 20%' }
            ],
            'lb2-3.html': [
                { foto: 'bonbons', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'murmeln', at: '#le3 .b-einstieg', put: 'in', w: 28 },
                { foto: 'stoppuhr', at: '#exkursion .b-row > .b-text', put: 'in', w: 26 }
            ],
            'lb3-2.html': [
                { foto: 'klecksbild', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'alhambra-fliesen', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb4-1.html': [
                { foto: 'fussballfeld', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb4-2.html': [
                { foto: 'karton', at: '#le1 .b-einstieg', put: 'in', w: 28 }
            ],
            'lb5.html': [
                { foto: 'mars-climate-orbiter', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'wb.html': [
                { foto: 'roemische-uhr', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'maya-codex', at: '#exkursion .b-row > .b-text', put: 'in', w: 38 }
            ]
        },
        mathegy6: {
            'lb1-1.html': [
                { foto: 'pizza', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'taschenrechner', at: '#le2 .b-einstieg', put: 'in', w: 24 }
            ],
            'lb1-2.html': [
                { foto: 'stevin-thiende', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 20%' }
            ],
            'lb1-3.html': [
                { foto: 'kamele', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb2-1.html': [
                { foto: 'kerze', at: '#le2 .b-einstieg', put: 'in', w: 26, pos: '50% 45%' },
                { foto: 'reisszwecken', at: '#le3 .b-einstieg', put: 'in', w: 28 },
                { foto: 'muenzwurf', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 30%' }
            ],
            'lb2-2.html': [
                { foto: 'aepfel', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'kuchen', at: '#le2 .b-einstieg', put: 'in', w: 28 },
                { foto: 'blue-marble', at: '#exkursion .b-row > .b-text', put: 'in', w: 28 }
            ],
            'lb3-1.html': [
                { foto: 'euklid-papyrus', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb3-2.html': [
                { foto: 'euler', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb4.html': [
                { foto: 'bienenwaben', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb5.html': [
                { foto: 'fahrraeder-schule', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'playfair-torte', at: '#exkursion .b-row > .b-text', put: 'in', w: 38 }
            ]
        },
        mathe5: {
            'lb1-1.html': [
                { foto: 'dresden-elbe', at: '#auftakt .b-hero', put: 'after', wide: true },
                { foto: 'fussballfeld', at: '#le1 .b-einstieg', put: 'in', w: 30 }
            ],
            'lb1-2.html': [
                { foto: 'kinosaal', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'gummibaerchen', at: '#le3 .b-einstieg', put: 'in', w: 30 },
                { foto: 'gauss', at: '#exkursion .b-row > .b-text', put: 'in', w: 26, pos: '50% 25%' }
            ],
            'lb1-3.html': [
                { foto: 'zikade', at: '#exkursion .b-row > .b-text', put: 'in', w: 30 }
            ],
            'lb2-1.html': [
                { foto: 'pizza', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'fahrraeder-schule', at: '#le3 .b-einstieg', put: 'in', w: 30 }
            ],
            'lb2-2.html': [
                { foto: 'weitsprung', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'stoppuhr', at: '#exkursion .b-row > .b-text', put: 'in', w: 26 }
            ],
            'lb2-3.html': [
                { foto: 'kuchen', at: '#le3 .b-einstieg', put: 'in', w: 28 },
                { foto: 'elle', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb3-1.html': [
                { foto: 'geodreieck', at: '#exkursion .b-row > .b-text', put: 'in', w: 34 }
            ],
            'lb3-2.html': [
                { foto: 'zwei-rote-wuerfel', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'wuerfelzucker', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb4.html': [
                { foto: 'spiegel', at: '#le2 .b-einstieg', put: 'in', w: 26 }
            ],
            'wb.html': [
                { foto: 'kerbholz', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'keilschrift', at: '#le2 .b-einstieg', put: 'in', w: 28 },
                { foto: 'roemische-uhr', at: '#le3 .b-einstieg', put: 'in', w: 28 },
                { foto: 'ries-rechenbuch', at: '#le4 .b-einstieg', put: 'in', w: 32 },
                { foto: 'ishango', at: '#exkursion .b-row > .b-text', put: 'in', w: 26 }
            ]
        },
        mathegy7: {
            'lb1-1.html': [
                { foto: 'rad-am-pass', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'marktbrunnen', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'euklid-papyrus', at: '#exkursion .b-row > .b-text', put: 'in', w: 26 }
            ],
            'lb1-2.html': [
                { foto: 'geodreieck', at: '#le1 .b-einstieg', put: 'in', w: 28 },
                { foto: 'fussballfeld', at: '#le2 .b-einstieg', put: 'in', w: 32 },
                { foto: 'milet-theater', at: '#exkursion .b-row > .b-text', put: 'in', w: 32 }
            ],
            'lb2-1.html': [
                { foto: 'thermometer', at: '#le1 .b-einstieg', put: 'in', w: 22 },
                { foto: 'rechenstaebchen', at: '#exkursion .b-row > .b-text', put: 'in', w: 28 }
            ],
            'lb2-2.html': [
                { foto: 'ybc-7289', at: '#exkursion .b-row > .b-text', put: 'in', w: 30 }
            ],
            'lb2-3.html': [
                { foto: 'balkenwaage', at: '#le2 .b-einstieg', put: 'in', w: 28 },
                { foto: 'chwarizmi-statue', at: '#exkursion .b-row > .b-text', put: 'in', w: 24 }
            ],
            'lb2-4.html': [
                { foto: 'schlussverkauf', at: '#le2 .b-einstieg', put: 'in', w: 24, pos: '50% 30%' },
                { foto: 'wahlurne', at: '#le4 .b-einstieg', put: 'in', w: 28 },
                { foto: 'pacioli', at: '#exkursion .b-row > .b-text', put: 'in', w: 28 }
            ],
            'lb3-1.html': [
                { foto: 'buntstifte', at: '#le1 .b-einstieg', put: 'in', w: 30 },
                { foto: 'monge', at: '#exkursion .b-row > .b-text', put: 'in', w: 24 }
            ],
            'lb3-2.html': [
                { foto: 'giebeldach', at: '#le2 .b-einstieg', put: 'in', w: 30 },
                { foto: 'moskauer-papyrus', at: '#exkursion .b-row > .b-text', put: 'in', w: 26 }
            ],
            'lb4.html': [
                { foto: 'schulbus', at: '#le1 .b-einstieg', put: 'in', w: 32 },
                { foto: 'playfair-torte', at: '#exkursion .b-row > .b-text', put: 'in', w: 28 }
            ],
            'wb.html': [
                { foto: 'platonische-modelle', at: '#le1 .b-einstieg', put: 'in', w: 40 },
                { foto: 'euler', at: '#le2 .b-einstieg', put: 'in', w: 24 },
                { foto: 'kepler-mysterium', at: '#exkursion .b-row > .b-text', put: 'in', w: 26 }
            ]
        }
    }
};
