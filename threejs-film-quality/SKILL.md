---
name: threejs-film-quality
description: "Use to raise the visual quality of a code-made Three.js animated film toward Pixar-style: target images, post-processing (N8AO, bloom, ACES), lighting and materials roadmap, and how to verify results."
---

# Three.js film quality (stylised storybook toward Pixar-style)

Related: `clay-film-pack`, `clay-film-rigs`, `clay-film-scenes`. Reference skills (CloudAI-X/threejs-skills, MIT, targets r186): threejs-lighting, -materials, -postprocessing, -shaders, -geometry, -performance.

## Workflow
1. Get TARGET images first (user storyboard or reference frames). Crop each beat into `references/targets/target_beat_N.png` and build a target-vs-current board; judge every change against it. User-supplied images stay out of public repos unless rights are confirmed.
2. Lighting/IBL/AO/bloom first (cheap, biggest gain), then materials, then fur/geometry, then animation.
3. Verify with stills only unless the user asks for video; view every image you rely on (viewer caches by path: use new filenames).

## Post-processing baseline setup (three r170; not yet shown to beat the plain render)
- Bundle once: `npm i three@0.170.0 postprocessing n8ao esbuild`; entry exports EffectComposer, RenderPass, EffectPass, BloomEffect, VignetteEffect, ToneMappingEffect, DepthOfFieldEffect, N8AOPostPass; `esbuild entry.js --bundle --format=esm --external:three --outfile=clay/vendor/fx.js`.
- Page needs an importmap: `"three":"./vendor/three.module.js"`, `"three/examples/jsm/":"./vendor/examples/jsm/"` (copy `postprocessing/Pass.js` and `environments/RoomEnvironment.js`).
- In boot: `renderer.toneMapping=NoToneMapping`; `scene.environment=PMREMGenerator.fromScene(new RoomEnvironment(),.04).texture`; `scene.environmentIntensity` about .35-.4 (1.0+ blows out whites); EffectComposer(multisampling 4) + RenderPass + N8AOPostPass + EffectPass(bloom, vignette, ToneMapping ACES). Render with composer instead of renderer.
- Headless Chrome: use `page.goto(..., wait_until='commit')` and wait for a READY flag. Normal page boot is about 15 s; a boot of minutes meant an infinite loop in actor code (`i<acc.count||6`), not module loading.
- Colour space trap: ShaderMaterial sky colours from `new Color('#hex')` are linear and written without encoding. The plain canvas shows them dark and saturated; the composer's output pass sRGB-encodes them, so the sky looks paler (the true hex colour). Re-pick sky colours for the composer path instead of treating the pale sky as a bug.
- `scene.environmentIntensity` 1.0 washes out; about .2 keeps key-light shading. RoomEnvironment fill lightens white wool and flattens shadows.
- Unresolved: the exterior still looks flatter than the plain render; bisect the pass chain (RenderPass + ToneMapping only, then add AO, bloom, DoF) and try AgX.

## Lessons
- Overexposure is the common failure: check pixel clipping and sky; CSS filters on the canvas stack with tone mapping.
- Delegated workers overclaim: one Blender prototype wrote an all-black PNG (mean 0.1) and still reported success with invented cost numbers; one FX pass reported "no clipped whites" on washed-out frames. Open the images and check pixel stats yourself; time a few frames after page load, not per page load.
- Blender (headless, `/opt/homebrew/bin/blender -b -P`) is a valid Tier B route but needs a working scene (lights, camera, geometry) and proof renders before any cost estimate.
- Procedural SDF + Three.js reaches a polished stylised look; hand-sculpted assets and offline path tracing are needed for true Pixar-level.
