# Tracker — Sync-Code (geteilte Identität ohne Login) — Sketch

## Ziel
Tracks geräteübergreifend (Pixel + Browser/Laptop) verfügbar, ohne echtes Login.

## Kernidee
Ein **Sync-Code** (Passphrase) bestimmt **deterministisch ein Supabase-Konto**. Beide Geräte mit
demselben Code loggen ins selbe Konto → identische `auth.uid()` → dieselben Tracks.
**RLS bleibt unverändert** (`auth.uid() = user_id`), kein Schema-Umbau.

## Mechanik
```
code = "wald-7geist-42"
email    = "t-" + sha256Hex(code).slice(0,32) + "@docalvers.de"   // echte Domain (MX) — Supabase akzeptiert
password = "p-" + code                                            // min-Länge sicherstellen

await sb.auth.signInWithPassword({ email, password })
// falls "Invalid login credentials" → Konto neu:
await sb.auth.signUp({ email, password })
await sb.auth.signInWithPassword({ email, password })
```
- Kein Code gesetzt → bisheriges anonymes Login (privat pro Gerät).
- Code gesetzt (localStorage) → beim Laden ins abgeleitete Konto.

## Supabase-Dashboard (PFLICHT, getestet 2026-06-04)
- **Auth → "Confirm email" AUS**. Getestet: mit `@docalvers.de` klappt signUp, aber signIn scheitert
  mit „Email not confirmed", solange Confirm-email AN ist. Ohne diese Einstellung geht Sync NICHT.
- `@sync.docalvers.de` (Subdomain) wird abgelehnt („invalid", keine MX) → echte Domain `@docalvers.de`.
- Tabelle `tracks` + RLS unverändert (`auth.uid() = user_id`).

## UX
- Menü: **Sync-Code** — Eingabefeld + "Code erzeugen" (starker Zufallscode).
- Status: "synchronisiert als …" vs. "lokal (privat)".
- Code wird in localStorage gespeichert.

## Offene Punkte
1. **Migration**: vorhandene anonyme Tracks (z. B. "first") hängen an der alten Geräte-Identität.
   → Button "Vorhandene Tracks übernehmen" (re-speichert unter dem Sync-Konto), oder neu speichern.
2. **Privatsphäre**: geteilte Identität, aber NICHT Ende-zu-Ende verschlüsselt (Supabase könnte lesen).
   Upgrade = VGP-Stil: Payload clientseitig mit Key aus dem Code AES-verschlüsseln.

## Status
Sketch — auf Doc-Freigabe wird gebaut (Client-Auth-Umbau + Menü-Eintrag + Dashboard-Setting).
