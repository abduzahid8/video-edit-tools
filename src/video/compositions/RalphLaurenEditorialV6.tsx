import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ralphLaurenEditorialBrand as b} from '../theme';
import {ralphLaurenFastTimeline as t} from '../timeline';

const asset = (name: string) => staticFile(`assets/ralph-lauren-editorial/${name}`);
const smooth = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.18, .8, .24, 1)} as const;
const plain = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const n = (second: number, times: number[], values: number[]) => interpolate(second, times, values, smooth);
const useSeconds = () => {const frame = useCurrentFrame(); const {fps} = useVideoConfig(); return frame / fps;};
type Language = 'en' | 'ru';
const LanguageContext = React.createContext<Language>('en');
const useLanguage = () => React.useContext(LanguageContext);
const copy = {
  en: {
    folio: 'ALTA / STYLE NOTES', footer: 'RALPH LAUREN / INDEPENDENT EDITORIAL',
    cover1: 'What makes', cover2: 'Ralph Lauren', cover3: 'recognizable?', coverCaption1: 'More than a look.', coverCaption2: 'A point of view.',
    tieSubtitle: 'IT STARTED WITH A TIE', tie1: 'Wider.', tie2: 'Bolder.', tieCallout: 'THE ORIGINAL TIE',
    ideaGhost: 'WORLD', idea1: 'One piece.', idea2: 'A bigger world.', ideaCaption: 'Clothes became a way of seeing.',
    poloSubtitle: 'THE POLO SHIRT', polo1: 'Sporting ease.', polo2: 'Everyday elegance.',
    worldTitle: 'A whole world.', worldSubtitle: 'PREP / TAILORING / THE OPEN AIR', world1: 'The campus.', world2: 'The country house.',
    rrlSubtitle: 'DOUBLE RL / THE WEST', rrl1: 'The open road.', rrl2: 'DENIM / WORKWEAR / TEXTURE',
    purpleSubtitle: 'PURPLE LABEL / REFINED TAILORING', purple1: 'Precision.', purple2: 'Ease.', purple3: 'Detail.',
    vision1: 'Different clothes.', vision2: 'One vision.', visionCaption: 'An unmistakable point of view.',
    close1: 'Ralph Lauren', close2: 'A world you can wear.', closeCaption: 'An independent ALTA fashion editorial.',
    credits1: 'IMAGES: VANITY FAIR · RTVE · MODELS.COM · TAGWALK', credits2: 'FLAUNT · BRADEN STUDIO · MEN\'S FOLIO',
  },
  ru: {
    folio: 'ALTA / ЗАМЕТКИ О СТИЛЕ', footer: 'РАЛЬФ ЛОРЕН / НЕЗАВИСИМЫЙ ФИЛЬМ О СТИЛЕ',
    cover1: 'Что делает', cover2: 'Ральфа Лорена', cover3: 'узнаваемым?', coverCaption1: 'Больше, чем образ.', coverCaption2: 'Свой взгляд на стиль.',
    tieSubtitle: 'ВСЁ НАЧАЛОСЬ С ГАЛСТУКА', tie1: 'Шире.', tie2: 'Смелее.', tieCallout: 'ПЕРВЫЙ ГАЛСТУК',
    ideaGhost: 'МИР', idea1: 'Одна вещь.', idea2: 'И целый мир.', ideaCaption: 'Одежда стала способом видеть мир.',
    poloSubtitle: 'РУБАШКА ПОЛО', polo1: 'Лёгкость спорта.', polo2: 'Элегантность на каждый день.',
    worldTitle: 'Целый мир.', worldSubtitle: 'ПРЕППИ / КРОЙ / СВОБОДА', world1: 'Кампус.', world2: 'Загородный дом.',
    rrlSubtitle: 'DOUBLE RL / ДУХ ЗАПАДА', rrl1: 'Открытая дорога.', rrl2: 'ДЕНИМ / РАБОЧАЯ ОДЕЖДА / ФАКТУРА',
    purpleSubtitle: 'PURPLE LABEL / ТОЧНЫЙ КРОЙ', purple1: 'Точность.', purple2: 'Свобода.', purple3: 'Деталь.',
    vision1: 'Разные вещи.', vision2: 'Один взгляд.', visionCaption: 'Узнаваемый взгляд на стиль.',
    close1: 'Ральф Лорен', close2: 'Мир, который можно носить.', closeCaption: 'Независимый фильм о стиле от ALTA.',
    credits1: 'ФОТО: VANITY FAIR · RTVE · MODELS.COM · TAGWALK', credits2: 'FLAUNT · BRADEN STUDIO · MEN\'S FOLIO',
  },
} as const;
const useCopy = () => copy[useLanguage()];

