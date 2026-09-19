/* Kritik recorder - one spoken remark: microphone, Chrome's live transcript, POST to a review server.
 *
 * Shared by the review tools (the live tour in js/cyber-tour.js now; filmkritik.html has the same logic
 * inline and can move over). The server side is tools/filmkritik.py's /__kritik/* store, also used by
 * tools/tourkritik.py.
 *
 *   const rec = KritikRecorder.create({ onLive: (text, final) => ..., log: dbg });
 *   await rec.start();                  // false if there is no microphone
 *   const r = await rec.stop(true, { t: 12.3, szene: 's4', ... });   // saved -> { items, text }
 *   await rec.stop(false);              // discarded
 *   rec.list() / rec.drop(n) / rec.submit(how) / rec.reopen()
 *
 * The audio file is the ground truth, the transcript a convenience that may be wrong: SpeechRecognition only
 * works in Doc's real Chrome (headless it stays empty), the webm is kept either way (Doc, 18.09.2026: "Sound ...
 * heben wir mal auf").
 */
(function () {
    'use strict';

    function create(opts) {
        const o = Object.assign({ base: '/__kritik', lang: 'de-DE', onLive: function () {}, log: function () {} }, opts || {});
        const R = { recording: false, t0: 0, chunks: [], media: null, stream: null, rec: null, text: '', interim: '', savedAt: 0 };

        async function mic() {
            if (R.stream) return R.stream;
            R.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
            return R.stream;
        }

        function live() {
            o.onLive((R.text + ' ' + R.interim).trim(), false);
        }

        function speechStart() {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) { o.log('Diktat: dieser Browser kann es nicht — nur Ton'); return; }
            const rec = new SR();
            rec.lang = o.lang;
            rec.continuous = true;
            rec.interimResults = true;
            rec.onresult = function (ev) {
                let fin = '', mid = '';
                for (let i = ev.resultIndex; i < ev.results.length; i++) {
                    const r = ev.results[i];
                    if (r.isFinal) fin += r[0].transcript; else mid += r[0].transcript;
                }
                if (fin) R.text = (R.text + ' ' + fin).trim();
                R.interim = mid;
                live();
            };
            rec.onerror = function (e) { o.log('Diktat: ' + e.error); };
            try { rec.start(); R.rec = rec; } catch (e) { o.log('Diktat: ' + e.message); }
        }

        function speechStop() {
            if (!R.rec) return;
            try { R.rec.stop(); } catch (e) { /* already stopped */ }
            R.rec = null;
        }

        async function post(path, body) {
            const res = await fetch(o.base + path, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}),
            });
            if (!res.ok) throw new Error('Server antwortet ' + res.status);
            return res.json();
        }

        return {
            get recording() { return R.recording; },
            get savedAt() { return R.savedAt; },

            async start() {
                if (R.recording) return true;
                R.text = ''; R.interim = ''; R.chunks = [];
                try {
                    const stream = await mic();
                    R.media = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                    R.media.ondataavailable = function (e) { if (e.data.size) R.chunks.push(e.data); };
                    R.media.start();
                } catch (err) {
                    o.log('Mikrofon: ' + err.message);
                    throw new Error('Kein Mikrofon: ' + err.message);
                }
                R.recording = true;
                R.t0 = performance.now();
                speechStart();
                live();
                return true;
            },

            /* keep = false discards (Esc). meta goes to the server with the remark (t, szene, szene_t ...). */
            async stop(keep, meta) {
                if (!R.recording) return null;
                R.recording = false;
                speechStop();
                const dauer = (performance.now() - R.t0) / 1000;
                const blob = await new Promise(function (done) {
                    R.media.onstop = function () { done(new Blob(R.chunks, { type: 'audio/webm' })); };
                    try { R.media.stop(); } catch (e) { done(new Blob(R.chunks, { type: 'audio/webm' })); }
                });
                const text = (R.text + ' ' + R.interim).trim();
                if (!keep) return { discarded: true, text: text };
                const audio = await new Promise(function (done) {
                    const fr = new FileReader();
                    fr.onload = function () { done(fr.result); };
                    fr.readAsDataURL(blob);
                });
                const j = await post('/kommentar', Object.assign({}, meta || {}, { dauer: dauer, text: text, audio: audio }));
                R.savedAt = performance.now();
                return { items: j.items || [], text: text };
            },

            async list() {
                const res = await fetch(o.base + '/liste');
                return res.json();
            },
            async drop(n) { return (await post('/loeschen', { n: n })).items || []; },
            /* the explicit end of a review - the session watches fertig.json instead of guessing */
            async submit(how) { return post('/fertig', how || {}); },
            /* the review goes on after a submit: the server drops fertig.json again */
            reopen() { return post('/weiter', {}).catch(function () {}); },
        };
    }

    window.KritikRecorder = { create: create };
})();
