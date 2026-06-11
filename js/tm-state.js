'use strict';
// ═══════════════════════════════════════════════════════
// GLOBAL STATE
// All mutable state lives here. Scripts load in order,
// so FORMATS (from tm-constants.js) is already defined.
// ═══════════════════════════════════════════════════════

// Fabric canvas instance
let canvas;

// Image layers: [{id, name, obj, dataUrl, effectState, visible}]
// layers[0] = frontmost
let layers = [];

// Non-selectable background rect that marks the design area (1280×720)
let designBgRect = null;

// Auto-incrementing layer id
let nextId = 1;

// Currently previewed export format
let activeFmt = FORMATS[0];

// Active right-panel tab: 'props' | 'fx'
let activeTab = 'props';

// Undo/redo stack
let history = [], histIdx = -1;

// Suppress history events when we're doing internal moves
let inMod = false;

// Middle-mouse pan state
let isPanning = false, panLast = {};
