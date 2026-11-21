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
        assertEquals("Two Balls", back.get(1).kind);
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
        assertEquals("Two Balls", Entries.kindOrDefault("Two Balls"));
        assertEquals("Planks", Entries.kindOrDefault("Planks"));
        assertEquals("Planks", Entries.kindOrDefault(null));
        assertEquals("Planks", Entries.kindOrDefault("Liegestütz"));   // a name that is gone
        assertEquals("", new Entries.Entry(1, 2).kind);
        assertEquals("", new Entries.Entry(1, 2, null).kind);
    }
}
