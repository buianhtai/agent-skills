---
name: clay-film-scenes
description: "Use for clay film scenes, world environments, cameras, ground litter and shot timing (world.js, film.js)."
---

# Clay film scenes and shots

Pack: `~/Downloads/Coc_Kien_Troi_2_5D_Full_Codex_Pack`.

## Files
- `clay/full/world.js`: `createWorld(canvas)`; environments `drought, journey, gate, palace, rain, review` from the `moods` table (sky top/bottom, ground, key, fill); groups `dry, green, journey, gate, palace, rain, wet` toggled in `setEnvironment(name,t)`.
- `clay/full/film.js`: SHOTS (timings), cameras, `closeCamera(states,kind,distance,height,angle)` used by seven close-ups; palace shots use a fixed high camera to avoid the courtyard wall.
- Shot timings: frog-worry 3.4-7; frog-address 19.05-22.1; resolve-reaction 22.1-25; gate-wide 35-39; gate-approach 39-42; gate-resolve 42-44; palace-establish 44-44.8; frog-petition 44.8-47.6; first-rain 52.15-53.5.

## Ground and litter
- Floor is a vertex-coloured 120x120 plane (patchy tone). Path has soft verge layers.
- `litter(parents,geo,mat,count,k,place)` makes InstancedMesh per parent group. Parent determines which scene shows it (`journey/green` vs `dry`).
- Grass blades: `leafGeo` with `leafMats` (DoubleSide); spawn at |x| >= ~2.4 so blades miss the acting lane.

## Adding a scene
Add a `moods` row and group, set visibility in `setEnvironment`, add a SHOT in `film.js` matching the story timing; validators expect 7 scenes and 60.000s.

## Verify
Pull stills from the final movie with `clay-film-pack/scripts/verify_stills.sh` (drought ~8s, journey ~28s, rain ~56s). Check each environment you edited, not only one.
