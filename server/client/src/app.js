import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Effect from './lib/effect';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: [],
        }
    }

    render() {
        return (
            <div>this is an app {foo}</div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
