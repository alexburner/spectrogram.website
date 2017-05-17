export const check = () => Boolean(
    document.fullscreenElement ||
    document['msFullScreenElement'] ||
    document['mozFullScreenElement'] ||
    document.webkitFullscreenElement
);

export const enter = (element:HTMLElement) => {
    const request = (
        element.requestFullscreen ||
        element['msRequestFullscreen'] ||
        element['mozRequestFullScreen'] ||
        element.webkitRequestFullscreen
    );
    if (request) request.call(element);
};

export const exit = () => {
    const exit = (
        document.exitFullscreen ||
        document['msExitFullscreen'] ||
        document['mozCancelFullScreen'] ||
        document.webkitExitFullscreen
    );
    if (exit) exit.call(document);
};

export const onChange = (listener:{():void}) => {
    const eventNames = [
        'fullscreenchange',
        'msfullscreenchange',
        'mozfullscreenchange',
        'webkitfullscreenchange',
    ];
    eventNames.some(eventName => {
        if (document['on' + eventName] !== undefined) {
            document.addEventListener(eventName, listener);
            return true; // stop once successful
        }
    });
};

export const getScale = (element:HTMLElement, scale:number):number => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const rect = element.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;
    const screenRatio = screenWidth / screenHeight;
    const elementRatio = elementWidth / elementHeight;
    const targetHeight = screenHeight * scale;
    const targetWidth = screenWidth * scale;
    return screenRatio > elementRatio
        ? targetHeight / elementHeight
        : targetWidth / elementWidth;
};
