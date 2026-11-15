import {LookDeck} from './DiscoveryLayers';
import {AbsoluteFill, Img, interpolate, Easing, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {focusedItemStyle as s, wardrobeGraphics as g} from '../theme';
import {actionStoryTiming as t} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.22,1,.36,1)};
const Pic=({file}:{file:string})=><Img src={staticFile(`assets/aiwardrobe/${file}.png`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>;
export const ActionStory=({kind}:{kind:'inspiration'|'shop'|'stylist'})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const times=t[kind];const step=f<times[1]*fps?0:f<times[2]*fps?1:2;
 const labels=kind==='inspiration'?['DISCOVER','COMPARE','CHOOSE']:kind==='shop'?['BROWSE','DETAILS','SELECT']:['OCCASION','STYLE','GENERATE'];
 const reveal=interpolate(f,[.25*fps,.8*fps],[0,1],ease);
 const choose=interpolate(f,[t.selectStart*fps,t.selectEnd*fps],[0,1],ease);
 return <AbsoluteFill style={{pointerEvents:'none'}}>
 {kind==='stylist'&&<div style={{position:'absolute',top:155,left:90,right:90,display:'flex',gap:20,opacity:reveal}}>{labels.map((label,i)=>{const q=interpolate(f,[times[i]*fps,(times[i]+.4)*fps],[0,1],ease);return <div key={label} style={{flex:1,display:'flex',gap:13,alignItems:'center',color:s.ink,opacity:i<=step?1:.25}}><div style={{width:33,height:33,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:30,fontSize:17,background:i<=step?s.ink:s.light,color:i<=step?s.white:s.ink,scale:.8+q*.2}}>{i+1}</div><span style={{fontSize:19,letterSpacing:2}}>{label}</span>{i<2&&<svg width="40" height="16"><path d="M 0 8 H 37 L 30 2 M 37 8 L 30 14" fill="none" stroke={s.line} strokeWidth="2"/></svg>}</div>})}</div>}
 {kind==='inspiration'&&<>
 <LookDeck/>
 {['look-one','look-two'].map((file,i)=>{const p=spring({frame:f-i*.5*fps,fps,config:{damping:22,stiffness:100}});const active=step===2?i===1:step===0?i===0:true;if(i===0)return null;return <div key={file} style={{position:'absolute',left:i?870:22,top:i?880:490,width:187,opacity:p*(active?1:.45),translate:`${(1-p)*(i?-180:180)}px ${(1-p)*100}px`,rotate:`${(1-p)*(i?18:-18)}deg`,scale:active?1:.92}}><div style={{height:250,overflow:'hidden',borderRadius:15,boxShadow:g.shadow,border:`3px solid ${step===2&&i===1?s.ink:s.white}`}}><Pic file={file}/></div></div>})}
 <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 115 820 C 85 1040 180 1290 280 1300 M 960 800 C 1000 650 960 460 840 460" stroke={s.line} strokeWidth="3" fill="none" strokeDasharray="900" strokeDashoffset={interpolate(f,[.5*fps,2*fps],[900,0],ease)}/><circle cx="960" cy="1000" r={24+choose*100} fill="none" stroke={s.ink} strokeWidth="3" opacity={Math.sin(choose*Math.PI)}/></svg>
 <div style={{position:'absolute',left:interpolate(f,[2.25*fps,2.8*fps],[870,700],ease),top:interpolate(f,[2.25*fps,2.8*fps],[880,780],ease),width:187,height:250,borderRadius:15,overflow:'hidden',opacity:interpolate(f,[2.2*fps,2.25*fps,2.8*fps],[0,.95,0],clamp),scale:interpolate(f,[2.25*fps,2.8*fps],[1,.3],ease)}}><Pic file="look-two"/></div>
 </>}
 {kind==='shop'&&<>
 <div style={{position:'absolute',left:20,top:510,width:195,height:350,opacity:reveal}}><div style={{position:'relative',height:230,overflow:'hidden',borderRadius:16,boxShadow:g.shadow,background:s.white}}>{['cardigan','shoes','polo'].map((file,i)=><div key={file} style={{position:'absolute',inset:0,translate:`${interpolate(f,[0,.65*fps,1.25*fps,3*fps],[i*205,i*205-205,i*205-205,i*205-205],ease)}px 0px`}}><Pic file={file}/></div>)}<div style={{position:'absolute',top:0,bottom:0,width:22,background:'linear-gradient(90deg,transparent,#ffffffbb,transparent)',left:interpolate(f,[1.1*fps,1.7*fps],[-30,220],ease)}}/></div><div style={{display:'flex',justifyContent:'center',gap:10,marginTop:18}}>{[0,1,2].map(i=><div key={i} style={{width:i===1?30:8,height:8,borderRadius:10,background:i===1?s.ink:s.line}}/>)}</div></div>
 <div style={{position:'absolute',left:880,top:970,width:170,height:195,borderRadius:15,overflow:'hidden',boxShadow:g.shadow,opacity:interpolate(f,[1.1*fps,1.5*fps],[0,1],ease),scale:interpolate(f,[1.1*fps,2*fps],[.65,1],ease)}}><Img src={staticFile('assets/aiwardrobe/shoes.png')} style={{width:'100%',height:'100%',objectFit:'cover',scale:1.65,translate:'-15px 8px'}}/></div>
 <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 845 1055 H 875" stroke={s.line} strokeWidth="3"/><circle cx="118" cy="620" r={25+choose*100} fill="none" stroke={s.ink} strokeWidth="3" opacity={Math.sin(choose*Math.PI)}/><path d="M 88 864 L 103 880 L 134 848" fill="none" stroke={s.ink} strokeWidth="4" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={(1-choose)*80} opacity={choose}/></svg>
 </>}

 {(kind==='inspiration'||kind==='shop')&&<>
 {kind==='inspiration'&&['coat','polo','trousers'].map((file,i)=>{const build=interpolate(f,[(.8+i*.25)*fps,(1.35+i*.25)*fps],[0,1],ease);return <div key={file} style={{position:'absolute',left:890,top:290+i*175,width:145,height:150,borderRadius:16,overflow:'hidden',boxShadow:g.shadow,opacity:build,translate:`${(1-build)*-150}px ${(1-build)*200}px`,rotate:`${(1-build)*-30}deg`,scale:.6+build*.4}}><Pic file={file}/></div>})}
 {kind==='inspiration'&&<svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 970 805 Q 1060 630 960 420" stroke={s.line} strokeWidth="2" fill="none" strokeDasharray="500" strokeDashoffset={interpolate(f,[.7*fps,1.8*fps],[500,0],ease)}/><path d="M 920 1160 L 936 1176 L 969 1142" fill="none" stroke={s.ink} strokeWidth="4" strokeDasharray="85" strokeDashoffset={(1-choose)*85}/></svg>}
 {kind==='shop'&&<>
 <svg width="1080" height="1920" style={{position:'absolute'}}><g transform={`translate(960 620) scale(${.8+choose*.2})`} opacity={interpolate(f,[1.6*fps,2.05*fps],[0,1],ease)}><circle r="62" fill={s.white} stroke={s.line} strokeWidth="2"/><path d="M 0 23 C -65 -15 -20 -49 0 -22 C 20 -49 65 -15 0 23 Z" fill={choose>.7?s.ink:'none'} stroke={s.ink} strokeWidth="3" strokeDasharray="250" strokeDashoffset={(1-choose)*250}/></g><path d="M 960 905 Q 1020 770 960 685" fill="none" stroke={s.line} strokeWidth="2" strokeDasharray="260" strokeDashoffset={(1-choose)*260}/></svg>
 <div style={{position:'absolute',left:interpolate(f,[2.05*fps,2.8*fps],[890,927],ease),top:interpolate(f,[2.05*fps,2.8*fps],[980,640],ease),width:80,height:95,borderRadius:12,overflow:'hidden',boxShadow:g.shadow,opacity:interpolate(f,[2*fps,2.1*fps,2.8*fps],[0,1,0],clamp),scale:1-choose*.5}}><Pic file="shoes"/></div>
 </>}
 </>}
 {kind==='stylist'&&<>
 <div style={{position:'absolute',left:20,top:500,width:185,opacity:reveal}}>{['Occasion','Your style','AI stylist'].map((label,i)=>{const q=interpolate(f,[times[i]*fps,(times[i]+.6)*fps],[0,1],ease);return <div key={label} style={{marginBottom:65,translate:`${(1-q)*-170}px 0px`,opacity:i<=step?1:.35}}><div style={{fontSize:48,fontWeight:650,color:s.ink,letterSpacing:-3}}>0{i+1}<span style={{fontSize:23,marginLeft:12}}>{i<step?'✓':i===step?'→':''}</span></div><div style={{fontSize:23,color:s.ink,marginTop:12}}>{label}</div><div style={{height:3,width:160,background:s.light,marginTop:18}}><div style={{height:3,width:`${q*100}%`,background:s.ink}}/></div></div>})}</div>
 <div style={{position:'absolute',left:880,top:510,width:172,height:550}}>{['polo','coat','trousers'].map((file,i)=>{const start=t.stylist[1]+i*.18;const p=interpolate(f,[start*fps,(start+.6)*fps],[0,1],ease);const merge=interpolate(f,[t.stylist[2]*fps,(t.stylist[2]+.65)*fps],[0,1],ease);return <div key={file} style={{position:'absolute',left:merge*-120,top:i*170+merge*(220-i*170),width:145,height:155,borderRadius:14,overflow:'hidden',boxShadow:g.shadow,opacity:p*(1-merge),translate:`${(1-p)*170}px 0px`,scale:1-merge*.6,rotate:`${(1-p)*20}deg`}}><Pic file={file}/></div>})}</div>
 <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 960 1120 Q 1000 1310 810 1370" stroke={s.line} strokeWidth="3" fill="none" strokeDasharray="400" strokeDashoffset={interpolate(f,[4.2*fps,4.9*fps],[400,0],ease)}/></svg>
 </>}
 </AbsoluteFill>;
};
