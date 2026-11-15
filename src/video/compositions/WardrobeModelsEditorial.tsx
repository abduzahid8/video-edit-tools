import {createContext, useContext, type ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence,
  interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {modelWardrobeBrand as brand} from '../theme';
import {modelWardrobeTimeline as timing} from '../timeline';

const asset = (name: string) => staticFile(`assets/wardrobe-models/${name}`);
const photo = (name: string) => staticFile(`assets/wardrobe-models-hd/${name}`);
const ease = Easing.bezier(.22, .76, .23, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const move = (time: number, times: number[], values: number[]) => interpolate(time, times, values, {...clamp, easing: ease});
const useSeconds = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

type Box = {x: number; y: number; w: number; h: number};
type Beat = {from: number; end: number};
const place = ({x, y, w, h}: Box) => ({position: 'absolute', left: x, top: y, width: w, height: h} as const);
const TitleOpacity = createContext(1);
const Russian = createContext(false);

function Spread({beat, children}: {beat: Beat; children: ReactNode}) {
  const s = useSeconds();
  const {fps} = useVideoConfig();
  const span = (Math.round(beat.end * fps) - Math.round(beat.from * fps)) / fps;
  const slide = Math.round(timing.slide * fps) / fps;
  const first = beat.from === 0;
  const last = beat.end === timing.duration;
  const entrance = first ? 1 : move(s, [0, slide], [0, 1]);
  const exit = last ? 1 : move(s, [span, span + slide], [1, 0]);
  const titleIn = first ? 1 : move(s, [slide * .42, slide * .85], [0, 1]);
  const titleOut = last ? 1 : move(s, [span - .14, span + .04], [1, 0]);
  // Complementary masks reveal the next spread against the same paper.
  // The overlap never stacks two headlines or washes out the photography.
  return <AbsoluteFill style={{clipPath: `inset(0 ${(1 - exit) * 100}% 0 ${(1 - entrance) * 100}%)`}}>
    <AbsoluteFill style={{translate: `${(1 - entrance) * 75 - (1 - exit) * 94}px 0`}}>
      <TitleOpacity.Provider value={titleIn * titleOut}>{children}</TitleOpacity.Provider>
    </AbsoluteFill>
  </AbsoluteFill>;
}

function Headline({lines, top = 245, size = 80, at = .05}: {
  lines: ReactNode[]; top?: number; size?: number; at?: number;
}) {
  const s = useSeconds();
  const opacity = useContext(TitleOpacity);
  return <div style={{position: 'absolute', top, left: 74, right: 74, textAlign: 'center', fontSize: size, lineHeight: 1.04, letterSpacing: -1.65, opacity}}>
    {lines.map((line, index) => <div key={index} style={{overflow: 'hidden', padding: '0 0 .12em'}}>
      <div style={{translate: `0 ${move(s, [at + index * .1, at + .54 + index * .1], [110, 0])}%`}}>{line}</div>
    </div>)}
  </div>;
}

function Caption({children, y = 1580, at = .5, size = 42}: {children: ReactNode; y?: number; at?: number; size?: number}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: 95, right: 95, top: y, textAlign: 'center', fontSize: size,
    opacity: move(s, [at, at + .28], [0, 1]), translate: `0 ${move(s, [at, at + .46], [24, 0])}px`,
  }}>{children}</div>;
}

function Photo({file, box, at = -.55, direction = 'up', position = '50% 50%', drift = 0}: {
  file: string; box: Box; at?: number; direction?: 'up' | 'left' | 'right'; position?: string; drift?: number;
}) {
  const s = useSeconds();
  const enter = move(s, [at, at + .54], [0, 1]);
  const masked = 100 * (1 - enter);
  const inset = direction === 'up' ? `${masked}% 0 0` : direction === 'left' ? `0 0 0 ${masked}%` : `0 ${masked}% 0 0`;
  return <div style={{...place(box), overflow: 'hidden', clipPath: `inset(${inset})`}}>
    <Img src={photo(file)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: position,
      scale: interpolate(s, [at + .54, at + 5.5], [1.025, 1.09], clamp),
      translate: `${move(s, [at + .5, at + 5.5], [0, drift])}px 0`,
    }}/>
  </div>;
}

function Figure({file, box, scale = 1}: {file: string; box: Box; scale?: number}) {
  return <Img src={photo(file)} style={{...place(box), objectFit: 'contain', objectPosition: '50% 100%',
    transformOrigin: '50% 100%', scale, filter: 'drop-shadow(5px 8px 7px rgba(33, 32, 22, .13))',
  }}/>;
}

