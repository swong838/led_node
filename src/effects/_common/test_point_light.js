import Renderer from './renderer';
import PointLight from './point_light';

const TICKRATE = 2;

const test_point_light = (effectBuffer) => {

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

    setInterval(() => renderer.tick(), TICKRATE);
    setInterval(() => {
        renderer.effects.push(
            ...effectBuffer.get().map(
                settings => new PointLight({...settings})
            )
        );
    }, 100)
}

export default test_point_light;
