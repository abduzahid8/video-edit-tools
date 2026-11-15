import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from "remotion";
import { brand } from "../theme";
export const asset = (src: string) =>
  /^(https?:|data:|blob:)/.test(src) ? src : staticFile(src);
const fit: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
export const ImageFrame = ({
  src,
  style,
}: {
  src: string;
  style?: CSSProperties;
}) => <Img src={asset(src)} style={{ ...fit, ...style }} />;
export type RecordingProps = {
  src: string;
  trimBeforeSeconds?: number;
  trimAfterSeconds?: number;
  playbackRate?: number;
  muted?: boolean;
  style?: CSSProperties;
};
// Remotion trim frames use the composition FPS, independent of source FPS.
export const ScreenRecording = ({
  src,
  trimBeforeSeconds = 0,
  trimAfterSeconds,
  playbackRate = 1,
  muted = true,
  style,
}: RecordingProps) => {
  const { fps } = useVideoConfig();
  return (
    <OffthreadVideo
      src={asset(src)}
      trimBefore={Math.round(trimBeforeSeconds * fps)}
      trimAfter={
        trimAfterSeconds === undefined
          ? undefined
          : Math.round(trimAfterSeconds * fps)
      }
      playbackRate={playbackRate}
      muted={muted}
      style={{ ...fit, ...style }}
    />
  );
};
export const VideoFrame = ScreenRecording;
export type ScreenSource = { screenshot?: string; recording?: RecordingProps };
export const UIScreen = ({
  screenshot,
  recording,
  zoom = 1,
  origin = "50% 50%",
}: ScreenSource & { zoom?: number; origin?: string }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: brand.foreground }}>
    <AbsoluteFill
      style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
    >
      {recording ? (
        <ScreenRecording {...recording} />
      ) : screenshot ? (
        <ImageFrame src={screenshot} />
      ) : (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            color: brand.white,
            fontFamily: brand.fontFamily,
            fontSize: 22,
            letterSpacing: 3,
          }}
        >
          REAL UI ASSET REQUIRED
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  </AbsoluteFill>
);
export const FeatureCard = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      padding: 40,
      borderRadius: brand.radius,
      background: brand.surface,
      color: brand.foreground,
      ...style,
    }}
  >
    {children}
  </div>
);
