import MapRenderer from '../_common/map_renderer';
import { TICKRATE } from '../../lib/constants';
import { log } from '../../lib/utilities';

const image = 'rgb.bmp';


const rgbmap = (effectBuffer) => {

    const renderer = new MapRenderer({
        image
    });

    // main render loop
    setInterval(() => {
        renderer.tick();
    }, TICKRATE);

    return renderer;
}

export default rgbmap;
