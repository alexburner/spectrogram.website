import {audio} from 'src/singletons/audio';
import {client_id, Track} from 'src/singletons/sc';

let index = 0;
let tracks:Track[] = [];

const loadTrack = () => {
    const track = tracks[index];
    if (!track || !track.stream_url) return;
    document.title = `${track.title} — Spectrogram`;
    audio.crossOrigin = 'anonymous';
    audio.src = `${track.stream_url}?client_id=${client_id}`;
    audio.play();
};

export const nextTrack = () => {
    index++;
    index %= tracks.length;
    loadTrack();
};

export const prevTrack = () => {
    index--;
    if (index < 0) index = tracks.length - 1;
    loadTrack();
};

export const setTracks = (newTracks:Track[]) => {
    tracks = newTracks;
    index = 0;
    loadTrack();
};
