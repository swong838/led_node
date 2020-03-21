import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { MAX, MAXDISTANCE, MAXAGE, MAX_GENERATIONS } from '%lib/constants';

const strip_length = 122;

const initialState = {
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
    rightBoundary: strip_length + MAXDISTANCE,
    respawns: 0
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {...initialState};
        this.inputs = [
            {name: 'position', type: 'range', min: 0, max: strip_length-1, step: 1},
            {name: 'r', type: 'range', min: 0, max: 200, step: .1},
            {name: 'g', type: 'range', min: 0, max: 200, step: .1},
            {name: 'b', type: 'range', min: 0, max: 200, step: .1},
            {name: 'velocity', type: 'range', min: -10, max: 10, step: .01},
            {name: 'fade', type: 'range', min: 0, max: 8, step: .1},
            {name: 'r_falloff', type: 'range', min: 0, max: 3, step: .1},
            {name: 'g_falloff', type: 'range', min: 0, max: 3, step: .1},
            {name: 'b_falloff', type: 'range', min: 0, max: 3, step: .1},
            {name: 'velocity_falloff', type: 'range', min: 0, max: 10, step: 1},
            {name: 'max_age', type: 'range', min: 0, max: MAXAGE - 1, step: 1},
            {name: 'leftBoundary', type: 'range', min: initialState.leftBoundary, max: MAXDISTANCE, step: 1},
            {name: 'rightBoundary', type: 'range', min: initialState.leftBoundary, max: MAXDISTANCE, step: 1},
            {name: 'respawns', type: 'range', min: 0, max: 4, step: 1}
        ];
    }

    cb = e => {
        e.preventDefault();

        const {name, value} = e.currentTarget;
        const newState = {};
        newState[name] = parseFloat(value);
        this.setState(newState);
    }

    rangeInput = ({
        key,
        name,
        callback=this.cb,
        min=0,
        max,
        step=1
    }) => {
        return (
            <div key={`input-${key}`}>
                <label>{name}: </label>
                <input type='range' onChange={callback} value={this.state[name]} name={name} min={min} max={max} step={step} />
                <code>{this.state[name]}</code> 
            </div>
        );
    }

    getInputs = () => this.inputs.map((field, index) => {
        switch (field.type) {
            case 'range':
                return this.rangeInput({key: index, ...field});
            default:
                return null;
        }
    })

    send = async () => {
        const route = '/lab';
        const response = await fetch(route, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state)
        });
        return await response.json();
    }

    render = () => {
        return (
            <article>
                <header>
                    Strip length: {strip_length}
                </header>
                <section><button onClick={this.send}>Send</button></section>
                {this.getInputs()}
            </article>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
