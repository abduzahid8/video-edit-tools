import {type ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence,
  interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {becomingBrand as b} from '../theme';
import {becomingTimeline as t} from '../timeline';

const asset = (name: string) => staticFile(`assets/aiw-becoming/${name}`);
const ease = Easing.bezier(.22, .76, .23, 1);
const pop = Easing.bezier(.34, 1.56, .64, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const m = (s: number, times: number[], values: number[], easing: (n: number) => number = ease) =>
  interpolate(s, times, values, {...clamp, easing});
const useS = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
const frameAt = (seconds: number, fps: number) => Math.round(seconds * fps);

// The example's palette is essentially two inks on pure white.
const WHITE = '#ffffff';
const INK = '#1c1b18';
const GREY = '#8f8d86';
const FAINT = '#b9b7b0';

// Cutout figures keep their natural aspect; boxes are height-driven.
const figureAspect: Record<string, number> = {
  'hero-today.png': 1071 / 2072,
  'hero-becoming.png': 590 / 1248,
};

const toneFilter: Record<string, string> = {
  bw: 'grayscale(1) contrast(1.05)',
  muted: 'saturate(.52) contrast(1.03)',
  soft: 'saturate(.72) contrast(1.02)',
};

// Whole-frame wash — the example moves between beats by fading the entire
// frame through white rather than cutting.
function Beat({children, seconds, first = false, last = false}: {
  children: ReactNode; seconds: number; first?: boolean; last?: boolean;
}) {
  const s = useS();
  const washIn = first ? 0 : m(s, [0, .26], [1, 0]);
  const washOut = last ? 0 : m(s, [seconds - .22, seconds], [0, 1]);
  return <AbsoluteFill>
    {children}
    <AbsoluteFill style={{background: WHITE, opacity: Math.max(washIn, washOut), pointerEvents: 'none'}}/>
  </AbsoluteFill>;
}

function Figure({file, x, yTop, h, z = 1, opacity = 1, rotate = 0, scale = 1, origin = '50% 50%', tone = 'soft'}: {
  file: keyof typeof figureAspect & string; x: number; yTop: number; h: number;
  z?: number; opacity?: number; rotate?: number; scale?: number; origin?: string; tone?: keyof typeof toneFilter;
}) {
  const w = Math.round(h * figureAspect[file]);
  return <Img src={asset(file)} style={{
    position: 'absolute', left: x, top: yTop, width: w, height: h, zIndex: z,
    opacity, rotate: `${rotate}deg`, scale: `${scale}`, transformOrigin: origin,
    filter: `drop-shadow(9px 14px 14px rgba(20, 19, 16, .16)) ${toneFilter[tone]}`,
    userSelect: 'none',
  }}/>;
}

// White-framed photo plate — the example's core object: a photo inside a
// generous white border with a soft shadow, floating on the white page.
function Frame({file, x, y, w, h, at, from = 'up', position = '50% 50%', tone = 'bw', rotate = 0, z = 1}: {
  file: string; x: number; y: number; w: number; h: number; at: number;
  from?: 'up' | 'left' | 'right'; position?: string; tone?: keyof typeof toneFilter;
  rotate?: number; z?: number;
}) {
  const s = useS();
  const enter = m(s, [at, at + .5], [0, 1]);
  const masked = 100 * (1 - enter);
  const inset = from === 'up' ? `0 0 ${masked}% 0` : from === 'left' ? `${masked}% 0 0 0` : `0 ${masked}% 0 0`;
  return <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, rotate: `${rotate}deg`,
    background: WHITE, padding: 14,
    boxShadow: '0 14px 36px rgba(20, 19, 16, .16), 0 3px 10px rgba(20, 19, 16, .08)',
    opacity: m(s, [at, at + .16], [0, 1]),
    translate: `0 ${m(s, [at, at + .55], [from === 'left' || from === 'right' ? 0 : 26, 0])}px`,
  }}>
    <div style={{position: 'absolute', inset: 14, overflow: 'hidden', clipPath: `inset(${inset})`, background: '#f2f1ec'}}>
      <Img src={asset(file)} style={{
        width: '100%', height: '100%', objectFit: 'cover', objectPosition: position,
        filter: toneFilter[tone],
        scale: m(s, [at + .5, at + 3.4], [1.05, 1]), translate: `0 ${m(s, [at + .5, at + 3.4], [0, -7])}px`,
      }}/>
    </div>
  </div>;
}

