import * as React from 'react';

import {Track, playTrack, pauseTrack} from 'src/singletons/playlist';

interface Props {
    track:Track;
}

const handleClick = (e, track:Track) => {
    e.preventDefault();
    track.isPlaying
        ? pauseTrack(track.index)
        : playTrack(track.index);
}

export default ({track}:Props) => {
    const duration = (track.duration / 1000 / 60).toFixed(2).split('.');
    const minutes = duration[0];
    const seconds = duration[1];
    const trackAction = track.isPlaying
        ? 'Pause track'
        : 'Play track';
    return (
        <tr>
            <td className="thumb">
                <a
                    href="#"
                    title={trackAction}
                    onClick={(e) => handleClick(e, track)}
                    style={{
                        display: 'block',
                        width: '32px',
                        height: '32px',
                    }}
                >
                    <img
                        src={track.artwork_url}
                        width="32"
                        height="32"
                    />
                </a>
            </td>
            <td className="title">
                <a
                    href={track.user.permalink_url}
                    target="_blank"
                    title={track.user.username}
                >
                    {track.user.username}
                </a>
                &nbsp;&mdash;&nbsp;
                <a
                    href={track.permalink_url}
                    target="_blank"
                    title={track.title}
                >
                    {track.title}
                </a>
            </td>
            <td className="duration">
                <a
                    href="#"
                    title={trackAction}
                    onClick={(e) => handleClick(e, track)}
                >
                    {minutes}:{seconds}&nbsp;
                    <i className="material-icons">
                        {track.isPlaying
                            ? 'pause'
                            : 'play_arrow'
                        }
                    </i>
                </a>
            </td>
        </tr>
    );
}