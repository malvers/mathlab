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
    loadReactions();
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
  loadReactions();
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
     try {
      const m = payload.new;
      // Group-room message (addressed to my group) → render if the room is open, else bump its badge.
      if (m.room_id) {
        const gd = groupsData.find(x => x.groupId === m.room_id);
        if (!gd) return; // not one of my groups
        gd.roomLastTime = m.created_at;
        const openHere = activeRoom && gd.pwd === activeGroupPwd; // this room is the one on screen
        if (openHere) {
          const near = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight <= 160;  // before the insert
          await renderMsg(m);
          if (m.pubkey === myPubB64) messagesEl.scrollTop = messagesEl.scrollHeight; else glideToBottom(messagesEl, near);
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
        const near = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight <= 160;  // before the insert
        await renderMsg(m);
        if (m.pubkey === myPubB64) messagesEl.scrollTop = messagesEl.scrollHeight; else glideToBottom(messagesEl, near);
        if (m.pubkey === peer) { markRead(peer); publishRead(peer); } // received in open chat → read
      } else if (m.recipient_pubkey === myPubB64) {
        // Message for me in a chat I don't have open → bump badge + confirm delivery to the sender
        unreadByPeer[m.pubkey] = (unreadByPeer[m.pubkey] || 0) + 1;
        publishDelivered(m.pubkey);
      }
      renderContacts(searchVal()); // refresh time + badge live
     } catch (e) { dbg('Realtime-INSERT-Fehler (ignoriert, Kanal bleibt aktiv): ' + (e && e.message || e)); }
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, () => {
      if (activePeer || activeRoom) loadMessages();
    })
    // A message was edited (UPDATE) → if its bubble is on screen, replace the text in place.
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, async payload => {
     try {
      const m = payload.new;
      const el = messagesEl.querySelector(`[data-id="${m.id}"]`);
      if (!el) return;                                   // not in the open conversation
      const key = m.room_id ? roomKey : activeChatKey;
      let raw = (m.content && m.content.startsWith('ENC:')) ? await decryptText(m.content, key) : (m.content || '');
      if (raw === '[falscher Schlüssel]') return;
      const mk = raw.match(/^(\u2063+)/); if (mk) raw = raw.slice(mk[1].length);
      applyEdit(m.id, raw);
     } catch (e) { dbg('Realtime-UPDATE-Fehler (ignoriert): ' + (e && e.message || e)); }
    })
    // A reaction was added/changed/removed → refresh that message's chips live
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, payload => {
      try {
        const mid = (payload.new && payload.new.message_id) || (payload.old && payload.old.message_id);
        if (mid != null && messagesEl.querySelector(`[data-id="${mid}"]`)) refreshReactionsFor(mid);
      } catch (e) { dbg('Realtime-Reaktion-Fehler (ignoriert): ' + (e && e.message || e)); }
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
    .subscribe((status, err) => {
      dbg('Realtime-Status: ' + status + (err ? ' / ' + (err.message || err) : ''));
      if (status === 'SUBSCRIBED') {
        if (realtimeWasErrored) {                       // came back after a drop → resync missed messages
          realtimeWasErrored = false;
          dbg('Realtime wieder verbunden — synchronisiere…');
          if (activePeer || activeRoom) loadMessages();
        }
        reconnectDelay = 2000;                          // reset backoff
        clearTimeout(reconnectTimer); reconnectTimer = null;
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        realtimeWasErrored = true;
        if (!reconnectTimer) {                          // schedule ONE reconnect with exponential backoff
          dbg('Realtime-Kanal weg (' + status + ') — neuer Versuch in ' + (reconnectDelay / 1000) + 's');
          reconnectTimer = setTimeout(() => { reconnectTimer = null; subscribeMessages(); }, reconnectDelay);
          reconnectDelay = Math.min(reconnectDelay * 2, 30000);
        }
      }
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

// Very gentle auto-scroll: glide #messages to the bottom over GLIDE_MS instead of snapping —
// but only if the reader is already near the bottom (never yank them off older messages).
let glideRAF = 0;
const GLIDE_MS = 8000;
function glideToBottom(el, force) {
  if (!el) return;
  // Skip only if the reader scrolled up — but `force` (measured BEFORE a tall insert like an image) overrides,
  // since a big new message can itself push the gap past 160px even though the reader was at the bottom.
  if (!force && el.scrollHeight - el.scrollTop - el.clientHeight > 160) return;
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

// Light WhatsApp-style formatting on an ALREADY HTML-ESCAPED string: *bold* _italic_ ~strike~.
function formatText(s) {
  return s
    .replace(/\*(?=\S)([^*\n]*?\S)\*/g, '<b>$1</b>')
    .replace(/_(?=\S)([^_\n]*?\S)_/g, '<i>$1</i>')
    .replace(/~(?=\S)([^~\n]*?\S)~/g, '<s>$1</s>')
    .replace(/=(?=\S)([^=\n]*?\S)=/g, '<s>$1</s>');   // easy DE alternative to ~ for strikethrough
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
    if (mk) { jumboScale = Math.min(5, mk[1].length); content = content.slice(mk[1].length); }
  }
  // Image/voice message? content = PREFIX + JSON descriptor. Validate by parsing.
  let imgDesc = null, voiceDesc = null;
  if (!decryptFailed && content.startsWith(IMG_PREFIX)) {
    try { const d = JSON.parse(content.slice(IMG_PREFIX.length)); if (d && d.p) imgDesc = d; } catch (_) {}
  } else if (!decryptFailed && content.startsWith(VOICE_PREFIX)) {
    try { const d = JSON.parse(content.slice(VOICE_PREFIX.length)); if (d && d.a) voiceDesc = d; } catch (_) {}
  }
  if (!decryptFailed) div.dataset.raw = imgDesc ? '📷 Bild' : voiceDesc ? ('🎤 ' + (voiceDesc.t || 'Sprachnachricht')) : content;   // plain text (ArrowUp edit + reply quotes)
  div.dataset.kind = imgDesc ? 'img' : voiceDesc ? 'voice' : 'text';   // only 'text' is editable
  if (voiceDesc && voiceDesc.t) div.dataset.tx = voiceDesc.t;          // transcript → copyable
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
  // Reply: show a quote of the referenced message (author + short preview), tap → jump to it.
  let quote = '';
  if (msg.reply_to) {
    const orig = messagesEl.querySelector(`[data-id="${msg.reply_to}"]`);
    const qa = orig ? (orig.classList.contains('self') ? 'Du' : nameForPubkey(orig.dataset.pub || '')) : '';
    const qt = orig ? (orig.dataset.raw || '').slice(0, 90) : '…';
    quote = `<div class="quote" data-to="${msg.reply_to}"><span class="q-au">${escapeHtml(qa)}</span>${emojiImg(escapeHtml(qt))}</div>`;
  }
  const body = imgDesc
    ? `<div class="img-wrap" data-p="${escapeHtml(imgDesc.p)}" style="aspect-ratio:${(imgDesc.w || 4)}/${(imgDesc.h || 3)}"><span class="img-spin">📷</span></div>`
    : voiceDesc
    ? `<div class="voice-wrap" data-p="${escapeHtml(voiceDesc.a)}" data-d="${voiceDesc.d || 0}"><span class="img-spin">🎤</span> ${fmtDur(voiceDesc.d || 0)}</div>`
      + (voiceDesc.t ? `<div class="voice-tx">${emojiImg(formatText(escapeHtml(voiceDesc.t)))}</div>` : '')
    : `<span class="text">${emojiImg(formatText(escapeHtml(content)))}</span>`;
  div.innerHTML = `${quote}${sender}${badge}${body}<span class="time">${timeStr}${ticks}</span>`;
  // Actions trigger (⋯ on hover; touch uses long-press) → reactions + (own) delete; plus a reactions container.
  if (msg.id != null) {
    const act = document.createElement('button');
    act.className = 'act-btn'; act.title = 'Aktionen'; act.setAttribute('aria-label', 'Nachricht-Aktionen'); act.textContent = '⋯';
    act.onclick = e => { e.stopPropagation(); openMsgActions(div); };
    div.appendChild(act);
    const reacts = document.createElement('div');
    reacts.className = 'reacts';
    div.appendChild(reacts);
  }
  messagesEl.appendChild(div);
  if (imgDesc) loadImage(div, msgKey);        // lazily download + decrypt the picture
  else if (voiceDesc) loadVoice(div, msgKey); // … or the voice clip
}

// Etappe 4: permanently delete the account — server rows (own messages, receipts, identity, backup)
// + everything local + sign out. Irreversible → three confirmations.
async function deleteAccount() {
  if (!myPubB64) { await uiConfirm('Erst anmelden.', { alert: true }); return; }
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
  if (!myPubB64 || !hmacKey) { await uiConfirm('Bitte zuerst anmelden.', { alert: true }); return; }
  if (newName.length > 30) { await uiConfirm('Name zu lang (max. 30 Zeichen).', { alert: true }); return; }
  const oldName = (myNameEl.value || '').trim().toLowerCase();
  if (newName === oldName) return;
  const oldId = await nameId(oldName), newId = await nameId(newName);
  // Is the new name free (owned by nobody else)?
  const { data: ex, error: exErr } = await client.from('identities').select('pubkey').eq('name_id', newId).limit(1);
  if (exErr) { await uiConfirm('Prüfung fehlgeschlagen: ' + exErr.message, { alert: true }); return; }
  if (ex && ex.length && ex[0].pubkey !== myPubB64) { await uiConfirm('Der Name „' + newName + '" ist bereits vergeben.', { alert: true }); return; }
  // Move the server backup to the new key (enc/wraps untouched → recovery code stays valid)
  const { error: vErr } = await client.from('vaults').update({ name_id: newId }).eq('name_id', oldId);
  if (vErr) { await uiConfirm('Umbenennen fehlgeschlagen (Backup): ' + vErr.message, { alert: true }); return; }
  // Update the directory entry: new name_id + new encrypted display name
  const { error: iErr } = await client.from('identities').update({ name_id: newId, name: await encDir(newName) }).eq('pubkey', myPubB64);
  if (iErr) { await uiConfirm('Umbenennen fehlgeschlagen: ' + iErr.message, { alert: true }); return; }
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
// Delete a message for everyone (confirm → DELETE row + its reactions; recipients drop it via the realtime DELETE handler).
async function deleteMessage(id) {
  if (id == null) return;
  if (!(await uiConfirm('Diese Nachricht für alle löschen?', { okText: 'Löschen', danger: true }))) return;
  const el = messagesEl.querySelector(`[data-id="${id}"]`);
  // Grab the media blob's storage path (if any) BEFORE the row is gone → delete it too (no orphans in the bucket).
  const media = el && el.querySelector('.img-wrap, .voice-wrap');
  const mediaPath = media && media.dataset.p;
  const { error } = await client.from('messages').delete().eq('id', id);
  if (error) { dbg('Löschen fehlgeschlagen (DELETE-Policy in Supabase vorhanden?): ' + error.message); return; }
  try { await client.from('reactions').delete().eq('message_id', id); } catch (_) {}   // best-effort cleanup
  if (mediaPath) { try { await client.storage.from('media').remove([mediaPath]); dbg('Medien-Blob entfernt: ' + mediaPath); } catch (e) { dbg('Medien-Blob bleibt liegen: ' + (e && e.message || e)); } }
  if (el) el.remove();
  dbg('Nachricht gelöscht (id ' + id + ')');
}

// ===========================================================================
// REACTIONS — emoji comments under a message (plaintext; content stays E2E)
// ===========================================================================
const msgActions = document.getElementById('msg-actions');
const maDel = document.getElementById('ma-del');
const maEdit = document.getElementById('ma-edit');
const maCopy = document.getElementById('ma-copy');
let actionTargetId = null;
let reactionsByMsg = {};   // { message_id: [{pubkey, emoji}] }

// Open the actions popover near a bubble (reactions for all; delete for own; edit only for own TEXT).
function openMsgActions(bubble) {
  if (!bubble || bubble.dataset.id == null) return;
  actionTargetId = bubble.dataset.id;
  const own = bubble.classList.contains('self');
  maDel.classList.toggle('hidden', !own);
  if (maEdit) maEdit.classList.toggle('hidden', !(own && bubble.dataset.kind === 'text'));   // can't edit images/voice
  if (maCopy) maCopy.classList.toggle('hidden', !(bubble.dataset.kind === 'text' || bubble.dataset.tx));   // text, or a voice transcript
  msgActions.classList.remove('hidden');                    // show first so we can measure
  const r = bubble.getBoundingClientRect();
  const aw = msgActions.offsetWidth, ah = msgActions.offsetHeight;
  let top = r.top - ah - 6; if (top < 8) top = r.bottom + 6; // prefer above, else below
  let left = bubble.classList.contains('self') ? r.right - aw : r.left;
  left = Math.max(8, Math.min(left, window.innerWidth - aw - 8));
  msgActions.style.top = top + 'px';
  msgActions.style.left = left + 'px';
}
function closeMsgActions() { msgActions.classList.add('hidden'); actionTargetId = null; }
msgActions.querySelector('.react-row').addEventListener('click', e => {
  const btn = e.target.closest('button[data-emoji]');
  if (!btn || actionTargetId == null) return;
  toggleReaction(actionTargetId, btn.dataset.emoji);
  closeMsgActions();
});
maDel.onclick = () => { const id = actionTargetId; closeMsgActions(); deleteMessage(id); };
// --- Reply: quote a message, compose, jump-to-original ---
let replyTo = null;
const replyBar = document.getElementById('reply-bar');
const replyTextEl = document.getElementById('reply-text');
function startReply(bubble) {
  if (!bubble || bubble.dataset.id == null) return;
  replyTo = bubble.dataset.id;
  const au = bubble.classList.contains('self') ? 'Du' : nameForPubkey(bubble.dataset.pub || '');
  replyTextEl.textContent = '↩ ' + au + ': ' + (bubble.dataset.raw || '').slice(0, 80);
  replyBar.classList.remove('hidden');
  msgInput.focus();
}
function cancelReply() { replyTo = null; if (replyBar) replyBar.classList.add('hidden'); }
document.getElementById('reply-cancel').onclick = cancelReply;
document.getElementById('ma-reply').onclick = () => {
  const b = messagesEl.querySelector(`[data-id="${actionTargetId}"]`);
  closeMsgActions();
  if (b) startReply(b);
};
if (maEdit) maEdit.onclick = () => {
  const b = messagesEl.querySelector(`[data-id="${actionTargetId}"]`);
  closeMsgActions();
  if (b) startEdit(b);
};
if (maCopy) maCopy.onclick = () => {
  const b = messagesEl.querySelector(`[data-id="${actionTargetId}"]`);
  closeMsgActions();
  if (b && navigator.clipboard) navigator.clipboard.writeText(b.dataset.kind === 'voice' ? (b.dataset.tx || '') : (b.dataset.raw || '')).catch(() => {});
};
// Right-click on a message → our popover instead of the browser's native context menu
messagesEl.addEventListener('contextmenu', e => {
  const b = e.target.closest('.msg[data-id]');
  if (b) { e.preventDefault(); openMsgActions(b); }
});
// Tap a quote → scroll to the original + flash it
messagesEl.addEventListener('click', e => {
  const q = e.target.closest('.quote');
  if (!q) return;
  const orig = messagesEl.querySelector(`[data-id="${q.dataset.to}"]`);
  if (orig) { orig.scrollIntoView({ behavior: 'smooth', block: 'center' }); orig.classList.remove('flash'); void orig.offsetWidth; orig.classList.add('flash'); }
});
document.addEventListener('click', e => {                   // click outside closes the popover
  if (!msgActions.classList.contains('hidden') && !msgActions.contains(e.target) && !e.target.closest('.act-btn')) closeMsgActions();
});
// Click an existing chip → toggle that reaction (delegated)
messagesEl.addEventListener('click', e => {
  const chip = e.target.closest('.react-chip');
  if (!chip) return;
  const bubble = chip.closest('.msg[data-id]');
  if (bubble) toggleReaction(bubble.dataset.id, chip.dataset.emoji);
});
// Touch: long-press OR horizontal swipe on a bubble → actions popover (react/delete)
let lpTimer = null, tStartX = 0, tStartY = 0, tBubble = null, tHandled = false;
messagesEl.addEventListener('touchstart', e => {
  tBubble = e.target.closest('.msg[data-id]'); tHandled = false;
  if (!tBubble) return;
  tStartX = e.touches[0].clientX; tStartY = e.touches[0].clientY;
  lpTimer = setTimeout(() => { tHandled = true; openMsgActions(tBubble); }, 500);
}, { passive: true });
messagesEl.addEventListener('touchmove', e => {
  if (!tBubble || tHandled) { clearTimeout(lpTimer); return; }
  const dx = e.touches[0].clientX - tStartX, dy = e.touches[0].clientY - tStartY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {   // clear horizontal swipe → react
    tHandled = true; clearTimeout(lpTimer); openMsgActions(tBubble);
  } else if (Math.abs(dy) > 10) {
    clearTimeout(lpTimer);                                        // it's a vertical scroll → no long-press
  }
}, { passive: true });
const clearLP = () => { clearTimeout(lpTimer); lpTimer = null; tBubble = null; };
messagesEl.addEventListener('touchend', clearLP);
messagesEl.addEventListener('touchcancel', clearLP);
// Mac/desktop: two-finger horizontal trackpad swipe over a bubble → actions popover (also stops back-nav)
let wheelAcc = 0, wheelBubble = null, wheelCooldown = 0;
messagesEl.addEventListener('wheel', e => {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) { wheelAcc = 0; return; }   // vertical scroll → leave it
  const bubble = e.target.closest('.msg[data-id]');
  if (!bubble) return;
  e.preventDefault();
  if (Date.now() < wheelCooldown) return;
  if (wheelBubble !== bubble) { wheelBubble = bubble; wheelAcc = 0; }
  wheelAcc += e.deltaX;
  if (Math.abs(wheelAcc) > 60) { wheelAcc = 0; wheelCooldown = Date.now() + 700; openMsgActions(bubble); }
}, { passive: false });

// One reaction per person per message: same emoji again removes it, a different one replaces it.
async function toggleReaction(msgId, emoji) {
  const mine = (reactionsByMsg[msgId] || []).find(r => r.pubkey === myPubB64);
  if (mine && mine.emoji === emoji) {
    await client.from('reactions').delete().eq('message_id', msgId).eq('pubkey', myPubB64);
  } else {
    const { error } = await client.from('reactions').upsert({ message_id: msgId, pubkey: myPubB64, emoji }, { onConflict: 'message_id,pubkey' });
    if (error) { dbg('Reaktion fehlgeschlagen (reactions-Tabelle/Policy da?): ' + error.message); return; }
  }
  await refreshReactionsFor(msgId);   // realtime also refreshes for everyone
}
// Re-fetch + redraw the reactions of a single message.
async function refreshReactionsFor(msgId) {
  const { data } = await client.from('reactions').select('pubkey,emoji').eq('message_id', msgId);
  reactionsByMsg[msgId] = data || [];
  renderReactions(msgId);
}
// Bulk-load reactions for every message currently on screen (called after loadMessages).
async function loadReactions() {
  const ids = [...messagesEl.querySelectorAll('.msg[data-id]')].map(el => el.dataset.id);
  reactionsByMsg = {};
  if (!ids.length) return;
  const { data, error } = await client.from('reactions').select('message_id,pubkey,emoji').in('message_id', ids);
  if (error) { dbg('Reaktionen laden fehlgeschlagen: ' + error.message); return; }
  for (const r of (data || [])) (reactionsByMsg[r.message_id] = reactionsByMsg[r.message_id] || []).push({ pubkey: r.pubkey, emoji: r.emoji });
  for (const id of ids) renderReactions(id);
  messagesEl.scrollTop = messagesEl.scrollHeight;   // chips added height after the initial scroll → re-pin to bottom
}
// Draw the chip row (emoji + count, own highlighted) under one bubble.
function renderReactions(msgId) {
  const bubble = messagesEl.querySelector(`[data-id="${msgId}"]`);
  if (!bubble) return;
  let box = bubble.querySelector('.reacts');
  if (!box) { box = document.createElement('div'); box.className = 'reacts'; bubble.appendChild(box); }
  const list = reactionsByMsg[msgId] || [];
  bubble.classList.toggle('has-reacts', list.length > 0);   // reserve bottom space (no CSS :has() → Safari-safe)
  const counts = {}; let mineEmoji = null;
  for (const r of list) { counts[r.emoji] = (counts[r.emoji] || 0) + 1; if (r.pubkey === myPubB64) mineEmoji = r.emoji; }
  box.innerHTML = Object.entries(counts).map(([emoji, n]) =>
    `<span class="react-chip${emoji === mineEmoji ? ' mine' : ''}" data-emoji="${escapeHtml(emoji)}">${emojiImg(escapeHtml(emoji))}${n > 1 ? ' ' + n : ''}</span>`
  ).join('');
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
    const last = [...messagesEl.querySelectorAll('.msg.self[data-id]')].filter(el => el.dataset.kind === 'text').pop();
    if (last && last.dataset.raw != null) { e.preventDefault(); startEdit(last); return; }
  }
  // Esc cancels an in-progress edit
  if (e.key === 'Escape' && editingId != null) { e.preventDefault(); cancelEdit(); return; }
  if (e.key === 'Enter') { e.preventDefault(); sendMsg(); }
};

// Send button: visible only while the field has text
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
function updateSendBtn() {
  const hasText = msgInput.value.trim().length > 0;
  sendBtn.classList.toggle('visible', hasText);
  if (micBtn) micBtn.style.display = hasText ? 'none' : 'flex';   // mic when empty, send when typing (WhatsApp-style)
}
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

// ===========================================================================
// IMAGES — compress → encrypt → upload (Supabase Storage) → message holds only a descriptor
// ===========================================================================
const IMG_PREFIX = 'vgpimg';   // sentinel inside the (encrypted) message content → "this is an image"
const imgCache = {};                       // storage path → decrypted object URL (avoid re-download on re-render)
const imgInput = document.getElementById('img-input');
const attachBtn = document.getElementById('attach-btn');
if (attachBtn && imgInput) {
  attachBtn.onclick = () => imgInput.click();
  imgInput.onchange = async () => {
    const file = imgInput.files && imgInput.files[0];
    imgInput.value = '';                   // reset so the same file can be picked again
    if (!file || !file.type.startsWith('image/')) return;
    if (!activeRoom && !activePeer) { await uiConfirm('Wähle zuerst einen Kontakt links aus 👈', { alert: true }); return; }
    try { await sendImage(file); } catch (e) { dbg('Bild senden fehlgeschlagen: ' + (e && e.message || e)); }
  };
}
async function currentChatKey() {
  if (activeRoom) return roomKey;
  if (activePeer) return await deriveChatKey(activePeer.ecdh_pubkey);
  return null;
}
// Resize to max 1280px + JPEG ~0.7 → { bytes, w, h }
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1280; let w = img.naturalWidth, h = img.naturalHeight;
      if (w > MAX || h > MAX) { const s = MAX / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      cv.toBlob(b => b ? b.arrayBuffer().then(ab => resolve({ bytes: new Uint8Array(ab), w, h })) : reject(new Error('toBlob')), 'image/jpeg', 0.7);
    };
    img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
    img.src = URL.createObjectURL(file);
  });
}
async function sendImage(file) {
  const key = await currentChatKey();
  if (!key) return;
  const { bytes, w, h } = await compressImage(file);
  const enc = await encryptBytes(bytes, key);                 // iv ++ ciphertext (E2E — storage sees only this)
  const path = crypto.randomUUID() + '.bin';
  const { error } = await client.storage.from('media').upload(path, enc, { contentType: 'application/octet-stream' });
  if (error) { dbg('Upload fehlgeschlagen (Bucket „media" + Policy vorhanden?): ' + error.message); await uiConfirm('Bild-Upload fehlgeschlagen.', { alert: true }); return; }
  await deliverMessage(IMG_PREFIX + JSON.stringify({ p: path, w, h }));
}
// Re-pin to bottom if this is the last message and its bottom is below the fold (fixes the
// sender's one-shot scroll undershooting media that lays out/loads after the initial scroll).
function pinIfLast(div) {
  if (div !== messagesEl.lastElementChild) return;
  if (div.offsetTop + div.offsetHeight > messagesEl.scrollTop + messagesEl.clientHeight - 4) {
    cancelAnimationFrame(glideRAF);   // stop a running slow-glide, otherwise it overrides the pin
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}
function placeImg(wrap, url, div) {
  wrap.innerHTML = `<img class="msg-img" src="${url}" alt="Bild">`;
  const im = wrap.querySelector('img');
  if (im.complete) pinIfLast(div); else im.addEventListener('load', () => pinIfLast(div), { once: true });
}
// Download the ciphertext, decrypt with the message's key, show the image (cached by path).
async function loadImage(div, key) {
  const wrap = div.querySelector('.img-wrap');
  if (!wrap) return;
  const path = wrap.dataset.p;
  if (!path) return;
  if (imgCache[path]) { placeImg(wrap, imgCache[path], div); return; }
  try {
    const { data, error } = await client.storage.from('media').download(path);
    if (error || !data) { wrap.innerHTML = '<span class="img-err">⚠️</span>'; return; }
    const plain = await decryptBytes(new Uint8Array(await data.arrayBuffer()), key);
    const url = URL.createObjectURL(new Blob([plain], { type: 'image/jpeg' }));
    imgCache[path] = url;
    placeImg(wrap, url, div);
  } catch (e) { wrap.innerHTML = '<span class="img-err">⚠️</span>'; dbg('Bild laden/entschlüsseln fehlgeschlagen: ' + (e && e.message || e)); }
}
// Lightbox: tap an image → fullscreen
const lightbox = document.getElementById('lightbox');
messagesEl.addEventListener('click', e => {
  const im = e.target.closest('.msg-img');
  if (im && lightbox) { lightbox.querySelector('img').src = im.src; lightbox.classList.remove('hidden'); }
});
if (lightbox) lightbox.addEventListener('click', () => lightbox.classList.add('hidden'));

// ===========================================================================
// VOICE MESSAGES — record → decode → WAV (16 kHz mono) → encrypt → upload (same media bucket)
// ===========================================================================
const VOICE_PREFIX = 'vgpvoi';
let mediaRec = null, recChunks = [], recStream = null, recStart = 0, recTimer = null, recCancelled = false;
let recognition = null, recFinal = '', recInterim = '';   // live speech-to-text (Web Speech API)
const recTimeEl = document.getElementById('rec-time');
const recTextEl = document.getElementById('rec-text');
const inputRow = document.getElementById('input-row');
function makeRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = 'de-DE'; r.continuous = true; r.interimResults = true;
  return r;
}
function updateRecText() { if (recTextEl) { recTextEl.textContent = (recFinal + recInterim).trim(); recTextEl.scrollLeft = recTextEl.scrollWidth; } }   // follow the newest words

