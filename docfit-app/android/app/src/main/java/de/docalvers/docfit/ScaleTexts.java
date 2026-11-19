package de.docalvers.docfit;

import java.util.Locale;

/**
 * The German lines of the "Waage" tab that depend on the weigh-ins: the state line after a result and the note under
 * the four tiles. Pure Java, so the choice is unit-tested (ScaleTest); MainActivity only puts the text on screen.
 *
 * A weigh-in with a weight but no usable resistance (the scale sent 0xFFFF or nothing - no skin contact) must say so
 * plainly instead of four silent "–" (real test on Doc's scale, 19.11.2026).
 */
final class ScaleTexts {
    static final String SAVED = "Fertig – gespeichert ✓";
    static final String SAVED_WEIGHT_ONLY = "Gewicht gespeichert – Körperfett nicht gemessen";
    static final String COMPLETED = "Fertig – Körperfett ergänzt ✓";
    static final String REPEAT = "Fertig – war schon gespeichert";

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

    /** The note under the tiles for the newest weigh-in ({@code last} null = no weigh-ins yet). */
    static String note(Weighings.Weighing last, Profile profile) {
        if (last == null) return NOTE_EMPTY;
        if (!profile.complete()) return NOTE_PROFILE;
        if (fatMissing(last, profile)) return NOTE_NO_FAT;
        if (Double.isNaN(BodyComposition.of(last, profile).fatPercent)) {
            return "Widerstand " + last.ohm + " Ω unplausibel – barfuß, Füße auf die Elektroden?";
        }
        return "Geschätzt aus " + last.ohm + " Ω Widerstand (Sun 2003, Janssen 2000)";
    }
}
