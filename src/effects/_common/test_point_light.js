import Renderer from './renderer';
import PointLight from './point_light';

import { TICKRATE } from '../../lib/constants';
import { log } from '../../lib/utilities';

const test_point_light = (effectBuffer) => {

    const renderer = new Renderer(function(){
        let touched = {};
        this.effects.forEach(effect => {
            const [lower, upper] = effect.range();
            for (let p = lower; p <= upper; p++) {
                const {r, g, b, a} = effect.poll(p);
                if (p in touched) {
                    touched[p].r += r;
                    touched[p].g += g;
                    touched[p].b += b;
                }
                else {
                    touched[p] = {r, g, b, a};
                }
            }
        });
        this.ledStrip.zero();
        for (const index in touched) {
            const {r, g, b, a} = touched[index];
            this.ledStrip.setLED(index, r, g, b, a);
        }
        this.ledStrip.sync();
    });

    setInterval(renderer.tick, TICKRATE);
    setInterval(() => {
        renderer.effects.push(
            ...effectBuffer.get().map(
                settings => {
                    if (!settings) {
                        return false;
                    }
                    return new PointLight({...settings});
                }
            )
        );
    }, 100);
    return renderer;
}

export default test_point_light;
