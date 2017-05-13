import * as React from 'react';

import {Track, playTrack, pauseTrack} from 'src/singletons/playlist';

interface Props {
    track:Track;
}

export default ({track}:Props) => {
    const duration = (track.duration / 1000 / 60).toFixed(2).split('.');
    const minutes = duration[0];
    const seconds = duration[1];
    return (
        <tr>
            <td>
                <img
                    src={track.artwork_url}
                    width="32"
                    height="32"
                />
            </td>
            <td className="title">
                <a href={track.user.permalink_url} target="_blank">
                    {track.user.username}
                </a>
                &nbsp;&mdash;&nbsp;
                <a href={track.permalink_url} target="_blank">
                    {track.title}
                </a>
            </td>
            <td className="duration">
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    track.isPlaying
                        ? pauseTrack(track.index)
                        : playTrack(track.index);
                }}>
                    {minutes}:{seconds}
                    &nbsp;
                    {track.isPlaying
                        ? <i className="material-icons">pause</i>
                        : <i className="material-icons">play_arrow</i>
                    }
                </a>
            </td>
        </tr>
    );
}