function Label({children, x, y, at = 0}: {children: ReactNode; x: number; y: number; at?: number}) {
  const s = useSeconds();
  return <div style={{position: 'absolute', left: x, top: y, whiteSpace: 'nowrap', fontFamily: brand.sans, fontSize: 22,
    letterSpacing: 3, color: brand.muted, opacity: move(s, [at, at + .32], [0, 1]),
  }}>{children}</div>;
}

function Leader({path, point, at}: {path: string; point: [number, number]; at: number}) {
  const s = useSeconds();
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <path d={path} fill="none" stroke={brand.accent} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={move(s, [at, at + .56], [1, 0])}/>
    <circle cx={point[0]} cy={point[1]} r={6} fill={brand.accent} opacity={move(s, [at, at + .18], [0, 1])}/>
  </svg>;
}

function Cover() {
  const s = useSeconds();
  const ru = useContext(Russian);
  const index = timing.cover.cuts.filter((cut) => s >= cut).length;
  const files = ['open-dark.jpg', 'open-light.jpg', 'open-knit.jpg', 'open-portrait.jpg'];
  const fan = move(s, [timing.cover.fan, timing.cover.fan + .82], [0, 1]);
  return <>
    <Headline at={-.75} lines={ru ? ['Как собрать', <i>гардероб под себя?</i>] : ['What makes a wardrobe', <i>feel like you?</i>]}/>
    {[-1, 1].map((side) => <div key={side} style={{...place({x: 305, y: 576, w: 470, h: 815}),
      translate: `${side * fan * 242}px ${fan * 42}px`, rotate: `${side * fan * 6}deg`, scale: .9 - fan * .03,
      opacity: fan, boxShadow: brand.plateShadow,
    }}><Photo file={side < 0 ? 'fan-street.jpg' : 'fan-coat.jpg'} box={{x: 0, y: 0, w: 470, h: 815}}/></div>)}
    <div style={{...place({x: 276, y: 510, w: 528, h: 924}), boxShadow: brand.plateShadow,
      translate: `0 ${fan * 24}px`, scale: 1 - fan * .09,
    }}>
      <Photo file={files[index]} box={{x: 0, y: 0, w: 528, h: 924}} position={index === 0 ? '49% 50%' : '50% 50%'}/>
    </div>
    <Caption y={1530} at={2.52}><i>{ru ? 'Одежда для того, кем вы хотите стать.' : 'Dress for who you’re becoming.'}</i></Caption>
  </>;
}

function Tailoring() {
  const s = useSeconds();
  const ru = useContext(Russian);
  const {reframe, detailCut} = timing.tailoring;
  const pan = move(s, [reframe, reframe + .72], [0, 1]);
  const push = interpolate(s, [.5, 5.5], [1, 1.045], clamp);
  return <>
    <Headline lines={ru ? [<>Начните <i>с силуэта.</i></>] : [<>Start with <i>the silhouette.</i></>]}/>
    <Label x={108} y={425} at={.24}>{ru ? '01 / КРОЙ' : '01 / TAILORING'}</Label>
    <div style={{position: 'absolute', left: 110, top: 470, width: move(s, [.15, .8], [0, 860]), height: 1, background: brand.line}}/>
    <div style={{position: 'absolute', top: 574, left: 298 - pan * 164, width: 485, height: 972, background: brand.stone, opacity: .15 * pan}}/>
    <div style={{position: 'absolute', inset: 0, translate: `${move(s, [0, .67], [-165, 0]) - pan * 235}px 0`,
      opacity: move(s, [0, .32], [0, 1]),
    }}><Figure file="cream.png" box={{x: 294, y: 491, w: 492, h: 1110}} scale={push}/></div>
    <Photo file="cream-detail.jpg" box={{x: 623, y: 586, w: 346, h: 585}} at={reframe + .12} direction="left" position="46% 50%" drift={-7}/>
    <Photo file="dark-detail.jpg" box={{x: 623, y: 586, w: 346, h: 585}} at={detailCut} direction="right" position="46% 50%"/>
    <Leader path="M431 696 H545 L604 1233 H964" point={[431, 696]} at={reframe + .73}/>
    <div style={{position: 'absolute', top: 1265, left: 623, right: 100, fontSize: ru ? 35 : 42, lineHeight: 1.06,
      opacity: move(s, [reframe + .68, reframe + 1.01], [0, 1]),
    }}>{ru ? 'Чёткая линия плеч.' : 'Defined shoulders.'}<br/><i>{ru ? 'Свобода движения.' : 'Room to move.'}</i></div>
  </>;
}

