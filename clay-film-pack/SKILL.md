---
name: clay-film-pack
description: "Use when building or upgrading a code-made Three.js 2.5D clay animated film (rigged actors, scenes, Vietnamese voice, 60s deterministic render) like Coc_Kien_Troi_2_5D_Full_Codex_Pack."
---

# Clay film pack workflow (Three.js, deterministic, local-only)

Reference project: `~/Downloads/Coc_Kien_Troi_2_5D_Full_Codex_Pack` (published at https://github.com/buianhtai/coc-kien-troi) (not a git repo). Read `CODEX_TASK.md`, `AGENTS.md`, `docs/ACTOR_BIBLE.md`, `docs/VISUAL_STYLE_2_5D.md` first; they are the authority. Current gaps live in the pack's `docs/OPEN_ITEMS.md`.

## Bundled resources (in this skill's folder)
- `scripts/render_all.sh <pack_root> [--full]`: geometry test, proof+pilot, optional full render, validators.
- `scripts/verify_stills.sh <movie.mp4> [out_dir]`: stills at 3/8/14.5/22/28.2/44.4/52.8/56.5s plus ffprobe and SHA256.
- Pack's own `scripts/check_clay_geometry.mjs`: regression test run by `render_all.sh` (every drawn vertex has a normal; indices in range).
- `samples/detail.js`: the `tufts()` fur helper; `samples/fur_usage.md`: call examples.
- `references/pack_files.md`: file map, shot timings, outputs.
- `eval/checklist.md`: pass criteria before reporting done.

## Hard constraints
- Free and local only: no paid services, AI video APIs, cloud. Original vector/code assets only.
- Keep story, 60s timeline, dialogue and timing unchanged when upgrading visuals.
- Never edit `validate*.py` or `docs/QA_CHECKLIST.md` to make checks pass.
- Never overwrite the validated master `output/<name>_CLAY.mp4` without user approval; `render.py --render` writes `clay/full/movie.mp4`. Copy over only on request, after backing up.
- Voice: VoiceStudio is spoken voice only; no cloning real voices; no model downloads without consent. In the reference pack `voice_cast.json` already has real voice ids and the WAVs are VoiceStudio output; do not re-run `--render` (it breaks `mouth_cues.json` hashes and recorded speech QA). Related skill: `code-animated-film` covers the SVG/Lemo-Opuscar page contract; this skill is the Three.js clay pipeline.
- `/Opuscar_Theater_Pack` is a separate project; leave it untouched.

## Layout
- `clay/actors/<name>.js`: one articulated rig per actor; returns `{actor, body, head, pose}`; `pose({t,walk,emotion,open,viseme,gesture,blink,gazeX,gazeY})`.
- `clay/sculpt.js`: `mesh, sphere, group, cord, colored(mat), clayMaterial(color,rough), lumps, polish, sculpt(field,min,max,res,paint)`, SDF `ell/union/subtract`.
- `clay/mouth-rig.js`, `clay/eyes.js`, `clay/actors/detail.js` (`tufts`; `select` gets the unit direction; `field` is the SDF, negative inside).
- `clay/full/film.js` (SHOTS, `closeCamera`), `clay/full/world.js` (environments `drought/journey/gate/palace/rain/review`, toggled in `setEnvironment`), `clay/full/render.py`, `clay/full/review.html`.
- `story/voice_cast.json`, `scripts/voicestudio_tts.py`, `audio/voicestudio/`.

## Upgrade loop
1. Edit. 2. Geometry test. 3. `--proof --pilot` (~4 min, run as background job). 4. View `proof/*-model.png` and shots at native size (sheets show each actor alone). 5. Validators. 6. `--render` (~8 min), then `verify_stills.sh` on `movie.mp4` and view them.

## Rules learned
- After moving vertices call `computeVertexNormals()`; if topology is rebuilt, `deleteAttribute('normal')` first (stale normals broke the bee head).
- `colored(mat)` sets colour white and vertexColors: bake the base colour into vertex colours or fur turns grey.
- Detail on a posed body goes in a group that copies `bob` and `torso.rotation.x` in `pose()`.
- Root tufts with the sculpt `field`, not an approximate ellipsoid; keep them off the muzzle/mouth.
- Upright grass needs DoubleSide (`leafMats`); keep spawn at |x| >= ~2.6 so blades miss feet.
- Litter is parented per environment group (`journey/green`, `dry`); check each scene you changed.
- Keep instanced strands light (5 rings x 4 sides, shared geometry).
- Judge at close-up and group scale; cone fur looked fine at 6s, spiky at 14.5s.
- Do not `pkill -f serve.cjs`: it kills user-supervised services. Start a new named service (`CLAY_HOST=<ipconfig getifaddr en0> CLAY_PORT=8771 node clay/serve.cjs`).
- Playwright `networkidle` timeout on `page.goto` happened twice; cause unconfirmed (it passed on retry). Retry once, then capture `pageerror`/console using render.py's own Chrome launch (`executable_path` + `headless=True`), not a different browser config.
- Edit tool: re-read for the current tag after each edit; declare variables before use.

## Adding an actor / scene / film
- Actor: copy the closest rig (quadruped tiger/bear, biped emperor), keep the `pose()` contract, add eye and mouth rig, make 3-view sheet and 6 expressions, update `docs/ACTOR_BIBLE.md`.
- Scene: add a `moods` row and a group in `world.js`, then a SHOT in `film.js` matching the story JSON timing.
- Voice: fill `voice_id` in `story/voice_cast.json`, run `scripts/voicestudio_tts.py` with VoiceStudio at `http://127.0.0.1:3900`, regenerate `mouth_cues.json`, re-render.
