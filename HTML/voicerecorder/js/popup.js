// Radial action popup (right-click or long-press) + its button actions.
import { state, el, setDirty } from './state.js';
import { formatCommands } from './formatter.js';
import { uiConfirm } from './ui-confirm.js';
import { clearDB, saveToDB } from './idb.js';
import { loadWhisperModel } from './whisper.js';

// per-button manual y-offsets (ellipse is just a starting point)
const Y_OFFSETS = {
    'mb-mini-toggle':  -4,
    'mb-del-all':      16,
    'mb-reload-ai':    16,
    'mb-del-voice':   -16,
    'mb-copy-text':     4,
    'mb-load-file':   -16,
};

function clearPopupPositions() {
    el.miniStack.querySelectorAll('.mini-btn').forEach(b => {
        b.style.left = '';
        b.style.top  = '';
    });
}

function openPopup(clientX, clientY) {
    const W = 320, H = 260;
    const rx = 105, ry = 95;
    const x = Math.max(8, Math.min(clientX - W / 2, window.innerWidth  - W - 8));
    const y = Math.max(8, Math.min(clientY - H / 2, window.innerHeight - H - 8));
    el.miniStack.style.left = x + 'px';
    el.miniStack.style.top  = y + 'px';
    el.miniStack.classList.add('popup');

    const btns = Array.from(el.miniStack.querySelectorAll('.mini-btn'));
    const n = btns.length;
    btns.forEach((b, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const px = W / 2 + Math.cos(angle) * rx;
        const py = H / 2 + Math.sin(angle) * ry + (Y_OFFSETS[b.id] || 0);
        b.style.left = px + 'px';
        b.style.top  = py + 'px';
    });
}

export function attachPopup() {
    // open via right-click
    window.addEventListener('contextmenu', e => {
        e.preventDefault();
        openPopup(e.clientX, e.clientY);
    });

    // long-press on touch
    let lpTimer = null, lpStartX = 0, lpStartY = 0;
    document.addEventListener('touchstart', e => {
        if (e.target.closest('button, input, label')) return;
        if (el.miniStack.classList.contains('popup')) return;
        const t = e.touches[0];
        lpStartX = t.clientX;
        lpStartY = t.clientY;
        clearTimeout(lpTimer);
        lpTimer = setTimeout(() => { openPopup(lpStartX, lpStartY); lpTimer = null; }, 550);
    }, { passive: true });
    document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        if (Math.abs(t.clientX - lpStartX) > 8 || Math.abs(t.clientY - lpStartY) > 8) {
            clearTimeout(lpTimer); lpTimer = null;
        }
    }, { passive: true });
    document.addEventListener('touchend',   () => { clearTimeout(lpTimer); lpTimer = null; });
    document.addEventListener('touchcancel',() => { clearTimeout(lpTimer); lpTimer = null; });

    // close on button click inside (click fires AFTER mousedown)
    el.miniStack.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            el.miniStack.classList.remove('popup');
            clearPopupPositions();
        }
    });
    // close on click outside
    document.addEventListener('mousedown', e => {
        if (el.miniStack.classList.contains('popup') && !el.miniStack.contains(e.target)) {
            el.miniStack.classList.remove('popup');
            clearPopupPositions();
        }
    });

    wireButtons();
}

function wireButtons() {
    // MINI MODE toggle
    const btnMiniToggle = document.getElementById('mb-mini-toggle');
    btnMiniToggle.addEventListener('click', () => {
        document.body.classList.toggle('mini');
        btnMiniToggle.textContent = document.body.classList.contains('mini') ? 'FULL MODE' : 'MINI MODE';
    });

    // DELETE ALL
    document.getElementById('mb-del-all').addEventListener('click', async () => {
        if (!await uiConfirm('Alles löschen — Aufnahme und Text?')) return;
        state.audioChunks = [];
        state.currentBlob = null;
        if (state.audioUrl) { URL.revokeObjectURL(state.audioUrl); state.audioUrl = null; }
        state.audioEl = null;
        state.finalText = '';
        state.savedFinal = '';
        el.transcript.textContent = '';
        el.btnPlay.disabled = true;
        el.btnSave.disabled = true;
        await clearDB();
        setDirty(false);
    });

    // DELETE TEXT
    document.getElementById('mb-del-text').addEventListener('click', async () => {
        if (!await uiConfirm('Transkript löschen?')) return;
        state.finalText = '';
        state.savedFinal = '';
        el.transcript.textContent = '';
        if (state.currentBlob) saveToDB(state.currentBlob, '');
    });

    // DELETE VOICE
    document.getElementById('mb-del-voice').addEventListener('click', async () => {
        if (!await uiConfirm('Aufnahme löschen?')) return;
        state.audioChunks = [];
        state.currentBlob = null;
        if (state.audioUrl) { URL.revokeObjectURL(state.audioUrl); state.audioUrl = null; }
        state.audioEl = null;
        el.btnPlay.disabled = true;
        el.btnSave.disabled = true;
        await clearDB();
        setDirty(false);
    });

    // COPY TEXT
    document.getElementById('mb-copy-text').addEventListener('click', async () => {
        const text = el.transcript.textContent.trim();
        if (!text) return;
        try { await navigator.clipboard.writeText(text); } catch (e) {}
    });

    // LOAD (file picker) — popup version
    document.getElementById('mb-load-file').addEventListener('click', () => el.fileInput.click());

    // ENGINE toggle
    const btnEngine = document.getElementById('mb-engine');
    const refreshEngineLabel = () => { btnEngine.textContent = state.engine.toUpperCase(); };
    refreshEngineLabel();
    btnEngine.addEventListener('click', () => {
        state.engine = (state.engine === 'webspeech') ? 'whisper' : 'webspeech';
        localStorage.setItem('transcriber.engine', state.engine);
        refreshEngineLabel();
        if (state.engine === 'whisper') {
            loadWhisperModel().catch(() => {});
        }
    });

    // RELOAD AI — clear caches + reload
    document.getElementById('mb-reload-ai').addEventListener('click', async () => {
        try {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        } catch (e) { /* ignore */ }
        const url = location.pathname + '?cb=' + Date.now() + location.hash;
        location.replace(url);
    });
}
