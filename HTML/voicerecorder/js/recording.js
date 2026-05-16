// Recording (MediaRecorder) + playback wiring.
import { state, el, setDirty } from './state.js';
import { formatCommands } from './formatter.js';
import { logRec, recLog } from './utils.js';
import { saveToDB } from './idb.js';
import { transcribeAudioBlob } from './whisper.js';

export function attachRecorder() {
    el.btnRecord.addEventListener('click', () => onRecordClick());
    el.btnPlay.addEventListener('click',   () => onPlayClick());
}

async function onRecordClick() {
    if (state.isPlaying) return;

    if (!state.isRecording) {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('getUserMedia nicht verfügbar (HTTPS nötig)');
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // pick a supported MIME type — Android often lacks audio/webm
            const candidates = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus',
                'audio/mp4;codecs=mp4a.40.2',
                'audio/mp4',
                ''
            ];
            let mimeType = '';
            for (const c of candidates) {
                if (c === '' || MediaRecorder.isTypeSupported(c)) { mimeType = c; break; }
            }
            state.mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            const usedType = state.mediaRecorder.mimeType || mimeType || 'audio/webm';
            logRec(`MediaRecorder mimeType=${usedType}`);

            state.mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) state.audioChunks.push(e.data);
            };
            state.mediaRecorder.onstop = async () => {
                if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
                state.currentBlob = new Blob(state.audioChunks, { type: usedType });
                state.audioUrl = URL.createObjectURL(state.currentBlob);
                state.audioEl  = new Audio(state.audioUrl);
                el.btnPlay.disabled = false;
                el.btnSave.disabled = false;
                stream.getTracks().forEach(t => t.stop());
                setDirty(true);

                // Whisper post-process — only when engine='whisper'
                if (state.engine === 'whisper') {
                    try {
                        const text = await transcribeAudioBlob(state.currentBlob, 'german');
                        const sep = state.savedFinal && !state.savedFinal.endsWith(' ') ? ' ' : '';
                        state.savedFinal = (state.savedFinal || '') + sep + text;
                        state.finalText  = state.savedFinal;
                        el.transcript.textContent = formatCommands(state.finalText);
                    } catch (e) { /* error shown via setStatus */ }
                }
                await saveToDB(state.currentBlob, state.finalText);

                if (!state.finalText) {
                    el.transcript.textContent = '[DEBUG-LOG]\n' + recLog.join('\n');
                }
            };

            state.isRecording = true;
            el.btnRecord.classList.add('active');
            el.btnPlay.disabled = true;
            recLog.length = 0;

            if (state.engine === 'webspeech' && state.recognition) {
                try {
                    state.recognition.start();
                    logRec('recognition.start() called');
                } catch (e) {
                    logRec(`recognition.start THREW: ${e.message || e}`);
                }
            }

            setTimeout(() => {
                try {
                    state.mediaRecorder.start();
                    logRec('mediaRecorder.start');
                } catch (e) {
                    logRec(`mediaRecorder.start THREW: ${e.message || e}`);
                }
            }, state.engine === 'webspeech' && state.recognition ? 600 : 0);

        } catch (err) {
            el.transcript.textContent = '[Mikrofon-Fehler] ' + (err && err.message ? err.message : err);
        }
    } else {
        if (state.recognition) state.recognition.stop();
        try {
            if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') state.mediaRecorder.stop();
        } catch (e) { logRec('mediaRecorder.stop error: ' + (e.message||e)); }
        state.isRecording = false;
        el.btnRecord.classList.remove('active');
    }
}

function onPlayClick() {
    if (state.isRecording || !state.audioEl) return;
    if (state.isPlaying) {
        state.audioEl.pause();
        state.audioEl.currentTime = 0;
        state.isPlaying = false;
        el.btnPlay.classList.remove('playing');
        return;
    }
    state.isPlaying = true;
    el.btnPlay.classList.add('playing');
    state.audioEl.currentTime = 0;
    state.audioEl.play();
    state.audioEl.onended = () => {
        state.isPlaying = false;
        el.btnPlay.classList.remove('playing');
        state.audioEl = new Audio(state.audioUrl);
    };
}