function TailoringInMotion() {
  const s = useSeconds();
  const ru = useContext(Russian);
  const expand = move(s, [.15, .93], [0, 1]);
  const w = 470 + 430 * expand;
  const h = w * 410 / 600;
  return <>
    <Headline top={335} lines={ru ? ['Как складывается', <i>образ.</i>] : ['How it comes', <i>together.</i>]}/>
    <div style={{position: 'absolute', left: 540 - w / 2, top: 715 - 30 * expand, width: w, height: h,
      boxShadow: brand.plateShadow, overflow: 'hidden', background: brand.film, rotate: `${-3 * (1 - expand)}deg`,
    }}>
      <OffthreadVideo muted src={asset('tie-motion.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover', scale: 1.05}}/>
    </div>
    <Caption y={1380} at={.75}>{ru ? 'Строгий воротник. Тёмный галстук.' : 'A crisp collar. A dark tie.'}</Caption>
    <Label x={150} y={1315} at={.95}>{ru ? 'ДЕТАЛИ / 01' : 'DETAIL STUDY / 01'}</Label>
    <div style={{position: 'absolute', left: 150, top: 1354, height: 1, width: interpolate(s, [.95, 4.4], [0, 780], clamp), background: brand.line}}/>
  </>;
}

function StreetLooks() {
  const s = useSeconds();
  const ru = useContext(Russian);
  const relay = timing.street.relay;
  const shift = move(s, [relay, relay + .78], [0, 1]);
  return <>
    <Headline lines={ru ? ['Та же лёгкость.', <i>Другие пропорции.</i>] : ['Same ease.', <i>Different proportions.</i>]}/>
    <AbsoluteFill style={{clipPath: `inset(0 ${shift * 100}% 0 0)`}}>
    <AbsoluteFill style={{translate: `${-shift * 525}px 0`}}>
      <Photo file="dark.jpg" box={{x: 99, y: 600, w: 520, h: 831}} at={.18} direction="right" position="50% 46%"/>
      <div style={{position: 'absolute', inset: 0, translate: `0 ${move(s, [.19, .91], [190, 0])}px`, opacity: move(s, [.18, .52], [0, 1])}}>
        <Figure file="coat.png" box={{x: 466, y: 475, w: 535, h: 1090}}/>
      </div>
      <Label x={100} y={1480} at={.55}>{ru ? 'ТЁМНОЕ ПАЛЬТО / ДЛИННЫЙ СИЛУЭТ' : 'DARK LAYERS / LONG LINE'}</Label>
    </AbsoluteFill>
    </AbsoluteFill>
    <AbsoluteFill style={{clipPath: `inset(0 0 0 ${(1 - shift) * 100}%)`}}>
    <AbsoluteFill style={{translate: `${(1 - shift) * 545}px 0`}}>
      <Photo file="olive.jpg" box={{x: 443, y: 601, w: 538, h: 830}} at={relay - .1} direction="left" drift={-8}/>
      <div style={{position: 'absolute', inset: 0, translate: `0 ${(1 - shift) * 110}px`}}>
        <Figure file="relaxed.png" box={{x: 96, y: 475, w: 540, h: 1085}}/>
      </div>
      <Label x={ru ? 482 : 548} y={1480} at={relay + .4}>{ru ? 'СВЕТЛЫЕ БРЮКИ / СВОБОДНЫЙ КРОЙ' : 'PALE TROUSERS / RELAXED LEG'}</Label>
    </AbsoluteFill>
    </AbsoluteFill>
  </>;
}

const details = [
  {file: 'lapel-close.jpg', text: 'The line of the lapel', ru: 'Линия лацкана', at: 0, position: '50% 50%'},
  {file: 'knit-detail.jpg', text: 'Texture at the shoulder', ru: 'Фактура трикотажа', at: timing.details.cuts[0], position: '50% 60%'},
  {file: 'tie-close.jpg', text: 'A bolder tie', ru: 'Яркий галстук', at: timing.details.cuts[1], position: '50% 49%'},
];

