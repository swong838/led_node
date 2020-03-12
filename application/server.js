import express from 'express';
//import diagnostics from '../src/lib/diagnostics';

const port = process.env.PORT || 5000;
const server = express();
server.use('/', express.static('./application/client'))
server.use('/cells', express.static('./application/client/cells.html'))
server.use('/wave', express.static('./application/client/wave.html'))
server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});

// display test output in stdout
//diagnostics(1);
