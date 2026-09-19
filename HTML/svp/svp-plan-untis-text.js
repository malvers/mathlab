// Stoffverteilungsplan renderer, part "untis-text": class book texts: abbreviations, 250-character fit (also read by tools/webuntis.js).
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        untisTopicParts, untisTopicText, untisSpread, untisBlocks
    });

    const UNTIS_MAX = P.UNTIS_MAX = 250;          /* WebUntis kappt laengere Texte ohnehin */

    /* Eine Klassenbuch-Zeile aus der Planzeile: Thema (Lernbereich, Ustd.): Schritte.
       Muss Zeichen fuer Zeichen dieselbe Regel sein wie topicText() in
       tools/webuntis.js - sonst haelt der eine Weg fuer eine Aenderung, was der
       andere geschrieben hat, und der Ueberschreibschutz schlaegt grundlos an. */
    /* Abkuerzungen fuer das WebUntis-Klassenbuch. Nur 250 Zeichen passen dort
       hinein, und die Schritte einer Woche sind schnell laenger - lieber
       "Wdh." schreiben als einen ganzen Schritt weglassen.
       WICHTIG: sie greifen NUR, wenn der volle Text nicht passt. Was hineinpasst,
       bleibt ausgeschrieben - ein Klassenbuch im Telegrammstil will niemand lesen.
       Die Liste ist die EINZIGE Quelle: tools/webuntis.js liest sie aus dieser
       Datei heraus, damit beide Wege zeichengleich schreiben.
       Reihenfolge egal - es wird nach Laenge sortiert angewandt, damit
       "Datenbankmanagementsystem" vor "Datenbank" drankommt. */
    window.SVP_ABBREV = [
        /* Mehrwortiges zuerst gedacht, sortiert wird ohnehin */
        ['Künstliche Intelligenz', 'KI'], ['Künstlicher Intelligenz', 'KI'],
        ['Schülerinnen und Schüler', 'SuS'],
        ['zum Beispiel', 'z. B.'], ['unter anderem', 'u. a.'],
        ['beziehungsweise', 'bzw.'], ['und so weiter', 'usw.'],
        /* Informatik-Fachwoerter */
        ['Datenbankmanagementsystem', 'DBMS'], ['Datenbankmanagementsysteme', 'DBMS'],
        ['Datenbanksystem', 'DBS'], ['Datenbanksysteme', 'DBS'],
        ['Datenbankanbindung', 'DB-Anbindung'],
        ['Datenbanken', 'DBs'], ['Datenbank', 'DB'],
        ['Informationssystem', 'IS'], ['Informationssysteme', 'IS'],
        ['Informationsmanagement', 'Info-Mgmt.'],
        ['Betriebssystem', 'BS'], ['Betriebssysteme', 'BS'],
        ['Tabellenkalkulation', 'TK'],
        ['Datensicherheit', 'Datensich.'], ['Datenschutz', 'DS'],
        ['Algorithmus', 'Alg.'], ['Algorithmen', 'Alg.'],
        ['Implementierung', 'Impl.'], ['implementieren', 'impl.'],
        ['Modellierung', 'Modell.'], ['Programmierung', 'Progr.'],
        ['Dokumentation', 'Doku'], ['Präsentation', 'Präs.'], ['Präsentationen', 'Präs.'],
        ['Verarbeitung', 'Verarb.'], ['Automatisierung', 'Autom.'],
        ['Automatisierte', 'Autom.'], ['Automatisierten', 'Autom.'],
        ['Automatisiertes', 'Autom.'], ['automatisierte', 'autom.'],
        /* Schul- und Planwoerter */
        ['Klassenarbeit', 'KA'], ['Klassenarbeiten', 'KAs'],
        ['Wiederholung', 'Wdh.'], ['Wiederholungen', 'Wdh.'],
        ['Lernbereich', 'LB'], ['Wahlbereich', 'WB'],
        ['Leistungsnachweis', 'LNW'], ['Leistungsnachweise', 'LNW'],
        ['Abiturvorbereitung', 'Abi-Vorb.'],
        ['Schuljahresplanung', 'SJ-Planung'], ['Schuljahresauftakt', 'SJ-Auftakt'],
        ['Organisatorisches', 'Orga'], ['Organisation', 'Orga'],
        ['Konsultationen', 'Konsult.'], ['Konsultation', 'Konsult.'],
        ['Hilfsmittel', 'Hilfsm.'], ['Vermischte', 'Verm.'],
        ['Auswertung', 'Ausw.'], ['Bewertung', 'Bew.'],
        ['Vertiefung', 'Vertief.'], ['Einführung', 'Einf.'],
        ['Grundlagen', 'Grdl.'], ['Überblick', 'Überbl.'], ['Ausblick', 'Ausbl.'],
        ['Abschluss', 'Abschl.'], ['Jahresrückblick', 'Jahresrückbl.'],
        /* Allgemeines */
        ['Eigenschaften', 'Eig.'], ['Anwendungen', 'Anw.'], ['Anwendung', 'Anw.'],
        ['Beispielen', 'Bsp.'], ['Beispiele', 'Bsp.'], ['Beispiel', 'Bsp.'],
        ['Aufgaben', 'Aufg.'], ['Aufgabe', 'Aufg.'],
        ['Funktionen', 'Fkt.'], ['Funktion', 'Fkt.'],
        ['Gleichungen', 'Gl.'], ['Gleichung', 'Gl.'],
        ['Informationen', 'Infos'], ['Information', 'Info'],
        ['vergleichen', 'vgl.'], ['Vergleich', 'Vgl.']
    ];

    /* Ein Wort nur als GANZES Wort ersetzen - sonst wuerde "Datenbank" mitten
       in "Datenbankanbindung" zuschlagen. \b hilft hier nicht: es kennt nur
       ASCII, und "Überblick" faengt mit einem Nicht-Wort-Zeichen an. */
    let abbrevRules = null;
    function untisAbbrev(t) {
        if (!abbrevRules) {
            abbrevRules = window.SVP_ABBREV
                .slice()
                .sort((a, b) => b[0].length - a[0].length)
                .map(([long, short]) => [
                    new RegExp('(?<!\\p{L})' + long.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?!\\p{L})', 'gu'),
                    short
                ]);
        }
        for (const [re, short] of abbrevRules) t = t.replace(re, short);
        return t;
    }

    /* WebUntis kann kein LaTeX - roh landet dort "$s = \\tfrac{a}{2}\\,t^2$".
       Ersatzlos loeschen geht aber auch nicht, das zerbricht die Saetze
       ("Spiegelung an" / "Graphen-Repertoire ohne Hilfsmittel:"), also wird die
       Formel in lesbaren Klartext gewandelt (Doc, 31.08.2026). */
    function untisPlain(t) {
        /* Marks are for the eye, the Klassenbuch gets the bare text. */
        return P.markPlain(t).replace(/\$([^$]*)\$/g, function (_, f) {
            return f
                .replace(/\\t?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '$1/$2')
                .replace(/\\sqrt\s*\{([^{}]*)\}/g, '\u221a$1')
                .replace(/\\vec\s*\{([^{}]*)\}/g, '$1')
                .replace(/\\mathrm\s*\{([^{}]*)\}/g, '$1')
                .replace(/\\cdot/g, ' \u00b7 ').replace(/\\times/g, ' \u00d7 ')
                .replace(/\\pi/g, '\u03c0').replace(/\\infty/g, '\u221e')
                .replace(/\\le/g, '\u2264').replace(/\\ge/g, '\u2265')
                .replace(/\\neq/g, '\u2260').replace(/\\approx/g, '\u2248')
                .replace(/\\(sin|cos|tan|ln|log|exp)\b/g, '$1')
                .replace(/\^\{?2\}?(?!\d)/g, '\u00b2').replace(/\^\{?3\}?(?!\d)/g, '\u00b3')
                /* Mehrzeichige Hoch-/Tiefstellungen brauchen Klammern, sonst
                   wird aus F_{n+1}/F_n ein "F_n+1/F_n" - das liest sich wie
                   F_n plus 1/F_n. Einzelne Zeichen bleiben klammerfrei. */
                .replace(/\^\{([^{}]*)\}/g, (m, g) => g.length > 1 ? '^(' + g + ')' : '^' + g)
                .replace(/_\{([^{}]*)\}/g, (m, g) => g.length > 1 ? '_(' + g + ')' : '_' + g)
                .replace(/\{,\}/g, ',')
                .replace(/\\,|\\;|\\!/g, ' ')
                .replace(/[{}]/g, '')
                .replace(/\\[a-zA-Z]+/g, '')
                .replace(/\s{2,}/g, ' ').trim();
        }).replace(/\s{2,}/g, ' ').trim();
    }

    /* Thema und Schritte getrennt - der Dialog verteilt die Schritte auf die
       einzelnen Stunden und braucht sie deshalb nicht mehr als einen Klotz. */
    function untisTopicParts(i) {
        const c = P.contentOf(i);
        const lb = (window.BADGE[c.type] || [])[1];
        const head = [lb, c.u].filter(Boolean).join(', ');
        /* Platzhalter-Thema ("—") heisst: nichts vorschlagen. Eine leere Box
           wird beim Senden uebersprungen - besser als "—" im Klassenbuch. */
        const topic = (c.topic === '—' || c.topic === '-') ? '' : (c.topic || '');
        return {
            base: topic ? untisPlain(topic + (head ? ' (' + head + ')' : '')).replace(/\s+/g, ' ').trim() : '',
            details: (c.details || []).filter(Boolean)
                .map(d => untisPlain(d).replace(/\s+/g, ' ').trim()),
        };
    }

    function untisTopicText(i) {
        const p = untisTopicParts(i);
        return untisFit(p.base, p.details);
    }

    /* Einen Schritt je Stunde statt fuenfmal denselben Klotz (Doc, 31.08.2026).
       Verteilt wird je LERNGRUPPE, nicht je Woche: FOG25-1 und FOW25-1 sind
       zwei verschiedene Klassen, jede braucht den ganzen Wochenstoff. Sind
       mehr Stunden als Schritte da - der Normalfall, 2-3 Schritte auf 5
       Stunden - bekommen die uebrigen "Festigung: <Schritt>" reihum. */
    function untisSpread(base, details, lessons) {
        const out = new Map();
        const groups = new Map();
        for (const l of lessons) {
            const key = (l.klassen || []).slice().sort().join(',');
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(l);
        }
        /* "Festigung: Klassenarbeit 2 (90 min)" darf nie vorgeschlagen werden -
           eine Arbeit ist ein Termin, kein Stoff. Direkt zugeteilt wird sie,
           die Festigungsrunde laesst sie aus. */
        const KA = /^(klassenarbeit|ka\s?\d)/i;
        const fest = details.filter(d => !KA.test(d));
        for (const list of groups.values()) {
            list.sort((a, b) => (a.date + ' ' + a.start).localeCompare(b.date + ' ' + b.start));
            list.forEach((l, i) => {
                let step = null;
                if (i < details.length) step = details[i];
                else if (fest.length) step = 'Festigung: ' + fest[(i - details.length) % fest.length];
                out.set(l, untisFit(base, step ? [step] : []));
            });
        }
        return out;
    }

    /* Doppelstunde = EIN Klassenbucheintrag. Gemessen am 31.08.2026: der
       Write auf Mo 12:00 stand sofort auch auf 12:45, der zweite Write lief
       in den 409 - WebUntis spiegelt den Stundeninhalt auf lueckenlos
       aufeinanderfolgende Perioden derselben Unterrichtseinheit. Also werden
       solche Perioden zu EINEM Block mit EINER Box gefaltet; geschrieben wird
       JEDE Periode des Blocks - derselbe Text. So stimmt es in beiden
       Welten: spiegelt WebUntis selbst, meldet die zweite Periode nur
       'unchanged'; spiegelt es nicht, fuellt unser Write sie. Gefaltet wird
       nach: gleicher Tag, gleiche Klassen, gleiches Fach, gleicher code,
       Ende = Start (lsnumber wuerde mit unterscheiden, kommt aus der
       JSON-RPC-API aber schlicht als null - gemessen 31.08.2026). Ohne
       end-Feld (alte Edge Function) bleibt jede Periode einzeln. */
    function untisBlocks(lessons) {
        const sorted = lessons.slice().sort((a, b) =>
            (a.date + ' ' + a.start).localeCompare(b.date + ' ' + b.start));
        const out = [];
        for (const l of sorted) {
            const prev = out[out.length - 1];
            const key = [l.date, l.lsnumber, (l.klassen || []).slice().sort().join(','),
                l.subject || '', l.code || ''].join('|');
            if (prev && prev.key === key && prev.end && l.start === prev.end) {
                prev.periods.push(l);
                prev.end = l.end || null;
                /* Ein Text irgendwo im Block heisst: der Block ist belegt -
                   sonst wuerde ein Write ohne Haken ihn beim Spiegeln toeten. */
                if (!prev.topic.trim() && (l.topic || '').trim()) prev.topic = l.topic;
                prev.writable = prev.writable && !!l.writable;
                continue;
            }
            out.push({
                key: key, periods: [l], ttId: l.ttId,
                date: l.date, start: l.start, end: l.end || null,
                klassen: l.klassen, subject: l.subject, code: l.code || '',
                topic: l.topic || '', writable: !!l.writable,
            });
        }
        return out;
    }

    /* Auf 250 Zeichen bringen, in drei Stufen - jede greift erst, wenn die
       vorige nicht gereicht hat, damit so wenig wie moeglich verlorengeht:
         1. voller Text, ausgeschrieben
         2. Abkuerzungen (Wiederholung -> Wdh.) - kostet Lesbarkeit, kein Inhalt
         3. ganze Schritte vom Ende weglassen, " …" sagt, dass noch etwas kommt
       Frueher schnitt ein hartes slice(250) mitten im Wort ab.
       Muss zeichengleich zu topicText() in tools/webuntis.js bleiben. */
    function untisFit(base, details) {
        const build = (b, d, n) => n ? b + ': ' + d.slice(0, n).join(' · ') : b;

        const full = build(base, details, details.length);
        if (full.length <= UNTIS_MAX) return full;                 /* 1 */

        const aBase = untisAbbrev(base), aDet = details.map(untisAbbrev);
        const aFull = build(aBase, aDet, aDet.length);
        if (aFull.length <= UNTIS_MAX) return aFull;               /* 2 */

        let t = aBase, used = 0;                                   /* 3 */
        for (let k = 0; k < aDet.length; k++) {
            const cand = build(aBase, aDet, k + 1);
            if (cand.length > UNTIS_MAX) break;
            t = cand; used = k + 1;
        }
        if (used < aDet.length) t += ' …';
        /* Notnagel: schon das Thema allein ist zu lang - an der letzten
           Wortgrenze kappen, nicht im Wort. */
        if (t.length > UNTIS_MAX) {
            t = t.slice(0, UNTIS_MAX - 2);
            t = t.slice(0, Math.max(t.lastIndexOf(' '), 1)).trim() + ' …';
        }
        return t;
    }
});
