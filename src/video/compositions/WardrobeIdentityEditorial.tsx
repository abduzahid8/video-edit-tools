import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {founderWardrobeBrand as b} from '../theme';
import {founderWardrobeTimeline as t} from '../timeline';

const asset = (file: string) => staticFile(`assets/founder-wardrobe/${file}`);
const easing = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.2, .82, .22, 1)} as const;
const m = (s: number, times: number[], values: number[]) => interpolate(s, times, values, easing);
const useSeconds = () => {const f = useCurrentFrame(); const {fps} = useVideoConfig(); return f / fps;};
type Person = 'jobs' | 'zuckerberg' | 'huang';
const people = {
  jobs: {name: 'Steve Jobs', company: 'APPLE CO-FOUNDER', years: '2005 / 2010', cut: 'jobs-cut.png', photo: 'jobs-secondary.jpg', detail: 'jobs-detail.jpg', label: 'Black mock neck.\nBlue jeans.', credit: 'mylerdude / Matthew Yohe', note: 'Contrast, repeated.', color: b.denim},
  zuckerberg: {name: 'Mark Zuckerberg', company: 'FACEBOOK CO-FOUNDER', years: '2016', cut: 'zuckerberg-cut.png', photo: 'zuckerberg-photo.jpg', detail: 'zuckerberg-detail.jpg', label: 'Grey tee.\nQuiet silhouette.', credit: 'Alessio Jacona', note: 'A familiar shape.', color: b.grey},
  huang: {name: 'Jensen Huang', company: 'NVIDIA CO-FOUNDER', years: '2017 / 2023', cut: 'huang-cut.png', photo: 'huang-photo.jpg', detail: 'huang-detail.jpg', label: 'Black leather.\nDistinctive texture.', credit: 'Taiwan Presidential Office / Maurizio Pesce', note: 'Texture as a signature.', color: b.black},
} as const;

function Paper() {
  return <AbsoluteFill>
    <Img src={staticFile('assets/capsule-elegant/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    <div style={{position: 'absolute', left: 540, top: 0, bottom: 0, width: 1, background: b.line, opacity: .12}}/>
  </AbsoluteFill>;
}
function Folio() {
  return <div style={{position: 'absolute', left: 85, right: 85, top: 108, display: 'flex', justifyContent: 'space-between', fontFamily: b.sans, fontSize: 19, letterSpacing: 2, color: b.muted}}>
    <span>ALTA / WARDROBE NOTES</span><span>FOUNDERS</span>
  </div>;
}
function Heading({children, y = 325, size = 80, at = 0}: {children: React.ReactNode; y?: number; size?: number; at?: number}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: 85, right: 85, top: y, textAlign: 'center', fontSize: size, lineHeight: 1.04, letterSpacing: -1.8, opacity: m(s, [at, at + .22], [0, 1]), translate: `0 ${m(s, [at, at + .5], [24, 0])}px`}}>{children}</div>;
}
function Note({children, x = 95, y = 1540, w = 890, size = 35, at = 0, align = 'center'}: {children: React.ReactNode; x?: number; y?: number; w?: number; size?: number; at?: number; align?: 'left' | 'center' | 'right'}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, width: w, fontSize: size, lineHeight: 1.2, textAlign: align, opacity: m(s, [at, at + .28], [0, 1]), translate: `0 ${m(s, [at, at + .45], [15, 0])}px`}}>{children}</div>;
}
function Photo({file, x, y, w, h, at = 0, position = '50% 45%'}: {file: string; x: number; y: number; w: number; h: number; at?: number; position?: string}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', opacity: m(s, [at, at + .18], [0, 1]), translate: `${m(s, [at, at + .55], [220, 0])}px 0`}}>
    <Img src={asset(file)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, scale: m(s, [at, at + 3.5], [1.055, 1])}}/>
  </div>;
}
function Page({children}: {children: React.ReactNode}) {
  const s = useSeconds();
  return <AbsoluteFill style={{translate: `${m(s, [0, t.overlap], [1120, 0])}px 0`}}><Paper/>{children}</AbsoluteFill>;
}
function Cover() {
  const s = useSeconds();
  const id: Person = s < .46 ? 'jobs' : s < .94 ? 'zuckerberg' : 'huang';
  const p = people[id];
  return <AbsoluteFill>
    <Heading y={320} size={78} at={-.5}>You know the look.<br/><i>Before you read the name.</i></Heading>
    <div style={{position: 'absolute', left: 280, top: 665, width: 520, height: 650, overflow: 'hidden', scale: m(s, [0, 3.4], [1, 1.035])}}>
      <Img src={asset(p.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: id === 'jobs' ? '35% 45%' : '55% 45%'}}/>
    </div>
    <Note y={1370} size={38} at={-.3}><i>{p.name}</i></Note>
    <Note y={1530} size={30} at={1.35}>Three founders. Three recognizable wardrobes.</Note>
  </AbsoluteFill>;
}

