package de.docalvers.docfit;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.Network;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * DocFit's data in Doc's private Supabase tables, so the web page /docfit/ shows and edits the same (Doc, 20.11.2026:
 * "DocFit im Web = identisch zum Phone"). Offline first: the app keeps working with its own lists in its preferences
 * exactly as before; this class only compares them with what the server had last (SyncPlan) and catches up whenever
 * there is a network.
 *
 * - It notices every change by itself (a listener on the app's preferences: times, weigh-ins, readings, profiles),
 *   waits a moment and syncs - the screens need no calls. It also syncs on start, when the network comes back and
 *   every minute while the app is in front (so a weigh-in made on the web shows up). MainActivity starts it in
 *   onCreate, stops it in onDestroy and says when it is in front (foreground).
 * - One cycle: read the lists (main thread), push and pull (own thread), take over what came (main thread, written
 *   into the same preferences in the app's own format) and tell the activity to read its lists again.
 * - Nothing goes out before Doc has logged in once (Einstellungen › Sync). Only the session is kept, in its own
 *   preferences file "docfit_sync" with the remembered server state and the pull cursors - never the password.
 */
final class Sync implements SharedPreferences.OnSharedPreferenceChangeListener {
    interface Listener {
        /** after a sync; {@code phoneChanged}: lists or profiles were changed from the server - read them again */
        void onSynced(boolean phoneChanged);
    }

    private static final String TAG = "DocFitSync";
    private static final long QUIET_MS = 1500, EVERY_MS = 60_000, RETRY_MAX_MS = 60_000;
    /** the pull looks this far behind its cursor - a write that committed late is not missed (keys catch doubles) */
    private static final long OVERLAP_MS = 120_000;

    private final Context context;
    private final SharedPreferences data, state;
    private final Listener listener;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private final ExecutorService net = Executors.newSingleThreadExecutor();
    private ConnectivityManager.NetworkCallback netBack;
    private boolean started, front, running, again, applying;
    private long retryMs = 5000;
    private volatile String status = "";
    private int pending;

    Sync(Context context, Listener listener) {
        this.context = context.getApplicationContext();
        this.listener = listener;
        data = context.getSharedPreferences("docfit", Context.MODE_PRIVATE);
        state = context.getSharedPreferences("docfit_sync", Context.MODE_PRIVATE);
    }

    // ---- lifecycle -------------------------------------------------------------------------------------------------

    void start() {
        if (started) return;
        started = true;
        data.registerOnSharedPreferenceChangeListener(this);
        ConnectivityManager cm = context.getSystemService(ConnectivityManager.class);
        if (cm != null) {
            netBack = new ConnectivityManager.NetworkCallback() {
                @Override
                public void onAvailable(Network network) {
                    ui.post(() -> request(0));
                }
            };
            try {
                cm.registerDefaultNetworkCallback(netBack);
            } catch (RuntimeException e) {
                netBack = null;
            }
        }
        request(0);
    }

    /** In front: sync now and then every minute; behind: no more minute syncs (changes still go up). */
    void foreground(boolean on) {
        if (on == front) return;
        front = on;
        ui.removeCallbacks(every);
        if (on && started) ui.post(every);
    }

    void stop() {
        if (!started) return;
        started = false;
        data.unregisterOnSharedPreferenceChangeListener(this);
        ConnectivityManager cm = context.getSystemService(ConnectivityManager.class);
        if (cm != null && netBack != null) {
            try {
                cm.unregisterNetworkCallback(netBack);
            } catch (RuntimeException e) {
                // was not registered
            }
        }
        netBack = null;
        ui.removeCallbacks(every);
        ui.removeCallbacks(cycle);
        net.shutdown();   // a cycle on its way may still finish
    }

    private final Runnable every = new Runnable() {
        @Override
        public void run() {
            request(0);
            ui.postDelayed(this, EVERY_MS);
        }
    };

    private final Runnable cycle = this::runCycle;

    /** Syncs after {@code delayMs} (a burst of changes becomes one sync). */
    void request(long delayMs) {
        ui.removeCallbacks(cycle);
        ui.postDelayed(cycle, delayMs);
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences p, String key) {
        if (applying || key == null) return;
        if (key.equals("entries") || key.startsWith("weighings") || key.startsWith("pressures")
                || key.startsWith("glucoses") || key.startsWith("fasts") || key.startsWith("profile")) {
            request(QUIET_MS);
        }
    }

    // ---- login -----------------------------------------------------------------------------------------------------

    boolean loggedIn() {
        return state.getString("refresh", null) != null;
    }

    String email() {
        return state.getString("email", "");
    }

    /** The line for the settings: last sync, what waits, or what went wrong. */
    String status() {
        if (!loggedIn()) return "Nicht angemeldet – die Daten bleiben nur auf dem Phone.";
        return status;
    }

    interface Done {
        void done(String error);   // null = it worked
    }

    void login(String email, String password, Done done) {
        net.execute(() -> {
            String err = null;
            try {
                keep(SyncClient.login(email, password));
            } catch (SyncClient.Failure f) {
                err = f.status == 400 ? "E-Mail oder Passwort stimmt nicht." : f.getMessage();
            }
            String e = err;
            ui.post(() -> {
                if (e == null) request(0);
                done.done(e);
            });
        });
    }

    /** Logs out: the session goes, the remembered server state too (a new login compares everything again). */
    void logout() {
        state.edit().clear().apply();
        status = "";
    }

    private void keep(SyncClient.Session s) {
        state.edit().putString("access", s.access).putString("refresh", s.refresh).putLong("expiresAt", s.expiresAt)
                .putString("email", s.email).apply();
    }

    private SyncClient.Session session() {
        return new SyncClient.Session(state.getString("access", null), state.getString("refresh", null),
                state.getLong("expiresAt", 0), state.getString("email", ""));
    }

    // ---- one cycle -------------------------------------------------------------------------------------------------

    private void runCycle() {
        if (!started || !loggedIn()) return;
        if (running) {
            again = true;
            return;
        }
        running = true;
        again = false;
        Map<String, Map<String, SyncRows.Row>> local = readLocal();
        Map<String, SyncPlan.Push> pushes = new HashMap<>();
        int waiting = 0;
        for (String t : SyncRows.TABLES) {
            SyncPlan.Push p = SyncPlan.push(t, local.get(t), synced(t));
            pushes.put(t, p);
            waiting += p.size();
            if (p.skipped > 0) Log.w(TAG, t + ": " + p.skipped + " rows the database would refuse, not sent");
        }
        pending = waiting;
        net.execute(() -> {
            Result res = exchange(pushes);
            ui.post(() -> finish(pushes, res));
        });
    }

    /** What came back from the server: per table pushed or not, the changed rows, an error. */
    private static final class Result {
        final Map<String, Boolean> pushed = new HashMap<>();
        final Map<String, List<SyncRows.Row>> pulled = new HashMap<>();
        final Map<String, Long> newest = new HashMap<>();
        String error;
        boolean loggedOut;
    }

    /** Network thread: refresh the token if needed, push every table, then pull every table. */
    private Result exchange(Map<String, SyncPlan.Push> pushes) {
        Result res = new Result();
        SyncClient.Session s = session();
        try {
            if (!s.fresh()) {
                s = SyncClient.refresh(s);
                keep(s);
            }
        } catch (SyncClient.Failure f) {
            if (f.status == 400 || f.status == 401) res.loggedOut = true;
            res.error = f.status == 0 ? "offline" : "Anmeldung: " + f.getMessage();
            return res;
        }
        long now = System.currentTimeMillis();
        for (String t : SyncRows.TABLES) {
            SyncPlan.Push p = pushes.get(t);
            if (p.size() == 0) {
                res.pushed.put(t, true);
                continue;
            }
            try {
                JSONArray rows = new JSONArray();
                for (SyncRows.Row r : p.upserts) rows.put(r.wire(null));
                for (SyncRows.Row r : p.tombstones) rows.put(r.wire(now));
                SyncClient.upsert(s, t, rows);
                res.pushed.put(t, true);
            } catch (SyncClient.Failure f) {
                res.pushed.put(t, false);
                if (f.status == 404) continue;   // the table is not there yet (its SQL not run): later
                if (res.error == null) res.error = f.status == 0 ? "offline" : t + ": " + f.getMessage();
                if (f.status == 0) return res;   // no network: the rest would fail the same way
            } catch (JSONException e) {
                res.pushed.put(t, false);
            }
        }
        for (String t : SyncRows.TABLES) {
            long cursor = state.getLong("cursor_" + t, 0);
            try {
                List<JSONObject> rows = SyncClient.changedSince(s, t, cursor > 0 ? cursor - OVERLAP_MS : 0);
                List<SyncRows.Row> out = new java.util.ArrayList<>();
                long newest = cursor;
                for (JSONObject o : rows) {
                    out.add(SyncRows.fromDb(t, o));
                    String u = o.optString("updated_at", "");
                    if (!u.isEmpty()) newest = Math.max(newest, SyncRows.ms(u));
                }
                res.pulled.put(t, out);
                res.newest.put(t, newest);
            } catch (SyncClient.Failure f) {
                if (f.status == 404) continue;   // the table is not there yet
                if (res.error == null) res.error = f.status == 0 ? "offline" : t + ": " + f.getMessage();
                if (f.status == 0) return res;
            } catch (RuntimeException e) {
                if (res.error == null) res.error = t + ": " + e.getMessage();
            }
        }
        return res;
    }

    /** Main thread: remember what went up, take over what came down, write it into the app's lists. */
    private void finish(Map<String, SyncPlan.Push> pushes, Result res) {
        running = false;
        if (res.loggedOut) {
            logout();
            status = "Anmeldung abgelaufen – bitte neu anmelden.";
            if (started) listener.onSynced(false);
            return;
        }
        int left = 0;
        for (String t : SyncRows.TABLES) {
            Map<String, String> synced = synced(t);
            if (Boolean.TRUE.equals(res.pushed.get(t))) SyncPlan.pushed(pushes.get(t), synced);
            else left += pushes.get(t).size();
            saveSynced(t, synced);
        }
        boolean phoneChanged = false;
        Map<String, Map<String, SyncRows.Row>> local = readLocal();   // fresh: Doc may have changed something meanwhile
        applying = true;
        try {
            for (String t : SyncRows.TABLES) {
                List<SyncRows.Row> remote = res.pulled.get(t);
                if (remote == null) continue;
                Map<String, String> synced = synced(t);
                SyncPlan.Pull p = SyncPlan.pull(local.get(t), synced, remote);
                boolean written = !p.changesPhone() || write(t, p);
                if (written) {
                    saveSynced(t, synced);
                    state.edit().putLong("cursor_" + t, res.newest.get(t)).apply();
                }
                phoneChanged |= p.changesPhone() && written;
            }
        } finally {
            applying = false;
        }
        String time = new java.text.SimpleDateFormat("HH:mm", java.util.Locale.GERMAN).format(new java.util.Date());
        if (res.error == null) {
            retryMs = 5000;
            state.edit().putLong("lastOk", System.currentTimeMillis()).apply();
            status = "Synchronisiert " + time + " ✓";
        } else {
            status = (res.error.equals("offline") ? "Offline" : "Nicht synchronisiert (" + res.error + ")")
                    + (left > 0 ? " – " + left + (left == 1 ? " Änderung wartet" : " Änderungen warten") : "");
            request(retryMs);
            retryMs = Math.min(retryMs * 2, RETRY_MAX_MS);
        }
        pending = left;
        if (!started) return;   // the activity is gone; what came is in the preferences for its next start
        listener.onSynced(phoneChanged);
        if (again) request(0);
    }

    // ---- the app's lists <-> rows ----------------------------------------------------------------------------------

    private Map<String, Map<String, SyncRows.Row>> readLocal() {
        Map<String, Map<String, SyncRows.Row>> m = new HashMap<>();
        for (String t : SyncRows.TABLES) m.put(t, new TreeMap<>());
        SyncRows.runs(data.getString("entries", "[]"), m.get(SyncRows.RUN));
        for (int i = 0; i < SyncRows.SLOTS.length; i++) {
            String slot = SyncRows.SLOTS[i];
            SyncRows.weighings(data.getString("weighings" + slot, null), i, m.get(SyncRows.WEIGHING));
            SyncRows.pressures(data.getString("pressures" + slot, null), i, m.get(SyncRows.BP));
            SyncRows.glucoses(data.getString("glucoses" + slot, null), i, m.get(SyncRows.GLUCOSE));
            SyncRows.fasts(data.getString("fasts" + slot, null), i, m.get(SyncRows.FAST));
            Profile p = Profile.load(data, slot);
            String name = i == 0 ? null : data.getString("profile" + slot + "Name", null);
            SyncRows.Row r = SyncRows.profile(i, name, p.heightCm, p.birthYear,
                    p.sex == Profile.UNSET ? "" : String.valueOf(p.sex), data.getBoolean("profile" + slot + "On", true));
            m.get(SyncRows.PROFILE).put(r.key, r);
        }
        return m;
    }

    /** Writes what came from the server into the app's preferences, in the app's own format; false = left alone. */
    private boolean write(String table, SyncPlan.Pull p) {
        try {
            SharedPreferences.Editor e = data.edit();
            switch (table) {
                case SyncRows.RUN:
                    e.putString("entries", SyncRows.applyRuns(data.getString("entries", "[]"), p.put, p.remove));
                    break;
                case SyncRows.WEIGHING: {
                    String[] in = slots("weighings");
                    String[] out = SyncRows.applyWeighings(in, p.put, p.remove);
                    if (out == null) {
                        Log.w(TAG, "a weigh-in list could not be read completely - not written over");
                        return false;
                    }
                    for (int i = 0; i < out.length; i++) e.putString("weighings" + SyncRows.SLOTS[i], out[i]);
                    break;
                }
                case SyncRows.BP: {
                    String[] out = SyncRows.applyPressures(slots("pressures"), p.put, p.remove);
                    for (int i = 0; i < out.length; i++) e.putString("pressures" + SyncRows.SLOTS[i], out[i]);
                    break;
                }
                case SyncRows.GLUCOSE: {
                    String[] out = SyncRows.applyGlucoses(slots("glucoses"), p.put, p.remove);
                    for (int i = 0; i < out.length; i++) e.putString("glucoses" + SyncRows.SLOTS[i], out[i]);
                    break;
                }
                case SyncRows.FAST: {
                    String[] out = SyncRows.applyFasts(slots("fasts"), p.put, p.remove);
                    for (int i = 0; i < out.length; i++) e.putString("fasts" + SyncRows.SLOTS[i], out[i]);
                    break;
                }
                case SyncRows.PROFILE:
                    for (SyncRows.Row r : p.put.values()) {
                        int i = (int) r.num("person");
                        if (i < 0 || i >= SyncRows.SLOTS.length) continue;
                        String slot = SyncRows.SLOTS[i];
                        String sex = r.str("sex");
                        new Profile((int) r.num("height_cm"), (int) r.num("birth_year"),
                                sex == null || sex.isEmpty() ? Profile.UNSET : sex.charAt(0)).save(data, slot);
                        Object active = r.f.get("active");
                        e.putBoolean("profile" + slot + "On", !Boolean.FALSE.equals(active));
                        if (i > 0) {
                            if (r.str("name") == null) e.remove("profile" + slot + "Name");
                            else e.putString("profile" + slot + "Name", r.str("name"));
                        }
                    }
                    break;
                default:
                    return false;
            }
            e.apply();
            return true;
        } catch (JSONException ex) {
            Log.w(TAG, table + ": " + ex.getMessage());
            return false;
        }
    }

    private String[] slots(String key) {
        String[] out = new String[SyncRows.SLOTS.length];
        for (int i = 0; i < out.length; i++) out[i] = data.getString(key + SyncRows.SLOTS[i], null);
        return out;
    }

    private Map<String, String> synced(String table) {
        Map<String, String> m = new HashMap<>();
        try {
            JSONObject o = new JSONObject(state.getString("synced_" + table, "{}"));
            for (java.util.Iterator<String> it = o.keys(); it.hasNext(); ) {
                String k = it.next();
                m.put(k, o.getString(k));
            }
        } catch (JSONException e) {
            // nothing remembered: the next push compares everything again (upserts are harmless)
        }
        return m;
    }

    private void saveSynced(String table, Map<String, String> m) {
        JSONObject o = new JSONObject();
        try {
            for (Map.Entry<String, String> e : m.entrySet()) o.put(e.getKey(), e.getValue());
        } catch (JSONException e) {
            return;
        }
        state.edit().putString("synced_" + table, o.toString()).apply();
    }

    /** How many changes have not reached the server yet (as of the last cycle). */
    int pending() {
        return pending;
    }
}
