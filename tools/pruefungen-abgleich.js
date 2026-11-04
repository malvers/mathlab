// Do WebUntis and the Stoffverteilungsplan name the same tests? (Doc, 04.11.2026: the BGY 13 pupils read
// "Mini-Test tomorrow" in WebUntis while the plan had moved it to 03.12. - "da muessen wir einen Modus
// operandi finden".) Read-only: nothing is ever written, neither to WebUntis nor to the plan.
//
//   node tools/webuntis.js pruefungen [--tage 14] [--lokal] [--line]
//
// WebUntis side: Doc's own exams via the mobile API (getExams2017 - ids, times and texts, no student fields).
// Plan side: exactly the pills of the timetable - svp-pruefungen.js itself runs here, over the live plan pages
// (docalvers.de, what the pupils see; --lokal reads HTML/ instead), the cloud edits and the local svp_untis
// cache that `webuntis.js status` keeps (06:00/12:30). No second copy of the rules that could drift.
// --line prints one summary line for the 18:00 app ("PRÜFUNGEN: ...") and exits 1 when something differs.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
const SVP = path.join(REPO, 'HTML', 'svp');
const UNTIS_CACHE = path.join(SVP, 'plandaten', 'untis');
const LIVE = 'https://docalvers.de';
const TEACHER_ID = 1581;   // AlvMic

const KIND = { KA: 'Klassenarbeit', KL: 'Klausur', LT: 'Leistungstest' };
const WEEKDAY = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

const ymd = d => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
const dayOf = s => new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
const nice = s => `${WEEKDAY[dayOf(s).getDay()]} ${s.slice(6, 8)}.${s.slice(4, 6)}.`;
const groupKey = v => (Array.isArray(v) ? v : String(v || '').split(/[,_]/)).map(x => x.trim()).filter(Boolean).sort().join('_');
const groupName = k => k.replace(/_/g, '+');

// WebUntis exam type -> the plan's short kind. Only the big tests are KA/KL, everything else
// ("schriftlicher Leistungsnachweis ...") is a Leistungstest, like a Mini-Test on the plan.
function kindOfExam(type) {
    if (/klausur/i.test(type)) return 'KL';
    if (/klassenarbeit|schulaufgabe/i.test(type)) return 'KA';
    return 'LT';
}

// ---------- the plan side: svp-pruefungen.js in a stand-in window ----------

function loadCache() {
    const rows = [];
    const walk = dir => {
        for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
            const p = path.join(dir, f.name);
            if (f.isDirectory()) walk(p);
            else if (f.name.endsWith('.untis.json')) {
                const data = JSON.parse(fs.readFileSync(p, 'utf8'));
                if (data.page && data.weeks) rows.push({ page: data.page, data });
            }
        }
    };
    if (fs.existsSync(UNTIS_CACHE)) walk(UNTIS_CACHE);
    return rows;
}

