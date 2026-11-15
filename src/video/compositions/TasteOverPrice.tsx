import {createContext, useContext, type ReactNode} from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {tasteOverPriceBrand as b} from '../theme';
import {tasteOverPriceTimeline as t} from '../timeline';
import {tasteCopy, type TasteLocale} from '../copy/tasteOverPrice';

const Locale = createContext<TasteLocale>('en');
const useCopy = () => tasteCopy[useContext(Locale)];
const useSeconds = () => useCurrentFrame() / useVideoConfig().fps;
const asset = (name: string) => staticFile(`assets/taste-over-price/${name}`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(.18,.78,.22,1)};
const aspects: Record<string, number> = {coast:1779/3573,linen:1161/1947,standing:728/1325,pinstripe:1012/1681,portrait:2551/3200};

function Page({children,number}: {children:ReactNode;number:number}) {
 const c=useCopy();
 return <AbsoluteFill style={{background:b.white,color:b.ink,overflow:'hidden'}}>
  <div style={{position:'absolute',left:84,top:138,fontFamily:b.sans,fontSize:21,letterSpacing:3,color:b.muted}}>{c.journal}</div>
  <div style={{position:'absolute',right:84,top:134,fontFamily:b.serif,fontStyle:'italic',fontSize:28,color:b.muted}}>{String(number).padStart(2,'0')}</div>
  {children}
 </AbsoluteFill>;
}
function Title({lines,y=310,size=88,x=80,w=920,align='center',instant=false}:{lines:readonly string[];y?:number;size?:number;x?:number;w?:number;align?:'center'|'left';instant?:boolean}) {
 const s=useSeconds();const ru=useContext(Locale)==='ru';
 return <div style={{position:'absolute',left:x,top:y,width:w,textAlign:align,fontFamily:b.serif,fontSize:ru?size*.88:size,lineHeight:1.12,letterSpacing:-2,zIndex:5}}>
  <div style={{opacity:instant?1:interpolate(s,[0,.18],[.35,1],clamp),translate:`0 ${interpolate(s,[0,t.reveal],[26,0],ease)}px`}}>{lines[0]}</div>
  <div style={{fontStyle:'italic',opacity:instant?1:interpolate(s,[.08,.3],[0,1],clamp),translate:`0 ${interpolate(s,[.08,.5],[28,0],ease)}px`}}>{lines[1]}</div>
 </div>;
}
function Note({children,y=1675,x=80,w=920,at=.55,size=40}:{children:ReactNode;y?:number;x?:number;w?:number;at?:number;size?:number}) {
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,fontFamily:b.serif,fontStyle:'italic',fontSize:size,textAlign:'center',color:b.muted,lineHeight:1.22,zIndex:6,
 opacity:interpolate(s,[at,at+.22],[0,1],clamp),translate:`0 ${interpolate(s,[at,at+.4],[14,0],ease)}px`}}>{children}</div>;
}
function Figure({name,x=180,y=680,h=1450,at=0,side=0,instant=false}:{name:string;x?:number;y?:number;h?:number;at?:number;side?:number;instant?:boolean}) {
 const s=useSeconds();return <Img src={asset(`${name}-cut.png`)} style={{position:'absolute',left:x,top:y,height:h,width:h*aspects[name],maxWidth:'none',filter:b.photo,
 opacity:instant?1:interpolate(s,[at,at+.12],[0,1],clamp),
 translate:`${interpolate(s,[at,at+t.reveal],[side*150,0],ease)}px ${interpolate(s,[at,at+t.reveal],[side?0:100,0],ease)}px`,
 scale:interpolate(s,[0,t.shot],[1,1.025],clamp),transformOrigin:'50% 40%'}}/>;
}
function Plate({name,x=180,y=640,w=720,h=960,at=0,zoom=1,focus='50% 50%',angle=0}:{name:string;x?:number;y?:number;w?:number;h?:number;at?:number;zoom?:number;focus?:string;angle?:number}) {
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,background:b.white,padding:12,rotate:`${angle}deg`,boxShadow:b.shadow,
 opacity:interpolate(s,[at,at+.18],[0,1],clamp),translate:`0 ${interpolate(s,[at,at+.44],[45,0],ease)}px`}}>
  <div style={{width:'100%',height:'100%',overflow:'hidden',clipPath:`inset(0 0 ${interpolate(s,[at,at+.4],[12,0],ease)}% 0)`}}>
   <Img src={asset(`${name}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:focus,filter:b.photo,scale:zoom*interpolate(s,[0,t.shot],[1.02,1],clamp),transformOrigin:focus}}/>
  </div>
 </div>;
}
function Leader({label,x,y,tx,ty,w=300}:{label:string;x:number;y:number;tx:number;ty:number;w?:number}) {
 const s=useSeconds();return <>
  <svg width={1080} height={1920} style={{position:'absolute',inset:0,zIndex:4}}>
   <path d={`M ${x+w/2} ${y+55} L ${x+w/2} ${ty} L ${tx} ${ty}`} fill="none" stroke={b.accent} strokeWidth={1.8} pathLength={1} strokeDasharray={1} strokeDashoffset={interpolate(s,[t.annotation,t.annotation+.5],[1,0],ease)}/>
   <circle cx={tx} cy={ty} r={8} fill={b.white} stroke={b.accent} strokeWidth={2} opacity={interpolate(s,[t.annotation+.35,t.annotation+.5],[0,1],clamp)}/>
  </svg>
  <Note x={x} y={y} w={w} at={t.annotation} size={34}>{label}</Note>
 </>;
}
function Hook(){const c=useCopy();return <Page number={1}><Title lines={c.hook} size={106} instant/><Figure name="coast" x={95} y={670} h={1770} instant/></Page>;}
function Taste(){const c=useCopy();return <Page number={2}><Title lines={c.taste}/><Plate name="portrait" x={200} y={640} w={680} h={1000} focus="50% 30%" zoom={1.13}/></Page>;}
function Fit(){const c=useCopy();return <Page number={3}><Title lines={c.fit} x={85} w={440} y={370} align="left"/><Figure name="pinstripe" x={360} y={650} h={1400} side={1}/><Leader label={c.fitNote} x={90} y={1040} tx={630} ty={1125}/></Page>;}
function Shoulder(){const c=useCopy();return <Page number={4}><Title lines={c.shoulder} size={76}/><Plate name="pinstripe" x={140} y={670} w={800} h={940} focus="50% 30%" zoom={1.85}/></Page>;}
function Proportion(){const c=useCopy();return <Page number={5}><Title lines={c.proportion} size={88}/><Figure name="standing" x={220} y={650} h={1280} side={-1}/><Leader label={c.lineNote} x={725} y={1260} tx={550} ty={1390} w={260}/></Page>;}
function Line(){const c=useCopy();return <Page number={6}><Title lines={c.line} size={78}/><Plate name="standing" x={160} y={680} w={760} h={990} focus="50% 76%" zoom={1.65}/></Page>;}
function Palette(){const c=useCopy();const s=useSeconds();return <Page number={7}><Title lines={c.palette}/><Plate name="navy" x={96} y={685} w={430} h={835} angle={-2}/><Plate name="linen" x={555} y={735} w={430} h={835} angle={2} at={t.secondReveal}/>
 <div style={{position:'absolute',left:155,right:150,top:1640,display:'flex',justifyContent:'space-between',fontFamily:b.serif,fontSize:39,opacity:interpolate(s,[1,1.3],[0,1],clamp)}}>
  <span style={{display:'flex',gap:18,alignItems:'center'}}><i style={{width:40,height:40,borderRadius:20,background:b.navy}}/>{c.navy}</span>
  <span style={{display:'flex',gap:18,alignItems:'center'}}><i style={{width:40,height:40,borderRadius:20,background:b.cream}}/>{c.cream}</span>
 </div></Page>;}
function Texture(){const c=useCopy();return <Page number={8}><Title lines={c.texture} size={80}/><Plate name="steps" x={150} y={670} w={780} h={950} zoom={1.65} focus="50% 38%"/><Note>{c.textureNote}</Note></Page>;}
function Combinations(){const c=useCopy();return <Page number={9}><Title lines={c.combinations} size={86}/><Figure name="pinstripe" x={-100} y={770} h={1240} side={-1}/><Figure name="linen" x={300} y={850} h={1170} at={.18}/><Figure name="coast" x={730} y={810} h={1230} at={.36} side={1}/></Page>;}
function Bridge(){const c=useCopy();return <Page number={10}><Title lines={c.bridge} size={90}/><Plate name="steps" x={170} y={675} w={740} h={880}/><Note y={1650} size={36}>{c.bridgeNote}</Note></Page>;}

type DemoKind='wardrobe'|'occasion'|'result'|'detail'|'invite';
function Demo({kind,number}:{kind:DemoKind;number:number}) {
 const c=useCopy();const s=useSeconds();const {fps}=useVideoConfig();const crop=kind==='detail';
 return <Page number={number}>
  <Title lines={c[kind]} y={275} size={kind==='wardrobe'?78:84}/>
  <div style={{position:'absolute',left:crop?140:275,top:crop?655:565,width:crop?800:530,height:crop?930:1145,borderRadius:crop?8:36,overflow:'hidden',background:b.white,border:'1px solid #e3e5de',boxShadow:b.shadow,
   scale:interpolate(s,[0,.44],[.97,1],ease),translate:`0 ${interpolate(s,[0,.44],[25,0],ease)}px`}}>
   <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round(t.source[kind]*fps)} muted style={{position:'absolute',left:0,top:crop?-345:0,width:'100%',height:crop?'auto':'100%',objectFit:'cover'}}/>
  </div>
  <Note y={1750} size={kind==='invite'?40:34} at={.25}>{kind==='invite'?c.cta:c[`${kind}Note`]}</Note>
  <div style={{position:'absolute',left:80,right:80,top:1840,textAlign:'center',fontFamily:b.sans,fontSize:18,letterSpacing:2,color:b.muted}}>{c.realDemo}</div>
 </Page>;
}
function Close(){const c=useCopy();const s=useSeconds();return <Page number={16}>
 <Title lines={c.close} y={340} size={88}/>
 <div style={{position:'absolute',left:80,right:80,top:675,textAlign:'center',fontFamily:b.sans,fontSize:82,fontWeight:600,letterSpacing:-4,opacity:interpolate(s,[.15,.4],[0,1],clamp)}}>AIWardrobe</div>
 <Note y={810} size={42} at={.4}>{c.cta}</Note><Note y={910} size={32} at={.9}>{c.closeNote}</Note>
 <Figure name="linen" x={-155} y={1120} h={1220} side={-1}/><Figure name="coast" x={400} y={1070} h={1270} at={.15}/><Figure name="pinstripe" x={830} y={1190} h={1050} at={.3} side={1}/>
 </Page>;}
function Film(){const {fps}=useVideoConfig();const f=(s:number)=>Math.round(s*fps);return <AbsoluteFill style={{background:b.white}}>
 <Sequence name="01 / Money cannot buy taste" from={f(t.hook)} durationInFrames={f(t.shot)}><Hook/></Sequence>
 <Sequence name="02 / Style in the details" from={f(t.taste)} durationInFrames={f(t.shot)}><Taste/></Sequence>
 <Sequence name="03 / Fit and shoulder annotation" from={f(t.fit)} durationInFrames={f(t.shot)}><Fit/></Sequence>
 <Sequence name="04 / New shoulder detail crop" from={f(t.shoulder)} durationInFrames={f(t.shot)}><Shoulder/></Sequence>
 <Sequence name="05 / Proportion and full silhouette" from={f(t.proportion)} durationInFrames={f(t.shot)}><Proportion/></Sequence>
 <Sequence name="06 / Jacket length and trouser detail" from={f(t.line)} durationInFrames={f(t.shot)}><Line/></Sequence>
 <Sequence name="07 / Navy and cream pair" from={f(t.palette)} durationInFrames={f(t.shot)}><Palette/></Sequence>
 <Sequence name="08 / Knitwear and tailoring" from={f(t.texture)} durationInFrames={f(t.shot)}><Texture/></Sequence>
 <Sequence name="09 / Three masculine silhouettes" from={f(t.combinations)} durationInFrames={f(t.shot)}><Combinations/></Sequence>
 <Sequence name="10 / From inspiration to your wardrobe" from={f(t.bridge)} durationInFrames={f(t.shot)}><Bridge/></Sequence>
 <Sequence name="11 / Real demo - wardrobe" from={f(t.wardrobe)} durationInFrames={f(t.shot)}><Demo kind="wardrobe" number={11}/></Sequence>
 <Sequence name="12 / Real demo - choose occasion" from={f(t.occasion)} durationInFrames={f(t.shot)}><Demo kind="occasion" number={12}/></Sequence>
 <Sequence name="13 / Real demo - outfit suggestion" from={f(t.result)} durationInFrames={f(t.shot)}><Demo kind="result" number={13}/></Sequence>
 <Sequence name="14 / Real demo - inspect the pieces" from={f(t.detail)} durationInFrames={f(t.shot)}><Demo kind="detail" number={14}/></Sequence>
 <Sequence name="15 / Real demo - invitation" from={f(t.invite)} durationInFrames={f(t.shot)}><Demo kind="invite" number={15}/></Sequence>
 <Sequence name="16 / Try the AIWardrobe demo" from={f(t.close)} durationInFrames={f(t.shot)}><Close/></Sequence>
 <Audio src={asset('score.wav')} volume={.55}/>
 </AbsoluteFill>;}
export const TasteOverPrice = () => <Locale.Provider value="en"><Film/></Locale.Provider>;
export const TasteOverPriceRu = () => <Locale.Provider value="ru"><Film/></Locale.Provider>;
