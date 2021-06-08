export const debug = false;           // logging
export const emulation = false;      // emulate LED strip if we're not on actual hardware

export const width = debug ? 60 : 15;
export const height = debug ? 60 : 15;
export const pixels = debug ? 25 : 122;

export const initialDecay = 6
export const initialEffectFalloff = 85;
export const initialEffectDuration = 3;
export const initialEffectSpillover = 1;

export const STRIP_LENGTH = 123;

export const TICKRATE = 2;  // milliseconds per tick
export const MAX = 200;  // max power for a light source
export const MAXDISTANCE = 12;  // max rendering distance from a light source
export const MAXAGE = 30000;  // maximum age of an entity, in ticks

export const MAX_GENERATIONS = 10;  // maximum # of generations for a respawning effect

// Per-channel dimming
export const RGB_TUNING = Object.freeze({
    r: .45,
    g: 1,
    b: 1,
});
