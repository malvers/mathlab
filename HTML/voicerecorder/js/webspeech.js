// Browser Web Speech API engine — live transcription during recording.
import { state, el } from './state.js';
import { formatCommands } from './formatter.js';
import { logRec } from './utils.js';
import { saveToDB } from './idb.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function initRecognition() {
    if (!SpeechRecognition) {
        logRec('NO SpeechRecognition object — API not available');
        return null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = 'de-DE';

    recognition.onaudiostart   = () => logRec('audiostart');
    recognition.onsoundstart   = () => logRec('soundstart');
    recognition.onspeechstart  = () => logRec('speechstart');
    recognition.onspeechend    = () => logRec('speechend');
    recognition.onsoundend     = () => logRec('soundend');
    recognition.onaudioend     = () => logRec('audioend');
    recognition.onnomatch      = () => logRec('nomatch');
    recognition.onstart        = () => logRec('start');

    recognition.onresult = e => {
        // Collect all final transcripts, then dedupe:
        //  - cumulative (Lenovo): later final starts with previous → replace
        //  - discrete   (Mac):    later final is independent       → append
        const finals = [];
        let interim = '';
        const dump = [];
        for (let i = 0; i < e.results.length; i++) {
            const t = e.results[i][0].transcript;
            const f = e.results[i].isFinal;
            dump.push(`[${i}]${f?'F':'I'}="${t}"`);
            if (f) finals.push(t);
            else   interim = t;
        }
        const deduped = [];
        for (const f of finals) {
            const prev = deduped[deduped.length - 1];
            if (prev && f.trim().startsWith(prev.trim())) {
                deduped[deduped.length - 1] = f;
            } else {
                deduped.push(f);
            }
        }
        const sessionFinal = deduped.join(' ').replace(/\s+/g, ' ').trim();
        logRec(`result idx=${e.resultIndex} ${dump.join(' ')}`);
        state.finalText = state.savedFinal + sessionFinal;
        el.transcript.textContent = formatCommands(state.finalText) + (interim ? ' ' + interim : '');
    };

    recognition.onend = () => {
        state.savedFinal = state.finalText.replace(/\s+$/, '') + (state.finalText ? ' ' : '');
        state.finalText  = state.savedFinal;
        if (state.finalText) el.transcript.textContent = formatCommands(state.finalText);
        logRec(`end (finalText.len=${state.finalText.length})`);

        if (state.isRecording) {
            // restart in next tick — same-tick restart throws InvalidStateError on iOS Safari
            setTimeout(() => {
                if (!state.isRecording) return;
                try {
                    recognition.start();
                    logRec('recognition auto-restarted');
                } catch (e) {
                    logRec(`recognition restart THREW: ${e.message || e}`);
                }
            }, 100);
            return;
        }
        if (state.currentBlob) {
            saveToDB(state.currentBlob, state.finalText);
            logRec(`saveToDB called, transcript=${state.finalText.length} chars`);
        }
    };

    recognition.onerror = e => {
        logRec(`ERROR: error="${e.error||''}" message="${e.message||''}"`);
    };

    return recognition;
}
