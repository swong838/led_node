class Effect {
    constructor(strength, direction, duration=12) {
        this.falloff = 15;
        this.duration = duration;
        this.timeToLive = duration;
        this.strength = strength;
        this.powerPerTick = this.strength / this.duration;
        this.direction = direction;
    }

    apply = () => {

        if (!this.timeToLive) {
            return {
                propagate: true,
                strength: this.strength - this.falloff,
                duration: this.duration,
                direction: this.direction
            }
        }
        else {
            this.timeToLive--;
            return {
                propagate: false,
                strength: this.powerPerTick,
            }
        }
    }
}

export default Effect;