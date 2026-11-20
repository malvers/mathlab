"""DocFit's exact rule (Commands.java: GRAMMAR, decide(), LoudnessMeter) on the silently generated samples, through the
same small German model and the way the app hears: silence around each sample, decided per recognizer result, the
loudness before and after the phrase taken from the audio. Twice: with the stopwatch standing still (only the two
phrases count) and running (a plain "Stopp" said on its own stops too - Doc, 20.11.2026). Prints the misses, then the
summary; "Fehlstopps" are stops while running from anything but a stop command."""
import array, json, math, os, random, wave
from vosk import Model, KaldiRecognizer, SetLogLevel

SetLogLevel(-1)
GRAMMAR = ["dock fit start", "dock fit stopp", "dock fit", "start", "stopp", "dock", "fit", "stark", "statt", "stadt",
           "doktor", "topf", "fitness", "stoff", "tor", "[unk]"]
MIN_CONF, COMMAND_CONF, MAX_GAP, MAX_PAUSE = 0.5, 0.7, 0.3, 0.5
QUIET_GAP, QUIET_SPAN, QUIET_RATIO = 0.1, 0.4, 0.5
RATE = 16000
model = Model(os.path.expanduser('~/Library/Caches/docfit/vosk-model-small-de-0.15'))


def rms(pcm, a, b):   # as LoudnessMeter.rms
    a = max(0, int(a * RATE)); b = min(len(pcm), int(b * RATE))
    if b <= a:
        return 0.0
    s = pcm[a:b]
    return math.sqrt(sum(x * x for x in s) / len(s))


def alone(pcm, a, b):
    phrase = rms(pcm, a, b)
    before = rms(pcm, a - QUIET_GAP - QUIET_SPAN, a - QUIET_GAP)
    after = rms(pcm, b + QUIET_GAP, b + QUIET_GAP + QUIET_SPAN)
    return phrase > 0 and before <= QUIET_RATIO * phrase and after <= QUIET_RATIO * phrase


def decide(words, pcm, running=False):   # same as Commands.decide
    if any(w['word'] not in ('dock', 'fit', 'start', 'stopp', '[unk]') for w in words):
        return '-'
    turned_down = False
    for i in range(len(words) - 2):
        d, f, c = words[i:i + 3]
        if d['word'] != 'dock' or f['word'] != 'fit' or c['word'] not in ('start', 'stopp'):
            continue
        if d['conf'] < MIN_CONF or f['conf'] < MIN_CONF or c['conf'] < COMMAND_CONF:
            continue
        if f['start'] - d['end'] > MAX_GAP or c['start'] - f['end'] > MAX_PAUSE:
            continue
        if alone(pcm, d['start'], c['end']):
            return 'start' if c['word'] == 'start' else 'stop'
        turned_down = True
    if running and not turned_down:   # plain "Stopp": the only word besides noise, sure, said on its own
        real = [w for w in words if w['word'] != '[unk]']
        if len(real) == 1 and real[0]['word'] == 'stopp' and real[0]['conf'] >= COMMAND_CONF \
                and alone(pcm, real[0]['start'], real[0]['end']):
            return 'stop'
    return '-'


def expected(phrase):
    q = phrase.lower().replace(' ', '').replace(',', '')
    return 'start' if q in ('docfitstart', 'dockfitstart') else 'stop' if q in ('docfitstopp', 'docfitstop') else '-'


def plain_stop(phrase):
    return phrase.lower() in ('stopp', 'stop')


hits = {'start': [0, 0], 'stop': [0, 0]}
false, others, bad = 0, 0, []
plain_hits, plain_n, false_stops, run_others = 0, 0, 0, 0
for line in open('samples/index.txt', encoding='utf-8'):
    n, voice, phrase = line.strip().split('|')
    wf = wave.open('samples/%s.wav' % n, 'rb')
    pcm = array.array('h', [0] * 8000) + array.array('h', wf.readframes(wf.getnframes())) + array.array('h', [0] * 24000)
    random.seed(int(n))   # quiet room noise, so silence is not digital zero
    pcm = array.array('h', [max(-32768, min(32767, x + random.randint(-60, 60))) for x in pcm])
    rec = KaldiRecognizer(model, RATE, json.dumps(GRAMMAR)); rec.SetWords(True)
    raw, results = pcm.tobytes(), []
    for i in range(0, len(raw), 3200):
        if rec.AcceptWaveform(raw[i:i + 3200]):
            results.append(json.loads(rec.Result()).get('result', []))
    results.append(json.loads(rec.FinalResult()).get('result', []))
    got = {decide(r, pcm) for r in results if r} - {'-'}
    running = {decide(r, pcm, True) for r in results if r} - {'-'}
    if plain_stop(phrase):
        plain_n += 1
        plain_hits += 'stop' in running
    elif expected(phrase) != 'stop':
        run_others += 1
        if 'stop' in running:
            false_stops += 1
            bad.append(f'{n} {voice:8} {phrase[:40]!r:44} -> stops while running')
    want = expected(phrase)
    if want != '-':
        hits[want][1] += 1
        hits[want][0] += want in got
    else:
        others += 1
        false += bool(got)
    if got != ({want} - {'-'}):
        bad.append(f'{n} {voice:8} {phrase[:40]!r:44} -> '
                   f'{[[(w["word"], round(w["conf"], 2)) for w in r] for r in results if r]} cmd={got or "-"} want={want}')
print('\n'.join(bad))
print(f'DocFit Start {hits["start"][0]}/{hits["start"][1]}, DocFit Stopp {hits["stop"][0]}/{hits["stop"][1]}, '
      f'Fehlauslöser {false}/{others}')
print(f'läuft: Stopp allein {plain_hits}/{plain_n}, Fehlstopps {false_stops}/{run_others}')
