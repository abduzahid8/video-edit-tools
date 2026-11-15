import React, {type CSSProperties} from 'react';
import {AbsoluteFill, Audio, CanvasImage, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {premiumWardrobeBrand as B} from '../theme';
import {premiumWardrobeTimeline as T} from '../timeline';

loadFont({family: 'Premium Cormorant', url: staticFile('assets/premium-v2/fonts/CormorantGaramond-Regular.ttf'), weight: '400'});
type Lang = 'en' | 'ru';
type Localized = {lang: Lang};
const asset = (name: string) => staticFile(`assets/premium-v2/${name}`);
const photo = (name: string) => asset(`selected/${name}.jpg`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(.18,.85,.22,1);
const go = (t: number, start: number, end: number, a = 0, b = 1) => interpolate(t,[start,end],[a,b],{...clamp,easing:ease});
const text: CSSProperties = {fontFamily:B.serif,fontWeight:400,lineHeight:.91,letterSpacing:-3};
const label: CSSProperties = {fontFamily:B.sans,fontSize:27,letterSpacing:4,textTransform:'uppercase'};

const Paper = ({dark = false}: {dark?: boolean}) => <AbsoluteFill style={{background:dark?B.ink:B.paper}}>
  <AbsoluteFill style={{backgroundImage:`url(${asset('paper.jpg')})`,backgroundSize:'700px 700px',opacity:dark?.045:.52,mixBlendMode:dark?'screen':'multiply'}}/>
</AbsoluteFill>;

const Folio = ({number, dark=false}: {number:string;dark?:boolean}) => <>
  <div style={{position:'absolute',left:88,right:88,top:100,display:'flex',justifyContent:'space-between',color:dark?B.paper:B.ink,...label,fontSize:24,letterSpacing:3}}><span>AIWARDROBE</span><span>{number} / 07</span></div>
  <div style={{position:'absolute',left:88,right:88,bottom:98,height:1,background:dark?'#74766a':B.line}}/>
</>;

const Page = ({children,dark=false,direction='right'}: {children:React.ReactNode;dark?:boolean;direction?:'right'|'bottom'|'left'}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();const p=go(f/fps,0,.42);
  const clip=direction==='bottom'?`inset(${100-p*100}% 0 0 0)`:direction==='left'?`inset(0 ${100-p*100}% 0 0)`:`inset(0 0 0 ${100-p*100}%)`;
  return <AbsoluteFill style={{clipPath:clip,color:dark?B.paper:B.ink,overflow:'hidden'}}><Paper dark={dark}/>{children}</AbsoluteFill>;
};

const Photo = ({name,style,position='50% 50%',imageStyle}: {name:string;style:CSSProperties;position?:string;imageStyle?:CSSProperties}) => <div style={{position:'absolute',overflow:'hidden',...style}}>
  <CanvasImage src={photo(name)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:position,...imageStyle}}/>
</div>;
const Figure = ({name,style}: {name:string;style:CSSProperties}) => <CanvasImage src={asset(`selected/${name}-cutout.png`)} style={{position:'absolute',objectFit:'contain',...style}}/>;

const Title = ({lines,top=220,left=88,size=114,width=910,delay=.25,color=B.ink}: {lines:string[];top?:number;left?:number;size?:number;width?:number;delay?:number;color?:string}) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;
 return <div style={{position:'absolute',left,top,width,color,...text,fontSize:size}}>{lines.map((line,i)=><div key={line} style={{overflow:'hidden',paddingBottom:12,marginBottom:-5}}><div style={{transform:`translateY(${go(s,delay+i*.13,delay+.6+i*.13,110,0)}%)`}}>{line}</div></div>)}</div>;
};

