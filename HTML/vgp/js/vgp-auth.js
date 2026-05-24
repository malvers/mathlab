// VGP — part of the chat app, loaded in order (classic scripts share one global scope).
// Do NOT reorder the <script> tags in vgpchat.html; top-level code runs in document order.
// ===========================================================================
// HELP & STATS — info panels
// ===========================================================================
document.getElementById('help-close').onclick = () => document.getElementById('help-panel').classList.add('hidden');
document.getElementById('stats-close').onclick = () => document.getElementById('stats-panel').classList.add('hidden');

// Supabase free tier: 500 MB database. We can only estimate from message rows via the public key.
const FREE_DB_BYTES = 500 * 1024 * 1024;
function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(2) + ' MB';
}
async function showStats() {
  const panel = document.getElementById('stats-panel');
  const body = document.getElementById('stats-body');
  const bar = document.querySelector('#stats-bar div');
  panel.classList.remove('hidden');
  body.innerHTML = `<div class="row"><span>Lade…</span></div>`;
  if (!client) { body.innerHTML = `<div class="row"><span>Kein Client — erst Schlüssel eingeben.</span></div>`; return; }
  const { data, count, error } = await client
    .from('messages')
    .select('content,created_at', { count: 'exact' });
  if (error) { body.innerHTML = `<div class="row"><span>Fehler: ${escapeHtml(error.message)}</span></div>`; return; }
  // Estimate stored bytes from the ciphertext payloads (content), UTF-8 length
  const enc = new TextEncoder();
  let bytes = 0;
  for (const m of data) bytes += enc.encode(m.content || '').length;
  const pct = Math.min(100, bytes / FREE_DB_BYTES * 100);
  bar.style.width = pct.toFixed(2) + '%';
  body.innerHTML = `
    <div class="row"><span>Nachrichten</span><b>${count ?? data.length}</b></div>
    <div class="row"><span>Belegt (geschätzt)</span><b>${fmtBytes(bytes)}</b></div>
    <div class="row"><span>Free-Tier DB-Limit</span><b>500 MB</b></div>
    <div class="row"><span>Anteil</span><b>${pct < 0.01 ? '<0.01' : pct.toFixed(2)} %</b></div>`;
  dbg(`Stats: ${count ?? data.length} Nachrichten, ~${fmtBytes(bytes)}`);
}

// ===========================================================================
// AUTH — onboarding (sign up / join / login), password strength, eye toggle
// ===========================================================================
// --- Auth screen: sign up (Name + Konto-Passwort + Gruppen-Passwort) / login (Konto-Passwort) ---
const authPanel = document.getElementById('auth-panel');
const authNameEl = document.getElementById('auth-name');
const authGroupNameEl = document.getElementById('auth-groupname');
const authPwdEl = document.getElementById('auth-pwd');
const authRoomEl = document.getElementById('auth-room');
const authErr = document.getElementById('auth-err');
const authGo = document.getElementById('auth-go');
const authHint = document.getElementById('auth-hint');
const authForgot = document.getElementById('auth-forgot');
const authStrength = document.getElementById('auth-strength');
const authStrengthBar = document.getElementById('auth-strength-bar');
let authMode = 'login';

// Account-password strength: length is the main lever, variety adds a bit. ok = good enough to sign up.
function pwdStrength(p) {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (p.length < 8 || score <= 2) return { cls: 's-weak', ok: false };
  if (score <= 3) return { cls: 's-medium', ok: true };
  return { cls: 's-strong', ok: true };
}
// Live meter under the account-password field (sign-up only)
function updateStrengthMeter() {
  if (authMode !== 'create' && authMode !== 'join') return;
  const p = authPwdEl.value;
  authStrength.classList.toggle('hidden', !p);
  authStrengthBar.className = p ? pwdStrength(p).cls : '';
}