function Mono({children, x, y, size = 20, color = INK, at = 0, spacing = 3, weight = 500, opacity = 1, align, w}: {
  children: ReactNode; x?: number; y: number; size?: number; color?: string; at?: number;
  spacing?: number; weight?: number; opacity?: number; align?: 'center'; w?: number;
}) {
  const s = useS();
  return <div style={{
    position: 'absolute', left: x, top: y,
    width: align === 'center' ? '100%' : w, textAlign: align,
    fontFamily: b.mono, fontSize: size, letterSpacing: spacing,
    color, fontWeight: weight, whiteSpace: 'nowrap',
    opacity: opacity * m(s, [at, at + .28], [0, 1]),
    translate: `0 ${m(s, [at, at + .42], [8, 0])}px`,
  }}>{children}</div>;
}

// Sentence-case serif display line with the example's faint misregistered
// ghost print settling into the main line.
function Serif({children, top, size, at, italic = false, align = 'center', color = INK, ghost = true, weight = 400, x, w}: {
  children: ReactNode; top: number; size: number; at: number; italic?: boolean;
  align?: 'center' | 'left'; color?: string; ghost?: boolean; weight?: number; x?: number; w?: number;
}) {
  const s = useS();
  const enter = m(s, [at, at + .2], [0, 1]);
  const settle = m(s, [at, at + .5], [1, 0]);
  const isLeft = align === 'left';
  return <div style={{
    position: 'absolute', left: isLeft ? x : 0, width: isLeft ? w : '100%', top,
    textAlign: align,
    fontFamily: b.display, fontSize: size, fontWeight: weight,
    fontStyle: italic ? 'italic' : 'normal', letterSpacing: -size * .02,
    lineHeight: 1.06, color, overflow: 'hidden', padding: '2px 0 8px',
  }}>
    {ghost ? <div style={{
      position: 'absolute', inset: 0, color,
      opacity: .22 * settle * enter, translate: `${7 * settle}px ${5 * settle}px`,
    }}>{children}</div> : null}
    <div style={{
      translate: `0 ${m(s, [at, at + .5], [104, 0])}%`,
      opacity: enter,
    }}>{children}</div>
  </div>;
}

// Dotted leader with a circled target point and an italic serif note —
// the example's "$800 dollars" annotation.
function Leader({path, point, at, label, labelX, labelY, labelSize = 40}: {
  path: string; point: [number, number]; at: number;
  label?: ReactNode; labelX?: number; labelY?: number; labelSize?: number;
}) {
  const s = useS();
  return <>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6}}>
      <path d={path} fill="none" stroke={INK} strokeWidth={1.8} strokeDasharray="2.5 7"
        strokeLinecap="round" pathLength={1}
        strokeDashoffset={m(s, [at, at + .55], [1, 0])}/>
      <circle cx={point[0]} cy={point[1]} r={4.5} fill={INK} opacity={m(s, [at + .42, at + .6], [0, 1])}/>
      <circle cx={point[0]} cy={point[1]} r={12} fill="none" stroke={INK} strokeWidth={1.5}
        opacity={m(s, [at + .48, at + .68], [0, .9])}/>
    </svg>
    {label ? <div style={{
      position: 'absolute', left: labelX, top: labelY, zIndex: 6,
      fontFamily: b.display, fontStyle: 'italic', fontSize: labelSize,
      letterSpacing: -.4, lineHeight: 1.15, color: INK,
      opacity: m(s, [at + .28, at + .6], [0, 1]),
      translate: `0 ${m(s, [at + .28, at + .68], [10, 0])}px`,
    }}>{label}</div> : null}
  </>;
}

