import Renderer from './renderer';
import loadBitmap from '../../lib/bitmap';


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

    }

    defaultRenderer = () => {
        // Render one frame of this effect
        for(let x = 0; x < this.image[currentRow].length; x++) {
            this.ledStrip.setLED(
                x,
                this.image[currentRow][x].r,
                this.image[currentRow][x].g,
                this.image[currentRow][x].b,
            );
        }
        this.ledStrip.sync();
    }

    defaultAdvancer() {
        // Go to next row
        this.currentRow = nextRow();
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
