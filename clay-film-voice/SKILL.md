---
name: clay-film-voice
description: "Use for VoiceStudio Vietnamese voiceover in the clay film pack: voice_cast, WAV lines, mouth cues, lipsync checks."
---

# Clay film voice (VoiceStudio, local)

Pack: `~/Downloads/Coc_Kien_Troi_2_5D_Full_Codex_Pack`.

## Rules
- VoiceStudio (`http://127.0.0.1:3900`) for spoken voice only. No cloning real people, no model downloads without consent, no OpenAI-alias voices as final cast.
- If VoiceStudio is down, do not generate fallback TTS; only a clearly named instrumental preview is allowed.
- Native-speaker listening is a human step; never tick that QA item yourself.

## Files
- `story/voice_cast.json`: engine `omnivoice`, language `vi`, profiles narrator/frog/emperor with `voice_id` (verify against `GET /profiles`; do not assume it is empty, check the file).
- `audio/voicestudio/manifest.json` (per-line id, role, voice_id, sha256, start/end, slot fit), `lines/<id>_<role>.wav`, `mouth_cues.json` (word-timed visemes + `wav_sha256`), `profile_provenance.json`, QA json files.
- `scripts/voicestudio_tts.py`: `--probe` (health + voices), `--check` (offline manifest/timing), `--render` (all lines to WAV). Make targets: `voice-check`, `voice`.

## Workflow
1. `.venv/bin/python scripts/voicestudio_tts.py --probe` then `--check` (10 lines, all slots within 60.000s).
2. Edit `voice_cast.json` voice ids / direction; `--render`; regenerate `mouth_cues.json` so `wav_sha256` matches (render.py asserts "Stale mouth cues" otherwise).
3. Re-render the film; mouths open only during frog and emperor lines.
4. Report truthfully: word-timed mouth poses are not forced phoneme alignment.
