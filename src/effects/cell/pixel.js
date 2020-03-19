import Effect from './effect';

class Pixel {

    constructor(index, falloff=8) {
        this.index = index;
        this.falloff = falloff;
        this.effectQueue = [];
        this._value = 0;
        this.exports = {
            left: [],
            right: []
        };

        this.RIGHT = 1;
        this.LEFT = -1;
        this.MAX = 255 * 3;

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

        for (let i = this.effectQueue.length - 1; i >= 0; i--) {
            const effect = this.effectQueue[i];
            const outcome = effect.apply(this._value);

            if (outcome.propagate) {
                this.propagate(outcome);
            }

            if (outcome.expire) {
                this.effectQueue.splice(i, 1);
            }

            delta += outcome.strength;
        };

        const newValue = (this._value + delta - this.falloff);
        this._value = Math.min(Math.max(newValue, 0), this.MAX);
        return this._value;
    }
}

export default Pixel;