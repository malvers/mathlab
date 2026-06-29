// ── vgp-predict.js ───────────────────────────────────────────────────────────
// FULL AI-suggestion experience for VGP (the same as the aiboard "Sim"), powered by ChatPredictor:
// inline grey ghost, Tab word-by-word, 1/2/3 quick-pick, type-to-filter, stacked numbered chips.
//
// PRIVACY: default OFF. When opted in (explicit consent) the open conversation's plaintext is sent to
// the predictor (Gemini) — a deliberate, transparent break from VGP's E2E model. 1:1 chats only.
//
// Additive & defensive: reads the conversation from the rendered DOM, overlays a ghost on #msg-input
// (only while the predictor is active → VGP's normal input is untouched otherwise), and sends via VGP's
// own sendMsg(). Classic script — shares VGP's global scope (activePeer, myNameEl, sendMsg, uiConfirm…).

(function () {
  const KEY_ON = 'vgp_predict_on';
  let inited = false, seq = 0, typeTimer = null;
  let topSuggestion = '';   // full top prediction (draft + continuation); grey part shown inline
  let cands = [];           // last fetched [{full, cont}]
  let shown = [];           // currently visible (filtered) candidates — for 1/2/3
  let justPicked = false;   // swallow a trailing "." right after a 1/2/3 pick

  const $ = id => document.getElementById(id);
  const isOn = () => localStorage.getItem(KEY_ON) === '1';
  const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function ensureInit() {
    if (inited) return true;
    if (typeof ChatPredictor === 'undefined' || typeof SUPABASE_URL === 'undefined') return false;
    ChatPredictor.init({ url: SUPABASE_URL + '/functions/v1/gemini', key: SUPABASE_KEY });
    inited = true; return true;
  }

  function active1to1() {
    return !(typeof activeRoom !== 'undefined' && activeRoom) &&
           (typeof activePeer !== 'undefined' && activePeer);
  }

  // open conversation straight from the rendered bubbles (no coupling to VGP's data layer)
  function gatherMessages() {
    const out = [];
    document.querySelectorAll('#messages .msg').forEach(b => {
      const t = b.querySelector('.text');
      if (!t) return;
      const text = t.textContent.trim();
      if (text) out.push({ who: b.classList.contains('self') ? 'me' : 'partner', text });
    });
    return out;
  }

  // ── ghost overlay ────────────────────────────────────────────────────────────
  function ghostOn(on) {
    const app = $('app') || document.body;
    app.classList.toggle('vgp-ghosting', !!on);
    if (!on) { const g = $('vgp-ghost'); if (g) g.innerHTML = ''; }
  }
  function updateGhost() {
    const input = $('msg-input'), g = $('vgp-ghost');
    if (!input || !g) return;
    const draft = input.value;
    let typed = draft, suffix = '';
    if (topSuggestion && topSuggestion.toLowerCase().startsWith(draft.toLowerCase())) {
      suffix = topSuggestion.slice(draft.length);                 // continue: white text + grey continuation
    } else if (topSuggestion) {
      typed = ''; suffix = topSuggestion;                         // filter-selected: whole candidate grey
    }
    g.innerHTML = `<span class="vg-typed">${esc(typed)}</span><span class="vg-suffix">${esc(suffix)}</span>`;
    autoGrow();
  }
  function autoGrow() {
    const input = $('msg-input'), g = $('vgp-ghost');
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = Math.max(input.scrollHeight, g ? g.scrollHeight : 0) + 'px';
  }

  // ── chips ────────────────────────────────────────────────────────────────────
  function renderChips(list) {
    shown = list || [];
    const strip = $('vgp-sugg'); if (!strip) return;
    strip.innerHTML = shown.map((it, i) =>
      `<button class="vgp-sugg-chip" data-full="${esc(it.full)}">${i + 1}. ${esc(it.cont || it.full)}</button>`
    ).join('');
    strip.style.display = shown.length ? 'flex' : 'none';
  }

  // ── predict ──────────────────────────────────────────────────────────────────
  async function suggest() {
    if (!isOn() || !ensureInit() || !active1to1()) { renderChips([]); return; }
    const input = $('msg-input');
    if (!input || input.disabled) { renderChips([]); return; }
    const draft = input.value.trim();
    const messages = gatherMessages();
    if (!messages.length && !draft) { renderChips([]); return; }   // don't cold-start an empty private chat
    const me = (typeof myNameEl !== 'undefined' && myNameEl && myNameEl.value) || 'Ich';
    const partner = (activePeer && activePeer.name) || 'Partner';
    const mySeq = ++seq;
    try {
      const items = await ChatPredictor.predict({ messages, me, partner, speaker: 'me', draft });
      if (mySeq !== seq) return;
      cands = items;
      renderChips(items);
      topSuggestion = items[0] ? items[0].full : '';
      updateGhost();
    } catch (e) { renderChips([]); }
  }

  function sendVGP() { if (typeof sendMsg === 'function') sendMsg(); else { const s = $('send-btn'); if (s) s.click(); } }

  // ── input + keys ─────────────────────────────────────────────────────────────
  function onInput() {
    if (!isOn() || !active1to1()) return;
    const input = $('msg-input');
    const s = input.value.trim().toLowerCase();
    const matches = s ? cands.filter(c => c.full.toLowerCase().includes(s)) : cands;
    clearTimeout(typeTimer);
    if (matches.length) {
      renderChips(matches);
      const pref = matches.find(c => c.full.toLowerCase().startsWith(s));
      topSuggestion = pref ? pref.full : (matches.length === 1 ? matches[0].full : '');
      updateGhost();
    } else {
      topSuggestion = ''; updateGhost(); renderChips([]);
      typeTimer = setTimeout(suggest, 450);   // diverged → fresh prediction of what you typed
    }
  }

  function onKeydown(e) {
    if (!isOn() || !active1to1()) return;
    const input = $('msg-input');
    const draft = input.value;
    // 1/2/3 (or "1.") on an EMPTY field → select that suggestion as the grey guide (NOT sent yet)
    if (!draft && ['1', '2', '3'].includes(e.key) && shown[Number(e.key) - 1]) {
      e.preventDefault(); e.stopPropagation();
      topSuggestion = shown[Number(e.key) - 1].full; justPicked = true; updateGhost();
      return;
    }
    if (e.key === '.' && justPicked) { e.preventDefault(); e.stopPropagation(); justPicked = false; return; }
    justPicked = false;
    if (e.key === 'Tab' && topSuggestion) {
      e.preventDefault(); e.stopPropagation();
      if (topSuggestion.toLowerCase().startsWith(draft.toLowerCase())) {
        if (topSuggestion.length > draft.length) {                // continue: next word
          const suffix = topSuggestion.slice(draft.length);
          input.value = draft + (suffix.match(/^\s*\S+\s?/) || [suffix])[0];
          updateGhost();
        }
      } else {                                                    // filter-selected: build from the start
        input.value = (topSuggestion.match(/^\s*\S+\s?/) || [topSuggestion])[0];
        updateGhost();
      }
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      // empty field + active suggestion → drop it into the field so VGP's own Enter sends the whole thing
      if (!draft.trim() && topSuggestion) { input.value = topSuggestion; updateGhost(); }
      // (do NOT preventDefault → VGP's onkeydown sendMsg runs next and sends the field)
    }
  }

  // ── toggle (opt-in + consent) ─────────────────────────────────────────────────
  async function toggle() {
    if (isOn()) { localStorage.setItem(KEY_ON, '0'); updateToggleUI(); ghostOn(false); topSuggestion=''; renderChips([]); return; }
    const ok = await uiConfirm(
      'Um ein deutlich intelligenteres Chat-Erlebnis zu ermöglichen, involvieren wir die ' +
      'Künstliche Intelligenz (KI) Google Gemini. Der Chat-Text wird dazu ohne Deinen Namen oder ' +
      'Account an Gemini gesendet. ' +
      'Willst Du intelligente Unterstützung bei Chat, dann aktiviere das Brain. Wenn nicht, bleibt ' +
      'Dein Chat 100% sicher unknackbar verschlüsselt und niemand, nicht mal wir, können mitlesen. ' +
      'Es ist eine echte Ende-zu-Ende-Verschlüsselung ohne Hintertüre!',
      { okText: 'Aktivieren', danger: true });
    if (!ok) return;
    localStorage.setItem(KEY_ON, '1'); updateToggleUI(); ensureInit();
    if (active1to1()) { ghostOn(true); const i = $('msg-input'); if (i) i.focus(); suggest(); }
  }
  function updateToggleUI() {
    const b = $('vgp-predict-toggle');
    if (b) { b.classList.toggle('on', isOn()); b.title = isOn() ? 'KI-Vorschläge: AN (Gemini)' : 'KI-Vorschläge (aus)'; }
  }

  // re-evaluate when the open chat changes (switch contact / open a room) → ghost only in active 1:1
  function refreshContext() {
    if (isOn() && active1to1()) ghostOn(true); else { ghostOn(false); topSuggestion=''; renderChips([]); }
  }

  // ── inject UI once VGP's DOM exists ────────────────────────────────────────────
  function inject() {
    if ($('vgp-sugg')) return;
    const inputRow = $('input-row'); if (!inputRow) return;

    const strip = document.createElement('div');
    strip.id = 'vgp-sugg'; strip.style.display = 'none';
    inputRow.parentNode.insertBefore(strip, inputRow);

    const btn = document.createElement('button');
    btn.id = 'vgp-predict-toggle'; btn.type = 'button'; btn.setAttribute('aria-label', 'KI-Vorschläge');
    btn.innerHTML = '<span style="pointer-events:none">🧠</span>';
    const emoji = $('msg-emoji');
    if (emoji) emoji.parentNode.insertBefore(btn, emoji); else inputRow.prepend(btn);
    btn.addEventListener('click', toggle);
    updateToggleUI();

    // ghost overlay inside the field wrap (already position:relative in VGP)
    const wrap = document.querySelector('.msg-field-wrap');
    const input = $('msg-input');
    if (wrap && input) {
      const ghost = document.createElement('div');
      ghost.id = 'vgp-ghost'; ghost.setAttribute('aria-hidden', 'true');
      wrap.insertBefore(ghost, input);
    }

    // chip click → fill + send immediately (mouse-click → abschicken)
    strip.addEventListener('click', e => {
      const c = e.target.closest('.vgp-sugg-chip'); if (!c) return;
      const inp = $('msg-input');
      inp.value = c.dataset.full;
      inp.dispatchEvent(new Event('input', { bubbles: true }));   // VGP updates send-button state
      topSuggestion = ''; renderChips([]); updateGhost();
      sendVGP();
    });

    if (input) {
      input.addEventListener('focus', () => { refreshContext(); if (isOn() && active1to1() && !input.value.trim()) suggest(); });
      input.addEventListener('input', onInput);                   // additive (VGP's own input handler still runs)
      input.addEventListener('keydown', onKeydown, true);         // CAPTURE → runs before VGP's onkeydown
    }

    // a new message arrived (incl. our own send) → reset ghost, refresh suggestions if composing
    const msgs = $('messages');
    if (msgs && 'MutationObserver' in window) {
      let t = null;
      new MutationObserver(() => {
        topSuggestion = ''; updateGhost();
        if (!isOn() || !active1to1()) return;
        const inp = $('msg-input');
        if (!inp || document.activeElement !== inp || inp.value.trim()) { renderChips([]); return; }
        clearTimeout(t); t = setTimeout(suggest, 600);
      }).observe(msgs, { childList: true });
    }

    // contact/room switches change the active conversation
    ['contacts', 'contact-list'].forEach(id => { const el = $(id); if (el) el.addEventListener('click', () => setTimeout(refreshContext, 50)); });

    const css = document.createElement('style');
    css.textContent =
      // stacked, numbered, distinct AI-suggestion look (accent outline) — clearly NOT a chat bubble
      '#vgp-sugg{display:none;flex-direction:column;gap:5px;padding:6px 10px}' +
      '.vgp-sugg-chip{display:block;width:100%;text-align:left;background:rgba(var(--vgp-accent-rgb),.10);' +
      'color:var(--vgp-text,#fff);border:1px solid rgba(var(--vgp-accent-rgb),.38);border-radius:10px;' +
      'padding:7px 11px;font:inherit;font-size:.92rem;line-height:1.35;cursor:pointer}' +
      '.vgp-sugg-chip:hover{background:rgba(var(--vgp-accent-rgb),.18)}' +
      // brain toggle — same box as the smiley master (44/36)
      '#vgp-predict-toggle{flex:0 0 auto;width:44px;height:44px;border:none;border-radius:50%;background:transparent;' +
      'font-size:36px;line-height:44px;cursor:pointer;padding:0;text-align:center;opacity:.6;transition:opacity .15s}' +
      '#vgp-predict-toggle.on{opacity:1}' +
      // ghost overlay: only visible while ghosting; renders typed (transparent in textarea) + grey suffix
      '#vgp-ghost{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;display:none;' +
      "box-sizing:border-box;padding:10px 14px;font-family:'Helvetica Neue',Helvetica,Arial,system-ui,sans-serif;" +
      'font-size:14.5px;font-weight:450;line-height:1.32;white-space:pre-wrap;word-break:break-word}' +
      '.vgp-ghosting #vgp-ghost{display:block}' +
      '.vgp-ghost .vg-typed,#vgp-ghost .vg-typed{color:var(--vgp-text2)}' +
      '#vgp-ghost .vg-suffix{color:var(--vgp-text-dim,rgba(255,255,255,.4))}' +
      '.vgp-ghosting .msg-field-wrap{background:var(--vgp-field);border-radius:12px}' +
      '.vgp-ghosting .msg-field-wrap textarea{background:transparent;color:transparent;caret-color:var(--vgp-text2);position:relative;z-index:1}';
    document.head.appendChild(css);
  }

  if (document.readyState !== 'loading') inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
