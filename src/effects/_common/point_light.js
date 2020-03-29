import { MAX, MAXDISTANCE, MAXAGE, MAX_GENERATIONS, STRIP_LENGTH } from '../../lib/constants';
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

        // Other interesting callbacks
        @param {function} onDeath - what to do when this point light expires

        // Boundary conditions.
        @param {integer} max_age - maximum age for this light in ticks
        @param {integer} leftBoundary - lowest position this light may occupy
        @param {integer} rightBoundary - highest position this light may occupy
        @param {integer} respawns - # of new effects this effect may spawn
     * }
     */

    constructor({
        position = 0,
        r = 0,
        g = 0,
        b = 0,
        velocity = 0,
        fade = 2.2,

        r_falloff = 0,
        g_falloff = 0,
        b_falloff = 0,
        velocity_falloff = 0,

        onDeath = function(){},

        max_age = MAXAGE - 1,
        leftBoundary = -MAXDISTANCE,
        rightBoundary = STRIP_LENGTH + MAXDISTANCE,
        respawns = MAX_GENERATIONS - 1

    }){

        this.position = position % STRIP_LENGTH;
        this.origin = this.position;
        this.position = this.origin;

        this.r = this.initial_r = r;
        this.g = this.initial_g = g;
        this.b = this.initial_b = b;
        this.velocity = this.initial_velocity = velocity;
        this.fade = this.initial_fade = fade;

        this.max_age = max_age % MAXAGE;
        this.respawns = respawns % MAX_GENERATIONS

        this.onDeath = onDeath.bind(this);

        // Precalculate the furthest left and right this source can travel
        this.leftBoundary = Math.max(leftBoundary, -MAXDISTANCE);
        this.rightBoundary = Math.min(rightBoundary, STRIP_LENGTH + MAXDISTANCE);

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

        // intrinsic properties
        this.strip_length = STRIP_LENGTH;
        this.age = 0;
        this.alive = true;

        // push new effects into this array during propagation, for the renderer to pick up
        this.spawns = [];

        log(
            `Point light spawned at
            origin=${this.origin}
            velocity=${this.velocity}
            respawns=${this.respawns}
            r${this.r} g${this.g} b${this.b}
            left=${this.leftBoundary} right=${this.rightBoundary}`
        )

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

        //log(`PointLight ${this.origin} r${this.r} g${this.g} b${this.b} age${this.age} alive${this.alive}`);

        if (!this.alive) {
            log(`PointLight from ${this.origin} ${obit} at ${this.position} -- r${this.r} g${this.g} b${this.b} age${this.age}`);
            this.onDeath();
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
