// Doc Alvers Tracker - part 9 of 13: save queue, Umkreis search, folders, multi-select, last loaded, import from a friend.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---- Durable save queue (Doc 2026-07-05) --------------------------------------------------
        //  A finished track that fails to save (offline / breaker-open) is written to a multi-slot
        //  IndexedDB OUTBOX (track-buffer.js) and lifted to the cloud from there. Unlike the single
        //  'active' crash slot it can NEVER be clobbered by the next recording, and it is auto-retried
        //  whenever the network returns — so a recorded track can no longer be silently lost (the
        //  21.06 case). Uploads are idempotent (a fixed local id → upsert the SAME row, no duplicates)
        //  and go through the central breaker via ensureSb. The online happy path stays plain saveTrack.
        let _flushingOutbox = false, _outboxTimer = null, _outboxCount = 0;
        function genLocalId() {
            try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) { }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) {
                const r = Math.floor(Math.random() * 16), v = (ch === 'x') ? r : ((r & 0x3) | 0x8);
                return v.toString(16);
            });
        }
        // Upload ONE queued entry from its self-contained snapshot (independent of the live globals),
        // upserting by its stable id so a retry updates the SAME cloud row instead of duplicating it.
        async function uploadQueuedEntry(entry) {
            const c = await ensureSb();
            const s = entry.snapshot || {};
            const tk = s.track || [];
            const pts = tk.map(function (p, i) {
                return [p[0], p[1], (s.times && s.times[i]) || null,
                    (s.alts && s.alts[i] != null) ? s.alts[i] : null,
                    (s.speeds && s.speeds[i] != null) ? s.speeds[i] : null,
                    (s.activities && s.activities[i]) || null,
                    (s.temps && s.temps[i] != null) ? s.temps[i] : null];
            });
            const wps = (s.waypoints || []).map(function (w) { return wpSer(w, true); }); // drop base64 for the cloud copy
            const row = { id: entry.id, name: s.name || autoTrackName(), distance_m: Math.round(s.totalDist || 0), points: pts, waypoints: wps, status: 'done' };
            const missingCol = function (e) { return e && /status/i.test(e.message || ''); };
            let { error } = await c.from('tracks').upsert(row);
            if (missingCol(error)) { const { status: _s, ...bare } = row; ({ error } = await c.from('tracks').upsert(bare)); }
            if (error) throw error;
        }
        // Drain the outbox: upload each queued track, remove it on success. Stop on the first failure
        // (offline / breaker-open / 402) and retry on the next trigger. Guarded against re-entry.
        async function flushOutbox() {
            if (_flushingOutbox) return;
            if (typeof navigator !== 'undefined' && navigator.onLine === false) { refreshOutboxCount(); return; }
            if (typeof TrackBuffer === 'undefined' || !TrackBuffer.outbox) return;
            _flushingOutbox = true;
            try {
                const entries = await TrackBuffer.outbox.all();
                _outboxCount = entries.length; updateSaveBadge();
                for (let k = 0; k < entries.length; k++) {
                    try {
                        await uploadQueuedEntry(entries[k]);
                        await TrackBuffer.outbox.del(entries[k].id);
                        _outboxCount = Math.max(0, _outboxCount - 1); updateSaveBadge();
                        if (window.DebugWindow) DebugWindow.log('outbox: uploaded ' + (entries[k].snapshot && entries[k].snapshot.name || entries[k].id));
                    } catch (e) { if (window.DebugWindow) DebugWindow.log('outbox: retry later (' + (e.message || e) + ')'); break; }
                }
            } catch (e) { if (window.DebugWindow) DebugWindow.log('outbox flush: ' + (e.message || e)); }
            finally { _flushingOutbox = false; refreshOutboxCount(); }
        }
        function scheduleFlush(delay) {
            if (_outboxTimer) return;
            _outboxTimer = setTimeout(function () { _outboxTimer = null; flushOutbox(); }, delay || 1500);
        }
        async function refreshOutboxCount() {
            try {
                if (typeof TrackBuffer !== 'undefined' && TrackBuffer.outbox) _outboxCount = (await TrackBuffer.outbox.all()).length;
            } catch (e) { }
            updateSaveBadge();
        }
        // Unmissable pending indicator (persists until the queue drains — not just a vanishing toast).
        // Tap → force a retry now. Created lazily; lives on <body>, styled via #save-badge in tracker.css.
        function updateSaveBadge() {
            let el = $('save-badge');
            if (!el) {
                el = document.createElement('button');
                el.id = 'save-badge'; el.type = 'button';
                el.setAttribute('aria-label', 'Nicht hochgeladene Tracks – jetzt erneut hochladen');
                el.addEventListener('click', function () { toast('Lade hoch …'); flushOutbox(); });
                document.body.appendChild(el);
            }
            if (_outboxCount > 0) { el.textContent = '⬆ ' + _outboxCount + ' nicht hochgeladen'; el.classList.add('shown'); }
            else { el.classList.remove('shown'); }
        }
        // Startup + connectivity triggers (after the state `let`s above → no TDZ at load): show any
        // pending count at once, drain shortly after start, and retry on reconnect / on a gentle interval.
        refreshOutboxCount();
        scheduleFlush(2500);
        try { window.addEventListener('online', function () { flushOutbox(); }); } catch (e) { }
        setInterval(function () { flushOutbox(); }, 60000);

        // ---- Umkreis-Suche (Doc 2026-06-17): show only tracks whose START is within N km of here. ----
        let _lastTrackRows = [];      // last rows handed to renderTrackList → re-render when the radius changes
        let trackStartCache = null;   // id → [lat,lng] first point (lazy; rebuilt whenever the list is refreshed)
        let listRadiusKm = 0;         // 0 = Alle; else 10/20/30
        let _folders = [];            // track_folders rows [{id,name}] → collapsible sections in the list
        // Persisted set of EXPANDED folder ids/keys (manual folders by uuid, auto folders by string
        // key). Default = NOT in the set = collapsed → every folder starts closed, and whatever the
        // user opens survives a reload.
        const OPEN_FOLDERS_KEY = 'trk-open-folders';
        const _openFolders = (function () {
            try { const a = JSON.parse(localStorage.getItem(OPEN_FOLDERS_KEY) || '[]'); return new Set(Array.isArray(a) ? a : []); }
            catch (e) { return new Set(); }
        })();
        function saveOpenFolders() {
            try { localStorage.setItem(OPEN_FOLDERS_KEY, JSON.stringify(Array.from(_openFolders))); } catch (e) { /* quota / private mode */ }
        }

        // Fetch ONLY each track's first point (server-side points->0 → tiny payload, NOT the heavy points
        // column → no egress blow-up like the base64 incident). Builds the id→[lat,lng] start map.
        async function loadTrackStarts() {
            const c = await ensureSb();
            const { data, error } = await c.from('tracks').select('id, startpt:points->0');
            if (error) throw error;
            const m = {};
            for (const r of (data || [])) {
                const p = r.startpt;
                if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') m[r.id] = [p[0], p[1]];
            }
            trackStartCache = m;
            if (window.DebugWindow) DebugWindow.log('umkreis: ' + Object.keys(m).length + ' Startpunkte geladen');
            return m;
        }

        async function listTracks() {
            trackStartCache = null;   // list refreshed → start points may have changed (new/removed track)
            const c = await ensureSb();
            // COMPLETENESS first: a basic list of ALL tracks (tiny — no heavy points/waypoints columns) is the
            // source of truth so nothing can be hidden ("a tracker must not make tracks vanish"). The
            // list_tracks() RPC only ENRICHES (server-computed km·duration·photos) — it must NOT be allowed to
            // DROP one-point tracks (single photo/voice), which it apparently did (Doc 2026-06-23: Einzelfotos
            // fehlten in der Liste). So: start from the basic list, prefer the rich RPC row where present.
            // Try WITH folder_id (grouping). If the column isn't migrated yet the query errors →
            // retry WITHOUT it so the list ALWAYS loads (a tracker must not make tracks vanish).
            let base, be;
            ({ data: base, error: be } = await c.from('tracks')
                .select('id, name, created_at, distance_m, folder_id')
                .order('created_at', { ascending: false }));
            if (be) {
                ({ data: base, error: be } = await c.from('tracks')
                    .select('id, name, created_at, distance_m')
                    .order('created_at', { ascending: false }));
            }
            if (be) throw be;
            try { await loadFolders(); } catch (e) { _folders = []; }   // folders best-effort; tracks still show
            let rich = null;
            try { const { data, error } = await c.rpc('list_tracks'); if (!error && Array.isArray(data)) rich = data; } catch (e) { }
            if (!rich) return base || [];
            const byId = {};
            rich.forEach((r) => { byId[r.id] = r; });
            // every track shown; enriched when the RPC has it — but ALWAYS keep folder_id from the base
            // row (the RPC doesn't return it, so a naive replace would silently drop the grouping).
            return (base || []).map((r) => { const rr = byId[r.id]; return rr ? Object.assign({}, rr, { folder_id: r.folder_id }) : r; });
        }

        // ---- Folders: group tracks into renamable sections (track_folders table + tracks.folder_id) ----
        async function loadFolders() {
            const c = await ensureSb();
            // share_slug added by the "Website erstellen" migration; select defensively so the list still
            // loads if that column isn't there yet (retry without it on error).
            let data, error;
            ({ data, error } = await c.from('track_folders').select('id, name, created_at, share_slug').order('created_at'));
            if (error) ({ data, error } = await c.from('track_folders').select('id, name, created_at').order('created_at'));
            if (error) throw error;
            _folders = data || [];
            return _folders;
        }
        async function createFolder(name) {
            const c = await ensureSb();
            const { data, error } = await c.from('track_folders').insert({ name: name }).select('id').single();
            if (error) throw error;
            return data.id;
        }
        async function renameFolder(id, name) {
            const c = await ensureSb();
            const { error } = await c.from('track_folders').update({ name: name }).eq('id', id);
            if (error) throw error;
        }
        // Dissolve a folder: deletes only the folder row. tracks.folder_id has ON DELETE SET NULL,
        // so its tracks return to the main list — they are NEVER deleted.
        async function deleteFolder(id) {
            const c = await ensureSb();
            const { error } = await c.from('track_folders').delete().eq('id', id);
            if (error) throw error;
        }
        async function assignFolder(ids, folderId) {
            if (!ids.length) return;
            const c = await ensureSb();
            const { error } = await c.from('tracks').update({ folder_id: folderId }).in('id', ids);
            if (error) throw error;
        }

        async function fetchTrack(id) {
            const c = await ensureSb();
            const { data, error } = await c.from('tracks').select('points, waypoints').eq('id', id).single();
            if (error) throw error;
            return { points: data.points || [], waypoints: data.waypoints || [] };
        }

        // Share a track: ensure it has an unguessable share token (owner-only RPC), then hand the
        // read-only view link to the OS share sheet (or clipboard). Revoke later = clear share_id.
        const SHARE_BASE = 'https://docalvers.de/tracker/view.html';
        async function shareTrack(id, name) {
            toast('Link wird erstellt …');
            let token;
            try {
                const c = await ensureSb();
                const { data, error } = await c.rpc('ensure_track_share', { p_track_id: id });
                if (error) throw error;
                token = data;
            } catch (e) { toast('Teilen fehlgeschlagen: ' + (e.message || e)); return; }
            if (!token) { toast('Kein Link (nicht dein Track?).'); return; }
            const url = SHARE_BASE + '?s=' + token;
            // Always copy to the clipboard FIRST (so the link is safe even if the share sheet is
            // cancelled), THEN open the OS share sheet on top of that.
            let copied = false;
            try { await navigator.clipboard.writeText(url); copied = true; } catch (e) { /* no clipboard perm */ }
            try { if (navigator.share) await navigator.share({ title: name || 'Track', text: name || 'Mein Track', url }); } catch (e) { /* user cancelled */ }
            toast(copied ? 'Link kopiert.' : 'Link erstellt.');
        }

        // Bundle several tracks into ONE share link (?s=tok1,tok2,…) → view.html overlays them.
        // `title` is passed to the OS share sheet as the sheet title — most e-mail targets adopt it
        // as the SUBJECT (not guaranteed by the Web Share API; some apps ignore it). A folder share
        // passes the folder name here so the mail arrives titled like the group.
        async function shareMultiple(ids, title) {
            if (!ids.length) return;
            toast('Link wird erstellt …');
            const tokens = [];
            try {
                const c = await ensureSb();
                for (const id of ids) {
                    const { data, error } = await c.rpc('ensure_track_share', { p_track_id: id });
                    if (error) throw error;
                    if (data) tokens.push(data);
                }
            } catch (e) { toast('Teilen fehlgeschlagen: ' + (e.message || e)); return; }
            if (!tokens.length) { toast('Kein Link (nicht deine Tracks?).'); return; }
            const url = SHARE_BASE + '?s=' + tokens.join(',');
            const subject = title || (tokens.length + ' Tracks');
            // Copy to clipboard FIRST (survives a cancelled share sheet), THEN open the share sheet.
            let copied = false;
            try { await navigator.clipboard.writeText(url); copied = true; } catch (e) { /* no clipboard perm */ }
            try { if (navigator.share) await navigator.share({ title: subject, text: subject, url }); } catch (e) { /* user cancelled */ }
            toast(copied ? 'Link kopiert.' : 'Link erstellt.');
        }

        // ⚠️ DEBUG / DEV SAFETY MODE — TEMPORARY, not the final behaviour.
        // While testing the tracker we keep cloud deletion OFF so NOTHING in Supabase can be lost
        // (Doc's call after two data-loss scares on 2026-06-07). Before production this must be
        // re-armed: set ALLOW_DELETE = true, or replace with a proper soft-delete / admin tool.
        // Gates removeTrack() → covers BOTH the LADEN × and the DISCARD button; while false the
        // × button isn't even rendered.
        const ALLOW_DELETE = true; // ← re-enabled on Doc's request (trash-can per row; still behind a "Track löschen?" confirm)
        async function removeTrack(id) {
            if (!ALLOW_DELETE) return; // hard gate: no row is ever deleted while disabled
            const c = await ensureSb();
            const { error } = await c.from('tracks').delete().eq('id', id);
            if (error) throw error;
        }

        // Diagnostic switch: flip to true to re-surface the plotTrack nav/media DebugWindow logs
        // (kept dormant, not deleted — handy the next time a load/navigate/pin issue needs measuring).
        const PLOT_DEBUG = false;

        // Plot a loaded track onto the map (replaces the current line + photo pins)
        function plotTrack(points, wps) {
            // Loading a track must NOT get yanked back to the live position: stop the initial
            // position-acquire watch and turn off auto-follow so the track stays in view.
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
            setFollowing(false);
            const latlngs = points.map(p => [p[0], p[1]]);
            track = latlngs.map(ll => [ll[0], ll[1]]);
            times = points.map(p => p[2] || null);
            alts = points.map(p => (p[3] != null ? p[3] : null));   // older tracks have no p[3] → null
            resetDem(); // a freshly loaded track has no DEM lookup yet
            smoothOn = false; const _sb = $('mb-smooth'); if (_sb) _sb.classList.remove('active'); // fresh load starts unsmoothed
            speeds = points.map(p => (p[4] != null ? p[4] : null));
            activities = points.map(p => (p[5] != null ? p[5] : null)); // travel mode (older tracks → null)
            temps = points.map(p => (p[6] != null ? p[6] : null));      // ambient °C (older tracks → null)
            totalDist = 0;
            for (let i = 1; i < latlngs.length; i++) totalDist += haversine(latlngs[i - 1], latlngs[i]);
            redrawTrack(); // speed-coloured
            clearWaypoints();
            if (__media && __media.setFilterActive) __media.setFilterActive(false); // single load → always show its pins
            (wps || []).forEach(w => addWaypoint(w));
            setDist(totalDist);
            // Loaded track has no live speed → show its AVERAGE (distance/time, same as the stats panel)
            // with a Ø symbol so it reads clearly as an average, not a live value.
            Hud.setSpeedAvg(trackStats().avgKmh);
            // show the loaded track's last known altitude (if any)
            const lastAlt = alts.slice().reverse().find(a => a != null);
            fusedAlt = (lastAlt != null) ? lastAlt : null;
            renderAltitude();
            // Navigate to the loaded track. A real route → fit its bounds. A ONE-POINT item (a lone
            // photo / voice / video) → fitBounds on a zero-size bounds over-zooms to grey tiles and can
            // fail to move, so pan+zoom to the single point instead. If the point only lives in the
            // waypoint (no route point), use that so clicking the orphan still navigates.
            const zoomTo = (ll) => map.setView(ll, Math.max(map.getZoom() || 0, 16));
            if (PLOT_DEBUG && window.DebugWindow) { const _c0 = map.getCenter(); DebugWindow.log('plotTrack nav: pts=' + latlngs.length
                + ' target=' + (latlngs[0] ? latlngs[0][0].toFixed(5) + ',' + latlngs[0][1].toFixed(5)
                    : (wps && wps[0] ? wps[0].lat + ',' + wps[0].lng : '—'))
                + ' from=' + _c0.lat.toFixed(5) + ',' + _c0.lng.toFixed(5) + '@z' + map.getZoom()); }
            if (latlngs.length > 1) map.fitBounds(L.latLngBounds(latlngs), { padding: fitPad() });
            else if (latlngs.length === 1) zoomTo(latlngs[0]);
            else if (wps && wps.length && wps[0].lat != null) zoomTo([wps[0].lat, wps[0].lng]);
            if (PLOT_DEBUG && window.DebugWindow) { const c = map.getCenter(); DebugWindow.log('plotTrack nav → now ' + c.lat.toFixed(5) + ',' + c.lng.toFixed(5) + '@z' + map.getZoom()); }
            if (PLOT_DEBUG && window.DebugWindow && __media && __media.mediaDebug) DebugWindow.log('plotTrack media: ' + __media.mediaDebug());
            loadedBounds = null; // single load uses the live 'track' array for FIT, not a multi-overlay bound
            refreshRecenter(); // loaded track may have ≥10 pts → reveal the FIT button (moveend alone isn't reliable)
        }

        // ---- Multi-select: load several tracks at once (checkbox per row → coloured overlay) ----
        const selectedTracks = new Set();   // current checkbox selection
        const loadedTrackIds = new Set();   // ids on the map now → pre-checked when the panel reopens
        function updateLoadSel() {
            const btn = $('tl-loadsel'), acts = $('tl-actions');
            if (btn) btn.textContent = 'Laden (' + selectedTracks.size + ')';
            if (acts) acts.classList.toggle('show', selectedTracks.size > 0);
        }
        function deselectAll() {
            selectedTracks.clear();
            document.querySelectorAll('#track-list-items .tl-check').forEach((c) => { c.checked = false; });
            updateLoadSel();
        }
        // Stats for a track from its raw points ([lat,lng,tIso,…]) — format-independent, so it works
        // for the click-to-identify popup without needing the list's server-computed row.
        // "3.14 km · 1:23 h · 4.8 km/h · 📷 6" from TrackOverlay.statsFromPoints() output ({distM,durMs}).
        // App-specific formatting (fmtDur "min/h") stays here; the number-crunching is shared.
        function trackStatsLine(st, photoCount) {
            const km = st.distM / 1000;
            const parts = [];
            if (km >= 0.01) parts.push(km.toFixed(2) + ' km');
            if (st.durMs > 0) parts.push(fmtDur(Math.round(st.durMs / 1000)));
            if (st.durMs > 0 && km > 0) parts.push((km / (st.durMs / 3600000)).toFixed(1) + ' km/h');
            if (photoCount) parts.push('📷 ' + photoCount);
            return parts.join(' · ');
        }

        // Overlay several loaded tracks, each in its own colour; fit the map to them all.
        function plotMultiple(loaded) {
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
            setFollowing(false);
            trackLayer.clearLayers(); clearWaypoints();
            if (__media && __media.setFilterActive) __media.setFilterActive(true); // overlay → declutter via the media filter
            track = []; times = []; alts = []; speeds = []; activities = []; temps = []; totalDist = 0;
            resetDem();
            currentTrackId = null; currentTrackName = '';
            const all = [];
            loaded.forEach((t) => {
                const pts = (t.points || []).filter(p => p && p[0] != null);
                if (pts.length) {
                    // Speed-coloured line + click-to-identify popup: SAME shared glue the viewer/tour use
                    // (TrackOverlay.drawStage) — the app no longer keeps its own copy. Media pins stay on
                    // the app's own filter-aware addWaypoint below.
                    const label = ((t.name || '').replace(/^Track\s+/, '') || 'Track');
                    const metaTxt = trackStatsLine(TrackOverlay.statsFromPoints(pts), (t.waypoints || []).length);
                    TrackOverlay.drawStage(map, trackLayer, pts, { usesHotline, name: label, meta: metaTxt }).forEach(p => all.push(p));
                }
                (t.waypoints || []).forEach(w => addWaypoint(w));
            });
            setDist(0); setSpeed(0);
            loadedBounds = all.length ? L.latLngBounds(all) : null;
            if (all.length) map.fitBounds(loadedBounds, { padding: fitPad() });
            refreshRecenter(); // multi-loaded overlay → reveal the FIT button (track[] is empty for multi-load)
        }
        if ($('tl-deselect')) $('tl-deselect').addEventListener('click', deselectAll);
        if ($('tl-sharesel')) $('tl-sharesel').addEventListener('click', () => shareMultiple(Array.from(selectedTracks)));
        // "In Ordner …": move the checked tracks into an existing folder OR a new one (the picker offers
        // both) — this replaced the separate "Gruppieren" button, which only ever made a NEW folder.
        if ($('tl-move')) $('tl-move').addEventListener('click', async () => {
            const ids = Array.from(selectedTracks);
            if (!ids.length) return;
            const choice = await uiPickFolder(_folders);
            if (!choice) return;
            let fid, fname;
            if (choice.new) {
                fname = await uiPrompt('Ordnername:', { value: 'Neuer Ordner', okText: 'Anlegen' });
                if (!fname) return;
                try { fid = await createFolder(fname); } catch (e) { toast('Anlegen fehlgeschlagen: ' + (e.message || e)); return; }
            } else {
                fid = choice.id;
                fname = (_folders.find((f) => f.id === fid) || {}).name || 'Ordner';
            }
            try { await assignFolder(ids, fid); } catch (e) { toast('Verschieben fehlgeschlagen: ' + (e.message || e)); return; }
            toast(ids.length + ' → „' + fname + '"');
            try { const rows = await listTracks(); renderTrackList(rows); } catch (e) { /* refresh best-effort */ }
        });
        if ($('tl-loadsel')) $('tl-loadsel').addEventListener('click', async () => {
            const ids = Array.from(selectedTracks);
            if (!ids.length) return;
            toast('Lade ' + ids.length + ' Tracks …');
            const nameById = {}; _lastTrackRows.forEach((r) => { nameById[r.id] = r.name || ''; }); // for click-to-identify popups
            const loaded = [];
            // Keep id+name WITH each loaded track so the map popup can name it (and a failed fetch
            // just drops that one — no index drift between ids[] and loaded[]).
            for (const id of ids) { try { const t = await fetchTrack(id); loaded.push({ id: id, name: nameById[id] || '', points: t.points, waypoints: t.waypoints }); } catch (e) { /* skip a failed one */ } }
            loadedTrackIds.clear(); ids.forEach((id) => loadedTrackIds.add(id));   // remember for re-open
            persistLoaded(ids.map((id) => ({ id: id, name: nameById[id] || '' }))); // survive a reload (name too)
            plotMultiple(loaded);
            hidePanels();
            toast(loaded.length + ' Tracks geladen.');
        });

        // ---- Persist the LAST LOADED track(s) across reloads. Stores just the id(s) (+ name for a
        //      single track) in localStorage; the data is re-fetched from the cloud on startup IF
        //      there is no in-progress recording buffer (a recording takes priority). clearTrack()
        //      forgets it, so a discarded/cleared track does not come back. ----
        const LAST_LOADED_KEY = 'tracker.lastLoaded';
        function persistLoaded(arr) {
            try { localStorage.setItem(LAST_LOADED_KEY, JSON.stringify(arr || [])); } catch (e) { /* quota / private mode */ }
        }
        function clearLoaded() {
            try { localStorage.removeItem(LAST_LOADED_KEY); } catch (e) { }
        }
        async function restoreLastLoaded() {
            let arr;
            try { arr = JSON.parse(localStorage.getItem(LAST_LOADED_KEY) || '[]'); } catch (e) { arr = []; }
            if (!Array.isArray(arr) || !arr.length) return;
            const ok = [];
            for (const it of arr) {
                try { const t = await fetchTrack(it.id); ok.push({ id: it.id, name: it.name || '', t: t }); }
                catch (e) { /* track gone / no access → skip it */ }
            }
            if (!ok.length) { clearLoaded(); return; } // all gone → forget
            loadedTrackIds.clear(); ok.forEach((o) => loadedTrackIds.add(o.id));
            if (ok.length === 1) {
                plotTrack(ok[0].t.points, ok[0].t.waypoints);
                currentTrackId = ok[0].id; currentTrackName = ok[0].name;
            } else {
                plotMultiple(ok.map((o) => ({ id: o.id, name: o.name, points: o.t.points, waypoints: o.t.waypoints })));
            }
            if (window.DebugWindow) DebugWindow.log('Geladenen Track wiederhergestellt (' + ok.length + ').');
        }

        // ---- Import a friend's shared track (?import=<token>) into MY account as a copy I own ----
        // Opened from the read-only viewer's "In meinen Tracker laden" button. We pull the shared row
        // via the SAME public RPC the viewer uses, plot it, then INSERT it as a fresh track under MY
        // login (currentTrackId=null → saveTrack inserts, it never touches the friend's row). It then
        // appears in "Tracks laden", survives a reload, and can be exported / overlaid with our own.
        async function importShared(token) {
            toast('Geteilten Track wird geladen …');
            let row;
            try {
                const c = await ensureSb();
                const { data, error } = await c.rpc('get_shared_track', { p_token: token });
                if (error) throw error;
                row = data;
            } catch (e) { toast('Import fehlgeschlagen: ' + (e.message || e)); return; }
            if (!row) { toast('Track nicht gefunden — Link ungültig oder widerrufen.'); return; }
            plotTrack(row.points || [], row.waypoints || []);
            currentTrackId = null;                          // not my row yet → save INSERTS a copy I own
            const name = row.name || autoTrackName();
            $('hud-top').classList.add('shown');            // reveal the header for the loaded track
            let id;
            try { id = await saveTrack(name, 'done'); }
            catch (e) { currentTrackName = name; toast('Geladen, Speichern fehlgeschlagen: ' + (e.message || e)); return; }
            currentTrackId = id; currentTrackName = name;
            loadedTrackIds.clear(); loadedTrackIds.add(id);
            persistLoaded([{ id: id, name: name }]);        // survive a reload like any loaded track
            toast('In deinen Tracker importiert: ' + name);
            // Refresh + reopen the "Tracks laden" list so the imported copy appears IMMEDIATELY
            // (pre-selected via loadedTrackIds) — before, it only showed after manually reopening.
            try { const rows = await listTracks(); renderTrackList(rows); showPanel('track-list'); } catch (e) { /* list refresh is best-effort */ }
        }

        // Styled folder picker (move selection into a folder). Lists existing folders + a "new folder"
        // entry. Resolves { id } for an existing folder, { new: true } to create one, or null on cancel.
        function uiPickFolder(folders) {
            return new Promise((resolve) => {
                const ov = document.createElement('div');
                ov.className = 'ui-modal-ov';
                const box = document.createElement('div'); box.className = 'ui-modal'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
                const msg = document.createElement('div'); msg.className = 'ui-modal-msg'; msg.textContent = 'Verschieben nach …';
                const list = document.createElement('div'); list.className = 'ui-pick-list';
                let done = false;
                function close(v) { if (done) return; done = true; ov.classList.remove('shown'); document.removeEventListener('keydown', onKey); setTimeout(() => ov.remove(), 200); resolve(v); }
                function onKey(e) { if (e.key === 'Escape') close(null); }
                (folders || []).forEach((f) => {
                    const b = document.createElement('button'); b.type = 'button'; b.className = 'ui-pick-item';
                    b.textContent = f.name;
                    b.onclick = () => close({ id: f.id });
                    list.appendChild(b);
                });
                const nb = document.createElement('button'); nb.type = 'button'; nb.className = 'ui-pick-item ui-pick-new';
                nb.textContent = '＋ Neuer Ordner …';
                nb.onclick = () => close({ new: true });
                list.appendChild(nb);
                const btns = document.createElement('div'); btns.className = 'ui-modal-btns';
                const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'ui-btn ui-btn-cancel'; cancel.textContent = 'Abbrechen';
                cancel.onclick = () => close(null);
                btns.appendChild(cancel);
                box.appendChild(msg); box.appendChild(list); box.appendChild(btns);
                ov.appendChild(box);
                ov.onclick = (e) => { if (e.target === ov) close(null); };
                document.addEventListener('keydown', onKey);
                document.body.appendChild(ov);
                requestAnimationFrame(() => ov.classList.add('shown'));
            });
        }
