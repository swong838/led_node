/**
 * LEDStrip
 * Helper interface around the dotstar module.
 * https://github.com/mattmazzola/dotstar#readme
 */
import * as dotstar from 'dotstar';
import SPI from 'pi-spi';

import { lid } from './utilities';

import { emulation } from './constants';


const spi = emulation ? {} : SPI.initialize('/dev/spidev0.0');


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
        this.ledStrip = emulation ? {
            sync: () => {},
            all: () => {},
            set: () => {},
        } : new dotstar.Dotstar(spi, {
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
    setLED = (index, r, g, b, a=.2) => {
        /**
         * setLED() - wrapper for ledStrip.set()
         * 
         * @param {int} index - position of LED to set
         * @param {float} r - red value
         * @param {float} g - green value
         * @param {float} b - blue value
         * @param {float} a - alpha (brightness)
         */

        this.ledStrip.set(index, lid(r), lid(g), lid(b), Math.min(a, 1));
        return this;
    };
}

export default LEDStrip
