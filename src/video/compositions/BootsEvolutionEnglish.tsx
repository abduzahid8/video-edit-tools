import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EditorialTitle} from './ColorEditorial';
import {bootsEditorialBrand as b, wardrobeBrand as app} from '../theme';
import {bootsEditorialTimeline as t} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const smooth={...clamp,easing:Easing.bezier(.2,1,.3,1)};
const src=(name:string)=>staticFile('assets/boots-selection-v2/'+name);
const MotionRate=createContext(1);
const useSeconds=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps*useContext(MotionRate);};
const m=(s:number,times:number[],values:number[])=>interpolate(s,times,values,smooth);
function Enter({children,at=0,x=0,y=30,style={}}:{children?:React.ReactNode;at?:number;x?:number;y?:number;style?:React.CSSProperties}){const s=useSeconds();return <div style={{...style,opacity:m(s,[at,at+.22],[0,1])*(typeof style.opacity==='number'?style.opacity:1),translate:`${m(s,[at,at+.5],[x,0])}px ${m(s,[at,at+.5],[y,0])}px`}}>{children}</div>;}
function Kicker({children}:{children:React.ReactNode}){return <Enter at={.12} style={{position:'absolute',top:135,left:80,right:80,textAlign:'center',fontSize:23,letterSpacing:4,color:b.muted}}>{children}</Enter>;}
function Copy({children,top=1640,at=.3}:{children:React.ReactNode;top?:number;at?:number}){return <Enter at={at} y={20} style={{position:'absolute',top,left:95,right:95,textAlign:'center',fontFamily:b.serif,fontSize:42,lineHeight:1.25}}>{children}</Enter>;}
function Heading({line,italic,top=255,size=79,at=0}:{line:string;italic?:string;top?:number;size?:number;at?:number}){const s=useSeconds();return <div style={{position:'absolute',left:70,right:70,top,fontFamily:b.serif,fontSize:size,lineHeight:1.08,textAlign:'center',letterSpacing:-1.8,zIndex:5}}>{[line,italic].map((text,i)=>text&&<div key={text} style={{overflow:'hidden',paddingBottom:8}}><div style={{fontStyle:i?'italic':'normal',translate:`0 ${m(s,[at+i*.12,at+.5+i*.12],[105,0])}%`,opacity:m(s,[at+i*.12,at+.22+i*.12],[0,1])}}>{text}</div></div>)}</div>;}
function Product({file,x,y,w,rotate=0,opacity=1}:{file:string;x:number;y:number;w:number;rotate?:number;opacity?:number}){return <div style={{position:'absolute',left:x,top:y,width:w,height:w*.8,rotate:`${rotate}deg`,opacity,transformOrigin:'50% 90%'}}><Img src={src(file)} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'50% 100%',filter:`drop-shadow(${b.figureShadow})`}}/></div>;}
function Card({file,x,y,w,h,rotate=0,reveal=1,zoom=1,fit='cover'}:{file:string;x:number;y:number;w:number;h:number;rotate?:number;reveal?:number;zoom?:number;fit?:'cover'|'contain'}){return <div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',rotate:`${rotate}deg`,background:b.paper,border:`7px solid ${b.paper}`,boxShadow:b.softShadow,clipPath:`inset(0 ${(1-reveal)*100}% 0 0)`}}><Img src={src(file)} style={{width:'100%',height:'100%',objectFit:fit,scale:zoom}}/></div>;}
function Label({children,x,y,width=380,align='left',at=.4}:{children:React.ReactNode;x:number;y:number;width?:number;align?:'left'|'center';at?:number}){return <Enter at={at} style={{position:'absolute',left:x,top:y,width,textAlign:align,fontFamily:b.serif,fontStyle:'italic',fontSize:33,lineHeight:1.2}}>{children}</Enter>;}
function Leader({x,y,tx,ty,at=0,until=20}:{x:number;y:number;tx:number;ty:number;at?:number;until?:number}){const s=useSeconds();const p=m(s,[at,at+.5],[0,1]);return <svg width={1080} height={1920} style={{position:'absolute',inset:0,opacity:m(s,[until,until+.2],[1,0])}}><path d={`M${x},${y} L${x},${y+45} L${tx},${ty}`} stroke={b.ink} strokeWidth={1.5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/><circle cx={tx} cy={ty} r={10} fill={b.paper} stroke={b.ink} opacity={p}/><circle cx={tx} cy={ty} r={2.5} fill={b.ink} opacity={p}/></svg>;}
function Chapter({children,number}:{children:React.ReactNode;number:string}){const s=useSeconds();return <AbsoluteFill style={{opacity:m(s,[0,.12,6.22,6.5],[0,1,1,0])}}><div style={{position:'absolute',left:60,top:455,fontFamily:b.serif,fontSize:420,lineHeight:1,color:b.number,translate:`${m(s,[0,1],[120,0])}px 0`}}>{number}</div>{children}<div style={{position:'absolute',left:90,right:90,top:1820,display:'flex',justifyContent:'space-between',fontSize:19,letterSpacing:3,color:b.muted}}><span>AIWARDROBE / STYLE NOTES</span><span>{number} / 03</span></div><div style={{position:'absolute',left:90,top:1800,width:900*m(s,[0,6.2],[0,1]),height:1,background:b.line}}/></AbsoluteFill>;}
function Opening(){const s=useSeconds();return <AbsoluteFill>
<Heading line="Shoes can change" italic="your whole look." top={250} size={92}/>
<div style={{position:'absolute',top:610,left:0,right:0,fontFamily:b.serif,fontSize:410,textAlign:'center',color:b.number,opacity:m(s,[.2,.7],[0,1])}}>03</div>
{['chelsea-cut.png','wyatt-cut.png','viberg-cut.png'].map((file,i)=><Product key={file} file={file} x={m(s,[i*.14,.65+i*.14,1.75,2.5],[i%2?-800:1150,145+i*70,145+i*70,55+i*330])} y={m(s,[i*.14,.65+i*.14,1.75,2.5],[1150,660+i*210,660+i*210,1030])} w={m(s,[1.75,2.5],[650,310])} rotate={m(s,[i*.14,.8+i*.14,1.75,2.5],[-18+i*14,0,0,0])}/>) }
<Copy top={1500} at={1.65}>Three pairs. <i>Three moods.</i></Copy>
<Enter at={2.1} style={{position:'absolute',left:80,right:80,top:1670,textAlign:'center',fontSize:24,letterSpacing:3}}>EASY / REFINED / EXPRESSIVE</Enter>
</AbsoluteFill>;}
function Everyday(){const s=useSeconds();return <Chapter number="01"><Kicker>MORJAS / BROWN SUEDE CHELSEA</Kicker>
<Heading line="Everyday style." italic="A softer mood."/>
<Card file="chelsea-look.jpg" x={m(s,[0,.65,2.15,2.85,5.1,5.7],[1160,220,220,75,75,-600])} y={m(s,[2.15,2.85],[620,580])} w={m(s,[2.15,2.85],[640,355])} h={m(s,[2.15,2.85],[850,540])} rotate={m(s,[0,.8],[5,0])}/>
<Product file="chelsea-cut.png" x={m(s,[.5,1.15,2.15,2.85,5.1,5.7],[-850,340,340,135,135,460])} y={m(s,[.5,1.15,2.15,2.85,5.1,5.7],[1500,1070,1070,820,820,1130])} w={m(s,[2.15,2.85,5.1,5.7],[650,800,800,520])} rotate={m(s,[.5,1.15],[12,0])}/>
<Enter at={2.8} x={200} style={{position:'absolute',left:m(s,[5.1,5.7],[650,1150]),top:560}}><Card file="chelsea-surface.jpg" x={0} y={0} w={335} h={350} reveal={m(s,[2.8,3.4],[0,1])}/></Enter>
<div style={{opacity:m(s,[5.05,5.4],[1,0])}}><Label x={640} y={955} at={3.1}>soft suede</Label></div><Leader x={685} y={1020} tx={560} ty={1240} at={3.2} until={5.1}/>
<Enter at={3.9} style={{position:'absolute',left:90,top:1460,display:'flex',gap:18,opacity:m(s,[5.1,5.5],[1,0])}}>{[b.suede,b.denim,b.cream].map((color,i)=><div key={color} style={{width:100,height:70,background:color,translate:`0 ${m(s,[3.9+i*.1,4.35+i*.1],[60,0])}px`}}/>)}</Enter>
<Enter at={5.15} x={-400} style={{position:'absolute',left:90,top:595,width:425}}><Card file="chelsea-look.jpg" x={0} y={0} w={425} h={660}/></Enter>
<Copy at={1.25}>{s<3?<>Brown suede + denim.</>:s<5.1?<>Quiet texture.<br/><i>Easy to wear.</i></>:<>Add a light knit —<br/><i>and the look comes together.</i></>}</Copy>
</Chapter>;}
function Occasion(){const s=useSeconds();return <Chapter number="02"><Kicker>SAINT LAURENT / WYATT 40</Kicker>
<div style={{opacity:m(s,[4.9,5.15],[1,0])}}><Heading line="When you want" italic="a sharper look."/></div>
<Card file="wyatt-angle.jpg" x={m(s,[0,.65,1.75,2.45],[1150,150,150,-650])} y={550} w={490} h={850} rotate={m(s,[0,.65],[7,-4])} reveal={m(s,[0,.65],[0,1])}/>
<Card file="wyatt-pair.jpg" x={m(s,[.25,.9,1.75,2.45],[1150,560,560,650])} y={m(s,[1.75,2.45],[690,550])} w={m(s,[1.75,2.45],[430,340])} h={m(s,[1.75,2.45],[720,430])} rotate={m(s,[.25,.9,1.75,2.45],[-8,4,4,0])}/>
<Product file="wyatt-cut.png" x={m(s,[1.4,2.2],[1150,90])} y={m(s,[1.4,2.2],[1240,925])} w={850} rotate={m(s,[1.4,2.2],[-10,0])}/>
<Card file={s<4.2?'wyatt-heel.jpg':'wyatt-toe.jpg'} x={90} y={560} w={400} h={340} reveal={m(s,[2.55,3.1],[0,1])} zoom={m(s,[2.55,3.4],[1.12,1])}/>
<Label x={90} y={930} at={2.85}>{s<4.2?'a neat heel':'a clean toe line'}</Label>
<Leader x={155} y={1010} tx={s<4.2?245:865} ty={s<4.2?1450:1485} at={3.1} until={5.15}/>

<Enter at={5.1} x={1080} style={{position:'absolute',inset:0,background:b.paper}}><Heading line="Extend the line" italic="with dark trousers." top={520} size={75} at={5.2}/><Product file="wyatt-cut.png" x={150} y={850} w={800}/><div style={{position:'absolute',left:185,top:1535,width:m(s,[5.3,6],[0,710]),height:2,background:b.ink}}/></Enter>
<Copy at={1.1}>{s<5.1?<>Smooth leather.<br/><i>A sharper silhouette.</i></>:null}</Copy>
</Chapter>;}
function Character(){const s=useSeconds();return <Chapter number="03"><Kicker>VIBERG / SERVICE BOOT COLOR 8</Kicker>
<div style={{opacity:m(s,[4.65,4.95],[1,0])}}><Heading line="One statement." italic="A different character." size={76}/></div>
<Card file="viberg-detail.jpg" x={m(s,[0,.65,1.7,2.4],[1150,200,200,650])} y={m(s,[1.7,2.4],[590,555])} w={m(s,[1.7,2.4],[680,350])} h={m(s,[1.7,2.4],[820,440])} rotate={m(s,[0,.65],[-8,0])} fit="contain"/>
<Product file="viberg-cut.png" x={m(s,[1.1,1.8],[1150,75])} y={m(s,[1.1,1.8],[1310,875])} w={820} rotate={m(s,[1.1,1.8],[-12,0])}/>
<Card file="viberg-angle.jpg" x={m(s,[2.5,3.1],[-500,80])} y={560} w={400} h={400} reveal={m(s,[2.5,3.1],[0,1])}/>
<Label x={85} y={985} width={550} at={3}>burgundy over black</Label><Leader x={135} y={1050} tx={440} ty={1320} at={3.2} until={4.7}/>
<Enter at={3.8} style={{position:'absolute',left:90,top:1540,display:'flex',gap:18,opacity:m(s,[4.8,5.1],[1,0])}}>{[b.oxblood,b.cream,b.ink].map((color,i)=><div key={color} style={{width:105,height:65,background:color,scale:m(s,[3.8+i*.1,4.25+i*.1],[.1,1])}}/>)}</Enter>
<Enter at={4.85} x={1050} style={{position:'absolute',inset:0,background:b.paper}}><Heading line="Colour in the shoes." italic="Keep the rest quiet." top={500} size={78} at={4.95}/><Card file="viberg-look.jpg" x={85} y={850} w={430} h={600} rotate={-3}/><Product file="viberg-cut.png" x={480} y={1120} w={540}/><div style={{position:'absolute',left:595,top:940,width:300,height:90,display:'flex',gap:12}}>{[b.cream,b.oxblood,b.ink].map(c=><div key={c} style={{width:80,height:80,background:c}}/>)}</div></Enter>
<Copy at={1.5}>{s<4.85?<>Let one detail<br/><i>set the mood.</i></>:null}</Copy>
</Chapter>;}
function Comparison(){const s=useSeconds();return <AbsoluteFill><Heading line="Choose a mood," italic="not just another pair." top={260} size={73}/>{['chelsea-cut.png','wyatt-cut.png','viberg-cut.png'].map((file,i)=><Product key={file} file={file} x={m(s,[0,.55],[1150,55+i*330])} y={850} w={310} rotate={m(s,[i*.12,.6+i*.12],[-10,0])}/>)}<Enter at={.45} style={{position:'absolute',left:80,right:80,top:1225,display:'flex',justifyContent:'space-between',fontFamily:b.serif,fontStyle:'italic',fontSize:34}}><span>Relaxed</span><span>Refined</span><span>Expressive</span></Enter><Enter at={1.2} style={{position:'absolute',left:m(s,[1.2,2.25],[65,395]),top:1150,width:290,height:1,background:b.accent}}/><Copy top={1540} at={1.3}>Now,<br/><i>build the complete look.</i></Copy></AbsoluteFill>;}
function AppScene(){
 const s=useSeconds();const {fps}=useVideoConfig();
 const step=s<t.app.create.from?0:s<t.app.result.from?1:2;
 const titles=[['Choose a category.','Set your style.'],['Create your outfit.','With one tap.'],['Your outfit is ready.','A complete look.']];
 return <>
 <div key={step}><Heading line={titles[step][0]} italic={titles[step][1]} at={step===0?t.app.category.from:step===1?t.app.create.from:t.app.result.from} top={165} size={75}/></div>
 <div style={{position:'absolute',left:260,top:425,width:560,height:1215,borderRadius:58,background:app.foreground,border:`2px solid ${b.paleLine}`,overflow:'hidden',boxShadow:b.softShadow,translate:`0 ${m(s,[0,.55],[80,0])}px`}}>
 <div style={{position:'absolute',inset:9,borderRadius:48,overflow:'hidden'}}>
 <Sequence name="Category and style — real taps" from={Math.round(t.app.category.from*fps)} durationInFrames={Math.round(t.app.category.seconds*fps)}>
 <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} trimBefore={Math.round(t.app.category.source*fps)} playbackRate={t.app.category.rate} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 </Sequence>
 <Sequence name="Create — tap and generation" from={Math.round(t.app.create.from*fps)} durationInFrames={Math.round(t.app.create.seconds*fps)}>
 <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} trimBefore={Math.round(t.app.create.source*fps)} playbackRate={t.app.create.rate} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 </Sequence>
 <Sequence name="Result — completed outfit" from={Math.round(t.app.result.from*fps)} durationInFrames={Math.round(t.app.result.seconds*fps)}>
 <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} trimBefore={Math.round(t.app.result.source*fps)} playbackRate={t.app.result.rate} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 </Sequence>
 </div></div>
 <div style={{position:'absolute',left:90,right:90,top:1710,display:'flex',justifyContent:'space-between',gap:20,fontSize:27}}>{['01 Category','02 Create','03 Outfit'].map((label,i)=><span key={label} style={{color:step===i?app.accent:b.muted,fontWeight:step===i?700:400,paddingBottom:16,borderBottom:step===i?`2px solid ${app.accent}`:'2px solid transparent'}}>{label}</span>)}</div>
 <div style={{position:'absolute',top:1820,left:80,right:80,textAlign:'center',fontSize:29,fontWeight:600,color:app.accent}}>AIWardrobe <span style={{fontWeight:400,color:b.muted}}>/ your AI stylist</span></div>
 </>;
}
function CTA(){const s=useSeconds();return <><Kicker>STYLE STARTS WITH YOU</Kicker><EditorialTitle top={320} size={84}>Create<br/><i>your first look.</i></EditorialTitle><Enter at={.2} style={{position:'absolute',left:80,right:80,top:800,textAlign:'center',fontSize:110,fontWeight:800,letterSpacing:-6}}>AIWardrobe<span style={{color:app.accent}}>✦</span></Enter><Enter at={.5} y={65} style={{position:'absolute',left:125,right:125,top:1090,height:145,borderRadius:75,display:'flex',alignItems:'center',justifyContent:'center',gap:25,background:app.accent,color:b.paper,fontSize:36}}>Try AIWardrobe <span style={{translate:`${interpolate(s,[.7,1.3],[0,18],smooth)}px 0`}}>→</span></Enter><Copy top={1360} at={.8}>Your occasion. Your style.<br/><i>A complete outfit.</i></Copy><Enter at={1} style={{position:'absolute',left:0,right:0,top:1650,textAlign:'center',fontFamily:b.serif,fontSize:35,fontStyle:'italic',color:app.accent}}>Start with one detail.</Enter></>;}
export function BootsEvolutionEnglish(){const {fps}=useVideoConfig();return <AbsoluteFill style={{background:b.paper,color:b.ink,fontFamily:b.sans,overflow:'hidden'}}>
<Audio src={staticFile('assets/boots-selection-v2/editorial-motion-short-flow.wav')} volume={.8}/>
<Sequence name="Hook — footwear changes the look" from={Math.round(t.opening.from*fps)} durationInFrames={Math.round(t.opening.seconds*fps)}><MotionRate.Provider value={t.opening.motionRate}><Opening/></MotionRate.Provider></Sequence>
<Sequence name="MORJAS — suede and styling" from={Math.round(t.everyday.from*fps)} durationInFrames={Math.round(t.everyday.seconds*fps)}><MotionRate.Provider value={t.everyday.motionRate}><Everyday/></MotionRate.Provider></Sequence>
<Sequence name="Wyatt — shape and proportion" from={Math.round(t.occasion.from*fps)} durationInFrames={Math.round(t.occasion.seconds*fps)}><MotionRate.Provider value={t.occasion.motionRate}><Occasion/></MotionRate.Provider></Sequence>
<Sequence name="Viberg — a colour statement" from={Math.round(t.character.from*fps)} durationInFrames={Math.round(t.character.seconds*fps)}><MotionRate.Provider value={t.character.motionRate}><Character/></MotionRate.Provider></Sequence>
<Sequence name="Choose your mood" from={Math.round(t.compare.from*fps)} durationInFrames={Math.round(t.compare.seconds*fps)}><MotionRate.Provider value={t.compare.motionRate}><Comparison/></MotionRate.Provider></Sequence>
<Sequence name="Build your outfit in AIWardrobe" from={Math.round(t.app.from*fps)} durationInFrames={Math.round(t.app.seconds*fps)}><AppScene/></Sequence>
<Sequence name="Create your first look" from={Math.round(t.cta.from*fps)} durationInFrames={Math.round(t.cta.seconds*fps)}><CTA/></Sequence>
</AbsoluteFill>;}
