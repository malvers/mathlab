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
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
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
    private static final int TEXT = 0xFFEEEEEE, BG = 0xFF121212, MUTED = 0xFF8A93A6;

    private Typeface orbitron;
    private Button toggle, akku;
    private TextView title, micLine;
    private PillView pill;
    private int side, callTitle;
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
        // the round button is as big as Solita's circle in DocCall: half way between DocCall's old circle and
        // this old button (Doc, 08.11.2026) - DocCall's circleSize() has the same line, change both together
        side = Math.round((Math.min(dp(280), m.widthPixels * 0.72f) + Math.min(m.widthPixels * 0.56f, m.heightPixels * 0.34f)) / 2f);
        int pillW = Math.min(m.widthPixels - dp(32), dp(420));
        int pillH = Math.min(dp(96), Math.round(m.heightPixels * 0.18f));

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BG);

        title = new TextView(this);
        title.setText("DocNote");
        title.setTypeface(orbitron);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 30);
        title.setTextColor(LAMBDA);
        title.setGravity(Gravity.CENTER);
        FrameLayout.LayoutParams tp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.TOP);
        tp.topMargin = dp(12 + 28);   // the name at the height of "DocCall" in DocCall (Doc, 08.11.2026)
        root.addView(title, tp);

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
        // button and pill are placed in place() once the screen's height is known
        root.addView(toggle, new FrameLayout.LayoutParams(side, side, Gravity.TOP | Gravity.CENTER_HORIZONTAL));
        pill = new PillView(this);
        root.addView(pill, new FrameLayout.LayoutParams(pillW, pillH, Gravity.TOP | Gravity.CENTER_HORIZONTAL));

        LinearLayout bottom = new LinearLayout(this);
        bottom.setOrientation(LinearLayout.VERTICAL);
        bottom.setGravity(Gravity.CENTER_HORIZONTAL);

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
        bottom.addView(akku, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        // which microphone, very small at the bottom (Doc, 08.11.2026), so a Bluetooth microphone that did not
        // connect shows as "Telefon-Mikro" before a hike or a lesson, not afterwards in the transcript
        micLine = new TextView(this);
        micLine.setTypeface(orbitron);
        micLine.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        micLine.setTextColor(MUTED);
        micLine.setGravity(Gravity.CENTER);
        micLine.setSingleLine(true);
        micLine.setEllipsize(TextUtils.TruncateAt.END);
        LinearLayout.LayoutParams mp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        mp.topMargin = dp(12);
        bottom.addView(micLine, mp);

        FrameLayout.LayoutParams bp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM);
        bp.setMargins(dp(16), 0, dp(16), dp(24));
        root.addView(bottom, bp);

        root.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> place(v.getHeight()));
        setContentView(root);

        askPermissions();
        probeRecognizer();
    }

    /**
     * The button's centre goes exactly where Solita's circle sits in DocCall, the pill under it (Doc, 08.11.2026:
     * "den Startknopf und die Waveline so hoch bitte wie Solita"). DocCall's screen: 12 dp padding, its title
     * (28 sp) under a 28 dp margin, the gear row (56 dp) and 16 dp padding at the bottom, the circle centred in
     * between and lifted by 80 dp (DocCall MainActivity: LIFT_DP). Both apps have the same theme and window.
     */
    private void place(int h) {
        if (callTitle == 0) {
            TextView t = new TextView(this);
            t.setTypeface(orbitron);
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 28);
            t.setLineSpacing(0, 1.15f);
            t.setText("DocCall");
            t.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
            callTitle = t.getMeasuredHeight();
        }
        float centre = (dp(12) + dp(28) + callTitle + h - dp(16) - dp(56)) / 2f - dp(80);
        centre = Math.max(centre, title.getBottom() + dp(16) + side / 2f);   // landscape: never over the name
        toggle.setTranslationY(centre - side / 2f);
        pill.setTranslationY(centre + side / 2f + dp(40));
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
        String mic = AufnahmeService.shownMic(this);
        if (!mic.contentEquals(micLine.getText())) micLine.setText(mic);
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
