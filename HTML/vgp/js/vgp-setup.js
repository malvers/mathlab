// VGP — part of the chat app, loaded in order (classic scripts share one global scope).
// Do NOT reorder the <script> tags in vgpchat.html; top-level code runs in document order.

const NAME_KEY = 'eocr-chat-name';
const EMOJI_KEY = 'eocr-chat-emoji';
const AVATAR_KEY = 'vgp-avatar'; // local copy of my chosen avatar picture (data URL)
const VAULT_KEY = 'vgp-vault'; // local account vault (encrypted private key + room password)
const SESSION_PWD_KEY = 'vgp-session-pwd'; // account pwd cached for THIS tab only (sessionStorage) → no re-entry on reload
const BACKUP_OK_KEY = 'vgp-backup-ok';     // this device knows a server backup exists → don't re-show the recovery code

const SUPABASE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';

// ===========================================================================
// SETUP — logging, Supabase client, group-key globals
// ===========================================================================
function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function dbg(msg) {
  try { if (typeof DebugWindow !== 'undefined') DebugWindow.log(msg); } catch(_) {}
  console.log('[chat]', msg);
}

let client = null;
let subscription = null;

// Single Supabase client + anonymous sign-in → a device-bound identity (auth.uid()) without e-mail.
// Failsafe: if Anonymous sign-ins aren't enabled in Supabase yet, the app keeps working (old RLS).
let myUid = null; // our auth.uid() — used as message author/recipient id
async function ensureClient() {
  if (!client) {
    try { client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
    catch (e) { dbg('Supabase-Client konnte nicht erstellt werden: ' + e.message); }
  }
  try {
    let { data: { session } } = await client.auth.getSession();
    if (!session) {
      const { data, error } = await client.auth.signInAnonymously();
      if (error) dbg('Anon-Login nicht möglich (Anonymous Auth aktiviert?): ' + error.message);
      else { session = data.session; dbg('Anonym eingeloggt — Geräte-Identität aktiv'); }
    }
    myUid = session && session.user ? session.user.id : null;
  } catch (e) { dbg('Auth-Fehler: ' + e.message); }
  return client;
}
let hmacKey = null; // derived from the group password, used only to compute name_id (HMAC) for uniqueness
let dirKey = null;  // directory key (AES) from the group password — encrypts profile name/emoji/avatar
let roomKey = null; // group-room key (AES) from the group password — encrypts the shared family-room chat
let myGroupId = null; // public bucket id (hash of the group password) → scopes the contact list to my group
let myGroups = [];        // all group passwords this account has joined
let activeGroupPwd = null; // the group password currently active (drives hmacKey/dirKey/group_id)
// Normalize a vault payload to the multi-group shape: groups = [{pwd, label}], activeGroup = pwd.
// Migrates legacy {roomPwd} and an older groups-as-strings array.
function normGroups(p, activePwd) {
  let g = Array.isArray(p.groups) ? p.groups : [];
  if (!g.length && p.roomPwd) g = [p.roomPwd];
  g = g.map((x, i) => (typeof x === 'string' ? { pwd: x, label: 'Gruppe ' + (i + 1) } : x));
  const active = activePwd || p.activeGroup || (g[0] && g[0].pwd);
  if (active && !g.some(x => x.pwd === active)) g.push({ pwd: active, label: 'Gruppe ' + (g.length + 1) });
  p.groups = g; p.activeGroup = active;
  delete p.roomPwd;
  return p;
}
let chatReady = false;
let signingUp = false; // true only during the sign-up flow (skip the "account deleted?" check then)

const messagesEl = document.getElementById('messages');
const msgInput = document.getElementById('msg-input');
const myNameEl = document.getElementById('my-name');

// Keep browser password managers (Firefox "generate password", Safari/Chrome autofill) away from
// our non-account password fields: they start readonly, so no manager pops up on load; the first
// real interaction unlocks them for typing.
document.querySelectorAll('input[type="password"]').forEach(inp => {
  const unlock = () => { if (inp.hasAttribute('readonly')) inp.removeAttribute('readonly'); };
  inp.addEventListener('pointerdown', unlock);
  inp.addEventListener('focus', unlock);
  inp.addEventListener('keydown', unlock);
});

// ?name= query param pre-fills the name (overrides localStorage)
const urlParamName = new URLSearchParams(location.search).get('name');
if (urlParamName) {
  const n = urlParamName.trim().toLowerCase();
  myNameEl.value = n;
  localStorage.setItem(NAME_KEY, n);
  dbg('Name aus URL-Parameter: ' + n);
} else {
  myNameEl.value = localStorage.getItem(NAME_KEY) || '';
}

// ===========================================================================
// EMOJI & AVATARS — per-person emoji/picture, rendering, picker
// ===========================================================================
// --- Emoji avatar: chosen per person, shown left of the name and prefixed to the sender ---
const nameEmojiBtn = document.getElementById('name-emoji');
const msgEmojiBtn = document.getElementById('msg-emoji');
const emojiPanel = document.getElementById('emoji-panel');
// GUARD against a null deref (e.g. stale-cached HTML missing #emoji-panel) — a throw here would
// abort the ENTIRE file and silently kill the avatar/emoji wiring further down.
const emojiPicker = emojiPanel ? emojiPanel.querySelector('emoji-picker') : null;
let myEmoji = localStorage.getItem(EMOJI_KEY) || '';
let myAvatar = localStorage.getItem(AVATAR_KEY) || ''; // small data-URL picture (overrides emoji)
// --- Emoji rendering: Apple set everywhere. Apple devices already render native Apple emoji; on the
// rest (Android/Windows) we swap to Apple emoji IMAGES. iPadOS desktop-mode reports "Macintosh" → Apple.
const IS_APPLE = /Macintosh|Mac OS X|iPhone|iPad|iPod/.test(navigator.userAgent);
const APPLE_IMG_BASE = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/';
const EMOJI_MODES = ['apple', 'joy', 'native'];   // cycle with "j"
let emojiMode = 'apple';                           // default: Apple everywhere
if (window.joypixels) joypixels.emojiSize = '64';  // size irrelevant after src rewrite; just keeps the parser happy
// Render an ALREADY HTML-ESCAPED string per current mode: apple/joy → emoji <img>, native → unchanged.
function emojiImg(escaped) {
  if (emojiMode === 'native' || !window.joypixels) return escaped;
  if (emojiMode === 'apple' && IS_APPLE) return escaped;            // native already IS Apple → no images needed
  let html;
  const fn = joypixels.unicodeToImage || joypixels.toImage;        // parser finds emoji + builds <img class="joypixels">
  try { html = fn.call(joypixels, escaped); } catch (_) { return escaped; }
  // 'apple': repoint the parser's codepoint filenames at the Apple image set (same {codepoint}.png naming).
  if (emojiMode === 'apple') html = html.replace(/src="[^"]*?\/([0-9a-f-]+)\.png"/g, `src="${APPLE_IMG_BASE}$1.png"`);
  return html;                                                      // 'joy' keeps the JoyPixels CDN src
}
// Render my own avatar button: picture > emoji > default smiley
function setOwnAvatarDisplay() {
  if (myAvatar) {
    nameEmojiBtn.classList.add('pic');
    nameEmojiBtn.style.backgroundImage = `url('${myAvatar}')`;
    nameEmojiBtn.textContent = '';
  } else {
    nameEmojiBtn.classList.remove('pic');
    nameEmojiBtn.style.backgroundImage = '';
    nameEmojiBtn.innerHTML = `<span style="pointer-events:none">${emojiImg(escapeHtml(myEmoji || '🙂'))}</span>`;
  }
}
setOwnAvatarDisplay();

// On a fresh device my own avatar/emoji lives only in some OTHER device's localStorage — but it is
// also published (encrypted) to my identity row. Pull it from there so my picture shows on EVERY
// device. Never wipe a valid local value with garbage/empty (e.g. on a decryption miss).
async function syncOwnAvatarFromIdentity(r, dk) {
  const av = await decDirWith(r.avatar, dk);
  if (av && av.startsWith('data:')) {                                   // a valid published picture
    if (av !== myAvatar) { myAvatar = av; myEmoji = ''; localStorage.setItem(AVATAR_KEY, av); localStorage.removeItem(EMOJI_KEY); setOwnAvatarDisplay(); }
    return;
  }
  const em = await decDirWith(r.emoji, dk);
  if (em && em.length <= 12 && em !== '[falscher Schlüssel]') {         // a single published emoji (not garbage)
    if (em !== myEmoji || myAvatar) { myEmoji = em; myAvatar = ''; localStorage.setItem(EMOJI_KEY, em); localStorage.removeItem(AVATAR_KEY); setOwnAvatarDisplay(); }
  }
  // else: nothing valid published → keep whatever is local (don't wipe it)
}

// WhatsApp-style picker (emoji-picker-element): a click delivers the emoji to pickEmoji().
// GUARD: if the <emoji-picker> isn't found (e.g. a stale-cached HTML with an older structure),
// don't let a null deref abort this whole file — that would silently kill the avatar/emoji wiring below.
if (!emojiPicker) dbg('⚠️ <emoji-picker> nicht gefunden — alte HTML gecacht? (Code läuft trotzdem weiter)');
if (emojiPicker) emojiPicker.addEventListener('emoji-click', ev => pickEmoji(ev.detail.unicode));
// Tapping the dimmed area outside the sheet closes it
emojiPanel && emojiPanel.addEventListener('click', e => { if (e.target === emojiPanel) emojiPanel.classList.add('hidden'); });
// Inner styling lives in the picker's shadow DOM — inject a <style> there (the documented way).
// Selectors: #skintone-button is the skin-tone (hand) button, input.search is the search box.
customElements.whenDefined('emoji-picker').then(() => {
  if (!emojiPicker || !emojiPicker.shadowRoot) return;
  const style = document.createElement('style');
  style.textContent = `::-webkit-scrollbar{width:6px;height:6px}
    ::-webkit-scrollbar-thumb{background:rgba(0,210,255,.3);border-radius:3px}
    ::-webkit-scrollbar-track{background:transparent}
    @supports (-moz-appearance:none){*{scrollbar-width:thin;scrollbar-color:rgba(0,210,255,.3) transparent}}
    #skintone-button{display:none}
    input.search{font-size:13px;width:calc(100% - 4px);margin:0 auto}
    .picker{border-radius:12px}`;
  emojiPicker.shadowRoot.appendChild(style);
});

// Where a picked emoji goes: 'avatar' (header button) changes the personal emoji;
// 'text' (input button) inserts the emoji into the message text, like WhatsApp.
let emojiTarget = 'avatar';
function openEmojiPanel() { emojiPanel.classList.remove('hidden'); }
async function pickEmoji(e) {
  // Input button: insert into the message text at the caret, keep the sheet open (like WhatsApp)
  if (emojiTarget === 'text') {
    const start = msgInput.selectionStart ?? msgInput.value.length;
    const end = msgInput.selectionEnd ?? msgInput.value.length;
    msgInput.value = msgInput.value.slice(0, start) + e + msgInput.value.slice(end);
    const caret = start + e.length;
    msgInput.setSelectionRange(caret, caret);
    updateSendBtn();
    dbg('Emoji in Text eingefügt: ' + e);
    return;
  }
  // Header button: change the personal avatar emoji (1:1 model: only local, no message rewrite)
  emojiPanel.classList.add('hidden');
  myEmoji = e;
  myAvatar = '';                       // choosing an emoji clears a previously set picture
  localStorage.setItem(EMOJI_KEY, e);
  localStorage.removeItem(AVATAR_KEY);
  setOwnAvatarDisplay();
  publishEmoji(e); // share it so it appears in everyone's contact list
  dbg('Avatar-Emoji gewählt: ' + e);
  if (!msgInput.disabled) msgInput.focus();
}
// Publish my chosen avatar emoji to my identity row (others read it for their contact list).
async function publishEmoji(em) {
  if (!client || !myPubB64) return;
  // Target THIS identity by its unique pubkey, not by owner uid (several accounts can share one uid).
  const { error } = await client.from('identities').update({ emoji: await encDir(em), avatar: null }).eq('pubkey', myPubB64);
  if (error) dbg('Emoji-Update fehlgeschlagen (Spalte/Policy vorhanden?): ' + error.message);
}
// Downscale a chosen image to a small centered square and publish it as my avatar.
function fileToAvatarDataURL(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = 96, cv = document.createElement('canvas');
      cv.width = cv.height = size;
      const s = Math.min(img.width, img.height), sx = (img.width - s) / 2, sy = (img.height - s) / 2;
      cv.getContext('2d').drawImage(img, sx, sy, s, s, 0, 0, size, size);
      URL.revokeObjectURL(img.src);
      resolve(cv.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
async function chooseAvatarPicture(file) {
  if (!file) return;
  try {
    const dataUrl = await fileToAvatarDataURL(file);
    myAvatar = dataUrl; myEmoji = '';
    localStorage.setItem(AVATAR_KEY, dataUrl);
    localStorage.removeItem(EMOJI_KEY);
    setOwnAvatarDisplay();
    if (client && myPubB64) {
      const { error } = await client.from('identities').update({ avatar: await encDir(dataUrl), emoji: null }).eq('pubkey', myPubB64);
      if (error) dbg('Avatar-Bild-Update fehlgeschlagen (Spalte da?): ' + error.message);
    }
    dbg('Avatar-Bild gesetzt (' + Math.round(dataUrl.length / 1024) + ' KB)');
  } catch (e) { dbg('Bild konnte nicht verarbeitet werden: ' + (e && e.message ? e.message : e)); }
}
// Header avatar button: open the chooser → Emoji or Picture
const avatarChoice = document.getElementById('avatar-choice');
nameEmojiBtn.onclick = () => avatarChoice.classList.remove('hidden');
msgEmojiBtn.onclick = () => { emojiTarget = 'text'; openEmojiPanel(); };   // input emoji button → insert into message
document.getElementById('ac-emoji').onclick = () => { avatarChoice.classList.add('hidden'); emojiTarget = 'avatar'; openEmojiPanel(); };
document.getElementById('ac-pic').onclick = () => { avatarChoice.classList.add('hidden'); document.getElementById('avatar-file').click(); };
document.getElementById('avatar-file').onchange = e => { chooseAvatarPicture(e.target.files[0]); e.target.value = ''; };
avatarChoice.addEventListener('click', e => { if (e.target === avatarChoice) avatarChoice.classList.add('hidden'); });

// One-time recovery code modal (shown after sign-up)
// ===========================================================================
// MODALS — recovery code, styled confirm, styled prompt
// ===========================================================================
function showRecoveryModal(code) {
  document.getElementById('rc-code').textContent = code;
  document.getElementById('recovery-modal').classList.remove('hidden');
}
document.getElementById('rc-copy').onclick = () => {
  navigator.clipboard?.writeText(document.getElementById('rc-code').textContent).catch(() => {});
};
document.getElementById('rc-done').onclick = () => document.getElementById('recovery-modal').classList.add('hidden');

// Styled replacement for window.confirm() → Promise<boolean>. opts: {okText, danger}
function uiConfirm(message, opts = {}) {
  return new Promise(resolve => {
    const modal = document.getElementById('confirm-modal');
    const yes = document.getElementById('cf-yes'), no = document.getElementById('cf-no');
    document.getElementById('cf-text').textContent = message;
    yes.textContent = opts.okText || 'OK';
    yes.classList.toggle('danger', !!opts.danger);
    no.style.display = opts.alert ? 'none' : '';   // info mode → only an OK button
    modal.classList.remove('hidden');
    const done = val => { modal.classList.add('hidden'); yes.onclick = no.onclick = null; resolve(val); };
    yes.onclick = () => done(true);
    no.onclick = () => done(false);
  });
}

// Styled text-input prompt — resolves to the entered string, or null on cancel.
function uiPrompt(message, opts = {}) {
  return new Promise(resolve => {
    const modal = document.getElementById('prompt-modal');
    const input = document.getElementById('pr-input');
    const eye = document.getElementById('pr-eye');
    const yes = document.getElementById('pr-yes'), no = document.getElementById('pr-no');
    const EYE_OPEN = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
    const EYE_OFF = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
    document.getElementById('pr-text').textContent = message;
    input.type = opts.password ? 'password' : 'text';
    input.placeholder = opts.placeholder || '';
    input.value = opts.initial || '';
    yes.textContent = opts.okText || 'OK';
    // Eye reveal toggle — only for password prompts; reset to the "show" icon on each open.
    eye.style.display = opts.password ? '' : 'none';
    eye.querySelector('svg').innerHTML = EYE_OPEN;
    eye.onclick = () => {
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      eye.querySelector('svg').innerHTML = reveal ? EYE_OFF : EYE_OPEN;
      input.focus();
    };
    modal.classList.remove('hidden');
    setTimeout(() => input.focus(), 0);
    const done = val => { modal.classList.add('hidden'); yes.onclick = no.onclick = input.onkeydown = eye.onclick = null; resolve(val); };
    yes.onclick = () => done(input.value);
    no.onclick = () => done(null);
    input.onkeydown = e => { if (e.key === 'Enter') done(input.value); else if (e.key === 'Escape') done(null); };
  });
}

// Two-field dialog for founding a group → resolves to { name, pwd } or null on cancel.
function uiNewGroup() {
  return new Promise(resolve => {
    const modal = document.getElementById('group-modal');
    const nameEl = document.getElementById('gm-name'), pwdEl = document.getElementById('gm-pwd');
    const yes = document.getElementById('gm-yes'), no = document.getElementById('gm-no');
    nameEl.value = ''; pwdEl.value = '';
    // Both are plain text inputs (no type="password") → Firefox sees no login pair, so no
    // "Passwörter verwalten" overlay on either field. The group password is shared anyway.
    modal.classList.remove('hidden');
    setTimeout(() => nameEl.focus(), 0);
    const done = val => { modal.classList.add('hidden'); yes.onclick = no.onclick = nameEl.onkeydown = pwdEl.onkeydown = null; resolve(val); };
    const submit = () => done({ name: nameEl.value.trim(), pwd: pwdEl.value });
    yes.onclick = submit;
    no.onclick = () => done(null);
    const onKey = e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } else if (e.key === 'Escape') done(null); };
    nameEl.onkeydown = onKey; pwdEl.onkeydown = onKey;
  });
}



// ===========================================================================
// NAMES — name_id (HMAC), claim a name in a group
// ===========================================================================
// --- Name binding: name_id = HMAC(name), reserved once in the identities table (name ↔ pubkey) ---
function bufToHex(buf) {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
// HMAC key uses a SEPARATE salt from the AES key — never reuse one key for two purposes
async function deriveHmacKey(password) {
  const enc = new TextEncoder();
  const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('forloop-chat-hmac-salt'), iterations: 100000, hash: 'SHA-256' },
    km, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
}
async function nameId(name) {
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign('HMAC', hmacKey, enc.encode(name.toLowerCase()));
  return bufToHex(sig);
}
// Returns true if the name is now ours (freshly claimed or already owned via our signing key)
async function claimName(name) {
  if (!hmacKey) { alert('Erst Passwort eingeben!'); return false; }
  await ensureClient();
  const id = await nameId(name);
  // A name is bound to a public key. Ours if the stored pubkey matches this device's key.
  const { data, error } = await client.from('identities').select('pubkey').eq('name_id', id).limit(1);
  if (error) { dbg('Claim-Check nicht möglich (Tabelle da?): ' + error.message); return true; }
  if (data && data.length) {
    if (data[0].pubkey === myPubB64) { dbg('Name gehört dir: ' + name); return true; }
    dbg('Name vergeben: ' + name);
    alert('Der Name „' + name + '" ist bereits vergeben — bitte einen anderen wählen.');
    return false;
  }
  // Store signing key + ECDH key + clear-text name (name & ecdh_pubkey power 1:1 chats / contact list)
  const row = { name_id: id, pubkey: myPubB64, ecdh_pubkey: myEcdhPubB64, name: await encDir(name), emoji: await encDir(myEmoji), avatar: await encDir(myAvatar), group_id: myGroupId };
  let { error: insErr } = await client.from('identities').insert(row);
  if (insErr && /ecdh_pubkey|name|group_id|column|schema|cache/i.test(insErr.message)) {
    // Columns not added yet (E1-SQL pending) → fall back to the minimal row
    dbg('identities-Spalten fehlen — Claim ohne ECDH/Name (bitte E1-SQL ausführen): ' + insErr.message);
    ({ error: insErr } = await client.from('identities').insert({ name_id: id, pubkey: myPubB64 }));
  }
  if (insErr) {
    dbg('Claim fehlgeschlagen: ' + insErr.message);
    alert('Der Name „' + name + '" ist bereits vergeben — bitte einen anderen wählen.');
    return false;
  }
  dbg('Name beansprucht (Schlüssel + ECDH gebunden): ' + name);
  return true;
}
