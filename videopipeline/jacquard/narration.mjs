// Jacquard — the spoken script. Own file so the text can be re-synthesised without
// touching the recording or the cut. Budget from the earlier films: roughly 147 words
// per minute. The plot (HTML/drehbuch/jacquard.html) plans 335 s over 13 scenes; that
// is scene length, not speaking time, so the text below stays near 640 words — about
// 4:20 of speech inside a ~6:00 film, which leaves the machine room to be heard.
//
// MEASURED IN THE LAB (headless, localhost:8765) — everything spoken is on screen:
//   thread slider 8..1000, geometric: 16 -> 14 %, 48 -> 37 %, 140 -> 59 %, 1000 -> 100 %
//   tempo slider: 1x at 40 %, 2x at 57 %
//   Doc-Muster 1600x987, aspect 1.6211; the film's frame is winX .28 winY .63 winW .14
//     winH .284 -> 45 x 56 cards, cell purity 0.81 (the whole drawing at 45 threads is
//     0.25, i.e. confetti - that is scene 11, not scenes 1 to 6)
//   readout format: "KARTE 28 / 56 · 10 LÖCHER von 45", HUD caption "45 × 56 · AUSSCHNITT"
//
// TWO NUMBERS ARE DELIBERATELY NOT SPOKEN. In s5 the card counter and in s9 the hole
// count depend on the window the choreography picks, and that window is still being
// laid out in run2. The screen shows both figures while Solita speaks, so the film is
// concrete either way — but the text does not hard-code a number that a re-cut could
// silently falsify (plot rule 4: only read a number that is standing in the picture).
//
// THE RESOLUTION IS ONLY VISIBLE IN THE CLOTH. Both pattern maps render the design as a
// function at screen resolution — a circle at 16 threads is smooth there. The staircase
// exists in the woven cloth and in the HUD caption, so s10 to s12 are WEBSTUHL-tab
// scenes and the excerpt bottom right must stay uncovered by Solita's bubble.
//
// FORBIDDEN by the plot's guardrails, section C: binär, digital, Algorithmus, Software,
// Bitmap, Abtasttheorem. "Bit" would have been allowed from s3 on; it is not used at
// all — "ein Loch oder kein Loch" carries the whole idea, and s13 gets its punch from
// Babbage and Hollerith rather than from a term. Allowed and used, because the picture
// shows them: Loch, Kettfaden, Nadel, Haken, Messer, Fach, Schuss, Weblade, Karte,
// Auflösung. One new word per scene, none after s5.
//
// LOAD-BEARING BRIDGES, must survive any recut: s3 ends on "eine Entscheidung aus
// Pappe" and s4 turns it into a visible point of colour; s10 plants that the design
// never changed, which is the only reason s11 can accuse the machine of inventing
// something. The 5120 needles of a modern loom (s12) are the one figure from outside
// the lab — spoken as a comparison, marked as such.
export const NARRATION = {
  // --- Akt 1: die Maschine baut sich auf --------------------------------------------
  s1: 'Das ist keine Rechenmaschine. Holz, Draht, Schnüre — und ein Band aus Pappe. ' +
      'Baujahr achtzehnhundertfünf. Kein Strom, kein einziges Bauteil, das rechnet. ' +
      'Trotzdem kommt hier ein Bild heraus, das vorher jemand aufgeschrieben hat. ' +
      'Nur: wie schreibt man ein Bild auf, wenn die Maschine nichts kann außer Fäden heben?',

  s2: 'Gehen wir nah heran. Das sind die Kettfäden, gespannt von hinten nach vorn. ' +
      'Über jedem steht ein Draht: unten der Haken, oben die Nadel. Und jetzt das ' +
      'Wichtige — alles, was gleich passiert, passiert pro Faden. Der Webstuhl kennt ' +
      'keine Formen und keine Flächen. Er kennt nur diese eine Frage, einmal für jeden Faden.',

  // Kernszene. The breaks sit where the card drops, the needles sort themselves and
  // the knife rises — she must not be ahead of the mechanism.
  s3: '<speak>Die Karte kommt. Sie legt sich an die Nadelreihe. <break time="800ms"/> ' +
      'Wo ein Loch ist, rutscht die Nadel hindurch, und ihr Draht bleibt stehen. Wo Pappe ' +
      'ist, wird die Nadel weggedrückt, und mit ihr der Haken. <break time="900ms"/> ' +
      'Jetzt fährt das Messer hoch. Es nimmt nur mit, was stehen geblieben ist. ' +
      '<break time="700ms"/> Das ist der ganze Trick. Loch: oben. Kein Loch: unten. ' +
      'Zwei Möglichkeiten, keine dritte. Eine Entscheidung aus Pappe.</speak>',

  s4: 'Die gehobenen Fäden ziehen das Fach auf — den Spalt. Das Schiffchen fliegt ' +
      'hindurch und legt den blauen Schuss hinein, die Weblade schiebt ihn an. Und jetzt ' +
      'wird die Entscheidung sichtbar: wo der Faden oben war, bleibt er oben — ein heller ' +
      'Punkt. Wo er unten war, deckt Blau ihn zu.',

  // NOT a stack of cards: they are laced together into an endless band that runs over a
  // prism, card by card. Doc had flagged that in the plot; the film says it correctly.
  s5: '<speak>Die Karte ist verbraucht. Sie fährt heraus, die nächste rückt nach. ' +
      '<break time="700ms"/> Der Zähler springt eine Karte weiter. Eine Karte ist genau ' +
      'eine Zeile. Und die Karten hängen aneinander, zu einem endlosen Band vernäht — ' +
      'das Band ist die Reihenfolge, mehr steckt da nicht drin.</speak>',

  s6: 'Jetzt lassen wir sie laufen. Zeile um Zeile, Karte um Karte. Irgendwann sieht man ' +
      'den einzelnen Schritt nicht mehr, man sieht Stoff. Aus lauter Ja und Nein ist eine ' +
      'Fläche geworden. Ein Bild hat niemand hineingegeben. Nur eine sehr lange Liste ' +
      'von Entscheidungen.',

  // --- Akt 2: die Umkehrung ---------------------------------------------------------
  s7: 'Und jetzt drehen wir die Sache um. Das hier ist die Zeichnung — Tusche auf Papier, ' +
      'von Hand. Der gelbe Rahmen zeigt den Ausschnitt, der eben auf dem Webstuhl lag. ' +
      'Bis hierher ging es vorwärts: aus Karten wird ein Bild. Ab jetzt rückwärts. Denn ' +
      'irgendwer muss diese Karten ja gestanzt haben.',

  // Kernszene. The long break is the alpha slider going from transparent to opaque.
  s8: '<speak>Legen wir die Lochkarten darüber. <break time="700ms"/> Und jetzt langsam ' +
      'von durchsichtig auf deckend. <break time="1400ms"/> Die Zeichnung verschwindet — ' +
      'und was übrig bleibt, ist dieselbe Zeichnung. In Löchern. Da wurde nichts erfunden ' +
      'und nichts gedeutet. Es wurde abgetastet: Punkt für Punkt gefragt, hell oder ' +
      'dunkel, Loch oder kein Loch.</speak>',

  s9: 'Und das Schöne ist: man kann eine einzelne davon anfassen. Unter dem Zeiger liegt ' +
      'eine Karte, eine einzige Zeile. Da steht, die wievielte sie ist und wie viele ' +
      'Löcher sie hat. Und genau so viele Kettfäden stehen in dieser Zeile oben. Nicht ' +
      'ungefähr. Genau.',

  // --- Akt 3: an die Grenze ---------------------------------------------------------
  // Kernszene. 16 / 48 / 140 stand in the HUD caption while she says them.
  s10: '<speak>Nehmen wir einen Kreis, da kann man mitzählen. Sechzehn Fäden — eine ' +
       'Treppe. <break time="900ms"/> Achtundvierzig — schon rund. <break time="900ms"/> ' +
       'Hundertvierzig — ein sauberer Kreis. <break time="700ms"/> Aber Achtung: die ' +
       'Vorlage hat sich kein einziges Mal geändert. Der Kreis war immer derselbe, ' +
       'beliebig fein. Was sich geändert hat, ist allein, wie eng die Maschine ihn ' +
       'abfragt. Motiv und Auflösung sind zwei verschiedene Schrauben.</speak>',

  // Notbremse, aber die ehrlichste Szene des Films. Was bei 40 Fäden über der ganzen
  // Zeichnung entsteht, sind KEINE Streifen, wie der Plot vermutet hat — es ist Konfetti
  // (Zellenreinheit 0,25, gemessen). Der Text sagt, was im Bild liegt.
  s11: '<speak>Ganzes Bild, vierzig Fäden. <break time="900ms"/> Und jetzt vergleich: ' +
       'rechts der Ausschnitt, die feine Zeichnung — und links, was der Webstuhl daraus ' +
       'macht. Konfetti. Kein grobes Bild der Zeichnung, sondern Flecken, die darin ' +
       'nirgends vorkommen. Die Maschine sieht das Bild nicht. Sie fragt pro Faden einen ' +
       'einzigen Punkt — und wo die Striche enger stehen als die Fäden, entscheidet sie ' +
       'trotzdem. Das ist kein Defekt. Das ist die Grenze der Auflösung.</speak>',

  s12: 'Dasselbe Bild, tausend Fäden. Die Spiralen sind da, die gepunkteten Linien, ' +
       'die kleinen Kringel. Zwischen Karikatur und Bild liegt nichts als Auflösung. Zum ' +
       'Vergleich: eine heutige Jacquard-Maschine hebt gut fünftausend Fäden einzeln. ' +
       'Wir sind hier immer noch eine Stufe darunter.',

  s13: 'Zurück zum Anfang. Ein Faden. Eine Karte. Ein Loch. Achtzehnhundertfünf. Babbage ' +
       'hat diese Karten gesehen. Hollerith hat mit ihnen eine Volkszählung gezählt. ' +
       'Niemand hier hat den Computer erfunden. Aber die Idee, ein Bild als Reihe von Ja ' +
       'und Nein aufzuschreiben — die ist hier gewebt worden. Aus Pappe und Faden.',
};
