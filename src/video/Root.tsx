import {TasteOverPrice, TasteOverPriceRu} from "./compositions/TasteOverPrice";
import {tasteOverPriceTimeline} from "./timeline";
import {StylePsychology, StylePsychologyRu} from "./compositions/StylePsychology";
import {stylePsychologyTimeline} from "./timeline";
import {FourFreedomsEditorial, FourFreedomsEditorialRu} from "./compositions/FourFreedomsEditorial";
import {fourFreedomsTimeline} from "./timeline";
import {HeritageJackets, HeritageJacketsRu} from "./compositions/HeritageJackets";
import {heritageJacketsTimeline} from "./timeline";
import {PremiumWardrobeV2, PremiumWardrobeV2Ru} from "./compositions/PremiumWardrobeV2";
import {premiumWardrobeTimeline} from "./timeline";
import {WardrobeIdentityEditorial} from "./compositions/WardrobeIdentityEditorial";
import {RalphLaurenEditorial as RalphLaurenEditorialV5} from "./compositions/RalphLaurenEditorial";
import {RalphLaurenEditorialV6, RalphLaurenEditorialV6Ru} from "./compositions/RalphLaurenEditorialV6";
import {RalphLaurenEditorialV7} from "./compositions/RalphLaurenEditorialV7";
import {ralphLaurenFastTimeline, ralphLaurenKineticTimeline, ralphLaurenTimeline} from "./timeline";
import {NewExampleWardrobe} from "./compositions/NewExampleWardrobe";
import {newExampleWardrobeTimeline} from "./timeline";
import {WardrobeModelsEditorial, WardrobeModelsEditorialRu} from "./compositions/WardrobeModelsEditorial";
import {modelWardrobeTimeline} from "./timeline";
import {founderWardrobeTimeline} from "./timeline";
import {TomFordArchive, TomFordArchiveEnglish} from "./compositions/TomFordArchive";
import {fordArchiveTimeline} from "./timeline";
import {TomFordPaper, TomFordPaperEnglish} from "./compositions/TomFordPaper";
import {fordPaperTimeline} from "./timeline";
import {TomFordEditorial, TomFordEditorialEnglish} from "./compositions/TomFordEditorial";
import {fordEditorialTimeline} from "./timeline";
import {CapsuleEditorialEnglish} from "./compositions/CapsuleEditorialEnglish";
import {CapsuleEditorial} from "./compositions/CapsuleEditorial";
import {capsuleEditorialTimeline} from "./timeline";
import {BootsEvolutionEnglish} from "./compositions/BootsEvolutionEnglish";
import {BootsEvolution} from "./compositions/BootsEvolution";
import {bootsEditorialTimeline} from "./timeline";
import {FallWardrobeEditorialRu} from "./compositions/FallWardrobeEditorialRu";
import {FallWardrobeEditorial} from "./compositions/FallWardrobeEditorial";
import {fallEditorialTimeline} from "./timeline";
import {SmartCasualShopping} from "./compositions/SmartCasualShopping";
import {shoppingEditorialTimeline} from "./timeline";
import {ShirtEditorial} from "./compositions/ShirtEditorial";
import {OlivePaletteEditorial} from "./compositions/OlivePaletteEditorial";
import {BlazerEditorial} from "./compositions/BlazerEditorial";
import {HemEditorial} from "./compositions/HemEditorial";
import {CollarEditorial} from "./compositions/CollarEditorial";
import {NavyPaletteEditorial} from "./compositions/NavyPaletteEditorial";
import {navyPaletteDuration} from "./timeline";
import {KnitEditorial} from "./compositions/KnitEditorial";
import {knitDuration} from "./timeline";
import {AccentEditorial} from "./compositions/AccentEditorial";
import {accentEditorialDuration} from "./timeline";
import {JacketEditorial} from "./compositions/JacketEditorial";
import {jacketEditorialDuration} from "./timeline";
import {FootwearEditorial} from "./compositions/FootwearEditorial";
import {footwearDuration} from "./timeline";
import {LightPaletteEditorial} from "./compositions/LightPaletteEditorial";
import {lightPaletteDuration} from "./timeline";
import {ShoulderEditorial} from "./compositions/ShoulderEditorial";
import {shoulderEditorialDuration} from "./timeline";

