import Renderer from '../_common/renderer';
import PointLight from '../_common/point_light';

import { TICKRATE, STRIP_LENGTH } from '../../lib/constants';
import { log, randInt } from '../../lib/utilities';

const rain = (effectBuffer) => {

    const renderer = new Renderer({});

    const raindrop = () => {
        return new PointLight({
            position: randInt(STRIP_LENGTH),
            fade: 4,
            b: .07,
            a: .1,
            r_delta: function(){this.r = Math.max(this.b * .7 - .05, 0);},
            g_delta: function(){this.g = Math.max(this.b * .8 - .05, 0);},
            b_delta: function(){this.b = this.b * 1.005;},
            velocity: .0005,
            velocity_delta: function(){this.velocity *= 1.0015;},
            respawns: 1,
            onPropagate: function(){if(this.b > 35){ this.alive = false; }},
            onDeath: function(){
                //log(`splash ${this.r} ${this.g} ${this.b} ${this.age} ${this.position} `);
                const ripple = {
                    position: this.position,
                    r: this.r * .33,
                    g: this.g * .33,
                    b: this.b * .33,
                    a: .1,
                    r_delta: .12,
                    g_delta: .12,
                    b_delta: .12,
                    velocity_delta: function(){this.velocity *= .955;},
                    max_age: 1200,
                };
                this.spawns.push(...[
                    new PointLight({...ripple, velocity: -.1}),
                    new PointLight({...ripple, velocity: .1,})
                ]);
            },
        });
    }

    // main render loop
    setInterval(() => {
        renderer.tick();
        if (renderer.run && renderer.effects.length < 30 && (Math.random() * 1002 > 993)) {
            renderer.effects.push(raindrop());
        }
    }, TICKRATE);

    // pick up effects pushed in from UI
    setInterval(() => {
        renderer.effects.push(
            ...effectBuffer.get().map(
                settings => {
                    return new PointLight({...settings});
                }
            )
        );
    }, 250);

    return renderer;
}

export default rain;
