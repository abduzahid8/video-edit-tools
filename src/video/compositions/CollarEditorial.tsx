import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {footwearBrand as brand} from "../theme";
import {collarSeconds, frames} from "../timeline";

const entries = [
  ["Что обрамляет лицо?", "color-editorial/brown.jpg", "50% 18%"],
  ["Открытый ворот", "oldmoney/src-3027174.jpg", "50% 18%"],
  ["Высокая горловина", "color-editorial/16499796.jpg", "50% 21%"],
  ["Воротник поло", "wardrobe-editorial/6447612.jpg", "50% 15%"],
  ["Сравните у лица", "color-editorial/16499796.jpg", "50% 15%"],
  ["Соберите свой образ", "aiwardrobe/wardrobe.png", "50% 50%"],
] as const;

function CollarScene({index}: {index: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [headline, photo, position] = entries[index];
  const end = index === 5;
  const enter = interpolate(frame, [0, fps * 0.44], [1, 0], {extrapolateRight: "clamp"});
  const detailArrival = interpolate(frame, [2.1 * fps, 2.65 * fps], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const showDetail = index > 0 && index < 4;
  const detail = index > 0 && index < 4;
  return (
    <AbsoluteFill style={{backgroundColor: brand.backdrop, color: brand.paper, fontFamily: brand.font, overflow: "hidden"}}>
      <div style={{position: "absolute", top: 160, left: 94, right: 94, display: "flex", justifyContent: "space-between", fontSize: 25, letterSpacing: 5, color: brand.accent}}>
        <span>{end ? "AIWARDROBE" : "ДЕТАЛИ ОБРАЗА"}</span><span>06 / {index + 1}</span>
      </div>
      <div style={{position: "absolute", left: 94, right: 94, top: 240, height: 1050, overflow: "hidden"}}>
        <Img src={staticFile("assets/" + photo)} style={{
          width: "100%", height: "100%", objectFit: end ? "contain" : "cover", objectPosition: position,
          transformOrigin: position, transform: `translateY(${enter * 90}px) scale(${detail ? 1.47 : 1})`,
          clipPath: `inset(${enter * 100}% 0 0 0)`,
        }} />
      </div>
      {!end && <div style={{position: "absolute", left: 780, top: 1050, width: 204, height: 370, backgroundColor: brand.paper, padding: 8}}>
        <Img src={staticFile("assets/aiwardrobe/polo.png")} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom"}} />
      </div>}
      {showDetail && <div style={{
        position: "absolute", left: 94, top: 760, width: 580, height: 530,
        overflow: "hidden", border: "10px solid " + brand.backdrop,
        transform: `translateY(${detailArrival * 550}px)`,
        opacity: 1 - detailArrival,
      }}>
        <Img src={staticFile("assets/" + photo)} style={{
          width: "100%", height: "100%", objectFit: "cover", objectPosition: position,
          transform: "scale(1.8)", transformOrigin: position,
        }} />
        <div style={{position: "absolute", bottom: 18, left: 20, background: brand.backdrop, color: brand.accent, padding: "8px 12px", fontSize: 23, letterSpacing: 3}}>ДЕТАЛЬ / {index}</div>
      </div>}
      <div style={{position: "absolute", bottom: 274, left: 94, width: 690, fontSize: 68, fontWeight: 700, lineHeight: 1.04}}>
        {headline}
      </div>
    </AbsoluteFill>
  );
}

export function CollarEditorial() {
  const {fps} = useVideoConfig();
  let from = 0;
  return collarSeconds.map((seconds, index) => {
    const duration = frames(seconds, fps);
    const scene = <Sequence key={index} name={entries[index][0]} from={from} durationInFrames={duration}>
      <CollarScene index={index} />
    </Sequence>;
    from += duration;
    return scene;
  });
}
