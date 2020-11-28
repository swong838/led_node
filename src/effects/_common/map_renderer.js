import Renderer from './renderer';


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

    defaultRenderer() {

    }

    defaultAdvancer() {

    }

    defaultTween() {
        // return interpolated 

        

    }

    nextRow() { return (this.currentRow + 1) % this.image.length; }

    _load() {
        // load image map, extract just the pixels

        return 

    }

}

export default MapRenderer;
