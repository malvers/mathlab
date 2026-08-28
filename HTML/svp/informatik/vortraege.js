// Talk-topic list for Informatik 9. Ten topics shared by every class page (editable in
// place, stored ONCE so 9a and 9b always show the same titles), two name fields per topic
// stored PER class. Include with <script src="vortraege.js" data-klasse="a"></script>.
(function () {
    const script = document.currentScript;
    const KLASSE = (script && script.dataset.klasse) || 'a';
    const KEY_NAMES = 'svp-vortraege-namen:informatik9' + KLASSE;
    const KEY_TOPICS = 'svp-vortraege-themen:informatik9';

    // lb1 = Lernbereich 1 "Informationen und Daten", wb = Wahlbereich "Informatik und Automatisierung"
    const TOPICS = [
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
    ];
    const LB_LABEL = { lb1: ['LB 1', 'b-green'], wb: ['Wahlbereich', 'b-teal'] };

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
