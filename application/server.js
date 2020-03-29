import express from 'express';

import { debug } from '../src/lib/constants';
import { log } from '../src/lib/utilities'; 

import diagnostics from '../src/lib/diagnostics';
// import led_cells from '../src/effects/cell/renderer_cells';
import led_waves from '../src/effects/wave/renderer_wave';
import test_point_light from '../src/effects/_common/test_point_light';

import rain from '../src/effects/rain/controller';

const port = process.env.PORT || 5000;
const server = express();
server.use(express.json())
server.use('/', express.static('./application/client'))
// server.use('/cells', express.static('./application/client/cells.html'))
server.use('/testbed', express.static('./application/client/testbed.html'))
server.use('/wave', express.static('./application/client/wave.html'))


const effectBuffer = function(){
    let _buffer = [];
    return {
        add: item => _buffer.push(item),
        append: items => _buffer.push([...items]),
        get: () => {
            const out = [..._buffer];
            _buffer = [];
            return out;
        }
    }
}();


const mode = 1;

switch (mode){
    case 1:
        log('starting lab');
        if (debug) {
            server.post('/lab/', async (req, response) => {
                let effectSettings = {...req.body};
                for (let v in effectSettings) {
                    var tempV = parseFloat(effectSettings[v]);
                    /**
                        Yes, this is an eval.
                        It's meant to let us develop algorithmic effects without needing to restart the node server.
                        Of course it's behind the `debug` flag.
                    */
                    if (isNaN(tempV)) {
                        eval(`tempV = ${effectSettings[v]}`);
                    }
                    effectSettings[v] = tempV;
                }
                effectBuffer.add(effectSettings);
                response.json('ok');
            });
        }
        test_point_light(effectBuffer).go();
        break;

    case 2:
        log('starting led_waves');
        led_waves();
        break;

    case 3:
        log('starting rain');
        rain(effectBuffer).go();
        break;

    default:
        log('console diagnostics')
        // output to stdout
        diagnostics(1);
}

server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});