function Paper() {
  return <AbsoluteFill style={{background: b.paper}}>
    <Img src={staticFile('assets/capsule-elegant/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: .5}}/>
    <div style={{position: 'absolute', inset: 0, background: 'rgba(239,238,233,.42)'}}/>
  </AbsoluteFill>;
}

function Folio({number, seconds}: {number: number; seconds: number}) {
  const s = useSeconds();
  const c = useCopy();
  return <>
    <div style={{position: 'absolute', left: 84, right: 84, top: 88, display: 'flex', justifyContent: 'space-between', fontFamily: b.sans, fontSize: 18, color: b.muted, letterSpacing: 2.2}}>
      <span>{c.folio}</span><span>{String(number).padStart(2, '0')} / 09</span>
    </div>
    <div style={{position: 'absolute', left: 84, right: 84, bottom: 92, height: 1, background: b.line}}/>
    <div style={{position: 'absolute', left: 84, bottom: 91, width: 912 * Math.min(1, s / seconds), height: 3, background: b.sepia}}/>
    <div style={{position: 'absolute', left: 84, bottom: 50, fontFamily: b.sans, fontSize: 18, letterSpacing: 1.25, color: b.muted}}>{c.footer}</div>
  </>;
}

type PageMode = 'slide' | 'lift' | 'dissolve';
function Page({children, number, seconds, mode, direction = 1, first = false}: {children: React.ReactNode; number: number; seconds: number; mode: PageMode; direction?: number; first?: boolean}) {
  const s = useSeconds();
  const intro = first ? 1 : n(s, [0, t.pageSeconds], [0, 1]);
  const outro = n(s, [seconds, seconds + t.pageSeconds], [0, 1]);
  const x = mode === 'slide' ? direction * (1 - intro) * 1080 - direction * outro * 78 : -direction * outro * 78;
  const y = mode === 'lift' ? (1 - intro) * 240 : 0;
  const alpha = (mode === 'dissolve' ? intro : 1) * (1 - outro * .16);
  const scale = mode === 'dissolve' ? n(s, [0, t.pageSeconds], [1.02, 1]) : 1;
  return <AbsoluteFill style={{translate: `${x}px ${y}px`, opacity: alpha, scale, overflow: 'hidden', color: b.ink,
    boxShadow: mode === 'lift' ? '0 -24px 46px rgba(24,26,22,.13)' : `${-direction * 18}px 0 38px rgba(24,26,22,.11)`}}>
    <Paper/>{children}<Folio number={number} seconds={seconds}/>
  </AbsoluteFill>;
}

function Headline({children, y, size = 80, at = .28, italic = false}: {children: React.ReactNode; y: number; size?: number; at?: number; italic?: boolean}) {
  const s = useSeconds();
  const lang = useLanguage();
  return <div style={{position: 'absolute', left: 90, right: 90, top: y, textAlign: 'center', fontFamily: lang === 'ru' ? b.body : b.serif, fontSize: size, lineHeight: 1.07,
    fontStyle: italic ? 'italic' : 'normal', letterSpacing: -1.8, opacity: n(s, [at, at + .16], [0, 1]), translate: `0 ${n(s, [at, at + .38], [32, 0])}px`}}>{children}</div>;
}

function WordStrip({children, y, size, at, italic = false}: {children: React.ReactNode; y: number; size: number; at: number; italic?: boolean}) {
  const s = useSeconds();
  const lang = useLanguage();
  return <div style={{position: 'absolute', left: 70, right: 70, top: y, height: size * 1.2, overflow: 'hidden', textAlign: 'center'}}>
    <div style={{fontFamily: lang === 'ru' ? b.body : b.serif, fontSize: size, lineHeight: 1.1, letterSpacing: -2, fontStyle: italic ? 'italic' : 'normal',
      opacity: n(s, [at, at + .13], [0, 1]), translate: `0 ${n(s, [at, at + .42], [size * 1.1, 0])}px`}}>{children}</div>
  </div>;
}

function Caption({children, y, at, until, size = 31, width = 900, x = 90, align = 'center'}: {children: React.ReactNode; y: number; at: number; until: number; size?: number; width?: number; x?: number; align?: 'left' | 'center' | 'right'}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, width, textAlign: align, fontFamily: b.body, fontSize: size, lineHeight: 1.2, color: b.ink,
    opacity: n(s, [at, at + .17, until - .2, until], [0, 1, 1, 0]), translate: `0 ${n(s, [at, at + .4], [20, 0])}px`}}>{children}</div>;
}

