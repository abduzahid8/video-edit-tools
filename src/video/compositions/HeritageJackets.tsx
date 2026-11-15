import {Children, createContext, useContext, type ReactNode} from 'react';
import {heritageJacketsRussian} from '../copy/heritageJackets';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {heritageJacketsBrand as b} from '../theme';
import {heritageJacketsTimeline as t} from '../timeline';
const HeritageLocale = createContext<'en'|'ru'>('en');
function Localized({children}:{children:ReactNode}){
 const locale=useContext(HeritageLocale);
 return <>{Children.map(children,child=>typeof child==='string'&&locale==='ru'?(heritageJacketsRussian[child]??child):child)}</>;
}
const asset=(file:string)=>staticFile(`assets/heritage-jackets/${file}`);
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.22,1,.36,1);
const m=(s:number,a:number[],v:number[])=>interpolate(s,a,v,{...clamp,easing:ease});
const useSeconds=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps;};
function Page({children,seconds}:{children:ReactNode;seconds:number}){
 const s=useSeconds();return <AbsoluteFill style={{background:b.white,color:b.ink,overflow:'hidden'}}>{children}<AbsoluteFill style={{background:b.white,opacity:m(s,[seconds-t.whiteWash,seconds],[0,1]),pointerEvents:'none'}}/></AbsoluteFill>;
}
function Copy({children,y,size=62,at=0,italic=false,x=60,w=960,align='center'}:{children:ReactNode;y:number;size?:number;at?:number;italic?:boolean;x?:number;w?:number;align?:'left'|'center'}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,textAlign:align,fontFamily:b.serif,fontSize:size,lineHeight:1.06,fontStyle:italic?'italic':'normal',letterSpacing:-size*.025,opacity:m(s,[at,at+.28],[0,1]),translate:`0 ${m(s,[at,at+.6],[30,0])}px`}}><Localized>{children}</Localized></div>;
}
function Label({children,y,x=70,w=940,at=0}:{children:ReactNode;y:number;x?:number;w?:number;at?:number}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,fontFamily:b.sans,fontSize:19,letterSpacing:3.2,textTransform:'uppercase',textAlign:'center',color:b.muted,opacity:m(s,[at,at+.3],[0,1])}}><Localized>{children}</Localized></div>;
}
function Figure({file,x,y,h,at=0,bw=false}:{file:string;x:number;y:number;h:number;at?:number;bw?:boolean}){
 const s=useSeconds();return <Img src={asset(file)} style={{position:'absolute',left:x,top:y,height:h,width:'auto',objectFit:'contain',opacity:m(s,[at,at+.2],[0,1]),translate:`${m(s,[at,at+.75],[34,0])}px ${m(s,[at,at+.75],[100,0])}px`,scale:m(s,[at,at+3.8],[1.035,1]),transformOrigin:'50% 90%',filter:bw?'grayscale(1)':b.photograph}}/>;
}
function Plate({file,x,y,w,h,at=0,bw=false,focus='50% 50%',angle=0}:{file:string;x:number;y:number;w:number;h:number;at?:number;bw?:boolean;focus?:string;angle?:number}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,padding:12,boxSizing:'border-box',background:b.white,boxShadow:b.shadow,rotate:`${angle}deg`,opacity:m(s,[at,at+.22],[0,1]),translate:`0 ${m(s,[at,at+.65],[65,0])}px`,clipPath:`inset(0 0 ${m(s,[at,at+t.photoReveal],[100,0])}% 0)`}}><div style={{width:'100%',height:'100%',overflow:'hidden'}}><Img src={asset(file)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:focus,scale:m(s,[at,at+4],[1.055,1]),filter:bw?'grayscale(1)':b.photograph}}/></div></div>;
}
function Note({text,x,y,toX,toY,at=1}:{text:string;x:number;y:number;toX:number;toY:number;at?:number}){
 const s=useSeconds();return <><svg width={1080} height={1920} style={{position:'absolute',inset:0,opacity:m(s,[at,at+.25],[0,1])}}><path d={`M ${x+60} ${y+48} L ${x+60} ${y+93} L ${toX} ${toY}`} fill="none" stroke={b.muted} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={m(s,[at,at+.7],[1,0])}/><circle cx={toX} cy={toY} r={9} stroke={b.muted} fill="none" strokeWidth={1.4}/></svg><Copy y={y} x={x-35} w={300} align="left" size={31} italic at={at+.15}>{text}</Copy></>;
}
// Reference opening: portraits are present on frame zero; the title clears,
// the figures separate laterally, and a small framed photograph slides in.
function OpeningPlate({handoff=false}:{handoff?:boolean}){
 const s=useSeconds();
 const start=handoff?0:t.hook.plateFrom;
 return <div style={{position:'absolute',left:310,top:620,width:460,height:740,
   padding:b.opening.framePadding,boxSizing:'border-box',background:b.opening.frame,
   opacity:handoff?m(s,[.08,.24],[1,0]):m(s,[start,start+.16],[0,1]),
   translate:handoff?'0 0':`${m(s,[start,t.hook.plateSettle],[820,0])}px 0`,
   scale:handoff?m(s,[0,t.hook.handoffSeconds],[1,1.045]):m(s,[start,t.hook.plateSettle],[1.08,1]),
 }}><div style={{height:'100%',width:'100%',overflow:'hidden',background:b.white}}>
   <Img src={asset(handoff||s>=t.hook.detailAt?'barbour-detail.jpg':'barbour.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',filter:b.photograph,
     scale:handoff?1.015:m(s,[t.hook.plateSettle,t.hook.seconds],[1,1.015]),
   }}/>
 </div></div>;
}
function Hook(){const s=useSeconds();return <AbsoluteFill style={{background:b.white,color:b.ink,overflow:'hidden'}}>
 <div style={{position:'absolute',left:100,top:353,width:880,textAlign:'center',
   fontFamily:b.serif,fontSize:b.opening.headlineSize,lineHeight:b.opening.headlineLeading,letterSpacing:-1.4,
   opacity:m(s,[t.hook.headlineOut,t.hook.headlineGone],[1,0]),
   translate:`0 ${m(s,[t.hook.headlineOut,t.hook.headlineGone],[0,-12])}px`,
 }}><Localized>If this is your style,</Localized><br/><em><Localized>five names to know.</Localized></em></div>
 <Img src={asset('barbour-portrait-hero.png')} style={{position:'absolute',left:-245,top:690,height:1690,width:'auto',
   filter:'grayscale(1) contrast(1.04)',transformOrigin:'50% 30%',
   scale:m(s,[0,t.hook.splitFrom],[1,1.025]),
   translate:`${m(s,[0,2.5],[0,-12])+m(s,[t.hook.splitFrom,t.hook.splitEnd],[0,-1020])}px 0`,
 }}/>
 <Img src={asset('valstar-detail-hero.png')} style={{position:'absolute',left:432,top:620,height:1750,width:'auto',
   filter:b.photograph,transformOrigin:'50% 30%',
   scale:m(s,[0,t.hook.splitFrom],[1,1.035]),
   translate:`${m(s,[0,2.5],[0,9])+m(s,[t.hook.splitFrom,t.hook.splitEnd],[0,1100])}px 0`,
 }}/>
 <OpeningPlate/>
 </AbsoluteFill>;}
