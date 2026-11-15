/**
 * KnivesOutCollage — a 30s film-wardrobe study, 1080×1920 at 30fps.
 *
 * This is the short recut. It follows the supplied example2 reference much
 * more literally than the first 51s version: cool near-white paper, small
 * unframed photographs, off-canvas crops, huge negative space, floating
 * Didot lines, tiny captions and hard cuts between pages. There are no mats,
 * no full-page fades and no large catalogue cards.
 *
 * Content follows the supplied theme.mp4: knit, coat, trousers, loafers and
 * sunglasses, each with a luxury piece and a budget "Try" alternative, then
 * the whole fit at $381.
 *
 * Photography: real stills cropped from the user-supplied theme.mp4 plus
 * Pexels editorial photography. Product cutouts are deterministic white-key
 * extractions from the supplied reference. No AI-generated people.
 * Audio: original deterministic score in scripts/knives-score-30.py.
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
import {knivesCollageTimeline as t} from '../timeline';
import {knivesCollageBrand as brand} from '../theme';

/* ─── helpers ─── */
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1)};
const asset = (name: string) => staticFile(`assets/knives-out/${name}`);
const product = (name: string) =>
  staticFile(`assets/knives-out/products/clean/${name}`);

const reveal = (frame: number, fps: number, start: number, seconds = 0.6) =>
  interpolate(frame, [start * fps, (start + seconds) * fps], [0, 1], ease);

