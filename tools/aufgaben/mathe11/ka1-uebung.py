# Builds HTML/svp/mathe/mathe11-ka1-uebung.json (42 practice items for Klassenarbeit 1, Mathe 11 BGY).
#   python3 -I tools/aufgaben/mathe11/ka1-uebung.py HTML/svp/mathe/mathe11-ka1-uebung.json
#   node tools/aufgaben/red-list-pdf.mjs      # then rebuild the PDF behind "Download PDF"
# The Klassenarbeit itself (picked from this pool) lives outside the repo: OneDrive MATH BGY 11/Klassenarbeit 1.
import json, sys

COMMENT = ("Klassenarbeit 1 Mathe 11 BGY (Doc, 26.10.2026: '40 Aufgaben a la Info zum Ueben', plan rows nr 3-9, plus item 41 like task 13 of the entrance test with the deck example Lena gegen Mia and item 42 (AFB III: make that game fair), "
           "AFB I/II/III = 20/12/8 = 50/30/20 %, key of the head of maths). Read by the red button (row.redBtn.src) of row nr 10 (KW 45) in mathe11.html.")

I, II, III = 'AFB I', 'AFB II', 'AFB III'
T = []
def t(afb, q, a): T.append({'q': '(' + afb + ') ' + q, 'a': a})

# --- Nr 3: equations without tools, rearranging formulas -------------------
t(I, r'Löse die Gleichung $3(x - 4) + 2 = 5x - 6$.',
  r'Klammer auflösen: $3x - 12 + 2 = 5x - 6$, also $3x - 10 = 5x - 6$. $3x$ abziehen und $6$ addieren: $-4 = 2x$, also $x = -2$. Probe: links $3 \cdot (-6) + 2 = -16$, rechts $5 \cdot (-2) - 6 = -16$. ✓')
t(I, r'Stelle die Formel $s = \dfrac{1}{2}\,a\,t^2$ nach $a$ um (mit $t \neq 0$).',
  r'Mit $2$ malnehmen: $2s = a\,t^2$. Durch $t^2$ teilen: $a = \dfrac{2s}{t^2}$.')
t(I, r'Löse die Gleichung $\dfrac{x + 2}{3} - \dfrac{x - 1}{4} = 2$.',
  r'Mit dem Hauptnenner $12$ malnehmen: $4(x + 2) - 3(x - 1) = 24$. Ausmultiplizieren: $4x + 8 - 3x + 3 = 24$, also $x + 11 = 24$ und $x = 13$. Probe: $\dfrac{15}{3} - \dfrac{12}{4} = 5 - 3 = 2$. ✓')
t(II, r'Ein Vater ist heute dreimal so alt wie seine Tochter. In $12$ Jahren ist er nur noch doppelt so alt wie sie. Wie alt sind beide heute? Stelle eine Gleichung auf.',
  r'Tochter heute: $t$, Vater heute: $3t$. In $12$ Jahren: $3t + 12 = 2(t + 12)$. Also $3t + 12 = 2t + 24$ und $t = 12$. Die Tochter ist $12$, der Vater $36$ Jahre alt. Probe: in $12$ Jahren $48 = 2 \cdot 24$. ✓')
t(II, r'Die Linsengleichung lautet $\dfrac{1}{f} = \dfrac{1}{g} + \dfrac{1}{b}$. Stelle sie nach $b$ um (mit $f \neq g$).',
  r'Erst $\dfrac{1}{b}$ allein stellen: $\dfrac{1}{b} = \dfrac{1}{f} - \dfrac{1}{g} = \dfrac{g - f}{f\,g}$. Dann auf beiden Seiten den Kehrwert nehmen: $b = \dfrac{f\,g}{g - f}$.')
t(III, r'Für welchen Wert von $a$ hat die Gleichung $a\,x + 3 = 2x - 1$ keine Lösung? Was gilt für alle anderen Werte von $a$?',
  r'Alles mit $x$ nach links: $a\,x - 2x = -4$, also $(a - 2)\,x = -4$. Für $a = 2$ steht dort $0 = -4$, das ist falsch: keine Lösung. Für $a \neq 2$ darf man durch $a - 2$ teilen und bekommt genau eine Lösung $x = \dfrac{-4}{a - 2}$.')

