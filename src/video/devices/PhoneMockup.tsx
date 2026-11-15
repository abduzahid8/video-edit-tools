import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { asset, UIScreen, type ScreenSource } from "../components/Media";
import { brand, motion } from "../theme";
export const PhoneScreen = UIScreen;
export type PhoneProps = ScreenSource & {
  height?: number;
  frameSrc?: string;
  screenInset?: { top: number; right: number; bottom: number; left: number };
  scale?: number;
  rotation?: number;
  rotateY?: number;
  x?: number;
  y?: number;
  perspective?: number;
  floating?: boolean;
  enterSeconds?: number;
  exitSeconds?: number;
  durationSeconds?: number;
  cameraZoom?: number;
  children?: ReactNode;
  style?: CSSProperties;
};
// screenInset percentages align a supplied transparent frame to its real aperture.
export const PhoneMockup = ({
  height = 920,
  frameSrc,
  screenInset = { top: 2, right: 4, bottom: 2, left: 4 },
  scale = 1,
  rotation = 0,
  rotateY = -8,
  x = 0,
  y = 0,
  perspective = 1800,
  floating = true,
  enterSeconds = 0.9,
  exitSeconds = 0,
  durationSeconds,
  cameraZoom = 1,
  children,
  style,
  ...source
}: PhoneProps) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p =
    enterSeconds <= 0
      ? 1
      : spring({
          frame: f,
          fps,
          durationInFrames: Math.round(enterSeconds * fps),
          config: motion.spring,
        });
  const end = (durationSeconds ? durationSeconds * fps : durationInFrames) - 1;
  const exit =
    exitSeconds > 0
      ? interpolate(f, [end - exitSeconds * fps, end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const bob = floating ? Math.sin((f / fps) * 1.6) * 5 : 0;
  return (
    <div
      style={{
        width: height * 0.48,
        height,
        position: "relative",
        flexShrink: 0,
        transform: `perspective(${perspective}px) translate3d(${x}px,${y + (1 - p) * height * 0.85 + bob + exit * height}px,0) rotateY(${rotateY}deg) rotate(${rotation}deg) scale(${scale * cameraZoom * (0.94 + p * 0.06)})`,
        opacity: Math.min(1, p * 3) * (1 - exit),
        borderRadius: height * 0.075,
        background: brand.foreground,
        boxShadow: brand.shadow,
        border: frameSrc ? undefined : "3px solid #555",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${screenInset.top}%`,
          right: `${screenInset.right}%`,
          bottom: `${screenInset.bottom}%`,
          left: `${screenInset.left}%`,
          overflow: "hidden",
          borderRadius: height * 0.058,
        }}
      >
        {children ?? <PhoneScreen {...source} />}
      </div>
      {frameSrc ? (
        <Img
          src={asset(frameSrc)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: "2.6%",
              left: "36%",
              width: "28%",
              height: "2.7%",
              borderRadius: 30,
              background: "#030303",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "1.4%",
              left: "35%",
              width: "30%",
              height: 4,
              borderRadius: 4,
              background: "#666",
            }}
          />
        </>
      )}
    </div>
  );
};
export const DeviceReveal = PhoneMockup;
