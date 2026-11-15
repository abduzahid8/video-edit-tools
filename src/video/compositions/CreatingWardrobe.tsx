import {createContext,useContext,type ReactNode} from 'react';
import {AbsoluteFill,Audio,Easing,Img,OffthreadVideo,Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {creatingWardrobeBrand as b} from '../theme';
import {creatingWardrobeTimeline as t} from '../timeline';
import {creatingWardrobeCopy,type CreatingLocale} from '../copy/creatingWardrobe';

const Locale=createContext<CreatingLocale>('en');
const useCopy=()=>creatingWardrobeCopy[useContext(Locale)];
const asset=(name:string)=>staticFile(`assets/creating-wardrobe/${name}`);
const useSeconds=()=>useCurrentFrame()/useVideoConfig().fps;
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.2,.8,.2,1)};
type Props={voiceoverReady:boolean};

function Heading({index,y=315,size=64}:{index:number;y?:number;size?:number}){
 const c=useCopy();const s=useSeconds();const ru=useContext(Locale)==='ru';
 return <div style={{position:'absolute',left:70,top:y,width:940,zIndex:10,textAlign:'center',fontFamily:b.serif,fontStyle:'italic',fontSize:ru?size*.91:size,lineHeight:1.17,letterSpacing:-1.4,
  opacity:interpolate(s,[0,.16],[.25,1],clamp),translate:`0 ${interpolate(s,[0,t.enter],[20,0],ease)}px`}}>
  {c.titles[index][0]}<br/>{c.titles[index][1]}
 </div>;
}
function Note({children,y=1650,x=70,w=940,at=.55,size=32}:{children:ReactNode;y?:number;x?:number;w?:number;at?:number;size?:number}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,textAlign:'center',fontFamily:b.serif,fontStyle:'italic',fontSize:size,color:b.muted,zIndex:12,lineHeight:1.2,
 opacity:interpolate(s,[at,at+.2],[0,1],clamp),translate:`0 ${interpolate(s,[at,at+.35],[12,0],ease)}px`}}>{children}</div>;
}
function Figure({name,x=120,y=660,h=1450,at=0,side=1}:{name:string;x?:number;y?:number;h?:number;at?:number;side?:number}){
 const s=useSeconds();return <Img src={asset(`${name}-cut.png`)} style={{position:'absolute',left:x,top:y,height:h,width:'auto',maxWidth:'none',filter:b.photograph,transformOrigin:'50% 30%',
  opacity:interpolate(s,[at,at+.08],[.15,1],clamp),
  translate:`${interpolate(s,[at,at+t.enter],[side*170,0],ease)}px ${interpolate(s,[at,at+t.enter],[40,0],ease)}px`,
  scale:interpolate(s,[0,t.shot],[1,1.025],clamp)}}/>;
}
function Photo({name,x=180,y=660,w=720,h=960,focus='50% 50%',zoom=1,at=0,angle=0}:{name:string;x?:number;y?:number;w?:number;h?:number;focus?:string;zoom?:number;at?:number;angle?:number}){
 const s=useSeconds();return <div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',rotate:`${angle}deg`,
  opacity:interpolate(s,[at,at+.12],[0,1],clamp),translate:`${interpolate(s,[at,at+t.enter],[85,0],ease)}px 0`}}>
 <Img src={asset(`${name}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:focus,filter:b.photograph,scale:zoom*interpolate(s,[0,t.shot],[1,1.035],clamp),transformOrigin:focus}}/>
 </div>;
}
function Page({index,children}:{index:number;children:ReactNode}){return <AbsoluteFill style={{background:b.paper,color:b.ink,overflow:'hidden'}}><Heading index={index}/>{children}</AbsoluteFill>;}
function Hook(){return <Page index={0}><Figure name="coast" x={80} y={665} h={1710} side={-1}/></Page>;}
function Before(){return <Page index={1}><Figure name="portrait" x={105} y={675} h={1530}/></Page>;}
function Question(){const c=useCopy();return <Page index={2}><Figure name="linen" x={90} y={850} h={1140} side={-1}/><Figure name="evening" x={650} y={945} h={1080} at={t.secondReveal}/><Note y={635}>{c.notes[1]}</Note></Page>;}
function Shirt(){return <Page index={3}><Photo name="shirt" x={170} y={660} w={740} h={1020} zoom={1.21} focus="48% 30%"/></Page>;}
function Trousers(){return <Page index={4}><Figure name="trousers" x={310} y={620} h={1260} side={-1}/></Page>;}
function Knit(){return <Page index={5}><Photo name="knit" x={165} y={650} w={750} h={1010} zoom={1.33} focus="50% 34%"/></Page>;}
function Jacket(){return <Page index={6}><Figure name="jacket" x={175} y={635} h={1370}/></Page>;}
function Foundation(){return <Page index={7}><Figure name="foundation" x={30} y={720} h={1310} side={-1}/><Figure name="walk" x={620} y={850} h={1180} at={t.secondReveal}/></Page>;}
function Fit(){const c=useCopy();const s=useSeconds();return <Page index={8}><Photo name="fit" x={255} y={670} w={650} h={960} zoom={1.23} focus="50% 31%"/>
 <svg width={1080} height={1920} style={{position:'absolute',inset:0,zIndex:8}}><path d="M 100 1070 L 300 1070 L 527 1040" fill="none" stroke={b.olive} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={interpolate(s,[t.annotation,t.annotation+.45],[1,0],ease)}/><circle cx={527} cy={1040} r={7} fill={b.paper} stroke={b.olive} strokeWidth={2} opacity={interpolate(s,[1,1.2],[0,1],clamp)}/></svg>
 <Note x={40} y={955} w={280} at={t.annotation} size={30}>{c.fit}</Note></Page>;}
function Palette(){const c=useCopy();const s=useSeconds();return <Page index={9}><Photo name="navy" x={85} y={685} w={430} h={850}/><Photo name="cream" x={565} y={755} w={430} h={850} at={t.secondReveal}/>
 <div style={{position:'absolute',left:100,right:85,top:1680,display:'flex',justifyContent:'space-around',fontFamily:b.serif,fontStyle:'italic',fontSize:31,color:b.muted,opacity:interpolate(s,[.75,1.05],[0,1],clamp)}}>{c.palette.map((label,i)=><div key={label} style={{display:'flex',alignItems:'center',gap:16}}><span style={{width:27,height:27,borderRadius:30,background:i?b.cream:b.navy}}/>{label}</div>)}</div>
 </Page>;}
function Gap(){const c=useCopy();const s=useSeconds();return <Page index={10}><Photo name="tweed" x={75} y={775} w={285} h={660} focus="50% 25%"/>
 <Photo name="duo" x={397} y={835} w={285} h={660} at={.25}/>
 <div style={{position:'absolute',left:720,top:895,width:285,height:660,border:`1px dashed ${b.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:b.serif,fontSize:100,fontStyle:'italic',color:b.line,opacity:interpolate(s,[.5,.75],[0,1],clamp)}}>?</div>
 <Note y={1600}>{c.gap}</Note></Page>;}
