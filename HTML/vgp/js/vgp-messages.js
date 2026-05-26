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
          if (m.pubkey === myPubB64) messagesEl.scrollTop = messagesEl.scrollHeight; else glideToBottom(messagesEl);
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
        if (m.pubkey === myPubB64) messagesEl.scrollTop = messagesEl.scrollHeight; else glideToBottom(messagesEl);
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
    // A message was edited (UPDATE) → if its bubble is on screen, replace the text in place.
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, async payload => {
      const m = payload.new;
      const el = messagesEl.querySelector(`[data-id="${m.id}"]`);
      if (!el) return;                                   // not in the open conversation
      const key = m.room_id ? roomKey : activeChatKey;
      let raw = (m.content && m.content.startsWith('ENC:')) ? await decryptText(m.content, key) : (m.content || '');
      if (raw === '[falscher Schlüssel]') return;
      const mk = raw.match(/^(\u2063+)/); if (mk) raw = raw.slice(mk[1].length);
      applyEdit(m.id, raw);
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
    // Ephemeral "is typing" pings (broadcast, no DB). Show only if it's for the chat currently on screen.
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (!payload || payload.from === myPubB64) return;
      const forOpen = payload.room
        ? (activeRoom && payload.room === myGroupId)
        : (activePeer && payload.to === myPubB64 && payload.from === activePeer.pubkey);
      if (forOpen) showTyping();
    })
    .subscribe(status => {
      dbg('Realtime-Status: ' + JSON.stringify(status));
    });
}

// --- "tippt gerade…" indicator (ephemeral, via Realtime broadcast — no DB writes) ---
const typingEl = document.getElementById('typing-indicator');
let typingHideTimer = null, lastTypingSent = 0;
function showTyping() {
  if (typingEl) typingEl.classList.add('on');               // fade the bubble in; the list never moves
  clearTimeout(typingHideTimer);
  typingHideTimer = setTimeout(hideTyping, 4000);           // auto-hide if no further keystrokes
}
function hideTyping() { if (typingEl) typingEl.classList.remove('on'); }
function sendTyping() {
  if (!subscription) return;
  const now = Date.now();
  if (now - lastTypingSent < 1500) return;                  // throttle: at most every 1.5s
  lastTypingSent = now;
  const payload = activeRoom ? { from: myPubB64, room: myGroupId }
                : activePeer ? { from: myPubB64, to: activePeer.pubkey }
                : null;
  if (payload) subscription.send({ type: 'broadcast', event: 'typing', payload });
}

