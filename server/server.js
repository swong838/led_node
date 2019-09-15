import express from 'express';

const port = process.env.PORT || 5000;

const server = express();

server.get('/', (request, response) => {
    response.send('test');
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