function Impulse(){return <Page index={11}><Figure name="trench" x={145} y={675} h={1370} side={-1}/></Page>;}
function Combinations(){return <Page index={12}><Photo name="signature" x={80} y={730} w={430} h={770}/><Photo name="tailoring" x={570} y={825} w={430} h={770} at={t.secondReveal}/></Page>;}
function Own(){return <Page index={13}><Figure name="leather" x={140} y={650} h={1510}/></Page>;}

type DemoKind='wardrobe'|'wardrobeDetail'|'occasion'|'outfit'|'outfitDetail'|'close';
function Demo({kind,index}:{kind:DemoKind;index:number}){
 const c=useCopy();const s=useSeconds();const {fps}=useVideoConfig();const detail=kind==='wardrobeDetail'||kind==='outfitDetail';const closing=kind==='close';
 return <Page index={index}>
 <div style={{position:'absolute',left:detail?140:286,top:detail?730:600,width:detail?800:508,height:detail?805:1100,overflow:'hidden',borderRadius:detail?8:24,border:`1px solid ${b.line}`,background:b.paper,
  translate:`${interpolate(s,[0,t.enter],[100,0],ease)}px 0`,opacity:interpolate(s,[0,.12],[.2,1],clamp)}}>
  <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} startFrom={Math.round(t.source[kind]*fps)} muted style={detail?{position:'absolute',width:'100%',height:'auto',top:kind==='wardrobeDetail'?-190:-195}:{width:'100%',height:'100%',objectFit:'cover'}}/>
 </div>
 <Note y={closing?1735:1755} at={.3} size={closing?37:23}>{closing?c.cta:c.demo}</Note>
 </Page>;
}
function Film({voiceoverReady}:Props){const {fps}=useVideoConfig();const locale=useContext(Locale);const c=useCopy();return <AbsoluteFill style={{background:b.paper}}>
 <Sequence name="01 / Ready to start over" from={Math.round(t.scenes.hook*fps)} durationInFrames={Math.round(t.shot*fps)}><Hook/></Sequence>
 <Sequence name="02 / Before buying" from={Math.round(t.scenes.before*fps)} durationInFrames={Math.round(t.shot*fps)}><Before/></Sequence>
 <Sequence name="03 / Buy again question" from={Math.round(t.scenes.question*fps)} durationInFrames={Math.round(t.shot*fps)}><Question/></Sequence>
 <Sequence name="04 / The shirt" from={Math.round(t.scenes.shirt*fps)} durationInFrames={Math.round(t.shot*fps)}><Shirt/></Sequence>
 <Sequence name="05 / Trouser silhouette" from={Math.round(t.scenes.trousers*fps)} durationInFrames={Math.round(t.shot*fps)}><Trousers/></Sequence>
 <Sequence name="06 / Knitwear texture" from={Math.round(t.scenes.knit*fps)} durationInFrames={Math.round(t.shot*fps)}><Knit/></Sequence>
 <Sequence name="07 / The jacket" from={Math.round(t.scenes.jacket*fps)} durationInFrames={Math.round(t.shot*fps)}><Jacket/></Sequence>
 <Sequence name="08 / Starting point" from={Math.round(t.scenes.foundation*fps)} durationInFrames={Math.round(t.shot*fps)}><Foundation/></Sequence>
 <Sequence name="09 / Fit annotation" from={Math.round(t.scenes.fit*fps)} durationInFrames={Math.round(t.shot*fps)}><Fit/></Sequence>
 <Sequence name="10 / Navy and cream" from={Math.round(t.scenes.palette*fps)} durationInFrames={Math.round(t.shot*fps)}><Palette/></Sequence>
 <Sequence name="11 / Find the missing piece" from={Math.round(t.scenes.gap*fps)} durationInFrames={Math.round(t.shot*fps)}><Gap/></Sequence>
 <Sequence name="12 / Skip impulse buying" from={Math.round(t.scenes.impulse*fps)} durationInFrames={Math.round(t.shot*fps)}><Impulse/></Sequence>
 <Sequence name="13 / Better combinations" from={Math.round(t.scenes.combinations*fps)} durationInFrames={Math.round(t.shot*fps)}><Combinations/></Sequence>
 <Sequence name="14 / What you already own" from={Math.round(t.scenes.own*fps)} durationInFrames={Math.round(t.shot*fps)}><Own/></Sequence>
 <Sequence name="15 / Real demo wardrobe" from={Math.round(t.scenes.wardrobe*fps)} durationInFrames={Math.round(t.shot*fps)}><Demo kind="wardrobe" index={14}/></Sequence>
 <Sequence name="16 / Real wardrobe close-up" from={Math.round(t.scenes.wardrobeDetail*fps)} durationInFrames={Math.round(t.shot*fps)}><Demo kind="wardrobeDetail" index={15}/></Sequence>
 <Sequence name="17 / Real occasion selection" from={Math.round(t.scenes.occasion*fps)} durationInFrames={Math.round(t.shot*fps)}><Demo kind="occasion" index={16}/></Sequence>
 <Sequence name="18 / Real outfit result" from={Math.round(t.scenes.outfit*fps)} durationInFrames={Math.round(t.shot*fps)}><Demo kind="outfit" index={17}/></Sequence>
 <Sequence name="19 / Real outfit details" from={Math.round(t.scenes.outfitDetail*fps)} durationInFrames={Math.round(t.shot*fps)}><Demo kind="outfitDetail" index={18}/></Sequence>
 <Sequence name="20 / Try AIWardrobe CTA" from={Math.round(t.scenes.close*fps)} durationInFrames={Math.round(t.shot*fps)}><Demo kind="close" index={19}/></Sequence>
 <Audio src={asset('hooks.wav')}/>
 {voiceoverReady?<Audio src={asset(`narration-${locale}.wav`)}/>:<div style={{position:'absolute',bottom:35,left:40,right:40,textAlign:'center',fontFamily:b.sans,fontSize:17,letterSpacing:.8,color:'#8d8f86',zIndex:30}}>{c.pending}</div>}
 </AbsoluteFill>;}
export const CreatingWardrobe=(props:Props)=><Locale.Provider value="en"><Film {...props}/></Locale.Provider>;
export const CreatingWardrobeRu=(props:Props)=><Locale.Provider value="ru"><Film {...props}/></Locale.Provider>;
