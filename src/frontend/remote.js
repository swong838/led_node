import React, { Component } from 'react';
import ReactDOM from 'react-dom';


const Button = ({ title, mode, body }) => {
    return (
        <button onClick={e => {
            e.preventDefault();
            fetch(`/remote/${mode}`, { 
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(body),
            });
        }}>
            {title}
        </button>
    );
};

class App extends Component {
    render = () => {
        const modes = [
            'fireflies',
            'rain',
            'waves',
        ].map(mode => <Button key={mode} title={mode} mode={mode} />);

        const bitmaps = [
            'aka',
            'confetti',
            'fuego',
            'grass',
            'green_whorlies',
            'nebula',
            'orange_sherbet',
            'pink_goo',
            'water',
        ].map(map => <Button title={map} mode="rgbmap" key={map} body={{ map }} />);

        return (
            <article>
                <header>LED Node Admin</header>
                <section className="controls">
                    <Button mode="stop" title="Stop All" />
                </section>
                <hr />
                <section className="controls">
                    {modes}
                </section>
                <hr />
                <section className="controls">
                    {bitmaps}
                </section>

            </article>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
