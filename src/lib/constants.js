export const debug = true;
export const tickrate = 1;
export const width = debug ? 60 : 15;
export const height = debug ? 60 : 15;
export const pixels = debug ? 25 : 144;

export const initialDecay = 6
export const initialEffectFalloff = 85;
export const initialEffectDuration = 3;
export const initialEffectSpillover = 1;

export const MAX = 200;  // max power for a light source
export const MAXDISTANCE = 12;  // max rendering distance from a light source
export const MAXAGE = 4000;  // maximum age of an entity, in ticks

export const MAX_GENERATIONS = 10;  // maximum # of generations for a respawning effect
