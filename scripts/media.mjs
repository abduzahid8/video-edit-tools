import { spawnSync } from "node:child_process";
// Predictable local transcoding: pass paths as arguments, never shell strings.
const [input, output, start = "0", duration, speed = "1"] =
  process.argv.slice(2);
if (!input || !output) {
  console.error(
    "Usage: npm run media:prepare -- input.mov output.mp4 [startSeconds] [durationSeconds] [speed]",
  );
  process.exit(1);
}
const rate = Number(speed),
  offset = Number(start),
  length = duration === undefined ? undefined : Number(duration);
if (
  !Number.isFinite(rate) ||
  rate <= 0 ||
  !Number.isFinite(offset) ||
  offset < 0 ||
  (length !== undefined && (!Number.isFinite(length) || length <= 0))
)
  throw new Error("Invalid timing");
const tempo = [];
let r = rate;
while (r > 2) {
  tempo.push("atempo=2");
  r /= 2;
}
while (r < 0.5) {
  tempo.push("atempo=0.5");
  r /= 0.5;
}
tempo.push(`atempo=${r}`);
const args = [
  "-n",
  "-ss",
  String(offset),
  ...(length === undefined ? [] : ["-t", String(length)]),
  "-i",
  input,
  ...(length === undefined ? [] : ["-t", String(length/rate)]),
  "-vf",
  `setpts=(PTS-STARTPTS)/${rate},scale=trunc(iw/2)*2:trunc(ih/2)*2`,
  "-af",
  tempo.join(","),
  "-c:v",
  "libx264",
  "-crf",
  "18",
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "aac",
  "-movflags",
  "+faststart",
  output,
];
const result = spawnSync("ffmpeg", args, { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
