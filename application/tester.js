import * as dotstar from './dotstar';
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

while(index < ledStripLength) {

    r = g = b = 0;

    let redUp = setInterval(() => {
        set(index, r++, g, b--);
        if (r >= MAX) {
            clearInterval(redUp);
        }
    }, TICKRATE)

    let greenUp = setInterval(() => {
        set(index, r--, g++, b);
        ledStrip.sync();
        if (r >= MAX) {
            clearInterval(greenUp);
        }
    }, TICKRATE);

    let blueUp = setInterval(() => {
        set(index, r, g--, b++);
        ledStrip.sync();
        if (r >= MAX) {
            clearInterval(blueUp);
        }
    }, TICKRATE)

    index++;

}

ledStrip.off();