function FounderChapter({id, number}: {id: Person; number: string}) {
  const s = useSeconds();
  const p = people[id];
  const second = s >= 4.55;
  return <AbsoluteFill>
    <Heading y={280} size={84}>{p.name}.</Heading>
    <Note y={400} size={24} at={.15}>{p.company} / ARCHIVE {p.years}</Note>
    <div style={{position: 'absolute', left: 92, top: 585, fontSize: 190, color: b.line, opacity: .35}}>{number}</div>
    <div style={{position: 'absolute', left: 90, top: id === 'jobs' ? 500 : 580, width: id === 'huang' ? 530 : 590, height: id === 'jobs' ? 1090 : 970, translate: `${m(s, [0, .65, 2.25, 2.95], [-820, 0, 0, id === 'huang' ? -25 : -85])}px 0`, scale: m(s, [2.25, 3.15, 7.2], [1, 1.055, 1.075]), transformOrigin: '50% 80%'}}>
      <Img src={asset(p.cut)} style={{width: '100%', height: '100%', objectFit: 'contain', objectPosition: '50% 100%'}}/>
    </div>
    <div style={{position: 'absolute', inset: 0, opacity: m(s, [1.7, 1.95], [0, 1])}}>
      <Photo file={second ? p.detail : id === 'huang' ? 'huang-secondary.jpg' : p.photo} x={630} y={730} w={350} h={440} at={1.7} position={id === 'jobs' && !second ? '25% 40%' : '55% 45%'}/>
      <Note x={645} y={1220} w={325} align="left" size={39} at={2.1}>{p.label.split('\n').map((line, i) => <React.Fragment key={line}>{i > 0 ? <br/> : null}{i === 0 ? line : <i>{line}</i>}</React.Fragment>)}</Note>
      <div style={{position: 'absolute', left: 645, top: 1370, width: m(s, [2.4, 3], [0, 270]), height: 1, background: b.line}}/>
      <div style={{position: 'absolute', left: 645, top: 1410, width: 44, height: 44, borderRadius: '50%', background: p.color, scale: m(s, [3.05, 3.4], [0, 1])}}/>
      <Note x={710} y={1412} w={255} size={24} align="left" at={3.1}>{second ? 'A closer look.' : 'Photographic study.'}</Note>
    </div>
    <Note y={1640} size={38} at={3.25}><i>{p.note}</i></Note>
    <Note y={1760} size={21} at={.5}>Photo: {p.credit} / Wikimedia Commons</Note>
  </AbsoluteFill>;
}
function Jobs() {return <FounderChapter id="jobs" number="01"/>;}
function Zuckerberg() {return <FounderChapter id="zuckerberg" number="02"/>;}
function Huang() {return <FounderChapter id="huang" number="03"/>;}

