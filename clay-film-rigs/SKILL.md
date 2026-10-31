---
name: clay-film-rigs
description: "Use for sculpting or detailing Three.js clay actors (SDF sculpt, rigs, fur strands, mouth/eye rigs) in the clay film pack."
---

# Clay film rigs (Three.js SDF sculpt)

Pack: `~/Downloads/Coc_Kien_Troi_2_5D_Full_Codex_Pack`. Actors: frog, tiger, bear, crab, bee, emperor in `clay/actors/`. Reusable fur helper sample: `clay-film-pack/samples/detail.js`.

## Contract
`createX()` returns `{actor, body, head, pose}`; `pose({t,walk,emotion,open,viseme,gesture,blink,gazeX,gazeY})`. Keep deterministic (seeded RNG, no Math.random).

## Helpers (`clay/sculpt.js`)
`mesh, sphere, group, cord, colored(mat), clayMaterial(color,rough), lumps, polish, sculpt(field,min,max,res,paint)`, SDF `ell/union/subtract`. Eyes: `clay/eyes.js` `createEye`. Mouth: `clay/mouth-rig.js` `createMouthRig`.

## Fur / detail
`tufts(parent,mat,{center,radii,count,seed,length,radius,select,field})` in `clay/actors/detail.js`: instanced bent strands (5 rings x 4 sides) with root-to-tip gradient tinted by `mat.color`. `select(x,y,z)` receives the unit direction. Pass the sculpt SDF as `field` so strands root on the real skin; exclude the muzzle front so strands do not poke through lips.

## Pitfalls
- Per-vertex posing: `computeVertexNormals()` after moving vertices; when rebuilding topology `deleteAttribute('normal')` first.
- `colored(mat)` = white + vertexColors: bake base colour into vertex colours.
- Body fur goes in a group that copies `bob` and `torso.rotation.x` in `pose()`.
- Check model sheets at `clay/full/proof/<actor>-model.png` (three views) and close-up shots; group shots hide detail.
- Regression test: `node --test scripts/check_clay_geometry.mjs` (every drawn vertex has a normal, indices in range).

## New actor
Copy the closest rig (quadruped: tiger/bear; biped: emperor), keep `pose()`, add eye + mouth rig, 3-view sheet + six expressions, update `docs/ACTOR_BIBLE.md`.
