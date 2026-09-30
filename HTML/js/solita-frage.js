// js/solita-frage.js — Solita's question box for labs: ask about what the page shows right now, Claude (Haiku)
// answers, her DocPad voice (Studio-C via the tts edge function) reads it out — NEVER the browser voice (Doc).
// ONE box for the labs and the decks: since 30.09.2026 decks/deck.js mounts this one too and keeps only what is the
// deck's own (its context, the footer line, the presenter view) - Doc: "ist das SolitaDoc Modul zentralisiert????".
// The API keys live in the Supabase edge functions, never here (Rule 21) — the shared password gates the proxy.
// First used by the Ziffernrätsel lab (Doc, 29.09.2026: "Bau auch wie in Decks Solita ein, die pro step Fragen
// noch gründlicher erklären kann").
//
//   const s = SolitaFrage.mount(el, {
//       kontext: () => 'what the page shows now',   // travels with every question
//       system: 'the lab's own instructions',
//       vorschlaege: [{ label: 'Genauer', frage: 'Erklär mir das genauer.' }],   // ready-made questions
//       platzhalter: 'Frag {name}',                 // {name}: Solita or Doc, whoever is chosen - only without a heading
//       ueberschrift: h3,                           // its text becomes "Frag Solita" / "Frag Doc", the field then says "…"
//       blase: true,                                // the whole talk in ONE bubble, as in the decks (solita-frage.css)
//   });
//   For a host that places the box itself - the decks (decks/deck.js, since 30.09.2026) - all optional:
//       kontext(frage)      gets the question too ("Folie 15" puts that slide into the context)
//       kontextKopf: '',    what stands before the context (default 'Was die Seite gerade zeigt:\n')
//       frageWort: 'Frage der Klasse',   how a question is introduced to the model (default 'Frage')
//       maxTokens: 600,     the answer's length (default 700)
//       hinweise: ['Frag {name} zur Folie', 'Frag {name}'],   the field's invitations, the longest that fits
//       mic: { stille: 2000, selbst: true },   dictation ends after 2 s of quiet and sends itself
//       liveZeile: true,    a dictated question already stands in the answers while it is spoken
//       senden(frage)       true: the host takes the question away (the presenter hands it to the beamer)
//       diktat(text)        true: the host shows the dictated line itself (the presenter: on the beamer)
//       beimMikro()         the mic starts (the presenter: her voice on the beamer goes quiet)
//       beiEscape()         Esc in the field
//       menueAuf: el        where the right click opens her menu (default: the box)
//       stimme: 'doc'       the voice while none is chosen on this device (default Solita's)
//   The handle also gives: s.out, s.row (the question line - a host may move it elsewhere), s.feld(), s.mikro(),
//   s.hoert(), s.senden(), s.live(text), s.auffrischen() (password or question, as it stands now), s.aufwaermen(),
//   s.wechsle() (Solita <-> Doc, as a click on her face), s.bild(el, { offen, oeffnen }) (the host's own picture of
//   her: a click shows her line, with the line shown it switches - see bild()),
//   s.beschaeftigt(), s.spiegel(m) (the presenter shows the beamer's answers: { html, zu, busy, st }). The host
//   may fold the answers away with the class sf-zu on s.out; the next text takes it off.
//   A click on the face switches between Solita and Doc; the page hears it as the event 'solita-wer' on document
//   (detail.name) and SolitaFrage.wer() says who it is now.
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
    const DOC_PIC = new URL('../resources/team/alvers_avatar.jpg', HIER).href;

    const ICON = {
        send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>',
        tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
        mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
        stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/></svg>',
        an: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
        aus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/></svg>',
        // Lucide "eye" and "eye-off" (ISC)
        auge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
        augeZu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>',
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
    // no-break spaces, zero-width and direction marks - and without spaces at either end; a letter with an accent in
    // its one-character form (a copy off a Mac can carry "ä" as "a" + dots, which looks the same and is not)
    function sauber(t) {
        return String(t || '').normalize('NFC').replace(/[\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u2064\uFEFF\r\n\t]/g, '')
            .replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
    }
    // What a rejected password is told (Doc, 30.09.2026: "dann war die Meldung pwd falsch aber nicht perfekt" - the
    // students' password was RIGHT, only not unlocked for the day, and the box said "Passwort stimmt nicht"). The
    // server names the reason; one that does not yet is not called wrong for sure.
    const GESPERRT = 'Das Passwort ist richtig, aber gerade gesperrt – das Schülerpasswort ist nicht freigegeben.';
    function abgelehnt(grund, n) {
        if (grund === 'locked') return GESPERRT;
        return (grund === 'wrong' ? 'Passwort stimmt nicht (' : 'Passwort nicht angenommen – falsch oder gesperrt (')
            + n + ' Zeichen angekommen) – das Auge zeigt, was im Feld steht.';
    }
    function lies(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
    function merke(key, v) { try { localStorage.setItem(key, v); } catch (e) { } }
    // Every call is a CORS "simple request": no custom headers, the password rides in the body (see deck.js:
    // custom headers cost a preflight of several seconds before every call).
    function post(url, body, signal) {
        return fetch(url, { method: 'POST', body: JSON.stringify(body), signal: signal });
    }
    function dbg(msg) { if (global.DebugWindow && global.DebugWindow.log) global.DebugWindow.log('[solita-frage] ' + msg); }

    // What ONE question cost, behind its answer, as in the decks (decks/deck.js: RATE and why) - Doc, 29.09.2026:
    // "schreib auch da dahinter, was der jeweilige Call gerade gekostet hat". Claude is billed from the first token;
    // the voice is characters against Google's free monthly quota, so the figure is Claude's and the voice stands in
    // the tooltip, with the list price it WOULD cost (Studio-C; Doc's own voice only as characters).
    const RATE = { in: 1, out: 5, cacheRead: 0.1, cacheWrite: 1.25, eur: 0.92, ttsUsd: 160 };
    function geld(eur) {
        if (eur >= 1) return eur.toFixed(2).replace('.', ',') + ' \u20ac';
        const ct = eur * 100;
        return (ct < 1 ? ct.toFixed(2) : ct.toFixed(1)).replace('.', ',') + ' ct';
    }
    function sek(ms) { return ms ? (ms / 1000).toFixed(1).replace('.', ',') + ' s' : '-'; }
    function kosten(usage, ms) {
        const u = usage || {};
        return {
            claude: ((u.input_tokens || 0) * RATE.in + (u.cache_read_input_tokens || 0) * RATE.in * RATE.cacheRead
                + (u.cache_creation_input_tokens || 0) * RATE.in * RATE.cacheWrite + (u.output_tokens || 0) * RATE.out) / 1e6 * RATE.eur,
            tin: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0), tout: u.output_tokens || 0,
            chars: 0, doc: false, msAi: ms, msVoice: 0,
        };
    }
    // the figure behind the answer's last word, in its type, a shade lighter (solita-frage.css .sf-cost)
    function kostenZeigen(el, k) {
        if (!k || !usageDa(k)) return;
        const c = document.createElement('span');
        c.className = 'sf-cost';
        c.textContent = geld(k.claude);
        c.title = 'Diese Frage\nClaude (Haiku): ' + geld(k.claude) + ' – ' + k.tin + ' Token rein, ' + k.tout + ' raus, '
            + 'wird ab dem ersten Token berechnet\n'
            + (!k.chars ? 'Stimme: aus'
                : k.doc ? 'Docs Stimme: ' + k.chars + ' Zeichen'
                : 'Stimme: ' + k.chars + ' Zeichen – frei im Monatskontingent, zum Listenpreis wären es '
                    + geld(k.chars / 1e6 * RATE.ttsUsd * RATE.eur))
            + '\nWartezeit: Claude ' + sek(k.msAi) + (k.msVoice ? ' + Stimme ' + sek(k.msVoice) : '');
        const p = el.lastElementChild && el.lastElementChild.tagName === 'P' ? el.lastElementChild : el;
        p.appendChild(c);
    }
    function usageDa(k) { return k.tin > 0 || k.tout > 0; }

    let zaehler = 0;
    function mount(host, opt) {
        opt = opt || {};
        const nr = ++zaehler;
        const root = document.createElement('div');
        root.className = 'sf' + (opt.blase ? ' sf-blase' : '');
        // one bubble: a hull around the answers carries its look, so the fade of a cut line (sf-cut-*) takes the
        // text only, never the bubble's edge
        const OUT = '<div class="sf-out" aria-live="polite"></div>';
        root.innerHTML =
            (opt.blase ? '<div class="sf-huelle">' + OUT + '</div>' : OUT) +
            '<div class="sf-row">' +
            '  <img class="sf-face" src="' + SOLITA_PIC + '" alt="Solita">' +
            '  <label class="sf-vh" for="sf-in-' + nr + '">Deine Frage an Solita</label>' +
            '  <input class="sf-in" id="sf-in-' + nr + '" type="text" autocomplete="off">' +
            '  <button class="sf-eye" type="button" hidden title="Passwort zeigen" aria-label="Passwort zeigen" aria-pressed="false">' + ICON.auge + '</button>' +
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
        const eyeBtn = root.querySelector('.sf-eye');
        const stopBtn = root.querySelector('.sf-stop');
        const face = root.querySelector('.sf-face');
        const note = root.querySelector('.sf-note');
        // taken now: a host may move the question line out of the box (the decks put it in the footer)
        const row = root.querySelector('.sf-row'), vh = root.querySelector('.sf-vh');
        const PLATZ = opt.platzhalter || 'Frag {name}';
        const FRAGE = opt.frageWort || 'Frage';            // how a question is introduced to the model
        const MIC = opt.mic || {};
        // Solita or Doc - chosen in the right-click menu or by a click on the face; every text of the box says who
        // (Doc, 29.09.2026: "wenn ich da selektiert bin, muss da natürlich stehen Frag Doc")
        function wer() { return VOICE === 'doc' ? 'Doc' : 'Solita'; }
        function platz() { return PLATZ.replace(/\{name\}/g, wer()); }

        const hist = [];
        let busy = false, audio = null, ear = null, seq = 0;
        // device settings, shared with solita.html and the decks
        let ttsOn = lies(TTS_KEY) !== '0';
        // nothing chosen on this device yet: the page's own voice (a deck built for Doc's voice, data-voice="doc")
        const gewaehlt = lies(VOICE_KEY);
        let VOICE = gewaehlt === 'doc' || gewaehlt === 'de-DE-Studio-C' ? gewaehlt : opt.stimme === 'doc' ? 'doc' : 'de-DE-Studio-C';
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

        // A line cut off at the box's top or bottom fades out instead of being sliced - only on the edge that really
        // hides text, from the scroll position, as in the decks (decks/deck.js cutEdges; Doc, 30.09.2026, Vorrechnen:
        // "boxhöhe begrenzen wie in Decks schrift ausfaden"). The look: solita-frage.css
        function kanten() {
            out.classList.toggle('sf-cut-top', out.scrollTop > 1);
            out.classList.toggle('sf-cut-bot', out.scrollTop + out.clientHeight < out.scrollHeight - 1);
        }
        out.addEventListener('scroll', kanten, { passive: true });
        if (global.ResizeObserver) new ResizeObserver(kanten).observe(out);
        new MutationObserver(kanten).observe(out, { childList: true, subtree: true, characterData: true });
        function say(html, cls) {
            const d = document.createElement('div');
            d.className = cls || 'sf-a';
            d.innerHTML = html;
            out.classList.remove('sf-zu');                   // text arrives: a box the host folded away opens again
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
                else if (e.key === 'Escape' && opt.beiEscape) { e.preventDefault(); opt.beiEscape(); }
            });
            // typed corrections of a dictated question follow it in the answers (liveZeile)
            input.addEventListener('input', function () { bereit(); if (!pw && opt.liveZeile && (live || diktiert)) spiegeln(); });
            // The password from the clipboard (Doc, 29.09.2026: "im Clip steht das pwd ... geht aba ni", "pwd fixen
            // (clip)"): the pasted text REPLACES the field - Chrome may have filled in another saved password for this
            // address before, and the paste only hung itself onto it - is cleaned and checked at once.
            input.addEventListener('paste', function (e) {
                if (!pw) return;
                const t = e.clipboardData && e.clipboardData.getData('text');
                if (t == null) return;
                e.preventDefault();
                input.value = eigen = sauber(t);
                submit();
            });
            // What the user did not put into the password field himself goes with his first key: on docalvers.de
            // Chrome fills in the password it saved for the plans' login, unasked and as dots, and the typed one
            // only hung itself onto it (Doc, 30.09.2026, the HP: "geht das pwd nicht ... ich werde wahnsinnig").
            // Chrome's filling comes without a beforeinput, so only real typing counts as the user's own.
            input.addEventListener('beforeinput', function (e) {
                if (!pw || e.inputType === 'insertLineBreak') return;
                if (input.value !== eigen) input.value = '';
                tippt = true;
            });
            input.addEventListener('input', function () { if (pw && tippt) { eigen = input.value; tippt = false; } });
        }
        // pw: the field asks for the password - a flag, not the field's type, which the eye switches to text;
        // eigen: what the user typed or pasted there himself
        let pw = false, eigen = '', tippt = false;
        bindInput();
        // The eye (Doc, 30.09.2026: "ja Auge"): the password as text, to SEE what is in the field - dots hide a wrong
        // clipboard, a filled-in password and a keyboard layout alike. Closed again with every new request for it;
        // the beamer's mirror carries no field content (it copies the markup), so the class never sees it.
        function auge(offen) {
            input.type = offen ? 'text' : 'password';
            eyeBtn.innerHTML = offen ? ICON.augeZu : ICON.auge;
            eyeBtn.title = offen ? 'Passwort verbergen' : 'Passwort zeigen';
            eyeBtn.setAttribute('aria-label', eyeBtn.title);
            eyeBtn.setAttribute('aria-pressed', String(offen));
        }
        eyeBtn.addEventListener('mousedown', function (e) { e.preventDefault(); });   // the field keeps the focus
        eyeBtn.addEventListener('click', function () { if (pw) auge(input.type === 'password'); });
        function askPassword() {
            pw = true; eigen = '';
            input.value = ''; input.placeholder = 'Passwort';
            input.setAttribute('autocomplete', 'current-password');
            input.setAttribute('aria-label', 'Passwort – wird auf diesem Gerät gemerkt');
            // shown as text it must stay as typed: no spell check, no capital first letter, no correction
            input.setAttribute('spellcheck', 'false');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('autocorrect', 'off');
            auge(false); eyeBtn.hidden = false;
            sendBtn.innerHTML = ICON.tick; sendBtn.setAttribute('aria-label', 'Passwort bestätigen');
            micBtn.hidden = true; chips.hidden = true;
        }
        function askQuestion() {
            // a field that once was type=password keeps Chrome's login list over it - a fresh one carries none
            if (pw) {
                const fresh = input.cloneNode(false);
                ['spellcheck', 'autocapitalize', 'autocorrect'].forEach(function (a) { fresh.removeAttribute(a); });
                input.replaceWith(fresh); input = fresh; bindInput();
            }
            pw = false; eigen = ''; eyeBtn.hidden = true;
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
            if (pw) return;
            // with a heading the name already stands above the box - the field only says "…" (Doc, 29.09.2026:
            // "das steht ja drüber. Mach da drinnen nur Punkt, Punkt, Punkt")
            // three single periods, not the one-glyph '…' - only they take the letter-spacing
            const liste = opt.ueberschrift ? ['...']
                : opt.hinweise ? opt.hinweise.map(function (h) { return h.replace(/\{name\}/g, wer()); })
                : [platz(), 'Frag ' + wer()];
            input.classList.toggle('sf-punkte', !!opt.ueberschrift);   // the dots are set large (solita-frage.css)
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
            const v = pw ? sauber(input.value) : input.value.trim();
            if (!v || busy) return;
            if (ear && ear.active) { spaet = true; ear.stop(); }   // its late result must not land behind the answer
            if (!pwd()) {                                    // first use on this device: verify and remember
                busy = true; sendBtn.disabled = true;
                post(AI_URL, { ping: true, pass: v })
                    .then(function (r) {
                        // a 401 carries its reason ('wrong' | 'locked', supabase/functions/claude)
                        return r.ok ? r : r.json().catch(function () { return {}; }).then(function (j) { r.grund = j && j.reason; return r; });
                    })
                    .then(function (r) {
                        busy = false; sendBtn.disabled = false;
                        out.querySelectorAll('.sf-err').forEach(function (e) { e.remove(); });
                        // only a 401 is about the password - anything else is the server's trouble and says so
                        if (!r.ok && r.status !== 401) { say('Der Server antwortet mit HTTP ' + r.status + ' – am Passwort liegt es nicht.', 'sf-err'); return; }
                        // the length helps to see what arrived, and the field keeps it for the eye - marked, so the
                        // next key replaces it; what the user did not type himself stays foreign (see beforeinput)
                        if (!r.ok) {
                            say(abgelehnt(r.grund, v.length), 'sf-err');
                            if (input.value === eigen) eigen = v;
                            input.value = v; input.focus(); input.select();
                            return;
                        }
                        merke('dev_access', v);
                        askQuestion(); input.focus();
                    })
                    .catch(function () { busy = false; sendBtn.disabled = false; say('Kein Netz.', 'sf-err'); });
                return;
            }
            input.value = ''; diktiert = false; bereit();
            if (opt.senden && opt.senden(v)) { live = null; return; }   // the host took it (the presenter)
            frage(v);
        }
        // a question in the field: the send button may show it (sf-bereit - the decks let it breathe)
        function bereit() { sendBtn.classList.toggle('sf-bereit', !busy && !pw && input.value.trim() !== ''); }
        // The dictated question already stands in the answers while it is spoken, and the field scrolls along so its
        // end stays in view (the decks, Doc 23.09.2026: "lass den Text auch schon oben erscheinen und in der
        // Eingabebox mit scrollen"); sent, that line becomes the question. liveZeile only.
        let live = null, diktiert = false, spaet = false;
        function spiegeln() {
            const v = input.value.trim();
            if (!v) diktiert = false;
            if (opt.diktat && opt.diktat(v)) return;       // the host shows it (the presenter: on the beamer)
            if (live && !live.isConnected) live = null;     // "Leeren" took it away
            if (!v) { if (live) { live.remove(); live = null; } return; }
            if (!live) live = say('', 'sf-q');
            live.innerHTML = esc(v); out.scrollTop = out.scrollHeight;
        }
        function gehoert(t) {                                // recognised text into the field, its end in view
            input.value = t; input.scrollLeft = input.scrollWidth;
            try { input.setSelectionRange(t.length, t.length); } catch (e) { }
            bereit();
            if (opt.liveZeile) { diktiert = true; spiegeln(); }
        }
        // Wake both functions while the question is still being typed, at no cost: an empty tts call is refused before
        // Google is asked, a ping only checks the password. At most once a minute (the decks, 16.09.2026: the first
        // call after a pause waited for a cold start).
        let warmAt = 0;
        function aufwaermen() {
            if (Date.now() - warmAt < 60000) return;
            warmAt = Date.now();
            post(TTS_URL, {}).catch(function () { });
            if (pwd()) post(AI_URL, { ping: true, pass: pwd() }).catch(function () { });
        }

        // --- a question -----------------------------------------------------------------------------------------
        function frage(v) {
            v = String(v || '').trim();
            if (!v || busy) return;
            if (!pwd()) { askPassword(); input.focus(); say('Einmal das Passwort, dann kann ' + wer() + ' antworten.', 'sf-err'); return; }
            busy = true; sendBtn.disabled = true; bereit();
            stop();
            const meine = ++seq;
            const q = live && live.isConnected ? live : say('', 'sf-q');   // dictated: the line standing there is it
            q.innerHTML = esc(v); live = null;
            const wait = say('<span class="sf-wave" role="status" aria-label="' + wer() + ' denkt nach"><i></i><i></i><i></i><i></i><i></i></span>', 'sf-a');
            const kontext = typeof opt.kontext === 'function' ? String(opt.kontext(v) || '') : '';
            const kopf = opt.kontextKopf !== undefined ? opt.kontextKopf : 'Was die Seite gerade zeigt:\n';
            const messages = [{ role: 'system', content: (VOICE === 'doc' ? SYSTEM_DOC : SYSTEM_SOLITA) + SYSTEM_BASIS + (opt.system ? '\n\n' + opt.system : '') }]
                .concat(hist.reduce(function (m, h) {
                    return m.concat({ role: 'user', content: FRAGE + ': ' + h.q }, { role: 'assistant', content: h.a });
                }, []))
                .concat({ role: 'user', content: (kontext ? kopf + kontext + '\n\n' : '') + FRAGE + ': ' + v });
            function ask(url, model) {
                return post(url, { pass: pwd(), model: model, max_tokens: opt.maxTokens || 700, messages: messages })
                    .then(function (r) {
                        return r.json().catch(function () { return {}; }).then(function (j) {
                            const text = r.ok && j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
                            return {
                                text: text || '', status: r.status, usage: j && j.usage, grund: j && j.reason,
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
            function fertig() { busy = false; sendBtn.disabled = false; bereit(); }
            function fail(msg) { fertig(); wait.className = 'sf-err'; wait.textContent = msg; }
            function answer(text, zeigen, k) {               // the answer she speaks: memory, voice, then on screen
                hist.push({ q: v, a: text });
                if (hist.length > HIST_MAX) hist.shift();
                const auf = function () { fertig(); const el = zeigen(); out.scrollTop = out.scrollHeight; return el; };
                if (meine !== seq) { auf(); return; }        // something else was read out meanwhile: silent
                sprich(text, auf, k);                        // the text shows once her voice has arrived
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
            const t0 = Date.now();
            ask(AI_URL, MODEL)
                .then(function (res) {
                    if (!res.text) {
                        // a locked password is still the right one: it stays remembered, the box says what is the matter
                        if (res.status === 401 && res.grund === 'locked') res.error = GESPERRT;
                        else if (res.status === 401) { try { localStorage.removeItem('dev_access'); } catch (e) { } askPassword(); res.error = 'Das Passwort gilt nicht mehr.'; }
                        fail(res.error); herTurn = true; dsShow(); return;
                    }
                    const k = kosten(res.usage, Date.now() - t0);
                    answer(res.text, function () { render(wait, res.text); kostenZeigen(wait, k); herTurn = true; dsShow(); return wait; }, k);
                })
                .catch(function () { fail('Kein Netz.'); herTurn = true; dsShow(); });
        }

        // --- her voice ------------------------------------------------------------------------------------------
        // Her voice via the tts edge function - Solita's (Studio-C) or Doc's, as the right-click menu says. NO
        // browser-voice fallback (Doc: "NIEMALS Browserstimme") - if the cloud voice fails, the text just stands there.
        // zeigen() runs once the voice is there (or not coming). Doc's voice may come back as Studio-C when it is too
        // slow for a long text (j.fallback) - the tts function decides.
        function sprich(text, zeigen, k) {                 // k: the question's cost - the voice adds its characters
            let shown = false, el = null;
            const tv = Date.now();
            function once() { if (!shown) { shown = true; if (zeigen) el = zeigen(); } }
            const whole = sprechbar(text);
            if (!ttsOn || !whole) { once(); return; }
            // Doc's voice needs ~5 s a sentence (16 s for a long step, measured 29.09.2026) - past the wait, so it comes
            // sentence by sentence as in the decks: the first piece at once, the next fetched while one plays. Each
            // piece lights up exactly its share of the answer's words; if the shares do not add up, one piece.
            const W = { absaetze: true };
            let parts = (VOICE === 'doc' && SK() ? SK().stuecke(text) : [String(text)]).map(function (raw) {
                return { clean: sprechbar(raw), n: SK() ? SK().woerter(raw, W) : 0 };
            }).filter(function (p) { return p.clean; });
            if (parts.length > 1 && SK() && parts.reduce(function (x, p) { return x + p.n; }, 0) !== SK().woerter(text, W)) {
                parts = [{ clean: whole, n: SK().woerter(text, W) }];
            }
            const meine = seq;
            let voice = VOICE;                                // a piece that fell back to Studio-C takes the rest along
            const got = [];
            function get(i) {
                if (got[i]) return got[i];
                const ctl = global.AbortController ? new AbortController() : null;
                const timer = setTimeout(function () { if (ctl) ctl.abort(); }, TTS_WAIT);
                got[i] = post(TTS_URL, { text: parts[i].clean.slice(0, 4800), voice: voice, languageCode: 'de-DE', speakingRate: 1.0 },
                              ctl ? ctl.signal : undefined)
                    .then(function (r) { return r.json(); })
                    .then(function (j) {
                        clearTimeout(timer);
                        if (!j || !j.audioContent) throw new Error('keine Stimme');
                        if (j.fallback) voice = 'de-DE-Studio-C';
                        return j;
                    }, function (e) { clearTimeout(timer); throw e; });
                return got[i];
            }
            let first = 0;                                    // the word spans before piece i
            function play(i, before) {
                get(i).then(function (j) {
                    if (i === 0 && k) { k.chars = whole.length; k.doc = voice === 'doc'; k.msVoice = Date.now() - tv; }
                    if (i === 0) once();
                    if (!ttsOn || meine !== seq) return;         // switched off, or something newer took over
                    if (i === 0) stop();
                    else if (audio !== before) return;           // stopped meanwhile
                    const a = audio = new Audio('data:' + (j.mime || 'audio/mp3') + ';base64,' + j.audioContent);
                    stopBtn.hidden = false;
                    if (i + 1 < parts.length) get(i + 1);         // the next piece comes while this one plays
                    // the word she is saying lights up, as in the decks
                    if (el && SK()) {
                        const alle = el.querySelectorAll('.' + WORT);
                        SK().spielen(el, a, [].slice.call(alle, first, first + parts[i].n),
                            { wort: WORT, box: out, aktiv: function () { return audio === a; } });
                    }
                    first += parts[i].n;
                    a.addEventListener('ended', function () {
                        if (audio !== a) return;
                        if (i + 1 < parts.length) play(i + 1, a);
                        else { audio = null; stopBtn.hidden = true; }
                    });
                    a.play().catch(function () { stopBtn.hidden = true; });
                }).catch(function (e) {
                    if (i > 0) return;                            // the text stands; the rest simply stays silent
                    once();
                    hinweis((VOICE === 'doc' ? 'Docs' : 'Solitas') + ' Stimme war gerade nicht erreichbar.');
                    dbg('tts failed: ' + (e && e.message));
                });
            }
            play(0, null);
        }
        function stop() {
            if (audio) { try { audio.pause(); } catch (e) { } audio = null; }
            stopBtn.hidden = true;
        }
        function vorlesen(text) {
            seq++;                                          // an answer still on its way stays silent
            if (!ttsOn) { hinweis('Vorlesen ist aus – Rechtsklick auf ' + wer() + ' schaltet es ein.'); return; }
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
        // what happens in her menu stays there: a click on a check reached the page and turned a deck's slide
        menu.addEventListener('click', function (e) { e.stopPropagation(); });
        menu.addEventListener('keydown', function (e) { e.stopPropagation(); });
        const whoChecks = menu.querySelectorAll('input[data-who]');
        const voiceChecks = menu.querySelectorAll('input[data-voice]');
        const ttsBox = menu.querySelector('input[data-act="tts"]');
        const copyBtn = menu.querySelector('[data-act="copy"]'), clearBtn = menu.querySelector('[data-act="clear"]');
        let gemeldet = null;
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
            face.title = 'Klick: zu ' + (VOICE === 'doc' ? 'Solita' : 'Doc') + ' wechseln';
            if (opt.ueberschrift) opt.ueberschrift.textContent = 'Frag ' + wer();
            vh.textContent = 'Deine Frage an ' + wer();
            if (!pw) hint();
            if (gemeldet !== wer()) {
                gemeldet = wer();
                document.dispatchEvent(new CustomEvent('solita-wer', { detail: { name: gemeldet } }));
            }
        }
        // a click on the face switches between Solita and Doc, as the menu does (Doc, 29.09.2026: "einfacher Klick ...
        // auf den Avatar soll zwischen Solita und mir switchen")
        function wechsle(ohneFokus) {
            VOICE = VOICE === 'doc' ? 'de-DE-Studio-C' : 'doc';
            merke(VOICE_KEY, VOICE);
            stop();
            showWho();
            if (!ohneFokus) einladen();
        }
        // The host's own picture of her (the decks' footer, Vorrechnen's corner): a click or tap shows her line, and with
        // the line shown switches between Solita and Doc - the same on the pad, where the line then stays open (Doc,
        // 30.09.2026: "zeile nicht sichtbar -> show zeile, sichtbar -> switch", on a long press for the pad: "nee, passt
        // so"). A finger or pen puts no cursor in the field: the pad's keyboard would come up with every switch.
        function bild(el, h) {
            let art = 'mouse';
            el.addEventListener('pointerdown', function (e) { art = e.pointerType || 'mouse'; });
            el.addEventListener('click', function () {
                const wie = art; art = 'mouse';                // a key (Enter) on the picture counts as a click
                if (h.offen()) wechsle(wie !== 'mouse'); else h.oeffnen();
            });
        }
        // switched in another window of this page - the presenter view and the beamer, two tabs - this one follows
        addEventListener('storage', function (e) {
            if (e.key !== VOICE_KEY || (e.newValue !== 'doc' && e.newValue !== 'de-DE-Studio-C') || e.newValue === VOICE) return;
            VOICE = e.newValue;
            stop();
            showWho();
        });
        // after the switch the cursor blinks in the field and the microphone lights up once - here you can type,
        // or speak (Doc, 29.09.2026: "lass den Cursor gleich auch blinken", "das Mikrofon auch mal kurz aufflashen")
        function einladen() {
            input.focus();
            if (micBtn.hidden || micBtn.classList.contains('on')) return;   // hidden, or listening already
            micBtn.classList.remove('sf-zeig');
            void micBtn.offsetWidth;                           // restart the flash on a quick second click
            micBtn.classList.add('sf-zeig');
        }
        micBtn.addEventListener('animationend', function (e) { if (e.animationName === 'sfzeig') micBtn.classList.remove('sf-zeig'); });
        face.setAttribute('role', 'button');
        face.setAttribute('tabindex', '0');
        face.style.cursor = 'pointer';
        face.addEventListener('click', wechsle);
        face.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wechsle(); } });
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
                else if (src) lines.push((d.classList.contains('sf-ds') ? 'DeepSeek: ' : wer() + ': ') + src.dataset.src);
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
        // Live reload (only on Doc's machine, tools/live_reload.py) waits while the box is in use: she thinks or
        // speaks, her menu is open, or a talk stands in it - as in the decks, where the open panel holds it. A right
        // click to copy took the cursor out of the field, the lab reloaded under it and the answer was gone (Doc,
        // 29.09.2026: "ich wollte es kopieren ... das Labor wurde wieder neu gestartet"). Leeren lets it reload again.
        const frueher = global.__liveReloadBusy;
        global.__liveReloadBusy = function () {
            return busy || !!audio || !menu.hidden || out.children.length > 0 || (typeof frueher === 'function' && !!frueher());
        };
        (opt.menueAuf || root).addEventListener('contextmenu', function (e) {
            // the PASSWORD field keeps the browser's own menu, to paste from the clipboard (Doc, 29.09.2026: "im Clip
            // steht das pwd ... geht aba ni"); on the question field it is Solita's menu, as in the decks ("wo ist das
            // Kontext pop aus dem Deck?") - Cmd+V pastes there
            if (e.target === input && pw) return;
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
        // mic.stille: quiet that ends the question (the decks: 2 s, Doc 25.09.2026: 3 s "zu lang"); mic.selbst: it then
        // sends itself ("nach ... s Pause selbst abschicken") - a question sent from the field meanwhile drops the late text
        micBtn.addEventListener('click', function () {
            if (ear && ear.active) { ear.stop(); return; }
            if (!global.SolitaListen) { say('Spracheingabe ist hier nicht geladen.', 'sf-err'); return; }
            stop();                                          // otherwise the mic hears her
            if (opt.beimMikro) opt.beimMikro();
            if (!ear) ear = global.SolitaListen({
                lang: 'de-DE',
                silenceMs: MIC.stille,
                onState: function (s) { micBtn.classList.toggle('on', s === 'listening'); },
                onPartial: function (t) { if (!spaet) gehoert(t); },
                onFinal: function (t) {
                    micBtn.classList.remove('on');
                    if (spaet) { spaet = false; return; }
                    if (t) gehoert(t);
                    input.focus();
                    if (MIC.selbst && input.value.trim()) submit();
                },
                log: dbg,
            });
            spaet = false;
            ear.start();
        });

        // keys inside the box stay there: they must not turn the lab's steps
        root.addEventListener('keydown', function (e) { e.stopPropagation(); });

        return {
            frage: frage, vorlesen: vorlesen, stop: stop, leeren: leeren, wechsle: wechsle, bild: bild,
            out: out, row: row,
            feld: function () { return input; },             // a new field after the password - never keep the old one
            mikro: function () { if (micBtn.hidden) return false; micBtn.click(); return true; },   // false: no mic here (the password)
            hoert: function () { return !!(ear && ear.active); },
            senden: submit,
            live: function (t) { input.value = t || ''; if (live || t) spiegeln(); bereit(); },
            auffrischen: function () { if (pwd() && pw) askQuestion(); else if (!pwd() && !pw) askPassword(); hint(); },
            aufwaermen: aufwaermen,
            beschaeftigt: function () { return busy; },
            spiegel: function (m) {
                out.innerHTML = m.html || '';
                out.classList.toggle('sf-zu', !!m.zu);
                busy = !!m.busy; sendBtn.disabled = busy; bereit();
                out.scrollTop = m.st || 0;
            },
        };
    }

    // who speaks: Solita, or Doc himself when he is chosen (his voice, his name over the box)
    const SYSTEM_SOLITA = 'Du bist Solita, die Tutorin in Doc Alvers Mathe-Labor. ';
    const SYSTEM_DOC = 'Du bist Doc Alvers, der Lehrer, der dieses Mathe-Labor gebaut hat. Du sprichst in der Ich-Form und '
        + 'duzt die Schülerinnen und Schüler. ';
    const SYSTEM_BASIS = 'Antworte auf Deutsch in gesprochener Sprache – die Antwort wird vorgelesen. Keine Aufzählungen, '
        + 'keine Emojis, kein Markdown. Formeln in LaTeX zwischen Dollarzeichen. Kurze Nachfragen wie "und warum?" '
        + 'beziehen sich auf das bisherige Gespräch. Sprich nie über deinen Kontext oder darüber, ob eine Frage '
        + 'zum Thema passt – antworte einfach. Jede Frage wissenschaftlicher Natur beantwortest du, auch wenn sie mit '
        + 'der Seite nichts zu tun hat; nur bei etwas, das mit Wissenschaft und Unterricht gar nichts zu tun hat, '
        + 'lenkst du in einem Satz freundlich zurück. Lob die Frage nicht.';

    global.SolitaFrage = {
        mount: mount, sprechbar: sprechbar,
        wer: function () { try { return localStorage.getItem(VOICE_KEY) === 'doc' ? 'Doc' : 'Solita'; } catch (e) { return 'Solita'; } },
    };
})(window);
