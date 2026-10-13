# Glosario — the Spanish editions (all books)

Package ES0, 12.10.2026. Every recurring term once, decided for `mathe11-es`, `mathe12-es` and `mathe13-es`.
Spanish of Spain, the pupil is **tú**. A book package that needs a missing term adds it in its own block at the end
(`## Added by es-1 mathe11-es` …; round 2, 13.10.2026: the blocks `## Added by <book>-es` are already there, write only in yours); an existing line is never changed without saying so in the PR.

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

## Added by es-3 mathe13-es

Terms BGY 13 needed that were missing above (12.10.2026). Nothing above was changed.

| German | Spanish | Note |
|---|---|---|
| Mehr üben online | MÁS PRÁCTICA EN LÍNEA (EN ALEMÁN) | heading of the online-practice box; the linked material stays German |
| Üben (data-toc-short) | Practicar | |
| Rückmeldung sofort | respuesta inmediata | "DOS RONDAS · RESPUESTA INMEDIATA" |
| Das Wichtigste auf einen Blick | Lo esencial de un vistazo | |
| Anschluss an … | Enlaza con … | |
| Eingangstest | test de entrada | |
| Checkliste, Abituraufgabe, Abschlusstest | lista de control, problema de Abitur, test final | |
| Operatoren (berechne, begründe …) | verbos de la consigna («calcula», «justifica» …) | |
| Folgefehler | errores arrastrados | |
| Integrationsregeln | reglas de integración | |
| ganzrationale Funktion, Potenzfunktion | función polinómica, función potencia | |
| Probe (durch Ableiten) | comprobación (comprueba derivando) | |
| Anfangsbedingung | condición inicial | |
| Bestand, Anfangsbestand, Gesamtänderung | cantidad, cantidad inicial, variación total | with "cantidad reconstruida" above |
| Zuflussrate | caudal de entrada | not "tasa de entrada"; outflow: salida |
| Intervalladditivität, Linearität | aditividad respecto al intervalo, linealidad | |
| Flächenfunktion | función área | |
| Grenzen (des Integrals) | límites de integración | |
| Schnittstelle | abscisa del punto de intersección | "se cortan en …"; in widgets: puntos de intersección |
| Differenzfunktion | función diferencia | |
| Teilfläche, Teilintegral | área parcial, integral parcial | |
| Streifen (numerical integration) | franja | |
| Stützstellen | nodos | |
| Rechtecke links / Mitte | rectángulos por la izquierda / por el punto medio | |
| Keplersche Fassregel | regla de los toneles de Kepler | |
| Mittelwert einer Funktion | valor medio | |
| Grenzkosten, Fixkosten, Stückkosten | coste marginal, costes fijos, coste unitario | |
| Erlös (Funktion), Grenzerlös | ingresos, ingreso marginal | |
| Gewinnzone, Gewinnmaximum | zona de beneficio, beneficio máximo | |
| Betriebsoptimum, langfristige Preisuntergrenze | óptimo de explotación, precio mínimo a largo plazo | |
| Cournotscher Punkt | punto de Cournot | |
| Stück (unit) | unidades | "€ por unidad" |
| Ortskurve | lugar geométrico | |
| beurteilende Statistik | estadística inferencial | |
| Stichprobenumfang, Stichprobenanteil | tamaño de la muestra, proporción muestral | |
| Gegenhypothese | hipótesis alternativa | |
| Testgröße, kritischer Wert, Entscheidungsregel | estadístico de contraste, valor crítico, regla de decisión | |
| rechtsseitig / linksseitig (Test) | por la derecha / por la izquierda | "contraste por la derecha"; zweiseitig: bilateral |
| Irrtumswahrscheinlichkeit | probabilidad de error | |
| Wappen (Münze) | cara | |
| Richtungsvektor, Spannvektoren | vector director, vectores directores (of a plane) | |
| Stützpunkt, Stützvektor | punto base, vector de posición | |
| Punktprobe | prueba de pertenencia | |
| Parameterform, Achsenabschnittsform | forma paramétrica, ecuación segmentaria | Koordinatenform: ecuación general (above) |
| Koordinatenebenen, Koordinatenachsen | planos coordenados, ejes de coordenadas | |
| Spurdreieck | triángulo de trazas | |
| Lage zweier Geraden: identisch, (echt) parallel, schneidend, windschief | coincidentes, paralelas (y distintas), secantes, se cruzan | "se cruzan" only for skew lines; to intersect = cortarse |
| liegt in der Ebene | está contenida en el plano | |
| Mantel(fläche), Grundfläche, Deckfläche | superficie lateral, (área de la) base, base superior | Oberfläche: área total (above) |
| Grundkante, Seitenfläche, Spitze (Pyramide) | arista de la base, cara lateral, vértice | |
| Pyramidenstumpf | tronco de pirámide | |
| Lotfußpunkt | pie de la perpendicular | |
| Stufenform | forma escalonada | |

## Added by es-1 mathe11-es

Package ES1, 12.10.2026: the terms BGY 11 needed that the tables above do not have. No existing line was changed.
Two decisions differ in wording from a line above, see the notes ("Sin calculadora", "rama/segmento").

### Navigation and recurring headings

| German | Spanish | Note |
|---|---|---|
| data-toc-k (letters of the section list) | I · E · 1–4 · P · X · R · T | Introducción, Exploraciones, lecciones, Repasar · Profundizar · Relacionar, Excursión, Repaso final, Test; P also for "Projekt" (3.7) |
| Üben (data-toc-short) | Práctica | |
| OHNE HILFSMITTEL (chip, band, test round) | SIN CALCULADORA | used throughout BGY 11, in line with "Ronda 1 · sin calculadora"; the line "Ohne Hilfsmittel (box) → Sin herramientas" above was not needed |
| MIT HILFSMITTELN | CON HERRAMIENTAS DIGITALES | |
| Zwei Runden · Rückmeldung sofort | DOS RONDAS · RESPUESTA INMEDIATA | |
| Mehr üben online | MÁS PRÁCTICA EN LÍNEA (EN ALEMÁN) | the weekly quizzes are German |
| Das Wichtigste auf einen Blick | LO MÁS IMPORTANTE DE UN VISTAZO | |
| Zum Weiterdenken | PARA SEGUIR PENSANDO | |
| Ausblick | PERSPECTIVA | |
| Methode, Methodenbewusstsein | MÉTODO, CONCIENCIA DEL MÉTODO | |
| Denk mit | PIENSA CON NOSOTROS | |
| Projekt | Proyecto | |
| BNE (Bildung für nachhaltige Entwicklung) | EDUCACIÓN PARA EL DESARROLLO SOSTENIBLE | chip |
| Klasse 12, Jahrgangsstufe 13 | 12.º curso, 13.º curso | |
| GTR | calculadora gráfica | CAS stays CAS |
| GeoGebra / Excel commands | Spanish names: Resuelve, NResuelve, Raíz, Si, AjusteLineal, AjusteExponencial, AjustePolinómico, Secuencia, AleatorioEntre, ContarSi; =SI, ALEATORIO.ENTRE, CONTAR.SI (with `;`) | |
| Lab and quiz names | translated on the card, "(en alemán)" once | e.g. Potenzlabor → LABORATORIO DE POTENCIAS |

