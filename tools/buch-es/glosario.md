# Glosario — the Spanish editions (BGY 11, 12, 13)

Package ES0, 12.10.2026. Every recurring term once, decided for `mathe11-es`, `mathe12-es` and `mathe13-es`.
Spanish of Spain, the pupil is **tú**. A book package that needs a missing term adds it in its own block at the end
(`## Added by es-1 mathe11-es` …); an existing line is never changed without saying so in the PR.

Columns: German · Spanish · note. In headings (`b-band-tag`, `b-box-title`, kickers) the Spanish goes in capitals with
the accents kept (`CAPÍTULO`, `LECCIÓN`), as Orbitron draws them.

## 1. The book and its parts

| German | Spanish | Note |
|---|---|---|
| Interaktives Lehrbuch | Libro de texto interactivo | kicker: LIBRO DE TEXTO INTERACTIVO · SAJONIA |
| Mathematik · Berufliches Gymnasium 11 | Matemáticas · Berufliches Gymnasium 11 | book title; `short`: Matemáticas 11 |
| Deutsche Ausgabe | Edición alemana | button on the start page |
| English edition | English edition | button, stays English |
| Titelseite | Portada | data-toc |
| Inhalt | Índice | data-toc, band; "← ÍNDICE", "Todos los capítulos" |
| So arbeitest du mit dem Buch | Cómo usar este libro | |
| Kapitel | Capítulo | "CAPÍTULO 3.2" |
| Lernbereich (LB) | Área de aprendizaje | "Área de aprendizaje 3" |
| Wahlbereich | Optativa | "Optativa 3" (BGY 11, chapter E) |
| Wahlpflicht | Optativa obligatoria | "Optativa obligatoria 1" (BGY 13, chapters OP.1–OP.3) |
| Kapitel W, W.1 (chapter number) | OP, OP.1 | not "O": in Orbitron O and 0 look alike; the English editions say E |
| Kapitel A (Abitur) | A | |
| Abitur | Abitur | stays; explained once on the start page (examen final del bachillerato alemán) |
| Ustd. (Unterrichtsstunden) | sesiones | "20 SESIONES" in the chapter list |
| Klausur | examen | |
| Klasse 11 | 11.º curso | "Clase 11" is wrong |
| Schuljahr 2026/27 | curso 2026/27 | |
| Sachsen, sächsisch | Sajonia, sajón | "plan de estudios de Sajonia" |
| Lehrplan | plan de estudios | |
| Stoffverteilungsplan | programación del curso | |
| Arbeitsblatt, Wochenquiz | ficha, cuestionario semanal | stay German: "(en alemán)" once where linked |
| Lab | laboratorio | "Los laboratorios se abren en una pestaña nueva" |
| Fehler melden | Informar de un error | header |
| Seiten (overview) | Páginas | header pill, only with a print edition |

The school names stay as names (no false friend: *gimnasio* is a sports hall). The start page says once:
*El Berufliches Gymnasium es un bachillerato alemán con orientación profesional (de 11.º a 13.º curso) que termina con el
Abitur.* Gymnasium, Fachoberschule, Oberschule the same way where they appear.

## 2. The sections of a chapter