// Dark social reply bubble — the example's comment texture.
function Bubble({x, y, w, header, text, at, z = 6}: {
  x: number; y: number; w: number; header: string; text: string; at: number; z?: number;
}) {
  const s = useS();
  return <div style={{
    position: 'absolute', left: x, top: y, width: w, zIndex: z,
    background: '#191817', color: '#f4f2ea', borderRadius: 14,
    borderBottomLeftRadius: 4,
    padding: '12px 16px 11px', boxShadow: '0 12px 30px rgba(20,19,16,.22)',
    opacity: m(s, [at, at + .12], [0, 1]),
    scale: `${m(s, [at, at + .32], [.55, 1], pop)}`,
    transformOrigin: '18% 100%',
    translate: `0 ${m(s, [at, at + .34], [-14, 0], pop)}px`,
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
      <div style={{
        width: 26, height: 26, borderRadius: 13, background: 'linear-gradient(140deg,#c9a28b,#6b4a3a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: b.mono, fontSize: 13, color: '#f4f2ea',
      }}>{header.replace('@', '').slice(0, 1).toUpperCase()}</div>
      <div style={{fontFamily: b.sans, fontSize: 16, letterSpacing: .2, color: 'rgba(244,242,234,.55)'}}>{header}</div>
    </div>
    <div style={{fontFamily: b.sans, fontWeight: 600, fontSize: 25, lineHeight: 1.24, letterSpacing: -.2}}>{text}</div>
  </div>;
}

// Search field with a typing caret — the example's "Ebay." beat.
function SearchBar({x, y, w, text, at, typeEnd, ru}: {
  x: number; y: number; w: number; text: string; at: number; typeEnd: number; ru: boolean;
}) {
  const s = useS();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shown = Math.round(m(s, [at + .12, typeEnd], [0, text.length]));
  const caretOn = Math.sin(frame / fps * 2 * Math.PI * 2.6) > 0 ? 1 : .15;
  return <div style={{
    position: 'absolute', left: x, top: y, width: w, height: 78, borderRadius: 39,
    background: '#e3e2dd', border: '1px solid rgba(28,27,24,.08)',
    boxShadow: '0 10px 26px rgba(20,19,16,.1)',
    opacity: m(s, [at, at + .2], [0, 1]),
    translate: `0 ${m(s, [at, at + .34], [16, 0])}px`,
    display: 'flex', alignItems: 'center', paddingLeft: 32, zIndex: 6,
  }}>
    <div style={{
      fontFamily: ru ? b.serif : b.display, fontSize: 34, color: INK, letterSpacing: .2,
      whiteSpace: 'nowrap', overflow: 'hidden',
    }}>
      {text.slice(0, shown)}<span style={{opacity: caretOn, fontWeight: 300}}>|</span>
    </div>
    <svg width={30} height={30} viewBox="0 0 30 30"
      style={{position: 'absolute', right: 28, opacity: .6}}>
      <circle cx={13} cy={13} r={9} fill="none" stroke={INK} strokeWidth={2.4}/>
      <line x1={20} y1={20} x2={27} y2={27} stroke={INK} strokeWidth={2.4} strokeLinecap="round"/>
    </svg>
  </div>;
}

// Marketplace product card in the example's language: grey card, colored
// mini wordmark, name, colour dots, dark price pill, product on the right.
function ProductCard({x, y, w, h, name, sub, price, at, priceAt}: {
  x: number; y: number; w: number; h: number; name: string; sub: string;
  price: string; at: number; priceAt: number;
}) {
  const s = useS();
  const inP = m(s, [at, at + .5], [0, 1]);
  return <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18,
    background: '#dcdcd8', boxShadow: '0 16px 40px rgba(20,19,16,.18)',
    opacity: inP, scale: `${.95 + inP * .05}`,
    translate: `0 ${(1 - inP) * 36}px`, zIndex: 6, overflow: 'hidden',
    display: 'flex', alignItems: 'center', padding: 26, gap: 26,
  }}>
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 9, paddingLeft: 8}}>
      <div style={{fontFamily: b.sans, fontWeight: 700, fontSize: 34, letterSpacing: .4}}>
        <span style={{color: '#d43a2f', fontStyle: 'italic'}}>Staple</span>
        <span style={{color: '#2f6bd8', fontStyle: 'italic'}}> Edit</span>
      </div>
      <div style={{fontFamily: b.serif, fontWeight: 600, fontSize: 40, color: INK, letterSpacing: -.3}}>{name}</div>
      <div style={{fontFamily: b.serif, fontSize: 24, color: '#77756e', fontStyle: 'italic'}}>{sub}</div>
      <div style={{display: 'flex', gap: 11, margin: '6px 0 2px'}}>
        {['#1c1b18', '#8f8d86', '#5e4638'].map(c => <div key={c} style={{
          width: 24, height: 24, borderRadius: 12, background: c, opacity: m(s, [at + .4, at + .6], [0, 1]),
        }}/>)}
      </div>
      <div style={{
        marginTop: 8, alignSelf: 'flex-start', background: '#191817', color: '#f4f2ea',
        fontFamily: b.mono, fontSize: 32, letterSpacing: 2, borderRadius: 40,
        padding: '14px 44px',
        opacity: m(s, [priceAt, priceAt + .12], [0, 1]),
        scale: `${m(s, [priceAt, priceAt + .32], [1.4, 1], pop)} 1`,
        boxShadow: '0 10px 24px rgba(20,19,16,.28)',
      }}>{price}</div>
    </div>
    <div style={{
      width: 280, alignSelf: 'stretch', borderRadius: 12, overflow: 'hidden', background: '#efeeea', flexShrink: 0,
    }}>
      <Img src={asset('raw/card-heels.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    </div>
  </div>;
}

// ———————————————————————————————— beats ————————————————————————————————

function Hook({ru}: {ru: boolean}) {
  const s = useS();
  const h = t.hook;
  const slide = m(s, [h.todayIn, h.todayEnd], [0, 1]);
  const split = m(s, [h.becomingIn, h.becomingEnd], [0, 1]);
  const seam = 1 - m(s, [h.becomingEnd - .06, h.seamFade], [0, 1]);
  const whole = m(s, [h.seamFade, h.seamFade + .18], [0, 1]);
  const halfOpacity = m(s, [h.becomingIn - .02, h.becomingIn + .04], [0, 1]) * (1 - whole);
  return <AbsoluteFill>
    {/* figure one — today: grayscale, masked slide from the left */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      clipPath: `inset(0 ${100 - slide * 100}% 0 0)`,
    }}>
      <Figure file="hero-today.png" x={100 + (1 - slide) * 90} yTop={486} h={990} z={2} tone="bw"/>
    </div>
    {/* figure two — becoming: paper-cut split halves that settle into one print */}
    <div style={{position: 'absolute', inset: 0, zIndex: 3}}>
      <div style={{
        position: 'absolute', inset: 0, clipPath: 'inset(0 0 47% 0)', opacity: halfOpacity,
      }}>
        <Figure file="hero-becoming.png" x={596 + (1 - split) * -170} yTop={452} h={1010} z={1} tone="soft"/>
      </div>
      <div style={{
        position: 'absolute', inset: 0, clipPath: 'inset(53% 0 0 0)', opacity: halfOpacity,
      }}>
        <Figure file="hero-becoming.png" x={596 + (1 - split) * 170} yTop={452} h={1010} z={1} tone="soft"/>
      </div>
      <div style={{
        position: 'absolute', left: 586, top: 452 + 1010 * .5, width: 505, height: 3,
        background: WHITE, zIndex: 4, opacity: seam,
      }}/>
      <div style={{position: 'absolute', inset: 0, opacity: whole}}>
        <Figure file="hero-becoming.png" x={596} yTop={452} h={1010} z={1} tone="soft"/>
      </div>
    </div>
    {/* headline — the example's roman + italic pairing, sentence case */}
    <Serif top={140} size={66} at={h.headline}>
      {ru ? <>Ваш гардероб должен</> : <>Your wardrobe should</>}
    </Serif>
    <Serif top={212} size={66} at={h.headline + .14} italic>
      {ru ? <>работать на будущее.</> : <>reinforce who you&rsquo;re becoming.</>}
    </Serif>
    {/* figure labels — typewriter mono */}
    <Mono x={130} y={1520} size={19} spacing={3} color={GREY} at={h.labels}>
      {ru ? 'КТО ВЫ СЕГОДНЯ' : 'WHO YOU ARE TODAY'}
    </Mono>
    <Mono x={664} y={1520} size={19} spacing={3} color={GREY} at={h.labels + .12}>
      {ru ? 'КЕМ ВЫ СТАНОВИТЕСЬ' : 'WHO YOU’RE BECOMING'}
    </Mono>
    <Mono x={0} y={1672} size={18} color={FAINT} at={h.sub} align="center" spacing={3}>
      {ru ? 'НЕ ПРОСТО ОТРАЖАТЬ, КТО ВЫ СЕГОДНЯ' : 'NOT JUST REFLECT WHO YOU ARE TODAY'}
    </Mono>
  </AbsoluteFill>;
}