# --- Nr 4: simple non-linear equations, proportionality, percent, binomials --
t(I, r'Löse inhaltlich, ohne Rechner: a) $x^3 = -27$ b) $\sqrt{x} = 5$ c) $2^x = 16$',
  r'a) Welche Zahl hoch $3$ ergibt $-27$? $(-3)^3 = -27$, also $x = -3$. b) Welche Zahl hat die Wurzel $5$? $x = 5^2 = 25$. c) $2^4 = 16$, also $x = 4$.')
t(I, r'Multipliziere mit den binomischen Formeln aus: a) $(2a - 3b)^2$ b) $(x + 5)(x - 5)$',
  r'a) Zweite binomische Formel: $(2a)^2 - 2 \cdot 2a \cdot 3b + (3b)^2$ $= 4a^2 - 12ab + 9b^2$. b) Dritte binomische Formel: $x^2 - 25$.')
t(I, r'a) $5$ Liter Farbe reichen für $40\ \mathrm{m^2}$. Wie viel Farbe braucht man für $92\ \mathrm{m^2}$? b) $4$ gleiche Pumpen leeren ein Becken in $9$ Stunden. Wie lange brauchen $6$ Pumpen? Gib jeweils an, welche Art von Zuordnung vorliegt.',
  r'a) Doppelte Fläche, doppelte Farbe: direkt proportional. Pro $\mathrm{m^2}$ braucht man $\dfrac{5}{40} = 0{,}125$ Liter, für $92\ \mathrm{m^2}$ also $92 \cdot 0{,}125 = 11{,}5$ Liter. b) Mehr Pumpen, weniger Zeit: umgekehrt proportional, das Produkt bleibt gleich. $4 \cdot 9 = 36$ Pumpenstunden, also $\dfrac{36}{6} = 6$ Stunden.')
t(II, r'Eine Jacke kostet nach $30\,\%$ Rabatt noch $84$ €. Wie teuer war sie vorher? Um wie viel Prozent müsste man den neuen Preis erhöhen, um wieder auf den alten zu kommen?',
  r'$30\,\%$ weniger heißt Faktor $0{,}7$: alter Preis $= \dfrac{84}{0{,}7} = 120$ €. Zurück: $\dfrac{120}{84} \approx 1{,}429$, also eine Erhöhung um etwa $42{,}9\,\%$, nicht um $30\,\%$. Der Grund: Die $36$ € Unterschied beziehen sich jetzt auf den kleineren Grundwert $84$ €.')
t(I, r'Löse inhaltlich: $(x + 2)^2 = 49$.',
  r'Welche Zahl ergibt im Quadrat $49$? Sowohl $7$ als auch $-7$. Also $x + 2 = 7$ oder $x + 2 = -7$, das heißt $x = 5$ oder $x = -9$. Probe: $7^2 = 49$ und $(-7)^2 = 49$. ✓')
t(III, r'Berechne ohne Rechner mit einer binomischen Formel: $51 \cdot 49$ und $101^2$. Begründe dann allgemein, warum $(n + 1)(n - 1)$ immer um $1$ kleiner ist als $n^2$.',
  r'$51 \cdot 49 = (50 + 1)(50 - 1) = 50^2 - 1 = 2499$. $101^2 = (100 + 1)^2 = 10\,000 + 200 + 1 = 10\,201$. Allgemein nach der dritten binomischen Formel: $(n + 1)(n - 1) = n^2 - 1^2 = n^2 - 1$, für jede Zahl $n$.')

# --- Nr 5: with tools, term transformations, tool levels --------------------
t(I, r'Vereinfache (mit $x \neq 0$): a) $\dfrac{(x^3)^2 \cdot x^{-2}}{x^3}$ b) $(2a^2 b)^3$',
  r'a) Potenzgesetze: $(x^3)^2 = x^6$, dann $x^{6 - 2 - 3} = x^1 = x$. b) Jeder Faktor hoch $3$: $2^3 \cdot (a^2)^3 \cdot b^3 = 8a^6 b^3$.')
t(II, r'Löse $\dfrac{3}{x + 1} = \dfrac{2}{x - 2}$. Gib zuerst den Definitionsbereich an.',
  r'Die Nenner dürfen nicht $0$ werden: $D = \mathbb{R} \setminus \{-1;\ 2\}$. Über Kreuz malnehmen: $3(x - 2) = 2(x + 1)$, also $3x - 6 = 2x + 2$ und $x = 8$. $8$ liegt in $D$. Probe: $\dfrac{3}{9} = \dfrac{1}{3}$ und $\dfrac{2}{6} = \dfrac{1}{3}$. ✓ $L = \{8\}$.')
