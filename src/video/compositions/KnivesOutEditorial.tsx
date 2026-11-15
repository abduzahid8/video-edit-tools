/**
 * KnivesOutEditorial — a 51s film-wardrobe study, 1080×1920 at 30fps.
 *
 * Visual language follows the supplied example2 reference: warm off-white
 * paper, high-contrast display serif, hairline rules, huge negative space,
 * small framed photographs and slow crossfades. Content follows the supplied
 * theme.mp4: one luxury piece and one budget "Try" alternative for knit, coat,
 * trousers, loafers and sunglasses, then the whole fit at $381.
 *
 * Photography: real stills cropped from the user-supplied theme.mp4, plus
 * Pexels editorial photography. Product cutouts are deterministic white-key
 * extractions from the supplied reference. No AI-generated people.
 * Audio: original deterministic score in scripts/knives-score.py.
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
import {knivesEditorialTimeline as t, knivesTransitionSeconds} from '../timeline';
import {knivesEditorialBrand as brand} from '../theme';

/* ─── helpers ─── */
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1)};
const asset = (name: string) => staticFile(`assets/knives-out/${name}`);
const product = (name: string) => staticFile(`assets/knives-out/products/${name}`);

const fadeIn = (f: number, fps: number, seconds = 0.9, delay = 0) =>
  interpolate(f, [delay * fps, (delay + seconds) * fps], [0, 1], ease);

