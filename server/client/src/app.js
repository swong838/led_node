import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Pixel from './lib/pixel';
import Effect from './lib/effect';
import {
    pixels,
    tickrate,
    initialDecay,
    initialEffectFalloff,
    initialEffectDuration,
    initialEffectSpillover
} from './lib/constants';

import PixelView from './components/pixel';

const POKESTRENGTH = 180;
const MAX_FRAMES_BETWEEN_UPDATES = 500;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            pixelViews: [],
            pixelFalloff: initialDecay,
            effectDuration: initialEffectDuration,
            effectFalloff: initialEffectFalloff,
            effectPropagateAfter: initialEffectSpillover,
            maxWaitForUpdate: MAX_FRAMES_BETWEEN_UPDATES
        };

        this.framesUntilNextEffects = 1;
        this.pixels = [];
        for (let p = 0; p < pixels; p++) {
            this.pixels.push(new Pixel(p, this.state.pixelFalloff));
        }

        setInterval(() => {
            this.state.run && this.refresh();
        }, tickrate);
    }

    randomEffect = () => {
        return {
            strength: Math.ceil(Math.random() * 255 * 2) + 255,
            direction: 0,
            decay: this.state.effectFalloff,
            duration: this.state.effectDuration,
            propagateAfter: this.state.effectPropagateAfter
        };
    }


    addEffects = () => {
        let numEffects = Math.ceil(Math.random() * 4);
        while(numEffects--) {
            this.pixels[
                Math.floor(Math.random() * pixels)
            ].addEffect(new Effect(this.randomEffect()));
        }
    }
    reset = () => {this.pixels.forEach(pixel => pixel.reset()); this.refresh();}
    poke = index => this.pixels[index].addEffect(new Effect({...this.randomEffect(), strength: POKESTRENGTH}))
    componentDidMount = () => this.refresh()
    toggle = () => this.setState({run: !this.state.run})

    refresh = () => {
        if (this.framesUntilNextEffects-- <= 0) {
            this.framesUntilNextEffects = Math.ceil(Math.random() * this.state.maxWaitForUpdate);
            this.addEffects();
        }

        this.pixels.forEach((pixel, index) => {
            const {left, right} = pixel.exports;
            const leftNeighbor = this.pixels[index-1];
            const rightNeighbor = this.pixels[index+1];
            leftNeighbor && leftNeighbor.addEffect(left);
            rightNeighbor && rightNeighbor.addEffect(right);
            pixel.clearExports();
        });

        this.setState({
            pixelViews: this.pixels.map(
                (pixel, index) => {

                    const settings = {
                        val: pixel.getValue(),
                        fx: pixel.effectQueue.length,
                        left: pixel.exports.left.length,
                        right: pixel.exports.right.length,
                    }

                    return (<PixelView
                        key={index}
                        callback={() => this.poke(index)}
                        {...settings}
                    />)
                }
            )
        });
    }

    tune = (setting, e) => {
        const newVal = e.target.value.replace(/[^\d]/g, '');
        this.setState({[setting]: newVal})
        if (setting === 'pixelFalloff') {
            this.pixels.forEach(pixel => pixel.falloff = newVal);
        }
    }

    render() {
        return (
            <React.Fragment>
                { this.state.pixelViews }
                <section className="controls">
                    <button onClick={this.reset}>reset</button>
                    <button onClick={this.addEffects}>add</button>
                    <button onClick={this.refresh}>step</button>
                    <button onClick={this.toggle}>{this.state.run ? 'stop' : 'start'}</button>
                    <code>{this.framesUntilNextEffects}</code>
                </section>
                <section className="controls">
                    <label>
                        pixel decay
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            onChange={e => this.tune('pixelFalloff', e)}
                            value={this.state.pixelFalloff}
                        />
                        <code>{this.state.pixelFalloff}</code>
                    </label>
                    <label>
                        effect falloff per step
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            onChange={e => this.tune('effectFalloff', e)}
                            value={this.state.effectFalloff}
                        />
                        <code>{this.state.effectFalloff}</code>
                    </label>
                    <label>
                        effect duration
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            onChange={e => this.tune('effectDuration', e)}
                            value={this.state.effectDuration}
                        />
                        <code>{this.state.effectDuration}</code>
                    </label>
                    <label>
                        effect spillover after
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            onChange={e => this.tune('effectPropagateAfter', e)}
                            value={this.state.effectPropagateAfter}
                        />
                        <code>{this.state.effectPropagateAfter}</code>
                    </label>
                </section>
                <section className="controls">
                    <label>
                        max frames to next effect burst
                        <input
                            type="range"
                            min="1"
                            max="6000"
                            step="1"
                            onChange={e => this.tune('maxWaitForUpdate', e)}
                            value={this.state.maxWaitForUpdate}
                        />
                        <code>{this.state.maxWaitForUpdate}</code>
                    </label>

                </section>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
