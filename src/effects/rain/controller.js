import Renderer from '../_common/renderer';
import PointLight from '../_common/point_light';

import { TICKRATE, STRIP_LENGTH } from '../../lib/constants';
import { log, randInt } from '../../lib/utilities';

const rain = (effectBuffer) => {

    const renderer = new Renderer(function(){
        let touched = {};
        this.effects.forEach(effect => {
            const [lower, upper] = effect.range();
            for (let p = lower; p <= upper; p++) {
                const {r, g, b} = effect.poll(p);
                if (p in touched) {
                    touched[p].r += r;
                    touched[p].g += g;
                    touched[p].b += b;
                }
                else {
                    touched[p] = {r, g, b};
                }
            }
        });
        this.ledStrip.zero();
        for (const index in touched) {
            const {r, g, b} = touched[index];
            this.ledStrip.setLED(index, r, g, b);
        }
        this.ledStrip.sync();
    });

    const raindrop = () => {
        const drop = new PointLight({
            //position: randInt(STRIP_LENGTH),
            position: 60,
            r_falloff: function(){this.r = this.b * .05},  
            g_falloff: function(){this.g = this.b * .1},
            b_falloff: function(){
                this.b = this.age * .004;
                if(this.b > 28){
                    this.alive = false;
                }
            },
            velocity: .00002,
            velocity_falloff: function(){this.velocity *= 1.0005},
            respawns: 0,
            onDeath: function(){
                log(`splash ${this.r} ${this.g} ${this.b} ${this.age} ${this.position} `)
            },
        });
        return drop;
    }

    setInterval(renderer.tick, TICKRATE);

    setInterval(() => {
        renderer.effects.push(
            ...effectBuffer.get().map(
                settings => {
                    return new PointLight({...settings});
                }
            )
        );
    }, 250);

    setInterval(() => {
        if (renderer.run && renderer.effects.length < 1) {
            renderer.effects.push(raindrop())
        }
    }, 1000)

    return renderer;
}

export default rain;
