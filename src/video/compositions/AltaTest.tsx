import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { PhoneMockup } from "../devices/PhoneMockup";
import { TextReveal } from "../typography/TextReveal";
import { GradientBackground } from "../effects/Motion";
import { brand } from "../theme";
import { useLayout } from "../utils/layout";
export const AltaTest = () => {
  const { phoneHeight, unit } = useLayout();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ fontFamily: brand.fontFamily, color: brand.foreground }}
    >
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <PhoneMockup height={phoneHeight} rotation={-4}>
          <AbsoluteFill
            style={{
              background: brand.foreground,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sequence from={0.5 * fps} layout="none">
              <TextReveal
                text="ALTA"
                style={{
                  fontSize: 76 * unit,
                  color: brand.white,
                  letterSpacing: "0.12em",
                }}
              />
            </Sequence>
          </AbsoluteFill>
        </PhoneMockup>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: "9%",
          width: "100%",
          textAlign: "center",
        }}
      >
        <TextReveal
          text="Motion, with intention."
          delay={0.5}
          style={{ fontSize: 44 * unit }}
        />
        <div
          style={{
            fontSize: 18 * unit,
            letterSpacing: 3,
            marginTop: 24,
            color: brand.muted,
          }}
        >
          DEVICE & TYPOGRAPHY STUDY · 01
        </div>
      </div>
    </AbsoluteFill>
  );
};
