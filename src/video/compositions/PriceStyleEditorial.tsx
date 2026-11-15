import {type ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence,
  interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {priceStyleBrand as b} from '../theme';
import {priceStyleTimeline as t} from '../timeline';

const asset = (name: string) => staticFile(`assets/aiw-price-style/${name}`);
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

// Cutout figures keep their natural aspect; boxes are height-driven.
const figureAspect: Record<string, number> = {
  'capsule-elegant/hook-tailored.png': 760 / 1264,
  'capsule-elegant/cream-0-cut.png': 921 / 1774,
  'capsule-elegant/navy-0-cut.png': 848 / 1568,
  'wardrobe-models-hd/coat.png': 930 / 2503,
};

function Figure({file, x, yTop, h, z = 1, opacity = 1, translate = '0 0', rotate = 0, scale = 1, origin = '50% 50%'}: {
  file: keyof typeof figureAspect & string; x: number; yTop: number; h: number;
  z?: number; opacity?: number; translate?: string; rotate?: number; scale?: number; origin?: string;
}) {
  const w = Math.round(h * figureAspect[file]);
  return <Img src={staticFile(`assets/${file}`)} style={{
    position: 'absolute', left: x, top: yTop, width: w, height: h, zIndex: z,
    opacity, translate, rotate: `${rotate}deg`, scale: `${scale}`, transformOrigin: origin,
    filter: 'drop-shadow(7px 11px 9px rgba(28, 25, 18, .18))',
    userSelect: 'none',
  }}/>;
}

function Plate({src, x, y, w, h, at, from = 'up', rotate = 0, position = '50% 50%', z = 1, shadow = true}: {
  src: string; x: number; y: number; w: number; h: number; at: number;
  from?: 'up' | 'left' | 'right'; rotate?: number; position?: string; z?: number; shadow?: boolean;
}) {
  const s = useS();
  const enter = m(s, [at, at + .5], [0, 1]);
  const masked = 100 * (1 - enter);
  const inset = from === 'up' ? `0 0 ${masked}% 0` : from === 'left' ? `${masked}% 0 0 0` : `0 ${masked}% 0 0`;
  return <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z, rotate: `${rotate}deg`,
    opacity: m(s, [at, at + .14], [0, 1]),
    boxShadow: shadow ? b.plateShadow : undefined, background: b.paperDeep,
  }}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `inset(${inset})`}}>
      <Img src={staticFile(src)} style={{
        width: '100%', height: '100%', objectFit: 'cover', objectPosition: position,
        scale: m(s, [at + .5, at + 4], [1.06, 1]), translate: `0 ${m(s, [at + .5, at + 4], [0, -8])}px`,
      }}/>
    </div>
  </div>;
}

function Mono({children, x, y, size = 24, color = b.ink, at = 0, spacing = 2, weight = 500, opacity = 1, align}: {
  children: ReactNode; x?: number; y: number; size?: number; color?: string; at?: number;
  spacing?: number; weight?: number; opacity?: number; align?: 'center';
}) {
  const s = useS();
  return <div style={{
    position: 'absolute', left: x, top: y, width: align === 'center' ? '100%' : undefined,
    textAlign: align, fontFamily: b.mono, fontSize: size, letterSpacing: spacing,
    color, fontWeight: weight, whiteSpace: 'nowrap',
    opacity: opacity * m(s, [at, at + .26], [0, 1]),
    translate: `0 ${m(s, [at, at + .4], [10, 0])}px`,
  }}>{children}</div>;
}

function Kicker({children, x, y, at, dark = false}: {children: ReactNode; x: number; y: number; at: number; dark?: boolean}) {
  const s = useS();
  return <div style={{
    position: 'absolute', left: x, top: y, fontFamily: b.mono, fontSize: 21, letterSpacing: 3.2,
    color: dark ? b.paperOnDark : b.ink, border: `1px solid ${dark ? 'rgba(236,234,218,.5)' : b.ink}`,
    padding: '10px 18px 8px', opacity: m(s, [at, at + .26], [0, 1]),
    scale: `${m(s, [at, at + .34], [1.12, 1], pop)} 1`,
  }}>{children}</div>;
}

function Tag({children, x, y, rotate, at}: {children: ReactNode; x: number; y: number; rotate: number; at: number}) {
  const s = useS();
  return <div style={{
    position: 'absolute', left: x, top: y, rotate: `${rotate}deg`, fontFamily: b.mono,
    fontSize: 27, letterSpacing: 1, color: b.ink, background: b.paper,
    border: `1.5px solid ${b.ink}`, padding: '9px 15px 7px',
    boxShadow: '0 8px 20px rgba(28,25,18,.14)',
    opacity: m(s, [at, at + .1], [0, 1]),
    scale: `${m(s, [at, at + .3], [.5, 1], pop)} 1`,
    translate: `0 ${m(s, [at, at + .34], [-16, 0], pop)}px`,
  }}>{children}</div>;
}

