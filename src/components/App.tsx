import * as React from 'react';

import * as playlist from 'src/singletons/playlist';
import * as sc from 'src/singletons/sc';
import * as scroll from 'src/singletons/scroll';

import Footer from 'src/components/Footer';
import SeekBar from 'src/components/SeekBar';
import TrackTable from 'src/components/TrackTable';
import FetchUrl from 'src/components/FetchUrl';
import Visualizer from 'src/components/Visualizer';

const WIDTH = 600;
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
                <FetchUrl />
                <Footer />
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
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
                scroll.toTop();
            });
        });
        // initial page load
        loadHashTracks();
    }
}

const loadHashTracks = () => {
    const hash = (
        window.location.hash &&
        window.location.hash.length > 1 &&
        window.location.hash.slice(1)
    );
    return sc.fetchTracks(hash).then((tracks) => {
        playlist.setTracks(tracks);
    });
};
