/**
 * AranSweater — men's fashion editorial, ~30s
 *
 * Theme: "The only sweater you need" — Aran / cable-knit
 * Structure mirrors the reference "two jackets" video:
 *   1. Hero headline + two archival portraits (Paul Newman + Alain Delon)
 *   2. Close zoom on Jordan Barrett (fashion model) + annotated collar dot
 *   3. Text overlay "Anchors your look" + dashed line detail
 *   4. Price shock + two comment bubbles
 *   5. Search bar reveal (eBay)
 *   6. Sweater product card (three colour swatches)
 *   7. Second icon group (James Dean + Paul Newman) + "Second hand"
 *   8. Outro price callout "80 dollars"
 *
 * All images: Wikimedia Commons (public domain / CC-licensed)
 * Audio: macOS `say` TTS
 */

import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  Easing,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {aranTimeline as t} from '../timeline';

/* ─── helpers ─── */
const c = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease = {...c, easing: Easing.bezier(0.16,1,0.3,1)};
const easeIn = {...c, easing: Easing.bezier(0.4,0,1,1)};

function useFadeIn(start=0, duration=0.6) {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return interpolate(f,[start*fps,(start+duration)*fps],[0,1],c);
}

/* ─── Shared text styles ─── */
const serifItalic: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
};

