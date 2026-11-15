import { useVideoConfig } from "remotion";
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const landscape = width / height > 1.2;
  return {
    width,
    height,
    landscape,
    square: width === height,
    unit: Math.min(width, height) / 1080,
    phoneHeight: height * (landscape ? 0.76 : width === height ? 0.66 : 0.57),
    padding: Math.min(width, height) * 0.075,
  };
};
