var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config/config');
var routes = require('./routes/metadata');
var users = require('./routes/user');
var stats = require('./routes/stats');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(function(req, res, next) {
    if ([config.apiKeys.xboxLiveAPIKey, config.apiKeys.h5APIKey].indexOf(req.headers['x-api-key']) === -1) {
        var err = new Error('Unauthorized request.');
        err.status = 500;
        next(err);
    }
    next();
});

app.use('/metadata', routes);
app.use('/user', users);
app.use('/stats', stats);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
