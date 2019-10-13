class Effect {
    constructor(value, direction) {
        this.FALLOFF = 2;
        this._value = value;
        this.direction = direction;
    }
    apply = () => [Math.max(this._value - this.FALLOFF, 0), this.direction]
}

export default Effect;