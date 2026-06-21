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

// Full-circle (ellipse) fan-out around the trigger point — info = { x, y } from the right-click /
// long-press; the stack is clamped into the viewport, buttons sit on an ellipse (rx,ry), one per
// 360°/n, with small per-button y nudges. Stays ROUND (not a half-circle like tracker/worldclock).
function layout(stack, btns, info) {
    const W = 320, H = 260, rx = 105, ry = 95;
    const cx = info ? info.x : window.innerWidth / 2;
    const cy = info ? info.y : window.innerHeight / 2;
    stack.style.left = Math.max(8, Math.min(cx - W / 2, window.innerWidth  - W - 8)) + 'px';
    stack.style.top  = Math.max(8, Math.min(cy - H / 2, window.innerHeight - H - 8)) + 'px';
    const n = btns.length;
    btns.forEach((b, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        b.style.left = (W / 2 + Math.cos(angle) * rx) + 'px';
        b.style.top  = (H / 2 + Math.sin(angle) * ry + (Y_OFFSETS[b.id] || 0)) + 'px';
    });
}

export function attachPopup() {
    // Shared radial widget (window.RadialMenu — js/radial-menu.js, loaded as a classic script before
    // this module) owns open/close + the right-click / long-press / outside-close / tap-close
    // mechanics; we supply only the round `layout` above. No hamburger → opens at the cursor.
    window.RadialMenu({
        stack: el.miniStack,
        layout,
        contextMenu: true,
        longPress: 550,
        closeOnButtonTap: true,
        closeOnOutside: true,
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
        // Live engine is native inside the Capacitor app, Web Speech on the web.
        const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
        const live = isNative ? 'native' : 'webspeech';
        state.engine = (state.engine === 'whisper') ? live : 'whisper';
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