// Ultra-gentle auto-scroll: glide #messages to the bottom over GLIDE_MS instead of snapping —
// but only if the reader is already near the bottom (never yank them off older messages).
let glideRAF = 0;
const GLIDE_MS = 8000;
function glideToBottom(el) {
  if (!el) return;
  if (el.scrollHeight - el.scrollTop - el.clientHeight > 160) return;   // reader scrolled up → leave them be
  cancelAnimationFrame(glideRAF);
  const startTop = el.scrollTop, t0 = performance.now();
  const step = (now) => {
    const target = el.scrollHeight - el.clientHeight;                   // re-read (content may have grown)
    const p = Math.min(1, (now - t0) / GLIDE_MS);
    el.scrollTop = startTop + (target - startTop) * (1 - Math.pow(1 - p, 3));   // ease-out
    if (p < 1) glideRAF = requestAnimationFrame(step);
  };
  glideRAF = requestAnimationFrame(step);
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

// Count emoji if the message is emoji-only (no other text); 0 otherwise. Used for "jumbo" rendering.
function emojiOnlyCount(s) {
  const t = (s || '').trim();
  if (!t) return 0;
  // strip every emoji component (pictographic, skin-tone, ZWJ, VS16, keycap) + whitespace
  const rest = t.replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Emoji_Component}\u200D\uFE0F\u20E3\s]/gu, '');
  if (rest !== '') return 0;                       // has real text → not emoji-only
  const m = t.match(/\p{Extended_Pictographic}/gu);
  return m ? m.length : 0;
}

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
  let content = decryptFailed ? '🔒' : rawContent;
  // Leading invisible size markers (from "/N emoji") → scale 2–5; strip them before display.
  let jumboScale = 0;
  if (!decryptFailed) {
    const mk = content.match(/^(\u2063+)/);
    if (mk) { jumboScale = Math.min(10, mk[1].length); content = content.slice(mk[1].length); }
  }
  if (isSelf && !decryptFailed) div.dataset.raw = content;   // plain text for ArrowUp "edit last message"
  // Emoji-only message (1–3) → render big, no bubble (WhatsApp/Signal style)
  if (!decryptFailed) {
    const ec = emojiOnlyCount(content);
    if (ec >= 1 && ec <= 3) { div.classList.add('jumbo'); if (jumboScale >= 2) div.style.setProperty('--jx', jumboScale); }
  }
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
// Two command kinds share one registry + autocomplete:
//   • action commands  → have run(): execute locally, send nothing
//   • phrase commands   → have text: send that text as a normal (encrypted) message
// hidden:true → still works when fully typed, but kept out of the autocomplete list.
const CMD_LIST = [
  // Bare "/" alone is the quickest shortcut: sends "Ich bin unterwegs".
  { cmd: '/',        desc: 'Ich bin unterwegs',                 text: 'Ich bin unterwegs', hidden: true },
  { cmd: '/stats',   desc: 'Belegten Speicher anzeigen',        run: () => showStats(), hidden: true },
  { cmd: '/rename',  desc: 'Namen ändern (Chats bleiben)',       run: () => { const n = prompt('Neuer Name (Chats & Identität bleiben erhalten):', myNameEl.value || ''); if (n) renameAccount(n); }, hidden: true },
  { cmd: '/logout',  desc: 'App sperren (Konto-Passwort nötig)', run: () => { sessionStorage.removeItem(SESSION_PWD_KEY); location.reload(); }, hidden: true },
  // „Konto löschen" liegt im ⋮-Menü oben links (nicht mehr als Tippbefehl).
  // --- Phrase commands: type the command, hit Enter, and the text is sent ---
  { cmd: '/hi',        desc: 'Hi, wie geht’s Dir?',            text: 'Hi, wie geht’s Dir?' },
  { cmd: '/gm',        desc: 'Guten Morgen! ☀️',          text: 'Guten Morgen! ☀️' },
  { cmd: '/gn',        desc: 'Schlaf gut! 🌙',            text: 'Schlaf gut! 🌙' },
  { cmd: '/bb',        desc: 'Bis später! 👋',       text: 'Bis später! 👋' },
  { cmd: '/lieb',      desc: 'Hab dich lieb ❤️',          text: 'Hab dich lieb ❤️' },
  { cmd: '/danke',     desc: 'Vielen Dank! 🙏',          text: 'Vielen Dank! 🙏' },
  { cmd: '/ok',        desc: 'Alles klar 👍',            text: 'Alles klar 👍' },
  { cmd: '/komme',     desc: 'Bin gleich da!',                  text: 'Bin gleich da!' },
  { cmd: '/spät',      desc: 'Wird heute später, nicht warten', text: 'Wird heute später, nicht warten' },
  { cmd: '/essen',     desc: 'Essen ist fertig! 🍽️',           text: 'Essen ist fertig! 🍽️' },
  { cmd: '/ruf',       desc: 'Ruf mich bitte mal an 📞',        text: 'Ruf mich bitte mal an 📞' },
  { cmd: '/home',      desc: 'Bin zu Hause 🏠',                 text: 'Bin zu Hause 🏠' },
  { cmd: '/einkauf',   desc: 'Soll ich was mitbringen? 🛒',     text: 'Soll ich was mitbringen? 🛒' },
  { cmd: '/ja',        desc: 'Ja 👍',                           text: 'Ja 👍' },
  { cmd: '/nein',      desc: 'Nein',                            text: 'Nein' },
  { cmd: '/sorry',     desc: 'Sorry! 🙈',                       text: 'Sorry! 🙈' }
];
const cmdBox = document.getElementById('cmd-box');
let cmdMatches = [], cmdActive = -1, cmdNavigated = false, cmdMode = 'cmd';

