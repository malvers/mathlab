// Native speech recognition engine — used ONLY inside the Capacitor app
// (iPad / iPhone / Android), where the WebView has no Web Speech API.
//
// It talks to the @capacitor-community/speech-recognition plugin via the global
// Capacitor.Plugins proxy, so the live-loaded web page needs no bundler:
//   - iOS:     SFSpeechRecognizer
//   - Android: android.speech.SpeechRecognizer
//
// The returned object mimics the webspeech recognition handle (.start() / .stop())
// so recording.js can drive it the same way. On the web this file is never used —
// app.js only wires it in when running on a native Capacitor platform.
import { state, el } from './state.js';
import { formatCommands } from './formatter.js';
import { logRec } from './utils.js';
import { saveToDB } from './idb.js';

function getPlugin() {
    return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SpeechRecognition) || null;
}

export function isCapacitorNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

export function initNativeRecognition() {
    const SR = getPlugin();
    if (!SR) {
        logRec('native SpeechRecognition plugin NOT found on Capacitor.Plugins');
        return null;
    }

    let running = false;            // true between start() and stop()
    let partialHandle = null;       // PluginListenerHandle for 'partialResults'

    // Commit a finished utterance to the persistent transcript.
    function commit(text) {
        const t = (text || '').trim();
        if (!t) return;
        const sep = state.savedFinal && !state.savedFinal.endsWith(' ') ? ' ' : '';
        state.savedFinal = (state.savedFinal || '') + sep + t + ' ';
        state.finalText = state.savedFinal;
        el.transcript.textContent = formatCommands(state.finalText);
    }

    // Android's SpeechRecognizer is one-shot (stops on silence) → start() resolves with
    // the final matches and we restart while recording. iOS runs continuously until stop(),
    // so start() resolves only on stop and no restart loop is needed.
    async function listenOnce() {
        try {
            const res = await SR.start({
                language: 'de-DE',
                maxResults: 1,
                partialResults: true,
                popup: false,
            });
            const finalText = res && res.matches && res.matches[0] ? res.matches[0] : '';
            logRec(`native start resolved final="${finalText}"`);
            commit(finalText);
        } catch (e) {
            logRec(`native start err: ${e && e.message ? e.message : e}`);
        }
        if (running && state.isRecording) {
            // small gap before re-arming the recognizer (Android throws if too fast)
            setTimeout(() => { if (running && state.isRecording) listenOnce(); }, 200);
        }
    }

    return {
        async start() {
            try {
                const perm = await SR.requestPermissions();
                logRec(`native perms: ${JSON.stringify(perm)}`);
            } catch (e) {
                logRec(`native perm err: ${e && e.message ? e.message : e}`);
            }
            running = true;
            try {
                partialHandle = await SR.addListener('partialResults', data => {
                    const interim = data && data.matches && data.matches[0] ? data.matches[0] : '';
                    // partials are cumulative within one utterance → show on top of committed text
                    el.transcript.textContent =
                        formatCommands(state.savedFinal) + (interim ? ' ' + interim : '');
                });
            } catch (e) {
                logRec(`native addListener err: ${e && e.message ? e.message : e}`);
            }
            listenOnce();
        },

        async stop() {
            running = false;
            try { await SR.stop(); } catch (e) { /* ignore */ }
            try { if (partialHandle && partialHandle.remove) await partialHandle.remove(); } catch (e) { /* ignore */ }
            partialHandle = null;

            // finalize exactly like webspeech.onend
            state.savedFinal = state.finalText.replace(/\s+$/, '') + (state.finalText ? ' ' : '');
            state.finalText = state.savedFinal;
            if (state.finalText) el.transcript.textContent = formatCommands(state.finalText);
            logRec(`native stop (finalText.len=${state.finalText.length})`);

            if (state.currentBlob) {
                saveToDB(state.currentBlob, state.finalText);
                logRec(`saveToDB called, transcript=${state.finalText.length} chars`);
            }
        },
    };
}
