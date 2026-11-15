import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {jacketEditorialBrand as brand} from "../theme";
import {frames, hemEditorialSeconds} from "../timeline";

const runway = "oldmoney/src-12515249.jpg";
const suit = "color-editorial/17086283.jpg";
const denim = "color-editorial/17086283.jpg";
const cropped = "wardrobe-editorial/6447612.jpg";
const shots = [
  {label: "ДВА САНТИМЕТРА", photos: [runway, suit, cropped], crop: "50% 100%"},
  {label: "ГДЕ КРАЙ БРЮК?", photos: [denim], crop: "50% 99%"},
  {label: "ТКАНЬ СОБИРАЕТСЯ", photos: [denim], crop: "50% 99%"},
  {label: "ОБУВЬ ОСТАЁТСЯ ВИДНА", photos: [runway], crop: "50% 98%"},
  {label: "СРАВНИТЕ КРОМКИ", photos: [runway, suit], crop: "50% 98%"},
  {label: "ПОСМОТРИТЕ В ПОЛНЫЙ РОСТ", photos: [suit, cropped], crop: "50% 78%"},
  {label: "ПРИМЕРЯЙТЕ С ОБУВЬЮ", photos: [runway, suit, cropped], crop: "50% 90%"},
  {label: "ПОДБЕРИТЕ СВОЮ ПАРУ", photos: ["aiwardrobe/wardrobe.png"], crop: "50% 50%"},
];

function HemShot({index}: {index: number}) {
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
        <Img src={staticFile("assets/" + photo)} style={{width: "100%", height: "100%", transform: index < 5 ? "scale(1.6)" : undefined, transformOrigin: "50% 100%", objectFit: closing ? "contain" : "cover", objectPosition: shot.crop}} />
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
      {closing ? "AIWardrobe" : "03 / БРЮКИ И ОБУВЬ"}
    </div>
    {index === 2 && <div style={{position: "absolute", top: 1640, left: 95, width: `${850 - offset * 4}px`, borderTop: "4px solid " + brand.accent}} />}
    <div style={{position: "absolute", left: 95, right: 120, top: closing ? undefined : 284, bottom: closing ? 270 : undefined, fontSize: 76, fontWeight: 900, lineHeight: 1.02}}>
      <span style={{backgroundColor: brand.ink, color: brand.accent, padding: "9px 17px", boxDecorationBreak: "clone"}}>{shot.label}</span>
    </div>
  </AbsoluteFill>;
}

export function HemEditorial() {
  const {fps} = useVideoConfig();
  let from = 0;
  return hemEditorialSeconds.map((seconds, index) => {
    const duration = frames(seconds, fps);
    const scene = <Sequence key={index} name={shots[index].label} from={from} durationInFrames={duration}><HemShot index={index} /></Sequence>;
    from += duration;
    return scene;
  });
}
