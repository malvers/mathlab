// SAVE button (download audio + .txt + library) + LOAD button (library dialog).
import { state, el, setDirty } from './state.js';
import { formatCommands } from './formatter.js';
import { audioExt, dateBaseName } from './utils.js';
import { saveToDB, saveToLibrary, listLibrary, deleteFromLibrary } from './idb.js';
import { uiConfirm } from './ui-confirm.js';

export function attachSaveLoad() {
    // SAVE — download audio + transcript sidecar, also push into library
    el.btnSave.addEventListener('click', async () => {
        if (!state.currentBlob) return;
        const baseName = dateBaseName();

        // audio
        const a1 = document.createElement('a');
        a1.href = URL.createObjectURL(state.currentBlob);
        a1.download = baseName + audioExt(state.currentBlob);
        a1.click();
        URL.revokeObjectURL(a1.href);

        // transcript sidecar (only if there is text)
        const text = el.transcript.textContent.trim();
        if (text) {
            const a2 = document.createElement('a');
            const tBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            a2.href = URL.createObjectURL(tBlob);
            a2.download = baseName + '.txt';
            a2.click();
            URL.revokeObjectURL(a2.href);
        }

        await saveToLibrary(state.currentBlob, text, baseName);
        setDirty(false);
    });

    // LOAD — library dialog (bottom button)
    el.btnLoad.addEventListener('click', openLibraryDialog);

    // file picker (used by FROM FILE… and popup LOAD)
    el.fileInput.addEventListener('change', onFilePicked);

    // library dialog buttons
    document.getElementById('lib-cancel').addEventListener('click', () => {
        document.getElementById('library-dialog').classList.remove('visible');
    });
    document.getElementById('lib-from-file').addEventListener('click', () => {
        document.getElementById('library-dialog').classList.remove('visible');
        el.fileInput.click();
    });
}

async function loadAudioBlob(blob, transcript) {
    if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
    state.currentBlob = blob;
    state.audioUrl = URL.createObjectURL(state.currentBlob);
    state.audioEl  = new Audio(state.audioUrl);
    el.btnPlay.disabled = false;
    el.btnSave.disabled = false;
    if (typeof transcript === 'string') {
        state.finalText  = transcript;
        state.savedFinal = transcript;
        el.transcript.textContent = formatCommands(transcript);
    }
    await saveToDB(state.currentBlob, state.finalText);
    setDirty(false);
}

async function openLibraryDialog() {
    const libDlg    = document.getElementById('library-dialog');
    const libListEl = libDlg.querySelector('.lib-list');
    libListEl.innerHTML = '';
    const items = await listLibrary();
    items.sort((a, b) => b.savedAt - a.savedAt);
    libDlg.classList.toggle('empty', items.length === 0);
    items.forEach(it => {
        const row = document.createElement('div');
        row.className = 'lib-item';
        row.innerHTML = `
            <div class="lib-name"></div>
            <div class="lib-meta"></div>
            <button class="lib-del" title="Löschen">×</button>
        `;
        row.querySelector('.lib-name').textContent = it.name || ('recording ' + new Date(it.savedAt).toLocaleString());
        const sizeKB = Math.round((it.blob?.size || 0) / 1024);
        row.querySelector('.lib-meta').textContent = `${sizeKB} KB`;
        row.addEventListener('click', e => {
            if (e.target.classList.contains('lib-del')) return;
            loadAudioBlob(it.blob, it.transcript);
            libDlg.classList.remove('visible');
        });
        row.querySelector('.lib-del').addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!await uiConfirm(`Aufnahme "${it.name}" löschen?`)) return;
            await deleteFromLibrary(it.id);
            openLibraryDialog();
        });
        libListEl.appendChild(row);
    });
    libDlg.classList.add('visible');
}

async function onFilePicked() {
    const files = Array.from(el.fileInput.files || []);
    if (!files.length) return;

    const audioFile = files.find(f => f.type.startsWith('audio/') || /\.(webm|mp3|wav|m4a|ogg)$/i.test(f.name));
    const textFile  = files.find(f => f.type === 'text/plain' || /\.txt$/i.test(f.name));

    if (audioFile) {
        if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
        state.currentBlob = audioFile;
        state.audioUrl = URL.createObjectURL(state.currentBlob);
        state.audioEl  = new Audio(state.audioUrl);
        el.btnPlay.disabled = false;
        el.btnSave.disabled = false;
    }

    if (textFile) {
        const text = await textFile.text();
        state.finalText  = text;
        state.savedFinal = text;
        el.transcript.textContent = formatCommands(text);
    }

    if (state.currentBlob) await saveToDB(state.currentBlob, state.finalText);
    setDirty(false);
    el.fileInput.value = '';
}