// The outgoing page clears to paper first, then the incoming page fades up.
// This keeps big display type from double-exposing during a dissolve.
const SceneShell = ({
  seconds,
  isLast,
  children,
}: {
  seconds: number;
  isLast: boolean;
  children: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = isLast
    ? 1
    : interpolate(f, [seconds * fps, (seconds + 0.25) * fps], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>{children}</div>
  );
};

type PanelData = {
  label: string;
  brand: string;
  name: string;
  price?: string;
  body: string;
  image: string;
  caption: string;
  accent?: boolean;
};

const knitLux: PanelData = {
  label: 'The luxury piece',
  brand: 'The Kooples',
  name: 'Wool-cashmere cable knit',
  price: '$395',
  body: 'A heavy cable knit gives the eye somewhere to rest.',
  image: 'knit-lux-cut.png',
  caption: 'The Kooples · $395',
};
const knitBudget: PanelData = {
  label: 'Try instead',
  brand: 'J.Crew',
  name: 'Cotton cable-knit sweater',
  price: '$118',
  body: 'The same texture at a third of the price.',
  image: 'knit-budget-cut.png',
  caption: 'J.Crew · $118',
  accent: true,
};

const coatLux: PanelData = {
  label: 'The luxury piece',
  brand: 'Theory',
  name: 'Wool-cashmere topcoat',
  price: '$795',
  body: 'Camel, cut clean. The coat does the talking.',
  image: 'coat-lux-cut.png',
  caption: 'Theory · $795',
};
const coatBudget: PanelData = {
  label: 'Try instead',
  brand: 'H&M',
  name: 'Wool-blend topcoat',
  price: '$80',
  body: 'The same camel line for a fraction of the cost.',
  image: 'coat-budget-cut.png',
  caption: 'H&M · $80',
  accent: true,
};

const trousersLux: PanelData = {
  label: 'The luxury piece',
  brand: 'Suitsupply',
  name: 'Navy chalk-stripe trousers',
  body: 'The stripe is quiet. The break is clean.',
  image: 'trousers-lux-cut.png',
  caption: 'Suitsupply · Navy chalk-stripe',
};
const trousersBudget: PanelData = {
  label: 'Try instead',
  brand: 'Banana Republic Factory',
  name: 'Slim navy trousers',
  price: '$35',
  body: 'The same line, without the tailor’s bill.',
  image: 'trousers-budget-cut.png',
  caption: 'Banana Republic Factory · $35',
  accent: true,
};

const loafersLux: PanelData = {
  label: 'The luxury piece',
  brand: 'Gucci',
  name: 'Horsebit 1953 loafer',
  price: '$1,090',
  body: 'The horsebit is the only ornament the look needs.',
  image: 'loafers-lux-cut.png',
  caption: 'Gucci · $1,090',
};
const loafersBudget: PanelData = {
  label: 'Try instead',
  brand: 'Cole Haan',
  name: 'Leather penny loafer',
  price: '$90',
  body: 'The same easy shape at a tenth of the price.',
  image: 'loafers-budget-cut.png',
  caption: 'Cole Haan · $90',
  accent: true,
};

const sunglassesLux: PanelData = {
  label: 'The luxury piece',
  brand: 'Ray-Ban',
  name: 'RB3447 Round Metal',
  price: '$191',
  body: 'Gold wire, green glass. The finish, not the flex.',
  image: 'sunglasses-lux-cut.png',
  caption: 'Ray-Ban · $191',
};
const sunglassesBudget: PanelData = {
  label: 'Try instead',
  brand: 'Chris Ray',
  name: 'Browline sunglasses',
  price: '$59',
  body: 'A browline alternative for less than a third.',
  image: 'sunglasses-budget-cut.png',
  caption: 'Chris Ray · $59',
  accent: true,
};

/* ─── shared surfaces ─── */
const PaperBackdrop = () => (
  <AbsoluteFill style={{backgroundColor: brand.paper}}>
    <AbsoluteFill
      style={{
        backgroundImage: `url(${asset('paper-grain.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  </AbsoluteFill>
);

const PageFooter = ({page}: {page: string}) => (
  <>
    <div
      style={{
        position: 'absolute',
        bottom: 34,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: brand.sans,
        fontSize: 9.5,
        letterSpacing: 3.1,
        color: brand.muted,
        opacity: 0.72,
        textTransform: 'uppercase',
      }}
    >
      AIWARDBOBE · A FILM WARDROBE STUDY
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: 34,
        right: 54,
        fontFamily: brand.sans,
        fontSize: 9.5,
        letterSpacing: 2.4,
        color: brand.muted,
        opacity: 0.72,
      }}
    >
      {page}
    </div>
  </>
);

const SmallCaps = ({
  children,
  size = 12,
  tracking = 4.5,
  color = brand.muted,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  tracking?: number;
  color?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      fontFamily: brand.sans,
      fontSize: size,
      letterSpacing: tracking,
      color,
      textTransform: 'uppercase',
      lineHeight: 1.4,
      ...style,
    }}
  >
    {children}
  </div>
);

const Italic = ({
  children,
  size = 24,
  color = brand.ink,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      fontFamily: brand.serif,
      fontStyle: 'italic',
      fontSize: size,
      color,
      lineHeight: 1.35,
      ...style,
    }}
  >
    {children}
  </div>
);

const SceneHeader = ({
  index,
  label,
  delay = 0.05,
}: {
  index?: string;
  label: string;
  delay?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(f, [delay * fps, (delay + 0.75) * fps], [0, 1], ease);
  return (
    <div
      style={{
        position: 'absolute',
        top: 104,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        zIndex: 5,
      }}
    >
      <SmallCaps size={12} tracking={5.2} color={brand.muted}>
        {index ? `${index} — ${label}` : label}
      </SmallCaps>
      <div
        style={{
          width: 54,
          height: 1,
          background: brand.rule,
          margin: '17px auto 0',
          opacity: 0.62,
        }}
      />
    </div>
  );
};

/* ─── framed photograph ─── */
const FramedPhoto = ({
  src,
  x,
  y,
  width,
  height,
  delay = 0,
  objectPosition = 'center',
  filter = 'none',
  matte = 10,
  drift = 6,
  zoom = 0.035,
  span = 6,
  zIndex = 1,
}: {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  delay?: number;
  objectPosition?: string;
  filter?: string;
  matte?: number;
  drift?: number;
  zoom?: number;
  span?: number;
  zIndex?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(f, [delay * fps, (delay + 1.05) * fps], [0, 1], ease);
  const driftY = interpolate(f, [0, span * fps], [0, drift], clamp);
  const zoomP = interpolate(f, [0, span * fps], [0, zoom], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity: p,
        transform: `translateY(${(1 - p) * 16 + driftY}px)`,
        zIndex,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: matte,
          background: brand.paperLight,
          border: '1px solid rgba(28,26,22,0.48)',
          boxShadow: brand.shadow,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            background: '#e8e2d6',
          }}
        >
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition,
              filter,
              display: 'block',
              transform: `scale(${1 + zoomP})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── editorial product panel + luxury/try crossfade ─── */
const EditorialPanel = ({
  data,
  x,
  y,
  width,
  imageHeight,
}: {
  data: PanelData;
  x: number;
  y: number;
  width: number;
  imageHeight: number;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        zIndex: 4,
      }}
    >
      <SmallCaps
        size={11}
        tracking={4.2}
        color={data.accent ? brand.accent : brand.muted}
      >
        {data.label}
      </SmallCaps>
      <div
        style={{
          fontFamily: brand.display,
          fontSize: 37,
          lineHeight: 1.02,
          letterSpacing: -0.4,
          color: brand.ink,
          marginTop: 11,
        }}
      >
        {data.brand}
      </div>
      <Italic size={20} color={brand.muted} style={{marginTop: 7, lineHeight: 1.28}}>
        {data.name}
      </Italic>
      {data.price ? (
        <div
          style={{
            fontFamily: brand.display,
            fontSize: 29,
            color: brand.ink,
            marginTop: 11,
            letterSpacing: -0.2,
          }}
        >
          {data.price}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: brand.serif,
          fontSize: 17.5,
          lineHeight: 1.55,
          color: brand.muted,
          marginTop: 13,
          maxWidth: width - 10,
        }}
      >
        {data.body}
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: imageHeight,
          marginTop: 18,
        }}
      >
        <Img
          src={product(data.image)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: brand.sans,
          fontSize: 10,
          letterSpacing: 2.2,
          color: brand.faint,
          textAlign: 'center',
          marginTop: 7,
          textTransform: 'uppercase',
          lineHeight: 1.5,
        }}
      >
        {data.caption}
      </div>
    </div>
  );
};

