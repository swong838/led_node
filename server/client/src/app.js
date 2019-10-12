import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Pixel from './components/pixel';
import Effect from './lib/effect';


const PixelView = ({val, callback}) => <div className="pixel" onClick={callback}>{val}</div>

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            pixelViews: []
        };

        this.pixels = [];
        for (let p = 0; p < 5; p++) {
            this.pixels.push(new Pixel(p));
        }

        setInterval(() => {
            this.state.run && this.refresh();
        }, 250);
    }

    addEffects = () => {
        this.pixels.forEach(pixel => {
            pixel.addEffect(new Effect(100, 0));
        });
    }

    poke = index => {
        this.pixels[index] && this.pixels[index].addEffect(new Effect(20, 0));
    }

    refresh = () => {
        let cells = [];
        this.pixels.forEach((pixel, index) => {
            const {left, right} = pixel.exports;
            const leftNeighbor = this.pixels[index-1];
            const rightNeighbor = this.pixels[index+1];

            if (!leftNeighbor) {pixel.clearLeft();}
            else {leftNeighbor.addEffect(left);}

            if (!rightNeighbor) {pixel.clearRight();}
            else {rightNeighbor.addEffect(right);}

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
            </React.Fragment>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