t(II, r'Beim Lösen von $\sqrt{x + 6} = x$ quadriert ein CAS und gibt $x = 3$ und $x = -2$ aus. Welche Zahl ist wirklich eine Lösung? Warum entsteht die andere?',
  r'Probe in der ursprünglichen Gleichung: $x = 3$: $\sqrt{9} = 3$. ✓ $x = -2$: $\sqrt{4} = 2 \neq -2$. ✗ Also $L = \{3\}$. Quadrieren ist keine Äquivalenzumformung: Aus $\sqrt{x + 6} = -x$ würde nach dem Quadrieren dieselbe Gleichung entstehen. Deshalb gehört nach dem Quadrieren immer die Probe dazu.')
t(I, r'Löse die Betragsgleichung $|2x - 1| = 7$.',
  r'Der Betrag ist $7$, wenn der Inhalt $7$ oder $-7$ ist. Fall 1: $2x - 1 = 7$, also $x = 4$. Fall 2: $2x - 1 = -7$, also $x = -3$. $L = \{-3;\ 4\}$.')
t(III, r'Ein CAS vereinfacht $\dfrac{x^2 - 9}{x - 3}$ zu $x + 3$. Jemand sagt: „Dann haben beide Terme für jedes $x$ denselben Wert.“ Nimm Stellung.',
  r'Das stimmt nicht für jedes $x$. Der Zähler ist nach der dritten binomischen Formel $(x + 3)(x - 3)$, gekürzt bleibt $x + 3$. Kürzen darf man aber nur für $x \neq 3$. Bei $x = 3$ ist der linke Term gar nicht definiert (Division durch $0$), der rechte hat den Wert $6$. Gleich sind die Terme also nur auf $D = \mathbb{R} \setminus \{3\}$. Das CAS verschweigt diese Einschränkung.')

# --- Nr 6: plane figures and solids ------------------------------------------
t(I, r'Ein Kreis hat den Radius $r = 4$ cm. Berechne Umfang und Flächeninhalt, exakt und gerundet.',
  r'$u = 2\pi r = 8\pi \approx 25{,}13$ cm. $A = \pi r^2 = 16\pi \approx 50{,}27\ \mathrm{cm^2}$.')
t(I, r'Ein Quader hat die Kanten $5$ cm, $4$ cm und $3$ cm. Berechne Volumen und Oberfläche.',
  r'$V = 5 \cdot 4 \cdot 3 = 60\ \mathrm{cm^3}$. $O = 2 \cdot (5 \cdot 4 + 5 \cdot 3 + 4 \cdot 3) = 2 \cdot (20 + 15 + 12) = 94\ \mathrm{cm^2}$.')
t(I, r'Ein Zylinder hat das Volumen $V = 360\pi\ \mathrm{cm^3}$ und die Höhe $h = 10$ cm. Wie groß sind Radius und Mantelfläche?',
  r'$V = \pi r^2 h$, also $360\pi = \pi r^2 \cdot 10$. Durch $10\pi$ teilen: $r^2 = 36$, also $r = 6$ cm. Mantel: $M = 2\pi r h = 2\pi \cdot 6 \cdot 10 = 120\pi \approx 376{,}99\ \mathrm{cm^2}$.')
t(I, r'Ein Kegel hat den Radius $r = 5$ cm und die Höhe $h = 12$ cm. Berechne Mantellinie, Oberfläche und Volumen.',
  r'Mantellinie mit Pythagoras: $s = \sqrt{5^2 + 12^2} = \sqrt{169} = 13$ cm. Oberfläche: $O = \pi r^2 + \pi r s = 25\pi + 65\pi = 90\pi \approx 282{,}74\ \mathrm{cm^2}$. Volumen: $V = \dfrac{1}{3}\pi r^2 h = \dfrac{1}{3}\pi \cdot 25 \cdot 12 = 100\pi \approx 314{,}16\ \mathrm{cm^3}$.')
t(II, r'An die kurze Seite eines Rechtecks ($10$ cm $\times$ $6$ cm) ist außen ein Halbkreis gesetzt. Berechne Flächeninhalt und Umfang der ganzen Figur.',
  r'Der Halbkreis hat den Durchmesser $6$ cm, also $r = 3$ cm. Fläche: $A = 10 \cdot 6 + \dfrac{1}{2}\pi \cdot 3^2 = 60 + 4{,}5\pi \approx 74{,}14\ \mathrm{cm^2}$. Umfang: Die kurze Seite unter dem Halbkreis liegt innen und zählt nicht. $u = 10 + 6 + 10 + \dfrac{1}{2} \cdot 2\pi \cdot 3 = 26 + 3\pi \approx 35{,}42$ cm.')
