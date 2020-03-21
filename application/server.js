import express from 'express';
import testbed from '../src/lib/testbed'
import diagnostics from '../src/lib/diagnostics';
import led_cells from '../src/effects/cell/renderer_cells';
import led_waves from '../src/effects/wave/renderer_wave';
import test_point_light from '../src/effects/_common/test_point_light';

const port = process.env.PORT || 5000;
const server = express();
server.use(express.json())
server.use('/', express.static('./application/client'))
server.use('/cells', express.static('./application/client/cells.html'))
server.use('/testbed', express.static('./application/client/testbed.html'))
server.use('/wave', express.static('./application/client/wave.html'))

server.post('/lab/', async (req, response) => {
    console.log(`=== got ${JSON.stringify(req.body)}`);
    response.json('ok');
});

switch (mode){
    case 1:
        led_cells();
        break;
    case 2:
        led_waves();
        break;
    case 3:
        test_point_light();
        break;
    
    default:
        // output to stdout
        diagnostics(1);
}

server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});
