import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ralphLaurenEditorialBrand as b} from '../theme';
import {ralphLaurenTimeline as t} from '../timeline';

const asset = (file: string) => staticFile(`assets/ralph-lauren-editorial/${file}`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(.22, .8, .25, 1)};
const v = (frame: number, fps: number, times: number[], values: number[]) => interpolate(frame / fps, times, values, ease);

function Paper() {
  return <AbsoluteFill style={{background: b.paper}}>
    <Img src={staticFile('assets/capsule-elegant/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: .58}}/>
    <div style={{position: 'absolute', inset: 0, background: 'rgba(239,238,233,.43)'}}/>
  </AbsoluteFill>;
}

function Folio({chapter, seconds}: {chapter: string; seconds: number}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <>
    <div style={{position: 'absolute', top: 88, left: 84, right: 84, display: 'flex', justifyContent: 'space-between', fontFamily: b.sans, fontSize: 18, letterSpacing: 2.1, color: b.muted}}>
      <span>ALTA / STYLE NOTES</span><span>{chapter}</span>
    </div>
    <div style={{position: 'absolute', bottom: 92, left: 84, right: 84, height: 1, background: b.line, opacity: .7}}/>
    <div style={{position: 'absolute', bottom: 91, left: 84, width: 912 * Math.min(1, frame / Math.max(1, seconds * fps)), height: 3, background: b.sepia}}/>
    <div style={{position: 'absolute', bottom: 54, left: 84, fontFamily: b.sans, fontSize: 17, letterSpacing: 1.4, color: b.muted}}>RALPH LAUREN / AN EDITORIAL STUDY</div>
  </>;
}

function Title({children, y = 320, size = 74, delay = .26, italic = false}: {children: React.ReactNode; y?: number; size?: number; delay?: number; italic?: boolean}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <div style={{position: 'absolute', top: y, left: 95, right: 95, textAlign: 'center', fontFamily: b.serif, fontSize: size, lineHeight: 1.05, fontStyle: italic ? 'italic' : 'normal', letterSpacing: -1.7, color: b.ink, opacity: v(frame, fps, [delay, delay + .18], [0, 1]), translate: `0 ${v(frame, fps, [delay, delay + .36, delay + 3.6], [28, 0, -13])}px`}}>{children}</div>;
}

function Label({children, y, size = 25, delay = .4, color = b.muted}: {children: React.ReactNode; y: number; size?: number; delay?: number; color?: string}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const reveal = Math.max(delay, .37);
  return <div style={{position: 'absolute', top: y, left: 100, right: 100, textAlign: 'center', fontFamily: b.body, fontSize: size, lineHeight: 1.23, color, opacity: v(frame, fps, [reveal, reveal + .18], [0, 1]), translate: `0 ${v(frame, fps, [reveal, reveal + .3, reveal + 2.5], [14, 0, -8])}px`}}>{children}</div>;
}

type PhotoEntry = 'left' | 'right' | 'up' | 'zoom';
function Photo({file, x, y, w, h, delay = .15, end = 4, entry = 'right', angle = 0, reframeAt, reframeX = 0, reframeY = 0, reframeScale = 1, zIndex = 1}: {file: string; x: number; y: number; w: number; h: number; delay?: number; end?: number; entry?: PhotoEntry; angle?: number; reframeAt?: number; reframeX?: number; reframeY?: number; reframeScale?: number; zIndex?: number}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const travelX = entry === 'left' ? -95 : entry === 'right' ? 95 : 0;
  const travelY = entry === 'up' ? 76 : 0;
  const driftX = entry === 'left' ? 24 : entry === 'right' ? -24 : angle < 0 ? 16 : -16;
  const late = reframeAt === undefined ? 0 : v(frame, fps, [reframeAt, reframeAt + .55], [0, 1]);
  const entryScale = entry === 'zoom' ? [.86, 1.035, 1, 1.02] : entry === 'up' ? [.985, 1, 1, 1.02] : [1, 1, 1, 1.02];
  const fadeSeconds = entry === 'zoom' ? .19 : entry === 'up' ? .15 : .11;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, zIndex, background: b.cream, boxShadow: b.shadow,
    opacity: v(frame, fps, [delay, delay + fadeSeconds], [0, 1]),
    translate: `${v(frame, fps, [delay, delay + .42, end], [travelX, 0, driftX]) + late * reframeX}px ${v(frame, fps, [delay, delay + .42, end], [travelY, 0, -14]) + late * reframeY}px`,
    rotate: `${v(frame, fps, [delay, delay + .42, end], [angle * .35, 0, -angle * .22])}deg`,
    scale: v(frame, fps, [delay, delay + .25, delay + .48, end], entryScale) * (1 + late * (reframeScale - 1)),
  }}>
    <Img src={asset(file)} style={{display: 'block', width: '100%', height: '100%', objectFit: 'contain'}}/>
  </div>;
}

