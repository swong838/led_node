class Pixel {

    FALLOFF = 4;

    constructor(index) {
        this.index = index;

        this.effectQueue = [];
        this._value = 0;
        this.exports = {};
        this.resetExports();
    }

    addEffect = effect => {
        this.effectQueue.push(effect);
    }
    resetExports = _ => this.exports = {left: [], right: []}

    // getExports = () => {
    //     const exports = {...this.exports};
    //     this.resetExports();
    //     return exports;
    // }
    
    getValue = () => {
        let delta = 0;
        this.effectQueue = this.effectQueue.flat();
        while(this.effectQueue.length) {
            const effect = this.effectQueue.shift();
            delta += effect.getValue();
            if (effect.direction < 0) {
                this.exports.left.push(effect);
            }
            else {
                this.exports.right.push(effect);
            }
        }
        const newValue = (this._value + delta - this.FALLOFF);
        this._value = Math.max(newValue, 0);

        return this._value;
    }
}

export default Pixel;