const OpeningLayers = ({lang}:Localized) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;
 const gather=go(s,.34,1.8);const second=go(s,.42,1.08);const third=go(s,.87,1.48);
 return <AbsoluteFill style={{background:B.paper,overflow:'hidden',perspective:1500}}>
  <Paper/>
  {/* The first frame already has a photographic subject; the camera becomes a page. */}
  <Photo name="tailoring-detail" position="50% 47%" style={{left:go(s,.32,1.75,0,66),top:go(s,.32,1.75,0,560),width:go(s,.32,1.75,1080,425),height:go(s,.32,1.75,1920,1165),transform:`rotate(${gather*-6}deg) rotateY(${gather*7}deg)`,boxShadow:B.shadow}}/>
  <Photo name="knit" position="47% 45%" style={{left:go(s,.42,1.5,920,386),top:go(s,.42,1.5,360,700),width:410,height:1040,clipPath:`inset(0 0 ${100-second*100}% 0)`,transform:`rotate(${go(s,.42,1.5,15,4)}deg)`,boxShadow:B.shadow}}/>
  <Photo name="evening" position="49% 35%" style={{left:go(s,.88,1.55,1160,717),top:go(s,.88,1.55,1040,530),width:408,height:1160,clipPath:`inset(${100-third*100}% 0 0 0)`,transform:`rotate(${go(s,.88,1.65,-15,7)}deg)`,boxShadow:B.shadow}}/>
  <div style={{position:'absolute',left:0,right:0,top:0,height:610,background:`linear-gradient(${B.paper} 0%, ${B.paper} 79%, transparent)`,opacity:go(s,.45,1.35)}}/>
  <div style={{position:'absolute',left:88,top:98,...label,fontSize:23,opacity:go(s,.55,1)}}>AIWARDROBE / {lang==='en'?'THE CONSIDERED WARDROBE':'ОСОЗНАННЫЙ ГАРДЕРОБ'}</div>
  <div style={{position:'absolute',left:88,top:218,width:940,...text,fontSize:lang==='en'?146:127,opacity:go(s,.45,.85)}}>
   <div style={{clipPath:`inset(0 ${100-go(s,.46,1.05)*100}% 0 0)`}}>{lang==='en'?'True style.':'Больше стиля.'}</div>
   <div style={{paddingLeft:lang==='en'?83:0,clipPath:`inset(0 ${100-go(s,.69,1.29)*100}% 0 0)`}}>{lang==='en'?'Fewer pieces.':'Меньше вещей.'}</div>
  </div>
  <div style={{position:'absolute',left:88,bottom:125,right:88,display:'flex',justifyContent:'space-between',...label,fontSize:24,opacity:go(s,1.6,2.1)}}><span>{lang==='en'?'THREE LOOKS. ONE POINT OF VIEW.':'ТРИ ОБРАЗА. ОДИН ВЗГЛЯД.'}</span><span>01</span></div>
 </AbsoluteFill>;
};
const Opening = ({lang}:Localized) => <CameraMotionBlur samples={3} shutterAngle={140}><OpeningLayers lang={lang}/></CameraMotionBlur>;

const Idea = ({lang}:Localized) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;const refine=go(s,2.3,3.4);
 return <Page direction="bottom"><Folio number="02"/>
  <div style={{opacity:1-refine}}><Title lines={lang==='en'?["Style isn't about",'owning more.']:['Стиль — это','не больше вещей.']} size={lang==='en'?120:114}/></div>
  <div style={{opacity:refine}}><Title lines={lang==='en'?['It’s knowing','what works.']:['Это умение','сочетать.']} delay={2.35} size={135}/></div>
  {(['tailoring','knit','evening'] as const).map((n,i)=><Photo key={n} name={n} position={i===0?'48% 40%':i===1?'46% 48%':'50% 40%'} style={{left:go(s,.4+i*.11,1.25+i*.11,[-240,390,1040][i],[80,372,664][i])+refine*[25,-12,-48][i],top:go(s,.4+i*.11,1.25+i*.11,[970,700,1100][i],[690,800,720][i])+refine*[-20,-150,20][i],width:345+refine*20,height:870,transform:`rotate(${go(s,.4,1.5,[-16,18,12][i],[-6,4,8][i])+refine*[5,-5,-7][i]}deg)`,boxShadow:B.shadow,imageRendering:'auto'}}/>)}
  <div style={{position:'absolute',left:88,bottom:176,...label,fontSize:lang==='en'?33:30,letterSpacing:2}}>{lang==='en'?'Choose with intention.':'Выбирай осознанно.'}</div>
 </Page>;
};

