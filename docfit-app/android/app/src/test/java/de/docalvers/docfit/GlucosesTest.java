package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Blood glucose (Glucoses): the unit found from the number, mg/dL as the one stored number and the lossless way back to
 * mmol/L with one decimal, the input check, both units in one line, the categories by context, storing and reading.
 * Made-up readings - nobody's real values.
 */
public class GlucosesTest {
    private static final long T = 1_795_000_000_000L;

    @Test
    public void unitFromTheNumber() {
        assertEquals(Glucoses.MMOL, Glucoses.detectUnit(5.6));
        assertEquals(Glucoses.MMOL, Glucoses.detectUnit(34.9));
        assertEquals(Glucoses.MGDL, Glucoses.detectUnit(35));
        assertEquals(Glucoses.MGDL, Glucoses.detectUnit(101));
        assertEquals(5.6, Glucoses.parse("5,6"), 1e-9);
        assertEquals(5.6, Glucoses.parse(" 5.6 "), 1e-9);
        assertTrue(Double.isNaN(Glucoses.parse("")));
        assertTrue(Double.isNaN(Glucoses.parse("5,6,1")));
    }

    @Test
    public void mgdlStoredMmolComesBackAsTyped() {
        assertEquals(101, Glucoses.toMgdl(5.6, Glucoses.MMOL));        // 5.6 x 18.016 = 100.89
        assertEquals(101, Glucoses.toMgdl(101, Glucoses.MGDL));
        // every one-decimal mmol/L value from 1.0 to 35.0 is shown again exactly as typed
        for (int tenth = 10; tenth <= 350; tenth++) {
            int mg = Glucoses.toMgdl(tenth / 10.0, Glucoses.MMOL);
            assertEquals(tenth, Math.round(mg / Glucoses.MG_PER_MMOL * 10));
        }
        assertEquals("5,6 mmol/L · 101 mg/dL", Glucoses.both(101));
        assertEquals("7,0 mmol/L · 126 mg/dL", Glucoses.both(126));
    }

    @Test
    public void checkSaysWhatIsWrong() {
        assertNull(Glucoses.check(5.6, Glucoses.MMOL));
        assertNull(Glucoses.check(1.0, Glucoses.MMOL));
        assertNull(Glucoses.check(35, Glucoses.MMOL));
        assertNull(Glucoses.check(18, Glucoses.MGDL));
        assertNull(Glucoses.check(630, Glucoses.MGDL));
        assertTrue(Glucoses.check(0.9, Glucoses.MMOL).contains("mmol/L"));
        assertTrue(Glucoses.check(35.1, Glucoses.MMOL).contains("mmol/L"));
        assertTrue(Glucoses.check(17, Glucoses.MGDL).contains("mg/dL"));
        assertTrue(Glucoses.check(631, Glucoses.MGDL).contains("mg/dL"));
        assertTrue(Glucoses.check(Double.NaN, Glucoses.MMOL).startsWith("Bitte"));
    }

    @Test
    public void categoriesByContext() {
        assertEquals(Glucoses.Category.NORMAL, Glucoses.category(99, "fasting"));
        assertEquals(Glucoses.Category.RAISED, Glucoses.category(100, "fasting"));
        assertEquals(Glucoses.Category.RAISED, Glucoses.category(125, "fasting"));
        assertEquals(Glucoses.Category.HIGH, Glucoses.category(126, "fasting"));
        assertEquals(Glucoses.Category.NORMAL, Glucoses.category(139, "after_meal_2h"));
        assertEquals(Glucoses.Category.RAISED, Glucoses.category(140, "after_meal_2h"));
        assertEquals(Glucoses.Category.RAISED, Glucoses.category(199, "after_meal_2h"));
        assertEquals(Glucoses.Category.HIGH, Glucoses.category(200, "after_meal_2h"));
        assertEquals(Glucoses.Category.NONE, Glucoses.category(180, "before_meal"));
        assertEquals(Glucoses.Category.NONE, Glucoses.category(180, "other"));
    }

    @Test
    public void readingsSurviveSavingAndReadingInTheAgreedFields() throws Exception {
        List<Glucoses.Reading> rows = new ArrayList<>();
        rows.add(new Glucoses.Reading(T + 60_000, 101, "fasting", Glucoses.HAND, " vor dem Laufen "));
        rows.add(new Glucoses.Reading(T, 142, "after_meal_2h", Glucoses.HAND, ""));
        String saved = Glucoses.format(rows);
        List<Glucoses.Reading> back = Glucoses.parseList(saved);
        assertEquals(2, back.size());
        assertEquals(101, back.get(0).mgdl);
        assertEquals("fasting", back.get(0).context);
        assertEquals("vor dem Laufen", back.get(0).note);
        assertEquals("after_meal_2h", back.get(1).context);
        JSONArray a = new JSONArray(saved);
        JSONObject first = a.getJSONObject(0), second = a.getJSONObject(1);
        assertEquals(5, first.length());                                     // time, mgdl, context, source, note
        assertEquals(4, second.length());                                    // no note: no "note"
        assertFalse(second.has("note"));
        assertEquals("hand", first.getString("source"));
        assertEquals(T + 60_000, first.getLong("time"));
    }

    @Test
    public void unknownContextAndBrokenRows() {
        List<Glucoses.Reading> l = Glucoses.parseList("[{\"time\":1,\"mgdl\":90,\"context\":\"lunch\"},{\"mgdl\":5},"
                + "{\"time\":2,\"mgdl\":95}]");
        assertEquals(2, l.size());
        assertEquals("other", l.get(0).context);                             // an unknown key counts as "sonstige"
        assertEquals("other", l.get(1).context);
        assertTrue(Glucoses.parseList("kaputt").isEmpty());
        assertEquals(4, Glucoses.CONTEXTS.length);
        assertEquals(Glucoses.CONTEXTS.length, Glucoses.CONTEXT_WORDS.length);
    }
}