function showAuthErr(msg) { authErr.textContent = msg; authErr.classList.remove('hidden'); authGo.disabled = false; }
// Modes: 'create' (Gruppe gründen) · 'join' (beitreten) · 'login' (anmelden; restore if no local vault).
// create & join run the same backend (group password = the group); only the wording differs.
function setAuthMode(mode) {
  authMode = mode;
  ['create', 'join', 'login'].forEach(m => document.getElementById('tab-' + m).classList.toggle('active', mode === m));
  const isNew = (mode === 'create' || mode === 'join');
  const restore = mode === 'login' && !vaultExists(); // login on a device with no local vault → restore from server
  authNameEl.style.display = '';
  authGroupNameEl.style.display = (mode === 'create') ? '' : 'none'; // group name only when founding
  authGroupNameEl.value = '';
  authRoomEl.closest('.pwd-wrap').style.display = (isNew || restore) ? '' : 'none'; // hide the whole wrap (incl. its eye)
  authErr.classList.add('hidden');
  authPwdEl.value = '';
  authStrength.classList.add('hidden');
  authStrengthBar.className = '';
  authForgot.style.display = (mode === 'login' && vaultExists()) ? '' : 'none'; // only when there's a vault to log out
  if (mode === 'create') {
    authHint.style.display = '';
    authHint.textContent = 'Gründe deine Gruppe: gib ihr einen Namen und ein Gruppen-Passwort. Beides teilst du mit deinen Leuten — niemand sonst kann mitlesen.';
    authRoomEl.placeholder = 'Neues Gruppen-Passwort (zum Teilen)';
    authGo.textContent = 'Gruppe gründen';
    authNameEl.value = ''; authNameEl.readOnly = false;
  } else if (mode === 'join') {
    authHint.style.display = '';
    authHint.textContent = 'Tritt einer Gruppe bei: gib das Gruppen-Passwort ein, das du bekommen hast. Den Namen der Gruppe holen wir automatisch.';
    authRoomEl.placeholder = 'Gruppen-Passwort (erhalten)';
    authGo.textContent = 'Beitreten';
    authNameEl.value = ''; authNameEl.readOnly = false;
  } else if (restore) {
    authHint.style.display = '';
    authHint.textContent = 'Auf diesem Gerät anmelden: Name + Konto-Passwort + Gruppen-Passwort.';
    authRoomEl.placeholder = 'Gruppen-Passwort';
    authGo.textContent = 'Anmelden';
    authNameEl.value = ''; authNameEl.readOnly = false;
  } else {
    authHint.style.display = '';
    authHint.textContent = 'Willkommen zurück — entsperre dieses Gerät mit deinem Konto-Passwort.';
    authNameEl.value = vaultName();
    authNameEl.readOnly = true;
    authGo.textContent = 'Anmelden';
  }
}
document.getElementById('tab-create').onclick = () => setAuthMode('create');
document.getElementById('tab-join').onclick = () => setAuthMode('join');
document.getElementById('tab-login').onclick = () => setAuthMode('login');