function Closet({ru}: {ru: boolean}) {
  const c = t.closet;
  return <AbsoluteFill>
    <Frame file="raw/plate-rack.jpg" x={220} y={418} w={640} h={880} at={c.plate} from="up"
      position="50% 66%" tone="bw"/>
    <Mono x={0} y={1366} size={19} color={GREY} at={c.caption} align="center" spacing={3}>
      {ru ? 'ГАРДЕРОБ ПОЛОН — А НАДЕТЬ НЕЧЕГО' : 'MY CLOSET IS FULL — NOTHING TO WEAR'}
    </Mono>
  </AbsoluteFill>;
}

const bubbleCopy = (ru: boolean) => [
  {header: ru ? 'Ответ @nora' : 'Reply to @nora’s comment', text: ru ? 'Гардероб полон, а надеть нечего' : 'my closet is FULL and I still have nothing to wear'},
  {header: ru ? 'Ответ @mess_marina' : 'Reply to @mess_marina’s comment', text: ru ? 'Ещё одна чёрная футболка. Оригинально.' : 'another black tee. groundbreaking.'},
  {header: ru ? 'Ответ @kate_runs' : 'Reply to @kate_runs’s comment', text: ru ? 'Почему я снова покупаю одно и то же?' : 'why do I keep buying the same things?'},
];

