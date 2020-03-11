import * as dotstar from 'dotstar';
const SPI = require('pi-spi');

const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 122;

const ledStrip = new dotstar.Dotstar(spi, {
  length: ledStripLength
});

const MAX = 255;
const TICKRATE = 5;

let r = 0;
let g = 0;
let b = 0;

let index = 0;

const clamp = v => Math.max(Math.min(v, MAX), 0)

const set = (index, r, g, b) => {
    ledStrip.set(index, clamp(r), clamp(g), clamp(b), .8);
    ledStrip.sync();
}

const tick = () => new Promise(resolve => setTimeout(resolve, TICKRATE)); 


while(index < ledStripLength) {

    r = g = b = 0;

    let redUp = async () => {
        while (r <= MAX) {
            set(index, r++, g, b);
            await tick();
        }
        return new Promise.resolve()
    }

    let greenUp = async () => {
        while (g <= MAX) {
            set(index, r--, g++, b);
            await tick();
        }
        return new Promise.resolve()
    }

    let blueUp = async () => {
        while (b <= MAX) {
            set(index, r, g--, b++);
            await tick();
        }
        return new Promise.resolve()
    };

    let fade = async () => {
        while (r + g + b > 0) {
            set(index, r--, g--, b--);
            await tick();
        }
        return new Promise.resolve();
    }

    redUp()
        .then(() => greenUp())
        .then(() => blueUp())
        .then(() => fade());

    index++;

}

ledStrip.off();
