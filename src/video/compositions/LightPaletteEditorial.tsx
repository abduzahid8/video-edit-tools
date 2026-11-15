import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {lightPaletteBrand as brand} from "../theme";
import {frames, lightPaletteSeconds} from "../timeline";

const walking = "color-editorial/17086283.jpg";
const portrait = "color-editorial/16499796.jpg";
const creamCoat = "oldmoney/src-3027174.jpg";
const tanPortrait = "color-editorial/tan.jpg";
const photos = [
  [walking, portrait, creamCoat, tanPortrait],
  [tanPortrait, walking, walking, portrait],
  [creamCoat, portrait, creamCoat, tanPortrait],
  [tanPortrait, creamCoat, portrait, walking],
  [portrait, walking, tanPortrait, creamCoat],
];
const editorial = [
  ["СВЕТЛЫЙ ОБРАЗ", "Откуда берётся глубина?"],
  ["ПЕСОЧНЫЙ", "Основа палитры"],
  ["МОЛОЧНЫЙ", "Свет ближе к лицу"],
  ["ФАКТУРА", "Поверхность меняет оттенок"],
  ["ПРОВЕРЬТЕ У ОКНА", "Сравните оттенки при дневном свете"],
  ["AIWardrobe", "Соберите светлый образ"],
] as const;

function PaletteChapter({chapter}: {chapter: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [0, fps * 0.5], [0, 1], {extrapolateRight: "clamp"});
  const [title, subtitle] = editorial[chapter];
  const tileBeat = Math.floor(Math.max(0, frame / fps - 0.8) / 2.3);
  const tilePhase = Math.max(0, frame / fps - 0.8) % 2.3;
  const tileArrival = interpolate(tilePhase, [0, 0.45], [80, 0], {extrapolateRight: "clamp"});
  const closing = chapter === editorial.length - 1;
  const colors = [brand.sand, brand.cream, brand.taupe];
  return (
    <AbsoluteFill style={{background: brand.cream, color: brand.ink, fontFamily: brand.font, overflow: "hidden"}}>
      {closing ? (
        <Img src={staticFile("assets/aiwardrobe/result.png")} style={{
          position: "absolute", width: 495, height: 880, top: 367, left: 292,
          objectFit: "contain", transform: `translateY(${(1 - progress) * 120}px)`,
        }} />
      ) : (
        <AbsoluteFill style={{display: "grid", gridTemplateColumns: chapter === 3 ? "2fr 1fr" : "1fr 1fr", gridTemplateRows: "1fr 1fr"}}>
          {photos[chapter].map((_, index) => (
            <div key={index} style={{
              overflow: "hidden", background: colors[(index + chapter) % colors.length],
              clipPath: `inset(${index % 2 ? 0 : 100 * (1 - progress)}% 0 ${index % 2 ? 100 * (1 - progress) : 0}% 0)`,
            }}>
              <Img src={staticFile("assets/" + photos[chapter][(index + tileBeat) % 4])} style={{
                width: "100%", height: "100%", objectFit: "cover",
                objectPosition: chapter === 3 ? "50% 64%" : index < 2 ? "50% 32%" : "50% 68%",
                transformOrigin: chapter === 3 ? "50% 69%" : "50% 50%",
                translate: `${index % 2 ? tileArrival : -tileArrival}px 0px`,
                transform: `scale(${chapter === 3 ? 2.1 : 1 + 0.15 * (index % 2)})`,
              }} />
            </div>
          ))}
        </AbsoluteFill>
      )}
      <div style={{
        position: "absolute", top: closing ? 220 : 780, left: 76, right: 76, padding: "25px 30px 32px",
        background: chapter % 2 ? brand.ink : brand.cream, color: chapter % 2 ? brand.cream : brand.ink,
        textAlign: "center", transform: `translateY(${(1 - progress) * 34}px)`,
      }}>
        <div style={{fontSize: 75, fontWeight: 850, lineHeight: 1}}>{title}</div>
        <div style={{fontSize: 34, marginTop: 18}}>{subtitle}</div>
      </div>
      <div style={{position: "absolute", bottom: 266, left: 340, right: 340, display: "flex", border: "2px solid " + brand.cream}}>
        {colors.map((color, index) => <div key={color} style={{background: color, height: 26, flex: index === chapter % 3 ? 2 : 1}} />)}
      </div>
    </AbsoluteFill>
  );
}

export function LightPaletteEditorial() {
  const {fps} = useVideoConfig();
  let from = 0;
  return lightPaletteSeconds.map((seconds, chapter) => {
    const duration = frames(seconds, fps);
    const scene = (
      <Sequence key={chapter} name={editorial[chapter][0]} from={from} durationInFrames={duration}>
        <PaletteChapter chapter={chapter} />
      </Sequence>
    );
    from += duration;
    return scene;
  });
}
