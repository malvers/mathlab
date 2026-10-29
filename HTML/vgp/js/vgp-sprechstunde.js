// VGP — the "Sprechstunde" row on top of the contact list (Doc, 29.10.2026): pupils write to Doc
// anonymously from the students' plan (svp/sprechstunde.html), he answers in his Kontakt app (../kontakt/).
// Shown ONLY when this browser is logged in with Doc's SVP account - family members never see it,
// and nothing else in VGP changes. Loaded after vgp-contacts.js (wraps renderContacts) and after
// ../svp/svp-auth.js + ../svp/sprechstunde-core.js (session, red phone).
(function () {
  const DOC_UID = '2889073e-cbb8-4ca1-ad48-5234abe40585';   // same uid as in the RLS policies
  const A = window.svpAuth;
  const isDoc = () => {
    try {
      const p = A.session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(p)).sub === DOC_UID;
    } catch (e) { return false; }
  };
  if (!A || !window.Sprechstunde || typeof renderContacts !== 'function' || !isDoc()) return;

  let unread = 0;
  let ready = false;   // the row appears only once the database answers (the SQL is in)

  function row() {
    const div = document.createElement('div');
    div.className = 'contact sprechstunde';
    div.id = 'sprechstunde-row';
    div.innerHTML = '<span class="av">' + Sprechstunde.PHONE + '</span><span class="nm">Kontakt</span><div class="c-meta"></div>';
    const img = div.querySelector('img');
    img.style.width = img.style.height = '30px';   // the red telephone in VGP's avatar circle
    div.onclick = () => { location.href = '../kontakt/'; };
    return div;
  }

  function paintBadge() {
    const meta = document.querySelector('#sprechstunde-row .c-meta');
    if (meta) meta.innerHTML = unread ? '<span class="c-badge">' + (unread > 99 ? '99+' : unread) + '</span>' : '';
  }

  // every contact-list repaint puts the row back on top
  const original = renderContacts;
  renderContacts = function (filter) {
    original(filter);
    addRow();
  };

  function addRow() {
    const list = document.getElementById('contact-list');
    if (ready && list && !document.getElementById('sprechstunde-row')) list.prepend(row());
    paintBadge();
  }

  async function refresh() {
    try {
      const res = await A.api('rpc/chat_unread', { method: 'POST', body: '{}' });
      if (res.ok) { unread = Number(await res.json()) || 0; ready = true; addRow(); }
    } catch (e) { /* offline / logged out - keep the last count */ }
  }

  // no repaint of our own here: VGP paints the list once its groups are loaded, and the wrapper adds the row then
  Sprechstunde.poll(refresh, 60000);
})();
