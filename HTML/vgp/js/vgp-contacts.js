// VGP — part of the chat app, loaded in order (classic scripts share one global scope).
// Do NOT reorder the <script> tags in vgpchat.html; top-level code runs in document order.
// ===========================================================================
// CONTACTS & ROOM — list, pinned group room, selection, meta (unread/time)
// ===========================================================================
// --- Contact list (everyone registered, except me) ---
let activePeer = null;          // the contact we're currently chatting with (1:1)
let activeRoom = false;         // true when the shared group room ("# Familie") is open instead of a 1:1
let roomUnread = 0;             // unread count for the group room (local)
let roomLastTime = null;        // last message time in the group room (for the pinned row)
let allContacts = [];           // flat union of all groups' members (for nameForPubkey + search)
let groupsData = [];            // [{pwd,label,groupId,members:[{name,pubkey,ecdh_pubkey,emoji,avatar,groupPwd}],roomUnread,roomLastTime}]
let collapsedGroups = new Set(); // group passwords whose section is collapsed in the sidebar
// Decrypt a directory field with an EXPLICIT key (so we can decrypt other groups' directories,
// not just the active one). Passes plaintext/legacy through.
async function decDirWith(v, key) { return (key && v && v.startsWith('ENC:')) ? await decryptText(v, key) : (v || ''); }
// Label of the currently active group (shown as the room name); falls back to "Familie".
function activeGroupLabel() {
  const g = myGroups.find(x => x.pwd === activeGroupPwd);
  return (g && g.label) || 'Familie';
}
// Read-state key for the group room (per group, so unread is tracked separately per family).
function roomReadKey() { return '#room:' + myGroupId; }
function contactAvatar(name) { return (name || '?').trim().charAt(0).toUpperCase(); }
// Resolve a signing pubkey to a display name (for sender labels in the group room).
function nameForPubkey(pub) {
  if (pub === myPubB64) return myNameEl.value || 'ich';
  const c = allContacts.find(x => x.pubkey === pub);
  return c ? c.name : 'Unbekannt';
}
// Stable per-sender colour for room name labels (same person → same colour, like WhatsApp).
function senderColor(pub) {
  let h = 0; for (let i = 0; i < pub.length; i++) h = (h * 31 + pub.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 70% 72%)`;
}

// --- Contact-row meta: green unread badge + time of the last message per contact ---
const READ_KEY = 'vgp-read';    // { peerUid: ISO timestamp of when we last opened that chat }
let unreadByPeer = {};          // peerUid -> count of unread (received-but-not-yet-opened) messages
let lastTimeByPeer = {};        // peerUid -> ISO timestamp of the last message in that conversation
let receivedFrom = new Set();   // peers I have received at least one message from (for delivery receipts)
function readMap() { try { return JSON.parse(localStorage.getItem(READ_KEY)) || {}; } catch { return {}; } }
function markRead(peerUid) { const m = readMap(); m[peerUid] = new Date().toISOString(); localStorage.setItem(READ_KEY, JSON.stringify(m)); }
// WhatsApp-style time: today → relative ("vor x Min/Std"), yesterday and older → "dd.mm - hh:mm".
function fmtContactTime(iso) {
  const d = new Date(iso), now = new Date();
  if (d.toDateString() === now.toDateString()) {
    const min = Math.floor((now - d) / 60000);
    if (min < 1) return 'gerade eben';
    if (min < 60) return `vor ${min} Min`;
    return `vor ${Math.floor(min / 60)} Std`;
  }
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)} - ${p(d.getHours())}:${p(d.getMinutes())}`;
}
// Per contact: last-message time (both directions) + count of unread messages addressed to me.
async function computeContactMeta() {
  unreadByPeer = {}; lastTimeByPeer = {}; receivedFrom = new Set();
  if (!allContacts.length || !myPubB64) return;
  // Only my own messages (server-side) — keeps load + metadata exposure down; fallback if OR errors.
  const mine = `pubkey.eq."${myPubB64}",recipient_pubkey.eq."${myPubB64}"`;
  let { data, error } = await client.from('messages').select('created_at,pubkey,recipient_pubkey').or(mine);
  if (error) ({ data, error } = await client.from('messages').select('created_at,pubkey,recipient_pubkey'));
  if (error) { dbg('Kontakt-Meta nicht ladbar: ' + error.message); return; }
  const reads = readMap();
  for (const m of (data || [])) {
    const peer = m.pubkey === myPubB64 ? m.recipient_pubkey : (m.recipient_pubkey === myPubB64 ? m.pubkey : null);
    if (!peer) continue;
    if (!lastTimeByPeer[peer] || m.created_at > lastTimeByPeer[peer]) lastTimeByPeer[peer] = m.created_at;
    if (m.pubkey === peer) {                                      // a message I received
      receivedFrom.add(peer);
      const base = reads[peer] ? new Date(reads[peer]).getTime() : 0;
      if (new Date(m.created_at).getTime() > base) unreadByPeer[peer] = (unreadByPeer[peer] || 0) + 1;
    }
  }
  // Per-group room meta: last-message time + unread (messages from others since I last opened each room).
  if (groupsData.length) {
    const gids = groupsData.map(g => g.groupId);
    let { data: rdata, error: rerr } = await client.from('messages').select('created_at,pubkey,room_id').in('room_id', gids);
    if (rerr) ({ data: rdata } = await client.from('messages').select('created_at,pubkey,room_id'));
    for (const g of groupsData) {
      g.roomUnread = 0; g.roomLastTime = null;
      const base = reads['#room:' + g.groupId] ? new Date(reads['#room:' + g.groupId]).getTime() : 0;
      for (const m of (rdata || [])) {
        if (m.room_id !== g.groupId) continue;
        if (!g.roomLastTime || m.created_at > g.roomLastTime) g.roomLastTime = m.created_at;
        if (m.pubkey !== myPubB64 && new Date(m.created_at).getTime() > base) g.roomUnread++;
      }
    }
  }
}
const searchVal = () => document.getElementById('contact-search').value;
// Relative times age → refresh the contact list every minute so "vor x Min" stays correct.
setInterval(() => { if (chatReady) renderContacts(searchVal()); }, 60000);