type BrandDetailName='barbour'|'valstar'|'todd'|'buck'|'rocky';
function BrandDetail({kind}:{kind:BrandDetailName}){
 const data={
   barbour:{number:'01',name:'Barbour',file:'barbour-detail.jpg',caption:'Waxed cotton. Corduroy collar.',focus:'50% 55%'},
   valstar:{number:'02',name:'Valstar',file:'valstar-detail.jpg',caption:'Suede, up close.',focus:'50% 55%'},
   todd:{number:'03',name:'Todd Snyder',file:'todd.jpg',caption:'The cut. The proportions.',focus:'50% 20%'},
   buck:{number:'04',name:'Buck Mason',file:'buck-detail.jpg',caption:'Let the texture do the work.',focus:'50% 45%'},
   rocky:{number:'05',name:'Rocky Mountain',file:'rocky.jpg',caption:'Western character. Built for layering.',focus:'50% 30%'},
 }[kind];
 return <AbsoluteFill style={{background:b.white,color:b.ink}}>
   <Label y={240}>{data.number} / THE DETAILS</Label>
   <Copy y={330} size={kind==='rocky'?72:90}>{data.name}</Copy>
   <div style={{position:'absolute',left:165,top:585,width:750,height:1030,padding:12,boxSizing:'border-box',background:b.white,boxShadow:b.shadow,overflow:'hidden'}}>
     <Img src={asset(data.file)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:data.focus,filter:b.photograph,
       scale:kind==='todd'?1.7:kind==='rocky'?1.3:1.04,transformOrigin:kind==='todd'?'50% 18%':kind==='rocky'?'50% 26%':'50% 50%',
     }}/>
   </div>
   <Copy y={1710} size={kind==='rocky'?40:46} italic>{data.caption}</Copy>
 </AbsoluteFill>;
}
function Barbour(){const s=useSeconds();const {fps}=useVideoConfig();return <Page seconds={t.barbour.seconds}>
 <AbsoluteFill style={{opacity:m(s,[.24,t.hook.handoffSeconds],[0,1])}}>
 <Label y={240}>01 / British character</Label><Copy y={330} size={96}>Barbour</Copy>
 <Figure file="barbour-cut.png" x={48} y={620} h={1290}/>
 <Plate file="barbour-detail.jpg" x={665} y={670} w={295} h={385} at={.5}/>
 <Note text="Waxed cotton." x={690} y={1180} toX={450} toY={1190} at={1.1}/>
 <Copy y={1695} x={650} w={300} size={32} align="left" italic at={1.4}>Character that<br/>gets better with time.</Copy>
 </AbsoluteFill>
 {s<t.hook.handoffSeconds && <OpeningPlate handoff/>}
 <Sequence name="Barbour — collar detail" from={Math.round(t.barbour.detailAt*fps)}><BrandDetail kind="barbour"/></Sequence>
 </Page>;}
