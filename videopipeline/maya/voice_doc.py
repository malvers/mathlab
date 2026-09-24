#!/usr/bin/env python3
"""Doc's voice for the Maya tour: narration.json -> ~/Movies/videopipeline/maya/sN.mp3 + texts.json,
and the exact second every line starts -> HTML/tours/maya-times.js (the Drehbuch syncs to those).

    python3 videopipeline/maya/voice_doc.py
    python3 videopipeline/maya/voice_doc.py --cache-only    # no request at all: what is cached, scene by scene

The clone has a DAILY limit (100 requests on Tier 1, one pot with the tts function - measured 24.09.2026). With
--cache-only a scene takes its lines in the current style if all are cached, else all in the style before
(STYLE_OLD), else it keeps its mp3 and its line starts as they are - one voice per scene, never mixed.

Every line is spoken on its own by the cloned voice (tools/stimme-hochladen.py, gemini_probe - the same
call, voice and style as the Stimmklon samples), trimmed to the voice and cached under its text: a
changed line costs one request, an unchanged one nothing (~0.02 cent per second of speech). The scene is
then glued together with known pauses, so the line starts are measured, not estimated.
"""
import hashlib
import importlib.util
import json
import os
import subprocess
import sys
import time
import urllib.error

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
WORK = os.path.expanduser('~/Movies/videopipeline/maya')
CACHE = os.path.join(WORK, 'lines')
TIMES = os.path.join(REPO, 'HTML', 'tours', 'maya-times.js')
PAUSE = 0.5               # silence between two lines unless the line asks for more
RATE = 24000
# Doc 24.09.2026 after the first run: "klingt ein bisschen pathetisch ... nicht so kindlich - meine Schülerinnen
# und Schüler sind in der 9. bis 13. Klasse". The style is part of the cache key: a new one speaks every line anew.
STYLE = ('ruhig und sachlich, mit leiser Begeisterung für die Sache, wie ein Lehrer vor einer Oberstufenklasse - '
         'nicht pathetisch, nicht kindlich, normales Sprechtempo')

spec = importlib.util.spec_from_file_location('stimme', os.path.join(REPO, 'tools', 'stimme-hochladen.py'))
stimme = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stimme)


def dur(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


# the first run (before Doc's remark) was keyed by the text alone
STYLE_OLD = None


def key_of(text, style):
    return hashlib.sha1(((style + '|') if style else '').encode('utf-8') + text.encode('utf-8')).hexdigest()[:12]


def cached(text, style):
    cut = os.path.join(CACHE, key_of(text, style) + '.wav')
    return cut if os.path.isfile(cut) else None


def spoken(text, vid):
    """The line in Doc's voice, trimmed to where the voice is - cached by its text."""
    h = key_of(text, STYLE)
    raw, cut = os.path.join(CACHE, h + '-raw.wav'), os.path.join(CACHE, h + '.wav')
    if not os.path.isfile(cut):
        for attempt in range(8):
            if os.path.isfile(raw):
                break
            try:
                stimme.gemini_probe(text, vid, ziel=raw, abspielen=False, stil=STYLE)
            except urllib.error.HTTPError as e:
                if e.code != 429:
                    raise
                wait = 20 * (attempt + 1)          # the per-minute quota - wait it out, do not pay twice
                print(f'  429 - warte {wait} s')
                time.sleep(wait)
            except (TimeoutError, urllib.error.URLError) as e:
                print(f'  Netz: {e} - noch einmal in 10 s')
                time.sleep(10)
        trim = 'silenceremove=start_periods=1:start_threshold=-50dB'
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', raw,
                        '-af', f'{trim},areverse,{trim},areverse', '-ac', '1', '-ar', str(RATE), cut], check=True)
    return cut


def main():
    os.makedirs(CACHE, exist_ok=True)
    with open(os.path.join(os.path.dirname(__file__), 'narration.json'), encoding='utf-8') as f:
        script = {k: v for k, v in json.load(f).items() if not k.startswith('_')}
    with open(stimme.VOICE, encoding='utf-8') as f:
        vid = json.load(f)['voice_id']

    only_cache = '--cache-only' in sys.argv
    try:
        with open(os.path.join(WORK, 'texts.json'), encoding='utf-8') as f:
            old_texts = json.load(f)
        with open(TIMES, encoding='utf-8') as f:
            old_times = json.loads(f.read().split('window.MAYA_TIMES = ', 1)[1].rstrip().rstrip(';'))
    except (OSError, IndexError, ValueError):
        old_texts, old_times = {}, {}

    texts, times = {}, {}
    for sid, lines in script.items():
        lines = [x if isinstance(x, dict) else {'text': x} for x in lines]
        pick = found = None
        if only_cache:
            for style in (STYLE, STYLE_OLD):
                if all(cached(x['text'], style) for x in lines):
                    pick, found = style, True
                    break
            if not found and sid in old_times:
                texts[sid], times[sid] = old_texts.get(sid, ''), old_times[sid]
                print(f'{sid}: nicht vollständig im Cache - bleibt wie es war')
                continue
        parts, starts, t = [], [], 0.0
        for k, line in enumerate(lines):
            gap = 0.0 if k == 0 else line.get('pause', PAUSE)
            wav = cached(line['text'], pick) if only_cache else spoken(line['text'], vid)
            t += gap
            starts.append(round(t, 2))
            parts.append((gap, wav))
            t += dur(wav)
        # glue: every line after its pause, one mp3 per scene
        args, chain = [], ''
        for i, (gap, wav) in enumerate(parts):
            args += ['-i', wav]
            chain += f'[{i}:a]adelay={int(gap * 1000)}:all=1[p{i}];'
        chain += ''.join(f'[p{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1[a]'
        out = os.path.join(WORK, sid + '.mp3')
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', *args, '-filter_complex', chain,
                        '-map', '[a]', '-ac', '1', '-ar', str(RATE), '-b:a', '96k', out], check=True)
        texts[sid] = '<speak>' + '<break time="500ms"/>'.join(x['text'] for x in lines) + '</speak>'
        times[sid] = starts
        print(f'{sid}: {len(lines)} Zeilen, {dur(out):.1f} s  {starts}' + ('  (alter Stil)' if only_cache and pick is STYLE_OLD else ''))

    with open(os.path.join(WORK, 'texts.json'), 'w', encoding='utf-8') as f:
        json.dump(texts, f, ensure_ascii=False, indent=1)
    with open(TIMES, 'w', encoding='utf-8') as f:
        f.write('/* Written by videopipeline/maya/voice_doc.py - do not edit. The second each of Doc\'s lines starts,\n'
                '   per scene, measured on the glued voice. tours/maya.js syncs its taps to these. */\n')
        f.write('window.MAYA_TIMES = ' + json.dumps(times) + ';\n')


if __name__ == '__main__':
    main()