// Didot display line with misregistered double-print: a ghost copy
// converges into the main line as it rises out of its mask.
function EchoLine({children, top, size, at, italic = false, align = 'center', color = b.ink, ghost = true, weight = 400}: {
  children: ReactNode; top: number; size: number; at: number; italic?: boolean;
  align?: 'center' | 'left'; color?: string; ghost?: boolean; weight?: number;
}) {
  const s = useS();
  const enter = m(s, [at, at + .2], [0, 1]);
  const settle = m(s, [at, at + .5], [1, 0]);
  return <div style={{
    position: 'absolute', left: align === 'left' ? 84 : 0, right: align === 'left' ? 84 : 0, top,
    textAlign: align,
    fontFamily: b.display, fontSize: size, fontWeight: weight,
    fontStyle: italic ? 'italic' : 'normal', letterSpacing: -size * .032,
    lineHeight: 1.02, color, overflow: 'hidden', padding: '2px 0 10px',
  }}>
    {ghost ? <div style={{
      position: 'absolute', inset: 0, color,
      opacity: .26 * settle * enter, translate: `${8 * settle}px ${6 * settle}px`,
    }}>{children}</div> : null}
    <div style={{
      translate: `0 ${m(s, [at, at + .52], [112, 0])}%`,
      opacity: enter,
    }}>{children}</div>
  </div>;
}

function Rule({y, at, x0 = 84, x1 = 996, color = b.ink, thickness = 1}: {y: number; at: number; x0?: number; x1?: number; color?: string; thickness?: number}) {
  const s = useS();
  const w = x1 - x0;
  return <div style={{
    position: 'absolute', left: x0, top: y, width: w, height: thickness, background: color,
    scale: `${m(s, [at, at + .4], [0, 1])} 1`, transformOrigin: '50% 50%',
  }}/>;
}

function Crosshair({x, y, at, color = b.ink}: {x: number; y: number; at: number; color?: string}) {
  const s = useS();
  const o = m(s, [at, at + .3], [0, .55]);
  return <div style={{position: 'absolute', left: x - 11, top: y - 11, width: 22, height: 22, opacity: o}}>
    <div style={{position: 'absolute', left: 0, top: 10, width: 22, height: 1, background: color}}/>
    <div style={{position: 'absolute', left: 10, top: 0, width: 1, height: 22, background: color}}/>
  </div>;
}

function Leader({path, point, at, color = b.ink}: {path: string; point: [number, number]; at: number; color?: string}) {
  const s = useS();
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6}}>
    <path d={path} fill="none" stroke={color} strokeWidth={1.6} pathLength={1}
      strokeDasharray={1} strokeDashoffset={m(s, [at, at + .55], [1, 0])}/>
    <circle cx={point[0]} cy={point[1]} r={5} fill={color} opacity={m(s, [at + .42, at + .6], [0, 1])}/>
  </svg>;
}

function Cursor({from, to, at, clickAt, note}: {from: [number, number]; to: [number, number]; at: number; clickAt: number; note: string}) {
  const s = useS();
  const p = m(s, [at, at + .85], [0, 1]);
  const x = from[0] + (to[0] - from[0]) * p + Math.sin(p * Math.PI) * 60;
  const y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * 40;
  const ring = m(s, [clickAt, clickAt + .3], [0, 1]);
  return <>
    <div style={{
      position: 'absolute', left: x, top: y, zIndex: 8, opacity: m(s, [at - .05, at + .1], [0, 1]),
    }}>
      <svg width={44} height={52} viewBox="0 0 44 52">
        <path d="M6 2 L6 40 L15 31 L21 46 L28 43 L22 29 L34 29 Z"
          fill="#f6f4ec" stroke="#1a1916" strokeWidth={2.4} strokeLinejoin="round"/>
      </svg>
    </div>
    <div style={{
      position: 'absolute', left: to[0] - 26, top: to[1] - 26, width: 52, height: 52, borderRadius: 26,
      border: '2px solid #f6f4ec', zIndex: 7,
      opacity: ring * (1 - ring) * 4,
      transform: `scale(${.6 + ring * .8})`,
    }}/>
    <Mono x={to[0] + 40} y={to[1] - 16} size={23} color="#f6f4ec" at={clickAt + .12}>{note}</Mono>
  </>;
}

function PieceList({lines, x, y, at, gap, dark = false, size = 26}: {
  lines: string[]; x: number; y: number; at: number; gap: number; dark?: boolean; size?: number;
}) {
  const s = useS();
  return <div style={{position: 'absolute', left: x, top: y}}>
    {lines.map((line, i) => <div key={line} style={{
      fontFamily: b.mono, fontSize: size, letterSpacing: 1.6, whiteSpace: 'nowrap',
      color: dark ? b.paperOnDark : b.ink, marginBottom: gap * 1.15,
      opacity: m(s, [at + i * .14, at + .24 + i * .14], [0, 1]),
      translate: `${m(s, [at + i * .14, at + .4 + i * .14], [-26, 0])}px 0`,
    }}>{line}</div>)}
  </div>;
}

function TotalStamp({children, x, y, at, dark = false, accent = true}: {children: ReactNode; x: number; y: number; at: number; dark?: boolean; accent?: boolean}) {
  const s = useS();
  return <div style={{
    position: 'absolute', left: x, top: y, fontFamily: b.mono, fontSize: 30, letterSpacing: 2.4,
    color: dark ? b.paperOnDark : b.ink,
    border: `2px solid ${accent ? (dark ? '#c5937a' : b.accent) : (dark ? b.paperOnDark : b.ink)}`,
    padding: '14px 22px 12px', whiteSpace: 'nowrap',
    opacity: m(s, [at, at + .12], [0, 1]),
    scale: `${m(s, [at, at + .32], [1.5, 1], pop)} 1`,
    rotate: m(s, [at, at + .32], [-3, -1.2], pop) + 'deg',
    boxShadow: dark ? '0 10px 30px rgba(0,0,0,.4)' : '0 10px 26px rgba(28,25,18,.12)',
    zIndex: 8,
  }}>{children}</div>;
}