function Valstar(){const {fps}=useVideoConfig();return <Page seconds={t.valstar.seconds}>
 <Label y={240}>02 / Italian ease</Label><Copy y={330} size={96}>Valstar</Copy>
 <Plate file="valstar.jpg" x={130} y={590} w={565} h={1070}/>
 <Plate file="valstar-detail.jpg" x={637} y={840} w={315} h={450} at={.6} angle={2}/>
 <Copy y={1740} size={46} italic at={1.1}>A softer silhouette, in suede.</Copy>
 <Sequence name="Valstar — suede detail" from={Math.round(t.valstar.detailAt*fps)}><BrandDetail kind="valstar"/></Sequence>
 </Page>;}
function Todd(){const {fps}=useVideoConfig();return <Page seconds={t.todd.seconds}>
 <Label y={240}>03 / Modern classics</Label><Copy y={330} size={90}>Todd Snyder</Copy>
 <Plate file="todd.jpg" x={265} y={575} w={550} h={1085}/>
 <Note text="Familiar. Refined." x={720} y={1300} toX={698} toY={1070} at={1}/>
 <Copy y={1750} size={44} italic at={1.4}>A modern take on the classics.</Copy>
 <Sequence name="Todd Snyder — coat proportions" from={Math.round(t.todd.detailAt*fps)}><BrandDetail kind="todd"/></Sequence>
 </Page>;}
function Buck(){const {fps}=useVideoConfig();return <Page seconds={t.buck.seconds}>
 <Label y={240}>04 / American ease</Label><Copy y={330} size={90}>Buck Mason</Copy>
 <Plate file="buck.jpg" x={110} y={620} w={860} h={615} focus="48% 30%"/>
 <Plate file="buck-detail.jpg" x={175} y={1120} w={350} h={500} at={.8} angle={-2}/>
 <Copy y={1370} x={600} w={350} size={47} italic align="left" at={1.1}>Texture.<br/>Then simplicity.</Copy>
 <Copy y={1750} size={44} at={1.6}>Relaxed, but considered.</Copy>
 <Sequence name="Buck Mason — texture close-up" from={Math.round(t.buck.detailAt*fps)}><BrandDetail kind="buck"/></Sequence>
 </Page>;}
