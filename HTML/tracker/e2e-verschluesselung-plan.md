# Tracker — E2E-Verschlüsselung (Plan, á la VGP)

> Konzept-/Spec-Notiz, **noch nicht gebaut** (CLAUDE.md Regeln 2/4). Ziel: Tracks + Fotos liegen in
> Supabase nur noch als **Ciphertext** — der Server (und jeder mit dem öffentlichen anon-Key) sieht
> nichts Lesbares. Modelliert auf VGPs bestehende Krypto.
> Stand: 2026-06-09.

---

## Warum / Ausgangslage

Heute: Tracks (`points`, `waypoints` inkl. Foto-Base64, `name`, `text`) liegen als **Klartext-JSON**
in der `tracks`-Tabelle. Schutz = nur TLS unterwegs + Supabase-At-Rest-Disk-Encryption. Der
**publishable/anon-Key steht im public Repo + Client-JS** → wer ihn nimmt, kann (je nach RLS) alles lesen.
Im Client wird **nichts** verschlüsselt (das `crypto.subtle` in tracker.html ist nur SHA-256 für den Sync-Code).

**Zwei Stufen — ehrlich:**
- **Phase 0 (billig, 80/20): RLS härten.** Tracks pro Sync-Code/Owner scopen → ein Fremder mit dem
  Key kann **nicht** mehr alle Tracks ziehen. Stoppt Zufalls-/Repo-Leser. Schützt **nicht** vor jemandem
  mit DB-/Supabase-Zugriff. Kleiner Eingriff, sofort sinnvoll — **unabhängig** vom Rest.
- **Phasen 1–5 (echtes E2E, á la VGP):** Server hält nur Ciphertext. Schützt auch gegen DB-Admin/Supabase.
  Größeres Stück (Save/Load/Sync/Share/Live/Fotos + Key-Verwaltung + Migration).

> Empfehlung: **Phase 0 sofort**, dann E2E in Etappen. Phase 0 allein deckt „nur ich seh die Tracks" zu 90 % ab.

## VGP-Modell (das wir übernehmen)

`HTML/vgp/js/vgp-crypto.js` — fertige, migrations-freundliche Bausteine:
- **Schlüssel:** Passwort → `PBKDF2` (200 000 Runden, SHA-256, fester Salt) → **AES-GCM-256**. Nie am Server.
- **Öffentliche Gruppen-ID:** `PBKDF2(passwort, group-salt)` → hex. Liegt **clear** auf der Zeile, damit
  der Server gruppieren/finden kann, **ohne** zu entschlüsseln.
