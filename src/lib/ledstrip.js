/**
 * cell effect to LED strip
*/

// hardware
import * as dotstar from 'dotstar';
import SPI from 'pi-spi';

// effects
import Pixel from './pixel';
import Effect from './effect';
import {
    initialEffectFalloff,
    initialEffectDuration,
    initialEffectSpillover
} from './constants';

const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 121;
const ledStrip = new dotstar.Dotstar(spi, {
    length: ledStripLength
});

ledStrip.off();
ledStrip.sync();

const MAX = 255;
const TICKRATE = 20;

const randomEffect = () => {
    return new Effect({
        strength: Math.ceil(Math.random() * 255 * 2) + 255,
        direction: 0,
        decay: initialEffectFalloff,
        duration:initialEffectDuration,
        propagateAfter: initialEffectSpillover
    });
}

const animation = () => {

    //process.stdout.write("\n");
    let pixelArray = [];
    for (let p = 0; p < ledStripLength; p++){
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
                const b = Math.max(val - MAX, 0);
                val -= MAX;
                const r = Math.max(val - 120, 0);
                val -= 120;
                const g = Math.max(val - 60, 0);
                return [r, g, b];
            }
        );
        outputArray.forEach(([r, g, b], index) => {
            ledStrip.set(index, r, g, b, .8);
        })
        ledStrip.sync();
    }
    
    let count = 0;
    let cursor = 0;

    setInterval(() => {
        draw();
        if (count > 50) {count = 0;}
        if (cursor >= ledStripLength) {cursor = 0;}
        if (!count) {
            pixelArray[cursor].addEffect(randomEffect());
        }
        count++;
        cursor += 10;
    }, TICKRATE);

}

export default animation;
