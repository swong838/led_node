import Renderer from '../_common/renderer';
import { TICKRATE, STRIP_LENGTH } from '../../lib/constants';
import { randInt, log } from '../../lib/utilities';


// effects
import Wave from './wave';
import PointLight from '../_common/point_light';


const led_waves = (effectBuffer) => {

    const renderer = new Renderer();

    const wave = () => {
        // spawn two point lights going in opposite directions from the same origin
        const right = {
            position: randInt(STRIP_LENGTH),
            r: randInt(105)+ 10,
            g: randInt(105)+ 10,
            b: randInt(105)+ 10,
            velocity: (Math.random() * .02),
            velocity_delta: function(){ this.velocity *= Math.min(Math.random(), .00002); },
            r_delta: function(){ this.r -= Math.random() * .125; },
            g_delta: function(){ this.g -= Math.random() * .125; },
            b_delta: function(){ this.b -= Math.random() * .125; },
        };
        const left = {
            ...right,
            velocity: -right.velocity,
        }
        return [new PointLight(left), new PointLight(right)];
    }

    // const mask = (position, distance) => {
    //     /**
    //      * max(position) - get range +- distance from position
    //      *    floor of 0, ceiling of ledStripLength
    //      * 
    //      * return
    //      *    (array) [bottom, top]
    //      */
    //     const bottom = Math.floor(Math.max(position - distance, 0));
    //     const top = Math.ceil(Math.min(position + distance, ledStripLength));
    //     return [bottom, top];
    // }

    // const advance = () => {
    //     waves = waves.filter(wave => {
    //         if (!wave.alive) {
    //             const morgueTime = new Date().getTime() - wave.expirationTime;
    //             log(`${wave.origin} died: ${wave.obit}, cleanup took ${morgueTime}ms`);
    //         }
    //         return wave.alive;
    //     });

    //     // propagate each effect that remains
    //     waves.forEach(wave => wave.propagate());
    // };

    // const render = () => {

    //     let touched = {};
    //     waves.forEach(wave => {
    //         const [leftBottom, leftTop] = mask(wave.leftEdge, wave.distanceCutoff);
    //         const [rightBottom, rightTop] = mask(wave.rightEdge, wave.distanceCutoff);

    //         for (let i = leftBottom; i <= leftTop; i++) {
    //             const {r, g, b} = wave.poll(i);
    //             if (!touched[i]) {
    //                 touched[i] = {r: 0, g: 0, b: 0}
    //             }
    //             touched[i].r += r;
    //             touched[i].g += g;
    //             touched[i].b += b;
    //         }

    //         for (let i = rightBottom; i <= rightTop; i++) {
    //             const {r, g, b} = wave.poll(i);
    //             if (!touched[i]) {
    //                 touched[i] = {r: 0, g: 0, b: 0}
    //             }
    //             touched[i].r += r;
    //             touched[i].g += g;
    //             touched[i].b += b;
    //         }
    //     });

    //     ledStrip.zero();
    //     for (const index in touched) {
    //         const {r, g, b} = touched[index];
    //         ledStrip.setLED(index, r, g, b);
    //     }

    //     ledStrip.sync();
    // }

    // main render loop
    setInterval(() => {
        renderer.tick();
        if (waves.length < 8 && Math.random() * 1002 > 900) {
            renderer.effects.push(...wave());
        }
    }, TICKRATE);


}

export default led_waves;
