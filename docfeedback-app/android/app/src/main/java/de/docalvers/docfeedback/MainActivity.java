package de.docalvers.docfeedback;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.InputFilter;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * DocFeedback - the class's feedback on Doc's phone (Doc, 10.11.2026: "eine App für das Feedback-Tool, wenn die Kinder
 * sagen, nicht verstanden, zu langsam, zu schnell ... als App auf dem Phone").
 *
 * The board shows the QR of rueckmeldung.html (or Vorrechnen) with today's 4-digit code; this app follows that code in a
 * WebView on https://docalvers.de/rueckmeldung.html?c=<code> - the page's read-along mode: it takes the code as today's
 * without claiming it, so the board keeps its own. The code is asked once a day (it changes every day) and kept; the
 * small "Code" key at the top right asks for another. The screen stays on while the app is in front.
 */
public class MainActivity extends Activity {
    private static final String SEITE = "https://docalvers.de/rueckmeldung.html?c=";
    private static final int BG = Color.rgb(10, 20, 40);
    private static final int LAMBDA = Color.rgb(245, 194, 66);
    private WebView web;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        prefs = getSharedPreferences("docfeedback", MODE_PRIVATE);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BG);
        web = new WebView(this);
        web.setBackgroundColor(BG);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        web.setWebViewClient(new WebViewClient());
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));

        Button code = new Button(this);
        code.setText("Code");
        code.setAllCaps(false);
        code.setTextColor(BG);
        code.setBackgroundColor(LAMBDA);
        code.setAlpha(0.85f);
        code.setOnClickListener(v -> frageCode());
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(-2, -2, Gravity.TOP | Gravity.END);
        int m = (int) (10 * getResources().getDisplayMetrics().density);
        lp.setMargins(m, m, m, m);
        root.addView(code, lp);
        setContentView(root);

        String c = heutigerCode();
        if (c != null) zeige(c); else frageCode();
    }

    private static String heute() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.GERMANY).format(new Date());
    }

    /** today's code, or null when none was given today (the board takes a new one every day) */
    private String heutigerCode() {
        return heute().equals(prefs.getString("tag", "")) ? prefs.getString("code", null) : null;
    }

    private void zeige(String c) {
        web.loadUrl(SEITE + c);
    }

    private void frageCode() {
        EditText feld = new EditText(this);
        feld.setInputType(InputType.TYPE_CLASS_NUMBER);
        feld.setFilters(new InputFilter[]{new InputFilter.LengthFilter(4)});
        feld.setGravity(Gravity.CENTER);
        feld.setTextSize(28);
        String alt = prefs.getString("code", "");
        feld.setHint(alt.isEmpty() ? "1234" : alt);
        new AlertDialog.Builder(this)
                .setTitle("Code vom Beamer")
                .setMessage("Die vier Ziffern, die unter dem QR stehen")
                .setView(feld)
                .setPositiveButton("Los", (d, w) -> {
                    String c = feld.getText().toString().trim();
                    if (!c.matches("\\d{4}")) { frageCode(); return; }
                    prefs.edit().putString("code", c).putString("tag", heute()).apply();
                    zeige(c);
                })
                .setNegativeButton("Abbrechen", (d, w) -> { String c = heutigerCode(); if (c == null) finish(); })
                .setCancelable(false)
                .show();
        feld.requestFocus();
        feld.postDelayed(() -> {
            android.view.inputmethod.InputMethodManager im = (android.view.inputmethod.InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
            if (im != null) im.showSoftInput(feld, 0);
        }, 200);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // a new day while the app slept: ask for the new code
        if (heutigerCode() == null && web != null && web.getUrl() != null) frageCode();
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
}
