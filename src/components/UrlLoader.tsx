import * as React from 'react';

import * as soundcloud from 'src/singletons/soundcloud';

interface State {
    input:string;
    isLoading:boolean;
}

export default class UrlLoader extends React.Component<undefined, State> {
    private handleChange:{(e:React.ChangeEvent<HTMLInputElement>):void};
    private handleSubmit:{(e:React.FormEvent<HTMLFormElement>):void};
    private inputEl:HTMLElement;

    constructor() {
        super();
        this.state = {
            input: '',
            isLoading: false,
        };
        this.handleChange = (e) => {
            e.preventDefault();
            this.setState({input: e.target.value});
        };
        this.handleSubmit = (e) => {
            e.preventDefault();
            const url = this.state.input.trim();
            window.location.assign(`#${url}`);
            this.setState({input: ''});
            this.inputEl.blur();
        };
    }

    render() {
        return (
            <form
                className="url-loader"
                onSubmit={this.handleSubmit}
            >
                <input
                    ref={el => this.inputEl = el}
                    type="text"
                    placeholder="Paste a soundcloud URL..."
                    onChange={this.handleChange}
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
        soundcloud.events.on('loadchange', (isLoading:boolean) => {
            this.setState({isLoading});
        });
    }
}
