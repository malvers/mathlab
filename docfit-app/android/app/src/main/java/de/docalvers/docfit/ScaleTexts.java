package de.docalvers.docfit;

import java.util.Locale;

/**
 * The German lines of the "Waage" tab that depend on the weigh-ins: the state line after a result and the note under
 * the tiles. Pure Java, so the choice is unit-tested (ScaleTest); MainActivity only puts the text on screen.
 *
 * A weigh-in with a weight but no usable resistance (the scale sent 0xFFFF or nothing - no skin contact) must say so
 * plainly instead of four silent "–" (real test on Doc's scale, 19.11.2026).
 */
final class ScaleTexts {
    static final String SAVED = "Fertig – gespeichert ✓";
    static final String SAVED_WEIGHT_ONLY = "Gewicht gespeichert – Körperfett nicht gemessen";
    static final String COMPLETED = "Fertig – Körperfett ergänzt ✓";
    static final String REPEAT = "Fertig – war schon gespeichert";
    /** a result near neither person's newest weigh-in (Weighings.whose = ASK): the state line meanwhile, and after "Keiner" */
    static final String ASKING = "Wessen Messung? – bitte antworten";
    static final String DISCARDED = "Nicht gespeichert";

    static final String NOTE_EMPTY = "Barfuß draufstellen – dann misst sie auch den Körperfettanteil.";
    static final String NOTE_PROFILE = "Profil fehlt – unter „Profil“ Größe, Geburtsjahr und Geschlecht eintragen.";
    static final String NOTE_NO_FAT = "Kein Körperfett gemessen – barfuß auf alle vier Metallflächen stellen und "
            + "stehen bleiben, bis „Fertig“ kommt.";

    private ScaleTexts() {
    }

    /**
     * The label in the weight's pill: the moment of the weigh-in, in capitals like the labels of the other pills
     * ("DO 19.11.2026 · 07:12 UHR"); empty before the first weigh-in. Doc, 19.11.2026: "Gewicht braucht man da nicht
     * schreiben ... in die Pille rein, das Datum und die Uhrzeit".
     */
    static String when(Weighings.Weighing w) {
        if (w == null) return "";
        return (Times.day(w.time) + " · " + Times.clock(w.time) + " Uhr").toUpperCase(Locale.GERMAN);
    }

    /** A weigh-in that has a weight but nothing fat, water and muscle could be computed from. */
    static boolean weightOnly(Weighings.Weighing w) {
        return w != null && w.centiKg > 0 && !w.hasResistance();
    }

    /** The question when the weight is near neither person: "Doc oder …?" */
    static String askTitle(String first, String second) {
        return first + " oder " + second + "?";
    }

    /**
     * The text under it: the weight just measured and what the answers do. The newest weights of the two are left out
     * on purpose - each sees only their own.
     */
    static String ask(Weighings.Weighing w) {
        return Times.kg(w.kg()) + " – mehr als 5 kg von beiden letzten Messungen entfernt. Wem gehört sie?\n\n"
                + "„Keiner“ verwirft sie, dann wird nichts gespeichert.";
    }

    /** Only one person on and the weight far from hers: "Ist das Doc?" with Ja / Nein. */
    static String askOne(String name) {
        return "Ist das " + name + "?";
    }

    static String askOneText(Weighings.Weighing w) {
        return Times.kg(w.kg()) + " – mehr als 5 kg anders als die letzte Messung.\n\n"
                + "Ja: speichern. Nein: verwerfen, es wird nichts gespeichert.";
    }

    /** The state line after a result, with the person it went to: "Doc: Fertig – gespeichert ✓". */
    static String doneFor(String name, Weighings.Added added, Weighings.Weighing result) {
        return name + ": " + done(added, result);
    }

    /** Long press on a weigh-in in the list: move it to the other person. */
    static String moveQuestion(Weighings.Weighing w, String to) {
        return Times.kg(w.kg()) + " vom " + Times.day(w.time) + ", " + Times.clock(w.time) + " Uhr – zu " + to
                + " verschieben?";
    }

