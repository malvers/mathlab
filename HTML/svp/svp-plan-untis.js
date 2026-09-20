// Stoffverteilungsplan renderer, part "untis": WebUntis: chips, dates, the class book dialog.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        paintTerminDates, markPastWeeks
    });

    /* WebUntis-Status unter der Bereich-Pille.
       WebUntis hat kein CORS, der Browser kommt also nie selbst dran. Die
       Daten schreibt tools/webuntis.js status nach Supabase (svp_untis, nur Doc
       liest) - ein Eintrag je Kalenderwoche, ein Punkt je Stunde. Fehlt die
       Zeile (jede Seite ohne Kurs-Zuordnung), bleibt alles wie vorher. */
    function untisTitle(entries, generated) {
        const lines = entries.map(e => {
            const d = String(e.date);
            const day = d.slice(6, 8) + '.' + d.slice(4, 6) + '.';
            return (e.klasse || '') + ' ' + day + ' ' + e.start + ' — ' +
                (e.code === 'cancelled' ? 'entfällt'
                    : e.written ? 'eingetragen: ' + e.text : 'noch nichts im Klassenbuch');
        });
        /* Die Zahl zuerst: bei fuenf Lerngruppen sagt "2 von 10" mehr als zehn Zeilen, und der
           Chip selbst kann nur drei Zustaende zeigen (Doc, 06.09.2026 - eine Zeile leuchtete
           orange, obwohl drei Gruppen leer waren). */
        const due = entries.filter(e => e.code !== 'cancelled');
        const done = due.filter(e => e.written).length;
        lines.unshift(done + ' von ' + due.length + ' Stunden eingetragen');
        if (generated) {
            const g = new Date(generated);
            lines.push('Stand ' + g.toLocaleDateString('de-DE') + ' ' +
                g.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) +
                ' — im Bearbeiten-Modus klicken: Stundeninhalt eintragen');
        }
        return lines.join('\n');
    }

    /* Der Chip-Zustand aus den Eintraegen einer Zeile. Ausgefallene Stunden zaehlen nicht mit -
       sie sind nicht "offen", sie fanden nicht statt. Voll wird der Chip nur, wenn WIRKLICH
       jede faellige Stunde steht; vorher war "1 von 10" optisch dasselbe wie "10 von 10". */
    function untisChipClass(entries) {
        const due = entries.filter(e => e.code !== 'cancelled');
        if (!due.length) return 'is-none';
        const done = due.filter(e => e.written).length;
        return done === due.length ? 'is-full' : done ? 'is-part' : 'is-none';
    }

    /* Untis-Logo statt des Kuerzels "WU", seit 16.09.2026 nur noch das U: der
       Strahlenkranz hat den Chip dreimal so breit gemacht, wie er sein muss
       (Doc: "mach den Untis butt nur U (schmaler)"). Die Buchstaben-Geometrie
       ist unveraendert am Original abgemessen; der Rahmen sitzt jetzt eng um
       das U, oben und unten bleibt der flache Beschnitt des Logos. */
    function untisMark() {
        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'u-mark');
        /* Der Ausschnitt sitzt eng um das U - flacher wird das Zeichen nur
           durch Beschneiden oben/unten, nie durch Stauchen. Hoehe und Lage des
           Buchstabens sind dieselben wie mit Strahlen (y unveraendert), nur die
           Breite ist auf den Buchstaben plus etwas Luft zusammengezogen: das U
           bleibt dadurch exakt gleich gross, der Chip wird schmal. */
        svg.setAttribute('viewBox', '65.2 0.2 91.2 113.6');
        svg.setAttribute('aria-hidden', 'true');
        function path(cls, d) {
            const el = document.createElementNS(NS, 'path');
            el.setAttribute('class', cls);
            el.setAttribute('d', d);
            svg.appendChild(el);
        }
        path('u-letter', 'M85 15.5V64a25.5 25.5 0 0 0 51 0V15.5');
        return svg;
    }

    /* ---- WebUntis schreiben -----------------------------------------------
       Bis 29.08.2026 hat der Chip WebUntis nur geoeffnet und Doc hat den
       Stundeninhalt von Hand hinuebergetippt. Jetzt traegt der Klick ihn direkt
       ein. Der Browser kommt an WebUntis nie selbst heran - kein CORS, und der
       Untis-App-Schluessel darf nicht in eine oeffentliche Seite (Regel 18).
       Dazwischen steht die Edge Function 'webuntis', die serverseitig genau das
       tut, was tools/webuntis.js lokal tut. */
    async function untisCall(body) {
        if (!window.svpAuth || !svpAuth.hasSession()) throw new Error('Nicht angemeldet — bitte neu einloggen.');
        await svpAuth.ensureFreshToken();
        const res = await fetch(svpAuth.DB_URL + '/functions/v1/webuntis', {
            method: 'POST',
            headers: {
                apikey: svpAuth.DB_KEY,
                Authorization: 'Bearer ' + svpAuth.session.access_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { const e = new Error(data.error || ('HTTP ' + res.status)); e.data = data; throw e; }
        return data;
    }

    const WDAY = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    function untisDay(ymd) {
        const d = new Date(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8));
        return WDAY[d.getDay()] + ' ' + ymd.slice(6, 8) + '.' + ymd.slice(4, 6) + '.';
    }

    /* ---- Termin-Modus: Blockunterricht statt Wochenrhythmus ---------------
       Die FOS-Gruppen haben keinen Wochenrhythmus. Sie kommen 14-taegig mit
       VIER Stunden am Stueck, und jede Gruppe in ihrer eigenen Woche: FOG25-1,
       FOS25-2 und FOW25-1 in den geraden KW, FOS25-1 und FOG25-2+FOW25-2 in den
       ungeraden. Eine Planzeile an die KALENDERWOCHE zu binden gaebe deshalb den
       einen Gruppen nur die geraden und den anderen nur die ungeraden Zeilen -
       jede Gruppe bekaeme die Haelfte des Stoffes (gemessen 01.09.2026).
       Im Termin-Modus zaehlt darum nicht der Kalender, sondern der wievielte
       Termin es fuer DIESE Gruppe ist. Ein Termin = zwei Planzeilen zu je
       2 Ustd.: die erste Doppelstunde traegt die eine, die zweite die andere
       (Doc, 01.09.2026). Feiertage verschieben damit nur die betroffene Gruppe.
       Eingeschaltet mit window.UNTIS_TERMIN = true auf der Planseite. */
    const TERMIN_MODE = !!window.UNTIS_TERMIN;

    /* je Klasse die geordnete Terminliste, je Termin die Stunden des Tages */
    function untisTermine(data) {
        const byClass = new Map();
        for (const kw of Object.keys((data && data.weeks) || {})) {
            for (const e of data.weeks[kw]) {
                /* Ein Feiertag loescht den Termin in WebUntis ganz, er taucht hier
                   also gar nicht erst auf - die Zaehlung rutscht von allein und nur
                   fuer die betroffene Gruppe. Ein AUSFALL steht dagegen weiter da,
                   nur mit code "cancelled": auch der ist kein Termin, sonst bekaeme
                   die Gruppe den Stoff dieses Tages nie (Doc, 16.09.2026). */
                if (e.code === 'cancelled') continue;
                const k = e.klasse || '';
                if (!byClass.has(k)) byClass.set(k, new Map());
                const days = byClass.get(k);
                if (!days.has(e.date)) days.set(e.date, []);
                days.get(e.date).push(e);
            }
        }
        const out = new Map();
        for (const [k, days] of byClass) {
            out.set(k, [...days.keys()].sort().map(d =>
                days.get(d).slice().sort((a, b) => String(a.start).localeCompare(String(b.start)))));
        }
        return out;
    }

    /* Planzeile -> welcher Termin, welche Haelfte. Ferienzeilen zaehlen nicht. */
    function untisSlotOf(i) {
        let n = 0;
        for (let k = 0; k < i && k < P.planRows.length; k++) if (!P.planRows[k].ferien) n++;
        return { block: Math.floor(n / 2), half: n % 2 };
    }

    /* Die Stunden EINER Planzeile: je Klasse ihr Termin Nr. block, davon die
       erste oder zweite Doppelstunde. Hat ein Tag weniger als vier Stunden
       (Ausfall), bekommt die erste Haelfte alles und die zweite nichts - lieber
       kein Vorschlag als ein falscher. */
    function untisEntriesFor(termine, i) {
        const s = untisSlotOf(i);
        const out = [];
        for (const list of termine.values()) {
            const day = list[s.block];
            if (!day) continue;
            const half = day.length >= 4
                ? (s.half ? day.slice(2) : day.slice(0, 2))
                : (s.half ? [] : day);
            out.push(...half);
        }
        return out;
    }

    /* Dialog fuer eine Kalenderwoche: Text links, die Stunden dieser Woche
       rechts. Der Stand kommt LIVE aus WebUntis, nicht aus svp_untis -
       die ist nur der Aufhaenger (Datumsbereich + Klassen der Seite) und kann
       Tage alt sein. */
    /* Dialog fuer eine Kalenderwoche: eine Editbox und "Send now". Mehr soll
       da nicht stehen (Doc, 30.08.2026) - der Stundeninhalt wird eingetippt
       oder liegt schon fertig da, und dann geht er raus. Die Stunden, in die
       geschrieben wird, stehen als eine Zeile darunter; angekreuzt wird nur
       dort, wo schon etwas ANDERES drinsteht - eine Handkorrektur in WebUntis
       darf nie stillschweigend sterben. Der Stand kommt live aus WebUntis,
       nicht aus svp_untis - der ist nur der Aufhaenger (Datumsbereich +
       Klassen der Seite) und kann Tage alt sein. */
    function untisDialog(ref, entries, chip, data, url) {
        /* Im Termin-Modus sind die Stunden schon ausgewaehlt (Klasse + Tag +
           Doppelstunde); der Live-Abruf darf dann nur genau diese zeigen. */
        /* Klassen normalisiert vergleichen: svp_untis haelt gekoppelte
           Klassen als "FOG25-2,FOW25-2" in Untis-Reihenfolge, der Live-Abruf
           liefert ein Array - auf gleiche Reihenfolge kann man sich nicht
           verlassen, also beide sortiert. */
        const classKey = (v) => (Array.isArray(v) ? v : String(v || '').split(','))
            .map(x => x.trim()).filter(Boolean).sort().join(',');
        const pick = TERMIN_MODE
            ? new Set(entries.map(e => e.date + '|' + e.start + '|' + classKey(e.klasse)))
            : null;
        const slotInfo = TERMIN_MODE ? untisSlotOf(ref.i) : null;
        const dates = entries.map(e => e.date).sort();
        const from = dates[0], to = dates[dates.length - 1];
        const classes = (data && data.classes) || [];
        /* Fach MUSS mitfiltern: Doc unterrichtet in BGY26-1/2 sowohl Mat als
           auch Inf, die Mathe-Seite bot deshalb sieben Stunden an statt fuenf
           (Doc, 31.08.2026). Fehlt subjects in einem aelteren Stand,
           bleibt es beim reinen Klassenfilter wie bisher. */
        const subjects = (data && data.subjects) || [];

        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card untis-card">' +
            '  <div class="svp-gate-title">WebUntis &middot; Klassenbuch</div>' +
            '  <div class="svp-gate-sub">' +
            (slotInfo
                ? 'Termin ' + (slotInfo.block + 1) + ' &middot; ' +
                  (slotInfo.half ? '2.' : '1.') + ' Doppelstunde'
                : 'KW ' + ref.kw) +
            ' &middot; ' + untisDay(from) +
            (from !== to ? '&ndash;' + untisDay(to) : '') + '</div>' +
            '  <div class="untis-targets" id="untis-targets">Stunden werden geladen &hellip;</div>' +
            '  <div class="svp-gate-row">' +
            '    <button type="button" class="action secondary" id="untis-cancel">Abbrechen</button>' +
            '    <button type="button" class="action" id="untis-go" disabled>Send now</button>' +
            '  </div>' +
            '  <div class="svp-gate-err" id="untis-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);

        const targets = overlay.querySelector('#untis-targets');
        const err = overlay.querySelector('#untis-err');
        const go = overlay.querySelector('#untis-go');

        let sending = false;
        function close() {
            /* Waehrend gesendet wird, gibt es kein "Abbrechen" - die Requests
               laufen sonst unsichtbar weiter und Doc haelt sie fuer verworfen. */
            if (sending) return;
            document.removeEventListener('keydown', onKey, true);
            overlay.remove();
        }
        function onKey(ev) {
            if (ev.key === 'Escape') { ev.preventDefault(); close(); }
            /* Cmd/Ctrl+Enter schickt los - Enter allein gehoert der Textarea. */
            else if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey) && !go.disabled) { ev.preventDefault(); send(); }
        }
        document.addEventListener('keydown', onKey, true);
        overlay.querySelector('#untis-cancel').addEventListener('click', close);
        overlay.addEventListener('click', ev => { if (ev.target === overlay) close(); });

        const parts = P.untisTopicParts(ref.i);

        function label(l) {
            let t = l.klassen.join(',') + ' ' + untisDay(l.date) + ' ' + l.start;
            if (l.end) t += '\u2013' + l.end;
            if (l.periods && l.periods.length > 1)
                t += ' \u00b7 ' + (l.periods.length === 2 ? 'Doppelstunde' : l.periods.length + ' Stunden');
            return t;
        }

        /* Eine Box je Stunde, vorbelegt aus untisSpread. Was Doc darin aendert,
           gilt - die Verteilung ist ein Vorschlag, kein Automatismus. */
        let boxes = [];
        untisCall({ action: 'lessons', from: from, to: to }).then(res => {
            const mine = (res.lessons || []).filter(l =>
                (!classes.length || l.klassen.some(k => classes.indexOf(k) >= 0)) &&
                (!subjects.length || subjects.indexOf(l.subject) >= 0) &&
                (!pick || pick.has(l.date + '|' + l.start + '|' + classKey(l.klassen))));
            if (!mine.length) {
                targets.textContent = pick
                    ? 'Keine passende Stunde fuer diesen Termin.'
                    : 'Keine passende Stunde in dieser Woche.';
                return;
            }

            /* Erst falten, dann verteilen: Mathe 11 hat pro Woche DREI
               Klassenbucheintraege (Mo-Doppel, Di, Do-Doppel), nicht fuenf. */
            const rows = P.untisBlocks(mine);
            const spread = P.untisSpread(parts.base, parts.details,
                rows.filter(l => l.writable && l.code !== 'cancelled'));
            targets.textContent = '';

            for (const l of rows) {
                const slot = document.createElement('div');
                slot.className = 'untis-slot' + (l.writable ? '' : ' is-locked');

                const head = document.createElement('div');
                head.className = 'untis-slot-head';
                const who = document.createElement('span');
                who.className = 'untis-slot-when';
                who.textContent = label(l);
                head.appendChild(who);

                /* Ausgefallene Stunden fanden nicht statt - dort wird nicht
                   geschrieben (177 cancelled in einer normalen Schulwoche,
                   das ist kein Randfall). Vertretung bleibt beschreibbar,
                   traegt aber einen Hinweis. */
                if (l.code === 'cancelled') {
                    const note = document.createElement('span');
                    note.className = 'untis-slot-note';
                    note.textContent = 'entfällt';
                    head.appendChild(note);
                    slot.classList.add('is-locked');
                    slot.appendChild(head);
                    targets.appendChild(slot);
                    continue;
                }
                if (l.code === 'irregular') {
                    const note = document.createElement('span');
                    note.className = 'untis-slot-note';
                    note.textContent = 'Vertretung';
                    head.appendChild(note);
                }

                if (!l.writable) {
                    const note = document.createElement('span');
                    note.className = 'untis-slot-note';
                    note.textContent = 'kein Schreibrecht';
                    head.appendChild(note);
                    slot.appendChild(head);
                    targets.appendChild(slot);
                    continue;
                }

                const count = document.createElement('span');
                count.className = 'untis-slot-count';
                head.appendChild(count);
                slot.appendChild(head);

                const box = document.createElement('textarea');
                box.className = 'untis-text';
                box.rows = 2;
                box.maxLength = P.UNTIS_MAX;
                box.setAttribute('aria-label', 'Stundeninhalt ' + label(l));
                /* Termin-Modus: die Doppelstunde traegt GENAU diese eine Planzeile,
                   also den ganzen Zeilentext - nicht einen Schritt daraus. */
                box.value = (TERMIN_MODE ? P.untisTopicText(ref.i) : spread.get(l)) || '';
                const countUp = () => {
                    count.textContent = box.value.length + '/' + P.UNTIS_MAX;
                    count.classList.toggle('is-full', box.value.length >= P.UNTIS_MAX);
                };
                box.addEventListener('input', countUp);
                countUp();
                slot.appendChild(box);

                /* Steht schon etwas ANDERES drin, wird nur mit Haken ueberschrieben -
                   eine Handkorrektur in WebUntis darf nie stillschweigend sterben. */
                let cb = null;
                const state = document.createElement('div');
                state.className = 'untis-state';
                if (l.topic.trim()) {
                    const row = document.createElement('label');
                    row.className = 'untis-row';
                    cb = document.createElement('input');
                    cb.type = 'checkbox';
                    const txt = document.createElement('span');
                    txt.className = 'untis-state is-set';
                    txt.textContent = 'steht schon: ' + l.topic;
                    row.appendChild(cb); row.appendChild(txt);
                    slot.appendChild(row);
                    l._state = txt;
                } else {
                    slot.appendChild(state);
                    l._state = state;
                }
                targets.appendChild(slot);
                boxes.push({ l: l, box: box, cb: cb });
            }
            if (!boxes.length) targets.appendChild(document.createTextNode('Nichts zu schreiben.'));
            go.disabled = !boxes.length;
            const first = boxes[0] && boxes[0].box;
            if (first) { first.focus(); first.setSelectionRange(first.value.length, first.value.length); }
        }).catch(e => { targets.textContent = ''; err.textContent = e.message; });

        async function send() {
            const picked = boxes.filter(b => {
                const t = b.box.value.replace(/\s+/g, ' ').trim();
                if (!t) return false;                       /* leer = diese Stunde auslassen */
                return b.cb ? b.cb.checked : true;          /* belegt nur mit Haken */
            });
            if (!picked.length) {
                err.textContent = boxes.some(b => b.cb)
                    ? 'Belegte Stunden zum Überschreiben ankreuzen.'
                    : 'Keine Stunde mit Text.';
                return;
            }
            sending = true;
            go.disabled = true;
            const cancelBtn = overlay.querySelector('#untis-cancel');
            cancelBtn.disabled = true;
            err.textContent = 'Schicke …';
            let done = 0; const failed = []; const tickMissed = [];
            for (const b of picked) {
                const l = b.l;
                const text = b.box.value.replace(/\s+/g, ' ').trim();
                try {
                    /* Jede Periode des Blocks einzeln, gleicher Text - und JEDE Antwort zaehlt.
                       Frueher ueberschrieb die letzte Antwort die vorige, ein Fehlschlag der
                       ersten Periode verschwand also hinter dem Erfolg der zweiten
                       (Doc, 06.09.2026). Gemessen am selben Tag: WebUntis spiegelt einen
                       Stundeninhalt nur ueber lueckenlose Perioden, ueber die Pause hinweg
                       nicht - beide Haelften eines Tages sind zwei echte Eintraege. */
                    const periods = l.periods || [l];
                    const results = [];
                    for (const per of periods) {
                        results.push(await untisCall({
                            action: 'write', ttId: per.ttId, topic: text, force: !!l.topic.trim()
                        }));
                    }
                    /* Was WIRKLICH drinsteht, sagt die Function nach dem Zuruecklesen. Ein
                       Eintrag gilt nur als geschrieben, wenn jede Periode ok gemeldet hat -
                       sonst leuchtet der Chip gruen fuer ein leeres Klassenbuch. */
                    const bad = results.find(r => r && r.ok === false);
                    l.topic = (results[0] && results[0].stored) || text;
                    if (bad) {
                        const msg = bad.conflict
                            ? 'nicht geschrieben, in WebUntis steht: ' + (bad.stored || '')
                            : 'WebUntis hat daraus gemacht: ' + (bad.stored || '(nichts)');
                        if (l._state) {
                            l._state.textContent = msg;
                            l._state.className = 'untis-state is-bad';
                        }
                        failed.push(label(l) + ': ' + msg);
                        continue;   /* kein Haken, kein Echo, kein gruener Chip */
                    }
                    /* "Anwesenheit kontrolliert" rides along with the write (Edge Function
                       tickIfBegun): true = set and read back, a string says why not. Until
                       15.09.2026 this answer was ignored, so a tick that died (school-year
                       range, code -8507) still showed as a plain "eingetragen ✓". Written
                       ahead of time or cancelled is expected; anything else is a real miss. */
                    const why = results.map(r => r && r.absenceChecked).filter(a => a !== true);
                    const tickMsg = why.length ? String(why[0] || 'keine Antwort') : '';
                    const tickExpected = /noch nicht begonnen|ausgefallen/.test(tickMsg);
                    if (tickMsg && !tickExpected) tickMissed.push(label(l) + ': Anwesenheit NICHT gesetzt (' + tickMsg + ')');
                    if (l._state) {
                        l._state.textContent = tickMsg
                            ? 'eingetragen ✓ · Anwesenheit: ' + tickMsg
                            : 'eingetragen ✓ · Anwesenheit ✓';
                        l._state.className = 'untis-state ' + (tickMsg && !tickExpected ? 'is-bad' : 'is-ok');
                    }
                    if (b.cb) { b.cb.checked = false; b.cb.disabled = true; }
                    b.box.disabled = true;
                    /* Chip-Stand mitziehen - fuer JEDE Periode des Blocks, alle sind
                       zurueckgelesen bestaetigt. */
                    for (const per of periods) {
                        const hit = entries.find(e => e.date === per.date && e.start === per.start);
                        if (hit) { hit.written = true; hit.text = l.topic; }
                        untisEchoPut(per.date, per.start, l.topic);
                    }
                    done++;
                } catch (e) {
                    failed.push(label(l) + ': ' + e.message);
                }
            }
            sending = false;
            cancelBtn.disabled = false;
            boxes = boxes.filter(b => !b.box.disabled);
            chip.className = 'untis-chip ' + untisChipClass(entries);
            chip.title = untisTitle(entries, data.generated);
            if (failed.length) { err.textContent = failed.concat(tickMissed).join(' | '); go.disabled = false; return; }
            err.textContent = done + ' Stunde' + (done === 1 ? '' : 'n') + ' eingetragen ✓';
            /* a missed tick keeps the dialog open - Doc has to see it (fallback: Eintragen at 18:00) */
            if (tickMissed.length) { err.textContent += ' | ' + tickMissed.join(' | '); return; }
            setTimeout(close, 900);   /* Erfolg kurz zeigen, dann aus dem Weg */
        }
        go.addEventListener('click', send);
    }

    /* ---- Lokales Echo des Chip-Stands ------------------------------------
       Der Chip liest den Stand aus svp_untis (bis 10.09.2026: <plan>.untis.json),
       den nur "tools/webuntis.js status" auf Docs Rechner schreibt. Was der Dialog
       gerade nach WebUntis geschrieben hat, steht dort noch nicht drin: der
       Chip wurde im Moment des Sendens orange und war nach dem naechsten
       Reload wieder weiss (Doc, 30.08.2026 - der Text stand da laengst drin).
       Der Browser kann die Datei nicht schreiben, also merkt sich die Seite
       ihre eigenen Schreibvorgaenge lokal und legt sie darueber.
       Aufraeum-Regel: sobald die Datei JUENGER ist als das Echo, gewinnt die
       Datei und das Echo fliegt raus. Sonst wuerde eine Stunde, die Doc in
       WebUntis wieder geleert hat, hier ewig als eingetragen leuchten. */
    const UNTIS_ECHO_KEY = 'svp-untis-echo:' + location.pathname;

    function untisEchoLoad() {
        try { return JSON.parse(localStorage.getItem(UNTIS_ECHO_KEY)) || {}; } catch (e) { return {}; }
    }
    function untisEchoPut(date, start, text) {
        const map = untisEchoLoad();
        map[date + ' ' + start] = { text: text, ts: Date.now() };
        try { localStorage.setItem(UNTIS_ECHO_KEY, JSON.stringify(map)); } catch (e) { }
    }
    function untisEchoMerge(data) {
        const map = untisEchoLoad();
        const fileTs = data.generated ? Date.parse(data.generated) : 0;
        let dirty = false;
        for (const kw of Object.keys(data.weeks || {})) {
            for (const e of data.weeks[kw]) {
                const key = e.date + ' ' + e.start, rec = map[key];
                if (!rec) continue;
                if (fileTs && fileTs > rec.ts) { delete map[key]; dirty = true; continue; }
                e.written = true;
                e.text = rec.text;
            }
        }
        if (dirty) { try { localStorage.setItem(UNTIS_ECHO_KEY, JSON.stringify(map)); } catch (e) { } }
    }

    /* In der Gruppen-Ansicht sieht der Plan nur die Stunden DIESER Gruppe:
       Chips, Terminzaehlung und der Klassenbuch-Dialog folgen damit von
       allein - und der Knopf schreibt nur noch in eine Gruppe statt in fuenf. */
    function untisOnlyGroup(data) {
        if (!P.GROUP || !data || !data.weeks) return data;
        const weeks = {};
        for (const kw of Object.keys(data.weeks)) {
            const list = data.weeks[kw].filter(e => P.inGroup(e.klasse));
            if (list.length) weeks[kw] = list;
        }
        const klassen = P.GROUP_KEY.split('_');
        const classes = (data.classes || []).filter(c => klassen.includes(c));
        return Object.assign({}, data, {
            weeks: weeks,
            classes: classes.length ? classes : data.classes
        });
    }

    /* Die Wochenspalte zeigt in der Gruppen-Ansicht den ECHTEN Termin dieser
       Gruppe (14-taegig, vier Stunden am Stueck) statt der Kalenderwoche des
       Plans - erst damit ist es der Plan einer Gruppe und nicht mehr der
       gemeinsame. Geaendert wird nur die ANZEIGE: data-src bleibt der Text aus
       der Plandatei, damit Speichern und "Verschieben" weiter mit dem
       Schuljahr rechnen und nicht mit dem Stundenplan einer Gruppe.
       Die Termine kommen aus WebUntis (svp_untis) und damit nur fuer
       angemeldete Augen - ohne Anmeldung bleibt die Woche stehen. */
    let terminePainted = null;

    function paintTerminDates(termine) {
        if (!P.GROUP || !TERMIN_MODE) return;
        if (termine) terminePainted = termine;
        if (!terminePainted) return;
        const list = [...terminePainted.values()][0] || [];
        for (const r of P.rendered) {
            if (!r.dateTd) continue;                       /* Ferienzeile */
            const s = untisSlotOf(r.i);
            const day = list[s.block];
            r.gkw = null;
            if (!day || !day.length) continue;
            const ymd = day[0].date;
            const d = new Date(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8));
            r.gkw = P.isoWeek(d);
            r.terminYmd = ymd;
            r.dateTd.classList.add('termin-date');
            r.dateTd.title = 'Termin ' + (s.block + 1) + ' \u00b7 ' +
                (s.half ? '2.' : '1.') + ' Doppelstunde \u00b7 ' + untisDay(ymd) + ymd.slice(0, 4);
            r.dateTd.textContent = '';
            r.dateTd.appendChild(document.createTextNode(untisDay(ymd)));
            /* Zweite Zeile ohne <br>: td.date br ist seit dem 07.09.2026
               ausgeblendet (einzeiliges Datum), ein small mit display:block
               kommt dem nicht in die Quere. */
            const ds = document.createElement('small');
            ds.className = 'ds';
            ds.textContent = (s.half ? '2.' : '1.') + ' DS';
            r.dateTd.appendChild(ds);
            /* die KW-Spalte gleich mit: sonst stuende die Plan-Woche neben
               einem Datum aus einer anderen - und die SW daneben, die parallel
               zur KW laeuft (siehe swForKw) */
            const kwTd = r.dateTd.previousElementSibling;
            if (kwTd) kwTd.textContent = r.gkw;
        }
        layoutTerminWeeks();
        /* Sprungziel und "laufende Woche" richten sich jetzt nach den Terminen
           der Gruppe - beide noch einmal laufen lassen. */
        P.runKwJump();
        /* Die laufende Woche trifft hier meistens nichts: die Gruppe kommt nur
           alle zwei Wochen. Dann bekommt der naechste Termin die Marke - ohne
           sie stuende der Plan einer Gruppe ganz ohne "hier sind wir" da. */
        if (!P.runNowMark()) markNextTermin();
        markPastWeeks();
    }

    /* ---- Leerwochen und der Platz der Ferien ------------------------------
       Eine Gruppe kommt 14-taegig: die zwei Planzeilen eines Termins liegen auf
       EINEM Montag, die Woche dazwischen hat sie gar nicht. Die Tabelle zeigt
       diese Woche trotzdem - als leere Zeile mit ihrer Kalenderwoche (Doc,
       20.09.2026: "die haben alle immer zwei Doppelstunden fuer die eine Woche.
       Wenn ich die in der Woche nicht habe lass die Woche leer").
       Damit laeuft die KW-Spalte wieder lueckenlos, und das gruene Ferienband
       landet an der richtigen Stelle: in der Plandatei steht es an der Position
       des WOCHEN-Rhythmus, die Termine einer Gruppe liegen aber anders. Die
       Herbstferien standen deshalb HINTER dem 26.10. statt davor (Doc,
       20.09.2026: "44 steht aber vor den HF"). */
    const DAY_MS = 86400000;

    function ymdToDate(ymd) {
        return new Date(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8));
    }
    function mondayOf(d) {
        const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
        return m;
    }

    /* Der Zeitraum einer Ferienzeile, aus ihrem eigenen Text - eine zweite,
       von Hand gepflegte Liste waere die zweite Wahrheit. Alle Schreibweisen
       der Plandateien: "12.-24.10.2026 (KW 42-43)", "23.12.2026-02.01.2027",
       "26.03.-02.04.2027", "ab 10.07.2027". Tag, Monat und Jahr duerfen vorn
       fehlen - sie kommen dann vom Enddatum. Ein einzelnes Datum ("ab ...")
       heisst offenes Ende. */
    function ferienRange(text) {
        const s = String(text || '').split('(')[0];
        const re = /(\d{1,2})\.(?:\s*(\d{1,2})\.)?(?:\s*(\d{4}))?/g;
        const hits = [];
        let m;
        while ((m = re.exec(s))) hits.push([+m[1], m[2] ? +m[2] : null, m[3] ? +m[3] : null]);
        if (!hits.length) return null;
        const last = hits[hits.length - 1];
        if (last[1] == null || last[2] == null) return null;   /* ohne Monat und Jahr nicht zu verorten */
        const end = new Date(last[2], last[1] - 1, last[0]);
        if (hits.length === 1) return { start: end, end: new Date(8640000000000000) };
        const f = hits[0];
        return {
            start: new Date(f[2] != null ? f[2] : last[2], (f[1] != null ? f[1] : last[1]) - 1, f[0]),
            end: end
        };
    }

    /* Welche Kalenderwochen ueberhaupt Unterrichtswochen sind, sagt die
       Plandatei: eine Zeile je Woche mit ihrer kw. Gebraucht wird das, um eine
       halbe Woche von einer Ferienwoche zu unterscheiden - KW 12/2027 steht im
       Plan (Mo-Do Unterricht, ab Fr Osterferien) und ist deshalb eine eigene
       Zeile, KW 13 steht nicht drin und gehoert den Ferien. */
    let planKws = null;
    function isPlanKw(kw) {
        if (!planKws) {
            planKws = new Set();
            for (const row of P.planRows || []) {
                if (!row.ferien && row.kw != null) planKws.add(Number(row.kw));
            }
        }
        return planKws.has(Number(kw));
    }

    /* Eine leere Woche: dieselben Zellen wie eine Planzeile (sonst wandern die
       Spaltenbreiten), darin SW und KW und sonst nichts. Die SW traegt der
       Durchlauf am Ende nach. */
    function leerRow(ref, mon) {
        const tr = document.createElement('tr');
        tr.className = 'leerwoche';
        tr.title = 'kein Termin dieser Lerngruppe';
        for (const c of ref.children) {
            const td = document.createElement('td');
            td.className = c.className;
            tr.appendChild(td);
        }
        if (tr.children[2]) tr.children[2].textContent = String(P.isoWeek(mon));
        /* leerer Platzhalter fuer das Chevron, damit die SW-Zahlen aller
           Wochen untereinander stehen (siehe tr.leerwoche .chev in svp.css) */
        if (tr.children[1]) {
            const chev = document.createElement('span');
            chev.className = 'chev';
            chev.setAttribute('aria-hidden', 'true');
            tr.children[1].appendChild(chev);
        }
        return tr;
    }

    /* SW = die wievielte Woche dieser Lerngruppe. Sie laeuft parallel zur KW
       (Doc, 20.09.2026: "die SW laufen parallel zur KW", "38 -> 3, 39 -> 4"):
       die erste Woche mit Unterricht ist SW 1, jede weitere Kalenderwoche
       zaehlt eins hoch - auch die leeren -, Ferienwochen zaehlen nicht mit.
       Beide Doppelstunden eines Termins tragen dieselbe Nummer, denn sie sind
       dieselbe Woche. Wie bei der KW aendert sich nur die ANZEIGE: gespeichert
       und verschoben wird weiter mit row.nr aus der Plandatei. */
    /* In der SW-Zelle steht links das Chevron der Woche (svp-plan-rows.js
       haengt es in tds[0]) - ein textContent wuerde es mitloeschen (Doc,
       20.09.2026: "chevis weg?"). Also nur den Textknoten anfassen. */
    function setNumText(td, value) {
        for (const n of td.childNodes) {
            if (n.nodeType === 3) { n.nodeValue = String(value); return; }
        }
        td.appendChild(document.createTextNode(String(value)));
    }

    function paintSw(tbody) {
        let sw = 0, lastKw = null;
        for (const tr of tbody.children) {
            if (tr.classList.contains('ferien') || tr.classList.contains('detail-row')) continue;
            const swTd = tr.children[1], kwTd = tr.children[2];
            if (!swTd || !kwTd) continue;
            if (kwTd.textContent !== lastKw) { sw++; lastKw = kwTd.textContent; }
            setNumText(swTd, sw);
        }
    }

    let leerRows = [];

    function layoutTerminWeeks() {
        if (!P.GROUP || !TERMIN_MODE || !P.tbody) return;
        const tbody = P.tbody;
        /* paintTerminDates laeuft zweimal (Zwischenstand, dann live) - die
           Leerwochen des ersten Laufs zuerst weg */
        for (const tr of leerRows) tr.remove();
        leerRows = [];

        /* Ferienzeilen herausnehmen; sie werden gleich neu einsortiert */
        const ferien = [];
        for (const tr of [...tbody.children]) {
            if (!tr.classList.contains('ferien')) continue;
            const txt = tr.querySelector('.ferien-text');
            ferien.push({ tr, range: ferienRange(txt && txt.textContent), used: false });
            tr.remove();
        }

        /* die Planzeilen in ihrer Reihenfolge, jede mit dem Montag ihres Termins */
        const weeks = [];
        for (const r of P.rendered) {
            if (!r.terminYmd || !r.tr || !r.tr.parentElement) continue;
            weeks.push({ tr: r.tr, mon: mondayOf(ymdToDate(r.terminYmd)) });
        }

        const covers = (f, mon, sun) => f.range && f.range.start <= sun && f.range.end >= mon;

        /* Ein Ferienband, dessen Zeit vorbei ist, gehoert vor diese Woche -
           sonst bliebe es liegen, wenn seine Wochen alle schon vergeben sind. */
        const flush = (mon, before) => {
            for (const f of ferien) {
                if (f.used || !f.range || !(f.range.end < mon)) continue;
                f.used = true;
                tbody.insertBefore(f.tr, before);
            }
        };

        let prev = null;
        for (const w of weeks) {
            if (prev) {
                const cur = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate());
                cur.setDate(cur.getDate() + 7);
                while (cur < w.mon) {
                    const mon = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
                    const sun = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 6);
                    flush(mon, w.tr);
                    /* Welche Woche Unterrichtswoche ist, sagt die Plandatei:
                       steht ihre KW dort, hat sie eine SW und bleibt eine
                       eigene Zeile - auch wenn die Ferien mitten in ihr
                       anfangen (KW 12/2027: Mo-Do Unterricht, ab Fr
                       Osterferien). Nur Wochen, die in der Plandatei gar nicht
                       vorkommen, gehoeren den Ferien. */
                    const planWeek = isPlanKw(P.isoWeek(mon));
                    const f = planWeek ? null : ferien.find(x => !x.used && covers(x, mon, sun));
                    if (f) {
                        f.used = true;
                        tbody.insertBefore(f.tr, w.tr);
                    } else if (planWeek || !ferien.some(x => x.used && covers(x, mon, sun))) {
                        /* nicht schon von einem gesetzten Ferienband abgedeckt */
                        const tr = leerRow(w.tr, mon);
                        tbody.insertBefore(tr, w.tr);
                        leerRows.push(tr);
                    }
                    cur.setDate(cur.getDate() + 7);
                }
            }
            flush(w.mon, w.tr);
            prev = w.mon;
        }
        /* was keine Luecke gefunden hat (die Sommerferien am Ende) haengt
           wieder hinten an, in der Reihenfolge der Plandatei */
        for (const f of ferien) if (!f.used) tbody.appendChild(f.tr);

        paintSw(tbody);

        /* Die Ferien stehen jetzt woanders - die Klapp-Bloecke richten sich
           nach dem Ferienband ueber ihnen und muessen neu durchlaufen. */
        if (P.applyFerienFolds) P.applyFerienFolds();
    }

    /* Weeks that are over get a very faint grey (Doc, 16.09.2026: "mach die, die
       schon gelaufen sind gaaaaaanz leicht grau"). Over means the last day of
       the week - in termin mode the group's appointment - lies before today.
       The marked current week stays orange, also on its weekend; holiday rows
       have no dateTd and keep their green. By date, not by position above the
       orange row: in the holidays there is no orange row. */
    function markPastWeeks() {
        const n = new Date();
        const today = String(n.getFullYear()) +
            String(n.getMonth() + 1).padStart(2, '0') + String(n.getDate()).padStart(2, '0');
        for (const r of P.rendered) {
            const tr = r.dateTd && r.dateTd.closest('tr');
            if (!tr) continue;
            let end = r.gkw != null && r.terminYmd ? r.terminYmd : '';
            if (!end) {
                const m = P.datumLang(r.dateTd.dataset.src || '').match(/(\d{1,2})\.(\d{1,2})\.(\d{2})$/);
                if (m) end = '20' + m[3] + m[2].padStart(2, '0') + m[1].padStart(2, '0');
            }
            tr.classList.toggle('kw-past', !!end && end < today && !tr.classList.contains('kw-now'));
        }
    }

    function markNextTermin() {
        const n = new Date();
        const heute = String(n.getFullYear()) +
            String(n.getMonth() + 1).padStart(2, '0') + String(n.getDate()).padStart(2, '0');
        /* Die Marke gilt der WOCHE, nicht der einzelnen Zeile (Doc, 20.09.2026:
           "die muessen beide gelb!", "gleiche KW!"): ein Termin sind zwei
           Planzeilen, die erste und die zweite Doppelstunde desselben Montags -
           beide stehen in derselben Kalenderwoche und leuchten zusammen. */
        let kw = null;
        for (const r of P.rendered) {
            if (!r.terminYmd || r.terminYmd < heute) continue;
            kw = r.gkw;
            break;
        }
        if (kw == null) return;
        for (const r of P.rendered) {
            if (r.gkw !== kw) continue;
            const tr = r.dateTd && r.dateTd.closest('tr');
            if (!tr) continue;
            tr.classList.add('kw-now');
            tr.title = 'n\u00e4chster Termin dieser Lerngruppe';
            const sub = tr.nextElementSibling;
            if (sub && sub.classList.contains('detail-row')) sub.classList.add('kw-now-sub');
        }
    }

    function decorateUntis(data) {
        untisEchoMerge(data);
        const weeks = (data && data.weeks) || {};
        const url = data && data.webuntis;
        const termine = TERMIN_MODE ? untisTermine(data) : null;
        for (const r of P.rendered) {
            if (!r.lbTd) continue;
            const entries = termine ? untisEntriesFor(termine, r.i) : weeks[String(r.kw)];
            if (!entries || !entries.length) continue;
            const chip = document.createElement('span');
            chip.className = 'untis-chip ' + untisChipClass(entries);
            chip.appendChild(untisMark());
            chip.title = untisTitle(entries, data.generated);
            chip.addEventListener('click', function (ev) {
                ev.stopPropagation(); /* not the row's detail toggle */
                /* Der Chip zeigt immer an, handelt aber nur in der Woche, die
                   gerade bearbeitet wird. */
                if (!r.tr || !r.tr.classList.contains('wk-edit')) return;
                untisDialog(r, entries, chip, data, url);
            });
            /* Der Chip steht seit dem 09.09.2026 unten in der Zusatzmaterial-
               Zeile, nicht mehr in der Bereich-Spalte: dort nahm er der
               Themenspalte 56 px, und lange Titel brachen deshalb im
               Bearbeiten um (Doc: die Zeile wurde hoeher). Ist die
               Aufklappzeile noch nicht gebaut, holt ensureSubRow ihn nach. */
            r.untisChip = chip;
            if (r.matTools) r.matTools.insertBefore(chip, r.matTools.firstChild);
            else (r.lbCell || r.lbTd).appendChild(chip);
        }
        paintTerminDates(termine);
        /* Die Chips kommen erst nach dem Rendern dazu und koennen eine Zelle
           breiter machen - also nochmal ausgleichen. */
        P.equalizeLbCells();
    }

    /* Der Stand kommt seit dem 10.09.2026 aus Supabase (svp_untis), nicht mehr aus
       <plan>.untis.json neben der Seite: die Datei lag oeffentlich im Repo, mit
       Stundeninhalten und Terminen (Doc: "supa ist mir lieber"). Lesen darf nur Doc
       (RLS), ohne Anmeldung gibt es also keine Chips - der Plan bleibt wie er ist. */
    (function loadUntis() {
        if (!/\.html$/.test(location.pathname)) return;
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        svpAuth.api('svp_untis?page=eq.' + encodeURIComponent(location.pathname) + '&select=data')
            .then(res => (res.ok ? res.json() : null))
            .then(rows => { if (rows && rows.length && rows[0].data) decorateUntis(untisOnlyGroup(rows[0].data)); })
            .catch(() => { /* kein Stand oder offline: Plan bleibt unverändert */ });
    })();
});
