// VGP — PAIR MODE (Doc, 19.11.2026: "wenn ich das nur mit Ute nutze … sollte es super einfach sein").
// One chat with one partner: pair once by QR code, then the app opens straight into that chat.
// No account, no group password. Concept: konzept-paar-modus.html (local).
//
// Classic script, loaded after vgp-push.js — shares VGP's global scope (client, ensureClient,
// myPrivKey/myPubB64/myEcdhPrivKey/myEcdhPubB64, chatKeyCache, selectContact, subscribeMessages,
// enablePush, syncPushSubscription, uiConfirm, emojiImg, escapeHtml, dbg, b64/unb64 …).
//
// Keys & storage (IndexedDB 'vgp-pair', store 'kv'):
//   device → this phone's ECDSA (sign) + ECDH key pairs, private halves NON-EXTRACTABLE CryptoKeys
//            (usable by this page, never readable as bytes).
//   pair   → { pk: AES-256 pair key, pairId, partner:{name,emoji,pubkey,ecdh_pubkey}, selfPubs, peerPubs }
//            pk encrypts every message of the pair (same row format as VGP's 1:1 chat: content ENC +
//            ECDSA signature bound to recipient_pubkey). It is handed over to a NEW phone on re-pairing,
//            so the whole history (encrypted on the server) stays readable — "ihr seid gegenseitig euer Backup".
//
// Pairing protocol (both phones side by side, nothing is stored on the server):
//   QR = link …#pair=<16 random bytes>. From it both derive (HKDF) a channel key + a channel name for a
//   short-lived Supabase Realtime broadcast channel. Messages there are AES-GCM sealed with that key.
//   scanner → hi {name, emoji, sig, ecdh, has}      shower → hi2 {…}
//   both show 4 symbols = SHA-256 of both public keys → user taps "Passt" → ok
//   keeper (the side that already has a pair key; else the scanner makes a new one) → key {pk, history}
//   sealed a 2nd time with an ECDH(device keys) transfer key → other side stores it → done.
(function () {
  if (typeof pairMode === 'undefined') return;

  const $ = id => document.getElementById(id);
  const te = new TextEncoder(), td = new TextDecoder();
  const uniq = a => [...new Set((a || []).filter(Boolean))];
  const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  const b64url = u8 => btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unb64url = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
  const QR_LIFETIME = 180000;       // a shown code is valid 3 min
  const SESSION_LIFETIME = 300000;  // a whole pairing must finish within 5 min
  const RESEND = 1500;              // broadcast is fire-and-forget → resend until answered

  // 64 symbols for the 4-symbol check (6 bits each). Rendered via emojiImg → same look on Pixel + Samsung.
  const SYMBOLS = [...'🐢🐙🦊🐝🦉🐳🦋🐌🐸🦁🐧🐨🦒🐘🦔🐞🍋🍓🍒🍉🍇🍍🥕🌽🍄🥨🧀🍕🍩🍪🎂☕🚲🚀⛵🚂🎈🎸🎺🥁⚽🏀🎲🧩🔑🔔💡📚⭐🌙🌈🔥🌵🌻🌲🍀💎👑🎩⚓🧭⏰🍎🐠'];

  // ---------------------------------------------------------------------------
  // IndexedDB key/value store
  // ---------------------------------------------------------------------------
  let dbP = null;
  function db() {
    if (!dbP) dbP = new Promise((res, rej) => {
      const r = indexedDB.open('vgp-pair', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbP;
  }
  async function kv(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const tx = d.transaction('kv', mode), st = tx.objectStore('kv');
      const req = fn(st);
      tx.oncomplete = () => res(req && req.result);
      tx.onerror = () => rej(tx.error);
    });
  }
  const kvGet = k => kv('readonly', st => st.get(k));
  const kvSet = (k, v) => kv('readwrite', st => st.put(v, k));
  const kvDel = k => kv('readwrite', st => st.delete(k));

  // ---------------------------------------------------------------------------
  // Device keys (non-extractable) → VGP's identity globals
  // ---------------------------------------------------------------------------
  async function loadDevice() {
    let d = await kvGet('device');
    if (!d || !d.sigPriv || !d.ecdhPriv) {
      const sk = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
      const ek = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveKey', 'deriveBits']);
      d = {
        sigPriv: sk.privateKey, sigPub: b64(await crypto.subtle.exportKey('spki', sk.publicKey)),
        ecdhPriv: ek.privateKey, ecdhPub: b64(await crypto.subtle.exportKey('spki', ek.publicKey)),
        created: new Date().toISOString()
      };
      await kvSet('device', d);
      dbg('Paar-Modus: neue Geräte-Schlüssel erzeugt (nicht exportierbar)');
    }
    myPrivKey = d.sigPriv; myPubB64 = d.sigPub;
    myEcdhPrivKey = d.ecdhPriv; myEcdhPubB64 = d.ecdhPub;
    return d;
  }

  // ---------------------------------------------------------------------------
  // Pair record → open the one chat
  // ---------------------------------------------------------------------------
  let pairRec = null;
  let pushOk = false;              // this phone's push subscription is stored under the current key
  async function pairIdOf(raw) { return hex(await crypto.subtle.digest('SHA-256', raw)).slice(0, 16); }
  function myName() { return (localStorage.getItem(NAME_KEY) || '').trim(); }
  function partnerFrom(p) {
    return { name: (p.name || 'Partner').slice(0, 30), emoji: (p.emoji || '').slice(0, 16), avatar: '', pubkey: p.sig, ecdh_pubkey: p.ecdh };
  }

  async function openChat(rec) {
    pairRec = rec;
    pairSelfPubs = new Set(uniq([...(rec.selfPubs || []), myPubB64]));
    pairPeerPubs = new Set(uniq([...(rec.peerPubs || []), rec.partner.pubkey]));
    chatKeyCache.set(rec.partner.ecdh_pubkey, rec.pk); // deriveChatKey(partner) → the pair key
    await ensureClient();
    subscribeMessages();
    hidePanel();
    myNameEl.value = myName();
    selectContact(rec.partner);
    if (matchMedia('(pointer:coarse)').matches) msgInput.blur(); // no keyboard pop-up on app start
    try { await publishDelivered(rec.partner.pubkey); } catch (_) {}
    setTimeout(catchUp, 3000); setTimeout(catchUp, 8000);   // right after subscribing realtime may still miss inserts
    pushOk = await syncPushSubscription();
    dbg('Paar-Chat geöffnet mit ' + rec.partner.name + ' · ' + pairSelfPubs.size + '/' + pairPeerPubs.size + ' Schlüssel im Verlauf');
  }

  // Catch-up: fetch messages newer than the last one on screen and render the missing ones.
  // Realtime can miss an insert right after (re)subscribing or while the phone sleeps — this closes the gap.
  let catchingUp = false;
  async function catchUp() {
    if (catchingUp || !pairRec || !activePeer || !client) return;
    catchingUp = true;
    try {
      const ids = [...messagesEl.querySelectorAll('.msg[data-id]')].map(el => +el.dataset.id).filter(n => n > 0);
      const maxId = ids.length ? Math.max(...ids) : 0;
      const selfKeys = [...pairSelfPubs], peerKeys = [...pairPeerPubs];
      const mine = selfKeys.map(k => `pubkey.eq."${k}",recipient_pubkey.eq."${k}"`).join(',');
      const { data, error } = await client.from('messages').select('*').or(mine).gt('id', maxId).order('id', { ascending: true });
      if (error || !data || !data.length) return;
      const rows = data.filter(m => (selfKeys.includes(m.pubkey) && peerKeys.includes(m.recipient_pubkey)) ||
                                    (peerKeys.includes(m.pubkey) && selfKeys.includes(m.recipient_pubkey)));
      if (!rows.length) return;
      const near = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight <= 160;
      for (const m of rows) await renderMsg(m);      // renderMsg skips ids already on screen
      glideToBottom(messagesEl, near);
      if (rows.some(m => m.pubkey !== myPubB64 && document.visibilityState === 'visible')) publishRead(activePeer.pubkey);
      dbg('Nachgeholt: ' + rows.length + ' Nachricht(en)');
    } catch (e) { dbg('Nachholen: ' + (e && e.message || e)); }
    finally { catchingUp = false; }
  }

  // 4 symbols from both partners' public keys (order-independent → same on both phones, now and later).
  async function symbolsFor(aSig, aEcdh, bSig, bEcdh) {
    const A = aSig + '|' + aEcdh, B = bSig + '|' + bEcdh;
    const h = new Uint8Array(await crypto.subtle.digest('SHA-256', te.encode((A < B ? A + '#' + B : B + '#' + A))));
    const bits = (h[0] << 16) | (h[1] << 8) | h[2];
    return [18, 12, 6, 0].map(s => SYMBOLS[(bits >> s) & 63]);
  }
  const symbolsHtml = list => list.map(s => `<span class="pp-sym">${emojiImg(escapeHtml(s))}</span>`).join('');

  // ---------------------------------------------------------------------------
  // Panel UI
  // ---------------------------------------------------------------------------
  const panel = $('pair-panel');
  let pendingSecret = null;        // from a #pair= link, waiting for the name
  function showStep(step) {
    panel.classList.remove('hidden');
    document.querySelectorAll('#pair-panel .pp-step').forEach(el => el.classList.toggle('on', el.id === 'pp-' + step));
    $('pp-err').classList.add('hidden');
  }
  function hidePanel() { panel.classList.add('hidden'); camStop(); }
  function showErr(msg) { const e = $('pp-err'); e.textContent = msg; e.classList.remove('hidden'); }
  function backToStart(msg) {
    endSession();
    if (pairRec) { hidePanel(); if (msg) uiConfirm(msg, { alert: true }); return; }
    showIntro();
    if (msg) showErr(msg);
  }
  function showIntro() {
    showStep('intro');
    $('pp-name').value = myName();
    const join = !!pendingSecret;
    $('pp-join').style.display = join ? '' : 'none';
    $('pp-show').style.display = join ? 'none' : '';
    $('pp-scan').style.display = join ? 'none' : '';
    $('pp-intro-hint').textContent = join
      ? 'Gleich gekoppelt: Name eingeben, dann „Koppeln“.'
      : 'Einmal koppeln – danach öffnet VGP direkt euren Chat. Kein Konto, kein Passwort.';
  }
  function takeName() {
    const n = $('pp-name').value.trim().slice(0, 30);
    if (!n) { showErr('Bitte deinen Namen eingeben.'); $('pp-name').focus(); return false; }
    localStorage.setItem(NAME_KEY, n);
    myNameEl.value = n;
    return true;
  }

  // ---------------------------------------------------------------------------
  // Pairing session
  // ---------------------------------------------------------------------------
  let ps = null;
  function every(s, fn, ms) { fn(); const t = setInterval(fn, ms); s.timers.push(t); return t; }
  function endSession(keepChannelMs) {
    if (!ps) return;
    const s = ps; ps = null;
    s.timers.forEach(t => { clearInterval(t); clearTimeout(t); });
    const drop = () => { try { client.removeChannel(s.ch); } catch (_) {} };
    if (s.ch) { if (keepChannelMs) setTimeout(drop, keepChannelMs); else drop(); }
  }
  async function channelFor(secret) {
    const base = await crypto.subtle.importKey('raw', secret, 'HKDF', false, ['deriveKey', 'deriveBits']);
    const salt = te.encode('vgp-pair-v1');
    const key = await crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt, info: te.encode('channel-key') },
      base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const id = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: te.encode('channel-id') }, base, 128);
    return { key, topic: 'vgp-pair-' + hex(id) };
  }
  async function seal(key, obj, tag) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: te.encode(tag) }, key, te.encode(JSON.stringify(obj))));
    const out = new Uint8Array(12 + ct.length); out.set(iv); out.set(ct, 12);
    return b64(out);
  }
  async function unseal(key, b64s, tag) {
    const c = unb64(b64s);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: c.slice(0, 12), additionalData: te.encode(tag) }, key, c.slice(12));
    return JSON.parse(td.decode(pt));
  }
  // Second layer for the pair key: ECDH between the two DEVICE keys → HKDF → AES-GCM.
  async function transferKey(peerEcdhB64) {
    const pub = await crypto.subtle.importKey('spki', unb64(peerEcdhB64), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
    const bits = await crypto.subtle.deriveBits({ name: 'ECDH', public: pub }, myEcdhPrivKey, 256);
    const base = await crypto.subtle.importKey('raw', bits, 'HKDF', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: te.encode('vgp-pair-v1'), info: te.encode('pair-key-transfer') },
      base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  function send(t, obj) {
    const s = ps;
    if (!s || !s.ch) return Promise.resolve();
    return seal(s.key, obj, t).then(c => s.ch.send({ type: 'broadcast', event: 'p', payload: { t, c } }))
      .catch(e => dbg('Kopplung senden: ' + e.message));
  }
  function mine() {
    return { name: myName(), emoji: (typeof myEmoji !== 'undefined' && myEmoji) || '', sig: myPubB64, ecdh: myEcdhPubB64,
             has: pairRec ? pairRec.pairId : null, with: pairRec ? pairRec.partner.name : null };
  }
  function validPeer(d) {
    return d && typeof d.sig === 'string' && typeof d.ecdh === 'string' && d.sig.length > 80 && d.ecdh.length > 80 &&
           d.sig !== myPubB64 && d.ecdh !== myEcdhPubB64;
  }
  const keeperRole = () => {
    const scanner = ps.role === 'scan' ? ps.mine : ps.peer, shower = ps.role === 'show' ? ps.mine : ps.peer;
    return scanner.has ? 'scan' : (shower.has ? 'show' : 'scan');
  };

  async function openSession(role, secret) {
    endSession();
    camStop();
    await ensureClient();
    const { key, topic } = await channelFor(secret);
    ps = { role, secret, key, topic, ch: null, peer: null, mine: mine(), myOk: false, peerOk: false,
           keyed: false, stored: false, finished: false, timers: [], pending: null };
    const s = ps;
    s.timers.push(setTimeout(() => { if (ps === s && !s.finished) backToStart('Die Kopplung hat zu lange gedauert – bitte nochmal.'); }, SESSION_LIFETIME));
    return new Promise((resolve, reject) => {
      s.ch = client.channel(topic, { config: { broadcast: { self: false } } })
        .on('broadcast', { event: 'p' }, msg => onPayload(s, msg && msg.payload))
        .subscribe(status => {
          if (status === 'SUBSCRIBED') resolve(s);
          else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') reject(new Error('Keine Verbindung zum Server (' + status + ')'));
        });
    });
  }

  async function onPayload(s, p) {
    if (s !== ps || s.finished || !p || !p.t || !p.c) return;
    let d;
    try { d = await unseal(s.key, p.c, p.t); } catch (_) { return; } // not sealed with our code → ignore
    if (s !== ps) return;
    switch (p.t) {
      case 'hi':                                   // shower: the scanner introduces itself
        if (s.role !== 'show' || !validPeer(d)) return;
        if (!s.peer) { s.peer = d; await peerKnown(); }
        if (s.peer.sig === d.sig) send('hi2', s.mine);
        break;
      case 'hi2':                                  // scanner: the shower answers
        if (s.role !== 'scan' || !validPeer(d) || s.peer) return;
        s.peer = d; await peerKnown();
        break;
      case 'ok': if (s.peer) { s.peerOk = true; handOver(); } break;
      case 'key': await takeKey(d); break;
      case 'done': await keeperDone(); break;
      case 'no': backToStart('Auf dem anderen Phone abgebrochen.'); break;
    }
  }

  async function peerKnown() {
    const s = ps;
    s.timers.forEach(t => clearInterval(t));       // stop "hi" resends / QR countdown (session deadline stays)
    s.timers = s.timers.filter(() => false);
    s.timers.push(setTimeout(() => { if (ps === s && !s.finished) backToStart('Die Kopplung hat zu lange gedauert – bitte nochmal.'); }, SESSION_LIFETIME));
    const sym = await symbolsFor(myPubB64, myEcdhPubB64, s.peer.sig, s.peer.ecdh);
    $('pp-symbols').innerHTML = symbolsHtml(sym);
    $('pp-symbols').dataset.sym = sym.join('');
    const iKeep = keeperRole() === s.role;
    let note = 'Koppeln mit: ' + (s.peer.name || 'Partner');
    if (iKeep && s.mine.has) note += ' · euer Verlauf geht mit auf das neue Phone';
    else if (!iKeep && s.peer.has) note += ' · der Verlauf kommt mit';
    $('pp-peer').textContent = note;
    camStop();
    showStep('verify');
  }

  // User confirmed the symbols → announce it until the hand-over happens.
  function confirmSymbols() {
    const s = ps; if (!s || !s.peer) return;
    s.myOk = true;
    $('pp-wait-text').textContent = 'Warte auf das andere Phone …';
    showStep('wait');
    every(s, () => { if (ps === s && !s.finished) send('ok', {}); }, RESEND);
    handOver();
  }

  // Keeper: both said "Passt" → send the pair key (+ history keys) until the other side says done.
  async function handOver() {
    const s = ps;
    if (!s || !s.myOk || !s.peerOk || s.keyed || keeperRole() !== s.role) return;
    s.keyed = true;
    let pkRaw, pairId, selfPubs = [], peerPubs = [];
    if (pairRec && s.mine.has) {
      pkRaw = new Uint8Array(await crypto.subtle.exportKey('raw', pairRec.pk));
      pairId = pairRec.pairId; selfPubs = pairRec.selfPubs || []; peerPubs = pairRec.peerPubs || [];
    } else {
      pkRaw = crypto.getRandomValues(new Uint8Array(32));
      pairId = await pairIdOf(pkRaw);
    }
    s.pending = { pkRaw, pairId, selfPubs: uniq([...selfPubs, myPubB64]), peerPubs: uniq([...peerPubs, s.peer.sig]) };
    const inner = await seal(await transferKey(s.peer.ecdh), { k: b64(pkRaw), id: pairId, self: s.pending.selfPubs, peer: peerPubs }, 'key');
    if (ps !== s) return;
    every(s, () => { if (ps === s && !s.finished) send('key', { x: inner }); }, RESEND);
  }

  // Receiver of the pair key: store it, confirm (a few times), open the chat.
  async function takeKey(d) {
    const s = ps;
    if (!s || !s.myOk || !s.peer || keeperRole() === s.role || !d || !d.x) return;
    if (s.stored) { send('done', {}); return; }
    let k;
    try { k = await unseal(await transferKey(s.peer.ecdh), d.x, 'key'); } catch (_) { return; }
    const raw = unb64(k.k);
    if (raw.length !== 32 || await pairIdOf(raw) !== k.id) return;
    const rec = {
      pk: await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']),
      pairId: k.id, partner: partnerFrom(s.peer),
      selfPubs: uniq([...(k.peer || []), myPubB64]), peerPubs: uniq([...(k.self || []), s.peer.sig]),
      pairedAt: new Date().toISOString()
    };
    await kvSet('pair', rec);
    s.stored = true;
    send('done', {});
    finish(rec, 4000);   // keep the channel a moment so late "key" resends still get their "done"
  }

  async function keeperDone() {
    const s = ps;
    if (!s || !s.pending || s.finished) return;
    const p = s.pending;
    const rec = {
      pk: await crypto.subtle.importKey('raw', p.pkRaw, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']),
      pairId: p.pairId, partner: partnerFrom(s.peer), selfPubs: p.selfPubs, peerPubs: p.peerPubs,
      pairedAt: new Date().toISOString()
    };
    await kvSet('pair', rec);
    finish(rec, 0);
  }

  async function finish(rec, keepChannelMs) {
    const s = ps;
    if (keepChannelMs && s) {        // receiver: keep answering late "key" resends with "done" for a moment
      s.timers.forEach(t => { clearInterval(t); clearTimeout(t); });
      s.timers = [];
      setTimeout(() => { if (ps === s) endSession(); }, keepChannelMs);
    } else { if (s) s.finished = true; endSession(); }
    pendingSecret = null;
    await openChat(rec);
    dbg('Gekoppelt mit ' + rec.partner.name);
    if (!pushOk && 'Notification' in window && Notification.permission !== 'denied' && 'PushManager' in window) {
      if (await uiConfirm('Gekoppelt mit ' + rec.partner.name + ' 💚\n\nBenachrichtigungen einschalten, damit du neue Nachrichten mitbekommst?', { okText: 'Einschalten' })) enablePush();
    }
  }

  // ---------------------------------------------------------------------------
  // Roles: show a code / scan a code
  // ---------------------------------------------------------------------------
  let qrLib = null;
  function loadScript(src, test) {
    return new Promise((ok, fail) => {
      if (test()) return ok();
      const s = document.createElement('script');
      s.src = src; s.onload = () => (test() ? ok() : fail(new Error('Baustein fehlt: ' + src)));
      s.onerror = () => fail(new Error('Laden fehlgeschlagen: ' + src));
      document.head.appendChild(s);
    });
  }
  async function startShow() {
    showStep('wait');
    $('pp-wait-text').textContent = 'Code wird vorbereitet …';
    try {
      const secret = crypto.getRandomValues(new Uint8Array(16));
      const s = await openSession('show', secret);
      qrLib = qrLib || loadScript('../svp/qrcode.min.js', () => typeof window.qrcode === 'function');
      await qrLib;
      const link = location.origin + location.pathname + '#pair=' + b64url(secret);
      const q = window.qrcode(0, 'M'); q.addData(link); q.make();
      const box = $('pp-qrbox');
      box.innerHTML = q.createSvgTag({ scalable: true, margin: 2 });
      box.dataset.link = link;
      showStep('qr');
      const until = Date.now() + QR_LIFETIME;
      every(s, () => {
        if (ps !== s) return;
        const left = Math.max(0, Math.round((until - Date.now()) / 1000));
        $('pp-qrtime').textContent = 'Gilt noch ' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0') + ' Min.';
        if (!left) { box.innerHTML = ''; box.dataset.link = ''; backToStart('Der Code ist abgelaufen.'); }
      }, 1000);
    } catch (e) { backToStart('Fehler: ' + e.message); }
  }
  async function startScan(secret) {
    showStep('wait');
    $('pp-wait-text').textContent = 'Verbinde mit dem anderen Phone …';
    try {
      const s = await openSession('scan', secret);
      let tries = 0;
      every(s, () => {
        if (ps !== s || s.peer) return;
        if (++tries > 20) { backToStart('Das andere Phone antwortet nicht. Ist sein Code noch offen?'); return; }
        send('hi', s.mine);
      }, RESEND);
    } catch (e) { backToStart('Fehler: ' + e.message); }
  }
  function secretFrom(text) {
    const m = String(text || '').match(/(?:[#&?]pair=)?([A-Za-z0-9_-]{22})(?![A-Za-z0-9_-])/);
    if (!m) return null;
    try { const u = unb64url(m[1]); return u.length === 16 ? u : null; } catch (_) { return null; }
  }

  // Camera: BarcodeDetector where the browser has it (Chrome on Android), else jsQR (lazy, CDN).
  let camStream = null, camTimer = null;
  function camStop() {
    clearInterval(camTimer); camTimer = null;
    if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
    const v = $('pp-video'); if (v) v.srcObject = null;
  }
  async function startCam() {
    endSession();
    showStep('cam');
    $('pp-link').value = '';
    $('pp-cam-note').textContent = '';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { $('pp-cam-note').textContent = 'Keine Kamera verfügbar – du kannst den Link einfügen.'; return; }
    try { camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); }
    catch (_) { $('pp-cam-note').textContent = 'Kamera nicht erlaubt – du kannst den Link einfügen.'; return; }
    const video = $('pp-video');
    video.srcObject = camStream;
    try { await video.play(); } catch (_) {}
    let detect = null;
    if ('BarcodeDetector' in window) {
      try { const bd = new BarcodeDetector({ formats: ['qr_code'] }); detect = async () => { const r = await bd.detect(video); return r[0] && r[0].rawValue; }; } catch (_) {}
    }
    if (!detect) {
      try { await loadScript('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js', () => typeof window.jsQR === 'function'); }
      catch (e) { $('pp-cam-note').textContent = 'QR-Erkennung fehlt – du kannst den Link einfügen.'; return; }
      const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
      detect = async () => {
        const w = video.videoWidth, h = video.videoHeight; if (!w || !h) return null;
        cv.width = w; cv.height = h; cx.drawImage(video, 0, 0, w, h);
        const r = window.jsQR(cx.getImageData(0, 0, w, h).data, w, h); return r && r.data;
      };
    }
    let busy = false;
    camTimer = setInterval(async () => {
      if (busy || !camStream) return; busy = true;
      try { const s = secretFrom(await detect()); if (s) { camStop(); startScan(s); } } catch (_) {}
      busy = false;
    }, 300);
  }

  // ---------------------------------------------------------------------------
  // Chat-header menu (⋮) + hidden switch to the group VGP
  // ---------------------------------------------------------------------------
  const pairMenu = $('pair-menu');
  function closeMenu() { if (pairMenu) pairMenu.classList.add('hidden'); }
  async function showSymbols() {
    if (!pairRec) return;
    const sym = await symbolsFor(myPubB64, myEcdhPubB64, pairRec.partner.pubkey, pairRec.partner.ecdh_pubkey);
    uiConfirm('Sicherheits-Symbole mit ' + pairRec.partner.name + ':\n\n' + sym.join('  ') +
      '\n\nZeigt ' + pairRec.partner.name + 's Phone dieselben vier Symbole (⋮ → Sicherheits-Symbole), spricht niemand dazwischen.',
      { alert: true, okText: 'Alles klar' });
  }
  async function unpair() {
    const who = pairRec ? pairRec.partner.name : 'deinem Partner';
    if (!await uiConfirm('Auf diesem Phone von ' + who + ' entkoppeln?\n\nDer Verlauf bleibt verschlüsselt auf dem Server und auf dem anderen Phone. Hier ist er danach weg – außer du koppelst neu mit ' + who + 's Phone (dann kommt er wieder).', { okText: 'Entkoppeln', danger: true })) return;
    await kvDel('pair');
    location.reload();
  }
  async function switchToGroup() {
    if (!await uiConfirm('Zum Gruppen-VGP wechseln?\n\nZurück zum Paar-Chat: dort ⋮ → „Paar-Chat“.', { okText: 'Wechseln' })) return;
    try { localStorage.setItem('vgp-mode', 'gruppe'); } catch (_) {}
    location.replace(location.pathname);
  }
  // Long-press (1.2 s) — the only way into the group VGP from pair mode (Doc: "bestehen aber nicht sichtbar").
  function onLongPress(el, fn) {
    if (!el) return;
    let t = null;
    const start = () => { clearTimeout(t); t = setTimeout(() => { t = null; fn(); }, 1200); };
    const stop = () => { clearTimeout(t); t = null; };
    el.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, stop));
    el.addEventListener('contextmenu', e => e.preventDefault());
  }

  function wire() {
    $('pp-name').addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();   // single-line textarea (no Android autofill strip) → never a newline
      if (pendingSecret) $('pp-join').click(); else $('pp-show').click();
    });
    $('pp-show').onclick = () => { if (takeName()) startShow(); };
    $('pp-scan').onclick = () => { if (takeName()) startCam(); };
    $('pp-join').onclick = () => { if (takeName()) { const s = pendingSecret; startScan(s); } };
    $('pp-link').addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    $('pp-link').addEventListener('input', () => { const s = secretFrom($('pp-link').value); if (s) { camStop(); startScan(s); } });
    const cancel = async () => {      // tell the other phone (best-effort, max 0.8 s), then stop
      if (ps && ps.peer) await Promise.race([send('no', {}), new Promise(r => setTimeout(r, 800))]);
      backToStart();
    };
    ['pp-qr-cancel', 'pp-cam-cancel', 'pp-no', 'pp-wait-cancel'].forEach(id => { $(id).onclick = cancel; });
    $('pp-yes').onclick = confirmSymbols;
    onLongPress($('pair-title'), switchToGroup);
    onLongPress($('chat-peer'), switchToGroup);
    if (pairMenu) {
      $('pair-menu-btn').onclick = e => { e.stopPropagation(); pairMenu.classList.toggle('hidden'); };
      document.addEventListener('click', e => { if (!pairMenu.contains(e.target)) closeMenu(); });
      $('pm-push').onclick = () => { closeMenu(); enablePush(); };
      $('pm-scan').onclick = () => { closeMenu(); startCam(); };
      $('pm-show').onclick = () => { closeMenu(); startShow(); };
      $('pm-symbols').onclick = () => { closeMenu(); showSymbols(); };
      $('pm-e2e').onclick = () => { closeMenu(); uiConfirm('Ende-zu-Ende-verschlüsselt: Nachrichten, Bilder und Sprachnachrichten werden nur auf euren beiden Phones ver- und entschlüsselt (AES-256-GCM). Der Server sieht nur Geheimtext.', { alert: true, okText: 'Alles klar' }); };
      $('pm-unpair').onclick = () => { closeMenu(); unpair(); };
    }
    // Back from background (realtime may have slept) + every 20 s while visible: fetch what is missing.
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') catchUp(); });
    setInterval(() => { if (document.visibilityState === 'visible') catchUp(); }, 20000);
  }

  // Group mode: one extra item in its ⋮ menu leads back to the pair chat (nothing else changes there).
  function addGroupBackItem() {
    const menu = $('head-menu'), e2e = $('menu-e2e');
    if (!menu || $('menu-pair')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'menu-pair'; b.setAttribute('role', 'menuitem'); b.textContent = '💬 Paar-Chat';
    b.onclick = () => { try { localStorage.setItem('vgp-mode', 'paar'); } catch (_) {} location.replace(location.pathname); };
    menu.insertBefore(b, e2e || null);
  }

  // ---------------------------------------------------------------------------
  // Start (called by vgpStartup in vgp-auth.js when pairMode)
  // ---------------------------------------------------------------------------
  window.pairStartup = async function () {
    $('chat-peer').textContent = '';
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(ok => dbg('Speicher dauerhaft: ' + ok)); } catch (_) {}
    const m = location.hash.match(/[#&]pair=([A-Za-z0-9_-]{22})/);
    if (m) {
      pendingSecret = secretFrom(m[1]);
      history.replaceState(null, '', location.pathname + location.search); // the code never stays in the URL/history
    }
    try {
      await loadDevice();
      const rec = await kvGet('pair');
      if (rec && rec.pk && rec.partner && rec.partner.pubkey) {
        await openChat(rec);
        if (pendingSecret) {          // a code link opened while already paired → ask first
          const s = pendingSecret; pendingSecret = null;
          if (await uiConfirm('Mit dem Phone koppeln, dessen Code du gerade geöffnet hast?\n\nDer Verlauf mit ' + rec.partner.name + ' geht dabei mit.', { okText: 'Koppeln' })) startScan(s);
        }
        return;
      }
      await ensureClient();
      if (pendingSecret && myName()) { const s = pendingSecret; startScan(s); return; }
      showIntro();
    } catch (e) {
      dbg('Paar-Start fehlgeschlagen: ' + (e && e.message || e));
      showIntro();
      showErr('Fehler beim Start: ' + (e && e.message || e));
    }
  };

  if (pairMode) wire(); else addGroupBackItem();
})();
