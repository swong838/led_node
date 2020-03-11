import express from 'express';
//import diagnostics from '../src/lib/diagnostics';
import animation from '../src/lib/ledstrip';

const port = process.env.PORT || 5000;
const server = express();
server.use('/', express.static('./application/client'))
server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});

// display test output in stdout
//diagnostics(1);
animation();
