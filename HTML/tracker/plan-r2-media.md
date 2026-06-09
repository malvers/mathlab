# Tracker — Medien (Foto/Voice/Video) in Cloudflare R2

> Plan + erste additive Bausteine. Stand: 2026-06-09. Ziel: Binärmedien raus aus der DB-`waypoints`-
> Spalte (base64) in **Cloudflare R2** (10 GB frei, **Egress gratis**, S3-kompatibel, CDN+Range).
> Auslöser: **Video-Clips** — die *müssen* in einen Object-Store (zu groß/streaming für DB).

## Architektur — Client lädt DIREKT zu R2, Credentials bleiben server-seitig
```
[App] ──(1) {kind,mime} ──► [Edge Fn media-sign]  (signiert presigned PUT mit R2-Keys, SigV4)
      ◄──(2) {putUrl,getUrl,key}──┘
[App] ──(3) PUT blob ───────► [R2 bucket]          (direkt, KEIN Proxy → keine Size/Time-Limits)
      wp.url = getUrl
[Viewer/Live/Renderer] ──GET──► [R2 via media.docalvers.de + CDN]  (Range, Streaming, 0 € Egress)
```
**Warum presigned:** Edge-Functions haben Payload-/Zeitlimits → Video würde sprengen. Presign = nur
Signatur (winzig), der Blob geht direkt Client→R2.

## Cloudflare-Setup (Dashboard, NICHT im Repo)
1. R2-Bucket `tracker-media`.
2. **Custom Domain** `media.docalvers.de` aufs Bucket (saubere öffentliche GET-URLs + CDN).
3. **CORS** am Bucket: erlaube `PUT` + `GET` von `https://docalvers.de` (Header `content-type`, `*`).
4. **R2 API-Token** (Access Key + Secret). ⚠️ **Secrets — NUR als Supabase-Edge-Secrets**, nie ins
   Repo (Rule 18): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
   `R2_PUBLIC_BASE` (= `https://media.docalvers.de`).

## Code-Bausteine
- **`supabase/functions/media-sign/index.ts`** (GEBAUT): POST `{kind, mime, ownerId?}` → würfelt
  unrätselbaren Key `<owner>/<ts>-<uuid>.<ext>`, presigned PUT-URL (≈300 s) via `aws4fetch` (SigV4,
  service `s3`, region `auto`), liefert `{ putUrl, getUrl, key }`.
- **`HTML/js/upload-media.js`** (GEBAUT): `window.uploadMedia(blob, kind, ownerId) → {url, key, mime}`
  — holt presign, `PUT`tet den Blob, gibt die öffentliche URL. Wirft bei Fehler (→ Offline-Fallback).
- **Noch zu bauen (nach R2-Setup + Commit):** Wegpunkt-Modell `{type,lat,lng,t,url,mime,dur?}`;
  Wiring in `tracker-media.js` (`capturePhoto`/`addPhotoAt`/`addVoiceAt`/`broadcastPhoto`);
  **Video-Capture + `<video>`-Player in der Lightbox + Video-Pin**; Migrations-Skript.

## Sicherheit (Gate gegen fremde Uploads)
- **media-sign WITHOUT `--no-verify-jwt` deployen** → nur Anfragen mit gültigem Supabase-User-JWT
  kommen durch. Der Tracker ist über den Sync-Code als Code-Konto eingeloggt → hat `session.access_token`;
  `uploadMedia` schickt den als `Authorization: Bearer`. Kein Client-Secret nötig (das wäre public).
- Für den ALLERERSTEN Ketten-Test darf man kurz `--no-verify-jwt` nehmen, danach gated re-deployen.
- Key-Pfade unrätselbar; Bucket public-read (passt zum Token-Share-Modell, Bilder/Clips nicht geheim).
  Für E2E später: `encryptBytes` vor dem PUT → R2 sieht nur Ciphertext (Bucket bleibt public, egal).

## Rückwärtskompatibel (kein Renderer-Edit)
`img.src=wp.url` / `<video src=wp.url>` / `<audio>` laden eine `https://`-URL **genauso** wie `data:`-base64
→ alte Tracks (base64) + neue (URL) laufen parallel. GPX bettet kein Bild ein → unberührt.

## Offline-Resilienz (MUSS)
Upload scheitert (offline) → base64 in `wp.url`/`wp.img` belassen (+ IndexedDB-Buffer) → beim nächsten
Online-Sync hochladen, auf URL umstellen, Row updaten. **Nie ein Foto/Clip verlieren.**

## Reihenfolge
1. **Aktuellen Stapel committen** (Refactor liegt uncommitted).
2. Cloudflare: Bucket + Domain + CORS + Token + Supabase-Secrets (Doc).
3. `media-sign` deployen, Kette an **einem Foto** verifizieren (kleinster Fall).
4. **Video**: Capture + Player + Pin.
5. Voice + Bestandsfotos (169) migrieren (idempotentes Skript).
6. (Optional) E2E: `encryptBytes` vor dem PUT.

## Caveats
- Content-Type beim PUT: ob R2 den ungesignt übernimmt → beim Test prüfen (sonst signiert mitgeben).
- CORS am Bucket korrekt (sonst PUT/GET vom Browser blockiert).
- Egress entsteht weiter beim *Ansehen* — aber bei R2 **gratis** + CDN-gecacht.
- DB-Umzug ist NICHT nötig (die `tracks`-Tabelle bleibt; nur `waypoints[].url` statt base64).

Gehört zu [[project_tracker_lab]] / [[project_tracker_fotospur]] / [[project_tracker_photos_storage_plan]].
