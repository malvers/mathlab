package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Blood pressure (Pressures): the input check, the ESH categories at their borders, storing and reading, and where a
 * reading typed in later goes in the list. Made-up readings - nobody's real values.
 */
public class PressuresTest {
    private static final long T = 1_795_000_000_000L, HOUR = 3_600_000L;

    @Test
    public void checkSaysWhatIsWrong() {
        assertNull(Pressures.check(125, 82, 64));
        assertNull(Pressures.check(70, 40, 30));
        assertNull(Pressures.check(250, 150, 220));
        assertTrue(Pressures.check(69, 50, 60).startsWith("Systolisch"));
        assertTrue(Pressures.check(251, 90, 60).startsWith("Systolisch"));
        assertTrue(Pressures.check(-1, 80, 60).startsWith("Systolisch"));      // empty or not a number
        assertTrue(Pressures.check(120, 39, 60).startsWith("Diastolisch"));
        assertTrue(Pressures.check(160, 151, 60).startsWith("Diastolisch"));
        assertTrue(Pressures.check(100, 100, 60).contains("höher"));            // sys must be above dia
        assertTrue(Pressures.check(120, 80, 29).startsWith("Puls"));
        assertTrue(Pressures.check(120, 80, 0).startsWith("Puls"));
        assertTrue(Pressures.check(120, 80, 221).startsWith("Puls"));
    }

    @Test
    public void eshCategoriesTheHigherOfBothCounts() {
        assertEquals(Pressures.Category.OPTIMAL, Pressures.category(119, 79));
        assertEquals(Pressures.Category.NORMAL, Pressures.category(120, 70));
        assertEquals(Pressures.Category.NORMAL, Pressures.category(110, 84));
        assertEquals(Pressures.Category.HIGH_NORMAL, Pressures.category(130, 75));
        assertEquals(Pressures.Category.HIGH_NORMAL, Pressures.category(125, 89));
        assertEquals(Pressures.Category.GRADE_1, Pressures.category(140, 80));
        assertEquals(Pressures.Category.GRADE_1, Pressures.category(120, 90));
        assertEquals(Pressures.Category.GRADE_2, Pressures.category(160, 85));
        assertEquals(Pressures.Category.GRADE_2, Pressures.category(130, 100));
        assertEquals(Pressures.Category.GRADE_3, Pressures.category(180, 90));
        assertEquals(Pressures.Category.GRADE_3, Pressures.category(150, 110));
    }

    @Test
    public void readingsSurviveSavingAndReading() throws Exception {
        List<Pressures.Reading> rows = new ArrayList<>();
        rows.add(new Pressures.Reading(T + HOUR, 128, 84, 66, Pressures.HAND, "  nach dem Kaffee "));
        rows.add(new Pressures.Reading(T, 121, 79, 0, Pressures.OMRON, ""));
        String saved = Pressures.format(rows);
        List<Pressures.Reading> back = Pressures.parse(saved);
        assertEquals(2, back.size());
        assertEquals(128, back.get(0).sys);
        assertEquals(84, back.get(0).dia);
        assertEquals(66, back.get(0).pulse);
        assertEquals("hand", back.get(0).source);
        assertEquals("nach dem Kaffee", back.get(0).note);
        assertEquals("omron", back.get(1).source);
        assertEquals(0, back.get(1).pulse);
        JSONArray a = new JSONArray(saved);
        assertFalse(a.getJSONObject(1).has("note"));                       // only where one was typed
        assertTrue(a.getJSONObject(0).has("time") && a.getJSONObject(0).has("sys") && a.getJSONObject(0).has("dia"));
    }

    @Test
    public void brokenRowsCostOnlyThemselves() {
        List<Pressures.Reading> l = Pressures.parse("[{\"time\":1,\"sys\":120,\"dia\":80},{\"sys\":5},{\"time\":2,\"sys\":130,\"dia\":85,\"pulse\":70}]");
        assertEquals(2, l.size());
        assertEquals("hand", l.get(0).source);                              // no source: typed in
        assertTrue(Pressures.parse("kaputt").isEmpty());
        assertTrue(Pressures.parse(null).isEmpty());
    }

    @Test
    public void aLaterEntryForAnEarlierMomentGoesInByTime() {
        List<Pressures.Reading> l = new ArrayList<>();
        l.add(new Pressures.Reading(T + 3 * HOUR, 120, 80, 60, Pressures.HAND, ""));
        l.add(new Pressures.Reading(T + HOUR, 120, 80, 60, Pressures.HAND, ""));
        assertEquals(0, Pressures.indexFor(l, T + 4 * HOUR));
        assertEquals(1, Pressures.indexFor(l, T + 2 * HOUR));
        assertEquals(2, Pressures.indexFor(l, T));
    }
}