const Tailoring = ({lang}:Localized) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;const detail=go(s,1.5,2.28);
 return <Page direction="left"><Folio number="03"/>
  <div style={{position:'absolute',left:62,top:460,fontFamily:B.serif,fontSize:380,color:B.paperDeep,lineHeight:1}}>01</div>
  <Title lines={lang==='en'?['Soft tailoring.']:['Мягкий силуэт.']} size={lang==='en'?126:112} top={220}/>
  <Photo name="tailoring-detail" position="48% 70%" imageStyle={{transform:'scale(2.6)',transformOrigin:'48% 73%'}} style={{left:go(s,.12,.95,1080,322),top:478,width:680,height:1110,transform:`rotate(${go(s,.15,1.2,9,1.7)}deg)`,boxShadow:B.shadow}}/>
  <Figure name="tailoring" style={{left:go(s,.4,1.3,-270,118),top:620,width:620,height:1035,filter:'drop-shadow(9px 16px 16px rgba(30,28,20,.12))'}}/>
  <Photo name="piece-blazer" position="25% 60%" imageStyle={{transform:'scale(1.7)',transformOrigin:'25% 65%'}} style={{left:go(s,1.5,2.28,-510,83),top:1135,width:310,height:350,clipPath:`inset(0 ${100-detail*100}% 0 0)`,border:`10px solid ${B.light}`,boxShadow:B.shadow}}/>
  <div style={{position:'absolute',left:88,bottom:186,...label,fontSize:31,letterSpacing:2}}>{lang==='en'?'SAND / TEXTURE / EASE':'ПЕСОЧНЫЙ / ФАКТУРА / СВОБОДА'}</div>
  <div style={{position:'absolute',left:89,top:437,fontFamily:B.sans,fontSize:25,letterSpacing:3,color:B.muted}}>{lang==='en'?'LOOK 01':'ОБРАЗ 01'}</div>
 </Page>;
};

const Knit = ({lang}:Localized) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;const split=go(s,.35,1.25);
 return <Page direction="bottom"><Folio number="04"/>
  <div style={{position:'absolute',left:88,top:255,...label,color:B.muted}}>{lang==='en'?'LOOK 02 / QUIET LUXURY':'ОБРАЗ 02 / ТИХАЯ РОСКОШЬ'}</div>
  <Photo name="knit" position="46% 46%" style={{left:90,top:370,width:900,height:1110,clipPath:`inset(0 ${100-split*100}% 0 0)`}}/>
  {/* A moving photographic shutter isolates the real knit texture. */}
  <Photo name="knit" position="53% 57%" imageStyle={{transform:'scale(2.7)',transformOrigin:'52% 58%'}} style={{left:go(s,1.5,2.4,1100,670),top:go(s,1.5,2.4,380,430),width:335,height:512,border:`9px solid ${B.light}`,transform:`rotate(${go(s,1.5,2.4,12,5)}deg)`,boxShadow:B.shadow}}/>
  <div style={{position:'absolute',left:0,top:1370,width:1080,height:550,background:B.paper,transform:`translateY(${go(s,.9,1.7,500,0)}px)`}}/>
  <Title lines={lang==='en'?['Let texture','do the talking.']:['Выразительность','в фактуре.']} top={1455} size={lang==='en'?118:99} delay={1}/>
  <div style={{position:'absolute',left:88,top:1160,color:B.light,...label,fontSize:28,letterSpacing:3,background:'rgba(36,37,31,.75)',padding:'18px 22px',opacity:go(s,2.2,2.7)}}>{lang==='en'?'TONAL. TACTILE. TIMELESS.':'ТОН. ФАКТУРА. ВНЕ ВРЕМЕНИ.'}</div>
 </Page>;
};

