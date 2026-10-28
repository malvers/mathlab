/* cv-key.js – the key of the CV documents, for every page that shows sealed files with it.
   scripts/cv-docs.mjs seals the scans of cv.html (resources/cv-docs) and the pictures of
   the-real-salary.html (resources/real-salary) with ONE data key: key.json holds it wrapped
   with PBKDF2(password); every <name>.bin is "CVD1" | iv 12 | AES-GCM.
   The unwrapped key is remembered on the device as a non-extractable CryptoKey in IndexedDB
   "cv-docs" (store "keys", entry "data") – the same entry cv.html uses, so a device that has
   opened the CV documents opens the other pages without asking again. The password itself
   is never stored. */
(function () {
  "use strict";
  if (window.CvKey) return;

  const KEY_URL = "resources/cv-docs/key.json";
  const b64 = (t) => Uint8Array.from(atob(t), (c) => c.charCodeAt(0));
  let keyFileP = null;

  function keyFile() {
    keyFileP = keyFileP || fetch(KEY_URL, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).catch((e) => { keyFileP = null; throw e; });
    return keyFileP;
  }

  /* throws an error with .pw = true when the password does not open key.json */
  async function fromPassword(pw) {
    const kf = await keyFile();
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
    const kek = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64(kf.salt), iterations: kf.iter, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    let raw;
    try { raw = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(kf.iv) }, kek, b64(kf.key)); }
    catch (e) { const err = new Error("wrong password"); err.pw = true; throw err; }
    return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);  /* non-extractable */
  }

  /* a remembered key fits as long as the files were sealed with it (new password = new key) */
  async function fits(key) {
    const c = b64((await keyFile()).check);
    try { await crypto.subtle.decrypt({ name: "AES-GCM", iv: c.subarray(0, 12) }, key, c.subarray(12)); return true; }
    catch (e) { return false; }
  }

  /* the plain bytes of one sealed file; init goes to fetch (e.g. { cache: "no-cache" }) */
  async function open(key, url, init) {
    const r = await fetch(url, init);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const bin = new Uint8Array(await r.arrayBuffer());
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: bin.subarray(4, 16) }, key, bin.subarray(16));
  }

  /* every IndexedDB access may fail (private mode) */
  function idb(mode, fn) {
    return new Promise((resolve, reject) => {
      const rq = indexedDB.open("cv-docs", 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore("keys");
      rq.onerror = () => reject(rq.error);
      rq.onsuccess = () => {
        const tx = rq.result.transaction("keys", mode);
        const req = fn(tx.objectStore("keys"));
        tx.oncomplete = () => { rq.result.close(); resolve(req.result); };
        tx.onerror = () => { rq.result.close(); reject(tx.error); };
      };
    });
  }
  const load = () => idb("readonly", (st) => st.get("data")).catch(() => null);
  const save = (key) => idb("readwrite", (st) => st.put(key, "data")).catch(() => {});
  const drop = () => idb("readwrite", (st) => st.delete("data")).catch(() => {});

  /* the remembered key, or null when there is none or it no longer fits */
  async function remembered() {
    const key = await load();
    if (!key) return null;
    if (await fits(key)) return key;
    await drop();
    return null;
  }

  /* pages unlock by script, so Chrome would not offer to save the password by itself */
  function rememberInChrome(pw) {
    if (!window.PasswordCredential || !navigator.credentials) return Promise.resolve();
    const store = navigator.credentials.store(
      new PasswordCredential({ id: "cv-dokumente", name: "Dokumente – Dr. Michael R. Alvers", password: pw })).catch(() => {});
    return Promise.race([store, new Promise((r) => setTimeout(r, 1500))]);
  }

  window.CvKey = { fromPassword, fits, open, remembered, save, drop, rememberInChrome };
})();
