import express from 'express';

//import Pixel from 'client/src/lib/pixel';



const port = process.env.PORT || 5000;
const server = express();

const TICKRATE = 20;
const NUM_PIXELS = 10;


server.use('/', express.static('./server/client'))

server.listen(port, () => {
    // let pixelArray = [];
    // for (let p = 0; p < NUM_PIXELS; p++){
    //     pixelArray.push(new Pixel(p));
    // }

    process.stdout.write(`Listening on port ${port}`);
    process.stdout.write("\n");
    let count = NUM_PIXELS;
    while (count++ % NUM_PIXELS) {
        setTimeout(count => {
            draw(count);
        }, TICKRATE)
    }
});


const draw = count => {
    const glyph = '*';
    let message = [];
    for(let i = 0; i < count; i++) {
        message.append(glyph);
    }
    process.stdout.clearLine();
    process.stdout.write(message.join(''));
}