/* ─── Scene 1: Hero headline + two archival portraits ─── */
const SceneHero = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Pan in from slightly below
  const panY = interpolate(f,[0,0.9*fps],[40,0],ease);
  const alpha = interpolate(f,[0,0.3*fps,(seconds-0.3)*fps,seconds*fps],[0,1,1,0],c);

  // Portraits scale up from smaller
  const leftScale = interpolate(f,[0,0.8*fps],[0.82,1],ease);
  const rightScale = interpolate(f,[0.15*fps,0.95*fps],[0.82,1],ease);
  const textAlpha = interpolate(f,[0.2*fps,0.7*fps],[0,1],ease);

  return (
    <AbsoluteFill style={{background:'#fff', opacity:alpha}}>
      {/* Headline */}
      <div style={{
        position:'absolute', top:160, left:0, right:0,
        textAlign:'center', opacity:textAlpha, transform:`translateY(${panY}px)`,
      }}>
        <div style={{fontSize:56, lineHeight:1.18, letterSpacing:-1.5, fontFamily:'Georgia, serif'}}>
          The only sweater you
        </div>
        <div style={{...serifItalic, fontSize:56, lineHeight:1.18}}>
          need this winter
        </div>
      </div>

      {/* Left portrait — Paul Newman */}
      <div style={{
        position:'absolute', left:-30, bottom:-20,
        transform:`scale(${leftScale})`,
        transformOrigin:'bottom left',
      }}>
        <Img
          src={staticFile('assets/menswear/paul_newman_bw.jpg')}
          style={{width:520, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>

      {/* Right portrait — Alain Delon */}
      <div style={{
        position:'absolute', right:-40, bottom:-30,
        transform:`scale(${rightScale})`,
        transformOrigin:'bottom right',
      }}>
        <Img
          src={staticFile('assets/menswear/delon_bw.jpg')}
          style={{width:490, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Close zoom on Jordan Barrett + annotation dot ─── */
const SceneCloseZoom = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = interpolate(f,[0,seconds*fps],[1,1.07],c);
  const alpha = interpolate(f,[0,0.3*fps,(seconds-0.3)*fps,seconds*fps],[0,1,1,0],c);

  // Annotation dot + line
  const dotAlpha = interpolate(f,[0.6*fps,1*fps],[0,1],c);
  const lineProgress = interpolate(f,[0.7*fps,1.5*fps],[0,1],ease);

  return (
    <AbsoluteFill style={{background:'#fff', overflow:'hidden', opacity:alpha}}>
      {/* Full bleed fashion portrait */}
      <div style={{
        position:'absolute', inset:0,
        transform:`scale(${scale})`,
        transformOrigin:'50% 40%',
      }}>
        <Img
          src={staticFile('assets/menswear/jordan_fashion.jpg')}
          style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 20%'}}
        />
      </div>

      {/* Gradient overlay */}
      <AbsoluteFill style={{
        background:'linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 45%, transparent 60%, rgba(255,255,255,0.3) 100%)',
      }}/>

      {/* Annotation: dot on collar, dashed line to left label */}
      <svg width="1080" height="1920" style={{position:'absolute', opacity:dotAlpha}}>
        {/* Dashed connection line */}
        <line
          x1={380} y1={760} x2={240} y2={680}
          stroke="#111" strokeWidth={1.5} strokeDasharray="6,6"
          strokeDashoffset={interpolate(lineProgress,[0,1],[200,0],c)}
        />
        {/* Dot */}
        <circle cx={380} cy={760} r={5} fill="#111"/>
        <circle cx={380} cy={760} r={13} fill="none" stroke="#111" strokeWidth={1.5}/>
      </svg>

      {/* Label */}
      <div style={{
        position:'absolute', top:620, left:40,
        opacity: dotAlpha,
        ...serifItalic,
        fontSize:32, color:'#111',
      }}>
        cable-knit
      </div>

      {/* Bottom caption */}
      <div style={{
        position:'absolute', bottom:120, left:0, right:0, textAlign:'center',
        opacity: interpolate(f,[1.2*fps,1.8*fps],[0,1],ease),
      }}>
        <div style={{fontSize:22, letterSpacing:6, color:'#555', marginBottom:16}}>
          ARAN SWEATER
        </div>
        <div style={{fontSize:66, fontWeight:700, letterSpacing:-2, fontFamily:'Georgia, serif'}}>
          Jordan Barrett
        </div>
        <div style={{fontSize:26, color:'#666', marginTop:12}}>
          SuperModel / Campaign
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: Detail — "Anchors your look" with dashed V-collar line ─── */
const SceneDetail = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = interpolate(f,[0,0.3*fps,(seconds-0.3)*fps,seconds*fps],[0,1,1,0],c);
  const dashProg = interpolate(f,[0.3*fps,1.4*fps],[0,1],ease);
  const textAlpha = interpolate(f,[0.5*fps,1.1*fps],[0,1],ease);
  const textSlide = interpolate(f,[0.5*fps,1.1*fps],[50,0],ease);

  return (
    <AbsoluteFill style={{background:'#fff', overflow:'hidden', opacity:alpha}}>
      {/* Portrait — McQueen B&W */}
      <div style={{
        position:'absolute', right:-60, bottom:-40,
        transform:'scale(1.08)', transformOrigin:'bottom right',
      }}>
        <Img
          src={staticFile('assets/menswear/james_dean_bw.jpg')}
          style={{width:680, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>

      {/* Gradient overlay (left side readable) */}
      <AbsoluteFill style={{
        background:'linear-gradient(to right, rgba(255,255,255,0.9) 40%, transparent 75%)',
      }}/>

      {/* Dashed V-line on collar area */}
      <svg width="1080" height="1920" style={{position:'absolute'}}>
        <path
          d="M 580 700 Q 640 760 640 800 Q 640 840 700 870"
          fill="none" stroke="#111" strokeWidth={1.5} strokeDasharray={300}
          strokeDashoffset={interpolate(dashProg,[0,1],[300,0],c)}
        />
      </svg>

      {/* Text */}
      <div style={{
        position:'absolute', top:350, left:80,
        opacity:textAlpha, transform:`translateY(${textSlide}px)`,
      }}>
        <div style={{fontSize:22, letterSpacing:6, color:'#888', marginBottom:28}}>
          WHY IT WORKS
        </div>
        <div style={{fontSize:70, fontFamily:'Georgia, serif', lineHeight:1.15, letterSpacing:-1.5}}>
          Anchors
        </div>
        <div style={{...serifItalic, fontSize:70, lineHeight:1.15}}>
          your look.
        </div>
        <div style={{
          marginTop:36, fontSize:30, lineHeight:1.55, color:'#555', maxWidth:480,
          fontFamily:'Georgia, serif',
        }}>
          The Aran's texture adds weight
          without bulk — a collar that
          frames the face.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 4: Price shock + comment bubbles ─── */
interface Bubble {text:string; user:string; top:number; left:number; delay:number}
const bubbles: Bubble[] = [
  {text:'a single sweater is my whole paycheck...', user:'FashionSteve', top:110, left:130, delay:0},
  {text:"I'd never buy Brunello, it's too expensive", user:'Jake_Style', top:350, left:360, delay:0.5},
  {text:'Not in this economy 😅', user:'M_Chen', top:570, left:80, delay:1},
];

const CommentBubble = ({b,show}:{b:Bubble;show:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame:f-b.delay*fps-0.2*fps, fps, config:{damping:18,stiffness:130}});
  const overallShow = interpolate(show,[0,1],[0,1],c);
  return (
    <div style={{
      position:'absolute', top:b.top, left:b.left, maxWidth:390,
      opacity:p*overallShow, transform:`scale(${0.6+p*0.4})`, transformOrigin:'left top',
    }}>
      <div style={{
        background:'#1a1a1a', color:'#fff', borderRadius:18, padding:'18px 22px',
        boxShadow:'0 8px 30px rgba(0,0,0,0.18)',
      }}>
        <div style={{fontSize:19, color:'#aaa', marginBottom:10, letterSpacing:2}}>
          Reply to {b.user}
        </div>
        <div style={{fontSize:27, lineHeight:1.35, fontWeight:600}}>
          {b.text}
        </div>
      </div>
    </div>
  );
};

const ScenePrice = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const alpha = interpolate(f,[0,0.3*fps,(seconds-0.3)*fps,seconds*fps],[0,1,1,0],c);
  const priceAlpha = interpolate(f,[0.1*fps,0.6*fps],[0,1],ease);
  const imageScale = interpolate(f,[0,seconds*fps],[1,1.04],c);
  const showBubbles = interpolate(f,[0.3*fps,0.9*fps],[0,1],c);

  // Annotation dot (like reference)
  const dotProg = interpolate(f,[0.4*fps,1.2*fps],[0,1],ease);

  return (
    <AbsoluteFill style={{background:'#fff', overflow:'hidden', opacity:alpha}}>
      {/* Portrait — Jordan Barrett cropped */}
      <div style={{
        position:'absolute', inset:0,
        transform:`scale(${imageScale})`,
        transformOrigin:'50% 35%',
      }}>
        <Img
          src={staticFile('assets/menswear/jordan_fashion.jpg')}
          style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 15%'}}
        />
      </div>

      <AbsoluteFill style={{
        background:'linear-gradient(to bottom, rgba(255,255,255,0.75) 0%, transparent 40%, transparent 50%, rgba(255,255,255,0.6) 100%)',
      }}/>

      {/* Price label with annotation line */}
      <svg width="1080" height="1920" style={{position:'absolute', opacity:priceAlpha}}>
        <line x1={260} y1={480} x2={260} y2={680}
          stroke="#111" strokeWidth={1.5} strokeDasharray="5,5"
          strokeDashoffset={interpolate(dotProg,[0,1],[280,0],c)}
        />
        <circle cx={260} cy={680} r={5} fill="#111"/>
        <circle cx={260} cy={680} r={13} fill="none" stroke="#111" strokeWidth={1.5}/>
      </svg>
      <div style={{
        position:'absolute', top:360, left:80,
        opacity:priceAlpha,
        ...serifItalic, fontSize:38, color:'#111',
      }}>
        500 dollars
      </div>

      {/* Comment bubbles */}
      {bubbles.map((b,i) => (
        <CommentBubble key={i} b={b} show={showBubbles}/>
      ))}
    </AbsoluteFill>
  );
};

/* ─── Scene 5: Search bar ─── */
const SceneSearch = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = interpolate(f,[0,0.25*fps,(seconds-0.2)*fps,seconds*fps],[0,1,1,0],c);
  const slide = interpolate(f,[0,0.4*fps],[30,0],ease);
  return (
    <AbsoluteFill style={{background:'#fff', alignItems:'center', justifyContent:'center', opacity:alpha}}>
      <div style={{transform:`translateY(${slide}px)`, width:'78%'}}>
        <div style={{
          background:'#e8e8e8', borderRadius:60, display:'flex', alignItems:'center',
          padding:'22px 32px', gap:18,
        }}>
          <div style={{fontSize:34, color:'#bbb'}}>🔍</div>
          <div style={{fontSize:36, color:'#aaa', letterSpacing:0.5, fontFamily:'Georgia, serif'}}>
            eBay.com
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 6: Product card + sweater flats ─── */
const SceneProduct = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = interpolate(f,[0,0.3*fps,(seconds-0.3)*fps,seconds*fps],[0,1,1,0],c);

  // Card slide in from right
  const cardX = interpolate(f,[0,0.5*fps],[350,0],ease);
  const cardAlpha = interpolate(f,[0,0.4*fps],[0,1],c);

  // Sweater image
  const imgAlpha = interpolate(f,[0.2*fps,0.7*fps],[0,1],ease);
  const imgY = interpolate(f,[0.2*fps,0.7*fps],[40,0],ease);

  return (
    <AbsoluteFill style={{background:'#fff', overflow:'hidden', opacity:alpha}}>
      {/* Sweater flat lay — left side */}
      <div style={{
        position:'absolute', left:30, top:260,
        opacity:imgAlpha,
        transform:`translateY(${imgY}px)`,
      }}>
        <Img
          src={staticFile('assets/menswear/aran_sweater.jpg')}
          style={{width:430, borderRadius:16, boxShadow:'0 12px 40px rgba(0,0,0,0.1)'}}
        />
      </div>
      <div style={{
        position:'absolute', left:30, top:780,
        opacity:imgAlpha,
        transform:`translateY(${imgY}px)`,
      }}>
        <Img
          src={staticFile('assets/menswear/aran_cardigan_prep.jpg')}
          style={{width:430, borderRadius:16, boxShadow:'0 12px 40px rgba(0,0,0,0.1)'}}
        />
      </div>

      {/* eBay-style product card */}
      <div style={{
        position:'absolute', right:30, top:320, width:490,
        background:'#f7f7f7', borderRadius:28,
        boxShadow:'0 16px 60px rgba(0,0,0,0.15)',
        padding:'28px 28px 32px',
        opacity:cardAlpha,
        transform:`translateX(${cardX}px)`,
      }}>
        {/* eBay logo text */}
        <div style={{fontSize:30, fontWeight:900, marginBottom:8, letterSpacing:-1}}>
          <span style={{color:'#e53238'}}>e</span>
          <span style={{color:'#0064d2'}}>b</span>
          <span style={{color:'#f5af02'}}>a</span>
          <span style={{color:'#86b817'}}>y</span>
        </div>

        <div style={{fontSize:26, fontWeight:700, lineHeight:1.3, marginBottom:12, color:'#111'}}>
          Aran Cable Knit Sweater
        </div>
        <div style={{fontSize:20, color:'#888', marginBottom:18}}>
          Carraig Donn · Ireland
        </div>

        {/* Colour swatches */}
        <div style={{display:'flex', gap:14, marginBottom:24}}>
          {['#1a2033','#c8c1a8','#2c4a2c'].map((col,i) => (
            <div key={i} style={{
              width:36, height:36, borderRadius:'50%', background:col,
              border:'3px solid white', boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
            }}/>
          ))}
        </div>

        {/* Price */}
        <div style={{fontSize:46, fontWeight:800, color:'#111', letterSpacing:-1}}>
          $ 80
        </div>
        <div style={{fontSize:20, color:'#888', marginTop:6}}>
          Pre-owned · Good condition
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 7: Icon group — James Dean + Paul Newman with "Second hand" ─── */
const SceneIcons2 = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = interpolate(f,[0,0.3*fps,(seconds-0.3)*fps,seconds*fps],[0,1,1,0],c);
  const textAlpha = interpolate(f,[0.3*fps,0.8*fps],[0,1],ease);
  const textY = interpolate(f,[0.3*fps,0.8*fps],[40,0],ease);
  const leftScale = interpolate(f,[0,0.7*fps],[0.85,1],ease);
  const rightScale = interpolate(f,[0.1*fps,0.8*fps],[0.85,1],ease);

  return (
    <AbsoluteFill style={{background:'#fff', overflow:'hidden', opacity:alpha}}>
      {/* Left — Paul Newman */}
      <div style={{
        position:'absolute', left:-40, bottom:-20,
        transform:`scale(${leftScale})`,
        transformOrigin:'bottom left',
      }}>
        <Img
          src={staticFile('assets/menswear/paul_newman_bw.jpg')}
          style={{width:430, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>

      {/* Centre — James Dean */}
      <div style={{
        position:'absolute', left:'50%', bottom:-30,
        transform:`translateX(-50%) scale(${rightScale})`,
        transformOrigin:'bottom center',
      }}>
        <Img
          src={staticFile('assets/menswear/james_dean_bw.jpg')}
          style={{width:390, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>

      {/* Right — McQueen */}
      <div style={{
        position:'absolute', right:-40, bottom:-10,
        transform:`scale(${rightScale})`,
        transformOrigin:'bottom right',
      }}>
        <Img
          src={staticFile('assets/menswear/mcqueen_bw.jpg')}
          style={{width:370, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>

      {/* Text */}
      <div style={{
        position:'absolute', top:220, left:0, right:0, textAlign:'center',
        opacity:textAlpha, transform:`translateY(${textY}px)`,
      }}>
        <div style={{...serifItalic, fontSize:72, letterSpacing:-1, color:'#111'}}>
          Second hand
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 8: Outro — "80 dollars" price reveal ─── */
const SceneOutro = ({seconds}: {seconds:number}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alpha = interpolate(f,[0,0.3*fps,(seconds-0.3)*fps,seconds*fps],[0,1,1,0],c);
  const scale = interpolate(f,[0,0.7*fps],[0.85,1],ease);
  const textAlpha = interpolate(f,[0.5*fps,1.1*fps],[0,1],ease);
  const textY = interpolate(f,[0.5*fps,1.1*fps],[45,0],ease);

  return (
    <AbsoluteFill style={{background:'#fff', overflow:'hidden', opacity:alpha}}>
      {/* Three-portrait group at smaller scale */}
      <div style={{
        position:'absolute', left:-20, bottom:-10,
        transform:`scale(${scale})`, transformOrigin:'bottom left',
      }}>
        <Img
          src={staticFile('assets/menswear/james_dean_bw.jpg')}
          style={{width:300, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>
      <div style={{
        position:'absolute', left:'50%', bottom:-20,
        transform:`translateX(-50%) scale(${scale})`, transformOrigin:'bottom center',
      }}>
        <Img
          src={staticFile('assets/menswear/paul_newman_bw.jpg')}
          style={{width:320, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>
      <div style={{
        position:'absolute', right:-20, bottom:-10,
        transform:`scale(${scale})`, transformOrigin:'bottom right',
      }}>
        <Img
          src={staticFile('assets/menswear/mcqueen_bw.jpg')}
          style={{width:300, height:'auto', display:'block', filter:'grayscale(100%)'}}
        />
      </div>

      {/* Outro text */}
      <div style={{
        position:'absolute', top:220, left:0, right:0, textAlign:'center',
        opacity:textAlpha, transform:`translateY(${textY}px)`,
      }}>
        <div style={{...serifItalic, fontSize:86, color:'#111', letterSpacing:-2}}>
          80 dollars
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Root composition ─── */
export const AranSweater = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{fontFamily:'Helvetica Neue, Arial, sans-serif', background:'#fff'}}>
      {/* Narration voiceover */}
      <Audio src={staticFile('assets/menswear/narration.aac')} volume={1}/>

      <Sequence name="Hero" from={t.heroes.from*fps} durationInFrames={t.heroes.seconds*fps}>
        <SceneHero seconds={t.heroes.seconds}/>
      </Sequence>

      <Sequence name="CloseZoom" from={t.closeZoom.from*fps} durationInFrames={t.closeZoom.seconds*fps}>
        <SceneCloseZoom seconds={t.closeZoom.seconds}/>
      </Sequence>

      <Sequence name="Detail" from={t.detail.from*fps} durationInFrames={t.detail.seconds*fps}>
        <SceneDetail seconds={t.detail.seconds}/>
      </Sequence>

      <Sequence name="Price" from={t.price.from*fps} durationInFrames={t.price.seconds*fps}>
        <ScenePrice seconds={t.price.seconds}/>
      </Sequence>

      <Sequence name="Search" from={t.search.from*fps} durationInFrames={t.search.seconds*fps}>
        <SceneSearch seconds={t.search.seconds}/>
      </Sequence>

      <Sequence name="Product" from={t.product.from*fps} durationInFrames={t.product.seconds*fps}>
        <SceneProduct seconds={t.product.seconds}/>
      </Sequence>

      <Sequence name="Icons2" from={t.icons2.from*fps} durationInFrames={t.icons2.seconds*fps}>
        <SceneIcons2 seconds={t.icons2.seconds}/>
      </Sequence>

      <Sequence name="Outro" from={t.outro.from*fps} durationInFrames={t.outro.seconds*fps}>
        <SceneOutro seconds={t.outro.seconds}/>
      </Sequence>
    </AbsoluteFill>
  );
};
