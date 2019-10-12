import Effect from '../lib/effect';

class Pixel {

    FALLOFF = 4;

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
    clearLeft = () => {this.exports.left = [];}
    clearRight = () => {this.exports.right = [];}
    resetExports = () => {this.clearLeft(); this.clearRight();}
    
    getValue = () => {
        let delta = 0;
        this.effectQueue = this.effectQueue.flat();
        while(this.effectQueue.length) {
            const effect = this.effectQueue.shift();
            if (!effect) continue;
            const [effectValue, direction] = effect.apply();
            if (effectValue <= 0) continue;

            if (direction < 0) {
                this.exports.left.push(new Effect(effectValue, -1));
            }
            else if (direction > 0) {
                this.exports.right.push(new Effect(effectValue, 1));
            }
            else {
                this.exports.left.push(new Effect(effectValue, -1));
                this.exports.right.push(new Effect(effectValue, 1));
            }

            delta += effectValue;
        }
        const newValue = (this._value + delta - this.FALLOFF);
        this._value = Math.max(newValue, 0);
        return this._value;
    }
}

export default Pixel;