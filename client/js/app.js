/**
 * App.js - sets of client-side JS functionality.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

let Socket = require('./Socket.js');

(function start() {

    try{
        new Socket();

        if (localStorage) {

            if(localStorage.getItem('highscore')){

                // Highscore handling etc.
            }
        }
    } catch (e) {
        console.log(`${e}`);
    }
})();