import audio from 'src/singletons/audio';
import {client_id, SC_Track} from 'src/singletons/sc';

export interface Track extends SC_Track {
    index:number;
    isPlaying:boolean;
}

export type ChangeListener = {(tracks:Track[]):void};

const listeners:ChangeListener[] = [];

let currentIndex = null;
let tracks:Track[] = [];

const loadTrack = (track:Track) => {
    if (!track.stream_url) return;
    document.title = `${track.title} — Spectrogram`;
    audio.crossOrigin = 'anonymous';
    audio.src = `${track.stream_url}?client_id=${client_id}`;
};

export const pauseTrack = (index:number) => {
    const track = tracks[index];
    if (!track) return;
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
    track.isPlaying = true;
    audio.play();
    triggerChange();
};

export const nextTrack = () => {
    currentIndex++;
    currentIndex %= tracks.length;
    playTrack(currentIndex);
};

export const prevTrack = () => {
    currentIndex--;
    if (currentIndex < 0) currentIndex = tracks.length - 1;
    playTrack(currentIndex);
};

export const setTracks = (scTracks:SC_Track[]) => {
    pauseTrack(currentIndex);
    currentIndex = null;
    tracks = scTracks.map((scTrack, index) => ({
        ...scTrack, index, isPlaying: false,
    }));
    playTrack(0);
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
