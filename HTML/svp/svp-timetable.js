/* Shared timetable helpers - the week on a real time axis.
   Used by stundenplan.html (staff view) and meinplan.html (students' view),
   together with svp-timetable.css. Pure functions only: no DOM, no page state.

   No fixed period rows: the school runs two different timegrids at once
   (FOS starts 08:00, the Oberschule classes 9a/9b sit at 11:35/13:20),
   so lessons are placed on a real time axis by minute. */
(function (root) {
    'use strict';

    /* Feste Kartenhoehe statt Fenster-Anpassung (Doc, 01.09.2026: "mach sie
       immer so hoch"). Vorher rechnete die Funktion avail/span, die Karten
       waren also je nach Fenstergroesse und Laenge des Schultags verschieden
       hoch - mal las man die Uhrzeit, mal war sie abgeschnitten.
       1.6 px/min heisst: eine 45-min-Stunde ist 72 px hoch, immer. Passt der
       Tag nicht ins Fenster, scrollt der Plan - das ist der Preis dafuer,
       dass eine Karte ueberall gleich aussieht. */
    const PX_PER_MIN = 1.6;

    const toMin = t => Math.floor(t / 100) * 60 + (t % 100);
    const hhmm = t => String(t).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');
    const parseYmd = d => new Date(+String(d).slice(0, 4), +String(d).slice(4, 6) - 1, +String(d).slice(6, 8));

    /* All-day entries (Einführungswoche etc., e.g. 00:00-23:59) would stretch
       the axis to 24h and drown the real lessons - they become banners. */
    const isBanner = l => toMin(l.endTime) - toMin(l.startTime) > 600;

    const HUES = ['--cyan', '--violet', '--teal', '--pink', '--phi', '--lambda'];
    /* Doc's own subjects are pinned instead of hashed - he reads his week by colour, and
       the hash had put Inf on pink. First match wins, so the Grundkurse (GKInf, GKInf 1,
       GKInf2 - Untis spells them with and without the space) are green before plain Inf
       can take orange. The pinned hues leave the hash pool, so no other subject can wear
       them and imitate his lessons. */
    const SUBJECT_HUE = [
        [/^GK\s?Inf/i, '--phi'],       // Informatik-Grundkurse: gruen
        [/^Inf$/i, '--lambda'],        // Informatik: orange
        [/^Mat$/i, '--cyan'],          // Mathe: blau
    ];
    const PINNED = SUBJECT_HUE.map(r => r[1]);
    const HASH_HUES = HUES.filter(h => !PINNED.includes(h));

    /* Stable colour per subject, so a subject keeps its hue across weeks.
       `own` = the lesson is Doc's - only then the pinned colours apply. */
    function hueOf(subject, own) {
        if (!subject) return HASH_HUES[0];
        if (own) for (const [re, hue] of SUBJECT_HUE) if (re.test(subject)) return hue;
        let h = 0;
        for (const c of subject) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        return HASH_HUES[h % HASH_HUES.length];
    }

    /* Jahrgang out of the IBB class code: "<Zweig><Eintrittsjahr>-<Gruppe>" in the
       upper school (BGY26-1 = entered 2026), plain "9a"/"10b" at the Oberschule.
       BGY/FOS/FOG/FOW all start in year 11, so the grade is 11 + the school years
       since entry, counted from the school year the lesson itself falls in. */
    function jahrgangOf(l) {
        const ymd = String(l.date || '');
        const y = +ymd.slice(0, 4), m = +ymd.slice(4, 6);
        const syStart = m >= 8 ? y : y - 1;          // a school year starts in August
        const out = [];
        for (const c of (l.classes || [])) {
            let g = null;
            const os = c.match(/^(\d{1,2})\s*[a-zA-Z]?$/);      // Oberschule: 9a, 10b
            if (os) g = +os[1];
            else {
                const up = c.match(/^[^\d]+(\d{2})/);            // BGY26-1, FOS25-2
                if (up) g = 11 + (syStart - (2000 + +up[1]));
            }
            if (g >= 5 && g <= 13 && !out.includes(g)) out.push(g);
        }
        return out.sort((a, b) => a - b).join('/');
    }

    function overlaps(a, b) {
        return toMin(a.startTime) < toMin(b.endTime) && toMin(b.startTime) < toMin(a.endTime);
    }

    // Side-by-side placement for overlapping lessons within one day.
    function layoutColumns(items) {
        const sorted = [...items].sort((x, y) => toMin(x.l.startTime) - toMin(y.l.startTime));
        const cols = [];
        for (const it of sorted) {
            let c = cols.findIndex(col => col.every(o => !overlaps(o.l, it.l)));
            if (c < 0) { cols.push([]); c = cols.length - 1; }
            cols[c].push(it);
            it.col = c;
        }
        // Width is decided per overlap group, not per day, so a single clash
        // does not shrink every other lesson of that day.
        for (const it of sorted) {
            const group = sorted.filter(o => overlaps(o.l, it.l) || o === it);
            it.of = Math.max(...group.map(o => o.col)) + 1;
        }
        return sorted;
    }

    root.SvpTimetable = {
        PX_PER_MIN, toMin, hhmm, parseYmd, isBanner,
        HUES, SUBJECT_HUE, hueOf, jahrgangOf, overlaps, layoutColumns,
    };
})(window);
