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
    randInt
} from './utilities';

const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 122;
const ledStrip = new dotstar.Dotstar(spi, {
    length: ledStripLength
});

ledStrip.all(0, 0, 0, .8);
ledStrip.sync();

const TICKRATE = 2;

const randomWave = () => {
    return new Wave({
        origin: randInt(ledStripLength),
        r: randInt(125)+ 20,
        g: randInt(125)+ 20,
        b: randInt(125)+ 20,
        velocity: Math.random() * .05,
        velocityFalloff: Math.min(Math.random(), .0002),
        powerFalloff: (Math.random() * .25),
    });
}

const setLED = (index, r, g, b) => {
    let redOut = lid(r);
    let greenOut = lid(g);
    let blueOut = lid(b);

    if (r + g + b < 3) {
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

    const bottom = Math.floor(Math.max(position - distance, 0));
    const top = Math.ceil(Math.min(position + distance, ledStripLength));
    return [bottom, top];
}

const led_waves = () => {

    let waves = [];

    const advance = () => {
        waves = waves.filter(wave => wave.alive);

        // propagate each effect that remains
        waves.forEach(wave => wave.propagate());
    };

    const render = () => {

        let touched = {};
        waves.forEach(wave => {
            const [leftBottom, leftTop] = mask(wave.leftEdge, wave.distanceCutoff);
            const [rightBottom, rightTop] = mask(wave.rightEdge, wave.distanceCutoff);

            for (let i = leftBottom; i <= leftTop; i++) {
                const {r, g, b} = wave.poll(i);
                if (!touched[i]) {
                    touched[i] = {r: 0, g: 0, b: 0}
                }
                touched[i].r += r;
                touched[i].g += g;
                touched[i].b += b;
            }

            for (let i = rightBottom; i <= rightTop; i++) {
                const {r, g, b} = wave.poll(i);
                if (!touched[i]) {
                    touched[i] = {r: 0, g: 0, b: 0}
                }
                touched[i].r += r;
                touched[i].g += g;
                touched[i].b += b;
            }
        });

        ledStrip.all(0, 0, 0, 0);
        for (const index in touched) {
            const {r, g, b} = touched[index];
            setLED(index, r, g, b);
        }

        ledStrip.sync();
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
        if (waves.length < 4 && Math.random() * 1002 > 998) {
            const newWave = randomWave();
            waves.push(newWave);
        }
    }, TICKRATE);
}

export default led_waves;