function Rule({x, y, width, at, seconds = .42}: {x: number; y: number; width: number; at: number; seconds?: number}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, height: 1, width: n(s, [at, at + seconds], [0, width]), background: b.line}}/>;
}

type PhotoMotion = 'left' | 'right' | 'rise' | 'zoom' | 'none';
function Photo({file, x, y, w, h, at = .4, until, motion = 'rise', exit = 'none', travel = 125}: {file: string; x: number; y: number; w: number; h: number; at?: number; until: number; motion?: PhotoMotion; exit?: 'none' | 'left' | 'right' | 'up'; travel?: number}) {
  const s = useSeconds();
  const enterX = motion === 'left' ? -travel : motion === 'right' ? travel : 0;
  const enterY = motion === 'rise' ? 105 : 0;
  const exitX = exit === 'left' ? -900 : exit === 'right' ? 900 : 0;
  const exitY = exit === 'up' ? -900 : 0;
  const exitAt = until - .42;
  const xMotion = n(s, [at, at + .42, exitAt, until], [enterX, 0, 12, exitX]);
  const yMotion = n(s, [at, at + .42, exitAt, until], [enterY, 0, -12, exitY]);
  const alpha = n(s, [at, at + .16, exitAt, until], [0, 1, 1, exit === 'none' ? 1 : 0]);
  const startScale = motion === 'zoom' ? .86 : motion === 'rise' ? .98 : 1;
  const scale = n(s, [at, at + .45, exitAt, until], [startScale, 1, 1.025, 1.025]);
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, translate: `${xMotion}px ${yMotion}px`, scale,
    opacity: alpha, background: b.cream, boxShadow: b.shadow, border: '1px solid rgba(44,44,38,.13)', boxSizing: 'border-box'}}>
    <Img src={asset(file)} style={{display: 'block', width: '100%', height: '100%', objectFit: 'contain'}}/>
  </div>;
}

function Callout({text, x, y, endX, endY, at}: {text: string; x: number; y: number; endX: number; endY: number; at: number}) {
  const s = useSeconds();
  const draw = n(s, [at, at + .45], [0, 1]);
  return <>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: n(s, [at, at + .15], [0, 1])}}>
      <path d={`M ${x} ${y + 9} L ${endX - 22} ${y + 9} L ${endX} ${endY}`} fill="none" stroke={b.ink} strokeWidth={1.4} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw}/>
      <circle cx={endX} cy={endY} r={11 * draw} stroke={b.ink} strokeWidth={1.4} fill="none"/>
    </svg>
    <div style={{position: 'absolute', left: x, top: y - 19, padding: '7px 12px', background: b.paper, fontFamily: b.sans, fontSize: 18, letterSpacing: 2,
      opacity: n(s, [at + .18, at + .4], [0, 1])}}>{text}</div>
  </>;
}

