import * as dotstar from './dotstar';
const SPI = require('pi-spi');

const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 120;

const ledStrip = new dotstar.Dotstar(spi, {
  length: ledStripLength
});

ledStrip.all(100, 200, 100, .8);
ledStrip.sync();
