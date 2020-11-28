import path from 'path';


import MapRenderer from '../_common/map_renderer';
import { TICKRATE } from '../../lib/constants';
import { log } from '../../lib/utilities';

const IMAGE = 'water.bmp';


const rgbmap = (effectBuffer) => {

    const renderer = new MapRenderer({
        image: path.resolve(__dirname, IMAGE)
    });

    // main render loop
    setInterval(() => {
        renderer.tick();
    }, 50);

    return renderer;
}

export default rgbmap;
