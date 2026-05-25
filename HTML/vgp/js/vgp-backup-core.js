// VGP — pure server-backup ("envelope") crypto primitives, factored out so they're loadable in
// isolation (test.html) without the DOM-coupled app. Loaded AFTER vgp-crypto.js (needs b64/unb64),
// BEFORE vgp-contacts.js (which uses these in createBackup/restoreBackup). No DOM, no globals.
//
// Envelope model: a random AES master key encrypts the whole vault; the master key is then WRAPPED
// (AES-GCM) by KEKs derived from (a) the account password and (b) a one-time recovery code — so the
// server only ever stores ciphertext and can read nothing.
const BACKUP_ITERS = 600000;          // PBKDF2 work factor for the wrapping keys (login/restore only)
const RECOVERY_SALT = 'vgp-recovery-salt-v1';
function normCode(c) { return (c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
async function kdfKEK(str, saltBytes) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(str), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: saltBytes, iterations: BACKUP_ITERS, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function wrapMaster(masterKey, kek) {
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', masterKey));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, kek, raw));
  const c = new Uint8Array(iv.length + ct.length); c.set(iv); c.set(ct, iv.length);
  return b64(c);
}
async function unwrapMaster(wrapB64, kek) {
  const c = unb64(wrapB64);
  const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: c.slice(0, 12) }, kek, c.slice(12));
  return crypto.subtle.importKey('raw', new Uint8Array(raw), { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}
// Readable 100-bit code, e.g. ABCD-EFGH-JKLM-NPQR-STUV (no ambiguous chars 0/O/1/I)
function genRecoveryCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = ''; for (const b of bytes) s += A[b & 31];
  return s.match(/.{1,4}/g).join('-');
}
