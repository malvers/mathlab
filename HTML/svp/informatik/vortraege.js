// Talk-topic list for the SVP pages. Ten topics per plan, shared by every class page of that
// plan (editable in place, stored ONCE in localStorage so class A and B always show the same
// titles), two name fields per topic.
//
// The NAMES are personal data and are therefore no longer kept on the device: they live in
// Supabase (svp_vortrag_namen), sealed with Doc's public key by svp-crypto.js. Every browser can
// write a name and see WHETHER a slot is taken; reading a name back needs Doc's login plus his
// key passphrase. Include with
// <script src="vortraege.js" data-plan="fos11" data-klasse="a"></script>.
(function () {
    const script = document.currentScript;
    const KLASSE = (script && script.dataset.klasse) || 'a';
    const PLAN = (script && script.dataset.plan) || 'informatik9';
    const KEY_NAMES = 'svp-vortraege-namen:' + PLAN + KLASSE;
    const KEY_TOPICS = 'svp-vortraege-themen:' + PLAN;

    /* one entry per plan: ten talk topics + the badge label/colour of each Lernbereich */
    const PLANS = {
        /* Oberschule 9 — lb1 "Informationen und Daten", wb "Informatik und Automatisierung" */
        informatik9: {
            labels: { lb1: ['LB 1', 'b-green'], wb: ['Wahlbereich', 'b-teal'] },
            topics: [
                { lb: 'lb1', title: 'Big Data im Alltag', sub: 'Welche Daten erzeugt dein Smartphone an einem einzigen Tag — und wer verdient damit Geld?' },
                { lb: 'lb1', title: 'Empfehlungsalgorithmen', sub: 'Wie entscheiden TikTok, YouTube und Spotify, was du als Nächstes siehst oder hörst?' },
                { lb: 'lb1', title: 'Datenbanken im Alltag', sub: 'Wie verwaltet ein Online-Shop Millionen Artikel, Kunden und Bestellungen — Tabelle, Datensatz, Datenfeld am echten Beispiel.' },
                { lb: 'lb1', title: 'Cookies, Tracking und Browserverlauf', sub: 'Wer sammelt beim Surfen was — und wozu? Was zeigt der eigene Browser, wenn man nachschaut?' },
                { lb: 'lb1', title: 'Datenschutz und DSGVO', sub: 'Recht auf informationelle Selbstbestimmung: Was darf Schule, Verein oder Shop über dich speichern?' },
                { lb: 'lb1', title: 'Passwörter und Datensicherheit', sub: 'Wie kommen Angreifer an Daten (Phishing, Leaks, schwache Passwörter) — und wie schützt man sich?' },
                { lb: 'wb', title: 'Künstliche Intelligenz: Wie lernt ein Computer?', sub: 'Trainingsdaten, Muster, Fehler — erklärt an Teachable Machine oder ChatGPT.' },
                { lb: 'wb', title: 'Smart Home und Sprachassistenten', sub: 'Alexa, Siri & Co.: Bequemlichkeit oder Überwachung? Mikrofon, Cloud, Profile.' },
                { lb: 'wb', title: 'Bots, Fake-Accounts und Fake News', sub: 'Wie werden Meinungen im Netz beeinflusst — und woran erkennt man es?' },
                { lb: 'lb1', title: 'Industrie 4.0 und das Internet der Dinge', sub: 'Wenn Maschinen miteinander reden: Chancen und Risiken automatisierter Datenverarbeitung.' }
            ]
        },
        /* BGY 11 (Einführungsphase) — lb1 "Informatik als Wissenschaft", lb2 "Persönliches
           Informationsmanagement", lb3 "IT-Sicherheit und Ökologie", lb4 "Projekt
           Informationsmanagement", wb "Datenkomprimierung und Fehlererkennung" */
        inf11: {
            labels: { lb1: ['LB 1', 'b-orange'], lb2: ['LB 2', 'b-cyan'], lb3: ['LB 3', 'b-violet'], lb4: ['LB 4', 'b-teal'], wb: ['Wahlbereich', 'b-green'] },
            topics: [
                { lb: 'lb1', title: 'Meilensteine der Rechentechnik', sub: 'Von Schickard und Zuse bis zum Rechenzentrum: Welche Idee war jeweils der eigentliche Sprung?' },
                { lb: 'lb1', title: 'Informatik als Werkzeug anderer Wissenschaften', sub: 'Simulation, Bildgebung, Bioinformatik: Wo entscheidet der Rechner heute über eine Erkenntnis?' },
                { lb: 'lb2', title: 'Vom Signal zur Information', sub: 'Digitalisierung von Ton oder Bild an einem konkreten Beispiel: Abtastung, Quantisierung, Datenmenge.' },
                { lb: 'lb2', title: 'Quellenkritik im Netz', sub: 'Impressum, Autorschaft, Belege, Interessenlage — ein Kriterienraster an drei echten Webseiten vorgeführt.' },
                { lb: 'lb2', title: 'Urheberrecht und Lizenzen im Schulalltag', sub: 'Bilder, Musik, KI-Ergebnisse: Was darf in eine Präsentation, und was sagen Creative Commons dazu?' },
                { lb: 'lb3', title: 'Social Engineering', sub: 'Phishing, Pretexting, CEO-Fraud: Der Mensch als Sicherheitslücke — echte Fälle und die Gegenmaßnahmen.' },
                { lb: 'lb3', title: 'Angriffe auf kritische Infrastrukturen', sub: 'Ransomware in Klinik, Stadtwerk oder Verwaltung: Ablauf eines Vorfalls und was danach passieren muss.' },
                { lb: 'lb3', title: 'Klassische Chiffren und ihr Bruch', sub: 'Caesar und Vigenère selbst geknackt — und warum genau das bei heutiger Verschlüsselung nicht mehr geht.' },
                { lb: 'lb3', title: 'Der ökologische Fußabdruck der Digitalisierung', sub: 'Streaming, Rechenzentren, Geräteproduktion, E-Schrott — Zahlen statt Bauchgefühl.' },
                { lb: 'wb', title: 'Datenkomprimierung: wie Dateien schrumpfen', sub: 'Verlustfrei gegen verlustbehaftet, Huffman am eigenen Text — und woran man ein überkomprimiertes Bild erkennt.' }
            ]
        },
        /* FOS 11 — lb1 "Persönliches Informationsmanagement", lb2 "IT-Sicherheit und Ökologie",
           wb "Kryptografie in der Informatik" */
        fos11: {
            labels: { lb1: ['LB 1', 'b-orange'], lb2: ['LB 2', 'b-cyan'], wb: ['Wahlbereich', 'b-green'] },
            topics: [
                { lb: 'lb1', title: 'Recherchestrategien, die wirklich tragen', sub: 'Suchoperatoren, Fachdatenbanken, Bibliothekskataloge — wie kommt man an Quellen, die einer Prüfung standhalten?' },
                { lb: 'lb1', title: 'Quellenkritik: Wem kann man glauben?', sub: 'Impressum, Autorschaft, Belege, Interessenlage — ein Kriterienraster an drei echten Webseiten vorgeführt.' },
                { lb: 'lb1', title: 'Wissen ordnen statt sammeln', sub: 'Ordnerstruktur, Tags, Zettelkasten, Literaturverwaltung — wie strukturiert man Information für ein ganzes Schuljahr?' },
                { lb: 'lb1', title: 'Zusammenarbeit in der Cloud', sub: 'Gleichzeitig am selben Dokument: Versionen, Rechte, Konflikte — und was schiefgeht, wenn niemand die Regeln kennt.' },
                { lb: 'lb1', title: 'Gestaltungsregeln für Layout und Visualisierung', sub: 'Typografie, Kontrast, Weißraum, Diagrammwahl: dieselbe Aussage einmal gut und einmal schlecht dargestellt.' },
                { lb: 'lb1', title: 'Identität im Netz', sub: 'Profil, Inszenierung, digitaler Fußabdruck — was ein Personaler über dich findet, bevor du den Raum betrittst.' },
                { lb: 'lb2', title: 'Social Engineering', sub: 'Phishing, Pretexting, CEO-Fraud: Der Mensch als Sicherheitslücke — echte Fälle und die Gegenmaßnahmen.' },
                { lb: 'lb2', title: 'Angriffe auf kritische Infrastrukturen', sub: 'Ransomware in Klinik, Stadtwerk oder Verwaltung: Ablauf eines Vorfalls und was danach passieren muss.' },
                { lb: 'lb2', title: 'Der ökologische Fußabdruck der Digitalisierung', sub: 'Streaming, Rechenzentren, Geräteproduktion, E-Schrott — Zahlen statt Bauchgefühl.' },
                { lb: 'wb', title: 'Verschlüsselung: von Caesar bis Ende-zu-Ende', sub: 'Symmetrisch, asymmetrisch, Schlüsselaustausch — warum ein Messenger sicher sein kann und was das Schloss im Browser bedeutet.' }
            ]
        },
        /* FOS 12 — lb1 "Modellierung von Datenbanken", lb2 "Algorithmen und Programme",
           lb3 "Projekt Webtechnologie", wb "Objektorientierte Programmierung" */
        fos12: {
            labels: { lb1: ['LB 1', 'b-orange'], lb2: ['LB 2', 'b-cyan'], lb3: ['LB 3A', 'b-violet'], wb: ['Wahlbereich', 'b-green'] },
            topics: [
                { lb: 'lb1', title: 'Datenbanken hinter den Kulissen', sub: 'Was passiert bei einer Bestellung, einer Fahrkarte, einem Arzttermin? Datenbasis und DBMS an einem echten System.' },
                { lb: 'lb1', title: 'Redundanz, Konsistenz, Integrität', sub: 'Wie sich eine schlecht entworfene Tabelle selbst widerspricht — mit Beispiel und Reparatur durch Normalisierung.' },
                { lb: 'lb1', title: 'SQL: eine Frage an Millionen Datensätze', sub: 'SELECT, JOIN, GROUP BY live vorgeführt — wie aus Rohdaten eine Antwort wird.' },
                { lb: 'lb1', title: 'NoSQL und große Datenmengen', sub: 'Wenn Tabellen nicht mehr reichen: Dokument-, Graph- und Key-Value-Datenbanken im Vergleich zum relationalen Modell.' },
                { lb: 'lb2', title: 'Von der Idee zum Algorithmus', sub: 'Struktogramm, Programmablaufplan, GRAFCET: dasselbe Problem in drei Darstellungen — welche taugt wofür?' },
                { lb: 'lb2', title: 'Warum manche Programme ewig brauchen', sub: 'Lineare Suche gegen binäre Suche, Sortierverfahren im Rennen — Laufzeit zum Anfassen.' },
                { lb: 'lb2', title: 'Bugs, Tests und Fehlersuche', sub: 'Wie Profis Fehler finden: Debugger, Testfälle, Grenzwerte — und die teuersten Softwarefehler der Geschichte.' },
                { lb: 'wb', title: 'Objektorientierung an einem Beispiel', sub: 'Klasse, Objekt, Vererbung, Kapselung — an einem Modell aus der eigenen Fachrichtung entwickelt.' },
                { lb: 'lb3', title: 'Wie eine Webseite in den Browser kommt', sub: 'HTTP, Server, Client, Rendering: der Weg einer Anfrage in unter zehn Minuten.' },
                { lb: 'lb3', title: 'Sicherheit von Webanwendungen', sub: 'SQL-Injection, XSS, Passwort-Hashing, HTTPS — die typischen Lücken und wie man sie schließt.' }
            ]
        }
    };
    const PLAN_DEF = PLANS[PLAN] || PLANS.informatik9;
    const TOPICS = PLAN_DEF.topics;

    const LB_LABEL = PLAN_DEF.labels;

    const $ = (id) => document.getElementById(id);
    const loadJSON = (k) => { try { return JSON.parse(localStorage.getItem(k) || '{}') || {}; } catch (e) { return {}; } };
    const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    /* topics with the shared overrides applied (topics carry no personal data,
       so they stay in localStorage exactly as before) */
    function topics() {
        const o = loadJSON(KEY_TOPICS);
        return TOPICS.map((t, i) => ({
            lb: t.lb,
            title: o[i] && typeof o[i].title === 'string' ? o[i].title : t.title,
            sub: o[i] && typeof o[i].sub === 'string' ? o[i].sub : t.sub
        }));
    }

    /* ------------------------------------------------------------------
       Names — encrypted, in the cloud, never in plain text on any device.
       Table svp_vortrag_namen holds one row per (plan, klasse, topic, slot).
       Anybody may set a slot (the pupils sign up on their own phones), but
       only the "taken" flag is readable without a key: the name itself is
       sealed against Doc's public key (svp-crypto.js) and the database does
       not even hand the ciphertext to an anonymous reader.
       ------------------------------------------------------------------ */
    const TABLE = 'svp_vortrag_namen';
    const QS = 'plan=eq.' + encodeURIComponent(PLAN) + '&klasse=eq.' + encodeURIComponent(KLASSE);
    /* slot ids this browser wrote itself — so a pupil can still correct his own
       typo while somebody else's entry stays protected. Ids only, no names. */
    const MINE_KEY = 'svp-vortraege-mine:' + PLAN + KLASSE;

    const slots = TOPICS.map(() => [{ taken: false, enc: null, name: null }, { taken: false, enc: null, name: null }]);
    const mine = new Set(Object.keys(loadJSON(MINE_KEY)));
    const markMine = (i, j) => { mine.add(i + '-' + j); const o = {}; mine.forEach((k) => { o[k] = 1; }); saveJSON(MINE_KEY, o); };

    const A = () => window.svpAuth;
    const unlocked = () => !!(window.svpCrypto && svpCrypto.hasPrivate());

    function setStatus(text, bad) {
        const el = $('vt-status');
        if (!el) return;
        el.textContent = text || '';
        el.classList.toggle('bad', !!bad);
    }

    /* Read the slot table. Logged in the ciphertext comes along, anonymously it
       does not — PostgREST refuses the column, which is exactly the point. */
    async function fetchSlots() {
        const a = A();
        if (!a) return;
        let rows = null;
        if (a.hasSession()) {
            try {
                const res = await a.api(TABLE + '?' + QS + '&select=idx,slot,taken,name_enc');
                if (res.ok) rows = await res.json();
            } catch (e) { /* stale session: fall through to the anonymous read */ }
        }
        if (!rows) {
            const res = await fetch(a.DB_URL + '/rest/v1/' + TABLE + '?' + QS + '&select=idx,slot,taken', {
                headers: { apikey: a.DB_KEY, Authorization: 'Bearer ' + a.DB_KEY }
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            rows = await res.json();
        }
        slots.forEach((pair) => pair.forEach((s) => { s.taken = false; s.enc = null; s.name = null; }));
        rows.forEach((r) => {
            const s = slots[r.idx] && slots[r.idx][r.slot];
            if (!s) return;
            s.taken = !!r.taken;
            s.enc = r.name_enc || null;
        });
        await decryptAll();
    }

    async function decryptAll() {
        if (!unlocked()) { slots.forEach((p) => p.forEach((s) => { s.name = null; })); return; }
        for (const pair of slots) {
            for (const s of pair) {
                if (!s.enc) { s.name = null; continue; }
                try { s.name = await svpCrypto.open(s.enc); } catch (e) { s.name = '??'; }
            }
        }
    }

    /* Write one slot. An empty text clears it. Works logged out (that is how a
       pupil signs up); logged in it goes through the session for symmetry. */
    async function pushSlot(i, j, text) {
        const a = A();
        if (!a) throw new Error('Kein Cloud-Zugang');
        const enc = text ? await svpCrypto.seal(text) : null;
        const body = { taken: !!text, name_enc: enc, ts: new Date().toISOString() };
        const path = TABLE + '?' + QS + '&idx=eq.' + i + '&slot=eq.' + j;
        let res;
        if (a.hasSession()) {
            res = await a.api(path, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(body) });
        } else {
            res = await fetch(a.DB_URL + '/rest/v1/' + path, {
                method: 'PATCH',
                headers: {
                    apikey: a.DB_KEY, Authorization: 'Bearer ' + a.DB_KEY,
                    'Content-Type': 'application/json', Prefer: 'return=minimal'
                },
                body: JSON.stringify(body)
            });
        }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        slots[i][j].taken = !!text;
        slots[i][j].enc = enc;
        slots[i][j].name = text || null;
    }

    /* One-off migration: names that an earlier version left in this browser's
       localStorage are sealed, pushed up and then removed from the device. */
    async function migrateLocalNames() {
        const old = loadJSON(KEY_NAMES);
        const keys = Object.keys(old);
        if (!keys.length) return false;
        if (!window.svpCrypto || !(await svpCrypto.hasPublic())) return false;
        setStatus('Namen aus diesem Browser werden verschlüsselt übernommen …');
        for (const k of keys) {
            const i = parseInt(k, 10);
            const v = Array.isArray(old[k]) ? old[k] : [];
            for (let j = 0; j < 2; j++) {
                const name = (v[j] || '').trim();
                if (!name || !slots[i]) continue;
                try { await pushSlot(i, j, name); markMine(i, j); } catch (e) { setStatus('Übernahme fehlgeschlagen: ' + e.message, true); return false; }
            }
        }
        try { localStorage.removeItem(KEY_NAMES); } catch (e) { }
        setStatus('Namen übernommen und aus diesem Browser gelöscht.');
        return true;
    }

    let editing = false;

    /* A taken slot is read-only for everybody but Doc: without the key the page
       cannot show a name, and a writable field would only ever overwrite one.
       A slot THIS browser wrote stays clearable with a click, so a pupil can
       still fix his own typo without being able to touch anybody else's. */
    function editable(i, j) {
        return unlocked() || !slots[i][j].taken;
    }

    function isMine(i, j) {
        return mine.has(i + '-' + j);
    }

    function slotValue(i, j) {
        const s = slots[i][j];
        if (!s.taken) return '';
        if (unlocked()) return s.name != null ? s.name : '…';
        return isMine(i, j) ? 'eingetragen' : 'vergeben';
    }

    function render() {
        const list = $('list');
        list.innerHTML = topics().map((t, i) => {
            const lb = LB_LABEL[t.lb];
            const taken = slots[i][0].taken || slots[i][1].taken;
            const inp = (j) => {
                const ro = editable(i, j) ? '' : ' readonly';
                const ttl = editable(i, j) ? '' : (isMine(i, j)
                    ? ' title="Dein Eintrag — anklicken, um ihn zu löschen"'
                    : ' title="Dieser Platz ist vergeben"');
                return '<div class="vt-name n' + (j + 1) + '"><input type="text" id="name-' + i + '-' + j +
                    '" value="' + esc(slotValue(i, j)) + '" placeholder="Name ' + (j + 1) + '"' + ro + ttl +
                    ' autocomplete="off" spellcheck="false" aria-label="Name ' + (j + 1) + ' für Thema ' + (i + 1) + '"></div>';
            };
            return '<div class="vt-row' + (taken ? ' taken' : '') + '" id="row-' + i + '">' +
                '<div class="vt-nr">' + (i + 1) + '</div>' +
                '<div class="vt-topic">' +
                    '<div class="vt-title"><span class="vt-title-text">' + esc(t.title) + '</span>' +
                        '<span class="badge ' + lb[1] + '">' + lb[0] + '</span></div>' +
                    '<div class="vt-sub">' + esc(t.sub) + '</div>' +
                '</div>' + inp(0) + inp(1) +
                '</div>';
        }).join('');

        TOPICS.forEach((_, i) => {
            [0, 1].forEach((j) => {
                const el = $('name-' + i + '-' + j);
                el.classList.toggle('locked', !editable(i, j));
                if (!editable(i, j)) {
                    if (isMine(i, j)) { el.classList.add('mine'); el.addEventListener('click', () => clearMine(i, j)); }
                    return;
                }
                el.addEventListener('input', () => queueSave(i, j));
                el.addEventListener('blur', () => flushSave(i, j));
            });
        });
        /* Enter in a title ends the line instead of inserting a break */
        list.querySelectorAll('.vt-title-text').forEach((el) => {
            el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
        });
        setEditing(editing);
        updateCount();
        updateKeyBtn();
    }

    /* the pupil takes his own entry back: the slot goes free and editable again */
    async function clearMine(i, j) {
        try {
            setStatus('lösche …');
            await pushSlot(i, j, '');
            mine.delete(i + '-' + j);
            const o = {}; mine.forEach((k) => { o[k] = 1; }); saveJSON(MINE_KEY, o);
            render();
            setStatus('Eintrag gelöscht.');
            const el = $('name-' + i + '-' + j);
            if (el) el.focus();
        } catch (e) { setStatus('Löschen fehlgeschlagen: ' + e.message, true); }
    }

    /* typing is debounced, leaving the field saves at once */
    const timers = {};
    function queueSave(i, j) {
        clearTimeout(timers[i + '-' + j]);
        timers[i + '-' + j] = setTimeout(() => flushSave(i, j), 800);
    }

    /* commit everything still pending, e.g. before re-reading the list */
    async function flushAll() {
        const keys = Object.keys(timers);
        for (const k of keys) {
            const p = k.split('-');
            await flushSave(+p[0], +p[1]);
        }
    }

    async function flushSave(i, j) {
        clearTimeout(timers[i + '-' + j]);
        delete timers[i + '-' + j];
        const el = $('name-' + i + '-' + j);
        if (!el) return;
        const text = el.value.trim();
        if (text === (slots[i][j].name || '') && !!text === slots[i][j].taken) return;
        try {
            if (!window.svpCrypto || !(await svpCrypto.hasPublic())) {
                setStatus('Kein Schlüssel eingerichtet — der Name wurde NICHT gespeichert.', true);
                return;
            }
            setStatus('speichere …');
            await pushSlot(i, j, text);
            if (text) markMine(i, j);
            $('row-' + i).classList.toggle('taken', slots[i][0].taken || slots[i][1].taken);
            updateCount();
            setStatus('☁ gespeichert (verschlüsselt)');
        } catch (e) {
            setStatus('☁ NICHT gespeichert: ' + e.message, true);
        }
    }

    function updateCount() {
        const taken = slots.filter((p) => p[0].taken || p[1].taken).length;
        $('count').innerHTML = '<b>' + taken + '</b> von ' + TOPICS.length + ' Themen vergeben';
    }

    /* ---------- key button: only ever visible to a logged-in user ---------- */
    function keyBtn() {
        let b = $('btn-key');
        if (b) return b;
        const bar = document.querySelector('.vt-actions');
        if (!bar) return null;
        b = document.createElement('button');
        b.id = 'btn-key';
        b.className = 'action secondary';
        b.addEventListener('click', onKeyBtn);
        bar.insertBefore(b, bar.firstChild);
        return b;
    }

    let keyExists = false;
    function updateKeyBtn() {
        const b = keyBtn();
        if (!b) return;
        const logged = !!(A() && A().hasSession());
        b.hidden = !logged || !window.svpCrypto || !svpCrypto.available;
        if (b.hidden) return;
        if (!keyExists) { b.textContent = '🔑 Schlüssel einrichten'; b.title = 'Einmalig: Schlüsselpaar für die Vortragsnamen anlegen'; }
        else if (unlocked()) { b.textContent = '🔒 Namen verbergen'; b.title = 'Schlüssel wieder sperren'; }
        else { b.textContent = '🔓 Namen anzeigen'; b.title = 'Schlüssel-Passwort eingeben, um die Namen zu entschlüsseln'; }
    }

    async function onKeyBtn() {
        if (!keyExists) {
            svpCrypto.passDialog('create', async () => {
                keyExists = true;
                setStatus('Schlüssel erzeugt — Passwort gut aufheben, es gibt keinen Ersatz.');
                await refresh();
            });
            return;
        }
        if (unlocked()) { svpCrypto.lock(); await decryptAll(); render(); setStatus(''); return; }
        svpCrypto.passDialog('unlock', async () => { await refresh(); setStatus('Namen entschlüsselt.'); });
    }

    /* ---------- edit mode for the topics (shared between the class pages) ---------- */
    function setEditing(on) {
        editing = on;
        $('list').classList.toggle('editing', on);
        document.querySelectorAll('.vt-title-text, .vt-sub').forEach((el) => {
            el.contentEditable = on ? 'true' : 'false';
        });
        $('btn-edit').textContent = on ? '✔ Fertig' : '✎ Bearbeiten';
        $('btn-edit').classList.toggle('orange', on);
        $('btn-orig').hidden = !on;
    }

    function saveTopics() {
        const o = {};
        document.querySelectorAll('.vt-row').forEach((row, i) => {
            o[i] = {
                title: row.querySelector('.vt-title-text').textContent.trim(),
                sub: row.querySelector('.vt-sub').textContent.trim()
            };
        });
        saveJSON(KEY_TOPICS, o);
    }

    window.vtToggleEdit = function () {
        if (editing) { saveTopics(); setEditing(false); render(); }
        else setEditing(true);
    };

    /* topics back to the built-in list (names untouched) */
    window.vtOriginal = function () {
        try { localStorage.removeItem(KEY_TOPICS); } catch (e) { }
        editing = false;
        render();
    };

    window.vtToggleConfirm = function (open) {
        $('confirm').classList.toggle('open', open);
        $('btn-reset').hidden = open;
    };

    /* Names of THIS class — behind the SVP password (svp-gate.js) AND a login,
       so neither a pupil nor a classroom machine can wipe the list. Rows are
       only cleared, never deleted; the history table keeps every old value. */
    window.vtResetNames = function () {
        const wipe = async function () {
            window.vtToggleConfirm(false);
            const a = A();
            if (!a || !a.hasSession()) { setStatus('Zum Zurücksetzen bitte anmelden.', true); return; }
            try {
                setStatus('lösche …');
                const res = await a.api(TABLE + '?' + QS, {
                    method: 'PATCH',
                    headers: { Prefer: 'return=minimal' },
                    body: JSON.stringify({ taken: false, name_enc: null, ts: new Date().toISOString() })
                });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                try { localStorage.removeItem(MINE_KEY); } catch (e) { }
                mine.clear();
                await refresh();
                setStatus('Alle Namen dieser Klasse gelöscht.');
            } catch (e) { setStatus('Löschen fehlgeschlagen: ' + e.message, true); }
        };
        if (window.svpGate) svpGate.run(wipe); else wipe();
    };

    /* ---------- boot ---------- */
    function statusEl() {
        if ($('vt-status')) return;
        const bar = document.querySelector('.vt-bar');
        const count = $('count');
        if (!bar || !count) return;
        const el = document.createElement('div');
        el.id = 'vt-status';
        el.className = 'vt-status';
        count.parentNode.insertBefore(el, count.nextSibling);
    }

    async function refresh() {
        try { await fetchSlots(); } catch (e) { setStatus('☁ Liste nicht geladen: ' + e.message, true); }
        render();
    }

    (async function boot() {
        statusEl();
        render();                                   /* topics first, names follow */
        if (!window.svpCrypto || !svpCrypto.available) {
            setStatus('Verschlüsselung im Browser nicht verfügbar — Namen sind hier nicht bearbeitbar.', true);
            return;
        }
        await svpCrypto.ready;                      /* re-arm an unlocked key after a reload */
        try { keyExists = await svpCrypto.hasPublic(); } catch (e) { keyExists = false; }
        await refresh();
        if (await migrateLocalNames()) render();
        /* somebody else may have signed up meanwhile — but never discard a name
           that is still sitting unsaved in a field on this page */
        document.addEventListener('visibilitychange', async () => {
            if (document.hidden) return;
            await flushAll();
            refresh();
        });
    })();
})();
