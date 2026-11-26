package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * How the stopped times are stored (Entries.parse / format): the list saved before there were exercises reads as it
 * is, the exercise travels along, a time without one is written exactly as before, a broken list reads as empty.
 * Made-up times - no one's real data.
 */
public class EntriesTest {
    private static final long T1 = 1_795_000_000_000L, T2 = T1 + 86_400_000L;

    /** The text exactly as the app wrote it before 20.11.2026: newest first. */
    private static final String OLD = "[{\"start\":" + T2 + ",\"duration\":59000},{\"start\":" + T1 + ",\"duration\":4000}]";

    @Test
    public void oldListReadsAsItIs() {
        List<Entries.Entry> l = Entries.parse(OLD);
        assertEquals(2, l.size());
        assertEquals(T2, l.get(0).start);
        assertEquals(59000, l.get(0).duration);
        assertEquals(T1, l.get(1).start);
        for (Entries.Entry e : l) assertEquals("", e.kind);
    }

    @Test
    public void oldTimesAreWrittenAsBefore() throws Exception {
        JSONArray a = new JSONArray(Entries.format(Entries.parse(OLD)));
        assertEquals(2, a.length());
        for (int i = 0; i < a.length(); i++) {
            assertEquals(2, a.getJSONObject(i).length());          // start and duration, no "kind"
            assertFalse(a.getJSONObject(i).has("kind"));
        }
        assertEquals(T2, a.getJSONObject(0).getLong("start"));
        assertEquals(59000, a.getJSONObject(0).getLong("duration"));
    }

    @Test
    public void exercisesSurviveSavingAndReading() throws Exception {
        List<Entries.Entry> l = new ArrayList<>(Entries.parse(OLD));
        l.add(0, new Entries.Entry(T2 + 3_600_000L, 90_500L, "Two Balls"));
        l.add(0, new Entries.Entry(T2 + 7_200_000L, 61_000L, "Planks"));
        String saved = Entries.format(l);
        List<Entries.Entry> back = Entries.parse(saved);
        assertEquals(4, back.size());
        assertEquals("Planks", back.get(0).kind);
        assertEquals(61_000L, back.get(0).duration);
        assertEquals("Balls", back.get(1).kind);   // stored as "Two Balls", read under the new name
        assertEquals("", back.get(2).kind);    // the old ones stay without
        assertEquals("", back.get(3).kind);
        JSONArray a = new JSONArray(saved);
        assertEquals("Planks", a.getJSONObject(0).getString("kind"));
        assertFalse(a.getJSONObject(2).has("kind"));
        assertFalse(a.getJSONObject(3).has("kind"));
    }

    @Test
    public void brokenListReadsAsEmpty() {
        assertTrue(Entries.parse("[{\"start\":1,").isEmpty());
        assertTrue(Entries.parse("").isEmpty());
        assertTrue(Entries.parse("[]").isEmpty());
    }

    @Test
    public void rememberedChoiceOrTheFirst() {
        assertEquals("Planks", Entries.KINDS[0]);
        assertEquals("Balls", Entries.kindOrDefault("Two Balls"));
        assertEquals("Legs", Entries.kindOrDefault("Legs"));
        assertEquals("Planks", Entries.kindOrDefault("Planks"));
        assertEquals("Planks", Entries.kindOrDefault(null));
        assertEquals("Planks", Entries.kindOrDefault("Liegestütz"));   // a name that is gone
        assertEquals("", new Entries.Entry(1, 2).kind);
        assertEquals("", new Entries.Entry(1, 2, null).kind);
    }

    @Test
    public void aTimeMovesToAnotherExercise() {
        Entries.Entry e = new Entries.Entry(1_795_000_000_000L, 57_857L, "Planks");
        Entries.Entry moved = Entries.withKind(e, "Balls");
        assertEquals(e.start, moved.start);
        assertEquals(e.duration, moved.duration);
        assertEquals("Balls", moved.kind);
        assertEquals("Planks", e.kind);   // the old version stays as it was (for "Rückgängig")
    }