| German | Spanish | Note |
|---|---|---|
| Auftakt | Introducción | data-toc |
| Das lernst du in diesem Kapitel | Lo que aprenderás en este capítulo | box title |
| Check-in: Das kannst du schon? | Check-in: ¿ya sabes hacerlo? | |
| Erkundungen | Exploraciones | |
| Lerneinheit 3 | Lección 3 | band "LECCIÓN 3" |
| Einstieg | Para empezar | |
| Merke / Merkkasten | Recuerda / Recuadro «Recuerda» | box title "RECUERDA" |
| Beispiel 2 | Ejemplo 2 | "EJEMPLO 2 · LA LATA" |
| Zum Beispiel | Por ejemplo | |
| Interaktiv | Interactivo | |
| Teste dich! | ¡Ponte a prueba! | |
| Aufgaben | Ejercicios | |
| Wiederholen · Vertiefen · Vernetzen | Repasar · Profundizar · Relacionar | |
| Exkursion | Excursión | |
| Rückblick | Repaso final | data-toc, band |
| Zum Wiederholen | Para repasar | |
| Test | Test | |
| Runde 1 · ohne Hilfsmittel | Ronda 1 · sin calculadora | "Hilfsmittel" = calculadora y fórmulas; the English says "without a calculator" |
| Runde 2 · mit Hilfsmitteln | Ronda 2 · con herramientas digitales | |
| Ohne Hilfsmittel (box) | Sin herramientas | |
| Gebiet 1 (abi) | Bloque 1 | |
| Tipp | Pista | button |
| Lösung / Lösung zeigen | Solución / Ver solución | buttons |
| Ergebnis | Resultado | self-check label |
| Prüfen | Comprobar | |
| richtig | correcto | "✓ correcto" |
| noch nicht – versuch es noch einmal | todavía no – inténtalo otra vez | |
| noch nicht – schau dir die Lösung an | todavía no – mira la solución | |
| z. B. 3/10 | p. ej. 3/10 | placeholder |
| gelöst | resueltos | "5 RESUELTOS" |
| ← Zurück · Kapitel / Weiter → | ← ATRÁS · CAPÍTULO / SIGUIENTE → | chapter cards |
| Zurücksetzen | Reiniciar | widgets |
| Zurück (undo) | Deshacer | widgets |

## 3. Levels

| German | Spanish |
|---|---|
| Niveau | Nivel |
| Grundlage | Básico |
| Mittel | Intermedio |
| Anspruchsvoll | Avanzado |

## 4. Numbers and notation

- Decimal comma as in German: `0,5`; thousands with a point (`10.000`, what `toLocaleString('de-DE')` writes) or a thin
  space in TeX (`10\,000`). `data-ans` exactly as in the German book.
- Percent with a space: `30 %` (RAE).
- Points and intervals with whole numbers: `P(2, 3)`, `[a, b]`. As soon as a coordinate has a decimal comma, a
  semicolon: `P(1,5; 2)`, `[0,5; 3]`. In TeX `P(1{,}5;\, 2)`. The engine `js/buch-es.js` does this for what widgets
  write (`\mid` → `,` or `;`); the page text is written that way by hand.
- Months in lower case: `septiembre`, `octubre · noviembre`, `finales de septiembre`.

## 5. Maths terms

### Functions and calculus

| German | Spanish | Note |
|---|---|---|
| Funktion, Funktionsgraph | función, gráfica de la función | |
| Definitionsbereich, Wertebereich | dominio, recorrido | |
| Nullstelle | cero (raíz) | "los ceros de f" |
| Monotonie, monoton steigend/fallend | monotonía, creciente/decreciente | |
| Symmetrie, achsensymmetrisch, punktsymmetrisch | simetría, simétrica respecto al eje y / al origen | |
| Steigung | pendiente | |
| Achsenabschnitt | ordenada en el origen | |
| Normalparabel | parábola normal ($y = x^2$) | |
| Scheitelpunkt | vértice | |
| Strecken, Stauchen, Verschieben | estirar, comprimir, desplazar | |
| Umkehrfunktion | función inversa | |
| Logarithmus | logaritmo | |
| Wachstum, Zerfall | crecimiento, decrecimiento | |
| Verhalten im Unendlichen | comportamiento en el infinito | |
| Grenzwert | límite | |
| Asymptote | asíntota | |
| Stetigkeit | continuidad | |
| Änderungsrate (mittlere/momentane) | tasa de variación (media/instantánea) | |
| Sekante, Tangente, Normale | secante, tangente, normal | |
| Ableitung, ableiten | derivada, derivar | |
| Ableitungsregeln: Potenz-, Summen-, Faktorregel | reglas de derivación: regla de la potencia, de la suma, del factor constante | |
| Produktregel, Kettenregel | regla del producto, regla de la cadena | |
| grafisches Ableiten | derivar gráficamente | |
| Hochpunkt, Tiefpunkt | máximo, mínimo (punto máximo/mínimo) | |
| Extremum, Extremstelle | extremo | |
| Wendepunkt | punto de inflexión | |
| Sattelpunkt | punto de silla | |
| Krümmung (links/rechts) | curvatura (cóncava hacia arriba / hacia abajo) | Linkskurve = convexa; say it in words, not convexa/cóncava alone |
| Steckbriefaufgabe | problema de reconstrucción («buscar la función») | |
| Extremwertproblem | problema de optimización | |
| Funktionenschar | familia de funciones | |
| Stammfunktion | primitiva | |
| unbestimmtes / bestimmtes Integral | integral indefinida / definida | |
| Hauptsatz | teorema fundamental del cálculo | |
| rekonstruierter Bestand | cantidad reconstruida | |
| Flächeninhalt | área | |
| Rechteck-, Trapezmethode | método de los rectángulos, de los trapecios | |
| Bisektion | bisección | |
| Monte-Carlo-Methode | método de Montecarlo | |
| Regression, Messreihe | regresión, serie de medidas | |
| Sinusfunktion, Periode, Amplitude | función seno, período, amplitud | |

