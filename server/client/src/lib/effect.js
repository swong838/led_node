class Effect {
    constructor({strength, direction, duration, spillover}) {
        this.falloff = 15;
        this.spillover = spillover || 255;
        this.duration = duration;
        this.timeToLive = duration;
        this.strength = strength;
        this.powerPerTick = Math.floor(this.strength / this.duration);
        this.direction = direction;
        this.hasPropagated = false;
    }

    apply = (hostValue) => {
        if (!this.timeToLive) {
            return {
                propagate: !this.hasPropagated,
                expire: true,
                strength: this.strength - this.falloff,
                duration: this.duration,
                direction: this.direction
            }
        }

        else if (!this.hasPropagated && hostValue > this.spillover) {
            this.hasPropagated = true;
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