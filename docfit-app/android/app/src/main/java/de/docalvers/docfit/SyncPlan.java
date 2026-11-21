package de.docalvers.docfit;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * What a sync does, decided without any network or Android - tested in SyncPlanTest.
 *
 * Offline first: the phone works with its own lists as always; "synced" remembers, per table, every row as it was when
 * the server last had it (key -> canonical text). Everything the phone did meanwhile is the difference:
 * - push: a row new or changed on the phone goes up as an upsert; a row the phone no longer has goes up as a tombstone
 *   (deleted_at set - a real DELETE would let the other device send it again). A row the database would refuse is
 *   never sent (counted as skipped), so it cannot hold back the others.
 * - pull: what the server changed since the last time comes down. A row the phone did not change since the last sync
 *   is taken over (or removed, for a tombstone); a row the phone changed meanwhile stays as the phone has it and goes
 *   up with the next push - the latest write wins, the database keeps the former version in docfit_history.
 */
final class SyncPlan {
    private SyncPlan() {
    }

    /** What to send for one table. */
    static final class Push {
        final List<SyncRows.Row> upserts = new ArrayList<>(), tombstones = new ArrayList<>();
        int skipped;

        int size() {
            return upserts.size() + tombstones.size();
        }
    }

    static Push push(String table, Map<String, SyncRows.Row> local, Map<String, String> synced) {
        Push p = new Push();
        for (SyncRows.Row r : local.values()) {
            if (!SyncRows.valid(r)) {
                p.skipped++;
                continue;
            }
            if (!r.canon().equals(synced.get(r.key))) p.upserts.add(r);
        }
        for (Map.Entry<String, String> e : synced.entrySet()) {
            if (local.containsKey(e.getKey())) continue;
            try {
                p.tombstones.add(SyncRows.fromCanon(table, e.getValue()));
            } catch (JSONException ex) {
                // a broken remembered row: nothing to delete by it
            }
        }
        return p;
    }

    /** After a push went through: the server now has exactly what was sent. */
    static void pushed(Push p, Map<String, String> synced) {
        for (SyncRows.Row r : p.upserts) synced.put(r.key, r.canon());
        for (SyncRows.Row r : p.tombstones) synced.remove(r.key);
    }

    /** What to change in the phone's lists for one table. */
    static final class Pull {
        final Map<String, SyncRows.Row> put = new LinkedHashMap<>();
        final Set<String> remove = new HashSet<>();

        boolean changesPhone() {
            return !put.isEmpty() || !remove.isEmpty();
        }
    }

    /**
     * @param local  the phone's rows of this table now
     * @param synced the remembered server state, updated here to what the phone holds afterwards
     * @param remote the rows the server changed since the last pull, oldest change first
     */
    static Pull pull(Map<String, SyncRows.Row> local, Map<String, String> synced, List<SyncRows.Row> remote) {
        Pull p = new Pull();
        for (SyncRows.Row r : remote) {
            String s = synced.get(r.key);
            SyncRows.Row l = local.get(r.key);
            boolean phoneChanged = l != null && !l.canon().equals(s);
            if (r.deleted) {
                if (l == null) {
                    synced.remove(r.key);
                    p.put.remove(r.key);
                } else if (!phoneChanged) {
                    synced.remove(r.key);
                    p.remove.add(r.key);
                    p.put.remove(r.key);
                }
                // else: changed on the phone after it was deleted elsewhere - the phone's version goes up again
                continue;
            }
            String rc = r.canon();
            if (l != null && l.canon().equals(rc)) {    // the phone has exactly this (also the echo of its own push)
                synced.put(r.key, rc);
                continue;
            }
            if (rc.equals(s)) continue;                 // unchanged on the server; what the phone did goes up next
            if (phoneChanged) continue;                 // changed here meanwhile: the phone's version goes up next
            // new or changed on the server - also over a delete on the phone that has not gone up yet (a change
            // beats a delete: nothing is lost)
            synced.put(r.key, rc);
            p.put.put(r.key, r);
            p.remove.remove(r.key);
        }
        return p;
    }
}
