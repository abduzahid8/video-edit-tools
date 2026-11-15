import {AbsoluteFill, Sequence, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ReactNode} from 'react';
import {wardrobeBrand as b} from '../theme';
import {wardrobeTimeline as t} from '../timeline';
const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;
const Reveal = ({children, delay=0}:{children:ReactNode;delay?:number}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  return <div style={{overflow:'hidden'}}><div style={{translate:`0 ${interpolate(f,[delay*fps,(delay+.65)*fps],[110,0],clamp)}%`,opacity:interpolate(f,[delay*fps,(delay+.3)*fps],[0,1],clamp)}}>{children}</div></div>;
};
const Title = ({end=false}:{end?:boolean}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <AbsoluteFill style={{background:b.background,color:b.foreground,justifyContent:'center',padding:70}}>
    <div style={{position:'absolute',top:84,fontSize:20,letterSpacing:5}}>AIWARDROBE <span style={{color:b.muted}}> / PERSONAL STYLE</span></div>
    <div style={{fontSize: end?100:122,fontWeight:800,letterSpacing:-7,lineHeight:.98}}>
      <Reveal>{end?'Your style.':'Less “what'}</Reveal><Reveal delay={.15}>{end?'Reimagined.':'to wear?”'}</Reveal>
      {!end&&<div style={{color:b.accent,marginTop:30}}><Reveal delay={.65}>More you.</Reveal></div>}
    </div>
    <div style={{position:'absolute',bottom:180,left:70,right:70}}><div style={{height:2,background:'#383b40',marginBottom:35}}><div style={{height:2,width:`${interpolate(f,[0,2.5*fps],[0,100],clamp)}%`,background:b.accent}}/></div><Reveal delay={.7}><div style={{fontSize:31,letterSpacing:-1}}>{end?'AIWardrobe':'A wardrobe with a point of view.'}</div></Reveal></div>
  </AbsoluteFill>;
};
const Demo = ({title,sub,source,seconds,index,light=false,focus=false,rate=1}:{title:string;sub:string;source:number;seconds:number;index:string;light?:boolean;focus?:boolean;rate?:number}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  const enter=spring({frame:f,fps,config:{damping:22,stiffness:105}});
  return <AbsoluteFill style={{background:b.background,color:b.foreground,overflow:'hidden'}}>
    <div style={{position:'absolute',top:63,left:62,right:62,display:'flex',justifyContent:'space-between',fontSize:18,letterSpacing:4}}><span>AIWARDROBE</span><span>{index} / 07</span></div>
    <div style={{position:'absolute',top:145,left:62,right:62,fontWeight:750,fontSize:70,lineHeight:1.04,letterSpacing:-3}}><Reveal>{title}</Reveal><div style={{fontSize:25,fontWeight:400,letterSpacing:0,marginTop:20,color:light?'#555f6d':b.muted}}><Reveal delay={.15}>{sub}</Reveal></div></div>
    <div style={{position:'absolute',top:365,left:210,width:660,height:1395,border:'3px solid #727780',borderRadius:87,boxShadow:'0 30px 65px #14253b25, inset 0 0 0 5px #292d34',background:'#111317',translate:`${(1-enter)*140}px ${(1-enter)*180}px`,rotate:`${interpolate(f,[0,.9*fps,seconds*fps],[-4,0,0],clamp)}deg`,scale:interpolate(f,[0,.9*fps,seconds*fps],[.95,1,1],clamp)}}>
      <div style={{position:'absolute',left:-8,top:240,width:6,height:65,background:'#454951',borderRadius:4}}/><div style={{position:'absolute',left:-8,top:335,width:6,height:100,background:'#454951',borderRadius:4}}/><div style={{position:'absolute',right:-8,top:310,width:6,height:150,background:'#454951',borderRadius:4}}/>
      <div style={{position:'absolute',inset:15,overflow:'hidden',borderRadius:70}}>
      <OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} muted playbackRate={rate} trimBefore={source*fps} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 50%'}}/>
      </div>
    </div>
    <div style={{position:'absolute',bottom:64,left:62,right:62,display:'flex',alignItems:'center',gap:20,fontSize:19,letterSpacing:2}}><span style={{display:'inline-block',width:8,height:8,borderRadius:10,background:light?'#173353':b.accent}}/> YOUR WARDROBE. YOUR POSSIBILITIES.<span style={{marginLeft:'auto'}}>↗</span></div>
    <div style={{position:'absolute',top:0,bottom:0,right:0,width:`${interpolate(f,[0,.35*fps],[100,0],clamp)}%`,background:'#ffffff'}}/>
  </AbsoluteFill>;
};
export const AIWardrobe58 = () => {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{fontFamily:b.fontFamily}}>
 <Sequence name="Opening typography" durationInFrames={t.intro*fps}><Title/></Sequence>
 <Sequence name="Daily outfit suggestions" from={3*fps} durationInFrames={4*fps}><Demo title="Meet your next look." sub="Every day starts with a little inspiration." source={0} seconds={4} index="01"/></Sequence>
 <Sequence name="Your real wardrobe" from={7*fps} durationInFrames={5*fps}><Demo title="Your wardrobe. Connected." sub="Keep your pieces in one place." source={10} seconds={5} index="01"/></Sequence>
 <Sequence name="Inspiration guide" from={12*fps} durationInFrames={t.inspiration*fps}><Demo title="Find your direction." sub="Explore ideas that feel like you." source={22} seconds={7} index="02" light/></Sequence>
 <Sequence name="Shop real pieces" from={19*fps} durationInFrames={t.shop*fps}><Demo title="See it. Style it." sub="Discover pieces for your next outfit." source={30} seconds={6} index="03"/></Sequence>
 <Sequence name="Personal AI stylist" from={25*fps} durationInFrames={t.stylist*fps}><Demo title="Set the occasion." sub="Your plans. Your preferences. Your AI stylist." source={42} seconds={10} index="04" light/></Sequence>
 <Sequence name="Style DNA" from={35*fps} durationInFrames={t.matching*fps}><Demo title="Connecting your style." sub="Watch the combinations come together." source={55} seconds={3} index="05"/></Sequence>
 <Sequence name="Generated outfit reveal" from={38*fps} durationInFrames={t.result*fps}><Demo title="A look that clicks." sub="From individual pieces to a complete outfit." source={65} rate={0.5} seconds={8} index="06" light/></Sequence>
 <Sequence name="Save and plan" from={46*fps} durationInFrames={t.calendar*fps}><Demo title="Good style. Planned." sub="Save the look. Make it part of your day." source={69} rate={0.875} seconds={8} index="07"/></Sequence>
 <Sequence name="Closing typography" from={54*fps} durationInFrames={t.outro*fps}><Title end/></Sequence>
 </AbsoluteFill>;
};
