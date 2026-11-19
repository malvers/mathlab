"""DocFit's exact rule (Commands.java: GRAMMAR, decide(), LoudnessMeter) on the silently generated samples, through the
same small German model and the way the app hears: silence around each sample, decided per recognizer result, the
loudness before and after the phrase taken from the audio. Prints the misses, then the summary."""
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


def decide(words, pcm):   # same as Commands.decide
    if any(w['word'] not in ('dock', 'fit', 'start', 'stopp', '[unk]') for w in words):
        return '-'
    for i in range(len(words) - 2):
        d, f, c = words[i:i + 3]
        if d['word'] != 'dock' or f['word'] != 'fit' or c['word'] not in ('start', 'stopp'):
            continue
        if d['conf'] < MIN_CONF or f['conf'] < MIN_CONF or c['conf'] < COMMAND_CONF:
            continue
        if f['start'] - d['end'] > MAX_GAP or c['start'] - f['end'] > MAX_PAUSE:
            continue
        phrase = rms(pcm, d['start'], c['end'])
        before = rms(pcm, d['start'] - QUIET_GAP - QUIET_SPAN, d['start'] - QUIET_GAP)
        after = rms(pcm, c['end'] + QUIET_GAP, c['end'] + QUIET_GAP + QUIET_SPAN)
        if phrase > 0 and before <= QUIET_RATIO * phrase and after <= QUIET_RATIO * phrase:
            return 'start' if c['word'] == 'start' else 'stop'
    return '-'


def expected(phrase):
    q = phrase.lower().replace(' ', '').replace(',', '')
    return 'start' if q in ('docfitstart', 'dockfitstart') else 'stop' if q in ('docfitstopp', 'docfitstop') else '-'


hits = {'start': [0, 0], 'stop': [0, 0]}
false, others, bad = 0, 0, []
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
