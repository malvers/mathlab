package de.docalvers.docruf;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Solita's words light up while she speaks a call, as on docalvers.de (Doc, 08.11.2026: "Karaoke ... wäre natürlich
 * auch nicht schlecht"). Her MP3 brings no word times, so - exactly like the web (HTML/js/solita-karaoke.js,
 * spielen() and syllables()) - each word's start is estimated from its syllables over the length of the audio, with
 * short breaks after commas and sentences. Constants and syllable rules are the web's, measured there against
 * Studio-C (mean error 0.13 s); change them there and here together. The phone's own voice reports its words
 * itself (Ansage.readAt), then wordAt() finds the word.
 */
final class Karaoke {
    private static final double LEAD = 0.10, TAIL = 0.09, BASE = 0.3, SENTENCE = 1.5, COMMA = 0.6;
    private static final int[] UNIT = {1, 1, 1, 1, 1, 1, 1, 2, 1, 1};   // null eins zwei ... sieben acht neun
    private static final Pattern WORD = Pattern.compile("\\S+");
    private static final Pattern NUMBER = Pattern.compile("^\\D*?(\\d+)(?:([,.])(\\d+))?\\D*$");
    private static final Pattern VOWELS = Pattern.compile("[aeiouyäöü]+");
    private static final Pattern END_SENTENCE = Pattern.compile("[.!?][\"')\\]]*$");
    private static final Pattern END_COMMA = Pattern.compile("[,;:][\"')\\]]*$");

    final String text;
    private final List<int[]> words = new ArrayList<>();   // {from, to} of every word that is said
    private final List<Double> starts = new ArrayList<>(); // its start in units of speech
    private final double total;

    Karaoke(String text) {
        this.text = text == null ? "" : text;
        Matcher m = WORD.matcher(this.text);
        double pos = 0, lastStart = 0;
        int lastSyl = 0;
        while (m.find()) {
            String w = m.group();
            int n = syllables(w);
            if (n > 0) {
                words.add(new int[]{m.start(), m.end()});
                starts.add(pos);
                lastStart = pos;
                lastSyl = n;
                pos += n + BASE;
            }
            if (END_SENTENCE.matcher(w).find()) pos += SENTENCE;
            else if (END_COMMA.matcher(w).find()) pos += COMMA;
        }
        total = lastStart + lastSyl + BASE;
    }

    int size() {
        return words.size();
    }

    int from(int i) {
        return words.get(i)[0];
    }

    int to(int i) {
        return words.get(i)[1];
    }

    /** The word being said `ms` into audio that lasts `durationMs`, -1 before the first. */
    int at(int ms, int durationMs) {
        if (words.isEmpty() || durationMs <= 0) return -1;
        double perUnit = Math.max(0.1, durationMs / 1000.0 - LEAD - TAIL) / total;   // seconds a unit of speech
        double t = ms / 1000.0 - LEAD;
        int i = -1;
        while (i + 1 < words.size() && starts.get(i + 1) * perUnit <= t) i++;
        return i;
    }

    /** The word at character `c` (the phone's voice says where it is), -1 when none. */
    int wordAt(int c) {
        int found = -1;
        for (int i = 0; i < words.size() && words.get(i)[0] <= c; i++) found = i;
        return found;
    }

    /** Syllables of what is said: a number counts as its German words, decimals digit by digit after "Komma". */
    static int syllables(String w) {
        int s = 0;
        for (String t : w.trim().split("\\s+")) {
            if (t.isEmpty()) continue;
            Matcher m = NUMBER.matcher(t);
            if (m.matches()) {
                String a = m.group(1), sep = m.group(2), b = m.group(3);
                if (".".equals(sep) && b.length() == 3) {   // 3.800 - a thousands dot
                    s += numSyl(a + b);
                    continue;
                }
                s += numSyl(a);
                if (b != null) {
                    s += 2;                                  // Komma
                    for (char c : b.toCharArray()) s += UNIT[c - '0'];
                }
                continue;
            }
            Matcher v = VOWELS.matcher(t.toLowerCase(Locale.GERMAN));
            while (v.find()) s++;
        }
        return s;
    }

    private static int numSyl(String digits) {
        if (digits.length() > 9) return 6;
        return numSyl(Long.parseLong(digits));
    }

    private static int numSyl(long n) {
        if (n == 0) return 1;
        if (n >= 1000000) return 6;
        int s = 0;
        long th = n / 1000, h = n % 1000 / 100, r = n % 100;
        if (th > 0) s += (th == 1 ? 1 : numSyl(th)) + 2;    // (ein)tausend
        if (h > 0) s += (h == 1 ? 1 : UNIT[(int) h]) + 2;   // (ein)hundert
        if (r > 0) s += below100((int) r);
        return s;
    }

    private static int below100(int n) {
        if (n < 10) return UNIT[n];
        if (n < 13) return 1;                                // zehn elf zwölf
        if (n < 20) return n == 16 || n == 17 ? 2 : UNIT[n - 10] + 1;
        int u = n % 10;
        return 2 + (u > 0 ? UNIT[u] + 1 : 0);                // zwanzig ... / einundzwanzig
    }
}
