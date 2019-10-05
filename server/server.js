import express from 'express';
const port = process.env.PORT || 5000;
const server = express();

server.use('/', express.static('./server/client/build'))

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