async function planPills(untis, lokal) {
    const authSrc = fs.readFileSync(path.join(SVP, 'svp-auth.js'), 'utf8');
    const DB_URL = authSrc.match(/DB_URL\s*=\s*'([^']+)'/)[1];
    const DB_KEY = authSrc.match(/DB_KEY\s*=\s*'([^']+)'/)[1];   // publishable key, public by design
    const failed = [];

    const readPage = async url => {
        if (lokal) return fs.readFileSync(path.join(REPO, 'HTML', url.replace(/^\//, '')), 'utf8');
        const res = await fetch(LIVE + url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
        return res.text();
    };
    const win = {
        console,
        fetch: async (url) => {
            const text = await readPage(String(url)).catch(e => { failed.push(e.message); throw e; });
            return { ok: true, text: async () => text, json: async () => JSON.parse(text) };
        },
        // pageData() only looks for the <script> that assigns window.PLAN
        DOMParser: class {
            parseFromString(html) {
                const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => ({ textContent: m[1] }));
                return { scripts };
            }
        },
        svpAuth: {
            DB_URL, DB_KEY,
            hasSession: () => true,
            // svp_untis only Doc's account may read: it comes from the local cache. The cloud edits are public.
            api: async (q) => {
                if (q.startsWith('svp_untis')) return { ok: true, json: async () => untis };
                const res = await fetch(`${DB_URL}/rest/v1/${q}`, { headers: { apikey: DB_KEY } });
                if (!res.ok) failed.push(`${q.split('?')[0]}: HTTP ${res.status}`);
                return res;
            },
        },
    };
    win.window = win;
    vm.createContext(win);
    for (const f of ['svp-woche.js', 'svp-timetable.js', 'svp-termine.js', 'svp-pruefungen.js']) {
        vm.runInContext(fs.readFileSync(path.join(SVP, f), 'utf8'), win, { filename: f });
    }
    const map = JSON.parse(fs.readFileSync(path.join(SVP, 'svp-map.json'), 'utf8'));
    await win.svpPruefungen.load(map.pages);

    // every lesson of the cache asks for its pill, like a timetable tile does
    const out = [];
    for (const row of untis) {
        for (const list of Object.values(row.data.weeks)) {
            for (const e of list) {
                if (e.code === 'cancelled') continue;
                const html = win.svpPruefungen.pill({
                    date: +e.date, startTime: +String(e.start).replace(':', ''), subject: e.subject,
                    classes: String(e.klasse).split(','),
                });
                if (!html) continue;
                const short = (html.match(/tt-pruef (ka|kl|lt)/) || [])[1];
                const title = ((html.match(/title="([^"]*)"/) || [])[1] || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                out.push({ date: String(e.date), start: e.start, group: groupKey(e.klasse), kind: (short || 'lt').toUpperCase(), title, page: row.page });
            }
        }
    }
    return { pills: out, failed };
}

// ---------- compare ----------

// A failure must still say so in the app's line - a silent crash would read as "nothing to report".
async function run(ctx) {
    try {
        await check(ctx);
    } catch (e) {
        console.log(ctx.args.includes('--line') ? `PRÜFUNGEN: Abgleich FEHLGESCHLAGEN (${e.message})` : `Fehler: ${e.message}`);
        process.exitCode = 1;
    }
}

async function check({ intern, rpc, args }) {
    const line = args.includes('--line');
    const lokal = args.includes('--lokal');
    const ti = args.indexOf('--tage');
    const days = ti >= 0 ? Math.max(1, +args[ti + 1] || 14) : 14;

    const today = new Date();
    const from = ymd(today);
    const end = new Date(today); end.setDate(end.getDate() + days);
    const to = ymd(end);
    const iso = s => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

    // WebUntis: Doc's exams. Only whitelisted fields are kept, the response is never printed.
    const r = await intern('getExams2017', { id: TEACHER_ID, type: 'TEACHER', startDate: iso(from), endDate: iso(to) });
    if (r.error) {
        console.log(line ? `PRÜFUNGEN: WebUntis-Abfrage FEHLGESCHLAGEN (${r.error.message})` : `WebUntis: ${r.error.message}`);
        process.exitCode = 1;
        return;
    }
    const klassen = new Map((await rpc('getKlassen')).map(k => [k.id, k.name]));
    const wu = ((r.result && r.result.exams) || []).map(e => ({
        date: String(e.startDateTime).slice(0, 10).replace(/-/g, ''),
        start: String(e.startDateTime).slice(11, 16),
        end: String(e.endDateTime).slice(11, 16),
        group: groupKey((e.klasseIds || []).map(id => klassen.get(id) || String(id))),
        kind: kindOfExam(e.examType || ''),
        title: e.name || '',
        text: e.text || '',
    })).filter(e => e.date >= from && e.date <= to);

    const untis = loadCache();
    const { pills, failed } = await planPills(untis, lokal);

    // the plan: one test per group and day, starting with its first marked lesson
    const plan = new Map();
    for (const p of pills.filter(p => p.date >= from && p.date <= to).sort((a, b) => a.start.localeCompare(b.start))) {
        const k = p.date + '|' + p.group;
        if (!plan.has(k)) plan.set(k, p);
    }
    const wuBy = new Map(wu.map(e => [e.date + '|' + e.group, e]));

    const issues = [];
    for (const [k, e] of wuBy) {
        const p = plan.get(k);
        if (!p) {
            // same test on another day in the plan? then it is a moved test, not a missing one
            const elsewhere = pills.find(x => x.group === e.group && x.kind === e.kind && !wuBy.has(x.date + '|' + x.group) && x.date >= from);
            issues.push(`${groupName(e.group)} ${e.title}: WebUntis ${nice(e.date)} ${e.start}, im Plan ${elsewhere ? nice(elsewhere.date) : 'nicht'}`);
            continue;
        }
        if (p.start !== e.start) issues.push(`${groupName(e.group)} ${nice(e.date)}: WebUntis ${e.start}, Plan ${p.start}`);
        if (p.kind !== e.kind) issues.push(`${groupName(e.group)} ${nice(e.date)}: WebUntis ${KIND[e.kind]}, Plan ${KIND[p.kind]}`);
    }
    for (const [k, p] of plan) {
        if (wuBy.has(k)) continue;
        const reported = issues.some(s => s.startsWith(groupName(p.group) + ' ') && s.includes(nice(p.date)));
        if (!reported) issues.push(`${groupName(p.group)} ${p.title}: Plan ${nice(p.date)} ${p.start}, fehlt in WebUntis`);
    }
    for (const f of failed) issues.push(`Plan nicht lesbar: ${f}`);

    // the next school day: the first day after today with one of Doc's lessons
    const lessonDays = [...new Set(untis.flatMap(u => Object.values(u.data.weeks).flat()
        .filter(e => e.code !== 'cancelled').map(e => String(e.date))))].filter(d => d > from).sort();
    const next = lessonDays[0];
    const tomorrow = ymd(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
    const nextLabel = next === tomorrow ? 'morgen' : next ? nice(next) : '';
    const nextTests = wu.filter(e => e.date === next).sort((a, b) => a.start.localeCompare(b.start))
        .map(e => `${groupName(e.group)} ${e.title} ${e.start}`);
    const nextPart = next ? `${nextLabel}: ${nextTests.length ? nextTests.join(', ') : 'kein Test'}` : '';

    const cacheAge = untis.length ? untis.map(u => u.data.generated || '').sort()[0] : '';

    if (line) {
        const head = issues.length
            ? `PRÜFUNGEN: ${issues.length} ${issues.length === 1 ? 'Abweichung' : 'Abweichungen'} WebUntis ↔ Plan`
            : `PRÜFUNGEN: WebUntis = Plan (${wu.length} Tests bis ${nice(to)})`;
        console.log([head, ...issues, nextPart].filter(Boolean).join(' · '));
        if (issues.length) process.exitCode = 1;
        return;
    }

    console.log(`Prüfungen ${nice(from)} bis ${nice(to)} · Plan ${lokal ? 'lokal' : 'live (docalvers.de)'} · Stundenplan-Stand ${cacheAge || '?'}`);
    const all = [...new Set([...wuBy.keys(), ...plan.keys()])].sort();
    for (const k of all) {
        const e = wuBy.get(k), p = plan.get(k);
        const [d, g] = k.split('|');
        console.log(`${nice(d)}  ${groupName(g).padEnd(16)}  WebUntis: ${e ? `${KIND[e.kind]} „${e.title}“ ${e.start}–${e.end}` : '—'}`.padEnd(86)
            + `  Plan: ${p ? `${KIND[p.kind]} „${p.title}“ ${p.start}` : '—'}`);
    }
    console.log(issues.length ? `\n${issues.length} Abweichung(en):\n- ${issues.join('\n- ')}` : '\nKeine Abweichung.');
    if (nextPart) console.log(`Nächster Schultag, ${nextPart}`);
    if (issues.length) process.exitCode = 1;
}

module.exports = { run };
