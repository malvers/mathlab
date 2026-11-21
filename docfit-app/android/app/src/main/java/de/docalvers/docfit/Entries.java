package de.docalvers.docfit;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * The list of stopped times (Doc: "die Zeit soll dann in eine Liste eingetragen werden mit Datum und Uhrzeit"):
 * newest first, kept on the phone in the app's own preferences, so it outlives a restart. Nothing leaves the phone.
 *
 * Each time carries its exercise (Doc, 20.11.2026: two "Rubriken" on the stopwatch tab, "Planks" and "Two Balls"):
 * the one chosen when the time is stopped. Times stored before have none and stay as they are; a time without an
 * exercise is written exactly as before (no "kind" key). Reading and writing are pure (parse / format), tested in
 * EntriesTest.
 */
final class Entries {
    /** The exercises to choose from on the stopwatch tab, in their order there; the first is the default. */
    static final String[] KINDS = {"Planks", "Two Balls"};

    static final class Entry {
        final long start, duration;   // start: wall clock in ms; duration in ms
        /** the exercise ("Planks", "Two Balls"), "" for a time stored before there were any */
        final String kind;

        Entry(long start, long duration) {
            this(start, duration, "");
        }

        Entry(long start, long duration, String kind) {
            this.start = start;
            this.duration = duration;
            this.kind = kind == null ? "" : kind;
        }
    }

    private static final String PREFS = "docfit", KEY = "entries";
    private final SharedPreferences prefs;
    private final List<Entry> list = new ArrayList<>();

    Entries(Context context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        list.addAll(parse(prefs.getString(KEY, "[]")));
    }

    /** The stored text as entries, newest first; a broken list reads as empty rather than crash the stopwatch. */
    static List<Entry> parse(String json) {
        List<Entry> out = new ArrayList<>();
        try {
            JSONArray a = new JSONArray(json);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                out.add(new Entry(o.getLong("start"), o.getLong("duration"), o.optString("kind", "")));
            }
        } catch (JSONException e) {
            out.clear();
        }
        return out;
    }

    /** The entries as stored; "kind" only where there is one, so an old time is written exactly as before. */
    static String format(List<Entry> entries) throws JSONException {
        JSONArray a = new JSONArray();
        for (Entry e : entries) {
            JSONObject o = new JSONObject().put("start", e.start).put("duration", e.duration);
            if (!e.kind.isEmpty()) o.put("kind", e.kind);
            a.put(o);
        }
        return a.toString();
    }

    /** The remembered choice if it is still one of KINDS, else the first. */
    static String kindOrDefault(String saved) {
        for (String k : KINDS) if (k.equals(saved)) return k;
        return KINDS[0];
    }

    int size() {
        return list.size();
    }

    Entry get(int i) {
        return list.get(i);
    }

    void addNewest(Entry e) {
        insert(0, e);
    }

    void insert(int i, Entry e) {
        list.add(Math.max(0, Math.min(i, list.size())), e);
        save();
    }

    Entry remove(int i) {
        Entry e = list.remove(i);
        save();
        return e;
    }

    private void save() {
        try {
            prefs.edit().putString(KEY, format(list)).apply();
        } catch (JSONException e) {
            // keep the last good list rather than write a broken one
        }
    }
}
