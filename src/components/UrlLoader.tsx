import * as React from 'react';

import {fetchTracks} from 'src/singletons/sc';
import {setTracks, playTrack} from 'src/singletons/playlist';
import scroll from 'src/singletons/scroll';

interface State {
    input:string;
    isLoading:boolean;
}

export default class UrlLoader extends React.Component<undefined, State> {
    private handleInput:{(e:React.ChangeEvent<HTMLInputElement>):void};
    private handleSubmit:{(e:React.FormEvent<HTMLFormElement>):void};

    constructor() {
        super();
        const hash = (
            window.location.hash &&
            window.location.hash.length > 1 &&
            window.location.hash.slice(1)
        );
        this.state = {
            input: hash || '',
            isLoading: false,
        };
        this.handleInput = (e) => {
            e.preventDefault();
            this.setState({input: e.target.value});
        };
        this.handleSubmit = (e) => {
            e.preventDefault();
            this.fetchInput(this.state.input).then((didFetch) => {
                if (didFetch) playTrack(0);
            });
        };
    }

    private fetchInput(url=''):Promise<boolean> {
        url = url.trim();
        return new Promise((resolve) => {
            if (!url.length) return resolve(false);
            if (this.state.isLoading) return resolve(false);
            this.setState({isLoading: true}, () => {
                fetchTracks(url)
                    .then((tracks) => {
                        scroll();
                        window.location.replace(`#${url}`);
                        setTracks(tracks);
                        resolve(true);
                    })
                    .catch((e) => {
                        console.error(e);
                        resolve(false);
                    })
                    .then(() => this.setState({
                        isLoading: false,
                        input:''
                    }));
            });
        });
    }

    render() {
        return (
            <form
                className="url-loader"
                onSubmit={this.handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Paste a soundcloud URL..."
                    onChange={this.handleInput}
                    value={this.state.input}
                />
                {this.state.isLoading
                    ? <button type="submit" disabled>Loading...</button>
                    : <button type="submit">Load</button>
                }
            </form>
        );
    }

    componentDidMount() {
        // fresh mount, fetch URL if we already got one in state
        if (this.state.input.length) this.fetchInput(this.state.input);
    }
}
