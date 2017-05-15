import * as React from 'react';
import * as scroll from 'scroll';

import {fetchTracks} from 'src/singletons/sc';
import {setTracks, playTrack} from 'src/singletons/playlist';

interface Props {
    input:string;
}

interface State {
    input:string;
    isLoading:boolean;
}

export default class UrlLoader extends React.Component<Props, State> {
    private handleInput:{(e:React.ChangeEvent<HTMLInputElement>):void};
    private handleSubmit:{(e:React.FormEvent<HTMLFormElement>):void};

    constructor(props:Props) {
        super(props);
        this.state = {
            input: props.input || '',
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

    componentDidMount() {
        // fresh mount: fetch URL if we already got one in state
        if (this.state.input.length) this.fetchInput(this.state.input);
    }

    private fetchInput(url=''):Promise<boolean> {
        url = url.trim();
        return new Promise((resolve) => {
            if (!url.length) return resolve(false);
            if (this.state.isLoading) return resolve(false);
            this.setState({isLoading: true}, () => {
                fetchTracks(url)
                    .then((tracks) => {
                        window.location.replace(`#${url}`);
                        scroll.top(document.body, 0);
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
}