t(III, r'Der Radius einer Kugel wird verdoppelt. Wie ändern sich Oberfläche und Volumen? Begründe allgemein und erkläre damit, warum ein großer Eisblock langsamer schmilzt als viele kleine Eiswürfel mit demselben Gesamtvolumen.',
  r'$O = 4\pi r^2$: mit $2r$ wird $O = 4\pi (2r)^2 = 4 \cdot 4\pi r^2$, also das $4$-Fache. $V = \dfrac{4}{3}\pi r^3$: mit $2r$ das $2^3 = 8$-Fache. Das Volumen wächst schneller als die Oberfläche, das Verhältnis $\dfrac{O}{V} = \dfrac{3}{r}$ wird kleiner. Ein großer Block hat pro $\mathrm{cm^3}$ Eis weniger Oberfläche, über die Wärme hineinkommt, und schmilzt deshalb langsamer.')

# --- Nr 7: function concept ---------------------------------------------------
t(I, r'Gegeben ist $f(x) = x^2 - 4$. Berechne $f(-3)$ und $f(0)$. Liegt der Punkt $P(2 \mid 0)$ auf dem Graphen?',
  r'$f(-3) = 9 - 4 = 5$. $f(0) = -4$. $f(2) = 4 - 4 = 0$, also liegt $P(2 \mid 0)$ auf dem Graphen. ✓')
t(I, r'Gib den größtmöglichen Definitionsbereich an: a) $f(x) = \dfrac{2}{x - 5}$ b) $g(x) = \sqrt{x + 3}$',
  r'a) Der Nenner darf nicht $0$ sein: $x \neq 5$, also $D = \mathbb{R} \setminus \{5\}$. b) Unter der Wurzel darf nichts Negatives stehen: $x + 3 \geq 0$, also $D = \{x \in \mathbb{R} \mid x \geq -3\}$.')
t(I, r'Bestimme die Nullstellen und den Schnittpunkt mit der $y$-Achse von $f(x) = (x - 1)(x + 4)$.',
  r'Ein Produkt ist $0$, wenn ein Faktor $0$ ist: $x - 1 = 0$ oder $x + 4 = 0$, also $x_1 = 1$ und $x_2 = -4$. $y$-Achse: $f(0) = (-1) \cdot 4 = -4$, also $S_y(0 \mid -4)$.')
t(II, r'Untersuche auf Symmetrie: $f(x) = x^4 - 2x^2$, $g(x) = x^3 + x$, $h(x) = x^2 + x$.',
  r'$f(-x) = (-x)^4 - 2(-x)^2 = x^4 - 2x^2 = f(x)$: achsensymmetrisch zur $y$-Achse. $g(-x) = -x^3 - x = -g(x)$: punktsymmetrisch zum Ursprung. $h(-x) = x^2 - x$, das ist weder $h(x)$ noch $-h(x)$: keine dieser Symmetrien.')
t(II, r'Gegeben ist $f(x) = -(x - 3)^2 + 2$ mit $D = \mathbb{R}$. Gib den Wertebereich an und beschreibe das Monotonieverhalten.',
  r'$(x - 3)^2$ ist nie negativ, also ist $-(x - 3)^2 \leq 0$ und $f(x) \leq 2$. Der größte Wert $2$ wird bei $x = 3$ erreicht: $W = \{y \in \mathbb{R} \mid y \leq 2\}$. Der Graph ist eine nach unten geöffnete Parabel mit dem Scheitel $S(3 \mid 2)$: $f$ steigt für $x \leq 3$ und fällt für $x \geq 3$.')
t(III, r'Gib eine Funktion an, deren Graph achsensymmetrisch zur $y$-Achse ist, genau die Nullstellen $-2$ und $2$ hat und den Wertebereich $W = \{y \mid y \geq -4\}$. Begründe, dass alle drei Bedingungen erfüllt sind.',
  r'Zum Beispiel $f(x) = x^2 - 4$. Symmetrie: $f(-x) = (-x)^2 - 4 = f(x)$. ✓ Nullstellen: $x^2 = 4$ hat genau die Lösungen $-2$ und $2$. ✓ Wertebereich: $x^2 \geq 0$, also $f(x) \geq -4$, und $-4$ wird bei $x = 0$ angenommen. ✓')

