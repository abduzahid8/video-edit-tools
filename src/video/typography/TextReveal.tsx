import type { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, motion } from "../theme";
export const TextReveal = ({
  text,
  delay = 0,
  style,
}: {
  text: string;
  delay?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay * fps, fps, config: motion.spring });
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontSize: 80,
          letterSpacing: "-0.045em",
          lineHeight: 1.06,
          whiteSpace: "pre-line",
          opacity: interpolate(frame - delay * fps, [0, fps * 0.35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${(1 - p) * 105}%)`,
          ...style,
        }}
      >
        {text}
      </div>
    </div>
  );
};
export const KineticText = ({
  text,
  style,
}: {
  text: string;
  style?: CSSProperties;
}) => (
  <div>
    {text.split("\n").map((line, i) => (
      <TextReveal
        key={i}
        text={line}
        delay={i * motion.staggerSeconds}
        style={style}
      />
    ))}
  </div>
);
