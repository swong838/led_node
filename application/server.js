import express from 'express';

import { STRIP_LENGTH } from '../src/lib/constants';
import { log } from '../src/lib/utilities'; 

import diagnostics from '../src/lib/diagnostics';
// import led_cells from '../src/effects/cell/renderer_cells';
import led_waves from '../src/effects/wave/renderer_wave';
import test_point_light from '../src/effects/_common/test_point_light';

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

//[][][] protect behind a debug flag
server.post('/lab/', async (req, response) => {
    let effectSettings = {...req.body};
    
    for (let v in effectSettings) {
        let tempV = parseFloat(effectSettings[v]);
        if (isNaN(tempV)) {
            eval(`tempV = ${effectSettings[v]}`);  // yes, it's an eval
            effectSettings[v] = tempV;
        }
        effectSettings[v] = tempV;
    }
    log(`pushing ${JSON.stringify(effectSettings)}`);
    effectBuffer.add(effectSettings);
    response.json('ok');
});

const mode = 3;

switch (mode){
    
    case 0:
        break;

    // case 1:
    //     led_cells();
    //     break;
    case 2:
        led_waves();
        break;
    case 3:
        test_point_light(effectBuffer).go();
        break;

    default:
        // output to stdout
        diagnostics(1);
}

server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});
