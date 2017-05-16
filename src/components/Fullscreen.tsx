import * as React from 'react';

interface State {
    isFullscreen:boolean;
}

const isFullscreen = () => Boolean(
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

export default class Fullscreen extends React.Component<undefined, State> {
    private target:HTMLElement;

    constructor() {
        super();
        this.state = {isFullscreen: false};
        this.target = document.getElementById('app');
    }

    render() {
        return (
            <button
                className="fullscreen-toggle"
                onClick={() => (
                    this.state.isFullscreen
                        ? exitFullscreen()
                        : requestFullscreen(this.target)
                )}
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
            this.setState({isFullscreen: isFullscreen()});
        });
    }
}
