import audio from 'src/singletons/audio';
import {client_id, SC_Track} from 'src/singletons/sc';

export interface Track extends SC_Track {
    index:number;
    isPlaying:boolean;
}

export type ChangeListener = {(tracks:Track[]):void};

const listeners:ChangeListener[] = [];

let isPlaying = false;
let currentIndex = null;
let tracks:Track[] = [];

const loadTrack = (track:Track) => {
    if (!track.stream_url) return;
    audio.crossOrigin = 'anonymous';
    audio.src = `${track.stream_url}?client_id=${client_id}`;
    document.title = `${track.title} — Spectrogram.Party`;
};

export const pauseTrack = (index:number) => {
    const track = tracks[index];
    if (!track) return;
    isPlaying = false;
    track.isPlaying = false;
    audio.pause();
    triggerChange();
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
    triggerChange();
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

export const setTracks = (scTracks:SC_Track[] = [], silent?:boolean) => {
    pauseTrack(currentIndex);
    currentIndex = null;
    tracks = scTracks.map((scTrack, index) => ({
        ...scTrack, index, isPlaying: false,
    }));
    if (!silent) triggerChange();
};

export const getTracks = ():Track[] => {
    return tracks;
};

export const onChange = (listener:ChangeListener) => {
    listeners.push(listener);
};

const triggerChange = () => {
    listeners.forEach(listener => listener(tracks));
};

audio.addEventListener('ended', nextTrack);
