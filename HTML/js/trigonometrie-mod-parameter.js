/* trigonometrie-mod-parameter.js — chapters 7, 8 and 11 of the Trigonometrie lab:
 * the parameters of a·sin(b(x−c))+d with a guessing game, fitting a sine to
 * periodic data (day length, Ferris wheel, tides, damped spring) and, as an
 * outlook, the derivative of sine and cosine.
 */
(function () {
    'use strict';
    const L = window.TrigLab;
    const { COL, num, Tex, C, PI, TAU, rad, deg, piTex, piText } = L;
    const R = String.raw;
    const SMALL = "600 11px 'Orbitron', sans-serif";
    const FONT = "700 13px 'Orbitron', sans-serif";
    // parameter colours: amplitude orange, period blue, shift pink, midline purple, graph green
    const P = { a: COL.orange, b: COL.blue, c: COL.pink, d: COL.purple, f: COL.green };

    const row = (lab, val) => `<div class="v-hud-row"><span class="v-hud-lab">${lab}</span><span class="v-hud-val">${val}</span></div>`;
    const line = (tex, color) => `<div style="margin:5px 0${color ? ';color:' + color : ''}">$${tex}$</div>`;

    /** LaTeX of a·sin(b(x−c))+d with the usual simplifications. `cTex` formats the shift. */
    function formula(a, b, c, d, v = 'x', cTex = x => piTex(x) || Tex.num(x, 2), trig = '\\sin') {
        const r2 = x => Math.round(x * 1000) / 1000;
        a = r2(a); b = r2(b); d = r2(d);
        const A = a === 1 ? '' : a === -1 ? '-' : Tex.num(a, 2) + '\\cdot ';
        const B = b === 1 ? '' : Tex.num(b, 3);
        let arg;
        if (Math.abs(c) < 1e-9) arg = B + v;
        else {
            const inner = `${v}${c > 0 ? '-' : '+'}${cTex(Math.abs(c))}`;
            arg = B ? `${B}\\left(${inner}\\right)` : inner;
        }
        const D = Math.abs(d) < 1e-9 ? '' : (d > 0 ? '+' : '-') + Tex.num(Math.abs(d), 2);
        return `${A}${trig}\\left(${arg}\\right)${D}`;
    }

    // ==================================================================
    // 7 — Parameter a, b, c, d
    // ==================================================================
    const S7 = { a: 1, b: 1, c: 0, d: 0, ref: true, marks: true, target: null, reveal: false };
    const f7 = x => S7.a * Math.sin(S7.b * (x - S7.c)) + S7.d;

    L.register({
        id: 'parameter',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'f(x) = a · sin(b(x − c)) + d', '<div id="t7-p"></div>', P.f);
            const redo = () => { this.frame(ctx); };
            this.sa = L.slider('t7-p', 'a  Amplitude', -3, 3, S7.a, 0.1, v => { S7.a = +v; redo(); }, P.a, v => num(+v, 1));
            this.sb = L.slider('t7-p', 'b  Frequenzfaktor', 0.25, 4, S7.b, 0.25, v => { S7.b = +v; redo(); }, P.b, v => num(+v, 2));
            this.sc = L.slider('t7-p', 'c  Verschiebung', -12, 12, 0, 1, v => { S7.c = +v * PI / 12; redo(); }, P.c, v => piText(+v * PI / 12));
            this.sd = L.slider('t7-p', 'd  Mittellage', -2, 2, S7.d, 0.1, v => { S7.d = +v; redo(); }, P.d, v => num(+v, 1));

            CyberUI.createCard(c, 'Beispiele', '<div id="t7-ex"></div>', COL.orange);
            const pre = (a, b, cc, d) => () => { Object.assign(S7, { a, b, c: cc, d }); this.syncSliders(); this.frame(ctx); };
            L.buttons('t7-ex', [
                { label: 'sin x', run: pre(1, 1, 0, 0) }, { label: '3 sin x', run: pre(3, 1, 0, 0) },
                { label: 'sin 2x', run: pre(1, 2, 0, 0) }, { label: 'sin(x/2)', run: pre(1, 0.5, 0, 0) },
                { label: 'sin(x − π/2)', run: pre(1, 1, PI / 2, 0) }, { label: 'sin x + 2', run: pre(1, 1, 0, 2) },
                { label: '−2 sin x', run: pre(-2, 1, 0, 0) },
            ]);

            CyberUI.createCard(c, 'Rätsel', '<div id="t7-q"></div>', COL.green);
            L.buttons('t7-q', [
                { label: 'Neues Rätsel', run: () => this.newQuiz(ctx) },
                { label: 'Lösung', run: () => { if (S7.target) { S7.reveal = true; this.hud(ctx); } } },
                { label: 'Beenden', run: () => { S7.target = null; S7.reveal = false; this.frame(ctx); } },
            ]);
            CyberUI.createCard(c, 'Anzeigen', '<div id="t7-opt"></div>', COL.orange);
            CyberUI.createCheckbox('t7-opt', 'sin x zum Vergleich', S7.ref, v => { S7.ref = v; ctx.redraw(); }, C.sin);
            CyberUI.createCheckbox('t7-opt', 'Amplitude, Periode, Mittellage markieren', S7.marks, v => { S7.marks = v; ctx.redraw(); }, P.d);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Regler oder direkt ziehen: Der <b>lila</b> Punkt verschiebt die Kurve (c und d), der <b>orange</b> Hochpunkt stellt Amplitude und Periode ein.</div>', COL.blue);

            ctx.theory(R`
<div class="v-key">$$f(x)=a\cdot\sin\big(b\,(x-c)\big)+d$$</div>
<div class="v-table-wrap"><table class="v-table">
<tr><th>Parameter</th><th>wirkt als</th><th>ablesen</th></tr>
<tr><td style="color:rgb(245,194,66)">$a$</td><td>Streckung in y‑Richtung</td><td>Amplitude $|a|$</td></tr>
<tr><td style="color:#00d2ff">$b$</td><td>Stauchung in x‑Richtung</td><td>Periode $p=\tfrac{2\pi}{b}$</td></tr>
<tr><td style="color:#ff4fa3">$c$</td><td>Verschiebung in x‑Richtung</td><td>$c>0$: nach rechts</td></tr>
<tr><td style="color:#a86cff">$d$</td><td>Verschiebung in y‑Richtung</td><td>Mittellage $y=d$</td></tr>
</table></div>
<p><b>Amplitude</b> ist der Abstand von der Mittellage bis zum Hochpunkt. Der Wertebereich ist $W=[d-|a|;\;d+|a|]$. Ein negatives $a$ spiegelt die Kurve an der Mittellage.</p>
<p><b>Periode:</b> Je größer $b$, desto mehr Wellen passen auf dieselbe Strecke. $\sin(2x)$ schafft zwei volle Schwingungen in $[0;2\pi)$, die Periode ist also $\pi$.</p>
<div class="v-warn"><b>Die Klammer zählt.</b> In $\sin(2x-\pi)$ steckt die Verschiebung $c=\tfrac{\pi}{2}$, nicht $\pi$ — erst ausklammern: $\sin\big(2(x-\tfrac{\pi}{2})\big)$. Und: Minus in der Klammer schiebt nach <b>rechts</b>.</div>
<div class="v-aha"><b>Rätsel:</b> Unter <i>Rätsel</i> erscheint eine gestrichelte Zielkurve. Stell die grüne Kurve so ein, dass sie darauf liegt — es gibt oft mehrere richtige Parametersätze (z. B. $c$ um eine Periode versetzt).</div>`);

            ctx.tasks([
                {
                    q: R`Gib Amplitude, Periode und Wertebereich von $f(x)=3\sin(2x)$ an.`,
                    sol: R`<p>Amplitude $|a|=3$, Periode $p=\tfrac{2\pi}{2}=\pi$, keine Verschiebung, Mittellage $y=0$.</p><p class="v-res">$W=[-3;\,3]$</p>`
                },
                {
                    q: R`Welche Periode hat $f(x)=\sin\!\left(\tfrac{x}{2}\right)$?`,
                    sol: R`$$b=\tfrac12\;\Rightarrow\;p=\frac{2\pi}{1/2}=4\pi$$<p class="v-res">Die Kurve ist doppelt so breit: Periode $4\pi$.</p>`
                },
                {
                    q: R`Welchen Wertebereich hat $f(x)=2\sin x+5$?`,
                    sol: R`<p>Mittellage $5$, Amplitude $2$.</p><p class="v-res">$W=[3;\,7]$</p>`
                },
                {
                    q: R`Wie entsteht $f(x)=\sin\!\left(x-\tfrac{\pi}{2}\right)$ aus $\sin x$? Welche bekannte Funktion ist das?`,
                    sol: R`<p>Verschiebung um $\tfrac{\pi}{2}$ nach <b>rechts</b>. Die Kurve beginnt dann bei $x=0$ ganz unten.</p><p class="v-res">$\sin\!\left(x-\tfrac{\pi}{2}\right)=-\cos x$</p>`
                },
                {
                    q: R`Gib eine Funktion mit Amplitude $2$, Periode $\pi$ und Mittellage $y=1$ an, deren Graph bei $x=0$ die Mittellage steigend schneidet.`,
                    hint: R`Aus der Periode $b$ bestimmen: $b=\tfrac{2\pi}{p}$.`,
                    sol: R`$$a=2,\quad b=\frac{2\pi}{\pi}=2,\quad c=0,\quad d=1$$<p class="v-res">$f(x)=2\sin(2x)+1$</p>`
                },
                {
                    q: R`Wie viele volle Schwingungen macht $f(x)=\sin(3x)$ im Intervall $[0;\,2\pi)$?`,
                    sol: R`<p>Periode $p=\tfrac{2\pi}{3}$; in $2\pi$ passen $\tfrac{2\pi}{2\pi/3}=3$ Perioden.</p><p class="v-res">Drei Schwingungen — $b$ zählt die Schwingungen auf $2\pi$.</p>`
                },
            ]);
        },

        syncSliders() {
            this.sa.set(Math.round(S7.a * 10) / 10); this.sb.set(S7.b);
            this.sc.set(Math.round(S7.c / (PI / 12))); this.sd.set(Math.round(S7.d * 10) / 10);
        },
        newQuiz(ctx) {
            const pick = arr => arr[Math.floor(Math.random() * arr.length)];
            S7.target = {
                a: pick([0.5, 1, 1.5, 2, 2.5, 3]) * pick([1, 1, 1, -1]),
                b: pick([0.5, 1, 1.5, 2, 3]),
                c: pick([-3, -2, -1, 0, 1, 2, 3]) * PI / 4,
                d: pick([-1.5, -1, -0.5, 0, 0.5, 1, 1.5]),
            };
            S7.reveal = false;
            Object.assign(S7, { a: 1, b: 1, c: 0, d: 0 });
            this.syncSliders();
            this.frame(ctx);
        },
        /** Target hit? Compare the curves themselves — several parameter sets draw the same wave. */
        hit() {
            const T = S7.target;
            if (!T) return false;
            for (let x = -1; x <= 13; x += 0.05) {
                if (Math.abs(f7(x) - (T.a * Math.sin(T.b * (x - T.c)) + T.d)) > 0.06) return false;
            }
            return true;
        },
        frame(ctx) {
            const T = S7.target;
            const top = Math.max(2.2, S7.d + Math.abs(S7.a) + 0.9, T ? T.d + Math.abs(T.a) + 0.9 : 0);
            const bot = Math.min(-2.2, S7.d - Math.abs(S7.a) - 0.9, T ? T.d - Math.abs(T.a) - 0.9 : 0);
            ctx.stage2.fitBox(-PI / 2 - 0.5, 4 * PI + 0.3, bot, top);
            ctx.redraw(); this.hud(ctx);
        },
        onShow(ctx) {
            const st = ctx.stage2;
            st.xMode = 'pi'; st.degLabels = false; st.xClip = null; st.names = ['x', 'y'];
            // start point of the wave (c | d)
            st.addHandle(() => [S7.c, S7.d], w => {
                S7.c = Math.max(-PI, Math.min(PI, Math.round(w[0] / (PI / 12)) * PI / 12));
                S7.d = Math.max(-2, Math.min(2, Math.round(w[1] * 10) / 10));
                this.syncSliders();
            }, P.d, null);
            // first high point: amplitude and quarter period
            st.addHandle(() => [S7.c + PI / (2 * S7.b), S7.d + S7.a], w => {
                S7.a = Math.max(-3, Math.min(3, Math.round((w[1] - S7.d) * 10) / 10));
                const q = Math.max(0.1, w[0] - S7.c);               // a quarter period
                S7.b = Math.max(0.25, Math.min(4, Math.round(PI / (2 * q) * 4) / 4));
                this.syncSliders();
            }, P.a, null);
            ctx.tip('Ziehen: lila = Verschiebung, orange = Amplitude und Periode');
            this.frame(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const { a, b, c, d } = S7, p = TAU / b;
            let h = line('f(x)=' + formula(a, b, c, d), P.f) +
                row('Amplitude', `|a| = ${num(Math.abs(a), 1)}${a < 0 ? '  (gespiegelt)' : ''}`) +
                row('Periode', `p = 2π / ${num(b, 2)} ${piTex(p) ? '= ' + piText(p) : '≈ ' + num(p, 2)}`) +
                row('Verschiebung', Math.abs(c) < 1e-9 ? 'keine' : `${piText(Math.abs(c))} nach ${c > 0 ? 'rechts' : 'links'}`) +
                row('Mittellage', `y = ${num(d, 1)}`) +
                row('Wertebereich', `[${num(d - Math.abs(a), 1)} ; ${num(d + Math.abs(a), 1)}]`);
            if (S7.target) {
                const ok = this.hit();
                h += `<div class="v-hud-note">${ok ? '<b style="color:rgb(160,200,90);font-size:1.05rem">Treffer!</b> Die Kurven liegen aufeinander.' : 'Rätsel: Bring die grüne Kurve auf die gestrichelte.'}</div>`;
                if (S7.reveal) h += line('\\text{Ziel: }' + formula(S7.target.a, S7.target.b, S7.target.c, S7.target.d), '#fff');
            }
            ctx.hud(h);
        },

        draw(st) {
            const { a, b, c, d } = S7, p = TAU / b;
            if (S7.ref) st.curve(Math.sin, C.sin, { width: 1.6, alpha: 0.4, dash: [5, 5] });
            if (S7.target) {
                const T = S7.target;
                st.curve(x => T.a * Math.sin(T.b * (x - T.c)) + T.d, 'rgba(255,255,255,0.85)', { width: 3.5, dash: [9, 7] });
            }
            if (S7.marks) {
                st.hline(d, P.d, { width: 1.4, dash: [6, 5] });
                const y0 = d - Math.abs(a) - 0.45;
                st.dim([c, y0], [c + p, y0], P.b, 'p = ' + (piTex(p) ? piText(p) : num(p, 2)), { offset: -13 });
                const xh = c + p / 4;
                if (Math.abs(a) > 0.05) st.dim([xh + 0.18, d], [xh + 0.18, d + a], P.a, 'a', { offset: a > 0 ? -12 : 12 });
                if (Math.abs(c) > 1e-9) st.arrow([0, d], [c, d], P.c, null, { width: 2.2 });
                if (Math.abs(c) > 1e-9) st.text('c', [c / 2, d], P.c, { dy: -12, font: FONT });
            }
            st.curve(f7, P.f, { width: 3.2 });
        },
    });

    // ==================================================================
    // 8 — Periodische Vorgänge modellieren
    // ==================================================================
    /** Day length in hours for latitude phi on day n (sunrise equation with refraction). */
    function dayLength(n, phi) {
        const dec = rad(-23.44) * Math.cos(TAU / 365 * (n + 10));
        const h0 = rad(-0.833);
        const cw = (Math.sin(h0) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
        return 2 * deg(Math.acos(Math.max(-1, Math.min(1, cw)))) / 15;
    }
    /** Small repeatable wobble for "measured" values — the same every visit. */
    const wobble = (i, s) => s * Math.sin(i * 12.9898 + 78.233) * Math.cos(i * 4.1414);

    const SCEN = {
        tag: {
            label: 'Tageslänge in Dresden', names: ['t in Tagen', 'L in h'], unitX: 'Tage', unitY: 'h', v: 't',
            box: [-15, 380, -1.5, 19], data: [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349].map(n => [n, Math.round(dayLength(n, rad(51.05)) * 10) / 10]),
            start: { hp: [150, 14.5], tp: [320, 9] }, best: { hp: [172, 16.6], tp: [355, 7.9] },
            note: 'Astronomisch berechnet für den 15. jedes Monats, 51° Nord.',
        },
        rad: {
            label: 'Riesenrad', names: ['t in min', 'h in m'], unitX: 'min', unitY: 'm', v: 't',
            box: [-0.8, 21, -3, 46], data: Array.from({ length: 41 }, (_, i) => [i / 2, 22 - 20 * Math.cos(TAU * (i / 2) / 10)]),
            start: { hp: [4, 35], tp: [9, 8] }, best: { hp: [5, 42], tp: [10, 2] },
            note: 'Radius 20 m, Nabe 22 m hoch, eine Runde in 10 min, Einstieg unten bei t = 0.',
        },
        ebbe: {
            label: 'Ebbe und Flut', names: ['t in h', 'h in m'], unitX: 'h', unitY: 'm', v: 't',
            box: [-1, 25, -1, 9.5], data: Array.from({ length: 25 }, (_, i) => [i, Math.round((3 * Math.sin(PI / 6 * i) + 5 + wobble(i, 0.18)) * 100) / 100]),
            start: { hp: [4, 7], tp: [10, 3] }, best: { hp: [3, 8], tp: [9, 2] },
            note: 'Wasserstand an einem Pegel, stündlich gemessen (Modelldaten).',
        },
        feder: {
            label: 'Federpendel (gedämpft)', names: ['t in s', 'y in cm'], unitX: 's', unitY: 'cm', v: 't', damped: true,
            box: [-0.4, 10.4, -6, 6], data: Array.from({ length: 51 }, (_, i) => { const t = i / 5; return [t, Math.round((5 * Math.exp(-0.25 * t) * Math.sin(PI * t) + wobble(i, 0.12)) * 100) / 100]; }),
            start: { hp: [0.6, 3], tp: [1.8, -3] }, best: { hp: [0.5, 5], tp: [1.5, -5] }, bestK: 0.25,
            note: 'Auslenkung einer schwingenden Feder, alle 0,2 s gemessen — sie wird langsam leiser.',
        },
    };
    const S8 = { scen: 'tag', hp: null, tp: null, k: 0, curve: true };

    /** Model parameters from the dragged high and low point. */
    function model8() {
        const [hx, hy] = S8.hp, [tx, ty] = S8.tp;
        const a = (hy - ty) / 2, d = (hy + ty) / 2;
        const p = Math.max(1e-6, 2 * Math.abs(tx - hx));
        const b = TAU / p, c = hx - p / 4;
        const k = SCEN[S8.scen].damped ? S8.k : 0;
        return { a, b, c, d, p, k, f: t => a * Math.exp(-k * t) * Math.sin(b * (t - c)) + d };
    }

    L.register({
        id: 'modell',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Vorgang', '<div id="t8-s"></div>', COL.orange);
            CyberUI.createDropdown('t8-s', Object.keys(SCEN).map(id => ({ id, label: SCEN[id].label })), id => { this.load(ctx, id); }, S8.scen);
            CyberUI.createCard(c, 'Modell', '<div id="t8-m"></div>', P.f);
            L.buttons('t8-m', [
                { label: 'Lösung zeigen', run: () => { const s = SCEN[S8.scen]; S8.hp = s.best.hp.slice(); S8.tp = s.best.tp.slice(); if (s.damped) { S8.k = s.bestK; this.kSlider.set(s.bestK); } ctx.redraw(); this.hud(ctx); } },
                { label: 'Neu anfangen', run: () => this.load(ctx, S8.scen) },
            ]);
            this.kWrap = document.createElement('div');
            this.kWrap.id = 't8-k';
            document.getElementById('t8-m').appendChild(this.kWrap);
            this.kSlider = L.slider('t8-k', 'k  Dämpfung', 0, 0.6, 0, 0.01, v => { S8.k = +v; ctx.redraw(); this.hud(ctx); }, P.d, v => num(+v, 2));
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh den <b>Hochpunkt H</b> und den <b>Tiefpunkt T</b> der grünen Kurve auf die Messwerte. Daraus entstehen a, b, c und d — wie im Rezept rechts.</div>', COL.blue);

            ctx.theory(R`
<p>Viele Vorgänge wiederholen sich: Tageslänge, Riesenrad, Gezeiten, Wechselstrom, Töne. Man beschreibt sie mit</p>
<div class="v-key">$$f(t)=a\cdot\sin\big(b\,(t-c)\big)+d$$</div>
<p class="v-sub">Das Rezept — aus Hoch- und Tiefpunkt</p>
<ul>
<li><b style="color:#a86cff">Mittellage</b> $d=\dfrac{y_{\max}+y_{\min}}{2}$</li>
<li><b style="color:rgb(245,194,66)">Amplitude</b> $a=\dfrac{y_{\max}-y_{\min}}{2}$</li>
<li><b style="color:#00d2ff">Periode</b> $p$ = doppelter Abstand von Hoch- und Tiefpunkt, dann $b=\dfrac{2\pi}{p}$</li>
<li><b style="color:#ff4fa3">Verschiebung</b> $c$ = Stelle, an der die Kurve die Mittellage <b>steigend</b> kreuzt: $c=t_{\max}-\dfrac{p}{4}$</li>
</ul>
<p>Genau das rechnet das Labor, während du $H$ und $T$ ziehst. Die mittlere Abweichung oben links zeigt, wie gut das Modell zu den Messwerten passt.</p>
<div class="v-aha"><b>Frequenz:</b> Schwingungen pro Zeiteinheit, $f=\tfrac1p$. Damit ist $b=2\pi f$. Netzstrom mit $50\,\text{Hz}$ hat die Periode $p=\tfrac{1}{50}\,\text{s}=0{,}02\,\text{s}$.</div>
<p class="v-sub">Ausblick: gedämpfte Schwingung</p>
<p>Eine echte Feder schwingt nicht ewig. Die Amplitude nimmt ab — aus $a$ wird $a\cdot e^{-kt}$. Ohne Verschiebung:</p>
<div class="v-key">$$f(t)=a\,e^{-kt}\sin(bt)$$ Je größer die Dämpfung $k$, desto schneller wird die Schwingung leiser.</div>
<p>Wähle <i>Federpendel</i> und stell die Dämpfung $k$ ein, bis die grüne Kurve in die gestrichelte Hülle passt.</p>
<div class="v-warn">Die Tageslänge ist kein exakter Sinus — im Sommer ist die Kurve etwas breiter als im Winter. Ein Modell ist eine Näherung; die Abweichung sagt, wie gut.</div>`);

            ctx.tasks([
                {
                    q: R`Die Tageslänge schwankt zwischen $8\,\text{h}$ und $16\,\text{h}$. Bestimme Amplitude und Mittellage.`,
                    sol: R`$$a=\frac{16-8}{2}=4\,\text{h}\qquad d=\frac{16+8}{2}=12\,\text{h}$$<p class="v-res">Amplitude $4\,\text{h}$, Mittellage $12\,\text{h}$.</p>`
                },
                {
                    q: R`Ein Modell der Wassertiefe lautet $h(t)=3\sin\!\left(\tfrac{\pi}{6}t\right)+5$ ($t$ in h, $h$ in m). Wie tief ist es bei Flut und bei Ebbe, und wie lang dauert eine Gezeitenperiode?`,
                    sol: R`<span class="v-step">Flut und Ebbe</span><p>Flut: $5+3=8\,\text{m}$, Ebbe: $5-3=2\,\text{m}$.</p>
<span class="v-step">Periode</span>$$p=\frac{2\pi}{\pi/6}=12\,\text{h}$$<p class="v-res">$8\,\text{m}$, $2\,\text{m}$, Periode $12$ Stunden.</p>`
                },
                {
                    q: R`Ein Riesenrad hat den Radius $20\,\text{m}$, die Nabe ist $22\,\text{m}$ hoch, eine Runde dauert $10\,\text{min}$. Man steigt bei $t=0$ unten ein. Stelle $h(t)$ auf.`,
                    hint: R`Tiefpunkt bei $t=0$, Hochpunkt eine halbe Runde später.`,
                    sol: R`<span class="v-step">Rezept</span>$$d=22,\quad a=20,\quad p=10\;\Rightarrow\;b=\frac{2\pi}{10}=\frac{\pi}{5}$$
<span class="v-step">Verschiebung</span><p>Hochpunkt bei $t=5$, also $c=5-\tfrac{10}{4}=2{,}5$.</p>
<p class="v-res">$h(t)=20\sin\!\left(\tfrac{\pi}{5}(t-2{,}5)\right)+22$ — oder kürzer $h(t)=22-20\cos\!\left(\tfrac{\pi}{5}t\right)$.</p>`
                },
                {
                    q: R`Eine Wechselspannung hat $50$ Schwingungen pro Sekunde. Wie lang ist eine Periode, und wie groß ist $b$?`,
                    sol: R`$$p=\frac{1}{50}\,\text{s}=0{,}02\,\text{s}\qquad b=\frac{2\pi}{0{,}02}=100\pi\approx 314$$<p class="v-res">$p=0{,}02\,\text{s}$, $b=100\pi$</p>`
                },
                {
                    q: R`Der Kammerton hat $440\,\text{Hz}$. Was bedeutet das für $y=A\sin(2\pi f t)$?`,
                    sol: R`<p>$f=440$: Die Luft schwingt $440$-mal pro Sekunde, die Periode ist $\tfrac{1}{440}\,\text{s}\approx 2{,}3\,\text{ms}$. $A$ ist die Lautstärke (Amplitude), nicht die Tonhöhe.</p><p class="v-res">$y=A\sin(880\pi\,t)$</p>`
                },
            ]);
        },

        load(ctx, id) {
            S8.scen = id;
            const s = SCEN[id];
            S8.hp = s.start.hp.slice(); S8.tp = s.start.tp.slice();
            S8.k = 0; if (this.kSlider) this.kSlider.set(0);
            if (this.kWrap) this.kWrap.style.display = s.damped ? '' : 'none';
            const st = ctx.stage2;
            st.names = s.names;
            st.fitBox(s.box[0], s.box[1], s.box[2], s.box[3], false);
            ctx.redraw(); this.hud(ctx);
        },
        onShow(ctx) {
            const st = ctx.stage2;
            st.xMode = 'num'; st.degLabels = false; st.xClip = null;
            const clampY = y => Math.round(y * 10) / 10;
            const clampX = x => { const s = SCEN[S8.scen]; const step = s.box[1] > 100 ? 1 : 0.1; return Math.round(x / step) * step; };
            st.addHandle(() => S8.hp, w => { S8.hp = [clampX(w[0]), clampY(w[1])]; if (Math.abs(S8.hp[0] - S8.tp[0]) < 0.05) S8.hp[0] += 0.1; }, P.a, 'H');
            st.addHandle(() => S8.tp, w => { S8.tp = [clampX(w[0]), clampY(w[1])]; if (Math.abs(S8.hp[0] - S8.tp[0]) < 0.05) S8.tp[0] += 0.1; }, P.b, 'T');
            ctx.tip('Ziehen: Hochpunkt H und Tiefpunkt T');
            if (!S8.hp) this.load(ctx, S8.scen);
            else { const s = SCEN[S8.scen]; st.names = s.names; st.fitBox(s.box[0], s.box[1], s.box[2], s.box[3], false); this.hud(ctx); }
            if (this.kWrap) this.kWrap.style.display = SCEN[S8.scen].damped ? '' : 'none';
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const s = SCEN[S8.scen], m = model8();
            const dev = Math.sqrt(s.data.reduce((q, [t, y]) => q + (m.f(t) - y) ** 2, 0) / s.data.length);
            const span = Math.max(...s.data.map(p => p[1])) - Math.min(...s.data.map(p => p[1]));
            const good = dev < 0.05 * span;
            const fx = s.damped
                ? `f(t)=${Tex.num(m.a, 2)}\\cdot e^{-${Tex.num(m.k, 2)}t}\\cdot\\sin\\left(${Tex.num(m.b, 3)}\\left(t${m.c >= 0 ? '-' : '+'}${Tex.num(Math.abs(m.c), 2)}\\right)\\right)${m.d >= 0 ? '+' : '-'}${Tex.num(Math.abs(m.d), 2)}`
                : 'f(t)=' + formula(m.a, m.b, m.c, m.d, 't', x => Tex.num(x, 2));
            ctx.hud(
                line(fx, P.f) +
                row('Mittellage', `d = ${num(m.d, 2)} ${s.unitY}`) +
                row('Amplitude', `a = ${num(m.a, 2)} ${s.unitY}`) +
                row('Periode', `p = ${num(m.p, 2)} ${s.unitX}  →  b = ${num(m.b, 4)}`) +
                row('Verschiebung', `c = ${num(m.c, 2)} ${s.unitX}`) +
                row('Abweichung', `<span style="color:${good ? 'rgb(160,200,90)' : '#ffb3a8'}">≈ ${num(dev, 2)} ${s.unitY}</span>`) +
                `<div class="v-hud-note">${s.note}</div>`);
        },

        draw(st) {
            const s = SCEN[S8.scen], m = model8();
            st.hline(m.d, P.d, { width: 1.3, dash: [6, 5] });
            if (s.damped) {
                st.curve(t => m.d + Math.abs(m.a) * Math.exp(-m.k * t), P.d, { width: 1.3, dash: [4, 4], alpha: 0.7 });
                st.curve(t => m.d - Math.abs(m.a) * Math.exp(-m.k * t), P.d, { width: 1.3, dash: [4, 4], alpha: 0.7 });
            }
            st.curve(m.f, P.f, { width: 3 });
            s.data.forEach(p => st.dot(p, '#fff', s.data.length > 30 ? 2.6 : 3.8, { alpha: 0.9 }));
            // helper lines from H and T to the axes
            [S8.hp, S8.tp].forEach((q, i) => {
                st.segment([q[0], m.d], q, i ? P.b : P.a, { width: 1.2, dash: [3, 3], alpha: 0.8 });
            });
            st.dim([S8.hp[0], m.d], [S8.tp[0], m.d], P.b, 'p/2', { offset: m.a >= 0 ? 14 : -14, alpha: 0.9 });
        },
    });

    // ==================================================================
    // 11 — Ableitung (Ausblick Oberstufe)
    // ==================================================================
    const S11 = { x: rad(30), fn: 'sin', b: 1, trace: [], full: false, tri: true };
    const fns = {
        sin: { f: (x, b) => Math.sin(b * x), d: (x, b) => b * Math.cos(b * x), tex: '\\sin', dtex: 'cos' },
        cos: { f: (x, b) => Math.cos(b * x), d: (x, b) => -b * Math.sin(b * x), tex: '\\cos', dtex: '-sin' },
    };

    L.register({
        id: 'ableitung',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Funktion', '<div id="t11-f"></div><div id="t11-b"></div>', C.sin);
            CyberUI.createDropdown('t11-f', [
                { id: 'sin', label: 'f(x) = sin(b·x)' },
                { id: 'cos', label: 'f(x) = cos(b·x)' },
            ], id => { S11.fn = id; S11.trace = []; this.frame(ctx); }, S11.fn);
            L.slider('t11-b', 'b  (Kettenregel)', 0.5, 3, S11.b, 0.5, v => { S11.b = +v; S11.trace = []; this.frame(ctx); }, COL.blue, v => num(+v, 1));

            CyberUI.createCard(c, 'Anzeigen', '<div id="t11-o"></div>', COL.orange);
            CyberUI.createCheckbox('t11-o', 'Steigungsdreieck', S11.tri, v => { S11.tri = v; ctx.redraw(); }, C.tan);
            CyberUI.createCheckbox('t11-o', 'Ableitungskurve ganz zeigen', S11.full, v => { S11.full = v; ctx.redraw(); }, C.cos);
            L.buttons('t11-o', [{ label: 'Spur löschen', run: () => { S11.trace = []; ctx.redraw(); } }]);
            CyberUI.createCard(c, 'Bedienung', '<div class="v-note">Zieh den Punkt auf der Kurve langsam von links nach rechts. Jede Steigung hinterlässt einen <b>blauen</b> Punkt — so entsteht die Ableitungskurve.</div>', COL.blue);

            ctx.theory(R`
<p>Die Steigung der Sinuskurve ändert sich ständig: Bei $x=0$ steigt sie mit Steigung $1$, im Hochpunkt ist sie waagerecht, danach fällt sie. Zeichnet man zu jedem $x$ die Steigung als Punkt, entsteht — die Kosinuskurve.</p>
<div class="v-key">$$(\sin x)'=\cos x$$ $$(\cos x)'=-\sin x$$</div>
<div class="v-warn"><b>Nur im Bogenmaß!</b> Misst man $x$ in Grad, ist die Kurve $57{,}3$-mal breiter und viel flacher: $(\sin x^\circ)'=\tfrac{\pi}{180}\cos x^\circ$. Das ist der eigentliche Grund für das Bogenmaß.</div>
<p class="v-sub">Kettenregel</p>
<p>Stell $b=2$ ein: Die Kurve schwingt doppelt so schnell, also ist sie auch doppelt so steil.</p>
<div class="v-key">$$\big(\sin(bx)\big)'=b\cdot\cos(bx)$$ $$\big(\cos(bx)\big)'=-b\cdot\sin(bx)$$</div>
<div class="v-aha"><b>Kreislauf:</b> $\sin\to\cos\to-\sin\to-\cos\to\sin$. Nach viermal Ableiten ist man wieder am Anfang — die Ableitung dreht die Welle jedes Mal um $\tfrac{\pi}{2}$ nach links.</div>
<p class="v-sub">Wofür?</p>
<p>Extrempunkte liegen dort, wo die Ableitung null ist: $\cos x=0$ bei $x=\tfrac{\pi}{2}+k\pi$ — genau die Hoch- und Tiefpunkte des Sinus aus Kapitel 4.</p>`);

            ctx.tasks([
                {
                    q: R`Leite ab: $f(x)=3\sin x$, $g(x)=\sin(2x)$, $h(x)=\cos x+\sin x$.`,
                    sol: R`$$f'(x)=3\cos x\qquad g'(x)=2\cos(2x)\qquad h'(x)=-\sin x+\cos x$$`
                },
                {
                    q: R`Bestimme die Gleichung der Tangente an $f(x)=\sin x$ im Ursprung.`,
                    sol: R`<p>Steigung $f'(0)=\cos 0=1$, Punkt $(0\mid 0)$.</p><p class="v-res">$t(x)=x$ — nahe bei $0$ gilt deshalb $\sin x\approx x$.</p>`
                },
                {
                    q: R`An welchen Stellen hat $\sin x$ die Steigung $0$, an welchen die Steigung $-1$?`,
                    sol: R`<p>Steigung $0$: $\cos x=0$, also $x=\tfrac{\pi}{2}+k\pi$ (Hoch- und Tiefpunkte).</p><p>Steigung $-1$: $\cos x=-1$, also $x=\pi+k\cdot 2\pi$ (die fallenden Nullstellen).</p>`
                },
                {
                    q: R`Wie groß ist die größte Steigung von $f(x)=\sin(3x)$?`,
                    sol: R`$$f'(x)=3\cos(3x)\le 3$$<p class="v-res">Die größte Steigung ist $3$, zum Beispiel bei $x=0$.</p>`
                },
            ]);
        },

        frame(ctx) {
            const top = Math.max(1.6, S11.b + 0.5);
            ctx.stage2.fitBox(-0.4, TAU + 0.3, -top, top);
            ctx.redraw(); this.hud(ctx);
        },
        onShow(ctx) {
            const st = ctx.stage2;
            st.xMode = 'pi'; st.degLabels = false; st.xClip = null; st.names = ['x', 'y'];
            st.addHandle(() => [S11.x, fns[S11.fn].f(S11.x, S11.b)], w => {
                S11.x = Math.max(-0.3, Math.min(TAU + 0.2, L.snapAngle(w[0])));
                S11.trace.push([S11.x, fns[S11.fn].d(S11.x, S11.b)]);
                if (S11.trace.length > 4000) S11.trace.shift();
            }, C.sin, null);
            ctx.tip('Ziehen: der Punkt auf der Kurve');
            this.frame(ctx);
        },
        onDrag(ctx) { this.hud(ctx); },

        hud(ctx) {
            const F = fns[S11.fn], b = S11.b, x = S11.x, m = F.d(x, b);
            const arg = b === 1 ? 'x' : Tex.num(b, 1) + 'x';
            const pre = b === 1 ? '' : Tex.num(b, 1) + '\\cdot ';
            const dt = F.dtex.startsWith('-') ? `-${pre}\\sin(${arg})` : `${pre}\\cos(${arg})`;
            ctx.hud(
                row('Stelle', `x ${piTex(x) ? '= ' + piText(x) + ' ≈' : '≈'} ${num(x, 3)}`) +
                line(R`f(x)=${F.tex}(${arg})=${Tex.num(F.f(x, b), 3)}`, C.sin) +
                line(R`f'(x)=${dt}=${Tex.num(m, 3)}`, C.cos) +
                `<div class="v-hud-note">${Math.abs(m) < 1e-9 ? 'Steigung 0 — ein Hoch- oder Tiefpunkt.' : 'Die Tangente steigt um ' + num(m, 2) + ' pro Schritt nach rechts.'}</div>`);
        },

        draw(st) {
            const F = fns[S11.fn], b = S11.b, x = S11.x, y = F.f(x, b), m = F.d(x, b);
            if (S11.full) st.curve(t => F.d(t, b), C.cos, { width: 2, alpha: 0.55, dash: [6, 4] });
            st.curve(t => F.f(t, b), C.sin, { width: 3 });
            S11.trace.forEach(p => st.dot(p, C.cos, 2.4));
            // tangent line and slope triangle
            const w = 1.3;
            st.segment([x - w, y - m * w], [x + w, y + m * w], C.tan, { width: 2.4 });
            if (S11.tri) {
                st.segment([x, y], [x + 1, y], 'rgba(255,255,255,0.7)', { width: 1.6 });
                st.segment([x + 1, y], [x + 1, y + m], C.tan, { width: 2.2 });
                st.text('1', [x + 0.5, y], 'rgba(255,255,255,0.75)', { dy: m >= 0 ? 12 : -12, font: SMALL });
                st.text('m', [x + 1, y + m / 2], C.tan, { dx: 12, font: SMALL, align: 'left' });
            }
            st.segment([x, 0], [x, m], C.cos, { width: 1.4, dash: [3, 3] });
            st.dot([x, m], C.cos, 6);
            st.text("f '(x)", [x, m], C.cos, { dx: 10, dy: m >= 0 ? -12 : 12, font: SMALL, align: 'left' });
        },
    });
})();
