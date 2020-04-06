import React, { Component } from 'react';
import { MAXDISTANCE, MAXAGE, STRIP_LENGTH } from '%lib/constants';
import { clamp } from '%lib/utilities';

const numeric = /^\d+\.?\d*$/;
const trailing = /\.\s*$/;


class PointLightController extends Component {
    constructor (props) {
        super(props);
        this.state = {
            ...props,
            id: 0,
            position: 0,
            r: 0,
            g: 0,
            b: 0,
            a: .5,
            velocity: 0.01,
            fade: 2.2,

            r_delta: 0,
            g_delta: 0,
            b_delta: 0,
            a_delta: 0,
            velocity_delta: 0,

            max_age: 300,
            leftBoundary: -MAXDISTANCE,
            rightBoundary: STRIP_LENGTH + MAXDISTANCE,
            respawns: 0,

            // autodraw helpers
            flipCycle: false,
            cycle: false,
        };

        this.controls = [
            {name: 'position', type: 'range', min: 0, max: STRIP_LENGTH-1, step: 1},

            {name: 'r', min: 0, max: 200, step: .1},
            {name: 'g', min: 0, max: 200, step: .1},
            {name: 'b', min: 0, max: 200, step: .1},
            {name: 'a', min: 0, max: 1, step: .01},
            {name: 'r_delta', type: 'hybrid', min: 0, max: 3, step: .1},
            {name: 'g_delta', type: 'hybrid', min: 0, max: 3, step: .1},
            {name: 'b_delta', type: 'hybrid', min: 0, max: 3, step: .1},
            {name: 'a_delta', type: 'hybrid', min: -1, max: 1, step: .01},

            {name: 'velocity', min: -1, max: 1, step: .01},
            {name: 'velocity_delta', type: 'hybrid', min: 0, max: 10, step: 1},

            {name: 'max_age', min: 0, max: MAXAGE - 1, step: 1},
            {name: 'leftBoundary', min: -MAXDISTANCE, max: MAXDISTANCE, step: 1},
            {name: 'rightBoundary', min: STRIP_LENGTH + MAXDISTANCE, max: MAXDISTANCE, step: 1},
            {name: 'fade', min: 0, max: 8, step: .1},
            {name: 'respawns', min: 0, max: 4, step: 1}
        ];

        this.cb = this.cb.bind(this);
        this.doBlur = this.doBlur.bind(this);
        this.fields = this.fields.bind(this);

        this.doCycle = this.doCycle.bind(this);
        this.setCycleMode = this.setCycleMode.bind(this);

        this.send = this.send.bind(this);
    }

    cb (event) {
        event.preventDefault();
        const {name, value} = event.currentTarget;
        this.setState({[name]: value});
    }

    doBlur (event) {
        // handle floating point inputs
        event.preventDefault();
        const {name, value} = event.currentTarget;
        if (numeric.test(value) && !trailing.test(value)) {
            const {min, max} = this.controls.find(control => control.name === name);
            this.setState({[name]: clamp(value, min, max)});
        }
    }

    fields () {
        return this.controls.map((control, index) => {
            const { name, type, callback=this.cb, min=0, max, step=1, } = control;

            const inputBlock = type === 'hybrid' ? (
                <textarea onChange={callback} onBlur={this.doBlur} value={this.state[name]} name={name} />
            ) : (
                <input onChange={callback} onBlur={this.doBlur} value={this.state[name]} name={name} />
            );

            return (
                <tr key={`input-${index}`}>
                    <td>
                        <label>{name}: </label>
                    </td>
                    <td>
                        <input type='range' onChange={callback} value={this.state[name]} name={name} min={min} max={max} step={step} />
                    </td>
                    <td>
                        {inputBlock}
                    </td>
                    <td>
                        <code>{this.state[name]}</code>
                    </td>
                </tr>
            );
            
        });
    }

    /* -- support autodraw -- */
    componentDidUpdate () {
        // workaround for async state changes
        if (this.state.cycle && this.state.flipCycle) {
           this.doCycle();
        }
    }

    doCycle() {
        // push pixels to the server as long as cycle is activated
        if (this.state.cycle) {
            this.send();
            setTimeout(this.doCycle, 1000);
        }

        // debounce changes from other state updates
        this.setState({flipCycle: false});
    }

    setCycleMode() {
        // flip the cycle flag
        this.setState(
            {
                flipCycle: true, // only trigger autodraw when setCycleMode is called
                cycle: !this.state.cycle
            }
        );
    }
    /* -- end support autodraw -- */

    async send () {
        const route = '/lab';
        const payload = {
            type: 'pointLight',
            settings: this.state
        };
        const response = await fetch(route, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        return await response.json();
    }

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th colSpan="2">
                            <button onClick={this.send} disabled={this.state.cycle}>
                                Send
                            </button>
                            <button onClick={this.setCycleMode}>
                                {this.state.cycle ? 'Halt' : 'Cycle'}
                            </button>

                        </th>
                        <th colSpan="2">Light {this.state.id}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.fields()}
                </tbody>
            </table>
        );
    }
}

export default PointLightController;
