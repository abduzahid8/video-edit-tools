export const brand = {
  name: "ALTA",
  background: "#f5f4f0",
  foreground: "#111111",
  accent: "#b7b3aa",
  muted: "#77746f",
  surface: "#e8e6e0",
  white: "#ffffff",
  fontFamily: "Helvetica Neue, Arial, sans-serif",
  radius: 44,
  shadow: "0 40px 90px rgba(0,0,0,0.22)",
};
export const ralphLaurenEditorialBrand = {
  paper: '#efeee9',
  paperDeep: '#e5d9c7',
  ink: '#292a27',
  muted: '#77786f',
  line: '#bdbfb6',
  cream: '#f8f6ef',
  blue: '#273f58',
  navy: '#1d3044',
  oxblood: '#7b3940',
  paleBlue: '#e5ecee',
  paleOlive: '#e8e9df',
  sepia: '#8f6d4e',
  serif: '"Didot", "Bodoni 72", "Times New Roman", serif',
  body: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 14px 32px rgba(32,32,27,.14)',
} as const;
export const motion = {
  spring: { damping: 19, stiffness: 100, mass: 0.9 },
  revealSeconds: 0.8,
  staggerSeconds: 0.12,
};

export const wardrobeBrand = {
  background: '#ffffff', foreground: '#101722', accent: '#24466b',
  surface: '#ffffff', muted: '#8c929c', fontFamily: 'Helvetica Neue, Arial, sans-serif',
};

export const wardrobeGraphics = {
 ink: '#24466b', pale: '#edf2f8', line: '#cbd8e7', paper: '#ffffff',
 shadow: '0 18px 48px rgba(20,37,59,0.16)',
};

export const focusedItemStyle = {line:'#b8c9dc', ink:'#24466b', light:'#edf2f8', white:'#ffffff'};

export const stormBrand = {
 white:'#ffffff', ink:'#101722', accent:'#d3dfc9',
 fontFamily:'Helvetica Neue, Arial, sans-serif',
};

export const colorEditorialBrand = {
 paper:'#ffffff', frame:'#efefed', gold:'#ae8953', ink:'#22221f', muted:'#8b8780', navy:'#1d273b',
 cream:'#eee9dd', burgundy:'#6e2938', tan:'#b5a081', brown:'#614434',gray:'#8c8d8b',
 serif:'Georgia, "Times New Roman", serif', sans:'Helvetica Neue, Arial, sans-serif',
};

export const oldMoneyBrand = {
  paper: '#ffffff', ink: '#141414', muted: '#8b8780',
  frame: '#f4f3f1', border: '#e7e5e1',
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
};

export const founderEditorialPalette = {
 black:'#171717', charcoal:'#343638', denim:'#7f9ca8', silver:'#b8b9b8',
};

export const zuckerbergBrand = {
  paper: "#f5f0e7",
  ink: "#171918",
  muted: "#585e57",
  line: "#ded4c5",
  accent: "#d9c8ae",
  dark: "#222e26",
  white: "#ffffff",
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Arial, sans-serif',
};

export const zuckerbergReelPaper = "#fcfcfb";

export const shoulderEditorialBrand = {
  paper: "#f8f7f4",
  ink: "#232624",
  rule: "#775e46",
  tieSwatches: ["#742d45", "#a44e61"],
  leatherSwatches: ["#614637", "#432525"],
  serif: 'Georgia, "Times New Roman", serif',
};

export const lightPaletteBrand = {
  ink: "#271d15", cream: "#f2e8d6", sand: "#bba18a", taupe: "#705c4c",
  font: "Helvetica Neue, Arial, sans-serif",
};

export const footwearBrand = {
  backdrop: "#212925", paper: "#f4efdf", accent: "#dac393", font: "Helvetica Neue, Arial, sans-serif",
};

export const jacketEditorialBrand = {
  ink: "#171713", paper: "#f6f3e8", accent: "#e4d278", font: "Helvetica Neue, Arial, sans-serif",
};

export const navyPaletteBrand = { ...lightPaletteBrand, ink: "#142337", sand: "#6788a5", cream: "#f4ede1", taupe: "#1d3550" };

export const olivePaletteBrand = {...navyPaletteBrand, ink: "#262c20", sand: "#888a71", taupe: "#59402e"};

export const shoppingEditorialBrand = {
  ...colorEditorialBrand,
  softShadow: '0 14px 38px rgba(25, 28, 32, 0.12)',
  paleLine: '#dedbd5',
};

export const fallEditorialBrand = {
  ...shoppingEditorialBrand,
  autumn: '#9a7047', olive: '#6e7153', charcoal: '#33312f', cream: '#e8deca',
};

