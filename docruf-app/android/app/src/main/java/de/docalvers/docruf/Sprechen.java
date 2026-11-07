package de.docalvers.docruf;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Icon;

/**
 * Answer by voice in one tap: "Sprechen" in a call's notification opens DocCall straight into listening for
 * that call, in its own circle with the words appearing live (since 1.3, 07.11.2026). It used to open Google's
 * speech dialog; Doc: "dieser widerliche Dialog von Google ... dermaßen hässlich". The recognition is the same.
 */
final class Sprechen {
    static final String ACTION = "de.docalvers.docruf.SPRECHEN";

    private Sprechen() {
    }

    /** The "Sprechen" button of a call's notification; `note` is that notification's id. */
    static Notification.Action action(Context c, String id, int note) {
        return new Notification.Action.Builder(Icon.createWithResource(c, R.drawable.ic_ruf), "Sprechen",
                PendingIntent.getActivity(c, note + 1, intent(c, id, note),
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE))
                .build();
    }

    static Intent intent(Context c, String id, int note) {
        return new Intent(c, MainActivity.class).setAction(ACTION).putExtra("id", id).putExtra("note", note)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    }
}
