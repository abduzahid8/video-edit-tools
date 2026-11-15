import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { asset } from "../components/Media";
// Supplied GLB must include its real screen material/texture. No fabricated model.
const Model = ({ src, scale }: { src: string; scale: number }) => {
  const gltf = useLoader(GLTFLoader, asset(src));
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <primitive
      object={gltf.scene}
      scale={scale}
      rotation={[0, Math.sin((f / fps) * 0.6) * 0.15, 0]}
    />
  );
};
export const Device3D = ({
  modelSrc,
  scale = 1,
}: {
  modelSrc: string;
  scale?: number;
}) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 5], fov: 35 }}
      shadows
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2} castShadow />
      <Suspense fallback={null}>
        <Model src={modelSrc} scale={scale} />
      </Suspense>
    </ThreeCanvas>
  );
};
