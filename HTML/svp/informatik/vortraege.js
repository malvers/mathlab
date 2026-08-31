// Talk-topic list for the SVP pages. Ten topics per plan, shared by every class page of that
// plan (editable in place, stored ONCE so class A and B always show the same titles), two name
// fields per topic stored PER class. Include with
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

    /* topics with the shared overrides applied */
    function topics() {
        const o = loadJSON(KEY_TOPICS);
        return TOPICS.map((t, i) => ({
            lb: t.lb,
            title: o[i] && typeof o[i].title === 'string' ? o[i].title : t.title,
            sub: o[i] && typeof o[i].sub === 'string' ? o[i].sub : t.sub
        }));
    }

    function namesOf(all, i) {
        const v = all[i];
        return Array.isArray(v) ? [v[0] || '', v[1] || ''] : ['', ''];
    }

    let editing = false;

    function render() {
        const list = $('list');
        const names = loadJSON(KEY_NAMES);
        list.innerHTML = topics().map((t, i) => {
            const n = namesOf(names, i);
            const taken = n[0].trim() || n[1].trim();
            const lb = LB_LABEL[t.lb];
            return '<div class="vt-row' + (taken ? ' taken' : '') + '" id="row-' + i + '">' +
                '<div class="vt-nr">' + (i + 1) + '</div>' +
                '<div class="vt-topic">' +
                    '<div class="vt-title"><span class="vt-title-text">' + esc(t.title) + '</span>' +
                        '<span class="badge ' + lb[1] + '">' + lb[0] + '</span></div>' +
                    '<div class="vt-sub">' + esc(t.sub) + '</div>' +
                '</div>' +
                '<div class="vt-name n1"><input type="text" id="name-' + i + '-0" value="' + esc(n[0]) + '" placeholder="Name 1" ' +
                    'autocomplete="off" spellcheck="false" aria-label="Name 1 für Thema ' + (i + 1) + '"></div>' +
                '<div class="vt-name n2"><input type="text" id="name-' + i + '-1" value="' + esc(n[1]) + '" placeholder="Name 2" ' +
                    'autocomplete="off" spellcheck="false" aria-label="Name 2 für Thema ' + (i + 1) + '"></div>' +
                '</div>';
        }).join('');

        TOPICS.forEach((_, i) => {
            [0, 1].forEach((j) => {
                $('name-' + i + '-' + j).addEventListener('input', () => {
                    const all = loadJSON(KEY_NAMES);
                    const n = namesOf(all, i);
                    n[j] = $('name-' + i + '-' + j).value;
                    all[i] = n;
                    saveJSON(KEY_NAMES, all);
                    $('row-' + i).classList.toggle('taken', !!(n[0].trim() || n[1].trim()));
                    updateCount();
                });
            });
        });
        /* Enter in a title ends the line instead of inserting a break */
        list.querySelectorAll('.vt-title-text').forEach((el) => {
            el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
        });
        setEditing(editing);
        updateCount();
    }

    function updateCount() {
        const names = loadJSON(KEY_NAMES);
        const taken = TOPICS.filter((_, i) => { const n = namesOf(names, i); return n[0].trim() || n[1].trim(); }).length;
        $('count').innerHTML = '<b>' + taken + '</b> von ' + TOPICS.length + ' Themen vergeben';
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

    /* names of THIS class page only — behind the SVP password (svp-gate.js),
       so a pupil cannot wipe the list from the classroom machine */
    window.vtResetNames = function () {
        const wipe = function () {
            saveJSON(KEY_NAMES, {});
            window.vtToggleConfirm(false);
            render();
        };
        if (window.svpGate) svpGate.run(wipe); else wipe();
    };

    render();
})();
