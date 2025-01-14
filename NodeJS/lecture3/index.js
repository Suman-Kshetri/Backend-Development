const logEvents = require('./logEvents')

const eventEmitter = require('events');
//Create Custom Emitter:
class Emitter extends eventEmitter{};
//A custom emitter class extends the base EventEmitter class from the events module.

//initializing object
const myEmitter = new Emitter();

//add listener for the log event
myEmitter.on('logs', (msg) => {logEvents(msg)});
//The logEvents function is a custom utility that logs messages to a file, along with a timestamp and a unique identifier

setTimeout(() => {
    //emit event
    myEmitter.emit('logs', 'log event emitted')
}, 200);
// What happens here:
// The on method sets up a listener for the logs event.
// When the logs event is emitted, the listener's callback is executed.
// The callback (msg) => { logEvents(msg) } receives the event data passed during the emission (i.e., 'log event emitted').
// The logEvents function is called with 'log event emitted' as its argument.