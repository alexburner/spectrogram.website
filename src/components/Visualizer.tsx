import * as React from 'react';

import {getChannels} from 'src/singletons/audio';

const WIDTH = 600;
const HEIGHT = 600;

const drawSlice = (
    canvas:HTMLCanvasElement,
    context:CanvasRenderingContext2D,
    channels:Uint8Array[]
) => {
    const width = canvas.width;
    const height = canvas.height;
    context.fillStyle = '#333';
    context.fillRect(0, 0, width, height);
    const rectCount = channels[0].length;
    const rectWidth = width / 2 / rectCount;
    channels.forEach((channel, index) => {
        for (let i = 0; i < rectCount; i++) {
            const magnitude = channel[i] / 255;
            const hue = magnitude * 300;
            const rectHeight = magnitude * height;
            context.fillStyle = `hsl(${hue}, 64%, 64%)`;
            context.fillRect(
                index === 0
                    ? width / 2 - rectWidth * i
                    : width / 2 + rectWidth * i,
                height - rectHeight,
                rectWidth + 1,
                rectHeight
            );
        }
    });
};

const drawSheet = (
    canvas:HTMLCanvasElement,
    context:CanvasRenderingContext2D,
    channels:Uint8Array[]
) => {
    const width = canvas.width;
    const height = canvas.height;
    const image = context.getImageData(0, 0, width, height);
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
                    ? width / 2 - rectWidth * i
                    : width / 2 + rectWidth * i,
                0,
                rectWidth + 1,
                rectHeight + 1
            );
        }
    });
    context.putImageData(image, 0, rectHeight);
};

export default class Visualizer extends React.Component<undefined, undefined> {
    private sliceCanvas:HTMLCanvasElement;
    private sheetCanvas:HTMLCanvasElement;
    private sliceContext:CanvasRenderingContext2D;
    private sheetContext:CanvasRenderingContext2D;
    private mountSignature:{};

    animate(mountSignature:{}) {
        if (mountSignature !== this.mountSignature) return;
        const channels = getChannels();
        drawSlice(this.sliceCanvas, this.sliceContext, channels);
        drawSheet(this.sheetCanvas, this.sheetContext, channels);
        window.requestAnimationFrame(() => {
            this.animate(mountSignature);
        });
    }

    render() {
        return (
            <div className="visualizer">
                <canvas
                    ref={el => this.sliceCanvas = el}
                    height={1 * (HEIGHT / 6)}
                    width={WIDTH}
                />
                <canvas
                    ref={el => this.sheetCanvas = el}
                    height={5 * (HEIGHT / 6)}
                    width={WIDTH}
                />
            </div>
        );
    }

    componentDidMount() {
        this.mountSignature = {}; // unique object reference
        this.sliceContext = this.sliceCanvas.getContext('2d');
        this.sheetContext = this.sheetCanvas.getContext('2d');
        this.animate(this.mountSignature);
    }

    componentWillUnmount() {
        this.mountSignature = null; // stops animation loop
    }
}
