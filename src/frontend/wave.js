import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Pixel from '%src/lib/pixel';
import Wave from '%src/lib/wave';
import {
    pixels,
    tickrate,
    initialDecay,
    initialEffectFalloff,
    initialEffectDuration,
    initialEffectSpillover
} from '%src/lib/constants';

import PixelView from './components/pixel';

const POKESTRENGTH = 180;
const MAX_FRAMES_BETWEEN_UPDATES = 500;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            pixelViews: []
        };
        this.effectQueue = [];
        this.framesUntilNextEffects = 1;

        setInterval(() => {
            this.state.run && this.refresh();
        }, tickrate);
    }

    componentDidMount = () => this.refresh()
    randomEffect = () => new Wave({
        origin: Math.ceil(Math.random() * pixels),
        r: Math.ceil(Math.random() * 255),
        g: Math.ceil(Math.random() * 255),
        b: Math.ceil(Math.random() * 255),
    })

    addEffects = () => {
        let numEffects = Math.ceil(Math.random() * 4);
        while(numEffects--) {
            this.effectQueue.push(randomEffect());
        }
    }
    reset = () => {this.pixels.forEach(pixel => pixel.reset()); this.refresh();}
    poke = index => this.pixels[index].addEffect(new Effect({...this.randomEffect(), strength: POKESTRENGTH}))
    toggle = () => this.setState({run: !this.state.run})

    refresh = () => {
        // if (this.framesUntilNextEffects-- <= 0) {
        //     this.framesUntilNextEffects = Math.ceil(Math.random() * this.state.maxWaitForUpdate);
        //     this.addEffects();
        // }

        // pixel by pixel, get the sum of all running effects
        let lightValues = [];
        let pixelsToSet = (pixels - 1);
        while(pixelsToSet--) {
            lightValues.push(
                this.effectQueue.reduce(
                    (derivedLighting, effect) => {
                        const {r, g, b} = effect.poll(pixelIndex);
                        derivedLighting[r] += r;
                        derivedLighting[g] += g;
                        derivedLighting[b] += b;
                    }, {r: 0, g: 0, b: 0}
                )
            );
        }

        this.setState({
            // write output array
            pixelViews: lightValues.map(
                (lighting, index) => <PixelView key={`pixel-${index}`} {...lighting} />
            ),
            // remove expired effects
            effectQueue: this.effectQueue.filter(effect => effect.alive)
        });

        // propagate each effect that remains
        this.effectQueue.forEach(effect => effect.propagate());

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