function Cover() {
  const c = useCopy();
  const lang = useLanguage();
  return <>
    <WordStrip y={245} size={80} at={.08}>{c.cover1}</WordStrip>
    <WordStrip y={336} size={lang === 'ru' ? 78 : 88} at={.25} italic>{c.cover2}</WordStrip>
    <WordStrip y={439} size={76} at={.42}>{c.cover3}</WordStrip>
    <Rule x={220} y={590} width={640} at={.52}/>
    <Photo file="01-early-portrait.png" x={202} y={650} w={676} h={680} at={.48} until={2.88} motion="zoom"/>
    <Caption y={1400} at={1.16} until={2.8} size={30}>{c.coverCaption1} <i>{c.coverCaption2}</i></Caption>
  </>;
}

function Ties() {
  const s = useSeconds();
  const c = useCopy();
  return <>
    <Headline y={212} size={134}>1967</Headline>
    <Caption y={388} at={.48} until={3.1} size={23}>{c.tieSubtitle}</Caption>
    <Rule x={140} y={502} width={800} at={.38}/>
    {[1967, 1972, 1993, 1995].map((year, i) => <div key={year} style={{position: 'absolute', left: 136 + i * 256, top: 512, fontFamily: b.sans, fontSize: 20, color: i === 0 ? b.sepia : b.muted,
      opacity: n(s, [.44 + i * .11, .65 + i * .11], [0, 1])}}>{year}</div>)}
    <Photo file="02-ties.jpg" x={90} y={590} w={900} h={675} at={.46} until={3.4} motion="rise"/>
    <Photo file="03-boutique.png" x={735} y={1305} w={240} h={357} at={1.27} until={3.4} motion="right"/>
    <Caption x={110} y={1368} width={530} align="left" at={1.6} until={3.28} size={47}><i>{c.tie1}</i><br/>{c.tie2}</Caption>
    <Callout text={c.tieCallout} x={109} y={1598} endX={374} endY={960} at={2.1}/>
  </>;
}

function Idea() {
  const s = useSeconds();
  const c = useCopy();
  const lang = useLanguage();
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 510, textAlign: 'center', fontFamily: lang === 'ru' ? b.body : b.serif, fontSize: 236, letterSpacing: -14, color: b.line,
      opacity: n(s, [.2, .75, 1.9, 2.3], [0, .22, .22, 0]), scale: n(s, [.2, 2.3], [.82, 1.13])}}>{c.ideaGhost}</div>
    <WordStrip y={748} size={90} at={.38}>{c.idea1}</WordStrip>
    <WordStrip y={861} size={91} at={.77} italic>{c.idea2}</WordStrip>
    <Rule x={245} y={1080} width={590} at={1.27}/>
    <Caption y={1135} at={1.57} until={2.28} size={29}>{c.ideaCaption}</Caption>
  </>;
}

function Polo() {
  const s = useSeconds();
  const c = useCopy();
  const lang = useLanguage();
  const track = n(s, [1.82, 2.29], [0, -1080]);
  return <>
    <Headline y={212} size={134}>1972</Headline>
    <Caption y={390} at={.46} until={4.4} size={23}>{c.poloSubtitle}</Caption>
    <div style={{position: 'absolute', inset: 0, translate: `${track}px 0`}}>
      <Photo file="04-polo-blue.jpg" x={190} y={635} w={700} h={700} at={.46} until={4.7} motion="zoom"/>
      <Photo file="05-horse.jpg" x={1330} y={635} w={580} h={698} at={.46} until={4.7} motion="none"/>
    </div>
    <Rule x={219} y={1398} width={642} at={.6}/>
    <Caption y={1450} at={.93} until={2.02} size={38}><i>{c.polo1}</i></Caption>
    <Caption y={1450} at={2.36} until={4.35} size={lang === 'ru' ? 34 : 38}><i>{c.polo2}</i></Caption>
  </>;
}

