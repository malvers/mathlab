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

    // engine selection: 'webspeech' | 'whisper'
    engine: localStorage.getItem('transcriber.engine') || 'webspeech',

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
