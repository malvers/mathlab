# Kovarianz — Demo-Video: PLOT (Dramaturgie)

**Stand:** noch keine Solita-Worte. Das hier ist die Handlung — was passiert, in
welcher Reihenfolge, und *warum genau dort* der Groschen fällt.

Lab: `HTML/kovarianz.html` · Live: https://docalvers.de/kovarianz.html
Sprecherin: Solita (de-DE-Studio-*) · 1440p · Playwright-Choreografie
Ziel-Laufzeit: **5:30–6:00** (siehe Zeitbudget unten)

---

## Die Leitidee (ein Satz)

> **Der Mittelwert sagt, *wo* eine Wolke ist. Die Kovarianz sagt, welche *Form*
> sie hat — und diese Form ist eine Ellipse, die man anfassen kann.**

Der ganze Film ist die Antwort auf eine einzige Frage: *Was sind diese vier
Zahlen eigentlich?* Antwort: Sie sind kein Zahlenkasten. Sie sind eine Ellipse.

## Der dramaturgische Bogen

```
  rund  →  gedehnt  →  gekippt  →  die Ellipse IST die Matrix
        →  ihre eigenen Achsen (PCA)  →  Grenzfälle  →  wo sie versagt
```

Erst bauen wir die Ellipse auf (Szene 2–6), dann drehen wir sie um und lesen sie
zurück (7–8), dann brechen wir sie absichtlich (9–13). Kaputtmachen ist der
lehrreichste Teil — und der ehrlichste.

## Didaktische Leitplanken (bindend für den Sprechertext)

1. **Nie eine Formel ohne vorher gezeigtes Bild.** Erst sieht man es, dann heißt es so.
2. **Ein neuer Begriff pro Szene.** Maximal. Lieber eine Szene mehr.
3. Verboten ohne Anschauung: *Erwartungswert, Zufallsvektor, positiv semidefinit,
   Spektralsatz*. Erlaubt, weil im Bild verankert: *Varianz, Eigenvektor, singulär*.
4. **Zahlen vorlesen, wenn sie springen.** Das Panel rechts ist der zweite
   Hauptdarsteller — jede Behauptung wird dort sofort belegt.
5. **Nichts behaupten, was das Bild nicht hergibt** (Szene 11 und 13 sind genau dafür da).

---

## Szenen

| # | Szene | Was im Bild passiert | Der Aha | s |
|---|-------|----------------------|---------|---|
| **1** | **Motivation: die Wolke hat eine Form** | Kalter Start: 4000 normalverteilte Punkte, A = Einheit, Kreis und Ellipse deckungsgleich. Kamera steht still. | Für das *Wo* haben wir ein Wort — Mittelwert. Für das *Wie geformt* auch: Kovarianz. Vier Zahlen. Und diese vier Zahlen sind eine Ellipse. | 30 |
| **2** | **Der langweilige Fall** | Panel Σ aufblenden: σxx ≈ σyy, **σxy ≈ 0**, ρ ≈ 0, φ = 0°. Die Live-Notiz sagt selbst „unkorreliert". | Solange nichts passiert, ist Σ eine Diagonale — und die Ellipse ein Kreis. Das ist der Nullpunkt, gegen den wir alles messen. | 25 |
| **3** | **Dehnen — und die Überraschung** | Zelle a₁₁ von 1,00 auf 2,00 ziehen. Wolke wird breit. **σxx springt auf das Vierfache**, σyy rührt sich nicht. | Länge mal zwei → Varianz mal **vier**. Weil Varianz ein *Quadrat* ist. Erste echte Einsicht, und sie kostet nichts. | 30 |
| **4** | **Kippen — die Nebendiagonale wacht auf** | Ctrl + drücken: nur die Nebendiagonale wächst. Die Wolke legt sich schräg. **σxy verlässt die Null**, ρ läuft mit. Notiz wechselt auf „die Wolke ist gekippt". | σxy ist kein viertes exotisches Ding. σxy **ist** die Schräglage. Vorzeichen = Richtung der Schräge. | 35 |
| **5** ⚠︎ | **ρ: die Schräglage ohne Einheiten** | Weiter kippen bis ρ → 0,9…, dann zurück auf 0. Nur der ρ-Wert im Fokus. | σxy hängt an Metern und Kilos, ρ nicht — ρ liegt immer zwischen −1 und +1. ρ = ±1 heißt: die Wolke ist zur Linie geworden (Vorgriff auf Szene 9). | 30 |
| **6 ★** | **Die Ellipse *ist* die Matrix** | Kreis (C) klar sichtbar: weiß = die Wolke, **bevor** A sie anfasst; cyan = ihr Bild. Dann mit der Maus **an der Ellipse ziehen** — A wird direkt geformt, die Matrixzellen laufen mit. Oben blendet die Formel ein: Σ = A Σ₀ Aᵀ. | Kernszene. Man kann eine Matrix anfassen. Und das Aᵀ ist kein Zierrat: A wirkt **zweimal**, weil Varianz das Produkt zweier Abweichungen ist. Deshalb das Sandwich. | 40 |
| **7 ★** | **Die Ellipse hat eigene Achsen — das ist PCA** | K einschalten: zwei Achsen erscheinen, orange (√λ₁) und grün (√λ₂). Sie liegen **nicht** auf x und y, sondern *in* der Wolke. φ zeigt den Winkel. | Die Wolke bringt ihr eigenes Koordinatensystem mit. Das sind die Eigenvektoren von Σ — und genau das ist die Hauptkomponentenanalyse, mit der halbe Datenanalyse anfängt. | 40 |
| **8 ★** | **Drehen: die Zahlen lügen, die Achsen nicht** | T mehrfach / langsame Rotation. σxx, σyy, σxy **tanzen**. √λ₁, √λ₂ stehen **still**, nur φ läuft mit. Auch σxx+σyy bleibt konstant. | Der stärkste Moment des Films: σxx und σyy hängen davon ab, **wie ich mein Lineal halte**. Die Eigenwerte nicht. Die Einträge sind der Blickwinkel — λ ist die Wahrheit. | 30 |
| **9** | **det A = 0 — die Wolke stirbt** | Eine Zeile proportional zur anderen ziehen, det A → 0,00. Die Ellipse kollabiert zur **Strecke**, √λ₂ → 0, ρ → ±1. Notiz: „Σ wird singulär". | Zwei Zahlen, aber nur eine Information. Das ist, was *singulär* heißt — und warum Kollinearität in echten Daten gefürchtet ist. | 35 |
| **10** | **Verschieben ändert Σ nicht** | H (homogene Koordinaten, 3×3), dann die Translationsspalte bewegen. Die ganze Wolke wandert über die Bühne — **das Σ-Panel steht Ziffer für Ziffer still**. | Kovarianz interessiert sich ausschließlich für Abweichungen *vom Mittelwert*. Wo die Wolke steht, ist ihr egal. Das (x − x̄) in der Formel wird hier zum Bild. | 25 |
| **11** | **Ehrlichkeitsszene: dieselbe Ellipse, andere Wolke** | E drücken: Gauß → Gleichverteilung. Aus der Wolke wird ein Parallelogramm. Σ und die Hauptachsen bleiben praktisch stehen. | Σ ist eine **Zusammenfassung, kein Foto**. Zwei völlig verschiedene Wolken können dieselbe Kovarianz haben. Wird meistens verschwiegen — hier nicht. | 25 |
| **12** ⚠︎ | **Warum „linear" das entscheidende Wort ist** | P einschalten: vier Geraden x = ±100, y = ±100. A beliebig verbiegen — **gerade bleibt gerade, parallel bleibt parallel**. | Die Definition von *linear*, zum Anfassen. Und die stillschweigende Voraussetzung für alles bisher Gesagte. | 25 |
| **13 ★** | **Raum verbiegen — wo Σ aufhört zu gelten** | W einschalten. Die Parallelen werden **Wellen**, die Wolke bekommt eine Beule, die Ellipse passt sichtbar nicht mehr — sie ist immer noch die beste Ellipse, und sie ist trotzdem falsch. | Die Kovarianz ist eine **lineare Brille**. In einer krummen Welt sieht sie zuverlässig das Falsche. Sie ist nicht kaputt — sie ist ein Ellipsen-Modell. Genau deshalb gibt es nichtlineare Verfahren. | 35 |
| **14** | **Finale** | W aus, R (zurück), dann drei-, viermal Leertaste: die Ellipse tanzt durch Zufallsmatrizen, die Zahlen fliegen mit. Standbild, Branding, Fade. | Rückruf auf Szene 1: vier Zahlen — eine Form. Und die kann man selbst in die Hand nehmen. | 20 |