import {ZuckerbergReel} from "./compositions/ZuckerbergReel";
import {zuckerbergReelDuration} from "./timeline";
import {ZuckerbergEditorial} from "./compositions/ZuckerbergEditorial";
import {frames, zuckerbergDuration} from "./timeline";

import {ColorEditorial} from "./compositions/ColorEditorial";
import {colorEditorialTimeline} from "./timeline";
import { Composition, Folder } from "remotion";
import { AltaTest } from "./compositions/AltaTest";
import { AltaPromo } from "./compositions/AltaPromo";
import { IntegrationCheck } from "./compositions/IntegrationCheck";
import { FPS, getTimeline } from "./timeline";
import { AIWardrobe } from "./compositions/AIWardrobe";
import { wardrobe30Duration } from "./timeline";
import { AIWardrobeStorm } from "./compositions/AIWardrobeStorm";
import { stormTimeline } from "./timeline";
import { AranSweater } from "./compositions/AranSweater";
import { aranTimeline } from "./timeline";
import { OldMoney } from "./compositions/OldMoney";
import { oldMoneyTimeline } from "./timeline";
import { KnivesOutEditorial } from "./compositions/KnivesOutEditorial";
import { knivesEditorialTimeline } from "./timeline";
import { KnivesOutCollage } from "./compositions/KnivesOutCollage";
import { knivesCollageTimeline } from "./timeline";

