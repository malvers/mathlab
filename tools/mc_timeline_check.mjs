// Mission Control (HTML/svp/leistungstest.html) played through a whole lesson with invented data - run it before
// every push of a change that paints something from live data (Doc, 06.11.2026: the yellow triangle stood on every
// tile at the start of 9a, "Das darf nicht passieren"; "Stunden-Check ... ok").
//
//     node tools/mc_timeline_check.mjs            (serve.py must run: http://localhost:8765)
//     node tools/mc_timeline_check.mjs --shots    (also a screenshot per phase into $TMPDIR/mc-timeline/)
//
// Nothing real is touched: a fresh head-less browser, its own localStorage with six invented pupils (scientists,
// codes ADA2 ...), the database answered here (control rows, results), WebUntis answered here (/__untis/abwesend never
// reaches serve.py), the encryption and the login replaced by stand-ins. The clock is set per phase of a lesson
// 09:50-10:35: before the start, some started, half started with a first submission, one left the test, after the bell.
// Each phase checks what the tiles, the triangle, the Nachschreiben box and the "Freigeben" button show.
// Exit code 1 when a check fails.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(new URL('../videopipeline/node_modules/playwright/index.mjs', import.meta.url).href);

const BASE = 'http://localhost:8765';
const SHOTS = process.argv.includes('--shots');
const SHOT_DIR = join(tmpdir(), 'mc-timeline');
if (SHOTS) mkdirSync(SHOT_DIR, { recursive: true });

const TEST = '../infotest9-leistungstest-9a.html?klasse=9a';
const URL_MC = BASE + '/svp/leistungstest.html?ziel=' + encodeURIComponent('infotest9-leistungstest-9a.html?klasse=9a');
// invented class: first name, last name, slip code (alphabet without I, O, 0, 1)
const KIDS = [
    ['Ada', 'Lovelace', 'ADA2'], ['Alan', 'Turing', 'TUR3'], ['Emmy', 'Noether', 'NTH4'],
    ['Kurt', 'Gödel', 'GDL5'], ['Marie', 'Curie', 'CUR6'], ['Lise', 'Meitner', 'MTN7'],
];
const code = first => KIDS.find(k => k[0] === first)[2];
const DAY = '2026-11-06', LESSON = { date: 20261106, start: 950, end: 1035 };
const ABSENT = ['Lise'];

// one phase = the clock, the server's control rows, the submissions
const run = (first, answered = 6) => ({ code: code(first), started: true, seen_secs: 3, answered, total: 20, aborted: false,
    leaves: 0, away_secs: 0, away_since: null, submitted: false });
const done = first => ({ ...run(first, 20), submitted: true });
const away = (first, at) => ({ ...run(first, 11), leaves: 1, away_secs: 40, away_since: at });
const PHASES = [
    { name: 'vor dem Start', time: '09:52', rows: [], subs: {},
      expect: { alarm: [], nach: false, freigeben: null } },
    { name: 'einige dabei', time: '10:00', rows: [run('Ada'), run('Alan')], subs: {},
      expect: { alarm: [], nach: false, freigeben: null } },
    { name: 'Hälfte gestartet, erste Abgabe', time: '10:12',
      rows: [done('Ada'), run('Alan', 12), run('Emmy', 9)], subs: { Ada: 18 },
      expect: { alarm: [], nach: true, must: ['Lise'], clear: [], freigeben: null } },
    { name: 'einer verlässt den Test', time: '10:25',
      rows: [done('Ada'), away('Alan', DAY + 'T10:24:10+01:00'), done('Emmy'), run('Marie', 15)], subs: { Ada: 18, Emmy: 14 },
      expect: { alarm: [], nach: true, must: ['Lise'], clear: [], freigeben: 'Alan' } },
    { name: 'Stunde vorbei', time: '10:40',
      rows: [done('Ada'), done('Alan'), done('Emmy'), done('Marie')], subs: { Ada: 18, Alan: 12, Emmy: 14, Marie: 17 },
      expect: { alarm: ['Kurt'], nach: true, must: ['Lise'], clear: ['Kurt'], freigeben: null } },
];

