import {CapsuleOpening} from "./CapsuleOpening";
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {capsuleEditorialBrand as b} from '../theme';
import {capsuleEditorialTimeline as t} from '../timeline';

const ease = {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.18,.85,.25,1)} as const;
const m=(s:number,a:number[],v:number[])=>interpolate(s,a,v,ease);
const MotionRate=createContext(1);
const useS=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps*useContext(MotionRate);};
const asset=(n:string)=>staticFile('assets/capsule-elegant/'+n);

function Paper(){return <AbsoluteFill><Img src={asset('paper.jpg')} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',left:540,top:0,bottom:0,width:1,background:b.line,opacity:.13}}/></AbsoluteFill>;}
function Page({children}:{children:React.ReactNode}){const s=useS();return <AbsoluteFill style={{translate:`${m(s,[0,t.transition],[1100,0])}px 0`}}><Paper/>{children}</AbsoluteFill>;}
function Folio({chapter,number}:{chapter:string;number:string}){return <><div style={{position:'absolute',left:75,right:75,top:108,display:'flex',justifyContent:'space-between',fontSize:20,letterSpacing:2.3,color:b.muted}}><span>AIWARDROBE / STYLE JOURNAL</span><span>{number}</span></div><div style={{position:'absolute',bottom:108,left:75,right:75,borderTop:`1px solid ${b.line}`,paddingTop:20,display:'flex',justifyContent:'space-between',fontSize:19,letterSpacing:2,color:b.muted}}><span>{chapter}</span><span>ОСЕННЯЯ КАПСУЛА</span></div></>;}
function Title({lines,top=255,size=76,at=0,align='center'}:{lines:React.ReactNode[];top?:number;size?:number;at?:number;align?:'left'|'center'}){const s=useS();return <div style={{position:'absolute',left:85,right:85,top,fontFamily:b.serif,fontSize:size,lineHeight:.99,letterSpacing:-2,textAlign:align,zIndex:6}}>{lines.map((line,i)=><div key={i} style={{overflow:'hidden',padding:'4px 0 10px'}}><div style={{translate:`0 ${m(s,[at+.09*i,at+.5+.09*i],[112,0])}%`,opacity:m(s,[at+.09*i,at+.22+.09*i],[0,1])}}>{line}</div></div>)}</div>;}
function Note({children,x=80,y=1540,w=920,at=0,size=33,align='center'}:{children:React.ReactNode;x?:number;y?:number;w?:number;at?:number;size?:number;align?:'left'|'center'}){const s=useS();return <div style={{position:'absolute',left:x,top:y,width:w,fontFamily:b.serif,fontSize:size,lineHeight:1.2,textAlign:align,opacity:m(s,[at,at+.28],[0,1]),translate:`0 ${m(s,[at,at+.45],[15,0])}px`}}>{children}</div>;}
function Photo({file,x,y,w,h,at=0,side=1,rotate=0,fit='cover',position='50% 50%',children}:{file:string;x:number;y:number;w:number;h:number;at?:number;side?:number;rotate?:number;fit?:'cover'|'contain';position?:string;children?:React.ReactNode}){const s=useS();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,translate:`${m(s,[at,at+.55],[side*140,0])}px 0`,rotate:`${m(s,[at,at+.6],[rotate+side*3,rotate])}deg`,opacity:m(s,[at,at+.18],[0,1])}}><div style={{width:'100%',height:'100%',overflow:'hidden',clipPath:`inset(0 ${m(s,[at,at+.6],[100,0])}% 0 0)`}}><Img src={asset(file)} style={{width:'100%',height:'100%',objectFit:fit,objectPosition:position,scale:m(s,[at,at+1.4],[1.08,1])}}/></div>{children}</div>;}
function Figure({file,x,y,w,h,at=0,side=1}:{file:string;x:number;y:number;w:number;h:number;at?:number;side?:number}){const s=useS();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,translate:`${m(s,[at,at+.6],[side*700,0])}px ${m(s,[at,at+.6],[60,0])}px`,opacity:m(s,[at,at+.16],[0,1])}}><Img src={asset(file)} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'50% 100%'}}/></div>;}
function Leader({x,y,toX,toY,at}:{x:number;y:number;toX:number;toY:number;at:number}){const s=useS();return <svg width={1080} height={1920} style={{position:'absolute',inset:0}}><path d={`M${x},${y} L${x},${y+30} L${toX},${toY}`} pathLength={1} stroke={b.ink} strokeWidth={1.2} fill="none" strokeDasharray={1} strokeDashoffset={m(s,[at,at+.55],[1,0])}/><circle cx={toX} cy={toY} r={5} fill={b.paper} stroke={b.ink} opacity={m(s,[at+.4,at+.55],[0,1])}/></svg>;}

