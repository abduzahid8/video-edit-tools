import { AbsoluteFill } from "remotion";
import { PhoneMockup } from "../devices/PhoneMockup";
import { AppDemo } from "../components/AppDemo";
import { LogoReveal, CTA } from "../components/Brand";
import { FeatureCard, UIScreen, type ScreenSource } from "../components/Media";
import { KineticText } from "../typography/TextReveal";
import { GradientBackground } from "../effects/Motion";
import { useLayout } from "../utils/layout";
import { brand } from "../theme";
import type { SceneId } from "../timeline";
const copy: Record<SceneId, string> = {
  intro: "Your wardrobe.\nReimagined.",
  phoneReveal: "Meet ALTA.",
  appOverview: "A closer look.",
  featureOne: "Your wardrobe,\nin focus.",
  interaction: "Style in motion.",
  productDemo: "See it in action.",
  featureTwo: "Made for you.",
  outro: "Your wardrobe.\nReimagined.",
};
export const PromoScene = ({
  id,
  source,
  logo,
  frameSrc,
}: {
  id: SceneId;
  source: ScreenSource;
  logo?: string;
  frameSrc?: string;
}) => {
  const { landscape, square, phoneHeight, padding, unit } = useLayout();
  const wide = landscape || square;
  return (
    <AbsoluteFill
      style={{ fontFamily: brand.fontFamily, color: brand.foreground }}
    >
      <GradientBackground />
      {id === "intro" ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 70,
            textAlign: "center",
            padding,
          }}
        >
          <LogoReveal src={logo} />
          <KineticText text={copy[id]} style={{ fontSize: 90 * unit }} />
        </AbsoluteFill>
      ) : id === "outro" ? (
        <CTA logo={logo} />
      ) : id === "appOverview" ? (
        <AppDemo {...source} />
      ) : (
        <AbsoluteFill
          style={{
            flexDirection: wide ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            gap: wide ? (square ? 65 : 120) * unit : 65 * unit,
            padding,
          }}
        >
          <div
            style={{
              width: wide ? "43%" : "100%",
              textAlign: wide ? "left" : "center",
            }}
          >
            <div
              style={{
                fontSize: 18 * unit,
                letterSpacing: 4,
                color: brand.muted,
                marginBottom: 30,
              }}
            >
              ALTA / PRODUCT STUDY
            </div>
            <KineticText
              text={copy[id]}
              style={{ fontSize: (square ? 58 : landscape ? 86 : 68) * unit }}
            />
            {(id === "featureOne" || id === "featureTwo") && (
              <FeatureCard style={{ marginTop: 35, fontSize: 24 * unit }}>
                Feature copy & real UI to be supplied.
              </FeatureCard>
            )}
          </div>
          {id === "interaction" ? (
            <div
              style={{
                width: phoneHeight * 0.48,
                height: phoneHeight,
                position: "relative",
                overflow: "hidden",
                borderRadius: brand.radius,
              }}
            >
              <UIScreen {...source} zoom={1.15} origin="50% 35%" />
            </div>
          ) : (
            <PhoneMockup
              {...source}
              frameSrc={frameSrc}
              height={phoneHeight}
              rotation={id === "phoneReveal" ? -4 : 0}
            />
          )}
        </AbsoluteFill>
      )}
      <div
        style={{
          position: "absolute",
          left: padding,
          bottom: padding / 2,
          fontSize: 16 * unit,
          letterSpacing: 2,
          color: brand.muted,
        }}
      >
        STARTER / {id.toUpperCase()} / ASSETS PENDING
      </div>
    </AbsoluteFill>
  );
};
