import * as SC from 'soundcloud';
import {EventEmitter} from 'eventemitter3';

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

export const client_id = 'Z8yVpZ0DJ4FcMwo5kk0bCEPNFfHs6AXJ';
export const events = new EventEmitter();

const restoreUrl = (url:string=''):string => {
    url = url.trim().toLowerCase();
    if (!url.length)                              return '';
    else if (0 === url.indexOf('https://'))       return url;
    else if (0 === url.indexOf('http://'))        return url;
    else if (0 === url.indexOf('//'))             return `https:${url}`;
    else if (0 === url.indexOf('soundcloud.com')) return `https://${url}`;
    else if (0 === url.indexOf('/'))              return `https://soundcloud.com${url}`;
    else                                          return `https://soundcloud.com/${url}`;
};

const fetchUserTracks = async (user:SC_User):Promise<SC_Track[]> => {
    return await SC.get(`/users/${user.id}/tracks`);
};

export const fetchTracks = async (url:string=''):Promise<SC_Track[]> => {
    url = restoreUrl(url);
    if (!url.length) return;
    if (url.indexOf('?q=') !== -1) return searchTracks(url);
    try {
        events.emit('loadchange', true);
        const resource:SC_Resource = await SC.resolve(url);
        const type = resource && resource.kind;
        let tracks:SC_Track[];
        switch (type) {
            case 'track': tracks = [(resource as SC_Track)]; break;
            case 'playlist': tracks = (resource as SC_Set).tracks; break;
            case 'user': tracks = await fetchUserTracks(resource as SC_User); break;
            default: throw new Error(
                `Unhandled resource type "${type}", can only handle:\n`
                + `    - tracks\n`
                + `    - albums\n`
                + `    - artists\n`
                + `    - playlists\n`
            );
        }
        setTimeout(() => events.emit('loadchange', false), 10);
        return tracks;
    } catch (e) {
        const prefix = `Unable to fetch resource`;
        const message = e && e.message || e;
        alert(`${prefix}\n\nURL = ${url}\n\nError = ${message}`);
        events.emit('loadchange', false);
        throw e;
    }
};

const searchTracks = async (url:string):Promise<SC_Track[]> => {
    const q = url.slice(url.indexOf('?q='));
    try {
        events.emit('loadchange', true);
        const tracks = await SC.get('/tracks', {q, limit: 200});
        setTimeout(() => events.emit('loadchange', false), 1);
        console.log(tracks);
        return tracks;
    } catch (e) {
        events.emit('loadchange', false);
        const prefix = `Unable to complete query`;
        const message = e && e.message || e;
        alert(`${prefix}\n\Query = ${q}\n\nError = ${message}`);
        events.emit('loadchange', false);
        throw e;
    }
};

SC.initialize({client_id});
