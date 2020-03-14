import express from 'express';
import diagnostics from '../src/lib/diagnostics';
import led_cells from '../src/lib/led_cells';

const port = process.env.PORT || 5000;
const server = express();
server.use('/', express.static('./application/client'))
server.use('/cells', express.static('./application/client/cells.html'))
server.use('/wave', express.static('./application/client/wave.html'))
server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});


const mode = 'waver';

switch (mode){
    case 'led_cells':
        led_cells();
        break;
    case 'waver':
        break;
    
    default:
        // output to stdout
        diagnostics(1);
}