    // ---- counted exercises (26.11.2026): sets with repetitions, weight and move -----------------------------------

    @Test
    public void countedExercisesAndTheirMoves() {
        assertFalse(Entries.counted("Planks"));
        assertFalse(Entries.counted("Balls"));
        assertTrue(Entries.counted("Dumbbells"));
        assertTrue(Entries.counted("Legs"));
        assertFalse(Entries.counted(""));
        assertEquals(2, Entries.moves("Dumbbells").length);
        assertEquals("Curls", Entries.moves("Dumbbells")[0]);
        assertEquals(0, Entries.moves("Legs").length);      // none yet
        assertEquals(0, Entries.moves("Planks").length);
        assertEquals("Curls", Entries.moveOrDefault("Dumbbells", null));
        assertEquals("Lateral Raises", Entries.moveOrDefault("Dumbbells", "Lateral Raises"));
        assertEquals("Curls", Entries.moveOrDefault("Dumbbells", "Kniebeuge"));   // a move that is gone
        assertEquals("", Entries.moveOrDefault("Legs", "Curls"));
        Entries.moves("Dumbbells")[0] = "changed";                  // a copy: the names stay in one place
        assertEquals("Curls", Entries.moves("Dumbbells")[0]);
    }

    @Test
    public void setsSurviveSavingAndReadingAndTimesStayAsBefore() throws Exception {
        List<Entries.Entry> l = new ArrayList<>(Entries.parse(OLD));
        l.add(0, new Entries.Entry(T2 + 60_000L, 47_000L, "Planks"));
        l.add(0, new Entries.Entry(T2 + 120_000L, 0, "Dumbbells", 12, 2.5, "Curls"));
        l.add(0, new Entries.Entry(T2 + 180_000L, 0, "Legs", 15, 0, ""));
        String saved = Entries.format(l);
        List<Entries.Entry> back = Entries.parse(saved);
        assertEquals(5, back.size());
        Entries.Entry legs = back.get(0), curls = back.get(1), planks = back.get(2);
        assertTrue(legs.isCounted());
        assertEquals(15, legs.reps);
        assertEquals(0, legs.kg, 0);
        assertEquals("", legs.move);
        assertEquals(12, curls.reps);
        assertEquals(2.5, curls.kg, 0);
        assertEquals("Curls", curls.move);
        assertEquals("Dumbbells", curls.kind);
        assertEquals(0, curls.duration);
        assertFalse(planks.isCounted());
        assertEquals(47_000L, planks.duration);
        JSONArray a = new JSONArray(saved);
        assertFalse(a.getJSONObject(0).has("kg"));     // without weight: no "kg"
        assertFalse(a.getJSONObject(0).has("move"));   // without move: no "move"
        assertEquals(12, a.getJSONObject(1).getInt("reps"));
        assertEquals("Curls", a.getJSONObject(1).getString("move"));
        // a time keeps exactly its keys, the old ones theirs
        assertEquals(3, a.getJSONObject(2).length());
        assertFalse(a.getJSONObject(2).has("reps"));
        assertEquals(2, a.getJSONObject(3).length());
        assertEquals(2, a.getJSONObject(4).length());
    }

    @Test
    public void anOldListIsWrittenBackUnchanged() throws Exception {
        // the same keys and values as the text from before (the key order is the JSON library's - on the phone the
        // order of writing), and writing it again gives the same text
        JSONArray before = new JSONArray(OLD), after = new JSONArray(Entries.format(Entries.parse(OLD)));
        assertEquals(before.length(), after.length());
        for (int i = 0; i < before.length(); i++) {
            assertEquals(before.getJSONObject(i).length(), after.getJSONObject(i).length());
            assertEquals(before.getJSONObject(i).getLong("start"), after.getJSONObject(i).getLong("start"));
            assertEquals(before.getJSONObject(i).getLong("duration"), after.getJSONObject(i).getLong("duration"));
        }
        String once = Entries.format(Entries.parse(OLD));
        assertEquals(once, Entries.format(Entries.parse(once)));
    }