function Details() {
  const s = useSeconds();
  const ru = useContext(Russian);
  const index = timing.details.cuts.filter((cut) => s >= cut).length;
  const lastDetail = details[index];
  return <>
    <Headline top={335} lines={ru ? ['Детали', <i>говорят сами за себя.</i>] : ['The details', <i>do the talking.</i>]}/>
    <div style={{...place({x: 114, y: 640, w: 852, h: 630}), background: brand.film, boxShadow: brand.plateShadow}}/>
    {details.map((detail, i) => <Photo key={detail.file} file={detail.file} box={{x: 126, y: 652, w: 828, h: 606}}
      at={detail.at} direction={i % 2 ? 'left' : 'right'} position={detail.position} drift={10 - 10 * i}/>)}
    <Label x={128} y={1320} at={.38}>0{index + 1} / 03</Label>
    <div style={{position: 'absolute', top: 1376, left: 128, fontSize: 51, fontStyle: 'italic',
      opacity: move(s, [lastDetail.at + .15, lastDetail.at + .38], [0, 1]),
    }}>{ru ? lastDetail.ru : lastDetail.text}</div>
    <div style={{position: 'absolute', top: 1335, left: 280, right: 130, display: 'flex', gap: 8}}>
      {details.map((detail, i) => <div key={detail.file} style={{height: 1, flex: 1, background: i <= index ? brand.accent : brand.line}}/>)}
    </div>
  </>;
}

function Questions() {
  const s = useSeconds();
  const ru = useContext(Russian);
  const next = timing.question.next;
  return <>
    <div style={{position: 'absolute', inset: 0, opacity: move(s, [next - .23, next + .16], [1, 0]),
      translate: `0 ${move(s, [next - .23, next + .16], [0, -76])}px`,
    }}><Headline top={748} size={94} lines={ru ? ['Кем вы хотите', <i>стать?</i>] : ['Who are you', <i>becoming?</i>]}/></div>
    <Headline top={755} size={77} at={next - .03} lines={ru ? ['Каким вас', <i>запомнят?</i>] : ['What do you want people', <i>to associate you with?</i>]}/>
    <div style={{position: 'absolute', left: 290, top: 1090, width: 500, height: 1, background: brand.line,
      scale: `${move(s, [.17, 1.1, next - .3, next + .4], [0, 1, 1, .45])} 1`,
    }}/>
  </>;
}

const looks = [
  {file: 'compare-tailored.png', name: 'Tailored', ru: 'Классика', swatch: brand.dark},
  {file: 'compare-relaxed.png', name: 'Relaxed', ru: 'Свободный крой', swatch: brand.navy},
  {file: 'tweed.png', name: 'Layered', ru: 'Слои', swatch: brand.stone},
];

function ContactSheet() {
  const s = useSeconds();
  const ru = useContext(Russian);
  return <>
    <Headline lines={ru ? ['Найдите силуэт,', <i>к которому вернётесь.</i>] : ['Find a shape', <i>you’ll return to.</i>]}/>
    {looks.map((look, i) => {
      const at = .12 + i * .15;
      const lift = move(s, [at, at + .66], [230, 0]);
      const x = 85 + i * 310;
      const card = move(s, [timing.compare.reveal + i * .11, timing.compare.reveal + .6 + i * .11], [0, 1]);
      return <div key={look.file} style={{position: 'absolute', inset: 0, translate: `0 ${lift}px`, opacity: move(s, [at, at + .3], [0, 1])}}>
        <div style={{...place({x, y: 579, w: 290, h: 760}), background: look.swatch, opacity: .12 + card * .13}}/>
        <Figure file={look.file} box={{x: x - 11, y: 545, w: 312, h: 758}} scale={.91 + card * .09}/>
        <div style={{position: 'absolute', top: 1380, left: x, width: 290, textAlign: 'center', fontSize: ru ? 34 : 40, opacity: card}}>{ru ? look.ru : look.name}</div>
      </div>;
    })}
    <Caption y={1540} at={1.9}><i>{ru ? 'Разные образы. Свой стиль.' : 'Different looks. A point of view.'}</i></Caption>
  </>;
}

function Close() {
  const s = useSeconds();
  const ru = useContext(Russian);
  const relay = timing.close.relay;
  const sweep = move(s, [relay, relay + .6], [0, 1]);
  return <>
    <Headline lines={ru ? ['Детали складываются', <i>в ваш стиль.</i>] : ['Every decision.', <i>The same direction.</i>]}/>
    <div style={{...place({x: 248, y: 512, w: 584, h: 914}), overflow: 'hidden', boxShadow: brand.plateShadow}}>
      <div style={{position: 'absolute', inset: 0, translate: `${-sweep * 584}px 0`}}>
        <Photo file="close-brown.jpg" box={{x: 0, y: 0, w: 584, h: 914}}/>
      </div>
      <div style={{position: 'absolute', inset: 0, translate: `${(1 - sweep) * 584}px 0`}}>
        <Photo file="close-navy.jpg" box={{x: 0, y: 0, w: 584, h: 914}}/>
      </div>
    </div>
    <Caption y={1510} at={1.75}>{ru ? <>Гардероб, <i>который вам близок.</i></> : <>A wardrobe that feels <i>like you.</i></>}</Caption>
    <div style={{position: 'absolute', top: 1598, left: 300, width: move(s, [2.18, 3.4], [0, 480]), height: 1, background: brand.accent}}/>
  </>;
}

