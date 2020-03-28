/**
 * LEDStrip
 * Helper interface around the dotstar module.
 */
import * as dotstar from 'dotstar';
import SPI from 'pi-spi';

import { MAX } from './constants';
import { lid } from './utilities';

const spi = SPI.initialize('/dev/spidev0.0');

class LEDStrip {

    /**
     * LEDStrip
     * @param {int} ledStripLength 
     * 
     * All methods are chainable.
     * 
     * sync() - wrapper around ledStrip.sync()
     * zero() - set LEDs to zero power. Does not call sync().
     * clear() - set LEDs to zero power, then call sync().
     * setLED(index, r, g, b) - set LED at position {index} to rgb(r, g, b)
     */
    constructor(ledStripLength){
        this.length = parseInt(ledStripLength, 10);
        this.ledStrip = new dotstar.Dotstar(spi, {
            length: this.length
        });
    }

    sync = () => {
        this.ledStrip.sync();
        return this;
    }
    zero = () => {
        this.ledStrip.all(0, 0, 0, 1);
        return this;
    }
    clear = () => {
        this.zero().sync();
        return this;
    }
    setLED = (index, r, g, b) => {
        /**
         * setLED() - wrapper for ledStrip.set()
         * 
         * @param {int} index - position of LED to set
         * @param {float} r - red value
         * @param {float} g - green value
         * @param {float} b - blue value
         */

        // minimum brightness of 1 to deal with flickering issues
        // r = r >= 1 ? r : 0;
        // g = g >= 1 ? g : 0;
        // b = b >= 1 ? b : 0;

        this.ledStrip.set(index, lid(r), lid(g), lid(b), .8);
        return this;
    };
}

export default LEDStrip
