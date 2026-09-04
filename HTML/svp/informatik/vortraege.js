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
    /* Lerngruppe: normalerweise aus dem Script-Tag (data-klasse="a"), bei Plaenen
       mit vielen Gruppen aber aus der URL (?g=FOS25-1). Der Stoff ist fuer alle
       Gruppen derselbe - nur die Namen haengen an der Gruppe, deshalb reicht EINE
       Seite mit Auswahl statt einer Datei je Gruppe (Doc, 01.09.2026). */
    const GROUPS_SRC = script && script.dataset.groups;   /* <plan>.untis.json */
    const slug = (s) => String(s).replace(/[^A-Za-z0-9-]+/g, '_');
    let urlG = '';
    try { urlG = new URLSearchParams(location.search).get('g') || ''; } catch (e) { }
    const KLASSE = urlG || (script && script.dataset.klasse) || 'a';
    const PLAN = (script && script.dataset.plan) || 'informatik9';
    const KEY_NAMES = 'svp-vortraege-namen:' + PLAN + KLASSE;
    const KEY_TOPICS = 'svp-vortraege-themen:' + PLAN;

    /* one entry per plan: ten talk topics + the badge label/colour of each Lernbereich */
    const PLANS = {
        /* Oberschule 9 — lb1 "Informationen und Daten", wb "Informatik und Automatisierung" */
        informatik9: {
            page: 'informatik9.html', back: 'Informatik 9',
            sub: 'Lernbereich 1 \u201eInformationen und Daten\u201c + Wahlbereich \u201eInformatik und Automatisierung\u201c',
            switchLabel: 'Klasse wechseln', artikel: 'der', vor: 'Klasse ',
            klassen: [['a', '9a'], ['b', '9b']],
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
            page: 'inf11.html', back: 'Informatik BGY 11',
            sub: 'Lernbereich 1 \u201eInformatik als Wissenschaft\u201c, Lernbereich 2 \u201ePers\u00f6nliches Informationsmanagement\u201c, Lernbereich 3 \u201eIT-Sicherheit und \u00d6kologie\u201c + Wahlbereich \u201eDatenkomprimierung\u201c',
            switchLabel: 'Kurs wechseln',
            klassen: [['a', 'BGY26-1'], ['b', 'BGY26-2']],
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
            page: 'fos11.html', back: 'Informatik FOS 11',
            sub: 'Lernbereich 1 \u201ePers\u00f6nliches Informationsmanagement\u201c, Lernbereich 2 \u201eIT-Sicherheit und \u00d6kologie\u201c + Wahlbereich \u201eKryptografie\u201c',
            switchLabel: 'Klasse wechseln',
            klassen: [['a', 'FOS26-1'], ['b', 'FOS26-2']],
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
            page: 'fos12.html', back: 'Informatik FOS 12',
            sub: 'Lernbereich 1 \u201eDatenbanken\u201c, Lernbereich 2 \u201eAlgorithmen und Programme\u201c, Lernbereich 3A \u201eWebtechnologie\u201c + Wahlbereich \u201eOOP\u201c',
            switchLabel: 'Klasse wechseln',
            klassen: [['a', 'FOS25-1'], ['b', 'FOS25-2']],
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

    /* The talks are a LIST, not a fixed ten: Doc arranges the order himself and
       duplicates a topic when two groups take the same subject (Doc,
       04.09.2026). The order is a pure display matter - every entry carries its
       own `id`, and that id IS the `idx` column in the database, so a card can
       move without dragging a pupil's entry along with it.
       Topics carry no personal data and therefore stay in localStorage, shared
       by both class pages, as before. Stored shape:
       { v: 2, list: [ { id, lb, title, sub } ] } - the older index-keyed
       override object is lifted into that shape the first time it is read. */
    function loadList() {
        const o = loadJSON(KEY_TOPICS);
        if (Array.isArray(o.list) && o.list.length) {
            const seen = new Set();
            const out = [];
            o.list.forEach((e) => {
                const id = +e.id;
                /* the same id twice would mean two cards sharing three places */
                if (!Number.isFinite(id) || id < 0 || seen.has(id)) return;
                seen.add(id);
                const b = TOPICS[id] || {};
                out.push({
                    id: id,
                    lb: e.lb || b.lb || Object.keys(LB_LABEL)[0],
                    title: typeof e.title === 'string' ? e.title : (b.title || ''),
                    sub: typeof e.sub === 'string' ? e.sub : (b.sub || '')
                });
            });
            if (out.length) return out;
        }
        return TOPICS.map((t, i) => ({
            id: i,
            lb: t.lb,
            title: o[i] && typeof o[i].title === 'string' ? o[i].title : t.title,
            sub: o[i] && typeof o[i].sub === 'string' ? o[i].sub : t.sub
        }));
    }

    /* the live list: render, the drag handle and the card menu all work on this
       one array; localStorage is only written when something is committed */
    let list = loadList();
    const topics = () => list;
    const posOf = (id) => list.findIndex((e) => e.id === id);

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

    /* Two names per topic are the rule; a third pupil can join a talk, so every
       topic has a third slot that stays hidden until it is needed (Doc, 01.09.2026). */
    const blank = () => ({ taken: false, enc: null, name: null });
    /* One triple per topic ID, not per position: after a duplicate the ids are
       no longer 0..9, and a card that is moved keeps its own three places. */
    const slotMap = {};
    const S = (id) => slotMap[id] || (slotMap[id] = [blank(), blank(), blank()]);
    list.forEach((e) => S(e.id));
    /* which ids the database really has rows for - a duplicated topic has none
       until they are created, see ensureRows() */
    const rowsIn = new Set();
    const expanded = new Set();   /* rows whose third field was opened by hand */
    const mine = new Set(Object.keys(loadJSON(MINE_KEY)));
    const markMine = (i, j) => { mine.add(i + '-' + j); const o = {}; mine.forEach((k) => { o[k] = 1; }); saveJSON(MINE_KEY, o); };

    /* The names this browser wrote itself, in MEMORY only - never on the device,
       that is the whole point of the sealed column. They are what lets a pupil
       keep typing in his own field instead of running into the "eingetragen"
       wall in the middle of a word, and they are gone on the next reload.
       (Doc, 04.09.2026: single letters in the list.) */
    const myNames = new Map();

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
        Object.keys(slotMap).forEach((k) => slotMap[k].forEach((s) => { s.taken = false; s.enc = null; s.name = null; }));
        rowsIn.clear();
        /* Eintragen heisst UPDATE - anonyme Browser duerfen keine Zeilen anlegen.
           Fehlen sie (neue Lerngruppe, noch nicht angelegt), ginge jeder Name
           still ins Leere. Also laut sagen statt schweigen. */
        if (!rows.length) {
            setStatus('Für diese Lerngruppe sind in der Datenbank noch keine Plätze angelegt — Namen können nicht gespeichert werden.', true);
            return;
        }
        rows.forEach((r) => {
            const s = S(r.idx)[r.slot];
            if (!s) return;
            rowsIn.add(r.idx);
            s.taken = !!r.taken;
            s.enc = r.name_enc || null;
        });
        await decryptAll();
        await ensureRows();
    }

    async function decryptAll() {
        if (!unlocked()) {
            Object.keys(slotMap).forEach((id) => slotMap[id].forEach((s, j) => {
                const k = id + '-' + j;
                if (!s.taken) myNames.delete(k);     /* freed: forget it */
                /* Without the key no name is readable - except our own, which
                   this session still remembers. */
                s.name = s.taken && myNames.has(k) ? myNames.get(k) : null;
            }));
            return;
        }
        for (const id of Object.keys(slotMap)) {
            for (const s of slotMap[id]) {
                if (!s.enc) { s.name = null; continue; }
                try { s.name = await svpCrypto.open(s.enc); } catch (e) { s.name = '??'; }
            }
        }
    }

    /* Write one slot. An empty text clears it. Works logged out (that is how a
       pupil signs up); logged in it goes through the session for symmetry. */
    /* Thrown when the slot was claimed by somebody else in the meantime. */
    function SlotTakenError() { this.name = 'SlotTaken'; this.message = 'Platz war schon vergeben'; }
    SlotTakenError.prototype = Object.create(Error.prototype);

    /* Thrown when a slot is older than the ten-minute grace period and the
       database therefore refuses to let an anonymous browser change it. */
    function GraceOverError() { this.name = 'GraceOver'; this.message = 'Aenderungsfrist abgelaufen'; }
    GraceOverError.prototype = Object.create(Error.prototype);

    async function pushSlot(i, j, text) {
        const a = A();
        if (!a) throw new Error('Kein Cloud-Zugang');
        const enc = text ? await svpCrypto.seal(text) : null;
        const body = { taken: !!text, name_enc: enc, ts: new Date().toISOString() };

        /* CLAIMING a free slot must never overwrite somebody who was a second
           faster. Two browsers that both loaded the page while the slot was free
           would otherwise both PATCH the row, and the later write wins - which is
           exactly how sign-ups got overwritten (Doc, 02.09.2026).
           `taken=is.false` moves the decision into the database: the update
           touches the row only while it is still free, so the loser changes
           nothing and gets told. Doc, logged in, keeps the unconditional path -
           he has to be able to correct things. */
        /* Anonymous writes always ask for the changed rows back. Not just to
           catch a lost race: since 02.09.2026 the database also refuses to touch
           a slot that has been taken for more than ten minutes, so a late
           CLEARING attempt changes nothing either - and without the returned
           rows the page would cheerfully report "gespeichert".
           Only idx/slot/taken are selected; name_enc is not readable without the
           key, and asking for it would fail the whole request. */
        const anon = !a.hasSession();
        /* ... but only when CLAIMING somebody else's ground. Without the
           isMine() exception the browser locked itself out: the debounce saves
           the first letter, the slot is taken, and every further save of the
           SAME field failed the guard and was reported as "somebody was faster"
           - which is why single letters ended up in the list (Doc, 04.09.2026).
           The exception hangs on myNames, not on the stored mine-flag: it holds
           only for a slot this browser wrote in THIS session, so a flag left
           over from a reset class can never wave an overwrite through. */
        const guard = !!text && anon && !myNames.has(i + '-' + j);
        let path = TABLE + '?' + QS + '&idx=eq.' + i + '&slot=eq.' + j;
        if (guard) path += '&taken=is.false';
        if (anon) path += '&select=idx,slot,taken';
        const prefer = anon ? 'return=representation' : 'return=minimal';

        let res;
        if (a.hasSession()) {
            res = await a.api(path, { method: 'PATCH', headers: { Prefer: prefer }, body: JSON.stringify(body) });
        } else {
            res = await fetch(a.DB_URL + '/rest/v1/' + path, {
                method: 'PATCH',
                headers: {
                    apikey: a.DB_KEY, Authorization: 'Bearer ' + a.DB_KEY,
                    'Content-Type': 'application/json', Prefer: prefer
                },
                body: JSON.stringify(body)
            });
        }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        if (anon) {
            const rows = await res.json().catch(() => []);
            if (!rows.length) {
                /* Which of the two refused it is decided by the filter we sent,
                   not by the text: with the guard the row was no longer free,
                   without it the row is ours and the database's ten-minute rule
                   turned it down. Deciding by `text` blamed a "faster
                   classmate" for every late correction (Doc, 04.09.2026). */
                if (guard) throw new SlotTakenError();
                throw new GraceOverError();
            }
        }
        S(i)[j].taken = !!text;
        S(i)[j].enc = enc;
        S(i)[j].name = text || null;
        if (text) myNames.set(i + '-' + j, text); else myNames.delete(i + '-' + j);
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
            for (let j = 0; j < 2; j++) {   /* the old local format never had a third name */
                const name = (v[j] || '').trim();
                if (!name || !TOPICS[i]) continue;
                /* somebody is sitting there now - an old local leftover must
                   never push a live entry out of the way */
                if (S(i)[j].taken) continue;
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
        const s = S(i)[j];
        if (!s.taken || myNames.has(i + '-' + j)) return true;
        /* Unlocked, but this name could not be read (session fell back to the
           anonymous read, or the blob would not open): the field shows "…" or
           "??" - a placeholder, and a placeholder must never become writable,
           or the next blur seals it over the real name. */
        return unlocked() && s.name != null && s.name !== '??';
    }

    function isMine(i, j) {
        return mine.has(i + '-' + j);
    }

    function slotValue(i, j) {
        const s = S(i)[j];
        if (!s.taken) return '';
        if (unlocked()) return s.name != null ? s.name : '…';
        const own = myNames.get(i + '-' + j);
        if (own != null) return own;            /* our own entry, still known */
        return isMine(i, j) ? 'eingetragen' : 'vergeben';
    }

    /* Everything typed but not yet saved has to survive a redraw. render()
       replaces the whole list, so without this a refresh in the wrong second
       swallows a half-typed name and the rest is typed into nothing - which is
       how fragments like "lene" reached the database (Doc, 04.09.2026). */
    function grabDrafts() {
        const act = document.activeElement;
        /* Clicking a toolbar button moves the focus off the field, so remember
           where the writing was: with an unsaved draft the caret goes back
           there, otherwise the pupil types the rest into the void. */
        const cur = act && act.id && act.id.indexOf('name-') === 0 ? act
            : (lastFocus && $(lastFocus)) || null;
        /* In edit mode the topic and its leitfrage exist ONLY in the DOM until
           "Fertig" is pressed - a redraw in between rebuilds them from the last
           saved version and the change is gone (Doc, 04.09.2026). readDom()
           lifts them into the list, so the next render writes them straight
           back out; only the caret has to be remembered by hand. */
        let editFocus = null;
        if (editing) {
            readDom();
            list.forEach((e) => {
                const row = $('row-' + e.id);
                if (!row) return;
                if (act === row.querySelector('.vt-title-text')) editFocus = { id: e.id, sel: '.vt-title-text' };
                if (act === row.querySelector('.vt-sub')) editFocus = { id: e.id, sel: '.vt-sub' };
            });
        }
        const vals = {};
        dirty.forEach((k) => {
            const el = $('name-' + k);
            if (el && !el.readOnly) vals[k] = el.value;
        });
        return {
            vals: vals,
            editFocus: editFocus,
            focus: cur ? cur.id : null,
            start: cur ? cur.selectionStart : 0,
            end: cur ? cur.selectionEnd : 0
        };
    }

    function putDrafts(d) {
        if (d.editFocus) {
            const row = $('row-' + d.editFocus.id);
            const el = row && row.querySelector(d.editFocus.sel);
            if (el) {
                el.focus();
                try {   /* caret to the end, so typing simply carries on */
                    const r = document.createRange();
                    r.selectNodeContents(el);
                    r.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(r);
                } catch (e) { }
            }
        }
        /* the caret only returns to a field that really has unsaved text */
        const keep = d.focus && d.vals[d.focus.slice(5)] !== undefined;
        Object.keys(d.vals).forEach((k) => {
            const el = $('name-' + k);
            /* never back into a field that has meanwhile become somebody
               else's - the draft is then genuinely obsolete */
            if (el && !el.readOnly) el.value = d.vals[k];
        });
        if (!keep) return;
        const el = $(d.focus);
        if (!el || el.readOnly) return;
        el.focus();
        try { el.setSelectionRange(d.start, d.end); } catch (e) { }
    }

    function render() {
        const box = $('list');
        const draft = grabDrafts();
        /* `i` is the topic's ID (its place in the database), `pos` its place on
           the screen - the two part company as soon as a card is moved. */
        box.innerHTML = list.map((t, pos) => {
            const i = t.id;
            const lb = LB_LABEL[t.lb] || LB_LABEL[Object.keys(LB_LABEL)[0]];
            const taken = rowTaken(i);
            const third = S(i)[2].taken || expanded.has(i);
            const inp = (j) => {
                const ro = editable(i, j) ? '' : ' readonly';
                const ttl = editable(i, j) ? '' : (unlocked()
                    ? ' title="Name nicht lesbar — Seite neu laden"'
                    : isMine(i, j)
                        ? ' title="Dein Eintrag — anklicken, um ihn zu löschen"'
                        : ' title="Dieser Platz ist vergeben"');
                return '<div class="vt-name n' + (j + 1) + '"><input type="text" id="name-' + i + '-' + j +
                    '" value="' + esc(slotValue(i, j)) + '" placeholder="Name ' + (j + 1) + '"' + ro + ttl +
                    ' autocomplete="off" spellcheck="false" aria-label="Name ' + (j + 1) + ' für Thema ' + (pos + 1) + '"></div>';
            };
            /* the toggle only ever ADDS a field; an occupied third slot cannot be
               folded away, otherwise a name would vanish from the page */
            const more = '<button type="button" class="vt-more" id="more-' + i + '"' +
                (S(i)[2].taken ? ' hidden' : '') +
                ' title="' + (third ? 'Drittes Namensfeld ausblenden' : 'Dritten Namen zulassen') + '"' +
                ' aria-label="Drittes Namensfeld für Thema ' + (pos + 1) + '">' + (third ? '−' : '+') + '</button>';
            return '<div class="vt-row' + (taken ? ' taken' : '') + (third ? ' three' : '') + '" id="row-' + i + '">' +
                /* Direct child of the card, not of .vt-nr: the badge is pinned to
                   the CARD's corner, and .vt-nr is itself positioned (it centres
                   the number), which would otherwise become its anchor. */
                '<span class="badge ' + lb[1] + '">' + lb[0] + '</span>' +
                '<div class="vt-nr"' + (editing ? ' title="Ziehen, um die Reihenfolge zu ändern"' : '') +
                    '><span class="vt-nr-num">' + (pos + 1) + '</span></div>' +
                '<div class="vt-topic">' +
                    '<div class="vt-title"><span class="vt-title-text">' + esc(t.title) + '</span></div>' +
                    '<div class="vt-sub">' + esc(t.sub) + '</div>' +
                    '<div class="vt-grades"><span class="vt-grade-lbl">Bewerten</span>' +
                        ROLES.map(function (r) {
                            const done = graded(i, r[0]);
                            const sent = !!(bewIn[i] && bewIn[i][r[0]]);
                            return '<button type="button" class="vt-grade' + (done ? ' done' : '') +
                                (sent ? ' full' : '') +
                                '" id="grade-' + r[0] + '-' + i + '" title="' +
                                (sent ? 'Bewertung ' + r[1] + ' ist abgegeben'
                                      : 'Bewertungsbogen ' + r[1] + ' für diesen Vortrag') +
                                '">' + r[1] + (sent ? ' ✓' : '') + '</button>';
                        }).join('') + '</div>' +
                '</div>' + inp(0) + inp(1) + (third ? inp(2) : '') + more +
                '</div>';
        }).join('');

        list.forEach((t, pos) => {
            const i = t.id;
            ROLES.forEach(function (r) {
                const gb = $('grade-' + r[0] + '-' + i);
                /* window.open has to run inside the click itself - awaiting the
                   save first would cost the user gesture and the popup blocker
                   would eat the tab. The handoff reads the names straight from
                   the fields, so it does not need the save to have finished;
                   flushAll only pushes them to the cloud and can run after. */
                if (gb) gb.addEventListener('click', function () {
                    openMatrix(i, pos, r[0], r[1]);
                    flushAll();
                });
            });
            const btn = $('more-' + i);
            if (btn) btn.addEventListener('click', async () => {
                /* folding the column away must not swallow a half-typed name */
                if (expanded.has(i)) { await flushSave(i, 2); expanded.delete(i); } else expanded.add(i);
                render();
                const el = $('name-' + i + '-2');
                if (el && !el.readOnly) el.focus();
            });
            [0, 1, 2].forEach((j) => {
                const el = $('name-' + i + '-' + j);
                if (!el) return;
                el.classList.toggle('locked', !editable(i, j));
                if (!editable(i, j)) {
                    if (isMine(i, j) && !unlocked()) { el.classList.add('mine'); el.addEventListener('click', () => clearMine(i, j)); }
                    return;
                }
                el.classList.toggle('unsaved', failed.has(i + '-' + j));
                el.addEventListener('focus', () => { lastFocus = el.id; });
                el.addEventListener('input', () => { dirty.add(i + '-' + j); queueSave(i, j); });
                el.addEventListener('blur', () => flushSave(i, j));
                /* Enter means "done" - otherwise the field keeps the name to
                   itself until the pupil happens to click somewhere else */
                el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
            });
            wireCard(t, pos);                     /* drag handle and right-click menu */
        });
        /* Enter in a title ends the line instead of inserting a break */
        box.querySelectorAll('.vt-title-text').forEach((el) => {
            el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
        });
        putDrafts(draft);
        sizeNrColumn();
        setEditing(editing);
        updateCount();
        updateAllBtn();
        updateKeyBtn();
    }

    /* The tallest topic block sets the height of all of them, so the cards line
       up without a gap above "Bewerten". Each .vt-row is its own grid, so this
       cannot come from CSS alone. (The badge no longer needs measuring - it
       sits in the card's corner, outside the flow.) */
    function sizeNrColumn() {
        const box = $('list');
        if (!box) return;
        box.style.removeProperty('--vt-topic-h');
        let h = 0;
        box.querySelectorAll('.vt-topic').forEach(function (t) {
            h = Math.max(h, t.getBoundingClientRect().height);
        });
        if (h) box.style.setProperty('--vt-topic-h', Math.ceil(h) + 'px');
    }

    /* Orbitron may still be loading at first paint, and a badge measured in the
       fallback font comes out too narrow. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeNrColumn);
    window.addEventListener('resize', sizeNrColumn);

    /* the pupil takes his own entry back: the slot goes free and editable again */
    async function clearMine(i, j) {
        try {
            setStatus('lösche …');
            await pushSlot(i, j, '');
            mine.delete(i + '-' + j);
            failed.delete(i + '-' + j);
            dirty.delete(i + '-' + j);
            const o = {}; mine.forEach((k) => { o[k] = 1; }); saveJSON(MINE_KEY, o);
            /* the third field was on screen because it was taken; keep it open,
               otherwise it vanishes under the hand that just cleared it */
            if (j === 2) expanded.add(i);
            render();
            setStatus('Eintrag gelöscht.');
            const el = $('name-' + i + '-' + j);
            if (el) el.focus();
        } catch (e) { setStatus('Löschen fehlgeschlagen: ' + e.message, true); }
    }

    /* Texts the database turned down for good (no key, grace period over). A
       redraw fires blur on the old input, which would save again - the same
       rejected text, forever. So it is tried once; one more keystroke, and it
       goes again. A plain network hiccup is NOT remembered here: that one is
       worth retrying on the next blur. */
    const lastTried = {};

    /* the name field the caret was in last - see grabDrafts() */
    let lastFocus = null;

    /* Fields a human has actually typed in since the last successful save.
       ONLY these are drafts and only these may be saved. Comparing "field
       differs from stored name" instead was a disaster: the first render runs
       before the names arrive, so every empty field counted as a draft "" and
       was written back over the freshly decrypted name - and a blur would then
       have pushed that "" into the database (Doc, 04.09.2026: "alle Namen weg"). */
    const dirty = new Set();

    /* typing is debounced, leaving the field saves at once */
    const timers = {};
    /* Slots whose last save failed - the field stays marked until it works, so
       an unsaved name never sits there looking finished. */
    const failed = new Set();
    /* Two saves of the same field must not overtake each other: the second
       PATCH could land first and the older text would win. */
    const chains = {};
    let saving = 0;
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
        const key = i + '-' + j;
        clearTimeout(timers[key]);
        delete timers[key];
        saving++;
        const run = (chains[key] || Promise.resolve()).then(() => doSave(i, j));
        chains[key] = run.catch(() => { });
        try { await run; } finally { saving--; }
    }

    async function doSave(i, j) {
        const el = $('name-' + i + '-' + j);
        if (!el) return;
        /* A locked slot does not show a name but the words "vergeben" or
           "eingetragen". Saving THAT would seal the placeholder over the real
           entry - which is what "- Dritter Name" did, because it flushes every
           row, readonly or not (Doc, 04.09.2026). */
        if (!editable(i, j)) return;
        if (!dirty.has(i + '-' + j)) return;       /* nobody typed here: nothing to save */
        const text = el.value.trim();
        if (text === (S(i)[j].name || '') && !!text === S(i)[j].taken) { dirty.delete(i + '-' + j); return; }
        if (lastTried[i + '-' + j] === text) return;   /* refused before, unchanged since */
        try {
            if (!window.svpCrypto || !(await svpCrypto.hasPublic())) {
                failed.add(i + '-' + j);
                lastTried[i + '-' + j] = text;
                el.classList.add('unsaved');
                setStatus('Kein Schlüssel eingerichtet — der Name wurde NICHT gespeichert.', true);
                return;
            }
            setStatus('speichere …');
            await pushSlot(i, j, text);
            if (text) markMine(i, j);
            $('row-' + i).classList.toggle('taken', rowTaken(i));
            updateCount();
            failed.delete(i + '-' + j);
            dirty.delete(i + '-' + j);
            delete lastTried[i + '-' + j];
            el.classList.remove('unsaved');
            setStatus('☁ gespeichert (verschlüsselt)');
        } catch (e) {
            if (e.name === 'GraceOver') {
                clearTimeout(timers[i + '-' + j]);
                delete timers[i + '-' + j];
                /* No refresh: the database did not change, and redrawing would
                   only fire blur on this very field and try the same rejected
                   text again. The text stays where it is, marked red, so it is
                   plain that it did NOT go anywhere. */
                failed.add(i + '-' + j);
                lastTried[i + '-' + j] = text;
                el.classList.add('unsaved');
                setStatus('Aendern ist nur in den ersten zehn Minuten moeglich — bitte Herrn Alvers ansprechen.', true);
                return;
            }
            if (e.name === 'SlotTaken') {
                /* Never write to the field here: assigning a value schedules the
                   NEXT save, and that one carries an empty text - which would
                   clear the winner's entry. Drop any pending save and let
                   refresh() redraw the field from the truth in the database. */
                clearTimeout(timers[i + '-' + j]);
                delete timers[i + '-' + j];
                /* the slot belongs to somebody else now, the draft is void */
                failed.delete(i + '-' + j);
                dirty.delete(i + '-' + j);
                setStatus('Dieser Platz wurde gerade von jemand anderem belegt — bitte einen freien waehlen.', true);
                await refresh();
                return;
            }
            failed.add(i + '-' + j);
            el.classList.add('unsaved');
            setStatus('☁ NICHT gespeichert: ' + e.message, true);
        }
    }

    const rowTaken = (i) => S(i).some((s) => s.taken);

    function updateCount() {
        const taken = list.filter((e) => rowTaken(e.id)).length;
        $('count').innerHTML = '<b>' + taken + '</b> von ' + list.length + ' Themen vergeben';
    }

    /* ---------- toolbar: third column for ALL topics at once ---------- */
    function allBtn() {
        let b = $('btn-all3');
        if (b) return b;
        const bar = document.querySelector('.vt-actions');
        if (!bar) return null;
        b = document.createElement('button');
        b.id = 'btn-all3';
        b.className = 'action secondary';
        b.addEventListener('click', toggleAllThird);
        bar.insertBefore(b, bar.firstChild);
        return b;
    }

    /* open on every topic, or fold every free one away again */
    async function toggleAllThird() {
        if (expanded.size >= list.length) {
            for (const e of list) await flushSave(e.id, 2);
            expanded.clear();
        } else {
            list.forEach((e) => expanded.add(e.id));
        }
        render();
    }

    function updateAllBtn() {
        const b = allBtn();
        if (!b) return;
        const on = expanded.size >= list.length;
        b.textContent = on ? '− Dritter Name' : '+ Dritter Name';
        b.title = on
            ? 'Das dritte Namensfeld überall wieder ausblenden (belegte bleiben)'
            : 'Bei allen Themen ein drittes Namensfeld einblenden';
        b.classList.toggle('orange', on);
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
            /* keyExists came from a lookup at page load; had that failed for a
               moment, this button would offer to CREATE a key - and a second
               key pair makes every name sealed so far unreadable for good. So
               ask again, right now, before the dialog even opens. */
            try { keyExists = await svpCrypto.hasPublic(); } catch (e) {
                setStatus('Schlüssel nicht prüfbar (' + e.message + ') — bitte neu laden.', true);
                return;
            }
            if (keyExists) { updateKeyBtn(); setStatus('Es gibt bereits einen Schlüssel.'); return; }
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
        /* the number block is the grab handle - and only while editing, so a
           pupil signing up cannot shuffle the talks */
        document.querySelectorAll('.vt-list .vt-nr').forEach((el) => { el.draggable = !!on; });
        if (!on) closeCardMenu();
        $('btn-edit').textContent = on ? '✔ Fertig' : '✎ Bearbeiten';
        $('btn-edit').classList.toggle('orange', on);
        $('btn-orig').hidden = !on;
    }

    /* whatever stands in the editable cells right now, lifted into the list */
    function readDom() {
        list.forEach((e) => {
            const row = $('row-' + e.id);
            if (!row) return;
            const ti = row.querySelector('.vt-title-text');
            const su = row.querySelector('.vt-sub');
            if (ti) e.title = ti.textContent.trim();
            if (su) e.sub = su.textContent.trim();
        });
    }

    function saveTopics() {
        readDom();
        saveJSON(KEY_TOPICS, {
            v: 2,
            list: list.map((e) => ({ id: e.id, lb: e.lb, title: e.title, sub: e.sub }))
        });
    }

    window.vtToggleEdit = function () {
        if (editing) { saveTopics(); setEditing(false); render(); }
        else setEditing(true);
    };

    /* topics back to the built-in list (names untouched) */
    window.vtOriginal = function () {
        try { localStorage.removeItem(KEY_TOPICS); } catch (e) { }
        /* back to the built-in ten, in their built-in order - the names stay
           where they are, they hang on the ids and those do not change */
        list = loadList();
        list.forEach((e) => S(e.id));
        editing = false;
        render();
    };

    /* ---------- order and copies (edit mode only) ----------------------
       Doc arranges the list himself: the number block is a grab handle, the
       right mouse button opens a small menu on the card. Nothing in here ever
       touches a name - every card carries its topic id, the names hang on that
       id in the database, so a card that moves takes its own entries with it
       and leaves everybody else's exactly where they are (Doc, 04.09.2026). */
    let dragId = null;

    /* drop the dragged card in front of (or behind) the card at `pos` */
    function dropCard(id, pos, after) {
        const from = posOf(id);
        if (from < 0) return;
        readDom();
        const card = list.splice(from, 1)[0];
        let to = pos + (after ? 1 : 0);
        if (from < to) to--;                      /* the gap closed behind us */
        to = Math.max(0, Math.min(list.length, to));
        list.splice(to, 0, card);
        if (to === from) return;                  /* dropped where it already was */
        saveTopics();
        render();
    }

    function stepCard(id, delta) {
        const from = posOf(id);
        const to = from + delta;
        if (from < 0 || to < 0 || to >= list.length) return;
        readDom();
        list.splice(to, 0, list.splice(from, 1)[0]);
        saveTopics();
        render();
    }

    /* A copy gets a NEW id and therefore three empty places of its own - the
       whole point is two groups on the same subject, not two cards fighting
       over one set of names. */
    function nextId() {
        const used = new Set(list.map((e) => e.id));
        let n = TOPICS.length;
        while (used.has(n)) n++;
        return n;
    }

    async function duplicateCard(id) {
        const from = posOf(id);
        if (from < 0) return;
        readDom();
        const src = list[from];
        const copy = { id: nextId(), lb: src.lb, title: src.title, sub: src.sub };
        list.splice(from + 1, 0, copy);
        S(copy.id);
        saveTopics();
        render();
        await ensureRows();
    }

    /* Only a copy can go again: a built-in topic stays in the list, and a topic
       somebody has signed up for is never quietly dropped. */
    function removable(id) { return id >= TOPICS.length && !rowTaken(id); }

    function removeCard(id) {
        const from = posOf(id);
        if (from < 0 || !removable(id)) return;
        readDom();
        list.splice(from, 1);
        expanded.delete(id);
        saveTopics();
        render();
    }

    /* A duplicated topic has no places in the database yet, and an anonymous
       browser may not create any - it is granted UPDATE, not INSERT, and that
       is exactly what keeps a pupil from inventing rows. So they are made here,
       by the only one who can: Doc, logged in. Without a session the topic sits
       on the page but cannot hold a name, and that is said out loud rather than
       swallowed. */
    let rowsWarned = false;
    async function ensureRows() {
        const a = A();
        if (!a || !rowsIn.size) return;           /* nothing read back yet */
        const missing = list.map((e) => e.id).filter((id) => !rowsIn.has(id));
        if (!missing.length) return;
        if (!a.hasSession()) {
            if (rowsWarned) return;               /* say it once, not every 20 s */
            rowsWarned = true;
            setStatus('Für neue Themen fehlen in der Datenbank noch die Plätze — bitte anmelden, dann werden sie angelegt.', true);
            return;
        }
        const body = [];
        missing.forEach((id) => { for (let j = 0; j < 3; j++) body.push({ plan: PLAN, klasse: KLASSE, idx: id, slot: j }); });
        try {
            const res = await a.api(TABLE, {
                method: 'POST',
                headers: { Prefer: 'return=minimal,resolution=ignore-duplicates' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            missing.forEach((id) => rowsIn.add(id));
            rowsWarned = false;
            setStatus(missing.length === 1
                ? 'Plätze für das neue Thema angelegt.'
                : 'Plätze für ' + missing.length + ' neue Themen angelegt.');
        } catch (e) { setStatus('Plätze konnten nicht angelegt werden: ' + e.message, true); }
    }

    /* ---------- one card: grab handle and right-click menu ---------- */
    function clearDropMarks() {
        document.querySelectorAll('.vt-row.drop-before, .vt-row.drop-after')
            .forEach((r) => r.classList.remove('drop-before', 'drop-after'));
    }

    function wireCard(t, pos) {
        const row = $('row-' + t.id);
        if (!row) return;
        row.addEventListener('contextmenu', (ev) => {
            if (!editing) return;                 /* outside edit mode the browser's own menu stays */
            /* a name field keeps its paste menu */
            if (ev.target.closest('.vt-name')) return;
            ev.preventDefault();
            openCardMenu(t.id, ev.clientX, ev.clientY);
        });
        const handle = row.querySelector('.vt-nr');
        if (!handle) return;
        handle.addEventListener('dragstart', (ev) => {
            if (!editing) { ev.preventDefault(); return; }
            dragId = t.id;
            row.classList.add('vt-drag');
            try {
                ev.dataTransfer.effectAllowed = 'move';
                /* Firefox starts no drag at all without a payload */
                ev.dataTransfer.setData('text/plain', String(t.id));
                ev.dataTransfer.setDragImage(row, 30, 20);
            } catch (e) { }
        });
        handle.addEventListener('dragend', () => {
            dragId = null;
            row.classList.remove('vt-drag');
            clearDropMarks();
        });
        row.addEventListener('dragover', (ev) => {
            if (dragId === null || dragId === t.id) return;
            ev.preventDefault();
            try { ev.dataTransfer.dropEffect = 'move'; } catch (e) { }
            const r = row.getBoundingClientRect();
            const after = ev.clientY > r.top + r.height / 2;
            clearDropMarks();
            row.classList.add(after ? 'drop-after' : 'drop-before');
        });
        row.addEventListener('dragleave', (ev) => {
            if (!row.contains(ev.relatedTarget)) row.classList.remove('drop-before', 'drop-after');
        });
        row.addEventListener('drop', (ev) => {
            if (dragId === null) return;
            ev.preventDefault();
            const after = row.classList.contains('drop-after');
            const id = dragId;
            dragId = null;
            clearDropMarks();
            dropCard(id, pos, after);
        });
    }

    /* Armed only while a menu is open, see openCardMenu() */
    let menuScroll = null;

    function closeCardMenu() {
        if (menuScroll) { window.removeEventListener('scroll', menuScroll, true); menuScroll = null; }
        const m = $('vt-menu');
        if (m) m.remove();
    }

    /* Same look as the export dropdown, only at the mouse instead of under a
       button. Move up/down is in here as well, so the order can also be set
       without dragging - on a trackpad that is often the quicker way. */
    function openCardMenu(id, x, y) {
        closeCardMenu();
        const pos = posOf(id);
        if (pos < 0) return;
        const menu = document.createElement('div');
        menu.id = 'vt-menu';
        menu.className = 'vt-menu';
        const item = (label, title, on, fn) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'action secondary';
            b.textContent = label;
            b.title = title;
            if (on) b.addEventListener('click', () => { closeCardMenu(); fn(); });
            else b.disabled = true;
            menu.appendChild(b);
        };
        item('⧉  Duplizieren', 'Eine Kopie darunter einfügen — mit eigenen, leeren Namensfeldern', true,
            () => duplicateCard(id));
        item('↑  Nach oben', 'Eine Position nach oben', pos > 0, () => stepCard(id, -1));
        item('↓  Nach unten', 'Eine Position nach unten', pos < list.length - 1, () => stepCard(id, 1));
        item('✕  Entfernen', removable(id)
            ? 'Diese Kopie wieder aus der Liste nehmen'
            : (id < TOPICS.length
                ? 'Nur selbst angelegte Kopien lassen sich entfernen'
                : 'Für dieses Thema ist schon ein Name eingetragen'),
            removable(id), () => removeCard(id));
        document.body.appendChild(menu);
        /* keep the whole menu on screen, whichever corner it was opened in */
        menu.style.left = Math.max(8, Math.min(x, window.innerWidth - menu.offsetWidth - 8)) + 'px';
        menu.style.top = Math.max(8, Math.min(y, window.innerHeight - menu.offsetHeight - 8)) + 'px';
        /* The menu hangs in the viewport, so a scroll would leave it standing
           over a different card - it closes instead. Armed one frame later on
           purpose: a right click on a card near the edge makes the browser
           scroll it into view first, and that scroll must not shut the menu
           before it was ever seen (caught by the test rig, 04.09.2026). */
        requestAnimationFrame(() => {
            if (!$('vt-menu')) return;
            menuScroll = closeCardMenu;
            window.addEventListener('scroll', menuScroll, true);
        });
    }

    document.addEventListener('click', (e) => {
        const m = $('vt-menu');
        if (m && !m.contains(e.target)) closeCardMenu();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCardMenu(); });

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
                myNames.clear();
                failed.clear();
                dirty.clear();
                expanded.clear();
                await refresh();
                setStatus('Alle Namen dieser Klasse gelöscht.');
            } catch (e) { setStatus('Löschen fehlgeschlagen: ' + e.message, true); }
        };
        if (window.svpGate) svpGate.run(wipe); else wipe();
    };

    /* Die Umschaltleiste aus den echten Lerngruppen des Plans: die .untis.json
       fuehrt je Stunde die Klasse, gekoppelte Gruppen als "FOG25-2,FOW25-2".
       Genau diese Zeichenkette ist der Schluessel in der Datenbank, damit die
       Namen einer Gruppe nicht bei einer anderen auftauchen. Ohne die Datei
       bleibt die Leiste, wie sie in der Seite steht. */
    async function buildSwitch() {
        if (!GROUPS_SRC) return;
        const box = document.querySelector('.vt-switch');
        if (!box) { setStatus('Umschaltleiste fehlt in der Seite (.vt-switch).', true); return; }
        /* Scheitert das hier, blieb frueher der Kopf der Seite stehen und zeigte
           eine FALSCHE Lerngruppe an, ohne ein Wort - der gefaehrlichste Fall
           ueberhaupt (Doc, 01.09.2026: "da steht aber immer FOS"). Jeder Ausweg
           sagt jetzt, was los ist. */
        let data = null, why = '';
        try {
            const res = await fetch(GROUPS_SRC, { cache: 'no-store' });
            if (res.ok) data = await res.json(); else why = 'HTTP ' + res.status;
        } catch (e) { why = e.message; }
        if (!data || !data.weeks) {
            setStatus('Lerngruppen nicht ladbar (' + GROUPS_SRC + (why ? ': ' + why : '') + ') — der Kopf zeigt vielleicht die falsche Klasse.', true);
            return;
        }
        const seen = new Set();
        for (const kw of Object.keys(data.weeks)) {
            for (const e of data.weeks[kw]) if (e.klasse) seen.add(e.klasse);
        }
        if (!seen.size) { setStatus('In ' + GROUPS_SRC + ' steht keine Lerngruppe.', true); return; }
        /* Schluessel statt Klartext: ein Komma ("FOG25-2,FOW25-2") ist in einem
           PostgREST-Filter ein Trennzeichen und wuerde die Abfrage zerlegen.
           Der Schluessel steht in URL und Datenbank, der Klartext nur im Kopf. */
        const groups = [...seen].sort().map(g => ({ key: slug(g), label: g.replace(/,/g, ' + ') }));
        const here = groups.find(g => g.key === KLASSE);
        if (here) groupLabel = here.label;
        /* Ohne ?g stuende die erste Gruppe im Kopf, gespeichert wuerde aber unter
           data-klasse - ein stiller Fehlgriff. Also gleich umlenken. */
        if (!here) { location.replace(location.pathname + '?g=' + encodeURIComponent(groups[0].key)); return; }

        /* Eine Pille je Gruppe wurde zu breit, sobald gekoppelte Klassen dabei
           sind ("FOG25-2 + FOW25-2"). Also dasselbe Dropdown wie auf der
           Planseite - gleiche Klassen, gleiches Verhalten (Doc, 01.09.2026). */
        box.textContent = '';
        const drop = document.createElement('div');
        drop.className = 'export-drop';
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'action export-toggle';
        toggle.title = 'Lerngruppe wechseln';
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = here.label + ' ▾';
        const menu = document.createElement('div');
        menu.className = 'export-menu';
        menu.hidden = true;
        for (const g of groups) {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'action export-item' + (g.key === KLASSE ? '' : ' secondary');
            item.textContent = g.label;
            item.addEventListener('click', () => {
                if (g.key === KLASSE) return;
                location.href = location.pathname + '?g=' + encodeURIComponent(g.key);
            });
            menu.appendChild(item);
        }
        drop.appendChild(toggle);
        drop.appendChild(menu);
        box.appendChild(drop);
        const open = (on) => {
            menu.hidden = !on;
            toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
            toggle.classList.toggle('on', !!on);
        };
        toggle.addEventListener('click', (e) => { e.stopPropagation(); open(menu.hidden); });
        menu.addEventListener('click', () => open(false));
        document.addEventListener('click', (e) => { if (!drop.contains(e.target)) open(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
        const h1 = document.querySelector('.title-group h1');
        if (h1) h1.textContent = h1.textContent.replace(/[^·]*$/, ' ' + here.label);
        document.title = 'Vortragsthemen Informatik ' + here.label + ' | SJ 2026/27';
        const confirmBox = document.getElementById('confirm');
        if (confirmBox && confirmBox.firstChild) {
            confirmBox.firstChild.textContent = 'Alle Namen von ' + here.label + ' löschen?';
        }
    }

    /* ---------- Bewertungsmatrix, one sheet PER TALK ----------
       Doc grades talk by talk, so a single shared sheet would have talk 2
       overwrite talk 1 (Doc, 04.09.2026: "der muss pro Vortrag sein"). Each
       row therefore carries its own id into bewertungsmatrix.html, which keys
       its filled-in values by exactly that id.

       Topic and names are handed over through storage, NOT in the URL: a query
       string reaches the web server's log, and the names of pupils have no
       business being there. The id itself is plan + Lerngruppe + row - a class
       code, the same kind that is already in "?g=" today.

       localStorage, not sessionStorage: the sheet opens in its own tab now
       (Doc, 04.09.2026), and whether a new tab inherits sessionStorage differs
       between browsers. The entry carries a timestamp and the matrix deletes it
       the moment it has read it, so a name never lingers. */
    const MATRIX = '../bewertungsmatrix.html';
    const HANDOFF = 'svp-bm-handoff';
    /* plain-text name of the current Lerngruppe, filled by buildSwitch */
    let groupLabel = KLASSE;

    /* Two sheets per talk: Doc's Coach sheet, and ONE Publikum sheet that
       three pupils fill in together (Doc, 04.09.2026). Both live in
       svp_vortrag_bewertung, one row per talk and role. */
    const ROLES = [['coach', 'Coach'], ['publikum', 'Publikum']];
    const TABLE_BEW = 'svp_vortrag_bewertung';
    /* which sheets are in, per talk: { 3: { coach: true, publikum: false } }.
       Read anonymously (the rows carry only ciphertext), so everybody sees at a
       glance whether a talk has been graded yet. */
    const bewIn = {};

    function talkId(i, role) { return PLAN + '-' + slug(KLASSE) + '-' + (i + 1) + '-' + role; }

    /* Does a filled sheet for this talk and role already exist on this device? */
    function graded(i, role) {
        try { return !!localStorage.getItem('svp-bewertungsmatrix:' + talkId(i, role)); } catch (e) { return false; }
    }

    /* The sheet lives in its own tab now, so the green "already graded" marks
       cannot wait for a re-render of this page. Browsers fire `storage` in
       every OTHER tab of the origin when localStorage changes - that is exactly
       the signal, and it costs nothing. Only the marks are touched, never the
       whole list: a re-render would throw away a half-typed name. */
    function refreshGradeMarks() {
        list.forEach(function (t) {
            const i = t.id;
            ROLES.forEach(function (r) {
                const gb = $('grade-' + r[0] + '-' + i);
                if (!gb) return;
                const done = graded(i, r[0]);
                gb.classList.toggle('done', done);
                gb.title = done
                    ? 'Bogen ' + r[1] + ' für diesen Vortrag (bereits ausgefüllt)'
                    : 'Bewertungsbogen ' + r[1] + ' für diesen Vortrag';
                const sent = !!(bewIn[i] && bewIn[i][r[0]]);
                gb.classList.toggle('full', sent);
                gb.textContent = r[1] + (sent ? ' ✓' : '');
                if (sent) gb.title = 'Bewertung ' + r[1] + ' ist abgegeben';
            });
        });
    }

    /* One anonymous read for the whole list: which sheets are already in. */
    async function loadBewState() {
        const a = A();
        if (!a) return;
        try {
            const qs = 'plan=eq.' + encodeURIComponent(PLAN) +
                '&klasse=eq.' + encodeURIComponent(KLASSE) + '&select=idx,rolle,taken';
            const res = await fetch(a.DB_URL + '/rest/v1/' + TABLE_BEW + '?' + qs, {
                headers: { apikey: a.DB_KEY, Authorization: 'Bearer ' + a.DB_KEY }
            });
            if (!res.ok) return;                      /* table missing: pills stay plain */
            for (const k in bewIn) delete bewIn[k];
            (await res.json()).forEach(function (r) {
                if (!r.taken) return;
                (bewIn[r.idx] = bewIn[r.idx] || {})[r.rolle] = true;
            });
            refreshGradeMarks();
        } catch (e) { /* offline: the pills simply stay plain */ }
    }

    window.addEventListener('storage', function (e) {
        if (!e.key) return;
        /* a sheet was filled in the other tab */
        if (e.key.indexOf('svp-bewertungsmatrix') === 0) refreshGradeMarks();
        /* ... and this key appears the moment a grading was actually SENT, so
           it is the cue to re-read how many of the three places are taken */
        if (e.key.indexOf('svp-bm-sent:') === 0) loadBewState();
    });

    /* Coming back to this tab catches what the storage event may have missed
       (another window, a cleared key) - and somebody else may have sent a
       grading in the meantime, so the counts are re-read too. */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) return;
        refreshGradeMarks();
        loadBewState();
    });

    function openMatrix(i, pos, role, roleLabel) {
        const t = list[pos] || {};
        /* A locked field shows "vergeben"/"eingetragen", not a name - that is a
           placeholder and has no business on a grading sheet. */
        const names = [0, 1, 2]
            .map(function (j) {
                const el = $('name-' + i + '-' + j);
                return el && editable(i, j) ? el.value.trim() : '';
            })
            .filter(function (v) { return v; });
        try {
            localStorage.setItem(HANDOFF, JSON.stringify({
                v: talkId(i, role),
                topic: t.title || '',
                names: names.join(', '),
                label: 'Vortrag ' + (pos + 1) + ' · ' + groupLabel + ' · ' + roleLabel,
                /* the three parts the database row is keyed by - the id string
                   cannot be split again, a Lerngruppe carries dashes itself */
                plan: PLAN, klasse: KLASSE, idx: i,
                ts: Date.now()
            }));
        } catch (e) { /* private mode: the sheet simply opens empty */ }
        const url = MATRIX + '?v=' + encodeURIComponent(talkId(i, role));
        /* Own tab, so the list of talks stays open next to the sheet. If the
           browser blocks the popup, go there in this tab rather than nowhere. */
        const win = window.open(url, '_blank');
        if (!win) location.href = url;
    }

    /* ---------- the page around the list -------------------------------
       Head, button bar and hint used to stand in each of the eight HTML files:
       82 lines apiece, 63 of them identical, so every change of wording meant
       eight edits (Doc, 04.09.2026). They are built from the plan entry now -
       a page carries nothing but its <head> and the script tag that says WHICH
       Lerngruppe it shows. A page that brings its own #list (the test rig) is
       left untouched. */
    const HINT = 'Klick auf <b>&#9998; Bearbeiten</b> macht Thema und Leitfrage editierbar &mdash; gespeichert wird beim Klick auf ' +
        '&bdquo;Fertig&ldquo;, lokal in diesem Browser (localStorage), und gilt f&uuml;r beide Klassen gemeinsam. ' +
        'Im Bearbeiten-Modus ist die <b>Nummer der Anfasser</b>: damit l&auml;sst sich die Reihenfolge ziehen. Die ' +
        '<b>rechte Maustaste</b> auf einer Karte dupliziert ein Thema, schiebt es eine Position h&ouml;her oder ' +
        'tiefer und nimmt eine Kopie wieder heraus. Eine Kopie bekommt <b>eigene, leere Namensfelder</b> &mdash; ' +
        'angemeldet, denn nur dann lassen sich die Pl&auml;tze daf&uuml;r anlegen. Umsortieren r&uuml;hrt keinen ' +
        'Namen an: die Namen h&auml;ngen am Thema, nicht an der Position. ' +
        'Die <b>Namen</b> liegen dagegen verschl&uuml;sselt in der Cloud: eintragen kann sie jeder, lesen kann sie ' +
        'nur Doc Alvers &mdash; angemeldet und mit dem Schl&uuml;ssel-Passwort. Ohne Schl&uuml;ssel zeigt die Liste ' +
        'nur, welche Themen schon vergeben sind. Macht ein Thema ausnahmsweise ein Trio, blendet das <b>+</b> ' +
        'am rechten Zeilenrand ein drittes Namensfeld ein &mdash; <b>+ Dritter Name</b> oben tut das f&uuml;r alle ' +
        'Themen auf einmal. Beim Drucken erscheinen die Namen nur im entsperrten Zustand.';

    /* What this page is called in prose. On a data-groups page the real name
       only arrives with the .untis.json - until then the key stands in, with
       the underscores of a coupled group read back as a plus, exactly as
       buildSwitch will spell it. */
    function klasseLabel() {
        const hit = (PLAN_DEF.klassen || []).find((k) => k[0] === KLASSE);
        return hit ? hit[1] : KLASSE.replace(/_/g, ' + ');
    }

    function buildPage() {
        if ($('list')) return;                    /* the rig brings its own markup */
        const label = klasseLabel();
        document.title = 'Vortragsthemen Informatik ' + label + ' | SJ 2026/27';
        /* Only the a/b pages get the two pills; where the Lerngruppen come from
           the timetable, buildSwitch fills this span with the dropdown. */
        const pills = GROUPS_SRC ? '' : (PLAN_DEF.klassen || []).map((k) =>
            '<a class="badge b-green' + (k[0] === KLASSE ? ' on' : '') + '" href="' +
            PLAN + k[0] + '-vortraege.html">' + esc(k[1]) + '</a>').join('');
        const head = document.createElement('header');
        head.className = 'page-head';
        head.innerHTML =
            '<a class="back-link" href="' + PLAN_DEF.page + '">&larr; Stoffverteilungsplan ' + esc(PLAN_DEF.back) + '</a>' +
            '<div class="head-row">' +
                '<div class="title-group">' +
                    '<h1>Vortragsthemen &middot; Informatik &middot; ' + esc((PLAN_DEF.vor || '') + label) + '</h1>' +
                    '<span class="vt-switch" aria-label="' +
                        esc(GROUPS_SRC ? 'Lerngruppe wechseln' : (PLAN_DEF.switchLabel || 'Klasse wechseln')) +
                        '">' + pills + '</span>' +
                '</div>' +
                '<div class="head-btns">' +
                    '<button class="action secondary" id="btn-back" title="Zur&uuml;ck zum Stoffverteilungsplan">&larr; Zur&uuml;ck</button>' +
                    '<button class="action orange" id="btn-print">Drucken</button>' +
                '</div>' +
            '</div>' +
            '<div class="subtitle">' + PLAN_DEF.sub + ' &middot; zwei Namen pro Thema (dritter per + zuschaltbar)</div>';

        const bar = document.createElement('div');
        bar.className = 'vt-bar';
        /* #confirm keeps a TEXT node as its first child - buildSwitch rewrites
           exactly that when the Lerngruppe turns out to be called differently */
        bar.innerHTML =
            '<div class="vt-count" id="count"></div>' +
            '<div class="vt-actions">' +
                '<button class="action secondary" id="btn-orig" hidden ' +
                    'title="Themen auf die eingebaute Liste zur&uuml;cksetzen (Namen bleiben)">Themen: Original</button>' +
                '<button class="action" id="btn-edit">&#9998; Bearbeiten</button>' +
                '<div class="vt-confirm" id="confirm">Alle Namen ' + (PLAN_DEF.artikel || 'von') + ' ' + esc(label) + ' l&ouml;schen? ' +
                    '<button class="action" id="btn-wipe-yes">Ja</button>' +
                    '<button class="action secondary" id="btn-wipe-no">Nein</button>' +
                '</div>' +
                '<button class="action secondary" id="btn-reset">Namen zur&uuml;cksetzen</button>' +
            '</div>';

        const box = document.createElement('div');
        box.className = 'vt-list';
        box.id = 'list';

        const hint = document.createElement('div');
        hint.className = 'vt-hint';
        hint.innerHTML = HINT;

        const frag = document.createDocumentFragment();
        [head, bar, box, hint].forEach((el) => frag.appendChild(el));
        document.body.insertBefore(frag, document.body.firstChild);

        const go = (id, fn) => { const b = $(id); if (b) b.addEventListener('click', fn); };
        go('btn-back', () => { location.href = PLAN_DEF.page; });
        go('btn-print', () => window.print());
        go('btn-edit', () => window.vtToggleEdit());
        go('btn-orig', () => window.vtOriginal());
        go('btn-reset', () => window.vtToggleConfirm(true));
        go('btn-wipe-yes', () => window.vtResetNames());
        go('btn-wipe-no', () => window.vtToggleConfirm(false));
    }

    buildPage();

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
        /* A write still on its way must land first. Otherwise the read comes
           back with the slot still free, the page forgets that the name was
           its own, and the next save is treated as a claim of a taken slot -
           "jemand anderem belegt" for one's own name (audit, 04.09.2026). */
        await Promise.all(Object.keys(chains).map((k) => chains[k]));
        try { await fetchSlots(); } catch (e) { setStatus('☁ Liste nicht geladen: ' + e.message, true); }
        /* Only the 20 s poll used to respect the open edit mode; coming back to
           the tab redrew regardless and swallowed the change that had not been
           confirmed with "Fertig" yet (Doc, 04.09.2026). The fresh slot data is
           in `slots` either way - the next render shows it. */
        if (editing) return;
        render();
    }

    (async function boot() {
        statusEl();
        loadBewState();
        await buildSwitch();
        render();                                   /* topics first, names follow */
        if (!window.svpCrypto || !svpCrypto.available) {
            setStatus('Verschlüsselung im Browser nicht verfügbar — Namen sind hier nicht bearbeitbar.', true);
            return;
        }
        await svpCrypto.ready;                      /* re-arm an unlocked key after a reload */
        try { keyExists = await svpCrypto.hasPublic(); } catch (e) { keyExists = false; }
        await refresh();
        if (await migrateLocalNames()) render();
        /* Somebody else may have signed up meanwhile — but never discard a name
           that is still sitting unsaved in a field on this page. And leaving is
           where a phone loses a half-typed one: the tab is frozen long before
           the 800 ms debounce fires, so save on the way OUT too, not only on
           the way back (Doc, 04.09.2026). */
        document.addEventListener('visibilitychange', async () => {
            await flushAll();
            if (!document.hidden) refresh();
        });
        /* pagehide cannot be awaited, but starting the save still beats losing
           it - iOS fires this and nothing else when the tab goes away */
        window.addEventListener('pagehide', () => { flushAll(); });

        /* A whole class signs up at the same minute, all sitting on the page.
           Without polling a slot taken elsewhere stays writable here until the
           tab is switched - so the field is only closed AFTER the overwrite was
           attempted. Every 20 s is enough for that, and it never runs while
           somebody is typing or a save is still pending. */
        window.setInterval(function () {
            if (document.hidden) return;
            if (editing) return;
            if (Object.keys(timers).length) return;
            if (saving) return;                   /* a write is still on its way */
            const act = document.activeElement;
            if (act && act.tagName === 'INPUT' && act.id.indexOf('name-') === 0) return;
            refresh();
        }, 20000);
    })();
})();
