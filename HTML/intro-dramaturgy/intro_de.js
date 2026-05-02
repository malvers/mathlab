/**
 * Reference dramaturgy (German). Maintain narrative content only in this file.
 * Translations: intro-dramaturgy/intro_<lang>.js — sync after edits here.
 * Open intro: ?lang=en (also es, fr, it, pt, nl, sw, tr). Else browser language or de.
 *
 * In dramaturgy text only: line «#notranslate» = following section (until next #)
 * is not translated / copied from this file for other languages (same as a # section break).
 *
 * Dynamic count: line «#numberlabs» (after optional «200pt» etc.) → LABS_DATA.length when intro loads js/labs-config.js.
 *
 * @locale de
 */
window.__INTRO_DRAMATURGIE_TXT = `

#notranslate
80pt
DOC ALVERS 
120pt
MATHE-
LABORE
16pt
von Dr. Michael R. Alvers

#
200pt
#numberlabs
60pt
Interaktive Mathematik
Labore

#
120pt
7 Sprachen
20pt
%purplepulsating and counting
30pt
deutsch
englisch
spanisch
französisch
italienisch
portugiesisch
kiswahili

#
// es werden alle screenshots gezeigt
%pause 500
%screenshots
%pause 500

# 
60pt
7 Technologien 
40pt
hypertext markup language
cascading styles sheets
type script
java script
python
JSON
JAVA

# 
200pt
%loc
60pt
Programmzeilen

#
für Euch!
%picture resources/kids.jpeg
%sound resources/kids.wav
//%video https://coverr.co/videos/welcome-back-to-school-classrooms-first-lesson

#
100pt
das crazy!
180pt
%emoji 😎
%button zurück

#
%cwstack left
120pt
docalvers.de

%stop

`.trim();
