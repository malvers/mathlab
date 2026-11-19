#!/bin/sh
# Silent test samples for DocFit's voice commands (no loudspeaker, only files): six German macOS voices say the two
# commands "DocFit Start" / "DocFit Stopp", single words, look-alikes and talk into samples/NNN.wav (16 kHz mono) with
# samples/index.txt (NNN|voice|phrase).
# Then:  python3 -m venv venv && ./venv/bin/pip install vosk && ./venv/bin/python test_app_rule.py
# (the model is the one ../build.sh fetched into ~/Library/Caches/docfit/).
# 16.11.2026 (plain "DocFit" / "Stopp"): 70 of 78 right, "Ich bin heute fit" started. 19.11.2026 (two-part commands,
# loudness check): "DocFit Start" 24/24, "DocFit Stopp" 22/24, false commands 0 of 138.
cd "$(dirname "$0")"
mkdir -p samples
: > samples/index.txt
i=0
for v in "Anna" "Eddy (German (Germany))" "Reed (German (Germany))" "Rocko (German (Germany))" "Grandpa (German (Germany))" "Flo (German (Germany))"; do
    for p in "DocFit Start" "Doc Fit Start" "DocFit, Start" "Dock fit start" "DocFit Stopp" "Doc Fit Stopp" "DocFit, Stopp" "DocFit Stop" \
             "DocFit" "Doc Fit" "Stopp" "Stop" "Stopp mal" "Stopp bitte" "Start" "Der Start war gut" "Ich bin heute fit" \
             "Fitness ist wichtig" "Der Doktor kommt" "Ein Topf Suppe" "Dokument" "Guten Morgen" "Das ist doch fit" \
             "Doch, fit bin ich schon" "Bleib fit und gesund" "Wir starten gleich" "Das ist doch stark" \
             "Gestern war ich beim Doktor, und er sagte, ich sei doch fit genug für den Sport. Also bin ich ins Fitnessstudio gegangen." \
             "Und jetzt das Wetter. Morgen wird es sonnig. Bleiben Sie fit und gesund, Ihr Team vom Morgenmagazin." \
             "Halt, Stopp, das ist doch nicht fit, sagte der Trainer, und dann ging es weiter mit dem Start." \
             "Ich bin heute richtig fit. Doch fit starten allein reicht nicht, man muss auch schlafen."; do
        i=$((i + 1)); n=$(printf "%03d" $i)
        say -v "$v" -o samples/$n.aiff "$p" && afconvert -f WAVE -d LEI16@16000 -c 1 samples/$n.aiff samples/$n.wav \
            && echo "$n|${v%% *}|$p" >> samples/index.txt
    done
done
echo "$(wc -l < samples/index.txt) Proben in samples/"
