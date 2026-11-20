package de.docalvers.docfit;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * The list of weigh-ins from the Vitafit scale, newest first, kept on the phone exactly like the stopwatch times
 * (Entries): in the app's own preferences, never sent anywhere (the app has no internet permission and no backup).
 *
 * Only what the scale measured is stored - the moment, the weight and the resistance between the feet - and, typed in
 * by hand, the waist and hip circumference (Doc, 20.11.2026: "Zum Eingeben brauchen wir noch irgendwo ein Feld für
 * Bauchumfang", "ja, bitte auch ein Feld für Hüftumfang"). Fat, water, muscle, BMI, waist-to-height and waist-to-hip
 * are computed when shown (BodyComposition, Girths) from the profile, so a profile entered or corrected later also
 * fixes the old weigh-ins.
 *
 * The stored text is a JSON array of {"time", "centiKg", "ohm"} plus "waistMm" / "hipMm" only where one was typed in -
 * so the rows saved before 20.11.2026 read as they are (no girths), and a row without them is written exactly as
 * before.
 * A row that cannot be read is skipped, never the whole list; and before anything is written over a list that could
 * not be read completely, its text is kept once under its own key (KEY_KEPT), so no weigh-in on the phone gets lost.
 */
final class Weighings {
    /**
     * One weigh-in: wall clock in ms, weight in units of 10 g, resistance in ohms (0 = not measured; rows saved before
     * 19.11.2026 may hold the scale's 65535 instead, which counts as not measured as well).
     */
    static final class Weighing {
        final long time;
        final int centiKg, ohm;
        /** waist and hip circumference typed in by hand, in mm (= tenths of a cm), 0 = none */
        final int waistMm, hipMm;

        Weighing(long time, int centiKg, int ohm) {
            this(time, centiKg, ohm, 0, 0);
        }

        Weighing(long time, int centiKg, int ohm, int waistMm, int hipMm) {
            this.time = time;
            this.centiKg = centiKg;
            this.ohm = ohm;
            this.waistMm = Math.max(0, waistMm);
            this.hipMm = Math.max(0, hipMm);
        }

        /** The same weigh-in with other girths (mm, 0 = none). */
        Weighing withGirths(int waistMm, int hipMm) {
            return new Weighing(time, centiKg, ohm, waistMm, hipMm);
        }

        boolean hasWaist() {
            return waistMm > 0;
        }

        boolean hasHip() {
            return hipMm > 0;
        }

        double kg() {
            return centiKg / 100.0;
        }

        /** Whether this weigh-in has a resistance fat, water and muscle can be computed from. */
        boolean hasResistance() {
            return BodyComposition.isMeasured(ohm);
        }
    }

    /** A second result of the same weigh-in arrives within this time (a reconnect while the scale still shows it). */
    static final long SAME_WEIGH_IN_MS = 3 * 60_000;

    private static final String PREFS = "docfit", KEY = "weighings";
    /** the stored text of a list that could not be read completely, kept before the first save writes over it */
    static final String KEY_KEPT = "weighingsUnread";
    private final SharedPreferences prefs;
    private final List<Weighing> list = new ArrayList<>();

    Weighings(Context context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String stored = prefs.getString(KEY, null);
        Parsed p = parse(stored);
        list.addAll(p.rows);
        if (!p.complete() && !prefs.contains(KEY_KEPT)) prefs.edit().putString(KEY_KEPT, stored).apply();
    }

    /** What {@link #parse} could read: the rows, and whether something in the text had to be left out. */
    static final class Parsed {
        final List<Weighing> rows;
        final int skipped;          // rows that could not be read
        final boolean unreadable;   // the text as a whole is no list

        Parsed(List<Weighing> rows, int skipped, boolean unreadable) {
            this.rows = rows;
            this.skipped = skipped;
            this.unreadable = unreadable;
        }

        boolean complete() {
            return skipped == 0 && !unreadable;
        }
    }

    /**
     * Reads the stored list, newest first as stored; null or "" = no weigh-ins yet. Rows from before 20.11.2026 have no
     * "waistMm" / "hipMm" (and the very first ones maybe no "ohm") - these then count as 0. A row without a time or a
     * weight is skipped and counted, the others are kept.
     */
    static Parsed parse(String json) {
        List<Weighing> rows = new ArrayList<>();
        if (json == null || json.trim().isEmpty()) return new Parsed(rows, 0, false);
        JSONArray a;
        try {
            a = new JSONArray(json);
        } catch (JSONException e) {
            return new Parsed(rows, 0, true);
        }
        int skipped = 0;
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            try {
                if (o == null) throw new JSONException("no object");
                rows.add(new Weighing(o.getLong("time"), o.getInt("centiKg"), o.optInt("ohm", 0),
                        o.optInt("waistMm", 0), o.optInt("hipMm", 0)));
            } catch (JSONException e) {
                skipped++;
            }
        }
        return new Parsed(rows, skipped, false);
    }

    /** The text {@link #parse} reads back; "waistMm" / "hipMm" only in rows that have them. */
    static String format(List<Weighing> rows) throws JSONException {
        JSONArray a = new JSONArray();
        for (Weighing w : rows) {
            JSONObject o = new JSONObject().put("time", w.time).put("centiKg", w.centiKg).put("ohm", w.ohm);
            if (w.hasWaist()) o.put("waistMm", w.waistMm);
            if (w.hasHip()) o.put("hipMm", w.hipMm);
            a.put(o);
        }
        return a.toString();
    }

    /**
     * Whether {@code next} is only a repeat of {@code last}: the very same weight within a few minutes. A real second
     * weigh-in practically never hits the same 10 g again.
     */
    static boolean isRepeat(Weighing last, Weighing next) {
        return last != null && next != null && last.centiKg == next.centiKg
                && Math.abs(next.time - last.time) <= SAME_WEIGH_IN_MS;
    }

    /**
     * The newest weigh-in {@code last} completed by {@code next}, or null: a repeat that brings the resistance the
     * newest one was missing (also when an old row holds the scale's 65535 instead of 0).
     */
    static Weighing completion(Weighing last, Weighing next) {
        return isRepeat(last, next) && !last.hasResistance() && next.hasResistance()
                ? new Weighing(last.time, last.centiKg, next.ohm, last.waistMm, last.hipMm) : null;
    }

    /** What {@link #add} did with a result. */
    enum Added { NEW, COMPLETED, REPEAT }

    /**
     * Adds a result from the scale unless it repeats the newest weigh-in. A repeat that brings the resistance the
     * newest one was missing completes it instead of making a second row.
     */
    Added add(Weighing w) {
        Weighing last = list.isEmpty() ? null : list.get(0);
        if (isRepeat(last, w)) {
            Weighing completed = completion(last, w);
            if (completed != null) {
                list.set(0, completed);
                save();
                return Added.COMPLETED;
            }
            return Added.REPEAT;
        }
        insert(0, w);
        return Added.NEW;
    }

    int size() {
        return list.size();
    }

    Weighing get(int i) {
        return list.get(i);
    }

    void insert(int i, Weighing w) {
        list.add(Math.max(0, Math.min(i, list.size())), w);
        save();
    }

    Weighing remove(int i) {
        Weighing w = list.remove(i);
        save();
        return w;
    }

    /**
     * Gives the weigh-in made at {@code time} other girths (mm, 0 = none) and returns its row, -1 if it is gone. Found
     * by its moment, not its row: a new weigh-in may have arrived while they were being typed in.
     */
    int setGirths(long time, int waistMm, int hipMm) {
        int i = indexOf(time);
        if (i < 0) return -1;
        list.set(i, list.get(i).withGirths(waistMm, hipMm));
        save();
        return i;
    }

    int indexOf(long time) {
        for (int i = 0; i < list.size(); i++) if (list.get(i).time == time) return i;
        return -1;
    }

    /** The newest weigh-in with a measured resistance, or null - for "Messmethode" in the settings. */
    Weighing newestMeasured() {
        for (Weighing w : list) if (w.hasResistance()) return w;
        return null;
    }

    private void save() {
        try {
            prefs.edit().putString(KEY, format(list)).apply();
        } catch (JSONException e) {
            // cannot happen with plain numbers; the stored list then stays as it was
        }
    }
}
