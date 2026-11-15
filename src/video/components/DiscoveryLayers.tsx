import {Img, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {focusedItemStyle as s, wardrobeGraphics as g} from '../theme';
import {discoveryMotionTiming as t} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.22,1,.36,1)};
const Pic=({file}:{file:string})=><Img src={staticFile(`assets/aiwardrobe/${file}.png`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>;
export const OutfitDeck=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const enter=interpolate(f,[.25*fps,.7*fps],[0,1],ease);
 return <div style={{position:'absolute',left:875,top:790,width:180,height:290,opacity:enter,translate:`${(1-enter)*-160}px 0px`}}>{[['polo','coat','trousers','shoes'],['cardigan','polo','denim','shoes'],['coat','cardigan','trousers','shoes']].map((outfit,i)=>{const turn=interpolate(f,[(.7+i*t.deckTurn)*fps,(1.15+i*t.deckTurn)*fps],[0,1],ease);return <div key={i} style={{position:'absolute',left:(2-i)*-9,top:(2-i)*-16,width:180,padding:8,display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,background:s.white,border:`1px solid ${s.line}`,borderRadius:17,boxShadow:g.shadow,zIndex:3-i,translate:`${turn*230}px ${-turn*55}px`,rotate:`${(2-i)*-4+turn*20}deg`,opacity:1-turn,scale:1-turn*.15}}>{outfit.map((file,j)=><div key={j} style={{height:88,borderRadius:8,overflow:'hidden'}}><Pic file={file}/></div>)}</div>})}</div>;
};
export const LookDeck=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const enter=interpolate(f,[.2*fps,.65*fps],[0,1],ease);
 return <div style={{position:'absolute',left:22,top:490,width:187,height:350,opacity:enter,translate:`${(1-enter)*180}px 0px`}}>{['look-three','look-one','look-two'].map((file,i)=>{const turn=interpolate(f,[(.8+i*.7)*fps,(1.2+i*.7)*fps],[0,1],ease);return <div key={file} style={{position:'absolute',left:(2-i)*7,top:(2-i)*-12,width:177,height:245,borderRadius:16,overflow:'hidden',boxShadow:g.shadow,border:'4px solid white',zIndex:3-i,translate:`${turn*-210}px ${turn*-50}px`,rotate:`${(2-i)*4-turn*18}deg`,opacity:1-turn}}><Pic file={file}/></div>})}
 <div style={{position:'absolute',top:285,left:15,display:'flex',gap:11}}>{['#303b36','#b4a38c','#c4b4a0','#192d47'].map((color,i)=><div key={color} style={{width:28,height:28,borderRadius:30,background:color,scale:interpolate(f,[(.7+i*.13)*fps,(1.1+i*.13)*fps],[0,1],ease),boxShadow:'0 5px 10px #10203015'}}/>)}</div>
 </div>;
};
export const CollectionLayers=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const p=interpolate(f,[t.collectionReveal*fps,t.collectionSettle*fps],[0,1],ease);
 return <>
 <svg width="1080" height="1920" style={{position:'absolute'}}><g transform={`translate(${interpolate(f,[.4*fps,1.6*fps],[60,980],ease)} 330)`} opacity={interpolate(f,[.2*fps,.5*fps,1.5*fps,1.8*fps],[0,1,1,0],clamp)}><path d="M -24 -18 V -28 H 24 V -18 M -24 18 V 28 H 24 V 18" fill="none" stroke={s.ink} strokeWidth="3"/><path d="M -14 0 H 14" stroke={s.ink} strokeWidth="2"/></g></svg>
 <div style={{position:'absolute',left:22,top:1050,width:185,height:245,opacity:p,translate:`0px ${(1-p)*120}px`}}>{[1,0].map(i=><div key={i} style={{position:'absolute',inset:0,background:s.white,border:`1px solid ${s.line}`,borderRadius:17,padding:10,boxShadow:g.shadow,rotate:`${i*-8}deg`,translate:`${i*-7}px ${i*-12}px`}}>{i===0&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>{['cardigan','coat','denim','shoes'].map(file=><div key={file} style={{height:98,borderRadius:8,overflow:'hidden'}}><Pic file={file}/></div>)}</div>}</div>)}<svg width="46" height="46" style={{position:'absolute',right:-12,bottom:-7}}><circle cx="23" cy="23" r="22" fill={s.ink}/><path d="M 12 23 L 20 31 L 35 14" fill="none" stroke="white" strokeWidth="3" strokeDasharray="45" strokeDashoffset={(1-p)*45}/></svg></div>
 </>;
};