    /** The state line once a result from the scale has been added to the list. */
    static String done(Weighings.Added added, Weighings.Weighing result) {
        switch (added) {
            case NEW:
                return weightOnly(result) ? SAVED_WEIGHT_ONLY : SAVED;
            case COMPLETED:
                return COMPLETED;
            default:
                return REPEAT;
        }
    }

    /**
     * Whether the note under the tiles is the "no fat measured" warning (MainActivity draws it in λ orange). A missing
     * profile keeps priority: without it there would be no fat even with a resistance.
     */
    static boolean fatMissing(Weighings.Weighing last, Profile profile) {
        return profile.complete() && weightOnly(last);
    }

    /** The short form of {@link #when} for the compact bar: "DO 19.11."; empty before the first weigh-in. */
    static String whenShort(Weighings.Weighing w) {
        if (w == null) return "";
        String day = Times.day(w.time);   // "Do 19.11.2026"
        return day.substring(0, day.length() - 4).toUpperCase(Locale.GERMAN);
    }

    /**
     * The note under the tiles for the newest weigh-in ({@code last} null = no weigh-ins yet); "" when all is well - the
     * method and the resistance are under "Messmethode" in the settings (Doc, 20.11.2026: "Nimm den Text ‚Geschätzt aus
     * … Ω Widerstand' raus und tu ihn unter Einstellungen irgendwohin, damit wir da nicht den Platz verschwenden").
     */
    static String note(Weighings.Weighing last, Profile profile) {
        if (last == null) return NOTE_EMPTY;
        if (!profile.complete()) return NOTE_PROFILE;
        if (fatMissing(last, profile)) return NOTE_NO_FAT;
        if (Double.isNaN(BodyComposition.of(last, profile).fatPercent)) {
            return "Widerstand " + last.ohm + " Ω unplausibel – barfuß, Füße auf die Elektroden?";
        }
        return "";
    }

    /**
     * "Messmethode" in the settings: the newest measured resistance ({@code measured} null = none yet) and where every
     * value on the scale tab comes from.
     */
    static String method(Weighings.Weighing measured) {
        String last = measured == null ? "Noch keine Messung mit Widerstand."
                : "Letzter Widerstand: " + measured.ohm + " Ω (" + Times.day(measured.time) + ", "
                + Times.clock(measured.time) + " Uhr).";
        return last + "\n\n"
                + "Die Waage misst Gewicht und den Widerstand zwischen den Füßen. Daraus geschätzt: Körperfett nach "
                + "Jebb 2000 (eine Formel für Fuß-zu-Fuß-Waagen), Wasser als 73 % der fettfreien Masse, Muskel nach "
                + "Janssen 2000 (eine Schätzung), Fitness nach Gallagher 2000 und ACE. Zur Kontrolle rechnet DocFit "
                + "das Körperfett auch aus BMI, Alter und Geschlecht (Gallagher 2000): liegen beide mehr als 8 Punkte "
                + "auseinander oder unter dem lebenswichtigen Fett, steht „unplausibel – bitte wiederholen“ da.\n\n"
                + "Die Balken in den Kacheln: Körperfett nach Gallagher 2000 für Geschlecht und Alter, Wasser "
                + "die übliche Spanne (kein ärztlicher Grenzwert), Muskel je Größe² nach Janssen 2004, BMI nach WHO, "
                + "Bauch nach WHO 2008 (erhöht ab 94 cm, deutlich ab 102 cm bei Männern; 80 / 88 cm bei Frauen).\n\n"
                + "Bauch/Größe (WHtR) nach Ashwell 2016: unter 0,5 gut, 0,5 bis 0,6 erhöht, ab 0,6 hoch. "
                + "Bauch/Hüfte (WHR) nach WHO 2008: erhöht ab 0,90 (Männer) bzw. 0,85 (Frauen). "
                + "Bauch in der Mitte zwischen unterster Rippe und Beckenkamm messen, Hüfte an der breitesten Stelle, "
                + "im Stehen, nach dem Ausatmen.\n\n"
                + "Schätzwerte, kein Labor. Es zählt der Verlauf – immer gleich messen (morgens, barfuß, nicht direkt "
                + "nach dem Training).";
    }
}
