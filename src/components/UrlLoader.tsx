import * as React from 'react';
import * as scroll from 'scroll';

import {loadUrl} from 'src/singletons/sc';
import {setTracks} from 'src/singletons/playlist';

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
            window.location.hash.length &&
            window.location.hash.slice(1)
        );
        this.state = {
            input: hash && hash.length ? hash : '',
            isLoading: false,
        };
        this.handleInput = (e) => {
            e.preventDefault();
            this.setState({input: e.target.value});
        };
        this.handleSubmit = (e) => {
            e.preventDefault();
            this.load(this.state.input);
        };
    }

    private load(url='') {
        url = url.trim();
        if (!url.length) return;
        if (this.state.isLoading) return;
        this.setState({isLoading: true}, () => {
            loadUrl(url)
                .then((tracks) => {
                    window.location.replace(`#${url}`);
                    scroll.top(document.body, 0);
                    setTracks(tracks);
                })
                .catch((e) => console.error(e))
                .then(() => this.setState({isLoading: false, input:''}));
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
                    placeholder="Paste a soundcloud track, album, or playlist URL..."
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
        // did page load with url in hash?
        if (this.state.input.length) this.load(this.state.input);
    }
}
