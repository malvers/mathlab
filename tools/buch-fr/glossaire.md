# Glossaire — the French editions (BGY 11, 12, 13, FOS 11, FOS 12)

Package FR0, 22.10.2026. Every recurring term of the five books, decided once in French for `mathe11-fr`, `mathe12-fr`,
`mathe13-fr`, `mathefos11-fr` and `mathefos12-fr` (from the Italian `tools/buch-it/glossario.md`, sections 1–5, and the
blocks of the same books there). Standard French of France, the pupil is **tu**, real accents and ligatures
(é è ê à â ç ô û î ï œ), the apostrophe is ’. A book that needs a missing term adds it in its own block at the end
(`## mathe11-fr` …, right below the `<!-- fr-N … -->` line); an existing line is never changed without saying so in the
report.

Columns: German · French · note. In headings (`b-band-tag`, `b-box-title`, kickers) the French goes in capitals with the
accents kept (`CHAPITRE`, `LEÇON`, `À RETENIR`, `ŒIL`), as Orbitron draws them.

**French typography** (pages and dictionaries): a no-break space U+00A0 — the character itself, not `&nbsp;` — before
`: ; ! ?` and inside « ». Never inside `$…$`. Ellipsis without a space before: `Je t’écoute…`. Ordinals `11e`, `1re`, `2e`
(plain letters, no `<sup>`: wrap.py compares the tags with the German chapter).

## 1. The book and its parts

| German | French | Note |
|---|---|---|
| Interaktives Lehrbuch | Manuel interactif | kicker: MANUEL INTERACTIF · SAXE |
| Mathematik · Berufliches Gymnasium 11 | Mathématiques · Berufliches Gymnasium 11 | `short`: Mathématiques 11; FOS: Mathématiques · Fachoberschule 11 |
| Deutsche Ausgabe · English edition · Edición española · Edizione italiana | Édition allemande · English edition · Edición española · Edizione italiana | buttons on the start page; the other three stay in their language. On the DE/EN/ES/IT start pages: «Édition française» |
| Titelseite | Couverture | data-toc; data-toc-short: Début |
| Inhalt | Sommaire | letter S; "← SOMMAIRE", "Tous les chapitres" |
| So arbeitest du mit dem Buch | Comment utiliser ce manuel | data-toc: Comment utiliser le manuel; short: Mode d’emploi |
| Kapitel | Chapitre | "CHAPITRE 3.2" |
| Lernbereich (LB) | Domaine d’apprentissage | "Domaine d’apprentissage 3"; in running text lower case |
| Wahlbereich | Domaine optionnel | "Domaine optionnel 3" (BGY 11, FOS) |
| Wahlpflicht | Domaine au choix | "Domaine au choix 1" (BGY 13) |
| Kapitel W, W.1 (chapter number) | OP, OP.1 | as in Spanish and Italian; not "O" (O and 0 look alike in Orbitron) |
| Kapitel A (Abitur), E (Ausblicke) | A, E | the letters stay |
| Abitur | Abitur | stays; explained once on the start page: l’examen de fin d’études secondaires, comme le baccalauréat |
| Ustd. (Unterrichtsstunden) | heures | "20 HEURES" in the chapter list (js/buch.js) |
| Klausur | devoir surveillé | chips: DEVOIR SURVEILLÉ 1 |
| Klassenarbeit | contrôle | |
| Klasse 11 | 11e année | "de la 11e à la 13e année"; not "classe de première" (a different school) |
| Schuljahr 2026/27 | année scolaire 2026/27 | |
| Sachsen, sächsisch | Saxe, de Saxe | "le programme de mathématiques de la Saxe" |
| Lehrplan | programme | |
| Stoffverteilungsplan | progression annuelle | |
| Arbeitsblatt, Wochenquiz | fiche d’exercices, quiz de la semaine | stay German: "(en allemand)" once where linked |
| Lab | laboratoire | "Les laboratoires s’ouvrent dans un nouvel onglet" |
| Fehler melden | Signaler une erreur | header; dictation fr-FR, finish word "j’ai fini" |
| Seiten (overview) | Pages | header pill, only with a print edition (none in French) |
| Berufliches Gymnasium | Berufliches Gymnasium | stays; start page: un lycée allemand à orientation professionnelle, trois années, de la 11e à la 13e |
| Fachoberschule (FOS) | Fachoberschule | stays; start page: un lycée technique allemand de deux ans (11e et 12e année) |
| Fachhochschulreife (FHR) | Fachhochschulreife | stays; start page: le diplôme qui ouvre l’accès aux universités de sciences appliquées (Fachhochschulen) |

