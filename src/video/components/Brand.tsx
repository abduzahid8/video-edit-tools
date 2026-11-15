import { AbsoluteFill, Img } from "remotion";
import { TextReveal } from "../typography/TextReveal";
import { asset } from "./Media";
import { brand } from "../theme";
export const LogoReveal = ({
  src,
  size = 150,
}: {
  src?: string;
  size?: number;
}) =>
  src ? (
    <Img src={asset(src)} style={{ width: size * 3, objectFit: "contain" }} />
  ) : (
    <TextReveal
      text={brand.name}
      style={{ fontSize: size, letterSpacing: "0.12em", fontWeight: 500 }}
    />
  );
export const CTA = ({
  text = "Your wardrobe.\nReimagined.",
  logo,
}: {
  text?: string;
  logo?: string;
}) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      gap: 60,
      textAlign: "center",
    }}
  >
    <LogoReveal src={logo} />
    <TextReveal text={text} delay={0.3} style={{ fontSize: 64 }} />
  </AbsoluteFill>
);
