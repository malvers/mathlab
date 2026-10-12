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
