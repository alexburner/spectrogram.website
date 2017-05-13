import * as React from 'react';

import {getChannels} from 'src/singletons/audio';

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

interface Props {
    width:number,
    height:number,
    border:number,
}

export default class Spectrogram extends React.Component<Props, undefined> {
    private sliceCanvas:HTMLCanvasElement;
    private sheetCanvas:HTMLCanvasElement;
    private sliceContext:CanvasRenderingContext2D;
    private sheetContext:CanvasRenderingContext2D;
    private mountSignature:{};
    private width:number;
    private height:number;
    private border:number;

    constructor(props) {
        super(props);
        this.width = props.width;
        this.height = props.height;
        this.border = props.border;
    }

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
            <div style={{
                background: '#333',
                border: 'solid #333',
                borderWidth: `${this.border + 1}px ${this.border}px`,
            }}>
                <canvas
                    ref={el => this.sliceCanvas = el}
                    style={{display: 'block'}}
                    height={1 * (this.height / 6)}
                    width={this.width}
                />
                <canvas
                    ref={el => this.sheetCanvas = el}
                    style={{display: 'block'}}
                    height={5 * (this.height / 6)}
                    width={this.width}
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
