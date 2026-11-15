import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AIWardrobeEditorialCTA, EditorialTitle} from './ColorEditorial';
import {shoppingEditorialBrand as brand, wardrobeBrand as appBrand} from '../theme';
import {shoppingEditorialTimeline as timing} from '../timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)};
const photo = (file: string) => staticFile(`assets/smart-casual-shopping/${file}`);

function Figure({file, left, height, delay = 0, monochrome = false}: {
  file: string;
  left: number;
  height: number;
  delay?: number;
  monochrome?: boolean;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Img src={photo(file)} style={{
    position: 'absolute', left, bottom: -65, height, width: 'auto', maxWidth: 'none',
    filter: monochrome ? 'grayscale(1)' : undefined,
    opacity: interpolate(frame, [delay * fps, (delay + 0.16) * fps], [0, 1], clamp),
    translate: `${interpolate(frame, [delay * fps, (delay + 0.55) * fps], [120, 0], ease)}px ${interpolate(frame, [delay * fps, (delay + 0.6) * fps], [60, 0], ease)}px`,
  }}/>;
}

function PhotoCard({file, left, top, width, height, delay = 0, position = '50% 50%'}: {
  file: string;
  left: number;
  top: number;
  width: number;
  height: number;
  delay?: number;
  position?: string;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <div style={{
    position: 'absolute', left, top, width, height, overflow: 'hidden',
    background: brand.frame, boxShadow: brand.softShadow,
    opacity: interpolate(frame, [delay * fps, (delay + 0.18) * fps], [0, 1], clamp),
    translate: `${interpolate(frame, [delay * fps, (delay + 0.45) * fps], [100, 0], ease)}px 0`,
  }}><Img src={photo(file)} style={{
    width: '100%', height: '100%', objectFit: 'cover', objectPosition: position,
    scale: interpolate(frame, [0, 4 * fps], [1, 1.065], clamp),
  }}/></div>;
}

function Annotation({text, left, top, targetX, targetY}: {
  text: string;
  left: number;
  top: number;
  targetX: number;
  targetY: number;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [0.5 * fps, 1.05 * fps], [0, 1], ease);
  return <div style={{position: 'absolute', inset: 0, opacity: progress}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <path d={`M ${left + 80} ${top + 55} L ${targetX} ${targetY}`} fill="none"
        stroke={brand.ink} strokeWidth={1.5} pathLength={1}
        strokeDasharray={1} strokeDashoffset={1 - progress}/>
      <circle cx={targetX} cy={targetY} r={11} fill={brand.paper} stroke={brand.ink}/>
      <circle cx={targetX} cy={targetY} r={3} fill={brand.ink}/>
    </svg>
    <div style={{position: 'absolute', left, top, background: brand.paper,
      padding: '6px 10px', fontFamily: brand.serif, fontStyle: 'italic', fontSize: 31}}>{text}</div>
  </div>;
}

function ChapterLabel({number, name, focus}: {number: string; name: string; focus: string}) {
  return <>
    <div style={{position: 'absolute', top: 155, left: 70, right: 70, textAlign: 'center',
      fontSize: 22, letterSpacing: 4, color: brand.muted}}>{number} / THE SMART CASUAL SHORTLIST</div>
    <EditorialTitle top={245} size={69}>{name}<br/><i>{focus}</i></EditorialTitle>
  </>;
}

function Opening() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <>
    <EditorialTitle size={79}>3 places for<br/><i>refined smart casual.</i></EditorialTitle>
    <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 100%',
      scale: interpolate(frame, [0, timing.hook.seconds * fps], [1, 1.035], clamp)}}>
      <Figure file="suit-pattern-cut.png" left={-155} height={1320} monochrome/>
      <Figure file="ralph-knit-2-cut.png" left={435} height={1330} delay={0.12}/>
    </div>
  </>;
}

function Tailoring() {
  return <>
    <ChapterLabel number="01" name="SUITSUPPLY" focus="Start with the silhouette."/>
    <Figure file="suit-pattern-cut.png" left={220} height={1370}/>
    <PhotoCard file="suit-casual.jpg" left={65} top={1110} width={315} height={430} delay={0.8}/>
    <Annotation text="a clean shoulder line" left={60} top={700} targetX={740} targetY={1070}/>
    <div style={{position: 'absolute', top: 1660, left: 70, background: brand.paper,
      padding: '15px 20px', fontSize: 30, fontFamily: brand.serif, fontStyle: 'italic'}}>
      Tailored jackets. Relaxed layers.
    </div>
  </>;
}

function Knitwear() {
  return <>
    <ChapterLabel number="02" name="RALPH LAUREN" focus="Build with texture."/>
    <PhotoCard file="ralph-knit-2.jpg" left={80} top={535} width={660} height={1120} position="50% 30%"/>
    <PhotoCard file="knit-detail.jpg" left={650} top={1010} width={355} height={440} delay={0.65}/>
    <Annotation text="cable-knit texture" left={610} top={760} targetX={820} targetY={1230}/>
    <div style={{position: 'absolute', top: 1740, left: 80, right: 80, textAlign: 'center',
      fontFamily: brand.serif, fontStyle: 'italic', fontSize: 39}}>Knitwear gives simple layers depth.</div>
  </>;
}

