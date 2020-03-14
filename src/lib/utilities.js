import MAX from './constants';

const clamp = v => Math.max(Math.min(v, MAX), 0);
const randInt = v => Math.floor(Math.random() * v);


export default {
    clamp,
    randInt,
}