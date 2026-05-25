// VGP — Web Push (Phase 1: permission + subscribe + store the subscription).
// E2E-friendly: pushes are content-less "you have a new message" pings (the server can't read messages),
// so nothing secret leaves the device here. The actual send happens server-side in Phase 2 (Edge Function).
// Depends on globals: ensureClient, client, dbg, uiConfirm (setup) · myPubB64 (crypto).

// Public VAPID key — safe to ship in the client. The matching private key is a server-only secret.
const VAPID_PUBLIC = 'BG84swdCjSLS8IzPrfbyokHl-gjdx5MEahdLbZDbDgxzd9x7_BV6iqrVVveWfw4bPwV5Rach0K2_RfzL5RCOvW8';

// applicationServerKey must be a Uint8Array of the raw key bytes (base64url → bytes).
function urlB64ToUint8(b64) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const s = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(s);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

// Make sure the (site-wide) service worker is registered so we can subscribe. Mirrors vgpapp.html.
async function ensurePushSW() {
  if (!('serviceWorker' in navigator)) return null;
  try { await navigator.serviceWorker.register('../sw.js'); } catch (_) {}
  return navigator.serviceWorker.ready;
}

// The device's group room_ids (= group_id), so "an alle" pings fan out to all members.
function pushRoomIds() {
  try {
    return (typeof groupsData !== 'undefined' && Array.isArray(groupsData))
      ? groupsData.map((g) => g.groupId).filter(Boolean) : [];
  } catch (_) { return []; }
}

async function enablePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    uiConfirm('Dieser Browser unterstützt keine Push-Benachrichtigungen.', { alert: true, okText: 'OK' });
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { dbg('Push: Erlaubnis nicht erteilt (' + perm + ')'); return; }

  const reg = await ensurePushSW();
  if (!reg) { dbg('Push: kein Service-Worker'); return; }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8(VAPID_PUBLIC)
  });
  const j = sub.toJSON();

  await ensureClient();
  const { error } = await client.from('push_subscriptions').upsert({
    pubkey: myPubB64,
    endpoint: sub.endpoint,
    p256dh: j.keys.p256dh,
    auth: j.keys.auth,
    rooms: pushRoomIds()
  }, { onConflict: 'endpoint' });

  if (error) { dbg('Push: Speichern fehlgeschlagen — ' + error.message); return; }
  dbg('Push: aktiviert, Abo gespeichert (endpoint …' + sub.endpoint.slice(-12) + ')');
  refreshPushBell();
  uiConfirm('Benachrichtigungen sind aktiviert. 🔔', { alert: true, okText: 'Super' });
}

// Show the 🔔 next to the name only when a push subscription really exists (survives reloads).
async function refreshPushBell() {
  const bell = document.getElementById('push-bell');
  if (!bell) return;
  let on = false;
  try {
    if ('Notification' in window && Notification.permission === 'granted' && 'serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      on = !!(reg && (await reg.pushManager.getSubscription()));
    }
  } catch (_) {}
  bell.classList.toggle('hidden', !on);
}
refreshPushBell();
