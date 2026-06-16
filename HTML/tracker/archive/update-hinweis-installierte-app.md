# Tracker — „Neue Version verfügbar" für bereits installierte Nutzer

> Idee von Doc: Wer die App schon installiert hat, soll bei einer neuen Version **benachrichtigt**
> werden — **ohne** noch einmal durch den ganzen Installationsprozess zu müssen.
> Konzept-Notiz, **noch nicht gebaut** (Regeln 2/4). Stand: 2026-06-08.

## Wichtig vorweg: es gibt ZWEI Installationsarten
Die Tracker-Landing (`tracker/index.html`) bietet **Browser/PWA** *oder* **APK** an — beide
„installieren" sich völlig unterschiedlich, also braucht „Update" auch zwei Lösungen.

---

## 1. PWA / Web (zum Homescreen hinzugefügt) — fast gelöst, nur Hinweis fehlt

**Ist-Zustand (gut):**
- Service Worker ist **network-first** (`tracker/sw.js`) mit `skipWaiting()` + `clients.claim()`.
- Assets werden per **`document.lastModified`** cache-gebustet (`tracker.html:20`,
  `register(..., {updateViaCache:'none'})` `:31-33`).
- → Ein frischer GitHub-Pages-Deploy wird **beim nächsten Laden automatisch** übernommen.
  **Kein Neu-Installieren nötig.** Der Build-Stempel ist schon sichtbar (`tracker.html:287-295`).

**Was fehlt — genau Docs Wunsch:** der **Hinweis**. Wenn die App/der Tab lange offen bleibt, läuft
im Hintergrund schon der neue SW, die *angezeigte* Seite ist aber noch alt. Der Nutzer merkt nichts.

**Lösung (klein):** das Standard-„Update-Banner"-Muster:
- Beim Registrieren auf `registration.onupdatefound` / den **`waiting`**-SW hören.
- Sobald ein neuer SW bereitsteht → kleines Toast/Banner einblenden:
  **„Neue Version verfügbar — tippen zum Aktualisieren"** (Toast-Funktion `toast()` gibt's schon).
- Tipp → `waiting.postMessage('SKIP_WAITING')` (SW ruft `skipWaiting`) + `location.reload()`.
- **Ein Tipp, kein Re-Install.** Optional die Versionsnummer im Banner zeigen.

> ✅ **Umgesetzt (2026-06-08):** `tracker/sw.js` (kein `skipWaiting` mehr bei Updates +
> `SKIP_WAITING`-Message-Handler), SW-Registrierung mit `updatefound`/`controllerchange` in
> `tracker.html` (`<head>`), Banner-Markup `#update-banner` (neben `#toast`) und CSS in
> `tracker.css`. Reload nur nach echtem Nutzer-Tipp (kein Auto-Reload beim Erst-Install).

---

## 2. APK (Android-Wrapper) — hier sitzt der echte Schmerz

Die `doc-alvers-tracker.apk` (Capacitor-WebView-Wrapper). Entscheidende Frage:
**Lädt die WebView die LIVE-Seite oder gebündelte Assets?**

### 2a. Den Inhalt live laden → tägliche Updates ganz ohne Re-Install
- In `capacitor.config` **`server.url`** auf `https://docalvers.de/tracker/` setzen, statt die
  Web-Assets in die APK zu bündeln.
- → Jede Web-Änderung ist **sofort** in der installierten APK da (gleiche network-first-Logik wie
  PWA). Der Nutzer muss **nie** wegen Inhalts-/Logik-Updates neu installieren.
- **TODO:** im Capacitor-Projekt (laut `.gitignore` liegt es lokal unter `tracker-app/`) prüfen,
  ob das schon so konfiguriert ist. Falls die APK heute gebündelte Assets lädt, ist genau **das**
  die Ursache des „muss neu installieren"-Problems.

### 2b. Nur für echte SHELL-Updates: benachrichtigen + 1-Tipp-Download
Manchmal ändert sich die **native Hülle** selbst (neue Capacitor-Plugins, Permissions,
Hintergrund-GPS) — dafür ist eine neue APK **unvermeidbar**. Aber: der Nutzer soll es **erfahren**,
nicht stumm auf einer alten Hülle festhängen.
- Ein **`version.json`** auf dem Server: `{ "shell": "1.4.0", "apk": "https://…/doc-alvers-tracker.apk", "notes": "…" }`.
- Die App kennt ihre eigene Shell-Version (Konstante in der App / aus Capacitor) und **vergleicht**
  beim Start gegen `version.json`.
