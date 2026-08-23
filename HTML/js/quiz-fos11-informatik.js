/* Question set "Stoff der Fachoberschule Klassenstufe 11" (LB 1 Persoenliches
   Informationsmanagement, LB 2 IT-Sicherheit und Oekologie, WB 2 Kryptografie).

   Currently NOT wired to a page: the entry test of FOS 12 asks the MSA set
   instead, because class 12 also takes in students from the one-year
   Bildungsgang who never had FOS 11 (Lehrplan Informatik FOS 2023: "Eine
   gemeinsame Beschulung von ein- und zweijaehrigem Bildungsgang ist ...
   moeglich"). Set questions: window.QUIZ_FOS11_INFORMATIK in a quiz page to
   use it as an Abschlusstest for FOS 11.

   Pattern: two subject questions, then one general-knowledge question,
   repeated ten times. Exactly one correct option per question. */
window.QUIZ_FOS11_INFORMATIK = [
    {
      q: 'Was sind Metadaten?',
      opts: [
        'Verschlüsselte Daten.',
        'Daten über Daten — etwa Aufnahmedatum, Autor oder Dateigröße.',
        'Besonders wichtige Dateien.',
        'Daten, die im Papierkorb liegen.'
      ],
      steps: [
        'Ein Foto enthält neben dem Bild auch EXIF-Daten: Kamera, Zeitpunkt, oft GPS-Koordinaten.',
        'Ohne Metadaten wäre gezieltes Suchen und Sortieren kaum möglich.',
        'Vorsicht beim Veröffentlichen: sie verraten mehr, als man denkt.'
      ],
      solution: 1
    },
    {
      q: 'Welche Dateibenennung sortiert sich von selbst chronologisch?',
      opts: [
        '23.08.2026_bericht.pdf',
        'bericht_final_neu.pdf',
        'Bericht (3).pdf',
        '2026-08-23_bericht.pdf'
      ],
      steps: [
        'Im ISO-Format Jahr-Monat-Tag stimmt die alphabetische mit der zeitlichen Reihenfolge überein.',
        'Bei $23.08.2026$ stünde der 23. Januar vor dem 3. Februar.',
        'Und „final“, „final2“, „wirklich_final“ ersetzt keine Versionsnummer.'
      ],
      solution: 3
    },
    {
      q: 'Wer war Alan Turing?',
      opts: [
        'Ein britischer Mathematiker, der im Zweiten Weltkrieg die Enigma-Verschlüsselung brach.',
        'Der Erfinder des Internets.',
        'Der Gründer von IBM.',
        'Ein Kryptograf der Antike.'
      ],
      steps: [
        'Turing (1912-1954) legte mit der Turingmaschine das theoretische Fundament der Informatik.',
        'In Bletchley Park baute er die Entschlüsselungsmaschine „Bombe“ gegen die Enigma.',
        'Sein Turing-Test fragt, ob ein Mensch im Gespräch Maschine und Mensch unterscheiden kann.',
        'Er wurde wegen seiner Homosexualität verfolgt und erst 2013 offiziell rehabilitiert.'
      ],
      solution: 0
    },
    {
      q: 'Wie sucht man gezielt nur auf einer bestimmten Website?',
      opts: [
        'mit Anführungszeichen um die Domain',
        'mit einem Minuszeichen vor der Domain',
        'gar nicht, das geht nur über die Seite selbst',
        'mit dem Zusatz site:docalvers.de'
      ],
      steps: [
        '$site{:}$ begrenzt die Treffer auf eine Domain: $site{:}docalvers.de\\ Mathe$',
        'Anführungszeichen suchen dagegen eine exakte Wortfolge.',
        'Ein Minuszeichen schließt Begriffe aus: $Java\\ -Script$'
      ],
      solution: 3
    },
    {
      q: 'Warum eignet sich PDF/A besser zur Langzeitarchivierung als DOCX?',
      opts: [
        'Es kann verschlüsselt werden, DOCX nicht.',
        'Es ist ein offener Standard und bettet alles Nötige ein, etwa Schriften.',
        'Es ist immer kleiner.',
        'Es lässt sich leichter bearbeiten.'
      ],
      steps: [
        'PDF/A ist als ISO-Norm offengelegt — jeder kann einen Leser dafür bauen, auch in 30 Jahren.',
        'Alles, was zur Darstellung nötig ist, steckt in der Datei; nichts hängt an einer installierten Schrift.',
        'Proprietäre Formate binden an ein Programm und dessen Hersteller.',
        'Faustregel: bearbeiten in offenen Formaten, archivieren in PDF/A.'
      ],
      solution: 1
    },
    {
      q: 'Woher kommt das Wort „Spam“ für unerwünschte Werbemails?',
      opts: [
        'Aus einem Monty-Python-Sketch über Dosenfleisch.',
        'Es ist die Abkürzung für „Sending Post Automatically“.',
        'Vom Namen des ersten Spam-Versenders.',
        'Aus dem Militärjargon für Störsignale.'
      ],
      steps: [
        'Im Sketch von 1970 steht auf jeder Speisekarte „Spam“, und ein Chor übertönt jedes Gespräch damit.',
        'Genau dieses Übertönen wurde zum Bild für Massenmails.',
        'Der Hersteller des Dosenfleischs sieht das bis heute mit gemischten Gefühlen.'
      ],
      solution: 0
    },
    {
      q: 'Was besagt die 3-2-1-Regel beim Backup?',
      opts: [
        'Drei Passwörter, zwei Nutzer, ein Rechner.',
        'Drei Festplatten im selben Gerät.',
        'Drei Kopien, auf zwei verschiedenen Medien, eine davon außer Haus.',
        'Drei Sicherungen am Tag, zwei in der Woche, eine im Monat.'
      ],
      steps: [
        'Zwei Medienarten schützen davor, dass derselbe Defekt beide Kopien trifft.',
        'Die Kopie außer Haus rettet die Daten bei Brand, Wasser oder Diebstahl.',
        'Und: ein nie zurückgespieltes Backup ist nur eine Hoffnung — ab und zu testen.'
      ],
      solution: 2
    },
    {
      q: 'Warum ersetzt ein Cloud-Ordner wie OneDrive kein Backup?',
      opts: [
        'Er funktioniert nur online.',
        'Er synchronisiert auch das Löschen und Verschlüsseln sofort auf alle Geräte.',
        'Er ist zu klein für große Datenmengen.',
        'Er ist grundsätzlich unsicher.'
      ],
      steps: [
        'Synchronisation hält Kopien gleich — auch, wenn die Änderung ein Versehen oder ein Erpressungstrojaner war.',
        'Ein Backup ist dagegen ein eingefrorener Stand von gestern, letzter Woche, letztem Monat.',
        'Versionsverläufe der Anbieter mildern das, ersetzen aber keine getrennte Sicherung.'
      ],
      solution: 1
    },
    {
      q: 'Was heißt „Kryptografie“ wörtlich übersetzt?',
      opts: [
        'schnelles Rechnen',
        'sicheres Speichern',
        'doppeltes Zählen',
        'geheimes Schreiben'
      ],
      steps: [
        'Griechisch „kryptós“ (verborgen) und „gráphein“ (schreiben).',
        'Die Kryptoanalyse ist das Gegenstück: das Brechen solcher Verfahren.',
        'Beides zusammen nennt man Kryptologie.'
      ],
      solution: 3
    },
    {
      q: 'Welche drei Schutzziele stehen im Zentrum der IT-Sicherheit?',
      opts: [
        'Sicherung, Verschlüsselung, Löschung',
        'Vertraulichkeit, Integrität, Verfügbarkeit',
        'Geschwindigkeit, Sparsamkeit, Bedienbarkeit',
        'Datenschutz, Urheberrecht, Lizenzrecht'
      ],
      steps: [
        'Vertraulichkeit: nur Befugte sehen die Daten. Integrität: sie sind unverfälscht. Verfügbarkeit: sie sind da, wenn man sie braucht.',
        'Im Englischen als CIA-Triade bekannt (confidentiality, integrity, availability).',
        'Oft ergänzt um Authentizität: die Herkunft ist nachweisbar.',
        'Die Ziele stehen in Spannung: maximale Sicherheit kostet Verfügbarkeit.'
      ],
      solution: 1
    },
    {
      q: 'Welches Passwort ist am sichersten?',
      opts: [
        'Sommer2026!',
        'P@ssw0rt',
        'Alvers1969',
        'Anker-Wolke-Zitrone-42'
      ],
      steps: [
        'Länge schlägt Sonderzeichen: vier zufällige Wörter ergeben eine riesige Suchmenge und lassen sich merken.',
        '$P@ssw0rt$ ist der Klassiker in jeder Angreiferliste — solche Ersetzungen sind längst eingerechnet.',
        'Namen und Jahreszahlen fallen bei einem gezielten Angriff sofort.',
        'Für jeden Dienst ein eigenes Passwort — dafür gibt es Passwortmanager.'
      ],
      solution: 3
    },
    {
      q: 'Was ist Steganografie?',
      opts: [
        'Das Verstecken einer Nachricht, sodass niemand sie überhaupt vermutet.',
        'Eine besonders starke Verschlüsselung.',
        'Das Löschen von Metadaten.',
        'Eine Technik zur Datenkomprimierung.'
      ],
      steps: [
        'Kryptografie macht eine Nachricht unlesbar, Steganografie macht sie unsichtbar.',
        'Klassisch: Herodot berichtet von einer Nachricht auf dem rasierten Kopf eines Boten, überwachsen von Haaren.',
        'Digital versteckt man Daten etwa in den niederwertigsten Bits eines Bildes — für das Auge unsichtbar.',
        'Am stärksten ist beides zusammen: verschlüsseln und dann verstecken.'
      ],
      solution: 0
    },
    {
      q: 'Welche Kombination ist echte Zwei-Faktor-Authentifizierung?',
      opts: [
        'zwei verschiedene Passwörter',
        'Benutzername und Passwort',
        'Passwort und Einmalcode aus einer App',
        'Passwort und Sicherheitsfrage'
      ],
      steps: [
        'Die Faktoren müssen aus verschiedenen Kategorien kommen: Wissen, Besitz, Sein.',
        'Passwort ist Wissen, das Handy mit der App ist Besitz.',
        'Eine Sicherheitsfrage bleibt Wissen — und ist oft leichter zu erraten als das Passwort.'
      ],
      solution: 2
    },
    {
      q: 'Woran erkennt man eine Phishing-Mail am zuverlässigsten?',
      opts: [
        'An einem Anhang im PDF-Format.',
        'An Zeitdruck und einem Link, dessen Ziel nicht zur angeblichen Absenderin passt.',
        'An Rechtschreibfehlern — ohne die ist eine Mail echt.',
        'Daran, dass sie im Spam-Ordner liegt.'
      ],
      steps: [
        '„Ihr Konto wird in 24 Stunden gesperrt“ ist das Grundmuster: Angst plus Frist.',
        'Rechtschreibfehler sind seit Sprachmodellen kein Merkmal mehr — professionelle Angriffe sind fehlerfrei.',
        'Zielsicher hilft nur: Adresse selbst eintippen statt klicken.',
        'Und im Zweifel unter der bekannten Nummer zurückrufen, niemals unter der aus der Mail.'
      ],
      solution: 1
    },
    {
      q: 'Nach wem ist die Cäsar-Verschlüsselung benannt?',
      opts: [
        'Nach Julius Caesar, der Botschaften um drei Stellen verschob.',
        'Nach dem Mathematiker Pierre Cäsar.',
        'Nach dem Cäsar-Code der US-Armee.',
        'Nach einem Kartenspiel des 18. Jahrhunderts.'
      ],
      steps: [
        'Sueton berichtet, Caesar habe militärische Botschaften um drei Buchstaben verschoben.',
        'Für damalige Verhältnisse genügte das — die meisten Gegner konnten ohnehin nicht lesen.',
        'Heute knackt man es durch Ausprobieren von 25 Möglichkeiten oder per Häufigkeitsanalyse.'
      ],
      solution: 0
    },
    {
      q: 'Wie reagiert man richtig, wenn Ransomware zugeschlagen hat?',
      opts: [
        'Zahlen, damit die Daten schnell wieder da sind.',
        'Neu starten und weiterarbeiten.',
        'Die Dateien umbenennen, dann sind sie wieder lesbar.',
        'Gerät vom Netz trennen, nicht zahlen, melden, aus dem Backup zurückspielen.'
      ],
      steps: [
        'Trennen stoppt die weitere Verschlüsselung im Netzwerk.',
        'Zahlen finanziert das Geschäftsmodell — und garantiert keinen Schlüssel.',
        'Ohne getrenntes Backup steht man hier fast immer mit leeren Händen da.',
        'Für Unternehmen und Behörden kommt eine Meldepflicht hinzu.'
      ],
      solution: 3
    },
    {
      q: 'Welche Angabe ist ein personenbezogenes Datum im Sinne der DSGVO?',
      opts: [
        'der Preis eines Produkts',
        'die Öffnungszeiten eines Amtes',
        'die IP-Adresse eines Anschlusses',
        'die Einwohnerzahl von Dresden'
      ],
      steps: [
        'Personenbezogen ist alles, was sich auf eine bestimmte oder bestimmbare Person bezieht.',
        'Die IP-Adresse lässt sich über den Anbieter zuordnen — der Europäische Gerichtshof hat das bestätigt.',
        'Ebenso Kennzeichen, Cookie-Kennungen und Standortdaten.'
      ],
      solution: 2
    },
    {
      q: 'Was ist bei einem Notebook der größte Hebel für die Umweltbilanz?',
      opts: [
        'Es möglichst lange zu nutzen.',
        'Es nachts herunterzufahren.',
        'Die Bildschirmhelligkeit zu senken.',
        'Es mit Ökostrom zu laden.'
      ],
      steps: [
        'Bei einem Notebook entfällt der weitaus größte Teil des Ressourcenverbrauchs auf die Herstellung, nicht auf den Betrieb.',
        'Jedes zusätzliche Nutzungsjahr verteilt diesen Rucksack auf mehr Zeit — das schlägt jede Stromsparmaßnahme.',
        'Deshalb zählen Reparierbarkeit, Akkutausch und Updates zu Green IT, nicht nur der Verbrauch in Watt.',
        'Die anderen drei Punkte helfen, sind aber eine Größenordnung kleiner.'
      ],
      solution: 0
    },
    {
      q: 'Was war der Wurm „ILOVEYOU“ im Jahr 2000?',
      opts: [
        'Ein Computerspiel mit versteckter Schadfunktion.',
        'Eine Mail mit angeblichem Liebesbrief, die sich an das ganze Adressbuch weiterschickte.',
        'Der erste Erpressungstrojaner.',
        'Ein Fehler im Jahrtausendwechsel.'
      ],
      steps: [
        'Der Anhang hieß LOVE-LETTER-FOR-YOU.TXT.vbs — Windows blendete die Endung $.vbs$ aus.',
        'Innerhalb von Tagen traf es Millionen Rechner, der Schaden ging in die Milliarden.',
        'Lehre bis heute: sichtbare Dateiendungen einschalten und Anhänge nie blind öffnen.'
      ],
      solution: 1
    },
    {
      q: 'Das Wort KAT wird mit der Cäsar-Verschiebung $+3$ verschlüsselt. Wie lautet der Geheimtext?',
      opts: [
        'HXQ',
        'MCV',
        'NDW',
        'LBU'
      ],
      steps: [
        'Jeder Buchstabe wandert drei Stellen weiter im Alphabet.',
        '$K \\rightarrow N$, $A \\rightarrow D$, $T \\rightarrow W$',
        'Am Ende des Alphabets wird umgebrochen: aus $Z$ wird $C$.'
      ],
      solution: 2
    },
    {
      q: 'Was ist der wichtigste Unterschied zwischen symmetrischer und asymmetrischer Verschlüsselung?',
      opts: [
        'Symmetrisch ist immer unsicher.',
        'Asymmetrisch ist schneller.',
        'Asymmetrisch braucht gar keinen Schlüssel.',
        'Symmetrisch nutzt einen gemeinsamen Schlüssel, asymmetrisch ein Schlüsselpaar.'
      ],
      steps: [
        'Symmetrisch ist schnell, hat aber das Problem des sicheren Schlüsselaustauschs.',
        'Asymmetrisch löst genau das: der öffentliche Schlüssel darf jeder kennen.',
        'In der Praxis kombiniert man beides — asymmetrisch wird ein symmetrischer Sitzungsschlüssel vereinbart. So arbeitet HTTPS.'
      ],
      solution: 3
    },
    {
      q: 'Wozu dient der öffentliche Schlüssel?',
      opts: [
        'Er muss geheim gehalten werden.',
        'Zum Verschlüsseln von Nachrichten an die Besitzerin des passenden privaten Schlüssels.',
        'Zum Entschlüsseln empfangener Nachrichten.',
        'Als Passwort für den Rechner.'
      ],
      steps: [
        'Was mit dem öffentlichen Schlüssel verschlüsselt wurde, öffnet nur der zugehörige private.',
        'Deshalb darf er offen verteilt werden — auf der Website, im Schlüsselserver, in der Signatur.',
        'Umgekehrt gilt: was der private Schlüssel signiert, kann jeder mit dem öffentlichen prüfen.'
      ],
      solution: 1
    },
    {
      q: 'Warum bedeutet ein „404“ im Browser?',
      opts: [
        'Die Seite existiert unter dieser Adresse nicht.',
        'Der Server ist überlastet.',
        'Die Verbindung ist nicht verschlüsselt.',
        'Der Zugriff ist verboten.'
      ],
      steps: [
        'HTTP-Statuscodes sind dreistellig: 2xx erfolgreich, 3xx Umleitung, 4xx Fehler bei der Anfrage, 5xx Fehler auf dem Server.',
        '404 heißt „Not Found“ — die Adresse führt ins Leere.',
        'Verwandte Codes: 403 verboten, 500 Serverfehler, 301 dauerhaft umgezogen.'
      ],
      solution: 0
    },
    {
      q: 'Was unterscheidet einen Hashwert von einer Verschlüsselung?',
      opts: [
        'Ein Hash lässt sich mit demselben Passwort wieder öffnen.',
        'Es ist dasselbe mit anderem Namen.',
        'Ein Hash lässt sich nicht zurückrechnen — es gibt keinen Schlüssel zum Entschlüsseln.',
        'Ein Hash ist sicherer, weil er länger ist.'
      ],
      steps: [
        'Eine Hashfunktion bildet beliebige Daten auf eine feste Länge ab, etwa 256 Bit bei SHA-256.',
        'Sie ist eine Einbahnstraße: aus dem Hash lässt sich das Original nicht gewinnen.',
        'Deshalb speichert man Passwörter als Hash — gesalzen, damit gleiche Passwörter verschieden aussehen.',
        'Und deshalb prüft man Downloads über ihre Prüfsumme.'
      ],
      solution: 2
    },
    {
      q: 'Woher kommt der Name „Cookie“ für die kleinen Dateien im Browser?',
      opts: [
        'Von einem Werbespot für Kekse.',
        'Weil die Dateien nur kurz haltbar sind.',
        'Vom Nachnamen des Erfinders.',
        'Von „magic cookie“ — einem kleinen Datenpaket, das ein Programm unverändert zurückbekommt.'
      ],
      steps: [
        'Der Begriff „magic cookie“ war in der Unix-Welt längst üblich, als Lou Montulli ihn 1994 für Netscape übernahm.',
        'Der Server gibt dem Browser ein Stück Text mit, das dieser bei jedem Besuch zurückreicht.',
        'So merkt sich eine Website den Warenkorb — und leider auch den Weg durch das halbe Netz.'
      ],
      solution: 3
    },
    {
      q: 'Was weist eine digitale Signatur nach?',
      opts: [
        'Dass die Nachricht wirklich vom Absender stammt und unverändert ist.',
        'Dass die Nachricht verschlüsselt übertragen wurde.',
        'Dass der Absender volljährig ist.',
        'Dass die Nachricht rechtzeitig angekommen ist.'
      ],
      steps: [
        'Signiert wird der Hashwert der Nachricht mit dem privaten Schlüssel.',
        'Wer den öffentlichen Schlüssel hat, kann prüfen: passt der Hash noch, ist nichts verändert worden.',
        'Signatur und Verschlüsselung sind zweierlei — man kann signieren, ohne zu verschlüsseln.',
        'Genau darauf beruhen Software-Updates, Zertifikate und die qualifizierte elektronische Signatur.'
      ],
      solution: 0
    },
    {
      q: 'Ein Schlüssel wird von 128 auf 129 Bit verlängert. Was bedeutet das für einen Angreifer, der alles durchprobiert?',
      opts: [
        'Er braucht 129 statt 128 Versuche.',
        'Es ändert praktisch nichts.',
        'Er braucht doppelt so lange.',
        'Er braucht ein Bit mehr Speicher, sonst nichts.'
      ],
      steps: [
        'Jedes zusätzliche Bit verdoppelt die Anzahl der möglichen Schlüssel: $2^{129} = 2 \\cdot 2^{128}$',
        'Deshalb wächst der Aufwand exponentiell, während der Schlüssel nur linear länger wird.',
        'Ein 128-Bit-Schlüssel ist mit heutiger Technik nicht durchprobierbar — die Schwachstelle ist fast immer der Mensch.'
      ],
      solution: 2
    },
    {
      q: 'Woher stammt das @-Zeichen in E-Mail-Adressen?',
      opts: [
        'Es war das Firmenlogo des ersten Providers.',
        'Ray Tomlinson wählte es 1971, weil es in Namen nicht vorkommt.',
        'Es wurde eigens für E-Mail erfunden.',
        'Es stammt aus der Mathematik und bedeutet „ungefähr“.'
      ],
      steps: [
        'Tomlinson suchte ein Zeichen, das Benutzername und Rechner trennt, ohne in Namen aufzutauchen.',
        'Das @ stand auf der Tastatur, war kaufmännisch „at“ (zum Preis von) und sonst ungenutzt.',
        'Im Deutschen heißt es Klammeraffe, in Dänemark Elefantenrüssel, in Italien Schnecke.'
      ],
      solution: 1
    },
    {
      q: 'Das Schloss-Symbol im Browser ist zu sehen. Was ist damit sicher?',
      opts: [
        'Die Seite ist geprüft und vertrauenswürdig.',
        'Die Seite enthält keine Schadsoftware.',
        'Die eingegebenen Daten werden nicht gespeichert.',
        'Die Verbindung ist verschlüsselt — über die Seriosität der Seite sagt es nichts.'
      ],
      steps: [
        'Das Zertifikat bestätigt nur: die Leitung zu genau dieser Domain ist verschlüsselt.',
        'Zertifikate gibt es kostenlos — auch Betrugsseiten haben längst HTTPS.',
        'Also den Domainnamen selbst lesen: $sparkasse{-}sicherheit{.}de$ ist nicht die Sparkasse.'
      ],
      solution: 3
    },
    {
      q: 'Was besagt das „Recht auf Vergessenwerden“?',
      opts: [
        'Man darf Passwörter vergessen und neu setzen.',
        'Behörden dürfen Daten nie länger als ein Jahr speichern.',
        'Betroffene können unter Umständen die Löschung ihrer Daten verlangen.',
        'Suchmaschinen müssen nach zehn Jahren alles löschen.'
      ],
      steps: [
        'Artikel 17 DSGVO gibt ein Recht auf Löschung, wenn der Zweck der Speicherung entfallen ist.',
        'Grundlage war ein Urteil des Europäischen Gerichtshofs von 2014 gegen Google Spain.',
        'Es gilt nicht absolut: Pressefreiheit, Forschung und gesetzliche Aufbewahrungsfristen wiegen mit.',
        'Und es wirkt nur gegen Verantwortliche — das Netz selbst vergisst trotzdem nicht.'
      ],
      solution: 2
    }
];
