package de.docalvers.docfit;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * The data of the "Verlauf" tab (Doc, 26.11.2026: "ein Tab mit den Verlaufsdaten ... für die laufenden Werte" - next to
 * the fasting view): the chosen stretch of time (4 weeks, 3 months, 1 year, everything) and one series per value -
 * the blood pressure (systolic, diastolic), the pulse, the fasting blood glucose, the stopwatch times per exercise and
 * the repetitions per set of the counted exercises, per move (Doc, 26.11.2026); the scale values come from History.series. All series oldest first, as HistoryChart draws them. Pure Java, tested in
 * TrendsTest.
 */
final class Trends {
    static final String[] RANGE_WORDS = {"4 Wochen", "3 Monate", "1 Jahr", "Alles"};
    private static final long[] RANGE_DAYS = {28, 91, 365, 0};
    static final long DAY_MS = 86_400_000L;
    static final int SYS = 0, DIA = 1, PULSE = 2;

    private Trends() {
    }

    /** The first moment of a stretch (index into RANGE_WORDS); everything: Long.MIN_VALUE. */
    static long from(int range, long now) {
        int r = Math.max(0, Math.min(range, RANGE_DAYS.length - 1));
        return RANGE_DAYS[r] == 0 ? Long.MIN_VALUE : now - RANGE_DAYS[r] * DAY_MS;
    }

    /** The points from {@code from} on. */
    static List<History.Point> since(List<History.Point> oldestFirst, long from) {
        List<History.Point> out = new ArrayList<>();
        for (History.Point p : oldestFirst) if (p.time >= from) out.add(p);
        return out;
    }

    /** Systolic, diastolic or pulse (readings without a pulse are left out), oldest first. */
    static List<History.Point> pressure(List<Pressures.Reading> newestFirst, int which) {
        List<History.Point> out = new ArrayList<>();
        for (int i = newestFirst.size() - 1; i >= 0; i--) {
            Pressures.Reading r = newestFirst.get(i);
            if (which == PULSE && r.pulse <= 0) continue;
            out.add(new History.Point(r.time, which == SYS ? r.sys : which == DIA ? r.dia : r.pulse));
        }
        return out;
    }

    /** The fasting blood glucose in mg/dL, oldest first (other contexts are not comparable day to day). */
    static List<History.Point> fastingGlucose(List<Glucoses.Reading> newestFirst) {
        List<History.Point> out = new ArrayList<>();
        for (int i = newestFirst.size() - 1; i >= 0; i--) {
            Glucoses.Reading r = newestFirst.get(i);
            if (Glucoses.CONTEXTS[0].equals(r.context)) out.add(new History.Point(r.time, r.mgdl));
        }
        return out;
    }

    /** The stopwatch times of one exercise in seconds, oldest first (its counted sets are no times). */
    static List<History.Point> runs(List<Entries.Entry> newestFirst, String kind) {
        List<History.Point> out = new ArrayList<>();
        for (int i = newestFirst.size() - 1; i >= 0; i--) {
            Entries.Entry e = newestFirst.get(i);
            if (kind.equals(e.kind) && !e.isCounted()) out.add(new History.Point(e.start, e.duration / 1000.0));
        }
        return out;
    }

    /** The counted sets of one exercise made as {@code move} ("" = without a move), oldest first. */
    static List<Entries.Entry> sets(List<Entries.Entry> newestFirst, String kind, String move) {
        List<Entries.Entry> out = new ArrayList<>();
        for (int i = newestFirst.size() - 1; i >= 0; i--) {
            Entries.Entry e = newestFirst.get(i);
            if (e.isCounted() && kind.equals(e.kind) && e.move.equals(move)) out.add(e);
        }
        return out;
    }

    /**
     * The moves the sets of an exercise were made as - one card each: the exercise's own moves in their order first,
     * then any other (a name from before a rename, "" for sets without a move). Only moves with a set.
     */
    static List<String> setMoves(List<Entries.Entry> newestFirst, String kind) {
        List<String> seen = new ArrayList<>();
        for (int i = newestFirst.size() - 1; i >= 0; i--) {
            Entries.Entry e = newestFirst.get(i);
            if (e.isCounted() && kind.equals(e.kind) && !seen.contains(e.move)) seen.add(e.move);
        }
        List<String> out = new ArrayList<>();
        for (String m : Entries.moves(kind)) if (seen.contains(m)) out.add(m);
        for (String m : seen) if (!out.contains(m)) out.add(m);
        return out;
    }

    /** The sets from {@code from} on. */
    static List<Entries.Entry> setsSince(List<Entries.Entry> oldestFirst, long from) {
        List<Entries.Entry> out = new ArrayList<>();
        for (Entries.Entry e : oldestFirst) if (e.start >= from) out.add(e);
        return out;
    }

    /** The repetitions of sets as points, in their order. */
    static List<History.Point> reps(List<Entries.Entry> sets) {
        List<History.Point> out = new ArrayList<>();
        for (Entries.Entry e : sets) out.add(new History.Point(e.start, e.reps));
        return out;
    }

    /** The newest value as shown in a card's head ("78,1 kg"); "–" without any. */
    static String latest(List<History.Point> oldestFirst, int decimals, String unit) {
        if (oldestFirst.isEmpty()) return "–";
        double v = oldestFirst.get(oldestFirst.size() - 1).value;
        String n = String.format(Locale.GERMANY, "%." + decimals + "f", v);
        return unit.isEmpty() ? n : n + " " + unit;
    }

    /** Seconds as the stopwatch shows them ("1:34"). */
    static String clock(double seconds) {
        long s = Math.round(seconds);
        return (s / 60) + ":" + String.format(Locale.ROOT, "%02d", s % 60);
    }
}
