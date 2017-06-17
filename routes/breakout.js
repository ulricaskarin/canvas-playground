/**
 * Breakout route.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();

/**
 * Breakout Route.
 */
router.route('/breakout')
    .get((req, res, next) => {

        res.render('home/breakout');

        setTimeout(() => {
            req.io.emit('breakout');
        }, 1200);
    });

module.exports = router;