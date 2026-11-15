import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { LottieAsset } from "../effects/LottieAsset";
import { MotionTrail } from "../effects/Motion";
import { brand } from "../theme";
const Moving = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 50 + f * 3,
        width: 80,
        height: 80,
        background: brand.foreground,
      }}
    />
  );
};
// Tiny local vector fixture, used solely to exercise Lottie without external assets.
const fixture = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 30,
  w: 100,
  h: 100,
  nm: "Local check",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 1,
      nm: "Square",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [25, 25, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      sw: 50,
      sh: 50,
      sc: "#111111",
      ip: 0,
      op: 30,
      st: 0,
      bm: 0,
    },
  ],
};
export const IntegrationCheck = () => {
  const { width, height } = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: brand.background }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 4]} />
        <mesh rotation={[0, f * 0.02, 0]}>
          <boxGeometry />
          <meshStandardMaterial color={brand.accent} />
        </mesh>
      </ThreeCanvas>
      <MotionTrail>
        <Moving />
      </MotionTrail>
      <div style={{ position: "absolute", bottom: 20, right: 20 }}>
        <LottieAsset data={fixture} size={100} />
      </div>
    </AbsoluteFill>
  );
};
