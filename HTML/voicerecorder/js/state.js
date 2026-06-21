// Shared mutable application state.
// Single source of truth for whatever multiple modules need to read/write.
export const state = {
    // recording / playback
    mediaRecorder: null,
    audioChunks:   [],
    audioUrl:      null,
    audioEl:       null,
    currentBlob:   null,
    isRecording:   false,
    isPlaying:     false,

    // transcription
    recognition:   null,
    finalText:     '',
    savedFinal:    '',

    // engine selection: 'webspeech' (web) | 'native' (Capacitor app) | 'whisper'
    engine: (function () {
        const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
        const stored = localStorage.getItem('transcriber.engine');
        // In the Capacitor app the WebView has no Web Speech API → use the native plugin.
        // Honour an explicit Whisper choice, otherwise default to native STT.
        if (isNative) return stored === 'whisper' ? 'whisper' : 'native';
        return stored || 'webspeech';
    })(),

    // dirty = audio exists but not yet downloaded
    isDirty: false,
};

// DOM references — initialized on app start
export const el = {};
export function bindDom() {
    el.btnRecord    = document.getElementById('btn-record');
    el.btnPlay      = document.getElementById('btn-play');
    el.btnSave      = document.getElementById('btn-save');
    el.btnLoad      = document.getElementById('btn-load');
    el.transcript   = document.getElementById('transcript-inner');
    el.miniStack    = document.getElementById('mini-stack');
    el.fileInput    = document.getElementById('file-input');
    el.buildInfo    = document.getElementById('build-info');
}

export function setDirty(v) {
    state.isDirty = v;
    el.btnSave.classList.toggle('unsaved', v);
}
