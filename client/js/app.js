/**
 * App.js - sets of client-side JS functionality.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

let BreakOut = require('./games/Breakout.js');

(function start() {

    new BreakOut();

    if (localStorage) {

        if(localStorage.getItem('highscore')){

            // Highscore handling etc.
        }
    }
})();