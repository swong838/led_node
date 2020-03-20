import { MAX, MAXDISTANCE, MAXAGE, } from '../../lib/constants';
import { log } from '../../lib/utilities';


class PointLight {
    /**
     * A single point light source.
     * Moves with each tick, via {position + velocity}
     * 
     * @param {object} - config object
     * {
     *  // Position and speed.
        @param {number} position - initial position of this light
        @param {integer} strip_length - length of the light strip
        @param {number} r - initial Red value
        @param {number} g - initial Green value
        @param {number} b - initial Blue value
        @param {number} velocity - initial velocity
        @param {number} fade - light falloff with distance from this source. ~2.2 is a good value here...

        // How this light will change over time.
        // These may be numbers, or they may be functions.
        // Functions will be bound to have access to `this`...
        @param {number, function} r_falloff - change in r per tick
        @param {number, function} g_falloff - change in g per tick
        @param {number, function} b_falloff - change in b per tick
        @param {number, function} velocity_falloff - change in velocity per tick

        // Boundary conditions.
        @param {integer} max_age - maximum age for this light in ticks
        @param {integer} leftBoundary - lowest position this light may occupy
        @param {integer} rightBoundary - highest position this light may occupy
     * }
     */

    constructor({
        position = 0,
        strip_length = 0,
        r = 0,
        g = 0,
        b = 0,
        velocity = 0,
        fade = 2.2,

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
        this.fade = fade;

        this.max_age = max_age % MAXAGE;

        // Handle falloffs as either numbers or callbacks
        this._updateRed = () => this.r -= r_falloff;
        this._updateGreen = () => this.g -= g_falloff;
        this._updateBlue = () => this.b -= b_falloff;
        this._updateVelocity = () => this.velocity -= velocity_falloff;
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

        log(`Point light at spawned at ${this.origin}`)
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
        // apply movement
        this.position += this.velocity;

        // update power and speed
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

    poll = (target_location) => {
        /**
         * Return the RGB effect this light source would have at target_location
         * @param {int} target_location
         * Returns:
         *    {r, g, b} 
         */
        const power = 1 / Math.pow(Math.abs(target_location - this.position), this.fade);
        const illumination = {
            r: this.r * power,
            g: this.g * power,
            b: this.b * power,
        }
        return illumination;
    }
}

export default PointLight;
