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

Package fr-1 (Germain), 22.10.2026: decisions made while translating BGY 11; nothing above was changed.

| German | French | Note |
|---|---|---|
| lineare Funktion, lineares Wachstum (3.2) | fonction affine, croissance linéaire | the Merke box of 3.2 names the German term (« fonction linéaire ») once |
| Buttons of the widgets: Anwenden / Ausführen, Nächster Schritt, Neues LGS, Neue Gleichung, Neue Tafel, 1 Schritt | Appliquer, Étape suivante, Nouveau système, Nouvelle équation, Nouveau tableau, 1 étape | the chapter text quotes them in « » |
| Glücksrad (lb1) | roue de loterie | |
| Pfadregeln (1. und 2.) | 1re / 2e règle des chemins (règle du produit / de la somme) | widget baum says the same |
| Kugeln rot / blau (urn) | boules rouges / bleues | letters R / B stay |
| Wappen / Zahl | face / pile | letters F / P (rule in js/buch-fr/stochastik.js); lb1 tasks use FFP, PPP |
| krank $K$ / gesund (rapid test) | malade $M$ / sain $\overline{M}$ | tree letters M / S (rule); lb1: $P_{T^+}(M)$ |
| Sportverein $S$, Fahrrad $F$ (lb1 lesson 2) | $S$ (sport en club), $V$ (vélo) | the letter F became V in the page text; no widget writes it |
| Jahrgangsstufe 11 / 12, Jg. 11 | 11e / 12e année, 11e | |
| Treffer (simulation table head) | SUCCÈS | Monte-Carlo points « dedans » in wb3 |
| Ziegenproblem: bleiben / wechseln | rester / changer | « Rester à la porte 1 », « Passer à la porte 3 » |
| graphquiz score « 3 richtig » | « 3 bonnes réponses » | rule in js/buch-fr/funktionen.js |
| Vierfeld-Trainer « 3 von 5 richtig » | « 3 sur 5 justes » | rule in js/buch-fr/stochastik.js |
| Tageslänge dates « 21. Jun » | « 21 juin » | rule; janv. févr. mars avr. mai juin juil. août sept. oct. nov. déc. |
| $\lg$ (Zehnerlogarithmus) | $\log$ | page text and widgets (rule in js/buch-fr/funktionen.js); 3.6 says once « le manuel allemand écrit lg » |
| Einheitsmatrix $E$ (lb4) | matrice identité $I$ | the Merke box names the German $E$ once |
| Lösungsmenge $L$, $L = \{(2 - t;\ 1;\ t)\}$ | $S$, $S = \{(2 - t\,;\,1\,;\,t)\}$ | augmented-matrix rows $(0\;\;0\;\;0 \mid c)$ and $(A \mid \vec{b})$ keep their bar |
| Kerze, Bremsweg, Abkühlen, Weltbevölkerung (regression) | bougie, distance de freinage, refroidissement, population mondiale | |
| Riesenrad | grande roue | lb3-4 |
| Hotel von Hilbert | l’hôtel de Hilbert | wb3 |
| Faustregel der Fahrschule | règle empirique des auto-écoles allemandes | lb3-3, lb3-5 |
| Diskriminante $D$ (pq-Formel) | discriminant $D$ | lb3-3 adds once: en France $\Delta = b^2 - 4ac$, même signe |
| Satz von Vieta | relations de Viète | |
| Excel ZUFALLSBEREICH, ZÄHLENWENN, WENN | ALEA.ENTRE.BORNES, NB.SI, SI | French Excel, with `;` |
| GeoGebra Löse, NLöse, Nullstelle, TrendLin/TrendPoly/TrendExp, Folge, Zufallszahl, ZähleWenn, Wenn | Solve, NSolve, Root, FitLine/FitPoly/FitExp, Sequence, RandomBetween, CountIf, If | English names, said once per chapter |
| Mobiltelefon « Fon » (lb2) | smartphone | |
| Mehrwertsteuer 19 % | TVA (le taux allemand) | lb2 keeps the German 19 % |
| Lab names | LABORATOIRE DES BINÔMES, AU TABLEAU, SOLIDES, REPÈRE, LABORATOIRE DES PARABOLES, LABORATOIRE DES PUISSANCES, SIMULATION D’ÉPIDÉMIE, DROITE D’AJUSTEMENT, COVARIANCE, TRIGONOMÉTRIE, SYSTÈMES D’ÉQUATIONS, LE JEU DE DÉS, PLANCHE DE GALTON, RÉACTEUR À INTÉGRALES, LABORATOIRE DIFFÉRENTIEL | DOCPAD, CAVALIERI, BATMAN, FOURIER, LISSAJOUS, FIBONACCI, FALLING PI stay |

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

Package fr-3 (Lepaute), 22.10.2026: decisions made while translating BGY 13; nothing above was changed.

| German | French | Note |
|---|---|---|
| Fehler 1. / 2. Art (the event) | erreur de première / de deuxième espèce | its probability is the risque de première / deuxième espèce of section 5 (4.2 says both once); short: erreur de 1re / 2e espèce |
| Test (chapter 4.2 title, Signifikanztests) | Tests d’hypothèse | the widget: « Afficher l’erreur de 2e espèce », sides unilatéral à gauche / à droite, bilatéral |
| Ablehnungsbereich written as a list | $\overline{A} = \{69\,;\,\ldots\,;\,100\}$ | the widget gets the same form by a rule in js/buch-fr/stochastik.js |
| Stichprobenanteil $h$ (4.1) | fréquence observée $h$ | the letter h stays |
| Teedame (Fisher) | la dame qui goûtait le thé | 4.2 excursion |
| Literary Digest, Gallup | names stay | 4.1 excursion |
| Stützpunkt in running text | un point connu de la droite, un point du plan | as section 5 (no « point d’appui »); the widget: « Le point $Q$ de $h$ est sur $g$ » |
| Spurpunkte einer Ebene mit den Achsen | points d’intersection avec les axes | « points de percée » only for a line and the coordinate planes |
| Gerade schneidet Ebene (button) | Une droite coupe un plan | the chapter text OP.3 quotes it |
| Ortskurve (lb6) | lieu des points | the widget: « Afficher le lieu des extremums » |
| K, E, G (Kosten, Erlös, Gewinn) | letters stay | lb6 says once: les initiales des mots allemands pour coût, recette et bénéfice |
| Stück (lb3-2, lb3-4, lb6) | unités | « € par unité »; Teile (Ausschuss, 4.2) stay pièces |
| Firstpunkt, Traufpunkt (OP.3) | point de faîtage, point d’égout | as fr-2 |
| Pyramidenstumpf, Elle (Moskauer Papyrus) | tronc de pyramide, coudée | OP.3 excursion |
| Wahlbereich Numerik (BGY 11, quoted in 3.4) | le domaine optionnel des méthodes numériques | as the start page of mathe11-fr |
| Gebiet 1–3 (abi) | Bloc 1–3 | as section 2; Tipps für die Prüfung: Conseils pour l’examen, letter C |

## mathefos11-fr

<!-- fr-4: terms of this book only, write right below this line -->

Package fr-4 (Choquet), 22.10.2026: decisions made while translating FOS 11; nothing above was changed.

