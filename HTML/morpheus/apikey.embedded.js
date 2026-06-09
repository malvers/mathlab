// NEUTRALISIERT 2026-06-09 (Rule 18 — repo is public).
//
// This file used to embed a Gemini API key (XOR+base64 obfuscation = effectively plaintext in a
// public repo). The leaked key was ROTATED in Google Cloud and is now dead. equationocr.html no
// longer needs a client-side key: it calls the "gemini" Edge Function
// (https://.../functions/v1/gemini), which injects the GEMINI_API_KEY *server-side* secret.
//
// Do NOT bake any key back in here. For local overrides, apikey.local.js (gitignored) may still set
// window.GEMINI_API_KEY, but production no longer uses it.
//
// (No key set on purpose.)