function Worlds() {
  const c = useCopy();
  return <>
    <Headline y={259} size={83}>{c.worldTitle}</Headline>
    <Caption y={402} at={.48} until={3.95} size={24}>{c.worldSubtitle}</Caption>
    <Photo file="06-collegiate.jpg" x={220} y={595} w={640} h={800} at={.47} until={2.16} motion="left" exit="left" travel={180}/>
    <Photo file="07-fall-coat.jpg" x={230} y={595} w={620} h={808} at={2.16} until={4.18} motion="right" travel={520}/>
    <Caption y={1468} at={.91} until={2.02} size={37}><i>{c.world1}</i></Caption>
    <Caption y={1468} at={2.53} until={4.01} size={37}><i>{c.world2}</i></Caption>
  </>;
}

function DoubleRL() {
  const c = useCopy();
  const lang = useLanguage();
  return <>
    <Headline y={212} size={134}>1993</Headline>
    <Caption y={390} at={.47} until={5} size={23}>{c.rrlSubtitle}</Caption>
    <Photo file="08-western-truck.jpg" x={75} y={615} w={930} h={620} at={.43} until={2.15} motion="left" exit="left" travel={170}/>
    <Photo file="09-rrl-tweed.jpg" x={85} y={655} w={440} h={544} at={2.17} until={5.16} motion="rise"/>
    <Photo file="10-rrl-denim.jpg" x={555} y={655} w={440} h={574} at={2.45} until={5.16} motion="rise"/>
    <Caption y={1387} at={.88} until={1.92} size={36}><i>{c.rrl1}</i></Caption>
    <Rule x={170} y={1337} width={740} at={3.14}/>
    <Caption y={1394} at={3.5} until={4.96} size={lang === 'ru' ? 27 : 31}>{c.rrl2}</Caption>
  </>;
}

function Purple() {
  const s = useSeconds();
  const c = useCopy();
  const track = interpolate(s, [0, 1.52, 2.02, 3.2, 3.7, 5], [0, 0, -1080, -1080, -2160, -2160], {...plain, easing: Easing.inOut(Easing.cubic)});
  return <>
    <Headline y={212} size={134}>1995</Headline>
    <Caption y={390} at={.46} until={5} size={23}>{c.purpleSubtitle}</Caption>
    <div style={{position: 'absolute', inset: 0, translate: `${track}px 0`}}>
      <Photo file="11-purple-suit.jpg" x={290} y={605} w={500} h={750} at={.45} until={5.2} motion="rise"/>
      <Photo file="12-purple-riviera.webp" x={1370} y={605} w={500} h={750} at={.45} until={5.2} motion="none"/>
      <Photo file="13-purple-waistcoat.jpg" x={2450} y={605} w={500} h={750} at={.45} until={5.2} motion="none"/>
    </div>
    <Caption y={1442} at={.86} until={1.82} size={34}><i>{c.purple1}</i></Caption>
    <Caption y={1442} at={2.17} until={3.4} size={34}><i>{c.purple2}</i></Caption>
    <Caption y={1442} at={3.81} until={5} size={34}><i>{c.purple3}</i></Caption>
  </>;
}

function PointOfView() {
  const c = useCopy();
  return <>
    <WordStrip y={257} size={83} at={.29}>{c.vision1}</WordStrip>
    <WordStrip y={355} size={84} at={.64} italic>{c.vision2}</WordStrip>
    <Photo file="14-purple-pair.jpg" x={245} y={593} w={590} h={885} at={.56} until={3.34} motion="zoom"/>
    <Rule x={261} y={1520} width={558} at={1.44}/>
    <Caption y={1571} at={1.77} until={3.16} size={30}><i>{c.visionCaption}</i></Caption>
  </>;
}