// ———————————————————————————————— scenes ————————————————————————————————

function Hook({ru}: {ru: boolean}) {
  const s = useS();
  const h = t.hook;
  const push = interpolate(s, [0, h.seconds], [1, 1.038], clamp);
  // Model 1 — fast cinematic crop: start pushed into the lapel, pull back.
  const crop = m(s, [h.firstIn, h.firstEnd], [0, 1]);
  const cropScale = interpolate(crop, [0, 1], [2.15, 1]);
  // Model 2 — masked slide with parallax lag.
  const slide = m(s, [h.secondIn, h.secondEnd], [0, 1]);
  // Model 3 — paper-cut split halves.
  const split = m(s, [h.thirdIn, h.thirdEnd], [0, 1]);
  const seam = 1 - m(s, [h.thirdEnd - .06, h.seamFade], [0, 1]);
  const chipAt = (i: number) => h.chips + i * .1;
  const chips = [
    {x: 112, y: 1598, label: '$272'},
    {x: 452, y: 1624, label: '$128'},
    {x: 794, y: 1598, label: '$244'},
  ];
  return <AbsoluteFill>
    <div style={{position: 'absolute', inset: 0, scale: `${push}`}}>
      {/* Model 1 — Italian tailoring, cropped tight then pulled back */}
      <div style={{position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden'}}>
        <Figure file="capsule-elegant/hook-tailored.png" x={24} yTop={510} h={1030} z={1}
          scale={cropScale} origin="50% 24%" opacity={m(s, [h.firstIn, h.firstIn + .08], [.9, 1])}/>
      </div>
      {/* Model 2 — Quiet luxury cream knit & tailored trousers, masked slide from right */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        clipPath: `inset(0 ${100 - slide * 100}% 0 0)`,
      }}>
        <Figure file="capsule-elegant/cream-0-cut.png" x={268 + (1 - slide) * 240} yTop={486} h={1090} z={2}/>
      </div>
      {/* Model 3 — Modern evening midnight velvet, paper-cut split reveal */}
      <div style={{position: 'absolute', inset: 0, zIndex: 2}}>
        <div style={{
          position: 'absolute', inset: 0, clipPath: 'inset(0 0 47% 0)',
          opacity: m(s, [h.thirdIn - .02, h.thirdIn + .04], [0, 1]),
        }}>
          <Figure file="capsule-elegant/navy-0-cut.png" x={562 + (1 - split) * -460} yTop={500} h={1060} z={1}/>
        </div>
        <div style={{
          position: 'absolute', inset: 0, clipPath: 'inset(53% 0 0 0)',
          opacity: m(s, [h.thirdIn - .02, h.thirdIn + .04], [0, 1]),
        }}>
          <Figure file="capsule-elegant/navy-0-cut.png" x={562 + (1 - split) * 460} yTop={500} h={1060} z={1}/>
        </div>
        <div style={{
          position: 'absolute', left: 530, top: 500 + 1060 * .525, width: 520, height: 3,
          background: b.paper, zIndex: 3, opacity: seam,
        }}/>
      </div>
      {/* Price chips plant the thesis while the figures are still landing */}
      {chips.map((chip, i) => <TotalStamp key={chip.label} x={chip.x} y={chip.y} at={chipAt(i)}>{chip.label}</TotalStamp>)}
      <EchoLine top={148} size={ru ? 96 : 114} at={h.headline}>
        {ru ? <>ЦЕНА НЕ СОЗДАЁТ</> : <>PRICE DOESN&rsquo;T</>}
      </EchoLine>
      <EchoLine top={266} size={ru ? 96 : 114} at={h.headline + .12} italic>
        {ru ? <>СТИЛЬ.</> : <>CREATE STYLE.</>}
      </EchoLine>
      <Rule y={836} at={h.rule} thickness={1.5} color="rgba(33,32,27,.36)"/>
      <Crosshair x={70} y={146} at={h.marks}/>
      <Crosshair x={1010} y={146} at={h.marks + .08}/>
      <Crosshair x={70} y={1754} at={h.marks + .12}/>
      <Crosshair x={1010} y={1754} at={h.marks + .16}/>
    </div>
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 112, textAlign: 'center',
      fontFamily: b.mono, fontSize: 22, letterSpacing: 3.4, color: b.muted,
      opacity: m(s, [h.headline + .4, h.headline + .65], [0, 1]),
    }}>
      {ru ? 'ТРИ ОБРАЗА. ТРИ ЦЕНЫ.' : 'THREE LOOKS. THREE PRICES.'}
    </div>
  </AbsoluteFill>;
}