# --- Nr 8: linear functions ----------------------------------------------------
t(I, r'Bestimme die Gleichung der Geraden durch $A(1 \mid 3)$ und $B(5 \mid 11)$.',
  r'Anstieg: $m = \dfrac{11 - 3}{5 - 1} = \dfrac{8}{4} = 2$. $A$ einsetzen in $y = 2x + n$: $3 = 2 + n$, also $n = 1$. Die Gerade ist $f(x) = 2x + 1$. Probe mit $B$: $2 \cdot 5 + 1 = 11$. ✓')
t(I, r'Gib die Nullstelle und den Schnittpunkt mit der $y$-Achse von $f(x) = -3x + 6$ an.',
  r'Nullstelle: $-3x + 6 = 0$, also $x = 2$. $y$-Achse: $f(0) = 6$, also $S_y(0 \mid 6)$.')
t(II, r'Eine Kerze ist $24$ cm hoch und brennt pro Stunde $1{,}5$ cm herunter. Stelle eine Funktion für die Höhe auf. Wie hoch ist die Kerze nach $6$ Stunden, und wann ist sie abgebrannt?',
  r'$h(t) = 24 - 1{,}5\,t$ ($t$ in Stunden, $h$ in cm). Nach $6$ Stunden: $h(6) = 24 - 9 = 15$ cm. Abgebrannt: $24 - 1{,}5\,t = 0$, also $t = \dfrac{24}{1{,}5} = 16$ Stunden.')
t(II, r'Tarif A: $9{,}90$ € Grundgebühr und $0{,}09$ € pro Minute. Tarif B: $0{,}15$ € pro Minute ohne Grundgebühr. Ab welcher Gesprächszeit ist Tarif A günstiger?',
  r'Kosten gleichsetzen: $9{,}90 + 0{,}09x = 0{,}15x$, also $9{,}90 = 0{,}06x$ und $x = 165$ Minuten. Darüber steigt A langsamer (kleinerer Anstieg). Ab mehr als $165$ Minuten ist Tarif A günstiger.')
t(III, r'Ein Baum ist $2$ m hoch und wächst pro Jahr $40$ cm. Jemand rechnet mit einem linearen Modell aus, dass er nach $100$ Jahren $42$ m hoch ist. Beurteile das Modell.',
  r'Gerechnet ist richtig: $h(t) = 2 + 0{,}4\,t$, $h(100) = 42$ m. Das Modell taugt aber nur für einen kurzen Zeitraum. Bäume wachsen nicht gleichmäßig: Jung wachsen sie schnell, später immer langsamer, und irgendwann ist Schluss. Dazu kommen Grenzen wie Wasser, Licht und Standort. Über $100$ Jahre braucht man ein Modell, das sich einer Höchstgrenze annähert.')

# --- Nr 9: exponential functions --------------------------------------------
t(I, r'Gib den Wachstumsfaktor an: a) Zunahme um $6\,\%$ b) Abnahme um $15\,\%$. c) Welche prozentuale Änderung gehört zum Faktor $q = 0{,}92$?',
  r'a) $q = 1 + 0{,}06 = 1{,}06$. b) $q = 1 - 0{,}15 = 0{,}85$. c) $0{,}92 = 1 - 0{,}08$: eine Abnahme um $8\,\%$.')
t(I, r'$2000$ € werden mit $2{,}5\,\%$ pro Jahr verzinst, die Zinsen bleiben auf dem Konto. Wie viel ist es nach $4$ Jahren?',
  r'Zinseszins: $K_4 = 2000 \cdot 1{,}025^4 \approx 2000 \cdot 1{,}10381 \approx 2207{,}63$ €.')
t(II, r'Von $640$ mg eines Medikaments ist nach jeweils $6$ Stunden nur noch die Hälfte im Körper. Wie viel ist nach $24$ Stunden noch da? Gib eine Funktionsgleichung an.',
  r'$24$ Stunden sind $4$ Halbwertszeiten: $640 \cdot \left(\dfrac{1}{2}\right)^4 = \dfrac{640}{16} = 40$ mg. Funktion: $m(t) = 640 \cdot 0{,}5^{t/6}$ ($t$ in Stunden).')
t(II, r'Eine Tabelle zeigt $f(0) = 80$, $f(1) = 100$, $f(2) = 125$. Liegt exponentielles Wachstum vor? Gib $f(x)$ an und berechne $f(4)$.',
  r'Die Quotienten sind gleich: $\dfrac{100}{80} = 1{,}25$ und $\dfrac{125}{100} = 1{,}25$. Also exponentiell mit $q = 1{,}25$: $f(x) = 80 \cdot 1{,}25^x$. $f(4) = 80 \cdot 1{,}25^4 = 80 \cdot 2{,}44140625 \approx 195{,}3$.')