function fmtDur(s) { const m = Math.floor(s / 60); return m + ':' + String(s % 60).padStart(2, '0'); }
async function startRec() {
  if (!activeRoom && !activePeer) { await uiConfirm('Wähle zuerst einen Kontakt links aus 👈', { alert: true }); return; }
  try { recStream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch (e) { await uiConfirm('Mikrofon-Zugriff verweigert.', { alert: true }); return; }
  recCancelled = false; recChunks = [];
  mediaRec = new MediaRecorder(recStream);
  mediaRec.ondataavailable = e => { if (e.data && e.data.size) recChunks.push(e.data); };
  mediaRec.onstop = async () => {
    recStream.getTracks().forEach(t => t.stop());
    if (!recCancelled) { try { await finishRecording(); } catch (e) { dbg('Voice fehlgeschlagen: ' + (e && e.message || e)); await uiConfirm('Sprachnachricht fehlgeschlagen.', { alert: true }); } }
  };
  mediaRec.start();
  // Live transcription (best-effort; ignore if unsupported/denied → voice-only fallback)
  recFinal = ''; recInterim = ''; updateRecText();
  recognition = makeRecognition();
  if (recognition) {
    recognition.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) recFinal += r[0].transcript; else interim += r[0].transcript;
      }
      recInterim = interim; updateRecText();
    };
    recognition.onerror = () => {};   // no-speech / network etc. → just no transcript
    try { recognition.start(); } catch (_) {}
  }
  recStart = Date.now();
  micBtn.classList.add('recording');
  if (inputRow) inputRow.classList.add('recording');   // the input line itself turns into the recorder (WhatsApp-style)
  recTimer = setInterval(() => { if (recTimeEl) recTimeEl.textContent = fmtDur(Math.round((Date.now() - recStart) / 1000)); }, 250);
}
function endRecUI() {
  micBtn.classList.remove('recording'); clearInterval(recTimer);
  if (recognition) { try { recognition.stop(); } catch (_) {} }
  if (inputRow) inputRow.classList.remove('recording');
  if (recTextEl) recTextEl.textContent = '';
}
function stopAndSend() { recCancelled = false; if (mediaRec && mediaRec.state === 'recording') mediaRec.stop(); endRecUI(); }
function cancelRec() { recCancelled = true; if (mediaRec && mediaRec.state === 'recording') mediaRec.stop(); else if (recStream) recStream.getTracks().forEach(t => t.stop()); endRecUI(); }
if (micBtn) micBtn.onclick = () => { (mediaRec && mediaRec.state === 'recording') ? stopAndSend() : startRec(); };
{ const rc = document.getElementById('rec-cancel'); if (rc) rc.onclick = cancelRec; }

