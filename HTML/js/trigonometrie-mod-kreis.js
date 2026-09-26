/* trigonometrie-mod-kreis.js — chapters 1 to 3 of the Trigonometrie lab:
 * right triangle (Klasse 9), unit circle and radians (Klasse 10).
 * Colour meaning throughout the lab: sine orange, cosine blue, tangent pink, angle green.
 */
(function () {
    'use strict';
    const L = window.TrigLab;
    const { COL, V, num, Tex, C, PI, TAU, rad, deg, piTex, radTex, valTex, degTex } = L;
    const R = String.raw;
    const FONT = "700 13px 'Orbitron', sans-serif";
    const SMALL = "600 11px 'Orbitron', sans-serif";

    /** A short HUD row: grey caption left, value right. */
    const row = (lab, val) => `<div class="v-hud-row"><span class="v-hud-lab">${lab}</span><span class="v-hud-val">${val}</span></div>`;
    const line = (tex, color) => `<div style="margin:5px 0${color ? ';color:' + color : ''}">$${tex}$</div>`;

    /** Angle slider in degrees plus a row of preset buttons; returns the slider handle. */
    function angleControls(cid, get, set, presets) {
        const s = L.slider(cid, 'Winkel α', 0, 360, Math.round(deg(get())), 1, v => set(rad(+v)), C.ang, v => v + '°');
        L.buttons(cid, presets.map(d => ({ label: d + '°', run: () => { set(rad(d)); s.set(d); } })));
        return s;
    }

    // ==================================================================
    // 1 — Rechtwinkliges Dreieck
    // ==================================================================
    const S1 = { B: [4, 3], ref: 'alpha', roles: true, unit: false };

    L.register({
        id: 'dreieck',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Bezugswinkel', '<div id="t1-ref"></div>', COL.orange);
            CyberUI.createDropdown('t1-ref', [
                { id: 'alpha', label: 'Winkel α bei A' },
                { id: 'beta', label: 'Winkel β bei B' },
            ], id => { S1.ref = id; ctx.redraw(); this.hud(ctx); }, S1.ref);

            CyberUI.createCard(c, 'Anzeigen', '<div id="t1-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t1-opt', 'Gegen- und Ankathete benennen', S1.roles, v => { S1.roles = v; ctx.redraw(); }, C.sin);
            CyberUI.createCheckbox('t1-opt', 'Ähnliches Dreieck mit c = 1', S1.unit, v => { S1.unit = v; ctx.redraw(); }, C.ang);
            L.buttons('t1-opt', [
                { label: '3-4-5', run: () => { S1.B = [4, 3]; this.frame(ctx); } },
                { label: '8-6-10', run: () => { S1.B = [8, 6]; this.frame(ctx); } },
                { label: '30°', run: () => { S1.B = [3 * Math.sqrt(3), 3]; this.frame(ctx); } },
                { label: '45°', run: () => { S1.B = [4, 4]; this.frame(ctx); } },
            ]);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh die Ecke <b>B</b>. Die Verhältnisse oben links rechnen live mit. Mausrad zoomt, Doppelklick holt das Bild zurück.</div>', COL.blue);

            ctx.theory(R`
<p>Im rechtwinkligen Dreieck hat jede Seite einen Namen, der vom <b>betrachteten Winkel</b> abhängt:</p>
<ul>
<li><b>Hypotenuse</b> — liegt dem rechten Winkel gegenüber, ist die längste Seite.</li>
<li><b>Gegenkathete</b> — liegt dem Winkel <b>gegenüber</b>.</li>
<li><b>Ankathete</b> — liegt am Winkel <b>an</b> (und ist nicht die Hypotenuse).</li>
</ul>
<div class="v-key">$$\begin{aligned}\sin\alpha&=\frac{\text{Gegenkathete}}{\text{Hypotenuse}}\\[12pt] \cos\alpha&=\frac{\text{Ankathete}}{\text{Hypotenuse}}\\[12pt] \tan\alpha&=\frac{\text{Gegenkathete}}{\text{Ankathete}}\end{aligned}$$
Merkhilfe <b>GAGA HHAG</b>: oben $G,A,G$ — unten $H,H,A$.</div>
<p>Stell links den Bezugswinkel auf <i>β bei B</i>: Die Seiten tauschen ihre Rollen, das Dreieck bleibt dasselbe. Deshalb gilt immer $\sin\alpha=\cos\beta$ — und weil $\alpha+\beta=90^\circ$ ist: $\sin\alpha=\cos(90^\circ-\alpha)$.</p>
<div class="v-aha"><b>Warum das überhaupt funktioniert:</b> Alle rechtwinkligen Dreiecke mit demselben Winkel $\alpha$ sind <b>ähnlich</b>. Die Seiten wachsen gemeinsam, ihre Verhältnisse bleiben gleich. Zieh $B$ von $(4\mid 3)$ nach $(8\mid 6)$ — die Zahlen oben links ändern sich nicht.</div>
<p class="v-sub">Winkel aus einem Verhältnis</p>
<p>Umgekehrt liefert der Taschenrechner aus dem Verhältnis den Winkel: $\alpha=\sin^{-1}\!\left(\tfrac{a}{c}\right)$, meist über <b>SHIFT sin</b>.</p>
<div class="v-warn"><b>Taschenrechner auf DEG!</b> Steht er auf RAD, kommt bei $\sin^{-1}(0{,}5)$ die Zahl $0{,}52$ statt $30^\circ$ heraus — das ist derselbe Winkel im Bogenmaß (Kapitel 3).</div>
<p class="v-sub">Die Brücke zum Einheitskreis</p>
<p>Schalte <i>Ähnliches Dreieck mit c = 1</i> ein. Ist die Hypotenuse genau $1$ lang, dann <b>sind</b> $\sin\alpha$ und $\cos\alpha$ die beiden Katheten — und die Spitze liegt auf dem Kreis mit Radius $1$. Genau dort geht es im nächsten Kapitel weiter.</p>`);

            ctx.tasks([
                {
                    q: R`Im Dreieck $ABC$ ist $\gamma=90^\circ$, $a=6\,\text{cm}$ und $c=10\,\text{cm}$. Berechne $\alpha$, $\beta$ und $b$.`,
                    hint: R`$a$ liegt $\alpha$ gegenüber, $c$ ist die Hypotenuse — also passt der Sinus.`,
                    sol: R`<span class="v-step">Winkel über den Sinus</span>
$$\sin\alpha=\frac{a}{c}=\frac{6}{10}=0{,}6\quad\Rightarrow\quad\alpha=\sin^{-1}(0{,}6)\approx 36{,}87^\circ$$
<span class="v-step">Zweiter Winkel</span>
$$\beta=90^\circ-\alpha\approx 53{,}13^\circ$$
<span class="v-step">Dritte Seite mit Pythagoras</span>
$$b=\sqrt{c^2-a^2}=\sqrt{100-36}=8\,\text{cm}$$
<p class="v-res">$\alpha\approx 36{,}87^\circ$, $\beta\approx 53{,}13^\circ$, $b=8\,\text{cm}$</p>`
                },
                {
                    q: R`Eine $5\,\text{m}$ lange Leiter lehnt an einer Wand und bildet mit dem Boden einen Winkel von $70^\circ$. Wie hoch reicht sie, und wie weit steht ihr Fuß von der Wand weg?`,
                    hint: R`Die Leiter ist die Hypotenuse. Die Höhe liegt dem $70^\circ$-Winkel gegenüber.`,
                    sol: R`<span class="v-step">Höhe = Gegenkathete</span>
$$h=5\cdot\sin 70^\circ\approx 5\cdot 0{,}940=4{,}70\,\text{m}$$
<span class="v-step">Abstand = Ankathete</span>
$$d=5\cdot\cos 70^\circ\approx 5\cdot 0{,}342=1{,}71\,\text{m}$$
<p class="v-res">Die Leiter reicht etwa $4{,}70\,\text{m}$ hoch, ihr Fuß steht etwa $1{,}71\,\text{m}$ von der Wand weg.</p>`
                },
                {
                    q: R`Ein Straßenschild zeigt $12\,\%$ Steigung. Wie groß ist der Steigungswinkel?`,
                    hint: R`$12\,\%$ heißt: $12\,\text{m}$ hoch auf $100\,\text{m}$ waagerecht. Welches Verhältnis ist das?`,
                    sol: R`<span class="v-step">Steigung = Gegenkathete durch Ankathete</span>
$$\tan\alpha=\frac{12}{100}=0{,}12\quad\Rightarrow\quad \alpha=\tan^{-1}(0{,}12)\approx 6{,}84^\circ$$
<p class="v-res">Der Steigungswinkel beträgt etwa $6{,}84^\circ$.</p>
<div class="v-warn">Nicht $12\,\% \mathrel{\hat=} 12^\circ$! Die Prozentangabe ist ein Tangens, kein Winkel.</div>`
                },
                {
                    q: R`Begründe: Im rechtwinkligen Dreieck ist $\sin\alpha$ immer kleiner als $1$.`,
                    sol: R`<p>Der Sinus ist Gegenkathete durch Hypotenuse. Die Hypotenuse ist die längste Seite, also ist der Zähler kleiner als der Nenner.</p>
<p class="v-res">$0<\sin\alpha<1$ für $0^\circ<\alpha<90^\circ$ — erst am Einheitskreis werden auch $0$, $1$ und negative Werte möglich.</p>`
                },
                {
                    q: R`Zeige mit dem Dreieck: $\sin\alpha=\cos(90^\circ-\alpha)$.`,
                    hint: R`Wie groß ist der dritte Winkel $\beta$, und welche Seite ist für ihn die Ankathete?`,
                    sol: R`<span class="v-step">Winkelsumme</span>
<p>$\beta=180^\circ-90^\circ-\alpha=90^\circ-\alpha$.</p>
<span class="v-step">Dieselbe Seite, zwei Rollen</span>
<p>Die Seite $a$ ist für $\alpha$ die Gegenkathete und für $\beta$ die Ankathete:</p>
$$\sin\alpha=\frac{a}{c}=\cos\beta=\cos(90^\circ-\alpha)$$
<p class="v-res">Deshalb heißt der Kosinus „Ko-Sinus“: der Sinus des Komplementwinkels.</p>`
                },
            ]);
        },

        frame(ctx) {
            const B = S1.B;
            ctx.stage2.fitBox(-1.2, Math.max(B[0], 5) + 1.6, -1.4, Math.max(B[1], 3.5) + 1.2);
            ctx.redraw(); this.hud(ctx);
        },
        onShow(ctx) {
            const st = ctx.stage2;
            st.xMode = 'num'; st.xClip = null; st.names = ['x', 'y']; st.degLabels = false;
            st.addHandle(() => S1.B, w => {
                S1.B = [Math.max(0.5, Math.min(14, Math.round(w[0] * 2) / 2)), Math.max(0.5, Math.min(10, Math.round(w[1] * 2) / 2))];
            }, COL.orange, 'B');
            ctx.tip('Ziehen: B');
            this.frame(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const [bx, by] = S1.B;
            const a = by, b = bx, c = Math.hypot(a, b);
            const al = Math.atan2(a, b), be = PI / 2 - al;
            const alpha = S1.ref === 'alpha';
            const g = alpha ? a : b, k = alpha ? b : a, w = alpha ? 'α' : 'β', wt = alpha ? '\\alpha' : '\\beta';
            const gn = alpha ? 'a' : 'b', kn = alpha ? 'b' : 'a';
            const ang = alpha ? al : be;
            const cTex = Math.abs(c - Math.round(c)) < 1e-9 ? String(Math.round(c)) : '\\approx ' + Tex.num(c, 2);
            ctx.hud(
                row('Seiten', `a = ${num(a)}, b = ${num(b)}, c ${Math.abs(c - Math.round(c)) < 1e-9 ? '=' : '≈'} ${num(c, 2)}`) +
                row('Winkel', `${w} = ${num(deg(ang), 2)}°`) +
                line(R`\sin ${wt}=\frac{${gn}}{c}=\frac{${Tex.num(g, 2)}}{${Tex.num(c, 2)}}${valTex(g / c)}`, C.sin) +
                line(R`\cos ${wt}=\frac{${kn}}{c}=\frac{${Tex.num(k, 2)}}{${Tex.num(c, 2)}}${valTex(k / c)}`, C.cos) +
                line(R`\tan ${wt}=\frac{${gn}}{${kn}}=\frac{${Tex.num(g, 2)}}{${Tex.num(k, 2)}}${valTex(g / k)}`, C.tan) +
                `<div class="v-hud-note">c = √(a² + b²) ${cTex.startsWith('\\') ? '≈ ' + num(c, 2) : '= ' + cTex}. Zieh B auf der Linie durch A weiter — die drei Verhältnisse bleiben.</div>`);
        },

        draw(st) {
            const A = [0, 0], B = S1.B, Cp = [B[0], 0];
            const alpha = S1.ref === 'alpha';
            st.polygon([A, Cp, B], COL.orange, null, { alpha: 0.07 });
            // sides: coloured by their role for the chosen angle
            const opp = alpha ? [Cp, B] : [A, Cp];   // Gegenkathete
            const adj = alpha ? [A, Cp] : [Cp, B];   // Ankathete
            st.segment(A, B, C.rad, { width: 3 });
            st.segment(opp[0], opp[1], C.sin, { width: 4 });
            st.segment(adj[0], adj[1], C.cos, { width: 4 });
            st.rightAngle(Cp, [-1, 0], [0, 1], 'rgba(255,255,255,0.7)');
            if (alpha) st.angleArc(A, [1, 0], B, C.ang, 'α', Math.min(1.1, B[1] * 0.6));
            else st.angleArc(B, V.sub(A, B), [0, -1], C.ang, 'β', Math.min(1.1, B[0] * 0.3));

            // side names
            const mAB = V.scale(B, 0.5), mBC = [B[0], B[1] / 2], mAC = [B[0] / 2, 0];
            const nrm = V.unit([-B[1], B[0]]);
            st.text('c', V.add(mAB, V.scale(nrm, 12 / st.unit)), C.rad, { font: FONT });
            st.text('a', mBC, alpha ? C.sin : C.cos, { dx: 16, font: FONT });
            st.text('b', mAC, alpha ? C.cos : C.sin, { dy: 16, font: FONT });
            if (S1.roles) {
                st.text('Hypotenuse', V.add(mAB, V.scale(nrm, 30 / st.unit)), 'rgba(255,255,255,0.75)', { font: SMALL });
                st.text(alpha ? 'Gegenkathete' : 'Ankathete', mBC, alpha ? C.sin : C.cos, { dx: 16, dy: 18, font: SMALL, align: 'left' });
                st.text(alpha ? 'Ankathete' : 'Gegenkathete', mAC, alpha ? C.cos : C.sin, { dy: 32, font: SMALL });
            }
            // the same triangle shrunk to hypotenuse 1 — this is already the unit circle
            if (S1.unit && alpha) {
                const c = V.len(B), B1 = V.scale(B, 1 / c), C1 = [B1[0], 0];
                st.arcW(A, 1, 0, PI / 2, C.ang, { width: 1.4, dash: [4, 4], alpha: 0.8 });
                st.segment(A, B1, C.ang, { width: 2.5 });
                st.segment(C1, B1, C.sin, { width: 2.5, dash: [5, 3] });
                st.segment(A, C1, C.cos, { width: 2.5, dash: [5, 3] });
                st.dot(B1, C.ang, 4);
                st.text('1', V.scale(B1, 0.5), C.ang, { dx: -8, dy: -10, font: SMALL });
                st.text('sin α', [C1[0], B1[1] / 2], C.sin, { dx: -6, font: SMALL, align: 'right' });
                st.text('cos α', [C1[0] / 2, 0], C.cos, { dy: -11, font: SMALL });
            }
            st.dot(A, '#fff', 4); st.text('A', A, '#fff', { dx: -12, dy: 12, font: FONT });
            st.dot(Cp, '#fff', 4); st.text('C', Cp, '#fff', { dx: 12, dy: 12, font: FONT });
        },
    });

    // ==================================================================
    // 2 — Einheitskreis
    // ==================================================================
    const S2 = { x: rad(30), signs: true, tri: true, play: false };

    L.register({
        id: 'kreis',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Winkel', '<div id="t2-ang"></div>', C.ang);
            this.slider = angleControls('t2-ang', () => S2.x, x => { S2.x = x; this.update(ctx); }, [30, 45, 60, 120, 210, 300]);
            this.playRow = L.buttons('t2-ang', [{ label: 'Drehen', run: () => this.toggle(ctx) }]);

            CyberUI.createCard(c, 'Anzeigen', '<div id="t2-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t2-opt', 'Vorzeichen in den Quadranten', S2.signs, v => { S2.signs = v; ctx.redraw(); }, COL.orange);
            CyberUI.createCheckbox('t2-opt', 'Steigungsdreieck füllen', S2.tri, v => { S2.tri = v; ctx.redraw(); }, C.ang);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh den Punkt <b>P</b> um den Kreis. Bei 15°-Schritten rastet er leicht ein.</div>', COL.blue);

            ctx.theory(R`
<p>Im Dreieck gibt es Sinus und Kosinus nur für Winkel zwischen $0^\circ$ und $90^\circ$. Der <b>Einheitskreis</b> (Radius $1$, Mittelpunkt im Ursprung) macht daraus Funktionen für <b>jeden</b> Winkel:</p>
<div class="v-key">Der Punkt $P$ auf dem Einheitskreis zum Winkel $\alpha$ hat die Koordinaten $$P(\cos\alpha\mid\sin\alpha)$$ <b>Kosinus = x‑Koordinate, Sinus = y‑Koordinate.</b></div>
<p>Der Winkel wird von der positiven x‑Achse aus <b>gegen den Uhrzeigersinn</b> gemessen. Im I. Quadranten ist das genau das Dreieck aus Kapitel 1 mit Hypotenuse $1$.</p>
<p class="v-sub">Vorzeichen in den Quadranten</p>
<div class="v-table-wrap"><table class="v-table">
<tr><th></th><th>I</th><th>II</th><th>III</th><th>IV</th></tr>
<tr><td>Winkel</td><td>$0^\circ$–$90^\circ$</td><td>$90^\circ$–$180^\circ$</td><td>$180^\circ$–$270^\circ$</td><td>$270^\circ$–$360^\circ$</td></tr>
<tr><td style="color:rgb(245,194,66)">$\sin$</td><td>$+$</td><td>$+$</td><td>$-$</td><td>$-$</td></tr>
<tr><td style="color:#00d2ff">$\cos$</td><td>$+$</td><td>$-$</td><td>$-$</td><td>$+$</td></tr>
</table></div>
<p class="v-sub">Die Achsenpunkte</p>
<div class="v-table-wrap"><table class="v-table">
<tr><th>$\alpha$</th><td>$0^\circ$</td><td>$90^\circ$</td><td>$180^\circ$</td><td>$270^\circ$</td><td>$360^\circ$</td></tr>
<tr><th>$\sin\alpha$</th><td>$0$</td><td>$1$</td><td>$0$</td><td>$-1$</td><td>$0$</td></tr>
<tr><th>$\cos\alpha$</th><td>$1$</td><td>$0$</td><td>$-1$</td><td>$0$</td><td>$1$</td></tr>
</table></div>
<p class="v-sub">Pythagoras am Einheitskreis</p>
<div class="v-key">$$\sin^2\alpha+\cos^2\alpha=1$$ Die beiden Katheten und der Radius $1$ bilden ein rechtwinkliges Dreieck.</div>
<div class="v-aha">Weil $P$ auf dem Kreis mit Radius $1$ liegt, gilt immer $-1\le\sin\alpha\le 1$ und $-1\le\cos\alpha\le 1$. Nach einer vollen Drehung ($360^\circ$) ist man wieder am Anfang — alles wiederholt sich.</div>
<div class="v-warn">$\sin^2\alpha$ heißt $(\sin\alpha)^2$ — nicht $\sin(\alpha^2)$.</div>`);

            ctx.tasks([
                {
                    q: R`Welche Vorzeichen haben $\sin 200^\circ$ und $\cos 200^\circ$?`,
                    hint: R`In welchem Quadranten liegt $200^\circ$?`,
                    sol: R`<p>$200^\circ$ liegt zwischen $180^\circ$ und $270^\circ$, also im III. Quadranten — links unten.</p>
<p class="v-res">Beide Koordinaten sind negativ: $\sin 200^\circ<0$ und $\cos 200^\circ<0$.</p>`
                },
                {
                    q: R`Lies am Einheitskreis ab: $\sin 90^\circ$, $\cos 180^\circ$, $\sin 270^\circ$, $\cos 360^\circ$.`,
                    sol: R`<p>$90^\circ$: $P(0\mid 1)$, $180^\circ$: $P(-1\mid 0)$, $270^\circ$: $P(0\mid -1)$, $360^\circ$: $P(1\mid 0)$.</p>
<p class="v-res">$\sin 90^\circ=1$, $\cos 180^\circ=-1$, $\sin 270^\circ=-1$, $\cos 360^\circ=1$</p>`
                },
                {
                    q: R`Es gilt $\sin\alpha=0{,}6$, und $\alpha$ liegt im II. Quadranten. Bestimme $\cos\alpha$ und $\alpha$.`,
                    hint: R`Pythagoras am Einheitskreis — und das Vorzeichen des Kosinus im II. Quadranten.`,
                    sol: R`<span class="v-step">Betrag über Pythagoras</span>
$$\cos^2\alpha=1-\sin^2\alpha=1-0{,}36=0{,}64\quad\Rightarrow\quad|\cos\alpha|=0{,}8$$
<span class="v-step">Vorzeichen</span>
<p>Im II. Quadranten liegt $P$ links der y‑Achse: $\cos\alpha=-0{,}8$.</p>
<span class="v-step">Winkel</span>
<p>Der Taschenrechner gibt $\sin^{-1}(0{,}6)\approx 36{,}87^\circ$ — das ist der Winkel im I. Quadranten. Gespiegelt an der y‑Achse:</p>
$$\alpha=180^\circ-36{,}87^\circ=143{,}13^\circ$$
<p class="v-res">$\cos\alpha=-0{,}8$, $\alpha\approx 143{,}13^\circ$</p>`
                },
                {
                    q: R`Für welche Winkel $0^\circ\le\alpha<360^\circ$ gilt $\sin\alpha=\cos\alpha$?`,
                    hint: R`Dann sind x‑ und y‑Koordinate von $P$ gleich. Wo schneidet die Gerade $y=x$ den Kreis?`,
                    sol: R`<p>$P$ muss auf der Winkelhalbierenden $y=x$ liegen. Sie schneidet den Einheitskreis zweimal.</p>
<p class="v-res">$\alpha=45^\circ$ und $\alpha=225^\circ$</p>
<p>Zur Probe: $\sin 45^\circ=\cos 45^\circ=\tfrac{\sqrt{2}}{2}$ und $\sin 225^\circ=\cos 225^\circ=-\tfrac{\sqrt{2}}{2}$.</p>`
                },
                {
                    q: R`Kann $\sin\alpha=1{,}2$ sein? Begründe.`,
                    sol: R`<p>Nein. Der Sinus ist die y‑Koordinate eines Punktes auf dem Kreis mit Radius $1$ — höher als $1$ kommt der Punkt nie.</p>
<p class="v-res">Der Sinus liegt immer zwischen $-1$ und $1$. Der Taschenrechner meldet bei $\sin^{-1}(1{,}2)$ einen Fehler.</p>`
                },
            ]);
        },

        update(ctx) { ctx.redraw(); this.hud(ctx); },
        toggle(ctx) {
            S2.play = !S2.play;
            this.playRow.firstChild.textContent = S2.play ? 'Anhalten' : 'Drehen';
            if (!S2.play) return;
            let t0 = performance.now();
            const step = now => {
                if (!S2.play || !ctx.active) return;
                S2.x = L.wrap(S2.x + (now - t0) / 1000 * rad(30));
                t0 = now;
                this.slider.set(Math.round(deg(S2.x)));
                this.update(ctx);
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        },
        onHide() { if (S2.play) { S2.play = false; if (this.playRow) this.playRow.firstChild.textContent = 'Drehen'; } },
        /** Grabbing P stops the rotation — the hand wins over the motor. */
        onDragStop() { this.onHide(); },

        onShow(ctx) {
            const st = ctx.stage2;
            st.xMode = 'num'; st.xClip = null; st.names = ['x', 'y']; st.degLabels = false;
            L.circleHandle(st, [0, 0], 1, () => S2.x, x => { S2.x = x; this.slider.set(Math.round(deg(x))); }, C.ang, 'P');
            ctx.tip('Ziehen: P');
            st.fitBox(-1.4, 1.4, -1.3, 1.3);
            this.hud(ctx);
        },
        onDrag(ctx) { this.onDragStop(); this.hud(ctx); },

        hud(ctx) {
            const x = S2.x, s = Math.sin(x), c = Math.cos(x);
            const q = ['I', 'II', 'III', 'IV'][Math.floor(L.wrap(x) / (PI / 2)) % 4];
            const onAxis = Math.abs(s) < 1e-9 || Math.abs(c) < 1e-9;
            ctx.hud(
                row('Winkel', `α = ${num(deg(x), 1)}°`) +
                row('Quadrant', onAxis ? 'auf einer Achse' : q) +
                line(R`P(${Tex.num(c, 3)}\mid ${Tex.num(s, 3)})`) +
                line(R`\sin\alpha${valTex(s)}`, C.sin) +
                line(R`\cos\alpha${valTex(c)}`, C.cos) +
                line(R`\sin^2\alpha+\cos^2\alpha=${Tex.num(s * s, 3)}+${Tex.num(c * c, 3)}=1`, 'rgb(160,200,90)'));
        },

        draw(st) {
            L.unitCircle(st, [0, 0], 1, S2.x, { axes: false, signs: S2.signs, tri: S2.tri, sector: false });
            st.dot([0, 0], '#fff', 3);
        },
    });

    // ==================================================================
    // 3 — Grad- und Bogenmaß
    // ==================================================================
    const S3 = { x: rad(60), r: 1, marks: true, tape: false };

    L.register({
        id: 'bogen',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Winkel', '<div id="t3-ang"></div>', C.ang);
            this.slider = angleControls('t3-ang', () => S3.x, x => { S3.x = x; this.update(ctx); }, [30, 45, 90, 180, 270, 360]);
            L.buttons('t3-ang', [{ label: '1 rad ≈ 57,3°', run: () => { S3.x = 1; this.slider.set(57); this.update(ctx); } }]);

            CyberUI.createCard(c, 'Radius', '<div id="t3-r"></div>', COL.purple);
            L.slider('t3-r', 'r', 0.5, 2.5, S3.r, 0.1, v => { S3.r = +v; this.frame(ctx); }, COL.purple, v => num(+v, 1));

            CyberUI.createCard(c, 'Anzeigen', '<div id="t3-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t3-opt', 'Radius abtragen (1, 2, 3 … rad)', S3.marks, v => { S3.marks = v; ctx.redraw(); }, COL.orange);
            CyberUI.createCheckbox('t3-opt', 'Bogen abrollen (Maßband)', S3.tape, v => { S3.tape = v; this.frame(ctx); }, C.ang);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh den Punkt <b>P</b>. Der grüne Bogen ist der Winkel im Bogenmaß — gemessen als <b>Länge</b>.</div>', COL.blue);

            ctx.theory(R`
<p>$360^\circ$ für eine volle Drehung ist eine alte Festlegung der Babylonier. Es geht auch ohne: Man misst den Winkel durch die <b>Länge des Bogens</b>, den er aus dem Einheitskreis herausschneidet. Das ist das <b>Bogenmaß</b>.</p>
<div class="v-key">Der volle Kreis mit Radius $1$ hat den Umfang $2\pi$, also $$360^\circ\mathrel{\hat=}2\pi$$ $$180^\circ\mathrel{\hat=}\pi$$ $$x=\frac{\alpha}{180^\circ}\cdot\pi$$ $$\alpha=\frac{x}{\pi}\cdot 180^\circ$$</div>
<div class="v-table-wrap"><table class="v-table">
<tr><th>Grad</th><td>$30^\circ$</td><td>$45^\circ$</td><td>$60^\circ$</td><td>$90^\circ$</td></tr>
<tr><th>Bogen</th><td>$\tfrac{\pi}{6}$</td><td>$\tfrac{\pi}{4}$</td><td>$\tfrac{\pi}{3}$</td><td>$\tfrac{\pi}{2}$</td></tr>
</table></div>
<div class="v-table-wrap"><table class="v-table">
<tr><th>Grad</th><td>$180^\circ$</td><td>$270^\circ$</td><td>$360^\circ$</td><td>$57{,}3^\circ$</td></tr>
<tr><th>Bogen</th><td>$\pi$</td><td>$\tfrac{3\pi}{2}$</td><td>$2\pi$</td><td>$1$</td></tr>
</table></div>
<p class="v-sub">Was ist „1“ im Bogenmaß?</p>
<p>Der Winkel, dessen Bogen genau so lang ist wie der Radius: $1\;(\text{rad})\approx 57{,}3^\circ$. Schalte <i>Radius abtragen</i> ein: Gut sechs Radien passen um den Kreis — genauer $2\pi\approx 6{,}28$.</p>
<p class="v-sub">Andere Radien</p>
<p>Zieh am Radius‑Regler: Der Bogen wird länger, der Winkel bleibt. Allgemein gilt</p>
<div class="v-key">$$b=r\cdot x$$ Bogenlänge = Radius mal Winkel im Bogenmaß.</div>
<div class="v-aha"><b>Warum rechnet man in der Analysis im Bogenmaß?</b> Dann ist der Winkel eine Länge — dieselbe Einheit wie auf der y‑Achse. Erst so wird die Sinuskurve „richtig“ gezeichnet, und erst so gilt $(\sin x)'=\cos x$ (Kapitel 11).</div>
<div class="v-warn">Der Taschenrechner muss zur Aufgabe passen: <b>DEG</b> für Grad, <b>RAD</b> für Bogenmaß. $\sin 30$ in RAD ist $\sin(30\,\text{rad})\approx -0{,}99$ — nicht $0{,}5$.</div>`);

            ctx.tasks([
                {
                    q: R`Rechne $150^\circ$ ins Bogenmaß um.`,
                    sol: R`$$x=\frac{150^\circ}{180^\circ}\cdot\pi=\frac{5}{6}\pi$$<p class="v-res">$150^\circ\mathrel{\hat=}\tfrac{5\pi}{6}\approx 2{,}62$</p>`
                },
                {
                    q: R`Rechne $\tfrac{7\pi}{4}$ ins Gradmaß um.`,
                    sol: R`$$\alpha=\frac{7\pi/4}{\pi}\cdot 180^\circ=\frac{7}{4}\cdot 180^\circ=315^\circ$$<p class="v-res">$\tfrac{7\pi}{4}\mathrel{\hat=}315^\circ$ — im IV. Quadranten.</p>`
                },
                {
                    q: R`Wie viel Grad ist der Winkel $x=1$?`,
                    sol: R`$$\alpha=\frac{1}{\pi}\cdot 180^\circ\approx 57{,}3^\circ$$<p class="v-res">Ein Radiant ist knapp $60^\circ$ — der Bogen ist so lang wie der Radius.</p>`
                },
                {
                    q: R`Eine Pizza hat den Radius $15\,\text{cm}$. Wie lang ist der Rand eines $45^\circ$-Stücks?`,
                    hint: R`Erst ins Bogenmaß, dann $b=r\cdot x$.`,
                    sol: R`<span class="v-step">Bogenmaß</span>$$45^\circ\mathrel{\hat=}\tfrac{\pi}{4}$$
<span class="v-step">Bogenlänge</span>$$b=r\cdot x=15\cdot\tfrac{\pi}{4}\approx 11{,}78\,\text{cm}$$
<p class="v-res">Der Rand ist etwa $11{,}8\,\text{cm}$ lang.</p>`
                },
                {
                    q: R`Der Minutenzeiger einer Uhr ist $12\,\text{cm}$ lang. Welchen Winkel (im Bogenmaß) überstreicht er in $20$ Minuten, und welchen Weg legt seine Spitze zurück?`,
                    sol: R`<span class="v-step">Winkel</span>
<p>$20$ Minuten sind ein Drittel der Stunde, also ein Drittel von $2\pi$:</p>$$x=\tfrac{2\pi}{3}\;(\mathrel{\hat=}120^\circ)$$
<span class="v-step">Weg der Spitze</span>$$b=12\cdot\tfrac{2\pi}{3}=8\pi\approx 25{,}1\,\text{cm}$$
<p class="v-res">$x=\tfrac{2\pi}{3}$, die Spitze wandert etwa $25{,}1\,\text{cm}$.</p>`
                },
            ]);
        },

        update(ctx) { ctx.redraw(); this.hud(ctx); },
        frame(ctx) {
            const r = S3.r;
            if (S3.tape) ctx.stage2.fitBox(-1.35 * r, 5.7 * r, -r - 0.95 * r, 1.3 * r);
            else ctx.stage2.fitBox(-1.4 * r, 1.4 * r, -1.35 * r, 1.35 * r);
            this.wire(ctx);
            ctx.redraw(); this.hud(ctx);
        },
        wire(ctx) {
            const st = ctx.stage2;
            st.clearHandles();
            L.circleHandle(st, [0, 0], S3.r, () => S3.x, x => { S3.x = x < 1e-9 && S3.x > PI ? TAU : x; this.slider.set(Math.round(deg(S3.x))); }, C.ang, 'P');
        },
        onShow(ctx) {
            const st = ctx.stage2;
            st.xMode = 'num'; st.xClip = null; st.names = ['x', 'y']; st.degLabels = false;
            ctx.tip('Ziehen: P  ·  Regler: Radius');
            this.frame(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const x = S3.x, r = S3.r;
            ctx.hud(
                row('Gradmaß', `α = ${num(deg(x), 1)}°`) +
                line(R`x=\frac{${Tex.num(deg(x), 1)}^\circ}{180^\circ}\cdot\pi${radTex(x, 3)}`, C.ang) +
                row('Radius', `r = ${num(r, 1)}`) +
                line(R`b=r\cdot x=${Tex.num(r, 1)}\cdot ${Tex.num(x, 3)}\approx ${Tex.num(r * x, 3)}`, C.ang) +
                `<div class="v-hud-note">${Math.abs(r - 1) < 1e-9 ? 'Einheitskreis: der Bogen <b>ist</b> der Winkel.' : 'Der Winkel hängt nicht vom Radius ab — nur der Bogen.'}</div>`);
        },

        draw(st) {
            const r = S3.r, x = S3.x, O = [0, 0];
            st.segment([-1.25 * r, 0], [1.25 * r, 0], 'rgba(255,255,255,0.3)', { width: 1 });
            st.circle(O, r, 'rgba(255,255,255,0.55)', { width: 1.6 });
            if (S3.marks) {
                // lay the radius around the circle: arcs of length r, alternating shade
                for (let k = 0; k < 7; k++) {
                    const t0 = k, t1 = Math.min(k + 1, TAU);
                    if (t0 >= TAU) break;
                    st.arcW(O, r * 1.08, t0, t1, k % 2 ? 'rgba(245,194,66,0.45)' : 'rgba(245,194,66,0.8)', { width: 3 });
                    if (k + 1 <= TAU) {
                        const p = [Math.cos(k + 1) * r, Math.sin(k + 1) * r];
                        st.segment(V.scale(p, 1.02), V.scale(p, 1.14), COL.orange, { width: 1.6 });
                        st.text(String(k + 1), V.scale(p, 1.26), COL.orange, { font: SMALL });
                    }
                }
            }
            st.sector(O, r, 0, x, C.ang, 0.1);
            st.arcW(O, r, 0, x, C.ang, { width: 5 });
            const P = [r * Math.cos(x), r * Math.sin(x)];
            st.segment(O, [r, 0], C.rad, { width: 2 });
            st.segment(O, P, C.rad, { width: 2 });
            st.text('r', [r / 2, 0], C.rad, { dy: 12, font: SMALL });
            st.arcW(O, r * 0.22, 0, x, C.ang, { width: 1.6, alpha: 0.8 });
            const mid = x / 2;
            st.text('b', [r * 0.84 * Math.cos(mid), r * 0.84 * Math.sin(mid)], C.ang, { font: FONT });
            st.dot(O, '#fff', 3);
            if (S3.tape) {
                // the arc rolled out onto a straight tape below the circle
                const y = -r - 0.55 * r, x0 = -r;
                st.segment([x0, y], [x0 + TAU * r, y], 'rgba(255,255,255,0.4)', { width: 1.2 });
                for (let k = 0; k <= 4; k++) {
                    const px = x0 + k * PI / 2 * r;
                    st.segment([px, y - 0.06 * r], [px, y + 0.06 * r], 'rgba(255,255,255,0.6)', { width: 1.2 });
                    st.text(L.piText(k * PI / 2) + (r !== 1 ? '·r' : ''), [px, y], 'rgba(255,255,255,0.6)', { dy: 14, font: '11px Arial, Helvetica, sans-serif' });
                }
                st.segment([x0, y], [x0 + x * r, y], C.ang, { width: 5 });
                st.segment([r, 0], [x0, y], 'rgba(121,158,49,0.35)', { width: 1, dash: [3, 4] });
                st.segment(P, [x0 + x * r, y], 'rgba(121,158,49,0.35)', { width: 1, dash: [3, 4] });
                st.text('b = ' + num(r * x, 2), [x0 + x * r, y], C.ang, { dy: -14, font: SMALL });
            }
        },
    });
})();
