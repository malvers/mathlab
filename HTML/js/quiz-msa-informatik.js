/* Question set "Informatik auf Stand des Mittleren Schulabschlusses".
   Shared by the entry tests of BGY class 11 and Fachoberschule class 11 —
   both groups arrive from the Oberschule, so they are asked the same things.
   Editing here changes both tests on purpose.

   Pattern: two subject questions, then one general-knowledge question,
   repeated ten times. Exactly one correct option per question.
   Formulas are written as $...$ and rendered with KaTeX; a backslash escapes
   a literal dollar sign. */
window.QUIZ_MSA_INFORMATIK = [
    {
      q: 'Wie viele Bit hat ein Byte?',
      opts: [
        '1024',
        '8',
        '10',
        '16'
      ],
      steps: [
        'Ein Byte fasst genau 8 Bit zusammen.',
        'Mit 8 Bit lassen sich $2^8 = 256$ verschiedene Zustände unterscheiden — zum Beispiel die Zahlen 0 bis 255.',
        'Deshalb hat auch ein klassisches Zeichen im ASCII-Code in einem Byte Platz.'
      ],
      solution: 1
    },
    {
      q: 'Wie viele Byte sind ein Kibibyte (1 KiB)?',
      opts: [
        '$1000$',
        '$8$',
        '$100$',
        '$1024$'
      ],
      steps: [
        'Computer rechnen in Zweierpotenzen: $1\\ \\mathrm{KiB} = 2^{10}\\ \\mathrm{Byte} = 1024$ Byte.',
        'Festplattenhersteller rechnen dagegen mit $1\\ \\mathrm{kB} = 1000$ Byte — daher zeigt eine „1-TB-Platte“ im System nur rund 931 GiB.',
        'Beides ist richtig, es sind einfach zwei verschiedene Einheiten.'
      ],
      solution: 3
    },
    {
      q: 'Wer gilt als Erfinder des World Wide Web?',
      opts: [
        'Tim Berners-Lee',
        'Bill Gates',
        'Steve Jobs',
        'Alan Turing'
      ],
      steps: [
        'Tim Berners-Lee entwickelte 1989 am Kernforschungszentrum CERN die Idee von HTML, HTTP und URL.',
        'Das WWW ist damit ein Dienst im Internet — das Internet selbst gab es schon vorher.',
        'Er gab die Technik bewusst frei, statt sie zu patentieren.'
      ],
      solution: 0
    },
    {
      q: 'Was ist die Hauptaufgabe der CPU?',
      opts: [
        'Das Bild auf dem Monitor erzeugen',
        'Die Internetverbindung herstellen',
        'Befehle abarbeiten und rechnen',
        'Daten dauerhaft speichern'
      ],
      steps: [
        'CPU heißt Central Processing Unit — der Hauptprozessor.',
        'Sie holt Befehle aus dem Arbeitsspeicher, entschlüsselt sie und führt sie aus (EVA-Prinzip im Kleinen).',
        'Für Bilder ist die Grafikeinheit zuständig, für dauerhaftes Speichern die SSD oder Festplatte.'
      ],
      solution: 2
    },
    {
      q: 'Worin unterscheidet sich Arbeitsspeicher (RAM) von einer SSD?',
      opts: [
        'RAM ist immer größer als eine SSD.',
        'RAM ist flüchtig — beim Ausschalten ist der Inhalt weg.',
        'RAM speichert dauerhaft, die SSD nur kurzzeitig.',
        'Beide sind gleich, nur unterschiedlich groß.'
      ],
      steps: [
        'Der Arbeitsspeicher hält nur, was gerade in Bearbeitung ist — ohne Strom verliert er alles.',
        'Die SSD behält Daten auch ohne Strom, ist dafür deutlich langsamer als RAM.',
        'Deshalb ist ungespeicherte Arbeit nach einem Stromausfall verloren.'
      ],
      solution: 1
    },
    {
      q: 'Woher stammt der Begriff „Bug“ für einen Programmfehler?',
      opts: [
        'Von einer Motte, die 1947 in einem Rechner steckte.',
        'Von einer Automarke.',
        'Vom englischen Wort für „gross“.',
        'Von einem Virus namens Bug.'
      ],
      steps: [
        'Grace Hopper klebte 1947 eine Motte, die im Relais des Mark II steckte, ins Logbuch: „First actual case of bug being found.“',
        'Der Ausdruck war zwar schon vorher unter Ingenieuren üblich, wurde dadurch aber berühmt.',
        'Grace Hopper entwickelte später den ersten Compiler und war maßgeblich an COBOL beteiligt.'
      ],
      solution: 0
    },
    {
      q: 'Welches Bildformat speichert verlustfrei?',
      opts: [
        'JPG',
        'MP3',
        'MP4',
        'PNG'
      ],
      steps: [
        'PNG komprimiert verlustfrei: das Originalbild lässt sich exakt wiederherstellen.',
        'JPG wirft gezielt Bildinformation weg — bei jedem erneuten Speichern etwas mehr.',
        'MP3 und MP4 sind Audio- beziehungsweise Videoformate, beide verlustbehaftet.',
        'Faustregel: Fotos als JPG, Grafiken mit klaren Kanten und Text als PNG.'
      ],
      solution: 3
    },
    {
      q: 'Was ist ein Algorithmus?',
      opts: [
        'Ein anderes Wort für Programmiersprache.',
        'Eine Sammlung von Daten.',
        'Eine eindeutige, endliche Handlungsvorschrift zur Lösung eines Problems.',
        'Ein besonders schneller Computer.'
      ],
      steps: [
        'Wichtig sind Eindeutigkeit, Endlichkeit und Allgemeingültigkeit für eine ganze Aufgabenklasse.',
        'Ein Kochrezept ist das klassische Alltagsbeispiel.',
        'Der Name geht auf den Gelehrten al-Chwarizmi (9. Jahrhundert) zurück.'
      ],
      solution: 2
    },
    {
      q: 'Was bedeutet „Open Source“?',
      opts: [
        'Der Quelltext ist offen einsehbar und darf weiterverwendet werden.',
        'Die Software ist immer kostenlos und ohne Regeln.',
        'Das Programm läuft nur online.',
        'Jeder darf die Software beliebig verkaufen, ohne Bedingungen.'
      ],
      steps: [
        'Entscheidend ist der offene Quelltext plus eine Lizenz, die Nutzung und Weitergabe erlaubt.',
        'Kostenlos ist dabei häufig, aber nicht zwingend — und Lizenzen wie die GPL stellen Bedingungen.',
        'Bekannte Beispiele: Linux, Firefox, LibreOffice, VLC.'
      ],
      solution: 0
    },
    {
      q: 'Welche Dezimalzahl steht hinter der Binärzahl $1011$?',
      opts: [
        '$7$',
        '$11$',
        '$1011$',
        '$13$'
      ],
      steps: [
        'Stellenwerte von rechts: $1, 2, 4, 8$',
        '$1 \\cdot 8 + 0 \\cdot 4 + 1 \\cdot 2 + 1 \\cdot 1$',
        '$= 8 + 2 + 1 = 11$'
      ],
      solution: 1
    },
    {
      q: 'Wozu dient eine IP-Adresse?',
      opts: [
        'Sie speichert Passwörter.',
        'Sie misst die Geschwindigkeit der Verbindung.',
        'Sie adressiert ein Gerät eindeutig im Netzwerk.',
        'Sie verschlüsselt die Daten.'
      ],
      steps: [
        'Ohne eindeutige Adresse wüssten Datenpakete nicht, wohin sie sollen — wie eine Hausnummer im Netz.',
        'IPv4 sieht so aus: $192.168.0.1$; wegen Adressknappheit gibt es zusätzlich IPv6.',
        'Der DNS übersetzt Namen wie docalvers.de in solche Adressen.'
      ],
      solution: 2
    },
    {
      q: 'Wofür steht das „S“ in HTTPS?',
      opts: [
        'server',
        'speed',
        'standard',
        'secure — die Verbindung ist verschlüsselt.'
      ],
      steps: [
        'HTTPS ist HTTP über eine mit TLS verschlüsselte Verbindung.',
        'Mitlesen im gleichen WLAN wird damit praktisch unmöglich.',
        'Das Schloss-Symbol sagt aber nur: die Leitung ist sicher — nicht, dass die Seite ehrlich ist.'
      ],
      solution: 3
    },
    {
      q: 'Was berechnet in einer Tabellenkalkulation die Formel $=SUMME(A1:A5)$?',
      opts: [
        'die Anzahl der Zellen',
        'die Summe der Zellen A1 bis A5',
        'die Summe von A1 und A5',
        'den Mittelwert von A1 bis A5'
      ],
      steps: [
        'Der Doppelpunkt bezeichnet einen zusammenhängenden Bereich, also alle fünf Zellen.',
        'Nur A1 und A5 addiert man mit einem Semikolon: $=SUMME(A1;A5)$',
        'Für den Mittelwert gibt es MITTELWERT, für das Zählen ANZAHL.'
      ],
      solution: 1
    },
    {
      q: 'Was bewirkt der Zellbezug \\$A\\$1 beim Kopieren einer Formel?',
      opts: [
        'Er bleibt unverändert — der Bezug ist absolut.',
        'Er verschiebt sich wie jeder andere Bezug mit.',
        'Er zeigt immer auf die letzte Zeile.',
        'Er macht aus dem Wert eine Währung.'
      ],
      steps: [
        'Das Dollarzeichen fixiert Spalte und Zeile.',
        'Ohne Dollarzeichen wandert der Bezug beim Kopieren mit — das ist der relative Bezug.',
        'Gemischt geht auch: \\$A1 fixiert nur die Spalte, A\\$1 nur die Zeile.',
        'Typischer Einsatz: ein fester Umrechnungskurs, der in jeder Zeile gelten soll.'
      ],
      solution: 0
    },
    {
      q: 'Was versteht man unter Phishing?',
      opts: [
        'Eine Methode zur Datensicherung.',
        'Das Abhören von Telefonaten.',
        'Der Versuch, per gefälschter Nachricht an Zugangsdaten zu kommen.',
        'Das Durchsuchen des Papierkorbs nach Daten.'
      ],
      steps: [
        'Das Kunstwort spielt auf „fishing“ an: es wird ein Köder ausgeworfen.',
        'Typisch sind Dringlichkeit („Konto gesperrt!“), gefälschte Absender und Links auf Nachbauten echter Seiten.',
        'Bester Schutz: Adresse selbst eintippen statt auf den Link klicken — und Zwei-Faktor-Authentifizierung nutzen.'
      ],
      solution: 2
    },
    {
      q: 'Welche Aufgabe hat ein Betriebssystem?',
      opts: [
        'Es ist nur die grafische Oberfläche.',
        'Es ersetzt den Prozessor.',
        'Es sorgt allein für die Internetverbindung.',
        'Es verwaltet die Hardware und stellt Programmen Dienste bereit.'
      ],
      steps: [
        'Es verteilt Rechenzeit und Speicher, verwaltet Dateien, Geräte und Rechte.',
        'Die Oberfläche ist nur der sichtbare Teil davon.',
        'Beispiele: Windows, macOS, Linux, Android, iOS.'
      ],
      solution: 3
    },
    {
      q: 'Was beschreibt eine Verzweigung (WENN … DANN … SONST) in einem Algorithmus?',
      opts: [
        'Je nach Bedingung wird der eine oder der andere Weg ausgeführt.',
        'Ein Abschnitt wird mehrfach wiederholt.',
        'Das Programm wird beendet.',
        'Zwei Programme laufen gleichzeitig.'
      ],
      steps: [
        'Die Bedingung ergibt wahr oder falsch — genau ein Zweig wird ausgeführt.',
        'Das Wiederholen ist dagegen die Schleife.',
        'Im Struktogramm zeichnet man die Verzweigung als Dreieck mit zwei Ästen.'
      ],
      solution: 0
    },
    {
      q: 'Was steckt technisch hinter dem Wort „Cloud“?',
      opts: [
        'Ein besonders großer USB-Stick.',
        'Eine Technik, die ganz ohne Server auskommt.',
        'Fremde Rechner in einem Rechenzentrum, auf die man über das Netz zugreift.',
        'Ein Speicher im Router zu Hause.'
      ],
      steps: [
        'Die Wolke ist nur ein Bild: die Daten liegen auf konkreten Servern an einem konkreten Ort.',
        'Wichtig sind deshalb Fragen wie Standort, Anbieter, Verschlüsselung und Verfügbarkeit.',
        'Ein Sprichwort unter Informatikern: „There is no cloud, it is just someone else’s computer.“'
      ],
      solution: 2
    },
    {
      q: 'Was ist ein absoluter Pfad?',
      opts: [
        'Ein Pfad, der nur im Internet gilt.',
        'Eine vollständige Ortsangabe ab dem Wurzelverzeichnis.',
        'Ein Pfad, der vom aktuellen Ordner ausgeht.',
        'Ein Pfad ohne Dateiendung.'
      ],
      steps: [
        'Absolut beginnt ganz oben, etwa $C{:}\\backslash Users\\backslash Doc\\backslash$ oder $/home/doc/$.',
        'Relativ startet dort, wo man gerade ist — zum Beispiel $bilder/urlaub.png$.',
        'Relative Pfade bleiben gültig, wenn ein ganzer Ordner verschoben wird.'
      ],
      solution: 1
    },
    {
      q: 'Was gehört zur Software?',
      opts: [
        'Die Grafikkarte',
        'Der Monitor',
        'Die Tastatur',
        'Das Betriebssystem'
      ],
      steps: [
        'Hardware kann man anfassen, Software nicht — sie besteht aus Programmen und Daten.',
        'Das Betriebssystem ist Software, auch wenn es fest auf dem Gerät installiert ist.',
        'Sonderfall Firmware: Software, die fest in einem Bauteil steckt.'
      ],
      solution: 3
    },
    {
      q: 'Wer war Ada Lovelace?',
      opts: [
        'Sie entwickelte das Internet.',
        'Sie war die erste Frau bei Microsoft.',
        'Sie schrieb im 19. Jahrhundert das erste Programm für eine Rechenmaschine.',
        'Sie erfand den ersten Personal Computer.'
      ],
      steps: [
        'Ada Lovelace (1815-1852) beschrieb für Charles Babbages geplante Analytical Engine einen Algorithmus zur Berechnung von Bernoulli-Zahlen.',
        'Sie erkannte als Erste, dass eine solche Maschine mehr als Zahlen verarbeiten könnte — etwa Musik.',
        'Ihr zu Ehren heißt die Programmiersprache Ada so.'
      ],
      solution: 2
    },
    {
      q: 'Worin unterscheiden sich Browser und Suchmaschine?',
      opts: [
        'Die Suchmaschine ist ein Teil des Betriebssystems.',
        'Der Browser zeigt Seiten an, die Suchmaschine findet sie.',
        'Das ist dasselbe.',
        'Der Browser sucht, die Suchmaschine speichert.'
      ],
      steps: [
        'Browser sind Programme wie Firefox, Chrome oder Safari.',
        'Suchmaschinen wie Google, Bing oder DuckDuckGo sind Dienste, die man im Browser aufruft.',
        'Man kann einen Browser also ohne jede Suchmaschine nutzen — wenn man die Adresse kennt.'
      ],
      solution: 1
    },
    {
      q: 'Wie viele Bildpunkte hat ein Bild mit $1920 \\times 1080$ Pixeln?',
      opts: [
        'rund 3000',
        'rund 200 000',
        'rund 20 Millionen',
        'rund 2,1 Millionen'
      ],
      steps: [
        '$1920 \\cdot 1080 = 2\\,073\\,600$ Bildpunkte',
        'Das sind gut 2 Megapixel — die klassische Full-HD-Auflösung.',
        'Unkomprimiert mit 3 Byte je Pixel wären das etwa 6 MB für ein einziges Bild.'
      ],
      solution: 3
    },
    {
      q: 'Was ist ein Chatbot wie ChatGPT oder Claude im Kern?',
      opts: [
        'Ein Programm, das aus riesigen Textmengen gelernt hat, wahrscheinliche Fortsetzungen zu erzeugen.',
        'Eine Datenbank, die die richtige Antwort nachschlägt.',
        'Ein Mensch, der im Hintergrund mitschreibt.',
        'Eine Suchmaschine mit hübscher Oberfläche.'
      ],
      steps: [
        'Solche Sprachmodelle sagen Wort für Wort vorher, was am wahrscheinlichsten folgt.',
        'Sie schlagen nichts nach — deshalb können sie überzeugend klingen und trotzdem falsch liegen.',
        'Genau deshalb gilt: immer gegenprüfen, besonders bei Zahlen, Namen und Quellen.'
      ],
      solution: 0
    },
    {
      q: 'Welches Passwort ist am sichersten?',
      opts: [
        'Passwort123',
        'Sommer2026',
        'Anna1998',
        'Hafen-Zebra-Kaktus-7'
      ],
      steps: [
        'Länge schlägt Sonderzeichen: eine lange, zufällige Wortkette ist schwer zu knacken und gut zu merken.',
        'Namen, Jahreszahlen und Wörterbuchbegriffe stehen in jeder Angreiferliste.',
        'Am besten für jeden Dienst ein eigenes Passwort — dafür gibt es Passwortmanager.'
      ],
      solution: 3
    },
    {
      q: 'Was bedeutet die 3-2-1-Regel beim Backup?',
      opts: [
        'Drei Festplatten im selben Gerät.',
        'Drei Kopien, auf zwei verschiedenen Medien, eine davon außer Haus.',
        'Drei Backups pro Tag, zwei pro Woche, eines pro Monat.',
        'Drei Passwörter, zwei Nutzer, ein Rechner.'
      ],
      steps: [
        'Drei Kopien schützen gegen Defekte, zwei Medienarten gegen einen typischen Fehler beider Geräte.',
        'Die Kopie außer Haus rettet die Daten bei Brand, Wasser oder Diebstahl.',
        'Ein Backup, das man nie zurückgespielt hat, ist übrigens nur eine Hoffnung — ab und zu testen.'
      ],
      solution: 1
    },
    {
      q: 'Wie hängen Internet und World Wide Web zusammen?',
      opts: [
        'Das WWW ist einer von vielen Diensten im Internet.',
        'Das ist dasselbe.',
        'Das Internet ist ein Teil des WWW.',
        'Das WWW ersetzt das Internet seit 2000.'
      ],
      steps: [
        'Das Internet ist das weltweite Netz aus Leitungen, Routern und Protokollen.',
        'Darauf laufen viele Dienste: WWW, E-Mail, Messenger, Videostreams, Online-Spiele.',
        'Eine E-Mail nutzt also das Internet, aber nicht das Web.'
      ],
      solution: 0
    },
    {
      q: 'Was bezeichnet in der Adresse https://docalvers.de/svp/index.html den Teil „docalvers.de“?',
      opts: [
        'das Übertragungsprotokoll',
        'den Ordner auf dem Server',
        'den Domainnamen des Servers',
        'den Dateinamen'
      ],
      steps: [
        'Eine URL besteht aus Protokoll ($https$), Domainname, Pfad und Dateiname.',
        'Der Domainname wird per DNS in eine IP-Adresse übersetzt.',
        'Hier ist $/svp/$ der Ordner und $index.html$ die Datei.'
      ],
      solution: 2
    },
    {
      q: 'Welche Reihenfolge der Speichergrößen stimmt?',
      opts: [
        'TB < GB < MB < KB',
        'KB < MB < GB < TB',
        'MB < KB < GB < TB',
        'GB < MB < TB < KB'
      ],
      steps: [
        'Jede Stufe ist rund tausendmal so groß wie die vorige.',
        'Ein Foto liegt bei einigen MB, ein Film bei einigen GB.',
        'Danach kämen Petabyte und Exabyte — Größenordnungen für Rechenzentren.'
      ],
      solution: 1
    },
    {
      q: 'Was regelt die Datenschutz-Grundverordnung (DSGVO) im Kern?',
      opts: [
        'Wie schnell Internetanschlüsse sein müssen.',
        'Welche Passwörter erlaubt sind.',
        'Wie lange Computer halten müssen.',
        'Wie personenbezogene Daten verarbeitet werden dürfen.'
      ],
      steps: [
        'Sie gilt seit 2018 europaweit und schützt Daten, die sich auf eine bestimmbare Person beziehen.',
        'Grundsätze: Zweckbindung, Datenminimierung, Transparenz — erlaubt ist nur, was eine Rechtsgrundlage hat.',
        'Betroffene haben Rechte auf Auskunft, Berichtigung und Löschung.',
        'Datenschutz schützt also Menschen, nicht Daten — Datensicherheit ist die technische Seite.'
      ],
      solution: 3
    }
];
