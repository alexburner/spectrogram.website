import * as React from 'react';

import * as fullscreen from 'src/singletons/fullscreen';

interface Props {
    onChange:{(isFullscreen:boolean):void};
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
                        ? fullscreen.exit()
                        : fullscreen.enter(this.props.target);
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
        fullscreen.onChange(() => {
            const target = this.props.target;
            const isFullscreen = fullscreen.check();
            this.props.onChange(isFullscreen);
            this.setState({isFullscreen});
        });
    }
}
