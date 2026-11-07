package de.docalvers.docmitschrift;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Doc's lessons as recording windows (Doc, 06.11.2026: "am Anfang jeder Stunde eine Minute vorher ...
 * soll bitte die Aufzeichnung automatisch starten"). The Mac builds them from the Untis copy - one minute
 * before a lesson to two minutes after it, short breaks recorded through, break duty left out - and puts
 * them encrypted on the bridge (bruecke.mjs); Bruecke.fetchPlan stores them here as files/plan.json.
 */
final class Plan {
    static final class Fenster {
        final long von, bis;
        final String name;

        Fenster(long von, long bis, String name) {
            this.von = von;
            this.bis = bis;
            this.name = name;
        }
    }

    private Plan() {
    }

    private static File file(Context c) {
        return new File(c.getFilesDir(), "plan.json");
    }

    /** Is there a timetable at all? Without one the app records from Start to Stopp, as before. */
    static boolean exists(Context c) {
        return file(c).exists();
    }

    static List<Fenster> load(Context c) {
        List<Fenster> out = new ArrayList<>();
        File f = file(c);
        if (!f.exists()) return out;
        try {
            JSONArray a = new JSONObject(new String(Bruecke.read(f), StandardCharsets.UTF_8)).getJSONArray("fenster");
            for (int i = 0; i < a.length(); i++) {
                JSONObject w = a.getJSONObject(i);
                out.add(new Fenster(w.getLong("von"), w.getLong("bis"), w.optString("name", "")));
            }
        } catch (Exception e) {
            Log.w(AufnahmeService.TAG, "plan.json unreadable", e);
        }
        Collections.sort(out, (x, y) -> Long.compare(x.von, y.von));
        return out;
    }

    /** Stores a new timetable; true when it differs from the one before. */
    static boolean store(Context c, String json) {
        try {
            new JSONObject(json).getJSONArray("fenster");       // only a readable plan replaces the old one
            File f = file(c);
            byte[] now = json.getBytes(StandardCharsets.UTF_8);
            if (f.exists() && java.util.Arrays.equals(Bruecke.read(f), now)) return false;
            File tmp = new File(c.getFilesDir(), "plan.json.tmp");
            try (FileOutputStream o = new FileOutputStream(tmp)) {
                o.write(now);
            }
            return tmp.renameTo(f);
        } catch (Exception e) {
            Log.w(AufnahmeService.TAG, "plan not stored", e);
            return false;
        }
    }

    static Fenster current(List<Fenster> plan, long now) {
        for (Fenster w : plan) if (w.von <= now && now < w.bis) return w;
        return null;
    }

    static Fenster next(List<Fenster> plan, long now) {
        for (Fenster w : plan) if (w.von > now) return w;
        return null;
    }
}
