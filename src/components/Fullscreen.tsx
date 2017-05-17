import * as React from 'react';

interface Props {
    target:HTMLElement;
}

interface State {
    isFullscreen:boolean;
}

export default class Fullscreen extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {isFullscreen: false};
    }

    render() {
        return (
            <button
                className="fullscreen-toggle"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.state.isFullscreen
                        ? exitFullscreen()
                        : requestFullscreen(this.props.target);
                }}
            >
                <i className="material-icons">
                    {this.state.isFullscreen
                        ? 'fullscreen_exit'
                        : 'fullscreen'
                    }
                </i>
            </button>
        );
    }

    componentDidMount() {
        onFullscreenChange(() => {
            const target = this.props.target;
            const isFullscreen = checkFullscreen();
            isFullscreen
                ? target.style.transform = `scale(${getScale(target)})`
                : target.style.transform = 'scale(1)';
            this.setState({isFullscreen});
        });
    }
}

const checkFullscreen = () => Boolean(
    document.fullscreenElement ||
    document['msFullScreenElement'] ||
    document['mozFullScreenElement'] ||
    document.webkitFullscreenElement
);

const exitFullscreen = () => {
    const exit = (
        document.exitFullscreen ||
        document['msExitFullscreen'] ||
        document['mozCancelFullScreen'] ||
        document.webkitExitFullscreen
    );
    if (exit) exit.call(document);
};

const requestFullscreen = (element:HTMLElement) => {
    const request = (
        element.requestFullscreen ||
        element['msRequestFullscreen'] ||
        element['mozRequestFullScreen'] ||
        element.webkitRequestFullscreen
    );
    if (request) request.call(element);
};

const onFullscreenChange = (listener:{():void}) => {
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

const getScale = (element:HTMLElement):number => {
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const rect = element.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;
    const screenRatio = screenWidth / screenHeight;
    const elementRatio = elementWidth / elementHeight;
    const targetHeight = screenHeight * 0.95 ;
    const targetWidth = screenWidth * 0.95 ;
    return screenRatio > elementRatio
        ? targetHeight / elementHeight
        : targetWidth / elementWidth;
};
