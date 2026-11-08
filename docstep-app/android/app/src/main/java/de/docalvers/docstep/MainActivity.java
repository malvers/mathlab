package de.docalvers.docstep;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.res.ColorStateList;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.text.InputType;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.HapticFeedbackConstants;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * DocStep tells people apart by how they walk, with the phone in the trouser pocket (Doc's idea, 07.11.2026,
 * from the McGill demo at ECML PKDD 2011 in Athens; the maths is in Gait).
 * Home: the people it knows (long-press deletes), "Lernen" and "Erkennen" as big round buttons like DocNote.
 * A walk: 3 s to put the phone away, a buzz, walk, a double buzz at the end. Only real walking counts, so
 * standing still at the start or the end does no harm.
 */
public class MainActivity extends Activity implements SensorEventListener {
    static final String TAG = "DocStep";
    private static final int LAMBDA = 0xFFF5C242, UPSILON = 0xFFB02418, PHI = 0xFF799E31;
    private static final int TEXT = 0xFFEEEEEE, BG = 0xFF121212, MUTED = 0xFF8A93A6, CARD = 0xFF1E1E1E;

    // seconds of walking wanted, the least that still counts, and when to give up (all in walking seconds,
    // except MAX: wall-clock seconds after the start buzz)
    private static final double LEARN_S = 30, LEARN_MIN_S = 15, LEARN_MAX_S = 75;
    private static final double CHECK_S = 12, CHECK_MIN_S = 6, CHECK_MAX_S = 40;
    private static final int COUNTDOWN_S = 3;
    private static final int SENSOR_US = 10_000;            // ask for 100 Hz, Gait resamples to 25 Hz
    private static final long START_BUZZ_MS = 500;
    private static final float BAR_FULL = 12f;               // m/s^2 off gravity that fills a bar

    private static final int NONE = 0, COUNTDOWN = 1, RECORDING = 2, RESULT = 3;

    private Typeface orbitron;
    private File dir;
    private List<Store.Walk> walks = new ArrayList<>();
    private List<Gait.Person> people = new ArrayList<>();

    private LinearLayout home, walkView, list, resultRow;
    private TextView circle, status, detail;
    private PillView pill;
    private Button cancel;
    private int side;

    private SensorManager sensors;
    private Sensor accel;
    private final Handler ui = new Handler(Looper.getMainLooper());

