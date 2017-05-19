import * as SC from 'soundcloud';

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

SC.initialize({client_id});

const completeUrl = (url:string):string => {
    if (!url || !url.length) return '';
    else if (url.indexOf('https://') === 0) return url;
    else if (url.indexOf('http://') === 0) return `https://${url.slice(7)}`;
    else if (url.indexOf('//') === 0) return `https:${url}`;
    else if (url.indexOf('soundcloud.com') === 0) return `https://${url}`;
    else if (url.indexOf('/') === 0) return `https://soundcloud.com${url}`;
    else return `https://soundcloud.com/${url}`; // hope for the best
};

const fetchUserTracks = async (user:SC_User):Promise<SC_Track[]> => {
    return await SC.get(`/users/${user.id}/tracks`);
};

export const fetchTracks = async (url:string):Promise<SC_Track[]> => {
    url = completeUrl(url);
    try {
        const resource:SC_Resource = await SC.resolve(url);
        const type = resource && resource.kind;
        switch (type) {
            case 'track': return [(resource as SC_Track)];
            case 'playlist': return (resource as SC_Set).tracks;
            case 'user': return await fetchUserTracks(resource as SC_User);
            default: throw new Error(
                `Unhandled resource type "${type}", can only handle:\n`
                + `    - tracks\n`
                + `    - albums\n`
                + `    - artists\n`
                + `    - playlists\n`
            );
        }
    }
    catch (e) {
        const prefix = `Unable to load resource`;
        const message = e && e.message || e;
        alert(`${prefix}\n\nURL = ${url}\n\nError = ${message}`);
        throw e;
    }
};
