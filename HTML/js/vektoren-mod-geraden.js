/* vektoren-mod-geraden.js — chapters 5 to 7: lines, planes and their mutual
 * positions, all in the 3D stage. The classification is never hard-coded into a
 * scenario; it is recomputed from the current numbers, so a student who drags a
 * slider past the special case sees the verdict flip by itself.
 */
(function () {
    'use strict';
    const { COL, V, G, num, Tex } = window.VekLab;
    const R = String.raw;
    const T = Tex;
    const col = v => T.col(v, 2);
    /** Parameter form as KaTeX. */
    const gTex = (name, P, u, par) => R`${name}:\;\vec{x}=` + col(P) + `+${par}\\cdot` + col(u);

    /** Three sliders for one 3D vector. */
    function vecSliders(cid, label, get, set, cb, color, min, max, step) {
        const names = ['₁', '₂', '₃'];
        const handles = [];
        for (let i = 0; i < 3; i++) {
            handles.push(VekLab.slider(cid, label + names[i], min == null ? -5 : min, max == null ? 5 : max,
                get()[i], step == null ? 0.5 : step,
                x => { const v = get().slice(); v[i] = +x; set(v); cb(); },
                color, x => num(+x, 1)));
        }
        return { set: v => handles.forEach((h, i) => h.set(v[i])) };
    }

    /** The point of n·x = d closest to the origin — the patch is centred there so
     *  the plane stays in frame however the sliders move it. */
    const planeCentre = (n, d) => V.scale(V.to3(n), d / V.len2(V.to3(n)));

    const KIND_COL = { identisch: COL.purple, parallel: COL.blue, schneidend: COL.green, windschief: COL.red, enthalten: COL.purple };
    const KIND_TEXT = {
        identisch: 'identisch — dieselbe Gerade, nur anders aufgeschrieben',
        parallel: 'echt parallel — gleiche Richtung, kein gemeinsamer Punkt',
        schneidend: 'schneidend — genau ein gemeinsamer Punkt',
        windschief: 'windschief — nicht parallel und trotzdem kein Schnittpunkt. Gibt es nur im Raum.',
        enthalten: 'die Gerade liegt ganz in der Ebene',
    };

    // ==================================================================
    // 5 — Geraden in Parameterform
    // ==================================================================
    const S5 = {
        P: [1, 1, 0], u: [2, 1, 1], t: 1,
        scen: 'schneidend', probe: true, TP: [5, 3, 2],
    };
    const SCEN5 = {
        aus: null,
        schneidend: { Q: [2, 4, 0], v: [1, -2, 1] },   // meets g at P + 1·u = (3/2/1)
        parallel: { Q: [1, 3, 0], v: [-4, -2, -2] },
        identisch: { Q: [5, 3, 2], v: [1, 0.5, 0.5] },
        windschief: { Q: [1, 4, 3], v: [1, -2, 1] },
    };

    VekLab.register({
        id: 'geraden',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Gerade g', '<div id="v5-g"></div>', COL.orange);
            this.pS = vecSliders('v5-g', 'Stützpunkt P', () => S5.P, v => S5.P = v, () => { ctx.redraw(); this.hud(ctx); }, COL.orange);
            this.uS = vecSliders('v5-g', 'Richtung u', () => S5.u, v => S5.u = v, () => { ctx.redraw(); this.hud(ctx); }, COL.orange);

            CyberUI.createCard(c, 'Laufparameter r', '<div id="v5-t"></div>', COL.green);
            this.tS = VekLab.slider('v5-t', 'r', -4, 4, S5.t, 0.1, x => { S5.t = +x; ctx.redraw(); this.hud(ctx); }, COL.green, x => num(+x, 1));
            VekLab.buttons('v5-t', [
                { label: 'r = 0', run: () => { S5.t = 0; this.tS.set(0); ctx.redraw(); this.hud(ctx); } },
                { label: 'r = 1', run: () => { S5.t = 1; this.tS.set(1); ctx.redraw(); this.hud(ctx); } },
            ]);

            CyberUI.createCard(c, 'Zweite Gerade h', '<div id="v5-sc"></div>', COL.blue);
            CyberUI.createDropdown('v5-sc', [
                { id: 'aus', label: 'keine zweite Gerade' },
                { id: 'schneidend', label: 'schneidend' },
                { id: 'parallel', label: 'echt parallel' },
                { id: 'identisch', label: 'identisch' },
                { id: 'windschief', label: 'windschief' },
            ], id => { S5.scen = id; ctx.redraw(); this.hud(ctx); }, S5.scen);
            CyberUI.createCheckbox('v5-sc', 'Punktprobe mit T', S5.probe, v => { S5.probe = v; ctx.redraw(); this.hud(ctx); }, COL.purple);
            VekLab.buttons('v5-sc', [
                { label: 'T auf g', run: () => { S5.TP = [5, 3, 2]; ctx.redraw(); this.hud(ctx); } },
                { label: 'T daneben', run: () => { S5.TP = [5, 3, 3]; ctx.redraw(); this.hud(ctx); } },
            ]);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Ziehen dreht die Szene, Mausrad zoomt. Die Beurteilung oben links wird <b>gerechnet</b>, nicht angesagt — dreh an <b>u</b>, bis „parallel“ kippt.</div>', COL.blue);

            ctx.theory(R`
<p>Eine Gerade im Raum wird nicht durch eine Gleichung beschrieben, sondern durch einen <b>Startpunkt</b> und eine <b>Richtung</b>. Man läuft vom Stützpunkt aus $r$‑mal in Richtung des Richtungsvektors:</p>
<div class="v-key">$$g:\;\vec{x}=\vec{p}+r\cdot\vec{u},\qquad r\in\mathbb{R}$$ $\vec p$ Stützvektor (irgendein Punkt der Geraden), $\vec u\neq\vec 0$ Richtungsvektor.</div>
<p>Zieh am Regler $r$: der grüne Punkt läuft. Bei $r=0$ sitzt er auf $P$, bei $r=1$ genau eine Richtungslänge weiter.</p>
<div class="v-warn"><b>Die Darstellung ist nicht eindeutig.</b> Jeder Punkt der Geraden taugt als Stützpunkt, und jedes Vielfache $k\vec u$ ($k\neq 0$) als Richtung. Zwei völlig verschieden aussehende Gleichungen können dieselbe Gerade sein — schalte rechts auf „identisch“.</div>
<p><b>Gerade durch zwei Punkte</b> $A$ und $B$: nimm $A$ als Stütze und $\overrightarrow{AB}$ als Richtung.</p>
<div class="v-key">$$g:\;\vec{x}=\vec{a}+r\cdot(\vec{b}-\vec{a})$$</div>
<p><b>Punktprobe:</b> Liegt $T$ auf $g$? Setze $\vec{r}=\vec{p}+r\vec{u}$ an und löse <b>jede Zeile einzeln</b>. Nur wenn <b>alle drei</b> dasselbe $r$ liefern, liegt der Punkt auf der Geraden.</p>
<p><b>Zwei Geraden</b> im Raum haben vier mögliche Lagen. Die Entscheidung läuft immer gleich:</p>
<ul>
<li>$\vec u$ und $\vec v$ parallel? → <b>identisch</b> (wenn $Q$ auf $g$ liegt) oder <b>echt parallel</b></li>
<li>sonst LGS $\vec p+r\vec u=\vec q+s\vec v$ lösen → lösbar heißt <b>schneidend</b>, unlösbar heißt <b>windschief</b></li>
</ul>
<div class="v-aha"><b>Windschief</b> gibt es in der Ebene nicht. Zwei Geraden, die nicht parallel sind, müssen sich dort treffen — im Raum können sie aneinander vorbeilaufen. Dreh die Szene auf „windschief“ so, dass es <i>aussieht</i> wie ein Schnittpunkt: das Auge täuscht, die Rechnung nicht.</div>`);

            ctx.tasks([
                {
                    q: R`Stelle eine Gleichung der Geraden durch $A(1/2/3)$ und $B(4/0/5)$ auf und prüfe, ob $C(7/-2/7)$ auf ihr liegt.`,
                    hint: R`Richtungsvektor ist $\overrightarrow{AB}$. Bei der Punktprobe müssen alle drei Zeilen dasselbe $r$ liefern.`,
                    sol: R`<span class="v-step">Richtungsvektor</span>
$$\overrightarrow{AB}=\begin{pmatrix}4\\0\\5\end{pmatrix}-\begin{pmatrix}1\\2\\3\end{pmatrix}=\begin{pmatrix}3\\-2\\2\end{pmatrix}$$
<span class="v-step">Gleichung</span>
$$g:\;\vec{x}=\begin{pmatrix}1\\2\\3\end{pmatrix}+r\begin{pmatrix}3\\-2\\2\end{pmatrix}$$
<span class="v-step">Punktprobe für C</span>
$$\text{I: }1+3t=7\Rightarrow r=2\qquad\text{II: }2-2t=-2\Rightarrow r=2\qquad\text{III: }3+2t=7\Rightarrow r=2$$
<p class="v-res">Alle drei Zeilen liefern $r=2$ — also liegt $C$ auf $g$.</p>`
                },
                {
                    q: R`Untersuche die Lage von $g:\;\vec{x}=\begin{pmatrix}1\\0\\2\end{pmatrix}+r\begin{pmatrix}2\\1\\-1\end{pmatrix}$ und $h:\;\vec{x}=\begin{pmatrix}3\\1\\1\end{pmatrix}+s\begin{pmatrix}-4\\-2\\2\end{pmatrix}$.`,
                    sol: R`<span class="v-step">Richtungen vergleichen</span>
$$\begin{pmatrix}-4\\-2\\2\end{pmatrix}=-2\cdot\begin{pmatrix}2\\1\\-1\end{pmatrix}$$
<p>Die Richtungen sind parallel. Also nur noch: identisch oder echt parallel?</p>
<span class="v-step">Punktprobe: liegt der Stützpunkt von h auf g?</span>
$$\text{I: }1+2t=3\Rightarrow r=1\qquad\text{II: }0+r=1\Rightarrow r=1\qquad\text{III: }2-r=1\Rightarrow r=1$$
<p class="v-res">Alle Zeilen liefern $r=1$ — die Geraden sind <b>identisch</b>.</p>
<div class="v-warn">Hätte auch nur eine Zeile ein anderes $r$ ergeben, wären sie echt parallel gewesen. Die Punktprobe ist hier die ganze Entscheidung.</div>`
                },
                {
                    q: R`Zeige, dass $g:\;\vec{x}=\begin{pmatrix}0\\0\\0\end{pmatrix}+r\begin{pmatrix}1\\0\\0\end{pmatrix}$ und $h:\;\vec{x}=\begin{pmatrix}0\\0\\4\end{pmatrix}+s\begin{pmatrix}0\\1\\0\end{pmatrix}$ windschief sind.`,
                    sol: R`<span class="v-step">Richtungen</span>
<p>$\begin{pmatrix}1\\0\\0\end{pmatrix}$ und $\begin{pmatrix}0\\1\\0\end{pmatrix}$ sind kein Vielfaches voneinander — also nicht parallel.</p>
<span class="v-step">Gleichsetzen</span>
$$\begin{pmatrix}r\\0\\0\end{pmatrix}=\begin{pmatrix}0\\s\\4\end{pmatrix}$$
<span class="v-step">Zeile III entscheidet</span>
$$\text{III: }0=4$$
<p class="v-res">Widerspruch — kein gemeinsamer Punkt. Nicht parallel und kein Schnittpunkt: <b>windschief</b>.</p>
<p>Die Zeile III ist hier der ganze Beweis: die eine Gerade liegt in der Höhe $z=0$, die andere in $z=4$.</p>`
                },
                {
                    q: R`Bestimme den Schnittpunkt von $g:\;\vec{x}=\begin{pmatrix}1\\1\\0\end{pmatrix}+r\begin{pmatrix}2\\1\\1\end{pmatrix}$ und $h:\;\vec{x}=\begin{pmatrix}2\\0\\2\end{pmatrix}+s\begin{pmatrix}1\\-2\\1\end{pmatrix}$.`,
                    hint: R`Zwei Zeilen lösen das LGS, die dritte ist die Probe — überspring sie nie.`,
                    sol: R`<span class="v-step">Gleichsetzen</span>
$$\text{I: }1+2t=2+s\qquad\text{II: }1+r=-2s\qquad\text{III: }r=2+s$$
<span class="v-step">I und III lösen</span>
<p>Aus III: $s=r-2$. In I: $1+2t=2+r-2\Rightarrow r=-1$, also $s=-3$.</p>
<span class="v-step">Probe in II — Pflicht!</span>
$$1+(-1)=0\qquad -2\cdot(-3)=6$$
<p class="v-res">$0\neq 6$ — das System ist <b>unlösbar</b>. Die Geraden schneiden sich <b>nicht</b>, sie sind windschief.</p>
<div class="v-warn">Aufgepasst: die Aufgabe unterstellt einen Schnittpunkt, den es nicht gibt. Genau deshalb ist die dritte Zeile keine Formsache — sie ist die Entscheidung. Stell das Szenario „windschief“ ein und dreh die Szene: von einer Seite <i>sieht</i> es nach Schnittpunkt aus.</div>`
                },
            ]);
        },

        onShow(ctx) {
            ctx.stage3.onReady(() => { ctx.stage3.setRange(6); ctx.stage3.resetView(); });
            ctx.tip('Ziehen dreht · Mausrad zoomt');
            this.hud(ctx);
        },

        hud(ctx) {
            const { P, u, t } = S5;
            const X = V.add(P, V.scale(u, t));
            let h = R`<div style="margin:2px 0">$` + gTex('g', P, u, 'r') + '$</div>';
            h += R`<div style="margin:6px 0;color:` + COL.green + '">$\\vec{x}(' + T.num(t, 1) + ')=' + col(X) + '$</div>';
            if (V.isZero(u)) h += `<div class="v-hud-note" style="color:${COL.red}">Der Richtungsvektor darf nicht der Nullvektor sein — dann ist es keine Gerade, sondern ein Punkt.</div>`;
            if (S5.probe) {
                const f = G.footOnLine(S5.TP, P, u);
                const on = V.dist(f.point, S5.TP) < 1e-6;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Punktprobe T(${S5.TP.map(x => num(x)).join('/')})</span>` +
                    `<span class="v-hud-val" style="color:${on ? COL.green : COL.red}">${on ? 'liegt auf g' : 'liegt nicht auf g'}</span></div>`;
            }
            const sc = SCEN5[S5.scen];
            if (sc) {
                const r = G.lineLine(P, u, sc.Q, sc.v);
                h += R`<div style="margin:8px 0 2px;color:` + COL.blue + '">$' + gTex('h', sc.Q, sc.v, 's') + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">g und h sind</span><span class="v-hud-val" style="color:${KIND_COL[r.kind]}">${r.kind}</span></div>`;
                if (r.kind === 'schneidend') h += R`<div style="margin:5px 0">$S=` + col(r.point) + '$</div>';
                if (r.dist > 1e-9) h += `<div class="v-hud-row"><span class="v-hud-lab">Abstand</span><span class="v-hud-val">${num(r.dist, 3)}</span></div>`;
                h += `<div class="v-hud-note">${KIND_TEXT[r.kind]}</div>`;
            }
            ctx.hud(h);
        },

        draw(st) {
            const { P, u, t } = S5;
            if (!V.isZero(u)) st.ray3(P, u, COL.orange, { alpha: 0.85 });
            st.point3(P, COL.orange, 'P', 0.13);
            st.arrow3(P, V.add(P, u), COL.orange, 'u');
            const X = V.add(P, V.scale(u, t));
            st.point3(X, COL.green, null, 0.16);
            if (S5.probe) st.point3(S5.TP, COL.purple, 'T', 0.14);
            const sc = SCEN5[S5.scen];
            if (sc) {
                st.ray3(sc.Q, sc.v, COL.blue, { alpha: 0.85 });
                st.point3(sc.Q, COL.blue, 'Q', 0.13);
                st.arrow3(sc.Q, V.add(sc.Q, sc.v), COL.blue, 'v');
                const r = G.lineLine(P, u, sc.Q, sc.v);
                if (r.kind === 'schneidend') st.point3(r.point, COL.green, 'S', 0.2);
                if (r.kind === 'windschief') st.line3(r.footG, r.footH, COL.red, { dash: true });
            }
        },
    });

    // ==================================================================
    // 6 — Ebenen: Parameter-, Normalen- und Koordinatenform
    // ==================================================================
    const S6 = { n: [2, 3, 1], d: 6, spann: true, normal: true, spur: true };

    VekLab.register({
        id: 'ebenen',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Beispiel', '<div id="v6-pre"></div>', COL.orange);
            CyberUI.createDropdown('v6-pre', [
                { id: 'a', label: '2x + 3y + z = 6' },
                { id: 'b', label: 'x + y + z = 3' },
                { id: 'c', label: 'z = 2   (waagerecht)' },
                { id: 'd', label: 'x − y = 0   (durch die z-Achse)' },
                { id: 'e', label: '3x − 2y + 6z = 0   (durch O)' },
            ], id => {
                const P = { a: [[2, 3, 1], 6], b: [[1, 1, 1], 3], c: [[0, 0, 1], 2], d: [[1, -1, 0], 0], e: [[3, -2, 6], 0] }[id];
                S6.n = P[0].slice(); S6.d = P[1];
                this.nS.set(S6.n); this.dS.set(S6.d);
                ctx.redraw(); this.hud(ctx);
            }, 'a');

            CyberUI.createCard(c, 'Koordinatenform', '<div id="v6-n"></div>', COL.blue);
            this.nS = vecSliders('v6-n', 'n', () => S6.n, v => S6.n = v, () => { ctx.redraw(); this.hud(ctx); }, COL.blue, -6, 6, 1);
            this.dS = VekLab.slider('v6-n', 'd', -8, 8, S6.d, 1, x => { S6.d = +x; ctx.redraw(); this.hud(ctx); }, COL.blue, x => num(+x, 0));

            CyberUI.createCard(c, 'Anzeigen', '<div id="v6-opt"></div>', COL.green);
            CyberUI.createCheckbox('v6-opt', 'Spannvektoren', S6.spann, v => { S6.spann = v; ctx.redraw(); }, COL.green);
            CyberUI.createCheckbox('v6-opt', 'Normalenvektor', S6.normal, v => { S6.normal = v; ctx.redraw(); }, COL.red);
            CyberUI.createCheckbox('v6-opt', 'Spurpunkte', S6.spur, v => { S6.spur = v; ctx.redraw(); this.hud(ctx); }, COL.orange);

            ctx.theory(R`
<p>Eine Ebene lässt sich auf drei Arten hinschreiben. Alle drei beschreiben dieselbe Menge von Punkten — links stellst du <b>eine</b> ein und siehst oben links sofort die anderen beiden.</p>
<div class="v-key"><b>Parameterform</b> $$E:\;\vec{x}=\vec{a}+r\cdot\vec{u}+s\cdot\vec{v}$$ Ein Punkt und <b>zwei</b> Richtungen, die nicht parallel sein dürfen. Bequem zum Punkte-Erzeugen, schlecht zum Prüfen.</div>
<div class="v-key"><b>Normalenform</b> $$E:\;\vec{n}\circ(\vec{x}-\vec{a})=0$$ $\vec n$ steht senkrecht auf der Ebene. Aussagekräftig: sie sagt sofort, wie die Ebene im Raum liegt.</div>
<div class="v-key"><b>Koordinatenform</b> $$E:\;n_1x+n_2y+n_3z=d$$ Nur eine Gleichung. Bequem zum Prüfen: Punkt einsetzen, fertig.</div>
<p><b>Von Parameter- zu Koordinatenform:</b> $\vec{n}=\vec{u}\times\vec{v}$ (Kreuzprodukt, Kapitel 9), dann $d=\vec{n}\circ\vec{a}$.</p>
<p><b>Von Koordinaten- zu Parameterform:</b> such dir drei Punkte, die die Gleichung erfüllen — am einfachsten die <b>Spurpunkte</b> auf den Achsen. Der erste wird der Stützpunkt, die Verbindungsvektoren zu den anderen beiden werden $\vec u$ und $\vec v$.</p>
<div class="v-aha"><b>Die Koordinatenform liest man ab:</b> $\vec{n}$ steht direkt vor $x$, $y$, $z$. Bei $2x+3y+z=6$ ist $\vec{n}=\begin{pmatrix}2\\3\\1\end{pmatrix}$. Und $d=0$ heißt: die Ebene geht durch den Ursprung. Stell links das letzte Beispiel ein.</div>
<div class="v-warn">Fehlt eine Variable, ist die Ebene <b>parallel zur zugehörigen Achse</b>. Bei $x-y=0$ fehlt $z$ — die Ebene enthält die ganze $z$‑Achse. Probier's aus.</div>`);

            ctx.tasks([
                {
                    q: R`Wandle $E:\;\vec{x}=\begin{pmatrix}1\\0\\2\end{pmatrix}+r\begin{pmatrix}1\\2\\0\end{pmatrix}+s\begin{pmatrix}0\\1\\1\end{pmatrix}$ in die Koordinatenform um.`,
                    hint: R`Normalenvektor über das Kreuzprodukt der beiden Spannvektoren, dann $d=\vec n\circ\vec a$.`,
                    sol: R`<span class="v-step">Normalenvektor</span>
$$\vec{n}=\begin{pmatrix}1\\2\\0\end{pmatrix}\times\begin{pmatrix}0\\1\\1\end{pmatrix}=\begin{pmatrix}2\cdot 1-0\cdot 1\\0\cdot 0-1\cdot 1\\1\cdot 1-2\cdot 0\end{pmatrix}=\begin{pmatrix}2\\-1\\1\end{pmatrix}$$
<span class="v-step">d bestimmen</span>
$$d=\vec{n}\circ\vec{a}=2\cdot 1+(-1)\cdot 0+1\cdot 2=4$$
<p class="v-res">$E:\;2x-y+z=4$</p>
<span class="v-step">Probe</span>
<p>Stützpunkt einsetzen: $2\cdot1-0+2=4$ ✓. Und ein Punkt mit $r=1$: $(2/2/2)$ gibt $4-2+2=4$ ✓.</p>`
                },
                {
                    q: R`Gib zu $E:\;x+2y-z=4$ eine Parameterform an.`,
                    sol: R`<span class="v-step">Spurpunkte suchen</span>
<p>$y=z=0$: $x=4$, also $S_1(4/0/0)$.<br>$x=z=0$: $2y=4$, also $S_2(0/2/0)$.<br>$x=y=0$: $-z=4$, also $S_3(0/0/-4)$.</p>
<span class="v-step">Zusammensetzen</span>
$$\vec{u}=\vec{S_2}-\vec{S_1}=\begin{pmatrix}-4\\2\\0\end{pmatrix},\qquad \vec{v}=\vec{S_3}-\vec{S_1}=\begin{pmatrix}-4\\0\\-4\end{pmatrix}$$
$$E:\;\vec{x}=\begin{pmatrix}4\\0\\0\end{pmatrix}+r\begin{pmatrix}-4\\2\\0\end{pmatrix}+s\begin{pmatrix}-4\\0\\-4\end{pmatrix}$$
<p class="v-res">Fertig — und man darf kürzen: $\vec u$ durch 2, $\vec v$ durch $-4$ teilen ergibt dieselbe Ebene.</p>
<div class="v-warn">Es gibt <b>unendlich viele</b> richtige Parameterformen. Deine kann anders aussehen und trotzdem stimmen — prüfe über den Normalenvektor und einen Punkt.</div>`
                },
                {
                    q: R`Liegt $P(3/-1/2)$ in $E:\;2x+y-3z=-1$?`,
                    sol: R`<span class="v-step">Einsetzen</span>
$$2\cdot 3+(-1)-3\cdot 2=6-1-6=-1$$
<p class="v-res">Die Gleichung ist erfüllt — $P$ liegt in $E$.</p>
<p>Das ist der große Vorteil der Koordinatenform: eine Zeile Rechnung statt eines Gleichungssystems.</p>`
                },
                {
                    q: R`Bestimme die Ebene durch $A(1/0/0)$, $B(0/2/0)$ und $C(0/0/4)$ in Koordinatenform.`,
                    hint: R`Die drei Punkte sind gerade die Spurpunkte — da gibt es einen sehr kurzen Weg.`,
                    sol: R`<span class="v-step">Kurzer Weg: Achsenabschnittsform</span>
$$\frac{x}{1}+\frac{y}{2}+\frac{z}{4}=1$$
<span class="v-step">Mit 4 durchmultiplizieren</span>
$$4x+2y+z=4$$
<p class="v-res">$E:\;4x+2y+z=4$</p>
<span class="v-step">Kontrolle über das Kreuzprodukt</span>
$$\overrightarrow{AB}=\begin{pmatrix}-1\\2\\0\end{pmatrix},\;\overrightarrow{AC}=\begin{pmatrix}-1\\0\\4\end{pmatrix},\qquad \overrightarrow{AB}\times\overrightarrow{AC}=\begin{pmatrix}8\\4\\2\end{pmatrix}$$
<p>$\begin{pmatrix}8\\4\\2\end{pmatrix}=2\begin{pmatrix}4\\2\\1\end{pmatrix}$ — derselbe Normalenvektor. ✓</p>`
                },
            ]);
        },

        onShow(ctx) {
            ctx.stage3.onReady(() => { ctx.stage3.setRange(6); ctx.stage3.resetView(); });
            ctx.tip('Ziehen dreht · Mausrad zoomt');
            this.hud(ctx);
        },

        hud(ctx) {
            const { n, d } = S6;
            if (V.isZero(n)) { ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Mit $\\vec n=\\vec 0$ ist das keine Ebene mehr — mindestens eine Komponente muss ungleich null sein.</div>`); return; }
            const p = G.nicePoints(n, d);
            let h = `<div class="v-hud-row"><span class="v-hud-lab">Koordinatenform</span><span class="v-hud-val">${G.coordText(n, d, 0)}</span></div>`;
            h += R`<div style="margin:6px 0;color:` + COL.red + R`">$\vec{n}=` + col(n) + '$</div>';
            if (p) h += R`<div style="margin:6px 0">$E:\;\vec{x}=` + col(p.A) + R`+r\cdot` + col(p.u) + R`+s\cdot` + col(p.v) + '$</div>';
            h += R`<div style="margin:6px 0">$\vec{n}\cdot\left(\vec{x}-` + col(p ? p.A : [0, 0, 0]) + R`\right)=0$</div>`;
            const cuts = [];
            ['x', 'y', 'z'].forEach((ax, i) => { if (Math.abs(n[i]) > 1e-9) cuts.push(`${ax} = ${num(d / n[i], 2)}`); });
            h += `<div class="v-hud-note">${cuts.length === 3
                ? 'Spurpunkte auf allen drei Achsen: ' + cuts.join(', ') + '.'
                : 'Die Ebene ist parallel zu ' + [0, 1, 2].filter(i => Math.abs(n[i]) < 1e-9).map(i => ['x', 'y', 'z'][i]).join('- und ') + '-Achse — deshalb fehlt die Variable in der Gleichung.'}
                ${Math.abs(d) < 1e-9 ? ' d = 0: die Ebene geht durch den Ursprung.' : ''}</div>`;
            ctx.hud(h);
        },

        draw(st) {
            const { n, d } = S6;
            if (V.isZero(n)) return;
            const p = G.nicePoints(n, d);
            if (!p) return;
            st.plane3(planeCentre(n, d), p.u, p.v, COL.blue, { size: 4, alpha: 0.15 });
            st.point3(p.A, COL.orange, 'A', 0.13);
            if (S6.spann) {
                st.arrow3(p.A, V.add(p.A, p.u), COL.green, 'u');
                st.arrow3(p.A, V.add(p.A, p.v), COL.green, 'v');
            }
            if (S6.normal) { const cN = planeCentre(n, d); st.arrow3(cN, V.add(cN, V.scale(V.unit(n), 2.2)), COL.red, 'n'); }
            if (S6.spur) [0, 1, 2].forEach(i => {
                if (Math.abs(n[i]) < 1e-9) return;
                const q = [0, 0, 0]; q[i] = d / n[i];
                st.point3(q, COL.orange, null, 0.15);
            });
        },
    });

    // ==================================================================
    // 7 — Lagebeziehungen Gerade/Ebene und Ebene/Ebene
    // ==================================================================
    const S7 = {
        mode: 'ge',
        P: [0, 0, 4], u: [1, 0, -1],          // the line
        n1: [0, 0, 1], d1: 0,                 // plane E1
        n2: [1, 0, 1], d2: 2,                 // plane E2
    };

    VekLab.register({
        id: 'lage',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Untersuchen', '<div id="v7-mode"></div>', COL.orange);
            CyberUI.createDropdown('v7-mode', [
                { id: 'ge', label: 'Gerade und Ebene' },
                { id: 'ee', label: 'Ebene und Ebene' },
            ], id => { S7.mode = id; ctx.redraw(); this.hud(ctx); this.showCards(); }, S7.mode);

            CyberUI.createCard(c, 'Gerade g', '<div id="v7-g"></div>', COL.green);
            vecSliders('v7-g', 'Stützpunkt P', () => S7.P, v => S7.P = v, () => { ctx.redraw(); this.hud(ctx); }, COL.green, -5, 5, 1);
            vecSliders('v7-g', 'Richtung u', () => S7.u, v => S7.u = v, () => { ctx.redraw(); this.hud(ctx); }, COL.green, -4, 4, 1);

            CyberUI.createCard(c, 'Ebene E₁', '<div id="v7-e1"></div>', COL.blue);
            vecSliders('v7-e1', 'n', () => S7.n1, v => S7.n1 = v, () => { ctx.redraw(); this.hud(ctx); }, COL.blue, -4, 4, 1);
            VekLab.slider('v7-e1', 'd', -6, 6, S7.d1, 1, x => { S7.d1 = +x; ctx.redraw(); this.hud(ctx); }, COL.blue, x => num(+x, 0));

            CyberUI.createCard(c, 'Ebene E₂', '<div id="v7-e2"></div>', COL.purple);
            vecSliders('v7-e2', 'n', () => S7.n2, v => S7.n2 = v, () => { ctx.redraw(); this.hud(ctx); }, COL.purple, -4, 4, 1);
            VekLab.slider('v7-e2', 'd', -6, 6, S7.d2, 1, x => { S7.d2 = +x; ctx.redraw(); this.hud(ctx); }, COL.purple, x => num(+x, 0));

            this.showCards = () => {
                const cards = document.querySelectorAll('#sb-lage .instrument-card');
                // cards: 0 mode, 1 line, 2 plane 1, 3 plane 2
                if (cards.length >= 4) {
                    cards[1].style.display = S7.mode === 'ge' ? '' : 'none';
                    cards[3].style.display = S7.mode === 'ee' ? '' : 'none';
                }
            };
            this.showCards();

            ctx.theory(R`
<p><b>Gerade und Ebene</b> haben drei mögliche Lagen. Die eine Rechnung entscheidet alles: setze die Gerade in die Koordinatenform ein.</p>
<div class="v-key">$$\vec{n}\circ(\vec{p}+r\vec{u})=d\quad\Longrightarrow\quad \underbrace{(\vec n\cdot\vec u)}_{\text{Faktor vor }r}\;r=d-\vec n\cdot\vec p$$</div>
<ul>
<li>$\vec{n}\circ\vec{u}\neq 0$ → genau ein $r$ → <b>Schnittpunkt</b></li>
<li>$\vec{n}\circ\vec{u}=0$ und $\vec n\cdot\vec p\neq d$ → $0=$ etwas $\neq0$ → <b>echt parallel</b></li>
<li>$\vec{n}\circ\vec{u}=0$ und $\vec n\cdot\vec p=d$ → $0=0$, jedes $r$ passt → <b>g liegt in E</b></li>
</ul>
<div class="v-aha"><b>Das Schöne daran:</b> die Fallunterscheidung fällt beim Lösen von selbst heraus. Du musst gar nicht vorher wissen, welcher Fall vorliegt — die Gleichung sagt es dir. Schieb links $\vec u$ so, dass $\vec n\cdot\vec u$ durch null geht.</div>
<p><b>Zwei Ebenen</b> im Raum können sich nur auf drei Arten begegnen — windschief geht hier nicht, dafür ist eine Ebene zu groß.</p>
<ul>
<li>$\vec{n}_1$ und $\vec{n}_2$ nicht parallel → <b>Schnittgerade</b></li>
<li>Normalen parallel, Gleichungen nicht proportional → <b>echt parallel</b></li>
<li>Gleichungen proportional → <b>identisch</b></li>
</ul>
<p>Die <b>Schnittgerade</b> bekommt man am schnellsten, indem man eine Variable als Parameter setzt und das Restsystem löst. Ihre Richtung ist immer $\vec{n}_1\times\vec{n}_2$ — sie liegt in beiden Ebenen, steht also senkrecht auf beiden Normalen.</p>
<div class="v-warn">Zwei Ebenen sind nie windschief und schneiden sich nie in genau einem Punkt. Erst <b>drei</b> Ebenen können einen einzelnen Schnittpunkt haben — das ist dann ein LGS mit drei Gleichungen.</div>`);

            ctx.tasks([
                {
                    q: R`Untersuche die Lage von $g:\;\vec{x}=\begin{pmatrix}1\\2\\0\end{pmatrix}+r\begin{pmatrix}2\\-1\\3\end{pmatrix}$ und $E:\;x+2y-z=5$.`,
                    sol: R`<span class="v-step">Gerade einsetzen</span>
$$(1+2t)+2(2-r)-(0+3t)=5$$
<span class="v-step">Zusammenfassen</span>
$$1+2t+4-2t-3t=5\;\Longrightarrow\;5-3t=5\;\Longrightarrow\;r=0$$
<span class="v-step">Schnittpunkt</span>
$$\vec{x}(0)=\begin{pmatrix}1\\2\\0\end{pmatrix}$$
<p class="v-res">$g$ schneidet $E$ im Punkt $S(1/2/0)$.</p>
<p>Kontrolle über $\vec n\cdot\vec u=1\cdot2+2\cdot(-1)-1\cdot3=-3\neq 0$ — es <b>musste</b> einen Schnittpunkt geben.</p>`
                },
                {
                    q: R`Zeige, dass $g:\;\vec{x}=\begin{pmatrix}0\\0\\1\end{pmatrix}+r\begin{pmatrix}1\\1\\1\end{pmatrix}$ echt parallel zu $E:\;x+y-2z=0$ liegt.`,
                    sol: R`<span class="v-step">Richtung gegen Normale</span>
$$\vec{n}\circ\vec{u}=1\cdot1+1\cdot1+(-2)\cdot1=0$$
<p>Die Gerade läuft parallel zur Ebene — jetzt nur noch: liegt sie drin?</p>
<span class="v-step">Stützpunkt prüfen</span>
$$0+0-2\cdot 1=-2\neq 0$$
<p class="v-res">Der Stützpunkt erfüllt die Gleichung nicht — also <b>echt parallel</b>.</p>
<p>Beim Einsetzen bekäme man $-2=0$, einen Widerspruch. Genau das ist der zweite Fall aus der Theorie.</p>`
                },
                {
                    q: R`Bestimme die Schnittgerade von $E_1:\;x+y+z=3$ und $E_2:\;x-y=1$.`,
                    hint: R`Setze $z=r$ und löse das Restsystem nach $x$ und $y$ auf.`,
                    sol: R`<span class="v-step">Parameter wählen</span>
<p>Setze $z=r$. Dann bleibt aus $E_1$: $x+y=3-r$, und aus $E_2$: $x-y=1$.</p>
<span class="v-step">Addieren und subtrahieren</span>
$$2x=4-r\;\Rightarrow\;x=2-\tfrac{r}{2},\qquad 2y=2-r\;\Rightarrow\;y=1-\tfrac{r}{2}$$
<span class="v-step">Als Gerade schreiben</span>
$$s:\;\vec{x}=\begin{pmatrix}2\\1\\0\end{pmatrix}+r\begin{pmatrix}-\tfrac12\\-\tfrac12\\1\end{pmatrix}
\;=\;\begin{pmatrix}2\\1\\0\end{pmatrix}+\lambda\begin{pmatrix}-1\\-1\\2\end{pmatrix}$$
<p class="v-res">Richtung $\begin{pmatrix}-1\\-1\\2\end{pmatrix}$ — und tatsächlich ist $\vec{n}_1\times\vec{n}_2=\begin{pmatrix}1\\1\\1\end{pmatrix}\times\begin{pmatrix}1\\-1\\0\end{pmatrix}=\begin{pmatrix}1\\1\\-2\end{pmatrix}$, das Gegenteil derselben Richtung. ✓</p>`
                },
                {
                    q: R`Für welches $a$ ist $g:\;\vec{x}=\begin{pmatrix}1\\1\\1\end{pmatrix}+r\begin{pmatrix}a\\2\\-1\end{pmatrix}$ parallel zu $E:\;2x-y+3z=7$ — und liegt sie dann in $E$?`,
                    sol: R`<span class="v-step">Parallel heißt: Richtung senkrecht zur Normalen</span>
$$\vec{n}\circ\vec{u}=2a-2-3=0\;\Longrightarrow\;a=\tfrac{5}{2}$$
<span class="v-step">Liegt sie in E?</span>
$$2\cdot1-1+3\cdot1=4\neq 7$$
<p class="v-res">Für $a=\tfrac52$ ist $g$ <b>echt parallel</b> zu $E$ — sie liegt nicht in der Ebene.</p>
<div class="v-warn">Für jedes andere $a$ schneidet $g$ die Ebene. Die Parallelität ist der Ausnahmefall, nicht die Regel.</div>`
                },
            ]);
        },

        onShow(ctx) {
            ctx.stage3.onReady(() => { ctx.stage3.setRange(6); ctx.stage3.resetView(); });
            ctx.tip('Ziehen dreht · Mausrad zoomt');
            if (this.showCards) this.showCards();
            this.hud(ctx);
        },

        hud(ctx) {
            if (S7.mode === 'ge') {
                const { P, u, n1, d1 } = S7;
                if (V.isZero(u) || V.isZero(n1)) { ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Richtungs- und Normalenvektor dürfen nicht null sein.</div>`); return; }
                const r = G.linePlane(P, u, n1, d1);
                const nu = V.dot(n1, u);
                let h = R`<div style="margin:2px 0">$` + gTex('g', P, u, 'r') + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">Ebene E₁</span><span class="v-hud-val">${G.coordText(n1, d1, 0)}</span></div>`;
                h += R`<div style="margin:6px 0">$\vec{n}\circ\vec{u}=` + T.num(nu, 2) + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">Lage</span><span class="v-hud-val" style="color:${KIND_COL[r.kind]}">${r.kind}</span></div>`;
                if (r.kind === 'schneidend') h += R`<div style="margin:5px 0">$S=` + col(r.point) + R`\;\;(r=` + T.num(r.t, 2) + ')$</div>';
                if (r.kind === 'parallel') h += `<div class="v-hud-row"><span class="v-hud-lab">Abstand</span><span class="v-hud-val">${num(r.dist, 3)}</span></div>`;
                h += `<div class="v-hud-note">${Math.abs(nu) < 1e-9 ? 'n·u = 0 — die Gerade läuft parallel zur Ebene. Ob sie drin liegt, entscheidet der Stützpunkt.' : 'n·u ≠ 0 — es gibt genau ein t, also genau einen Schnittpunkt.'}</div>`;
                ctx.hud(h);
            } else {
                const { n1, d1, n2, d2 } = S7;
                if (V.isZero(n1) || V.isZero(n2)) { ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Beide Normalenvektoren müssen ungleich null sein.</div>`); return; }
                const r = G.planePlane(n1, d1, n2, d2);
                let h = `<div class="v-hud-row"><span class="v-hud-lab">Ebene E₁</span><span class="v-hud-val">${G.coordText(n1, d1, 0)}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Ebene E₂</span><span class="v-hud-val">${G.coordText(n2, d2, 0)}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Lage</span><span class="v-hud-val" style="color:${KIND_COL[r.kind]}">${r.kind}</span></div>`;
                if (r.kind === 'schneidend') {
                    h += R`<div style="margin:6px 0;color:` + COL.green + '">$' + gTex('s', r.P, r.u, 'r') + '$</div>';
                    h += `<div class="v-hud-row"><span class="v-hud-lab">Schnittwinkel</span><span class="v-hud-val">${num(G.anglePlanes(n1, n2), 2)}°</span></div>`;
                    h += `<div class="v-hud-note">Die Richtung der Schnittgeraden ist $\\vec{n}_1\\times\\vec{n}_2$ — sie steht senkrecht auf beiden Normalen.</div>`;
                } else if (r.kind === 'parallel') {
                    h += `<div class="v-hud-row"><span class="v-hud-lab">Abstand</span><span class="v-hud-val">${num(r.dist, 3)}</span></div>`;
                    h += `<div class="v-hud-note">Gleiche Richtung der Normalen, aber verschiedene Gleichungen — kein gemeinsamer Punkt.</div>`;
                } else {
                    h += `<div class="v-hud-note">Die beiden Gleichungen sind Vielfache voneinander — es ist dieselbe Ebene.</div>`;
                }
                ctx.hud(h);
            }
        },

        draw(st) {
            const { mode, P, u, n1, d1, n2, d2 } = S7;
            const p1 = V.isZero(n1) ? null : G.nicePoints(n1, d1);
            if (p1) st.plane3(planeCentre(n1, d1), p1.u, p1.v, COL.blue, { size: 3.6, alpha: 0.15 });
            if (mode === 'ge') {
                if (!V.isZero(u)) st.ray3(P, u, COL.green, { alpha: 0.9 });
                st.point3(P, COL.green, 'P', 0.13);
                if (!V.isZero(n1)) {
                    const c1 = planeCentre(n1, d1); st.arrow3(c1, V.add(c1, V.scale(V.unit(n1), 2)), COL.red, 'n');
                    if (!V.isZero(u)) {
                        const r = G.linePlane(P, u, n1, d1);
                        if (r.kind === 'schneidend') st.point3(r.point, COL.orange, 'S', 0.2);
                    }
                }
            } else {
                const p2 = V.isZero(n2) ? null : G.nicePoints(n2, d2);
                if (p2) st.plane3(planeCentre(n2, d2), p2.u, p2.v, COL.purple, { size: 3.6, alpha: 0.15 });
                if (p1 && p2) {
                    const r = G.planePlane(n1, d1, n2, d2);
                    if (r.kind === 'schneidend') {
                        st.ray3(r.P, r.u, COL.green, { alpha: 1 });
                        st.point3(r.P, COL.green, null, 0.14);
                    }
                    const q1 = planeCentre(n1, d1), q2 = planeCentre(n2, d2);
                    st.arrow3(q1, V.add(q1, V.scale(V.unit(n1), 1.8)), COL.blue, 'n₁');
                    st.arrow3(q2, V.add(q2, V.scale(V.unit(n2), 1.8)), COL.purple, 'n₂');
                }
            }
        },
    });
})();
