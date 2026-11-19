// VGP — start mode, resolved in <head> before anything paints (so the hidden sidebar never flashes).
// Pair mode (Doc, 19.11.2026: one chat with the partner, no account, no password) is the default.
// The group VGP stays complete — code and data — behind a hidden switch:
//   • vgpchat.html?modus=gruppe   (or long-press the partner's name in the chat header)
//   • vgpchat.html?modus=paar     (or ⋮ → "Paar-Chat" in the group menu) brings pair mode back.
// The choice is remembered per device in localStorage ('vgp-mode').
(function () {
  const KEY = 'vgp-mode';
  let mode = null;
  try {
    const p = new URLSearchParams(location.search).get('modus');
    if (p === 'gruppe' || p === 'paar') localStorage.setItem(KEY, p);
    mode = localStorage.getItem(KEY);
  } catch (_) { /* storage blocked → default */ }
  window.VGP_MODE = mode === 'gruppe' ? 'gruppe' : 'paar';
  document.documentElement.classList.toggle('vgp-pair', window.VGP_MODE === 'paar');
})();