function Problem({ru}: {ru: boolean}) {
  const s = useS();
  const p = t.problem;
  const caps = p.capsule;
  // Two-phase wipe: rise to cover, hold one frame, continue up out of frame.
  const cover = m(s, [caps, caps + .22], [100, 0]);
  const reveal = m(s, [caps + .23, caps + .46], [0, -100]);
  const wipe = s < caps + .23 ? cover : reveal;
  const tags = [
    {x: 118, y: 460, r: -7, label: '$120'},
    {x: 742, y: 490, r: 5, label: '$85'},
    {x: 92, y: 1110, r: -4, label: '$240'},
    {x: 762, y: 1140, r: 8, label: '$60'},
    {x: 430, y: 418, r: -6, label: '$150'},
  ];
  const items = [
    {file: 'raw/chip-knits.jpg', name: ru ? 'СВИТЕР' : 'KNIT', price: '$48'},
    {file: 'raw/chip-tees.jpg', name: ru ? 'ФУТБОЛКА' : 'TEE', price: '$22'},
    {file: 'raw/chip-jeans.jpg', name: ru ? 'ДЖИНСЫ' : 'JEANS', price: '$40'},
    {file: 'raw/chip-denim.jpg', name: ru ? 'ДЖИНСА' : 'DENIM', price: '$58'},
    {file: 'raw/chip-shoes-black.jpg', name: ru ? 'ДЕРБИ' : 'DERBIES', price: '$95'},
    {file: 'raw/chip-shoes-brown.jpg', name: ru ? 'ЛОФЕРЫ' : 'LOAFERS', price: '$110'},
  ];
  return <AbsoluteFill>
    {/* Beat A — the impulse pile */}
    <div style={{position: 'absolute', inset: 0, opacity: 1 - m(s, [caps - .04, caps + .06], [0, 1])}}>
      <Plate src="assets/aiw-becoming/raw/plate-rack.jpg" x={230} y={480} w={600} h={690} at={p.bags} from="left" rotate={-2.5}/>
      {tags.map((tag, i) => <Tag key={tag.label} x={tag.x} y={tag.y} rotate={tag.r} at={p.tags + i * p.tagGap}>{tag.label}</Tag>)}
      <div style={{
        position: 'absolute', left: 84, right: 84, top: 1290, textAlign: 'center',
        fontFamily: b.mono, fontSize: 34, letterSpacing: 4, color: b.ink,
        opacity: m(s, [p.impulseNote, p.impulseNote + .3], [0, 1]),
      }}>
        <span style={{position: 'relative', display: 'inline-block'}}>
          {ru ? 'КУПЛЕНО СПОНТАННО.' : 'BOUGHT ON IMPULSE.'}
          <span style={{
            position: 'absolute', left: '-4%', right: '-4%', top: '54%', height: 2.5,
            background: b.accent, scale: `${m(s, [p.strike, p.strike + .4], [0, 1])} 1`,
            transformOrigin: '0 50%', rotate: '-1.6deg',
          }}/>
        </span>
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 1360, textAlign: 'center',
        fontFamily: b.serif, fontStyle: 'italic', fontSize: 44, color: b.muted,
        opacity: m(s, [p.strike + .28, p.strike + .56], [0, 1]),
      }}>{ru ? 'Надето один раз.' : 'Worn once.'}</div>
    </div>
    {/* Vertical paper wipe */}
    <div style={{
      position: 'absolute', left: 0, right: 0, height: '105%', background: b.paper,
      zIndex: 9, translate: `0 ${wipe}%`, boxShadow: '0 -10px 34px rgba(28,25,18,.12)',
    }}/>
    {/* Beat B — the considered capsule */}
    <div style={{position: 'absolute', inset: 0}}>
      <EchoLine top={268} size={ru ? 76 : 64} at={p.headline}>
        {ru ? <>СТИЛЬ — НЕ ЦЕНА.</> : <>STYLE ISN&rsquo;T WHAT YOU SPEND.</>}
      </EchoLine>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 396, textAlign: 'center',
        fontFamily: b.serif, fontStyle: 'italic', fontSize: 45, color: b.muted,
        opacity: m(s, [p.sub, p.sub + .3], [0, 1]),
      }}>{ru ? 'Он — про сочетания.' : 'It’s what you combine.'}</div>
      {items.map((item, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const at = p.grid + i * p.gridGap;
        return <div key={item.file} style={{
          position: 'absolute', left: 150 + col * 480, top: 620 + row * 268,
          width: 300, opacity: m(s, [at, at + .12], [0, 1]),
          translate: `0 ${m(s, [at, at + .44], [46, 0])}px`,
          boxShadow: b.plateShadow,
        }}>
          <div style={{width: 300, height: 204, overflow: 'hidden', background: b.paperDeep}}>
            <Img src={asset(item.file)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              scale: m(s, [at + .44, at + 2.6], [1.07, 1]),
            }}/>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', background: b.paper,
            borderTop: `1px solid ${b.ink}`, padding: '10px 12px 8px',
            fontFamily: b.mono, fontSize: 20, letterSpacing: 1.6,
          }}>
            <span>{item.name}</span><span style={{color: b.accent}}>{item.price}</span>
          </div>
        </div>;
      })}
      <Mono x={0} y={1480} size={22} color={b.muted} at={p.note} align="center" spacing={3}>
        {ru ? 'ШЕСТЬ ВЕЩЕЙ — ОСНОВА КАЖДОГО ОБРАЗА ЭТОГО ФИЛЬМА' : 'SIX PIECES BEHIND EVERY LOOK IN THIS FILM'}
      </Mono>
      <Rule y={1556} at={p.note + .2} color={b.line}/>
    </div>
  </AbsoluteFill>;
}

