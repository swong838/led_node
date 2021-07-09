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

    cleanTitle = title => title.replace(/_+/, ' ');

    render = () => {
        const modes = [
            'fireflies',
            'rain',
            'waves',
        ].map(mode => <Button title={this.cleanTitle(mode)} mode={mode} key={mode} />);

        const bitmaps = [
            'bronze',
            'champagne',
            'confetti',
            'feathered',
            'grass',
            'green_whorlies',
            'hue_test',
            'hexes',
            'minty',
            'mycelium',
            'mystic',
            'nebula',
            'orange_sherbet',
            'pink_goo',
            'rainbow_connection',
            'rgb',
            'swoops',
            'water',
        ].map(bitmap => {
            return (
                <Button title={this.cleanTitle(bitmap)} mode="rgbmap" key={bitmap} body={{ bitmap }} />
            );
        });

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
