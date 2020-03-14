// hardware
import * as dotstar from 'dotstar';
import SPI from 'pi-spi';

const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 121;
const ledStrip = new dotstar.Dotstar(spi, {
    length: ledStripLength
});

ledStrip.off();
ledStrip.sync();


const on = () => {
    ledStrip.all(150, 150, 150, 0.8);
    ledStrip.sync();
}

const off = () => {
    ledStrip.off();
    ledStrip.sync();
}

on();
setTimeout(off, 3000);
