import * as React from 'react';

import {togglePlay} from 'src/singletons/playlist';

import UrlLoader from 'src/components/UrlLoader';
import TrackTable from 'src/components/TrackTable';
import Spectrogram from 'src/components/Spectrogram';

const WIDTH = 600;
const HEIGHT = 600;
const BORDER = 7;

export default class App extends React.Component<undefined, undefined> {
    render() {
        return (
            <div style={{
                margin: '24px auto 96px',
                width: `${WIDTH + BORDER * 2}px`,
            }}>
                <Spectrogram width={WIDTH} height={HEIGHT} border={BORDER} />
                <TrackTable />
                <UrlLoader />
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
