import * as React from 'react';

import {togglePlay} from 'src/singletons/playlist';

import Footer from 'src/components/Footer';
import TrackTable from 'src/components/TrackTable';
import UrlLoader from 'src/components/UrlLoader';
import Visualizer from 'src/components/Visualizer';

const WIDTH = 600;
const HEIGHT = 600;
const BORDER = 7;

export default class App extends React.Component<undefined, undefined> {
    render() {
        return (
            <div
                className="container"
                style={{width: `${WIDTH + BORDER * 2}px`}}
            >
                <Visualizer
                    width={WIDTH}
                    height={HEIGHT}
                    border={BORDER}
                />
                <TrackTable />
                <UrlLoader />
                <Footer />
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 32: {
                    // spacebar
                    e.preventDefault();
                    togglePlay();
                    break;
                }
            }
        });
    }
}
