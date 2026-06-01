# Glocken-Tutor — Lob & coole Ausrufe

Wie der kgV-Tutor in `glocken.html` lobt — und wo man mehr coole Ausrufe hinzufügt.

## Zwei Quellen für Ausrufe

| Quelle | Wann | Wo im Code |
|--------|------|------------|
| **KI** (Gemini / DeepSeek) | wenn der Tutor-KI-Key gesetzt & erreichbar ist | erfindet Ausrufe frei, gesteuert vom `KHWARIZMI_SYSTEM`-Prompt |
| **Offline-Pool** | Fallback: kein Key / API aus / Netzfehler | `COOL_EXCLAIMS`-Array + Satzkörper in `offlineFeedback()` |

Beim Klick auf die **`KI · …`-Pille** im Tutor schaltest du zwischen Gemini und DeepSeek um.

## Der zentrale Ausruf-Pool (offline)

Quelle der Wahrheit ist das `COOL_EXCLAIMS`-Array in `glocken.html`. Es wird zufällig
mit einem Satzkörper kombiniert → kombinatorisch viele Varianten. Aktuell:

> Genau! · Stark! · Wunderbar! · Ausgezeichnet! · Bingo! · Crazy! · Das ist krass! ·
> Krass! · Bravo! · Glasklar! · Volltreffer! · Perfekt! · Sauber! · Das sitzt! ·
> Meisterhaft! · Brillant! · Punktgenau! · Klasse! · Goldrichtig! · Treffer! ·
> Da ist es! · Mächtig gut! · Wie eine Glocke! · Boom! · Yes! · Stimmt haargenau! ·
> Saubere Arbeit! · Stark gerechnet!

**Mehr hinzufügen:** einfach einen String ans `COOL_EXCLAIMS`-Array in `glocken.html`
hängen (und hier in der Liste ergänzen, damit's synchron bleibt).

## Begeisterung der KI

Im `KHWARIZMI_SYSTEM`-Prompt steht die Regel: *begeistert* starten, den Ausruf **stark
variieren**, sich nie wiederholen, energiegeladen wie ein Trainer — und manchmal bewusst
ganz ohne Ausruf, damit es echt bleibt.

## Level-Abschluss (Meilenstein-Lob)

Eigene, längere Lobreden pro Level (`LEVEL_PRAISE` in `glocken.html`) — Prozess-Lob, das
die *Strategie* benennt (nicht „du bist schlau"). Dazu eine **Glocken-Fanfare**
(`celebrateChord`) und der **Rang** (Lehrling → Rechner → Meister von Bagdad). Das
gesprochene Lob wartet, bis die Fanfare verklungen ist.

## Stimme

Die **Stimmen-Pille** im Tutor schaltet zwischen *Herr al-Khwārizmī* (`de-DE-Neural2-B`)
und *Frau al-Khwārizmī* (`de-DE-Neural2-F`). Die Wahl bleibt gespeichert.
