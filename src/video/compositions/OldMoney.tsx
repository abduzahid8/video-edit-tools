/**
 * OldMoney — men's fashion editorial, 36s
 *
 * Theme: "How to dress old money style"
 * Structure mirrors the reference "two jackets" video:
 *   1. Hero headline + two cut-out portraits
 *   2. Framed editorial slides sliding in from the right + runway with dotted centre line
 *   3. Full-bleed close-up with dotted V-collar annotation, "Anchors the whole look",
 *      leader-line circle label and comment bubbles
 *   4. Search bar → product card
 *   5. Lookbook flat-lay + street pairs drifting
 *   6. Icon portrait with mono caption + inset still
 *   7. B&W trio outro: italic "Second hand" → "$200"
 *
 * All photography: Pexels (free stock, downloaded to public/assets/oldmoney).
 * Background removal: deterministic scripts/cutout.py — no AI generation.
 * Audio: none (silent render).
 */

import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  Easing,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {oldMoneyTimeline as t} from '../timeline';
import {oldMoneyBrand as brand} from '../theme';

/* ─── helpers ─── */
const c = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...c, easing: Easing.bezier(0.16, 1, 0.3, 1)};
// Fade in only — the outgoing scene is held opaque underneath while the next
// scene dissolves over it, so scene changes never dip to white (as in the reference).
const fade = (f: number, fps: number, inS = 0.3) =>
  interpolate(f, [0, inS * fps], [0, 1], c);

const serif = 'Georgia, "Times New Roman", Times, serif';
const serifItalic: React.CSSProperties = {fontFamily: serif, fontStyle: 'italic'};
const mono = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const asset = (name: string) => staticFile(`assets/oldmoney/${name}`);

