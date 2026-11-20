package de.docalvers.docfit;

import java.util.List;
import java.util.Locale;

/**
 * What Doc said, as a command: "DocFit Start" starts the stopwatch, "DocFit Stopp" stops it (Doc, 19.11.2026; first
 * 16.11.2026 with plain "DocFit" / "Stopp", which started and stopped far too often from talk nearby: "Ständig geht das
 * Ding an neben mir"). Plain "DocFit" or "Start" do nothing. Plain "Stopp" stops too, but only while the stopwatch runs
 * (Doc, 20.11.2026: "dass wenn ich nur ‚Stopp' sage, das in dem Modus dann auch stoppt") - under the same rules as the
 * phrase: conf >= 0.7, nothing but noise around it, said on its own; when the stopwatch stands still it does nothing,
 * and a start always needs "DocFit Start" (a plain "Start" was what fired from talk nearby).
 *
 * The recognizer runs with a closed grammar (GRAMMAR): the two phrases, their parts, and words that sound like them, so
 * that "Topf", "Doktor", "Fitness" or "stark" land on themselves instead of on a command, and "[unk]" for everything
 * else. "DocFit" is no German word - the small German model hears it as "dock fit".
 *
 * A result is a command only if
 * - it holds "dock", "fit" and "start" (or "stopp") in a row, "dock" and "fit" at conf >= 0.5, the command word at
 *   conf >= 0.7, at most 0.3 s between "dock" and "fit" and 0.5 s before the command word ("DocFit, Start" counts);
 * - nothing but noise ("[unk]") stands around it in the same result;
 * - it was said on its own: the audio 0.1-0.5 s before and after the phrase is at most half as loud as the phrase
 *   (Loudness). The grammar hides the other words of a sentence ("doch fit starten ..."), the loudness does not.
 * Measured on the silent samples (docfit-app/test/, six German macOS voices, 186 samples): "DocFit Start" 24 of 24,
 * "DocFit Stopp" 22 of 24, false commands 0 of 138 (plain DocFit, Stopp, "Stopp mal", "Ich bin heute fit", radio-like
 * passages). The old rule had 29 false starts in 132. While running (20.11.2026): plain "Stopp" / "Stop" 12 of 12,
 * false stops 0 of 150 (everything else, "Stopp mal" and "Stopp bitte" included).
 * Pure Java, tested in CommandsTest.
 */
final class Commands {
    enum Kind { NONE, START, STOP }

    /** One recognized word with Vosk's confidence and its place in the audio stream, in seconds. */
    static final class Word {
        final String text;
        final double conf, start, end;

        Word(String text, double conf, double start, double end) {
            this.text = text;
            this.conf = conf;
            this.start = start;
            this.end = end;
        }
    }

    /**
     * A command and the moment in the audio stream it stands for (seconds): the end of "DocFit Start" (then the
     * workout begins), the beginning of "DocFit Stopp" (then it ended). {@code heard} says why, for the log: the words
     * with their confidences and how loud it was around the phrase - also for a phrase that was turned down.
     */
    static final class Command {
        final Kind kind;
        final double at;
        final String heard;

        Command(Kind kind, double at, String heard) {
            this.kind = kind;
            this.at = at;
            this.heard = heard;
        }
    }

    /** How loud the audio stream was between two moments (seconds), as RMS; 0 where nothing was recorded. */
    interface Loudness {
        double rms(double from, double to);
    }

    static final String GRAMMAR = "[\"dock fit start\", \"dock fit stopp\", \"dock fit\", \"start\", \"stopp\", "
            + "\"dock\", \"fit\", \"stark\", \"statt\", \"stadt\", \"doktor\", \"topf\", \"fitness\", \"stoff\", "
            + "\"tor\", \"[unk]\"]";
    static final double MIN_CONF = 0.5;       // "dock" and "fit"
    static final double COMMAND_CONF = 0.7;   // "start" / "stopp", the word that decides
    static final double MAX_GAP = 0.3;        // s between "dock" and "fit"
    static final double MAX_PAUSE = 0.5;      // s between "fit" and the command word
    static final double QUIET_GAP = 0.1;      // s left out next to the phrase (word times are not that exact)
    static final double QUIET_SPAN = 0.4;     // s of audio looked at before and after
    static final double QUIET_RATIO = 0.5;    // before and after at most half as loud as the phrase (-6 dB)
    static final Command NONE = new Command(Kind.NONE, 0, "");

