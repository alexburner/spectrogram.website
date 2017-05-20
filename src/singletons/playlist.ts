import {EventEmitter} from 'eventemitter3';

import audio from 'src/singletons/audio';
import {client_id, SC_Track} from 'src/singletons/soundcloud';

export interface Track extends SC_Track {
    index:number;
    isPlaying:boolean;
}

let tracks:Track[] = [];
let currentIndex = null;
let isPlaying = false;

type EventNames = (
    'playpause'|   // isPlaying:boolean
    'trackchange'| // track:Track
    'listchange'|  // tracks:Track[]
    'all'          // tracks:Track[]
);

class Events extends EventEmitter {
    on(event:EventNames, fn:EventEmitter.ListenerFn, context?:any):this {
        super.on(event, fn, context);
        return this;
    }

    emit(event:EventNames, ...args:any[]):boolean {
        const result = super.emit(event, ...args);
        if (event !== 'all') this.emit('all', tracks);
        return result;
    }
}

export const events = new Events();

export const setTracks = (scTracks:SC_Track[] = []) => {
    pauseTrack(currentIndex);
    currentIndex = null;
    tracks = scTracks.map((scTrack, index) => ({
        ...scTrack, index, isPlaying: false,
    }));
    events.emit('listchange', tracks);
};

export const getTracks = ():Track[] => {
    return tracks;
};

export const getCurrentTrack = ():Track|undefined => {
    return tracks[currentIndex];
};

const loadTrack = (track:Track) => {
    if (!track.stream_url) return;
    audio.crossOrigin = 'anonymous';
    audio.src = `${track.stream_url}?client_id=${client_id}`;
    document.title = `${track.title} — Spectrogram.Party`;
    events.emit('trackchange', track);
};

export const playTrack = (index:number) => {
    const track = tracks[index];
    if (!track) return;
    if (index !== currentIndex) {
        pauseTrack(currentIndex);
        currentIndex = index;
        loadTrack(track);
    }
    isPlaying = true;
    track.isPlaying = true;
    audio.play();
    events.emit('playpause', true);
};

export const pauseTrack = (index:number) => {
    const track = tracks[index];
    if (!track) return;
    isPlaying = false;
    track.isPlaying = false;
    audio.pause();
    events.emit('playpause', false);
};

export const togglePlay = () => {
    if (currentIndex === null && tracks.length) return playTrack(0);
    isPlaying
        ? pauseTrack(currentIndex)
        : playTrack(currentIndex);
}

export const nextTrack = () => {
    if (currentIndex === null) return playTrack(0);
    let newIndex = currentIndex + 1;
    newIndex %= tracks.length;
    playTrack(newIndex);
};

export const prevTrack = () => {
    if (currentIndex === null) return playTrack(0);
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = tracks.length - 1;
    playTrack(newIndex);
};

audio.addEventListener('ended', nextTrack);
