import * as bowser from 'bowser';
import * as React from 'react';

import * as playlist from 'src/singletons/playlist';
import * as soundcloud from 'src/singletons/soundcloud';
import scroll from 'src/singletons/scroll';

import Footer from 'src/components/Footer';
import SeekBar from 'src/components/SeekBar';
import TrackTable from 'src/components/TrackTable';
import UrlLoader from 'src/components/UrlLoader';
import Visualizer from 'src/components/Visualizer';

const WIDTH = bowser.mobile ? Math.floor(window.innerWidth * 0.9) : 600;
const HEIGHT = WIDTH;
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
                    playlist.togglePlay();
                    break;
                }
                case 37: {
                    // left arrow
                    if (e.ctrlKey || e.metaKey) return;
                    e.preventDefault();
                    playlist.prevTrack();
                    break;
                }
                case 39: {
                    // right arrow
                    if (e.ctrlKey || e.metaKey) return;
                    e.preventDefault();
                    playlist.nextTrack();
                    break;
                }
            }
        });
        window.addEventListener('hashchange', () => {
            loadHashTracks().then(() => {
                playlist.playTrack(0);
            });
        });
        loadHashTracks();
    }
}

const getLocationHash = ():string|void => (
    window.location.hash &&
    window.location.hash.length > 1 &&
    window.location.hash.slice(1)
);

const loadHashTracks = () => {
    const hash = getLocationHash();
    if (!hash || !hash.length) return;
    return soundcloud.fetchTracks(hash).then((tracks) => {
        playlist.setTracks(tracks);
        scroll();
    });
};
