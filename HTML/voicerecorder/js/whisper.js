// Whisper transcription via transformers.js — used when engine='whisper'.
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
import { showLoader, hideLoader, setStatus } from './ui-loader.js';

env.allowLocalModels = false; // load from HF Hub / CDN

let transcriber = null;
let loading = null;

export async function loadWhisperModel() {
    if (transcriber) return transcriber;
    if (loading)     return loading;
    loading = (async () => {
        showLoader();
        try {
            // whisper-base + quantized — WASM (default), zuverlässig auf allen Geräten.
            transcriber = await pipeline(
                'automatic-speech-recognition',
                'Xenova/whisper-base',
                { quantized: true }
            );
            hideLoader();
        } catch (e) {
            hideLoader();
            setStatus('Whisper-Fehler: ' + (e.message || e), false);
            throw e;
        }
    })();
    await loading;
    return transcriber;
}

export async function transcribeAudioBlob(blob, lang) {
    await loadWhisperModel();
    setStatus('Transkribiere…', true);
    try {
        const arrayBuffer = await blob.arrayBuffer();
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        let pcm;
        if (audioBuffer.numberOfChannels > 1) {
            pcm = new Float32Array(audioBuffer.length);
            for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
                const ch = audioBuffer.getChannelData(c);
                for (let i = 0; i < pcm.length; i++) pcm[i] += ch[i] / audioBuffer.numberOfChannels;
            }
        } else {
            pcm = audioBuffer.getChannelData(0);
        }
        await audioCtx.close();
        const out = await transcriber(pcm, {
            language: lang || 'german',
            task: 'transcribe',
            return_timestamps: false
        });
        setStatus(null);
        return (out && out.text) ? out.text.trim() : '';
    } catch (e) {
        setStatus('Transkriptions-Fehler: ' + (e.message || e), false);
        throw e;
    }
}
