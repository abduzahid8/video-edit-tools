import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ralphLaurenEditorialBrand as b} from '../theme';
import {ralphLaurenKineticTimeline as t} from '../timeline';

const asset = (file: string) => staticFile(`assets/ralph-lauren-editorial/${file}`);
const smooth = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.2, .8, .2, 1)} as const;
const linear = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (seconds: number, times: number[], values: number[]) => interpolate(seconds, times, values, smooth);
const useSeconds = () => {const frame = useCurrentFrame(); const {fps} = useVideoConfig(); return frame / fps;};

function Background({color = b.paper, texture = true}: {color?: string; texture?: boolean}) {
  return <AbsoluteFill style={{background: color}}>
    {texture && <Img src={staticFile('assets/capsule-elegant/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: .26, mixBlendMode: 'multiply'}}/>}
  </AbsoluteFill>;
}

function Folio({number, seconds, dark = false}: {number: number; seconds: number; dark?: boolean}) {
  const s = useSeconds();
  const color = dark ? b.cream : b.muted;
  return <>
    <div style={{position: 'absolute', left: 76, right: 76, top: 82, display: 'flex', justifyContent: 'space-between', fontFamily: b.sans, fontSize: 20, letterSpacing: 2.2, color}}>
      <span>ALTA / STYLE NOTES</span><span>{String(number).padStart(2, '0')} / 16</span>
    </div>
    <div style={{position: 'absolute', left: 76, right: 76, bottom: 86, height: 1, background: color, opacity: .47}}/>
    <div style={{position: 'absolute', left: 76, bottom: 85, height: 3, width: 928 * Math.min(1, s / seconds), background: dark ? b.cream : b.sepia}}/>
    <div style={{position: 'absolute', left: 76, bottom: 45, fontFamily: b.sans, fontSize: 18, letterSpacing: 1.3, color}}>RALPH LAUREN / AN INDEPENDENT EDITORIAL</div>
  </>;
}

function Stage({children, number, seconds, color, dark = false, enter = 'cut'}: {children: React.ReactNode; number: number; seconds: number; color?: string; dark?: boolean; enter?: 'cut' | 'slide' | 'fade'}) {
  const s = useSeconds();
  const x = enter === 'slide' ? ease(s, [0, .24], [94, 0]) : 0;
  const alpha = enter === 'fade' ? ease(s, [0, .18], [0, 1]) : 1;
  return <AbsoluteFill style={{overflow: 'hidden', translate: `${x}px 0`, opacity: alpha, color: dark ? b.cream : b.ink}}>
    <Background color={color} texture={!dark}/>{children}<Folio number={number} seconds={seconds} dark={dark}/>
  </AbsoluteFill>;
}

function RiseText({children, x = 80, y, width = 920, size, at = .08, font = b.serif, italic = false, align = 'center', color}: {children: React.ReactNode; x?: number; y: number; width?: number; size: number; at?: number; font?: string; italic?: boolean; align?: 'left' | 'center' | 'right'; color?: string}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, width, overflow: 'hidden', textAlign: align, fontFamily: font, fontSize: size, fontStyle: italic ? 'italic' : 'normal', letterSpacing: font === b.serif ? -2 : 1.8, lineHeight: 1.08, color,
    opacity: ease(s, [at, at + .11], [0, 1]), translate: `0 ${ease(s, [at, at + .34], [37, 0])}px`}}>{children}</div>;
}

function Hairline({x, y, width, at = .35, color = b.line}: {x: number; y: number; width: number; at?: number; color?: string}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, width: ease(s, [at, at + .38], [0, width]), height: 2, background: color}}/>;
}

