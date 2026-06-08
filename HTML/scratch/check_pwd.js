// (sanitized 2026-06-08) This scratch one-liner used to be `console.log(btoa('<password>'))`,
// i.e. it printed the base64 of a HARD-CODED password — a Rule-18 secret leak in this PUBLIC repo
// (audit finding S4, was on line 1). Doc rotated that password on 2026-06-08; the literal is
// removed here. The base64 of it was NOT embedded as a gate anywhere else (verified). NOTE: the
// old value still lives in git history — only the rotation (done), not this edit, neutralizes it.
// This file is a leftover generator and is safe to delete (ask first — Rule 2).
