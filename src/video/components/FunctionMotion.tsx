import {DailyWardrobeMotion} from './DailyWardrobeMotion';
import {ActionStory} from './ActionStory';
import {AbsoluteFill, Img, interpolate, Easing, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {focusedItemStyle as s, wardrobeGraphics as g} from '../theme';
import {functionMotionTiming as t} from '../timeline';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease={...clamp,easing:Easing.bezier(.22,1,.36,1)};
const Photo=({file}:{file:string})=><Img src={staticFile(`assets/aiwardrobe/${file}.png`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>;
const Label=({children}:{children:string})=><div style={{fontSize:18,letterSpacing:3,color:s.ink,marginTop:16,textAlign:'center'}}>{children}</div>;
export const FunctionMotion=({kind}:{kind:string})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const p=interpolate(f,[t.enter*fps,t.reveal*fps],[0,1],ease);
 const compare=interpolate(f,[t.compare*fps,t.compareSettle*fps],[0,1],ease);
 const land=interpolate(f,[t.calendarTransfer*fps,t.calendarLand*fps],[0,1],ease);
 const step=f<t.style*fps?0:f<t.generate*fps?1:2;
 return <AbsoluteFill style={{pointerEvents:'none'}}>
 {(kind==='daily'||kind==='wardrobe')&&<DailyWardrobeMotion kind={kind}/>}
 {(kind==='inspiration'||kind==='shop'||kind==='stylist')&&<ActionStory kind={kind}/>}
 {kind==='calendar'&&<>
 <div style={{position:'absolute',left:870,top:470,width:175,color:s.ink,opacity:land,translate:`0px ${(1-land)*90}px`,scale:1+Math.sin(land*Math.PI)*.08}}>
 <div style={{fontSize:18,letterSpacing:4,borderTop:`2px solid ${s.ink}`,paddingTop:18}}>WED / NOV</div><div style={{fontSize:100,letterSpacing:-6,lineHeight:1.2,fontWeight:650}}>04</div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,padding:8,background:s.light,borderRadius:12,marginTop:18}}>{['polo','coat','trousers','shoes'].map(file=><div key={file} style={{height:78,overflow:'hidden',borderRadius:7}}><Photo file={file}/></div>)}</div>
 <div style={{marginTop:22,display:'flex',alignItems:'center',gap:12,fontSize:20,letterSpacing:2}}><svg width="26" height="26"><path d="M 2 12 L 10 21 L 24 4" stroke={s.ink} strokeWidth="3" fill="none" strokeDasharray="40" strokeDashoffset={(1-land)*40}/></svg>SAVED</div>
 </div>
 <div style={{position:'absolute',left:interpolate(f,[t.calendarTransfer*fps,t.calendarLand*fps],[650,915],ease),top:interpolate(f,[t.calendarTransfer*fps,t.calendarLand*fps],[1110,765],ease),width:85,height:100,overflow:'hidden',borderRadius:10,boxShadow:g.shadow,opacity:f<t.calendarTransfer*fps?0:1-land,scale:1.4-land*.5,rotate:`${(1-land)*-15}deg`}}><Photo file="coat"/></div>
 <svg width="1080" height="1920" style={{position:'absolute'}}><path d="M 820 1100 Q 1000 1060 953 910" fill="none" stroke={s.line} strokeWidth="2" strokeDasharray="400" strokeDashoffset={(1-land)*400} opacity={land}/></svg>
 </>}
 </AbsoluteFill>;
};
