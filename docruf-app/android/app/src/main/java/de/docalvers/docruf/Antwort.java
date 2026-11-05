package de.docalvers.docruf;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.RemoteInput;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Icon;
import android.os.Bundle;
import android.util.Log;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Doc answers a call from the phone (Doc, 05.11.2026: "dass ich dir im Telefon antworten kann"): right in the
 * notification ("Antworten", the keyboard's microphone dictates) or in the app's field. The answer goes to
 * <topic>-antwort on ntfy.sh, where the agent on the Mac reads it with docruf-antwort.mjs.
 */
public class Antwort extends BroadcastReceiver {
    static final String KEY = "antwort";
    static final String ACTION = "de.docalvers.docruf.ANTWORT";

    /** The "Antworten" button of a call's notification; `note` is that notification's id. */
    static Notification.Action action(Context c, String id, int note) {
        RemoteInput in = new RemoteInput.Builder(KEY).setLabel("Deine Antwort").build();
        Intent i = new Intent(c, Antwort.class).setAction(ACTION).putExtra("id", id).putExtra("note", note);
        // mutable: the system writes the typed answer into this intent
        PendingIntent pi = PendingIntent.getBroadcast(c, note, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
        return new Notification.Action.Builder(Icon.createWithResource(c, R.drawable.ic_ruf), "Antworten", pi)
                .addRemoteInput(in)
                .build();
    }

    @Override
    public void onReceive(Context c, Intent intent) {
        Bundle res = RemoteInput.getResultsFromIntent(intent);
        CharSequence typed = res == null ? null : res.getCharSequence(KEY);
        if (typed == null || typed.toString().trim().isEmpty()) return;
        String text = typed.toString().trim();
        String id = intent.getStringExtra("id");
        int note = intent.getIntExtra("note", 0);
        PendingResult done = goAsync();
        new Thread(() -> {
            finished(c, id, note, text, send(text, id));
            done.finish();
        }, "docruf-antwort").start();
    }

    /**
     * After an answer: the call's notification says what went out (the shade keeps a spinner until it is
     * replaced; a spoken answer shows what the phone understood), a failed one keeps both buttons, and the
     * list in the app shows the answer under its call. note 0 = sent from the app, no notification to replace.
     */
    static void finished(Context c, String id, int note, String text, boolean ok) {
        Rufe.answered(c, id, text, ok);
        if (note == 0) return;
        Notification.Builder b = new Notification.Builder(c, RufService.CH_CALL)
                .setSmallIcon(R.drawable.ic_ruf)
                .setColor(0xFFF5C242)
                .setContentTitle(ok ? "Antwort ist unterwegs ✓" : "Antwort ging nicht raus")
                .setContentText(text)
                .setStyle(new Notification.BigTextStyle().bigText(text))
                .setOnlyAlertOnce(true)
                .setAutoCancel(true)
                .setContentIntent(RufService.openApp(c));
        if (!ok) b.addAction(Sprechen.action(c, id, note)).addAction(action(c, id, note));
        c.getSystemService(NotificationManager.class).notify(note, b.build());
    }

    /** Posts the answer; the id of the call it answers rides in the title. Runs off the main thread. */
    static boolean send(String text, String id) {
        String topic = BuildConfig.TOPIC;
        if (topic.isEmpty()) return false;
        try {
            URL u = new URL(RufService.HOST + topic + "-antwort?title="
                    + URLEncoder.encode(id == null ? "" : id, "UTF-8"));
            HttpURLConnection h = (HttpURLConnection) u.openConnection();
            h.setConnectTimeout(10000);
            h.setReadTimeout(10000);
            h.setDoOutput(true);
            h.setRequestMethod("POST");
            h.setRequestProperty("Content-Type", "text/plain; charset=utf-8");
            try (OutputStream o = h.getOutputStream()) {
                o.write(text.getBytes(StandardCharsets.UTF_8));
            }
            boolean ok = h.getResponseCode() == 200;
            h.disconnect();
            return ok;
        } catch (Exception e) {
            Log.w(RufService.TAG, "answer failed: " + e);
            return false;
        }
    }
}
