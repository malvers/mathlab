/* vektoren-mod-grundlagen.js — chapters 1 to 4 of the Vektoren lab, all in 2D:
 * the notion of a vector, arithmetic, length and unit vector, linear combination.
 * These are the chapters where dragging does the teaching, so every figure has
 * grab handles and the numbers next to the stage update while the mouse moves.
 */
(function () {
    'use strict';
    const { COL, V, num, Tex } = window.VekLab;
    const R = String.raw;
    const T = Tex;
    /** Column vector in KaTeX, integers stay integers. */
    const col = v => T.col(v, 2);

    // ==================================================================
    // 1 — Vektorbegriff und Ortsvektoren
    // ==================================================================
    const S1 = {
        view: 'ort',
        P: [3, 2], A: [-4, -2], B: [-1, 1],
        C: [4, 3],                       // third corner in parallelogram mode
        ort: true, ab: true, reps: true, comps: true,
    };
    const REP_ANCHORS = [[1, -3], [-5, 2], [3, 3]];

    VekLab.register({
        id: 'grundlagen',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Ansicht', '<div id="v1-view"></div>', COL.orange);
            CyberUI.createDropdown('v1-view', [
                { id: 'ort', label: 'Ortsvektor und Verbindungsvektor' },
                { id: 'mitte', label: 'Mittelpunkt einer Strecke' },
                { id: 'para', label: 'Parallelogramm und Diagonalen' },
            ], id => { S1.view = id; this.showCards(); this.wireHandles(ctx); ctx.redraw(); this.hud(ctx); }, S1.view);

            CyberUI.createCard(c, 'Anzeigen', '<div id="v1-opt"></div>', COL.orange);
            CyberUI.createCheckbox('v1-opt', 'Ortsvektor von P', S1.ort, v => { S1.ort = v; ctx.redraw(); }, COL.orange);
            CyberUI.createCheckbox('v1-opt', 'Vektor von A nach B', S1.ab, v => { S1.ab = v; ctx.redraw(); }, COL.green);
            CyberUI.createCheckbox('v1-opt', 'Repräsentanten', S1.reps, v => { S1.reps = v; ctx.redraw(); }, COL.green);
            CyberUI.createCheckbox('v1-opt', 'Komponenten x und y', S1.comps, v => { S1.comps = v; ctx.redraw(); }, COL.blue);
            VekLab.buttons('v1-opt', [{
                label: 'Zurücksetzen', run: () => {
                    S1.P = [3, 2]; S1.A = [-4, -2]; S1.B = [-1, 1]; S1.C = [4, 3];
                    ctx.stage2.fit([[-6, -4], [6, 4]]); ctx.redraw(); this.hud(ctx);
                }
            }]);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh die Punkte mit der Maus. Mausrad zoomt, Ziehen im leeren Feld verschiebt die Ansicht.</div>', COL.blue);

            this.showCards = () => {
                const cards = document.querySelectorAll('#sb-grundlagen .instrument-card');
                if (cards[1]) cards[1].style.display = S1.view === 'ort' ? '' : 'none';
            };
            this.showCards();

            ctx.theory(R`
<p>Ein <b>Vektor</b> ist kein Punkt und keine Strecke, sondern eine <b>Verschiebung</b>: so weit in x‑Richtung, so weit in y‑Richtung. Deshalb sind <b>alle</b> Pfeile mit gleicher Länge und gleicher Richtung derselbe Vektor — völlig egal, wo sie anfangen.</p>
<p>Schalte links <i>Repräsentanten</i> ein und zieh an <b>B</b>: die blassen Pfeile wandern mit, weil sie denselben Vektor zeigen wie $\overrightarrow{AB}$. Man nennt sie Repräsentanten oder Pfeilklasse.</p>
<div class="v-key">$$\overrightarrow{AB} \;=\; B-A$$ <b>Spitze minus Fuß.</b> Der Vektor von $A$ nach $B$ ist die Spitze minus der Fuß — genau so steht es auf dem Spickzettel.</div>
<p>Ein <b>Ortsvektor</b> ist der Sonderfall, bei dem der Pfeil im Ursprung $O$ startet: $\vec{p}=\overrightarrow{OP}$. Seine Koordinaten sind dieselben Zahlen wie die des Punktes — aber Punkt und Vektor bleiben zwei verschiedene Dinge.</p>
<div class="v-warn"><b>Der Unterschied, der am meisten Punkte kostet:</b> der Punkt heißt $A(3/-2/2)$ — runde Klammern, Schrägstriche. Der Vektor ist eine <b>Spalte mit Pfeil darüber</b>. Punkt = Stelle im Raum, Vektor = Verschiebung ohne festen Ort.</div>
<p>Die <b>Komponenten</b> sind die beiden Teilverschiebungen. Der gestrichelte Weg „erst x, dann y“ endet an derselben Stelle wie der Pfeil — das ist später der Schlüssel zur Addition.</p>

<h3 style="color:rgb(121,158,49);font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:2px;margin:18px 0 8px">Mittelpunkt einer Strecke</h3>
<p>Vom Anfangspunkt aus die <b>halbe</b> Verschiebung gehen — mehr ist es nicht:</p>
<div class="v-key">$$M=A+\tfrac{1}{2}\cdot\overrightarrow{AB}\;=\;\tfrac{1}{2}\cdot(A+B)$$</div>
<p>Die rechte Form ist die schnellere: einfach die Koordinaten paarweise mitteln. Stell links <i>Mittelpunkt einer Strecke</i> ein und zieh an $A$ und $B$.</p>
<div class="v-warn">„M ist der Mittelpunkt der Strecke $\overline{AB}$“ — mit <b>Strich</b> oben, nicht mit Pfeil. Gemeint ist das Stück Linie, nicht der Vektor.</div>

<h3 style="color:rgb(121,158,49);font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:2px;margin:18px 0 8px">Parallelogramm und Diagonalen</h3>
<p>Im Parallelogramm $ABCD$ sind gegenüberliegende Seiten derselbe Vektor. Daraus folgt direkt die Formel für den vierten Punkt:</p>
<div class="v-key">$$\overrightarrow{AB}=\overrightarrow{DC}\quad\Longrightarrow\quad D=C-\overrightarrow{AB}$$</div>
<p>Und die <b>Diagonalen halbieren einander</b> — der Schnittpunkt $S$ ist also der Mittelpunkt <b>beider</b> Diagonalen:</p>
<div class="v-key">$$S=\tfrac{1}{2}\cdot(A+C)=\tfrac{1}{2}\cdot(B+D)$$</div>
<div class="v-warn"><b>Die häufigste Falle:</b> die Umlaufrichtung verdrehen und $\overrightarrow{CD}$ statt $\overrightarrow{DC}$ nehmen — dann landet $D$ gespiegelt. Gegenprobe: es muss auch $\overrightarrow{AD}=\overrightarrow{BC}$ gelten. Zieh die Ecken auf der Bühne und schau zu, ob das Viereck ein Parallelogramm bleibt.</div>`);

            ctx.tasks([
                {
                    q: R`Gegeben sind $A(2/1)$ und $B(7/4)$. Bestimme $\overrightarrow{AB}$ und $\overrightarrow{BA}$.`,
                    hint: R`Spitze minus Fuß — und überlege dir vorher, wie sich die beiden Ergebnisse unterscheiden müssen.`,
                    sol: R`<span class="v-step">Spitze minus Fuß</span>
$$\overrightarrow{AB}=B-A=\begin{pmatrix}7\\4\end{pmatrix}-\begin{pmatrix}2\\1\end{pmatrix}=\begin{pmatrix}5\\3\end{pmatrix}$$
<span class="v-step">Der Rückweg</span>
$$\overrightarrow{BA}=A-B=\begin{pmatrix}-5\\-3\end{pmatrix}=-\overrightarrow{AB}$$
<p class="v-res">Umdrehen heißt: alle Vorzeichen wechseln. $\overrightarrow{BA}=-\overrightarrow{AB}$.</p>
<div class="v-warn">Fuß und Spitze zu vertauschen ist Fehlerfalle Nummer 1. Sprich beim Hinschreiben laut mit: „Spitze minus Fuß“.</div>`
                },
                {
                    q: R`Der Vektor $\vec{v}=\begin{pmatrix}3\\-2\end{pmatrix}$ wird an den Punkt $C(-1/4)$ angeheftet. Welchen Punkt $D$ erreicht die Spitze?`,
                    sol: R`<span class="v-step">Anheften heißt addieren</span>
$$D=C+\vec{v}=\begin{pmatrix}-1\\4\end{pmatrix}+\begin{pmatrix}3\\-2\end{pmatrix}=\begin{pmatrix}2\\2\end{pmatrix}$$
<p class="v-res">$D(2/2)$.</p>
<p>Probe mit „Spitze minus Fuß“: $\overrightarrow{CD}=\begin{pmatrix}2\\2\end{pmatrix}-\begin{pmatrix}-1\\4\end{pmatrix}=\begin{pmatrix}3\\-2\end{pmatrix}=\vec{v}$. ✓</p>`
                },
                {
                    q: R`Bestimme den Mittelpunkt $M$ der Strecke $\overline{AB}$ für $A(-3/-6/-3)$ und $B(7/0/1)$.`,
                    hint: R`Koordinaten paarweise mitteln — das ist die Kurzform der Formel.`,
                    sol: R`<span class="v-step">Kurzform: mitteln</span>
$$M=\tfrac{1}{2}(A+B)=\tfrac{1}{2}\begin{pmatrix}-3+7\\-6+0\\-3+1\end{pmatrix}=\tfrac{1}{2}\begin{pmatrix}4\\-6\\-2\end{pmatrix}=\begin{pmatrix}2\\-3\\-1\end{pmatrix}$$
<p class="v-res">$M(2/-3/-1)$</p>
<span class="v-step">Kontrolle über die lange Form</span>
$$\overrightarrow{AB}=\begin{pmatrix}10\\6\\4\end{pmatrix},\qquad A+\tfrac12\overrightarrow{AB}=\begin{pmatrix}-3\\-6\\-3\end{pmatrix}+\begin{pmatrix}5\\3\\2\end{pmatrix}=\begin{pmatrix}2\\-3\\-1\end{pmatrix}\;✓$$`
                },
                {
                    q: R`$A(2/3/4)$, $B(3/5/7)$ und $C(4/1/-1)$ sind drei Ecken eines Parallelogramms $ABCD$. Berechne $D$ und den Diagonalenschnittpunkt $S$.`,
                    hint: R`Bedingung $\overrightarrow{AB}=\overrightarrow{DC}$, also $D=C-\overrightarrow{AB}$. Für $S$ reicht der Mittelpunkt einer Diagonalen.`,
                    sol: R`<span class="v-step">Verbindungsvektor</span>
$$\overrightarrow{AB}=B-A=\begin{pmatrix}1\\2\\3\end{pmatrix}$$
<span class="v-step">Vierter Punkt</span>
$$D=C-\overrightarrow{AB}=\begin{pmatrix}4\\1\\-1\end{pmatrix}-\begin{pmatrix}1\\2\\3\end{pmatrix}=\begin{pmatrix}3\\-1\\-4\end{pmatrix}$$
<p class="v-res">$D(3/-1/-4)$</p>
<span class="v-step">Gegenprobe über die andere Seite</span>
$$\overrightarrow{AD}=D-A=\begin{pmatrix}1\\-4\\-8\end{pmatrix},\qquad \overrightarrow{BC}=C-B=\begin{pmatrix}1\\-4\\-8\end{pmatrix}\;✓$$
<span class="v-step">Diagonalenschnittpunkt</span>
$$S=\tfrac12(A+C)=\tfrac12\begin{pmatrix}6\\4\\3\end{pmatrix}=\begin{pmatrix}3\\2\\1{,}5\end{pmatrix}$$
<p>Probe über die andere Diagonale: $\tfrac12(B+D)=\tfrac12\begin{pmatrix}6\\4\\3\end{pmatrix}$ — dasselbe ✓</p>
<p class="v-res">$D(3/-1/-4)$ und $S(3/2/1{,}5)$</p>`
                },
                {
                    q: R`Warum ist die Aussage „der Vektor $\begin{pmatrix}2\\1\end{pmatrix}$ liegt im Punkt $(2/1)$“ falsch?`,
                    sol: R`<p>Weil ein Vektor <b>keinen Ort</b> hat. Er beschreibt nur „2 nach rechts, 1 nach oben“ und darf überall in der Ebene angeheftet werden — genau das zeigen die Repräsentanten auf der Bühne.</p>
<p class="v-res">Erst wenn man einen Startpunkt festlegt, entsteht ein konkreter Pfeil. Legt man den Ursprung als Start fest, heißt er Ortsvektor — und nur dann passen Koordinaten des Punktes und Komponenten des Vektors zusammen.</p>`
                },
            ]);
        },

        onShow(ctx) {
            ctx.stage2.fit([[-6, -4], [6, 4]]);
            this.wireHandles(ctx);
            if (this.showCards) this.showCards();
            this.hud(ctx);
        },

        /** Register the drag points of the current view. */
        wireHandles(ctx) {
            const st = ctx.stage2;
            st.clearHandles();
            if (S1.view === 'para') {
                st.addHandle(() => S1.A, p => S1.A = p, COL.orange, 'A');
                st.addHandle(() => S1.B, p => S1.B = p, COL.orange, 'B');
                st.addHandle(() => S1.C, p => S1.C = p, COL.orange, 'C');
                ctx.tip('Ziehen: A, B, C — D wird gerechnet');
            } else if (S1.view === 'mitte') {
                st.addHandle(() => S1.A, p => S1.A = p, COL.orange, 'A');
                st.addHandle(() => S1.B, p => S1.B = p, COL.blue, 'B');
                ctx.tip('Ziehen: A und B');
            } else {
                st.addHandle(() => S1.P, p => S1.P = p, COL.orange, 'P');
                st.addHandle(() => S1.A, p => S1.A = p, COL.green, 'A');
                st.addHandle(() => S1.B, p => S1.B = p, COL.green, 'B');
                ctx.tip('Ziehen: P, A, B  ·  Mausrad: Zoom');
            }
        },
        /** The handle set depends on the view, so a view change must rebuild them. */
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            if (S1.view === 'mitte') {
                const M = V.scale(V.add(S1.A, S1.B), 0.5);
                ctx.hud(R`
<div class="v-hud-row"><span class="v-hud-lab">Strecke</span><span class="v-hud-val">A(${num(S1.A[0])}/${num(S1.A[1])})  B(${num(S1.B[0])}/${num(S1.B[1])})</span></div>
<div style="margin:6px 0">$\overrightarrow{AB}=B-A=` + col(V.sub(S1.B, S1.A)) + R`$</div>
<div style="margin:6px 0;color:` + COL.green + R`">$M=\tfrac{1}{2}(A+B)=` + col(M) + R`$</div>
<div class="v-hud-note">Beide Wege führen hierher: $A+\tfrac12\overrightarrow{AB}$ und $\tfrac12(A+B)$.</div>`);
                return;
            }
            if (S1.view === 'para') {
                const ab = V.sub(S1.B, S1.A);
                const D = V.sub(S1.C, ab);
                const S = V.scale(V.add(S1.A, S1.C), 0.5);
                const ad = V.sub(D, S1.A), bc = V.sub(S1.C, S1.B);
                ctx.hud(R`
<div style="margin:2px 0">$\overrightarrow{AB}=B-A=` + col(ab) + R`$</div>
<div style="margin:6px 0;color:` + COL.green + R`">$D=C-\overrightarrow{AB}=` + col(S1.C) + '-' + col(ab) + '=' + col(D) + R`$</div>
<div style="margin:6px 0;color:` + COL.purple + R`">$S=\tfrac{1}{2}(A+C)=` + col(S) + R`$</div>
<div class="v-hud-row"><span class="v-hud-lab">Gegenprobe AD = BC</span><span class="v-hud-val">${num(ad[0])}/${num(ad[1])} = ${num(bc[0])}/${num(bc[1])}</span></div>
<div class="v-hud-note">Die Diagonalen halbieren einander — $S$ ist der Mittelpunkt von <b>beiden</b>.</div>`);
                return;
            }
            const ab = V.sub(S1.B, S1.A);
            ctx.hud(R`
<div class="v-hud-row"><span class="v-hud-lab">Punkt P</span><span class="v-hud-val">P(${num(S1.P[0])}/${num(S1.P[1])})</span></div>
<div style="margin:6px 0">$\vec{p}=\overrightarrow{OP}=` + col(S1.P) + R`$</div>
<div class="v-hud-row"><span class="v-hud-lab">A und B</span><span class="v-hud-val">A(${num(S1.A[0])}/${num(S1.A[1])}),  B(${num(S1.B[0])}/${num(S1.B[1])})</span></div>
<div style="margin:6px 0">$\overrightarrow{AB}=B-A=` + col(S1.B) + '-' + col(S1.A) + '=' + col(ab) + R`$</div>
<div class="v-hud-note">Verschieb A und B gemeinsam — $\overrightarrow{AB}$ bleibt gleich.</div>`);
        },

        draw(st, ctx) {
            const O = [0, 0];
            if (S1.view === 'mitte') {
                const M = V.scale(V.add(S1.A, S1.B), 0.5);
                st.segment(S1.A, S1.B, COL.grey, { width: 2, alpha: 0.7 });
                st.arrow(S1.A, M, COL.orange, null, { width: 3 });
                st.arrow(M, S1.B, COL.blue, null, { width: 3, alpha: 0.6, dash: [6, 5] });
                st.dot(M, COL.green, 7);
                st.text('M', M, COL.green, { dy: -18, font: "700 13px 'Orbitron', sans-serif" });
                st.text('½·AB', V.lerp(S1.A, M, 0.5), COL.orange, { dy: 16, font: "600 11px 'Orbitron', sans-serif" });
                st.dot(O, 'rgba(255,255,255,0.8)', 4);
                return;
            }
            if (S1.view === 'para') {
                const ab = V.sub(S1.B, S1.A);
                const D = V.sub(S1.C, ab);
                const S = V.scale(V.add(S1.A, S1.C), 0.5);
                st.polygon([S1.A, S1.B, S1.C, D], COL.green, COL.green, { alpha: 0.12, width: 2 });
                st.segment(S1.A, S1.C, COL.purple, { dash: [6, 5], width: 1.8 });
                st.segment(S1.B, D, COL.purple, { dash: [6, 5], width: 1.8 });
                st.arrow(S1.A, S1.B, COL.orange, 'AB', { width: 3 });
                st.arrow(D, S1.C, COL.blue, 'DC', { width: 3 });
                st.dot(D, COL.green, 7);
                st.text('D', D, COL.green, { dy: -18, font: "700 13px 'Orbitron', sans-serif" });
                st.dot(S, COL.purple, 6);
                st.text('S', S, COL.purple, { dy: -17, font: "700 12px 'Orbitron', sans-serif" });
                st.dot(O, 'rgba(255,255,255,0.8)', 4);
                return;
            }
            if (S1.comps && S1.ort) {
                st.segment(O, [S1.P[0], 0], COL.blue, { dash: [5, 4], width: 1.6, alpha: 0.9 });
                st.segment([S1.P[0], 0], S1.P, COL.blue, { dash: [5, 4], width: 1.6, alpha: 0.9 });
                st.text(num(S1.P[0]), [S1.P[0] / 2, 0], COL.blue, { dy: S1.P[1] >= 0 ? 15 : -15, font: "600 12px Arial" });
                st.text(num(S1.P[1]), [S1.P[0], S1.P[1] / 2], COL.blue, { dx: S1.P[0] >= 0 ? 16 : -16, font: "600 12px Arial" });
            }
            if (S1.ab && S1.reps) {
                const ab = V.sub(S1.B, S1.A);
                REP_ANCHORS.forEach(a => st.arrow(a, V.add(a, ab), COL.green, null, { alpha: 0.4, width: 2, dash: [6, 5] }));
            }
            if (S1.ab) st.arrow(S1.A, S1.B, COL.green, 'AB', { width: 3 });
            if (S1.ort) st.arrow(O, S1.P, COL.orange, 'p', { width: 3 });
            st.dot(O, 'rgba(255,255,255,0.8)', 4);
            st.text('O', O, 'rgba(255,255,255,0.7)', { dx: -12, dy: 12, font: "600 12px 'Orbitron', sans-serif" });
        },
    });

    // ==================================================================
    // 2 — Addition, Subtraktion, Skalarmultiplikation
    // ==================================================================
    const S2 = { a: [4, 1], b: [1, 3], r: 1.5, mode: 'add' };

    VekLab.register({
        id: 'rechnen',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Rechenart', '<div id="v2-mode"></div>', COL.orange);
            CyberUI.createDropdown('v2-mode', [
                { id: 'add', label: 'Addition  a + b' },
                { id: 'sub', label: 'Subtraktion  a − b' },
                { id: 'skalar', label: 'Skalarmultiplikation  r · a' },
                { id: 'alles', label: 'alles zusammen' },
            ], id => { S2.mode = id; ctx.redraw(); this.hud(ctx); }, S2.mode);

            CyberUI.createCard(c, 'Faktor', '<div id="v2-par"></div>', COL.purple);
            this.rSlider = VekLab.slider('v2-par', 'r', -3, 3, S2.r, 0.1,
                x => { S2.r = +x; ctx.redraw(); this.hud(ctx); }, COL.purple, x => num(+x, 1));
            VekLab.buttons('v2-par', [
                { label: 'r = −1', run: () => { S2.r = -1; this.rSlider.set(-1); ctx.redraw(); this.hud(ctx); } },
                { label: 'r = 0', run: () => { S2.r = 0; this.rSlider.set(0); ctx.redraw(); this.hud(ctx); } },
                { label: 'r = 2', run: () => { S2.r = 2; this.rSlider.set(2); ctx.redraw(); this.hud(ctx); } },
            ]);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh die Spitzen von <b>a</b> und <b>b</b>. Die Rechnung im Feld oben links läuft live mit.</div>', COL.blue);

            ctx.theory(R`
<p>Vektoren werden <b>komponentenweise</b> gerechnet — jede Zeile für sich. Das ist die ganze Rechenvorschrift:</p>
<div class="v-key">$$\vec{a}+\vec{b}=\begin{pmatrix}a_1+b_1\\a_2+b_2\end{pmatrix},\qquad r\cdot\vec{a}=\begin{pmatrix}r\,a_1\\r\,a_2\end{pmatrix}$$</div>
<p><b>Addition, geometrisch:</b> hänge $\vec{b}$ an die Spitze von $\vec{a}$ — „Spitze an Fuß“. Der Pfeil vom Start zum Ende ist die Summe. Genauso gut kannst du das <b>Parallelogramm</b> aufspannen: die Diagonale ist die Summe. Beides steht auf der Bühne, schalte hin und her.</p>
<p><b>Subtraktion:</b> $\vec{a}-\vec{b}=\vec{a}+(-\vec{b})$. Der spannende Pfeil ist der von der Spitze von $\vec b$ zur Spitze von $\vec a$ — das ist genau $\vec{a}-\vec{b}$, und es ist dasselbe „Spitze minus Fuß“ wie in Kapitel 1.</p>
<div class="v-aha"><b>Aha:</b> die beiden Diagonalen im Parallelogramm sind $\vec a+\vec b$ und $\vec a-\vec b$. Zieh $\vec b$ so, dass die Diagonalen gleich lang werden — dann steht $\vec a$ senkrecht auf $\vec b$. Das ist Kapitel 8, schon jetzt sichtbar.</div>
<p><b>Skalarmultiplikation:</b> $r\cdot\vec{a}$ streckt den Pfeil. $r\gt 1$ macht länger, $0\lt r\lt 1$ kürzer, $r\lt 0$ dreht ihn um, $r=0$ macht ihn zum <b>Nullvektor</b> $\vec{0}$. Die <b>Richtung</b> bleibt dieselbe Gerade — das brauchen wir in Kapitel 4 und 5.</p>`);

            ctx.tasks([
                {
                    q: R`Berechne $\;2\vec{a}-3\vec{b}\;$ für $\vec{a}=\begin{pmatrix}4\\-1\end{pmatrix}$ und $\vec{b}=\begin{pmatrix}-2\\3\end{pmatrix}$.`,
                    sol: R`<span class="v-step">Erst strecken, dann addieren</span>
$$2\vec{a}=\begin{pmatrix}8\\-2\end{pmatrix},\qquad 3\vec{b}=\begin{pmatrix}-6\\9\end{pmatrix}$$
$$2\vec{a}-3\vec{b}=\begin{pmatrix}8-(-6)\\-2-9\end{pmatrix}=\begin{pmatrix}14\\-11\end{pmatrix}$$
<p class="v-res">$2\vec{a}-3\vec{b}=\begin{pmatrix}14\\-11\end{pmatrix}$</p>`
                },
                {
                    q: R`Bestimme $x$ so, dass $\;\vec{a}+x\cdot\vec{b}=\vec{c}\;$ gilt, mit $\vec{a}=\begin{pmatrix}1\\5\end{pmatrix}$, $\vec{b}=\begin{pmatrix}2\\-1\end{pmatrix}$, $\vec{c}=\begin{pmatrix}7\\2\end{pmatrix}$.`,
                    hint: R`Eine Vektorgleichung ist in Wahrheit ein Gleichungssystem — eine Gleichung pro Zeile. Beide müssen dasselbe $x$ liefern.`,
                    sol: R`<span class="v-step">Zeilenweise aufschreiben</span>
$$\text{I: } 1+2x=7 \quad\Rightarrow\quad x=3$$
$$\text{II: } 5-x=2 \quad\Rightarrow\quad x=3$$
<span class="v-step">Beide Zeilen prüfen</span>
<p>Beide Zeilen liefern $x=3$ — die Gleichung ist lösbar.</p>
<p class="v-res">$x=3$</p>
<div class="v-warn">Hätte Zeile II etwa $x=4$ ergeben, gäbe es <b>keine</b> Lösung. Beide Zeilen müssen zusammenpassen — dieselbe Falle wie bei Schnittpunkten von Geraden in Kapitel 5.</div>`
                },
                {
                    q: R`Ein Boot fährt mit $\vec{v}_{B}=\begin{pmatrix}0\\6\end{pmatrix}$ (km/h) quer über einen Fluss, die Strömung trägt es mit $\vec{v}_{S}=\begin{pmatrix}2{,}5\\0\end{pmatrix}$ ab. Welche Bewegung führt das Boot tatsächlich aus?`,
                    sol: R`<span class="v-step">Überlagerung = Addition</span>
$$\vec{v}=\vec{v}_B+\vec{v}_S=\begin{pmatrix}2{,}5\\6\end{pmatrix}$$
<p class="v-res">Das Boot bewegt sich mit $\begin{pmatrix}2{,}5\\6\end{pmatrix}$ km/h, also schräg flussabwärts.</p>
<p>Genau dafür wurden Vektoren erfunden: zwei Einflüsse gleichzeitig, ein Ergebnis. In Kapitel 3 rechnest du auch noch die tatsächliche Geschwindigkeit $|\vec v|$ aus.</p>`
                },
                {
                    q: R`Zeige rechnerisch: $\;\overrightarrow{AB}+\overrightarrow{BC}+\overrightarrow{CA}=\vec{0}\;$ für beliebige Punkte $A$, $B$, $C$.`,
                    hint: R`Schreib jeden Summanden als „Spitze minus Fuß“ mit Ortsvektoren.`,
                    sol: R`<span class="v-step">Alles in Ortsvektoren</span>
$$(\vec{b}-\vec{a})+(\vec{c}-\vec{b})+(\vec{a}-\vec{c})$$
<span class="v-step">Sortieren</span>
$$=\vec{a}-\vec{a}+\vec{b}-\vec{b}+\vec{c}-\vec{c}=\vec{0}$$
<p class="v-res">Jeder geschlossene Rundweg summiert sich zum Nullvektor — egal wie viele Ecken er hat.</p>`
                },
            ]);
        },

        onShow(ctx) {
            const st = ctx.stage2;
            st.fit([[-6, -4], [7, 5]]);
            st.addHandle(() => S2.a, p => S2.a = p, COL.orange, 'a', true);
            st.addHandle(() => S2.b, p => S2.b = p, COL.blue, 'b', true);
            ctx.tip('Ziehen: die Spitzen von a und b');
            this.hud(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const { a, b, r } = S2;
            const rows = [];
            rows.push(R`<div style="margin:2px 0">$\vec{a}=` + col(a) + R`\;,\;\; \vec{b}=` + col(b) + '$</div>');
            if (S2.mode === 'add' || S2.mode === 'alles')
                rows.push(R`<div style="margin:6px 0;color:` + COL.green + R`">$\vec{a}+\vec{b}=` + col(V.add(a, b)) + '$</div>');
            if (S2.mode === 'sub' || S2.mode === 'alles')
                rows.push(R`<div style="margin:6px 0;color:` + COL.red + R`">$\vec{a}-\vec{b}=` + col(V.sub(a, b)) + '$</div>');
            if (S2.mode === 'skalar' || S2.mode === 'alles')
                rows.push(R`<div style="margin:6px 0;color:` + COL.purple + R`">$` + T.num(r, 1) + R`\cdot\vec{a}=` + col(V.scale(a, r)) + '$</div>');
            let note = '';
            if (S2.mode === 'skalar' || S2.mode === 'alles') {
                note = r > 1 ? 'r &gt; 1: länger, gleiche Richtung.'
                    : r === 1 ? 'r = 1: nichts passiert.'
                        : r > 0 ? '0 &lt; r &lt; 1: kürzer, gleiche Richtung.'
                            : Math.abs(r) < 1e-9 ? 'r = 0: der Nullvektor. Kein Pfeil mehr, keine Richtung.'
                                : 'r &lt; 0: Gegenrichtung.';
            }
            ctx.hud(rows.join('') + (note ? `<div class="v-hud-note">${note}</div>` : ''));
        },

        draw(st) {
            const O = [0, 0], { a, b, r, mode } = S2;
            const all = mode === 'alles';
            if (mode === 'add' || all) {
                // parallelogram plus the tip-to-tail construction
                st.polygon([O, a, V.add(a, b), b], COL.green, null, { alpha: 0.1 });
                st.arrow(a, V.add(a, b), COL.blue, null, { alpha: 0.5, dash: [6, 5], width: 2 });
                st.arrow(b, V.add(a, b), COL.orange, null, { alpha: 0.5, dash: [6, 5], width: 2 });
                st.arrow(O, V.add(a, b), COL.green, 'a+b', { width: 3.2, overArrow: false });
            }
            if (mode === 'sub' || all) {
                st.arrow(b, a, COL.red, 'a−b', { width: 3, overArrow: false });
                st.arrow(O, V.sub(a, b), COL.red, null, { alpha: 0.55, dash: [6, 5], width: 2.2 });
                st.dot(V.sub(a, b), COL.red, 4, { alpha: 0.7 });
            }
            if (mode === 'skalar' || all) {
                st.line(O, V.isZero(a) ? [1, 0] : a, COL.purple, { alpha: 0.22, width: 1.4, dash: [4, 6] });
                st.arrow(O, V.scale(a, r), COL.purple, 'r·a', { width: 3.4, alpha: 0.95, overArrow: false });
            }
            st.arrow(O, a, COL.orange, 'a', { width: 3 });
            st.arrow(O, b, COL.blue, 'b', { width: 3 });
            st.dot(O, 'rgba(255,255,255,0.8)', 4);
        },
    });

    // ==================================================================
    // 3 — Betrag und Einheitsvektor
    // ==================================================================
    const S3 = {
        view: 'vektor',
        a: [4, 3], L: 1, showUnit: true, showScaled: false, circle: true,
        A: [-3, -2], B: [4, -2], C: [0.5, 4],     // triangle-type view
    };

    /** Classify a triangle from its three squared side lengths. */
    function triangleKind(A, B, C) {
        const q = [V.len2(V.sub(B, A)), V.len2(V.sub(C, A)), V.len2(V.sub(C, B))];
        const eq = (x, y) => Math.abs(x - y) < 1e-7 * Math.max(1, x);
        const same = (eq(q[0], q[1]) ? 1 : 0) + (eq(q[0], q[2]) ? 1 : 0) + (eq(q[1], q[2]) ? 1 : 0);
        const sorted = q.slice().sort((x, y) => x - y);
        const right = eq(sorted[0] + sorted[1], sorted[2]);
        const kind = same === 3 ? 'gleichseitig' : same >= 1 ? 'gleichschenklig' : 'unregelmäßig';
        return { q, kind, right, degenerate: Math.abs(V.cross(V.sub(B, A), V.sub(C, A))) < 1e-9 };
    }

    VekLab.register({
        id: 'betrag',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Ansicht', '<div id="v3-view"></div>', COL.orange);
            CyberUI.createDropdown('v3-view', [
                { id: 'vektor', label: 'Betrag und Einheitsvektor' },
                { id: 'dreieck', label: 'Dreiecksart über Seitenlängen' },
            ], id => { S3.view = id; this.showCards(); this.wireHandles(ctx); ctx.redraw(); this.hud(ctx); }, S3.view);
            CyberUI.createCard(c, 'Anzeigen', '<div id="v3-opt"></div>', COL.orange);
            CyberUI.createCheckbox('v3-opt', 'Einheitsvektor', S3.showUnit, v => { S3.showUnit = v; ctx.redraw(); }, COL.green);
            CyberUI.createCheckbox('v3-opt', 'Einheitskreis', S3.circle, v => { S3.circle = v; ctx.redraw(); }, COL.grey);
            CyberUI.createCheckbox('v3-opt', 'auf Länge L strecken', S3.showScaled, v => { S3.showScaled = v; ctx.redraw(); this.hud(ctx); }, COL.purple);
            CyberUI.createCard(c, 'Ziellänge', '<div id="v3-par"></div>', COL.purple);
            VekLab.slider('v3-par', 'L', 0, 8, S3.L, 0.1, x => { S3.L = +x; ctx.redraw(); this.hud(ctx); }, COL.purple, x => num(+x, 1));
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh die Spitze von <b>a</b>. Das gestrichelte Dreieck zeigt, dass der Betrag nichts anderes ist als <b>Pythagoras</b>.</div>', COL.blue);
            this.showCards = () => {
                const cards = document.querySelectorAll('#sb-betrag .instrument-card');
                // 1 = Anzeigen, 2 = Ziellänge — both belong to the single-vector view
                [1, 2].forEach(i => { if (cards[i]) cards[i].style.display = S3.view === 'vektor' ? '' : 'none'; });
            };
            this.showCards();

            ctx.theory(R`
<p>Die <b>Länge</b> eines Vektors heißt <b>Betrag</b> und wird mit Betragsstrichen geschrieben. Sie ist nichts Neues — sie ist der Satz des Pythagoras im gestrichelten Dreieck auf der Bühne:</p>
<div class="v-key">$$|\vec{a}|=\sqrt{a_1^{\,2}+a_2^{\,2}}$$ und im Raum $$|\vec{a}|=\sqrt{a_1^{\,2}+a_2^{\,2}+a_3^{\,2}}$$</div>
<p>Der Betrag ist eine <b>Zahl</b>, kein Vektor — und er ist nie negativ. Nur der Nullvektor hat den Betrag $0$.</p>
<p>Ein <b>Einheitsvektor</b> hat die Länge $1$. Zu jedem $\vec{a}\neq\vec{0}$ bekommt man ihn durch Teilen durch die eigene Länge:</p>
<div class="v-key">$$\vec{a}^{\,0}=\frac{1}{|\vec{a}|}\cdot\vec{a}\qquad\text{mit}\qquad |\vec{a}^{\,0}|=1$$</div>
<p>Das nennt man <b>normieren</b>. Der Einheitsvektor merkt sich nur noch die <b>Richtung</b> und vergisst die Länge — deshalb landet seine Spitze immer auf dem Einheitskreis, egal wie weit du $\vec a$ hinausziehst.</p>
<div class="v-aha"><b>Wozu das gut ist:</b> willst du einen Vektor mit vorgegebener Länge $L$ in Richtung von $\vec a$, nimm $L\cdot\vec{a}^{\,0}$. Genau das macht der Regler <i>L</i>. In Kapitel 10 ist das der Trick für Abstände.</div>
<div class="v-warn">$|\vec{a}+\vec{b}|=|\vec{a}|+|\vec{b}|$ ist <b>falsch</b> (außer bei gleicher Richtung). Es gilt nur $|\vec{a}+\vec{b}|\le|\vec{a}|+|\vec{b}|$ — die Dreiecksungleichung. Probier es auf der Bühne von Kapitel 2 aus.</div>

<h3 style="color:rgb(121,158,49);font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:2px;margin:18px 0 8px">Dreiecksart über die Seitenlängen</h3>
<p>Immer derselbe Ablauf, und er ist reines Handwerk:</p>
<ul>
<li>alle drei Seitenvektoren bilden: $\overrightarrow{AB}$, $\overrightarrow{AC}$, $\overrightarrow{BC}$</li>
<li>von jedem den Betrag berechnen</li>
<li>vergleichen — und einen <b>Antwortsatz</b> schreiben</li>
</ul>
<div class="v-key">
<b>gleichseitig</b> — alle drei Längen gleich<br>
<b>gleichschenklig</b> — genau zwei Längen gleich<br>
<b>unregelmäßig</b> — alle drei verschieden
</div>
<div class="v-aha"><b>Der Trick, der Zeit spart:</b> du musst die Wurzeln gar nicht ausrechnen. $\sqrt{152}$, $\sqrt{77}$ und $\sqrt{17}$ sind offensichtlich verschieden — dafür braucht niemand einen Taschenrechner. Vergleiche einfach die <b>Radikanden</b>, die Zahlen unter der Wurzel. Sind die verschieden, sind die Längen verschieden. Das spart Zeit und vermeidet Rundungsfehler.</div>
<p>Ob das Dreieck zusätzlich <b>rechtwinklig</b> ist, verrät entweder Pythagoras an den Radikanden ($q_1+q_2=q_3$) oder das Skalarprodukt aus Kapitel 8. Die Bühne prüft beides mit.</p>
<div class="v-warn">Ein Antwortsatz gehört unter jede Teilaufgabe. „$\sqrt{152}\neq\sqrt{77}\neq\sqrt{17}$“ allein ist keine Antwort — „Das Dreieck ist unregelmäßig, da keine zwei Seiten gleich lang sind“ schon.</div>`);

            ctx.tasks([
                {
                    q: R`Berechne den Betrag von $\vec{a}=\begin{pmatrix}-3\\4\end{pmatrix}$ und von $\vec{b}=\begin{pmatrix}2\\-1\\2\end{pmatrix}$.`,
                    sol: R`<span class="v-step">Quadrieren, addieren, Wurzel</span>
$$|\vec{a}|=\sqrt{(-3)^2+4^2}=\sqrt{9+16}=\sqrt{25}=5$$
$$|\vec{b}|=\sqrt{2^2+(-1)^2+2^2}=\sqrt{4+1+4}=\sqrt{9}=3$$
<p class="v-res">$|\vec{a}|=5$, $|\vec{b}|=3$.</p>
<p>Das Minuszeichen verschwindet beim Quadrieren — der Betrag kann gar nicht negativ werden.</p>`
                },
                {
                    q: R`Normiere $\vec{v}=\begin{pmatrix}6\\-8\end{pmatrix}$ und gib den Vektor der Länge $5$ in Richtung von $\vec{v}$ an.`,
                    sol: R`<span class="v-step">Länge bestimmen</span>
$$|\vec{v}|=\sqrt{36+64}=\sqrt{100}=10$$
<span class="v-step">Normieren</span>
$$\vec{v}^{\,0}=\tfrac{1}{10}\begin{pmatrix}6\\-8\end{pmatrix}=\begin{pmatrix}0{,}6\\-0{,}8\end{pmatrix}$$
<span class="v-step">Auf Länge 5 strecken</span>
$$5\cdot\vec{v}^{\,0}=\begin{pmatrix}3\\-4\end{pmatrix}$$
<p class="v-res">$\vec{v}^{\,0}=\begin{pmatrix}0{,}6\\-0{,}8\end{pmatrix}$, gesucht war $\begin{pmatrix}3\\-4\end{pmatrix}$.</p>
<p>Probe: $\sqrt{9+16}=5$ ✓</p>`
                },
                {
                    q: R`Für welche $t$ hat $\vec{u}=\begin{pmatrix}t\\3\\ t\end{pmatrix}$ den Betrag $\sqrt{17}$?`,
                    hint: R`Setz den Betrag an und quadriere beide Seiten — die Wurzel muss weg.`,
                    sol: R`<span class="v-step">Ansatz</span>
$$\sqrt{t^2+9+t^2}=\sqrt{17}$$
<span class="v-step">Quadrieren</span>
$$2t^2+9=17\;\Longrightarrow\;2t^2=8\;\Longrightarrow\;t^2=4$$
<p class="v-res">$t=2$ oder $t=-2$ — beide Lösungen sind gültig.</p>
<div class="v-warn">Nach dem Quadrieren <b>immer</b> an die zweite Lösung denken. Der Betrag unterscheidet nicht zwischen $\vec u$ und $-\vec u$.</div>`
                },
                {
                    q: R`Bestimme die Dreiecksart von $A(-3/-6/-3)$, $B(7/0/1)$, $C(5/-3/-1)$.`,
                    hint: R`Drei Seitenvektoren, drei Beträge — und die Wurzeln stehen lassen.`,
                    sol: R`<span class="v-step">Seitenvektoren</span>
$$\overrightarrow{AB}=\begin{pmatrix}10\\6\\4\end{pmatrix},\qquad \overrightarrow{AC}=\begin{pmatrix}8\\3\\2\end{pmatrix},\qquad \overrightarrow{BC}=\begin{pmatrix}-2\\-3\\-2\end{pmatrix}$$
<span class="v-step">Beträge — Radikanden genügen</span>
$$|\overrightarrow{AB}|=\sqrt{100+36+16}=\sqrt{152}$$
$$|\overrightarrow{AC}|=\sqrt{64+9+4}=\sqrt{77}$$
$$|\overrightarrow{BC}|=\sqrt{4+9+4}=\sqrt{17}$$
<span class="v-step">Vergleichen</span>
<p>$152$, $77$ und $17$ sind paarweise verschieden — also sind auch die drei Seitenlängen verschieden.</p>
<p class="v-res">Das Dreieck ist <b>unregelmäßig</b>, insbesondere nicht gleichschenklig.</p>
<div class="v-aha">Hier den Taschenrechner zu zücken wäre reine Zeitverschwendung. Der Vergleich der Radikanden reicht als Begründung völlig aus.</div>`
                },
                {
                    q: R`Zeige, dass $A(1/0/0)$, $B(5/0/0)$, $C(3/4/0)$ ein gleichschenkliges Dreieck bilden. Ist es auch rechtwinklig?`,
                    sol: R`<span class="v-step">Seitenlängen</span>
$$|\overrightarrow{AB}|=\sqrt{16}=4,\qquad |\overrightarrow{AC}|=\sqrt{4+16}=\sqrt{20},\qquad |\overrightarrow{BC}|=\sqrt{4+16}=\sqrt{20}$$
<span class="v-step">Vergleichen</span>
<p>Genau zwei Seiten sind gleich lang: $|\overrightarrow{AC}|=|\overrightarrow{BC}|=\sqrt{20}$.</p>
<p class="v-res">Das Dreieck ist <b>gleichschenklig</b> mit der Basis $\overline{AB}$.</p>
<span class="v-step">Rechtwinklig?</span>
<p>Pythagoras an den Radikanden: $20+20=40\neq 16$, und $16+20=36\neq 20$. Keine Kombination passt.</p>
<p class="v-res">Also gleichschenklig, aber <b>nicht</b> rechtwinklig.</p>`
                },
                {
                    q: R`Der Punkt $A(2/6)$ hat vom Ursprung welchen Abstand? Und wie weit ist er von $B(-2/3)$ entfernt?`,
                    sol: R`<span class="v-step">Abstand vom Ursprung = Betrag des Ortsvektors</span>
$$|\vec{a}|=\sqrt{4+36}=\sqrt{40}=2\sqrt{10}\approx 6{,}32$$
<span class="v-step">Abstand zweier Punkte = Betrag des Verbindungsvektors</span>
$$\overrightarrow{AB}=\begin{pmatrix}-4\\-3\end{pmatrix},\qquad |\overrightarrow{AB}|=\sqrt{16+9}=5$$
<p class="v-res">$|OA|=2\sqrt{10}\approx 6{,}32$ und $|AB|=5$.</p>
<p>Das ist die Abstandsformel — sie ist einfach der Betrag von „Spitze minus Fuß“.</p>`
                },
            ]);
        },

        onShow(ctx) {
            ctx.stage2.fit([[-5, -4], [6, 5]]);
            this.wireHandles(ctx);
            if (this.showCards) this.showCards();
            this.hud(ctx);
        },
        wireHandles(ctx) {
            const st = ctx.stage2;
            st.clearHandles();
            if (S3.view === 'dreieck') {
                st.addHandle(() => S3.A, p => S3.A = p, COL.orange, 'A');
                st.addHandle(() => S3.B, p => S3.B = p, COL.orange, 'B');
                st.addHandle(() => S3.C, p => S3.C = p, COL.orange, 'C');
                ctx.tip('Ziehen: A, B, C — die Art wird gerechnet');
            } else {
                st.addHandle(() => S3.a, p => S3.a = p, COL.orange, 'a', true);
                ctx.tip('Ziehen: die Spitze von a');
            }
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            if (S3.view === 'dreieck') {
                const { A, B, C } = S3;
                const t = triangleKind(A, B, C);
                const names = ['AB', 'AC', 'BC'];
                let h = names.map((n, i) =>
                    `<div class="v-hud-row"><span class="v-hud-lab">|${n}|</span><span class="v-hud-val">&radic;${num(t.q[i], 2)} = ${num(Math.sqrt(t.q[i]), 3)}</span></div>`).join('');
                const kindCol = t.kind === 'unregelmäßig' ? COL.orange : COL.green;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Dreiecksart</span><span class="v-hud-val" style="color:${t.degenerate ? COL.red : kindCol}">${t.degenerate ? 'kein Dreieck' : t.kind}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">rechtwinklig?</span><span class="v-hud-val">${t.right ? 'ja' : 'nein'}</span></div>`;
                h += `<div class="v-hud-note">${t.degenerate
                    ? 'Die drei Punkte liegen auf einer Geraden — das ist kein Dreieck.'
                    : 'Verglichen werden die <b>Radikanden</b> ' + t.q.map(x => num(x, 2)).join(', ') + ' — die Wurzeln braucht man dafür gar nicht.'}</div>`;
                ctx.hud(h);
                return;
            }
            const a = S3.a, l = V.len(a);
            const u = V.unit(a);
            let h = R`<div style="margin:2px 0">$\vec{a}=` + col(a) + '$</div>' +
                R`<div style="margin:6px 0">$|\vec{a}|=\sqrt{` + T.num(a[0], 2) + '^2+' + T.num(a[1], 2) + R`^2}=` + T.num(l, 3) + '$</div>';
            if (S3.showUnit) h += R`<div style="margin:6px 0;color:` + COL.green + R`">$\vec{a}^{\,0}=` + col(u) + '$</div>';
            if (S3.showScaled) h += R`<div style="margin:6px 0;color:` + COL.purple + '">$' + T.num(S3.L, 1) + R`\cdot\vec{a}^{\,0}=` + col(V.scale(u, S3.L)) + '$</div>';
            h += `<div class="v-hud-note">${V.isZero(a) ? 'Der Nullvektor lässt sich nicht normieren — er hat keine Richtung.' : 'Zieh a weiter hinaus: der grüne Pfeil bleibt auf dem Kreis.'}</div>`;
            ctx.hud(h);
        },

        draw(st) {
            const O = [0, 0], a = S3.a;
            if (S3.view === 'dreieck') {
                const { A, B, C } = S3;
                const t = triangleKind(A, B, C);
                st.polygon([A, B, C], t.degenerate ? COL.red : COL.green, COL.green, { alpha: 0.12, width: 2 });
                // sides sharing a length get the same colour, so equal legs are visible
                const q = t.q, seg = [[A, B, 0], [A, C, 1], [B, C, 2]];
                const eq = (x, y) => Math.abs(x - y) < 1e-7 * Math.max(1, x);
                const groupCol = i => {
                    const partners = [0, 1, 2].filter(j => j !== i && eq(q[j], q[i]));
                    return partners.length ? COL.orange : COL.blue;
                };
                seg.forEach(([p, r, i]) => {
                    st.segment(p, r, groupCol(i), { width: 3.4 });
                    st.text('\u221A' + num(q[i], 2), V.lerp(p, r, 0.5), groupCol(i), { dy: -14, font: '700 12px Arial' });
                });
                if (t.right) {
                    // mark the right angle at the vertex opposite the longest side
                    const idx = q.indexOf(Math.max(...q));
                    const vtx = idx === 0 ? C : idx === 1 ? B : A;
                    const others = [A, B, C].filter(x => x !== vtx);
                    st.rightAngle(vtx, V.sub(others[0], vtx), V.sub(others[1], vtx), COL.red);
                }
                st.dot(O, 'rgba(255,255,255,0.8)', 4);
                return;
            }
            if (S3.circle) {
                const pts = [];
                for (let i = 0; i <= 96; i++) pts.push([Math.cos(i / 96 * 2 * Math.PI), Math.sin(i / 96 * 2 * Math.PI)]);
                st.polygon(pts, null, COL.grey, { width: 1.2, dash: [4, 5] });
            }
            // the Pythagoras triangle behind the vector
            st.polygon([O, [a[0], 0], a], COL.blue, null, { alpha: 0.09 });
            st.segment(O, [a[0], 0], COL.blue, { dash: [5, 4], width: 1.6 });
            st.segment([a[0], 0], a, COL.blue, { dash: [5, 4], width: 1.6 });
            if (Math.abs(a[0]) > 0.2 && Math.abs(a[1]) > 0.2)
                st.rightAngle([a[0], 0], [-Math.sign(a[0]), 0], [0, Math.sign(a[1])], COL.blue);
            st.text('|' + num(Math.abs(a[0]), 2) + '|', [a[0] / 2, 0], COL.blue, { dy: a[1] >= 0 ? 15 : -15, font: '600 12px Arial' });
            st.text('|' + num(Math.abs(a[1]), 2) + '|', [a[0], a[1] / 2], COL.blue, { dx: a[0] >= 0 ? 18 : -18, font: '600 12px Arial' });

            if (S3.showScaled && !V.isZero(a)) st.arrow(O, V.scale(V.unit(a), S3.L), COL.purple, null, { width: 4, alpha: 0.85 });
            st.arrow(O, a, COL.orange, 'a', { width: 3 });
            if (S3.showUnit && !V.isZero(a)) st.arrow(O, V.unit(a), COL.green, null, { width: 3.4 });
            st.dot(O, 'rgba(255,255,255,0.8)', 4);
            st.text(num(V.len(a), 2), V.scale(a, 0.62), COL.orange, { dx: 0, dy: -16, font: '700 13px Arial' });
        },
    });

    // ==================================================================
    // 4 — Linearkombination, lineare Abhängigkeit
    // ==================================================================
    const S4 = { a: [3, 1], b: [1, 2], r: 1, s: 1, T: [5, 4], target: true };

    VekLab.register({
        id: 'linkomb',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Koeffizienten', '<div id="v4-par"></div>', COL.orange);
            this.rS = VekLab.slider('v4-par', 'r  (vor a)', -4, 4, S4.r, 0.1, x => { S4.r = +x; ctx.redraw(); this.hud(ctx); }, COL.orange, x => num(+x, 1));
            this.sS = VekLab.slider('v4-par', 's  (vor b)', -4, 4, S4.s, 0.1, x => { S4.s = +x; ctx.redraw(); this.hud(ctx); }, COL.blue, x => num(+x, 1));
            VekLab.buttons('v4-par', [
                { label: 'Ziel treffen', run: () => { this.solve(ctx); } },
                { label: 'a ∥ b machen', run: () => { S4.b = V.scale(S4.a, 0.5); ctx.redraw(); this.hud(ctx); } },
            ]);
            CyberUI.createCard(c, 'Anzeigen', '<div id="v4-opt"></div>', COL.green);
            CyberUI.createCheckbox('v4-opt', 'Zielpunkt T', S4.target, v => { S4.target = v; ctx.redraw(); this.hud(ctx); }, COL.green);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh <b>a</b>, <b>b</b> und den Zielpunkt <b>T</b>. „Ziel treffen“ löst das Gleichungssystem und stellt die Regler ein.</div>', COL.blue);

            ctx.theory(R`
<p>Eine <b>Linearkombination</b> von $\vec{a}$ und $\vec{b}$ ist alles, was man aus Strecken und Addieren bauen kann:</p>
<div class="v-key">$$\vec{x}=r\cdot\vec{a}+s\cdot\vec{b}\qquad r,s\in\mathbb{R}$$</div>
<p>Auf der Bühne siehst du genau das: erst $r$ Schritte in Richtung $\vec{a}$, dann von dort $s$ Schritte in Richtung $\vec{b}$. Der grüne Punkt am Ende ist die Linearkombination.</p>
<p>Zwei Vektoren heißen <b>linear unabhängig</b>, wenn keiner ein Vielfaches des anderen ist. Dann — und nur dann — erreichst du mit $r$ und $s$ <b>jeden</b> Punkt der Ebene, und zwar auf genau <b>eine</b> Art. Probier es: setz einen Zielpunkt und drück „Ziel treffen“.</p>
<div class="v-key">$\vec a,\vec b$ linear abhängig $\iff$ es gibt ein $k$ mit $\vec{b}=k\cdot\vec{a}$ $\iff$ in der Ebene: $a_1b_2-a_2b_1=0$</div>
<p>Drück links „a ∥ b machen“: jetzt liegen beide Pfeile auf <b>einer</b> Geraden. Alle Linearkombinationen liegen dann auch nur noch auf dieser Geraden — die halbe Ebene ist unerreichbar geworden.</p>
<div class="v-aha"><b>Der formale Test:</b> löse $r\vec{a}+s\vec{b}=\vec{0}$. Geht das <b>nur</b> mit $r=s=0$, sind die Vektoren unabhängig. Gibt es eine Lösung, bei der nicht beide null sind, sind sie abhängig. Genau dieser Test läuft später auch mit drei Vektoren im Raum.</div>
<div class="v-warn">Im Raum sind <b>drei</b> Vektoren genau dann abhängig, wenn sie in einer gemeinsamen Ebene liegen (komplanar). Das prüfst du in Kapitel 9 elegant mit dem Spatprodukt.</div>`);

            ctx.tasks([
                {
                    q: R`Sind $\vec{a}=\begin{pmatrix}2\\-3\end{pmatrix}$ und $\vec{b}=\begin{pmatrix}-6\\9\end{pmatrix}$ linear abhängig?`,
                    sol: R`<span class="v-step">Vielfaches suchen</span>
$$-3\cdot\begin{pmatrix}2\\-3\end{pmatrix}=\begin{pmatrix}-6\\9\end{pmatrix}=\vec{b}$$
<span class="v-step">Alternativ die Determinante</span>
$$a_1b_2-a_2b_1=2\cdot 9-(-3)\cdot(-6)=18-18=0$$
<p class="v-res">Ja, linear abhängig — $\vec b=-3\vec a$. Beide liegen auf derselben Geraden durch den Ursprung.</p>`
                },
                {
                    q: R`Stelle $\vec{c}=\begin{pmatrix}7\\4\end{pmatrix}$ als Linearkombination von $\vec{a}=\begin{pmatrix}3\\1\end{pmatrix}$ und $\vec{b}=\begin{pmatrix}1\\2\end{pmatrix}$ dar.`,
                    hint: R`Ansatz $r\vec a+s\vec b=\vec c$ zeilenweise aufschreiben — das ist ein LGS mit zwei Gleichungen.`,
                    sol: R`<span class="v-step">Ansatz</span>
$$r\begin{pmatrix}3\\1\end{pmatrix}+s\begin{pmatrix}1\\2\end{pmatrix}=\begin{pmatrix}7\\4\end{pmatrix}$$
<span class="v-step">Zeilenweise</span>
$$\text{I: } 3r+s=7\qquad \text{II: } r+2s=4$$
<span class="v-step">Lösen (I nach $s$, einsetzen)</span>
$$s=7-3r\;\Rightarrow\; r+2(7-3r)=4\;\Rightarrow\; -5r=-10\;\Rightarrow\; r=2,\; s=1$$
<p class="v-res">$\vec{c}=2\vec{a}+1\vec{b}$</p>
<p>Stell auf der Bühne $\vec a$, $\vec b$ und $T(7/4)$ ein und drück „Ziel treffen“ — es müssen dieselben Zahlen herauskommen.</p>`
                },
                {
                    q: R`Für welches $t$ sind $\vec{u}=\begin{pmatrix}t\\4\end{pmatrix}$ und $\vec{v}=\begin{pmatrix}3\\6\end{pmatrix}$ linear abhängig?`,
                    sol: R`<span class="v-step">Determinante null setzen</span>
$$t\cdot 6-4\cdot 3=0\;\Longrightarrow\;6t=12\;\Longrightarrow\;t=2$$
<p class="v-res">$t=2$. Dann ist $\vec u=\begin{pmatrix}2\\4\end{pmatrix}=\tfrac{2}{3}\vec v$.</p>`
                },
                {
                    q: R`Begründe: Der Nullvektor macht jede Menge von Vektoren linear abhängig.`,
                    sol: R`<span class="v-step">Gegenbeispiel zur Unabhängigkeit bauen</span>
<p>Sei $\vec{a}=\vec{0}$. Dann gilt</p>
$$1\cdot\vec{0}+0\cdot\vec{b}=\vec{0}$$
<p>Es gibt also eine Lösung von $r\vec a+s\vec b=\vec 0$ mit $r=1\neq 0$.</p>
<p class="v-res">Damit ist die Bedingung „nur die triviale Lösung“ verletzt — die Vektoren sind abhängig.</p>
<p>Anschaulich: der Nullvektor zeigt in keine Richtung und trägt nichts bei. Er kann keine neue Dimension aufspannen.</p>`
                },
            ]);
        },

        /** Solve r·a + s·b = T and move the sliders there. */
        solve(ctx) {
            const { a, b, T: t } = S4;
            const det = a[0] * b[1] - a[1] * b[0];
            if (Math.abs(det) < 1e-9) { this.hud(ctx); return; }
            const r = (t[0] * b[1] - t[1] * b[0]) / det;
            const s = (a[0] * t[1] - a[1] * t[0]) / det;
            S4.r = Math.max(-4, Math.min(4, r));
            S4.s = Math.max(-4, Math.min(4, s));
            this.rS.set(num(S4.r, 2).replace(',', '.'));
            this.sS.set(num(S4.s, 2).replace(',', '.'));
            this.rS.disp.innerText = num(S4.r, 2);
            this.sS.disp.innerText = num(S4.s, 2);
            ctx.redraw(); this.hud(ctx);
        },

        onShow(ctx) {
            const st = ctx.stage2;
            st.fit([[-5, -4], [7, 6]]);
            st.addHandle(() => S4.a, p => S4.a = p, COL.orange, 'a', true);
            st.addHandle(() => S4.b, p => S4.b = p, COL.blue, 'b', true);
            st.addHandle(() => S4.T, p => S4.T = p, COL.green, 'T');
            ctx.tip('Ziehen: a, b und der Zielpunkt T');
            this.hud(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const { a, b, r, s, T: t } = S4;
            const det = a[0] * b[1] - a[1] * b[0];
            const dep = Math.abs(det) < 1e-9;
            const x = V.add(V.scale(a, r), V.scale(b, s));
            let h = R`<div style="margin:2px 0">$` + T.num(r, 2) + R`\cdot` + col(a) + '+' + T.num(s, 2) + R`\cdot` + col(b) + '=' + col(x) + '$</div>';
            h += `<div class="v-hud-row"><span class="v-hud-lab">Determinante</span><span class="v-hud-val" style="color:${dep ? COL.red : COL.green}">${num(det, 3)}</span></div>`;
            h += `<div class="v-hud-row"><span class="v-hud-lab">a und b sind</span><span class="v-hud-val" style="color:${dep ? COL.red : COL.green}">${dep ? 'linear abhängig' : 'linear unabhängig'}</span></div>`;
            if (S4.target) {
                const hit = V.dist(x, t) < 0.06;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Ziel T</span><span class="v-hud-val">T(${num(t[0])}/${num(t[1])})</span></div>`;
                h += `<div class="v-hud-note">${dep
                    ? 'Beide Pfeile liegen auf einer Geraden — erreichbar ist nur noch diese Gerade, sonst nichts.'
                    : hit ? 'Getroffen. Und zwar mit genau <b>einem</b> Paar (r|s) — deshalb heißt (a, b) eine Basis der Ebene.'
                        : 'Jeder Punkt der Ebene ist erreichbar. Drück „Ziel treffen“.'}</div>`;
            }
            ctx.hud(h);
        },

        draw(st) {
            const O = [0, 0], { a, b, r, s } = S4;
            const det = a[0] * b[1] - a[1] * b[0];
            const dep = Math.abs(det) < 1e-9;
            const ra = V.scale(a, r), x = V.add(ra, V.scale(b, s));
            // when dependent, the reachable set collapses to one line
            if (dep && !V.isZero(a)) st.line(O, a, COL.red, { alpha: 0.35, width: 2, dash: [7, 6] });
            st.arrow(O, ra, COL.orange, null, { width: 3.4, alpha: 0.55, dash: [7, 5] });
            st.arrow(ra, x, COL.blue, null, { width: 3.4, alpha: 0.55, dash: [7, 5] });
            st.arrow(O, a, COL.orange, 'a', { width: 3 });
            st.arrow(O, b, COL.blue, 'b', { width: 3 });
            if (S4.target) {
                st.dot(S4.T, COL.green, 7, { hollow: true });
                if (V.dist(x, S4.T) < 0.06) st.polygon(
                    [[S4.T[0] - 0.3, S4.T[1]], [S4.T[0], S4.T[1] + 0.3], [S4.T[0] + 0.3, S4.T[1]], [S4.T[0], S4.T[1] - 0.3]],
                    COL.green, COL.green, { alpha: 0.4 });
            }
            st.dot(x, COL.green, 6);
            st.text('r·a + s·b', x, COL.green, { dy: 18, font: "700 12px 'Orbitron', sans-serif" });
            st.dot(O, 'rgba(255,255,255,0.8)', 4);
        },
    });
})();