const CrossfadePanels = ({
  at,
  a,
  b,
  x,
  y,
  width,
  imageHeight,
}: {
  at: number;
  a: PanelData;
  b: PanelData;
  x: number;
  y: number;
  width: number;
  imageHeight: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // The luxury plate leaves first; the try plate follows a beat later and
  // rises into place. The offset keeps the two headlines from reading as one.
  const out = interpolate(f, [at * fps, (at + 0.5) * fps], [0, 1], ease);
  const inn = interpolate(f, [(at + 0.12) * fps, (at + 0.82) * fps], [0, 1], ease);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - out,
          transform: `translateY(${-out * 22}px)`,
        }}
      >
        <EditorialPanel data={a} x={x} y={y} width={width} imageHeight={imageHeight} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: inn,
          transform: `translateY(${(1 - inn) * 22}px)`,
        }}
      >
        <EditorialPanel data={b} x={x} y={y} width={width} imageHeight={imageHeight} />
      </div>
    </>
  );
};

/* ─── 01 · Cover ─── */
const SceneCover = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleP = 1;
  const titleY = interpolate(f, [0, 1.2 * fps], [12, 0], ease);
  const photoP = 1;
  const photoY = interpolate(f, [0, 1.2 * fps], [14, 0], ease);
  const capP = interpolate(f, [0.7 * fps, 1.5 * fps], [0, 1], ease);
  const scale = interpolate(f, [0, seconds * fps], [1, 1.035], clamp);

  return (
    <AbsoluteFill style={{opacity: 1}}>
      <PaperBackdrop />

      <div
        style={{
          position: 'absolute',
          top: 128,
          left: 60,
          right: 60,
          textAlign: 'center',
          opacity: titleP,
          transform: `translateY(${titleY}px)`,
          zIndex: 3,
        }}
      >
        <SmallCaps size={12} tracking={6} color={brand.muted}>
          A film wardrobe study
        </SmallCaps>
        <div
          style={{
            fontFamily: brand.display,
            fontSize: 61,
            lineHeight: 1.08,
            letterSpacing: -0.9,
            color: brand.ink,
            marginTop: 27,
          }}
        >
          What Makes the Knives Out
        </div>
        <div
          style={{
            fontFamily: brand.display,
            fontSize: 61,
            lineHeight: 1.08,
            letterSpacing: -0.9,
            color: brand.ink,
          }}
        >
          Look So Good?
        </div>
        <div
          style={{
            width: 64,
            height: 1,
            background: brand.rule,
            margin: '28px auto 0',
            opacity: 0.7,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 280,
          top: 520,
          width: 520,
          height: 650,
          opacity: photoP,
          transform: `translateY(${photoY}px)`,
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 12,
            background: brand.paperLight,
            border: '1px solid rgba(28,26,22,0.5)',
            boxShadow: brand.shadow,
            boxSizing: 'border-box',
          }}
        >
          <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
            <Img
              src={asset('raw/hero-knit.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%',
                filter: 'grayscale(0.18) sepia(0.06) contrast(1.02) saturate(0.92)',
                transform: `scale(${scale})`,
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1218,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: capP,
          zIndex: 3,
        }}
      >
        <Italic size={24} color={brand.ink}>
          Chris Evans · Knives Out, 2019
        </Italic>
        <div
          style={{
            fontFamily: brand.serif,
            fontSize: 18,
            color: brand.muted,
            marginTop: 10,
            letterSpacing: 0.2,
          }}
        >
          Five pieces. One quietly expensive silhouette.
        </div>
      </div>

      <PageFooter page="01 / 09" />
    </AbsoluteFill>
  );
};