### Equations, linear algebra, vectors

| German | Spanish | Note |
|---|---|---|
| Gleichung, Formel umstellen | ecuación, despejar una fórmula | |
| Lineares Gleichungssystem (LGS) | sistema de ecuaciones lineales | |
| Gauß-Verfahren | método de Gauss | |
| Lösungsmenge | conjunto solución | |
| Matrix, Matrizen | matriz, matrices | |
| Vektor, Ortsvektor | vector, vector de posición | |
| Betrag (eines Vektors) | módulo | "Betrag" of a number: valor absoluto — two meanings, never a global word |
| Mittelpunkt | punto medio | |
| Skalarprodukt | producto escalar | |
| Vektorprodukt (Kreuzprodukt) | producto vectorial | |
| orthogonal | ortogonal (perpendicular) | |
| Gerade, Ebene | recta, plano | |
| Parametergleichung | ecuación paramétrica | |
| Koordinatengleichung | ecuación general (cartesiana) del plano | |
| Normalenvektor | vector normal | |
| Lagebeziehung | posición relativa | |
| Spurpunkt | punto de traza | |
| Schnittpunkt, Schnittwinkel | punto de intersección, ángulo de intersección | |
| windschief | se cruzan | "las rectas se cruzan" |
| Prisma, Pyramide, Oberfläche, Volumen | prisma, pirámide, área total, volumen | |
| Trapez | trapecio | |
| Viereck, Parallelogramm, Raute | cuadrilátero, paralelogramo, rombo | |

### Probability and statistics

| German | Spanish | Note |
|---|---|---|
| Zufallsversuch (mehrstufig) | experimento aleatorio (de varias etapas) | |
| Baumdiagramm, Pfad, Pfadregel | diagrama de árbol, rama, regla de las ramas | |
| Vierfeldertafel | tabla de contingencia 2×2 | |
| bedingte Wahrscheinlichkeit | probabilidad condicionada | |
| stochastisch unabhängig | independiente | |
| Urne, Ziehen mit/ohne Zurücklegen | urna, extracción con/sin reemplazamiento | |
| Glücksrad | ruleta | |
| Würfel (game) / Würfel (solid) | dado / cubo | two meanings, never a global word |
| Münze | moneda | |
| relative Häufigkeit | frecuencia relativa | |
| Zufallsgröße | variable aleatoria | |
| Wahrscheinlichkeitsverteilung | distribución de probabilidad | |
| Erwartungswert, Varianz, Standardabweichung | esperanza (valor esperado), varianza, desviación típica | |
| faires Spiel | juego justo | |
| Bernoulli-Kette, Treffer | proceso de Bernoulli, éxito | "Treffer" = éxito |
| Binomialverteilung, Binomialkoeffizient | distribución binomial, coeficiente binomial | |
| kumulierte Wahrscheinlichkeit | probabilidad acumulada | |
| Grundgesamtheit, Stichprobe | población, muestra | |
| Stichprobenmittel, -varianz | media muestral, varianza muestral | |
| Hypothese, Nullhypothese | hipótesis, hipótesis nula | |
| Signifikanztest, Signifikanzniveau | contraste de hipótesis, nivel de significación | |
| Ablehnungsbereich, Annahmebereich | región de rechazo, región de aceptación | |
| Fehler 1. Art / 2. Art | error de tipo I / de tipo II | |
| einseitig, zweiseitig | unilateral, bilateral | |
| Sensitivität, Spezifität | sensibilidad, especificidad | |
| Simulation | simulación | |

### Applications

