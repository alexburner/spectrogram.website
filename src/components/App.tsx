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
import Playlist from 'src/components/Playlist';
import Visualizer from 'src/components/Visualizer';

const WIDTH = 600;
const HEIGHT = 600;
const BORDER = 7;

export default () => (
    <div style={{
        margin: '24px auto',
        width: `${WIDTH + BORDER * 2}px`,
    }}>
        <Visualizer width={WIDTH} height={HEIGHT} border={BORDER} />
        <Playlist />
        <Loader />
    </div>
);
