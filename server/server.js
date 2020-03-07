import express from 'express';

//import Pixel from 'client/src/lib/pixel';


const port = process.env.PORT || 5000;
const server = express();

const TICKRATE = 20;
const NUM_PIXELS = 10;


server.use('/', express.static('./server/client'))
server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});


(() => {
    process.stdout.write("\n");
    let count = 0;
    // let pixelArray = [];
    // for (let p = 0; p < NUM_PIXELS; p++){
    //     pixelArray.push(new Pixel(p));
    // }

    const draw = (count) => {
        const glyph = '*';
        let message = [];
        for(let i = 0; i < count; i++) {
           message.push(glyph);
        }
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(message.join(''));
    }
    
    setInterval(() => {
        draw(count++);
        count = count % NUM_PIXELS;
    }, TICKRATE);

})();
