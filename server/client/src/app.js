import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Pixel from './components/pixel';
import Effect from './lib/effect';

const PIXELCOUNT = 80;
const POKESTRENGTH = 80;
const TICKRATE = 10;
const MAX_FRAMES_BETWEEN_UPDATES = 300;

const PixelView = ({
    val,
    callback
}) => {
    const b = Math.max(val - 255, 0);
    val -= 255;
    const r = Math.max(val - 120, 0);
    val -= 120;
    const g = Math.max(val - 60, 0);
    return <div className="pixel" style={{backgroundColor: `rgb(${r},${g},${b})`}} onClick={callback} />
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            pixelViews: []
        };

        this.framesUntilNextEffects = 0;

        this.pixels = [];
        for (let p = 0; p < PIXELCOUNT; p++) {
            this.pixels.push(new Pixel(p));
        }

        setInterval(() => {
            this.state.run && this.refresh();
        }, TICKRATE);
    }

    addEffects = () => {
        let numEffects = Math.ceil(Math.random() * 4);
        while(numEffects--) {
            this.pixels[
                Math.floor(Math.random() * PIXELCOUNT)
            ].addEffect(
                new Effect(Math.ceil(Math.random() * 255 * 2), 0
            ));
        }
    }

    poke = index => {
        this.pixels[index] && this.pixels[index].addEffect(new Effect(POKESTRENGTH, 0));
    }

    refresh = () => {
        if (this.framesUntilNextEffects-- <= 0) {
            this.framesUntilNextEffects = Math.ceil(Math.random() * MAX_FRAMES_BETWEEN_UPDATES);
            this.addEffects();
        }

        let cells = [];
        this.pixels.forEach((pixel, index) => {
            const {left, right} = pixel.exports;
            const leftNeighbor = this.pixels[index-1];
            const rightNeighbor = this.pixels[index+1];

            leftNeighbor && leftNeighbor.addEffect(left);
            rightNeighbor && rightNeighbor.addEffect(right);
            pixel.clearExports();

            cells.push(
                <PixelView
                    key={index}
                    val={pixel.getValue()}
                    callback={() => this.poke(index)}
                />
            );
        });
        this.setState({pixelViews: cells});
    }

    componentDidMount = () => {
        this.refresh();
    }

    toggle = () => {
        this.setState({run: !this.state.run})
    }
    
    render() {
        return (
            <React.Fragment>
                { this.state.pixelViews }
                <section className="controls">
                    <button onClick={this.addEffects}>add</button>
                    <button onClick={this.refresh}>step</button>
                    <button onClick={this.toggle}>{this.state.run ? 'stop' : 'start'}</button>
                </section>
                <section className="controls">
                    <h5>{this.framesUntilNextEffects}</h5>
                </section>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