The start page of `mathe11-fr` is the pattern: *Le Berufliches Gymnasium est un lycée allemand à orientation
professionnelle : trois années, de la 11e à la 13e, qui mènent à l’Abitur, l’examen de fin d’études secondaires qui ouvre
l’accès à l’université, comme le baccalauréat.*

## 2. The sections of a chapter

| German | French | Note |
|---|---|---|
| Auftakt | Introduction | data-toc, letter I |
| Das lernst du in diesem Kapitel | Ce que tu vas apprendre dans ce chapitre | box title |
| Check-in: Das kannst du schon? | Check-in : sais-tu déjà le faire ? | |
| Erkundungen | Explorations | letter E |
| Lerneinheit 3 | Leçon 3 | band "LEÇON 3" |
| Einstieg | Pour commencer | |
| Merke / Merkkasten | À retenir / encadré « À retenir » | box title "À RETENIR" |
| Beispiel 2 | Exemple 2 | "EXEMPLE 2 · LA CANETTE" |
| Zum Beispiel | Par exemple | |
| Interaktiv | Interactif | |
| Teste dich! | Teste-toi ! | |
| Aufgaben | Exercices | |
| Wiederholen · Vertiefen · Vernetzen | Réviser · Approfondir · Relier | data-toc-short (Üben): S’entraîner, letter S |
| Exkursion | Excursion | letter X |
| Rückblick | Bilan | data-toc, band, letter B |
| Zum Wiederholen | Pour réviser | |
| Test | Test | letter T |
| Runde 1 · ohne Hilfsmittel | Partie 1 · sans calculatrice | "Hilfsmittel" = calculatrice et formulaire |
| Runde 2 · mit Hilfsmitteln | Partie 2 · avec outils numériques | |
| OHNE HILFSMITTEL / MIT HILFSMITTELN (chip, band) | SANS CALCULATRICE / AVEC OUTILS NUMÉRIQUES | |
| Zwei Runden · Rückmeldung sofort | DEUX PARTIES · CORRECTION IMMÉDIATE | |
| Gebiet 1 (abi) | Bloc 1 | |
| Tipp | Indice | button |
| Lösung / Lösung zeigen | Solution / Voir la solution | buttons |
| Ergebnis | Résultat | self-check label |
| Prüfen | Vérifier | |
| richtig | correct | "✓ correct" |
| noch nicht – versuch es noch einmal | pas encore – réessaie | |
| noch nicht – schau dir die Lösung an | pas encore – regarde la solution | |
| z. B. 3/10 | p. ex. 3/10 | placeholder |
| gelöst | résolus | "5 RÉSOLUS" |
| ← Zurück · Kapitel / Weiter → | ← PRÉCÉDENT · CHAPITRE / SUIVANT → | chapter cards |
| Zurücksetzen / Zurück (undo) | Réinitialiser / Annuler | widgets |
| Selbsttest | autoévaluation | "192 AUTOÉVALUATIONS" |
| Mehr üben online | S’ENTRAÎNER EN LIGNE (EN ALLEMAND) | the linked material stays German |
| Das Wichtigste auf einen Blick | L’ESSENTIEL EN UN COUP D’ŒIL | |
| Zum Weiterdenken · Ausblick | POUR ALLER PLUS LOIN · PERSPECTIVES | |
| Methode, Methodenbewusstsein · Denk mit | MÉTHODE, CONSCIENCE DE LA MÉTHODE · RÉFLÉCHIS AVEC NOUS | |
| Projekt | Projet | |
| BNE (Bildung für nachhaltige Entwicklung) | ÉDUCATION AU DÉVELOPPEMENT DURABLE | chip |
| Anschluss an … · Eingangstest | Lien avec … · test d’entrée | |
| Checkliste, Abituraufgabe, Abschlusstest | liste de contrôle, exercice d’Abitur, test final | |
| Operatoren (berechne, begründe …) | verbes de consigne (« calcule », « justifie » …) | |
| Folgefehler | erreur reportée | the follow-on error is not counted twice |

## 3. Levels

| German | French |
|---|---|
| Niveau | Niveau |
| Grundlage | Base |
| Mittel | Intermédiaire |
| Anspruchsvoll | Avancé |

