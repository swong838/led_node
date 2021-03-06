import express from 'express';

import { debug, LAB_FLAGS } from '../src/lib/constants';
import { log, Buffer } from '../src/lib/utilities'; 

import diagnostics from '../src/lib/diagnostics';
import test_point_light from '../src/effects/_common/test_point_light';

import Renderer from '../src/effects/_common/renderer';

import led_waves from '../src/effects/wave/renderer_wave';
import rain from '../src/effects/rain/controller';
import fireflies from '../src/effects/fireflies/controller';
import rgbmap from '../src/effects/rgbmap/controller';

const port = process.env.PORT || 5000;
const server = express();
server.use(express.json());
server.use('/', express.static('./application/client'));
server.use('/remote', express.static('./application/client/remote.html'));
server.use('/wave', express.static('./application/client/wave.html'));

if (debug) {
    log('starting lab');

    const labDisplay = rgbmap({ image: 'color_calibration' });

    server.use('/settings', express.static('./application/client/settings.html'));
    server.use('/testbed', express.static('./application/client/testbed.html'));


    server.post('/lab/', async (req, response) => {

        const input = {...req.body};
        let effectSettings = {...input.settings};

        switch (input.type) {

            // PointLight tester
            case LAB_FLAGS.pointLight:
                log('adding pointLight');
                for (let v in effectSettings) {
                    var tempV = parseFloat(effectSettings[v]);
                    /**
                        Yes, this is an eval.
                        It's meant to let us develop algorithmic effects without needing to restart the node server.
                        Of course it's behind the `debug` flag.
                    */
                    if (isNaN(tempV)) {
                        eval(`tempV = ${effectSettings[v]}`);
                    }
                    effectSettings[v] = tempV;
                }
                effectBuffer.add(effectSettings);
                break;


            // Start Color Calibrator
            case LAB_FLAGS.startCalibration:
                log('initializing calibration');
                labDisplay.go();
                break;

            // Color Calibrator
            case LAB_FLAGS.setRGB:
                log(`calibration event ${effectSettings.r} ${effectSettings.g} ${effectSettings.b}`);
                labDisplay.tune(effectSettings);
                break;

            default:
                log('flushing buffer');
                effectBuffer.add(false);
        }
        response.json('ok');
    });
}

const effectBuffer = Buffer();
const defaultMode = 0;
const mode = parseInt(process.argv.slice(2), 10) || defaultMode;

switch (mode){
    case 0:
        /**
         * Remote mode listener
         */
        log('starting remote mode');

        let currentMode = new Renderer();
        currentMode.ledStrip.clear();

        server.put('/remote/:mode', (req, res) => {
            const mode = req.params.mode;
            log(`mode setter called with ${mode}`);

            currentMode.stop();
            currentMode.flush();
            currentMode.ledStrip.clear();

            switch (mode) {

                case 'waves':
                    currentMode = led_waves(effectBuffer);
                    currentMode.go();
                    break;

                case 'fireflies':
                    currentMode = fireflies(effectBuffer);
                    currentMode.go();
                    break;

                case 'rain':
                    currentMode = rain(effectBuffer);
                    currentMode.go();
                    break;

                case 'rgbmap':
                    currentMode = rgbmap({ image: req.body.bitmap });
                    currentMode.go();
                    break;

                case 'stop':
                default:
                    currentMode = new Renderer();
                    currentMode.stop();
                    currentMode.flush();
                    currentMode.ledStrip.clear();
                    break;
            }
            res.send(`got ${mode}`);
        });
        break;

    case 1:
        log('starting lab');
        test_point_light(effectBuffer).go();
        break;

    case 2:
        log('starting led_waves');
        led_waves();
        break;

    case 3:
        log('starting rain');
        rain(effectBuffer).go();
        break;

    case 4:
        log('starting fireflies');
        fireflies(effectBuffer).go();
        break;

    default:
        log('console diagnostics')
        // output to stdout
        diagnostics(1);
}

server.listen(port, () => {
    process.stdout.write(`Listening on port ${port}`);
});