function Rocky(){const {fps}=useVideoConfig();return <Page seconds={t.rocky.seconds}>
 <Label y={220}>05 / Western character</Label><Copy y={305} size={67}>Rocky Mountain</Copy><Copy y={381} size={67} italic at={.2}>Featherbed</Copy>
 <Plate file="rocky-bw.jpg" x={80} y={705} w={370} h={630} at={.25} bw/>
 <Figure file="rocky-cut.png" x={394} y={610} h={1325} at={.05}/>
 <Copy y={1480} x={90} w={300} size={40} italic align="left" at={1.1}>Built for<br/>layering.</Copy>
 <Sequence name="Rocky Mountain — layered portrait" from={Math.round(t.rocky.detailAt*fps)}><BrandDetail kind="rocky"/></Sequence>
 </Page>;}
function Bridge(){const {fps}=useVideoConfig();return <Page seconds={t.bridge.seconds}>
 <Copy y={290} size={62}>Five different perspectives.</Copy><Copy y={365} size={60} italic at={.4}>One point of view: yours.</Copy>
 <Plate file="barbour.jpg" x={65} y={640} w={310} h={630} at={.15}/>
 <Plate file="valstar.jpg" x={385} y={710} w={310} h={630} at={.35}/>
 <Plate file="todd.jpg" x={705} y={640} w={310} h={630} at={.55}/>
 <Plate file="buck.jpg" x={160} y={1265} w={420} h={330} at={.7}/>
 <Plate file="rocky.jpg" x={620} y={1265} w={280} h={430} at={.85}/>
 <Label y={1770} at={1.6}>From inspiration to your wardrobe</Label>
 <Sequence name="Inspiration — your point of view" from={Math.round(t.bridge.detailAt*fps)}>
  <AbsoluteFill style={{background:b.white,color:b.ink}}>
    <Copy y={300} size={66}>Your wardrobe.</Copy><Copy y={378} size={66} italic>Your point of view.</Copy>
    <Plate file="barbour-portrait.jpg" x={90} y={650} w={480} h={850}/>
    <Plate file="valstar-detail.jpg" x={520} y={780} w={470} h={850} at={.15}/>
    <Label y={1750} at={.4}>Now make it yours</Label>
  </AbsoluteFill>
 </Sequence>
 </Page>;}
function Demo(){const s=useSeconds();const {fps}=useVideoConfig();const detail=s>=t.demo.detailAt;return <Page seconds={t.demo.seconds}>
 <Label y={160}>Your next look starts here</Label><Copy y={240} size={68}>{detail?"Plan your next look.":"Make it your own."}</Copy>
 <div style={{position:'absolute',left:278,top:410,width:524,height:1136,borderRadius:32,overflow:'hidden',boxShadow:b.shadow,scale:m(s,[0,.7],[.89,1]),opacity:m(s,[0,.3],[0,1])}}>
 <Sequence durationInFrames={Math.round(t.demo.swap*fps)}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round(t.demo.selectionSource*fps)} muted style={{width:'100%',height:'100%'}}/></Sequence>
 <Sequence from={Math.round(t.demo.swap*fps)} durationInFrames={Math.round((t.demo.detailAt-t.demo.swap)*fps)}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round(t.demo.resultSource*fps)} muted style={{width:'100%',height:'100%'}}/></Sequence>
 <Sequence name="Demo — save to calendar" from={Math.round(t.demo.detailAt*fps)}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round(t.demo.detailSource*fps)} muted style={{width:'100%',height:'100%'}}/></Sequence>
 </div>
 <Copy y={1645} size={58} at={.4}>AIWardrobe</Copy><Label y={1732} at={1}>Explore the demo → find your next look</Label>
 </Page>;}
function Close(){const s=useSeconds();return <AbsoluteFill style={{background:b.white,color:b.ink}}>
 <Figure file="barbour-cut.png" x={-55} y={1205} h={850} bw/>
 <Figure file="valstar-cut.png" x={357} y={1180} h={880}/>
 <Figure file="todd-cut.png" x={735} y={1230} h={830} bw/>
 <Label y={480}>A wardrobe with a point of view</Label>
 <Copy y={615} size={76} at={.15}>Make it your own.</Copy>
 <div style={{position:'absolute',left:290,top:766,width:500,height:1,background:b.line,scale:`${m(s,[.4,1],[0,1])} 1`}}/>
 <Copy y={835} size={67} at={.5}>Try AIWardrobe</Copy><Label y={950} at={t.close.ctaDetailAt}>Explore the demo →</Label>
 </AbsoluteFill>;}