/* ─── paper ─── */
const Paper = () => (
  <AbsoluteFill style={{backgroundColor: brand.paper}}>
    <AbsoluteFill
      style={{
        backgroundImage: `url(${asset('paper-grain.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(1) contrast(1.04)',
        opacity: 0.5,
        mixBlendMode: 'multiply',
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(120% 80% at 32% 18%, rgba(255,255,255,0.42), rgba(255,255,255,0) 62%)',
      }}
    />
    {/* Two almost-invisible press folds, like a poster that has been folded. */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '41%',
        width: 1,
        background: 'rgba(24,23,20,0.035)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '54%',
        height: 1,
        background: 'rgba(24,23,20,0.03)',
      }}
    />
  </AbsoluteFill>
);

/* ─── typography ─── */
const Label = ({
  children,
  x = 0,
  y = 0,
  width = 1080,
  align = 'left',
  start = 0,
  color = brand.muted,
  size = 11.5,
  tracking = 3.6,
  z = 5,
}: {
  children: React.ReactNode;
  x?: number;
  y?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  start?: number;
  color?: string;
  size?: number;
  tracking?: number;
  z?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, start - 0.12, 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        opacity: p,
        transform: `translateY(${(1 - p) * 7}px)`,
        fontFamily: brand.sans,
        fontSize: size,
        letterSpacing: tracking,
        lineHeight: 1.5,
        textTransform: 'uppercase',
        color,
        zIndex: z,
      }}
    >
      {children}
    </div>
  );
};

const Display = ({
  children,
  x = 0,
  y = 0,
  width = 600,
  align = 'left',
  size = 58,
  start = 0,
  italic = false,
  lineHeight = 1.03,
  color = brand.ink,
  tracking = -0.6,
  z = 4,
}: {
  children: React.ReactNode;
  x?: number;
  y?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  size?: number;
  start?: number;
  italic?: boolean;
  lineHeight?: number;
  color?: string;
  tracking?: number;
  z?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, start - 0.25, 0.7);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        opacity: p,
        transform: `translateY(${(1 - p) * 15}px)`,
        zIndex: z,
      }}
    >
      <div
        style={{
          fontFamily: brand.display,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: size,
          lineHeight,
          letterSpacing: tracking,
          color,
          whiteSpace: 'pre-line',
          textShadow: '4px 5px 0 rgba(24,23,20,0.045)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Italic = ({
  children,
  x = 0,
  y = 0,
  width = 600,
  align = 'left',
  size = 16,
  start = 0,
  color = brand.muted,
  z = 4,
}: {
  children: React.ReactNode;
  x?: number;
  y?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  size?: number;
  start?: number;
  color?: string;
  z?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, start, 0.55);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        opacity: p,
        transform: `translateY(${(1 - p) * 9}px)`,
        fontFamily: brand.serif,
        fontStyle: 'italic',
        fontSize: size,
        lineHeight: 1.45,
        color,
        zIndex: z,
      }}
    >
      {children}
    </div>
  );
};

const Rule = ({
  x,
  y,
  width = 54,
  height = 1,
  start = 0,
  vertical = false,
  color = brand.rule,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  start?: number;
  vertical?: boolean;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, start, 0.6);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: vertical ? 1 : width,
        height: vertical ? height : 1,
        background: color,
        opacity: 0.62 * p,
        transform: vertical ? `scaleY(${p})` : `scaleX(${p})`,
        transformOrigin: vertical ? 'top' : 'left',
        zIndex: 3,
      }}
    />
  );
};

/* ─── pasted photograph ─── */
const Photo = ({
  src,
  x,
  y,
  width,
  height,
  start = 0,
  position = 'center',
  filter = 'none',
  drift = 0,
  zoom = 0.025,
  span = 3.2,
  border = true,
  z = 2,
}: {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  start?: number;
  position?: string;
  filter?: string;
  drift?: number;
  zoom?: number;
  span?: number;
  border?: boolean;
  z?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, start - 0.12, 0.55);
  const dy = interpolate(f, [0, span * fps], [0, drift], clamp);
  const sc = interpolate(f, [0, span * fps], [1, 1 + zoom], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        overflow: 'hidden',
        opacity: p,
        transform: `translateY(${(1 - p) * 14 + dy}px)`,
        border: border ? '1px solid rgba(24,23,20,0.14)' : 'none',
        boxSizing: 'border-box',
        zIndex: z,
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: position,
          filter,
          display: 'block',
          transform: `scale(${sc})`,
        }}
      />
    </div>
  );
};

/* ─── product cutout ─── */
const Cutout = ({
  src,
  x,
  y,
  width,
  height,
  start = 0,
  rotate = 0,
  drift = 0,
  span = 3.2,
  shadow = true,
  z = 4,
}: {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  start?: number;
  rotate?: number;
  drift?: number;
  span?: number;
  shadow?: boolean;
  z?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, start - 0.1, 0.55);
  const dy = interpolate(f, [0, span * fps], [0, drift], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity: p,
        transform: `translateY(${(1 - p) * 22 + dy}px) rotate(${rotate}deg)`,
        transformOrigin: 'center',
        zIndex: z,
      }}
    >
      <Img
        src={product(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          filter: shadow
            ? 'drop-shadow(0 16px 20px rgba(28,26,22,0.17))'
            : 'none',
        }}
      />
    </div>
  );
};

/* ─── product captions ─── */
const ProductCaption = ({
  x,
  y,
  width,
  name,
  price,
  start = 0,
  align = 'center',
  accent = false,
}: {
  x: number;
  y: number;
  width: number;
  name: string;
  price?: string;
  start?: number;
  align?: 'left' | 'center' | 'right';
  accent?: boolean;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, start, 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        zIndex: 5,
      }}
    >
      <div
        style={{
          fontFamily: brand.sans,
          fontSize: 10.5,
          letterSpacing: 2.2,
          textTransform: 'uppercase',
          color: accent ? brand.accent : brand.muted,
          lineHeight: 1.4,
        }}
      >
        {name}
      </div>
      {price ? (
        <div
          style={{
            fontFamily: brand.display,
            fontSize: 25,
            lineHeight: 1.05,
            color: brand.ink,
            marginTop: 3,
          }}
        >
          {price}
        </div>
      ) : null}
    </div>
  );
};

/* ─── 01 · Cover ─── */
const SceneCover = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, 0.25, 1.0);
  const zoom = interpolate(f, [0, 4 * fps], [1.035, 1], clamp);

  return (
    <AbsoluteFill>
      <Label x={0} y={124} width={1080} align="center" size={12} tracking={5}>
        A film wardrobe study
      </Label>

      <Display
        x={80}
        y={192}
        width={920}
        align="center"
        size={66}
        start={0.12}
        tracking={-1.1}
        lineHeight={1.06}
      >
        {'What Makes the Knives Out\nLook So Good?'}
      </Display>

      <Rule x={513} y={402} width={54} start={0.5} />

      <div
        style={{
          position: 'absolute',
          left: 315,
          top: 468,
          width: 450,
          height: 560,
          overflow: 'hidden',
          opacity: p,
          border: '1px solid rgba(24,23,20,0.14)',
          boxSizing: 'border-box',
          zIndex: 2,
        }}
      >
        <Img
          src={asset('raw/hero-knit.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 24%',
            display: 'block',
            filter: 'saturate(0.92) contrast(1.02)',
            transform: `scale(${zoom})`,
          }}
        />
      </div>

      <Italic x={0} y={1052} width={1080} align="center" size={18} start={0.85}>
        Chris Evans · Knives Out, 2019
      </Italic>
      <Italic
        x={0}
        y={1088}
        width={1080}
        align="center"
        size={17}
        start={1.05}
        color={brand.muted}
      >
        Five pieces. One quietly expensive silhouette.
      </Italic>

      <Cutout
        src="sunglasses-lux-cut.png"
        x={748}
        y={1208}
        width={280}
        height={101}
        start={1.3}
        rotate={7}
        drift={-5}
        span={4}
      />
      <Label
        x={748}
        y={1322}
        width={280}
        align="center"
        size={10}
        tracking={2.6}
        start={1.5}
      >
        The frames · Ray-Ban
      </Label>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1492,
          textAlign: 'center',
          fontFamily: brand.sans,
          fontSize: 10.5,
          letterSpacing: 3.4,
          color: brand.muted,
          opacity: reveal(f, fps, 1.55, 0.6) * 0.8,
          zIndex: 3,
        }}
      >
        01 Knit · 02 Coat · 03 Trousers · 04 Loafers · 05 Frames
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 58,
          textAlign: 'center',
          fontFamily: brand.sans,
          fontSize: 9.5,
          letterSpacing: 3.2,
          color: brand.muted,
          opacity: reveal(f, fps, 1.8, 0.6) * 0.55,
          zIndex: 3,
        }}
      >
        AIWARDBOBE
      </div>
    </AbsoluteFill>
  );
};

/* ─── 02 · The Look ─── */
const SceneLook = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Photo
        src={asset('candidates/30261019.jpg')}
        x={-40}
        y={0}
        width={760}
        height={1920}
        start={-0.5}
        position="center 30%"
        filter="saturate(0.9) contrast(1.02)"
        drift={-8}
        zoom={0.03}
        span={3}
        border={false}
        z={1}
      />

      <Label x={790} y={104} width={230} size={11.5} tracking={3.8} start={0.05}>
        The look
      </Label>

      <Display
        x={780}
        y={540}
        width={290}
        size={41}
        start={0.32}
        lineHeight={1.14}
        tracking={-0.4}
      >
        {'Nothing shouts.\nEverything\nagrees.'}
      </Display>

      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 872,
          width: 240,
          opacity: reveal(f, fps, 0.75, 0.6),
          zIndex: 4,
        }}
      >
        {[
          '01  The knit',
          '02  The coat',
          '03  The trousers',
          '04  The loafers',
          '05  The frames',
        ].map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: brand.sans,
              fontSize: 10.5,
              letterSpacing: 2.3,
              textTransform: 'uppercase',
              color: brand.muted,
              lineHeight: 2.35,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      <Italic x={790} y={1128} width={230} size={15} start={1.15}>
        A study in quiet accumulation.
      </Italic>

      <Label x={800} y={1752} width={220} size={9.5} tracking={3} start={1.4}>
        02 / 09
      </Label>
    </AbsoluteFill>
  );
};

/* ─── 03 · The Knit ─── */
const SceneKnit = () => {
  return (
    <AbsoluteFill>
      <Label x={60} y={96} width={520} start={0.02}>
        01 — The Knit
      </Label>

      <Photo
        src={asset('raw/hero-knit.jpg')}
        x={70}
        y={188}
        width={420}
        height={560}
        start={-0.5}
        position="center 22%"
        filter="saturate(0.92) contrast(1.02)"
        drift={-6}
        zoom={0.03}
      />
      <Italic x={70} y={766} width={420} size={14} start={0.45}>
        Cable, in close.
      </Italic>

      <Display x={552} y={214} width={470} size={58} start={0.12}>
        {'The knit\ndoes the\ntalking.'}
      </Display>

      <Label
        x={640}
        y={642}
        width={320}
        align="center"
        size={10.5}
        tracking={2.8}
        start={0.35}
      >
        The piece
      </Label>
      <Cutout
        src="knit-lux-cut.png"
        x={650}
        y={686}
        width={300}
        height={336}
        start={0.4}
        rotate={-1.6}
        drift={-6}
      />
      <ProductCaption
        x={640}
        y={1042}
        width={320}
        name="The Kooples"
        price="$395"
        start={0.7}
      />

      <Label
        x={140}
        y={1072}
        width={280}
        align="center"
        size={10.5}
        tracking={2.8}
        start={1.42}
        color={brand.accent}
      >
        Try instead
      </Label>
      <Cutout
        src="knit-budget-cut.png"
        x={155}
        y={1114}
        width={250}
        height={325}
        start={1.45}
        rotate={2}
        drift={-5}
      />
      <ProductCaption
        x={130}
        y={1454}
        width={300}
        name="J.Crew"
        price="$118"
        start={1.62}
        accent
      />

      <Photo
        src={asset('candidates/38545837.jpg')}
        x={590}
        y={1192}
        width={330}
        height={248}
        start={1.85}
        position="center 55%"
        filter="grayscale(0.35) contrast(1.02)"
        drift={-4}
        zoom={0.04}
      />
      <Italic x={590} y={1452} width={330} align="center" size={13.5} start={2.05}>
        Wool, in winter.
      </Italic>
    </AbsoluteFill>
  );
};

/* ─── 04 · The Coat ─── */
const SceneCoat = () => {
  return (
    <AbsoluteFill>
      <Label x={60} y={96} width={430} start={0.02}>
        02 — The Coat
      </Label>

      <Photo
        src={asset('candidates/19113849.jpg')}
        x={500}
        y={0}
        width={580}
        height={1920}
        start={-0.5}
        position="center 26%"
        filter="saturate(0.9) contrast(1.02)"
        drift={-9}
        zoom={0.03}
        border={false}
        z={1}
      />

      <Display x={60} y={238} width={410} size={52} start={0.12}>
        {'Camel,\ncut clean.'}
      </Display>
      <Italic x={62} y={386} width={390} size={15} start={0.45}>
        The coat does the talking.
      </Italic>

      <Label
        x={70}
        y={574}
        width={230}
        align="center"
        size={10.5}
        tracking={2.8}
        start={0.35}
      >
        The piece
      </Label>
      <Cutout
        src="coat-lux-cut.png"
        x={70}
        y={618}
        width={230}
        height={375}
        start={0.4}
        rotate={1.2}
        drift={-6}
      />
      <ProductCaption
        x={60}
        y={1010}
        width={250}
        name="Theory"
        price="$795"
        start={0.7}
      />

      <Label
        x={300}
        y={712}
        width={190}
        align="center"
        size={10.5}
        tracking={2.8}
        start={1.4}
        color={brand.accent}
      >
        Try instead
      </Label>
      <Cutout
        src="coat-budget-cut.png"
        x={305}
        y={754}
        width={170}
        height={266}
        start={1.45}
        rotate={-2}
        drift={-5}
      />
      <ProductCaption
        x={280}
        y={1036}
        width={220}
        name="H&M"
        price="$80"
        start={1.62}
        accent
      />

      <Photo
        src={asset('candidates/30007899.jpg')}
        x={80}
        y={1210}
        width={290}
        height={370}
        start={1.85}
        position="center 28%"
        filter="grayscale(1) contrast(1.04)"
        drift={-5}
        zoom={0.04}
      />
      <Italic x={80} y={1594} width={290} align="center" size={13.5} start={2.05}>
        Tweed, in winter.
      </Italic>
    </AbsoluteFill>
  );
};

/* ─── 05 · The Trousers ─── */
const SceneTrousers = () => {
  return (
    <AbsoluteFill>
      <Label x={700} y={96} width={320} align="right" start={0.02}>
        03 — The Trousers
      </Label>

      <Photo
        src={asset('raw/hero-trousers.jpg')}
        x={-40}
        y={124}
        width={1160}
        height={716}
        start={-0.5}
        position="center 58%"
        filter="saturate(0.88) contrast(1.03)"
        drift={-7}
        zoom={0.03}
        border={false}
        z={1}
      />

      <Display x={70} y={930} width={430} size={54} start={0.12}>
        {'The stripe\nis quiet.'}
      </Display>

      <Label
        x={560}
        y={856}
        width={280}
        align="center"
        size={10.5}
        tracking={2.8}
        start={0.35}
      >
        The piece
      </Label>
      <Cutout
        src="trousers-lux-cut.png"
        x={620}
        y={896}
        width={160}
        height={464}
        start={0.4}
        rotate={-1}
        drift={-7}
      />
      <ProductCaption
        x={550}
        y={1372}
        width={300}
        name="Suitsupply"
        price="Chalk-stripe"
        start={0.72}
      />

      <Label
        x={760}
        y={918}
        width={210}
        align="center"
        size={10.5}
        tracking={2.8}
        start={1.4}
        color={brand.accent}
      >
        Try instead
      </Label>
      <Cutout
        src="trousers-budget-cut.png"
        x={810}
        y={962}
        width={120}
        height={283}
        start={1.45}
        rotate={1.8}
        drift={-5}
      />
      <ProductCaption
        x={760}
        y={1258}
        width={220}
        name="Banana Republic"
        price="$35"
        start={1.62}
        accent
      />

      <Photo
        src={asset('candidates/7918113.jpg')}
        x={170}
        y={1204}
        width={320}
        height={250}
        start={1.85}
        position="center 55%"
        filter="grayscale(1) contrast(1.03)"
        drift={-4}
        zoom={0.04}
      />
      <Italic x={170} y={1468} width={320} align="center" size={13.5} start={2.05}>
        Chalk, in close.
      </Italic>
    </AbsoluteFill>
  );
};

/* ─── 06 · The Loafers ─── */
const SceneLoafers = () => {
  return (
    <AbsoluteFill>
      <Label x={60} y={96} width={500} start={0.02}>
        04 — The Loafers
      </Label>

      <Photo
        src={asset('raw/hero-loafers.jpg')}
        x={0}
        y={140}
        width={1080}
        height={520}
        start={-0.5}
        position="center 60%"
        filter="saturate(0.9) contrast(1.02)"
        drift={-6}
        zoom={0.03}
        border={false}
        z={1}
      />

      <Display
        x={90}
        y={706}
        width={900}
        align="center"
        size={46}
        start={0.12}
        lineHeight={1.1}
      >
        {'Spend here.\nSave everywhere else.'}
      </Display>

      <Label
        x={90}
        y={900}
        width={420}
        align="center"
        size={10.5}
        tracking={2.8}
        start={0.35}
      >
        The piece
      </Label>
      <Cutout
        src="loafers-lux-cut.png"
        x={90}
        y={942}
        width={420}
        height={150}
        start={0.4}
        rotate={-1.2}
        drift={-4}
      />
      <ProductCaption
        x={90}
        y={1102}
        width={420}
        name="Gucci"
        price="$1,090"
        start={0.7}
      />

      <Label
        x={560}
        y={970}
        width={380}
        align="center"
        size={10.5}
        tracking={2.8}
        start={1.4}
        color={brand.accent}
      >
        Try instead
      </Label>
      <Cutout
        src="loafers-budget-cut.png"
        x={560}
        y={1012}
        width={380}
        height={155}
        start={1.45}
        rotate={1.4}
        drift={-4}
      />
      <ProductCaption
        x={560}
        y={1176}
        width={380}
        name="Cole Haan"
        price="$90"
        start={1.62}
        accent
      />

      <Photo
        src={asset('candidates/8159478.jpg')}
        x={330}
        y={1272}
        width={420}
        height={300}
        start={1.85}
        position="center 50%"
        filter="saturate(0.9) contrast(1.02)"
        drift={-4}
        zoom={0.04}
      />
      <Italic x={330} y={1584} width={420} align="center" size={13.5} start={2.05}>
        Brown leather, on rattan.
      </Italic>
    </AbsoluteFill>
  );
};

/* ─── 07 · The Frames ─── */
const SceneSunglasses = () => {
  return (
    <AbsoluteFill>
      <Label x={700} y={96} width={320} align="right" start={0.02}>
        05 — The Frames
      </Label>

      <Photo
        src={asset('raw/hero-sunglasses.jpg')}
        x={560}
        y={180}
        width={440}
        height={580}
        start={-0.5}
        position="center 28%"
        filter="saturate(0.9) contrast(1.03)"
        drift={-6}
        zoom={0.03}
      />

      <Display x={70} y={238} width={440} size={56} start={0.12}>
        {'The last\nfive percent.'}
      </Display>
      <Italic x={72} y={384} width={410} size={15} start={0.45}>
        The finish, not the flex.
      </Italic>

      <Label
        x={70}
        y={660}
        width={420}
        align="center"
        size={10.5}
        tracking={2.8}
        start={0.35}
      >
        The piece
      </Label>
      <Cutout
        src="sunglasses-lux-cut.png"
        x={70}
        y={702}
        width={420}
        height={151}
        start={0.4}
        rotate={-1.4}
        drift={-4}
      />
      <ProductCaption
        x={70}
        y={860}
        width={420}
        name="Ray-Ban"
        price="$191"
        start={0.7}
      />

      <Label
        x={120}
        y={970}
        width={360}
        align="center"
        size={10.5}
        tracking={2.8}
        start={1.4}
        color={brand.accent}
      >
        Try instead
      </Label>
      <Cutout
        src="sunglasses-budget-cut.png"
        x={120}
        y={1012}
        width={360}
        height={133}
        start={1.45}
        rotate={1.2}
        drift={-4}
      />
      <ProductCaption
        x={120}
        y={1158}
        width={360}
        name="Chris Ray"
        price="$59"
        start={1.62}
        accent
      />

      <Photo
        src={asset('candidates/3768904.jpg')}
        x={520}
        y={1040}
        width={360}
        height={450}
        start={1.85}
        position="center 32%"
        filter="grayscale(1) contrast(1.04)"
        drift={-4}
        zoom={0.04}
      />
      <Italic x={520} y={1502} width={360} align="center" size={13.5} start={2.05}>
        Gold wire, green glass.
      </Italic>
    </AbsoluteFill>
  );
};

/* ─── 08 · The Whole Fit ─── */
type GridItem = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  caption: string;
  rotate: number;
  delay: number;
};

const gridItems: GridItem[] = [
  {
    src: 'knit-budget-cut.png',
    x: 80,
    y: 430,
    width: 300,
    height: 390,
    caption: 'J.Crew · $118',
    rotate: -1.6,
    delay: 0.25,
  },
  {
    src: 'coat-budget-cut.png',
    x: 468,
    y: 418,
    width: 240,
    height: 375,
    caption: 'H&M · $80',
    rotate: 1.4,
    delay: 0.37,
  },
  {
    src: 'trousers-budget-cut.png',
    x: 790,
    y: 448,
    width: 130,
    height: 307,
    caption: 'BR Factory · $35',
    rotate: -1,
    delay: 0.49,
  },
  {
    src: 'loafers-budget-cut.png',
    x: 110,
    y: 1060,
    width: 420,
    height: 171,
    caption: 'Cole Haan · $90',
    rotate: 1.2,
    delay: 0.61,
  },
  {
    src: 'sunglasses-budget-cut.png',
    x: 600,
    y: 1072,
    width: 370,
    height: 137,
    caption: 'Chris Ray · $59',
    rotate: -1.4,
    delay: 0.73,
  },
];

const GridPiece = ({item}: {item: GridItem}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, item.delay - 0.5, 0.65);
  const dy = interpolate(f, [0, 4 * fps], [0, -4], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        opacity: p,
        transform: `translateY(${(1 - p) * 20 + dy}px) rotate(${item.rotate}deg)`,
        zIndex: 3,
      }}
    >
      <Img
        src={product(item.src)}
        style={{
          width: '100%',
          height: item.height,
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 12px 16px rgba(28,26,22,0.15))',
        }}
      />
    </div>
  );
};

const GridCaption = ({
  item,
}: {
  item: GridItem;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = reveal(f, fps, item.delay - 0.35, 0.55);
  return (
    <div
      style={{
        position: 'absolute',
        left: item.x - 20,
        top: item.y + item.height + 22,
        width: item.width + 40,
        textAlign: 'center',
        opacity: p,
        fontFamily: brand.sans,
        fontSize: 12,
        letterSpacing: 2.2,
        textTransform: 'uppercase',
        color: brand.ink,
        zIndex: 5,
      }}
    >
      {item.caption}
    </div>
  );
};

const SceneWholeFit = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Label x={0} y={88} width={1080} align="center" size={12} tracking={5}>
        The whole fit
      </Label>

      <Display
        x={0}
        y={132}
        width={1080}
        align="center"
        size={120}
        start={0.1}
        tracking={-3.4}
        lineHeight={1}
      >
        $381
      </Display>

      <Italic x={0} y={272} width={1080} align="center" size={21} start={0.4}>
        Five finds. One look.
      </Italic>

      <Rule x={510} y={328} width={60} start={0.55} />

      {gridItems.map((item) => (
        <GridPiece key={item.src} item={item} />
      ))}
      {gridItems.map((item) => (
        <GridCaption key={`${item.src}-caption`} item={item} />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 1488,
          height: 1,
          background: brand.line,
          opacity: reveal(f, fps, 2.0, 0.7) * 0.55,
          zIndex: 2,
        }}
      />

      <Italic
        x={0}
        y={1530}
        width={1080}
        align="center"
        size={19}
        start={2.15}
      >
        The whole fit, for less than the coat.
      </Italic>
      <Label
        x={0}
        y={1578}
        width={1080}
        align="center"
        size={11}
        tracking={3.4}
        start={2.35}
      >
        Comment FIT for every link
      </Label>
    </AbsoluteFill>
  );
};

/* ─── 09 · Afterword ─── */
const SceneOutro = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Display
        x={80}
        y={168}
        width={920}
        align="center"
        size={46}
        start={0.08}
        italic
        lineHeight={1.16}
        tracking={-0.5}
      >
        {'The look is the sum\nof its parts.'}
      </Display>

      <Photo
        src={asset('candidates/29876569.jpg')}
        x={340}
        y={350}
        width={400}
        height={500}
        start={-0.5}
        position="center 30%"
        filter="grayscale(1) contrast(1.04)"
        drift={-5}
        zoom={0.03}
        span={3}
      />

      <Italic x={0} y={874} width={1080} align="center" size={15} start={0.75}>
        A quiet silhouette.
      </Italic>

      <div
        style={{
          position: 'absolute',
          top: 962,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: reveal(f, fps, 0.95, 0.7),
          zIndex: 4,
        }}
      >
        <div
          style={{
            fontFamily: brand.sans,
            fontSize: 24,
            letterSpacing: 10,
            color: brand.ink,
            marginLeft: 10,
          }}
        >
          AIWARDBOBE
        </div>
        <div
          style={{
            fontFamily: brand.sans,
            fontSize: 10.5,
            letterSpacing: 3.4,
            color: brand.muted,
            textTransform: 'uppercase',
            marginTop: 12,
          }}
        >
          A film wardrobe study · No. 01
        </div>
      </div>

      <Italic x={0} y={1092} width={1080} align="center" size={21} start={1.2}>
        Comment FIT for every link.
      </Italic>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 62,
          textAlign: 'center',
          fontFamily: brand.sans,
          fontSize: 9.5,
          letterSpacing: 3.2,
          color: brand.muted,
          opacity: reveal(f, fps, 1.45, 0.6) * 0.55,
          zIndex: 3,
        }}
      >
        PHOTOGRAPHY · PEXELS / SUPPLIED REFERENCE
      </div>
    </AbsoluteFill>
  );
};

/* ─── root ─── */
export const KnivesOutCollage = () => {
  const {fps} = useVideoConfig();
  const scenes = [
    {id: 'Cover', s: t.cover, C: SceneCover},
    {id: 'Look', s: t.look, C: SceneLook},
    {id: 'Knit', s: t.knit, C: SceneKnit},
    {id: 'Coat', s: t.coat, C: SceneCoat},
    {id: 'Trousers', s: t.trousers, C: SceneTrousers},
    {id: 'Loafers', s: t.loafers, C: SceneLoafers},
    {id: 'Frames', s: t.sunglasses, C: SceneSunglasses},
    {id: 'WholeFit', s: t.wholeFit, C: SceneWholeFit},
    {id: 'Outro', s: t.outro, C: SceneOutro},
  ];

  return (
    <AbsoluteFill
      style={{
        background: brand.paper,
        fontFamily: brand.serif,
        overflow: 'hidden',
      }}
    >
      <Paper />
      <Audio src={asset('knives-score-30.wav')} volume={0.85} />
      {scenes.map(({id, s, C}) => (
        <Sequence
          key={id}
          name={id}
          from={Math.round(s.from * fps)}
          durationInFrames={Math.round(s.seconds * fps)}
        >
          <C />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
