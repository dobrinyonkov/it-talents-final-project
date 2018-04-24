var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var session = require('express-session');
var jwt = require("jsonwebtoken");

//database configuration
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://heroku_nf9l5q4b:2618qlen71ent4qhgcpug2522a@ds247619.mlab.com:47619/heroku_nf9l5q4b');

var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var postsRouter = require('./routes/posts');
// var addPostRouter = require('./routes/addPost');
var app = express();

function ensureAuthorized(req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.send(403);
  }
}


  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });

  // app.use(session({
  //   secret: 'keyboard cat',
  //   resave: false,
  //   saveUninitialized: true,
  // }));

  //vkarava mu bazata
  app.use(function (req, res, next) {
    req.db = db;
    next();
  })
  //da sa vijda dali bachka
  //users
  app.use('/api/users', ensureAuthorized, usersRouter);
  app.use('/api/login', loginRouter);
  app.use('/api/signup', signupRouter);
  //posts
  app.use('/api/posts', ensureAuthorized, postsRouter);
  //add post test page
  // app.use('/addPost', addPostRouter);



  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
