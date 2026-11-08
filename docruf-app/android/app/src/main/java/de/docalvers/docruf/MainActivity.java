package de.docalvers.docruf;

import android.Manifest;
import android.animation.ValueAnimator;
import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
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
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.text.StaticLayout;
import android.text.TextUtils;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewOutlineProvider;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.OvershootInterpolator;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

/**
 * Lean screen (Doc, 07.11.2026): "DocCall" centred, in the middle one round button for Doc's voice -
 * "Antworten" when Solita asked something, otherwise "Frag Solita" - with a green dot under it while the line
 * stands, and a small gear at the bottom. While Solita speaks a call, her portrait fills that circle, her sentence
 * runs under it, and both fade slowly when she is done. The answer is heard right in the circle - Android's speech recognition
 * without Google's dialog (Doc: "dieser widerliche Dialog von Google"); the words appear while Doc speaks.
 * Behind the gear: the line in words, speak aloud, test call and the last calls.
 */
public class MainActivity extends Activity {
    private static final int LAMBDA = 0xFFF5C242, UPSILON = 0xFFB02418, PHI = 0xFF799E31;
    private static final int TEXT = 0xFFEEEEEE, MUTED = 0xFF8A93A6, CARD = 0xFF0E244E, BG = 0xFF0A1428;
    private static final long FADE_IN_MS = 450, FADE_OUT_MS = 2500, BACK_TO_IDLE_MS = 3000;
    private static final long HOLD_MS = 4000;   // her portrait and sentence stay a while after she is done (Doc, 07.11.2026)
    private static final int LIFT_DP = 80;      // how far the circle sits above the middle (optical centre)
    private static final int ASK_MIC = 2;
    static final String ACTION_CALL = "de.docalvers.docruf.RUF";

    // read by the service: DocCall in front means a call needs no banner, Solita shows up right here
    static volatile boolean visible;
    private boolean overLock;     // brought up by a call on a locked phone: shown over the lock screen until it goes
    private View dot;
    private TextView caption;
    // Google ends a sentence after a short breath; DocCall listens on and only sends after this much quiet
    // (Doc, 07.11.2026: "Ich mache eine kurze Pause, wusch, ist es fort"). A tap sends at once.
    private static final long PAUSE_MS = 2500, RESTART_MS = 120;

    private Typeface orbitron;
    private TextView lineWord;
    private Button akku;
    private ImageView face;
    private ImageView mic;
    private TextView label;
    private View halo;
    private GradientDrawable ring;
    private View circleView;
    private ValueAnimator pulse;
    private View settings;
    private LinearLayout list;
    private String shown = "";
    private String word = "";
    private boolean faceOn;

