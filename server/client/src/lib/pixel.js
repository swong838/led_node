import Effect from './effect';

class Pixel {

    RIGHT = 1;
    LEFT = -1;

    FALLOFF = 8;
    MAX = 255 * 3;

    constructor(index) {
        this.index = index;
        this.effectQueue = [];
        this._value = 0;
        this.exports = {
            left: [],
            right: []
        };
    }

    addEffect = effect => {this.effectQueue.push(effect);}

    propagate = effectSettings => {        
        if (effectSettings.direction < 0) {
            this.exports.left.push(new Effect({...effectSettings}));
        }
        else if (effectSettings.direction > 0) {
            this.exports.right.push(new Effect({...effectSettings}));
        }
        else {
            this.exports.left.push(new Effect({...effectSettings, direction: this.LEFT}));
            this.exports.right.push(new Effect({...effectSettings, direction: this.RIGHT}));
        }
    }


    clearLeft = () => {this.exports.left = [];}
    clearRight = () => {this.exports.right = [];}
    clearExports = () => {this.clearLeft(); this.clearRight();}
    reset = () => {this.clearExports(); this.effectQueue=[]; this._value = 0;}
    
    getValue = () => {
        let delta = 0;
        this.effectQueue = this.effectQueue.flat();

        for (let i = this.effectQueue.length; i >= 0; i--) {
            const effect = this.effectQueue[i];
            if (!effect) continue;

            const outcome = effect.apply(this._value);

            if (outcome.expire) {
                this.effectQueue.pop();
                continue;
            }

            if (outcome.propagate) {
                this.propagate(outcome);
            }
            delta += outcome.strength;
        };

        const newValue = (this._value + delta - this.FALLOFF);
        this._value = Math.min(Math.max(newValue, 0), this.MAX);
        return this._value;
    }
}

export default Pixel;