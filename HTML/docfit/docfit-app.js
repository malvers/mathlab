/*
 * DocFit on the web - the app's screens in the browser (Doc, 20.11.2026: "DocFit im Web = identisch zum Phone"):
 * Stoppuhr (exercise chips, Start / Stopp / Reset, the times), Waage (person switch, the newest weigh-in with its
 * tiles, range bars and fitness score, the weigh-ins with waist and hip), Blutdruck (typed-in readings with the ESH
 * category), Blutzucker (typed-in values, mg/dL and mmol/L side by side, with their context), the fasting mode (a
 * banner while a fast runs, a card per fast with the day's weight, fasting glucose and blood pressure, the weight
 * against earlier fasts), and the gear: Fasten, colour scheme, people, profile, method, account.
 * Numbers and readings come from docfit-core.js (the app's formulas, checked against the app's test values), the data
 * from docfit-data.js (the same private tables the phone syncs to). Voice control and the scale over Web Bluetooth are
 * the next steps (concept: konzept-web.html).
 */
(() => {
    'use strict';
    const C = window.DocFitCore, D = window.DocFitData, auth = window.svpAuth;
    const $ = id => document.getElementById(id);
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const X = '<svg viewBox="0 -960 960 960" aria-hidden="true"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>';
    const LS = { tab: 'docfit-web-tab', kind: 'docfit-web-kind', run: 'docfit-web-run', last: 'docfit-web-last', person: 'docfit-web-person' };
    const ls = {
        get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
        set(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { } }
    };
    const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const hexRgb = h => { const m = /^#?([0-9a-f]{6})$/i.exec(h); const n = m ? parseInt(m[1], 16) : 0; return [n >> 16, (n >> 8) & 255, n & 255]; };
    const rgb = a => `rgb(${a[0]}, ${a[1]}, ${a[2]})`;

    let tab = ls.get(LS.tab, 'watch');
    let kind = C.KINDS.includes(ls.get(LS.kind, '')) ? ls.get(LS.kind, '') : C.KINDS[0];
    let runStart = +ls.get(LS.run, 0) || 0;
    let last = null;   // the last stopped run { start, duration }, shown until the next start or a reset
    try { last = JSON.parse(ls.get(LS.last, 'null')); } catch (e) { last = null; }
    let person = +ls.get(LS.person, 0) || 0;
    let tick = null;

    // ---- small helpers --------------------------------------------------------------------------------------------

    function zoneColor(s) {
        const z = s ? s.zone() : null;
        if (!z) return 'var(--text)';
        return z === 'GOOD' ? 'var(--phi)' : z === 'BORDER' ? 'var(--s-mid)' : 'var(--alarm)';
    }
    const zoneVar = z => (z === 'GOOD' ? 'var(--s-high)' : z === 'BORDER' ? 'var(--s-mid)' : 'var(--s-low)');

    /** the small range bar of a tile (RangeBar.java): zones, the value's own full, the others faded, a round marker */
    function bar(s) {
        if (!s) return '<svg class="bar" viewBox="0 0 100 12" preserveAspectRatio="none"></svg>';
        const cur = s.zone(), inset = 5, w = 100 - 2 * inset, gap = 1.2;
        let out = '';
        s.bands.forEach((b, i) => {
            const x0 = inset + s.at(b.from) * w + (i === 0 ? 0 : gap / 2);
            const x1 = inset + s.at(b.to) * w - (i === s.bands.length - 1 ? 0 : gap / 2);
            if (x1 <= x0) return;
            out += `<rect x="${x0.toFixed(2)}" y="4" width="${(x1 - x0).toFixed(2)}" height="4" rx="2" fill="${zoneVar(b.zone)}" opacity="${!cur || cur === b.zone ? 1 : .43}"/>`;
        });
        let mark = '';
        if (s.hasValue()) {
            const x = inset + s.at(s.value) * w;
            mark = `<span style="position:absolute;left:${x}%;top:50%;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;background:var(--text);border:2px solid var(--card)"></span>`;
        }
        return `<span style="position:relative;display:block"><svg class="bar" viewBox="0 0 100 12" preserveAspectRatio="none">${out}</svg>${mark}</span>`;
    }

    let undoT = null;
    function offerUndo(text, undo) {
        $('undoText').textContent = text;
        $('undo').hidden = false;
        $('undoBtn').onclick = () => { $('undo').hidden = true; clearTimeout(undoT); undo(); };
        clearTimeout(undoT);
        undoT = setTimeout(() => { $('undo').hidden = true; }, 6000);
    }

    /** a dialog in the page's colours: title, body HTML, wired by the caller */
    function dialog(title, html) {
        const d = $('dlg');
        $('dlgBody').innerHTML = `<h3><span>${esc(title)}</span><button type="button" class="x" data-close aria-label="Schließen">${X}</button></h3>${html}`;
        $('dlgBody').querySelectorAll('[data-close]').forEach(b => { b.onclick = () => d.close(); });
        if (!d.open) d.showModal();
        return $('dlgBody');
    }
    $('dlg').addEventListener('click', e => { if (e.target === $('dlg')) $('dlg').close(); });

    function people() {
        return [0, 1].map(i => D.profile(i)).map((p, i) => Object.assign(p, { i }));
    }
    function activePeople() {
        const ps = people().filter(p => p.active);
        return ps.length ? ps : [people()[0]];
    }
    function personChips(box, onPick) {
        const on = activePeople();
        if (!on.some(p => p.i === person)) person = on[0].i;
        box.innerHTML = '';
        box.hidden = on.length < 2;
        for (const p of on) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip person' + (p.i === person ? ' on' : '');
            b.textContent = p.name;
            b.onclick = () => { person = p.i; ls.set(LS.person, String(person)); onPick(); };
            box.appendChild(b);
        }
    }

    // ---- tabs -----------------------------------------------------------------------------------------------------

    function showTab(t) {
        tab = ['watch', 'scale', 'bp', 'glucose', 'fast'].includes(t) ? t : 'watch';
        if (tab !== 'fast') ls.set(LS.tab, tab);   // the fasting view is opened, not a tab of its own
        document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
        document.querySelectorAll('[data-page]').forEach(s => { s.hidden = s.dataset.page !== tab; });
        render();
    }
    document.querySelectorAll('#tabs button').forEach(b => { b.onclick = () => showTab(b.dataset.tab); });

    // ---- Stoppuhr -------------------------------------------------------------------------------------------------

    function renderKinds() {
        const box = $('kinds');
        box.innerHTML = '';
        C.KINDS.forEach(k => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip kind' + (k === kind ? ' on' : '');   // grey, chosen phi green (Doc, 21.11.2026)
            b.textContent = k;
            b.onclick = () => { kind = k; ls.set(LS.kind, k); renderKinds(); };
            box.appendChild(b);
        });
    }

    function renderWatch() {
        const running = runStart > 0;
        const el = $('digits');
        const shown = running ? Date.now() - runStart : last ? last.duration : 0;
        CyberClock.digits(el, C.Times.duration(shown));
        el.classList.toggle('run', running);
        el.classList.toggle('stopped', !running && !!last);
        $('startBtn').disabled = running;
        $('stopBtn').disabled = !running;
        $('resetBtn').disabled = running || !last;
        $('say').hidden = true;   // "DocFit Start" / "DocFit Stopp" once the browser listens (next step)
        if (running && !tick) tick = setInterval(renderWatch, 250);
        if (!running && tick) { clearInterval(tick); tick = null; }
    }

    function renderRuns() {
        const box = $('runs');
        const list = D.list('run');
        box.innerHTML = list.length ? '' : '<li class="empty">Noch keine Zeiten.</li>';
        for (const r of list) {
            const li = document.createElement('li');
            li.className = 'row';
            // the exercise as plain text in front of the start time (Doc, 21.11.2026: no colour in the list)
            const start = 'Start ' + C.Times.clock(r.started_at) + ' Uhr';
            const sub = (r.kind ? esc(r.kind) + ' · ' : '') + start;
            li.innerHTML = `<div class="when"><b>${C.Times.day(r.started_at)}</b><span>${sub}</span></div>`
                + `<div class="num">${C.Times.duration(r.duration_ms)}</div>`
                + `<button type="button" class="x" aria-label="Löschen">${X}</button>`;
            li.querySelector('.x').onclick = () => {
                const gone = D.remove('run', r.started_at);
                if (last && last.start === r.started_at) { last = null; ls.set(LS.last, null); }
                offerUndo('Gelöscht: ' + C.Times.duration(r.duration_ms), () => D.put('run', gone));
            };
            box.appendChild(li);
        }
    }

    $('startBtn').onclick = () => {
        if (runStart) return;
        runStart = Date.now();
        last = null;
        ls.set(LS.run, String(runStart));
        ls.set(LS.last, null);
        renderWatch();
    };
    $('stopBtn').onclick = () => {
        if (!runStart) return;
        const duration = Date.now() - runStart;
        D.put('run', { started_at: runStart, duration_ms: duration, kind });
        last = { start: runStart, duration };
        runStart = 0;
        ls.set(LS.run, null);
        ls.set(LS.last, JSON.stringify(last));
        renderWatch();
    };
    $('resetBtn').onclick = () => {
        last = null;
        ls.set(LS.last, null);
        renderWatch();
    };

    // ---- Waage ----------------------------------------------------------------------------------------------------

    const TILES = [
        ['fat', 'KÖRPERFETT'], ['water', 'WASSER'], ['muscle', 'MUSKEL · SCHÄTZUNG'], ['bmi', 'BMI'],
        ['waist', 'BAUCH'], ['whtr', 'BAUCH/GRÖSSE'], ['hip', 'HÜFTE'], ['whr', 'BAUCH/HÜFTE']
    ];

    function weighList() {
        return D.list('weighing', r => r.person === person);
    }
    const asW = r => ({ time: r.measured_at, centiKg: r.centi_kg, ohm: r.ohm || 0, waistMm: r.waist_mm || 0, hipMm: r.hip_mm || 0 });

    /** what each tile shows for the newest weigh-in - MainActivity.refreshScale / showGirths */
    function tileValues(w, p) {
        const t = {};
        const show = (text, s) => ({ text, scale: s && s.hasValue() ? s : null, note: s && s.hasValue() ? s.note : '' });
        const offer = what => ({ text: '–', scale: null, note: what, offer: what.startsWith('+') });
        if (!w) { for (const [k] of TILES) t[k] = show('–', null); return t; }
        const bc = C.body(w, p);
        const age = C.Profile.ageIn(p, new Date(w.time).getFullYear());
        t.fat = bc.fatImplausible
            ? { text: C.Times.one(bc.fatPercent, '%'), scale: null, note: 'unplausibel – bitte wiederholen', warn: true }
            : show(C.Times.one(bc.fatPercent, '%'), C.Ranges.fat(bc.fatPercent, p.sex, age));
        t.water = show(C.Times.one(bc.waterPercent, '%'), C.Ranges.water(bc.waterPercent, p.sex));
        t.muscle = show(C.Times.one(bc.muscleKg, 'kg'), C.Ranges.muscle(bc.muscleKg, p.heightCm, p.sex));
        t.bmi = show(C.Times.one(bc.bmi, ''), Number.isNaN(bc.bmi) ? null : C.Ranges.bmi(bc.bmi));
        t.waist = w.waistMm > 0 ? show(C.Girths.cm(w.waistMm), C.Ranges.waist(w.waistMm, p.sex)) : offer('+ Bauch eintragen');
        t.hip = w.hipMm > 0 ? Object.assign(show(C.Girths.cm(w.hipMm), null), { note: 'für Bauch/Hüfte' }) : offer('+ Hüfte eintragen');
        const whtr = C.Girths.waistToHeight(w.waistMm, p.heightCm);
        t.whtr = whtr > 0 ? show(C.Girths.ratio(whtr), C.Ranges.waistToHeight(whtr))
            : offer(w.waistMm > 0 ? 'Größe im Profil fehlt' : '+ Bauch eintragen');
        const whr = C.Girths.waistToHip(w.waistMm, w.hipMm);
        t.whr = whr > 0 ? show(C.Girths.ratio(whr), C.Ranges.waistToHip(whr, p.sex))
            : offer(w.waistMm > 0 ? '+ Hüfte eintragen' : '+ Bauch eintragen');
        return t;
    }

    function renderScale() {
        personChips($('scalePersons'), renderScale);
        const p = D.profile(person);
        const list = weighList();
        const newest = list[0] ? asW(list[0]) : null;
        $('whenLabel').textContent = newest ? C.ScaleTexts.when(newest) : 'NOCH KEINE MESSUNG';
        const wd = $('weightDigits');
        if (newest) {
            wd.innerHTML = '<span class="dg"></span><span style="font-family:var(--display);font-weight:700;font-size:20px;margin-left:8px;color:var(--accent)">kg</span>';
            // the widget sets its own defaults on its element, so the look goes in per call
            CyberClock.digits(wd.querySelector('.dg'), C.fmt(newest.centiKg / 100, 2),
                { style: { size: '44px', color: 'var(--accent)', digitWidth: '.74em', sepWidth: '.2em' } });
        } else {
            wd.innerHTML = '<span style="font-family:var(--display);font-size:36px;color:var(--muted)">–</span>';
        }
        const vals = tileValues(newest, p);
        $('tiles').innerHTML = TILES.map(([k, label]) => {
            const v = vals[k];
            const color = v.warn ? 'var(--s-mid)' : v.offer ? 'var(--muted)' : v.scale ? zoneColor(v.scale) : 'var(--text)';
            return `<div class="tile" data-k="${k}"><span class="label">${label}</span>`
                + `<div class="tile-v" style="color:${color}">${esc(v.text)}</div>${bar(v.scale)}`
                + `<div class="note${v.offer ? ' offer' : ''}" style="${v.warn ? 'color:var(--s-mid)' : ''}">${esc(v.note || '')}</div></div>`;
        }).join('');
        $('tiles').querySelectorAll('.tile').forEach(el => {
            el.onclick = () => {
                if (!newest) return;
                const k = el.dataset.k, v = vals[k];
                if (v.offer || ((k === 'waist' || k === 'hip') && !v.scale && v.text === '–')) editGirths(list[0]);
                else openInfo(k, label(k));
            };
        });
        $('weightPill').onclick = () => { if (newest) openInfo('weight', 'GEWICHT'); };

        // fitness 1-10
        const fit = newest ? C.score(newest, p) : null;
        $('fitness').hidden = !newest;
        if (fit) {
            const lowC = hexRgb(css('--s-low')), midC = hexRgb(css('--s-mid')), highC = hexRgb(css('--s-high'));
            $('segs').innerHTML = Array.from({ length: 10 }, (_, i) =>
                `<i class="${fit.score > 0 && i < fit.score ? 'on' : ''}" style="background:${rgb(C.scoreColor(i + 1, lowC, midC, highC))}"></i>`).join('');
            const col = fit.score > 0 ? rgb(C.scoreColor(fit.score, lowC, midC, highC)) : 'var(--muted)';
            $('scoreN').textContent = fit.score > 0 ? fit.score : '';
            $('scoreN').style.color = col;
            $('scoreW').textContent = fit.score > 0 ? C.word(fit.score) : fit.text;
            $('scoreW').style.color = fit.score > 0 ? col : 'var(--muted)';
            $('segs').hidden = fit.score === 0;
        }
        const note = C.ScaleTexts.note(newest, p);
        $('scaleNote').textContent = note;
        $('scaleNote').classList.toggle('warn', !!newest && C.Profile.complete(p) && newest.centiKg > 0 && !C.isMeasured(newest.ohm));
        $('scaleTitle').textContent = 'MESSUNGEN · ' + p.name.toUpperCase();

        const box = $('weighings');
        box.innerHTML = list.length ? '' : '<li class="empty">Noch keine Wiegung – gewogen wird mit dem Phone (Waage am Mac kommt).</li>';
        for (const r of list) {
            const w = asW(r);
            const bc = C.body(w, p);
            const fat = !C.isMeasured(w.ohm) ? 'nur Gewicht' : bc.fatImplausible ? 'Fett unplausibel' : 'Fett ' + C.Times.one(bc.fatPercent, '%');
            const girth = [w.waistMm ? 'Bauch ' + C.Girths.cm(w.waistMm) : '', w.hipMm ? 'Hüfte ' + C.Girths.cm(w.hipMm) : ''].filter(Boolean).join(' · ');
            const li = document.createElement('li');
            li.className = 'row tap';
            li.innerHTML = `<div class="when"><b>${C.Times.day(w.time)} · ${C.Times.clock(w.time)}</b><span>${esc(fat)}${girth ? ' · ' + esc(girth) : ''}</span></div>`
                + `<div class="num">${C.Times.kg(w.centiKg / 100)}</div>`
                + `<button type="button" class="x" aria-label="Löschen">${X}</button>`;
            li.onclick = e => { if (!e.target.closest('.x')) editGirths(r); };
            li.querySelector('.x').onclick = () => {
                const gone = D.remove('weighing', r.measured_at);
                offerUndo('Gelöscht: ' + C.Times.kg(r.centi_kg / 100), () => D.put('weighing', gone));
            };
            box.appendChild(li);
        }
    }
    const label = k => (TILES.find(t => t[0] === k) || [k, k])[1];

    /** waist and hip of one weigh-in (and moving it to the other person) */
    function editGirths(r) {
        if (!r) return;
        const other = people().find(p => p.i !== r.person && p.active);
        const body = dialog('Bauch und Hüfte', `
            <p>${C.Times.day(r.measured_at)} · ${C.Times.clock(r.measured_at)} Uhr · ${C.Times.kg(r.centi_kg / 100)}</p>
            <div class="two">
              <label class="fld"><span class="label">BAUCHUMFANG IN CM</span><input id="gWaist" inputmode="decimal" value="${C.Girths.field(r.waist_mm || 0)}"></label>
              <label class="fld"><span class="label">HÜFTUMFANG IN CM</span><input id="gHip" inputmode="decimal" value="${C.Girths.field(r.hip_mm || 0)}"></label>
            </div>
            <p>Bauch: in Höhe des Nabels, locker ausgeatmet. Hüfte: an der breitesten Stelle des Gesäßes.</p>
            <div class="err" id="gErr"></div>
            <div class="acts">${other ? `<button type="button" id="gMove">Zu ${esc(other.name)}</button>` : ''}<button type="button" data-close>Abbrechen</button><button type="button" class="main" id="gSave">Speichern</button></div>`);
        body.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => $('dlg').close(); });
        $('gSave').onclick = () => {
            const wm = C.Girths.parseMm($('gWaist').value), hm = C.Girths.parseMm($('gHip').value);
            if (wm < 0 || hm < 0) { $('gErr').textContent = 'Bitte in cm zwischen 50 und 200, z. B. 94,5.'; return; }
            D.put('weighing', Object.assign({}, r, { waist_mm: wm || null, hip_mm: hm || null }));
            $('dlg').close();
        };
        if (other) $('gMove').onclick = () => {
            const before = Object.assign({}, r);
            D.put('weighing', Object.assign({}, r, { person: other.i }));
            $('dlg').close();
            offerUndo('Verschoben zu ' + other.name, () => D.put('weighing', before));
        };
        $('gWaist').focus();
    }

    /** a tile's sheet: value and word, the zones, the course over all weigh-ins (TileInfo / HistoryChart, short) */
    function openInfo(k, title) {
        const p = D.profile(person);
        const list = weighList().slice().reverse();   // oldest first
        const point = r => {
            const w = asW(r), bc = C.body(w, p), age = C.Profile.ageIn(p, new Date(w.time).getFullYear());
            switch (k) {
                case 'weight': return { v: w.centiKg / 100, s: C.Ranges.weight(w.centiKg / 100, p.heightCm) };
                case 'fat': return { v: bc.fatImplausible ? NaN : bc.fatPercent, s: C.Ranges.fat(bc.fatPercent, p.sex, age) };
                case 'water': return { v: bc.waterPercent, s: C.Ranges.water(bc.waterPercent, p.sex) };
                case 'muscle': return { v: bc.muscleKg, s: C.Ranges.muscle(bc.muscleKg, p.heightCm, p.sex) };
                case 'bmi': return { v: bc.bmi, s: Number.isNaN(bc.bmi) ? null : C.Ranges.bmi(bc.bmi) };
                case 'waist': return { v: w.waistMm ? w.waistMm / 10 : NaN, s: C.Ranges.waist(w.waistMm, p.sex) };
                case 'hip': return { v: w.hipMm ? w.hipMm / 10 : NaN, s: null };
                case 'whtr': { const h = C.Girths.waistToHeight(w.waistMm, p.heightCm); return { v: h ? h / 100 : NaN, s: C.Ranges.waistToHeight(h) }; }
                case 'whr': { const h = C.Girths.waistToHip(w.waistMm, w.hipMm); return { v: h ? h / 100 : NaN, s: C.Ranges.waistToHip(h, p.sex) }; }
            }
            return { v: NaN, s: null };
        };
        const pts = list.map(r => Object.assign({ t: r.measured_at }, point(r))).filter(x => !Number.isNaN(x.v));
        const now = pts[pts.length - 1];
        const s = now ? now.s : null;
        const dec = s ? s.decimals : 1;
        const valueText = now ? C.fmt(now.v, k === 'weight' ? 2 : Math.max(dec, 1)) + (s && s.unit ? ' ' + s.unit : k === 'hip' ? ' cm' : '') : '–';
        const wordText = s && s.word() ? ' · ' + s.word() : '';
        let bands = '';
        if (s) bands = '<ul class="bands">' + s.bands.map((b, i) => `<li><i style="background:${zoneVar(b.zone)}"></i><span>${esc(s.span(i))}</span><span style="color:var(--muted)">${esc(b.word)}</span></li>`).join('') + '</ul>';
        dialog(title, `<div style="font-family:var(--display);font-weight:700;font-size:22px;color:${s ? zoneColor(s) : 'var(--text)'}">${esc(valueText + wordText)}</div>`
            + (s ? `<p>${esc(s.note)}</p>` : k === 'hip' ? '<p>Die Hüfte hat keinen eigenen Grenzwert – sie zählt für Bauch/Hüfte.</p>' : '')
            + bands + chart(pts, s)
            + (pts.length < 2 ? '<p>Verlauf erscheint ab der zweiten Messung.</p>' : '')
            + '<p style="font-size:12px">Orientierung, keine ärztliche Bewertung.</p>');
    }

    /** the course as a small SVG line chart with the zones as faint bands */
    function chart(pts, s) {
        if (!pts.length) return '';
        const W = 480, H = 170, L = 34, R = 8, T = 8, B = 20;
        let lo = Math.min(...pts.map(p => p.v)), hi = Math.max(...pts.map(p => p.v));
        if (s) { lo = Math.min(lo, s.min); hi = Math.max(hi, s.max); }
        if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
        const t0 = pts[0].t, t1 = pts[pts.length - 1].t;
        const x = t => L + (t1 === t0 ? (W - L - R) / 2 : (t - t0) / (t1 - t0) * (W - L - R));
        const y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
        let g = '';
        if (s) for (const b of s.bands) {
            const a = Math.max(lo, b.from), z = Math.min(hi, b.to);
            if (z > a) g += `<rect x="${L}" y="${y(z).toFixed(1)}" width="${W - L - R}" height="${(y(a) - y(z)).toFixed(1)}" fill="${zoneVar(b.zone)}" opacity=".12"/>`;
        }
        const line = pts.map((p, i) => (i ? 'L' : 'M') + x(p.t).toFixed(1) + ',' + y(p.v).toFixed(1)).join(' ');
        const dots = pts.map(p => `<circle cx="${x(p.t).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3" fill="var(--accent)"/>`).join('');
        const lab = v => C.fmt(v, Math.abs(hi - lo) < 2 ? 2 : 0);
        return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${g}`
            + `<path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2"/>${dots}`
            + `<text x="2" y="${T + 8}">${lab(hi)}</text><text x="2" y="${H - B}">${lab(lo)}</text>`
            + `<text x="${L}" y="${H - 4}">${C.Times.day(t0).slice(3)}</text>`
            + (t1 !== t0 ? `<text x="${W - R}" y="${H - 4}" text-anchor="end">${C.Times.day(t1).slice(3)}</text>` : '') + '</svg>';
    }

    // ---- Blutdruck ------------------------------------------------------------------------------------------------

    const bpColor = i => (i <= 1 ? 'var(--phi)' : i === 2 ? 'var(--s-mid)' : 'var(--alarm)');

    function renderBp() {
        personChips($('bpPersons'), renderBp);
        const p = D.profile(person);
        $('bpTitle').textContent = 'MESSUNGEN · ' + p.name.toUpperCase();
        const box = $('readings');
        const list = D.list('bp', r => r.person === person);
        box.innerHTML = list.length ? '' : '<li class="empty">Noch keine Messung.</li>';
        for (const r of list) {
            const ci = C.Pressures.categoryIndex(r.sys, r.dia);
            const li = document.createElement('li');
            li.className = 'row';
            const extra = [r.pulse ? 'Puls ' + r.pulse : '', r.source === 'omron' ? 'Omron' : 'von Hand', r.note || ''].filter(Boolean).join(' · ');
            li.innerHTML = `<div class="when"><b>${C.Times.day(r.measured_at)} · ${C.Times.clock(r.measured_at)}</b>`
                + `<span><span class="bp-cat" style="color:${bpColor(ci)}">${esc(C.CATEGORIES[ci])}</span> · ${esc(extra)}</span></div>`
                + `<div class="num" style="color:${bpColor(ci)}">${r.sys}/${r.dia}</div>`
                + `<button type="button" class="x" aria-label="Löschen">${X}</button>`;
            li.querySelector('.x').onclick = () => {
                const gone = D.remove('bp', r.measured_at);
                offerUndo('Gelöscht: ' + r.sys + '/' + r.dia, () => D.put('bp', gone));
            };
            box.appendChild(li);
        }
    }

    $('bpAdd').onclick = () => {
        const now = new Date();
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dialog('Blutdruck eintragen', `
            <div class="two">
              <label class="fld"><span class="label">SYSTOLISCH</span><input id="bSys" inputmode="numeric" maxlength="3"></label>
              <label class="fld"><span class="label">DIASTOLISCH</span><input id="bDia" inputmode="numeric" maxlength="3"></label>
              <label class="fld"><span class="label">PULS</span><input id="bPulse" inputmode="numeric" maxlength="3"></label>
            </div>
            <label class="fld"><span class="label">WANN</span><input id="bWhen" type="datetime-local" value="${local}"></label>
            <label class="fld"><span class="label">NOTIZ (OPTIONAL)</span><input id="bNote" maxlength="${C.Pressures.NOTE_MAX}"></label>
            <div class="err" id="bErr"></div>
            <div class="acts"><button type="button" data-close>Abbrechen</button><button type="button" class="main" id="bSave">Speichern</button></div>`)
            .querySelectorAll('[data-close]').forEach(b => { b.onclick = () => $('dlg').close(); });
        const num = id => { const v = $(id).value.trim(); return /^\d{1,3}$/.test(v) ? +v : -1; };
        $('bSave').onclick = () => {
            const sys = num('bSys'), dia = num('bDia'), pulse = num('bPulse');
            const err = C.Pressures.check(sys, dia, pulse);
            if (err) { $('bErr').textContent = err; return; }
            let t = Date.parse($('bWhen').value);
            if (Number.isNaN(t)) t = Date.now();
            while (D.get('bp', t)) t += 1;   // the moment is the key: never over another reading
            const note = $('bNote').value.trim();
            D.put('bp', { measured_at: t, person, sys, dia, pulse, source: 'hand', note: note || null });
            $('dlg').close();
        };
        $('bSys').focus();
    };

    // ---- Blutzucker (Glucoses.java) ------------------------------------------------------------------------------

    const gluColor = c => (c === 'NORMAL' ? 'var(--phi)' : c === 'RAISED' ? 'var(--s-mid)' : c === 'HIGH' ? 'var(--alarm)' : 'var(--text)');

    function renderGlucose() {
        personChips($('gluPersons'), renderGlucose);
        const p = D.profile(person);
        $('gluTitle').textContent = 'MESSUNGEN · ' + p.name.toUpperCase();
        const box = $('glucoses');
        const list = D.list('glucose', r => r.person === person);
        box.innerHTML = list.length ? '' : '<li class="empty">Noch keine Messung.</li>';
        for (const r of list) {
            const G = C.Glucose, c = G.category(r.mg_dl, r.context), k = G.contextIndex(r.context), w = G.word(c);
            // time, context, where it came from and - where there are limits - the reading in its colour; both units
            const head = C.Times.clock(r.measured_at) + ' Uhr · ' + (k >= 0 ? G.CONTEXT_WORDS[k] : '') + ' · ' + (r.source === 'hand' ? 'Hand' : 'Messgerät');
            const li = document.createElement('li');
            li.className = 'row';
            li.innerHTML = `<div class="when"><b>${C.Times.day(r.measured_at)}</b>`
                + `<span>${esc(head)}${w ? ` · <span class="bp-cat" style="color:${gluColor(c)}">${w}</span>` : ''}</span>`
                + `<span style="display:block">${esc(G.both(r.mg_dl) + (r.note ? ' · ' + r.note : ''))}</span></div>`
                + `<div class="num" style="color:${gluColor(c)}">${r.mg_dl} mg/dL</div>`
                + `<button type="button" class="x" aria-label="Löschen">${X}</button>`;
            li.querySelector('.x').onclick = () => {
                const gone = D.remove('glucose', r.measured_at);
                offerUndo('Gelöscht: ' + r.mg_dl + ' mg/dL', () => D.put('glucose', gone));
            };
            box.appendChild(li);
        }
    }

    /** one number - its unit found by itself (below 35 mmol/L, else mg/dL), a chip to override -, the context, time, note */
    $('gluAdd').onclick = () => {
        const G = C.Glucose;
        const now = new Date();
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        let unit = 'mmol', fixed = false;
        let context = 0;   // always "nüchtern" to start with, like the app (Doc, 21.11.2026)
        dialog('Blutzucker eintragen', `
            <label class="fld"><span class="label">WERT</span><input id="gVal" inputmode="decimal" maxlength="6" placeholder="z. B. 5,6 oder 101"></label>
            <div class="chips" style="margin-top:8px" id="gUnit"></div>
            <p id="gBoth">&nbsp;</p>
            <div class="label" style="margin-top:12px">WANN GEMESSEN</div>
            <div class="chips grid2" style="margin-top:8px" id="gCtx"></div>
            <label class="fld"><span class="label">ZEIT</span><input id="gWhen" type="datetime-local" value="${local}"></label>
            <label class="fld"><span class="label">NOTIZ (OPTIONAL)</span><input id="gNote" maxlength="${G.NOTE_MAX}"></label>
            <div class="err" id="gErr2"></div>
            <div class="acts"><button type="button" data-close>Abbrechen</button><button type="button" class="main" id="gSave2">Speichern</button></div>`)
            .querySelectorAll('[data-close]').forEach(b => { b.onclick = () => $('dlg').close(); });
        const chips = (id, items, cur, pick) => {
            const box = $(id);
            box.innerHTML = '';
            items.forEach(([k, n]) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'chip kind' + (k === cur ? ' on' : '');
                b.style.flex = '1';
                b.textContent = n;
                b.onclick = () => pick(k);
                box.appendChild(b);
            });
        };
        const paintUnit = () => {
            chips('gUnit', [['mmol', 'mmol/L'], ['mgdl', 'mg/dL']], unit, k => { unit = k; fixed = true; paintUnit(); });
            const v = G.parse($('gVal').value);
            $('gBoth').textContent = Number.isNaN(v) || G.check(v, unit) ? '\u00a0' : '= ' + G.both(G.toMgdl(v, unit));
        };
        const paintCtx = () => chips('gCtx', G.CONTEXTS.map((c, i) => [i, G.CONTEXT_WORDS[i]]), context, k => { context = k; paintCtx(); });
        $('gVal').oninput = () => {
            const v = G.parse($('gVal').value);
            if (!fixed && !Number.isNaN(v)) unit = G.detectUnit(v);
            paintUnit();
        };
        paintUnit();
        paintCtx();
        $('gSave2').onclick = () => {
            const typed = G.parse($('gVal').value);
            const why = G.check(typed, unit);
            if (why) { $('gErr2').textContent = why; return; }
            let t = Date.parse($('gWhen').value);
            if (Number.isNaN(t)) t = Date.now();
            while (D.get('glucose', t)) t += 1;   // the moment is the key: never over another reading
            const note = $('gNote').value.trim();
            D.put('glucose', { measured_at: t, person, mg_dl: G.toMgdl(typed, unit), context: G.CONTEXTS[context], source: 'hand', note: note || null });
            $('dlg').close();
        };
        $('gVal').focus();
    };

    // ---- Fasten (fasting mode) --------------------------------------------------------------------------------------

    const F = C.Fasting;
    const asFast = r => ({ start: r.started_at, end: r.ended_at || null, planned: r.planned_days || 0 });
    const fastsOf = who => D.list('fast', r => r.person === who);
    const runningFast = who => fastsOf(who).find(r => !r.ended_at) || null;
    let historic = null, historicAsked = false;
    const levelColor = l => (l === 'RED' ? 'var(--alarm)' : l === 'ORANGE' ? 'var(--s-mid)' : '');

    function renderBanner() {
        const f = $('app').hidden ? null : runningFast(person);
        $('fastBanner').hidden = !f;
        if (f) {
            const two = people().filter(p => p.active).length > 1;
            $('fastBannerText').textContent = F.banner(asFast(f), Date.now()) + (two ? ' · ' + D.profile(person).name : '');
        }
    }
    $('fastBannerText').onclick = () => showTab('fast');
    $('fastEndBtn').onclick = () => { const f = runningFast(person); if (f) endFast(f); };
    setInterval(() => { renderBanner(); if (tab === 'fast') renderFast(); }, 60000);

    /** what a fast's days hold: the first weigh-in of the day, the first fasting glucose, the first blood pressure */
    function fastDays(r) {
        const f = asFast(r), now = Date.now();
        const inside = x => F.inside(f, x);
        const ws = D.list('weighing', x => x.person === r.person && inside(x.measured_at)).reverse();
        const gs = D.list('glucose', x => x.person === r.person && x.context === 'fasting' && inside(x.measured_at)).reverse();
        const bs = D.list('bp', x => x.person === r.person && inside(x.measured_at)).reverse();
        const first = (list, day) => list.find(x => F.localDay(x.measured_at) === day) || null;
        return F.days(f, now).map((day, i) => ({ n: i + 1, day, w: first(ws, day), g: first(gs, day), b: first(bs, day) }));
    }

    /** weight change against the first weigh-in of the fast, per fasting day - for the overlay */
    function weightLine(days) {
        const w0 = (days.find(d => d.w) || {}).w;
        if (!w0) return [];
        return days.filter(d => d.w).map(d => ({ n: d.n, v: (d.w.centi_kg - w0.centi_kg) / 100 }));
    }
    /** the same for the earlier fasts of Doc's workbook (docfit_fasting), once that document is there */
    function historicLines() {
        if (!historic || !historic.fasts || !historic.days) return [];
        return historic.fasts.map(h => {
            const pts = [];
            let w0 = null;
            for (let n = 1; n <= (h.days || 0); n++) {
                const d = new Date(h.start + 'T12:00:00');
                d.setDate(d.getDate() + n - 1);
                const day = historic.days[F.localDay(d.getTime())];
                const v = day && day.v ? day.v.weight : null;
                if (v == null) continue;
                if (w0 == null) w0 = v;
                pts.push({ n, v: v - w0 });
            }
            return { label: h.label || h.start, color: h.color || 'var(--muted)', pts };
        }).filter(l => l.pts.length > 1);
    }

    function overlay(series) {
        const all = series.flatMap(s => s.pts);
        if (all.length < 2) return '<p class="sub">Der Gewichtsverlauf erscheint ab dem zweiten Tag mit Wiegung.</p>';
        const W = 480, H = 170, L = 40, R = 8, T = 8, B = 18;
        const maxN = Math.max(2, ...all.map(p => p.n));
        let lo = Math.min(0, ...all.map(p => p.v)), hi = Math.max(0, ...all.map(p => p.v));
        if (hi - lo < 1) { lo -= .5; hi += .5; }
        const x = n => L + (n - 1) / (maxN - 1) * (W - L - R), y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
        let g = `<line x1="${L}" x2="${W - R}" y1="${y(0).toFixed(1)}" y2="${y(0).toFixed(1)}" stroke="var(--line)"/>`;
        for (const s of series.slice().reverse()) {
            if (!s.pts.length) continue;
            const d = s.pts.map((p, i) => (i ? 'L' : 'M') + x(p.n).toFixed(1) + ',' + y(p.v).toFixed(1)).join(' ');
            g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.main ? 3 : 1.6}" opacity="${s.main ? 1 : .8}"/>`;
            if (s.main) g += s.pts.map(p => `<circle cx="${x(p.n).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3" fill="${s.color}"/>`).join('');
        }
        const lab = v => (v > 0 ? '+' : '') + C.fmt(v, 1);
        return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${g}`
            + `<text x="2" y="${T + 8}">${lab(hi)} kg</text><text x="2" y="${H - B}">${lab(lo)} kg</text>`
            + `<text x="${L}" y="${H - 3}">Tag 1</text><text x="${W - R}" y="${H - 3}" text-anchor="end">Tag ${maxN}</text></svg>`
            + '<div class="lg">' + series.filter(s => s.pts.length).map(s => `<span><i style="background:${s.color}"></i>${esc(s.label)}</span>`).join('') + '</div>';
    }

    function fastCard(r, others) {
        const f = asFast(r), now = Date.now(), p = F.progress(f, now);
        const days = fastDays(r);
        const w0 = (days.find(d => d.w) || {}).w;
        const range = C.Times.day(r.started_at).slice(3) + (r.ended_at ? ' – ' + C.Times.day(r.ended_at).slice(3) : ' – läuft');
        const rows = days.slice().reverse().map(d => {
            const delta = w0 && d.w && d.w !== w0 ? ` <small>(${(d.w.centi_kg >= w0.centi_kg ? '+' : '') + C.fmt((d.w.centi_kg - w0.centi_kg) / 100, 2)})</small>` : '';
            const wt = d.w ? C.Times.kg(d.w.centi_kg / 100) + delta : '<small>–</small>';
            const gl = d.g ? `<span style="color:${levelColor(F.gluLevel(d.g.mg_dl))}">${d.g.mg_dl} mg/dL</span> <small>${C.Glucose.both(d.g.mg_dl).split(' · ')[0]}</small>` : '<small>–</small>';
            const bp = d.b ? `<span style="color:${levelColor(F.sysLevel(d.b.sys))}">${d.b.sys}/${d.b.dia}</span>${d.b.pulse ? ' <small>Puls ' + d.b.pulse + '</small>' : ''}` : '<small>–</small>';
            return `<tr><td>Tag ${d.n}<br><small>${C.Times.day(new Date(d.day + 'T12:00:00').getTime()).slice(0, 9)}</small></td><td>${wt}</td><td>${gl}</td><td>${bp}</td></tr>`;
        }).join('');
        // the safety hints, from the newest blood pressure and fasting glucose of a running fast
        const lastB = days.slice().reverse().find(d => d.b), lastG = days.slice().reverse().find(d => d.g);
        let safety = '';
        if (p.running) {
            const sl = lastB ? F.sysLevel(lastB.b.sys) : null, gl = lastG ? F.gluLevel(lastG.g.mg_dl) : null;
            if (sl) safety += `<div class="safety" style="color:${levelColor(sl)}">${sl === 'RED' ? 'Blutdruck sehr niedrig' : 'Blutdruck niedrig'} (sys ${lastB.b.sys}) – langsam aufstehen, genug trinken; bei Schwindel das Fasten beenden und ärztlich abklären.</div>`;
            if (gl) safety += `<div class="safety" style="color:${levelColor(gl)}">${gl === 'RED' ? 'Unterzucker-Bereich' : 'Zucker niedrig'} (${lastG.g.mg_dl} mg/dL) – ${gl === 'RED' ? 'etwas Zuckerhaltiges nehmen und das Fasten beenden.' : 'auf Zeichen von Unterzucker achten.'}</div>`;
        }
        const series = [{ label: 'dieses Fasten', color: 'var(--accent)', main: true, pts: weightLine(days) }]
            .concat(others.map((o, i) => ({ label: C.Times.day(o.started_at).slice(3), color: ['#9085e9', '#3987e5', '#d55181', '#199e70'][i % 4], pts: weightLine(fastDays(o)) })))
            .concat(historicLines());
        const head = p.running ? 'Tag ' + p.day + (p.planned ? ' von ' + p.planned : '') + ' · ' + p.hours + ' h'
            : days.length + (days.length === 1 ? ' Tag' : ' Tage') + (p.planned ? ' (geplant ' + p.planned + ')' : '');
        const el = document.createElement('div');
        el.className = 'fcard';
        el.innerHTML = `<h3><span>${esc(range)}</span><span style="color:var(--muted);font-family:var(--read);font-weight:400;font-size:13px">${esc(head)}</span></h3>`
            + (r.note ? `<div class="sub">${esc(r.note)}</div>` : '') + safety
            + `<div class="tbl-scroll"><table class="ftable"><thead><tr><th>TAG</th><th>GEWICHT</th><th>ZUCKER NÜCHTERN</th><th>BLUTDRUCK</th></tr></thead><tbody>${rows}</tbody></table></div>`
            + overlay(series)
            + `<div class="acts">${p.running ? '<button type="button" class="main" data-a="end">Fasten beenden</button>' : ''}<button type="button" data-a="edit">Ändern</button><button type="button" data-a="del">Löschen</button></div>`;
        el.querySelectorAll('[data-a]').forEach(b => {
            b.onclick = () => {
                if (b.dataset.a === 'end') endFast(r);
                if (b.dataset.a === 'edit') editFast(r);
                if (b.dataset.a === 'del') {
                    const gone = D.remove('fast', r.fast_id);
                    offerUndo('Fasten gelöscht', () => D.put('fast', gone));
                }
            };
        });
        return el;
    }

    function renderFast() {
        personChips($('fastPersons'), () => { renderFast(); renderBanner(); });
        const list = fastsOf(person);
        $('fastStart').hidden = !!list.find(r => !r.ended_at);
        const box = $('fastCards');
        box.innerHTML = '';
        if (!list.length) box.innerHTML = '<p class="empty">Noch kein Fasten. Alles, was du während eines Fastens misst – Gewicht, Zucker nüchtern, Blutdruck – gehört von selbst dazu.</p>';
        list.forEach(r => box.appendChild(fastCard(r, list.filter(o => o !== r && o.started_at < r.started_at))));
        if (!historicAsked) {
            historicAsked = true;
            D.historic().then(doc => { historic = doc; if (doc && tab === 'fast') renderFast(); });
        }
        if (historic && historic.fasts && historic.fasts.length && person === 0) {
            const old = document.createElement('div');
            old.innerHTML = '<div class="head"><h2>FRÜHERE FASTEN</h2></div><div class="old">'
                + historic.fasts.slice().sort((a, b) => String(a.start).localeCompare(String(b.start)))
                    .map(h => `<div style="--c:${esc(h.color || '#8a93a6')}"><b>${esc(h.label || h.start)}</b>${h.days} Tage${h.endSure === false ? ' · Ende nicht eingetragen' : ''}</div>`).join('') + '</div>';
            box.appendChild(old);
        }
    }

    function fastDialog(title, r, onSave) {
        const toLocal = t => { const d = new Date(t); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
        dialog(title, `
            <label class="fld"><span class="label">BEGINN</span><input id="fStart" type="datetime-local" value="${toLocal(r ? r.started_at : Date.now())}"></label>
            ${r && r.ended_at ? `<label class="fld"><span class="label">ENDE</span><input id="fEnd" type="datetime-local" value="${toLocal(r.ended_at)}"></label>` : ''}
            <label class="fld"><span class="label">GEPLANTE TAGE (OPTIONAL)</span><input id="fDays" inputmode="numeric" maxlength="2" value="${r && r.planned_days ? r.planned_days : ''}"></label>
            <label class="fld"><span class="label">NOTIZ (OPTIONAL)</span><input id="fNote" maxlength="200" value="${esc(r && r.note ? r.note : '')}"></label>
            <p>Alles, was du in dieser Zeit misst, gehört von selbst zu diesem Fasten.</p>
            <div class="err" id="fErr"></div>
            <div class="acts"><button type="button" data-close>Abbrechen</button><button type="button" class="main" id="fSave">${r ? 'Speichern' : 'Fasten starten'}</button></div>`)
            .querySelectorAll('[data-close]').forEach(b => { b.onclick = () => $('dlg').close(); });
        $('fSave').onclick = () => {
            const start = Date.parse($('fStart').value);
            const end = $('fEnd') ? Date.parse($('fEnd').value) : null;
            const dv = $('fDays').value.trim();
            const days = dv ? +dv : 0;
            if (Number.isNaN(start)) { $('fErr').textContent = 'Bitte den Beginn eintragen.'; return; }
            if (end !== null && (Number.isNaN(end) || end < start)) { $('fErr').textContent = 'Das Ende liegt vor dem Beginn.'; return; }
            if (dv && !(/^\d{1,2}$/.test(dv) && days >= 1 && days <= 90)) { $('fErr').textContent = 'Geplante Tage zwischen 1 und 90.'; return; }
            onSave({ started_at: start, ended_at: end, planned_days: days || null, note: $('fNote').value.trim() || null });
            $('dlg').close();
        };
    }
    $('fastStart').onclick = () => fastDialog('Fasten starten', null, v => {
        // a UUID like the app's Fasts (its id never changes, also when the start is corrected)
        const id = window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
        D.put('fast', Object.assign({ fast_id: id, person }, v, { ended_at: null }));
        renderBanner();
    });
    function editFast(r) {
        fastDialog('Fasten ändern', r, v => D.put('fast', Object.assign({}, r, v, r.ended_at ? {} : { ended_at: null })));
    }
    function endFast(r) {
        const now = Date.now();
        dialog('Fasten beenden', `<p>${esc(F.banner(asFast(r), now))} – jetzt beenden?</p>
            <div class="acts"><button type="button" data-close>Abbrechen</button><button type="button" class="main" id="fEndGo">Beenden</button></div>`)
            .querySelectorAll('[data-close]').forEach(b => { b.onclick = () => $('dlg').close(); });
        $('fEndGo').onclick = () => {
            D.put('fast', Object.assign({}, r, { ended_at: Math.max(now, r.started_at) }));
            $('dlg').close();
            renderBanner();
        };
    }

    // ---- settings -------------------------------------------------------------------------------------------------

    function theme() {
        const r = document.documentElement;
        return r.classList.contains('svp-light') ? 'light' : r.classList.contains('svp-grey') ? 'grey' : 'dark';
    }
    function setTheme(t) {
        const r = document.documentElement;
        r.classList.toggle('svp-light', t === 'light');
        r.classList.toggle('svp-grey', t === 'grey');
        ls.set('svp-theme', t);
        const m = document.querySelector('meta[name="theme-color"]');
        if (m) m.content = css('--bg');
        render();
    }

    $('gear').onclick = openSettings;
    function openSettings() {
        const ps = people();
        const body = dialog('Einstellungen', `
            <div class="sec"><button type="button" class="menu-row" id="sFast"><span>Fasten</span><span style="color:var(--muted)">›</span></button></div>
            <div class="sec"><div class="label">FARBSCHEMA</div><div class="chips" style="margin-top:8px" id="sTheme"></div></div>
            <div class="sec"><div class="label">PERSONEN</div><div class="chips" style="margin-top:8px" id="sPeople"></div>
              <p id="sPeopleHint">Aus: nicht im Umschalter – die Daten bleiben gespeichert.</p></div>
            <div class="sec"><div class="label">PROFIL</div><div class="chips" style="margin-top:8px" id="sProfiles"></div></div>
            <div class="sec"><div class="label">MESSMETHODE</div><p>Die Waage misst Gewicht und den Widerstand zwischen den Füßen. Daraus geschätzt: Körperfett nach Jebb 2000 (Fuß-zu-Fuß-Waagen), Wasser als 73 % der fettfreien Masse, Muskel nach Janssen 2000 (eine Schätzung), Fitness nach Gallagher 2000 und ACE. Zur Kontrolle das Körperfett aus BMI, Alter und Geschlecht (Gallagher 2000): mehr als 8 Punkte auseinander heißt unplausibel. Dieselben Formeln wie in der App.</p></div>
            <div class="sec"><div class="label">KONTO</div><p>Angemeldet als ${esc(auth.whoami() || '–')}. Die Werte liegen in deiner privaten Supabase-Ablage – dieselbe wie die der App.</p>
              <div class="acts" style="justify-content:flex-start"><button type="button" id="sLogout">Abmelden (alle Seiten mit diesem Login)</button></div></div>`);
        body.querySelector('#sFast').onclick = () => { $('dlg').close(); showTab('fast'); };
        const th = body.querySelector('#sTheme');
        [['dark', 'Blau'], ['grey', 'Grau'], ['light', 'Hell']].forEach(([k, n]) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip pick' + (theme() === k ? ' on' : '');
            b.textContent = n;
            b.style.flex = '1';
            b.onclick = () => { setTheme(k); openSettings(); };
            th.appendChild(b);
        });
        const pe = body.querySelector('#sPeople');
        ps.forEach(p => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip person' + (p.active ? ' on' : '');
            b.textContent = p.name;
            b.onclick = () => {
                const onCount = people().filter(x => x.active).length;
                if (p.active && onCount <= 1) { body.querySelector('#sPeopleHint').textContent = 'Mindestens eine Person bleibt an.'; return; }
                putProfile(p.i, { active: !p.active });
                openSettings();
            };
            pe.appendChild(b);
        });
        const pr = body.querySelector('#sProfiles');
        ps.forEach(p => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip';
            b.style.flex = '1';
            b.textContent = p.name + ' …';
            b.onclick = () => editProfile(p.i);
            pr.appendChild(b);
        });
        body.querySelector('#sLogout').onclick = () => {
            auth.storeSession(null);
            $('dlg').close();
            location.reload();
        };
    }

    function putProfile(i, change) {
        const cur = D.get('profile', i) || { person: i, name: null, height_cm: null, birth_year: null, sex: null, active: true };
        D.put('profile', Object.assign({}, cur, change, { person: i }));
    }

    function editProfile(i) {
        const p = D.profile(i), raw = D.get('profile', i) || {};
        const year = new Date().getFullYear();
        dialog('Profil · ' + p.name, `
            ${i === 0 ? '' : `<label class="fld"><span class="label">NAME</span><input id="pName" maxlength="40" value="${esc(raw.name || '')}"></label>`}
            <div class="two">
              <label class="fld"><span class="label">GRÖSSE IN CM</span><input id="pHeight" inputmode="numeric" maxlength="3" value="${p.heightCm || ''}"></label>
              <label class="fld"><span class="label">GEBURTSJAHR</span><input id="pYear" inputmode="numeric" maxlength="4" value="${p.birthYear || ''}"></label>
            </div>
            <div class="label" style="margin-top:12px">GESCHLECHT</div>
            <div class="chips" style="margin-top:8px" id="pSex"></div>
            <div class="err" id="pErr"></div>
            <div class="acts"><button type="button" data-close>Abbrechen</button><button type="button" class="main" id="pSave">Speichern</button></div>`)
            .querySelectorAll('[data-close]').forEach(b => { b.onclick = () => $('dlg').close(); });
        let sex = p.sex;
        const box = $('pSex');
        const paint = () => {
            box.innerHTML = '';
            [['m', 'männlich'], ['w', 'weiblich']].forEach(([k, n]) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'chip pick' + (sex === k ? ' on' : '');
                b.style.flex = '1';
                b.textContent = n;
                b.onclick = () => { sex = sex === k ? '' : k; paint(); };
                box.appendChild(b);
            });
        };
        paint();
        $('pSave').onclick = () => {
            const h = $('pHeight').value.trim(), y = $('pYear').value.trim();
            const hv = h ? +h : 0, yv = y ? +y : 0;
            if (h && !(/^\d+$/.test(h) && hv >= 100 && hv <= 250)) { $('pErr').textContent = 'Größe zwischen 100 und 250 cm.'; return; }
            if (y && !(/^\d{4}$/.test(y) && yv >= 1900 && yv <= year)) { $('pErr').textContent = 'Geburtsjahr vierstellig, zwischen 1900 und ' + year + '.'; return; }
            const change = { height_cm: hv || null, birth_year: yv || null, sex: sex || null };
            if (i > 0) { const n = $('pName').value.trim(); change.name = n || null; }
            putProfile(i, change);
            $('dlg').close();
        };
    }
    $('profileBtn').onclick = () => editProfile(person);

    // ---- start ----------------------------------------------------------------------------------------------------

    function render() {
        if ($('app').hidden) return;
        if (tab === 'watch') { renderKinds(); renderWatch(); renderRuns(); }
        if (tab === 'scale') renderScale();
        if (tab === 'bp') renderBp();
        if (tab === 'glucose') renderGlucose();
        if (tab === 'fast') renderFast();
        renderBanner();
    }

    D.onChange(render);
    D.onStatus(s => {
        const el = $('state');
        el.textContent = s.text;
        el.className = 'state' + (s.kind ? ' ' + s.kind : '');
    });

    async function showApp() {
        $('gate').hidden = true;
        $('state').textContent = 'lädt …';
        try {
            await D.load();
        } catch (e) {
            $('state').textContent = e.message;
            $('state').className = 'state err';
            if (/Zugriff|abgelaufen|angemeldet/.test(e.message)) { $('gate').hidden = false; return; }
        }
        $('state').textContent = '';
        $('app').hidden = false;
        $('tabs').hidden = false;
        $('gear').hidden = false;
        showTab(tab);
        // what the phone did meanwhile: on focus and every minute while the page is visible
        const pull = () => { if (document.visibilityState === 'visible') D.pull().catch(() => { }); };
        document.addEventListener('visibilitychange', pull);
        window.addEventListener('focus', pull);
        window.addEventListener('online', () => D.flush());
        setInterval(pull, 60000);
    }

    $('loginBtn').onclick = () => auth.loginDialog(showApp, 'Anmelden für DocFit');
    if (auth.hasSession()) showApp(); else $('gate').hidden = false;
})();
