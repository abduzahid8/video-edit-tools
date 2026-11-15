export const FPS = 30;
export const premiumWardrobeTimeline = {
  duration: 32,
  opening: {from: 0, seconds: 3.4},
  idea: {from: 3, seconds: 5.4},
  tailoring: {from: 8, seconds: 4.4},
  knit: {from: 12, seconds: 4.4},
  evening: {from: 16, seconds: 4.4},
  wardrobe: {from: 20, seconds: 6.4},
  close: {from: 26, seconds: 6},
} as const;
export const ralphLaurenKineticTimeline = {
  beats: [
    {id: 'cover', from: 0, seconds: 2},
    {id: 'ties', from: 2, seconds: 1.8},
    {id: 'boutique', from: 3.8, seconds: 1.6},
    {id: 'idea', from: 5.4, seconds: 1.3},
    {id: 'polo', from: 6.7, seconds: 1.6},
    {id: 'horse', from: 8.3, seconds: 1.7},
    {id: 'campus', from: 10, seconds: 1.7},
    {id: 'country', from: 11.7, seconds: 1.7},
    {id: 'truck', from: 13.4, seconds: 1.6},
    {id: 'tweed', from: 15, seconds: 1.8},
    {id: 'denim', from: 16.8, seconds: 1.7},
    {id: 'purpleOne', from: 18.5, seconds: 1.7},
    {id: 'purpleTwo', from: 20.2, seconds: 1.7},
    {id: 'purpleThree', from: 21.9, seconds: 1.7},
    {id: 'pointOfView', from: 23.6, seconds: 1.8},
    {id: 'close', from: 25.4, seconds: 2.8},
  ],
  duration: 28.2,
  overlap: .14,
} as const;
export const ralphLaurenFastTimeline = {
  cover: {from: 0, seconds: 2.6},
  ties: {from: 2.6, seconds: 3.1},
  idea: {from: 5.7, seconds: 2.3},
  polo: {from: 8, seconds: 4.4},
  worlds: {from: 12.4, seconds: 4},
  doubleRl: {from: 16.4, seconds: 5},
  purple: {from: 21.4, seconds: 5},
  pointOfView: {from: 26.4, seconds: 3.2},
  close: {from: 29.6, seconds: 2.4},
  duration: 32,
  pageSeconds: .28,
} as const;
export const ralphLaurenTimeline = {
  cover: {from: 0, seconds: 3.2},
  ties: {from: 3.2, seconds: 3.9},
  idea: {from: 7.1, seconds: 2.6},
  polo: {from: 9.7, seconds: 4.5},
  worlds: {from: 14.2, seconds: 4},
  doubleRl: {from: 18.2, seconds: 5.3},
  purple: {from: 23.5, seconds: 5.3},
  pointOfView: {from: 28.8, seconds: 3.9},
  close: {from: 32.7, seconds: 3.3},
  duration: 36,
  slideSeconds: 0.34,
} as const;
// Seconds are the source of truth. Scene duration includes its outgoing overlap.
export const timeline = {
  intro: 2,
  phoneReveal: 3,
  appOverview: 3,
  featureOne: 3,
  interaction: 3,
  productDemo: 4,
  featureTwo: 3,
  outro: 2.5,
};
export type SceneId = keyof typeof timeline;
export const sceneIds = Object.keys(timeline) as SceneId[];
export const transitionSeconds = 0.3;
export const frames = (seconds: number, fps = FPS) =>
  Math.max(1, Math.round(seconds * fps));
export function getTimeline(fps = FPS) {
  const overlap = frames(transitionSeconds, fps);
  let from = 0;
  const scenes = sceneIds.map((id, index) => {
    const duration = frames(timeline[id], fps);
    if (duration <= overlap * 2)
      throw new Error(`${id} must exceed twice the transition duration`);
    const scene = { id, from, duration };
    from += duration - (index < sceneIds.length - 1 ? overlap : 0);
    return scene;
  });
  return { scenes, overlap, duration: from };
}
// Set beats in seconds after inspecting a supplied music track; no guessed BPM.
export const audioBeats: number[] = [];

export const wardrobeTimeline = {
  intro: 3, overview: 9, inspiration: 7, shop: 6,
  stylist: 10, matching: 3, result: 8, calendar: 8, outro: 4,
};
export const wardrobeDurationSeconds = Object.values(wardrobeTimeline).reduce((sum, seconds) => sum + seconds, 0);

