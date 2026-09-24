#!/usr/bin/env python3
"""Compares Doc's own recording with his voice clone - spectrograms and a signed difference.

    python3 tools/stimmvergleich.py          # writes ~/Movies/stimmklon/analyse/*

Reads the two files the booth's comparison buttons play:

    ~/Movies/stimmklon/vergleich-original.wav   Doc reading the story
    ~/Movies/stimmklon/vergleich-klon.wav       the clone reading the same text

and writes, next to them in analyse/:

    original.png   spectrogram of Doc
    klon.png       spectrogram of the clone, TIME-ALIGNED to Doc
    diff.png       Doc minus clone, red where Doc is louder, blue where the clone is
    diff-eq.png    Doc minus the clone with the high shelf - does the filter help?
    daten.json     scale, durations, per-band balance - the numbers under the picture
    ziel.json      what an EQ on the clone would have to do: the weighted mean difference
                   per frequency, the weights, and the part no filter can ever remove

Why the alignment: the two readings are not the same length (Doc 28.4 s, the clone
30.1 s) and the pauses fall differently. Subtracting the raw pictures pixel by pixel
would compare different sounds and paint the timing offset as red/blue stripes - a
striking picture that says nothing about the voice. Dynamic time warping first pairs
every moment of the clone with the matching moment of Doc; only then is the difference
taken. Same reason both are normalised to equal overall loudness first: the clone came
out 2.9 dB louder, which would otherwise turn the whole difference blue and hide the
spectral detail.

The pictures carry no axes - the page draws those in HTML, so they stay sharp and
readable at any width, and the three pictures share one frame for blink comparison.

Needs numpy and Pillow (both in the repo's .venv-i18n). No other dependency.
"""
import json
import os
import sys
import wave
import datetime

try:
    import numpy as np
    from PIL import Image
except ImportError as err:
    sys.exit('Braucht numpy und Pillow (%s). Im Repo: .venv-i18n/bin/python3 tools/stimmvergleich.py' % err)

STORE = os.path.expanduser('~/Movies/stimmklon')
ZIEL = os.path.join(STORE, 'analyse')
QUELLEN = {'original': 'vergleich-original.wav', 'klon': 'vergleich-klon.wav'}
# the clone with the +3 dB high shelf above 6 kHz - optional: its difference answers whether
# the filter actually closes the gap (Doc, 24.09.2026: "haben wir nicht zwei diffs? weil zwei Klone")
QUELLE_EQ = ('klon_eq', 'vergleich-klon-eq.wav')

N_FFT = 1024          # ~43 ms window at 24 kHz
HOP = 480             # 20 ms - finer than a pixel at page width, coarse enough for a quick DTW
HOEHE = 420           # picture height in pixels (frequency axis, 0 Hz at the bottom)
DYNAMIK = 90.0        # dB shown below the loudest cell
DIFF_SKALA = 20.0     # +-dB that saturate the difference colours
BAND = 250            # DTW corridor, frames either side of the diagonal (= 5 s)
TIMBRE_AB = 350.0     # Hz: below, the long-term spectrum is pitch, and the EQ stays neutral

# the per-band balance, same edges as the first measurement on 24.09.2026
BAENDER = [('Grundton', 0, 300), ('Vokale', 300, 1000), ('Formanten', 1000, 3000),
           ('Präsenz', 3000, 6000), ('Zischlaute', 6000, 12000)]


def lies(pfad):
    with wave.open(pfad, 'rb') as w:
        sr, n, kan, breite = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        roh = w.readframes(n)
    if breite != 2:
        sys.exit('%s: nur 16-bit WAV' % pfad)
    x = np.frombuffer(roh, dtype='<i2').astype(np.float64) / 32768.0
    if kan > 1:
        x = x.reshape(-1, kan).mean(axis=1)
    return x, sr


