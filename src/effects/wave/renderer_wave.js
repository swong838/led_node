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
    randInt, log
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

const randomWave = () => {
    return new Wave({
        origin: randInt(ledStripLength),
        r: randInt(105)+ 10,
        g: randInt(105)+ 10,
        b: randInt(105)+ 10,
        velocity: (Math.random() * .02),
        velocityFalloff: Math.min(Math.random(), .00002),
        powerFalloff: (Math.random() * .125),
        // origin: 40,
        // r: 125,
        // g: 125,
        // b: 125,
        //velocity: .02,
        // velocityFalloff: .000002,
        // powerFalloff: .225
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

    const ledStrip = new LEDStrip(ledStripLength);

    let waves = [];
    let run = false;
    const foo = 'foo';

    const advance = () => {
        waves = waves.filter(wave => {
            if (!wave.alive) {
                const morgueTime = new Date().getTime() - wave.expirationTime;
                log(`${wave.origin} died: ${wave.obit}, cleanup took ${morgueTime}ms`);
            }
            return wave.alive;
        });

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

        advance();
        if (waves.length) {
            render();
        }

        if (waves.length < 8 && Math.random() * 1002 > 900) {
            const newWave = randomWave();
            waves.push(newWave);
        }
    }, TICKRATE);

    return {
        go: () => {
            console.log(foo);
            run = true;
        },
        stop: () => {
            run = false;
        }
    }

}

export default led_waves;
