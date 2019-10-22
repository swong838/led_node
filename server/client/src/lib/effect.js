class Effect {
    constructor({
        strength,
        direction,
        duration,
        decay=10,
        propagateAfter
    }) {
        this.strength = strength;
        this.direction = direction;
        this.duration = duration;
        this.timeToLive = duration;
        this.decay = decay;
        this.propagateAt = this.duration - propagateAfter;
        this.powerPerTick = Math.floor(this.strength / this.duration);
        
        this.hasPropagated = false;
    }

    apply = () => {
        if (this.timeToLive <= 0) {
            return {
                propagate: !this.hasPropagated,
                expire: true,
                strength: this.strength - this.decay,
                duration: this.duration,
                direction: this.direction
            }
        }

        else if (!this.hasPropagated && this.timeToLive <= this.propagateAfter) {
            this.hasPropagated = true;
            return {
                propagate: true,
                strength: this.strength - this.decay,
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