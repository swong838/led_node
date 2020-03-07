import React from 'react';
import {width, height, debug} from '%src/lib/constants';

const PixelView = ({
    val,
    fx,
    left,
    right,
    callback
}) => {

    const rawVal = val;

    const b = Math.max(val - 255, 0);
    val -= 255;
    const r = Math.max(val - 120, 0);
    val -= 120;
    const g = Math.max(val - 60, 0);

    const pixelstyle = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: `rgb(${r},${g},${b})`
    }
    const diag = {color: `rgb(${255-r},${255-g},${255-b})`}
    const diagnostics = debug && (
        <React.Fragment>
            <h5 style={diag}>{rawVal}</h5>
            <code style={diag}>{left}:{fx}:{right}</code>
        </React.Fragment>
    ) || null;
    return <div className="pixel" style={pixelstyle} onClick={callback}>{diagnostics}</div>
}

export default PixelView;
