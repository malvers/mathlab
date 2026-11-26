package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * The sync without a network (SyncRows, SyncPlan): the app's stored lists become rows, only what changed goes up, a
 * delete goes up as a tombstone, what the server changed comes down into the app's own format, and a change made on the
 * phone meanwhile is never overwritten. Made-up values only - no one's real data.
 */
public class SyncPlanTest {
    private static final long T1 = 1_795_000_000_000L, T2 = T1 + 86_400_000L, T3 = T2 + 86_400_000L;

    private static Map<String, SyncRows.Row> weighRows(String json, int person) {
        Map<String, SyncRows.Row> m = new TreeMap<>();
        SyncRows.weighings(json, person, m);
        return m;
    }

    @Test
    public void weighInsBecomeRowsLikeTheTable() throws Exception {
        String json = "[{\"time\":" + T2 + ",\"centiKg\":8515,\"ohm\":512,\"waistMm\":905},"
                + "{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":65535}]";
        Map<String, SyncRows.Row> m = weighRows(json, 1);
        assertEquals(2, m.size());
        SyncRows.Row r = m.get(String.valueOf(T2));
        assertEquals(8515, r.num("centi_kg"));
        assertEquals(512, r.num("ohm"));
        assertEquals(905, r.num("waist_mm"));
        assertNull(r.f.get("hip_mm"));                       // none typed in = null, not 0
        assertEquals(1, r.num("person"));
        assertEquals(0, m.get(String.valueOf(T1)).num("ohm"));   // the scale's 65535 goes as "not measured"
        JSONObject w = r.wire(null);
        assertEquals(SyncRows.iso(T2), w.getString("measured_at"));
        assertTrue(w.isNull("deleted_at"));
        assertTrue(w.isNull("hip_mm"));
    }

    @Test
    public void momentsSurviveTheWire() {
        assertEquals(T1 + 123, SyncRows.ms(SyncRows.iso(T1 + 123)));
        assertEquals(T1, SyncRows.ms(SyncRows.iso(T1).replace("Z", "+00:00")));   // as PostgREST writes it
    }

    @Test
    public void onlyNewOrChangedRowsGoUp() {
        Map<String, SyncRows.Row> local = weighRows("[{\"time\":" + T2 + ",\"centiKg\":8515,\"ohm\":0},"
                + "{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0}]", 0);
        Map<String, String> synced = new HashMap<>();
        SyncPlan.Push p = SyncPlan.push(SyncRows.WEIGHING, local, synced);
        assertEquals(2, p.upserts.size());
        SyncPlan.pushed(p, synced);
        assertEquals(0, SyncPlan.push(SyncRows.WEIGHING, local, synced).size());   // nothing new: nothing goes up
        // waist typed in for one weigh-in: just that one
        local = weighRows("[{\"time\":" + T2 + ",\"centiKg\":8515,\"ohm\":0,\"waistMm\":900},"
                + "{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0}]", 0);
        p = SyncPlan.push(SyncRows.WEIGHING, local, synced);
        assertEquals(1, p.upserts.size());
        assertEquals(String.valueOf(T2), p.upserts.get(0).key);
    }

    @Test
    public void aDeleteGoesUpAsAFullTombstone() throws Exception {
        Map<String, String> synced = new HashMap<>();
        Map<String, SyncRows.Row> local = weighRows("[{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0}]", 0);
        SyncPlan.pushed(SyncPlan.push(SyncRows.WEIGHING, local, synced), synced);
        SyncPlan.Push p = SyncPlan.push(SyncRows.WEIGHING, new TreeMap<>(), synced);
        assertEquals(1, p.tombstones.size());
        JSONObject w = p.tombstones.get(0).wire(T3);
        assertEquals(8550, w.getLong("centi_kg"));   // the whole row: an insert would work as well
        assertFalse(w.isNull("deleted_at"));
        SyncPlan.pushed(p, synced);
        assertTrue(synced.isEmpty());
    }

    @Test
    public void aRowTheDatabaseWouldRefuseIsNotSent() {
        Map<String, SyncRows.Row> local = new TreeMap<>();
        SyncRows.runs("[{\"start\":" + T1 + ",\"duration\":90000000},{\"start\":" + T2 + ",\"duration\":61000,"
                + "\"kind\":\"Planks\"}]", local);   // 25 h: longer than the table allows
        SyncPlan.Push p = SyncPlan.push(SyncRows.RUN, local, new HashMap<>());
        assertEquals(1, p.skipped);
        assertEquals(1, p.upserts.size());
        assertEquals("Planks", p.upserts.get(0).str("kind"));
    }

    @Test
    public void serverChangesComeDownAndEchoesAreIgnored() throws Exception {
        Map<String, String> synced = new HashMap<>();
        Map<String, SyncRows.Row> local = weighRows("[{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0}]", 0);
        SyncPlan.pushed(SyncPlan.push(SyncRows.WEIGHING, local, synced), synced);
        List<SyncRows.Row> remote = new ArrayList<>();
        remote.add(local.get(String.valueOf(T1)));   // the echo of the own push
        remote.add(SyncRows.row(SyncRows.WEIGHING, false, "measured_at", T2, "person", 1, "centi_kg", 6210, "ohm", 0));
        SyncPlan.Pull p = SyncPlan.pull(local, synced, remote);
        assertEquals(1, p.put.size());
        assertTrue(p.put.containsKey(String.valueOf(T2)));
        assertTrue(synced.containsKey(String.valueOf(T2)));
        // written into the second person's list, the first one unchanged
        String[] out = SyncRows.applyWeighings(new String[]{"[{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0}]", null},
                p.put, p.remove);
        assertNotNull(out);
        assertEquals(1, new JSONArray(out[0]).length());
        JSONObject second = new JSONArray(out[1]).getJSONObject(0);
        assertEquals(T2, second.getLong("time"));
        assertEquals(6210, second.getInt("centiKg"));
    }

    @Test
    public void aChangeOnThePhoneIsNeverOverwritten() {
        Map<String, String> synced = new HashMap<>();
        Map<String, SyncRows.Row> local = weighRows("[{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0}]", 0);
        SyncPlan.pushed(SyncPlan.push(SyncRows.WEIGHING, local, synced), synced);
        String before = synced.get(String.valueOf(T1));
        // the phone typed in a waist, the web changed the weight meanwhile
        local = weighRows("[{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0,\"waistMm\":910}]", 0);
        List<SyncRows.Row> remote = new ArrayList<>(Arrays.asList(
                SyncRows.row(SyncRows.WEIGHING, false, "measured_at", T1, "person", 0, "centi_kg", 8500, "ohm", 0)));
        SyncPlan.Pull p = SyncPlan.pull(local, synced, remote);
        assertFalse(p.changesPhone());
        assertEquals(before, synced.get(String.valueOf(T1)));   // so the phone's version goes up next
        assertEquals(1, SyncPlan.push(SyncRows.WEIGHING, local, synced).upserts.size());
    }

    @Test
    public void aTombstoneRemovesAnUnchangedRow() throws Exception {
        Map<String, String> synced = new HashMap<>();
        Map<String, SyncRows.Row> local = new TreeMap<>();
        SyncRows.runs("[{\"start\":" + T2 + ",\"duration\":61000,\"kind\":\"Two Balls\"},{\"start\":" + T1
                + ",\"duration\":4000}]", local);
        SyncPlan.pushed(SyncPlan.push(SyncRows.RUN, local, synced), synced);
        SyncRows.Row gone = SyncRows.row(SyncRows.RUN, true, "started_at", T2, "duration_ms", 61000, "kind", "Two Balls");
        SyncPlan.Pull p = SyncPlan.pull(local, synced, new ArrayList<>(Arrays.asList(gone)));
        assertEquals(new HashSet<>(Arrays.asList(String.valueOf(T2))), p.remove);
        assertFalse(synced.containsKey(String.valueOf(T2)));
        JSONArray a = new JSONArray(SyncRows.applyRuns("[{\"start\":" + T2 + ",\"duration\":61000,\"kind\":\"Two Balls\"},"
                + "{\"start\":" + T1 + ",\"duration\":4000}]", p.put, p.remove));
        assertEquals(1, a.length());
        assertEquals(T1, a.getJSONObject(0).getLong("start"));
        assertFalse(a.getJSONObject(0).has("kind"));   // an old time is written exactly as before
    }

    @Test
    public void readingsTravelWithPulseNoteAndSource() throws Exception {
        Map<String, SyncRows.Row> m = new TreeMap<>();
        SyncRows.pressures("[{\"time\":" + T2 + ",\"sys\":128,\"dia\":82,\"pulse\":0,\"source\":\"hand\",\"note\":\"nach dem Kaffee\"},"
                + "{\"time\":" + T1 + ",\"sys\":121,\"dia\":79,\"pulse\":64,\"source\":\"omron\"}]", 1, m);
        SyncRows.Row a = m.get(String.valueOf(T2)), b = m.get(String.valueOf(T1));
        assertNull(a.f.get("pulse"));                 // 0 = no pulse = null in the table
        assertEquals("nach dem Kaffee", a.str("note"));
        assertEquals("hand", a.str("source"));
        assertNull(b.f.get("note"));
        assertEquals(64, b.num("pulse"));
        assertTrue(SyncRows.valid(a) && SyncRows.valid(b));
        // back into the app's format: pulse 0 again, a note only where there is one
        Map<String, SyncRows.Row> put = new HashMap<>();
        put.put(a.key, a);
        String[] out = SyncRows.applyPressures(new String[]{null, "[]"}, put, new HashSet<>());
        JSONObject o = new JSONArray(out[1]).getJSONObject(0);
        assertEquals(0, o.getInt("pulse"));
        assertEquals("nach dem Kaffee", o.getString("note"));
        assertEquals("[]", out[0]);
    }

    @Test
    public void glucoseTravelsInMgPerDlWithContextAndNote() throws Exception {
        Map<String, SyncRows.Row> m = new TreeMap<>();
        SyncRows.glucoses("[{\"time\":" + T2 + ",\"mgdl\":97,\"context\":\"fasting\",\"source\":\"hand\",\"note\":\"Test\"},"
                + "{\"time\":" + T1 + ",\"mgdl\":142,\"context\":\"after_meal_2h\"}]", 0, m);
        SyncRows.Row a = m.get(String.valueOf(T2)), b = m.get(String.valueOf(T1));
        assertEquals(97, a.num("mg_dl"));
        assertEquals("fasting", a.str("context"));
        assertEquals("Test", a.str("note"));
        assertEquals("hand", b.str("source"));          // no source stored: typed in by hand
        assertNull(b.f.get("note"));
        assertTrue(SyncRows.valid(a) && SyncRows.valid(b));
        assertFalse(SyncRows.valid(SyncRows.row(SyncRows.GLUCOSE, false, "measured_at", T1, "person", 0, "mg_dl", 5,
                "context", "", "source", "hand")));   // 5 mg/dL: refused by the table
        Map<String, SyncRows.Row> put = new HashMap<>();
        put.put(a.key, a);
        JSONObject o = new JSONArray(SyncRows.applyGlucoses(new String[]{"[]", null}, put, new HashSet<>())[0]).getJSONObject(0);
        assertEquals(97, o.getInt("mgdl"));
        assertEquals("fasting", o.getString("context"));
        assertEquals("Test", o.getString("note"));
        // and the canonical row survives the wire
        assertEquals(a.canon(), SyncRows.fromDb(SyncRows.GLUCOSE, a.wire(null)).canon());
    }

    @Test
    public void fastsTravelByTheirIdWithAnOpenEnd() throws Exception {
        Map<String, SyncRows.Row> m = new TreeMap<>();
        SyncRows.fasts("[{\"id\":\"" + T3 + "\",\"start\":" + T3 + ",\"end\":null,\"plannedDays\":5,\"note\":\"Testfasten\"},"
                + "{\"id\":\"a1b2\",\"start\":" + T1 + ",\"end\":" + T2 + ",\"plannedDays\":0}]", 1, m);
        SyncRows.Row live = m.get(String.valueOf(T3)), done = m.get("a1b2");
        assertNull(live.f.get("ended_at"));                 // still running
        assertEquals(5, live.num("planned_days"));
        assertEquals(1, live.num("person"));
        assertEquals(T2, done.num("ended_at"));
        assertNull(done.f.get("planned_days"));             // 0 = none
        assertTrue(SyncRows.valid(live) && SyncRows.valid(done));
        assertFalse(SyncRows.valid(SyncRows.row(SyncRows.FAST, false, "fast_id", "x", "person", 0, "started_at", T2,
                "ended_at", T1)));                          // ends before it starts: refused by the table
        JSONObject w = live.wire(null);
        assertTrue(w.isNull("ended_at"));
        assertEquals(SyncRows.iso(T3), w.getString("started_at"));
        assertEquals(live.canon(), SyncRows.fromDb(SyncRows.FAST, w).canon());
        // back into the app's format (Fasts.format): the id as text, "end" null while open, "plannedDays" null without a plan
        Map<String, SyncRows.Row> put = new HashMap<>();
        put.put(live.key, live);
        put.put(done.key, done);
        String json = SyncRows.applyFasts(new String[]{"[]", "[]"}, put, new HashSet<>())[1];
        JSONArray a = new JSONArray(json);
        assertEquals(2, a.length());
        JSONObject first = a.getJSONObject(0), second = a.getJSONObject(1);   // newest start first
        assertEquals(String.valueOf(T3), first.getString("id"));
        assertTrue(first.isNull("end"));
        assertEquals(5, first.getInt("plannedDays"));
        assertEquals("Testfasten", first.getString("note"));
        assertEquals("a1b2", second.getString("id"));
        assertEquals(T2, second.getLong("end"));
        assertTrue(second.isNull("plannedDays"));
        // and the app reads it back as it wrote it
        java.util.List<Fasts.Fast> back = Fasts.parse(json);
        assertEquals(2, back.size());
        assertTrue(back.get(0).open());
        assertEquals(5, back.get(0).plannedDays);
        assertEquals(T2, back.get(1).end);
    }

    @Test
    public void profilesKeepEmptyFieldsEmptyAndDocWithoutName() {
        SyncRows.Row doc = SyncRows.profile(0, "egal", 180, 1990, "m", true);
        assertNull(doc.str("name"));
        SyncRows.Row other = SyncRows.profile(1, " Testfrau ", 0, 0, "", false);
        assertEquals("Testfrau", other.str("name"));
        assertNull(other.f.get("height_cm"));
        assertNull(other.f.get("sex"));
        assertEquals(Boolean.FALSE, other.f.get("active"));
        assertTrue(SyncRows.valid(doc) && SyncRows.valid(other));
        assertFalse(SyncRows.valid(SyncRows.profile(0, null, 80, 1990, "m", true)));   // 80 cm: refused by the table
    }

    @Test
    public void aWeighInMovedToTheOtherPersonChangesLists() throws Exception {
        SyncRows.Row moved = SyncRows.row(SyncRows.WEIGHING, false, "measured_at", T1, "person", 1, "centi_kg", 8550,
                "ohm", 0);
        Map<String, SyncRows.Row> put = new HashMap<>();
        put.put(moved.key, moved);
        String[] out = SyncRows.applyWeighings(new String[]{"[{\"time\":" + T1 + ",\"centiKg\":8550,\"ohm\":0}]", "[]"},
                put, new HashSet<>());
        assertEquals(0, new JSONArray(out[0]).length());
        assertEquals(1, new JSONArray(out[1]).length());
    }

    @Test
    public void anUnreadableWeighInListIsNeverWrittenOver() throws Exception {
        String broken = "[{\"time\":" + T1 + ",\"centiKg\":8550},{\"oops\":1}]";
        assertNull(SyncRows.applyWeighings(new String[]{broken, "[]"}, new HashMap<>(), new HashSet<>()));
    }

    @Test
    public void setsTravelWithRepsWeightAndMove() throws Exception {
        Map<String, SyncRows.Row> local = new TreeMap<>();
        SyncRows.runs("[{\"start\":" + T2 + ",\"duration\":0,\"kind\":\"Dumbbells\",\"reps\":12,\"kg\":2.5,"
                + "\"move\":\"Curls\"},{\"start\":" + T1 + ",\"duration\":61000,\"kind\":\"Planks\"}]", local);
        SyncRows.Row set = local.get(String.valueOf(T2)), time = local.get(String.valueOf(T1));
        assertEquals(12, set.num("reps"));
        assertEquals(250, set.num("weight_kg"));             // held in hundredths
        assertEquals("Curls", set.str("move"));
        assertTrue(SyncRows.valid(set));                      // duration 0 is fine for a set
        assertNull(time.f.get("reps"));
        assertNull(time.f.get("weight_kg"));
        assertNull(time.f.get("move"));
        JSONObject w = set.wire(null);
        assertEquals(2.5, w.getDouble("weight_kg"), 0);       // travels as kg
        assertEquals(12, w.getInt("reps"));
        assertTrue(time.wire(null).isNull("reps"));            // a time sends the columns empty
        // back from the server (numeric weight as a number) and from the remembered text: the same row
        assertEquals(set.canon(), SyncRows.fromDb(SyncRows.RUN, w).canon());
        assertEquals(set.canon(), SyncRows.fromCanon(SyncRows.RUN, set.canon()).canon());
        JSONObject asText = new JSONObject(w.toString()).put("weight_kg", "2.50");   // numeric could come as text
        assertEquals(250, SyncRows.fromDb(SyncRows.RUN, asText).num("weight_kg"));
        // into the app's list
        Map<String, SyncRows.Row> put = new TreeMap<>();
        put.put(set.key, SyncRows.fromDb(SyncRows.RUN, w));
        Entries.Entry e = Entries.parse(SyncRows.applyRuns("[]", put, new HashSet<>())).get(0);
        assertEquals(12, e.reps);
        assertEquals(2.5, e.kg, 0);
        assertEquals("Curls", e.move);
        assertEquals("Dumbbells", e.kind);
    }

    @Test
    public void aRowFromBeforeTheSetsReadsAsATimeAndIsNotSentAgain() throws Exception {
        // the canonical text a time was remembered with before the columns existed
        String before = "{\"duration_ms\":61000,\"kind\":\"Planks\",\"started_at\":" + T1 + "}";
        Map<String, SyncRows.Row> local = new TreeMap<>();
        SyncRows.runs("[{\"start\":" + T1 + ",\"duration\":61000,\"kind\":\"Planks\"}]", local);
        assertEquals(before, local.get(String.valueOf(T1)).canon());
        Map<String, String> synced = new HashMap<>();
        synced.put(String.valueOf(T1), before);
        assertEquals(0, SyncPlan.push(SyncRows.RUN, local, synced).size());   // nothing goes up again
        // a server row without the new columns (as before the migration) reads as the same time
        JSONObject old = new JSONObject().put("started_at", SyncRows.iso(T1)).put("duration_ms", 61000)
                .put("kind", "Planks").put("deleted_at", JSONObject.NULL);
        SyncRows.Row r = SyncRows.fromDb(SyncRows.RUN, old);
        assertEquals(before, r.canon());
        Map<String, SyncRows.Row> put = new TreeMap<>();
        put.put(r.key, r);
        JSONArray a = new JSONArray(SyncRows.applyRuns("[]", put, new HashSet<>()));
        assertEquals(3, a.getJSONObject(0).length());   // start, duration, kind - as before
        assertFalse(a.getJSONObject(0).has("reps"));
    }

    @Test
    public void setsTheDatabaseWouldRefuseAreNotSent() {
        assertFalse(SyncRows.valid(SyncRows.row(SyncRows.RUN, false, "started_at", T1, "duration_ms", 0, "kind", "Legs",
                "reps", 1001)));
        assertFalse(SyncRows.valid(SyncRows.row(SyncRows.RUN, false, "started_at", T1, "duration_ms", 0, "kind", "Legs",
                "reps", 12, "weight_kg", 30_001L)));
        assertFalse(SyncRows.valid(SyncRows.row(SyncRows.RUN, false, "started_at", T1, "duration_ms", 0, "kind", "Legs",
                "reps", 12, "move", "0123456789012345678901234567890")));   // 31 characters
        assertTrue(SyncRows.valid(SyncRows.row(SyncRows.RUN, false, "started_at", T1, "duration_ms", 0, "kind", "Legs",
                "reps", 1000, "weight_kg", 30_000L, "move", "012345678901234567890123456789")));
    }

    @Test
    public void canonicalTextIsTheSameWhateverTheOrder() throws Exception {
        SyncRows.Row a = SyncRows.row(SyncRows.RUN, false, "kind", "Planks", "started_at", T1, "duration_ms", 1000);
        SyncRows.Row b = SyncRows.fromCanon(SyncRows.RUN, a.canon());
        assertEquals(a.canon(), b.canon());
        SyncRows.Row c = SyncRows.fromDb(SyncRows.RUN, a.wire(null));
        assertEquals(a.canon(), c.canon());
        assertFalse(c.deleted);
        assertTrue(SyncRows.fromDb(SyncRows.RUN, a.wire(T2)).deleted);
    }
}
