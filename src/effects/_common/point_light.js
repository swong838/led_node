import { MAX, MAXDISTANCE } from '../../lib/constants';


class PointLight {
    /**
     * 
     * @param {config} - config object
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

        r_falloff = 0,
        g_falloff = 0,
        b_falloff = 0,
        velocity_falloff = 0,
        max_age = 0,

    }){
        this.position = position;
        this.strip_length = strip_length;

        this.r = r;
        this.g = g;
        this.b = b;
        this.velocity = velocity;

        this.r_falloff = r_falloff;
        this.g_falloff = g_falloff;
        this.b_falloff = b_falloff;
        this.velocity_falloff = velocity_falloff;
        this.max_age = max_age;

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
        
    }

    poll = () => {

    }
}

export default PointLight;
