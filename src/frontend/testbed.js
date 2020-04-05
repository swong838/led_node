import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { STRIP_LENGTH } from '%lib/constants';

import PointLightController from '%frontend/components/pointLightController';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: {
                pointLights: {
                    1: {id: 1}
                }
            }
        }
        this.flush = this.flush.bind(this);
    }

    async send(type, settings={}) {
        const route = '/lab';
        const payload = {type, settings};
        const response = await fetch(route, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        return await response.json();
    }

    async flush() {
        return await this.send('flush');
    }

    elements () {
        let pointLights = [];
        for (const pointLight in this.state.elements.pointLights) {
            pointLights.push(
                <PointLightController
                    key={`light-${pointLight}`}
                    id={pointLight}
                    {...this.state.elements.pointLights[pointLight]}
                />
            )
        }
        return (
            <React.Fragment>{pointLights}</React.Fragment>
        );
    }

    render = () => {
        return (
            <article>
                <header>Strip length: {STRIP_LENGTH}</header>
                <section className="controls">
                    <button onClick={this.flush}>Flush all</button>
                </section>
                <section>
                    {this.elements()}
                </section>
            </article>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
