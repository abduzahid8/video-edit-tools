# ALTA motion design environment

When interacting with Cloudflare, use the cf CLI unless the project has a Wrangler configuration file.

- Modify this existing Remotion project; do not rebuild it for each brief.
- Use deterministic Remotion/React/Three.js/FFmpeg motion by default. No paid AI API calls, API keys, Higgsfield credits, music downloads, or GUI editors without explicit user direction.
- Read the installed official Remotion skills when working on compositions.
- Keep all `remotion` / `@remotion/*` versions identical. npm and package-lock.json are the project package manager and lockfile.
- Keep brand styling in src/video/theme.ts and scene seconds in src/video/timeline.ts. Derive frame counts from composition FPS.
- Use real supplied ALTA logo/UI/screenshots/recordings. Missing media stays visibly labeled; never invent fake product UI. The AltaTest black screen is an intentional typography study.
- Analyze references with scripts/analyze-reference.mjs, inspect the extracted frames and original, then document timing and movement observations. Adapt motion language to ALTA; do not copy other identities.
- Use regular React for UI. Use Device3D only with a supplied model and real screen materials; all animation must be frame driven, never useFrame or CSS animation.
- Preserve existing functionality and user edits. Validate TypeScript and render affected scenes, inspect representative frames, then report actual results. Never claim a render succeeded without producing it.
