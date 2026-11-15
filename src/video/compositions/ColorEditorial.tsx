import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colorEditorialBrand as b, founderEditorialPalette as c, wardrobeBrand as app, wardrobeGraphics as g} from '../theme';
import {colorEditorialTimeline as t, founderAppFlow as flow} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.16,1,.3,1)};
const asset=(s:string)=>staticFile(`assets/color-editorial/${s}`);

// All timing is local to the owning shot. No browser-time animation.
const Title=({children,top=210,size=72}:{children:React.ReactNode;top?:number;size?:number})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',top,left:55,right:55,textAlign:'center',fontFamily:b.serif,fontSize:size,lineHeight:1.07,letterSpacing:-1.8,zIndex:5,translate:`0 ${interpolate(f,[0,.32*fps],[25,0],ease)}px`,opacity:interpolate(f,[0,.14*fps],[0,1],clamp)}}>{children}</div>;
};
const Cut=({file,x,h,bottom=0,delay=0,gray=false,flip=false,enter=100}:{file:string;x:number;h:number;bottom?:number;delay?:number;gray?:boolean;flip?:boolean;enter?:number})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <Img src={asset(file)} style={{position:'absolute',left:x,bottom,height:h,width:'auto',maxWidth:'none',filter:gray?'grayscale(1)':undefined,transform:flip?'scaleX(-1)':undefined,translate:`${interpolate(f,[delay*fps,(delay+.42)*fps],[enter,0],ease)}px ${interpolate(f,[delay*fps,(delay+.46)*fps],[60,0],ease)}px`,opacity:interpolate(f,[delay*fps,(delay+.13)*fps],[0,1],clamp)}}/>;
};
const Frame=({file,x,y,w,h,delay=0,position='50% 50%',scale=1}:{file:string;x:number;y:number;w:number;h:number;delay?:number;position?:string;scale?:number})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',background:b.frame,translate:`${interpolate(f,[delay*fps,(delay+.45)*fps],[90,0],ease)}px 0`,opacity:interpolate(f,[delay*fps,(delay+.12)*fps],[0,1],clamp)}}><Img src={asset(file)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:position,scale:interpolate(f,[0,4*fps],[scale,scale+.06],clamp)}}/></div>;
};
const Pointer=({label,x,y,px,py,delay=.5}:{label:string;x:number;y:number;px:number;py:number;delay?:number})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const p=interpolate(f,[delay*fps,(delay+.46)*fps],[0,1],ease);
 return <><svg width={1080} height={1920} style={{position:'absolute',inset:0,zIndex:4,opacity:p}}><path d={`M${x+70} ${y+65} L${px} ${py}`} stroke={b.ink} strokeWidth={1.5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/><circle cx={px} cy={py} r={11} stroke={b.ink} strokeWidth={1.5} fill="white"/><circle cx={px} cy={py} r={3} fill={b.ink}/></svg><div style={{position:'absolute',left:x,top:y,fontFamily:b.serif,fontSize:33,fontStyle:'italic',zIndex:5,opacity:p,background:b.paper,padding:'5px 10px'}}>{label}</div></>;
};
const Swatch=({color,x,y,w=100,label,delay=0}:{color:string;x:number;y:number;w?:number;label?:string;delay?:number})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:x,top:y,width:w,opacity:interpolate(f,[delay*fps,(delay+.22)*fps],[0,1],clamp),translate:`0 ${interpolate(f,[delay*fps,(delay+.45)*fps],[35,0],ease)}px`}}><div style={{height:w*.75,background:color,border:'1px solid #00000008'}}/>{label&&<div style={{marginTop:16,fontSize:23,textAlign:'center',whiteSpace:'nowrap',color:b.muted}}>{label}</div>}</div>;
};
const FounderName=({name,company,x=70,y=1660}:{name:string;company:string;x?:number;y?:number})=><div style={{position:'absolute',left:x,top:y,zIndex:6,padding:'12px 18px',background:b.paper}}><div style={{fontSize:29,fontFamily:b.serif}}>{name}</div><div style={{fontSize:18,letterSpacing:3,marginTop:8,color:b.muted}}>{company}</div></div>;
const Hook=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <><Title size={76}>The style of those<br/><i>who change the world.</i></Title><div style={{position:'absolute',inset:0,scale:interpolate(f,[0,3*fps],[1,1.035],clamp),transformOrigin:'50% 100%'}}><Cut file="founders/elegant/jobs-clean.png" x={-250} h={1370} bottom={-80} gray enter={-170}/><Cut file="founders/elegant/huang-portrait-clean.png" x={360} h={1330} bottom={-110} delay={.1} enter={180}/></div></>;
};
const Montage=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const photos=[['founders/elegant/jobs.jpg','STEVE JOBS'],['founders/elegant/huang-portrait.jpg','JENSEN HUANG'],['founders/elegant/durov-portrait.jpg','PAVEL DUROV'],['founders/elegant/jobs.jpg','ARCHIVE / 1984']];
 return <><Title size={68}>Three founders.<br/><i>Three signature styles.</i></Title><div style={{position:'absolute',left:0,top:560,display:'flex',gap:24,translate:`${interpolate(f,[0,.25*fps,.45*fps,.7*fps,1*fps,1.25*fps],[140,0,0,-330,-330,-670],ease)}px 0`}}>{photos.map(([file,name],i)=><div key={i} style={{width:470,height:850,flexShrink:0,position:'relative',overflow:'hidden'}}><Img src={asset(file)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:i===2?'50% 0%':'50% 40%'}}/><div style={{position:'absolute',bottom:0,left:0,right:0,background:b.paper,paddingTop:20,fontSize:21,letterSpacing:2}}>0{i+1} / {name}</div></div>)}</div><div style={{position:'absolute',top:1550,left:0,right:0,textAlign:'center',fontFamily:b.serif,fontSize:44,fontStyle:'italic'}}>Shape. Texture. A personal detail.</div></>;
};
const Base=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <><Title size={66}>Pavel Durov<br/><i>All black.</i></Title><Frame file="founders/elegant/durov-portrait.jpg" x={480} y={530} w={600} h={1350} position="50% 0%"/><div style={{position:'absolute',left:80,top:1000,fontFamily:b.serif,fontSize:180,color:c.charcoal,opacity:interpolate(f,[.3*fps,.7*fps],[0,1],clamp)}}>01</div><Pointer label="suit + shirt" x={70} y={1230} px={850} py={1280}/><Swatch color={c.black} x={100} y={1480} w={120} delay={.75}/><FounderName name="A sharp silhouette" company="PAVEL DUROV / TELEGRAM"/></>;
};
const Support=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <><Title size={63}>Steve Jobs<br/><i>Classic. With a twist.</i></Title><div style={{position:'absolute',inset:0,scale:interpolate(f,[0,.65*fps,3.5*fps],[.88,1,1.04],ease),transformOrigin:'62% 75%'}}><Cut file="founders/elegant/jobs-clean.png" x={180} h={1410} bottom={-140} enter={0}/></div><Pointer label="fine pinstripes" x={70} y={650} px={430} py={1450} delay={.7}/><Swatch color={b.navy} x={80} y={1500} w={100} delay={.2}/><Swatch color={b.burgundy} x={200} y={1500} w={100} delay={.55}/><FounderName name="Archive portrait" company="STEVE JOBS / 1984" y={1740}/></>;
};
const Accent=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <><Title size={65}>Jensen Huang<br/><i>Texture adds character.</i></Title><Cut file="founders/elegant/huang-portrait-clean.png" x={240} h={1290} bottom={-80} enter={150}/><Pointer label="distinctive texture" x={60} y={590} px={580} py={1370} delay={.25}/><FounderName name="Understated details" company="JENSEN HUANG / NVIDIA" x={60} y={1740}/></>;
};
const Fourth=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <><Title top={220} size={69}>Shape. Texture. Detail.<br/><i>That is personal style.</i></Title><div style={{position:'absolute',left:100,top:610,width:880,height:720,overflow:'hidden'}}><Img src={asset('founders/elegant/tailoring-detail.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',scale:interpolate(f,[0,2.5*fps],[1,1.06],clamp)}}/></div><Pointer label="pinstripes + tie" x={300} y={1430} px={530} py={900} delay={.35}/><Swatch color={b.navy} x={400} y={1600} w={110} delay={.65}/><Swatch color={b.burgundy} x={570} y={1600} w={110} delay={.9}/></>;
};
const Palette=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const pieces=['polo','coat','trousers','shoes'];
 return <><Title top={190} size={80}>Now find<br/><i>your own formula.</i></Title><div style={{position:'absolute',top:510,left:0,right:0,textAlign:'center',fontSize:25,letterSpacing:3,color:app.accent}}>AIWARDROBE</div>{pieces.map((piece,i)=><div key={piece} style={{position:'absolute',left:220+(i%2)*350,top:690+Math.floor(i/2)*360,width:290,height:330,overflow:'hidden',background:b.paper,boxShadow:g.shadow,rotate:`${i%2?5:-5}deg`,opacity:interpolate(f,[(.15+i*.12)*fps,(.4+i*.12)*fps],[0,1],clamp),translate:`${interpolate(f,[(.15+i*.12)*fps,(.8+i*.12)*fps],[(i%2?1:-1)*260,0],ease)}px ${interpolate(f,[(.15+i*.12)*fps,(.8+i*.12)*fps],[90,0],ease)}px`}}><Img src={staticFile(`assets/aiwardrobe/${piece}.png`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}<div style={{position:'absolute',top:1570,left:80,right:80,textAlign:'center',fontFamily:b.serif,fontSize:42,lineHeight:1.3,opacity:interpolate(f,[.8*fps,1.2*fps],[0,1],clamp)}}>Your occasion. Your character.<br/><i>Your day.</i></div></>;
};
const AppPhone=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:330,top:500,width:520,height:1127,background:app.foreground,border:`3px solid ${g.line}`,borderRadius:58,boxShadow:g.shadow,overflow:'hidden',translate:`${interpolate(f,[0,.65*fps],[130,0],ease)}px ${interpolate(f,[0,.65*fps],[90,0],ease)}px`,scale:interpolate(f,[0,.5*fps,(flow.result.from+flow.result.seconds)*fps],[.91,1,1.025],ease),transformOrigin:'50% 70%'}}><div style={{position:'absolute',inset:9,borderRadius:47,overflow:'hidden'}}>
  <Sequence name="Real app — style selection" durationInFrames={flow.selection.seconds*fps}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} muted trimBefore={Math.round(flow.selection.source*fps)} playbackRate={flow.selection.rate} style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>
  <Sequence name="Real app — complete outfit" from={flow.result.from*fps} durationInFrames={flow.result.seconds*fps}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} muted trimBefore={Math.round(flow.result.source*fps)} playbackRate={flow.result.rate} style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>
 </div></div>;
};
const Looks=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <><Title top={185} size={73}>{f<flow.result.from*fps?<>Choose the occasion.<br/><i>Make it your style.</i></>:<>Get a complete look.<br/><i>Ready for your day.</i></>}</Title><AppPhone/><div style={{position:'absolute',left:70,top:850,width:210,fontFamily:b.serif,fontSize:37,lineHeight:1.25,color:app.accent}}>{f<flow.result.from*fps?<>01<br/><i>Occasion<br/>& style.</i></>:<>02<br/><i>One<br/>full look.</i></>}</div><div style={{position:'absolute',left:80,right:80,top:1730,textAlign:'center',fontSize:35,fontWeight:600,color:app.accent}}>AIWardrobe<span style={{fontWeight:400,color:b.muted}}> / your AI stylist</span></div></>;
};
const Outro=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <><div style={{position:'absolute',top:170,left:0,right:0,textAlign:'center',fontSize:23,letterSpacing:4,color:app.muted,opacity:interpolate(f,[0,.3*fps],[0,1],clamp)}}>STYLE STARTS WITH YOU</div><Title top={340} size={82}>Create<br/><i>your first look.</i></Title><div style={{position:'absolute',top:800,left:0,right:0,textAlign:'center',fontSize:112,fontWeight:800,letterSpacing:-7,color:app.foreground,opacity:interpolate(f,[.15*fps,.5*fps],[0,1],clamp),scale:interpolate(f,[.15*fps,.7*fps],[.88,1],ease)}}>AIWardrobe<span style={{color:app.accent,marginLeft:7}}>✦</span></div><div style={{position:'absolute',left:140,right:140,top:1090,height:140,borderRadius:70,background:app.accent,color:b.paper,display:'flex',alignItems:'center',justifyContent:'center',gap:25,fontSize:40,fontWeight:500,opacity:interpolate(f,[.45*fps,.8*fps],[0,1],clamp),translate:`0 ${interpolate(f,[.45*fps,1*fps],[45,0],ease)}px`}}>Try AIWardrobe <span style={{fontSize:53}}>→</span></div><div style={{position:'absolute',top:1340,left:100,right:100,textAlign:'center',fontSize:33,lineHeight:1.5,color:b.muted,opacity:interpolate(f,[.65*fps,1*fps],[0,1],clamp)}}>Choose the occasion. Define your style.<br/>Get a complete look.</div><div style={{position:'absolute',top:1610,left:0,right:0,textAlign:'center',fontFamily:b.serif,fontStyle:'italic',fontSize:39,color:app.accent,opacity:interpolate(f,[.9*fps,1.3*fps],[0,1],clamp)}}>Create your look with AIWardrobe.</div></>;
};
export const ColorEditorial=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:b.paper,color:b.ink,fontFamily:b.sans,overflow:'hidden'}}>
  <Audio src={asset('founder-audio-hook.wav')} volume={.7}/>
  <Sequence name="The style of founders" from={t.hook.from*fps} durationInFrames={t.hook.seconds*fps}><Hook/></Sequence>
  <Sequence name="Founder photo montage" from={t.montage.from*fps} durationInFrames={t.montage.seconds*fps}><Montage/></Sequence>
  <Sequence name="Durov — all black" from={t.base.from*fps} durationInFrames={t.base.seconds*fps}><Base/></Sequence>
  <Sequence name="Jobs — classic tailoring" from={t.support.from*fps} durationInFrames={t.support.seconds*fps}><Support/></Sequence>
  <Sequence name="Huang — texture" from={t.accent.from*fps} durationInFrames={t.accent.seconds*fps}><Accent/></Sequence>
  <Sequence name="The personal style takeaway" from={t.fourth.from*fps} durationInFrames={t.fourth.seconds*fps}><Fourth/></Sequence>
  <Sequence name="Your own formula" from={t.palette.from*fps} durationInFrames={t.palette.seconds*fps}><Palette/></Sequence>
  <Sequence name="AIWardrobe — choose and create" from={t.looks.from*fps} durationInFrames={t.looks.seconds*fps}><Looks/></Sequence>
  <Sequence name="CTA — try AIWardrobe" from={t.outro.from*fps} durationInFrames={t.outro.seconds*fps}><Outro/></Sequence>
 </AbsoluteFill>;
};

export {Title as EditorialTitle, Outro as AIWardrobeEditorialCTA};
