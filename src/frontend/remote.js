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

    cleanTitle = title => {

        const ucFirst = /\b[a-z]/g;

        let cleanedTitle = title.replace(/_+/, ' ');
        return cleanedTitle;
    }

    render = () => {
        const modes = [
            'fireflies',
            'rain',
            'waves',
        ].map(mode => <Button title={this.cleanTitle(mode)} mode={mode} key={mode} />);

        const bitmaps = [
            'aka',
            'confetti',
            'fuego',
            'grass',
            'green_whorlies',
	        'holidays',
            'mycelium',
            'nebula',
            'orange_sherbet',
            'pink_goo',
            'rgb',
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
