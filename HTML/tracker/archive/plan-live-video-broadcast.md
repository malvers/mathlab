# Tracker — Skizze: Live-Video-Broadcast (durchleiten statt speichern)

> Konzept-/Kosten-Notiz, **noch nicht gebaut** (CLAUDE.md Regeln 2/4). Stand: 2026-06-10.
> Frage von Doc: Video live „nur durchpipen" statt in die DB? Und v. a. **welche Kosten** — pro Minute
> ist „nie der Hit". Genau daran hängt die Entscheidung.

## Idee
„Schau mir **jetzt live** zu" — der Sender streamt Video, Zuschauer sehen es in Echtzeit. Es wird
**nicht** gespeichert (kein DB-/Storage-Eintrag), es **fließt nur durch** → ephemer. Eigenes Feature
neben dem persistenten Reise-Track (Fotos/Clips am Weg bleiben weiter wie bisher).

## Warum nicht der bestehende Live-Broadcast-Weg
Die Live-Position läuft über **Supabase Realtime** (winzige JSON-Nachrichten). **Video passt da nicht
durch** — zu groß/kontinuierlich. Live-Video braucht eine echte Medien-Strecke (WebRTC/SFU oder einen
Streaming-Dienst). Supabase Realtime kann man aber super als **Signaling-Kanal** wiederverwenden (s. u.).

## Datenrealität (egal welcher Weg)
Video bleibt Video: **~1–3 Mbit/s** → grob **0,5–1,4 GB pro Stunde und Stream**. Gespart wird vor allem
**Storage** (nichts wird abgelegt) und **wiederholte Downloads**. Die Live-Bytes fließen trotzdem — der
echte Kostentreiber bei Skalierung ist **Egress/Bandbreite** (× Zuschauer).

## Kostenmodelle (das Entscheidende)

| Weg | Modell | grobe Kosten | Pro-Minute? |
|---|---|---|---|
| **Cloudflare Stream (Live)** | pro Minute | Ingest $0,75 / 1.000 min · Auslieferung $1 / 1.000 min · (Aufnahme-Storage $5 / 1.000 min) | **Ja** — skaliert mit Zuschauern·Min. (10k Zuschauer × 90 min = ~$900) |
| **Mux / Agora** | pro Minute | ähnlich, encoding + delivery pro Minute | **Ja** |
| **LiveKit Cloud** | pro Teilnehmer-Minute | ~$0,0004–$0,024 / min je Auflösung; Free-„Build"-Tier | **Ja** (aber Free-Tier zum Testen) |
| **Self-hosted LiveKit (Apache-2.0)** | nur Server + Egress | VPS + Bandbreite, **keine** Lizenz/Min-Gebühr | **Nein** |
| **WebRTC P2P + eigener TURN** | nur TURN-Bandbreite | coturn auf billigem VPS (~5 €/Mon + Traffic) | **Nein** |

## Empfehlung (passt zu „kein Pro-Minute" + persönliche Nutzung)
**WebRTC Peer-to-Peer**, **Signaling über das vorhandene Supabase Realtime** (das nutzen wir für die
Position eh schon!), Medien gehen direkt Sender→Zuschauer. NAT-Durchstich per **eigenem TURN (coturn)**
auf einem kleinen VPS — Kosten ≈ **fixer Monatsbetrag + Bandbreite, kein Pro-Minute, kein Storage**.
- **Wenige Zuschauer** (Familie/Freunde) → P2P ist ideal und quasi pro-minuten-frei.
- **Viele Zuschauer** → ein **selbst gehostetes SFU (LiveKit OSS)**: Server + Egress, weiterhin keine
  Min-Gebühr. Erst bei großer Reichweite lohnt ein managed Dienst.

## Haken / Tradeoffs (ehrlich)
- **Sender-Upload:** Mobilfunk-Uplink muss reichen (~2 Mbit/s) — unterwegs nicht immer.
- **Kein Replay**, solange nicht zusätzlich aufgezeichnet wird (dann wieder Storage).
- **TURN/NAT** ist etwas Infra-Aufwand; P2P ohne TURN klappt nicht in jedem Netz.

## Quellen (Preise, Stand 2026-06)
- Cloudflare Stream Pricing — https://developers.cloudflare.com/stream/pricing/
- LiveKit Pricing (Cloud vs. self-hosted) — https://livekit.com/pricing
