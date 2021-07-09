import Renderer from '../_common/renderer';
import PointLight from '../_common/point_light';

import { TICKRATE, STRIP_LENGTH } from '../../lib/constants';
import { log, between, randInt } from '../../lib/utilities';

const fireflies = (effectBuffer) => {

    const renderer = new Renderer({});

    const firefly = () => {

        const gPower = between(20, 30);
        let genki = between(.001, .003);
        const freq = between(800, 1800);
        if (Math.random() > .5) {genki *= -1;}

        return new PointLight({
            position: randInt(STRIP_LENGTH),
            fade: 3,
            a: .1,
            r_delta: function(){this.r = this.g * .84;},
            g_delta: function(){this.g = gPower * Math.sin(this.age / 300)},
            b_delta: function(){this.b = this.b * 1.005;},
            velocity_delta: function(){this.velocity = genki * Math.sin(this.age / freq)},
            //onPropagate: function(){if(this.b > 35){ this.alive = false; }},
        });
    }

    // main render loop
    setInterval(() => {
        renderer.tick();
        if (renderer.run && renderer.effects.length < 4 && (Math.random() * 1000 > 999.8)) {
            renderer.effects.push(firefly());
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

export default fireflies;
