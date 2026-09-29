// js/solita-frage.js — Solita's question box for labs: ask about what the page shows right now, Claude (Haiku)
// answers, her DocPad voice (Studio-C via the tts edge function) reads it out — NEVER the browser voice (Doc).
// Same endpoints, password key ('dev_access'), request shape and right-click menu as the box in the decks
// (decks/deck.js, "Ask Solita"); deck.js still carries its own copy of this until it is switched over to this file.
// The API keys live in the Supabase edge functions, never here (Rule 21) — the shared password gates the proxy.
// First used by the Ziffernrätsel lab (Doc, 29.09.2026: "Bau auch wie in Decks Solita ein, die pro step Fragen
// noch gründlicher erklären kann").
//
//   const s = SolitaFrage.mount(el, {
//       kontext: () => 'what the page shows now',   // travels with every question
//       system: 'the lab's own instructions',
//       vorschlaege: [{ label: 'Genauer', frage: 'Erklär mir das genauer.' }],   // ready-made questions
//       platzhalter: 'Frag Solita',
//   });
//   s.frage(text)       ask, as if typed
//   s.vorlesen(text)    read a text in her voice ($...$ formulas are spoken, HTML tags dropped)
//   s.stop()            stop her voice
//   s.leeren()          clear the talk and her memory of it (e.g. when the page switches to another task)
(function (global) {
    const AI_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
    const TTS_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';
    // DeepSeek answers beside her if the right-click menu says so; its proxy opens only for Doc's own password
    const DS_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/deepseek';
    const MODEL = 'claude-haiku-4-5';
    const DS_MODEL = 'deepseek-chat';
    // the same device settings as solita.html and the decks: speaker on/off ('1'/'0'), who answers, whose voice
    const TTS_KEY = 'solita_tts';
    const WHO_KEY = 'solita_ai';
    const VOICE_KEY = 'solita_voice:' + location.pathname;
    const HIST_MAX = 4;                  // exchanges that travel along, so "und warum?" makes sense
    const TTS_WAIT = 20000;              // ms — a hanging voice must not hide the answer
    const HIER = document.currentScript ? document.currentScript.src : location.href;
    const SOLITA_PIC = new URL('../resources/solita-avatar.png', HIER).href;
    const DOC_PIC = new URL('../resources/team/alvers_blick.png', HIER).href;

    const ICON = {
        send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>',
        tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
        mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
        stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/></svg>',
        an: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
        aus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/></svg>',
    };

    // Word spans, formulas as words, the voice's text and the karaoke: js/solita-karaoke.js, shared with the decks
    // (Doc, 29.09.2026: "das word hiliting wie im Deck (zentralisieren!)"). The page loads it before this file.
    const SK = function () { return global.SolitaKaraoke; };
    const WORT = 'sf-w';                            // class of a word span in the answers
    function render(el, text) {
        if (SK()) SK().render(el, text, { absaetze: true, wort: WORT });
        else { el.textContent = text; el.dataset.src = text; }
    }
    function sprechbar(text) { return SK() ? SK().sprechbar(text) : String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

    function pwd() { try { return localStorage.getItem('dev_access') || ''; } catch (e) { return ''; } }
    // A password as it comes from the clipboard: without the invisible passengers a copy brings along - line breaks,
    // no-break spaces, zero-width and direction marks - and without spaces at either end
    function sauber(t) {
        return String(t || '').replace(/[\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u2064\uFEFF\r\n\t]/g, '')
            .replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
    }
    function lies(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
    function merke(key, v) { try { localStorage.setItem(key, v); } catch (e) { } }
    // Every call is a CORS "simple request": no custom headers, the password rides in the body (see deck.js:
    // custom headers cost a preflight of several seconds before every call).
    function post(url, body, signal) {
        return fetch(url, { method: 'POST', body: JSON.stringify(body), signal: signal });
    }
    function dbg(msg) { if (global.DebugWindow && global.DebugWindow.log) global.DebugWindow.log('[solita-frage] ' + msg); }

    let zaehler = 0;
    function mount(host, opt) {
        opt = opt || {};
        const nr = ++zaehler;
        const root = document.createElement('div');
        root.className = 'sf';
        root.innerHTML =
            '<div class="sf-out" aria-live="polite"></div>' +
            '<div class="sf-row">' +
            '  <img class="sf-face" src="' + SOLITA_PIC + '" alt="Solita">' +
            '  <label class="sf-vh" for="sf-in-' + nr + '">Deine Frage an Solita</label>' +
            '  <input class="sf-in" id="sf-in-' + nr + '" type="text" autocomplete="off">' +
            '  <button class="sf-mic" type="button" title="Frage sprechen" aria-label="Frage sprechen">' + ICON.mic + '</button>' +
            '  <button class="sf-stop" type="button" hidden title="Stimme anhalten" aria-label="Stimme anhalten">' + ICON.stop + '</button>' +
            '  <button class="sf-send" type="button" title="Frage senden" aria-label="Frage senden">' + ICON.send + '</button>' +
            '</div>' +
            '<div class="sf-chips"></div>' +             // the ready-made questions under the line (Doc, 29.09.2026)
            '<div class="sf-note" hidden></div>';
        host.appendChild(root);
        const out = root.querySelector('.sf-out');
        const chips = root.querySelector('.sf-chips');
        let input = root.querySelector('.sf-in');
        const sendBtn = root.querySelector('.sf-send');
        const micBtn = root.querySelector('.sf-mic');
        const stopBtn = root.querySelector('.sf-stop');
        const face = root.querySelector('.sf-face');
        const note = root.querySelector('.sf-note');
        const PLATZ = opt.platzhalter || 'Frag Solita';

        const hist = [];
        let busy = false, audio = null, ear = null, seq = 0;
        // device settings, shared with solita.html and the decks
        let ttsOn = lies(TTS_KEY) !== '0';
        let VOICE = lies(VOICE_KEY) === 'doc' ? 'doc' : 'de-DE-Studio-C';
        const who = { claude: true, ds: false };
        try {
            const kept = JSON.parse(lies(WHO_KEY) || 'null');
            if (kept) { who.claude = kept.claude !== false; who.ds = kept.ds === true; }
        } catch (e) { }
        if (!who.claude && !who.ds) who.claude = true;
        stopBtn.addEventListener('click', stop);

        (opt.vorschlaege || []).forEach(function (v) {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'sf-chip'; b.textContent = v.label;
            b.addEventListener('click', function () { frage(v.frage); });
            chips.appendChild(b);
        });

        function say(html, cls) {
            const d = document.createElement('div');
            d.className = cls || 'sf-a';
            d.innerHTML = html;
            out.appendChild(d);
            out.scrollTop = out.scrollHeight;
            return d;
        }
        function esc(s) { return String(s).replace(/[<&>]/g, function (c) { return { '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c]; }); }
        function hinweis(t) {
            note.textContent = t; note.hidden = false;
            clearTimeout(hinweis.t); hinweis.t = setTimeout(function () { note.hidden = true; }, 4000);
        }

        // --- the field: password once per device, then questions -------------------------------------------------
        function bindInput() {
            input.addEventListener('keydown', function (e) {
                e.stopPropagation();                         // typing must not turn the lab's steps
                if (e.key === 'Enter') { e.preventDefault(); submit(); }
            });
            // The password from the clipboard (Doc, 29.09.2026: "im Clip steht das pwd ... geht aba ni", "pwd fixen
            // (clip)"): the pasted text REPLACES the field - Chrome may have filled in another saved password for this
            // address before, and the paste only hung itself onto it - is cleaned and checked at once.
            input.addEventListener('paste', function (e) {
                if (input.type !== 'password') return;
                const t = e.clipboardData && e.clipboardData.getData('text');
                if (t == null) return;
                e.preventDefault();
                input.value = sauber(t);
                submit();
            });
        }
        bindInput();
        function askPassword() {
            input.type = 'password'; input.value = ''; input.placeholder = 'Passwort';
            input.setAttribute('autocomplete', 'current-password');
            input.setAttribute('aria-label', 'Passwort – wird auf diesem Gerät gemerkt');
            sendBtn.innerHTML = ICON.tick; sendBtn.setAttribute('aria-label', 'Passwort bestätigen');
            micBtn.hidden = true; chips.hidden = true;
        }
        function askQuestion() {
            // a field that once was type=password keeps Chrome's login list over it - a fresh one carries none
            if (input.type === 'password') {
                const fresh = input.cloneNode(false);
                input.replaceWith(fresh); input = fresh; bindInput();
            }
            input.type = 'text'; input.value = ''; hint();
            input.setAttribute('autocomplete', 'off');
            input.removeAttribute('aria-label');
            sendBtn.innerHTML = ICON.send; sendBtn.setAttribute('aria-label', 'Frage senden');
            micBtn.hidden = !(global.SpeechRecognition || global.webkitSpeechRecognition);
            chips.hidden = false;
        }
        // The invitation in the field, as long as it fits - on a narrow field the short form, never a cut sentence
        // (the decks' rule, Doc 23.09.2026)
        let pen = null;
        function hint() {
            if (input.type === 'password') return;
            const liste = [PLATZ, 'Frag Solita'];
            const cs = getComputedStyle(input);
            const room = input.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2;
            if (!(room > 0)) { input.placeholder = liste[0]; return; }
            if (!pen) pen = document.createElement('canvas').getContext('2d');
            pen.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
            input.placeholder = liste.find(function (t) { return pen.measureText(t).width <= room; }) || liste[liste.length - 1];
        }
        if (global.ResizeObserver) new ResizeObserver(function () { hint(); }).observe(root);
        if (document.fonts) document.fonts.ready.then(function () { hint(); });
        if (pwd()) askQuestion(); else askPassword();
        sendBtn.addEventListener('click', submit);

        function submit() {
            const v = input.type === 'password' ? sauber(input.value) : input.value.trim();
            if (!v || busy) return;
            if (ear && ear.active) ear.stop();
            if (!pwd()) {                                    // first use on this device: verify and remember
                busy = true; sendBtn.disabled = true;
                post(AI_URL, { ping: true, pass: v })
                    .then(function (r) {
                        busy = false; sendBtn.disabled = false;
                        out.querySelectorAll('.sf-err').forEach(function (e) { e.remove(); });
                        // the length helps to see what arrived - the password itself is never shown
                        if (!r.ok) { say('Passwort stimmt nicht (' + v.length + ' Zeichen angekommen).', 'sf-err'); input.value = ''; return; }
                        merke('dev_access', v);
                        askQuestion(); input.focus();
                    })
                    .catch(function () { busy = false; sendBtn.disabled = false; say('Kein Netz.', 'sf-err'); });
                return;
            }
            input.value = '';
            frage(v);
        }

        // --- a question -----------------------------------------------------------------------------------------
        function frage(v) {
            v = String(v || '').trim();
            if (!v || busy) return;
            if (!pwd()) { askPassword(); input.focus(); say('Einmal das Passwort, dann kann Solita antworten.', 'sf-err'); return; }
            busy = true; sendBtn.disabled = true;
            stop();
            const meine = ++seq;
            say(esc(v), 'sf-q');
            const wait = say('<span class="sf-wave" role="status" aria-label="Solita denkt nach"><i></i><i></i><i></i><i></i><i></i></span>', 'sf-a');
            const kontext = typeof opt.kontext === 'function' ? String(opt.kontext() || '') : '';
            const messages = [{ role: 'system', content: SYSTEM_BASIS + (opt.system ? '\n\n' + opt.system : '') }]
                .concat(hist.reduce(function (m, h) {
                    return m.concat({ role: 'user', content: 'Frage: ' + h.q }, { role: 'assistant', content: h.a });
                }, []))
                .concat({ role: 'user', content: (kontext ? 'Was die Seite gerade zeigt:\n' + kontext + '\n\n' : '') + 'Frage: ' + v });
            function ask(url, model) {
                return post(url, { pass: pwd(), model: model, max_tokens: 700, messages: messages })
                    .then(function (r) {
                        return r.json().catch(function () { return {}; }).then(function (j) {
                            const text = r.ok && j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
                            return {
                                text: text || '', status: r.status,
                                error: text ? '' : r.status === 401 && url === DS_URL ? 'DeepSeek gibt es nur mit Docs Passwort.'
                                    : String((j && j.error && (j.error.message || j.error)) || 'Das hat nicht geklappt.'),
                            };
                        });
                    });
            }
            function grau(el, text) {                        // DeepSeek's answer: grey, its name in front (as in the decks)
                el.className = 'sf-ds';
                el.innerHTML = '<b>DeepSeek</b>';
                const body = document.createElement('div');
                el.appendChild(body);
                render(body, text);
            }
            function fertig() { busy = false; sendBtn.disabled = false; }
            function fail(msg) { fertig(); wait.className = 'sf-err'; wait.textContent = msg; }
            function answer(text, zeigen) {                  // the answer she speaks: memory, voice, then on screen
                hist.push({ q: v, a: text });
                if (hist.length > HIST_MAX) hist.shift();
                const auf = function () { fertig(); const el = zeigen(); out.scrollTop = out.scrollHeight; return el; };
                if (meine !== seq) { auf(); return; }        // something else was read out meanwhile: silent
                sprich(text, auf);                           // the text shows once her voice has arrived
            }
            const withClaude = who.claude || !who.ds, withDs = who.ds;
            // DeepSeek beside her: silent, below, and only once her answer is on screen, so she is read first
            const ds = withClaude && withDs ? say('', 'sf-ds') : null;
            if (ds) ds.hidden = true;
            let dsRes = null, herTurn = false;
            function dsShow() {
                if (!ds || !dsRes || !herTurn) return;
                if (dsRes.text) grau(ds, dsRes.text);
                else if (dsRes.status !== 401) { ds.className = 'sf-err'; ds.textContent = 'DeepSeek: ' + dsRes.error; }
                else return;                                  // the students' password: no DeepSeek, not a word about it
                ds.hidden = false;
                out.scrollTop = out.scrollHeight;
            }
            if (ds) ask(DS_URL, DS_MODEL).then(function (res) { dsRes = res; dsShow(); }).catch(function () { });
            if (!withClaude) {                                // DeepSeek alone: her voice reads its answer
                ask(DS_URL, DS_MODEL)
                    .then(function (res) {
                        if (!res.text) { fail(res.error); return; }
                        answer(res.text, function () { grau(wait, res.text); return wait; });
                    })
                    .catch(function () { fail('Kein Netz.'); });
                return;
            }
            ask(AI_URL, MODEL)
                .then(function (res) {
                    if (!res.text) {
                        if (res.status === 401) { try { localStorage.removeItem('dev_access'); } catch (e) { } askPassword(); res.error = 'Das Passwort gilt nicht mehr.'; }
                        fail(res.error); herTurn = true; dsShow(); return;
                    }
                    answer(res.text, function () { render(wait, res.text); herTurn = true; dsShow(); return wait; });
                })
                .catch(function () { fail('Kein Netz.'); herTurn = true; dsShow(); });
        }

        // --- her voice ------------------------------------------------------------------------------------------
        // Her voice via the tts edge function - Solita's (Studio-C) or Doc's, as the right-click menu says. NO
        // browser-voice fallback (Doc: "NIEMALS Browserstimme") - if the cloud voice fails, the text just stands there.
        // zeigen() runs once the voice is there (or not coming). Doc's voice may come back as Studio-C when it is too
        // slow for a long text (j.fallback) - the tts function decides.
        function sprich(text, zeigen) {
            let shown = false, el = null;
            function once() { if (!shown) { shown = true; if (zeigen) el = zeigen(); } }
            const clean = sprechbar(text);
            if (!ttsOn || !clean) { once(); return; }
            const ctl = global.AbortController ? new AbortController() : null;
            const timer = setTimeout(function () { if (ctl) ctl.abort(); }, TTS_WAIT);
            const meine = seq;
            post(TTS_URL, { text: clean.slice(0, 4800), voice: VOICE, languageCode: 'de-DE', speakingRate: 1.0 }, ctl ? ctl.signal : undefined)
                .then(function (r) { return r.json(); })
                .then(function (j) {
                    clearTimeout(timer);
                    once();
                    if (!j || !j.audioContent) throw new Error('keine Stimme');
                    if (!ttsOn || meine !== seq) return;       // switched off, or something newer took over
                    stop();
                    const a = audio = new Audio('data:' + (j.mime || 'audio/mp3') + ';base64,' + j.audioContent);
                    stopBtn.hidden = false;
                    // the word she is saying lights up, as in the decks
                    if (el && SK()) SK().spielen(el, a, null, { wort: WORT, box: out, aktiv: function () { return audio === a; } });
                    a.addEventListener('ended', function () { if (audio === a) { audio = null; stopBtn.hidden = true; } });
                    a.play().catch(function () { stopBtn.hidden = true; });
                })
                .catch(function (e) {
                    clearTimeout(timer);
                    once();
                    hinweis('Solitas Stimme war gerade nicht erreichbar.');
                    dbg('tts failed: ' + (e && e.message));
                });
        }
        function stop() {
            if (audio) { try { audio.pause(); } catch (e) { } audio = null; }
            stopBtn.hidden = true;
        }
        function vorlesen(text) {
            seq++;                                          // an answer still on its way stays silent
            if (!ttsOn) { hinweis('Vorlesen ist aus – Rechtsklick auf Solita schaltet es ein.'); return; }
            sprich(text, null);
        }
        function leeren() { seq++; stop(); hist.length = 0; out.textContent = ''; busy = false; sendBtn.disabled = false; }

        // --- right click: Brain (whose voice), Model (who answers), Vorlesen, Kopieren, Leeren -- as in the decks ----
        // (Doc, 29.09.2026: "mach das bitte so wie im Deck: right mouse pop" - the speaker lives in the menu, not as a button)
        const menu = document.createElement('div');
        menu.className = 'sf-menu';
        menu.hidden = true;
        menu.setAttribute('role', 'menu');
        menu.innerHTML = '<div class="sf-mhead">Brain</div>'
            + '<label><input type="checkbox" data-voice="de-DE-Studio-C"><span>Solita</span></label>'
            + '<label><input type="checkbox" data-voice="doc"><span>Doc</span></label>'
            + '<div class="sf-mhead">Model</div>'
            + '<label><input type="checkbox" data-who="claude"><span>Claude<i>Haiku</i></span></label>'
            + '<label class="ds"><input type="checkbox" data-who="ds"><span>DeepSeek</span></label>'
            + '<div class="sf-msep"></div>'
            + '<label><input type="checkbox" data-act="tts"><span><em class="sf-spk"></em>Vorlesen<i></i></span></label>'
            + '<div class="sf-msep"></div>'
            + '<button type="button" data-act="copy">Kopieren</button>'
            + '<button type="button" data-act="clear">Leeren</button>';
        document.body.appendChild(menu);                   // fixed on the page: no card clips it
        const whoChecks = menu.querySelectorAll('input[data-who]');
        const voiceChecks = menu.querySelectorAll('input[data-voice]');
        const ttsBox = menu.querySelector('input[data-act="tts"]');
        const copyBtn = menu.querySelector('[data-act="copy"]'), clearBtn = menu.querySelector('[data-act="clear"]');
        function showWho() {
            ttsBox.checked = ttsOn;
            ttsBox.parentNode.querySelector('i').textContent = VOICE === 'doc' ? 'Docs Stimme' : 'Solitas Stimme';
            menu.querySelector('.sf-spk').innerHTML = ttsOn ? ICON.an : ICON.aus;
            voiceChecks.forEach(function (c) { c.checked = c.dataset.voice === VOICE; });
            whoChecks.forEach(function (c) {
                c.checked = who[c.dataset.who];
                c.disabled = c.checked && !(who.claude && who.ds);   // the last one on cannot be switched off
            });
            // the face goes with the voice (as in the decks): Solita shows her photo, Doc his own
            face.src = VOICE === 'doc' ? DOC_PIC : SOLITA_PIC;
            face.alt = VOICE === 'doc' ? 'Doc Alvers' : 'Solita';
        }
        voiceChecks.forEach(function (c) {                 // the two voices work like radio buttons: one is always on
            c.addEventListener('change', function () { VOICE = c.dataset.voice; merke(VOICE_KEY, VOICE); showWho(); });
        });
        whoChecks.forEach(function (c) {
            c.addEventListener('change', function () { who[c.dataset.who] = c.checked; merke(WHO_KEY, JSON.stringify(who)); showWho(); });
        });
        ttsBox.addEventListener('change', function () {
            ttsOn = ttsBox.checked;
            merke(TTS_KEY, ttsOn ? '1' : '0');
            if (!ttsOn) stop();
            showWho();
        });
        // Kopieren: the marked text if there is some in the answers, otherwise the whole talk; Leeren: talk and memory gone
        let marked = '';
        function transcript() {
            const lines = [];
            [].forEach.call(out.children, function (d) {
                if (d.hidden || d.querySelector('.sf-wave')) return;
                const src = d.dataset.src !== undefined ? d : d.querySelector('[data-src]');
                if (d.classList.contains('sf-q')) lines.push('Frage: ' + d.textContent);
                else if (src) lines.push((d.classList.contains('sf-ds') ? 'DeepSeek: ' : 'Solita: ') + src.dataset.src);
                else if (d.textContent.trim()) lines.push(d.textContent.trim());
            });
            return lines.join('\n\n');
        }
        copyBtn.addEventListener('click', function () {
            const text = marked || transcript();
            const done = function (label) { copyBtn.textContent = label; setTimeout(function () { menu.hidden = true; }, 700); };
            (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
                .then(function () { done('Kopiert'); }, function () { done('Kopieren ging nicht'); });
        });
        clearBtn.addEventListener('click', function () { leeren(); menu.hidden = true; input.focus(); });
        root.addEventListener('contextmenu', function (e) {
            // the field keeps the browser's own menu, to paste - the password from the clipboard (Doc, 29.09.2026:
            // "im Clip steht das pwd ... geht aba ni")
            if (e.target.closest && e.target.closest('input, textarea')) return;
            e.preventDefault();
            showWho();
            const sel = getSelection();
            marked = sel && !sel.isCollapsed && out.contains(sel.anchorNode) ? String(sel).trim() : '';
            copyBtn.textContent = marked ? 'Markierung kopieren' : 'Gespräch kopieren';
            copyBtn.disabled = !marked && !out.children.length;
            clearBtn.disabled = !out.children.length;
            menu.hidden = false;
            const w = menu.offsetWidth, h = menu.offsetHeight;
            menu.style.left = Math.max(8, Math.min(e.clientX, innerWidth - w - 8)) + 'px';
            menu.style.top = Math.max(8, Math.min(e.clientY, innerHeight - h - 8)) + 'px';
        });
        // a click elsewhere or Esc only closes the menu - nothing else happens with that click
        addEventListener('click', function (e) {
            if (menu.hidden || menu.contains(e.target)) return;
            menu.hidden = true; e.stopPropagation(); e.preventDefault();
        }, true);
        addEventListener('keydown', function (e) {
            if (menu.hidden || e.key !== 'Escape') return;
            menu.hidden = true; e.stopPropagation(); e.preventDefault();
        }, true);
        showWho();

        // --- speaking the question: the shared engine from js/solita-listen.js ------------------------------------
        // Recognised text lands in the field - sending stays a deliberate press, so a misheard question never costs money.
        micBtn.hidden = micBtn.hidden || !(global.SpeechRecognition || global.webkitSpeechRecognition);
        micBtn.addEventListener('mousedown', function (e) { e.preventDefault(); });
        micBtn.addEventListener('click', function () {
            if (!global.SolitaListen) { say('Spracheingabe ist hier nicht geladen.', 'sf-err'); return; }
            if (!ear) ear = global.SolitaListen({
                lang: 'de-DE',
                onState: function (s) { micBtn.classList.toggle('on', s === 'listening'); },
                onPartial: function (t) { input.value = t; input.scrollLeft = input.scrollWidth; },
                onFinal: function (t) { if (t) input.value = t; input.focus(); },
                log: dbg,
            });
            if (ear.active) ear.stop(); else { stop(); ear.start(); }
        });

        // keys inside the box stay there: they must not turn the lab's steps
        root.addEventListener('keydown', function (e) { e.stopPropagation(); });

        return { frage: frage, vorlesen: vorlesen, stop: stop, leeren: leeren };
    }

    const SYSTEM_BASIS = 'Du bist Solita, die Tutorin in Doc Alvers Mathe-Labor. '
        + 'Antworte auf Deutsch in gesprochener Sprache – die Antwort wird vorgelesen. Keine Aufzählungen, '
        + 'keine Emojis, kein Markdown. Formeln in LaTeX zwischen Dollarzeichen. Kurze Nachfragen wie "und warum?" '
        + 'beziehen sich auf das bisherige Gespräch. Sprich nie über deinen Kontext oder darüber, ob eine Frage '
        + 'zum Thema passt – antworte einfach. Jede Frage wissenschaftlicher Natur beantwortest du, auch wenn sie mit '
        + 'der Seite nichts zu tun hat; nur bei etwas, das mit Wissenschaft und Unterricht gar nichts zu tun hat, '
        + 'lenkst du in einem Satz freundlich zurück. Lob die Frage nicht.';

    global.SolitaFrage = { mount: mount, sprechbar: sprechbar };
})(window);
