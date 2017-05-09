import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import {loadUrl} from './singletons/sc';

loadUrl('https://soundcloud.com/cliffordmusic/sets/originals')
    .then((tracks) => console.log(tracks))
;

ReactDOM.render(<App />, document.getElementById('app'));
