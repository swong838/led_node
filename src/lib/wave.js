const MAX_LIFE = 300;

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

    constructor = ({
        origin,
        r = 0,
        g = 0,
        b = 0,
        powerFalloff = 0,
        velocity = 1,
        velocityFalloff = 0,
    }) => {
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
    }

    poll = (position) => {
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
        const highPower = 1 / (position - this.origin + this.distance) ** 2;

        // left edge power multiplier
        const lowPower = 1 / (position - this.origin - this.distance) ** 2;

        return {
            r: (this.r * this.highPower) + (this.r * this.lowPower),
            g: (this.g * this.highPower) + (this.g * this.lowPower),
            b: (this.b * this.highPower) + (this.b * this.lowPower),
        }
    }

    propagate = () => {
        /**
         * Move the wave along.
         */
        this.distance += this.velocity;
        this.velocity -= this.velocityFalloff;

        this.r -= powerFalloff;
        this.g -= powerFalloff;
        this.b -= powerFalloff;

        this.duration++;

        if (
            this.duration > MAX_LIFE ||
            (this.r + this.g + this.b <= 0)
        ) {
            this.alive = false;
        }
    }
}

export default Wave;
