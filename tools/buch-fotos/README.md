# Photos for the textbooks

Doc, 24.10.2026, with the first KDP proof in hand: "Wir haben in den Büchern praktisch überhaupt keine Bilder aus der
Lebensrealität … Das wünsche ich mir wirklich sehr." Since 25.10.2026 every book can carry photos from life, the same in
every language.

- **The list:** `HTML/js/buch-fotos.js` — every photo (who took it, licence, page on Wikimedia Commons, alt text) and where it
  goes in which chapter (a selector, inside a box or as a wide banner). `js/buch.js` places them online and in the print
  edition, in every language, with the credit line "Bild: … · licence · Wikimedia Commons" in the book's language.
- **The files:** Cloudflare R2, bucket `media`, folder `buch/fotos/` — never in git (`HTML/buch/fotos/` is ignored).
  1200 px on the long side for a photo in a box, 2000 px (a panorama up to 3600) for a banner, JPEG without metadata.
- **Licences:** only Wikimedia Commons (free by rule), never "NC" (the books are sold through KDP), never GFDL alone (it
  wants its whole text printed). People: rather from behind or far away.

## The way through a book (run everything from a scratch folder outside the repo, a local server on `HTML/` on PORT)

1. List the chapters, their lead-in boxes (`.b-einstieg`) and excursions; choose a motif that the text itself names
   (the taxi of the taxi task, the wine barrels of Kepler's rule, the portrait of the mathematician in the excursion).
2. `python3 -I tools/buch-fotos/suche.py <dir> <tag> <query …>` per motif (Commons search, ≥ 1800 px, thumbnails + json),
   `python3 -I tools/buch-fotos/bogen.py <dir> <dir>.png` and look at the sheet; pick one tile per spot.
3. A plan `{file: [[name, selector, "in"|"after"]]}`; `node tools/buch-fotos/stellen.mjs <plan.json> <book> -en -es -it -fr`
   says which selectors do not match exactly once (in every language).
4. A spec (plan, source tile per name or `"reuse"`, alt text de/en, width % and object-position for boxes) and
   `python3 -I tools/buch-fotos/einbauen.py <book> <spec.json>`: download, resize, upload to R2
   (`tools/media_publish.mjs`, which reads the file back), entries into `js/buch-fotos.js`.
5. `node tools/buch-fotos/laden.mjs <book> -en -es -it -fr` (every photo loads from R2), `node tools/buch-fotos/ansicht.mjs <book>`
   (a screenshot per spot, look at the crops), `node tools/kdp/druckcheck.mjs <book> http://localhost:<port>`.

Good spots: the lead-in box of a learning unit (`#le<n> .b-einstieg`), the excursion text (`#exkursion .b-row > .b-text`),
a banner below the chapter opener (`#auftakt .b-hero`, put `after`), the end of a chapter that leaves white paper
(`#test > .b-labs`, put `after`). A photo inside a widget is lost in print: the print edition removes `.b-help` and controls.