### Functions

| German | Spanish | Note |
|---|---|---|
| Wertetabelle, Funktionswert | tabla de valores, valor de la función | |
| Wortvorschrift | descripción verbal | |
| Senkrechtentest | prueba de la recta vertical | |
| streng monoton fallend | estrictamente decreciente | |
| Periodizität, Nullfunktion | periodicidad, función nula | |
| Grundfunktion | función básica | |
| Steckbrief (einer Funktion) | ficha de identidad | 3.7; not the Steckbriefaufgabe of BGY 12 |
| markante Punkte | puntos característicos | |
| Streckung, Stauchung, Spiegelung an der x-Achse, Verschiebung | estiramiento, compresión, reflexión respecto al eje x, desplazamiento | |
| Term | expresión | |
| modellieren, Modellierungskreislauf | modelizar, ciclo de modelización | |
| Wachstumsfaktor | factor de crecimiento | |
| Halbwertszeit | período de semidesintegración | short form *semivida* after it was introduced once (3.2) |
| Verdopplungszeit | tiempo de duplicación | |
| Zinseszins | interés compuesto | |
| lineare Abschreibung, Buchwert | amortización lineal, valor contable | |
| Grundgebühr, Flatrate | cuota fija, tarifa plana | |
| Scheitelpunktform, Normalform | forma canónica, forma general | the vertex keeps the letter S |
| Lösungsformel | fórmula general | |
| Satz von Vieta | fórmulas de Vieta | |
| quadratische Ergänzung | completar el cuadrado | |
| ausmultiplizieren, ausklammern | desarrollar, sacar factor común | |
| Diskriminante | discriminante | |
| Produkt-Null-Regel | regla del producto nulo | |
| Anhalteweg, Bremsweg | distancia de detención, distancia de frenado | |
| Einheitskreis | circunferencia goniométrica | |
| Bogenmaß | radianes | |
| Mittellinie | línea media | |
| Schieberegler | deslizador | |
| Wurzelfunktion | función raíz cuadrada | |
| Basiswechsel | cambio de base | |
| Zehnerlogarithmus, natürlicher Logarithmus | logaritmo decimal, logaritmo neperiano | |
| logarithmieren | tomar logaritmos | |
| Probe | comprobación | |
| Regression: Bestimmtheitsmaß, Methode der kleinsten Quadrate | coeficiente de determinación, método de los mínimos cuadrados | |
| Messwerte, Punktwolke, Ausreißer | medidas, nube de puntos, valor atípico | |
| Interpolation, Extrapolation, Prognose | interpolación, extrapolación, previsión | |
| Modellkritik | crítica del modelo | |
| Ausgleichsgerade | recta de ajuste | |
| Faustregel | regla práctica | |

### Equations, figures, matrices

| German | Spanish | Note |
|---|---|---|
| binomische Formeln | identidades notables | "cuadrado de una diferencia" for the second |
| Äquivalenzumformung | transformación equivalente | |
| inhaltliches Lösen | resolver razonando | |
| Hauptnenner | mínimo común denominador | |
| antiproportional | inversamente proporcional | |
| Kathete | cateto | |
| Mantel, Mantellinie | superficie lateral, generatriz | |
| Umfang | perímetro | |
| Kugel, Kegel | esfera, cono | |
| erweiterte Koeffizientenmatrix | matriz ampliada | |
| Format (einer Matrix) | dimensión | |
| Stufenform, Pivot, Nullzeile | forma escalonada, pivote, fila nula | |
| transponieren | trasponer (traspuesta) | |
| skalare Multiplikation | producto por un escalar | |
| Einheitsmatrix $E$ | matriz identidad $I$ | |
| Lösungsmenge $L$ | conjunto solución $S$ | |

### Probability and numerics

| German | Spanish | Note |
|---|---|---|
| Ereignis | suceso | |
| Versuch | ensayo | |
| Pfad | rama | as in "regla de las ramas"; a single branch of the tree drawing (Ast) is *segmento* |
| Wappen / Zahl | cara / cruz | letters C / X |
| Farben rot / blau in Urnen | rojo / azul | letters R / A |
| krank / gesund (Schnelltest) | enfermo / sano | letters E / S |
| Pasch, Augenzahl, Augensumme | dobles, puntuación, suma de puntos | |
| Ziegenproblem | el problema de Monty Hall | |
| Galtonbrett | tablero de Galton | |
| empirisches Gesetz der großen Zahlen | ley empírica de los grandes números | |
| Treffer (Monte-Carlo) | aciertos | Bernoulli: éxito |
| Streifen, Streifenverfahren | franjas, métodos de franjas | |
| linke / Mittelpunkt- Rechtecke | rectángulos por la izquierda / del punto medio | |

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
| Augensumme, Augenzahl | suma de puntos, puntuación | as in the es-1 block |
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
| krank K / gesund (Schnelltest) | enfermo E / sano $\overline{E}$ | tree letters E/S in the widget |
| Treffer T / Niete N (Pfade) | éxito E / fracaso F | |
| innere Ableitung, Summand | derivada interior, sumando | |
| Oberfläche O(r) (Dose) | O(r) stays | as in the German book |

## Added by mathegy5-es (Einstein)

