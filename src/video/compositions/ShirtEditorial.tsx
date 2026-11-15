import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {shoulderEditorialBrand as brand} from "../theme";
import {frames, shirtEditorialSeconds} from "../timeline";

const structured = "wardrobe-editorial/28378508.jpg";
const soft = "wardrobe-editorial/13250366.jpg";
const shots = [
  {title: "Где край рубашки?", caption: "Два способа построить силуэт", image: structured},
  {title: "Линия пояса", caption: "Горизонталь поднимается", image: structured},
  {title: "Свободный край", caption: "Горизонталь смещается вниз", image: soft},
  {title: "Сравните силуэты", caption: "Сравните линию талии", image: soft},
  {title: "AIWardrobe", caption: "Попробуйте новое сочетание", image: "aiwardrobe/result.png"},
];

const asset = (path: string) => staticFile("assets/" + path);

function ShoulderShot({index}: {index: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shot = shots[index];
  const reveal = interpolate(frame, [0, fps * 0.65], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const detailArrival = interpolate(frame, [2.5 * fps, 3.0 * fps], [100, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const comparison = index === 0 || index === 3;
  const product = index === 4;
  const detail = index === 1 || index === 2;
  const leaderEnd = index === 1 ? 754 : 610;
  const leaderY = index === 1 ? 1410 : 1344;
  return (
    <AbsoluteFill style={{backgroundColor: brand.paper, color: brand.ink, overflow: "hidden"}}>
      <div style={{position: "absolute", top: 168, left: 96, right: 96, borderTop: "1px solid", paddingTop: 22, font: "23px Arial", letterSpacing: 5}}>
        AIWARDROBE / 11
      </div>
      <div style={{position: "absolute", top: 266, left: 96, right: 96, fontFamily: brand.serif, fontSize: 90, lineHeight: 1}}>
        {shot.title}
      </div>
      <Img src={asset(comparison ? structured : shot.image)} style={{
        position: "absolute", left: comparison ? 18 : product ? 300 : 100, top: 445,
        width: comparison ? 530 : product ? 480 : 880, height: 1080, objectFit: "contain",
        transformOrigin: "50% 34%",
        transform: `translateY(${(1 - reveal) * 92}px) scale(${detail ? 1.17 : 1})`,
        clipPath: `inset(${(1 - reveal) * 25}% 0 0 0)`,
      }} />
      {comparison && <Img src={asset(soft)} style={{
        position: "absolute", left: 480, top: 445, width: 570, height: 1080,
        objectFit: "contain", transform: `translateX(${(1 - reveal) * 195}px)`,
      }} />}
      {detail && <div style={{
        position: "absolute", top: 970, left: 96, width: 490, height: 470,
        overflow: "hidden", border: "10px solid " + brand.paper,
        clipPath: `inset(0 0 ${detailArrival}% 0)`,
      }}>
        <Img src={asset(shot.image)} style={{
          width: "100%", height: "100%", objectFit: "cover", objectPosition: "55% 69%",
          transform: "scale(1.6)", transformOrigin: "55% 69%",
        }} />
      </div>}
      {detail && <svg viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none"}}>
        <path d={`M 948 ${leaderY - 140} H 868 L ${leaderEnd} ${leaderY}`} fill="none" stroke={brand.rule} strokeWidth="5"
          pathLength="1" strokeDasharray="1" strokeDashoffset={1 - reveal} />
        <circle cx={leaderEnd} cy={leaderY} r={7 * reveal} fill={brand.paper} stroke={brand.rule} strokeWidth="5" />
      </svg>}
      <div style={{
        position: "absolute", left: 96, right: 96, bottom: 250, paddingTop: 24, backgroundColor: brand.paper,
        borderTop: "2px solid " + brand.rule, font: "italic 46px " + brand.serif,
      }}>
        {shot.caption}
      </div>
    </AbsoluteFill>
  );
}

export function ShirtEditorial() {
  const {fps} = useVideoConfig();
  let from = 0;
  return shirtEditorialSeconds.map((seconds, index) => {
    const duration = frames(seconds, fps);
    const sequence = (
      <Sequence key={shots[index].title} name={shots[index].title} from={from} durationInFrames={duration}>
        <ShoulderShot index={index} />
      </Sequence>
    );
    from += duration;
    return sequence;
  });
}
