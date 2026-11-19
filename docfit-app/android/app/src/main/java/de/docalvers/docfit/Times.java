package de.docalvers.docfit;

import java.util.Calendar;
import java.util.Locale;

/**
 * How DocFit writes times and numbers: the stopwatch "12:34", the lists "Mo 16.11.2026", "06:45", the scale's
 * "85,00 kg", "24,2 %", BMI "24,7" (German decimal comma; "–" where a value is unknown). Pure Java.
 */
final class Times {
    private static final String[] DAYS = {"So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"};

    private Times() {
    }

    /**
     * Stopwatch: "mm:ss" below an hour, "h:mm:ss" from one hour on - seconds cut, not rounded, like a stopwatch. No
     * tenths (Doc, 19.11.2026: "wir brauchen keine 0,1 Zehntelsekunden"); the stored milliseconds stay as they are.
     */
    static String duration(long ms) {
        if (ms < 0) ms = 0;
        long s = ms / 1000, m = s / 60, h = m / 60;
        return h > 0
                ? String.format(Locale.GERMANY, "%d:%02d:%02d", h, m % 60, s % 60)
                : String.format(Locale.GERMANY, "%02d:%02d", m, s % 60);
    }

    static String day(long when) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(when);
        return String.format(Locale.GERMANY, "%s %02d.%02d.%d", DAYS[c.get(Calendar.DAY_OF_WEEK) - 1],
                c.get(Calendar.DAY_OF_MONTH), c.get(Calendar.MONTH) + 1, c.get(Calendar.YEAR));
    }

    static String clock(long when) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(when);
        return String.format(Locale.GERMANY, "%02d:%02d", c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE));
    }

    /** Weight to the 10 g the scale measures: "85,00 kg". */
    static String kg(double kg) {
        return Double.isNaN(kg) ? "–" : String.format(Locale.GERMANY, "%.2f kg", kg);
    }

    /** A share or a muscle mass, one decimal: "24,2 %", "31,5 kg"; "–" when unknown. */
    static String one(double v, String unit) {
        return Double.isNaN(v) ? "–" : String.format(Locale.GERMANY, "%.1f", v) + (unit.isEmpty() ? "" : " " + unit);
    }
}
