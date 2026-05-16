// App entry point — wires everything together.
import { state, bindDom, setDirty } from './state.js';
import { logRec } from './utils.js';
import { formatCommands } from './formatter.js';
import { loadFromDB } from './idb.js';
import { initRecognition } from './webspeech.js';
import { attachRecorder }  from './recording.js';
import { attachPopup }     from './popup.js';
import { attachSaveLoad }  from './save-load.js';
import { loadWhisperModel } from './whisper.js';

const BUILD_TIME = '2026-05-16 16:40';

bindDom();
state.recognition = initRecognition();

attachRecorder();
attachPopup();
attachSaveLoad();

// Build info line — click to hard-reload
const buildInfoEl = document.getElementById('build-info');
buildInfoEl.textContent = `BT: ${BUILD_TIME} | engine=${state.engine}`;
buildInfoEl.title = 'Klick: hart neu laden';
buildInfoEl.addEventListener('click', () => {
    const url = location.pathname + '?cb=' + Date.now() + location.hash;
    location.replace(url);
});

// Fullscreen toggle via top-right invisible corner
document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else                              document.exitFullscreen?.();
});

// Warn on close if there is an unsaved recording
window.addEventListener('beforeunload', e => {
    if (state.isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

logRec(`UA: ${navigator.userAgent.substring(0, 80)}`);

// Restore from IndexedDB on load
(async () => {
    try {
        const stored = await loadFromDB();
        if (stored?.blob) {
            state.currentBlob = stored.blob;
            if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
            state.audioUrl = URL.createObjectURL(state.currentBlob);
            state.audioEl  = new Audio(state.audioUrl);
            document.getElementById('btn-play').disabled = false;
            document.getElementById('btn-save').disabled = false;
            setDirty(true);
        }
        if (stored?.transcript) {
            state.finalText  = stored.transcript;
            state.savedFinal = stored.transcript;
        }
    } catch (e) { /* ignore */ }
    document.getElementById('transcript-inner').textContent = formatCommands(state.finalText || '');
})();

// Pre-load Whisper model in the background if it's the chosen engine
if (state.engine === 'whisper') {
    loadWhisperModel().catch(() => {});
}
