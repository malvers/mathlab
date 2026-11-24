// A number that ends a sentence is spoken as a number, not an ordinal (Doc, 24.11.2026: "dass Solita nicht beim
// Satzende, wo 20 steht, und ein Punkt, als Satz immer 20. [liest]"). The rule is satzendZahlen in
// HTML/js/solita-karaoke.js; Node reaches it through videopipeline/lib/tts.mjs, as the call hook and the deck clips do.
//
//     node --test tools/solita-satzende-zahlen.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { satzendZahlen } from '../videopipeline/lib/tts.mjs';

const same = t => assert.equal(satzendZahlen(t), t);

test('a number before the sentence dot becomes a word', () => {
    assert.equal(satzendZahlen('Lies bitte Seite 20. Danach geht es weiter.'), 'Lies bitte Seite zwanzig. Danach geht es weiter.');
    assert.equal(satzendZahlen('Die Pause dauert 20.'), 'Die Pause dauert zwanzig.');
    assert.equal(satzendZahlen('Die Note ist eine 2.'), 'Die Note ist eine zwei.');
    assert.equal(satzendZahlen('Note 2. 3 Schüler fehlten.'), 'Note zwei. 3 Schüler fehlten.');
    assert.equal(satzendZahlen('Wir sind auf Seite 21.\nDanach kommt der Test.'), 'Wir sind auf Seite einundzwanzig.\nDanach kommt der Test.');
    assert.equal(satzendZahlen('Zählt von 0 bis 9.'), 'Zählt von 0 bis neun.');
    assert.equal(satzendZahlen('Es gilt x < 5. Danach'), 'Es gilt x < fünf. Danach');
});

test('thousands and years', () => {
    assert.equal(satzendZahlen('Das kostet 1.000.'), 'Das kostet eintausend.');
    assert.equal(satzendZahlen('Es kamen 20.000.'), 'Es kamen zwanzigtausend.');
    assert.equal(satzendZahlen('Doc ist von 1963.'), 'Doc ist von neunzehnhundertdreiundsechzig.');
    assert.equal(satzendZahlen('Stand Oktober 2026.'), 'Stand Oktober zweitausendsechsundzwanzig.');
    same('Das sind 1234567.');                         // too long for a word: left as written
});

test('dates, times, outlines, decimals, percent and true ordinals stay', () => {
    same('Treffpunkt am 24.11.');
    same('Abgabe am 1.12.2026.');
    same('Wir treffen uns um 20 Uhr.');
    same('Wir treffen uns um 15:30.');
    same('Siehe Abschnitt 3.2.');
    same('Der Wert ist 3,5.');
    same('Das sind 20 %.');
    same('Das sind 20%.');
    same('Papier im Format A4.');
    same('Wir sehen uns am 20. November.');
    same('Wir sehen uns am 20.');                        // "am zwanzigsten" is right here
    same('Der 3. und der 4. Platz gehen leer aus.');
    same('Klasse 9/10.');
});

test('an article before it, but a new sentence behind: still a number', () => {
    assert.equal(satzendZahlen('Richtig ist die 1. Es stimmt!'), 'Richtig ist die eins. Es stimmt!');
});

test('SSML: a tag after the dot ends the sentence, tags themselves stay', () => {
    assert.equal(satzendZahlen('<speak>Seite 20.</speak>'), '<speak>Seite zwanzig.</speak>');
    assert.equal(satzendZahlen('<speak>Seite 20.<break time="1s"/> Danach</speak>'), '<speak>Seite zwanzig.<break time="1s"/> Danach</speak>');
    assert.equal(satzendZahlen('<speak>Am <emphasis>20.</emphasis> November</speak>'), '<speak>Am <emphasis>20.</emphasis> November</speak>');
    same('<speak><mark name="a 20. b"/>Hallo</speak>');
});

test('the browser path (sprechbar) uses the same rule', () => {
    const win = {};
    new Function('window', readFileSync(new URL('../HTML/js/solita-karaoke.js', import.meta.url), 'utf8'))(win);
    assert.equal(win.SolitaKaraoke.sprechbar('Es gibt höchstens eine 1.'), 'Es gibt höchstens eine eins.');
    assert.equal(win.SolitaKaraoke.sprechbar('Wir treffen uns um 15:30.'), 'Wir treffen uns um 15:30.');
});