// 16-bit PCM mono WAV from a Float32 buffer
function encodeWav(f32, rate) {
  const len = f32.length, buf = new ArrayBuffer(44 + len * 2), v = new DataView(buf);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, 36 + len * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  ws(36, 'data'); v.setUint32(40, len * 2, true);
  let o = 44; for (let i = 0; i < len; i++) { const x = Math.max(-1, Math.min(1, f32[i])); v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7FFF, true); o += 2; }
  return new Uint8Array(buf);
}
// Downmix to mono + linear-resample to targetRate
function toMono(ab, targetRate) {
  const chs = ab.numberOfChannels, n = ab.length, mono = new Float32Array(n);
  for (let c = 0; c < chs; c++) { const d = ab.getChannelData(c); for (let i = 0; i < n; i++) mono[i] += d[i] / chs; }
  if (ab.sampleRate === targetRate) return { data: mono, rate: targetRate };
  const ratio = ab.sampleRate / targetRate, outN = Math.floor(n / ratio), out = new Float32Array(outN);
  for (let i = 0; i < outN; i++) { const idx = i * ratio, i0 = Math.floor(idx), f = idx - i0; out[i] = (mono[i0] || 0) * (1 - f) + (mono[i0 + 1] || 0) * f; }
  return { data: out, rate: targetRate };
}
async function finishRecording() {
  const transcript = (recFinal + ' ' + recInterim).trim();   // captured before the recognizer fully stops
  const dur = Math.round((Date.now() - recStart) / 1000);
  const blob = new Blob(recChunks, { type: mediaRec.mimeType || 'audio/webm' });
  if (!blob.size || dur < 1) return;                          // too short → ignore (accidental tap)
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuf = await ctx.decodeAudioData(await blob.arrayBuffer());   // decode native format LOCALLY
  ctx.close();
  const { data, rate } = toMono(audioBuf, 16000);
  const wav = encodeWav(data, rate);
  const key = await currentChatKey(); if (!key) return;
  const enc = await encryptBytes(wav, key);
  const path = crypto.randomUUID() + '.bin';
  const { error } = await client.storage.from('media').upload(path, enc, { contentType: 'application/octet-stream' });
  if (error) { dbg('Voice-Upload fehlgeschlagen: ' + error.message); await uiConfirm('Sprachnachricht-Upload fehlgeschlagen.', { alert: true }); return; }
  const desc = { a: path, d: dur }; if (transcript) desc.t = transcript;
  await deliverMessage(VOICE_PREFIX + JSON.stringify(desc));
}
// Download + decrypt a voice clip into a <audio> player.
// Custom audio player (consistent across browsers): play/pause + progress bar + time.
function renderVoice(wrap, url, dur) {
  wrap.innerHTML =
    '<button class="v-play" aria-label="Abspielen">▶</button>' +
    '<div class="v-bar"><div class="v-prog"></div></div>' +
    '<span class="v-time">' + fmtDur(dur || 0) + '</span>' +
    '<audio src="' + url + '" preload="metadata"></audio>';
  const audio = wrap.querySelector('audio'), play = wrap.querySelector('.v-play');
  const prog = wrap.querySelector('.v-prog'), bar = wrap.querySelector('.v-bar'), time = wrap.querySelector('.v-time');
  const total = () => audio.duration && isFinite(audio.duration) ? audio.duration : (dur || 0);
  play.onclick = () => { audio.paused ? audio.play() : audio.pause(); };
  audio.onplay = () => { play.textContent = '⏸'; };
  audio.onpause = () => { play.textContent = '▶'; };
  audio.onended = () => { play.textContent = '▶'; prog.style.width = '0%'; time.textContent = fmtDur(dur || 0); };
  audio.ontimeupdate = () => {
    const t = total(); prog.style.width = (t ? Math.min(100, audio.currentTime / t * 100) : 0) + '%';
    time.textContent = fmtDur(Math.round(audio.currentTime || 0));
  };
  bar.onclick = e => { const r = bar.getBoundingClientRect(); audio.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * total(); };
}
async function loadVoice(div, key) {
  const wrap = div.querySelector('.voice-wrap');
  if (!wrap) return;
  const path = wrap.dataset.p, dur = +wrap.dataset.d || 0;
  if (!path) return;
  if (imgCache[path]) { renderVoice(wrap, imgCache[path], dur); pinIfLast(div); return; }
  try {
    const { data, error } = await client.storage.from('media').download(path);
    if (error || !data) { wrap.innerHTML = '<span class="img-err">⚠️</span>'; return; }
    const plain = await decryptBytes(new Uint8Array(await data.arrayBuffer()), key);
    const url = URL.createObjectURL(new Blob([plain], { type: 'audio/wav' }));
    imgCache[path] = url; renderVoice(wrap, url, dur); pinIfLast(div);
  } catch (e) { wrap.innerHTML = '<span class="img-err">⚠️</span>'; dbg('Voice laden/entschlüsseln fehlgeschlagen: ' + (e && e.message || e)); }
}

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
  const sm = content.match(/^\/([2-5])\s*(.+)$/s);
  if (sm) { jumboScale = +sm[1]; content = sm[2].trim(); }
  content = emoticonsToEmoji(content);   // :-) → 🙂 etc. (commands already carry real emoji)
  if (jumboScale) { const n = emojiOnlyCount(content); if (n >= 1 && n <= 3) content = JUMBO_MARK.repeat(jumboScale) + content; }
  const ok = await deliverMessage(content);   // shared encrypt+sign+insert+optimistic-render path (text & images)
  if (ok) { msgInput.value = ''; updateSendBtn(); }
}