import { LayeringEditorial } from "./compositions/LayeringEditorial";
import { layeringTimeline } from "./timeline";
import {PriceStyleEditorial, PriceStyleEditorialRu} from "./compositions/PriceStyleEditorial";
import {priceStyleTimeline} from "./timeline";
import {WardrobeBecoming, WardrobeBecomingRu} from "./compositions/WardrobeBecoming";
import {becomingTimeline} from "./timeline";
export const Root = () => (
  <>
    <Composition id="AIWardrobeTasteOverPrice" component={TasteOverPrice} width={1080} height={1920} fps={FPS} durationInFrames={frames(tasteOverPriceTimeline.duration, FPS)} />
    <Composition id="AIWardrobeTasteOverPriceRu" component={TasteOverPriceRu} width={1080} height={1920} fps={FPS} durationInFrames={frames(tasteOverPriceTimeline.duration, FPS)} />
    <Composition id="AIWardrobeStylePsychology" component={StylePsychology} width={1080} height={1920} fps={FPS} durationInFrames={frames(stylePsychologyTimeline.duration, FPS)} />
    <Composition id="AIWardrobeStylePsychologyRu" component={StylePsychologyRu} width={1080} height={1920} fps={FPS} durationInFrames={frames(stylePsychologyTimeline.duration, FPS)} />
    <Composition id="AIWardrobeFourStoriesRu" component={FourFreedomsEditorialRu} width={1080} height={1920} fps={FPS} durationInFrames={frames(fourFreedomsTimeline.duration, FPS)} />
    <Composition id="AIWardrobeFourStories" component={FourFreedomsEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(fourFreedomsTimeline.duration, FPS)} />
    <Composition id="AIWardrobeHeritageJacketsRu" component={HeritageJacketsRu} width={1080} height={1920} fps={FPS} durationInFrames={frames(heritageJacketsTimeline.duration, FPS)} />
    <Composition id="AIWardrobeHeritageJackets" component={HeritageJackets} width={1080} height={1920} fps={FPS} durationInFrames={frames(heritageJacketsTimeline.duration, FPS)} />
    <Composition id="AIWardrobePremiumV2" component={PremiumWardrobeV2} width={1080} height={1920} fps={FPS} durationInFrames={frames(premiumWardrobeTimeline.duration, FPS)} />
    <Composition id="AIWardrobePremiumV2Ru" component={PremiumWardrobeV2Ru} width={1080} height={1920} fps={FPS} durationInFrames={frames(premiumWardrobeTimeline.duration, FPS)} />
    <Composition id="RalphLaurenEditorial" component={RalphLaurenEditorialV7} width={1080} height={1920} fps={FPS} durationInFrames={frames(ralphLaurenKineticTimeline.duration, FPS)} />
    <Composition id="RalphLaurenEditorialV6" component={RalphLaurenEditorialV6} width={1080} height={1920} fps={FPS} durationInFrames={frames(ralphLaurenFastTimeline.duration, FPS)} />
    <Composition id="RalphLaurenEditorialV6Ru" component={RalphLaurenEditorialV6Ru} width={1080} height={1920} fps={FPS} durationInFrames={frames(ralphLaurenFastTimeline.duration, FPS)} />
    <Composition id="RalphLaurenEditorialV5" component={RalphLaurenEditorialV5} width={1080} height={1920} fps={FPS} durationInFrames={frames(ralphLaurenTimeline.duration, FPS)} />
    <Composition id="NewExampleWardrobe" component={NewExampleWardrobe} width={1080} height={1920} fps={FPS} durationInFrames={frames(newExampleWardrobeTimeline.duration, FPS)} />
    <Composition id="WardrobeModelsEditorial" component={WardrobeModelsEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(modelWardrobeTimeline.duration, FPS)} />
    <Composition id="WardrobeModelsEditorialRu" component={WardrobeModelsEditorialRu} width={1080} height={1920} fps={FPS} durationInFrames={frames(modelWardrobeTimeline.duration, FPS)} />
    <Composition id="WardrobeIdentityEditorial" component={WardrobeIdentityEditorial} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(founderWardrobeTimeline.duration * FPS)} />
    <Composition id="TomFordArchive" component={TomFordArchive} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(fordArchiveTimeline.duration * FPS)} />
    <Composition id="TomFordArchiveEnglish" component={TomFordArchiveEnglish} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(fordArchiveTimeline.duration * FPS)} />
    <Composition id="TomFordPaper" component={TomFordPaper} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(fordPaperTimeline.duration * FPS)} />
    <Composition id="TomFordPaperEnglish" component={TomFordPaperEnglish} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(fordPaperTimeline.duration * FPS)} />
    <Composition id="TomFordEditorial" component={TomFordEditorial} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(fordEditorialTimeline.duration * FPS)} />
    <Composition id="TomFordEditorialEnglish" component={TomFordEditorialEnglish} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(fordEditorialTimeline.duration * FPS)} />
    <Composition id="CapsuleEditorialEnglish" component={CapsuleEditorialEnglish} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(capsuleEditorialTimeline.duration * FPS)} />
    <Composition id="CapsuleEditorial" component={CapsuleEditorial} width={1080} height={1920} fps={FPS} durationInFrames={Math.round(capsuleEditorialTimeline.duration * FPS)} />
    <Composition id="BootsEvolution" component={BootsEvolution} width={1080} height={1920} fps={FPS} durationInFrames={bootsEditorialTimeline.duration * FPS} />
    <Composition id="BootsEvolutionEnglish" component={BootsEvolutionEnglish} width={1080} height={1920} fps={FPS} durationInFrames={bootsEditorialTimeline.duration * FPS} />
    <Composition id="FallWardrobeEditorialRu" component={FallWardrobeEditorialRu} width={1080} height={1920} fps={FPS} durationInFrames={fallEditorialTimeline.duration * FPS} />
    <Composition id="FallWardrobeEditorial" component={FallWardrobeEditorial} width={1080} height={1920} fps={FPS} durationInFrames={fallEditorialTimeline.duration * FPS} />
    <Composition id="SmartCasualShopping" component={SmartCasualShopping} width={1080} height={1920} fps={FPS} durationInFrames={shoppingEditorialTimeline.duration * FPS} />
    <Composition id="WardrobeEditorial01" component={JacketEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(jacketEditorialDuration, FPS)} />
    <Composition id="WardrobeEditorial02" component={BlazerEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(jacketEditorialDuration, FPS)} />
    <Composition id="WardrobeEditorial03" component={HemEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(jacketEditorialDuration, FPS)} />
    <Composition id="WardrobeEditorial04" component={KnitEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(knitDuration, FPS)} />
    <Composition id="WardrobeEditorial05" component={FootwearEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(footwearDuration, FPS)} />
    <Composition id="WardrobeEditorial06" component={CollarEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(footwearDuration, FPS)} />
    <Composition id="WardrobeEditorial07" component={NavyPaletteEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(navyPaletteDuration, FPS)} />
    <Composition id="WardrobeEditorial08" component={OlivePaletteEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(navyPaletteDuration, FPS)} />
    <Composition id="WardrobeEditorial09" component={LightPaletteEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(lightPaletteDuration, FPS)} />
    <Composition id="WardrobeEditorial10" component={ShoulderEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(shoulderEditorialDuration, FPS)} />
    <Composition id="WardrobeEditorial11" component={ShirtEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(shoulderEditorialDuration, FPS)} />
    <Composition id="WardrobeEditorial12" component={AccentEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(accentEditorialDuration, FPS)} />
    <Composition id="ZuckerbergEditorial" component={ZuckerbergEditorial} width={1080} height={1920} fps={FPS} durationInFrames={frames(zuckerbergDuration, FPS)} />
    <Composition id="ZuckerbergReel" component={ZuckerbergReel} width={1080} height={1920} fps={FPS} durationInFrames={frames(zuckerbergReelDuration, FPS)} />

    <Composition id="ColorEditorial" component={ColorEditorial} width={1080} height={1920} fps={FPS} durationInFrames={colorEditorialTimeline.duration * FPS} />
    <Composition id="AranSweater" component={AranSweater} width={1080} height={1920} fps={FPS} durationInFrames={aranTimeline.duration * FPS} />
    <Composition id="OldMoney" component={OldMoney} width={1080} height={1920} fps={FPS} durationInFrames={oldMoneyTimeline.duration * FPS} />
    <Composition id="KnivesOutEditorial" component={KnivesOutEditorial} width={1080} height={1920} fps={FPS} durationInFrames={knivesEditorialTimeline.duration * FPS} />
    <Composition id="KnivesOutCollage" component={KnivesOutCollage} width={1080} height={1920} fps={FPS} durationInFrames={knivesCollageTimeline.duration * FPS} />
    <Composition id="LayeringEditorial" component={LayeringEditorial} width={1080} height={1920} fps={FPS} durationInFrames={layeringTimeline.duration * FPS} />
    <Composition id="AIWardrobePriceStyle" component={PriceStyleEditorial} width={1080} height={1920} fps={FPS} durationInFrames={priceStyleTimeline.duration * FPS} />
    <Composition id="AIWardrobePriceStyleRu" component={PriceStyleEditorialRu} width={1080} height={1920} fps={FPS} durationInFrames={priceStyleTimeline.duration * FPS} />
    <Composition id="AIWardrobeBecoming" component={WardrobeBecoming} width={1080} height={1920} fps={FPS} durationInFrames={becomingTimeline.duration * FPS} />
    <Composition id="AIWardrobeBecomingRu" component={WardrobeBecomingRu} width={1080} height={1920} fps={FPS} durationInFrames={becomingTimeline.duration * FPS} />
    <Composition id="AIWardrobeStorm" component={AIWardrobeStorm} width={1080} height={1920} fps={FPS} durationInFrames={stormTimeline.duration * FPS} />
    <Composition id="AIWardrobe" component={AIWardrobe} width={1080} height={1920} fps={FPS} durationInFrames={wardrobe30Duration * FPS} />
    <Composition
      id="AltaTest"
      component={AltaTest}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={4 * FPS}
    />
    <Folder name="ALTA-Promo">
      <Composition
        id="AltaPromo"
        component={AltaPromo}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={getTimeline().duration}
        defaultProps={{ screens: {} }}
      />
      <Composition
        id="AltaPromoLandscape"
        component={AltaPromo}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getTimeline().duration}
        defaultProps={{ screens: {} }}
      />
      <Composition
        id="AltaPromoSquare"
        component={AltaPromo}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={getTimeline().duration}
        defaultProps={{ screens: {} }}
      />
    </Folder>
    <Folder name="Diagnostics">
      <Composition
        id="IntegrationCheck"
        component={IntegrationCheck}
        width={640}
        height={480}
        fps={FPS}
        durationInFrames={30}
      />
    </Folder>
  </>
);
