import * as React from 'react';

import {loadUrl} from 'src/singletons/sc';
import {setTracks} from 'src/singletons/playlist';

loadUrl('https://soundcloud.com/cliffordmusic/sets/originals')
    .then((tracks) => {
        console.log(tracks);
        setTracks(tracks);
    })
    .catch((e) => {
        console.error(e);
    });
;

import Loader from 'src/components/Loader';
import TrackTable from 'src/components/TrackTable';
import Spectrogram from 'src/components/Spectrogram';

const WIDTH = 600;
const HEIGHT = 600;
const BORDER = 7;

export default () => (
    <div style={{
        margin: '24px auto 96px',
        width: `${WIDTH + BORDER * 2}px`,
    }}>
        <Spectrogram width={WIDTH} height={HEIGHT} border={BORDER} />
        <TrackTable />
        <Loader />
    </div>
);