def leistung(x):
    """Power spectrogram, frames x bins."""
    fenster = np.hanning(N_FFT)
    rahmen = 1 + max(0, (len(x) - N_FFT) // HOP)
    idx = np.arange(N_FFT)[None, :] + HOP * np.arange(rahmen)[:, None]
    X = np.fft.rfft(x[idx] * fenster, axis=1)
    return (np.abs(X) ** 2) / (fenster.sum() ** 2)


def merkmale(P, sr):
    """What DTW compares: log energy in 32 bands, each band normalised over time. Loudness
    and a fixed colouring of the voice fall out, the sequence of sounds stays."""
    f = np.fft.rfftfreq(N_FFT, 1 / sr)
    kanten = np.geomspace(80, sr / 2, 33)
    B = np.stack([P[:, (f >= a) & (f < b)].sum(axis=1) for a, b in zip(kanten[:-1], kanten[1:])], axis=1)
    L = np.log(B + 1e-12)
    return (L - L.mean(axis=0)) / (L.std(axis=0) + 1e-9)


def dtw(A, B):
    """Classic DTW inside a corridor around the diagonal; returns, for every frame of A,
    the frames of B it was paired with."""
    n, m = len(A), len(B)
    INF = float('inf')
    D = np.full((n, m), INF)
    for i in range(n):
        mitte = int(round(i * (m - 1) / max(n - 1, 1)))
        j0, j1 = max(0, mitte - BAND), min(m, mitte + BAND + 1)
        kosten = np.linalg.norm(B[j0:j1] - A[i], axis=1)
        if i == 0:
            # the path starts at (0, 0); for the first row the corridor always begins at 0
            D[0, j0:j1] = np.cumsum(kosten)
            continue
        oben = D[i - 1, j0:j1]
        schraeg = np.full(j1 - j0, INF)
        schraeg[1:] = D[i - 1, j0:j1 - 1]
        if j0 > 0:
            schraeg[0] = D[i - 1, j0 - 1]
        vorab = np.minimum(oben, schraeg)
        # the left neighbour lies in the same row - a running min-plus scan, cheap in plain Python
        z = [0.0] * (j1 - j0)
        links = D[i, j0 - 1] if j0 > 0 else INF
        vk, kk = vorab.tolist(), kosten.tolist()
        for k in range(j1 - j0):
            links = kk[k] + (vk[k] if vk[k] < links else links)
            z[k] = links
        D[i, j0:j1] = z
    # walk back from the end
    i, j = n - 1, m - 1
    paare = [[] for _ in range(n)]
    paare[i].append(j)
    while i > 0 or j > 0:
        kandidaten = []
        if i > 0 and j > 0:
            kandidaten.append((D[i - 1, j - 1], i - 1, j - 1))
        if i > 0:
            kandidaten.append((D[i - 1, j], i - 1, j))
        if j > 0:
            kandidaten.append((D[i, j - 1], i, j - 1))
        _, i, j = min(kandidaten)
        paare[i].append(j)
    return paare


def farbband(stuetzen, t):
    """Piecewise-linear colour ramp; t in [0, 1], any shape."""
    pos = np.array([s[0] for s in stuetzen])
    rgb = np.array([s[1] for s in stuetzen], dtype=np.float64)
    t = np.clip(t, 0, 1)
    return np.stack([np.interp(t, pos, rgb[:, k]) for k in range(3)], axis=-1)


# close to ffmpeg's "intensity" map, so the pictures read like the ones Doc already knows -
# but the floor is dark blue, never black (Doc's rule)
INTENSITAET = [(0.00, (6, 9, 26)), (0.18, (38, 12, 74)), (0.38, (112, 22, 122)), (0.56, (196, 40, 62)),
               (0.74, (242, 118, 24)), (0.90, (250, 208, 62)), (1.00, (255, 250, 228))]
GRUND = np.array([10, 15, 30], dtype=np.float64)
# Doc louder / clone louder. Chosen equally bright on the dark ground so neither sign looks
# stronger than it is - a measurement map, not UI colour.
ROT = np.array([255, 72, 52], dtype=np.float64)
BLAU = np.array([64, 150, 255], dtype=np.float64)


def bild(rgb_frames_bins, pfad):
    """frames x bins x 3 -> picture: time to the right, frequency upwards."""
    a = np.clip(rgb_frames_bins, 0, 255).astype(np.uint8)
    a = np.flipud(np.transpose(a, (1, 0, 2)))
    Image.fromarray(a, 'RGB').resize((a.shape[1], HOEHE), Image.BICUBIC).save(pfad, optimize=True)


def diffbild(dB_o, dB_k, oben, pfad):
    """Doc minus a clone, weighted by how much sound is there: silence carries no information,
    and its random differences would otherwise fill the picture with noise."""
    t = np.clip((dB_o - dB_k) / DIFF_SKALA, -1, 1)
    gewicht = np.clip((np.maximum(dB_o, dB_k) - (oben - 70)) / 45, 0, 1)
    staerke = (np.abs(t) * gewicht)[..., None]
    ziel = np.where((t >= 0)[..., None], ROT, BLAU)
    bild(GRUND + (ziel - GRUND) * staerke, pfad)


def grundfrequenz(x, sr, lo=65.0, hi=320.0):
    """Fundamental frequency of the voiced frames by autocorrelation: median and middle half.
    Separate from timbre on purpose - a clone that speaks lower or flatter is a pitch and a
    melody difference, which the TTS prompt or a pitch shift can address and an EQ cannot."""
    n, hop, werte = int(0.040 * sr), int(0.010 * sr), []
    fenster = np.hanning(n)
    for s in range(0, len(x) - n, hop):
        fr = x[s:s + n] * fenster
        if np.sqrt(np.mean(fr ** 2)) < 0.01:
            continue
        ac = np.fft.irfft(np.abs(np.fft.rfft(fr, 2 * n)) ** 2)[:n]
        if ac[0] <= 0:
            continue
        ac = ac / ac[0]
        a, b = int(sr / hi), int(sr / lo)
        k = a + int(np.argmax(ac[a:b]))
        if ac[k] > 0.55:
            werte.append(sr / k)
    w = np.array(werte) if werte else np.array([np.nan])
    return {'median_hz': round(float(np.median(w)), 1),
            'von_hz': round(float(np.percentile(w, 25)), 1), 'bis_hz': round(float(np.percentile(w, 75)), 1)}


def glaette(y, f, oktave):
    """Mean of y over a band of `oktave` octaves around each frequency - cumulative sums, fast."""
    cs = np.concatenate([[0.0], np.cumsum(y)])
    lo = np.searchsorted(f, f * 2 ** (-oktave / 2))
    hi = np.maximum(np.searchsorted(f, f * 2 ** (oktave / 2), side='right'), lo + 1)
    return (cs[hi] - cs[lo]) / (hi - lo)


def paare():
    """Every text Doc read, with the clone reading the same text: the story (the comparison files)
    and each long passage the clone has re-read into nachgesprochen/. Nothing else is comparable -
    a long-term spectrum of two DIFFERENT texts would measure the texts, not the voices."""
    out = {'story': (os.path.join(STORE, 'vergleich-original.wav'), os.path.join(STORE, 'vergleich-klon.wav'))}
    nd = os.path.join(STORE, 'nachgesprochen')
    if os.path.isdir(nd):
        for name in sorted(os.listdir(nd)):
            tid = name[:-4]
            if name.endswith('.wav') and os.path.isfile(os.path.join(STORE, tid + '.wav')):
                out[tid] = (os.path.join(STORE, tid + '.wav'), os.path.join(nd, name))
    return out


def timbre_paar(pfad_doc, pfad_klon):
    """Doc's long-term spectrum minus the clone's for one text - the TIMBRE an EQ can fix.

    Third octaves (the usual measure of timbre; finer, and the search chases single overtones),
    power smoothed before dB like the band table, both at equal loudness. No time alignment: a
    long-term spectrum does not care about timing, and aligning counts stretched sounds twice.
    Below ~350 Hz it is PITCH, not timbre (Doc 122 Hz, the clone 112 Hz, measured 24.09.2026):
    an EQ cannot move a pitch, it only piles energy onto Doc's fundamental and drones - so there
    the target carries on flat and the filter stays neutral.
    """
    (xd, sr), (xk, _) = lies(pfad_doc), lies(pfad_klon)
    f = np.fft.rfftfreq(N_FFT, 1 / sr)
    Ld = leistung(xd / (np.sqrt(np.mean(xd ** 2)) + 1e-12)).mean(axis=0)
    Lk = leistung(xk / (np.sqrt(np.mean(xk ** 2)) + 1e-12)).mean(axis=0)
    z = 10 * np.log10(glaette(Ld, f, 1 / 3) + 1e-20) - 10 * np.log10(glaette(Lk, f, 1 / 3) + 1e-20)
    k = int(np.searchsorted(f, TIMBRE_AB))
    z[:k] = z[k]
    return f, z, len(xd) / sr, len(xk) / sr


def timbre_laut(pfad_doc, pfad_klon):
    """Timbre compared SOUND BY SOUND: the clone is aligned to Doc (DTW), and every one of Doc's
    moments is compared with the clone saying the same sound; the difference is averaged over
    Doc's timeline, weighted by energy. Tempo and stretching drop out - in the plain long-term
    spectrum they leak in (whoever draws vowels out has more vowel energy), which is why a filter
    fitted to one text made the other worse (measured 24.09.2026). Same smoothing and the same
    flat bass as timbre_paar.
    """
    (xd, sr), (xk, _) = lies(pfad_doc), lies(pfad_klon)
    Pd = leistung(xd / (np.sqrt(np.mean(xd ** 2)) + 1e-12) * 0.05)
    Pk = leistung(xk / (np.sqrt(np.mean(xk ** 2)) + 1e-12) * 0.05)
    paare_ = dtw(merkmale(Pd, sr), merkmale(Pk, sr))
    Pka = np.stack([Pk[js].mean(axis=0) for js in paare_])
    dBd, dBk = 10 * np.log10(Pd + 1e-20), 10 * np.log10(Pka + 1e-20)
    oben = max(dBd.max(), dBk.max())
    w = np.clip((np.maximum(dBd, dBk) - (oben - 70)) / 45, 0, 1)
    dbar = (w * (dBd - dBk)).sum(axis=0) / (w.sum(axis=0) + 1e-12)
    f = np.fft.rfftfreq(N_FFT, 1 / sr)
    z = glaette(dbar, f, 1 / 3)
    k = int(np.searchsorted(f, TIMBRE_AB))
    z[:k] = z[k]
    return f, z


def zielkurve(dB_o, dB_k, oben, sr, pfad):
    """The targets for the CMA-ES filter search (Doc, 24.09.2026: "CMAES optimiert die Filter bis
    Identitaet") - one timbre curve per text pair, so the page can train on some texts and TEST
    on the others: a filter that only fits the story would have learned the story, not the voice.

    Weight 1/f gives every octave the same say (linearly spaced bins would hand the top octave
    half the vote). What moves from moment to moment - SPEAKING STYLE: prosody, a vowel gliding -
    is measured on the aligned story and reported, not optimised: no fixed filter follows it.
    """
    kurven, laut, f = {}, {}, None
    for tid, (pd, pk) in paare().items():
        f, z, td, tk = timbre_paar(pd, pk)
        kurven[tid] = (z, td, tk)
        laut[tid] = timbre_laut(pd, pk)[1]
    drin = (f >= 70) & (f <= 11500)
    g = np.where(drin, 1 / np.maximum(f, 1), 0.0)

    def start(z):
        c0 = (g * z).sum() / g.sum()
        return float(np.sqrt((g * (z - c0) ** 2).sum() / g.sum()))

    d = dB_o - dB_k
    w = np.clip((np.maximum(dB_o, dB_k) - (oben - 70)) / 45, 0, 1)
    W = w.sum(axis=0) + 1e-12
    sprechweise = float(np.sqrt((w * (d - ((w * d).sum(axis=0) / W)[None, :]) ** 2).sum() / W.sum()))

    with open(pfad, 'w', encoding='utf-8') as fh:
        json.dump({'sr': sr, 'freq': [round(float(x), 2) for x in f[drin]],
                   'gewicht': [float('%.6g' % x) for x in g[drin]],
                   'paare': {tid: {'ziel': [round(float(x), 3) for x in z[drin]], 'start_db': round(start(z), 3),
                                   'ziel_laut': [round(float(x), 3) for x in laut[tid][drin]],
                                   'start_laut_db': round(start(laut[tid]), 3),
                                   'dauer_doc_s': round(td, 1), 'dauer_klon_s': round(tk, 1)}
                             for tid, (z, td, tk) in kurven.items()},
                   'sprechweise_db': round(sprechweise, 2)}, fh)


def main():
    os.makedirs(ZIEL, exist_ok=True)
    signale = {}
    for name, datei in QUELLEN.items():
        pfad = os.path.join(STORE, datei)
        if not os.path.isfile(pfad):
            sys.exit('Fehlt: %s - erst in der Kabine die Vergleichsdateien anlegen.' % pfad)
        signale[name] = lies(pfad)
    pfad_eq = os.path.join(STORE, QUELLE_EQ[1])
    if os.path.isfile(pfad_eq):
        signale[QUELLE_EQ[0]] = lies(pfad_eq)
    sr = signale['original'][1]
    if signale['klon'][1] != sr:
        sys.exit('Abtastraten verschieden - beide müssen gleich sein')

    # equal overall loudness first, or the whole difference turns blue (the clone is 2.9 dB louder)
    for name in signale:
        x, _ = signale[name]
        signale[name] = (x / (np.sqrt(np.mean(x ** 2)) + 1e-12) * 0.05, sr)

    P = {name: leistung(x) for name, (x, _) in signale.items()}
    paare = dtw(merkmale(P['original'], sr), merkmale(P['klon'], sr))
    # the clone brought onto Doc's clock: every Doc frame gets the mean power of its partners
    P_klon = np.stack([P['klon'][js].mean(axis=0) for js in paare])
    P_orig = P['original']
    # the filtered clone is the same recording through an EQ - identical timing, so the very same
    # alignment path applies; no second DTW needed
    P_eq = np.stack([P['klon_eq'][js].mean(axis=0) for js in paare]) if 'klon_eq' in P else None

    dB_o = 10 * np.log10(P_orig + 1e-20)
    dB_k = 10 * np.log10(P_klon + 1e-20)
    dB_e = 10 * np.log10(P_eq + 1e-20) if P_eq is not None else None
    oben = max(dB_o.max(), dB_k.max(), dB_e.max() if dB_e is not None else -1e9)
    unten = oben - DYNAMIK

    bild(farbband(INTENSITAET, (dB_o - unten) / DYNAMIK), os.path.join(ZIEL, 'original.png'))
    bild(farbband(INTENSITAET, (dB_k - unten) / DYNAMIK), os.path.join(ZIEL, 'klon.png'))

    diffbild(dB_o, dB_k, oben, os.path.join(ZIEL, 'diff.png'))
    zielkurve(dB_o, dB_k, oben, sr, os.path.join(ZIEL, 'ziel.json'))
    if dB_e is not None:
        diffbild(dB_o, dB_e, oben, os.path.join(ZIEL, 'diff-eq.png'))

    # per-band balance: each band's share of the total, clone against Doc
    f = np.fft.rfftfreq(N_FFT, 1 / sr)
    def anteil(Pm, a, b):
        return 10 * np.log10(Pm[:, (f >= a) & (f < b)].sum() / Pm.sum())
    baender = []
    for n, a, b in BAENDER:
        zeile = {'name': n, 'von': a, 'bis': b,
                 'klon_minus_original_db': round(float(anteil(P['klon'], a, b) - anteil(P_orig, a, b)), 1)}
        if 'klon_eq' in P:
            zeile['klon_eq_minus_original_db'] = round(float(anteil(P['klon_eq'], a, b) - anteil(P_orig, a, b)), 1)
        baender.append(zeile)

    daten = {
        'erstellt': datetime.datetime.now().isoformat(timespec='seconds'),
        'dauer_original_s': round(len(signale['original'][0]) / sr, 2),
        'dauer_klon_s': round(len(signale['klon'][0]) / sr, 2),
        'frames': int(len(P_orig)), 'hop_ms': HOP * 1000 / sr, 'nyquist_hz': sr / 2,
        'skala_db': [round(float(unten - oben), 1), 0.0], 'diff_skala_db': DIFF_SKALA,
        'baender': baender, 'mit_eq': 'klon_eq' in P,
        'tonhoehe': {'original': grundfrequenz(lies(os.path.join(STORE, QUELLEN['original']))[0], sr),
                     'klon': grundfrequenz(lies(os.path.join(STORE, QUELLEN['klon']))[0], sr)},
        # the colour ramps travel with the numbers, so the page's legends are drawn from the very
        # same values that painted the pictures - one source, not two copies that drift apart
        'farben': {'intensitaet': [[t, list(c)] for t, c in INTENSITAET],
                   'grund': GRUND.tolist(), 'rot': ROT.tolist(), 'blau': BLAU.tolist()},
    }
    with open(os.path.join(ZIEL, 'daten.json'), 'w', encoding='utf-8') as fh:
        json.dump(daten, fh, ensure_ascii=False, indent=1)

    print('Analyse fertig ->', ZIEL)
    for b in baender:
        eq = ('   mit Höhen %+5.1f dB' % b['klon_eq_minus_original_db']) if 'klon_eq_minus_original_db' in b else ''
        print('   %-11s %5d-%5d Hz   Klon %+5.1f dB%s' % (b['name'], b['von'], b['bis'],
                                                          b['klon_minus_original_db'], eq))
    return daten


if __name__ == '__main__':
    main()