const HeritageJacketsFilm=()=>{const {fps}=useVideoConfig();const locale=useContext(HeritageLocale);const voice=(file:string)=>asset(`voice${locale==='ru'?'-ru':''}/${file}`);return <AbsoluteFill style={{background:b.white}}>
 <Sequence name="01 — Five names to know" from={Math.round(t.hook.from*fps)} durationInFrames={Math.round(t.hook.seconds*fps)}><Hook/></Sequence>
 <Sequence name="02 — Barbour" from={Math.round(t.barbour.from*fps)} durationInFrames={Math.round(t.barbour.seconds*fps)}><Barbour/></Sequence>
 <Sequence name="03 — Valstar" from={Math.round(t.valstar.from*fps)} durationInFrames={Math.round(t.valstar.seconds*fps)}><Valstar/></Sequence>
 <Sequence name="04 — Todd Snyder" from={Math.round(t.todd.from*fps)} durationInFrames={Math.round(t.todd.seconds*fps)}><Todd/></Sequence>
 <Sequence name="05 — Buck Mason" from={Math.round(t.buck.from*fps)} durationInFrames={Math.round(t.buck.seconds*fps)}><Buck/></Sequence>
 <Sequence name="06 — Rocky Mountain Featherbed" from={Math.round(t.rocky.from*fps)} durationInFrames={Math.round(t.rocky.seconds*fps)}><Rocky/></Sequence>
 <Sequence name="07 — Make it yours" from={Math.round(t.bridge.from*fps)} durationInFrames={Math.round(t.bridge.seconds*fps)}><Bridge/></Sequence>
 <Sequence name="08 — Real AIWardrobe demo" from={Math.round(t.demo.from*fps)} durationInFrames={Math.round(t.demo.seconds*fps)}><Demo/></Sequence>
 <Sequence name="09 — Call to action" from={Math.round(t.close.from*fps)} durationInFrames={Math.round(t.close.seconds*fps)}><Close/></Sequence>
 <Audio src={asset('score.wav')} volume={.5}/>
 <Sequence name="Voice — hook" from={Math.round(.3*fps)}><Audio src={voice('01.wav')}/></Sequence>
 <Sequence name="Voice — Barbour" from={Math.round((t.barbour.from+.2)*fps)}><Audio src={voice('02.wav')}/></Sequence>
 <Sequence name="Voice — Valstar" from={Math.round((t.valstar.from+.2)*fps)}><Audio src={voice('03.wav')}/></Sequence>
 <Sequence name="Voice — Todd Snyder" from={Math.round((t.todd.from+.2)*fps)}><Audio src={voice('04.wav')}/></Sequence>
 <Sequence name="Voice — Buck Mason" from={Math.round((t.buck.from+.2)*fps)}><Audio src={voice('05.wav')}/></Sequence>
 <Sequence name="Voice — Rocky Mountain" from={Math.round((t.rocky.from+.02)*fps)}><Audio src={voice('06.wav')}/></Sequence>
 <Sequence name="Voice — bridge" from={Math.round((t.bridge.from+.3)*fps)}><Audio src={voice('07.wav')}/></Sequence>
 <Sequence name="Voice — demo" from={Math.round((t.demo.from+.35)*fps)}><Audio src={voice('08.wav')}/></Sequence>
 <Sequence name="Voice — CTA" from={Math.round((t.close.from+.35)*fps)}><Audio src={voice('09.wav')}/></Sequence>
 </AbsoluteFill>;};

export const HeritageJackets=()=> <HeritageLocale.Provider value="en"><HeritageJacketsFilm/></HeritageLocale.Provider>;
export const HeritageJacketsRu=()=> <HeritageLocale.Provider value="ru"><HeritageJacketsFilm/></HeritageLocale.Provider>;
