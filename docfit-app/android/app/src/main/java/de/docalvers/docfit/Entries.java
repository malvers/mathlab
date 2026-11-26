package de.docalvers.docfit;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * The list of stopped times (Doc: "die Zeit soll dann in eine Liste eingetragen werden mit Datum und Uhrzeit"):
 * newest first, kept on the phone in the app's own preferences, so it outlives a restart. Nothing leaves the phone.
 *
 * Each time carries its exercise (Doc, 20.11.2026: two "Rubriken" on the stopwatch tab, "Planks" and "Two Balls"):
 * the one chosen when the time is stopped. Times stored before have none and stay as they are; a time without an
 * exercise is written exactly as before (no "kind" key). Reading and writing are pure (parse / format), tested in
 * EntriesTest.
 *
 * Counted exercises (Doc, 26.11.2026: "Bei Dumbbells und Legs müssen wir Repeats zählen. Nicht die Zeit." - "Klar
 * brauchen wir auch das Gewicht."): an entry of such an exercise is one set - its repetitions, the weight (for
 * dumbbells the weight of ONE dumbbell, 0 = without) and the move ("Curls", "Lateral Raises"), duration 0. The keys
 * "reps", "kg" and "move" are written only when set, so every timed entry is stored exactly as before.
 */
final class Entries {
    /**
     * The exercises to choose from on the stopwatch tab, in their order there; the first is the default. "Dumbbells"
     * (Kurzhanteln) and "Legs" added on 26.11.2026, and "Two Balls" became plain "Balls" (Doc).
     */
    static final String[] KINDS = {"Planks", "Balls", "Dumbbells", "Legs"};

    /** The exercises counted in repetitions instead of timed (Doc, 26.11.2026); all others are timed. */
    private static final List<String> COUNTED = Arrays.asList("Dumbbells", "Legs");

    /**
     * The moves (Übungsart) of a counted exercise, in the order of their chips - the ONE place for their names (Doc may
     * rename them; entries stored under an old name keep it). Dumbbells: pulling the weights up to the chest (biceps
     * curl) and pushing them out sideways to horizontal. Legs has none yet: one line here adds them.
     */
    private static final Map<String, String[]> MOVES = new LinkedHashMap<>();

    static {
        MOVES.put("Dumbbells", new String[]{"Curls", "Lateral Raises"});
        MOVES.put("Legs", new String[]{});
    }

    /** The highest count and weight the app takes (as the database's checks: reps 0..1000, weight_kg 0..300). */
    static final int MAX_REPS = 1000;
    static final double MAX_KG = 300;

    /** An exercise under its current name: "Two Balls" is "Balls" since 26.11.2026. */
    static String renamed(String kind) {
        return "Two Balls".equals(kind) ? "Balls" : kind;
    }

    /** Whether an exercise counts repetitions (Dumbbells, Legs) rather than time. */
    static boolean counted(String kind) {
        return COUNTED.contains(kind);
    }

    /** The moves of an exercise, in their order; none for a timed one (or a counted one without moves yet). */
    static String[] moves(String kind) {
        String[] m = MOVES.get(kind);
        return m == null ? new String[0] : m.clone();
    }

    /** Whether {@code move} is one of the exercise's moves. */
    static boolean hasMove(String kind, String move) {
        return Arrays.asList(moves(kind)).contains(move);
    }

    /** The remembered move if the exercise still has it, else its first; "" for an exercise without moves. */
    static String moveOrDefault(String kind, String saved) {
        String[] m = moves(kind);
        if (m.length == 0) return "";
        return hasMove(kind, saved) ? saved : m[0];
    }

    static final class Entry {
        final long start, duration;   // start: wall clock in ms; duration in ms (0 for a counted set)
        /** the exercise ("Planks", "Balls", ...), "" for a time stored before there were any */
        final String kind;
        /** a counted set: its repetitions (0 = a timed entry), its weight in kg (0 = without) and its move ("" = none) */
        final int reps;
        final double kg;
        final String move;

        Entry(long start, long duration) {
            this(start, duration, "");
        }

        Entry(long start, long duration, String kind) {
            this(start, duration, kind, 0, 0, "");
        }

        Entry(long start, long duration, String kind, int reps, double kg, String move) {
            this.start = start;
            this.duration = duration;
            this.kind = kind == null ? "" : renamed(kind);
            this.reps = Math.max(0, Math.min(reps, MAX_REPS));
            this.kg = Double.isNaN(kg) || kg <= 0 ? 0 : Math.min(roundKg(kg), MAX_KG);
            this.move = move == null ? "" : move.trim();
        }

        /** A set of a counted exercise (repetitions), not a time. */
        boolean isCounted() {
            return reps > 0;
        }
    }

    /** A weight to 10 g, so 2.5 stays 2.5 and the sum of steps does not drift. */
    static double roundKg(double kg) {
        return Math.round(kg * 100) / 100.0;
    }

    /** A weight as a number with the decimal comma, no zeros at the end: "5", "2,5", "2,25". */
    static String kgNumber(double kg) {
        double r = roundKg(kg);
        return r == Math.rint(r) ? String.valueOf((long) r)
                : String.format(Locale.GERMANY, "%.2f", r).replaceAll("0+$", "");
    }

