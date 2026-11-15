import {AbsoluteFill, Sequence, OffthreadVideo, Img, interpolate, Easing, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {wardrobeBrand as b} from '../theme';
import {wardrobeIdentityTiming as it} from '../timeline';
import {wardrobeGraphicTiming as gt} from '../timeline';
import {wardrobeGraphics as g} from '../theme';
import {FunctionMotion} from '../components/FunctionMotion';
import {wardrobe30 as t} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.16,1,.3,1)};
const files=['polo','coat','trousers','shoes'];
const Phone=({source,rate,seconds,kind}:{source:number;rate:number;seconds:number;kind:string})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const wide=kind==='daily'||kind==='stylist';
 const early=kind==='daily'||kind==='wardrobe';
 const settled=early?.82:kind==='result'?.78:wide?1.04:.98;
 return <div style={{position:'absolute',zIndex:2,left:240,top:210,width:600,height:1268,background:'#12151a',border:'3px solid #6d747d',borderRadius:80,boxShadow:'0 32px 65px #14253b25,inset 0 0 0 4px #34383e',transformOrigin:'50% 45%',translate:`${(early?-195:kind==='result'?-150:0)+interpolate(f,[0,.65*fps,(seconds-.25)*fps,seconds*fps],[kind==='shop'?150:kind==='inspiration'?-150:0,0,0,0],ease)}px ${interpolate(f,[0,.7*fps],[85,0],ease)}px`,scale:interpolate(f,[0,Math.min(.6,seconds*.35)*fps,(seconds-.3)*fps,seconds*fps],[early?.88:kind==='result'?.9:wide?1.12:.84,settled,settled,settled],ease),rotate:`${interpolate(f,[0,.7*fps],[kind==='wardrobe'?-4:kind==='shop'?4:0,0],ease)}deg`}}>
 <div style={{position:'absolute',left:-8,top:210,width:6,height:60,background:'#454951',borderRadius:4}}/><div style={{position:'absolute',left:-8,top:300,width:6,height:90,background:'#454951',borderRadius:4}}/><div style={{position:'absolute',right:-8,top:280,width:6,height:140,background:'#454951',borderRadius:4}}/>
 <div style={{position:'absolute',inset:14,borderRadius:64,overflow:'hidden'}}><OffthreadVideo src={staticFile('assets/aiwardrobe/demo-full.mp4')} muted trimBefore={Math.round(source*fps)} playbackRate={rate} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
 </div>;
};
// Product-led motion: the recording stays the focal point; graphics explain assembly only.
const ChapterProgress=({seconds}:{seconds:number})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:80,right:80,bottom:86,height:2,background:g.pale}}><div style={{height:2,background:g.ink,width:`${interpolate(f,[0,seconds*fps],[0,100],clamp)}%`}}/></div>;
};
const NewMotionItems=({kind}:{kind:string})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{pointerEvents:'none'}}>
 {kind==='result'&&<>
 <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 610 750 C 700 750 680 530 740 530 M 610 800 C 720 800 680 850 740 850" fill="none" stroke={g.line} strokeWidth="3" strokeDasharray="800" strokeDashoffset={interpolate(f,[.6*fps,1.8*fps],[800,0],ease)}/></svg>
 {files.map((file,i)=>{const p=spring({frame:f-(gt.outfitAssemble+i*gt.outfitStagger)*fps,fps,config:{damping:22,stiffness:105}});return <div key={file} style={{position:'absolute',left:650+(i%2)*205,top:440+Math.floor(i/2)*340,width:185,opacity:p,translate:`${(1-p)*-360}px ${(1-p)*(i<2?-160:160)}px`,rotate:`${(1-p)*(i%2?45:-45)}deg`,scale:.6+p*.4}}><div style={{borderRadius:22,overflow:'hidden',boxShadow:g.shadow,border:'5px solid white'}}><Img src={staticFile(`assets/aiwardrobe/${file}.png`)} style={{display:'block',width:175,height:205,objectFit:'cover'}}/></div><div style={{marginTop:18,fontSize:21,letterSpacing:3,textAlign:'center',color:g.ink}}>{['TOP','LAYER','BOTTOM','SHOES'][i]}</div></div>})}
 <div style={{position:'absolute',left:660,top:1190,fontSize:25,color:g.ink,letterSpacing:3,opacity:interpolate(f,[1.7*fps,2.3*fps],[0,1],ease)}}>4 PIECES / 1 LOOK</div>
 </>}
 </AbsoluteFill>;
};
const Caption=({title,sub,number}:{title:string;sub:string;number:string})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:70,right:70,top:1555,textAlign:'center'}}>
 <div style={{fontSize:19,letterSpacing:5,color:b.accent,marginBottom:25}}>AIWARDROBE / {number}</div>
 <div style={{overflow:'hidden'}}><div style={{fontSize:76,fontWeight:750,letterSpacing:-4,lineHeight:1.04,translate:`0px ${interpolate(f,[.15*fps,.7*fps],[180,0],ease)}px`}}>{title}</div></div>
 <div style={{fontSize:29,lineHeight:1.35,color:'#58616d',margin:'22px auto 0',maxWidth:850,opacity:interpolate(f,[.4*fps,.9*fps],[0,1],clamp)}}>{sub}</div>
 </div>;
};
const Feature=({kind,title,sub,number,source,rate,seconds}:{kind:string;title:string;sub:string;number:string;source:number;rate:number;seconds:number})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:b.background,overflow:'hidden',opacity:interpolate(f,[0,.15*fps,(seconds-.12)*fps,seconds*fps],[0,1,1,0],clamp)}}>
 <ChapterProgress seconds={seconds}/>
 <div style={{position:'absolute',top:90,left:80,right:80,display:'flex',justifyContent:'space-between',fontSize:24,letterSpacing:5,color:g.ink,opacity:interpolate(f,[0,.5*fps],[0,1],ease)}}><span>{kind==='inspiration'||kind==='shop'?'':kind==='dna'?'STYLE DNA':kind==='result'?'THE COMPLETE LOOK':kind.toUpperCase()}</span><span>{number} / 07</span></div>
 <Phone source={source} rate={rate} seconds={seconds} kind={kind}/>
 <NewMotionItems kind={kind}/>
 <FunctionMotion kind={kind}/>
 <Caption title={kind==='stylist'?(f<2.2*fps?'Choose the occasion.':f<4.2*fps?'Define your style.':'Generate your look.'):kind==='calendar'?(f<2.8*fps?'Save your look.':'Ready for your day.'):title} sub={kind==='inspiration'||kind==='shop'?'':sub} number={number}/>
 </AbsoluteFill>;
};
const IdentityCards=({end}:{end:boolean})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const assets=['polo','cardigan','coat','denim','trousers','shoes'];
 return <AbsoluteFill style={{pointerEvents:'none'}}>
 <div style={{position:'absolute',top:90,width:'100%',textAlign:'center',fontSize:205,fontWeight:800,letterSpacing:-12,color:g.pale,translate:`${interpolate(f,[0,1.4*fps],[120,0],ease)}px 0px`}}>WEAR YOUR WAY</div>
 {assets.map((file,i)=>{const p=spring({frame:f-i*it.fanStagger*fps,fps,config:{damping:24,stiffness:85}});const row=i<3?0:1;const col=i%3;return <div key={file} style={{position:'absolute',left:160+col*260,top:row?1210:350,width:220,height:260,overflow:'hidden',borderRadius:28,border:'7px solid white',boxShadow:g.shadow,opacity:p,scale:.65+p*.35,translate:`${(1-p)*(end?(col-1)*-220:(col-1)*500)}px ${(1-p)*(row?340:-340)+Math.sin(f/fps*1.5+i)*8}px`,rotate:`${(col-1)*12+(1-p)*(end?-45:40)}deg`}}><Img src={staticFile(`assets/aiwardrobe/${file}.png`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>})}
 <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 90 670 Q 40 940 100 1170 M 990 670 Q 1040 940 980 1170" fill="none" stroke={g.line} strokeWidth="3" strokeDasharray="800" strokeDashoffset={interpolate(f,[0,it.fanReveal*fps],[800,0],ease)}/></svg>
 </AbsoluteFill>;
};
const Identity=({end=false}:{end?:boolean})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'white',justifyContent:'center',alignItems:'center',overflow:'hidden',opacity:end?interpolate(f,[0,.15*fps],[0,1],clamp):interpolate(f,[(t.intro.seconds-.12)*fps,t.intro.seconds*fps],[1,0],clamp)}}>

 <IdentityCards end={end}/>
 <div style={{fontSize:end?104:112,fontWeight:800,letterSpacing:-7,scale:interpolate(f,[0,.5*fps],[.7,1],ease),opacity:interpolate(f,[0,.25*fps],[.2,1],clamp)}}>{'AIWardrobe'.split('').map((letter,i)=><span key={i} style={{display:'inline-block',translate:`0px ${interpolate(f,[i*it.letterStagger*fps,(i*it.letterStagger+.5)*fps],[80,0],ease)}px`,rotate:`${interpolate(f,[i*it.letterStagger*fps,(i*it.letterStagger+.5)*fps],[12,0],ease)}deg`}}>{letter}</span>)}<span style={{display:'inline-block',color:b.accent,rotate:`${interpolate(f,[0,.9*fps],[-180,0],ease)}deg`}}>✦</span></div>
 <div style={{fontSize:34,marginTop:32,translate:`0px ${interpolate(f,[.15*fps,.65*fps],[80,0],ease)}px`,opacity:interpolate(f,[.15*fps,.5*fps],[0,1],clamp)}}>{end?'Your wardrobe. More possibilities.':'Your style, in motion.'}</div>
 <div style={{position:'absolute',bottom:200,fontSize:20,letterSpacing:4,color:b.accent}}>WARDROBE / STYLE / PLAN</div>
 </AbsoluteFill>;
};
export const AIWardrobe=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{fontFamily:b.fontFamily,color:b.foreground,background:b.background}}>
 <Sequence name="Brand construction" durationInFrames={(t.intro.seconds+.3)*fps}><Identity/></Sequence>
 <Sequence name="Daily looks" from={t.daily.from*fps} durationInFrames={(t.daily.seconds+.3)*fps}><Feature kind="daily" title="A look for every day." sub="Discover your daily outfit suggestions." number="01" {...t.daily}/></Sequence>
 <Sequence name="Wardrobe collage" from={t.wardrobe.from*fps} durationInFrames={(t.wardrobe.seconds+.3)*fps}><Feature kind="wardrobe" title="Your wardrobe. Connected." sub="Browse your pieces and saved collections." number="02" {...t.wardrobe}/></Sequence>
 <Sequence name="Inspiration" from={t.inspiration.from*fps} durationInFrames={(t.inspiration.seconds+.3)*fps}><Feature kind="inspiration" title="Find your inspiration." sub="Explore looks. Discover your direction." number="03" {...t.inspiration}/></Sequence>
 <Sequence name="Shopping" from={t.shop.from*fps} durationInFrames={(t.shop.seconds+.3)*fps}><Feature kind="shop" title="Find your next piece." sub="Explore the shop and discover new favorites." number="04" {...t.shop}/></Sequence>
 <Sequence name="Stylist settings" from={t.stylist.from*fps} durationInFrames={(t.stylist.seconds+.3)*fps}><Feature kind="stylist" title="Make it personal." sub="Choose the occasion and your style. Generate a look." number="05" {...t.stylist}/></Sequence>
 <Sequence name="Style DNA transition" from={t.dna.from*fps} durationInFrames={(t.dna.seconds+.3)*fps}><Feature kind="dna" title="Connecting your style." sub="Your AI stylist is putting it together." number="05" {...t.dna}/></Sequence>
 <Sequence name="Outfit reveal" from={t.result.from*fps} durationInFrames={(t.result.seconds+.3)*fps}><Feature kind="result" title="One complete look." sub="A curated outfit, ready to make yours." number="06" {...t.result}/></Sequence>
 <Sequence name="Calendar save and confirmation" from={t.calendar.from*fps} durationInFrames={(t.calendar.seconds+.3)*fps}><Feature kind="calendar" title="Great style. Planned." sub="Save your outfit and see it in your calendar." number="07" {...t.calendar}/></Sequence>
 <Sequence name="Brand close" from={t.outro.from*fps} durationInFrames={t.outro.seconds*fps}><Identity end/></Sequence>
 </AbsoluteFill>;
};
