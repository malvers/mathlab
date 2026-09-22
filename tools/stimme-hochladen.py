#!/usr/bin/env python3
"""Sends the recorded takes to ElevenLabs and makes a voice out of them.

    python3 tools/stimme-hochladen.py              # upload, print the voice id
    python3 tools/stimme-hochladen.py --probe      # let the finished voice say a sentence
    python3 tools/stimme-hochladen.py --probe "eigener Text"

The API key NEVER lives in this file (rule 18/21 - this repo is public). It comes out of the
macOS keychain, the same way the DOCPAD password does:

    security add-generic-password -s elevenlabs -a api -w        # asks for the key, stores it

What gets uploaded: every take in ~/Movies/stimmklon that is neither too short nor too quiet -
the booth already measured both and wrote them into aufnahmen.json, so a botched take cannot
quietly poison the clone. The voice id lands in stimme.json next to the takes (an id, not a
secret), and tools that speak later read it from there.
"""
import json
import mimetypes
import os
import subprocess
import sys
import urllib.request
import uuid

STORE = os.path.expanduser('~/Movies/stimmklon')
INDEX = os.path.join(STORE, 'aufnahmen.json')
VOICE = os.path.join(STORE, 'stimme.json')
API = 'https://api.elevenlabs.io/v1'
NAME = 'Doc Alvers'

# Same thresholds the booth shows in the list - one definition of "unusable", not two.
MIN_PEGEL = -45.0     # dB mean; below this there is room noise and no voice
KURZ_ANTEIL = 0.55    # of the duration the text should take at ~13 characters a second


def key():
    """The key from the keychain - never a default, never a prompt argument (it would land in the
    shell history). Missing key: say how to put it there and stop."""
    try:
        out = subprocess.run(['security', 'find-generic-password', '-s', 'elevenlabs', '-a', 'api', '-w'],
                             capture_output=True, text=True, timeout=20)
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except Exception:
        pass
    sys.exit('Kein Schlüssel im Schlüsselbund.\n'
             'Erst das Konto anlegen (elevenlabs.io, Starter), dann den API-Key ablegen:\n'
             '    security add-generic-password -s elevenlabs -a api -w\n'
             '(Der Befehl fragt den Key ab - so steht er nicht in der Shell-Historie.)')


def brauchbar():
    """The takes worth uploading, longest first - if a limit ever bites, the richest material wins."""
    try:
        with open(INDEX, encoding='utf-8') as f:
            takes = json.load(f)
    except (OSError, ValueError):
        sys.exit('Keine Aufnahmen in ' + INDEX)

    gut, raus = [], []
    for k, t in takes.items():
        pfad = os.path.join(STORE, t.get('datei') or '')
        erwartet = len(t.get('text') or '') / 13
        if not t.get('datei') or not os.path.isfile(pfad):
            raus.append((k, 'keine Datei'))
        elif t.get('pegel') is not None and t['pegel'] < MIN_PEGEL:
            raus.append((k, '%.0f dB - zu leise' % t['pegel']))
        elif erwartet and (t.get('sekunden') or 0) < erwartet * KURZ_ANTEIL:
            raus.append((k, '%.1f s - abgeschnitten' % (t.get('sekunden') or 0)))
        else:
            gut.append((k, pfad, t.get('sekunden') or 0))
    gut.sort(key=lambda x: -x[2])
    return gut, raus


def post_multipart(url, felder, dateien, api_key):
    """One multipart request without a third-party library - the machine that runs this has no
    pip environment to rely on (rule: toolchain installs are Doc's call)."""
    grenze = '----stimme' + uuid.uuid4().hex
    teile = []
    for name, wert in felder.items():
        teile.append(('--%s\r\nContent-Disposition: form-data; name="%s"\r\n\r\n%s\r\n'
                      % (grenze, name, wert)).encode('utf-8'))
    for name, pfad in dateien:
        typ = mimetypes.guess_type(pfad)[0] or 'application/octet-stream'
        with open(pfad, 'rb') as f:
            inhalt = f.read()
        teile.append(('--%s\r\nContent-Disposition: form-data; name="%s"; filename="%s"\r\n'
                      'Content-Type: %s\r\n\r\n' % (grenze, name, os.path.basename(pfad), typ)).encode('utf-8'))
        teile.append(inhalt)
        teile.append(b'\r\n')
    teile.append(('--%s--\r\n' % grenze).encode('utf-8'))
    body = b''.join(teile)

    req = urllib.request.Request(url, data=body, method='POST')
    req.add_header('Content-Type', 'multipart/form-data; boundary=' + grenze)
    req.add_header('xi-api-key', api_key)
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read())


def hochladen():
    gut, raus = brauchbar()
    if not gut:
        sys.exit('Keine brauchbare Aufnahme - erst in der Kabine aufnehmen (python3 tools/stimmklon.py).')

    dauer = sum(x[2] for x in gut)
    print('Lade %d Aufnahmen hoch (%.1f min):' % (len(gut), dauer / 60))
    for k, _, sek in gut:
        print('   %-14s %5.1f s' % (k, sek))
    if raus:
        print('Ausgelassen:')
        for k, warum in raus:
            print('   %-14s %s' % (k, warum))
    if dauer < 60:
        print('WARNUNG: unter einer Minute - der Klon wird dünn. Besser erst mehr aufnehmen.')

    antwort = post_multipart(
        API + '/voices/add',
        {'name': NAME, 'description': 'Doc Alvers, Mathe-Labor', 'remove_background_noise': 'true'},
        [('files', pfad) for _, pfad, _ in gut],
        key(),
    )
    vid = antwort.get('voice_id')
    if not vid:
        sys.exit('Keine voice_id zurückbekommen: ' + json.dumps(antwort)[:400])

    with open(VOICE, 'w', encoding='utf-8') as f:
        json.dump({'voice_id': vid, 'name': NAME, 'aus': [k for k, _, _ in gut],
                   'sekunden': round(dauer, 1)}, f, ensure_ascii=False, indent=1)
    print('\nFertig. voice_id: %s\n(gemerkt in %s - eine Kennung, kein Geheimnis)' % (vid, VOICE))
    print('Anhören:  python3 tools/stimme-hochladen.py --probe')
    return vid


def probe(text):
    try:
        with open(VOICE, encoding='utf-8') as f:
            vid = json.load(f)['voice_id']
    except (OSError, ValueError, KeyError):
        sys.exit('Noch keine Stimme - erst: python3 tools/stimme-hochladen.py')

    req = urllib.request.Request(
        API + '/text-to-speech/' + vid,
        data=json.dumps({'text': text, 'model_id': 'eleven_multilingual_v2'}).encode('utf-8'),
        method='POST',
    )
    req.add_header('Content-Type', 'application/json')
    req.add_header('xi-api-key', key())
    ziel = os.path.join(STORE, 'probe.mp3')
    with urllib.request.urlopen(req, timeout=120) as r, open(ziel, 'wb') as f:
        f.write(r.read())
    print('Gesprochen:', text)
    print('Datei     :', ziel)
    subprocess.run(['afplay', ziel])


if __name__ == '__main__':
    if '--probe' in sys.argv:
        n = sys.argv.index('--probe')
        satz = sys.argv[n + 1] if len(sys.argv) > n + 1 else 'Nicht verzagen, Doc Alvers fragen!'
        probe(satz)
    else:
        hochladen()
