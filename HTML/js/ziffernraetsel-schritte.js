// Ziffernrätsel-Labor: puzzles explained step by step down to primary-school level (Doc, 29.09.2026: "dass alle
// Schritte genau erklärt werden ... Bis runter Grundschullevel"). One entry per puzzle id of Vorrechnen's block
// "Knobeln · Ziffernrätsel" (js/vorrechnen-aufgaben-knobeln.js); a puzzle without an entry here walks through
// Vorrechnen's own steps instead (js/ziffernraetsel.js).
//
// A step:  titel     heading of the step card
//          html      the explanation - $...$ inline and $$...$$ display maths (KaTeX); v-key / v-aha / v-warn
//                    boxes and v-table from js/chapter-lab.css
//          spalte    the column the step looks at, 0 = Einer (lit up on the board)
//          setzt     letters found in this step, { M: 1 } (they stay found in every later step)
//          uebertrag carries found in this step, { 4: 1 } = a carry of 1 INTO column 4 (they stay too)
//          basis     a basics step (place value, carrying) - can be hidden for older classes
//          sprich    what her voice reads instead of html, where a table would read badly
// Every step was checked against the one solution by brute force (the lab's own solver): each letter found and
// each carry is the value of the solution, and every case said to fail really fails.
(function () {
    const T = String.raw;
    const S = window.ZIFFERNRAETSEL_SCHRITTE = window.ZIFFERNRAETSEL_SCHRITTE || {};

    S['k-money'] = [
        {
            titel: 'Das Rätsel',
            html: T`<p>Jemand hat in einer Plusaufgabe alle Ziffern versteckt. Statt der Ziffern stehen Buchstaben da:</p>
$$\mathrm{SEND}+\mathrm{MORE}=\mathrm{MONEY}$$
<p>Wir finden heraus, welche Ziffer hinter jedem Buchstaben steckt. Raten müssen wir dafür nicht – nur genau hinschauen, Schritt für Schritt.</p>
<p class="v-aha">Auf Deutsch heißt das: „Schick mehr Geld!“ Das Rätsel ist über hundert Jahre alt. Der englische Rätselerfinder Henry Dudeney hat es im Juli 1924 in der Zeitschrift „The Strand Magazine“ veröffentlicht.</p>`,
        },
        {
            titel: 'Die Spielregeln', basis: true,
            html: T`<p>Für jedes Ziffernrätsel gelten vier Regeln:</p>
<ul>
<li>Jeder Buchstabe steht für <b>eine Ziffer</b>: 0, 1, 2 und so weiter bis 9.</li>
<li><b>Gleiche Buchstaben – gleiche Ziffer.</b> Das $E$ in $\mathrm{SEND}$ ist dieselbe Ziffer wie das $E$ in $\mathrm{MORE}$ und in $\mathrm{MONEY}$.</li>
<li><b>Verschiedene Buchstaben – verschiedene Ziffern.</b> Ist $E$ eine 5, dann kann kein anderer Buchstabe mehr 5 sein.</li>
<li><b>Vorne steht nie eine 0.</b> Niemand schreibt 0123. Also sind $S$ und $M$ nicht 0.</li>
</ul>
<p>Hier kommen acht verschiedene Buchstaben vor: $S$, $E$, $N$, $D$, $M$, $O$, $R$ und $Y$. Es gibt zehn Ziffern – zwei davon bleiben am Ende übrig.</p>`,
        },
        {
            titel: 'Untereinander schreiben', basis: true,
            html: T`<p>Wir schreiben die Aufgabe so, wie man schriftlich addiert: die Zahlen <b>rechtsbündig untereinander</b>, Einer unter Einer, Zehner unter Zehner.</p>
<p>Über jeder Spalte steht klein, was eine Ziffer dort wert ist: ganz rechts die <b>Einer</b> (1), dann die <b>Zehner</b> (10), die <b>Hunderter</b> (100), die <b>Tausender</b> (1000) und ganz links die <b>Zehntausender</b> (10000).</p>
<p>Ein Beispiel mit echten Zahlen: In 1234 steht die 4 für vier Einer, die 3 für drei Zehner, die 2 für zwei Hunderter und die 1 für einen Tausender.</p>
<p>Genauso ist in $\mathrm{SEND}$ das $S$ die Tausenderziffer, $E$ die Hunderterziffer, $N$ die Zehnerziffer und $D$ die Einerziffer.</p>`,
        },
        {
            titel: 'Der Übertrag', basis: true,
            html: T`<p>Beim schriftlichen Addieren rechnet man von rechts nach links, Spalte für Spalte. Passt das Ergebnis einer Spalte nicht in ein Kästchen, gibt es einen <b>Übertrag</b>.</p>
$$\begin{array}{r} 27\\ +\;15\\ \hline 42 \end{array}$$
<p>Einer: $7+5=12$. Das sind 1 Zehner und 2 Einer. Die 2 schreiben wir unten hin, die 1 wandert als kleine Übertragsziffer in die Zehnerspalte.</p>
<p>Zehner: $2+1+1=4$ – die kleine 1 zählt mit.</p>
<p class="v-key">Übertrag heißt: Aus zehn Einern wird ein Zehner, aus zehn Zehnern ein Hunderter, und so weiter.</p>`,
        },
        {
            titel: 'Wie groß wird ein Übertrag?', basis: true,
            html: T`<p>Die größte Ziffer ist 9. Mehr als $9+9=18$ kann in einer Spalte mit zwei Zahlen nicht stehen. Kommt noch ein Übertrag dazu, sind es höchstens $9+9+1=19$.</p>
<p>19 sind 1 Zehner und 9 Einer. Weiter nach links geht also höchstens eine 1.</p>
<p class="v-key">Wenn man zwei Zahlen addiert, ist jeder Übertrag <b>0 oder 1</b>. Das brauchen wir gleich mehrmals.</p>`,
        },
        {
            titel: 'Das M', spalte: 4, setzt: { M: 1 }, uebertrag: { 4: 1 },
            html: T`<p>Schau ganz nach links. $\mathrm{MONEY}$ hat fünf Stellen, $\mathrm{SEND}$ und $\mathrm{MORE}$ haben nur vier. In der Zehntausenderspalte steht oben gar nichts.</p>
<p>Woher kommt dann das $M$ unten? Es kann nur der <b>Übertrag</b> aus der Tausenderspalte sein. Ein Übertrag ist 0 oder 1 – und $M$ darf nicht 0 sein, denn mit $M$ fängt $\mathrm{MONEY}$ an.</p>
<p class="v-key">Also ist $M=1$.</p>
<p>Das $M$ in $\mathrm{MORE}$ ist derselbe Buchstabe – dort steht jetzt auch eine 1.</p>`,
        },
        {
            titel: 'Das O', spalte: 3, setzt: { O: 0 },
            html: T`<p>Jetzt die Tausenderspalte. Oben stehen $S$ und $M$, wir rechnen also $S+1$ – vielleicht kommt noch ein Übertrag von den Hundertern dazu.</p>
<p>Aus dieser Spalte geht eine 1 nach links weiter, das ist ja unser $M$. Das klappt nur, wenn das Ergebnis der Spalte <b>mindestens 10</b> ist. Größer als $9+1+1=11$ kann es aber nicht werden.</p>
<p>Das Ergebnis ist also 10 oder 11. Unten steht davon nur die Einerziffer, und das ist $O$: entweder 0 oder 1.</p>
<p class="v-key">Die 1 gehört schon dem $M$. Also ist $O=0$.</p>`,
        },
        {
            titel: 'Die Hunderterspalte', spalte: 2, uebertrag: { 2: 1 },
            html: T`<p>In der Hunderterspalte steht $E+O$, also $E+0$. Plus 0 ändert nichts – ohne Übertrag stünde unten wieder $E$.</p>
<p>Unten steht aber $N$. Und $N$ ist ein anderer Buchstabe als $E$, also eine andere Ziffer!</p>
<p>Das geht nur, wenn von der Zehnerspalte ein <b>Übertrag</b> kommt:</p>
$$E+0+1$$
<p>Unten steht also die Einerziffer von $E+1$.</p>`,
        },
        {
            titel: 'Geht von den Hundertern etwas weiter?', spalte: 2, uebertrag: { 3: 0 },
            html: T`<p>Könnte $E+1$ schon 10 sein? Das passiert nur, wenn $E=9$ ist. Dann stünde unten die 0, also $N=0$.</p>
<p>Die 0 gehört aber schon dem $O$. Also ist $E$ nicht 9, $E+1$ bleibt kleiner als 10, und in die Tausenderspalte geht <b>kein</b> Übertrag.</p>
<p class="v-key">$N=E+1$ – auf dem Zahlenstrahl ist $N$ der rechte Nachbar von $E$.</p>`,
        },
        {
            titel: 'Das S', spalte: 3, setzt: { S: 9 },
            html: T`<p>Zurück zur Tausenderspalte. Jetzt wissen wir: Von den Hundertern kommt kein Übertrag. Dort steht also nur $S+1$.</p>
<p>Das Ergebnis kennen wir schon: unten die 0 (das $O$), links davon die 1 (das $M$) – zusammen 10.</p>
$$S+1=10$$
<p>Welche Zahl plus 1 ergibt 10?</p>
<p class="v-key">$S=9$</p>`,
        },
        {
            titel: 'Die Zehnerspalte', spalte: 1,
            html: T`<p>In der Zehnerspalte rechnen wir $N+R$, dazu vielleicht ein Übertrag von den Einern. Wir nennen ihn kurz $\text{Ü}$ – er ist 0 oder 1.</p>
<p>Unten steht $E$, und eine 1 geht zu den Hundertern weiter – das haben wir bei der Hunderterspalte gesehen. Das Ergebnis der Spalte ist also $E+10$:</p>
$$N+R+\text{Ü}=E+10$$
<p>Für $N$ setzen wir $E+1$ ein:</p>
$$E+1+R+\text{Ü}=E+10 \qquad \big|\; N=E+1$$
<p>Stell dir eine Waage vor: Auf beiden Seiten liegt ein $E$. Nimmst du auf beiden Seiten das $E$ weg, bleibt die Waage im Gleichgewicht:</p>
$$1+R+\text{Ü}=10 \qquad \big|\; -E$$
$$R+\text{Ü}=9 \qquad \big|\; -1$$`,
            sprich: T`In der Zehnerspalte rechnen wir N plus R, dazu vielleicht ein Übertrag von den Einern. Er ist 0 oder 1. Unten steht E, und eine 1 geht zu den Hundertern weiter. Das Ergebnis der Spalte ist also E plus 10. Für N setzen wir E plus 1 ein. Stell dir eine Waage vor: Auf beiden Seiten liegt ein E. Nimmst du auf beiden Seiten das E weg, bleibt die Waage im Gleichgewicht. Dann nehmen wir noch auf beiden Seiten 1 weg, und es bleibt: R plus Übertrag gleich 9.`,
        },
        {
            titel: 'Das R', spalte: 1, setzt: { R: 8 }, uebertrag: { 1: 1 },
            html: T`<p>$R+\text{Ü}=9$, und der Übertrag $\text{Ü}$ ist 0 oder 1.</p>
<p>Wäre $\text{Ü}=0$, dann wäre $R=9$. Die 9 gehört aber schon dem $S$. Also ist $\text{Ü}=1$ – von den Einern kommt eine 1 herüber.</p>
$$R+1=9 \qquad \big|\; \text{Ü}=1$$
<p class="v-key">$R=8$</p>`,
            sprich: T`R plus Übertrag gleich 9, und der Übertrag ist 0 oder 1. Wäre der Übertrag 0, dann wäre R gleich 9. Die 9 gehört aber schon dem S. Also ist der Übertrag 1 – von den Einern kommt eine 1 herüber. R plus 1 gleich 9, also ist R gleich 8.`,
        },
        {
            titel: 'Was ist noch frei?',
            html: T`<p>Vergeben sind schon: $M=1$, $O=0$, $S=9$ und $R=8$. Unten in der Ziffernleiste siehst du es.</p>
<p>Frei sind noch die Ziffern <b>2, 3, 4, 5, 6 und 7</b>. Und vier Buchstaben fehlen noch: $E$, $N$, $D$ und $Y$.</p>`,
        },
        {
            titel: 'Die Einerspalte', spalte: 0,
            html: T`<p>Ganz rechts steht $D+E$. Unten steht $Y$, und eine 1 geht in die Zehnerspalte weiter – das wissen wir vom $R$. Das Ergebnis der Spalte ist also $Y+10$:</p>
$$D+E=Y+10$$
<p>$Y$ ist eine der freien Ziffern, also mindestens 2. Darum muss $D+E$ mindestens 12 sein.</p>
<p class="v-key">$D+E\ge 12$</p>`,
        },
        {
            titel: 'E ausprobieren',
            html: T`<p>Jetzt probieren wir – aber geschickt. $E$ und $N=E+1$ sind Nachbarn, und beide müssen frei sein. Aus 2 bis 7 gibt es diese Paare. $D$ ist höchstens 7, denn 8 und 9 sind vergeben. Und wegen $D+E\ge 12$ muss $D$ mindestens $12-E$ sein:</p>
<table class="v-table">
<tr><th>$E$</th><th>$N$</th><th>$D$ mindestens</th><th></th></tr>
<tr><td>2</td><td>3</td><td>10</td><td class="zr-nein">keine Ziffer</td></tr>
<tr><td>3</td><td>4</td><td>9</td><td class="zr-nein">9 hat $S$</td></tr>
<tr><td>4</td><td>5</td><td>8</td><td class="zr-nein">8 hat $R$, 9 hat $S$</td></tr>
<tr><td>5</td><td>6</td><td>7</td><td class="zr-ja">7 ist frei</td></tr>
<tr><td>6</td><td>7</td><td>6</td><td class="zr-nein">6 bis 9 sind weg</td></tr>
</table>
<p>Bei $E=6$ ist $N=7$. Die 6 hat dann $E$, die 7 hat $N$, die 8 hat $R$ und die 9 hat $S$ – für $D$ bleibt nichts Großes übrig.</p>`,
            sprich: T`Jetzt probieren wir, aber geschickt. E und N sind Nachbarn, und beide müssen frei sein. D ist höchstens 7, denn 8 und 9 sind vergeben. Und D muss mindestens 12 minus E sein. Mit E gleich 2 müsste D mindestens 10 sein, das ist keine Ziffer. Mit E gleich 3 müsste D mindestens 9 sein, die hat aber S. Mit E gleich 4 müsste D mindestens 8 sein, 8 und 9 sind vergeben. Mit E gleich 6 ist N gleich 7, und D müsste mindestens 6 sein – aber 6, 7, 8 und 9 sind alle weg. Nur mit E gleich 5 klappt es: N ist 6, und D muss mindestens 7 sein – die 7 ist frei.`,
        },
        {
            titel: 'E, N und D', spalte: 0, setzt: { E: 5, N: 6, D: 7 },
            html: T`<p>Nur ein Paar bleibt übrig:</p>
$$E=5 \qquad N=6 \qquad D=7$$
<p>Prüfen wir es: $N=E+1$, denn $6=5+1$. Und $D+E=7+5=12$, das ist mindestens 12. Passt!</p>`,
        },
        {
            titel: 'Das Y', spalte: 0, setzt: { Y: 2 },
            html: T`<p>Einerspalte: $D+E=7+5=12$. Die 2 kommt unten hin, die 1 geht als Übertrag zu den Zehnern – genau der Übertrag, den wir beim $R$ gefunden haben.</p>
$$7+5=Y+10 \qquad \big|\; \text{einsetzen}$$
$$Y=2 \qquad \big|\; -10$$
<p class="v-key">$Y=2$ – und die 2 war noch frei.</p>`,
        },
        {
            titel: 'Die Probe',
            html: T`<p>Alle Buchstaben sind gefunden. Wir rechnen mit den Ziffern nach:</p>
$$\begin{array}{r} 9567\\ +\;1085\\ \hline 10652 \end{array}$$
<p>Einer: $7+5=12$ – 2 hin, 1 weiter. Zehner: $6+8+1=15$ – 5 hin, 1 weiter. Hunderter: $5+0+1=6$. Tausender: $9+1=10$ – 0 hin, 1 weiter. Zehntausender: die 1.</p>
<p class="v-aha">Es stimmt! Jeder Buchstabe hat seine eigene Ziffer, und die 3 und die 4 sind übrig geblieben.</p>`,
        },
        {
            titel: 'Die Lösung',
            html: T`$$\mathrm{SEND}=9567 \qquad \mathrm{MORE}=1085 \qquad \mathrm{MONEY}=10652$$
<p>Wir haben nie geraten: Jede Ziffer folgt aus den Regeln, und am Ende blieb für jeden Buchstaben genau eine Möglichkeit. Das Rätsel hat also <b>genau eine Lösung</b>.</p>
<p>Die Werte: $D=7$, $E=5$, $M=1$, $N=6$, $O=0$, $R=8$, $S=9$, $Y=2$.</p>`,
        },
    ];
})();