t(III, r'Der Graph von $f(x) = a \cdot b^x$ geht durch $(0 \mid 4)$ und $(2 \mid 1)$. Bestimme $a$ und $b$. Handelt es sich um Wachstum oder Zerfall? Begründe, warum der Graph die $x$-Achse nie schneidet.',
  r'$f(0) = a = 4$. $f(2) = 4 \cdot b^2 = 1$, also $b^2 = \dfrac{1}{4}$ und $b = \dfrac{1}{2}$ (die Basis muss positiv sein). $f(x) = 4 \cdot 0{,}5^x$: Zerfall, pro Schritt halbiert sich der Wert. $0{,}5^x$ ist für jedes $x$ positiv, also ist $f(x) > 0$: keine Nullstelle, der Graph nähert sich der $x$-Achse nur an.')
t(III, r'Angebot 1: $1000$ € mit $4\,\%$ Zinseszins. Angebot 2: $1000$ € plus jedes Jahr feste $50$ €. Welches lohnt sich bei $5$ Jahren, welches bei $20$ Jahren? Begründe allgemein, warum exponentielles Wachstum lineares irgendwann überholt.',
  r'$5$ Jahre: $1000 \cdot 1{,}04^5 \approx 1216{,}65$ € gegen $1000 + 5 \cdot 50 = 1250$ €, Angebot 2 ist besser. $20$ Jahre: $1000 \cdot 1{,}04^{20} \approx 2191{,}12$ € gegen $2000$ €, Angebot 1 ist besser. Linear kommen jedes Jahr dieselben $50$ € dazu. Exponentiell kommen $4\,\%$ vom jeweils aktuellen Stand dazu, und der wächst. Sobald $4\,\%$ des Guthabens mehr als $50$ € sind, also ab $1250$ €, legt Angebot 1 jedes Jahr mehr zu und holt den Rückstand auf.')


# --- Like task 13 of the entrance test, with the deck/lab example "Lena gegen Mia" --
T.append({'q': r'(AFB I + II) Wie im Eingangstest: Lena und Mia spielen mit zwei unterschiedlichen Würfeln gegeneinander. Jede Seitenfläche hat die gleiche Wahrscheinlichkeit, gewürfelt zu werden. Auf Lenas Würfel stehen die Zahlen 3, 3, 5, 5, 7 und 7, auf Mias Würfel 4, 4, 4, 4, 6 und 6. Zuerst würfelt Lena einmal, danach Mia einmal. Es interessiert die jeweils obenliegende Zahl. a) Zeichne für dieses zweistufige Zufallsexperiment ein Baumdiagramm und beschrifte alle Pfade mit den Wahrscheinlichkeiten. b) Es gewinnt, wer die größere Zahl würfelt. Ermittle die Wahrscheinlichkeit für das Ereignis „Lena gewinnt gegen Mia“.',
          'a': '\n'.join([
              'a) 1. Stufe, Lenas Wurf: drei Äste 3, 5 und 7. Jede Zahl steht zweimal drauf, also je $\\tfrac{2}{6} = \\tfrac{1}{3}$.',
              '2. Stufe, Mias Wurf: an jedes der drei Enden zwei Äste, 4 mit $\\tfrac{4}{6} = \\tfrac{2}{3}$ (die 4 steht viermal drauf!) und 6 mit $\\tfrac{2}{6} = \\tfrac{1}{3}$.',
              'Pfadregel, entlang eines Weges multiplizieren:',
              '$\\def\\arraystretch{2.4}\\begin{array}{c|c|c} \\text{Weg} & P & \\text{gewinnt} \\\\ \\hline (3 \\mid 4) & \\dfrac{1}{3} \\cdot \\dfrac{2}{3} = \\dfrac{2}{9} & \\text{Mia} \\\\ (3 \\mid 6) & \\dfrac{1}{3} \\cdot \\dfrac{1}{3} = \\dfrac{1}{9} & \\text{Mia} \\\\ (5 \\mid 4) & \\dfrac{1}{3} \\cdot \\dfrac{2}{3} = \\dfrac{2}{9} & \\text{Lena} \\\\ (5 \\mid 6) & \\dfrac{1}{3} \\cdot \\dfrac{1}{3} = \\dfrac{1}{9} & \\text{Mia} \\\\ (7 \\mid 4) & \\dfrac{1}{3} \\cdot \\dfrac{2}{3} = \\dfrac{2}{9} & \\text{Lena} \\\\ (7 \\mid 6) & \\dfrac{1}{3} \\cdot \\dfrac{1}{3} = \\dfrac{1}{9} & \\text{Lena} \\end{array}$',
              'Kontrolle: Alle sechs Wege zusammen ergeben $\\tfrac{2 + 1 + 2 + 1 + 2 + 1}{9} = 1$. ✓',
              'b) Summenregel, die passenden Wege addieren: Lena gewinnt bei $(5 \\mid 4)$, $(7 \\mid 4)$ und $(7 \\mid 6)$, also $P(\\text{Lena gewinnt})$ $= \\tfrac{2}{9} + \\tfrac{2}{9} + \\tfrac{1}{9}$ $= \\tfrac{5}{9} \\approx 55{,}6\\,\\%$.',
              'Gegenprobe: Mia gewinnt mit $\\tfrac{2}{9} + \\tfrac{1}{9} + \\tfrac{1}{9} = \\tfrac{4}{9}$. Unentschieden geht nicht, weil die Würfel keine gemeinsame Zahl haben.',
              'Typische Fehler: Mias 4 mit $\\tfrac{1}{6}$ statt $\\tfrac{4}{6}$, entlang eines Weges addiert statt multipliziert, den Weg $(7 \\mid 6)$ vergessen.',
              'Nachspielen: Lab „Das Würfelspiel“, Voreinstellung „Deck: Lena gegen Mia“.',
          ])})

