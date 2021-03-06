import { debug, MAX, TICKRATE } from './constants';

const ticksPerSecond = 1000 / TICKRATE;

/**
 * clamp() Clamp value v so it's between b and t, inclusive.
 * @param {number} v value - value to clamp
 * @param {number} b bottom - minimum value
 * @param {number} t top - maximum value
 */
export const clamp = (v, b, t) => Math.max(Math.min(v, t), b);

/**
 * randInt() return a random integer between 0 and v, exclusive
 * @param {number} v 
 */
export const randInt = v => Math.floor(Math.random() * v);

/**
 * between() - Generate a random float between b and t
 * @param {number} b bottom - minimum value
 * @param {number} t top - maximum value
 */
export const between = (b, t) => (Math.random() * (t - b)) + b;

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

/**
 * perSecond() - Translate a number to its per-second equivalent
 * @param {number} v 
 */
export const perSecond = v => v / ticksPerSecond;

export const Buffer = function(){
    let _buffer = [];
    return {
        add: item => _buffer.push(item),
        append: items => _buffer.push([...items]),
        get: () => {
            const out = [..._buffer];
            _buffer = [];
            return out;
        }
    }
};
