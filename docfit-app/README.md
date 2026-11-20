# DocFit

A stopwatch for the morning workout that listens (Doc, 16.11.2026: "wenn ich sage DocFit ... soll das Ding ... eine
Stoppuhr starten. Und wenn ich sage Stopp, soll der die Stoppuhr stoppen. ... die Zeit soll dann in eine Liste
eingetragen werden mit Datum und Uhrzeit").

- While the "Stoppuhr" tab is open it listens all the time: **"DocFit Start"** starts, **"DocFit Stopp"** stops
  (Doc, 19.11.2026 - plain "DocFit" / "Stopp" fired far too often from talk nearby: "Ständig geht das Ding an neben
  mir"). Plain "DocFit" or "Start" do nothing. A plain **"Stopp"** stops too, but only while the stopwatch runs (Doc,
  20.11.2026: "dass wenn ich nur ‚Stopp' sage, das in dem Modus dann auch stoppt") - same rules as the phrase (conf,
  only noise around it, said on its own); standing still it does nothing. On the "Waage" tab and in the background
  voice control is off.
  Start and Stopp buttons as a fallback. Short buzz + beep on start, two on stop. The screen stays on.
- The moment comes from the word times: the stopwatch starts at the end of "DocFit Start" and stops at the beginning
  of "DocFit Stopp", not when the recognizer is sure.
- Above the stopwatch stands only the command to say next: **DocFit Start**, while it runs **DocFit Stopp** - no
  "bereit" / "gestoppt", no hint line below it (Doc, 20.11.2026: "nimmt Platz weg", "das ist doppelt"), no word or
  sign for listening ("‚hört zu' braucht man nicht", "den Kreis bitte wegmachen") - only a problem (no microphone,
  recognizer failed) is written out. The drawn digits are exactly as wide as the button row, Start's left edge to
  Reset's right edge ("so breit wie die Buttons"; `DigitsView.setFitWidth` measures the glyphs' ink, not their cells -
  on the Pixel 32.0..1046.8 px against buttons 32..1048 px): sized on the shape "00:00", so nothing jumps; from an hour
  on ("0:00:00") once a little smaller. Green while ready, red while running (`Palette.alarm`, "wir machen die rot,
  wenn sie läuft"), orange after a stop. More air between the parts ("in Y auseinanderziehen").
- After a stop the time goes into the list (day, start time, duration), newest first, kept on the phone, and stays big
  on the display. **Reset** (until 20.11.2026 "Zurücksetzen"; Start, Stopp and Reset are three equally wide buttons)
  sets the display back to 00:00 after a stop; swiping that run out of the list clears the display too, "Rückgängig"
  brings both back (Doc, 19.11.2026). Nothing leaves the phone, there is no export (a private web view may come later).
- Times show minutes and seconds ("07:42", "1:02:03" from an hour on), no tenths (Doc, 19.11.2026); the list keeps
  the milliseconds. Every number (stopwatch, list, scale values) is drawn by `DigitsView`, the app's counterpart of the
  web's `CyberClock.digits`: each digit centred in a cell as wide as the widest Orbitron digit, so nothing wobbles.
- Second tab **"Waage"**: the Vitafit body-fat scale (below).
- Third tab **"Fasten"** (until 20.11.2026 "Fasting" - Doc: "wir haben es ja nun mal Deutsch"): Doc's fasts from his
  health workbook (below).
- One page margin for all tabs, 12 dp left and right (`MainActivity.PAGE_SIDE`; Doc, 20.11.2026: "Links und rechts geht
  das breiter").
- **Einstellungen** (the gear right of the title): **Farbschema** (Doc, 19.11.2026: "ein Gray-Design ... und auch ein
  helles, wie immer") chooses Blau / Grau / Hell like in DocDo - the same keys (dark / grey / light) and the values of
  `HTML/svp/svp-tokens.css`; Blau stays DocFit's navy. In Grau page and cards stand further apart than in the svp
  (Doc, 20.11.2026: "Im Graumodus müsste sich der Hintergrund und die Cards noch ein bisschen mehr absetzen"): page
  #131315, cards #2C2C30 (were #1A1A1C / #252528, contrast 1.33 instead of 1.14), the fasting page alike. All colours come from `Palette.java` (tested in `PaletteTest`:
  every text readable on its ground); the choice is kept in the app's preferences ("theme"), the screen is built again.
  The fasting page has the same three in its CSS and asks the app for the key (`DocFitApp.theme()`); in a browser it
  has its own gear and keeps the choice under `svp-theme` like DocDo.
  Below it **Messmethode**: the newest measured resistance and where every value of the scale tab comes from (Doc,
  20.11.2026: "Nimm den Text ‚Geschätzt aus … Ω Widerstand' raus und tu ihn unter Einstellungen irgendwohin";
  `ScaleTexts.method`).
- The weight on the scale tab stands in a **pill** like the tiles below it (Doc, 19.11.2026: "Der Einzige, der
  keine Pille hat, ist Gewicht", then "Gewicht braucht man da nicht schreiben ... in die Pille rein, das Datum und die
  Uhrzeit"): a rounded box in the card colour right on the page - no big card around the pills any more (Doc,
  20.11.2026: "erst die große Kachel, wo alles drin ist, dann noch kleine Kacheln darin") - the small Orbitron label
  above the value: for the weight the moment of the weigh-in ("DO 19.11.2026 · 07:12 UHR", `ScaleTexts.when`), for the
  tiles KÖRPERFETT, WASSER, ... One code path for all pills, the compact bar's too (`MainActivity.pill` / `pillLabel` /
  `pillParams`); a label too long for its pill (big system font) gets a little smaller instead of being cut.

## Why Vosk

Offline, no cost per word, no network: Vosk (Kaldi) with the small German model `vosk-model-small-de-0.15`
(Apache 2.0) and a closed grammar is a keyword spotter. Android's SpeechRecognizer ends after every sentence and must be
restarted (chime, and a gap where a "Stopp" gets lost); offline only where Google's on-device model is installed.
"DocFit" is no German word - the model hears it as "dock fit". The grammar holds the two phrases, their parts and
look-alikes (Topf, Doktor, Fitness, Stoff, Tor, stark, statt, Stadt) so they land on themselves. A result is a command
only with "dock", "fit", "start"/"stopp" in a row (dock/fit conf >= 0.5, the command word >= 0.7, at most 0.3 s and
0.5 s apart), nothing but noise around it in the result, and said on its own: the audio 0.1-0.5 s before and after the
phrase at most half as loud as the phrase (`LoudnessMeter`) - the grammar hides the other words of a sentence, the
loudness does not (`Commands.java`, unit-tested in `CommandsTest`).

Every command, and every phrase turned down, is logged with the words and confidences (only the grammar's words):
`adb logcat -s DocFit`.

Measured on silent samples (`test/`, six German macOS voices, 186 samples incl. single words, "Stopp mal", "Ich bin
heute fit" and radio-like talk): "DocFit Start" 24/24, "DocFit Stopp" 22/24, false commands 0 of 138. The rule before
(plain "DocFit"/"Stopp", 19.11.2026 morning): 29 false starts in 132. While the stopwatch runs (20.11.2026, plain
"Stopp" added - only the word on its own, conf >= 0.7, quiet around it): plain "Stopp" / "Stop" 12/12, false stops 0
of 150 (`test_app_rule.py` checks both modes).

## Waage: Vitafit VT701

Doc, 19.11.2026: "ja, bau das in DocFit ein". The scale: "Vitafit Smart Body Fat Scale, Model VT701, FCC ID
2A2DS-HB917", 4 electrodes, Bluetooth LE, no pairing needed.

- While the "Waage" tab is open, DocFit looks for a device whose name starts with "Vitafit", connects and reads the
  weight and the resistance between the feet (`ScaleLink` = Bluetooth, `ScaleSession` = one weigh-in, `Vt701` = the
  frames). The state line says "Stell dich auf die Waage …", "verbinde …", "Misst … 85,15 kg", "Fertig – gespeichert".
- The last weigh-in stands big (Gewicht, Körperfett, Wasser, Muskel, BMI, Bauch, Bauch/Größe, Hüfte, Bauch/Hüfte), the list below has
  date and time; swipe to delete, "Rückgängig". Stored on the phone like the stopwatch times (`Weighings`). Only
  weight, resistance, moment and the girths typed in are stored; the body values are computed when shown, so a profile
  entered later also fixes older weigh-ins.
- **Scrolling the list up** pushes the big card away until a compact bar is left: date and weight, fat, fitness of
  the newest weigh-in - or, while a weigh-in runs or Bluetooth needs a tap, the state line. Back at the list's top the
  card comes down again; a drag on the card itself scrolls too (with fling) and goes on into the list - the card with
  all tiles is taller than the screen ("Auf Waage kann ich jetzt überhaupt nicht mehr scrollen", fixed the same day);
  no snapping, the card stays where the finger leaves it; a tap on the bar opens it; stepping on the scale and every
  new result open it too (Doc, 20.11.2026: "Wenn ich nach oben scrolle, müssen wir das intelligenter machen,
  so dass ich unten die einzelnen Daten sehen kann"). `CollapsingHeader` on RecyclerView's nested scrolling
  (androidx.core) - the rule of Material's AppBarLayout "scroll|exitUntilCollapsed" without the Material library
  or an AppCompat theme; the arithmetic is `HeaderOffset`, tested in `HeaderOffsetTest`.
- **Bauch und Hüfte** (Doc, 20.11.2026: "Zum Eingeben brauchen wir noch irgendwo ein Feld für Bauchumfang", "ja, bitte
  auch ein Feld für Hüftumfang"): a tap on a row of MESSUNGEN - or on BAUCH / HÜFTE ("+" while empty) for the newest
  weigh-in - opens a dialog with two fields, cm with one decimal (comma or point, 50-200 cm), either may stay empty.
  Stored with that weigh-in as `waistMm` / `hipMm` (mm), only in rows that have them: rows saved before read as they
  are, rows without girths are written exactly as before. A row that cannot be read is skipped, never the list, and a
  list that could not be read completely is kept once under `weighingsUnread` before anything is written over it
  (`WeighingsTest`). From them (`Girths`, tested in `GirthsTest`):
  - **BAUCH/GRÖSSE** (waist-to-height, WHtR) - the main waist value. Ashwell M, Gibson S, BMJ Open 2016;6:e010159
    (doi:10.1136/bmjopen-2015-010159): below 0.5 gut, 0.5 to below 0.6 erhöht, from 0.6 hoch;
  - **BAUCH/HÜFTE** (waist-to-hip, WHR). WHO, Waist circumference and waist-hip ratio, expert consultation Geneva 2008 (2011):
    erhöht from 0.90 (men) / 0.85 (women), sex from the profile.
  Both cut (not rounded) to two decimals, so the number shown and its reading match the exact cut-offs; the reading
  is the tile's range bar and the colour of the value (`Palette.alarm` is a brighter red on the dark cards). Labels
  in German without abbreviations (BAUCH/GRÖSSE, BAUCH/HÜFTE). BMI stays for now. Under the two fields a small line
  sketch shows where to measure (`GirthSketch`: a tailor's dummy from the front, the tape for Bauch through the navel
  in λ, for Hüfte at the widest part in φ - drawn in code, no picture from elsewhere).
- One weigh-in gives one row: a session ends with its first result, and a result with the same weight within three
  minutes of the newest row is a repeat (a reconnect while the scale still shows it) - it only fills in a missing
  resistance.
- No skin contact (socks, feet off the metal plates, stepped off early): the scale sends the resistance 0xFFFF (real
  test 19.11.2026). DocFit confirms it, saves the weight with resistance 0 and says so: state line "Gewicht gespeichert
  – Körperfett nicht gemessen", under the tiles "Kein Körperfett gemessen – barfuß auf alle vier Metallflächen …"
  (`ScaleTexts`). Old rows that still hold 65535 count as not measured too.
- Under the tiles a **fitness score 1-10** (Doc, 19.11.2026: "Ein Indikator von grottenschlecht bis 10
  Top-Athlet"): ten segments from Υ red to φ green, the number and its word (1-2 „grottenschlecht“, 3-4 „ausbaufähig“,
  5-6 „solide“, 7-8 „fit“, 9-10 „Top-Athlet“) and „Orientierung, keine ärztliche Bewertung“ - no sentences any more,
  what each value means stands in its tile (Doc, 20.11.2026: "Den Text unter ‚8 fit' weg ... das steht ja schon
  oben"). No score without a measured resistance or a complete profile - a short hint instead (`FitnessScore`,
  `ScoreBar`, see below).
- **A tap on a tile or on the weight opens its sheet** (Doc, 20.11.2026: "dass man dort genauere Informationen findet,
  warum das schlecht, gut oder whatsoever ist", "natürlich der Verlauf ... so wie beim Fasten"): the newest value with
  its word, the course over all weigh-ins (`HistoryChart`, drawn on a Canvas: line and points over time, the zones as
  faint bands, for Bauch the goal lines "< 102 WHO rot", "< 94 WHO grün" and "< half the height Bauch/Größe 0,5" from
  the profile; one point and "Verlauf erscheint ab der zweiten Messung" until there are two), every zone with its
  numbers, what it is, how it is measured, what moves it, why it matters, the source and the disclaimer (`TileInfo`,
  `History`, tested in `TileInfoTest`, `HistoryTest`). The weight gets the WHO BMI ranges in kg for the height. Empty
  Bauch / Hüfte tiles show "–" and "+ Bauch eintragen" / "+ Hüfte eintragen" and go straight to the entry; filled
  ones open the sheet with "Ändern". A value without a threshold of its own (Hüfte) stands without colour - its sheet
  says why.
- **Every tile reads itself** (Doc, 20.11.2026: "Wir müssen die Informationen immer in die jeweilige Kachel bringen
  ... Und in jede Kachel so einen kleinen Slider, wie der Wert zu interpretieren ist"): the value in the colour of
  its zone, a small range bar with the zones (φ green good, λ orange borderline, Υ red high) and a marker at the value,
  and one line with the reference. One table for all of them, `Ranges` (tested in `RangesTest`), from the references
  already used: Körperfett after ACE/Gallagher for sex and age ("gesund unter 25 % für Männer ab 60"), Wasser the
  commonly quoted typical range (men 50-65 %, women 45-60 % - no clinical cut-off), Muskel against Janssen 2004 in kg
  for the height (high risk at or below 8.50, normal from 10.76 kg/m² for men; 5.75 / 6.76 for women), BMI after the
  WHO, Bauch after the WHO 2008 (men 94 / 102 cm, women 80 / 88 cm), BAUCH/GRÖSSE after Ashwell, BAUCH/HÜFTE after
  the WHO. Values are placed as shown (one decimal, ratios cut). The tiles of a row are equally high; the reference is
  one line ("dass da immer nur eine Zeile steht"); a tile without a value shows no bar. Under it a note only when something is missing (no profile, no fat
  measured, an implausible resistance) - the method is under Einstellungen › Messmethode.
- "Profil" (next to MESSUNGEN): height, birth year, sex. Empty until Doc types them, stored only in the app's
  preferences - no personal value in this repository. Without a profile the app shows the weight alone.
- Android 12+: "Geräte in der Nähe" (`BLUETOOTH_SCAN` with `neverForLocation`, `BLUETOOTH_CONNECT`), asked with a German
  explanation the first time the tab opens; a tap on the state line asks again or opens the app settings.

**The protocol** (service 0xFFF0, notify 0xFFF1, write 0xFFF2). Every frame is `start, length, 0x26, type, payload,
XOR check, 0xAA` (start 0x5A from the scale, 0xA5 from the phone). After three greeting frames the scale streams type
0x10 weight frames (10 g units, a flag says "stable"); the phone confirms the stable weight, the scale then measures and
sends the resistance in a type 0x11 frame, which the phone confirms too. Details in `Vt701.java`.

The protocol knowledge comes from **openScale** (https://github.com/oliexdev/openScale, `VitafitVT701Handler`, GPLv3),
which decoded the scale from a Bluetooth log of the vendor app. DocFit's code is its own implementation of that
description; no openScale code is copied. The test frames of a real weigh-in in `ScaleTest` are the bytes openScale
published.

**Body composition** (`BodyComposition.java`), the equations openScale uses for this scale, re-implemented from the
papers:
- fat-free mass and total body water: Sun SS et al., Am J Clin Nutr 2003;77:331-340 (doi:10.1093/ajcn/77.2.331) -
  body fat % = (1 - FFM/W)·100, water % = TBW/W·100 (1 L taken as 1 kg);
- skeletal muscle mass: Janssen I et al., J Appl Physiol 2000;89:465-471 (doi:10.1152/jappl.2000.89.2.465);
- BMI = W / H².

**Fitness score** (`FitnessScore.java`, tested in `FitnessScoreTest`), mainly the body fat for sex and age:
- Gallagher D et al., Healthy percentage body fat ranges: an approach for developing guidelines based on body mass
  index. Am J Clin Nutr 2000;72:694-701 (doi:10.1093/ajcn/72.3.694), as commonly tabulated (white adults) - "healthy"
  below men 20/22/25 %, women 33/34/36 % (20-39/40-59/60-79 years), "obese" from men 25/28/30 %, women 39/40/42 %;
- American Council on Exercise (ACE) categories: athletes men 6-13 / women 14-20 %, fitness 14-17 / 21-24 %,
  average 18-24 / 25-31 %. ACE has no age groups: the athletes' and fitness limits move up with Gallagher's healthy
  limit (men +2/+5, women +1/+3) - our own combination.
- Bands: ACE athletes 9-10, ACE fitness 7-8, up to Gallagher's healthy limit 5-6, Gallagher overweight 3-4, obese
  1-2 (lower half of a band = the higher point); below the athletes' range (essential fat only) 7.
- Corrections, one point each: BMI (WHO) below 18.5 or from 30; skeletal muscle per height² at or below the high-risk
  cut-off of Janssen I et al., Am J Epidemiol 2004;159:413-421 (doi:10.1093/aje/kwh058): men 8.50, women 5.75 kg/m²
  (same BIA equation as the muscle tile). BMI 25-30 alone costs nothing - with muscles that is normal.

Estimates, not a lab: the equations were made with hand-to-foot resistance, the scale measures foot to foot. The
trend counts - weigh in under the same conditions (morning, barefoot, not right after the workout).

Not yet checked on the real scale: that it really advertises as "Vitafit…", that the greeting and the confirmations
are enough for it to send the resistance, and how plausible the values are for Doc.

## Fasten (Fasting)

Doc, 19.11.2026: "Ich habe ja mehrere Male gefastet und dort eingetragen" - a page with the data and charts of every
fast, "eine extra Rubrik ... Fasting" in DocFit. The page's code is public, its data is not.

- `web/fasting/` is a small offline web page (`index.html`, `fasting.js`, `fasting.css`, Orbitron, Chart.js 4.5.1 from
  npm, MIT, vendored in `lib/`). The app shows it in a WebView from the APK's assets (`app/build.gradle` adds `../../web`
  as an assets folder); the app still has no internet permission. Back inside the tab goes back in the page.
- "Vergleich": all fasts on top of each other from day 1, one measure at a time, change since day 1 or absolute; the
  fasts are toggles in the legend (colour follows the fast) - small chips with a colour dot and "Jan 21", several to a
  line (Doc, 20.11.2026: "die Legende darunter nimmt verdächtig viel Platz weg"). The measure buttons carry short names
  (Bauch, Fett, Puls, ...) and wrap, so all of them are in sight on a phone ("ein bisschen schmaler, sodass die Tasten
  auch hinpassen"); in the app the cards use the full width inside DocFit's page margin. Below, a card per fast. One fast: start -> end of every
  measure (day 1 morning -> morning of the last fasting day; ketones: the highest value), a chart per measure like
  Doc's Excel dashboard with the fast shaded and a red line on its last day (dashed when the end is not written down),
  "Fastenzeit" / "+4 Wochen" / "+3 Monate" afterwards, the day's comment in the weight chart's tooltip.
- Every row of fasts (tabs, legend, cards, lines) runs in time order, oldest left, newest right (Doc, 19.11.2026). A tap on a chart tile or on the comparison chart opens it big (Doc: "ganz groß ..., dass man die
  richtig gut lesen kann"): the same chart drawn again over the whole screen with larger text, tooltips work; closed by
  the X, a tap beside it, Esc or Back (one history step, so Android's back closes it too).
- **Turning the phone** (Doc, 19.11.2026: "ja, drehen lassen"): only the "Fasten" tab may turn (`allowTurn`:
  fullUser there, portrait on Stoppuhr and Waage - their buttons and the scale card do not fit a phone's height on its
  side). The manifest's `configChanges` keeps the activity on a turn: stopwatch, voice listener, a weigh-in and the page
  (an open big chart) go on, nothing reloads. On its side the fasting tab shows only the page (Doc: "da will man
  eigentlich nur die Grafiken sehen"): title with the gear, tabs and status bar step aside until the phone stands
  upright again; Back still works inside the page.
  With the rotation lock on, Android stays upright after Stoppuhr/Waage (it moves its locked rotation along).
- **Health data never goes into git.** `web/fasting/private/` is gitignored (`docfit-app/.gitignore`):
  `fasts.json` (the workbook path, the layout of its sheets, the periods: start, last fasting day, where the workbook
  marks them, colour; a few dated events) is written by hand; `fasting-data.js` is generated:

      python3 tools/fasting_from_excel.py            # workbook path from private/fasts.json
      python3 tools/fasting_from_excel.py BOOK.xlsx  # or a copy

  The script only reads the workbook (zip archive, cached cell values, standard library only), keeps sheet and cell of
  every value, fixes a few typed date typos by the weekday next to them and prints what it fixed or left out. Blood
  sugar is always the mg/dl column (in some sheets headed "mmol/l" although the values are mg/dl). The expected shape
  of the "sheets" entry is in the script's docstring; without it the script stops with a message.
- On the Mac, without building: open `web/fasting/index.html` (works from file://) or
  `python3 -m http.server 8774 --bind 127.0.0.1 -d web` -> http://localhost:8774/fasting/ (localhost only, never the
  forloop server: that folder is public).
- After new data: run the script, then `./build.sh` again - the data travels inside the APK.

## Build

    ./build.sh            # fetch the model once (cache ~/Library/Caches/docfit), unit tests, APK, install on the Pixel
                          # unit tests: CommandsTest (voice, loudness), LastRunTest (display, reset, delete/undo),
                          # ScaleTest (frames, weigh-in, repeats, scale-tab lines), BodyCompositionTest, FitnessScoreTest
                          # PaletteTest (colour schemes), GirthsTest (waist, hip, WHtR, WHR), RangesTest (tile
                          # zones and lines), HistoryTest, TileInfoTest (detail sheets), HeaderOffsetTest
                          # (collapsing scale card), WeighingsTest (storage, girths, old rows, broken rows)
    ./build.sh --bauen    # build only

The model (~45 MB) is never committed (`android/.gitignore`); the APK is ~56 MB (arm64 only).
