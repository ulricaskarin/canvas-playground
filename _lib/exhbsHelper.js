/**
 * Handlebars Helpers.
 */

'use strict';

function equal(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }

    return options.inverse(this);
}

function notEqual(v1, v2, options) {
    if (v1 !== v2) {
        return options.fn(this);
    }

    return options.inverse(this);
}

module.exports = {
    equal : equal,
    notEqual : notEqual
};