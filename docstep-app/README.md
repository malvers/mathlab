# DocStep

Tells people apart by how they walk, with the phone in the trouser pocket (Doc's idea, 07.11.2026). Doc saw
it at ECML PKDD 2011 in Athens: Jordan Frank, Shie Mannor and Doina Precup (McGill) let a phone learn a
person from a short walk and then recognise the carrier.

- Demo paper: https://cs.mcgill.ca/~jfrank8/pubs/ecml11-demo.pdf
- Method: "Activity and Gait Recognition with Time-Delay Embeddings", AAAI 2010,
  https://www.cs.mcgill.ca/~jfrank8/pubs/aaai10-actrec.pdf (25 people, 100 % in their test)

Their code (HumanSense, 2012, MIT, C++ with OpenCV for the NDK) is too old to build as a library, so
`Gait.java` is a fresh plain-Java implementation of the published algorithm; GaitLib (Weka) would have
been a far heavier detour.

## Use

1. **Lernen**: type a name, 3 s to put the phone into the trouser pocket, a buzz, walk normally until the
   double buzz (30 s of real walking, at most 75 s). A name that exists gets one more walk (other shoes,
   other pocket); the best walk of a person counts.
2. **Erkennen**: the same with 12 s (at most 40 s). The circle shows the person and how sure, or
   "Unbekannt". The small line below has the raw score, the threshold and the runner-up, for tuning.
3. Long-press a person on the start screen to delete all their walks.

Standing still does not count: only stretches with a clear step rhythm go in, so the time it takes to put
the phone away or to stop does no harm. The pill shows the motion, yellow while waiting, green while
walking. The screen stays on but dark during a walk (Android gives the accelerometer only to the app in
front); cancel needs a long press, so the pocket cannot cancel by accident.

## How it works (`Gait.java`)

1. Accelerometer at about 100 Hz, box-averaged to a fixed 25 Hz (uneven timestamps do not matter).
2. Two channels that do not depend on how the phone sits in the pocket: acceleration along gravity
   (gravity = 1 s moving average), and the size of the rest.
3. Walking detector: 2.56 s windows, standard deviation of |a| at least 1 m/s² and an autocorrelation
   peak of at least 0.4 at 0.3–1.5 s (a step or a stride); runs under 4 s dropped, 0.5 s trimmed at each end.
4. Time-delay embedding (Takens) with m = 10, τ = 1 sample per channel (a point spans 0.36 s), PCA to
   p = 10 dimensions per learned walk = the template.
5. Geometric template matching: every small step of the new walk through that space is compared with the
   mean step of its K = 4 nearest template points, score u·v / max(|u|², |v|²), averaged: 1 = same way, same
   length. The best person wins; below the threshold 0.70 it is "Unbekannt". Confidence on the screen =
   logistic step around the threshold × softmax share between the learned people.

## Offline check (08.11.2026)

On the public WISDM v1.1 walking data (36 people, phone in the front trouser pocket, ~20 Hz, phones of
2010), throwaway Python outside the repo, same algorithm (Java and Python scores agree to 6 decimals):
learn from 30 s of one recording, recognise 12 s pieces of another recording of the same person.

| Setting | right person first of 36 | equal error rate |
|---|---|---|
| paper: magnitude, m 12, τ 2, p 6 | 69 % | 13 % |
| two channels, m 10, τ 1, p 10 (used) | 85.5 % | 7.0 % |

Households of four learned people, everybody else walking past, threshold 0.70: 81 % of the learned
people named correctly, 9 % of the strangers taken for one of them. The paper's 100 % for 25 people split a
single recording into learn and test parts, which is easier. The Pixel's sensor is much cleaner than
those of 2010, so the threshold is a first value: Doc's own walks decide.

Unit tests (synthetic walkers with their own rhythm, harmonics and noise, random pocket orientation each
walk): three learned people recognised in 18 of 18 walks (scores 0.91–0.95), a stranger "Unbekannt" in 6 of
6 (at most 0.42).

## Data protection

Gait is biometric data. No internet permission, the walks are files in the app's private folder
(`files/walks/*.walk`, the resampled recording, about 10–20 KB each), no backup, no device transfer.
Deleting a person deletes their files. Nothing of it belongs in the repo (`.gitignore`).

## Build

    docstep-app/build.sh          # gait tests (JUnit on the Mac), APK, install + start on the Pixel
    docstep-app/build.sh test     # only the tests

Installs over the cable or WLAN via `tools/pixel-serial.sh`, like DocNote and DocCall.

## First walks with it

1. Learn Doc twice (two "Lernen" with the same name, phone once each way round in the pocket), then
   "Erkennen" a few times: note the score in the small line. Then a second person.
2. Is Doc's own score clearly above 0.70 and the other person's below? If both sit high, the threshold
   goes up (`Gait.THRESHOLD`), if Doc lands under it, down.
3. Not yet: gyroscope (no public pocket data to check it against), stairs, running, other pockets.
