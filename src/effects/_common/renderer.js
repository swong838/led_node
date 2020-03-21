// generic renderer
import LEDStrip from '../../lib/led_strip';

class Renderer{
    constructor(renderMethod) {
        this.length = 122
        this.ledStrip = new LEDStrip(this.length);
        this.effects = [];
        this.render = renderMethod ? renderMethod.bind(this) : () => {};
    }

    advance = () => {
        this.effects = this.effects.filter(effect => {
            effect.propagate();
            return effect.alive;
        });
    }

    tick = () => {
        this.advance();
        this.render();
    }
    
}

export default Renderer;
