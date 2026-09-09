/* vektoren-mod-abstand.js — chapters 10 and 11: distances and applications.
 * Every scenario draws the perpendicular it is talking about, so the formula in
 * the panel and the red segment on stage are always the same object.
 */
(function () {
    'use strict';
    const { COL, V, G, num, Tex } = window.VekLab;
    const R = String.raw;
    const T = Tex;
    const col = v => T.col(v, 2);
    const gTex = (name, P, u, par) => R`${name}:\;\vec{x}=` + col(P) + `+${par}\\cdot` + col(u);

    function vecSliders(cid, label, get, set, cb, color, min, max, step) {
        const names = ['₁', '₂', '₃'];
        const hs = [];
        for (let i = 0; i < 3; i++) {
            hs.push(VekLab.slider(cid, label + names[i], min == null ? -5 : min, max == null ? 5 : max,
                get()[i], step == null ? 1 : step,
                x => { const v = get().slice(); v[i] = +x; set(v); cb(); }, color, x => num(+x, 1)));
        }
        return { set: v => hs.forEach((h, i) => h.set(v[i])) };
    }

    /** Mark the right angle where segment F->X meets direction dir. */
    function rightAngle3(st, F, toX, dir, color) {
        const a = V.unit(V.sub(toX, F)), b = V.unit(dir);
        if (V.isZero(a) || V.isZero(b)) return;
        const k = 0.32;
        const p1 = V.add(F, V.scale(a, k)), p2 = V.add(F, V.scale(b, k));
        st.line3(p1, V.add(p1, V.scale(b, k)), color, { alpha: 0.9 });
        st.line3(p2, V.add(p2, V.scale(a, k)), color, { alpha: 0.9 });
    }

    /** The point of n·x = d closest to the origin. */
    const planeCentre = (n, d) => V.scale(V.to3(n), d / V.len2(V.to3(n)));

    function drawPlane(st, n, d, color, size) {
        if (V.isZero(n)) return null;
        const p = G.nicePoints(n, d);
        if (!p) return null;
        st.plane3(planeCentre(n, d), p.u, p.v, color, { size: size || 3.6, alpha: 0.15 });
        return p;
    }

    // ==================================================================
    // 10 — Abstände
    // ==================================================================
    const S10 = {
        mode: 'pg',
        X: [1, 4, 3],
        P: [0, 0, 0], u: [1, 1, 0],
        Q: [0, 3, 2], v: [1, -1, 1],
        n: [0, 0, 1], d: 1, n2: [0, 0, 1], d2: 4,
    };
    const MODES10 = {
        pg: 'Punkt und Gerade',
        pe: 'Punkt und Ebene',
        gg: 'Gerade und Gerade',
        ee: 'Ebene und Ebene',
    };

    VekLab.register({
        id: 'abstand',
        build(ctx) {
            const c = ctx.sidebar;
            const upd = () => { ctx.redraw(); this.hud(ctx); };
            CyberUI.createCard(c, 'Abstand zwischen', '<div id="v10-mode"></div>', COL.orange);
            CyberUI.createDropdown('v10-mode', Object.keys(MODES10).map(id => ({ id, label: MODES10[id] })),
                id => { S10.mode = id; this.showCards(); upd(); }, S10.mode);

            CyberUI.createCard(c, 'Punkt X', '<div id="v10-x"></div>', COL.purple);
            vecSliders('v10-x', 'X', () => S10.X, v => S10.X = v, upd, COL.purple);
            CyberUI.createCard(c, 'Gerade g', '<div id="v10-g"></div>', COL.orange);
            vecSliders('v10-g', 'P', () => S10.P, v => S10.P = v, upd, COL.orange, -4, 4, 1);
            vecSliders('v10-g', 'u', () => S10.u, v => S10.u = v, upd, COL.orange, -4, 4, 1);
            CyberUI.createCard(c, 'Gerade h', '<div id="v10-h"></div>', COL.blue);
            vecSliders('v10-h', 'Q', () => S10.Q, v => S10.Q = v, upd, COL.blue, -4, 4, 1);
            vecSliders('v10-h', 'v', () => S10.v, v => S10.v = v, upd, COL.blue, -4, 4, 1);
            CyberUI.createCard(c, 'Ebene E₁', '<div id="v10-e1"></div>', COL.blue);
            vecSliders('v10-e1', 'n', () => S10.n, v => S10.n = v, upd, COL.blue, -4, 4, 1);
            VekLab.slider('v10-e1', 'd', -6, 6, S10.d, 1, x => { S10.d = +x; upd(); }, COL.blue, x => num(+x, 0));
            CyberUI.createCard(c, 'Ebene E₂', '<div id="v10-e2"></div>', COL.green);
            vecSliders('v10-e2', 'n', () => S10.n2, v => S10.n2 = v, upd, COL.green, -4, 4, 1);
            VekLab.slider('v10-e2', 'd', -6, 6, S10.d2, 1, x => { S10.d2 = +x; upd(); }, COL.green, x => num(+x, 0));

            // which cards belong to which scenario: [X, g, h, E1, E2]
            const NEEDS = { pg: [1, 1, 0, 0, 0], pe: [1, 0, 0, 1, 0], gg: [0, 1, 1, 0, 0], ee: [0, 0, 0, 1, 1] };
            this.showCards = () => {
                const cards = document.querySelectorAll('#sb-abstand .instrument-card');
                const need = NEEDS[S10.mode];
                for (let i = 0; i < need.length; i++) if (cards[i + 1]) cards[i + 1].style.display = need[i] ? '' : 'none';
            };
            this.showCards();

            ctx.theory(R`
<p>Abstand heißt in der Geometrie immer <b>kürzester</b> Abstand — und der wird immer <b>senkrecht</b> gemessen. Auf der Bühne ist das die rote Strecke; sie steht in jedem Modus senkrecht auf dem, wovon gemessen wird.</p>
<div class="v-key"><b>Punkt und Ebene</b> — die einfachste Formel von allen, die Hesse'sche Normalform: $$d(X,E)=\frac{|\vec{n}\circ\vec{x}-d|}{|\vec{n}|}$$ Punkt einsetzen, durch die Länge der Normalen teilen, Betrag nehmen. Fertig.</div>
<div class="v-key"><b>Punkt und Gerade</b> — über das Kreuzprodukt: $$d(X,g)=\frac{|\overrightarrow{PX}\times\vec{u}|}{|\vec{u}|}$$ Der Zähler ist die Fläche des Parallelogramms, der Nenner die Grundseite — also die Höhe.</div>
<p>Alternativ, und in der Klausur oft verlangt, der <b>Weg über den Lotfußpunkt</b>: Ansatz $F=\vec p+r\vec u$, dann $\overrightarrow{XF}\circ\vec{u}=0$ nach $r$ auflösen, $F$ einsetzen, $|\overrightarrow{XF}|$ rechnen. Länger, dafür bekommst du den Fußpunkt geschenkt — den brauchst du in Kapitel 11.</p>
<div class="v-key"><b>Zwei parallele Geraden</b>: Punkt von $h$ nehmen, Abstand zu $g$ rechnen. <b>Zwei parallele Ebenen</b>: Punkt von $E_2$ nehmen, Abstand zu $E_1$ rechnen. In beiden Fällen ist ein Fall auf einen bereits gelösten zurückgeführt.</div>
<div class="v-key"><b>Windschiefe Geraden</b> — hier hilft das Spatprodukt: $$d(g,h)=\frac{|(\vec{u}\times\vec{v})\circ\overrightarrow{PQ}|}{|\vec{u}\times\vec{v}|}$$ $\vec u\times\vec v$ zeigt in Richtung der gemeinsamen Senkrechten; man projiziert den Verbindungsvektor $\overrightarrow{PQ}$ darauf.</div>
<div class="v-aha"><b>Alle vier Formeln sind dieselbe Idee:</b> nimm irgendeinen Verbindungsvektor zwischen den beiden Objekten und projiziere ihn auf die Richtung, die auf beiden senkrecht steht. Dividiert wird immer durch die Länge dieser Richtung.</div>
<div class="v-warn">Schneiden sich zwei Geraden oder Ebenen, ist ihr Abstand <b>null</b> — die Formeln greifen dann nicht mehr. Prüfe erst die Lage (Kapitel 5 und 7), dann rechne.</div>`);

            ctx.tasks([
                {
                    q: R`Berechne den Abstand des Punktes $X(3/1/4)$ von der Ebene $E:\;2x-y+2z=5$.`,
                    sol: R`<span class="v-step">Hesse'sche Normalform</span>
$$d=\frac{|2\cdot3-1\cdot1+2\cdot4-5|}{\sqrt{4+1+4}}=\frac{|6-1+8-5|}{3}=\frac{8}{3}$$
<p class="v-res">$d=\tfrac{8}{3}\approx 2{,}67$</p>
<div class="v-warn">Der Nenner ist $|\vec n|$, <b>nicht</b> $|\vec n|^2$. Und der Betrag im Zähler ist Pflicht — ohne ihn bekommt man je nach Seite der Ebene ein Vorzeichen.</div>`
                },
                {
                    q: R`Bestimme den Abstand von $X(1/4/3)$ zur Geraden $g:\;\vec{x}=\begin{pmatrix}0\\0\\0\end{pmatrix}+r\begin{pmatrix}1\\1\\0\end{pmatrix}$ — einmal mit dem Kreuzprodukt und einmal über den Lotfußpunkt.`,
                    hint: R`Beide Wege müssen dieselbe Zahl liefern. Stell die Aufgabe links auf der Bühne ein und vergleiche.`,
                    sol: R`<span class="v-step">Weg 1: Kreuzprodukt</span>
$$\overrightarrow{PX}=\begin{pmatrix}1\\4\\3\end{pmatrix},\qquad \overrightarrow{PX}\times\vec{u}=\begin{pmatrix}4\cdot0-3\cdot1\\3\cdot1-1\cdot0\\1\cdot1-4\cdot1\end{pmatrix}=\begin{pmatrix}-3\\3\\-3\end{pmatrix}$$
$$d=\frac{\sqrt{9+9+9}}{\sqrt{2}}=\frac{3\sqrt3}{\sqrt2}=\frac{3\sqrt6}{2}\approx 3{,}67$$
<span class="v-step">Weg 2: Lotfußpunkt</span>
<p>Ansatz $F=r\begin{pmatrix}1\\1\\0\end{pmatrix}$, Bedingung $\overrightarrow{XF}\circ\vec{u}=0$:</p>
$$\begin{pmatrix}r-1\\t-4\\-3\end{pmatrix}\circ\begin{pmatrix}1\\1\\0\end{pmatrix}=2t-5=0\;\Longrightarrow\;r=2{,}5$$
$$F(2{,}5/2{,}5/0),\qquad \overrightarrow{XF}=\begin{pmatrix}1{,}5\\-1{,}5\\-3\end{pmatrix}$$
$$d=\sqrt{2{,}25+2{,}25+9}=\sqrt{13{,}5}\approx 3{,}67$$
<p class="v-res">Beide Wege: $d=\sqrt{13{,}5}=\tfrac{3\sqrt6}{2}\approx 3{,}67$ ✓</p>`
                },
                {
                    q: R`Wie weit sind die parallelen Ebenen $E_1:\;x+2y-2z=3$ und $E_2:\;x+2y-2z=-6$ voneinander entfernt?`,
                    sol: R`<span class="v-step">Erst prüfen: wirklich parallel?</span>
<p>Beide haben $\vec{n}=\begin{pmatrix}1\\2\\-2\end{pmatrix}$, aber $3\neq-6$ — also echt parallel. ✓</p>
<span class="v-step">Punkt auf E₂ suchen</span>
<p>$y=z=0$ gibt $x=-6$, also $X(-6/0/0)$.</p>
<span class="v-step">Abstand zu E₁</span>
$$d=\frac{|-6+0-0-3|}{\sqrt{1+4+4}}=\frac{9}{3}=3$$
<p class="v-res">$d=3$</p>
<p>Kurzformel bei gleichem $\vec n$: $d=\dfrac{|d_1-d_2|}{|\vec n|}=\dfrac{9}{3}=3$ ✓</p>`
                },
                {
                    q: R`Bestimme den Abstand der windschiefen Geraden $g:\;\vec{x}=\begin{pmatrix}0\\0\\0\end{pmatrix}+r\begin{pmatrix}1\\0\\0\end{pmatrix}$ und $h:\;\vec{x}=\begin{pmatrix}0\\0\\4\end{pmatrix}+s\begin{pmatrix}0\\1\\0\end{pmatrix}$.`,
                    sol: R`<span class="v-step">Gemeinsame Senkrechte</span>
$$\vec{u}\times\vec{v}=\begin{pmatrix}1\\0\\0\end{pmatrix}\times\begin{pmatrix}0\\1\\0\end{pmatrix}=\begin{pmatrix}0\\0\\1\end{pmatrix}$$
<span class="v-step">Verbindungsvektor projizieren</span>
$$\overrightarrow{PQ}=\begin{pmatrix}0\\0\\4\end{pmatrix},\qquad d=\frac{|(\vec u\times\vec v)\circ\overrightarrow{PQ}|}{|\vec u\times\vec v|}=\frac{|4|}{1}=4$$
<p class="v-res">$d=4$</p>
<p>Anschaulich klar: die eine Gerade liegt in der Höhe $z=0$, die andere in $z=4$, und beide laufen waagerecht.</p>`
                },
                {
                    q: R`Der Punkt $X(2/2/2)$ soll von der Ebene $E:\;x+y+z=d$ den Abstand $\sqrt{3}$ haben. Bestimme alle $d$.`,
                    hint: R`Der Betrag liefert zwei Fälle — die Ebene kann auf beiden Seiten von X liegen.`,
                    sol: R`<span class="v-step">Ansatz</span>
$$\frac{|2+2+2-d|}{\sqrt{3}}=\sqrt{3}\;\Longrightarrow\;|6-d|=3$$
<span class="v-step">Betrag auflösen — zwei Fälle</span>
$$6-d=3\;\Rightarrow\;d=3\qquad\text{oder}\qquad 6-d=-3\;\Rightarrow\;d=9$$
<p class="v-res">$d=3$ oder $d=9$.</p>
<p>Die beiden Ebenen liegen symmetrisch zu $X$ — eine davor, eine dahinter. Stell beide links ein und schau dir den Punkt dazwischen an.</p>`
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
            const S = S10;
            let h = '';
            if (S.mode === 'pg') {
                if (V.isZero(S.u)) return ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Der Richtungsvektor darf nicht null sein.</div>`);
                const f = G.footOnLine(S.X, S.P, S.u);
                const d = G.distPointLine(S.X, S.P, S.u);
                const px = V.sub(S.X, S.P);
                h += R`<div style="margin:2px 0">$X=` + col(S.X) + R`,\quad ` + gTex('g', S.P, S.u, 'r') + '$</div>';
                h += R`<div style="margin:6px 0">$d=\frac{|\overrightarrow{PX}\times\vec{u}|}{|\vec{u}|}=\frac{` +
                    T.num(V.len(V.cross(px, S.u)), 3) + '}{' + T.num(V.len(S.u), 3) + '}=' + T.num(d, 4) + '$</div>';
                h += R`<div style="margin:6px 0;color:` + COL.green + '">$F=' + col(f.point) + R`\;\;(r=` + T.num(f.t, 2) + ')$</div>';
                h += `<div class="v-hud-note">Probe: $\\overrightarrow{XF}\\cdot\\vec{u}=${num(V.dot(V.sub(f.point, S.X), S.u), 6)}$ — der Lotfußpunkt sitzt genau dann richtig, wenn das null ist.</div>`;
            } else if (S.mode === 'pe') {
                if (V.isZero(S.n)) return ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Der Normalenvektor darf nicht null sein.</div>`);
                const d = G.distPointPlane(S.X, S.n, S.d);
                const f = G.footOnPlane(S.X, S.n, S.d);
                h += R`<div style="margin:2px 0">$X=` + col(S.X) + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">Ebene</span><span class="v-hud-val">${G.coordText(S.n, S.d, 0)}</span></div>`;
                h += R`<div style="margin:6px 0">$d=\frac{|\vec{n}\circ\vec{x}-d|}{|\vec{n}|}=\frac{|` +
                    T.num(V.dot(S.n, S.X), 2) + '-' + T.num(S.d, 2) + '|}{' + T.num(V.len(S.n), 3) + '}=' + T.num(d, 4) + '$</div>';
                h += R`<div style="margin:6px 0;color:` + COL.green + '">$F=' + col(f.point) + '$</div>';
                h += `<div class="v-hud-note">Der Lotfußpunkt entsteht, indem man von $X$ aus ${num(f.k, 3)}·n abzieht.</div>`;
            } else if (S.mode === 'gg') {
                if (V.isZero(S.u) || V.isZero(S.v)) return ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Beide Richtungsvektoren müssen ungleich null sein.</div>`);
                const r = G.lineLine(S.P, S.u, S.Q, S.v);
                h += R`<div style="margin:2px 0">$` + gTex('g', S.P, S.u, 'r') + '$</div>';
                h += R`<div style="margin:5px 0">$` + gTex('h', S.Q, S.v, 's') + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">Lage</span><span class="v-hud-val">${r.kind}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Abstand</span><span class="v-hud-val" style="color:${COL.green}">${num(r.dist || 0, 4)}</span></div>`;
                if (r.kind === 'windschief') {
                    const cr = V.cross(S.u, S.v);
                    h += R`<div style="margin:6px 0">$d=\frac{|(\vec{u}\times\vec{v})\circ\overrightarrow{PQ}|}{|\vec{u}\times\vec{v}|}=\frac{` +
                        T.num(Math.abs(V.dot(cr, V.sub(S.Q, S.P))), 3) + '}{' + T.num(V.len(cr), 3) + '}=' + T.num(r.dist, 4) + '$</div>';
                    h += `<div class="v-hud-note">Die rote Strecke ist das <b>gemeinsame Lot</b> — sie steht auf beiden Geraden senkrecht.</div>`;
                } else if (r.kind === 'parallel') {
                    h += `<div class="v-hud-note">Parallel — also einfach den Punkt Q nehmen und seinen Abstand zu g rechnen.</div>`;
                } else {
                    h += `<div class="v-hud-note">Die Geraden treffen sich, der Abstand ist null.</div>`;
                }
            } else {
                if (V.isZero(S.n) || V.isZero(S.n2)) return ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Beide Normalenvektoren müssen ungleich null sein.</div>`);
                const r = G.planePlane(S.n, S.d, S.n2, S.d2);
                h += `<div class="v-hud-row"><span class="v-hud-lab">Ebene E₁</span><span class="v-hud-val">${G.coordText(S.n, S.d, 0)}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Ebene E₂</span><span class="v-hud-val">${G.coordText(S.n2, S.d2, 0)}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Lage</span><span class="v-hud-val">${r.kind}</span></div>`;
                if (r.kind === 'parallel') {
                    const p2 = G.nicePoints(S.n2, S.d2);
                    h += `<div class="v-hud-row"><span class="v-hud-lab">Abstand</span><span class="v-hud-val" style="color:${COL.green}">${num(G.distPointPlane(p2.A, S.n, S.d), 4)}</span></div>`;
                    h += `<div class="v-hud-note">Ein Punkt von E₂ genügt — damit ist es wieder Punkt und Ebene.</div>`;
                } else {
                    h += `<div class="v-hud-note">${r.kind === 'identisch' ? 'Dieselbe Ebene — Abstand 0.' : 'Die Ebenen schneiden sich, der Abstand ist 0. Für eine Abstandsfrage müssen sie parallel sein.'}</div>`;
                }
            }
            ctx.hud(h);
        },

        draw(st) {
            const S = S10;
            if (S.mode === 'pg') {
                if (V.isZero(S.u)) return;
                const f = G.footOnLine(S.X, S.P, S.u);
                st.ray3(S.P, S.u, COL.orange, { alpha: 0.85 });
                st.point3(S.P, COL.orange, 'P', 0.12);
                st.arrow3(S.P, V.add(S.P, S.u), COL.orange, 'u');
                st.point3(S.X, COL.purple, 'X', 0.15);
                st.line3(S.X, f.point, COL.red, { dash: true });
                st.point3(f.point, COL.green, 'F', 0.13);
                rightAngle3(st, f.point, S.X, S.u, COL.red);
            } else if (S.mode === 'pe') {
                if (V.isZero(S.n)) return;
                drawPlane(st, S.n, S.d, COL.blue, 4);
                const f = G.footOnPlane(S.X, S.n, S.d);
                st.point3(S.X, COL.purple, 'X', 0.15);
                st.line3(S.X, f.point, COL.red, { dash: true });
                st.point3(f.point, COL.green, 'F', 0.13);
            } else if (S.mode === 'gg') {
                if (V.isZero(S.u) || V.isZero(S.v)) return;
                st.ray3(S.P, S.u, COL.orange, { alpha: 0.85 });
                st.ray3(S.Q, S.v, COL.blue, { alpha: 0.85 });
                st.point3(S.P, COL.orange, 'P', 0.12);
                st.point3(S.Q, COL.blue, 'Q', 0.12);
                const r = G.lineLine(S.P, S.u, S.Q, S.v);
                if (r.kind === 'windschief') {
                    st.line3(r.footG, r.footH, COL.red, { dash: true });
                    st.point3(r.footG, COL.green, null, 0.11);
                    st.point3(r.footH, COL.green, null, 0.11);
                    rightAngle3(st, r.footG, r.footH, S.u, COL.red);
                } else if (r.kind === 'parallel') {
                    const f = G.footOnLine(S.Q, S.P, S.u);
                    st.line3(S.Q, f.point, COL.red, { dash: true });
                    st.point3(f.point, COL.green, 'F', 0.11);
                    rightAngle3(st, f.point, S.Q, S.u, COL.red);
                } else if (r.kind === 'schneidend') {
                    st.point3(r.point, COL.green, 'S', 0.18);
                }
            } else {
                const p1 = drawPlane(st, S.n, S.d, COL.blue, 3.6);
                const p2 = drawPlane(st, S.n2, S.d2, COL.green, 3.6);
                if (p1 && p2 && G.planePlane(S.n, S.d, S.n2, S.d2).kind === 'parallel') {
                    const A = planeCentre(S.n2, S.d2);
                    const f = G.footOnPlane(A, S.n, S.d);
                    st.line3(A, f.point, COL.red, { dash: true });
                    st.point3(A, COL.green, null, 0.12);
                    st.point3(f.point, COL.blue, null, 0.12);
                }
            }
        },
    });

    // ==================================================================
    // 11 — Anwendungen
    // ==================================================================
    const S11 = {
        job: 'spiegelE',
        X: [2, 1, 4],
        n: [1, 1, 1], d: 3,
        P: [0, 0, 1], u: [1, 1, 0],
        A: [0, 0, 0], B: [4, 0, 0], C: [0, 4, 0], D: [1, 1, 4],
    };
    const JOBS = {
        spiegelE: 'Punkt an einer Ebene spiegeln',
        spiegelG: 'Punkt an einer Geraden spiegeln',
        lot: 'Lotfußpunkt und Lotgerade',
        koerper: 'Pyramide: Volumen und Oberfläche',
    };

    VekLab.register({
        id: 'anwendung',
        build(ctx) {
            const c = ctx.sidebar;
            const upd = () => { ctx.redraw(); this.hud(ctx); };
            CyberUI.createCard(c, 'Aufgabentyp', '<div id="v11-job"></div>', COL.orange);
            CyberUI.createDropdown('v11-job', Object.keys(JOBS).map(id => ({ id, label: JOBS[id] })),
                id => { S11.job = id; this.showCards(); upd(); }, S11.job);
            CyberUI.createCard(c, 'Punkt X', '<div id="v11-x"></div>', COL.purple);
            vecSliders('v11-x', 'X', () => S11.X, v => S11.X = v, upd, COL.purple);
            CyberUI.createCard(c, 'Ebene E', '<div id="v11-e"></div>', COL.blue);
            vecSliders('v11-e', 'n', () => S11.n, v => S11.n = v, upd, COL.blue, -4, 4, 1);
            VekLab.slider('v11-e', 'd', -6, 6, S11.d, 1, x => { S11.d = +x; upd(); }, COL.blue, x => num(+x, 0));
            CyberUI.createCard(c, 'Gerade g', '<div id="v11-g"></div>', COL.orange);
            vecSliders('v11-g', 'P', () => S11.P, v => S11.P = v, upd, COL.orange, -4, 4, 1);
            vecSliders('v11-g', 'u', () => S11.u, v => S11.u = v, upd, COL.orange, -4, 4, 1);
            CyberUI.createCard(c, 'Spitze D', '<div id="v11-d"></div>', COL.green);
            vecSliders('v11-d', 'D', () => S11.D, v => S11.D = v, upd, COL.green, -5, 6, 1);

            // [X, E, g, D] per job
            const NEEDS = { spiegelE: [1, 1, 0, 0], spiegelG: [1, 0, 1, 0], lot: [1, 1, 0, 0], koerper: [0, 0, 0, 1] };
            this.showCards = () => {
                const cards = document.querySelectorAll('#sb-anwendung .instrument-card');
                const need = NEEDS[S11.job];
                for (let i = 0; i < need.length; i++) if (cards[i + 1]) cards[i + 1].style.display = need[i] ? '' : 'none';
            };
            this.showCards();

            ctx.theory(R`
<p>Ab hier wird nichts Neues mehr gelernt — es wird kombiniert. Fast jede Prüfungsaufgabe ist eine Kette aus den Kapiteln 1 bis 10. Die drei Ketten, die am häufigsten drankommen:</p>
<div class="v-key"><b>Lotfußpunkt auf einer Ebene</b>
<ol style="margin:6px 0 0;padding-left:18px">
<li>Lotgerade aufstellen: $\;\ell:\;\vec{x}=\vec{X}+r\cdot\vec{n}\;$ — der Normalenvektor ist die Richtung!</li>
<li>$\ell$ in die Koordinatenform von $E$ einsetzen und nach $r$ auflösen</li>
<li>$r$ zurück in $\ell$ einsetzen — das ist der Lotfußpunkt $F$</li>
</ol></div>
<div class="v-key"><b>Spiegelung an einer Ebene</b> — Lotfußpunkt bestimmen, dann doppelt so weit gehen: $$\vec{X'}=\vec{X}+2\cdot\overrightarrow{XF}=2\vec{F}-\vec{X}$$ $F$ ist der Mittelpunkt von $X$ und $X'$ — das ist die ganze Idee.</div>
<div class="v-key"><b>Spiegelung an einer Geraden</b> — dieselbe Kette, nur mit dem Lotfußpunkt auf der Geraden: Ansatz $F=\vec p+r\vec u$, Bedingung $\overrightarrow{XF}\circ\vec{u}=0$, dann wieder $\vec{X'}=2\vec{F}-\vec{X}$.</div>
<div class="v-aha"><b>Ein Bauplan für beide:</b> Lot fällen, Fußpunkt bestimmen, verdoppeln. Ob Ebene oder Gerade ändert nur, <i>wie</i> man den Fußpunkt bekommt — bei der Ebene durch Einsetzen, bei der Geraden durch die Orthogonalitätsbedingung.</div>
<p><b>Körper.</b> Für eine <b>Pyramide</b> mit dreieckiger Grundfläche gilt</p>
<div class="v-key">$$V=\tfrac{1}{6}\,\bigl|(\overrightarrow{AB}\times\overrightarrow{AC})\circ\overrightarrow{AD}\bigr| \qquad\text{und}\qquad h=\frac{3V}{A_{\text{Grund}}}$$</div>
<p>Die Oberfläche ist die Summe der vier Dreiecksflächen, jede als halber Betrag eines Kreuzprodukts. Alles, was du dafür brauchst, steht in Kapitel 9.</p>
<div class="v-warn">Bei Spiegelungen immer die <b>Probe</b> machen: der Mittelpunkt von $X$ und $X'$ muss in der Ebene liegen (bzw. auf der Geraden), und $\overrightarrow{XX'}$ muss parallel zu $\vec n$ sein.</div>`);

            ctx.tasks([
                {
                    q: R`Spiegle $P(4/1/3)$ an der Ebene $E:\;2x-y+2z=6$.`,
                    hint: R`Erst die Lotgerade mit Richtung $\vec n$, dann einsetzen, dann verdoppeln.`,
                    sol: R`<span class="v-step">1 — Lotgerade</span>
$$\ell:\;\vec{x}=\begin{pmatrix}4\\1\\3\end{pmatrix}+r\begin{pmatrix}2\\-1\\2\end{pmatrix}$$
<span class="v-step">2 — in E einsetzen</span>
$$2(4+2t)-(1-r)+2(3+2t)=6$$
$$8+4t-1+r+6+4t=6\;\Longrightarrow\;13+9t=6\;\Longrightarrow\;r=-\tfrac{7}{9}$$
<span class="v-step">3 — Lotfußpunkt</span>
$$F=\begin{pmatrix}4\\1\\3\end{pmatrix}-\tfrac{7}{9}\begin{pmatrix}2\\-1\\2\end{pmatrix}=\begin{pmatrix}\tfrac{22}{9}\\\tfrac{16}{9}\\\tfrac{13}{9}\end{pmatrix}$$
<span class="v-step">4 — verdoppeln</span>
$$\vec{P'}=2\vec{F}-\vec{P}=\begin{pmatrix}\tfrac{44}{9}-4\\\tfrac{32}{9}-1\\\tfrac{26}{9}-3\end{pmatrix}=\begin{pmatrix}\tfrac{8}{9}\\\tfrac{23}{9}\\-\tfrac{1}{9}\end{pmatrix}$$
<p class="v-res">$P'\left(\tfrac{8}{9}/\tfrac{23}{9}/-\tfrac{1}{9}\right)$</p>
<span class="v-step">Probe</span>
<p>$F$ in $E$: $2\cdot\tfrac{22}{9}-\tfrac{16}{9}+2\cdot\tfrac{13}{9}=\tfrac{44-16+26}{9}=\tfrac{54}{9}=6$ ✓</p>`
                },
                {
                    q: R`Bestimme den Lotfußpunkt von $X(1/5/2)$ auf $g:\;\vec{x}=\begin{pmatrix}1\\1\\0\end{pmatrix}+r\begin{pmatrix}0\\2\\1\end{pmatrix}$ und daraus den Abstand.`,
                    sol: R`<span class="v-step">Ansatz für den Fußpunkt</span>
$$F=\begin{pmatrix}1\\1+2t\\t\end{pmatrix},\qquad \overrightarrow{XF}=\begin{pmatrix}0\\2t-4\\t-2\end{pmatrix}$$
<span class="v-step">Orthogonalitätsbedingung</span>
$$\overrightarrow{XF}\circ\vec{u}=0:\quad 2(2t-4)+1(r-2)=0\;\Longrightarrow\;5t-10=0\;\Longrightarrow\;r=2$$
<span class="v-step">Fußpunkt und Abstand</span>
$$F(1/5/2),\qquad \overrightarrow{XF}=\begin{pmatrix}0\\0\\0\end{pmatrix}$$
<p class="v-res">$F=X$ — der Punkt $X$ liegt <b>selbst auf der Geraden</b>, der Abstand ist $0$.</p>
<div class="v-aha">Probe: $1+2\cdot2=5$ ✓ und $r=2$ ✓. Wenn beim Lotfußpunkt der Nullvektor herauskommt, ist das kein Fehler — es ist die Antwort.</div>`
                },
                {
                    q: R`Spiegle $Q(3/0/1)$ an der Geraden $g:\;\vec{x}=\begin{pmatrix}0\\0\\0\end{pmatrix}+r\begin{pmatrix}1\\1\\0\end{pmatrix}$.`,
                    sol: R`<span class="v-step">Lotfußpunkt ansetzen</span>
$$F=\begin{pmatrix}r\\t\\0\end{pmatrix},\qquad \overrightarrow{QF}=\begin{pmatrix}r-3\\t\\-1\end{pmatrix}$$
<span class="v-step">Senkrecht zur Richtung</span>
$$(r-3)+r=0\;\Longrightarrow\;2t=3\;\Longrightarrow\;r=1{,}5$$
$$F(1{,}5/1{,}5/0)$$
<span class="v-step">Verdoppeln</span>
$$\vec{Q'}=2\vec{F}-\vec{Q}=\begin{pmatrix}3\\3\\0\end{pmatrix}-\begin{pmatrix}3\\0\\1\end{pmatrix}=\begin{pmatrix}0\\3\\-1\end{pmatrix}$$
<p class="v-res">$Q'(0/3/-1)$</p>
<span class="v-step">Probe</span>
<p>Abstand von $Q$ zu $F$: $\sqrt{2{,}25+2{,}25+1}=\sqrt{5{,}5}$. Von $Q'$ zu $F$: $\sqrt{2{,}25+2{,}25+1}=\sqrt{5{,}5}$ ✓ — gleich weit, wie es sein muss.</p>`
                },
                {
                    q: R`Berechne Volumen und Höhe der Pyramide $A(0/0/0)$, $B(4/0/0)$, $C(0/4/0)$, $D(1/1/4)$.`,
                    sol: R`<span class="v-step">Kantenvektoren</span>
$$\overrightarrow{AB}=\begin{pmatrix}4\\0\\0\end{pmatrix},\;\overrightarrow{AC}=\begin{pmatrix}0\\4\\0\end{pmatrix},\;\overrightarrow{AD}=\begin{pmatrix}1\\1\\4\end{pmatrix}$$
<span class="v-step">Grundfläche</span>
$$\overrightarrow{AB}\times\overrightarrow{AC}=\begin{pmatrix}0\\0\\16\end{pmatrix},\qquad A_{\text{Grund}}=\tfrac12\cdot 16=8$$
<span class="v-step">Volumen über das Spatprodukt</span>
$$V=\tfrac16\left|\begin{pmatrix}0\\0\\16\end{pmatrix}\circ\begin{pmatrix}1\\1\\4\end{pmatrix}\right|=\tfrac16\cdot 64=\tfrac{32}{3}\approx 10{,}67$$
<span class="v-step">Höhe</span>
$$h=\frac{3V}{A_{\text{Grund}}}=\frac{3\cdot\tfrac{32}{3}}{8}=\frac{32}{8}=4$$
<p class="v-res">$V=\tfrac{32}{3}\approx 10{,}67$ und $h=4$.</p>
<p>Die Höhe $4$ war hier ablesbar — die Grundfläche liegt in der $xy$‑Ebene und $D$ hat die $z$‑Koordinate $4$. Schöne Kontrolle für die Formel.</p>`
                },
                {
                    q: R`Ein Lichtstrahl läuft längs $g:\;\vec{x}=\begin{pmatrix}0\\0\\6\end{pmatrix}+r\begin{pmatrix}1\\2\\-3\end{pmatrix}$ und trifft den Boden $E:\;z=0$. Wo trifft er auf, und unter welchem Winkel?`,
                    sol: R`<span class="v-step">Auftreffpunkt</span>
$$6-3t=0\;\Longrightarrow\;r=2\;\Longrightarrow\;S(2/4/0)$$
<span class="v-step">Winkel zur Ebene — Sinusformel</span>
$$\vec{n}=\begin{pmatrix}0\\0\\1\end{pmatrix},\qquad \sin\varphi=\frac{|-3|}{\sqrt{1+4+9}\cdot 1}=\frac{3}{\sqrt{14}}\approx 0{,}8018$$
<p class="v-res">Auftreffpunkt $S(2/4/0)$, Einfallswinkel zur Ebene $\varphi\approx 53{,}3°$.</p>
<div class="v-warn">In der Physik misst man den Einfallswinkel meist <b>zum Lot</b>, also zur Normalen — das wären hier $90°-53{,}3°=36{,}7°$. Immer dazuschreiben, worauf sich der Winkel bezieht.</div>`
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
            const S = S11;
            let h = '';
            if (S.job === 'spiegelE' || S.job === 'lot') {
                if (V.isZero(S.n)) return ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Der Normalenvektor darf nicht null sein.</div>`);
                const f = G.footOnPlane(S.X, S.n, S.d);
                const t = -(V.dot(S.n, S.X) - S.d) / V.len2(S.n);
                h += R`<div style="margin:2px 0">$X=` + col(S.X) + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">Ebene</span><span class="v-hud-val">${G.coordText(S.n, S.d, 0)}</span></div>`;
                h += R`<div style="margin:6px 0">$\ell:\;\vec{x}=` + col(S.X) + R`+r\cdot` + col(S.n) + R`\;\;\Rightarrow\;\;r=` + T.frac(t) + '$</div>';
                h += R`<div style="margin:6px 0;color:` + COL.green + '">$F=' + col(f.point) + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">Abstand</span><span class="v-hud-val">${num(G.distPointPlane(S.X, S.n, S.d), 4)}</span></div>`;
                if (S.job === 'spiegelE') {
                    const X2 = G.mirrorInPlane(S.X, S.n, S.d);
                    h += R`<div style="margin:6px 0;color:` + COL.red + R`">$\vec{X'}=2\vec{F}-\vec{X}=` + col(X2) + '$</div>';
                    h += `<div class="v-hud-note">Probe: F liegt in E (${num(V.dot(S.n, f.point), 3)} = ${num(S.d, 3)}) und ist der Mittelpunkt von X und X′.</div>`;
                } else {
                    h += `<div class="v-hud-note">Die Lotgerade hat den <b>Normalenvektor als Richtung</b> — das ist der ganze Trick.</div>`;
                }
            } else if (S.job === 'spiegelG') {
                if (V.isZero(S.u)) return ctx.hud(`<div class="v-hud-note" style="color:${COL.red}">Der Richtungsvektor darf nicht null sein.</div>`);
                const f = G.footOnLine(S.X, S.P, S.u);
                const X2 = G.mirrorInLine(S.X, S.P, S.u);
                h += R`<div style="margin:2px 0">$X=` + col(S.X) + R`,\quad ` + gTex('g', S.P, S.u, 'r') + '$</div>';
                h += R`<div style="margin:6px 0">$\overrightarrow{XF}\circ\vec{u}=0\;\Rightarrow\;r=` + T.frac(f.t) + '$</div>';
                h += R`<div style="margin:6px 0;color:` + COL.green + '">$F=' + col(f.point) + '$</div>';
                h += R`<div style="margin:6px 0;color:` + COL.red + R`">$\vec{X'}=2\vec{F}-\vec{X}=` + col(X2) + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">|XF| = |X′F|</span><span class="v-hud-val">${num(V.dist(S.X, f.point), 4)} = ${num(V.dist(X2, f.point), 4)}</span></div>`;
                h += `<div class="v-hud-note">Beide Abstände müssen gleich sein — das ist die Probe.</div>`;
            } else {
                const { A, B, C, D } = S;
                const ab = V.sub(B, A), ac = V.sub(C, A), ad = V.sub(D, A);
                const base = G.areaTriangle(ab, ac);
                const vol = Math.abs(G.spat(ab, ac, ad)) / 6;
                const faces = [
                    G.areaTriangle(ab, ac),
                    G.areaTriangle(ab, ad),
                    G.areaTriangle(ac, ad),
                    G.areaTriangle(V.sub(C, B), V.sub(D, B)),
                ];
                const surf = faces.reduce((s, x) => s + x, 0);
                h += `<div class="v-hud-row"><span class="v-hud-lab">Spitze D</span><span class="v-hud-val">D(${D.map(x => num(x)).join('/')})</span></div>`;
                h += R`<div style="margin:6px 0">$V=\tfrac16\left|(\overrightarrow{AB}\times\overrightarrow{AC})\circ\overrightarrow{AD}\right|=` + T.num(vol, 3) + '$</div>';
                h += `<div class="v-hud-row"><span class="v-hud-lab">Grundfläche ABC</span><span class="v-hud-val">${num(base, 3)}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Höhe h = 3V / A</span><span class="v-hud-val" style="color:${COL.green}">${num(base > 1e-9 ? 3 * vol / base : NaN, 3)}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Oberfläche</span><span class="v-hud-val">${num(surf, 3)}</span></div>`;
                h += `<div class="v-hud-note">${vol < 1e-9
                    ? 'Volumen null — D liegt in der Grundebene, der Körper ist platt.'
                    : 'Alle vier Seitenflächen als halbe Kreuzprodukt-Beträge, aufsummiert.'}</div>`;
            }
            ctx.hud(h);
        },

        draw(st) {
            const S = S11;
            if (S.job === 'spiegelE' || S.job === 'lot') {
                if (V.isZero(S.n)) return;
                drawPlane(st, S.n, S.d, COL.blue, 4);
                const f = G.footOnPlane(S.X, S.n, S.d);
                st.ray3(S.X, S.n, COL.orange, { alpha: 0.35, dash: true });
                st.point3(S.X, COL.purple, 'X', 0.15);
                st.line3(S.X, f.point, COL.red, {});
                st.point3(f.point, COL.green, 'F', 0.13);
                if (S.job === 'spiegelE') {
                    const X2 = G.mirrorInPlane(S.X, S.n, S.d);
                    st.line3(f.point, X2, COL.red, { dash: true });
                    st.point3(X2, COL.red, 'X′', 0.15);
                }
            } else if (S.job === 'spiegelG') {
                if (V.isZero(S.u)) return;
                st.ray3(S.P, S.u, COL.orange, { alpha: 0.85 });
                st.point3(S.P, COL.orange, 'P', 0.12);
                const f = G.footOnLine(S.X, S.P, S.u);
                const X2 = G.mirrorInLine(S.X, S.P, S.u);
                st.point3(S.X, COL.purple, 'X', 0.15);
                st.line3(S.X, f.point, COL.red, {});
                st.line3(f.point, X2, COL.red, { dash: true });
                st.point3(f.point, COL.green, 'F', 0.13);
                st.point3(X2, COL.red, 'X′', 0.15);
                rightAngle3(st, f.point, S.X, S.u, COL.red);
            } else {
                const { A, B, C, D } = S;
                st.poly3([A, B, C], COL.blue, { alpha: 0.25 });
                st.poly3([A, B, D], COL.green, { alpha: 0.18 });
                st.poly3([B, C, D], COL.orange, { alpha: 0.18 });
                st.poly3([A, C, D], COL.purple, { alpha: 0.18 });
                [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([n, p]) => st.point3(p, COL.grey, n, 0.13));
                // the height, dropped from D onto the base plane
                const nb = V.cross(V.sub(B, A), V.sub(C, A));
                if (!V.isZero(nb)) {
                    const f = G.footOnPlane(D, nb, V.dot(nb, A));
                    st.line3(D, f.point, COL.red, { dash: true });
                    st.point3(f.point, COL.red, null, 0.1);
                }
            }
        },
    });
})();
