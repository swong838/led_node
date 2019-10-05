
FALLOFF = 4

class Effect {
    constructor(value, direction) {
        this.value = value;
        this.direction = direction;
    }

    propagate() {
        this.value -= FALLOFF;
        return this;
    }
}