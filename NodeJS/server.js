const logEvents = require('./logEvents')

const Emitter = require('events');
//Create Custom Emitter:
class Emitter extends Emitter{};
//A custom emitter class extends the base EventEmitter class from the events module.

//initializing object
const myEmitter = new Emitter();

//add listener for the log event
myEmitter.on('logs', (msg) => {logEvents(msg)});

setTimeout(() => {
    //emit event
    myEmitter.emit('logs', 'log event emitted')
}, 200);

