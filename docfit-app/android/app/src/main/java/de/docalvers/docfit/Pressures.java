package de.docalvers.docfit;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Blood pressure readings of one person, newest first, kept on the phone like the weigh-ins (Weighings): in the app's
 * own preferences, key "pressures" (Doc) or "pressures2" (the second person) - the same slots as Profile.
 *
 * Typed in by hand (Doc, 21.11.2026: for when the Omron does not send, or in Spain without it), or sent by the Omron
 * M400 Intelli IT over Bluetooth with source "omron" (BpLink, Bpm; Doc, 24.11.2026). The stored fields follow the web's table
 * docfit_bp (supabase/migrations/20261121_docfit.sql): {"time" (= measured_at, ms), "sys", "dia" (mmHg), "pulse"
 * (bpm, 0 = none), "source" ("hand" / "omron"), "note" (only where one was typed)}.
 * Reading, writing, the input check and the ESH category are pure (parse / format / check / category), tested in
 * PressuresTest.
 */
final class Pressures {
    static final String HAND = "hand", OMRON = "omron";
    /** the input check (Doc, 21.11.2026) */
    static final int SYS_MIN = 70, SYS_MAX = 250, DIA_MIN = 40, DIA_MAX = 150, PULSE_MIN = 30, PULSE_MAX = 220;
    static final int NOTE_MAX = 200;

    static final class Reading {
        final long time;
        final int sys, dia, pulse;
        final String source, note;

        Reading(long time, int sys, int dia, int pulse, String source, String note) {
            this.time = time;
            this.sys = sys;
            this.dia = dia;
            this.pulse = Math.max(0, pulse);
            this.source = source == null || source.isEmpty() ? HAND : source;
            this.note = note == null ? "" : note.trim();
        }
    }

    /**
     * The categories of the European Society of Hypertension (ESH 2023, office values; the same cut-offs as ESH/ESC
     * 2018): the higher of the systolic and the diastolic category counts.
     */
    enum Category {
        OPTIMAL("optimal"), NORMAL("normal"), HIGH_NORMAL("hoch-normal"), GRADE_1("Hypertonie Grad 1"),
        GRADE_2("Hypertonie Grad 2"), GRADE_3("Hypertonie Grad 3");

        final String word;

        Category(String word) {
            this.word = word;
        }
    }

    static Category category(int sys, int dia) {
        Category s = sys < 120 ? Category.OPTIMAL : sys < 130 ? Category.NORMAL : sys < 140 ? Category.HIGH_NORMAL
                : sys < 160 ? Category.GRADE_1 : sys < 180 ? Category.GRADE_2 : Category.GRADE_3;
        Category d = dia < 80 ? Category.OPTIMAL : dia < 85 ? Category.NORMAL : dia < 90 ? Category.HIGH_NORMAL
                : dia < 100 ? Category.GRADE_1 : dia < 110 ? Category.GRADE_2 : Category.GRADE_3;
        return s.ordinal() >= d.ordinal() ? s : d;
    }

    /**
     * The typed values checked: null when all is well, else one clear German sentence. A field left empty or not a
     * number arrives as -1 or 0.
     */
    static String check(int sys, int dia, int pulse) {
        if (sys < SYS_MIN || sys > SYS_MAX) return "Systolisch zwischen " + SYS_MIN + " und " + SYS_MAX + " mmHg.";
        if (dia < DIA_MIN || dia > DIA_MAX) return "Diastolisch zwischen " + DIA_MIN + " und " + DIA_MAX + " mmHg.";
        if (sys <= dia) return "Der systolische Wert muss höher sein als der diastolische.";
        if (pulse < PULSE_MIN || pulse > PULSE_MAX) return "Puls zwischen " + PULSE_MIN + " und " + PULSE_MAX + " pro Minute.";
        return null;
    }

    private static final String PREFS = "docfit", KEY = "pressures";
    private final SharedPreferences prefs;
    private final String key;
    private final List<Reading> list = new ArrayList<>();

    Pressures(Context context, String slot) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        key = KEY + slot;
        list.addAll(parse(prefs.getString(key, null)));
    }

    /** The stored text as readings, newest first; a row that cannot be read is skipped, never the whole list. */
    static List<Reading> parse(String json) {
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
                out.add(new Reading(o.getLong("time"), o.getInt("sys"), o.getInt("dia"), o.optInt("pulse", 0),
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
            JSONObject o = new JSONObject().put("time", r.time).put("sys", r.sys).put("dia", r.dia)
                    .put("pulse", r.pulse).put("source", r.source);
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

    /** True when this reading is already in the list - the Omron sent it again (Bpm.known). */
    boolean has(long time, int sys, int dia) {
        return Bpm.known(list, time, sys, dia);
    }

    /** Puts a reading in its place by time (a value typed in later for an earlier moment); returns that place. */
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