let phase = PHASES[0];
const hm = t => Number(t.replace(':', ''));
const json = (route, body) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: 'Europe/Berlin' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));

// stand-ins: the login, the encryption (names "sealed" as plain base64), no live reload
await page.route(/\/svp\/svp-auth\.js/, r => r.fulfill({ contentType: 'application/javascript', body: `
    window.svpAuth = { DB_URL: 'https://fyfhxzyymmurlaenmzse.supabase.co', DB_KEY: 'fake', session: null,
        hasSession: () => true, storeSession() {}, ensureFreshToken: async () => true, login: async () => true,
        loginDialog(fn) { if (fn) fn(); }, whoami: async () => ({ email: 'check@example.invalid' }),
        api: (p, o) => fetch('https://fyfhxzyymmurlaenmzse.supabase.co/rest/v1/' + p, o) };` }));
await page.route(/\/svp\/svp-crypto\.js/, r => r.fulfill({ contentType: 'application/javascript', body: `
    window.svpCrypto = { ready: Promise.resolve(), available: true, hasPrivate: () => true,
        publicKey: async () => ({}), hasPublic: async () => true,
        seal: async t => 'FAKE:' + btoa(unescape(encodeURIComponent(t))),
        open: async b => decodeURIComponent(escape(atob(String(b).slice(5)))),
        unlock: async () => true, lock() {}, passDialog(fn) { if (fn) fn(); } };` }));
await page.route(/\/__live\//, r => r.fulfill({ contentType: 'application/javascript', body: '' }));
// the database
await page.route(/supabase\.co\//, async r => {
    const u = r.request().url();
    let body = {};
    try { body = JSON.parse(r.request().postData() || '{}'); } catch (e) { /* GET */ }
    if (u.includes('/rpc/quiz_control')) return json(r, phase.rows.filter(x => (body.p_codes || []).includes(x.code)));
    if (u.includes('/rpc/quiz_result')) {
        const kid = KIDS.find(k => k[2] === body.p_code);
        const score = kid && phase.subs[kid[0]];
        return json(r, score == null ? [] : [{ score, total: 20, answers: Array.from({ length: 20 }, (_, i) => (i < score ? 0 : 1)) }]);
    }
    if (u.includes('/rpc/quiz_codes_set')) return json(r, KIDS.length);
    if (u.includes('/rpc/quiz_code_ok')) return json(r, 'ok');
    return json(r, []);
});
// WebUntis
await page.route(/\/__untis\/abwesend/, r => {
    const t = hm(phase.time);
    return json(r, { ok: true, gruppe: '9a', absenceChecked: true, at: phase.time,
        lesson: { ...LESSON, running: t >= LESSON.start && t < LESSON.end },
        students: KIDS.map(([fn, ln]) => ({ fn, ln, absent: ABSENT.includes(fn), excused: false })) });
});
// the invented class, stored as Mission Control stores a group (codes + "sealed" names)
await page.addInitScript(({ kids, test }) => {
    if (localStorage.getItem('svp-leistungstest-v1')) return;
    const names = JSON.stringify(kids.map(k => k[0] + ' ' + k[1]));
    localStorage.setItem('svp-leistungstest-v1', JSON.stringify({ '9a': { test, ids: kids.map(k => ({ code: k[2] })),
        sealed: 'FAKE:' + btoa(unescape(encodeURIComponent(names))) } }));
}, { kids: KIDS, test: TEST });