| Deutsch | Español | Note |
|---|---|---|
| Gymnasium (Klasse 5–12) | Gymnasium | start page: «el centro de secundaria alemán que lleva al Abitur; en Sajonia va del 5.º al 12.º curso» |
| Wahlbereich, Kapitel W | Optativa, capítulo OP | as in mathe11-es |
| Runde 1 · Kopfrechnen / Runde 2 · mit Stift und Papier | RONDA 1 · CÁLCULO MENTAL / RONDA 2 · CON LÁPIZ Y PAPEL | GY 5 test rounds |
| Mehr ausprobieren | MÁS PARA PROBAR (EN ALEMÁN) | heading above the lab cards |
| data-ph Zahl, Anzahl | número, cantidad | |
| Stellenwerttafel, Stelle, Ziffer | tabla de valores posicionales, posición, cifra | column heads U, D, C, UM, DM, CM, UMi, DMi, CMi, MMi; d, c, m |
| Einer, Zehner, Hunderter, Tausender, Zehntausender | unidades, decenas, centenas, unidades de millar, decenas de millar | "redondear a las centenas" |
| Milliarde, Billion | mil millones, billón | the long scale, as in German |
| Zahlenstrahl, Einteilung | recta numérica, escala | |
| Vorgänger, Nachfolger | anterior, siguiente | |
| Überschlag | estimación | |
| Rechengesetze: Vertauschungs-, Verbindungs-, Verteilungsgesetz | propiedades conmutativa, asociativa, distributiva | |
| Vorrangregeln, Punkt vor Strich | jerarquía de las operaciones, multiplicar y dividir antes que sumar y restar | |
| Summand, Minuend, Subtrahend, Dividend, Quotient | sumando, minuendo, sustraendo, dividendo, cociente | |
| Potenz, Basis, Exponent, Quadratzahl | potencia, base, exponente, cuadrado | "dos elevado a cinco" |
| Probe (Division) | comprobación | |
| Teiler, Vielfaches, Teilermenge $T_{12}$ | divisor, múltiplo, conjunto de divisores $D_{12}$ | the letter changes with the word |
| Teilbarkeitsregeln, Quersumme | criterios de divisibilidad, suma de las cifras | |
| Sieb des Eratosthenes, Primfaktorzerlegung, Primzahlzwillinge | criba de Eratóstenes, descomposición en factores primos, números primos gemelos | |
| ggT, kgV | máximo común divisor, mínimo común múltiplo | |
| Zähler, Nenner, Stammbruch | numerador, denominador, fracción unitaria | |
| echter / unechter Bruch, gemischte Zahl | fracción propia / impropia, número mixto | |
| kürzen, erweitern, vollständig gekürzt | simplificar, amplificar, fracción irreducible | |
| Zehnerbruch, Zehntel, Hundertstel, Tausendstel | fracción decimal, décimas, centésimas, milésimas | |
| Kommaverschiebung | desplazar la coma | |
| arithmetisches Mittel, Mittelwert | media aritmética, media | |
| Koordinatensystem, Ursprung, Strecke, Strahl | sistema de coordenadas, origen, segmento, semirrecta | |
| Schenkel, Scheitel | lados, vértice | the widget letter S becomes V |
| spitz, recht, stumpf, gestreckt, überstumpf, Voll-, Nullwinkel | agudo, recto, obtuso, llano, cóncavo, completo, nulo | |
| Neben-, Scheitel-, Stufen-, Wechselwinkel | adyacentes, opuestos por el vértice, correspondientes, alternos | |
| Geodreieck | escuadra con transportador | |
| achsensymmetrisch, punktsymmetrisch | con simetría axial, con simetría central | eje / centro de simetría |
| Verschiebung, Drehung, Spiegelung, Bildfigur, A′ | traslación, giro, reflexión, figura imagen, «A prima» | |
| Umlaufsinn | sentido de recorrido | |
| Flächeninhalt, Umfang $u$ | área, perímetro $u$ | the letter u stays (same answers, widgets); explained once in 4.1 |
| Ar, Hektar | área (a), hectárea (ha) | |
| Quader, Würfel (Körper), Ecken, Kanten, Flächen | ortoedro, cubo, vértices, aristas, caras | |
| Schrägbild, Körpernetz | perspectiva caballera, desarrollo plano | |
| Grundriss, Vorderansicht, Seitenansicht | planta, alzado, perfil | |
| Oberflächeninhalt $O$, Hohlmaße | área total $O$, unidades de capacidad | |
| Einheitentreppe, Umrechnungszahl, Maßzahl | escalera de unidades, factor de conversión, número | |
| Fermi-Aufgabe | problema de Fermi | |
| Additionssystem, Stellenwertsystem | sistema aditivo, sistema posicional | |
| Zweier-, Fünfer-, Zwanzigersystem | sistema binario, sistema de base cinco, sistema vigesimal | |
| Maya: Punkt, Strich, Muschel | punto, raya, concha | |
| Ägypter: Strich, Fessel, Seil, Lotusblüte | trazo, asa, cuerda, flor de loto | |
| Linienbrett, Rechenpfennige, bündeln, Übertrag | tablero de líneas, fichas, agrupar, llevada | |

## Added by mathegy6-es (Einstein)

| Deutsch | Español | Note |
|---|---|---|
| Zuordnung; mehrdeutig, eindeutig, eineindeutig | correspondencia; no unívoca, unívoca, biunívoca | |
| Dreisatz | regla de tres | |
| direkt / indirekt proportional, Quotientengleichheit, Produktgleichheit | directamente / inversamente proporcional, igualdad de cocientes, igualdad de productos | |
| gebrochene Zahlen | números fraccionarios | |
| Kehrwert | inversa | |
| Hauptnenner, gleichnamig machen | mínimo común denominador, pasar a común denominador | |
| Teilermenge $D_n$ | conjunto de divisores $D_n$ | as in GY 5 |
| ggT, kgV (short forms in widgets and tasks) | m.c.d., m.c.m. | written out once per chapter |
| TR (Taschenrechner, chip) | CALC | |
| Definition, Satz, Wenn-dann-Form | definición, teorema, forma «si …, entonces …» | |
| Voraussetzung, Behauptung, direkter Beweis | hipótesis, tesis, demostración directa | |
| Innenwinkelsatz, Außenwinkel | teorema de los ángulos interiores, ángulo exterior | |
| Kongruenzsätze sss, sws, wsw, SsW (www, ssW) | criterios de congruencia LLL, LAL, ALA, LlA (AAA, llA) | L = lado, A = ángulo; capital L = the longer side; the widget konstruktion6 uses the same letters |
| kongruent (deckungsgleich) | congruentes (iguales) | |
| Planfigur, Konstruktionsbeschreibung, Lösbarkeit | figura de análisis, descripción de la construcción, existencia de solución | |
| Schenkel (eines Winkels) | lado del ángulo | "el lado libre del ángulo" |
| Basiswinkelsatz, Basis, Schenkel (gleichschenklig) | teorema de los ángulos de la base, base, lados laterales | |
| Seiten-Winkel-Beziehung, Dreiecksungleichung | relación entre lados y ángulos, desigualdad triangular | |
| Mittelsenkrechte, Winkelhalbierende, Höhe, Seitenhalbierende | mediatriz, bisectriz, altura, mediana | |
| Umkreis(mittelpunkt) $U$, Inkreis(mittelpunkt) $I$, Höhenschnittpunkt $H$, Schwerpunkt $S$ | circunferencia circunscrita / circuncentro $U$, circunferencia inscrita / incentro $I$, ortocentro $H$, baricentro $S$ | the letters stay |
| Lot fällen, Mittelsenkrechte errichten | bajar la perpendicular, trazar la mediatriz | |
| Euler-Gerade | recta de Euler | |
| spitz-, recht-, stumpfwinklig; unregelmäßig (Dreieck) | acutángulo, rectángulo, obtusángulo; escaleno | |
| Grundseite $g$, Höhe $h$ | base $g$, altura $h$ | letters stay |
| Drachenviereck | deltoide | |
| Haus der Vierecke | casa de los cuadriláteros | |
| Rückführprinzip, zerlegen, ergänzen | principio de reducción, descomponer, completar | |
| Satz von Pick | teorema de Pick | letters $I$, $R$ stay |
| Prisma (gerade), Deckfläche, Mantel(fläche) $M$ | prisma (recto), base superior, superficie lateral / área lateral $M$ | |
| Kavalierperspektive, Schrägbild | perspectiva caballera, dibujo en perspectiva | widget button "Perspectiva" |
| umbauter Raum | volumen construido | |
| Anteil, Flächenanteil, Volumenanteil | parte, parte de la superficie, parte del volumen | |
| Kreisdiagramm, Säulendiagramm | diagrama de sectores, diagrama de barras | |
| Primzahl, zusammengesetzte Zahl, Faktorbaum | número primo, número compuesto, árbol de factores | |
| Primzahlzwillinge, vollkommene / befreundete Zahlen | números primos gemelos, números perfectos / amigos | |
| euklidischer Algorithmus, Mersenne-Zahlen | algoritmo de Euclides, números de Mersenne | |
| Wahlbereich 3 (kicker) | OPTATIVA 3 | chapter letter OP |
| Runde 1 · ohne Taschenrechner / Runde 2 (GY 6 tests) | RONDA 1 · SIN CALCULADORA / RONDA 2 · PENSAR, PROBLEMAS | the round titles of 3.1–OP name the topic: RONDA 1 · ÁNGULOS … |
| Glücksrad, Kopf / Zahl | ruleta, cara / cruz | |

