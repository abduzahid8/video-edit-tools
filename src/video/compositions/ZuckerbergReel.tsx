import {AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {zuckerbergBrand as brand, zuckerbergReelPaper} from "../theme";
import {frames, zuckerbergReel, zuckerbergReelMotion as timing} from "../timeline";

const ease = {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)} as const;
const portrait = (name: string, extension: string) => staticFile(`assets/zuckerberg/${name}.${extension}`);

const Beat = ({beat, index}: {beat: typeof zuckerbergReel[number]; index: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const progress = (start: number, end: number) => interpolate(time, [start, end], [0, 1], ease);
  const move = 1 - progress(0, timing.enter);
  const reveal = progress(timing.annotation, timing.annotation + .45);
  const detail = time >= timing.detail;
  const product = beat.photo === "result";
  const cover = index === 0;
  const recap = index === 4;
  const look = !cover && !recap && !product;
  const exit = cover ? progress(timing.coverExit, beat.seconds) : 0;
  const drift = 1 + .05 * progress(0, beat.seconds);
  const caption = look ? progress(timing.caption, timing.caption + .4) : 1 - move;
  const focus = index === 1 ? "50% 100%" : index === 2 ? "56% 100%" : "50% 54%";
  return <AbsoluteFill style={{background: zuckerbergReelPaper, color: brand.ink, fontFamily: brand.sans, overflow: "hidden"}}>
    <div style={{position:"absolute", top:155, left:76, right:76, textAlign:"center", fontSize:22, letterSpacing:4, opacity:1-move}}>
      {beat.tag}
    </div>
    <div style={{position:"absolute", top:227, left:62, right:62, textAlign:"center", whiteSpace:"pre-line", fontFamily:brand.serif, fontSize:cover ? 94 : 92, lineHeight:1, letterSpacing:-3, transform:`translateY(${move * 65}px)`, opacity:1-move}}>
      {cover ? <>Марк Цукерберг<br/><i>в костюме</i></> : beat.title}
    </div>
    {cover && <>
      <Img src={portrait("suit", "png")} style={{position:"absolute", left:-125 - 780 * exit, bottom:300, width:810, filter:"grayscale(1)", transform:`translateY(${move * 280}px)`}}/>
      <Img src={portrait("evening", "jpg")} style={{position:"absolute", left:510 + 580 * exit, top:595 + move * 240, width:505, height:1030, objectFit:"cover", objectPosition:"50% 25%"}}/>
    </>}
    {product && <Img src={staticFile("assets/aiwardrobe/result.png")} style={{position:"absolute", top:405 + move * 170, left:331, width:418, borderRadius:36, boxShadow:"0 18px 50px #17191835"}}/>}
    {recap && <div style={{position:"absolute", top:485, left:32, display:"flex", gap:14, transform:`translateX(${move * 1000}px)`}}>
      {["suit", "hearing", "evening"].map((photo, panel) => <Img key={photo} src={portrait(photo, "jpg")} style={{width:330, height:890, objectFit:"cover", objectPosition:"50% 25%", transform:`translateY(${panel === 1 ? 100 : 0}px)`, border:`10px solid ${brand.white}`}}/>)}
    </div>}
    {look && !detail && <div style={{position:"absolute", top:560, left:218, width:644, height:890, transform:`translateX(${move * (index === 2 ? -950 : 950)}px) scale(${drift})`, border:`12px solid ${brand.white}`, boxShadow:"0 5px 24px #17191823"}}>
      <Img src={portrait(beat.photo, "jpg")} style={{width:"100%", height:"100%", objectFit:"cover", objectPosition:"50% 26%"}}/>
    </div>}
    {look && detail && <div style={{position:"absolute", left:index === 2 ? 28 : 0, top:510, width:760, height:1065, overflow:"hidden"}}>
      <Img src={portrait(beat.photo, index === 1 ? "png" : "jpg")} style={{width:"100%", height:"100%", objectFit:"cover", objectPosition:focus}}/>
    </div>}
    {look && detail && <AbsoluteFill style={{opacity:reveal}}>
      <svg width="1080" height="1920" style={{position:"absolute"}}>
        <path d={index === 1 ? "M 460 1400 L 710 1035 H 995" : index === 2 ? "M 429 1160 L 710 1035 H 995" : "M 350 965 L 710 1035 H 995"} fill="none" stroke={brand.ink} strokeWidth="3" strokeDasharray="8 7"/>
      </svg>
      <div style={{position:"absolute", right:69, top:1056, background:brand.ink, color:brand.white, fontSize:23, padding:"14px 19px", letterSpacing:1}}>
        {["", "БЕЛЫЙ ВОРОТНИК", "СИНИЙ ГАЛСТУК", "ВЫШИВКА"][index]}
      </div>
    </AbsoluteFill>}
    <div style={{position:"absolute", left:76, right:76, bottom:170, padding:product ? "28px 36px" : "24px 0", borderRadius:product ? 100 : 0, background:product ? brand.dark : undefined, color:product ? brand.white : undefined, textAlign:"center", fontFamily:brand.serif, fontSize:43, lineHeight:1.14, opacity:caption * (1-exit)}}>
      {beat.caption}
    </div>

  </AbsoluteFill>;
};

export const ZuckerbergReel = () => {
  const {fps} = useVideoConfig();
  let start = 0;
  return <AbsoluteFill>{zuckerbergReel.map((beat, index) => {
    const from = frames(start, fps);
    start += beat.seconds;
    return <Sequence key={beat.tag} name={beat.tag} from={from} durationInFrames={frames(beat.seconds, fps)}>
      <Beat beat={beat} index={index}/>
    </Sequence>;
  })}</AbsoluteFill>;
};
