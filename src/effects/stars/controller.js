import Renderer from '../_common/renderer';
import PointLight from '../_common/point_light';

import { TICKRATE, STRIP_LENGTH } from '../../lib/constants';
import { log, between, randInt } from '../../lib/utilities';

const stars = (effectBuffer) => {
    /**
     * Stars twinkle but stay in one spot.
     * They eventually fade out but are replaced with others.
     */

    log('starting stars');

    const renderer = new Renderer({});

    const star = () => {

        const luminosity = between(20, 30);

        return new PointLight({
            position: randInt(STRIP_LENGTH),
            fade: 3,
            a: .1,
            r_delta: function(){this.r = luminosity * Math.sin(this.age / 300);},
            g_delta: function(){this.g = luminosity * Math.sin(this.age / 300);},
            b_delta: function(){this.b = luminosity * Math.sin(this.age / 300);},
        });
    }

    // main render loop
    setInterval(() => {
        renderer.tick();
        if (renderer.run && renderer.effects.length < 12 && (Math.random() * 1000 > 999.8)) {
            renderer.effects.push(star());
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