// 30-second editorial revision; source times refer to the supplied recording.
export const wardrobe30 = {
 intro: {from:0, seconds:1.5},
 daily: {from:1.5, seconds:2.5, source:1, rate:1.4},
 wardrobe: {from:4, seconds:3, source:10, rate:2},
 inspiration: {from:7, seconds:3, source:22, rate:2},
 shop: {from:10, seconds:3, source:30, rate:2},
 stylist: {from:13, seconds:5, source:44, rate:1.8},
 dna: {from:18, seconds:1, source:55, rate:2},
 result: {from:19, seconds:4, source:65, rate:0.75},
 calendar: {from:23, seconds:5, source:69, rate:1.4},
 outro: {from:28, seconds:2},
};
export const wardrobe30Duration = 30;

export const wardrobeGraphicTiming = {
 outfitAssemble: 0.7, outfitStagger: 0.16, savedBadge: 3.4, savedBadgeReveal: 0.5,
};

export const wardrobeIdentityTiming = {fanReveal:0.85, fanStagger:0.06, letterStagger:0.025};

export const focusedItemTiming = {enter:0.4, settle:1, style:2.2, generate:4.2, confirm:3.15};

export const functionMotionTiming = {
 enter:0.35, reveal:0.85, compare:1.45, compareSettle:2.05,
 style:2.2, generate:4.2, calendarTransfer:3.15, calendarLand:3.85,
};

export const actionStoryTiming = {
 inspiration:[0,1.1,2.1], shop:[0,1,2], stylist:[0,2.2,4.2],
 selectStart:2.1, selectEnd:2.7,
};

export const wardrobeDailyMotion = {
 dailyEnter:0.3, dailyCompare:0.85, dailySelect:1.65, dailySettle:2.25,
 organizeStart:0.35, organizeStagger:0.12, storeStart:1.9, storeEnd:2.7,
};

export const discoveryMotionTiming = {deckTurn:0.75, deckChoose:1.7, collectionReveal:2.1, collectionSettle:2.65};

export const rebuiltEarlyScenes = {assemble:0.25, assembleStagger:0.12, selected:1.7, selectedEnd:2.25, rackStart:0.35, rackEnd:1.35, groupStart:1.8, groupEnd:2.7};

export const stormTimeline = {
 duration:14,
 question:{from:0,seconds:3.1},
 transform:{from:3.2,seconds:3.8},
 look:{from:7.2,seconds:2.5},
 close:{from:10,seconds:4},
 frameStart:8.3, frameSettle:9.4,
};

// Aran Sweater Editorial — ~30s at 30fps
// Mirrors the "only two jackets" reference video structure with a new theme
export const aranTimeline = {
 duration: 30,
 // Scene 1 – Hero headline with two icon portraits (0–4s)
 heroes: {from:0, seconds:4},
 // Scene 2 – Slow zoom on Jordan Barrett / fashion model + annotation dot (4–8s)
 closeZoom: {from:4, seconds:4},
 // Scene 3 – Text overlay "Anchors your look" + dashed collar detail (8–12s)
 detail: {from:8, seconds:4},
 // Scene 4 – Price shock + comment bubbles (12–18s)
 price: {from:12, seconds:6},
 // Scene 5 – Search bar reveal "ebay.com" (18–20s)
 search: {from:18, seconds:2},
 // Scene 6 – Sweater product card + three colourway shots (20–25s)
 product: {from:20, seconds:5},
 // Scene 7 – Second icon group: James Dean & Paul Newman (25–28s)
 icons2: {from:25, seconds:3},
 // Scene 8 – Outro price callout "80 dollars" (28–30s)
 outro: {from:28, seconds:2},
};

// Old Money menswear editorial — ~36s at 30fps
// Mirrors the reference video structure with a new "old money style" theme.
export const oldMoneyTimeline = {
  duration: 36,
  // Scene 1 – Hero headline + two cut-out portraits (0–3.5s)
  hero: {from: 0, seconds: 3.5},
  // Scene 2 – Framed editorial slides sliding in from right (3.5–9s)
  frames: {from: 3.5, seconds: 5.5},
  // Scene 3 – Full-bleed close-up, dotted V-collar annotation + bubbles (9–16s)
  closeup: {from: 9, seconds: 7},
  // Scene 4 – Search bar → product card (16–18.5s)
  search: {from: 16, seconds: 2.5},
  // Scene 5 – Lookbook flat-lay + street pairs (18.5–27s)
  lookbook: {from: 18.5, seconds: 8.5},
  // Scene 6 – Icon portrait, mono caption + inset still (27–32s)
  icon: {from: 27, seconds: 5},
  // Scene 7 – B&W trio outro, italic "Second hand" → "$200" (32–36s)
  outro: {from: 32, seconds: 4},
};