- **Text:** `encryptText()` → `iv(12) ++ ct`, base64, Prefix **`ENC:`**. `decryptText()` lässt Nicht-`ENC:`
  **als Klartext durch** → Alt-Zeilen funktionieren weiter (Migration „nebenbei").
- **Bilder/Binär:** `encryptBytes()/decryptBytes()` → `iv(12) ++ ct` als `Uint8Array`.

## Schlüssel beim Tracker — KEIN neues Passwort

Der Tracker hat schon ein Geräte-übergreifendes Geheimnis: den **Sync-Code** (Cross-device-Sync). Der ist
exakt VGPs „Gruppenpasswort":
- `trackKey = PBKDF2(syncCode, 'tracker-key-salt-v1')` → AES-GCM-256 (im Speicher, nie hochgeladen).
- `ownerId = PBKDF2(syncCode, 'tracker-owner-salt-v1')` → hex, **clear** als Spalte `owner` → RLS + „meine Tracks listen" ohne Entschlüsseln.
- Kein Sync-Code (rein lokal) → Cloud-Sync ohnehin aus; lokal (TrackBuffer/IndexedDB) bleibt unverschlüsselt (Gerät = vertrauenswürdig).

## Was wird Ciphertext, was bleibt clear

| Feld | E2E? | Warum |
|---|---|---|
| `points` (die Route) | **ja** | das Sensibelste |
| `waypoints` (GPS+Titel+Text) | **ja** | Orte + Notizen |
| Foto-Bild | **ja** | `encryptBytes`, inline base64 **oder** privater Storage-Bucket (wie VGPs „media") |
| `name` | **ja** (als `ENC:`) | Track-Name kann verraten |
| `owner` (hex) | nein (clear) | RLS-Scope + Liste, gibt nichts preis |
| `created_at`, `status`, `id`, `share_id` | nein | Metadaten, fürs Funktionieren nötig |
| `distance_m`, `duration_s`, `photo_count` | **abwägen** | für die Liste; entweder mitverschlüsseln (Liste rechnet client-seitig) oder als grobe Klartext-Metadaten lassen |

## Datenfluss

- **Speichern:** vor `insert/update` → `points`/`waypoints`/`name` durch `encryptText`/`encryptBytes`; `owner` clear mitschreiben.
- **Laden:** nach `select` → `decryptText`/`decryptBytes` mit `trackKey`. Alt-Klartext-Zeilen laufen dank Durchlass weiter.
- **Liste (LADEN):** **`list_tracks()`-RPC (km/Dauer server-seitig) fällt weg** — die Punkte sind Ciphertext.
  → km/Dauer/Foto-Anzahl **client-seitig** aus den entschlüsselten Punkten rechnen (oder grobe Klartext-Metadaten, s. o.).
- **Foto-KI (`identify`):** Die Edge-Function bekommt das Foto **bei der Aufnahme im Klartext** (geht eh an
  Google/Pl@ntNet) — **bevor** es verschlüsselt gespeichert wird. Sie **speichert** nichts. → kein Konflikt;
  nur die **gespeicherte** Kopie ist E2E.

## Sharing (view.html ?s=token) — Key im URL-Fragment

Der Empfänger hat den Sync-Code **nicht**. Saubere Trennung:
- Beim Teilen: Track unter einem **frischen Zufalls-Share-Key** verschlüsseln, als Share-Zeile ablegen.
- Link: `view.html?s=<token>#k=<share-key-b64>`. Das **`#`-Fragment geht NIE an den Server** (Browser sendet es nicht).
- Viewer: Zeile per Token holen (Ciphertext), mit dem Fragment-Key entschlüsseln. Server sieht den Key nie.

## Live-Broadcast — Key im Live-Fragment

Live-Positionen/Fotos gehen über Supabase-Realtime-Broadcast (Channel = Live-Name). Für E2E:
- Channel-Key = `PBKDF2(liveSecret, …)`; Payloads vor `channel.send` mit `encryptText/encryptBytes`.
- Live-Link trägt das `liveSecret` im **Fragment** (`view.html?live=<name>#k=<secret>`). Viewer entschlüsselt damit.

## RLS (zusätzlich, defense-in-depth)

Auch mit E2E die `tracks`-RLS auf `owner` scopen — dann zieht der öffentliche Key nicht mal mehr fremden
**Ciphertext**. (Ciphertext ohne Key ist zwar nutzlos, aber „nicht mal sehen" ist sauberer.) Share-Zeilen
bleiben per Token les-, aber nur als Ciphertext + Fragment-Key entschlüsselbar.

## Wiederverwendung (Audit-Ziel: keine Doppel-Implementierung)

`vgp-crypto.js`-Primitive (`encryptText/decryptText/encryptBytes/decryptBytes` + PBKDF2-Ableitung) in ein
**geteiltes `js/crypto-box.js`** ziehen → VGP **und** Tracker teilen sich eine Krypto-Schicht. Web-Crypto-API,
kein Lib, kein Key am Server.

## Migration

- Pro Zeile ein `enc`-Marker (oder einfach VGPs `ENC:`-Prefix als Signal). `decryptText` lässt Alt-Klartext durch.
- Alt-Tracks werden beim **nächsten Speichern** automatisch zu Ciphertext; reiner Altbestand bleibt lesbar bis dahin.
- Optional: einmaliges Re-Encrypt aller eigenen Tracks (Client iteriert, lädt, verschlüsselt, schreibt zurück).

## Aufwand & Reihenfolge

0. **RLS härten** — klein, sofort, unabhängig. (Erst die `pg_policies`-Abfrage laufen lassen, dann gezielt scopen.)
1. **`js/crypto-box.js`** (aus vgp-crypto.js) + Key/Owner aus Sync-Code — mittel.
2. **Tracks E2E** (points/waypoints/name encrypt+decrypt; Liste client-seitig rechnen) — mittel, der Kern.
3. **Fotos E2E** (`encryptBytes`, inline oder privater Bucket) — mittel.
4. **Sharing E2E** (per-Share-Key im Fragment) — klein-mittel.
5. **Live E2E** (Channel-Key im Fragment) — klein-mittel.

## Ehrliche Trade-offs

- **`list_tracks`-RPC (server-seitige km/Dauer) entfällt** → client-seitig rechnen. (Hatten wir gerade erst eingebaut.)
- **Share/Live brauchen den Key im Link-Fragment** — wer den Link hat, kann lesen (gewollt), aber der Link ist
  damit das Geheimnis (nicht über unsichere Kanäle teilen).
- **Foto-KI** bleibt unberührt (Klartext bei Aufnahme), aber „BILDER ANALYSIEREN" (Re-Identify aus der Cloud)
  müsste die Fotos **erst client-seitig entschlüsseln**, bevor sie zur Edge-Function gehen.
- Verlierst den Sync-Code → **Tracks sind weg** (kein Server-Recovery — das ist der Preis von echtem E2E).

> Umsetzen erst nach Doc's **go**, Etappe für Etappe.
