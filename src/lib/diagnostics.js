/**
 * Diagnostic logging to stdout
*/


import chalk from 'chalk';
import * as readline from 'readline';
import Pixel from './pixel';
import Effect from './effect';
import {
    initialEffectFalloff,
    initialEffectDuration,
    initialEffectSpillover
} from './constants';


const GLYPH = '■';
const TICKRATE = 20;
const NUM_PIXELS = 60;

const randomEffect = () => {
    return new Effect({
        strength: Math.ceil(Math.random() * 255 * 2) + 255,
        direction: 0,
        decay: initialEffectFalloff,
        duration:initialEffectDuration,
        propagateAfter: initialEffectSpillover
    });
}

const diagnostics = () => {

    process.stdout.write("\n");
    let pixelArray = [];
    for (let p = 0; p < NUM_PIXELS; p++){
        pixelArray.push(new Pixel(p));
    }

    const draw = () => {
        const outputArray = pixelArray.map(
            (pixel, index) => {
                const {left, right} = pixel.exports;
                const leftNeighbor = pixelArray[index-1];
                const rightNeighbor = pixelArray[index+1];
                leftNeighbor && leftNeighbor.addEffect(left);
                rightNeighbor && rightNeighbor.addEffect(right);
                pixel.clearExports();

                let val = pixel.getValue();
                const b = Math.max(val - 255, 0);
                val -= 255;
                const r = Math.max(val - 120, 0);
                val -= 120;
                const g = Math.max(val - 60, 0);
                return chalk.rgb(r, g, b)(GLYPH);

            }
        );

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, null);
        process.stdout.write(outputArray.join(''));
    }
    
    let count = 0;
    let cursor = 0;

    setInterval(() => {
        draw();
        if (count > 50) {count = 0;}
        if (cursor >= NUM_PIXELS) {cursor = 0;}
        if (!count) {
            pixelArray[cursor].addEffect(randomEffect());
        }
        count++;
        cursor += 10;
    }, TICKRATE);

}

export default diagnostics;
