/**
 * IO Connection - Init Socket server-side functionality.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

/**
 * Constructor ConnectIO
 * @param io
 * @returns {ConnectIO}
 * @constructor
 */
function ConnectIO(io) {

    if (!(this instanceof ConnectIO)) {
        return new ConnectIO(io);
    }

    this.io = io;
    this.run();
}

/**
 * Run ConnectIO.
 */
ConnectIO.prototype.run = function() {

    console.log('ConnectIO is Running...');

    this.io.on('connection', (socket) => {
        console.log('connected...')
        socket.on('disconnect', () =>{
        });
    });
};
module.exports = ConnectIO;