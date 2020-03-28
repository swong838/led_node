// generic renderer
import LEDStrip from '../../lib/led_strip';

class Renderer{
    constructor(renderMethod) {
        this.length = 122
        this.ledStrip = new LEDStrip(this.length);
        this.effects = [];
        this.render = renderMethod ? renderMethod.bind(this) : () => {};

        this.run = false;
    }

    advance = () => {
        let newEffects = [];
        this.effects = this.effects.filter(effect => {
            effect.propagate();
            if (effect.spawns) {
                newEffects.push(...effect.spawns);
                effect.spawns = [];
            }
            return effect.alive;
        });
        this.effects.push(...newEffects);
    }

    tick = () => {
        if (this.run) {
            this.advance();
            this.render();
        }
    }  
}

export default Renderer;