## 4. Numbers, notation, tools

- **Numbers like German:** decimal comma `0,5` (TeX `0{,}5`); `data-ans` exactly as in the German book. Thousands in the
  page text with a no-break space `10 000` (TeX `10\,000`), never a point. Percent with a no-break space: `30 %`
  (TeX `30\,\%`). What a widget writes keeps its German form (`10.000`): no rule may touch digits around a point or a comma.
- **Points and intervals, the French school way, always a semicolon:**
  - in TeX a thin space on both sides: `A(2\,;\,3)`, `P(1{,}5\,;\,2)`, `S(x\,;\,f(x))`, `A(1\,;\,2\,;\,3)`, intervals
    `[0\,;\,1]`, `]a\,;\,b[`, `[0\,;\,+\infty[`, `]-\infty\,;\,2]`; the German `S(1 \mid 2)` and `[1;\,2]` never stay;
  - in plain text (tables, labels, canvas): `A(2 ; 3)` with a no-break space before the semicolon and a normal space after;
  - lists in braces: `\{1\,;\,2\,;\,3\}`, `S = \{2\,;\,3\}`; a set-builder keeps its bar: `\{x \in \mathbb{R} \mid x \geq 0\}`;
  - vectors: column vectors `\begin{pmatrix}…\end{pmatrix}` as in the German book; a row vector is written as a point.
- **What the engine does (`js/buch-fr.js`) with what the widgets write:** every `\mid` becomes `\,;\,` — whatever the
  coordinates are, also `Q(x \mid f(x))` and `S\left(-\tfrac{a}{2} \mid …\right)` — except inside a set `\{ … \}` of the same
  formula; `[1;\,2]` → `[1\,;\,2]` (also `]…[` and half-open); the coordinate inputs of `js/buch-vektoren.js` get `;`
  instead of `|` (rule in `js/buch-fr/vektoren.js`); `$L = \{…\}$`, `$L = \mathbb{R}$` → `$S = …$` (rule in
  `js/buch-fr/gleichungen.js`). Sets of outcomes that a widget writes (`\{1;\,2\}`) keep their German spacing.
- **Order inside the engine:** a `word` is looked up first, on the German as the widget writes it (keep `\mid` in a word
  key, write the French value with `\,;\,`); then the rules run (the point rules above first, then the rules of the
  module files, then the header rules), and only then the `phrase` pieces: a phrase key that contains a point must
  already have the `\,;\,` form. The header rule `^Zu ` → `Concernant ` hits every plain string that starts with "Zu ":
  such a sentence must be a word.
- Months in lower case in running text (`septembre`, `octobre · novembre`, `fin septembre`); in `kapitel.js` with a
  capital (shown in capitals anyway).
- `sin x`, `cos x`, `ln x` as in the German book; `log` for the decimal logarithm, `\ln` for the natural one.
- GTR = calculatrice graphique; CAS stays CAS. GeoGebra commands in their English names (Solve, NSolve, Root, If,
  FitLine, FitExp, FitPoly, Sequence, RandomBetween, CountIf, Derivative, Integral), which every language version of
  GeoGebra accepts - said once per chapter where they appear. Excel in French: `=SI`, `=ALEA.ENTRE.BORNES`, `=NB.SI`
  (with `;`).
- Letters in formulas stay as in the German book (H, T, W for Hoch-, Tief-, Wendepunkt; S for the vertex; D for the
  discriminant, which French schools call Δ: say so once where it first appears), except: solution set $S$ (above),
  identity matrix $I$, and the outcome letters of section 5 (pile / face, malade / sain).
- Lab and quiz names are translated on the card, "(en allemand)" once: Potenzlabor → LABORATOIRE DES PUISSANCES.

## 5. Maths terms

### Functions and calculus