type PhotoEntry = 'rise' | 'left' | 'right' | 'zoom' | 'stamp';
function WholePhoto({file, x, y, w, h, at = .12, seconds, entry = 'rise', rotate = 0}: {file: string; x: number; y: number; w: number; h: number; at?: number; seconds: number; entry?: PhotoEntry; rotate?: number}) {
  const s = useSeconds();
  const startX = entry === 'left' ? -90 : entry === 'right' ? 90 : 0;
  const startY = entry === 'rise' ? 100 : entry === 'stamp' ? -90 : 0;
  const startScale = entry === 'zoom' ? .85 : entry === 'stamp' ? 1.15 : 1;
  const endX = entry === 'left' ? 21 : entry === 'right' ? -21 : 0;
  const opacity = ease(s, [at, at + .13], [0, 1]);
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity,
    translate: `${ease(s, [at, at + .4, seconds], [startX, 0, endX])}px ${ease(s, [at, at + .4, seconds], [startY, 0, -17])}px`,
    scale: ease(s, [at, at + .38, seconds], [startScale, 1, 1.025]),
    rotate: `${ease(s, [at, at + .4, seconds], [rotate, 0, rotate * -.18])}deg`,
    background: b.cream, boxShadow: '0 21px 45px rgba(29,31,26,.15)', border: '1px solid rgba(31,33,29,.12)', boxSizing: 'border-box'}}>
    <Img src={asset(file)} style={{display: 'block', width: '100%', height: '100%', objectFit: 'contain'}}/>
  </div>;
}

function Tag({children, x, y, at = .62, color = b.sepia}: {children: React.ReactNode; x: number; y: number; at?: number; color?: string}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: b.sans, fontSize: 23, letterSpacing: 3, color,
    opacity: ease(s, [at, at + .13], [0, 1]), translate: `${ease(s, [at, at + .28], [-24, 0])}px 0`}}>{children}</div>;
}

type PhotoBeatData = {file: string; title: string; tag: string; caption: string; x: number; y: number; w: number; h: number; entry: PhotoEntry; color?: string; side?: 'left' | 'right'; accent?: string; rotate?: number; headingSize?: number};
const photos: Record<string, PhotoBeatData> = {
  ties: {file: '02-ties.jpg', title: '1967', tag: 'THE FIRST TIES', caption: 'The story begins with one detail.', x: 75, y: 635, w: 930, h: 698, entry: 'stamp', accent: b.sepia, headingSize: 130},
  boutique: {file: '03-boutique.png', title: 'A NEW IDEA', tag: 'AN ARCHIVE MOMENT', caption: 'A small beginning. A bigger ambition.', x: 250, y: 565, w: 580, h: 863, entry: 'rise', accent: b.sepia, headingSize: 84},
  polo: {file: '04-polo-blue.jpg', title: '1972', tag: 'THE POLO SHIRT', caption: 'Sporting ease enters the everyday.', x: 190, y: 620, w: 700, h: 700, entry: 'zoom', accent: b.blue, headingSize: 130},
  horse: {file: '05-horse.jpg', title: 'A WAY OF LIFE', tag: 'POLO RALPH LAUREN', caption: 'A world beyond the shirt.', x: 245, y: 575, w: 590, h: 710, entry: 'right', accent: b.blue, headingSize: 77},
  campus: {file: '06-collegiate.jpg', title: 'PREP', tag: 'POLO / CAMPUS', caption: 'The campus.', x: 435, y: 640, w: 580, h: 725, entry: 'right', side: 'left', accent: b.blue, headingSize: 85},
  country: {file: '07-fall-coat.jpg', title: 'COUNTRY', tag: 'POLO / THE COUNTRY HOUSE', caption: 'The country house.', x: 65, y: 635, w: 590, h: 769, entry: 'left', side: 'right', accent: b.sepia, headingSize: 60},
  truck: {file: '08-western-truck.jpg', title: '1993', tag: 'DOUBLE RL', caption: 'The open road.', x: 65, y: 650, w: 950, h: 634, entry: 'left', color: b.paperDeep, accent: b.oxblood, headingSize: 130},
  tweed: {file: '09-rrl-tweed.jpg', title: 'WESTERN', tag: 'DOUBLE RL / HERITAGE', caption: 'Tradition, worn in.', x: 235, y: 570, w: 610, h: 753, entry: 'stamp', color: b.paperDeep, accent: b.sepia, headingSize: 96},
  denim: {file: '10-rrl-denim.jpg', title: 'DENIM', tag: 'DOUBLE RL / WORKWEAR', caption: 'Workwear with character.', x: 250, y: 565, w: 580, h: 757, entry: 'rise', color: b.paleBlue, accent: b.blue, headingSize: 105},
  purpleOne: {file: '11-purple-suit.jpg', title: '1995', tag: 'PURPLE LABEL', caption: 'Precision.', x: 255, y: 575, w: 570, h: 855, entry: 'left', color: b.paleOlive, accent: b.blue, headingSize: 130},
  purpleTwo: {file: '12-purple-riviera.webp', title: 'RIVIERA', tag: 'PURPLE LABEL', caption: 'Ease.', x: 255, y: 575, w: 570, h: 855, entry: 'zoom', color: b.paleOlive, accent: b.blue, headingSize: 94},
  purpleThree: {file: '13-purple-waistcoat.jpg', title: 'TAILORING', tag: 'PURPLE LABEL', caption: 'Detail.', x: 255, y: 575, w: 570, h: 855, entry: 'right', color: b.paleOlive, accent: b.blue, headingSize: 91},
};

