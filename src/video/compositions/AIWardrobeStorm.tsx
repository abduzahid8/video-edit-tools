import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {stormBrand as b} from '../theme';
import {stormTimeline as t} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.16,1,.3,1)};
const Copy=({lines,seconds,top=false,small}:{lines:string[];seconds:number;top?:boolean;small?:string})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:74,right:74,...(top?{top:230}:{bottom:250}),color:b.white,opacity:interpolate(f,[0,.2*fps,(seconds-.35)*fps,seconds*fps],[0,1,1,0],clamp)}}>
 {small&&<div style={{fontSize:20,letterSpacing:5,marginBottom:27,color:b.accent}}>{small}</div>}
 {lines.map((line,i)=><div key={line} style={{overflow:'hidden'}}><div style={{fontSize:96,fontWeight:720,letterSpacing:-4.8,lineHeight:1.04,translate:`0px ${interpolate(f,[i*.09*fps,(i*.09+.65)*fps],[125,0],ease)}px`}}>{line}</div></div>)}
 <div style={{marginTop:34,height:2,width:interpolate(f,[.15*fps,1*fps],[0,180],ease),background:b.accent}}/>
 </div>;
};
const OutfitFrame=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const p=interpolate(f,[t.frameStart*fps,t.frameSettle*fps],[0,1],ease);
 const alpha=interpolate(f,[t.frameStart*fps,(t.frameStart+.2)*fps,12.9*fps,14*fps],[0,.55,.55,0],clamp);
 return <svg width="1080" height="1920" style={{position:'absolute',opacity:alpha}} fill="none" stroke={b.white} strokeWidth="2">
 <path d="M 275 420 H 230 V 505 M 805 420 H 850 V 505 M 230 1245 V 1320 H 275 M 805 1320 H 850 V 1245" strokeDasharray="600" strokeDashoffset={(1-p)*600}/>
 {[{x:310,y:640},{x:790,y:930},{x:740,y:1240}].map((point,i)=><g key={i} opacity={interpolate(f,[(9+i*.2)*fps,(9.5+i*.2)*fps],[0,1],clamp)}><circle cx={point.x} cy={point.y} r="5" fill={b.white}/><circle cx={point.x} cy={point.y} r={14+Math.sin(f/fps*1.8+i)*3}/><path d={`M ${point.x+(i===0?-22:22)} ${point.y} h ${i===0?-65:65}`} strokeDasharray="70" strokeDashoffset={(1-p)*70}/></g>)}
 </svg>;
};
export const AIWardrobeStorm=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:b.ink,fontFamily:b.fontFamily}}>
 <OffthreadVideo src={staticFile('assets/storm/source.mp4')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,0,0,.45) 0%,transparent 33%,transparent 57%,rgba(0,0,0,.63) 100%)'}}/>
 <OutfitFrame/>
 <Sequence name="Problem" from={t.question.from*fps} durationInFrames={t.question.seconds*fps}><Copy lines={['Nothing','to wear?']} seconds={t.question.seconds} top small="AIWARDROBE"/></Sequence>
 <Sequence name="Transformation" from={t.transform.from*fps} durationInFrames={t.transform.seconds*fps}><Copy lines={['Let it come','together.']} seconds={t.transform.seconds}/></Sequence>
 <Sequence name="Complete outfit" from={t.look.from*fps} durationInFrames={t.look.seconds*fps}><Copy lines={['One complete','look.']} seconds={t.look.seconds}/></Sequence>
 <Sequence name="Closing statement" from={t.close.from*fps} durationInFrames={t.close.seconds*fps}><Copy lines={['Your style.','Sorted.']} seconds={t.close.seconds} small="PERSONAL AI STYLING"/></Sequence>
 </AbsoluteFill>;
};