function LookOne({ru}: {ru: boolean}) {
  const s = useS();
  const l = t.lookOne;
  const enter = m(s, [l.figure, l.figure + .5], [0, 1]);
  const listY = 1280;
  return <AbsoluteFill>
    <div style={{
      position: 'absolute', inset: 0, clipPath: `inset(${100 - enter * 100}% 0 0 0)`,
    }}>
      <Figure file="capsule-elegant/hook-tailored.png" x={450} yTop={540 + (1 - enter) * 140} h={1240} z={2}/>
    </div>
    {/* Archival lapel detail plate — magazine-page layering */}
    <Plate src="assets/wardrobe-models-hd/lapel-close.jpg" x={84} y={760} w={310} h={390}
      at={l.headline + .35} from="left" rotate={-2} z={3}/>
    <Kicker x={84} y={248} at={l.headline}>{ru ? 'ОБРАЗ 01' : 'LOOK 01'}</Kicker>
    <EchoLine top={318} size={96} at={l.headline + .06} align="left">
      {ru ? <>Современный</> : <>Modern</>}
    </EchoLine>
    <EchoLine top={422} size={96} at={l.headline + .16} align="left" italic>
      {ru ? <>костюм.</> : <>Tailoring.</>}
    </EchoLine>
    <div style={{
      position: 'absolute', left: 88, top: 556, fontFamily: b.serif, fontStyle: 'italic',
      fontSize: 40, color: b.muted, opacity: m(s, [l.sub, l.sub + .3], [0, 1]),
    }}>{ru ? 'Строгий крой — без напряжения.' : 'Structure, worn relaxed.'}</div>
    <Leader path="M84 680 H420 L552 895" point={[552, 895]} at={l.leader}/>
    <Mono x={84} y={638} size={21} color={b.muted} at={l.leader + .3}>
      {ru ? 'МЯГКОЕ ПЛЕЧО — ПОЛУКАРКАС' : 'SOFT SHOULDER — HALF-CANVAS'}
    </Mono>
    <PieceList at={l.list} gap={13} x={84} y={listY} lines={ru
      ? ['ПИДЖАК — $168', 'РУБАШКА — $42', 'ГАЛСТУК И БРЮКИ — $62']
      : ['TAILORED JACKET — $168', 'STRIPED SHIRT — $42', 'TIE & TROUSERS — $62']}/>
    <TotalStamp x={84} y={1560} at={l.total}>{ru ? 'ОБРАЗ — $272' : 'FULL LOOK — $272'}</TotalStamp>
    <Rule y={1776} at={l.figure + .3} color={b.line}/>
  </AbsoluteFill>;
}

