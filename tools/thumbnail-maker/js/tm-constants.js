'use strict';
// ═══════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════
const DW = 1280, DH = 720;
const MAX_LAYERS = 3;
const SNAP_D = 14, SNAP_ROT = 6, SH_RANGE = 30;

const FONTS = [
  'Impact','Anton','League Gothic','Bebas Neue','Oswald',
  'Teko','Barlow Condensed','Montserrat','Inter','Arial','Georgia','Courier New',
];

const FORMATS = [
  {id:'youtube',   name:'YouTube',      w:1280, h:720,  on:true},
  {id:'instagram', name:'Instagram',    w:1080, h:1080, on:true},
  {id:'reels',     name:'Reels/TikTok', w:1080, h:1920, on:true},
  {id:'twitter',   name:'Twitter',      w:1200, h:675,  on:false},
  {id:'linkedin',  name:'LinkedIn',     w:1200, h:627,  on:false},
  {id:'pinterest', name:'Pinterest',    w:1000, h:1500, on:false},
];

const EMOJIS = ['😱','🔥','💀','👀','💥','⚡','🤯','😤','🎯','👊','💪','🤑','💯','🚀','❗'];


const RAGE_FACES = [
  {l:'😡 RAGE', t:'😡'}, {l:'😂 LOL',  t:'😂'}, {l:'😱 OMG',  t:'😱'},
  {l:'🤦 DERP', t:'🤦'}, {l:'😈 EVIL', t:'😈'}, {l:'🤬 FUUU', t:'🤬'},
];

const LAYER_FX = [
  { l: 'Motion Blur',    key: 'motionblur', ic: '💨', fn: 'toggleMotionBlur' },
  { l: 'Papel antigo',   key: 'oldpaper',   ic: '📜', fn: 'toggleOldPaper'  },
  { l: 'Scanlines',      key: 'scanline',   ic: '📺', fn: 'toggleScanlines' },
  { l: 'Cantos escuros', key: 'vignette',   ic: '🔲', fn: 'toggleVignette'  },
];

const CANVAS_FX = [
  {l:'Speed Lines', fn:'addSpeedLines'},
  {l:'Impact Burst', fn:'addImpactBurst'},
  {l:'Luz Central',  fn:'addLightBurst'},
  {l:'Luz Lateral',  fn:'addLateralLight'},
  {l:'Chuva',        fn:'addRain'},
  {l:'Partículas',   fn:'addParticles'},
];
