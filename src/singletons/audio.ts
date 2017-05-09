const Audio = (window as any).Audio;
const AudioContext = (
    (window as any).AudioContext ||
    (window as any).webkitAudioContext
);

const audio = new Audio();
const context = new AudioContext();
const source = context.createMediaElementSource(audio);
const splitter = context.createChannelSplitter();
const analyserL = context.createAnalyser();
const analyserR = context.createAnalyser();


const SIZE = 512;
analyserL.fftSize = SIZE;
analyserR.fftSize = SIZE;
source.connect(splitter);
splitter.connect(analyserL, 0, 0);
splitter.connect(analyserR, 1, 0);
source.connect(context.destination);

const dataArrayL = new Uint8Array(analyserL.frequencyBinCount);
const dataArrayR = new Uint8Array(analyserR.frequencyBinCount);
const getChannels = () => {
    analyserL.getByteFrequencyData(dataArrayL);
    analyserR.getByteFrequencyData(dataArrayR);
    return [dataArrayL, dataArrayR];
};

export default audio;
export {audio, getChannels};
