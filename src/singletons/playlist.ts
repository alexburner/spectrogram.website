import {audio} from 'src/singletons/audio';
import {client_id, SC_Track} from 'src/singletons/sc';

interface Track extends SC_Track {
    index:number;
    isPlaying:boolean;
}

type ChangeListener = {(tracks:Track[]):void};
const listeners:ChangeListener[] = [];

let index = 0;
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
    track.isPlaying = true;
    loadTrack(track);
    audio.play();
    triggerChange();
};

export const nextTrack = () => {
    index++;
    index %= tracks.length;
    playTrack(index);
};

export const prevTrack = () => {
    index--;
    if (index < 0) index = tracks.length - 1;
    playTrack(index);
};

export const setTracks = (scTracks:SC_Track[]) => {
    tracks = scTracks.map((scTrack, index) => ({
        ...scTrack, index, isPlaying: false,
    }));
    index = 0;
    playTrack(index);
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