const Evening = ({lang}:Localized) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;
 return <Page dark direction="right"><Folio number="05" dark/>
  <div style={{position:'absolute',left:76,top:395,color:'#49483d',fontFamily:B.serif,fontSize:410,lineHeight:1}}>03</div>
  <Photo name="evening" position="50% 73%" imageStyle={{transform:'scale(2.8)',transformOrigin:'50% 73%'}} style={{left:go(s,.14,1.1,1080,294),top:350,width:786,height:1290,transform:`perspective(1400px) rotateY(${go(s,.14,1.1,-33,0)}deg)`,transformOrigin:'right center'}}/>
  <Figure name="evening" style={{left:go(s,.48,1.5,200,70),top:560,width:840,height:1194,filter:'drop-shadow(15px 24px 24px rgba(0,0,0,.35))'}}/>
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:460,background:`linear-gradient(transparent,${B.ink} 67%)`}}/>
  <Title lines={lang==='en'?['After dark.']:['После заката.']} top={1472} size={lang==='en'?156:126} color={B.paper} delay={.7}/>
  <div style={{position:'absolute',left:88,top:1702,...label,fontSize:30,letterSpacing:2,color:B.paper,opacity:go(s,1.4,2)}}>{lang==='en'?'DARK TAILORING. QUIET CONFIDENCE.':'ТЁМНЫЙ КОСТЮМ. УВЕРЕННОСТЬ.'}</div>
 </Page>;
};

type Piece = {image:string; title:string; ru:string};
const pieces: Piece[] = [
 {image:'piece-knit',title:'TEXTURED KNIT',ru:'ФАКТУРНЫЙ ТРИКОТАЖ'},
 {image:'piece-blazer',title:'SAND BLAZER',ru:'ПЕСОЧНЫЙ ПИДЖАК'},
 {image:'piece-white',title:'WHITE TROUSERS',ru:'БЕЛЫЕ БРЮКИ'},
 {image:'piece-dark',title:'DARK TROUSERS',ru:'ТЁМНЫЕ БРЮКИ'},
];
const Wardrobe = ({lang}:Localized) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;const pair=go(s,2.3,3.3);const alt=go(s,4.15,4.65);
 return <Page direction="left"><Folio number="06"/>
  <Title lines={lang==='en'?['Fewer pieces.','More possibilities.']:['Меньше вещей.','Больше сочетаний.']} size={lang==='en'?112:104} top={225}/>
  {pieces.map((p,i)=>{
   const x=[88,562,88,562][i],y=[650,650,1150,1150][i];
   const px=[100,570,100,570][i],py=[690,690,1195,1195][i];
   return <div key={p.title} style={{position:'absolute',left:x+(px-x)*pair+(i===2?470*alt:i===3?-470*alt:0),top:y+(py-y)*pair+(i>1?Math.sin(alt*Math.PI)*(i===2?-135:135):0),width:430,height:430,transform:`perspective(1400px) rotateY(${Math.sin(alt*Math.PI)*(i%2?15:-15)}deg) rotate(${go(s,.25+i*.1,.9+i*.1,[8,-9,-7,10][i],0)}deg)`,boxShadow:'0 12px 25px rgba(30,27,20,.09)',overflow:'hidden',background:B.light}}>
     <Photo name={p.image} style={{left:0,top:0,width:430,height:350}}/>
     <div style={{position:'absolute',bottom:29,left:23,fontFamily:B.sans,fontSize:lang==='en'?23:21,letterSpacing:1.3}}>{lang==='en'?p.title:p.ru}</div>
   </div>;
  })}
  <svg width={1080} height={1920} style={{position:'absolute',inset:0,pointerEvents:'none',opacity:pair*.7*(1-Math.sin(alt*Math.PI))}}><path d="M315 1145 L315 1170 M785 1145 L785 1170" stroke={B.olive} fill="none" strokeWidth={3}/></svg>
  <div style={{position:'absolute',left:88,top:1715,...label,fontSize:lang==='en'?29:27,letterSpacing:2}}>{lang==='en'?'RECOMBINE. REDISCOVER. REPEAT.':'СОЧЕТАЙ. ОТКРЫВАЙ. ПОВТОРЯЙ.'}</div>
 </Page>;
};