function Cover(){return <CapsuleOpening language="ru"/>;}

function Premise(){const s=useS();return <AbsoluteFill ><Folio chapter="НАЧНИТЕ С ПРИНЦИПА" number="02"/>
<div style={{position:'absolute',left:0,right:0,top:470,textAlign:'center',fontFamily:b.serif,fontSize:170,color:b.muted,opacity:m(s,[0,.25,.65,1],[0,.35,.35,.12]),scale:m(s,[0,1],[1.1,.88])}}>ЦЕННИК</div>
<div style={{position:'absolute',left:200,top:575,width:m(s,[.2,.65],[0,680]),height:2,background:b.ink,rotate:'-7deg'}}/>
<Title lines={['Секрет —',<i key="i">в сочетаниях.</i>]} top={805} size={91} at={.45}/>
<Note y={1170} at={1} size={36}>Спокойные цвета. Чистые линии.<br/>И вещи, которые хочется носить снова.</Note>
</AbsoluteFill>;}

function Palette(){const s=useS();const colors=[b.navy,b.cream,b.olive];return <AbsoluteFill><Folio chapter="ПАЛИТРА / 03 ЦВЕТА" number="03"/><Title lines={['Одна палитра.',<i key="i">Много сочетаний.</i>]} size={77}/>
{['navy-4.jpg','cream-3.jpg','grey-2.jpg'].map((f,i)=><div key={f} style={{position:'absolute',left:100+i*300,top:650,width:280,height:700,translate:`0 ${m(s,[.1+i*.12,.65+i*.12],[650,0])}px`,rotate:`${m(s,[.1+i*.12,.7+i*.12],[(i-1)*7,0])}deg`}}><div style={{position:'absolute',inset:0,background:colors[i]}}/><div style={{position:'absolute',inset:0,clipPath:`inset(${m(s,[1+i*.12,1.7+i*.12],[100,0])}% 0 0 0)`}}><Img src={asset(f)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:i===1?'50% 50%':'50% 55%'}}/></div><div style={{position:'absolute',top:730,left:0,right:0,fontFamily:b.serif,fontSize:31,textAlign:'center'}}>{['Тёмно-синий','Молочный','Светло-серый'][i]}</div></div>)}
<Note y={1570} at={2} size={35}>Один оттенок связывает образ.<br/><i>Другой добавляет глубину.</i></Note>

</AbsoluteFill>;}

