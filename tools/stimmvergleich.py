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
    daten.json     scale, durations, per-band balance - the numbers under the picture

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

N_FFT = 1024          # ~43 ms window at 24 kHz
HOP = 480             # 20 ms - finer than a pixel at page width, coarse enough for a quick DTW
HOEHE = 420           # picture height in pixels (frequency axis, 0 Hz at the bottom)
DYNAMIK = 90.0        # dB shown below the loudest cell
DIFF_SKALA = 20.0     # +-dB that saturate the difference colours
BAND = 250            # DTW corridor, frames either side of the diagonal (= 5 s)

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


def main():
    os.makedirs(ZIEL, exist_ok=True)
    signale = {}
    for name, datei in QUELLEN.items():
        pfad = os.path.join(STORE, datei)
        if not os.path.isfile(pfad):
            sys.exit('Fehlt: %s - erst in der Kabine die Vergleichsdateien anlegen.' % pfad)
        signale[name] = lies(pfad)
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

    dB_o = 10 * np.log10(P_orig + 1e-20)
    dB_k = 10 * np.log10(P_klon + 1e-20)
    oben = max(dB_o.max(), dB_k.max())
    unten = oben - DYNAMIK

    bild(farbband(INTENSITAET, (dB_o - unten) / DYNAMIK), os.path.join(ZIEL, 'original.png'))
    bild(farbband(INTENSITAET, (dB_k - unten) / DYNAMIK), os.path.join(ZIEL, 'klon.png'))

    # the difference, weighted by how much sound is there: silence carries no information,
    # and its random differences would otherwise fill the picture with noise
    diff = dB_o - dB_k
    t = np.clip(diff / DIFF_SKALA, -1, 1)
    gewicht = np.clip((np.maximum(dB_o, dB_k) - (oben - 70)) / 45, 0, 1)
    staerke = (np.abs(t) * gewicht)[..., None]
    ziel = np.where((t >= 0)[..., None], ROT, BLAU)
    bild(GRUND + (ziel - GRUND) * staerke, os.path.join(ZIEL, 'diff.png'))

    # per-band balance: each band's share of the total, clone against Doc
    f = np.fft.rfftfreq(N_FFT, 1 / sr)
    def anteil(Pm, a, b):
        return 10 * np.log10(Pm[:, (f >= a) & (f < b)].sum() / Pm.sum())
    baender = [{'name': n, 'von': a, 'bis': b,
                'klon_minus_original_db': round(float(anteil(P['klon'], a, b) - anteil(P_orig, a, b)), 1)}
               for n, a, b in BAENDER]

    daten = {
        'erstellt': datetime.datetime.now().isoformat(timespec='seconds'),
        'dauer_original_s': round(len(signale['original'][0]) / sr, 2),
        'dauer_klon_s': round(len(signale['klon'][0]) / sr, 2),
        'frames': int(len(P_orig)), 'hop_ms': HOP * 1000 / sr, 'nyquist_hz': sr / 2,
        'skala_db': [round(float(unten - oben), 1), 0.0], 'diff_skala_db': DIFF_SKALA,
        'baender': baender,
        # the colour ramps travel with the numbers, so the page's legends are drawn from the very
        # same values that painted the pictures - one source, not two copies that drift apart
        'farben': {'intensitaet': [[t, list(c)] for t, c in INTENSITAET],
                   'grund': GRUND.tolist(), 'rot': ROT.tolist(), 'blau': BLAU.tolist()},
    }
    with open(os.path.join(ZIEL, 'daten.json'), 'w', encoding='utf-8') as fh:
        json.dump(daten, fh, ensure_ascii=False, indent=1)

    print('Analyse fertig ->', ZIEL)
    for b in baender:
        print('   %-11s %5d-%5d Hz   Klon gegenüber Original %+5.1f dB' % (b['name'], b['von'], b['bis'],
                                                                         b['klon_minus_original_db']))
    return daten


if __name__ == '__main__':
    main()
