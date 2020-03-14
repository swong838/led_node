const MAX_LIFE = 2000;

class Wave {

    /** 
        Wave
            Spawn an effect wave at an origin point.
            Travels equally in both directions.

        constructor({
            origin (int): center of wave effect
            r, g, b (int): red, green, blue
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
        powerFalloff = 0,
        velocity = 1,
        velocityFalloff = 0,
    }) {
        this.origin = origin;
        this.r = r % 255;
        this.g = g % 255;
        this.b = b % 255;
        this.powerFalloff = powerFalloff;
        this.velocity = velocity;
        this.velocityFalloff = velocityFalloff;

        this.alive = true;
        this.duration = 0;
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
        const rightEdgePower = 1 / Math.pow(Math.abs(position - this.origin + this.distance), 1.05);

        // left edge power multiplier
        const leftEdgePower = 1 / Math.pow(Math.abs(position - this.origin - this.distance), 1.05);

        const lighting = {
            r: (this.r * rightEdgePower) + (this.r * leftEdgePower),
            g: (this.g * rightEdgePower) + (this.g * leftEdgePower),
            b: (this.b * rightEdgePower) + (this.b * leftEdgePower),
        }
        
        return lighting;

    }

    propagate() {
        /**
         * Move the wave along.
         */
        this.distance += this.velocity;
        this.velocity -= this.velocityFalloff;

        this.r -= this.powerFalloff;
        this.g -= this.powerFalloff;
        this.b -= this.powerFalloff;

        this.duration++;

        if (this.duration > MAX_LIFE) {
            console.log('aged out')
            this.alive = false;
        }
        else if (this.velocity <= 0) {
            console.log('stopped');
            this.alive = false;
        }
        else if (this.r + this.g + this.b <= 0) {
            console.log('dimmed out')
            this.alive = false;
        }
    }
}

export default Wave;
