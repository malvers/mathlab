package de.docalvers.docfit;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Blood glucose readings of one person, newest first, kept on the phone like the blood pressure (Pressures): key
 * "glucoses" (Doc) or "glucoses2" (the second person) - the same slots as Profile. Typed in by hand (Doc, 21.11.2026).
 *
 * Doc's meter shows mmol/L, he thinks in mg/dL, so DocFit always shows both (1 mmol/L = 18.016 mg/dL). Stored is ONE
 * canonical number: mg/dL as a whole number ("mgdl") - what the web's docfit_glucose maps to. A value typed in mmol/L
 * with one decimal survives the round trip: 0.1 mmol/L is 1.8 mg/dL, the rounding to whole mg/dL moves it by at most
 * 0.03 mmol/L, so it is shown again exactly as typed. Each entry: {"time" (ms), "mgdl" (int), "context" (a stable key:
 * "fasting", "before_meal", "after_meal_2h", "other" - the German words only in the UI), "source" ("hand"; later a
 * meter), "note" (only where one was typed)} - the format agreed with the web's sync (21.11.2026).
 * Pure parts (parse / format / unit detection / check / category / the two-unit text) are tested in GlucosesTest.
 */
final class Glucoses {
    static final double MG_PER_MMOL = 18.016;
    /** below this a typed number is taken as mmol/L, from here on as mg/dL */
    static final double MMOL_BELOW = 35;
    static final double MMOL_MIN = 1.0, MMOL_MAX = 35;
    static final int MGDL_MIN = 18, MGDL_MAX = 630;
    static final String MMOL = "mmol", MGDL = "mgdl", HAND = "hand";
    static final int NOTE_MAX = 200;

    /** When it was measured - the chips of the entry (Doc, 21.11.2026), with the words shown. */
    static final String[] CONTEXTS = {"fasting", "before_meal", "after_meal_2h", "other"};
    static final String[] CONTEXT_WORDS = {"nüchtern", "vor dem Essen", "nach dem Essen (2 h)", "sonstige"};

    static final class Reading {
        final long time;
        final int mgdl;
        final String context, source, note;

        Reading(long time, int mgdl, String context, String source, String note) {
            this.time = time;
            this.mgdl = mgdl;
            this.context = contextIndex(context) >= 0 ? context : "other";
            this.source = source == null || source.isEmpty() ? HAND : source;
            this.note = note == null ? "" : note.trim();
        }

        double mmol() {
            return mgdl / MG_PER_MMOL;
        }
    }

    static int contextIndex(String context) {
        for (int i = 0; i < CONTEXTS.length; i++) if (CONTEXTS[i].equals(context)) return i;
        return -1;
    }

    /** The unit a typed number most likely is in: below 35 mmol/L, else mg/dL. */
    static String detectUnit(double typed) {
        return typed < MMOL_BELOW ? MMOL : MGDL;
    }

    /** A typed number in its unit as canonical whole mg/dL. */
    static int toMgdl(double typed, String unit) {
        return (int) Math.round(MMOL.equals(unit) ? typed * MG_PER_MMOL : typed);
    }

    /**
     * The typed number checked: null when all is well, else one clear German sentence. Not a number arrives as NaN.
     */
    static String check(double typed, String unit) {
        if (Double.isNaN(typed)) return "Bitte einen Wert eintragen, z. B. 5,6 (mmol/L) oder 101 (mg/dL).";
        if (MMOL.equals(unit) && (typed < MMOL_MIN || typed > MMOL_MAX)) {
            return "In mmol/L zwischen 1,0 und 35,0.";
        }
        if (MGDL.equals(unit) && (typed < MGDL_MIN || typed > MGDL_MAX)) {
            return "In mg/dL zwischen " + MGDL_MIN + " und " + MGDL_MAX + ".";
        }
        return null;
    }

    /** A typed text as a number: comma or point as decimal mark; NaN when it is none. */
    static double parse(CharSequence typed) {
        String s = typed == null ? "" : typed.toString().trim().replace(',', '.');
        if (s.isEmpty()) return Double.NaN;
        try {
            return Double.parseDouble(s);
        } catch (NumberFormatException e) {
            return Double.NaN;
        }
    }

    /** Both units, always: "5,6 mmol/L · 101 mg/dL". */
    static String both(int mgdl) {
        return String.format(Locale.GERMANY, "%.1f mmol/L · %d mg/dL", mgdl / MG_PER_MMOL, mgdl);
    }

    /** How a reading is read: by context only - fasting and two hours after a meal have limits, the others none. */
    enum Category { NORMAL, RAISED, HIGH, NONE }

    /**
     * Fasting: below 100 mg/dL normal, 100-125 raised, from 126 high; two hours after a meal: below 140 normal, 140-199
     * raised, from 200 high (the usual cut-offs of the German diabetes guideline and the ADA). Other contexts: none.
     */
    static Category category(int mgdl, String context) {
        if ("fasting".equals(context)) return mgdl < 100 ? Category.NORMAL : mgdl < 126 ? Category.RAISED : Category.HIGH;
        if ("after_meal_2h".equals(context)) return mgdl < 140 ? Category.NORMAL : mgdl < 200 ? Category.RAISED : Category.HIGH;
        return Category.NONE;
    }

    private static final String PREFS = "docfit", KEY = "glucoses";
    private final SharedPreferences prefs;
    private final String key;
    private final List<Reading> list = new ArrayList<>();

    Glucoses(Context context, String slot) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        key = KEY + slot;
        list.addAll(parseList(prefs.getString(key, null)));
    }

    /** The stored text as readings, newest first; a row that cannot be read is skipped, never the whole list. */
    static List<Reading> parseList(String json) {
        List<Reading> out = new ArrayList<>();
        if (json == null || json.isEmpty()) return out;
        JSONArray a;
        try {
            a = new JSONArray(json);
        } catch (JSONException e) {
            return out;
        }
        for (int i = 0; i < a.length(); i++) {
            try {
                JSONObject o = a.getJSONObject(i);
                out.add(new Reading(o.getLong("time"), o.getInt("mgdl"), o.optString("context", "other"),
                        o.optString("source", HAND), o.optString("note", "")));
            } catch (JSONException e) {
                // skip this row only
            }
        }
        return out;
    }

    static String format(List<Reading> rows) throws JSONException {
        JSONArray a = new JSONArray();
        for (Reading r : rows) {
            JSONObject o = new JSONObject().put("time", r.time).put("mgdl", r.mgdl).put("context", r.context)
                    .put("source", r.source);
            if (!r.note.isEmpty()) o.put("note", r.note);
            a.put(o);
        }
        return a.toString();
    }

    /** Where a reading goes in a list kept newest first. */
    static int indexFor(List<Reading> newestFirst, long time) {
        int i = 0;
        while (i < newestFirst.size() && newestFirst.get(i).time > time) i++;
        return i;
    }

    int size() {
        return list.size();
    }

    Reading get(int i) {
        return list.get(i);
    }

    /** Puts a reading in its place by time; returns that place. */
    int add(Reading r) {
        int i = indexFor(list, r.time);
        insert(i, r);
        return i;
    }

    void insert(int i, Reading r) {
        list.add(Math.max(0, Math.min(i, list.size())), r);
        save();
    }

    Reading remove(int i) {
        Reading r = list.remove(i);
        save();
        return r;
    }

    private void save() {
        try {
            prefs.edit().putString(key, format(list)).apply();
        } catch (JSONException e) {
            // keep the last good list rather than write a broken one
        }
    }
}
