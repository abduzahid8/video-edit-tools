import { Fragment } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ZoomTransition, BlurTransition } from "../transitions";
import { PromoScene } from "../scenes/PromoScene";
import { getTimeline, type SceneId } from "../timeline";
import type { ScreenSource } from "../components/Media";
import { AudioTrack, type AudioCue } from "../components/AudioTrack";
export type PromoProps = {
  logo?: string;
  frameSrc?: string;
  screens?: Partial<Record<SceneId, ScreenSource>>;
  music?: AudioCue;
  sounds?: AudioCue[];
};
export const AltaPromo = ({
  logo,
  frameSrc,
  screens = {},
  music,
  sounds = [],
}: PromoProps) => {
  const { fps } = useVideoConfig();
  const { scenes, overlap } = getTimeline(fps);
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {scenes.map((s, i) => (
          <Fragment key={s.id}>
            <TransitionSeries.Sequence
              name={`${i + 1}. ${s.id}`}
              durationInFrames={s.duration}
            >
              <PromoScene
                id={s.id}
                source={screens[s.id] ?? {}}
                logo={logo}
                frameSrc={frameSrc}
              />
            </TransitionSeries.Sequence>
            {i < scenes.length - 1 && (
              <TransitionSeries.Transition
                timing={linearTiming({ durationInFrames: overlap })}
                presentation={
                  i === 1
                    ? { component: ZoomTransition, props: {} }
                    : i === 4
                      ? { component: BlurTransition, props: {} }
                      : fade()
                }
              />
            )}
          </Fragment>
        ))}
      </TransitionSeries>
      {music && <AudioTrack {...music} />}{" "}
      {sounds.map((sound, i) => (
        <AudioTrack key={i} {...sound} />
      ))}
    </AbsoluteFill>
  );
};