function LookTwo({ru}: {ru: boolean}) {
  const s = useS();
  const l = t.lookTwo;
  const enter = m(s, [l.figure, l.figure + .5], [0, 1]);
  const swatches = [
    {c: '#e6dfd0', label: ru ? 'КРЕМ' : 'CREAM'},
    {c: '#d9d1c2', label: ru ? 'ОВЁС' : 'OAT'},
    {c: '#b7afa1', label: ru ? 'КАМЕНЬ' : 'STONE'},
  ];
  return <AbsoluteFill>
    <div style={{
      position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${100 - enter * 100}%)`,
    }}>
      <Figure file="capsule-elegant/cream-0-cut.png" x={68 + (1 - enter) * -160} yTop={560} h={1210} rotate={-1.5}/>
    </div>
    <EchoLine top={256} size={92} at={l.headline} italic>
      {ru ? <>Тихая роскошь.</> : <>Quiet Luxury.</>}
    </EchoLine>
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 392, textAlign: 'center',
      fontFamily: b.serif, fontStyle: 'italic', fontSize: 42, color: b.muted,
      opacity: m(s, [l.sub, l.sub + .3], [0, 1]),
    }}>{ru ? 'Фактура вместо логотипов.' : 'Texture over logos.'}</div>
    {/* Macro knitwear construction detail print falls onto the page */}
    <div style={{
      position: 'absolute', left: 590, top: 920, width: 380, height: 390,
      boxShadow: b.plateShadow, rotate: '2.2deg', zIndex: 4,
      opacity: m(s, [l.print, l.print + .12], [0, 1]),
      translate: `0 ${m(s, [l.print, l.print + .55], [-170, 0], pop)}px`,
      overflow: 'hidden', background: b.paperDeep,
    }}>
      <Img src={staticFile('assets/wardrobe-models-hd/knit-detail.jpg')} style={{
        width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 45%',
      }}/>
    </div>
    <PieceList at={l.list} gap={13} x={590} y={520} lines={ru
      ? ['КАШЕМИР — $58', 'БРЮКИ — $70']
      : ['CASHMERE KNIT — $58', 'PLEATED TROUSERS — $70']}/>
    {swatches.map((sw, i) => <div key={sw.label} style={{
      position: 'absolute', left: 590 + i * 128, top: 740, opacity: m(s, [l.swatches + i * .1, l.swatches + .2 + i * .1], [0, 1]),
    }}>
      <div style={{width: 92, height: 92, background: sw.c, border: `1px solid ${b.line}`, boxShadow: '0 6px 16px rgba(28,25,18,.10)'}}/>
      <div style={{marginTop: 8, fontFamily: b.mono, fontSize: 17, letterSpacing: 2, color: b.muted, textAlign: 'center'}}>{sw.label}</div>
    </div>)}
    <TotalStamp x={590} y={1400} at={l.total}>{ru ? 'ОБРАЗ — $128' : 'FULL LOOK — $128'}</TotalStamp>
    <Rule y={1776} at={l.figure + .3} color={b.line}/>
  </AbsoluteFill>;
}

function LookThree({ru}: {ru: boolean}) {
  const s = useS();
  const l = t.lookThree;
  const panel = m(s, [l.panel, l.panel + .42], [0, 1]);
  const figIn = m(s, [l.figure, l.figure + .55], [0, 1]);
  return <AbsoluteFill>
    <EchoLine top={256} size={86} at={l.headline} italic>
      {ru ? <>Вечерний образ.</> : <>Refined Evening.</>}
    </EchoLine>
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 382, textAlign: 'center',
      fontFamily: b.serif, fontStyle: 'italic', fontSize: 40, color: b.muted,
      opacity: m(s, [l.sub, l.sub + .3], [0, 1]),
    }}>{ru ? 'Один тёмный слой решает всё.' : 'One dark layer does it.'}</div>
    <div style={{
      position: 'absolute', left: 84, top: 470, width: 912, height: 1190,
      background: b.dark, clipPath: `inset(0 ${100 - panel * 100}% 0 0)`,
      boxShadow: b.shadow,
    }}/>
    <div style={{
      position: 'absolute', left: 84, top: 470, width: 912, height: 1190, overflow: 'hidden',
      clipPath: `inset(0 ${100 - panel * 100}% 0 0)`,
    }}>
      {/* echo ghost of the arriving figure */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: (1 - m(s, [l.figure + .3, l.figure + .8], [0, 1])) * .2 * figIn,
      }}>
        <Figure file="capsule-elegant/navy-0-cut.png" x={300} yTop={10} h={1220} z={1} opacity={1}/>
      </div>
      <Figure file="capsule-elegant/navy-0-cut.png" x={330} yTop={10 + (1 - figIn) * -170} h={1220} z={2}
        opacity={m(s, [l.figure, l.figure + .12], [0, 1])}/>
      {/* white mono caption + total live on the dark stage */}
      <PieceList at={l.list} gap={13} x={48} y={590} dark size={22} lines={ru
        ? ['БАРХАТ — $164', 'ВОДОЛАЗКА — $45', 'БРЮКИ — $35']
        : ['VELVET JACKET — $164', 'CREAM KNIT — $45', 'TROUSERS — $35']}/>
      <TotalStamp x={48} y={850} at={l.total} dark>{ru ? 'ОБРАЗ — $244' : 'FULL LOOK — $244'}</TotalStamp>
    </div>
    <Cursor from={[150, 1360]} to={[612, 920]} at={l.cursor} clickAt={l.cursorClick}
      note={ru ? 'БАРХАТНЫЙ ЛАЦКАН' : 'VELVET LAPEL'}/>
  </AbsoluteFill>;
}

const matrixChips = [
  {file: 'raw/chip-tees.jpg', name: 'TEE $22', ru: 'ФУТБОЛКА $22', col: 0, row: 0},
  {file: 'raw/chip-jeans.jpg', name: 'JEANS $40', ru: 'ДЖИНСЫ $40', col: 0, row: 1},
  {file: 'raw/chip-knits.jpg', name: 'KNIT $48', ru: 'СВИТЕР $48', col: 1, row: 0},
  {file: 'raw/chip-denim.jpg', name: 'DENIM $58', ru: 'ДЖИНСА $58', col: 1, row: 1},
  {file: 'raw/chip-shoes-brown.jpg', name: 'LOAFERS $110', ru: 'ЛОФЕРЫ $110', col: 2, row: 0},
  {file: 'raw/chip-shoes-black.jpg', name: 'DERBIES $95', ru: 'ДЕРБИ $95', col: 2, row: 1},
];

function Matrix({ru}: {ru: boolean}) {
  const s = useS();
  const g = t.matrix;
  const figures = [
    {file: 'capsule-elegant/hook-tailored.png' as const, x: 90, h: 430},
    {file: 'capsule-elegant/cream-0-cut.png' as const, x: 422, h: 452},
    {file: 'capsule-elegant/navy-0-cut.png' as const, x: 744, h: 444},
  ];
  const counterIn = m(s, [g.counter, g.counter + .3], [0, 1], pop);
  const outfitsIn = m(s, [g.outfits, g.outfits + .34], [0, 1], pop);
  return <AbsoluteFill>
    <EchoLine top={196} size={ru ? 64 : 76} at={g.headline}>
      {ru ? <>Шесть вещей. Двенадцать образов.</> : <>Six pieces. Twelve outfits.</>}
    </EchoLine>
    {figures.map((f, i) => <div key={f.file} style={{
      position: 'absolute', inset: 0,
      opacity: m(s, [g.figures + i * g.figureGap, g.figures + .1 + i * g.figureGap], [0, 1]),
      translate: `0 ${m(s, [g.figures + i * g.figureGap, g.figures + .55 + i * g.figureGap], [300, 0])}px`,
    }}>
      <Figure file={f.file} x={f.x} yTop={1004 - f.h} h={f.h} z={2 - (i === 1 ? 0 : 1)}/>
    </div>)}
    {matrixChips.map((chip, i) => {
      const at = g.grid + i * g.gridGap;
      return <div key={chip.file} style={{
        position: 'absolute', left: 60 + chip.col * 326, top: 1052 + chip.row * 196,
        width: 268, opacity: m(s, [at, at + .12], [0, 1]),
        translate: `0 ${m(s, [at, at + .42], [40, 0])}px`,
        boxShadow: b.plateShadow,
      }}>
        <div style={{width: 268, height: 118, overflow: 'hidden', background: b.paperDeep}}>
          <Img src={asset(chip.file)} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
        </div>
        <div style={{
          fontFamily: b.mono, fontSize: 17.5, letterSpacing: 1.2, background: b.paper,
          borderTop: `1px solid ${b.ink}`, padding: '7px 10px 5px', whiteSpace: 'nowrap',
        }}>{ru ? chip.ru : chip.name}</div>
      </div>;
    })}
    <Rule y={1052 + 196 - 28} at={g.rules} x0={60} x1={996} color={b.line}/>
    {[394, 660].map((x, i) => <div key={x} style={{
      position: 'absolute', left: x, top: 1030, width: 1, height: 372, background: b.line,
      scale: `1 ${m(s, [g.rules + .12 + i * .1, g.rules + .5 + i * .1], [0, 1])}`, transformOrigin: '50% 0',
    }}/>)}
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 1508, textAlign: 'center',
      fontFamily: b.mono, fontSize: 56, letterSpacing: 4, whiteSpace: 'nowrap',
    }}>
      <span style={{opacity: counterIn, display: 'inline-block', translate: `0 ${(1 - counterIn) * 26}px`}}>
        {ru ? '6 ВЕЩЕЙ' : '6 PIECES'}
      </span>
      <span style={{
        color: b.accent, margin: '0 34px', opacity: m(s, [g.counter + .45, g.counter + .75], [0, 1]),
        display: 'inline-block', translate: `${m(s, [g.counter + .45, g.counter + .75], [-30, 0])}px 0`,
      }}>→</span>
      <span style={{
        color: b.accent, opacity: outfitsIn, display: 'inline-block',
        translate: `0 ${(1 - outfitsIn) * 26}px`,
        scale: `${.8 + outfitsIn * .2} 1`,
      }}>{ru ? '12 ОБРАЗОВ' : '12 OUTFITS'}</span>
    </div>
    <Mono x={0} y={1620} size={21} color={b.muted} at={g.outfits + .5} align="center" spacing={3}>
      {ru ? 'ОДИН ГАРДЕРОБ — МНОЖЕСТВО РЕШЕНИЙ' : 'ONE WARDROBE — ENDLESS DECISIONS, SOLVED'}
    </Mono>
  </AbsoluteFill>;
}

function AppScene({ru}: {ru: boolean}) {
  const s = useS();
  const a = t.app;
  const {fps} = useVideoConfig();
  const cardIn = m(s, [a.card, a.card + .55], [0, 1]);
  const swap = m(s, [a.category.until, a.category.until + .3], [100, 0]);
  return <AbsoluteFill>
    <EchoLine top={236} size={72} at={a.headline}>
      {ru ? <>Каждое сочетание —</> : <>Every combination,</>}
    </EchoLine>
    <EchoLine top={336} size={72} at={a.headline + .12} italic>
      {ru ? <>из вещей, что уже есть.</> : <>from clothes you own.</>}
    </EchoLine>
    <Mono x={0} y={496} size={21} color={b.muted} at={a.sub} align="center" spacing={3.4}>
      {ru ? 'AIWARDROBE — ОБРАЗЫ ИЗ ВАШЕГО ГАРДЕРОБА' : 'AIWARDROBE — OUTFITS FROM YOUR OWN CLOTHES'}
    </Mono>
    <div style={{
      position: 'absolute', left: 280, top: 596, width: 520, height: 1128,
      boxShadow: b.shadow, border: `1px solid ${b.line}`, background: b.dark,
      opacity: cardIn, scale: `${.93 + cardIn * .07}`,
      translate: `0 ${(1 - cardIn) * 64}px`, overflow: 'hidden',
    }}>
      <Sequence name="App — browsing" from={0} durationInFrames={frameAt(a.category.until + .3, fps)}>
        <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')}
          trimBefore={frameAt(a.category.source, fps)} muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
      </Sequence>
      <Sequence name="App — result" from={frameAt(a.category.until, fps)}>
        <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 ${swap}% 0)`}}>
          <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')}
            trimBefore={frameAt(a.result.source, fps)} muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
        </div>
      </Sequence>
    </div>
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 96, textAlign: 'center',
      fontFamily: b.sans, fontWeight: 600, fontSize: 34, letterSpacing: 9,
      color: b.ink, opacity: m(s, [a.brand, a.brand + .3], [0, 1]),
    }}>AIWARDROBE<span style={{color: b.accent}}> ✦</span></div>
  </AbsoluteFill>;
}