function Rule({y, x = 120, width = 840, delay = .1}: {y: number; x?: number; width?: number; delay?: number}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const reveal = Math.max(delay, .35);
  return <div style={{position: 'absolute', top: y, left: x, width: v(frame, fps, [reveal, reveal + .38], [0, width]), height: 1, background: b.line}}/>;
}

type PageEntry = 'slide' | 'lift' | 'dissolve';
function Page({children, chapter, seconds, first = false, direction = 1, entry = 'slide'}: {children: React.ReactNode; chapter: string; seconds: number; first?: boolean; direction?: number; entry?: PageEntry}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const enterX = first || entry !== 'slide' ? 0 : v(frame, fps, [0, t.slideSeconds], [direction * 1080, 0]);
  const enterY = first || entry !== 'lift' ? 0 : v(frame, fps, [0, t.slideSeconds], [260, 0]);
  const enterOpacity = first || entry !== 'dissolve' ? 1 : v(frame, fps, [0, t.slideSeconds * .8], [0, 1]);
  const enterScale = first || entry !== 'dissolve' ? 1 : v(frame, fps, [0, t.slideSeconds], [1.025, 1]);
  const exitX = v(frame, fps, [seconds, seconds + t.slideSeconds], [0, -direction * 85]);
  return <AbsoluteFill style={{translate: `${enterX + exitX}px ${enterY}px`, scale: enterScale, opacity: enterOpacity * v(frame, fps, [seconds, seconds + t.slideSeconds], [1, .82]), overflow: 'hidden', color: b.ink, boxShadow: first ? undefined : entry === 'lift' ? '0 -24px 48px rgba(24,26,22,.14)' : `${direction * -22}px 0 36px rgba(24,26,22,.13)`}}>
    <Paper/>{children}<Folio chapter={chapter} seconds={seconds}/>
  </AbsoluteFill>;
}

function Callout({x, y, targetX, targetY, text, delay = 1}: {x: number; y: number; targetX: number; targetY: number; text: string; delay?: number}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progress = v(frame, fps, [delay, delay + .36], [0, 1]);
  return <>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: v(frame, fps, [delay, delay + .12, delay + 1.18, delay + 1.5], [0, 1, 1, 0])}}>
      <path d={`M ${x} ${y + 12} L ${targetX - 27} ${y + 12} L ${targetX} ${targetY}`} fill="none" stroke={b.ink} strokeWidth={1.5} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress}/>
      <circle cx={targetX} cy={targetY} r={13 * progress} fill="none" stroke={b.ink} strokeWidth={1.5}/>
      <circle cx={targetX} cy={targetY} r={3 * progress} fill={b.ink}/>
    </svg>
    <div style={{position: 'absolute', left: x, top: y - 20, fontFamily: b.sans, fontSize: 19, letterSpacing: 1.7, color: b.ink, background: b.paper, padding: '10px 13px', opacity: v(frame, fps, [delay + .12, delay + .3, delay + 1.18, delay + 1.5], [0, 1, 1, 0]), translate: `0 ${v(frame, fps, [delay + .12, delay + .4, delay + 1.5], [13, 0, -8])}px`}}>{text}</div>
  </>;
}

