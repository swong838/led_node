// generic renderer

import LEDStrip from '../../lib/led_strip';
import { log } from '../../lib/utilities';
import { STRIP_LENGTH } from '../../lib/constants';

class Renderer {
    constructor(renderMethod) {
        this.length = STRIP_LENGTH;
        this.ledStrip = new LEDStrip(this.length);
        this.effects = [];
        this.render = renderMethod ? renderMethod.bind(this) : () => {};
        this.run = false;
    }

    advance = () => {
        if (this.effects.length) {
            // If a falsey entry was pushed in, clear this renderer.
            if (!this.effects.every(e => e)) {
                this.flush();
                return;
            }

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
    }

    tick = () => {
        if (this.run) {
            this.advance();
            this.render();
        }
    }
    flush = () => this.effects = [];
    go = () => this.run = true;
    stop = () => this.run = false; 
}

export default Renderer;
