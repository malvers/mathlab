package de.docalvers.docfit;

/**
 * What the detail sheet of a tile says (Doc, 20.11.2026: "Wenn man auf die Kacheln Körperfett, Wasser etc. tippt, dass
 * man dort genauere Informationen findet, warum das schlecht, gut oder whatsoever ist") - the one text table next to
 * Ranges: what the value is, how it is measured or estimated, what moves it, why it matters, and the source. Short,
 * factual, no alarm. Pure Java, tested in TileInfoTest.
 */
final class TileInfo {
    /** The values with a sheet: the weight pill and the eight tiles. */
    enum Key { WEIGHT, FAT, WATER, MUSCLE, BMI, WAIST, WHTR, HIP, WHR }

    static final String LEGEND = "Farben: grün gut · orange Grenzbereich · rot hoch · ohne Farbe: kein eigener Grenzwert";
    static final String FEW = "Verlauf erscheint ab der zweiten Messung.";

    final String title, what, how, moves, why, source;

    private TileInfo(String title, String what, String how, String moves, String why, String source) {
        this.title = title;
        this.what = what;
        this.how = how;
        this.moves = moves;
        this.why = why;
        this.source = source;
    }

    /** Waist and hip are typed in: their sheets offer "Eintragen / Ändern". */
    static boolean typedIn(Key k) {
        return k == Key.WAIST || k == Key.HIP || k == Key.WHTR || k == Key.WHR;
    }

    private static final String ESTIMATE = "Geschätzt: Die Waage schickt einen schwachen Strom von Fuß zu Fuß und misst "
            + "den Widerstand. Fett leitet schlechter als Muskel und Wasser. ";
    private static final String SAME_WAY = "Darum immer gleich messen: morgens, nach der Toilette, vor Frühstück und "
            + "Training, barfuß.";

