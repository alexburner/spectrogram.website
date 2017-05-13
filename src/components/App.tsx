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
import Tracks from 'src/components/Tracks';
import Visualizer from 'src/components/Visualizer';

export default () => (
    <div>
        <Visualizer />
        <Tracks />
        <Loader />
    </div>
);
