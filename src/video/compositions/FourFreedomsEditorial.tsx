import {Children, cloneElement, createContext, isValidElement, useContext, type ReactNode} from 'react';
import {fourFreedomsRussian} from '../copy/fourFreedomsRu';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fourFreedomsBrand as b} from '../theme';
import {fourFreedomsTimeline as t} from '../timeline';


const FourFreedomsLocale=createContext<'en'|'ru'>('en');
function Localized({children}:{children:ReactNode}){
 const locale=useContext(FourFreedomsLocale);
 const translate=(node:ReactNode):ReactNode=>{
  if(typeof node==='string')return locale==='ru'?(fourFreedomsRussian[node]??node):node;
  if(isValidElement<{children?:ReactNode}>(node)&&node.props.children!==undefined){
   return cloneElement(node,undefined,Children.map(node.props.children,translate));
  }
  return node;
 };
 return <>{Children.map(children,translate)}</>;
}

const asset=(file:string)=>staticFile(`assets/four-freedoms/${file}`);
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.22,.8,.25,1)};
const useSeconds=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps;};

function Paper(){return <AbsoluteFill style={{background:b.paper,
 backgroundImage:'linear-gradient(90deg, transparent 49.75%, rgba(65,68,48,.035) 50%, rgba(255,255,255,.16) 50.2%, transparent 50.6%), linear-gradient(0deg, transparent 49.5%, rgba(65,68,48,.025) 50%, transparent 50.6%)',
}}/>;}
function Stage({children,kicker,number,seconds=t.shot}:{children:ReactNode;kicker:string;number:string;seconds?:number}){
 const s=useSeconds();return <AbsoluteFill style={{color:b.ink,overflow:'hidden'}}><Paper/>
 <div style={{position:'absolute',left:74,right:74,top:119,display:'flex',justifyContent:'space-between',fontFamily:b.sans,fontSize:19,letterSpacing:2.5,color:b.muted}}><span><Localized>AIWARDROBE / THE EDIT</Localized></span><span>{number}</span></div>
 <div style={{position:'absolute',left:74,right:74,top:173,height:1,background:b.line}}/>
 <div style={{position:'absolute',left:80,right:80,top:220,textAlign:'center',fontFamily:b.sans,fontSize:21,letterSpacing:4,color:b.muted}}><Localized>{kicker}</Localized></div>
 {children}
 <div style={{position:'absolute',left:74,right:74,bottom:132,height:1,background:b.line}}/>
 <div style={{position:'absolute',left:74,bottom:131,width:932* Math.min(1,s/seconds),height:2,background:b.olive}}/>
 <div style={{position:'absolute',left:74,bottom:87,fontFamily:b.sans,fontSize:17,letterSpacing:2,color:b.muted}}><Localized>CULTURE / CRAFT / TRAVEL / WELLBEING</Localized></div>
 </AbsoluteFill>;
}
function Head({children,y=325,size=66,at=0,align='center',x=80,w=920,italic=false}:{children:ReactNode;y?:number;size?:number;at?:number;align?:'left'|'center';x?:number;w?:number;italic?:boolean}){
 const s=useSeconds();const locale=useContext(FourFreedomsLocale);return <div style={{position:'absolute',left:x,top:y,width:w,textAlign:align,fontFamily:b.serif,fontSize:locale==='ru'&&size>=54?size*.92:size,lineHeight:1.04,letterSpacing:-size*.028,fontStyle:italic?'italic':'normal',opacity:interpolate(s,[at,at+.18],[0,1],clamp),translate:`0 ${interpolate(s,[at,at+.48],[24,0],ease)}px`}}><Localized>{children}</Localized></div>;
}
function Small({children,y=1630,at=.35,x=90,w=900}:{children:ReactNode;y?:number;at?:number;x?:number;w?:number}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,textAlign:'center',fontFamily:b.serif,fontSize:34,lineHeight:1.2,fontStyle:'italic',color:b.muted,opacity:interpolate(s,[at,at+.25],[0,1],clamp)}}><Localized>{children}</Localized></div>;
}
function Photo({file,x=240,y=610,w=600,h=860,at=0,angle=0,focus='50% 50%',zoom=1,entry='rise',contain=false}:{file:string;x?:number;y?:number;w?:number;h?:number;at?:number;angle?:number;focus?:string;zoom?:number;entry?:'rise'|'left'|'right';contain?:boolean}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,padding:12,boxSizing:'border-box',background:b.white,boxShadow:b.shadow,rotate:`${angle}deg`,
 opacity:interpolate(s,[at,at+.16],[0,1],clamp),
 translate:`${entry==='rise'?0:interpolate(s,[at,at+.55],[entry==='left'?-180:180,0],ease)}px ${entry==='rise'?interpolate(s,[at,at+.55],[65,0],ease):0}px`,
 clipPath:`inset(0 0 ${interpolate(s,[at,at+.48],[100,0],ease)}% 0)`,
 }}><div style={{width:'100%',height:'100%',overflow:'hidden'}}><Img src={asset(file)} style={{width:'100%',height:'100%',objectFit:contain?'contain':'cover',objectPosition:focus,filter:b.photograph,scale:zoom*interpolate(s,[at,at+t.shot],[1,1.025],clamp),transformOrigin:focus}}/></div></div>;
}
function Rule({text,x,y,toX,toY,at=.55}:{text:string;x:number;y:number;toX:number;toY:number;at?:number}){
 const s=useSeconds();return <><svg width={1080} height={1920} style={{position:'absolute',inset:0,opacity:interpolate(s,[at,at+.15],[0,1],clamp)}}><path d={`M ${x} ${y+45} L ${x} ${y+80} L ${toX} ${toY}`} stroke={b.olive} fill="none" strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={interpolate(s,[at,at+.45],[1,0],ease)}/><circle cx={toX} cy={toY} r={7} fill={b.paper} stroke={b.olive} strokeWidth={1.4}/></svg><Head y={y} x={x-130} w={260} size={30} at={at} italic>{text}</Head></>;
}
function Opening(){return <Stage kicker="A MEN’S LIFESTYLE JOURNAL" number="01 / 25"><Head y={365} size={76}>What does modern<br/><em>luxury look like?</em></Head><Photo file="polo-seated.jpg" x={277} y={663} w={526} h={772}/><Small y={1518}>A considered life, in four stories.</Small></Stage>;}
function Overview(){return <Stage kicker="FOUR PERSPECTIVES" number="02 / 25"><Head y={345} size={67}>Culture. Craft.<br/><em>Movement. Balance.</em></Head><Photo file="polo-tweed.jpg" x={90} y={700} w={350} h={620} angle={-3}/><Photo file="ronson.jpg" x={365} y={880} w={350} h={440} at={.18} angle={2}/><Photo file="linen.jpg" x={650} y={700} w={340} h={620} at={.36} angle={4}/><Small y={1510}>One considered point of view.</Small></Stage>;}
function PoloOne(){return <Stage kicker="01 / CULTURE" number="03 / 25"><Head>Ralph Lauren<br/><em>takes Polo to Tokyo.</em></Head><Photo file="polo-ivory.jpg" x={245} y={623} w={590} h={820}/><Small y={1515}>PoloFest · 23–25 October 2026</Small></Stage>;}
function PoloTwo(){return <Stage kicker="RALPH LAUREN / POLOFEST" number="04 / 25"><Head y={360}>Archives.<br/><em>Collectors. Community.</em></Head><Photo file="polo-country.jpg" x={100} y={700} w={425} h={650} entry="left"/><Photo file="polo-tweed.jpg" x={555} y={790} w={425} h={650} entry="right" at={.18}/><Small y={1540}>Tokyo, through the lens of Polo culture.</Small></Stage>;}
function PoloThree(){return <Stage kicker="THE WARDROBE / POLO CULTURE" number="05 / 25"><Head y={350}>A world beyond<br/><em>the shirt.</em></Head><Photo file="polo-steps.jpg" x={250} y={625} w={580} h={925}/><Rule text="Tweed + knitwear" x={823} y={1105} toX={683} toY={1003}/></Stage>;}
function PoloFour(){return <Stage kicker="THE TAKEAWAY / CULTURE" number="06 / 25"><Head y={360}>Wear the story.<br/><em>Make it yours.</em></Head><Photo file="polo-seated.jpg" x={100} y={715} w={440} h={680} angle={-2}/><Photo file="polo-summer.jpg" x={545} y={790} w={435} h={680} angle={2} at={.16}/><Small y={1570}>Classics gain character in the wearing.</Small></Stage>;}
function ApOne(){return <Stage kicker="02 / CRAFT" number="07 / 25"><Head y={335} size={67}>Audemars Piguet<br/><em>beyond the watch.</em></Head><Photo file="ronson.jpg" x={165} y={665} w={750} h={750}/><Small y={1502}>Royal Oak Joaillerie</Small><Small y={1560} at={.65}>Royal Oak geometry, reimagined as jewellery.</Small></Stage>;}
function ApTwo(){return <Stage kicker="THE WARDROBE / ONE SIGNATURE DETAIL" number="08 / 25"><Head y={350}>The wrist.<br/><em>The cuff. The balance.</em></Head><Photo file="ronson.jpg" x={210} y={660} w={660} h={840} zoom={1.45} focus="53% 73%"/><Small y={1570}>Mark Ronson · AP ambassador portrait</Small></Stage>;}
function ApThree(){return <Stage kicker="THE TAKEAWAY / RESTRAINT" number="09 / 25"><Head y={350}>One strong detail.<br/><em>A quieter frame.</em></Head><Photo file="ronson.jpg" x={100} y={685} w={535} h={740} focus="50% 65%"/><Photo file="pinstripe.jpg" x={650} y={835} w={330} h={590} at={.2}/><Small y={1550}>A considered accent, with classic tailoring.</Small></Stage>;}
function ApFour(){return <Stage kicker="THE WARDROBE / CRAFT" number="10 / 25"><Head y={350}>Character is<br/><em>in the details.</em></Head><Photo file="portrait.jpg" x={235} y={635} w={610} h={925}/><Rule text="Keep it personal" x={815} y={1180} toX={705} toY={1090}/></Stage>;}
function TravelOne(){return <Stage kicker="03 / TRAVEL" number="11 / 25"><Head y={330} size={64}>American Express<br/><em>arrives at Schiphol.</em></Head><Photo file="trench.jpg" x={235} y={630} w={610} h={880}/><Small y={1570}>A new Centurion Lounge in Amsterdam.</Small></Stage>;}
function TravelTwo(){return <Stage kicker="THE WARDROBE / IN TRANSIT" number="12 / 25"><Head y={345}>The coat that<br/><em>goes everywhere.</em></Head><Photo file="trench.jpg" x={175} y={660} w={730} h={850} zoom={1.25} focus="50% 44%"/><Small y={1575}>Classic outerwear. An effortless departure.</Small></Stage>;}
function TravelThree(){return <Stage kicker="THE TAKEAWAY / MOVEMENT" number="13 / 25"><Head y={355}>Soft tailoring.<br/><em>Room to move.</em></Head><Photo file="relaxed.jpg" x={270} y={630} w={540} h={960} contain/><Rule text="An easier silhouette" x={835} y={1165} toX={690} toY={1050}/></Stage>;}
function TravelFour(){return <Stage kicker="THE WARDROBE / THE JOURNEY" number="14 / 25"><Head y={350}>Arrive composed.</Head><Photo file="duo.jpg" x={115} y={675} w={520} h={865}/><Photo file="polo-summer.jpg" x={650} y={840} w={315} h={580} at={.2}/><Small y={1605}>Layers that work from departure to arrival.</Small></Stage>;}
function WellnessOne(){return <Stage kicker="04 / WELLBEING" number="15 / 25"><Head y={335} size={65}>Equinox at AMAALA.<br/><em>A different pace.</em></Head><Photo file="linen.jpg" x={245} y={630} w={590} h={875}/><Small y={1570}>Performance luxury on the Red Sea.</Small></Stage>;}
function WellnessTwo(){return <Stage kicker="THE WARDROBE / AT EASE" number="16 / 25"><Head y={350}>Recovery.<br/><em>Balance. Breathing room.</em></Head><Photo file="sea-suit.jpg" x={230} y={640} w={620} h={925}/><Small y={1620}>A lighter palette. A softer way to dress.</Small></Stage>;}
function WellnessThree(){return <Stage kicker="THE TAKEAWAY / WELLBEING" number="17 / 25"><Head y={350}>Less structure.<br/><em>More ease.</em></Head><Photo file="polo-summer.jpg" x={95} y={690} w={435} h={700} angle={-2}/><Photo file="linen.jpg" x={550} y={790} w={435} h={700} angle={2} at={.18}/><Small y={1595}>Dress for the pace you want.</Small></Stage>;}
function WellnessFour(){return <Stage kicker="THE WARDROBE / AN EASIER PACE" number="18 / 25"><Head y={350}>Live with intention.<br/><em>Dress the same way.</em></Head><Photo file="panama.jpg" x={240} y={650} w={600} h={860}/><Small y={1580}>A relaxed silhouette, still considered.</Small></Stage>;}
function BridgeOne(){return <Stage kicker="FOUR STORIES / YOUR POINT OF VIEW" number="19 / 25"><Head y={350}>Four different worlds.</Head><Photo file="polo-steps.jpg" x={100} y={655} w={400} h={660} angle={-2}/><Photo file="ronson.jpg" x={580} y={705} w={400} h={470} at={.12} angle={2}/><Photo file="trench.jpg" x={585} y={1210} w={290} h={420} at={.3}/><Small y={1470} x={90} w={420}>One wardrobe.</Small></Stage>;}
function BridgeTwo(){return <Stage kicker="FROM INSPIRATION TO EVERYDAY" number="20 / 25"><Head y={350}>How do you<br/><em>make it your own?</em></Head><Photo file="polo-seated.jpg" x={150} y={690} w={370} h={640} entry="left"/><Photo file="relaxed.jpg" x={560} y={690} w={370} h={640} entry="right" at={.1}/><Head y={1490} size={54} at={.45}>Start with your wardrobe.</Head></Stage>;}
function DemoShot({step,source,title,note,number,close=false}:{step:string;source:number;title:string;note:string;number:string;close?:boolean}){
 const s=useSeconds();const {fps}=useVideoConfig();return <Stage kicker={step} number={number} seconds={close?t.close.seconds:t.shot}>
 <Head y={320} size={close?70:64}>{title}</Head>
 <div style={{position:'absolute',left:282,top:505,width:516,height:1118,borderRadius:31,overflow:'hidden',boxShadow:b.shadow,background:b.white,opacity:interpolate(s,[0,.16],[0,1],clamp),scale:interpolate(s,[0,.45],[.96,1],ease)}}>
 <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round(source*fps)} muted style={{width:'100%',height:'100%',objectFit:'contain'}}/>
 </div>
 <div style={{position:'absolute',left:80,right:80,top:1660,textAlign:'center',fontFamily:b.serif,fontSize:close?40:36,color:b.ink,opacity:interpolate(s,[.15,.4],[0,1],clamp)}}><Localized>{note}</Localized></div>
 {close&&<div style={{position:'absolute',right:102,top:790,fontSize:54,color:b.olive,translate:`${interpolate(s,[.4,.85],[25,0],ease)}px 0`,opacity:interpolate(s,[.4,.7],[0,1],clamp)}}>←</div>}
 </Stage>;
}

