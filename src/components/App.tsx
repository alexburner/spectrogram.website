import * as React from 'react';

import {togglePlay, prevTrack, nextTrack} from 'src/singletons/playlist';

import Footer from 'src/components/Footer';
import SeekBar from 'src/components/SeekBar';
import TrackTable from 'src/components/TrackTable';
import UrlLoader from 'src/components/UrlLoader';
import Visualizer from 'src/components/Visualizer';

const WIDTH = 600;
const HEIGHT = 600;
const BORDER_X = 7;
const BORDER_Y = 8;

export default class App extends React.Component<undefined, undefined> {
    render() {
        return (
            <div
                className="container"
                style={{width: `${WIDTH + BORDER_X * 2}px`}}
            >
                <Visualizer
                    width={WIDTH}
                    height={HEIGHT}
                    borderX={BORDER_X}
                    borderY={BORDER_Y}
                />
                <SeekBar />
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
                case 37: {
                    // left arrow
                    if (e.ctrlKey || e.metaKey) return;
                    e.preventDefault();
                    prevTrack();
                    break;
                }
                case 39: {
                    // right arrow
                    if (e.ctrlKey || e.metaKey) return;
                    e.preventDefault();
                    nextTrack();
                    break;
                }
            }
        });
    }
}