const inventory=[
 {file:'cream-0.jpg',title:'Тонкая водолазка',sub:'01 / ФАКТУРА',pos:'50% 30%'},
 {file:'shirt-0.jpg',title:'Светлая рубашка',sub:'02 / ОСНОВА',pos:'50% 30%'},
 {file:'navy-0.jpg',title:'Тёмный пиджак',sub:'03 / ГЛУБИНА',pos:'50% 35%'},
 {file:'dark-trousers.jpg',title:'Тёмные брюки',sub:'04 / ЛИНИЯ',pos:'50% 60%'},
 {file:'light-trousers.jpg',title:'Светлые брюки',sub:'05 / КОНТРАСТ',pos:'50% 60%'},
 {file:'grey-0.jpg',title:'Мягкий пиджак',sub:'06 / СИЛУЭТ',pos:'50% 30%'},
];
function Inventory(){const s=useS();return <AbsoluteFill><Folio chapter="ОСНОВА ГАРДЕРОБА" number="04"/>
<div style={{position:'absolute',inset:0,scale:m(s,[2.3,4.85],[1,1.035])}}>
 <Title lines={['6 вещей.',<i key="i">Основа капсулы.</i>]} top={230} size={77}/>
 <div style={{position:'absolute',left:540,top:580,width:1,height:m(s,[.4,1.2],[0,1020]),background:b.line}}/>
 {inventory.map((item,i)=>{const col=i%2,row=Math.floor(i/2),at=.25+i*.17;return <div key={item.file} style={{position:'absolute',left:105+col*480,top:600+row*355,width:390,height:325,translate:`${m(s,[at,at+.6],[col?500:-500,0])}px 0`,opacity:m(s,[at,at+.2],[0,1])}}><Img src={asset(item.file)} style={{position:'absolute',left:0,top:0,width:170,height:270,objectFit:'cover',objectPosition:item.pos}}/><div style={{position:'absolute',left:195,top:80,width:190,fontFamily:b.serif,fontSize:30,lineHeight:1.08}}>{item.title}</div><div style={{position:'absolute',left:195,top:185,width:190,fontSize:17,letterSpacing:1.3,color:b.muted}}>{item.sub}</div><div style={{position:'absolute',bottom:27,width:390,height:1,background:b.line,scale:`${m(s,[at+.3,at+.9],[0,1])} 1`,transformOrigin:'0 0'}}/></div>;})}
 <Note y={1665} at={2.2} size={28}>Обувь и аксессуары — из вашего гардероба.</Note>
</div>
</AbsoluteFill>;}

function Texture(){const s=useS();return <AbsoluteFill><Folio chapter="ДЕТАЛЬ РЕШАЕТ" number="05"/><Title lines={['Фактура',<i key="i">вместо логотипа.</i>]} size={84}/>
<div style={{position:'absolute',inset:0,translate:`${m(s,[2.2,2.75],[0,-1150])}px 0`}}>
 <Figure file="cream-0-cut.png" x={55} y={570} w={470} h={1000} at={0} side={-1}/>
 <Photo file="cream-3.jpg" x={515} y={650} w={460} h={590} at={.4}/>
 <Note x={550} y={1300} w={380} at={.85} size={33} align="left">Тонкий трикотаж.<br/><i>Мягкий светлый тон.</i></Note>
 <Leader x={600} y={1270} toX={730} toY={1090} at={1.05}/>
 <Note y={1640} at={1.4} size={31}>Простой силуэт. <i>Благородная фактура.</i></Note>
</div>
<div style={{position:'absolute',inset:0,translate:`${m(s,[2.2,2.75],[1120,0])}px 0`,opacity:m(s,[2.2,2.3],[0,1])}}>
 <Photo file="grey-2.jpg" x={105} y={660} w={435} h={625} at={2.25} side={-1}/>
 <Figure file="grey-3-cut.png" x={510} y={545} w={490} h={1020} at={2.25}/>
 <Note x={115} y={1350} w={380} at={2.9} size={35} align="left">Мягкий лацкан.<br/><i>Чистая линия.</i></Note>
 <Leader x={300} y={1320} toX={365} toY={970} at={3.1}/>
 <Note y={1640} at={3.3} size={31}>Детали добавляют характер.<br/><i>Не добавляйте лишнего.</i></Note>
</div>
</AbsoluteFill>;}

