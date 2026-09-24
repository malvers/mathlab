#!/usr/bin/env python3
"""Turns the recorded takes into a usable voice - at Google (Gemini) or at ElevenLabs.

    python3 tools/stimme-hochladen.py                  # Google if its key is there, else ElevenLabs
    python3 tools/stimme-hochladen.py --elevenlabs     # force ElevenLabs
    python3 tools/stimme-hochladen.py --probe          # let the finished voice say a sentence
    python3 tools/stimme-hochladen.py --probe "eigener Text"

Google's Voice Replication (announced 23.09.2026) wants exactly two files: 10-30 s of natural
speech, plus a consent recording of a fixed sentence. The booth records both anyway and writes
mono 24 kHz WAV, which is precisely the format Google asks for. ElevenLabs instead wants as many
takes as possible - so the two providers get fed differently, from the same material.

No API key EVER lives in this file (rule 18/21 - this repo is public). Keys come out of the
macOS keychain, the same way the DOCPAD password does:

    security add-generic-password -s gemini -a api -w        # Google AI Studio key
    security add-generic-password -s elevenlabs -a api -w    # ElevenLabs key

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
import urllib.error
import urllib.request
import uuid

STORE = os.path.expanduser('~/Movies/stimmklon')
INDEX = os.path.join(STORE, 'aufnahmen.json')
VOICE = os.path.join(STORE, 'stimme.json')
API = 'https://api.elevenlabs.io/v1'
GEMINI = 'https://generativelanguage.googleapis.com/v1beta'
GEMINI_MODELL = 'gemini-3.8-flash-tts'
# Flash-Lite costs 6 $ instead of 9 $ per million audio tokens and is, per Google, the one
# "optimised for reliable voice replication" - worth hearing side by side (--lite).
GEMINI_LITE = 'gemini-3.8-flash-lite-tts'
NAME = 'Doc Alvers'

# Google's window for the reference take. Shorter carries too little voice, longer is refused.
G_MIN, G_MAX = 10.0, 30.0

# Same thresholds the booth shows in the list - one definition of "unusable", not two.
MIN_PEGEL = -45.0     # dB mean; below this there is room noise and no voice
KURZ_ANTEIL = 0.55    # of the duration the text should take at ~13 characters a second


def key(dienst, pflicht=True):
    """A key from the keychain - never a default, never a command-line argument (that would land
    in the shell history). Missing key: say how to store it, or return None when only asking."""
    try:
        out = subprocess.run(['security', 'find-generic-password', '-s', dienst, '-a', 'api', '-w'],
                             capture_output=True, text=True, timeout=20)
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except Exception:
        pass
    if not pflicht:
        return None
    woher = ('aistudio.google.com -> Get API key' if dienst == 'gemini'
             else 'elevenlabs.io, Tarif Starter')
    sys.exit('Kein Schlüssel „%s" im Schlüsselbund.\n'
             'Erst dort einen holen (%s), dann ablegen:\n'
             '    security add-generic-password -s %s -a api -w\n'
             '(Der Befehl fragt den Key ab - so steht er nicht in der Shell-Historie.)'
             % (dienst, woher, dienst))


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


def zuschnitt(pfad, sek):
    """Google refuses a reference longer than 30 s. Cut a copy rather than the take itself -
    the long passages are worth keeping whole for ElevenLabs."""
    if sek <= G_MAX:
        return pfad
    ziel = os.path.join(STORE, 'referenz-30s.wav')
    subprocess.run(['ffmpeg', '-y', '-i', pfad, '-t', str(G_MAX), '-c', 'copy', ziel],
                   check=True, capture_output=True, timeout=60)
    print('   (auf %.0f s zugeschnitten -> %s)' % (G_MAX, os.path.basename(ziel)))
    return ziel


def gemini_hochladen():
    """Google Voice Replication: exactly one reference take plus the consent recording."""
    gut, raus = brauchbar()
    takes = {k: (pfad, sek) for k, pfad, sek in gut}

    einwilligung = takes.get('einwilligung')
    if not einwilligung:
        sys.exit('Die Einwilligung fehlt (oder taugt nicht). In der Kabine den ersten Eintrag\n'
                 'aufnehmen - Google verlangt genau diesen Satz, wortwörtlich.')

    # the longest take that is not the consent one, clipped into Google's 10-30 s window
    kandidaten = [(k, p_, s_) for k, (p_, s_) in takes.items() if k != 'einwilligung' and s_ >= G_MIN]
    if not kandidaten:
        sys.exit('Keine Aufnahme mit mindestens %.0f s. Google braucht 10-30 Sekunden\n'
                 'zusammenhängende, natürliche Sprache - am besten eine der langen Passagen.' % G_MIN)
    kandidaten.sort(key=lambda x: -x[2])
    quelle_id, quelle, quelle_sek = kandidaten[0]

    print('Google Voice Replication')
    print('   Referenz    : %-14s %5.1f s' % (quelle_id, quelle_sek))
    print('   Einwilligung: %-14s %5.1f s' % ('einwilligung', einwilligung[1]))
    quelle = zuschnitt(quelle, quelle_sek)

    def b64(pfad):
        import base64
        with open(pfad, 'rb') as f:
            return base64.b64encode(f.read()).decode('ascii')

    koerper = {
        'store': True,
        'voice': {
            'model': GEMINI_MODELL,
            'type': 'replicated',
            'display_name': NAME,
            'replicated': {
                'source_audio': {'mime_type': 'audio/wav', 'data': b64(quelle)},
                'consent_audio': {'mime_type': 'audio/wav', 'data': b64(einwilligung[0])},
            },
        },
    }
    req = urllib.request.Request(GEMINI + '/voices', data=json.dumps(koerper).encode('utf-8'), method='POST')
    req.add_header('Content-Type', 'application/json')
    req.add_header('x-goog-api-key', key('gemini'))
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            antwort = json.loads(r.read())
    except urllib.error.HTTPError as err:
        leib = err.read().decode('utf-8', 'replace')[:500]
        sys.exit('Google lehnt ab (HTTP %s):\n%s\n\n'
                 'Bei 403/PERMISSION_DENIED kann es die Region sein - Voice Replication ist im\n'
                 'EWR möglicherweise gesperrt. Dann bleibt ElevenLabs: --elevenlabs' % (err.code, leib))

    # Google answers with 'id' (voice_...); the others are there for older/other shapes
    vid = (antwort.get('id') or antwort.get('voice_id') or antwort.get('name')
           or (antwort.get('voice') or {}).get('id'))
    if not vid:
        sys.exit('Keine voice_id zurückbekommen: ' + json.dumps(antwort)[:400])
    with open(VOICE, 'w', encoding='utf-8') as f:
        json.dump({'anbieter': 'gemini', 'voice_id': vid, 'name': NAME,
                   'aus': [quelle_id, 'einwilligung'], 'modell': GEMINI_MODELL,
                   'laeuft_ab': antwort.get('expire_time', '')}, f, ensure_ascii=False, indent=1)
    print('\nFertig. voice_id: %s\n(gemerkt in %s)' % (vid, VOICE))
    print('Anhören:  python3 tools/stimme-hochladen.py --probe')
    return vid


def probe_ziel(text):
    """Every sample keeps its own file. The first one nearly died under the second
    (Doc, 24.09.2026: „diesn clip aufheben!") - a take that was just generated is exactly
    what one wants to play again, so nothing here ever overwrites."""
    ordner = os.path.join(STORE, 'proben')
    os.makedirs(ordner, exist_ok=True)
    nummern = [int(n[6:9]) for n in os.listdir(ordner)
               if n.startswith('probe-') and n[6:9].isdigit()]
    nr = max(nummern, default=0) + 1
    kurz = ''.join(c if c.isalnum() else '-' for c in text.lower()[:34]).strip('-')
    while '--' in kurz:
        kurz = kurz.replace('--', '-')
    pfad = os.path.join(ordner, 'probe-%03d-%s.wav' % (nr, kurz or 'probe'))
    with open(os.path.join(ordner, 'proben.txt'), 'a', encoding='utf-8') as f:
        f.write('%s  %s\n' % (os.path.basename(pfad), text))
    return pfad


def gemini_probe(text, vid, modell=None):
    koerper = {
        'model': modell or GEMINI_MODELL,
        'input': [{'type': 'user_input',
                   'content': [{'type': 'text', 'text': text,
                                'annotations': [{'type': 'speech_metadata',
                                                 'style': 'warm, lebendig, wie im Unterricht'}]}]}],
        'response_format': {'type': 'audio'},
        'generation_config': {'speech_config': [{'voice': vid}]},
    }
    req = urllib.request.Request(GEMINI + '/interactions', data=json.dumps(koerper).encode('utf-8'), method='POST')
    req.add_header('Content-Type', 'application/json')
    req.add_header('x-goog-api-key', key('gemini'))
    with urllib.request.urlopen(req, timeout=180) as r:
        antwort = json.loads(r.read())
    # the audio comes back base64 somewhere in the response - find it without guessing the shape
    import base64

    def finde_audio(o):
        if isinstance(o, dict):
            for schluessel in ('data', 'audio_data', 'inline_data'):
                wert = o.get(schluessel)
                if isinstance(wert, str) and len(wert) > 2000:
                    return wert
            for wert in o.values():
                t = finde_audio(wert)
                if t:
                    return t
        elif isinstance(o, list):
            for wert in o:
                t = finde_audio(wert)
                if t:
                    return t
        return None

    roh = finde_audio(antwort)
    if not roh:
        sys.exit('Kein Audio in der Antwort: ' + json.dumps(antwort)[:400])
    ziel = probe_ziel(text + (' lite' if (modell or '').endswith('lite-tts') else ''))
    with open(ziel, 'wb') as f:
        f.write(base64.b64decode(roh))
    print('Gesprochen:', text)
    print('Datei     :', ziel)
    subprocess.run(['afplay', ziel])


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
        key('elevenlabs'),
    )
    vid = antwort.get('voice_id')
    if not vid:
        sys.exit('Keine voice_id zurückbekommen: ' + json.dumps(antwort)[:400])

    with open(VOICE, 'w', encoding='utf-8') as f:
        json.dump({'anbieter': 'elevenlabs', 'voice_id': vid, 'name': NAME,
                   'aus': [k for k, _, _ in gut], 'sekunden': round(dauer, 1)}, f,
                  ensure_ascii=False, indent=1)
    print('\nFertig. voice_id: %s\n(gemerkt in %s - eine Kennung, kein Geheimnis)' % (vid, VOICE))
    print('Anhören:  python3 tools/stimme-hochladen.py --probe')
    return vid


def probe(text):
    try:
        with open(VOICE, encoding='utf-8') as f:
            gemerkt = json.load(f)
        vid = gemerkt['voice_id']
    except (OSError, ValueError, KeyError):
        sys.exit('Noch keine Stimme - erst: python3 tools/stimme-hochladen.py')

    if gemerkt.get('anbieter') == 'gemini':
        return gemini_probe(text, vid, GEMINI_LITE if '--lite' in sys.argv else None)

    req = urllib.request.Request(
        API + '/text-to-speech/' + vid,
        data=json.dumps({'text': text, 'model_id': 'eleven_multilingual_v2'}).encode('utf-8'),
        method='POST',
    )
    req.add_header('Content-Type', 'application/json')
    req.add_header('xi-api-key', key('elevenlabs'))
    ziel = probe_ziel(text).replace('.wav', '.mp3')
    with urllib.request.urlopen(req, timeout=120) as r, open(ziel, 'wb') as f:
        f.write(r.read())
    print('Gesprochen:', text)
    print('Datei     :', ziel)
    subprocess.run(['afplay', ziel])


if __name__ == '__main__':
    if '--probe' in sys.argv:
        n = sys.argv.index('--probe')
        satz = sys.argv[n + 1] if len(sys.argv) > n + 1 else 'Nicht verzagen, Doc Alvers fragen!'
        if satz == '--lite':
            satz = sys.argv[n + 2] if len(sys.argv) > n + 2 else 'Nicht verzagen, Doc Alvers fragen!'
        probe(satz)
    elif '--elevenlabs' in sys.argv:
        hochladen()
    elif key('gemini', pflicht=False):
        # Google first when its key is there: Doc already has the billing, and the booth's
        # WAVs are exactly the format it asks for.
        gemini_hochladen()
    else:
        print('Kein Gemini-Schlüssel im Schlüsselbund - nehme ElevenLabs.')
        print('(Google wäre der kürzere Weg: security add-generic-password -s gemini -a api -w)\n')
        hochladen()