function Principle() {
  const s = useSeconds();
  return <AbsoluteFill>
    <Heading y={755} size={85}>The common thread?<br/><i>A clear point of view.</i></Heading>
    <div style={{position: 'absolute', left: 275, top: 1095, height: 1, width: m(s, [.45, 1.1], [0, 530]), background: b.line}}/>
  </AbsoluteFill>;
}
function Compare() {
  const s = useSeconds();
  return <AbsoluteFill>
    <Heading y={320} size={78}>Different clothes.<br/><i>The same sense of identity.</i></Heading>
    {(['jobs', 'zuckerberg', 'huang'] as const).map((id, i) => {
      const p = people[id];
      return <div key={id} style={{position: 'absolute', left: 85 + i * 315, top: 650, width: 280, height: 840, translate: `0 ${m(s, [.05 + i * .12, .65 + i * .12], [750, 0])}px`}}>
        <div style={{position: 'absolute', inset: '0 0 170px', overflow: 'hidden', background: b.archive}}>
          <Img src={asset(p.detail)} style={{width: '100%', height: '100%', objectFit: 'cover', scale: m(s, [1.2, 4.2], [1, 1.06])}}/>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontSize: 32}}>{['Jobs', 'Zuckerberg', 'Huang'][i]}</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 755, textAlign: 'center', fontSize: 25, color: b.muted}}>{['Contrast', 'Simplicity', 'Texture'][i]}</div>
      </div>;
    })}
    <Note y={1600} at={1.25} size={35}>What would make a wardrobe <i>recognizably yours?</i></Note>
  </AbsoluteFill>;
}
function Formula() {
  const s = useSeconds();
  return <AbsoluteFill>
    <Heading y={350} size={80}>Borrow the principle.<br/><i>Build your own formula.</i></Heading>
    {[{label: '01 / BASE', text: 'A colour you return to.', color: b.black}, {label: '02 / DETAIL', text: 'A texture with character.', color: b.denim}, {label: '03 / REPEAT', text: 'A shape that feels like you.', color: b.grey}].map((row, i) => <div key={row.label} style={{position: 'absolute', left: 175, top: 760 + i * 205, width: 730, height: 170, opacity: m(s, [.1 + i * .4, .4 + i * .4], [0, 1]), translate: `${m(s, [.1 + i * .4, .65 + i * .4], [150, 0])}px 0`}}>
      <div style={{position: 'absolute', top: 10, left: 0, width: 78, height: 78, borderRadius: '50%', background: row.color}}/>
      <div style={{position: 'absolute', top: 5, left: 125, fontFamily: b.sans, fontSize: 22, letterSpacing: 2, color: b.muted}}>{row.label}</div>
      <div style={{position: 'absolute', top: 55, left: 125, fontSize: 37}}>{row.text}</div>
      <div style={{position: 'absolute', left: 125, right: 0, top: 135, height: 1, background: b.line}}/>
    </div>)}
    <Note y={1540} at={1.6} size={35}>Identity first. <i>The wardrobe follows.</i></Note>
  </AbsoluteFill>;
}
function Close() {
  const s = useSeconds();
  return <AbsoluteFill>
    <Heading y={330} size={80}>Make it recognizable.<br/><i>Make it yours.</i></Heading>
    <div style={{position: 'absolute', left: 150, top: 685, width: 780, height: 660, display: 'flex', gap: 18}}>
      {(['jobs', 'zuckerberg', 'huang'] as const).map((id, i) => <div key={id} style={{width: 248, height: 610, overflow: 'hidden', translate: `0 ${m(s, [.05 + i * .1, .65 + i * .1], [220, 0])}px`, opacity: m(s, [.05 + i * .1, .3 + i * .1], [0, 1])}}><Img src={asset(people[id].photo)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: id === 'jobs' ? '40% 50%' : '55% 50%'}}/></div>)}
    </div>
    <Note y={1430} size={40} at={.75}>A wardrobe for who you are.<br/><i>And who you’re becoming.</i></Note>
    <Note y={1700} size={23} at={1.7}>ALTA / STYLE WITH INTENTION</Note>
  </AbsoluteFill>;
}
function Credits() {
  return <AbsoluteFill>
    <Heading y={480} size={65} at={-.5}>Photography & archive</Heading>
    <Note y={730} size={32} at={-.5}>Steve Jobs: mylerdude · Matthew Yohe<br/><br/>Mark Zuckerberg: Alessio Jacona<br/><br/>Jensen Huang: Taiwan Presidential Office · Maurizio Pesce</Note>
    <Note y={1230} size={27} at={-.5}>Source photographs: Wikimedia Commons<br/>CC BY 2.0 · CC BY-SA 2.0 / 3.0<br/><br/>Cropped, isolated and animated for this editorial.<br/>Adaptation: CC BY-SA 4.0</Note>
  </AbsoluteFill>;
}

export function WardrobeIdentityEditorial() {
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: b.paper, color: b.ink, fontFamily: b.serif, overflow: 'hidden'}}>
    <Paper/>
    <Audio src={asset('narration.wav')} volume={1.5}/>
    <Audio src={asset('paper-foley.wav')} volume={.8}/>
    <Sequence name="Three founders — photographic hook" from={0} durationInFrames={Math.round((t.cover.seconds + t.overlap) * fps)}><Cover/></Sequence>
    <Sequence name="Steve Jobs — black mock neck and blue jeans" from={Math.round(t.jobs.from * fps)} durationInFrames={Math.round((t.jobs.from + t.jobs.seconds + t.overlap) * fps) - Math.round(t.jobs.from * fps)}><Page><Jobs/></Page></Sequence>
    <Sequence name="Mark Zuckerberg — the grey tee, archive 2016" from={Math.round(t.zuckerberg.from * fps)} durationInFrames={Math.round((t.zuckerberg.from + t.zuckerberg.seconds + t.overlap) * fps) - Math.round(t.zuckerberg.from * fps)}><Page><Zuckerberg/></Page></Sequence>
    <Sequence name="Jensen Huang — leather as a signature" from={Math.round(t.huang.from * fps)} durationInFrames={Math.round((t.huang.from + t.huang.seconds + t.overlap) * fps) - Math.round(t.huang.from * fps)}><Page><Huang/></Page></Sequence>
    <Sequence name="The common thread — typography pause" from={Math.round(t.principle.from * fps)} durationInFrames={Math.round((t.principle.seconds + t.overlap) * fps)}><Page><Principle/></Page></Sequence>
    <Sequence name="Three photographic details" from={Math.round(t.compare.from * fps)} durationInFrames={Math.round((t.compare.seconds + t.overlap) * fps)}><Page><Compare/></Page></Sequence>
    <Sequence name="Build your own formula" from={Math.round(t.formula.from * fps)} durationInFrames={Math.round((t.formula.seconds + t.overlap) * fps)}><Page><Formula/></Page></Sequence>
    <Sequence name="Founder contact strip — make it yours" from={Math.round(t.close.from * fps)} durationInFrames={Math.round((t.close.seconds + t.overlap) * fps)}><Page><Close/></Page></Sequence>
    <Sequence name="Photography credits" from={Math.round(t.credits.from * fps)} durationInFrames={Math.round(t.credits.seconds * fps)}><Page><Credits/></Page></Sequence>
    <Folio/>
  </AbsoluteFill>;
}
