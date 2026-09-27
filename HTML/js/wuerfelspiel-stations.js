// Würfelspiel (wuerfelspiel.html), part 7 of 9: the stations of the deck and Solita's voice.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // One station per aspect of the deck mathe11-wuerfelspiel. clips = Solita's narration of
        // the matching slides (same MP3s as the deck), slide = deck slide for "Deck öffnen".
        const seq = (s, n) => Array.from({ length: n }, (_, i) => s + '-' + String(i).padStart(2, '0'));

        const STATIONS = [
            {
                id: 'spiel', view: 'spiel', short: 'DAS SPIEL', slide: 3,
                clips: ['s01-00', 's02-00'].concat(seq('s03', 5)),
                onClip: c => { S.rulesHi = c === 's03-02' ? 0 : (c === 's03-03' ? 2 : -1); },
                title: 'Das Würfelspiel',
                body: 'Lena und Mia würfeln mit <b>zwei verschiedenen</b>, selbst beschrifteten Würfeln. Zuerst würfelt <b>Lena</b>, danach <b>Mia</b>. Wer die <b>größere Zahl</b> oben hat, gewinnt die Runde.<br><br>Unsere Fragen: Wie sieht das <b>Baumdiagramm</b> aus, und wie wahrscheinlich gewinnt Lena?<br><br>Tippe auf die Würfel und spiel ein paar Runden.'
            },
            {
                id: 'netze', view: 'netze', short: 'WÜRFELNETZE', slide: 4,
                clips: ['s04-00'],
                title: 'Die beiden Würfel als Netz',
                body: 'So sehen die Würfel aufgeklappt aus. Auf Lenas Würfel stehen $3$, $5$ und $7$, jede Zahl <b>zweimal</b>. Auf Mias Würfel steht die $4$ <b>viermal</b> und die $6$ zweimal. Gleiche Zahlen haben die gleiche Farbe.<br><br>Würfle: Die Fläche, die oben liegt, leuchtet im Netz auf.'
            },
            {
                id: 'zweistufig', view: 'zweistufig', short: 'ZWEISTUFIG', slide: 5,
                clips: seq('s05', 5),
                title: 'Was heißt zweistufig?',
                body: 'Es wird <b>zweimal nacheinander</b> gewürfelt, das sind zwei <b>Stufen</b>: Stufe $1$ ist Lenas Wurf, Stufe $2$ ist Mias Wurf.<br><br>Im Baum sind das zwei Ebenen von Ästen, von links nach rechts. Jeder Weg von ganz links nach ganz rechts ist <b>ein möglicher Ausgang</b>. Würfle und verfolge den Weg.'
            },
            {
                id: 'zaehlen', view: 'zaehlen', short: 'WÜRFEL LESEN', slide: 7,
                clips: ['s06-00'].concat(seq('s07', 3), seq('s08', 3)),
                onClip: c => { S.focus = c.startsWith('s07') ? 'A' : (c.startsWith('s08') ? 'B' : null); },
                title: 'Die Würfel lesen',
                body: 'Jede Fläche kommt gleich oft nach oben, also einfach <b>zählen</b>: Wie oft steht die Zahl drauf? Bei Lena stehen $3$, $5$ und $7$ je $2$-mal von $6$, also $\\frac{2}{6} = \\frac{1}{3}$.<br><br><b>Achtung bei Mia:</b> Die $4$ steht <b>viermal</b> drauf, also $\\frac{4}{6} = \\frac{2}{3}$ und nicht $\\frac{1}{2}$! Zur Kontrolle ergeben die Wahrscheinlichkeiten eines Würfels immer $1$.'
            },
            {
                id: 'merge', view: 'merge', short: 'ÄSTE ZUSAMMENFASSEN', slide: 9,
                clips: seq('s09', 5),
                onClip: c => {
                    if (c === 's09-01') { S.merge.die = 'A'; toggleMerge(false); }
                    else if (c === 's09-02') toggleMerge(true);
                    else if (c === 's09-03') { S.merge.die = 'B'; toggleMerge(true); }
                },
                title: 'Der wichtigste Trick',
                body: 'Man <b>könnte</b> sechs Äste mit je $\\frac{1}{6}$ zeichnen. Das ist nicht falsch, aber unübersichtlich. Einfacher: <b>gleiche Zahlen zu einem Ast</b> zusammenfassen, ihre Sechstel werden addiert.<br><br>Dann hat Lena $3$ Äste und Mia $2$. Die Äste, die an einem Punkt starten, ergeben zusammen immer $1$. Tippen schaltet um.'
            },
            {
                id: 'stufe1', view: 'stufe1', short: 'BAUM: STUFE 1', slide: 11,
                clips: ['s10-00', 's11-00'],
                title: 'Stufe 1: Lenas Wurf',
                body: 'Vom Startpunkt gehen drei Äste ab: zur $3$, zur $5$ und zur $7$. An jedem Ast steht $\\frac{1}{3}$.<br><br>Rechts stehen dieselben Werte in einer kleinen Tabelle, auch in Prozent: jeweils rund $33{,}3\\,\\%$.'
            },
            {
                id: 'stufe2', view: 'stufe2', short: 'BAUM: STUFE 2', slide: 12,
                clips: seq('s12', 5),
                title: 'Stufe 2: Mias Wurf',
                body: 'An <b>jedes</b> der drei Enden hängen wir Mias zwei Äste: $4$ und $6$. Mia würfelt immer mit <b>demselben</b> Würfel, also steht überall $\\frac{2}{3}$ bei der $4$ und $\\frac{1}{3}$ bei der $6$.<br><br>Lenas Ergebnis ändert nichts an Mias Würfel: Die Würfe sind <b>unabhängig</b>. Am Ende gibt es $3 \\cdot 2 = 6$ Wege.'
            },
            {
                id: 'pfad', view: 'pfad', short: 'PFADREGEL', slide: 13,
                clips: ['s13-00'].concat(seq('s14', 5)),
                onClip: c => { if (c === 's14-02') S.sel = 0; else if (c === 's14-03') S.sel = 1; },
                title: 'Die Pfadregel',
                body: 'Die Wahrscheinlichkeit eines Weges: alle Äste auf dem Weg <b>malnehmen</b>. Weg $(3 \\mid 4)$: $\\frac{1}{3} \\cdot \\frac{2}{3} = \\frac{2}{9}$.<br><br>Tippe einen Weg an, rechts steht seine Rechnung. Grün sind die Wege, auf denen Lena gewinnt. Kontrolle: Alle sechs Wege ergeben zusammen $1$.'
            },
            {
                id: 'tabelle', view: 'tabelle', short: 'WER GEWINNT?', slide: 16,
                clips: ['s15-00'].concat(seq('s16', 2)),
                onClip: c => { if (c === 's16-01') S.sel = 5; },
                title: 'Wer gewinnt?',
                body: 'Jeder Ausgang einzeln: welcher Weg, welche Zahlen, wer gewinnt und wie wahrscheinlich das ist.<br><br>Lena gewinnt auf <b>drei</b> Wegen: $(5 \\mid 4)$, $(7 \\mid 4)$ und auch $(7 \\mid 6)$, denn die $7$ schlägt die $6$!'
            },
            {
                id: 'summe', view: 'summe', short: 'SUMMENREGEL', slide: 17,
                clips: seq('s17', 5),
                title: 'Die Summenregel',
                body: 'Alle Wege, auf denen Lena gewinnt, werden <b>addiert</b>:<br>$P(\\text{Lena gewinnt}) = \\frac{2}{9} + \\frac{2}{9} + \\frac{1}{9} = \\frac{5}{9} \\approx 55{,}6\\,\\%$<br><br>Gegenprobe Mia: $\\frac{4}{9}$, und $\\frac{5}{9} + \\frac{4}{9} = 1$. Unentschieden gibt es nicht: Die Würfel haben <b>keine gemeinsame Zahl</b>.'
            },
            {
                id: 'fehler', view: 'fehler', short: 'TYPISCHE FEHLER', slide: 18,
                clips: seq('s18', 6),
                onClip: c => { const n = parseInt(c.slice(4), 10); if (c.startsWith('s18') && n >= 1) { S.err = n - 1; refreshErrRadio(); } },
                title: 'Die typischen Fehler',
                body: 'Fünf Fehler, die immer wieder passieren. Wähle links einen aus: Der Baum zeigt, <b>wo</b> es schiefgeht, rechts steht die falsche Rechnung über der richtigen.'
            },
            {
                id: 'rezept', view: 'rezept', short: 'MERKSATZ & REZEPT', slide: 20,
                clips: ['s20-00'].concat(seq('s21', 6)),
                onClip: c => { const n = parseInt(c.slice(4), 10); S.recipeHi = c.startsWith('s21') && n >= 1 ? n - 1 : -1; },
                title: 'Merksatz und Rezept',
                body: '<b>Entlang</b> eines Pfades wird <b>multipliziert</b>, <b>verschiedene</b> Pfade zum selben Ereignis werden <b>addiert</b>.<br><br>Das Rezept in fünf Schritten steht rechts. Tippe einen Schritt an, um direkt zur passenden Station zu springen.'
            },
            {
                id: 'sim', view: 'sim', short: 'SIMULATION', slide: -1,
                clips: [],
                title: 'Stimmt das wirklich?',
                body: 'Lass den Computer würfeln: Je mehr Runden, desto näher rückt Lenas <b>relative Häufigkeit</b> an die Wahrscheinlichkeit $\\frac{5}{9} \\approx 0{,}556$ heran. Das ist das <b>Gesetz der großen Zahlen</b>.<br><br>Tippen: Dauerlauf an oder aus.'
            },
            {
                id: 'efron', view: 'efron', short: 'FUN FACTS', slide: 22,
                clips: seq('s22', 5),
                onClip: c => { if (c === 's22-02') S.efron = 'AB'; else if (c === 's22-03') S.efron = 'DA'; },
                title: 'Fun Facts',
                body: 'Tippe einen Pfeil an und sieh nach, warum.'
            },
            {
                id: 'zwilling', view: 'zwilling', short: 'ZWILLINGSAUFGABE', slide: 23, dice: 'zwilling',
                clips: seq('s23', 6), solution: seq('s24', 5),
                title: 'Jetzt ihr: die Zwillingsaufgabe',
                body: 'Pauls Würfel: $1, 1, 5, 5, 6, 6$<br>Jonas’ Würfel: $2, 2, 2, 4, 4, 4$<br><br><b>a)</b> Zeichnet das Baumdiagramm und schreibt an jeden Ast die Wahrscheinlichkeit.<br><b>b)</b> Wie groß ist die Wahrscheinlichkeit, dass Paul gewinnt?<br><br>Tipp: Geht das Rezept Schritt für Schritt durch. Dann links <b>Lösung zeigen</b>.',
                solutionBody: 'Paul: $1$, $5$ und $6$ je $\\frac{2}{6} = \\frac{1}{3}$. Jonas: $2$ und $4$ je $\\frac{3}{6} = \\frac{1}{2}$. Jeder Weg: $\\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$.<br><br>Paul gewinnt bei $(5 \\mid 2)$, $(5 \\mid 4)$, $(6 \\mid 2)$ und $(6 \\mid 4)$, mit der $1$ nie:<br>$P(\\text{Paul gewinnt}) = 4 \\cdot \\frac{1}{6} = \\frac{2}{3} \\approx 66{,}7\\,\\%$'
            }
        ];

        /* ------------------------------------------------ Texts in the lab */
        // {a} {b} = player names, {gA} {gB} = their genitive, {pA} = TeX of P(a wins)
        const LAB_TEXT = {
            spiel: '{a} würfelt zuerst, dann {b}. Wer die <b>größere Zahl</b> oben hat, gewinnt. Tippen oder Leertaste: würfeln.',
            netze: 'Im Labor gehören die Würfel dir: im Netz auf ein <b>Feld</b> tippen und eine neue Zahl wählen. Alle Ansichten rechnen sofort mit. Tippen auf einen Würfel lässt beide rollen, ziehen dreht ihn.',
            zweistufig: 'Zwei Würfe nacheinander sind zwei <b>Stufen</b>: erst {gA} Wurf, dann {gB} Wurf. Jeder Weg durch den Baum ist ein Ausgang.',
            zaehlen: 'Wahrscheinlichkeit einer Zahl: <b>Anzahl ihrer Flächen durch $6$</b>, dann kürzen. Zeile antippen: Ihre Flächen leuchten im Netz.',
            merge: 'Gleiche Zahlen zu <b>einem Ast</b> zusammenfassen: Ihre Sechstel werden addiert. Tippen schaltet um.',
            stufe1: 'Stufe $1$: ein Ast für jede Zahl auf {gA} Würfel. Zusammen ergeben die Äste $1$.',
            stufe2: 'An <b>jedes</b> Ende hängen {gB} Äste, überall dieselben: Die Würfe sind unabhängig.',
            pfad: '<b>Pfadregel:</b> Entlang eines Weges werden die Wahrscheinlichkeiten <b>multipliziert</b>. Weg antippen.',
            tabelle: 'Jeder Ausgang einzeln: Weg, Zahlen, Sieger und Wahrscheinlichkeit. Zeile antippen.',
            summe: '<b>Summenregel:</b> Alle Wege zum selben Ereignis werden <b>addiert</b>.',
            flaeche: 'Das ganze Spiel als <b>Fläche</b>: oben die sechs Flächen von {a}, links die von {b}. Jedes der 36 Kästchen ist gleich wahrscheinlich: <b>grün</b> gewinnt {a}, <b>rot</b> gewinnt {b}, <b>grau</b> ist unentschieden. Jeder Wurf setzt einen Punkt.',
            fehler: 'Fünf typische Fehler, gerechnet mit <b>deinen</b> Würfeln: falsch über richtig.',
            sim: 'Der Computer würfelt: Die <b>relative Häufigkeit</b> nähert sich der Wahrscheinlichkeit ${pA}$. Tippen: Dauerlauf an oder aus.',
            efron: 'Bradley Efrons nicht-transitive Würfel. <b>Pfeil antippen</b>: Das Paar wird ins Labor geladen.'
        };

        /* ------------------------------------------------------ Solita erklärt */
        // Her DocPad voice from the deck clips - never a browser voice
        const AUDIO_DIR = 'decks/audio/mathe11-wuerfelspiel/';
        const Solita = { on: false, held: false, queue: [], pos: 0, timer: 0 };
        // Doc: "zu schnell" - breathing room after every sentence and before the next station
        const PAUSE_CLIP = 1400, PAUSE_STATION = 3200;
        const solitaAudio = new Audio();
        solitaAudio.preload = 'auto';

        solitaAudio.addEventListener('ended', () => {
            if (!Solita.on) return;
            Solita.pos++;
            clearTimeout(Solita.timer);
            Solita.timer = setTimeout(playClip, Solita.pos < Solita.queue.length ? PAUSE_CLIP : 0);
        });
        solitaAudio.addEventListener('error', () => {
            if (!Solita.on) return;
            dbg('Solita: Clip fehlt ' + solitaAudio.src);
            Solita.pos++;
            playClip();
        });

        function stationClips(st) {
            return (st.id === 'zwilling' && S.showSolution) ? st.solution : st.clips;
        }

        function solitaStart() {
            if (S.mode !== 'rundgang') return;
            Solita.on = true;
            Solita.held = false;
            playStation();
        }

        function solitaStop() {
            Solita.on = false;
            Solita.held = false;
            clearTimeout(Solita.timer);
            try { solitaAudio.pause(); } catch (e) { }
            refreshPanelLive();
        }

        function playStation() {
            clearTimeout(Solita.timer);
            try { solitaAudio.pause(); } catch (e) { }
            const st = STATIONS[S.step];
            Solita.queue = stationClips(st);
            Solita.pos = 0;
            refreshPanelLive();
            if (!Solita.queue.length) {
                // no narration here (simulation): let the dice run for a moment, then go on
                simToggle(true);
                Solita.timer = setTimeout(() => {
                    simToggle(false);
                    if (Solita.on) gotoStep(S.step + 1);
                }, 5000);
                return;
            }
            playClip();
        }

        function playClip() {
            if (!Solita.on) return;
            const st = STATIONS[S.step];
            if (Solita.pos >= Solita.queue.length) {
                if (st.id === 'zwilling' && !S.showSolution) {
                    // the deck holds here: the class works first, the solution comes on a click
                    Solita.on = false;
                    Solita.held = true;
                    refreshPanelLive();
                    return;
                }
                if (S.step >= STATIONS.length - 1) { solitaStop(); return; }
                // let the last picture stand for a moment before the page turns
                clearTimeout(Solita.timer);
                Solita.timer = setTimeout(() => { if (Solita.on) gotoStep(S.step + 1); }, PAUSE_STATION);
                return;
            }
            const clip = Solita.queue[Solita.pos];
            if (st.onClip) st.onClip(clip);
            render();
            solitaAudio.src = AUDIO_DIR + clip + '.mp3';
            solitaAudio.play().catch(err => {
                dbg('Solita: Wiedergabe blockiert (' + err.message + ')');
                solitaStop();
            });
        }

        /* ========================================================== NAVIGATION */
        const viewKey = () => S.mode === 'labor' ? S.view : STATIONS[S.step].view;

        function resetStationState() {
            S.rulesHi = -1;
            S.focus = null;
            S.recipeHi = -1;
            S.sel = 0;
            S.countHi = { A: null, B: null };
            S.merge = { die: 'B', grouped: true, u: 1, t0: 0, from: 1 };
            S.showSolution = false;
            if (S.sim.running) S.sim.running = false;
            closePicker();
        }

        function gotoStep(i) {
            const next = clamp(i, 0, STATIONS.length - 1);
            if (next === S.step && S.mode === 'rundgang') return;
            clearTimeout(Solita.timer);
            S.step = next;
            resetStationState();
            buildUI();
            render();
            if (Solita.on) playStation();
            else if (Solita.held) { Solita.held = false; refreshPanelLive(); }
            dbg('Station ' + (S.step + 1) + ': ' + STATIONS[S.step].short);
        }

        function setView(k) {
            if (!VIEWS[k]) return;
            S.view = k;
            resetStationState();
            buildUI();
            render();
        }

        function stepBy(d) {
            if (S.mode === 'rundgang') { gotoStep(S.step + d); return; }
            const i = LAB_VIEWS.indexOf(S.view);
            setView(LAB_VIEWS[(i + d + LAB_VIEWS.length) % LAB_VIEWS.length]);
        }

        function jumpToView(k) {
            if (S.mode === 'rundgang') {
                const i = STATIONS.findIndex(s => s.view === k);
                if (i >= 0) gotoStep(i);
            } else if (LAB_VIEWS.indexOf(k) >= 0) setView(k);
        }

        function setMode(mode) {
            if (mode === S.mode) return;
            solitaStop();
            S.mode = mode;
            resetStationState();
            buildUI();
            render();
        }

        function setSolution(v) {
            S.showSolution = v;
            buildUI();
            render();
            if (v && Solita.held) solitaStart();
            else if (!v && Solita.on) solitaStop();
        }

        function onDiceChanged() {
            S.last = null;
            S.anim = null;
            S.sel = 0;
            S.countHi = { A: null, B: null };
            S.sim.running = false;
            buildUI();
            render();
            dbg('Würfel: ' + S.lab.a.name + ' [' + S.lab.a.faces.join(',') + '] gegen ' + S.lab.b.name + ' [' + S.lab.b.faces.join(',') + ']');
        }

        function setPreset(id) {
            if (!PRESETS[id]) return;
            S.lab = presetDice(id);
            S.labPreset = id;
            onDiceChanged();
        }

        function randomDice() {
            const one = () => {
                const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                const vals = pool.slice(0, 2 + Math.floor(Math.random() * 2));
                const faces = vals.slice();
                while (faces.length < 6) faces.push(vals[Math.floor(Math.random() * vals.length)]);
                return faces.sort(() => Math.random() - 0.5);
            };
            S.lab = { a: { name: S.lab.a.name, faces: one() }, b: { name: S.lab.b.name, faces: one() } };
            S.labPreset = 'eigene';
            onDiceChanged();
        }

        function swapDice() {
            S.lab = { a: S.lab.b, b: S.lab.a };
            S.labPreset = 'eigene';
            onDiceChanged();
        }

        function pickEfron(pair) {
            S.efron = pair;
            if (S.mode === 'labor') {
                S.lab = presetDice('efron' + pair);
                S.labPreset = 'efron' + pair;
                onDiceChanged();
            } else render();
        }

        /* --------------------------------------------------------- Face picker */
        function openPicker(key, idx, h) {
            if (S.mode !== 'labor') return;
            const pk = document.getElementById('ws-pick');
            const die = key === 'A' ? S.lab.a : S.lab.b;
            pk.innerHTML = '';
            for (let v = 0; v <= 9; v++) {
                const b = document.createElement('button');
                b.type = 'button';
                if (v === die.faces[idx]) b.className = 'on';
                b.innerHTML = katexStr(String(v));
                b.addEventListener('click', e => {
                    e.stopPropagation();
                    die.faces[idx] = v;
                    S.labPreset = 'eigene';
                    closePicker();
                    onDiceChanged();
                });
                pk.appendChild(b);
            }
            pk.hidden = false;
            const cw = container.clientWidth, chh = container.clientHeight;
            const pw = pk.offsetWidth, ph = pk.offsetHeight;
            let x = VIEW.ox + (h.x + h.w) * VIEW.sc + 8;
            if (x + pw > cw - 8) x = VIEW.ox + h.x * VIEW.sc - pw - 8;
            const y = VIEW.oy + h.y * VIEW.sc;
            pk.style.left = clamp(x, 8, Math.max(8, cw - pw - 8)) + 'px';
            pk.style.top = clamp(y, 8, Math.max(8, chh - ph - 8)) + 'px';
        }

        function closePicker() {
            const pk = document.getElementById('ws-pick');
            if (pk) pk.hidden = true;
        }

        document.addEventListener('pointerdown', ev => {
            const pk = document.getElementById('ws-pick');
            if (pk && !pk.hidden && !pk.contains(ev.target) && ev.target !== canvas) closePicker();
        });

        /* ================================================================= UI */
        function katexStr(src, display) {
            if (!window.katex) return src;
            try { return katex.renderToString(src, { throwOnError: false, displayMode: !!display }); }
            catch (e) { return src; }
        }

        // $...$ inside HTML becomes KaTeX
        function texHTML(html) {
            if (!window.katex) return html;
            return html.replace(/\$([^$]+)\$/g, (_, src) => katexStr(src));
        }

        const on = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };

        function showResult() {
            if (S.mode === 'labor') return true;
            const st = STATIONS[S.step];
            if (st.id === 'zwilling') return S.showSolution;
            return S.step >= STATIONS.findIndex(s => s.id === 'summe');
        }

        function contextCard(vk) {
            const roll = '<div class="ws-btns"><button class="cyber-btn" id="ws-roll">' + T('btn_roll', 'WÜRFELN') + '</button>' +
                '<button class="cyber-btn" id="ws-score0">' + T('btn_score0', 'PUNKTE LÖSCHEN') + '</button></div>' +
                '<div class="lab-note">' + T('hint_roll', 'Leertaste oder Tippen auf die Bühne würfelt.') + '</div>';
            switch (vk) {
                case 'spiel': case 'netze': case 'zweistufig': return roll;
                case 'flaeche': return roll + '<div class="ws-btns" style="margin-top:10px">' +
                    '<button class="cyber-btn" id="ws-sim100">' + T('btn_sim100', 'HUNDERT') + '</button>' +
                    '<button class="cyber-btn" id="ws-sim1000">' + T('btn_sim1000', 'TAUSEND') + '</button>' +
                    '<button class="cyber-btn" id="ws-simrun"></button>' +
                    '<button class="cyber-btn" id="ws-simreset">' + T('btn_simreset', 'NEU STARTEN') + '</button></div>' +
                    '<div class="lab-note">' + T('hint_flaeche', 'Jeder Wurf setzt einen Punkt in sein Kästchen. Die Punkte teilt sich die Ansicht mit der <b>Simulation</b>.') + '</div>';
                case 'zaehlen': return '<div class="lab-note">' + T('hint_count', 'Zeile antippen: Die Flächen dieser Zahl leuchten im Netz.') + '</div>';
                case 'merge': return '<div id="ws-mdie"></div><div class="ws-btns" style="margin-top:10px"><button class="cyber-btn" id="ws-mtoggle"></button></div>';
                case 'pfad': case 'tabelle': return '<div class="lab-note">' + T('hint_path', 'Einen Weg antippen: Seine Rechnung erscheint.') + '</div>';
                case 'fehler': return '<div id="ws-errs"></div>';
                case 'rezept': return '<div class="lab-note">' + T('hint_recipe', 'Schritt antippen: Sprung zur passenden Station.') + '</div>';
                case 'sim': return '<div class="ws-btns">' +
                    '<button class="cyber-btn" id="ws-sim1">' + T('btn_sim1', 'EINE RUNDE') + '</button>' +
                    '<button class="cyber-btn" id="ws-sim100">' + T('btn_sim100', 'HUNDERT') + '</button>' +
                    '<button class="cyber-btn" id="ws-sim1000">' + T('btn_sim1000', 'TAUSEND') + '</button>' +
                    '<button class="cyber-btn" id="ws-simrun"></button>' +
                    '<button class="cyber-btn" id="ws-simreset">' + T('btn_simreset', 'NEU STARTEN') + '</button></div>';
                case 'zwilling': return '<div id="ws-sol"></div>';
                case 'efron': return '<div class="lab-note">' + T('hint_efron', 'Pfeil antippen: Rechnung für dieses Paar.') + '</div>';
                default: return '';
            }
        }

        function refreshErrRadio() {
            const slot = document.getElementById('ws-errs');
            if (!slot) return;
            slot.innerHTML = '';
            CyberUI.createRadioGroup('ws-errs', null, ERR_LABELS.map((l, i) => ({ label: (i + 1) + '  ' + T('err_' + i, l), value: String(i) })),
                String(S.err), v => { S.err = parseInt(v, 10); render(); });
        }

        function buildUI() {
            document.getElementById('ui-container').innerHTML = '';

            CyberUI.createCard('ui-container', T('card_mode', 'Modus'),
                '<div id="ws-mode-slot"></div><div class="lab-note">' + T('hint_mode', 'Taste <b>m</b> wechselt zwischen Rundgang und Labor.') + '</div>');
            CyberUI.createRadioGroup('ws-mode-slot', null, [
                { label: T('mode_tour', 'RUNDGANG (WIE IM DECK)'), value: 'rundgang' },
                { label: T('mode_lab', 'LABOR (EIGENE WÜRFEL)'), value: 'labor' }
            ], S.mode, setMode);

            if (S.mode === 'rundgang') {
                CyberUI.createCard('ui-container', T('card_tour', 'Rundgang'), `
                    <div class="step-nav">
                        <button class="cyber-btn" id="ws-prev" title="${T('prev', 'Zurück')}">◀</button>
                        <div class="step-count" id="ws-count"></div>
                        <button class="cyber-btn" id="ws-next" title="${T('next', 'Weiter')}">▶</button>
                    </div>
                    <div id="ws-jump" style="margin-top:12px"></div>
                    <div class="ws-btns" style="margin-top:12px">
                        <button class="cyber-btn" id="ws-solita"></button>
                        <button class="cyber-btn" id="ws-deck">${T('btn_deck', 'DECK ÖFFNEN')}</button>
                    </div>
                    <div class="lab-note" id="ws-solita-note"></div>`, 'rgb(245, 194, 66)');
                CyberUI.createDropdown('ws-jump', STATIONS.map((s, i) => ({ id: String(i), label: (i + 1) + ' • ' + T('st_' + s.id + '_short', s.short) })),
                    id => gotoStep(parseInt(id, 10)), String(S.step));
                on('ws-prev', 'click', () => stepBy(-1));
                on('ws-next', 'click', () => stepBy(1));
                on('ws-solita', 'click', () => { if (Solita.on) solitaStop(); else if (Solita.held) setSolution(true); else solitaStart(); });
                on('ws-deck', 'click', () => {
                    const sl = STATIONS[S.step].slide;
                    window.open('decks/mathe11-wuerfelspiel.html' + (sl >= 0 ? '#' + (sl + 1) : ''), '_blank');
                });
            } else {
                const presetOpts = Object.keys(PRESETS).map(k => ({ id: k, label: PRESETS[k].label.toUpperCase() }));
                if (S.labPreset === 'eigene') presetOpts.unshift({ id: 'eigene', label: T('preset_own', 'EIGENE WÜRFEL') });
                CyberUI.createCard('ui-container', T('card_dice', 'Würfel'), `
                    <div id="ws-preset"></div>
                    <div class="ws-btns" style="margin-top:10px">
                        <button class="cyber-btn" id="ws-random">${T('btn_random', 'ZUFÄLLIG')}</button>
                        <button class="cyber-btn" id="ws-swap">${T('btn_swap', 'TAUSCHEN')}</button>
                    </div>
                    <div class="ws-dice" id="ws-dice" style="margin-top:10px"></div>
                    <div class="lab-note">${T('hint_faces', 'In den Ansichten <b>Würfelnetze</b> und <b>Würfel lesen</b> im aufgeklappten Netz auf ein <b>Feld</b> tippen und eine neue Zahl wählen – nicht auf den 3D-Würfel, der würfelt nur.')}</div>`);
                CyberUI.createDropdown('ws-preset', presetOpts, id => { if (id !== 'eigene') setPreset(id); }, S.labPreset);
                on('ws-random', 'click', randomDice);
                on('ws-swap', 'click', swapDice);

                CyberUI.createCard('ui-container', T('card_view', 'Ansicht'), `
                    <div class="step-nav">
                        <button class="cyber-btn" id="ws-prev">◀</button>
                        <div class="step-count" id="ws-count"></div>
                        <button class="cyber-btn" id="ws-next">▶</button>
                    </div>
                    <div id="ws-view" style="margin-top:12px"></div>`);
                CyberUI.createDropdown('ws-view', LAB_VIEWS.map(k => ({ id: k, label: viewName(k).toUpperCase() })), setView, S.view);
                on('ws-prev', 'click', () => stepBy(-1));
                on('ws-next', 'click', () => stepBy(1));
            }

            const vk = viewKey();
            const ctxHTML = contextCard(vk);
            if (ctxHTML) CyberUI.createCard('ui-container', viewName(vk), ctxHTML, 'rgb(121, 158, 49)');
            on('ws-roll', 'click', rollDice);
            on('ws-score0', 'click', () => { S.score = { key: '', n: 0, A: 0, B: 0, D: 0 }; S.last = null; render(); });
            if (document.getElementById('ws-mdie')) {
                const m = model();
                CyberUI.createRadioGroup('ws-mdie', null, [
                    { label: dieTitle(m.A.name).toUpperCase(), value: 'A' },
                    { label: dieTitle(m.B.name).toUpperCase(), value: 'B' }
                ], S.merge.die, v => { S.merge.die = v; render(); });
                on('ws-mtoggle', 'click', () => toggleMerge());
            }
            refreshErrRadio();
            on('ws-sim1', 'click', () => { simRun(1); render(); });
            on('ws-sim100', 'click', () => { simRun(100); render(); });
            on('ws-sim1000', 'click', () => { simRun(1000); render(); });
            on('ws-simrun', 'click', () => simToggle());
            on('ws-simreset', 'click', () => { simReset(model()); render(); refreshPanelLive(); });
            if (document.getElementById('ws-sol')) {
                CyberUI.createCheckbox('ws-sol', T('show_solution', 'LÖSUNG ZEIGEN'), S.showSolution, setSolution, 'rgb(121, 158, 49)');
            }

            if (showResult()) {
                CyberUI.createCard('ui-container', T('card_result', 'Ergebnis'), '<div class="ws-res" id="ws-result"></div>', 'rgb(160, 212, 70)');
            }

            CyberUI.createCard('ui-container', T('card_keys', 'Tasten'), '<div class="lab-note" style="margin-top:0">' + (S.mode === 'rundgang'
                ? T('keys_tour', '<b>◀ ▶</b> Station, <b>Leertaste</b> würfeln, <b>s</b> Solita, <b>m</b> Labor, <b>z</b> zusammenfassen, <b>d</b> Dauerlauf, <b>l</b> Lösung, Ziffern wählen den Fehler.')
                : T('keys_lab', '<b>◀ ▶</b> Ansicht, <b>Leertaste</b> würfeln, <b>m</b> Rundgang, <b>z</b> zusammenfassen, <b>d</b> Dauerlauf, Ziffern wählen den Fehler.')) + '</div>');

            refreshPanelLive();
            renderCoach();
        }