// "//" cheat-sheet: one row per emoji with all its emoticon tags (e.g. 🙂 ← ":-)  :)").
function emoticonCheatsheet() {
  const byEmoji = new Map();
  for (const [tag, emo] of Object.entries(EMOTICONS)) {
    if (!byEmoji.has(emo)) byEmoji.set(emo, []);
    byEmoji.get(emo).push(tag);
  }
  return [...byEmoji.entries()].map(([emoji, tags]) => ({ emoji, tags: tags.join('  ') }));
}

function refreshCmdBox() {
  const v = msgInput.value;
  if (!v.startsWith('/')) return hideCmdBox();
  // "//" → emoticon reference (tags → emoji); clicking/Enter inserts the emoji.
  if (v === '//') {
    cmdMode = 'emo';
    cmdMatches = emoticonCheatsheet();
    cmdActive = 0; cmdNavigated = false;
    cmdBox.innerHTML = cmdMatches.map((c, i) =>
      `<div class="cmd-item${i === 0 ? ' active' : ''}" role="option" data-i="${i}"><code>${escapeHtml(c.tags)}</code><span>${emojiImg(escapeHtml(c.emoji))}</span></div>`
    ).join('');
    cmdBox.classList.remove('hidden');
    return;
  }
  cmdMode = 'cmd';
  cmdMatches = CMD_LIST.filter(c => !c.hidden && c.cmd.startsWith(v.toLowerCase()));
  if (!cmdMatches.length) return hideCmdBox();
  cmdActive = 0; cmdNavigated = false;   // fresh list → no explicit pick yet
  cmdBox.innerHTML = cmdMatches.map((c, i) =>
    `<div class="cmd-item${i === 0 ? ' active' : ''}" role="option" data-i="${i}"><code>${c.cmd}</code><span>${escapeHtml(c.desc)}</span></div>`
  ).join('');
  cmdBox.classList.remove('hidden');
}
function hideCmdBox() { cmdBox.classList.add('hidden'); cmdMatches = []; cmdActive = -1; cmdNavigated = false; cmdMode = 'cmd'; }
function markCmdActive() {
  [...cmdBox.children].forEach((el, i) => el.classList.toggle('active', i === cmdActive));
}
// Tab only completes the field (lets you edit before sending)
function applyCmd(i) {
  if (i < 0 || i >= cmdMatches.length) return;
  msgInput.value = cmdMatches[i].cmd;
  hideCmdBox();
  msgInput.focus();
  updateSendBtn();
}
// Click/touch or Arrow+Enter → fill the command and send it immediately
function sendCmd(i) {
  if (i < 0 || i >= cmdMatches.length) return;
  msgInput.value = cmdMatches[i].cmd;
  hideCmdBox();
  sendMsg();
}
// "//" mode: put the chosen emoji into the field (don't send) so you can add to it or hit Enter
function insertEmoji(i) {
  if (i < 0 || i >= cmdMatches.length) return;
  msgInput.value = cmdMatches[i].emoji;
  hideCmdBox();
  msgInput.focus();
  updateSendBtn();
}
// Click/Enter → emoji insert in "//" mode, otherwise send the command
function chooseRow(i) { if (cmdMode === 'emo') insertEmoji(i); else sendCmd(i); }
cmdBox.addEventListener('mousedown', e => {
  // mousedown (not click) so the input doesn't lose focus before we act
  const item = e.target.closest('.cmd-item');
  if (item) { e.preventDefault(); chooseRow(+item.dataset.i); }
});
// Quick way into the command list from an empty field: type "/" + open the popup
function openCmd() { msgInput.value = '/'; msgInput.focus(); refreshCmdBox(); updateSendBtn(); }
// Double-click in the (empty) input also opens the command list
msgInput.addEventListener('dblclick', () => { if (!msgInput.value.trim()) openCmd(); });

