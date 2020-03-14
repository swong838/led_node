import { MAX } from './constants';

export const clamp = (b, v, t) => Math.max(Math.min(v, t), b);
export const lid = v => Math.max(Math.min(v, MAX), 0);
export const randInt = v => Math.floor(Math.random() * v);
