/**
 * Socket client-side functionality.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

let Breakout = require('./games/Breakout.js');

// Constants:
const CONNECT_ERROR = 'Error connecting to socket.io.',
    RECONNECT_FAILURE = 'Failing to reconnect to socket.io. Giving up!';

/**
 * Socket constructor.
 * @constructor
 */
function Socket() {

    this.socket = io({
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 5
    });

    this.startUp();
}

/**
 * Starts Socket functionality.
 */
Socket.prototype.startUp = function() {

    this.socket.on('connect_error', () => {
        console.warn(`${CONNECT_ERROR}`);
    });
    this.socket.on('reconnect_failed', () =>  {
        console.error(`${RECONNECT_FAILURE}`);
    });
    this.socket.on('breakout', () =>  {
        new Breakout();
    });
};

module.exports = Socket;