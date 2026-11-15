import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { UIScreen, type ScreenSource } from "./Media";
import { PhoneMockup } from "../devices/PhoneMockup";
import { useLayout } from "../utils/layout";
// One screen layer moves continuously from the exact phone aperture to fullscreen.
export const AppDemo = ({
  direction = "to-fullscreen",
  startSeconds = 0.5,
  zoomSeconds = 1.2,
  ...source
}: ScreenSource & {
  direction?: "to-fullscreen" | "to-device";
  startSeconds?: number;
  zoomSeconds?: number;
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height, phoneHeight } = useLayout();
  const raw = interpolate(
    f,
    [startSeconds * fps, (startSeconds + zoomSeconds) * fps],
    [0, 1],
    { easing: Easing.bezier(0.22,1,0.36,1),
      extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const p = direction === "to-fullscreen" ? raw : 1 - raw;
  const pw = phoneHeight * 0.48;
  const sw = pw * 0.92,
    sh = phoneHeight * 0.96;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: 1 - p,
        }}
      >
        <PhoneMockup
          {...source}
          height={phoneHeight}
          rotateY={0}
          floating={false}
          enterSeconds={0}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: ((width - sw) / 2) * (1 - p),
          top: ((height - sh) / 2) * (1 - p),
          width: sw + (width - sw) * p,
          height: sh + (height - sh) * p,
          borderRadius: (1 - p) * phoneHeight * 0.058,
          overflow: "hidden",
        }}
      >
        <UIScreen {...source} />
      </div>
    </AbsoluteFill>
  );
};
