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
 * How the weigh-ins are stored (Weighings.parse / format): the rows saved before 20.11.2026 read as they are, waist
 * and hip travel along, a row without them is written as before, a broken row costs only itself. Made-up values of the
 * test man (180 cm, born 1990, 85 kg) - never real data.
 */
public class WeighingsTest {
    private static final long T1 = 1_795_000_000_000L, T2 = T1 + 86_400_000L, T3 = T2 + 86_400_000L;

    /** The text exactly as the app wrote it before waist and hip existed: newest first. */
    private static final String OLD = "[{\"time\":" + T3 + ",\"centiKg\":8500,\"ohm\":512},"
            + "{\"time\":" + T2 + ",\"centiKg\":8520,\"ohm\":0},"
            + "{\"time\":" + T1 + ",\"centiKg\":8540,\"ohm\":65535}]";

    @Test
    public void oldListReadsAsItIs() {
        Weighings.Parsed p = Weighings.parse(OLD);
        assertTrue(p.complete());
        assertEquals(3, p.rows.size());
        Weighings.Weighing a = p.rows.get(0), b = p.rows.get(1), c = p.rows.get(2);
        assertEquals(T3, a.time);
        assertEquals(8500, a.centiKg);
        assertEquals(512, a.ohm);
        assertEquals(T2, b.time);
        assertEquals(0, b.ohm);
        assertEquals(65535, c.ohm);                          // kept as stored, counts as not measured
        assertFalse(c.hasResistance());
        for (Weighings.Weighing w : p.rows) {
            assertEquals(0, w.waistMm);
            assertEquals(0, w.hipMm);
            assertFalse(w.hasWaist());
            assertFalse(w.hasHip());
        }
    }

    @Test
    public void girthsSurviveSavingAndReading() throws Exception {
        List<Weighings.Weighing> rows = new ArrayList<>(Weighings.parse(OLD).rows);
        rows.set(0, rows.get(0).withGirths(905, 0));         // a waist only
        rows.set(1, rows.get(1).withGirths(910, 1000));      // waist and hip
        String saved = Weighings.format(rows);
        Weighings.Parsed back = Weighings.parse(saved);
        assertTrue(back.complete());
        assertEquals(3, back.rows.size());
        assertEquals(905, back.rows.get(0).waistMm);
        assertEquals(0, back.rows.get(0).hipMm);
        assertEquals(910, back.rows.get(1).waistMm);
        assertEquals(1000, back.rows.get(1).hipMm);
        assertEquals(0, back.rows.get(2).waistMm);
        for (int i = 0; i < 3; i++) {                        // nothing else changed
            assertEquals(rows.get(i).time, back.rows.get(i).time);
            assertEquals(rows.get(i).centiKg, back.rows.get(i).centiKg);
            assertEquals(rows.get(i).ohm, back.rows.get(i).ohm);
        }
        // rows without girths are written as before, so even the old app reads the list
        JSONArray a = new JSONArray(saved);
        JSONObject plain = a.getJSONObject(2);
        assertFalse(plain.has("waistMm"));
        assertFalse(plain.has("hipMm"));
        assertEquals(3, plain.length());
        assertFalse(a.getJSONObject(0).has("hipMm"));
        assertEquals(905, a.getJSONObject(0).getInt("waistMm"));
    }

    @Test
    public void takingAGirthAwayLeavesTheOldRow() throws Exception {
        Weighings.Weighing w = new Weighings.Weighing(T1, 8500, 512, 905, 1000).withGirths(0, 0);
        List<Weighings.Weighing> one = new ArrayList<>();
        one.add(w);
        assertEquals(3, new JSONArray(Weighings.format(one)).getJSONObject(0).length());
    }

    @Test
    public void aBrokenRowCostsOnlyItself() {
        String text = "[{\"time\":" + T3 + ",\"centiKg\":8500,\"ohm\":512,\"waistMm\":905},"
                + "{\"centiKg\":8520},"                                   // no time
                + "\"nonsense\","                                         // no object
                + "{\"time\":" + T1 + ",\"centiKg\":8540}]";              // no ohm: the very first rows
        Weighings.Parsed p = Weighings.parse(text);
        assertEquals(2, p.rows.size());
        assertEquals(2, p.skipped);
        assertFalse(p.complete());                                       // the app keeps the text before saving
        assertEquals(905, p.rows.get(0).waistMm);
        assertEquals(0, p.rows.get(1).ohm);
    }

    @Test
    public void nothingStoredAndUnreadableText() {
        assertTrue(Weighings.parse(null).complete());
        assertEquals(0, Weighings.parse(null).rows.size());
        assertTrue(Weighings.parse("").complete());
        Weighings.Parsed bad = Weighings.parse("{not a list");
        assertTrue(bad.unreadable);
        assertFalse(bad.complete());
        assertEquals(0, bad.rows.size());
    }