// Faster founder editorial, original sound hook and locally generated Russian narration.
export const colorEditorialTimeline = {
 duration:26,
 hook:{from:0,seconds:2}, montage:{from:2,seconds:1.5},
 base:{from:3.5,seconds:2.5}, support:{from:6,seconds:2.5},
 accent:{from:8.5,seconds:2.5}, fourth:{from:11,seconds:2},
 palette:{from:13,seconds:2}, looks:{from:15,seconds:6},
 outro:{from:21,seconds:5},
};

export const founderAppFlow = {
 selection:{from:0,seconds:2.5,source:49.5,rate:1.44},
 result:{from:2.5,seconds:3.5,source:65.9,rate:.8},
};

export const founderVoiceCues = [
 {"from":0.12,"seconds":1.75,"text":"Их стиль узнают сразу."},
 {"from":2.03,"seconds":1.35,"text":"Три личные формулы."},
 {"from":3.57,"seconds":2.25,"text":"Дуров. Чёрный и чёткий силуэт."},
 {"from":6.08,"seconds":2.25,"text":"Джобс. Классика и личная деталь."},
 {"from":8.58,"seconds":2.25,"text":"Хуанг. Простая форма и фактура."},
 {"from":11.08,"seconds":1.75,"text":"Силуэт, фактура, деталь."},
 {"from":13.10,"seconds":1.7,"text":"Теперь — ваша формула."},
 {"from":15.10,"seconds":2.25,"text":"Выберите повод и свой стиль."},
 {"from":17.68,"seconds":2.5,"text":"Получите готовый образ."},
 {"from":21.20,"seconds":4.5,"text":"Попробуйте Эй Ай Уордроуб. Создайте свой первый образ."}
] as const;

export const zuckerbergScenes = [
  {id: "cover", seconds: 4},
  {id: "formal", seconds: 6},
  {id: "formula", seconds: 6},
  {id: "cta", seconds: 5},
] as const;

export const zuckerbergDuration = zuckerbergScenes.reduce((total, scene) => total + scene.seconds, 0);

export const zuckerbergMotion = {coverExit: 3.4, detailReveal: 0.55, captionReveal: 1.05};

export const zuckerbergReel = [
  {seconds: 4, tag: "МУЖСКОЙ СТИЛЬ", title: "Марк Цукерберг\nв костюме", caption: "Три костюма. Три акцента.", photo: "evening"},
  {seconds: 5, tag: "01 / ДОВИЛЬ", title: "Строгая классика", caption: "Галстук в тон костюму. Белая рубашка добавляет контраст.", photo: "suit"},
  {seconds: 5, tag: "02 / ВАШИНГТОН", title: "Акцент на цвет", caption: "Синий галстук добавляет цвет строгому костюму.", photo: "hearing"},
  {seconds: 5, tag: "03 / ДЖАМНАГАР", title: "Вечерний чёрный", caption: "На чёрном жакете выделяется золотистая вышивка.", photo: "evening"},
  {seconds: 4, tag: "ТРИ ОБРАЗА", title: "Что меняется?", caption: "Воротник, галстук, вышивка. Каждый раз взгляд ведёт одна деталь.", photo: "evening"},
  {seconds: 5, tag: "ВАШ СЛЕДУЮЩИЙ ОБРАЗ", title: "AIWardrobe", caption: "Соберите свой первый образ", photo: "result"},
] as const;

export const zuckerbergReelDuration = zuckerbergReel.reduce((total, beat) => total + beat.seconds, 0);

export const zuckerbergReelMotion = {
  enter: .58,
  detail: 1.9,
  annotation: 2.45,
  caption: 3.15,
  coverExit: 3.45,
};

export const shoulderEditorialSeconds = [4.42, 7.28, 5.86, 8.44, 4] as const;
export const shoulderEditorialDuration = shoulderEditorialSeconds.reduce<number>((total, seconds) => total + seconds, 0);

export const lightPaletteSeconds = [3.8, 2.36, 2.38, 9.04, 8.42, 4] as const;
export const lightPaletteDuration = lightPaletteSeconds.reduce<number>((total, seconds) => total + seconds, 0);

export const footwearSeconds = [3.96, 4.86, 4.8, 5.6, 6.78, 4] as const;
export const footwearDuration = footwearSeconds.reduce<number>((sum, seconds) => sum + seconds, 0);