## Added by mathegy7-es (Einstein)

| Deutsch | Español | Note |
|---|---|---|
| Passante, Tangente, Sekante, Sehne | recta exterior, tangente, secante, cuerda | the kind of line in bold inside a widget sentence is a rule in gy7.js |
| Berührungspunkt, Lot, Lotfußpunkt | punto de tangencia, perpendicular, pie de la perpendicular | |
| Umkreis(mittelpunkt), Inkreis(mittelpunkt) | circunferencia circunscrita (circuncentro), circunferencia inscrita (incentro) | widget buttons "Circunscrita / Inscrita" under the heading "Circunferencia" |
| Satz des Thales, Thaleskreis, Umkehrung | teorema de Tales, circunferencia de Tales, recíproco | |
| Peripheriewinkel, Zentriwinkel, Sehnenviereck | ángulo inscrito, ángulo central, cuadrilátero inscrito | |
| genau dann, wenn | si y solo si | |
| Allaussage, Existenzaussage, Gegenbeispiel | afirmación universal, afirmación de existencia, contraejemplo | |
| Planfigur, Konstruktionsplan | figura de análisis, plan de construcción | |
| Bestimmungsaufgabe, Beweisaufgabe | problema de cálculo, problema de demostración | |
| Vorwärts-, Rückwärtsarbeiten | trabajar hacia delante, hacia atrás | |
| Gegenzahl, Betrag | opuesto, valor absoluto | |
| natürliche, ganze, gebrochene, rationale Zahlen | números naturales, enteros, fraccionarios, racionales | |
| Teilmenge, Schnittmenge, Vereinigungsmenge, leere Menge | subconjunto, intersección, unión, conjunto vacío | sets of whole numbers with commas: $\{-1, 0, 1\}$ |
| Vorzeichen, Rechenzeichen, Vorzeichenregeln | signo, signo de operación, reglas de los signos | |
| Kommutativ-, Assoziativ-, Distributivgesetz | propiedad conmutativa, asociativa, distributiva | |
| Überschlag | estimación | |
| Quadratwurzel, irrational | raíz cuadrada, irracional | |
| Äquivalenzumformung, Formel umstellen nach $b$ | transformación equivalente, despejar $b$ | umstellen7: "Despeja $b$ en la fórmula …"; buttons only "$b$" under "despejar" |
| Grundwert $G$, Prozentwert $W$, Prozentsatz $p\,\%$ | valor base $G$, valor porcentual $W$, tanto por ciento $p\,\%$ | the letters stay (same answers), explained once in 2.4 |
| Rabatt, Skonto, Mehrwertsteuer, netto, brutto | descuento, descuento por pronto pago, IVA, neto, bruto | German rates 19 % / 7 % "en Alemania" |
| Steigerung um / auf | aumentar en / aumentar hasta | widget: "Un aumento del 20 % significa pasar al 120 %" |
| Prozentpunkte | puntos porcentuales | |
| Tabellenkalkulation | hoja de cálculo | formulas `=B2*C2` stay |
| Säulen-, Balken-, Linien-, Kreisdiagramm | diagrama de barras, de barras horizontales, de líneas, de sectores | |
| Netz (Körpernetz), Schrägbild | desarrollo plano, perspectiva caballera | as in GY 6 |
| Zweitafelbild, Aufriss, Grundriss | representación en dos vistas, alzado, planta | widget button "Dos vistas"; "en España, sistema diédrico" in 3.1 |
| Rissachse $x_{12}$, Ordnungslinie | línea de tierra $x_{12}$, línea de referencia | |
| wahre Länge, wahre Größe | verdadera magnitud (of a segment and of a face) | |
| Pyramidenstumpf, Deckkante, $h_s$ | tronco de pirámide, arista superior, $h_s$ (altura del triángulo lateral, apotema) | |
| Polyeder, reguläres Polyeder, platonische Körper | poliedro, poliedro regular, sólidos platónicos | |
| Eulerscher Polyedersatz $e - k + f = 2$ | fórmula de Euler para poliedros $e - k + f = 2$ | the letters e, k, f stay (widgets, answers) and are explained once in OP |
| Hexaeder, Tetraeder, Oktaeder, Dodekaeder, Ikosaeder | hexaedro, tetraedro, octaedro, dodecaedro, icosaedro | |
| Würfel (solid) | cubo | rules /^Würfel$/ and />Würfel</ in gy7.js, not a word: in stochastics it is a die |