async function authSubmit() {
  authErr.classList.add('hidden');
  authGo.disabled = true;
  try {
    await ensureClient(); // needed up-front: group_meta lookup runs BEFORE initChat creates the client
    if (authMode === 'create' || authMode === 'join') {
      const name = authNameEl.value.trim().toLowerCase();
      const pwd = authPwdEl.value, room = authRoomEl.value;
      if (!name || !pwd || !room) return showAuthErr('Bitte alle Felder ausfüllen.');
      // Validate the account password — it is the only thing protecting the local vault.
      if (!pwdStrength(pwd).ok) return showAuthErr('Konto-Passwort zu schwach — mind. 8 Zeichen, besser mit Zahl & Sonderzeichen.');
      // The group password IS the group: who knows it, joins it. (No fixed access code anymore.)
      if (room.length < 6) return showAuthErr('Gruppen-Passwort: mindestens 6 Zeichen.');
      // DATA-LOSS GUARD: create/join here makes a NEW account and REPLACES the one on this device
      // (new keypair + only this group → existing groups would be gone). Adding a group to the
      // CURRENT account is done via ⋮ → "Neue Gruppe" (joinGroup, keeps groups + keys). Never wipe silently.
      if (vaultExists()) {
        const cur = vaultName() || 'dein Konto';
        const ok = await uiConfirm(
          `Achtung: „${authMode === 'create' ? 'Gründen' : 'Beitreten'}" legt hier ein NEUES Konto an und ERSETZT „${cur}" auf diesem Gerät — mit allen seinen Gruppen.\n\nEine weitere Gruppe fügst du zu „${cur}" über das ⋮-Menü → „Neue Gruppe" hinzu (behält alles).\n\nTrotzdem ein neues Konto anlegen?`,
          { okText: 'Konto ersetzen', danger: true });
        if (!ok) return;
      }
      // The shared group name decides found-vs-join — and catches a mistyped group password.
      const existing = await readGroupMeta(room);
      let groupLabel;
      if (authMode === 'create') {
        const gname = authGroupNameEl.value.trim();
        if (!gname) return showAuthErr('Bitte einen Gruppennamen eingeben.');
        if (existing && existing !== 'NOMETA') return showAuthErr(`Dieses Gruppen-Passwort gehört schon zur Gruppe „${existing}". Nutze „Beitreten" — oder wähle ein anderes Passwort.`);
        groupLabel = gname;
      } else { // join: the name comes from the server, not typed
        if (existing === null) {
          // Group password points at no existing group → typo, or it was never founded.
          if (await uiConfirm('Zu diesem Gruppen-Passwort gibt es noch keine Gruppe.\n\nHast du dich vertippt — oder willst du sie jetzt gründen?', { okText: 'Gründen' })) {
            setAuthMode('create'); authRoomEl.value = room; authGroupNameEl.focus();
          }
          return;
        }
        groupLabel = (existing === 'NOMETA') ? 'Gruppe' : existing; // legacy fallback if table missing
      }
      signingUp = true; // claimName runs after initChat → don't let the alive-check fire too early
      const vault = await createVault(name, pwd, room, groupLabel);
      await activateVault(vault);
      sessionStorage.setItem(SESSION_PWD_KEY, pwd); // stay unlocked across reloads in this tab
      authPanel.classList.add('hidden');
      await initChat();
      const ok = await claimName(name); // bind name ↔ key
      if (!ok) {
        // Name already taken by someone else → roll back the just-created account, back to sign up
        localStorage.removeItem(VAULT_KEY);
        location.reload();
        return;
      }
      localStorage.setItem(NAME_KEY, name);
      if (authMode === 'create') await writeGroupMeta(room, groupLabel); // publish the shared group name once
      // Multi-device: stash an encrypted backup on the server + show the one-time recovery code
      const recovery = await createBackup(pwd, vault);
      if (recovery) { localStorage.setItem(BACKUP_OK_KEY, '1'); showRecoveryModal(recovery); }
      signingUp = false; // identity is now claimed → alive-check may run normally
    } else if (!vaultExists()) {
      // Restore on a new device: Name + Konto-Pwd + Gruppen-Pwd → fetch & decrypt the server backup
      const name = authNameEl.value.trim().toLowerCase();
      const pwd = authPwdEl.value, room = authRoomEl.value;
      if (!name || !pwd || !room) return showAuthErr('Name, Konto-Passwort und Gruppen-Passwort eingeben.');
      const res = await restoreBackup(name, room, pwd, false);
      if (res === 'NONE') return showAuthErr('Kein Konto mit diesem Namen gefunden.');
      if (res === 'WRONG' || !res) return showAuthErr('Falsches Konto- oder Gruppen-Passwort.');
      await writeLocalVault(res.name, pwd, res); // import the identity onto this device
      await activateVault(res);
      localStorage.setItem(BACKUP_OK_KEY, '1'); // we just restored from the backup → it exists
      sessionStorage.setItem(SESSION_PWD_KEY, pwd);
      authPanel.classList.add('hidden');
      await initChat();
      localStorage.setItem(NAME_KEY, res.name);
    } else {
      const pwd = authPwdEl.value;
      if (!pwd) return showAuthErr('Konto-Passwort eingeben.');
      const vault = await openVault(pwd);
      if (vault === 'WRONG' || !vault) return showAuthErr('Falsches Konto-Passwort.');
      await activateVault(vault);
      sessionStorage.setItem(SESSION_PWD_KEY, pwd); // stay unlocked across reloads in this tab
      authPanel.classList.add('hidden');
      await initChat();
      await ensureBackup(pwd, vault); // older accounts: create the server backup on first login
    }
  } catch (e) {
    showAuthErr('Fehler: ' + e.message);
  } finally {
    authGo.disabled = false;
  }
}
authGo.onclick = authSubmit;
// Enter advances to the next VISIBLE field (login hides name+room); on the last one it submits.
const authFields = [authNameEl, authGroupNameEl, authPwdEl, authRoomEl];
authFields.forEach(el => el.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const next = authFields.slice(authFields.indexOf(el) + 1).find(f => f.offsetParent !== null);
  if (next) next.focus(); else authSubmit();
}));
authPwdEl.addEventListener('input', updateStrengthMeter);
// Show/hide a password field AND swap the eye icon (open ↔ crossed-out)
function setupPwdEye(input, btn) {
  btn.onclick = () => {
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    btn.querySelector('svg').innerHTML = reveal
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
    input.focus();
  };
}
setupPwdEye(authPwdEl, document.getElementById('auth-pwd-eye'));
setupPwdEye(authRoomEl, document.getElementById('auth-room-eye'));
// Log out on THIS device only. The account stays on the server (encrypted backup),
// so you can sign back in anywhere with Name + Konto-Passwort + Gruppen-Passwort.
async function logoutDevice() {
  if (!await uiConfirm('Auf diesem Gerät abmelden?\n\nDein Konto bleibt erhalten — du kannst dich jederzeit wieder anmelden mit Name + Konto-Passwort + Gruppen-Passwort (oder dem Recovery-Code).', { okText: 'Abmelden' })) return;
  sessionStorage.removeItem(SESSION_PWD_KEY);
  localStorage.removeItem(VAULT_KEY);
  localStorage.removeItem(BACKUP_OK_KEY);
  location.reload();
}
// Lock-screen link: switch to a different account (same local wipe as logging out).
document.getElementById('auth-forgot').onclick = logoutDevice;
// Profile overflow menu (⋮) — account actions (delete account for now; grows later)
// ===========================================================================
// MENU & GROUPS — ⋮ menu, group switcher, create/join a group
// ===========================================================================
const headMenu = document.getElementById('head-menu');
document.getElementById('menu-btn').onclick = e => { e.stopPropagation(); headMenu.classList.toggle('hidden'); };
document.getElementById('menu-e2e').onclick = () => { headMenu.classList.add('hidden'); uiConfirm('Ende-zu-Ende-verschlüsselt: Nachrichten werden nur auf den Geräten der Teilnehmer ver- und entschlüsselt (AES-256-GCM). Niemand dazwischen — auch der Server nicht — kann sie lesen.', { alert: true, okText: 'Alles klar' }); };
document.getElementById('menu-logout').onclick = () => { headMenu.classList.add('hidden'); logoutDevice(); };
document.getElementById('menu-delete').onclick = () => { headMenu.classList.add('hidden'); deleteAccount(); };
const grpActions = document.getElementById('grp-actions');
// Open the group-actions popup anchored to the active group's ⋮ button.
function openGrpActions(btn) {
  document.getElementById('ga-rename').textContent = `Gruppe ${activeGroupLabel()} umbenennen`;
  const r = btn.getBoundingClientRect();
  grpActions.style.left = Math.min(r.right + 6, window.innerWidth - 200) + 'px';
  grpActions.style.top = r.top + 'px';
  grpActions.classList.remove('hidden');
}
// "Neue Gruppe" → one dialog asks for name + password; founds a new group (must NOT already exist).
document.getElementById('ga-new').onclick = async () => {
  grpActions.classList.add('hidden');
  const res = await uiNewGroup();
  if (!res) return;
  const label = res.name, pwd = res.pwd;
  if (!label) { uiConfirm('Bitte einen Gruppennamen eingeben.', { alert: true, okText: 'OK' }); return; }
  if (pwd.length < 6) { uiConfirm('Gruppen-Passwort: mindestens 6 Zeichen.', { alert: true, okText: 'OK' }); return; }
  const existing = await readGroupMeta(pwd);
  if (existing && existing !== 'NOMETA') {           // password already belongs to a group
    uiConfirm(`Dieses Gruppen-Passwort gehört schon zur Gruppe „${existing}". Nutze „Gruppe beitreten" — oder wähle ein anderes Passwort.`, { alert: true, okText: 'OK' });
    return;
  }
  if (existing !== 'NOMETA') await writeGroupMeta(pwd, label); // publish the shared name
  joinGroup(pwd, label);
};
// "Gruppe beitreten" → join an existing group (must already exist).
document.getElementById('ga-join').onclick = async () => {
  grpActions.classList.add('hidden');
  const pwd = (await uiPrompt('Gruppen-Passwort der Gruppe, der du beitreten willst (min. 6 Zeichen):', { placeholder: 'Gruppen-Passwort', password: true, okText: 'Beitreten' }) || '').trim();
  if (!pwd) return;
  if (pwd.length < 6) { uiConfirm('Gruppen-Passwort: mindestens 6 Zeichen.', { alert: true, okText: 'OK' }); return; }
  const existing = await readGroupMeta(pwd);
  if (existing === null) {                           // no group for this password
    uiConfirm('Zu diesem Gruppen-Passwort gibt es noch keine Gruppe. Prüfe das Passwort — oder leg sie über „Neue Gruppe" an.', { alert: true, okText: 'OK' });
    return;
  }
  joinGroup(pwd, existing === 'NOMETA' ? 'Gruppe' : existing);   // legacy fallback if meta table missing
};
document.getElementById('ga-rename').onclick = () => { grpActions.classList.add('hidden'); renameGroup(); };
// Render the group list inside the ⋮ menu (active group marked); each entry switches groups.
function renderGroupMenu() {
  const box = document.getElementById('menu-groups');
  box.innerHTML = '';
  if (myGroups.length < 2) return; // progressive disclosure: no switcher until there's a 2nd group
  for (const g of myGroups) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'menu-group' + (g.pwd === activeGroupPwd ? ' active' : '');
    b.textContent = '👥 ' + g.label + (g.pwd === activeGroupPwd ? ' ✓' : '');
    b.onclick = () => { headMenu.classList.add('hidden'); switchGroup(g.pwd); };
    box.appendChild(b);
  }
}
// Reset the chat pane (used when switching/joining groups → different contact set)
function resetChatView() {
  activePeer = null;
  activeRoom = false;
  document.getElementById('chat-peer').textContent = '';
  const av = document.getElementById('chat-peer-av'); av.textContent = ''; av.style.backgroundImage = ''; av.className = '';
  document.getElementById('chat-watermark').classList.remove('hidden');
  document.getElementById('app').classList.remove('room-mode');
  messagesEl.innerHTML = '';
  msgInput.disabled = true;
}
// Switch the active group: re-derive group keys, persist, reload that group's contacts.
async function switchGroup(pwd) {
  if (pwd === activeGroupPwd || !myGroups.some(g => g.pwd === pwd)) return;
  activeGroupPwd = pwd;
  collapseInactive(); // focus: the newly active group opens, the others fold away
  await initCrypto(pwd); // re-derive hmacKey/dirKey/group_id for the new active group
  const accountPwd = sessionStorage.getItem(SESSION_PWD_KEY);
  if (accountPwd) { const v = await openVault(accountPwd); if (v && v !== 'WRONG') { v.activeGroup = pwd; await writeLocalVault(v.name, accountPwd, v); } }
  resetChatView();
  await loadContacts();
  dbg('Gruppe gewechselt');
}
// Fold every group except the active one (called when the active group changes / on first load).
function collapseInactive() {
  collapsedGroups = new Set(myGroups.filter(g => g.pwd !== activeGroupPwd).map(g => g.pwd));
}
// Join/create a group: add it to the vault, register the identity in it, refresh the server backup.
async function joinGroup(groupPwd, label) {
  groupPwd = (groupPwd || '').trim();
  if (groupPwd.length < 6) { alert('Gruppen-Passwort: mindestens 6 Zeichen.'); return; }
  if (myGroups.some(g => g.pwd === groupPwd)) { await switchGroup(groupPwd); return; }
  const accountPwd = sessionStorage.getItem(SESSION_PWD_KEY);
  if (!accountPwd) { alert('Bitte einmal ab- und wieder anmelden, dann „Neue Gruppe".'); return; }
  const v = await openVault(accountPwd);
  if (!v || v === 'WRONG') { alert('Konto-Passwort nicht verfügbar.'); return; }
  const prevGroups = v.groups.slice(), prevActive = v.activeGroup;
  v.groups = [...v.groups, { pwd: groupPwd, label: (label || 'Gruppe').trim() }];
  v.activeGroup = groupPwd;
  await writeLocalVault(v.name, accountPwd, v);
  await activateVault(v);
  const ok = await claimName(v.name); // register identity in the new group's namespace
  if (!ok) { // name taken in that group → roll back cleanly
    v.groups = prevGroups; v.activeGroup = prevActive;
    await writeLocalVault(v.name, accountPwd, v);
    await activateVault(v);
    await loadContacts();
    return;
  }
  const recovery = await createBackup(accountPwd, v); // refresh backup (now incl. the new group)
  if (recovery) { localStorage.setItem(BACKUP_OK_KEY, '1'); showRecoveryModal(recovery); }
  resetChatView();
  await loadContacts();
  dbg('Gruppe beigetreten: ' + (label || ''));
}
document.addEventListener('click', e => {
  if (!headMenu.contains(e.target)) headMenu.classList.add('hidden');
  if (!grpActions.contains(e.target) && !(e.target.closest && e.target.closest('.gh-menu'))) grpActions.classList.add('hidden');
});
// Back button (mobile): return from the open chat to the contact list
document.getElementById('back-btn').onclick = () => document.getElementById('app').classList.remove('chat-open');

