import * as React from 'react';

import {togglePlay} from 'src/singletons/playlist';
import {getHashUrl} from 'src/singletons/util';

import UrlInput from 'src/components/UrlInput';
import TrackTable from 'src/components/TrackTable';
import Spectrogram from 'src/components/Spectrogram';

const WIDTH = 600;
const HEIGHT = 600;
const BORDER = 7;

export default class App extends React.Component<undefined, undefined> {
    private hashUrl:string;

    constructor() {
        super();
        this.hashUrl = getHashUrl();
    }

    render() {
        return (
            <div style={{
                margin: 'auto',
                padding: '24px 0 96px',
                width: `${WIDTH + BORDER * 2}px`,
            }}>
                <Spectrogram width={WIDTH} height={HEIGHT} border={BORDER} />
                <TrackTable />
                <UrlInput input={this.hashUrl} />
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
