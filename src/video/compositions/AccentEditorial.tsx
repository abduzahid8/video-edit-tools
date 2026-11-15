import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {shoulderEditorialBrand as brand} from "../theme";
import {accentEditorialSeconds, frames} from "../timeline";

const detail = "color-editorial/detail.jpg";
const portrait = "color-editorial/classic.jpg";
const accessories = "oldmoney/src-32479925.jpg";
const shoes = "oldmoney/src-1619655.jpg";
const shots = [
  ["У акцента есть эхо", detail, accessories, "Детали, которые связывают образ"],
  ["Галстук", detail, portrait, "Начните с одного оттенка"],
  ["Карманный платок", portrait, detail, "Ищите отголосок в узоре"],
  ["Коричневый тон", shoes, accessories, "Посмотрите, как меняется блик"],
  ["Один цвет, две поверхности", accessories, shoes, "Повторите тон в другом материале"],
  ["AIWardrobe", "aiwardrobe/result.png", "", "Соберите свои детали"],
] as const;

function AccentScene({index}: {index: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [title, primary, secondary, caption] = shots[index];
  const exchange = frame > 2.6 * fps && index > 0 && index < 5;
  const warm = index >= 3;
  const movement = interpolate(frame, [0, fps * 0.6], [130, 0], {extrapolateRight: "clamp"});
  return <AbsoluteFill style={{background: brand.paper, color: brand.ink, fontFamily: brand.serif, overflow: "hidden"}}>
    <div style={{position: "absolute", top: 174, left: 91, right: 91, borderTop: "2px solid " + brand.rule, paddingTop: 18, font: "24px Arial", letterSpacing: 5}}>AIWARDROBE / 12</div>
    <div style={{position: "absolute", top: 265, left: 91, right: 91, fontSize: 82, lineHeight: 1.02}}>{title}</div>
    <Img src={staticFile("assets/" + (exchange ? secondary : primary))} style={{position: "absolute", top: 490, left: secondary ? 91 : 306, width: secondary ? 740 : 468, height: secondary ? 640 : 950, objectFit: secondary ? "cover" : "contain", transform: `translateX(${-movement}px)`}} />
    {secondary && <>
      <div style={{
        position: "absolute", top: 1170, left: 91, display: "flex", gap: 12,
        transform: `translateY(${movement * 0.4}px)`,
      }}>
        {(warm ? brand.leatherSwatches : brand.tieSwatches).map((color) => (
          <div key={color} style={{width: 74, height: 74, background: color}} />
        ))}
      </div>
      <div style={{position: "absolute", top: 1035, left: 98, width: 410 - movement, borderTop: "3px solid " + brand.rule}} />
      <Img src={staticFile("assets/" + (exchange ? primary : secondary))} style={{position: "absolute", top: 932, right: 96, width: 460, height: 490, objectFit: "cover", border: "12px solid " + brand.paper, transform: `translateX(${movement}px)`}} />
    </>}
    <div style={{position: "absolute", bottom: 260, left: 91, right: 91, borderTop: "2px solid " + brand.rule, paddingTop: 18, fontSize: 42, fontStyle: "italic"}}>{caption}</div>
  </AbsoluteFill>;
}

export function AccentEditorial() {
  const {fps} = useVideoConfig();
  let from = 0;
  return accentEditorialSeconds.map((seconds, index) => {
    const duration = frames(seconds, fps);
    const scene = <Sequence key={index} name={shots[index][0]} from={from} durationInFrames={duration}><AccentScene index={index} /></Sequence>;
    from += duration;
    return scene;
  });
}