function KineticLine({children, y, size, delay = 0, italic = false}: {children: React.ReactNode; y: number; size: number; delay?: number; italic?: boolean}) {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <div style={{position: 'absolute', left: 85, right: 85, top: y, height: size * 1.17, overflow: 'hidden', textAlign: 'center'}}>
    <div style={{fontFamily: b.serif, fontSize: size, lineHeight: 1.1, letterSpacing: -2, fontStyle: italic ? 'italic' : 'normal', color: b.ink,
      translate: `0 ${v(frame, fps, [delay, delay + .36, delay + 3.2], [size * 1.1, 0, -12])}px`, opacity: v(frame, fps, [delay, delay + .1], [0, 1])}}>{children}</div>
  </div>;
}

function Cover() {
  return <>
    <KineticLine y={299} size={76} delay={.05}>What makes</KineticLine>
    <KineticLine y={383} size={81} delay={.2} italic>Ralph Lauren</KineticLine>
    <KineticLine y={475} size={71} delay={.35}>instantly recognizable?</KineticLine>
    <Rule y={649} x={265} width={550} delay={.44}/>
    <Photo file="01-early-portrait.png" x={240} y={685} w={600} h={604} entry="zoom" delay={.5} end={3.2} reframeAt={1.7} reframeY={-20} reframeScale={1.08}/>
    <Callout x={690} y={1144} targetX={580} targetY={1057} text="THE DESIGNER" delay={1.28}/>
    <Label y={1350} size={29} delay={1.92}>A portrait of an American point of view.</Label>
  </>;
}

function Ties() {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <>
    <Title y={275} size={105}>1967</Title>
    <Label y={402} size={32} delay={.22}>A drawer of ties. A larger idea.</Label>
    <Rule y={525} x={145} width={790} delay={.28}/>
    {[1967, 1972, 1993, 1995].map((year, i) => <React.Fragment key={year}>
      <div style={{position: 'absolute', left: 142 + i * 249, top: 517, width: 17, height: 17, borderRadius: '50%', background: i === 0 ? b.sepia : b.paper, border: `2px solid ${i === 0 ? b.sepia : b.line}`, scale: v(frame, fps, [.36 + i * .14, .6 + i * .14], [0, 1])}}/>
      <div style={{position: 'absolute', left: 137 + i * 249, top: 546, fontFamily: b.sans, fontSize: 22, color: i === 0 ? b.ink : b.muted, opacity: v(frame, fps, [.38 + i * .14, .57 + i * .14], [0, 1])}}>{year}</div>
    </React.Fragment>)}
    <Photo file="02-ties.jpg" x={135} y={675} w={810} h={607} delay={.48} end={3.9} entry="up" angle={-3}/>
    <Photo file="03-boutique.png" x={744} y={1330} w={200} h={298} delay={1.28} end={3.9} entry="right" angle={4}/>
    <Callout x={128} y={1360} targetX={341} targetY={977} text="WIDER. BOLDER." delay={1.86}/>
    <Label y={1660} size={25} delay={2.53}>The first Polo neckties were wide, patterned, and deliberate.</Label>
  </>;
}

function Idea() {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <>
    <div style={{position: 'absolute', top: 532, left: 0, right: 0, textAlign: 'center', fontFamily: b.serif, fontSize: 260, letterSpacing: -18, color: b.line, opacity: v(frame, fps, [.08, .38, 2.0, 2.55], [0, .21, .21, 0]), scale: v(frame, fps, [.08, 2.55], [.78, 1.15])}}>WORLD</div>
    <KineticLine y={748} size={79} delay={.4}>He was designing</KineticLine>
    <KineticLine y={845} size={80} delay={.8} italic>more than clothes.</KineticLine>
    <Rule y={1054} x={279} width={522} delay={1.18}/>
    <Label y={1101} size={28} delay={1.55}>An imagined life, made visible.</Label>
  </>;
}

function Polo() {
  return <>
    <Title y={263} size={98}>1972</Title>
    <Label y={382} size={32} delay={.21}>The Polo shirt enters the story.</Label>
    <Photo file="04-polo-blue.jpg" x={112} y={650} w={408} h={408} delay={.34} end={4.5} entry="left" angle={-3} reframeAt={2.62} reframeX={-30} reframeScale={.94}/>
    <Photo file="05-horse.jpg" x={563} y={615} w={402} h={484} delay={1.17} end={4.5} entry="right" angle={3} reframeAt={2.62} reframeX={22} reframeScale={1.08}/>
    <Callout x={108} y={1220} targetX={331} targetY={860} text="SPORTING EASE" delay={1.95}/>
    <Label y={1440} size={30} delay={2.75}>Sporting ease met a dressed-up sensibility.</Label>
  </>;
}

