#!/usr/bin/env python3
"""DocMitschrift: who is speaking - Doc or someone else? (Doc's wish, 07.11.2026)

Every sentence of a transcript gets "doc" or "andere" plus a similarity value, so the reading page can
colour Doc's sentences differently from everybody else's.

Privacy (Doc's explicit wish): only Doc has a voice profile, made with his consent from his own
recordings. Nobody else is ever profiled: the embeddings of other voices (pupils!) exist only in the
memory of one run and are never written anywhere - the only thing that leaves a run is "andere".
Profile, model and Python environment live on this Mac, outside the repo, never in the cloud:

    ~/Documents/mitschrift/stimme/venv/         Python with sherpa-onnx + numpy
    ~/Documents/mitschrift/stimme/modell/       the speaker model (ONNX, ~28 MB, Apache-2.0, 3D-Speaker)
    ~/Documents/mitschrift/stimme/profil.json   Doc's profile: averaged voice vectors, nothing else

Commands:

    python3 docmitschrift-app/sprecher.py einrichten
        builds the environment and fetches the model (checksum verified)
    python3 docmitschrift-app/sprecher.py anlernen --name sauber FILE...
        voice vector from recordings where ONLY Doc speaks (e.g. ~/Movies/stimmklon/*.wav);
        one vector per microphone (sauber, dji, ...), a sentence counts as Doc's if any of them fits
    python3 docmitschrift-app/sprecher.py pruefen FILE...
        share of Doc per file, numbers only (to check a profile)

From mitschrift.py (import needs nothing but the standard library):

    import sprecher
    labels = sprecher.erkenne(audio_path, sentences)

sentences are transcribe()'s rows with "start"/"end" in seconds from the start of the piece. The answer
is a list of the same length with {"sprecher": "doc"|"andere"|None, "aehnlich": float|None} per sentence
(None = too short to tell), or None for the whole piece when the environment or the profile is missing or
anything goes wrong - the transcript must never fail because of this.
"""

import argparse
import datetime as dt
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import wave
from pathlib import Path

HOME = Path.home() / "Documents" / "mitschrift" / "stimme"
VENV = HOME / "venv"
VENV_PY = VENV / "bin" / "python3"
PROFILE = HOME / "profil.json"
MODEL_NAME = "3dspeaker_speech_campplus_sv_zh_en_16k-common_advanced.onnx"
MODEL = HOME / "modell" / MODEL_NAME
MODEL_URL = ("https://github.com/k2-fsa/sherpa-onnx/releases/download/speaker-recongition-models/"
             + MODEL_NAME)
MODEL_SHA256 = "aa3cfc16963a10586a9393f5035d6d6b57e98d358b347f80c2a30bf4f00ceba2"
PACKAGES = ["sherpa-onnx==2.0.1", "numpy"]

SR = 16000
WIN, HOP = 2.0, 1.0          # seconds: one voice vector per 2-s window, every second
QUIET_DB = -50               # windows quieter than this (RMS, dBFS) are silence, not a voice
THRESHOLD = 0.30             # similarity at or above this = Doc. Measured 07.11.2026 with the clean
                             # profile: a lecture by someone else stayed below 0.25 in every sentence,
                             # Doc alone on the Pixel 0.33-0.6
MIN_SENTENCE = 1.0           # seconds: shorter sentences get no label


# ---------------------------------------------------------------- called from mitschrift.py (stdlib only)

