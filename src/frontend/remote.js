import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    render = () => {
        const modes = [
            'fireflies',
            'rain',
            'waves',
        ].map(mode => (
            <button key={mode} onClick={e => {
                e.preventDefault();
                fetch(`/remote/${mode}`, {
                    method: 'put'
                });
            }}>
                {mode}
            </button>
        ));


        return (
            <article>
                <header>LED Node Admin</header>
                <section className="controls">
                    {modes}
                </section>
            </article>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
