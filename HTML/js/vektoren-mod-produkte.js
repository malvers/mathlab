/* vektoren-mod-produkte.js — chapters 8 and 9: the two products.
 * Chapter 8 keeps one pair of vectors on stage and lets the student re-read them
 * as directions of lines or as normals of planes — same numbers, four formulas.
 * Chapter 9 shows the cross product as the area of the spanned parallelogram.
 */
(function () {
    'use strict';
    const { COL, V, G, num, Tex } = window.VekLab;
    const R = String.raw;
    const T = Tex;
    const col = v => T.col(v, 2);

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

    /** Arc between two vectors at the origin, as a polyline of world points. */
    function arcPoints(a, b, r, n = 40) {
        const ua = V.unit(V.to3(a)), ub = V.unit(V.to3(b));
        const ang = Math.acos(Math.max(-1, Math.min(1, V.dot(ua, ub))));
        if (!isFinite(ang) || ang < 1e-6) return [];
        const axis = V.cross(ua, ub);
        if (V.len(axis) < 1e-9) return [];
        const w = V.unit(V.cross(axis, ua));   // in-plane, perpendicular to ua
        const out = [];
        for (let i = 0; i <= n; i++) {
            const t = ang * i / n;
            out.push(V.scale(V.add(V.scale(ua, Math.cos(t)), V.scale(w, Math.sin(t))), r));
        }
        return out;
    }
    function drawArc(st, a, b, r, color) {
        const p = arcPoints(a, b, r);
        for (let i = 0; i + 1 < p.length; i++) st.line3(p[i], p[i + 1], color, { alpha: 0.95 });
        return p.length ? p[Math.floor(p.length / 2)] : null;
    }

    // ==================================================================
    // 8 — Skalarprodukt, Winkel, Orthogonalität
    // ==================================================================
    const S8 = { a: [4, 0, 0], b: [2, 3, 1], read: 'vec', proj: true };
    const READ = {
        vec: { name: 'zwei Vektoren', sym: ['a', 'b'] },
        line: { name: 'zwei Geraden (Richtungen)', sym: ['u', 'v'] },
        lp: { name: 'Gerade und Ebene (u und n)', sym: ['u', 'n'] },
        plane: { name: 'zwei Ebenen (Normalen)', sym: ['n₁', 'n₂'] },
    };

    VekLab.register({
        id: 'skalar',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Lesart', '<div id="v8-read"></div>', COL.orange);
            CyberUI.createDropdown('v8-read', Object.keys(READ).map(id => ({ id, label: READ[id].name })),
                id => { S8.read = id; ctx.redraw(); this.hud(ctx); }, S8.read);

            CyberUI.createCard(c, 'Erster Vektor', '<div id="v8-a"></div>', COL.orange);
            this.aS = vecSliders('v8-a', 'a', () => S8.a, v => S8.a = v, () => { ctx.redraw(); this.hud(ctx); }, COL.orange);
            CyberUI.createCard(c, 'Zweiter Vektor', '<div id="v8-b"></div>', COL.blue);
            this.bS = vecSliders('v8-b', 'b', () => S8.b, v => S8.b = v, () => { ctx.redraw(); this.hud(ctx); }, COL.blue);
            VekLab.buttons('v8-b', [
                { label: 'orthogonal machen', run: () => { this.makeOrtho(ctx); } },
                { label: 'parallel machen', run: () => { S8.b = V.scale(S8.a, 0.5).map(x => Math.round(x * 2) / 2); this.bS.set(S8.b); ctx.redraw(); this.hud(ctx); } },
            ]);
            CyberUI.createCard(c, 'Anzeigen', '<div id="v8-opt"></div>', COL.green);
            CyberUI.createCheckbox('v8-opt', 'Projektion von b auf a', S8.proj, v => { S8.proj = v; ctx.redraw(); }, COL.green);

            ctx.theory(R`
<p>Das <b>Skalarprodukt</b> macht aus zwei Vektoren eine <b>Zahl</b> — kein Vektor, daher der Name. Es gibt zwei Formeln, und ihre Gleichheit ist der ganze Trick:</p>
<div class="v-key">$$\vec{a}\circ\vec{b}=a_1b_1+a_2b_2+a_3b_3 \qquad\text{und}\qquad \vec{a}\circ\vec{b}=|\vec{a}|\,|\vec{b}|\cos\varphi$$</div>
<p>Links steht etwas, das man ohne Nachdenken ausrechnet. Rechts steht der <b>Winkel</b>. Gleichsetzen und nach $\cos\varphi$ auflösen — fertig ist die Winkelformel:</p>
<div class="v-key">$$\cos\varphi=\frac{\vec{a}\circ\vec{b}}{|\vec{a}|\,|\vec{b}|}$$</div>
<p><b>Orthogonalität</b> ist der Sonderfall $\varphi=90°$, also $\cos\varphi=0$:</p>
<div class="v-key">$$\vec{a}\perp\vec{b}\iff \vec{a}\circ\vec{b}=0\qquad(\vec a,\vec b\neq\vec 0)$$</div>
<div class="v-aha"><b>Das ist der meistgebrauchte Satz der ganzen Analytischen Geometrie.</b> Senkrecht prüfen kostet <i>eine</i> Zeile Rechnung — kein Winkel, keine Wurzel, kein Kosinus. Drück links „orthogonal machen“ und schau auf die Zahl.</div>
<p>Die <b>Projektion</b> auf der Bühne zeigt, was das Skalarprodukt geometrisch misst: den Schatten von $\vec{b}$ auf $\vec{a}$, mal $|\vec a|$. Steht $\vec b$ senkrecht, ist der Schatten ein Punkt — und das Produkt null.</p>
<p><b>Vorsicht bei Geraden und Ebenen.</b> Ein Richtungsvektor darf umgedreht werden, ohne dass sich die Gerade ändert — deshalb nimmt man dort den <b>Betrag</b> und bekommt immer den spitzen Winkel. Stell links die Lesart um:</p>
<div class="v-key">
Geraden: $\;\cos\varphi=\dfrac{|\vec{u}\circ\vec{v}|}{|\vec{u}||\vec{v}|}$<br>
Ebenen: $\;\cos\varphi=\dfrac{|\vec{n}_1\circ\vec{n}_2|}{|\vec{n}_1||\vec{n}_2|}$<br>
Gerade und Ebene: $\;\sin\varphi=\dfrac{|\vec{u}\circ\vec{n}|}{|\vec{u}||\vec{n}|}$
</div>
<div class="v-warn">Bei Gerade und Ebene steht der <b>Sinus</b>. Grund: $\vec n$ steht senkrecht auf der Ebene, der gerechnete Winkel ist also der zur <i>Normalen</i> — der gesuchte ist sein Komplement. $\cos(90°-\varphi)=\sin\varphi$.</div>`);

            ctx.tasks([
                {
                    q: R`Berechne $\vec{a}\circ\vec{b}$ und den Winkel für $\vec{a}=\begin{pmatrix}1\\2\\2\end{pmatrix}$, $\vec{b}=\begin{pmatrix}3\\0\\4\end{pmatrix}$.`,
                    sol: R`<span class="v-step">Skalarprodukt</span>
$$\vec{a}\circ\vec{b}=1\cdot3+2\cdot0+2\cdot4=11$$
<span class="v-step">Beträge</span>
$$|\vec{a}|=\sqrt{1+4+4}=3,\qquad |\vec{b}|=\sqrt{9+0+16}=5$$
<span class="v-step">Winkel</span>
$$\cos\varphi=\frac{11}{3\cdot 5}=\frac{11}{15}\approx 0{,}7333\;\Longrightarrow\;\varphi\approx 42{,}8°$$
<p class="v-res">$\vec a\circ\vec b=11$ und $\varphi\approx 42{,}8°$.</p>`
                },
                {
                    q: R`Für welches $t$ stehen $\vec{u}=\begin{pmatrix}2\\t\\-1\end{pmatrix}$ und $\vec{v}=\begin{pmatrix}3\\1\\t\end{pmatrix}$ senkrecht aufeinander?`,
                    hint: R`Senkrecht heißt: Skalarprodukt gleich null. Das gibt eine Gleichung in $t$.`,
                    sol: R`<span class="v-step">Skalarprodukt null setzen</span>
$$2\cdot3+t\cdot1+(-1)\cdot t=0$$
<span class="v-step">Zusammenfassen</span>
$$6+t-t=0\;\Longrightarrow\;6=0$$
<p class="v-res">Widerspruch — es gibt <b>kein</b> $t$. Die beiden Vektoren stehen für keinen Wert senkrecht aufeinander.</p>
<div class="v-warn">Dass sich das $t$ heraushebt, ist kein Rechenfehler, sondern das Ergebnis. Man darf ruhig „keine Lösung“ hinschreiben — Hauptsache mit Begründung.</div>`
                },
                {
                    q: R`Bestimme $p$ so, dass $\vec{u}=\begin{pmatrix}p\\3\\-1\end{pmatrix}$ und $\vec{v}=\begin{pmatrix}2\\p\\4\end{pmatrix}$ einen rechten Winkel einschließen.`,
                    hint: R`$p$ steckt in <b>beiden</b> Vektoren — beim Ausmultiplizieren entstehen zwei $p$-Terme, die zusammengefasst werden müssen.`,
                    sol: R`<span class="v-step">Skalarprodukt null setzen</span>
$$\vec{u}\circ\vec{v}=p\cdot 2+3\cdot p+(-1)\cdot 4=0$$
<span class="v-step">Ausmultiplizieren, dann sammeln</span>
$$2p+3p-4=0\;\Longrightarrow\;5p=4\;\Longrightarrow\;p=\tfrac{4}{5}=0{,}8$$
<p class="v-res">Für $p=0{,}8$ stehen die beiden Vektoren senkrecht aufeinander.</p>
<span class="v-step">Probe</span>
$$\begin{pmatrix}0{,}8\\3\\-1\end{pmatrix}\circ\begin{pmatrix}2\\0{,}8\\4\end{pmatrix}=1{,}6+2{,}4-4=0\;✓$$
<div class="v-warn"><b>Fehlerfalle:</b> $p$ nur in <i>einer</i> Zeile zu suchen. Hier liefert Zeile 1 den Term $2p$ und Zeile 2 den Term $3p$ — beide gehören zusammen, bevor man auflöst.</div>`
                },
                {
                    q: R`Bestimme den Schnittwinkel der Geraden mit den Richtungen $\vec{u}=\begin{pmatrix}1\\1\\0\end{pmatrix}$ und $\vec{v}=\begin{pmatrix}-1\\0\\1\end{pmatrix}$.`,
                    sol: R`<span class="v-step">Skalarprodukt und Beträge</span>
$$\vec{u}\circ\vec{v}=-1+0+0=-1,\qquad |\vec{u}|=|\vec{v}|=\sqrt{2}$$
<span class="v-step">Betrag nicht vergessen — es sind Geraden</span>
$$\cos\varphi=\frac{|-1|}{\sqrt2\cdot\sqrt2}=\frac{1}{2}\;\Longrightarrow\;\varphi=60°$$
<p class="v-res">Der Schnittwinkel beträgt $60°$.</p>
<div class="v-warn">Ohne Betragsstriche käme $\cos\varphi=-\tfrac12$, also $120°$ heraus. Beides beschreibt dieselbe Figur, aber als <b>Schnittwinkel zweier Geraden</b> gilt der spitze — deshalb der Betrag.</div>`
                },
                {
                    q: R`Welchen Winkel schließt $g:\;\vec{x}=\begin{pmatrix}0\\0\\0\end{pmatrix}+t\begin{pmatrix}1\\1\\1\end{pmatrix}$ mit der Ebene $E:\;z=0$ ein?`,
                    sol: R`<span class="v-step">Normalenvektor ablesen</span>
<p>$E:\;z=0$ heißt $0x+0y+1z=0$, also $\vec{n}=\begin{pmatrix}0\\0\\1\end{pmatrix}$.</p>
<span class="v-step">Sinusformel</span>
$$\sin\varphi=\frac{|\vec{u}\circ\vec{n}|}{|\vec{u}||\vec{n}|}=\frac{|1|}{\sqrt{3}\cdot 1}=\frac{1}{\sqrt3}\approx 0{,}5774$$
<p class="v-res">$\varphi\approx 35{,}3°$.</p>
<p>Gegenprobe zu Fuß: der Winkel zur Normalen wäre $\arccos(1/\sqrt3)\approx 54{,}7°$, und $90°-54{,}7°=35{,}3°$ ✓</p>`
                },
                {
                    q: R`Zeige, dass das Dreieck $A(1/0/2)$, $B(3/1/1)$, $C(2/3/3)$ bei $A$ rechtwinklig ist.`,
                    sol: R`<span class="v-step">Die beiden Seitenvektoren an der Ecke A</span>
$$\overrightarrow{AB}=\begin{pmatrix}2\\1\\-1\end{pmatrix},\qquad \overrightarrow{AC}=\begin{pmatrix}1\\3\\1\end{pmatrix}$$
<span class="v-step">Skalarprodukt</span>
$$\overrightarrow{AB}\circ\overrightarrow{AC}=2\cdot1+1\cdot3+(-1)\cdot1=2+3-1=4$$
<p class="v-res">$4\neq 0$ — das Dreieck ist bei $A$ <b>nicht</b> rechtwinklig.</p>
<p>Prüfe die anderen Ecken selbst: bei $B$ ergibt $\overrightarrow{BA}\circ\overrightarrow{BC}=-2+2\cdot2+1\cdot2=6\neq 0$, bei $C$ ebenfalls nicht null. Das Dreieck hat gar keinen rechten Winkel.</p>
<div class="v-aha">Behauptungen in Aufgabentexten muss man <b>prüfen</b>, nicht glauben. „Zeige, dass …“ heißt manchmal: es stimmt nicht, und das ist die Antwort.</div>`
                },
            ]);
        },

        /** Nudge b until a·b = 0, keeping it as close to the current b as possible. */
        makeOrtho(ctx) {
            const a = S8.a;
            if (V.isZero(a)) return;
            const b = S8.b;
            const proj = V.scale(a, V.dot(a, b) / V.len2(a));
            let nb = V.sub(b, proj);
            if (V.isZero(nb)) nb = V.anyPerp(a);
            nb = nb.map(x => Math.round(x * 2) / 2);
            // rounding can break orthogonality again — fall back to an exact perpendicular
            if (Math.abs(V.dot(a, nb)) > 1e-9) nb = V.scale(V.anyPerp(a), 3).map(x => Math.round(x * 2) / 2);
            S8.b = nb;
            this.bS.set(nb);
            ctx.redraw(); this.hud(ctx);
        },

        onShow(ctx) {
            ctx.stage3.onReady(() => { ctx.stage3.setRange(5); ctx.stage3.resetView(); });
            ctx.tip('Ziehen dreht · Mausrad zoomt');
            this.hud(ctx);
        },

        hud(ctx) {
            const { a, b, read } = S8;
            const sym = READ[read].sym;
            const dot = V.dot(a, b);
            const la = V.len(a), lb = V.len(b);
            let h = R`<div style="margin:2px 0">$\vec{${sym[0]}}=` + col(a) + R`,\;\; \vec{${sym[1]}}=` + col(b) + '$</div>';
            h += R`<div style="margin:6px 0">$\vec{${sym[0]}}\circ\vec{${sym[1]}}=` +
                a.map((x, i) => T.num(x, 1) + R`\cdot` + T.num(b[i], 1)).join('+') + '=' + T.num(dot, 2) + '$</div>';
            h += `<div class="v-hud-row"><span class="v-hud-lab">|a| und |b|</span><span class="v-hud-val">${num(la, 3)} und ${num(lb, 3)}</span></div>`;
            if (la < 1e-9 || lb < 1e-9) {
                h += `<div class="v-hud-note" style="color:${COL.red}">Mit dem Nullvektor gibt es keinen Winkel.</div>`;
                ctx.hud(h); return;
            }
            let ang, formula;
            if (read === 'vec') { ang = G.angleVec(a, b); formula = R`\cos\varphi=\frac{\vec{a}\circ\vec{b}}{|\vec{a}||\vec{b}|}=` + T.num(dot / (la * lb), 4); }
            else if (read === 'line') { ang = G.angleLines(a, b); formula = R`\cos\varphi=\frac{|\vec{u}\circ\vec{v}|}{|\vec{u}||\vec{v}|}=` + T.num(Math.abs(dot) / (la * lb), 4); }
            else if (read === 'lp') { ang = G.angleLinePlane(a, b); formula = R`\sin\varphi=\frac{|\vec{u}\circ\vec{n}|}{|\vec{u}||\vec{n}|}=` + T.num(Math.abs(dot) / (la * lb), 4); }
            else { ang = G.anglePlanes(a, b); formula = R`\cos\varphi=\frac{|\vec{n}_1\circ\vec{n}_2|}{|\vec{n}_1||\vec{n}_2|}=` + T.num(Math.abs(dot) / (la * lb), 4); }
            h += `<div style="margin:6px 0">$${formula}$</div>`;
            h += `<div class="v-hud-row"><span class="v-hud-lab">Winkel φ</span><span class="v-hud-val" style="color:${COL.green}">${num(ang, 2)}°</span></div>`;
            const orth = Math.abs(dot) < 1e-9;
            const par = V.parallel(a, b);
            h += `<div class="v-hud-note">${orth ? 'Skalarprodukt = 0 — die beiden stehen <b>senkrecht</b> aufeinander.'
                : par ? 'Parallel: der Winkel ist 0° und das Skalarprodukt so groß wie möglich.'
                    : dot < 0 ? 'Negatives Skalarprodukt heißt stumpfer Winkel zwischen den Vektoren.'
                        : 'Positives Skalarprodukt heißt spitzer Winkel zwischen den Vektoren.'}
                ${read === 'lp' ? ' Beachte: hier steht der Sinus.' : ''}</div>`;
            ctx.hud(h);
        },

        draw(st) {
            const O = [0, 0, 0], { a, b, read } = S8;
            const sym = READ[read].sym;
            if (read === 'plane' || read === 'lp') {
                // draw the plane(s) the normals belong to
                const drawPlane = (n, color) => {
                    if (V.isZero(n)) return;
                    const u = V.anyPerp(n), v = V.unit(V.cross(n, u));
                    st.plane3(O, u, v, color, { size: 2.8, alpha: 0.13, lines: 4 });
                };
                if (read === 'plane') { drawPlane(a, COL.orange); drawPlane(b, COL.blue); }
                else drawPlane(b, COL.blue);
            }
            if (S8.proj && !V.isZero(a)) {
                const p = V.scale(a, V.dot(a, b) / V.len2(a));
                st.line3(b, p, COL.green, { dash: true, alpha: 0.9 });
                st.arrow3(O, p, COL.green, null);
                st.point3(p, COL.green, null, 0.09);
            }
            st.arrow3(O, a, COL.orange, sym[0]);
            st.arrow3(O, b, COL.blue, sym[1]);
            const mid = drawArc(st, a, b, Math.min(V.len(a), V.len(b)) * 0.35, COL.green);
            if (mid) st.label3('φ', V.scale(V.unit(mid), V.len(mid) + 0.32), COL.green);
        },
    });

    // ==================================================================
    // 9 — Kreuzprodukt: Normalenvektor und Flächen
    // ==================================================================
    const S9 = { a: [3, 0, 0], b: [1, 3, 0], c: [1, 1, 3], tri: false, spat: false };

    VekLab.register({
        id: 'kreuz',
        build(ctx) {
            const c = ctx.sidebar;
            CyberUI.createCard(c, 'Vektor a', '<div id="v9-a"></div>', COL.orange);
            vecSliders('v9-a', 'a', () => S9.a, v => S9.a = v, () => { ctx.redraw(); this.hud(ctx); }, COL.orange);
            CyberUI.createCard(c, 'Vektor b', '<div id="v9-b"></div>', COL.blue);
            vecSliders('v9-b', 'b', () => S9.b, v => S9.b = v, () => { ctx.redraw(); this.hud(ctx); }, COL.blue);
            CyberUI.createCard(c, 'Anzeigen', '<div id="v9-opt"></div>', COL.green);
            CyberUI.createCheckbox('v9-opt', 'nur das halbe — Dreieck', S9.tri, v => { S9.tri = v; ctx.redraw(); this.hud(ctx); }, COL.green);
            CyberUI.createCheckbox('v9-opt', 'Spat mit drittem Vektor c', S9.spat, v => { S9.spat = v; ctx.redraw(); this.hud(ctx); }, COL.purple);
            CyberUI.createCard(c, 'Vektor c', '<div id="v9-c"></div>', COL.purple);
            vecSliders('v9-c', 'c', () => S9.c, v => S9.c = v, () => { ctx.redraw(); this.hud(ctx); }, COL.purple);

            ctx.theory(R`
<p>Das <b>Kreuzprodukt</b> (Vektorprodukt) macht aus zwei Vektoren wieder einen <b>Vektor</b> — und zwar einen, der auf beiden senkrecht steht. Genau das brauchen wir für Normalenvektoren von Ebenen.</p>
<div class="v-key">$$\vec{a}\times\vec{b}=\begin{pmatrix}a_2b_3-a_3b_2\\a_3b_1-a_1b_3\\a_1b_2-a_2b_1\end{pmatrix}$$</div>
<p><b>Merkregel:</b> für die erste Zeile deckst du die erste Zeile beider Vektoren zu und rechnest „über Kreuz“ mit den übrigen vier Zahlen. Für die zweite Zeile genauso — aber mit umgekehrtem Vorzeichen. Für die dritte wieder normal.</p>
<div class="v-key"><b>Der Betrag ist eine Fläche:</b> $$|\vec{a}\times\vec{b}|=|\vec{a}||\vec{b}|\sin\varphi=A_{\text{Parallelogramm}}$$ und damit $$A_{\text{Dreieck}}=\tfrac{1}{2}\,|\vec{a}\times\vec{b}|$$</div>
<p>Auf der Bühne siehst du beides gleichzeitig: die aufgespannte Fläche und den roten Pfeil senkrecht darauf. Zieh $\vec b$ in Richtung $\vec a$ — die Fläche wird flacher und der rote Pfeil kürzer. Bei parallelen Vektoren ist er der Nullvektor.</p>
<div class="v-key"><b>Rechenregeln — anders als beim Malnehmen:</b><br>
$\vec{a}\times\vec{b}=-\,\vec{b}\times\vec{a}$ (nicht kommutativ!)<br>
$\vec{a}\times\vec{a}=\vec{0}$<br>
$\vec{a}\times\vec{b}=\vec{0}\iff\vec a,\vec b$ sind parallel</div>
<p>Das <b>Spatprodukt</b> $(\vec{a}\times\vec{b})\circ\vec{c}$ ist wieder eine Zahl: das <b>Volumen</b> des von den drei Vektoren aufgespannten Schiefkörpers — mit Vorzeichen. Schalte links „Spat“ ein.</p>
<div class="v-aha"><b>Der Test auf Komplanarität:</b> ist das Spatprodukt null, hat der Körper kein Volumen — die drei Vektoren liegen in <b>einer Ebene</b>. Das ist der eleganteste Weg, lineare Abhängigkeit von drei Vektoren im Raum zu prüfen. Und daraus fällt die Pyramide gratis ab: $V_{\text{Pyramide}}=\tfrac{1}{6}\,|(\vec a\times\vec b)\circ\vec c|$.</div>
<div class="v-warn">Das Kreuzprodukt gibt es nur im <b>Raum</b>. In der Ebene bleibt von der Formel nur die dritte Zeile $a_1b_2-a_2b_1$ übrig — genau die Determinante aus Kapitel 4.</div>`);

            ctx.tasks([
                {
                    q: R`Berechne $\vec{a}\times\vec{b}$ für $\vec{a}=\begin{pmatrix}1\\2\\3\end{pmatrix}$ und $\vec{b}=\begin{pmatrix}4\\5\\6\end{pmatrix}$ und mach die Probe.`,
                    sol: R`<span class="v-step">Zeilenweise über Kreuz</span>
$$\vec{a}\times\vec{b}=\begin{pmatrix}2\cdot6-3\cdot5\\3\cdot4-1\cdot6\\1\cdot5-2\cdot4\end{pmatrix}=\begin{pmatrix}12-15\\12-6\\5-8\end{pmatrix}=\begin{pmatrix}-3\\6\\-3\end{pmatrix}$$
<span class="v-step">Probe: senkrecht auf beiden?</span>
$$\begin{pmatrix}-3\\6\\-3\end{pmatrix}\circ\begin{pmatrix}1\\2\\3\end{pmatrix}=-3+12-9=0\;✓$$
$$\begin{pmatrix}-3\\6\\-3\end{pmatrix}\circ\begin{pmatrix}4\\5\\6\end{pmatrix}=-12+30-18=0\;✓$$
<p class="v-res">$\vec{a}\times\vec{b}=\begin{pmatrix}-3\\6\\-3\end{pmatrix}$</p>
<div class="v-aha">Diese Probe kostet zwei Zeilen und findet fast jeden Vorzeichenfehler. Mach sie immer.</div>`
                },
                {
                    q: R`Berechne den Flächeninhalt des Dreiecks $A(1/1/0)$, $B(4/1/0)$, $C(1/5/0)$.`,
                    sol: R`<span class="v-step">Seitenvektoren</span>
$$\overrightarrow{AB}=\begin{pmatrix}3\\0\\0\end{pmatrix},\qquad \overrightarrow{AC}=\begin{pmatrix}0\\4\\0\end{pmatrix}$$
<span class="v-step">Kreuzprodukt</span>
$$\overrightarrow{AB}\times\overrightarrow{AC}=\begin{pmatrix}0\cdot0-0\cdot4\\0\cdot0-3\cdot0\\3\cdot4-0\cdot0\end{pmatrix}=\begin{pmatrix}0\\0\\12\end{pmatrix}$$
<span class="v-step">Halber Betrag</span>
$$A=\tfrac{1}{2}\cdot 12=6$$
<p class="v-res">Der Flächeninhalt beträgt $6$ Flächeneinheiten.</p>
<p>Kontrolle: das Dreieck liegt in der $xy$‑Ebene mit den Katheten $3$ und $4$, also $\tfrac12\cdot3\cdot4=6$ ✓</p>`
                },
                {
                    q: R`Bestimme eine Koordinatengleichung der Ebene durch $A(2/0/1)$, $B(3/2/1)$ und $C(2/1/4)$.`,
                    hint: R`Normalenvektor über $\overrightarrow{AB}\times\overrightarrow{AC}$, dann $d=\vec n\circ\vec a$.`,
                    sol: R`<span class="v-step">Spannvektoren</span>
$$\overrightarrow{AB}=\begin{pmatrix}1\\2\\0\end{pmatrix},\qquad \overrightarrow{AC}=\begin{pmatrix}0\\1\\3\end{pmatrix}$$
<span class="v-step">Normalenvektor</span>
$$\vec{n}=\overrightarrow{AB}\times\overrightarrow{AC}=\begin{pmatrix}2\cdot3-0\cdot1\\0\cdot0-1\cdot3\\1\cdot1-2\cdot0\end{pmatrix}=\begin{pmatrix}6\\-3\\1\end{pmatrix}$$
<span class="v-step">d aus dem Stützpunkt</span>
$$d=\vec{n}\circ\vec{a}=6\cdot2+(-3)\cdot0+1\cdot1=13$$
<p class="v-res">$E:\;6x-3y+z=13$</p>
<span class="v-step">Probe mit B und C</span>
<p>$B$: $18-6+1=13$ ✓  $C$: $12-3+4=13$ ✓</p>`
                },
                {
                    q: R`Prüfe, ob $\vec{a}=\begin{pmatrix}1\\0\\1\end{pmatrix}$, $\vec{b}=\begin{pmatrix}2\\1\\0\end{pmatrix}$ und $\vec{c}=\begin{pmatrix}0\\1\\-2\end{pmatrix}$ in einer Ebene liegen.`,
                    sol: R`<span class="v-step">Spatprodukt</span>
$$\vec{a}\times\vec{b}=\begin{pmatrix}0\cdot0-1\cdot1\\1\cdot2-1\cdot0\\1\cdot1-0\cdot2\end{pmatrix}=\begin{pmatrix}-1\\2\\1\end{pmatrix}$$
$$(\vec{a}\times\vec{b})\circ\vec{c}=(-1)\cdot0+2\cdot1+1\cdot(-2)=0$$
<p class="v-res">Das Spatprodukt ist $0$ — die drei Vektoren sind <b>komplanar</b>, sie liegen in einer Ebene und sind linear abhängig.</p>
<p>Tatsächlich ist $\vec{c}=2\vec{a}-\vec{b}$. Probe: $2\begin{pmatrix}1\\0\\1\end{pmatrix}-\begin{pmatrix}2\\1\\0\end{pmatrix}=\begin{pmatrix}0\\-1\\2\end{pmatrix}$ … das ist $-\vec c$, also $\vec c=\vec b-2\vec a$ ✓</p>`
                },
                {
                    q: R`Ein Parallelogramm wird von $\vec{u}=\begin{pmatrix}2\\-1\\2\end{pmatrix}$ und $\vec{v}=\begin{pmatrix}1\\2\\2\end{pmatrix}$ aufgespannt. Berechne seinen Flächeninhalt — und zusätzlich den Winkel zwischen den Seiten.`,
                    sol: R`<span class="v-step">Kreuzprodukt</span>
$$\vec{u}\times\vec{v}=\begin{pmatrix}(-1)\cdot2-2\cdot2\\2\cdot1-2\cdot2\\2\cdot2-(-1)\cdot1\end{pmatrix}=\begin{pmatrix}-6\\-2\\5\end{pmatrix}$$
<span class="v-step">Fläche</span>
$$A=|\vec{u}\times\vec{v}|=\sqrt{36+4+25}=\sqrt{65}\approx 8{,}06$$
<span class="v-step">Winkel über das Skalarprodukt</span>
$$\vec{u}\circ\vec{v}=2-2+4=4,\qquad |\vec{u}|=|\vec{v}|=3$$
$$\cos\varphi=\frac{4}{9}\;\Longrightarrow\;\varphi\approx 63{,}6°$$
<p class="v-res">$A=\sqrt{65}\approx 8{,}06$ und $\varphi\approx 63{,}6°$.</p>
<span class="v-step">Gegenprobe über den Sinus</span>
<p>$|\vec u||\vec v|\sin\varphi=9\cdot\sin(63{,}6°)\approx 9\cdot 0{,}896\approx 8{,}06$ ✓ — beide Formeln liefern dieselbe Fläche.</p>`
                },
            ]);
        },

        onShow(ctx) {
            ctx.stage3.onReady(() => { ctx.stage3.setRange(5); ctx.stage3.resetView(); });
            ctx.tip('Ziehen dreht · Mausrad zoomt');
            this.hud(ctx);
        },

        hud(ctx) {
            const { a, b, c } = S9;
            const x = V.cross(a, b);
            const area = V.len(x);
            let h = R`<div style="margin:2px 0">$\vec{a}\times\vec{b}=` + col(x) + '$</div>';
            h += `<div class="v-hud-row"><span class="v-hud-lab">Probe: senkrecht?</span><span class="v-hud-val">a∘(a×b) = ${num(V.dot(a, x), 3)} · b∘(a×b) = ${num(V.dot(b, x), 3)}</span></div>`;
            h += `<div class="v-hud-row"><span class="v-hud-lab">${S9.tri ? 'Dreiecksfläche' : 'Parallelogrammfläche'}</span>` +
                `<span class="v-hud-val" style="color:${COL.green}">${num(S9.tri ? area / 2 : area, 3)}</span></div>`;
            const ang = (V.isZero(a) || V.isZero(b)) ? NaN : G.angleVec(a, b);
            if (isFinite(ang)) h += R`<div style="margin:6px 0">$|\vec{a}||\vec{b}|\sin\varphi=` +
                T.num(V.len(a), 2) + R`\cdot` + T.num(V.len(b), 2) + R`\cdot\sin(` + T.num(ang, 1) + '°)=' + T.num(area, 3) + '$</div>';
            if (S9.spat) {
                const vol = G.spat(a, b, c);
                h += `<div class="v-hud-row"><span class="v-hud-lab">Spatprodukt</span><span class="v-hud-val" style="color:${COL.purple}">${num(vol, 3)}</span></div>`;
                h += `<div class="v-hud-row"><span class="v-hud-lab">Pyramide (1/6)</span><span class="v-hud-val">${num(Math.abs(vol) / 6, 3)}</span></div>`;
                h += `<div class="v-hud-note">${Math.abs(vol) < 1e-9
                    ? 'Volumen null — die drei Vektoren sind <b>komplanar</b>, also linear abhängig.'
                    : 'Volumen ungleich null — die drei Vektoren spannen wirklich den Raum auf.'}</div>`;
            } else {
                h += `<div class="v-hud-note">${area < 1e-9
                    ? 'a × b = 0 — die Vektoren sind parallel und spannen keine Fläche auf.'
                    : 'Der rote Pfeil steht senkrecht auf der ganzen aufgespannten Fläche.'}</div>`;
            }
            ctx.hud(h);
        },

        draw(st) {
            const O = [0, 0, 0], { a, b, c } = S9;
            const x = V.cross(a, b);
            if (S9.tri) st.poly3([O, a, b], COL.green, { alpha: 0.3 });
            else st.poly3([O, a, V.add(a, b), b], COL.green, { alpha: 0.22 });
            if (S9.spat) {
                // the six faces of the parallelepiped, drawn as translucent quads
                const P = [O, a, V.add(a, b), b].map(p => p);
                const Q = P.map(p => V.add(p, c));
                st.poly3(Q, COL.purple, { alpha: 0.14 });
                for (let i = 0; i < 4; i++) st.poly3([P[i], P[(i + 1) % 4], Q[(i + 1) % 4], Q[i]], COL.purple, { alpha: 0.12 });
                st.arrow3(O, c, COL.purple, 'c');
            }
            st.arrow3(O, a, COL.orange, 'a');
            st.arrow3(O, b, COL.blue, 'b');
            if (V.len(x) > 1e-9) {
                // scale the normal for readability, but say so in the label
                const shown = V.len(x) > 5 ? V.scale(V.unit(x), 4) : x;
                st.arrow3(O, shown, COL.red, 'a×b');
            }
        },
    });
})();
