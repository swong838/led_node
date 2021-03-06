import { log } from '../../lib/utilities';
import { MAX } from '../../lib/constants';

const MAX_LIFE = 1500;
const LIGHT_FALLOFF = 2.2;
const CULL_AT = 15;

class Wave {

    /** 
        Wave
            Spawn an effect wave at an origin point.
            Travels equally in both directions.

        constructor({
            origin (int): center of wave effect
            r, g, b (int): red, green, blue

            distanceCutoff (int): max distance from each wave edge that can be affected

            powerFalloff (float): r/g/b falloff per tick
            velocity (float): speed of wavefront
            velocityFalloff (float): velocity drop per tick
        })

        Methods:
            poll(position) - Check the wave's effect on (position)
            propagate() - Move the wave along
    */

    constructor({
        origin,
        r = 0,
        g = 0,
        b = 0,
        distanceCutoff = CULL_AT,
        powerFalloff = 0,
        velocity = 1,
        velocityFalloff = 0,
    }) {
        this.origin = origin;

        this.rightEdge = origin;
        this.leftEdge = origin;

        this.r = r % MAX;
        this.g = g % MAX;
        this.b = b % MAX;

        this.distanceCutoff = Math.ceil(distanceCutoff);

        this.powerFalloff = powerFalloff;
        this.velocity = velocity;
        this.velocityFalloff = velocityFalloff;

        this.alive = true;
        this.age = 0;
        this.obit = '';
        this.expirationTime = 0;
        this.distance = 0;

        this.poll = this.poll.bind(this);
        this.propagate = this.propagate.bind(this);
    }

    poll(position) {
        /**
         * Check the wave's effect on a given position.
         * 
         * Args:
         *      position (int): Index # of position
         * 
         * Returns:
         *      (object):
         *          {r, g, b} (ints) - RGB to apply at this position
         */

        // right edge power multiplier
        const rightEdgePower = 1 / Math.pow(Math.abs(position - this.origin + this.distance), LIGHT_FALLOFF);

        // left edge power multiplier
        const leftEdgePower = 1 / Math.pow(Math.abs(position - this.origin - this.distance), LIGHT_FALLOFF);

        const lighting = {
            r: (this.r * rightEdgePower) + (this.r * leftEdgePower),
            g: (this.g * rightEdgePower) + (this.g * leftEdgePower),
            b: (this.b * rightEdgePower) + (this.b * leftEdgePower),
        }
        
        return lighting;
    }

    die(reason){
        //log(`${this.origin} ${reason}`);
        this.obit = reason;
        this.expirationTime = new Date().getTime();
        this.alive = false;
    }

    propagate() {
        /**
         * Move the wave along.
         */
        this.distance += this.velocity;

        this.rightEdge = this.origin + this.distance;
        this.leftEdge = this.origin - this.distance;

        this.velocity = Math.max(this.velocity - this.velocityFalloff, 0);

        this.r -= this.powerFalloff;
        this.g -= this.powerFalloff;
        this.b -= this.powerFalloff;

        this.age++;

        if (this.age > MAX_LIFE) {
            this.die('aged out');
        }
        // else if (this.velocity <= 0) {
        //     this.die('halted')
        // }
        else if (this.r < 0 && this.g < 0 && this.b < 0) {
            this.die(`dimmed out with R=${this.r} G=${this.g} B=${this.b}`);
        }
    }
}

export default Wave;
