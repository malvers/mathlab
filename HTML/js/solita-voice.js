// js/solita-voice.js — shared, headless TTS voice for EVERY Solita host (tracker, solita.html, future apps).
// Synthesises via the `tts` edge fn (Google Cloud TTS), plays the mp3, and CACHES fixed phrases (e.g. tool
// badges) in localStorage so a repeated phrase is instant + free (no TTS call, no Google cost). No DOM —
// hosts keep their own on/off button + voice picker and just call SolitaVoice.speak()/speakCached().
//
//   SolitaVoice.speak(text, { voice?, lang?, rate?, onstate? }) -> Promise   // onstate(true|false) for host UI
//   SolitaVoice.speakCached(key, phrase, opts?)                 -> Promise   // synth once, replay free
//   SolitaVoice.stop()                                                       // halt current playback
//   SolitaVoice.clean(text) / .synth(text,opts) / .playB64(b64,onstate)      // lower-level helpers
(function (global) {
    const TTS_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable, client-safe
    const DEFAULT_VOICE = 'de-DE-Studio-C';
    const DEFAULT_LANG = 'de-DE';

    // Make speech sound right: drop markdown + emoji (don't read them aloud), and fix Solita's name + the
    // acronyms KI/UI so the engine pronounces them the way Doc wants. Shared so every host sounds identical.
    function clean(text) {
        return String(text || '')
            .replace(/[\p{Extended_Pictographic}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}️‍]/gu, '')
            .replace(/[*_`#>•]/g, '')
            .replace(/\bSolita\b/gi, 'Solíta')   // so-LÍ-ta (stress 2nd syllable)
            .replace(/\bUI\b/g, 'Ju Ei')         // "you-eye", not German "oo-ee"
            .replace(/\bKI\b/g, 'Kah Ih')        // the letters K-I, not the word „kih"
            .replace(/\s+/g, ' ').trim();
    }

    let audio = null;
    function stop() { try { if (audio) { audio.pause(); audio = null; } } catch (e) { } }
    function playB64(b64, onstate) {
        stop();
        audio = new Audio('data:audio/mp3;base64,' + b64);
        audio.onended = function () { audio = null; if (onstate) onstate(false); };
        audio.onerror = function () { audio = null; if (onstate) onstate(false); };
        audio.play().catch(function () { if (onstate) onstate(false); });
    }
    function synth(text, opts) {
        opts = opts || {};
        return fetch(TTS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON },
            body: JSON.stringify({
                text: text,
                voice: opts.voice || DEFAULT_VOICE,
                languageCode: opts.lang || DEFAULT_LANG,
                speakingRate: (typeof opts.rate === 'number') ? opts.rate : 1.0
            })
        }).then(function (r) { return r.json(); }).then(function (d) { return (d && d.audioContent) || null; });
    }
    function speak(text, opts) {
        opts = opts || {};
        const t = clean(text);
        if (!t) { if (opts.onstate) opts.onstate(false); return Promise.resolve(); }
        if (opts.onstate) opts.onstate(true);
        return synth(t, opts)
            .then(function (b64) { if (b64) playB64(b64, opts.onstate); else if (opts.onstate) opts.onstate(false); })
            .catch(function () { if (opts.onstate) opts.onstate(false); });
    }
    // A FIXED phrase (e.g. a tool badge) — synthesised once, then replayed from localStorage for free.
    function speakCached(key, phrase, opts) {
        const ck = 'solita_tts_cache_' + key;
        let b64 = null; try { b64 = localStorage.getItem(ck); } catch (e) { }
        if (b64) { playB64(b64); return Promise.resolve(); }
        return synth(clean(phrase), opts).then(function (b) {
            if (b) { try { localStorage.setItem(ck, b); } catch (e) { } playB64(b); }
        }).catch(function () { });
    }

    global.SolitaVoice = { speak: speak, speakCached: speakCached, stop: stop, clean: clean, synth: synth, playB64: playB64, DEFAULT_VOICE: DEFAULT_VOICE, DEFAULT_LANG: DEFAULT_LANG };
})(window);
