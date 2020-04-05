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
            velocity: 0,
            fade: 2.2,

            r_falloff: 0,
            g_falloff: 0,
            b_falloff: 0,
            velocity_falloff: 0,

            max_age: MAXAGE - 1,
            leftBoundary: -MAXDISTANCE,
            rightBoundary: STRIP_LENGTH + MAXDISTANCE,
            respawns: 0,
        };

        this.controls = [
            {name: 'position', type: 'range', min: 0, max: STRIP_LENGTH-1, step: 1},

            {name: 'r', type: 'range', min: 0, max: 200, step: .1},
            {name: 'g', type: 'range', min: 0, max: 200, step: .1},
            {name: 'b', type: 'range', min: 0, max: 200, step: .1},
            {name: 'r_falloff', type: 'range', min: 0, max: 3, step: .1},
            {name: 'g_falloff', type: 'range', min: 0, max: 3, step: .1},
            {name: 'b_falloff', type: 'range', min: 0, max: 3, step: .1},

            {name: 'velocity', type: 'range', min: -2, max: 2, step: .01},
            {name: 'velocity_falloff', type: 'range', min: 0, max: 10, step: 1},

            {name: 'max_age', type: 'range', min: 0, max: MAXAGE - 1, step: 1},
            {name: 'leftBoundary', type: 'range', min: -MAXDISTANCE, max: MAXDISTANCE, step: 1},
            {name: 'rightBoundary', type: 'range', min: STRIP_LENGTH + MAXDISTANCE, max: MAXDISTANCE, step: 1},
            {name: 'fade', type: 'range', min: 0, max: 8, step: .1},
            {name: 'respawns', type: 'range', min: 0, max: 4, step: 1}
        ];

        this.cb = this.cb.bind(this);
        this.fields = this.fields.bind(this);
        this.rangeInput = this.rangeInput.bind(this);
        this.send = this.send.bind(this);
    }

    cb (event) {
        event.preventDefault();
        const {name, value} = event.currentTarget;
        let newState = {[name]: value};

        // handle decimals
        if (numeric.test(value) && !trailing.test(value)) {
            const {min, max} = this.controls.find(control => control.name === name);
            newState[name] = clamp(value, min, max);
        }
        this.setState(newState);
    }

    fields () {
        return this.controls.map((control, index) => {
            switch (control.type) {
                case 'range':
                    return this.rangeInput({key: index, ...control});
                default:
                    return null;
            }
        });
    }

    rangeInput ({ key, name, callback=this.cb, min=0, max, step=1,}) {
        return (
            <tr key={`input-${key}`}>
                <td>
                    <label>{name}: </label>
                </td>
                <td>
                    <input type='range' onChange={callback} value={this.state[name]} name={name} min={min} max={max} step={step} />
                </td>
                <td>
                    <input type='text' onChange={callback} value={this.state[name]} name={name} />
                </td>
                <td>
                    <code>{this.state[name]}</code>
                </td>
            </tr>
        );
    }

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
                        <th colSpan="2"><button onClick={this.send}>Send</button></th>
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
