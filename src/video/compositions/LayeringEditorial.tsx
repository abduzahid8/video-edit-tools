/**
 * LayeringEditorial — a 30s menswear layering study, 1080×1920 at 30fps.
 *
 * Visual language follows the supplied example3 reference: pure white field,
 * full-height cutout figures bleeding off the bottom edge, charcoal italic
 * serif with a misregistered double-print ("echo") reveal, numbered rule
 * cards, a sweeping wipe pill, a black scan-tear band and a drifting cursor
 * arrow with monospace spec captions. Content: "Layering Looks Effortless" →
 * the wrong way ("Not So Much…") → 1) the weight rule (Thin → Thick wipe) →
 * 2) mix textures (build-up with captions) → 3) leave a V-shape (dotted V)
 * → Effortless.
 *
 * Photography: Pexels studio shots, figure cutouts made deterministically
 * with scripts/cutout.py. No AI-generated people. Score: deterministic synth
 * in scripts/layering-score.py.
 */

import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {layeringTimeline as t} from '../timeline';
import {layeringBrand as brand} from '../theme';

/* ─── helpers ─── */
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1)};
const asset = (name: string) => staticFile(`assets/layering-editorial/${name}`);

const reveal = (f: number, fps: number, start: number, seconds = 0.6) =>
  interpolate(f, [start * fps, (start + seconds) * fps], [0, 1], ease);

// The outgoing page clears to white first, then the incoming page fades up —
// the reference transitions through the empty white field, never a hard cut.
const SceneShell = ({
  seconds,
  isLast = false,
  children,
}: {
  seconds: number;
  isLast?: boolean;
  children: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = isLast
    ? 1
    : interpolate(f, [(seconds - 0.45) * fps, seconds * fps], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>{children}</div>
  );
};

/* ─── echo text — the misregistered double-print reveal ─── */
const EchoText = ({
  text,
  y,
  start,
  size = 50,
  italic = true,
  align = 'center',
  width = '100%',
  color,
}: {
  text: string;
  y: number | string;
  start: number;
  size?: number;
  italic?: boolean;
  align?: 'center' | 'left' | 'right';
  width?: string;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const ghostIn = reveal(f, fps, start + 0.12, 0.5);
  const ghostOut = interpolate(
    f,
    [(start + 0.9) * fps, (start + 1.5) * fps],
    [1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        right: 0,
        width,
        textAlign: align,
      }}
    >
      {/* ghost copy — slides from further below, then fades out */}
      <div
        style={{
          position: 'absolute',
          top: (1 - ghostIn) * 34 + 12,
          left: 0,
          right: 0,
          fontSize: size,
          lineHeight: 1.25,
          fontFamily: brand.serif,
          fontStyle: italic ? 'italic' : 'normal',
          color: brand.ghost,
          opacity: ghostIn * 0.45 * ghostOut,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      {/* main copy — per-word staggered print */}
      <div
        style={{
          position: 'relative',
          fontSize: size,
          lineHeight: 1.25,
          fontFamily: brand.serif,
          fontStyle: italic ? 'italic' : 'normal',
          color: color ?? brand.text,
          whiteSpace: 'nowrap',
        }}
      >
        {words.map((word, i) => {
          const p = reveal(f, fps, start + i * 0.12, 0.42);
          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: 'inline-block',
                marginRight: size * 0.26,
                opacity: p,
                transform: `translateY(${(1 - p) * 22}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ─── scan tear — the black horizontal band that flickers across photos ─── */
const ScanTear = ({
  y = 0.46,
  start,
  seconds,
  seed = 1,
}: {
  y?: number;
  start: number;
  seconds: number;
  seed?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const life = interpolate(
    f,
    [start * fps, (start + 0.25) * fps, (start + seconds - 0.3) * fps, (start + seconds) * fps],
    [0, 1, 1, 0],
    clamp,
  );
  const flicker =
    0.62 +
    0.38 * Math.sin(f * 0.53 + seed * 2.7) * Math.sin(f * 0.21 + seed);
  const wobble = 4 * Math.sin(f * 0.31 + seed * 1.3);
  return (
    <div
      style={{
        position: 'absolute',
        left: -20,
        right: -20,
        top: `${y * 100}%`,
        opacity: life * 0.82 * flicker,
        transform: `translateX(${wobble}px)`,
      }}
    >
      <div
        style={{
          height: 2,
          background: '#0a0a0a',
          marginBottom: 3,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          height: 6,
          background: 'linear-gradient(#141414, #000)',
        }}
      />
    </div>
  );
};

/* ─── figures & photos ─── */
const Figure = ({
  src,
  height = 0.76,
  enter = 0,
  exitAt,
  x = '50%',
  shift = 0,
  scale = 1,
  opacity = 1,
}: {
  src: string;
  height?: number;
  enter?: number;
  exitAt?: number;
  x?: string;
  shift?: number;
  scale?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const inP = reveal(f, fps, enter, 0.8);
  const outP = exitAt
    ? interpolate(f, [exitAt * fps, (exitAt + 0.8) * fps], [1, 0], ease)
    : 1;
  const drift = interpolate(f, [0, durationInFrames], [0, -14], clamp);
  return (
    <Img
      src={asset(src)}
      style={{
        position: 'absolute',
        bottom: -height * 0.02 * 1920,
        left: x,
        transform: `translateX(-50%) translateX(${shift}px) translateY(${(1 - inP) * 34 + drift}px) scale(${scale * (0.985 + inP * 0.015)})`,
        height: `${height * 100}%`,
        width: 'auto',
        maxWidth: 'none',
        objectFit: 'contain',
        filter: brand.xerox,
        opacity: inP * outP * opacity,
      }}
    />
  );
};

const PhotoRect = ({
  src,
  width = 0.6,
  height = 0.66,
  enter = 0,
  exitAt,
  y = '50%',
  position = '50% 20%',
}: {
  src: string;
  width?: number;
  height?: number;
  enter?: number;
  exitAt?: number;
  y?: string;
  position?: string;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = reveal(f, fps, enter, 0.8);
  const outP = exitAt
    ? interpolate(f, [exitAt * fps, (exitAt + 0.8) * fps], [1, 0], ease)
    : 1;
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${(1 - inP) * 26}px) scale(${0.985 + inP * 0.012})`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
        opacity: inP * outP,
        overflow: 'hidden',
      }}
    >
      <Img
        src={asset(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: position,
          filter: brand.xerox,
        }}
      />
    </div>
  );
};

/* ─── cursor arrow — drifting pointer, the reference's screen-capture motif ─── */
const CURSOR_PATH =
  'M6 2 L6 30 L14.5 22.5 L19.5 33 L24.5 30.5 L19.5 20.5 L30 20 Z';
const Cursor = ({
  waypoints,
  start,
  end,
  enter = 0,
  size = 40,
}: {
  waypoints: {x: number; y: number}[];
  start: number;
  end: number;
  enter?: number;
  size?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const life = interpolate(f, [enter * fps, (enter + 0.3) * fps], [0, 1], ease);
  const last = waypoints.length - 1;
  const span = Math.max(0.001, end - start);
  const progress = Math.max(0, Math.min(1, (f / fps - start) / span));
  const seg = Math.min(last, Math.floor(progress * last));
  const local = interpolate(
    progress * last,
    [seg, seg + 1],
    [0, 1],
    ease,
  );
  const a = waypoints[Math.min(last, seg)];
  const b = waypoints[Math.min(last, seg + 1)];
  const x = a.x + (b.x - a.x) * local;
  const y = a.y + (b.y - a.y) * local;
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 36 36"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: life,
        filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.9))',
      }}
    >
      <path d={CURSOR_PATH} fill="#111" stroke="#fff" strokeWidth={1.4} />
    </svg>
  );
};

