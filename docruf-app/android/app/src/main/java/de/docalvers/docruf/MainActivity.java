package de.docalvers.docruf;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/** One screen: is the line open, speak aloud or not, a test call, the battery exemption, the last calls. */
public class MainActivity extends Activity {
    private static final int LAMBDA = 0xFFF5C242, UPSILON = 0xFFB02418, PHI = 0xFF799E31;
    private static final int TEXT = 0xFFEEEEEE, MUTED = 0xFF9A9A9A, CARD = 0xFF1E1E1E, BG = 0xFF121212;

    private Typeface orbitron;
    private TextView status;
    private Button akku;
    private LinearLayout list;
    private String shown = "";
    private final Handler tick = new Handler(Looper.getMainLooper());
    private final Runnable refresh = new Runnable() {
        @Override
        public void run() {
            update();
            tick.postDelayed(this, 1000);
        }
    };

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        orbitron = getResources().getFont(R.font.orbitron);

        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(16), dp(24), dp(16), dp(24));

        col.addView(text("DocRuf", 34, LAMBDA));
        col.addView(text("Solita ruft Dich auf dem Phone.", 14, MUTED), gap(4));

        status = text("", 18, TEXT);
        col.addView(status, gap(24));

        Switch speak = new Switch(this);
        speak.setText("Ansagen");
        speak.setTypeface(orbitron);
        speak.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        speak.setTextColor(TEXT);
        speak.setMinHeight(dp(58));
        speak.setChecked(Rufe.speak(this));
        speak.setOnCheckedChangeListener((b, on) -> Rufe.setSpeak(this, on));
        col.addView(speak, gap(16));
        col.addView(text("An: Solita sagt den Ruf laut an. Aus: nur Ton und Vibration.", 12, MUTED));

        Button probe = button("Probe-Ruf", LAMBDA, BG);
        probe.setOnClickListener(v -> {
            RufService.probe(this);
            Toast.makeText(this, "Probe-Ruf ist unterwegs", Toast.LENGTH_SHORT).show();
        });
        col.addView(probe, gap(24));

        akku = button("Akku-Ausnahme erlauben", UPSILON, TEXT);
        akku.setOnClickListener(v -> startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                Uri.parse("package:" + getPackageName()))));
        col.addView(akku, gap(12));

        col.addView(text("Letzte Rufe", 18, LAMBDA), gap(32));
        list = new LinearLayout(this);
        list.setOrientation(LinearLayout.VERTICAL);
        col.addView(list, gap(8));

        ScrollView scroll = new ScrollView(this);
        scroll.setBackgroundColor(BG);
        scroll.addView(col);
        setContentView(scroll);

        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1);
        }
        RufService.start(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        tick.post(refresh);
    }

    @Override
    protected void onPause() {
        tick.removeCallbacks(refresh);
        super.onPause();
    }

    private void update() {
        String s = RufService.state;
        long ago = (System.currentTimeMillis() - RufService.lastBeat) / 1000;
        if (s.equals("verbunden") && ago > 120) s = "getrennt";
        int color = s.equals("verbunden") ? PHI : s.equals("verbinde") ? LAMBDA : UPSILON;
        String word = s.equals("verbunden") ? "Leitung steht" : s.equals("verbinde") ? "Verbinde …"
                : s.equals("kein Kanal") ? "Kein Kanal eingebaut" : "Keine Leitung";
        status.setText("● " + word);
        status.setTextColor(color);

        boolean free = getSystemService(PowerManager.class).isIgnoringBatteryOptimizations(getPackageName());
        akku.setVisibility(free ? View.GONE : View.VISIBLE);

        JSONArray a = Rufe.all(this);
        String now = a.toString();
        if (now.equals(shown)) return;
        shown = now;
        list.removeAllViews();
        if (a.length() == 0) list.addView(text("Noch keine.", 14, MUTED));
        SimpleDateFormat f = new SimpleDateFormat("dd.MM. HH:mm", Locale.GERMANY);
        for (int i = 0; i < a.length(); i++) {
            JSONObject r = a.optJSONObject(i);
            TextView row = text(f.format(new Date(r.optLong("time") * 1000)) + "  " + r.optString("title")
                    + (r.optBoolean("ok") ? "  ✓" : "") + "\n" + r.optString("text"), 14, TEXT);
            row.setPadding(dp(12), dp(10), dp(12), dp(10));
            row.setBackground(round(CARD));
            // a tap plays the call again; Solita's MP3 only lives 3 h on ntfy.sh, after that the phone reads it
            row.setOnClickListener(v -> Ansage.get(this).say(r.optString("text"), r.optString("audio")));
            list.addView(row, gap(8));
        }
    }

    private TextView text(String s, int sp, int color) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTypeface(orbitron);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        t.setTextColor(color);
        t.setLineSpacing(0, 1.15f);
        return t;
    }

    private Button button(String s, int bg, int fg) {
        Button b = new Button(this);
        b.setText(s);
        b.setAllCaps(false);
        b.setTypeface(orbitron);
        b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        b.setTextColor(fg);
        b.setBackground(round(bg));
        b.setStateListAnimator(null);
        b.setMinHeight(dp(58));
        b.setGravity(Gravity.CENTER);
        return b;
    }

    private GradientDrawable round(int color) {
        GradientDrawable d = new GradientDrawable();
        d.setColor(color);
        d.setCornerRadius(dp(12));
        return d;
    }

    private LinearLayout.LayoutParams gap(int top) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        p.topMargin = dp(top);
        return p;
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }
}
