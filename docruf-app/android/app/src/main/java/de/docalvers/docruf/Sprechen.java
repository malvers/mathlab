package de.docalvers.docruf;

import android.app.Activity;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Icon;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.widget.Toast;

import java.util.ArrayList;

/**
 * Answer by voice in one tap: "Sprechen" in a call's notification (or in the app) opens Google's speech
 * input, Doc says his answer, and it goes out right away - no keyboard (Doc, 05.11.2026, first test: the
 * keyboard in the notification had no microphone). Invisible itself, it only hosts the speech dialog.
 */
public class Sprechen extends Activity {
    private static final int ASK = 1;
    private String id;
    private int note;

    /** The "Sprechen" button of a call's notification; `note` is that notification's id. */
    static Notification.Action action(Context c, String id, int note) {
        return new Notification.Action.Builder(Icon.createWithResource(c, R.drawable.ic_ruf), "Sprechen",
                PendingIntent.getActivity(c, note + 1, intent(c, id, note),
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE))
                .build();
    }

    static Intent intent(Context c, String id, int note) {
        return new Intent(c, Sprechen.class).putExtra("id", id).putExtra("note", note)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        id = getIntent().getStringExtra("id");
        note = getIntent().getIntExtra("note", 0);
        if (saved != null) return;      // turned while the dialog is open: the result still comes here
        Intent ask = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE, "de-DE")
                .putExtra(RecognizerIntent.EXTRA_PROMPT, "Deine Antwort");
        try {
            startActivityForResult(ask, ASK);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, "Keine Spracheingabe auf dem Phone", Toast.LENGTH_LONG).show();
            finish();
        }
    }

    @Override
    protected void onActivityResult(int req, int code, Intent data) {
        super.onActivityResult(req, code, data);
        ArrayList<String> said = code == RESULT_OK && data != null
                ? data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) : null;
        String text = said == null || said.isEmpty() ? "" : said.get(0).trim();
        if (text.isEmpty()) {
            finish();
            return;
        }
        Context app = getApplicationContext();
        String callId = id;
        int callNote = note;
        new Thread(() -> {
            boolean ok = Antwort.send(text, callId);
            Antwort.finished(app, callId, callNote, text, ok);
            runOnUiThread(() -> Toast.makeText(app, ok ? "Antwort ist unterwegs: " + text
                    : "Antwort ging nicht raus", Toast.LENGTH_LONG).show());
        }, "docruf-sprechen").start();
        finish();
    }
}
