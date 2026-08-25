// Timetable optimizer - simulated annealing over lesson blocks.
//
// Runs in two places with the same code:
//   * as a Web Worker from stundenplan.html (postMessage protocol at the bottom)
//   * headless in Node for measuring:  node stundenplan-optimizer.js <week.json> [teacher|all] [iters]
//
// Model
//   block     = consecutive lessons of one teaching unit (double periods move as one)
//   slot      = (day, start minute); candidates come from what the same class set
//               already uses this week - so every branch keeps its own timegrid
//   baseline  = every overlap the plan has today (Kopplungen, group splits) is
//               whitelisted; only HARD person conflicts, impossible site changes
//               and NEWLY created overlaps cost energy
//
// Energy (lower is better)
//   100  hard teacher conflict  - one person in two rooms / two sites at once
//   300  new overlap            - teacher, class or room double-booked that was not before (never worth it)
//   100  site change too tight  - gap between two sites < travel time
//    12  moved block            - keep the proposal a small diff (measured: at 2 the
//                                optimizer reshuffled 1377 blocks chasing idle time)
//   0.2  idle period            - Springstunden of a teacher, per 45 min

(function (root) {
    'use strict';

    const W = { conflict: 100, newOverlap: 300, site: 100, move: 12, gap: 0.2 };

    // Sites (see memory project_ibb_sites_travel): room prefix -> site,
    // roomless lessons fall back to the branch of their class.
    function siteOfRoom(r) {
        if (/^KÖ/.test(r)) return 'KÖ';
        if (/^SMS/.test(r)) return 'SMS';
        if (/^(A|B|C|AK|BK|CFBK|CTMR|Cafeteria|BGR|GrK|GLh|GLv)\d*$/.test(r) || /^[ABC]\d{3}$/.test(r)) return 'Campus';
        if (/^(SHB|Bühlau)/.test(r)) return 'Bühlau';
        if (/^THT/.test(r)) return 'Teutoburger';
        if (/^DSC/.test(r)) return 'DSC';
        if (/^(EACS|ActiveSports|WC|EWCB)/.test(r)) return 'Augsburger';
        if (/^LOS/.test(r)) return 'Söbrigen';
        return null;
    }
    function siteOfClass(c) {
        if (/^(FO[GSW]|FSE)/.test(c)) return 'SMS';
        if (/^(BSW|POD|SAR|BGY)/.test(c)) return 'KÖ';
        if (/^\d/.test(c)) return 'Campus';
        return null;
    }
    function siteOf(l) {
        for (const r of l.rooms) { const s = siteOfRoom(r); if (s) return s; }
        for (const c of l.classes) { const s = siteOfClass(c); if (s) return s; }
        return null;
    }
    // Minutes needed between two sites (Doc, 25.08.2026: SMS<->Campus on foot 20).
    const TRAVEL = { 'SMS|Campus': 20, 'Campus|SMS': 20 };
    const travel = (a, b) => (a === b ? 0 : (TRAVEL[a + '|' + b] ?? 30));

    const toMin = t => Math.floor(t / 100) * 60 + (t % 100);
    const toHHMM = m => Math.floor(m / 60) * 100 + (m % 60);
    const parseYmd = d => new Date(+String(d).slice(0, 4), +String(d).slice(4, 6) - 1, +String(d).slice(6, 8));
    const ymd = d => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    const dayOf = (date, monday) => Math.round((parseYmd(date) - parseYmd(monday)) / 864e5);

    // mulberry32 - reproducible runs
    function rng(seed) {
        let a = seed >>> 0;
        return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    }

    // ---- blocks -----------------------------------------------------------

    function buildBlocks(lessons, monday) {
        const isBanner = l => toMin(l.endTime) - toMin(l.startTime) > 600;
        const unitKey = l => [l.subject, l.classes.join(','), l.teachers.join(','), l.rooms.join(',')].join('#');
        const idx = lessons.map((l, i) => i).filter(i => !isBanner(lessons[i]) && lessons[i].code !== 'cancelled');
        idx.sort((a, b) => lessons[a].date - lessons[b].date || lessons[a].startTime - lessons[b].startTime);
        const blocks = [];
        for (const i of idx) {
            const l = lessons[i];
            const last = blocks[blocks.length - 1];
            if (last && last.key === unitKey(l) && last.date === l.date && Math.abs(toMin(l.startTime) - last.end) <= 5) {
                last.end = toMin(l.endTime); last.idx.push(i); continue;
            }
            blocks.push({ id: blocks.length, key: unitKey(l), date: l.date, day: dayOf(l.date, monday),
                start: toMin(l.startTime), end: toMin(l.endTime), idx: [i],
                teachers: l.teachers, classes: l.classes, rooms: l.rooms, site: siteOf(l),
                classKey: l.classes.join(','), subject: l.subject });
        }
        for (const b of blocks) {
            b.dur = b.end - b.start; b.day0 = b.day; b.start0 = b.start;
            // "A_FuB_Mo", "A_MaF_Di": the weekday is part of the offer - stay on that day
            b.dayLocked = /_(Mo|Di|Mi|Do|Fr)(\b|_|$)/.test(b.subject || '');
        }
        return blocks;
    }

    // Candidate starts: what this class set uses this week (any day), padded
    // with the branch's starts when a class has too few of its own.
    function buildCandidates(blocks) {
        const byClass = new Map(), byBranch = new Map(), endByClass = new Map();
        const branch = ck => siteOfClass(ck.split(',')[0]) || '?';
        for (const b of blocks) {
            if (!byClass.has(b.classKey)) byClass.set(b.classKey, new Set());
            byClass.get(b.classKey).add(b.start);
            endByClass.set(b.classKey, Math.max(endByClass.get(b.classKey) || 0, b.end));
            const br = branch(b.classKey);
            if (!byBranch.has(br)) byBranch.set(br, new Set());
            byBranch.get(br).add(b.start);
        }
        const cand = new Map();
        for (const [ck, starts] of byClass) {
            const s = new Set(starts);
            if (s.size < 4) for (const x of byBranch.get(branch(ck))) s.add(x);
            cand.set(ck, { starts: [...s].sort((a, b) => a - b), maxEnd: endByClass.get(ck) });
        }
        return cand;
    }

    // ---- state / energy ---------------------------------------------------

    function makeState(blocks) {
        const buckets = new Map(); // entity|day -> Set(block ids)
        const key = (kind, e, day) => kind + '|' + e + '|' + day;
        const ents = b => [...b.teachers.map(t => ['T', t]), ...b.classes.map(c => ['C', c]), ...b.rooms.map(r => ['R', r])];
        const add = b => { for (const [k, e] of ents(b)) { const kk = key(k, e, b.day); if (!buckets.has(kk)) buckets.set(kk, new Set()); buckets.get(kk).add(b.id); } };
        const del = b => { for (const [k, e] of ents(b)) buckets.get(key(k, e, b.day))?.delete(b.id); };
        for (const b of blocks) add(b);
        return { buckets, key, ents, add, del };
    }

    const overlaps = (a, b) => a.day === b.day && a.start < b.end && b.start < a.end;
    const pairKey = (a, b) => a.id < b.id ? a.id + ':' + b.id : b.id + ':' + a.id;
    const share = (x, y) => x.some(v => y.includes(v));
    let VIRTUAL = new Set();
    const shareReal = (x, y) => x.some(v => !VIRTUAL.has(v) && y.includes(v));

    function sitesDiffer(a, b) {
        // Same subject for a shared class in two rooms at once = one group spread
        // over neighbouring rooms (measured: one teacher, one subject, two adjacent rooms) - a
        // Kopplung, not a conflict. To be confirmed by Doc (25.08.).
        if (a.subject && a.subject === b.subject && share(a.classes, b.classes)) return false;
        if (a.rooms.length && b.rooms.length) return !share(a.rooms, b.rooms);
        return !!(a.site && b.site && a.site !== b.site);
    }

    // Penalty of one overlapping pair.
    function pairPen(a, b, baseline) {
        const base = baseline.has(pairKey(a, b));
        let pen = 0;
        if (shareReal(a.teachers, b.teachers)) {
            if (sitesDiffer(a, b)) pen += W.conflict; else if (!base) pen += W.newOverlap;
        }
        if (share(a.classes, b.classes) && !base) pen += W.newOverlap;
        if (a.rooms.length && share(a.rooms, b.rooms) && !base) pen += W.newOverlap;
        return pen;
    }

    // Neighbours of a block that overlap it (deduped), via the entity buckets.
    function neighbours(b, blocks, st) {
        const seen = new Set();
        for (const [k, e] of st.ents(b)) {
            const set = st.buckets.get(st.key(k, e, b.day));
            if (!set) continue;
            for (const id of set) if (id !== b.id && !seen.has(id) && overlaps(b, blocks[id])) seen.add(id);
        }
        return seen;
    }

    // Site-change and idle-time terms for one teacher on one day.
    function teacherDayParts(t, day, blocks, st) {
        if (VIRTUAL.has(t)) return { site: 0, gap: 0 };
        const set = st.buckets.get(st.key('T', t, day));
        if (!set || set.size < 2) return { site: 0, gap: 0 };
        const list = [...set].map(id => blocks[id]).sort((a, b) => a.start - b.start);
        let site = 0, gap = 0;
        for (let i = 1; i < list.length; i++) {
            const p = list[i - 1], q = list[i];
            const g = q.start - p.end;
            if (p.site && q.site && p.site !== q.site && g < travel(p.site, q.site)) site += W.site;
            if (g >= 45) gap += W.gap * Math.floor(g / 45);
        }
        return { site, gap };
    }
    function teacherDayPen(t, day, blocks, st) { const p = teacherDayParts(t, day, blocks, st); return p.site + p.gap; }

    // Energy of everything a set of blocks touches: their overlap pairs (each
    // pair once) plus the site/idle terms of their teachers on the given days.
    // Returns { hard, soft }: hard = overlap pairs + impossible site changes,
    // soft = idle periods. Kept apart so "best state" can mean fewest
    // conflicts first (measured 25.08.: by total energy alone, a 0-conflict
    // state with 30 moves lost against 2 conflicts with 2 moves - STOP then
    // handed back the wrong plan).
    function penSet(list, days, blocks, st, baseline) {
        let hard = 0, soft = 0; const seen = new Set(), td = new Set();
        for (const x of list) {
            for (const id of neighbours(x, blocks, st)) {
                const pk = pairKey(x, blocks[id]);
                if (seen.has(pk)) continue; seen.add(pk);
                hard += pairPen(x, blocks[id], baseline);
            }
            for (const t of x.teachers) for (const d of days) td.add(t + '|' + d);
        }
        for (const k of td) {
            const i = k.lastIndexOf('|'), p = teacherDayParts(k.slice(0, i), +k.slice(i + 1), blocks, st);
            hard += p.site; soft += p.gap;
        }
        return { hard, soft };
    }
    const penTotal = p => p.hard + p.soft;
    const movedCost = list => list.reduce((s, b) => s + (b.day !== b.day0 || b.start !== b.start0 ? W.move : 0), 0);

    function localPen(b, blocks, st, baseline) {
        let pen = 0;
        for (const id of neighbours(b, blocks, st)) pen += pairPen(b, blocks[id], baseline);
        for (const t of b.teachers) pen += teacherDayPen(t, b.day, blocks, st);
        return pen;
    }

    function totalEnergy(blocks, st, baseline) {
        let E = 0; const done = new Set();
        for (const b of blocks) {
            for (const id of neighbours(b, blocks, st)) {
                const pk = pairKey(b, blocks[id]);
                if (done.has(pk)) continue; done.add(pk);
                E += pairPen(b, blocks[id], baseline);
            }
            if (b.day !== b.day0 || b.start !== b.start0) E += W.move;
        }
        const tdays = new Set();
        for (const b of blocks) for (const t of b.teachers) tdays.add(t + '|' + b.day);
        for (const td of tdays) { const [t, d] = td.split('|'); E += teacherDayPen(t, +d, blocks, st); }
        return E;
    }

    // Units: lessons (tiles) involved - the same thing the page's staff box counts.
    function counts(blocks, st, baseline) {
        let site = 0, moved = 0;
        const hardSet = new Set(), newSet = new Set();
        for (const b of blocks) {
            for (const id of neighbours(b, blocks, st)) {
                if (id < b.id) continue; // each pair once
                const o = blocks[id];
                if (shareReal(b.teachers, o.teachers) && sitesDiffer(b, o)) { for (const i of b.idx) hardSet.add(i); for (const i of o.idx) hardSet.add(i); }
                else if (!baseline.has(pairKey(b, o)) && (shareReal(b.teachers, o.teachers) || share(b.classes, o.classes) || (b.rooms.length && share(b.rooms, o.rooms)))) { for (const i of b.idx) newSet.add(i); for (const i of o.idx) newSet.add(i); }
            }
            if (b.day !== b.day0 || b.start !== b.start0) moved++;
        }
        const hard = hardSet.size, newOv = newSet.size;
        const tdays = new Set();
        for (const b of blocks) for (const t of b.teachers) tdays.add(t + '|' + b.day);
        for (const td of tdays) {
            const [t, d] = td.split('|');
            const list = [...(st.buckets.get(st.key('T', t, +d)) || [])].map(id => blocks[id]).sort((a, b) => a.start - b.start);
            for (let i = 1; i < list.length; i++) {
                const p = list[i - 1], q = list[i];
                if (p.site && q.site && p.site !== q.site && q.start - p.end < travel(p.site, q.site)) site++;
            }
        }
        return { hard, newOverlap: newOv, site, moved };
    }

    // ---- annealing --------------------------------------------------------

    // A "teacher" with more than 35 lessons a week is not a person but a
    // placeholder account (measured 25.08.: four accounts with 41-82 lessons a
    // week - supervision/self-study entries). Their overlaps are not
    // conflicts. Real staff top out around 30.
    const VIRTUAL_LOAD = 35;
    function virtualTeachers(lessons) {
        const load = {};
        for (const l of lessons) if (l.code !== 'cancelled' && toMin(l.endTime) - toMin(l.startTime) <= 600)
            for (const t of l.teachers) load[t] = (load[t] || 0) + 1;
        // "GTA-…" are Ganztagsangebot providers (three parallel clubs at 15:00 are normal)
        return new Set(Object.keys(load).filter(t => load[t] > VIRTUAL_LOAD || /^GTA-/.test(t)));
    }

    // ---- units: what has to move together ----------------------------------
    // Blocks of the same class that overlap in time are one teaching slot:
    // Kopplungen (LF5-V + LF6-S, same room) and group splits (Ethik | Reli).
    // Measured 25.08.: moving one half alone leaves the other half in the room
    // and blocks every swap - one teacher's Wednesday was unsolvable for that reason.
    function buildUnits(blocks, st) {
        const parent = blocks.map((_, i) => i);
        const find = i => (parent[i] === i ? i : (parent[i] = find(parent[i])));
        for (const b of blocks) for (const id of neighbours(b, blocks, st))
            if (share(b.classes, blocks[id].classes)) parent[find(b.id)] = find(id);
        const groups = new Map();
        for (const b of blocks) { const r = find(b.id); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(b); }
        const units = [];
        for (const members of groups.values()) {
            const u = { id: units.length, members,
                day: members[0].day, start: Math.min(...members.map(b => b.start)), end: Math.max(...members.map(b => b.end)),
                classes: [...new Set(members.flatMap(b => b.classes))].sort(),
                teachers: [...new Set(members.flatMap(b => b.teachers))],
                dayLocked: members.some(b => b.dayLocked) };
            u.dur = u.end - u.start; u.day0 = u.day; u.start0 = u.start;
            u.family = u.classes.join(',');
            for (const b of members) { b.unit = u; b.off = b.start - u.start; }
            units.push(u);
        }
        return units;
    }

    async function optimize(input, onProgress, yieldFn, shouldStop) {
        const { lessons, monday, movableTeachers, iters = 200000, seed = 42 } = input;
        const rand = rng(seed);
        VIRTUAL = virtualTeachers(lessons);
        const blocks = buildBlocks(lessons, monday);
        const cand = buildCandidates(blocks);
        const st = makeState(blocks);

        // whitelist every overlap the plan has today
        const baseline = new Set();
        for (const b of blocks) for (const id of neighbours(b, blocks, st)) baseline.add(pairKey(b, blocks[id]));

        const units = buildUnits(blocks, st);
        // candidate starts of a unit: what any of its classes uses this week
        for (const u of units) {
            const starts = new Set(), ends = [];
            for (const b of u.members) { const c = cand.get(b.classKey); if (c) { c.starts.forEach(x => starts.add(x)); ends.push(c.maxEnd); } }
            u.cand = { starts: [...starts].sort((a, b) => a - b), maxEnd: Math.max(...ends, 0) };
        }
        // who is in trouble at the start: hard conflicts and impossible site changes
        const troubled = new Set();
        for (const b of blocks) {
            for (const id of neighbours(b, blocks, st)) if (shareReal(b.teachers, blocks[id].teachers) && sitesDiffer(b, blocks[id])) troubled.add(b.id);
            for (const t of b.teachers) {
                if (VIRTUAL.has(t)) continue;
                const list = [...(st.buckets.get(st.key('T', t, b.day)) || [])].map(id => blocks[id]).sort((x, y) => x.start - y.start);
                for (let i = 1; i < list.length; i++) {
                    const p = list[i - 1], q = list[i];
                    if (p.site && q.site && p.site !== q.site && q.start - p.end < travel(p.site, q.site)) { troubled.add(p.id); troubled.add(q.id); }
                }
            }
        }

        // Only the neighbourhood of a conflict may move: the troubled units, every
        // unit of their teachers, every unit of their classes (swap partners).
        // Untouched branches (e.g. the Grundschule) therefore stay exactly as
        // they are - measured 25.08.: without this, hot-phase drift left dozens
        // of pointless moves in conflict-free classes.
        const relTeachers = new Set(), relClasses = new Set(), troubledUnits = new Set();
        for (const b of blocks) if (troubled.has(b.id)) {
            troubledUnits.add(b.unit.id);
            for (const t of b.unit.teachers) if (!VIRTUAL.has(t)) relTeachers.add(t);
            for (const c of b.unit.classes) relClasses.add(c);
        }
        const inScope = u => troubledUnits.has(u.id) || u.teachers.some(t => relTeachers.has(t)) || u.classes.some(c => relClasses.has(c));
        const movable = units.filter(u => u.cand.starts.length >= 2 && inScope(u)
            && (!movableTeachers || u.teachers.some(t => movableTeachers.includes(t))));
        const empty = () => ({ blocks, moves: [], E0: 0, E1: 0, counts0: counts(blocks, st, baseline), counts1: counts(blocks, st, baseline), iters: 0, blocks: blocks.length, movable: 0, units: units.length, accepted: 0, swaps: 0 });
        if (!movable.length) return empty();

        const E0 = totalEnergy(blocks, st, baseline);
        const c0 = counts(blocks, st, baseline);
        const hardTotal = () => { let h = 0; const seen = new Set(); for (const b of blocks) { for (const id of neighbours(b, blocks, st)) { const pk = pairKey(b, blocks[id]); if (seen.has(pk)) continue; seen.add(pk); h += pairPen(b, blocks[id], baseline); } }
            const td = new Set(); for (const b of blocks) for (const t of b.teachers) td.add(t + '|' + b.day);
            for (const k of td) { const i = k.lastIndexOf('|'); h += teacherDayParts(k.slice(0, i), +k.slice(i + 1), blocks, st).site; } return h; };
        let E = E0, H = hardTotal(), best = E0, bestH = H, bestPos = units.map(u => [u.day, u.start]);
        const isBetter = () => H < bestH || (H === bestH && E < best);
        const remember = () => { best = E; bestH = H; bestPos = units.map(x => [x.day, x.start]); };
        const T0 = 25, T1 = 0.2;

        const place = (u, day, start) => {
            u.day = day; u.start = start; u.end = start + u.dur;
            for (const b of u.members) { st.del(b); b.day = day; b.start = start + b.off; b.end = b.start + b.dur; st.add(b); }
        };
        const unitPen = u => penTotal(penSet(u.members, [u.day], blocks, st, baseline));
        const unitMovedCost = u => (u.day !== u.day0 || u.start !== u.start0 ? W.move : 0);
        const fits = (u, day, start) => (!u.dayLocked || day === u.day0) && start + u.dur <= u.cand.maxEnd + 45;

        let hot = [];
        const refreshHot = () => { hot = movable.filter(u => unitPen(u) > 0); };
        refreshHot();

        const byFamily = new Map();
        for (const u of movable) { if (!byFamily.has(u.family)) byFamily.set(u.family, []); byFamily.get(u.family).push(u); }
        const movableSet = new Set(movable.map(u => u.id));

        let accepted = 0, swaps = 0, stopped = false, it = 0;

        // One annealing pass; the same code runs the main schedule and, after a
        // STOP, a short quench that lets the hot-phase drift collapse.
        const anneal = async (n, Ta, Tb, stoppable, label) => {
            for (let k = 0; k < n; k++, it++) {
                const T = Ta * Math.pow(Tb / Ta, k / n);
                if (k % 5000 === 0) {
                    refreshHot();
                    if (onProgress) onProgress({ iter: it, E, best, T, hot: hot.length, label,
                        counts: k % 100000 === 0 ? counts(blocks, st, baseline) : undefined });
                    if (yieldFn) await yieldFn();               // let the worker receive messages
                    if (stoppable && shouldStop && shouldStop()) { stopped = true; return; }
                }
                const u = (hot.length && rand() < 0.7) ? hot[Math.floor(rand() * hot.length)] : movable[Math.floor(rand() * movable.length)];

                if (rand() < 0.5) {
                    // --- swap u with a unit of the same class family and length ---
                    const peers = byFamily.get(u.family);
                    if (!peers || peers.length < 2) continue;
                    const v = peers[Math.floor(rand() * peers.length)];
                    if (v === u || v.dur !== u.dur || !movableSet.has(v.id)) continue;
                    if (!fits(u, v.day, v.start) || !fits(v, u.day, u.start)) continue;
                    if (v.day === u.day && v.start === u.start) continue;
                    const days = [...new Set([u.day, v.day])];
                    const list = [...u.members, ...v.members];
                    const pb = penSet(list, days, blocks, st, baseline), mb = unitMovedCost(u) + unitMovedCost(v);
                    const ud = u.day, us = u.start, vd = v.day, vs = v.start;
                    place(u, vd, vs); place(v, ud, us);
                    const pa = penSet(list, days, blocks, st, baseline), ma = unitMovedCost(u) + unitMovedCost(v);
                    const dE = (penTotal(pa) + ma) - (penTotal(pb) + mb);
                    if (dE <= 0 || rand() < Math.exp(-dE / T)) {
                        E += dE; H += pa.hard - pb.hard; accepted++; swaps++;
                        if (isBetter()) remember();
                    } else { place(u, ud, us); place(v, vd, vs); }
                    continue;
                }

                // --- single move of u to a candidate slot ---
                const day = u.dayLocked ? u.day0 : Math.floor(rand() * 5);
                const start = u.cand.starts[Math.floor(rand() * u.cand.starts.length)];
                if (!fits(u, day, start) || (day === u.day && start === u.start)) continue;
                const od = u.day, os = u.start;
                const days = [...new Set([od, day])];
                const pb = penSet(u.members, days, blocks, st, baseline), mb = unitMovedCost(u);
                place(u, day, start);
                const pa = penSet(u.members, days, blocks, st, baseline), ma = unitMovedCost(u);
                const dE = (penTotal(pa) + ma) - (penTotal(pb) + mb);
                if (dE <= 0 || rand() < Math.exp(-dE / T)) {
                    E += dE; H += pa.hard - pb.hard; accepted++;
                    if (isBetter()) remember();
                } else { place(u, od, os); }
            }
        };

        await anneal(iters, T0, T1, true, 'Optimieren');
        if (stopped) {
            // quench from the CURRENT state: drift collapses, conflicts stay fixed
            await anneal(300000, 1.5, 0.2, false, 'Abkühlen');
        }
        // restore best
        units.forEach((u, i) => { if (u.day !== bestPos[i][0] || u.start !== bestPos[i][1]) place(u, bestPos[i][0], bestPos[i][1]); });

        // Homecoming: a unit that drifted at high temperature goes back to its
        // original slot whenever that does not make things worse. Trims the diff.
        for (let round = 0; round < 3; round++) {
            let changed = false;
            for (const u of movable) {
                if (u.day === u.day0 && u.start === u.start0) continue;
                const od = u.day, os = u.start, days = [...new Set([od, u.day0])];
                const before = penTotal(penSet(u.members, days, blocks, st, baseline));
                place(u, u.day0, u.start0);
                const after = penTotal(penSet(u.members, days, blocks, st, baseline));
                if (after - before - W.move <= 0) changed = true; else place(u, od, os);
            }
            if (!changed) break;
        }

        // Greedy repair: each penalised movable unit takes its best slot if that
        // strictly lowers energy - mops up what the random walk left behind.
        for (let round = 0; round < 3; round++) {
            let improved = false;
            for (const u of movable) {
                if (unitPen(u) <= 0) continue;
                const od = u.day, os = u.start;
                let bestD = od, bestS = os, bestGain = 0;
                for (let day = 0; day < 5; day++) for (const start of u.cand.starts) {
                    if (!fits(u, day, start) || (day === od && start === os)) continue;
                    const days = [...new Set([od, day])];
                    const before = penTotal(penSet(u.members, days, blocks, st, baseline)) + unitMovedCost(u);
                    place(u, day, start);
                    const dE = penTotal(penSet(u.members, days, blocks, st, baseline)) + unitMovedCost(u) - before;
                    place(u, od, os);
                    if (dE < bestGain) { bestGain = dE; bestD = day; bestS = start; }
                }
                if (bestGain < 0) { place(u, bestD, bestS); improved = true; }
            }
            if (!improved) break;
        }

        const E1 = totalEnergy(blocks, st, baseline);
        const c1 = counts(blocks, st, baseline);

        const mon = parseYmd(monday);
        const movedBlocks = blocks.filter(b => b.day !== b.day0 || b.start !== b.start0);
        const moves = movedBlocks.map(b => {
            const d = new Date(mon); d.setDate(mon.getDate() + b.day);
            // why: it was in a conflict itself, or it made room for a block that was
            let reason = troubled.has(b.id) ? 'löst eigenen Konflikt' : 'räumt Platz frei';
            const partner = movedBlocks.find(o => o !== b && share(o.classes, b.classes) && o.day === b.day0 && o.start === b.start0);
            if (partner && !troubled.has(b.id)) reason = 'Tauschpartner für ' + partner.teachers.join(',') + ' ' + (partner.subject || '');
            else if (!troubled.has(b.id) && b.unit.members.some(m => troubled.has(m.id))) reason = 'gekoppelt mit ' + b.unit.members.find(m => troubled.has(m.id)).teachers.join(',') + ' (gleiche Einheit)';
            return { idx: b.idx, subject: b.subject, classes: b.classes, teachers: b.teachers, rooms: b.rooms, reason,
                from: { date: b.date, start: toHHMM(b.start0), end: toHHMM(b.start0 + b.dur) },
                to: { date: ymd(d), start: toHHMM(b.start), end: toHHMM(b.end) } };
        });
        // conflict-solving moves first, helpers after
        moves.sort((a, b) => (a.reason.startsWith('löst') ? 0 : 1) - (b.reason.startsWith('löst') ? 0 : 1));
        return { moves, E0, E1, counts0: c0, counts1: c1, iters: it, stopped, blocks: blocks.length, movable: movable.length, units: units.length, accepted, swaps };
    }

    // ---- manual planning (Planungsdialog) ------------------------------------
    // For one lesson: its unit (what moves with it) and every candidate slot,
    // each marked ok / not ok with human-readable reasons - the green/red
    // feasibility colouring Untis shows while you drag.
    function feasibility(lessons, monday, lessonIndex) {
        VIRTUAL = virtualTeachers(lessons);
        const blocks = buildBlocks(lessons, monday);
        const cand = buildCandidates(blocks);
        const st = makeState(blocks);
        const baseline = new Set();
        for (const b of blocks) for (const id of neighbours(b, blocks, st)) baseline.add(pairKey(b, blocks[id]));
        buildUnits(blocks, st);
        const b0 = blocks.find(x => x.idx.includes(lessonIndex));
        if (!b0) return null;
        const u = b0.unit;
        const starts = new Set(); let maxEnd = 0;
        for (const m of u.members) { const c = cand.get(m.classKey); if (c) { c.starts.forEach(x => starts.add(x)); maxEnd = Math.max(maxEnd, c.maxEnd); } }
        const place = (day, start) => {
            u.day = day; u.start = start; u.end = start + u.dur;
            for (const m of u.members) { st.del(m); m.day = day; m.start = start + m.off; m.end = m.start + m.dur; st.add(m); }
        };
        const who = (m, o) => {
            const t = m.teachers.find(x => !VIRTUAL.has(x) && o.teachers.includes(x));
            if (t && sitesDiffer(m, o)) return t + ' ist dann in ' + (o.rooms.join(',') || 'einem anderen Raum') + ': ' + (o.subject || '') + ' ' + o.classes.join(',');
            if (t) return t + ' hat dann schon ' + (o.subject || '') + ' ' + o.classes.join(',');
            const c = m.classes.find(x => o.classes.includes(x));
            if (c) return 'Klasse ' + c + ' hat dann ' + (o.subject || '') + (o.teachers.length ? ' bei ' + o.teachers.join(',') : '');
            const r = m.rooms.find(x => o.rooms.includes(x));
            if (r) return 'Raum ' + r + ' ist belegt: ' + (o.subject || '') + ' ' + o.classes.join(',');
            return null;
        };
        const od = u.day, os = u.start;
        const mon = parseYmd(monday);
        const out = [];
        for (let day = 0; day < 5; day++) for (const start of starts) {
            if (day === od && start === os) continue;
            if (u.dayLocked && day !== u.day0) continue;
            if (start + u.dur > maxEnd + 45) continue;
            place(day, start);
            const reasons = new Set(); let bad = false;
            for (const m of u.members) for (const id of neighbours(m, blocks, st)) {
                if (pairPen(m, blocks[id], baseline) > 0) { bad = true; const r = who(m, blocks[id]); if (r) reasons.add(r); }
            }
            for (const t of u.teachers) if (teacherDayParts(t, day, blocks, st).site > 0) { bad = true; reasons.add(t + ': Standortwechsel zu knapp'); }
            place(od, os);
            const d = new Date(mon); d.setDate(mon.getDate() + day);
            out.push({ day, start, date: ymd(d), ok: !bad, reasons: [...reasons] });
        }
        return {
            idx: u.members.flatMap(m => m.idx), dur: u.dur, day: od, start: os, date: b0.date,
            subject: b0.subject, classes: u.classes, teachers: u.teachers, rooms: [...new Set(u.members.flatMap(m => m.rooms))],
            candidates: out,
        };
    }

    // Swap partners for one lesson's unit: units of the same class family and
    // length; each checked as a full exchange of slots (both directions).
    function swapOptions(lessons, monday, lessonIndex) {
        VIRTUAL = virtualTeachers(lessons);
        const blocks = buildBlocks(lessons, monday);
        const st = makeState(blocks);
        const baseline = new Set();
        for (const b of blocks) for (const id of neighbours(b, blocks, st)) baseline.add(pairKey(b, blocks[id]));
        const units = buildUnits(blocks, st);
        const b0 = blocks.find(x => x.idx.includes(lessonIndex));
        if (!b0) return [];
        const u = b0.unit;
        const place = (x, day, start) => {
            x.day = day; x.start = start; x.end = start + x.dur;
            for (const m of x.members) { st.del(m); m.day = day; m.start = start + m.off; m.end = m.start + m.dur; st.add(m); }
        };
        const mon = parseYmd(monday);
        const out = [];
        for (const v of units) {
            if (v === u || v.family !== u.family || v.dur !== u.dur) continue;
            if ((u.dayLocked && v.day !== u.day0) || (v.dayLocked && u.day !== v.day0)) continue;
            const ud = u.day, us = u.start, vd = v.day, vs = v.start;
            place(u, vd, vs); place(v, ud, us);
            const reasons = new Set(); let bad = false;
            for (const x of [u, v]) {
                for (const m of x.members) for (const id of neighbours(m, blocks, st)) {
                    const o = blocks[id];
                    if (pairPen(m, o, baseline) > 0) {
                        bad = true;
                        const t = m.teachers.find(y => !VIRTUAL.has(y) && o.teachers.includes(y));
                        reasons.add(t ? t + ' kollidiert mit ' + (o.subject || '') + ' ' + o.classes.join(',') : 'Raum/Klasse belegt: ' + (o.subject || '') + ' ' + o.classes.join(','));
                    }
                }
                for (const t of x.teachers) if (teacherDayParts(t, x.day, blocks, st).site > 0) { bad = true; reasons.add(t + ': Standortwechsel zu knapp'); }
            }
            place(u, ud, us); place(v, vd, vs);
            const d = new Date(mon); d.setDate(mon.getDate() + v.day);
            const lead = v.members[0];
            out.push({ idx: v.members.flatMap(m => m.idx), day: v.day, start: v.start, date: ymd(d), dur: v.dur,
                subject: lead.subject, teachers: v.teachers, classes: v.classes, rooms: [...new Set(v.members.flatMap(m => m.rooms))],
                ok: !bad, reasons: [...reasons] });
        }
        return out.sort((a, b) => (b.ok ? 1 : 0) - (a.ok ? 1 : 0) || a.day - b.day || a.start - b.start);
    }

    // Apply a move list to a lesson array (returns a new array).
    function applyMoves(lessons, moves) {
        const out = lessons.map(l => ({ ...l }));
        for (const m of moves) {
            const shift = toMin(m.to.start) - toMin(m.from.start);
            for (const i of m.idx) {
                const l = out[i];
                l.date = m.to.date;
                l.startTime = toHHMM(toMin(l.startTime) + shift);
                l.endTime = toHHMM(toMin(l.endTime) + shift);
                l.moved = true;
            }
        }
        return out;
    }

    const api = { optimize, applyMoves, siteOf, travel, virtualTeachers, feasibility, swapOptions, toHHMM, _internals: { buildBlocks, buildCandidates, makeState, neighbours, overlaps, sitesDiffer, share, setVirtual: v => { VIRTUAL = v; } } };

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    // Only inside a real Worker - on the page this file just exposes the API
    // (window.onmessage must stay untouched).
    if (typeof WorkerGlobalScope !== 'undefined' && typeof self !== 'undefined' && self instanceof WorkerGlobalScope) {
        let stopRequested = false;
        self.onmessage = e => {
            if (e.data && e.data.cmd === 'stop') { stopRequested = true; return; }
            stopRequested = false;
            optimize(e.data, p => self.postMessage({ type: 'progress', ...p }),
                () => new Promise(r => setTimeout(r, 0)), () => stopRequested)
                .then(r => self.postMessage({ type: 'done', ...r }));
        };
    }
    root.TimetableOptimizer = api;
})(typeof self !== 'undefined' ? self : globalThis);

