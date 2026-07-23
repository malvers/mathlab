/* ============================================================
   MATHTRAINER audio — pupil-name playback (folder WAV first,
   Web Speech de-DE fallback → no pupil audio files required),
   question read-aloud (en-US, 1111 ms delay like the original),
   background music from the folder, volume control.
   Two independent channels (the Java app's single shared Clip
   made a name playback silently orphan the music).
   ============================================================ */
'use strict';

MT.audio = { music: null, voice: null };

MT.audio.playUrl = function (url) {
    if (MT.audio.voice) { try { MT.audio.voice.pause(); } catch (e) { } }
    const a = new Audio(url);
    a.volume = MT.settings.soundVolume;
    MT.audio.voice = a;
    a.play().catch(e => MT.dbg('audio: ' + e.message));
};

MT.audio.speak = function (text, lang) {
    try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.volume = MT.settings.soundVolume;
        const voices = speechSynthesis.getVoices().filter(v => v.lang.replace('_', '-').startsWith(lang.slice(0, 2)));
        if (voices.length) u.voice = voices[0];
        speechSynthesis.speak(u);
    } catch (e) { MT.dbg('speak: ' + e.message); }
};

// pupil name: first name during tasks, full name at round start / picker
MT.audio.sayName = async function (name) {
    const url = await MT.store.nameSoundURL(name);
    if (url) { MT.audio.playUrl(url); return; }
    MT.audio.speak(name, 'de-DE');
};

// question read-aloud (Q toggle) — original slept 1111 ms first
MT.audio.sayQuestion = function (question) {
    if (!MT.settings.playQuestion) return;
    if (MT.tasks.isLatex(question)) return;      // formulas are not read aloud
    clearTimeout(MT.audio._qTimer);
    MT.audio._qTimer = setTimeout(() => MT.audio.speak(question, 'en-US'), 1111);
};

/* ---------------- music ---------------- */
MT.audio.toggleMusic = async function () {
    MT.settings.playMusic = !MT.settings.playMusic;
    MT.saveSettings();
    if (MT.settings.playMusic) await MT.audio.startMusic();
    else MT.audio.stopMusic();
    MT.toast(MT.settings.playMusic ? 'Music on' : 'Music off');
};

MT.audio.startMusic = async function () {
    const url = await MT.store.musicURL();
    if (!url) {
        // no local file → YouTube fallback (official video, visible mini-player)
        MT.audio.startYouTube();
        return;
    }
    MT.audio.stopYouTube();
    // recreate the player when the URL changed (folder reconnect revokes old blob URLs)
    if (!MT.audio.music || MT.audio._musicUrl !== url) {
        if (MT.audio.music) MT.audio.music.pause();
        MT.audio.music = new Audio(url);
        MT.audio.music.loop = true;
        MT.audio._musicUrl = url;
    }
    MT.audio.music.volume = MT.settings.soundVolume;
    MT.audio.music.play().catch(e => MT.dbg('music: ' + e.message));
};

MT.audio.stopMusic = function () {
    if (MT.audio.music) MT.audio.music.pause();
    MT.audio.stopYouTube();
};

MT.audio.changeVolume = function (delta) {
    MT.settings.soundVolume = Math.min(1.0, Math.max(0.1, +(MT.settings.soundVolume + delta).toFixed(1)));
    MT.saveSettings();
    if (MT.audio.music) MT.audio.music.volume = MT.settings.soundVolume;
    if (MT.audio.yt) { try { MT.audio.yt.setVolume(MT.settings.soundVolume * 100); } catch (e) { } }
    MT.toast('Volume ' + Math.round(MT.settings.soundVolume * 100) + ' %');
};

/* ---------------- YouTube fallback (IFrame API, loaded on demand) ---------------- */
MT.audio.ensureYtApi = function () {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (MT.audio._ytApiPromise) return MT.audio._ytApiPromise;
    MT.audio._ytApiPromise = new Promise((resolve, reject) => {
        window.onYouTubeIframeAPIReady = resolve;
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        s.onerror = () => reject(new Error('YouTube API not reachable (offline?)'));
        document.head.appendChild(s);
        setTimeout(() => reject(new Error('YouTube API timeout')), 8000);
    });
    return MT.audio._ytApiPromise;
};

MT.audio.startYouTube = async function () {
    try {
        await MT.audio.ensureYtApi();
    } catch (e) {
        MT.toast('No local music file and ' + e.message);
        return;
    }
    const id = MT.settings.youtubeMusicId;
    document.getElementById('yt-music').classList.remove('hidden');
    if (MT.audio.yt && MT.audio._ytId === id) {
        try { MT.audio.yt.playVideo(); } catch (e) { }
        return;
    }
    if (MT.audio.yt) { try { MT.audio.yt.destroy(); } catch (e) { } MT.audio.yt = null; }
    MT.audio._ytId = id;
    MT.audio.yt = new YT.Player('yt-music-frame', {
        width: 240, height: 135, videoId: id,
        playerVars: { autoplay: 1, loop: 1, playlist: id },   // loop needs playlist=id
        events: {
            onReady: e => {
                e.target.setVolume(MT.settings.soundVolume * 100);
                e.target.playVideo();
            },
            onError: () => MT.toast('YouTube could not play this video — set another via right-click → YouTube music …')
        }
    });
};

MT.audio.stopYouTube = function () {
    if (MT.audio.yt) { try { MT.audio.yt.pauseVideo(); } catch (e) { } }
    const el = document.getElementById('yt-music');
    if (el) el.classList.add('hidden');
};

// accepts a full YouTube URL or a bare video id
MT.audio.setYouTubeId = function (input) {
    const m = /(?:v=|youtu\.be\/|\/live\/|\/shorts\/)([\w-]{11})/.exec(input) || /^([\w-]{11})$/.exec(input.trim());
    if (!m) { MT.toast('No YouTube video id found in that'); return; }
    MT.settings.youtubeMusicId = m[1];
    MT.saveSettings();
    if (MT.settings.playMusic) MT.audio.startYouTube();
};

if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}
