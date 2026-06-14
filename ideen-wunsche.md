# Ideen und Wünsche — 2026-06-14

- Wir brauchen Points of Interest.
- Warum haben wir keine Voice Navigation? Ich meine, das wäre schon eingebaut.
- Einen PIN auf der Karte setzen, wo man gegebenenfalls wieder hin navigieren kann.
- Wie funktioniert eigentlich das Feature mit Tankstellen / Tankpreisanzeigen? Ist das eingebaut? Und was muss ich tun?
  - **Erinnerung — Tankstellen-Spur aktivieren (einmalig am Server):**
    1. Kostenlosen Key holen: https://creativecommons.tankerkoenig.de/
    2. Als Secret setzen: Supabase Dashboard → Edge Functions → Secrets → `TANKERKOENIG_KEY`
    3. Function deployen: `supabase functions deploy fuel-prices --no-verify-jwt`
- Korrektur Pflanzen (PlantNet): alles, was unter 20 % ist, nicht anzeigen.
- Route von Ulfladen.
