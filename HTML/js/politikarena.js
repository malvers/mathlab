// Politik-Arena - agents for the parties in the Bundestag negotiate under the strict mandate to find constructive
// solutions (idea: Liliana, 18.10.2026; an experiment for Doc and Liliana, runs locally). The network shows what
// happens: edge colour and width = how close two actors feel on a topic, spokes = how far each one backs the
// proposal in the middle. Every agent call goes through the password-gated Claude proxy (supabase/functions/claude),
// so no key lives in this file.
//
// Design (agreed in the chat, 18.10.2026):
//   - red lines instead of harmony: every party argues from its own program only, a check agent catches concessions
//     the program would not allow (language models give in too easily)
//   - a proposal is only as good as its weakest approval: the consensus meter is the MINIMUM, not the average
//   - two actors without a party: the treasurer (does the money add up?) and the generation retiring around 2060
//   - the women slider: how many of the seven negotiators are women (names only - the persona says nothing else
//     about gender, so the run shows whether the mix alone changes anything); the pilot profile is a separate switch
//   - neutral (Doc, 19.10.2026: "weder weiblich noch männlich, nur der Aufgabe verpflichtet"): no names, no gendered
//     words, no profile - the same prompt minus the person
//   - the parties' own words (19.10.2026): every party agent gets the verbatim pension / migration chapters of its
//     2025 program (politikarena-programme.js), the program check gets all of them; a click on a node shows the whole
//     prompt, so you can see what each agent is told to want
(function () {
    'use strict';

    const AI_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
    const MODELS = { haiku: 'claude-haiku-4-5', sonnet: 'claude-sonnet-4-6' };
    // $ per million tokens [input, output] and the euro rate - the figures solita-frage.js uses
    const PRICE = { 'claude-haiku-4-5': [1, 5], 'claude-sonnet-4-6': [3, 15] };
    const EUR = 0.92;
    const SAVE_KEY = 'politikarena:last';
    const RED = 'rgb(176, 36, 24)', ORANGE = 'rgb(245, 194, 66)', GREEN = 'rgb(121, 158, 49)';

    function dbg(m) { if (window.DebugWindow) DebugWindow.log('[arena] ' + m); }
    function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
    function num10(v) { v = Number(v); return isFinite(v) ? Math.max(0, Math.min(10, v)) : null; }
    function arr(v) { return Array.isArray(v) ? v.map(String).filter(Boolean) : (v ? [String(v)] : []); }
    function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    function komma(x, d) { return Number(x).toFixed(d).replace('.', ','); }
    function geld(eur) { return eur >= 1 ? komma(eur, 2) + ' €' : komma(eur * 100, eur * 100 < 1 ? 2 : 1) + ' ct'; }

    // The actors. Party colours as the parties use them; the Union light grey, because black vanishes on the dark ground.
    // Names are invented and avoid the parties' well-known politicians - nobody real is played here.
    const ACTORS = [
        { id: 'union', party: 'CDU/CSU', short: 'Union', color: '#c9ced6', ink: '#0b1020', f: 'Anna', m: 'Jonas' },
        { id: 'afd', party: 'AfD', short: 'AfD', color: '#009ee0', ink: '#fff', f: 'Clara', m: 'Paul' },
        { id: 'spd', party: 'SPD', short: 'SPD', color: '#e3000f', ink: '#fff', f: 'Marie', m: 'Lukas' },
        { id: 'gruene', party: 'Bündnis 90/Die Grünen', short: 'Grüne', color: '#46962b', ink: '#fff', f: 'Lena', m: 'Tim' },
        { id: 'linke', party: 'Die Linke', short: 'Linke', color: '#be3075', ink: '#fff', f: 'Sophie', m: 'Ben' },
        { id: 'kasse', role: 'kasse', short: 'Kasse', color: ORANGE, ink: '#0b1020', f: 'Hanna', m: 'Max' },
        { id: 'gen', role: 'gen', short: 'Gen 2060', color: '#9b7bff', ink: '#fff', f: 'Mira', m: 'Niklas' },
    ];
    const ACTOR = Object.fromEntries(ACTORS.map(a => [a.id, a]));

    const TOPICS = [
        { id: 'rente', label: 'Rente', dash: null,
          frage: 'Wie sichern wir die gesetzliche Rente bis 2060? Rentenniveau, Beitragssatz, Renteneintrittsalter, Bundeszuschuss, private und kapitalgedeckte Vorsorge.' },
        { id: 'migration', label: 'Migration', dash: '7 5',
          frage: 'Wie steuern wir Migration? Asyl und Schutz, Fachkräfte-Einwanderung, Integration, Rückführung.' },
        { id: 'paket', label: 'Paket Rente + Migration', dash: '2 5',
          frage: 'Ein gemeinsames Paket: Rentenfinanzierung und Fachkräfte-Einwanderung werden zusammen verhandelt – Zugeständnisse beim einen Thema dürfen gegen Gewinne beim anderen getauscht werden.' },
    ];
    const TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));

    // Doc's share of the idea (18.10.2026): pilots who hold their own in a cockpit world with about 6 % women.
    // Traits as the US Air Force NEO PI-R studies found them in female pilots - more assertive and extraverted than
    // women in general, open, calm under stress, mid-career more agreeable than male colleagues (DTIC ADA328845;
    // Aerosp Med Hum Perform 92(4):240) - and the working style of cockpit CRM with Lufthansa's FOR-DEC scheme.
    const PILOT = 'Dein Charakter: wie eine erfahrene Pilotin. Selbstbewusst und durchsetzungsstark, offen für neue ' +
        'Lösungen, ruhig unter Druck, verbindlich im Ton. Du sprichst Probleme klar an, arbeitest mit Fakten statt Parolen ' +
        'und entscheidest nach dem Cockpit-Schema FOR-DEC: Fakten, Optionen, Risiken und Nutzen, Entscheidung, Ausführung, Kontrolle.';
    const RULES = 'Das ist eine Simulation (Politik-Arena, ein Experiment) – keine echte Partei, keine echte Person. ' +
        'Auftrag aller am Tisch: eine konstruktive, umsetzbare Lösung finden. Aber gib nur nach, wo deine Grundsätze ' +
        'Spielraum lassen; deine roten Linien bleiben rot. Lieber ein ehrliches Nein als ein falsches Ja. Antworte knapp ' +
        'und sachlich auf Deutsch, ausschließlich als JSON-Objekt ohne Text davor oder danach.';
    const MOD_SYSTEM = 'Du moderierst die Politik-Arena, eine Simulation (ein Experiment). Am Tisch sitzen Verhandelnde ' +
        'für CDU/CSU, AfD, SPD, Grüne und Linke, dazu eine Kassenprüfung und eine Stimme der Generation 2060. Dein Ziel: ' +
        'ein Vorschlag, den auch die skeptischste Seite noch mittragen kann – er zählt nur so viel wie seine schwächste ' +
        'Zustimmung. Nutze die genannten Spielräume, Tauschgeschäfte, Übergangsfristen, Pilotprojekte und ' +
        'Überprüfungsklauseln. Keine Floskeln: konkrete Maßnahmen, Zahlen wo möglich. Antworte auf Deutsch, ' +
        'ausschließlich als JSON-Objekt ohne Text davor oder danach.';
    const CHECK_SYSTEM = 'Du prüfst in der Politik-Arena (einer Simulation) die Programmtreue. Für jede Partei: Passt ihre ' +
        'Zustimmung zum Vorschlag zu ihrem Wahlprogramm 2025 (Wortlaut der Kapitel unten) und zu ihren roten Linien? Zu ' +
        'viel Nachgiebigkeit ist ein Verstoß, ebenso eine Ablehnung, die das Programm nicht hergibt. Urteile nach dem ' +
        'Wortlaut, nicht nach deinem Bild der Partei. Antworte auf Deutsch, ausschließlich als JSON-Objekt ohne Text ' +
        'davor oder danach.';

    // ------------------------------------------------------------------------------------- the parties' own words
    const PROG = window.PolitikArenaProgramme || null;
    function topicNow() { return state.run ? state.run.topic : state.topic; }
    function sectionsOf(a, topicId) {
        if (!PROG || !a.party) return [];
        return (topicId === 'paket' ? ['rente', 'migration'] : [topicId]).flatMap(k => (PROG[k] && PROG[k][a.id]) || []);
    }
    function pagesOf(s) { return s.seiten[0] === s.seiten[1] ? String(s.seiten[0]) : s.seiten[0] + '–' + s.seiten[1]; }
    function programmeText(a, topicId) {
        const secs = sectionsOf(a, topicId);
        if (!secs.length) return '';
        return 'Aus dem Wahlprogramm 2025 („' + PROG.quellen[a.id].titel + '“), wörtlich:\n\n' +
            secs.map(s => '## ' + s.abschnitt + ' (PDF-Seite ' + pagesOf(s) + ')\n\n' + s.text).join('\n\n');
    }
    function wordsOf(t) { return t ? t.split(/\s+/).filter(Boolean).length : 0; }
    // the check reads every party's chapters - one fixed block per topic, so the proxy's cache carries it from round to round
    function checkSystem(topicId) {
        return CHECK_SYSTEM + '\n\n' + ACTORS.filter(a => a.party).map(a => '# [' + a.id + '] ' + a.party + '\n\n' +
            (programmeText(a, topicId) || '(kein Programmtext)')).join('\n\n');
    }
    // a quotation counts as verbatim when every piece between the ellipses stands in the program
    function plain(t) { return String(t).toLowerCase().replace(/[„“”"‚‘’'«»]/g, '').replace(/[–—-]/g, '-').replace(/\s+/g, ' ').trim(); }
    function quoteFound(q, a, topicId) {
        const hay = plain(sectionsOf(a, topicId).map(s => s.text).join(' '));
        const parts = plain(q).split(/\s*(?:…|\.\.\.)\s*/).filter(x => x.length >= 12);
        return parts.length > 0 && parts.every(x => hay.includes(x));
    }

    const state = {
        topic: 'rente', model: 'sonnet', rounds: 4, threshold: 6,
        women: 5, female: new Set(), profile: 'female', noPilot: false, neutral: false,
        running: false, paused: false, runId: 0, calls: 0, cost: 0,
        run: null,         // { topic, positions, naehe, votes, flags, proposal, round, verdict, female, profile, neutral, heads }
        history: [],       // snapshots for the timeline
        view: -1,          // history index on screen, -1 = live
        finals: {},        // topic id -> final closeness matrix, for "other topics"
        others: false, picked: null, talking: new Set(), statusText: '',
    };

    // ---------------------------------------------------------------------------------------------- who sits at the table
    function setWomen(k) {
        state.women = k;
        const fem = ACTORS.filter(a => state.female.has(a.id)).map(a => a.id);
        const male = ACTORS.filter(a => !state.female.has(a.id)).map(a => a.id);
        // keep who is who where possible: only the difference is drawn at random
        while (fem.length < k) fem.push(male.splice(Math.floor(Math.random() * male.length), 1)[0]);
        while (fem.length > k) fem.splice(Math.floor(Math.random() * fem.length), 1);
        state.female = new Set(fem);
    }
    function shuffleWomen() { state.female = new Set(); setWomen(state.women); }
    function femOf(a) { return state.run && state.run.female ? state.run.female.includes(a.id) : state.female.has(a.id); }
    // the profile in force: the check box "rauslassen" (Doc + Liliana, 18.10.2026: "die Diskussion ist hier groß") wins over the scope
    function profileNow() { return state.noPilot ? 'none' : state.profile; }
    function neutralNow() { return state.run ? !!state.run.neutral : state.neutral; }
    function nameOf(a) { return neutralNow() ? '' : femOf(a) ? a.f : a.m; }
    function pilotOf(a) {
        if (neutralNow()) return false;
        const p = state.run ? state.run.profile : profileNow();
        return p === 'all' || (p === 'female' && femOf(a));
    }
    function label(a) {
        const role = a.party || (a.role === 'kasse' ? 'Kasse' : 'Generation 2060');
        return neutralNow() ? role : role + ' (' + nameOf(a) + ')';
    }
    // who sits there and what they are told to want - everything of the system prompt except the program text
    function personaHead(a) {
        const fem = femOf(a), name = nameOf(a), neutral = neutralNow();
        let who;
        if (a.party) {
            who = (neutral ? 'Du verhandelst für ' + a.party + '.' : 'Du bist ' + name + ', ' + (fem ? 'Verhandlerin' : 'Verhandler') + ' für ' + a.party + '.') +
                ' Du vertrittst die Positionen von ' + a.party + ', wie sie im Wahlprogramm zur Bundestagswahl 2025 stehen. ' +
                'Unten steht der Wortlaut der Programmkapitel zum Thema. Stütze dich darauf und belege deine Positionen mit kurzen ' +
                'wörtlichen Zitaten daraus. Erfinde keine Positionen; wo das Programm zu einer Frage schweigt, sag das.';
        } else if (a.role === 'kasse') {
            who = (neutral ? 'Du führst die Kasse, ohne Partei.' : 'Du bist ' + name + ', ' + (fem ? 'Kassenwartin' : 'Kassenwart') + ' ohne Partei.') +
                ' Du prüfst jeden Vorschlag auf Finanzierbarkeit: Was kostet er, wer zahlt, trägt er bis 2060? Ein Vorschlag ' +
                'ohne Finanzierung bekommt von dir keine hohe Zustimmung.';
        } else {
            who = (neutral ? 'Du sprichst für die Generation 2060, ohne Partei:' : 'Du bist ' + name + ', ' + (fem ? 'Sprecherin' : 'Sprecher') + ' der Generation 2060, ohne Partei:') +
                ' Menschen, die heute um die 30 sind und um 2060 in Rente gehen. Du achtest auf eine faire Lastenverteilung zwischen den Generationen.';
        }
        return RULES + '\n\n' + who + (pilotOf(a) ? '\n\n' + PILOT : '');
    }
    // the program text comes last: one fixed block per agent and topic, which the proxy caches for the whole run
    // During and after a run: the head as it was sent (run.heads); before the first run: a preview from the panel.
    function headOf(a) { return (state.run && state.run.heads && state.run.heads[a.id]) || personaHead(a); }
    function persona(a) {
        const prog = programmeText(a, topicNow());
        return headOf(a) + (prog ? '\n\n' + prog : '');
    }

    // ------------------------------------------------------------------------------------------------------ the proxy
    function pass() { try { return localStorage.getItem('dev_access') || ''; } catch (e) { return ''; } }
    // a password as it comes from the clipboard, without invisible passengers (as solita-frage.js does it)
    function sauber(t) {
        return String(t || '').normalize('NFC').replace(/[\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u2064\uFEFF\r\n\t]/g, '')
            .replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
    }
    function post(body, pw) {
        return fetch(AI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-App-Pass': pw },
            body: JSON.stringify(Object.assign({ pass: pw }, body)),
        });
    }
    function parseJson(t) {
        if (!t) return null;
        const s = t.indexOf('{'), e = t.lastIndexOf('}');
        if (s < 0 || e <= s) return null;
        try { return JSON.parse(t.slice(s, e + 1)); } catch (x) { return null; }
    }
    // One agent call. Problems are told in the protocol, not only in DEBUG (Doc, 18.10.2026: "Kann man das etwas
    // transparenter machen?" - the moderation had run into its token limit twice, cut off mid-JSON). A cut-off
    // answer is asked again with twice the room, a busy server again after a pause.
    const MAX_OUT = 4096;                      // the proxy's own cap (supabase/functions/claude)
    let lastProblem = '';
    async function claude(system, user, maxTokens, who) {
        const model = MODELS[state.model];
        let max = maxTokens;
        for (let attempt = 1; attempt <= 3; attempt++) {
            let r, j;
            try {
                r = await post({ model: model, max_tokens: max, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }, pass());
                j = await r.json().catch(() => ({}));
            } catch (e) { problem(who, 'kein Netz (' + e.message + ')', attempt); await sleep(1500 * attempt); continue; }
            if (r.status === 401) { const err = new Error('auth'); err.auth = true; err.reason = j && j.reason; throw err; }
            if (!r.ok) {
                problem(who, 'Fehler ' + r.status + ': ' + String((j && (j.error && (j.error.message || j.error))) || 'ohne Meldung'), attempt);
                await sleep(2500 * attempt);
                continue;
            }
            state.calls++;
            const u = j && j.usage, p = PRICE[(j && j.model) || model] || PRICE[model];
            // cache writes: the proxy caches the system block for 1 h (2x the input price), the last message for 5 min (1.25x)
            const cc = u && u.cache_creation, write = cc ? (cc.ephemeral_1h_input_tokens || 0) * 2 + (cc.ephemeral_5m_input_tokens || 0) * 1.25
                : (u && u.cache_creation_input_tokens || 0) * 1.25;
            if (u && p) state.cost += ((u.input_tokens || 0) + (u.cache_read_input_tokens || 0) * 0.1 + write) * p[0] / 1e6 * EUR + (u.output_tokens || 0) * p[1] / 1e6 * EUR;
            showCost();
            const text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
            if (j && j.stop_reason === 'max_tokens') {
                const more = Math.min(MAX_OUT, max * 2);
                problem(who, 'Antwort bei ' + max + ' Tokens abgeschnitten' + (more > max ? ' – neuer Versuch mit ' + more : ''), attempt);
                if (more === max) break;
                max = more;
                continue;
            }
            const obj = parseJson(text);
            if (obj) return obj;
            problem(who, 'keine lesbare Antwort: „' + String(text || '').replace(/\s+/g, ' ').slice(0, 120) + '…“', attempt);
        }
        return null;
    }
    function problem(who, msg, attempt) {
        lastProblem = msg;
        dbg((who || '?') + ', attempt ' + attempt + ': ' + msg);
        log(ACTOR[who] || (who === 'center' ? 'center' : null), '<span class="pa-err">Versuch ' + attempt + ': ' + esc(msg) + '</span>');
    }
    async function askActor(a, user, max) {
        state.talking.add(a.id); draw();
        try { return await claude(persona(a), user, max, a.id); } finally { state.talking.delete(a.id); draw(); }
    }
    async function askCenter(system, user, max) {
        state.talking.add('center'); draw();
        try { return await claude(system, user, max, 'center'); } finally { state.talking.delete('center'); draw(); }
    }

    // keys in the agents' JSON: our ids, but a model may write "SPD" or "Grüne" - map those back
    const KEY = {};
    ACTORS.forEach(a => [a.id, a.short, a.party].filter(Boolean).forEach(k => { KEY[k.toLowerCase().replace(/[^a-zäöü0-9]/g, '')] = a.id; }));
    Object.assign(KEY, { grne: 'gruene', grunen: 'gruene', grnen: 'gruene', cdu: 'union', csu: 'union', diegrnen: 'gruene', generation2060: 'gen' });
    function idOf(k) { return KEY[String(k).toLowerCase().replace(/[^a-zäöü0-9]/g, '')] || null; }

    // ---------------------------------------------------------------------------------------------------- the run
    function alive(id) { if (id !== state.runId) throw new Error('stopped'); }
    async function gate(id) { alive(id); while (state.paused) { await sleep(200); alive(id); } }
    function status(t) { state.statusText = t; dbg(t); if (!state.picked) showLive(); }

    function positionsText(except) {
        return ACTORS.filter(a => a.id !== except && state.run.positions[a.id]).map(a => {
            const p = state.run.positions[a.id];
            return '[' + a.id + '] ' + label(a) + ': ' + p.position +
                (p.rote_linien.length ? ' Rote Linien: ' + p.rote_linien.join('; ') + '.' : '') +
                (p.spielraum.length ? ' Spielraum: ' + p.spielraum.join('; ') + '.' : '');
        }).join('\n');
    }
    function proposalText(p) { return p.titel + '\n' + p.punkte.map((x, i) => (i + 1) + '. ' + x).join('\n'); }
    function votesText(votes, except) {
        return ACTORS.filter(a => a.id !== except && votes[a.id]).map(a => {
            const v = votes[a.id];
            return '[' + a.id + '] ' + label(a) + ': ' + v.zustimmung + '/10. ' + v.kommentar +
                (v.rote_linie ? ' Rote Linie: ' + v.rote_linie + '.' : '') + (v.bedingung ? ' Bedingung: ' + v.bedingung : '');
        }).join('\n');
    }
    function setNaehe(from, obj) {
        if (!obj || typeof obj !== 'object') return;
        const row = state.run.naehe[from] = state.run.naehe[from] || {};
        Object.keys(obj).forEach(k => {
            const to = idOf(k);
            if (!to || to === from) return;
            const o = obj[k], wert = num10(o && typeof o === 'object' ? o.wert : o);
            if (wert == null) return;
            row[to] = { wert: wert, grund: (o && typeof o === 'object' && o.grund) ? String(o.grund) : (row[to] && row[to].grund) || '' };
        });
    }
    function score(view, id) {
        const v = view.votes && view.votes[id], f = view.flags && view.flags[id];
        if (!v || v.zustimmung == null) return null;
        return f && f.treu === false && f.korrektur != null ? f.korrektur : v.zustimmung;
    }
    function consensus(view) {
        const xs = ACTORS.map(a => ({ a: a, s: score(view, a.id) })).filter(x => x.s != null);
        if (!xs.length) return null;
        const min = xs.reduce((m, x) => x.s < m.s ? x : m, xs[0]);
        return { min: min.s, weakest: min.a, avg: xs.reduce((s, x) => s + x.s, 0) / xs.length };
    }
    function snap(lbl) {
        const r = state.run;
        state.history.push({ label: lbl, naehe: clone(r.naehe), votes: clone(r.votes), flags: clone(r.flags), proposal: clone(r.proposal), round: r.round, verdict: clone(r.verdict) });
        syncTimeline();
        draw();
    }

    async function run() {
        const id = ++state.runId;
        const topic = TOPIC[state.topic];
        state.run = { topic: topic.id, positions: {}, naehe: {}, votes: {}, flags: {}, proposal: null, round: 0, verdict: null,
            female: Array.from(state.female), profile: profileNow(), neutral: state.neutral, model: MODELS[state.model] };
        // what each agent was told, kept as sent - the lineup may change after the run, the record must not
        state.run.heads = Object.fromEntries(ACTORS.map(a => [a.id, personaHead(a)]));
        state.history = []; state.view = -1; state.picked = null;
        state.running = true; state.paused = false;
        syncButtons(); syncTimeline(); clearLog(); renderLineup();
        log(null, 'Thema: <b>' + esc(topic.label) + '</b> · ' + esc(MODELS[state.model]) + ' · ' +
            (state.run.neutral ? 'neutral, ohne Namen und Geschlecht' : state.female.size + ' von 7 sind Frauen') +
            (PROG ? ' · Parteien mit ihrem Programmtext' : ' · <span class="pa-err">ohne Programmtexte (Datei fehlt)</span>'));
        try {
            await gate(id);
            status('Runde 0 · Ausgangspositionen');
            await Promise.all(ACTORS.map(async a => {
                const o = await askActor(a, 'Thema: ' + topic.frage + '\n\nLege deine Ausgangsposition dar. JSON: ' +
                    '{"position": "2-3 Sätze", "rote_linien": ["...", "..."], "spielraum": ["..."]' +
                    (a.party ? ', "belege": ["bis zu drei kurze wörtliche Zitate aus deinem Programmtext, die deine Position tragen"]' : '') + '}', 1400);
                alive(id);
                state.run.positions[a.id] = o ? { position: String(o.position || ''), rote_linien: arr(o.rote_linien), spielraum: arr(o.spielraum), belege: arr(o.belege) }
                    : { position: '(keine Antwort)', rote_linien: [], spielraum: [], belege: [] };
                log(a, esc(state.run.positions[a.id].position));
            }));
            snap('Ausgangspositionen');

            await gate(id);
            status('Runde 0 · Wer steht wem nahe?');
            await Promise.all(ACTORS.map(async a => {
                const others = ACTORS.filter(b => b !== a).map(b => b.id);
                const o = await askActor(a, 'Thema: ' + topic.frage + '\n\nDie Ausgangspositionen am Tisch (Schlüssel in eckigen Klammern):\n' +
                    positionsText() + '\n\nWie nah stehst du in diesem Thema jeder anderen Seite? 0 = unvereinbar, 10 = deckungsgleich. ' +
                    'JSON: {"naehe": {"<schlüssel>": {"wert": 0-10, "grund": "ein kurzer Satz"}}} mit genau diesen Schlüsseln: ' + others.join(', '), 1400);
                alive(id);
                setNaehe(a.id, o && o.naehe);
                draw();
            }));
            snap('Nähe zueinander');

            let c = null;
            for (let r = 1; r <= state.rounds; r++) {
                state.run.round = r;
                await gate(id);
                status('Runde ' + r + ' · Die Moderation schreibt einen Vorschlag');
                const prev = state.run.proposal, before = state.run.votes;
                let user = 'Thema: ' + topic.frage + '\n\nDie Positionen am Tisch (Schlüssel in eckigen Klammern):\n' + positionsText();
                if (prev) user += '\n\nDein letzter Vorschlag:\n' + proposalText(prev) + '\n\nSo wurde abgestimmt (0-10), mit diesen Bedingungen:\n' + votesText(before);
                user += '\n\nSchreibe ' + (prev ? 'einen verbesserten' : 'einen ersten') + ' Kompromissvorschlag. Hebe vor allem die schwächste ' +
                    'Zustimmung an, ohne die anderen zu verlieren. Jede Maßnahme höchstens zwei Sätze. JSON: {"titel": "kurz", "punkte": ["3 bis 6 konkrete Maßnahmen"], ' +
                    '"begruendung": "ein Satz: warum das alle mittragen können"}';
                const m = await askCenter(MOD_SYSTEM, user, 2500);
                alive(id);
                if (m) state.run.proposal = { titel: String(m.titel || 'Vorschlag'), punkte: arr(m.punkte), begruendung: String(m.begruendung || '') };
                if (!state.run.proposal) throw new Error('Die Moderation hat keinen Vorschlag geliefert' + (lastProblem ? ' – ' + lastProblem : '') + '.');
                state.run.votes = {}; state.run.flags = {};
                log('center', '<b>' + esc(state.run.proposal.titel) + '</b> – ' + state.run.proposal.punkte.map(esc).join(' · '));
                snap('Runde ' + r + ' · Vorschlag');

                await gate(id);
                status('Runde ' + r + ' · Abstimmung');
                await Promise.all(ACTORS.map(async a => {
                    const own = state.run.positions[a.id], others = ACTORS.filter(b => b !== a).map(b => b.id);
                    const o = await askActor(a, 'Thema: ' + topic.frage + '\n\nDeine Ausgangsposition: ' + own.position +
                        (own.rote_linien.length ? ' Deine roten Linien: ' + own.rote_linien.join('; ') + '.' : '') +
                        '\n\nVorschlag der Moderation (Runde ' + r + '):\n' + proposalText(state.run.proposal) +
                        (r > 1 ? '\n\nWas die anderen in der letzten Runde gesagt haben:\n' + votesText(before, a.id)
                            : '\n\nDie Positionen der anderen:\n' + positionsText(a.id)) +
                        '\n\nBewerte den Vorschlag aus deiner Sicht. Und: Wie nah stehst du den anderen Seiten jetzt? JSON: ' +
                        '{"zustimmung": 0-10, "rote_linie": "welche deiner roten Linien verletzt ist, sonst leer", ' +
                        '"bedingung": "Ich stimme (mehr) zu, wenn ...", "kommentar": "ein Satz", "naehe": {"<schlüssel>": 0-10}} ' +
                        'mit diesen Schlüsseln: ' + others.join(', '), 1200);
                    alive(id);
                    state.run.votes[a.id] = o ? { zustimmung: num10(o.zustimmung), rote_linie: String(o.rote_linie || ''),
                        bedingung: String(o.bedingung || ''), kommentar: String(o.kommentar || '') }
                        : { zustimmung: null, rote_linie: '', bedingung: '', kommentar: '(keine Antwort)' };
                    setNaehe(a.id, o && o.naehe);
                    const v = state.run.votes[a.id];
                    log(a, '<b>' + (v.zustimmung == null ? '–' : v.zustimmung) + '/10</b> ' + esc(v.kommentar) + (v.bedingung ? ' <i>' + esc(v.bedingung) + '</i>' : ''));
                    draw();
                }));

                await gate(id);
                status('Runde ' + r + ' · Prüfung der Programmtreue');
                const parties = ACTORS.filter(a => a.party);
                const chk = await askCenter(checkSystem(topic.id), 'Vorschlag:\n' + proposalText(state.run.proposal) + '\n\nDie Parteien:\n' +
                    parties.map(a => {
                        const p = state.run.positions[a.id], v = state.run.votes[a.id];
                        return '[' + a.id + '] ' + a.party + ' – Ausgangsposition: ' + p.position + (p.rote_linien.length ? ' Rote Linien: ' + p.rote_linien.join('; ') + '.' : '') +
                            ' → Zustimmung ' + (v.zustimmung == null ? '–' : v.zustimmung) + '/10: ' + v.kommentar;
                    }).join('\n') + '\n\nPrüfe jede Partei. JSON: {"pruefung": {"<schlüssel>": {"treu": true oder false, ' +
                    '"korrektur": 0-10 oder null, "hinweis": "ein Satz"}}} mit diesen Schlüsseln: ' + parties.map(a => a.id).join(', '), 1500);
                alive(id);
                const pr = chk && chk.pruefung;
                if (pr && typeof pr === 'object') Object.keys(pr).forEach(k => {
                    const to = idOf(k), o = pr[k];
                    if (!to || !o || typeof o !== 'object') return;
                    state.run.flags[to] = { treu: o.treu !== false, korrektur: num10(o.korrektur), hinweis: String(o.hinweis || '') };
                    if (o.treu === false) log(ACTOR[to], '<span class="pa-err">Prüfung: ' + esc(o.hinweis) + (num10(o.korrektur) != null ? ' → zählt ' + num10(o.korrektur) + '/10' : '') + '</span>');
                });
                c = consensus(state.run);
                if (c) log(null, 'Runde ' + r + ': Konsens <b>' + c.min + '/10</b> (schwächste Stelle: ' + esc(c.weakest.short) + '), Mittel ' + komma(c.avg, 1));
                snap('Runde ' + r + ' · Abstimmung');
                if (c && c.min >= state.threshold) break;
            }
            state.run.verdict = c ? { ok: c.min >= state.threshold, min: c.min, weakest: c.weakest.id, round: state.run.round } : null;
            const vd = state.run.verdict;
            status(vd && vd.ok ? 'Einigung in Runde ' + vd.round + ' – auch die skeptischste Seite trägt mit (' + vd.min + '/10)'
                : 'Keine Einigung nach ' + state.run.round + ' Runden – die engste Stelle: ' + (vd ? ACTOR[vd.weakest].short + ' (' + vd.min + '/10)' : '–'));
            log(null, '<b>' + esc(state.statusText) + '</b>');
            snap(vd && vd.ok ? 'Einigung' : 'Keine Einigung');
            state.finals[topic.id] = clone(state.run.naehe);
            save();
        } catch (e) {
            if (e.message === 'stopped') return;
            if (e.auth) {
                status(e.reason === 'locked' ? 'Das Passwort ist richtig, aber gerade gesperrt.' : 'Das Passwort gilt nicht mehr – bitte neu eingeben.');
                try { localStorage.removeItem('dev_access'); } catch (x) { }
                showPassCard(true);
            } else {
                status('Abgebrochen: ' + e.message);
            }
            log(null, '<span class="pa-err">' + esc(state.statusText) + '</span>');
            dbg('run failed: ' + (e.stack || e.message));
        } finally {
            if (id === state.runId) {
                state.running = false; state.paused = false; state.talking.clear();
                syncButtons(); draw(); showLive();
            }
        }
    }

    // ----------------------------------------------------------------------------------------------- the network
    const svg = d3.select('#arena');
    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id', 'pa-glow').attr('x', '-60%').attr('y', '-60%').attr('width', '220%').attr('height', '220%');
    glow.append('feGaussianBlur').attr('stdDeviation', 5).attr('result', 'b');
    const fm = glow.append('feMerge');
    fm.append('feMergeNode').attr('in', 'b');
    fm.append('feMergeNode').attr('in', 'SourceGraphic');
    const gEdges = svg.append('g'), gHits = svg.append('g'), gSpokes = svg.append('g'), gCenter = svg.append('g').attr('class', 'pa-center'), gNodes = svg.append('g');
    const color = d3.scaleLinear().domain([0, 5, 10]).range([RED, ORANGE, GREEN]).interpolate(d3.interpolateRgb).clamp(true);
    const nodes = ACTORS.map((a, i) => ({ id: a.id, a: a, i: i }));
    const NODE = Object.fromEntries(nodes.map(n => [n.id, n]));
    let W = 800, H = 600, CX = 400, CY = 300, R = 200, NR = 28, linkSig = '', placed = false;
    const sim = d3.forceSimulation(nodes).alphaDecay(0.03).on('tick', tick);

    svg.on('click', () => { state.picked = null; draw(); showLive(); });

    gCenter.append('circle').attr('class', 'pa-ring').attr('r', 26).attr('stroke', '#fff');
    gCenter.append('rect').attr('class', 'pa-diamond').attr('x', -20).attr('y', -20).attr('width', 40).attr('height', 40).attr('rx', 5)
        .attr('transform', 'rotate(45)').attr('fill', 'rgba(255,255,255,0.08)').attr('stroke', ORANGE).attr('stroke-width', 2).attr('filter', 'url(#pa-glow)');
    const cTop = gCenter.append('text').attr('text-anchor', 'middle').attr('y', -38).attr('font-size', 11).attr('fill', 'rgba(255,255,255,0.7)');
    const cNum = gCenter.append('text').attr('text-anchor', 'middle').attr('y', 6).attr('font-size', 15).attr('font-weight', 700).attr('fill', '#fff');
    const cLow = gCenter.append('text').attr('text-anchor', 'middle').attr('y', 46).attr('font-size', 10).attr('fill', 'rgba(255,255,255,0.6)');
    gCenter.on('click', ev => { ev.stopPropagation(); state.picked = { kind: 'center' }; draw(); showLive(); });

    function shown() {
        if (state.view >= 0 && state.history[state.view]) return state.history[state.view];
        return state.run || { naehe: {}, votes: {}, flags: {}, proposal: null };
    }
    function pairValue(naehe, a, b) {
        const xs = [naehe[a] && naehe[a][b], naehe[b] && naehe[b][a]].map(o => o && o.wert).filter(v => v != null);
        return xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : null;
    }
    function edgeData() {
        const main = state.run ? state.run.topic : state.topic;
        const sets = [{ t: main, naehe: shown().naehe || {} }];
        if (state.others) TOPICS.forEach(t => { if (t.id !== main && state.finals[t.id]) sets.push({ t: t.id, naehe: state.finals[t.id] }); });
        const out = [];
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i].id, b = nodes[j].id;
            const list = sets.map(s => ({ t: s.t, v: pairValue(s.naehe, a, b) })).filter(e => e.v != null);
            list.forEach((e, k) => out.push({ key: a + '|' + b + '|' + e.t, a: a, b: b, t: e.t, v: e.v, k: k - (list.length - 1) / 2, main: e.t === main }));
        }
        return out;
    }
    function layout() {
        const rect = document.getElementById('canvas-container').getBoundingClientRect();
        W = Math.max(300, rect.width); H = Math.max(300, rect.height);
        svg.attr('viewBox', '0 0 ' + W + ' ' + H);
        // the network lives beside or below the coach box, whichever leaves the bigger square
        let area = { x: 0, y: 0, w: W, h: H };
        const box = document.getElementById('math-coach-box');
        if (box && box.offsetParent !== null) {
            const b = box.getBoundingClientRect(), right = b.right - rect.left, bottom = b.bottom - rect.top;
            const beside = { x: right, y: 0, w: W - right, h: H }, below = { x: 0, y: bottom, w: W, h: H - bottom };
            area = Math.min(beside.w, beside.h) >= Math.min(below.w, below.h) ? beside : below;
        }
        const ox = CX, oy = CY, oR = R;
        CX = area.x + area.w / 2; CY = area.y + area.h / 2;
        R = Math.max(90, Math.min(area.w, area.h) * 0.34);
        // a new size moves and scales the whole picture - the radial force alone would leave the nodes bunched on one side
        if (placed) nodes.forEach(n => { n.x = CX + (n.x - ox) * R / oR; n.y = CY + (n.y - oy) * R / oR; });
        NR = Math.max(18, Math.min(30, R * 0.14));
        if (!placed) {
            placed = true;
            nodes.forEach(n => {
                const t = n.i / nodes.length * 2 * Math.PI - Math.PI / 2;
                n.x = CX + R * Math.cos(t); n.y = CY + R * Math.sin(t);
            });
        }
        sim.force('radial', d3.forceRadial(R, CX, CY).strength(0.35))
            .force('collide', d3.forceCollide(NR * 2.1))
            .force('charge', d3.forceManyBody().strength(-30));
        linkSig = '';
        draw();
    }
    // agreeing actors pull together, so a political map grows out of the negotiation by itself
    function relink(edges) {
        const main = edges.filter(e => e.main);
        const sig = main.map(e => e.key + e.v).join();
        if (sig === linkSig) return;
        linkSig = sig;
        sim.force('link', d3.forceLink(main.map(e => ({ source: e.a, target: e.b, v: e.v }))).id(d => d.id)
            .distance(l => R * (0.45 + (10 - l.v) / 10 * 1.35)).strength(0.12));
        sim.alpha(0.7).restart();
    }

    function draw() {
        const view = shown(), edges = edgeData();
        relink(edges);
        const sel = gEdges.selectAll('path.pa-edge').data(edges, d => d.key);
        sel.exit().remove();
        sel.enter().append('path').attr('class', 'pa-edge');
        const hit = gHits.selectAll('path.pa-hit').data(edges, d => d.key);
        hit.exit().remove();
        hit.enter().append('path').attr('class', 'pa-hit')
            .on('click', (ev, d) => { ev.stopPropagation(); state.picked = { kind: 'edge', a: d.a, b: d.b, t: d.t }; draw(); showLive(); })
            .append('title');
        gHits.selectAll('path.pa-hit').select('title')
            .text(d => ACTOR[d.a].short + ' ↔ ' + ACTOR[d.b].short + ' · ' + TOPIC[d.t].label + ': ' + komma(d.v, 1) + '/10');
        gEdges.selectAll('path.pa-edge')
            .attr('stroke', d => color(d.v))
            .attr('stroke-width', d => (d.main ? 1.2 : 0.8) + d.v * (d.main ? 0.55 : 0.3))
            .attr('opacity', d => {
                const p = state.picked;
                if (p && p.kind === 'node') return d.a === p.id || d.b === p.id ? 0.95 : 0.08;
                if (p && p.kind === 'edge') return d.a === p.a && d.b === p.b && d.t === p.t ? 1 : 0.12;
                return d.main ? 0.35 + d.v * 0.05 : 0.4;
            })
            .attr('stroke-dasharray', d => TOPIC[d.t].dash);

        const spokes = ACTORS.filter(a => score(view, a.id) != null).map(a => ({ id: a.id, s: score(view, a.id), flag: view.flags && view.flags[a.id] && view.flags[a.id].treu === false }));
        const sp = gSpokes.selectAll('line.pa-spoke').data(spokes, d => d.id);
        sp.exit().remove();
        sp.enter().append('line').attr('class', 'pa-spoke').attr('stroke-linecap', 'round')
            .on('click', (ev, d) => { ev.stopPropagation(); state.picked = { kind: 'node', id: d.id }; draw(); showLive(); });
        gSpokes.selectAll('line.pa-spoke').attr('stroke', d => color(d.s)).attr('stroke-width', d => 1.5 + d.s * 0.4)
            .attr('stroke-dasharray', d => d.flag ? '3 4' : null).attr('opacity', 0.75);

        const ns = gNodes.selectAll('g.pa-node').data(nodes, d => d.id);
        const ne = ns.enter().append('g').attr('class', 'pa-node')
            .on('click', (ev, d) => { ev.stopPropagation(); state.picked = { kind: 'node', id: d.id }; draw(); showLive(); })
            .call(d3.drag()
                .on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y; })
                .on('drag', (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
                .on('end', (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));
        ne.append('circle').attr('class', 'pa-ring');
        ne.append('circle').attr('class', 'pa-dot').attr('filter', 'url(#pa-glow)');
        ne.append('text').attr('class', 'pa-in').attr('text-anchor', 'middle').attr('font-weight', 700);
        ne.append('text').attr('class', 'pa-name').attr('text-anchor', 'middle').attr('font-weight', 700).attr('fill', '#fff');
        ne.append('text').attr('class', 'pa-sub').attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.65)');
        const flag = ne.append('g').attr('class', 'pa-flag');
        flag.append('circle').attr('r', 8).attr('fill', RED).attr('stroke', '#fff').attr('stroke-width', 1.5);
        flag.append('text').attr('text-anchor', 'middle').attr('y', 4).attr('font-size', 11).attr('font-weight', 700).attr('fill', '#fff').text('!');
        const all = gNodes.selectAll('g.pa-node');
        all.classed('talking', d => state.talking.has(d.id))
            .classed('picked', d => state.picked && state.picked.kind === 'node' && state.picked.id === d.id);
        all.select('.pa-ring').attr('r', NR).attr('stroke', d => d.a.color);
        all.select('.pa-dot').attr('r', NR).attr('fill', d => d.a.color).attr('stroke', 'rgba(255,255,255,0.35)').attr('stroke-width', 1.5);
        // inside the dot: the actor's approval of the proposal, once there is a vote
        all.select('.pa-in').attr('y', NR * 0.3).attr('font-size', NR * 0.8).attr('fill', d => d.a.ink)
            .text(d => { const s = score(view, d.id); return s == null ? '' : Math.round(s); });
        all.select('.pa-name').attr('y', NR + 15).attr('font-size', 12).text(d => d.a.short);
        all.select('.pa-sub').attr('y', NR + 29).attr('font-size', 10).text(d => nameOf(d.a) + (pilotOf(d.a) ? ' · Pilotin' : ''));
        all.select('.pa-flag').attr('transform', 'translate(' + (NR * 0.75) + ',' + (-NR * 0.75) + ')')
            .attr('display', d => view.flags && view.flags[d.id] && view.flags[d.id].treu === false ? null : 'none');

        gCenter.classed('talking', state.talking.has('center')).classed('picked', !!(state.picked && state.picked.kind === 'center'));
        const c = consensus(view);
        cTop.text(view.proposal ? 'Vorschlag · Runde ' + view.round : 'Arena');
        cNum.text(c ? c.min : '').attr('fill', c ? color(c.min) : '#fff');
        cLow.text(c ? 'Konsens (schwächste Stimme)' : (state.running ? '' : 'START drücken'));
        tick();
    }
    function tick() {
        gCenter.attr('transform', 'translate(' + CX + ',' + CY + ')');
        gNodes.selectAll('g.pa-node').attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
        gSpokes.selectAll('line.pa-spoke').attr('x1', d => NODE[d.id].x).attr('y1', d => NODE[d.id].y).attr('x2', CX).attr('y2', CY);
        gEdges.selectAll('path.pa-edge').attr('d', edgePath);
        gHits.selectAll('path.pa-hit').attr('d', edgePath);
    }
    function edgePath(d) {
        const p = NODE[d.a], q = NODE[d.b];
        if (!d.k) return 'M' + p.x + ',' + p.y + 'L' + q.x + ',' + q.y;
        const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
        return 'M' + p.x + ',' + p.y + 'Q' + (mx - dy / L * d.k * 26) + ',' + (my + dx / L * d.k * 26) + ' ' + q.x + ',' + q.y;
    }

    // ------------------------------------------------------------------------------------------------ coach box
    const coach = document.getElementById('coach-content');
    // the copy button (coach-box.js, data-copy): the proposal as a text to send on, with the votes and a note that it is a simulation
    document.getElementById('math-coach-box').copyText = function () {
        const view = shown(), t = state.run ? TOPIC[state.run.topic] : TOPIC[state.topic];
        let head = 'Politik-Arena · ' + t.label + (view.round ? ' · Runde ' + view.round : '');
        if (state.picked || !view.proposal) return head + '\n\n' + coach.innerText.trim();
        const pr = view.proposal, c = consensus(view);
        const votes = ACTORS.filter(a => score(view, a.id) != null).map(a => a.short + ' ' + score(view, a.id)).join(' · ');
        return head + '\n\n' + pr.titel + '\n' + pr.punkte.map((x, i) => (i + 1) + '. ' + x).join('\n') +
            (pr.begruendung ? '\n\n' + pr.begruendung : '') +
            (c ? '\n\nKonsens ' + c.min + '/10 (schwächste Stimme: ' + c.weakest.short + '), Mittel ' + komma(c.avg, 1) : '') +
            (votes ? '\nAbstimmung: ' + votes : '') +
            '\n\n(Simulation mit KI-Agentinnen, keine echten Parteien oder Personen' + (state.run && state.run.model ? ' – ' + state.run.model : '') + ')';
    };
    function showLive() {
        const view = shown(), p = state.picked;
        if (p && p.kind === 'node') return showActor(ACTOR[p.id], view);
        if (p && p.kind === 'edge') return showEdge(p, view);
        let h = '<div class="pa-step">' + esc(state.view >= 0 && state.history[state.view] ? 'Zeitleiste: ' + state.history[state.view].label : state.statusText || 'Bereit') + '</div>';
        if (view.proposal) h += proposalHtml(view);
        else if (!state.run) h += '<div>Sieben Verhandelnde, ein Auftrag: eine Lösung finden, ohne die eigenen roten Linien zu verraten. ' +
            'Thema wählen, START drücken. Linien zwischen den Seiten: <b>grün</b> = einig, <b>rot</b> = uneinig, dick = stark. ' +
            'Knoten, Linien und den Vorschlag in der Mitte anklicken – ein Knoten zeigt auch seinen ganzen Auftrag, die Mitte den der Moderation.</div>';
        if (p && p.kind === 'center') h += centerPromptHtml();
        coach.innerHTML = h;
    }
    function proposalHtml(view) {
        const pr = view.proposal, c = consensus(view);
        let h = '<div><b>' + esc(pr.titel) + '</b></div><ul>' + pr.punkte.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
        if (pr.begruendung) h += '<div class="pa-dim">' + esc(pr.begruendung) + '</div>';
        if (c) h += '<div style="margin-top:6px">Konsens <span class="pa-score" style="color:' + color(c.min) + '">' + c.min + '/10</span> ' +
            '<span class="pa-dim">· schwächste Stimme ' + esc(c.weakest.short) + ' · Mittel ' + komma(c.avg, 1) + '</span></div>';
        return h;
    }
    function showActor(a, view) {
        const p = state.run && state.run.positions[a.id], v = view.votes && view.votes[a.id], f = view.flags && view.flags[a.id];
        let h = '<div class="pa-step" style="color:' + a.color + '">' + esc(label(a)) + (pilotOf(a) ? ' · Pilotin' : '') + '</div>';
        if (!p) h += '<div class="pa-dim">Noch nichts gesagt.</div>';
        else {
            h += '<div>' + esc(p.position) + '</div>';
            if (p.rote_linien.length) h += '<div style="margin-top:6px"><b>Rote Linien</b></div><ul>' + p.rote_linien.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
            if (p.spielraum.length) h += '<div><b>Spielraum</b></div><ul>' + p.spielraum.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
        }
        if (v) {
            const s = score(view, a.id);
            h += '<div>Zum Vorschlag: <span class="pa-score" style="color:' + (s == null ? '#fff' : color(s)) + '">' + (s == null ? '–' : s) + '/10</span> ' + esc(v.kommentar) + '</div>';
            if (v.rote_linie) h += '<div class="pa-err">Rote Linie: ' + esc(v.rote_linie) + '</div>';
            if (v.bedingung) h += '<div class="pa-dim">' + esc(v.bedingung) + '</div>';
        }
        if (f && f.treu === false) h += '<div class="pa-err" style="margin-top:6px">Prüfung: ' + esc(f.hinweis) + '</div>';
        if (p && p.belege && p.belege.length) {
            h += '<div style="margin-top:6px"><b>Belege aus dem Programm</b></div><ul class="pa-quotes">' + p.belege.map(q => {
                const ok = quoteFound(q, a, state.run.topic);
                return '<li class="' + (ok ? 'pa-ok' : 'pa-warn') + '">„' + esc(q) + '“ <span class="pa-dim">' +
                    (ok ? '✓ steht so im Programm' : '⚠ nicht wörtlich im Programmtext gefunden') + '</span></li>';
            }).join('') + '</ul>';
        }
        coach.innerHTML = h + promptHtml(a);
    }
    // "das Wollen": the whole system prompt of an agent - the instruction open, the program text folded
    function promptHtml(a) {
        const t = topicNow(), secs = sectionsOf(a, t), src = PROG && PROG.quellen[a.id];
        const when = !state.run ? 'Vorschau für den nächsten Lauf' : state.run.heads ? 'so im Lauf gesendet'
            : 'Vorschau – der gespeicherte Lauf lief noch ohne Programmtext';
        let h = '<details class="pa-prompt-box" open><summary>Auftrag (Prompt) · ' + esc(TOPIC[t].label) + ' · <span class="pa-dim">' + when + '</span></summary>' +
            '<div class="pa-prompt">' + esc(headOf(a)) + '</div>';
        if (secs.length) {
            h += '<details class="pa-prompt-box"><summary>Dazu der Programmtext · ' + wordsOf(secs.map(s => s.text).join(' ')).toLocaleString('de-DE') + ' Wörter</summary>' +
                '<div class="pa-dim">Quelle: <a href="' + esc(src.url) + '#page=' + secs[0].seiten[0] + '" target="_blank" rel="noopener">' + esc(src.titel) + '</a>, ' +
                secs.map(s => esc(s.abschnitt) + ' (PDF-Seite ' + pagesOf(s) + ')').join('; ') + '</div>' +
                '<div class="pa-prompt">' + esc(programmeText(a, t)) + '</div></details>';
        } else if (a.party) h += '<div class="pa-err">Kein Programmtext geladen – die Agentin stützt sich nur auf das Wissen des Modells.</div>';
        else h += '<div class="pa-dim">Ohne Partei – also auch ohne Programmtext.</div>';
        return h + '</details>';
    }
    // the two roles in the middle: moderation and program check
    function centerPromptHtml() {
        const t = topicNow(), n = wordsOf(ACTORS.filter(a => a.party).map(a => programmeText(a, t)).join(' '));
        return '<details class="pa-prompt-box"><summary>Auftrag der Moderation</summary><div class="pa-prompt">' + esc(MOD_SYSTEM) + '</div></details>' +
            '<details class="pa-prompt-box"><summary>Auftrag der Programmprüfung</summary><div class="pa-prompt">' + esc(CHECK_SYSTEM) + '</div>' +
            '<div class="pa-dim">Dazu der Programmtext aller fünf Parteien zum Thema ' + esc(TOPIC[t].label) + ' (' + n.toLocaleString('de-DE') + ' Wörter) – derselbe, den die Parteien sehen.</div></details>';
    }
    function showEdge(p, view) {
        const naehe = p.t === (state.run && state.run.topic) ? view.naehe : state.finals[p.t] || {};
        const A = ACTOR[p.a], B = ACTOR[p.b];
        const side = (x, y) => { const o = naehe[x.id] && naehe[x.id][y.id]; return o ? '<div><b style="color:' + x.color + '">' + esc(x.short) + '</b> → ' + esc(y.short) + ': <span class="pa-score" style="color:' + color(o.wert) + '">' + o.wert + '/10</span> ' + esc(o.grund) + '</div>' : ''; };
        coach.innerHTML = '<div class="pa-step">' + esc(A.short) + ' ↔ ' + esc(B.short) + ' · ' + esc(TOPIC[p.t].label) + '</div>' + side(A, B) + side(B, A);
    }

    // ------------------------------------------------------------------------------------------------ the panel
    function sliderOf(id) { const box = document.getElementById(id); return { input: box.querySelector('input[type=range]'), out: box.querySelector('.val-display') }; }
    let timeline = null;
    function buildPanel() {
        CyberUI.createCard('ui-container', 'Arena',
            '<div id="pa-topic"></div><div id="pa-model"></div><div id="pa-rounds"></div><div id="pa-thr"></div>' +
            '<div class="pa-btn-grid"><button type="button" class="cyber-btn" id="pa-run">START</button>' +
            '<button type="button" class="cyber-btn" id="pa-stop">STOPP</button></div>' +
            '<div class="pa-count" id="pa-cost"></div>', '#f5c242');
        CyberUI.createRadioGroup('pa-topic', 'Thema', TOPICS.map(t => ({ label: t.label, value: t.id })), state.topic, v => { state.topic = v; if (!state.run) showLive(); });
        CyberUI.createRadioGroup('pa-model', 'Modell', [{ label: 'Sonnet – klüger', value: 'sonnet' }, { label: 'Haiku – günstiger', value: 'haiku' }], state.model, v => { state.model = v; });
        CyberUI.createSlider('pa-rounds', 'Runden höchstens', 1, 6, state.rounds, 1, v => { state.rounds = Math.round(v); });
        CyberUI.createSlider('pa-thr', 'Einigung ab', 4, 9, state.threshold, 1, v => { state.threshold = Math.round(v); }, 'var(--neon-blue)', v => Math.round(v) + '/10');
        document.getElementById('pa-run').addEventListener('click', () => {
            if (!state.running) {
                if (!pass()) { showPassCard(true); return; }
                const panel = document.getElementById('side-panel');
                if (window.innerWidth < 900 && panel && !panel.classList.contains('collapsed') && typeof window.toggleSidebar === 'function') window.toggleSidebar();
                run();
            }
            else { state.paused = !state.paused; status(state.paused ? 'Pause' : state.statusText.replace(/^Pause$/, 'Weiter')); }
            syncButtons();
        });
        document.getElementById('pa-stop').addEventListener('click', () => {
            if (!state.running) return;
            state.runId++; state.running = false; state.paused = false; state.talking.clear();
            status('Gestoppt'); syncButtons(); draw();
        });

        CyberUI.createCard('ui-container', 'Verhandlerinnen',
            '<div id="pa-neutral"></div>' +
            '<div id="pa-persons"><div id="pa-women"></div><div id="pa-nopilot"></div><div id="pa-profile"></div>' +
            '<div class="pa-btn-grid"><button type="button" class="cyber-btn" id="pa-mix">NEU MISCHEN</button></div></div>' +
            '<ul class="pa-lineup" id="pa-lineup"></ul>' +
            '<div class="pa-info"><b>Neutral</b>: keine Namen, kein Geschlecht, kein Profil – nur der Auftrag und das Programm. ' +
            'Sonst wird zufällig verteilt, wer eine Frau ist. Der Name ist das Einzige, was sich ändert – so zeigt ein Lauf, ob die Mischung allein etwas bewirkt. ' +
            'Das <b>Pilotinnen-Profil</b> ist ein eigener Schalter: selbstbewusst, durchsetzungsstark, offen, ruhig unter Druck (Persönlichkeitsstudien der US Air Force mit Pilotinnen), ' +
            'dazu das Cockpit-Schema FOR-DEC: Fakten, Optionen, Risiken und Nutzen, Entscheidung, Ausführung, Kontrolle. ' +
            'Ein Klick auf eine Seite im Netz zeigt ihren ganzen Auftrag.</div>', '#f5c242');
        CyberUI.createCheckbox('pa-neutral', 'Neutral – ohne Namen und Geschlecht', state.neutral, on => {
            if (state.running) return;
            state.neutral = on;
            document.getElementById('pa-persons').hidden = on;
            afterLineupChange();
        });
        document.getElementById('pa-persons').hidden = state.neutral;
        CyberUI.createSlider('pa-women', 'Frauen am Tisch', 0, 7, state.women, 1, v => { if (state.running) return; setWomen(Math.round(v)); afterLineupChange(); }, 'var(--neon-blue)', v => Math.round(v) + ' von 7');
        CyberUI.createCheckbox('pa-nopilot', 'Pilotinnen-Profil rauslassen', state.noPilot, on => {
            if (state.running) return;
            state.noPilot = on;
            document.getElementById('pa-profile').hidden = on;
            afterLineupChange();
        });
        CyberUI.createRadioGroup('pa-profile', 'Pilotinnen-Profil für', [
            { label: 'die Frauen', value: 'female' },
            { label: 'alle', value: 'all' }], state.profile, v => { state.profile = v; afterLineupChange(); });
        document.getElementById('pa-profile').hidden = state.noPilot;
        document.getElementById('pa-mix').addEventListener('click', () => { if (state.running) return; shuffleWomen(); afterLineupChange(); });

        CyberUI.createCard('ui-container', 'Ansicht',
            '<div id="pa-time"></div><div id="pa-others"></div>' +
            '<div class="pa-legend"></div><div class="pa-legend-row"><span>0 uneinig</span><span>5</span><span>10 einig</span></div>' +
            '<div class="pa-info">Linien zwischen zwei Seiten: Farbe und Dicke = wie nah sie sich in dem Thema sind (Mittel aus beiden Richtungen). ' +
            'Wer sich einig ist, rückt zusammen. Speichen zur Mitte = Zustimmung zum Vorschlag; gestrichelt = die Prüfung hat korrigiert. ' +
            'Andere Themen: Migration gestrichelt, Paket gepunktet. Knoten lassen sich ziehen.</div>', '#f5c242');
        CyberUI.createSlider('pa-time', 'Zeitleiste', 0, 0, 0, 1, v => {
            const i = Math.round(v);
            state.view = i >= state.history.length - 1 ? -1 : i;
            linkSig = ''; draw(); showLive();
        }, 'var(--neon-blue)', v => state.history.length ? (Math.round(v) + 1) + '/' + state.history.length : '–');
        timeline = sliderOf('pa-time');
        CyberUI.createCheckbox('pa-others', 'Andere Themen mitzeigen', state.others, on => { state.others = on; draw(); });

        CyberUI.createCard('ui-container', 'Zugang',
            '<div class="pa-info" id="pa-pass-msg">Das Labor-Passwort (dasselbe wie bei Solita) – es wird auf diesem Gerät gemerkt.</div>' +
            '<form class="pa-pass cyber-control-group" id="pa-pass-form">' +
            '<input type="text" name="username" value="docalvers" autocomplete="username" hidden>' +
            '<input type="password" id="pa-pass-in" autocomplete="current-password" placeholder="Passwort" aria-label="Passwort – wird auf diesem Gerät gemerkt" spellcheck="false" autocapitalize="off">' +
            '<button type="submit" class="cyber-btn">OK</button></form>', '#f5c242');
        document.getElementById('pa-pass-form').addEventListener('submit', async ev => {
            ev.preventDefault();
            const pw = sauber(document.getElementById('pa-pass-in').value), msg = document.getElementById('pa-pass-msg');
            if (!pw) return;
            try {
                const r = await post({ ping: true }, pw);
                const j = await r.json().catch(() => ({}));
                if (r.ok) {
                    try { localStorage.setItem('dev_access', pw); } catch (e) { }
                    msg.textContent = 'Passwort gemerkt.';
                    showPassCard(false); status('Bereit');
                } else msg.textContent = j.reason === 'locked' ? 'Das Passwort ist richtig, aber gerade gesperrt.' : 'Passwort stimmt nicht (' + pw.length + ' Zeichen angekommen).';
            } catch (e) { msg.textContent = 'Kein Netz.'; dbg('ping failed: ' + e.message); }
        });
        showPassCard(!pass());

        CyberUI.createCard('ui-container', 'Protokoll', '<div class="pa-log" id="pa-log"></div>', '#f5c242');
    }
    function showPassCard(on) {
        const card = document.getElementById('pa-pass-form').closest('.instrument-card');
        card.hidden = !on;
    }
    function afterLineupChange() {
        if (state.run && !state.running) { state.run.female = Array.from(state.female); state.run.profile = profileNow(); state.run.neutral = state.neutral; }
        renderLineup(); draw(); save(); showLive();
    }
    function renderLineup() {
        document.getElementById('pa-lineup').innerHTML = ACTORS.map(a => '<li><span class="pa-sw" style="background:' + a.color + '"></span>' +
            esc(a.short) + (nameOf(a) ? ' · ' + esc(nameOf(a)) : '') + (pilotOf(a) ? '<span class="pa-pilot">PILOTIN</span>' : '') + '</li>').join('');
    }
    function syncButtons() {
        document.getElementById('pa-run').textContent = !state.running ? 'START' : state.paused ? 'WEITER' : 'PAUSE';
        document.getElementById('pa-stop').disabled = !state.running;
        const w = sliderOf('pa-women').input; if (w) w.disabled = state.running;
    }
    function syncTimeline() {
        if (!timeline) return;
        const n = state.history.length;
        timeline.input.max = Math.max(0, n - 1);
        if (state.view < 0) timeline.input.value = Math.max(0, n - 1);
        timeline.out.textContent = n ? (Number(timeline.input.value) + 1) + '/' + n : '–';
    }
    function showCost() { document.getElementById('pa-cost').innerHTML = 'Kosten: <b>' + geld(state.cost) + '</b> · ' + state.calls + ' Aufrufe'; }
    function clearLog() { document.getElementById('pa-log').innerHTML = ''; }
    function log(who, html) {
        const el = document.createElement('div');
        const a = who && who !== 'center' ? who : null;
        el.innerHTML = (a ? '<b style="color:' + a.color + '">' + esc(a.short) + '</b> ' : who === 'center' ? '<b style="color:' + ORANGE + '">Vorschlag</b> ' : '') + html;
        const box = document.getElementById('pa-log');
        box.appendChild(el);
        box.scrollTop = box.scrollHeight;
    }

    // ------------------------------------------------------------------------------- the last run survives a reload
    function save() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({ run: state.run, history: state.history, finals: state.finals,
                topic: state.topic, model: state.model, women: state.women, female: Array.from(state.female), profile: state.profile, noPilot: state.noPilot, neutral: state.neutral,
                calls: state.calls, cost: state.cost, statusText: state.statusText }));
        } catch (e) { dbg('save failed: ' + e.message); }
    }
    function restore() {
        let s = null;
        try { s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { s = null; }
        if (!s) return false;
        Object.assign(state, { run: s.run || null, history: s.history || [], finals: s.finals || {}, topic: s.topic || 'rente',
            model: s.model || 'sonnet', women: s.women == null ? 5 : s.women, female: new Set(s.female || []), profile: s.profile === 'all' ? 'all' : 'female', noPilot: !!s.noPilot, neutral: !!s.neutral,
            calls: s.calls || 0, cost: s.cost || 0, statusText: s.statusText || '' });
        return true;
    }

    // ------------------------------------------------------------------------------------------------------ start
    const had = restore();
    if (!had) shuffleWomen();
    const titleSlot = document.getElementById('coach-title-slot');
    if (titleSlot) titleSlot.textContent = 'Politik-Arena';
    buildPanel();
    renderLineup(); syncButtons(); syncTimeline(); showCost();
    if (state.run && state.run.positions) {
        log(null, 'Letzter Lauf geladen: <b>' + esc(TOPIC[state.run.topic].label) + '</b>' + (state.statusText ? ' – ' + esc(state.statusText) : ''));
    }
    layout();
    showLive();
    window.addEventListener('resize', layout);
    // the coach box folds (coach-box.js): the network takes the room it frees
    const coachBox = document.getElementById('math-coach-box');
    if (coachBox) new MutationObserver(() => setTimeout(layout, 50)).observe(coachBox, { attributes: true, attributeFilter: ['class'] });
    document.fonts.ready.then(layout);
    dbg('ready' + (had ? ' (last run restored)' : '') + ', password ' + (pass() ? 'present' : 'missing'));
})();
