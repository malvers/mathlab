// Pinker-Finder — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. Budget: ~147 words per minute; ten scenes at 15–22 s
// of speech come to ~185 s, about 3:30 with air and the end cards.
//
// MEASURED IN THE APP (04.09.2026, exclude list on, Semantics tab read via AX):
//   File types: Other 52,003 · Code 28,794 · Audio 25,955 · Images 23,519 · Text documents 8,549
//   Size: ≥ 1 GB 4 · 100 MB–1 GB 161 · 10–100 MB 1,903 · 1–10 MB 19,038 · < 1 MB 135,725
//   the four ≥ 1 GB rows (19:45): an Android-Studio .dmg (1.47), a film in iTunes (1.33),
//   OneDrive_2026-09-04.zip (21.48), a downloaded talk (1.0) — the .crdownload finished meanwhile
// Every number below is one of these and stands in the picture while it is said. The index
// total is NOT spoken: it lives in a tooltip, not on screen.
//
// Every scene is wrapped in <speak>: lib/tts.mjs only treats a string as SSML when it STARTS
// with <speak>. NO <emphasis> (Studio voices reject it). The long <break>s are stage
// directions: run2 performs the click inside them (Desktop, Schule, Back, Forward, the
// facet, the path segment) — so the picture changes while Solita pauses, not while she talks.
//
// s8 (Image content) is NOT in the film: the label index was empty on the day (checked via AX,
// the group opens with no rows). s9 follows s7 — 'Eine davon' then points at the four big files.
//
// FORBIDDEN by the plot's guardrails, section C: KI, künstliche Intelligenz, Algorithmus,
// Datenbank, Cloud-Service, smart. Used because visible: Reiter, Ordner, Facette, Schnitt,
// Zahl, Ort, Größe, Jahr. One new word per scene: Reiter (s1), Facette (s5), Schnitt (s6).
//
// LOAD-BEARING BRIDGES: s1 plants "gemessen, nicht gemalt" and the two tabs; s4 turns the
// tree into numbers; s9 needs s5's "aus allen Ordnern" so the way back into ONE folder
// lands. s10 refers to the 2016 card on screen, nothing else.
export const NARRATION = {
  // --- Akt 1: der Finder, nachgemessen -----------------------------------------------
  s1: '<speak>Das ist nicht der Finder.<break time="600ms"/> Aber er wurde am Finder gemessen: ' +
      'einundzwanzig Pixel je Zeile, vierzehn Punkt Schrift, dieselbe Toolbar auf derselben Linie.' +
      '<break time="500ms"/> Neu sind nur die zwei Reiter oben links — Folders und Semantics.' +
      '<break time="400ms"/> Den ersten kennst du schon.</speak>',
  s2: '<speak>Home.<break time="1400ms"/> Ein Projektordner.<break time="1500ms"/> ' +
      'Zurück,<break time="1100ms"/> und wieder vor.<break time="1100ms"/> Ein Klick auf ' +
      '„Date Modified", und die Liste sortiert um; die Pfadleiste unten läuft mit.' +
      '<break time="400ms"/> Nichts davon musst du lernen — das ist die Bedingung, nicht die Pointe.</speak>',
  s3: '<speak>Ein Ordner, der in OneDrive liegt.<break time="1500ms"/> Er sieht aus wie jeder andere.' +
      '<break time="600ms"/> Nur die kleinen Abzeichen neben den Namen verraten, was schon auf der ' +
      'Platte ist und was noch in der Wolke.<break time="500ms"/> Merk dir das: Der Ort ist eine ' +
      'Eigenschaft der Datei.</speak>',
  // --- Akt 2: der zweite Reiter --------------------------------------------------------
  s4: '<speak>Und jetzt der zweite Reiter.<break time="900ms"/> Semantics.<break time="1200ms"/> ' +
      'Die Seitenleiste ist kein Baum mehr, sie ist eine Zahlentafel: Bilder, Audio, Code, ' +
      'Textdokumente — jede Art mit ihrer Zahl.<break time="500ms"/> Nicht für den Ordner, in dem ' +
      'du stehst.<break time="300ms"/> Für den ganzen Mac.</speak>',
  s5: '<speak>Dreiundzwanzigtausendfünfhundertneunzehn Bilder.<break time="700ms"/> Ein Klick,' +
      '<break time="1200ms"/> und sie stehen rechts in einer Liste — aus allen Ordnern zugleich; ' +
      'die Spalte „Folder" sagt, woher jedes kommt.<break time="500ms"/> So ein Klick heißt Facette.' +
      '<break time="400ms"/> Die Frage „alle Bilder?" hat im Finder keinen Ort.<break time="300ms"/> ' +
      'Hier ist sie einer.</speak>',
  s6: '<speak>Eine zweite Facette dazu:<break time="400ms"/> die letzten dreißig Tage.<break time="1500ms"/> ' +
      'Die Liste schrumpft — und schau auf die Seitenleiste: alle anderen Zahlen schrumpfen mit.' +
      '<break time="500ms"/> Jede Facette zählt neu, was nach den anderen übrig bleibt.' +
      '<break time="400ms"/> Zwei Schnitte durch denselben Mac, und du siehst die Antwort, bevor du klickst.</speak>',
  s7: '<speak>Alles wieder weg.<break time="1200ms"/> Dann Größe:<break time="400ms"/> ab einem ' +
      'Gigabyte.<break time="1500ms"/> Vier Dateien. Ein Installer, ein Archiv von einundzwanzig ' +
      'Gigabyte, zwei Filme.<break time="400ms"/> Aufräumen fängt bei der ' +
      'größten Datei an, und die liegt nie da, wo man sucht.</speak>',
  s8: '<speak>Und das hier ist nicht der Dateiname.<break time="400ms"/> Das ist der Inhalt.' +
      '<break time="800ms"/> Der Mac hat jedes Bild angesehen — hier, auf der Platte, ohne Netz — ' +
      'und sagt, was darauf ist.<break time="700ms"/> Ein Klick auf „document",<break time="1300ms"/> ' +
      'und die Scans aus allen Ordnern stehen da. Als Namen.<break time="300ms"/> Die Bilder bleiben, ' +
      'wo sie sind.</speak>',
  // --- Akt 3: zurück in den Ordner -------------------------------------------------------
  s9: '<speak>Eine davon.<break time="1200ms"/> Ein Klick auf ihren Ordner,<break time="1400ms"/> ' +
      'und der Reiter springt zurück auf Folders:<break time="1000ms"/> derselbe Baum wie am Anfang, ' +
      'die Datei markiert.<break time="500ms"/> Nichts wurde verschoben.<break time="300ms"/> ' +
      'Ordnung und Ordner sind zwei Wege zur selben Datei — man fragt nur anders.</speak>',
  s10: '<speak>Der zweite Reiter ist keine neue Idee.<break time="500ms"/> Das hier ist ein Entwurf ' +
       'von zweitausendsechzehn: ein Finder-Fenster, zwei Reiter — „Semantics" und „Mac".' +
       '<break time="600ms"/> Zehn Jahre später ist er gebaut, und der Finder daneben ist derselbe ' +
       'geblieben.<break time="700ms"/> Pinker-Finder.<break time="300ms"/> Im Doc Alvers Mathe-Labor.</speak>',
};