export const jacketEditorialSeconds = [2.84, 4.06, 1.18, 2.58, 4.48, 3.16, 7.7, 4] as const;
export const jacketEditorialDuration = jacketEditorialSeconds.reduce<number>((sum, seconds) => sum + seconds, 0);

export const accentEditorialSeconds = [4.02, 3.2, 4.54, 7.82, 6.42, 4] as const;
export const accentEditorialDuration = accentEditorialSeconds.reduce<number>((sum, seconds) => sum + seconds, 0);

export const knitSeconds = [3.04, 4.5, 4.22, 5.6, 8.64, 4] as const;
export const knitDuration = knitSeconds.reduce<number>((sum, seconds) => sum + seconds, 0);

export const navyPaletteSeconds = [4.74, 5.54, 2.32, 5.9, 7.5, 4] as const;
export const navyPaletteDuration = navyPaletteSeconds.reduce<number>((sum, seconds) => sum + seconds, 0);

export const blazerEditorialSeconds = [3.02, 1.48, 1.82, 5.88, 7.32, 3.4, 3.08, 4] as const;

export const hemEditorialSeconds = [2.62, 3.08, 3.78, 4.32, 3.58, 2.78, 5.84, 4] as const;

export const collarSeconds = [4.04, 3.8, 4.52, 4.34, 9.3, 4] as const;

export const olivePaletteSeconds = [3.18, 4.12, 4.4, 4.96, 9.34, 4] as const;

export const shirtEditorialSeconds = [3.28, 7.46, 7.28, 7.98, 4] as const;

export const shoppingEditorialTimeline = {
  duration: 26,
  hook: {from: 0, seconds: 2.4},
  tailoring: {from: 2.4, seconds: 4},
  knitwear: {from: 6.4, seconds: 4},
  trousers: {from: 10.4, seconds: 4},
  bridge: {from: 14.4, seconds: 2.6},
  app: {from: 17, seconds: 4, source: 65.9, rate: 0.7},
  cta: {from: 21, seconds: 5},
};

export const fallEditorialTimeline = {
  duration: 25,
  hook: {from: 0, seconds: 2.5},
  day: {from: 2.5, seconds: 2.8},
  dayDetail: {from: 5.3, seconds: 2.7},
  evening: {from: 8, seconds: 2.8},
  eveningDetail: {from: 10.8, seconds: 2.7},
  compare: {from: 13.5, seconds: 3.5},
  app: {from: 17, seconds: 4},
  cta: {from: 21, seconds: 4},
};


// Knives Out film-wardrobe study — 51s at 30fps.
// Scene seconds include the outgoing crossfade; the next scene begins on the
// same boundary so paper never flashes between chapters.
export const knivesEditorialTimeline = {
  duration: 51,
  cover: {from: 0, seconds: 5.5},
  look: {from: 5.5, seconds: 4.5},
  knit: {from: 10, seconds: 6},
  coat: {from: 16, seconds: 6},
  trousers: {from: 22, seconds: 6},
  loafers: {from: 28, seconds: 6},
  sunglasses: {from: 34, seconds: 6},
  wholeFit: {from: 40, seconds: 6},
  outro: {from: 46, seconds: 5},
};
export const knivesTransitionSeconds = 0.7;
export const knivesSceneChanges = [5.5, 10, 16, 22, 28, 34, 40, 46];

// 30s paper-collage cut. Hard cuts, no crossfades: every scene starts on the
// paper and the previous page disappears between frames.
export const knivesCollageTimeline = {
  duration: 30,
  cover: {from: 0, seconds: 4},
  look: {from: 4, seconds: 3},
  knit: {from: 7, seconds: 3.2},
  coat: {from: 10.2, seconds: 3.2},
  trousers: {from: 13.4, seconds: 3.2},
  loafers: {from: 16.6, seconds: 3.2},
  sunglasses: {from: 19.8, seconds: 3.2},
  wholeFit: {from: 23, seconds: 4},
  outro: {from: 27, seconds: 3},
};

