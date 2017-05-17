import * as React from 'react';

import {getChannels} from 'src/singletons/audio';
import {togglePlay} from 'src/singletons/playlist';

import Fullscreen from 'src/components/Fullscreen';

interface Props {
    width:number,
    height:number,
    border:number,
}

export default class Visualizer extends React.Component<Props, undefined> {
    private canvas:HTMLCanvasElement;
    private canvasCtx:CanvasRenderingContext2D;
    private mountSignature:{}; // object reference as id
    private width:number;
    private height:number;
    private border:number;
    private spectHeight:number;
    private waterHeight:number;
    private el:HTMLElement;

    constructor(props) {
        super(props);
        this.width = props.width;
        this.height = props.height;
        this.border = props.border;
        this.spectHeight = 1 * (this.height / 6);
        this.waterHeight = 5 * (this.height / 6);
    }

    animate(mountSignature:{}) {
        // bail if closure & class signature don't match
        if (mountSignature !== this.mountSignature) return;
        const channels = getChannels();
        drawSpectro({
            x: 0,
            y: 0,
            width: this.width,
            height: this.spectHeight,
            context: this.canvasCtx,
            channels,
        });
        drawWaterfall({
            x: 0,
            y: this.spectHeight,
            width: this.width,
            height: this.waterHeight,
            context: this.canvasCtx,
            channels,
        });
        window.requestAnimationFrame(() => {
            this.animate(mountSignature);
        });
    }

    render() {
        return (
            <div
                ref={(el) => this.el = el}
                className="visualizer"
                onClick={togglePlay}
                style={{
                    background: '#333',
                    border: 'solid #333',
                    borderWidth: `${this.border + 1}px ${this.border}px`,
                }}
            >
                <canvas
                    ref={el => this.canvas = el}
                    style={{display: 'block'}}
                    height={this.height}
                    width={this.width}
                />
                {this.el && <Fullscreen target={this.el} />}
            </div>
        );
    }

    componentDidMount() {
        this.forceUpdate(); // render() with ref for Fullscreen
        this.mountSignature = {}; // unique object reference
        this.canvasCtx = this.canvas.getContext('2d');
        this.animate(this.mountSignature);
    }

    componentWillUnmount() {
        this.mountSignature = null; // stops animation loop
    }
}

interface DrawArgs {
    x:number;
    y:number;
    width:number;
    height:number;
    context:CanvasRenderingContext2D;
    channels:Uint8Array[];
}

const drawSpectro = ({x, y, width, height, context, channels}:DrawArgs) => {
    context.fillStyle = '#333';
    context.fillRect(x, y, width, height);
    const rectCount = channels[0].length;
    const rectWidth = width / 2 / rectCount;
    channels.forEach((channel, index) => {
        for (let i = 0; i < rectCount; i++) {
            const magnitude = channel[i] / 255;
            const hue = magnitude * 300;
            const rectHeight = magnitude * height;
            context.fillStyle = `hsl(${hue}, 64%, 64%)`;
            context.fillRect(
                index === 0 // left channel?
                    ? x + width / 2 - rectWidth * i
                    : x + width / 2 + rectWidth * i,
                y + height - rectHeight,
                rectWidth + 1,
                rectHeight
            );
        }
    });
};

const drawWaterfall = ({x, y, width, height, context, channels}:DrawArgs) => {
    const image = context.getImageData(x, y, width, height);
    const count = channels[0].length;
    const rectWidth = width / 2 / count;
    const rectHeight = rectWidth;
    channels.forEach((channel, index) => {
        for (let i = 0; i < count; i++) {
            const magnitude = channel[i] / 255;
            const hue = magnitude * 300;
            context.fillStyle = `hsl(${hue}, 64%, 64%)`;
            context.fillRect(
                index === 0
                    ? x + width / 2 - rectWidth * i
                    : x + width / 2 + rectWidth * i,
                y,
                rectWidth + 1,
                rectHeight + 1
            );
        }
    });
    context.putImageData(image, x, y + rectHeight);
};