## Added by mathegy8-es (Curie)

| Deutsch | Español | Note |
|---|---|---|
| Gymnasium (start page) | El Gymnasium es el tipo de escuela secundaria alemana que lleva al Abitur; en Sajonia va del 5.º al 12.º curso. | once on the start page, like the BGY explanation |
| Klasse 8 | 8.º curso | |
| Wahlbereich (GY 8) | Optativa, chapter OP | kicker "CAPÍTULO OP · OPTATIVA 3" |
| Mehr ausprobieren (lab box) | MÁS PARA EXPERIMENTAR | each lab "(en alemán)" |
| Lösungsmenge $L$ | conjunto solución $S$, also in the widget sentences | Lovelace 13.10.: a rule in js/buch-es/gleichungen.js and gy8.js writes $S = …$ for waage, ungleichung, lgs8 |
| Mengen ganzer Zahlen $\{1; 2; 3\}$ | $\{1, 2, 3\}$ | with a decimal comma the semicolon stays; rule in js/buch-es/stochastik.js and gy8.js |
| Term, Rechenbaum | expresión (algebraica), árbol de cálculo | "subexpresión" for Teilterm |
| Variable als Platzhalter, Unbekannte, Veränderliche | comodín, incógnita, cantidad que cambia | |
| Name, Wert, Bedeutung (einer Variablen) | nombre, valor, significado | |
| Art des Terms: Summe, Differenz, Produkt, Quotient, Potenz | suma, diferencia, producto, cociente, potencia | minuendo/sustraendo, dividendo/divisor, base/exponente |
| Punktrechnung vor Strichrechnung | multiplicaciones y divisiones antes que sumas y restas | |
| gleichartige Glieder zusammenfassen | simplificar (agrupar términos semejantes) | |
| binomische Formeln 1./2./3. | identidades notables: 1.ª (cuadrado de una suma), 2.ª (cuadrado de una diferencia), 3.ª (suma por diferencia) | widget: "1.ª identidad" |
| Binom | binomio | |
| Ungleichung, Zahlenstrahl, Relationszeichen | inecuación, recta numérica, signo de desigualdad | |
| Probe (am Zahlenstrahl) | prueba | test point of the widget ungleichung |
| Ergebnismenge $\Omega$ | espacio muestral | |
| sicheres / unmögliches Ereignis | suceso seguro / imposible | |
| Vereinigung, Durchschnitt, Differenz (Ereignisse) | unión, intersección, diferencia | |
| Laplace-Versuch, Laplace-Regel | experimento de Laplace, regla de Laplace | |
| Glücksrad: Feld | ruleta: sector | |
| Urnenmodell | modelo de urna | |
| Pfadregeln: Produktregel, Summenregel | reglas de las ramas: regla del producto, regla de la suma | segmento for Ast (es-1) |
| Variation / Permutation / Kombination mit / ohne Wiederholung | variación / permutación / combinación con / sin repetición | widget urne |
| Zufallsgröße (zwei Würfel) | variable aleatoria | |
| eindeutige Zuordnung | correspondencia unívoca | |
| Anstieg | pendiente | |
| Regressionsgerade | recta de regresión | |
| Einsetzungs-, Gleichsetzungs-, Additionsverfahren | método de sustitución, de igualación, de reducción | widget buttons: Sustitución, Igualación, Reducción |
| Lösbarkeit, vollständige Fallunterscheidung | resolubilidad, distinción de casos completa | |
| zentrische Streckung | homotecia | |
| Streckzentrum, Streckfaktor | centro de homotecia, razón de homotecia | |
| Vergrößerung, Verkleinerung | ampliación, reducción | |
| Bildpunkt, Bildstrecke | punto imagen, segmento imagen | |
| winkeltreu, geradentreu, parallelentreu | conserva los ángulos, transforma rectas en rectas, conserva el paralelismo | |
| Punktspiegelung | simetría central | |
| Strahlensätze | teorema de Tales (in Spain) | the page says once: en Alemania, «teoremas de los rayos» |
| Ähnlichkeit, ähnlich | semejanza, semejante | |
| Hauptähnlichkeitssatz | criterio principal de semejanza | two equal angles |
| Hilfsfigur | figura auxiliar | |
| Försterdreieck, Schattenmethode, Daumensprung | triángulo del guardabosques, método de la sombra, salto del pulgar | |
| Maßstab 1 : 50 | escala 1 : 50 | |
| Vorwärts-, Rückwärtsarbeiten | trabajar hacia delante, hacia atrás | |
| Lösungsplan, Teilziel | plan de resolución, objetivo parcial | |
| strukturgleicher Zufallsversuch | experimento de la misma estructura | |
| Zufallsziffern | cifras aleatorias | |
| Sammelalbum, Tüte, Bild | álbum de cromos, sobre, cromo | |
| GeoGebra / Tabellenkalkulation | Homotecia(Polígono, k, Z); =ALEATORIO.ENTRE(1;6), =PENDIENTE, =INTERSECCION.EJE | |

## Added by mathe10-es (Curie)