function PhotoBeat({id, number, seconds}: {id: string; number: number; seconds: number}) {
  const data = photos[id];
  const sideX = data.side === 'left' ? 76 : 670;
  const sideW = data.side === 'right' ? 350 : 310;
  return <Stage number={number} seconds={seconds} color={data.color} enter={number % 3 === 0 ? 'slide' : 'cut'}>
    {data.side ? <>
      <Tag x={sideX} y={534} at={.18} color={data.accent}>{data.tag}</Tag>
      <RiseText x={sideX} y={774} width={sideW} size={data.headingSize ?? 90} at={.25} align="left">{data.title}</RiseText>
      <Hairline x={sideX} y={972} width={272} at={.54} color={data.accent}/>
      <RiseText x={sideX} y={1020} width={sideW} size={35} at={.72} italic align="left">{data.caption}</RiseText>
    </> : <>
      <RiseText y={243} size={data.headingSize ?? 100} at={.12}>{data.title}</RiseText>
      <Tag x={315} y={420} at={.35} color={data.accent}>{data.tag}</Tag>
      <Hairline x={225} y={1450} width={630} at={.55} color={data.accent}/>
      <RiseText y={1503} size={38} at={.75} italic>{data.caption}</RiseText>
    </>}
    {id.startsWith('purple') && <div style={{position: 'absolute', left: number % 2 === 0 ? 103 : 944, top: 565, width: 12, height: 865, background: b.navy, opacity: .82}}/>}
    <WholePhoto file={data.file} x={data.x} y={data.y} w={data.w} h={data.h} at={.16} seconds={seconds} entry={data.entry} rotate={data.rotate}/>
  </Stage>;
}

function Cover() {
  return <Stage number={1} seconds={2} enter="cut">
    <RiseText y={241} size={75} at={.06}>What makes</RiseText>
    <RiseText y={330} size={87} at={.2} italic>Ralph Lauren</RiseText>
    <RiseText y={437} size={77} at={.35}>unmistakable?</RiseText>
    <Hairline x={230} y={591} width={620} at={.47}/>
    <WholePhoto file="01-early-portrait.png" x={215} y={640} w={650} h={654} at={.38} seconds={2} entry="zoom"/>
    <RiseText y={1390} size={33} at={.92} italic>One clear point of view.</RiseText>
  </Stage>;
}

