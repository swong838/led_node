import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Pixel from './lib/pixel';
import Effect from './lib/effect';

const PIXELCOUNT = 25;

const WH = 75;

const POKESTRENGTH = 180;
const TICKRATE = 10;
const MAX_FRAMES_BETWEEN_UPDATES = 300;

const PixelView = ({
    val,
    fx,
    left,
    right,
    callback
}) => {

    const rawVal = val;

    const b = Math.max(val - 255, 0);
    val -= 255;
    const r = Math.max(val - 120, 0);
    val -= 120;
    const g = Math.max(val - 60, 0);

    const pixelstyle = {
        width: `${WH}px`,
        height: `${WH}px`,
        backgroundColor: `rgb(${r},${g},${b})`
    }
    const diag = {color: `rgb(${255-r},${255-g},${255-b})`}

    return (
        <div className="pixel" style={pixelstyle} onClick={callback}>
            <h5 style={diag}>{rawVal}</h5>
            <code style={diag}>{left} : {fx} : {right}</code>
        </div>
    )
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
            ].addEffect(
                new Effect(Math.ceil(Math.random() * 255 * 2), 0
            ));
        }
    }
    reset = () => {this.pixels.forEach(pixel => pixel.reset()); this.refresh();}
    poke = index => this.pixels[index].addEffect(new Effect(POKESTRENGTH, 0))

    refresh = () => {
        // if (this.framesUntilNextEffects-- <= 0) {
        //     this.framesUntilNextEffects = Math.ceil(Math.random() * MAX_FRAMES_BETWEEN_UPDATES);
        //     this.addEffects();
        // }

        this.pixels.forEach((pixel, index) => {
            const {left, right} = pixel.exports;
            const leftNeighbor = this.pixels[index-1];
            const rightNeighbor = this.pixels[index+1];

            //leftNeighbor && pixel.addEffect(leftNeighbor.ex)

            leftNeighbor && leftNeighbor.addEffect(left);
            rightNeighbor && rightNeighbor.addEffect(right);
            pixel.clearExports();
        });

        this.setState({
            pixelViews: this.pixels.map(
                (pixel, index) => {
                    return (<PixelView
                        key={index}
                        val={pixel.getValue()}
                        fx={pixel.effectQueue.length}
                        left={pixel.exports.left.length}
                        right={pixel.exports.right.length}
                        callback={() => this.poke(index)}
                    />)
                }
            )
        });
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
