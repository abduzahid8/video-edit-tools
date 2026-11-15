import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Trail } from "@remotion/motion-blur";
import { brand } from "../theme";
export const GradientBackground = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 65% 35%, ${brand.white}, ${brand.background} 65%, ${brand.surface})`,
    }}
  />
);
export const BackgroundGlow = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, ${brand.accent}55, transparent 65%)`,
    }}
  />
);
export const ParallaxLayer = ({
  children,
  depth = 1,
}: {
  children: ReactNode;
  depth?: number;
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ transform: `translateY(${Math.sin(f / fps) * depth * 8}px)` }}
    >
      {children}
    </AbsoluteFill>
  );
};
export const MaskReveal = ({
  children,
  seconds = 0.8,
}: {
  children: ReactNode;
  seconds?: number;
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${interpolate(f, [0, seconds * fps], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}% 0 0 0)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
// Trail works in ordinary Studio browsers; opt in only on fast-moving elements.
export const MotionTrail = ({ children }: { children: ReactNode }) => (
  <Trail layers={4} lagInFrames={0.3} trailOpacity={0.12}>
    {children}
  </Trail>
);