- Ist die Server-Shell neuer → Banner **„Neue App-Version (1.4.0) verfügbar"** mit **direktem
  APK-Download-Link** (oder später Play-Store-Link). Ein Tipp → Download → Android-Update über die
  bestehende App (kein Datenverlust).
- Nur **dann** läuft der Installer — und das selten, statt bei jeder Kleinigkeit.

---

## Mechanik / Bausteine
- **Versionsquelle:** ein `version.json` (Server) als „Single Source of Truth" für Web-Build **und**
  Shell-Version. Web-Build kann weiterhin `document.lastModified` als Stempel nutzen
  (`tracker.html:287`); Shell-Version kommt aus der APK.
- **Anzeige:** vorhandene `toast()`-Funktion fürs Banner; Build-Stempel-Box ist schon da.
- **Kein Secret nötig**, reine statische Datei + zwei `fetch`/SW-Hooks.

## Empfehlung / Reihenfolge
1. **APK auf `server.url` (live) umstellen** (2a) — beseitigt das „immer neu installieren" für
   ~99 % der Updates. Größter Hebel, wenn nicht schon so.
2. **PWA-Update-Banner** (1) — kleiner, sofort umsetzbarer Komfort-Hinweis.
3. **version.json + Shell-Update-Hinweis** (2b) — für die seltenen echten APK-Wechsel.

> Hinweis: Das PWA-Update-Muster (1) ist 1:1 auch für **VGP** (`vgp/vgpapp.html`, nutzt `../sw.js`)
> verwendbar — gleiche Lösung, falls gewünscht.

---

## Umsetzung 2a — konkrete Capacitor-Config (lokal anzuwenden)

> Diese Änderung liegt im lokalen Capacitor-Projekt `tracker-app/` (per `.gitignore` **nicht** im
> Repo und nicht im Cloud-Container). Darum hier als **anzuwendendes Rezept**, nicht von hier baubar.

In `tracker-app/capacitor.config.ts` (oder `.json`):
```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.docalvers.tracker',
  appName: 'Doc Alvers Tracker',
  webDir: 'www',                              // minimaler Bundle-Fallback fürs kalte Offline-Start
  server: {
    androidScheme: 'https',                   // Origin = https → Secure-Context + Service Worker funktionieren
    url: 'https://docalvers.de/tracker/',     // ← der Kern: WebView lädt die LIVE-Seite
    cleartext: false,
    // allowNavigation: ['docalvers.de'],
  },
};

export default config;
```
Danach: `npx cap sync android` → in Android Studio neu bauen → die neue APK **einmalig** installieren.
**Ab dann** kommen Web-/Logik-Updates automatisch (über den network-first SW), **ohne** Re-Install.

### Wichtige Abwägung (GPS-App!)
- Mit `server.url` lädt die WebView beim **Kaltstart** von der Live-URL → **braucht dann Netz**.
  Für eine Trail-App heikel: im Funkloch nach einem Reboot kann der allererste Start sonst leer
  bleiben. Mitigation: nach dem ersten Online-Start cached der SW die Seite → spätere
  Offline-Kaltstarts können aus dem Cache kommen (WebView-abhängig → **unbedingt testen**). Das
  `webDir`-Bundle als Minimal-Fallback behalten.
- Diese Config-Umstellung ist selbst eine **Hüllen-Änderung** → genau **einmal** noch ein echter
  Re-Install. Danach ist Schluss mit Re-Installs für Inhalts-Updates.
- Hintergrund-GPS / Permissions bleiben unberührt (nativer Plugin-Teil).

### Test-Checkliste
1. APK neu bauen + installieren.
2. Online: eine Kleinigkeit in `tracker.html` ändern, pushen → App neu öffnen → Änderung da,
   **ohne** Re-Install. ✓
3. Flugmodus + App nach Reboot kalt starten → lädt sie aus dem Cache oder bleibt sie leer?
   (entscheidet, ob das Bundle-Fallback ausgebaut werden muss).

> Alles erst nach Docs **go**.
