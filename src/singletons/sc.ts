import * as sdk from 'soundcloud';
export default sdk;
export {sdk};

export interface SC_Set {
    kind:'playlist';
    tracks:SC_Track[];
};

export interface SC_Track {
    artwork_url:string;
    created_at:string;
    duration:number;
    genre:string;
    id:number;
    kind:'track';
    last_modified:string;
    permalink_url:string;
    stream_url:string;
    tag_list:string;
    title:string;
    user:SC_User;
    waveform_url:string;
}

export interface SC_User {
    avatar_url:string;
    id:number;
    kind:'user';
    permalink_url:string;
    username:string;
}

export type SC_Resource = SC_Set|SC_Track|SC_User;

export const client_id = '2t9loNQH90kzJcsFCODdigxfp325aq4z';
sdk.initialize({client_id});

export const loadUrl = async (url:string):Promise<SC_Track[]> => {
    try {
        const resource:SC_Resource = await sdk.resolve(url);
        const type = resource && resource.kind;
        switch (type) {
            case 'playlist': return (resource as SC_Set).tracks;
            case 'track': return [(resource as SC_Track)];
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
        throw e;
    }
};