// --- Edit last own message (ArrowUp in empty field → load it; Enter saves via UPDATE; Esc cancels) ---
let editingId = null;
const editHint = document.getElementById('edit-hint');
function startEdit(el) {
  editingId = el.dataset.id;
  msgInput.value = el.dataset.raw || '';
  msgInput.focus();
  const n = msgInput.value.length; msgInput.setSelectionRange(n, n);   // caret at end
  if (editHint) editHint.classList.remove('hidden');
  document.getElementById('input-row').classList.add('editing');
  updateSendBtn();
}
function cancelEdit() {
  editingId = null;
  msgInput.value = '';
  if (editHint) editHint.classList.add('hidden');
  document.getElementById('input-row').classList.remove('editing');
  updateSendBtn();
}
// Replace an on-screen bubble's text in place (used by local save + realtime UPDATE) + mark "edited".
function applyEdit(id, rawText) {
  const el = messagesEl.querySelector(`[data-id="${id}"]`);
  if (!el) return;
  el.dataset.raw = rawText;
  const textSpan = el.querySelector('.text');
  if (textSpan) textSpan.innerHTML = emojiImg(escapeHtml(rawText));
  el.classList.remove('jumbo'); el.style.removeProperty('--jx');
  const ec = emojiOnlyCount(rawText);
  if (ec >= 1 && ec <= 3) el.classList.add('jumbo');
  const timeEl = el.querySelector('.time');
  if (timeEl && !timeEl.querySelector('.edited')) {
    timeEl.insertAdjacentHTML('afterbegin', '<span class="edited" title="bearbeitet">✎ </span>');
  }
}
// Persist an edit: re-encrypt + re-sign the SAME row (room or 1:1), then update locally.
async function saveEdit(content) {
  const id = editingId;
  let enc, sig;
  if (activeRoom) {
    enc = await encryptText(content, roomKey);
    sig = await signText(enc + '|' + myGroupId);
  } else if (activePeer) {
    const chatKey = await deriveChatKey(activePeer.ecdh_pubkey);
    enc = await encryptText(content, chatKey);
    sig = await signText(enc + '|' + activePeer.pubkey);
  } else { cancelEdit(); return; }
  const { error } = await client.from('messages').update({ content: enc, sig }).eq('id', id);
  if (error) { dbg('Bearbeiten fehlgeschlagen (UPDATE-Policy in Supabase vorhanden?): ' + error.message); return; }
  dbg('Nachricht bearbeitet (id ' + id + ')');
  applyEdit(id, content);
  cancelEdit();
}