    @Test
    public void weightsAsShownAndTyped() {
        assertEquals("5 kg", Entries.kgText(5));
        assertEquals("2,5 kg", Entries.kgText(2.5));
        assertEquals("2,25 kg", Entries.kgText(2.25));
        assertEquals("12 × 5 kg", Entries.setText(new Entries.Entry(T1, 0, "Dumbbells", 12, 5, "Curls")));
        assertEquals("15 ×", Entries.setText(new Entries.Entry(T1, 0, "Legs", 15, 0, "")));
        assertEquals(2.5, Entries.parseKg("2,5"), 0);
        assertEquals(2.5, Entries.parseKg(" 2.5 kg"), 0);
        assertEquals(0, Entries.parseKg(""), 0);           // empty = without weight
        assertEquals(-1, Entries.parseKg("zwei"), 0);
        assertEquals(-1, Entries.parseKg("301"), 0);       // more than the app takes
        assertEquals(-1, Entries.parseKg("-1"), 0);
        // stored values are kept in range
        Entries.Entry e = new Entries.Entry(T1, 0, "Legs", 5000, 1000, null);
        assertEquals(Entries.MAX_REPS, e.reps);
        assertEquals(Entries.MAX_KG, e.kg, 0);
        assertEquals("", e.move);
        assertEquals(0, new Entries.Entry(T1, 0, "Legs", -3, Double.NaN, "").kg, 0);
        assertEquals(0.3, new Entries.Entry(T1, 0, "Legs", 1, 0.1 + 0.2, "").kg, 0);   // no float noise
        assertEquals("GEWICHT JE HANTEL", Entries.weightLabel("Dumbbells"));
        assertEquals("GEWICHT", Entries.weightLabel("Legs"));
    }

    @Test
    public void timesMoveAmongTimedSetsAmongCounted() {
        Entries.Entry time = new Entries.Entry(T1, 57_857L, "Planks");
        Entries.Entry set = new Entries.Entry(T2, 0, "Dumbbells", 12, 5, "Curls");
        assertTrue(Entries.canMove(time, "Balls"));
        assertFalse(Entries.canMove(time, "Dumbbells"));
        assertTrue(Entries.canMove(set, "Legs"));
        assertFalse(Entries.canMove(set, "Planks"));
        // a time stored under Dumbbells before it counted may still go to a timed exercise
        assertTrue(Entries.canMove(new Entries.Entry(T1, 30_000L, "Dumbbells"), "Planks"));
        Entries.Entry legs = Entries.withKind(set, "Legs");
        assertEquals(12, legs.reps);
        assertEquals(5, legs.kg, 0);
        assertEquals(0, legs.duration);
        assertEquals("", legs.move);                     // Legs has no "Curls"
        assertEquals("Curls", set.move);                 // the old version stays (for "Rückgängig")
        Entries.Entry raised = Entries.withMove(set, "Lateral Raises");
        assertEquals("Lateral Raises", raised.move);
        assertEquals(12, raised.reps);
        assertEquals(set.start, raised.start);
        assertEquals("Curls", Entries.withKind(set, "Dumbbells").move);
    }

    @Test
    public void theLastSetOfAnExerciseAndMove() {
        List<Entries.Entry> newestFirst = new ArrayList<>();
        newestFirst.add(new Entries.Entry(T2 + 2, 0, "Dumbbells", 10, 4, "Lateral Raises"));
        newestFirst.add(new Entries.Entry(T2 + 1, 61_000L, "Planks"));
        newestFirst.add(new Entries.Entry(T2, 0, "Dumbbells", 12, 6, "Curls"));
        newestFirst.add(new Entries.Entry(T1, 0, "Dumbbells", 8, 5, "Curls"));
        assertEquals(12, Entries.lastSet(newestFirst, "Dumbbells", "Curls").reps);
        assertEquals(4, Entries.lastSet(newestFirst, "Dumbbells", "Lateral Raises").kg, 0);
        assertEquals(null, Entries.lastSet(newestFirst, "Legs", ""));
    }
}
