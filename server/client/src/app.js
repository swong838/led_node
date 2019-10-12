import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Pixel from './components/pixel';
import Effect from './lib/effect';


const PixelView = ({
    val,
    left,
    right,
    callback
}) => {
    return (
        <div className="pixel" onClick={callback}>
            <table>
                <thead>
                    <tr>
                        <th colSpan="2">{val}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="l">{left}</td>
                        <td className="r">{right}</td>
                    </tr>
                </tbody>
            </table>
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

        this.pixels = [];
        for (let p = 0; p < 15; p++) {
            this.pixels.push(new Pixel(p));
        }

        setInterval(() => {
            this.state.run && this.refresh();
        }, 100);
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

            leftNeighbor && leftNeighbor.addEffect(left);
            rightNeighbor && rightNeighbor.addEffect(right);

            pixel.clearExports();

            cells.push(
                <PixelView
                    key={index}
                    val={pixel.getValue()}
                    left={left.length}
                    right={right.length}
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