async function loadContacts() {
  // Load the directory of EVERY group I'm in (each scoped + decrypted with its own group key),
  // so the sidebar can show all my groups with their members underneath.
  const me = (myNameEl.value || '').toLowerCase();
  const next = [];
  for (const g of myGroups) {
    const gid = await deriveGroupId(g.pwd);
    const dk = await deriveDirKey(g.pwd);
    let { data, error } = await client.from('identities').select('name,pubkey,ecdh_pubkey,owner,emoji,avatar,group_id').eq('group_id', gid);
    if (error) { dbg('Kontakte (' + g.label + ') nicht ladbar: ' + error.message); data = []; }
    const members = [];
    for (const r of (data || [])) {
      const name = await decDirWith(r.name, dk);
      if (!name || name.toLowerCase() === me || !r.ecdh_pubkey || !r.owner) continue;
      members.push({ name, pubkey: r.pubkey, ecdh_pubkey: r.ecdh_pubkey,
                     emoji: await decDirWith(r.emoji, dk), avatar: await decDirWith(r.avatar, dk), groupPwd: g.pwd });
    }
    members.sort((a, b) => a.name.localeCompare(b.name));
    next.push({ pwd: g.pwd, label: g.label, groupId: gid, members, roomUnread: 0, roomLastTime: null });
  }
  groupsData = next;
  allContacts = next.flatMap(x => x.members); // flat union for nameForPubkey + search
  await computeContactMeta();
  renderContacts(searchVal());
  refreshGroupName(); // pick up a rename done by another member (authoritative name from group_meta)
}
// The pinned group-room row ("# Familie") at the very top of the sidebar — opens the shared room.
// Group-of-people logo for the shared group room (inherits .room-av color via currentColor)
const GROUP_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" style="width:64%;height:64%" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';
// One contact/member row (1:1). `active` highlights the open conversation.
function memberRow(c, active) {
  const div = document.createElement('div');
  div.className = 'contact member' + (active ? ' active' : '');
  const n = unreadByPeer[c.pubkey] || 0;
  const t = lastTimeByPeer[c.pubkey] ? fmtContactTime(lastTimeByPeer[c.pubkey]) : '';
  const av = c.avatar ? `<span class="av pic" style="background-image:url('${c.avatar}')"></span>`
           : c.emoji ? `<span class="av emo">${emojiImg(escapeHtml(c.emoji))}</span>`
           : `<span class="av">${escapeHtml(contactAvatar(c.name))}</span>`;
  div.innerHTML = av + `<span class="nm">${escapeHtml(c.name)}</span>` +
                  `<div class="c-meta">` +
                    (t ? `<span class="c-time${n ? ' unread' : ''}">${escapeHtml(t)}</span>` : '') +
                    (n ? `<span class="c-badge">${n > 99 ? '99+' : n}</span>` : '') +
                  `</div>`;
  div.onclick = () => openMember(c);
  return div;
}
// Sidebar shows ALL my groups; under each: its room ("An alle") + its members.
function renderContacts(filter) {
  const list = document.getElementById('contact-list');
  const f = (filter || '').toLowerCase();
  list.innerHTML = '';
  if (!groupsData.length) {
    const empty = document.createElement('div');
    empty.setAttribute('style', 'padding:14px;color:rgba(0,210,255,.4);font-size:13px');
    empty.textContent = 'Noch keine Gruppe.';
    list.appendChild(empty);
    return;
  }
  for (const g of groupsData) {
    const isActive = g.pwd === activeGroupPwd;
    const collapsed = collapsedGroups.has(g.pwd);
    // group header: click the NAME → make this group active (+ expand); click the TRIANGLE → just collapse/expand
    const head = document.createElement('div');
    head.className = 'grp-head' + (isActive ? ' active' : '') + (collapsed ? ' collapsed' : '');
    const tri = document.createElement('span');
    tri.className = 'gh-tri';
    tri.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
    tri.onclick = (e) => { e.stopPropagation(); if (collapsedGroups.has(g.pwd)) collapsedGroups.delete(g.pwd); else collapsedGroups.add(g.pwd); renderContacts(searchVal()); };
    const nm = document.createElement('span');
    nm.className = 'gh-name';
    nm.textContent = g.label;
    head.appendChild(tri); head.appendChild(nm);
    // collapsed → show latest time + green unread badge on the header, so you don't miss activity
    if (collapsed) {
      const groupUnread = (g.roomUnread || 0) + g.members.reduce((s, m) => s + (unreadByPeer[m.pubkey] || 0), 0);
      let groupLast = g.roomLastTime;
      for (const m of g.members) { const t = lastTimeByPeer[m.pubkey]; if (t && (!groupLast || t > groupLast)) groupLast = t; }
      const tStr = groupLast ? fmtContactTime(groupLast) : '';
      const meta = document.createElement('div');
      meta.className = 'c-meta';
      meta.innerHTML = (tStr ? `<span class="c-time${groupUnread ? ' unread' : ''}">${escapeHtml(tStr)}</span>` : '') +
                       (groupUnread ? `<span class="c-badge">${groupUnread > 99 ? '99+' : groupUnread}</span>` : '');
      head.appendChild(meta);
    } else if (isActive) {
      // active + open → ⋮ on the right opens the group-actions popup (new / join / rename)
      const gm = document.createElement('button');
      gm.type = 'button'; gm.className = 'gh-menu'; gm.setAttribute('aria-label', 'Gruppen-Aktionen');
      gm.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`;
      gm.onclick = (e) => { e.stopPropagation(); openGrpActions(gm); };
      head.appendChild(gm);
    }
    head.onclick = () => { collapsedGroups.delete(g.pwd); if (g.pwd !== activeGroupPwd) switchGroup(g.pwd); else renderContacts(searchVal()); };
    list.appendChild(head);
    if (collapsed) continue; // collapsed → show only the header
    // room row ("An alle")
    const roomDiv = document.createElement('div');
    roomDiv.className = 'contact room' + (isActive && activeRoom ? ' active' : '');
    const rt = g.roomLastTime ? fmtContactTime(g.roomLastTime) : '';
    roomDiv.innerHTML = `<span class="av room-av">${GROUP_ICON}</span><span class="nm">an alle</span>` +
                        `<div class="c-meta">` +
                          (rt ? `<span class="c-time${g.roomUnread ? ' unread' : ''}">${escapeHtml(rt)}</span>` : '') +
                          (g.roomUnread ? `<span class="c-badge">${g.roomUnread > 99 ? '99+' : g.roomUnread}</span>` : '') +
                        `</div>`;
    roomDiv.onclick = () => openGroupRoom(g.pwd);
    list.appendChild(roomDiv);
    // members (filtered by search)
    for (const c of g.members) {
      if (f && !c.name.toLowerCase().includes(f)) continue;
      const active = isActive && !activeRoom && activePeer && activePeer.pubkey === c.pubkey;
      list.appendChild(memberRow(c, active));
    }
  }
}
// Open a group's room — switch the active group first (so its room key is in effect), then show it.
async function openGroupRoom(pwd) {
  if (pwd !== activeGroupPwd) await switchGroup(pwd);
  selectRoom();
}
// Open a 1:1 — switch to that member's group (keeps the active-group highlight consistent), then show it.
async function openMember(m) {
  if (m.groupPwd && m.groupPwd !== activeGroupPwd) await switchGroup(m.groupPwd);
  selectContact(m);
}
// Open the shared group room ("# Familie"): everyone in the group sees these messages.
function selectRoom() {
  activeRoom = true;
  activePeer = null;
  markRead(roomReadKey());       // opening the room clears its unread count (persisted, per group)
  const gd = groupsData.find(x => x.pwd === activeGroupPwd); if (gd) gd.roomUnread = 0; // clear badge now
  document.getElementById('chat-watermark').classList.add('hidden');
  const peerAv = document.getElementById('chat-peer-av');
  peerAv.className = 'room-av'; peerAv.style.backgroundImage = ''; peerAv.innerHTML = GROUP_ICON;
  document.getElementById('chat-peer').textContent = activeGroupLabel();
  const appEl = document.getElementById('app'); appEl.classList.add('chat-open'); appEl.classList.add('room-mode'); // broadcasting → red compose field
  msgInput.disabled = false;
  renderContacts(searchVal());  // refresh active highlight + clear room badge
  loadMessages();
  msgInput.focus();
}
function selectContact(c) {
  activePeer = c;
  activeRoom = false;
  markRead(c.pubkey);           // opening the chat clears its unread count (local)
  publishRead(c.pubkey);        // tell the sender I read their messages → their ticks turn blue
  unreadByPeer[c.pubkey] = 0;
  document.getElementById('chat-watermark').classList.add('hidden'); // hide brand watermark once chatting
  const peerAv = document.getElementById('chat-peer-av');
  peerAv.classList.toggle('pic', !!c.avatar);
  peerAv.classList.toggle('emo', !c.avatar && !!c.emoji);
  if (c.avatar) { peerAv.style.backgroundImage = `url('${c.avatar}')`; peerAv.textContent = ''; }
  else { peerAv.style.backgroundImage = ''; peerAv.innerHTML = emojiImg(escapeHtml(c.emoji || contactAvatar(c.name))); }
  document.getElementById('chat-peer').textContent = c.name;
  const appEl = document.getElementById('app'); appEl.classList.add('chat-open'); appEl.classList.remove('room-mode'); // 1:1 → normal compose field
  msgInput.disabled = false;
  renderContacts(searchVal());  // refresh active highlight + remove the green badge
  loadMessages(); // filter to this 1:1 conversation
  msgInput.focus();
}
document.getElementById('contact-search').addEventListener('input', e => renderContacts(e.target.value));

// Debug hotkey: "j" toggles JoyPixels vs. native emoji and re-renders (ignored while typing in a field).
function rerenderEmoji() {
  setOwnAvatarDisplay();
  if (typeof chatReady !== 'undefined' && chatReady) renderContacts(searchVal());
  if (activePeer) {
    const peerAv = document.getElementById('chat-peer-av');
    if (!activePeer.avatar) peerAv.innerHTML = emojiImg(escapeHtml(activePeer.emoji || contactAvatar(activePeer.name)));
    loadMessages();
  }
}
let colorWin = null; // reused color-picker child window (so "c" focuses instead of re-opening)
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable || t.tagName === 'EMOJI-PICKER')) return;
  const k = e.key.toLowerCase();
  if (k === 'j') {                          // cycle emoji set: apple → joy → native
    emojiMode = EMOJI_MODES[(EMOJI_MODES.indexOf(emojiMode) + 1) % EMOJI_MODES.length];
    dbg('Emoji-Set: ' + emojiMode);
    rerenderEmoji();
  } else if (k === 'c') {                    // open the color picker as a child window (live control via window.opener)
    if (colorWin && !colorWin.closed) { colorWin.focus(); return; }
    let feat = 'width=1060,height=380';    // wide one-row default; restore last position & size if saved
    try { const b = JSON.parse(localStorage.getItem('cp-bounds-v3')); if (b && b.w && b.h) feat = `width=${b.w},height=${b.h},left=${b.x},top=${b.y}`; } catch (_) {}
    // Open with an EMPTY url (about:blank) + write the markup in → Chrome shows no file-URL bar (like morph).
    // window.opener + localStorage still work because about:blank inherits the opener's origin.
    colorWin = window.open('', 'cp', feat);
    if (colorWin) {
      fetch('colorpicker.html?t=' + Date.now())     // cache-buster on the fetch, not on the popup URL
        .then(r => r.text())
        .then(html => { colorWin.document.open(); colorWin.document.write(html); colorWin.document.close(); })
        .catch(err => dbg('Colorpicker laden fehlgeschlagen: ' + err.message));
    }
    dbg(colorWin ? 'Colorpicker geöffnet (Taste c)' : 'Colorpicker: Popup blockiert?');
  }
});

// ===========================================================================
// VAULT — local app-lock (account password wraps the keypairs + groups)
// ===========================================================================
// --- Account-password vault (WhatsApp/Signal-style app lock) ---
// The account password derives a wrapping key (PBKDF2) that encrypts a local blob holding the
// private signing key + the room (E2E) password. Nothing is usable until the account password
// is entered. The vault lives in localStorage; only the public key + name are stored in clear.
// (VAULT_KEY is declared up top with the other storage keys so the auth start-up can use it.)
function vaultExists() { return !!localStorage.getItem(VAULT_KEY); }
function vaultName() { try { return JSON.parse(localStorage.getItem(VAULT_KEY)).name; } catch { return ''; } }

async function deriveWrapKey(accountPwd, saltBytes) {
  const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(accountPwd), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations: 210000, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}
// Write the local vault: lock {privJwk, ecdhPrivJwk, groups[], activeGroup} under the account password.
// Used both for fresh sign-up (new keys) and for restoring an identity onto a new device.
async function writeLocalVault(name, accountPwd, p) {
  normGroups(p);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const wrapKey = await deriveWrapKey(accountPwd, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const blob = new TextEncoder().encode(JSON.stringify({ privJwk: p.privJwk, ecdhPrivJwk: p.ecdhPrivJwk, groups: p.groups, activeGroup: p.activeGroup }));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrapKey, blob));
  const combined = new Uint8Array(iv.length + ct.length);
  combined.set(iv); combined.set(ct, iv.length);
  localStorage.setItem(VAULT_KEY, JSON.stringify({ name, pubkey: p.pubB64, ecdhPubkey: p.ecdhPubB64, salt: b64(salt), enc: b64(combined) }));
}
// Sign up: generate the device keypairs (ECDSA + ECDH) and store them in the local vault.
async function createVault(name, accountPwd, groupPwd, groupLabel) {
  const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const pubB64 = b64(await crypto.subtle.exportKey('spki', kp.publicKey));
  const privJwk = await crypto.subtle.exportKey('jwk', kp.privateKey);
  const ek = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']);
  const ecdhPubB64 = b64(await crypto.subtle.exportKey('spki', ek.publicKey));
  const ecdhPrivJwk = await crypto.subtle.exportKey('jwk', ek.privateKey);
  const payload = { name, pubB64, privJwk, ecdhPubB64, ecdhPrivJwk, groups: [{ pwd: groupPwd, label: (groupLabel || 'Familie').trim() }], activeGroup: groupPwd };
  await writeLocalVault(name, accountPwd, payload);
  dbg('Vault angelegt für ' + name);
  return payload;
}

// ===========================================================================
// BACKUP & SESSION — server envelope backup, restore, activate vault, initChat
// ===========================================================================
// --- Server backup (multi-device, "envelope"). The pure crypto primitives (kdfKEK / wrapMaster /
// unwrapMaster / genRecoveryCode / normCode + BACKUP_ITERS / RECOVERY_SALT) live in vgp-backup-core.js
// (loaded just before this file) so they're unit-testable in isolation. Restore via password OR code. ---
// Create/refresh the server backup. One random master key encrypts the full vault (incl. ALL groups);
// it's wrapped per group (so restore works with ANY group's password) + once by the recovery code.
// Writes one vaults row per group (same enc + wrap_recovery, per-group wrap_pwd). Returns recovery code.
async function createBackup(accountPwd, payload) {
  if (!client || !myUid) return null;
  normGroups(payload);
  const masterKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const enc = await encryptText(JSON.stringify(payload), masterKey);
  const recovery = genRecoveryCode();
  const wrap_recovery = await wrapMaster(masterKey, await kdfKEK(normCode(recovery), new TextEncoder().encode(RECOVERY_SALT)));
  for (const g of payload.groups) {
    const name_id = await computeNameId(payload.name, g.pwd);
    const saltPwd = crypto.getRandomValues(new Uint8Array(16));
    const wrap_pwd = await wrapMaster(masterKey, await kdfKEK(JSON.stringify([accountPwd, g.pwd]), saltPwd));
    const { error } = await client.from('vaults').upsert(
      { name_id, owner: myUid, enc, wrap_pwd, wrap_recovery, salt_pwd: b64(saltPwd) }, { onConflict: 'name_id' });
    if (error) { dbg('Backup-Zeile fehlgeschlagen: ' + error.message); return null; }
  }
  dbg('Server-Backup angelegt für ' + payload.groups.length + ' Gruppe(n)');
  return recovery;
}
// Ensure a server backup exists for this account (migrates older accounts created before backups).
async function ensureBackup(accountPwd, vault) {
  if (!client || !myPubB64) return;
  if (localStorage.getItem(BACKUP_OK_KEY)) return;  // this device already knows the backup exists
  const name_id = await nameId(vault.name); // hmacKey set by activateVault (active group)
  const { data, error } = await client.from('vaults').select('name_id').eq('name_id', name_id).limit(1);
  if (error) { dbg('Backup-Check-Fehler (lege NICHTS neu an): ' + error.message); return; } // never recreate on error
  if (data && data.length) { localStorage.setItem(BACKUP_OK_KEY, '1'); return; } // already there
  dbg('Kein Backup vorhanden — lege es einmalig an (Migration)');
  const recovery = await createBackup(accountPwd, vault);
  if (recovery) { localStorage.setItem(BACKUP_OK_KEY, '1'); showRecoveryModal(recovery); }
}
// name_id from a room password (needed at restore, before any vault/hmacKey exists)
async function computeNameId(name, roomPwd) {
  const hk = await deriveHmacKey(roomPwd);
  return bufToHex(await crypto.subtle.sign('HMAC', hk, new TextEncoder().encode(name.toLowerCase())));
}
// Restore an identity onto THIS device from the server backup. Returns the vault payload,
// or 'NONE' (no such account) / 'WRONG' (bad password). `secret` = account password OR recovery code.
async function restoreBackup(name, roomPwd, secret, viaRecovery) {
  await ensureClient();
  const name_id = await computeNameId(name, roomPwd);
  const { data, error } = await client.from('vaults').select('enc,wrap_pwd,wrap_recovery,salt_pwd').eq('name_id', name_id).limit(1);
  if (error) { dbg('Backup-Abruf-Fehler: ' + error.message); return null; }
  if (!data || !data.length) return 'NONE';
  const row = data[0];
  let masterKey;
  try {
    const kek = viaRecovery
      ? await kdfKEK(normCode(secret), new TextEncoder().encode(RECOVERY_SALT))
      : await kdfKEK(JSON.stringify([secret, roomPwd]), unb64(row.salt_pwd));
    masterKey = await unwrapMaster(viaRecovery ? row.wrap_recovery : row.wrap_pwd, kek);
  } catch (_) { return 'WRONG'; }
  try {
    const plain = await decryptText(row.enc, masterKey);
    if (plain === '[falscher Schlüssel]') return 'WRONG';
    const payload = JSON.parse(plain); // full vault incl. all groups
    payload.name = name;               // use the typed name (survives a later rename)
    return normGroups(payload, roomPwd); // land in the group I logged in with; migrate legacy roomPwd
  } catch (_) { return 'WRONG'; }
}
// Login / unlock: account password → decrypt vault. Returns 'WRONG' on bad password, null if none.
async function openVault(accountPwd) {
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return null;
  const v = JSON.parse(raw);
  const wrapKey = await deriveWrapKey(accountPwd, unb64(v.salt));
  const combined = unb64(v.enc);
  let blob;
  try {
    blob = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: combined.slice(0, 12) }, wrapKey, combined.slice(12));
  } catch (_) { return 'WRONG'; }
  const b = JSON.parse(new TextDecoder().decode(blob)); // {privJwk, ecdhPrivJwk, groups?, activeGroup?} (legacy: roomPwd)
  return normGroups({ name: v.name, pubB64: v.pubkey, ecdhPubB64: v.ecdhPubkey, privJwk: b.privJwk, ecdhPrivJwk: b.ecdhPrivJwk, groups: b.groups, activeGroup: b.activeGroup, roomPwd: b.roomPwd });
}
// Activate an unlocked vault: import signing key + ECDH key + derive E2E keys from the room password.
async function activateVault(vault) {
  normGroups(vault);
  myPubB64 = vault.pubB64;
  myEcdhPubB64 = vault.ecdhPubB64 || null;
  myPrivKey = await crypto.subtle.importKey('jwk', vault.privJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  if (vault.ecdhPrivJwk) myEcdhPrivKey = await crypto.subtle.importKey('jwk', vault.ecdhPrivJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveKey']);
  myGroups = vault.groups; activeGroupPwd = vault.activeGroup;
  await initCrypto(activeGroupPwd); // sets hmacKey/dirKey/group_id for the ACTIVE group
  myNameEl.value = vault.name;
  dbg('Vault entsperrt — ' + vault.name + ' · ' + myGroups.length + ' Gruppe(n)');
}
// 1:1 E2E: derive a shared AES key from our ECDH private key + the peer's ECDH public key.
// Both sides compute the SAME key (ECDH property) → no shared password needed. Cached per peer.
const chatKeyCache = new Map();
async function deriveChatKey(peerEcdhPubB64) {
  if (!myEcdhPrivKey || !peerEcdhPubB64) return null;
  if (chatKeyCache.has(peerEcdhPubB64)) return chatKeyCache.get(peerEcdhPubB64);
  const peerPub = await crypto.subtle.importKey('spki', unb64(peerEcdhPubB64), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const key = await crypto.subtle.deriveKey({ name: 'ECDH', public: peerPub }, myEcdhPrivKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  chatKeyCache.set(peerEcdhPubB64, key);
  return key;
}

async function initChat() {
  // Identity (signing key) + room password already came from the unlocked vault (activateVault).
  await ensureClient();
  chatReady = true;
  collapseInactive(); // start focused: only the active group is open
  dbg('Supabase-Client erstellt');
  await loadContacts();      // fill the sidebar
  if (!signingUp) await checkAccountAlive(); // deleted-elsewhere device logs out on load
  // Migrate older accounts: stamp my group_id once if it's still empty (so my group sees me)
  if (!signingUp && myGroupId) { try { await client.from('identities').update({ group_id: myGroupId }).eq('pubkey', myPubB64).is('group_id', null); } catch (_) {} }
  await markAllDelivered();  // confirm delivery for everything received while we were away
  subscribeMessages();
  msgInput.disabled = true;  // stays disabled until a contact is selected
  dbg('Chat bereit — wähle einen Kontakt');
}

let activeChatKey = null; // ECDH-derived AES key for the currently open 1:1 conversation
