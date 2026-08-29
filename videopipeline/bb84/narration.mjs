// BB84 — the spoken script. Same shape as the Conway's Iris narration: kept in
// its own file so the text can be re-synthesised without touching the recording
// or the cut. Budget measured against Iris: 850 words -> 347 s film (147 w/min).
//
// Audience: laypeople. No term that is not unpacked in the same breath —
// "Basis" stays "Alphabet", QBER becomes "Fehlerquote", and 1-(3/4)^m is
// spoken as a plain number ("drei von tausend").
//
// Entanglement, EPR, Bell and Einstein are deliberately NOT in this film; they
// get their own lab and their own film. s18 sets up that cliffhanger.
//
// Two bridges are load-bearing and must survive any recut: the last sentence of
// s3 asks the question s4 answers, and the last sentence of s13 hands over to
// the thousand runs in s14.
//
// If the film has to come down to the Iris length exactly, s9 and s15 are the
// two scenes that can go without tearing a hole in the argument (-90 words).
export const NARRATION = {
  s1: 'Alles, was du heute verschlüsselt verschickst — eine Überweisung, eine Mail, eine Krankenakte — ' +
      'kann jemand mitschneiden. Lesen kann er es nicht. Aber aufheben. Zwanzig Jahre lang, wenn es sein muss. ' +
      'Er muss deinen Schlüssel gar nicht knacken. Er muss nur warten, bis das Knacken leicht wird.',

  s2: 'Unsere Verschlüsselung ist nämlich eine Wette. Zwei große Primzahlen malzunehmen ist leicht; ' +
      'sie zurückzurechnen, schafft kein Computer der Welt. Nur ist das kein Naturgesetz, sondern eine ' +
      'Annahme über Rechenzeit — und 1994 zeigte ein Mathematiker, wie eine ganz andere Sorte Rechner sie ' +
      'gewinnt. Den Rechner gibt es noch nicht. Die Mitschnitte gibt es schon.',

  // bridge -> s4: the closing question is the whole reason the next scene exists
  s3: 'Das Problem sitzt nicht in der Mathematik, es sitzt in der Leitung. Eine normale Nachricht liest man, ' +
      'ohne sie anzufassen — lesen heißt kopieren, und Kopieren hinterlässt keine Spur. Jede Leitung der Welt ' +
      'lässt sich lautlos anzapfen. Es gibt aber eine Sorte Post, bei der das Hinschauen verändert, was man ' +
      'anschaut. Dann verschlüsseln wir nicht besser — wir merken, dass jemand zuhört. ' +
      'Aber was verschicken wir da?',

  s4: 'Ein Photon. Die kleinste Portion Licht, die es gibt. Kein Kügelchen, keine Welle — eine Portion, ' +
      'und halbieren kann man sie nicht: Entweder eines kommt an, oder keines. Dieses Photon schwingt in eine ' +
      'Richtung, waagerecht, senkrecht oder schräg. Die Richtung heißt Polarisation, und in ihr steckt unser Bit.',

  s5: 'Alice hat zwei Sorten Filter. Der blaue kennt waagerecht und senkrecht, der orange die beiden Schrägen. ' +
      'Mit jedem kann sie Null und Eins schreiben: vier Zustände, zwei Alphabete für dieselbe Nachricht. ' +
      'Die Fachleute sagen Basis dazu — ich bleibe bei Alphabet.',

  s6: 'Und jetzt der Versuch, für den du nur zwei polarisierte Sonnenbrillen brauchst. Zwei Gläser übereinander, ' +
      'eines um neunzig Grad gedreht: Es wird dunkel. Jetzt schiebe ein drittes Glas dazwischen, schräg. ' +
      'Man sollte meinen, erst recht nichts kommt durch — es wird heller. Ein Achtel des Lichts geht wieder ' +
      'hindurch. Der Filter liest also nicht ab, was da war. Er entscheidet, was danach ist.',

  s7: '<speak>Genau das spielen Alice und Bob. Das Verfahren heißt ' +
      '<say-as interpret-as="characters">BB</say-as> 84, nach Bennett und Brassard, 1984. Alice würfelt ein Bit ' +
      'und ein Alphabet dazu und schickt das Photon los. Bob weiß nicht, welches Alphabet sie genommen hat — ' +
      'also würfelt er auch.</speak>',

  s8: 'Hat er zufällig denselben Filter, misst er sicher richtig. Hat er den anderen, passiert das aus dem ' +
      'Sonnenbrillen-Versuch: Das Photon entscheidet sich neu, rein zufällig. Bob bekommt Null oder Eins, und ' +
      'keine von beiden hat mit Alices Bit zu tun. Das ist kein Nichtwissen, das ist Unbestimmtheit — ' +
      'der rote Balken zeigt sie an.',

  // droppable if the film has to hit 5:47
  s9: 'Taste L schaltet den Lehrmodus ein: Statt eines Zufallslaufs steht jeder mögliche Fall genau einmal da. ' +
      'Die ersten vier Spalten — gleiche Filter, alles sauber. Die nächsten vier — verschiedene Filter, ' +
      'zweimal dasselbe Photon, einmal wird eine Null daraus und einmal eine Eins.',

  s10: 'Jetzt kommt der Teil, der die meisten überrascht: Danach reden die beiden völlig offen, über eine Leitung, ' +
       'die jeder mithören darf. Sie verraten nur, welchen Filter sie benutzt haben — nie das Bit. Wo beide ' +
       'denselben hatten, bleibt das Bit stehen, der Rest fliegt weg. Ungefähr die Hälfte. Kein Verlust, ' +
       'sondern der Preis.',

  s11: 'Und was macht eine Lauscherin? Nennen wir sie Eve. Sie kann das Photon nicht heimlich anschauen und ' +
       'weiterreichen, und abschreiben kann sie es auch nicht — dass sich ein Quantenzustand nicht kopieren ' +
       'lässt, ist bewiesen. Ihr bleibt nur eines: messen und ein neues Photon losschicken. ' +
       'Und dafür muss sie raten.',

  s12: 'Rechnen wir mit. In der Hälfte der Fälle rät Eve richtig — dann merkt niemand etwas. In der anderen ' +
       'Hälfte rät sie falsch und schickt ein Photon in die falsche Richtung weiter. Bob, der alles richtig ' +
       'gemacht hat, bekommt trotzdem Zufall: in der Hälfte davon das falsche Bit. Halbe mal halbe — ' +
       'jedes vierte gemeinsame Bit ist kaputt. Eve kann das nicht vermeiden. Es ist ihr nicht erlaubt.',

  // bridge -> s14: from "here is the trap" straight into "and here is the proof"
  s13: 'Also stellen Alice und Bob eine Falle: Sie opfern ein paar Bits und rufen sie sich laut zu. Ohne ' +
       'Lauscherin stimmen alle, mit Lauscherin ist jedes vierte falsch. Eves Chance durchzukommen sinkt mit ' +
       'jedem geprüften Bit auf drei Viertel — nach zwanzig Bits steht sie bei drei von tausend. Und weil ein ' +
       'Durchlauf nichts beweist, machen wir es tausendmal.',

  s14: 'Ein Knopf, tausend komplette Schlüsselaustausche. Die mittlere Fehlerquote landet bei fünfundzwanzig ' +
       'Komma null Prozent, genau auf dem Viertel, und die Entdeckungsrate genau auf der Kurve daneben. ' +
       'Nichts in diesem Labor ist behauptet. Es steht gemessen daneben.',

  // droppable if the film has to hit 5:47
  s15: 'Wie viele Photonen braucht man? Mit zwölf ist es noch ein Würfelspiel: mal bleiben acht Bits übrig, ' +
       'mal vier. Zieh den Regler auf zweihundertsechsundfünfzig, und aus der Hälfte wird Verlässlichkeit. ' +
       'Der Zufall wird brav, wenn man ihn oft genug fragt.',

  s16: 'Und was macht man mit diesen goldenen Bits? Sie sind keine Nachricht, sie sind ein Schlüssel: eine ' +
       'Zufallsfolge, die genau zwei Menschen kennen. Ist sie so lang wie die Nachricht, verrechnet man beide ' +
       'Zeichen für Zeichen — beweisbar unknackbar, das hat Claude Shannon gezeigt. Sein einziges Problem war ' +
       'immer: Wie bekommen die beiden den Schlüssel? Genau das haben wir eben gelöst.',

  s17: 'Und das ist kein Gedankenspiel. Über Glasfasern läuft es seit Jahren, eine Wiener Bank hat 2004 eine ' +
       'Überweisung so abgesichert, von einem Satelliten aus gingen Schlüssel über tausende Kilometer. ' +
       'Die Grenzen sind ehrlich: Ein Photon kann man nicht verstärken, nach ein paar hundert Kilometern ist ' +
       'Schluss. Und die beiden müssen sich vorher sicher erkennen — sonst redet Eve mit jedem einzeln.',

  s18: '<speak>Dieser Schlüssel ist nicht sicher, weil er schwer zu knacken wäre. Er ist sicher, weil das ' +
       'Universum petzt. Eine Frage bleibt offen: Warum entscheidet sich das Photon erst beim Messen? Daran hat ' +
       'sich der größte Streit der Physik entzündet, mit Einstein mittendrin — das wird ein eigenes Labor. ' +
       'Bis dahin: Probier dieses hier aus, im Doc Alvers Mathe-Labor auf doc alvers punkt ' +
       '<say-as interpret-as="characters">de</say-as>.</speak>',
};
