import React from 'react';
import {width, height} from '%src/lib/constants';

const SimplePixelView = ({r, g, b}) => {

    const pixelstyle = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: `rgb(${r},${g},${b})`
    }
    return <div className="pixel" style={pixelstyle} />
}

export default SimplePixelView;