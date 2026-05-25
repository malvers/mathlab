// VGP — part of the chat app, loaded in order (classic scripts share one global scope).
// Do NOT reorder the <script> tags in vgpchat.html; top-level code runs in document order.
// ===========================================================================
// RECEIPTS — delivery/read ticks (1:1 only)
// ===========================================================================
// --- Delivery/read receipts (✓ / ✓✓ gray / ✓✓ blue) ---
// receipts(reader=recipient pubkey, peer=sender pubkey, delivered_at, read_at): per-conversation marks.
let activeReceipt = null;  // the open peer's receipt ABOUT my messages (reader=peer, peer=me)
// I am the recipient: tell <peerPub> I received (delivered) / read their messages up to now.
async function publishDelivered(peerPub) {
  if (!myPubB64 || !peerPub) return;
  await client.from('receipts').upsert({ reader: myPubB64, peer: peerPub, delivered_at: new Date().toISOString() }, { onConflict: 'reader,peer' });
}
async function publishRead(peerPub) {
  if (!myPubB64 || !peerPub) return;
  const now = new Date().toISOString();
  await client.from('receipts').upsert({ reader: myPubB64, peer: peerPub, delivered_at: now, read_at: now }, { onConflict: 'reader,peer' });
}
// On (re)connect: tell every sender I've received from that their messages reached this device.
async function markAllDelivered() {
  if (!receivedFrom.size) return;
  const now = new Date().toISOString();
  const rows = [...receivedFrom].map(p => ({ reader: myPubB64, peer: p, delivered_at: now }));
  await client.from('receipts').upsert(rows, { onConflict: 'reader,peer' });
}
// I am the sender: load the open peer's receipt about MY messages, so I can show ticks.
async function loadActiveReceipt(peerPub) {
  const { data } = await client.from('receipts').select('delivered_at,read_at').eq('reader', peerPub).eq('peer', myPubB64).limit(1);
  activeReceipt = (data && data[0]) || null;
}
// Tick state for one of my messages given the peer's receipt high-water marks.
function tickState(createdAt) {
  const t = new Date(createdAt).getTime();
  if (activeReceipt) {
    if (activeReceipt.read_at && new Date(activeReceipt.read_at).getTime() >= t) return 'read';
    if (activeReceipt.delivered_at && new Date(activeReceipt.delivered_at).getTime() >= t) return 'delivered';
  }
  return 'sent';
}
const tickGlyph = s => (s === 'sent' ? '✓' : '✓✓');
// Re-color the ticks on already-rendered own messages (e.g. when a receipt arrives via realtime).
function updateTicks() {
  messagesEl.querySelectorAll('.msg.self[data-ts]').forEach(div => {
    const span = div.querySelector('.ticks');
    if (!span) return;
    const s = tickState(div.dataset.ts);
    span.className = 'ticks ' + s;
    span.textContent = tickGlyph(s);
  });
}