export const bootsEditorialBrand = {
  ...shoppingEditorialBrand,
  accent: '#25475c', line: '#b9b5ae', faint: '#f2f0ed',
  figureShadow: '0 10px 12px rgba(0,0,0,.07)',
  suede: '#544031', denim: '#536b7a', cream: '#e6dfd1', oxblood: '#612e33',
  number: '#efede9', detailPaper: '#f4f1ec',
};

// Quiet film-wardrobe study: warm paper, high-contrast display serif,
// hairline rules and a cognac accent borrowed from the coat.
export const knivesEditorialBrand = {
  paper: '#f4efe5',
  paperLight: '#fbf8f1',
  ink: '#1c1a16',
  muted: '#7b7365',
  faint: '#a89f90',
  line: '#cfc6b7',
  rule: 'rgba(28,26,22,0.42)',
  accent: '#8b5e42',
  display: '"Didot", "Bodoni 72", "Times New Roman", serif',
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 18px 45px rgba(30,25,18,0.14)',
};

// Cooler, lighter paper for the 30s collage cut. The reference is closer to
// newsprint than to warm cream: near-neutral stock, black Didot, hairline
// rules and photographs pasted straight onto the page without mats.
export const knivesCollageBrand = {
  paper: '#ecebe7',
  paperLight: '#f3f2ee',
  ink: '#181714',
  muted: '#6f6b63',
  faint: '#9d988e',
  line: '#c9c5bc',
  rule: 'rgba(24,23,20,0.45)',
  accent: '#7c4f38',
  display: '"Didot", "Bodoni 72", "Times New Roman", serif',
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 16px 34px rgba(28,26,22,0.14)',
};

// example2-inspired paper study: restrained ink, photographic colour and folded stock.
export const capsuleEditorialBrand = {
  paper: '#edede9', ink: '#20221e', muted: '#77796f', line: '#b7b9ae',
  navy: '#23374b', cream: '#e9e3d7', olive: '#a4a398',
  serif: '"Times New Roman", Georgia, serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 14px 30px rgba(34,37,30,.10)',
  appAccent: '#614ce8',
};

// Tom Ford reference: full-bleed photography, ink black, restrained vermilion.
export const fordEditorialBrand = {
  ink: '#080808', white: '#f6f3ed', accent: '#e63732', muted: '#c3bfb9',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  serif: '"Didot", "Bodoni 72", "Times New Roman", serif',
};

export const fordPaperBrand = {
  paper: '#ffffff', ink: '#242521', muted: '#777870', line: '#c5c6bf', faint: '#eeeee9',
  serif: '"Times New Roman", Georgia, serif',
  display: '"Didot", "Bodoni 72", "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 12px 28px rgba(29,31,26,.09)', app: '#614ce8',
};

export const fordArchiveBrand = {
 paper:'#eeeee9', ink:'#252620', muted:'#7d7e75', line:'#c5c7bd',
 serif:'"Times New Roman", Georgia, serif', sans:'"Helvetica Neue", Helvetica, Arial, sans-serif',
 app:'#614ce8',
};

// Supplied example2 motion language, adapted to the wardrobe identity story.
export const wardrobeIdentityBrand = {
  paper: '#eeeee9', ink: '#24251f', muted: '#77786e', line: '#c4c6bc',
  serif: '"Times New Roman", Georgia, serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 12px 26px rgba(30,31,25,.09)',
};

export const founderWardrobeBrand = {
  ...wardrobeIdentityBrand,
  black: '#222421', grey: '#979b98', denim: '#7794a1',
  archive: '#e4e5de', accent: '#777f69',
};

export const modelWardrobeBrand = {
  ...wardrobeIdentityBrand,
  muted: '#62645c',
  dark: '#303334', navy: '#3d5060', stone: '#a89a86',
  accent: '#765749', film: '#252924', light: '#f5f1e8',
  plateShadow: '0 12px 27px rgba(31, 32, 25, .16)',
};

export const newExampleWardrobeBrand = {
  red: '#e93520',
  white: '#fffdf9',
  ink: '#20211d',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  captionShadow: '0 2px 12px rgba(0,0,0,.67), 0 1px 3px rgba(0,0,0,.65)',
};

// example3-inspired layering study: pure white field, charcoal italic serif with
// a misregistered double-print reveal, monospace spec captions and cutout
// figures bleeding off the bottom edge. No paper, no rules — just white.
export const layeringBrand = {
  field: '#ffffff',
  fieldSoft: '#fafaf9',
  ink: '#1d1d1f',
  text: '#3a3a3e',
  ghost: '#b3b3b8',
  faint: '#8f8f95',
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: '"Courier New", Courier, monospace',
  xerox: 'grayscale(0.18) contrast(1.14) brightness(1.05) saturate(0.88)',
};