    private Commands() {
    }

    /** For a stopwatch that stands still: only the two phrases count. */
    static Command decide(List<Word> words, Loudness loud) {
        return decide(words, loud, false);
    }

    /** @param running whether the stopwatch runs - then a plain "Stopp" said on its own stops it as well */
    static Command decide(List<Word> words, Loudness loud, boolean running) {
        for (Word w : words) {
            switch (w.text) {
                case "dock":
                case "fit":
                case "start":
                case "stopp":
                case "[unk]":
                    break;
                default:              // a look-alike or a part of a sentence: no command in this result
                    return NONE;
            }
        }
        String turnedDown = "";
        for (int i = 0; i + 2 < words.size(); i++) {
            Word dock = words.get(i), fit = words.get(i + 1), cmd = words.get(i + 2);
            if (!dock.text.equals("dock") || !fit.text.equals("fit")) continue;
            boolean start = cmd.text.equals("start");
            if (!start && !cmd.text.equals("stopp")) continue;
            if (dock.conf < MIN_CONF || fit.conf < MIN_CONF || cmd.conf < COMMAND_CONF) continue;
            if (fit.start - dock.end > MAX_GAP || cmd.start - fit.end > MAX_PAUSE) continue;
            double phrase = loud.rms(dock.start, cmd.end);
            double before = loud.rms(dock.start - QUIET_GAP - QUIET_SPAN, dock.start - QUIET_GAP);
            double after = loud.rms(cmd.end + QUIET_GAP, cmd.end + QUIET_GAP + QUIET_SPAN);
            String why = heard(words) + String.format(Locale.ROOT, "; loudness before %.2f, after %.2f of the phrase",
                    phrase > 0 ? before / phrase : 0, phrase > 0 ? after / phrase : 0);
            if (alone(phrase, before, after)) {
                return start ? new Command(Kind.START, cmd.end, why) : new Command(Kind.STOP, dock.start, why);
            }
            turnedDown = "not alone: " + why;
        }
        if (turnedDown.isEmpty() && running) {
            Command plain = plainStop(words, loud);
            if (plain != null) return plain;
        }
        return turnedDown.isEmpty() ? NONE : new Command(Kind.NONE, 0, turnedDown);
    }

    /**
     * A plain "Stopp" while the stopwatch runs: the only word of the result besides noise, sure enough and said on its
     * own. Stops at the beginning of the word; null if the result holds no such word, NONE with the reason if it was
     * turned down (for the log).
     */
    private static Command plainStop(List<Word> words, Loudness loud) {
        Word stop = null;
        for (Word w : words) {
            if (w.text.equals("[unk]")) continue;
            if (!w.text.equals("stopp") || stop != null) return null;   // another word, or two of them
            stop = w;
        }
        if (stop == null || stop.conf < COMMAND_CONF) return null;
        double phrase = loud.rms(stop.start, stop.end);
        double before = loud.rms(stop.start - QUIET_GAP - QUIET_SPAN, stop.start - QUIET_GAP);
        double after = loud.rms(stop.end + QUIET_GAP, stop.end + QUIET_GAP + QUIET_SPAN);
        String why = heard(words) + String.format(Locale.ROOT, "; plain Stopp, loudness before %.2f, after %.2f",
                phrase > 0 ? before / phrase : 0, phrase > 0 ? after / phrase : 0);
        return alone(phrase, before, after) ? new Command(Kind.STOP, stop.start, why)
                : new Command(Kind.NONE, 0, "not alone: " + why);
    }

    /** Said on its own: what came just before and after is at most QUIET_RATIO as loud as the phrase. */
    static boolean alone(double phrase, double before, double after) {
        return phrase > 0 && before <= QUIET_RATIO * phrase && after <= QUIET_RATIO * phrase;
    }

    /** "dock 1.00, fit 0.87, start 0.95" - a result for the log (only grammar words, never what else was said). */
    static String heard(List<Word> words) {
        StringBuilder s = new StringBuilder();
        for (Word w : words) {
            if (s.length() > 0) s.append(", ");
            s.append(w.text).append(String.format(Locale.ROOT, " %.2f", w.conf));
        }
        return s.toString();
    }
}
