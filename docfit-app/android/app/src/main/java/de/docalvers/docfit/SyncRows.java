package de.docalvers.docfit;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * DocFit's data as rows of its private Supabase tables (supabase/migrations/20261121_docfit.sql) and back - "DocFit
 * im Web = identisch zum Phone" (Doc, 20.11.2026). Pure Java, no Android, tested in SyncRowsTest.
 *
 * A row is one weigh-in, one stopped time, one blood-pressure reading or one person's profile, keyed the way the app
 * keys them: by the moment in ms (weigh-ins, readings, times) or by the person (0 = Doc, 1 = the second person - the
 * app's slots "" and "2"). Its fields are kept sorted by name, so two rows are the same exactly when their canonical
 * text is. The app's own lists in its preferences stay the truth on the phone (offline first); SyncPlan compares them
 * with what was synced last and decides what to send and what to take over.
 *
 * Only what the app stores travels: weight in 10 g, resistance (0 = not measured; an old 65535 goes as 0), waist and
 * hip in mm (none = null), the exercise of a time exactly as the app names it, a reading's pulse (0 = none = null),
 * source and note. Body values are computed when shown, on the phone and on the web alike.
 *
 * A set of a counted exercise (Bells, Legs - 20261126_docfit_run_reps.sql) is a docfit_run row with duration 0 and
 * its repetitions, weight and move; a time has all three null. The weight travels as kg (numeric) but is held in the
 * row in hundredths of a kilogram (a Long like every other number here), so rows stay exact and comparable. Columns
 * added after the first sync (LATE) are left out of the canonical text while empty: every row synced before keeps its
 * text and is not sent again.
 */
final class SyncRows {
    static final String PROFILE = "docfit_profile", WEIGHING = "docfit_weighing", RUN = "docfit_run", BP = "docfit_bp";
    static final String GLUCOSE = "docfit_glucose", FAST = "docfit_fast";
    /** the profiles first, so the web knows both people before their weigh-ins arrive */
    static final String[] TABLES = {PROFILE, WEIGHING, RUN, BP, GLUCOSE, FAST};
    /** person i lives in the app's preference slot SLOTS[i] (Profile, Weighings, Pressures) */
    static final String[] SLOTS = {"", "2"};

    private static final Map<String, String[]> COLUMNS = new LinkedHashMap<>();

    static {
        COLUMNS.put(PROFILE, new String[]{"person", "name", "height_cm", "birth_year", "sex", "active"});
        COLUMNS.put(WEIGHING, new String[]{"measured_at", "person", "centi_kg", "ohm", "waist_mm", "hip_mm"});
        COLUMNS.put(RUN, new String[]{"started_at", "duration_ms", "kind", "reps", "weight_kg", "move"});
        COLUMNS.put(BP, new String[]{"measured_at", "person", "sys", "dia", "pulse", "source", "note"});
        COLUMNS.put(GLUCOSE, new String[]{"measured_at", "person", "mg_dl", "context", "source", "note"});
        COLUMNS.put(FAST, new String[]{"fast_id", "person", "started_at", "ended_at", "planned_days", "note"});
    }

    /** Columns added after rows were synced (26.11.2026): out of the canonical text while null, see the class comment. */
    private static final Set<String> LATE = new HashSet<>(Arrays.asList("reps", "weight_kg", "move"));
    /** Columns sent as kg with decimals but held as hundredths (Long). */
    private static final Set<String> CENTI = new HashSet<>(Arrays.asList("weight_kg"));

    private SyncRows() {
    }

    static String[] columns(String table) {
        return COLUMNS.get(table);
    }

    /** The column that keys a row besides the account - the upsert's on_conflict is "user_id,<this>". */
    static String keyColumn(String table) {
        return columns(table)[0];
    }

    private static boolean isTime(String column) {
        return column.equals("measured_at") || column.equals("started_at") || column.equals("ended_at");
    }

    /** One row: its table, its key (ms or person as text), its fields sorted by name, and whether it is a tombstone. */
    static final class Row {
        final String table, key;
        final TreeMap<String, Object> f;   // values: Long, String, Boolean or null
        final boolean deleted;

        Row(String table, TreeMap<String, Object> f, boolean deleted) {
            this.table = table;
            this.f = f;
            this.deleted = deleted;
            Object k = f.get(keyColumn(table));
            this.key = k == null ? "" : String.valueOf(k);
        }

        long num(String column) {
            Object v = f.get(column);
            return v instanceof Long ? (Long) v : 0;
        }

        String str(String column) {
            Object v = f.get(column);
            return v instanceof String ? (String) v : null;
        }

        /** The canonical text: sorted keys, plain values - equal rows give equal texts. */
        String canon() {
            StringBuilder b = new StringBuilder("{");
            for (Map.Entry<String, Object> e : f.entrySet()) {
                Object v = e.getValue();
                if (v == null && LATE.contains(e.getKey())) continue;   // as before the column existed
                if (b.length() > 1) b.append(',');
                b.append(JSONObject.quote(e.getKey())).append(':');
                if (v == null) b.append("null");
                else if (v instanceof String) b.append(JSONObject.quote((String) v));
                else b.append(v);
            }
            return b.append('}').toString();
        }

        /** The row as PostgREST takes it: moments as ISO 8601, deleted_at null or the moment it was deleted. */
        JSONObject wire(Long deletedAtMs) throws JSONException {
            JSONObject o = new JSONObject();
            for (String c : columns(table)) {
                Object v = f.get(c);
                if (v != null && isTime(c)) v = iso((Long) v);
                else if (v != null && CENTI.contains(c)) v = (Long) v / 100.0;   // 250 -> 2.5 (kg)
                o.put(c, v == null ? JSONObject.NULL : v);
            }
            o.put("deleted_at", deletedAtMs == null ? JSONObject.NULL : iso(deletedAtMs));
            return o;
        }
    }

    /** A row from its fields (the order does not matter); unknown columns are left out. */
    static Row row(String table, boolean deleted, Object... pairs) {
        TreeMap<String, Object> f = new TreeMap<>();
        for (String c : columns(table)) f.put(c, null);
        for (int i = 0; i + 1 < pairs.length; i += 2) {
            String c = (String) pairs[i];
            if (!f.containsKey(c)) continue;
            Object v = pairs[i + 1];
            if (v instanceof Integer || v instanceof Short) v = ((Number) v).longValue();
            f.put(c, v);
        }
        return new Row(table, f, deleted);
    }

    /** A row as PostgREST sends it (also a tombstone: deleted_at not null). */
    static Row fromDb(String table, JSONObject o) {
        TreeMap<String, Object> f = new TreeMap<>();
        for (String c : columns(table)) {
            Object v = o.opt(c);
            if (v == null || v == JSONObject.NULL) {
                f.put(c, null);
            } else if (isTime(c)) {
                f.put(c, ms(String.valueOf(v)));
            } else if (CENTI.contains(c)) {
                f.put(c, centi(v));
            } else if (v instanceof Number) {
                f.put(c, ((Number) v).longValue());
            } else if (v instanceof Boolean) {
                f.put(c, v);
            } else {
                f.put(c, String.valueOf(v));
            }
        }
        return new Row(table, f, !o.isNull("deleted_at") && o.has("deleted_at"));
    }

    /** A row back from its canonical text (the synced state keeps rows that way). */
    static Row fromCanon(String table, String canon) throws JSONException {
        JSONObject o = new JSONObject(canon);
        TreeMap<String, Object> f = new TreeMap<>();
        for (String c : columns(table)) {
            Object v = o.opt(c);
            if (v == null || v == JSONObject.NULL) f.put(c, null);
            else if (v instanceof Number) f.put(c, ((Number) v).longValue());
            else if (v instanceof Boolean) f.put(c, v);
            else f.put(c, String.valueOf(v));
        }
        return new Row(table, f, false);
    }

    /** kg as the database sends it (a number, or numeric as text) -> hundredths; null when it is no number. */
    private static Long centi(Object kg) {
        try {
            double d = kg instanceof Number ? ((Number) kg).doubleValue() : Double.parseDouble(String.valueOf(kg));
            return Double.isNaN(d) ? null : Math.round(d * 100);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static String iso(long ms) {
        return Instant.ofEpochMilli(ms).toString();
    }

    /** "2026-11-21T07:12:00.123+00:00" (PostgREST) or "...Z" -> ms. */
    static long ms(String iso) {
        return OffsetDateTime.parse(iso).toInstant().toEpochMilli();
    }

    // ---- from the app's lists to rows ------------------------------------------------------------------------------

    /** The stopped times and counted sets (Entries' stored text) as rows of docfit_run; a time without reps/weight/move. */
    static void runs(String entriesJson, Map<String, Row> into) {
        for (Entries.Entry e : Entries.parse(entriesJson == null ? "[]" : entriesJson)) {
            Row r = row(RUN, false, "started_at", e.start, "duration_ms", e.duration, "kind", e.kind,
                    "reps", e.reps > 0 ? (Object) (long) e.reps : null,
                    "weight_kg", e.kg > 0 ? (Object) Math.round(e.kg * 100) : null,
                    "move", e.move.isEmpty() ? null : e.move);
            into.put(r.key, r);
        }
    }

    /** One person's weigh-ins (Weighings' stored text) as rows of docfit_weighing. */
    static void weighings(String json, int person, Map<String, Row> into) {
        for (Weighings.Weighing w : Weighings.parse(json).rows) {
            Row r = row(WEIGHING, false, "measured_at", w.time, "person", person, "centi_kg", w.centiKg,
                    "ohm", BodyComposition.isMeasured(w.ohm) ? w.ohm : 0,
                    "waist_mm", w.waistMm > 0 ? (Object) (long) w.waistMm : null,
                    "hip_mm", w.hipMm > 0 ? (Object) (long) w.hipMm : null);
            into.put(r.key, r);
        }
    }

    /**
     * One person's blood-pressure readings as rows of docfit_bp. Read straight from the stored text the app writes
     * (Pressures: {"time", "sys", "dia", "pulse" (0 = none), "source", "note" (only where typed)}), so this works with
     * any version of that class; a row that cannot be read is left out.
     */
    static void pressures(String json, int person, Map<String, Row> into) {
        if (json == null || json.trim().isEmpty()) return;
        JSONArray a;
        try {
            a = new JSONArray(json);
        } catch (JSONException e) {
            return;
        }
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o == null || !o.has("time") || !o.has("sys") || !o.has("dia")) continue;
            long pulse = o.optLong("pulse", 0);
            String note = o.optString("note", "").trim();
            String source = o.optString("source", "hand");
            Row r = row(BP, false, "measured_at", o.optLong("time"), "person", person, "sys", o.optLong("sys"),
                    "dia", o.optLong("dia"), "pulse", pulse > 0 ? (Object) pulse : null,
                    "source", source.isEmpty() ? "hand" : source.toLowerCase(java.util.Locale.ROOT),
                    "note", note.isEmpty() ? null : note);
            into.put(r.key, r);
        }
    }

    /**
     * One person's blood-glucose readings as rows of docfit_glucose (20261121c_docfit_glucose.sql), read straight from
     * the stored text like the blood pressure: {"time", "mgdl" (whole mg/dL, the one stored unit), "context" (as the
     * app names it), "source", "note" (only where typed)}.
     */
    static void glucoses(String json, int person, Map<String, Row> into) {
        if (json == null || json.trim().isEmpty()) return;
        JSONArray a;
        try {
            a = new JSONArray(json);
        } catch (JSONException e) {
            return;
        }
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o == null || !o.has("time") || !o.has("mgdl")) continue;
            String note = o.optString("note", "").trim();
            String source = o.optString("source", "hand");
            Row r = row(GLUCOSE, false, "measured_at", o.optLong("time"), "person", person, "mg_dl", o.optLong("mgdl"),
                    "context", o.optString("context", ""),
                    "source", source.isEmpty() ? "hand" : source.toLowerCase(java.util.Locale.ROOT),
                    "note", note.isEmpty() ? null : note);
            into.put(r.key, r);
        }
    }

    /**
     * One person's fasts (Fasts.java, preferences "fasts" / "fasts2") as rows of docfit_fast (20261121d_docfit_fast.sql):
     * {"id" (a UUID string), "start" (ms), "end" (ms; null = still running), "plannedDays" (null / 0 = none), "note"}.
     * Keyed by the id, so a corrected start keeps the fast what it is.
     */
    static void fasts(String json, int person, Map<String, Row> into) {
        if (json == null || json.trim().isEmpty()) return;
        JSONArray a;
        try {
            a = new JSONArray(json);
        } catch (JSONException e) {
            return;
        }
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o == null || !o.has("id") || !o.has("start")) continue;
            Object id = o.opt("id");
            String key = id instanceof Number ? String.valueOf(((Number) id).longValue()) : String.valueOf(id);
            long end = o.isNull("end") ? 0 : o.optLong("end", 0);
            long planned = o.isNull("plannedDays") ? 0 : o.optLong("plannedDays", 0);
            String note = o.optString("note", "").trim();
            Row r = row(FAST, false, "fast_id", key, "person", person, "started_at", o.optLong("start"),
                    "ended_at", end > 0 ? (Object) end : null, "planned_days", planned > 0 ? (Object) planned : null,
                    "note", note.isEmpty() ? null : note);
            into.put(r.key, r);
        }
    }

    /** One person's profile as a row of docfit_profile (0 / "" = not entered = null; Doc has no name). */
    static Row profile(int person, String name, int heightCm, int birthYear, String sex, boolean active) {
        String n = name == null ? "" : name.trim();
        return row(PROFILE, false, "person", person, "name", person == 0 || n.isEmpty() ? null : n,
                "height_cm", heightCm > 0 ? (Object) (long) heightCm : null,
                "birth_year", birthYear > 0 ? (Object) (long) birthYear : null,
                "sex", sex == null || sex.isEmpty() ? null : sex, "active", active);
    }

    /** Whether the database will take a row (its checks) - a row it would refuse is never sent, so it cannot block the rest. */
    static boolean valid(Row r) {
        switch (r.table) {
            case WEIGHING:
                return r.num("measured_at") > 0 && in(r, "person", 0, 9, false) && in(r, "centi_kg", 2000, 30000, false)
                        && (r.num("ohm") == 0 || in(r, "ohm", 150, 1500, false))
                        && in(r, "waist_mm", 500, 2000, true) && in(r, "hip_mm", 500, 2000, true);
            case RUN:
                return r.num("started_at") > 0 && in(r, "duration_ms", 0, 86_400_000L, false)
                        && r.str("kind") != null && r.str("kind").length() <= 30
                        && in(r, "reps", 0, Entries.MAX_REPS, true) && in(r, "weight_kg", 0, 30_000, true)
                        && (r.str("move") == null || r.str("move").length() <= 30);
            case BP:
                return r.num("measured_at") > 0 && in(r, "person", 0, 9, false) && in(r, "sys", 50, 260, false)
                        && in(r, "dia", 30, 160, false) && in(r, "pulse", 25, 220, true)
                        && Arrays.asList("hand", "omron", "excel").contains(r.str("source"))
                        && (r.str("note") == null || r.str("note").length() <= 200);
            case GLUCOSE:
                return r.num("measured_at") > 0 && in(r, "person", 0, 9, false) && in(r, "mg_dl", 10, 800, false)
                        && r.str("context") != null && r.str("context").length() <= 40
                        && Arrays.asList("hand", "meter", "excel").contains(r.str("source"))
                        && (r.str("note") == null || r.str("note").length() <= 200);
            case FAST: {
                String id = r.str("fast_id");
                Object end = r.f.get("ended_at");
                return id != null && id.length() >= 1 && id.length() <= 64 && in(r, "person", 0, 9, false)
                        && r.num("started_at") > 0 && (end == null || (Long) end >= r.num("started_at"))
                        && in(r, "planned_days", 1, 90, true) && (r.str("note") == null || r.str("note").length() <= 200);
            }
            case PROFILE:
                String n = r.str("name"), s = r.str("sex");
                return in(r, "person", 0, 9, false) && in(r, "height_cm", 100, 250, true)
                        && in(r, "birth_year", 1900, 2100, true) && (s == null || s.equals("m") || s.equals("w"))
                        && (n == null || (n.trim().length() >= 1 && n.trim().length() <= 40));
            default:
                return false;
        }
    }

    private static boolean in(Row r, String column, long min, long max, boolean nullable) {
        Object v = r.f.get(column);
        if (v == null) return nullable;
        long x = (Long) v;
        return x >= min && x <= max;
    }

    // ---- from rows back into the app's lists -----------------------------------------------------------------------

    /** Entries' stored text with rows put in (or replaced) and keys removed; newest first, as the app keeps it. */
    static String applyRuns(String entriesJson, Map<String, Row> put, Set<String> remove) throws JSONException {
        List<Entries.Entry> list = new ArrayList<>();
        for (Entries.Entry e : Entries.parse(entriesJson == null ? "[]" : entriesJson)) {
            String k = String.valueOf(e.start);
            if (!put.containsKey(k) && !remove.contains(k)) list.add(e);
        }
        for (Row r : put.values()) {   // a row from before the counted sets (no reps, weight, move) reads as a time
            list.add(new Entries.Entry(r.num("started_at"), r.num("duration_ms"), r.str("kind"), (int) r.num("reps"),
                    r.num("weight_kg") / 100.0, r.str("move")));
        }
        Collections.sort(list, (a, b) -> Long.compare(b.start, a.start));
        return Entries.format(list);
    }

    /**
     * Both people's weigh-ins with rows put in (each into the list of its person - a weigh-in moved to the other person
     * changes lists) and keys removed. Returns null when a list could not be read completely: then nothing is written
     * over it (the app keeps such a text aside; it must never be cut short by a sync).
     */
    static String[] applyWeighings(String[] perSlot, Map<String, Row> put, Set<String> remove) throws JSONException {
        List<List<Weighings.Weighing>> lists = new ArrayList<>();
        for (String json : perSlot) {
            Weighings.Parsed p = Weighings.parse(json);
            if (!p.complete()) return null;
            List<Weighings.Weighing> l = new ArrayList<>();
            for (Weighings.Weighing w : p.rows) {
                String k = String.valueOf(w.time);
                if (!put.containsKey(k) && !remove.contains(k)) l.add(w);
            }
            lists.add(l);
        }
        for (Row r : put.values()) {
            int person = (int) r.num("person");
            if (person < 0 || person >= lists.size()) continue;   // a person this phone does not know
            Weighings.Weighing w = new Weighings.Weighing(r.num("measured_at"), (int) r.num("centi_kg"),
                    (int) r.num("ohm"), (int) r.num("waist_mm"), (int) r.num("hip_mm"));
            List<Weighings.Weighing> l = lists.get(person);
            l.add(Weighings.indexFor(l, w.time), w);
        }
        String[] out = new String[perSlot.length];
        for (int i = 0; i < out.length; i++) out[i] = Weighings.format(lists.get(i));
        return out;
    }

    /** Both people's readings with rows put in and keys removed; a row of the app's own is kept as it is stored. */
    static String[] applyPressures(String[] perSlot, Map<String, Row> put, Set<String> remove) throws JSONException {
        List<List<JSONObject>> lists = new ArrayList<>();
        for (String json : perSlot) {
            List<JSONObject> l = new ArrayList<>();
            JSONArray a = json == null || json.trim().isEmpty() ? new JSONArray() : new JSONArray(json);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.optJSONObject(i);
                if (o == null) continue;
                String k = String.valueOf(o.optLong("time"));
                if (!put.containsKey(k) && !remove.contains(k)) l.add(o);
            }
            lists.add(l);
        }
        for (Row r : put.values()) {
            int person = (int) r.num("person");
            if (person < 0 || person >= lists.size()) continue;
            JSONObject o = new JSONObject().put("time", r.num("measured_at")).put("sys", r.num("sys"))
                    .put("dia", r.num("dia")).put("pulse", r.num("pulse"))
                    .put("source", r.str("source") == null ? "hand" : r.str("source"));
            if (r.str("note") != null && !r.str("note").isEmpty()) o.put("note", r.str("note"));
            lists.get(person).add(o);
        }
        String[] out = new String[perSlot.length];
        for (int i = 0; i < out.length; i++) {
            List<JSONObject> l = lists.get(i);
            Collections.sort(l, (a, b) -> Long.compare(b.optLong("time"), a.optLong("time")));
            JSONArray a = new JSONArray();
            for (JSONObject o : l) a.put(o);
            out[i] = a.toString();
        }
        return out;
    }

    /** Both people's glucose readings with rows put in and keys removed; a row of the app's own is kept as it is stored. */
    static String[] applyGlucoses(String[] perSlot, Map<String, Row> put, Set<String> remove) throws JSONException {
        List<List<JSONObject>> lists = new ArrayList<>();
        for (String json : perSlot) {
            List<JSONObject> l = new ArrayList<>();
            JSONArray a = json == null || json.trim().isEmpty() ? new JSONArray() : new JSONArray(json);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.optJSONObject(i);
                if (o == null) continue;
                String k = String.valueOf(o.optLong("time"));
                if (!put.containsKey(k) && !remove.contains(k)) l.add(o);
            }
            lists.add(l);
        }
        for (Row r : put.values()) {
            int person = (int) r.num("person");
            if (person < 0 || person >= lists.size()) continue;
            JSONObject o = new JSONObject().put("time", r.num("measured_at")).put("mgdl", r.num("mg_dl"))
                    .put("context", r.str("context") == null ? "" : r.str("context"))
                    .put("source", r.str("source") == null ? "hand" : r.str("source"));
            if (r.str("note") != null && !r.str("note").isEmpty()) o.put("note", r.str("note"));
            lists.get(person).add(o);
        }
        String[] out = new String[perSlot.length];
        for (int i = 0; i < out.length; i++) {
            List<JSONObject> l = lists.get(i);
            Collections.sort(l, (a, b) -> Long.compare(b.optLong("time"), a.optLong("time")));
            JSONArray a = new JSONArray();
            for (JSONObject o : l) a.put(o);
            out[i] = a.toString();
        }
        return out;
    }

    /**
     * Both people's fasts with rows put in and keys removed; a fast of the app's own is kept as it is stored. Written in
     * Fasts.format's shape: the id as text (a UUID), "end" and "plannedDays" null when open / without a plan.
     */
    static String[] applyFasts(String[] perSlot, Map<String, Row> put, Set<String> remove) throws JSONException {
        List<List<JSONObject>> lists = new ArrayList<>();
        for (String json : perSlot) {
            List<JSONObject> l = new ArrayList<>();
            JSONArray a = json == null || json.trim().isEmpty() ? new JSONArray() : new JSONArray(json);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.optJSONObject(i);
                if (o == null) continue;
                Object id = o.opt("id");
                String k = id instanceof Number ? String.valueOf(((Number) id).longValue()) : String.valueOf(id);
                if (!put.containsKey(k) && !remove.contains(k)) l.add(o);
            }
            lists.add(l);
        }
        for (Row r : put.values()) {
            int person = (int) r.num("person");
            if (person < 0 || person >= lists.size()) continue;
            JSONObject o = new JSONObject().put("id", r.str("fast_id")).put("start", r.num("started_at"))
                    .put("end", r.f.get("ended_at") == null ? JSONObject.NULL : (Object) r.num("ended_at"))
                    .put("plannedDays", r.f.get("planned_days") == null ? JSONObject.NULL : (Object) r.num("planned_days"));
            if (r.str("note") != null && !r.str("note").isEmpty()) o.put("note", r.str("note"));
            lists.get(person).add(o);
        }
        String[] out = new String[perSlot.length];
        for (int i = 0; i < out.length; i++) {
            List<JSONObject> l = lists.get(i);
            Collections.sort(l, (a, b) -> Long.compare(b.optLong("start"), a.optLong("start")));
            JSONArray a = new JSONArray();
            for (JSONObject o : l) a.put(o);
            out[i] = a.toString();
        }
        return out;
    }

    /** The keys of a set of rows. */
    static Set<String> keys(Iterable<Row> rows) {
        Set<String> s = new HashSet<>();
        for (Row r : rows) s.add(r.key);
        return s;
    }
}
