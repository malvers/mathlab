/* trigonometrie-mod-kurven.js — chapters 4, 5, 6 and 9 of the Trigonometrie lab:
 * sine curve, cosine, equations sin x = y0 and the tangent function.
 * Every chapter here shows the unit circle on the left and the graph on the right,
 * both on the same scale: the arc on the circle is exactly the stretch on the x-axis.
 */
(function () {
    'use strict';
    const L = window.TrigLab;
    const { COL, num, Tex, C, PI, TAU, rad, deg, piTex, piText, radTex, valTex } = L;
    const R = String.raw;
    const FONT = "700 13px 'Orbitron', sans-serif";
    const SMALL = "600 11px 'Orbitron', sans-serif";
    const M = [-1.55, 0];      // centre of the unit circle, left of the graph

    const row = (lab, val) => `<div class="v-hud-row"><span class="v-hud-lab">${lab}</span><span class="v-hud-val">${val}</span></div>`;
    const line = (tex, color) => `<div style="margin:5px 0${color ? ';color:' + color : ''}">$${tex}$</div>`;

    /** Circle left, graph right: π-axis with degree sub-labels, grid only right of the y-axis. */
    function graphView(st, xmax, y0, y1) {
        st.xMode = 'pi'; st.degLabels = true; st.xClip = -0.02; st.names = ['x', 'y'];
        st.fitBox(M[0] - 1.35, xmax + 0.35, y0, y1);
    }
    /** A handle that slides along the graph of f. */
    function graphHandle(st, getX, setX, f, color, label, lo, hi) {
        st.addHandle(() => { const x = getX(); return [x, f(x)]; },
            w => setX(Math.max(lo, Math.min(hi, L.snapAngle(w[0])))), color, label);
    }
    /** x for the HUD: exact multiple of π if it is one, decimal, and degrees. */
    const xRow = x => row('Winkel', `x ${piTex(x) ? '= ' + piText(x) + ' ≈' : '≈'} ${num(x, 3)}  (${num(deg(x), 1)}°)`);

    /** Play button: runs x up to hi, then stops. */
    function player(mod, ctx, S, hi, speed, after) {
        return () => {
            S.play = !S.play;
            mod.playBtn.textContent = S.play ? 'Anhalten' : 'Abrollen';
            if (!S.play) return;
            if (S.x >= hi - 1e-6) S.x = 0;
            let t0 = performance.now();
            const step = now => {
                if (!S.play || !ctx.active) return;
                S.x = Math.min(hi, S.x + (now - t0) / 1000 * speed);
                t0 = now;
                after();
                if (S.x >= hi) { S.play = false; mod.playBtn.textContent = 'Abrollen'; return; }
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
    }
    function stopPlayer(mod, S) { if (S.play) { S.play = false; if (mod.playBtn) mod.playBtn.textContent = 'Abrollen'; } }

    // ==================================================================
    // 4 — Vom Einheitskreis zur Sinuskurve
    // ==================================================================
    const S4 = { x: rad(60), full: false, tape: true, props: false, two: false, play: false };
    const xmax4 = () => S4.two ? 2 * TAU : TAU;

    L.register({
        id: 'sinus',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Winkel x', '<div id="t4-x"></div>', C.ang);
            this.slider = L.slider('t4-x', 'x in Grad', 0, 720, Math.round(deg(S4.x)), 1,
                v => { S4.x = Math.min(xmax4(), rad(+v)); this.update(ctx); }, C.ang, v => v + '°');
            this.playBtn = L.buttons('t4-x', [{ label: 'Abrollen', run: () => this.play() }]).firstChild;
            this.play = player(this, ctx, S4, xmax4(), 1.1, () => { this.slider.set(Math.round(deg(S4.x))); this.update(ctx); });

            CyberUI.createCard(c, 'Anzeigen', '<div id="t4-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t4-opt', 'Bogen abrollen (grün)', S4.tape, v => { S4.tape = v; ctx.redraw(); }, C.ang);
            CyberUI.createCheckbox('t4-opt', 'Ganze Kurve zeigen', S4.full, v => { S4.full = v; ctx.redraw(); }, C.sin);
            CyberUI.createCheckbox('t4-opt', 'Nullstellen, Hoch- und Tiefpunkte', S4.props, v => { S4.props = v; ctx.redraw(); }, COL.purple);
            CyberUI.createCheckbox('t4-opt', 'Zweite Umdrehung (bis 4π)', S4.two, v => {
                S4.two = v; if (!v) S4.x = Math.min(S4.x, TAU);
                this.play = player(this, ctx, S4, xmax4(), 1.1, () => { this.slider.set(Math.round(deg(S4.x))); this.update(ctx); });
                this.onShow(ctx);
            }, C.ang);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh <b>P</b> am Kreis oder den Punkt auf der Kurve. <i>Abrollen</i> zeichnet die Kurve Stück für Stück.</div>', COL.blue);

            ctx.theory(R`
<p>Jetzt wird aus dem Einheitskreis eine Funktion. Der Winkel $x$ wird im <b>Bogenmaß</b> gemessen — also als Länge des grünen Bogens. Diese Länge legt man auf die x‑Achse, und darüber trägt man die Höhe von $P$ ab:</p>
<div class="v-key">$$f(x)=\sin x$$ Zu jedem $x$ gehört die <b>y‑Koordinate</b> des Kreispunkts $P$.</div>
<p>Zieh $P$ einmal ganz herum: Die orange Strecke wandert vom Kreis hinüber auf die Kurve. Der grüne Bogen am Kreis und die grüne Strecke auf der x‑Achse sind <b>gleich lang</b> — deshalb passt die Kurve genau zum Kreis.</p>
<p class="v-sub">Eigenschaften</p>
<div class="v-table-wrap"><table class="v-table">
<tr><th>Definitions&shy;bereich</th><td>$D=\mathbb{R}$</td></tr>
<tr><th>Werte&shy;bereich</th><td>$W=[-1;\,1]$</td></tr>
<tr><th>Periode</th><td>$2\pi$, also $\sin(x+2\pi)=\sin x$</td></tr>
<tr><th>Null&shy;stellen</th><td>$x=k\cdot\pi,\; k\in\mathbb{Z}$</td></tr>
<tr><th>Hoch&shy;punkte</th><td>$\left(\tfrac{\pi}{2}+k\cdot 2\pi\mid 1\right)$</td></tr>
<tr><th>Tief&shy;punkte</th><td>$\left(\tfrac{3\pi}{2}+k\cdot 2\pi\mid -1\right)$</td></tr>
<tr><th>Symmetrie</th><td>punktsymmetrisch zum Ursprung: $\sin(-x)=-\sin x$</td></tr>
</table></div>
<div class="v-aha"><b>Periodisch</b> heißt: Nach $2\pi$ wiederholt sich alles. Schalte <i>Zweite Umdrehung</i> ein — die zweite Welle ist eine exakte Kopie der ersten. Solche Vorgänge gibt es überall: Riesenrad, Pendel, Wechselstrom, Tageslänge, Ebbe und Flut.</div>
<div class="v-warn">Die Kurve steigt nur zwischen $-\tfrac{\pi}{2}$ und $\tfrac{\pi}{2}$ (und den Kopien davon). Zwischen $\tfrac{\pi}{2}$ und $\tfrac{3\pi}{2}$ fällt sie — dort wandert $P$ am Kreis nach unten.</div>`);

            ctx.tasks([
                {
                    q: R`Bestimme ohne Taschenrechner: $\sin\tfrac{\pi}{2}$, $\sin\pi$, $\sin\tfrac{3\pi}{2}$, $\sin 2\pi$.`,
                    hint: R`Rechne in Grad um und lies die y‑Koordinate am Kreis ab.`,
                    sol: R`<p>$\tfrac{\pi}{2}\mathrel{\hat=}90^\circ$: $P(0\mid 1)$ · $\pi\mathrel{\hat=}180^\circ$: $P(-1\mid 0)$ · $\tfrac{3\pi}{2}\mathrel{\hat=}270^\circ$: $P(0\mid -1)$ · $2\pi\mathrel{\hat=}360^\circ$: $P(1\mid 0)$</p>
<p class="v-res">$1,\;0,\;-1,\;0$</p>`
                },
                {
                    q: R`Gib alle Nullstellen von $f(x)=\sin x$ im Intervall $[-2\pi;\,2\pi]$ an.`,
                    sol: R`<p>Der Sinus ist null, wenn $P$ auf der waagerechten Achse liegt — bei jedem Vielfachen von $\pi$.</p>
<p class="v-res">$x\in\{-2\pi;\,-\pi;\,0;\,\pi;\,2\pi\}$</p>`
                },
                {
                    q: R`Warum gilt $\sin(x+2\pi)=\sin x$ für jedes $x$?`,
                    sol: R`<p>$2\pi$ ist eine volle Umdrehung. $P$ landet wieder an derselben Stelle, also hat es dieselbe Höhe.</p>
<p class="v-res">Die Sinusfunktion ist periodisch mit der Periode $2\pi$.</p>`
                },
                {
                    q: R`In welchem Bereich zwischen $0$ und $2\pi$ steigt die Sinuskurve?`,
                    hint: R`Wann wandert $P$ am Kreis nach oben?`,
                    sol: R`<p>$P$ steigt, solange es rechts von der y‑Achse ist: von $0$ bis $\tfrac{\pi}{2}$ und wieder von $\tfrac{3\pi}{2}$ bis $2\pi$.</p>
<p class="v-res">Steigend auf $\left[0;\tfrac{\pi}{2}\right]$ und $\left[\tfrac{3\pi}{2};2\pi\right]$, fallend auf $\left[\tfrac{\pi}{2};\tfrac{3\pi}{2}\right]$.</p>`
                },
                {
                    q: R`Ein Riesenrad dreht sich gleichmäßig. Welche Größe verläuft sinusförmig, wenn man sie über die Zeit aufträgt?`,
                    sol: R`<p>Die <b>Höhe</b> einer Gondel über dem Boden: Sie ist die Nabenhöhe plus die y‑Koordinate eines Punktes auf einem Kreis. Auch der waagerechte Abstand zur Mittelachse verläuft (als Kosinus) periodisch.</p>
<p class="v-res">Höhe (und seitliche Auslenkung) der Gondel — mehr dazu in Kapitel 8.</p>`
                },
            ]);
        },

        update(ctx) { ctx.redraw(); this.hud(ctx); },
        onHide() { stopPlayer(this, S4); },
        onShow(ctx) {
            const st = ctx.stage2;
            graphView(st, xmax4(), -1.5, 1.4);
            st.clearHandles();
            L.circleHandle(st, M, 1, () => S4.x, x => { S4.x = x; this.slider.set(Math.round(deg(x))); }, C.ang, 'P', [0, xmax4()]);
            graphHandle(st, () => S4.x, x => { S4.x = x; this.slider.set(Math.round(deg(x))); }, Math.sin, C.sin, null, 0, xmax4());
            ctx.tip('Ziehen: P am Kreis oder der Punkt auf der Kurve');
            this.update(ctx);
        },
        onDrag(ctx) { stopPlayer(this, S4); this.hud(ctx); },

        hud(ctx) {
            const x = S4.x, s = Math.sin(x);
            const rising = Math.cos(x) > 1e-9 ? 'steigend' : Math.cos(x) < -1e-9 ? 'fallend' : (s > 0 ? 'Hochpunkt' : 'Tiefpunkt');
            ctx.hud(
                xRow(x) +
                line(R`\sin x${valTex(s)}`, C.sin) +
                row('Kurve', rising) +
                `<div class="v-hud-note">Bogen am Kreis = Strecke auf der x‑Achse = ${num(x, 3)}.</div>`);
        },

        draw(st) {
            const x = S4.x, s = Math.sin(x), hi = xmax4();
            const P = L.unitCircle(st, M, 1, x, { cos: false, sector: false, label: 'x', arcLen: S4.tape, cosLabel: false });
            // curve: ghost of the whole thing, strong where P has already been
            if (S4.full) st.curve(Math.sin, C.sin, { from: 0, to: hi, alpha: 0.35, width: 2 });
            st.curve(Math.sin, C.sin, { from: 0, to: x, width: 3 });
            if (S4.tape) st.segment([0, 0], [x, 0], C.ang, { width: 5, alpha: 0.9 });
            st.segment(P, [x, s], C.sin, { dash: [5, 5], width: 1.3, alpha: 0.7 });
            st.segment([x, 0], [x, s], C.sin, { width: 4 });
            if (S4.props) {
                for (let k = 0; k * PI <= hi + 1e-9; k++) {
                    st.dot([k * PI, 0], COL.purple, 5);
                }
                for (let k = 0; PI / 2 + k * TAU <= hi; k++) {
                    st.dot([PI / 2 + k * TAU, 1], COL.purple, 5);
                    st.text('HP', [PI / 2 + k * TAU, 1], COL.purple, { dy: -15, font: SMALL });
                }
                for (let k = 0; 3 * PI / 2 + k * TAU <= hi; k++) {
                    st.dot([3 * PI / 2 + k * TAU, -1], COL.purple, 5);
                    st.text('TP', [3 * PI / 2 + k * TAU, -1], COL.purple, { dy: 16, font: SMALL });
                }
            }
            st.text('sin x', [x, s], C.sin, { dx: 10, dy: s >= 0 ? -14 : 14, align: 'left', font: FONT });
        },
    });

    // ==================================================================
    // 5 — Kosinusfunktion
    // ==================================================================
    const S5 = { x: rad(60), sin: true, shift: false, s: 0, squares: false };

    L.register({
        id: 'kosinus',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Winkel x', '<div id="t5-x"></div>', C.ang);
            this.slider = L.slider('t5-x', 'x in Grad', 0, 360, Math.round(deg(S5.x)), 1,
                v => { S5.x = rad(+v); this.update(ctx); }, C.ang, v => v + '°');

            CyberUI.createCard(c, 'Anzeigen', '<div id="t5-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t5-opt', 'Sinuskurve zum Vergleich', S5.sin, v => { S5.sin = v; ctx.redraw(); }, C.sin);
            CyberUI.createCheckbox('t5-opt', 'sin² x und cos² x', S5.squares, v => { S5.squares = v; ctx.redraw(); this.hud(ctx); }, COL.green);

            CyberUI.createCard(c, 'Sinus verschieben', '<div id="t5-sh"></div>', COL.purple);
            CyberUI.createCheckbox('t5-sh', 'sin(x + s) zeigen', S5.shift, v => { S5.shift = v; ctx.redraw(); this.hud(ctx); }, COL.purple);
            this.sSlider = L.slider('t5-sh', 's', -360, 360, 0, 15, v => { S5.s = rad(+v); ctx.redraw(); this.hud(ctx); }, COL.purple, v => v + '°');
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh <b>P</b> oder den Punkt auf der blauen Kurve. Schieb den Sinus mit dem Regler <b>s</b> so lange, bis er auf dem Kosinus liegt.</div>', COL.blue);

            ctx.theory(R`
<p>Der Kosinus ist die <b>x‑Koordinate</b> von $P$. Trägt man sie genauso über $x$ ab wie vorher den Sinus, entsteht die Kosinuskurve:</p>
<div class="v-key">$$f(x)=\cos x$$ beginnt oben: $\cos 0=1$ — der Punkt $P(1\mid 0)$ liegt ganz rechts.</div>
<div class="v-table-wrap"><table class="v-table">
<tr><th>Werte&shy;bereich</th><td>$W=[-1;\,1]$</td></tr>
<tr><th>Periode</th><td>$2\pi$</td></tr>
<tr><th>Null&shy;stellen</th><td>$x=\tfrac{\pi}{2}+k\cdot\pi,\;k\in\mathbb{Z}$</td></tr>
<tr><th>Hoch&shy;punkte</th><td>$(k\cdot 2\pi\mid 1)$</td></tr>
<tr><th>Tief&shy;punkte</th><td>$(\pi+k\cdot 2\pi\mid -1)$</td></tr>
<tr><th>Symmetrie</th><td>achsensymmetrisch zur y‑Achse: $\cos(-x)=\cos x$</td></tr>
</table></div>
<p class="v-sub">Dieselbe Welle, nur verschoben</p>
<p>Schalte <i>sin(x + s)</i> ein und zieh $s$ auf $90^\circ$: Die lila Kurve deckt sich mit dem Kosinus.</p>
<div class="v-key">$$\cos x=\sin\!\left(x+\tfrac{\pi}{2}\right)$$ Die Kosinuskurve ist die Sinuskurve, um $\tfrac{\pi}{2}$ nach <b>links</b> geschoben.</div>
<p class="v-sub">Zusammen immer 1</p>
<p>Mit <i>sin² x und cos² x</i> siehst du zwei Wellen, die sich genau zu der grünen Linie $y=1$ ergänzen: $\sin^2 x+\cos^2 x=1$ — der Pythagoras vom Einheitskreis, jetzt als Funktion.</p>
<div class="v-warn">„Plus“ in der Klammer schiebt nach <b>links</b>, nicht nach rechts. Das wird in Kapitel 7 wichtig.</div>`);

            ctx.tasks([
                {
                    q: R`Bestimme $\cos 0$, $\cos\tfrac{\pi}{2}$, $\cos\pi$ und $\cos\tfrac{3\pi}{2}$.`,
                    sol: R`<p>Die x‑Koordinaten von $P(1\mid 0)$, $P(0\mid 1)$, $P(-1\mid 0)$, $P(0\mid -1)$.</p><p class="v-res">$1,\;0,\;-1,\;0$</p>`
                },
                {
                    q: R`Wie unterscheiden sich die Graphen von $\sin x$ und $\cos x$?`,
                    sol: R`<p>Gar nicht in der Form — nur in der Lage. Beide haben Wertebereich $[-1;1]$ und Periode $2\pi$.</p>
<p class="v-res">Die Kosinuskurve ist die um $\tfrac{\pi}{2}$ nach links verschobene Sinuskurve: $\cos x=\sin\!\left(x+\tfrac{\pi}{2}\right)$.</p>`
                },
                {
                    q: R`Zeige am Einheitskreis, dass $\cos(-x)=\cos x$ gilt.`,
                    hint: R`Wohin wandert $P$, wenn man den Winkel im Uhrzeigersinn abträgt?`,
                    sol: R`<p>Der Winkel $-x$ wird im Uhrzeigersinn abgetragen. Der neue Punkt ist das <b>Spiegelbild</b> von $P$ an der x‑Achse: Die y‑Koordinate wechselt das Vorzeichen, die x‑Koordinate bleibt.</p>
<p class="v-res">$\cos(-x)=\cos x$ (Kosinus achsensymmetrisch) und $\sin(-x)=-\sin x$ (Sinus punktsymmetrisch).</p>`
                },
                {
                    q: R`Gib alle Nullstellen von $\cos x$ im Intervall $[0;\,2\pi]$ an.`,
                    sol: R`<p>Der Kosinus ist null, wenn $P$ auf der y‑Achse liegt: ganz oben oder ganz unten.</p><p class="v-res">$x=\tfrac{\pi}{2}$ und $x=\tfrac{3\pi}{2}$</p>`
                },
                {
                    q: R`Berechne $\sin^2 37^\circ+\cos^2 37^\circ$ ohne Taschenrechner.`,
                    sol: R`<p>Für <b>jeden</b> Winkel gilt $\sin^2 x+\cos^2 x=1$.</p><p class="v-res">$1$</p>`
                },
            ]);
        },

        update(ctx) { ctx.redraw(); this.hud(ctx); },
        onShow(ctx) {
            const st = ctx.stage2;
            graphView(st, TAU, -1.5, 1.4);
            L.circleHandle(st, M, 1, () => S5.x, x => { S5.x = x; this.slider.set(Math.round(deg(x))); }, C.ang, 'P', [0, TAU]);
            graphHandle(st, () => S5.x, x => { S5.x = x; this.slider.set(Math.round(deg(x))); }, Math.cos, C.cos, null, 0, TAU);
            ctx.tip('Ziehen: P am Kreis oder der Punkt auf der blauen Kurve');
            this.update(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const x = S5.x, s = Math.sin(x), c = Math.cos(x);
            let h = xRow(x) + line(R`\cos x${valTex(c)}`, C.cos) + line(R`\sin x${valTex(s)}`, C.sin);
            if (S5.squares) h += line(R`\sin^2 x+\cos^2 x=${Tex.num(s * s, 3)}+${Tex.num(c * c, 3)}=1`, 'rgb(160,200,90)');
            if (S5.shift) {
                const hit = Math.abs(L.wrap(S5.s - PI / 2)) < 1e-9;
                h += line(R`\sin(x+${piTex(S5.s) || Tex.num(S5.s, 2)})`, COL.purple) +
                    `<div class="v-hud-note">${hit ? '<b style="color:rgb(160,200,90)">Deckungsgleich!</b> cos x = sin(x + π/2)' : 'Schieb s, bis die lila Kurve auf der blauen liegt.'}</div>`;
            }
            ctx.hud(h);
        },

        draw(st) {
            const x = S5.x, c = Math.cos(x);
            L.unitCircle(st, M, 1, x, { sector: false, label: 'x' });
            if (S5.squares) {
                st.curve(t => Math.sin(t) ** 2, C.sin, { from: 0, width: 1.8, dash: [6, 4], alpha: 0.75 });
                st.curve(t => Math.cos(t) ** 2, C.cos, { from: 0, width: 1.8, dash: [6, 4], alpha: 0.75 });
                st.hline(1, COL.green, { from: 0, width: 2.4 });
            }
            if (S5.sin) st.curve(Math.sin, C.sin, { from: 0, width: 2, alpha: 0.45 });
            st.curve(Math.cos, C.cos, { from: 0, width: 3 });
            if (S5.shift) st.curve(t => Math.sin(t + S5.s), COL.purple, { from: 0, width: 2.4, dash: [8, 5] });
            st.segment([x, 0], [x, c], C.cos, { width: 4 });
            st.text('cos x', [x, c], C.cos, { dx: 10, dy: c >= 0 ? -14 : 14, align: 'left', font: FONT });
        },
    });

    // ==================================================================
    // 6 — Besondere Werte, Symmetrie und Gleichungen sin x = y0
    // ==================================================================
    const S6 = { y: 0.5, fn: 'sin', more: false };
    const NICE = [0, 0.5, Math.SQRT2 / 2, Math.sqrt(3) / 2, 1];

    /** Both solutions in [0, 2π) of sin x = y (or cos x = y); [] if there is none. */
    function solve(fn, y) {
        if (Math.abs(y) > 1 + 1e-12) return [];
        y = Math.max(-1, Math.min(1, y));
        let a, b;
        if (fn === 'sin') { a = Math.asin(y); b = PI - a; } else { a = Math.acos(y); b = TAU - a; }
        const out = [L.wrap(a), L.wrap(b)].map(v => Math.abs(v - TAU) < 1e-9 ? 0 : v);
        return Math.abs(out[0] - out[1]) < 1e-9 ? [out[0]] : out.sort((p, q) => p - q);
    }

    L.register({
        id: 'gleichung',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Gleichung', '<div id="t6-fn"></div><div id="t6-y"></div>', COL.orange);
            CyberUI.createDropdown('t6-fn', [
                { id: 'sin', label: 'sin x = y₀' },
                { id: 'cos', label: 'cos x = y₀' },
            ], id => { S6.fn = id; this.update(ctx); }, S6.fn);
            this.ySlider = L.slider('t6-y', 'y₀', -1.3, 1.3, S6.y, 0.01, v => { S6.y = +v; this.update(ctx); }, COL.orange, v => num(+v, 2));
            const set = v => { S6.y = v; this.ySlider.set(Math.round(v * 100) / 100); this.update(ctx); };
            L.buttons('t6-y', [
                { label: '½', run: () => set(0.5) }, { label: '√2/2', run: () => set(Math.SQRT2 / 2) },
                { label: '√3/2', run: () => set(Math.sqrt(3) / 2) }, { label: '−½', run: () => set(-0.5) },
                { label: '0', run: () => set(0) }, { label: '1', run: () => set(1) }, { label: '1,2', run: () => set(1.2) },
            ]);
            CyberUI.createCard(c, 'Anzeigen', '<div id="t6-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t6-opt', 'Zweite Periode (bis 4π)', S6.more, v => { S6.more = v; this.onShow(ctx); }, C.ang);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh den Punkt <b>y₀</b> auf der y‑Achse oder nimm den Regler. Die Schnittpunkte sind die Lösungen.</div>', COL.blue);

            ctx.theory(R`
<p class="v-sub" style="margin-top:0">Die Werte, die man auswendig kann</p>
<div class="v-table-wrap"><table class="v-table">
<tr><th>Grad</th><td>$0^\circ$</td><td>$30^\circ$</td><td>$45^\circ$</td><td>$60^\circ$</td><td>$90^\circ$</td></tr>
<tr><th>Bogen</th><td>$0$</td><td>$\tfrac{\pi}{6}$</td><td>$\tfrac{\pi}{4}$</td><td>$\tfrac{\pi}{3}$</td><td>$\tfrac{\pi}{2}$</td></tr>
<tr><th style="color:rgb(245,194,66)">sin</th><td>$\tfrac{\sqrt{0}}{2}$</td><td>$\tfrac{\sqrt{1}}{2}$</td><td>$\tfrac{\sqrt{2}}{2}$</td><td>$\tfrac{\sqrt{3}}{2}$</td><td>$\tfrac{\sqrt{4}}{2}$</td></tr>
<tr><th style="color:#00d2ff">cos</th><td>$\tfrac{\sqrt{4}}{2}$</td><td>$\tfrac{\sqrt{3}}{2}$</td><td>$\tfrac{\sqrt{2}}{2}$</td><td>$\tfrac{\sqrt{1}}{2}$</td><td>$\tfrac{\sqrt{0}}{2}$</td></tr>
</table></div>
<div class="v-aha"><b>Merktrick:</b> Beim Sinus steht unter der Wurzel $0,1,2,3,4$ — beim Kosinus rückwärts. Vereinfacht: $0,\ \tfrac12,\ \tfrac{\sqrt2}{2},\ \tfrac{\sqrt3}{2},\ 1$.</div>
<p class="v-sub">Symmetrie am Einheitskreis</p>
<div class="v-key">$$\sin(\pi-x)=\sin x$$ $$\cos(2\pi-x)=\cos x$$ Gleiche Höhe links und rechts der y‑Achse — gleiche x‑Koordinate oben und unten.</div>
<p class="v-sub">Gleichungen lösen</p>
<p>Die waagerechte Linie $y=y_0$ schneidet den Kreis in <b>zwei</b> Punkten — also gibt es in $[0;2\pi)$ meist zwei Lösungen:</p>
<div class="v-key"><b>Sinus:</b> $$\begin{aligned}x_1&=\sin^{-1}(y_0)\\ x_2&=\pi-x_1\end{aligned}$$ <b>Kosinus:</b> $$\begin{aligned}x_1&=\cos^{-1}(y_0)\\ x_2&=2\pi-x_1\end{aligned}$$ Alle Lösungen: $x_1+k\cdot 2\pi$ und $x_2+k\cdot 2\pi$, $k\in\mathbb{Z}$.</div>
<div class="v-warn"><b>Der Taschenrechner kennt nur eine Lösung.</b> $\sin^{-1}$ liefert immer einen Winkel zwischen $-\tfrac{\pi}{2}$ und $\tfrac{\pi}{2}$. Die zweite Lösung musst du über die Symmetrie selbst finden — und negative Ergebnisse mit $+2\pi$ in $[0;2\pi)$ holen.</div>
<p>Für $|y_0|>1$ gibt es <b>keine</b> Lösung, für $y_0=\pm 1$ nur <b>eine</b> pro Periode (Linie berührt den Kreis).</p>`);

            ctx.tasks([
                {
                    q: R`Löse $\sin x=\tfrac12$ im Intervall $[0;\,2\pi)$.`,
                    sol: R`<span class="v-step">Erste Lösung</span>$$x_1=\sin^{-1}\!\left(\tfrac12\right)=\tfrac{\pi}{6}$$
<span class="v-step">Symmetrie</span>$$x_2=\pi-\tfrac{\pi}{6}=\tfrac{5\pi}{6}$$<p class="v-res">$L=\left\{\tfrac{\pi}{6};\tfrac{5\pi}{6}\right\}$ — zwei Lösungen.</p>`
                },
                {
                    q: R`Löse $\cos x=-\tfrac{\sqrt2}{2}$ im Intervall $[0;\,2\pi)$.`,
                    sol: R`<span class="v-step">Erste Lösung</span>$$x_1=\cos^{-1}\!\left(-\tfrac{\sqrt2}{2}\right)=\tfrac{3\pi}{4}$$
<span class="v-step">Symmetrie zur x‑Achse</span>$$x_2=2\pi-\tfrac{3\pi}{4}=\tfrac{5\pi}{4}$$<p class="v-res">$L=\left\{\tfrac{3\pi}{4};\tfrac{5\pi}{4}\right\}$</p>`
                },
                {
                    q: R`Löse $2\sin x+1=0$ im Intervall $[0;\,2\pi)$.`,
                    hint: R`Erst nach $\sin x$ umstellen. Der Taschenrechner liefert dann einen negativen Winkel.`,
                    sol: R`<span class="v-step">Umstellen</span>$$\sin x=-\tfrac12$$
<span class="v-step">Taschenrechner</span>$$\sin^{-1}\!\left(-\tfrac12\right)=-\tfrac{\pi}{6}\;\Rightarrow\;x_1=-\tfrac{\pi}{6}+2\pi=\tfrac{11\pi}{6}$$
<span class="v-step">Symmetrie</span>$$x_2=\pi-\left(-\tfrac{\pi}{6}\right)=\tfrac{7\pi}{6}$$<p class="v-res">$L=\left\{\tfrac{7\pi}{6};\tfrac{11\pi}{6}\right\}$</p>`
                },
                {
                    q: R`Wie viele Lösungen hat $\sin x=0{,}5$ im Intervall $[0;\,4\pi)$? Und wie viele hat $\sin x=2$?`,
                    sol: R`<p>Pro Periode zwei Lösungen, $[0;4\pi)$ sind zwei Perioden.</p><p class="v-res">Vier Lösungen: $\tfrac{\pi}{6},\tfrac{5\pi}{6},\tfrac{13\pi}{6},\tfrac{17\pi}{6}$. Für $\sin x=2$ keine — der Sinus wird nie größer als $1$.</p>`
                },
                {
                    q: R`Löse $\sin x=0{,}3$ in $[0;\,2\pi)$ mit dem Taschenrechner (RAD, zwei Nachkommastellen).`,
                    sol: R`$$x_1=\sin^{-1}(0{,}3)\approx 0{,}30\qquad x_2=\pi-0{,}30\approx 2{,}84$$<p class="v-res">$L\approx\{0{,}30;\,2{,}84\}$</p>`
                },
            ]);
        },

        update(ctx) { ctx.redraw(); this.hud(ctx); },
        onShow(ctx) {
            const st = ctx.stage2;
            graphView(st, S6.more ? 2 * TAU : TAU, -1.5, 1.45);
            st.clearHandles();
            st.addHandle(() => [0, S6.y], w => {
                let y = Math.max(-1.3, Math.min(1.3, w[1]));
                const hit = NICE.flatMap(v => [v, -v]).find(v => Math.abs(y - v) < 0.03);
                S6.y = hit != null ? hit : Math.round(y * 100) / 100;
                this.ySlider.set(Math.round(S6.y * 100) / 100);
            }, COL.orange, 'y₀');
            ctx.tip('Ziehen: y₀ auf der y‑Achse');
            this.update(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const f = S6.fn, y = S6.y, sol = solve(f, y);
            const ft = f === 'sin' ? '\\sin' : '\\cos';
            const yt = L.exactTex(y) || Tex.num(y, 2);
            let h = line(R`${ft} x=${yt}`, f === 'sin' ? C.sin : C.cos);
            if (!sol.length) {
                h += `<div class="v-hud-note"><b style="color:#ff7a6b">Keine Lösung</b> — ${f === 'sin' ? 'der Sinus' : 'der Kosinus'} liegt immer zwischen −1 und 1.</div>`;
            } else {
                const tr = f === 'sin' ? Math.asin(y) : Math.acos(Math.max(-1, Math.min(1, y)));
                h += row('Taschenrechner', `${f}⁻¹(${num(y, 3)}) ≈ ${num(tr, 3)}`);
                sol.forEach((s, i) => { h += line(R`x_${i + 1}${radTex(s, 3)}\;\;(${Tex.num(deg(s), 1)}^\circ)`, 'rgb(160,200,90)'); });
                h += `<div class="v-hud-note">${sol.length === 1 ? 'Die Linie berührt nur — eine Lösung pro Periode.' :
                    (f === 'sin' ? 'x₂ = π − x₁' : 'x₂ = 2π − x₁') + ', dazu jeweils + k · 2π.'}</div>`;
            }
            ctx.hud(h);
        },

        draw(st) {
            const f = S6.fn, y = S6.y, sol = solve(f, y), fn = f === 'sin' ? Math.sin : Math.cos;
            const col = f === 'sin' ? C.sin : C.cos, hi = S6.more ? 2 * TAU : TAU;
            // circle with the matching line: horizontal for sine, vertical for cosine
            L.unitCircle(st, M, 1, sol.length ? sol[0] : 0, { sin: false, cos: false, rad: false, arc: false, rightAngle: false });
            if (f === 'sin') st.segment([M[0] - 1.25, y], [M[0] + 1.25, y], COL.orange, { width: 1.6, dash: [6, 4] });
            else st.segment([M[0] + y, -1.25], [M[0] + y, 1.25], COL.orange, { width: 1.6, dash: [6, 4] });
            st.hline(y, COL.orange, { from: 0, width: 1.6, dash: [6, 4] });
            st.curve(fn, col, { from: 0, to: hi, width: 3 });
            const cols = [COL.green, COL.purple];
            sol.forEach((s, i) => {
                const P = [M[0] + Math.cos(s), M[1] + Math.sin(s)];
                st.segment(M, P, cols[i], { width: 2.2 });
                st.arcW(M, 0.22 + 0.12 * i, 0, s, cols[i], { width: 1.8 });
                st.dot(P, cols[i], 5);
                for (let k = 0; s + k * TAU <= hi + 1e-9; k++) {
                    const X = s + k * TAU;
                    st.segment([X, 0], [X, y], cols[i], { width: 1.4, dash: [3, 3] });
                    st.dot([X, y], cols[i], k ? 4 : 6);
                    st.text('x' + (i + 1) + (k ? ' + 2π' : ''), [X, 0], cols[i], { dy: y >= 0 ? 44 : -40, font: SMALL });
                }
            });
        },
    });

    // ==================================================================
    // 9 — Tangensfunktion
    // ==================================================================
    const S9 = { x: rad(40), sc: false };
    const tan = x => Math.abs(Math.cos(x)) < 1e-9 ? NaN : Math.tan(x);

    L.register({
        id: 'tangens',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Winkel x', '<div id="t9-x"></div>', C.ang);
            this.slider = L.slider('t9-x', 'x in Grad', 0, 360, Math.round(deg(S9.x)), 1,
                v => { S9.x = rad(+v); this.update(ctx); }, C.ang, v => v + '°');
            L.buttons('t9-x', [30, 45, 60, 89, 135].map(d => ({ label: d + '°', run: () => { S9.x = rad(d); this.slider.set(d); this.update(ctx); } })));
            CyberUI.createCard(c, 'Anzeigen', '<div id="t9-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t9-opt', 'Sinus und Kosinus dazu', S9.sc, v => { S9.sc = v; ctx.redraw(); }, C.sin);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh <b>P</b> Richtung 90° und schau, wohin <b>T</b> auf der Tangente davonläuft.</div>', COL.blue);

            ctx.theory(R`
<div class="v-key">$$\tan x=\frac{\sin x}{\cos x}$$ nur wo $\cos x\neq 0$ ist.</div>
<p><b>Am Einheitskreis:</b> Verlängere den Radius durch $P$, bis er die senkrechte Tangente bei $x=1$ trifft. Der Treffpunkt $T$ hat die Höhe $\tan x$ — daher der Name. (Strahlensatz: $\tfrac{\tan x}{1}=\tfrac{\sin x}{\cos x}$.)</p>
<p>Je näher $P$ an $90^\circ$ kommt, desto steiler wird der Strahl und desto weiter läuft $T$ nach oben weg. Bei genau $90^\circ$ ist der Strahl parallel zur Tangente — es gibt keinen Schnittpunkt.</p>
<div class="v-table-wrap"><table class="v-table">
<tr><th>Definitions&shy;bereich</th><td>$x\neq\tfrac{\pi}{2}+k\cdot\pi$</td></tr>
<tr><th>Pol&shy;stellen</th><td>$x=\tfrac{\pi}{2}+k\cdot\pi$ (senkrechte Asymptoten)</td></tr>
<tr><th>Werte&shy;bereich</th><td>$W=\mathbb{R}$</td></tr>
<tr><th>Periode</th><td>$\pi$ (nicht $2\pi$!)</td></tr>
<tr><th>Null&shy;stellen</th><td>$x=k\cdot\pi$</td></tr>
<tr><th>Symmetrie</th><td>punktsymmetrisch zum Ursprung</td></tr>
</table></div>
<div class="v-aha"><b>Steigungswinkel:</b> Eine Gerade mit dem Steigungswinkel $\alpha$ hat die Steigung $m=\tan\alpha$ — der Strahl am Kreis ist genau so eine Gerade.</div>
<div class="v-warn">Die Periode ist $\pi$: Gegenüberliegende Punkte $P$ und $-P$ liegen auf derselben Geraden durch den Mittelpunkt, also treffen sie die Tangente im selben $T$.</div>`);

            ctx.tasks([
                {
                    q: R`Berechne ohne Taschenrechner $\tan 45^\circ$ und $\tan 60^\circ$.`,
                    sol: R`$$\tan 45^\circ=\frac{\sqrt2/2}{\sqrt2/2}=1\qquad \tan 60^\circ=\frac{\sqrt3/2}{1/2}=\sqrt3$$<p class="v-res">$1$ und $\sqrt3\approx 1{,}73$</p>`
                },
                {
                    q: R`Warum ist $\tan\tfrac{\pi}{2}$ nicht definiert?`,
                    sol: R`<p>$\cos\tfrac{\pi}{2}=0$ — man müsste durch null teilen. Am Kreis: Der Strahl zeigt senkrecht nach oben und trifft die Tangente nie.</p><p class="v-res">An $x=\tfrac{\pi}{2}$ hat der Tangens eine Polstelle.</p>`
                },
                {
                    q: R`Welchen Steigungswinkel hat die Gerade $y=2x+1$?`,
                    sol: R`$$\tan\alpha=m=2\;\Rightarrow\;\alpha=\tan^{-1}(2)\approx 63{,}43^\circ$$<p class="v-res">$\alpha\approx 63{,}4^\circ$</p>`
                },
                {
                    q: R`Löse $\tan x=1$ im Intervall $[0;\,2\pi)$.`,
                    hint: R`Die Periode des Tangens ist $\pi$.`,
                    sol: R`$$x_1=\tan^{-1}(1)=\tfrac{\pi}{4},\qquad x_2=\tfrac{\pi}{4}+\pi=\tfrac{5\pi}{4}$$<p class="v-res">$L=\left\{\tfrac{\pi}{4};\tfrac{5\pi}{4}\right\}$</p>`
                },
            ]);
        },

        update(ctx) { ctx.redraw(); this.hud(ctx); },
        onShow(ctx) {
            const st = ctx.stage2;
            graphView(st, TAU, -3.3, 3.3);
            L.circleHandle(st, M, 1, () => S9.x, x => { S9.x = x; this.slider.set(Math.round(deg(x))); }, C.ang, 'P', [0, TAU]);
            graphHandle(st, () => S9.x, x => { S9.x = x; this.slider.set(Math.round(deg(x))); },
                x => { const t = tan(x); return isFinite(t) ? Math.max(-3.2, Math.min(3.2, t)) : 3.2; }, C.tan, null, 0, TAU);
            ctx.tip('Ziehen: P am Kreis oder der Punkt auf der Kurve');
            this.update(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const x = S9.x, s = Math.sin(x), c = Math.cos(x), t = tan(x);
            let h = xRow(x) + line(R`\sin x${valTex(s)},\;\;\cos x${valTex(c)}`);
            if (!isFinite(t)) h += line(R`\tan x=\frac{${Tex.num(s, 3)}}{0}\;\text{— nicht definiert}`, '#ff7a6b') +
                `<div class="v-hud-note">Polstelle: der Strahl läuft parallel zur Tangente.</div>`;
            else h += line(R`\tan x=\frac{\sin x}{\cos x}${valTex(t)}`, C.tan);
            ctx.hud(h);
        },

        draw(st) {
            const x = S9.x, t = tan(x), Tx = M[0] + 1;
            L.unitCircle(st, M, 1, x, { sector: false, label: 'x', sinLabel: false, cosLabel: false });
            // tangent at (1|0) and the ray through P out to it
            st.segment([Tx, -3.4], [Tx, 3.4], 'rgba(255,79,163,0.45)', { width: 1.4 });
            if (isFinite(t)) {
                const T = [Tx, t];
                st.segment(M, T, 'rgba(255,255,255,0.6)', { width: 1.4, dash: [5, 4] });
                st.segment([Tx, 0], T, C.tan, { width: 4 });
                st.dot(T, C.tan, 5);
                st.text('T', T, C.tan, { dx: 12, font: FONT, align: 'left' });
                st.text('tan x', [Tx, t / 2], C.tan, { dx: 8, font: SMALL, align: 'left' });
                st.segment(T, [x, t], 'rgba(255,79,163,0.45)', { dash: [4, 4], width: 1.2 });
            }
            // asymptotes and graph
            [PI / 2, 3 * PI / 2].forEach(a => st.vline(a, 'rgba(176,36,24,0.9)', { dash: [6, 5], width: 1.6 }));
            if (S9.sc) {
                st.curve(Math.sin, C.sin, { from: 0, width: 1.8, alpha: 0.5 });
                st.curve(Math.cos, C.cos, { from: 0, width: 1.8, alpha: 0.5 });
            }
            st.curve(tan, C.tan, { from: 0, width: 3 });
            if (isFinite(t)) st.segment([x, 0], [x, t], C.tan, { width: 4 });
        },
    });
})();
