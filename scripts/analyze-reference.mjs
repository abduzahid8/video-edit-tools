import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, extname, join } from "node:path";
const [input, output, intervalArg = "2"] = process.argv.slice(2);
if (!input) {
  console.error(
    "Usage: npm run analyze:reference -- <video> [output-directory] [interval-seconds]",
  );
  process.exit(1);
}
const interval = Number(intervalArg);
if (!Number.isFinite(interval) || interval <= 0)
  throw new Error("Interval must be positive");
const file = resolve(input);
if (!existsSync(file)) throw new Error(`Missing input: ${file}`);
const out = resolve(
  output ??
    join(
      "renders",
      "references",
      `${basename(file, extname(file))}-${Date.now()}`,
    ),
);
// A fresh directory prevents accidental overwrite or stale frame analysis.
if (existsSync(out))
  throw new Error(`Output already exists: ${out}. Choose a new directory.`);
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${cmd} failed: ${r.stderr}`);
  return r.stdout;
};
const metadata = JSON.parse(
  run("ffprobe", [
    "-v",
    "error",
    "-show_format",
    "-show_streams",
    "-of",
    "json",
    file,
  ]),
);
const video = metadata.streams.find((s) => s.codec_type === "video");
if (!video) throw new Error("No video stream found");
const fraction = (s) => {
  const [n, d = 1] = String(s).split("/").map(Number);
  return d ? n / d : 0;
};
const duration = Number(metadata.format.duration ?? video.duration);
if (!Number.isFinite(duration) || duration <= 0)
  throw new Error("Unable to determine video duration");
const rotation =
  video.side_data_list?.find((s) => s.rotation !== undefined)?.rotation ??
  Number(video.tags?.rotate ?? 0);
const rotated = Math.abs(rotation) % 180 === 90;
const displayWidth = rotated ? video.height : video.width,
  displayHeight = rotated ? video.width : video.height;
// Bound extraction to 120 frames for long references; first frame is always included.
const step = Math.max(interval, duration / 120);
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "metadata.json"), JSON.stringify(metadata, null, 2));
const summary = {
  source: file,
  durationSeconds: duration,
  width: video.width,
  height: video.height,
  displayWidth,
  displayHeight,
  rotation,
  fps: fraction(video.avg_frame_rate),
  nominalFps: fraction(video.r_frame_rate),
  aspectRatio: displayWidth / displayHeight,
  sampleAspectRatio: video.sample_aspect_ratio,
  intervalSeconds: step,
};
writeFileSync(join(out, "summary.json"), JSON.stringify(summary, null, 2));
run("ffmpeg", [
  "-hide_banner",
  "-loglevel",
  "error",
  "-i",
  file,
  "-vf",
  `select=isnan(prev_selected_t)+gte(t-prev_selected_t\\,${step}),scale=640:-2`,
  "-fps_mode",
  "vfr",
  "-frames:v",
  "120",
  join(out, "frame-%03d.jpg"),
]);
// Actual presentation timestamps support variable-FPS sources.
const cuts = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-i",
    file,
    "-vf",
    "select='gt(scene,0.3)',showinfo",
    "-an",
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
);
if (cuts.status !== 0) throw new Error(cuts.stderr);
const cutTimes = [...cuts.stderr.matchAll(/pts_time:\s*([\d.]+)/g)].map((m) =>
  Number(m[1]),
);
writeFileSync(
  join(out, "cuts.json"),
  JSON.stringify(
    { threshold: 0.3, approximateCutTimesSeconds: cutTimes },
    null,
    2,
  ),
);
writeFileSync(
  join(out, "analysis.md"),
  `# Motion reference analysis\n\nSource: ${file}\nDuration: ${duration}s; display: ${displayWidth} × ${displayHeight}; FPS: ${summary.fps}; ratio: ${summary.aspectRatio.toFixed(3)}\n\nFrames sampled approximately every ${step}s starting at 0; inspect original around each cut for precise timing. Approximate cut candidates: ${cutTimes.join(", ") || "none detected"}. These are heuristics, not semantic analysis.\n\n## Agent review\n- Scene structure and approximate start/end times:\n- Typography position, scale, hierarchy, and on-screen duration:\n- Camera/device movement and easing:\n- Zoom targets, cuts, transitions, and hold lengths:\n- Composition and negative space:\n- Pacing, audio beats, and text timing:\n- ALTA adaptation using supplied brand/UI assets:\n\nReview extracted frames visually and watch the source before making motion claims. Recreate motion language and pacing with ALTA assets; do not copy another brand’s identity or graphics.\n`,
);
console.log(JSON.stringify({ output: out, ...summary }, null, 2));