    /** A weight as the lists show it: "5 kg", "2,5 kg", "2,25 kg". */
    static String kgText(double kg) {
        return kgNumber(kg) + " kg";
    }

    /** A typed weight ("2,5", "2.5", "5 kg"): its kg, 0 when empty (= without), -1 when it is no weight the app takes. */
    static double parseKg(String typed) {
        String s = typed == null ? "" : typed.trim().replace(',', '.').replaceAll("(?i)\\s*kg$", "");
        if (s.isEmpty()) return 0;
        try {
            double kg = Double.parseDouble(s);
            return Double.isNaN(kg) || kg < 0 || kg > MAX_KG ? -1 : roundKg(kg);
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    /** The label of the weight on the stopwatch tab: for dumbbells the weight of ONE dumbbell (Doc, 26.11.2026). */
    static String weightLabel(String kind) {
        return "Dumbbells".equals(kind) ? "GEWICHT JE HANTEL" : "GEWICHT";
    }

    /** A set in short: "12 ×" and, with a weight, "12 × 5 kg". */
    static String setText(Entry e) {
        return e.reps + " ×" + (e.kg > 0 ? " " + kgText(e.kg) : "");
    }

    private static final String PREFS = "docfit", KEY = "entries";
    private final SharedPreferences prefs;
    private final List<Entry> list = new ArrayList<>();

    Entries(Context context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String stored = prefs.getString(KEY, "[]");
        list.addAll(parse(stored));
        if (stored.contains("\"Two Balls\"")) save();   // written once under the new name, so the server follows
    }

    /** The stored text as entries, newest first; a broken list reads as empty rather than crash the stopwatch. */
    static List<Entry> parse(String json) {
        List<Entry> out = new ArrayList<>();
        try {
            JSONArray a = new JSONArray(json);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                out.add(new Entry(o.getLong("start"), o.getLong("duration"), o.optString("kind", ""),
                        o.optInt("reps", 0), o.optDouble("kg", 0), o.optString("move", "")));
            }
        } catch (JSONException e) {
            out.clear();
        }
        return out;
    }

    /**
     * The entries as stored; "kind" only where there is one, "reps", "kg" and "move" only for a counted set - so an old
     * time is written exactly as before.
     */
    static String format(List<Entry> entries) throws JSONException {
        JSONArray a = new JSONArray();
        for (Entry e : entries) {
            JSONObject o = new JSONObject().put("start", e.start).put("duration", e.duration);
            if (!e.kind.isEmpty()) o.put("kind", e.kind);
            if (e.reps > 0) o.put("reps", e.reps);
            if (e.kg > 0) o.put("kg", e.kg);
            if (!e.move.isEmpty()) o.put("move", e.move);
            a.put(o);
        }
        return a.toString();
    }

    /** The remembered choice if it is still one of KINDS, else the first. */
    static String kindOrDefault(String saved) {
        saved = renamed(saved);
        for (String k : KINDS) if (k.equals(saved)) return k;
        return KINDS[0];
    }

    /**
     * Where an entry may be moved by the exercise chips: a time only to a timed exercise, a set only to a counted one
     * (a time has no repetitions, a set no time).
     */
    static boolean canMove(Entry e, String kind) {
        return e.isCounted() == counted(kind);
    }

    /** The newest set of an exercise and move in a list (newest first), null without one - the default for the next. */
    static Entry lastSet(List<Entry> newestFirst, String kind, String move) {
        for (Entry e : newestFirst) {
            if (e.isCounted() && e.kind.equals(kind) && e.move.equals(move == null ? "" : move)) return e;
        }
        return null;
    }

    int size() {
        return list.size();
    }

    Entry get(int i) {
        return list.get(i);
    }

    /** All entries, newest first (a copy). */
    List<Entry> all() {
        return new ArrayList<>(list);
    }

    void addNewest(Entry e) {
        insert(0, e);
    }

    void insert(int i, Entry e) {
        list.add(Math.max(0, Math.min(i, list.size())), e);
        save();
    }

    /** Puts another version of a time in its place - e.g. the same time moved to another exercise. */
    void replace(int i, Entry e) {
        list.set(i, e);
        save();
    }

    /** Where the time that started at {@code start} stands; -1 when it is not (or no longer) there. */
    int indexOf(long start) {
        for (int i = 0; i < list.size(); i++) if (list.get(i).start == start) return i;
        return -1;
    }

    /**
     * The same entry under another exercise (Doc, 26.11.2026: a time stored as "Planks" was "Two Balls"): duration,
     * repetitions and weight go along; the move too, if the other exercise has it (a "Curls" set moved to Legs drops it).
     */
    static Entry withKind(Entry e, String kind) {
        String move = hasMove(kind, e.move) ? e.move : "";
        return new Entry(e.start, e.duration, kind, e.reps, e.kg, move);
    }

    /** The same set as another move ("Curls" -> "Lateral Raises"). */
    static Entry withMove(Entry e, String move) {
        return new Entry(e.start, e.duration, e.kind, e.reps, e.kg, move);
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