function WardrobeModelsCut({ru}: {ru: boolean}) {
  const {fps} = useVideoConfig();
  const frameAt = (seconds: number) => Math.round(seconds * fps);
  const span = (beat: Beat) => frameAt(beat.end) - frameAt(beat.from) + (beat.end < timing.duration ? frameAt(timing.slide) : 0);
  const originalVoice = staticFile('assets/wardrobe-identity/original-audio.wav');
  const {opening, closing} = timing.voice;
  return <Russian.Provider value={ru}><AbsoluteFill lang={ru ? 'ru' : 'en'} style={{background: brand.paper, color: brand.ink, fontFamily: brand.serif, overflow: 'hidden'}}>
    <Img src={staticFile('assets/capsule-elegant/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    <Audio src={asset('score.wav')} volume={ru ? .57 : 1}/>
    {ru ? <Audio src={asset('narration-ru.wav')}/> : <>
      <Sequence name="Original wardrobe premise" from={frameAt(opening.from)} durationInFrames={frameAt(opening.seconds)}>
        <Audio src={originalVoice} trimBefore={frameAt(opening.source)} volume={(frame) => move(frame / fps, [4.48, 4.65], [.94, 0])}/>
      </Sequence>
      <Sequence name="Original wardrobe takeaway" from={frameAt(closing.from)} durationInFrames={frameAt(closing.seconds)}>
        <Audio src={originalVoice} trimBefore={frameAt(closing.source)} volume={(frame) => move(frame / fps, [0, .09, 11.97, 12.15], [0, .94, .94, 0])}/>
      </Sequence>
    </>}
    <Sequence name="Four looks / cover" from={0} durationInFrames={span(timing.cover)}><Spread beat={timing.cover}><Cover/></Spread></Sequence>
    <Sequence name="Classic tailoring" from={frameAt(timing.tailoring.from)} durationInFrames={span(timing.tailoring)}><Spread beat={timing.tailoring}><Tailoring/></Spread></Sequence>
    <Sequence name="The tie and lapels / moving insert" from={frameAt(timing.detailMotion.from)} durationInFrames={span(timing.detailMotion)}><Spread beat={timing.detailMotion}><TailoringInMotion/></Spread></Sequence>
    <Sequence name="Street looks / dark and light" from={frameAt(timing.street.from)} durationInFrames={span(timing.street)}><Spread beat={timing.street}><StreetLooks/></Spread></Sequence>
    <Sequence name="Lapel, knit and tie" from={frameAt(timing.details.from)} durationInFrames={span(timing.details)}><Spread beat={timing.details}><Details/></Spread></Sequence>
    <Sequence name="Two wardrobe questions" from={frameAt(timing.question.from)} durationInFrames={span(timing.question)}><Spread beat={timing.question}><Questions/></Spread></Sequence>
    <Sequence name="Three silhouettes / comparison" from={frameAt(timing.compare.from)} durationInFrames={span(timing.compare)}><Spread beat={timing.compare}><ContactSheet/></Spread></Sequence>
    <Sequence name="Closing photo relay" from={frameAt(timing.close.from)} durationInFrames={span(timing.close)}><Spread beat={timing.close}><Close/></Spread></Sequence>
    <div style={{position: 'absolute', left: 86, right: 86, top: 115, display: 'flex', justifyContent: 'space-between', fontFamily: brand.sans, fontSize: 23, letterSpacing: 2.4, color: brand.muted}}>
      <span>{ru ? 'ALTA / ЗАМЕТКИ О ГАРДЕРОБЕ' : 'ALTA / WARDROBE NOTES'}</span><span>{ru ? 'МУЖСКОЙ СТИЛЬ' : 'MENSWEAR'}</span>
    </div>
  </AbsoluteFill></Russian.Provider>;
}

export function WardrobeModelsEditorial() {
  return <WardrobeModelsCut ru={false}/>;
}

export function WardrobeModelsEditorialRu() {
  return <WardrobeModelsCut ru/>;
}