function Close() {
  const s = useSeconds();
  const c = useCopy();
  const lang = useLanguage();
  const years = [1967, 1972, 1993, 1995];
  return <>
    <WordStrip y={lang === 'ru' ? 572 : 609} size={lang === 'ru' ? 88 : 93} at={.25}>{c.close1}</WordStrip>
    {lang === 'ru' ? <>
      <WordStrip y={695} size={70} at={.61} italic>Мир, который</WordStrip>
      <WordStrip y={783} size={70} at={.88} italic>можно носить.</WordStrip>
    </> : <WordStrip y={720} size={83} at={.64} italic>{c.close2}</WordStrip>}
    <Rule x={285} y={lang === 'ru' ? 980 : 928} width={510} at={lang === 'ru' ? 1.14 : .94}/>
    <Caption y={lang === 'ru' ? 1042 : 1000} at={lang === 'ru' ? 1.39 : 1.19} until={2.39} size={27}>{c.closeCaption}</Caption>
    <div style={{position: 'absolute', left: 192, right: 192, top: 1350, display: 'flex', justifyContent: 'space-between'}}>
      {years.map((year, i) => <span key={year} style={{fontFamily: lang === 'ru' ? b.body : b.serif, fontSize: 37, color: b.ink, opacity: n(s, [.63 + i * .37, .83 + i * .37], [.22, 1])}}>{year}</span>)}
    </div>
    <div style={{position: 'absolute', left: n(s, [.78, 1.18, 1.58, 1.98], [192, 372, 552, 732]), top: 1420, width: 80, height: 3, background: b.sepia}}/>
    <Caption y={1602} at={1.48} until={2.39} size={19}>{c.credits1}<br/>{c.credits2}</Caption>
  </>;
}

const scenes = [
  ['Cover', t.cover, Cover, 'slide'],
  ['1967 / Ties', t.ties, Ties, 'slide'],
  ['The idea', t.idea, Idea, 'dissolve'],
  ['1972 / Polo', t.polo, Polo, 'lift'],
  ['A world', t.worlds, Worlds, 'slide'],
  ['1993 / Double RL', t.doubleRl, DoubleRL, 'dissolve'],
  ['1995 / Purple Label', t.purple, Purple, 'lift'],
  ['One vision', t.pointOfView, PointOfView, 'slide'],
  ['Close', t.close, Close, 'dissolve'],
] as const;

export function RalphLaurenEditorialV6() {
  const {fps} = useVideoConfig();
  const language = useLanguage();
  return <AbsoluteFill style={{background: b.paper, overflow: 'hidden'}}>
    {scenes.map(([name, range, Component, mode], index) => <Sequence key={name} name={name} from={Math.round(range.from * fps)} durationInFrames={Math.min(Math.round(t.duration * fps) - Math.round(range.from * fps), Math.round((range.seconds + (index < scenes.length - 1 ? t.pageSeconds : 0)) * fps))}>
      <Page number={index + 1} seconds={range.seconds} mode={mode} direction={index % 2 === 0 ? -1 : 1} first={index === 0}><Component/></Page>
    </Sequence>)}
    <Audio src={asset(language === 'ru' ? 'narration-v6-ru.wav' : 'narration-v6.wav')} volume={1.25}/>
    <Audio src={asset('score-v6.wav')} volume={.16}/>
    <Audio src={asset('foley-v6.wav')} volume={.34}/>
  </AbsoluteFill>;
}

export function RalphLaurenEditorialV6Ru() {
  return <LanguageContext.Provider value="ru"><RalphLaurenEditorialV6/></LanguageContext.Provider>;
}
