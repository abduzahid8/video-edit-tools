# ALTA Motion Design Studio

A deterministic TypeScript + React + Remotion workspace for premium product motion. No real ALTA assets were present at setup: the promo is an eight-scene **starter**, and the four-second test is a black-screen typography/device study. No AI services or paid API credits are used.

## Start and render

Requires Node 22+ and npm. FFmpeg/FFprobe must be on PATH (already installed on this machine).

```sh
npm ci
npm run video
npm run typecheck
npm run render:test
npm run render:alta
npm run render:landscape
npm run render:square
npm run render:check
```

Studio prints its local URL (normally http://localhost:3000). Renders go to `renders/`, which is ignored by Git. Remotion downloads its headless browser on first render. `AltaTest` is 1080×1920, 30 FPS, four seconds. `IntegrationCheck` exercises Three.js, local Lottie, and motion trails. Promo compositions are 9:16 (1080×1920), 16:9 (1920×1080), and 1:1 (1080×1080), with responsive placement and type sizes rather than export crops.

## Assets

Paths passed to components are relative to `public/`; use e.g. `assets/screenshots/wardrobe.png`.

| Folder | Content |
| --- | --- |
| `public/assets/brand/` | Supplied logos and brand fonts |
| `public/assets/screenshots/` | Exact ALTA screenshots |
| `public/assets/videos/` | Real MP4, MOV, WebM screen recordings |
| `public/assets/audio/` | Licensed/provided music, UI sounds, whooshes, impacts |
| `public/assets/references/` | Motion reference videos |
| `public/assets/devices/` | Transparent device frames and supplied GLB models/textures |
| `public/assets/images/` | Other approved imagery |

MOV/WebM are accepted as source assets; browser codec support varies. Convert unsupported recordings to H.264 MP4 before previewing/rendering. No assets or music are downloaded automatically.

## Authoring

- `src/video/theme.ts`: central palette, font stack, surfaces, shadow, motion defaults. Default system typography is provisional; supply a licensed brand font for final work.
- `src/video/timeline.ts`: scene durations in **seconds**, FPS, transition overlap and optional audio beat timestamps. To shorten scene 3 by one second, change `appOverview: 3` to `appOverview: 2`. Total duration updates automatically. Transitions overlap adjacent scenes by 0.3 seconds.
- `src/video/Root.tsx`: test, promo format registrations and diagnostics.
- `src/video/compositions/AltaPromo.tsx`: scene arrangement, transition choices, music/SFX.
- `src/video/scenes/PromoScene.tsx`: placeholder story and responsive layouts.

The eight scenes are intro, device reveal, UI zoom, feature one, app interaction, product demo, feature two, and CTA. Replace copy and supply assets before treating this as a commercial.

Reusable exports include `PhoneMockup`/`DeviceReveal`, `PhoneScreen`, `Device3D`, `LogoReveal`, `TextReveal`, `KineticText`, `FeatureCard`, `UIScreen`, `ScreenRecording`/`VideoFrame`, `ImageFrame`, `AppDemo`, `GradientBackground`, `BackgroundGlow`, `ParallaxLayer`, `MaskReveal`, `MotionTrail`, `ZoomTransition`, `BlurTransition`, `CTA`, `AudioTrack`, and `LottieAsset`.

Phone props support scale, X/Y placement, rotation, perspective, Y rotation, entrance/exit timing, float, camera zoom, and shadows. Supply `frameSrc` and percentage `screenInset` to match a real transparent frame. The neutral code frame is provisional. `Device3D` loads a supplied GLB with authored real screen textures; normalize its origin/scale and tune lighting for that asset. No invented phone model is used.

`UIScreen` supports crop-by-overflow and `zoom`/`origin` targeting. `ScreenRecording` supports trim seconds, playback rate, mute, and custom styles; trim values convert using composition FPS. `AppDemo` supports continuous device-to-fullscreen or reverse movement with one real screen layer, using a neutral frame. Match supplied device aperture geometry when customizing it. `MotionTrail` is an opt-in sampled motion trail for fast elements; keep text crisp and avoid applying it globally.

Example source edit:

```tsx
<PhoneMockup
  screenshot="assets/screenshots/wardrobe.png"
  frameSrc="assets/devices/phone-frame.png"
  screenInset={{top: 3, right: 5, bottom: 3, left: 5}}
  rotation={-4}
  height={1000}
/>
<ScreenRecording src="assets/videos/demo.mp4"
  trimBeforeSeconds={2} trimAfterSeconds={8} playbackRate={1.25}/>
```

Pass composition-wide assets with Remotion props:

```json
{
  "logo": "assets/brand/alta.png",
  "screens": {
    "phoneReveal": {"screenshot": "assets/screenshots/wardrobe.png"},
    "appOverview": {"screenshot": "assets/screenshots/wardrobe.png"},
    "productDemo": {"recording": {"src": "assets/videos/demo.mp4", "trimBeforeSeconds": 1}}
  },
  "music": {"src": "assets/audio/music.mp3", "volume": 0.3, "fadeSeconds": 0.8},
  "sounds": [{"src": "assets/audio/whoosh.wav", "atSeconds": 2, "durationSeconds": 1}]
}
```

Save as `alta.props.json`, then run `npm run render:alta -- --props=alta.props.json`. Missing UI is labeled, not fabricated. AudioTrack supports start, trim, duration, gain and fades. Record measured music beats in `audioBeats` and align scene seconds to those beats once a track is supplied. Lottie accepts provided JSON data and is not required in normal scenes.

## Reference analysis and media tools

```sh
npm run analyze:reference -- public/assets/references/reference-01.mp4
npm run analyze:reference -- path/to/reference.mov renders/reference-review 1
npm run media:prepare -- input.mov output.mp4 2 6 1.25
```

The analyzer uses FFprobe for duration, encoded/display dimensions, FPS, rotation and aspect ratio. FFmpeg extracts up to 120 representative frames and approximate scene-cut timestamps. Output includes `metadata.json`, `summary.json`, JPEGs, `cuts.json`, and an `analysis.md` worksheet. Output directories must be new to avoid stale frames or overwrite. The worksheet is deliberately unfinished: Codex must inspect frames and watch the source to assess typography, movement, zooms, negative space, composition, scene timing, pacing and text timing. Cut detection is heuristic. Use ALTA assets to recreate motion language, without copying another brand’s identity.

`media:prepare` trims, changes speed (including audio tempo), normalizes even dimensions and encodes browser-compatible MP4 with FFmpeg. It refuses to overwrite output. For exact cropping, add a target-specific FFmpeg crop filter or use UIScreen's masked viewport.

## Agent workflow

Official Remotion skills are installed globally for Codex and become available on the next turn. Continue modifying this project for future briefs. Use frame-driven animation, native Remotion primitives, and real UI. Use 3D only when helpful. No Higgsfield or separately billed image API without explicit authorization. No GUI editor is required.

## Setup validation and known limitations

FFmpeg/FFprobe 9.0.2 were already present; they were not reinstalled. All Remotion packages are pinned to 4.0.539. TypeScript, Studio, the full-resolution four-second test, a Three.js/Lottie/motion-trail diagnostic, and half-resolution vertical, landscape, and square promo renders were checked locally. The analyzer was exercised against the test MP4. Supplied-device GLB loading and real UI/audio assets cannot be visually validated until those assets exist.

Remotion 4.0.539 requires Zod 4.5.4. npm audit reports GHSA-mrhx-c7xc-m3w5 (collection-validation memory exhaustion) through that dependency, counted across ten affected packages. Zod 4.6.7 removes the advisory but triggers Remotion's version mismatch warning, so the supported dependency was retained. Do not force an incompatible override; update the aligned Remotion packages when upstream supports the patched Zod. Three.js also emits a non-blocking Clock deprecation from its integration. The skills installer reported unsupported PromptScript global installation, while all twelve official skills installed for Codex in `~/.agents/skills/`.
