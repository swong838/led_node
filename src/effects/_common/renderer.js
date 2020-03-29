// generic renderer

import LEDStrip from '../../lib/led_strip';
import { log } from '../../lib/utilities';
import { STRIP_LENGTH } from '../../lib/constants';

class Renderer{
    constructor(renderMethod) {
        this.length = STRIP_LENGTH;
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
    go = () => this.run = true;
    stop = () => this.run = false; 
}

export default Renderer;
