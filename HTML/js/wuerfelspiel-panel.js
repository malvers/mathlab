// Würfelspiel (wuerfelspiel.html), part 8 of 9: panel updates, formula paragraphs, pointer and keys.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // Cheap updates that do not rebuild the panel
        function refreshPanelLive() {
            const m = model();
            const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
            if (S.mode === 'rundgang') {
                set('ws-count', (S.step + 1) + ' / ' + STATIONS.length);
                const btn = document.getElementById('ws-solita');
                if (btn) {
                    btn.textContent = Solita.on ? T('btn_solita_stop', '■ SOLITA STOPP')
                        : (Solita.held ? T('btn_solita_solution', '▶ ZUR LÖSUNG') : T('btn_solita', '▶ SOLITA ERKLÄRT'));
                    btn.classList.toggle('ws-on', Solita.on || Solita.held);
                }
                set('ws-solita-note', Solita.on
                    ? T('solita_on', 'Solita erklärt und blättert selbst weiter. <b>Leertaste</b> oder <b>s</b> hält sie an.')
                    : (Solita.held ? T('solita_held', 'Solita wartet: Erst rechnen, dann weiter zur Lösung.')
                        : T('solita_off', 'Solita liest den Rundgang mit ihrer Stimme aus dem Deck vor.')));
            } else {
                set('ws-count', (LAB_VIEWS.indexOf(S.view) + 1) + ' / ' + LAB_VIEWS.length);
                const line1 = d => '<div><b>' + d.name + ':</b> ' + katexStr(d.faces.slice().sort((a, b) => a - b).join(',\\;')) + '</div>';
                set('ws-dice', line1(m.A) + line1(m.B));
            }
            const mt = document.getElementById('ws-mtoggle');
            if (mt) mt.textContent = S.merge.grouped ? T('btn_unmerge', 'SECHS ÄSTE ZEIGEN') : T('btn_merge', 'ZUSAMMENFASSEN');
            const sr = document.getElementById('ws-simrun');
            if (sr) {
                sr.textContent = S.sim.running ? T('btn_simstop', 'ANHALTEN') : T('btn_simrun', 'DAUERLAUF');
                sr.classList.toggle('ws-on', S.sim.running);
            }
            const res = document.getElementById('ws-result');
            if (res) {
                const row = (cls, who, f) => '<div class="' + cls + '">' +
                    katexStr('P(\\text{' + who + '}) = ' + fr(f) + ' ' + pctEq(f)) + '</div>';
                let html = row('ws-a', m.A.name + ' gewinnt', m.pA) + row('ws-b', m.B.name + ' gewinnt', m.pB);
                if (m.nD) html += row('ws-d', 'unentschieden', m.pD);
                res.innerHTML = html;
            }
        }

        function renderCoach() {
            const box = document.getElementById('math-coach-box');
            if (box) box.classList.add('visible');
            const titleEl = document.getElementById('coach-title-slot');
            const body = document.getElementById('coach-content');
            let title, html;
            const m = model();
            if (S.mode === 'rundgang') {
                const st = STATIONS[S.step];
                title = T('st_' + st.id + '_title', st.title);
                html = (st.id === 'zwilling' && S.showSolution)
                    ? T('st_zwilling_solution', st.solutionBody)
                    : T('st_' + st.id + '_body', st.body);
            } else {
                title = viewName(S.view);
                html = LAB_TEXT[S.view] ? T('lab_' + S.view, LAB_TEXT[S.view], {
                    a: m.A.name, b: m.B.name, gA: gen(m.A.name), gB: gen(m.B.name), pA: fr(m.pA)
                }) : '';
            }
            // Keep the collapse button of coach-box.js: only the text span changes
            if (titleEl) {
                let span = titleEl.querySelector('.ws-ct');
                if (!span) {
                    span = document.createElement('span');
                    span.className = 'ws-ct';
                    titleEl.insertBefore(span, titleEl.firstChild);
                }
                span.textContent = title.toUpperCase();
            }
            if (body) body.innerHTML = texHTML(keepLastFormula(html));
        }

        // A paragraph that ends in a formula keeps it on one line with the word before it: a lone "1." or
        // "2/6 = 1/3." on the last line looked lost (Doc, 19.09.2026: "die 1 Punkt auf der nächsten Zeile, das ist nicht
        // so schön"). text-wrap: pretty (central) evens out plain words, but it does not move KaTeX. And a formula keeps
        // its punctuation: Chrome breaks between KaTeX and a comma, a line then started with ", also".
        function keepLastFormula(html) {
            const NOBR = '<span style="white-space:nowrap">';
            return String(html || '')
                .replace(/([^\s<>]+) (\$[^$]+\$[.!?:]?)(?=<br>|$)/g, NOBR + '$1 $2</span>')
                .replace(/(\$[^$]+\$)([.,;:!?)]+)/g, NOBR + '$1$2</span>');
        }

        /* ============================================================= RENDER */
        let VIEW = { ox: 0, oy: 0, sc: 1 };

        // The coach box floats top left over the stage - the view goes right of it or
        // below it, whichever lets it grow bigger. Measured on every frame.
        function stageRegions(rect) {
            // top: room for the canvas branding in the top right corner
            const pad = 14, top = 60;
            const full = { x: pad, y: top, w: rect.width - 2 * pad, h: rect.height - top - pad };
            const box = document.getElementById('math-coach-box');
            if (!box || !box.classList.contains('visible')) return [full];
            const b = box.getBoundingClientRect();
            const bx = b.right - rect.left, by = b.bottom - rect.top;
            const out = [];
            const right = { x: bx + pad, y: top, w: rect.width - bx - 2 * pad, h: rect.height - top - pad };
            const below = { x: pad, y: by + pad, w: rect.width - 2 * pad, h: rect.height - by - 2 * pad };
            [right, below].forEach(r => { if (r.w > 160 && r.h > 160) out.push(r); });
            return out.length ? out : [full];
        }

        function render() {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, rect.width, rect.height);
            if (rect.width < 20 || rect.height < 20) return;
            const m = model();
            const V = VIEWS[viewKey()];
            // Side by side reads better: the portrait design only wins when it grows clearly bigger
            // (a phone), not by a hair - lab on a whole deck slide: 0.629 tall vs 0.622 wide (Doc, 17.09.2026)
            const TALL_BONUS = 1.2;
            let best = null;
            stageRegions(rect).forEach(r => [false, true].forEach(tall => {
                const sz = V.size(m, tall);
                const sc = Math.min(r.w / sz.w, r.h / sz.h, 1.6);
                const score = tall ? sc / TALL_BONUS : sc;
                if (!best || score > best.score + 0.001) best = { r, tall, sz, sc, score };
            }));
            const ox = best.r.x + (best.r.w - best.sz.w * best.sc) / 2;
            const oy = best.r.y + Math.max(0, (best.r.h - best.sz.h * best.sc) / 2);
            VIEW = { ox, oy, sc: best.sc };
            hits.length = 0;
            if (window.Dice3D && Dice3D.ok) Dice3D.beginFrame();
            ctx.setTransform(dpr * best.sc, 0, 0, dpr * best.sc, dpr * ox, dpr * oy);
            try {
                V.draw(m, best.sz.w, best.sz.h, best.tall, performance.now());
            } catch (err) {
                dbg('Zeichenfehler in ' + viewKey() + ': ' + err.message);
            }
            if (window.Dice3D && Dice3D.ok) Dice3D.endFrame();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        let rafId = 0;

        function kick() {
            if (!rafId) rafId = requestAnimationFrame(tick);
        }

        function tick(now) {
            rafId = 0;
            let more = false;
            if (S.anim) {
                if (now - S.anim.t0 >= ROLL.total) finishRoll();
                else more = true;
            }
            if (S.merge.t0) {
                if (now - S.merge.t0 > MERGE_MS) S.merge.t0 = 0;
                more = true;   // one more frame draws the final state
            }
            if (S.sim.running) {
                simRun(clamp(Math.round(S.sim.n * 0.03), 1, 20000));
                if (S.sim.n >= 1e7) { S.sim.running = false; refreshPanelLive(); } else more = true;
            }
            render();
            if (more) kick();
        }

        /* -------------------------------------------------------------- Input */
        function hitAt(ev) {
            const r = canvas.getBoundingClientRect();
            const x = (ev.clientX - r.left - VIEW.ox) / VIEW.sc;
            const y = (ev.clientY - r.top - VIEW.oy) / VIEW.sc;
            for (let i = hits.length - 1; i >= 0; i--) {
                const h = hits[i];
                if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h;
            }
            return null;
        }

        canvas.addEventListener('pointerdown', ev => {
            const pk = document.getElementById('ws-pick');
            if (!pk.hidden) { closePicker(); return; }
            const h = hitAt(ev);
            if (h) { ev.preventDefault(); h.fn(h); }
        });

        canvas.addEventListener('pointermove', ev => {
            const h = hitAt(ev);
            canvas.style.cursor = h ? h.cursor : 'default';
        });

        window.addEventListener('keydown', ev => {
            if (ev.metaKey || ev.ctrlKey || ev.altKey) return;   // Cmd-Shift-R belongs to the browser
            const t = ev.target;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
            const k = ev.key, vk = viewKey();
            let done = true;
            if (k === 'ArrowRight') stepBy(1);
            else if (k === 'ArrowLeft') stepBy(-1);
            else if (k === ' ' && Solita.on) solitaStop();   // like the deck: space stops Solita
            else if (k === ' ') {
                if (vk === 'spiel' || vk === 'netze' || vk === 'zweistufig' || vk === 'flaeche') rollDice();
                else if (vk === 'sim') { simRun(1); render(); }
                else if (vk === 'merge') toggleMerge();
                else done = false;
            }
            else if (k === 'm') setMode(S.mode === 'labor' ? 'rundgang' : 'labor');
            else if (k === 's' && S.mode === 'rundgang') { if (Solita.on) solitaStop(); else if (Solita.held) setSolution(true); else solitaStart(); }
            else if (k === 'l' && vk === 'zwilling') setSolution(!S.showSolution);
            else if (k === 'z' && vk === 'merge') toggleMerge();
            else if (k === 'd' && vk === 'sim') simToggle();
            else if (/^[1-5]$/.test(k) && vk === 'fehler') { S.err = parseInt(k, 10) - 1; refreshErrRadio(); render(); }
            else if (k === 'Escape') closePicker();
            else done = false;
            if (done) ev.preventDefault();
        });

        /* ------------------------------------------------------------ 3D dice */