export const bootsEditorialTimeline = {
  duration: 30,
  opening: {from: 0, seconds: 2.4, motionRate: 1.25},
  everyday: {from: 2.4, seconds: 4.7, motionRate: 6.5 / 4.7},
  occasion: {from: 7.1, seconds: 4.7, motionRate: 6.5 / 4.7},
  character: {from: 11.8, seconds: 4.7, motionRate: 6.5 / 4.7},
  compare: {from: 16.5, seconds: 1.5, motionRate: 3.5 / 1.5},
  app: {
    from: 18, seconds: 9,
    category: {from: 0, seconds: 3, source: 47, rate: 1},
    create: {from: 3, seconds: 3, source: 50, rate: 1},
    result: {from: 6, seconds: 3, source: 65, rate: 0.7},
  },
  cta: {from: 27, seconds: 3},
};

// Capsule: a continuous paper stage, linked photo relays and real app footage.
export const capsuleEditorialTimeline = {
  duration: 33,
  transition: 0.2,
  cover: {from: 0, seconds: 2.8, motionRate: 3.5 / 2.8},
  premise: {from: 2.8, seconds: 2, motionRate: 2.5 / 2},
  palette: {from: 4.8, seconds: 2.8, motionRate: 3.5 / 2.8},
  inventory: {from: 7.6, seconds: 4.4, motionRate: 5.5 / 4.4},
  texture: {from: 12, seconds: 3.8, motionRate: 4.5 / 3.8},
  looks: {from: 15.8, seconds: 5.7, motionRate: 6.5 / 5.7},
  principle: {from: 21.5, seconds: 2, motionRate: 2.5 / 2},
  app: {from: 23.5, seconds: 7,
    category: {from: 0, seconds: 2.4, source: 47},
    create: {from: 2.4, seconds: 2.2, source: 50.4},
    result: {from: 4.6, seconds: 2.4, source: 65.4}},
  cta: {from: 30.5, seconds: 2.5, motionRate: 3 / 2.5},
};

// Opening is authored in real seconds: three punch-ins, a fan-out and a matte peel.
export const capsuleOpeningMotion = {
  portraitCuts: [0, 0.22, 0.44],
  fanStart: 0.66,
  fanEnd: 1.36,
  mattePeelStart: 1.05,
  mattePeelEnd: 1.5,
  secondLine: 0.94,
  caption: 1.48,
};

export const fordEditorialTimeline = {
  duration: 32,
  hook: {from: 0, seconds: 3.2},
  premise: {from: 3.2, seconds: 2.4},
  silhouette: {from: 5.6, seconds: 4.2},
  contrast: {from: 9.8, seconds: 4.2},
  details: {from: 14, seconds: 4.2},
  looks: {from: 18.2, seconds: 4.3},
  app: {from: 22.5, seconds: 7,
    category: {from: 0, seconds: 2.4, source: 47},
    create: {from: 2.4, seconds: 2.2, source: 50.4},
    result: {from: 4.6, seconds: 2.4, source: 65.4}},
  cta: {from: 29.5, seconds: 2.5},
};

// example.mp4 motion language + tom_ford.mp4 biography, separate from prior style study.
export const fordPaperTimeline = {
 duration: 38,
 hook: {from:0,seconds:3},
 gucci: {from:3,seconds:4},
 brand: {from:7,seconds:4},
 signature: {from:11,seconds:4},
 cinema: {from:15,seconds:5},
 sale: {from:20,seconds:4},
 bridge: {from:24,seconds:4},
 app: {from:28,seconds:7,
  category:{from:0,seconds:2.4,source:47},
  create:{from:2.4,seconds:2.2,source:50.4},
  result:{from:4.6,seconds:2.4,source:65.4}},
 cta: {from:35,seconds:3},
};

export const fordArchiveTimeline = {
 duration:34,
 origins:{from:0,seconds:6.5},
 cover:{from:0,seconds:2.8,motionRate:3.2/2.8},
 gucci:{from:2.8,seconds:3.7,motionRate:4.4/3.7},
 brand:{from:6.5,seconds:3.7,motionRate:4.4/3.7},
 question:{from:10.2,seconds:1.6,motionRate:2.2/1.6},
 cinema:{from:11.8,seconds:4.8,motionRate:5.8/4.8},
 sale:{from:16.6,seconds:3.7,motionRate:4.5/3.7},
 bridge:{from:20.3,seconds:4.7,motionRate:5.5/4.7},
 app:{from:25,seconds:6.5,
  category:{from:0,seconds:2.2,source:47},
  create:{from:2.2,seconds:2,source:50.4},
  result:{from:4.2,seconds:2.3,source:65.4}},
 cta:{from:31.5,seconds:2.5,motionRate:3/2.5},
};

