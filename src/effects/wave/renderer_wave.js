import Renderer from '../_common/renderer';
import { TICKRATE, STRIP_LENGTH } from '../../lib/constants';
import { randInt, log } from '../../lib/utilities';


// effects
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
            velocity: (Math.random() * .05),
            velocity_delta: function(){ this.velocity *= .995; },
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

    // main render loop
    setInterval(() => {
        renderer.tick();
        if (renderer.run && renderer.effects.length < 8 && Math.random() * 1002 > 900) {
            renderer.effects.push(...wave());
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

export default led_waves;
