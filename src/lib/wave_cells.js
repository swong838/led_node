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
const ledStripLength = 121;
const ledStrip = new dotstar.Dotstar(spi, {
    length: ledStripLength
});

ledStrip.off();
ledStrip.sync();


const TICKRATE = 1;

const randomWave = () => {
    return new Wave({
        origin: randInt(ledStripLength),
        r: randInt(255),
        g: randInt(255),
        b: randInt(255),
        velocity: Math.random() * .2,
        velocityFalloff: Math.min(Math.random(), .00002),
        powerFalloff: Math.min(Math.random(), 1),
    });
}


const setLED = (index, r, g, b) => ledStrip.set(index, lid(r), lid(g), lid(b));

const led_waves = () => {

    let waves = [];

    const advance = () => {
        // propagate each effect that remains
        waves.forEach(wave => wave.propagate());
        // remove expired waves
        waves = waves.filter(wave => wave.alive)
    };

    const render = () => {
        let pixelToSet = (ledStripLength - 1);
        while(pixelToSet--) {
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
        }
        ledStrip.sync();
    }


    // effect generator
    setInterval(() => {
        advance();
        render();
        if (Math.random() * 1002 > 1000) {
            waves.push(randomWave());
        }

    }, TICKRATE);

}

export default led_waves;