function Close({ru}: {ru: boolean}) {
  const s = useS();
  const c = t.close;
  const wipe = m(s, [c.wipeIn, c.wipeOut], [0, -104]);
  const push = interpolate(s, [0, c.seconds], [1, 1.025], clamp);
  return <AbsoluteFill style={{background: b.dark}}>
    <div style={{position: 'absolute', inset: 0, scale: `${push}`}}>
      <EchoLine top={ru ? 648 : 620} size={ru ? 112 : 138} at={c.lineOne} color={b.paperOnDark}>
        {ru ? <>МЕНЬШЕ ПОКУПОК.</> : <>BUY LESS.</>}
      </EchoLine>
      <EchoLine top={ru ? 788 : 786} size={ru ? 112 : 138} at={c.lineTwo} color={b.paperOnDark} italic>
        {ru ? <>БОЛЬШЕ СТИЛЯ.</> : <>STYLE BETTER.</>}
      </EchoLine>
      <Rule y={1010} at={c.rule} x0={330} x1={750} color="#c5937a" thickness={2}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 1056, textAlign: 'center',
        fontFamily: b.sans, fontWeight: 600, fontSize: 58, letterSpacing: 16,
        color: b.paperOnDark, opacity: m(s, [c.wordmark, c.wordmark + .3], [0, 1]),
      }}>AIWARDROBE<span style={{color: '#c5937a'}}> ✦</span></div>
      <Mono x={0} y={1176} size={22} color="rgba(236,234,218,.6)" at={c.micro} align="center" spacing={3}>
        {ru ? 'ЦЕНА НЕ СОЗДАЁТ СТИЛЬ — СОЧЕТАНИЯ СОЗДАЮТ' : 'PRICE DOESN’T CREATE STYLE — COMBINATIONS DO'}
      </Mono>
    </div>
    {/* paper cover peels up to reveal the ink card */}
    <div style={{
      position: 'absolute', left: 0, right: 0, height: '106%', top: 0, background: b.paper,
      translate: `0 ${wipe}%`, zIndex: 9, boxShadow: '0 -12px 40px rgba(28,25,18,.3)',
    }}/>
  </AbsoluteFill>;
}

