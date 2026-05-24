// VGP — part of the chat app, loaded in order (classic scripts share one global scope).
// Do NOT reorder the <script> tags in vgpchat.html; top-level code runs in document order.
// ===========================================================================
// CRYPTO — group keys (HMAC/dir/room/group_id), group_meta, encrypt/decrypt
// ===========================================================================
async function initCrypto(password) {
  hmacKey = await deriveHmacKey(password);
  // Directory key: encrypts profile fields (name/emoji/avatar) so only members (not the server) read them.
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  dirKey = await deriveDirKey(password);
  // Room key: encrypts the shared group-room chat. Every member derives the SAME key from the group
  // password they typed → no key exchange needed (same trust model as the directory: group pwd = member).
  roomKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new TextEncoder().encode('vgp-room-salt-v1'), iterations: 200000, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
  myGroupId = await deriveGroupId(password); // public bucket id for contact-list scoping
  dbg('Gruppen-Schlüssel abgeleitet (HMAC + Verzeichnis + Gruppen-Chat + group_id)');
}
// Public group identifier from the group password (PBKDF2 → hex). Stored clear on identities to
// scope the contact list; it does NOT unlock anything (dirKey/hmacKey still need the password).
async function deriveGroupId(password) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode('vgp-group-salt-v1'), iterations: 100000, hash: 'SHA-256' }, km, 256);
  return bufToHex(bits);
}
// AES directory key for an ARBITRARY group password (used both by initCrypto for the active group
// and by the group_meta lookups during onboarding, before a group is activated).
async function deriveDirKey(password) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new TextEncoder().encode('vgp-dir-salt-v1'), iterations: 200000, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}
// --- Shared group name (group_meta): the authoritative name everyone sees. Stored encrypted with the
// group key (server learns nothing). Lets us tell "join an existing group" from "found a new one". ---
async function readGroupMeta(password) {
  await ensureClient(); // may run before initChat() created the client (onboarding) → self-protect
  const gid = await deriveGroupId(password);
  dbg('readGroupMeta: client=' + (client ? 'ok' : 'NULL') + ' · gid=' + String(gid || '').slice(0, 10));
  let { data, error } = await client.from('group_meta').select('enc_name').eq('group_id', gid).maybeSingle();
  if (error) { dbg('group_meta-Lookup: ' + error.message); return 'NOMETA'; } // table missing → legacy fallback
  if (!data) return null;                                                     // table exists, no such group
  const name = await decryptText(data.enc_name, await deriveDirKey(password));
  return name === '[falscher Schlüssel]' ? null : name;
}
async function writeGroupMeta(password, name) {
  await ensureClient();
  const gid = await deriveGroupId(password);
  const enc = await encryptText((name || 'Familie').trim(), await deriveDirKey(password));
  // upsert: founding inserts the row, renaming updates it (needs the group_meta UPDATE policy).
  const { error } = await client.from('group_meta').upsert({ group_id: gid, enc_name: enc }, { onConflict: 'group_id' });
  if (error) dbg('group_meta-Upsert: ' + error.message);
}
// Rename the active group: update the shared name (group_meta) + this device's local label.
// Anyone in the group may rename (for now). Other members pick it up via refreshGroupName().
async function renameGroup() {
  headMenu.classList.add('hidden');
  const cur = activeGroupLabel();
  const next = (await uiPrompt('Gruppe umbenennen:', { initial: cur, placeholder: 'Gruppenname', okText: 'Umbenennen' }) || '').trim();
  if (!next || next === cur) return;
  await writeGroupMeta(activeGroupPwd, next);                 // authoritative shared name
  const gm = myGroups.find(x => x.pwd === activeGroupPwd); if (gm) gm.label = next; // in-memory
  const accountPwd = sessionStorage.getItem(SESSION_PWD_KEY); // persist this device's vault label
  if (accountPwd) { const v = await openVault(accountPwd); if (v && v !== 'WRONG') { const g = v.groups.find(x => x.pwd === activeGroupPwd); if (g) { g.label = next; await writeLocalVault(v.name, accountPwd, v); } } }
  setGroupName(); renderContacts(searchVal());
  dbg('Gruppe umbenannt: ' + next);
}
// Pull the authoritative group name from the server and update the local label if it changed
// (so a rename by one member shows up for everyone on their next load/focus).
async function refreshGroupName() {
  const name = await readGroupMeta(activeGroupPwd);
  if (!name || name === 'NOMETA' || name === activeGroupLabel()) return;
  const gm = myGroups.find(x => x.pwd === activeGroupPwd); if (gm) gm.label = name;
  const accountPwd = sessionStorage.getItem(SESSION_PWD_KEY);
  if (accountPwd) { const v = await openVault(accountPwd); if (v && v !== 'WRONG') { const g = v.groups.find(x => x.pwd === activeGroupPwd); if (g) { g.label = name; await writeLocalVault(v.name, accountPwd, v); } } }
  setGroupName(); renderContacts(searchVal());
}
// Encrypt/decrypt a directory field with the room-derived key. decrypt() passes plaintext through,
// so legacy unencrypted rows still display.
async function encDir(v) { return (dirKey && v) ? await encryptText(v, dirKey) : null; }
async function decDir(v) { return (dirKey && v && v.startsWith('ENC:')) ? await decryptText(v, dirKey) : (v || ''); }

async function encryptText(plain, key) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain));
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return 'ENC:' + btoa(String.fromCharCode(...combined));
}

async function decryptText(cipherB64, key) {
  if (!cipherB64.startsWith('ENC:')) return cipherB64;
  try {
    const combined = Uint8Array.from(atob(cipherB64.slice(4)), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(decrypted);
  } catch(e) {
    dbg('Entschlüsselung fehlgeschlagen: ' + e.message);
    return '[falscher Schlüssel]';
  }
}

// ===========================================================================
// IDENTITY — ECDSA/ECDH keys, sign & verify
// ===========================================================================
// --- Device signing identity (ECDSA P-256). Private key is non-extractable and lives only in
// IndexedDB on this device (Signal-style). Each message is signed; receivers verify the signature
// against the public key bound to the sender's name → cryptographic anti-impersonation. ---
let myPrivKey = null;     // non-extractable CryptoKey (ECDSA sign)
let myPubB64 = null;      // our signing public key (spki, base64)
let myEcdhPrivKey = null; // non-extractable CryptoKey (ECDH key agreement, for 1:1 E2E)
let myEcdhPubB64 = null;  // our ECDH public key (spki, base64) — published in our profile

const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function signText(text) {
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, myPrivKey, new TextEncoder().encode(text));
  return b64(sig);
}
async function verifyText(text, sigB64, pubB64) {
  try {
    const pub = await crypto.subtle.importKey('spki', unb64(pubB64), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    return await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pub, unb64(sigB64), new TextEncoder().encode(text));
  } catch (_) { return false; }
}
