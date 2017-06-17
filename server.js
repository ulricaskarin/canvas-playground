/**
 * Server.js - Starting point.
 *
 * @author Ulrica Skarin
 * @version 1.0.0
 */

'use strict';

const express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    exphbs = require('express-handlebars'),
    config = require('./config.js'),
    exhbsHelper = require('./_lib/exhbsHelper.js');

let server = {};
let app = express();
let PORT = config.PORT || 3366;

app.set('views', path.join(__dirname, '/views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'default',
    layoutsDir:  __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: '.hbs',
    helpers: exhbsHelper
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

if(!module.parent) {
    server = http.createServer(app).listen(PORT, () => {
        console.log(`Games served at: ${PORT} in ${app.settings.env} mode`);
    });
}

const io = require('socket.io')(server);
app.use((req, res, next) => {
    req.io = io;
    next();
});

const appServer = require('./routes/index');
app.use('/', appServer);

let ConnectIO = require('./controllers/ConnectIO.js');
new ConnectIO(io);

module.exports = {
    app : app
};