/* ─── monospace spec caption ─── */
const MonoCaption = ({
  lines,
  x,
  y,
  start,
  align = 'left',
}: {
  lines: string[];
  x: number;
  y: number;
  start: number;
  align?: 'left' | 'right';
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 380,
        textAlign: align,
        fontFamily: brand.mono,
        fontSize: 21,
        letterSpacing: 2.5,
        lineHeight: 1.7,
        color: '#141414',
        textTransform: 'uppercase',
      }}
    >
      {lines.map((line, i) => {
        const p = reveal(f, fps, start + i * 0.14, 0.4);
        return (
          <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 8}px)`}}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

/* ─── wipe pill — the divider that sweeps a thinner state into a layered one ─── */
const WipePill = ({start, end}: {start: number; end: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const life = interpolate(
    f,
    [start * fps, (start + 0.25) * fps, (end - 0.25) * fps, end * fps],
    [0, 1, 1, 0],
    clamp,
  );
  const x = interpolate(f / fps, [start, end], [16, 84], ease);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: life,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: '18%',
          bottom: '6%',
          width: 2,
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 0 6px rgba(255,255,255,0.8), 1px 0 0 rgba(0,0,0,0.18)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: 66,
          height: 36,
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: brand.sans,
          fontSize: 17,
          letterSpacing: 1,
          color: '#333',
        }}
      >
        {'<>'}
      </div>
    </div>
  );
};

/* ─── scenes ─── */

const SceneCover = () => (
  <SceneShell seconds={t.cover.seconds}>
    <Figure src="cutouts/hero.png" height={0.78} enter={0.15} />
    <ScanTear y={0.47} start={1.1} seconds={2.2} seed={2} />
    <EchoText text="Layering Looks Effortless" y={300} start={0.5} size={52} />
  </SceneShell>
);

const SceneWrong = () => (
  <SceneShell seconds={t.wrong.seconds}>
    <PhotoRect src="raw/puffer.jpg" width={0.62} height={0.7} enter={0.1} y="54%" />
    <ScanTear y={0.53} start={0.7} seconds={1.8} seed={4} />
    <EchoText text="Not So Much…" y={190} start={0.4} size={48} />
  </SceneShell>
);

const SceneRule = ({
  text,
  seconds,
  isLast = false,
}: {
  text: string;
  seconds: number;
  isLast?: boolean;
}) => (
  <SceneShell seconds={seconds} isLast={isLast}>
    <EchoText text={text} y="44%" start={0.3} size={46} />
  </SceneShell>
);

const SceneWeight = () => {
  const {fps} = useVideoConfig();
  const f = useCurrentFrame();
  const thinOut = interpolate(f, [1.5 * fps, 2.5 * fps], [1, 0], ease);
  const thinLift = interpolate(f, [1.5 * fps, 2.5 * fps], [0, -40], ease);
  return (
    <SceneShell seconds={t.weight.seconds}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: thinOut,
          transform: `translateY(${thinLift}px)`,
        }}
      >
        <PhotoRect
          src="raw/thin.jpg"
          width={0.54}
          height={0.62}
          enter={0.1}
          y="54%"
          position="58% 30%"
        />
        <EchoText text="Thin" y={270} start={0.5} size={44} />
      </div>
      <Figure src="cutouts/hero.png" height={0.72} enter={1.7} x="56%" />
      <WipePill start={2.0} end={3.6} />
      <EchoText text="Thick" y={270} start={3.1} size={44} />
    </SceneShell>
  );
};

const SceneBuild = () => (
  <SceneShell seconds={t.build.seconds}>
    <Figure
      src="cutouts/knit.png"
      height={0.7}
      enter={0.1}
      exitAt={1.9}
      x="46%"
    />
    <Figure src="cutouts/hero.png" height={0.72} enter={1.9} x="54%" />
    <MonoCaption
      lines={['Ribbed knit,', 'merino, $85']}
      x={600}
      y={620}
      start={0.6}
    />
    <MonoCaption
      lines={['Substantial overcoat,', 'wool, $130']}
      x={620}
      y={620}
      start={2.4}
    />
    <Cursor
      waypoints={[
        {x: 640, y: 520},
        {x: 700, y: 560},
        {x: 600, y: 590},
        {x: 700, y: 560},
      ]}
      start={0.9}
      end={5.0}
      enter={0.5}
    />
  </SceneShell>
);

const SceneVShape = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(f, [0.6 * fps, 2.0 * fps], [0, 1], ease);
  return (
    <SceneShell seconds={t.vshape.seconds}>
      <Figure src="cutouts/hero.png" height={0.78} enter={0.1} />
      <svg
        width={1080}
        height={1920}
        style={{position: 'absolute', inset: 0}}
      >
        <path
          d="M 455 640 C 480 700, 515 760, 540 800 C 565 760, 600 700, 625 640"
          fill="none"
          stroke="#141414"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="3 11"
          strokeDashoffset={(1 - draw) * 420}
          opacity={0.85}
        />
      </svg>
      <EchoText text="3) Leave a V-shape" y={270} start={0.25} size={44} />
    </SceneShell>
  );
};

const SceneEffortless = () => (
  <SceneShell seconds={t.effortless.seconds} isLast>
    <Figure
      src="cutouts/knit.png"
      height={0.68}
      enter={2.3}
      x="38%"
      opacity={0.9}
    />
    <Figure src="cutouts/hero.png" height={0.78} enter={0.1} x="58%" />
    <EchoText text="Effortless" y={280} start={0.4} size={62} />
    <EchoText
      text="Layer light. Look considered."
      y={372}
      start={1.4}
      size={26}
      color={brand.faint}
    />
  </SceneShell>
);

/* ─── root ─── */
export const LayeringEditorial = () => {
  const {fps} = useVideoConfig();
  const scenes = [
    {id: 'Cover', s: t.cover, C: <SceneCover />},
    {id: 'Wrong', s: t.wrong, C: <SceneWrong />},
    {id: 'Rule 1', s: t.rule1, C: <SceneRule text="1) The Weight Rule" seconds={t.rule1.seconds} />},
    {id: 'Weight', s: t.weight, C: <SceneWeight />},
    {id: 'Rule 2', s: t.rule2, C: <SceneRule text="2) Mix Textures" seconds={t.rule2.seconds} />},
    {id: 'Build', s: t.build, C: <SceneBuild />},
    {id: 'Rule 3', s: t.rule3, C: <SceneRule text="3) Leave a V-shape" seconds={t.rule3.seconds} />},
    {id: 'VShape', s: t.vshape, C: <SceneVShape />},
    {id: 'Effortless', s: t.effortless, C: <SceneEffortless />},
  ];

  return (
    <AbsoluteFill style={{background: brand.field, overflow: 'hidden'}}>
      <Audio src={asset('layering-score.wav')} volume={0.85} />
      {scenes.map(({id, s, C}) => (
        <Sequence
          key={id}
          name={id}
          from={Math.round(s.from * fps)}
          durationInFrames={Math.round(s.seconds * fps)}
        >
          {C}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
