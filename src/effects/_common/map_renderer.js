import Renderer from './renderer';
import loadBitmap from '../../lib/bitmap';
import { log } from '../../lib/utilities';

import { RGB_TUNING } from '../../lib/constants';


class MapRenderer extends Renderer {

    constructor(settings) {
        super(settings);

        // 2D extracted bitmap image
        this.image = this._load(this.settings.image);

        // # of steps to get to next row
        this.tweenSteps = this.settings.tweenSteps || 1;

        // How to apply the tween
        this.tweenMethod = settings.tweenMethod ? 
            settings.tweenMethod.bind(this) :
            this.defaultTween.bind(this);

        // 
        this.currentRow = 0;
        this.nextRow = this.nextRow.bind(this);
        this.currentTweenStep = 0;

        this.render = this.defaultRenderer.bind(this);
        this.advance = this.defaultAdvancer.bind(this);

        log(`maprenderer initialized with image of length ${this.image.length}`)

    }

    defaultRenderer = () => {
        log('map renderer')
        // Render one frame of this effect
        for(let x = 0; x < this.image[this.currentRow].length; x++) {
            this.ledStrip.setLED(
                x,
                this.image[this.currentRow][x].r * RGB_TUNING.r,
                this.image[this.currentRow][x].g * RGB_TUNING.g,
                this.image[this.currentRow][x].b * RGB_TUNING.b,
                .1
            );
        }
        log(`pushing row at ${this.currentRow}`)
        this.ledStrip.sync();

        this.currentRow = this.nextRow();
    }

    defaultAdvancer() {
        // Go to next row
        //console.log('map advancer')
    }

    defaultTween(v) {
        // return interpolated values between two consecutive keyframes
    }

    nextRow() {
        // calculate index position of next row
        return (this.currentRow + 1) % this.image.length; 
    }

    _load(imagePath) {
        return loadBitmap(imagePath);
    }

}

export default MapRenderer;
