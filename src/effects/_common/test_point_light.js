import Renderer from './renderer';
import PointLight from './point_light';
import { randInt } from '../../lib/utilities';

const TICKRATE = 2;

const test_point_light = () => {

    const randomEffect = () => {
        return new PointLight({
            r: randInt(125)+ 20,
            g: randInt(125)+ 20,
            b: randInt(125)+ 20,
            velocity: Math.random() * .05,
            velocityFalloff: Math.min(Math.random(), .0002),
        });
    }

    const renderer = new Renderer(() => {
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

    setInterval(renderer.tick, TICKRATE);
    setInterval(() => {
        if (renderer.effects.length < 6) {
            renderer.effects.push(randomEffect())
        }
    }, 1000)

}

export default test_point_light;