    static TileInfo of(Key k) {
        switch (k) {
            case WEIGHT:
                return new TileInfo("Gewicht",
                        "Das Körpergewicht, wie die Waage es misst – auf 10 g genau.",
                        "Direkt gemessen. Die Farben im Verlauf sind die BMI-Bereiche der WHO, für deine Größe in kg "
                                + "umgerechnet.",
                        "Über den Tag schwankt es um ein bis zwei Kilo: Essen, Trinken, Toilette, Kleidung. " + SAME_WAY,
                        "Der Verlauf über Wochen sagt mehr als der einzelne Tag. Wie viel davon Fett oder Muskel ist, "
                                + "zeigen die Kacheln darunter.",
                        "WHO-Bereiche des BMI (18,5 / 25 / 30) mal Größe².");
            case FAT:
                return new TileInfo("Körperfett",
                        "Der Anteil des Fetts am Körpergewicht. Etwas Fett ist lebenswichtig (Hormone, Wärme, Polster); "
                                + "viel Fett, vor allem am Bauch, belastet Herz, Gefäße und Stoffwechsel.",
                        ESTIMATE + "Formel für Fuß-zu-Fuß-Waagen (Jebb 2000). Mehr als 8 Punkte weg von der "
                                + "Schätzung aus BMI und Alter: „unplausibel“, meist schlechter Kontakt.",
                        "Kurzfristig vor allem der Wasserhaushalt: Trinken, Essen, Sport, Sauna, Tageszeit. " + SAME_WAY
                                + " Langfristig: Ernährung, Bewegung, Krafttraining.",
                        "Sagt mehr als das Gewicht allein: Bei gleichem Gewicht kann mehr Muskel und weniger Fett "
                                + "dahinterstehen.",
                        "Bereiche nach Alter und Geschlecht: Gallagher D et al., Am J Clin Nutr 2000 (gesund = Fett "
                                + "bei BMI 18,5 bis 25). Die Fitness-Note stuft den gesunden Bereich zusätzlich nach den "
                                + "Kategorien des American Council on Exercise (ACE) ab. Schätzformel: Jebb SA et al., Br J "
                                + "Nutr 2000 (Fuß zu Fuß).");
            case WATER:
                return new TileInfo("Wasser",
                        "Der Anteil des Körperwassers am Gewicht. Muskeln bestehen zu rund drei Vierteln aus Wasser, "
                                + "Fett kaum – mehr Muskel heißt meist auch mehr Wasser.",
                        ESTIMATE + "DocFit nimmt rund 73 % der fettfreien Masse als Wasser – so viel enthält sie "
                                + "üblicherweise.",
                        "Schwankt schon über den Tag: Trinken, salziges Essen, Schwitzen, Alkohol, Hitze. " + SAME_WAY,
                        "Ein niedriger Wert geht meist mit viel Körperfett oder wenig Muskel einher, selten mit zu wenig "
                                + "Trinken. Einen ärztlichen Grenzwert gibt es nicht – die Spanne ist eine übliche "
                                + "Orientierung.",
                        "73 % der fettfreien Masse (Körperfett nach Jebb SA et al., Br J Nutr 2000). Spanne: übliche "
                                + "Angabe für Erwachsene "
                                + "(Männer 50–65 %, Frauen 45–60 %).");
            case MUSCLE:
                return new TileInfo("Muskel (Schätzung)",
                        "Die Skelettmuskulatur in kg – die Muskeln, mit denen man sich bewegt. Sie halten Kraft, "
                                + "Gleichgewicht und Stoffwechsel in Gang, gerade mit den Jahren.",
                        ESTIMATE + "Eine Schätzung aus Widerstand, Größe, Alter und Geschlecht (Janssen 2000, von Hand "
                                + "zu Fuß gemessen – die Waage misst von Fuß zu Fuß). Bewertet wird die "
                                + "Muskelmasse je Größe², damit große und kleine Menschen vergleichbar sind; die Grenzen "
                                + "sind für deine Größe in kg umgerechnet.",
                        "Krafttraining und genug Eiweiß bauen auf; lange Pausen, Krankheit und das Alter bauen ab. Auch "
                                + "hier verschiebt der Wasserhaushalt den Tageswert.",
                        "Wenig Muskelmasse geht im Alter mit mehr Einschränkungen im Alltag einher; unterhalb der "
                                + "unteren Grenze steigt das Risiko deutlich.",
                        "Formel: Janssen I et al., J Appl Physiol 2000. Grenzen: Janssen I et al., Am J Epidemiol 2004 "
                                + "(Männer 8,50 / 10,76 kg/m², Frauen 5,75 / 6,76 kg/m²).");
            case BMI:
                return new TileInfo("BMI",
                        "Der Body-Mass-Index: Gewicht geteilt durch Größe zum Quadrat (kg/m²).",
                        "Gerechnet aus dem Gewicht der Waage und der Größe im Profil – ohne Schätzung.",
                        "Nur das Gewicht. Er unterscheidet nicht zwischen Muskel und Fett: Muskulöse Menschen liegen "
                                + "oft über 25, ohne zu viel Fett zu haben.",
                        "Ein grobes, weltweit genutztes Maß – zusammen mit Körperfett und Bauch aussagekräftiger als "
                                + "allein.",
                        "Weltgesundheitsorganisation (WHO): unter 18,5 Untergewicht, 18,5–24,9 normal, 25–29,9 "
                                + "Übergewicht, ab 30 Adipositas.");
            case WAIST:
                return new TileInfo("Bauch",
                        "Der Bauchumfang zeigt das Fett im Bauchraum – das Fett um die Organe, das für Herz und "
                                + "Stoffwechsel am meisten zählt.",
                        "Von Hand gemessen: im Stehen, nach dem Ausatmen, in der Mitte zwischen unterster Rippe und "
                                + "Beckenkamm (meist auf Nabelhöhe), Maßband waagerecht, nicht einschnüren.",
                        "Ein voller Bauch, Blähungen, die Haltung und wo genau das Band liegt. Darum immer gleich "
                                + "messen, am besten morgens.",
                        "Er sinkt oft schon, bevor die Waage viel zeigt – ein guter Anzeiger für Fortschritt.",
                        "WHO, Waist circumference and waist-hip ratio, Genf 2008: Männer erhöht ab 94 cm, deutlich "
                                + "erhöht ab 102 cm; Frauen 80 / 88 cm. Ziellinie Bauch/Größe 0,5: Ashwell 2016.");
            case WHTR:
                return new TileInfo("Bauch/Größe",
                        "Bauchumfang geteilt durch Körpergröße. Faustregel: Der Bauch soll kleiner sein als die halbe "
                                + "Körpergröße.",
                        "Gerechnet aus deinem Bauchumfang und der Größe im Profil, auf zwei Stellen abgeschnitten – so "
                                + "passen Zahl und Bewertung immer zusammen.",
                        "Nur der Bauchumfang – die Größe bleibt.",
                        "Sagt Herz-Kreislauf- und Stoffwechselrisiken besser voraus als BMI oder Bauchumfang allein und "
                                + "gilt für Männer und Frauen gleich.",
                        "Ashwell M, Gibson S, BMJ Open 2016: unter 0,5 gut, 0,5 bis unter 0,6 erhöht, ab 0,6 hoch.");
            case HIP:
                return new TileInfo("Hüfte",
                        "Der Umfang an der breitesten Stelle des Gesäßes.",
                        "Von Hand gemessen, im Stehen, das Maßband waagerecht über die breiteste Stelle.",
                        "Muskeln an Gesäß und Oberschenkeln, Fett an den Hüften.",
                        "Hüfte allein wird nicht bewertet – dafür gibt es keinen eigenen Grenzwert. Sie zählt im "
                                + "Verhältnis Bauch/Hüfte; deshalb steht die Zahl ohne Farbe.",
                        "WHO 2008 (Verhältnis Bauch/Hüfte).");
            default:
                return new TileInfo("Bauch/Hüfte",
                        "Bauchumfang geteilt durch Hüftumfang: Liegt das Fett eher am Bauch oder an den Hüften?",
                        "Gerechnet aus deinen beiden Maßen, auf zwei Stellen abgeschnitten.",
                        "Weniger Bauch senkt ihn, mehr Muskeln an Gesäß und Beinen auch.",
                        "Fett am Bauch ist für Herz und Stoffwechsel ungünstiger als Fett an den Hüften.",
                        "WHO 2008: deutlich erhöhtes Risiko ab 0,90 (Männer) bzw. 0,85 (Frauen).");
        }
    }
}
