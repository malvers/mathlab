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
//       liveZeile: true,    (every box does that since 30.09.2026 - the option is kept for hosts that pass it)
//       senden(frage)       true: the host takes the question away (the presenter hands it to the beamer)
//       diktat(text)        true: the host shows the dictated line itself (the presenter: on the beamer)
//       beimMikro()         the mic starts (the presenter: her voice on the beamer goes quiet)
//       beiEscape()         Esc in the field
//       menueAuf: el        where the right click opens her menu (default: the box)
//       stimme: 'doc'       the voice while none is chosen on this device (default Solita's)
//   The handle also gives: s.out, s.row (the question line - a host may move it elsewhere), s.feld(), s.mikro(),
//   s.hoert(), s.senden(), s.live(text), s.auffrischen() (password or question, as it stands now), s.aufwaermen(),
//   s.wechsle() (Solita <-> Doc, as a click on her face), s.bild(el, { offen, oeffnen }) (the host's own picture of
//   her: a click shows her line, with the line shown it switches - see bild()), s.sprechtaste({ offen, oeffnen, innen,
//   tasten, wenn }) (Space is the mic's key on every page with the box; the host says how its line opens),
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
    // A pause after every sentence she reads (Doc, 30.09.2026: "Die redet sehr schnell. Ich würde zwischen den Sätzen
    // immer noch ein bisschen Pause lassen", "probieren wir mal 0,4 Sekunden"): an SSML break between the sentences
    // of Solita's voice. 400 ms gave 0.49 s of silence each (measured on Studio-C: four sentences 8.98 s without,
    // 10.46 s with three breaks) - Doc did not notice them ("die Pausen zwischen den Sätzen nehme ich jedenfalls
    // nicht wahr"). Now 800 ms: 0.89 s each (11.66 s, the silences 0.90, 0.90 and 0.84 s), which is what the light
    // on her words counts with (SATZPAUSE_IST). Doc's own voice comes in pieces anyway: the same wait between two.
    // A TRIAL at 2 s: Doc heard no change at 0.8 s either ("gib da mal zwei Sekunden rein. Da müsste man es ja
    // definitiv hören, wenn es ankäme") - 2.09 s is reckoned from the two measurements (each 0.09 s more than
    // asked for), not measured. The figure behind an answer says in its tooltip how many pauses were asked for.
    const SATZPAUSE_MS = 2000, SATZPAUSE_IST = 2.09;
    // The words of a bracket, "Klammer auf, a plus b, Klammer zu", set off so one hears them (Doc, 30.09.2026: "die
    // rattert das runter ... Das müssen wir noch tunen"): the commas solita-karaoke puts there do next to nothing in
    // Studio-C (measured: 3.96 s -> 4.08 s), a break of 250 ms after "Klammer auf" and before "Klammer zu" gives
    // 0.33 s of silence and a voice that slows down into it - three of them made 5.95 s of the 3.96 s, 0.66 s each.
    const KLAMMERPAUSE_MS = 250, KLAMMERPAUSE_IST = 0.66;
    function klammerPausen(s) {                       // the same two places solita-karaoke's spielen counts
        const b = '<break time="' + KLAMMERPAUSE_MS + 'ms"/>';
        return s.replace(/Klammer auf,/g, 'Klammer auf' + b).replace(/,\s*Klammer zu/g, b + ' Klammer zu');
    }
    function xml(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
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
        // who answers: the marks of Claude and DeepSeek from Simple Icons 16.33.0 (CC0-1.0), in the field's own ink
        claude: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>',
        deepseek: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45"/></svg>',
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
    // DeepSeek's answer gets a figure too (Doc, 30.09.2026: "bei DeepSeek hätte ich auch unten gerne eine
    // Kosteneinschätzung") - an estimate from its list prices: $ per million tokens at peak hours [input from the cache,
    // input, output], half of that off-peak (api-docs.deepseek.com/quick_start/pricing, read 30.09.2026; peak is
    // 01-04 and 06-10 UTC, Monday to Friday - Chinese holidays are not known here). Which row: the model the answer
    // names; the old name the box asks for ("deepseek-chat") stands for Flash - the deepseek function translates it.
    const DS_RATE = { flash: [0.006, 0.30, 1.20], pro: [0.044, 1.32, 3.96] };
    function kostenDs(usage, modell) {
        const u = usage || {}, d = new Date(), h = d.getUTCHours(), tag = d.getUTCDay();
        const spitze = tag >= 1 && tag <= 5 && ((h >= 1 && h < 4) || (h >= 6 && h < 10));
        const r = DS_RATE[/pro|reasoner/i.test(modell || '') ? 'pro' : 'flash'], f = spitze ? 1 : 0.5;
        const rein = u.prompt_tokens || 0, cache = u.prompt_cache_hit_tokens || 0, raus = u.completion_tokens || 0;
        return { eur: ((rein - cache) * r[1] + cache * r[0] + raus * r[2]) * f / 1e6 * RATE.eur,
            tin: rein, cache: cache, tout: raus, spitze: spitze, modell: modell || DS_MODEL };
    }
    function kostenZeigenDs(el, k) {
        if (!k || !(k.tin > 0 || k.tout > 0)) return;
        const c = document.createElement('span');
        c.className = 'sf-cost';
        c.textContent = geld(k.eur);
        c.title = 'Diese Frage, geschätzt\nDeepSeek (' + k.modell + '): ' + geld(k.eur) + ' – ' + k.tin + ' Token rein'
            + (k.cache ? ', davon ' + k.cache + ' aus dem Cache' : '') + ', ' + k.tout + ' raus\n'
            + 'Listenpreis ' + (k.spitze ? 'zur Hauptzeit' : 'zur Nebenzeit (halber Preis)') + ', Stand 30.09.2026';
        const p = el.lastElementChild && el.lastElementChild.tagName === 'P' ? el.lastElementChild : el;
        p.appendChild(c);
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
                : 'Stimme: ' + k.chars + ' Zeichen' + (k.pausen ? ', ' + k.pausen + (k.pausen === 1 ? ' Satzpause' : ' Satzpausen') + ' à '
                    + (SATZPAUSE_MS / 1000).toFixed(1).replace('.', ',') + ' s' : ', ohne Satzpausen')
                    + ' – frei im Monatskontingent, zum Listenpreis wären es '
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
            // the mic in front of the field on every page, as the decks always had it (Doc, 30.09.2026: "das Mikrofon
            // auf die linke Seite. Bitte zentral. Das Ding soll immer gleich aussehen")
            '  <button class="sf-mic" type="button" title="Frage sprechen" aria-label="Frage sprechen">' + ICON.mic + '</button>' +
            '  <label class="sf-vh" for="sf-in-' + nr + '">Deine Frage an Solita</label>' +
            '  <input class="sf-in" id="sf-in-' + nr + '" type="text" autocomplete="off">' +
            '  <span class="sf-ki" role="img" hidden></span>' +   // who answers, drawn into the field's right end (zeigeKi)
            '  <span class="sf-ton" hidden aria-hidden="true"></span>' +   // sound instead of letters while she listens (hoertZu)
            '  <button class="sf-eye" type="button" hidden title="Passwort zeigen" aria-label="Passwort zeigen" aria-pressed="false">' + ICON.auge + '</button>' +
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
        const kiEl = root.querySelector('.sf-ki');
        const tonEl = root.querySelector('.sf-ton');
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
        // Who answers stands at the right end of the question field, small, on every page with the box: Claude's
        // mark ("Claude icon nicht Anthropic") while Claude Haiku answers, DeepSeek's while DeepSeek does, both when both are on (Doc, 30.09.2026:
        // "zentral bitte ... in die Suchzeile ganz rechts ein kleines Icon von Anthropic ... von DeepSeek ... beide
        // Icons"). Not over the password. DeepSeek opens only for Doc's own password: once it has refused this one,
        // its mark goes (dsZu). The field keeps its text clear of them - inline, a host's own padding does not undo it;
        // --ki is the marks' size (solita-frage.css, the decks' footer line smaller).
        let dsZu = false;
        function zeigeKi() {
            const d = who.ds && !dsZu, c = who.claude || !d, n = (c ? 1 : 0) + (d ? 1 : 0);   // no DeepSeek: Claude answers
            kiEl.hidden = pw || !n;
            kiEl.innerHTML = (c ? ICON.claude : '') + (d ? ICON.deepseek : '');
            kiEl.style.setProperty('--n', String(n || 1));
            kiEl.setAttribute('aria-label', 'Es antwortet ' + [c && 'Claude Haiku', d && 'DeepSeek'].filter(Boolean).join(' und '));
            input.style.paddingRight = kiEl.hidden ? '' : 'calc(' + n + ' * var(--ki, 18px) + ' + ((n - 1) * 5 + 16) + 'px)';
        }
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
        // On a touch screen the cursor set by the code comes without the keyboard (inputmode none); a finger on the
        // field brings it (Doc 02.10.2026, DOCPAD on the Lenovo pad: "wenn wir den Cursor programmatisch da reinstellen,
        // dann soll die Tastatur nicht kommen. Nur wenn ich explizit mit dem Finger da drauf tippe")
        const TOUCH = !!(global.matchMedia && global.matchMedia('(hover: none) and (pointer: coarse)').matches);
        // Never scroll the page to the field: it stands where the click was. In the textbook's sticky header Chrome took
        // it for hidden under the page's scroll-padding and jumped the book by up to 1,000 px (Doc, 09.10.2026: "Wenn man
        // die Pille ... drückt, scrollt das Buch")
        function fokus() {
            if (TOUCH) input.setAttribute('inputmode', 'none');
            input.focus({ preventScroll: true });
        }
        root.addEventListener('pointerdown', function (e) {
            if (e.target === input && input.getAttribute('inputmode') === 'none') input.removeAttribute('inputmode');
        }, true);
        function bindInput() {
            input.addEventListener('keydown', function (e) {
                e.stopPropagation();                         // typing must not turn the lab's steps
                if (e.key === 'Enter') { e.preventDefault(); submit(); }
                else if (e.key === 'Escape' && opt.beiEscape) { e.preventDefault(); opt.beiEscape(); }
            });
            // typed corrections of a dictated question follow it in the answers
            input.addEventListener('input', function () { bereit(); if (!pw && (live || diktiert)) spiegeln(); });
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
            zeigeKi();
        }
        function askQuestion() {
            // a field that once was type=password keeps Chrome's login list over it - a fresh one carries none
            if (pw) {
                const fresh = input.cloneNode(false);
                ['spellcheck', 'autocapitalize', 'autocorrect'].forEach(function (a) { fresh.removeAttribute(a); });
                input.replaceWith(fresh); input = fresh; bindInput();
            }
            pw = false; eigen = ''; eyeBtn.hidden = true;
            zeigeKi();                                       // before the invitation is fitted: the marks take room
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
                            input.value = v; fokus(); input.select();
                            return;
                        }
                        merke('dev_access', v);
                        askQuestion(); fokus();
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
        // The dictated question already stands in the answers while it is spoken (the decks, Doc 23.09.2026: "lass
        // den Text auch schon oben erscheinen"); sent, that line becomes the question. In every box since 30.09.2026,
        // and the field itself shows sound meanwhile, not the words (Doc: "in dem Feld unten ... eher nur was
        // soundmäßiges zeigen. Also genau wie das WhatsApp macht. Und die eigentliche Frage ... schon oben in der
        // Box") - hoertZu below. The words still go into the field: it is what gets sent, and what can be corrected
        // once she stops listening.
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
            lautBis = Date.now() + 700;                      // the sound in the field moves with what is heard
            diktiert = true; spiegeln();
        }
        // While she listens the field shows sound, as a voice message does (Doc, 01.10.2026: "bei WhatsApp läuft beim
        // Mic von rechts eine Soundwave rein. Bitte bau das auch so mit Bezug zum Sound"): a bar every 70 ms enters at
        // the right edge as tall as the sound just then, and the row moves on to the left; silence leaves small dots.
        // The level is the microphone's own (an AnalyserNode on a second stream) - except on Android, where a second
        // stream beside the speech recognition silences it: there the bars follow the recognised words (lautBis).
        // No stream either (refused, no AudioContext): the same words-driven bars. The canvas lies over the field's
        // text room (tonLegen, again and again: a deck's line is still growing when she starts), in the row's ink; the
        // field's own text and cursor are hidden meanwhile (sf-hoert, solita-frage.css).
        const tonBild = document.createElement('canvas');
        tonEl.appendChild(tonBild);
        const TON_TAKT = 70, TON_BALKEN = 3, TON_ABSTAND = 5;          // ms per bar, bar width and pitch in CSS px
        const TON_EIGENES_MIKRO = !/Android/i.test(navigator.userAgent);
        let tonUhr = 0, lautBis = 0, tonLauf = 0, tonPegel = [], tonTakt = 0, tonSpitze = 0, tonZug = 0;
        let tonStrom = null, tonKontext = null, tonAnalyse = null, tonDaten = null;
        function tonLegen() {
            const cs = getComputedStyle(input), l = parseFloat(cs.paddingLeft) || 0, r = parseFloat(cs.paddingRight) || 0;
            tonEl.style.left = (input.offsetLeft + l) + 'px';
            tonEl.style.top = input.offsetTop + 'px';
            tonEl.style.width = Math.max(0, input.offsetWidth - l - r) + 'px';
            tonEl.style.height = input.offsetHeight + 'px';
        }
        // the loudness right now, 0 … 1
        function tonJetzt() {
            if (tonAnalyse) {
                tonAnalyse.getFloatTimeDomainData(tonDaten);
                let s = 0;
                for (let i = 0; i < tonDaten.length; i++) s += tonDaten[i] * tonDaten[i];
                const db = 20 * Math.log10(Math.sqrt(s / tonDaten.length) + 1e-9);
                return Math.min(1, Math.max(0, (db + 52) / 40));        // -52 dB: a dot, -12 dB and louder: full height
            }
            // words-driven: lively while words arrive, a few dots otherwise
            return Date.now() < lautBis ? 0.3 + 0.6 * Math.abs(Math.sin(Date.now() / 53)) : 0;
        }
        function tonMalen(t) {
            tonLauf = requestAnimationFrame(tonMalen);
            tonSpitze = Math.max(tonSpitze, tonJetzt());                 // the loudest moment of the bar's 70 ms
            if (!tonTakt) tonTakt = t;
            while (t - tonTakt >= TON_TAKT) { tonPegel.push(tonSpitze); tonSpitze = 0; tonTakt += TON_TAKT; }
            const dpr = global.devicePixelRatio || 1, w = tonEl.clientWidth, h = tonEl.clientHeight;
            if (!w || !h) return;
            if (tonBild.width !== Math.round(w * dpr) || tonBild.height !== Math.round(h * dpr)) {
                tonBild.width = Math.round(w * dpr); tonBild.height = Math.round(h * dpr);
            }
            const max = Math.ceil(w / TON_ABSTAND) + 2;
            if (tonPegel.length > max) tonPegel.splice(0, tonPegel.length - max);
            const g = tonBild.getContext('2d');
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
            g.clearRect(0, 0, w, h);
            g.fillStyle = getComputedStyle(tonEl).color;
            // the newest bar at the right edge; between two bars the row glides on by the share of the 70 ms gone
            const gleiten = Math.min(1, (t - tonTakt) / TON_TAKT) * TON_ABSTAND;
            for (let k = tonPegel.length - 1, x = w - TON_BALKEN - gleiten; k >= 0 && x > -TON_BALKEN; k--, x -= TON_ABSTAND) {
                const hb = Math.max(TON_BALKEN, tonPegel[k] * h * 0.72);
                const y = (h - hb) / 2, r = TON_BALKEN / 2;
                g.beginPath();
                if (g.roundRect) g.roundRect(x, y, TON_BALKEN, hb, r); else g.rect(x, y, TON_BALKEN, hb);
                g.fill();
            }
        }
        function tonStart() {
            tonPegel = []; tonTakt = 0; tonSpitze = 0;
            cancelAnimationFrame(tonLauf);
            tonLauf = requestAnimationFrame(tonMalen);
            const AC = global.AudioContext || global.webkitAudioContext;
            if (!TON_EIGENES_MIKRO || !AC || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
            const zug = ++tonZug;                                         // a stop before the stream arrives wins
            navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (s) {
                if (zug !== tonZug) { s.getTracks().forEach(function (tr) { tr.stop(); }); return; }
                tonStrom = s;
                tonKontext = new AC();
                tonAnalyse = tonKontext.createAnalyser();
                tonAnalyse.fftSize = 1024;
                tonDaten = new Float32Array(tonAnalyse.fftSize);
                tonKontext.createMediaStreamSource(s).connect(tonAnalyse);
            }).catch(function (e) { dbg('sound wave: no level of its own, the words drive it (' + (e && e.name) + ')'); });
        }
        function tonStopp() {
            tonZug++;
            cancelAnimationFrame(tonLauf); tonLauf = 0;
            if (tonStrom) tonStrom.getTracks().forEach(function (tr) { tr.stop(); });
            if (tonKontext) tonKontext.close().catch(function () { });
            tonStrom = tonKontext = tonAnalyse = tonDaten = null;
        }
        function hoertZu(an) {
            micBtn.classList.toggle('on', an);
            input.classList.toggle('sf-hoert', an);
            tonEl.hidden = !an;
            clearInterval(tonUhr);
            tonStopp();
            if (an) { lautBis = 0; tonLegen(); tonUhr = setInterval(tonLegen, 200); tonStart(); }
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
            if (!pwd()) { askPassword(); fokus(); say('Einmal das Passwort, dann kann ' + wer() + ' antworten.', 'sf-err'); return; }
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
                        if (url === DS_URL && r.status === 401 && !dsZu) { dsZu = true; zeigeKi(); }   // not with this password
                        return r.json().catch(function () { return {}; }).then(function (j) {
                            const text = r.ok && j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
                            return {
                                text: text || '', status: r.status, usage: j && j.usage, modell: j && j.model, grund: j && j.reason,
                                error: text ? '' : r.status === 401 && url === DS_URL ? 'DeepSeek gibt es nur mit Docs Passwort.'
                                    : String((j && j.error && (j.error.message || j.error)) || 'Das hat nicht geklappt.'),
                            };
                        });
                    });
            }
            function grau(el, res) {                         // DeepSeek's answer: grey, its name in front (as in the decks)
                el.className = 'sf-ds';
                el.innerHTML = '<b>DeepSeek</b>';
                const body = document.createElement('div');
                el.appendChild(body);
                render(body, res.text);
                kostenZeigenDs(body, kostenDs(res.usage, res.modell));
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
            // DeepSeek that refused this password is not asked again (dsZu, zeigeKi)
            const withClaude = who.claude || !who.ds || dsZu, withDs = who.ds && !dsZu;
            // DeepSeek beside her: silent, below, and only once her answer is on screen, so she is read first
            const ds = withClaude && withDs ? say('', 'sf-ds') : null;
            if (ds) ds.hidden = true;
            let dsRes = null, herTurn = false;
            function dsShow() {
                if (!ds || !dsRes || !herTurn) return;
                if (dsRes.text) grau(ds, dsRes);
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
                        answer(res.text, function () { grau(wait, res); return wait; });
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
                    // two answers: Claude's carries its name as DeepSeek's does (Doc, 30.09.2026: "bei dem Text von Claude
                    // auch drüber geschrieben, Claude")
                    answer(res.text, function () {
                        render(wait, res.text); kostenZeigen(wait, k);
                        if (ds) { const b = document.createElement('b'); b.className = 'sf-wer'; b.textContent = 'Claude'; wait.insertBefore(b, wait.firstChild); }
                        herTurn = true; dsShow(); return wait;
                    }, k);
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
            // a letter the voice names best when it spells it itself (SolitaKaraoke.selbst), standing alone in the text
            function buchstabenSelbst(s) {
                const L = SK() && SK().selbst;
                if (!L) return s;
                return s.replace(new RegExp('(^|[\\s(„"\'–-])([' + L + '])(?=$|[\\s,.;:!?)“"\'–-])', 'g'),
                    '$1<say-as interpret-as="characters">$2</say-as>');
            }
            // Solita's voice: one request as before, her sentences parted by breaks and a bracket's words set off - if
            // the sentences are found one by one and their word spans add up (else the plain text, without pauses)
            let ssml = null;
            const pausen = [];
            if (VOICE !== 'doc' && SK() && parts.length === 1) {
                const saetze = SK().stuecke(text, true).map(function (raw) { return { clean: sprechbar(raw), n: SK().woerter(raw, W) }; })
                    .filter(function (p) { return p.clean; });
                if (saetze.length && saetze.reduce(function (x, p) { return x + p.n; }, 0) === parts[0].n) {
                    const s = '<speak>' + saetze.map(function (p) { return klammerPausen(buchstabenSelbst(xml(p.clean))); }).join('<break time="' + SATZPAUSE_MS + 'ms"/> ') + '</speak>';
                    if (s.length <= 4900) {
                        ssml = s;
                        let c = 0;
                        saetze.slice(0, -1).forEach(function (p) { c += p.n; pausen.push(c); });   // a pause before the span with this index
                    }
                }
            }
            const meine = seq;
            let voice = VOICE;                                // a piece that fell back to Studio-C takes the rest along
            const got = [];
            function get(i) {
                if (got[i]) return got[i];
                const ctl = global.AbortController ? new AbortController() : null;
                const timer = setTimeout(function () { if (ctl) ctl.abort(); }, TTS_WAIT);
                got[i] = post(TTS_URL, Object.assign(ssml ? { ssml: ssml } : { text: parts[i].clean.slice(0, 4800) },
                                  { voice: voice, languageCode: 'de-DE', speakingRate: 1.0 }),
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
                    if (i === 0 && k) { k.chars = whole.length; k.doc = voice === 'doc'; k.msVoice = Date.now() - tv; k.pausen = ssml ? pausen.length : 0; }
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
                            { wort: WORT, box: out, aktiv: function () { return audio === a; },
                              pausen: ssml ? pausen : null, pause: SATZPAUSE_IST, klammer: ssml ? KLAMMERPAUSE_IST : 0 });
                    }
                    first += parts[i].n;
                    a.addEventListener('ended', function () {
                        if (audio !== a) return;
                        if (i + 1 < parts.length) setTimeout(function () { play(i + 1, a); }, SATZPAUSE_MS);   // Doc's voice: the pause between two pieces
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
            zeigeKi();
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
            fokus();
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
        clearBtn.addEventListener('click', function () { leeren(); menu.hidden = true; fokus(); });
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
                onState: function (s) { hoertZu(s === 'listening'); },
                onPartial: function (t) { if (!spaet) gehoert(t); },
                onFinal: function (t) {
                    hoertZu(false);
                    if (spaet) { spaet = false; return; }
                    if (t) gehoert(t);
                    fokus();                                     // the cursor back into the line (no keyboard on touch: fokus)
                    if (MIC.selbst && input.value.trim()) submit();
                },
                log: dbg,
            });
            spaet = false;
            ear.start();
        });

        function mikro() { if (micBtn.hidden) return false; micBtn.click(); return true; }   // false: no mic here (the password)
        // Space is the mic's key on every page with the box: on, and again: off - from anywhere on the page, not only
        // in her field (Doc, 30.09.2026: "Wir haben jetzt Shift Space auf Mikrofon. Wir machen das nur mit Space" - the
        // decks no longer turn a page on it; before: Shift+Space, 23.09.2026 for the decks, then central). In her own
        // field Space still types once a question stands there - it is the mic's key while the field is empty, and
        // with Shift always. While she listens, Space sends what was heard and never lands in the field ("auch space
        // soll im Mic Mode abschicken"); nothing heard yet, it stops her. A held key does nothing more.
        // Capture, and nobody else sees the key.
        // The host says more with s.sprechtaste({ ... }), all optional:
        //   offen(), oeffnen()   a line that can be shut: the key shows it first, then she listens
        //   innen: el            the host's element around the box, its moved line and her picture
        //   tasten: ['p', 'P']   more keys that do the same outside of her line and of any field
        //   wenn()               false: not now (a dialog is open)
        let taste = {};
        function micTaste() {                                // not "sprich": that is her voice reading an answer
            if (taste.offen && taste.oeffnen && !taste.offen()) {
                taste.oeffnen();
                setTimeout(mikro, 120);                      // after the line stands
                return true;
            }
            if (!row.offsetParent) return false;             // a box nobody sees does not listen
            return mikro();
        }
        addEventListener('keydown', function (e) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const t = e.target && e.target.closest ? e.target : null;
            const leer = e.code === 'Space', hoert = !!(ear && ear.active);
            if (t && menu.contains(t)) return;               // her menu's boxes take their own Space
            if (t && (root.contains(t) || row.contains(t) || (taste.innen && taste.innen.contains(t)))) {
                if (!leer) return;
                if (t === input && input.value && !e.shiftKey && !hoert) return;   // a question is being typed
                if (e.repeat) { e.preventDefault(); return; }
                if (hoert) { e.preventDefault(); if (input.value.trim()) submit(); else mikro(); return; }
                if (micTaste()) e.preventDefault();          // no mic here (the password): the space is typed
                return;
            }
            if (t && t.closest('input, textarea, select, [contenteditable]')) return;   // typing elsewhere on the page
            if (!leer && (taste.tasten || []).indexOf(e.key) < 0) return;
            if (taste.wenn && !taste.wenn()) return;
            e.preventDefault(); e.stopImmediatePropagation();
            if (!e.repeat) micTaste();
        }, true);

        // keys inside the box stay there: they must not turn the lab's steps
        root.addEventListener('keydown', function (e) { e.stopPropagation(); });

        return {
            frage: frage, vorlesen: vorlesen, stop: stop, leeren: leeren, wechsle: wechsle, bild: bild,
            out: out, row: row,
            feld: function () { return input; },             // a new field after the password - never keep the old one
            mikro: mikro,
            sprechtaste: function (h) { taste = h || {}; },
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
