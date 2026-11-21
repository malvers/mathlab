package de.docalvers.docfit;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * The two calls DocFit makes to Supabase, with plain HttpURLConnection - no SDK (the web pages do the same with plain
 * fetch in HTML/svp/svp-auth.js): the login (GoTrue, e-mail and password once, then the refresh token) and PostgREST
 * (upsert a batch of rows, read what changed since a moment). Blocking - Sync runs it on its own thread.
 *
 * The project URL and the publishable key are public by design (the same as in svp-auth.js); every table is locked to
 * Doc's account by row-level security. The password is never stored, only the session.
 */
final class SyncClient {
    static final String DB_URL = "https://fyfhxzyymmurlaenmzse.supabase.co";
    static final String DB_KEY = "sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk";   // publishable key - public by design
    private static final int TIMEOUT_MS = 15_000, PAGE = 1000;

    /** A login: tokens, when the access token runs out (s since 1970), and the account's e-mail for the settings. */
    static final class Session {
        final String access, refresh, email;
        final long expiresAt;

        Session(String access, String refresh, long expiresAt, String email) {
            this.access = access;
            this.refresh = refresh;
            this.expiresAt = expiresAt;
            this.email = email;
        }

        boolean fresh() {
            return access != null && System.currentTimeMillis() / 1000 < expiresAt - 60;
        }
    }

    /** A failed call: the HTTP status (0 = no network) and Supabase's message. */
    static final class Failure extends IOException {
        final int status;

        Failure(int status, String message) {
            super(message);
            this.status = status;
        }
    }

    private static final class Response {
        final int status;
        final String body;

        Response(int status, String body) {
            this.status = status;
            this.body = body;
        }
    }

    static Session login(String email, String password) throws Failure {
        JSONObject b = new JSONObject();
        try {
            b.put("email", email).put("password", password);
        } catch (JSONException e) {
            throw new Failure(0, e.getMessage());
        }
        return session(call("POST", "/auth/v1/token?grant_type=password", null, b.toString(), null), email);
    }

    static Session refresh(Session s) throws Failure {
        JSONObject b = new JSONObject();
        try {
            b.put("refresh_token", s.refresh);
        } catch (JSONException e) {
            throw new Failure(0, e.getMessage());
        }
        return session(call("POST", "/auth/v1/token?grant_type=refresh_token", null, b.toString(), null), s.email);
    }

    private static Session session(Response r, String email) throws Failure {
        try {
            JSONObject o = new JSONObject(r.body);
            if (r.status / 100 != 2) {
                throw new Failure(r.status, o.optString("msg", o.optString("error_description",
                        o.optString("message", "HTTP " + r.status))));
            }
            long exp = o.has("expires_at") ? o.getLong("expires_at")
                    : System.currentTimeMillis() / 1000 + o.optLong("expires_in", 3600);
            JSONObject user = o.optJSONObject("user");
            String mail = user != null ? user.optString("email", email) : email;
            return new Session(o.getString("access_token"), o.getString("refresh_token"), exp, mail);
        } catch (JSONException e) {
            throw new Failure(r.status, "Antwort nicht lesbar");
        }
    }

    /** Upserts a batch of rows (all with the same columns) into a table, keyed by user_id + the table's key column. */
    static void upsert(Session s, String table, JSONArray rows) throws Failure {
        String path = "/rest/v1/" + table + "?on_conflict=user_id," + SyncRows.keyColumn(table);
        Response r = call("POST", path, s.access, rows.toString(), "resolution=merge-duplicates,return=minimal");
        if (r.status / 100 != 2) throw failure(r);
    }

    /** Every row of a table changed after the given moment (ms; 0 = all), oldest change first, page by page. */
    static List<JSONObject> changedSince(Session s, String table, long afterMs) throws Failure {
        List<JSONObject> out = new ArrayList<>();
        String filter = afterMs > 0 ? "&updated_at=gt." + enc(SyncRows.iso(afterMs)) : "";
        for (int offset = 0; ; offset += PAGE) {
            String path = "/rest/v1/" + table + "?select=*" + filter + "&order=updated_at.asc,"
                    + SyncRows.keyColumn(table) + ".asc&limit=" + PAGE + "&offset=" + offset;
            Response r = call("GET", path, s.access, null, null);
            if (r.status / 100 != 2) throw failure(r);
            try {
                JSONArray a = new JSONArray(r.body);
                for (int i = 0; i < a.length(); i++) out.add(a.getJSONObject(i));
                if (a.length() < PAGE) return out;
            } catch (JSONException e) {
                throw new Failure(r.status, "Antwort nicht lesbar");
            }
        }
    }

    private static Failure failure(Response r) {
        String msg = "HTTP " + r.status;
        try {
            JSONObject o = new JSONObject(r.body);
            msg = o.optString("message", msg);
        } catch (JSONException e) {
            // keep the status
        }
        return new Failure(r.status, msg);
    }

    private static String enc(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {
            return s;
        }
    }

    private static Response call(String method, String path, String access, String body, String prefer)
            throws Failure {
        HttpURLConnection c;
        try {
            c = (HttpURLConnection) new URL(DB_URL + path).openConnection();
        } catch (IOException e) {
            throw new Failure(0, "kein Netz");
        }
        try {
            c.setRequestMethod(method);
            c.setConnectTimeout(TIMEOUT_MS);
            c.setReadTimeout(TIMEOUT_MS);
            c.setRequestProperty("apikey", DB_KEY);
            c.setRequestProperty("Content-Type", "application/json");
            if (access != null) c.setRequestProperty("Authorization", "Bearer " + access);
            if (prefer != null) c.setRequestProperty("Prefer", prefer);
            if (body != null) {
                c.setDoOutput(true);
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                c.setFixedLengthStreamingMode(bytes.length);
                try (OutputStream o = c.getOutputStream()) {
                    o.write(bytes);
                }
            }
            int status = c.getResponseCode();
            InputStream in = status / 100 == 2 ? c.getInputStream() : c.getErrorStream();
            return new Response(status, read(in));
        } catch (IOException e) {
            throw new Failure(0, "kein Netz");
        } finally {
            c.disconnect();
        }
    }

    private static String read(InputStream in) throws IOException {
        if (in == null) return "";
        try (InputStream i = in) {
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            for (int n; (n = i.read(buf)) > 0; ) b.write(buf, 0, n);
            return b.toString("UTF-8");
        }
    }
}
