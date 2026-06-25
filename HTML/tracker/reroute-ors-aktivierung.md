# Reroute via OpenRouteService (Variante B) — gebaut, AKTIVIERUNG offen

**Stand (Doc 2026-06-25):** Variante B aus `reroute-recherche-google.md` ist **fertig gebaut**, aber noch
**nicht aktiv** (Default bleibt OSRM). Grund: ich (Agent) kann die Edge-Function nicht selbst deployen
(Supabase-MCP ist read-only) und habe keinen ORS-Key. Die Navi läuft unverändert auf OSRM weiter; ORS
ist rein additiv mit **OSRM-Fallback** bei jedem Fehler → Umschalten ist risikoarm.

## Was schon im Repo ist
- **Edge-Function** `supabase/functions/reroute/index.ts` — Proxy zu OpenRouteService; übersetzt die
  Antwort in **OSRM-Form**, damit der Client-Parser unverändert bleibt. Setzt Abfahrts-Heading mit
  **±60°-Toleranz** (statt hartem Kegel) → frische Route vorwärts, kein Zurückziehen.
- **Client** `HTML/js/tracker-nav.js`:
  - Flag `REROUTE_ENGINE` (Default `'osrm'`).
  - `fetchRerouteORS()` ruft die Function; bei jedem Fehler → `null` → OSRM-Fallback in `computeRoute`.
  - Nur **Reroute** geht über ORS; die **Initial-Route** bleibt OSRM.
- `HTML/js/tracker.js` reicht `apiUrl`/`apiKey` (Supabase) an nav durch.

## Aktivierung (4 manuelle Schritte — nur Doc kann das)
1. **ORS-Key holen** (gratis, 2.500/Tag · 40k/Monat): https://openrouteservice.org/dev/#/signup
2. **Function deployen:** `supabase functions deploy reroute --no-verify-jwt`
   (oder via Dashboard → Edge Functions).
3. **Secret setzen:** Dashboard → Edge Functions → Secrets → `ORS_API_KEY = <dein Key>`.
4. **Umschalten:** in `HTML/js/tracker-nav.js` `const REROUTE_ENGINE = 'osrm'` → `'ors'`,
   Deploy-Marker in `HTML/tracker/tracker.html` bumpen (Cache-Bust).

## Testen (vor dem Feld)
- `…/tracker/tracker.html?sim=1` → Go Home → Ziel → GO → unterwegs auf eine Seitenstraße klicken.
- DEBUG zeigt die Route; prüfen: **fährt vorwärts neu** statt „wenden", auch am Kreisverkehr.
- Schlägt ORS fehl (Key/Quota/Down) → automatisch OSRM, kein Ausfall.

## Optionale Ausbaustufe (später)
- **Abgelehnte Straße sperren** („prohibited area"): die gerade verlassene Strecke als kleines
  `avoid_polygons` an die Function mitgeben → ORS sucht garantiert eine echte Alternative vorwärts.
  Hook ist da (Body-Feld `avoid_polygons` wird durchgereicht), Client schickt es noch nicht.
- Bei Bedarf ganze Navigation (auch Initial-Route) auf ORS ziehen → ein Parser, konsistente Ansagen.