| Deutsch | Español | Note |
|---|---|---|
| Oberschule, Realschulbildungsgang | Oberschule, itinerario de Realschule | start page: «la escuela secundaria sajona del 5.º al 10.º curso … termina con un examen final y el título de Realschule» |
| Wahlpflichtbereich 3 | Optativa obligatoria 3, chapter OP | |
| Runde 2 · mit Taschenrechner | RONDA 2 · CON CALCULADORA | |
| Haus der Vierecke | casa de los cuadriláteros | |
| Drachenviereck, Drachen | deltoide | |
| unregelmäßig / gleichschenklig / gleichseitig (Dreieck) | escaleno / isósceles / equilátero | |
| spitzwinklig / rechtwinklig / stumpfwinklig | acutángulo / rectángulo / obtusángulo | |
| Schenkel (Trapez), Basiswinkel | lado no paralelo, ángulos de la base | |
| $n$-Eck, Zehneck, Zwölfeck | polígono de $n$ lados, decágono, dodecágono | |
| Hypotenuse, Ankathete, Gegenkathete (GK : HY …) | hipotenusa, cateto contiguo, cateto opuesto (CO : H, CC : H, CO : CC) | |
| Hilfslinie | línea auxiliar | |
| Satteldach, Giebel, First, Traufe, Sparren | tejado a dos aguas, hastial, cumbrera, alero, cabio | |
| Steigung in % (Straße, Rampe), Neigungswinkel | pendiente, ángulo de inclinación | |
| Sinussatz, Kosinussatz | teorema del seno, teorema del coseno | |
| SSS, SWS, WSW, SSW | LLL, LAL, ALA, LLA | widget dreieckloeser; S = lado, W = ángulo |
| eingeschlossener Winkel, Schenkellinie | ángulo comprendido, semirrecta del ángulo | |
| Umkreis | circunferencia circunscrita | |
| Mittelpunktswinkel, Bestimmungsdreieck (regelmäßiges Vieleck) | ángulo central, triángulo (desde el centro) | |
| Potenzfunktion, Parabel, Hyperbel, Asymptote | función potencia, parábola, hipérbola, asíntota | |
| umgekehrt proportional | inversamente proporcional | |
| Anfangswert, Wachstumsfaktor | valor inicial, factor de crecimiento | |
| Halbwertszeit | período de semidesintegración, then semivida | as in the es-1 block |
| Amplitude, Periode, Sinuskurve | amplitud, período, sinusoide | |
| Funktionsklassen (ganzrational, gebrochenrational …) | tipos de funciones (polinómica, racional …) | widget funktionsklassen |
| Gewinnchance, Gewinnerwartung | probabilidad de ganar, ganancia esperada | |
| Gesetz der großen Zahlen | ley de los grandes números | |
| in Reihe / parallel (Bauteile) | en serie / en paralelo | |
| Lohnabrechnung, brutto, netto | nómina, bruto, neto | |
| Lohnsteuer, Sozialabgaben, Arbeitgeberanteil | impuesto sobre la renta, cotizaciones sociales, cuota empresarial | German context explained once ("en Alemania") |
| Renten-, Kranken-, Pflege-, Arbeitslosenversicherung | seguro de pensiones, de enfermedad, de dependencia, de desempleo | widget lohnos10 |
| Haushaltsplan, Kaufkraft | presupuesto doméstico, poder adquisitivo | |
| Ratenkauf, Rate, Dispokredit | compra a plazos, cuota, descubierto (en Alemania, «Dispo») | |
| effektiver Jahreszins | tasa anual equivalente (TAE) | |
| Schuldenfalle | trampa de las deudas | |
| Annuitätendarlehen, Ratentilgung, Sparplan, Tilgung, Restschuld | préstamo de cuota fija, amortización constante, plan de ahorro, amortización, deuda pendiente | widget tilgung |
| Pyramiden-, Kegelstumpf | tronco de pirámide, tronco de cono | |
| Spitzkörper | cuerpos con vértice (pirámides y conos) | |
| Seitenhöhe, Seitenkante, Grundkante | apotema, arista lateral, arista de la base | "arista de la base" as in vektoren |
| Zerlegungsprinzip | principio de descomposición | |
| Abschlussprüfung | examen final | |
| Problemlösen: verstehen, planen, rechnen, prüfen, antworten | comprender, planificar, calcular, comprobar, responder | |
| Prozentpunkte | puntos porcentuales | |
| Messrad, Peilstab, Höhenwinkel, Standlinie | rueda de medir, jalón de mira, ángulo de elevación, base | elective chapter |
| Nivellieren, Messlatte | nivelar, mira | |

## Added by mathegy9-es (Curie)

| Deutsch | Español | Note |
|---|---|---|
| Wahlbereich | Optativa, chapter OP | kicker «CAPÍTULO OP · OPTATIVA · MAYO · JUNIO» |
| Wurzelgleichung, Scheinlösung | ecuación con radicales, solución extraña | |
| Permanenzprinzip, rationale Exponenten | principio de permanencia, exponentes racionales | |
| Potenzfunktion, Grad, Polstelle, Asymptote | función potencia, grado, polo, asíntota (vertical / horizontal) | |
| Definitionsbereich, Wertebereich | dominio, recorrido | |
| Quadrat-Würfel-Gesetz | ley del cuadrado y el cubo | |
| Kettenlinie | catenaria | |
| quadratische Ergänzung | completar el cuadrado | |
| Zielgröße, Extremwertproblem | magnitud objetivo, problema de optimización | |
| Kreisring, Kreisausschnitt, Kreisbogen | corona circular, sector circular, arco | |
| Satzgruppe des Pythagoras | grupo de teoremas de Pitágoras | |
| pythagoreische Tripel | ternas pitagóricas | |
| Voraussetzung, Behauptung | hipótesis, tesis | |
| Raumdiagonale, Quader | diagonal del espacio, ortoedro | |
| Höhenwinkel, Tiefenwinkel | ángulo de elevación, ángulo de depresión | |
| Mantellinie | generatriz | |
| Spannweite, Ausreißer | rango, valores atípicos | |
| Nominal-, Ordinal-, metrische Skala | escala nominal, ordinal, métrica | |
| Mittelwert, Varianz, Standardabweichung | media aritmética, varianza, desviación típica | spreadsheet functions PROMEDIO, VAR.P, DESVEST.P, DESVEST.M |
| abgeschnittene Achse, Bild statt Balken | eje recortado, imagen en lugar de barra | achsentrick widget: Einstein's GY 7 block |
| Tabellenkalkulation, absoluter Bezug | hoja de cálculo, referencia absoluta | formulas keep the comma: `=B2*1,03` |
| Kaltmiete, Nebenkosten, WG | alquiler sin gastos, gastos de comunidad y suministros, piso compartido | |
| Mietspiegel, Mietpreisbremse | índice de alquileres, freno al alquiler (alemán) | |
| goldener Schnitt, goldene Zahl $\Phi$ | proporción áurea, número áureo $\Phi$ | |
| goldenes Rechteck, goldenes Dreieck, goldene Spirale | rectángulo áureo, triángulo áureo, espiral áurea | |
| äußere Teilung; „äußeres und mittleres Verhältnis“ (Euklid) | división exterior; «extrema y media razón» | |
| Zirkel und Lineal, Lot errichten | regla y compás, levantar la perpendicular | |
| Drittel-Regel | regla de los tercios | |
| Runde 2 · mit Tabelle und CAS | RONDA 2 · CON TABLA Y CAS | |

## Added by mathegy11-es (Turing)

