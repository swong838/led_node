import * as dotstar from 'dotstar';
const SPI = require('pi-spi');

const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 122;

const ledStrip = new dotstar.Dotstar(spi, {
    length: ledStripLength
});

const MAX = 255;
const TICKRATE = 2;

let r = 0;
let g = 0;
let b = 0;

const clamp = v => Math.max(Math.min(v, MAX), 0)

const set = (index, r, g, b) => {
    ledStrip.set(index, clamp(r), clamp(g), clamp(b), .8);
    ledStrip.sync();
}

const tick = () => {
    return new Promise(resolve => setTimeout(resolve, TICKRATE));
}

(async () => {
    for (let index = 0; index <= ledStripLength; index++) {
        console.log('writing ', index);
        r = g = b = 0;
        let redUp = async () => {
            for (let i = 0; i <= MAX; i++) {    
                set(index, r++, g, b);
                console.log('setting red', r)
                await tick();
            }
            return Promise.resolve();
        }
    
        let greenUp = async () => {
            for (let i = 0; i <= MAX; i++) {
                set(index, r--, g++, b);
                console.log('setting green', g)
                await tick();
            }
            return Promise.resolve();
        }
    
        let blueUp = async () => {
            for (let i = 0; i <= MAX; i++) {
                set(index, r, g--, b++);
                console.log('setting blue', b)
                await tick();
            }
            return Promise.resolve();
        };
    
        let fade = async () => {
            while (r + g + b > 0) {
                set(index, r--, g--, b--);
                await tick();
            }
            return Promise.resolve();
        }
    
        await redUp()
            .then(greenUp)
            .then(blueUp)
            .then(fade)
            .then(() => {
                ledStrip.off();
            })
    }
})();