msgInput.onkeydown = e => {
  if (!cmdBox.classList.contains('hidden') && cmdMatches.length) {
    if (e.key === 'ArrowUp') { e.preventDefault(); cmdActive = (cmdActive - 1 + cmdMatches.length) % cmdMatches.length; cmdNavigated = true; markCmdActive(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdActive = (cmdActive + 1) % cmdMatches.length; cmdNavigated = true; markCmdActive(); return; }
    if (e.key === 'Tab') { e.preventDefault(); if (cmdMode === 'emo') insertEmoji(cmdActive); else applyCmd(cmdActive); return; }
    if (e.key === 'Escape') { e.preventDefault(); hideCmdBox(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      // "//" mode → insert the highlighted emoji (don't send).
      if (cmdMode === 'emo') { insertEmoji(cmdActive); return; }
      // Bare "/" with no arrow-pick → its own shortcut: send "Ich bin unterwegs" (the "/" alias).
      if (msgInput.value.trim() === '/' && !cmdNavigated) { hideCmdBox(); sendMsg(); return; }
      // Otherwise send the highlighted match directly.
      sendCmd(cmdActive);
      return;
    }
  }
  // Tab in an empty field → jump straight into the command list (instead of moving focus away)
  if (e.key === 'Tab' && !msgInput.value.trim()) { e.preventDefault(); openCmd(); return; }
  // ArrowUp in an empty field → load my last message for editing (only the last one)
  if (e.key === 'ArrowUp' && !msgInput.value && editingId == null) {
    const last = [...messagesEl.querySelectorAll('.msg.self[data-id]')].pop();
    if (last && last.dataset.raw != null) { e.preventDefault(); startEdit(last); return; }
  }
  // Esc cancels an in-progress edit
  if (e.key === 'Escape' && editingId != null) { e.preventDefault(); cancelEdit(); return; }
  if (e.key === 'Enter') { e.preventDefault(); sendMsg(); }
};

// Send button: visible only while the field has text
const sendBtn = document.getElementById('send-btn');
function updateSendBtn() { sendBtn.classList.toggle('visible', msgInput.value.trim().length > 0); }
msgInput.addEventListener('input', () => { updateSendBtn(); refreshCmdBox(); sendTyping(); });
msgInput.addEventListener('blur', () => setTimeout(hideCmdBox, 120));
sendBtn.onclick = () => sendMsg();

// Invisible size marker for "/N emoji" jumbo: U+2063 (INVISIBLE SEPARATOR), repeated N times, prepended.
const JUMBO_MARK = '\u2063';
// Text emoticons → emoji, applied on send so the stored message holds real emoji unicode.
const EMOTICONS = {
  ':-)':'🙂', ':)':'🙂', ':-D':'😃', ':D':'😃', ';-)':'😉', ';)':'😉',
  ':-(':'🙁', ':(':'🙁', ':-P':'😛', ':P':'😛', ':-p':'😛', ':p':'😛',
  ':-O':'😮', ':O':'😮', ':-o':'😮', ":'(":'😢', ':-*':'😘', ':*':'😘',
  'xD':'😆', 'XD':'😆', ':-/':'😕', ':/':'😕', 'B-)':'😎', '8-)':'😎',
  ':-|':'😐', ':|':'😐', '</3':'💔', '<3':'❤️'
};
// Match a known emoticon only when it stands free (string start/space before, space/end after) → URLs etc. stay intact.
const EMOTICON_RE = new RegExp(
  '(^|\\s)(' + Object.keys(EMOTICONS)
    .sort((a, b) => b.length - a.length)                       // longest first: :-) before :)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') +
  ')(?=\\s|$)', 'g');
function emoticonsToEmoji(s) { return s.replace(EMOTICON_RE, (m, pre, e) => pre + EMOTICONS[e]); }

async function sendMsg() {
  hideCmdBox();
  let content = msgInput.value.trim();
  if (!content) return;
  // Edit mode → update the existing message instead of sending a new one (emoticons still apply, no commands/jumbo)
  if (editingId != null) { await saveEdit(emoticonsToEmoji(content)); return; }
  // Dispatch slash commands — no name required
  const cmd = CMD_LIST.find(c => c.cmd === content.toLowerCase());
  if (cmd) {
    if (cmd.run) {                       // action command → run locally, send nothing
      msgInput.value = ''; updateSendBtn();
      cmd.run();
      return;
    }
    content = cmd.text;                  // phrase command → send the canned text below
  }
  // "/N <emoji>" (N=2–5) → send that emoji N× big. Strip the prefix before emoticon conversion
  // (so /3:-) works), then prepend N invisible markers so the size travels E2E (old clients: invisible).
  let jumboScale = 0;
  const sm = content.match(/^\/([2-9]|10)\s*(.+)$/s);
  if (sm) { jumboScale = +sm[1]; content = sm[2].trim(); }
  content = emoticonsToEmoji(content);   // :-) → 🙂 etc. (commands already carry real emoji)
  if (jumboScale) { const n = emojiOnlyCount(content); if (n >= 1 && n <= 3) content = JUMBO_MARK.repeat(jumboScale) + content; }
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

