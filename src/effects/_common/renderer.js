// generic renderer

import LEDStrip from '../../lib/led_strip';
import { log } from '../../lib/utilities';
import { STRIP_LENGTH } from '../../lib/constants';

class Renderer {
    constructor(settings={}) {
        this.settings = settings;
        const {
            renderMethod,
            advancerMethod,
        } = this.settings;

        this.length = STRIP_LENGTH;
        this.ledStrip = new LEDStrip(this.length);

        // Manage what we're drawing
        this.effects = [];
        this.advance = advancerMethod ? 
            advancerMethod.bind(this) :
            this.defaultAdvancer.bind(this);

        // Manage how we're drawing
        this.render = renderMethod ?
            renderMethod.bind(this) :
            this.defaultRenderer.bind(this);

        this.run = false;
    }

    defaultRenderer = () => {
        /* Render one frame of this effect */
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
    }

    defaultAdvancer = () => {
        if (this.effects.length) {
            // If a falsey entry was pushed in, clear this renderer.

            if (!this.effects.every(e => e)) {
                log('flushing')
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
