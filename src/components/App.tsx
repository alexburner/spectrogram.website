import * as React from 'react';

import UrlLoader from 'src/components/UrlLoader';
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
        <UrlLoader />
    </div>
);
