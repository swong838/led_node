import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import RemoteButton from '%frontend/components/remotebutton';


class App extends Component {

    cleanTitle = title => title.replace(/_+/, ' ');

    render = () => {
        const modes = [
            'fireflies',
            'rain',
            'waves',
        ].map(mode => <RemoteButton title={this.cleanTitle(mode)} mode={mode} key={mode} />);

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
                <RemoteButton title={this.cleanTitle(bitmap)} mode="rgbmap" key={bitmap} body={{ bitmap }} />
            );
        });

        return (
            <article>
                <header>LED Node Admin</header>
                <section className="controls">
                    <RemoteButton mode="stop" title="Stop All" />
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