| German | Spanish |
|---|---|
| Kosten, Erlös, Gewinn | costes, ingresos, beneficio |
| Gewinnschwelle, Gewinngrenze | umbral de rentabilidad, límite de beneficio |
| gleichmäßig beschleunigte Bewegung | movimiento uniformemente acelerado |
| Abstand | distancia |

## Added by es-2 mathe12-es

| German | Spanish | Note |
|---|---|---|
| Üben (data-toc-short), Wiederholen-Abschnitt | Practicar | section letter P; Auftakt has the letter I (Introducción) |
| Klasse 12 (running text, footer) | 12.º curso | |
| Mehr üben online | Más práctica en línea (en alemán) | heading above the lab and test links |
| Polstelle, (Definitions-)Lücke | polo, hueco | |
| ganzrationale / gebrochenrationale Funktion | función polinómica / función racional | |
| Zählergrad, Nennergrad | grado del numerador, grado del denominador | |
| einseitige Grenzwerte, links-/rechtsseitig | límites laterales, por la izquierda / por la derecha | |
| waagerechte / senkrechte Asymptote | asíntota horizontal / vertical | |
| stetig, stetige Ergänzung | continua, extensión continua | |
| Vorzeichenwechsel, Vorzeichentabelle | cambio de signo, tabla de signos | |
| Differenzenquotient, Differenzialquotient | cociente incremental, cociente diferencial | |
| differenzierbar, Ableitungsfunktion | derivable, función derivada | |
| Momentan-, Durchschnittsgeschwindigkeit | velocidad instantánea, velocidad media | |
| Steigungsdreieck | triángulo de pendiente | |
| Quotientenregel | regla del cociente | |
| Bogenmaß | radianes | |
| e-Funktion, eulersche Zahl | función exponencial, número e | |
| sin x | sen x in running text; `\sin` in TeX stays (renders "sin") | open: Doc may prefer `\operatorname{sen}` in TeX |
| Monotoniesatz, streng monoton | teorema de monotonía, estrictamente creciente/decreciente | |
| notwendige / hinreichende Bedingung | condición necesaria / suficiente | |
| lokales / globales Extremum, Randwerte | extremo local / global, valores en los extremos del intervalo | |
| Kurvendiskussion | estudio de funciones | the chapter title 2.5 stays "Estudio de gráficas" (ES0) |
| Wendetangente, Berührpunkt | tangente de inflexión, punto de tangencia | |
| Zielfunktion, Nebenbedingung, Randextremum | función objetivo, condición de ligadura, extremo en la frontera | |
| Ansatz, Probe | planteamiento, comprobación | |
| Grenzkosten | coste marginal | |
| Hochpunkt H, Tiefpunkt T, Wendepunkt W (letters) | the letters H, T, W stay in formulas | same answers as the German book |
| unvereinbar, Unvereinbarkeit | incompatibles, incompatibilidad | |
| Multiplikationssatz | regla de la multiplicación | |
| falsch positiv | falso positivo | |
| Gegenereignis | suceso contrario | |
| Ziegenproblem | problema de Monty Hall | |
| Wappen / Zahl (Münze) | cara / cruz | outcome letters C / X (WWZ → CCX) |
| Augensumme, Augenzahl | suma de puntos, número de puntos | |
| Einsatz, Auszahlung, Gewinn (Spiel) | apuesta, premio, ganancia | |
| Stabdiagramm | diagrama de barras | |
| Streuung | dispersión | |
| Bernoulli-Experiment, Niete | experimento de Bernoulli, fracaso | |
| Fakultät | factorial | |
| Galtonbrett | tablero de Galton | |
| rechtsschief / linksschief | asimétrica hacia la derecha / hacia la izquierda | |
| Kenngrößen, Faustregel | parámetros, regla práctica | |
| Einheitsvektor, Nullvektor, Verbindungsvektor | vector unitario, vector nulo, vector que une dos puntos | |
| Linearkombination, kollinear | combinación lineal, colineales | |
| Quader, Raumdiagonale | ortoedro, diagonal del ortoedro | |
| Schwerpunkt (Dreieck), Seitenhalbierende | baricentro, mediana | |
| spitzer / stumpfer / rechter Winkel | ángulo agudo / obtuso / recto | |
| gleichseitig, gleichschenklig | equilátero, isósceles | |
| Satz des Pythagoras / des Thales | teorema de Pitágoras / de Tales | |
