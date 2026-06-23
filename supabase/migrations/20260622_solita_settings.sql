-- Cross-device Solita PREFERENCES (Doc 2026-06-22): the model/voice/lang choice used to live only in each
-- device's localStorage (per-origin), so a pick on the laptop never reached the Pixel. We now carry the prefs
-- in the SAME single shared row as the conversation, written ONLY through the password-gated solita-sync fn.
-- Additive + reversible: one new jsonb column, default '{}', no data touched. NEVER stores the password (only
-- ai_model / solita_tts / solita_gvoice / solita_voice / solita_wake / solita_lang).
alter table public.solita_history
  add column if not exists settings jsonb not null default '{}'::jsonb;