/* ─── Scene 1: Hero headline + two cut-out portraits ─── */
const SceneHero = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Reference opens on full content at frame 0 — no fade from white.
  const alpha = 1;
  const panY = interpolate(f, [0, 0.9 * fps], [40, 0], ease);
  const textAlpha = 1;
  const leftScale = interpolate(f, [0, 0.8 * fps], [0.84, 1], ease);
  const rightScale = interpolate(f, [0.15 * fps, 0.95 * fps], [0.84, 1], ease);

  return (
    <AbsoluteFill style={{background: brand.paper, opacity: alpha}}>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: textAlpha,
          transform: `translateY(${panY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 7,
            color: brand.muted,
            marginBottom: 30,
            fontFamily: mono,
          }}
        >
          STYLE GUIDE
        </div>
        <div style={{fontSize: 74, lineHeight: 1.16, letterSpacing: -2, fontFamily: serif, color: brand.ink}}>
          How to dress
        </div>
        <div style={{...serifItalic, fontSize: 74, lineHeight: 1.16, letterSpacing: -1, color: brand.ink}}>
          old money style
        </div>
      </div>

      {/* Left cut-out — black overcoat */}
      <div
        style={{
          position: 'absolute',
          left: -30,
          bottom: -20,
          transform: `scale(${leftScale})`,
          transformOrigin: 'bottom left',
        }}
      >
        <Img
          src={asset('cut-34609625.png')}
          style={{width: 560, height: 'auto', display: 'block', filter: 'grayscale(100%)'}}
        />
      </div>

      {/* Right cut-out — two men in waistcoats */}
      <div
        style={{
          position: 'absolute',
          right: -40,
          bottom: -30,
          transform: `scale(${rightScale})`,
          transformOrigin: 'bottom right',
        }}
      >
        <Img
          src={asset('cut-40459722.png')}
          style={{width: 660, height: 'auto', display: 'block', filter: 'grayscale(100%)'}}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Framed slide component (light-grey border on white) ─── */
const FramedSlide = ({
  src,
  left,
  top,
  width,
  height,
  start,
  objectPosition = 'center',
}: {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  start: number;
  objectPosition?: string;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const x = interpolate(f, [start * fps, (start + 0.7) * fps], [420, 0], ease);
  const alpha = interpolate(f, [start * fps, (start + 0.45) * fps], [0, 1], c);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        background: brand.frame,
        border: `14px solid ${brand.border}`,
        boxShadow: '0 18px 50px rgba(0,0,0,0.10)',
        overflow: 'hidden',
        opacity: alpha,
        transform: `translateX(${x}px)`,
        boxSizing: 'border-box',
      }}
    >
      <Img
        src={src}
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block'}}
      />
    </div>
  );
};

/* ─── Scene 2: Framed editorial slides + runway with dotted centre line ─── */
const SceneFrames = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = fade(f, fps);

  // Dotted centre line on the runway frame (draws after the frame lands)
  const lineProg = interpolate(f, [3.4 * fps, 4.4 * fps], [0, 1], ease);
  const lineAlpha = interpolate(f, [3.4 * fps, 3.8 * fps], [0, 1], c);
  const labelAlpha = interpolate(f, [4.2 * fps, 4.8 * fps], [0, 1], ease);

  const runwayLeft = 180;
  const runwayTop = 1330;
  const runwayW = 720;
  const runwayH = 500;

  return (
    <AbsoluteFill style={{background: brand.paper, overflow: 'hidden', opacity: alpha}}>
      {/* Slide 1 — knit look */}
      <FramedSlide
        src={asset('src-30313549.jpg')}
        left={70}
        top={150}
        width={760}
        height={560}
        start={0.1}
      />

      {/* Slide 2 — flat-lay */}
      <FramedSlide
        src={asset('src-1619655.jpg')}
        left={260}
        top={770}
        width={740}
        height={480}
        start={1.6}
      />

      {/* Slide 3 — runway with dotted centre annotation */}
      <FramedSlide
        src={asset('src-12515249.jpg')}
        left={runwayLeft}
        top={runwayTop}
        width={runwayW}
        height={runwayH}
        start={3.0}
        objectPosition="center 30%"
      />

      {/* Dotted vertical centre line over the runway frame */}
      <svg
        width="1080"
        height="1920"
        style={{position: 'absolute', inset: 0, opacity: lineAlpha, pointerEvents: 'none'}}
      >
        <line
          x1={runwayLeft + runwayW / 2}
          y1={runwayTop}
          x2={runwayLeft + runwayW / 2}
          y2={runwayTop + runwayH * lineProg}
          stroke="#111"
          strokeWidth={1.5}
          strokeDasharray="7,7"
        />
        <circle cx={runwayLeft + runwayW / 2} cy={runwayTop + runwayH} r={5} fill="#111" />
        <circle cx={runwayLeft + runwayW / 2} cy={runwayTop + runwayH} r={13} fill="none" stroke="#111" strokeWidth={1.5} />
      </svg>

      {/* Italic label beside the runway */}
      <div
        style={{
          position: 'absolute',
          top: runwayTop + runwayH + 40,
          left: runwayLeft,
          opacity: labelAlpha,
          ...serifItalic,
          fontSize: 34,
          color: brand.ink,
        }}
      >
        the quiet uniform
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Full-bleed close-up + V-collar annotation + comment bubbles ─── */
interface Bubble {
  text: string;
  user: string;
  top: number;
  left: number;
  delay: number;
}
const bubbles: Bubble[] = [
  {text: 'how is this timeless?? I need it', user: 'menswear.eli', top: 980, left: 90, delay: 0},
  {text: 'the fit is insane 🔥', user: 'classicfit_joe', top: 1230, left: 380, delay: 0.55},
  {text: 'old money never goes out of style', user: 'archive_hunter', top: 1490, left: 130, delay: 1.1},
];

const CommentBubble = ({b, show}: {b: Bubble; show: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - b.delay * fps - 0.2 * fps, fps, config: {damping: 18, stiffness: 130}});
  const overallShow = interpolate(show, [0, 1], [0, 1], c);
  return (
    <div
      style={{
        position: 'absolute',
        top: b.top,
        left: b.left,
        maxWidth: 430,
        opacity: p * overallShow,
        transform: `scale(${0.6 + p * 0.4})`,
        transformOrigin: 'left top',
      }}
    >
      <div
        style={{
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: 18,
          padding: '18px 22px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.22)',
        }}
      >
        <div style={{fontSize: 19, color: '#aaa', marginBottom: 10, letterSpacing: 2, fontFamily: mono}}>
          Reply to {b.user}
        </div>
        <div style={{fontSize: 27, lineHeight: 1.35, fontWeight: 600}}>{b.text}</div>
      </div>
    </div>
  );
};

const SceneCloseup = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = fade(f, fps);
  const scale = interpolate(f, [0, seconds * fps], [1, 1.07], c);

  // Dotted V-collar annotation
  const dashProg = interpolate(f, [0.5 * fps, 1.7 * fps], [0, 1], ease);
  const dotAlpha = interpolate(f, [0.5 * fps, 1.0 * fps], [0, 1], c);

  // Headline text
  const textAlpha = interpolate(f, [1.4 * fps, 2.0 * fps], [0, 1], ease);
  const textY = interpolate(f, [1.4 * fps, 2.0 * fps], [50, 0], ease);

  // Leader line + circle label
  const leaderProg = interpolate(f, [2.6 * fps, 3.5 * fps], [0, 1], ease);
  const leaderAlpha = interpolate(f, [2.6 * fps, 3.0 * fps], [0, 1], c);

  // Comment bubbles
  const showBubbles = interpolate(f, [3.8 * fps, 4.4 * fps], [0, 1], c);

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', opacity: alpha}}>
      {/* Full-bleed close-up */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: '50% 38%',
        }}
      >
        <Img
          src={asset('src-4975756.jpg')}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%'}}
        />
      </div>

      {/* Readability gradient */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.5) 38%, transparent 62%)',
        }}
      />

      {/* Dotted V-collar path */}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: dotAlpha}}>
        <path
          d="M 540 640 Q 610 720 620 790 Q 630 860 700 920"
          fill="none"
          stroke="#111"
          strokeWidth={1.5}
          strokeDasharray={420}
          strokeDashoffset={interpolate(dashProg, [0, 1], [420, 0], c)}
        />
        <circle cx={540} cy={640} r={5} fill="#111" />
        <circle cx={540} cy={640} r={13} fill="none" stroke="#111" strokeWidth={1.5} />
      </svg>

      {/* Italic label for the collar */}
      <div
        style={{
          position: 'absolute',
          top: 706,
          left: 420,
          opacity: dotAlpha,
          ...serifItalic,
          fontSize: 32,
          color: '#111',
        }}
      >
        peak lapel
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 70,
          opacity: textAlpha,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div style={{fontSize: 22, letterSpacing: 6, color: '#888', marginBottom: 26, fontFamily: mono}}>
          WHY IT WORKS
        </div>
        <div style={{fontSize: 72, fontFamily: serif, lineHeight: 1.14, letterSpacing: -1.5, color: '#111'}}>
          Anchors
        </div>
        <div style={{...serifItalic, fontSize: 72, lineHeight: 1.14, color: '#111'}}>
          the whole look.
        </div>
        <div style={{marginTop: 34, fontSize: 30, lineHeight: 1.55, color: '#555', maxWidth: 470, fontFamily: serif}}>
          A structured shoulder and clean lapel
          carry every outfit built on top of it.
        </div>
      </div>

      {/* Leader line + circle label */}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: leaderAlpha}}>
        <line
          x1={790}
          y1={520}
          x2={790 + 170 * leaderProg}
          y2={520 - 90 * leaderProg}
          stroke="#111"
          strokeWidth={1.5}
          strokeDasharray="6,6"
        />
        <circle cx={790} cy={520} r={5} fill="#111" />
        <circle cx={790} cy={520} r={13} fill="none" stroke="#111" strokeWidth={1.5} />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 366,
          left: 796,
          opacity: leaderAlpha * interpolate(leaderProg, [0.6, 1], [0, 1], c),
          ...serifItalic,
          fontSize: 30,
          color: '#111',
          whiteSpace: 'nowrap',
        }}
      >
        full canvas
      </div>

      {/* Comment bubbles */}
      {bubbles.map((b, i) => (
        <CommentBubble key={i} b={b} show={showBubbles} />
      ))}
    </AbsoluteFill>
  );
};

/* ─── Scene 4: Search bar → product card ─── */
const SceneSearch = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = fade(f, fps, 0.25);

  // Search bar (visible first ~1.5s) — overlaps the card entrance so the
  // frame is never nearly empty in between.
  const barY = interpolate(f, [0, 0.4 * fps], [30, 0], ease);
  const barAlpha = interpolate(f, [0, 0.3 * fps, 1.5 * fps, 1.9 * fps], [0, 1, 1, 0], c);

  // Product card slides in from the right
  const cardX = interpolate(f, [1.35 * fps, 2.0 * fps], [420, 0], ease);
  const cardAlpha = interpolate(f, [1.35 * fps, 1.7 * fps], [0, 1], c);

  // Supporting flat-lay beside the card
  const imgAlpha = interpolate(f, [1.45 * fps, 1.95 * fps], [0, 1], ease);
  const imgY = interpolate(f, [1.45 * fps, 1.95 * fps], [40, 0], ease);

  return (
    <AbsoluteFill style={{background: brand.paper, overflow: 'hidden', opacity: alpha}}>
      {/* Search bar */}
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'center', opacity: barAlpha, transform: `translateY(${barY}px)`}}
      >
        <div style={{width: '78%'}}>
          <div
            style={{
              background: '#e8e8e8',
              borderRadius: 60,
              display: 'flex',
              alignItems: 'center',
              padding: '22px 32px',
              gap: 18,
            }}
          >
            <div style={{fontSize: 34, color: '#bbb'}}>🔍</div>
            <div style={{fontSize: 36, color: '#aaa', letterSpacing: 0.5, fontFamily: serif}}>ebay.com</div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Flat-lay images left */}
      <div style={{position: 'absolute', left: 34, top: 300, opacity: imgAlpha, transform: `translateY(${imgY}px)`}}>
        <Img
          src={asset('src-32479925.jpg')}
          style={{width: 430, borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.10)', display: 'block'}}
        />
      </div>
      <div style={{position: 'absolute', left: 34, top: 830, opacity: imgAlpha, transform: `translateY(${imgY}px)`}}>
        <Img
          src={asset('src-36910113.jpg')}
          style={{width: 430, borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.10)', display: 'block'}}
        />
      </div>

      {/* Product card */}
      <div
        style={{
          position: 'absolute',
          right: 30,
          top: 360,
          width: 500,
          background: '#f7f7f7',
          borderRadius: 28,
          boxShadow: '0 16px 60px rgba(0,0,0,0.15)',
          padding: '26px 28px 32px',
          opacity: cardAlpha,
          transform: `translateX(${cardX}px)`,
          boxSizing: 'border-box',
        }}
      >
        {/* Coloured marketplace wordmark */}
        <div style={{fontSize: 30, fontWeight: 900, marginBottom: 14, letterSpacing: -1}}>
          <span style={{color: '#e53238'}}>e</span>
          <span style={{color: '#0064d2'}}>b</span>
          <span style={{color: '#f5af02'}}>a</span>
          <span style={{color: '#86b817'}}>y</span>
        </div>

        <Img
          src={asset('src-2377182.jpg')}
          style={{width: '100%', height: 260, objectFit: 'cover', objectPosition: 'center 30%', borderRadius: 14, display: 'block'}}
        />

        <div style={{fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: '18px 0 8px', color: '#111'}}>
          Wool Blazer · Tailored Fit
        </div>
        <div style={{fontSize: 20, color: '#888', marginBottom: 18}}>Sartoria Napoli · Italy</div>

        {/* Colour swatches */}
        <div style={{display: 'flex', gap: 14, marginBottom: 22}}>
          {['#1a2033', '#b5a081', '#4a4a4a'].map((col, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: col,
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>

        {/* Dark price pill */}
        <div
          style={{
            background: '#161616',
            color: '#fff',
            borderRadius: 40,
            padding: '14px 30px',
            display: 'inline-block',
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          $ 140
        </div>
        <div style={{fontSize: 19, color: '#888', marginTop: 12}}>Pre-owned · Excellent condition</div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 5: Lookbook flat-lay + street pairs ─── */
const DriftingPair = ({
  srcA,
  srcB,
  caption,
  start,
}: {
  srcA: string;
  srcB: string;
  caption: string;
  start: number;
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = f - start * fps;
  const alpha = interpolate(local, [0, 0.5 * fps], [0, 1], c);
  const driftA = interpolate(local, [0, 4.2 * fps], [0, -26], c);
  const driftB = interpolate(local, [0, 4.2 * fps], [0, 30], c);
  const capAlpha = interpolate(local, [0.4 * fps, 1.0 * fps], [0, 1], ease);

  return (
    <AbsoluteFill style={{opacity: alpha}}>
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 300,
          transform: `translateY(${driftA}px)`,
        }}
      >
        <Img
          src={srcA}
          style={{
            width: 470,
            height: 620,
            objectFit: 'cover',
            border: `14px solid ${brand.border}`,
            boxShadow: '0 18px 50px rgba(0,0,0,0.12)',
            display: 'block',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 50,
          top: 760,
          transform: `translateY(${driftB}px)`,
        }}
      >
        <Img
          src={srcB}
          style={{
            width: 470,
            height: 620,
            objectFit: 'cover',
            border: `14px solid ${brand.border}`,
            boxShadow: '0 18px 50px rgba(0,0,0,0.12)',
            display: 'block',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: capAlpha,
          fontFamily: mono,
          fontSize: 26,
          letterSpacing: 8,
          color: brand.muted,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

const SceneLookbook = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = fade(f, fps);
  const swap = 4.3; // seconds: flat-lays → street pair

  return (
    <AbsoluteFill style={{background: brand.paper, overflow: 'hidden', opacity: alpha}}>
      {/* Pair 1 — flat-lays */}
      <AbsoluteFill
        style={{opacity: interpolate(f, [swap * fps, (swap + 0.4) * fps], [1, 0], c)}}
      >
        <DriftingPair
          srcA={asset('src-1619655.jpg')}
          srcB={asset('src-32479925.jpg')}
          caption="THE LOOKBOOK"
          start={0}
        />
      </AbsoluteFill>

      {/* Pair 2 — street style */}
      <AbsoluteFill style={{opacity: interpolate(f, [(swap - 0.1) * fps, (swap + 0.35) * fps], [0, 1], c)}}>
        <DriftingPair
          srcA={asset('src-19956788.jpg')}
          srcB={asset('src-30875139.jpg')}
          caption="OFF DUTY"
          start={swap}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─── Scene 6: Icon portrait + mono caption + inset still ─── */
const SceneIcon = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = fade(f, fps);

  const portraitScale = interpolate(f, [0, 1.0 * fps], [0.88, 1], ease);
  const capAlpha = interpolate(f, [0.4 * fps, 1.0 * fps], [0, 1], ease);
  const capY = interpolate(f, [0.4 * fps, 1.0 * fps], [40, 0], ease);
  const insetAlpha = interpolate(f, [1.2 * fps, 1.8 * fps], [0, 1], ease);
  const insetX = interpolate(f, [1.2 * fps, 1.8 * fps], [-60, 0], ease);
  const serifAlpha = interpolate(f, [2.2 * fps, 2.9 * fps], [0, 1], ease);

  return (
    <AbsoluteFill style={{background: brand.paper, overflow: 'hidden', opacity: alpha}}>
      {/* Large cut-out portrait — checked 3-piece gentleman */}
      <div
        style={{
          position: 'absolute',
          right: -50,
          bottom: -30,
          transform: `scale(${portraitScale})`,
          transformOrigin: 'bottom right',
        }}
      >
        <Img
          src={asset('cut-4975756.png')}
          style={{width: 780, height: 'auto', display: 'block', filter: 'grayscale(100%)'}}
        />
      </div>

      {/* Mono caption block */}
      <div
        style={{
          position: 'absolute',
          top: 260,
          left: 70,
          width: 480,
          opacity: capAlpha,
          transform: `translateY(${capY}px)`,
          fontFamily: mono,
        }}
      >
        <div style={{fontSize: 24, letterSpacing: 7, color: brand.muted, lineHeight: 1.7}}>
          THE OLD MONEY
        </div>
        <div style={{fontSize: 24, letterSpacing: 7, color: brand.muted, lineHeight: 1.7}}>
          UNIFORM · EST.
        </div>
        <div style={{fontSize: 24, letterSpacing: 7, color: brand.ink, lineHeight: 1.7, fontWeight: 700}}>
          1962
        </div>
      </div>

      {/* Inset still with grey border */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 640,
          opacity: insetAlpha,
          transform: `translateX(${insetX}px)`,
        }}
      >
        <Img
          src={asset('src-3027174.jpg')}
          style={{
            width: 400,
            height: 300,
            objectFit: 'cover',
            objectPosition: 'center 35%',
            border: `14px solid ${brand.border}`,
            boxShadow: '0 18px 50px rgba(0,0,0,0.12)',
            display: 'block',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Serif line */}
      <div
        style={{
          position: 'absolute',
          top: 1060,
          left: 70,
          width: 470,
          opacity: serifAlpha,
          ...serifItalic,
          fontSize: 46,
          lineHeight: 1.3,
          color: brand.ink,
        }}
      >
        Tailoring first, trends never.
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 7: B&W trio outro — "Second hand" → "$200" ─── */
const SceneOutro = ({seconds}: {seconds: number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = fade(f, fps);
  const scale = interpolate(f, [0, 0.9 * fps], [0.86, 1], ease);

  const firstAlpha = interpolate(f, [0.4 * fps, 1.0 * fps, 2.0 * fps, 2.4 * fps], [0, 1, 1, 0], c);
  const firstY = interpolate(f, [0.4 * fps, 1.0 * fps], [45, 0], ease);
  const secondAlpha = interpolate(f, [2.2 * fps, 2.7 * fps], [0, 1], ease);
  const secondY = interpolate(f, [2.2 * fps, 2.7 * fps], [45, 0], ease);

  return (
    <AbsoluteFill style={{background: brand.paper, overflow: 'hidden', opacity: alpha}}>
      {/* Trio cut-out */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -20,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'bottom center',
        }}
      >
        <Img
          src={asset('cut-7070054.png')}
          style={{width: 1020, height: 'auto', display: 'block', filter: 'grayscale(100%)'}}
        />
      </div>

      {/* Italic callout 1 */}
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: firstAlpha,
          transform: `translateY(${firstY}px)`,
        }}
      >
        <div style={{...serifItalic, fontSize: 84, letterSpacing: -2, color: brand.ink}}>Second hand</div>
      </div>

      {/* Callout 2 — price */}
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: secondAlpha,
          transform: `translateY(${secondY}px)`,
        }}
      >
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: -3, fontFamily: serif, color: brand.ink}}>
          $200
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Root composition ─── */
export const OldMoney = () => {
  const {fps} = useVideoConfig();
  const scenes = [
    {id: 'Hero', s: t.hero, C: SceneHero},
    {id: 'Frames', s: t.frames, C: SceneFrames},
    {id: 'Closeup', s: t.closeup, C: SceneCloseup},
    {id: 'Search', s: t.search, C: SceneSearch},
    {id: 'Lookbook', s: t.lookbook, C: SceneLookbook},
    {id: 'Icon', s: t.icon, C: SceneIcon},
    {id: 'Outro', s: t.outro, C: SceneOutro},
  ];
  return (
    <AbsoluteFill style={{fontFamily: mono, background: brand.paper}}>
      {scenes.map(({id, s, C}, i) => {
        // Hold each outgoing scene mounted past its end so the next scene can
        // dissolve in over it — no gap where the white root shows through.
        const isLast = i === scenes.length - 1;
        const overlap = isLast ? 0 : Math.round(0.35 * fps);
        return (
          <Sequence
            key={id}
            name={id}
            from={Math.round(s.from * fps)}
            durationInFrames={Math.round(s.seconds * fps) + overlap}
          >
            <C seconds={s.seconds} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
