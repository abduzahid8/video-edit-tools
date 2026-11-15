import { Audio, Sequence, interpolate, useVideoConfig } from "remotion";
import { asset } from "./Media";
export type AudioCue = {
  src: string;
  atSeconds?: number;
  durationSeconds?: number;
  trimBeforeSeconds?: number;
  volume?: number;
  fadeSeconds?: number;
};
export const AudioTrack = ({
  src,
  atSeconds = 0,
  durationSeconds,
  trimBeforeSeconds = 0,
  volume = 0.7,
  fadeSeconds = 0.5,
}: AudioCue) => {
  const { fps, durationInFrames } = useVideoConfig();
  const duration = durationSeconds
    ? Math.round(durationSeconds * fps)
    : durationInFrames - Math.round(atSeconds * fps);
  const fade = Math.min(fadeSeconds * fps, (duration - 1) / 2);
  return (
    <Sequence
      name="Audio"
      from={Math.round(atSeconds * fps)}
      durationInFrames={duration}
    >
      <Audio
        src={asset(src)}
        trimBefore={Math.round(trimBeforeSeconds * fps)}
        volume={(f) =>
          volume *
          (fade > 0
            ? interpolate(
                f,
                [0, fade, duration - 1 - fade, duration - 1],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
            : 1)
        }
      />
    </Sequence>
  );
};
