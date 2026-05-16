// Centered "LOADING AI" overlay with timer + small status banner.
const aiLoadEl  = document.getElementById('ai-loading');
const aiTimerEl = aiLoadEl?.querySelector('.ai-timer');
const statusEl  = document.getElementById('whisper-status');

let loaderStartT = 0;
let loaderTimerId = null;

function tickTimer() {
    const s = Math.floor((Date.now() - loaderStartT) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    aiTimerEl.textContent = `${mm}:${ss}`;
}

export function showLoader() {
    aiLoadEl.classList.add('visible');
    if (loaderTimerId) return;
    loaderStartT = Date.now();
    tickTimer();
    loaderTimerId = setInterval(tickTimer, 1000);
}

export function hideLoader() {
    aiLoadEl.classList.remove('visible');
    clearInterval(loaderTimerId);
    loaderTimerId = null;
}

export function setStatus(msg, busy) {
    if (!msg) {
        statusEl.classList.remove('visible', 'busy');
        return;
    }
    statusEl.textContent = msg;
    statusEl.classList.add('visible');
    statusEl.classList.toggle('busy', !!busy);
}
