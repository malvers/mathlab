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
 */
final class Entries {
    static final class Entry {
        final long start, duration;   // start: wall clock in ms; duration in ms

        Entry(long start, long duration) {
            this.start = start;
            this.duration = duration;
        }
    }

    private static final String PREFS = "docfit", KEY = "entries";
    private final SharedPreferences prefs;
    private final List<Entry> list = new ArrayList<>();

    Entries(Context context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        try {
            JSONArray a = new JSONArray(prefs.getString(KEY, "[]"));
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                list.add(new Entry(o.getLong("start"), o.getLong("duration")));
            }
        } catch (JSONException e) {
            // a broken list starts empty rather than crash the stopwatch
        }
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
        JSONArray a = new JSONArray();
        try {
            for (Entry e : list) a.put(new JSONObject().put("start", e.start).put("duration", e.duration));
        } catch (JSONException e) {
            return;
        }
        prefs.edit().putString(KEY, a.toString()).apply();
    }
}