await page.clock.setFixedTime(new Date(DAY + 'T' + PHASES[0].time + ':00+01:00'));
await page.goto(URL_MC, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.lt-tile', { state: 'attached', timeout: 30000 });
await page.waitForTimeout(3000);

let failed = 0;
const check = (ok, what) => { console.log((ok ? '  ok    ' : '  FAIL  ') + what); if (!ok) failed++; };
const firstOf = c => (KIDS.find(k => k[2] === c) || ['?'])[0];

for (const ph of PHASES) {
    phase = ph;
    await page.clock.setFixedTime(new Date(DAY + 'T' + ph.time + ':00+01:00'));
    await page.click('#ltMcUntis').catch(() => {});        // WebUntis asked again, as every 2 min
    await page.waitForTimeout(6500);                        // one control beat (5 s) and the results
    console.log(ph.time + '  ' + ph.name);
    const s = await page.evaluate(() => {
        const tiles = [...document.querySelectorAll('.lt-tile')].map(t => ({ code: t.dataset.code,
            alarm: !!t.querySelector('.tl-alarm'), out: !!t.querySelector('.tl-att.out'),
            state: ['none', 'run', 'away', 'off', 'done', 'abort'].find(k => t.classList.contains(k)) || '' }));
        const nach = document.getElementById('ltNach');
        const chips = id => [...document.querySelectorAll('#' + id + ' .lt-nach-chip .nc-code')].map(x => x.textContent.trim());
        return { tiles, nach: nach && !nach.hidden, must: chips('ltNachOut'), clear: chips('ltNachClear') };
    });
    check(s.tiles.length === KIDS.length, KIDS.length + ' Kacheln (' + s.tiles.length + ')');
    const alarm = s.tiles.filter(t => t.alarm).map(t => firstOf(t.code)).sort();
    check(JSON.stringify(alarm) === JSON.stringify([...ph.expect.alarm].sort()),
        'Dreieck bei: ' + (ph.expect.alarm.join(', ') || 'niemandem') + ' (ist: ' + (alarm.join(', ') || 'niemand') + ')');
    const out = s.tiles.filter(t => t.out).map(t => firstOf(t.code));
    check(JSON.stringify(out) === JSON.stringify(ABSENT), 'abwesend markiert: ' + ABSENT.join(', ') + ' (ist: ' + (out.join(', ') || 'niemand') + ')');
    for (const row of ph.rows) {
        const want = row.submitted ? 'done' : row.away_since ? 'away' : 'run';
        const t = s.tiles.find(x => x.code === row.code);
        check(t && t.state === want, firstOf(row.code) + ': Kachel „' + want + '“ (ist: ' + (t ? t.state : 'fehlt') + ')');
    }
    check(s.nach === ph.expect.nach, 'Nachschreiben-Box ' + (ph.expect.nach ? 'sichtbar' : 'verborgen') + ' (ist: ' + (s.nach ? 'sichtbar' : 'verborgen') + ')');
    if (ph.expect.nach) {
        const must = s.must.map(firstOf), clear = s.clear.map(firstOf);
        check(JSON.stringify(must) === JSON.stringify(ph.expect.must), 'muss nachschreiben: ' + ph.expect.must.join(', ') + ' (ist: ' + (must.join(', ') || 'niemand') + ')');
        check(JSON.stringify(clear) === JSON.stringify(ph.expect.clear), 'klären: ' + (ph.expect.clear.join(', ') || 'niemand') + ' (ist: ' + (clear.join(', ') || 'niemand') + ')');
    }
    if (ph.expect.freigeben) {
        await page.click('.lt-tile[data-code="' + code(ph.expect.freigeben) + '"]');
        await page.waitForTimeout(1500);
        const f = await page.evaluate(() => {
            const b = [...document.querySelectorAll('#ltAbort button')].find(x => /Freigeben/.test(x.textContent));
            if (!b) return { there: false };
            const r = b.getBoundingClientRect();
            return { there: true, inView: r.top >= 0 && r.bottom <= innerHeight };
        });
        check(f.there, ph.expect.freigeben + ': „Freigeben“ im Detail');
        check(f.inView, '„Freigeben“ ist im Bild, ohne zu scrollen');
    }
    if (SHOTS) await page.screenshot({ path: join(SHOT_DIR, ph.time.replace(':', '') + '.png'), fullPage: true });
}
check(errors.length === 0, 'keine Skriptfehler' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(failed ? failed + ' Prüfung(en) FEHLGESCHLAGEN' : 'Alles gut: die ganze Stunde zeigt, was sie soll.');
if (SHOTS) console.log('Bilder: ' + SHOT_DIR);
process.exit(failed ? 1 : 0);