// "Price doesn't create style" AIWardrobe editorial: warm archival paper,
// Didot display type, mono price captions and a cognac accent — example3's
// cutout language upgraded with editorial plates, shadows and depth.
export const priceStyleBrand = {
  paper: '#f1efe8',
  paperDeep: '#e9e6dc',
  ink: '#21201b',
  muted: '#7d7a6f',
  faint: '#a9a598',
  line: 'rgba(33, 32, 27, 0.16)',
  accent: '#8a5c3f',
  dark: '#1a1916',
  paperOnDark: '#eceada',
  display: '"Didot", "Bodoni 72", "Times New Roman", serif',
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: 'Menlo, Consolas, "Courier New", monospace',
  shadow: '0 20px 46px rgba(28, 25, 18, 0.18)',
  plateShadow: '0 14px 34px rgba(28, 25, 18, 0.14)',
} as const;

// "Dress for who you're becoming" — same editorial palette family as the
// price-style study; kept as its own export so the films stay independent.
export const becomingBrand = {
  paper: '#f1efe8',
  paperDeep: '#e9e6dc',
  ink: '#21201b',
  muted: '#7d7a6f',
  faint: '#a9a598',
  line: 'rgba(33, 32, 27, 0.16)',
  accent: '#8a5c3f',
  dark: '#1a1916',
  paperOnDark: '#eceada',
  display: '"Didot", "Bodoni 72", "Times New Roman", serif',
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: 'Menlo, Consolas, "Courier New", monospace',
  shadow: '0 20px 46px rgba(28, 25, 18, 0.18)',
  plateShadow: '0 14px 34px rgba(28, 25, 18, 0.14)',
} as const;

// Premium V2: a new ivory / espresso editorial system.
export const premiumWardrobeBrand = {
  paper: '#f2eee5', paperDeep: '#e4ddce', ink: '#24251f', muted: '#7a796c',
  line: '#c9c2b3', olive: '#656c54', espresso: '#30251f', light: '#fbf8f0',
  serif: '"Premium Cormorant", Georgia, serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 24px 50px rgba(33,28,20,.18)',
} as const;

// Heritage jacket study: reference-white, quiet serif type and neutral photography.
export const heritageJacketsBrand = {
  white: '#ffffff', ink: '#21211e', muted: '#85867e', line: '#c8cac2',
  serif: '"Times New Roman", Georgia, serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 14px 34px rgba(24,25,20,.13)',
  photograph: 'saturate(.68) contrast(1.025)',
  opening: {headlineSize: 64, headlineLeading: 1.02, framePadding: 15, frame: '#e7e7e3'},
} as const;

// Four luxury stories: example2's quiet paper language and real menswear plates.
export const fourFreedomsBrand = {
  paper: '#f0f0e9', ink: '#262920', muted: '#777b6d', line: '#c6c9bc',
  olive: '#626e51', warm: '#b19a78', white: '#fffef9',
  serif: '"Times New Roman", Georgia, serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  shadow: '0 14px 34px rgba(32,35,24,.14)',
  photograph: 'saturate(.76) contrast(1.02)',
} as const;

// example3: spacious white, photographic silhouettes, quiet serif typography.
export const stylePsychologyBrand = {
 paper:'#ffffff', ink:'#22231f', muted:'#7c7e75', line:'#d0d2c9',
 navy:'#243d54', cream:'#e4d9c6', olive:'#777a65',
 serif:'Georgia, "Times New Roman", serif', sans:'"Helvetica Neue", Arial, sans-serif',
 shadow:'0 14px 38px rgba(25,28,22,.09)',
 photograph:'saturate(.76) contrast(1.015)',
} as const;

// Taste over price: white photographic editorial, charcoal type, muted tobacco.
export const tasteOverPriceBrand = {
  white: '#ffffff', ink: '#22231f', muted: '#7d8078', line: '#c6c9c1',
  accent: '#8a7055', navy: '#253b4b', cream: '#e1d5bf',
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: 'Menlo, "Courier New", monospace',
  photo: 'saturate(.73) contrast(1.025)',
  shadow: '0 18px 50px rgba(27,29,24,.12)',
} as const;
// Creating a wardrobe — example3's white space, italic serif and photographic figures.
export const creatingWardrobeBrand = {
  paper:'#ffffff', ink:'#262724', muted:'#7e8077', line:'#c9cbc3',
  olive:'#777b66', navy:'#273a4b', cream:'#ded3be',
  serif:'Georgia, "Times New Roman", serif', sans:'"Helvetica Neue", Arial, sans-serif',
  photograph:'saturate(.76) contrast(1.02)',
} as const;
