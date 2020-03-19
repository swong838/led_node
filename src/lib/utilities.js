import { debug, MAX } from './constants';

/**
 * clamp() Clamp value v so it's between b and t, inclusive.
 * @param {number} b bottom - minimum value
 * @param {number} v value - value to clamp
 * @param {number} t top - maximum value
 */
export const clamp = (b, v, t) => Math.max(Math.min(v, t), b);

/**
 * randInt() return a random integer between 0 and v, exclusive
 * @param {number} v 
 */
export const randInt = v => Math.floor(Math.random() * v);

/**
 * lid() Clamp value v so it's between 0 and MAX, inclusive
 * @param {number} v 
 */
export const lid = v => Math.max(Math.min(v, MAX), 0);

/**
 * log() Conditionally log if the debug flag is set
 * @param {string} s
 */
export const log = s => debug ? console.log(s) : null;
