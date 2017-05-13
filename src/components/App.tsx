import * as React from 'react';

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