# --- AFB III with dice (Doc, 26.10.2026: "eine AFB III muss Wuerfeln sein") ------------------
t(III, r'Lena und Mia spielen wieder mit ihren Würfeln: Lena hat 3, 3, 5, 5, 7 und 7, Mia hat 4, 4, 4, 4, 6 und 6. Lena gewinnt mit der Wahrscheinlichkeit $\tfrac{5}{9}$. Mia darf genau eine Fläche ihres Würfels neu beschriften. Wie muss sie das tun, damit das Spiel fair ist, also beide mit der Wahrscheinlichkeit $\tfrac{1}{2}$ gewinnen? Weise mit einem Baumdiagramm nach, dass dein Vorschlag fair ist.',
  '\n'.join([
      r'Idee: Es gibt $6 \cdot 6 = 36$ gleich wahrscheinliche Flächenpaare. Lena gewinnt in 20 davon ($\tfrac{5}{9} = \tfrac{20}{36}$), Mia in 16. Fair heißt 18 zu 18: Mia braucht genau 2 gewonnene Paare mehr.',
      r'Lösung: Eine 4 wird zur 6. Die neue 6 schlägt nicht mehr nur Lenas zwei 3en, sondern auch ihre zwei 5en, das sind genau 2 Paare mehr. Mias Würfel: 4, 4, 4, 6, 6, 6, also $P(4) = P(6) = \tfrac{1}{2}$.',
      r'$\def\arraystretch{2.4}\begin{array}{c|c|c} \text{Weg} & P & \text{gewinnt} \\ \hline (3 \mid 4) & \dfrac{1}{3} \cdot \dfrac{1}{2} = \dfrac{1}{6} & \text{Mia} \\ (3 \mid 6) & \dfrac{1}{3} \cdot \dfrac{1}{2} = \dfrac{1}{6} & \text{Mia} \\ (5 \mid 4) & \dfrac{1}{3} \cdot \dfrac{1}{2} = \dfrac{1}{6} & \text{Lena} \\ (5 \mid 6) & \dfrac{1}{3} \cdot \dfrac{1}{2} = \dfrac{1}{6} & \text{Mia} \\ (7 \mid 4) & \dfrac{1}{3} \cdot \dfrac{1}{2} = \dfrac{1}{6} & \text{Lena} \\ (7 \mid 6) & \dfrac{1}{3} \cdot \dfrac{1}{2} = \dfrac{1}{6} & \text{Lena} \end{array}$',
      r'$P(\text{Lena gewinnt}) = 3 \cdot \tfrac{1}{6} = \tfrac{1}{2}$ und $P(\text{Mia gewinnt}) = \tfrac{1}{2}$. Unentschieden gibt es nicht, weil die Würfel keine gemeinsame Zahl haben: fair. ✓',
      r'Auch richtig: Eine 6 wird zu einer Zahl größer als 7, zum Beispiel 8. Diese Fläche schlägt dann auch Lenas zwei 7en, wieder genau 2 Paare mehr.',
      r'Keine gute Idee wäre eine 5: Dann gibt es Unentschieden (5 gegen 5). Lena gewinnt mit $\tfrac{18}{36} = \tfrac{1}{2}$, Mia aber nur mit $\tfrac{16}{36} = \tfrac{4}{9}$, das ist nicht fair.',
  ]))