const lookNames=[['Спокойный день.','Тонкий трикотаж + светлые брюки.'],['Деловая встреча.','Мягкий пиджак + светлая база.'],['Вечер.','Тёмный пиджак + водолазка.']];
function LookPanel({kind,at}:{kind:number;at:number}){const s=useS();const local=s-at;const files=['cream-0-cut.png','grey-3-cut.png','navy-0-cut.png'];const details=['cream-3.jpg','grey-1.jpg','navy-4.jpg'];return <AbsoluteFill style={{translate:`${m(local,[-.5,0,1.8,2.2],[1150,0,0,-1150])}px 0`,opacity:local<-.5||local>2.2?0:1}}>
<div style={{position:'absolute',left:80,top:590,fontFamily:b.serif,fontSize:200,color:b.line,opacity:.32}}>0{kind+1}</div>
<Figure file={files[kind]} x={175} y={510} w={630} h={1000} at={at-.4} side={1}/>
<Photo file={details[kind]} x={720} y={710} w={260} h={345} at={at+.2} rotate={2}/>
<Note x={820} y={1100} w={185} at={at+.45} size={25} align="left">{[<>Мягкая<br/>фактура.</>,<>Чистая<br/>линия.</>,<>Глубина<br/>цвета.</>][kind]}</Note>
<Note y={1565} at={at+.25} size={49}><i>{lookNames[kind][0]}</i></Note><Note y={1630} at={at+.45} size={31}>{lookNames[kind][1]}</Note>
</AbsoluteFill>;}
function Looks(){const s=useS();const active=s<2.15?0:s<4.3?1:2;return <AbsoluteFill><Folio chapter="ОДНА КАПСУЛА / ТРИ ОБРАЗА" number="06"/><Title lines={['Меняйте сочетание.',<i key="i">Сохраняйте стиль.</i>]} top={245} size={73}/><LookPanel kind={0} at={0}/><LookPanel kind={1} at={2.15}/><LookPanel kind={2} at={4.3}/><div style={{position:'absolute',top:1720,left:460,display:'flex',gap:35}}>{[0,1,2].map(i=><div key={i} style={{width:i===active?60:15,height:2,background:i===active?b.ink:b.line}}/>)}</div></AbsoluteFill>;}

function Principle(){const s=useS();return <AbsoluteFill><Folio chapter="ПОКУПАЙТЕ ОСМЫСЛЕННО" number="07"/>
{['cream-0.jpg','grey-0.jpg','navy-0.jpg'].map((f,i)=><Photo key={f} file={f} x={210+i*220} y={450+i*30} w={235} h={320} at={i*.1} side={i===0?-1:1} rotate={(i-1)*3}/>)}
<Title lines={['Больше сочетаний.',<i key="i">Меньше случайных</i>,'покупок.']} top={960} size={73} at={.35}/>
<Note y={1430} at={.9} size={34}>Сначала представьте образ целиком.</Note>
<div style={{position:'absolute',left:540,top:1520,width:1,height:m(s,[1.3,2.3],[0,240]),background:b.ink}}/>
</AbsoluteFill>;}

function AppDemo(){const s=useS();const {fps}=useVideoConfig();const step=s<2.4?0:s<4.6?1:2;const at=[0,2.4,4.6][step];return <AbsoluteFill><Folio chapter="ПРИМЕРЬТЕ ИДЕЮ К СЕБЕ" number="08"/>
<Title lines={[['Выберите категорию.','Создайте образ.','Ваш образ готов.'][step],<i key="i">{['И свой стиль.','В одно нажатие.','Сочетание целиком.'][step]}</i>]} top={220} size={68} at={at}/>
<div style={{position:'absolute',left:284,top:450,width:512,height:1110,borderRadius:46,background:b.ink,padding:8,boxShadow:b.shadow,translate:`0 ${m(s,[0,.5],[150,0])}px`,scale:m(s,[0,.6],[.94,1])}}><div style={{position:'relative',width:'100%',height:'100%',overflow:'hidden',borderRadius:38}}>
<Sequence name="Категория и стиль" from={Math.round(t.app.category.from*fps)} durationInFrames={Math.round(t.app.category.seconds*fps)}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} trimBefore={Math.round(t.app.category.source*fps)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>
<Sequence name="Создание образа" from={Math.round(t.app.create.from*fps)} durationInFrames={Math.round(t.app.create.seconds*fps)}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} trimBefore={Math.round(t.app.create.source*fps)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>
<Sequence name="Готовый результат" from={Math.round(t.app.result.from*fps)} durationInFrames={Math.round((t.app.result.seconds+t.transition)*fps)}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} trimBefore={Math.round(t.app.result.source*fps)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>
</div></div>
<div style={{position:'absolute',left:120,right:120,top:1645,display:'flex',justifyContent:'space-between',fontFamily:b.serif,fontSize:31}}>{['01 Категория','02 Создание','03 Образ'].map((x,i)=><span key={x} style={{opacity:i===step?1:.4,borderBottom:i===step?`1px solid ${b.ink}`:'1px solid transparent',paddingBottom:12}}>{x}</span>)}</div>
</AbsoluteFill>;}

