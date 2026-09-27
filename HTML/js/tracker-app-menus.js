// Doc Alvers Tracker - part 10 of 13: per-track menu, folder menu, toast, GPX import.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---- Per-track ⋯ menu: one action sheet holding every track function (Doc 2026-07-06) ----
        // A styled list of actions (+ cancel). Each item: { label, danger?, hidden?, run() }.
        function uiActionSheet(title, items) {
            const ov = document.createElement('div'); ov.className = 'ui-modal-ov';
            const box = document.createElement('div'); box.className = 'ui-modal'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
            const msg = document.createElement('div'); msg.className = 'ui-modal-msg'; msg.textContent = title;
            const list = document.createElement('div'); list.className = 'ui-pick-list';
            let done = false;
            function close() { if (done) return; done = true; ov.classList.remove('shown'); document.removeEventListener('keydown', onKey); setTimeout(() => ov.remove(), 200); }
            function onKey(e) { if (e.key === 'Escape') close(); }
            (items || []).forEach((it) => {
                if (it.hidden) return;
                const b = document.createElement('button'); b.type = 'button';
                b.className = 'ui-pick-item' + (it.danger ? ' ui-pick-danger' : '');
                b.textContent = it.label;
                b.onclick = () => { close(); if (it.run) it.run(); };
                list.appendChild(b);
            });
            const btns = document.createElement('div'); btns.className = 'ui-modal-btns';
            const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'ui-btn ui-btn-cancel'; cancel.textContent = 'Abbrechen'; cancel.onclick = close;
            btns.appendChild(cancel);
            box.appendChild(msg); box.appendChild(list); box.appendChild(btns);
            ov.appendChild(box); ov.onclick = (e) => { if (e.target === ov) close(); };
            document.addEventListener('keydown', onKey); document.body.appendChild(ov);
            requestAnimationFrame(() => ov.classList.add('shown'));
        }

        // Read-only stats dialog (Distanz · Dauer · Ø/Max · Auf-/Abstieg · Höchster/tiefster).
        function uiStatsDialog(title, rows) {
            const ov = document.createElement('div'); ov.className = 'ui-modal-ov';
            const box = document.createElement('div'); box.className = 'ui-modal'; box.setAttribute('role', 'dialog');
            const msg = document.createElement('div'); msg.className = 'ui-modal-msg'; msg.textContent = title;
            const list = document.createElement('div'); list.className = 'ui-stat-list';
            rows.forEach(([k, v]) => {
                const row = document.createElement('div'); row.className = 'ui-stat-row';
                const a = document.createElement('span'); a.className = 'ui-stat-k'; a.textContent = k;
                const c = document.createElement('span'); c.className = 'ui-stat-v'; c.textContent = v;
                row.appendChild(a); row.appendChild(c); list.appendChild(row);
            });
            let done = false;
            function close() { if (done) return; done = true; ov.classList.remove('shown'); document.removeEventListener('keydown', onKey); setTimeout(() => ov.remove(), 200); }
            function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter') close(); }
            const btns = document.createElement('div'); btns.className = 'ui-modal-btns';
            const ok = document.createElement('button'); ok.type = 'button'; ok.className = 'ui-btn ui-btn-ok'; ok.textContent = 'OK'; ok.onclick = close;
            btns.appendChild(ok);
            box.appendChild(msg); box.appendChild(list); box.appendChild(btns);
            ov.appendChild(box); ov.onclick = (e) => { if (e.target === ov) close(); };
            document.addEventListener('keydown', onKey); document.body.appendChild(ov);
            requestAnimationFrame(() => ov.classList.add('shown'));
        }
        function showStatsDialog(name) {
            const s = trackStats(), dem = demOn ? ' (DEM)' : '';
            uiStatsDialog((name || 'Track').replace(/^Track\s+/, ''), [
                ['Distanz', fmtDist(s.distM)],
                ['Dauer', fmtDur(s.durMs)],
                ['Ø-Tempo', s.avgKmh.toFixed(1) + ' km/h'],
                ['Max-Tempo', s.maxKmh.toFixed(1) + ' km/h'],
                ['Aufstieg ↑', s.up + ' m' + dem],
                ['Abstieg ↓', s.down + ' m' + dem],
                ['Höchster / tiefster', (s.hi != null ? Math.round(s.hi) : '–') + ' / ' + (s.lo != null ? Math.round(s.lo) : '–') + ' m'],
            ]);
        }

        // Load a track row onto the map, then optionally apply a follow-up (smooth / DEM / stats / GPX).
        async function loadRow(r, opts) {
            opts = opts || {};
            toast('Lade Track …');
            let t;
            try { t = await fetchTrack(r.id); } catch (e) { toast('Track laden fehlgeschlagen.'); return; }
            plotTrack(t.points, t.waypoints);
            currentTrackId = r.id; currentTrackName = r.name;
            loadedTrackIds.clear(); loadedTrackIds.add(r.id);
            persistLoaded([{ id: r.id, name: r.name }]);
            hidePanels();
            if (opts.smooth) toggleSmooth();
            else if (opts.dem) await toggleDem();
            else if (opts.stats) showStatsDialog(r.name);
            else if (opts.exportGpx) exportGpx();
            else toast((r.name || 'Track') + ' geladen.');
        }
        // Move ONE track into a folder (existing or new) via the folder picker.
        async function moveRow(r) {
            const choice = await uiPickFolder(_folders);
            if (!choice) return;
            let fid, fname;
            if (choice.new) {
                fname = await uiPrompt('Ordnername:', { value: 'Neuer Ordner', okText: 'Anlegen' });
                if (!fname) return;
                try { fid = await createFolder(fname); } catch (e) { toast('Anlegen fehlgeschlagen: ' + (e.message || e)); return; }
            } else { fid = choice.id; fname = (_folders.find((f) => f.id === fid) || {}).name || 'Ordner'; }
            try { await assignFolder([r.id], fid); } catch (e) { toast('Verschieben fehlgeschlagen: ' + (e.message || e)); return; }
            toast('„' + ((r.name || 'Track').replace(/^Track\s+/, '')) + '" → „' + fname + '"');
            try { const rows = await listTracks(); renderTrackList(rows); } catch (e) { /* refresh best-effort */ }
        }
        // The per-track ⋯ menu: every action for THAT track in one sheet.
        function openTrackMenu(r, rowEl) {
            const title = (r.name || 'Track').replace(/^Track\s+/, '').replace(/^Sprachnotiz\s+/i, '');
            uiActionSheet(title, [
                { label: 'Laden', run: () => loadRow(r) },
                { label: 'Statistik …', run: () => loadRow(r, { stats: true }) },
                { label: 'Teilen', run: () => shareTrack(r.id, r.name) },
                { label: 'Verschieben …', run: () => moveRow(r) },
                {
                    label: 'Aus Ordner nehmen', hidden: !r.folder_id, run: async () => {
                        try { await assignFolder([r.id], null); toast('Aus Ordner genommen.'); const rows = await listTracks(); renderTrackList(rows); }
                        catch (e) { toast('Verschieben fehlgeschlagen.'); }
                    },
                },
                { label: 'Als GPX exportieren', run: () => loadRow(r, { exportGpx: true }) },
                { label: 'Glätten', run: () => loadRow(r, { smooth: true }) },
                { label: 'Höhe nach Geländemodell', run: () => loadRow(r, { dem: true }) },
                {
                    label: 'Löschen', danger: true, hidden: !ALLOW_DELETE, run: async () => {
                        if (!(await uiConfirm('Track löschen?', { danger: true, okText: 'Löschen' }))) return;
                        try { await removeTrack(r.id); if (rowEl) rowEl.remove(); toast('Gelöscht.'); }
                        catch (e) { toast('Löschen fehlgeschlagen.'); }
                    },
                },
            ]);
        }

        // ---- Folder ⋯ menu + "Website erstellen" (public tour showcase page) ----
        const TOUR_BASE = 'https://docalvers.de/tracker/tour.html';
        // Readable slug from the folder name (lowercase, umlauts stripped, spaces → '-').
        function folderSlug(name) {
            return (name || 'tour').toString().toLowerCase().normalize('NFKD')
                .replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss')
                .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'tour';
        }
        async function setFolderSlug(id, slug) {
            const c = await ensureSb();
            const { error } = await c.from('track_folders').update({ share_slug: slug }).eq('id', id);
            return error;
        }
        // Publish the folder as a public tour page: set its share_slug (from the name) → hand out the
        // clean …/tour.html?t=<slug> link. Re-runnable; a name clash gets a short suffix.
        async function createWebsite(folder, kids) {
            if (!kids || !kids.length) { toast('Ordner ist leer.'); return; }
            toast('Website wird erstellt …');
            let slug = folderSlug(folder.name);
            let err = await setFolderSlug(folder.id, slug);
            if (err && (err.code === '23505' || /duplicate|unique/i.test(err.message || ''))) {
                slug = slug + '-' + Math.random().toString(36).slice(2, 6);   // slug taken by another folder
                err = await setFolderSlug(folder.id, slug);
            }
            if (err) { toast('Website fehlgeschlagen: ' + (err.message || err)); return; }
            folder.share_slug = slug;
            const url = TOUR_BASE + '?t=' + encodeURIComponent(slug);
            let copied = false;
            try { await navigator.clipboard.writeText(url); copied = true; } catch (e) { /* no clipboard */ }
            try { if (navigator.share) await navigator.share({ title: folder.name, text: folder.name, url }); } catch (e) { /* cancelled */ }
            toast(copied ? 'Website-Link kopiert.' : 'Website erstellt.');
        }
        function openFolderMenu(folder, kids, nmEl) {
            uiActionSheet(folder.name, [
                {
                    label: 'Umbenennen …', run: async () => {
                        const name = await uiPrompt('Ordner umbenennen:', { value: folder.name, okText: 'Umbenennen' });
                        if (!name || name === folder.name) return;
                        try { await renameFolder(folder.id, name); folder.name = name; if (nmEl) nmEl.textContent = name; toast('Umbenannt.'); }
                        catch (e) { toast('Umbenennen fehlgeschlagen.'); }
                    },
                },
                { label: 'Teilen', run: () => { const ids = kids.map((r) => r.id); if (!ids.length) { toast('Ordner ist leer.'); return; } shareMultiple(ids, folder.name); } },
                { label: 'Website erstellen …', run: () => createWebsite(folder, kids) },
                {
                    label: 'Auflösen', danger: true, run: async () => {
                        if (!(await uiConfirm('Ordner auflösen? Die Tracks bleiben erhalten und wandern zurück in die Liste.', { okText: 'Auflösen' }))) return;
                        try { await deleteFolder(folder.id); toast('Ordner aufgelöst.'); const rows = await listTracks(); renderTrackList(rows); }
                        catch (e) { toast('Auflösen fehlgeschlagen.'); }
                    },
                },
            ]);
        }

        // ---- Transient toast (the persistent status line was removed) ----
        let toastTimer = null;
        function toast(msg) {
            const t = $('toast');
            t.textContent = msg;
            t.classList.add('show');
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
        }

        // Styled in-app confirm — replaces the ugly native confirm(). Returns Promise<boolean>.
        // opts: { okText, cancelText, danger }  (danger → red OK button for destructive actions).
        function uiConfirm(message, opts) {
            opts = opts || {};
            return new Promise((resolve) => {
                const ov = document.createElement('div');
                ov.className = 'ui-modal-ov';
                ov.innerHTML =
                    '<div class="ui-modal" role="dialog" aria-modal="true">' +
                    '<div class="ui-modal-msg"></div>' +
                    '<div class="ui-modal-btns">' +
                    '<button type="button" class="ui-btn ui-btn-cancel"></button>' +
                    '<button type="button" class="ui-btn ' + (opts.danger ? 'ui-btn-danger' : 'ui-btn-ok') + '"></button>' +
                    '</div></div>';
                ov.querySelector('.ui-modal-msg').textContent = message;
                const cancel = ov.querySelector('.ui-btn-cancel');
                const ok = ov.querySelector('.ui-btn:last-child');
                cancel.textContent = opts.cancelText || 'Abbrechen';
                ok.textContent = opts.okText || 'OK';
                let done = false;
                function close(v) {
                    if (done) return;
                    done = true;
                    ov.classList.remove('shown');
                    document.removeEventListener('keydown', onKey);
                    setTimeout(() => ov.remove(), 200);
                    resolve(v);
                }
                function onKey(e) {
                    if (e.key === 'Escape') close(false);
                    else if (e.key === 'Enter') close(true);
                }
                cancel.onclick = () => close(false);
                ok.onclick = () => close(true);
                ov.onclick = (e) => { if (e.target === ov) close(false); };
                document.addEventListener('keydown', onKey);
                document.body.appendChild(ov);
                requestAnimationFrame(() => { ov.classList.add('shown'); ok.focus(); });
            });
        }

        // Styled single-line prompt (paste a value) — same look as uiConfirm, plus a text field.
        // Resolves the trimmed text, or null on cancel/empty.
        function uiPrompt(message, opts) {
            opts = opts || {};
            return new Promise((resolve) => {
                const ov = document.createElement('div');
                ov.className = 'ui-modal-ov';
                ov.innerHTML =
                    '<div class="ui-modal" role="dialog" aria-modal="true">' +
                    '<div class="ui-modal-msg"></div>' +
                    '<input type="text" class="ui-modal-input" aria-label="Eingabe" autocapitalize="off" autocomplete="off" spellcheck="false">' +
                    '<div class="ui-modal-btns">' +
                    '<button type="button" class="ui-btn ui-btn-cancel"></button>' +
                    '<button type="button" class="ui-btn ui-btn-ok"></button>' +
                    '</div></div>';
                ov.querySelector('.ui-modal-msg').textContent = message;
                const inp = ov.querySelector('.ui-modal-input');
                inp.placeholder = opts.placeholder || '';
                if (opts.value) inp.value = opts.value;
                const cancel = ov.querySelector('.ui-btn-cancel');
                const ok = ov.querySelector('.ui-btn-ok');
                cancel.textContent = opts.cancelText || 'Abbrechen';
                ok.textContent = opts.okText || 'OK';
                let done = false;
                function close(v) {
                    if (done) return;
                    done = true;
                    ov.classList.remove('shown');
                    document.removeEventListener('keydown', onKey);
                    setTimeout(() => ov.remove(), 200);
                    resolve(v);
                }
                function onKey(e) {
                    if (e.key === 'Escape') close(null);
                    else if (e.key === 'Enter') close(inp.value.trim() || null);
                }
                cancel.onclick = () => close(null);
                ok.onclick = () => close(inp.value.trim() || null);
                ov.onclick = (e) => { if (e.target === ov) close(null); };
                document.addEventListener('keydown', onKey);
                document.body.appendChild(ov);
                requestAnimationFrame(() => { ov.classList.add('shown'); inp.focus(); });
            });
        }

        // Pull a share token out of whatever the user pastes: a full view-link (…?s=token), a bare
        // token, or even a comma-bundle (we take the first). Returns null if nothing usable.
        function parseShareToken(input) {
            if (!input) return null;
            input = String(input).trim();
            try { const s = new URL(input).searchParams.get('s'); if (s) return s.split(',')[0].trim(); } catch (e) { /* not a URL */ }
            const m = input.match(/[?&]s=([^&\s]+)/);
            if (m) return decodeURIComponent(m[1]).split(',')[0].trim();
            return input.split(',')[0].trim() || null; // assume a bare token was pasted
        }

        // "Geteilten Track-Link laden" in the Tracks-laden panel: paste a friend's view-link → import
        // a copy into MY account (importShared does the fetch + save). See importShared above.
        if ($('tl-import')) $('tl-import').addEventListener('click', async () => {
            const link = await uiPrompt('Geteilten Track-Link einfügen:', { placeholder: 'https://…/view.html?s=…', okText: 'Laden' });
            if (!link) return;
            const tok = parseShareToken(link);
            if (!tok) { toast('Kein gültiger Link.'); return; }
            hidePanels();
            importShared(tok);
        });

        // ---- Import a GPX file (e.g. a Komoot planned route) → plot it + save it as a track ----
        // Parses <trkpt> (recorded) or <rtept> (planned route) into our point format
        // [lat,lng,time,alt,speed,activity,temp]. Highlights/POIs (<wpt>) are skipped in v1 — just the
        // route line, which is what you follow. It then saves like any track (appears in the list,
        // survives a reload); group it into e.g. a "Komoot" folder afterwards.
        function parseGpx(text) {
            const xml = new DOMParser().parseFromString(text, 'application/xml');
            if (xml.getElementsByTagName('parsererror').length) throw new Error('kein gültiges GPX');
            const nameEl = xml.querySelector('trk > name') || xml.querySelector('rte > name') || xml.querySelector('metadata > name') || xml.querySelector('name');
            let els = Array.from(xml.getElementsByTagName('trkpt'));
            if (!els.length) els = Array.from(xml.getElementsByTagName('rtept'));
            const raw = [];
            for (const el of els) {
                const lat = parseFloat(el.getAttribute('lat')), lon = parseFloat(el.getAttribute('lon'));
                if (!isFinite(lat) || !isFinite(lon)) continue;
                const eleEl = el.getElementsByTagName('ele')[0];
                const timeEl = el.getElementsByTagName('time')[0];
                const ele = eleEl ? parseFloat(eleEl.textContent) : NaN;
                const time = timeEl ? (timeEl.textContent || '').trim() : '';
                raw.push([lat, lon, time || null, isFinite(ele) ? ele : null, null, null, null]);
            }
            // A planned route (Komoot etc.) is sampled COARSELY — points 30–100 m apart. At walking pace
            // that's >20 s AND >30 m per segment, which the renderer mistakes for GPS-loss GAPS (red/white
            // barber-pole) and which also makes the speed colour look chunky. So densify: interpolate
            // (lat/lng/time/ele) to ≤15 m spacing. A genuine big jump (>300 m = real dropout) is left as a
            // gap. Speed is derived AFTER, so each sub-segment keeps its segment's pace.
            const points = [];
            const MAXSEG = 15, GAPCAP = 300;
            for (let i = 0; i < raw.length; i++) {
                if (i > 0) {
                    const a = raw[i - 1], b = raw[i];
                    const d = haversine([a[0], a[1]], [b[0], b[1]]);
                    if (d > MAXSEG && d <= GAPCAP) {
                        const n = Math.floor(d / MAXSEG);
                        const ta = a[2] ? Date.parse(a[2]) : null, tb = b[2] ? Date.parse(b[2]) : null;
                        for (let k = 1; k <= n; k++) {
                            const f = k / (n + 1);
                            const t = (ta != null && tb != null) ? new Date(ta + (tb - ta) * f).toISOString() : null;
                            const e = (a[3] != null && b[3] != null) ? a[3] + (b[3] - a[3]) * f : null;
                            points.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, t, e, null, null, null]);
                        }
                    }
                }
                points.push(raw[i]);
            }
            // Derive per-point speed (km/h) from consecutive time+distance so the loaded track is
            // speed-COLOURED like a recorded one — otherwise speed stays null → the renderer paints it
            // all at 0 km/h (flat deep green). Any timestamped GPX benefits; a GPX without <time> stays null.
            for (let i = 1; i < points.length; i++) {
                const a = points[i - 1], b = points[i];
                if (!a[2] || !b[2]) continue;
                const dt = (Date.parse(b[2]) - Date.parse(a[2])) / 1000;   // s
                if (!(dt > 0)) continue;
                const dm = haversine([a[0], a[1]], [b[0], b[1]]);          // m
                b[4] = Math.round(dm / dt * 3.6 * 10) / 10;                // km/h into this point
            }
            if (points.length > 1 && points[0][4] == null) points[0][4] = points[1][4]; // seed the first point
            return { name: (nameEl ? nameEl.textContent : '').trim(), points };
        }
        if ($('tl-gpx')) $('tl-gpx').addEventListener('click', () => { const inp = $('gpx-input'); if (inp) inp.click(); });
        if ($('gpx-input')) $('gpx-input').addEventListener('change', async (ev) => {
            const files = Array.from(ev.target.files || []);
            ev.target.value = '';                              // let the same file(s) be re-picked later
            if (!files.length) return;
            // Import in filename order so "01…15" line up as Etappe 1…N (their <time> already encodes it).
            files.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true }));

            // ---- Single file → the original focused behaviour (plot + save + persist one track) ----
            if (files.length === 1) {
                const file = files[0];
                toast('GPX wird geladen …');
                let parsed;
                try { parsed = parseGpx(await file.text()); }
                catch (e) { toast('GPX-Fehler: ' + (e.message || e)); return; }
                if (!parsed.points.length) { toast('Keine Punkte im GPX gefunden.'); return; }
                plotTrack(parsed.points, []);                  // draw the imported route on the map
                currentTrackId = null;                         // fresh import → INSERT a new row (never overwrite)
                const name = parsed.name || autoTrackName();
                $('hud-top').classList.add('shown');
                let id;
                try { id = await saveTrack(name, 'done'); }
                catch (e) { currentTrackName = name; hidePanels(); toast('Geladen, Speichern fehlgeschlagen: ' + (e.message || e)); return; }
                currentTrackId = id; currentTrackName = name;
                loadedTrackIds.clear(); loadedTrackIds.add(id);
                persistLoaded([{ id: id, name: name }]);
                hidePanels();
                toast('GPX importiert: ' + name + ' (' + parsed.points.length + ' Punkte)');
                return;
            }

            // ---- Multiple files → bulk import. Each GPX becomes its own saved track. The Tracks panel
            //      stays open through the loop, so the per-file plot/fit doesn't flash on the map; at the
            //      end we overlay them all (plotMultiple) and pre-select them (loadedTrackIds) so one
            //      "Gruppieren" turns the batch into a folder → tour. ----
            const loaded = [], failed = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                toast('Importiere GPX ' + (i + 1) + '/' + files.length + ' …');
                let parsed;
                try { parsed = parseGpx(await file.text()); }
                catch (e) { failed.push(file.name); continue; }
                if (!parsed.points.length) { failed.push(file.name); continue; }
                plotTrack(parsed.points, []);                  // fills the globals saveTrack persists
                currentTrackId = null;                         // fresh row per file (never overwrite)
                const name = parsed.name || file.name.replace(/\.gpx$/i, '') || autoTrackName();
                let id;
                try { id = await saveTrack(name, 'done'); }
                catch (e) { failed.push(file.name); continue; }
                loaded.push({ id: id, name: name, points: parsed.points, waypoints: [] });
            }
            currentTrackId = null; currentTrackName = '';
            if (loaded.length) {
                loadedTrackIds.clear(); loaded.forEach((t) => loadedTrackIds.add(t.id));
                persistLoaded(loaded.map((t) => ({ id: t.id, name: t.name })));
                plotMultiple(loaded);                          // overlay all stages, each its own colour
            }
            hidePanels();
            let msg = loaded.length + ' Etappen importiert.';
            if (failed.length) msg += ' ' + failed.length + ' fehlgeschlagen.';
            if (loaded.length) msg += ' „Tracks" öffnen (vorausgewählt) → Gruppieren.';
            toast(msg);
            try { const rows = await listTracks(); renderTrackList(rows); } catch (e) { /* list refresh best-effort */ }
        });
