/**
 * Index route.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.render('home/index');
});


/**
 * Error Handling.
 */
router.use((req, res, next) => {
    res.status(404).render('error/404');
});
router.use((err, req, res, next) => {
    if (err.statusCode !== 400) {
        return next(err);
    }
    res.status(400).render('error/400');
});
router.use((err, req, res, next) =>  {
    if (err.status !== 403) {
        return next(err);
    }
    res.status(403).render('error/403');
});
router.use((err, req, res, next) =>  {
    if (err.status !== 500) {
        return next(err);
    }
    res.status(500).render('error/500');
});

module.exports = router;