function Worlds() {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <>
    <Title y={258} size={70}>A wardrobe that felt<br/><i>like a whole world.</i></Title>
    <Photo file="06-collegiate.jpg" x={96} y={630} w={426} h={533} delay={.34} end={4} entry="left" reframeAt={2.38} reframeX={-25} reframeScale={1.05}/>
    <Photo file="07-fall-coat.jpg" x={558} y={630} w={426} h={555} delay={1.01} end={4} entry="right" reframeAt={2.38} reframeX={25} reframeScale={1.05}/>
    <div style={{position: 'absolute', left: 540, top: 630, width: 1, height: v(frame, fps, [.4, 1.08], [0, 555]), background: b.line}}/>
    <div style={{position: 'absolute', left: 96, top: 1235, fontFamily: b.sans, fontSize: 19, letterSpacing: 2, color: b.sepia, opacity: v(frame, fps, [1.15, 1.42], [0, 1])}}>01 / THE CAMPUS</div>
    <div style={{position: 'absolute', left: 558, top: 1235, fontFamily: b.sans, fontSize: 19, letterSpacing: 2, color: b.sepia, opacity: v(frame, fps, [1.6, 1.87], [0, 1])}}>02 / THE COUNTRY HOUSE</div>
    <Label y={1355} size={28} delay={2.18}>The campus. The country house. The city.</Label>
    <Label y={1495} size={43} delay={2.93} color={b.ink}><i>One point of view.</i></Label>
  </>;
}

function DoubleRL() {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <>
    <Title y={248} size={100}>1993</Title>
    <Label y={373} size={32}>Double RL looks west.</Label>
    <Photo file="08-western-truck.jpg" x={116} y={585} w={848} h={566} delay={.35} end={5.3} entry="left" angle={-3} reframeAt={3.56} reframeY={-20} reframeScale={.95}/>
    <Photo file="09-rrl-tweed.jpg" x={118} y={1220} w={390} h={482} delay={1.18} end={5.3} entry="up" angle={-4} reframeAt={3.56} reframeY={-18} reframeScale={1.03}/>
    <Photo file="10-rrl-denim.jpg" x={566} y={1220} w={384} h={501} delay={2.01} end={5.3} entry="up" angle={4} reframeAt={3.56} reframeY={-18} reframeScale={1.03}/>
    <Callout x={524} y={1170} targetX={785} targetY={811} text="THE OPEN ROAD" delay={2.88}/>
    <Label y={1740} size={24} delay={3.62}>Western references, workwear, and lived-in texture.</Label>
    <div style={{position: 'absolute', left: 112, top: 1000, width: 854, padding: '20px 18px', zIndex: 3, boxSizing: 'border-box', textAlign: 'center', background: 'rgba(239,238,233,.92)', color: b.ink, fontFamily: b.sans, fontSize: 22, letterSpacing: 3,
      opacity: v(frame, fps, [3.92, 4.12, 5.02, 5.3], [0, 1, 1, 0]),
      translate: `${v(frame, fps, [3.92, 4.36, 5.3], [-850, 0, 120])}px 0`}}>DENIM &nbsp; / &nbsp; WORKWEAR &nbsp; / &nbsp; THE WEST</div>
  </>;
}

function Purple() {
  return <>
    <Title y={247} size={100}>1995</Title>
    <Label y={370} size={32}>Purple Label refines the suit.</Label>
    <Photo file="11-purple-suit.jpg" x={96} y={680} w={280} h={420} delay={.35} end={5.3} entry="up" angle={-3} reframeAt={3.51} reframeX={-24} reframeScale={.94}/>
    <Photo file="12-purple-riviera.webp" x={400} y={680} w={280} h={420} delay={1.12} end={5.3} entry="zoom" reframeAt={3.51} reframeY={-10} reframeScale={1.14}/>
    <Photo file="13-purple-waistcoat.jpg" x={704} y={680} w={280} h={420} delay={1.89} end={5.3} entry="up" angle={3} reframeAt={3.51} reframeX={24} reframeScale={.94}/>
    <Rule y={1155} x={169} width={742} delay={2.58}/>
    <Label y={1240} size={32} delay={2.94}>Tailoring, restraint, and quiet confidence.</Label>
    <Label y={1390} size={22} delay={3.69}>PRECISION &nbsp; / &nbsp; LEISURE &nbsp; / &nbsp; DETAIL</Label>
  </>;
}