// Original English narration from theme_about_wardrobe.mp4 is kept on one clock.
// All boundaries below are in seconds; frame rounding happens at composition FPS.
export const wardrobeIdentityTimeline = {
  duration: 61.2,
  opening: {from: 0, seconds: 10.18, reframe: 5.75, versions: 6.08},
  transition: {from: 10.18, seconds: 3.74},
  identity: {from: 13.92, seconds: 2.72},
  aligned: {from: 16.64, seconds: 3.76},
  memory: {from: 20.4, seconds: 4.98},
  black: {from: 25.38, seconds: 8.44, forever: 3.62, math: 5.42},
  decision: {from: 33.82, seconds: 4.24},
  staples: {from: 38.06, seconds: 4.36},
  signature: {from: 42.42, seconds: 3.62},
  questions: {from: 46.04, seconds: 9.1, becoming: 2.96, association: 5.78, answer: 7.54},
  close: {from: 55.14, seconds: 6.06, direction: 2.74},
};

// Founder revision: archival clothing examples, followed by a personal-style takeaway.
export const founderWardrobeTimeline = {
  duration: 42,
  overlap: 0.4,
  cover: {from: 0, seconds: 3.4},
  jobs: {from: 3.4, seconds: 7.2},
  zuckerberg: {from: 10.6, seconds: 7.2},
  huang: {from: 17.8, seconds: 7.2},
  principle: {from: 25, seconds: 2.8},
  compare: {from: 27.8, seconds: 4.4},
  formula: {from: 32.2, seconds: 3.8},
  close: {from: 36, seconds: 4},
  credits: {from: 40, seconds: 2},
};

export const founderWardrobeVoice = [
  {from: 0.1, seconds: 3.1, text: 'Three founders. Three unmistakable wardrobes.'},
  {from: 3.7, seconds: 6.5, text: 'Steve Jobs. Black mock neck, blue jeans. A simple contrast, repeated across the years.'},
  {from: 10.9, seconds: 6.5, text: 'Mark Zuckerberg. The grey tee. Understated colour and a familiar, casual silhouette.'},
  {from: 18.1, seconds: 6.5, text: 'Jensen Huang. The black leather jacket. Strong texture turns a simple shape into a signature.'},
  {from: 25.15, seconds: 2.4, text: 'The common thread? A clear point of view.'},
  {from: 28.05, seconds: 3.8, text: 'Different people. Different clothes. The same sense of identity.'},
  {from: 32.4, seconds: 3.2, text: 'Choose your base. Add one detail. Make it repeatable.'},
  {from: 36.25, seconds: 3.3, text: 'Build a wardrobe that looks like you. And who you are becoming.'},
] as const;

export const modelWardrobeTimeline = {
  duration: 36.4,
  slide: 0.5,
  cover: {from: 0, end: 4.7, cuts: [0.53, 1.07, 1.63], fan: 2.37},
  tailoring: {from: 4.7, end: 10.2, reframe: 1.35, detailCut: 3.55},
  detailMotion: {from: 10.2, end: 14.6},
  street: {from: 14.6, end: 20.4, relay: 2.65},
  details: {from: 20.4, end: 24, cuts: [1.2, 2.4]},
  question: {from: 24, end: 28.65, next: 2.8},
  compare: {from: 28.65, end: 32.2, reveal: 1.38},
  close: {from: 32.2, end: 36.4, relay: 1.25},
  voice: {
    opening: {from: 0, source: 0, seconds: 4.65},
    closing: {from: 24, source: 48.9, seconds: 12.15},
  },
} as const;

// Fast documentary-style wardrobe montage, adapted from new_example.mp4.
export const newExampleWardrobeTimeline = {
  duration: 48,
  sections: [
    {from: 0, end: 10.5},
    {from: 11.7, end: 22.2},
    {from: 23.4, end: 34.3},
    {from: 35.5, end: 46.2},
  ],
  cards: [
    {from: 10.5, end: 11.7},
    {from: 22.2, end: 23.4},
    {from: 34.3, end: 35.5},
    {from: 46.2, end: 48},
  ],
  voice: [0.12, 11.82, 23.52, 35.62],
} as const;


// Layering study — 30s cut in the example3 style: white field, echo text,
// rule cards, wipe pill and cutout figures. Cross-fades carry the pace; the
// rule cards sit on empty white like chapter marks.
export const layeringTimeline = {
  duration: 30,
  cover: {from: 0, seconds: 4.2},
  wrong: {from: 4.2, seconds: 3},
  rule1: {from: 7.2, seconds: 1.7},
  weight: {from: 8.9, seconds: 4.6},
  rule2: {from: 13.5, seconds: 1.7},
  build: {from: 15.2, seconds: 5.4},
  rule3: {from: 20.6, seconds: 1.7},
  vshape: {from: 22.3, seconds: 3.7},
  effortless: {from: 26, seconds: 4},
};
export const layeringSceneChanges = [4.2, 7.2, 8.9, 13.5, 15.2, 20.6, 22.3, 26];