// ===========================================================================
// MESSAGES — load, realtime subscribe, render, send (1:1 + group room)
// ===========================================================================
async function loadMessages() {
  // Shared group room: fetch everything addressed to this group (room_id), decrypt with roomKey.
  if (activeRoom) {
    activeReceipt = null;
    let { data, error } = await client.from('messages').select('*').eq('room_id', myGroupId).order('created_at', { ascending: true });
    if (error) {
      dbg('Gruppen-Chat-Filter fehlgeschlagen, lade ungefiltert: ' + error.message);
      ({ data, error } = await client.from('messages').select('*').order('created_at', { ascending: true }));
    }
    if (error) { dbg('Fehler beim Laden: ' + error.message); return; }
    const rows = (data || []).filter(m => m.room_id === myGroupId);
    dbg(`${rows.length} Gruppen-Chat-Nachrichten in „${activeGroupLabel()}"`);
    messagesEl.innerHTML = '';
    for (const msg of rows) await renderMsg(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return;
  }
  if (!activePeer) { messagesEl.innerHTML = ''; activeReceipt = null; return; }
  activeChatKey = await deriveChatKey(activePeer.ecdh_pubkey);
  const peer = activePeer.pubkey;
  await loadActiveReceipt(peer); // the peer's delivered/read marks for my messages
  // Only fetch MY messages from the server (less load + fewer metadata to every client). The strict
  // client-side filter below still narrows to this peer. Fallback to unfiltered if the OR-filter errors.
  const mine = `pubkey.eq."${myPubB64}",recipient_pubkey.eq."${myPubB64}"`;
  let { data, error } = await client.from('messages').select('*').or(mine).order('created_at', { ascending: true });
  if (error) {
    dbg('Server-Filter fehlgeschlagen, lade ungefiltert: ' + error.message);
    ({ data, error } = await client.from('messages').select('*').order('created_at', { ascending: true }));
  }
  if (error) { dbg('Fehler beim Laden: ' + error.message); return; }
  // Strict 1:1 by IDENTITY (signing pubkey): keep ONLY messages between me and this peer.
  const rows = (data || []).filter(m =>
    (m.pubkey === myPubB64 && m.recipient_pubkey === peer) ||
    (m.pubkey === peer      && m.recipient_pubkey === myPubB64));
  dbg(`${rows.length} 1:1-Nachrichten mit ${activePeer.name}`);
  messagesEl.innerHTML = '';
  for (const msg of rows) await renderMsg(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// SECURITY / PRIVACY NOTE (bewusste Entscheidung beim pubkey-Routing, 2026-05-23):
// RLS ist gelockert — `messages` (read) und `receipts` sind für alle Authentifizierten lesbar,
// `receipts` auch schreibbar. Heißt: Mitglieder/Server sehen Metadaten (wer↔wer via pubkey, Zeiten)
// und könnten Quittungen fälschen. Der NACHRICHTENINHALT bleibt dicht (ECDH-E2E, nur die zwei Parteien),
// und Identitätsfälschung scheitert an der ECDSA-Signatur (→ ⚠️). Für eine geschlossene Gruppe ok;
// härter (z. B. recipient-gebundene RLS, signierte Receipts) wäre ein späteres Thema.
function subscribeMessages() {
  if (subscription) subscription.unsubscribe();
  dbg('Realtime-Subscription wird erstellt...');
  subscription = client
    .channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async payload => {
      const m = payload.new;
      // Group-room message (addressed to my group) → render if the room is open, else bump its badge.
      if (m.room_id) {
        const gd = groupsData.find(x => x.groupId === m.room_id);
        if (!gd) return; // not one of my groups
        gd.roomLastTime = m.created_at;
        const openHere = activeRoom && gd.pwd === activeGroupPwd; // this room is the one on screen
        if (openHere) {
          await renderMsg(m);
          messagesEl.scrollTop = messagesEl.scrollHeight;
        } else if (m.pubkey !== myPubB64) {
          gd.roomUnread++;
        }
        renderContacts(searchVal());
        return;
      }
      // Update the contact row's last-message time (both directions), keyed by identity (pubkey)
      const msgPeer = m.pubkey === myPubB64 ? m.recipient_pubkey : (m.recipient_pubkey === myPubB64 ? m.pubkey : null);
      if (msgPeer) lastTimeByPeer[msgPeer] = m.created_at;
      // Only render in the thread if it belongs to the currently open 1:1 conversation
      const peer = activePeer && activePeer.pubkey;
      if (peer && ((m.pubkey === myPubB64 && m.recipient_pubkey === peer) ||
                   (m.pubkey === peer      && m.recipient_pubkey === myPubB64))) {
        await renderMsg(m);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        if (m.pubkey === peer) { markRead(peer); publishRead(peer); } // received in open chat → read
      } else if (m.recipient_pubkey === myPubB64) {
        // Message for me in a chat I don't have open → bump badge + confirm delivery to the sender
        unreadByPeer[m.pubkey] = (unreadByPeer[m.pubkey] || 0) + 1;
        publishDelivered(m.pubkey);
      }
      renderContacts(searchVal()); // refresh time + badge live
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, () => {
      if (activePeer || activeRoom) loadMessages();
    })
    // A receipt changed → if it's the open peer acknowledging MY messages, recolor the ticks live
    .on('postgres_changes', { event: '*', schema: 'public', table: 'receipts' }, payload => {
      const r = payload.new;
      if (activePeer && r && r.reader === activePeer.pubkey && r.peer === myPubB64) {
        activeReceipt = { delivered_at: r.delivered_at, read_at: r.read_at };
        updateTicks();
      }
    })
    // A new account registered (or changed/deleted) → refresh the list + check if WE were deleted
    .on('postgres_changes', { event: '*', schema: 'public', table: 'identities' }, () => {
      dbg('Kontakte geändert — Liste aktualisieren');
      loadContacts();
      checkAccountAlive();
    })
    // A group was renamed (group_meta changed) → if it's MY group, pull the new name live.
    .on('postgres_changes', { event: '*', schema: 'public', table: 'group_meta' }, async payload => {
      if (payload.new && payload.new.group_id === myGroupId) { dbg('Gruppenname geändert — übernehme'); refreshGroupName(); }
    })
    .subscribe(status => {
      dbg('Realtime-Status: ' + JSON.stringify(status));
    });
}
// If this device's own identity was deleted elsewhere (Konto gelöscht) → log out automatically.
async function checkAccountAlive() {
  if (!myPubB64 || !chatReady) return;
  const { data, error } = await client.from('identities').select('name_id').eq('pubkey', myPubB64).limit(1);
  if (error || (data && data.length)) return; // can't tell, or still alive → nothing to do
  dbg('Eigene Identität ist weg (Konto gelöscht) — Gerät wird abgemeldet');
  sessionStorage.removeItem(SESSION_PWD_KEY);
  localStorage.removeItem(VAULT_KEY);
  localStorage.removeItem(BACKUP_OK_KEY);
  location.reload();
}
// Fallback if identities isn't in the realtime publication: refresh + alive-check on focus
window.addEventListener('focus', () => { if (chatReady) { loadContacts(); checkAccountAlive(); } });

async function renderMsg(msg) {
  // Skip if this message id is already on screen (realtime INSERT + loadMessages can race)
  if (msg.id != null && messagesEl.querySelector(`[data-id="${msg.id}"]`)) return;
  // 1:1: my own messages go right, the peer's go left (decided by signing pubkey = our identity)
  const isSelf = msg.pubkey === myPubB64;
  const div = document.createElement('div');
  div.className = 'msg ' + (isSelf ? 'self' : 'other');
  if (msg.id != null) div.dataset.id = msg.id;
  if (isSelf) div.dataset.ts = msg.created_at; // for updateTicks()
  div.dataset.pub = msg.pubkey; // author identity (used to group consecutive room messages)
  // Read the previous bubble's author BEFORE appending this one → suppress repeated sender names.
  const prevPub = messagesEl.lastElementChild ? messagesEl.lastElementChild.dataset.pub : null;
  // Room messages decrypt with the shared roomKey; 1:1 messages with the per-pair ECDH key.
  const isRoom = !!msg.room_id;
  const msgKey = isRoom ? roomKey : activeChatKey;
  const rawContent = msg.content && msg.content.startsWith('ENC:') ? await decryptText(msg.content, msgKey) : (msg.content || '');
  const decryptFailed = rawContent === '[falscher Schlüssel]';
  const content = decryptFailed ? '🔒' : rawContent;
  // Anti-impersonation: the signature is bound to recipient (1:1) or room (group). For a 1:1 the
  // signer must also be the expected peer/me; in the room any valid member key is fine (the displayed
  // sender name is resolved from the pubkey → forging someone else's name is not possible).
  let badge = '';
  if (!decryptFailed && msg.pubkey && msg.sig) {
    const bind = msg.room_id || msg.recipient_pubkey || '';
    const sigOk = await verifyText(msg.content + '|' + bind, msg.sig, msg.pubkey);
    const expectedPub = isRoom ? null : (isSelf ? myPubB64 : (activePeer && activePeer.pubkey));
    if (!sigOk || (expectedPub && msg.pubkey !== expectedPub)) {
      badge = '<span class="unverified" title="Signatur ungültig — mögliche Fälschung">⚠️</span> ';
      div.classList.add('forged');
    }
  }
  // In the group room, label incoming messages with the sender's name (once per run, coloured per person).
  const sender = (isRoom && !isSelf && msg.pubkey !== prevPub)
    ? `<span class="sender" style="color:${senderColor(msg.pubkey)}">${escapeHtml(nameForPubkey(msg.pubkey))}</span>`
    : '';
  const timeStr = new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  // Read receipts are per-pair → ticks only in 1:1, not in the group room.
  const ticks = (!isRoom && isSelf) ? (s => ` <span class="ticks ${s}">${tickGlyph(s)}</span>`)(tickState(msg.created_at)) : '';
  div.innerHTML = `${sender}${badge}<span class="text">${emojiImg(escapeHtml(content))}</span><span class="time">${timeStr}${ticks}</span>`;
  messagesEl.appendChild(div);
}

// Etappe 4: permanently delete the account — server rows (own messages, receipts, identity, backup)
// + everything local + sign out. Irreversible → three confirmations.
async function deleteAccount() {
  if (!myPubB64) { alert('Erst anmelden.'); return; }
  if (!await uiConfirm('Konto WIRKLICH löschen?\n\nDeine gesendeten Nachrichten, deine Identität (Name + Schlüssel) und dein Server-Backup werden entfernt.', { okText: 'LÖSCHEN', danger: true })) return;
  if (!await uiConfirm('Bist du ganz sicher?\n\nDas lässt sich NICHT rückgängig machen — auch dein Recovery-Code wird ungültig.', { okText: 'LÖSCHEN', danger: true })) return;
  if (!await uiConfirm('Letzte Warnung — Konto endgültig löschen?', { okText: 'LÖSCHEN', danger: true })) return;
  try {
    const id = await nameId((myNameEl.value || '').trim().toLowerCase());
    await client.from('messages').delete().eq('pubkey', myPubB64);                 // my sent messages (RLS: author=me)
    await client.from('receipts').delete().or(`reader.eq."${myPubB64}",peer.eq."${myPubB64}"`); // my receipts
    await client.from('identities').delete().eq('pubkey', myPubB64);               // my directory entry (RLS: owner=me)
    await client.from('vaults').delete().eq('name_id', id);                        // my server backup (RLS: owner=me)
    await client.auth.signOut();                                                   // drop the anonymous session
    dbg('Konto serverseitig gelöscht');
  } catch (e) { dbg('Löschfehler: ' + (e && e.message ? e.message : e)); }
  [VAULT_KEY, NAME_KEY, EMOJI_KEY, AVATAR_KEY, READ_KEY, BACKUP_OK_KEY].forEach(k => localStorage.removeItem(k));
  sessionStorage.removeItem(SESSION_PWD_KEY);
  location.reload();
}

// Rename: keep identity + chats (pubkey-routing), just move the name. Updates the directory entry
// and moves the server backup to the new name_id (recovery code stays valid). Local name is in clear.
async function renameAccount(newRaw) {
  const newName = (newRaw || '').trim().toLowerCase();
  if (!newName) return;
  if (!myPubB64 || !hmacKey) { alert('Bitte zuerst anmelden.'); return; }
  if (newName.length > 30) { alert('Name zu lang (max. 30 Zeichen).'); return; }
  const oldName = (myNameEl.value || '').trim().toLowerCase();
  if (newName === oldName) return;
  const oldId = await nameId(oldName), newId = await nameId(newName);
  // Is the new name free (owned by nobody else)?
  const { data: ex, error: exErr } = await client.from('identities').select('pubkey').eq('name_id', newId).limit(1);
  if (exErr) { alert('Prüfung fehlgeschlagen: ' + exErr.message); return; }
  if (ex && ex.length && ex[0].pubkey !== myPubB64) { alert('Der Name „' + newName + '" ist bereits vergeben.'); return; }
  // Move the server backup to the new key (enc/wraps untouched → recovery code stays valid)
  const { error: vErr } = await client.from('vaults').update({ name_id: newId }).eq('name_id', oldId);
  if (vErr) { alert('Umbenennen fehlgeschlagen (Backup): ' + vErr.message); return; }
  // Update the directory entry: new name_id + new encrypted display name
  const { error: iErr } = await client.from('identities').update({ name_id: newId, name: await encDir(newName) }).eq('pubkey', myPubB64);
  if (iErr) { alert('Umbenennen fehlgeschlagen: ' + iErr.message); return; }
  // Local vault keeps the name in clear in its wrapper → update it directly (no re-encryption needed)
  try { const v = JSON.parse(localStorage.getItem(VAULT_KEY)); if (v) { v.name = newName; localStorage.setItem(VAULT_KEY, JSON.stringify(v)); } } catch (_) {}
  localStorage.setItem(NAME_KEY, newName);
  myNameEl.value = newName;
  dbg('Umbenannt: ' + oldName + ' → ' + newName);
  loadContacts();
}

// ===========================================================================
// COMMANDS — slash-command registry + autocomplete box
// ===========================================================================
// --- Slash-command registry — single source of truth for autocomplete + execution ---
const CMD_LIST = [
  { cmd: '/help',    desc: 'Befehlsübersicht anzeigen',        run: () => document.getElementById('help-panel').classList.remove('hidden') },
  { cmd: '/stats',   desc: 'Belegten Speicher anzeigen',        run: () => showStats() },
  { cmd: '/rename',  desc: 'Namen ändern (Chats bleiben)',       run: () => { const n = prompt('Neuer Name (Chats & Identität bleiben erhalten):', myNameEl.value || ''); if (n) renameAccount(n); } },
  { cmd: '/logout',  desc: 'App sperren (Konto-Passwort nötig)', run: () => { sessionStorage.removeItem(SESSION_PWD_KEY); location.reload(); } }
  // „Konto löschen" liegt jetzt im ⋮-Menü oben links (nicht mehr als Tippbefehl).
];
const cmdBox = document.getElementById('cmd-box');
let cmdMatches = [], cmdActive = -1;

function refreshCmdBox() {
  const v = msgInput.value;
  if (!v.startsWith('/')) return hideCmdBox();
  cmdMatches = CMD_LIST.filter(c => c.cmd.startsWith(v.toLowerCase()));
  if (!cmdMatches.length) return hideCmdBox();
  cmdActive = 0;
  cmdBox.innerHTML = cmdMatches.map((c, i) =>
    `<div class="cmd-item${i === 0 ? ' active' : ''}" role="option" data-i="${i}"><code>${c.cmd}</code><span>${escapeHtml(c.desc)}</span></div>`
  ).join('');
  cmdBox.classList.remove('hidden');
}
function hideCmdBox() { cmdBox.classList.add('hidden'); cmdMatches = []; cmdActive = -1; }
function markCmdActive() {
  [...cmdBox.children].forEach((el, i) => el.classList.toggle('active', i === cmdActive));
}
function applyCmd(i) {
  if (i < 0 || i >= cmdMatches.length) return;
  msgInput.value = cmdMatches[i].cmd;
  hideCmdBox();
  msgInput.focus();
  updateSendBtn();
}
cmdBox.addEventListener('mousedown', e => {
  // mousedown (not click) so the input doesn't lose focus before we apply
  const item = e.target.closest('.cmd-item');
  if (item) { e.preventDefault(); applyCmd(+item.dataset.i); }
});

msgInput.onkeydown = e => {
  if (!cmdBox.classList.contains('hidden') && cmdMatches.length) {
    if (e.key === 'ArrowUp') { e.preventDefault(); cmdActive = (cmdActive - 1 + cmdMatches.length) % cmdMatches.length; markCmdActive(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdActive = (cmdActive + 1) % cmdMatches.length; markCmdActive(); return; }
    if (e.key === 'Tab') { e.preventDefault(); applyCmd(cmdActive); return; }
    if (e.key === 'Escape') { e.preventDefault(); hideCmdBox(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      // If the field already equals the active command, run it; otherwise complete it first
      if (msgInput.value.toLowerCase() === cmdMatches[cmdActive].cmd) { hideCmdBox(); sendMsg(); }
      else applyCmd(cmdActive);
      return;
    }
  }
  if (e.key === 'Enter') { e.preventDefault(); sendMsg(); }
};

// Send button: visible only while the field has text
const sendBtn = document.getElementById('send-btn');
function updateSendBtn() { sendBtn.classList.toggle('visible', msgInput.value.trim().length > 0); }
msgInput.addEventListener('input', () => { updateSendBtn(); refreshCmdBox(); });
msgInput.addEventListener('blur', () => setTimeout(hideCmdBox, 120));
sendBtn.onclick = () => sendMsg();

async function sendMsg() {
  hideCmdBox();
  const content = msgInput.value.trim();
  if (!content) return;
  // Dispatch slash commands — no name required
  const cmd = CMD_LIST.find(c => c.cmd === content.toLowerCase());
  if (cmd) {
    msgInput.value = ''; updateSendBtn();
    cmd.run();
    return;
  }
  // Group room → encrypt once with the shared roomKey, one row addressed to the group (room_id).
  if (activeRoom) {
    const encrypted = await encryptText(content, roomKey);
    const sig = await signText(encrypted + '|' + myGroupId); // signature bound to the room
    dbg(`Sende (Gruppen-Chat, verschlüsselt + signiert) an „${activeGroupLabel()}"`);
    const { error } = await client.from('messages').insert({ content: encrypted, room_id: myGroupId, recipient_pubkey: null, pubkey: myPubB64, sig });
    if (error) { dbg('Sendefehler (Gruppen-Chat): ' + error.message); return; }
    dbg('Gruppen-Chat-Nachricht gesendet');
    msgInput.value = ''; updateSendBtn();
    setTimeout(loadMessages, 300);
    return;
  }
  // Real message → 1:1 to the selected contact, encrypted with the ECDH-derived shared key
  if (!activePeer) return alert('Wähle zuerst einen Kontakt.');
  const chatKey = await deriveChatKey(activePeer.ecdh_pubkey);
  if (!chatKey) { dbg('Kein Chat-Schlüssel (ECDH) — Kontakt ohne ecdh_pubkey?'); return; }
  const encrypted = await encryptText(content, chatKey);
  // Sign the ciphertext bound to the recipient's identity → receiver verifies it's really from us
  const sig = await signText(encrypted + '|' + activePeer.pubkey);
  dbg(`Sende (1:1, verschlüsselt + signiert) an ${activePeer.name}`);
  const { error } = await client.from('messages').insert({ content: encrypted, recipient_pubkey: activePeer.pubkey, pubkey: myPubB64, sig });
  if (error) { dbg('Sendefehler: ' + error.message); return; }
  dbg('Nachricht gesendet');
  msgInput.value = ''; updateSendBtn();
  setTimeout(loadMessages, 300);
}

