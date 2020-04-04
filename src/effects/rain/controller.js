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
        return new PointLight({
            position: randInt(STRIP_LENGTH),
            fade: 4,
            b: .07,
            r_falloff: function(){this.r = Math.max(this.b * .7 - .05, 0);},
            g_falloff: function(){this.g = Math.max(this.b * .8 - .05, 0);},
            b_falloff: function(){this.b = this.b * 1.005;},
            velocity: .0005,
            velocity_falloff: function(){this.velocity *= 1.0015;},
            respawns: 1,
            onPropagate: function(){if(this.b > 35){ this.alive = false; }},
            onDeath: function(){
                //log(`splash ${this.r} ${this.g} ${this.b} ${this.age} ${this.position} `);
                const ripple = {
                    position: this.position,
                    r: this.r * .33,
                    g: this.g * .33,
                    b: this.b * .33,
                    r_falloff: .12,
                    g_falloff: .12,
                    b_falloff: .12,
                    velocity_falloff: function(){this.velocity *= .955;},
                    max_age: 1200,
                };
                this.spawns.push(...[
                    new PointLight({...ripple, velocity: -.1}),
                    new PointLight({...ripple, velocity: .1,})
                ]);
            },
        });
    }

    setInterval(() => {
        renderer.tick();
        if (renderer.run && renderer.effects.length < 30 && (Math.random() * 1002 > 993)) {
            renderer.effects.push(raindrop());
        }
    }, TICKRATE);

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


/*

tuning 

r_falloff:
function(){this.r = Math.max(this.b * .07 - .25, 0)}

g_falloff:
function(){this.g = Math.max(this.b * .12 - .25, 0)}

b_falloff:
function(){this.b = this.b * 1.005; if(this.b > 35){ this.alive = false; }}

velocity:
.0002

velocity_falloff:
function(){this.velocity *= 1.001}

max_age:
1870


 */