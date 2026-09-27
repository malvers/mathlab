// Doc Alvers Tracker - part 7 of 13: crash-proof buffer, cloud autosync, live broadcast, live media.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---- Crash-proof live buffer (../js/track-buffer.js): persist the in-progress track on
        //      the fly so a close/kill/crash — or a failed offline save — never loses it. ----
        function bufferSnapshot() {
            return {
                v: 1, savedAt: Date.now(), currentTrackId: currentTrackId, name: currentTrackName, startTime: startTime, totalDist: totalDist,
                track: track, times: times, alts: alts, speeds: speeds, activities: activities, temps: temps,
                waypoints: waypoints.map(wpSer),
            };
        }
        function restoreBufferedTrack(buf) {
            if (trkState !== 'idle' || !buf || !Array.isArray(buf.track) || !buf.track.length) return;
            track = buf.track; times = buf.times || []; alts = buf.alts || [];
            speeds = buf.speeds || []; activities = buf.activities || []; temps = buf.temps || []; totalDist = buf.totalDist || 0;
            currentTrackId = buf.currentTrackId || null; currentTrackName = buf.name || ''; // re-save UPDATES the same cloud row (no duplicate)
            (buf.waypoints || []).forEach(w => addWaypoint(w));
            redrawTrack();
            // show the recorded duration; arm pauseStart so CONTINUE doesn't count the closed gap
            const span = (times.length > 1) ? (Date.parse(times[times.length - 1]) - Date.parse(times[0])) : 0;
            startTime = Date.now() - (isFinite(span) && span > 0 ? span : 0);
            pauseStart = Date.now();
            updateDuration();
            setDist(totalDist);
            $('hud-top').classList.add('shown');
            if (window.RainRadar && RainRadar.setShifted) RainRadar.setShifted(true);
            setTrkState('paused'); // → CONTINUE | SPEICHERN
            try { if (track.length) map.fitBounds(L.latLngBounds(track), { padding: fitPad() }); } catch (e) { }
            TrackBuffer.saveNow(bufferSnapshot()); // keep it persisted across the restore
            toast('Ungesicherter Track wiederhergestellt: ' + track.length + ' Punkte. SPEICHERN nicht vergessen.');
        }

        // ---- Stage 2: cloud autosync on the fly — upsert the row every SYNC_MS while recording.
        //      Offline ticks just fail and retry; the local buffer (Stage 1) stays the safety net. ----
        function autoTrackName() {
            return 'Track ' + new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        }
        let syncInflight = false, lastSync = 0, syncTimer = null;
        const SYNC_MS = 20000; // cloud update cadence while recording (battery/data friendly)
        async function doSync() {
            syncTimer = null;
            if (syncInflight || trkState === 'idle' || !track.length) return;
            if (totalDist < 80 && track.length < 15) return; // skip trivial tracks → no empty cloud rows
            syncInflight = true; lastSync = Date.now();
            try { await saveTrack(currentTrackName || autoTrackName(), 'recording'); }
            catch (e) { if (window.DebugWindow) DebugWindow.log('Sync: ' + (e.message || e)); } // offline → retry next tick
            syncInflight = false;
        }
        function scheduleSync() {
            if (syncTimer || syncInflight) return;
            syncTimer = setTimeout(doSync, Math.max(0, SYNC_MS - (Date.now() - lastSync)));
        }

        // ---- Stage 3: live position broadcast over Supabase Realtime *Broadcast* (channel
        //      'live:<token>'). No DB/publication change — Broadcast is ephemeral pub/sub; the
        //      persisted trail still comes from the Stage 2 row, so a viewer gets history + live. ----
        let liveOn = false, liveChannel = null, lastLiveMs = 0, liveTrailTimer = null;
        let liveRejoinTimer = null, liveWasInterrupted = false, liveNetWired = false; // auto-resume after a dead spot
        let liveRejoinMs = 3000; const LIVE_REJOIN_MAX = 30000; // exponential rejoin backoff (reset to 3 s on SUBSCRIBED)
        let liveName = (localStorage.getItem('tracker.liveName') || 'vsb');
        const LIVE_MS = 4000; // position broadcast cadence while live
        function updateLiveBadge() {
            const b = $('live-badge'); if (b) b.classList.toggle('on', liveOn);
            const mb = $('mb-live'); if (mb) mb.classList.toggle('active', liveOn);
        }
        // 'pos' = latest fix (throttled); 'trail' = whole path (so late viewers see the history).
        function broadcastLive(force) {
            if (!liveOn || !liveChannel) return;
            const now = Date.now();
            if (!force && now - lastLiveMs < LIVE_MS) return;
            // Position source: the recorded track's last point, or — when broadcasting WITHOUT recording
            // (idle live-follow, no track) — the last idle GPS fix (lastFix). No fix yet → nothing to send.
            let lat, lng, t = null, speed = null, activity = null, temp = null;
            if (track.length) {
                const i = track.length - 1;
                lat = track[i][0]; lng = track[i][1]; t = times[i] || null;
                speed = speeds[i] != null ? speeds[i] : null; activity = activities[i] || null;
                temp = temps[i] != null ? temps[i] : null;
            } else if (lastFix) {
                lat = lastFix.lat; lng = lastFix.lng; t = lastFix.t;
                speed = (typeof shownSpeed === 'number') ? shownSpeed : null;
                temp = (typeof lastTemp === 'number') ? lastTemp : null;
            } else return;
            lastLiveMs = now;
            // While navigating, ride the ETA along on the same message → the viewer shows "Ankunft …"
            // in its header (note #3). null when no route → viewer hides the ETA line.
            const trip = (__nav && __nav.tripData) ? __nav.tripData([lat, lng]) : null;
            try {
                liveChannel.send({
                    type: 'broadcast', event: 'pos', payload: {
                        lat: lat, lng: lng, t: t,
                        speed: speed, activity: activity, temp: temp,
                        remSec: trip ? Math.round(trip.remSec) : null, remM: trip ? Math.round(trip.remM) : null,
                    },
                });
            } catch (e) { /* channel not joined yet → the next fix retries */ }
        }
        function broadcastTrail() {
            if (!liveOn || !liveChannel) return;
            let pts;
            if (track.length) {
                pts = track.map((p, i) => [p[0], p[1], times[i] || null, speeds[i] != null ? speeds[i] : null, activities[i] || null, temps[i] != null ? temps[i] : null]);
            } else if (lastFix) {
                // Broadcasting without recording: no trail history — send just the current fix as a 1-point trail.
                pts = [[lastFix.lat, lastFix.lng, lastFix.t, (typeof shownSpeed === 'number') ? shownSpeed : null, null, (typeof lastTemp === 'number') ? lastTemp : null]];
            } else return;
            try { liveChannel.send({ type: 'broadcast', event: 'trail', payload: { pts: pts } }); } catch (e) { }
        }
        // ---- live MEDIA over the SAME channel: photo / voice / video. Photos ride as the FULL stored
        //      image (~130–400 KB JPEG, the same the share delivers); voice + video ride as their R2
        //      URLs (tiny), so a big clip never bloats the message — realtime caps a broadcast at 1 MB.
        //      liveMedia keeps the set (one entry per waypoint t) so late viewers are re-sent it (like
        //      the trail). dedup by t.
        let liveMedia = [];
        function broadcastOne(item) {
            if (!liveOn || !liveChannel || !item) return;
            try { liveChannel.send({ type: 'broadcast', event: item.event, payload: item.payload }); } catch (e) { }
        }
        function broadcastMedia() { liveMedia.forEach(broadcastOne); } // re-send all → late viewers catch up
        // Build the {event,payload} for a waypoint, or null if it can't ride live yet (a video still on a
        // local blob: URL is useless to a remote viewer until the R2 upload swapped it for a real URL).
        function liveItemFor(wp) {
            if (!wp || wp.lat == null) return null;
            const lat = wp.lat, lng = wp.lng, t = wp.t, title = wp.title || '', text = wp.text || '';
            if (wp.type === 'voice') {
                if (!wp.audio) return null;
                return { event: 'voice', payload: { lat, lng, t, title, text, type: 'voice', audio: wp.audio, dur: wp.dur || 0, mime: wp.mime || 'audio/webm' } };
            }
            if (wp.type === 'video') {
                if (!wp.video || /^blob:/.test(wp.video)) return null; // wait for the R2 URL
                return { event: 'video', payload: { lat, lng, t, title, text, type: 'video', video: wp.video, mime: wp.mime || 'video/mp4' } };
            }
            if (!wp.img) return null;
            return { event: 'photo', payload: { lat, lng, t, title, text, img: wp.img } };
        }
        function addLiveMedia(wp) {
            if (!liveOn || !liveChannel) return;
            const item = liveItemFor(wp); if (!item) return;
            const i = liveMedia.findIndex(x => x.payload.t === wp.t);
            if (i >= 0) liveMedia[i] = item; else liveMedia.push(item); // update on the AI-title / R2-URL re-send
            broadcastOne(item);
        }
        // LIVE: broadcast your position on a chosen PUBLIC channel name (default "vsb"). Anyone who
        // knows the name and opens view.html?live=<name> (or types it) sees you move. No DB, no token.
        function openLivePanel() {
            const inp = $('live-name'); if (inp) inp.value = liveName;
            showPanel('live-panel');
            if (inp) { inp.focus(); inp.select(); }
        }
        function beginLive(name, copied) {
            const canon = (name || '').trim().toLowerCase() || 'vsb';
            liveName = canon;
            try { localStorage.setItem('tracker.liveName', canon); } catch (e) { }
            // Broadcasting no longer requires an active recording (Doc 2026-07-08): a GPS fix is enough,
            // so you can go live in the normal (idle) mode too. Only bail if we have no position at all.
            if (!track.length && !lastFix) { toast('Warte auf GPS-Position …'); return; }
            liveOn = true; updateLiveBadge();
            liveMedia = [];            // fresh live session
            liveWasInterrupted = false;
            // Auto-resume: a tunnel / dead spot must NOT kill the broadcast for good. When the device
            // comes back online, force a rejoin. Wired once.
            if (!liveNetWired) {
                liveNetWired = true;
                window.addEventListener('online', () => { if (liveOn) scheduleRejoin(200); });
            }
            joinLive();
            if (liveTrailTimer) clearInterval(liveTrailTimer);
            // refresh the path every 15 s AND double as a watchdog: if the channel is no longer joined
            // (dropped in a dead spot) rebuild it, instead of silently sending into the void. Media is
            // NOT re-sent on a timer (that was the egress leak) — a (re)connecting viewer pulls it via 'request'.
            liveTrailTimer = setInterval(() => {
                if (!liveOn) return;
                if (liveChannel && liveChannel.state && liveChannel.state !== 'joined') { scheduleRejoin(0); return; }
                broadcastTrail();
            }, 15000);
            toast("Live auf '" + canon + "'" + (copied ? ' · Link kopiert ✓' : ' — Namen weitersagen'));
        }
        // (Re)create + subscribe the live channel. Called on start and on every rejoin (so a dropped
        // channel is rebuilt from scratch — the safest way to recover with supabase-js).
        async function joinLive() {
            try {
                const c = await ensureSb();
                try { if (liveChannel) c.removeChannel(liveChannel); } catch (e) { } // drop the stale channel first
                const ch = c.channel('live:' + liveName, { config: { broadcast: { self: false } } });
                // A (re)connecting viewer asks for the current state → re-send the whole trail + latest pos + media.
                ch.on('broadcast', { event: 'request' }, () => {
                    if (window.DebugWindow) DebugWindow.log('live: ◀ request → sende trail/pos/media (' + track.length + ' pts)');
                    broadcastTrail(); broadcastLive(true); waypoints.forEach(addLiveMedia);
                });
                ch.subscribe((status) => {
                    if (window.DebugWindow) DebugWindow.log('live: status=' + status + ' (live:' + liveName + ')');
                    if (status === 'SUBSCRIBED') {
                        if (liveWasInterrupted) { liveWasInterrupted = false; toast('Live wieder verbunden.'); }
                        liveRejoinMs = 3000; // reconnected → reset the rejoin backoff
                        updateLiveBadge();
                        broadcastTrail(); broadcastLive(true); waypoints.forEach(addLiveMedia);
                    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                        liveWasInterrupted = true; updateLiveBadge();
                        if (liveOn) scheduleRejoin(); // exponential backoff inside; keeps trying while still live
                    }
                });
                liveChannel = ch;
            } catch (e) {
                if (window.DebugWindow) DebugWindow.log('live: join-Fehler ' + (e.message || e));
                if (liveOn) scheduleRejoin();
            }
        }
        // One pending rejoin at a time, with EXPONENTIAL backoff (3 s → 30 s) — reset to 3 s on SUBSCRIBED.
        // Also gated by the central breaker: while Supabase is 402-locked / offline, don't reconnect — just
        // re-check later, so there is no websocket-reconnect storm during the outage (egress audit fix B).
        function scheduleRejoin(delay) {
            if (!liveOn || liveRejoinTimer) return;
            const wait = (delay != null) ? delay : liveRejoinMs;
            liveRejoinTimer = setTimeout(() => {
                liveRejoinTimer = null;
                if (!liveOn) return;
                liveRejoinMs = Math.min(liveRejoinMs * 2, LIVE_REJOIN_MAX); // grow for the next attempt
                if (window.SupaGate && !window.SupaGate.ok()) { scheduleRejoin(liveRejoinMs); return; } // breaker open → wait
                joinLive();
            }, wait);
        }
        function stopLive(silent) {
            if (liveTrailTimer) { clearInterval(liveTrailTimer); liveTrailTimer = null; }
            if (liveRejoinTimer) { clearTimeout(liveRejoinTimer); liveRejoinTimer = null; }
            if (liveChannel) {
                try { liveChannel.send({ type: 'broadcast', event: 'end', payload: {} }); } catch (e) { }
                try { liveChannel.unsubscribe(); } catch (e) { }
            }
            liveChannel = null; liveOn = false; liveWasInterrupted = false;
            updateLiveBadge();
            if (!silent) toast('Live beendet.');
        }