    @Test
    public void aRepeatKeepsTheGirthsOfTheRowItCompletes() {
        Weighings.Weighing weightOnly = new Weighings.Weighing(T1, 8500, 0, 905, 1000);
        Weighings.Weighing c = Weighings.completion(weightOnly, new Weighings.Weighing(T1 + 60_000, 8500, 512));
        assertEquals(512, c.ohm);
        assertEquals(905, c.waistMm);
        assertEquals(1000, c.hipMm);
        assertNull(Weighings.completion(c, new Weighings.Weighing(T1 + 90_000, 8500, 500)));
    }

    @Test
    public void theLastHipIsTheNewestOneEntered() {
        // Doc, 23.11.2026: the hip field starts with the last hip - taken from the list, nothing hardcoded
        assertEquals(0, Weighings.lastHipMm(new ArrayList<>()));
        assertEquals(0, Weighings.lastHipMm(Weighings.parse(OLD).rows));   // no hip anywhere yet
        List<Weighings.Weighing> rows = new ArrayList<>(Weighings.parse(OLD).rows);
        rows.set(2, rows.get(2).withGirths(915, 1010));      // the oldest one has a hip
        assertEquals(1010, Weighings.lastHipMm(rows));
        rows.set(1, rows.get(1).withGirths(910, 1005));      // a newer one too: it wins
        assertEquals(1005, Weighings.lastHipMm(rows));
        rows.set(0, rows.get(0).withGirths(905, 0));         // the newest has a waist only: the hip before it counts
        assertEquals(1005, Weighings.lastHipMm(rows));
    }

    @Test
    public void theHipFieldStartsWithItsOwnHipElseTheLastOne() {
        List<Weighings.Weighing> rows = new ArrayList<>(Weighings.parse(OLD).rows);
        rows.set(1, rows.get(1).withGirths(910, 1005));
        Weighings.Weighing newest = rows.get(0), withHip = rows.get(1), oldest = rows.get(2);
        assertEquals(1005, Weighings.hipForField(newest, rows));   // a new weigh-in: the last hip offered
        assertEquals(1005, Weighings.hipForField(oldest, rows));   // also for an older one without a hip
        Weighings.Weighing own = withHip.withGirths(910, 998);
        rows.set(1, own);
        assertEquals(998, Weighings.hipForField(own, rows));       // a hip of its own is never replaced
        // each person has her own list: nothing entered in it yet means an empty field
        List<Weighings.Weighing> other = new ArrayList<>();
        other.add(new Weighings.Weighing(T3, 6200, 540));
        assertEquals(0, Weighings.hipForField(other.get(0), other));
        assertEquals("", Girths.field(Weighings.hipForField(other.get(0), other)));
        assertEquals("99,8", Girths.field(Weighings.hipForField(newest, rows)));   // as it stands in the field
    }

    @Test
    public void aTapPicksTheWeighInTheCardShows() {
        // Doc, 23.11.2026: a short tap on a weigh-in shows its values on top; long press enters waist and hip
        List<Weighings.Weighing> rows = new ArrayList<>(Weighings.parse(OLD).rows);   // T3, T2, T1
        assertEquals(0, Weighings.shownIndex(rows, 0));                  // nothing picked: the newest
        long picked = Weighings.pickAfterTap(rows, 0, 2);                // tap on the oldest
        assertEquals(T1, picked);
        assertEquals(2, Weighings.shownIndex(rows, picked));
        picked = Weighings.pickAfterTap(rows, picked, 1);                // another row: that one
        assertEquals(T2, picked);
        assertEquals(1, Weighings.shownIndex(rows, picked));
        assertEquals(0, Weighings.pickAfterTap(rows, picked, 1));        // the picked one again: back to the newest
        assertEquals(0, Weighings.pickAfterTap(rows, picked, 0));        // the newest: back to the newest
        assertEquals(0, Weighings.pickAfterTap(rows, picked, 3));        // no such row
        assertEquals(0, Weighings.pickAfterTap(rows, picked, -1));       // a row already gone (NO_POSITION)
        assertEquals(0, Weighings.pickAfterTap(new ArrayList<>(), 0, 0));
    }

    @Test
    public void thePickFollowsItsWeighInNotItsRow() {
        List<Weighings.Weighing> rows = new ArrayList<>(Weighings.parse(OLD).rows);
        long picked = Weighings.pickAfterTap(rows, 0, 1);                // T2, second row
        rows.add(0, new Weighings.Weighing(T3 + 3_600_000L, 8490, 505));  // a new weigh-in arrives on top
        assertEquals(2, Weighings.shownIndex(rows, picked));             // still T2, now one row further down
        rows.remove(2);                                                  // T2 deleted (or moved to the other person)
        assertEquals(0, Weighings.shownIndex(rows, picked));             // the card falls back to the newest
        assertEquals(0, Weighings.shownIndex(new ArrayList<>(), picked));
    }
}
