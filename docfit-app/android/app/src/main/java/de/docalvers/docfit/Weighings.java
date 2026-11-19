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
 * Only what the scale measured is stored - the moment, the weight and the resistance between the feet. Fat, water,
 * muscle and BMI are computed when shown (BodyComposition) from the profile, so a profile entered or corrected later
 * also fixes the old weigh-ins.
 */
final class Weighings {
    /**
     * One weigh-in: wall clock in ms, weight in units of 10 g, resistance in ohms (0 = not measured; rows saved before
     * 19.11.2026 may hold the scale's 65535 instead, which counts as not measured as well).
     */
    static final class Weighing {
        final long time;
        final int centiKg, ohm;

        Weighing(long time, int centiKg, int ohm) {
            this.time = time;
            this.centiKg = centiKg;
            this.ohm = ohm;
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
    private final SharedPreferences prefs;
    private final List<Weighing> list = new ArrayList<>();

    Weighings(Context context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        try {
            JSONArray a = new JSONArray(prefs.getString(KEY, "[]"));
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                list.add(new Weighing(o.getLong("time"), o.getInt("centiKg"), o.optInt("ohm", 0)));
            }
        } catch (JSONException e) {
            // a broken list starts empty rather than crash the app
        }
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
                ? new Weighing(last.time, last.centiKg, next.ohm) : null;
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

    private void save() {
        JSONArray a = new JSONArray();
        try {
            for (Weighing w : list) {
                a.put(new JSONObject().put("time", w.time).put("centiKg", w.centiKg).put("ohm", w.ohm));
            }
        } catch (JSONException e) {
            return;
        }
        prefs.edit().putString(KEY, a.toString()).apply();
    }
}
