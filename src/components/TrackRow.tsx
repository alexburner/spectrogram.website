import * as React from 'react';
import * as scroll from 'scroll';

import {Track, playTrack, pauseTrack} from 'src/singletons/playlist';

interface Props {
    track:Track;
}

const getTimeString = (milliseconds:number):string => {
    const hNum = Math.floor(milliseconds / 1000 / 60 / 60);
    const mNum = Math.floor(milliseconds / 1000 / 60 % 60);
    const sNum = Math.round(milliseconds / 1000 % 60);
    if (hNum > 0) {
        const hours = hNum;
        const minutes = mNum < 10 ? '0' + mNum : mNum;
        const seconds = sNum < 10 ? '0' + sNum : sNum;
        return `${hours}:${minutes}:${seconds}`;
    } else {
        const minutes = mNum;
        const seconds = sNum < 10 ? '0' + sNum : sNum;
        return `${minutes}:${seconds}`;
    }
};

const handleClick = (e:React.MouseEvent<HTMLElement>, track:Track) => {
    e.preventDefault();
    if (track.isPlaying) {
        pauseTrack(track.index);
    } else {
        scroll.top(document.body, 0);
        playTrack(track.index);
    }
}

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