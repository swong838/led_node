/**
 * cell effect to LED strip
*/

// hardware
import LEDStrip from '../../lib/led_strip';

// performance
import { PerformanceObserver, performance } from 'perf_hooks';
import * as readline from 'readline';

// effects
import Wave from './wave';

import {
    randInt
} from '../../lib/utilities';

let renderTimer = [];

const obs = new PerformanceObserver((items) => {
    renderTimer.push(items.getEntries()[0].duration);
    performance.clearMarks();

    // every 1000 frames, print average frame draw time
    if (renderTimer.length >= 1000) {
        const average = renderTimer.reduce(
            (accumulator, time) => {return accumulator += time;},
            0
        ) / renderTimer.length;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);
        process.stdout.write(`average frame render => ${average.toFixed(2)} ms`);
        renderTimer = [];
    }
});

const TICKRATE = 2;
const ledStripLength = 122;
const ledStrip = new LEDStrip(ledStripLength)

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

        ledStrip.zero();
        for (const index in touched) {
            const {r, g, b} = touched[index];
            ledStrip.setLED(index, r, g, b);
        }

        ledStrip.sync();
    }


    //effect generator
    
    setInterval(() => {
        performance.mark('startrender');
        advance();
        if (waves.length) {
            render();
        }
        if (waves.length < 4 && Math.random() * 1002 > 1000) {
            const newWave = randomWave();
            waves.push(newWave);
        }

        performance.mark('endrender');
        performance.measure('time in render', 'startrender', 'endrender');
        obs.observe({ entryTypes: ['measure'] });
    }, TICKRATE);
}

export default led_waves;