function Bubbles({ru}: {ru: boolean}) {
  const c = t.bubbles;
  const copy = bubbleCopy(ru);
  const spots = [
    {x: 128, y: 432, w: 540},
    {x: 400, y: 806, w: 520},
    {x: 172, y: 1188, w: 540},
  ];
  return <AbsoluteFill>
    {copy.map((bb, i) => <Bubble key={bb.header} {...spots[i]}
      header={bb.header} text={bb.text} at={c.bubble + i * c.gap}/>)}
    <Mono x={0} y={1596} size={18} color={FAINT} at={c.bubble + 3 * c.gap} align="center" spacing={3}>
      {ru ? 'ГАРДЕРОБ НА АВТОПИЛОТЕ' : 'A WARDROBE ON AUTOPILOT'}
    </Mono>
  </AbsoluteFill>;
}

function October({ru}: {ru: boolean}) {
  const o = t.october;
  return <AbsoluteFill>
    <Mono x={0} y={286} size={22} at={o.label} align="center" spacing={4.5} weight={500}>
      {ru ? 'ОКТЯБРЬ — АБУ-ДАБИ' : 'OCTOBER — ABU DHABI'}
    </Mono>
    <Frame file="raw/plate-boutique.jpg" x={240} y={408} w={600} h={800} at={o.plate} from="up"
      position="50% 58%" tone="muted"/>
  </AbsoluteFill>;
}

function Street({ru}: {ru: boolean}) {
  const st = t.street;
  return <AbsoluteFill>
    <Frame file="raw/plate-street.jpg" x={560} y={372} w={446} h={764} at={st.plate} from="right"
      position="44% 28%" tone="muted"/>
    <Leader
      path={`M 336 654 C 420 700, 470 726, 542 756`}
      point={[536, 752]} at={st.leader}
      label={ru ? <>всё чёрное,<br/>с головы до ног</> : <>head to toe,<br/>all black</>}
      labelX={118} labelY={560} labelSize={44}/>
  </AbsoluteFill>;
}

function Search({ru}: {ru: boolean}) {
  const se = t.search;
  return <AbsoluteFill>
    <SearchBar x={160} y={872} w={760} text={ru ? 'всё чёрное' : 'all black'} at={se.bar} typeEnd={se.typeEnd} ru={ru}/>
  </AbsoluteFill>;
}