/* ─── 02 · The Look ─── */
const SceneLook = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const textP = interpolate(f, [0.55 * fps, 1.35 * fps], [0, 1], ease);
  const textY = interpolate(f, [0.55 * fps, 1.35 * fps], [22, 0], ease);
  const listP = interpolate(f, [0.35 * fps, 1.1 * fps], [0, 1], ease);
  const captionP = interpolate(f, [1.45 * fps, 2.2 * fps], [0, 1], ease);

  return (
    <AbsoluteFill style={{opacity: fadeIn(f, fps, 0.45, 0.25)}}>
      <PaperBackdrop />
      <SceneHeader label="The Look" />

      <FramedPhoto
        src={asset('raw/hero-coat.jpg')}
        x={70}
        y={230}
        width={650}
        height={760}
        delay={0.12}
        objectPosition="center 28%"
        filter="grayscale(0.22) sepia(0.07) contrast(1.02) saturate(0.9)"
        drift={7}
        span={seconds}
      />

      <div
        style={{
          position: 'absolute',
          right: 60,
          top: 255,
          width: 255,
          opacity: listP,
          zIndex: 3,
        }}
      >
        <SmallCaps size={10.5} tracking={3.8} color={brand.muted}>
          Five pieces
        </SmallCaps>
        <div style={{width: '100%', height: 1, background: brand.line, marginTop: 14}} />
        {['The Knit', 'The Coat', 'The Trousers', 'The Loafers', 'The Frames'].map(
          (item, i) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                marginTop: 17,
                fontFamily: brand.serif,
                fontSize: 17,
                color: brand.ink,
              }}
            >
              <span
                style={{
                  fontFamily: brand.sans,
                  fontSize: 9,
                  letterSpacing: 1.8,
                  color: brand.faint,
                }}
              >
                0{i + 1}
              </span>
              <span>{item}</span>
            </div>
          ),
        )}
        <div style={{width: '100%', height: 1, background: brand.line, marginTop: 23}} />
        <Italic size={17} color={brand.muted} style={{marginTop: 16, lineHeight: 1.5}}>
          Nothing shouts.
          <br />
          Everything agrees.
        </Italic>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 1038,
          width: 650,
          opacity: textP,
          transform: `translateY(${textY}px)`,
          zIndex: 3,
        }}
      >
        <div style={{width: 54, height: 1, background: brand.rule, opacity: 0.65, marginBottom: 22}} />
        <Italic size={43} color={brand.ink} style={{lineHeight: 1.16, letterSpacing: -0.4}}>
          A study in quiet accumulation.
        </Italic>
        <div
          style={{
            fontFamily: brand.serif,
            fontSize: 21,
            lineHeight: 1.65,
            color: brand.muted,
            marginTop: 20,
            maxWidth: 610,
          }}
        >
          A heavy cream knit, a camel topcoat, chalk-stripe trousers, horsebit
          loafers and round metal frames. The luxury is in the agreement, not the
          logo.
        </div>
      </div>

      <FramedPhoto
        src={asset('candidates/27175948.jpg')}
        x={770}
        y={975}
        width={245}
        height={305}
        delay={1.15}
        objectPosition="center 45%"
        filter="grayscale(0.55) sepia(0.08) contrast(1.02)"
        drift={5}
        span={seconds}
        matte={9}
      />
      <div
        style={{
          position: 'absolute',
          left: 770,
          top: 1292,
          width: 245,
          textAlign: 'center',
          fontFamily: brand.serif,
          fontStyle: 'italic',
          fontSize: 14,
          color: brand.muted,
          opacity: captionP,
        }}
      >
        The library, after hours.
      </div>

      <PageFooter page="02 / 09" />
    </AbsoluteFill>
  );
};

