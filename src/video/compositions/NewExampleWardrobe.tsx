import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {newExampleWardrobeBrand as brand} from '../theme';
import {newExampleWardrobeTimeline as timing} from '../timeline';

type ShotData = {file: number; caption: string; weight: number; focus?: string; monochrome?: boolean};

const sections: ShotData[][] = [
  [
    {file: 20, caption: 'A wardrobe tells', weight: 1.15},
    {file: 31, caption: 'a story before', weight: 1.12},
    {file: 7, caption: 'you say a word.', weight: 1.08},
    {file: 32, caption: 'Not through a logo,', weight: 1.3},
    {file: 21, caption: 'or one perfect outfit.', weight: 1.2},
    {file: 40, caption: 'Through the pieces', weight: 1.1},
    {file: 41, caption: 'you reach for every day,', weight: 1.28},
    {file: 52, caption: 'and the way you wear them', weight: 1.26},
    {file: 72, caption: 'without thinking.', weight: 1.12},
  ],
  [
    {file: 2, caption: 'It starts with shape.', weight: 1.22},
    {file: 18, caption: 'A jacket', weight: 1.02},
    {file: 42, caption: 'with room to move.', weight: 1.12},
    {file: 51, caption: 'Trousers that fall', weight: 1.16},
    {file: 54, caption: 'just right.', weight: 1.1},
    {file: 55, caption: 'A shirt that still looks good', weight: 1.28},
    {file: 57, caption: 'at the end', weight: 1.02},
    {file: 58, caption: 'of a long day.', weight: 1.2},
    {file: 63, caption: 'And then you wear them again.', weight: 1.3},
  ],
  [
    {file: 23, caption: 'Over time,', weight: 1.1},
    {file: 28, caption: 'the details become yours.', weight: 1.26},
    {file: 36, caption: 'A collar left open.', weight: 1.18},
    {file: 44, caption: 'A soft knit.', weight: 1.08},
    {file: 47, caption: 'A tie', weight: 1.03},
    {file: 62, caption: 'that changes the mood.', weight: 1.18},
    {file: 64, caption: 'The same colours,', weight: 1.13},
    {file: 67, caption: 'finding new ways', weight: 1.15},
    {file: 70, caption: 'to work together.', weight: 1.16},
  ],
  [
    {file: 4, caption: "That's the secret.", weight: 1.13},
    {file: 6, caption: 'Style is not a different person', weight: 1.38},
    {file: 15, caption: 'every morning.', weight: 1.08},
    {file: 24, caption: "It's a familiar point of view,", weight: 1.34},
    {file: 26, caption: 'made visible.', weight: 1.08},
    {file: 34, caption: 'Keep what works.', weight: 1.1},
    {file: 38, caption: 'Wear it often.', weight: 1.09},
    {file: 50, caption: 'Make it yours.', weight: 1.15},
  ],
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const photo = (n: number) => staticFile(`assets/new-example-wardrobe/look-${String(n).padStart(2, '0')}.jpg`);
const sound = (n: number) => staticFile(`assets/new-example-wardrobe/voice-${String(n).padStart(2, '0')}.wav`);

function DocumentaryShot({shot, index, durationFrames}: {shot: ShotData; index: number; durationFrames: number}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = Math.min(1, frame / Math.max(1, durationFrames - 1));
  const dir = index % 2 === 0 ? 1 : -1;
  const light = index % 5 === 2;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#20211d'}}>
    <Img src={photo(shot.file)} style={{position: 'absolute', left: -35, top: -45, width: 1150, height: 2010,
      objectFit: 'cover', objectPosition: shot.focus ?? '50% 48%',
      scale: interpolate(t, [0, 1], [1.005, 1.055], clamp),
      translate: `${interpolate(t, [0, 1], [-dir * 18, dir * 23], clamp)}px ${interpolate(t, [0, 1], [12, -17], clamp)}px`,
      filter: shot.monochrome ? 'grayscale(1)' : 'saturate(.96) contrast(1.035)',
    }}/>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 38%, rgba(0,0,0,.12) 56%, transparent 72%)'}}/>
    <div style={{position: 'absolute', left: 60, right: 60, top: 953, textAlign: 'center',
      color: brand.white, fontFamily: brand.sans, fontSize: 31, fontWeight: 500,
      letterSpacing: -.45, lineHeight: 1.22, textShadow: brand.captionShadow,
      opacity: interpolate(frame, [0, Math.round(.12 * fps), Math.max(1, durationFrames - Math.round(.12 * fps)), durationFrames], [0, 1, 1, 0], clamp),
      translate: `0 ${interpolate(frame, [0, Math.round(.16 * fps)], [9, 0], clamp)}px`,
    }}>{shot.caption}</div>
    {light && <div style={{position: 'absolute', inset: 0, background: brand.white,
      opacity: interpolate(frame, [0, Math.round(.1 * fps)], [.14, 0], clamp), pointerEvents: 'none'}}/>}
  </AbsoluteFill>;
}