function Card({ru}: {ru: boolean}) {
  const c = t.card;
  return <AbsoluteFill>
    <ProductCard x={190} y={620} w={700} h={470} at={c.card} priceAt={c.price}
      name={ru ? 'Лодочки, кожа' : 'Leather Pumps'}
      sub={ru ? 'чёрные — база ко всему' : 'black — goes with everything'}
      price="$ 110"/>
    <Serif top={1188} size={46} at={c.note} italic>
      {ru ? <>одно маленькое решение.</> : <>one small decision.</>}
    </Serif>
  </AbsoluteFill>;
}

const stapleChips = (ru: boolean) => [
  {file: 'raw/chip-blazer.jpg', label: ru ? 'БЛАЙЗЕР' : 'BLAZER', pos: '50% 46%', tone: 'soft' as const},
  {file: 'raw/chip-trench.jpg', label: ru ? 'ПЛАЩ' : 'TRENCH', pos: '50% 58%', tone: 'muted' as const},
  {file: 'raw/chip-heels.jpg', label: ru ? 'ЛОДОЧКИ' : 'HEELS', pos: '50% 50%', tone: 'soft' as const},
];

function Staples({ru}: {ru: boolean}) {
  const st = t.staples;
  const chips = stapleChips(ru);
  return <AbsoluteFill>
    <Serif top={176} size={58} at={st.headline}>
      {ru ? <>Вечные базы,</> : <>Timeless staples,</>}
    </Serif>
    <Serif top={244} size={58} at={st.sub} italic>
      {ru ? <>не тренды.</> : <>not trends.</>}
    </Serif>
    {chips.map((chip, i) => {
      const x = 96 + i * 300;
      const at = st.grid + i * st.gap;
      return <div key={chip.label} style={{position: 'absolute', left: x, top: 462, width: 284}}>
        <Frame file={chip.file} x={0} y={0} w={284} h={376} at={at} from={i === 1 ? 'up' : 'left'}
          position={chip.pos} tone={chip.tone}/>
        <Mono x={0} y={406} size={17} spacing={3} color={GREY} at={at + .3} w={284} align="center">{chip.label}</Mono>
      </div>;
    })}
  </AbsoluteFill>;
}

function Worn({ru}: {ru: boolean}) {
  const w = t.worn;
  return <AbsoluteFill>
    <Frame file="raw/bw-chair.jpg" x={240} y={408} w={600} h={800} at={w.plate} from="up"
      position="50% 30%" tone="bw"/>
    <Serif top={1278} size={46} at={w.caption} italic>
      {ru ? <>куплено один раз — носится годами.</> : <>bought once. worn for years.</>}
    </Serif>
  </AbsoluteFill>;
}

function Question({ru}: {ru: boolean}) {
  const q = t.question;
  return <AbsoluteFill>
    <Mono x={0} y={408} size={20} color={GREY} at={q.ask} align="center" spacing={4}>
      {ru ? 'ТАК СПРОСИТЕ СЕБЯ —' : 'SO ASK YOURSELF —'}
    </Mono>
    <Serif top={486} size={100} at={q.lineOne}>
      {ru ? <>Кем вы</> : <>Who are you</>}
    </Serif>
    <Serif top={600} size={100} at={q.lineTwo} italic>
      {ru ? <>становитесь?</> : <>becoming?</>}
    </Serif>
    <Mono x={0} y={920} size={20} color={GREY} at={q.askTwo} align="center" spacing={4}>
      {ru ? 'И ЧТО ЛЮДИ ДОЛЖНЫ' : 'AND WHAT SHOULD PEOPLE'}
    </Mono>
    <Serif top={988} size={64} at={q.lineThree} italic>
      {ru ? <>о вас запомнить?</> : <>remember about you?</>}
    </Serif>
  </AbsoluteFill>;
}

