# og-preview — Link-Vorschau (Open Graph)

Erzeugt fuer jedes Lab eine 1200x630-Vorschaukarte und schreibt die `og:*`/`twitter:*`
Meta-Tags in den `<head>` der Lab-HTML. Damit zeigen WhatsApp, Signal, Telegram,
Slack, iMessage, Mastodon, X & Co. beim Teilen eines Links die grosse Bildkarte
statt nur Favicon + Titel.

## Bauen

```bash
node tools/og-preview/make-og.mjs                 # alles: Screenshots, Karten, Meta-Tags
node tools/og-preview/make-og.mjs --only koerper  # nur ein Lab (nach Aenderungen im Lab)
node tools/og-preview/make-og.mjs --cards-only    # Karten neu rendern, Screenshots wiederverwenden
node tools/og-preview/make-og.mjs --meta-only     # nur die HTML-Koepfe neu schreiben
node tools/og-preview/make-og.mjs --dry           # nichts an den HTMLs aendern
```

## Wie es zusammenhaengt

- **Quelle der Texte:** `HTML/js/labs-config.js` (`title`, `tagline`, `description`).
  Ein Lab dort aendern und `--only <id>` laufen lassen — sonst nichts anfassen.
- **Kartenlayout:** `og-card.html` — ein zentrales Template fuer alle Labore.
- **Screenshots:** `shots/<id>.png` (nicht im Repo, `.gitignore`).
- **Ergebnis:** `HTML/resources/og/<id>.jpg` + Meta-Block zwischen
  `<!-- OG:BEGIN -->` und `<!-- OG:END -->` im Lab-HTML. Der Block wird bei jedem
  Lauf ersetzt — von Hand darin editieren ist zwecklos.

Playwright kommt aus `videopipeline/node_modules`, es wird nichts zusaetzlich
installiert. Der Generator startet fuer die Screenshots einen eigenen Server auf
einem freien Port; Docs `serve.py` auf :8765 bleibt unberuehrt.

## Nach dem Deploy

Caches der Messenger sind hartnaeckig. Zum Pruefen/Neuladen:
- Facebook/WhatsApp: https://developers.facebook.com/tools/debug/
- X: https://cards-dev.twitter.com/validator
- Allgemein: `curl -s https://docalvers.de/<lab>.html | grep 'og:'`
