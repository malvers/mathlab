# BB84 — Demo-Video, der Plot (noch keine Solita-Sätze)

Maß: **Conway's Iris = 347 s (5:47), 18 Szenen, 15 Kapitel** — rund 19 s pro Szene.
Hier: **18 Szenen, ~350 s**. Sprache Deutsch (Solita, de-DE-Studio-C), 1440p,
Bühne ist `bb84.html` — bis auf drei Szenen, die das Lab nicht zeigen kann (siehe unten).

---

## Die Dramaturgie in einem Satz

Wir verschlüsseln heute mit einer **Wette** („Faktorisieren dauert zu lange") — und tauschen sie
gegen ein **Naturgesetz** („Wer hinschaut, verändert"). Dazwischen steht ein Mann, der das Photon
erfunden und die Konsequenz sein Leben lang nicht geglaubt hat.

Der rote Faden ist **ein einziges Photon**, das durch den ganzen Film läuft: erst als Rätsel,
dann als Spielstein im Lab, am Ende als Wächter.

---

## Die drei Bilder, die den Film tragen

1. **Der Tresor mit Ablaufdatum.** Was heute abgehört und gespeichert wird, wird in zwanzig Jahren
   geöffnet. Nicht geknackt — *gewartet*. („Harvest now, decrypt later.")
2. **Die drei Sonnenbrillen.** Zwei gekreuzte Polfilter: dunkel. Ein dritter, schräg, *dazwischen*:
   wieder hell. Mehr Filter, mehr Licht. Das ist der ganze Quantenspuk in einer Handbewegung —
   und es erklärt in acht Sekunden, warum Messen nicht *ablesen*, sondern *entscheiden* heißt.
3. **Das Viertel.** Eve kann nicht abschreiben, also muss sie neu senden — und liegt in einem
   Viertel der Fälle daneben. Diese eine Zahl trägt den ganzen zweiten Teil.

---

## Szenen

| # | Szene | Bild / Aufnahme | Worum es geht | s |
|---|-------|-----------------|----------------|---|
| 1 | **Der Tresor mit Ablaufdatum** | Schwarz, dann Textkarte; darunter läuft schon die Schlüsselzeile des Labs golden voll | Alles, was du heute verschlüsselt verschickst, kann jemand mitschneiden und aufheben. Er muss es nicht knacken. Er muss warten. | 20 |
| 2 | **Warum die Wette wackelt** | Textkarte: RSA in einer Zeile — zwei Primzahlen malnehmen ist leicht, zurück ist schwer | Unsere Sicherheit ist kein Gesetz, sondern eine Annahme über Rechenzeit. Shor 1994: ein Quantenrechner faltet sie zusammen. Es gibt ihn noch nicht — aber die Mitschnitte gibt es schon | 20 |
| 3 | **Was fundamental anders ist** | Split: links ein Bit als Kopie-Objekt, rechts ein Photon | Eine klassische Leitung kann man lautlos anzapfen — Information lesen heißt Information kopieren. Der Quantenkanal kann das nicht. Wir verschlüsseln nicht besser; **wir merken, dass jemand zuhört.** | 20 |
| 4 | **Was ist ein Photon?** | Lab, Lehrmodus, eine Spalte groß: die Photonenzeile | Kein Kügelchen, keine Welle — die kleinstmögliche Portion Licht. Man kann sie nicht halbieren. Sie hat eine Schwingungsrichtung: die Polarisation. Das ist der Spielstein | 20 |
| 5 | **Die zwei Basen** | Lab: die vier Zustände —, \|, /, \\ nebeneinander, dann die Filter + und × | Zwei Alphabete für dasselbe Bit: + kennt waagerecht und senkrecht, × kennt die beiden Schrägen. Vier Zustände, zwei Bedeutungen | 18 |
| 6 | **Die drei Sonnenbrillen** ★ | **Live-Insert, echte Hand, 8 s** (oder Animation) | Zwei gekreuzte Filter: dunkel. Ein dritter dazwischen: wieder hell. Der Filter liest nicht ab, was da war — er *entscheidet*, was danach ist. Und löscht die alte Richtung | 22 |
| 7 | **Alice sendet** | Lab, Lehrmodus Spalte 1–4, Zeiger wandert | Alice würfelt Bit und Basis, das Photon fliegt los. Bob würfelt seine Basis, ohne zu wissen, welche Alice hatte | 18 |
| 8 | **Gleiche Basis, andere Basis** | Lehrmodus Spalten 1–8, Tooltip liest mit | Gleiche Basis: Bob misst mit Sicherheit richtig. Andere Basis: reiner Zufall — nicht Unwissen, sondern Unbestimmtheit. Taste Z zeigt die alte Java-Schreibweise „0\|1" | 20 |
| 9 | **Sifting — die Hälfte fliegt raus** | Zufallslauf, 42 Bits, Basenzeilen grün/rot, Schlüsselzeile füllt sich | Danach reden beide offen — aber nur über die **Basen**, nie über die Bits. Wo sie sich einig sind, bleibt das Bit. Rund die Hälfte. Der Rest fliegt weg, und das ist kein Verlust, das ist der Preis | 20 |
| 10 | **Eve betritt die Bühne** | Taste E, die drei roten Zeilen klappen auf | Sie kann nicht abhören wie am Telefon. Sie kann nicht kopieren — ein Quantenzustand lässt sich nicht abschreiben. Sie muss messen und **neu senden**. Damit ist sie gezwungen zu raten | 20 |
| 11 | **Das Viertel** ★ | Spalten 11–14 im Lehrmodus, die zwei Widersprüche rot | Eve rät die Basis in der Hälfte der Fälle falsch. Dann sendet sie das falsche Photon, und Bob würfelt — in der Hälfte davon falsch. Halbe mal halbe: **jedes vierte Schlüsselbit ist kaputt** | 22 |
| 12 | **Die Falle** | Regler „öffentlich verglichen" aufziehen, Testbits gestrichelt, QBER springt | Alice und Bob opfern ein paar Bits und vergleichen sie laut. Ohne Eve: null Fehler. Mit Eve: ein Viertel. Und die Formel daneben sagt, wie sicher man sie erwischt: 1 − (¾)^m — bei 20 Testbits über 99,7 % | 20 |
| 13 | **Tausend Läufe** | Knopf „1000 LÄUFE", die Zahlen laufen ein | Einmal ist Anekdote. Tausendmal ist Physik: die mittlere Fehlerquote landet auf 25,0 %, die Entdeckungsrate genau auf der Kurve. Nichts hier ist Behauptung — es steht gemessen daneben | 18 |
| 14 | **Einstein sagt nein** | Textkarte, Typografie im Lab-Stil; Jahreszahl 1935 | Der Mann, der 1905 das Photon *erfunden* hat, wollte die Konsequenz nie glauben. „Gott würfelt nicht." Sein Einwand: das Photon muss einen geheimen Plan mitbringen, wir kennen ihn nur nicht | 20 |
| 15 | **Der Spuk** | Kleine Animation: zwei Photonen fliegen auseinander, eine Messung, beide fallen zugleich | Verschränkung: zwei Photonen, ein gemeinsamer Zustand. Hier messen — dort steht es fest, sofort, egal wie weit. Einstein nannte es „spukhafte Fernwirkung" und hielt es für den Beweis, dass die Theorie unfertig ist | 22 |
| 16 | **Bell macht daraus ein Experiment** ★ | Textkarte mit einer Zahlengerade: die Grenze, und wo die Natur liegt | 1964 rechnet John Bell aus: *wenn* es geheime Pläne gibt, dürfen die Messungen nur so stark zusammenpassen — nicht stärker. Die Natur geht darüber hinaus. Gemessen, immer wieder, bis kein Schlupfloch mehr blieb. Nobelpreis 2022 für Clauser, Aspect, Zeilinger. **Einstein hatte unrecht — aber sein Einwand war so präzise, dass er messbar wurde.** Genau dieser Spuk hält unseren Schlüssel sicher | 24 |
| 17 | **Wo das heute steht** | Textkarte, dann zurück ins Lab | Kein Gedankenspiel: Glasfaserstrecken, ein Satellit namens Micius, Banken in Wien. Und die ehrlichen Grenzen — Reichweite, kein Verstärker, und BB84 braucht einen echten zweiten Kanal, über den Alice und Bob sich sicher erkennen | 20 |
| 18 | **Schluss** | Lab, neuer Lauf, Schlüsselzeile läuft golden voll, Branding | Der Schlüssel ist nicht sicher, weil er schwer zu knacken ist. Er ist sicher, weil das Universum petzt. Probier es selbst — docalvers.de | 20 |

**Summe ≈ 344 s (5:44).** ★ = die drei Szenen, an denen der Film steht oder fällt.

---

## Kapitel für YouTube (aus dem Schnitt, wie bei Iris)

s1 Der Tresor mit Ablaufdatum · s3 Was anders ist · s4 Was ist ein Photon · s6 Die drei Sonnenbrillen ·
s7 Alice sendet · s9 Sifting · s10 Eve · s11 Das Viertel · s12 Die Falle · s13 Tausend Läufe ·
s14 Einstein sagt nein · s15 Der Spuk · s16 Bell · s17 Heute · s18 Schluss

---

## Was das Lab nicht zeigen kann — drei Fremdkörper

| Szene | braucht | Aufwand |
|-------|---------|---------|
| 6 Sonnenbrillen | **Live-Aufnahme** mit zwei Polbrillen (iPhone, 8 s) — oder Canvas-Animation | 15 min echt / 1 h animiert |
| 15 Verschränkung | kleine Animation, z. B. `videopipeline/bb84/epr.html`, headless aufgenommen | ~1 h |
| 2, 14, 16, 17 | Textkarten im Lab-Stil (Orbitron auf Dunkelblau) — dieselbe Mechanik wie die Outro-Karten bei Iris | gering |

Keine Einstein-Fotos: Rechtelage unnötig riskant, Typografie trägt die Szene ohnehin besser.

---

## Fachlich sauber bleiben — ein Punkt, den ich nicht verschweigen will

**BB84 benutzt keine Verschränkung.** Es braucht nur einzelne Photonen und die Regel „Messen
entscheidet". Der Spuk in Szene 15/16 ist der *große Bruder* — Einsteins eigentlicher Einwand,
und die Grundlage eines zweiten Verfahrens (Ekert 1991), das den Lauscher direkt über Bells
Ungleichung entlarvt.

Ich baue das deshalb als **eigenen Akt** und sage im Film klar, dass BB84 ihn nicht braucht.
Sonst lernen die Schüler etwas Falsches, nur weil es spannender klingt. Der Akt bleibt trotzdem
drin — er beantwortet die Frage „warum ist das so verrückt?" und liefert die beste Pointe:
*Einstein hat verloren, und zwar auf die eleganteste Art, die es gibt.*

---

## Vier Entscheidungen, bevor ich Solitas Text schreibe

1. **Sonnenbrillen echt oder animiert?** (echt ist besser und billiger, bricht aber die
   Headless-Pipeline auf)
2. **Einstein-Akt drin lassen?** Er kostet ~66 s von 344 — dafür fliegen sonst zwei Lab-Szenen raus.
3. **Ein Film oder zwei?** Alternative: Teil 1 „Warum und wie" (~4 min, nur Lab),
   Teil 2 „Einstein hatte unrecht" (~3 min). Zwei kurze laufen auf YouTube oft besser als einer.
4. **Zielgruppe:** Oberstufe Informatik/Physik — oder auch der interessierte Laie? Das ändert
   Tempo und Wortwahl in jeder einzelnen Szene.