function PointOfView() {
  return <>
    <KineticLine y={280} size={78} delay={.3}>Different worlds.</KineticLine>
    <KineticLine y={372} size={78} delay={.7} italic>One point of view.</KineticLine>
    <Photo file="14-purple-pair.jpg" x={283} y={667} w={514} h={771} delay={.82} end={3.9} entry="zoom" reframeAt={2.23} reframeY={-30} reframeScale={1.08}/>
    <Callout x={637} y={1387} targetX={550} targetY={1098} text="ONE VISION" delay={1.68}/>
    <Label y={1524} size={28} delay={2.41}>A life you could imagine yourself entering.</Label>
  </>;
}

function Close() {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const years = [1967, 1972, 1993, 1995];
  return <>
    <KineticLine y={610} size={87} delay={.3}>Ralph Lauren</KineticLine>
    <KineticLine y={725} size={87} delay={.7} italic>made a world.</KineticLine>
    <Rule y={919} x={310} width={460} delay={.83}/>
    <Label y={980} size={28} delay={1.13}>An independent fashion editorial by ALTA.</Label>
    <Label y={1205} size={20} delay={1.82}>IMAGES: VANITY FAIR · RTVE · MODELS.COM · TAGWALK · FLAUNT · BRADEN STUDIO · MEN'S FOLIO</Label>
    <div style={{position: 'absolute', left: 180, right: 180, top: 1435, display: 'flex', justifyContent: 'space-between'}}>
      {years.map((year, i) => <span key={year} style={{fontFamily: b.serif, fontSize: 37, color: b.ink, opacity: v(frame, fps, [.9 + i * .53, 1.18 + i * .53, 1.55 + i * .53], [.26, 1, .45]), scale: v(frame, fps, [.9 + i * .53, 1.18 + i * .53, 1.55 + i * .53], [.94, 1.08, 1])}}>{year}</span>)}
    </div>
    <div style={{position: 'absolute', left: v(frame, fps, [1.08, 1.6, 2.12, 2.64], [182, 365, 548, 731]), top: 1505, width: 85, height: 3, background: b.sepia}}/>
  </>;
}

const scenes = [
  ['Cover', t.cover, Cover], ['1967 / Ties', t.ties, Ties], ['The idea', t.idea, Idea],
  ['1972 / Polo', t.polo, Polo], ['The world', t.worlds, Worlds],
  ['1993 / Double RL', t.doubleRl, DoubleRL], ['1995 / Purple Label', t.purple, Purple],
  ['A point of view', t.pointOfView, PointOfView], ['Close', t.close, Close],
] as const;
const pageEntries: PageEntry[] = ['slide', 'slide', 'dissolve', 'lift', 'slide', 'dissolve', 'lift', 'slide', 'dissolve'];

export function RalphLaurenEditorial() {
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: b.paper, overflow: 'hidden'}}>
    {scenes.map(([name, range, Component], i) => <Sequence key={name} name={name} from={Math.round(range.from * fps)} durationInFrames={Math.min(Math.round(t.duration * fps) - Math.round(range.from * fps), Math.round((range.seconds + (i < scenes.length - 1 ? t.slideSeconds : 0)) * fps))}>
      <Page chapter={`${String(i + 1).padStart(2, '0')} / 09`} seconds={range.seconds} first={i === 0} direction={i % 2 === 0 ? -1 : 1} entry={pageEntries[i]}><Component/></Page>
    </Sequence>)}
    <Audio src={asset('narration-dynamic.wav')} volume={1.25}/>
    <Audio src={asset('score-dynamic.wav')} volume={.17}/>
  </AbsoluteFill>;
}
