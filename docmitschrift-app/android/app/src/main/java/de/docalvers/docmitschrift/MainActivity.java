package de.docalvers.docmitschrift;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

/**
 * One lean screen (Doc, 06.11.2026: "oben drüber DocNote ... sonst gar nichts außer den großen Start-Button
 * und die Aufnahme ... kein Text drunter, das soll alles automatisch gehen"): the name, the big round
 * Start/Stopp button and the pill. What the pill's colours mean is written in PillView.
 * The button follows the microphone (Doc, 07.11.2026: "wenn ich das selber triggere, soll es definitiv auch
 * aufnehmen"): green "Start" records at once, red "Stopp" ends that recording. DocNote stays ready for the
 * next lesson in the timetable (pill yellow); "Aus" in its notification switches it off completely.
 */
public class MainActivity extends Activity {
    private static final int LAMBDA = 0xFFF5C242, UPSILON = 0xFFB02418, PHI = 0xFF799E31;
    private static final int TEXT = 0xFFEEEEEE, BG = 0xFF121212;

    private Typeface orbitron;
    private Button toggle, akku;
    private Boolean shownOn;                    // what the button shows now, null before the first update
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

        // sizes from the screen, so the button stays big in portrait and still fits in landscape
        DisplayMetrics m = getResources().getDisplayMetrics();
        int side = Math.round(Math.min(m.widthPixels * 0.56f, m.heightPixels * 0.34f));
        int pillW = Math.min(m.widthPixels - dp(32), dp(420));
        int pillH = Math.min(dp(96), Math.round(m.heightPixels * 0.18f));

        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setGravity(Gravity.CENTER_HORIZONTAL);
        col.setPadding(dp(16), dp(24), dp(16), dp(24));
        col.setBackgroundColor(BG);

        TextView title = new TextView(this);
        title.setText("DocNote");
        title.setTypeface(orbitron);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 30);
        title.setTextColor(LAMBDA);
        title.setGravity(Gravity.CENTER);
        col.addView(title, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        col.addView(new View(this), new LinearLayout.LayoutParams(1, 0, 1f));

        toggle = new Button(this);
        toggle.setAllCaps(false);
        toggle.setTypeface(orbitron);
        toggle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 26);
        toggle.setStateListAnimator(null);
        toggle.setGravity(Gravity.CENTER);
        toggle.setOnClickListener(v -> {
            v.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);
            press();
        });
        col.addView(toggle, new LinearLayout.LayoutParams(side, side));

        LinearLayout.LayoutParams pp = new LinearLayout.LayoutParams(pillW, pillH);
        pp.topMargin = dp(40);
        col.addView(new PillView(this), pp);

        col.addView(new View(this), new LinearLayout.LayoutParams(1, 0, 1f));

        // only while Android may still put DocNote to sleep - gone for good once allowed
        akku = new Button(this);
        akku.setText("Akku-Ausnahme erlauben");
        akku.setAllCaps(false);
        akku.setTypeface(orbitron);
        akku.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        akku.setTextColor(TEXT);
        akku.setBackground(shape(GradientDrawable.RECTANGLE, UPSILON));
        akku.setStateListAnimator(null);
        akku.setMinHeight(dp(58));
        akku.setOnClickListener(v -> startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                Uri.parse("package:" + getPackageName()))));
        col.addView(akku, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        setContentView(col);

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

    /** Stopp ends only the running recording (DocNote stays ready for the lessons); Start records now. */
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
        if (shownOn == null || shownOn != on) {
            shownOn = on;
            toggle.setText(on ? "Stopp" : "Start");
            toggle.setTextColor(on ? TEXT : BG);
            toggle.setBackground(new RippleDrawable(ColorStateList.valueOf(0x33FFFFFF),
                    shape(GradientDrawable.OVAL, on ? UPSILON : PHI), null));
        }
        boolean free = getSystemService(PowerManager.class).isIgnoringBatteryOptimizations(getPackageName());
        akku.setVisibility(free ? View.GONE : View.VISIBLE);
    }

    private GradientDrawable shape(int kind, int color) {
        GradientDrawable d = new GradientDrawable();
        d.setShape(kind);
        d.setColor(color);
        if (kind == GradientDrawable.RECTANGLE) d.setCornerRadius(dp(12));
        return d;
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }
}
