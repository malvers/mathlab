package de.docalvers.docfit;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

/**
 * Fasts recorded in DocFit (Doc, 21.11.2026: "Fastenmodus") - a fast is a TIME RANGE [start, end), end open while it
 * runs. Every measurement inside it (weighings, blood pressure, glucose, girths, runs) belongs to it by its time alone,
 * no tagging - so editing start or end later moves measurements in or out by themselves. The historic fasts from the
 * workbook (web/fasting/private) stay as they are; these are the new ones.
 *
 * Kept per person like the readings: key "fasts" (Doc) or "fasts2" (the second person). The JSON, agreed with the web's
 * sync (21.11.2026): [{"id": a UUID string (never changes, also when start moves), "start": ms, "end": ms or null
 * (running), "plannedDays": int or null, "note": only where one was typed}], newest start first.
 * The pure parts (parse / format / day / banner / safety) are tested in FastsTest.
 */
final class Fasts {
    static final int NOTE_MAX = 200;
    /** the hint limits during a fast (agreed with the web, 21.11.2026): red below, orange below */
    static final int SYS_RED = 90, SYS_ORANGE = 100, GLU_RED = 60, GLU_ORANGE = 70;

    static final class Fast {
        final String id;
        final long start;
        /** 0 = still running */
        final long end;
        /** 0 = no plan */
        final int plannedDays;
        final String note;

        Fast(String id, long start, long end, int plannedDays, String note) {
            this.id = id == null || id.isEmpty() ? UUID.randomUUID().toString() : id;
            this.start = start;
            this.end = end;
            this.plannedDays = Math.max(0, plannedDays);
            this.note = note == null ? "" : note.trim();
        }

        boolean open() {
            return end == 0;
        }

        /** whether a moment belongs to this fast: from its start up to (not including) its end, or up to now */
        boolean contains(long t) {
            return t >= start && (end == 0 || t < end);
        }

        Fast withEnd(long e) {
            return new Fast(id, start, e, plannedDays, note);
        }
    }

    /** The day of the fast a moment falls on: the calendar day of the start is day 1. */
    static int dayOf(Fast f, long t, TimeZone tz) {
        return (int) Math.round((midnight(t, tz) - midnight(f.start, tz)) / 86_400_000.0) + 1;
    }

    /** Whole hours since the start (up to the end, or up to now while it runs). */
    static long hours(Fast f, long now) {
        long upTo = f.end == 0 ? now : f.end;
        return Math.max(0, (upTo - f.start) / 3_600_000L);
    }

    /** The banner on top while a fast runs: "Fasten · Tag 3 von 5 · 62 h" (without a plan: "Fasten · Tag 3 · 62 h"). */
    static String banner(Fast f, long now, TimeZone tz) {
        int day = dayOf(f, now, tz);
        return "Fasten · Tag " + day + (f.plannedDays > 0 ? " von " + f.plannedDays : "") + " · " + hours(f, now) + " h";
    }

    enum Level { NONE, ORANGE, RED }

    /**
     * A hint, not a diagnosis: the newest systolic value and glucose (mg/dL) during the fast, 0 = none. Red below 90
     * mmHg or 60 mg/dL, orange below 100 mmHg or 70 mg/dL.
     */
    static Level safety(int sys, int glucoseMgdl) {
        if ((sys > 0 && sys < SYS_RED) || (glucoseMgdl > 0 && glucoseMgdl < GLU_RED)) return Level.RED;
        if ((sys > 0 && sys < SYS_ORANGE) || (glucoseMgdl > 0 && glucoseMgdl < GLU_ORANGE)) return Level.ORANGE;
        return Level.NONE;
    }

    static long midnight(long t, TimeZone tz) {
        Calendar c = Calendar.getInstance(tz, Locale.GERMANY);
        c.setTimeInMillis(t);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTimeInMillis();
    }

    // ---------- storage ----------

    private static final String PREFS = "docfit", KEY = "fasts";
    private final SharedPreferences prefs;
    private final String key;
    private final List<Fast> list = new ArrayList<>();

    Fasts(Context context, String slot) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        key = KEY + slot;
        list.addAll(parse(prefs.getString(key, null)));
    }

    /** The stored text as fasts, newest start first; a row that cannot be read is skipped, never the whole list. */
    static List<Fast> parse(String json) {
        List<Fast> out = new ArrayList<>();
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
                long end = o.isNull("end") ? 0 : o.optLong("end", 0);
                int planned = o.isNull("plannedDays") ? 0 : o.optInt("plannedDays", 0);
                out.add(new Fast(o.getString("id"), o.getLong("start"), end, planned, o.optString("note", "")));
            } catch (JSONException e) {
                // skip this row only
            }
        }
        out.sort((x, y) -> Long.compare(y.start, x.start));
        return out;
    }

    static String format(List<Fast> rows) throws JSONException {
        JSONArray a = new JSONArray();
        for (Fast f : rows) {
            JSONObject o = new JSONObject().put("id", f.id).put("start", f.start)
                    .put("end", f.end == 0 ? JSONObject.NULL : f.end)
                    .put("plannedDays", f.plannedDays == 0 ? JSONObject.NULL : f.plannedDays);
            if (!f.note.isEmpty()) o.put("note", f.note);
            a.put(o);
        }
        return a.toString();
    }

    List<Fast> all() {
        return new ArrayList<>(list);
    }

    int size() {
        return list.size();
    }

    /** The running fast, null if none. */
    Fast active() {
        for (Fast f : list) if (f.open()) return f;
        return null;
    }

    /** The newest fast (running or not), null if none. */
    Fast newest() {
        return list.isEmpty() ? null : list.get(0);
    }

    void put(Fast f) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).id.equals(f.id)) {
                list.remove(i);
                break;
            }
        }
        list.add(f);
        list.sort((x, y) -> Long.compare(y.start, x.start));
        save();
    }

    void remove(String id) {
        list.removeIf(f -> f.id.equals(id));
        save();
    }

    private void save() {
        try {
            prefs.edit().putString(key, format(list)).apply();
        } catch (JSONException e) {
            // keep the last good list rather than write a broken one
        }
    }
}