// ---- headless run -----------------------------------------------------------
if (typeof require !== 'undefined' && require.main === module) {
    const fs = require('fs');
    const [file, who = 'all', iters = '200000'] = process.argv.slice(2);
    const week = JSON.parse(fs.readFileSync(file, 'utf8'));
    const t0 = Date.now();
    module.exports.optimize({ lessons: week.lessons, monday: String(week.week.from),
        movableTeachers: who === 'all' ? null : [who], iters: +iters },
        p => process.stderr.write(`\r  ${p.iter}  E=${p.E}  best=${p.best}  T=${p.T.toFixed(1)}  hot=${p.hot}   `)).then(r => {
    process.stderr.write('\n');
    console.log(`Blöcke ${r.blocks}, beweglich ${r.movable}, ${r.iters} Züge in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    console.log('vorher :', JSON.stringify(r.counts0), 'E=' + r.E0);
    console.log('nachher:', JSON.stringify(r.counts1), 'E=' + r.E1);
    const hh = t => String(t).padStart(4, '0').replace(/(..)(..)/, '$1:$2');
    for (const m of r.moves.slice(0, 25))
        console.log(`  ${m.teachers.join(',')} ${m.subject} [${m.classes}] ${m.rooms}: ${m.from.date} ${hh(m.from.start)}-${hh(m.from.end)} -> ${m.to.date} ${hh(m.to.start)}-${hh(m.to.end)}`);
    if (r.moves.length > 25) console.log(`  ... ${r.moves.length - 25} weitere`);
    });
}
