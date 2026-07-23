/* ============================================================
   KAIMBO audio — playback (stored WAVs first, Web Speech API
   as fallback), the 'dong' error sound, and the recorder
   (mic → PCM → WAV blob, stored via KB.store.saveSound with
   the original naming <Speaker>_<text>_<voice>.wav).
   ============================================================ */
'use strict';

KB.audio = { currentAudio: null };

/* ---------------- playback ---------------- */
// Play the language row of a task: prefer a stored sound file, else speech synthesis.
KB.audio.playTask = async function (task, lang) {
    const text = KB.txt(task, lang);
    if (!text || text === '-') return;
    const url = await KB.store.soundURL(lang, task);
    if (url) { KB.audio.playUrl(url); return; }
    KB.audio.speak(text, KB.langVoice(lang));
};

KB.audio.playUrl = function (url) {
    if (KB.audio.currentAudio) { try { KB.audio.currentAudio.pause(); } catch (e) { } }
    const a = new Audio(url);
    KB.audio.currentAudio = a;
    a.play().catch(e => KB.dbg('audio play: ' + e.message));
};

// speech synthesis with a female-leaning voice pick per language code
KB.audio.pickVoice = function (langCode) {
    const voices = speechSynthesis.getVoices();
    const exact = voices.filter(v => v.lang.replace('_', '-') === langCode);
    const loose = voices.filter(v => v.lang.slice(0, 2) === langCode.slice(0, 2));
    const pool = exact.length ? exact : loose;
    if (!pool.length) return null;
    const female = pool.find(v => /female|anna|petra|alice|monica|paulina|amelie|kyoko|luciana|joana|milena|zuzana|ellen|samantha|serena/i.test(v.name));
    return female || pool[0];
};

KB.audio.speak = function (text, langCode, onend) {
    try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = langCode;
        const v = KB.audio.pickVoice(langCode);
        if (v) u.voice = v;
        if (onend) u.onend = onend;
        speechSynthesis.speak(u);
    } catch (e) { KB.dbg('speak: ' + e.message); if (onend) onend(); }
};

// speak and resolve when finished (used by the simulator play mode)
KB.audio.speakAsync = (text, langCode) => new Promise(res => {
    if (!text || text === '-') { res(); return; }
    KB.audio.speak(text, langCode, res);
    // safety timeout — some browsers occasionally drop the end event
    setTimeout(res, 1500 + text.length * 220);
});

/* ---------------- dong (wrong answer) ---------------- */
KB.audio.dong = async function () {
    // try the original dong3.wav from the data folder (URL cached once), else a WebAudio thunk
    if (KB.audio.dongUrl) { KB.audio.playUrl(KB.audio.dongUrl); return; }
    const sdir = await KB.store.subdir('sounds');
    if (sdir) {
        try {
            const f = await (await sdir.getFileHandle('dong3.wav')).getFile();
            KB.audio.dongUrl = URL.createObjectURL(f);
            KB.audio.playUrl(KB.audio.dongUrl);
            return;
        } catch (e) { }
    }
    try {
        const ctx = KB.audio.ctx = KB.audio.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 220;
        g.gain.setValueAtTime(0.4, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        o.connect(g).connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.5);
    } catch (e) { }
};

/* ---------------- recorder (mic → WAV) ---------------- */
KB.audio.rec = { active: false, stream: null, ctx: null, node: null, chunks: [], lastBlob: null, lastUrl: null };

