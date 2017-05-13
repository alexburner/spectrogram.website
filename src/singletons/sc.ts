import * as sdk from 'soundcloud';
export default sdk;
export {sdk};

export const client_id = 'Z8yVpZ0DJ4FcMwo5kk0bCEPNFfHs6AXJ';
sdk.initialize({client_id});

export type Resource = Set|Track|User;

export interface Set {
    kind:'playlist';
    tracks:Track[];
};

export interface Track {
    duration:number;
    kind:'track';
    permalink_url:string;
    stream_url:string;
    title:string;
    user:User;
    waveform_url:string;
}

export interface User {
    avatar_url:string;
    id:number;
    kind:'user';
    permalink_url:string;
    username:string;
}

export const loadUrl = async (url:string):Promise<Track[]> => {
    try {
        const resource:Resource = await sdk.resolve(url);
        const type = resource && resource.kind;
        switch (type) {
            case 'playlist': return (resource as Set).tracks;
            case 'track': return [(resource as Track)];
            default: throw new Error(
                `Unhandled resource type "${type}", ` +
                `can only handle tracks, albums, and playlists.`
            );
        }
    }
    catch (e) {
        const prefix = `Unable to load resource`;
        const message = e && e.message || e;
        alert(`${prefix}\n\nError = ${message}\n\nURL = ${url}`);
    }
};
