// deck-lock.js - the password gate of a sealed DocPoint deck (tools/pptx/deck_seal.mjs seals it).
// The page carries its slides only as <script id="sealed">: AES-GCM, key = PBKDF2-SHA256(password).
// This asks for the password, decrypts, puts slides, narration and summary back and then loads deck.js,
// so the deck itself runs exactly as unsealed. The derived key is remembered on the device as a
// non-extractable CryptoKey in IndexedDB "deck-lock" (one per page): the presenter window and the next
// visit open without asking. A new seal has a new salt, so a remembered key stops fitting and the page asks
// again. The password itself is never stored.
(function () {
  'use strict';
  const sealed = JSON.parse(document.getElementById('sealed').textContent);
  const b64 = (t) => Uint8Array.from(atob(t), (c) => c.charCodeAt(0));
  const SLOT = location.pathname;

  function db() {
    return new Promise((ok, no) => {
      const r = indexedDB.open('deck-lock', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('keys');
      r.onsuccess = () => ok(r.result);
      r.onerror = () => no(r.error);
    });
  }
  async function keyStore(mode, fn) {
    try {
      const d = await db();
      return await new Promise((ok, no) => {
        const t = d.transaction('keys', mode), q = fn(t.objectStore('keys'));
        t.oncomplete = () => ok(q && q.result);
        t.onerror = () => no(t.error);
      });
    } catch (e) { return null; }                       // private window, blocked storage: just ask every time
  }

  async function fromPassword(pw) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(sealed.salt), iterations: sealed.iter, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);   // non-extractable
  }

  async function open(key) {                           // null when the key does not fit
    try {
      const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(sealed.iv) }, key, b64(sealed.ct));
      return JSON.parse(new TextDecoder().decode(raw));
    } catch (e) { return null; }
  }

  function show(p) {
    document.getElementById('deck').innerHTML = p.slides;
    document.getElementById('narration').textContent = p.narration;
    document.getElementById('summary').textContent = p.summary;
    const s = document.createElement('script');
    s.src = 'deck.js';
    document.body.appendChild(s);
  }

  function gate() {
    const css = document.createElement('style');
    css.textContent =
      '#deck-lock{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
      'padding:16px;background:radial-gradient(circle at 70% 30%,#1a3566,#0E244E 45%,#03101c);font-family:Raleway,system-ui,sans-serif}' +
      '#deck-lock form{width:min(420px,100%);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);' +
      'border-radius:14px;padding:28px 24px;color:#E6ECF8;box-sizing:border-box}' +
      '#deck-lock h1{margin:0 0 6px;font:700 20px/1.3 Orbitron,sans-serif;letter-spacing:.04em;color:#F5C242}' +
      '#deck-lock p{margin:0 0 18px;font-size:15px;line-height:1.4;color:#B8C4DC}' +
      '#deck-lock .row{display:flex;gap:8px}' +
      '#deck-lock input{flex:1;min-width:0;height:48px;padding:0 14px;border-radius:10px;border:1px solid rgba(255,255,255,.25);' +
      'background:#fff;color:#0E244E;font:16px Raleway,system-ui,sans-serif}' +
      '#deck-lock button{height:48px;padding:0 18px;border:0;border-radius:10px;background:#F5C242;color:#0E244E;' +
      'font:700 14px Orbitron,sans-serif;cursor:pointer}' +
      '#deck-lock button:disabled{opacity:.6;cursor:wait}' +
      '#deck-lock .err{min-height:20px;margin:10px 0 0;font-size:14px;color:#FF9C8F}';
    document.head.appendChild(css);
    const box = document.createElement('div');
    box.id = 'deck-lock';
    box.innerHTML = '<form autocomplete="off"><h1>Geschütztes Deck</h1><p></p>' +
      '<div class="row"><input type="password" aria-label="Passwort" placeholder="Passwort" autocomplete="current-password">' +
      '<button type="submit">Öffnen</button></div><div class="err" aria-live="polite"></div></form>';
    box.querySelector('p').textContent = document.title;
    document.body.appendChild(box);
    const form = box.querySelector('form'), input = box.querySelector('input'),
      btn = box.querySelector('button'), err = box.querySelector('.err');
    input.addEventListener('paste', () => setTimeout(() => { input.value = input.value.trim(); }, 0));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const pw = input.value.trim();
      if (!pw) return;
      btn.disabled = true; err.textContent = '';
      const key = await fromPassword(pw);
      const p = await open(key);
      btn.disabled = false;
      if (!p) { err.textContent = 'Das Passwort stimmt nicht.'; input.select(); return; }
      await keyStore('readwrite', (st) => st.put(key, SLOT));
      box.remove(); css.remove();
      show(p);
    });
    input.focus();
  }

  (async function () {
    const kept = await keyStore('readonly', (st) => st.get(SLOT));
    const p = kept && await open(kept);
    if (p) show(p);
    else { if (kept) keyStore('readwrite', (st) => st.delete(SLOT)); gate(); }
  })();
})();
