class Effect {
    constructor(value, direction) {
        this.FALLOFF = 4;
        this._value = value;
        this.direction = direction;
    }

    getValue = () => {
        this._value = Math.max(this._value - this.FALLOFF, 0);
        return this._value;
    }
}

export default Effect;