def erkenne(audio, sentences, timeout=900):
    """Labels per sentence, or None if speaker recognition is not set up or fails."""
    if not (VENV_PY.exists() and PROFILE.exists() and MODEL.exists()):
        return None
    try:
        want = [{"start": float(s["start"]), "end": float(s["end"])} for s in sentences]
        r = subprocess.run([str(VENV_PY), "-I", str(Path(__file__).resolve()), "erkenne", str(audio)],
                           input=json.dumps(want), capture_output=True, text=True, timeout=timeout)
        if r.returncode != 0:
            print(f"    Sprecher: {(r.stderr.strip().splitlines() or ['Fehler'])[-1]}", file=sys.stderr)
            return None
        labels = json.loads(r.stdout)
        return labels if isinstance(labels, list) and len(labels) == len(sentences) else None
    except Exception as e:                      # noqa: BLE001 - never break the transcript
        print(f"    Sprecher: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------- audio

def ffmpeg():
    return shutil.which("ffmpeg") or next((p for p in ("/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg")
                                           if os.path.exists(p)), None)


def load(path):
    """Mono float32 samples at 16 kHz. ffmpeg if there, else macOS afconvert via a temporary WAV."""
    import numpy as np
    exe = ffmpeg()
    if exe:
        out = subprocess.run([exe, "-nostdin", "-loglevel", "error", "-i", str(path), "-f", "f32le",
                              "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
        return np.frombuffer(out, dtype=np.float32).copy()
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "a.wav"
        subprocess.run(["afconvert", "-f", "WAVE", "-d", f"LEI16@{SR}", "-c", "1", str(path), str(wav)],
                       capture_output=True, check=True)
        with wave.open(str(wav)) as w:
            pcm = w.readframes(w.getnframes())
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0


def windows(x, win=WIN, hop=HOP, quiet=QUIET_DB):
    """(start in s, samples) for every window loud enough to hold a voice."""
    import numpy as np
    n, h = int(win * SR), int(hop * SR)
    out = []
    for i in range(0, max(1, len(x) - n + 1), h):
        w = x[i:i + n]
        if len(w) < n // 2:
            break
        if 20 * np.log10(np.sqrt(np.mean(w ** 2)) + 1e-9) > quiet:
            out.append((i / SR, w))
    return out


# ---------------------------------------------------------------- voice vectors (inside the venv)

class Voice:
    def __init__(self):
        import sherpa_onnx
        cfg = sherpa_onnx.SpeakerEmbeddingExtractorConfig(model=str(MODEL), num_threads=4, debug=False,
                                                          provider="cpu")
        self.ex = sherpa_onnx.SpeakerEmbeddingExtractor(cfg)

    def vector(self, samples):
        import numpy as np
        s = self.ex.create_stream()
        s.accept_waveform(SR, samples)
        s.input_finished()
        v = np.array(self.ex.compute(s), dtype=np.float32)
        return v / (np.linalg.norm(v) + 1e-9)


def read_profile():
    import numpy as np
    p = json.loads(PROFILE.read_text())
    if p.get("modell") != MODEL_NAME:
        raise SystemExit(f"Profil gehört zu {p.get('modell')}, Modell ist {MODEL_NAME} - neu anlernen")
    return p, np.stack([np.array(v, dtype=np.float32) for v in p["vektoren"].values()])


def similarity(vectors, profile_vectors):
    """Per window: the best match among Doc's vectors (one per microphone)."""
    return (vectors @ profile_vectors.T).max(axis=1)


def label_sentences(audio, sentences):
    import numpy as np
    _, P = read_profile()
    voice = Voice()
    x = load(audio)
    ws = windows(x)
    starts = np.array([t for t, _ in ws])
    sims = similarity(np.stack([voice.vector(w) for _, w in ws]), P) if ws else np.zeros(0)
    centers = starts + WIN / 2
    out = []
    for s in sentences:
        a, b = s["start"], s["end"]
        if b - a < MIN_SENTENCE:
            out.append({"sprecher": None, "aehnlich": None})
            continue
        m = (centers >= a - 0.5) & (centers <= b + 0.5)
        if m.any():
            sim = float(np.mean(sims[m]))
        else:                                   # short sentence between window centres: its own vector
            seg = x[int(a * SR):int(b * SR)]
            if len(seg) < MIN_SENTENCE * SR:
                out.append({"sprecher": None, "aehnlich": None})
                continue
            sim = float(similarity(voice.vector(seg)[None, :], P)[0])
        out.append({"sprecher": "doc" if sim >= THRESHOLD else "andere", "aehnlich": round(sim, 3)})
    return out


# ---------------------------------------------------------------- commands

def cmd_einrichten(_):
    HOME.mkdir(parents=True, exist_ok=True)
    if not VENV_PY.exists():
        arm = "/opt/homebrew/bin/python3"          # native Apple Silicon, not an x86 one first in PATH
        subprocess.run([arm if os.path.exists(arm) else sys.executable, "-m", "venv", str(VENV)], check=True)
    subprocess.run([str(VENV_PY), "-m", "pip", "install", "-q", "--upgrade", "pip", *PACKAGES], check=True)
    MODEL.parent.mkdir(exist_ok=True)
    if not MODEL.exists() or hashlib.sha256(MODEL.read_bytes()).hexdigest() != MODEL_SHA256:
        tmp = MODEL.with_suffix(".part")
        urllib.request.urlretrieve(MODEL_URL, tmp)
        if hashlib.sha256(tmp.read_bytes()).hexdigest() != MODEL_SHA256:
            tmp.unlink()
            raise SystemExit("Modell-Prüfsumme stimmt nicht - nicht übernommen")
        tmp.rename(MODEL)
    print(f"Bereit: {VENV_PY}\n        {MODEL}")


def cmd_anlernen(args):
    import numpy as np
    voice = Voice()
    old, _ = read_profile() if PROFILE.exists() else ({}, None)
    vs = [voice.vector(w) for f in args.dateien for _, w in windows(load(f), 3.0, 1.5, -45)]
    if len(vs) < 20:
        raise SystemExit(f"Nur {len(vs)} Fenster - bitte mindestens eine Minute Doc allein")
    mean = np.mean(vs, axis=0)
    mean /= np.linalg.norm(mean)
    profile = {
        "modell": MODEL_NAME,
        "vektoren": {**old.get("vektoren", {}), args.name: [round(float(v), 6) for v in mean]},
        "quellen": {**old.get("quellen", {}), args.name: {
            "dateien": [Path(f).name for f in args.dateien], "fenster": len(vs),
            "wann": dt.datetime.now().isoformat(timespec="minutes")}},
    }
    tmp = PROFILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(profile, indent=1))
    os.chmod(tmp, 0o600)
    tmp.rename(PROFILE)
    print(f"Profil „{args.name}“: {len(vs)} Fenster aus {len(args.dateien)} Datei(en) → {PROFILE}")


def cmd_pruefen(args):
    import numpy as np
    _, P = read_profile()
    voice = Voice()
    for f in args.dateien:
        ws = windows(load(f))
        if not ws:
            print(f"{Path(f).name}: still")
            continue
        sims = similarity(np.stack([voice.vector(w) for _, w in ws]), P)
        print(f"{Path(f).name}: Doc {np.mean(sims >= THRESHOLD):.0%} von {len(ws)} Fenstern, "
              f"Ähnlichkeit Median {np.median(sims):.2f}")


def cmd_erkenne(args):
    sentences = json.loads(sys.stdin.read())
    json.dump(label_sentences(args.audio, sentences), sys.stdout)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("einrichten")
    a = sub.add_parser("anlernen")
    a.add_argument("--name", required=True, help="sauber | pixel | dji ... (one vector per microphone)")
    a.add_argument("dateien", nargs="+")
    p = sub.add_parser("pruefen")
    p.add_argument("dateien", nargs="+")
    e = sub.add_parser("erkenne")
    e.add_argument("audio")
    args = ap.parse_args()
    if args.cmd != "einrichten" and Path(sys.prefix).resolve() != VENV.resolve():
        if not VENV_PY.exists():
            raise SystemExit("Erst: python3 docmitschrift-app/sprecher.py einrichten")
        os.execv(str(VENV_PY), [str(VENV_PY), "-I", str(Path(__file__).resolve()), *sys.argv[1:]])
    {"einrichten": cmd_einrichten, "anlernen": cmd_anlernen, "pruefen": cmd_pruefen,
     "erkenne": cmd_erkenne}[args.cmd](args)


if __name__ == "__main__":
    main()
