/* @AI-READONLY: CENTRAL LABS CONFIGURATION - DO NOT MODIFY WITHOUT EXPLICIT USER COMMAND */
/**
 * Cyber-Labor Laboratory Configuration v2.1
 * Centralized registry for all interactive mathematics modules.
 *
 * Jahrgangstabelle (Gymnasium): Filter über `category`-Token `grade5` … `grade12`.
 * `uni` = Universität / besonders komplexe Labs (Analysis, Physik, Fraktale, …) — nicht die Seite universe.html.
 * Hub-Ansicht aller uni-Labs: index.html#university
 * ————————————————————————————————————————————————————————————————
 * ————————————————————————————————————————————————————————————————
 * JG 5:  addition, subtraktion, multiplikation, dividieren, uhrzeitwinkel, logikspiel
 * JG 6:  uhrzeitwinkel, winkellabor
 * JG 7:  uhrzeitwinkel, winkellabor, cool-squares, transformationen (Kongruenz)
 * JG 8:  alle grade8-Labs inkl. Potenz (ab JG 8), Dreiecks-/Algebra-/LGS-Reihe, Fibonacci, …
 * JG 8–9: potenzlabor, pythagoras, pythagorasbeweis
 * JG 9:  parabellabor (zusätzlich zu JG 8–9 bei Pythagoras/Potenz)
 * JG 10–12: cmaes, opti-lens
 * JG 11–12: integralreaktor, fourier, mandelbrot-deep, atomorbitale, differentiallabor
 * uni (zusätzlich): stanford-portal (externer Link), lissajous, atomorbitale, mandelbrot-deep, fourier, integralreaktor, differentiallabor, cmaes, opti-lens
 * top5 (Hub-Kachel "TOP LABS"): ziffernraetsel, kovarianz, irisvis (Conway's Iris), fourier, mandelbrot-deep (Fraktale), atomorbitale, galtonboard, opti-lens (Linsenoptimierung), jacquard (Webstuhl / Lochkarte)
 * Keine Jahrgangs-Tags: cinematic-intro, happy-birthday-ulf (Show / Spaß).
 * ————————————————————————————————————————————————————————————————
 */

