import * as React from 'react';
import * as throttle from 'lodash.throttle';

import {audio} from 'src/singletons/audio';
import * as playlist from 'src/singletons/playlist';

interface State {
    currentTime:number;
    duration:number;
    trackCount:number;
    waveform:string;
}

export default class SeekBar extends React.Component<undefined, State> {
    private onMouseDown:{(e:React.MouseEvent<HTMLElement>):void};
    private onMouseMove:{(e:MouseEvent):void};
    private onMouseUp:{(e:MouseEvent):void};

    constructor() {
        super();
        const tracks = playlist.getTracks();
        const track = playlist.getCurrentTrack() || tracks[0];
        this.state = {
            currentTime: audio.currentTime || 0,
            duration: audio.duration || 0,
            trackCount: tracks.length,
            waveform: track && track.waveform_url,
        };
        {
            let isMouseDown = false;
            let targetLeft = null;
            let targetWidth = null;
            const seek = throttle((pageX:number) => {
                const duration = this.state.duration;
                if (!duration) return;
                const left = Math.max((pageX - targetLeft) / targetWidth, 0);
                const time = Math.min(left * duration, duration);
                audio.currentTime = time;
            }, 100, {leading: false});
            this.onMouseDown = (e) => {
                isMouseDown = true;
                e.preventDefault();
                e.stopPropagation();
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                targetLeft = rect.left;
                targetWidth = rect.width;
                seek(e.pageX);
            };
            this.onMouseMove = (e) => {
                if (!isMouseDown) return;
                e.preventDefault();
                e.stopPropagation();
                seek(e.pageX);
            };
            this.onMouseUp = (e) => {
                if (!isMouseDown) return;
                isMouseDown = false;
                e.preventDefault();
                e.stopPropagation();
                seek(e.pageX);
            };
        }
    }

    render() {
        if (!this.state.trackCount) return null;
        const height = 24;
        const paddingX = 3;
        const paddingY = 0;
        const thickness = 1;
        const progress = this.state.duration
            ? this.state.currentTime / this.state.duration
            : 0;
        return (
            <div
                onMouseDown={this.onMouseDown}
                style={{
                    position: 'relative',
                    height: `${height + thickness}px`,
                    margin: '14px 6px',
                    cursor: 'pointer',
                }}
            >
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}>
                    {this.state.waveform &&
                        <div
                            style={{
                                position: 'absolute',
                                top: `${paddingY + thickness}px`,
                                left: 0,
                                right: 0,
                                bottom: `${paddingY + thickness}px`,
                                background: '#DDD',
                            }}
                        >
                            <img
                                src={this.state.waveform}
                                width="100%"
                                height="100%"
                                style={{
                                    filter: 'brightness(2)',
                                    transform: 'perspective(1px)',
                                }}
                            />
                        </div>
                    }
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: `${thickness}px`,
                        top: `calc(50% - ${thickness}px)`,
                        zIndex: 1,
                        background: '#000',
                        opacity: 1/2
                    }}></div>
                    {this.state.duration > 0 &&
                        <div style={{
                            position: 'absolute',
                            width: `${paddingX * 2 + 1}px`,
                            height: '100%',
                            left: `calc(${progress * 100}% - ${paddingX}px)`,
                            zIndex: 2,
                            border: `${thickness}px solid #000`,
                            opacity: 1/2,
                        }}></div>
                    }
                </div>
            </div>
        );
    }

    componentDidMount() {
        playlist.events.on('trackchange', (track:playlist.Track) => {
            track = track || playlist.getTracks()[0];
            this.setState({waveform: track && track.waveform_url});
        });
        playlist.events.on('listchange', (tracks:playlist.Track[]) => {
            const track = playlist.getCurrentTrack() || tracks[0];
            this.setState({
                trackCount: tracks.length,
                waveform: track && track.waveform_url,
            });
        });
        document.body.addEventListener('mousemove', this.onMouseMove);
        document.body.addEventListener('mouseup', this.onMouseUp);
        const updateTimes = () => {
            window.requestAnimationFrame(updateTimes);
            this.setState({
                currentTime: audio.currentTime || 0,
                duration: audio.duration || 0,
            });
        };
        updateTimes();
    }
}