| German | French | Note |
|---|---|---|
| Ausblicke (chapter E), Wahlbereich 1 und 3 | Perspectives, domaines optionnels 1 et 3 | the letter E stays; kicker "PERSPECTIVES · DOMAINES OPTIONNELS 1 ET 3 · JUIN" |
| Fit für Klausur 1 (online quiz card) | PRÊT POUR LE DEVOIR SURVEILLÉ 1 | the quizzes stay German |
| Prozentwert $W$, Grundwert $G$, Wachstumsfaktor $1 \pm \tfrac{p}{100}$ | part $W$, valeur de référence $G$, coefficient multiplicateur | 1.1; the letters stay |
| Prozentpunkte | points de pourcentage | |
| Formel umstellen nach $x$ | isoler $x$ dans la formule, transformer une formule | |
| Struktur eines Terms (Summe, Produkt …) | structure d’une expression (somme, produit …) | |
| Widerspruchsbeweis | raisonnement par l’absurde | 1.1 excursion |
| Steigungswinkel | angle d’inclinaison | 1.2 |
| Punkt-Steigungs-Form | forme point-pente | |
| Grundgebühr (Handy / Taxi) | abonnement / prise en charge | |
| Zahlenstrahl, Halbgerade, Rand gefüllt / leer | droite graduée, demi-droite, extrémité pleine / vide | 1.3 |
| Scheinlösung, doppelte Ungleichung | fausse solution, double inégalité | |
| Probe (test point of the widget ungleichung) | test | the text says « nombre test » |
| Brennspiegel, Brennpunkt | miroir ardent, foyer | 1.5 excursion |
| Kettenlinie | chaînette | 1.6 excursion |
| Substitution | changement de variable | 1.7 |
| Ergebnismenge, Ereignismenge | univers $\Omega$, ensemble des événements | 2.1 |
| Wappen / Zahl | face / pile, letters F / P | chapter text and simulator (rule in js/buch-fr/stochastik.js) |
| Glücksrad rot / gelb / blau | roue de loterie, rouge / jaune / bleu, letters R / J / B | chapter text only |
| Bauteil in Ordnung $i$ / defekt $d$ | pièce conforme $c$ / défectueuse $d$ | chapter text only |
| Reißzwecke | punaise | |
| 1. / 2. Pfadregel | 1re règle des chemins (règle du produit) / 2e règle des chemins (règle de la somme) | widget baum: « 1re règle des chemins » |
| natürliche Häufigkeiten | effectifs naturels | 2.2 |
| Treffer / Niete in the Bernoulli trees | succès / échec, letters S / E | rule in js/buch-fr/stochastik.js |
| Lotto „6 aus 49“, Superzahl | le loto allemand « 6 sur 49 », numéro supplémentaire (Superzahl) | 2.3 |
| Grundfall (Urnenmodell) | cas de base | |
| Tabellenkalkulation | tableur | OP |
| Rate (Kredit) | échéance | widget tilgung; Annuität: annuité |
| Ratentilgung (Modell, Knopf) | amortissement constant (text: par amortissements constants) | |
| Faustregel 72 | règle de 72 | |
| Skonto, Dispozins, Ratenkauf | escompte, taux du découvert, achat à crédit | |
| Öffner (Schalter) | contact à ouverture | E |
| Halbaddierer, Volladdierer, Übertrag | demi-additionneur, additionneur complet, retenue | |
| Erwachsene / Kinder $e$ / $k$, Einzel- / Doppelzimmer, Hühner / Kaninchen, Fasane / Kaninchen | $a$ / $e$, $s$ / $d$, $p$ / $l$, $f$ / $l$ | chapter text only; no widget writes them |
| Messreihen der Regression: Kerze, Bremsweg, Abkühlen, Weltbevölkerung | Bougie, Distance de freinage, Refroidissement, Population mondiale | widget regression |
| Schritt (widget wachstum) | pas | "20 pas" |

## mathefos12-fr

<!-- fr-5: terms of this book only, write right below this line -->

Package fr-5 (Voisin), 22.10.2026: decisions made while translating FOS 12; nothing above was changed.

| German | French | Note |
|---|---|---|
| Schrägbild, Kavalierperspektive | perspective cavalière | 1.1 |
| Verbindungsvektor, „Spitze minus Fuß“ | vecteur entre deux points ($\vec{AB}$), « extrémité moins origine » | 1.1; widget raum3d: "Points et vecteur AB" |
| Punkt-Richtungs-, Zwei-Punkte-, Drei-Punkte-Form | forme point-vecteur directeur, forme à deux points, forme à trois points | 1.2, 1.3 |
| Stützpunkt (running text), Stützvektor | point de la droite (du plan), « point donné de $h$ »; $\vec{p}$ vecteur position d’un point de la droite | no "point d’appui" |
| Spurpunkte einer Ebene, Spurdreieck | points de percée (des axes dans le plan), triangle des traces | 1.3 |
| Durchstoßpunkt | point d’intersection (droite et plan) | 1.3 |
| Lotgerade, Lotfußpunkt, Spiegelpunkt | droite perpendiculaire (perpendiculaire), projeté orthogonal, symétrique | 1.4, widget lot3d |
| Miller-Indizes | indices de Miller | 1.3, excursion |
| h-Methode | méthode du $h$ | 2.1, 2.2 |
| Annäherung (widget grenzwert) | approche | "Approche, pas $k$" |
| Steckbrief (2.4) | carte d’identité (de la fonction) | the task: « déterminer une fonction à partir de ses propriétés » |
| Ortskurve (widget schar) | lieu des points, lieu des extremums | "Afficher le lieu des extremums" |
| Klausur 1, 2, 3 | DEVOIR SURVEILLÉ 1, 2, 3 | chips and quiz cards |
| Stück (wb3, widget gewinn) | unités | "x en unités", "€ par unité"; but "la température de la pièce" (room) |
| Mengenrabatt | remise sur quantité | wb3 |
| Zinseszins, Verzinsung (widget efunktion) | intérêts composés, intérêts versés chaque année / chaque mois … | the slider value and the sentence use the same words |
| Regressionsmodell linear / quadratisch / exponentiell | linéaire / quadratique / exponentiel | as the fr0 words of the regression widget, also in the text of wb3 |
| Gebiet 1 (fhr) | bloc 1 | as in section 2 |
| Fit für die FHR-Prüfung | En forme pour l’examen de la FHR | chapter P |
| Wahlbereich 3 (chapter W) | Domaine optionnel 3 (chapter OP) | as in section 1 |
| Treffer (widget efunktion: a = e) | Dans le mille | "<b>Dans le mille !</b>" |
| Zentralprojektion, Bildebene, Fluchtlinien | perspective centrale, plan du tableau, lignes de fuite | wb3, widget zentralprojektion |

## mathegy10-fr

<!-- fr-6: terms of this book only, write right below this line -->

Package fr-6 (Saint-Raymond), 25.10.2026: decisions made while translating GY 10; nothing above was changed.

| German | French | Note |
|---|---|---|
| Gymnasium, Klasse 10 | Gymnasium, 10e année | start page: le lycée allemand qui mène à l’Abitur ; en Saxe, de la 5e à la 12e année |
| Wahlbereich (chapter W) | Domaine optionnel (chapter OP) | as section 1 |
| beschränktes / logistisches Wachstum, Schranke $S$ | croissance bornée / logistique, borne $S$ | 1.1, widget wachstumsmodell; the models are feminine (la croissance) |
| rekursiv / explizit | par récurrence / (de façon) explicite | 1.1, 4.5, widgets wachstumsmodell, folge |
| Mittellage, Mittellinie | axe médian | 1.2, widgets messkurve, sinus, skizze |
| Hochwasser / Niedrigwasser, Pegel | pleine mer / basse mer, échelle de marée | 1.2 |
| Sinussatz, Kosinussatz | loi des sinus, loi des cosinus | 3.1 names Al-Kashi once; widget dreieckloeser: LOI DES SINUS, LOI DES COSINUS, SOMME DES ANGLES |
| SSS, SWS, WSW, SWW, SSW, WWW | CCC, CAC, ACA, CAA, CCA, AAA | C côté, A angle; 3.1 says once that the German book writes WSW, SSW |
| Schenkellinie | l’autre côté de l’angle | 3.1, widget dreieckloeser |
| Seitenhöhe, Seitenkante, Mantellinie, (halber) Öffnungswinkel, Neigungswinkel | apothème, arête latérale, génératrice, (demi-)angle au sommet, angle d’inclinaison | 3.2, widget pyramidekegel |
| Lösungsplan, Höhenwinkel | plan de résolution, angle d’élévation | 3.2 |
| umkehrbar, Winkelhalbierende $y = x$ | admettre une (fonction) réciproque, première bissectrice | 4.1 |
| $\lg$ | $\log$ | as fr-1; 4.1 says once « le manuel allemand écrit lg »; graph labels « log x » |
| Verknüpfen, Verketten, innere / äußere Funktion | opérations sur les fonctions, composer (composée), fonction intérieure / extérieure | 4.3, widget verkettung |
| Steigung in % (road) | pente (12 % de pente) | 4.3 |
| Funktionsklasse, ganzrational, gebrochenrational | famille de fonctions, fonction polynôme, fonction rationnelle | 4.4, widget funktionsklassen (buttons: polynôme, rationnelle, Racine carrée, exponentielle, logarithme, trigonométrique) |
| Steckbrief | carte d’identité | as section 5 |
| Glied, Schranken, Grenzwert, Nullfolge, Epsilon-Schlauch | terme, bornes (minorée / majorée), limite, suite convergente vers 0, bande de largeur ε | 4.5, widgets folge, epsilonschlauch |
| Parameterdarstellung | représentation paramétrique | 4.5, widget kreisparameter |
| Zinsfaktor, Faustregel 72, Dispositionskredit, Funktion RMZ | coefficient de capitalisation, règle de 72, découvert autorisé, fonction VPM | 5; the widgets zins and tilgung as fr-4 |
| Gaußsche Zahlenebene, Betrag (komplex) | plan complexe, module | OP says once « le manuel allemand parle du plan de Gauss »; widgets zeiger, quadkomplex |
| Diskriminante $D = \left(\tfrac{p}{2}\right)^2 - q$ | discriminant $D$ | OP adds once: en France $\Delta = p^2 - 4q$, même signe |
| Pasch, Augensumme, Münzwette, Los | double, somme des points, pari sur une pièce, billet de loterie | 2.1, 2.2, widgets verteilung, spielstreuung, fairesspiel |
| Ergebnis (table head of fairesspiel) | Résultat | one French per German word, as js/buch-fr/zahlen.js |
| Lab names | LE JEU DE DÉS, VISITE : CINQ SUR NEUF, PLANCHE DE GALTON, LABORATOIRE DES PUISSANCES, SIMULATION D’ÉPIDÉMIE, LABORATOIRE FIBONACCI, TRIGONOMÉTRIE, VISITE : DU TRIANGLE À L’ONDE, SOLIDES, PRINCIPE DE CAVALIERI, THÉORÈME DE BRAHMAGUPTA, LABORATOIRE DES PARABOLES, LABORATOIRE DE LA PENTE, DIVISION DU CERCLE, FRACTALES | PYTHAGORE; LISSAJOUS, COLLATZ, IMAGINARY NUMBERS stay |
## mathegy11-fr

