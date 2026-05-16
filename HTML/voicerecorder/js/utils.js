// Generic helpers.

export function tStamp() {
    const d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' +
           String(d.getMinutes()).padStart(2,'0') + ':' +
           String(d.getSeconds()).padStart(2,'0') + '.' +
           String(d.getMilliseconds()).padStart(3,'0');
}

export function audioExt(blob) {
    const t = (blob.type || '').toLowerCase();
    if (t.includes('mp4'))  return '.m4a';
    if (t.includes('ogg'))  return '.ogg';
    if (t.includes('wav'))  return '.wav';
    if (t.includes('mpeg')) return '.mp3';
    return '.webm';
}

export function dateBaseName(d = new Date()) {
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    return `recording ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// rec log — kept as no-op import target if needed later
const _log = [];
export const recLog = _log;
export const logRec = (msg) => _log.push(`${tStamp()} ${msg}`);
export const resetLog = () => { _log.length = 0; };
