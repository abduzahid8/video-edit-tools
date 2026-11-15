import {createContext, useContext, type ReactNode} from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {stylePsychologyBrand as b} from '../theme';
import {stylePsychologyTimeline as t} from '../timeline';
import {stylePsychologyCopy, type StyleLocale} from '../copy/stylePsychology';

const Locale = createContext<StyleLocale>('en');
const useCopy=()=>stylePsychologyCopy[useContext(Locale)];
const asset=(name:string)=>staticFile(`assets/style-psychology/${name}`);
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.2,.78,.23,1)};
const useSeconds=()=>useCurrentFrame()/useVideoConfig().fps;

function Page({children,number,dark=false}:{children:ReactNode;number:number;dark?:boolean}){
 const c=useCopy();return <AbsoluteFill style={{background:dark?b.navy:b.paper,color:dark?b.paper:b.ink,overflow:'hidden'}}>
 <div style={{position:'absolute',left:82,top:132,fontFamily:b.sans,fontSize:20,letterSpacing:3,color:dark?'#d4d9dc':b.muted}}>{c.journal}</div>
 <div style={{position:'absolute',right:82,top:132,fontFamily:b.serif,fontSize:25,fontStyle:'italic',color:dark?'#d4d9dc':b.muted}}>{String(number).padStart(2,'0')}</div>
 {children}
 </AbsoluteFill>;
}
function Head({lines,y=310,size=86,x=80,w=920,align='center',at=0}:{lines:readonly string[];y?:number;size?:number;x?:number;w?:number;align?:'center'|'left';at?:number}){
 const s=useSeconds();const locale=useContext(Locale);return <div style={{position:'absolute',left:x,top:y,width:w,textAlign:align,fontFamily:b.serif,fontSize:locale==='ru'?size*.85:size,lineHeight:1.11,letterSpacing:-size*.032,
 opacity:interpolate(s,[at,at+.16],[.1,1],clamp),translate:`0 ${interpolate(s,[at,at+.48],[24,0],ease)}px`,zIndex:4}}>
 {lines[0]}<br/><span style={{fontStyle:'italic'}}>{lines[1]}</span>
 </div>;
}
function Note({children,y=1685,x=90,w=900,at=.6,light=false}:{children:ReactNode;y?:number;x?:number;w?:number;at?:number;light?:boolean}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,textAlign:'center',fontFamily:b.serif,fontSize:34,fontStyle:'italic',color:light?'#e4e6e1':b.muted,opacity:interpolate(s,[at,at+.25],[0,1],clamp),translate:`0 ${interpolate(s,[at,at+.4],[10,0],ease)}px`,zIndex:6}}>{children}</div>;
}
function Figure({name,x=220,y=650,h=1280,at=0,enter='rise',bw=false}:{name:string;x?:number;y?:number;h?:number;at?:number;enter?:'rise'|'left'|'right';bw?:boolean}){
 const s=useSeconds();return <Img src={asset(`${name}-cut.png`)} style={{position:'absolute',left:x,top:y,height:h,width:'auto',maxWidth:'none',filter:bw?'grayscale(1)':b.photograph,
 opacity:interpolate(s,[at,at+.12],[0,1],clamp),
 translate:`${enter==='rise'?0:interpolate(s,[at,at+t.reveal],[enter==='left'?-240:240,0],ease)}px ${enter==='rise'?interpolate(s,[at,at+t.reveal],[110,0],ease):0}px`,
 scale:interpolate(s,[0,t.shot],[1,1.025],clamp),transformOrigin:'50% 35%',
 }}/>;
}
function Photo({name,x=220,y=640,w=640,h=910,at=0,angle=0,zoom=1,focus='50% 50%'}:{name:string;x?:number;y?:number;w?:number;h?:number;at?:number;angle?:number;zoom?:number;focus?:string}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',rotate:`${angle}deg`,boxShadow:b.shadow,
 opacity:interpolate(s,[at,at+.15],[0,1],clamp),clipPath:`inset(0 0 ${interpolate(s,[at,at+.48],[100,0],ease)}% 0)`,translate:`0 ${interpolate(s,[at,at+.5],[45,0],ease)}px`}}>
 <Img src={asset(`${name}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:focus,filter:b.photograph,scale:zoom*interpolate(s,[at,t.shot],[1,1.025],clamp),transformOrigin:focus}}/>
 </div>;
}
function Leader({label,x,y,toX,toY}:{label:string;x:number;y:number;toX:number;toY:number}){
 const s=useSeconds();return <><svg width={1080} height={1920} style={{position:'absolute',inset:0,zIndex:5}}>
 <path d={`M ${toX>x?x+155:x-155} ${y+30} L ${toX} ${toY}`} fill="none" stroke={b.olive} strokeWidth={1.7} pathLength={1} strokeDasharray={1} strokeDashoffset={interpolate(s,[t.annotation,t.annotation+.5],[1,0],ease)}/>
 <circle cx={toX} cy={toY} r={7} fill={b.paper} stroke={b.olive} strokeWidth={1.7} opacity={interpolate(s,[t.annotation+.3,t.annotation+.4],[0,1],clamp)}/>
 </svg><Note x={x-150} y={y} w={300} at={t.annotation}>{label}</Note></>;
}
function Hook(){const c=useCopy();return <Page number={1}><Head lines={c.hook} y={330}/><Figure name="coast" x={120} y={690} h={1460}/></Page>;}
function Detail({name,lines,zoom=1,focus='50% 50%'}:{name:string;lines:readonly string[];zoom?:number;focus?:string}){
 return <AbsoluteFill style={{background:b.paper,color:b.ink}}><Head lines={lines} y={320} size={76}/><Photo name={name} x={145} y={635} w={790} h={1020} zoom={zoom} focus={focus}/></AbsoluteFill>;
}
function Cut({children,name}:{children:ReactNode;name:string}){
 const {fps}=useVideoConfig();return <Sequence name={name} from={Math.round(t.detailAt*fps)} durationInFrames={Math.round((t.shot-t.detailAt)*fps)} style={{zIndex:10}}>{children}</Sequence>;
}
function Signal(){const c=useCopy();return <Page number={2}><Head lines={c.signal} y={320} size={80}/><Photo name="standing" x={180} y={650} w={720} h={1000}/><Cut name="New portrait / first impressions"><Detail name="portrait" lines={c.firstDetail} zoom={1.25} focus="50% 25%"/></Cut></Page>;}
function Room(){const c=useCopy();return <Page number={3}><Head lines={c.room}/><Figure name="pinstripe" x={238} y={660} h={1320} enter="left"/></Page>;}
function Yourself(){const c=useCopy();return <Page number={4}><Head lines={c.yourself}/><Photo name="portrait" x={230} y={655} w={620} h={890}/><Note>{c.personalNote}</Note></Page>;}
function Cognition(){const c=useCopy();return <Page number={5}><Head lines={c.cognition} y={420} size={96}/><Photo name="standing" x={115} y={930} w={365} h={620} angle={-3}/><Photo name="steps" x={595} y={1030} w={365} h={620} at={t.secondPhotoAt} angle={3}/><Note y={760}>{c.science}</Note></Page>;}
function Feeling(){const c=useCopy();return <Page number={6}><Head lines={c.feel} y={300} size={76}/><Figure name="portrait" x={190} y={675} h={1300}/><Cut name="New silhouette / personal feeling"><Detail name="linen" lines={c.feel} zoom={1.25} focus="50% 30%"/></Cut></Page>;}
function Fit(){const c=useCopy();return <Page number={7}><Head lines={c.fit} x={80} w={480} align="left" y={340}/><Figure name="pinstripe" x={340} y={650} h={1280} enter="right"/><Leader label={c.shoulder} x={235} y={1040} toX={600} toY={1000}/><Cut name="Shoulder and lapel / dedicated close-up"><Detail name="pinstripe" lines={c.fitDetail} zoom={2} focus="50% 30%"/></Cut></Page>;}
function Ease(){const c=useCopy();return <Page number={8}><Head lines={c.ease} size={80}/><Figure name="linen" x={125} y={680} h={1290}/><Leader label={c.movement} x={830} y={1460} toX={625} toY={1210}/><Cut name="Waist and sleeve / dedicated close-up"><Detail name="linen" lines={c.easeDetail} zoom={1.9} focus="55% 57%"/></Cut></Page>;}
function Palette(){const c=useCopy();const s=useSeconds();return <Page number={9}><Head lines={c.palette}/><Photo name="navy" x={110} y={690} w={400} h={780}/><Photo name="linen" x={570} y={690} w={400} h={780} at={t.secondPhotoAt}/>
 <div style={{position:'absolute',left:160,right:160,top:1560,display:'flex',justifyContent:'space-between',opacity:interpolate(s,[.7,1],[0,1],clamp)}}>{[[c.navy,b.navy],[c.cream,b.cream]].map(([label,color])=><div key={label} style={{display:'flex',alignItems:'center',gap:20,width:300,fontSize:32,fontFamily:b.serif}}><div style={{width:54,height:54,borderRadius:'50%',background:color}}/>{label}</div>)}</div>
 </Page>;}
function Texture(){const c=useCopy();return <Page number={10}><Head lines={c.texture} size={80}/><Photo name="steps" x={145} y={660} w={790} h={960} zoom={1.3} focus="49% 30%"/><Cut name="Knit and tweed / texture insert"><Detail name="steps" lines={c.knitDetail} zoom={2.8} focus="50% 45%"/></Cut></Page>;}
function Personal(){const c=useCopy();return <Page number={11}><Head lines={c.personal}/><Photo name="tweed" x={245} y={640} w={590} h={940}/><Cut name="Tie and collar / signature detail"><Detail name="tweed" lines={c.signatureDetail} zoom={2.1} focus="50% 29%"/></Cut></Page>;}
function Ritual(){const c=useCopy();return <Page number={12}><Head lines={c.ritual} size={76}/><Figure name="standing" x={295} y={660} h={1290} enter="left"/><Cut name="Next look / morning ritual"><Detail name="coast" lines={c.ritualDetail} zoom={1.2} focus="50% 30%"/></Cut></Page>;}
function NextDay(){const c=useCopy();return <Page number={13}><Head lines={c.day} size={82}/><Photo name="linen" x={100} y={690} w={420} h={780} angle={-2}/><Photo name="coast" x={555} y={830} w={420} h={780} at={t.secondPhotoAt} angle={2}/></Page>;}
function Bridge(){const c=useCopy();return <Page number={14}><Head lines={c.bridge} size={78}/><Photo name="steps" x={105} y={705} w={420} h={770}/><Photo name="standing" x={555} y={705} w={420} h={770} at={t.secondPhotoAt}/><Note at={t.secondPhotoAt+.4}>{c.bridgeNote}</Note></Page>;}
type DemoKind='wardrobe'|'occasion'|'result'|'calendar'|'invite';
function Demo({kind,number}:{kind:DemoKind;number:number}){
 const c=useCopy();const s=useSeconds();const {fps}=useVideoConfig();const hasDetail=kind==='occasion'||kind==='result'||kind==='calendar';const detail=hasDetail&&s>=t.demoDetailAt;const dark=kind==='invite';return <Page number={number} dark={dark}>
 <Head lines={c[kind]} y={265} size={82}/>
 <div style={{position:'absolute',left:detail?140:287,top:detail?690:565,width:detail?800:506,height:detail?900:1098,borderRadius:detail?12:34,overflow:'hidden',boxShadow:b.shadow,border:'1px solid #e8e8e4',background:b.paper,
 scale:interpolate(s,[0,.5],[.965,1],ease),translate:`0 ${interpolate(s,[0,.5],[35,0],ease)}px`}}>
 <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round(t.source[kind]*fps)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 {hasDetail&&<Sequence name={`Real demo / ${kind} detail`} from={Math.round(t.demoDetailAt*fps)} durationInFrames={Math.round((t.shot-t.demoDetailAt)*fps)}>
 <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round((t.source[kind]+t.demoDetailAt)*fps)} muted style={{position:'absolute',width:'100%',height:'auto',top:kind==='occasion'?-320:kind==='calendar'?-350:-300}}/>
 </Sequence>}
 </div>
 <Note y={1710} at={.25} light={dark}>{kind==='invite'?c.cta:hasDetail&&s>=t.demoDetailAt?c.demoDetails[kind as 'occasion'|'result'|'calendar']:'AIWardrobe'}</Note>
 <div style={{position:'absolute',left:80,right:80,top:1800,textAlign:'center',fontFamily:b.sans,fontSize:18,letterSpacing:3,color:dark?b.cream:b.muted}}>{c.realDemo}</div>
 </Page>;
}
function Close(){const c=useCopy();const s=useSeconds();return <Page number={20}>
 <Head lines={c.close} y={465} size={76}/>
 <div style={{position:'absolute',left:370,top:695,height:1,width:340,background:b.line,scale:`${interpolate(s,[.4,.9],[0,1],ease)} 1`}}/>
 <Note y={780} at={.45}>{c.cta}</Note><Note y={905} at={.7}>{c.closeNote}</Note>
 <Figure name="pinstripe" x={-100} y={1120} h={1150} enter="left"/>
 <Figure name="linen" x={390} y={1200} h={1000} at={.15}/>
 <Figure name="coast" x={735} y={1145} h={1100} at={.28} enter="right"/>
 </Page>;
}
function Film(){const {fps}=useVideoConfig();const locale=useContext(Locale);const f=(s:number)=>Math.round(s*fps);return <AbsoluteFill style={{background:b.paper}}>
 <Sequence name="01 — Dress well / feel different" from={f(t.hook)} durationInFrames={f(t.shot)}><Hook/></Sequence>
 <Sequence name="02 — Before you speak / detail" from={f(t.signal)} durationInFrames={f(t.shot)}><Signal/></Sequence>
 <Sequence name="03 — A signal to the room" from={f(t.room)} durationInFrames={f(t.shot)}><Room/></Sequence>
 <Sequence name="04 — A signal to yourself" from={f(t.yourself)} durationInFrames={f(t.shot)}><Yourself/></Sequence>
 <Sequence name="05 — Enclothed cognition" from={f(t.cognition)} durationInFrames={f(t.shot)}><Cognition/></Sequence>
 <Sequence name="06 — What you wear / how you feel" from={f(t.feel)} durationInFrames={f(t.shot)}><Feeling/></Sequence>
 <Sequence name="07 — Fit / shoulder annotation" from={f(t.fit)} durationInFrames={f(t.shot)}><Fit/></Sequence>
 <Sequence name="08 — Ease / movement annotation" from={f(t.ease)} durationInFrames={f(t.shot)}><Ease/></Sequence>
 <Sequence name="09 — Palette / navy and cream" from={f(t.palette)} durationInFrames={f(t.shot)}><Palette/></Sequence>
 <Sequence name="10 — Texture / real photograph detail" from={f(t.texture)} durationInFrames={f(t.shot)}><Texture/></Sequence>
 <Sequence name="11 — Personal style" from={f(t.personal)} durationInFrames={f(t.shot)}><Personal/></Sequence>
 <Sequence name="12 — Morning ritual" from={f(t.ritual)} durationInFrames={f(t.shot)}><Ritual/></Sequence>
 <Sequence name="13 — The day ahead" from={f(t.day)} durationInFrames={f(t.shot)}><NextDay/></Sequence>
 <Sequence name="14 — Inspiration to wardrobe" from={f(t.bridge)} durationInFrames={f(t.shot)}><Bridge/></Sequence>
 <Sequence name="15 — Real demo / your wardrobe" from={f(t.wardrobe)} durationInFrames={f(t.shot)}><Demo kind="wardrobe" number={15}/></Sequence>
 <Sequence name="16 — Real demo / choose occasion" from={f(t.occasion)} durationInFrames={f(t.shot)}><Demo kind="occasion" number={16}/></Sequence>
 <Sequence name="17 — Real demo / suggested outfit" from={f(t.result)} durationInFrames={f(t.shot)}><Demo kind="result" number={17}/></Sequence>
 <Sequence name="18 — Real demo / calendar" from={f(t.calendar)} durationInFrames={f(t.shot)}><Demo kind="calendar" number={18}/></Sequence>
 <Sequence name="19 — See the demo in action" from={f(t.invite)} durationInFrames={f(t.shot)}><Demo kind="invite" number={19}/></Sequence>
 <Sequence name="20 — Try AIWardrobe" from={f(t.close)} durationInFrames={f(t.shot)}><Close/></Sequence>
 <Audio src={asset('score.wav')} volume={.34}/>
 {t.voice.map((start,i)=><Sequence key={start} name={`Narration ${locale.toUpperCase()} / ${i+1}`} from={f(start)} durationInFrames={f(t.shot*2-.25)}><Audio src={asset(`voice-${locale}/${String(i+1).padStart(2,'0')}.wav`)}/></Sequence>)}
 </AbsoluteFill>;}
export const StylePsychology=()=> <Locale.Provider value="en"><Film/></Locale.Provider>;
export const StylePsychologyRu=()=> <Locale.Provider value="ru"><Film/></Locale.Provider>;