<!-- fr-7: terms of this book only, write right below this line -->

Package fr-7 (Vergne), 25.10.2026: decisions made while translating GY 11 (Grundkurs); nothing above was changed.

| German | French | Note |
|---|---|---|
| Gymnasium, Grundkurs, Leistungskurs | stay | start page: le lycée allemand d’enseignement général, de la 5e à la 12e année en Saxe; Grundkurs (cours de base), Leistungskurs (cours approfondi) |
| Jahrgangsstufe 11, Klasse 10 | 11e année, 10e année | « Lien avec la 10e année » |
| Wahlbereich 2 (chapter W) | Domaine optionnel 2 (chapter OP) | as section 1 |
| Differenzenquotient, Differentialquotient | taux d’accroissement, nombre dérivé | as section 5; « méthode du h » as fr-5 |
| Faktorregel, äußere / innere Funktion, nachdifferenzieren | règle du facteur constant, fonction extérieure / intérieure, « ne pas oublier de dériver l’intérieur » | 1.3, widget kettenregel |
| linksgekrümmt / rechtsgekrümmt | convexe / concave | 1.4; Links- / Rechtskurve: virage à gauche / à droite |
| H, T, W (Hoch-, Tief-, Wendepunkt) | letters stay | 1.4 says once: les initiales des mots allemands |
| Intervalle $(a;\,b)$, $[a;\,\infty)$ | $]a\,;\,b[$, $[a\,;\,+\infty[$ | French notation in the page text (1.4 aside explains it); widgets keep theirs |
| Typ einer Matrix $(m,n)$, verkettete Matrizen | taille $(m,n)$ (aussi $m \times n$), matrices compatibles | 2; widget matrixprodukt: « est de taille », « compatibles » |
| Einheitsmatrix $E$, Zeilen $Z_1$, $Z_2$ | matrice identité $I$ (2 names the German $E$ once), lignes $L_1$, $L_2$ | page text only |
| Drehmatrix, Drehwinkel, Verflechtung | matrice de rotation, angle de rotation, production en plusieurs étapes | 2 |
| Bisektion, Heron | dichotomie, Héron d’Alexandrie | OP |
| windschief | non coplanaires | as section 5 |
| Spurpunkte einer Geraden / einer Ebene, Spurdreieck | points de percée / points d’intersection avec les axes, triangle des traces | as fr-3; the widget ebene3d says « Intersections avec les axes » |
| Durchstoßpunkt, Koordinatenform, parameterfreie Form | point d’intersection, équation cartésienne, plan sans paramètre | 3.3 |
| Vektorkette, Teilungspunkt | relation de Chasles, point de partage (« $T$ partage $[AB]$ dans le rapport $m : n$ ») | 3.1 |
| Halbkreisflugregel, Flugfläche | règle semi-circulaire, niveau de vol | 3.2 excursion |
| $B_{n;\,p}(k)$, linkssteil | stays, 4.2 adds once « en France, on note la loi $\mathcal{B}(n\,;\,p)$ »; étalé vers la droite | 4.2 |
| Ratetest, Klausur 11/I, 11/II | le QCM au hasard (as fr-2), DEVOIR SURVEILLÉ 11/I, 11/II | |
| Grassmann, „Die lineale Ausdehnungslehre“ | Grassmann, title kept German with « la théorie de l’extension linéaire » | 3.1, as fr-2 |
| Jakob / Nikolaus Bernoulli, Johann Bernoulli | Jacques (Jakob) / Nicolas, Jean (Johann) Bernoulli | 4.2, 1.3 |
| Lab names | PUISSANCES, PENTE, LABORATOIRE DIFFÉRENTIEL, SYSTÈMES D’ÉQUATIONS, DROITE D’AJUSTEMENT, VECTEURS, SOLIDES, LE JEU DE DÉS, PLANCHE DE GALTON, LABORATOIRE DES BINÔMES | |
## mathegy12-fr

<!-- fr-8: terms of this book only, write right below this line -->

Package fr-8 (Amice), 25.10.2026: decisions made while translating GY 12 (Grundkurs); nothing above was changed.

| German | French | Note |
|---|---|---|
| Gymnasium, Grundkurs, Leistungskurs | stay | start page: le lycée allemand d’enseignement général (5e à 12e année en Saxe), Grundkurs (cours de base), Leistungskurs (cours approfondi) |
| Jahrgangsstufe 12 | 12e année | |
| Grundintegrale | primitives usuelles | |
| lineare Verkettung | composée affine | widget label « Composées affines »; the fr0 rule of the trainer says « Composée avec une fonction affine » |
| Integrationskonstante, Integrand, Integrationsgrenzen | constante d’intégration, intégrande, bornes d’intégration | |
| orientierter Flächeninhalt | aire algébrique | |
| Untersumme $U_n$, Obersumme $O_n$ | somme inférieure, somme supérieure | the letters stay; 5.2 names the German words once |
| Integralfunktion | fonction intégrale | |
| Rechteckverfahren (links, rechts, Mitte), Mittelpunktsregel, Trapezverfahren | méthode des rectangles (à gauche, à droite, au milieu), méthode du point milieu, méthode des trapèzes | the letters $L_n$, $R_n$, $M_n$, $T_n$ stay; OP names « links », « rechts » once |
| Stützstellen | points de subdivision | |
| linksgekrümmt / rechtsgekrümmt | convexe / concave | |
| Keplersche Fassregel | règle des tonneaux de Kepler | |
| Hochrechnung | extrapolation | |
| Signifikanztest | test d’hypothèse | chapter 6, as fr-3 |
| Ablehnungsbereich $K$ | zone de rejet $K$ | the page keeps $K$ (6 says it is German); the widget writes $\overline{A}$ as in the German book |
| Sollwert (widget schaetzen) | valeur nominale | |
| Normalenform | équation normale | |
| Spurpunkte einer Ebene, Spurdreieck | points d’intersection avec les axes, triangle des traces | as fr-3 |
| Achsenabschnittsform | équation par les points d’intersection avec les axes | |
| Schnittwinkel, Steigungswinkel, Neigung, Innenwinkel | angle d’intersection, angle d’inclinaison, inclinaison, angle intérieur | |
| Hessesche Normalform, Abstandsformel | forme normale de Hesse, formule de la distance | |
| Lösungsplan | plan de résolution | 7.3 |
| Abstandsfunktion | fonction distance | 8.1, widget abstandmin |
| spiegeln an …, Spiegelpunkt, Spiegelebene | construire le symétrique par rapport à …, symétrique, plan de symétrie | |
| Geradenbüschel, Parallelenschar | faisceau de droites, famille de droites parallèles | widget geradenschar: Faisceau, Parallèles, Droite et parabole |
| Hüllkurve | enveloppe | 8.2 excursion |
| winkel3d presets | droite – droite, droite – plan, plan – plan; aigu, vecteurs à angle obtus, perpendiculaires, oblique, parallèles, toit et sol | |
| Prüfungsaufgabe (abi) | exercice d’Abitur | as fr-3; Gebiet: bloc |
| Cheops, Gizeh, Königselle, Handbreit, Seked | Khéops, Gizeh, coudée royale, palme, seked | 7.2 excursion |
| online quizzes Konsultation, Generalprobe | Consultation, Répétition générale | cards only, the quizzes stay German |
## mathegy11lk-fr

<!-- fr-9: terms of this book only -->

Package fr-9 (Dubreil), 25.10.2026: decisions made while translating LK 11 (Gymnasium 11, Leistungskurs); nothing above was changed.

| German | French | Note |
|---|---|---|
| Gymnasium, Grundkurs, Leistungskurs | stay | start page: le lycée allemand d’enseignement général, de la 5e à la 12e année ; Grundkurs (cours de base), Leistungskurs (cours approfondi) |
| Wahlbereich 2 | Domaine optionnel 2, chapter OP | as section 1 |
| Grenzwertsätze, h-Methode, Einschließung | théorèmes sur les limites, méthode du $h$, théorème des gendarmes | 1.1 |
| abschnittsweise definiert, Nahtstelle | définie par morceaux, point de raccordement | widget stetigkeit |
| Sprungstelle, hebbare Unstetigkeit | discontinuité de saut, discontinuité supprimable (trou) | 1.1 and widget stetigkeit |
| Zwischenwertsatz | théorème des valeurs intermédiaires | |
| lineare Approximation, Knick | approximation affine, point anguleux | 1.2 |
| Sattelpunkt | point d’inflexion à tangente horizontale | the Merke box of 1.4 names the German word once |
| links- / rechtsgekrümmt | convexe / concave | the bike picture: virage à gauche / à droite |
| Polynomdivision | division euclidienne des polynômes | |
| Steckbrief (title of 1.5), knickfrei, krümmungsruckfrei | Conditions ; fonctions à partir de conditions, sans angle, sans saut de courbure | |
| Rettungsschwimmerin, Brechungsgesetz | la sauveteuse, la loi de la réfraction (Snell-Descartes) | widget rettung |
| Typ einer Matrix $(m,n)$, verkettete Matrizen | taille $(m,n)$, matrices compatibles | as the widget matrixprodukt writes it |
| Einheitsmatrix $E$ | matrice identité $I$ | 2 says once: le manuel allemand la note $E$ |
| Verflechtung, Gozinto-Graph, ME | production en plusieurs étapes, graphe de Gozinto, u. (unités de quantité) | widget verflechtung; Zartbitter / Vollmilch: noir / au lait |
| Bisektion, Fixpunktiteration, Spinnennetz, anziehend / abstoßend | dichotomie, méthode du point fixe, toile d’araignée, attractif / répulsif | OP |
| Zylinder-, Kugelkoordinaten, Länge, Breite | coordonnées cylindriques, sphériques, longitude, latitude | 3.1, widget koordsys3d |
| Teilverhältnis, geschlossener Vektorzug, Koeffizientenvergleich | rapport de partage, relation de Chasles fermée, identification des coefficients | 3.2 |
| räumliches Viereck | quadrilatère gauche | widget varignon3d |
| Spurgerade, Schnittgerade, First | trace, droite d’intersection, faîtage | 3.3 |
| schneidend, identisch (two planes) | sécants, confondus | masculine for planes: rule in js/buch-fr/gy11lk-vek.js; lines stay feminine (js/buch-fr/vektoren.js) |
| Streichen, Einfallen | direction, pendage | 3.3 excursion |
| Ziegenproblem, Pasch, Skatblatt | problème de Monty Hall, double, jeu de 32 cartes | |
| Treffer / Niete (path letters in the page text) | S / E | 4.3 example 2: SSEE … |
| $B(n;\, p)$ | $B(n\,;\,p)$ | page text; the galton widget by a rule in js/buch-fr/gy11lk-stoch.js |
| krank $K$, Wappen / Zahl $W$ / $Z$ (page text) | malade $M$, face / pile $F$ / $P$ | as section 5 |
| Brille $B$, linkshändig $L$ (4.2) | lunettes $L$, gaucher $G$ | page text only |
| Klausur 11/I, Klausurtraining 11/II | DEVOIR SURVEILLÉ 11/I, ENTRAÎNEMENT AU DEVOIR SURVEILLÉ 11/II | online cards, en allemand |
| Lab names | LABORATOIRE DES PENTES, LABORATOIRE DIFFÉRENTIEL, SOLIDES, VECTEURS, LE JEU DE DÉS, LABORATOIRE DES BINÔMES, PLANCHE DE GALTON, DROITE D’AJUSTEMENT | |
| German titles in the sources (Heine, Kolmogorow, Grassmann) | stay German, with a French translation in « » where it helps | encheck lists them as German on purpose |

## mathegy12lk-fr

<!-- fr-10 (Ferrand, LK 12), written into the glossary by the orchestrator at the merge of round 2 (25.10.2026) -->

| Deutsch | Français |
|---|---|
| orientierter Flächeninhalt | aire algébrique |
| Integralfunktion | fonction intégrale |
| lineare Verkettung / Substitution | composée affine / substitution affine |
| Grundintegrale | primitives de référence |
| Kettenregel rückwärts | règle de la chaîne à l’envers |
| Untersumme / Obersumme | somme inférieure / supérieure ($U_n$, $O_n$ bleiben, einmal erklärt) |
| Mittelpunktsregel | règle du point milieu |
| Fassregel | règle des tonneaux de Kepler |
| standardisieren | centrer et réduire |
| standardnormalverteilt | loi normale centrée réduite |
| $N(\mu;\ \sigma^2)$, $B(n;\ p)$ | $N(\mu\,;\,\sigma^2)$, $B(n\,;\,p)$ |
| statistische Sicherheit | signification statistique |
| Lotfußpunkt (windschiefe Geraden) | pieds de la perpendiculaire commune |
| Lotgerade | perpendiculaire |
| Hessesche Normalform | forme normale de Hesse |
| Sehwinkel | angle de vue |
| Geradenbüschel | faisceau de droites |
| Parallelenschar | famille de droites parallèles |
| Trägergerade | droite support |
| Hüllkurve | enveloppe |
| Gebiet 1–3 | Bloc 1–3 |
| Tipps für die Prüfung | Conseils pour l’examen (lettre C) |
| Prüfungsaufgabe | exercice d’examen |

## mathe5-fr

Oberschule 5 (Vignéras, 26.10.2026). Doc's rule of 26.10.: the French school way everywhere - × for the product, P for the
perimeter and A for the total area, j for the day, L and mL, points (2 ; 3), segments [AB], lines (AB), axis (d), rotation
centre O, place-value columns C D U per class (M C D U, d c m after the comma). Number words in the 1990 rectified spelling,
every part joined by a hyphen (vingt-et-un, deux-cent-mille, un-million); "trois virgule zéro quarante-sept".

| Deutsch | Français |
|---|---|
| Zahlenstrahl | droite graduée |
| Stellenwerttafel | tableau de numération |
| Dreiergruppen | tranches de trois chiffres |
| Vorgänger / Nachfolger | prédécesseur / successeur |
| auf-/abrunden | arrondir vers le haut / vers le bas |
| Überschlag | ordre de grandeur |
| Probe | preuve / vérification |
| Umkehraufgabe | opération inverse |
| schriftlich / halbschriftlich | poser l’opération / en ligne |
| Übertrag | retenue |
| Ergänzen / Entbündeln | Compléter / Casser |
| Summand | terme |
| Rechengesetze | propriétés des opérations |
| Vorrangregeln / Punkt vor Strich | règles de priorité / « × et : avant + et − » |
| Term | expression |
| Hochzahl / Grundzahl | exposant / base |
| Quadratzahl | carré parfait |
| Quersumme | somme des chiffres |
| Teilbarkeitsregeln | critères de divisibilité |
| Sieb des Eratosthenes | crible d’Ératosthène |
| Primzahlzwillinge | nombres premiers jumeaux |
| Stammbruch | fraction unitaire |
| echter / unechter Bruch | fraction inférieure / supérieure à 1 |
| Zehnerbruch | fraction décimale |
| Erweitern | amplifier |
| Ganzes | unité / le tout |
| Schrägbild | perspective cavalière |
| Netz / Kantenmodell | patron / squelette |
| Oberfläche / Umfang | aire totale A / périmètre P |
| deckungsgleich | superposables |
| Bandornament | frise |
| Spiegelachse / Geradenspiegelung | axe de symétrie (d) / symétrie axiale |
| Verschiebung | translation |
| Umlaufsinn | sens de parcours |
| überstumpfer Winkel / Vollwinkel | angle rentrant / angle plein |
| Geodreieck | équerre-rapporteur (explained once) |
| Einheitentreppe | escalier des unités |
| Kerbholz / Strichliste / Fünferbündel | bâton à encoches (taille) / traits de comptage / paquet de cinq |
| Keil / Winkelhaken | clou / chevron |
| Rechenpfennige; Linien / Zwischenräume | jetons de calcul; lignes / espaces |
| Notendurchschnitt | moyenne (German marks 1, the best, to 6) |
| Klasse 5 | 5e année (about the age of CM2) |

## mathegy5-fr

<!-- fr-12: terms of this book only (GY 5), write right below this line -->

Package fr-12 (Audin), 26.10.2026: decisions made while translating GY 5; the conventions of `## mathe5-fr` hold, nothing
above was changed.

| German | French | Note |
|---|---|---|
| Gymnasium, Klasse 5 | Gymnasium, 5e année | start page: le lycée allemand d’enseignement général qui mène à l’Abitur, de la 5e à la 12e année en Saxe; 5e année ≈ CM2 |
| Wahlbereich (chapter W) | Domaine optionnel (chapter OP) | as section 1 |
| Stelle, Stellenwert | rang, valeur de position | "le rang des milliers", "à droite du rang des dizaines de mille" |
| Dreiergruppen: Einer, Tausender, Millionen, Milliarden | tranches de trois chiffres : unités, mille, millions, milliards | as the widget stellenwert5 |
| runden auf Zehner / Hunderter / Tausender | arrondir à la dizaine / à la centaine / au millier | auf Zehntausender: à la dizaine de mille |
| Rasterverfahren | méthode du quadrillage | 1.1 |
| Eselsbrücke | pour t’en souvenir (moyen mnémotechnique) | |
| Zahlwörter | rectified spelling of 1990, every part joined by a hyphen | 1.1 says so in its aside instead of the German "one word below a million" |
| Dresden | Dresde | French name of the city in the page text |
| Kopfrechnen; mit Stift und Papier (test rounds) | calcul mental; avec un crayon et du papier | |
| Vertauschungs-, Verbindungs-, Verteilungsgesetz | commutativité, associativité, distributivité | 1.2, as OS 5; Rechengesetze: propriétés des opérations |
| Summand, Minuend − Subtrahend, Dividend : Divisor | terme, terme − terme, dividende : diviseur | 1.2 table |
| Punktrechnung vor Strichrechnung | multiplications et divisions (× et :) avant additions et soustractions (+ et −) | 1.2 |
| Basis, Exponent, „zwei hoch fünf“ | base, exposant, « deux puissance cinq » (« deux exposant cinq ») | 1.2 |
| schriftlich dividieren: teilen, malnehmen, abziehen, herunterholen | division posée : diviser, multiplier, soustraire, abaisser | 1.2 keeps the German layout and says once that France uses the potence |
| Schullandheim | classe verte | 1.2 |
| Teiler, Vielfaches, $3 \mid 12$ „3 teilt 12“ | diviseur, multiple, $3 \mid 12$ « 3 divise 12 » | 1.3 |
| Teilermenge $T_{12} = \{1, 2, 3\}$ | ensemble des diviseurs $D_{12} = \{1\,;\,2\,;\,3\}$ | 1.3: the letter D (diviseurs), lists with the French semicolon; plain text {1 ; 2 ; 3} |
| Primfaktorzerlegung | décomposition en (produit de) facteurs premiers | 1.3 |
| kleinstes gemeinsames Vielfaches | plus petit multiple commun | 1.3 |
| Zähler „zählt“, Nenner „nennt“ | le numérateur *compte*, le dénominateur *dénomme* | 2.1, the German wordplay kept |
| echter / unechter Bruch | fraction inférieure à 1 / supérieure ou égale à 1 | 2.1, as OS 5 and the widget bruch5 |
| gemischte Zahl $1\tfrac34$ | écriture mixte, « c’est-à-dire $1 + \tfrac34$ » | 2.1 says the sum once |
| vollständig kürzen, größter gemeinsamer Teiler | rendre irréductible, plus grand diviseur commun | 2.1 |
| „drei Komma vier sieben“ (not „siebenundvierzig“) | « trois virgule quarante-sept » or « 3 unités et 47 centièmes » | 2.2: the French way of reading, as the widget stellenwert5 says; the aside warns that « quarante-sept » sounds bigger than « cinq » |
| ct (Cent) | centimes (written out) | 2.2 |
| Schlussverkauf, Rabatt | soldes, réduction | 2.2 |
| Komma unter Komma, Kommaverschiebung | virgule sous virgule, déplacer la virgule | 2.3; the widget komma5 says « la virgule se déplace » |
| arithmetisches Mittel, Mittelwert, Durchschnitt | moyenne (moyenne arithmétique) | 2.3, as the widget mittel5 |
| Koordinatensystem, x-Achse, y-Achse, Ursprung, P(3 \| 5) | repère, axe des abscisses, axe des ordonnées, origine, P(3 ; 5) | 3.1; TeX $P(3\,;\,5)$ |
| Strecke $\overline{AB}$, Strahl, Gerade | segment [AB], demi-droite, droite | 3.1; the line names g, h, s stay as in the widgets koord5 and winkelpaare5 (s = sécante) |
| Schenkel, Scheitel (eines Winkels) | côtés, sommet | 3.1 |
| Neben-, Scheitel-, Stufen-, Wechselwinkel | angles adjacents (supplémentaires), opposés par le sommet, correspondants (en F), alternes-internes (en Z) | 3.1, widget winkelpaare5; buttons Autre paire, Incliner h |
| achsensymmetrisch / punktsymmetrisch, Symmetrieachse, Symmetriezentrum | a un axe de symétrie / a un centre de symétrie, axe de symétrie, centre de symétrie | 3.2; Achsen-/Punktsymmetrie: symétrie axiale / centrale |
| Verschiebung, Drehung (um Z), Spiegelung (an der Achse $s$) | translation, rotation (autour de O), symétrie axiale (par rapport à l’axe $(d)$) | 3.2: O and (d) as OS 5 and the fr-11 rules of spiegel5; Bewegungen: mouvements (« aussi appelés transformations ») |
| Bildfigur, $A'$ „A Strich“ | figure image, $A'$ « A prime » | 3.2 |
| Wörter mit senkrechter Achse: OTTO, ANNA, TOM, UHU, MAMA | OTTO, ANNA, TOM, YOYO, MAMAN | 3.2 task 2: French words, the solution follows the letters (N breaks the axis) |
| Pik-Dame, „Vorfahrt achten“ | la dame de pique, « Cédez le passage » | 3.2 |
| Flächeninhalt $A = a \cdot b$, Umfang $u = 2a + 2b$ | aire $A = a \times b$, périmètre $P = 2a + 2b$ | 4.1, as the widget rechteck5 (rule u → P of fr-11) |
| Auslegen, Zerlegen, Ergänzen | paver, décomposer, compléter | 4.1 |
| Ar, Hektar | are (a), hectare (ha) | 4.1 |
| Quader, Ecken, Kanten, Flächen | pavé droit, sommets, arêtes, faces | 4.2 |
| Ansichten: Grundriss, Vorder-, Seitenansicht | vues : vue de dessus, vue de face, vue de côté | 4.2 |
| Oberflächeninhalt $O$ | aire totale $A$ | 4.2, as the widget quader5 (rule O → A of fr-11); two boxes A and B became « boîte 1, boîte 2 » with $A_1$, $A_2$ |
| Hohlmaße: l, ml, hl | contenances : L, mL, hL | 4.2, as OS 5 |
| Kantenmodell, Körpernetz | squelette, patron | 4.2 |
| Uhrzeit 7:05 Uhr, d (Tag) | 7 h 05 (no-break spaces), j (jour) | 5; the timetable too; j as OS 5 and the widget einheiten5 |
| Maßzahl, Einheit, Umrechnungszahl, Einheitentreppe | nombre, unité, nombre de conversion, escalier des unités | 5 |
| Fermi-Aufgabe, Näherungswert, Lösungsplan | problème de Fermi, valeur approchée, plan de résolution | 5 |
| Schulsportfest | la journée sportive de l’école | 5 project |
| Additionssystem, Stellenwertsystem | système additif, numération de position | OP |
| Strich, Fessel, Seil, Lotusblüte, Finger, Kaulquappe (Ägypter) | bâton, anse, corde, fleur de lotus, doigt, têtard | OP, as the widget zahlschrift5 (fr-11) |
| Zwanzigersystem der Maya: Punkt, Strich, Muschel, Stufe | base vingt : point, barre, coquillage, étage | OP |
| Zweiersystem, Fünfersystem, $1011_2$ | binaire (base deux), base cinq, $1011_2$ | OP |
| Linienbrett, Rechenpfennige, Linien / Felder, bündeln | table à calculer, jetons, lignes / espaces, regrouper | OP, as the widget linien5 (fr-11) |
| „Nach Adam Ries(e)“; Rechenung auff der linihen und federn | stays German with a French gloss in « » | OP; encheck lists these on purpose |
| Sächsische Landesbibliothek (SLUB) | Bibliothèque d’État de Saxe | OP |
| Lab names | RALLYE DE CALCUL, HORLOGE MONDIALE, ADDITION POSÉE, MULTIPLICATION POSÉE, DIVISION POSÉE, PUZZLE DE NOMBRES, LES CLOCHES DE BAGDAD, LABORATOIRE DU REPÈRE, L’HORLOGE DES ANGLES, LABORATOIRE DES ANGLES, PUZZLE D’ANGLES, FIGURES SUPERPOSABLES, SOLIDES, PRINCIPE DE CAVALIERI, NOMBRES MAYAS, VISITE : POINT, BARRE, COQUILLAGE, NOMBRES BINAIRES | cards, en allemand |

## mathegy6-fr

<!-- fr-13: terms of this book only (GY 6), write right below this line -->

Package fr-13 (Morel), 26.10.2026: decisions made while translating GY 6; nothing above was changed. French school conventions
as in `## mathe5-fr` (× for the product in the pages and, by a rule in js/buch-fr/gy6.js, in the widgets; L and mL).

| German | French | Note |
|---|---|---|
| Gymnasium, Klasse 6 | Gymnasium, 6e année | start page: « à peu près l’âge de la classe de sixième en France » |
| gebrochene Zahlen $\mathbb{Q}^+$ | nombres rationnels positifs $\mathbb{Q}^+$ | 1.1 lesson 3, widget mengen6; titles say « fractions » |
| natürliche Zahlen $\mathbb{N}$ | entiers naturels | |
| Dezimalzahl (endlich / periodisch) | écriture décimale (finie / périodique), nombre décimal | 1.1 says once: in France a « nombre décimal » has a finite decimal writing; widget bruchbild6: « Écriture décimale », « s’arrête », « périodique » |
| erweitern, kürzen, gleichnamig machen | amplifier (as OS 5), simplifier, mettre au même dénominateur | |
| Menge, Element, Teilmenge, Mengendiagramm | ensemble, élément (appartient à), partie (est inclus dans), diagramme de Venn | sets in braces with semicolons: $\{1\,;\,2\,;\,3\}$ |
| Stammbruch, Papyrus Rhind, Ahmes | fraction unitaire, papyrus Rhind, Ahmès | 1.1 excursion |
| TR (Taschenrechner-Zeichen) | CALC | the marker `g-cas` in front of a task |
| Labs SCHRIFTLICHE DIVISION, RECHEN-RALLYE | DIVISION POSÉE, RALLYE DE CALCUL | « À ESSAYER AUSSI (EN ALLEMAND) » as OS 5 |
| Kehrwert, gemischte Zahl, Überschlag, Probe | inverse, écriture mixte ($2\tfrac12 = 2 + \tfrac12$), ordre de grandeur, vérification | 1.2 |
| De Thiende (Stevin) | « La Disme » | 1.2 excursion, the French title of 1585 |
| Vorrangregeln, Punkt vor Strich | règles de priorité, « × et : avant + et − » | 1.3, widget vorrang6 (as OS 5) |
| Vertauschen, Verbinden, Verteilen | échanger (commutativité), regrouper (associativité), distribuer (distributivité) | 1.3 |
| Variable, Umkehraufgabe, Lösungsplan | inconnue, opération inverse, plan de résolution | 1.3 |
| Landheim | classe de découverte | 1.2 test |
| Zuordnung: mehrdeutig / eindeutig / eineindeutig, Pfeildarstellung | correspondance : non univoque / univoque / biunivoque, diagramme sagittal | 2.1, widget pfeile6 |
| Wortform, Wertetabelle | description en mots, tableau de valeurs | 2.1, widget darstellung6 « En mots » |
| absolute / relative Häufigkeit, Chance | effectif / fréquence, probabilité (« une chance sur six ») | 2.1, widget zufall6 |
| Münze Kopf / Zahl | pièce : face / pile | widget zufall6 (« Zahl » by a rule tied to the table and the picture) |
| Ergebnis (table head of zufall6) | Issue | rule: the word « Ergebnis » stays « Résultat » (bruchop6) |
| Schulfach Deutsch (survey in 2.1) | français | the pupil's own language |
| direkt / indirekt proportional, Quotienten- / Produktgleichheit, Proportionalitätsfaktor | proportionnel / inversement proportionnel, quotient constant / produit constant, coefficient de proportionnalité | 2.2, widget proportional6 |
| Dreisatz, auf eins zurückrechnen | règle de trois, passer par l’unité | 2.2, widget dreisatz6 « Étape 2 : passe par l’unité » |
| Umfang $u$ (2.2 task) | périmètre $P$ | $P = 4 \times a$ |
| Eratosthenes, Syene, Stadion, Kleomedes | Ératosthène, Syène, stade, Cléomède | 2.2 excursion |
| Lab STEIGUNGS-LABOR, KOORDINATENSYSTEM, GALTON BOARD | LABORATOIRE DE LA PENTE, REPÈRE, PLANCHE DE GALTON | as fr-1 and fr-6 |
| kongruent, Kongruenzsätze sss, sws, wsw, SsW, www, ssW | égaux (superposables), cas d’égalité CCC, CAC, ACA, CcA, AAA, ccA | 3.1, widget konstruktion6; C côté, A angle; CcA mirrors SsW: C the larger side, the angle opposite it (not taught in France, explained once) |
| Innenwinkelsatz, Wechselwinkel, Nebenwinkel, gestreckter Winkel, Außenwinkel | somme des angles d’un triangle, angles alternes-internes, angles supplémentaires adjacents, angle plat, angle extérieur | 3.1, widget winkelsumme6 |
| Definition, Satz, Wenn-dann-Form, Voraussetzung, Behauptung, Beweis | définition, théorème, forme « si…, alors… », hypothèse, conclusion, démonstration | 3.1 |
| Planfigur, Konstruktionsbeschreibung, Geodreieck, DGS | figure à main levée, programme de construction, équerre-rapporteur, logiciel de géométrie dynamique | 3.1 |
| Strecke $\overline{AB}$ / Länge / Gerade AB | segment $[AB]$ / longueur $AB$ / droite $(AB)$ | French notation in the pages; widget winkelsumme6: « parallèle à $(AB)$ » |

## mathegy7-fr

<!-- fr-14: terms of this book only (GY 7), write right below this line -->

## mathegy8-fr

<!-- fr-15: terms of this book only (GY 8), write right below this line -->

Package fr-15 (Moeglin), 26.10.2026: decisions made while translating GY 8; nothing above was changed. The French school
conventions of `## mathe5-fr` hold: × for the product (the rule `\cdot` → `\times` in js/buch-fr/gy8.js turns the widgets,
too), P perimeter, A total area, points (2 ; 3), [AB] segment, AB its length, (AB) line.

| German | French | Note |
|---|---|---|
| Gymnasium, Klasse 8 | Gymnasium, 8e année | start page: about the age of the French 4e |
| Term, Rechenbaum | expression, arbre de calcul | 1.1, widget termbaum8 (the product node shows × instead of the dot) |
| Variable als Platzhalter, Unbekannte, Veränderliche | nombre quelconque, inconnue, grandeur variable | 1.1; Name, Wert, Bedeutung: nom, valeur, signification |
| Summe, Differenz, Produkt, Quotient, Potenz | somme, différence, produit, quotient, puissance | Summanden: termes; Minuend und Subtrahend: premier et second terme; Faktoren, Dividend und Divisor, Basis und Exponent: facteurs, dividende et diviseur, base et exposant |
| zusammenfassen, ausmultiplizieren, ausklammern, gleichartige Glieder | réduire, développer, factoriser, termes semblables | 1.1 |
| Punkt vor Strich, Reihenfolge der Rechenarten | ordre des priorités, × et : avant + et − | division stays « : » as in OS 5 |
| Malpunkt | signe × | 1.1 aside |
| Breite $b$ (rectangle), Umfang $u$, Oberfläche $O$ | largeur $\ell$, périmètre $P$, aire totale $A$ | page text |
| Streichhölzer, Zahlentrick | allumettes, tour de magie des nombres | 1.1 |
| binomische Formeln, 1./2./3. binomische Formel, Binom | identités remarquables, 1re/2e/3e identité, binôme | 1.2, widget binomformeln8 |
| lineare Gleichung, Probe, Lösungsmenge $L$ | équation du premier degré, vérification, ensemble des solutions $S$ | 1.2; $S = \{\,\}$, $S = \{\,x \mid x > -3\,\}$ |
| Ungleichung, das Zeichen dreht sich um | inéquation, le sens de l’inégalité change | 1.2; Zahlenstrahl offener Kreis / voller Punkt: droite graduée, cercle vide / point plein |
| Balkenwaage, Fitnessstudio, Besuche $b$ | balance, salle de sport, visites $v$ | 1.2 (the letter follows the French word) |
| Zahlenrätsel | devinette | 1.2 |
| Zufallsversuch, Ergebnis, Ergebnismenge, Ereignis, sicheres / unmögliches Ereignis | expérience aléatoire, issue, univers $\Omega$, événement, événement certain / impossible | 2.1; « tritt ein »: se réalise |
| Vereinigung, Durchschnitt, Differenz „A ohne B“, Gegenereignis | réunion, intersection, différence « $A$ privé de $B$ », événement contraire | 2.1 |
| absolute / relative Häufigkeit $H_n(E)$, $h_n(E)$ | effectif $N_n(E)$, fréquence $f_n(E)$ | letters from the French words (N nombre, f fréquence); gluecksrad8 writes $f(E)$ by a rule |
| Laplace-Versuch, Laplace-Regel | expérience de Laplace (situation d’équiprobabilité), règle de Laplace | 2.1, widget gluecksrad8 |
| Glücksrad, Feld (des Glücksrads), gleich / verschieden groß | roue de loterie, secteur, de même taille / de tailles différentes | widget gluecksrad8 |
| Mengen $\{1; 2; 3\}$ | $\{1\,;\,2\,;\,3\}$ | page text and widget sets (rule in js/buch-fr/gy8.js) |
| Farben r / g / b (Glücksrad rot, gelb, blau), Urne rot / blau / grün | r / j / b, r / b / v | 2.1 page text |
| Reißzwecke, Legostein (Noppen), Kronkorken, Lostrommel, Hauptgewinn / Niete | punaise, brique de Lego (tenons), capsule de bouteille, urne de tombola, gros lot / billet perdant | 2.1 |
| Skatblatt, Herz-Bube | jeu de 32 cartes, valet de cœur | 2.1 |
| mehrstufiger Zufallsversuch, Stufe, Urnenmodell, abhängig / unabhängig | expérience à plusieurs épreuves, épreuve, modèle de l’urne, dépendantes / indépendantes | 2.2 |
| Produktregel / Summenregel (Pfade), Verzweigungspunkt | règle du produit / règle de la somme (règles des chemins), nœud | 2.2 |
| Produktregel (Zählen), Fakultät | principe multiplicatif, factorielle ($4!$ « factorielle 4 ») | 2.2; two German rules of the same name, two French names |
| Wappen / Zahl in the page text ($WWZ$) | face / pile ($FFP$) | as section 5; widget ziffern8 (« face », « pile ») |
| Zufallsziffern, Lesart als Münze / als Würfel, absolut / relativ | chiffres aléatoires, lecture comme une pièce / comme un dé, effectif / fréquence | widget ziffern8 |
| ZUFALLSBEREICH, randInt | ALEA.ENTRE.BORNES, randInt | 2.2 (French Excel, glossary section 4) |
| Kaugummikugeln, Zahlenschloss, Eiswaffel, Siegerpodest, Schere-Stein-Papier, Sechserpasch | boules de chewing-gum, cadenas à code, cornet de glace, podium, pierre-feuille-ciseaux, double six | 2.2 |
| plain-text outcome lists {2; 3}, (1; 2) of the widget urne | {2 ; 3}, (1 ; 2) | rule in js/buch-fr/gy8.js |
| eindeutige Zuordnung, Zuordnungsvorschrift, Funktionswert, Senkrechten-Test | relation qui associe une seule valeur, règle d’association, image, test de la droite verticale | 3.1 |
| Definitionsbereich $D$, Wertebereich $W$ | ensemble de définition $D$, ensemble des images $I$ | 3.1: the letter W becomes I (images) |
| Hochpunkt $H$, Tiefpunkt $T$ | maximum, minimum (« maximum au point $(-1\,;\,2)$ ») | 3.1: no German letters; the points are named by their coordinates |
| monoton steigend / fallend, Nullstelle, Schnittpunkt mit der y-Achse | croissante / décroissante, zéro, point d’intersection avec l’axe des ordonnées | 3.1 |
| Weg-Zeit-Diagramm, Weg $s$ | diagramme distance-temps, distance $d$ | 3.1, widget wegzeit8 (axis « d en m ») |
| Zuhause, Haltestelle, Schule | Maison, Arrêt, École | widget wegzeit8 |
| Klimadiagramm (Deutscher Wetterdienst), Bildfahrplan (Ibry) | diagramme climatique (Météo-France), horaire graphique | 3.1 |
| lineare Funktion $y = mx + n$, Anstieg $m$, y-Achsenabschnitt $n$ | fonction affine, coefficient directeur (pente) $m$, ordonnée à l’origine $n$ | 3.2: the letters stay as the widget gerade writes them; the aside names $f(x) = ax + b$ once; $n = 0$: fonction linéaire |
| Differenzenquotient, Steigungsdreieck, Gefälle | taux d’accroissement, triangle de pente, descente (pente) | 3.2 |
| Schnittpunkt $S$ (two lines) | point d’intersection $I$ | 3.2 page text |
| Regressionsgerade, Methode der kleinsten Quadrate, Trendlinie | droite de régression, méthode des moindres carrés, courbe de tendance | 3.2; Excel PENTE, ORDONNEE.ORIGINE |
| Algorithmus: Eingabe, Wenn, Sonst, Ausgabe | Entrée, Si, Sinon, Sortie | 3.2 method box |
| Körpergröße $h$, Schuhgröße $s$; Federkraftmesser | taille $t$, pointure $p$; dynamomètre à ressort | 3.2 |
| lineares Gleichungssystem, Lösbarkeit, vollständige Fallunterscheidung | système d’équations linéaires, nombre de solutions, étude exhaustive des cas | 3.3 |
| Einsetzungs-, Gleichsetzungs-, Additionsverfahren | méthode par substitution, par comparaison, par combinaison | widget lgs8: Substitution, Comparaison, Combinaison |
| Schnittpunkt $S$ (widget geraden), Lösungsmenge $L$ (widget lgs8) | $I$, $S = \{(2\,;\,3)\}$ | rules in js/buch-fr/gy8.js, only on the pages of this book |
| schneidend, parallel, identisch, orthogonal (lines) | sécantes, parallèles, confondues, perpendiculaires | as the widget lage says |
| Fasane und Hasen (Sunzi) $f$, $h$ | faisans et lapins $f$, $l$ | 3.3, the classic French wording of the puzzle |
| Erwachsene $e$ / Jugendliche $j$, Autos $a$ / Motorräder $m$, Boot $b$ / Fluss $f$, Kerze rot $r$ / weiß $w$, Rechteck $a$, $b$ | adultes $a$ / jeunes $j$, voitures $v$ / motos $m$, bateau $b$ / courant $c$, bougie rouge $r$ / blanche $b$, $L$, $\ell$ | 3.3 page text |
| zentrische Streckung, Streckzentrum $Z$, Streckfaktor $k$, Bildpunkt $P'$ | homothétie, centre $O$, rapport $k$, point image $P'$ | 4.1; widget streckung8 by rules (the drawn « Z » becomes O) |
| $\overline{ZP}$ (length), Strecke, Gerade, Strahl | $OP$, segment $[OP]$, droite $(OP)$, demi-droite | 4.1 aside names the German $Z$ and $\overline{ZP}$ once |
| Vergrößerung, Verkleinerung, Punktspiegelung an $Z$ | agrandissement, réduction, symétrie centrale de centre $O$ | 4.1 |
| geradentreu, parallelentreu, winkeltreu | conserve l’alignement, le parallélisme, les angles | 4.1 |
| Verhältnisgleichung, Strahlensätze | égalité de rapports, théorème de Thalès | 4.1 |
| Flächeninhalt $A' = k^2 \cdot A$ | $\mathcal{A}' = k^2 \times \mathcal{A}$ | 4.1: the area is $\mathcal{A}$ where A is a point |
| DGS, GeoGebra Streckung | géométrie dynamique, Dilate | English command name, said once |
| Storchschnabel, Pantograph | pantographe (« Storchschnabel », bec de cigogne) | 4.1 excursion |
| Ähnlichkeit, ähnlich, kongruent | figures semblables, semblables, superposables | 4.2; widget aehnlich8 |
| Hauptähnlichkeitssatz | critère des deux angles | 4.2 |
| entsprechende Winkel / Seiten, Stufenwinkel | angles / côtés correspondants, angles correspondants (parallèles) | 4.2 |
| Hilfsfigur, Vorwärts- / Rückwärtsarbeiten | figure auxiliaire, raisonner en avant / en arrière | 4.2, 5 |
| Schattenmethode, Schatten $s$, $S$, Försterdreieck, Daumensprung | méthode des ombres, ombres $o$, $O$, triangle du forestier, saut du pouce | widget schatten8 (the drawn s, S become o, O) |
| Maßstab $1 : m$, Einheitswürfel | échelle $1/m$, cube unité | 4.2, widget gulliver8 |
| Liliputaner | Lilliputiens | 4.2 |
| heuristische Strategien, Vorwärts- / Rückwärtsarbeiten, Umkehrrechnung | stratégies de résolution de problèmes, raisonner en avant / en arrière, opération inverse | 5, widget rueckwaerts8 (« fois », « divisé par », × in the chain) |
| Lösungsplan: verstehen, planen, durchführen, zurückschauen; Teilziel | plan de résolution : comprendre, planifier, exécuter, prendre du recul ; étape intermédiaire | 5 |
| Pólya: How to Solve It (Schule des Denkens) | Comment poser et résoudre un problème | 5 excursion |
| Hühner / Kaninchen $h$, $k$; Uhrzeit 10:30 Uhr | poules / lapins $p$, $l$; 10 h 30 | 5 |
| Wahlbereich 3 (chapter W) | Domaine optionnel 3 (chapter OP) | as section 1 |
| Zufallszahlen, strukturgleich, Monte-Carlo-Methode, Pseudozufall | nombres aléatoires, de même structure, méthode de Monte-Carlo, pseudo-hasard | OP |
| Viertelkreis (points inside) | quart de disque | widget mcpi8 |
| Sammelalbum, Tüte, Bild | album de vignettes, pochette, vignette | widget sammel8 |
| Ziegenproblem, Moderator | problème de Monty Hall, animateur | as section 5 and the widget ziegen |
| Lab names | CRYPTARITHMES, LABORATOIRE DES BINÔMES, LE JEU DE DÉS, PLANCHE DE GALTON, LABORATOIRE DU REPÈRE, LABORATOIRE DES PARABOLES, LABORATOIRE DE STATISTIQUE, LABORATOIRE DE LA PENTE, SYSTÈMES D’ÉQUATIONS, TRANSFORMATIONS, PYTHAGORE, SIMULATION D’ÉPIDÉMIE | FALLING PI, COLLATZ stay |

## mathegy9-fr

<!-- fr-16: terms of this book only (GY 9), write right below this line -->

Package fr-16 (Libermann), 26.10.2026: decisions made while translating GY 9; nothing above was changed. French school
letters everywhere (Doc, 26.10.2026: "lokal bitte immer"), in the pages and, through rules in js/buch-fr/geometrie.js
and js/buch-fr/daten.js, in what the widgets write.

| German | French | Note |
|---|---|---|
| Gymnasium, Klasse 9 | Gymnasium, 9e année | start page as mathegy10-fr, plus one sentence on the notation (×, P, A, points, [AB], (AB)) |
| Wahlbereich (chapter W) | Domaine optionnel (chapter OP) | as section 1 |
| $a \cdot b$ | $a \times b$ | pages and widgets; rule in js/buch-fr/geometrie.js (every GY 5–9 and OS 5 page that loads it) and in the extremwert words; the funktionen widgets shared with round 1/2 keep their · |
| Potenzieren, Radizieren, n-te Wurzel | élever à une puissance, extraire une racine, racine n-ième | 1.1 |
| Potenzgesetze, Permanenzprinzip | règles de calcul sur les puissances, principe de permanence | 1.1 |
| Wurzelgleichung, Scheinlösung, Probe | équation avec racine (équation irrationnelle), fausse solution, vérification | 1.1; $L = \{\,\}$ → $S = \emptyset$ |
| Potenzfunktion, Parabel n-ter Ordnung, Hyperbel | fonction puissance, parabole d’ordre $n$, hyperbole | 1.2, widget potenzfunktion |
| Polstelle mit / ohne Vorzeichenwechsel | pôle avec / sans changement de signe | 1.2 |
| Polynom, Grad | polynôme, degré | 1.2 |
| Normalform $x^2 + px + q$, allgemeine Form $ax^2 + bx + c$, Scheitelpunktform | forme normalisée, forme développée (générale), forme canonique | 1.3; the parabel widget (fr-1) says « Forme développée » for $ax^2 + bx + c$ |
| quadratische Ergänzung | mise sous forme canonique | 1.3, 1.4 |
| Diskriminante $D = (p/2)^2 - q$ | discriminant $D$ | 1.4 adds once: en France $\Delta = b^2 - 4ac$, même signe |
| Satz von Vieta, Nullproduktsatz | relations de Viète, règle du produit nul | 1.4 |
| Extremwertaufgabe, Zielgröße, Nebenbedingung | problème d’optimisation, grandeur à optimiser, contrainte | 1.4, widget extremwert |
| Einnahmen $E(x)$ | recette $R(x)$ | 1.4, 5 |
| Schnittpunkte $S_1$, $S_2$ | $I_1$, $I_2$ | 1.4; S stays for the vertex (sommet) |
| Umfang $u$ | périmètre $P$ | 2, 3.2; widgets kreisteil, vieleck |
| Kreisbogen $b$, Kreisausschnitt, Kreisring $r_a$, $r_i$ | arc $\ell$, secteur circulaire, couronne $r_e$, $r_i$ | 2, widget kreisteil |
| Grundfläche $G$, Mantel(fläche) $M$, Oberfläche $O$ | aire de la base $\mathcal{B}$, aire latérale $A_L$, aire totale $A$ | 2, 3.3; widgets koerper (on the GY pages) and spitzkoerper |
| Kreiszylinder, Kugel, Kreiskegel | cylindre de révolution, boule (aire de la sphère), cône de révolution | 2, 3.3 |
| Dichte $\varrho$ | masse volumique $\varrho$ | 2 |
| $\ell$, m$\ell$ | L, mL | as OS 5 |
| Satzgruppe des Pythagoras | Pythagore et les relations métriques | 3.1 title |
| Kathete, Hypotenuse, Hypotenusenabschnitte $p$, $q$ | côté de l’angle droit, hypoténuse, segments de l’hypoténuse $p$, $q$ | 3.1 |
| Höhensatz, Kathetensatz | théorème de la hauteur, théorème d’Euclide | Swiss-French names; 3.1 says once that France speaks of « relations métriques dans le triangle rectangle »; widget pythagoras |
| Thaleskreis über $\overline{AB}$ | cercle de diamètre $[AB]$ | widget pythagoras |
| Länge $\overline{AB}$, Strecke $\overline{AB}$ | $AB$, segment $[AB]$ | 3.1, OP; widget goldenerschnitt « $AB = 10$ » |
| Voraussetzung $V$, Behauptung $B$, Umkehrung, genau dann wenn | hypothèse $H$, conclusion $C$, réciproque, si et seulement si | 3.1 |
| indirekter Beweis | raisonnement par l’absurde | 3.1 |
| SSS | CCC | as fr-6 |
| Gegenkathete, Ankathete | côté opposé, côté adjacent | 3.2; mnemonic CAH SOH TOA instead of GAG-HHA; widget trigo |
| Umkehrtasten $\sin^{-1}$ | touches $\sin^{-1}$ (en France : Arcsin) | 3.2 |
| Höhenwinkel, Tiefenwinkel, Steigung in % | angle d’élévation, angle de dépression, pente en pourcentage | 3.2 |
| regelmäßiges $n$-Eck, Seite $s$, Umkreis | polygone régulier à $n$ côtés, côté $c$, cercle circonscrit | 3.2, OP (pentagon: côté $c$, diagonale $d$) |
| Geodreieck, Winkelmesser (selbst gebaut) | équerre-rapporteur (explained once), rapporteur de visée | 3.2, 3.3 |
| Seitenhöhe $h_s$, Seitenkante $s$, Mantellinie $s$ | apothème $h_a$, arête latérale $\ell$, génératrice $g$ | 3.3, widgets spitzkoerper and koerper |
| Landvermessung | arpentage | 3.3 |
| Modalwert, Median, arithmetisches Mittel | mode, médiane, moyenne (arithmétique) | 4, widget mittelwerte |
| Nominal-, Ordinal-, metrische Skala | échelle nominale, ordinale, métrique | 4 |
| absolute / relative Häufigkeit $h_i$ | effectif $n_i$ / fréquence | 4, widget histogramm |
| Spannweite $R$, Varianz $s^2$, Standardabweichung $s$ | étendue $e$, variance $V$, écart type $\sigma$ | 4, widget streuung |
| Klasse $[150;\,155)$, Klassenbreite | classe $[150\,;\,155[$, amplitude | 4, rule in js/buch-fr/daten.js |
| Ausreißer, Prozentpunkte | valeur aberrante, points de pourcentage | 4 |
| Tabellenkalkulation MITTELWERT, STABW.N, STABW.S | tableur MOYENNE, ECARTYPE.PEARSON, ECARTYPE.STANDARD | 4, 5 (French Excel) |
| goldener Schnitt, goldene Zahl $\Phi$ | section dorée (partage en extrême et moyenne raison), nombre d’or $\Phi$ | OP title « Le nombre d’or » |
| größerer / kleinerer Teil, goldenes Rechteck / Dreieck | grande / petite partie, rectangle d’or / triangle d’or | OP, widget goldenerschnitt |
| Lab names | LABORATOIRE DES PUISSANCES, IDENTITÉS REMARQUABLES, LABORATOIRE DU REPÈRE, LABORATOIRE DES PARABOLES, PRINCIPE DE CAVALIERI, SOLIDES, PYTHAGORE, DÉMONSTRATION DE PYTHAGORE, TRIGONOMÉTRIE, LABORATOIRE DES POLYGONES, PLANCHE DE GALTON, DROITE D’AJUSTEMENT, LABORATOIRE FIBONACCI | FALLING PI, COOL SQUARES, COLLATZ stay |