★ = Kernszene, darf nicht gekürzt werden  ⚠︎ = Kürzungskandidat, siehe Zeitbudget

---

## Zeitbudget — gelöst

Alle 14 Szenen: **425 s Sprache** + ~1,4 s Luft je Szene ≈ **7:05**.

Das war gegen ein 360-s-Musikbett ein Problem — ist es nicht mehr. Teil 1 von
`Infinity_6min.m4a` ist **nahtlos loopbar** (64 Takte, 142,778 s, 107,58 BPM;
loopStart 21,220 s, loopEnd 163,998 s, 50 ms Crossfade). Das Bett lässt sich
damit auf jede Länge rendern.

**Konsequenz: keine Szene wird gekürzt.** Die Kürzungsmarken ⚠︎ bei Szene 5 und
12 bleiben nur als Notbremse stehen, falls der Film beim Schnitt zäh wirkt.

Bett für die Vertonung: Intro 0–21,220 s einmal, dann den Body so oft wie nötig,
am Schluss über die letzten ~8 s ausblenden.

## Bewusst weggelassen (Teil-2-Kandidaten)

Basisvektoren (V) als eigene Szene · Shift/Alt-Schrittweiten · Punktzahl-Regler
(200 ↔ 20000 als Rauschen-Demo) · Zoom und Bühnen-Verschieben · die dritte Zeile
der homogenen Matrix als projektive Abbildung.

## Choreografie-Notizen für die Aufnahme

- Startzustand fixieren: `resetAll()`, `dist = gauss`, `n = 4000`, Kreis/Achsen/
  Basisvektoren an, Parallelen und Warp aus, Zoom 1. Das Lab speichert seinen
  Zustand in `localStorage` (`kovarianz-state`) — **vor jeder Aufnahme löschen**.
- Alle Zahlenwechsel brauchen ~0,6 s Nachlauf, sonst liest Solita gegen ein
  Panel an, das noch den alten Wert zeigt.
- Szene 6 (Ellipse ziehen) und Szene 8 (Rotation) sind Maus-/Timing-kritisch —
  als erstes proben.
- Szene 13: Warp erst **nach** dem Einblenden der Parallelen einschalten, sonst
  sieht man die Wellen nicht entstehen, sondern nur da sein.

---

**Nächster Schritt:** Freigabe des Plots (oder Korrektur der Reihenfolge), dann
schreibe ich `narration.mjs` — Solitas Worte, Szene für Szene, nach diesen
Leitplanken.