// ———————————————————————————————— cut ————————————————————————————————

const folioChapters: Array<{key: SceneKey; en: string; ru: string}> = [
  {key: 'hook', en: '01 — THE HOOK', ru: '01 — ЗАЦЕП'},
  {key: 'problem', en: '02 — IMPULSE VS INTENT', ru: '02 — ИМПУЛЬС ПРОТИВ ЗАМЫСЛА'},
  {key: 'lookOne', en: '03 — LOOK ONE', ru: '03 — ОБРАЗ ПЕРВЫЙ'},
  {key: 'lookTwo', en: '04 — LOOK TWO', ru: '04 — ОБРАЗ ВТОРОЙ'},
  {key: 'lookThree', en: '05 — LOOK THREE', ru: '05 — ОБРАЗ ТРЕТИЙ'},
  {key: 'matrix', en: '06 — THE MATH', ru: '06 — МАТЕМАТИКА'},
  {key: 'app', en: '07 — AIWARDROBE', ru: '07 — AIWARDROBE'},
];

function Folio({ru, chapter}: {ru: boolean; chapter: {en: string; ru: string} | null}) {
  const s = useS();
  return <>
    <div style={{
      position: 'absolute', left: 84, right: 84, top: 60, display: 'flex',
      justifyContent: 'space-between', fontFamily: b.mono, fontSize: 19,
      letterSpacing: 3, color: b.muted,
    }}>
      <span>{ru ? 'AIWARDROBE — ИССЛЕДОВАНИЕ СТИЛЯ' : 'AIWARDROBE — STYLE STUDY'}</span>
      <span>{ru ? 'МУЖСКОЙ ГАРДЕРОБ' : 'N°07 — MENSWEAR'}</span>
    </div>
    {chapter ? <div style={{
      position: 'absolute', left: 84, right: 84, bottom: 52,
      borderTop: `1px solid ${b.line}`, paddingTop: 16, display: 'flex',
      justifyContent: 'space-between', fontFamily: b.mono, fontSize: 17,
      letterSpacing: 2.6, color: b.muted,
      opacity: m(s, [.2, .5], [0, 1]),
    }}>
      <span>{ru ? chapter.ru : chapter.en}</span>
      <span>{ru ? 'ЦЕНА ≠ СТИЛЬ' : 'PRICE ≠ STYLE'}</span>
    </div> : null}
  </>;
}

type SceneKey = Exclude<keyof typeof t, 'duration'>;

const sceneList: Array<{key: SceneKey; node: (ru: boolean) => ReactNode}> = [
  {key: 'hook' as const, node: (ru: boolean) => <Hook ru={ru}/>},
  {key: 'problem' as const, node: (ru: boolean) => <Problem ru={ru}/>},
  {key: 'lookOne' as const, node: (ru: boolean) => <LookOne ru={ru}/>},
  {key: 'lookTwo' as const, node: (ru: boolean) => <LookTwo ru={ru}/>},
  {key: 'lookThree' as const, node: (ru: boolean) => <LookThree ru={ru}/>},
  {key: 'matrix' as const, node: (ru: boolean) => <Matrix ru={ru}/>},
  {key: 'app' as const, node: (ru: boolean) => <AppScene ru={ru}/>},
  {key: 'close' as const, node: (ru: boolean) => <Close ru={ru}/>},
];

function PriceStyleCut({ru}: {ru: boolean}) {
  const {fps} = useVideoConfig();
  return <AbsoluteFill lang={ru ? 'ru' : 'en'}
    style={{background: b.paper, color: b.ink, fontFamily: b.serif, overflow: 'hidden'}}>
    {/* archival paper grain carries every scene */}
    <Img src={staticFile('assets/capsule-elegant/paper.jpg')}
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .5}}/>
    <Audio src={asset('score.wav')}/>
    {sceneList.map(({key, node}) => {
      const scene = t[key];
      return <Sequence key={key} name={key} from={frameAt(scene.from, fps)}
        durationInFrames={frameAt(scene.seconds, fps)}>
        {node(ru)}
      </Sequence>;
    })}
    {/* top folio runs until the ink close card takes over */}
    <Sequence name="folio-top" from={0} durationInFrames={frameAt(t.app.from + t.app.seconds, fps)}>
      <Folio ru={ru} chapter={null}/>
    </Sequence>
    {folioChapters.map(({key, en, ru: chapterRu}) => {
      const scene = t[key];
      return <Sequence key={key + '-folio'} from={frameAt(scene.from, fps)} durationInFrames={frameAt(scene.seconds, fps)}>
        <Folio ru={ru} chapter={{en, ru: chapterRu}}/>
      </Sequence>;
    })}
  </AbsoluteFill>;
}

export function PriceStyleEditorial() {
  return <PriceStyleCut ru={false}/>;
}

export function PriceStyleEditorialRu() {
  return <PriceStyleCut ru={true}/>;
}