const LABS_DATA = [
    {
        "id": "lehrbuch-mathe11",
        "href": "buch/mathe11/index.html",
        "title": "Lehrbuch Mathematik 11",
        "description": "Unser erstes Buch: ein interaktives Lehrbuch Mathematik für das Berufliche Gymnasium, Klasse 11, nach dem sächsischen Lehrplan. Elf Kapitel in der Reihenfolge des Schuljahres – Gleichungen, Funktionen von linear bis Sinus, Regression und Logarithmus, Gleichungssysteme und Matrizen, Wahrscheinlichkeit und Numerik. Jedes Kapitel mit Erkundungen, Merkkästen, Beispielen, Aufgaben in drei Stufen, Selbsttests mit sofortiger Rückmeldung und Labs zum Ausprobieren: Parabeln ziehen, Gauß-Schritte ausführen, Zufallsversuche tausendmal laufen lassen. Dazu eine Druckausgabe mit Seitenzahlen, QR-Code je Kapitel und Lösungsanhang.",
        "tagline": "Buch / Mathematik 11 / 11 Kapitel",
        "icon": LAB_ICONS["lehrbuch-mathe11"],
        "category": "buecher neu funktionen stochastik grade11",
        "keywords": "buch buecher lehrbuch schulbuch mathebuch mathematik klasse 11 berufliches gymnasium bgy sachsen lehrplan kapitel gleichungen formeln binomische formeln prozent funktionen lineare funktion exponentialfunktion wachstum zerfall zinseszins halbwertszeit quadratische funktion parabel scheitelpunktform loesungsformel vieta sinus sinusfunktion einheitskreis regression logarithmus umkehrfunktion parameter gleichungssystem lgs gauss matrix matrizen wahrscheinlichkeit baumdiagramm pfadregel vierfeldertafel simulation bisektion monte carlo numerik aufgaben loesungen selbsttest druckausgabe pdf",
        "color": "gold"
    },
    {
        "id": "ziffernraetsel",
        "href": "ziffernraetsel.html",
        "title": "Ziffernrätsel",
        "description": "SEND + MORE = MONEY: Jeder Buchstabe ist eine Ziffer \u2014 aber welche? Das Labor löst das berühmte Rätsel von Henry Dudeney aus dem Jahr 1924 in 19 Schritten, ohne zu raten: von Stellenwert und Übertrag bis zur letzten Ziffer. Auf dem Brett steht die Rechnung wie auf Papier, die Spalte des Schritts leuchtet, und jede gefundene Ziffer wandert in die Ziffernleiste. Solita erklärt jeden Schritt genauer \u2014 auf Wunsch so einfach, dass man es schon in der Grundschule versteht. Dazu zwölf weitere Ziffernrätsel aus Vorrechnen, von A + A + A = 1A bis ABCD \u00b7 9 = DCBA.",
        "tagline": "Knobeln / Ziffernrätsel / Schritt für Schritt",
        "icon": LAB_ICONS["ziffernraetsel"],
        "category": "neu top5",
        "keywords": "ziffernraetsel ziffern raetsel buchstabenraetsel kryptarithmus kryptogramm alphametik send more money dudeney strand magazine knobeln logik stellenwert uebertrag schriftliche addition einer zehner hunderter tausender zehntausender buchstaben ziffernleiste solita schritt fuer schritt grundschule vorrechnen",
        "color": "gold"
    },
    {
        "id": "trigonometrie",
        "href": "trigonometrie.html",
        "title": "Trigonometrie",
        "description": "Sinus, Kosinus und Tangens vom rechtwinkligen Dreieck bis zur Ableitung \u2014 elf Kapitel, die aufeinander aufbauen. Links der Einheitskreis, rechts der Graph im selben Ma\u00dfstab: Der gr\u00fcne Bogen am Kreis ist genau die Strecke auf der x-Achse, und wer P herumzieht, sieht die Sinuskurve entstehen. Gleichungen wie sin x = \u00bd zeigen beide L\u00f6sungen, auch die, die der Taschenrechner verschweigt; im Parameter-Kapitel stellt man a\u00b7sin(b(x\u2212c))+d direkt am Hochpunkt ein oder l\u00f6st ein Kurven-R\u00e4tsel. Tagesl\u00e4nge in Dresden, Riesenrad und Gezeiten werden aus Hoch- und Tiefpunkt modelliert, Sinus- und Kosinussatz zeigen auch den Fall mit zwei Dreiecken. Jedes Kapitel bringt Theorie, eine B\u00fchne zum Anfassen und Aufgaben mit ausklappbarem L\u00f6sungsweg \u2014 gesetzt wie in LaTeX.",
        "tagline": "Funktionen / Trigonometrie / 11 Kapitel",
        "icon": LAB_ICONS["trigonometrie"],
        "category": "geometrie funktionen neu highlight hot grade9 grade10 grade11",
        "keywords": "trigonometrie sinus kosinus cosinus tangens sin cos tan einheitskreis bogenmass gradmass radiant rad grad rechtwinkliges dreieck gegenkathete ankathete hypotenuse sinuskurve kosinuskurve tangenskurve sinusfunktion kosinusfunktion tangensfunktion periode amplitude frequenz verschiebung phasenverschiebung mittellage wertebereich nullstellen hochpunkt tiefpunkt symmetrie periodisch schwingung gedaempfte schwingung modellieren tageslaenge riesenrad gezeiten ebbe flut wechselspannung exakte werte gleichung arcsin arccos arkussinus umkehrfunktion polstelle asymptote steigungswinkel sinussatz kosinussatz flaecheninhalt allgemeines dreieck ssw umkreis pythagoras ableitung kettenregel winkel",
        "color": "gold"
    },
    {
        "id": "maya",
        "href": "maya.html",
        "title": "Maya-Zahlen",
        "description": "Ein Rechenbrett f\u00fcr das Zahlensystem der Maya: Punkte z\u00e4hlen eins, Striche f\u00fcnf, die Muschel ist die Null \u2014 und jede Stelle ist zwanzigmal so viel wert wie die darunter. Im Kalender der Maya ist die dritte Stelle 360 statt 400, weil achtzehn Zwanziger das Jahr ergeben; beide Systeme stehen zur Wahl. Der Pfeil zwischen Zahl und Brett sagt, wer f\u00fchrt: nach oben z\u00e4hlt die Zahl mit, was Du legst, nach unten legt sie das Brett selbst, und grau ist sie eine Aufgabe. Der W\u00fcrfel stellt Aufgaben, die genau so viele Stellen f\u00fcllen, wie eingestellt sind.",
        "tagline": "Zahlensysteme / Stellenwert / Maya",
        "icon": LAB_ICONS["maya"],
        "category": "zahlensysteme neu",
        "keywords": "maya mayazahlen zahlensystem stellenwertsystem stellenwert vigesimal zwanzigersystem basis 20 punkte striche muschel null long count kalender 360 18 mal 20 babylonier roemisch ziffern legen rechenbrett kulturgeschichte",
        "color": "gold"
    },
    {
        "id": "babylon",
        "href": "babylon.html",
        "title": "Babylonische Zahlen",
        "description": "Ein Rechenbrett f\u00fcr das Sechzigersystem der Babylonier: der senkrechte Keil z\u00e4hlt eins, der Winkelhaken zehn, und jede Stelle ist sechzigmal so viel wert wie die rechts daneben \u2014 bis heute stecken die 60 Minuten und 3.600 Sekunden darin. Zur Wahl stehen die sp\u00e4te Schreibweise mit zwei schr\u00e4gen Keilen als Platzhalter und die altbabylonische ohne Null, in der eine leere Stelle einfach fehlt. Der Pfeil zwischen Zahl und Brett sagt, wer f\u00fchrt, und der W\u00fcrfel stellt Aufgaben, die genau so viele Stellen f\u00fcllen, wie eingestellt sind.",
        "tagline": "Zahlensysteme / Stellenwert / Babylon",
        "icon": LAB_ICONS["babylon"],
        "category": "zahlensysteme neu",
        "keywords": "babylon babylonier babylonisch keilschrift keil winkelhaken sexagesimal sechzigersystem basis 60 zahlensystem stellenwertsystem stellenwert platzhalter null seleukidisch altbabylonisch mesopotamien tontafel minuten sekunden ziffern legen rechenbrett kulturgeschichte",
        "color": "gold"
    },
    {
        "id": "binaer",
        "href": "binaer.html",
        "title": "Binärzahlen",
        "description": "Ein Rechenbrett für das Zweiersystem: nur zwei Ziffern, 0 und 1, und jede Stelle ist doppelt so viel wert wie die rechts daneben — 1, 2, 4, 8 bis 128. Acht Stellen sind ein Byte und fassen 0 bis 255. Der Pfeil zwischen Zahl und Brett sagt, wer führt, und der Würfel stellt Aufgaben, die genau so viele Stellen füllen, wie eingestellt sind. Mit der Taste C färben sich die Stellen in Vierergruppen — jede Gruppe ist eine Ziffer im Hexadezimalsystem.",
        "tagline": "Zahlensysteme / Stellenwert / Binär",
        "icon": LAB_ICONS["binaer"],
        "category": "zahlensysteme informatik neu",
        "keywords": "binaer binär binaerzahlen binärzahlen zweiersystem dualsystem dualzahlen basis 2 bit byte nibble halbbyte null eins stellenwertsystem stellenwert zweierpotenzen 128 255 leibniz computer informatik ziffern legen rechenbrett",
        "color": "gold"
    },
    {
        "id": "hexadezimal",
        "href": "hexadezimal.html",
        "title": "Hexadezimalzahlen",
        "description": "Ein Rechenbrett für das Sechzehnersystem: nach der 9 geht es mit Buchstaben weiter, A ist 10 und F ist 15, und jede Stelle ist sechzehnmal so viel wert wie die rechts daneben. Unter jeder Ziffer stehen ihre vier Bits — eine Hex-Ziffer ist genau ein halbes Byte, zwei sind ein ganzes: 00 bis FF, also 0 bis 255. Der Pfeil zwischen Zahl und Brett sagt, wer führt, und der Würfel stellt Aufgaben. Mit sechs Stellen passt ein Farbcode wie #F5C242 aufs Brett.",
        "tagline": "Zahlensysteme / Stellenwert / Hexadezimal",
        "icon": LAB_ICONS["hexadezimal"],
        "category": "zahlensysteme informatik neu",
        "keywords": "hexadezimal hex hexzahlen hexadezimalzahlen sechzehnersystem basis 16 bit byte nibble halbbyte a b c d e f 0x ff 255 farbcode rgb webfarbe speicheradresse stellenwertsystem stellenwert informatik computer ziffern legen rechenbrett",
        "color": "gold"
    },
    {
        "id": "vorrechnen",
        "href": "vorrechnen.html",
        "title": "Vorrechnen",
        "description": "Die digitale Tafel für die Stunde: Mit dem Stift wird Zeile für Zeile vorgerechnet, und jeder Rechenschritt wird als saubere Formel gesetzt. Die Aufgaben der Stunde liegen bereit, der Verlauf hält den ganzen Tag fest, und am Ende geht die Tafel mit einem Tipp in den Stoffverteilungsplan. Gebaut für Tablet und interaktive Tafel im Vollbild; am Rand sitzt der QR-Code für den Buzzer der Klasse.",
        "tagline": "Unterricht / Tafel / Handschrift",
        "icon": LAB_ICONS["vorrechnen"],
        "category": "unterricht neu",
        "keywords": "vorrechnen tafel whiteboard handschrift stift tablet beamer unterricht stunde rechenweg rechenschritt formel latex erkennen vollbild verlauf stoffverteilungsplan buzzer",
        "color": "green"
    },
    {
        "id": "buzzer",
        "href": "buzzer.html",
        "title": "Buzzer",
        "description": "Ein Knopf für die Klasse: „Nicht verstanden“ – anonym. Wer den QR-Code an der Tafel scannt oder den Code eintippt, kann jederzeit drücken. Gespeichert werden nur der Code und die Uhrzeit, kein Gerät und kein Name. Vorne sieht nur die Lehrkraft still, dass jemand nachfragen möchte, und erklärt es einfach noch einmal.",
        "tagline": "Unterricht / Klasse / anonym",
        "icon": LAB_ICONS["buzzer"],
        "category": "unterricht neu",
        "keywords": "buzzer nicht verstanden anonym frage nachfragen klasse unterricht qr code knopf melden rueckmeldung feedback",
        "color": "orange"
    },
    {
        "id": "rueckmeldung",
        "href": "rueckmeldung.html",
        "title": "Rückmeldung",
        "description": "Die Seite der Lehrkraft zum Buzzer – für jedes Fach. Die Klasse scannt den QR-Code, und vorne steht groß, wie viele gerade etwas nicht verstanden haben. Wer es danach doch verstanden hat, drückt noch einmal, und die Zahl geht wieder runter. Dazu „zu schnell“ und „zu langsam“. Anonym: nur Code und Uhrzeit, kein Name, kein Gerät. Auf Null für ein neues Thema, ein neuer Code für die nächste Klasse.",
        "tagline": "Unterricht / Feedback / jedes Fach",
        "icon": LAB_ICONS["rueckmeldung"],
        "category": "unterricht neu",
        "keywords": "rueckmeldung feedback buzzer nicht verstanden verstanden zuruecknehmen anonym klasse unterricht lehrkraft lehrer kollegen jedes fach qr code zaehler zu schnell zu langsam tempo",
        "color": "orange"
    },
    {
        "id": "koerperzaehlen",
        "href": "koerperzaehlen.html",
        "title": "Z\u00e4hlen in Papua-Neuguinea",
        "description": "Z\u00e4hlen \u00fcber den K\u00f6rper, wie es die Oksapmin in Papua-Neuguinea tun: vom Daumen \u00fcber die Finger, den Arm hinauf, um das Gesicht bis zur Nase \u2014 die 14 \u2014 und auf der anderen Seite zur\u00fcck bis zum kleinen Finger, der 27. Tipp auf den K\u00f6rper und die Zahl l\u00e4uft mit, tipp eine Zahl ein und der Z\u00e4hlweg leuchtet auf. \u00dcber 27 f\u00e4ngt man wieder am Daumen an und z\u00e4hlt Runden. Im Buch hei\u00dft das \u201eBasis 27\u201c \u2014 warum das kein Stellenwertsystem ist, steht hinter dem Zahnrad.",
        "tagline": "Zahlensysteme / Zählen / Papua-Neuguinea",
        "icon": LAB_ICONS["koerperzaehlen"],
        "category": "zahlensysteme neu",
        "keywords": "koerperzaehlen koerper zaehlen body counting oksapmin papua neuguinea basis 27 zaehlweg finger arm nase runden kein stellenwertsystem zahlensystem saxe kulturgeschichte ethnomathematik",
        "color": "gold"
    },
    {
        "id": "wuerfelspiel",
        "href": "wuerfelspiel.html",
        "title": "Das W\u00fcrfelspiel",
        "description": "Zwei selbst beschriftete W\u00fcrfel und eine Frage: Wie wahrscheinlich gewinnt Lena? Der Rundgang folgt dem Unterrichts-Deck Station f\u00fcr Station \u2014 W\u00fcrfelnetze lesen, gleiche Zahlen zu einem Ast zusammenfassen, den Baum Stufe f\u00fcr Stufe zeichnen, Pfadregel und Summenregel, die f\u00fcnf typischen Fehler und eine Zwillingsaufgabe mit L\u00f6sung; Solita erkl\u00e4rt mit ihrer Stimme. Im Labor beschriftet man die W\u00fcrfel selbst, und Baum, Tabelle, Fehler und Ergebnis rechnen sofort mit. Dazu eine Simulation, in der die relative H\u00e4ufigkeit an die Wahrscheinlichkeit heranr\u00fcckt, und Efrons nicht-transitive W\u00fcrfel, die sich im Kreis schlagen.",
        "tagline": "Stochastik / Baumdiagramm / Pfadregeln",
        "icon": LAB_ICONS["wuerfelspiel"],
        "category": "stochastik neu hot highlight grade10 grade11",
        "keywords": "wuerfel wuerfelspiel dice spiel baumdiagramm baum pfadregel produktregel summenregel wahrscheinlichkeit stochastik zweistufig mehrstufig zufallsexperiment wuerfelnetz netz aeste zusammenfassen unabhaengig pfad weg ereignis relative haeufigkeit gesetz der grossen zahlen simulation efron nicht-transitiv intransitiv zwillingsaufgabe typische fehler lena mia solita",
        "color": "green"
    },
    {
        "id": "docpad",
        "href": "docpad/index.html",
        "title": "DocPad",
        "description": "Ein Grafik- und CAS-Rechner als Gerät im Browser: exakt rechnen mit Brüchen, Wurzeln und π, Gleichungen lösen, Funktionen zeichnen, 3D-Graphen drehen, Statistik und Stochastik — alles über Tasten und Menüs wie am echten Rechner. Unter ⚙ ▸ Demo führt Solita mit Stimme und Maus durch die ersten Themen. Zugang mit Passwort; das Gerät merkt es sich.",
        "tagline": "Rechner / CAS / Grafik / 3D",
        "icon": LAB_ICONS["docpad"],
        "category": "apps neu",
        "keywords": "docpad doc pad rechner taschenrechner grafikrechner cas computeralgebra exakt bruch wurzel gleichung ungleichung loesen solve graph funktion plot 3d statistik stochastik wertetabelle demo app",
        "color": "blue"
    },
    {
        "id": "vektoren",
        "href": "vektoren.html",
        "title": "Vektoren",
        "description": "Analytische Geometrie von der ersten Verschiebung bis zur Pr\u00fcfungsreife \u2014 elf Kapitel, die aufeinander aufbauen. Vorne zieht man Pfeile mit der Maus und sieht, dass derselbe Vektor \u00fcberall stehen darf; hinten dreht man Ebenen im Raum und liest Lotfu\u00dfpunkt und Abstand ab. Das Labor sagt nie an, was herauskommt: die Lagebeziehung zweier Geraden wird aus den aktuellen Zahlen gerechnet, und wer den Richtungsvektor \u00fcber den Sonderfall hinwegschiebt, sieht das Urteil von parallel auf windschief kippen. Jedes Kapitel bringt kurze Theorie, eine B\u00fchne zum Anfassen und drei bis f\u00fcnf Aufgaben mit ausklappbarem L\u00f6sungsweg \u2014 Schreibweise wie an der Tafel, mit Schr\u00e4gstrichen im Punkt und dem Ringoperator im Skalarprodukt.",
        "tagline": "Geometrie / Vektorrechnung / 11 Kapitel",
        "icon": LAB_ICONS["vektoren"],
        "category": "geometrie neu highlight hot grade11 grade12 uni",
        "keywords": "vektor vektoren vektorrechnung analytische geometrie ortsvektor verbindungsvektor repraesentant pfeilklasse betrag laenge einheitsvektor normieren linearkombination linear abhaengig unabhaengig basis gerade parameterform stuetzvektor richtungsvektor punktprobe lagebeziehung windschief parallel identisch schnittpunkt ebene normalenform koordinatenform parameterform spurpunkte normalenvektor skalarprodukt orthogonal senkrecht winkel kreuzprodukt vektorprodukt spatprodukt komplanar flaecheninhalt parallelogramm dreieck abstand lot lotfusspunkt hesse spiegelung mittelpunkt diagonalenschnittpunkt pyramide volumen oberstufe abitur leistungskurs",
        "color": "gold"
    },
    {
        "id": "marionwalter",
        "href": "marionwalter.html",
        "title": "Satz von Marion Walter",
        "description": "Drittle jede Seite eines beliebigen Dreiecks und verbinde jeden Teilungspunkt mit der gegen\u00fcberliegenden Ecke. Die sechs Cevianen schlie\u00dfen ein Sechseck ein \u2014 und dessen Fl\u00e4che ist immer genau ein Zehntel der Dreiecksfl\u00e4che, egal wie schief das Dreieck steht. Das Lab behauptet das nicht, es misst: das Sechseck entsteht als Schnitt der sechs Halbebenen, die Fl\u00e4che kommt aus der Gau\u00dfschen Trapezformel, und die Abweichung zum exakten Wert steht daneben. Teilt man die Seiten stattdessen bei k/n, liefert 2(n\u22122k)\u00b2/((2n\u2212k)(n+k)) das Verh\u00e4ltnis \u2014 nur die Drittelung macht den glatten Zehntel. Auf Wunsch f\u00e4rbt das Lab alle 19 Teilfl\u00e4chen ein.",
        "tagline": "Geometrie / Dreieck / immer ein Zehntel",
        "icon": LAB_ICONS["marionwalter"],
        "category": "geometrie dreiecke neu hot highlight grade8 grade9 grade10",
        "keywords": "marion walter marionwalter zehntel sechseck hexagon dreieck cevianen cevian trisektion drittelung dreiteilung teilungspunkte flaecheninhalt flaechenverhaeltnis verhaeltnis affin affine abbildung invariant schwerpunkt seitenhalbierende arrangement teilflaechen mittendreieck 1/10",
        "color": "gold"
    },
    {
        "id": "kreisteilung",
        "href": "kreisteilung.html",
        "title": "Kreisteilung",
        "description": "n Punkte auf einem Kreis, alle Sehnen gezeichnet \u2014 in wie viele Fl\u00e4chen zerf\u00e4llt die Scheibe? 1, 2, 4, 8, 16 \u2026 und dann 31, nicht 32. Der ber\u00fchmteste Reinfall beim Weiterraten. Das Lab z\u00e4hlt die Fl\u00e4chen nicht mit der Formel C(n,4) + C(n,2) + 1, sondern l\u00e4uft den planaren Graphen aus Bogen- und Sehnenst\u00fccken wirklich ab \u2014 deshalb zeigt es auch den entarteten Fall: das regelm\u00e4\u00dfige Sechseck hat nur 30 Fl\u00e4chen, weil sich drei Diagonalen im Mittelpunkt treffen. Jeder Punkt l\u00e4sst sich auf dem Kreis verschieben, und der Sprung von 30 auf 31 passiert vor den Augen.",
        "tagline": "Geometrie / Kombinatorik / 1, 2, 4, 8, 16, 31",
        "icon": LAB_ICONS["kreisteilung"],
        "category": "geometrie neu hot highlight grade10 grade11 grade12",
        "keywords": "kreisteilung kreis sehnen chords schnittpunkte flaechen regionen zerlegung kombinatorik binomialkoeffizient eulerformel eulersche polyederformel folge vermutung induktion gegenbeispiel moser moserkreis sechseck diagonalen entartet cutcircle 31",
        "color": "gold"
    },
    {
        "id": "cavalieri",
        "href": "cavalieri.html",
        "title": "Satz von Cavalieri",
        "description": "Zwei Körper zwischen denselben zwei Parallelen: Liefert jeder waagerechte Schnitt beidemal denselben Inhalt, dann sind die Körper gleich groß. In 2D steht ein Dreieck zwischen zwei Geraden — die Spitze lässt sich beliebig weit zur Seite schieben, und weil jeder waagerechte Schnitt seine Länge behält, rührt sich die Fläche ½·g·h nicht. In 3D kippt ein Stapel gleicher Scheiben zur Seite: ein schiefer Zylinder fasst genauso viel wie ein gerader, πr²h, und der Kegel zeigt dasselbe mit kleiner werdenden Scheiben. Das Lab behauptet nichts, es misst mit — Grundseite, Höhe und Inhalt stehen während des Scherens daneben und bleiben stehen. Nach einem Java-Programm von Doc Alvers.",
        "tagline": "Geometrie / Fläche und Volumen / schief ist nicht kleiner",
        "icon": LAB_ICONS["cavalieri"],
        "category": "geometrie neu hot koerper grade7 grade8 grade9 grade10 grade11",
        "keywords": "cavalieri bonaventura prinzip satz scherung schaeren schief schiefer zylinder prisma kegel pyramide dreieck flaeche flaecheninhalt volumen rauminhalt scheiben streifen muenzstapel parallelen grundflaeche hoehe integral zerlegung querschnitt schnittflaeche invariant gleichmaechtig",
        "color": "gold"
    },
    {
        "id": "brahmagupta",
        "href": "brahmagupta.html",
        "title": "Satz von Brahmagupta",
        "description": "Ein Sehnenviereck, dessen Diagonalen senkrecht aufeinander stehen — und zwei Aussagen daran, beide von Brahmagupta (7. Jh., Indien). Der Satz: F\u00e4llt man vom Diagonalenschnittpunkt P das Lot auf eine Seite und verl\u00e4ngert es \u00fcber P hinaus, so trifft es die Gegenseite genau in der Mitte — weil P mit den beiden Endpunkten ein rechtwinkliges Dreieck bildet und der Lotfu\u00dfpunkt dessen Umkreismittelpunkt ist. Die Formel: K = \u221a((s\u2212a)(s\u2212b)(s\u2212c)(s\u2212d)) misst die Fl\u00e4che, aber nur solange alle vier Ecken auf dem Kreis liegen. Nimmt man sie herunter, wird K zu gro\u00df — Heron f\u00fcr Vierecke, mit einer Bedingung.",
        "tagline": "Geometrie / Sehnenviereck / Fl\u00e4che",
        "icon": LAB_ICONS["brahmagupta"],
        "category": "geometrie neu highlight hot grade9 grade10 grade11",
        "keywords": "brahmagupta sehnenviereck kreisviereck zyklisch diagonalen senkrecht orthodiagonal lot lotfusspunkt mittelpunkt seitenmitte umkreis thales fl\u00e4che flaeche heron bretschneider halbumfang indien geometrie viereck",
        "color": "gold"
    },
    {
        "id": "jacquard",
        "href": "jacquard.html",
        "title": "Jacquard",
        "description": "Ein Webstuhl von 1805, in 3D — und die erste Maschine, die ein Bild nach einer Vorlage herstellt. Eine Lochkarte steuert jeden Kettfaden einzeln: Wo ein Loch ist, rutscht die Nadel hindurch, der Haken bleibt stehen und das Messer hebt den Faden; wo Papier ist, bleibt er unten und der blaue Schuss deckt ihn ab. Karte für Karte wächst das Bild aus der Maschine. Motiv und Maschine sind dabei zwei verschiedene Dinge: derselbe Kreis wird mit mehr Kettfäden runder, und wo die Zeichnung feiner ist als das Gewebe, webt der Webstuhl ein Muster, das es in der Vorlage gar nicht gibt.",
        "tagline": "Informatik / Lochkarte / Weberei",
        "icon": LAB_ICONS["jacquard"],
        "category": "informatik neu top5 highlight hot grade9 grade10 grade11 grade12 uni",
        "keywords": "jacquard webstuhl weben weberei lochkarte lochkarten kettfaden schussfaden litze platine harnisch fach schiffchen weblade riet gewebe muster stoff textil seide babbage hollerith programm bit binaer abtastung aufloesung moire 1805 industrialisierung informatikgeschichte",
        "color": "gold"
    },
    {
        "id": "koerper",
        "href": "koerper.html",
        "title": "Körper",
        "description": "Platonische, Archimedische und Catalanische Körper, Prismen, Antiprismen, Pyramiden und Rundformen — drehbar in 3D, mit Oberfläche, Volumen, Um-, Kanten- und Inkugelradius, Flächenwinkeln und Formeln live zur Kantenlänge. Jeder Körper lässt sich per Schieber zum Netz auffalten; Catalanische Körper entstehen als Duale der Archimedischen durch Polarität an der Kantenkugel.",
        "tagline": "Geometrie / Polyeder / Netze",
        "icon": LAB_ICONS["koerper"],
        "category": "geometrie neu highlight hot grade8 grade9 grade10 uni",
        "keywords": "koerper körper polyeder platonisch archimedisch catalanisch tetraeder wuerfel oktaeder dodekaeder ikosaeder fussball kuboktaeder rhombendodekaeder netz abwicklung oberflaeche volumen umkugel inkugel kantenkugel prisma antiprisma pyramide zylinder kegel kegelstumpf torus ellipsoid kugel geometrierechner",
        "color": "gold"
    },
    {
        "id": "bb84",
        "href": "bb84.html",
        "title": "BB84",
        "description": "Quantenschlüsselaustausch nach Bennett und Brassard: Alice schickt einzelne Photonen, jedes in einer von zwei Basen — + mit den Zuständen — und |, oder × mit / und \\. Bob wählt seine Basis zufällig: gleiche Basis heißt sicheres Ergebnis, andere Basis heißt reiner Zufall. Über jede Spalte fahren erklärt genau dieses Photon. Mit der Lauscherin Eve steigt die Fehlerquote im öffentlich verglichenen Teil auf ein Viertel — die Entdeckungswahrscheinlichkeit ist 1 − (3/4)^m, und tausend Läufe auf Knopfdruck zeigen, dass es wirklich so ist. Dazu ein Lehrmodus, der alle Fälle einmal durchgeht.",
        "tagline": "Kryptografie / Quantenphysik / Zufall",
        "icon": LAB_ICONS["bb84"],
        "category": "informatik physik neu highlight hot uni grade11 grade12",
        "keywords": "bb84 quantenkryptografie quantenkryptographie quantum cryptography schluesselaustausch key distribution qkd bennett brassard alice bob eve lauscher polarisation photon basis sifting qber fehlerrate abhoeren kryptografie verschluesselung one time pad zufall messung kollaps",
        "color": "purple"
    },
    {
        "id": "kovarianz",
        "href": "kovarianz.html",
        "title": "Kovarianz",
        "description": "Eine lineare Abbildung A zieht, dreht und schert die Ebene. Auf eine runde Punktwolke angewandt wird daraus eine Ellipse \u2014 und genau deren Form steht in der Kovarianzmatrix: aus \u03a3\u2080 = \u03c3\u00b2E wird \u03a3 = A \u03a3\u2080 A\u1d40. Matrix zellenweise einstellen oder die Bildellipse direkt am Griff ziehen; Σ, Korrelation und die Eigenvektoren als Hauptachsen werden live aus den gezeichneten Punkten gerechnet. Mit Normal- und Gleichverteilung, homogenen Koordinaten und Parallelen, die zeigen, was die Abbildung mit Geraden macht.",
        "tagline": "Stochastik / Lineare Abbildung / Eigenvektoren",
        "icon": LAB_ICONS["kovarianz"],
        "category": "stochastik funktionen neu top5 highlight hot uni grade11 grade12",
        "keywords": "kovarianz kovarianzmatrix korrelation streuung varianz eigenvektor eigenwert hauptachse hauptachsentransformation pca lineare abbildung matrix scherung drehung determinante ellipse punktwolke normalverteilung gauss homogene koordinaten affine abbildung",
        "color": "cyan"
    },
    {
        "id": "irisvis",
        "href": "irisvis.html",
        "title": "Conway's Iris",
        "description": "Verlängere an jeder Ecke beide Seiten um die gegenüberliegende Seite — die sechs Endpunkte liegen auf einem Kreis um den Inkreismittelpunkt, R = \u221a(r²+(s+d)²). Sechs Scheibenwischer-Bögen bilden daraus eine Kurve konstanter Breite; ein Quadrat umschließt sie in jeder Drehlage, und CMA-ES sucht seine Lage live. Mit Beweis-Ansichten, Heatmap der Suchlandschaft und dem Reuleaux-Dreieck auf Knopfdruck.",
        "tagline": "Geometrie / Konstante Breite / CMA-ES",
        "icon": LAB_ICONS["irisvis"],
        "category": "geometrie dreiecke neu top5 highlight hot uni grade10 grade11 grade12",
        "keywords": "conway kreis satz circle theorem dreieck inkreis reuleaux konstante breite wischer wiper mathologer cmaes evolutionsstrategie optimierung stuetzfunktion quadrat rotation",
        "color": "gold"
    },
    {
        "id": "ascii",
        "href": "ascii.html",
        "title": "ASCII-Art",
        "description": "Bilder sind Zahlen: Foto, Kamera-Livebild oder Beispiel in Zellen rastern, Grauwert rechnen, Zeichen wählen — als Zeichen, farbig, Halbton oder Braille, mit Dithering. Ein Klick auf ein Zeichen zeigt die komplette Rechnung für genau diese Zelle; in Stufe 2 schreiben Schüler die Abbildung Grauwert → Zeichen selbst.",
        "tagline": "Informatik / Bilddaten / Pixel → Zeichen",
        "icon": LAB_ICONS["ascii"],
        "category": "informatik neu sonst",
        "keywords": "ascii art asciiart text bild zeichen pixel grauwert luminanz rampe braille halbton dithering floyd steinberg kamera webcam informatik bilddaten rgb",
        "color": "green"
    },
    {
        "id": "fuzzy",
        "href": "fuzzy/fuzzy.html",
        "title": "Fuzzy Search",
        "description": "Suchen mit Tippfehlern: Text und Anfrage werden in Trigramme zerlegt, drei Zeichen am Stück, und jede Stelle glüht so heiß, wie viele passende Trigramme sie überdecken, weiß bis rot wie im Original von 2003. Die Treffer stehen als Schnipsel geordnet daneben, die Pfeiltasten springen durch sie, IDF gewichtet seltene Silben stärker, und eine eigene Textdatei lässt sich öffnen. Hell oder dunkel, alles im Browser.",
        "tagline": "Informatik / Suche / Trigramme",
        "icon": LAB_ICONS["fuzzy"],
        "category": "informatik neu uni grade11 grade12 sonst",
        "keywords": "fuzzy search suche unscharf trigramm trigramme n-gramm heatmap tippfehler aehnlichkeit idf volltext textsuche stringvergleich 2003",
        "color": "gold"
    },
    {
        "id": "morph",
        "href": "morpheus/morph.html",
        "title": "Morph",
        "description": "Zeichne ein Zeichen mit Maus oder Finger, und es verwandelt sich Schritt für Schritt in das gesetzte Symbol: Aus dem Gekrakel werden Umrisse, deren Punkte dem Ziel zugeordnet werden, und der Schieber oder die Leertaste lässt den Morph laufen. Ziele sind griechische Buchstaben, Operatoren, Relationen und Mengen aus dem LaTeX-Schriftsatz, dazu Linien- und Punkteansicht, Zoom, Undo und ein 3D-Blick auf den Übergang.",
        "tagline": "Informatik / Formen / Morphing",
        "icon": LAB_ICONS["morph"],
        "category": "fun informatik neu sonst",
        "keywords": "morph morphing zeichnen symbol buchstabe griechisch latex umriss kontur zuordnung ungarische methode animation uebergang formel handschrift 3d",
        "color": "blue"
    },
    {
        "id": "equationocr",
        "href": "morpheus/equationocr.html",
        "title": "Equation OCR",
        "description": "Eine Formel mit dem Stift auf die Tafel schreiben, ERKENNEN drücken, und ein Sprachmodell liest sie als LaTeX zurück: Das Ergebnis erscheint gesetzt und als farbige Umrisse über der eigenen Handschrift, sodass man Zeichen für Zeichen vergleichen kann. Vorlagen aus der Formelsammlung lassen sich abschreiben, das Modell ist wählbar, und eine Kostenanzeige zählt mit, weil jede Erkennung einen echten Aufruf kostet.",
        "tagline": "Informatik / KI / Handschrift zu LaTeX",
        "icon": LAB_ICONS["equationocr"],
        "category": "informatik apps neu sonst",
        "keywords": "ocr formel erkennen handschrift latex gemini ki texterkennung gleichung tafel stift umriss kosten sprachmodell vision",
        "color": "orange"
    },
    {
        "id": "pinkerfinder",
        "href": "pinkerfinder/index.html",
        "title": "PinkerFinder",
        "description": "Der macOS-Finder 1:1 nachgebaut — plus Such-Facetten: Ordnergrößen in der Liste, Dubletten nach Inhalt, Facetten-Suche über den ganzen Mac, Live-Update. Native Mac-App zum Download.",
        "tagline": "macOS / Finder + Such-Facetten",
        "icon": LAB_ICONS["pinkerfinder"],
        "category": "apps neu",
        "keywords": "pinkerfinder pinker finder mac macos dateien ordner suche facetten dubletten größe explorer app",
        "color": "orange"
    },
    {
        "id": "cinematic-intro",
        "href": "intro.html",
        "title": "Cinematic Intro",
        "description": "Erlebe den monumentalen Start in das Doc Alvers Labor. Die ULTRA v5.3.8 Visual Identity in 6-Sekunden-Qualität.",
        "tagline": "Vita Somnium Breve",
        "icon": LAB_ICONS["cinematic-intro"],
        "category": "hot",
        "keywords": "intro startup branding reveal ultra",
        "color": "blue"
    },
    {
        "id": "transformationen",
        "href": "transformationen.html",
        "title": "Kongruenz",
        "description": "Erforsche Drehung, Verschiebung und Skalierung eines Dreiecks interaktiv. Verschiebe den Rotationspunkt und beobachte die mathematischen Auswirkungen (Transformationen).",
        "tagline": "Geometrie / Transformationen",
        "icon": LAB_ICONS["transformationen"],
        "category": "geometrie hot grade7 grade8",
        "keywords": "kongruenz geometrie dreieck transformation rotation translation zoom spiegelung",
        "color": "green"
    },
    {
        "id": "heart3d",
        "href": "heart3d.html",
        "title": "3D Heart Surface",
        "description": "Visualisierung einer impliziten 3D-Fläche. Entdecke die Formel hinter dem mathematischen Herzen.",
        "tagline": "Implizite Funktionen / Herz-Formel",
        "icon": LAB_ICONS["heart3d"],
        "category": "fun grade8",
        "keywords": "3d geometrie fläche herz herzkurve implizit",
        "color": "blue"
    },
    {
        "id": "litchi3d",
        "href": "litchi3d.html",
        "title": "3D Litchi Labor",
        "description": "Komplexe 3D-Oberflächenmathematik. Erkunde die Litschi-Fläche in einer interaktiven 3D-Umgebung.",
        "tagline": "Prozedurale Oberflächen / SDF Geometrie",
        "icon": LAB_ICONS["litchi3d"],
        "category": "fun grade8",
        "keywords": "3d oberfläche litschi litchi visualisierung",
        "color": "purple"
    },
    {
        "id": "hermanngitter",
        "href": "hermanngitter.html",
        "title": "Hermanngitter",
        "description": "Dunkle Kacheln, helle Gassen, und an jeder Kreuzung erscheint ein grauer Fleck, der nicht da ist: das Hermann-Gitter. Kachelgröße, Gassenbreite und Helligkeit der Gassen lassen sich verschieben, und man sieht, wann die Täuschung kippt. Der Schalter für die Punkte legt in jede Kreuzung eine Scheibe, dann blitzen sie schwarz auf: das Scintillating Grid von Lingelbach aus dem Jahr 1994. Umgekehrt geht es auch, hell auf dunkel.",
        "tagline": "Wahrnehmung / Täuschung / Hermann-Gitter",
        "icon": LAB_ICONS["hermanngitter"],
        "category": "fun neu sonst grade5 grade6 grade7 grade8",
        "keywords": "hermann gitter hermanngitter optische taeuschung illusion scintillating grid lingelbach kreuzung grauer fleck wahrnehmung netzhaut laterale hemmung kacheln gassen",
        "color": "blue"
    },
    {
        "id": "addition",
        "href": "addition.html",
        "title": "Schriftliche Addition",
        "description": "Lerne die schriftliche Addition Schritt für Schritt. Visualisiert den Spaltenaufbau und das Übertrag-System in Echtzeit.",
        "tagline": "Grundrechenarten / Spalten-Analyse",
        "icon": LAB_ICONS["addition"],
        "category": "arithmetik grade5 hot",
        "keywords": "addition plusrechnen schriftlich addieren mathe schule",
        "color": "blue"
    },
    {
        "id": "einsundeins",
        "href": "einsundeinsgleichzwei.html",
        "title": "1 + 1 = 2",
        "description": "Eine einzige Rechnung, vier Ebenen tiefer: Hochsprache → Assembler → Maschinenbytes → Volladdierer aus Logikgattern. Auf jeder Ebene dieselbe Information, nur eine Abstraktion tiefer — der Übertrag rieselt sichtbar durch die Gatter, und ein Bit ist am Ende nur Spannung an oder aus.",
        "tagline": "Vom Code zu den Bits / Wie ein Computer rechnet",
        "icon": LAB_ICONS["einsundeins"],
        "category": "arithmetik logik fun hot highlight grade8 grade9",
        "keywords": "binär bit byte hex assembler maschinencode informatik volladdierer logikgatter xor and übertrag carry null eins strom spannung transistor cpu",
        "color": "gold"
    },
    {
        "id": "neuroaddierer",
        "href": "neuroaddierer.html",
        "title": "Der gelernte Addierer",
        "description": "Im Lab 1 + 1 = 2 sind die Volladdierer fest verdrahtet \u2014 hier ist keiner verdrahtet. Ein winziges neuronales Netz aus 32 Zahlen bekommt nur die acht Zeilen der Wahrheitstabelle zu sehen und soll das Addieren selbst finden: durch Evolution (CMA-ES), ganz ohne Ableitung. Danach rechnen acht Kopien des gelernten Netzes in Reihe jede Summe bis 255 \u2014 und man sieht, dass seine Ausg\u00e4nge nie exakt 0 oder 1 sind, sondern 0,03 und 0,97.",
        "tagline": "Netz lernt Rechnen / Evolution statt Backpropagation",
        "icon": LAB_ICONS["neuroaddierer"],
        "category": "logik informatik fun hot highlight grade9 grade10",
        "keywords": "ki neuronales netz machine learning evolution cmaes rechenberg evolutionsstrategie backpropagation gewichte training volladdierer xor \u00fcbertrag carry bit lernen gradient",
        "color": "gold"
    },
    {
        "id": "ann",
        "href": "ann.html",
        "title": "Künstliche Neuronen",
        "description": "Ein kleines neuronales Netz lernt Addition, Subtraktion, Multiplikation oder Division aus Beispielen statt aus Regeln: zwei Eingaben links, Schichten und Neuronen kommen per Knopf dazu oder weg, dann Training, und die Verlustkurve zeigt, wie der Fehler fällt. Verbindungen und Knoten werden live gezeichnet, rechts stehen Ausgabe, Ziel und Abweichung. Mit eigenen Zahlen sieht man sofort, wo das Netz gut rät und wo es scheitert, etwa außerhalb des Trainingsbereichs. Läuft mit TensorFlow.js komplett im Browser.",
        "tagline": "Informatik / KI / Neuronales Netz",
        "icon": LAB_ICONS["ann"],
        "category": "informatik logik neu hot uni grade10 grade11 grade12",
        "keywords": "ann knn neuronales netz neuron neuronen schicht layer gewichte training verlust loss tensorflow ki kuenstliche intelligenz maschinelles lernen addition subtraktion multiplikation division lernen backpropagation",
        "color": "gold"
    },
    {
        "id": "numberrecognition",
        "href": "numberrecognition.html",
        "title": "KI Zahlenerkennung",
        "description": "Ein Faltungsnetz lernt Ziffern aus 10 000 echten Handschriften der MNIST-Sammlung, und zwar hier im Browser: Erst rieseln die Trainingsbilder als Raster durch, dann laufen acht Durchgänge, bei denen Treffsicherheit und Fehler mitlaufen. Danach schreibt man selbst eine Ziffer mit Maus oder Finger und sieht die Vorhersage in Echtzeit. Das fertige Modell bleibt im Browser gespeichert, das Training muss nur einmal laufen.",
        "tagline": "Informatik / KI / MNIST",
        "icon": LAB_ICONS["numberrecognition"],
        "category": "informatik neu highlight hot grade9 grade10 grade11 grade12 uni",
        "keywords": "zahlenerkennung ziffern erkennen mnist handschrift cnn faltungsnetz neuronales netz ki kuenstliche intelligenz training softmax vorhersage zeichnen tensorflow maschinelles lernen",
        "color": "purple"
    },
    {
        "id": "subtraktion",
        "href": "subtraktion.html",
        "title": "Schriftliche Subtraktion",
        "description": "Trainiere die schriftliche Subtraktion mit Entborgen Schritt für Schritt. Interaktive Spaltenhilfe für saubere Minusrechnung.",
        "tagline": "Grundrechenarten / Entborgen",
        "icon": LAB_ICONS["subtraktion"],
        "category": "arithmetik grade5 hot",
        "keywords": "subtraktion minus schriftlich entborgen mathe schule",
        "color": "blue"
    },
    {
        "id": "multiplikation",
        "href": "multiplikation.html",
        "title": "Schriftliche Multiplikation",
        "description": "Visualisiert die schriftliche Multiplikation Schritt für Schritt. Inklusive Übertrag-Tracking und Detail-Modus für tiefe mathematische Analyse.",
        "tagline": "Grundrechenarten / Detail-Analyse",
        "icon": LAB_ICONS["multiplikation"],
        "category": "arithmetik grade5 hot",
        "keywords": "multiplikation malrechnen schriftlich mathe schule",
        "color": "gold"
    },
    {
        "id": "dividieren",
        "href": "dividieren.html",
        "title": "Schriftliche Division",
        "description": "Meistere die schriftliche Division mit dem interaktiven ULTRA-Labor. Perfekte Ausrichtung und pädagogische Begleitung durch den Math-Coach.",
        "tagline": "Grundrechenarten / Grid-Analyse",
        "icon": LAB_ICONS["dividieren"],
        "category": "arithmetik grade5 hot",
        "keywords": "division teilen schriftlich dividieren mathe schule",
        "color": "blue"
    },
    {
        "id": "winkelsumme3d",
        "href": "winkelsumme3d.html",
        "title": "3D Winkelsumme",
        "description": "Erlebe die Winkelsumme im 3-dimensionalen Raum. Dynamische Visualisierung der inneren Winkel eines Dreiecks.",
        "tagline": "Räumliche Visualisierung / Animation",
        "icon": LAB_ICONS["winkelsumme3d"],
        "category": "dreiecke hot grade8",
        "keywords": "3d geometrie winkelsumme dreieck animation",
        "color": "purple"
    },
    {
        "id": "ausgleichsgerade",
        "href": "ausgleichsgerade.html",
        "title": "Ausgleichsgerade",
        "description": "Finde die beste Gerade durch eine Punktwolke. Verstehe die Minimierung der Fehlerquadrate (Regression).",
        "tagline": "Statistik / Regression / Datenanalyse",
        "icon": LAB_ICONS["ausgleichsgerade"],
        "category": "hot grade8",
        "keywords": "statistik regression korrelation funktion daten",
        "color": "green"
    },
    {
        "id": "binomischeslabor",
        "href": "binomischeslabor.html",
        "title": "1. Binomische Formel",
        "description": "Visualisiere die binomischen Formeln geometrisch. Verstehe das Quadrat einer Summe durch Flächenzerlegung.",
        "tagline": "Algebra / Geometrische Veranschaulichung",
        "icon": LAB_ICONS["binomischeslabor"],
        "category": "algebra hot grade8",
        "keywords": "algebra formel quadrat termvereinfachung",
        "color": "blue"
    },
    {
        "id": "butterfly",
        "href": "butterfly.html",
        "title": "Schmetterlingskurve",
        "description": "Eine faszinierende transzendente Kurve, definiert durch Polarkoordinaten. Mathematik trifft Ästhetik.",
        "tagline": "Polarkoordinaten / Mathematik trifft Kunst",
        "icon": LAB_ICONS["butterfly"],
        "category": "fun grade8",
        "keywords": "geometrie kurve polarkoordinaten butterfly schmetterling",
        "color": "gold"
    },
    {
        "id": "triangulierer",
        "href": "triangulierer.html",
        "title": "Delaunay",
        "description": "Algorithmen der Triangulierung. Erzeuge optimale Dreiecksnetze nach der Delaunay-Methode.",
        "tagline": "Delaunay / Voronoi / Algorithmen",
        "icon": LAB_ICONS["triangulierer"],
        "category": "hot grade8",
        "keywords": "geometrie triangulation delaunay voronoi fläche",
        "color": "green"
    },
    {
        "id": "stanford-portal",
        "href": "https://www.stanford.edu/",
        "title": "Stanford University",
        "description": "Elite-Forschungsuni im Silicon Valley: Spitzenforschung, offene Ideen und eine Campus-Kultur, die Tech und Wissenschaft weltweit prägt. Ergänzend zu den Uni-Labs hier im Portal.",
        "tagline": "Stanford · Kalifornien · Forschung & Lehre",
        "icon": LAB_ICONS["stanford-portal"],
        "category": "uni",
        "keywords": "stanford university kalifornien silicon valley forschung campus stanford.edu",
        "color": "blue"
    },
    {
        "id": "differentiallabor",
        "href": "differentiallabor.html",
        "title": "Differential-Labor",
        "description": "Meistere die Differentialrechnung. Erkunde den Zusammenhang zwischen einer Funktion und ihrer Ableitung durch die Tangente.",
        "tagline": "Ableitungen / Tangenten / Kurvendiskussion",
        "icon": LAB_ICONS["differentiallabor"],
        "category": "hot grade11 grade12 uni",
        "keywords": "differential ableitung tangente analysis funktion kurvendiskussion",
        "color": "blue"
    },
    {
        "id": "eulergerade",
        "href": "eulergerade.html",
        "title": "Euler Feuerbach und Napoleon",
        "description": "Die faszinierende Geometrie des Dreiecks. Entdecke die Euler-Gerade, den Feuerbach-Kreis und Napoleons Satz.",
        "tagline": "Besondere Linien & Punkte / Klassische Geometrie",
        "icon": LAB_ICONS["eulergerade"],
        "category": "dreiecke grade8 feuerbachkreis feuerbach neunpunktekreis",
        "keywords": "geometrie euler feuerbach kreis dreieck schwerpunkt",
        "color": "blue"
    },
    {
        "id": "gleichschenkligesDreieck",
        "href": "gleichschenkligesDreieck.html",
        "title": "Gleichschenkliges Dreieck",
        "description": "Spezielle Dreiecke und ihre Eigenschaften. Berechne Basiswinkel und Seitenlängen interaktiv.",
        "tagline": "Symmetrie / Basiswinkel / LGS",
        "icon": LAB_ICONS["gleichschenkligesDreieck"],
        "category": "lgs grade8",
        "keywords": "geometrie dreieck gleichschenklig winkel lgs",
        "color": "gold"
    },
    {
        "id": "parabellabor",
        "href": "parabellabor.html",
        "title": "Parabeln",
        "description": "Manipulation quadratischer Funktionen. Verstehe den Einfluss von Parametern auf die Parabelform.",
        "tagline": "Quadratische Funktionen / Parameter-Studie",
        "icon": LAB_ICONS["parabellabor"],
        "category": "hot grade9 funktionen highlight",
        "keywords": "parabel quadratisch gleichung scheitelpunkt stauchung streckung",
        "color": "purple"
    },
    {
        "id": "winkelsumme",
        "href": "winkelsumme.html",
        "title": "Polygon-Labor",
        "description": "Berechne die Winkelsumme in beliebigen n-Ecken. Entdecke die Formel für die Innenwinkel von Polygonen.",
        "tagline": "Winkelsumme in n-Ecken / Vielecke",
        "icon": LAB_ICONS["winkelsumme"],
        "category": "dreiecke hot grade8",
        "keywords": "geometrie polygon winkel vieleck winkelsumme",
        "color": "gold"
    },
    {
        "id": "potenzlabor",
        "href": "potenzlabor.html",
        "title": "Potenz-Labor",
        "description": "Erforsche das Verhalten von Potenz- und Wurzelfunktionen. Verstehe Exponenten durch interaktive Kurvenmanipulation.",
        "tagline": "Exponenten / Wachstum / Kurvendiskussion",
        "icon": LAB_ICONS["potenzlabor"],
        "category": "grade8 grade9 hot",
        "keywords": "exponent wurzel wachstum kurvendiskussion funktion",
        "color": "blue"
    },
    {
        "id": "pythagorasbeweis",
        "href": "pythagorasbeweis.html",
        "title": "Pythagoras Beweis",
        "description": "Geometrischer Beweis des Satzes von Pythagoras. Schiebe Flächen umher, um den Zusammenhang zu visualisieren.",
        "tagline": "Quadrate / Beweis durch Zerlegung",
        "icon": LAB_ICONS["pythagorasbeweis"],
        "category": "pythagoras grade8 grade9",
        "keywords": "geometrie pythagoras beweis fläche quadrat",
        "color": "purple"
    },
    {
        "id": "pythagoras",
        "href": "pythagoras.html",
        "title": "Pythagoras",
        "description": "Entdecke den Satz des Pythagoras durch interaktive Flächenvergleiche und Beweis-Animationen.",
        "tagline": "Geometrie / Rechtwinkliges Dreieck / Beweis",
        "icon": LAB_ICONS["pythagoras"],
        "category": "pythagoras grade8 grade9",
        "keywords": "geometrie rechtwinklig dreieck fläche beweis",
        "color": "orange"
    },
    {
        "id": "steigung",
        "href": "steigung.html",
        "title": "Steigungs-Labor",
        "description": "Verstehe die Steigung an jedem Punkt einer Kurve. Die Basis für die Differentialrechnung.",
        "tagline": "Differentialrechnung / Ableitung / Tangente",
        "icon": LAB_ICONS["steigung"],
        "category": "hot grade8",
        "keywords": "steigung ableitung differentialrechnung tangente",
        "color": "purple"
    },
    {
        "id": "coordinatensystemtester",
        "href": "coordinatensystemtester.html",
        "title": "Koordinatensystem-Labor",
        "description": "Das nackte Koordinatensystem der Labore zum Anfassen: Ziehen verschiebt, das Rad zoomt, ein Rechtsklick setzt die Ansicht zurück. Achsen, Beschriftung und Telemetrie lassen sich einzeln ein- und ausschalten, und zwei Kurven zeigen, wie die Zeichenmaschine mit Steilheit und Polstelle umgeht: f(x) = −x² und g(x) = x⁻² mit ihrer Lücke bei null. Die Prüfumgebung für den Canvas-Kern, der in vielen Labs steckt.",
        "tagline": "Funktionen / Koordinatensystem / Zeichenmaschine",
        "icon": LAB_ICONS["coordinatensystemtester"],
        "category": "funktionen neu grade7 grade8 sonst",
        "keywords": "koordinatensystem koordinaten achsen ursprung x-achse y-achse gitter zoom verschieben funktion graph parabel hyperbel polstelle canvas tester werkzeug",
        "color": "blue"
    },
    {
        "id": "winkellabor",
        "href": "winkellabor.html",
        "title": "Winkel-Labor",
        "description": "Interaktive Untersuchung von Winkelsummen und Dreieckstypen in der Ebene.",
        "tagline": "Stufenwinkel / Wechselwinkel / Scheitelwinkel",
        "icon": LAB_ICONS["winkellabor"],
        "category": "grade6 grade7 dreiecke hot",
        "keywords": "geometrie winkel dreieck winkelsumme beweis",
        "color": "green"
    },
    {
        "id": "winkelpuzzle",
        "href": "winkelpuzzle.html",
        "title": "Winkel-Puzzle",
        "description": "Fünf Geraden, drei gegebene Winkel: 39°, 112° und 116° stehen in Blau an der Figur, gesucht sind α, β und γ. Wer die Lösung in Rot einblendet, sieht die Zahlen; wer die gelben Zwischenschritte dazuschaltet, sieht den Weg über Nebenwinkel, Scheitelwinkel und die Winkel im Dreieck. Vier Schieber verschieben die Punkte, der Keil verändert den ersten Winkel, und die gesuchten Winkel rechnen live mit.",
        "tagline": "Geometrie / Winkel / Neben- und Scheitelwinkel",
        "icon": LAB_ICONS["winkelpuzzle"],
        "category": "geometrie dreiecke neu grade6 grade7 grade8",
        "keywords": "winkel puzzle winkelpuzzle nebenwinkel scheitelwinkel stufenwinkel wechselwinkel winkelsumme dreieck alpha beta gamma gegebene winkel gesuchte winkel geraden schnittpunkt raetsel",
        "color": "blue"
    },
    {
        "id": "uhrzeitwinkel",
        "href": "uhrzeitwinkel.html",
        "title": "Winkel-Uhr Labor",
        "description": "Untersuche den Winkel zwischen Stunden- und Minutenzeiger zu jeder Tageszeit. Verstehe die kontinuierliche Bewegung der Zeiger.",
        "tagline": "Zeigerbewegung / Winkelberechnung",
        "icon": LAB_ICONS["uhrzeitwinkel"],
        "category": "geometrie grade5 grade6 grade7 hot",
        "keywords": "geometrie winkel uhrzeit zeiger berechnung",
        "color": "green"
    },
    {
        "id": "beweisinwinkellsumme",
        "href": "beweisinwinkellsumme.html",
        "title": "Beweis Innenwinkelsatz",
        "description": "Warum beträgt die Winkelsumme im Dreieck immer 180°? Hier kannst du den Beweis Schritt für Schritt nachvollziehen.",
        "tagline": "Interaktive Beweisführung / Schritt für Schritt",
        "icon": LAB_ICONS["beweisinwinkellsumme"],
        "category": "dreiecke grade8",
        "keywords": "geometrie dreieck problem knobeln problemloesen",
        "color": "orange"
    },
    {
        "id": "rechenrallye",
        "href": "rechenrallye/index.html",
        "title": "Rechen-Rallye",
        "description": "Ein Rennspiel fürs Kopfrechnen: erst das kleine 1⋅1 oder 1÷1 – 20 Aufgaben richtig in 2 Minuten –, dann geht es auf eine kurvige Alpenstraße in 3D. An Schilderbrücken ist die richtige Spur die Antwort, drei richtige Tore hintereinander zünden den Nitro, ab Level 3 fährt man in den Sonnenuntergang. Mit Hitliste – und einer freien Fahrt zum Ausprobieren.",
        "tagline": "Kopfrechnen / 1⋅1 und 1÷1 / 3D-Rennen",
        "icon": LAB_ICONS["rechenrallye"],
        "category": "games arithmetik neu hot grade5",
        "keywords": "rechen rallye rallye rennen rennspiel auto spiel game einmaleins einsdurcheins 1x1 kleines einmaleins teilen dividieren multiplizieren kopfrechnen quiz hitliste highscore nitro alpen 3d",
        "color": "gold"
    },
    {
        "id": "logikspiel",
        "href": "logikspiel2.html",
        "title": "Zahlen-Puzzle",
        "description": "Werde zum Meister der Matrix! Löse komplexe Zahlen-Gitter durch Addition oder Multiplikation. Ein hochmoderner Strategie-Hacker für Mathe-Profis.",
        "tagline": "Logik / Arithmetik / Matrix-Hacking",
        "icon": LAB_ICONS["logikspiel"],
        "category": "games arithmetik logik hot grade5",
        "keywords": "spiel game logik summen rätsel puzzle logic arithmetic sum grid multiplikation",
        "color": "green"
    },
    {
        "id": "integralreaktor",
        "href": "integralreaktor.html",
        "title": "Integrale",
        "description": "Die Energie der Fläche. Visualisiere bestimmte Integrale, Riemann-Summen und Näherungsverfahren in einem interaktiven Simulator.",
        "tagline": "Integralrechnung / Riemann-Summen / Flächen",
        "icon": LAB_ICONS["integralreaktor"],
        "category": "hot grade11 grade12 oberstufe analysis funktionen highlight uni",
        "keywords": "integral analysis fläche summe riemann reaktor",
        "color": "blue"
    },
    {
        "id": "fourier",
        "href": "fourier.html",
        "title": "Fourier-Transformation",
        "description": "Die Musik der Mathematik. Zerlege komplexe Formen in harmonische Kreisschwingungen und rekonstruiere sie. Verstehe die Magie der Frequenzanalyse interaktiv.",
        "tagline": "Fourier-Reihen / Harmonik / Epizykel",
        "icon": LAB_ICONS["fourier"],
        "category": "fun geometrie hot highlight grade11 grade12 uni top5",
        "keywords": "fourier musik note epicycles kreise geometrie harmonik transformation",
        "color": "blue"
    },
    {
        "id": "lissajous",
        "href": "lissajous.html",
        "title": "Lissajous",
        "description": "Überlagerung zweier harmonischer Schwingungen: Frequenzverhältnis, Phase und KaTeX-Parameter live. 2D-Kurve oder gedankliche 3D-Pendelansicht.",
        "tagline": "Harmonische Schwingungen / Parametrische Kurven",
        "icon": LAB_ICONS["lissajous"],
        "category": "fun geometrie hot highlight grade11 grade12 oberstufe uni",
        "keywords": "lissajous harmonisch schwingung frequenz phase parametrische kurve pendel figur",
        "color": "blue"
    },
    {
        "id": "cmaes",
        "href": "cmaes.html",
        "title": "Flächenoptimierung",
        "description": "CMA-ES in Echtzeit: geschlossene Polygone und Freiform-Konturen evolutionär verbessern — komplexe Geometrien, Schritt für Schritt.",
        "tagline": "CMA-ES / Evolutionäre Flächen- & Konturoptimierung",
        "icon": LAB_ICONS["cmaes"],
        "category": "hot highlight fun grade10 grade11 grade12 uni",
        "keywords": "cmaes flächenoptimierung fläche polygon geometrie evolution optimierung strategie simulation",
        "color": "green"
    },
    {
        "id": "particleswarm",
        "href": "particleswarm.html",
        "title": "Particle Swarm",
        "description": "Ein Schwarm Teilchen sucht den tiefsten Punkt einer Landschaft, und keines kennt die Karte: Jedes merkt sich seine beste Stelle, alle kennen die beste des Schwarms, und aus Trägheit, Eigensinn und Herdentrieb entsteht der nächste Schritt. Drei Landschaften stehen zur Wahl, die Parabel mit einem Tal, Himmelblau mit vier Minima und Rastrigin mit vielen Tälern, dazu Schieber für w, c₁ und c₂ und die Schwarmgröße. Rundenweise oder im Lauf sieht man, wie der Schwarm ein Tal findet, oder im falschen hängen bleibt. Kennedy und Eberhart, 1995.",
        "tagline": "Optimierung / Schwarm / PSO",
        "icon": LAB_ICONS["particleswarm"],
        "category": "uni informatik fun neu grade10 grade11 grade12",
        "keywords": "particle swarm pso partikelschwarm schwarm optimierung minimum suchen rastrigin himmelblau parabel landschaft traegheit eigensinn herdentrieb kennedy eberhart algorithmus",
        "color": "purple"
    },
    /*
     * Happy-birthday tile (Cyber-Cake): temporarily disabled — happybirthday.html remains reachable via direct URL.
    {
        "id": "happy-birthday-ulf",
        "href": "happybirthday.html?name=Ulf",
        "title": "Happy Birthday",
        "description": "Eine kosmische Glückwunsch-Site mit Feuerwerk, Konfetti und animierter Geburtstagstorte. Klick für Raketen, SPACE für das große Finale.",
        "tagline": "Konfetti / Feuerwerk / Cyber-Cake",
        "icon": LAB_ICONS["happy-birthday-ulf"],
        "category": "fun",
        "keywords": "happy birthday geburtstag glueckwunsch konfetti feuerwerk torte party celebrate ulf",
        "color": "purple"
    },
    */
    {
        "id": "galtonboard",
        "href": "galtonboard.html",
        "title": "Galton Board",
        "description": "Interaktives Nagelbrett mit 50/50-Abzweigung, sanften Kugelbahnen und stylischem Histogramm. Beobachte live, wie die Glockenkurve entsteht.",
        "tagline": "Wahrscheinlichkeit / Binomialverteilung / Simulation",
        "icon": LAB_ICONS["galtonboard"],
        "category": "fun highlight hot grade8 top5",
        "keywords": "galton board nagelbrett wahrscheinlichkeit zufall binomialverteilung histogramm simulation",
        "color": "blue"
    },
    {
        "id": "fallingpi",
        "href": "fallingpi.html",
        "title": "Falling Pi",
        "description": "Darts regnen in ein Quadrat, und der Viertelkreis darin fängt ungefähr π/4 von ihnen: Treffer im Kreis geteilt durch alle Würfe, mal vier, nähert sich π. Der Schieber regelt die Darts je Bild, ein Knopf wirft hundert auf einmal, und die Fehlerkurve zeigt, wie zäh die Näherung wird: Der Fehler fällt nur wie 1/√n, für eine Stelle mehr braucht es also hundertmal so viele Würfe. Monte Carlo, wie es das alte Java-Programm ThrowingDarts vorgemacht hat.",
        "tagline": "Stochastik / Monte Carlo / π",
        "icon": LAB_ICONS["fallingpi"],
        "category": "stochastik fun neu grade8 grade9 grade10",
        "keywords": "pi monte carlo zufall darts quadrat viertelkreis flaeche naeherung wahrscheinlichkeit simulation fehler wurzel n konvergenz zufallszahlen kreiszahl",
        "color": "orange"
    },
    {
        "id": "infektionssimulation",
        "href": "infektionssimulation.html",
        "title": "Infektionssimulation",
        "description": "Ein Gitter voller Menschen, jede Zelle eine Person, Kontakte sind die vier Nachbarn, ein Schritt ist ein Tag: Gesunde stecken sich mit einer Wahrscheinlichkeit je Kontakt an, sind eine einstellbare Zahl von Tagen ansteckend und danach immun. Vier Schieber stellen Ansteckung je Kontakt, Dauer, den Anteil vorher Immuner und die Größe der Bevölkerung ein. Die Kurve darunter zeigt den Anteil Kranker pro Tag mit markiertem Gipfel: „flatten the curve“, aus dem eigenen Lauf gezeichnet.",
        "tagline": "Stochastik / Simulation / SIR-Modell",
        "icon": LAB_ICONS["infektionssimulation"],
        "category": "stochastik fun neu grade9 grade10 grade11",
        "keywords": "infektion epidemie pandemie simulation sir modell ansteckung immun impfung herdenimmunitaet gitter zellautomat kurve gipfel flatten the curve exponentiell wachstum wahrscheinlichkeit",
        "color": "green"
    },
    {
        "id": "atomorbitale",
        "href": "orbitals.html",
        "title": "Atomorbitale",
        "description": "Kugelflächenfunktionen Y_ℓ^m in 3D: Kugelfläche und optionale |Y|²-Punktwolke, KaTeX-Formeln, Orbitwechsel. Cyber-Lab-Optik, Trackball, Auto-Rotation.",
        "tagline": "Kugelflächen / Harmonische / 3D",
        "icon": LAB_ICONS["atomorbitale"],
        "category": "highlight hot grade11 grade12 oberstufe fun uni top5",
        "keywords": "atom orbital kugelflächenfunktion kff harmonische ylm wahrscheinlichkeit 3d quanten chemie physik d orbital",
        "color": "blue"
    },
    {
        "id": "opti-lens",
        "href": "LensStandalone/cmaes_java.html",
        "title": "Linsenoptimierung",
        "description": "Labor zur evolutionären Linsenoptimierung (CMA-ES): Symmetriemodus, oszillierender Brennpunkt, Echtzeit-Strahlsimulation und Maus-Zoom in einer eigenständigen Hochleistungs-Oberfläche.",
        "tagline": "Strahlenoptik / Brennpunkt / Evolution",
        "icon": LAB_ICONS["opti-lens"],
        "category": "hot highlight fun grade10 grade11 grade12 uni top5",
        "keywords": "linse linsenoptimierung optik strahlen brennpunkt cmaes evolution standalone symmetrie refraktion",
        "color": "blue"
    },
    {
        "id": "cool-squares",
        "href": "coolsquares.html",
        "title": "Cool Squares",
        "description": "Der ultimative geometrische Beweis. Verfolge die Spirale der Quadrate und entdecke, warum die Variable x am Ende keine Rolle spielt. Ein visuelles Aha-Erlebnis.",
        "tagline": "Geometrie / Algebra / Spirale",
        "icon": LAB_ICONS["cool-squares"],
        "category": "fun highlight geometrie hot grade7 grade8",
        "keywords": "geometrie quadrat beweis spirale fläche algebra x a cool squares squares",
        "color": "blue"
    },
    {
        "id": "fibonacci",
        "href": "fibonacci.html",
        "title": "Fibonacci-Labor",
        "description": "Erkunde die goldene Spirale und die Fibonacci-Folge. Visualisiere das organische Wachstum durch Quadrate und Viertelkreise in einer interaktiven Unendlichkeitsschleife.",
        "tagline": "Goldener Schnitt / Organisches Wachstum",
        "icon": LAB_ICONS["fibonacci"],
        "category": "fun highlight geometrie hot grade8",
        "keywords": "fibonacci spirale goldener schnitt wachstum quadrat folge unendlichkeit",
        "color": "orange"
    },
    {
        "id": "collatz",
        "href": "collatz.html",
        "title": "Collatz",
        "description": "Gerade halbieren, ungerade mal drei plus eins: Jede je geprüfte Startzahl landet bei 1, beweisen kann es niemand. Oben der Weg einer Zahl auf logarithmischer Skala, rot die ungeraden, grün die geraden Schritte, und „Weg ablaufen“ lässt ihn Schritt für Schritt entstehen. Unten die Länge des Weges für alle Starts bis N, „Härtester Start“ springt zu der Zahl, die am längsten braucht. Zwei Schieber: die Startzahl und die Grenze N.",
        "tagline": "Zahlen / Folgen / 3n + 1",
        "icon": LAB_ICONS["collatz"],
        "category": "arithmetik fun neu grade7 grade8 grade9 grade10",
        "keywords": "collatz vermutung 3n+1 folge ulam syracuse hagelkorn zahlen gerade ungerade halbieren schritte laengster weg zahlentheorie",
        "color": "green"
    },
    {
        "id": "mandelbrot-deep",
        "href": "mandelbrot.html",
        "title": "Fraktale",
        "description": "Mandelbrot- und Julia-Mengen in der komplexen Ebene: Escapingzeit-Dynamik der Abbildung z↦z²+c als GPU-gestützte Iteration im Fragment-Shader; parametrisierte Exploration von c mit adaptiver Iterationstiefe entlang der fraktalen Randstruktur.",
        "tagline": "Komplexe Dynamik · Escapingzeit · Julia/Mandelbrot",
        "icon": LAB_ICONS["mandelbrot-deep"],
        "category": "fraktale highlight hot grade11 grade12 oberstufe uni top5",
        "keywords": "mandelbrot julia fractal escapingzeit komplexe ebene webgl dynamik chaos grenzmenge zoom flight",
        "color": "purple"
    },
    {
        "id": "fermatpunkt",
        "href": "fermatpunkt.html",
        "title": "Fermat-Punkt",
        "description": "Finde den Punkt, dessen Abstandssumme zu den Ecken eines Dreiecks minimal ist. Beweise, dass F das absolute Strecken-Minimum bildet.",
        "tagline": "Kürzeste Netze / Geometrische Optimierung",
        "icon": LAB_ICONS["fermatpunkt"],
        "category": "highlight dreiecke geometrie hot grade8",
        "keywords": "fermat punkt geometrie dreieck abstand minimierung netz kürzeste wege",
        "color": "purple"
    },
    {
        "id": "gleichungssysteme",
        "href": "gleichungssysteme.html",
        "title": "LGS Labor",
        "description": "Erkunde Lineare Gleichungssysteme visuell. Ziehe Geraden, beobachte die Formeln in Echtzeit und scrambele die Notation für echte Gehirn-Akrobatik.",
        "tagline": "Schnittpunkte / Lineare Algebra",
        "icon": LAB_ICONS["gleichungssysteme"],
        "category": "highlight lgs geometrie hot grade8",
        "keywords": "lgs gleichungssystem schnittpunkt geraden algebra mathe",
        "color": "green"
    },
    /* {
        "id": "imaginarynumbers",
        "href": "imaginarynumbers/index.html",
        "title": "Imaginary numbers",
        "description": "Komplexe Zahlen in der Gaußschen Zahlenebene: Realteil, Imaginärteil und die imaginäre Einheit — interaktiv erkunden (Ausbau folgt).",
        "tagline": "Komplexe Ebene · Re / Im · i",
        "icon": LAB_ICONS["imaginarynumbers"],
        "category": "algebra highlight grade10 grade11 grade12 oberstufe uni",
        "keywords": "komplexe zahlen imaginaerteil reell imaginary complex plane gauss i",
        "color": "blue"
    }, */
    /* Solita: war privat; seit 2026-08-09 auf Docs GO als App verlinkt (Passwort-Gate in der App). */
    {
        "id": "solita",
        "href": "solita.html",
        "title": "Solita",
        "description": "Solita — deine persönliche Sprach-Assistentin (Claude) im Doc Alvers Mathe-Labor. Reden, vorlesen, Kontext behalten.",
        "tagline": "weiß alles, bleibt nah",
        "icon": LAB_ICONS["solita"],
        "category": "apps",
        "keywords": "solita ai ki assistent sprache voice chat claude vorlesen weckwort",
        "color": "blue"
    },
    {
        "id": "solita-avatar",
        "href": "solita-avatar.html",
        "title": "Solita Avatar",
        "description": "Solitas Kopf in 3D, der beim Sprechen die Lippen bewegt: Text eintippen, Sprechen drücken, und die Mundstellungen werden Wort für Wort nachgeführt, sobald das Wort tatsächlich gesprochen wird, interpoliert statt getauscht, deshalb ohne Ruckeln. Stimmung und Kameraansicht schalten per Knopf durch. Die Stimme kommt hier aus dem Browser, alles läuft lokal ohne Server; die echte Stimme gibt es in Solita Live.",
        "tagline": "Solita / 3D-Kopf / Lippen",
        "icon": LAB_ICONS["solita-avatar"],
        "category": "apps neu",
        "keywords": "solita avatar kopf 3d lippen mund viseme sprechen stimmung ansicht sprachsynthese browserstimme lokal",
        "color": "gold"
    },
    {
        "id": "gameoflife",
        "href": "gameoflife/gameoflife.html",
        "title": "Game of Life",
        "description": "Conways zellulärer Automat: Aus drei simplen Regeln entstehen Gleiter, Oszillatoren und ganze Welten. Zeichne Startmuster und sieh zu, wie Ordnung und Chaos sich abwechseln.",
        "tagline": "Zellulärer Automat / Emergenz",
        "icon": LAB_ICONS["gameoflife"],
        "category": "fun logik grade8 grade9",
        "keywords": "game of life conway zellulärer automat gleiter glider emergenz simulation muster regeln",
        "color": "green"
    },
    {
        "id": "burningship",
        "href": "burningship.html",
        "title": "Burning Ship",
        "description": "Das dunkle Schwesterfraktal der Mandelbrot-Menge: Ein einziger Betrag in der Iterationsformel lässt brennende Schiffe am Horizont erscheinen. Zoome in die flammende Struktur.",
        "tagline": "Fraktale / Komplexe Dynamik",
        "icon": LAB_ICONS["burningship"],
        "category": "fraktale hot uni grade11 grade12",
        "keywords": "burning ship fraktal mandelbrot komplexe zahlen iteration escape time zoom",
        "color": "orange"
    },
    {
        "id": "reaction-diffusion",
        "href": "reaction-diffusion.html",
        "title": "Reaction-Diffusion",
        "description": "Turing-Muster live: Zwei Chemikalien reagieren und diffundieren — heraus kommen Streifen, Punkte und Korallen wie auf Tierfellen. Stelle Zufuhr und Zerfall ein und züchte eigene Muster.",
        "tagline": "Turing-Muster / Gray-Scott",
        "icon": LAB_ICONS["reaction-diffusion"],
        "category": "fun hot uni grade11 grade12",
        "keywords": "reaction diffusion turing muster gray scott simulation chemie pattern streifen punkte",
        "color": "purple"
    },
    {
        "id": "shell",
        "href": "shell.html",
        "title": "Shell",
        "description": "Wie entsteht das Muster auf einer Meeresschnecke? In sechs Kapiteln wird der Mechanismus einzeln aufgebaut: Das Bild ist ein Protokoll \u2014 eine Zelle steckt an und schreibt ein V \u2014 zwei Wellen l\u00f6schen sich aus und schneiden die Zeltspitze \u2014 das aufgezehrte Substrat erkl\u00e4rt, warum. Oben lebt die M\u00fcndungskante mit Aktivator und Substrat, darunter w\u00e4chst die Schale. Mit Einzelschritt-Taste.",
        "tagline": "Musterbildung / Schritt f\u00fcr Schritt",
        "icon": LAB_ICONS["shell"],
        "category": "fun physik neu uni grade11 grade12",
        "keywords": "shell muschel schnecke schale muster pigment mechanismus aktivator substrat meinhardt wellen zelte zickzack ausloeschung raum zeit diagramm wachstumslinie biologie kapitel",
        "color": "green"
    },
    {
        "id": "conuslab",
        "href": "conuslab.html",
        "title": "Conus",
        "description": "Warum tr\u00e4gt eine Kegelschnecke Zickzack und Zelte? Die Schale w\u00e4chst nur an der M\u00fcndungskante \u2014 eine einzige Zellreihe entscheidet \u201ePigment ja/nein\u201c, und jede Wachstumslinie bleibt f\u00fcr immer stehen. Das Muster ist also ein Raum-Zeit-Diagramm. Hier l\u00e4uft es live: wandernde Pigmentwellen, die beim Zusammensto\u00df ausl\u00f6schen und dabei die Zelte schneiden \u2014 daneben derselbe Effekt als zellul\u00e4rer Automat (Regel 30).",
        "tagline": "Musterbildung / Meinhardt",
        "icon": LAB_ICONS["conuslab"],
        "category": "fun physik informatik neu uni grade11 grade12",
        "keywords": "conus kegelschnecke muschel schale muster pigment meinhardt aktivator substrat reaction diffusion wellen zelte zickzack zellulaerer automat regel 30 wolfram biologie",
        "color": "gold"
    },
    {
        "id": "gravitation",
        "href": "gravitation.html",
        "title": "Gravitation",
        "description": "Newtons Gravitationsgesetz zum Anfassen: Setze Massen ins All, gib ihnen Startgeschwindigkeit und beobachte Bahnen, Einfänge und Kollisionen im Mehrkörper-Tanz.",
        "tagline": "Physik / Mehrkörperproblem",
        "icon": LAB_ICONS["gravitation"],
        "category": "fun physik grade9 grade10",
        "keywords": "gravitation newton schwerkraft orbit planet bahn mehrkörper simulation physik masse",
        "color": "blue"
    },
    {
        "id": "glocken",
        "href": "glocken/glocken.html",
        "title": "Die Glocken von Bagdad",
        "description": "Wann schlagen alle Glocken gleichzeitig? Eine Geschichte aus Bagdad führt zum kleinsten gemeinsamen Vielfachen — mit Tutor, der Schritt für Schritt zu kgV und Brüchen begleitet.",
        "tagline": "Arithmetik / kgV mit Tutor",
        "icon": LAB_ICONS["glocken"],
        "category": "arithmetik fun grade5 grade6",
        "keywords": "glocken bagdad kgv kleinstes gemeinsames vielfaches brüche teiler tutor quest",
        "color": "gold"
    },
    {
        "id": "langley",
        "href": "lenglay.html",
        "title": "Langley-Labor",
        "description": "Langleys berüchtigtes Winkelrätsel von 1922: Ein gleichschenkliges Dreieck, zwei innere Linien — und ein Winkel, der die Welt seit 100 Jahren ärgert. Miss, probiere, beweise.",
        "tagline": "Geometrie / Adventitious Angles",
        "icon": LAB_ICONS["langley"],
        "category": "geometrie dreiecke grade8 grade9",
        "keywords": "langley winkel dreieck rätsel geometrie beweis adventitious angles 80 20",
        "color": "green"
    },
    {
        "id": "batman",
        "href": "batman.html",
        "title": "Batman-Kurve",
        "description": "Eine einzige Gleichung, die als Graph das Batman-Logo zeichnet: Beträge, Wurzeln und Fallunterscheidungen als Superhelden-Mathematik. Zerlege die Formel Stück für Stück.",
        "tagline": "Funktionen / Implizite Kurven",
        "icon": LAB_ICONS["batman"],
        "category": "fun funktionen grade10 grade11",
        "keywords": "batman kurve gleichung graph implizit betrag wurzel funktion logo",
        "color": "blue"
    },
    {
        "id": "worldclock",
        "href": "worldclock/worldclock.html",
        "title": "Weltuhr",
        "description": "Die Erde als Uhr: Zeitzonen, Sonnenstand und Tag-Nacht-Grenze live auf der Weltkarte. Sieh, wo gerade die Sonne aufgeht, während bei uns Mitternacht schlägt.",
        "tagline": "Zeitzonen / Astronomie",
        "icon": LAB_ICONS["worldclock"],
        "category": "fun grade5 grade6",
        "keywords": "weltuhr zeitzonen erde sonne tag nacht terminator karte uhrzeit utc",
        "color": "blue"
    },
    {
        "id": "tracker",
        "href": "tracker/index.html",
        "title": "Doc Alvers Tracker",
        "description": "GPS-Tracking als Web-App: Touren aufzeichnen mit Höhenprofil, Foto-, Voice- und Wissens-Wegpunkten, Regenradar und Live-Sharing. Läuft im Browser und als Android-App.",
        "tagline": "GPS / Touren & Wegpunkte",
        "icon": LAB_ICONS["tracker"],
        "category": "apps",
        "keywords": "tracker gps tour wandern aufzeichnen karte höhenprofil wegpunkte foto radar android app",
        "color": "green"
    },
    {
        "id": "kaimbo",
        "href": "kaimbo/kaimbo.html",
        "title": "Kaimbo Studio",
        "description": "Sprachenlernen mit eigenen Aufgabenlisten: Vokabeln und Sätze als Aufgaben-Serien organisieren, filtern und trainieren — das Studio zu Docs Sprachlern-Werkzeug, jetzt im Browser.",
        "tagline": "Sprachen / Aufgaben-Studio",
        "icon": LAB_ICONS["kaimbo"],
        "category": "apps",
        "keywords": "kaimbo sprachen lernen vokabeln aufgaben training studio languages app",
        "color": "gold"
    },
    {
        "id": "pagode",
        "href": "pagode/index.html",
        "title": "Pagode (230 SL)",
        "description": "Ein Mercedes 230 SL von 1964 trifft Bluetooth: Motor per Funk starten, Kanäle testen, interaktiver Schaltplan — und Solita lernt fahren. Oldtimer-Elektrik mit KI-Fernsteuerung.",
        "tagline": "Oldtimer / BLE-Fernsteuerung",
        "icon": LAB_ICONS["pagode"],
        "category": "apps",
        "keywords": "pagode 230sl mercedes oldtimer ble bluetooth fernsteuerung motor start schaltplan auto app",
        "color": "gold"
    },
    {
        "id": "voicerecorder",
        "href": "voicerecorder/index.html",
        "title": "Voice Recorder",
        "description": "Aufnehmen und live transkribieren: Sprich — er hört zu, schreibt mit und speichert. Im Browser per Web Speech API, als Android-App mit nativer Spracherkennung.",
        "tagline": "Audio / Live-Transkription",
        "icon": LAB_ICONS["voicerecorder"],
        "category": "apps",
        "keywords": "voice recorder aufnahme diktat transkription sprache mikrofon audio notiz app",
        "color": "orange"
    },
    {
        "id": "stimmklon",
        "href": "stimmklon.html",
        "title": "Stimmklon",
        "description": "Das Studio für Docs Stimmklon: Ein Text zum Erzählen, nicht zum Vorlesen, wird am Mikrofon aufgenommen; Pegelanzeige und automatische Aussteuerung sorgen dafür, dass eine stille Aufnahme nicht unbemerkt bleibt, und ein Balken zeigt, ob die Referenz von 10 bis 30 Sekunden steht. Danach der Vergleich zum selben Text: Original, Klon und Klon mit angehobenen Höhen, dazu die Spektren als Bild und ihre Differenz, rot, wo Doc lauter ist. Die Aufnahmen landen über den lokalen Server auf der Platte, die Seite arbeitet also nur lokal.",
        "tagline": "Werkzeug / Stimme / Klon",
        "icon": LAB_ICONS["stimmklon"],
        "category": "apps neu",
        "keywords": "stimmklon stimme klon aufnahme recording mikrofon roede pegel aussteuerung referenz spektrum differenz vergleich hoehen tts sprachsynthese studio",
        "color": "gold"
    },
    {
        "id": "handschrift",
        "href": "handschrift.html",
        "title": "Handschrift",
        "description": "Handgeschriebene Seiten in Text verwandeln: Bild hineinziehen, einfügen oder aus der Seitenleiste wählen, dann liest ein Vision-Modell die Seite streifenweise ab und gibt den Text wörtlich wieder, ohne zu korrigieren, ohne zu ergänzen, Unleserliches als [?]. Modell und Streifen pro Seite sind einstellbar, das Ergebnis lässt sich kopieren oder als .txt sichern. Braucht ein lokal laufendes Ollama, arbeitet also auf dem eigenen Rechner und schickt nichts ins Netz.",
        "tagline": "Werkzeug / KI / Transkription",
        "icon": LAB_ICONS["handschrift"],
        "category": "apps neu",
        "keywords": "handschrift transkription transkribieren ocr ollama vision modell lokal text erkennen scan seite streifen txt werkzeug",
        "color": "green"
    },
    {
        "id": "mathtrainer",
        "href": "mathtrainer/mathtrainer.html",
        "title": "MathTrainer",
        "description": "Mathe trainieren mit Aufgaben-Serien: Kopfrechnen und Schulaufgaben üben, Serien auswählen, Tempo steigern — School is cool. Der SchoolTrainer als Web-App.",
        "tagline": "Training / Aufgaben-Serien",
        "icon": LAB_ICONS["mathtrainer"],
        "category": "apps",
        "keywords": "mathtrainer schooltrainer mathe training üben aufgaben serien kopfrechnen schule app",
        "color": "blue"
    },
    /* Live tours (js/cyber-tour.js): hub tile "Touren" on index.html. A new tour gets its card here. */
    {
        "id": "tour-wuerfelspiel",
        "href": "tours/wuerfelspiel.html",
        "title": "Tour: F\u00fcnf von neun",
        "description": "Live-Tour durch das W\u00fcrfelspiel-Lab: Solita f\u00fchrt mit Stimme, Cursor und Untertiteln vom ersten Wurf \u00fcber Baumdiagramm, Pfad- und Summenregel bis zu Efrons nicht-transitiven W\u00fcrfeln \u2014 das echte Lab l\u00e4uft dabei live im Browser. 24 Szenen, etwa 10 Minuten, jederzeit anhalten und selbst ausprobieren.",
        "tagline": "Live-Tour / Stochastik / Baumdiagramm",
        "icon": LAB_ICONS["wuerfelspiel"],
        "category": "touren",
        "keywords": "tour touren live-tour rundgang fuehrung solita stimme untertitel wuerfelspiel wuerfel baumdiagramm pfadregel summenregel efron fuenf von neun",
        "color": "green"
    },
    {
        "id": "tour-mission-control",
        "href": "tours/mission-control.html",
        "title": "Tour: Die ganze Klasse im Blick",
        "description": "Live-Tour durch Mission Control: einen Online-Test live begleiten \u2014 vom Zettel mit QR-Code \u00fcber Status, Verlassen und den roten Knopf bis zur Abgabe und Auswertung. Solita erkl\u00e4rt mit Stimme und Untertiteln; gespielt wird mit einer Vorf\u00fchr-Klasse im Browser, ganz ohne echte Daten. Etwa 3 Minuten.",
        "tagline": "Live-Tour / Online-Test / Mission Control",
        "icon": LAB_ICONS["tour-mission-control"],
        "category": "touren",
        "keywords": "tour touren live-tour rundgang fuehrung solita stimme untertitel mission control online-test leistungstest klasse qr zettel roter knopf abgabe auswertung lehrer",
        "color": "blue"
    },
    {
        "id": "tour-vorrechnen",
        "href": "tours/vorrechnen.html",
        "title": "Tour: Die Klasse sagt, wo es hakt",
        "description": "Live-Tour durch Vorrechnen: links die Tafel, wie die Klasse sie vorne sieht, rechts Mission Control mit allem drum und dran, dazu ein Fon mit dem Buzzer. Vom QR-Code an der Tafel über „nicht verstanden“ per Tipp, die Zahl hinter der Zeile, „zu schnell“ und Kommentare bis zur echten Handschrift, die zur Formel wird, Solita, die an der Tafel antwortet, und der Wiederholung. Gespielt wird mit einer Vorführ-Klasse im Browser, ganz ohne echte Daten. 13 Szenen, etwa 6 Minuten.",
        "tagline": "Live-Tour / Vorrechnen / Buzzer",
        "icon": LAB_ICONS["vorrechnen"],
        "category": "touren",
        "keywords": "tour touren live-tour rundgang fuehrung solita stimme untertitel vorrechnen tafel beamer mission control buzzer feedback anonym nicht verstanden qr zu schnell kommentar handschrift erklaerung wiederholung lehrer",
        "color": "blue"
    },
    {
        "id": "tour-maya",
        "href": "tours/maya.html",
        "title": "Tour: Punkt, Strich, Muschel",
        "description": "Live-Tour durch das Maya-Rechenbrett, gesprochen von Doc Alvers (KI-Stimmklon), mit Cursor und Untertiteln: die zwanzig Ziffern aus Punkt, Strich und Muschel, Ziffern legen, der Übertrag von 59 auf 60, eine Zahl eintippen, Würfelaufgaben, Kalender oder reine Zwanzig und die Schreibweise hochkant. Das echte Lab läuft dabei live im Browser. 12 Szenen, etwa 3 Minuten, jederzeit anhalten und selbst ausprobieren.",
        "tagline": "Live-Tour / Zahlensysteme / Maya",
        "icon": LAB_ICONS["maya"],
        "category": "touren",
        "keywords": "tour touren live-tour rundgang fuehrung doc alvers stimme stimmklon avatar untertitel maya mayazahlen zahlensystem stellenwert basis 20 punkt strich muschel null uebertrag kalender hochkant",
        "color": "gold"
    },
    {
        "id": "tour-trigonometrie",
        "href": "tours/trigonometrie.html",
        "title": "Tour: Vom Dreieck zur Welle",
        "description": "Live-Tour durch das Trigonometrie-Lab: Solita führt mit Stimme, Cursor und Untertiteln durch alle elf Kapitel — vom rechtwinkligen Dreieck über Einheitskreis und Bogenmaß, die Sinuskurve, die aus dem Kreis abrollt, Gleichungen, Parameter mit Rätsel und die Tageslänge in Dresden bis zu Tangens, Sinussatz und Ableitung. Das echte Lab läuft dabei live im Browser. 12 Szenen, etwa 4½ Minuten, jederzeit anhalten und selbst ausprobieren.",
        "tagline": "Live-Tour / Trigonometrie / 11 Kapitel",
        "icon": LAB_ICONS["trigonometrie"],
        "category": "touren",
        "keywords": "tour touren live-tour rundgang fuehrung solita stimme untertitel trigonometrie sinus kosinus tangens einheitskreis bogenmass sinuskurve gleichung parameter raetsel tageslaenge dresden sinussatz ableitung dreieck welle",
        "color": "gold"
    },
    {
        "id": "tour-kreisteilung",
        "href": "tours/kreisteilung.html",
        "title": "Tour: Und dann 31",
        "description": "Live-Tour durch das Kreisteilungs-Lab, noch ohne Stimme: Kapitelzeile und Cursor führen von zwei Punkten und einer Sehne über das Verdoppeln 1, 2, 4, 8, 16 zum Bruch bei 31, dann zu regelmäßig oder frei gesetzten Punkten, den Ansichten, den Nummern der Flächen, dem Abspielen und zuletzt zur Formel. Das echte Lab läuft dabei live im Browser. 9 Szenen, jederzeit anhalten und selbst ausprobieren; die gesprochene Fassung kommt nach dem Dreh.",
        "tagline": "Live-Tour / Geometrie / Kreisteilung",
        "icon": LAB_ICONS["kreisteilung"],
        "category": "touren",
        "keywords": "tour touren live-tour rundgang fuehrung kreisteilung kreis sehnen flaechen regionen folge vermutung 31 moser stumm ohne stimme",
        "color": "gold"
    },
    {
        "id": "costablanca",
        "href": "tracker/costablanca.html",
        "title": "Highlights Costa Blanca",
        "description": "Costa-Blanca-Ausflüge zum Abhaken: 22 recherchierte Ziele von Altea bis Valencia mit Fotos, Insider-Tipps und Fortschrittsbalken — in vier Sprachen (DE/EN/ES/IT).",
        "tagline": "Reise / Ausflugs-Checkliste",
        "icon": LAB_ICONS["costablanca"],
        "category": "sonst",
        "keywords": "costa blanca altea calpe checkliste ausflüge reise spanien highlights urlaub",
        "color": "orange"
    }
];
