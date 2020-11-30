import path from 'path';


import MapRenderer from '../_common/map_renderer';
import { TICKRATE } from '../../lib/constants';
import { log } from '../../lib/utilities';

const IMAGE = 'nebula.bmp';


const rgbmap = ({ image=IMAGE }) => {

    const imagePath = path.resolve(__dirname, `${image}.bmp`);

    const renderer = new MapRenderer({ image: imagePath });

    // main render loop
    setInterval(() => {
        renderer.tick();
    }, 50);

    return renderer;
}

export default rgbmap;
