import {AbsoluteFill, Img, interpolate, Easing, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {focusedItemStyle as s, wardrobeGraphics as g} from '../theme';
import {rebuiltEarlyScenes as t} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.22,1,.36,1)};
const Garment=({file}:{file:string})=><Img src={staticFile(`assets/aiwardrobe/${file}.png`)} style={{width:'100%',height:'100%',objectFit:'contain',mixBlendMode:'multiply'}}/>;
export const DailyWardrobeMotion=({kind}:{kind:'daily'|'wardrobe'})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const selected=interpolate(f,[t.selected*fps,t.selectedEnd*fps],[0,1],ease);
 const rack=interpolate(f,[t.rackStart*fps,t.rackEnd*fps],[0,1],ease);
 const group=interpolate(f,[t.groupStart*fps,t.groupEnd*fps],[0,1],ease);
 return <AbsoluteFill style={{pointerEvents:'none',clipPath:'inset(180px 18px 430px 630px)'}}> 
 {kind==='daily'&&<>
 <svg width="1080" height="1920" style={{position:'absolute'}}><ellipse cx="830" cy="900" rx="205" ry="400" fill={g.pale} opacity="0.45"/><path d="M 644 420 H 1015 M 644 1355 H 1015" stroke={s.line} strokeWidth="2" strokeDasharray="750" strokeDashoffset={interpolate(f,[0,.8*fps],[750,0],ease)}/></svg>
 {['polo','coat','trousers','shoes'].map((file,i)=>{const p=spring({frame:f-(t.assemble+i*t.assembleStagger)*fps,fps,config:{damping:24,stiffness:110}});const x=[655,840,680,850][i]!;const y=[460,445,810,1030][i]!;const widths=[170,185,155,180][i]!;const heights=[235,335,340,150][i]!;return <div key={file} style={{position:'absolute',left:x,top:y,width:widths,height:heights,opacity:p,translate:`${(1-p)*(i%2?260:-160)}px ${(1-p)*(i<2?-220:220)}px`,rotate:`${(1-p)*(i%2?30:-30)}deg`,scale:.75+p*.25}}><Garment file={file}/></div>})}
 <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 672 440 H 648 V 1190 H 672 M 1002 440 H 1026 V 1190 H 1002" stroke={s.ink} strokeWidth="2" fill="none" strokeDasharray="1600" strokeDashoffset={(1-selected)*1600}/><g transform={`translate(835 1270) scale(${.7+selected*.3})`} opacity={selected}><circle r="44" fill={s.ink}/><path d="M -21 0 L -6 15 L 23 -17" stroke="white" fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="75" strokeDashoffset={(1-selected)*75}/></g></svg>
 </>}
 {kind==='wardrobe'&&<>
 <svg width="1080" height="1920" style={{position:'absolute',opacity:1-group}}><path d="M 655 1215 V 405 Q 655 385 675 385 H 1007 Q 1027 385 1027 405 V 1215 M 632 1215 H 679 M 1003 1215 H 1050 M 655 960 H 1027" fill="none" stroke={s.line} strokeWidth="3" strokeDasharray="2400" strokeDashoffset={(1-rack)*2400}/>{[716,840,963].map((x,i)=><g key={x} transform={`translate(${x} 410)`} opacity={rack}><path d="M -5 -12 Q -5 -25 7 -20 Q 16 -15 5 -5 V 3 L 38 24 H -38 L 5 3" fill="none" stroke={s.ink} strokeWidth="2"/></g>)}</svg>
 {['cardigan','polo','coat','denim','shoes'].map((file,i)=>{const p=spring({frame:f-(.3+i*.12)*fps,fps,config:{damping:24,stiffness:100}});const col=i%3;const x=i<3?662+col*124:i===3?680:865;const y=i<3?450:990;const q=group;const destX=692+(i%2)*155;const destY=500+Math.floor(i/2)*200;return <div key={file} style={{position:'absolute',left:x+(destX-x)*q,top:y+(destY-y)*q,width:(i<3?116:150)+(140-(i<3?116:150))*q,height:(i<3?275:195)+(170-(i<3?275:195))*q,opacity:p,translate:`${(1-p)*(i%2?220:-180)}px ${(1-p)*-160}px`,rotate:`${(1-p)*(i%2?20:-20)}deg`,scale:1-q*.1}}><Garment file={file}/></div>})}
 <svg width="1080" height="1920" style={{position:'absolute'}}><rect x="674" y="462" width="330" height="660" rx="24" fill="none" stroke={s.ink} strokeWidth="2" opacity={group} strokeDasharray="2000" strokeDashoffset={(1-group)*2000}/><g transform="translate(840 1280)" opacity={group}><path d="M -35 -20 H -5 L 5 -10 H 40 V 27 H -35 Z" fill={s.white} stroke={s.ink} strokeWidth="2"/><path d="M -15 5 L -4 16 L 20 -9" fill="none" stroke={s.ink} strokeWidth="3" strokeDasharray="60" strokeDashoffset={(1-group)*60}/></g></svg>
 </>}
 </AbsoluteFill>;
};
