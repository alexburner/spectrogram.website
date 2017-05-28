interface Args {
    x:number;
    y:number;
    width:number;
    height:number;
    context:CanvasRenderingContext2D;
    channels:Uint8Array[];
}

export const spectrogram = ({x, y, width, height, context, channels}:Args) => {
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
                index === 0
                    ? x + width / 2 - rectWidth * i
                    : x + width / 2 + rectWidth * i,
                y + height - rectHeight,
                rectWidth + 1,
                rectHeight
            );
        }
    });
};

export const waterfall = ({x, y, width, height, context, channels}:Args) => {
    const image = context.getImageData(x, y, width, height);
    const rectCount = channels[0].length;
    const rectWidth = width / 2 / rectCount;
    const rectHeight = rectWidth;
    channels.forEach((channel, index) => {
        for (let i = 0; i < rectCount; i++) {
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