| Deutsch | Español | Note |
|---|---|---|
| Gymnasium · Grundkurs / Leistungskurs | Gymnasium · curso básico / curso avanzado | start page: "el bachillerato alemán de orientación académica: en Sajonia va del 5.º al 12.º curso" |
| Jahrgangsstufe 11 | 11.º curso | |
| Grenzwertsätze | propiedades de los límites | |
| Unstetigkeitsstelle, Sprungstelle, behebbare Lücke | discontinuidad, salto, discontinuidad evitable | Lücke alone: hueco (es-2) |
| Sättigungsgrenze | límite de saturación | |
| Leitkoeffizient | coeficiente principal | |
| h-Methode | método de h | |
| äußere / innere Funktion, nachdifferenzieren | función exterior / interior, multiplicar por la derivada interior | |
| Vielfachheit (Nullstelle) | multiplicidad | einfach, doppelt … → simple, doble, triple, cuádruple … |
| Pol mit / ohne Vorzeichenwechsel | polo con / sin cambio de signo | |
| Typ (m,n) einer Matrix | dimensión $(m,n)$ | as "Format" in the es-1 block |
| verkettete Matrizen | matrices compatibles | |
| Koeffizientenmatrix | matriz de coeficientes | erweiterte: matriz ampliada (es-1) |
| Zeilenumformung, Zeile $Z_1$ | transformación de filas, fila $F_1$ | $Z_1 - 2Z_2$ → $F_1 - 2F_2$ in the text |
| Drehmatrix, Drehwinkel | matriz de giro, ángulo de giro | |
| Verflechtung (Rohstoffe → Zwischenprodukte) | producción encadenada | |
| Gauß-Jordan-Verfahren | método de Gauss-Jordan | |
| Residuum, Überanpassung | residuo, sobreajuste | |
| Newton-Verfahren, Startwert, Heron-Verfahren | método de Newton, valor inicial, regla de Herón | |
| Schrägbild | perspectiva caballera | |
| kollinear, komplanar | colineales, coplanarios | |
| Teilungspunkt, Verhältnis $m : n$ | punto de división, razón $m : n$ | |
| Gegenvektor | vector opuesto | |
| parameterfreie Form | forma sin parámetros | = ecuación general |
| Durchstoßpunkt | punto de intersección | recta y plano |
| windschief (Geraden) | se cruzan | "dos rectas que se cruzan", as in the es-3 block; to intersect: cortarse |
| Halbkreisflugregel, Flugfläche | regla semicircular, nivel de vuelo | |
| Kopf (Münze) | cara | as Wappen |
| Sechserpasch | doble seis | |
| linkssteil | asimétrica hacia la derecha | = rechtsschief (es-2) |
| $\sigma$-Umgebung | entorno $\sigma$ | |
| Pascalsches Dreieck | triángulo de Pascal | widget: fila, posición |
| Bernoullis goldener Satz | teorema áureo de Bernoulli | |
| Einheitsquadrat | cuadrado unidad | |
| Ratetest | test a ciegas | |

## Added by mathegy11lk-es (Turing)

| Deutsch | Español | Note |
|---|---|---|
| Leistungskurs | curso avanzado | title "Matemáticas · Gymnasium 11 · Curso avanzado" |
| Epsilon-Delta-Definition | definición ε-δ | |
| abschnittsweise definierte Funktion | función definida a trozos | |
| Zwischenwertsatz | teorema de los valores intermedios | |
| lineare Näherung | aproximación lineal | |
| Stammfunktion | primitiva | |
| Ortskurve | lugar geométrico | |
| Wendetangente | tangente de inflexión | |
| linksgekrümmt / rechtsgekrümmt | cóncava hacia arriba / hacia abajo | |
| Randextrema | extremos en los extremos del intervalo | globales / locales as usual |
| Polynomdivision | división de polinomios | |
| knickfrei, ruckfrei (Übergang) | sin picos, sin saltos de curvatura | |
| Gozinto-Graph, Mengeneinheit (ME) | grafo de Gozinto, unidad (u.) | "60 ME Kakao" → "60 unidades de cacao" |
| Fixpunktiteration, anziehend / abstoßend | iteración de punto fijo, atractivo / repulsivo | |
| Spinnwebdiagramm, Fixpunktsatz von Banach, kontrahierend | diagrama de telaraña, teorema del punto fijo de Banach, contractiva | |
| Zylinderkoordinaten, Kugelkoordinaten | coordenadas cilíndricas, coordenadas esféricas | $(r, \varphi, z)$; with a decimal comma $(3;\, 50^\circ;\, 2{,}5)$ |
| geografische Länge / Breite, Breitenkreis, Nullmeridian | longitud / latitud, paralelo, meridiano cero | |
| Zylindermantel, Halbebene | superficie cilíndrica, semiplano | |
| Spannvektoren (Ebene) | vectores directores | |
| Spurgerade, Spurdreieck | recta de traza, triángulo de trazas | |
| Achsenabschnittsform | ecuación segmentaria | |
| geschlossener Vektorzug, Koeffizientenvergleich | cadena cerrada de vectores, comparación de coeficientes | |
| Teilverhältnis, Schwerpunkt | razón de división, baricentro | |
| räumliches Viereck | cuadrilátero alabeado | |
| Satteldach, First | tejado a dos aguas, cumbrera | |
| Streichen / Einfallen (Geologie) | rumbo / buzamiento (la capa buza) | |
| Kolmogorow-Axiome, Additionssatz | axiomas de Kolmogórov, fórmula de la adición | |
| Reißzwecke, Rückenlage | chincheta, con la punta hacia arriba | |
| Skatblatt, Herz, Bube | baraja de skat, corazones, jota | |
| Lotto „6 aus 49“, Richtige, Tipp | lotería «6 de 49», aciertos, apuesta | |
| bedingte Wahrscheinlichkeit, Satz von Bayes, totale Wahrscheinlichkeit | probabilidad condicionada, teorema de Bayes, probabilidad total | |
| Basisrate, natürliche Häufigkeiten, umgekehrter Baum | tasa base, frecuencias naturales, árbol invertido | |
| Ziegenproblem, Moderator | problema de Monty Hall, presentador | |
| Einzelwahrscheinlichkeit, Summenzeichen, binomischer Lehrsatz | probabilidad puntual, símbolo de sumatorio, teorema del binomio | |
| Reihen- / Parallelschaltung | montaje en serie / en paralelo | |

## Added by mathegy12-es (Turing)