/* ─── product chapter shell ─── */
const ProductChapter = ({
  seconds,
  index,
  label,
  page,
  hero,
  heroX,
  heroY,
  heroW,
  heroH,
  heroPosition,
  heroFilter,
  panelX,
  panelY,
  panelWidth,
  imageHeight,
  luxury,
  budget,
  inset,
  insetX,
  insetY,
  insetW,
  insetH,
  insetPosition,
  insetFilter,
  insetCaption,
  closingLine,
  closingY,
  ruleX,
  ruleY,
  ruleH,
}: {
  seconds: number;
  index: string;
  label: string;
  page: string;
  hero: string;
  heroX: number;
  heroY: number;
  heroW: number;
  heroH: number;
  heroPosition: string;
  heroFilter: string;
  panelX: number;
  panelY: number;
  panelWidth: number;
  imageHeight: number;
  luxury: PanelData;
  budget: PanelData;
  inset?: string;
  insetX?: number;
  insetY?: number;
  insetW?: number;
  insetH?: number;
  insetPosition?: string;
  insetFilter?: string;
  insetCaption?: string;
  closingLine?: string;
  closingY?: number;
  ruleX?: number;
  ruleY?: number;
  ruleH?: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const closingP = interpolate(f, [2.2 * fps, 3.0 * fps], [0, 1], ease);
  const insetCaptionP = interpolate(f, [1.25 * fps, 2.0 * fps], [0, 1], ease);

  return (
    <AbsoluteFill style={{opacity: fadeIn(f, fps, 0.45, 0.25)}}>
      <PaperBackdrop />
      <SceneHeader index={index} label={label} />

      {ruleX ? (
        <div
          style={{
            position: 'absolute',
            left: ruleX,
            top: ruleY ?? 250,
            width: 1,
            height: ruleH ?? 800,
            background: brand.line,
            opacity: 0.5,
            zIndex: 1,
          }}
        />
      ) : null}

      <FramedPhoto
        src={asset(hero)}
        x={heroX}
        y={heroY}
        width={heroW}
        height={heroH}
        delay={0.12}
        objectPosition={heroPosition}
        filter={heroFilter}
        drift={7}
        span={seconds}
      />

      <CrossfadePanels
        at={3}
        a={luxury}
        b={budget}
        x={panelX}
        y={panelY}
        width={panelWidth}
        imageHeight={imageHeight}
      />

      {inset && insetX !== undefined && insetY !== undefined ? (
        <>
          <FramedPhoto
            src={asset(inset)}
            x={insetX}
            y={insetY}
            width={insetW ?? 300}
            height={insetH ?? 230}
            delay={1.0}
            objectPosition={insetPosition ?? 'center'}
            filter={insetFilter ?? 'none'}
            drift={5}
            span={seconds}
            matte={9}
          />
          {insetCaption ? (
            <div
              style={{
                position: 'absolute',
                left: insetX,
                top: insetY + (insetH ?? 230) + 14,
                width: insetW ?? 300,
                textAlign: 'center',
                fontFamily: brand.serif,
                fontStyle: 'italic',
                fontSize: 14,
                color: brand.muted,
                opacity: insetCaptionP,
              }}
            >
              {insetCaption}
            </div>
          ) : null}
        </>
      ) : null}

      {closingLine ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: closingY ?? 1380,
            textAlign: 'center',
            opacity: closingP,
            zIndex: 3,
          }}
        >
          <Italic size={20} color={brand.muted}>
            {closingLine}
          </Italic>
        </div>
      ) : null}

      <PageFooter page={page} />
    </AbsoluteFill>
  );
};

