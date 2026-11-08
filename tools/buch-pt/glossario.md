# Glossário · Begriffe der portugiesischen Ausgaben (Portugal)

Die Begriffe, auf die sich BGY 11 (`mathe11-pt`, 08.11.2026) festgelegt hat: europäisches Portugiesisch, wie es die
Schulen in Portugal schreiben (Matemática A, ensino secundário; Rechtschreibung nach dem Acordo Ortográfico 1990).
Die Schülerin, der Schüler wird mit „tu“ angesprochen.

## Aufbau des Buches

| Deutsch | Português (PT) | Hinweis |
|---|---|---|
| Lehrbuch (interaktiv) | manual interativo | |
| Kapitel | capítulo | „CAPÍTULO 3.2“ |
| Lernbereich / Wahlbereich | área de aprendizagem / área opcional | |
| Unterrichtsstunden (Ustd.) | aulas | „20 AULAS“ |
| Auftakt · Erkundungen | introdução · explorações | |
| Lerneinheit | unidade | „Unidade 1“ |
| Merke | retém | Kasten wie in portugiesischen Schulbüchern |
| Beispiel · Aufgaben | exemplo · exercícios | |
| Teste dich! | Testa-te! | |
| Wiederholen · Vertiefen · Vernetzen | rever · aprofundar · relacionar | |
| Exkursion | para saber mais | |
| Rückblick · Test | síntese · teste | |
| Tipp · Lösung · Prüfen | dica · solução · verificar | |
| Grundlage · Mittel · Anspruchsvoll | básico · intermédio · avançado | |
| ohne / mit Hilfsmitteln | sem calculadora / com calculadora | wie in den exames nacionais |
| Klausur | teste de avaliação | |
| Grußwort | prefácio | |

## Schreibweisen (die Regeln stehen in `js/buch-pt.js`)

| Deutsch | Português (PT) | Hinweis |
|---|---|---|
| $P(1 \mid 2)$, $P(1{,}5 \mid 2)$ | $P(1, 2)$, $P(1{,}5; 2)$ | Semikolon, sobald eine Koordinate ein Dezimalkomma hat |
| $[1; 2]$, $]1; 2[$ | $[1, 2]$, $]1, 2[$ | nach außen geöffnete Klammern bleiben |
| $\{x \in \mathbb{R} \mid x \geq 0\}$ | $\{x \in \mathbb{R} : x \geq 0\}$ | |
| $L = \{\dots\}$ | $\text{C.S.} = \{\dots\}$ | conjunto-solução |
| $D$, $W$ | $D_f$, $D'_f$ | domínio, contradomínio |
| $y = mx + n$ | $y = mx + b$ | declive $m$, ordenada na origem $b$ |
| Scheitelpunktform $a(x - d)^2 + e$, $S(d \mid e)$ | forma canónica $a(x - h)^2 + k$, vértice $V(h, k)$ | |
| p-q-Formel | fórmula resolvente mit $a, b, c$ | binómio discriminante $\Delta = b^2 - 4ac$ |
| $\lg x$ | $\log x$ | Logarithmus zur Basis 10 |
| $\sin x$ | $\operatorname{sen} x$ | wie in portugiesischen Schulen; auch in den Widgets (Regel in `js/buch-pt/funktionen.js`) |
| $P_B(A)$ | $P(A \mid B)$ | im Seitentext mit `|`, nie `\mid` (die Regel macht daraus ein Komma) |
| Dezimalkomma, $30\,\%$, $10\,000$ | wie im Deutschen | |

## Zahlen, Gleichungen, Funktionen

| Deutsch | Português (PT) | Hinweis |
|---|---|---|
| Gleichung · Lösung | equação · solução | |
| Äquivalenzumformung | princípio de equivalência | |
| Term · Variable | expressão · variável | |
| Ausklammern · Ausmultiplizieren | pôr em evidência · desenvolver | |
| binomische Formeln | casos notáveis | |
| Funktion · Funktionsgraph | função · gráfico da função | |
| Nullstelle | zero | |
| streng monoton steigend / fallend | estritamente crescente / decrescente | |
| achsensymmetrisch / punktsymmetrisch | simétrico em relação ao eixo $Oy$ (função par) / à origem (função ímpar) | |
| lineare Funktion · Gerade · Steigung | função afim · reta · declive | |
| Potenzfunktion | função potência | |
| quadratische Funktion · Parabel · Scheitelpunkt | função quadrática · parábola · vértice | |
| Sinusfunktion · Periode · Amplitude | função seno · período · amplitude | |
| Regression · Messreihe | regressão · série de medições | |
| Umkehrfunktion · Logarithmus | função inversa · logaritmo | |
| Exponentialgleichung | equação exponencial | |
| Streckung · Verschiebung · Spiegelung | dilatação / contração · translação · reflexão | |
| Parameter · Funktionenschar | parâmetro · família de funções | |

## Gleichungssysteme, Matrizen

| Deutsch | Português (PT) | Hinweis |
|---|---|---|
| lineares Gleichungssystem (LGS) | sistema de equações lineares | |
| Gauß-Verfahren | método de eliminação de Gauss | |
| Matrix · Einheitsmatrix | matriz · matriz identidade $I$ | |
| Lösungsmenge | conjunto-solução (C.S.) | |

## Wahrscheinlichkeit, Numerik

| Deutsch | Português (PT) | Hinweis |
|---|---|---|
| Zufallsexperiment (mehrstufig) | experiência aleatória (composta) | |
| Ergebnis · Ergebnismenge · Ereignis | resultado · espaço amostral $\Omega$ · acontecimento | |
| Gegenereignis | acontecimento contrário $\overline{A}$ | |
| Baumdiagramm · Pfadregel · Summenregel | diagrama em árvore · regra do produto · regra da soma | |
| Vierfeldertafel | tabela de dupla entrada | |
| bedingte Wahrscheinlichkeit | probabilidade condicionada $P(A \mid B)$ | |
| Glücksrad · Würfel · Münze | roleta · dado · moeda | |
| krank / gesund | doente $D$ / saudável $S$ | Buchstaben aus portugiesischen Wörtern |
| Kopf / Zahl | face nacional $N$ / face europeia $E$ | die zwei Seiten einer Euromünze, wie in Portugal üblich |
| Bisektionsverfahren | método da bissecção | |
| Monte-Carlo-Methode · Simulation | método de Monte Carlo · simulação | |
