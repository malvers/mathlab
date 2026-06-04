(() => {
  // Boot DebugWindow (collapsed by default — click pill bottom-right to open)
  if (window.DebugWindow && typeof DebugWindow.init === 'function') DebugWindow.init();
  function dbg(...args) {
    const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
    if (typeof DebugWindow !== 'undefined' && typeof DebugWindow.log === 'function') {
      DebugWindow.log(msg);
    } else {
      console.log(msg);
    }
  }
  window.dbg = dbg;

  // ====================================================================
  // LOCAL DEV ONLY — Google Cloud TTS API key bake-in.
  // REMOVE THIS BLOCK BEFORE `git push` (repo is public).
  // First load: seeds plain key → vault migration encrypts it on init.
  // Subsequent loads: skipped if an encrypted key already exists.
  // ====================================================================
  const __DEV_GTTS_KEY = 'AIzaSyC12C7FjeQmk7ShpjDskIQhgPu4AuOwL8o';
  if (__DEV_GTTS_KEY
      && !localStorage.getItem('gctt_api_key')
      && !localStorage.getItem('gctt_api_key_enc')) {
    localStorage.setItem('gctt_api_key', __DEV_GTTS_KEY);
  }
  // ====================================================================

  // ===== Stars =====
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = (Math.random() * 100) + '%';
    s.style.top  = (Math.random() * 58) + '%';
    const size = 1 + Math.random() * 2;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.animationDelay = (Math.random() * 2.5) + 's';
    s.style.animationDuration = (2 + Math.random() * 2.5) + 's';
    starsEl.appendChild(s);
  }

  // ===== Voice (Google Cloud TTS with browser fallback) =====
  let voiceEnabled = localStorage.getItem('gctt_muted') !== '1';
  let chosenVoice = null;
  let currentAudio = null;

  function pickBrowserVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    const male = voices.find(v => /^de(-DE)?/i.test(v.lang) &&
      /Markus|Yannick|Stefan|Hans|Daniel|Eddy|Reed/i.test(v.name));
    const anyDE = voices.find(v => /^de(-DE)?/i.test(v.lang));
    chosenVoice = male || anyDE || voices[0];
  }
  if ('speechSynthesis' in window) {
    pickBrowserVoice();
    speechSynthesis.onvoiceschanged = pickBrowserVoice;
  }

  function hashStr(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  // ===== Encrypted API-key vault (Web Crypto + IndexedDB) =====
  const VAULT_DB         = 'gctt-vault';
  const VAULT_STORE      = 'keys';
  const VAULT_WRAP_NAME  = 'wrap-key';
  const VAULT_CIPHER_LS  = 'gctt_api_key_enc';
  let   wrapKey          = null;
  let   cachedApiKey     = null;

  function openVaultDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(VAULT_DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(VAULT_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }
  async function loadOrCreateWrapKey() {
    if (wrapKey) return wrapKey;
    const db = await openVaultDB();
    const existing = await new Promise((res, rej) => {
      const r = db.transaction(VAULT_STORE, 'readonly').objectStore(VAULT_STORE).get(VAULT_WRAP_NAME);
      r.onsuccess = () => res(r.result);
      r.onerror   = () => rej(r.error);
    });
    if (existing) { wrapKey = existing; return wrapKey; }
    wrapKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
    await new Promise((res, rej) => {
      const tx = db.transaction(VAULT_STORE, 'readwrite');
      tx.objectStore(VAULT_STORE).put(wrapKey, VAULT_WRAP_NAME);
      tx.oncomplete = res;
      tx.onerror    = () => rej(tx.error);
    });
    return wrapKey;
  }
  async function vaultEncrypt(plain) {
    const k  = await loadOrCreateWrapKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(plain));
    const buf = new Uint8Array(iv.length + ct.byteLength);
    buf.set(iv, 0); buf.set(new Uint8Array(ct), iv.length);
    return btoa(String.fromCharCode(...buf));
  }
  async function vaultDecrypt(b64) {
    const k = await loadOrCreateWrapKey();
    const buf = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const iv = buf.slice(0, 12), ct = buf.slice(12);
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, k, ct);
    return new TextDecoder().decode(dec);
  }

  async function initApiKeyVault() {
    // Migrate any plain key (older versions or the DEV-seed) into the vault
    const plain = localStorage.getItem('gctt_api_key');
    if (plain) {
      try {
        const ct = await vaultEncrypt(plain);
        localStorage.setItem(VAULT_CIPHER_LS, ct);
        localStorage.removeItem('gctt_api_key');
        cachedApiKey = plain;
      } catch (e) { console.warn('vault migrate failed', e); }
    }
    // Load any existing ciphertext
    const ct = localStorage.getItem(VAULT_CIPHER_LS);
    if (ct && !cachedApiKey) {
      try { cachedApiKey = await vaultDecrypt(ct); }
      catch (e) { console.warn('vault decrypt failed', e); cachedApiKey = null; }
    }
    refreshSettingsBtnState();
  }
  async function saveApiKey(plain) {
    if (!plain) {
      cachedApiKey = null;
      localStorage.removeItem(VAULT_CIPHER_LS);
      refreshSettingsBtnState();
      return;
    }
    try {
      const ct = await vaultEncrypt(plain);
      localStorage.setItem(VAULT_CIPHER_LS, ct);
      cachedApiKey = plain;
    } catch (e) { console.warn('vault encrypt failed', e); }
    refreshSettingsBtnState();
  }

  function gKey()   { return cachedApiKey; }
  function gVoice() { return localStorage.getItem('gctt_voice') || 'de-DE-Neural2-B'; }

  initApiKeyVault();

  // ===== Gemini key — separate vault slot (the Gemini-scoped key differs from the TTS key) =====
  const VAULT_GEMINI_LS = 'gemini_api_key_enc';
  let cachedGeminiKey = null;
  async function initGeminiVault() {
    const ct = localStorage.getItem(VAULT_GEMINI_LS);
    if (ct) {
      try { cachedGeminiKey = await vaultDecrypt(ct); }
      catch (e) { console.warn('gemini vault decrypt failed', e); cachedGeminiKey = null; }
    }
  }
  async function saveGeminiKey(plain) {
    if (!plain) { cachedGeminiKey = null; localStorage.removeItem(VAULT_GEMINI_LS); return; }
    try {
      const ct = await vaultEncrypt(plain);
      localStorage.setItem(VAULT_GEMINI_LS, ct);
      cachedGeminiKey = plain;
    } catch (e) { console.warn('gemini vault encrypt failed', e); }
  }
  function gemKey() { return cachedGeminiKey; }
  initGeminiVault();

  // Console helper — set/clear the Gemini key (stored encrypted, never in source)
  window.setGeminiKey = async (k) => {
    await saveGeminiKey(k || '');
    console.log(k ? 'Gemini-Key gespeichert (verschlüsselt)' : 'Gemini-Key entfernt');
  };

  // ===== DeepSeek auth — same scheme as labai.html =====
  // The AES-encrypted DeepSeek API key. Same blob as labai.html — unlocked with the
  // same password. localStorage.dev_access (set by labai login) auto-unlocks here.
  const DS_ENCRYPTED_KEY = "U2FsdGVkX18xMjM0NTY3OF0Uf+jzF9gByhGWIdT4T2fU3spB2Qdhpje6i/EbkuiEknQzonQJGrEVmzraOCZTng==";
  let cachedDsKey = null;

  function dsAesDecrypt(encryptedText, pwd) {
    try {
      if (!window.CryptoJS) return "";
      const bytes = CryptoJS.AES.decrypt(encryptedText, pwd);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) { return ""; }
  }
  function tryUnlockDsKey() {
    const pwd = localStorage.getItem('dev_access');
    if (!pwd) { dbg('[DS] no dev_access stored yet'); return false; }
    const plain = dsAesDecrypt(DS_ENCRYPTED_KEY, pwd);
    if (plain && plain.startsWith('sk-')) {
      cachedDsKey = plain;
      dbg('[DS] key unlocked from stored password');
      return true;
    }
    dbg('[DS] stored password could not decrypt key — clearing');
    localStorage.removeItem('dev_access');
    return false;
  }
  // Interactive unlock — prompts for password, saves on success.
  // Called from startTutor when no key is cached yet.
  function tryUnlockDsKeyInteractive() {
    if (cachedDsKey) return true;
    if (!window.CryptoJS) { dbg('[DS] CryptoJS not ready yet'); return false; }
    if (tryUnlockDsKey()) return true; // try stored first
    const pwd = window.prompt('Passwort für Khwārizmī (DeepSeek-Tutor):');
    if (!pwd) { dbg('[DS] user cancelled password prompt'); return false; }
    const plain = dsAesDecrypt(DS_ENCRYPTED_KEY, pwd);
    if (plain && plain.startsWith('sk-')) {
      localStorage.setItem('dev_access', pwd);
      cachedDsKey = plain;
      dbg('[DS] key unlocked via prompt — saved for future sessions');
      return true;
    }
    dbg('[DS] prompt password failed to decrypt key');
    alert('Passwort hat nicht gepasst.');
    return false;
  }
  // Wait for CryptoJS (loaded from CDN) before first unlock attempt
  if (window.CryptoJS) tryUnlockDsKey();
  else {
    let tries = 0;
    const wait = setInterval(() => {
      if (window.CryptoJS || ++tries > 50) {
        clearInterval(wait);
        if (window.CryptoJS) tryUnlockDsKey();
        else dbg('[DS] CryptoJS failed to load');
      }
    }, 100);
  }
  function dsKey() {
    if (!cachedDsKey && window.CryptoJS) tryUnlockDsKey();
    return cachedDsKey;
  }

  // Manual override (DevTools console): setDeepSeekKey('sk-...')
  window.setDeepSeekKey = (k) => {
    cachedDsKey = (k && k.startsWith('sk-')) ? k : null;
    dbg('[DS] manual key ' + (cachedDsKey ? 'set' : 'cleared'));
  };

  // ===== DeepSeek chat =====
  // ===== Gemini chat (reuses the Google Cloud key from the vault) =====
  async function geminiJSON(systemPrompt, userPayload) {
    const key = gemKey();
    if (!key) { dbg('[Gemini] geminiJSON: no Gemini key (run setGeminiKey in console)'); return null; }
    try {
      const model = localStorage.getItem('gemini_model') || 'gemini-2.5-flash';
      dbg('[Gemini] request model=' + model);
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(key);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(userPayload) }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.8,
            maxOutputTokens: 400
          }
        })
      });
      if (!res.ok) {
        const body = await res.text();
        dbg('[Gemini] error ' + res.status + ': ' + body.slice(0, 300));
        return null;
      }
      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) { dbg('[Gemini] empty content'); return null; }
      try {
        const parsed = JSON.parse(content);
        dbg('[Gemini] ok: ' + (parsed.feedback || '').slice(0, 60));
        return parsed;
      } catch (e) {
        const m = content.match(/\{[\s\S]*\}/);
        if (m) { try { return JSON.parse(m[0]); } catch (e2) {} }
        dbg('[Gemini] JSON parse failed: ' + content.slice(0, 120));
        return null;
      }
    } catch (e) {
      dbg('[Gemini] fetch failed: ' + (e?.message || e));
      return null;
    }
  }

  async function deepseekJSON(systemPrompt, userPayload) {
    const key = dsKey();
    if (!key) { dbg('[DS] deepseekJSON: no key, returning null'); return null; }
    try {
      const model = localStorage.getItem('ai_model') || 'deepseek-v4-flash';
      dbg('[DS] request model=' + model);
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(userPayload) }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.8,
          max_tokens: 400
        })
      });
      if (!res.ok) {
        const body = await res.text();
        dbg('[DS] error ' + res.status + ': ' + body.slice(0, 300));
        return null;
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) { dbg('[DS] empty content'); return null; }
      try {
        const parsed = JSON.parse(content);
        dbg('[DS] ok: ' + (parsed.feedback || '').slice(0, 60));
        return parsed;
      } catch (e) {
        // Fuzzy extract first {...} block
        const m = content.match(/\{[\s\S]*\}/);
        if (m) {
          try { return JSON.parse(m[0]); } catch (e2) {}
        }
        dbg('[DS] JSON parse failed: ' + content.slice(0, 120));
        return null;
      }
    } catch (e) {
      dbg('[DS] fetch failed: ' + (e?.message || e));
      return null;
    }
  }

  // ===== Tutor: persona, problem generator, math =====
  const KHWARIZMI_SYSTEM = `Du bist Al-Khwārizmī, ein weiser, ruhiger Mathematiker aus Bagdad im 9. Jahrhundert. Du übst mit einem Kind in Klasse 5–6 das Finden des kleinsten gemeinsamen Vielfachen (kgV). Deine Sprache ist warm, kindgerecht und ermutigend. Du verrätst NIEMALS die Antwort direkt — bei falscher Antwort gibst du einen behutsamen Hinweis.

Du bekommst pro Schritt einen JSON-Kontext und antwortest AUSSCHLIESSLICH mit gültigem JSON nach diesem Schema:
{
  "feedback": "1–2 kurze Sätze Deutsch, kindgerecht. Du darfst *Wort* für Betonung und [break:0.5s] für Pausen nutzen — sparsam.",
  "celebrate": true | false,
  "difficulty_change": "easier" | "same" | "harder"
}

Regeln:
- MATHE-FAKTEN — RECHNE NIEMALS SELBST: Du bekommst geprüfte Wahrheitswerte: a_passt, b_passt, beide_passen, ist_kgv, antwort_zu_gross, antwort_zu_klein. Stütze JEDE Aussage NUR auf diese Werte. Behaupte NIEMALS, dass beide Zahlen "reinpassen", wenn beide_passen=false. Wenn nur a_passt (b_passt=false): sag, dass die andere Zahl noch NICHT hineingeht — und umgekehrt. Wenn beide_passen=true, aber ist_kgv=false: lobe, dass beide reinpassen, und frage nach einer KLEINEREN Zahl. Verrate nie die Lösung.
- Bei korrekter Antwort beim 1. Versuch: feedback *begeistert* und feiernd, celebrate=true, difficulty_change="harder".
- BEGEISTERUNG & VIELFALT: Starte fast immer mit einem coolen, mitreißenden Ausruf — variiere ihn STARK und wiederhole dich nie ("Bingo!", "Ausgezeichnet!", "Krass!", "Volltreffer!", "Wahnsinn!", "Glasklar!", "Boom!", "Wunderbar!", "Stark!", …). Sei energiegeladen wie ein begeisterter Trainer, nicht steif. Manchmal auch mal ganz ohne Ausruf, damit es echt bleibt.
- Bei korrekter Antwort nach mehreren Versuchen: feedback ermutigend, celebrate=false, difficulty_change="same".
- Bei falscher Antwort: behutsam, einen klitzekleinen Hinweis (z.B. "passt 8 wirklich? Schau ob 4 da reingeht"), celebrate=false, difficulty_change="same".
- Bei mehrfach falsch (≥3 Versuche): wärmer, leichter machen, difficulty_change="easier".
- Sprich das Kind als "du" an. Niemals "Sie".
- Erwähne *keine* anderen Mathebegriffe (kein "Vielfaches", kein "Faktor") — nutze "passt rein", "teilt sich auf", "Takt", "Stück".`;

  function gcdN(a, b) { return b ? gcdN(b, a % b) : a; }
  function lcmN(a, b) { return a * b / gcdN(a, b); }

  // Problem pools by difficulty
  const PROBLEM_POOLS = {
    1: [[2,4],[2,6],[3,6],[3,9],[4,8],[2,8],[4,12]],            // a teilt b
    2: [[2,3],[2,5],[3,4],[3,5],[3,7],[4,5],[4,7],[5,6],[5,7]], // teilerfremd
    3: [[4,6],[6,8],[6,9],[8,12],[9,12],[10,12],[6,10],[8,10]], // echtes kgV-Rätsel
    4: [[11,3],[11,4],[11,6],[7,8],[7,9],[8,9],[12,18],[14,21],[15,20],[9,15]], // Experte (freiwillig)
  };

  // Fraction add/subtract pools (unit fractions 1/a ± 1/b). Pairs get ordered a<b on use.
  const ADD_POOLS = {
    1: [[2,4],[3,6],[2,6],[2,8],[4,8],[3,9],[2,10]],            // a teilt b → denom = b
    2: [[2,3],[2,5],[3,4],[3,5],[4,5],[2,7],[3,7]],             // teilerfremd → denom = a·b
    3: [[4,6],[6,8],[6,9],[8,12],[9,12],[10,12],[6,10]],        // echtes kgV
  };
  const SUB_POOLS = {
    1: [[2,4],[3,6],[2,6],[2,8],[4,8],[3,9]],
    2: [[2,3],[2,5],[3,4],[3,5],[4,5],[2,7]],
    3: [[4,6],[6,8],[6,9],[8,12],[9,12],[10,12]],
  };

  // Tutor modes: kgV (find the lcm) · add · sub (numerator over the kgV denominator)
  let tutorMode = (() => {
    const m = localStorage.getItem('tutor_mode');
    return (m === 'add' || m === 'sub' || m === 'kgv') ? m : 'kgv';
  })();
  const MODES = {
    kgv: { label: 'kgV',   title: 'Suche den gemeinsamen Takt',  subtitle: 'Suche das kleinste gemeinsame Vielfache, das kgV', pools: PROBLEM_POOLS },
    add: { label: 'Plus',  title: 'Addiere die Brüche',          subtitle: 'Zähl die Stücke über dem gemeinsamen Takt',        pools: ADD_POOLS },
    sub: { label: 'Minus', title: 'Subtrahiere die Brüche',      subtitle: 'Wie viele Stücke bleiben über dem Takt?',          pools: SUB_POOLS },
  };

  // ===== Level as a worked-through set: shuffle the pool, present each pair once, no repeats =====
  // Fisher–Yates shuffle on a copy.
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Load a fresh shuffled bag for the given level (from the current mode's pools).
  // Levels 1–3 exist for every mode; level 4 (Experte) only for kgV.
  function loadLevelBag(difficulty) {
    const pools = MODES[tutorMode].pools;
    let lvl = Math.max(1, Math.min(4, difficulty | 0));
    if (!pools[lvl]) lvl = 3;
    tutorState.difficulty = lvl;
    tutorState.bag = shuffled(pools[lvl]);
    tutorState.levelTotal = pools[lvl].length;   // for the "k/N" progress in the label
  }

  // Pop the next problem from the current bag (each pair appears once per level).
  function nextProblemFromBag() {
    const pair = tutorState.bag.shift();
    const lvl = tutorState.difficulty;
    if (tutorMode === 'kgv') {
      let a = pair[0], b = pair[1];
      // Level 1 (a teilt b → kgV = b): randomly put the small number second so the answer
      // isn't predictably "the bigger/second number". The kgV is order-independent.
      if (lvl === 1 && Math.random() < 0.5) { const t = a; a = b; b = t; }
      return { mode: 'kgv', a, b, answer: lcmN(a, b), difficulty: lvl };
    }
    // add/sub: order a<b so 1/a > 1/b (subtraction stays positive), denom = kgV
    const a = Math.min(pair[0], pair[1]), b = Math.max(pair[0], pair[1]);
    const L = lcmN(a, b), na = L / a, nb = L / b;
    const answer = tutorMode === 'add' ? (na + nb) : (na - nb);  // numerator over L
    return { mode: tutorMode, a, b, den: L, answer, difficulty: lvl };
  }

  const tutorState = {
    difficulty: 1,
    currentProblem: null,
    bag: [],              // remaining problems in the current level (shuffled, each popped once)
    attempts: 0,
    history: [],
    masteredTop: false,   // fire the level-3 mastery praise only once
  };

  // Central pool of cool exclamations for correct answers (offline path).
  // Source of truth — also documented in HTML/glocken-tutor-lob.md.
  const COOL_EXCLAIMS = [
    "Genau!", "Stark!", "Wunderbar!", "Ausgezeichnet!", "Bingo!", "Crazy!",
    "Das ist krass!", "Krass!", "Bravo!", "Glasklar!", "Volltreffer!", "Perfekt!",
    "Sauber!", "Das sitzt!", "Meisterhaft!", "Brillant!", "Punktgenau!", "Klasse!",
    "Goldrichtig!", "Treffer!", "Da ist es!", "Mächtig gut!", "Wie eine Glocke!",
    "Boom!", "Yes!", "Stimmt haargenau!", "Saubere Arbeit!", "Stark gerechnet!"
  ];

  // Fact-aware offline feedback. Takes the same payload as the AI (with verified
  // divisibility facts), so its hints are always mathematically correct.
  function offlineFeedback(payload) {
    const a = payload.a, b = payload.b, kgv = payload.correct_answer;
    const attempts = payload.attempts, correct = payload.correct;
    const aFits = payload.a_passt, bFits = payload.b_passt, bothFit = payload.beide_passen;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    if (correct && attempts === 1) {
      const body = pick([
        "Du hast das *im Takt* gefunden.",
        "Die *" + kgv + "* ist genau richtig.",
        "*Genau* so.",
        "Beim ersten Anlauf — *sauber* gerechnet.",
        "Du hast den gemeinsamen Takt sofort gehört.",
        "Glatt durchgerechnet."
      ]);
      return { feedback: pick(COOL_EXCLAIMS) + " [break:0.4s] " + body,
               celebrate: true, difficulty_change: 'harder' };
    }
    if (correct) {
      const body = pick([
        "Da steckte etwas Knobelei drin.",
        "Manchmal braucht es ein paar Anläufe.",
        "Schön ruhig gerechnet.",
        "Mehr Arbeit als sonst — aber *sitzt*.",
        "Drangeblieben und gekriegt."
      ]);
      return { feedback: pick(COOL_EXCLAIMS) + " [break:0.4s] " + body,
               celebrate: false, difficulty_change: 'same' };
    }
    // ---- wrong answer: hints based on the verified facts ----
    if (bothFit) {   // a common multiple — just not the smallest
      return { feedback: pick([
        "Fast! [break:0.4s] In deine Zahl passen *beide* schon rein — aber es geht noch *kleiner*. Such die *kleinste*, die beide mögen.",
        "Gut gedacht — *beide* passen rein! [break:0.4s] Aber es gibt eine *kleinere*, die auch beide mag. Welche?"
      ]), celebrate: false, difficulty_change: 'same' };
    }
    if (aFits || bFits) {   // exactly one fits → name the one that doesn't
      const missing = aFits ? b : a;
      return { feedback: pick([
        "Leider noch nicht. [break:0.4s] Die *" + missing + "* geht noch nicht *auf* in deiner Zahl.",
        "Knapp! [break:0.4s] Prüf die *" + missing + "* — die passt noch nicht genau hinein."
      ]), celebrate: false, difficulty_change: 'same' };
    }
    if (attempts >= 3) {   // neither fits, struggling → concrete strategy
      return { feedback: pick([
        "Noch nicht — bleib dran. [break:0.5s] Geh die *" + b + "* in Schritten durch: " + b + ", " + (b*2) + ", " + (b*3) + " … und schau, welche davon sich auch in *" + a + "*er-Schritten treffen lässt.",
        "Fast. [break:0.5s] Nimm die größere Zahl Schritt für Schritt — passt die *" + a + "* an einer dieser Stellen auch genau hinein?"
      ]), celebrate: false, difficulty_change: 'same' };
    }
    return { feedback: pick([   // neither fits, early tries
      "Leider noch nicht. [break:0.4s] In deine Zahl muss *jede* der beiden ganz hineinpassen — noch passt keine.",
      "Leider daneben. [break:0.4s] Geht die *" + a + "* rein? Und die *" + b + "*? Noch passt keine ganz."
    ]), celebrate: false, difficulty_change: 'same' };
  }

  // Local, math-correct feedback for the add/subtract modes (na, nb = pieces over the kgV).
  function fractionFeedback(p, guess, correct, attempts) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const na = p.den / p.a, nb = p.den / p.b;
    const verb = p.mode === 'add' ? 'zusammenzählen' : 'abziehen';
    const opWord = p.mode === 'add' ? 'plus' : 'minus';
    if (correct && attempts === 1) {
      return { feedback: pick(COOL_EXCLAIMS) + " [break:0.4s] " + pick([
        "Genau über dem Takt *" + p.den + "* gerechnet.",
        "Die Stücke sauber " + (p.mode === 'add' ? 'zusammengezählt' : 'abgezogen') + ".",
        "*Genau* so."
      ]) };
    }
    if (correct) {
      return { feedback: pick(COOL_EXCLAIMS) + " [break:0.4s] " + pick([
        "Hat etwas gedauert — aber *sitzt*.",
        "Drangeblieben und gekriegt."
      ]) };
    }
    if (attempts < 3) {
      return { feedback: pick([
        "Leider noch nicht. [break:0.4s] Bring beide auf den Takt *" + p.den + "*: der erste Bruch sind *" + na + "* Stücke, der zweite *" + nb + "*. Dann " + verb + ".",
        (guess > p.answer ? "Etwas *zu viel*. " : "Etwas *zu wenig*. ") + "[break:0.3s] Zähl die Stücke nochmal: *" + na + "* " + opWord + " *" + nb + "*."
      ]) };
    }
    return { feedback: "Schau: *" + na + "* " + opWord + " *" + nb + "* Stücke — über dem Takt *" + p.den + "*. [break:0.3s] Wie viele sind das?" };
  }

  // ===== Level milestones: rank + praise + bell fanfare when a level is cleared =====
  const TUTOR_RANKS = { 1: 'Lehrling', 2: 'Rechner', 3: 'Meister von Bagdad', 4: 'Experte' };
  // Spoken when the child CLEARS a level (advances past it, or masters level 3).
  // Process praise (names the strategy), not ability praise — and elevates into the craft.
  const LEVEL_PRAISE = {
    1: "Du hast etwas Feines gesehen: [break:0.4s] wenn die kleinere Zahl schon *in* der größeren steckt, ist die größere bereits das kgV. [break:0.5s] Das erkennen viele Erwachsene nicht so schnell wie du gerade. [break:0.4s] Auf zu schwereren Glocken.",
    2: "Stark. [break:0.4s] Diese beiden hatten *keinen* gemeinsamen Teiler — also musstest du sie multiplizieren, um den Takt zu finden. [break:0.5s] Du hast es ohne Umweg gerechnet. [break:0.4s] So arbeiten Zahlentheoretiker.",
    3: "Das war die Königsklasse: [break:0.4s] gemeinsame Teiler herauskürzen und trotzdem das *kleinste* Vielfache treffen. [break:0.5s] Genau diese Idee brauchst du später beim Brüche-Addieren — [break:0.4s] du beherrschst sie jetzt schon. [break:0.5s] Meister.",
    4: "Die Experten-Glocken — geknackt. [break:0.4s] Das waren kgVs, die man nicht *sieht*, sondern *erarbeiten* muss: große Primzahlen und versteckte gemeinsame Teiler. [break:0.5s] Hut ab, *Experte*.",
  };

  // Triumphant fanfare via the central bell engine: a rising C-major run that
  // resolves into a held triad ("ta-daa"). Returns the total duration in ms.
  function celebrateChord() {
    if (!voiceEnabled) return 0;          // speaker off → silent; the visual pulse still runs
    const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.50;
    const run = [C5, E5, G5];             // ascending run
    const step = 150;
    run.forEach((f, i) => setTimeout(() => bellTone(f, 0.8), i * step));
    // Resolution: full triad struck together, held long
    const chordAt = run.length * step;    // = 450 ms
    const chordDur = 1.8;
    [C5, E5, G5, C6].forEach(f => setTimeout(() => bellTone(f, chordDur), chordAt));
    return chordAt + chordDur * 1000;     // ≈ 2250 ms
  }

  // Fired once a level is cleared: fanfare → (wait it out) → rank pulse + spoken praise.
  async function celebrateLevel(clearedLevel, newDifficulty, repeatTop) {
    const fanfareMs = celebrateChord();
    tutorLevelEl.textContent = 'Level ' + newDifficulty + ' · ' + (TUTOR_RANKS[newDifficulty] || TUTOR_RANKS[3]);
    tutorLevelEl.classList.add('rank-up');
    // Let the fanfare ring out before Khwārizmī speaks (don't talk over it).
    if (fanfareMs) await new Promise(r => setTimeout(r, fanfareMs + 150));
    let praise;
    if (repeatTop) {
      praise = "Wieder das ganze Set gemeistert. [break:0.4s] Du hältst dein Niveau, *Meister*.";
    } else if (tutorMode === 'kgv') {
      praise = LEVEL_PRAISE[clearedLevel];
    } else {
      // generic praise for the add/subtract sets
      const what = tutorMode === 'add' ? 'addiert' : 'subtrahiert';
      praise = "Ein ganzes Set sauber " + what + "! [break:0.4s] Du findest den gemeinsamen Takt und rechnest *darüber* — genau so geht's.";
    }
    await setTutorBubble(praise);
    tutorLevelEl.classList.remove('rank-up');
  }

  // ===== Tutor AI provider (switchable: Gemini ↔ DeepSeek; choice persists) =====
  const AI_PROVIDERS = {
    gemini: { label: 'Gemini',   call: geminiJSON },
    ds:     { label: 'DeepSeek', call: deepseekJSON },
  };
  function aiProvider() {
    const p = localStorage.getItem('tutor_ai_provider');
    return AI_PROVIDERS[p] ? p : 'gemini';   // default Gemini
  }
  function setAiProvider(p) {
    if (!AI_PROVIDERS[p]) return;
    localStorage.setItem('tutor_ai_provider', p);
    refreshAiToggle();
  }

  async function askKhwarizmi(payload) {
    const provider = AI_PROVIDERS[aiProvider()];
    const result = await provider.call(KHWARIZMI_SYSTEM, payload);
    if (result && typeof result.feedback === 'string') return result;
    // Fallback offline (also covers: provider has no key / API disabled / network error)
    return offlineFeedback(payload);
  }

  // ===== Tutor flow =====
  const tutorOverlay = document.getElementById('tutor-overlay');
  const tutorBubble  = document.getElementById('tutor-bubble');
  const tutorLevelEl = document.getElementById('tutor-level');
  const tutorAEl     = document.getElementById('tutor-a');
  const tutorBEl     = document.getElementById('tutor-b');
  const tutorInput   = document.getElementById('tutor-input');
  const tutorSubmit  = document.getElementById('tutor-submit');
  const tutorHint    = document.getElementById('tutor-hint');
  const tutorExit    = document.getElementById('tutor-exit');
  const tutorAiToggle = document.getElementById('tutor-ai-toggle');
  const tutorAiName   = document.getElementById('tutor-ai-name');
  const tutorVoiceToggle = document.getElementById('tutor-voice-toggle');
  const tutorVoiceName   = document.getElementById('tutor-voice-name');
  const cornerToggles    = document.querySelector('.tutor-corner-toggles');
  let lastTutorSpeech = '';   // last text spoken — re-spoken when the voice is switched

  // Voice + AI pills are shown ONLY on the start (intro) screen.
  function showCornerToggles(visible) {
    if (cornerToggles) cornerToggles.classList.toggle('hidden', !visible);
  }

  function refreshAiToggle() {
    if (tutorAiName) tutorAiName.textContent = AI_PROVIDERS[aiProvider()].label;
  }

  // Voice toggle: two German Google voices, choice persists in gctt_voice
  const VOICE_MALE   = 'de-DE-Neural2-B';   // Khwārizmī default
  const VOICE_FEMALE = 'de-DE-Neural2-F';
  function voiceIsFemale() { return gVoice() === VOICE_FEMALE; }
  function refreshVoiceToggle() {
    if (tutorVoiceName) tutorVoiceName.textContent = voiceIsFemale() ? 'Frau al-Khwārizmī' : 'Herr al-Khwārizmī';
  }

  function setTutorBubble(text) {
    // No setTimeout — keep speak() inside the user-gesture transient activation window
    lastTutorSpeech = text;
    tutorBubble.style.opacity = '0';
    tutorBubble.textContent = stripMarkers(text);
    requestAnimationFrame(() => { tutorBubble.style.opacity = '1'; });
    dbg('[tutor] setTutorBubble → speak', { voiceEnabled, hasKey: !!gKey(), len: text.length });
    return speak(text);
  }

  // The spoken/displayed question for the current problem (mode-aware).
  function problemPrompt(p) {
    if (p.mode === 'add')
      return "Addiere die beiden Brüche. [break:0.3s] Welche Zahl kommt oben über die *" + p.den + "*?";
    if (p.mode === 'sub')
      return "Zieh ab. [break:0.3s] Welche Zahl bleibt oben über der *" + p.den + "*?";
    return "Was ist der gemeinsame Takt von *" + p.a + "* und *" + p.b + "*?";
  }

  // Render the problem expression into #tutor-problem: a kgV question, or a fraction sum/difference.
  function renderProblem(p) {
    const el = document.getElementById('tutor-problem');
    if (!el) return;
    if (p.mode === 'add' || p.mode === 'sub') {
      const op = p.mode === 'add' ? '+' : '−';
      el.innerHTML =
        '<span class="frac"><span class="num">1</span><span class="den color-small">' + p.a + '</span></span>' +
        '<span class="op">' + op + '</span>' +
        '<span class="frac"><span class="num">1</span><span class="den color-big">' + p.b + '</span></span>' +
        '<span class="tutor-eq">=</span>' +
        '<span class="frac"><span class="num tutor-answer" id="tutor-answer">?</span><span class="den color-meet">' + p.den + '</span></span>';
    } else {
      // colour follows magnitude: smaller orange, bigger red
      const colA = p.a < p.b ? 'var(--orange)' : 'var(--red)';
      const colB = p.b < p.a ? 'var(--orange)' : 'var(--red)';
      el.innerHTML =
        '<span class="tutor-kgv">kgV</span>' +
        '<span>von</span>' +
        '<span class="tutor-a" style="color:' + colA + '">' + p.a + '</span>' +
        '<span>und</span>' +
        '<span class="tutor-b" style="color:' + colB + '">' + p.b + '</span>' +
        '<span class="tutor-eq">=</span>' +
        '<span class="tutor-answer" id="tutor-answer">?</span>';
    }
  }

  function showProblem(p, intro) {
    hideTutorTimeline();
    hideFunQuiz();                     // a real problem is showing → no quiz panel
    tutorState.pendingNext = null;     // clear any "Weiter" state
    if (tutorSubmit) tutorSubmit.textContent = 'Prüfen';
    tutorState.currentProblem = p;
    tutorState.attempts = 0;
    renderProblem(p);
    const meta = MODES[p.mode] || MODES.kgv;
    const titleEl = document.querySelector('.tutor-title');
    const subEl   = document.querySelector('.tutor-subtitle');
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl)   subEl.textContent   = meta.subtitle;
    const total = tutorState.levelTotal || 0;
    const nr = total ? (total - tutorState.bag.length) : 0;   // current problem number within the level
    tutorLevelEl.textContent = 'Level ' + p.difficulty + ' · ' + (TUTOR_RANKS[p.difficulty] || TUTOR_RANKS[1])
      + (total ? ' · ' + nr + '/' + total : '');
    tutorInput.value = '';
    tutorInput.style.opacity = '1';
    tutorInput.classList.remove('shake', 'celebrate');
    // Always describe the new problem in the bubble (with an optional intro for the very first)
    setTutorBubble((intro ? intro + " [break:0.5s] " : "") + problemPrompt(p));
    setTimeout(() => tutorInput.focus(), 200);
  }

  let tutorReturnTo = 'end';
  async function startTutor(from) {
    dbg('[tutor] startTutor', { from, voiceEnabled, hasKey: !!gKey(), ctxState: ctx?.state });
    stopAllAudio();
    audio();
    // Ask for DS password once (saved to localStorage; future sessions auto-unlock)
    if (!cachedDsKey) tryUnlockDsKeyInteractive();
    dbg('[tutor] after audio()', { ctxState: ctx?.state, dsReady: !!cachedDsKey });
    if ('speechSynthesis' in window) {
      try {
        const prime = new SpeechSynthesisUtterance(' ');
        prime.volume = 0;
        speechSynthesis.speak(prime);
      } catch (e) {}
    }
    tutorReturnTo = from || 'end';
    showCornerToggles(false);   // tutor is not the start screen → hide the pills
    document.getElementById('end-overlay').classList.add('hidden');
    tutorOverlay.classList.remove('hidden');
    document.body.classList.add('tutor-open');
    hideTutorComplete();               // clear any leftover completion panel
    tutorState.history = [];
    tutorState.masteredTop = false;
    loadLevelBag(1);                   // sets difficulty = 1 and fills the shuffled bag
    refreshModeUI();                   // highlight the active mode pill
    const p = nextProblemFromBag();
    // Warm-up giggle: one silly multiple-choice question, then into the real practice.
    showFunQuiz(() => showProblem(p, "Lass uns *üben*!"));
  }

  function exitTutor() {
    stopAllAudio();
    hideTutorTimeline();
    tutorOverlay.classList.add('hidden');
    document.body.classList.remove('tutor-open');
    if (tutorReturnTo === 'end') {
      document.getElementById('end-overlay').classList.remove('hidden');
    } else {
      // Returning to the still-visible intro (start screen) → bring the pills back
      showCornerToggles(true);
    }
  }

  // ===== Tutor: replay the story timeline for the just-solved pair =====
  // Reuses the existing engine (setRound / runTimeline / highlightMeeting). The single
  // #timeline-wrap node is moved between the equation and the button row on first use.
  let _tlScrollRAF = 0;
  function mountTimelineInTutor() {
    const wrap = document.getElementById('timeline-wrap');
    const row  = tutorOverlay.querySelector('.tutor-input-row');
    if (wrap && row && wrap.nextElementSibling !== row) {
      row.parentNode.insertBefore(wrap, row);   // sits between .tutor-problem and the buttons
    }
    return wrap;
  }
  // Size the timeline so 17 units fill the box; beyond that it overflows and scrolls.
  function sizeTutorTimeline(wrap) {
    const inner = Math.max(120, wrap.clientWidth - 28);   // minus 14px padding each side
    const contentW = Math.round(state.tEnd * (inner / 17));
    const els = [document.getElementById('timeline'),
                 document.getElementById('axis-labels'),
                 wrap.querySelector('.meeting-row')];
    if (contentW > inner) {                               // > 17 units → fixed spacing, scrolls
      els.forEach(el => { if (el) el.style.width = contentW + 'px'; });
      wrap.style.overflow = 'hidden';                     // both axes: no bars — we scroll x via JS
      return true;
    }
    els.forEach(el => { if (el) el.style.width = ''; });  // fits → fill the box, no scroll
    wrap.style.overflow = 'hidden';
    return false;
  }
  // During playback keep the cursor (and the meeting point) in view by scrolling left.
  function followCursor(wrap) {
    cancelAnimationFrame(_tlScrollRAF);
    const step = () => {
      const cx = parseFloat(cursor.style.left) || 0;
      wrap.scrollLeft = Math.max(0, cx - wrap.clientWidth * 0.55);
      _tlScrollRAF = requestAnimationFrame(step);
    };
    _tlScrollRAF = requestAnimationFrame(step);
  }
  function hideTutorTimeline() {
    cancelAnimationFrame(_tlScrollRAF);
    const wrap = document.getElementById('timeline-wrap');
    if (wrap) { wrap.classList.add('hidden'); wrap.style.overflow = 'hidden'; wrap.scrollLeft = 0; }
  }
  function playTutorTimeline(a, b) {
    return new Promise((resolve) => {
      const wrap = mountTimelineInTutor();
      if (!wrap) { resolve(); return; }
      // Pass ordered (small, big) so the bigger number is always the red "big" rhythm,
      // regardless of how the equation displays them.
      setRound(Math.min(a, b), Math.max(a, b), 'kgV von ' + a + ' und ' + b);
      state.tEnd = state.L + 1;        // end the axis right after the kgV → meeting sits at the right edge
      wrap.classList.remove('hidden');
      wrap.scrollLeft = 0;
      const scrolls = sizeTutorTimeline(wrap);
      if (scrolls) followCursor(wrap);
      const durationMs = Math.min(9000, Math.max(6000, state.tEnd * 320));   // slower than the story's 4.2s
      runTimeline(() => {
        highlightMeeting();
        cursor.style.opacity = '0';   // hide the runner at the end (the meeting is marked)
        cancelAnimationFrame(_tlScrollRAF);
        if (scrolls) {
          const meetX = (state.L / state.tEnd) * document.getElementById('timeline').clientWidth;
          wrap.scrollTo({ left: Math.max(0, meetX - wrap.clientWidth * 0.5), behavior: 'smooth' });
        }
        setTimeout(resolve, 1000);   // brief settle on the meeting point, then wait for "Weiter"
      }, durationMs);
    });
  }

  let _tutorAdvancing = false;   // true while a correct answer's timeline plays → block re-entry
  async function submitTutorAnswer() {
    if (_tutorAdvancing) return;
    // "Weiter" state: a correct answer is on screen with the timeline standing → advance now.
    if (tutorState.pendingNext) {
      showProblem(tutorState.pendingNext);   // showProblem resets pendingNext + button text
      return;
    }
    const raw = tutorInput.value.trim();
    if (!raw) { tutorInput.focus(); return; }
    const guess = parseInt(raw, 10);
    if (Number.isNaN(guess) || guess < 1) {
      tutorInput.classList.add('shake');
      setTimeout(() => tutorInput.classList.remove('shake'), 500);
      return;
    }
    const p = tutorState.currentProblem;
    tutorState.attempts++;
    const correct = guess === p.answer;

    if (correct) {
      tutorInput.classList.add('celebrate');
      const ansEl = document.getElementById('tutor-answer');
      if (ansEl) { ansEl.textContent = p.answer; ansEl.classList.add('correct'); }
    } else {
      tutorInput.classList.add('shake');
      setTimeout(() => tutorInput.classList.remove('shake'), 500);
    }

    // Feedback: fraction modes use local (math-correct) feedback; kgV uses Khwārizmī (AI + offline)
    tutorSubmit.disabled = true;
    let reaction;
    if (p.mode === 'add' || p.mode === 'sub') {
      reaction = fractionFeedback(p, guess, correct, tutorState.attempts);
    } else {
      // Locally verified facts — the AI must NOT do its own arithmetic (it gets these wrong)
      const aFits = guess % p.a === 0;
      const bFits = guess % p.b === 0;
      reaction = await askKhwarizmi({
        a: p.a,
        b: p.b,
        correct_answer: p.answer,
        user_answer: guess,
        attempts: tutorState.attempts,
        difficulty: tutorState.difficulty,
        correct: correct,
        // Verified facts (do not recompute):
        a_passt: aFits,                 // does a divide the guess?
        b_passt: bFits,                 // does b divide the guess?
        beide_passen: aFits && bFits,   // is the guess a common multiple at all?
        ist_kgv: correct,
        antwort_zu_gross: guess > p.answer,
        antwort_zu_klein: guess < p.answer,
      });
    }
    tutorSubmit.disabled = false;

    setTutorBubble(reaction.feedback);

    if (correct) {
      // The current pair was popped from the bag when shown → it won't repeat this level.
      tutorState.history.push({ a: p.a, b: p.b, attempts: tutorState.attempts });
      _tutorAdvancing = true;
      tutorSubmit.disabled = true;
      // Replay the timeline for this pair, THEN move on.
      await playTutorTimeline(p.a, p.b);
      // Bag empty → the whole level set is worked through.
      if (tutorState.bag.length === 0) {
        const clearedLevel = tutorState.difficulty;
        if (clearedLevel >= 3) {
          // Level 3 (or Experte/4) finished → fanfare + completion screen, NO endless reshuffle.
          await celebrateLevel(clearedLevel, clearedLevel, false);
          showTutorComplete(clearedLevel);
          tutorSubmit.disabled = false;
          _tutorAdvancing = false;
          return;
        }
        await celebrateLevel(clearedLevel, clearedLevel + 1, false);
        loadLevelBag(clearedLevel + 1);
      }
      // Don't auto-advance — leave the timeline standing; the next problem waits for "Weiter".
      tutorState.pendingNext = nextProblemFromBag();
      tutorSubmit.textContent = 'Weiter';
      tutorSubmit.disabled = false;
      _tutorAdvancing = false;
    } else {
      // Wrong → keep the SAME problem (it stays out of the bag until solved); retry with a hint
      tutorInput.style.transition = 'opacity 0.35s ease';
      tutorInput.style.opacity = '0';
      setTimeout(() => {
        tutorInput.value = '';
        tutorInput.style.opacity = '1';
        tutorInput.focus();
      }, 360);
    }
  }

  tutorSubmit.addEventListener('click', submitTutorAnswer);
  tutorInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitTutorAnswer(); }
  });

  // Hint: a strategy tip for the current problem — never reveals the answer
  function hintForProblem(p) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    if (p.mode === 'add' || p.mode === 'sub') {
      const na = p.den / p.a, nb = p.den / p.b;
      const verb = p.mode === 'add' ? 'zähl sie zusammen' : 'zieh sie ab';
      return "Tipp: [break:0.3s] Bring beide auf den Takt *" + p.den + "*. Der erste Bruch sind *" + na + "* Stücke, der zweite *" + nb + "* — dann " + verb + ".";
    }
    const lo = Math.min(p.a, p.b), hi = Math.max(p.a, p.b);
    return pick([
      "Tipp: [break:0.3s] Zähl die Vielfachen der *" + hi + "* — " + hi + ", " + (hi * 2) + ", " + (hi * 3) + " … [break:0.3s] welche davon lässt sich auch durch *" + lo + "* teilen?",
      "Tipp: [break:0.3s] Geh in *" + hi + "*er-Schritten und prüf jedes Mal: passt die *" + lo + "* auch genau hinein? Die erste, die klappt, ist das kgV.",
      "Tipp: [break:0.3s] Such die kleinste Zahl, in die *beide* — die *" + lo + "* und die *" + hi + "* — ganz ohne Rest hineinpassen."
    ]);
  }
  if (tutorHint) {
    tutorHint.addEventListener('click', () => {
      if (_tutorAdvancing) return;
      const p = tutorState.currentProblem;
      if (!p) return;
      setTutorBubble(hintForProblem(p));
      tutorInput.focus();
    });
  }

  // ===== Mode selector (kgV / Plus / Minus) =====
  function refreshModeUI() {
    document.querySelectorAll('.tutor-mode').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === tutorMode);
    });
  }
  function setTutorMode(m, intro) {
    if (!MODES[m]) return;
    if (_tutorAdvancing) return;
    hideTutorComplete();
    startLevel(m, 1, intro);
  }
  document.querySelectorAll('.tutor-mode').forEach(b => {
    b.addEventListener('click', () => setTutorMode(b.dataset.mode));
  });

  // Start a specific mode + level (used by mode switch and the completion screen's "Experte").
  function startLevel(mode, level, intro) {
    tutorMode = mode;
    try { localStorage.setItem('tutor_mode', mode); } catch (e) {}
    tutorState.history = [];
    tutorState.masteredTop = false;
    loadLevelBag(level);
    refreshModeUI();
    showProblem(nextProblemFromBag(), intro);
  }

  // ===== Debug: jump straight to any mode + level =====
  // Console:  gotoLevel('kgv', 3)   ·   URL:  glocken.html#kgv3  (kgv|add|sub, level 1–4)
  function gotoLevel(mode, level) {
    mode = MODES[mode] ? mode : 'kgv';
    level = Math.max(1, Math.min(4, parseInt(level, 10) || 1));
    if (tutorOverlay.classList.contains('hidden')) {
      stopAllAudio(); audio();
      const endOv = document.getElementById('end-overlay');
      if (endOv) endOv.classList.add('hidden');
      if (intro) { intro.style.display = 'none'; intro.classList.add('gone'); }
      introPhase = 'gone';
      showCornerToggles(false);
      tutorReturnTo = 'end';
      tutorOverlay.classList.remove('hidden');
    document.body.classList.add('tutor-open');
    }
    hideTutorComplete();
    startLevel(mode, level);
    dbg('[debug] gotoLevel ' + mode + ' · L' + level);
  }
  window.gotoLevel = gotoLevel;
  // React live to hash edits (#kgv3 etc.) — no reload needed
  window.addEventListener('hashchange', () => {
    if (/^#(start|intro|reset)$/.test(location.hash || '')) { location.reload(); return; }
    const m = (location.hash || '').match(/^#(kgv|add|sub)([1-4])$/);
    if (m) gotoLevel(m[1], parseInt(m[2], 10));
  });

  // ===== Completion screen (shown after Level 3 / Experte instead of endless reshuffle) =====
  function setProblemUIVisible(v) {
    const prob = document.getElementById('tutor-problem');
    const row  = tutorOverlay.querySelector('.tutor-input-row');
    if (prob) prob.style.display = v ? '' : 'none';
    if (row)  row.style.display  = v ? '' : 'none';
    if (tutorHint) tutorHint.style.display = v ? '' : 'none';
  }
  function hideTutorComplete() {
    const panel = document.getElementById('tutor-complete');
    if (panel) { panel.classList.add('hidden'); panel.innerHTML = ''; }
    setProblemUIVisible(true);
    if (tutorBubble) tutorBubble.style.display = '';
  }
  function showTutorComplete(clearedLevel, manual) {
    hideTutorTimeline();
    hideFunQuiz();
    setProblemUIVisible(false);
    if (tutorBubble) tutorBubble.style.display = 'none';   // no leftover question on the completion screen
    const expert = clearedLevel >= 4;
    const panel = document.getElementById('tutor-complete');
    if (!panel) return;
    let btns = '';
    if (tutorMode === 'kgv' && !expert) {
      btns += '<button class="tc-btn tc-expert" data-act="expert">Experte 🔥</button>';
    }
    ['kgv', 'add', 'sub'].forEach(m => {
      btns += '<button class="tc-btn" data-act="mode:' + m + '">' + MODES[m].label + '</button>';
    });
    btns += '<button class="tc-btn tc-ghost" data-act="exit">Fertig</button>';
    const title = manual ? 'Level beendet' : (expert ? 'Experte gemeistert! 🔥' : 'Geschafft! 🔔');
    const sub   = manual ? 'Weiter üben oder fertig?'
                         : (expert ? 'Du hast die harten kgVs geknackt.' : 'Alle drei Level durch — weiter üben?');
    panel.innerHTML =
      '<div class="tc-title">' + title + '</div>' +
      '<div class="tc-sub">' + sub + '</div>' +
      '<div class="tc-buttons">' + btns + '</div>';
    panel.classList.remove('hidden');
    panel.querySelectorAll('.tc-btn').forEach(b => b.addEventListener('click', () => {
      const act = b.dataset.act;
      hideTutorComplete();
      if (act === 'expert') startLevel('kgv', 4);
      else if (act === 'exit') exitTutor();
      else if (act.indexOf('mode:') === 0) setTutorMode(act.slice(5));
    }));
  }

  // ===== Spaß-Quiz (warm-up): silly multiple-choice questions to make kids giggle =====
  const FUN_QUIZ = [
    {
      q: "Was heißt eigentlich *kgV*?",
      options: ["das kleinste gemeinsame Vielfache", "kein großer Vogel", "kleiner gelber Flieger", "Karl grillt Vanillekipferl"],
      answer: 0,
      win: "Genau! [break:0.3s] Obwohl — ein *großer Vogel* wäre auch ziemlich lustig.",
      nope: "Haha! [break:0.3s] Schön wär's — aber nö."
    },
    {
      q: "Wofür steht das *V* im kgV?",
      options: ["Vielfaches", "Vampir", "Vanillepudding", "Vogelscheuche"],
      answer: 0,
      win: "Richtig — *Vielfaches*! [break:0.3s] Kein Vampir weit und breit.",
      nope: "Hihi, nein! [break:0.3s] Aber nett geraten."
    },
    {
      q: "Was ist das kgV von *2* und *3*?",
      options: ["6", "23", "ein Käsebrot", "5"],
      answer: 0,
      win: "Sechs! [break:0.3s] Das Käsebrot war eine fiese Falle.",
      nope: "Nope! [break:0.3s] Zähl nochmal — und nicht das Käsebrot nehmen."
    },
    {
      q: "Wie heißt unser Mathe-Held aus Bagdad?",
      options: ["al-Khwārizmī", "Käpt'n Glockenhose", "Sir Zahlissimo", "Bruchpilot Bruno"],
      answer: 0,
      win: "al-Khwārizmī! [break:0.3s] Von seinem Namen kommt das Wort *Algorithmus*.",
      nope: "Haha, leider nein — auch wenn Bruchpilot Bruno cool klingt."
    },
    {
      q: "Wann läuten zwei Glocken *gemeinsam*?",
      options: ["beim gemeinsamen Vielfachen", "wenn der Wecker klingelt", "wenn der Hund bellt", "nie, Glocken sind schüchtern"],
      answer: 0,
      win: "Genau! [break:0.3s] Schüchterne Glocken wären aber irgendwie süß.",
      nope: "Nö! [break:0.3s] Aber das mit den schüchternen Glocken merk ich mir."
    },
    {
      q: "Wie viele Beine hat ein Dreieck?",
      options: ["keine — es ist eine Form!", "drei", "dreieinhalb", "kommt auf die Laune an"],
      answer: 0,
      win: "Richtig — *keine*! [break:0.3s] Dreiecke können nämlich nicht weglaufen.",
      nope: "Hihi — ein Dreieck hat gar keine Beine!"
    },
    {
      q: "Was tust du, um das kgV zu finden?",
      options: ["zählen, bis beide Takte zusammenpassen", "ganz fest die Augen zudrücken", "die Glocken bestechen", "einen Pudding fragen"],
      answer: 0,
      win: "Genau! [break:0.3s] Pudding kann nämlich überhaupt nicht rechnen.",
      nope: "Hihi, nein! [break:0.3s] Der Pudding hilft dir da nicht."
    }
  ];

  function hideFunQuiz() {
    const panel = document.getElementById('tutor-quiz');
    if (panel) { panel.classList.add('hidden'); panel.innerHTML = ''; }
  }
  // One silly question as a warm-up; calls onDone() once answered correctly.
  function showFunQuiz(onDone) {
    const panel = document.getElementById('tutor-quiz');
    if (!panel) { onDone(); return; }
    setProblemUIVisible(false);   // hide problem/input/hint; the bubble carries the question + reactions
    hideTutorTimeline();
    const item = FUN_QUIZ[Math.floor(Math.random() * FUN_QUIZ.length)];
    const opts = shuffled(item.options.map((text, i) => ({ text, correct: i === item.answer })));
    panel.innerHTML = opts.map((o, i) =>
      '<button class="tc-btn tq-opt" data-i="' + i + '">' + o.text + '</button>').join('');
    panel.classList.remove('hidden');
    setTutorBubble(item.q);   // question shown in the bubble + spoken
    panel.querySelectorAll('.tq-opt').forEach((b, i) => {
      b.addEventListener('click', () => {
        if (b.disabled) return;
        if (opts[i].correct) {
          b.classList.add('tq-correct');
          panel.querySelectorAll('.tq-opt').forEach(x => x.disabled = true);
          setTutorBubble(item.win);
          setTimeout(() => {
            panel.classList.add('hidden');
            panel.innerHTML = '';
            setProblemUIVisible(true);
            onDone();
          }, 1700);
        } else {
          b.classList.remove('tq-wrong'); void b.offsetWidth;
          b.classList.add('tq-wrong');
          setTimeout(() => b.classList.remove('tq-wrong'), 500);
          setTutorBubble(item.nope);
        }
      });
    });
  }

  tutorExit.addEventListener('click', () => showTutorComplete(tutorState.difficulty, true));
  if (tutorAiToggle) {
    tutorAiToggle.addEventListener('click', () => {
      setAiProvider(aiProvider() === 'gemini' ? 'ds' : 'gemini');
      dbg('[tutor] AI provider → ' + aiProvider());
    });
  }
  refreshAiToggle();   // sync label with stored choice on load

  if (tutorVoiceToggle) {
    tutorVoiceToggle.addEventListener('click', () => {
      localStorage.setItem('gctt_voice', voiceIsFemale() ? VOICE_MALE : VOICE_FEMALE);
      refreshVoiceToggle();
      dbg('[tutor] voice → ' + gVoice());
      if (lastTutorSpeech) speak(lastTutorSpeech);   // preview the new voice right away
    });
  }
  refreshVoiceToggle();   // sync ♂/♀ label on load

  // Robust HTMLAudio unlock — must run synchronously inside a user-gesture click handler
  function unlockHtmlAudio() {
    try {
      const a = new Audio();
      // Tiny silent MP3 (28 bytes)
      a.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
      a.volume = 0;
      a.play().catch(() => { /* ignored — best-effort */ });
    } catch (e) {}
  }

  // Intro corner button — direct jump to tutor
  const introPracticeBtn = document.getElementById('intro-practice-btn');
  dbg('[init] introPracticeBtn found=' + !!introPracticeBtn);
  if (introPracticeBtn) {
    introPracticeBtn.addEventListener('click', (e) => {
      dbg('[click] intro practice button — START');
      e.stopPropagation();
      unlockHtmlAudio();
      try {
        startTutor('intro');
        dbg('[click] startTutor returned (no throw)');
      } catch (err) {
        dbg('[click] startTutor THREW: ' + (err?.message || err));
      }
    });
  }

  // Wrap all standalone integers in <say-as interpret-as="cardinal"> so TTS
  // doesn't read "6" at sentence end as "der Sechste" / a date.
  function toSSML(text) {
    let s = text;
    // drop thinking-interjections Google TTS mangles ("Hmm", "Uhm", "Ähm" …) from the spoken text
    s = s.replace(/\b(?:[Hh]m+|[UuÄäÖöMm]h+m*)\b\s*[,.…]?\s*/g, '');
    // pre-tokenize pause markers so they survive XML escape:  [break:1s] / [break:0.5s]
    s = s.replace(/\[break:(\d+(?:\.\d+)?)s?\]/gi, (_, t) => `\u0000BREAK${t}\u0001`);
    s = s
      // math operators (only between digits!) → spoken words
      .replace(/(\d)\s*[·×]\s*(\d)/g, '$1 mal $2')
      .replace(/(\d)\s*\*\s*(\d)/g, '$1 mal $2')
      .replace(/(\d)\s*\+\s*(\d)/g, '$1 plus $2')
      .replace(/(\d)\s*=\s*(\d)/g, '$1 ist gleich $2')
      // XML escape
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    // restore break markers as SSML tags (after escape)
    s = s.replace(/\u0000BREAK([\d.]+)\u0001/g, '<break time="$1s"/>');
    // emphasis: *word* → <emphasis>
    s = s.replace(/\*([^*]+)\*/g, '<emphasis level="strong">$1</emphasis>');
    // standalone integers → cardinal say-as. Negative-lookahead skips digits
    // already inside a tag (e.g. the "0" in <break time="0.5s"/>).
    s = s.replace(/\b(\d+)\b(?![^<]*>)/g, '<say-as interpret-as="cardinal">$1</say-as>');
    return '<speak>' + s + '</speak>';
  }

  // Strip emphasis + pause markers from display (voice gets SSML versions instead)
  function stripMarkers(text) {
    return text
      .replace(/\*([^*]+)\*/g, '$1')                      // *word* → word
      .replace(/\s*\[break:\d+(?:\.\d+)?s?\]\s*/gi, ' '); // [break:1s] → space
  }

  async function googleTTS(text) {
    const key = gKey();
    dbg('[TTS] googleTTS called', { hasKey: !!key, textLen: text?.length });
    if (!key || !text) { dbg('[TTS] googleTTS bailing: no key or no text'); return null; }
    const voice = gVoice();
    const ssml = toSSML(text);
    const cacheKey = 'gctt_audio_v2_' + voice + '_' + hashStr(ssml);
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
    try {
      const res = await fetch(
        'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + encodeURIComponent(key),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { ssml },
            voice: { languageCode: 'de-DE', name: voice },
            audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95, pitch: -1.5 }
          })
        }
      );
      if (!res.ok) {
        const body = await res.text();
        dbg('[TTS] Google error ' + res.status + ': ' + body.slice(0, 400));
        return null;
      }
      const data = await res.json();
      const b64 = data.audioContent;
      try { localStorage.setItem(cacheKey, b64); } catch (e) { /* quota */ }
      return b64;
    } catch (e) {
      console.warn('Google TTS fetch failed', e);
      return null;
    }
  }

  function stopAllSpeech() {
    if (currentAudio) {
      try { currentAudio.pause(); } catch (e) {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // speak() returns a Promise that resolves when the spoken audio ENDS.
  async function speak(text) {
    dbg('[speak] called', { voiceEnabled, hasText: !!text, textPreview: text?.slice(0, 40) });
    if (!voiceEnabled || !text) { dbg('[speak] bailing: voiceEnabled=' + voiceEnabled); return; }
    stopAllSpeech();
    const b64 = await googleTTS(text);
    dbg('[speak] googleTTS returned', { gotB64: !!b64, b64Len: b64?.length });
    if (!voiceEnabled) { dbg('[speak] bailing after googleTTS: voiceEnabled false'); return; }
    return new Promise((resolve) => {
      let done = false;
      const finish = (why) => { if (!done) { done = true; dbg('[speak] finish', why); resolve(); } };
      if (b64) {
        try {
          currentAudio = new Audio('data:audio/mp3;base64,' + b64);
          currentAudio.addEventListener('ended', () => finish('ended'));
          currentAudio.addEventListener('error', (e) => { dbg('[speak] Audio error', String(e?.message || e)); finish('error'); });
          const p = currentAudio.play();
          dbg('[speak] play() called, hasPromise=' + !!(p && p.catch));
          if (p && typeof p.catch === 'function') {
            p.catch(err => { dbg('[speak] play() promise rejected', err.name + ': ' + err.message); finish('rejected'); });
          }
        } catch (e) {
          dbg('[speak] Audio constructor threw', String(e?.message || e));
          browserSpeakWithEnd(text, () => finish('browser-after-throw'));
        }
      } else {
        dbg('[speak] no b64, falling back to browser TTS');
        browserSpeakWithEnd(text, () => finish('browser-fallback'));
      }
    });
  }
  function browserSpeakWithEnd(text, done) {
    // Browser SS can't parse SSML / our markers — feed it the clean display text.
    const clean = stripMarkers(text);
    dbg('[browserSpeak] called', { hasSynth: 'speechSynthesis' in window, chosenVoice: chosenVoice?.name, text: clean?.slice(0, 40) });
    if (!('speechSynthesis' in window)) { dbg('[browserSpeak] no speechSynthesis'); done(); return; }
    try {
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'de-DE';
      u.rate = 0.94;
      u.pitch = 0.88;
      if (chosenVoice) u.voice = chosenVoice;
      u.onstart = () => dbg('[browserSpeak] start');
      u.onend = () => { dbg('[browserSpeak] end'); done(); };
      u.onerror = (e) => { dbg('[browserSpeak] error ' + (e?.error || '')); done(); };
      speechSynthesis.speak(u);
      dbg('[browserSpeak] speak() queued, pending=' + speechSynthesis.pending + ' speaking=' + speechSynthesis.speaking);
    } catch (e) { dbg('[browserSpeak] threw', String(e?.message || e)); done(); }
  }

  // Console helpers
  window.setGoogleKey = async (k) => {
    await saveApiKey(k || '');
    console.log(k ? 'Key gespeichert (verschlüsselt)' : 'Key entfernt');
  };
  window.setGoogleVoice = (v) => {
    localStorage.setItem('gctt_voice', v);
    console.log('Voice:', v);
  };
  window.clearGoogleAudioCache = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('gctt_audio_'));
    keys.forEach(k => localStorage.removeItem(k));
    console.log('Cache geleert,', keys.length, 'Einträge entfernt');
  };
  // Clear v1 cache automatically on first load with SSML version
  (function() {
    if (!localStorage.getItem('gctt_ssml_migrated')) {
      Object.keys(localStorage).filter(k => k.startsWith('gctt_audio_') && !k.startsWith('gctt_audio_v2_'))
        .forEach(k => localStorage.removeItem(k));
      localStorage.setItem('gctt_ssml_migrated', '1');
    }
  })();
  function refreshSettingsBtnState() {
    const btn = document.getElementById('settings-btn');
    btn && btn.classList.toggle('has-key', !!gKey());
  }

  // ===== Audio =====
  let ctx = null;
  function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      preloadBells();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ===== Bell samples =====
  const BELL_PATHS = {
    small: '../resources/bells/wingsoarstudio-anvil-bell-2-wav-485668.mp3',
    big:   '../resources/bells/koiroylers-clear-bell-notification-sound-351709.mp3',
  };
  const bellBuffers = { small: null, big: null };
  const bellOnsets  = { small: 0,    big: 0 };
  const activeBellSources = []; // tracked for stop-all

  // Find the first sample where the waveform exceeds the threshold —
  // skip leading silence so both bells' audible attacks align.
  function detectOnset(buffer, threshold = 0.04) {
    const ch = buffer.getChannelData(0);
    const sr = buffer.sampleRate;
    for (let i = 0; i < ch.length; i++) {
      if (Math.abs(ch[i]) > threshold) return Math.max(0, i / sr - 0.003); // ~3 ms lead-in
    }
    return 0;
  }

  async function loadBell(kind) {
    if (bellBuffers[kind] || !ctx) return;
    try {
      const res = await fetch(BELL_PATHS[kind]);
      if (!res.ok) throw new Error('fetch ' + res.status);
      const arr = await res.arrayBuffer();
      bellBuffers[kind] = await ctx.decodeAudioData(arr);
      bellOnsets[kind]  = detectOnset(bellBuffers[kind]);
      console.log('bell', kind, 'onset', (bellOnsets[kind] * 1000).toFixed(1), 'ms');
    } catch (e) {
      console.warn('bell load failed:', kind, e);
    }
  }
  function preloadBells() {
    loadBell('small');
    loadBell('big');
  }

  function playSample(kind, when) {
    const buf = bellBuffers[kind];
    if (!buf || !ctx) return false;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = 1 + (Math.random() - 0.5) * 0.04; // ±2% jitter
    const g = ctx.createGain();
    g.gain.value = 0.75;
    src.connect(g).connect(ctx.destination);
    src.start(when || 0, bellOnsets[kind] || 0);
    const entry = { src, g };
    activeBellSources.push(entry);
    src.onended = () => {
      const i = activeBellSources.indexOf(entry);
      if (i >= 0) activeBellSources.splice(i, 1);
    };
    return true;
  }
  function stopBells() {
    while (activeBellSources.length) {
      const { src, g } = activeBellSources.pop();
      try {
        g.gain.cancelScheduledValues(ctx.currentTime);
        g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
        src.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    }
  }
  function stopAllAudio() {
    stopBells();
    stopAllSpeech();
  }
  // Richer bell synthesis — inharmonic partials (hum/prime/tierce/quint/nominal),
  // sharp strike transient, long resonant tail. Closer to a real church bell.
  function bellTone(freq, dur = 1.6) {
    const c = audio();
    const t0 = c.currentTime;

    const master = c.createGain();
    master.gain.value = 0.34;
    master.connect(c.destination);

    // Slight overall band shape so the tone sits in the warm range
    const tone = c.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = freq * 8;
    tone.Q.value = 0.7;
    tone.connect(master);

    // Real church-bell partial ratios (Hemony)
    const partials = [
      { mult: 0.5,  g: 0.34, d: dur * 1.00 }, // hum (octave below)
      { mult: 1.00, g: 0.42, d: dur * 0.90 }, // prime / strike tone
      { mult: 1.19, g: 0.26, d: dur * 0.75 }, // tierce (minor third)
      { mult: 1.50, g: 0.22, d: dur * 0.60 }, // quint (perfect fifth)
      { mult: 2.00, g: 0.34, d: dur * 0.80 }, // nominal (octave)
      { mult: 2.52, g: 0.16, d: dur * 0.42 },
      { mult: 3.00, g: 0.11, d: dur * 0.35 },
    ];
    partials.forEach(p => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = freq * p.mult;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(p.g, t0 + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + p.d);
      o.connect(g).connect(tone);
      o.start(t0);
      o.stop(t0 + p.d + 0.05);
    });

    // Sharp metallic strike transient — band-passed triangle, ~50 ms
    const click = c.createOscillator();
    const cf = c.createBiquadFilter();
    const cg = c.createGain();
    click.type = 'triangle';
    click.frequency.value = freq * 5.4;
    cf.type = 'bandpass';
    cf.frequency.value = freq * 6;
    cf.Q.value = 2.5;
    cg.gain.setValueAtTime(0.32, t0);
    cg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.06);
    click.connect(cf).connect(cg).connect(master);
    click.start(t0);
    click.stop(t0 + 0.08);
  }

  // ===== DOM =====
  const bubble    = document.getElementById('bubble');
  const nextBtn   = document.getElementById('next-btn');
  const tlWrap    = document.getElementById('timeline-wrap');
  const tl        = document.getElementById('timeline');
  const cursor    = document.getElementById('cursor');
  const meetLabel = document.getElementById('meeting-label');
  const mathArea  = document.getElementById('math-area');
  const endArea   = document.getElementById('end-area');
  const bellsRow  = document.getElementById('bells');
  const tlLabel   = document.getElementById('timeline-label');
  const bellSmall = document.getElementById('bell-small');
  const bellBig   = document.getElementById('bell-big');
  const roundPill = document.getElementById('round-pill');
  const intro     = document.getElementById('intro');

  // ===== Helpers =====
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a * b / gcd(a, b);

  function flashBell(el) {
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 180);
  }
  function ringBell(kind, when) {
    const el = (kind === 'small') ? bellSmall : bellBig;
    flashBell(el);
    if (!voiceEnabled) return; // speaker off → bell flashes but stays silent
    if (!playSample(kind, when)) {
      const period = (kind === 'small') ? state.small : state.big;
      bellTone(freqFor(period), kind === 'small' ? 0.6 : 0.75);
    }
  }
  bellSmall.addEventListener('click', () => { audio(); ringBell('small'); });
  bellBig.addEventListener('click',   () => { audio(); ringBell('big'); });

  function freqFor(period) {
    const base = 220;
    return Math.round(base * Math.pow(2, (6 - period) / 6));
  }

  // Returns a Promise that resolves when the spoken text ENDS.
  // `speechText` is optional — used for TTS when display text contains things TTS reads weirdly (e.g. "1/3" → "der dritte").
  function setBubble(text, speechText) {
    bubble.style.opacity = '0';
    return new Promise((resolve) => {
      setTimeout(async () => {
        bubble.textContent = stripMarkers(text);
        bubble.style.opacity = '1';
        await speak(speechText || text);
        resolve();
      }, 140);
    });
  }

  // ===== State =====
  const state = { small: 3, big: 4, L: 12, tEnd: 15 };

  function setRound(s, b, label) {
    state.small = s;
    state.big = b;
    state.L = lcm(s, b);
    state.tEnd = Math.ceil(state.L * 1.4);
    bellSmall.querySelector('.bell-digit').textContent = s;
    bellBig.querySelector('.bell-digit').textContent = b;
    roundPill.textContent = label;
  }

  function clearTimeline() {
    tl.querySelectorAll('.strike, .strike-count, .tick, .slot-fill, .sec-mark').forEach(n => n.remove());
    const axisLabels = document.getElementById('axis-labels');
    if (axisLabels) axisLabels.querySelectorAll('.tick-num').forEach(n => n.remove());
    cursor.style.left = '0px';
    cursor.style.opacity = '1';   // runner visible for a fresh run
    meetLabel.classList.remove('show');
  }

  // Axis-label font scales with the per-tick spacing so two-digit numbers always fit
  // (responsive: many ticks on a narrow track → smaller font, clamped for readability).
  function tickFontPx() {
    const spacing = tlWidth() / Math.max(1, state.tEnd);
    return Math.max(8, Math.min(13, spacing * 0.62));
  }

  function drawTimeAxis() {
    tl.querySelectorAll('.sec-mark').forEach(el => el.remove());
    const axisLabels = document.getElementById('axis-labels');
    axisLabels.querySelectorAll('.tick-num').forEach(el => el.remove());
    const w = tlWidth();
    const fpx = tickFontPx();
    for (let s = 1; s < state.tEnd; s++) {
      const x = (s / state.tEnd) * w;
      const m = document.createElement('div');
      m.className = 'sec-mark';
      m.dataset.sec = s;
      m.style.left = x + 'px';
      tl.appendChild(m);
      const lab = document.createElement('div');
      lab.className = 'tick-num';
      lab.dataset.tickIdx = s;
      lab.dataset.tickTotal = state.tEnd;
      lab.style.left = x + 'px';
      lab.style.fontSize = fpx + 'px';
      lab.textContent = String(s);
      axisLabels.appendChild(lab);
    }
  }

  // Strike-count numbers (1,2,3 above / 1,2 below): ON for the animated runTimeline
  // (story rounds + tutor replay), OFF for the static "Stücke" scenes (drawAllStrikes).
  let showStrikeNums = true;
  function drawAllStrikes() {
    showStrikeNums = false;   // pieces/triangles scenes: no per-strike numbers
    for (let t = state.small; t <= state.L; t += state.small) placeStrike(t, 'small');
    for (let t = state.big;   t <= state.L; t += state.big)   placeStrike(t, 'big');
  }

  function showSlots(period, kind, instant) {
    const w = tlWidth();
    for (let t = period; t <= state.L; t += period) {
      const tri = document.createElement('div');
      tri.className = 'slot-fill ' + kind;
      tri.dataset.slotEnd = t;
      tri.style.left = ((t / state.tEnd) * w) + 'px';
      tl.appendChild(tri);
      if (instant) tri.classList.add('show');
      else setTimeout(() => tri.classList.add('show'), 80);
    }
  }

  function tlWidth() { return tl.clientWidth; }

  function placeStrike(time, kind) {
    const el = document.createElement('div');
    el.className = 'strike ' + kind;
    el.dataset.time = time;
    el.style.left = ((time / state.tEnd) * tlWidth() - 2) + 'px';
    tl.appendChild(el);
    // Running count of this bell's strikes: 1,2,3… (small, above) · 1,2… (big, below)
    if (showStrikeNums) {
      const period = (kind === 'small') ? state.small : state.big;
      const num = document.createElement('div');
      num.className = 'strike-count ' + kind;
      num.dataset.time = time;
      num.style.left = ((time / state.tEnd) * tlWidth()) + 'px';
      num.textContent = Math.round(time / period);
      tl.appendChild(num);
    }
    // Color the axis label that matches this strike's position
    const axisLabels = document.getElementById('axis-labels');
    if (axisLabels) {
      const lab = axisLabels.querySelector('.tick-num[data-tick-idx="' + time + '"]');
      if (lab) {
        if (time === state.L) {
          lab.classList.remove('color-small', 'color-big');
          lab.classList.add('color-meet');
        } else {
          lab.classList.add(kind === 'small' ? 'color-small' : 'color-big');
        }
      }
    }
    return el;
  }

  function runTimeline(done, durationMs) {
    showStrikeNums = true;   // animated runs (story rounds + tutor replay) show the counts
    clearTimeline();
    drawTimeAxis();
    let smallNext = state.small;
    let bigNext = state.big;
    const animMs = durationMs || 4200;
    const t0 = performance.now();

    function frame(now) {
      const k = Math.min(1, (now - t0) / animMs);
      const t = k * state.tEnd;
      cursor.style.left = (k * tlWidth()) + 'px';

      // Shared audio time for this frame — strikes that fire together (at the meeting)
      // get scheduled with the exact same `when`, so WebAudio plays them sample-aligned.
      const audioWhen = ctx ? ctx.currentTime : 0;

      while (smallNext <= t && smallNext <= state.tEnd) {
        placeStrike(smallNext, 'small');
        ringBell('small', audioWhen);
        smallNext += state.small;
      }
      while (bigNext <= t && bigNext <= state.tEnd) {
        placeStrike(bigNext, 'big');
        ringBell('big', audioWhen);
        bigNext += state.big;
      }

      if (k < 1) requestAnimationFrame(frame);
      else done && done();
    }
    requestAnimationFrame(frame);
  }

  function highlightMeeting() {
    tl.querySelectorAll('.strike').forEach(el => {
      if (parseFloat(el.dataset.time) === state.L) el.classList.add('meet');
    });
    const w = tlWidth();
    meetLabel.style.left = ((state.L / state.tEnd) * w) + 'px';
    meetLabel.querySelector('.num').textContent = state.L;
    meetLabel.classList.add('show');
  }

  function divideIntoN(n) {
    tl.querySelectorAll('.tick').forEach(el => el.remove());
    const w = tlWidth();
    const lcmX = (state.L / state.tEnd) * w;
    for (let i = 1; i < n; i++) {
      const x = (i / n) * lcmX;
      const t = document.createElement('div');
      t.className = 'tick';
      t.dataset.tickIdx = i;
      t.dataset.tickTotal = n;
      t.style.left = x + 'px';
      tl.appendChild(t);
    }
  }

  function relayout() {
    const w = tlWidth();
    tl.querySelectorAll('.strike').forEach(el => {
      const t = parseFloat(el.dataset.time);
      el.style.left = ((t / state.tEnd) * w - 2) + 'px';
    });
    tl.querySelectorAll('.strike-count').forEach(el => {
      const t = parseFloat(el.dataset.time);
      el.style.left = ((t / state.tEnd) * w) + 'px';
    });
    const lcmX = (state.L / state.tEnd) * w;
    tl.querySelectorAll('.slot-fill').forEach(el => {
      const t = parseFloat(el.dataset.slotEnd);
      el.style.left = ((t / state.tEnd) * w) + 'px';
    });
    tl.querySelectorAll('.tick').forEach(el => {
      const i = parseInt(el.dataset.tickIdx, 10);
      const n = parseInt(el.dataset.tickTotal, 10);
      if (!isNaN(i) && !isNaN(n)) {
        el.style.left = ((i / n) * lcmX) + 'px';
      }
    });
    const axisLabels = document.getElementById('axis-labels');
    const fpx = tickFontPx();
    if (axisLabels) axisLabels.querySelectorAll('.tick-num').forEach(el => {
      const i = parseInt(el.dataset.tickIdx, 10);
      const n = parseInt(el.dataset.tickTotal, 10);
      if (!isNaN(i) && !isNaN(n)) {
        el.style.left = ((i / n) * w) + 'px';   // full-axis position (matches drawTimeAxis), NOT lcmX
      }
      el.style.fontSize = fpx + 'px';
    });
    tl.querySelectorAll('.sec-mark').forEach(el => {
      const s = parseFloat(el.dataset.sec);
      el.style.left = ((s / state.tEnd) * w) + 'px';
    });
    if (meetLabel.classList.contains('show')) {
      meetLabel.style.left = ((state.L / state.tEnd) * w) + 'px';
    }
  }
  window.addEventListener('resize', relayout);

  // 1/a + 1/b = (L/a)/L + (L/b)/L = sum/L, with L = kgV. Defaults to the current round.
  function showMath(a, b) {
    a = a || state.small; b = b || state.big;
    const L = lcm(a, b);
    const na = L / a, nb = L / b, sum = na + nb;
    mathArea.classList.remove('hidden');
    mathArea.innerHTML = `
      <div class="math-box fade-in">
        <span class="frac"><span class="num">1</span><span class="den color-small">${a}</span></span>
        <span class="op">+</span>
        <span class="frac"><span class="num">1</span><span class="den color-big">${b}</span></span>
        <span class="op">=</span>
        <span class="frac"><span class="num color-small">${na}</span><span class="den color-meet">${L}</span></span>
        <span class="op">+</span>
        <span class="frac"><span class="num color-big">${nb}</span><span class="den color-meet">${L}</span></span>
        <span class="op">=</span>
        <span class="frac"><span class="num">${sum}</span><span class="den color-meet">${L}</span></span>
      </div>`;
  }

  // Summary: the three examples in full form (1/a + 1/b = na/L + nb/L = sum/L).
  function showSummary() {
    tlWrap.classList.add('hidden');     // no timeline on the summary screen
    bellsRow.classList.add('hidden');   // and no bells either — just the rule + equations
    const row = (a, b) => {
      const L = lcm(a, b), na = L / a, nb = L / b, sum = na + nb;
      return `<div class="math-box fade-in" style="margin:6px 0;">
        <span class="frac"><span class="num">1</span><span class="den color-small">${a}</span></span>
        <span class="op">+</span>
        <span class="frac"><span class="num">1</span><span class="den color-big">${b}</span></span>
        <span class="op">=</span>
        <span class="frac"><span class="num color-small">${na}</span><span class="den color-meet">${L}</span></span>
        <span class="op">+</span>
        <span class="frac"><span class="num color-big">${nb}</span><span class="den color-meet">${L}</span></span>
        <span class="op">=</span>
        <span class="frac"><span class="num">${sum}</span><span class="den color-meet">${L}</span></span>
      </div>`;
    };
    mathArea.classList.remove('hidden');
    mathArea.innerHTML = row(3, 4) + row(2, 3) + row(2, 4);
  }

  async function showEnd(instant) {
    // Hide quest UI
    bubble.classList.add('hidden');
    bellsRow.classList.add('hidden');
    tlWrap.classList.add('hidden');
    mathArea.classList.add('hidden');
    document.getElementById('controls').classList.add('hidden');
    roundPill.classList.add('hidden');
    const questHeader = document.querySelector('body > header');
    if (questHeader) questHeader.style.display = 'none';

    // Re-show intro backdrop (stars, moon, skyline, flickering door)
    intro.style.display = '';
    intro.classList.remove('gone');

    // Keep the title visible for the end too; hide everything else intro-specific
    if (introTitle) introTitle.style.display = '';
    if (introDate)  introDate.style.display  = 'none';
    if (tap1)       tap1.style.display       = 'none';
    if (tap2)       tap2.style.display       = 'none';
    if (introPracticeBtn) introPracticeBtn.style.display = 'none';   // end screen has its own practice button
    if (narrationBox) narrationBox.classList.add('hidden');

    // Populate and reveal end overlay
    const endOv = document.getElementById('end-overlay');
    endOv.innerHTML = END_PARAGRAPHS.map(p => `<p>${stripMarkers(p)}</p>`).join('') +
      '<button class="end-practice-btn" id="end-practice-btn">Mit Khwārizmī üben</button>';
    const practiceBtn = document.getElementById('end-practice-btn');
    if (practiceBtn) practiceBtn.addEventListener('click', () => {
      unlockHtmlAudio();
      startTutor('end');
    });
    endOv.classList.remove('hidden');

    if (instant) return;
    // Speak each paragraph in sequence — break if the user exited the end-screen (e.g. opened tutor)
    for (let i = 0; i < END_PARAGRAPHS.length; i++) {
      if (endOv.classList.contains('hidden')) break;
      await speak(END_PARAGRAPHS[i]);
      if (endOv.classList.contains('hidden')) break;
      if (i < END_PARAGRAPHS.length - 1) await wait(500);
    }
  }

  // ===== Scene flow =====
  const scenes = [
    // 0 — Bells appear, kid can try them
    {
      bubble: "Da hängen sie — vor dir. Tipp die Glocken an, hör sie. Dann lass sie läuten.",
      btn: "Lass sie läuten",
      onEnter: () => setRound(3, 4, "Runde 1 von 3"),
    },
    // 1 — Run round 1
    {
      bubble: "Wann läuten beide gleichzeitig? Pass auf die Zeitleiste auf.",
      skipAutoBtn: true,
      onEnter: async (speakingDone, instant) => {
        tlWrap.classList.remove('hidden');
        tlLabel.textContent = "Runde 1 · 3 und 4";
        if (instant) { clearTimeline(); drawTimeAxis(); drawAllStrikes(); return; }
        nextBtn.disabled = true;
        nextBtn.textContent = "…";
        await speakingDone;
        await wait(350);
        runTimeline(() => {
          nextBtn.disabled = false;
          nextBtn.textContent = "Hast du's gesehen?";
        });
      },
    },
    // 2 — Aha 1
    {
      bubble: "Sie treffen sich bei der 12! Dieser Takt, die Zahl 12, ist beiden gemein!",
      btn: "Andere Glocken!",
      onEnter: () => highlightMeeting(),
    },
    // 3 — Round 2 run
    {
      bubble: "Probieren wir andere Rhythmen: 2 und 3 Sekunden. Was glaubst du, wann treffen sie sich diesmal?",
      skipAutoBtn: true,
      onEnter: async (speakingDone, instant) => {
        setRound(2, 3, "Runde 2 von 3");
        tlLabel.textContent = "Runde 2 · 2 und 3";
        if (instant) { clearTimeline(); drawTimeAxis(); drawAllStrikes(); return; }
        nextBtn.disabled = true;
        nextBtn.textContent = "…";
        await speakingDone;
        await wait(350);
        runTimeline(() => {
          nextBtn.disabled = false;
          nextBtn.textContent = "Was war die Zahl?";
        });
      },
    },
    // 4 — Aha 2
    {
      bubble: "Bei 6. Das ist 2 mal 3. Eine Runde noch, jetzt wird's spannend.",
      btn: "Letzte Runde",
      onEnter: () => highlightMeeting(),
    },
    // 5 — Round 3 run (twist)
    {
      bubble: "4 und 6 Sekunden. 4 mal 6 wäre 24. Aber pass mal auf, was wirklich passiert.",
      speech: "Vier und sechs Sekunden. Vier mal sechs wäre vierundzwanzig. Aber pass mal auf, was wirklich passiert.",
      skipAutoBtn: true,
      onEnter: async (speakingDone, instant) => {
        setRound(4, 6, "Runde 3 von 3");
        tlLabel.textContent = "Runde 3 · 4 und 6";
        if (instant) { clearTimeline(); drawTimeAxis(); drawAllStrikes(); return; }
        nextBtn.disabled = true;
        nextBtn.textContent = "…";
        await speakingDone;
        await wait(350);
        runTimeline(() => {
          nextBtn.disabled = false;
          nextBtn.textContent = "Wann war's?";
        });
      },
    },
    // 6 — Aha 3: observation
    {
      bubble: "12 — nicht 24! Beide Zahlen passen auch schon in die 12! Dreimal 4 ist 12, zweimal 6 ist 12.",
      btn: "Geht's noch kleiner?",
      onEnter: () => highlightMeeting(),
    },
    // 7 — Probe: smaller numbers?
    {
      bubble: "Gibt's eine kleinere Zahl in die beide reinpassen? 6? — die 4 passt nicht. 8? — die 6 passt nicht. 10? — auch nicht.",
      btn: "Also ist die 12 …",
    },
    // 8 — Name reveal: kgV
    {
      bubble: "Die 12 ist die kleinste Zahl in die beide reinpassen. Genau deshalb heißt sie das kleinste gemeinsame Vielfache. Kurz: kgV.",
      btn: "Mal Produkt, mal weniger?",
    },
    // 9 — Observation: product vs less
    {
      bubble: "Manchmal ist das kgV einfach das Produkt — 3·4 = 12, 2·3 = 6. Manchmal weniger — 4·6 wäre 24, aber 12 ist kleiner als 24. So rechnet man lieber mit 12, weil dann die Zahlen beim Rechnen kleiner bleiben!",
      btn: "Was hat das mit Brüchen zu tun?",
    },
    // 10 — Bridge: back to 3,4, divide into 12
    {
      bubble: "Zurück zu unseren ersten Glocken — 3 und 4. Das kgV ist 12. Wir teilen die Zeit bis 12 in 12 gleich große Stücke.",
      btn: "Was sagt das über die kleine Glocke?",
      onEnter: () => {
        setRound(3, 4, "Brücke");
        state.tEnd = state.L + 1; // limit timeline to kgV (with 1-slot tail) — keine 13–17 mehr
        tlLabel.textContent = "Zeit bis 12 — in 12 Stücke";
        clearTimeline();
        drawTimeAxis();
        divideIntoN(12);
        drawAllStrikes();
        highlightMeeting();
      },
    },
    // 11 — Yellow slots: small bell every 3rd
    {
      bubble: "Schau auf die kleine Glocke. Sie schlägt jedes dritte Stück — bei 3, 6, 9 und 12. Also: eins von drei Stücken ist gelb. Das ist ein Drittel — oder 1/3.",
      speech: "Schau auf die kleine Glocke. Sie schlägt jedes dritte Stück — bei drei, sechs, neun und zwölf. Also: eins von drei Stücken ist gelb. Das ist ein Drittel.",
      btn: "Und die große?",
      onEnter: (speakingDone, instant) => showSlots(state.small, 'small', instant),
    },
    // 12 — Red slots: big bell every 4th
    {
      bubble: "Die große schlägt jedes vierte Stück — bei 4, 8 und 12. Eins von vier Stücken ist rot. Das ist ein Viertel — oder 1/4.",
      speech: "Die große schlägt jedes vierte Stück — bei vier, acht und zwölf. Eins von vier Stücken ist rot. Das ist ein Viertel.",
      btn: "Wieviele zusammen?",
      onEnter: (speakingDone, instant) => showSlots(state.big, 'big', instant),
    },
    // 13 — Count
    {
      bubble: "Zähl die gelben Stücke: vier. Die roten: drei. Zusammen sieben — von zwölf Stücken.",
      speech: "Zähl die gelben Stücke: [break:2s] vier. Die roten: [break:2s] drei. Zusammen sieben — von zwölf Stücken.",
      btn: "Sieh die Gleichung",
    },
    // 14 — Math reveal
    {
      bubble: "Genau diese sieben von zwölf hast du gerade gezählt. Das ist die Summe von einem Drittel und einem Viertel — oder von vier Zwölfteln und drei Zwölfteln — ergibt 4 + 3 = 7, also 7 Zwölftel — 7/12.",
      speech: "Genau diese sieben von zwölf hast du gerade gezählt. Das ist die Summe von einem Drittel und einem Viertel — oder von vier Zwölfteln und drei Zwölfteln — ergibt vier plus drei ist gleich sieben, also sieben Zwölftel.",
      btn: "Noch ein Beispiel",
      onEnter: () => showMath(),
    },

    // ===== Example 2: 2 & 3 → 5/6 (fully shown again, same structure) =====
    {
      bubble: "Nochmal — neue Glocken: 2 und 3. Das kgV ist 6. Wir teilen die Zeit bis 6 in 6 gleiche Stücke.",
      speech: "Nochmal — neue Glocken: zwei und drei. Das kgV ist sechs. Wir teilen die Zeit bis sechs in sechs gleiche Stücke.",
      btn: "Die kleine Glocke?",
      onEnter: () => {
        mathArea.classList.add('hidden');   // clear the previous example's equation
        mathArea.innerHTML = '';
        setRound(2, 3, "Beispiel 2");
        state.tEnd = state.L + 1;
        tlLabel.textContent = "Zeit bis 6 — in 6 Stücke";
        clearTimeline();
        drawTimeAxis();
        divideIntoN(6);
        drawAllStrikes();
        highlightMeeting();
      },
    },
    {
      bubble: "Die kleine schlägt jedes zweite Stück — bei 2, 4 und 6. Drei von sechs sind gelb. Das sind drei Sechstel — oder gekürzt ein Halb, also 1/2.",
      speech: "Die kleine schlägt jedes zweite Stück — bei zwei, vier und sechs. Drei von sechs sind gelb. Das sind drei Sechstel — oder gekürzt ein Halb.",
      btn: "Und die große?",
      onEnter: (d, instant) => showSlots(state.small, 'small', instant),
    },
    {
      bubble: "Die große schlägt jedes dritte Stück — bei 3 und 6. Zwei von sechs sind rot. Das sind zwei Sechstel — oder gekürzt ein Drittel, also 1/3.",
      speech: "Die große schlägt jedes dritte Stück — bei drei und sechs. Zwei von sechs sind rot. Das sind zwei Sechstel — oder gekürzt ein Drittel.",
      btn: "Zusammen?",
      onEnter: (d, instant) => showSlots(state.big, 'big', instant),
    },
    {
      bubble: "Drei gelbe, zwei rote — zusammen fünf von sechs. Also: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
      speech: "Drei gelbe, [break:1s] zwei rote — zusammen fünf von sechs. Also: ein Halb plus ein Drittel ist drei Sechstel plus zwei Sechstel — ergibt fünf Sechstel.",
      btn: "Jetzt du!",
      onEnter: () => showMath(2, 3),
    },

    // ===== Example 3: 2 & 4 → 3/4 (interactive — the child counts) =====
    {
      bubble: "Jetzt zähl du! Neue Glocken: 2 und 4. Das kgV ist 4 — also haben wir vier Stücke. Gelb schlägt bei 2 und 4, rot bei 4. Wieviele Schläge haben wir insgesamt?",
      speech: "Jetzt zähl du! Neue Glocken: zwei und vier. Das k g V ist vier — also haben wir vier Stücke. Gelb schlägt bei zwei und vier, rot bei vier. Wie viele Schläge haben wir insgesamt?",
      ask: {
        options: [2, 3, 4],
        answer: 3,
        hintWrong: "Zähl die Schläge in Ruhe: zwei gelbe und einer rot — zusammen?",
      },
      onEnter: (d, instant) => {
        mathArea.classList.add('hidden');   // clear the previous example's equation
        mathArea.innerHTML = '';
        setRound(2, 4, "Beispiel 3");
        state.tEnd = state.L + 1;
        tlLabel.textContent = "Zeit bis 4 — in 4 Stücke";
        clearTimeline();
        drawTimeAxis();
        divideIntoN(4);
        drawAllStrikes();
        highlightMeeting();
        showSlots(state.small, 'small', instant);
        showSlots(state.big, 'big', instant);
      },
    },
    {
      bubble: "Genau — drei von vier! Also: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
      speech: "Genau — drei von vier! Also: ein Halb plus ein Viertel ist zwei Viertel plus ein Viertel — ergibt drei Viertel.",
      btn: "Zusammengefasst",
      onEnter: () => showMath(2, 4),
    },

    // ===== Summary: the rule + all three results =====
    {
      bubble: "Du gehst immer gleich vor: Gelbe zählen, rote zählen, addieren — das ist der Zähler, das kgV der Nenner. So addierst oder subtrahierst Du immer Brüche!",
      speech: "Du gehst immer gleich vor: Gelbe zählen, rote zählen, addieren — das ist der Zähler oben, das k g V der Nenner unten. So addierst oder subtrahierst du immer Brüche!",
      btn: "Quest beenden",
      onEnter: () => showSummary(),
    },
    // End
    {
      skipAutoBtn: true,
      onEnter: (speakingDone, instant) => showEnd(instant),
    },
  ];

  const sceneProgressEl = document.getElementById('scene-progress');
  function updateProgress() {
    if (!sceneProgressEl) return;
    const total = scenes.length - 1; // exclude end scene
    if (sceneIdx < 0 || sceneIdx >= total) {
      sceneProgressEl.classList.add('hidden');
    } else {
      sceneProgressEl.textContent = (sceneIdx + 1) + '/' + total;
      sceneProgressEl.classList.remove('hidden');
    }
  }

  // ===== Tap-to-answer bar (interactive story scenes) =====
  const answerBar = document.getElementById('answer-bar');
  const fwdBtn    = document.getElementById('forward-btn');

  function hideAnswerBar() {
    if (!answerBar) return;
    answerBar.classList.add('hidden');
    answerBar.innerHTML = '';
  }
  function showAnswerBar(scene) {
    if (!answerBar || !scene.ask) return;
    const { options, answer, hintWrong } = scene.ask;
    answerBar.innerHTML = '';
    options.forEach(val => {
      const b = document.createElement('button');
      b.className = 'answer-opt';
      b.textContent = val;
      b.addEventListener('click', () => {
        if (b.disabled) return;
        if (val === answer) {
          b.classList.add('correct');
          answerBar.querySelectorAll('.answer-opt').forEach(o => o.disabled = true);
          // brief beat on the green answer, then advance to the reveal scene
          setTimeout(() => { hideAnswerBar(); advance(false); }, 750);
        } else {
          b.classList.remove('wrong'); void b.offsetWidth;  // restart the shake
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 500);
          if (hintWrong) { stopAllSpeech(); speak(hintWrong); }
        }
      });
      answerBar.appendChild(b);
    });
    answerBar.classList.remove('hidden');
  }

  let sceneIdx = -1;
  function advance(instant = false) {
    audio();
    stopAllAudio();
    sceneIdx++;
    const s = scenes[sceneIdx];
    if (!s) return;
    // Persist current scene so a reload resumes here (cleared once the end is reached)
    try {
      if (sceneIdx >= scenes.length - 1) localStorage.removeItem('glocken_scene');
      else localStorage.setItem('glocken_scene', String(sceneIdx));
    } catch (e) {}
    hideAnswerBar();
    nextBtn.disabled = false; // always re-enable when entering a new scene
    if (fwdBtn) fwdBtn.disabled = false;
    if (s.btn && !s.skipAutoBtn) nextBtn.textContent = s.btn;
    updateProgress();
    if (instant) {
      stopAllSpeech();
      if (s.bubble) {
        bubble.style.opacity = '1';
        bubble.textContent = s.bubble;
      }
      if (s.onEnter) s.onEnter(Promise.resolve(), true);
    } else {
      const speakingDone = s.bubble ? setBubble(s.bubble, s.speech) : Promise.resolve();
      if (s.onEnter) s.onEnter(speakingDone, false);
    }
    // Interactive scene: show the tap bar and block skipping until answered
    if (s.ask) {
      showAnswerBar(s);
      nextBtn.disabled = true;
      if (fwdBtn) fwdBtn.disabled = true;
    }
  }

  function hardReset() {
    stopAllAudio();
    hideAnswerBar();
    clearTimeline();
    tlWrap.classList.add('hidden');
    mathArea.classList.add('hidden');
    mathArea.innerHTML = '';
    endArea.classList.add('hidden');
    endArea.innerHTML = '';
    // Restore anything showEnd may have hidden / re-shown
    const questHeader = document.querySelector('body > header');
    if (questHeader) questHeader.style.display = '';
    intro.style.display = 'none';
    intro.classList.add('gone');
    const endOv = document.getElementById('end-overlay');
    if (endOv) endOv.classList.add('hidden');
    document.getElementById('controls').classList.remove('hidden');
    roundPill.classList.remove('hidden');
    bubble.classList.remove('hidden');
    bellsRow.classList.remove('hidden');
    bubble.textContent = '';
    nextBtn.disabled = false;
    sceneIdx = -1;
    updateProgress();
  }

  function goBack() {
    if (sceneIdx <= 0) return;
    const target = sceneIdx - 1;
    hardReset();
    for (let i = 0; i <= target; i++) advance(true);
  }

  nextBtn.addEventListener('click', () => advance(false));
  document.getElementById('prev-btn').addEventListener('click', goBack);
  document.getElementById('forward-btn').addEventListener('click', () => advance(false));

  // Test tone — pure WebAudio, bypasses HTMLAudio / Google TTS
  function playTestTone() {
    const c = audio();
    if (!c) { dbg('[testTone] NO ctx'); return; }
    dbg('[testTone] ctx.state=' + c.state);
    if (c.state === 'suspended') c.resume().then(() => dbg('[testTone] resume() resolved'));
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660;
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35, c.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.5);
    osc.connect(g).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.55);
    dbg('[testTone] osc.start() called');
  }
  // Space → test sound. Reads bubble text aloud via speak(). Falls back to a tone.
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      // Avoid double-trigger from input (still allow space char to flow)
      const target = e.target;
      const inInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      dbg('[space] pressed target=' + (target?.tagName || '?'));
      // Pick text: tutor bubble if visible, else quest bubble, else fallback
      const tutorVisible = tutorOverlay && !tutorOverlay.classList.contains('hidden');
      let text = '';
      if (tutorVisible) text = tutorBubble?.textContent?.trim();
      if (!text) text = bubble?.textContent?.trim();
      if (!text) text = 'Eins, zwei, drei.';
      dbg('[space] will speak: ' + text.slice(0, 60));
      // Don't preventDefault — let input get the space char too
      playTestTone(); // diagnostic tone in parallel
      speak(text);
    }
  });

  // Arrow keys: → forward, ← back — works in every phase
  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    // Disable quest-nav shortcuts while tutor overlay is active
    if (!tutorOverlay.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if      (introPhase === 'atmosphere') startNarration();
      else if (introPhase === 'narrating')  skipNarration();
      else if (introPhase === 'ready')      dismissIntro();
      else if (introPhase === 'gone')       advance(false);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (introPhase === 'gone') goBack();
    } else if (e.key === 'b' || e.key === 'B') {
      e.preventDefault();
      audio();
      const when = ctx ? ctx.currentTime : 0;
      ringBell('small', when);
      ringBell('big', when);
    }
  });

  // ===== Mute toggle =====
  const muteBtn = document.getElementById('mute-btn');
  const muteWaves = document.getElementById('mute-waves');
  const muteCross = document.getElementById('mute-cross');
  function applyMuteUI() {
    muteBtn.classList.toggle('muted', !voiceEnabled);
    muteWaves.classList.toggle('hidden', !voiceEnabled);
    muteCross.classList.toggle('hidden', voiceEnabled);
  }
  applyMuteUI();
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    voiceEnabled = !voiceEnabled;
    localStorage.setItem('gctt_muted', voiceEnabled ? '0' : '1');
    applyMuteUI();
    if (!voiceEnabled) stopAllSpeech();
  });

  // ===== Fullscreen toggle =====
  const fsBtn   = document.getElementById('fullscreen-btn');
  const fsEnter = document.getElementById('fs-icon-enter');
  const fsExit  = document.getElementById('fs-icon-exit');
  function inFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  function updateFSIcon() {
    const fs = inFullscreen();
    fsEnter.classList.toggle('hidden', fs);
    fsExit.classList.toggle('hidden', !fs);
  }
  fsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (inFullscreen()) {
      const fn = document.exitFullscreen || document.webkitExitFullscreen;
      if (fn) fn.call(document);
    } else {
      const el = document.documentElement;
      const fn = el.requestFullscreen || el.webkitRequestFullscreen;
      if (fn) fn.call(el);
    }
  });
  document.addEventListener('fullscreenchange', updateFSIcon);
  document.addEventListener('webkitfullscreenchange', updateFSIcon);
  updateFSIcon();

  // Settings button removed — use `setGoogleKey('...')` from the DevTools console to set/clear the key.

  // ===== Intro phase machine: atmosphere → narrating → ready → gone =====
  let introPhase = 'atmosphere';
  const introTitle = document.getElementById('intro-title');
  const introDate  = document.getElementById('intro-date');
  const tap1 = document.getElementById('intro-tap-1');
  const tap2 = document.getElementById('intro-tap-2');
  const narrationBox = document.getElementById('narration');
  const NARRATION = [
    "Es war einmal in Bagdad. Vor fast 1200 Jahren. Dort lebte ein Mann — klug, weise, wissbegierig — dem die Mathematik mehr bedeutete als alles andere.",
    "Eine Frage ließ ihn nicht los, und sie lässt bis heute niemanden los: Gehört die Mathematik zum Universum? Oder haben die Menschen sie erfunden?",
    "Eines Nachts, als die Stadt schon schlief, hörte er etwas. Zwei Glocken. Jede in ihrem eigenen Takt."
  ];
  const END_PARAGRAPHS = [
    "Al-Khwārizmī hat das alles im Jahr 832 entdeckt. Er hat gesehen und verstanden, dass Rhythmen etwas mit Zahlen und sogar mit Bruchrechnung zu tun haben. Die Mathematik und die Wirklichkeit gehen Hand in Hand. Die Mathematik beschreibt unsere Welt, unser Universum *sensationell* gut.",
    "Aber ist sie nun erfunden oder gehört sie zum Universum? Das konnte bis heute noch niemand wirklich schlüssig beweisen. Willst Du die Erste sein, die das beweist? Du kannst das!",
    "DENK DAS UNMÖGLICHE!",
    "THINK THE IMPOSSIBLE!"
  ];
  // Populate the <p> elements from the single source of truth above
  ['n1','n2','n3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = NARRATION[i];
  });

  async function startNarration() {
    introPhase = 'narrating';
    audio();
    // iOS Safari: prime speechSynthesis with a silent utterance inside the user gesture
    if ('speechSynthesis' in window) {
      try {
        const prime = new SpeechSynthesisUtterance(' ');
        prime.volume = 0;
        speechSynthesis.speak(prime);
      } catch (e) {}
    }
    tap1.classList.remove('start');
    tap1.style.animation = 'none';
    tap1.style.opacity = '0';
    introDate.classList.add('faded');
    narrationBox.classList.remove('hidden');

    const paras = ['n1','n2','n3'].map(id => document.getElementById(id));
    for (let i = 0; i < NARRATION.length; i++) {
      if (introPhase !== 'narrating') break;
      paras[i].classList.add('show');
      await speak(NARRATION[i]);
      if (introPhase !== 'narrating') break;
      if (i < NARRATION.length - 1) {
        paras[i].classList.remove('show');
        paras[i].classList.add('done');
        await wait(550);
      } else {
        await wait(450);
      }
    }
    introPhase = 'ready';
    tap2.classList.add('shown');
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function skipNarration() {
    introPhase = 'ready';
    stopAllSpeech();
    const ids = ['n1','n2','n3'];
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (i < ids.length - 1) { el.classList.remove('show'); el.classList.add('done'); }
      else { el.classList.add('show'); }
    });
    tap2.classList.add('shown');
  }

  function dismissIntro() {
    if (introPhase === 'gone') return;
    introPhase = 'gone';
    stopAllSpeech();
    showCornerToggles(false);   // leaving the start screen → hide the pills
    intro.classList.add('gone');
    setTimeout(() => {
      intro.style.display = 'none';
      advance(); // launch scenes[0]
    }, 650);
  }

  intro.addEventListener('click', (e) => {
    if (e.target.closest('.corner-btn')) return;
    if (introPhase === 'atmosphere') startNarration();
    else if (introPhase === 'narrating') skipNarration();
    else if (introPhase === 'ready') dismissIntro();
  });

  // #start / #intro → back to the very beginning (clear the saved scene, show the intro).
  const hashStart = /^#(start|intro|reset)$/.test(location.hash || '');
  // Debug: URL hash like #kgv3 / #add2 / #sub1 / #kgv4 jumps straight into that tutor level.
  const hashJump = (location.hash || '').match(/^#(kgv|add|sub)([1-4])$/);
  if (hashStart) {
    try { localStorage.removeItem('glocken_scene'); } catch (e) {}
    // fall through: no resume, no jump → the normal intro plays from the top
  } else if (hashJump) {
    gotoLevel(hashJump[1], parseInt(hashJump[2], 10));
  } else {
    // Resume at the last visited scene on reload (skip the intro). Cleared at the end,
    // so finishing the quest shows the intro fresh next time.
    try {
      const saved = parseInt(localStorage.getItem('glocken_scene'), 10);
      if (!isNaN(saved) && saved >= 0 && saved < scenes.length) {
        introPhase = 'gone';
        intro.classList.add('gone');
        intro.style.display = 'none';
        showCornerToggles(false);
        for (let i = 0; i <= saved; i++) advance(true);
      }
    } catch (e) {}
  }

  // Console/debug helper: jump to the very beginning from anywhere.
  window.gotoStart = () => {
    try { localStorage.removeItem('glocken_scene'); } catch (e) {}
    location.hash = 'start';
    location.reload();
  };
})();
