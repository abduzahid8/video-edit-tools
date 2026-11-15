import { AbsoluteFill } from "remotion";
import type { TransitionPresentationComponentProps } from "@remotion/transitions";
type Props = {};
export const ZoomTransition = ({
  children,
  presentationDirection,
  presentationProgress: p,
}: TransitionPresentationComponentProps<Props>) => (
  <AbsoluteFill
    style={{
      opacity: presentationDirection === "entering" ? p : 1 - p,
      transform: `scale(${presentationDirection === "entering" ? 1.12 - p * 0.12 : 1 + p * 0.12})`,
    }}
  >
    {children}
  </AbsoluteFill>
);
export const BlurTransition = ({
  children,
  presentationDirection,
  presentationProgress: p,
}: TransitionPresentationComponentProps<Props>) => (
  <AbsoluteFill
    style={{
      opacity: presentationDirection === "entering" ? p : 1 - p,
      filter: `blur(${(presentationDirection === "entering" ? 1 - p : p) * 16}px)`,
    }}
  >
    {children}
  </AbsoluteFill>
);
