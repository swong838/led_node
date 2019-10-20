import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Pixel from './lib/pixel';
import Effect from './lib/effect';


import PixelView from './components/pixel';

const PIXELCOUNT = 80;

const POKESTRENGTH = 180;
const TICKRATE = 25;
const MAX_FRAMES_BETWEEN_UPDATES = 300;


const randomEffect = () => {
    return {
        strength: Math.ceil(Math.random() * 255 * 2) + 512,
        direction: 0,
        duration: 4,
        spillover: 600
    };
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            pixelViews: []
        };

        this.framesUntilNextEffects = 1;

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
            ].addEffect(new Effect(randomEffect()));
        }
    }
    reset = () => {this.pixels.forEach(pixel => pixel.reset()); this.refresh();}
    poke = index => this.pixels[index].addEffect(new Effect({...randomEffect(), strength: POKESTRENGTH}))
    componentDidMount = () => this.refresh()
    toggle = () => this.setState({run: !this.state.run})

    refresh = () => {
        // if (this.framesUntilNextEffects-- <= 0) {
        //     this.framesUntilNextEffects = Math.ceil(Math.random() * MAX_FRAMES_BETWEEN_UPDATES);
        //     this.addEffects();
        // }

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


    render() {
        return (
            <React.Fragment>
                { this.state.pixelViews }
                <section className="controls">
                    <button onClick={this.reset}>reset</button>
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