function RedCard({text, final = false}: {text: string; final?: boolean}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: brand.red, color: brand.white, fontFamily: brand.sans}}>
    <div style={{position: 'absolute', top: final ? 845 : 945, left: 80, right: 80, textAlign: 'center',
      fontSize: final ? 46 : 27, lineHeight: 1.35, fontWeight: final ? 600 : 500,
      letterSpacing: final ? 3.4 : -.1,
      opacity: interpolate(frame, [0, Math.round(.15 * fps)], [0, 1], clamp),
      translate: `0 ${interpolate(frame, [0, Math.round(.22 * fps)], [14, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px`,
    }}>{text}</div>
    {final && <div style={{position: 'absolute', top: 940, left: 80, right: 80, textAlign: 'center', fontSize: 23,
      letterSpacing: .5, opacity: interpolate(frame, [Math.round(.2 * fps), Math.round(.45 * fps)], [0, 1], clamp),
    }}>YOUR WARDROBE. YOUR STORY.</div>}
  </AbsoluteFill>;
}

export const NewExampleWardrobe = () => {
  const {fps} = useVideoConfig();
  const allShots = sections.flatMap((section, sectionIndex) => {
    const range = timing.sections[sectionIndex];
    const totalWeight = section.reduce((sum, shot) => sum + shot.weight, 0);
    let weightBefore = 0;
    return section.map((shot, shotIndex) => {
      const from = range.from + (range.end - range.from) * weightBefore / totalWeight;
      weightBefore += shot.weight;
      const end = range.from + (range.end - range.from) * weightBefore / totalWeight;
      return {shot, from, end, index: sections.slice(0, sectionIndex).reduce((n, s) => n + s.length, 0) + shotIndex};
    });
  });
  const cardTexts = ['The shape comes first.', 'Then the details.', 'Keep what works.', 'ALTA'];
  return <AbsoluteFill style={{background: brand.ink}}>
    {allShots.map(({shot, from, end, index}) => <Sequence key={shot.file} from={Math.round(from * fps)} durationInFrames={Math.round(end * fps) - Math.round(from * fps)}>
      <DocumentaryShot shot={shot} index={index} durationFrames={Math.round(end * fps) - Math.round(from * fps)}/>
    </Sequence>)}
    {timing.cards.map((card, index) => <Sequence key={card.from} from={Math.round(card.from * fps)} durationInFrames={Math.round((card.end - card.from) * fps)}>
      <RedCard text={cardTexts[index]} final={index === 3}/>
    </Sequence>)}
    <Audio src={staticFile('assets/new-example-wardrobe/score-48.wav')} volume={0.13}/>
    {timing.voice.map((from, index) => <Sequence key={from} from={Math.round(from * fps)}>
      <Audio src={sound(index + 1)} volume={1}/>
    </Sequence>)}
  </AbsoluteFill>;
};