function Idea() {
  const s = useSeconds();
  return <Stage number={4} seconds={1.3} color={b.navy} dark enter="fade">
    <div style={{position: 'absolute', left: 0, right: 0, top: 490, textAlign: 'center', fontFamily: b.serif, fontSize: 255, letterSpacing: -15, color: b.cream, opacity: ease(s, [0, .4, 1.3], [0, .08, .15]), scale: ease(s, [0, 1.3], [.85, 1.17])}}>WORLD</div>
    <RiseText y={720} size={99} at={.08} color={b.cream}>A tie became</RiseText>
    <RiseText y={845} size={106} at={.35} color={b.cream} italic>a world.</RiseText>
    <Hairline x={302} y={1090} width={476} at={.57} color={b.cream}/>
  </Stage>;
}

function PointOfView() {
  return <Stage number={15} seconds={1.8} color={b.paper} enter="slide">
    <RiseText y={225} size={79} at={.06}>Different clothes.</RiseText>
    <RiseText y={323} size={81} at={.26} italic>One point of view.</RiseText>
    <WholePhoto file="14-purple-pair.jpg" x={245} y={585} w={590} h={885} at={.19} seconds={1.8} entry="zoom"/>
    <Hairline x={260} y={1524} width={560} at={.7}/>
    <Tag x={330} y={1580} at={.83} color={b.blue}>A WORLD YOU CAN WEAR</Tag>
  </Stage>;
}

function Close() {
  const s = useSeconds();
  const years = [1967, 1972, 1993, 1995];
  return <Stage number={16} seconds={2.8} color={b.navy} dark enter="fade">
    <RiseText y={575} size={105} at={.08} color={b.cream}>Ralph Lauren</RiseText>
    <RiseText y={711} size={92} at={.39} italic color={b.cream}>A world you can wear.</RiseText>
    <Hairline x={292} y={927} width={496} at={.72} color={b.cream}/>
    <div style={{position: 'absolute', left: 166, right: 166, top: 1205, display: 'flex', justifyContent: 'space-between'}}>
      {years.map((year, index) => <span key={year} style={{fontFamily: b.serif, fontSize: 42, color: b.cream, opacity: ease(s, [.72 + index * .37, .94 + index * .37], [.22, 1])}}>{year}</span>)}
    </div>
    <div style={{position: 'absolute', left: ease(s, [.88, 1.25, 1.62, 1.99], [165, 344, 523, 702]), top: 1277, width: 100, height: 3, background: b.cream}}/>
    <RiseText y={1510} size={22} at={1.33} color={b.cream} font={b.sans}>ALTA / INDEPENDENT FASHION EDITORIAL</RiseText>
    <RiseText y={1630} size={18} at={1.72} color={b.cream} font={b.sans}>IMAGES: VANITY FAIR · RTVE · MODELS.COM · TAGWALK · FLAUNT · BRADEN STUDIO · MEN'S FOLIO</RiseText>
  </Stage>;
}

function Beat({id, number, seconds}: {id: string; number: number; seconds: number}) {
  if (id === 'cover') return <Cover/>;
  if (id === 'idea') return <Idea/>;
  if (id === 'pointOfView') return <PointOfView/>;
  if (id === 'close') return <Close/>;
  return <PhotoBeat id={id} number={number} seconds={seconds}/>;
}

export function RalphLaurenEditorialV7() {
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: b.paper, overflow: 'hidden'}}>
    {t.beats.map((beat, index) => <Sequence key={beat.id} name={beat.id} from={Math.round(beat.from * fps)} durationInFrames={Math.min(Math.round(t.duration * fps) - Math.round(beat.from * fps), Math.round((beat.seconds + (index < t.beats.length - 1 ? t.overlap : 0)) * fps))}>
      <Beat id={beat.id} number={index + 1} seconds={beat.seconds}/>
    </Sequence>)}
    <Audio src={asset('narration-v7.wav')} volume={1.25}/>
    <Audio src={asset('score-v7.wav')} volume={.2}/>
  </AbsoluteFill>;
}
