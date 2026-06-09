// js/upload-media.js — upload a media blob (photo / voice / video) to Cloudflare R2 via the
// "media-sign" edge function (presigned PUT → direct client→R2). Returns { url, key, mime }. THROWS
// on any failure so the caller can fall back to keeping the base64 inline (offline-resilient — never
// lose a photo/clip). No R2 credentials in the client. Classic global: window.uploadMedia.
(function (global) {
    'use strict';
    const SIGN_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/media-sign';
    const SB_ANON = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe

    // Upload `blob` (kind: 'photo' | 'voice' | 'video'). opts.authToken = the signed-in user's Supabase
    // access_token (media-sign is JWT-gated); opts.ownerId = an unguessable owner prefix for the R2 key.
    async function uploadMedia(blob, kind, opts) {
        opts = opts || {};
        const mime = (blob && blob.type) || (kind === 'video' ? 'video/mp4' : kind === 'voice' ? 'audio/mp4' : 'image/jpeg');
        const bearer = opts.authToken || SB_ANON; // anon only works if the fn is deployed --no-verify-jwt (test mode)

        // 1) ask the edge function for a presigned PUT url (it holds the R2 keys)
        const sres = await fetch(SIGN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': SB_ANON, 'Authorization': 'Bearer ' + bearer },
            body: JSON.stringify({ kind: kind || 'photo', mime: mime, ownerId: opts.ownerId || 'anon' }),
        });
        if (!sres.ok) throw new Error('media-sign ' + sres.status + ': ' + (await sres.text()).slice(0, 200));
        const sig = await sres.json();
        if (!sig.putUrl || !sig.getUrl) throw new Error('media-sign: keine putUrl/getUrl');

        // 2) PUT the bytes straight to R2 (no proxy → works for big video too)
        const pres = await fetch(sig.putUrl, { method: 'PUT', headers: { 'Content-Type': mime }, body: blob });
        if (!pres.ok) throw new Error('R2 PUT ' + pres.status + ': ' + (await pres.text()).slice(0, 120));

        return { url: sig.getUrl, key: sig.key, mime: mime };
    }

    // Convenience: a `data:...;base64,...` URL → Blob (the current photos/voice are stored as data-URLs).
    function dataUrlToBlob(dataUrl) {
        const i = String(dataUrl).indexOf(',');
        const head = dataUrl.slice(0, i), body = dataUrl.slice(i + 1);
        const mime = (head.match(/data:([^;]+)/) || [, 'application/octet-stream'])[1];
        const bin = atob(body), arr = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j);
        return new Blob([arr], { type: mime });
    }

    global.uploadMedia = uploadMedia;
    global.dataUrlToBlob = dataUrlToBlob;
})(typeof window !== 'undefined' ? window : this);
