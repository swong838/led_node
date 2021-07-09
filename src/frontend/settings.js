import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { RGB_TUNING, LAB_FLAGS } from '%lib/constants';
import { clamp } from '%lib/utilities';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            r: RGB_TUNING.r,
            g: RGB_TUNING.g,
            b: RGB_TUNING.b,
        }
        this.update = this.update.bind(this);
        this.reset = this.reset.bind(this);
        this.send(LAB_FLAGS.startCalibration);
    }

    async send(type=LAB_FLAGS.setRGB) {
        const route = '/lab';
        const payload = {
            type,
            settings: {...this.state},
        }
        const response = await fetch(route, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        return await response.json();
    }

    async update(event) {
        this.setState({
            [event.currentTarget.name]: clamp(event.currentTarget.value, 0, 1)
        })
        await this.send();
    }

    async reset() {
        this.setState({...RGB_TUNING});
        return await this.send();
    }

    controls () {

        const min = 0;
        const max = 1;
        const step = .05;

        return ['r','g','b']
            .map(channel => {
                return (
                    <div key={channel}>
                        <label htmlFor="{channel}">{channel}</label>
                        <input id="{channel}" type='range' onChange={this.update} onBlur={this.update} value={this.state[channel]} name={channel} min={min} max={max} step={step} />
                        <code>{this.state[channel]}</code>
                    </div>
                );
            });
    }

    render = () => {
        return (
            <article>
                <header>LED Strip Settings</header>
                <section className="controls">
                    <button onClick={this.reset}>Reset Color Settings</button>
                </section>
                <section>
                    {this.controls()}
                </section>
            </article>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
