/**
 * cell effect to LED strip
*/

// hardware
import * as dotstar from 'dotstar';
import SPI from 'pi-spi';

// effects
import Wave from './wave';

import {
    lid,
    randInt,
} from './utilities';

const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 60;
const ledStrip = new dotstar.Dotstar(spi, {
    length: ledStripLength
});

ledStrip.all(0, 0, 0, .8);
ledStrip.sync();

const TICKRATE = 2;

const randomWave = () => {
    return new Wave({
        origin: randInt(ledStripLength),
        r: randInt(125)+ 30,
        g: randInt(125)+ 30,
        b: randInt(125)+ 30,
        velocity: Math.random() * .4,
        velocityFalloff: Math.min(Math.random(), .00002),
        powerFalloff: (Math.random() * 1),
    });
}

const setLED = (index, r, g, b) => {
    let redOut = lid(r);
    let greenOut = lid(g);
    let blueOut = lid(b);

    if (r + g + b < 30) {
        r = g = b = 0;
    }

    ledStrip.set(index, redOut, greenOut, blueOut, .8);
};


const mask = (position, distance) => {
    /**
     * max(position) - get range +- distance from position
     *    floor of 0, ceiling of ledStripLength
     * 
     * return
     *    (array) [bottom, top]
     */

    const bottom = Math.max(position - distance, 0);
    const top = Math.min(position + distance, ledStripLength);
    return [bottom, top];
}

const led_waves = () => {
    let pixels = new Array(ledStripLength);
    let waves = [];

    const advance = () => {
        waves = waves.filter(wave => wave.alive);

        // propagate each effect that remains
        waves.forEach(wave => wave.propagate());
    };

    const render = () => {

        // flush the rendering buffer
        for (let p in pixels) {
            pixels[p] = {r: 0, g: 0, b: 0};
        }

        waves.forEach(wave => {
            const [leftBottom, leftTop] = mask(wave.leftEdge, wave.distanceCutoff);
            const [rightBottom, rightTop] = mask(wave.rightEdge, wave.distanceCutoff);

            // apply effect to pixels in range of the left edge
            for (let i = leftBottom; i <= leftTop; i++) {
                const {r, g, b} = wave.poll(i);
                pixels[i].r += r;
                pixels[i].g += g;
                pixels[i].b += b;
            }

            // apply effect to pixels in range of the right edge
            for (let i = rightBottom; i <= rightTop; i++) {
                const {r, g, b} = wave.poll(i);
                pixels[i].r += r;
                pixels[i].g += g;
                pixels[i].b += b;
            }

        })

        

        for(let pixelToSet = 0; pixelToSet < ledStripLength; pixelToSet++) {
            let redSum = 0;
            let blueSum = 0;
            let greenSum = 0;
            waves.forEach((wave) => {
                const {r, g, b} = wave.poll(pixelToSet);
                redSum += r;
                greenSum += g;
                blueSum += b;
            });
            setLED(pixelToSet, redSum, greenSum, blueSum);
            ledStrip.sync();
        }
    }

    //effect generator
    setInterval(() => {
        advance();
        if (waves.length) {
            render();
        }
        else {
            ledStrip.all(0, 0, 0, 0);
            ledStrip.sync();
        }
        if (waves.length < 4 && Math.random() * 1002 > 1000) {
            const newWave = randomWave();
            console.log('[][][] spawning wave at ', newWave.origin);
            waves.push(newWave);
        }
    }, TICKRATE);
}

export default led_waves;
