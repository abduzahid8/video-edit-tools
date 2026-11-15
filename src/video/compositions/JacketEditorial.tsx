import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {jacketEditorialBrand as brand} from "../theme";
import {frames, jacketEditorialSeconds} from "../timeline";

const short = "wardrobe-editorial/6447612.jpg";
const long = "oldmoney/src-34609625.jpg";
const layered = "wardrobe-editorial/30875139.jpg";
const shots = [
  {label: "ГДЕ ТАЛИЯ?", photos: [short, long, layered], crop: "50% 52%"},
  {label: "КОРОТКИЙ ТРИКОТАЖ", photos: [short], crop: "50% 41%"},
  {label: "ЛИНИЯ ПОЯСА", photos: [short], crop: "50% 60%"},
  {label: "ДЛИННОЕ ПАЛЬТО", photos: [long], crop: "50% 44%"},
  {label: "МЕСТО ДЛЯ СЛОЁВ", photos: [layered, long], crop: "50% 37%"},
  {label: "СРАВНИТЕ ДЛИНУ", photos: [short, long], crop: "50% 66%"},
  {label: "ДЛИНА МЕНЯЕТ СИЛУЭТ", photos: [layered, short, long], crop: "50% 58%"},
  {label: "СОБЕРИТЕ СВОЙ СИЛУЭТ", photos: ["aiwardrobe/result.png"], crop: "50% 50%"},
];

function JacketShot({index}: {index: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shot = shots[index];
  const detailStep = frame > 2.4 * fps && index > 0 && index < 7;
  const closing = index === shots.length - 1;
  const offset = interpolate(frame, [0, fps * 0.32], [140, 0], {extrapolateRight: "clamp"});
  return <AbsoluteFill style={{backgroundColor: brand.ink, color: brand.paper, fontFamily: brand.font}}>
    <div style={{position: "absolute", inset: closing ? "325px 0 560px" : 0, display: "flex", gap: 5, overflow: "hidden"}}>
      {shot.photos.map((photo, column) => <div key={photo} style={{
        flex: 1, minWidth: 0, overflow: "hidden",
        transform: `translateY(${offset * (column % 2 ? -1 : 1)}px)`,
      }}>
        <Img src={staticFile("assets/" + photo)} style={{width: "100%", height: "100%", objectFit: closing ? "contain" : "cover", objectPosition: shot.crop}} />
      </div>)}
    </div>
    {detailStep && <div style={{
      position: "absolute", right: 94, top: 430, width: 470, height: 610,
      border: "8px solid " + brand.accent, overflow: "hidden",
      clipPath: `inset(0 0 ${interpolate(frame, [2.4 * fps, 2.75 * fps], [100, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}% 0)`,
    }}>
      <Img src={staticFile("assets/" + shot.photos[shot.photos.length - 1])} style={{
        width: "100%", height: "100%", objectFit: "cover", objectPosition: shot.crop,
        transform: "scale(1.45)", transformOrigin: shot.crop,
      }} />
    </div>}
    <div style={{position: "absolute", top: 174, left: 95, padding: "14px 20px", backgroundColor: brand.ink, fontSize: 27, letterSpacing: 4}}>
      {closing ? "AIWardrobe" : "01 / ПРОПОРЦИИ"}
    </div>
    {index === 2 && <div style={{position: "absolute", top: 938, left: 95, width: `${850 - offset * 4}px`, borderTop: "4px solid " + brand.accent}} />}
    <div style={{position: "absolute", left: 95, right: 120, bottom: 270, fontSize: 76, fontWeight: 900, lineHeight: 1.02}}>
      <span style={{backgroundColor: brand.ink, color: brand.accent, padding: "9px 17px", boxDecorationBreak: "clone"}}>{shot.label}</span>
    </div>
  </AbsoluteFill>;
}

export function JacketEditorial() {
  const {fps} = useVideoConfig();
  let from = 0;
  return jacketEditorialSeconds.map((seconds, index) => {
    const duration = frames(seconds, fps);
    const scene = <Sequence key={index} name={shots[index].label} from={from} durationInFrames={duration}><JacketShot index={index} /></Sequence>;
    from += duration;
    return scene;
  });
}
