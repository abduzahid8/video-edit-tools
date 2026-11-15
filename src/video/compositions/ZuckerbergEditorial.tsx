import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import {zuckerbergBrand as brand} from "../theme";
import {zuckerbergMotion as timing, zuckerbergScenes} from "../timeline";

const asset = (name: string) => staticFile(`assets/zuckerberg/${name}`);
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
type Scene = typeof zuckerbergScenes[number]["id"];
type PhotoName = "suit";
const credits = {
  suit: "GUILLAUME PAUMIER · CC BY 3.0",
};

const Photo = ({name, box, focus, mono = false, zoom = 1}: {
  name: PhotoName; box: CSSProperties; focus?: string; mono?: boolean; zoom?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <div style={{position: "absolute", overflow: "hidden", background: brand.line, ...box}}>
    <Img src={asset(`${name}.jpg`)} style={{
      width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, transformOrigin: focus,
      filter: mono ? "grayscale(1)" : undefined,
      scale: interpolate(frame, [0, fps * 6], [zoom, zoom * 1.065], clamp),
    }}/>
  </div>;
};

const Enter = ({children, delay = 0, x = 0}: {children: ReactNode; delay?: number; x?: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const amount = interpolate(frame, [delay * fps, (delay + 0.55) * fps], [0, 1], {
    ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });
  return <AbsoluteFill style={{opacity: amount, translate: `${x * (1 - amount)}px ${32 * (1 - amount)}px`}}>
    {children}
  </AbsoluteFill>;
};

const Label = ({children, style}: {children: ReactNode; style?: CSSProperties}) =>
  <div style={{position: "absolute", fontSize: 23, fontWeight: 650, letterSpacing: 3, ...style}}>{children}</div>;

const Title = ({children, style}: {children: ReactNode; style?: CSSProperties}) =>
  <div style={{
    position: "absolute", fontFamily: brand.serif, fontSize: 108, letterSpacing: -4,
    lineHeight: 0.96, ...style,
  }}>{children}</div>;

const Cutout = ({name, style, mono = false}: {name: PhotoName; style: CSSProperties; mono?: boolean}) =>
  <Img src={asset(`${name}.png`)} style={{position: "absolute", filter: mono ? "grayscale(1)" : undefined, ...style}}/>;

const Cover = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exit = interpolate(frame, [timing.coverExit * fps, 4 * fps], [0, -1120], {
    ...clamp, easing: Easing.in(Easing.cubic),
  });
  return <>
    <Label style={{left: 82, top: 153, color: brand.muted}}>МУЖСКОЙ СТИЛЬ / 01</Label>
    <Title style={{top: 232, left: 76, fontSize: 100}}>
      Марк Цукерберг<br/><i>в тёмном костюме</i>
    </Title>
    <div style={{position: "absolute", left: 82, right: 82, top: 469, height: 2, background: brand.line}}/>
    <AbsoluteFill style={{translate: `${exit}px 0`}}>
      <Photo name="suit" mono box={{left: 356, top: 596, width: 642, height: 1060}} focus="50% 62%"/>
      <Enter x={-98} delay={0.08}>
        <Photo name="suit" mono box={{left: 82, top: 1010, width: 348, height: 530}} focus="50% 100%" zoom={1.75}/>
      </Enter>
    </AbsoluteFill>
    <Label style={{left: 82, bottom: 129, color: brand.muted}}>ДОВИЛЬ · САММИТ G8 · 2011</Label>
  </>;
};

const Look = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const punch = interpolate(frame, [0, .65 * fps], [1.12, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const x = 300;
  const y = 1590;
  return <>
    <Label style={{top: 145, width: "100%", textAlign: "center"}}>ДОВИЛЬ · 2011</Label>
    <Title style={{top: 255, width: "100%", textAlign: "center", fontSize: 82}}>Строгий контраст</Title>
    <AbsoluteFill style={{scale: punch, transformOrigin: "50% 85%"}}>
      <Cutout name="suit" style={{width: 840, left: -85, top: 630}}/>
    </AbsoluteFill>
    <Enter delay={timing.detailReveal}>
      <svg width="1080" height="1920" style={{position: "absolute"}}>
        <path d={`M ${x} ${y} L 753 1000 L 888 1000`} fill="none" stroke={brand.muted} strokeWidth="3" strokeDasharray="7 8"/>
        <circle cx={x} cy={y} r="10" fill={brand.accent} stroke={brand.ink} strokeWidth="3"/>
      </svg>
    </Enter>
    <Enter delay={timing.captionReveal} x={48}>
      <div style={{position: "absolute", left: 690, top: 799, width: 315, background: brand.paper, borderTop: `2px solid ${brand.line}`, padding: 24, boxSizing: "border-box"}}>
        <div style={{fontFamily: brand.serif, fontSize: 42, fontStyle: "italic", lineHeight: 1}}>Белая рубашка</div>
        <div style={{marginTop: 18, fontSize: 27, lineHeight: 1.18}}>Светлый воротник выделяется на фоне тёмного костюма.</div>
      </div>
    </Enter>
    <Label style={{left: 76, bottom: 105, fontSize: 15, padding: 12, background: brand.paper}}>ФОТО / {credits.suit}</Label>
  </>;
};

const Formula = () => <>
  <Label style={{left: 82, top: 146}}>ДЕТАЛИ КОСТЮМА</Label>
  <Title style={{left: 76, top: 244, fontSize: 88}}>Лацкан, воротник<br/><i>и галстук</i></Title>
  <Enter x={90}>
    <Photo name="suit" mono focus="50% 100%" zoom={2.1} box={{left: 82, top: 548, width: 916, height: 823}}/>
  </Enter>
  <Enter delay={0.85}>
    <div style={{position: "absolute", left: 82, top: 1470, width: 890, fontSize: 42, lineHeight: 1.2}}>
      Галстук в тон костюму сохраняет строгую палитру.
    </div>
  </Enter>
</>;

const CallToAction = () => <AbsoluteFill style={{background: brand.paper, color: brand.ink}}>
  <Label style={{left: 76, top: 145, color: brand.muted}}>ВАШ СЛЕДУЮЩИЙ ОБРАЗ</Label>
  <Title style={{left: 73, top: 226, fontSize: 112}}>AIWardrobe</Title>
  <Enter delay={0.13} x={84}>
    <Img src={staticFile("assets/aiwardrobe/result.png")} style={{
      position: "absolute", left: 322, top: 421, width: 436, borderRadius: 36,
      boxShadow: "0 22px 65px #17191825",
    }}/>
  </Enter>
  <div style={{
    position: "absolute", left: 116, top: 1481, width: 848, padding: "32px 0",
    borderRadius: 90, background: brand.accent, color: brand.ink,
    textAlign: "center", fontSize: 43, fontWeight: 700,
  }}>Соберите свой первый образ</div>
  <Label style={{top: 1640, width: "100%", textAlign: "center"}}>ПОПРОБУЙТЕ AIWARDROBE</Label>
</AbsoluteFill>;

const EditorialScene = ({id}: {id: Scene}) => {
  if (id === "cover") return <Cover/>;
  if (id === "formula") return <Formula/>;
  if (id === "cta") return <CallToAction/>;
  return <Look/>;
};

export const ZuckerbergEditorial = () => {
  const {fps} = useVideoConfig();
  let elapsed = 0;
  return <AbsoluteFill style={{background: brand.paper, color: brand.ink, fontFamily: brand.sans}}>
    {zuckerbergScenes.map(({id, seconds}) => {
      const from = Math.round(elapsed * fps);
      elapsed += seconds;
      return <Sequence key={id} name={id} from={from} durationInFrames={Math.round(elapsed * fps) - from}>
        <EditorialScene id={id}/>
      </Sequence>;
    })}
  </AbsoluteFill>;
};