| Deutsch | Español | Note |
|---|---|---|
| Grundintegrale, Integrationskonstante | integrales inmediatas, constante de integración | |
| lineare Verkettung | composición lineal | widget integrieren: "Composición lineal" |
| Untersumme $U_n$, Obersumme $O_n$ | suma inferior, suma superior | the letters $U_n$, $O_n$ stay as in the German book |
| orientierter Flächeninhalt | área orientada | |
| Integralfunktion $I_a$ | función integral | Flächenfunktion: función área (es-3) |
| Integrand, untere / obere Integrationsgrenze | integrando, límite de integración inferior / superior | |
| Rechteckverfahren links / rechts / Mitte, Mittelpunktsregel | método de los rectángulos por la izquierda / por la derecha / del punto medio, regla del punto medio | widget buttons as in numerik: "Rect. por la izquierda" … |
| Trapezverfahren | método de los trapecios | |
| Glockenkurve | campana | |
| Hochrechnung | extrapolación | |
| Sollwert (Abfüllung) | valor nominal | |
| Normalenform, Hessesche Normalform | forma normal, forma normal de Hesse | Koordinatenform: ecuación general |
| Orthogonalitätsbedingung, Projektion | condición de ortogonalidad, proyección | |
| Lotgerade | recta perpendicular | Lotfußpunkt: pie de la perpendicular (es-3) |
| Abstandsformel, Abstandsfunktion | fórmula de la distancia, función distancia | |
| Spiegelpunkt, an $E$ spiegeln, Spiegelebene | punto simétrico, hallar el simétrico respecto a $E$ (reflejar), plano de simetría | |
| Innenwinkel, Neigungswinkel, Steigungswinkel | ángulo interior, ángulo de inclinación | |
| Satteldach, First, Dachfläche | tejado a dos aguas, cumbrera, faldón (superficie del tejado) | |
| Geradenbüschel, Parallelenschar, Geradenschar | haz de rectas, familia de paralelas, familia de rectas | |
| Hüllkurve, Fadenbild | envolvente, dibujo de hilos | |
| Gebiet 1 (Kapitel A), Prüfungsaufgabe | bloque 1, problema de examen | box "OHNE HILFSMITTEL" in chapter A: SIN HERRAMIENTAS (as BGY 13); test rounds: SIN CALCULADORA |
| Widget (chip, running text) | ELEMENTOS INTERACTIVOS, el elemento interactivo | "3 WIDGETS" → "3 ELEMENTOS INTERACTIVOS" |
| parallel (preset of geradenlage, abstand3d, ebenenlage, skalarprodukt, kreuzprodukt, winkel3d) | two lines (geradenlage, abstand3d): paralelas; vectors, planes, line and plane: paralelos | only rules in js/buch-es/vektoren.js (es-2 and block mathegy12-es), never a word: a whole label is parked before the rules run |
| Vektoren und Punkte im Raum | $(1, 2, 3)$; with a decimal comma $(0{,}75;\ 1{,}5;\ 1{,}5)$ | as in BGY 13 |
| Königselle, Handbreit, Seked | codo real, palmo, seked | Cheops, chapter 7.2 |

## Added by mathegy12lk-es (Turing)

| Deutsch | Español | Note |
|---|---|---|

## Added by mathefos11-es (Lovelace)

| Deutsch | Español | Note |
|---|---|---|
| Fachoberschule | Fachoberschule | explained on the start page: escuela técnica superior, 11.º y 12.º curso, Fachhochschulreife |
| Ausblicke (Kapitel E) | Perspectivas (E) | chapter letter stays E |
| Mehrwertsteuer, brutto / netto | IVA, con IVA / sin IVA | |
| Gleichsetzungs-, Einsetzungs-, Additionsverfahren | igualación, sustitución, reducción | |
| Lage zweier Geraden (Ebene): parallel, identisch, schneidend, orthogonal | paralelas, coincidentes, secantes, perpendiculares | |
| Scheinlösung, Bruchgleichung | solución falsa, ecuación con fracciones | |
| Grundmenge | conjunto de referencia | |
| Linearfaktorform, Vielfachheit | forma factorizada, multiplicidad | |
| Funktionenschar, Fallunterscheidung | familia de funciones, distinción de casos | |
| Ergebnismenge, Ereignismenge | espacio muestral, conjunto de sucesos | |
| Zählprinzip, Variation, Kombination | principio de multiplicación, variación, combinación | |
| Pfadmultiplikation, Pfadaddition | regla del producto, regla de la suma (de las ramas) | |
| natürliche Häufigkeiten | frecuencias naturales | |
| Zinseszins, Barwert, Aufzinsungsfaktor | interés compuesto, valor actual, factor de capitalización | |
| Ratentilgung, Annuitätentilgung, Tilgungsplan | amortización con cuotas de capital constantes, amortización por anualidades, cuadro de amortización | |
| Sparplan, Restschuld, Rate | plan de ahorro, deuda pendiente, cuota | |
| Schaltalgebra, Wahrheitstafel, Reihen-/Parallelschaltung | álgebra de circuitos, tabla de verdad, conexión en serie / en paralelo | |
| Lotto „6 aus 49“ | lotería «6 de 49» | |

## Added by mathefos12-es (Lovelace)

| Deutsch | Español | Note |
|---|---|---|
| Schrägbild | perspectiva caballera | as in mathe12-es |
| Lotgerade, Lotfußpunkt, Spiegelpunkt | recta perpendicular, pie de la perpendicular, punto simétrico | "halla el simétrico de $P$ respecto a $E$" |
| Flächeneinheiten | unidades de área | |
| Durchstoßpunkt (Gerade–Ebene) | punto de intersección | verb: la recta atraviesa el plano |
| Linkskurve, Rechtskurve (linksgekrümmt) | curva a la izquierda, curva a la derecha | once with "(convexa, la pendiente aumenta)", as in mathe12-es |
| Hauptbedingung | condición principal | with condición de ligadura, función objetivo |
| Steckbrief (Bedingungen) | ficha (de la función) | the task type stays "problema de reconstrucción" |
| Untersumme, Obersumme | suma inferior, suma superior | |
| orientierter Flächeninhalt | área orientada | |
| Integrationskonstante, Grundintegral | constante de integración, integral inmediata | |
| Definitionslücke, hebbare Lücke | punto excluido del dominio, hueco (discontinuidad evitable) | "hueco" as in mathe12-es |
| Leitkoeffizient | coeficiente principal | |
| Eulersche Zahl, natürlicher Logarithmus | número e (número de Euler), logaritmo neperiano | |
| begrenztes Wachstum, Schranke | crecimiento limitado, cota | |
| Gebiet (Prüfungskapitel) | bloque | "BLOQUE 1" |
| FHR, Fachhochschulreife | examen de la Fachhochschulreife (FHR) | explained on the start page |
| Knick, knickfrei, Übergangsstelle | pico, sin pico, punto de unión | piecewise functions |
| Mengenrabatt | descuento por cantidad | |
| Bestimmtheitsmaß | coeficiente de determinación | |
| Zentralprojektion, Fluchtpunkt, Bildebene | proyección central, punto de fuga, plano del cuadro | |
| GeoGebra CAS commands | Derivada, Integral, Resuelve, Factoriza, Numérico, Si, AjustePolinómico, AjusteExponencial | Spanish GeoGebra names, as in mathe11-es |

## Added by mathegy10-es (offen)

| Deutsch | Español | Note |
|---|---|---|