const Closing = ({lang}:Localized) => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();const s=f/fps;const resolve=go(s,.7,2.6);
 return <Page direction="bottom"><Folio number="07"/>
  <div style={{position:'absolute',left:88,top:245,...label,fontSize:28,letterSpacing:3,color:B.muted,opacity:go(s,.45,1)}}>{lang==='en'?'SEE YOUR WARDROBE DIFFERENTLY.':'ВЗГЛЯНИ НА ГАРДЕРОБ ПО-НОВОМУ.'}</div>
  {(['tailoring','knit','evening'] as const).map((n,i)=><Photo key={n} name={n} position={i===1?'47% 45%':'50% 40%'} style={{left:[145,395,645][i],top:455+[50,0,60][i],width:290,height:650,transform:`rotate(${[go(s,.5,2.6,-9,-3),go(s,.5,2.6,7,0),go(s,.5,2.6,12,3)][i]}deg) translateY(${-resolve*[30,0,35][i]}px)`,boxShadow:B.shadow}}/>)}
  <div style={{position:'absolute',left:0,right:0,top:990,height:400,background:`linear-gradient(transparent,${B.paper} 38%)`}}/>
  <div style={{position:'absolute',left:72,right:72,top:1110,textAlign:'center',fontFamily:B.sans,fontWeight:500,fontSize:87,letterSpacing:6,opacity:go(s,1.1,1.75)}}>AIWARDROBE</div>
  <div style={{position:'absolute',left:240,right:240,top:1260,height:1,background:B.olive,transform:`scaleX(${go(s,1.8,2.4)})`}}/>
  <Title lines={lang==='en'?['Buy less.','Style better.']:['Покупай меньше.','Сочетай лучше.']} top={1350} size={lang==='en'?132:109} left={88} delay={2}/>
  <div style={{position:'absolute',left:88,top:1690,...label,fontSize:29,letterSpacing:2,color:B.muted,opacity:go(s,2.8,3.4)}}>{lang==='en'?'BETTER COMBINATIONS START HERE.':'НОВЫЕ СОЧЕТАНИЯ НАЧИНАЮТСЯ ЗДЕСЬ.'}</div>
 </Page>;
};

export const PremiumWardrobeV2 = ({lang='en'}: {lang?:Lang}) => {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:B.paper,color:B.ink}}>
  <Sequence name="01 — Three-look campaign opening" from={0} durationInFrames={Math.round(T.opening.seconds*fps)}><Opening lang={lang}/></Sequence>
  <Sequence name="02 — The considered wardrobe" from={Math.round(T.idea.from*fps)} durationInFrames={Math.round(T.idea.seconds*fps)}><Idea lang={lang}/></Sequence>
  <Sequence name="03 — Modern Italian tailoring" from={Math.round(T.tailoring.from*fps)} durationInFrames={Math.round(T.tailoring.seconds*fps)}><Tailoring lang={lang}/></Sequence>
  <Sequence name="04 — Contemporary quiet luxury" from={Math.round(T.knit.from*fps)} durationInFrames={Math.round(T.knit.seconds*fps)}><Knit lang={lang}/></Sequence>
  <Sequence name="05 — Evening sophistication" from={Math.round(T.evening.from*fps)} durationInFrames={Math.round(T.evening.seconds*fps)}><Evening lang={lang}/></Sequence>
  <Sequence name="06 — Wardrobe recombination" from={Math.round(T.wardrobe.from*fps)} durationInFrames={Math.round(T.wardrobe.seconds*fps)}><Wardrobe lang={lang}/></Sequence>
  <Sequence name="07 — AIWardrobe reveal" from={Math.round(T.close.from*fps)} durationInFrames={Math.round(T.close.seconds*fps)}><Closing lang={lang}/></Sequence>
  <Audio src={asset('score.wav')} volume={1}/>
 </AbsoluteFill>;
};
export const PremiumWardrobeV2Ru = () => <PremiumWardrobeV2 lang="ru"/>;