| German | French | Note |
|---|---|---|
| Funktion, Funktionsgraph | fonction, courbe représentative (courbe de la fonction) | |
| Definitionsbereich, Wertebereich | ensemble de définition, ensemble des images | $D$, $W$ stay as letters |
| Nullstelle | zéro (de la fonction) | "les zéros de f", "f n’a aucun zéro" |
| Monotonie, monoton steigend/fallend, streng monoton | sens de variation, croissante/décroissante, strictement croissante | "monotone" where the German says monoton |
| Symmetrie, achsensymmetrisch (zur y-Achse) / punktsymmetrisch (zum Ursprung) | symétrie, symétrique par rapport à l’axe des ordonnées (fonction paire) / par rapport à l’origine (fonction impaire) | |
| lineare Funktion ($y = mx + n$) | fonction affine | in France "linéaire" is only $y = mx$; lineares Wachstum: croissance linéaire |
| Steigung, Anstieg | coefficient directeur (pente) | |
| Achsenabschnitt | ordonnée à l’origine | |
| Normalparabel | parabole de référence ($y = x^2$) | |
| Scheitelpunkt, Scheitelpunktform, Normalform | sommet, forme canonique, forme développée | the vertex keeps the letter S |
| Linearfaktorform (Produktform) | forme factorisée | |
| Strecken, Stauchen, Spiegeln, Verschieben | étirer, comprimer, symétriser, translater | nouns: étirement (dilatation), compression, symétrie par rapport à l’axe des abscisses, translation |
| Grundfunktion | fonction de référence | |
| Steckbrief (einer Funktion) | carte d’identité (de la fonction) | |
| Steckbriefaufgabe | déterminer une fonction à partir de ses propriétés | |
| markante Punkte | points remarquables | |
| Wertetabelle, Funktionswert, Wortvorschrift | tableau de valeurs, image (valeur de la fonction), description en mots | |
| Senkrechtentest | test de la droite verticale | |
| Term | expression | |
| modellieren, Modellierungskreislauf | modéliser, cycle de modélisation | |
| Umkehrfunktion | fonction réciproque | |
| Logarithmus, Zehnerlogarithmus, natürlicher Logarithmus | logarithme, logarithme décimal, logarithme népérien | |
| logarithmieren, Basiswechsel | passer au logarithme, changement de base | |
| Wurzelfunktion | fonction racine carrée | |
| Wachstum, Zerfall | croissance, décroissance | radioactive: désintégration |
| Wachstumsfaktor, Halbwertszeit, Verdopplungszeit | facteur de croissance (coefficient multiplicateur), demi-vie, temps de doublement | |
| Zinseszins | intérêts composés | |
| lineare Abschreibung, Buchwert | amortissement linéaire, valeur comptable | |
| Grundgebühr, Flatrate | abonnement (frais fixes), forfait | |
| Lösungsformel, Diskriminante | formule de résolution, discriminant | |
| pq-Formel, abc-Formel | formule de résolution | normierte Normalform $x^2 + px + q$: forme normalisée |
| Satz von Vieta | relations entre coefficients et racines (Viète) | |
| quadratische Ergänzung | mise sous forme canonique | |
| ausmultiplizieren, ausklammern | développer, factoriser (mettre en facteur) | |
| Produkt-Null-Regel | règle du produit nul | |
| Anhalteweg, Bremsweg, Reaktionsweg | distance d’arrêt, distance de freinage, distance de réaction | |
| Sinusfunktion, Periode, Amplitude | fonction sinus, période, amplitude | |
| Einheitskreis, Bogenmaß | cercle trigonométrique, mesure en radians | |
| Mittellinie | axe médian | |
| Schieberegler | curseur | |
| Regression, Messreihe, Messwerte | régression (ajustement), série de mesures, valeurs mesurées | |
| Bestimmtheitsmaß, Methode der kleinsten Quadrate | coefficient de détermination $R^2$, méthode des moindres carrés | |
| Punktwolke, Ausreißer, Ausgleichsgerade | nuage de points, valeur aberrante, droite d’ajustement | |
| Interpolation, Extrapolation, Prognose, Modellkritik | interpolation, extrapolation, prévision, critique du modèle | |
| Faustregel | règle empirique | |
| Verhalten im Unendlichen | comportement à l’infini | |
| Grenzwert, einseitige Grenzwerte | limite, limite à gauche / à droite | |
| Asymptote (waagerecht/senkrecht) | asymptote horizontale / verticale | feminine: une asymptote |
| Polstelle, Definitionslücke, hebbare Lücke | pôle (asymptote verticale), valeur interdite, trou (discontinuité supprimable) | |
| ganzrationale / gebrochenrationale Funktion | fonction polynôme / fonction rationnelle | |
| Grad, Leitkoeffizient, Vielfachheit | degré, coefficient dominant, multiplicité | einfach/doppelt/dreifach: simple/double/triple |
| Zählergrad, Nennergrad | degré du numérateur, degré du dénominateur | |
| Stetigkeit, stetig, stetige Ergänzung | continuité, continue, prolongement par continuité | |
| Vorzeichenwechsel, Vorzeichentabelle | changement de signe, tableau de signes | |
| Änderungsrate (mittlere / momentane) | taux de variation (moyen) / taux de variation instantané | |
| Differenzenquotient, Differenzialquotient | taux d’accroissement, nombre dérivé (limite du taux d’accroissement) | |
| Momentan-, Durchschnittsgeschwindigkeit | vitesse instantanée, vitesse moyenne | |
| Steigungsdreieck | triangle de pente | |
| Sekante, Tangente, Normale | sécante, tangente, normale | |
| Ableitung, ableiten, Ableitungsfunktion, differenzierbar | dérivée (in a point: nombre dérivé $f'(a)$), dériver, fonction dérivée, dérivable | |
| grafisches Ableiten | dériver graphiquement | |
| Potenz-, Summen-, Faktorregel | règle des puissances, règle de la somme, règle du facteur constant | as the widgets say (fr0 part of js/buch-fr/analysis.js) |
| Produkt-, Quotienten-, Kettenregel, innere Ableitung | règle du produit, du quotient, de la chaîne (dérivée d’une composée), dérivée intérieure | |
| e-Funktion, eulersche Zahl | fonction exponentielle, le nombre $\mathrm{e}$ (nombre d’Euler) | |
| Monotoniesatz | lien entre le signe de la dérivée et le sens de variation | |
| notwendige / hinreichende Bedingung | condition nécessaire / suffisante | |
| Hochpunkt, Tiefpunkt, Extremum, Extremstelle | maximum (point de maximum), minimum (point de minimum), extremum, abscisse de l’extremum | short widget labels: Maximum / Minimum |
| lokales / globales Extremum, Randwerte | extremum local / global, valeurs aux bornes | |
| Wendepunkt, Wendetangente | point d’inflexion, tangente au point d’inflexion | |
| Sattelpunkt | point d’inflexion à tangente horizontale | |
| Krümmung: Linkskurve / Rechtskurve | convexe / concave | the road picture: virage à gauche / à droite |
| Berührpunkt | point de contact | |
| Kurvendiskussion | étude de fonction | |
| Extremwertproblem, Zielfunktion, Hauptbedingung, Nebenbedingung, Randextremum | problème d’optimisation, fonction à optimiser, condition principale, contrainte, extremum au bord | |
| Ansatz, Probe | mise en équation, vérification | |
| Funktionenschar, Ortskurve | famille de fonctions, lieu des points | Geradenschar: famille de droites |
| Stammfunktion, Integrationsregeln | primitive, règles de calcul des primitives | |
| unbestimmtes / bestimmtes Integral, Grenzen | primitive (intégrale indéfinie) / intégrale, bornes d’intégration | |
| Unter-, Obersumme | somme inférieure, somme supérieure | |
| Hauptsatz | théorème fondamental de l’analyse | |
| Bestand, Anfangsbestand, rekonstruierter Bestand, Gesamtänderung | quantité, quantité initiale, quantité reconstituée, variation totale | |
| Zuflussrate / Abflussrate | débit entrant / sortant | |
| Anfangsbedingung | condition initiale | |
| Intervalladditivität, Linearität | relation de Chasles, linéarité | |
| Flächeninhalt, Flächenfunktion, Teilfläche | aire, fonction aire, aire partielle | |
| Schnittstelle, Differenzfunktion | abscisse d’intersection, fonction différence | |
| Mittelwert einer Funktion | valeur moyenne | |
| Rechteck-, Trapezmethode, Streifen, Stützstellen | méthode des rectangles, des trapèzes, bandes, points de subdivision | rectangles "à gauche / au milieu" |
| Keplersche Fassregel | règle des tonneaux de Kepler | |
| Bisektion, Monte-Carlo-Methode | dichotomie (méthode de dichotomie), méthode de Monte-Carlo | |
| Potenzfunktion | fonction puissance | |

### Equations, linear algebra, vectors, figures

| German | French | Note |
|---|---|---|
| Gleichung, Formel umstellen | équation, isoler une variable dans une formule | |
| Ungleichung, Relationszeichen dreht sich um | inéquation, le sens de l’inégalité change | |
| binomische Formeln | identités remarquables | |
| Äquivalenzumformung, inhaltliches Lösen | transformation équivalente, résoudre par le raisonnement | |
| Hauptnenner, antiproportional | dénominateur commun, inversement proportionnel | |
| Bruchgleichung, Grundmenge | équation rationnelle (avec $x$ au dénominateur), ensemble de référence $G$ | |
| Lineares Gleichungssystem (LGS) | système d’équations linéaires (système linéaire) | |
| Gleichsetzungs-, Einsetzungs-, Additionsverfahren | méthode par comparaison, par substitution, par combinaison | |
| Gauß-Verfahren, Stufenform, Pivot, Nullzeile | méthode du pivot de Gauss, forme échelonnée, pivot, ligne nulle | |
| Lösungsmenge $L$ | ensemble des solutions $S$ | rule in js/buch-fr/gleichungen.js |
| Matrix, erweiterte Koeffizientenmatrix, Format | matrice, matrice augmentée, taille | "une matrice de taille 2×3" |
| transponieren, skalare Multiplikation, Einheitsmatrix $E$ | transposer (transposée), multiplication par un réel, matrice identité $I$ | |
| Vektor, Ortsvektor, Einheitsvektor, Nullvektor, Verbindungsvektor, Gegenvektor | vecteur, vecteur position ($\overrightarrow{OP}$), vecteur unitaire, vecteur nul, vecteur $\overrightarrow{AB}$, vecteur opposé | |
| Betrag (eines Vektors / einer Zahl) | norme / valeur absolue | two meanings, never a global word |
| Linearkombination, kollinear, orthogonal | combinaison linéaire, colinéaires, orthogonaux | |
| Mittelpunkt, Schwerpunkt, Seitenhalbierende | milieu (of a segment) / centre (of a circle), centre de gravité, médiane | |
| Skalarprodukt, Vektorprodukt | produit scalaire, produit vectoriel | |
| Gerade, Ebene, Richtungsvektor, Spannvektoren | droite, plan, vecteur directeur, vecteurs directeurs (du plan) | |
| Stützpunkt, Stützvektor, Punktprobe | point de la droite (du plan), vecteur position de ce point, test d’appartenance | |
| Parametergleichung, Punktrichtungsform, Koordinatengleichung, Achsenabschnittsform | représentation paramétrique, forme point-vecteur directeur, équation cartésienne, équation par les points d’intersection avec les axes | |
| Normalenvektor, Lotfußpunkt, Lotgerade, Spiegelpunkt | vecteur normal, projeté orthogonal, perpendiculaire, symétrique | |
| Lagebeziehung: identisch, (echt) parallel, schneidend, windschief | positions relatives : confondues, (strictement) parallèles, sécantes, non coplanaires | |
| Spurpunkt, Spurdreieck, Koordinatenebenen, -achsen | point de percée (trace), triangle des traces, plans de coordonnées, axes de coordonnées | |
| Schnittpunkt, Schnittwinkel | point d’intersection, angle d’intersection | |
| Koordinatensystem (räumlich) | repère (de l’espace) | |
| Kavalierperspektive | perspective cavalière | |
| Prisma, Pyramide, Pyramidenstumpf, Quader, Raumdiagonale | prisme, pyramide, tronc de pyramide, pavé droit, grande diagonale | |
| Oberfläche, Mantelfläche, Grundfläche, Deckfläche, Volumen | aire totale, aire latérale, base, face supérieure, volume | |
| Kugel, Kegel, Umfang, Kathete | boule (surface: sphère), cône, périmètre, côté de l’angle droit | |
| Trapez, Viereck, Parallelogramm, Raute | trapèze, quadrilatère, parallélogramme, losange | |
| spitzer / stumpfer / rechter Winkel, gleichseitig, gleichschenklig | angle aigu / obtus / droit, équilatéral, isocèle | |
| Satz des Pythagoras | théorème de Pythagore | |
| Satz des Thales | propriété du triangle rectangle inscrit dans un demi-cercle | never "théorème de Thalès": in France that is the German Strahlensatz |
| Strahlensatz | théorème de Thalès | |
| Abstand | distance | |

### Probability and statistics

| German | French | Note |
|---|---|---|
| Zufallsversuch (mehrstufig), Ereignis, Versuch | expérience aléatoire (à plusieurs épreuves), événement, épreuve | |
| Ergebnis, Ergebnismenge | issue, univers $\Omega$ | |
| Baumdiagramm, Pfad, Ast, Pfadregel | arbre pondéré, chemin, branche, règle du produit (des chemins) | 2. Pfadregel: règle de la somme des chemins |
| Vierfeldertafel | tableau croisé | 2×2 |
| bedingte Wahrscheinlichkeit $P_A(B)$, Multiplikationssatz | probabilité conditionnelle $P_A(B)$, formule des probabilités composées | |
| Additionssatz, Regeln von De Morgan | formule de la réunion, lois de De Morgan | |
| stochastisch unabhängig, unvereinbar, Gegenereignis | indépendants, incompatibles, événement contraire $\overline{A}$ | |
| Urne, Ziehen mit/ohne Zurücklegen | urne, tirage avec / sans remise | |
| Farben rot / blau | rouge / bleu | the letters R / B stay |
| Glücksrad | roue de loterie | |
| Würfel (game) / Würfel (solid) | dé / cube | two meanings, never a global word |
| Pasch, Augenzahl, Augensumme | double, numéro (nombre de points), somme des points | |
| Münze, Wappen / Zahl | pièce, face / pile | letters F / P |
| krank / gesund (Schnelltest), falsch positiv | malade / sain, faux positif | letters M / S |
| Sensitivität, Spezifität | sensibilité, spécificité | |
| relative Häufigkeit, empirisches Gesetz der großen Zahlen | fréquence, loi des grands nombres (stabilisation des fréquences) | |
| Zählprinzip, Permutation, Variation, Kombination | principe multiplicatif, permutation, arrangement, combinaison | |
| Pascalsches Dreieck | triangle de Pascal | |
| Zufallsgröße, Wahrscheinlichkeitsverteilung | variable aléatoire, loi de probabilité | |
| Erwartungswert, Varianz, Standardabweichung, Streuung | espérance, variance, écart type, dispersion | |
| faires Spiel, Einsatz, Auszahlung, Gewinn | jeu équitable, mise, somme versée, gain | |
| Stabdiagramm, Säulendiagramm, Kenngrößen | diagramme en bâtons, diagramme en colonnes, indicateurs | |
| Bernoulli-Kette, -Experiment, Treffer, Niete | schéma de Bernoulli, épreuve de Bernoulli, succès, échec | Monte Carlo "Treffer": points dans la zone |
| Binomialverteilung, Binomialkoeffizient, Fakultät | loi binomiale, coefficient binomial, factorielle | |
| kumulierte Wahrscheinlichkeit, rechtsschief / linksschief | probabilité cumulée, étalée à droite / à gauche | |
| Galtonbrett, Ziegenproblem | planche de Galton, problème de Monty Hall | |
| beurteilende Statistik, Grundgesamtheit, Stichprobe | statistique inférentielle, population, échantillon | |
| Stichprobenmittel, -varianz, -umfang, -anteil | moyenne de l’échantillon, variance de l’échantillon, taille de l’échantillon, fréquence observée | |
| Hypothese, Nullhypothese, Gegenhypothese | hypothèse, hypothèse nulle $H_0$, hypothèse alternative $H_1$ | |
| Signifikanztest, Signifikanzniveau, Irrtumswahrscheinlichkeit | test d’hypothèse, seuil de signification $\alpha$, risque d’erreur | |
| Testgröße, kritischer Wert, Entscheidungsregel | variable de décision, valeur critique, règle de décision | |
| Ablehnungsbereich, Annahmebereich | zone de rejet, zone d’acceptation | |
| Fehler 1. Art / 2. Art | risque de première espèce / de deuxième espèce | |
| einseitig (rechts-/linksseitig), zweiseitig | unilatéral (à droite / à gauche), bilatéral | |
| Simulation | simulation | |

### Applications and FOS topics

| German | French | Note |
|---|---|---|
| Kosten, Erlös, Gewinn | coût, recette, bénéfice | |
| Fixkosten, Stückkosten, Grenzkosten, Grenzerlös | coûts fixes, coût unitaire (coût moyen), coût marginal, recette marginale | |
| Gewinnschwelle, Gewinngrenze, Gewinnzone, Gewinnmaximum | seuil de rentabilité, limite de rentabilité, zone de bénéfice, bénéfice maximal | |
| Betriebsoptimum, langfristige Preisuntergrenze | optimum d’exploitation, prix plancher à long terme | |
| Cournotscher Punkt | point de Cournot | |
| Stück (unit) | unités | "€ par unité" |
| gleichmäßig beschleunigte Bewegung | mouvement uniformément accéléré | |
| Zinseszins, Endkapital, Barwert, Aufzinsungsfaktor, Laufzeit | intérêts composés, capital final (valeur acquise), valeur actuelle, coefficient de capitalisation, durée | |
| Sparplan, Annuität, Tilgung, Restschuld, Tilgungsplan | plan d’épargne, annuité, amortissement, capital restant dû, tableau d’amortissement | |
| Ratentilgung, Annuitätentilgung | amortissement constant, annuités constantes | |
| effektiver Jahreszins, Mehrwertsteuer, brutto, netto | taux annuel effectif global (TAEG), TVA, TTC, HT | the German 19 % stays |
| Schaltalgebra, Wahrheitstafel, UND / ODER / NICHT | algèbre de Boole (des circuits), table de vérité, ET / OU / NON | |
| Reihen-, Parallelschaltung, Wechselschaltung | montage en série, en parallèle, va-et-vient | |
| imaginäre Einheit, Gaußsche Zahlenebene, konjugiert | unité imaginaire, plan complexe, conjugué | Betrag: module |
| Zahlenbereiche $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$ | ensembles de nombres : entiers naturels, entiers relatifs, rationnels, réels | |
| Zentralprojektion, Fluchtpunkt | perspective centrale, point de fuite | |

## mathe11-fr

<!-- fr-1: terms of this book only, write right below this line -->

## mathe12-fr

<!-- fr-2: terms of this book only, write right below this line -->

Package fr-2 (Châtelet), 22.10.2026: decisions made while translating BGY 12; nothing above was changed.

| German | French | Note |
|---|---|---|
| Bus $B$ / verspätet $V$ (1.1) | bus $B$ / en retard $R$ | the letter changed for the reader; no widget writes it |
| Brille $B$ / liest täglich $L$, fehlerhaft $F$ (1.1 tasks) | lunettes $L$ / lit tous les jours $Q$, défectueuse $D$ | only in the chapter text |
| krank $K$ / gesund (Schnelltest) | malade $M$ / sain | as section 5; tree letters K/G → M/S by a rule in js/buch-fr/stochastik.js |
| Wappen / Zahl (1.2, 1.3) | face / pile | outcomes WWZ → FFP; coin letters W/Z → F/P by rule |
| Treffer / Niete (letters in the Bernoulli trees) | S / E (succès / échec) | rule; the chapter text keeps «66NNN (N : pas de six)» |
| Rate-Test, überbucht, Galtonbrett | le QCM au hasard, surréservation, planche de Galton | 1.3 |
| Petersburger Spiel | le jeu de Saint-Pétersbourg | 1.2; Nikolaus I. Bernoulli → Nicolas Ier Bernoulli |
| Paketporto | les frais d’envoi (d’un colis) | 2.1 |
| Normalparabel (box titles of 2.2) | la fonction carré | running text: la parabole $y = x^2$ |
| Steckbriefe und Extremwertprobleme (2.6) | Déterminer des fonctions et optimiser | chapter title; widget steckbrief: «Choisis une carte d’identité» |
| Lückenschluss (2.6) | combler le décalage, tronçon de raccordement | |
| Wendetangente (label of the 2.5 opener) | tangente d’inflexion | short graph label; the text says tangente au point d’inflexion |
| Skalarprodukt $\vec a \circ \vec b$ | produit scalaire, $\circ$ kept as the widgets write it | Merke 5.2 adds: en France on note souvent $\vec a \cdot \vec b$ et $\|\vec a\|$ |
| Firstpunkt, Traufpunkt, Sparren, First | point de faîtage, point d’égout, chevron, faîtage | 5.2; the letters F, T stay |
| Kosinus-Ähnlichkeit | similarité cosinus | 5.2 excursion |
| Graßmann, «Die lineale Ausdehnungslehre» | Grassmann; the title stays German, with «La théorie de l’extension linéaire» | 5.1 |
| Dido, Karthago, Vergil: Aeneis | Didon, Carthage, Virgile, Énéide | 2.6 |
| Seg labels of raum3d: Punkte und Verbindungsvektor | Points et vecteur AB | no maths in a segment button |

## mathe13-fr

<!-- fr-3: terms of this book only, write right below this line -->

## mathefos11-fr

<!-- fr-4: terms of this book only, write right below this line -->

## mathefos12-fr

<!-- fr-5: terms of this book only, write right below this line -->
