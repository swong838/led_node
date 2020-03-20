import { MAX, MAXDISTANCE, MAXAGE, } from '../../lib/constants';
import { log } from '../../lib/utilities';

class PointLight {
    /**
     * 
     * @param {object} - config object
     * {
     * 
     * 
     * 
     * }
     */

    constructor({
        position = 0,
        strip_length = 0,
        r = 0,
        g = 0,
        b = 0,
        velocity = 0,

        r_falloff = 1,
        g_falloff = 1,
        b_falloff = 1,
        velocity_falloff = 1,
        max_age = MAXAGE,
        leftBoundary = -MAXDISTANCE,
        rightBoundary = strip_length + MAXDISTANCE,

    }){
        this.position = position % strip_length;
        this.origin = this.position;
        this.position = this.origin;
        this.strip_length = strip_length;

        this.r = r;
        this.g = g;
        this.b = b;
        this.velocity = velocity;

        this.max_age = max_age;

        // Handle falloffs as either numbers or callbacks
        this._updateRed = () => this.r -= this.r_falloff;
        this._updateGreen = () => this.g -= this.g_falloff;
        this._updateBlue = () => this.b -= this.b_falloff;
        this._updateVelocity = () => this.velocity -= this.velocity_falloff;
        if (typeof r_falloff === 'function') {
            this._updateRed = r_falloff.bind(this);
        }
        if (typeof g_falloff === 'function') {
            this._updateGreen = g_falloff.bind(this);
        }
        if (typeof b_falloff === 'function') {
            this._updateBlue = b_falloff.bind(this);
        }
        if (typeof velocity_falloff === 'function') {
            this._updateVelocity = velocity_falloff.bind(this);
        }

        // Precalculate the furthest left and right this source can travel
        this.leftBoundary = Math.max(leftBoundary, -MAXDISTANCE);
        this.rightBoundary = Math.min(rightBoundary, this.strip_length + MAXDISTANCE);

        // intrinsic properties
        this.age = 0;
        this.alive = true;
    }

    range = () => {
        /**
         * range() - return a range of pixels that will be affected by this light source.
         *    floor of 0, ceiling of this.strip_length
         * 
         * return
         *    (array) [leftmost, rightmost]
         */

        const bottom = Math.floor(Math.max(this.position - MAXDISTANCE, 0));
        const top = Math.ceil(Math.min(this.position + MAXDISTANCE, this.strip_length));
        return [bottom, top];
    }

    propagate = () => {
        // move
        this.position += this.velocity;

        // delta-V, delta-lux, etc.
        this._updateRed();
        this._updateGreen();
        this._updateBlue();
        this._updateVelocity();

        // handle expiration
        this.age++;
        let obit = '';
        if (this.age > this.max_age) {
            obit = 'aged out';
            this.alive = false;
        }

        else if (this.position < this.leftBoundary || this.position > this.rightBoundary) {
            obit = 'went out of range'
            this.alive = false;
        }
        
        else if (this.r + this.b + this.g < -MAX) {
            obit = 'dimmed out';
            this.alive = false;
        }

        if (!this.alive) {
            log(`PointLight from ${this.origin} ${obit} at ${this.position}`);
        }

    }

    poll = (at_pixel) => {
        /**
         * Return the RGB effect this light source would have on position (at)
         * @param {int} at_pixel - the index of the pixel
         * Returns:
         *    {r, g, b} 
         */
    }
}

export default PointLight;
