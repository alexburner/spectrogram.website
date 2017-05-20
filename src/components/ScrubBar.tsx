

// subscribe to audio object:
// -- progress
// -- timeupdate

// report audio properties:
// -- duration:number
// -- currentTime:number
// -- buffered:TimeRanges


// subscribe to playlist events:
// -- trackchange

// report playlist properties:
// -- current track waveform







//
// TODO
//
// playlist events:
// -- playpause
// -- trackchange
//
// using
//  https://github.com/primus/eventemitter3
//
// externally
//  playlist.events.on('playpause', (playing) => {});
//  playlist.events.on('trackchange', (track) => {}); // for Bar
//  playlist.events.on('listchange', (tracks) => {});
//  playlist.events.on('any', _.debounce(() => {}));  // for Table
//
// internally
//  events.emit('playpause', isPlaying);
//  events.emit('trackchange', tracks[currentIndex]);
//  events.emit('listchange', tracks);
//  events.emit('anychange');
//
//
//
// hm
//
// class Events extends EventsEmitter {
//     emit() {
//        super(arguments);
//        this.emit('any');
//     }
// }
//
// export const events = new Events();
//
// ?
//






