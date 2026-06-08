// Shared voice-note recorder for the Tracker (voice waypoints). HYBRID:
//   • NATIVE (Capacitor app): records through the `capacitor-voice-recorder` plugin (native
//     AudioRecord). The Android System WebView can't open the mic for getUserMedia (measured:
//     persistent NotReadableError while video works) — same reason the Foto-Spur uses the native
//     @capacitor/camera instead of getUserMedia.
//   • BROWSER: MediaRecorder + getUserMedia (works on localhost/https), mimeType fallback for desktop.
// Hands back a base64 data-URL + duration, ready to ride the existing `waypoints` jsonb like a photo.
//
// IIFE global (like photo-layer.js), NOT an ES module — the tracker loads plain <script>s and the
// plugin is reached via the Capacitor bridge (window.Capacitor.Plugins.VoiceRecorder), not import.
//
// API (window.VoiceNote):
//   isSupported() -> bool
//   start()       -> Promise        (resolves once recording; rejects on mic/permission error)
//   stop()        -> Promise<{ dataUrl, blob, dur, mime }>   (dur in seconds, 1 decimal; blob null on native)
//   cancel()      -> void           (stop + discard, release the mic)
//   isRecording() -> bool
//   elapsedMs()   -> number         (ms since start, for a live timer)
(function (global) {
    'use strict';

    // The native plugin, only when running inside the Capacitor app (else null → browser path).
    function nativeRec() {
        const C = global.Capacitor;
        return (C && C.isNativePlatform && C.isNativePlatform() && C.Plugins && C.Plugins.VoiceRecorder)
            ? C.Plugins.VoiceRecorder : null;
    }

    // Android WebViews often lack audio/webm → try opus variants, then mp4, then the default.
    const MIME_CANDIDATES = [
        'audio/webm;codecs=opus', 'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4;codecs=mp4a.40.2', 'audio/mp4',
        '',
    ];

    let rec = null;        // MediaRecorder (browser path)
    let stream = null;     // the mic MediaStream (browser path)
    let chunks = [];
    let mime = '';
    let startedAt = 0;
    let recording = false;

    function now() { return (global.performance && performance.now) ? performance.now() : 0; }
    function webSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && global.MediaRecorder);
    }
    function isSupported() { return !!nativeRec() || webSupported(); }
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
        const VR = nativeRec();
        if (VR) {
            // NATIVE: ask once (RECORD_AUDIO is in the manifest → instant if already granted), then record.
            try { await VR.requestAudioRecordingPermission(); } catch (_) { /* startRecording will reject if truly denied */ }
            await VR.startRecording();
            mime = '';
            startedAt = now();
            recording = true;
            return;
        }
        // BROWSER:
        if (!webSupported()) throw new Error('Audio-Aufnahme nicht verfügbar (getUserMedia/MediaRecorder fehlt)');
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

    // Stop and resolve with the finished clip. Duration is wall-clock (webm/opus metadata duration is
    // often Infinity; the native plugin gives msDuration but we still fall back to elapsed if missing).
    function stop() {
        const VR = nativeRec();
        if (VR) {
            return VR.stopRecording().then((r) => {
                recording = false;
                const v = (r && r.value) || {};
                const m = v.mimeType || 'audio/aac';
                const dur = (typeof v.msDuration === 'number' && v.msDuration > 0)
                    ? v.msDuration / 1000
                    : (startedAt ? (now() - startedAt) / 1000 : 0);
                const dataUrl = v.recordDataBase64 ? ('data:' + m + ';base64,' + v.recordDataBase64) : '';
                return { dataUrl: dataUrl, blob: null, dur: Math.round(dur * 10) / 10, mime: m };
            }, (e) => { recording = false; throw e; });
        }
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
        const VR = nativeRec();
        if (VR) { try { VR.stopRecording(); } catch (_) { /* ignore */ } recording = false; return; }
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