    // the walk in progress
    private boolean learning;
    private String learnName;
    private int phase = NONE;
    private int countdown;
    private long startedAt;
    private long[] ts = new long[8192];
    private float[] xs = new float[8192], ys = new float[8192], zs = new float[8192];
    private int n;
    private float barPeak;
    private long lastAnalysis;
    private double walked;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        orbitron = getResources().getFont(R.font.orbitron);
        dir = new File(getFilesDir(), "walks");
        sensors = getSystemService(SensorManager.class);
        accel = sensors.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        DisplayMetrics m = getResources().getDisplayMetrics();
        side = Math.round(Math.min(dp(260), m.widthPixels * 0.66f));
        int round = Math.min(dp(150), (m.widthPixels - dp(16) * 3) / 2);
        int pillW = Math.min(m.widthPixels - dp(32), dp(420));
        int pillH = Math.min(dp(96), Math.round(m.heightPixels * 0.12f));

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BG);

        TextView title = text(getString(R.string.app_name), 30, LAMBDA);
        FrameLayout.LayoutParams tp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.TOP);
        tp.topMargin = dp(12 + 28);        // the name at the height of DocNote's and DocCall's
        root.addView(title, tp);

        // ---- home: the people, then the two round buttons
        home = new LinearLayout(this);
        home.setOrientation(LinearLayout.VERTICAL);
        home.setPadding(dp(16), dp(100), dp(16), dp(32));
        ScrollView scroll = new ScrollView(this);
        list = new LinearLayout(this);
        list.setOrientation(LinearLayout.VERTICAL);
        scroll.addView(list);
        home.addView(scroll, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));
        LinearLayout buttons = new LinearLayout(this);
        buttons.setGravity(Gravity.CENTER);
        Button learn = round("Lernen", PHI);
        learn.setOnClickListener(v -> askName());
        Button check = round("Erkennen", LAMBDA);
        check.setOnClickListener(v -> startCheck());
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(round, round);
        lp.rightMargin = dp(8);
        buttons.addView(learn, lp);
        lp = new LinearLayout.LayoutParams(round, round);
        lp.leftMargin = dp(8);
        buttons.addView(check, lp);
        LinearLayout.LayoutParams bp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        bp.topMargin = dp(16);
        home.addView(buttons, bp);
        root.addView(home, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // ---- a walk: the circle (countdown, seconds, result), a line, a small line, the pill, the buttons
        walkView = new LinearLayout(this);
        walkView.setOrientation(LinearLayout.VERTICAL);
        walkView.setGravity(Gravity.CENTER_HORIZONTAL);
        walkView.setPadding(dp(16), dp(100), dp(16), dp(32));
        walkView.addView(new View(this), new LinearLayout.LayoutParams(1, 0, 1));
        circle = text("", 80, TEXT);
        circle.setPadding(side / 7, side / 7, side / 7, side / 7);
        circle.setMaxLines(2);
        circle.setAutoSizeTextTypeUniformWithConfiguration(16, 84, 2, TypedValue.COMPLEX_UNIT_SP);
        walkView.addView(circle, new LinearLayout.LayoutParams(side, side));
        status = text("", 20, TEXT);
        walkView.addView(status, margins(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT), dp(24)));
        detail = text("", 13, MUTED);
        walkView.addView(detail, margins(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT), dp(8)));
        pill = new PillView(this);
        walkView.addView(pill, margins(new LinearLayout.LayoutParams(pillW, pillH), dp(24)));
        walkView.addView(new View(this), new LinearLayout.LayoutParams(1, 0, 1));

        // cancelling needs a long press: in the pocket the screen stays on and may be touched
        cancel = rect("Abbrechen (lange drücken)", UPSILON, TEXT);
        cancel.setOnClickListener(v -> Toast.makeText(this, "Lange drücken zum Abbrechen", Toast.LENGTH_SHORT).show());
        cancel.setOnLongClickListener(v -> {
            abort(null);
            return true;
        });
        walkView.addView(cancel, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        resultRow = new LinearLayout(this);
        Button again = rect("Nochmal", LAMBDA, BG);
        again.setOnClickListener(v -> {
            if (learning) startWalk(true, learnName);
            else startCheck();
        });
        Button done = rect("Fertig", PHI, BG);
        done.setOnClickListener(v -> showHome());
        LinearLayout.LayoutParams rp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        rp.rightMargin = dp(8);
        resultRow.addView(again, rp);
        rp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        rp.leftMargin = dp(8);
        resultRow.addView(done, rp);
        walkView.addView(resultRow, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        root.addView(walkView, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        setContentView(root);
        reload();
        showHome();
        if (accel == null) Toast.makeText(this, "Dieses Handy hat keinen Beschleunigungssensor.", Toast.LENGTH_LONG).show();
    }

    @Override
    protected void onPause() {
        // Android stops the accelerometer for an app that is not in front, so a walk cannot go on
        if (phase == COUNTDOWN || phase == RECORDING) abort("Abgebrochen: DocStep war nicht mehr vorne.");
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        if (phase == COUNTDOWN || phase == RECORDING) abort(null);
        else if (phase == RESULT) showHome();
        else super.onBackPressed();
    }

    // ------------------------------------------------------------------ home

    private void reload() {
        walks = Store.all(dir);
        people = Store.people(walks);
        list.removeAllViews();
        Map<String, List<Store.Walk>> byName = Store.byName(walks);
        if (byName.isEmpty()) {
            TextView none = text("Noch niemand gelernt.\nTippe auf „Lernen“.", 16, MUTED);
            list.addView(none, margins(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT), dp(32)));
            return;
        }
        SimpleDateFormat day = new SimpleDateFormat("dd.MM.", Locale.GERMANY);
        for (Map.Entry<String, List<Store.Walk>> e : byName.entrySet()) {
            String name = e.getKey();
            int count = e.getValue().size();
            LinearLayout row = new LinearLayout(this);
            row.setOrientation(LinearLayout.VERTICAL);
            row.setPadding(dp(20), dp(14), dp(20), dp(14));
            row.setBackground(new RippleDrawable(ColorStateList.valueOf(0x33FFFFFF), shape(GradientDrawable.RECTANGLE, CARD), null));
            TextView who = text(name, 22, TEXT);
            who.setGravity(Gravity.START);
            row.addView(who);
            TextView info = text((count == 1 ? "1 Lauf" : count + " Läufe") + " · seit "
                    + day.format(new Date(e.getValue().get(0).created)), 13, MUTED);
            info.setGravity(Gravity.START);
            row.addView(info);
            row.setOnClickListener(v -> Toast.makeText(this, "Lange drücken zum Löschen", Toast.LENGTH_SHORT).show());
            row.setOnLongClickListener(v -> {
                v.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
                confirmDelete(name);
                return true;
            });
            LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT);
            p.bottomMargin = dp(10);
            list.addView(row, p);
        }
    }

    private void confirmDelete(String name) {
        new AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Dialog_Alert)
                .setTitle(name + " löschen?")
                .setMessage("Alle gelernten Läufe dieser Person werden vom Handy gelöscht.")
                .setPositiveButton("Löschen", (d, w) -> {
                    Store.delete(dir, name);
                    reload();
                })
                .setNegativeButton("Behalten", null)
                .show();
    }

    private void askName() {
        EditText field = new EditText(this);
        field.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_WORDS);
        field.setTypeface(orbitron);
        field.setSingleLine(true);
        field.setHint("Name");
        FrameLayout box = new FrameLayout(this);
        box.setPadding(dp(24), dp(8), dp(24), 0);
        box.addView(field);
        AlertDialog d = new AlertDialog.Builder(this, android.R.style.Theme_DeviceDefault_Dialog_Alert)
                .setTitle("Wer läuft?")
                .setMessage("Ein Name, den es schon gibt, bekommt einen weiteren Lauf dazu.")
                .setView(box)
                .setPositiveButton("Los", null)
                .setNegativeButton("Abbrechen", null)
                .create();
        d.setOnShowListener(x -> d.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
            String name = field.getText().toString().trim();
            if (name.isEmpty()) {
                field.setError("Bitte einen Namen");
                return;
            }
            d.dismiss();
            startWalk(true, name);
        }));
        d.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
        d.show();
        field.requestFocus();
    }

    private void startCheck() {
        if (people.isEmpty()) {
            Toast.makeText(this, "Erst jemanden lernen.", Toast.LENGTH_LONG).show();
            return;
        }
        startWalk(false, null);
    }

    private void showHome() {
        phase = NONE;
        walkView.setVisibility(View.GONE);
        home.setVisibility(View.VISIBLE);
        pill.setState(PillView.IDLE);
    }

    // ------------------------------------------------------------------ a walk

    private void startWalk(boolean learn, String name) {
        if (accel == null) return;
        learning = learn;
        learnName = name;
        n = 0;
        walked = 0;
        home.setVisibility(View.GONE);
        walkView.setVisibility(View.VISIBLE);
        cancel.setVisibility(View.VISIBLE);
        resultRow.setVisibility(View.GONE);
        pill.setState(PillView.IDLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        phase = COUNTDOWN;
        countdown = COUNTDOWN_S;
        status.setTextColor(TEXT);
        status.setText(learn ? name + ": Handy in die Hosentasche" : "Handy in die Hosentasche");
        detail.setText(learn ? "dann ca. " + (int) LEARN_S + " s normal gehen" : "dann ca. " + (int) CHECK_S + " s normal gehen");
        setCircle(String.valueOf(countdown), MUTED);
        ui.postDelayed(tickCountdown, 1000);
    }

    private final Runnable tickCountdown = new Runnable() {
        @Override
        public void run() {
            if (phase != COUNTDOWN) return;
            countdown--;
            if (countdown > 0) {
                setCircle(String.valueOf(countdown), MUTED);
                buzz(0, 40);
                ui.postDelayed(this, 1000);
                return;
            }
            // the start buzz first, then the sensor, so the vibration itself is not recorded as a step
            buzz(0, START_BUZZ_MS);
            phase = RECORDING;
            setCircle("Los", PHI);
            status.setText("Jetzt gehen");
            detail.setText("");
            pill.setState(PillView.WAITING);
            dim(true);
            ui.postDelayed(startSensor, START_BUZZ_MS + 100);
        }
    };

    private final Runnable startSensor = new Runnable() {
        @Override
        public void run() {
            if (phase != RECORDING) return;
            startedAt = System.currentTimeMillis();
            lastAnalysis = startedAt;
            sensors.registerListener(MainActivity.this, accel, SENSOR_US);
            ui.postDelayed(tickRecording, 70);
        }
    };

    /** 14 times a second a new bar in the pill; once a second a look at how much walking there is. */
    private final Runnable tickRecording = new Runnable() {
        @Override
        public void run() {
            if (phase != RECORDING) return;
            pill.push(barPeak / BAR_FULL);
            barPeak = 0;
            long now = System.currentTimeMillis();
            if (now - lastAnalysis >= 1000) {
                lastAnalysis = now;
                analyse(now);
                if (phase != RECORDING) return;
            }
            ui.postDelayed(this, 70);
        }
    };

    private void analyse(long now) {
        double want = learning ? LEARN_S : CHECK_S, max = learning ? LEARN_MAX_S : CHECK_MAX_S;
        float[] mag = Gait.magnitude(Gait.resample3(ts, xs, ys, zs, n));
        List<int[]> runs = Gait.walking(mag);
        walked = Gait.seconds(runs);
        // walking right now: a run reaches into the last 2.5 s (the detector lags by half a window plus the trim)
        boolean now_ = !runs.isEmpty() && runs.get(runs.size() - 1)[1] >= mag.length - 2.5 * Gait.RATE;
        pill.setState(now_ ? PillView.WALKING : PillView.WAITING);
        setCircle(Math.min((int) walked, (int) want) + " s", now_ ? PHI : LAMBDA);
        status.setTextColor(now_ ? PHI : LAMBDA);
        status.setText(now_ ? "Gehen erkannt" : "Warte aufs Gehen …");
        detail.setText("von " + (int) want + " s");
        if (walked >= want || (now - startedAt) / 1000.0 >= max) endWalk();
    }

    @Override
    public void onSensorChanged(SensorEvent e) {
        if (phase != RECORDING) return;
        if (n == ts.length) {
            int cap = ts.length * 2;
            ts = java.util.Arrays.copyOf(ts, cap);
            xs = java.util.Arrays.copyOf(xs, cap);
            ys = java.util.Arrays.copyOf(ys, cap);
            zs = java.util.Arrays.copyOf(zs, cap);
        }
        float x = e.values[0], y = e.values[1], z = e.values[2];
        ts[n] = e.timestamp;
        xs[n] = x;
        ys[n] = y;
        zs[n] = z;
        n++;
        float dev = (float) Math.abs(Math.sqrt(x * x + y * y + z * z) - Gait.G);
        if (dev > barPeak) barPeak = dev;
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    private void stopRecording() {
        sensors.unregisterListener(this);
        ui.removeCallbacks(tickCountdown);
        ui.removeCallbacks(startSensor);
        ui.removeCallbacks(tickRecording);
        dim(false);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    private void abort(String why) {
        stopRecording();
        showHome();
        if (why != null) Toast.makeText(this, why, Toast.LENGTH_LONG).show();
    }

    /** The end: double buzz, then learn or recognise. */
    private void endWalk() {
        stopRecording();
        buzz(0, 300, 200, 300);
        phase = RESULT;
        pill.setState(PillView.IDLE);
        cancel.setVisibility(View.GONE);
        resultRow.setVisibility(View.VISIBLE);
        float[][] xyz = Gait.resample3(ts, xs, ys, zs, n);
        List<float[][]> segs = Gait.segments(xyz);
        double secs = Gait.seconds(Gait.walking(Gait.magnitude(xyz)));
        Log.i(TAG, String.format(Locale.ROOT, "walk done: %d samples, %.1f s, %.1f s walking, %d segments",
                n, xyz[0].length / Gait.RATE, secs, segs.size()));
        if (learning) learnFrom(xyz, segs, secs);
        else recognise(segs, secs);
    }

    private void learnFrom(float[][] xyz, List<float[][]> segs, double secs) {
        if (secs < LEARN_MIN_S) {
            tooLittle(secs);
            return;
        }
        try {
            new Gait.Template(segs);    // fails early if this walk cannot become a template
            Store.save(dir, new Store.Walk(learnName, System.currentTimeMillis(), (float) Gait.RATE, xyz));
        } catch (IOException | IllegalArgumentException ex) {
            Log.w(TAG, "learning failed", ex);
            setCircle("Fehler", UPSILON);
            status.setTextColor(UPSILON);
            status.setText("Konnte nicht speichern");
            detail.setText(String.valueOf(ex.getMessage()));
            return;
        }
        reload();
        int count = Store.byName(walks).get(learnName).size();
        setCircle(learnName, PHI);
        status.setTextColor(PHI);
        status.setText(count == 1 ? "gelernt" : count + ". Lauf gelernt");
        detail.setText(String.format(Locale.GERMANY, "%.0f s Gehen", secs));
    }

    private void recognise(List<float[][]> segs, double secs) {
        if (secs < CHECK_MIN_S) {
            tooLittle(secs);
            return;
        }
        Gait.Result r = Gait.recognise(people, segs);
        if (r == null) {
            tooLittle(secs);
            return;
        }
        int pct = (int) Math.round(100 * r.confidence);
        String scores = String.format(Locale.GERMANY, "Score %.2f · Schwelle %.2f", r.score, Gait.THRESHOLD);
        if (r.second != null) scores += String.format(Locale.GERMANY, " · 2. %s %.2f", r.second, r.secondScore);
        Log.i(TAG, "result " + r.name + " known=" + r.known + " " + scores);
        if (r.known) {
            setCircle(r.name, PHI);
            status.setTextColor(PHI);
            status.setText("Sicherheit " + pct + " %");
        } else {
            setCircle("Unbekannt", UPSILON);
            status.setTextColor(UPSILON);
            status.setText("Am ähnlichsten: " + r.name);
        }
        detail.setText(scores);
    }

    private void tooLittle(double secs) {
        setCircle("?", LAMBDA);
        status.setTextColor(LAMBDA);
        status.setText("Zu wenig Gehen erkannt");
        detail.setText(String.format(Locale.GERMANY, "%.0f s – bitte nochmal und etwas länger gehen", secs));
    }

    // ------------------------------------------------------------------ small helpers

    private void setCircle(String s, int rimColor) {
        circle.setText(s);
        GradientDrawable d = shape(GradientDrawable.OVAL, CARD);
        d.setStroke(dp(4), rimColor);
        circle.setBackground(d);
        circle.setTextColor(rimColor == MUTED ? TEXT : rimColor);
    }

    /** Dark screen while walking (it stays on, see FLAG_KEEP_SCREEN_ON), normal again afterwards. */
    private void dim(boolean on) {
        WindowManager.LayoutParams lp = getWindow().getAttributes();
        lp.screenBrightness = on ? 0.02f : WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
        getWindow().setAttributes(lp);
    }

    private void buzz(long... pattern) {
        Vibrator v;
        if (Build.VERSION.SDK_INT >= 31) v = getSystemService(VibratorManager.class).getDefaultVibrator();
        else v = getSystemService(Vibrator.class);
        if (v == null || !v.hasVibrator()) return;
        v.vibrate(VibrationEffect.createWaveform(pattern, -1));
    }

    private TextView text(String s, int sp, int color) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTypeface(orbitron);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        t.setTextColor(color);
        t.setGravity(Gravity.CENTER);
        return t;
    }

    private Button round(String label, int color) {
        Button b = new Button(this);
        b.setText(label);
        b.setAllCaps(false);
        b.setTypeface(orbitron);
        b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 19);
        b.setTextColor(BG);
        b.setStateListAnimator(null);
        b.setGravity(Gravity.CENTER);
        b.setBackground(new RippleDrawable(ColorStateList.valueOf(0x33FFFFFF), shape(GradientDrawable.OVAL, color), null));
        return b;
    }

    private Button rect(String label, int color, int textColor) {
        Button b = new Button(this);
        b.setText(label);
        b.setAllCaps(false);
        b.setTypeface(orbitron);
        b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        b.setTextColor(textColor);
        b.setStateListAnimator(null);
        b.setMinHeight(dp(58));
        b.setBackground(new RippleDrawable(ColorStateList.valueOf(0x33FFFFFF), shape(GradientDrawable.RECTANGLE, color), null));
        return b;
    }

    private static LinearLayout.LayoutParams margins(LinearLayout.LayoutParams p, int top) {
        p.topMargin = top;
        return p;
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