// "Price doesn't create style" — 33s AIWardrobe editorial at 30fps.
// Hook (three real models, kinetic collage) → problem (impulse vs capsule) →
// three looks (each with its own composition) → outfit matrix → real app
// footage → ink close card. Beat times are seconds from each scene start.
export const priceStyleTimeline = {
  duration: 33,
  hook: {
    from: 0, seconds: 3,
    firstIn: 0.02, firstEnd: 0.62,      // tailoring: cinematic crop pull-back
    secondIn: 0.55, secondEnd: 1.02,    // knit: masked slide from the right
    thirdIn: 0.95, thirdEnd: 1.45,      // evening: paper-cut split reveal
    seamFade: 1.62,
    chips: 1.18, headline: 1.55, rule: 1.62, marks: 1.7,
  },
  problem: {
    from: 3, seconds: 5,
    bags: 0.08, tags: 0.32, tagGap: 0.14, impulseNote: 1.05, strike: 1.4,
    capsule: 2.1,                      // vertical wipe to the capsule beat
    grid: 2.24, gridGap: 0.13, headline: 2.4, sub: 2.95, note: 3.8,
  },
  lookOne: {from: 8, seconds: 4, figure: 0.04, headline: 0.34, sub: 0.8, leader: 1.2, list: 1.55, listGap: 0.16, total: 2.62},
  lookTwo: {from: 12, seconds: 4, figure: 0.04, headline: 0.3, sub: 0.78, print: 0.55, swatches: 1.15, list: 1.6, total: 2.62},
  lookThree: {from: 16, seconds: 4, panel: 0.04, figure: 0.28, headline: 0.42, sub: 0.9, cursor: 1.5, cursorClick: 2.2, list: 1.95, total: 2.66},
  matrix: {
    from: 20, seconds: 6,
    headline: 0.08, figures: 0.32, figureGap: 0.15,
    grid: 0.85, gridGap: 0.12, rules: 1.35, counter: 2.95, outfits: 4.35,
  },
  app: {
    from: 26, seconds: 4.2,
    card: 0.12, headline: 0.4, sub: 0.95,
    category: {source: 47, until: 2.0},
    result: {source: 65.4},
    brand: 2.95,
  },
  close: {
    from: 30.2, seconds: 2.8,
    wipeIn: 0.02, wipeOut: 0.34,
    lineOne: 0.3, lineTwo: 0.62, rule: 1.0, wordmark: 1.22, micro: 1.72,
  },
} as const;

// ————————————————————————————————————————————————————————————
// "Dress for who you're becoming" — wardrobe & identity editorial.
// Story beats follow the supplied theme video, cut in the example.mp4
// language: pure white, white-framed photo plates, whole-frame
// fade-through-white transitions, muted photography, ~2 s beats.
export const becomingTimeline = {
  duration: 36,
  hook: {
    from: 0, seconds: 4.2,
    todayIn: 0.05, todayEnd: 0.6, becomingIn: 0.3, becomingEnd: 0.85,
    seamFade: 1.0, labels: 1.1, headline: 1.35, sub: 2.6,
  },
  closet: {from: 4.2, seconds: 2.9, plate: 0.16, caption: 1.15},
  bubbles: {from: 7.1, seconds: 2.4, bubble: 0.2, gap: 0.46},
  october: {from: 9.5, seconds: 2.3, label: 0.16, plate: 0.34},
  street: {from: 11.8, seconds: 2.4, plate: 0.16, leader: 0.95},
  search: {from: 14.2, seconds: 1.7, bar: 0.14, typeEnd: 1.05},
  card: {from: 15.9, seconds: 2.7, card: 0.12, price: 1.45, note: 2.0},
  staples: {from: 18.6, seconds: 3.2, headline: 0.14, sub: 0.75, grid: 1.2, gap: 0.13, labels: 2.05},
  worn: {from: 21.8, seconds: 2.4, plate: 0.16, caption: 1.05},
  question: {from: 24.2, seconds: 3.6, ask: 0.16, lineOne: 0.6, lineTwo: 1.2, askTwo: 2.15, lineThree: 2.55},
  app: {from: 27.8, seconds: 4.4, plate: 0.14, label: 0.55, category: 47, result: 65.4, swap: 2.1, wordmark: 3.35},
  close: {from: 32.2, seconds: 3.8, lineOne: 0.35, lineTwo: 0.85, rule: 1.6, wordmark: 1.95, micro: 2.55},
} as const;

