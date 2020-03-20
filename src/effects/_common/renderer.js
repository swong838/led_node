// generic renderer
import LEDStrip from '../../lib/led_strip';

const ledStripLength = 122;

class Renderer{
    constructor(renderMethod) {
        this.ledStrip = new LEDStrip(ledStripLength)
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
