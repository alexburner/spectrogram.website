import * as React from 'react';
import * as throttle from 'lodash.throttle';

import * as playlist from 'src/singletons/playlist';

import TrackRow from 'src/components/TrackRow';

interface State {
    tracks:playlist.Track[];
}

export default class TrackTable extends React.Component<undefined, State> {
    constructor() {
        super();
        this.state = {tracks: playlist.getTracks()};
    }

    render() {
        return (
            <table className="track-table">
                <tbody>
                    {this.state.tracks.map(track => (
                        <TrackRow key={track.id} track={track} />
                    ))}
                </tbody>
            </table>
        );
    }

    componentDidMount() {
        playlist.events.on('all', throttle(
            (tracks) => this.setState({tracks}),
            {leading: false}
        ));
    }
}