/* ─── 03 · Knit ─── */
const SceneKnit = ({seconds}: {seconds: number}) => (
  <ProductChapter
    seconds={seconds}
    index="01"
    label="The Knit"
    page="03 / 09"
    hero="raw/hero-knit.jpg"
    heroX={60}
    heroY={230}
    heroW={540}
    heroH={620}
    heroPosition="center 32%"
    heroFilter="grayscale(0.14) sepia(0.05) contrast(1.02) saturate(0.94)"
    panelX={650}
    panelY={250}
    panelWidth={360}
    imageHeight={360}
    luxury={knitLux}
    budget={knitBudget}
    inset="candidates/20775155.jpg"
    insetX={60}
    insetY={920}
    insetW={300}
    insetH={230}
    insetPosition="center 35%"
    insetFilter="grayscale(1) contrast(1.03)"
    insetCaption="Cable, in close."
    closingLine="Softness is the point."
    closingY={1265}
    ruleX={620}
    ruleY={250}
    ruleH={820}
  />
);

/* ─── 04 · Coat ─── */
const SceneCoat = ({seconds}: {seconds: number}) => (
  <ProductChapter
    seconds={seconds}
    index="02"
    label="The Coat"
    page="04 / 09"
    hero="raw/hero-coat.jpg"
    heroX={480}
    heroY={230}
    heroW={540}
    heroH={620}
    heroPosition="center 28%"
    heroFilter="grayscale(0.2) sepia(0.07) contrast(1.02) saturate(0.9)"
    panelX={70}
    panelY={250}
    panelWidth={360}
    imageHeight={380}
    luxury={coatLux}
    budget={coatBudget}
    inset="candidates/30007899.jpg"
    insetX={720}
    insetY={920}
    insetW={300}
    insetH={230}
    insetPosition="center 30%"
    insetFilter="grayscale(1) contrast(1.04)"
    insetCaption="Tweed, in winter."
    closingLine="Camel, not costume."
    closingY={1265}
    ruleX={455}
    ruleY={250}
    ruleH={820}
  />
);

/* ─── 05 · Trousers ─── */
const SceneTrousers = ({seconds}: {seconds: number}) => (
  <ProductChapter
    seconds={seconds}
    index="03"
    label="The Trousers"
    page="05 / 09"
    hero="raw/hero-trousers.jpg"
    heroX={60}
    heroY={230}
    heroW={540}
    heroH={620}
    heroPosition="center 48%"
    heroFilter="grayscale(0.2) sepia(0.06) contrast(1.03) saturate(0.88)"
    panelX={650}
    panelY={250}
    panelWidth={360}
    imageHeight={400}
    luxury={trousersLux}
    budget={trousersBudget}
    inset="candidates/7918113.jpg"
    insetX={60}
    insetY={920}
    insetW={300}
    insetH={230}
    insetPosition="center 40%"
    insetFilter="grayscale(1) contrast(1.04)"
    insetCaption="Chalk stripe, in detail."
    closingLine="Tailoring, without the noise."
    closingY={1265}
    ruleX={620}
    ruleY={250}
    ruleH={820}
  />
);

/* ─── 06 · Loafers ─── */
const SceneLoafers = ({seconds}: {seconds: number}) => (
  <ProductChapter
    seconds={seconds}
    index="04"
    label="The Loafers"
    page="06 / 09"
    hero="raw/hero-loafers.jpg"
    heroX={60}
    heroY={230}
    heroW={960}
    heroH={480}
    heroPosition="center 72%"
    heroFilter="grayscale(0.2) sepia(0.07) contrast(1.03) saturate(0.9)"
    panelX={70}
    panelY={795}
    panelWidth={430}
    imageHeight={230}
    luxury={loafersLux}
    budget={loafersBudget}
    inset="candidates/8159478.jpg"
    insetX={620}
    insetY={800}
    insetW={380}
    insetH={280}
    insetPosition="center"
    insetFilter="grayscale(0.3) sepia(0.08) contrast(1.02)"
    insetCaption="Brown leather, on rattan."
    closingLine="Spend here. Save everywhere else."
    closingY={1320}
  />
);

