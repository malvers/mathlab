# Backlog — offene Wünsche (projektübergreifend)

> Konsolidiert aus `ideen-wunsche.md` (Tracker-Wünsche, 2026-06-14) und
> `wunsch-antworten-vorlesen.md` (TTS-Wunsch). Status nach Code-Check am 2026-06-16.
> Mathe-Labor-Lab-Ideen leben separat in [`IDEAS.md`](IDEAS.md); die detaillierte
> Tracker-Queue in [`HTML/tracker/feature-requests.md`](HTML/tracker/feature-requests.md).

## Tracker
- ✅ **Points of Interest** — gebaut (`HTML/js/tracker-poi.js`).
- ✅ **Voice/Navigation** — gebaut (`HTML/js/tracker-nav.js`, Nominatim-Geocoding).
- ✅ **Tankstellen-/Tankpreis-Spur** — gebaut (`HTML/js/tracker-fuel.js`); `TANKERKOENIG_KEY`
  am Server gesetzt + `fuel-prices` deployt.
- ⬜ **PIN auf der Karte setzen** und später wieder dorthin navigieren.
- ⬜ **PlantNet-Korrektur:** alles unter 20 % nicht anzeigen.
- ⬜ **Route von Ulfladen** (konkrete Navigations-Aufgabe, mit Nav jetzt machbar).

## Hände-frei / Audio
- ✅/⬜ **Agent-Antworten vorlesen (beim Fahren):** über **Solita** gelöst (Web-SR + TTS,
  `HTML/js/solita-tts.js`) — Solita liest vor und nimmt Diktat. Frühere geräteseitige
  Behelfe (iOS „Bildschirm sprechen" / Android Select-to-Speak) bleiben als Fallback.
  Verwandt: [`HTML/tracker/archive/drivecast-audio-poi-am-weg.md`](HTML/tracker/archive/drivecast-audio-poi-am-weg.md).
