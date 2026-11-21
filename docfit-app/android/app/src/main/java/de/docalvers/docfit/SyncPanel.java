package de.docalvers.docfit;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.text.InputType;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * "Sync" in the settings: the state line and the account (Doc, 20.11.2026: "DocFit im Web = identisch zum Phone").
 * Kept apart from MainActivity, which only adds {@link #section} to its settings and calls Sync at start and stop.
 *
 * Logged out: e-mail and password of Doc's account (the same as for DocCal and Grateful), typed by Doc himself; only
 * the session is kept. Logged in: the account, the state line, "Jetzt synchronisieren" and "Abmelden".
 * Headings in Orbitron, running text in the system font (Doc, 21.11.2026: Orbitron only for headings).
 */
final class SyncPanel {
    private final Activity a;
    private final Sync sync;
    private final Palette pal;
    private final Typeface orbitron;

    SyncPanel(Activity a, Sync sync, Palette pal, Typeface orbitron) {
        this.a = a;
        this.sync = sync;
        this.pal = pal;
        this.orbitron = orbitron;
    }

    /** The block for the settings: label SYNC, the state line, a row that opens the account. */
    View section(Runnable closeSettings) {
        LinearLayout box = new LinearLayout(a);
        box.setOrientation(LinearLayout.VERTICAL);
        TextView label = text("SYNC", 12, pal.muted, true);
        label.setLetterSpacing(0.1f);
        box.addView(label);
        LinearLayout row = new LinearLayout(a);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(dp(14), dp(8), dp(14), dp(8));
        GradientDrawable g = new GradientDrawable();
        g.setColor(0x00000000);
        g.setCornerRadius(dp(10));
        g.setStroke(Math.max(1, dp(1)), pal.muted);
        row.setBackground(g);
        LinearLayout texts = new LinearLayout(a);
        texts.setOrientation(LinearLayout.VERTICAL);
        texts.addView(text(sync.loggedIn() ? "Konto & Sync" : "Anmelden", 15, pal.text, true));
        TextView state = text(sync.status(), 12, pal.muted, false);
        texts.addView(state);
        row.addView(texts, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView chevron = text("›", 22, pal.muted, false);
        chevron.setTranslationY(-dp(3));
        row.addView(chevron);
        row.setContentDescription("Sync öffnen");
        row.setOnClickListener(v -> {
            if (closeSettings != null) closeSettings.run();
            open();
        });
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        box.addView(row, lp);
        return box;
    }

    /** The account dialog: log in, or see the state, sync now, log out. */
    void open() {
        LinearLayout box = new LinearLayout(a);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(24), dp(4), dp(24), dp(8));
        AlertDialog.Builder b = new AlertDialog.Builder(a, pal.light ? android.R.style.Theme_DeviceDefault_Light_Dialog_Alert
                : android.R.style.Theme_DeviceDefault_Dialog_Alert);
        TextView title = text(sync.loggedIn() ? "Sync" : "Anmelden", 18, pal.accent, true);
        title.setPadding(dp(24), dp(20), dp(24), dp(4));
        b.setCustomTitle(title).setView(box);
        if (sync.loggedIn()) {
            box.addView(text("Angemeldet als " + sync.email(), 14, pal.text, false));
            TextView state = text(sync.status(), 13, pal.muted, false);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT);
            lp.topMargin = dp(8);
            box.addView(state, lp);
            box.addView(hint("Läufe, Wiegungen, Blutdruck und Profile gehen in deine private Supabase-Ablage – nur dein "
                    + "Konto kommt dran. Ohne Netz wird gesammelt und nachgeholt."));
            b.setPositiveButton("Jetzt synchronisieren", null).setNegativeButton("Abmelden", null)
                    .setNeutralButton("Schließen", null);
            AlertDialog d = b.create();
            show(d);
            d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
                state.setText("synchronisiert …");
                sync.request(0);
                state.postDelayed(() -> state.setText(sync.status()), 2500);
            });
            d.getButton(DialogInterface.BUTTON_NEGATIVE).setOnClickListener(v -> {
                sync.logout();
                d.dismiss();
            });
            return;
        }
        EditText email = field("E-Mail", InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
        email.setText(sync.email());
        EditText pwd = field("Passwort", InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        // the phone's password manager may fill both (Doc picks his saved login; DocFit never sees it stored)
        email.setAutofillHints(View.AUTOFILL_HINT_EMAIL_ADDRESS, View.AUTOFILL_HINT_USERNAME);
        pwd.setAutofillHints(View.AUTOFILL_HINT_PASSWORD);
        box.addView(email, wide(8));
        box.addView(pwd, wide(8));
        TextView err = text("", 13, pal.alarm, false);
        box.addView(err, wide(6));
        box.addView(hint("Dasselbe Konto wie für DocCal und Grateful. Das Passwort wird nicht gespeichert, nur die "
                + "Anmeldung."));
        b.setPositiveButton("Anmelden", null).setNegativeButton("Abbrechen", null);
        AlertDialog d = b.create();
        show(d);
        Button go = d.getButton(DialogInterface.BUTTON_POSITIVE);
        go.setOnClickListener(v -> {
            String m = email.getText().toString().trim();
            String p = pwd.getText().toString().replaceAll("[\\r\\n]+$", "");
            if (m.isEmpty() || p.isEmpty()) {
                err.setText("E-Mail und Passwort eingeben.");
                return;
            }
            go.setEnabled(false);
            err.setTextColor(pal.muted);
            err.setText("Anmelden …");
            sync.login(m, p, error -> {
                if (error == null) {
                    d.dismiss();
                    return;
                }
                go.setEnabled(true);
                err.setTextColor(pal.alarm);
                err.setText(error);
            });
        });
    }

    private void show(AlertDialog d) {
        d.show();
        for (int which : new int[]{DialogInterface.BUTTON_POSITIVE, DialogInterface.BUTTON_NEGATIVE,
                DialogInterface.BUTTON_NEUTRAL}) {
            Button btn = d.getButton(which);
            if (btn == null) continue;
            btn.setTypeface(orbitron);
            btn.setAllCaps(false);
            btn.setTextColor(which == DialogInterface.BUTTON_POSITIVE ? pal.accent : pal.muted);
        }
    }

    private EditText field(String hint, int type) {
        EditText e = new EditText(a);
        e.setHint(hint);
        e.setInputType(type);
        e.setSingleLine(true);
        e.setTextColor(pal.text);
        e.setHintTextColor(pal.muted);
        e.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        return e;
    }

    private TextView hint(String s) {
        TextView t = text(s, 12, pal.muted, false);
        t.setLineSpacing(0, 1.15f);
        t.setPadding(0, dp(10), 0, 0);
        return t;
    }

    private LinearLayout.LayoutParams wide(int topDp) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(topDp);
        return lp;
    }

    private TextView text(String s, float sp, int color, boolean orb) {
        TextView t = new TextView(a);
        t.setText(s);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        t.setTextColor(color);
        if (orb) t.setTypeface(orbitron);
        return t;
    }

    private int dp(float v) {
        return Math.round(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, a.getResources().getDisplayMetrics()));
    }
}
