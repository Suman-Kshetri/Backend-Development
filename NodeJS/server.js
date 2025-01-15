const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents')
const Emitter = require('events');
//Create Custom Emitter:
class Emitter extends Emitter{};
//A custom emitter class extends the base EventEmitter class from the events module.

//initializing object
const myEmitter = new Emitter();

//add listener for the log event
// myEmitter.on('logs', (msg) => {logEvents(msg)});
// myEmitter.emit('logs', 'log event emitted')


