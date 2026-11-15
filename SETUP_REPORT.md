# ALTA setup report

The workspace was empty. Created a TypeScript/React Remotion project with npm; no pre-existing project files were modified or deleted. No paid API calls or AI generation were used.

## Packages

Remotion, CLI, transitions, motion-blur, three integration and Lottie are pinned to 4.0.539. Supporting packages: React/React DOM 19.2.0, Three.js 0.187.0, React Three Fiber 9.8.2, lottie-web 5.13.0, TypeScript 7.0.2 and React/Node/Three type declarations. Exact versions are in package.json and package-lock.json.

## Global agent skills

Installed official remotion-dev/skills with the requested global npx command. Codex uses the global ~/.agents/skills directory. Available on the next turn: remotion-best-practices, remotion-captions, remotion-create, remotion-docs, remotion-interactivity, remotion-maps, remotion-markup, remotion-multimedia, remotion-render, remotion-saas, remotion-studio, remotion-upgrade. Other agent targets were also selected by the upstream installer; PromptScript does not support global installation and reported failures. Codex installation succeeded.

## Validation

- Clean npm ci: passed.
- TypeScript: passed.
- Studio: running at http://localhost:3000/AltaTest, visually checked at frame 60.
- FFmpeg and FFprobe 9.0.2: already installed, executable and used successfully.
- AltaTest: rendered H.264 MP4, 1080×1920, 30 FPS, 120 frames, four seconds; representative frame inspected.
- IntegrationCheck: rendered ThreeCanvas mesh, local Lottie fixture and @remotion/motion-blur Trail.
- AltaPromo: entire eight-scene starter rendered at half resolution; fade, custom zoom and blur transitions exercised.
- Landscape and square starters: rendered at half resolution; feature-scene layouts inspected.
- Reference analyzer: extracted metadata, frames, cut candidates and review worksheet from test MP4.
- Media preparation: two source seconds at 1.25× produced a 1.6-second MP4.
- Supplied GLB loader: TypeScript checked; a real phone model and real ALTA assets were absent, so asset-specific appearance remains unverified.

## Outputs

- renders/alta-test.mp4 — required full-resolution test
- renders/alta-test-preview.png — frame at two seconds
- renders/integration-check.mp4 — optional-package smoke test
- renders/alta-promo.mp4 — half-resolution starter preview
- renders/alta-landscape.mp4 and renders/alta-square.mp4 — half-resolution responsive previews
- renders/reference-test/ — analyzer output

## Compatibility notes

Missing lottie-web peer dependency was resolved by explicitly installing 5.13.0. Remotion requires Zod 4.5.4; npm audit reports GHSA-mrhx-c7xc-m3w5 through this dependency (ten affected package entries). A patched Zod triggered Remotion's compatibility warning, so the required version was retained without an override. Update aligned Remotion packages when upstream supports patched Zod. Three integration emits a non-blocking upstream Clock deprecation. No setup/render blocker remains. Final creative work requires supplied ALTA assets and references.

## Next commands

```sh
npm run video
npm run render:test
npm run render:alta
npm run render:landscape
npm run render:square
npm run analyze:reference -- public/assets/references/reference-01.mp4
```

See README.md for asset placement, props, reusable components, device support, audio and timing.

## Created source/configuration files

- .gitignore
- AGENTS.md
- README.md
- package-lock.json
- package.json
- public/assets/audio/.gitkeep
- public/assets/brand/.gitkeep
- public/assets/devices/.gitkeep
- public/assets/images/.gitkeep
- public/assets/references/.gitkeep
- public/assets/screenshots/.gitkeep
- public/assets/videos/.gitkeep
- remotion.config.ts
- scripts/analyze-reference.mjs
- scripts/media.mjs
- src/index.ts
- src/video/Root.tsx
- src/video/components/AppDemo.tsx
- src/video/components/AudioTrack.tsx
- src/video/components/Brand.tsx
- src/video/components/Media.tsx
- src/video/compositions/AltaPromo.tsx
- src/video/compositions/AltaTest.tsx
- src/video/compositions/IntegrationCheck.tsx
- src/video/devices/Device3D.tsx
- src/video/devices/PhoneMockup.tsx
- src/video/effects/LottieAsset.tsx
- src/video/effects/Motion.tsx
- src/video/scenes/PromoScene.tsx
- src/video/theme.ts
- src/video/timeline.ts
- src/video/transitions/index.tsx
- src/video/typography/TextReveal.tsx
- src/video/utils/layout.ts
- tsconfig.json
- SETUP_REPORT.md

Asset directories under public/assets and renders/.gitkeep were also created.
