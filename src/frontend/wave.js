import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import Pixel from '%src/lib/pixel';
import Wave from '%effects/wave/wave';
import {
    pixels,
    tickrate,
    initialDecay,
    initialEffectFalloff,
    initialEffectDuration,
    initialEffectSpillover
} from '%lib/constants';

import SimplePixelView from './components/simplePixel';

const POKESTRENGTH = 180;
const MAX_FRAMES_BETWEEN_UPDATES = 500;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: true,
            pixelViews: []
        };
        this.effectQueue = [];
        this.framesUntilNextEffects = 1;

        setInterval(() => {
            this.state.run && this.refresh();
        }, tickrate);

        this.addEffects = this.addEffects.bind(this);
        this.toggle = this.toggle.bind(this);
        this.reset = this.reset.bind(this);
        this.refresh = this.refresh.bind(this);

    }

    componentDidMount() { this.refresh(); }
    randomEffect() {
        return new Wave({
            origin: Math.ceil(Math.random() * pixels),
            r: Math.ceil(Math.random() * 255),
            g: Math.ceil(Math.random() * 255),
            b: Math.ceil(Math.random() * 255),
            velocity: Math.random() * .2,
            velocityFalloff: Math.min(Math.random(), .00002),
            powerFalloff: Math.min(Math.random(), 1),
        });
    }

    addEffects() {
        let numEffects = 1;
        while(numEffects--) {
            this.effectQueue.push(this.randomEffect());
        }
    }
    
    toggle() {this.setState({run: !this.state.run})}
    reset() {this.effectQueue = [];}
    refresh() {
        // pixel by pixel, get the sum of all running effects
        let lightValues = [];
        let pixelToSet = (pixels - 1);
        while(pixelToSet--) {
            let lightSum = {r: 0, g: 0, b: 0};
            this.effectQueue.forEach((effect) => {
                const {r, g, b} = effect.poll(pixelToSet);
                lightSum.r += r;
                lightSum.g += g;
                lightSum.b += b;
            });
            lightValues.push(lightSum);
        }

        this.setState({
            // write output array
            pixelViews: lightValues.map(
                (lighting, index) => <SimplePixelView key={`pixel-${index}`} {...lighting} />
            )
        });

        // propagate each effect that remains
        this.effectQueue.forEach(effect => effect.propagate());
        // remove expired effects
        this.effectQueue = this.effectQueue.filter(effect => effect.alive)
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
                    <button onClick={this.toggle}>{this.state.run ? 'stop' : 'start'}</button>
                    <button onClick={this.addEffects}>add</button>
                    <button onClick={this.reset}>reset</button> 
                </section>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
