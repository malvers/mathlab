/* trigonometrie-mod-saetze.js — chapter 10 of the Trigonometrie lab:
 * general triangles — law of sines (with the height and the circumcircle),
 * law of cosines (Pythagoras as the special case), area ½ab·sin γ and the
 * ambiguous case SSW, where one set of data gives two triangles.
 */
(function () {
    'use strict';
    const L = window.TrigLab;
    const { COL, V, num, Tex, C, PI, rad, deg } = L;
    const R = String.raw;
    const FONT = "700 13px 'Orbitron', sans-serif";
    const SMALL = "600 11px 'Orbitron', sans-serif";
    // vertex / side colours: a orange, b blue, c pink — side and opposite angle share a colour
    const K = { a: C.sin, b: C.cos, c: C.tan };

    const row = (lab, val) => `<div class="v-hud-row"><span class="v-hud-lab">${lab}</span><span class="v-hud-val">${val}</span></div>`;
    const line = (tex, color) => `<div style="margin:5px 0${color ? ';color:' + color : ''}">$${tex}$</div>`;
    const n2 = x => Tex.num(x, 2);

    const S10 = { A: [0, 0], B: [7, 0], C: [2.5, 4], mode: 'sin', circ: false, height: true, alpha: rad(30), b: 6, a: 3.6 };

    /** Sides and angles of the triangle ABC. */
    function measure(A, B, Cc) {
        const a = V.dist(B, Cc), b = V.dist(Cc, A), c = V.dist(A, B);
        return { a, b, c, al: rad(V.angle(V.sub(B, A), V.sub(Cc, A))), be: rad(V.angle(V.sub(A, B), V.sub(Cc, B))), ga: rad(V.angle(V.sub(A, Cc), V.sub(B, Cc))) };
    }
    /** Circumcentre of three points (null if they are collinear). */
    function circumcentre(A, B, Cc) {
        const d = 2 * (A[0] * (B[1] - Cc[1]) + B[0] * (Cc[1] - A[1]) + Cc[0] * (A[1] - B[1]));
        if (Math.abs(d) < 1e-9) return null;
        const s = p => p[0] * p[0] + p[1] * p[1];
        return [(s(A) * (B[1] - Cc[1]) + s(B) * (Cc[1] - A[1]) + s(Cc) * (A[1] - B[1])) / d,
        (s(A) * (Cc[0] - B[0]) + s(B) * (A[0] - Cc[0]) + s(Cc) * (B[0] - A[0])) / d];
    }
    /** Foot of the perpendicular from p onto the line through u and v. */
    function foot(p, u, v) {
        const d = V.sub(v, u), t = V.dot(V.sub(p, u), d) / V.dot(d, d);
        return V.add(u, V.scale(d, t));
    }

    /** SSW: B on the ray from A (direction 0°) with |BC| = a. Returns 0, 1 or 2 points. */
    function sswPoints() {
        const Cc = [S10.b * Math.cos(S10.alpha), S10.b * Math.sin(S10.alpha)];
        const disc = S10.a * S10.a - Cc[1] * Cc[1];
        if (disc < -1e-9) return { Cc, Bs: [] };
        const r = Math.sqrt(Math.max(0, disc));
        const xs = r < 1e-6 ? [Cc[0]] : [Cc[0] + r, Cc[0] - r];
        return { Cc, Bs: xs.filter(x => x > 1e-6).map(x => [x, 0]) };
    }

    L.register({
        id: 'saetze',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Satz', '<div id="t10-m"></div>', COL.orange);
            CyberUI.createDropdown('t10-m', [
                { id: 'sin', label: 'Sinussatz' },
                { id: 'cos', label: 'Kosinussatz' },
                { id: 'area', label: 'Flächeninhalt ½ab·sin γ' },
                { id: 'ssw', label: 'Zwei Lösungen? (SSW)' },
            ], id => { S10.mode = id; this.showCards(); this.onShow(ctx); }, S10.mode);

            CyberUI.createCard(c, 'Anzeigen', '<div id="t10-o"></div>', COL.orange);
            CyberUI.createCheckbox('t10-o', 'Höhe (Herleitung)', S10.height, v => { S10.height = v; ctx.redraw(); }, COL.purple);
            CyberUI.createCheckbox('t10-o', 'Umkreis (Sinussatz = 2r)', S10.circ, v => { S10.circ = v; ctx.redraw(); this.hud(ctx); }, COL.green);
            L.buttons('t10-o', [
                { label: 'rechtwinklig', run: () => { S10.A = [0, 0]; S10.B = [6, 0]; S10.C = [6, 4.5]; this.frame(ctx); } },
                { label: 'stumpf', run: () => { S10.A = [0, 0]; S10.B = [7, 0]; S10.C = [-1.5, 3]; this.frame(ctx); } },
                { label: 'zurück', run: () => { S10.A = [0, 0]; S10.B = [7, 0]; S10.C = [2.5, 4]; this.frame(ctx); } },
            ]);

            CyberUI.createCard(c, 'SSW: gegeben α, b, a', '<div id="t10-s"></div>', COL.purple);
            this.aSlider = L.slider('t10-s', 'a  (gegenüber α)', 0.5, 9, S10.a, 0.1, v => { S10.a = +v; ctx.redraw(); this.hud(ctx); }, K.a, v => num(+v, 1));
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh die Ecken A, B, C. Im SSW-Modus: zieh C (ändert α und b) und stell a am Regler ein.</div>', COL.blue);

            this.showCards = () => {
                const cards = document.querySelectorAll('#sb-saetze .instrument-card');
                const ssw = S10.mode === 'ssw';
                if (cards[1]) cards[1].style.display = ssw ? 'none' : '';
                if (cards[2]) cards[2].style.display = ssw ? '' : 'none';
            };
            this.showCards();

            ctx.theory(R`
<p>Im <b>allgemeinen</b> Dreieck gibt es keinen rechten Winkel, also auch keine Hypotenuse. Die Bezeichnung: Die Seite $a$ liegt der Ecke $A$ (dem Winkel $\alpha$) gegenüber, $b$ gegenüber $B$, $c$ gegenüber $C$ — auf der Bühne in derselben Farbe.</p>
<p class="v-sub">Sinussatz</p>
<div class="v-key">$$\frac{a}{\sin\alpha}=\frac{b}{\sin\beta}=\frac{c}{\sin\gamma}$$ Jede Seite durch den Sinus ihres Gegenwinkels ergibt dasselbe — nämlich $2r$, den Durchmesser des Umkreises.</div>
<p><b>Herleitung über die Höhe:</b> Die Höhe $h_c$ teilt das Dreieck in zwei rechtwinklige. Links ist $h_c=b\cdot\sin\alpha$, rechts $h_c=a\cdot\sin\beta$. Gleichsetzen und umstellen gibt $\tfrac{a}{\sin\alpha}=\tfrac{b}{\sin\beta}$. Mit <i>Umkreis</i> siehst du: Der gemeinsame Wert ist der Durchmesser $2r$.</p>
<p class="v-sub">Kosinussatz</p>
<div class="v-key">$$c^2=a^2+b^2-2ab\cdot\cos\gamma$$ (ebenso $a^2=b^2+c^2-2bc\cos\alpha$ und $b^2=a^2+c^2-2ac\cos\beta$)</div>
<p>Bei $\gamma=90^\circ$ ist $\cos\gamma=0$ — übrig bleibt <b>Pythagoras</b>. Der Zusatzterm korrigiert, wenn der Winkel spitz ($c$ kürzer) oder stumpf ($c$ länger) ist.</p>
<p class="v-sub">Flächeninhalt</p>
<div class="v-key">$$A=\tfrac12\,a\,b\cdot\sin\gamma$$ Zwei Seiten und der Winkel dazwischen reichen — die Höhe ist $b\cdot\sin\gamma$.</div>
<p class="v-sub">Welcher Satz wann?</p>
<div class="v-table-wrap"><table class="v-table">
<tr><th>gegeben</th><th>Weg</th></tr>
<tr><td>SSS</td><td>Kosinussatz → Winkel</td></tr>
<tr><td>SWS</td><td>Kosinussatz → dritte Seite</td></tr>
<tr><td>WSW, SWW</td><td>Winkelsumme, dann Sinussatz</td></tr>
<tr><td>SsW</td><td>Sinussatz — eindeutig, wenn der Winkel der <b>größeren</b> Seite gegenüberliegt</td></tr>
<tr><td>SSW</td><td>Sinussatz — <b>0, 1 oder 2</b> Dreiecke möglich</td></tr>
</table></div>
<div class="v-warn"><b>Falle im Sinussatz:</b> $\sin^{-1}$ liefert nur spitze Winkel. Wegen $\sin\beta=\sin(180^\circ-\beta)$ kann auch der stumpfe Winkel $180^\circ-\beta$ passen. Stell <i>Zwei Lösungen? (SSW)</i> ein und zieh am Regler $a$: Der Kreis um $C$ trifft den Strahl zweimal, einmal oder gar nicht.</div>`);

            ctx.tasks([
                {
                    q: R`Gegeben: $a=7\,\text{cm}$, $\alpha=50^\circ$, $\beta=60^\circ$. Berechne $\gamma$, $b$ und $c$.`,
                    hint: R`Erst die Winkelsumme, dann zweimal Sinussatz mit dem bekannten Paar $a$, $\alpha$.`,
                    sol: R`<span class="v-step">Winkelsumme</span>$$\gamma=180^\circ-50^\circ-60^\circ=70^\circ$$
<span class="v-step">Sinussatz</span>$$b=\frac{a\cdot\sin\beta}{\sin\alpha}=\frac{7\cdot\sin 60^\circ}{\sin 50^\circ}\approx 7{,}91\,\text{cm}\qquad c=\frac{7\cdot\sin 70^\circ}{\sin 50^\circ}\approx 8{,}59\,\text{cm}$$`
                },
                {
                    q: R`Gegeben: $a=5$, $b=8$, $\gamma=60^\circ$. Berechne $c$.`,
                    sol: R`$$c^2=5^2+8^2-2\cdot 5\cdot 8\cdot\cos 60^\circ=25+64-40=49$$<p class="v-res">$c=7$</p>`
                },
                {
                    q: R`Ein Dreieck hat die Seiten $a=4$, $b=5$, $c=6$. Berechne alle Winkel.`,
                    hint: R`Kosinussatz nach $\cos\gamma$ umstellen: $\cos\gamma=\tfrac{a^2+b^2-c^2}{2ab}$.`,
                    sol: R`<span class="v-step">Größter Winkel zuerst (gegenüber der längsten Seite)</span>$$\cos\gamma=\frac{16+25-36}{2\cdot 4\cdot 5}=\frac{5}{40}=0{,}125\;\Rightarrow\;\gamma\approx 82{,}82^\circ$$
<span class="v-step">Zweiter Winkel</span>$$\cos\alpha=\frac{25+36-16}{2\cdot 5\cdot 6}=0{,}75\;\Rightarrow\;\alpha\approx 41{,}41^\circ$$
<span class="v-step">Winkelsumme</span>$$\beta\approx 180^\circ-82{,}82^\circ-41{,}41^\circ=55{,}77^\circ$$`
                },
                {
                    q: R`Berechne den Flächeninhalt des Dreiecks mit $a=5$, $b=8$ und $\gamma=60^\circ$.`,
                    sol: R`$$A=\tfrac12\cdot 5\cdot 8\cdot\sin 60^\circ=20\cdot\tfrac{\sqrt3}{2}=10\sqrt3\approx 17{,}32$$`
                },
                {
                    q: R`Gegeben: $\alpha=30^\circ$, $b=10$, $a=6$. Wie viele Dreiecke gibt es? Berechne $\beta$.`,
                    hint: R`$a$ liegt $\alpha$ gegenüber und ist kleiner als $b$ — Vorsicht, SSW.`,
                    sol: R`<span class="v-step">Sinussatz</span>$$\sin\beta=\frac{b\cdot\sin\alpha}{a}=\frac{10\cdot 0{,}5}{6}\approx 0{,}833$$
<span class="v-step">Zwei Kandidaten</span>$$\beta_1\approx 56{,}44^\circ\qquad \beta_2=180^\circ-\beta_1\approx 123{,}56^\circ$$
<p>Beide passen: $30^\circ+123{,}56^\circ<180^\circ$.</p><p class="v-res">Zwei Dreiecke, mit $\gamma_1\approx 93{,}56^\circ$ bzw. $\gamma_2\approx 26{,}44^\circ$. Im SSW-Modus im halben Maßstab nachstellen: $\alpha=30^\circ$, $b=5$, $a=3$.</p>`
                },
                {
                    q: R`Um die Breite eines Flusses zu bestimmen, misst man am Ufer die Standlinie $\overline{AB}=100\,\text{m}$. Zum Baum $C$ am anderen Ufer misst man $\alpha=70^\circ$ und $\beta=60^\circ$. Wie weit ist $C$ von $A$ entfernt?`,
                    sol: R`<span class="v-step">Winkelsumme</span>$$\gamma=50^\circ$$<span class="v-step">Sinussatz</span>$$b=\overline{AC}=\frac{100\cdot\sin 60^\circ}{\sin 50^\circ}\approx 113{,}1\,\text{m}$$
<p class="v-res">Die Flussbreite ist dann die Höhe: $b\cdot\sin 70^\circ\approx 106{,}2\,\text{m}$.</p>`
                },
            ]);
        },

        frame(ctx) {
            const st = ctx.stage2;
            if (S10.mode === 'ssw') {
                st.fitBox(-1, 10.5, -1.5, 6.5);
            } else {
                const pts = [S10.A, S10.B, S10.C];
                const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
                st.fitBox(Math.min(...xs) - 1.8, Math.max(...xs) + 1.8, Math.min(...ys) - 1.6, Math.max(...ys) + 1.4);
            }
            ctx.redraw(); this.hud(ctx);
        },
        onShow(ctx) {
            const st = ctx.stage2;
            st.xMode = 'num'; st.degLabels = false; st.xClip = null; st.names = ['x', 'y'];
            st.clearHandles();
            const snap = w => [Math.round(w[0] * 2) / 2, Math.round(w[1] * 2) / 2];
            if (S10.mode === 'ssw') {
                st.addHandle(() => [S10.b * Math.cos(S10.alpha), S10.b * Math.sin(S10.alpha)], w => {
                    const al = L.snapAngle(Math.atan2(w[1], w[0]));
                    S10.alpha = Math.max(rad(5), Math.min(rad(170), al));
                    S10.b = Math.max(1, Math.min(9, Math.round(Math.hypot(w[0], w[1]) * 10) / 10));
                }, K.b, 'C');
                ctx.tip('Ziehen: C  ·  Regler: a');
            } else {
                st.addHandle(() => S10.A, w => S10.A = snap(w), K.a, 'A');
                st.addHandle(() => S10.B, w => S10.B = snap(w), K.b, 'B');
                st.addHandle(() => S10.C, w => S10.C = snap(w), K.c, 'C');
                ctx.tip('Ziehen: A, B, C');
            }
            this.frame(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            if (S10.mode === 'ssw') {
                const { Bs } = sswPoints();
                const sb = S10.b * Math.sin(S10.alpha) / S10.a;
                let h = row('gegeben', `α = ${num(deg(S10.alpha), 0)}°, b = ${num(S10.b, 1)}, a = ${num(S10.a, 1)}`) +
                    line(R`\sin\beta=\frac{b\cdot\sin\alpha}{a}=\frac{${n2(S10.b)}\cdot\sin ${Tex.num(deg(S10.alpha), 0)}^\circ}{${n2(S10.a)}}${sb > 1 + 1e-9 ? '>1' : '\\approx ' + Tex.num(sb, 3)}`);
                if (!Bs.length) h += `<div class="v-hud-note"><b style="color:#ff7a6b">Kein Dreieck</b> — a ist zu kurz, der Kreis erreicht den Strahl nicht.</div>`;
                else {
                    Bs.forEach((B, i) => {
                        const m = measure([0, 0], B, [S10.b * Math.cos(S10.alpha), S10.b * Math.sin(S10.alpha)]);
                        h += line(R`\beta_${i + 1}\approx ${Tex.num(deg(m.be), 2)}^\circ,\;\gamma_${i + 1}\approx ${Tex.num(deg(m.ga), 2)}^\circ,\;c_${i + 1}\approx ${n2(m.c)}`, i ? COL.purple : COL.green);
                    });
                    h += `<div class="v-hud-note">${Bs.length === 2 ? '<b>Zwei Dreiecke</b> — der stumpfe Winkel β₂ = 180° − β₁ passt auch.' : '<b>Genau ein Dreieck.</b>'}</div>`;
                }
                ctx.hud(h);
                return;
            }
            const m = measure(S10.A, S10.B, S10.C);
            let h = row('Seiten', `a = ${num(m.a, 2)}, b = ${num(m.b, 2)}, c = ${num(m.c, 2)}`) +
                row('Winkel', `α = ${num(deg(m.al), 1)}°, β = ${num(deg(m.be), 1)}°, γ = ${num(deg(m.ga), 1)}°`);
            if (S10.mode === 'sin') {
                h += line(R`\frac{a}{\sin\alpha}=${n2(m.a / Math.sin(m.al))}`, K.a) +
                    line(R`\frac{b}{\sin\beta}=${n2(m.b / Math.sin(m.be))}`, K.b) +
                    line(R`\frac{c}{\sin\gamma}=${n2(m.c / Math.sin(m.ga))}`, K.c);
                if (S10.circ) { const O = circumcentre(S10.A, S10.B, S10.C); if (O) h += row('Umkreis', `2r = ${num(2 * V.dist(O, S10.A), 2)}`); }
            } else if (S10.mode === 'cos') {
                const rhs = m.a * m.a + m.b * m.b - 2 * m.a * m.b * Math.cos(m.ga);
                const right = Math.abs(deg(m.ga) - 90) < 0.05;
                h += line(R`c^2=${n2(m.c * m.c)}`, K.c) +
                    line(R`a^2+b^2-2ab\cos\gamma=${n2(m.a * m.a)}+${n2(m.b * m.b)}-${n2(2 * m.a * m.b)}\cdot${Tex.num(Math.cos(m.ga), 3)}=${n2(rhs)}`) +
                    `<div class="v-hud-note">${right ? '<b style="color:rgb(160,200,90)">γ = 90°: cos γ = 0 — das ist Pythagoras!</b>' : (m.ga > PI / 2 ? 'γ stumpf: cos γ &lt; 0, c ist länger als nach Pythagoras.' : 'γ spitz: cos γ &gt; 0, c ist kürzer als nach Pythagoras.')}</div>`;
            } else {
                const A = 0.5 * m.a * m.b * Math.sin(m.ga);
                h += line(R`A=\tfrac12\,a\,b\,\sin\gamma=\tfrac12\cdot ${n2(m.a)}\cdot ${n2(m.b)}\cdot ${Tex.num(Math.sin(m.ga), 3)}\approx ${n2(A)}`, COL.green) +
                    line(R`h_a=b\cdot\sin\gamma\approx ${n2(m.b * Math.sin(m.ga))}`, COL.purple);
            }
            ctx.hud(h);
        },

        draw(st) {
            if (S10.mode === 'ssw') return this.drawSsw(st);
            const { A, B } = S10, Cc = S10.C, m = measure(A, B, Cc);
            const G = V.scale(V.add(V.add(A, B), Cc), 1 / 3);
            st.polygon([A, B, Cc], COL.orange, null, { alpha: 0.07 });
            if (S10.circ) {
                const O = circumcentre(A, B, Cc);
                if (O) { st.circle(O, V.dist(O, A), COL.green, { width: 1.6, dash: [6, 5] }); st.dot(O, COL.green, 4); st.text('M', O, COL.green, { dy: -13, font: SMALL }); }
            }
            // height for the derivation: h_c for the law of sines, h_a for the area
            if (S10.height && S10.mode !== 'cos') {
                const [p, u, v] = S10.mode === 'area' ? [A, B, Cc] : [Cc, A, B];
                const F = foot(p, u, v);
                const t = V.dot(V.sub(F, u), V.sub(v, u)) / V.dot(V.sub(v, u), V.sub(v, u));
                if (t < 0 || t > 1) st.segment(t < 0 ? u : v, F, 'rgba(255,255,255,0.35)', { width: 1.2, dash: [3, 4] });
                st.segment(p, F, COL.purple, { width: 2, dash: [6, 4] });
                if (V.dist(p, F) > 0.3) st.rightAngle(F, V.sub(p, F), V.sub(u, F).every(x => Math.abs(x) < 1e-9) ? V.sub(v, F) : V.sub(u, F), 'rgba(168,108,255,0.8)');
                st.text('h', V.lerp(p, F, 0.5), COL.purple, { dx: 12, font: FONT, align: 'left' });
            }
            // sides, each in the colour of its opposite corner
            const side = (p, q, col, name, bold) => {
                st.segment(p, q, col, { width: bold ? 4.5 : 3 });
                const mid = V.lerp(p, q, 0.5), out = V.unit(V.sub(mid, G));
                st.text(name, V.add(mid, V.scale(out, 16 / st.unit)), col, { font: FONT });
            };
            side(B, Cc, K.a, 'a', false);
            side(Cc, A, K.b, 'b', false);
            side(A, B, K.c, 'c', S10.mode === 'cos');
            const r = Math.min(0.9, m.c * 0.18, m.a * 0.18, m.b * 0.18);
            st.angleArc(A, V.sub(B, A), V.sub(Cc, A), K.a, 'α', r);
            st.angleArc(B, V.sub(A, B), V.sub(Cc, B), K.b, 'β', r);
            if (Math.abs(deg(m.ga) - 90) < 0.05) st.rightAngle(Cc, V.sub(A, Cc), V.sub(B, Cc), K.c);
            else st.angleArc(Cc, V.sub(A, Cc), V.sub(B, Cc), K.c, 'γ', r);
        },

        drawSsw(st) {
            const { Cc, Bs } = sswPoints(), A = [0, 0];
            st.segment(A, [11, 0], 'rgba(255,255,255,0.6)', { width: 1.6 });
            st.circle(Cc, S10.a, K.a, { width: 1.4, dash: [5, 4], alpha: 0.8 });
            const cols = [COL.green, COL.purple];
            Bs.forEach((B, i) => {
                st.polygon([A, B, Cc], cols[i], null, { alpha: 0.1 });
                st.segment(B, Cc, K.a, { width: 3, alpha: i ? 0.6 : 1, dash: i ? [7, 4] : null });
                st.dot(B, cols[i], 6);
                st.text('B' + (i + 1), B, cols[i], { dy: 16, font: FONT });
                st.angleArc(B, V.sub(A, B), V.sub(Cc, B), cols[i], 'β' + (i + 1), 0.55 + 0.2 * i);
            });
            st.segment(A, Cc, K.b, { width: 3.5 });
            st.text('b', V.scale(Cc, 0.5), K.b, { dx: -12, dy: -8, font: FONT });
            if (Bs[0]) st.text('a', V.lerp(Bs[0], Cc, 0.5), K.a, { dx: 12, font: FONT, align: 'left' });
            st.angleArc(A, [1, 0], Cc, K.a, 'α', 0.9);
            st.dot(A, '#fff', 4);
            st.text('A', A, '#fff', { dx: -12, dy: 12, font: FONT });
        },
    });
})();