function CTA(){const s=useS();return <AbsoluteFill><Folio chapter="ВАШ ГАРДЕРОБ. ВАШ ХАРАКТЕР." number="09"/>
<Title lines={['Меньше лишнего.',<i key="i">Больше вашего.</i>]} top={430} size={85}/>
<div style={{position:'absolute',left:80,right:80,top:880,textAlign:'center',fontFamily:b.sans,fontSize:104,fontWeight:600,letterSpacing:-5,opacity:m(s,[.2,.55],[0,1]),translate:`0 ${m(s,[.2,.7],[35,0])}px`}}>AIWardrobe<span style={{color:b.appAccent}}>✦</span></div>
<Note y={1060} at={.5} size={34}>Соберите свой образ.</Note>
<div style={{position:'absolute',left:235,right:235,top:1270,height:110,borderTop:`1px solid ${b.ink}`,borderBottom:`1px solid ${b.ink}`,display:'flex',alignItems:'center',justifyContent:'center',gap:45,fontFamily:b.serif,fontSize:39,opacity:m(s,[.7,1],[0,1])}}>Попробовать <span style={{translate:`${m(s,[.8,1.4],[0,18])}px 0`}}>→</span></div>
<Note y={1550} at={1.1} size={29}>Начните с вещей, которые подходят вам.</Note>
</AbsoluteFill>;}

export function CapsuleEditorial(){const {fps}=useVideoConfig();return <AbsoluteFill style={{background:b.paper,color:b.ink,fontFamily:b.sans,overflow:'hidden'}}>
<Paper/><Audio src={asset('opening-motion.wav')} volume={.85}/>
<Sequence name="Обложка — выглядеть дороже" from={Math.round(t.cover.from*fps)} durationInFrames={Math.round((t.cover.seconds+t.transition)*fps)}><MotionRate.Provider value={t.cover.motionRate}><Cover/></MotionRate.Provider></Sequence>
<Sequence name="Принцип — сочетание важнее ценника" from={Math.round(t.premise.from*fps)} durationInFrames={Math.round((t.premise.seconds+t.transition)*fps)}><Page><MotionRate.Provider value={t.premise.motionRate}><Premise/></MotionRate.Provider></Page></Sequence>
<Sequence name="Палитра — цвет становится фотографией" from={Math.round(t.palette.from*fps)} durationInFrames={Math.round((t.palette.seconds+t.transition)*fps)}><Page><MotionRate.Provider value={t.palette.motionRate}><Palette/></MotionRate.Provider></Page></Sequence>
<Sequence name="Шесть вещей — редакционная сетка" from={Math.round(t.inventory.from*fps)} durationInFrames={Math.round((t.inventory.seconds+t.transition)*fps)}><Page><MotionRate.Provider value={t.inventory.motionRate}><Inventory/></MotionRate.Provider></Page></Sequence>
<Sequence name="Фактура — фигура и макро" from={Math.round(t.texture.from*fps)} durationInFrames={Math.round((t.texture.seconds+t.transition)*fps)}><Page><MotionRate.Provider value={t.texture.motionRate}><Texture/></MotionRate.Provider></Page></Sequence>
<Sequence name="Три образа — фотоперекличка" from={Math.round(t.looks.from*fps)} durationInFrames={Math.round((t.looks.seconds+t.transition)*fps)}><Page><MotionRate.Provider value={t.looks.motionRate}><Looks/></MotionRate.Provider></Page></Sequence>
<Sequence name="Больше сочетаний" from={Math.round(t.principle.from*fps)} durationInFrames={Math.round((t.principle.seconds+t.transition)*fps)}><Page><MotionRate.Provider value={t.principle.motionRate}><Principle/></MotionRate.Provider></Page></Sequence>
<Sequence name="AIWardrobe — категория, создание, результат" from={Math.round(t.app.from*fps)} durationInFrames={Math.round((t.app.seconds+t.transition)*fps)}><Page><AppDemo/></Page></Sequence>
<Sequence name="Попробовать AIWardrobe" from={Math.round(t.cta.from*fps)} durationInFrames={Math.round(t.cta.seconds*fps)}><Page><MotionRate.Provider value={t.cta.motionRate}><CTA/></MotionRate.Provider></Page></Sequence>
</AbsoluteFill>;}
