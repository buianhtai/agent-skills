# agent-skills
Reusable agent skills. Each skill is a flat folder at the repo root containing a `SKILL.md`, so cloning this repo into a skills directory exposes every skill.

## Clay film (code-made Three.js 2.5D animation)
Reference project: https://github.com/buianhtai/coc-kien-troi

| Skill | Use when |
|---|---|
| [`clay-film-pack`](clay-film-pack/SKILL.md) | Running the whole pipeline: render, proof/pilot, validators, stills, master promotion. Bundles scripts, fur sample, references, eval checklist. |
| [`clay-film-rigs`](clay-film-rigs/SKILL.md) | Sculpting or detailing actors: SDF sculpt, rig contract, fur strands, mouth and eye rigs. |
| [`clay-film-scenes`](clay-film-scenes/SKILL.md) | Environments, cameras, shot timing, ground litter in `world.js` / `film.js`. |
| [`threejs-film-quality`](threejs-film-quality/SKILL.md) | Raising a Three.js film toward Pixar-style: target images, post-processing pipeline (N8AO, bloom, ACES), lighting/material roadmap, verification lessons. |
| [`clay-film-voice`](clay-film-voice/SKILL.md) | VoiceStudio Vietnamese voiceover, voice cast, WAV lines, mouth cues. |

## Install
Copy or symlink the skill folders you want into your agent's skills directory (for example `~/.claude/skills/`).

## Adding skills
Keep new skill folders flat at the root, prefix related ones (`<domain>-<name>`), and add a row to the table above.
