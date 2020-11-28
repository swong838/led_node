const fs = require('fs');
const bmp = require('bmp-js');

const BYTES_PER_PIXEL = 4;
const COLOR_ORDER = Object.freeze({
    a: 0,
    b: 1,
    g: 2,
    r: 3,
});

const toArray = ({ width, height, data: bitmap }) => {

    // bitmap buffer to 2d array
    const bytesPerRow = width * BYTES_PER_PIXEL;

    // row by row
    const y_array = [];
    for (let y = 0; y < height; y++) {
        const rowOffset = bytesPerRow * y;
        const rowEnd = rowOffset + bytesPerRow;

        // column by column
        const rowBytes = bitmap.subarray(rowOffset, rowEnd);
        let row = [];

        // break each row into chunks of (BYTES_PER_PIXEL)
        for (let x = 0; x < width * BYTES_PER_PIXEL; x += BYTES_PER_PIXEL) {

            // convert each pixel chunk into an RGB object
            const pixelBuffer = rowBytes.subarray(x, (x + BYTES_PER_PIXEL));
            row.push({
                r: pixelBuffer[COLOR_ORDER.r],
                g: pixelBuffer[COLOR_ORDER.g],
                b: pixelBuffer[COLOR_ORDER.b],
            });
        }
        y_array.push(row);
    }
    return y_array;
}

const loadBitmap = path => {
    const fileBuffer = fs.readFileSync(path);
    const imageData = bmp.decode(fileBuffer);
    return toArray(imageData);
}

export default loadBitmap;
