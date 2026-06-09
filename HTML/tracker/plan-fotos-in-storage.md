# Tracker — Plan: Fotos aus der DB in Supabase Storage

> Recherche-/Plan-Notiz, **noch nicht gebaut** (CLAUDE.md Regeln 2/4). Stand: 2026-06-09.
> Ziel: die base64-Fotos aus der `waypoints`-Spalte (DB) in einen **Storage-Bucket** verlagern.

## Warum (gemessen 2026-06-09)
- Free-Tier-DB-Cap = **500 MB**. Fotos liegen als **base64 in `waypoints.img`** (jsonb) → der einzige Größentreiber.
- Konto nv7e: **28 MB / 169 Fotos** (~5,6 % von 500 MB), ~**160 KB/Foto** (base64). → **500 MB ≈ ~3.000 Fotos**. ~10× Luft, aber endlich.
- Zweitproblem **Egress** (Free 5 GB/Mon): base64 wird bei **jedem LADEN, jedem Live-Viewer, jedem Autosync-Upsert** komplett mitübertragen.
- base64 bläht zusätzlich **+33 %** ggü. dem rohen JPEG auf.

## Zielbild
- **Bucket** (z. B. `track-photos`) hält die JPEGs **binär**. `waypoints[].img` enthält nur noch die **URL**.
- DB fällt auf **< 1 MB** (nur lat/lng/t/title/text + URL) → 500-MB-Cap praktisch irrelevant.
- Storage Free = **1 GB**, binär statt base64 (~25 % kleiner) → ~**6.000 Fotos**.
- Viewer lädt nur **geöffnete** Bilder per URL (lazy, CDN-cachebar) statt alle base64 → Egress sinkt drastisch.
- Live-Broadcast sendet nur noch die **URL** statt des ganzen base64-Bildes → winzige Realtime-Messages.

## Was sich NICHT ändert (gut!)
- **Renderer** `photo-layer.js` (`img.src = wp.img`, Z. ~80) und das Map-Popup (`<img src="'+wp.img+'">`, tracker.html ~1814): `img.src` lädt `https://`-URL **genauso** wie `data:`-base64 → **rückwärtskompatibel, kein Edit**. Alte Tracks (base64) und neue (URL) funktionieren parallel.
- **GPX-Export** (tracker.html ~1335-1340): bettet das Bild **gar nicht** ein (nur `<name>/<desc>`) → unberührt. (Optional später: `<link href="url"/>`.)

## Touch-Points (gemessen — Zeilen driften)
1. **Capture/Store** — `capturePhoto()` (~1924) + `downscaleSrcToJpeg` (~1722, liefert ~1024px JPEG-dataURL) + `addPhotoAt(img, ll)` (~1951): nach dem Downscale die **Binärdaten in den Bucket uploaden**, `wp.img = öffentliche URL` setzen. base64 **nur im Speicher** für den Identify-Call behalten.
2. **Identify** — `identifyPhoto(wp.img, …)` (~2048) braucht die **Bytes**. Lösung: den in-memory base64 übergeben (nicht die URL), Upload läuft parallel. (Alternative: Edge Fn die URL fetchen lassen — mehr Umbau.)
3. **Persist** — `saveTrack`/`doSync`/`bufferSnapshot` mappen `w.img` unverändert; der Wert ist jetzt nur eine URL → **kein Code-Edit nötig**, Rows schrumpfen automatisch.
4. **Live** — `broadcastPhoto`/`addLivePhoto` (tracker.html ~1171-1172) sendet `img` → künftig die **URL** statt base64. `view.html onLivePhoto` (~338-339) nutzt `p.img` direkt → **kein Edit** (URL lädt).
5. **Renderer / GPX** — kein Edit (siehe oben).

## Offline-Resilienz MUSS erhalten bleiben (Stage 1)
- Foto offline geschossen → Upload scheitert. Dann **base64 in `wp.img` belassen** (zeigt + speichert wie heute), und **später nachladen**: beim nächsten Online-Sync hochladen, `img` auf URL umstellen, Row updaten. Nie ein Foto verlieren.
- Der IndexedDB-Crash-Buffer (`track-buffer.js`) hält den base64 weiter, bis der Upload bestätigt ist.

## Bucket-Setup (nur Supabase-Dashboard, NICHT im Repo)
- **Public Bucket** mit **unrätselbaren Pfaden** (z. B. `<auth.uid>/<t>-<rand>.jpg`). Begründung: geteilte Tracks (`view.html?s=token`) + Live-Viewer laden die Bilder **ohne Auth** → public ist am einfachsten und passt zum bestehenden Token-Share-Modell. Fotos sind nicht geheim; Pfad = unkenntlich.
  - Alternative: **Signed URLs** (laufen ab, müssen neu signiert werden) → mehr Komplexität, nur falls echte Zugriffskontrolle gewünscht.
- Storage-Policies: `insert` nur für den Owner (auth.uid), `select` public read.

## Migration der 169 Bestandsfotos (Einmal-Skript)
- Auth als Code-Konto (`t-<sha256(code)[:32]>@docalvers.de` / `p-<code>`), pro Track: jedes `waypoints[].img` das mit `data:` beginnt → Binär hochladen, `img` durch die URL ersetzen, Row updaten. Bei Upload-Fehler base64 lassen (idempotent, später erneut laufen lassen).
- Läuft lokal (node/python) gegen die REST/Storage-API. Vorher 1 Track testen, dann alle.

## Reihenfolge
1. Bucket + Policies im Dashboard anlegen.
2. Upload-Helper im Client (`uploadPhoto(binary) → url`), Offline-Fallback auf base64.
3. `addPhotoAt`/`capturePhoto` umstellen (Upload → URL; base64 für Identify behalten).
4. `broadcastPhoto` auf URL umstellen.
5. Verifizieren: neuer Track (App), LADEN, Viewer (`?s=`), LIVE, Offline-Foto-Nachladen, GPX.
6. **Bestandsfotos migrieren** (Skript), DB-Schrumpfung gegenmessen.
7. (Optional) GPX `<link>` auf die Foto-URL.

## Risiken / Caveats
- Identify-Pfad nicht brechen (Bytes müssen weiter ankommen).
- CORS am Bucket für `view.html` (andere Origin? docalvers.de servt alles als Root → meist gleiche Origin; trotzdem prüfen).
- Egress entsteht weiter beim **Ansehen** — aber nur für geöffnete Fotos + CDN-Cache statt „alles bei jedem Laden".
- Kein akuter Notfall (10× Luft) — sauberer Umbau, wenn Zeit ist.

Gehört zu [[project_tracker_lab]] / [[project_tracker_fotospur]].
