package de.docalvers.docruf;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** The last calls and the settings, in the app's own preferences. Newest call first. */
final class Rufe {
    static final int MAX = 30;

    private Rufe() {
    }

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("docruf", Context.MODE_PRIVATE);
    }

    static boolean speak(Context c) {
        return prefs(c).getBoolean("ansagen", true);
    }

    static void setSpeak(Context c, boolean on) {
        prefs(c).edit().putBoolean("ansagen", on).apply();
    }

    static synchronized JSONArray all(Context c) {
        try {
            return new JSONArray(prefs(c).getString("rufe", "[]"));
        } catch (JSONException e) {
            return new JSONArray();
        }
    }

    static synchronized boolean has(Context c, String id) {
        JSONArray a = all(c);
        for (int i = 0; i < a.length(); i++) {
            if (id.equals(a.optJSONObject(i).optString("id"))) return true;
        }
        return false;
    }

    static synchronized void add(Context c, String id, long time, String title, String text, String audio) {
        JSONArray a = all(c);
        JSONArray b = new JSONArray();
        try {
            b.put(new JSONObject().put("id", id).put("time", time).put("title", title).put("text", text).put("audio", audio));
        } catch (JSONException e) {
            return;
        }
        for (int i = 0; i < a.length() && b.length() < MAX; i++) b.put(a.opt(i));
        prefs(c).edit().putString("rufe", b.toString()).apply();
    }

    static synchronized void acked(Context c, String id) {
        JSONArray a = all(c);
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (id.equals(o.optString("id"))) {
                try {
                    o.put("ok", true);
                } catch (JSONException ignored) {
                }
            }
        }
        prefs(c).edit().putString("rufe", a.toString()).apply();
    }
}