// Encrypt + sign + insert one message (room or 1:1), render it optimistically. Returns true on success.
// `content` is the plaintext payload (normal text, or an image descriptor). Honors the current replyTo.
async function deliverMessage(content) {
  const rt = replyTo;
  if (activeRoom) {
    const encrypted = await encryptText(content, roomKey);
    const sig = await signText(encrypted + '|' + myGroupId);
    const { data, error } = await client.from('messages').insert({ content: encrypted, room_id: myGroupId, recipient_pubkey: null, pubkey: myPubB64, sig, reply_to: rt }).select().single();
    if (error) { dbg('Sendefehler (Gruppen-Chat): ' + error.message); return false; }
    dbg('Gruppen-Chat-Nachricht gesendet'); cancelReply();
    if (data) { try { await renderMsg(data); } catch (e) { dbg('Render-Fehler (ignoriert): ' + (e && e.message || e)); } messagesEl.scrollTop = messagesEl.scrollHeight; }
    return true;
  }
  if (!activePeer) { await uiConfirm('Wähle zuerst einen Kontakt links aus 👈', { alert: true }); return false; }
  const chatKey = await deriveChatKey(activePeer.ecdh_pubkey);
  if (!chatKey) { dbg('Kein Chat-Schlüssel (ECDH) — Kontakt ohne ecdh_pubkey?'); return false; }
  const encrypted = await encryptText(content, chatKey);
  const sig = await signText(encrypted + '|' + activePeer.pubkey);
  const { data, error } = await client.from('messages').insert({ content: encrypted, recipient_pubkey: activePeer.pubkey, pubkey: myPubB64, sig, reply_to: rt }).select().single();
  if (error) { dbg('Sendefehler: ' + error.message); return false; }
  dbg('Nachricht gesendet'); cancelReply();
  if (data) { try { await renderMsg(data); } catch (e) { dbg('Render-Fehler (ignoriert): ' + (e && e.message || e)); } messagesEl.scrollTop = messagesEl.scrollHeight; }
  return true;
}