KB.audio.startRecording = async function () {
    const r = KB.audio.rec;
    if (r.active) return true;
    try {
        r.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) { alert('Microphone blocked: ' + e.message); return false; }
    r.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = r.ctx.createMediaStreamSource(r.stream);
    r.node = r.ctx.createScriptProcessor(4096, 1, 1);
    r.chunks = [];
    r.node.onaudioprocess = e => { r.chunks.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
    src.connect(r.node);
    r.node.connect(r.ctx.destination);
    r.active = true;
    return true;
};

KB.audio.stopRecording = async function () {
    const r = KB.audio.rec;
    if (!r.active) return null;
    r.active = false;
    try { r.node.disconnect(); } catch (e) { }
    r.stream.getTracks().forEach(t => t.stop());
    const rate = r.ctx.sampleRate;
    try { await r.ctx.close(); } catch (e) { }
    const total = r.chunks.reduce((n, c) => n + c.length, 0);
    const pcm = new Float32Array(total);
    let off = 0;
    r.chunks.forEach(c => { pcm.set(c, off); off += c.length; });
    r.lastBlob = KB.audio.encodeWav(pcm, rate);
    if (r.lastUrl) URL.revokeObjectURL(r.lastUrl);
    r.lastUrl = URL.createObjectURL(r.lastBlob);
    return r.lastBlob;
};

// minimal 16-bit mono WAV encoder
KB.audio.encodeWav = function (samples, sampleRate) {
    const buf = new ArrayBuffer(44 + samples.length * 2);
    const v = new DataView(buf);
    const wstr = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    wstr(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); wstr(8, 'WAVE');
    wstr(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true);
    v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    wstr(36, 'data'); v.setUint32(40, samples.length * 2, true);
    let o = 44;
    for (let i = 0; i < samples.length; i++, o += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return new Blob([v], { type: 'audio/wav' });
};

/* ---------------- recorder window ---------------- */
KB.recorder = { visible: false };

KB.recorder.toggle = function () {
    KB.recorder.visible ? KB.recorder.hide() : KB.recorder.show();
};

KB.recorder.show = function () {
    const el = document.getElementById('recorder');
    const master = KB.settings.masterLanguage;
    el.innerHTML =
        '<div class="fw-title"><span id="rec-title">' + KB.escapeHtml(KB.langName(master).toUpperCase()) +
        '</span><button class="fw-close" id="rec-close">✕</button></div>' +
        '<div class="rec-body">' +
        '<button class="rec-btn" id="rec-btn" title="Click: start/stop recording"><span class="dot"></span></button>' +
        '<div class="rec-name" id="rec-name" title="Click to change the speaker name">' +
        KB.escapeHtml(KB.settings.sFlexiLanguageSpeakerName) + '</div>' +
        '<div class="rec-hint">Space/← = replay · ↑/↓ = prev/next task · Esc = close</div>' +
        '</div>';
    el.classList.remove('hidden');
    el.style.right = '20px'; el.style.top = '70px'; el.style.left = 'auto';
    KB.recorder.visible = true;

    const btn = document.getElementById('rec-btn');
    btn.onclick = () => KB.recorder.toggleRecording();
    document.getElementById('rec-close').onclick = () => KB.recorder.hide();
    document.getElementById('rec-name').onclick = () => {
        const n = prompt('Speakers name:', KB.settings.sFlexiLanguageSpeakerName);
        if (n) { KB.settings.sFlexiLanguageSpeakerName = n; KB.saveSettings(); KB.recorder.show(); }
    };
    KB.app.makeDraggable(el);
};

KB.recorder.hide = async function () {
    if (KB.audio.rec.active) await KB.recorder.toggleRecording();
    document.getElementById('recorder').classList.add('hidden');
    KB.recorder.visible = false;
};

KB.recorder.toggleRecording = async function () {
    const btn = document.getElementById('rec-btn');
    if (!KB.audio.rec.active) {
        if (await KB.audio.startRecording()) btn.classList.add('armed');
    } else {
        btn.classList.remove('armed');
        const blob = await KB.audio.stopRecording();
        if (!blob) return;
        // auto-replay ~200ms after stop, like the original
        setTimeout(() => KB.audio.playUrl(KB.audio.rec.lastUrl), 200);
        const task = KB.currentTask();
        if (!task) return;
        const lang = KB.settings.masterLanguage;
        const text = KB.txt(task, lang);
        if (!text || text === '-') return;
        const file = KB.settings.sFlexiLanguageSpeakerName + '_' + text + '_' + KB.langVoice(lang) + '.wav';
        try {
            await KB.store.saveSound(lang, file.replace(/[/\\]/g, '_'), blob);
            KB.dbg('recorded → sounds/' + KB.langName(lang) + '/' + file);
            KB.emit('task-shown'); // refresh sound icons
        } catch (e) { KB.dbg('saveSound: ' + e.message); }
    }
};

KB.recorder.handleKey = function (e) {
    if (!KB.recorder.visible) return false;
    if (e.key === 'Escape') { KB.recorder.hide(); return true; }
    if (e.key === ' ') { if (KB.audio.rec.lastUrl) KB.audio.playUrl(KB.audio.rec.lastUrl); return true; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { KB.step(1); return true; }
    if (e.key === 'ArrowLeft') { if (KB.audio.rec.lastUrl) KB.audio.playUrl(KB.audio.rec.lastUrl); return true; }
    if (e.key === 'ArrowUp') { KB.step(-1); return true; }
    return false;
};

// warm the voices list (Chrome populates it asynchronously AFTER the first getVoices call)
if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}