const FourFreedomsFilm=()=>{const {fps}=useVideoConfig();const locale=useContext(FourFreedomsLocale);const voice=(file:string)=>asset(locale==='ru'?`voice-ru/${file.replace('voice-','')}`:file);return <AbsoluteFill style={{background:b.paper}}>
 <Sequence name="01 — What does luxury look like?" from={Math.round(t.hook*fps)} durationInFrames={Math.round(t.shot*fps)}><Opening/></Sequence>
 <Sequence name="02 — Four perspectives" from={Math.round(t.overview*fps)} durationInFrames={Math.round(t.shot*fps)}><Overview/></Sequence>
 <Sequence name="03 — PoloFest Tokyo" from={Math.round(t.polo[0]*fps)} durationInFrames={Math.round(t.shot*fps)}><PoloOne/></Sequence>
 <Sequence name="04 — Archive and community" from={Math.round(t.polo[1]*fps)} durationInFrames={Math.round(t.shot*fps)}><PoloTwo/></Sequence>
 <Sequence name="05 — A world beyond the shirt" from={Math.round(t.polo[2]*fps)} durationInFrames={Math.round(t.shot*fps)}><PoloThree/></Sequence>
 <Sequence name="06 — Wear the story" from={Math.round(t.polo[3]*fps)} durationInFrames={Math.round(t.shot*fps)}><PoloFour/></Sequence>
 <Sequence name="07 — Audemars Piguet jewellery" from={Math.round(t.ap[0]*fps)} durationInFrames={Math.round(t.shot*fps)}><ApOne/></Sequence>
 <Sequence name="08 — The wrist and the cuff" from={Math.round(t.ap[1]*fps)} durationInFrames={Math.round(t.shot*fps)}><ApTwo/></Sequence>
 <Sequence name="09 — One signature detail" from={Math.round(t.ap[2]*fps)} durationInFrames={Math.round(t.shot*fps)}><ApThree/></Sequence>
 <Sequence name="10 — Personal character" from={Math.round(t.ap[3]*fps)} durationInFrames={Math.round(t.shot*fps)}><ApFour/></Sequence>
 <Sequence name="11 — Amex at Schiphol" from={Math.round(t.travel[0]*fps)} durationInFrames={Math.round(t.shot*fps)}><TravelOne/></Sequence>
 <Sequence name="12 — Travel outerwear" from={Math.round(t.travel[1]*fps)} durationInFrames={Math.round(t.shot*fps)}><TravelTwo/></Sequence>
 <Sequence name="13 — Room to move" from={Math.round(t.travel[2]*fps)} durationInFrames={Math.round(t.shot*fps)}><TravelThree/></Sequence>
 <Sequence name="14 — Arrive composed" from={Math.round(t.travel[3]*fps)} durationInFrames={Math.round(t.shot*fps)}><TravelFour/></Sequence>
 <Sequence name="15 — Equinox AMAALA" from={Math.round(t.wellness[0]*fps)} durationInFrames={Math.round(t.shot*fps)}><WellnessOne/></Sequence>
 <Sequence name="16 — Balance and recovery" from={Math.round(t.wellness[1]*fps)} durationInFrames={Math.round(t.shot*fps)}><WellnessTwo/></Sequence>
 <Sequence name="17 — A softer wardrobe" from={Math.round(t.wellness[2]*fps)} durationInFrames={Math.round(t.shot*fps)}><WellnessThree/></Sequence>
 <Sequence name="18 — Dress with intention" from={Math.round(t.wellness[3]*fps)} durationInFrames={Math.round(t.shot*fps)}><WellnessFour/></Sequence>
 <Sequence name="19 — Four different worlds" from={Math.round(t.bridge[0]*fps)} durationInFrames={Math.round(t.shot*fps)}><BridgeOne/></Sequence>
 <Sequence name="20 — Make it your own" from={Math.round(t.bridge[1]*fps)} durationInFrames={Math.round(t.shot*fps)}><BridgeTwo/></Sequence>
 <Sequence name="21 — Real demo / wardrobe" from={Math.round(t.demo[0]*fps)} durationInFrames={Math.round(t.shot*fps)}><DemoShot step="AIWARDROBE / YOUR STARTING POINT" source={t.source.wardrobe} title="Your wardrobe. New possibilities." note="AIWardrobe" number="21 / 25"/></Sequence>
 <Sequence name="22 — Real demo / style selection" from={Math.round(t.demo[1]*fps)} durationInFrames={Math.round(t.shot*fps)}><DemoShot step="AIWARDROBE / CHOOSE YOUR DIRECTION" source={t.source.selection} title="The occasion. Your style." note="Find a look for the way you live." number="22 / 25"/></Sequence>
 <Sequence name="23 — Real demo / suggested outfit" from={Math.round(t.demo[2]*fps)} durationInFrames={Math.round(t.shot*fps)}><DemoShot step="AIWARDROBE / YOUR NEXT LOOK" source={t.source.result} title="See it come together." note="Explore a suggested outfit." number="23 / 25"/></Sequence>
 <Sequence name="24 — Real demo / calendar" from={Math.round(t.demo[3]*fps)} durationInFrames={Math.round(t.shot*fps)}><DemoShot step="AIWARDROBE / PLAN THE DAY" source={t.source.calendar} title="Make room for your next look." note="Plan it in your calendar." number="24 / 25"/></Sequence>
 <Sequence name="25 — Try the AIWardrobe demo" from={Math.round(t.close.from*fps)} durationInFrames={Math.round(t.close.seconds*fps)}><DemoShot step="FROM INSPIRATION TO YOUR WARDROBE" source={t.source.closeResult} title="Try AIWardrobe" note="Explore the demo → Find your next look" number="25 / 25" close/></Sequence>
 <Audio src={asset('score.wav')} volume={.52}/>
 <Sequence name="Voice / opening" from={Math.round(t.voice[0]*fps)}><Audio src={voice('voice-01.wav')}/></Sequence>
 <Sequence name="Voice / Ralph Lauren" from={Math.round(t.voice[1]*fps)}><Audio src={voice('voice-02.wav')}/></Sequence>
 <Sequence name="Voice / Audemars Piguet" from={Math.round(t.voice[2]*fps)}><Audio src={voice('voice-03.wav')}/></Sequence>
 <Sequence name="Voice / American Express" from={Math.round(t.voice[3]*fps)}><Audio src={voice('voice-04.wav')}/></Sequence>
 <Sequence name="Voice / Equinox" from={Math.round(t.voice[4]*fps)}><Audio src={voice('voice-05.wav')}/></Sequence>
 <Sequence name="Voice / wardrobe bridge" from={Math.round(t.voice[5]*fps)}><Audio src={voice('voice-06.wav')}/></Sequence>
 <Sequence name="Voice / real demo" from={Math.round(t.voice[6]*fps)}><Audio src={voice('voice-07.wav')}/></Sequence>
 <Sequence name="Voice / CTA" from={Math.round(t.voice[7]*fps)}><Audio src={voice('voice-08.wav')}/></Sequence>
 </AbsoluteFill>;};

export const FourFreedomsEditorial=()=> <FourFreedomsLocale.Provider value="en"><FourFreedomsFilm/></FourFreedomsLocale.Provider>;
export const FourFreedomsEditorialRu=()=> <FourFreedomsLocale.Provider value="ru"><FourFreedomsFilm/></FourFreedomsLocale.Provider>;