function App({ru}: {ru: boolean}) {
  const s = useS();
  const a = t.app;
  const {fps} = useVideoConfig();
  const swap = m(s, [a.swap, a.swap + .3], [100, 0]);
  return <AbsoluteFill>
    <Mono x={0} y={276} size={19} color={GREY} at={a.label} align="center" spacing={3.4}>
      {ru ? 'ОБРАЗЫ ИЗ ВЕЩЕЙ, ЧТО УЖЕ ЕСТЬ' : 'OUTFITS FROM THE CLOTHES YOU ALREADY OWN'}
    </Mono>
    {/* real app recording inside the same white frame language */}
    <div style={{
      position: 'absolute', left: 290, top: 372, width: 500, height: 1020,
      background: WHITE, padding: 14,
      boxShadow: '0 14px 36px rgba(20, 19, 16, .16), 0 3px 10px rgba(20, 19, 16, .08)',
      opacity: m(s, [a.plate, a.plate + .2], [0, 1]),
      translate: `0 ${m(s, [a.plate, a.plate + .55], [26, 0])}px`,
    }}>
      <div style={{position: 'absolute', inset: 14, overflow: 'hidden', background: '#f2f1ec'}}>
        <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')}
          trimBefore={frameAt(a.category, fps)} muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
        <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 ${swap}% 0)`}}>
          <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')}
            trimBefore={frameAt(a.result, fps)} muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
        </div>
      </div>
    </div>
    <Mono x={0} y={1470} size={26} color={INK} at={a.wordmark} align="center" spacing={9} weight={600}>
      AIWARDROBE
    </Mono>
  </AbsoluteFill>;
}

function Close({ru}: {ru: boolean}) {
  const c = t.close;
  const s = useS();
  return <AbsoluteFill>
    <Serif top={686} size={78} at={c.lineOne}>
      {ru ? <>Одевайтесь для того,</> : <>Dress for who</>}
    </Serif>
    <Serif top={772} size={78} at={c.lineTwo} italic>
      {ru ? <>кем вы становитесь.</> : <>you&rsquo;re becoming.</>}
    </Serif>
    <div style={{
      position: 'absolute', left: 420, top: 926, width: 240, height: 1.5, background: INK,
      scale: `${m(s, [c.rule, c.rule + .4], [0, 1])} 1`, transformOrigin: '50% 50%',
    }}/>
    <Mono x={0} y={972} size={28} color={INK} at={c.wordmark} align="center" spacing={10} weight={600}>
      AIWARDROBE
    </Mono>
    <Mono x={0} y={1036} size={17} color={FAINT} at={c.micro} align="center" spacing={3}>
      {ru ? 'ГАРДЕРОБ, КОТОРЫЙ РАБОТАЕТ НА БУДУЩЕЕ' : 'A WARDROBE THAT WORKS FOR WHO YOU’RE BECOMING'}
    </Mono>
  </AbsoluteFill>;
}

// ———————————————————————————————— cut ————————————————————————————————

const beatList: Array<{key: keyof typeof t; node: (ru: boolean) => ReactNode; first?: boolean; last?: boolean}> = [
  {key: 'hook', node: (ru) => <Hook ru={ru}/>, first: true},
  {key: 'closet', node: (ru) => <Closet ru={ru}/>},
  {key: 'bubbles', node: (ru) => <Bubbles ru={ru}/>},
  {key: 'october', node: (ru) => <October ru={ru}/>},
  {key: 'street', node: (ru) => <Street ru={ru}/>},
  {key: 'search', node: (ru) => <Search ru={ru}/>},
  {key: 'card', node: (ru) => <Card ru={ru}/>},
  {key: 'staples', node: (ru) => <Staples ru={ru}/>},
  {key: 'worn', node: (ru) => <Worn ru={ru}/>},
  {key: 'question', node: (ru) => <Question ru={ru}/>},
  {key: 'app', node: (ru) => <App ru={ru}/>},
  {key: 'close', node: (ru) => <Close ru={ru}/>, last: true},
];

function BecomingCut({ru}: {ru: boolean}) {
  const {fps} = useVideoConfig();
  return <AbsoluteFill lang={ru ? 'ru' : 'en'}
    style={{background: WHITE, color: INK, fontFamily: b.serif, overflow: 'hidden'}}>
    <Audio src={asset('score.wav')}/>
    {beatList.map(({key, node, first, last}) => {
      const scene = t[key] as {from: number; seconds: number};
      return <Sequence key={key} name={key} from={frameAt(scene.from, fps)}
        durationInFrames={frameAt(scene.seconds, fps)}>
        <Beat seconds={scene.seconds} first={first} last={last}>
          {node(ru)}
        </Beat>
      </Sequence>;
    })}
  </AbsoluteFill>;
}

export function WardrobeBecoming() {
  return <BecomingCut ru={false}/>;
}

export function WardrobeBecomingRu() {
  return <BecomingCut ru={true}/>;
}
