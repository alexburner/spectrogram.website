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

const getTimeString = (milliseconds:number):string => {
    const hNum = Math.floor(milliseconds / 1000 / 60 / 60);
    const mNum = Math.floor(milliseconds / 1000 / 60 % 60);
    const sNum = Math.round(milliseconds / 1000 % 60);
    if (hNum > 0) {
        const hour = hNum;
        const minute = mNum < 10 ? '0' + mNum : mNum;
        const second = sNum < 10 ? '0' + sNum : sNum;
        return `${hour}:${minute}:${second}`;
    } else {
        const minute = mNum;
        const second = sNum < 10 ? '0' + sNum : sNum;
        return `${minute}:${second}`;
    }
};

export default ({track}:Props) => {
    const duration = getTimeString(track.duration);
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
                    title="Open artist page"
                    target="_blank"
                >
                    {track.user.username}
                </a>
                &nbsp;&mdash;&nbsp;
                <a
                    href={track.permalink_url}
                    title="Open track page"
                    target="_blank"
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
                    {duration}
                    &nbsp;
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