# Numbers in running text stay text, LaTeX only for real formulas (Doc, 09.10.2026):
# "$12$ Jahre" -> "12 Jahre", "$30\,\%$" -> "30 %", "$40\ \mathrm{m^2}$" -> "40 m²".
import re
SUP = {'2': '\u00b2', '3': '\u00b3'}
def unit(u): return re.sub(r'\^(\d)', lambda m: SUP[m.group(1)], u)
def num(n): return n.replace('{,}', ',').replace('-', '\u2212')
def plain(t):
    t = re.sub(r'\$(-?\d+(?:\{,\}\d+)?)\$', lambda m: num(m.group(1)), t)
    t = re.sub(r'\$(-?\d+(?:\{,\}\d+)?)\\,\\%\$', lambda m: num(m.group(1)) + '\u00a0%', t)
    t = re.sub(r'\$(-?\d+(?:\{,\}\d+)?)\\ \\mathrm\{([a-zA-Z]+(?:\^\d)?)\}\$', lambda m: num(m.group(1)) + '\u00a0' + unit(m.group(2)), t)
    return t
# A chain "a = b = c" is one unbreakable formula and sticks out on a phone: split it before
# every further relation into "$a = b$ $= c$" (the plan wraps between formulas).
def chains(t):
    def split(m):
        f = m.group(1)
        if '\\begin' in f: return m.group(0)
        cut, depth, rel = [], 0, 0
        for i, c in enumerate(f):
            depth += (c == '{') - (c == '}')
            if depth: continue
            for r in (' = ', ' \\approx '):
                if f.startswith(r, i):
                    rel += 1
                    if rel > 1: cut.append(i)
        if not cut: return m.group(0)
        parts = [f[a:b].strip() for a, b in zip([0] + cut, cut + [len(f)])]
        return ' '.join('$' + p + '$' for p in parts)
    return re.sub(r'\$([^$]+)\$', split, t)
for x in T:
    x['q'], x['a'] = plain(x['q']), chains(plain(x['a']))

counts = {k: sum(1 for x in T if x['q'].startswith('(' + k + ')')) for k in (I, II, III)}
assert len(T) == 42 and counts == {I: 20, II: 12, III: 9}, (len(T), counts)
# Time per task for a BGY 11 student who practised the topic, writing included (Doc, 26.10.2026:
# "Abschaetzung pro Aufgabe, wie lange die dauern ... schreibe es gleich rein").
MIN = [3, 2, 5, 6, 5, 6,      # nr 3: equations, formulas
       3, 3, 5, 5, 3, 6,      # nr 4: non-linear, proportional, percent, binomials
       3, 5, 5, 3, 6,         # nr 5: tools, terms
       3, 3, 4, 6, 6, 8,      # nr 6: figures and solids
       2, 3, 3, 5, 5, 7,      # nr 7: function concept
       4, 2, 5, 5, 6,         # nr 8: linear functions
       2, 3, 5, 5, 7, 9,      # nr 9: exponential functions
       10,                    # entrance test: dice
       8]                     # dice, AFB III: make the game fair
assert len(MIN) == len(T)
for x, m in zip(T, MIN):
    x['q'] = re.sub(r'^\((AFB [I +]+)\) ', lambda g: '(' + g.group(1) + ' \u00b7 ca. %d\u00a0min) ' % m, x['q'], count=1)
    assert '\u00a0min) ' in x['q'], x['q'][:40]
tot = {k: sum(m for x, m in zip(T, MIN) if x['q'].startswith('(' + k + ' \u00b7')) for k in (I, II, III)}
print('minutes', sum(MIN), tot)
INFO = 'Gesamtzeit aller %d Aufgaben: ca. %d\u00a0min (%d\u00a0h %d\u00a0min)' % (len(T), sum(MIN), sum(MIN) // 60, sum(MIN) % 60)
with open(sys.argv[1], 'w', encoding='utf-8') as fh:
    json.dump({'_comment': COMMENT, 'pdf': 'mathe11-ka1-uebung.pdf', 'info': INFO, 'items': T}, fh, ensure_ascii=False, indent=2)
    fh.write('\n')
print(len(T), counts)
