import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {capsuleEditorialBrand as b} from '../theme';
import {capsuleOpeningMotion as t} from '../timeline';

const smooth={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)} as const;
const move=(s:number,times:number[],values:number[])=>interpolate(s,times,values,smooth);
const src=(name:string)=>staticFile('assets/capsule-elegant/'+name);
const models=['hook-grey','hook-navy','hook-tailored'];

/** A shared bilingual opening keeps the choreography identical in both edits. */
export function CapsuleOpening({language}:{language:'ru'|'en'}){
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const s=frame/fps;
 const ru=language==='ru';const portrait=s<t.portraitCuts[1]?1:s<t.portraitCuts[2]?0:2;
 return <AbsoluteFill style={{isolation:'isolate',overflow:'hidden'}}>
  <div style={{position:'absolute',left:75,right:75,top:108,display:'flex',justifyContent:'space-between',fontFamily:b.sans,fontSize:20,letterSpacing:2.3,color:b.muted,zIndex:10}}><span>AIWARDROBE / STYLE JOURNAL</span><span>{s<t.fanStart?`0${portrait+1} / 03`:'01'}</span></div>
  {/* No empty first frame: a full-size portrait and the hook are already visible. */}
  {s<t.fanStart&&<div key={portrait} style={{position:'absolute',left:0,top:440,width:1080,height:1270,overflow:'hidden'}}>
   <Img src={src(models[portrait]+'.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 0%',transformOrigin:'50% 0%',scale:move(s,[t.portraitCuts[portrait===1?0:portrait===0?1:2],t.fanStart],[1.035,1.09]),translate:`${portrait===0?-20:portrait===2?20:0}px 0`}}/>
   <div style={{position:'absolute',bottom:0,left:0,right:0,height:180,background:`linear-gradient(transparent,${b.paper})`}}/>
  </div>}
  {/* Three photographic mats pull back, fan out and peel away to reveal cutouts. */}
  {s>=t.fanStart&&<div style={{position:'absolute',inset:0,perspective:1600,scale:move(s,[t.fanStart,t.fanEnd],[1.12,1]),transformOrigin:'50% 58%'}}>
   {[0,2,1].map(i=>{
    const side=i-1;const delay=i===1?0:i===0?0.02:0.09;
    const x=move(s,[t.fanStart+delay,t.fanEnd+delay],[250,[-130,245,640][i]]);
    const y=move(s,[t.fanStart+delay,t.fanEnd+delay],[500,[640,500,640][i]]);
    const w=i===1?590:570;const h=i===1?1090:990;
    return <div key={i} style={{position:'absolute',left:x,top:y,width:w,height:h,rotate:`${move(s,[t.fanStart+delay,t.fanEnd+delay],[side*13,side*1.2])}deg`,transform:`rotateY(${move(s,[t.fanStart+delay,t.fanEnd+delay],[-side*24,0])}deg)`,transformOrigin:'50% 80%'}}>
     <Img src={src(models[i]+'.png')} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'50% 100%',filter:`drop-shadow(0 9px 7px rgba(30,32,27,${i===1?.08:.04}))`}}/>
     <Img src={src(models[i]+'.jpg')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',objectPosition:'50% 100%',clipPath:`inset(0 0 ${move(s,[t.mattePeelStart+delay,t.mattePeelEnd+delay],[0,100])}% 0)`}}/>
    </div>;
   })}
  </div>}
  <div style={{position:'absolute',left:65,right:65,top:move(s,[t.fanStart,t.fanEnd],[205,235]),fontFamily:b.serif,textAlign:'center',fontSize:ru?91:103,lineHeight:1.02,letterSpacing:-2.8,zIndex:12}}>
   <div>{ru?'Выглядеть дороже.':'Look expensive.'}</div>
   <div style={{overflow:'hidden',paddingBottom:12,marginTop:7}}><div style={{fontStyle:'italic',translate:`0 ${move(s,[t.secondLine,t.secondLine+.38],[115,0])}%`}}>{ru?'Покупать меньше.':'Buy less.'}</div></div>
  </div>
  <div style={{position:'absolute',left:80,right:80,top:1665,textAlign:'center',fontFamily:b.serif,fontStyle:'italic',fontSize:39,opacity:move(s,[t.caption,t.caption+.22],[0,1]),translate:`0 ${move(s,[t.caption,t.caption+.4],[28,0])}px`}}>{ru?'Три образа. Одна капсула.':'Three looks. One capsule.'}</div>
  <div style={{position:'absolute',left:75,right:75,bottom:108,borderTop:`1px solid ${b.line}`,paddingTop:20,display:'flex',justifyContent:'space-between',fontFamily:b.sans,fontSize:19,letterSpacing:2,color:b.muted,zIndex:10}}><span>{ru?'МЕНЬШЕ ВЕЩЕЙ. БОЛЬШЕ СТИЛЯ.':'FEWER PIECES. MORE STYLE.'}</span><span>{ru?'ОСЕННЯЯ КАПСУЛА':'FALL CAPSULE'}</span></div>
 </AbsoluteFill>;
}
