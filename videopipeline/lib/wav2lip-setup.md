# Wav2Lip lokal auf dem M3 (Ersatz für D-ID)

Einmalige Einrichtung, danach kostet kein Solita-Clip mehr Credits.

## 1. Repo + venv

```bash
mkdir -p ~/tools && cd ~/tools
git clone https://github.com/Rudrabha/Wav2Lip.git && cd Wav2Lip
python3 -m venv venv && ./venv/bin/pip install -U pip
./venv/bin/pip install "numpy<2" "librosa==0.9.2" opencv-python torch torchvision tqdm numba
```

`numpy<2` und `librosa==0.9.2` sind wichtig — mit neueren Versionen bricht `audio.py` beim Mel-Spektrogramm ab.
Wav2Lip läuft auf dem M3 auf der **CPU** (der Code fragt nur nach CUDA). Das ist okay: der Flaschenhals ist
die Gesichtserkennung, nicht das Netz.

## 2. Zwei Checkpoints ablegen

- `checkpoints/wav2lip_gan.pth` — das Lippen-Modell (Link steht im README des Repos)
- `face_detection/detection/sfd/s3fd.pth` — der Gesichtsdetektor, wird **nicht** automatisch geladen

Ohne den zweiten läuft `inference.py` bis zum Face-Detect-Schritt und stirbt dort.

## 3. Idle-Loop von Solita bauen

Wav2Lip animiert nur den Mund — ein Standbild wirkt deshalb wie eingefroren. Einmal einen D-ID-Clip
rendern lassen (irgendein Text, ~6 s), daraus den stummen Teil als Loop schneiden:

```bash
ffmpeg -i talk_beliebig.mp4 -ss 0 -t 6 -an assets/solita_idle.mp4
```

Den Rest macht `lib/wav2lip.mjs`: ping-pong (vorwärts + rückwärts) und auf die Länge der Narration
wiederholen, damit kein Schnitt sichtbar ist.

## 4. In der Pipeline umstellen

In `run2.mjs` nur den Import tauschen:

```js
// import { makeTalks } from '../lib/did.mjs';
import { makeTalks } from '../lib/wav2lip.mjs';

await makeTalks(`${__dirname}/assets/solita_idle.mp4`, [`${OUT}/fullnarration.mp3`], { outDir: OUT });
```

Rückgabewert und Dateinamen (`talk_<name>.mp4`) sind identisch, `compose` merkt nichts.

## Stellschrauben

| Option | Wirkung |
|---|---|
| `resize: 2` | halbiert die Auflösung vor der Erkennung → ca. 3× schneller, für die kleine Bubble unkritisch |
| `batch: 8` | weniger RAM, falls der Prozess wegen Speicher abgeschossen wird |
| `WAV2LIP_DIR` | anderer Installationspfad als `~/tools/Wav2Lip` |

Grober Richtwert auf dem M3: ein 15-s-Clip in 1–3 min, mit `resize: 2` deutlich darunter.
