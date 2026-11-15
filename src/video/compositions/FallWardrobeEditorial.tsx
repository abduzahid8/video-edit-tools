import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {EditorialTitle, AIWardrobeEditorialCTA} from './ColorEditorial';
import {EditorialAppOutfit} from './SmartCasualShopping';
import {fallEditorialBrand as brand} from '../theme';
import {fallEditorialTimeline as timing} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.16,1,.3,1)};
const day='fall-editorial/day.jpg', dayCut='fall-editorial/day-cut.png';
const night='smart-casual-shopping/suit-pattern.jpg', nightCut='smart-casual-shopping/suit-pattern-cut.png';
function Reveal({children,delay=0,style={}}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();return <div style={{...style,opacity:interpolate(f,[delay*fps,(delay+.16)*fps],[0,1],clamp),translate:`0 ${interpolate(f,[delay*fps,(delay+.4)*fps],[35,0],ease)}px`}}>{children}</div>;
}
function Card({src,left,top,width,height,zoom=1,origin='50% 50%',delay=0}:{src:string;left:number;top:number;width:number;height:number;zoom?:number;origin?:string;delay?:number}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();return <Reveal delay={delay} style={{position:'absolute',left,top,width,height,overflow:'hidden',background:brand.frame,border:`8px solid ${brand.paper}`,boxShadow:brand.softShadow}}><Img src={staticFile('assets/'+src)} style={{width:'100%',height:'100%',objectFit:'cover',scale:interpolate(f,[0,.55*fps],[zoom*1.055,zoom],ease),transformOrigin:origin}}/></Reveal>;
}
function Figure({src,left,top,height,mono=false,delay=0}:{src:string;left:number;top:number;height:number;mono?:boolean;delay?:number}){return <Reveal delay={delay} style={{position:'absolute',left,top,height}}><Img src={staticFile('assets/'+src)} style={{height:'100%',width:'auto',maxWidth:'none',filter:mono?'grayscale(1)':undefined}}/></Reveal>;}
function Label({children,top=160}:{children:React.ReactNode;top?:number}){return <Reveal style={{position:'absolute',left:80,right:80,top,textAlign:'center',fontSize:22,letterSpacing:4,color:brand.muted}}>{children}</Reveal>;}
function Caption({children,top=1660}:{children:React.ReactNode;top?:number}){return <Reveal delay={.35} style={{position:'absolute',left:95,right:95,top,textAlign:'center',fontSize:39,fontFamily:brand.serif,lineHeight:1.25,background:brand.paper,padding:'18px 8px'}}>{children}</Reveal>;}
function Pointer({text,x,y,tx,ty,delay=.55}:{text:string;x:number;y:number;tx:number;ty:number;delay?:number}){
 const f=useCurrentFrame(); const {fps}=useVideoConfig();const p=interpolate(f,[delay*fps,(delay+.5)*fps],[0,1],ease);
 return <div style={{position:'absolute',inset:0,opacity:p}}><svg width={1080} height={1920} style={{position:'absolute'}}><path d={`M${x+70} ${y+55} L${x+70} ${y+90} L${tx} ${ty}`} stroke={brand.ink} strokeWidth={1.4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/><circle cx={tx} cy={ty} r={10} fill={brand.paper} stroke={brand.ink}/><circle cx={tx} cy={ty} r={2.5} fill={brand.ink}/></svg><div style={{position:'absolute',left:x,top:y,fontFamily:brand.serif,fontStyle:'italic',fontSize:31,background:brand.paper,padding:'6px 12px'}}>{text}</div></div>;
}
function Opening(){return <><EditorialTitle top={270} size={76}>Two fall looks.<br/><i>Every detail counts.</i></EditorialTitle><Figure src={dayCut} left={-120} top={650} height={1330} mono/><Figure src={nightCut} left={450} top={640} height={1390} delay={.12}/><Label top={550}>TEXTURE / PROPORTION / CONTRAST</Label></>;}
function Day(){return <><Label>01 / THE TEXTURED LOOK</Label><EditorialTitle top={280} size={76}>Start with suede.<br/><i>Add character beneath.</i></EditorialTitle><Card src={day} left={225} top={640} width={630} height={850}/><Reveal delay={.65} style={{position:'absolute',left:120,top:1550,fontSize:29,fontFamily:brand.serif,fontStyle:'italic'}}>Suede jacket + patterned knit + cream trousers</Reveal></>;}
function DayDetail(){return <><Label>WHY IT WORKS</Label><EditorialTitle top={260} size={76}>Rich texture.<br/><i>A restrained palette.</i></EditorialTitle><Card src={day} left={80} top={620} width={550} height={730} zoom={1.7} origin="35% 40%"/><Card src={day} left={570} top={1130} width={410} height={420} zoom={2.05} origin="50% 48%" delay={.25}/><Pointer text="matte suede" x={660} y={760} tx={510} ty={1090}/><Reveal delay={.8} style={{position:'absolute',left:110,top:1450,display:'flex',gap:15}}>{[brand.autumn,brand.charcoal,brand.cream].map(c=><div key={c} style={{width:95,height:65,background:c}}/>)}</Reveal><Caption>One expressive layer.<br/><i>Quiet colours around it.</i></Caption></>;}
function Evening(){return <><Label>02 / THE TAILORED LOOK</Label><EditorialTitle top={270} size={76}>Change the mood.<br/><i>Sharpen the silhouette.</i></EditorialTitle><Card src={night} left={230} top={630} width={620} height={870}/><Caption top={1580}>Grey blazer. Striped shirt.<br/><i>Dark trousers to ground the look.</i></Caption></>;}
function EveningDetail(){return <><Label>WHY IT WORKS</Label><EditorialTitle top={260} size={76}>Structure up top.<br/><i>A clean line below.</i></EditorialTitle><Figure src={nightCut} left={135} top={590} height={1370}/><Pointer text="defined shoulders" x={75} y={655} tx={710} ty={1020}/><Pointer text="a clear waistline" x={75} y={1325} tx={500} ty={1530} delay={1.1}/><Reveal delay={.8} style={{position:'absolute',left:120,top:1710,width:830,textAlign:'center',background:brand.paper,padding:'15px',fontSize:34,fontFamily:brand.serif,fontStyle:'italic',lineHeight:1.3}}>Texture adds depth. Contrast adds shape.</Reveal></>;}
function Compare(){return <><EditorialTitle top={260} size={76}>Different moods.<br/><i>The same attention to detail.</i></EditorialTitle><Card src={day} left={70} top={650} width={450} height={750}/><Card src={night} left={560} top={740} width={450} height={750} delay={.15}/><Reveal delay={.4} style={{position:'absolute',left:90,top:1430,fontSize:23,letterSpacing:3}}>RELAXED</Reveal><Reveal delay={.55} style={{position:'absolute',left:580,top:1520,fontSize:23,letterSpacing:3}}>REFINED</Reveal><Caption top={1590}>Borrow the idea.<br/><i>Make the outfit yours.</i></Caption></>;}
export function FallWardrobeEditorial(){const {fps}=useVideoConfig();return <AbsoluteFill style={{background:brand.paper,color:brand.ink,fontFamily:brand.sans,overflow:'hidden'}}>
<Audio src={staticFile('assets/color-editorial/founder-audio-hook.wav')} volume={.7}/>
<Sequence name="Hook — every detail counts" from={timing.hook.from*fps} durationInFrames={timing.hook.seconds*fps}><Opening/></Sequence>
<Sequence name="Look one — the outfit formula" from={timing.day.from*fps} durationInFrames={timing.day.seconds*fps}><Day/></Sequence>
<Sequence name="Look one — texture and palette" from={timing.dayDetail.from*fps} durationInFrames={timing.dayDetail.seconds*fps}><DayDetail/></Sequence>
<Sequence name="Look two — change the mood" from={timing.evening.from*fps} durationInFrames={timing.evening.seconds*fps}><Evening/></Sequence>
<Sequence name="Look two — shoulder and waist" from={timing.eveningDetail.from*fps} durationInFrames={timing.eveningDetail.seconds*fps}><EveningDetail/></Sequence>
<Sequence name="Make the idea yours" from={timing.compare.from*fps} durationInFrames={timing.compare.seconds*fps}><Compare/></Sequence>
<Sequence name="Your look in AIWardrobe" from={timing.app.from*fps} durationInFrames={timing.app.seconds*fps}><EditorialAppOutfit/></Sequence>
<Sequence name="Create your first look" from={timing.cta.from*fps} durationInFrames={timing.cta.seconds*fps}><AIWardrobeEditorialCTA/></Sequence>
</AbsoluteFill>;}