/* ─── 07 · Sunglasses ─── */
const SceneSunglasses = ({seconds}: {seconds: number}) => (
  <ProductChapter
    seconds={seconds}
    index="05"
    label="The Frames"
    page="07 / 09"
    hero="raw/hero-sunglasses.jpg"
    heroX={60}
    heroY={230}
    heroW={960}
    heroH={480}
    heroPosition="center 38%"
    heroFilter="grayscale(0.22) sepia(0.07) contrast(1.03) saturate(0.88)"
    panelX={70}
    panelY={795}
    panelWidth={430}
    imageHeight={210}
    luxury={sunglassesLux}
    budget={sunglassesBudget}
    inset="candidates/8360292.jpg"
    insetX={620}
    insetY={800}
    insetW={380}
    insetH={280}
    insetPosition="center"
    insetFilter="grayscale(1) contrast(1.04)"
    insetCaption="Black acetate, on paper."
    closingLine="The last five percent of the look."
    closingY={1320}
  />
);

/* ─── 08 · Whole Fit ─── */
type GridItem = {
  index: string;
  image: string;
  caption: string;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
};

const gridItems: GridItem[] = [
  {
    index: '01',
    image: 'knit-budget-cut.png',
    caption: 'J.Crew · $118',
    x: 80,
    y: 440,
    width: 440,
    height: 470,
    delay: 0.2,
  },
  {
    index: '02',
    image: 'coat-budget-cut.png',
    caption: 'H&M · $80',
    x: 560,
    y: 440,
    width: 440,
    height: 470,
    delay: 0.32,
  },
  {
    index: '03',
    image: 'trousers-budget-cut.png',
    caption: 'Banana Republic Factory · $35',
    x: 80,
    y: 940,
    width: 440,
    height: 420,
    delay: 0.44,
  },
  {
    index: '04',
    image: 'loafers-budget-cut.png',
    caption: 'Cole Haan · $90',
    x: 560,
    y: 940,
    width: 440,
    height: 420,
    delay: 0.56,
  },
  {
    index: '05',
    image: 'sunglasses-budget-cut.png',
    caption: 'Chris Ray · $59',
    x: 290,
    y: 1390,
    width: 500,
    height: 270,
    delay: 0.68,
  },
];

const GridCard = ({item}: {item: GridItem}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(f, [item.delay * fps, (item.delay + 0.85) * fps], [0, 1], ease);
  return (
    <div
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid rgba(28,26,22,0.16)',
          background: 'rgba(255,252,246,0.28)',
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 14,
          fontFamily: brand.sans,
          fontSize: 9,
          letterSpacing: 2,
          color: brand.faint,
        }}
      >
        {item.index}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 32,
          bottom: 50,
        }}
      >
        <Img
          src={product(item.image)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 15,
          left: 10,
          right: 10,
          textAlign: 'center',
          fontFamily: brand.sans,
          fontSize: 10.5,
          letterSpacing: 1.9,
          color: brand.ink,
          textTransform: 'uppercase',
          lineHeight: 1.4,
        }}
      >
        {item.caption}
      </div>
    </div>
  );
};

const SceneWholeFit = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headerP = interpolate(f, [0.1 * fps, 0.95 * fps], [0, 1], ease);
  const closingP = interpolate(f, [4.2 * fps, 5.0 * fps], [0, 1], ease);

  return (
    <AbsoluteFill style={{opacity: fadeIn(f, fps, 0.45, 0.25)}}>
      <PaperBackdrop />

      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: headerP,
          zIndex: 3,
        }}
      >
        <SmallCaps size={12} tracking={5.2} color={brand.muted}>
          The whole fit
        </SmallCaps>
        <div
          style={{
            fontFamily: brand.display,
            fontSize: 108,
            lineHeight: 1.0,
            letterSpacing: -3.2,
            color: brand.ink,
            marginTop: 12,
          }}
        >
          $381
        </div>
        <Italic size={23} color={brand.muted} style={{marginTop: 2}}>
          Comment FIT for every link.
        </Italic>
        <div
          style={{
            width: 70,
            height: 1,
            background: brand.rule,
            margin: '22px auto 0',
            opacity: 0.65,
          }}
        />
      </div>

      {gridItems.map((item) => (
        <GridCard key={item.index} item={item} />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1720,
          textAlign: 'center',
          opacity: closingP,
          zIndex: 3,
        }}
      >
        <Italic size={19} color={brand.muted}>
          Five finds. One look.
        </Italic>
      </div>

      <PageFooter page="08 / 09" />
    </AbsoluteFill>
  );
};