function Trousers() {
  return <>
    <ChapterLabel number="03" name="PINI PARMA" focus="Keep the palette calm."/>
    <Figure file="pini-hero-cut.png" left={-85} height={1390}/>
    <PhotoCard file="pini-trousers.jpg" left={670} top={660} width={335} height={700} delay={0.25} position="50% 12%"/>
    <PhotoCard file="loafers-detail.jpg" left={635} top={1400} width={375} height={250} delay={0.65}/>
    <Annotation text="pleats + a higher rise" left={580} top={520} targetX={825} targetY={865}/>
    <div style={{position: 'absolute', top: 1750, left: 70, right: 70, textAlign: 'center',
      fontFamily: brand.serif, fontStyle: 'italic', fontSize: 38}}>Soft neutrals. A considered finish.</div>
  </>;
}

function BringTogether() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const files = ['suit-pattern.jpg', 'ralph-knit-2.jpg', 'pini-hero.jpg'];
  return <>
    <EditorialTitle size={79}>Good pieces.<br/><i>Now make them a look.</i></EditorialTitle>
    {files.map((file, index) => <div key={file} style={{
      position: 'absolute', left: 70 + index * 315, top: 670 + (index % 2) * 70,
      width: 300, height: 680, overflow: 'hidden', rotate: `${(index - 1) * 4}deg`,
      boxShadow: brand.softShadow,
      translate: `${interpolate(frame, [index * 0.1 * fps, (0.55 + index * 0.1) * fps], [(index - 1) * 220, 0], ease)}px 0`,
    }}><Img src={photo(file)} style={{width: '100%', height: '100%', objectFit: 'cover'}}/></div>)}
    <div style={{position: 'absolute', top: 1560, left: 80, right: 80, textAlign: 'center',
      fontFamily: brand.serif, fontStyle: 'italic', fontSize: 43}}>Your taste. Your occasion. Your day.</div>
  </>;
}

function AppOutfit() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <>
    <EditorialTitle size={75}>Find your direction.<br/><i>Create a complete look.</i></EditorialTitle>
    <div style={{position: 'absolute', top: 520, left: 285, width: 510, height: 1105,
      border: `3px solid ${brand.paleLine}`, borderRadius: 58, background: appBrand.foreground,
      boxShadow: brand.softShadow, overflow: 'hidden',
      translate: `0 ${interpolate(frame, [0, 0.55 * fps], [90, 0], ease)}px`,
      scale: interpolate(frame, [0, timing.app.seconds * fps], [0.95, 1.025], ease)}}>
      <div style={{position: 'absolute', inset: 9, borderRadius: 47, overflow: 'hidden'}}>
        <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} muted
          trimBefore={Math.round(timing.app.source * fps)} playbackRate={timing.app.rate}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
      </div>
    </div>
    <div style={{position: 'absolute', top: 1730, left: 70, right: 70, textAlign: 'center',
      fontSize: 36, fontWeight: 600, color: appBrand.accent}}>AIWardrobe <span style={{fontWeight: 400}}> / your AI stylist</span></div>
  </>;
}

export function SmartCasualShopping() {
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: brand.paper, color: brand.ink,
    fontFamily: brand.sans, overflow: 'hidden'}}>
    <Audio src={staticFile('assets/color-editorial/founder-audio-hook.wav')} volume={0.7}/>
    <Sequence name="Three places for smart casual" from={timing.hook.from * fps} durationInFrames={Math.round(timing.hook.seconds * fps)}><Opening/></Sequence>
    <Sequence name="Suitsupply — silhouette" from={Math.round(timing.tailoring.from * fps)} durationInFrames={timing.tailoring.seconds * fps}><Tailoring/></Sequence>
    <Sequence name="Ralph Lauren — texture" from={Math.round(timing.knitwear.from * fps)} durationInFrames={timing.knitwear.seconds * fps}><Knitwear/></Sequence>
    <Sequence name="Pini Parma — palette" from={Math.round(timing.trousers.from * fps)} durationInFrames={timing.trousers.seconds * fps}><Trousers/></Sequence>
    <Sequence name="Build the outfit" from={Math.round(timing.bridge.from * fps)} durationInFrames={Math.round(timing.bridge.seconds * fps)}><BringTogether/></Sequence>
    <Sequence name="AIWardrobe real outfit" from={timing.app.from * fps} durationInFrames={timing.app.seconds * fps}><AppOutfit/></Sequence>
    <Sequence name="Try AIWardrobe" from={timing.cta.from * fps} durationInFrames={timing.cta.seconds * fps}><AIWardrobeEditorialCTA/></Sequence>
  </AbsoluteFill>;
}

export {Figure as ShoppingFigure, PhotoCard as ShoppingPhotoCard, Annotation as EditorialAnnotation, AppOutfit as EditorialAppOutfit};