// Pacing rule: <= 3 s without a meaningful visual change. Subtle photo drift
// does not reset that clock. Authored detail cuts below happen every ~2 s.
export const heritageJacketsTimeline = {
  duration: 40,
  maxIdleShotSeconds: 3,
  hook: {
    from: 0, seconds: 4.5,
    headlineOut: 1.45, headlineGone: 1.7,
    splitFrom: 1.65, splitEnd: 2.25,
    plateFrom: 1.55, plateSettle: 2.18, detailAt: 3.1,
    handoffSeconds: .5,
  },
  barbour: {from: 4.5, seconds: 4, detailAt: 2},
  valstar: {from: 8.5, seconds: 4, detailAt: 2},
  todd: {from: 12.5, seconds: 4, detailAt: 2},
  buck: {from: 16.5, seconds: 4, detailAt: 2},
  rocky: {from: 20.5, seconds: 4, detailAt: 2},
  bridge: {from: 24.5, seconds: 4.5, detailAt: 2.2},
  demo: {from: 29, seconds: 7.5, selectionSource: 47, resultSource: 65.4, swap: 2.2, detailAt: 4.7, detailSource: 67.9},
  close: {from: 36.5, seconds: 3.5, ctaDetailAt: 1.8},
  photoReveal: .6, whiteWash: .16,
} as const;

// Each editorial shot is 2.4 s; product states also change on that cadence.
// A drift alone never counts as new information. All timing remains in seconds.
export const fourFreedomsTimeline = {
  duration: 60.6, shot: 2.4, maxIdleShotSeconds: 3,
  hook: 0, overview: 2.4,
  polo: [4.8, 7.2, 9.6, 12],
  ap: [14.4, 16.8, 19.2, 21.6],
  travel: [24, 26.4, 28.8, 31.2],
  wellness: [33.6, 36, 38.4, 40.8],
  bridge: [43.2, 45.6],
  demo: [48, 50.4, 52.8, 55.2],
  close: {from: 57.6, seconds: 3},
  source: {wardrobe: 11.5, selection: 47, result: 65.4, calendar: 69.4, closeResult: 65.8},
  voice: [.18, 4.98, 14.58, 24.18, 33.78, 43.38, 48.18, 57.72],
} as const;

// Psychology of dressing: every shot is 2.4 s, including all product states.
export const stylePsychologyTimeline = {
 duration:48, shot:2.4, maxIdleShotSeconds:3,
 hook:0, signal:2.4, room:4.8, yourself:7.2, cognition:9.6, feel:12,
 fit:14.4, ease:16.8, palette:19.2, texture:21.6, personal:24,
 ritual:26.4, day:28.8, bridge:31.2,
 wardrobe:33.6, occasion:36, result:38.4, calendar:40.8, invite:43.2, close:45.6,
 source:{wardrobe:10.8,occasion:46.8,result:65.5,calendar:72.5,invite:65.5},
 reveal:.32, annotation:.45,
 detailAt:1.2, secondPhotoAt:1.1, demoDetailAt:1.2,
 // Distinct detail cuts: 3.6, 13.2, 15.6, 18.0, 22.8, 25.2, 27.6 s.
 // Product details: 37.2, 39.6, 42.0 s; held states are never padded.
 voice:[.16,4.96,9.76,14.56,19.36,24.16,28.96,33.76,38.56,43.36],
} as const;

// Sixteen real shot changes, 2.4 s apart; photo drift does not reset the limit.
export const tasteOverPriceTimeline = {
  duration: 38.4, shot: 2.4, maxIdleShotSeconds: 3,
  hook: 0, taste: 2.4, fit: 4.8, shoulder: 7.2,
  proportion: 9.6, line: 12, palette: 14.4, texture: 16.8,
  combinations: 19.2, bridge: 21.6,
  wardrobe: 24, occasion: 26.4, result: 28.8, detail: 31.2,
  invite: 33.6, close: 36,
  reveal: .42, secondReveal: .65, annotation: .8,
  source: {wardrobe: 11.1, occasion: 46.6, result: 65.4, detail: 66.4, invite: 65.7},
} as const;