/* ─── 09 · Outro ─── */
const SceneOutro = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const textP = interpolate(f, [0.15 * fps, 1.0 * fps], [0, 1], ease);
  const textY = interpolate(f, [0.15 * fps, 1.0 * fps], [20, 0], ease);
  const photoP = interpolate(f, [0.5 * fps, 1.5 * fps], [0, 1], ease);
  const markP = interpolate(f, [1.35 * fps, 2.15 * fps], [0, 1], ease);
  const out = interpolate(f, [(seconds - 1.0) * fps, seconds * fps], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: fadeIn(f, fps, 0.45, 0.25)}}>
      <PaperBackdrop />
      <div style={{position: 'absolute', inset: 0, opacity: out}}>
        <SceneHeader label="Afterword" />

        <div
          style={{
            position: 'absolute',
            top: 235,
            left: 80,
            right: 80,
            textAlign: 'center',
            opacity: textP,
            transform: `translateY(${textY}px)`,
            zIndex: 3,
          }}
        >
          <Italic size={49} color={brand.ink} style={{lineHeight: 1.12, letterSpacing: -0.5}}>
            The look is the sum
            <br />
            of its parts.
          </Italic>
        </div>

        <FramedPhoto
          src={asset('candidates/29876569.jpg')}
          x={330}
          y={475}
          width={420}
          height={520}
          delay={0.45}
          objectPosition="center 30%"
          filter="grayscale(1) contrast(1.04)"
          drift={5}
          span={seconds}
          matte={11}
        />
        <div
          style={{
            position: 'absolute',
            top: 1022,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: brand.serif,
            fontStyle: 'italic',
            fontSize: 17,
            color: brand.muted,
            opacity: photoP,
          }}
        >
          A quiet silhouette.
        </div>

        <div
          style={{
            position: 'absolute',
            top: 1135,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: markP,
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontFamily: brand.sans,
              fontSize: 25,
              letterSpacing: 10,
              color: brand.ink,
              marginLeft: 10,
            }}
          >
            AIWARDBOBE
          </div>
          <SmallCaps size={11} tracking={4.2} color={brand.muted} style={{marginTop: 12}}>
            A film wardrobe study · No. 01
          </SmallCaps>
          <Italic size={20} color={brand.ink} style={{marginTop: 30}}>
            Comment FIT for every link.
          </Italic>
          <div
            style={{
              fontFamily: brand.serif,
              fontSize: 15,
              color: brand.muted,
              marginTop: 12,
            }}
          >
            Five pieces. One quiet silhouette.
          </div>
        </div>

        <PageFooter page="09 / 09" />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Root composition ─── */
export const KnivesOutEditorial = () => {
  const {fps} = useVideoConfig();
  const overlap = Math.round(knivesTransitionSeconds * fps);
  const scenes = [
    {id: 'Cover', s: t.cover, C: SceneCover},
    {id: 'Look', s: t.look, C: SceneLook},
    {id: 'Knit', s: t.knit, C: SceneKnit},
    {id: 'Coat', s: t.coat, C: SceneCoat},
    {id: 'Trousers', s: t.trousers, C: SceneTrousers},
    {id: 'Loafers', s: t.loafers, C: SceneLoafers},
    {id: 'Sunglasses', s: t.sunglasses, C: SceneSunglasses},
    {id: 'WholeFit', s: t.wholeFit, C: SceneWholeFit},
    {id: 'Outro', s: t.outro, C: SceneOutro},
  ];

  return (
    <AbsoluteFill style={{background: brand.paper, fontFamily: brand.serif}}>
      <Audio src={asset('knives-score.wav')} volume={0.9} />
      {scenes.map(({id, s, C}, i) => {
        const isLast = i === scenes.length - 1;
        return (
          <Sequence
            key={id}
            name={id}
            from={Math.round(s.from * fps)}
            durationInFrames={Math.round(s.seconds * fps) + (isLast ? 0 : overlap)}
          >
            <SceneShell seconds={s.seconds} isLast={isLast}>
              <C seconds={s.seconds} />
            </SceneShell>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
