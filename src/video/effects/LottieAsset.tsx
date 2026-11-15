import { Lottie, type LottieAnimationData } from "@remotion/lottie";
export const LottieAsset = ({
  data,
  size = 200,
}: {
  data: LottieAnimationData;
  size?: number;
}) => <Lottie animationData={data} style={{ width: size, height: size }} />;