// On start: if this tab still holds the account password (sessionStorage, cleared on tab close /
// lock), auto-unlock so a hard reload doesn't ask again. Otherwise show login / sign-up.
// Run startup AFTER all script files have executed. We're split across several <script> files now,
// and openVault()/activateVault()/initChat() live in later files — a setTimeout(0) could fire
// between files (esp. Safari) and hit an undefined function. DOMContentLoaded fires once all the
// parser-blocking scripts at the end of <body> have run, so every helper is defined by then.
function vgpStartup() {
  const cached = sessionStorage.getItem(SESSION_PWD_KEY);
  if (vaultExists() && cached) {
    openVault(cached).then(async v => {
      if (v && v !== 'WRONG') {
        await activateVault(v);
        authPanel.classList.add('hidden');
        await initChat();
        await ensureBackup(cached, v); // older accounts: create the server backup if missing
      } else {
        sessionStorage.removeItem(SESSION_PWD_KEY);
        setAuthMode('login'); authPanel.classList.remove('hidden');
      }
    }).catch(e => { dbg('Auto-Unlock Fehler: ' + (e && e.message ? e.message : e)); setAuthMode(vaultExists() ? 'login' : 'create'); authPanel.classList.remove('hidden'); });
  } else {
    setAuthMode(vaultExists() ? 'login' : 'create');
    authPanel.classList.remove('hidden');
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', vgpStartup);
else vgpStartup();

// Derive the HMAC key (name uniqueness) from the room password. No AES key here anymore —
// 1:1 message encryption uses per-pair ECDH keys (deriveChatKey), not the room password.
