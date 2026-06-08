// Shared voice-note recorder for the Tracker (voice waypoints). The MediaRecorder core is lifted
// from HTML/voicerecorder/js/recording.js into a small STANDALONE module (no app/DOM/state coupling),
// so the same Android-tested mimeType fallback drives both. Records a short clip and hands back a
// base64 data-URL + duration, ready to ride the existing `waypoints` jsonb exactly like a photo.
//
// IIFE global (like photo-layer.js), NOT an ES module — the tracker loads plain <script>s.
//
// API (window.VoiceNote):
//   isSupported() -> bool
//   start()       -> Promise         (resolves once recording; rejects on mic/permission error)
//   stop()        -> Promise<{ dataUrl, blob, dur, mime }>   (dur in seconds, 1 decimal)
//   cancel()      -> void            (stop + discard, release the mic — no result)
//   isRecording() -> bool
//   elapsedMs()   -> number          (ms since start, for a live timer)
(function (global) {
    'use strict';

    // Android WebViews often lack audio/webm → try opus variants, then mp4, then the default.
    const MIME_CANDIDATES = [
        'audio/webm;codecs=opus', 'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4;codecs=mp4a.40.2', 'audio/mp4',
        '',
    ];

    let rec = null;        // MediaRecorder
    let stream = null;     // the mic MediaStream (its tracks are stopped when we finish)
    let chunks = [];
    let mime = '';
    let startedAt = 0;
    let recording = false;

    function isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && global.MediaRecorder);
    }
    function now() { return (global.performance && performance.now) ? performance.now() : 0; }
    function pickMime() {
        for (const c of MIME_CANDIDATES) {
            if (c === '' || MediaRecorder.isTypeSupported(c)) return c;
        }
        return '';
    }
    function releaseStream() {
        if (stream) {
            try { stream.getTracks().forEach((t) => t.stop()); } catch (_) { /* ignore */ }
            stream = null;
        }
    }

    async function start() {
        if (recording) return;
        if (!isSupported()) throw new Error('Audio-Aufnahme nicht verfügbar (getUserMedia/MediaRecorder fehlt)');
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const picked = pickMime();
        rec = new MediaRecorder(stream, picked ? { mimeType: picked } : undefined);
        mime = rec.mimeType || picked || 'audio/webm';
        chunks = [];
        rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
        rec.start();
        startedAt = now();
        recording = true;
    }

    // Stop and resolve with the finished clip. Duration is wall-clock (webm/opus metadata
    // duration is often Infinity until fully decoded, so the elapsed time is more reliable).
    function stop() {
        return new Promise((resolve, reject) => {
            if (!rec || !recording) { reject(new Error('keine laufende Aufnahme')); return; }
            const dur = startedAt ? Math.max(0, (now() - startedAt) / 1000) : 0;
            rec.onstop = () => {
                const blob = new Blob(chunks, { type: mime });
                releaseStream();
                recording = false;
                const fr = new FileReader();
                fr.onload = () => resolve({ dataUrl: fr.result, blob: blob, dur: Math.round(dur * 10) / 10, mime: mime });
                fr.onerror = () => reject(fr.error || new Error('FileReader-Fehler'));
                fr.readAsDataURL(blob);
            };
            try { rec.stop(); } catch (e) { releaseStream(); recording = false; reject(e); }
        });
    }

    function cancel() {
        try {
            if (rec && recording) { rec.onstop = function () {}; rec.stop(); }
        } catch (_) { /* ignore */ }
        releaseStream();
        recording = false;
        chunks = [];
    }

    function isRecording() { return recording; }
    function elapsedMs() { return (recording && startedAt) ? (now() - startedAt) : 0; }

    global.VoiceNote = {
        isSupported: isSupported,
        start: start,
        stop: stop,
        cancel: cancel,
        isRecording: isRecording,
        elapsedMs: elapsedMs,
    };
})(window);
