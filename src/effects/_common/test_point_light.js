import Renderer from './renderer';
import PointLight from './point_light';
import { randInt } from '../../lib/utilities';

const TICKRATE = 2;

const test_point_light = () => {

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

    const randomEffect = () => {
        return new PointLight({
            position: 0,
            strip_length: renderer.length,
            r: 125,
            r_falloff: .1,
            g: 125,
            g_falloff: .1,
            b: 125,
            b_falloff: .1,
            velocity: .03,
            velocity_falloff: 0,
            respawns: 4,
        });
    }

    setInterval(() => {
        renderer.tick();
    }, TICKRATE);
    setInterval(() => {
        if (renderer.effects.length < 60) {
            renderer.effects.push(randomEffect())
        }
    }, 1000)

}

export default test_point_light;
