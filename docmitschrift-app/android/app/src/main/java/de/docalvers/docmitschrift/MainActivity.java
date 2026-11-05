package de.docalvers.docmitschrift;

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
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/** One screen: Start/Stop, which microphone, how much today, what still waits for the Mac. */
public class MainActivity extends Activity {
    private static final int LAMBDA = 0xFFF5C242, UPSILON = 0xFFB02418, PHI = 0xFF799E31;
    private static final int TEXT = 0xFFEEEEEE, MUTED = 0xFF9A9A9A, BG = 0xFF121212;

    private Typeface orbitron;
    private TextView status, mic, today, waiting, problem;
    private Button toggle, akku;
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

        col.addView(text("DocMitschrift", 30, LAMBDA));
        col.addView(text("Nimmt Deinen Tag auf. Der Mac schreibt mit.", 14, MUTED), gap(4));

        status = text("", 18, TEXT);
        col.addView(status, gap(24));
        mic = text("", 14, TEXT);
        col.addView(mic, gap(8));
        today = text("", 14, TEXT);
        col.addView(today, gap(8));
        waiting = text("", 14, MUTED);
        col.addView(waiting, gap(8));
        problem = text("", 14, UPSILON);
        col.addView(problem, gap(8));

        toggle = button("", PHI, BG);
        toggle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
        toggle.setMinHeight(dp(72));
        toggle.setOnClickListener(v -> press());
        col.addView(toggle, gap(24));

        PillView pill = new PillView(this, orbitron);
        LinearLayout.LayoutParams pp = gap(32);
        pp.height = dp(150);
        col.addView(pill, pp);

        akku = button("Akku-Ausnahme erlauben", UPSILON, TEXT);
        akku.setOnClickListener(v -> startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                Uri.parse("package:" + getPackageName()))));
        col.addView(akku, gap(12));

        col.addView(text("Abends das Pixel per USB an den Mac und dort „mitschrift“ laufen lassen: "
                + "Der Mac holt die Aufnahmen, schreibt sie mit, sortiert sie nach Stundenplan und löscht sie hier.", 12, MUTED), gap(32));

        ScrollView scroll = new ScrollView(this);
        scroll.setBackgroundColor(BG);
        scroll.addView(col);
        setContentView(scroll);

        askPermissions();
        probeRecognizer();
    }

    /** For the planned live text: can this phone recognise German on the device, without the internet? Log only. */
    private void probeRecognizer() {
        if (Build.VERSION.SDK_INT < 33) return;
        try {
            android.util.Log.i(AufnahmeService.TAG, "on-device recognition available: "
                    + android.speech.SpeechRecognizer.isOnDeviceRecognitionAvailable(this));
            android.speech.SpeechRecognizer sr = android.speech.SpeechRecognizer.createOnDeviceSpeechRecognizer(this);
            Intent i = new Intent(android.speech.RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                    .putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE, "de-DE");
            sr.checkRecognitionSupport(i, getMainExecutor(), new android.speech.RecognitionSupportCallback() {
                @Override
                public void onSupportResult(android.speech.RecognitionSupport r) {
                    android.util.Log.i(AufnahmeService.TAG, "installed " + r.getInstalledOnDeviceLanguages()
                            + " pending " + r.getPendingOnDeviceLanguages() + " supported " + r.getSupportedOnDeviceLanguages());
                    sr.destroy();
                }

                @Override
                public void onError(int error) {
                    android.util.Log.i(AufnahmeService.TAG, "recognition support error " + error);
                    sr.destroy();
                }
            });
        } catch (RuntimeException e) {
            android.util.Log.i(AufnahmeService.TAG, "recognizer probe failed", e);
        }
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

    private void askPermissions() {
        List<String> want = new ArrayList<>();
        want.add(Manifest.permission.RECORD_AUDIO);
        if (Build.VERSION.SDK_INT >= 33) want.add(Manifest.permission.POST_NOTIFICATIONS);
        if (Build.VERSION.SDK_INT >= 31) want.add(Manifest.permission.BLUETOOTH_CONNECT);
        List<String> missing = new ArrayList<>();
        for (String p : want) if (checkSelfPermission(p) != PackageManager.PERMISSION_GRANTED) missing.add(p);
        if (!missing.isEmpty()) requestPermissions(missing.toArray(new String[0]), 1);
    }

    private void press() {
        if (AufnahmeService.recording) {
            AufnahmeService.stop(this);
            return;
        }
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Ohne Mikrofon-Erlaubnis geht es nicht.", Toast.LENGTH_LONG).show();
            askPermissions();
            return;
        }
        AufnahmeService.start(this);
    }

    private void update() {
        boolean on = AufnahmeService.recording;
        if (on) {
            status.setText("● Aufnahme läuft · " + duration(System.currentTimeMillis() - AufnahmeService.since));
            status.setTextColor(PHI);
            mic.setText("Mikro: " + (AufnahmeService.mic.isEmpty() ? "wird geöffnet …" : AufnahmeService.mic));
            toggle.setText("Stopp");
            toggle.setBackground(round(UPSILON));
            toggle.setTextColor(TEXT);
        } else {
            status.setText("● Keine Aufnahme");
            status.setTextColor(MUTED);
            mic.setText("");
            toggle.setText("Start");
            toggle.setBackground(round(PHI));
            toggle.setTextColor(BG);
        }
        mic.setVisibility(on ? View.VISIBLE : View.GONE);

        today.setText("Heute aufgenommen: " + duration(AufnahmeService.recordedToday(this)));
        int n = 0;
        long bytes = 0;
        File[] all = AufnahmeService.dir(this).listFiles();
        if (all != null) for (File f : all) if (f.getName().endsWith(".m4a")) {
            n++;
            bytes += f.length();
        }
        waiting.setText(n == 0 ? "Nichts wartet auf den Mac."
                : "Wartet auf den Mac: " + n + (n == 1 ? " Stück · " : " Stücke · ") + String.format(Locale.GERMANY, "%.0f MB", bytes / 1e6));

        String p = AufnahmeService.problem;
        problem.setText(p);
        problem.setVisibility(p.isEmpty() ? View.GONE : View.VISIBLE);

        boolean free = getSystemService(PowerManager.class).isIgnoringBatteryOptimizations(getPackageName());
        akku.setVisibility(free ? View.GONE : View.VISIBLE);
    }

    private static String duration(long ms) {
        long min = ms / 60000;
        return min < 60 ? min + " min" : (min / 60) + " h " + String.format(Locale.GERMANY, "%02d", min % 60) + " min";
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