    // listening: idle | listening | sending; the call it answers and its notification (0 = from the app)
    private SpeechRecognizer ear;
    private UsbMic usb;          // a USB microphone (DJI receiver) is heard by DocCall itself, see UsbMic
    private String mode = "idle";
    private String answerId = "";
    private int answerNote;
    private String said = "";    // sentences already finished in this answer
    private String heard = "";   // the sentence he is speaking right now
    private final Runnable backToIdle = this::idle;
    private final Runnable quiet = () -> {
        Log.d(RufService.TAG, "ear quiet mode=" + mode);
        if (!mode.equals("listening")) return;
        if (ear != null) ear.cancel();
        sendAll("");
    };
    private final Runnable again = () -> {
        Log.d(RufService.TAG, "ear again mode=" + mode);
        if (mode.equals("listening") && ear != null) ear.startListening(ask());
    };
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

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BG);
        root.addView(mainLayer(), new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        settings = settingsPanel();
        root.addView(settings);
        setContentView(root);

        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1);
        }
        RufService.start(this);
        fromIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        fromIntent(intent);
    }

    /**
     * A call on a locked or dark phone brings DocCall up over the lock screen, like an incoming call; "Sprechen" in
     * a call's notification opens the app straight into listening, for exactly that call.
     */
    private void fromIntent(Intent i) {
        if (i != null && ACTION_CALL.equals(i.getAction())) {
            i.setAction(null);
            overLock = true;
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            return;
        }
        if (i == null || !Sprechen.ACTION.equals(i.getAction())) return;
        String id = i.getStringExtra("id");
        int note = i.getIntExtra("note", 0);
        i.setAction(null);   // turning the phone must not start listening again
        tick.post(() -> listen(id == null ? "" : id, note));
    }

    /** A tap on the circle: listen; while listening, a tap means "done" and sends what was heard. */
    private void tap() {
        if (mode.equals("listening")) {
            if (ear != null) ear.cancel();
            sendAll(heard);
        } else if (!mode.equals("sending")) {
            // an answer belongs to her open question; anything else is a new question of his, tied to no call
            listen(questionOpen() ? Rufe.newestId(this) : "", 0);
        }
    }

    private static final long QUESTION_S = 3600;   // an unanswered question of hers stays open for an hour

    /** Solita's newest call asked something (a "?"), recently, and Doc has not answered it yet. */
    private boolean questionOpen() {
        JSONArray a = Rufe.all(this);
        if (a.length() == 0) return false;
        JSONObject r = a.optJSONObject(0);
        return r.optString("text").contains("?") && !r.has("antwort")
                && System.currentTimeMillis() / 1000 - r.optLong("time") < QUESTION_S;
    }

    /** The word in the circle: "Antworten" when she asked something, otherwise "Frag Solita" (Doc, 07.11.2026). */
    private String idleWord() {
        return questionOpen() ? "Antworten" : "Frag Solita";
    }

    private void listen(String id, int note) {
        answerId = id;
        answerNote = note;
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, ASK_MIC);
            return;
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            show("Keine Spracherkennung auf dem Phone", MUTED, true);
            return;
        }
        tick.removeCallbacks(backToIdle);
        hideFace();
        if (ear == null) {
            ear = SpeechRecognizer.createSpeechRecognizer(this);
            ear.setRecognitionListener(new Ear());
        }
        said = "";
        heard = "";
        mode = "listening";
        stopUsb();
        usb = UsbMic.open(this);
        show("Ich höre …", MUTED, false);
        breathe(true);
        ear.startListening(ask());
    }

    private Intent ask() {
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                .putExtra(RecognizerIntent.EXTRA_LANGUAGE, "de-DE")
                .putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        if (usb != null && Build.VERSION.SDK_INT >= 33) {
            // the recognizer reads DocCall's own 16 kHz mono from the USB microphone instead of opening one
            i.putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE, usb.next())
                    .putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_CHANNEL_COUNT, 1)
                    .putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_ENCODING, android.media.AudioFormat.ENCODING_PCM_16BIT)
                    .putExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_SAMPLING_RATE, UsbMic.RATE);
        }
        return i;
    }

    private void stopUsb() {
        if (usb != null) usb.stop();
        usb = null;
    }

    /** One sentence is done: keep it, listen on, and send only when he stays quiet for PAUSE_MS. */
    private void sentence(String text) {
        if (!text.isEmpty()) said = said.isEmpty() ? text : said + " " + text;
        heard = "";
        if (!said.isEmpty()) mine(said);
        tick.removeCallbacks(quiet);
        tick.postDelayed(quiet, PAUSE_MS);
        tick.removeCallbacks(again);
        tick.postDelayed(again, RESTART_MS);   // the recognizer needs a moment before it takes the next sentence
    }

    /** Stop listening and send everything heard; `rest` = a sentence still in progress. */
    private void sendAll(String rest) {
        tick.removeCallbacks(quiet);
        tick.removeCallbacks(again);
        stopUsb();
        String all = (said + " " + (rest == null ? "" : rest)).trim();
        if (all.isEmpty()) show("Nichts gehört", MUTED, true);
        else send(all);
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] results) {
        super.onRequestPermissionsResult(req, perms, results);
        if (req != ASK_MIC) return;
        if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED) listen(answerId, answerNote);
        else show("Ohne Mikrofon kein Antworten", MUTED, true);
    }

    /** What the phone heard: live words in the circle, then off to the Mac. */
    private final class Ear implements RecognitionListener {
        @Override
        public void onReadyForSpeech(Bundle b) {
        }

        @Override
        public void onBeginningOfSpeech() {
        }

        @Override
        public void onRmsChanged(float db) {
            if (!mode.equals("listening")) return;
            float s = 1f + Math.max(0f, Math.min(db, 10f)) / 40f;   // the microphone moves a little with his voice
            mic.setScaleX(s);
            mic.setScaleY(s);
        }

        @Override
        public void onBufferReceived(byte[] buffer) {
        }

        @Override
        public void onEndOfSpeech() {
        }

        @Override
        public void onError(int error) {
            Log.d(RufService.TAG, "ear error " + error + " mode=" + mode + " said=" + said.length() + " heard=" + heard.length());
            if (!mode.equals("listening")) return;
            boolean silent = error == SpeechRecognizer.ERROR_NO_MATCH || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT;
            boolean busy = error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY || error == SpeechRecognizer.ERROR_CLIENT;
            if (said.isEmpty() && heard.isEmpty()) {
                // nothing yet: a busy recognizer gets another go, silence or a real error ends it
                if (busy) {
                    tick.removeCallbacks(again);
                    tick.postDelayed(again, RESTART_MS * 3);
                } else {
                    stopUsb();
                    show(silent ? "Nichts gehört" : "Hat nicht geklappt", MUTED, true);
                }
                return;
            }
            if (silent || busy) {
                // quiet after a sentence: listen on, the PAUSE_MS clock (started with the sentence) decides
                if (!heard.isEmpty()) sentence(heard);
                else {
                    tick.removeCallbacks(again);
                    tick.postDelayed(again, RESTART_MS);
                }
                return;
            }
            sendAll(heard);   // the line broke off: what he said so far goes out
        }

        @Override
        public void onResults(Bundle b) {
            Log.d(RufService.TAG, "ear results mode=" + mode + " text=" + first(b).length());
            if (!mode.equals("listening")) return;
            String text = first(b);
            sentence(text.isEmpty() ? heard : text);
        }

        @Override
        public void onPartialResults(Bundle b) {
            if (!mode.equals("listening")) return;
            String text = first(b);
            if (text.isEmpty()) return;
            tick.removeCallbacks(quiet);   // he speaks again: no sending yet
            heard = text;
            mine((said + " " + text).trim());
        }

        @Override
        public void onEvent(int type, Bundle b) {
        }

        private String first(Bundle b) {
            ArrayList<String> r = b == null ? null : b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
            return r == null || r.isEmpty() || r.get(0) == null ? "" : r.get(0).trim();
        }
    }

    private void send(String text) {
        mode = "sending";
        breathe(false);
        mine(text);
        label.setText("Unterwegs …");
        label.setTextColor(MUTED);
        String id = answerId;
        int note = answerNote;
        Context app = getApplicationContext();
        new Thread(() -> {
            boolean ok = Antwort.send(text, id);
            Antwort.finished(app, id, note, text, ok);
            runOnUiThread(() -> {
                show(ok ? "✓ Angekommen" : "Ging nicht raus", ok ? TEXT : UPSILON, true);
                // from the notification Doc came from somewhere else: back there after the check mark
                if (ok && note != 0) tick.postDelayed(() -> moveTaskToBack(true), BACK_TO_IDLE_MS);
            });
        }, "docruf-sprechen").start();
    }

    /** One message in the circle; `thenIdle` = back to "Antworten" / "Frag Solita" a moment later. */
    private void show(String s, int color, boolean thenIdle) {
        label.setText(s);
        label.setTextColor(color);
        if (!thenIdle) return;
        mode = "shown";
        breathe(false);
        tick.removeCallbacks(backToIdle);
        tick.postDelayed(backToIdle, BACK_TO_IDLE_MS);
    }

    private void idle() {
        mode = "idle";
        breathe(false);
        String w = idleWord();
        label.setText(w);
        label.setTextColor(TEXT);
        circleView.setContentDescription(w);
        if (!faceOn) {
            caption.animate().cancel();
            caption.animate().setStartDelay(0).alpha(0f).setDuration(600).start();   // his words go quietly
        }
        face(true);   // she may have started while he was answering: now she gets the circle
    }

    /**
     * Doc's own words appear where hers do, under the circle, with all the room down to the gear; the circle
     * only says "Ich höre …" (Doc, 07.11.2026: in the circle they were cut off). The newest words stay in sight.
     */
    private void mine(String text) {
        caption.animate().cancel();
        caption.setEllipsize(null);
        caption.setText(tail(text));
        caption.setAlpha(1f);
    }

    /** As much of the end of `text` as fits the caption, "… " in front when the start had to go. */
    private String tail(String text) {
        int w = caption.getWidth() - caption.getPaddingLeft() - caption.getPaddingRight();
        if (w <= 0) return text;
        String body = text, shown = text;
        // TextView can only ellipsize the end of several lines, so the start is dropped word by word here
        while (StaticLayout.Builder.obtain(shown, 0, shown.length(), caption.getPaint(), w).build().getLineCount()
                > caption.getMaxLines()) {
            int sp = body.indexOf(' ');
            if (sp < 0) break;
            body = body.substring(sp + 1);
            shown = "… " + body;
        }
        return shown;
    }

    /** While the phone listens a light golden halo breathes outwards; the ring itself stays gold. */
    private void breathe(boolean on) {
        if (pulse != null) pulse.cancel();
        pulse = null;
        mic.setScaleX(1f);
        mic.setScaleY(1f);
        if (!on) {
            halo.setAlpha(0f);
            return;
        }
        pulse = ValueAnimator.ofFloat(0f, 1f);
        pulse.setDuration(1600);
        pulse.setRepeatCount(ValueAnimator.INFINITE);
        pulse.addUpdateListener(a -> {
            float t = (float) a.getAnimatedValue();
            halo.setScaleX(1f + 0.14f * t);
            halo.setScaleY(1f + 0.14f * t);
            halo.setAlpha(0.6f * (1f - t));
        });
        pulse.start();
    }

    /** Listening starts while she may still be on: her portrait makes room quickly. */
    private void hideFace() {
        faceOn = false;
        face.animate().cancel();
        face.animate().setStartDelay(0).alpha(0f).setDuration(300).withEndAction(() -> face.setVisibility(View.INVISIBLE)).start();
        caption.animate().cancel();
        caption.animate().setStartDelay(0).alpha(0f).setDuration(300).start();
    }

    /** The title centred, the round button (its microphone shows the line), the small gear at the bottom. */
    private View mainLayer() {
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(16), dp(12), dp(16), dp(16));

        FrameLayout top = new FrameLayout(this);
        TextView title = text("DocCall", 28, LAMBDA);
        title.setOnClickListener(v -> Toast.makeText(this, word, Toast.LENGTH_SHORT).show());
        FrameLayout.LayoutParams tp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.TOP | Gravity.CENTER_HORIZONTAL);
        tp.topMargin = dp(28);
        top.addView(title, tp);
        col.addView(top, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        FrameLayout middle = new FrameLayout(this);
        // a soft golden ring behind the circle that breathes outwards while the phone listens
        // (gold, not green: "das Grün passt irgendwie nie", Doc, 07.11.2026)
        halo = new View(this);
        GradientDrawable h = new GradientDrawable();
        h.setShape(GradientDrawable.OVAL);
        h.setStroke(dp(2), LAMBDA);
        halo.setBackground(h);
        halo.setAlpha(0f);
        // the circle sits a little above the middle: the optical centre, and room for her sentence below
        // (Doc, 07.11.2026)
        float lift = -dp(LIFT_DP);
        halo.setTranslationY(lift);
        middle.addView(halo, center(circleSize()));
        View c = circle();
        c.setTranslationY(lift);
        middle.addView(c, center(circleSize()));
        // the line: a small green dot centred under the circle while it stands, nothing otherwise (Doc, 07.11.2026)
        dot = new View(this);
        dot.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
        dot.setTranslationY(lift + circleSize() / 2f + dp(28));
        middle.addView(dot, center(dp(10)));
        // her sentence under the circle while she speaks; it fades with her portrait
        caption = text("", 15, TEXT);
        caption.setGravity(Gravity.CENTER);
        caption.setMaxLines(8);
        caption.setEllipsize(TextUtils.TruncateAt.END);
        caption.setAlpha(0f);
        caption.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) ->
                v.setTranslationY(lift + circleSize() / 2f + dp(52) + v.getHeight() / 2f));
        FrameLayout.LayoutParams cp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.CENTER);
        cp.leftMargin = dp(16);
        cp.rightMargin = dp(16);
        middle.addView(caption, cp);
        // her sentence may use all the room down to the gear, so it is not cut off (Doc, 07.11.2026)
        middle.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> {
            float from = v.getHeight() / 2f + lift + circleSize() / 2f + dp(52);
            int lines = Math.max(3, (int) ((v.getHeight() - from - dp(8)) / caption.getLineHeight()));
            if (lines != caption.getMaxLines()) caption.setMaxLines(lines);   // only on change, no layout loop
        });
        col.addView(middle, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));

        akku = button("Akku-Ausnahme erlauben", UPSILON, TEXT);
        akku.setOnClickListener(v -> startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                Uri.parse("package:" + getPackageName()))));
        LinearLayout.LayoutParams ak = gap(0);
        ak.rightMargin = dp(8);
        col.addView(akku, ak);

        // the only other thing on the page: a small gear, centred at the bottom (Doc, 07.11.2026)
        // a touch bigger and a tick darker than the other muted things (Doc, 07.11.2026)
        ImageView gear = icon(R.drawable.ic_gear, 24, 0xFF6F7789, "Einstellungen und letzte Rufe");
        gear.setOnClickListener(v -> openSettings());
        LinearLayout.LayoutParams gp = new LinearLayout.LayoutParams(dp(48), dp(48));
        gp.gravity = Gravity.CENTER_HORIZONTAL;
        gp.topMargin = dp(8);
        col.addView(gear, gp);
        return col;
    }

    /** The round button: microphone and "Antworten"; Solita's portrait lies on top while she speaks. */
    private View circle() {
        FrameLayout c = new FrameLayout(this);
        ring = new GradientDrawable();
        ring.setShape(GradientDrawable.OVAL);
        ring.setColor(CARD);
        ring.setStroke(dp(2), LAMBDA);
        c.setBackground(ring);
        GradientDrawable mask = new GradientDrawable();
        mask.setShape(GradientDrawable.OVAL);
        mask.setColor(0xFFFFFFFF);
        c.setForeground(new RippleDrawable(ColorStateList.valueOf(0x33F5C242), null, mask));
        circleView = c;
        c.setContentDescription("Antworten");
        c.setOnClickListener(v -> tap());

        LinearLayout inner = new LinearLayout(this);
        inner.setOrientation(LinearLayout.VERTICAL);
        inner.setGravity(Gravity.CENTER);
        inner.setPadding(dp(24), 0, dp(24), 0);
        mic = icon(R.drawable.ic_mic, 44, LAMBDA, null);
        inner.addView(mic, new LinearLayout.LayoutParams(dp(56), dp(56)));
        label = text(idleWord(), 15, TEXT);
        label.setGravity(Gravity.CENTER);
        label.setMaxLines(3);   // only short words in the circle; sentences go under it
        label.setEllipsize(TextUtils.TruncateAt.END);
        LinearLayout.LayoutParams sp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        sp.topMargin = dp(10);
        inner.addView(label, sp);
        c.addView(inner, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT, Gravity.CENTER));

        // her portrait, the first frame of the welcome video behind her avatar on docalvers.de
        face = new ImageView(this);
        face.setImageResource(R.drawable.solita);
        face.setScaleType(ImageView.ScaleType.CENTER_CROP);
        GradientDrawable round = new GradientDrawable();
        round.setShape(GradientDrawable.OVAL);
        round.setColor(BG);
        face.setBackground(round);
        face.setOutlineProvider(ViewOutlineProvider.BACKGROUND);
        face.setClipToOutline(true);
        face.setAlpha(0f);
        face.setVisibility(View.INVISIBLE);
        face.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
        FrameLayout.LayoutParams fp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        fp.setMargins(dp(4), dp(4), dp(4), dp(4));   // the golden ring stays around her
        c.addView(face, fp);
        return c;
    }

    private View settingsPanel() {
        LinearLayout col = panel("Einstellungen", () -> show(settings, false));

        lineWord = text("", 16, TEXT);
        col.addView(lineWord, gap(8));

        Switch speak = new Switch(this);
        speak.setText("Ansagen");
        speak.setTypeface(orbitron);
        speak.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        speak.setTextColor(TEXT);
        speak.setMinHeight(dp(58));
        speak.setChecked(Rufe.speak(this));
        speak.setOnCheckedChangeListener((b, on) -> Rufe.setSpeak(this, on));
        col.addView(speak, gap(24));
        col.addView(text("An: Solita sagt den Ruf laut an. Aus: nur Ton und Vibration.", 12, MUTED));

        Button probe = button("Probe-Ruf", LAMBDA, BG);
        probe.setOnClickListener(v -> {
            RufService.probe(this);
            Toast.makeText(this, "Probe-Ruf ist unterwegs", Toast.LENGTH_SHORT).show();
            show(settings, false);   // back to the circle, where she will appear
        });
        col.addView(probe, gap(32));

        col.addView(text("Letzte Rufe", 18, LAMBDA), gap(40));
        list = new LinearLayout(this);
        list.setOrientation(LinearLayout.VERTICAL);
        col.addView(list, gap(8));
        return scroll(col);
    }

    /** A full-screen panel with its title and a cross; hidden until opened. */
    private LinearLayout panel(String name, Runnable close) {
        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(20), dp(12), dp(12), dp(24));
        LinearLayout top = new LinearLayout(this);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        top.addView(text(name, 20, LAMBDA));
        top.addView(new View(this), new LinearLayout.LayoutParams(0, 1, 1f));
        ImageView x = icon(R.drawable.ic_close, 22, MUTED, "Schließen");
        x.setOnClickListener(v -> close.run());
        top.addView(x, new LinearLayout.LayoutParams(dp(48), dp(48)));
        col.addView(top, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(56)));
        return col;
    }

    private ScrollView scroll(LinearLayout col) {
        ScrollView s = new ScrollView(this);
        s.setBackgroundColor(BG);
        s.setVisibility(View.GONE);
        col.setPadding(col.getPaddingLeft(), col.getPaddingTop(), dp(20), col.getPaddingBottom());
        s.addView(col);
        s.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        return s;
    }

    private void show(View panel, boolean on) {
        panel.animate().cancel();
        if (on) {
            panel.setAlpha(0f);
            panel.setVisibility(View.VISIBLE);
            panel.animate().alpha(1f).setDuration(180).start();
        } else {
            panel.animate().alpha(0f).setDuration(180).withEndAction(() -> panel.setVisibility(View.GONE)).start();
        }
    }

    @Override
    public void onBackPressed() {
        if (settings.getVisibility() == View.VISIBLE) show(settings, false);
        else super.onBackPressed();
    }

    /** Over the lock screen the settings and the last calls first ask for the unlock. */
    private void openSettings() {
        KeyguardManager km = getSystemService(KeyguardManager.class);
        if (!km.isKeyguardLocked()) {
            show(settings, true);
            return;
        }
        km.requestDismissKeyguard(this, new KeyguardManager.KeyguardDismissCallback() {
            @Override
            public void onDismissSucceeded() {
                show(settings, true);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        visible = true;
        tick.post(refresh);
        Ansage.listener = () -> face(true);
        if (Ansage.speaking == 0) {
            faceOn = false;
            face.animate().cancel();
            face.setAlpha(0f);
            face.setVisibility(View.INVISIBLE);
            caption.animate().cancel();
            caption.setAlpha(0f);
        } else {
            face(true);   // opened from the call's notification while she still speaks
        }
    }

    @Override
    protected void onPause() {
        visible = false;
        tick.removeCallbacks(refresh);
        Ansage.listener = null;
        if (mode.equals("listening")) {
            // screen off or another app in front: stop listening, nothing half-heard goes out
            if (ear != null) ear.cancel();
            stopUsb();
            tick.removeCallbacks(backToIdle);
            tick.removeCallbacks(quiet);
            tick.removeCallbacks(again);
            idle();
        }
        super.onPause();
    }

    @Override
    protected void onStop() {
        if (overLock) {
            // the call screen is done: the next time the phone wakes, the lock screen is back in front
            overLock = false;
            setShowWhenLocked(false);
            setTurnScreenOn(false);
        }
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        if (ear != null) ear.destroy();
        ear = null;
        stopUsb();
        super.onDestroy();
    }

    /** Solita appears with a small pop like her video window on docalvers.de and fades slowly when she is done. */
    private void face(boolean animate) {
        boolean on = Ansage.speaking > 0;
        // while Doc speaks or his words go out the circle stays his; a call right after (his check mark still
        // showing) gets her face at once (Doc, 07.11.2026: "dein hübsches Gesicht nicht gesehen")
        if (on && (mode.equals("listening") || mode.equals("sending"))) return;
        if (on && mode.equals("shown")) {
            tick.removeCallbacks(backToIdle);
            mode = "idle";
            label.setText(idleWord());
            label.setTextColor(TEXT);
        }
        if (on == faceOn) return;
        faceOn = on;
        face.animate().cancel();
        caption.animate().cancel();
        if (on) {
            face.setVisibility(View.VISIBLE);
            face.setAlpha(0f);
            face.setScaleX(0.4f);
            face.setScaleY(0.4f);
            face.animate().setStartDelay(0).alpha(1f).scaleX(1f).scaleY(1f).setDuration(animate ? FADE_IN_MS : 0)
                    .setInterpolator(new OvershootInterpolator(1.1f)).start();
            caption.setEllipsize(TextUtils.TruncateAt.END);
            caption.setText(Ansage.saying);
            caption.animate().setStartDelay(0).alpha(1f).setDuration(animate ? FADE_IN_MS : 0).start();
        } else {
            long hold = animate ? HOLD_MS : 0;
            face.animate().setStartDelay(hold).alpha(0f).setDuration(animate ? FADE_OUT_MS : 0)
                    .setInterpolator(new DecelerateInterpolator())
                    .withEndAction(() -> face.setVisibility(View.INVISIBLE)).start();
            caption.animate().setStartDelay(hold).alpha(0f).setDuration(animate ? FADE_OUT_MS : 0).start();
        }
    }

    private void update() {
        String s = RufService.state;
        long ago = (System.currentTimeMillis() - RufService.lastBeat) / 1000;
        if (s.equals("verbunden") && ago > 120) s = "getrennt";
        int color = s.equals("verbunden") ? PHI : s.equals("verbinde") ? LAMBDA : UPSILON;
        word = s.equals("verbunden") ? "Leitung steht" : s.equals("verbinde") ? "Verbinde …"
                : s.equals("kein Kanal") ? "Kein Kanal eingebaut" : "Keine Leitung";
        // the line: green dot under the circle while it stands; the microphone gold, grey without a line
        // (Doc, 07.11.2026, after trying a dot next to the title, in the gear's hub and a green microphone)
        boolean up = s.equals("verbunden");
        GradientDrawable d = new GradientDrawable();
        d.setShape(GradientDrawable.OVAL);
        d.setColor(up ? PHI : 0x00000000);
        dot.setBackground(d);
        mic.setImageTintList(ColorStateList.valueOf(up ? LAMBDA : MUTED));
        lineWord.setText("● " + word);
        lineWord.setTextColor(color);

        boolean free = getSystemService(PowerManager.class).isIgnoringBatteryOptimizations(getPackageName());
        akku.setVisibility(free ? View.GONE : View.VISIBLE);

        // her open question may come or go (new call, his answer, an hour passed): the word follows
        if (mode.equals("idle") && !idleWord().contentEquals(label.getText())) idle();

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
                    + (r.optBoolean("ok") ? "  ✓" : "") + "\n" + r.optString("text")
                    + (r.has("antwort") ? "\n→ " + r.optString("antwort") + (r.optBoolean("antwortOk") ? "  ✓" : "  (nicht raus)") : ""),
                    14, TEXT);
            row.setPadding(dp(12), dp(10), dp(12), dp(10));
            row.setBackground(rounded(CARD));
            // a tap plays the call again, back on the circle with her portrait; her MP3 only lives 3 h on ntfy.sh,
            // after that the phone reads it
            row.setOnClickListener(v -> {
                show(settings, false);
                Ansage.get(this).say(r.optString("text"), r.optString("audio"));
            });
            list.addView(row, gap(8));
        }
    }

    /**
     * The round button is the same size in DocCall and DocNote: exactly half way between DocCall's old circle
     * (280 dp, at most 72 % of the width) and DocNote's old Start button (56 % of the width, at most 34 % of
     * the height) (Doc, 08.11.2026). DocNote's MainActivity has the same line - change both together.
     */
    private int circleSize() {
        android.util.DisplayMetrics m = getResources().getDisplayMetrics();
        return Math.round((Math.min(dp(280), m.widthPixels * 0.72f) + Math.min(m.widthPixels * 0.56f, m.heightPixels * 0.34f)) / 2f);
    }

    private FrameLayout.LayoutParams center(int size) {
        return new FrameLayout.LayoutParams(size, size, Gravity.CENTER);
    }

    private ImageView icon(int res, int sizeDp, int color, String label) {
        ImageView v = new ImageView(this);
        v.setImageResource(res);
        v.setImageTintList(ColorStateList.valueOf(color));
        int pad = Math.max(0, (48 - sizeDp) / 2);
        v.setPadding(dp(pad), dp(pad), dp(pad), dp(pad));
        v.setScaleType(ImageView.ScaleType.FIT_CENTER);
        if (label != null) {
            v.setContentDescription(label);
            TypedValue tv = new TypedValue();
            getTheme().resolveAttribute(android.R.attr.selectableItemBackgroundBorderless, tv, true);
            v.setBackgroundResource(tv.resourceId);
        } else {
            v.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
        }
        return v;
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
        b.setBackground(rounded(bg));
        b.setStateListAnimator(null);
        b.setMinHeight(dp(58));
        b.setGravity(Gravity.CENTER);
        return b;
    }

    private GradientDrawable rounded(int color) {
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
